var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve2, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve2(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
var zoowomaniacos_exports = {};
__export(zoowomaniacos_exports, {
  getStreams: () => getStreams
});
module.exports = __toCommonJS(zoowomaniacos_exports);
var UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
function resolve(embedUrl) {
  return __async(this, null, function* () {
    try {
      console.log(`[OkRu] Resolviendo: ${embedUrl}`);
      const raw = yield fetch(embedUrl, {
        headers: {
          "User-Agent": UA,
          "Accept": "text/html",
          "Referer": "https://ok.ru/"
        },
        redirect: "follow"
      }).then((r) => r.text());
      if (raw.includes("copyrightsRestricted") || raw.includes("COPYRIGHTS_RESTRICTED") || raw.includes("LIMITED_ACCESS") || raw.includes("notFound") || !raw.includes("urls")) {
        console.log("[OkRu] Video no disponible o eliminado");
        return null;
      }
      const data = raw.replace(/\\&quot;/g, '"').replace(/\\u0026/g, "&").replace(/\\/g, "");
      const matches = [...data.matchAll(/"name":"([^"]+)","url":"([^"]+)"/g)];
      const QUALITY_ORDER = ["full", "hd", "sd", "low", "lowest"];
      const videos = matches.map((m) => ({ type: m[1], url: m[2] })).filter((v) => !v.type.toLowerCase().includes("mobile") && v.url.startsWith("http"));
      if (videos.length === 0) {
        console.log("[OkRu] No se encontraron URLs");
        return null;
      }
      const sorted = videos.sort((a, b) => {
        const ai = QUALITY_ORDER.findIndex((q) => a.type.toLowerCase().includes(q));
        const bi = QUALITY_ORDER.findIndex((q) => b.type.toLowerCase().includes(q));
        return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
      });
      const best = sorted[0];
      console.log(`[OkRu] URL encontrada (${best.type}): ${best.url.substring(0, 80)}...`);
      const QUALITY_MAP = { full: "1080p", hd: "720p", sd: "480p", low: "360p", lowest: "240p" };
      return {
        url: best.url,
        quality: QUALITY_MAP[best.type] || best.type,
        headers: { "User-Agent": UA, "Referer": "https://ok.ru/" }
      };
    } catch (e) {
      console.log(`[OkRu] Error: ${e.message}`);
      return null;
    }
  });
}
var TMDB_API_KEY = process.env.TMDB_API_KEY;
var BASE_URL = "https://proyectox.yoyatengoabuela.com";
var UA2 = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
var HEADERS = {
  "User-Agent": UA2,
  "Accept": "application/json, text/javascript, */*",
  "Connection": "keep-alive",
  "Referer": BASE_URL + "/",
  "Origin": BASE_URL,
  "X-Requested-With": "XMLHttpRequest"
};
function getTmdbData(tmdbId, mediaType) {
  return __async(this, null, function* () {
    const [esMx, esEs, enUs] = yield Promise.all(
      ["es-MX", "es-ES", "en-US"].map(
        (lang) => fetch(`https://api.themoviedb.org/3/${mediaType}/${tmdbId}?api_key=${TMDB_API_KEY}&language=${lang}`, {
          headers: { "User-Agent": UA2 }
        }).then((r) => r.json()).catch(() => null)
      )
    );
    const data = esMx && !/[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]/.test(esMx.title || esMx.name || "") ? esMx : esEs || enUs;
    if (!data)
      return null;
    const title = mediaType === "movie" ? data.title : data.name;
    const originalTitle = mediaType === "movie" ? data.original_title : data.original_name;
    if (!title)
      return null;
    const name = data === esMx ? "Latino" : data === esEs ? "Espa\xF1a" : "Ingl\xE9s";
    console.log(`[Zoowomaniacos] TMDB (${name}): "${title}"`);
    return { title, originalTitle, year: (data.release_date || "").substring(0, 4) };
  });
}
function searchMovie(query) {
  return __async(this, null, function* () {
    try {
      const params = new URLSearchParams({
        "start": "0",
        "length": "20",
        "metodo": "ObtenerListaTotal",
        "search[value]": query
      }).toString();
      const response = yield fetch(`${BASE_URL}/alternativo3/server.php`, {
        method: "POST",
        headers: __spreadProps(__spreadValues({}, HEADERS), {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
        }),
        body: params
      });
      const data = yield response.json();
      return (data == null ? void 0 : data.data) || [];
    } catch (e) {
      console.log(`[Zoowomaniacos] Error b\xFAsqueda: ${e.message}`);
      return [];
    }
  });
}
function normalize(str = "") {
  return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^\p{L}\p{N}\s]/gu, " ").replace(/\s+/g, " ").trim();
}
function tokenize(str = "") {
  return normalize(str).split(" ").filter(Boolean);
}
function buildQueries(tmdbInfo) {
  var _a, _b, _c;
  const title = (_a = tmdbInfo.title) == null ? void 0 : _a.trim();
  const original = (_b = tmdbInfo.originalTitle) == null ? void 0 : _b.trim();
  const year = (_c = tmdbInfo.year) == null ? void 0 : _c.trim();
  const raw = [
    title && year ? `${title} ${year}` : null,
    title,
    original && year && original !== title ? `${original} ${year}` : null,
    original && original !== title ? original : null
  ];
  const seen = /* @__PURE__ */ new Set();
  return raw.filter(Boolean).filter((q) => {
    const k = normalize(q);
    if (!k || seen.has(k))
      return false;
    seen.add(k);
    return true;
  });
}
function scoreResult(result, tmdbInfo) {
  const resultTitle = normalize(result.a2 || "");
  const titles = [tmdbInfo.title, tmdbInfo.originalTitle].filter(Boolean).map(normalize);
  const targetYear = Number(tmdbInfo.year);
  const resultYear = Number(result.a4);
  let bestScore = -9999;
  for (const targetTitle of titles) {
    let score = 0;
    const targetTokens = tokenize(targetTitle);
    const resultTokens = tokenize(resultTitle);
    const shortTitle = targetTitle.length <= 3;
    if (resultTitle === targetTitle) {
      score += 500;
    }
    const commonTokens = targetTokens.filter((t) => resultTokens.includes(t));
    score += commonTokens.length * 40;
    const isSingleWord = targetTokens.length === 1;
    if (isSingleWord) {
      const exactWordMatch = resultTokens.includes(targetTokens[0]);
      if (exactWordMatch) {
        score += 150;
      } else {
        score -= 300;
      }
      if (resultTokens.length > 2) {
        score -= 200;
      }
    }
    if (targetTokens.length > 0 && targetTokens.every((t) => resultTokens.includes(t))) {
      const tokenRatio = targetTokens.length / resultTokens.length;
      if (isSingleWord) {
        score += 150;
      } else if (tokenRatio >= 0.6) {
        score += 550;
      } else if (tokenRatio >= 0.4) {
        score += 300;
      } else {
        score += 100;
      }
    }
    if (!shortTitle) {
      const tokenRatio = targetTokens.length / resultTokens.length;
      if (resultTitle.includes(targetTitle) && tokenRatio >= 0.4)
        score += 120;
      if (targetTitle.includes(resultTitle))
        score += 60;
    }
    if (shortTitle && resultTitle !== targetTitle) {
      score -= 250;
    }
    if (!isNaN(targetYear) && !isNaN(resultYear)) {
      const diff = Math.abs(targetYear - resultYear);
      if (diff === 0)
        score += 150;
      else if (diff === 1)
        score += 75;
      else if (diff === 2)
        score += 25;
      else if (diff <= 5)
        score -= diff * 15;
      else
        score -= diff * 60;
    }
    if (tmdbInfo.originalTitle && resultTitle.includes(normalize(tmdbInfo.originalTitle))) {
      score += 80;
    }
    bestScore = Math.max(bestScore, score);
  }
  return bestScore;
}
function selectBestResult(results, tmdbInfo) {
  if (!Array.isArray(results) || results.length === 0)
    return null;
  const ranked = results.map((r) => ({ r, score: scoreResult(r, tmdbInfo) })).sort((a, b) => b.score - a.score);
  const best = ranked[0];
  if (!best || best.score < 550)
    return null;
  return { result: best.r, score: best.score };
}
function getEmbeds(id) {
  return __async(this, null, function* () {
    try {
      const response = yield fetch(`${BASE_URL}/testplayer.php?id=${id}`, {
        headers: { "User-Agent": UA2, "Referer": BASE_URL + "/" }
      });
      const html = yield response.text();
      const urls = [...new Set(
        [...html.matchAll(/src=["'](https?:\/\/[^"']+)["']/g)].map((m) => m[1])
      )];
      const okru = urls.filter((url) => url.includes("ok.ru/videoembed/"));
      const archive = urls.filter(
        (url) => url.includes("archive.org") && (url.endsWith(".mp4") || url.endsWith(".mkv") || url.endsWith(".avi"))
      );
      return { okru, archive };
    } catch (e) {
      console.log(`[Zoowomaniacos] Error player: ${e.message}`);
      return { okru: [], archive: [] };
    }
  });
}
function getStreams(tmdbId, mediaType) {
  return __async(this, null, function* () {
    if (!tmdbId || mediaType !== "movie")
      return [];
    const startTime = Date.now();
    console.log(`[Zoowomaniacos] Buscando: TMDB ${tmdbId}`);
    try {
      const tmdbInfo = yield getTmdbData(tmdbId, mediaType);
      if (!tmdbInfo)
        return [];
      const queries = buildQueries(tmdbInfo);
      let selected = null;
      let bestScore = -Infinity;
      for (const q of queries) {
        console.log(`[Zoowomaniacos] Buscando: "${q}"`);
        const results = yield searchMovie(q);
        if (!results.length)
          continue;
        const best = selectBestResult(results, tmdbInfo);
        if (!best)
          continue;
        console.log(`[Zoowomaniacos] Candidato: "${best.result.a2}" | score=${best.score}`);
        if (best.score >= 600) {
          selected = best.result;
          bestScore = best.score;
          break;
        }
        if (best.score > bestScore) {
          bestScore = best.score;
          selected = best.result;
        }
      }
      if (!selected) {
        console.log(`[Zoowomaniacos] No se encontr\xF3 resultado con score suficiente (mejor: ${bestScore})`);
        return [];
      }
      console.log(`[Zoowomaniacos] Seleccionado: "${selected.a2}" (${selected.a4}) | score=${bestScore}`);
      const { okru: embedUrls, archive: archiveUrls } = yield getEmbeds(selected.a1);
      if (embedUrls.length === 0 && archiveUrls.length === 0) {
        console.log("[Zoowomaniacos] No hay embeds v\xE1lidos");
        return [];
      }
      const streams = [];
      if (embedUrls.length > 0) {
        console.log(`[Zoowomaniacos] Resolviendo ${embedUrls.length} embeds ok.ru...`);
        const results = yield Promise.allSettled(embedUrls.map((url) => resolve(url)));
        results.filter((r) => r.status === "fulfilled" && r.value).forEach((r) => streams.push({
          name: "Zoowomaniacos",
          title: `${r.value.quality} \xB7 OkRu`,
          url: r.value.url,
          quality: r.value.quality,
          headers: r.value.headers || {}
        }));
      }
      for (const url of archiveUrls) {
        streams.push({
          name: "Zoowomaniacos",
          title: "SD \xB7 Archive.org",
          url,
          quality: "SD",
          headers: { "User-Agent": UA2 }
        });
      }
      console.log(`[Zoowomaniacos] \u2713 ${streams.length} streams en ${((Date.now() - startTime) / 1e3).toFixed(2)}s`);
      return streams;
    } catch (e) {
      console.log(`[Zoowomaniacos] Error cr\xEDtico: ${e.message}`);
      return [];
    }
  });
}
