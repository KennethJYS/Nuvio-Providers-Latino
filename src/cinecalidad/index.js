import axios from 'axios';
import { resolve as resolveGoodStream } from '../resolvers/goodstream.js';
import { resolve as resolveVoe } from '../resolvers/voe.js';
import { resolve as resolveFilemoon } from '../resolvers/filemoon.js';
import { resolve as resolveHlswish } from '../resolvers/hlswish.js';
import { resolve as resolveVimeos } from '../resolvers/vimeos.js';

// ============================================================================
// CONFIGURACIÓN
// ============================================================================
const TMDB_API_KEY = '439c478a771f35c05022f9feabcca01c';
const HOST = 'https://www.cinecalidad.vg';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
const HEADERS = {
  'User-Agent': UA,
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'es-MX,es;q=0.9',
  'Connection': 'keep-alive',
  'Upgrade-Insecure-Requests': '1',
  'Referer': 'https://www.cinecalidad.vg/',
};

const RESOLVERS = {
  'goodstream.one': resolveGoodStream,
  'hlswish.com':    resolveHlswish,
  'streamwish.com': resolveHlswish,
  'streamwish.to':  resolveHlswish,
  'strwish.com':    resolveHlswish,
  'voe.sx':         resolveVoe,
  'filemoon.sx':    resolveFilemoon,
  'filemoon.to':    resolveFilemoon,
  'vimeos.net':     resolveVimeos,
};

// ============================================================================
// UTILIDADES
// ============================================================================
const normalizeText = (text) =>
  text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();

const calculateSimilarity = (str1, str2) => {
  const s1 = normalizeText(str1);
  const s2 = normalizeText(str2);
  if (s1 === s2) return 1.0;
  if (s1.includes(s2) || s2.includes(s1)) return 0.8;
  const words1 = new Set(s1.split(/\s+/));
  const words2 = new Set(s2.split(/\s+/));
  const intersection = [...words1].filter(w => words2.has(w));
  return intersection.length / Math.max(words1.size, words2.size);
};

const getServerName = (url) => {
  if (url.includes('goodstream'))  return 'GoodStream';
  if (url.includes('hlswish') || url.includes('streamwish') || url.includes('strwish')) return 'StreamWish';
  if (url.includes('voe.sx'))      return 'VOE';
  if (url.includes('filemoon'))    return 'Filemoon';
  if (url.includes('vimeos'))      return 'Vimeos';
  return 'Online';
};

const getResolver = (url) => {
  if (!url || !url.startsWith('http')) return null;
  for (const pattern in RESOLVERS) {
    if (url.includes(pattern)) return RESOLVERS[pattern];
  }
  return null;
};

function b64decode(str) {
  try {
    if (typeof atob !== 'undefined') return atob(str);
    return Buffer.from(str, 'base64').toString('utf8');
  } catch (e) { return null; }
}

// Extrae texto entre dos strings
function between(str, start, end) {
  const si = str.indexOf(start);
  if (si === -1) return '';
  const ei = str.indexOf(end, si + start.length);
  if (ei === -1) return '';
  return str.substring(si + start.length, ei);
}

// ============================================================================
// TMDB
// ============================================================================
async function getTmdbData(tmdbId, mediaType) {
  const attempts = [
    { lang: 'es-MX', name: 'Latino' },
    { lang: 'es-ES', name: 'España' },
    { lang: 'en-US', name: 'Inglés' },
  ];

  for (const { lang, name } of attempts) {
    try {
      const url = `https://api.themoviedb.org/3/${mediaType}/${tmdbId}?api_key=${TMDB_API_KEY}&language=${lang}`;
      const { data } = await axios.get(url, { timeout: 5000 });
      const title = mediaType === 'movie' ? data.title : data.name;
      const originalTitle = mediaType === 'movie' ? data.original_title : data.original_name;
      if (!title) continue;
      if (lang === 'es-MX' && /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]/.test(title)) continue;
      console.log(`[CineCalidad] TMDB (${name}): "${title}"${title !== originalTitle ? ` | Original: "${originalTitle}"` : ''}`);
      return {
        title,
        originalTitle,
        year: (data.release_date || data.first_air_date || '').substring(0, 4),
      };
    } catch (e) {
      console.log(`[CineCalidad] Error TMDB ${name}: ${e.message}`);
    }
  }
  return null;
}

