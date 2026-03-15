// LaMovie provider for Nuvio - plain JS, no bundling required

const TMDB_API_KEY = '439c478a771f35c05022f9feabcca01c';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';
const BASE_URL = 'https://la.movie';
const ANIME_COUNTRIES = ['JP', 'CN', 'KR'];
const GENRE_ANIMATION = 16;

// ============================================================================
// FETCH HELPER
// ============================================================================
function fetchWithTimeout(url, options, timeout) {
  timeout = timeout || 10000;
  var controller = new AbortController();
  var timer = setTimeout(function() { controller.abort(); }, timeout);
  return fetch(url, Object.assign({}, options, { signal: controller.signal }))
    .then(function(res) { clearTimeout(timer); return res; })
    .catch(function(err) { clearTimeout(timer); throw err; });
}

function fetchText(url, headers, timeout) {
  return fetchWithTimeout(url, { headers: Object.assign({ 'User-Agent': UA }, headers || {}) }, timeout)
    .then(function(res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.text();
    });
}

function fetchJson(url, headers, timeout) {
  return fetchWithTimeout(url, { headers: Object.assign({ 'User-Agent': UA, 'Accept': 'application/json' }, headers || {}) }, timeout)
    .then(function(res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.json();
    });
}

// ============================================================================
// UTILITIES
// ============================================================================
function normalizeText(text) {
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
}

function normalizeQuality(quality) {
  var str = quality.toString().toLowerCase();
  var match = str.match(/(\d+)/);
  if (match) return match[1] + 'p';
  if (str.includes('4k') || str.includes('uhd')) return '2160p';
  if (str.includes('full') || str.includes('fhd')) return '1080p';
  if (str.includes('hd')) return '720p';
  return 'SD';
}

function buildSlug(title, year) {
  var slug = title
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  return year ? slug + '-' + year : slug;
}

function getCategories(mediaType, genres, originCountries) {
  if (mediaType === 'movie') return ['peliculas'];
  var isAnimation = (genres || []).includes(GENRE_ANIMATION);
  if (!isAnimation) return ['series'];
  var isAnimeCountry = (originCountries || []).some(function(c) { return ANIME_COUNTRIES.includes(c); });
  if (isAnimeCountry) return ['animes'];
  return ['animes', 'series'];
}

function getServerName(url) {
  if (url.includes('goodstream')) return 'GoodStream';
  if (url.includes('hlswish') || url.includes('streamwish') || url.includes('strwish')) return 'StreamWish';
  if (url.includes('voe.sx')) return 'VOE';
  if (url.includes('filemoon')) return 'Filemoon';
  if (url.includes('vimeos.net')) return 'Vimeos';
  return 'Online';
}

// ============================================================================
// QUALITY DETECTOR
// ============================================================================
function detectQuality(m3u8Url, headers) {
  return fetchWithTimeout(m3u8Url, {
    headers: Object.assign({ 'User-Agent': UA }, headers || {}),
  }, 3000)
    .then(function(res) { return res.text(); })
    .then(function(data) {
      if (!data.includes('#EXT-X-STREAM-INF')) {
        var match = m3u8Url.match(/[_-](\d{3,4})p/);
        return match ? match[1] + 'p' : '1080p';
      }
      var bestHeight = 0, bestWidth = 0;
      var lines = data.split('\n');
      for (var i = 0; i < lines.length; i++) {
        var m = lines[i].match(/RESOLUTION=(\d+)x(\d+)/);
        if (m) {
          var h = parseInt(m[2]);
          if (h > bestHeight) { bestHeight = h; bestWidth = parseInt(m[1]); }
        }
      }
      if (bestHeight === 0) return '1080p';
      if (bestWidth >= 3840 || bestHeight >= 2160) return '4K';
      if (bestWidth >= 1920 || bestHeight >= 1080) return '1080p';
      if (bestWidth >= 1280 || bestHeight >= 720) return '720p';
      if (bestWidth >= 854 || bestHeight >= 480) return '480p';
      return '360p';
    })
    .catch(function() { return '1080p'; });
}

