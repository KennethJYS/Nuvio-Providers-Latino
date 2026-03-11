// src/embed69/index.js
// Provider basado en embed69.org — soporta películas y series
// Flujo: TMDB → IMDB ID → embed69.org/f/{imdb_id} → dataLink (JWT) → resolvers

import axios from 'axios';
import { resolve as resolveVoe } from '../resolvers/voe.js';
import { resolve as resolveFilemoon } from '../resolvers/filemoon.js';
import { resolve as resolveHlswish } from '../resolvers/hlswish.js';

// ============================================================================
// CONFIGURACIÓN
// ============================================================================
const TMDB_API_KEY = '439c478a771f35c05022f9feabcca01c';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
const BASE_URL = 'https://embed69.org';
const RESOLVER_TIMEOUT = 4000;

// Mapeo de dominio de embed → resolver
// Basado en HTML real de embed69 (Interstellar tt0816692)
const RESOLVER_MAP = {
  'voe.sx':           resolveVoe,
  'hglink.to':        resolveHlswish,    // streamwish
  'streamwish.com':   resolveHlswish,
  'streamwish.to':    resolveHlswish,
  'wishembed.online': resolveHlswish,
  'filelions.com':    resolveHlswish,
  'bysedikamoum.com':  resolveFilemoon,  // filemoon alias
  'filemoon.sx':      resolveFilemoon,
  'filemoon.to':      resolveFilemoon,
  'moonembed.pro':    resolveFilemoon,
};

const SERVER_LABELS = {
  'voe':        'VOE',
  'streamwish': 'StreamWish',
  'filemoon':   'Filemoon',
  'vidhide':    'VidHide',
};

// Prioridad de idioma (menor índice = mayor prioridad)
const LANG_PRIORITY = ['LAT', 'ESP', 'SUB'];

// ============================================================================
// UTILIDADES
// ============================================================================

