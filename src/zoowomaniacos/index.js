import axios from 'axios';
import { resolve as resolveOkru } from '../resolvers/okru.js';

const TMDB_API_KEY = '439c478a771f35c05022f9feabcca01c';
const BASE_URL = 'https://proyectox.yoyatengoabuela.com';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';

const HEADERS = {
  'User-Agent': UA,
  'Accept': 'application/json, text/javascript, */*',
  'Connection': 'keep-alive',
  'Referer': BASE_URL + '/',
  'Origin': BASE_URL,
  'X-Requested-With': 'XMLHttpRequest',
};

const OKRU_BLACKLIST = ['332656282246', '1683045747235'];

async function getTmdbData(tmdbId, mediaType) {
  const attempts = [
    { lang: 'es-MX', name: 'Latino' },
    { lang: 'en-US', name: 'Inglés' },
  ];
  for (const { lang, name } of attempts) {
    try {
      const url = `https://api.themoviedb.org/3/${mediaType}/${tmdbId}?api_key=${TMDB_API_KEY}&language=${lang}`;
      const { data } = await axios.get(url, { timeout: 5000, headers: { 'User-Agent': UA } });
      const title = mediaType === 'movie' ? data.title : data.name;
      const originalTitle = mediaType === 'movie' ? data.original_title : data.original_name;
      if (!title) continue;
      if (lang === 'es-MX' && /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]/.test(title)) continue;
      console.log(`[Zoowomaniacos] TMDB (${name}): "${title}"`);
      return { title, originalTitle, year: (data.release_date || '').substring(0, 4) };
    } catch (e) {
      console.log(`[Zoowomaniacos] Error TMDB ${name}: ${e.message}`);
    }
  }
  return null;
}

async function searchMovie(query) {
  try {
    const { data } = await axios.post(
      `${BASE_URL}/alternativo3/server.php`,
      new URLSearchParams({
        'start': '0', 'length': '10', 'metodo': 'ObtenerListaTotal',
        'search[value]': query,
        'searchPanes[a3][0]': '', 'searchPanes[a4][0]': '',
        'searchPanes[a5][0]': '', 'searchPanes[a6][0]': '',
      }),
      { timeout: 8000, headers: HEADERS }
    );
    return data?.data || [];
  } catch (e) {
    console.log(`[Zoowomaniacos] Error búsqueda: ${e.message}`);
    return [];
  }
}

function selectBestResult(results, tmdbInfo) {
  if (results.length === 0) return null;
  if (results.length === 1) return results[0];

  const normalize = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
  const targetTitle = normalize(tmdbInfo.title);
  const targetOriginal = tmdbInfo.originalTitle ? normalize(tmdbInfo.originalTitle) : '';

  const scored = results.map(r => {
    const rTitle = normalize((r.a2 || '').split('-')[0].trim());
    let score = 0;
    if (rTitle === targetTitle || rTitle === targetOriginal) score += 3;
    else if (rTitle.includes(targetTitle) || targetTitle.includes(rTitle)) score += 1.5;
    if (tmdbInfo.year && r.a4 === tmdbInfo.year) score += 1;
    return { r, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored[0].r;
}

async function getEmbeds(id) {
  try {
    const { data: html } = await axios.get(`${BASE_URL}/testplayer.php?id=${id}`, {
      timeout: 8000,
      headers: { 'User-Agent': UA, 'Accept': 'text/html', 'Referer': BASE_URL + '/' },
    });

    const matches = [...html.matchAll(/src="(https?:\/\/[^"]+)"/g)];
    const urls = [...new Set(matches.map(m => m[1]))];

    return urls.filter(url => {
      if (!url.includes('ok.ru/videoembed/')) return false;
      const okId = url.split('/').pop();
      return !OKRU_BLACKLIST.includes(okId);
    });
  } catch (e) {
    console.log(`[Zoowomaniacos] Error player: ${e.message}`);
    return [];
  }
}

export async function getStreams(tmdbId, mediaType, season, episode) {
  if (!tmdbId || mediaType !== 'movie') return [];

  const startTime = Date.now();
  console.log(`[Zoowomaniacos] Buscando: TMDB ${tmdbId}`);

  try {
    const tmdbInfo = await getTmdbData(tmdbId, mediaType);
    if (!tmdbInfo) return [];

    const queries = [tmdbInfo.title];
    if (tmdbInfo.originalTitle && tmdbInfo.originalTitle !== tmdbInfo.title) {
      queries.push(tmdbInfo.originalTitle);
    }

    let selected = null;
    for (const q of queries) {
      const results = await searchMovie(q);
      if (results.length > 0) {
        selected = selectBestResult(results, tmdbInfo);
        if (selected) {
          console.log(`[Zoowomaniacos] ✓ Encontrado: "${selected.a2}" (${selected.a4}) id:${selected.a1}`);
          break;
        }
      }
    }

    if (!selected) {
      console.log('[Zoowomaniacos] No encontrado');
      return [];
    }

    const embedUrls = await getEmbeds(selected.a1);
    if (embedUrls.length === 0) {
      console.log('[Zoowomaniacos] No hay embeds válidos');
      return [];
    }

    console.log(`[Zoowomaniacos] Resolviendo ${embedUrls.length} embeds ok.ru...`);

    const results = await Promise.allSettled(embedUrls.map(url => resolveOkru(url)));
    const streams = results
      .filter(r => r.status === 'fulfilled' && r.value)
      .map(r => ({
        name: 'Zoowomaniacos',
        title: `${r.value.quality} · OkRu`,
        url: r.value.url,
        quality: r.value.quality,
        headers: r.value.headers || {},
        }));

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`[Zoowomaniacos] ✓ ${streams.length} streams en ${elapsed}s`);

    return streams;
  } catch (e) {
    console.log(`[Zoowomaniacos] Error: ${e.message}`);
    return [];
  }
}