// ============================================================================
// RESOLVER: GOODSTREAM
// ============================================================================
function resolveGoodStream(embedUrl) {
  return fetchText(embedUrl, {
    'Referer': 'https://goodstream.one',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
  }, 15000)
    .then(function(data) {
      var match = data.match(/file:\s*"([^"]+)"/);
      if (!match) return null;
      var videoUrl = match[1];
      var refHeaders = { 'Referer': embedUrl, 'Origin': 'https://goodstream.one', 'User-Agent': UA };
      return detectQuality(videoUrl, refHeaders).then(function(quality) {
        return { url: videoUrl, quality: quality, headers: refHeaders };
      });
    })
    .catch(function(err) { console.log('[GoodStream] Error: ' + err.message); return null; });
}

// ============================================================================
// RESOLVER: VOE
// ============================================================================
function b64toString(str) {
  try { return atob(str); } catch(e) { return null; }
}

function voeDecode(ct, luts) {
  try {
    var rawLuts = luts.replace(/^\[|\]$/g, '').split("','").map(function(s) { return s.replace(/^'+|'+$/g, ''); });
    var escapedLuts = rawLuts.map(function(i) { return i.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); });
    var txt = '';
    for (var ci = 0; ci < ct.length; ci++) {
      var x = ct.charCodeAt(ci);
      if (x > 64 && x < 91) x = (x - 52) % 26 + 65;
      else if (x > 96 && x < 123) x = (x - 84) % 26 + 97;
      txt += String.fromCharCode(x);
    }
    for (var pi = 0; pi < escapedLuts.length; pi++) txt = txt.replace(new RegExp(escapedLuts[pi], 'g'), '_');
    txt = txt.split('_').join('');
    var decoded1 = b64toString(txt);
    if (!decoded1) return null;
    var step4 = '';
    for (var si = 0; si < decoded1.length; si++) step4 += String.fromCharCode((decoded1.charCodeAt(si) - 3 + 256) % 256);
    var revBase64 = step4.split('').reverse().join('');
    var finalStr = b64toString(revBase64);
    if (!finalStr) return null;
    return JSON.parse(finalStr);
  } catch(e) { return null; }
}

