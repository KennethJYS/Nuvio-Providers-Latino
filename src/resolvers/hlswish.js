// resolvers/hlswish.js
import axios from 'axios';

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';

function unpackEval(payload, radix, symtab) {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const unbase = (str) => {
    let result = 0;
    for (let i = 0; i < str.length; i++) {
      const pos = chars.indexOf(str[i]);
      if (pos === -1) return NaN;
      result = result * radix + pos;
    }
    return result;
  };
  return payload.replace(/\b([0-9a-zA-Z]+)\b/g, (match) => {
    const idx = unbase(match);
    if (isNaN(idx) || idx >= symtab.length) return match;
    return (symtab[idx] && symtab[idx] !== '') ? symtab[idx] : match;
  });
}

function extractHlsUrl(unpacked, embedHost) {
  const objMatch = unpacked.match(/\{[^{}]*"hls[234]"\s*:\s*"([^"]+)"[^{}]*\}/);
  if (objMatch) {
    try {
      const normalized = objMatch[0].replace(/(\w+)\s*:/g, '"$1":');
      const obj = JSON.parse(normalized);
      const url = obj.hls4 || obj.hls3 || obj.hls2;
      if (url) return url.startsWith('/') ? embedHost + url : url;
    } catch {
      const urlMatch = objMatch[0].match(/"hls[234]"\s*:\s*"([^"]+\.m3u8[^"]*)"/);
      if (urlMatch) {
        const url = urlMatch[1];
        return url.startsWith('/') ? embedHost + url : url;
      }
    }
  }
  const m3u8Match = unpacked.match(/["']([^"']{30,}\.m3u8[^"']*)['"]/i);
  if (m3u8Match) {
    const url = m3u8Match[1];
    return url.startsWith('/') ? embedHost + url : url;
  }
  return null;
}

// hglink.to es solo un alias que redirige a vibuxer.com
// Mapeamos directamente para evitar el redirect
const DOMAIN_MAP = {
  'hglink.to': 'vibuxer.com',
};

export async function resolve(embedUrl) {
  try {
    // Reemplazar dominio si está en el mapa
    let fetchUrl = embedUrl;
    for (const [from, to] of Object.entries(DOMAIN_MAP)) {
      if (fetchUrl.includes(from)) {
        fetchUrl = fetchUrl.replace(from, to);
        break;
      }
    }

    const embedHost = fetchUrl.match(/^(https?:\/\/[^/]+)/)?.[1] || 'https://hlswish.com';
    console.log(`[HLSWish] Resolviendo: ${embedUrl}`);
    if (fetchUrl !== embedUrl) console.log(`[HLSWish] → Mapped to: ${fetchUrl}`);

    const resp = await axios.get(fetchUrl, {
      headers: {
        'User-Agent': UA,
        'Referer': 'https://embed69.org/',
        'Origin': 'https://embed69.org',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'es-MX,es;q=0.9',
      },
      timeout: 15000,
      maxRedirects: 5
    });
    const data = typeof resp.data === 'string' ? resp.data : JSON.stringify(resp.data);

    // Método 1: file: "..." directo
    const fileMatch = data.match(/file\s*:\s*["']([^"']+\.m3u8[^"']*)["']/i);
    if (fileMatch) {
      let url = fileMatch[1];
      if (url.startsWith('/')) url = embedHost + url;
      console.log(`[HLSWish] URL encontrada: ${url.substring(0, 80)}...`);
      return { url, quality: '1080p', headers: { 'User-Agent': UA, 'Referer': embedHost + '/' } };
    }

    // Método 2: eval PACKER → extraer hls2/hls3/hls4
    const packMatch = data.match(
      /eval\(function\(p,a,c,k,e,[a-z]\)\{[^}]+\}\s*\('([\s\S]+?)',\s*(\d+),\s*(\d+),\s*'([\s\S]+?)'\.split\('\|'\)/
    );
    if (packMatch) {
      const unpacked = unpackEval(packMatch[1], parseInt(packMatch[2]), packMatch[4].split('|'));
      const url = extractHlsUrl(unpacked, embedHost);
      if (url) {
        console.log(`[HLSWish] URL encontrada: ${url.substring(0, 80)}...`);
        return { url, quality: '1080p', headers: { 'User-Agent': UA, 'Referer': embedHost + '/' } };
      }
    }

    // Método 3: m3u8 raw
    const rawM3u8 = data.match(/https?:\/\/[^"'\s\\]+\.m3u8[^"'\s\\]*/i);
    if (rawM3u8) {
      console.log(`[HLSWish] URL encontrada: ${rawM3u8[0].substring(0, 80)}...`);
      return { url: rawM3u8[0], quality: '1080p', headers: { 'User-Agent': UA, 'Referer': embedHost + '/' } };
    }

    console.log('[HLSWish] No se encontró URL');
    return null;
  } catch (err) {
    console.log(`[HLSWish] Error: ${err.message}`);
    return null;
  }
}