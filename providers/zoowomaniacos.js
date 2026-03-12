var E = Object.create;
var f = Object.defineProperty;
var L = Object.getOwnPropertyDescriptor;
var k = Object.getOwnPropertyNames;
var U = Object.getPrototypeOf, b = Object.prototype.hasOwnProperty;
var x = (t, e) => {
  for (var s in e)
    f(t, s, { get: e[s], enumerable: true });
}, R = (t, e, s, i) => {
  if (e && typeof e == "object" || typeof e == "function")
    for (let n of k(e))
      !b.call(t, n) && n !== s && f(t, n, { get: () => e[n], enumerable: !(i = L(e, n)) || i.enumerable });
  return t;
};
var $ = (t, e, s) => (s = t != null ? E(U(t)) : {}, R(e || !t || !t.__esModule ? f(s, "default", { value: t, enumerable: true }) : s, t)), O = (t) => R(f({}, "__esModule", { value: true }), t);
var g = (t, e, s) => new Promise((i, n) => {
  var a = (r) => {
    try {
      o(s.next(r));
    } catch (u) {
      n(u);
    }
  }, l = (r) => {
    try {
      o(s.throw(r));
    } catch (u) {
      n(u);
    }
  }, o = (r) => r.done ? i(r.value) : Promise.resolve(r.value).then(a, l);
  o((s = s.apply(t, e)).next());
});
var P = {};
x(P, { getStreams: () => F });
module.exports = O(P);
var w = $(require("axios"));
var v = $(require("axios"));
var A = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
function T(t) {
  return g(this, null, function* () {
    try {
      console.log(`[OkRu] Resolviendo: ${t}`);
      let { data: e } = yield v.default.get(t, { timeout: 1e4, headers: { "User-Agent": A, Accept: "text/html", Referer: "https://ok.ru/" } });
      if (e.includes("copyrightsRestricted") || e.includes("COPYRIGHTS_RESTRICTED") || e.includes("LIMITED_ACCESS") || e.includes("notFound") || !e.includes("urls"))
        return console.log("[OkRu] Video no disponible o eliminado"), null;
      let i = [...e.replace(/\\&quot;/g, '"').replace(/\\u0026/g, "&").replace(/\\/g, "").matchAll(/"name":"([^"]+)","url":"([^"]+)"/g)], n = ["full", "hd", "sd", "low", "lowest"], a = i.map((u) => ({ type: u[1], url: u[2] })).filter((u) => !u.type.toLowerCase().includes("mobile") && u.url.startsWith("http"));
      if (a.length === 0)
        return console.log("[OkRu] No se encontraron URLs"), null;
      let o = a.sort((u, d) => {
        let h = n.findIndex((m) => u.type.toLowerCase().includes(m)), c = n.findIndex((m) => d.type.toLowerCase().includes(m));
        return (h === -1 ? 99 : h) - (c === -1 ? 99 : c);
      })[0];
      console.log(`[OkRu] URL encontrada (${o.type}): ${o.url.substring(0, 80)}...`);
      let r = { full: "1080p", hd: "720p", sd: "480p", low: "360p", lowest: "240p" };
      return { url: o.url, quality: r[o.type] || o.type, headers: { "User-Agent": A, Referer: "https://ok.ru/" } };
    } catch (e) {
      return console.log(`[OkRu] Error: ${e.message}`), null;
    }
  });
}
var D = "439c478a771f35c05022f9feabcca01c", p = "https://proyectox.yoyatengoabuela.com", y = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36", M = { "User-Agent": y, Accept: "application/json, text/javascript, */*", Connection: "keep-alive", Referer: p + "/", Origin: p, "X-Requested-With": "XMLHttpRequest" }, S = ["332656282246", "1683045747235"];
function Z(t, e) {
  return g(this, null, function* () {
    let s = [{ lang: "es-MX", name: "Latino" }, { lang: "en-US", name: "Ingl\xE9s" }];
    for (let { lang: i, name: n } of s)
      try {
        let a = `https://api.themoviedb.org/3/${e}/${t}?api_key=${D}&language=${i}`, { data: l } = yield w.default.get(a, { timeout: 5e3, headers: { "User-Agent": y } }), o = e === "movie" ? l.title : l.name, r = e === "movie" ? l.original_title : l.original_name;
        if (!o || i === "es-MX" && /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]/.test(o))
          continue;
        return console.log(`[Zoowomaniacos] TMDB (${n}): "${o}"`), { title: o, originalTitle: r, year: (l.release_date || "").substring(0, 4) };
      } catch (a) {
        console.log(`[Zoowomaniacos] Error TMDB ${n}: ${a.message}`);
      }
    return null;
  });
}
function _(t) {
  return g(this, null, function* () {
    try {
      let { data: e } = yield w.default.post(`${p}/alternativo3/server.php`, new URLSearchParams({ start: "0", length: "10", metodo: "ObtenerListaTotal", "search[value]": t, "searchPanes[a3][0]": "", "searchPanes[a4][0]": "", "searchPanes[a5][0]": "", "searchPanes[a6][0]": "" }), { timeout: 8e3, headers: M });
      return (e == null ? void 0 : e.data) || [];
    } catch (e) {
      return console.log(`[Zoowomaniacos] Error b\xFAsqueda: ${e.message}`), [];
    }
  });
}
function q(t, e) {
  if (t.length === 0)
    return null;
  if (t.length === 1)
    return t[0];
  let s = (l) => l.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim(), i = s(e.title), n = e.originalTitle ? s(e.originalTitle) : "", a = t.map((l) => {
    let o = s((l.a2 || "").split("-")[0].trim()), r = 0;
    return o === i || o === n ? r += 3 : (o.includes(i) || i.includes(o)) && (r += 1.5), e.year && l.a4 === e.year && (r += 1), { r: l, score: r };
  });
  return a.sort((l, o) => o.score - l.score), a[0].r;
}
function C(t) {
  return g(this, null, function* () {
    try {
      let { data: e } = yield w.default.get(`${p}/testplayer.php?id=${t}`, { timeout: 8e3, headers: { "User-Agent": y, Accept: "text/html", Referer: p + "/" } }), s = [...e.matchAll(/src="(https?:\/\/[^"]+)"/g)];
      return [...new Set(s.map((n) => n[1]))].filter((n) => {
        if (!n.includes("ok.ru/videoembed/"))
          return false;
        let a = n.split("/").pop();
        return !S.includes(a);
      });
    } catch (e) {
      return console.log(`[Zoowomaniacos] Error player: ${e.message}`), [];
    }
  });
}
function F(t, e, s, i) {
  return g(this, null, function* () {
    if (!t || e !== "movie")
      return [];
    let n = Date.now();
    console.log(`[Zoowomaniacos] Buscando: TMDB ${t}`);
    try {
      let a = yield Z(t, e);
      if (!a)
        return [];
      let l = [a.title];
      a.originalTitle && a.originalTitle !== a.title && l.push(a.originalTitle);
      let o = null;
      for (let c of l) {
        let m = yield _(c);
        if (m.length > 0 && (o = q(m, a), o)) {
          console.log(`[Zoowomaniacos] \u2713 Encontrado: "${o.a2}" (${o.a4}) id:${o.a1}`);
          break;
        }
      }
      if (!o)
        return console.log("[Zoowomaniacos] No encontrado"), [];
      let r = yield C(o.a1);
      if (r.length === 0)
        return console.log("[Zoowomaniacos] No hay embeds v\xE1lidos"), [];
      console.log(`[Zoowomaniacos] Resolviendo ${r.length} embeds ok.ru...`);
      let d = (yield Promise.allSettled(r.map((c) => T(c)))).filter((c) => c.status === "fulfilled" && c.value).map((c) => ({ name: "Zoowomaniacos", title: `${c.value.quality} \xB7 OkRu`, url: c.value.url, quality: c.value.quality, headers: c.value.headers || {} })), h = ((Date.now() - n) / 1e3).toFixed(2);
      return console.log(`[Zoowomaniacos] \u2713 ${d.length} streams en ${h}s`), d;
    } catch (a) {
      return console.log(`[Zoowomaniacos] Error: ${a.message}`), [];
    }
  });
}
