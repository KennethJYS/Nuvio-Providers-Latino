// resolvers/vidhide.js
import axios from 'axios';

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';

// ============================================================================
// P,A,C,K,E,R unpacker (jsunpack)
// ============================================================================
function unpack(packed) {
  try {
    // Extraer parámetros: p,a,c,k,e,d
    const match = packed.match(
      /eval\(function\(p,a,c,k,e,[rd]\)\{.*?\}\s*\('([\s\S]*?)',\s*(\d+),\s*(\d+),\s*'([\s\S]*?)'\.split\('\|'\)/
    );
    if (!match) return null;

    let [, p, a, c, k] = match;
    a = parseInt(a);
    c = parseInt(c);
    k = k.split('|');

    const base = (num, b) => {
      const chars = '0123456789abcdefghijklmnopqrstuvwxyz';
      let result = '';
      while (num > 0) {
        result = chars[num % b] + result;
        num = Math.floor(num / b);
      }
      return result || '0';
    };

    // Reemplazar cada token
    p = p.replace(/\b\w+\b/g, word => {
      const num = parseInt(word, 36);
      const replacement = num < k.length && k[num] ? k[num] : base(num, a);
      return replacement;
    });

    return p;
  } catch (e) {
    return null;
  }
}

export async function resolve(embedUrl) {
  try {
    console.log(`[VidHide] Resolviendo: ${embedUrl}`);

    const { data: html } = await axios.get(embedUrl, {
      timeout: 15000,
      maxRedirects: 10,
      headers: {
        'User-Agent': UA,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Referer': 'https://embed69.org/',
      },
    });

    // Extraer bloque eval(...)
    const evalMatch = html.match(/eval\(function\(p,a,c,k,e,[rd]\)[\s\S]*?\.split\('\|'\)[^\)]*\)\)/);
    if (!evalMatch) {
      console.log('[VidHide] No se encontró bloque eval');
      return null;
    }

    const unpacked = unpack(evalMatch[0]);
    if (!unpacked) {
      console.log('[VidHide] No se pudo desempacar');
      return null;
    }

    // Extraer hls4 primero, luego hls2 como fallback
    const hls4Match = unpacked.match(/"hls4"\s*:\s*"([^"]+)"/);
    const hls2Match = unpacked.match(/"hls2"\s*:\s*"([^"]+)"/);
    const m3u8Relative = (hls4Match || hls2Match)?.[1];

    if (!m3u8Relative) {
      console.log('[VidHide] No se encontró hls4/hls2');
      return null;
    }

    // Construir URL absoluta si es relativa
    let m3u8Url = m3u8Relative;
    if (!m3u8Relative.startsWith('http')) {
      const origin = new URL(embedUrl).origin;
      m3u8Url = `${origin}${m3u8Relative}`;
    }

    console.log(`[VidHide] URL encontrada: ${m3u8Url.substring(0, 80)}...`);

    const origin = new URL(embedUrl).origin;
    return {
      url: m3u8Url,
      headers: {
        'User-Agent': UA,
        'Referer': `${origin}/`,
        'Origin': origin,
      },
    };
  } catch (e) {
    console.log(`[VidHide] Error: ${e.message}`);
    return null;
  }
}