// test.js - Prueba local del provider (antes de cargar en Nuvio)
// Uso: node test.js [tmdbId] [tipo] [temporada] [episodio]
// Ejemplos:
//   node test.js 550 movie
//   node test.js 1396 tv 1 1

const { getStreams } = require('./providers/lamovie.js');

const tmdbId = process.argv[2] || '550';
const mediaType = process.argv[3] || 'movie';
const season = process.argv[4] ? parseInt(process.argv[4]) : null;
const episode = process.argv[5] ? parseInt(process.argv[5]) : null;

console.log(`\nTesting LaMovie provider...`);
console.log(`TMDB: ${tmdbId} | Tipo: ${mediaType}${season ? ` | S${season}E${episode}` : ''}\n`);

getStreams(tmdbId, mediaType, season, episode)
  .then(streams => {
    if (!streams || streams.length === 0) {
      console.log('❌ No se encontraron streams');
      return;
    }
    console.log(`\n✅ ${streams.length} streams encontrados:\n`);
    streams.forEach((s, i) => {
      console.log(`[${i + 1}] ${s.title}`);
      console.log(`    URL: ${s.url.substring(0, 80)}...`);
      if (s.headers && Object.keys(s.headers).length > 0) {
        console.log(`    Headers: ${JSON.stringify(s.headers)}`);
      }
      console.log();
    });
  })
  .catch(e => {
    console.error('Error:', e.message);
  });

