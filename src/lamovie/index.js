// src/lamovie/index.js
import axios from 'axios';
import { resolve as resolveGoodStream } from './resolvers/goodstream.js';
import { resolve as resolveVoe } from './resolvers/voe.js';
import { resolve as resolveFilemoon } from './resolvers/filemoon.js';
import { resolve as resolveHlswish } from './resolvers/hlswish.js';
import { resolve as resolveVimeos } from './resolvers/vimeos.js';

// ============================================================================
// CONFIGURACIÓN
// ============================================================================
const TMDB_API_KEY = '439c478a771f35c05022f9feabcca01c';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';
const HEADERS = { 'User-Agent': UA, 'Accept': 'application/json' };
const streamCache = new Map();
const CACHE_TTL = 10 * 60 * 1000; // 10 minutos

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

// Servidores ignorados (anti-bot fuerte, sin resolver viable)
const IGNORED_HOSTS = [];

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
    const host = new URL(url).hostname.replace('www.', '');
    if (IGNORED_HOSTS.some(h => url.includes(h))) return null;
    for (const [pattern, resolver] of Object.entries(RESOLVERS)) {
      if (url.includes(pattern)) return resolver;
    }
  } catch (e) {}
  return null;
};

// ============================================================================
// TMDB
// ============================================================================
async function getTmdbData(tmdbId, mediaType) {
  const attempts = [
    { lang: 'es-MX', name: 'Latino' },
    { lang: 'en-US', name: 'Inglés' },
    { lang: 'es-ES', name: 'España' }
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
      };
    } catch (e) {
      console.log(`[LaMovie] Error TMDB ${name}: ${e.message}`);
    }
  }
  return null;
}

// ============================================================================
// BÚSQUEDA EN LAMOVIE
// ============================================================================
function generateSearchVariants(tmdbInfo, mediaType) {
  const variants = new Set();
  const { title, originalTitle, year } = tmdbInfo;

  if (title) {
    variants.add(title.trim());
    const cleaned = title.replace(/[¿¡:;"']/g, '').replace(/\s+/g, ' ').trim();
    if (cleaned !== title) variants.add(cleaned);
  }

  if (originalTitle && originalTitle !== title &&
      !/[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]/.test(originalTitle)) {
    variants.add(originalTitle.trim());
  }

  if (mediaType === 'movie' && year) {
    const base = [...variants];
    base.forEach(v => {
      if (!v.includes(year)) {
        variants.add(`${v} ${year}`);
        variants.add(`${v} (${year})`);
      }
    });
  }

  [...variants].forEach(v => {
    const noArticle = v.replace(/^(el|la|los|las|the|a|an)\s+/i, '').trim();
    if (noArticle.length > 2) variants.add(noArticle);
  });

  return [...variants].slice(0, 8);
}

async function searchLamovie(query, mediaType) {
  const encodedQuery = encodeURIComponent(query.trim());
  const url = `https://la.movie/wp-api/v1/search?filter=%7B%7D&postType=any&q=${encodedQuery}&postsPerPage=10`;
  try {
    const { data } = await axios.get(url, { timeout: 8000, headers: HEADERS });
    if (!data?.data?.posts) return [];
    return data.data.posts.filter(item => {
      if (mediaType === 'movie') return item.type === 'movie' || item.type === 'movies';
      return item.type === 'tvshow' || item.type === 'tvshows' || item.type === 'series';
    });
  } catch (e) {
    return [];
  }
}

function selectBestResult(results, tmdbInfo) {
  if (results.length === 0) return null;
  if (results.length === 1) return results[0];

  const scored = results.map(result => {
    let score = calculateSimilarity(result.title || '', tmdbInfo.title) * 2;
    if (tmdbInfo.originalTitle) score += calculateSimilarity(result.title || '', tmdbInfo.originalTitle);
    if (tmdbInfo.year && result.year && result.year.toString() === tmdbInfo.year) score += 0.5;
    return { result, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored[0].result;
}

async function getEpisodeId(seriesId, seasonNum, episodeNum) {
  const url = `https://la.movie/wp-api/v1/single/episodes/list?_id=${seriesId}&season=${seasonNum}&page=1&postsPerPage=50`;
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
  const cacheKey = `${tmdbId}-${mediaType}-${season || ''}-${episode || ''}`;
  const cached = streamCache.get(cacheKey);
  if (cached && Date.now() - cached.ts < CACHE_TTL) {
    console.log(`[LaMovie] Cache hit: ${cacheKey}`);
    return cached.streams;
  }
  if (!tmdbId || !mediaType) return [];

  const startTime = Date.now();
  console.log(`[LaMovie] Buscando: TMDB ${tmdbId} (${mediaType})${season ? ` S${season}E${episode}` : ''}`);

  try {
    // 1. Obtener datos de TMDB
    const tmdbInfo = await getTmdbData(tmdbId, mediaType);
    if (!tmdbInfo) return [];

    // 2. Generar variantes y buscar en paralelo
    const variants = generateSearchVariants(tmdbInfo, mediaType);
    console.log(`[LaMovie] ${variants.length} variantes generadas`);

    const searchPromises = variants.slice(0, 3).map(async (v) => {
      const results = await searchLamovie(v, mediaType);
      return { variant: v, results };
    });

    const searchResults = await Promise.allSettled(searchPromises);

    let selected = null;
    for (const r of searchResults) {
      if (r.status === 'fulfilled' && r.value.results.length > 0) {
        selected = r.value;
        break;
      }
    }

    if (!selected) {
      console.log('[LaMovie] Sin resultados');
      return [];
    }

    console.log(`[LaMovie] ✓ "${selected.variant}" (${selected.results.length} resultados)`);

    // 3. Seleccionar mejor resultado
    const bestMatch = selectBestResult(selected.results, tmdbInfo);
    if (!bestMatch) return [];

    let targetId = bestMatch._id;

    // 4. Para series, obtener ID de episodio
    if (mediaType === 'tv' && season && episode) {
      const epId = await getEpisodeId(targetId, season, episode);
      if (!epId) {
        console.log(`[LaMovie] Episodio S${season}E${episode} no encontrado`);
        return [];
      }
      targetId = epId;
    }

    // 5. Obtener enlaces
    const { data } = await axios.get(
      `https://la.movie/wp-api/v1/player?postId=${targetId}&demo=0`,
      { timeout: 6000, headers: HEADERS }
    );

    if (!data?.data?.embeds) {
      console.log('[LaMovie] No hay embeds disponibles');
      return [];
    }

    // 6. Resolver con timeout global de 4s
    const RESOLVER_TIMEOUT = 5000;

    const embedPromises = data.data.embeds.map(embed => processEmbed(embed));

    const streams = await new Promise((resolve) => {
      const results = [];
      let completed = 0;
      const total = embedPromises.length;

      const finish = () => resolve(results.filter(Boolean));

      // Timer global — devuelve lo que haya al llegar al límite
      const timer = setTimeout(finish, RESOLVER_TIMEOUT);

      embedPromises.forEach(p => {
        p.then(result => {
          if (result) results.push(result);
          completed++;
          // Si ya terminaron todos, cancela el timer y devuelve
          if (completed === total) {
            clearTimeout(timer);
            finish();
          }
        }).catch(() => {
          completed++;
          if (completed === total) {
            clearTimeout(timer);
            finish();
          }
        });
      });
    });

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`[LaMovie] ✓ ${streams.length} streams en ${elapsed}s`);
    streamCache.set(cacheKey, { streams, ts: Date.now() });
    return streams;
  } catch (e) {
    console.log(`[LaMovie] Error: ${e.message}`);
    return [];
  }
}