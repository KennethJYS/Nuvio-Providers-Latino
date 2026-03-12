// src/lamovie/index.js
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
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';
const HEADERS = { 'User-Agent': UA, 'Accept': 'application/json' };
const BASE_URL = 'https://la.movie';

// Países de origen que LaMovie considera anime
const ANIME_COUNTRIES = ['JP', 'CN', 'KR'];

// Género animación en TMDB
const GENRE_ANIMATION = 16;

// Servidores soportados y sus resolvers
const RESOLVERS = {
  'goodstream.one': resolveGoodStream,
  'hlswish.com': resolveHlswish,
  'streamwish.com': resolveHlswish,
  'streamwish.to': resolveHlswish,
  'strwish.com': resolveHlswish,
  'voe.sx': resolveVoe,
  'filemoon.sx': resolveFilemoon,
  'filemoon.to': resolveFilemoon,
  'vimeos.net': resolveVimeos,
};

const IGNORED_HOSTS = [];

// ============================================================================
// UTILIDADES
// ============================================================================
const normalizeText = (text) =>
  text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();

const calculateSimilarity = (str1, str2) => {
  const s1 = normalizeText(str1).replace(/\s*\(\d{4}\)\s*$/, '').trim();
  const s2 = normalizeText(str2).replace(/\s*\(\d{4}\)\s*$/, '').trim();
  if (s1 === s2) return 1.0;
  if (s1.includes(s2) || s2.includes(s1)) {
    const lenRatio = Math.min(s1.length, s2.length) / Math.max(s1.length, s2.length);
    return 0.8 * lenRatio;
  }
  const words1 = new Set(s1.split(/\s+/));
  const words2 = new Set(s2.split(/\s+/));
  const intersection = [...words1].filter(w => words2.has(w));
  return intersection.length / Math.max(words1.size, words2.size);
};

const normalizeQuality = (quality) => {
  const str = quality.toString().toLowerCase();
  const match = str.match(/(\d+)/);
  if (match) return `${match[1]}p`;
  if (str.includes('4k') || str.includes('uhd')) return '2160p';
  if (str.includes('full') || str.includes('fhd')) return '1080p';
  if (str.includes('hd')) return '720p';
  return 'SD';
};

const getServerName = (url) => {
  if (url.includes('goodstream')) return 'GoodStream';
  if (url.includes('hlswish') || url.includes('streamwish')) return 'StreamWish';
  if (url.includes('voe.sx')) return 'VOE';
  if (url.includes('filemoon')) return 'Filemoon';
  if (url.includes('vimeos.net')) return 'Vimeos';
  return 'Online';
};

const getResolver = (url) => {
  try {
    if (IGNORED_HOSTS.some(h => url.includes(h))) return null;
    for (const [pattern, resolver] of Object.entries(RESOLVERS)) {
      if (url.includes(pattern)) return resolver;
    }
  } catch (e) {}
  return null;
};

// Convierte un título a slug estilo LaMovie
// "The Walking Dead" (2010) → "the-walking-dead-2010"
function buildSlug(title, year) {
  const slug = title
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')   // quitar tildes
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')     // quitar signos especiales
    .replace(/\s+/g, '-')              // espacios → guiones
    .replace(/-+/g, '-')               // guiones dobles → uno
    .replace(/^-|-$/g, '');            // quitar guiones inicio/fin
  return year ? `${slug}-${year}` : slug;
}

// Determina la categoría de LaMovie según tipo y datos TMDB
// Devuelve array de categorías a probar en orden
function getCategories(mediaType, genres, originCountries) {
  if (mediaType === 'movie') return ['peliculas'];

  const isAnimation = (genres || []).includes(GENRE_ANIMATION);
  if (!isAnimation) return ['series'];

  const isAnimeCountry = (originCountries || []).some(c => ANIME_COUNTRIES.includes(c));
  if (isAnimeCountry) return ['animes'];

  // Animación de otro país → probar ambas en paralelo
  return ['animes', 'series'];
}

// ============================================================================
// TMDB
// ============================================================================
async function getTmdbData(tmdbId, mediaType) {
  const attempts = [
    { lang: 'es-MX', name: 'Latino' },
    { lang: 'en-US', name: 'Inglés' },
  ];

  for (const { lang, name } of attempts) {
    try {
      const url = `https://api.themoviedb.org/3/${mediaType}/${tmdbId}?api_key=${TMDB_API_KEY}&language=${lang}`;
      const { data } = await axios.get(url, { timeout: 5000, headers: HEADERS });
      const title = mediaType === 'movie' ? data.title : data.name;
      const originalTitle = mediaType === 'movie' ? data.original_title : data.original_name;

      if (lang === 'es-MX' && /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]/.test(title)) continue;

      console.log(`[LaMovie] TMDB (${name}): "${title}"${title !== originalTitle ? ` | Original: "${originalTitle}"` : ''}`);
      return {
        title,
        originalTitle,
        year: (data.release_date || data.first_air_date || '').substring(0, 4),
        genres: (data.genres || []).map(g => g.id),
        originCountries: data.origin_country || data.production_countries?.map(c => c.iso_3166_1) || [],
      };
    } catch (e) {
      console.log(`[LaMovie] Error TMDB ${name}: ${e.message}`);
    }
  }
  return null;
}

// Headers que pasan el filtro de Cloudflare de LaMovie
const HTML_HEADERS = {
  'User-Agent': UA,
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'es-MX,es;q=0.9',
  'Connection': 'keep-alive',
  'Upgrade-Insecure-Requests': '1',
};