// ============================================================================
// SLUG → URL (método principal)
// ============================================================================
function buildSlug(title) {
  return title
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // quitar tildes
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')                     // solo alfanumérico
    .replace(/\s+/g, '-')                              // espacios → guiones
    .replace(/-+/g, '-')                               // guiones dobles → uno
    .replace(/^-|-$/g, '');                            // quitar guiones inicio/fin
}

// Extrae el año del H1: "Interestelar (2014)"
function extractYearFromHtml(html) {
  const match = html.match(/<h1[^>]*>[^<]*\((\d{4})\)[^<]*<\/h1>/);
  return match ? match[1] : null;
}

// Intenta obtener la URL de la película por slug, verificando el año
async function getMovieUrl(slug, expectedYear) {
  const slugsToTry = [slug, `${slug}-2`, `${slug}-3`];
  for (const s of slugsToTry) {
    const url = `${HOST}/pelicula/${s}/`;
    try {
      const { data: html } = await axios.get(url, {
        timeout: 8000,
        headers: HEADERS,
        validateStatus: status => status === 200,
      });
      const year = extractYearFromHtml(html);
      if (!year || !expectedYear || year === expectedYear) {
        console.log(`[CineCalidad] ✓ Slug directo: /pelicula/${s}/ (${year || '?'})`);
        return url;
      }
      console.log(`[CineCalidad] Año no coincide: esperado ${expectedYear}, encontrado ${year} en /pelicula/${s}/`);
    } catch {
      // 404 o error → probar siguiente variante
    }
  }
  return null;
}

// ============================================================================
// OBTENER EMBEDS DE LA PÁGINA DE LA PELÍCULA
// ============================================================================

// Dominios que ya son embeds finales — no necesitan fetch intermedio
const KNOWN_EMBED_DOMAINS = [
  'goodstream.one', 'voe.sx', 'filemoon.sx', 'filemoon.to',
  'hlswish.com', 'streamwish.com', 'streamwish.to', 'strwish.com',
  'vimeos.net',
];

function isKnownEmbed(url) {
  return KNOWN_EMBED_DOMAINS.some(d => url.includes(d));
}

async function getEmbedUrls(movieUrl) {
  try {
    const { data } = await axios.get(movieUrl, { timeout: 8000, headers: HEADERS });

    // Solo data-src = links de "Ver Online". data-url = descargas, los ignoramos.
    const embedLinks = [];
    const regex = /data-src="([A-Za-z0-9+/=]{20,})"/g;
    let match;
    while ((match = regex.exec(data)) !== null) embedLinks.push(match[1]);

    const decodedUrls = [...new Set(
      embedLinks
        .map(b64 => b64decode(b64))
        .filter(url => url && url.startsWith('http'))
    )];

    // Separar: los conocidos van directo, los desconocidos necesitan fetch intermedio
    const directEmbeds = decodedUrls.filter(isKnownEmbed);
    const intermediateUrls = decodedUrls.filter(u => !isKnownEmbed(u));

    console.log(`[CineCalidad] ${directEmbeds.length} embeds directos, ${intermediateUrls.length} intermedios`);

    const embedUrls = new Set(directEmbeds);

    if (intermediateUrls.length > 0) {
      await Promise.allSettled(intermediateUrls.map(async (decoded) => {
        try {
          const { data: midData } = await axios.get(decoded, {
            timeout: 6000, headers: HEADERS, maxRedirects: 5,
          });

          let finalUrl = '';
          const btnMatch = midData.match(/id="btn_enlace"[^>]*>[\s\S]*?href="([^"]+)"/);
          if (btnMatch) finalUrl = btnMatch[1];
          if (!finalUrl) {
            const iframeMatch = midData.match(/<iframe[^>]+src="([^"]+)"/);
            if (iframeMatch) finalUrl = iframeMatch[1];
          }
          if (!finalUrl && decoded.includes('/e/')) finalUrl = decoded;
          if (finalUrl && finalUrl.startsWith('http')) embedUrls.add(finalUrl);
        } catch (e) {}
      }));
    }

    return [...embedUrls];
  } catch (e) {
    console.log(`[CineCalidad] Error obteniendo embeds: ${e.message}`);
    return [];
  }
}