function resolveVoe(embedUrl) {
  return fetchText(embedUrl, { 'Referer': embedUrl }, 15000)
    .then(function(data) {
      var rMain = data.match(/json">\s*\[s*['"]([^'"]+)['"]\s*\]\s*<\/script>\s*<script[^>]*src=['"]([^'"]+)['"]/i);
      if (rMain) {
        var encodedArray = rMain[1];
        var loaderUrl = rMain[2].startsWith('http') ? rMain[2] : new URL(rMain[2], embedUrl).href;
        return fetchText(loaderUrl, { 'Referer': embedUrl }, 15000).then(function(jsData) {
          var replMatch = jsData.match(/(\[(?:'[^']{1,10}'[\s,]*){4,12}\])/i) || jsData.match(/(\[(?:"[^"]{1,10}"[,\s]*){4,12}\])/i);
          if (replMatch) {
            var decoded = voeDecode(encodedArray, replMatch[1]);
            if (decoded && (decoded.source || decoded.direct_access_url)) {
              var url = decoded.source || decoded.direct_access_url;
              return detectQuality(url, { 'Referer': embedUrl }).then(function(q) {
                return { url: url, quality: q, headers: { 'Referer': embedUrl } };
              });
            }
          }
          return null;
        });
      }
      // Fallback
      var re = /(?:mp4|hls)['"\s]*:\s*['"]([^'"]+)['"]/gi;
      var m;
      while ((m = re.exec(data)) !== null) {
        var candidate = m[1];
        if (!candidate) continue;
        var url = candidate;
        if (url.startsWith('aHR0')) { try { url = atob(url); } catch(e) {} }
        return detectQuality(url, { 'Referer': embedUrl }).then(function(q) {
          return { url: url, quality: q, headers: { 'Referer': embedUrl } };
        });
      }
      return null;
    })
    .catch(function(err) { console.log('[VOE] Error: ' + err.message); return null; });
}

// ============================================================================
// RESOLVER: FILEMOON
// ============================================================================
function resolveFilemoon(embedUrl) {
  try {
    var CryptoJS = require('crypto-js');

    function b64urlToWordArray(s) {
      var pad = (4 - s.length % 4) % 4;
      return CryptoJS.enc.Base64.parse(s + '='.repeat(pad));
    }

    function wordArrayToBytes(wa) {
      var words = wa.words, sigBytes = wa.sigBytes;
      var bytes = new Uint8Array(sigBytes);
      for (var i = 0; i < sigBytes; i++) bytes[i] = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
      return bytes;
    }

    function bytesToWordArray(bytes) {
      var words = [];
      for (var i = 0; i < bytes.length; i += 4) {
        words.push(
          ((bytes[i] || 0) << 24) | ((bytes[i+1] || 0) << 16) | ((bytes[i+2] || 0) << 8) | (bytes[i+3] || 0)
        );
      }
      return CryptoJS.lib.WordArray.create(words, bytes.length);
    }

    return fetchText(embedUrl, { 'Referer': 'https://filemoon.sx/' }, 15000)
      .then(function(data) {
        var packMatch = data.match(/eval\(function\(p,a,c,k,e,d\)\{[\s\S]*?\}\('([\s\S]*?)',(\d+),(\d+),'([\s\S]*?)'\.split\('\|'\)\)\)/);
        if (!packMatch) return null;

        var p = packMatch[1], a = parseInt(packMatch[2]), c = parseInt(packMatch[3]), k = packMatch[4].split('|');
        while (c--) if (k[c]) p = p.replace(new RegExp('\\b' + c.toString(a) + '\\b', 'g'), k[c]);

        var fmMatch = p.match(/,"([A-Za-z0-9+/=_-]{20,})",(\d+),"([A-Za-z0-9+/=_-]{20,})"/);
        if (!fmMatch) return null;

        var encryptedB64 = fmMatch[1];
        var iterations = parseInt(fmMatch[2]);
        var saltB64 = fmMatch[3];

        var encryptedBytes = wordArrayToBytes(b64urlToWordArray(encryptedB64));
        var saltBytes = wordArrayToBytes(b64urlToWordArray(saltB64));
        var saltWA = bytesToWordArray(saltBytes);
        var key32 = wordArrayToBytes(CryptoJS.SHA256(saltWA));

        var keyWA = bytesToWordArray(key32);
        var encrypted = CryptoJS.AES.encrypt(
          bytesToWordArray(encryptedBytes),
          keyWA,
          { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.NoPadding }
        );
        var decryptedWA = CryptoJS.AES.decrypt(encrypted.toString(), keyWA, {
          mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.NoPadding
        });

        var decryptedStr = CryptoJS.enc.Utf8.stringify(decryptedWA);
        var m3u8Match = decryptedStr.match(/https?:\/\/[^\s"']+\.m3u8[^\s"']*/);
        if (!m3u8Match) return null;

        var url = m3u8Match[0];
        var headers = { 'Referer': 'https://filemoon.sx/', 'User-Agent': UA };
        return detectQuality(url, headers).then(function(q) {
          return { url: url, quality: q, headers: headers };
        });
      })
      .catch(function(err) { console.log('[Filemoon] Error: ' + err.message); return null; });
  } catch(e) {
    console.log('[Filemoon] crypto-js not available: ' + e.message);
    return Promise.resolve(null);
  }
}

// ============================================================================
// RESOLVER: HLSWISH
// ============================================================================
var HLSWISH_DOMAIN_MAP = { 'hglink.to': 'vibuxer.com' };

function unpackEval(payload, radix, symtab) {
  var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  return payload.replace(/\b([0-9a-zA-Z]+)\b/g, function(match) {
    var result = 0;
    for (var i = 0; i < match.length; i++) {
      var pos = chars.indexOf(match[i]);
      if (pos === -1) return match;
      result = result * radix + pos;
    }
    if (isNaN(result) || result >= symtab.length) return match;
    return (symtab[result] && symtab[result] !== '') ? symtab[result] : match;
  });
}

function resolveHlswish(embedUrl) {
  var fetchUrl = embedUrl;
  Object.keys(HLSWISH_DOMAIN_MAP).forEach(function(from) {
    if (fetchUrl.includes(from)) fetchUrl = fetchUrl.replace(from, HLSWISH_DOMAIN_MAP[from]);
  });
  var embedHost = (fetchUrl.match(/^(https?:\/\/[^/]+)/) || ['', 'https://hlswish.com'])[1];

  return fetchText(fetchUrl, {
    'Referer': 'https://embed69.org/',
    'Origin': 'https://embed69.org',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'es-MX,es;q=0.9',
  }, 15000)
    .then(function(data) {
      var fileMatch = data.match(/file\s*:\s*["']([^"']+)["']/i);
      if (fileMatch) {
        var url = fileMatch[1];
        if (url.startsWith('/')) url = embedHost + url;
        return { url: url, quality: '1080p', headers: { 'User-Agent': UA, 'Referer': embedHost + '/' } };
      }
      var packMatch = data.match(/eval\(function\(p,a,c,k,e,[a-z]\)\{[^}]+\}\s*\('([\s\S]+?)',\s*(\d+),\s*(\d+),\s*'([\s\S]+?)'\.split\('\|'\)/);
      if (packMatch) {
        var unpacked = unpackEval(packMatch[1], parseInt(packMatch[2]), packMatch[4].split('|'));
        var objMatch = unpacked.match(/\{[^{}]*"hls[234]"\s*:\s*"([^"]+)"[^{}]*\}/);
        if (objMatch) {
          var urlMatch = objMatch[0].match(/"hls[234]"\s*:\s*"([^"]+\.m3u8[^"]*)"/);
          if (urlMatch) {
            var url = urlMatch[1];
            if (url.startsWith('/')) url = embedHost + url;
            return { url: url, quality: '1080p', headers: { 'User-Agent': UA, 'Referer': embedHost + '/' } };
          }
        }
        var m3u8Match = unpacked.match(/["']([^"']{30,}\.m3u8[^"']*)['"]/ );
        if (m3u8Match) {
          var url = m3u8Match[1];
          if (url.startsWith('/')) url = embedHost + url;
          return { url: url, quality: '1080p', headers: { 'User-Agent': UA, 'Referer': embedHost + '/' } };
        }
      }
      var rawM3u8 = data.match(/https?:\/\/[^"'\s\\]+\.m3u8[^"'\s\\]*/i);
      if (rawM3u8) return { url: rawM3u8[0], quality: '1080p', headers: { 'User-Agent': UA, 'Referer': embedHost + '/' } };
      return null;
    })
    .catch(function(err) { console.log('[HLSWish] Error: ' + err.message); return null; });
}

// ============================================================================
// RESOLVER: VIMEOS
// ============================================================================
function resolveVimeos(embedUrl) {
  return fetchText(embedUrl, {
    'Referer': 'https://vimeos.net/',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
  }, 15000)
    .then(function(data) {
      var packMatch = data.match(/eval\(function\(p,a,c,k,e,[dr]\)\{[\s\S]+?\}\('([\s\S]+?)',(\d+),(\d+),'([\s\S]+?)'\.split\('\|'\)/);
      if (!packMatch) return null;
      var symtab = packMatch[4].split('|');
      var unpacked = unpackEval(packMatch[1], parseInt(packMatch[2]), symtab);
      var m3u8Match = unpacked.match(/["']([^"']+\.m3u8[^"']*)['"]/ );
      if (!m3u8Match) return null;
      var url = m3u8Match[1];
      var headers = { 'User-Agent': UA, 'Referer': 'https://vimeos.net/' };
      return detectQuality(url, headers).then(function(q) {
        return { url: url, quality: q, headers: headers };
      });
    })
    .catch(function(err) { console.log('[Vimeos] Error: ' + err.message); return null; });
}

// ============================================================================
// RESOLVER MAP
// ============================================================================
var RESOLVERS = {
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

function getResolver(url) {
  try {
    for (var pattern in RESOLVERS) {
      if (url.includes(pattern)) return RESOLVERS[pattern];
    }
  } catch(e) {}
  return null;
}

// ============================================================================
// TMDB
// ============================================================================
function getTmdbData(tmdbId, mediaType) {
  var attempts = [
    { lang: 'es-MX', name: 'Latino' },
    { lang: 'en-US', name: 'Inglés' },
  ];

  function tryNext(i) {
    if (i >= attempts.length) return Promise.resolve(null);
    var attempt = attempts[i];
    var url = 'https://api.themoviedb.org/3/' + mediaType + '/' + tmdbId + '?api_key=' + TMDB_API_KEY + '&language=' + attempt.lang;
    return fetchJson(url, {}, 5000)
      .then(function(data) {
        var title = mediaType === 'movie' ? data.title : data.name;
        var originalTitle = mediaType === 'movie' ? data.original_title : data.original_name;
        if (attempt.lang === 'es-MX' && /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]/.test(title)) {
          return tryNext(i + 1);
        }
        console.log('[LaMovie] TMDB (' + attempt.name + '): "' + title + '"');
        return {
          title: title,
          originalTitle: originalTitle,
          year: (data.release_date || data.first_air_date || '').substring(0, 4),
          genres: (data.genres || []).map(function(g) { return g.id; }),
          originCountries: data.origin_country || (data.production_countries || []).map(function(c) { return c.iso_3166_1; }) || [],
        };
      })
      .catch(function() { return tryNext(i + 1); });
  }

  return tryNext(0);
}

// ============================================================================
// SLUG → ID
// ============================================================================
function extractIdFromHtml(html) {
  var match = html.match(/rel=['"]shortlink['"]\s+href=['"][^'"]*\?p=(\d+)['"]/);
  return match ? match[1] : null;
}

function getIdBySlug(category, slug) {
  var url = BASE_URL + '/' + category + '/' + slug + '/';
  return fetchText(url, {
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'es-MX,es;q=0.9',
    'Connection': 'keep-alive',
    'Upgrade-Insecure-Requests': '1',
  }, 8000)
    .then(function(html) {
      var id = extractIdFromHtml(html);
      if (id) {
        console.log('[LaMovie] ✓ Slug directo: /' + category + '/' + slug + ' → id:' + id);
        return { id: id };
      }
      return null;
    })
    .catch(function() { return null; });
}

function findBySlug(tmdbInfo, mediaType) {
  var title = tmdbInfo.title, originalTitle = tmdbInfo.originalTitle, year = tmdbInfo.year;
  var genres = tmdbInfo.genres, originCountries = tmdbInfo.originCountries;
  var categories = getCategories(mediaType, genres, originCountries);

  var slugs = [];
  if (title) slugs.push(buildSlug(title, year));
  if (originalTitle && originalTitle !== title) slugs.push(buildSlug(originalTitle, year));

  function trySlug(si) {
    if (si >= slugs.length) return Promise.resolve(null);
    var slug = slugs[si];

    if (categories.length === 1) {
      return getIdBySlug(categories[0], slug).then(function(r) {
        if (r) return r;
        return trySlug(si + 1);
      });
    }

    return Promise.all(categories.map(function(cat) { return getIdBySlug(cat, slug); }))
      .then(function(results) {
        for (var ri = 0; ri < results.length; ri++) {
          if (results[ri]) return results[ri];
        }
        return trySlug(si + 1);
      });
  }

  return trySlug(0);
}

// ============================================================================
// EPISODES
// ============================================================================
function getEpisodeId(seriesId, seasonNum, episodeNum) {
  var url = BASE_URL + '/wp-api/v1/single/episodes/list?_id=' + seriesId + '&season=' + seasonNum + '&page=1&postsPerPage=50';
  return fetchJson(url, {}, 12000)
    .then(function(data) {
      if (!data || !data.data || !data.data.posts) return null;
      var ep = null;
      for (var i = 0; i < data.data.posts.length; i++) {
        var e = data.data.posts[i];
        if (e.season_number == seasonNum && e.episode_number == episodeNum) { ep = e; break; }
      }
      return ep ? ep._id : null;
    })
    .catch(function(err) { console.log('[LaMovie] Error episodios: ' + err.message); return null; });
}

// ============================================================================
// PROCESS EMBED
// ============================================================================
function processEmbed(embed) {
  var resolver = getResolver(embed.url);
  if (!resolver) {
    console.log('[LaMovie] Sin resolver para: ' + embed.url);
    return Promise.resolve(null);
  }

  return resolver(embed.url)
    .then(function(result) {
      if (!result || !result.url) return null;
      var quality = normalizeQuality(embed.quality || '1080p');
      var serverName = getServerName(embed.url);
      return {
        name: 'LaMovie',
        title: quality + ' · ' + serverName,
        url: result.url,
        quality: quality,
        headers: result.headers || {}
      };
    })
    .catch(function(err) {
      console.log('[LaMovie] Error procesando embed: ' + err.message);
      return null;
    });
}

// ============================================================================
// MAIN
// ============================================================================
function getStreams(tmdbId, mediaType, season, episode) {
  if (!tmdbId || !mediaType) return Promise.resolve([]);

  var startTime = Date.now();
  console.log('[LaMovie] Buscando: TMDB ' + tmdbId + ' (' + mediaType + ')' + (season ? ' S' + season + 'E' + episode : ''));

  return getTmdbData(tmdbId, mediaType)
    .then(function(tmdbInfo) {
      if (!tmdbInfo) return [];
      return findBySlug(tmdbInfo, mediaType)
        .then(function(found) {
          if (!found) {
            console.log('[LaMovie] No encontrado por slug');
            return [];
          }

          var targetId = found.id;

          function getEmbeds() {
            if (mediaType === 'tv' && season && episode) {
              return getEpisodeId(targetId, season, episode).then(function(epId) {
                if (!epId) {
                  console.log('[LaMovie] Episodio S' + season + 'E' + episode + ' no encontrado');
                  return null;
                }
                return epId;
              });
            }
            return Promise.resolve(targetId);
          }

          return getEmbeds().then(function(id) {
            if (!id) return [];
            return fetchJson(BASE_URL + '/wp-api/v1/player?postId=' + id + '&demo=0', {}, 6000)
              .then(function(data) {
                if (!data || !data.data || !data.data.embeds) {
                  console.log('[LaMovie] No hay embeds');
                  return [];
                }

                var embeds = data.data.embeds;
                var RESOLVER_TIMEOUT = 5000;

                return new Promise(function(resolve) {
                  var results = [];
                  var completed = 0;
                  var total = embeds.length;
                  var finished = false;

                  function finish() {
                    if (finished) return;
                    finished = true;
                    resolve(results.filter(Boolean));
                  }

                  var timer = setTimeout(finish, RESOLVER_TIMEOUT);

                  embeds.forEach(function(embed) {
                    processEmbed(embed).then(function(result) {
                      if (result) results.push(result);
                      completed++;
                      if (completed === total) { clearTimeout(timer); finish(); }
                    }).catch(function() {
                      completed++;
                      if (completed === total) { clearTimeout(timer); finish(); }
                    });
                  });
                });
              })
              .then(function(streams) {
                var elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
                console.log('[LaMovie] ✓ ' + streams.length + ' streams en ' + elapsed + 's');
                return streams;
              });
          });
        });
    })
    .catch(function(err) {
      console.log('[LaMovie] Error: ' + err.message);
      return [];
    });
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { getStreams: getStreams };
} else {
  global.LaMovieModule = { getStreams: getStreams };
}