// ============================================================================
// SLUG → ID (método principal)
// ============================================================================

// Extrae el _id del shortlink en el HTML: <link rel='shortlink' href='https://la.movie/?p=16439' />
function extractIdFromHtml(html) {
  const match = html.match(/rel=['"]shortlink['"]\s+href=['"][^'"]*\?p=(\d+)['"]/);
  return match ? match[1] : null;
}

// Intenta obtener el _id de LaMovie directamente por slug
async function getIdBySlug(category, slug) {
  const url = `${BASE_URL}/${category}/${slug}/`;
  try {
    const { data: html } = await axios.get(url, {
      timeout: 8000,
      headers: HTML_HEADERS,
      validateStatus: s => s === 200,
    });
    const id = extractIdFromHtml(html);
    if (id) {
      console.log(`[LaMovie] ✓ Slug directo: /${category}/${slug} → id:${id}`);
      return { id };
    }
    return null;
  } catch {
    return null;
  }
}

// Busca el _id probando las categorías según tipo de contenido
async function findBySlug(tmdbInfo, mediaType) {
  const { title, originalTitle, year, genres, originCountries } = tmdbInfo;
  const categories = getCategories(mediaType, genres, originCountries);

  // Construir slugs a probar (título latino y título original)
  const slugs = [];
  if (title) slugs.push(buildSlug(title, year));
  if (originalTitle && originalTitle !== title) slugs.push(buildSlug(originalTitle, year));

  for (const slug of slugs) {
    if (categories.length === 1) {
      // Una sola categoría → fetch directo
      const result = await getIdBySlug(categories[0], slug);
      if (result) return result;
    } else {
      // Múltiples categorías → fetch en paralelo
      const results = await Promise.allSettled(
        categories.map(cat => getIdBySlug(cat, slug))
      );
      const found = results.find(r => r.status === 'fulfilled' && r.value);
      if (found) return found.value;
    }
  }
  return null;
}

// ============================================================================
// EPISODIOS
// ============================================================================
async function getEpisodeId(seriesId, seasonNum, episodeNum) {
  const url = `${BASE_URL}/wp-api/v1/single/episodes/list?_id=${seriesId}&season=${seasonNum}&page=1&postsPerPage=50`;
  try {
    const { data } = await axios.get(url, { timeout: 12000, headers: HEADERS });
    if (!data?.data?.posts) return null;
    const ep = data.data.posts.find(e => e.season_number == seasonNum && e.episode_number == episodeNum);
    return ep?._id || null;
  } catch (e) {
    console.log(`[LaMovie] Error episodios: ${e.message}`);
    return null;
  }
}

// ============================================================================
// RESOLUCIÓN DE EMBEDS
// ============================================================================
async function processEmbed(embed) {
  try {
    const resolver = getResolver(embed.url);
    if (!resolver) {
      console.log(`[LaMovie] Sin resolver para: ${embed.url}`);
      return null;
    }

    const result = await resolver(embed.url);
    if (!result || !result.url) return null;

    const quality = normalizeQuality(embed.quality || '1080p');
    const serverName = getServerName(embed.url);

    return {
      name: 'LaMovie',
      title: `${quality} · ${serverName}`,
      url: result.url,
      quality,
      headers: result.headers || {}
    };
  } catch (e) {
    console.log(`[LaMovie] Error procesando embed: ${e.message}`);
    return null;
  }
}

// ============================================================================
// FUNCIÓN PRINCIPAL EXPORTADA
// ============================================================================
export async function getStreams(tmdbId, mediaType, season, episode) {
  if (!tmdbId || !mediaType) return [];

  const startTime = Date.now();
  console.log(`[LaMovie] Buscando: TMDB ${tmdbId} (${mediaType})${season ? ` S${season}E${episode}` : ''}`);

  try {
    // 1. Obtener datos de TMDB
    const tmdbInfo = await getTmdbData(tmdbId, mediaType);
    if (!tmdbInfo) return [];

    // 2. Buscar por slug directo
    const found = await findBySlug(tmdbInfo, mediaType);
    if (!found) {
      console.log('[LaMovie] No encontrado por slug');
      return [];
    }

    let targetId = found.id;

    // 3. Para series, obtener ID de episodio
    if (mediaType === 'tv' && season && episode) {
      const epId = await getEpisodeId(targetId, season, episode);
      if (!epId) {
        console.log(`[LaMovie] Episodio S${season}E${episode} no encontrado`);
        return [];
      }
      targetId = epId;
    }

    // 4. Obtener enlaces
    const { data } = await axios.get(
      `${BASE_URL}/wp-api/v1/player?postId=${targetId}&demo=0`,
      { timeout: 6000, headers: HEADERS }
    );

    if (!data?.data?.embeds) {
      console.log('[LaMovie] No hay embeds disponibles');
      return [];
    }

    // 5. Resolver con timeout global
    const RESOLVER_TIMEOUT = 5000;
    const embedPromises = data.data.embeds.map(embed => processEmbed(embed));

    const streams = await new Promise((resolve) => {
      const results = [];
      let completed = 0;
      const total = embedPromises.length;
      const finish = () => resolve(results.filter(Boolean));
      const timer = setTimeout(finish, RESOLVER_TIMEOUT);

      embedPromises.forEach(p => {
        p.then(result => {
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
    console.log(`[LaMovie] ✓ ${streams.length} streams en ${elapsed}s`);

    return streams;
  } catch (e) {
    console.log(`[LaMovie] Error: ${e.message}`);
    return [];
  }
}