// ============================================================================
// RESOLUCIÓN DE EMBEDS
// ============================================================================
async function processEmbed(embedUrl) {
  try {
    const resolver = getResolver(embedUrl);
    if (!resolver) {
      console.log(`[CineCalidad] Sin resolver para: ${embedUrl.substring(0, 60)}`);
      return null;
    }

    const serverName = getServerName(embedUrl);

    const result = await resolver(embedUrl);
    if (!result || !result.url) return null;

    return {
      name: 'CineCalidad',
      title: `1080p · ${serverName}`,
      url: result.url,
      quality: '1080p',
      headers: result.headers || {},
    };
  } catch (e) {
    return null;
  }
}

// ============================================================================
// FUNCIÓN PRINCIPAL EXPORTADA
// ============================================================================
export async function getStreams(tmdbId, mediaType, season, episode) {
  if (!tmdbId || !mediaType) return [];

  const startTime = Date.now();
  console.log(`[CineCalidad] Buscando: TMDB ${tmdbId} (${mediaType})${season ? ` S${season}E${episode}` : ''}`);

  // CineCalidad no tiene series con episodios individuales en su estructura habitual
  // Solo soporta películas por ahora
  if (mediaType === 'tv') {
    console.log('[CineCalidad] Series no soportadas aún');
    return [];
  }

  try {
    // 1. Datos TMDB
    const tmdbInfo = await getTmdbData(tmdbId, mediaType);
    if (!tmdbInfo) return [];

    // 2. Buscar por slug directo
    const slug = buildSlug(tmdbInfo.title);
    const movieUrl = await getMovieUrl(slug, tmdbInfo.year);

    let selectedUrl = movieUrl;
    if (!selectedUrl && tmdbInfo.originalTitle && tmdbInfo.originalTitle !== tmdbInfo.title) {
      const altSlug = buildSlug(tmdbInfo.originalTitle);
      selectedUrl = await getMovieUrl(altSlug, tmdbInfo.year);
    }
    if (!selectedUrl) {
      console.log('[CineCalidad] No encontrado por slug');
      return [];
    }

    // 3. Obtener embeds
    const embedUrls = await getEmbedUrls(selectedUrl);
    if (embedUrls.length === 0) {
      console.log('[CineCalidad] No se encontraron embeds');
      return [];
    }

    console.log(`[CineCalidad] Resolviendo ${embedUrls.length} embeds...`);

    // 4. Resolver todos en paralelo con timeout global
    const RESOLVER_TIMEOUT = 5000;
    const uniqueEmbeds = [...new Set(embedUrls)];
    const streams = await new Promise((resolve) => {
      const results = [];
      let completed = 0;
      const total = uniqueEmbeds.length;
      const finish = () => resolve(results.filter(Boolean));
      const timer = setTimeout(finish, RESOLVER_TIMEOUT);

      uniqueEmbeds.forEach(url => {
        processEmbed(url).then(result => {
          if (result) results.push(result);
          completed++;
          if (completed === total) { clearTimeout(timer); finish(); }
        }).catch(() => {
          completed++;
          if (completed === total) { clearTimeout(timer); finish(); }
        });
      });
    });

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`[CineCalidad] ✓ ${streams.length} streams en ${elapsed}s`);

    return streams;
  } catch (e) {
    console.log(`[CineCalidad] Error: ${e.message}`);
    return [];
  }
}