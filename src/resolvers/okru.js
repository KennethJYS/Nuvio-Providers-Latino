import axios from 'axios';

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';

export async function resolve(embedUrl) {
  try {
    console.log(`[OkRu] Resolviendo: ${embedUrl}`);

    const { data: raw } = await axios.get(embedUrl, {
      timeout: 10000,
      headers: {
        'User-Agent': UA,
        'Accept': 'text/html',
        'Referer': 'https://ok.ru/',
      },
    });

    if (raw.includes('copyrightsRestricted') || raw.includes('COPYRIGHTS_RESTRICTED') ||
        raw.includes('LIMITED_ACCESS') || raw.includes('notFound') || !raw.includes('urls')) {
      console.log('[OkRu] Video no disponible o eliminado');
      return null;
    }

    const data = raw
      .replace(/\\&quot;/g, '"')
      .replace(/\\u0026/g, '&')
      .replace(/\\/g, '');

    const matches = [...data.matchAll(/"name":"([^"]+)","url":"([^"]+)"/g)];

    const QUALITY_ORDER = ['full', 'hd', 'sd', 'low', 'lowest'];
    const videos = matches
      .map(m => ({ type: m[1], url: m[2] }))
      .filter(v => !v.type.toLowerCase().includes('mobile') && v.url.startsWith('http'));

    if (videos.length === 0) {
      console.log('[OkRu] No se encontraron URLs');
      return null;
    }

    const sorted = videos.sort((a, b) => {
      const ai = QUALITY_ORDER.findIndex(q => a.type.toLowerCase().includes(q));
      const bi = QUALITY_ORDER.findIndex(q => b.type.toLowerCase().includes(q));
      return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
    });

    const best = sorted[0];
    console.log(`[OkRu] URL encontrada (${best.type}): ${best.url.substring(0, 80)}...`);

    const QUALITY_MAP = { full: '1080p', hd: '720p', sd: '480p', low: '360p', lowest: '240p' };
    return {
        url: best.url,
        quality: QUALITY_MAP[best.type] || best.type,
        headers: { 'User-Agent': UA, 'Referer': 'https://ok.ru/' },
    };
  } catch (e) {
    console.log(`[OkRu] Error: ${e.message}`);
    return null;
  }
}