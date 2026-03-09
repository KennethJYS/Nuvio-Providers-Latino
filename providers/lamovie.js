var ue = Object.create;
var b = Object.defineProperty;
var de = Object.getOwnPropertyDescriptor;
var pe = Object.getOwnPropertyNames, H = Object.getOwnPropertySymbols, fe = Object.getPrototypeOf, G = Object.prototype.hasOwnProperty, me = Object.prototype.propertyIsEnumerable;
var j = (e, o, t) => o in e ? b(e, o, { enumerable: true, configurable: true, writable: true, value: t }) : e[o] = t, I = (e, o) => {
  for (var t in o || (o = {}))
    G.call(o, t) && j(e, t, o[t]);
  if (H)
    for (var t of H(o))
      me.call(o, t) && j(e, t, o[t]);
  return e;
};
var he = (e, o) => {
  for (var t in o)
    b(e, t, { get: o[t], enumerable: true });
}, K = (e, o, t, n) => {
  if (o && typeof o == "object" || typeof o == "function")
    for (let r of pe(o))
      !G.call(e, r) && r !== t && b(e, r, { get: () => o[r], enumerable: !(n = de(o, r)) || n.enumerable });
  return e;
};
var x = (e, o, t) => (t = e != null ? ue(fe(e)) : {}, K(o || !e || !e.__esModule ? b(t, "default", { value: e, enumerable: true }) : t, e)), ge = (e) => K(b({}, "__esModule", { value: true }), e);
var h = (e, o, t) => new Promise((n, r) => {
  var i = (l) => {
    try {
      a(t.next(l));
    } catch (u) {
      r(u);
    }
  }, s = (l) => {
    try {
      a(t.throw(l));
    } catch (u) {
      r(u);
    }
  }, a = (l) => l.done ? n(l.value) : Promise.resolve(l.value).then(i, s);
  a((t = t.apply(e, o)).next());
});
var _e = {};
he(_e, { getStreams: () => Te });
module.exports = ge(_e);
var U = x(require("axios"));
var X = x(require("axios"));
var J = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
function Q(e) {
  return h(this, null, function* () {
    try {
      console.log(`[GoodStream] Resolviendo: ${e}`);
      let t = (yield X.default.get(e, { headers: { "User-Agent": J, Referer: "https://goodstream.one", Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8" }, timeout: 15e3, maxRedirects: 5 })).data.match(/file:\s*"([^"]+)"/);
      if (!t)
        return console.log('[GoodStream] No se encontr\xF3 patr\xF3n file:"..."'), null;
      let n = t[1];
      return console.log(`[GoodStream] URL encontrada: ${n.substring(0, 80)}...`), { url: n, headers: { Referer: e, Origin: "https://goodstream.one", "User-Agent": J } };
    } catch (o) {
      return console.log(`[GoodStream] Error: ${o.message}`), null;
    }
  });
}
var Z = x(require("axios"));
var ye = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
function Y(e) {
  try {
    return typeof atob != "undefined" ? atob(e) : Buffer.from(e, "base64").toString("utf8");
  } catch (o) {
    return null;
  }
}
function ve(e, o) {
  try {
    let n = o.replace(/^\[|\]$/g, "").split("','").map((u) => u.replace(/^'+|'+$/g, "")).map((u) => u.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")), r = "";
    for (let u of e) {
      let c = u.charCodeAt(0);
      c > 64 && c < 91 ? c = (c - 52) % 26 + 65 : c > 96 && c < 123 && (c = (c - 84) % 26 + 97), r += String.fromCharCode(c);
    }
    for (let u of n)
      r = r.replace(new RegExp(u, "g"), "_");
    r = r.split("_").join("");
    let i = Y(r);
    if (!i)
      return null;
    let s = "";
    for (let u = 0; u < i.length; u++)
      s += String.fromCharCode((i.charCodeAt(u) - 3 + 256) % 256);
    let a = s.split("").reverse().join(""), l = Y(a);
    return l ? JSON.parse(l) : null;
  } catch (t) {
    return console.log("[VOE] voeDecode error:", t.message), null;
  }
}
function D(t) {
  return h(this, arguments, function* (e, o = {}) {
    return Z.default.get(e, { timeout: 15e3, maxRedirects: 5, headers: I({ "User-Agent": ye, Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8" }, o), validateStatus: (n) => n < 500 });
  });
}
function ee(e) {
  return h(this, null, function* () {
    try {
      console.log(`[VOE] Resolviendo: ${e}`);
      let o = yield D(e, { Referer: e }), t = String(o && o.data ? o.data : "");
      if (/permanentToken/i.test(t)) {
        let l = t.match(/window\.location\.href\s*=\s*'([^']+)'/i);
        if (l) {
          console.log(`[VOE] Permanent token redirect -> ${l[1]}`);
          let u = yield D(l[1], { Referer: e });
          u && u.data && (t = String(u.data));
        }
      }
      let n = t.match(/json">\s*\[\s*['"]([^'"]+)['"]\s*\]\s*<\/script>\s*<script[^>]*src=['"]([^'"]+)['"]/i);
      if (n) {
        let l = n[1], u = n[2].startsWith("http") ? n[2] : new URL(n[2], e).href;
        console.log(`[VOE] Found encoded array + loader: ${u}`);
        let c = yield D(u, { Referer: e }), p = c && c.data ? String(c.data) : "", d = p.match(/(\[(?:'[^']{1,10}'[\s,]*){4,12}\])/i) || p.match(/(\[(?:"[^"]{1,10}"[,\s]*){4,12}\])/i);
        if (d) {
          let m = ve(l, d[1]);
          if (m && (m.source || m.direct_access_url)) {
            let $ = m.source || m.direct_access_url;
            return console.log(`[VOE] URL encontrada: ${$.substring(0, 80)}...`), { url: $, headers: { Referer: e } };
          }
        }
      }
      let r = /(?:mp4|hls)'\s*:\s*'([^']+)'/gi, i = /(?:mp4|hls)"\s*:\s*"([^"]+)"/gi, s = [], a;
      for (; (a = r.exec(t)) !== null; )
        s.push(a);
      for (; (a = i.exec(t)) !== null; )
        s.push(a);
      for (let l of s) {
        let u = l[1];
        if (!u)
          continue;
        let c = u;
        if (c.startsWith("aHR0"))
          try {
            c = atob(c);
          } catch (p) {
          }
        return console.log(`[VOE] URL encontrada (fallback): ${c.substring(0, 80)}...`), { url: c, headers: { Referer: e } };
      }
      return console.log("[VOE] No se encontr\xF3 URL"), null;
    } catch (o) {
      return console.log(`[VOE] Error: ${o.message}`), null;
    }
  });
}
var z = x(require("axios")), A = x(require("crypto-js"));
var B = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
function C(e) {
  e = e.replace(/-/g, "+").replace(/_/g, "/");
  let o = (4 - e.length % 4) % 4;
  return A.default.enc.Base64.parse(e + "=".repeat(o));
}
function R(e) {
  let o = e.words, t = e.sigBytes, n = new Uint8Array(t);
  for (let r = 0; r < t; r++)
    n[r] = o[r >>> 2] >>> 24 - r % 4 * 8 & 255;
  return n;
}
function P(e) {
  let o = [];
  for (let t = 0; t < e.length; t += 4)
    o.push((e[t] || 0) << 24 | (e[t + 1] || 0) << 16 | (e[t + 2] || 0) << 8 | (e[t + 3] || 0));
  return A.default.lib.WordArray.create(o, e.length);
}
function te(e) {
  let o = new Uint8Array(e);
  for (let t = 15; t >= 12 && (o[t]++, o[t] === 0); t--)
    ;
  return o;
}
function we(e, o, t) {
  try {
    let n = new Uint8Array(16);
    n.set(o, 0), n[15] = 1;
    let r = te(n), i = P(e), s = new Uint8Array(t.length);
    for (let a = 0; a < t.length; a += 16) {
      let l = Math.min(16, t.length - a), u = P(r), c = A.default.AES.encrypt(u, i, { mode: A.default.mode.ECB, padding: A.default.pad.NoPadding }), p = R(c.ciphertext);
      for (let d = 0; d < l; d++)
        s[a + d] = t[a + d] ^ p[d];
      r = te(r);
    }
    return s;
  } catch (n) {
    return console.log("[Filemoon] AES-GCM error:", n.message), null;
  }
}
function q(e) {
  return h(this, null, function* () {
    var o, t, n;
    console.log(`[Filemoon] Resolviendo: ${e}`);
    try {
      let r = e.match(/\/(?:e|d)\/([a-z0-9]{12})/i);
      if (!r)
        return null;
      let i = r[1], { data: s } = yield z.default.get(`https://filemooon.link/api/videos/${i}/embed/playback`, { timeout: 7e3, headers: { "User-Agent": B, Referer: e } });
      if (s.error)
        return console.log(`[Filemoon] API error: ${s.error}`), null;
      let a = s.playback;
      if ((a == null ? void 0 : a.algorithm) !== "AES-256-GCM" || ((o = a.key_parts) == null ? void 0 : o.length) !== 2)
        return console.log("[Filemoon] Formato de cifrado no soportado"), null;
      let l = R(C(a.key_parts[0])), u = R(C(a.key_parts[1])), c = new Uint8Array(l.length + u.length);
      c.set(l, 0), c.set(u, l.length);
      let p;
      if (c.length === 32)
        p = c;
      else {
        let f = P(c);
        p = R(A.default.SHA256(f));
      }
      let d = R(C(a.iv)), m = R(C(a.payload));
      if (m.length < 16)
        return null;
      let $ = m.slice(0, -16), S = we(p, d, $);
      if (!S)
        return null;
      let F = "";
      for (let f = 0; f < S.length; f++)
        F += String.fromCharCode(S[f]);
      let g = (n = (t = JSON.parse(F).sources) == null ? void 0 : t[0]) == null ? void 0 : n.url;
      if (!g)
        return null;
      console.log(`[Filemoon] URL encontrada: ${g.substring(0, 80)}...`);
      let O = g;
      if (g.includes("master"))
        try {
          let y = (yield z.default.get(g, { timeout: 3e3, headers: { "User-Agent": B, Referer: e }, responseType: "text" })).data.split(`
`), v = 0, E = g;
          for (let w = 0; w < y.length; w++) {
            let L = y[w].trim();
            if (L.startsWith("#EXT-X-STREAM-INF")) {
              let T = L.match(/RESOLUTION=\d+x(\d+)/), M = T ? parseInt(T[1]) : 0;
              for (let _ = w + 1; _ < w + 3 && _ < y.length; _++) {
                let W = y[_].trim();
                if (W && !W.startsWith("#") && M > v) {
                  v = M, E = W.startsWith("http") ? W : new URL(W, g).toString();
                  break;
                }
              }
            }
          }
          v > 0 && (O = E, console.log(`[Filemoon] Mejor calidad: ${v}p`));
        } catch (f) {
          console.log(`[Filemoon] No se pudo parsear master: ${f.message}`);
        }
      return { url: O, headers: { "User-Agent": B, Referer: e, Origin: "https://filemoon.sx" } };
    } catch (r) {
      return console.log(`[Filemoon] Error: ${r.message}`), null;
    }
  });
}
var ne = x(require("axios"));
var oe = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
function k(e) {
  return h(this, null, function* () {
    try {
      let t = (yield ne.default.get(e, { headers: { "User-Agent": oe, Referer: "https://hlswish.com/", Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8" }, timeout: 15e3, maxRedirects: 5 })).data;
      console.log(`[HLSWish] Resolviendo: ${e}`);
      let n = t.match(/eval\(function\(p,a,c,k,e,[dr]\)\{[\s\S]+?\}\('([\s\S]+?)',(\d+),(\d+),'([\s\S]+?)'\.split\('\|'\)/);
      if (n) {
        let r = n[1], i = parseInt(n[2]), s = n[4].split("|"), a = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ", l = (p) => {
          let d = 0;
          for (let m = 0; m < p.length; m++)
            d = d * i + a.indexOf(p[m]);
          return d;
        }, c = r.replace(/\b(\w+)\b/g, (p) => {
          let d = l(p);
          return s[d] && s[d] !== "" ? s[d] : p;
        }).match(/["']([^"']+\.m3u8[^"']*)['"]/i);
        if (c)
          return console.log(`[HLSWish] URL encontrada: ${c[1].substring(0, 80)}...`), { url: c[1], headers: { "User-Agent": oe, Referer: "https://hlswish.com/" } };
      }
      return console.log("[HLSWish] No se encontr\xF3 URL"), null;
    } catch (o) {
      return console.log(`[HLSWish] Error: ${o.message}`), null;
    }
  });
}
var se = x(require("axios"));
var re = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
function ae(e) {
  return h(this, null, function* () {
    try {
      console.log(`[Vimeos] Resolviendo: ${e}`);
      let n = (yield se.default.get(e, { headers: { "User-Agent": re, Referer: "https://vimeos.net/", Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8" }, timeout: 15e3, maxRedirects: 5 })).data.match(/eval\(function\(p,a,c,k,e,[dr]\)\{[\s\S]+?\}\('([\s\S]+?)',(\d+),(\d+),'([\s\S]+?)'\.split\('\|'\)/);
      if (n) {
        let r = n[1], i = parseInt(n[2]), s = n[4].split("|"), a = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ", l = (p) => {
          let d = 0;
          for (let m = 0; m < p.length; m++)
            d = d * i + a.indexOf(p[m]);
          return d;
        }, c = r.replace(/\b(\w+)\b/g, (p) => {
          let d = l(p);
          return s[d] && s[d] !== "" ? s[d] : p;
        }).match(/["']([^"']+\.m3u8[^"']*)['"]/i);
        if (c)
          return console.log(`[Vimeos] URL encontrada: ${c[1].substring(0, 80)}...`), { url: c[1], headers: { "User-Agent": re, Referer: "https://vimeos.net/" } };
      }
      return console.log("[Vimeos] No se encontr\xF3 URL"), null;
    } catch (o) {
      return console.log(`[Vimeos] Error: ${o.message}`), null;
    }
  });
}
var $e = "439c478a771f35c05022f9feabcca01c", Se = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36", N = { "User-Agent": Se, Accept: "application/json" }, ie = /* @__PURE__ */ new Map(), xe = 10 * 60 * 1e3, Ae = { "goodstream.one": Q, "hlswish.com": k, "streamwish.com": k, "streamwish.to": k, "strwish.com": k, "voe.sx": ee, "filemoon.sx": q, "filemoon.to": q, "vimeos.net": ae }, Re = [], le = (e) => e.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim(), ce = (e, o) => {
  let t = le(e), n = le(o);
  if (t === n)
    return 1;
  if (t.includes(n) || n.includes(t))
    return 0.8;
  let r = new Set(t.split(/\s+/)), i = new Set(n.split(/\s+/));
  return [...r].filter((a) => i.has(a)).length / Math.max(r.size, i.size);
}, Ee = (e) => {
  let o = e.toString().toLowerCase(), t = o.match(/(\d+)/);
  return t ? `${t[1]}p` : o.includes("4k") || o.includes("uhd") ? "2160p" : o.includes("full") || o.includes("fhd") ? "1080p" : o.includes("hd") ? "720p" : "SD";
}, Le = (e) => e.includes("goodstream") ? "GoodStream" : e.includes("hlswish") || e.includes("streamwish") ? "StreamWish" : e.includes("voe.sx") ? "VOE" : e.includes("filemoon") ? "Filemoon" : e.includes("vimeos.net") ? "Vimeos" : "Online", Me = (e) => {
  try {
    let o = new URL(e).hostname.replace("www.", "");
    if (Re.some((t) => e.includes(t)))
      return null;
    for (let [t, n] of Object.entries(Ae))
      if (e.includes(t))
        return n;
  } catch (o) {
  }
  return null;
};
function We(e, o) {
  return h(this, null, function* () {
    let t = [{ lang: "es-MX", name: "Latino" }, { lang: "en-US", name: "Ingl\xE9s" }, { lang: "es-ES", name: "Espa\xF1a" }];
    for (let { lang: n, name: r } of t)
      try {
        let i = `https://api.themoviedb.org/3/${o}/${e}?api_key=${$e}&language=${n}`, { data: s } = yield U.default.get(i, { timeout: 5e3, headers: N }), a = o === "movie" ? s.title : s.name, l = o === "movie" ? s.original_title : s.original_name;
        if (n === "es-MX" && /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]/.test(a))
          continue;
        return console.log(`[LaMovie] TMDB (${r}): "${a}"${a !== l ? ` | Original: "${l}"` : ""}`), { title: a, originalTitle: l, year: (s.release_date || s.first_air_date || "").substring(0, 4) };
      } catch (i) {
        console.log(`[LaMovie] Error TMDB ${r}: ${i.message}`);
      }
    return null;
  });
}
function be(e, o) {
  let t = /* @__PURE__ */ new Set(), { title: n, originalTitle: r, year: i } = e;
  if (n) {
    t.add(n.trim());
    let s = n.replace(/[¿¡:;"']/g, "").replace(/\s+/g, " ").trim();
    s !== n && t.add(s);
  }
  return r && r !== n && !/[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]/.test(r) && t.add(r.trim()), o === "movie" && i && [...t].forEach((a) => {
    a.includes(i) || (t.add(`${a} ${i}`), t.add(`${a} (${i})`));
  }), [...t].forEach((s) => {
    let a = s.replace(/^(el|la|los|las|the|a|an)\s+/i, "").trim();
    a.length > 2 && t.add(a);
  }), [...t].slice(0, 8);
}
function ke(e, o) {
  return h(this, null, function* () {
    var r;
    let n = `https://la.movie/wp-api/v1/search?filter=%7B%7D&postType=any&q=${encodeURIComponent(e.trim())}&postsPerPage=10`;
    try {
      let { data: i } = yield U.default.get(n, { timeout: 8e3, headers: N });
      return (r = i == null ? void 0 : i.data) != null && r.posts ? i.data.posts.filter((s) => o === "movie" ? s.type === "movie" || s.type === "movies" : s.type === "tvshow" || s.type === "tvshows" || s.type === "series") : [];
    } catch (i) {
      return [];
    }
  });
}
function Ue(e, o) {
  if (e.length === 0)
    return null;
  if (e.length === 1)
    return e[0];
  let t = e.map((n) => {
    let r = ce(n.title || "", o.title) * 2;
    return o.originalTitle && (r += ce(n.title || "", o.originalTitle)), o.year && n.year && n.year.toString() === o.year && (r += 0.5), { result: n, score: r };
  });
  return t.sort((n, r) => r.score - n.score), t[0].result;
}
function Fe(e, o, t) {
  return h(this, null, function* () {
    var r;
    let n = `https://la.movie/wp-api/v1/single/episodes/list?_id=${e}&season=${o}&page=1&postsPerPage=50`;
    try {
      let { data: i } = yield U.default.get(n, { timeout: 12e3, headers: N });
      if (!((r = i == null ? void 0 : i.data) != null && r.posts))
        return null;
      let s = i.data.posts.find((a) => a.season_number == o && a.episode_number == t);
      return (s == null ? void 0 : s._id) || null;
    } catch (i) {
      return console.log(`[LaMovie] Error episodios: ${i.message}`), null;
    }
  });
}
function Oe(e) {
  return h(this, null, function* () {
    try {
      let o = Me(e.url);
      if (!o)
        return console.log(`[LaMovie] Sin resolver para: ${e.url}`), null;
      let t = yield o(e.url);
      if (!t || !t.url)
        return null;
      let n = Ee(e.quality || "1080p"), r = Le(e.url);
      return { name: "LaMovie", title: `${n} \xB7 ${r}`, url: t.url, quality: n, headers: t.headers || {} };
    } catch (o) {
      return console.log(`[LaMovie] Error procesando embed: ${o.message}`), null;
    }
  });
}
function Te(e, o, t, n) {
  return h(this, null, function* () {
    var a;
    let r = `${e}-${o}-${t || ""}-${n || ""}`, i = ie.get(r);
    if (i && Date.now() - i.ts < xe)
      return console.log(`[LaMovie] Cache hit: ${r}`), i.streams;
    if (!e || !o)
      return [];
    let s = Date.now();
    console.log(`[LaMovie] Buscando: TMDB ${e} (${o})${t ? ` S${t}E${n}` : ""}`);
    try {
      let l = yield We(e, o);
      if (!l)
        return [];
      let u = be(l, o);
      console.log(`[LaMovie] ${u.length} variantes generadas`);
      let c = u.slice(0, 3).map((f) => h(this, null, function* () {
        let y = yield ke(f, o);
        return { variant: f, results: y };
      })), p = yield Promise.allSettled(c), d = null;
      for (let f of p)
        if (f.status === "fulfilled" && f.value.results.length > 0) {
          d = f.value;
          break;
        }
      if (!d)
        return console.log("[LaMovie] Sin resultados"), [];
      console.log(`[LaMovie] \u2713 "${d.variant}" (${d.results.length} resultados)`);
      let m = Ue(d.results, l);
      if (!m)
        return [];
      let $ = m._id;
      if (o === "tv" && t && n) {
        let f = yield Fe($, t, n);
        if (!f)
          return console.log(`[LaMovie] Episodio S${t}E${n} no encontrado`), [];
        $ = f;
      }
      let { data: S } = yield U.default.get(`https://la.movie/wp-api/v1/player?postId=${$}&demo=0`, { timeout: 6e3, headers: N });
      if (!((a = S == null ? void 0 : S.data) != null && a.embeds))
        return console.log("[LaMovie] No hay embeds disponibles"), [];
      let F = 5e3, V = S.data.embeds.map((f) => Oe(f)), g = yield new Promise((f) => {
        let y = [], v = 0, E = V.length, w = () => f(y.filter(Boolean)), L = setTimeout(w, F);
        V.forEach((T) => {
          T.then((M) => {
            M && y.push(M), v++, v === E && (clearTimeout(L), w());
          }).catch(() => {
            v++, v === E && (clearTimeout(L), w());
          });
        });
      }), O = ((Date.now() - s) / 1e3).toFixed(2);
      return console.log(`[LaMovie] \u2713 ${g.length} streams en ${O}s`), ie.set(r, { streams: g, ts: Date.now() }), g;
    } catch (l) {
      return console.log(`[LaMovie] Error: ${l.message}`), [];
    }
  });
}