// Decodifica el payload de un JWT sin verificar firma
// El payload es base64url standard sin encriptar — podemos leerlo localmente
function decodeJwtPayload(token) {
  try {
    const parts = token.split('.');
    if (parts.length < 2) return null;
    // base64url → base64 standard
    let payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    payload += '='.repeat((4 - payload.length % 4) % 4);
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}

// Extrae la variable JavaScript `dataLink` del HTML de embed69
// La variable está en una sola línea: let dataLink = [...];
function parseDataLink(html) {
  try {
    // Greedy match en línea única (el array está en una sola línea)
    const match = html.match(/let\s+dataLink\s*=\s*(\[.+\]);/);
    if (!match) return null;
    return JSON.parse(match[1]);
  } catch {
    return null;
  }
}

// Obtiene el resolver según la URL del embed decodificado
function getResolver(url) {
  if (!url) return null;
  for (const [pattern, resolver] of Object.entries(RESOLVER_MAP)) {
    if (url.includes(pattern)) return resolver;
  }
  return null;
}

// ============================================================================
// TMDB
// ============================================================================

// Obtiene el IMDB ID desde TMDB external_ids
async function getImdbId(tmdbId, mediaType) {
  const endpoint = mediaType === 'movie'
    ? `https://api.themoviedb.org/3/movie/${tmdbId}/external_ids?api_key=${TMDB_API_KEY}`
    : `https://api.themoviedb.org/3/tv/${tmdbId}/external_ids?api_key=${TMDB_API_KEY}`;

  const { data } = await axios.get(endpoint, {
    timeout: 5000,
    headers: { 'User-Agent': UA }
  });
  return data.imdb_id || null;
}

// ============================================================================
// EMBED69 FETCH
// ============================================================================

// Construye la URL de embed69 según tipo de contenido
function buildEmbedUrl(imdbId, mediaType, season, episode) {
  if (mediaType === 'movie') return `${BASE_URL}/f/${imdbId}`;
  // Series: /f/{imdb_id}/{season}/{episode}
  return `${BASE_URL}/f/${imdbId}/${season}/${episode}`;
}

// ============================================================================
// FUNCIÓN PRINCIPAL
// ============================================================================
export async function getStreams(tmdbId, mediaType, season, episode) {
  if (!tmdbId || !mediaType) return [];

  const startTime = Date.now();
  console.log(`[Embed69] Buscando: TMDB ${tmdbId} (${mediaType})${season ? ` S${season}E${episode}` : ''}`);

  try {
    // 1. Obtener IMDB ID desde TMDB
    const imdbId = await getImdbId(tmdbId, mediaType);
    if (!imdbId) {
      console.log('[Embed69] No se encontró IMDB ID');
      return [];
    }
    console.log(`[Embed69] IMDB ID: ${imdbId}`);

    // 2. Fetch la página de embed69
    const embedUrl = buildEmbedUrl(imdbId, mediaType, season, episode);
    console.log(`[Embed69] Fetching: ${embedUrl}`);

    const { data: html } = await axios.get(embedUrl, {
      timeout: 8000,
      headers: {
        'User-Agent': UA,
        'Referer': 'https://sololatino.net/',
        'Accept': 'text/html,application/xhtml+xml'
      }
    });

    // 3. Extraer el array dataLink del HTML
    const dataLink = parseDataLink(html);
    if (!dataLink || dataLink.length === 0) {
      console.log('[Embed69] No se encontró dataLink en el HTML');
      return [];
    }

    console.log(`[Embed69] ${dataLink.length} idiomas disponibles: ${dataLink.map(d => d.video_language).join(', ')}`);

    // 4. Agrupar secciones por idioma en orden de prioridad (LAT > ESP > SUB)
    const byLang = {};
    for (const section of dataLink) {
      byLang[section.video_language] = section;
    }

    // 5. Extraer embeds resolvibles de una sección
    function getEmbeds(section) {
      const lang = section.video_language || 'LAT';
      const embeds = [];
      for (const embed of (section.sortedEmbeds || [])) {
        if (embed.servername === 'download') continue;
        const payload = decodeJwtPayload(embed.link);
        if (!payload || !payload.link) continue;
        const resolver = getResolver(payload.link);
        if (!resolver) {
          console.log(`[Embed69] Sin resolver para ${embed.servername}: ${payload.link.substring(0, 60)}`);
          continue;
        }
        embeds.push({ url: payload.link, resolver, lang, servername: embed.servername });
      }
      return embeds;
    }

    // 6. Resolver un lote de embeds en paralelo
    async function resolveBatch(embeds) {
      const results = await Promise.allSettled(
        embeds.map(({ url, resolver, lang, servername }) =>
          Promise.race([
            resolver(url).then(r => r ? { ...r, lang, servername } : null),
            new Promise((_, reject) =>
              setTimeout(() => reject(new Error('timeout')), RESOLVER_TIMEOUT)
            )
          ])
        )
      );
      return results
        .filter(r => r.status === 'fulfilled' && r.value?.url)
        .map(r => r.value);
    }

    // 7. Cascada: LAT → ESP → SUB (para en cuanto encuentra streams)
    const streams = [];
    for (const lang of LANG_PRIORITY) {
      const section = byLang[lang];
      if (!section) continue;

      const embeds = getEmbeds(section);
      if (embeds.length === 0) continue;

      console.log(`[Embed69] Resolviendo ${embeds.length} embeds (${lang})...`);
      const resolved = await resolveBatch(embeds);

      if (resolved.length > 0) {
        for (const { url, quality, lang: l, servername, headers } of resolved) {
          const langLabel = l === 'LAT' ? 'Latino' : l === 'ESP' ? 'Español' : 'Subtitulado';
          const serverLabel = SERVER_LABELS[servername] || servername;
          streams.push({
            name: 'Embed69',
            title: `${quality || '1080p'} · ${langLabel} · ${serverLabel}`,
            url,
            quality: quality || '1080p',
            headers: headers || {}
          });
        }
        console.log(`[Embed69] ✓ Streams encontrados en ${lang}, omitiendo idiomas de menor prioridad`);
        break; // No seguir con ESP/SUB si LAT funcionó
      } else {
        console.log(`[Embed69] Sin streams en ${lang}, intentando siguiente idioma...`);
      }
    }

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`[Embed69] ✓ ${streams.length} streams en ${elapsed}s`);

    return streams;

  } catch (e) {
    console.log(`[Embed69] Error: ${e.message}`);
    return [];
  }
}
