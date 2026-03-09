var de = Object.create;
var E = Object.defineProperty;
var fe = Object.getOwnPropertyDescriptor;
var me = Object.getOwnPropertyNames, H = Object.getOwnPropertySymbols, he = Object.getPrototypeOf, K = Object.prototype.hasOwnProperty, ge = Object.prototype.propertyIsEnumerable;
var j = (e, t, n) => t in e ? E(e, t, { enumerable: true, configurable: true, writable: true, value: n }) : e[t] = n, P = (e, t) => {
  for (var n in t || (t = {}))
    K.call(t, n) && j(e, n, t[n]);
  if (H)
    for (var n of H(t))
      ge.call(t, n) && j(e, n, t[n]);
  return e;
};
var pe = (e, t) => {
  for (var n in t)
    E(e, n, { get: t[n], enumerable: true });
}, I = (e, t, n, o) => {
  if (t && typeof t == "object" || typeof t == "function")
    for (let r of me(t))
      !K.call(e, r) && r !== n && E(e, r, { get: () => t[r], enumerable: !(o = fe(t, r)) || o.enumerable });
  return e;
};
var S = (e, t, n) => (n = e != null ? de(he(e)) : {}, I(t || !e || !e.__esModule ? E(n, "default", { value: e, enumerable: true }) : n, e)), ye = (e) => I(E({}, "__esModule", { value: true }), e);
var h = (e, t, n) => new Promise((o, r) => {
  var u = (i) => {
    try {
      s(n.next(i));
    } catch (c) {
      r(c);
    }
  }, l = (i) => {
    try {
      s(n.throw(i));
    } catch (c) {
      r(c);
    }
  }, s = (i) => i.done ? o(i.value) : Promise.resolve(i.value).then(u, l);
  s((n = n.apply(e, t)).next());
});
var Le = {};
pe(Le, { getStreams: () => Oe });
module.exports = ye(Le);
var W = S(require("axios"));
var X = S(require("axios"));
var J = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
function Y(e) {
  return h(this, null, function* () {
    try {
      console.log(`[GoodStream] Resolviendo: ${e}`);
      let n = (yield X.default.get(e, { headers: { "User-Agent": J, Referer: "https://goodstream.one", Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8" }, timeout: 15e3, maxRedirects: 5 })).data.match(/file:\s*"([^"]+)"/);
      if (!n)
        return console.log('[GoodStream] No se encontr\xF3 patr\xF3n file:"..."'), null;
      let o = n[1];
      return console.log(`[GoodStream] URL encontrada: ${o.substring(0, 80)}...`), { url: o, headers: { Referer: e, Origin: "https://goodstream.one", "User-Agent": J } };
    } catch (t) {
      return console.log(`[GoodStream] Error: ${t.message}`), null;
    }
  });
}
var Q = S(require("axios"));
var we = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
function Z(e) {
  try {
    return typeof atob != "undefined" ? atob(e) : Buffer.from(e, "base64").toString("utf8");
  } catch (t) {
    return null;
  }
}
function xe(e, t) {
  try {
    let o = t.replace(/^\[|\]$/g, "").split("','").map((c) => c.replace(/^'+|'+$/g, "")).map((c) => c.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")), r = "";
    for (let c of e) {
      let a = c.charCodeAt(0);
      a > 64 && a < 91 ? a = (a - 52) % 26 + 65 : a > 96 && a < 123 && (a = (a - 84) % 26 + 97), r += String.fromCharCode(a);
    }
    for (let c of o)
      r = r.replace(new RegExp(c, "g"), "_");
    r = r.split("_").join("");
    let u = Z(r);
    if (!u)
      return null;
    let l = "";
    for (let c = 0; c < u.length; c++)
      l += String.fromCharCode((u.charCodeAt(c) - 3 + 256) % 256);
    let s = l.split("").reverse().join(""), i = Z(s);
    return i ? JSON.parse(i) : null;
  } catch (n) {
    return console.log("[VOE] voeDecode error:", n.message), null;
  }
}
function F(n) {
  return h(this, arguments, function* (e, t = {}) {
    return Q.default.get(e, { timeout: 15e3, maxRedirects: 5, headers: P({ "User-Agent": we, Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8" }, t), validateStatus: (o) => o < 500 });
  });
}
function ee(e) {
  return h(this, null, function* () {
    try {
      console.log(`[VOE] Resolviendo: ${e}`);
      let t = yield F(e, { Referer: e }), n = String(t && t.data ? t.data : "");
      if (/permanentToken/i.test(n)) {
        let i = n.match(/window\.location\.href\s*=\s*'([^']+)'/i);
        if (i) {
          console.log(`[VOE] Permanent token redirect -> ${i[1]}`);
          let c = yield F(i[1], { Referer: e });
          c && c.data && (n = String(c.data));
        }
      }
      let o = n.match(/json">\s*\[\s*['"]([^'"]+)['"]\s*\]\s*<\/script>\s*<script[^>]*src=['"]([^'"]+)['"]/i);
      if (o) {
        let i = o[1], c = o[2].startsWith("http") ? o[2] : new URL(o[2], e).href;
        console.log(`[VOE] Found encoded array + loader: ${c}`);
        let a = yield F(c, { Referer: e }), f = a && a.data ? String(a.data) : "", d = f.match(/(\[(?:'[^']{1,10}'[\s,]*){4,12}\])/i) || f.match(/(\[(?:"[^"]{1,10}"[,\s]*){4,12}\])/i);
        if (d) {
          let m = xe(i, d[1]);
          if (m && (m.source || m.direct_access_url)) {
            let p = m.source || m.direct_access_url;
            return console.log(`[VOE] URL encontrada: ${p.substring(0, 80)}...`), { url: p, headers: { Referer: e } };
          }
        }
      }
      let r = /(?:mp4|hls)'\s*:\s*'([^']+)'/gi, u = /(?:mp4|hls)"\s*:\s*"([^"]+)"/gi, l = [], s;
      for (; (s = r.exec(n)) !== null; )
        l.push(s);
      for (; (s = u.exec(n)) !== null; )
        l.push(s);
      for (let i of l) {
        let c = i[1];
        if (!c)
          continue;
        let a = c;
        if (a.startsWith("aHR0"))
          try {
            a = atob(a);
          } catch (f) {
          }
        return console.log(`[VOE] URL encontrada (fallback): ${a.substring(0, 80)}...`), { url: a, headers: { Referer: e } };
      }
      return console.log("[VOE] No se encontr\xF3 URL"), null;
    } catch (t) {
      return console.log(`[VOE] Error: ${t.message}`), null;
    }
  });
}
var N = S(require("axios")), $ = S(require("crypto-js"));
var T = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
function L(e) {
  e = e.replace(/-/g, "+").replace(/_/g, "/");
  let t = (4 - e.length % 4) % 4;
  return $.default.enc.Base64.parse(e + "=".repeat(t));
}
function A(e) {
  let t = e.words, n = e.sigBytes, o = new Uint8Array(n);
  for (let r = 0; r < n; r++)
    o[r] = t[r >>> 2] >>> 24 - r % 4 * 8 & 255;
  return o;
}
function V(e) {
  let t = [];
  for (let n = 0; n < e.length; n += 4)
    t.push((e[n] || 0) << 24 | (e[n + 1] || 0) << 16 | (e[n + 2] || 0) << 8 | (e[n + 3] || 0));
  return $.default.lib.WordArray.create(t, e.length);
}
function te(e) {
  let t = new Uint8Array(e);
  for (let n = 15; n >= 12 && (t[n]++, t[n] === 0); n--)
    ;
  return t;
}
function Se(e, t, n) {
  try {
    let o = new Uint8Array(16);
    o.set(t, 0), o[15] = 1;
    let r = te(o), u = V(e), l = new Uint8Array(n.length);
    for (let s = 0; s < n.length; s += 16) {
      let i = Math.min(16, n.length - s), c = V(r), a = $.default.AES.encrypt(c, u, { mode: $.default.mode.ECB, padding: $.default.pad.NoPadding }), f = A(a.ciphertext);
      for (let d = 0; d < i; d++)
        l[s + d] = n[s + d] ^ f[d];
      r = te(r);
    }
    return l;
  } catch (o) {
    return console.log("[Filemoon] AES-GCM error:", o.message), null;
  }
}
function B(e) {
  return h(this, null, function* () {
    var t, n, o;
    console.log(`[Filemoon] Resolviendo: ${e}`);
    try {
      let r = e.match(/\/(?:e|d)\/([a-z0-9]{12})/i);
      if (!r)
        return null;
      let u = r[1], { data: l } = yield N.default.get(`https://filemooon.link/api/videos/${u}/embed/playback`, { timeout: 7e3, headers: { "User-Agent": T, Referer: e } });
      if (l.error)
        return console.log(`[Filemoon] API error: ${l.error}`), null;
      let s = l.playback;
      if ((s == null ? void 0 : s.algorithm) !== "AES-256-GCM" || ((t = s.key_parts) == null ? void 0 : t.length) !== 2)
        return console.log("[Filemoon] Formato de cifrado no soportado"), null;
      let i = A(L(s.key_parts[0])), c = A(L(s.key_parts[1])), a = new Uint8Array(i.length + c.length);
      a.set(i, 0), a.set(c, i.length);
      let f;
      if (a.length === 32)
        f = a;
      else {
        let w = V(a);
        f = A($.default.SHA256(w));
      }
      let d = A(L(s.iv)), m = A(L(s.payload));
      if (m.length < 16)
        return null;
      let p = m.slice(0, -16), g = Se(f, d, p);
      if (!g)
        return null;
      let C = "";
      for (let w = 0; w < g.length; w++)
        C += String.fromCharCode(g[w]);
      let y = (o = (n = JSON.parse(C).sources) == null ? void 0 : n[0]) == null ? void 0 : o.url;
      if (!y)
        return null;
      console.log(`[Filemoon] URL encontrada: ${y.substring(0, 80)}...`);
      let R = y;
      if (y.includes("master"))
        try {
          let x = (yield N.default.get(y, { timeout: 3e3, headers: { "User-Agent": T, Referer: e }, responseType: "text" })).data.split(`
`), M = 0, D = y;
          for (let v = 0; v < x.length; v++) {
            let q = x[v].trim();
            if (q.startsWith("#EXT-X-STREAM-INF")) {
              let z = q.match(/RESOLUTION=\d+x(\d+)/), G = z ? parseInt(z[1]) : 0;
              for (let O = v + 1; O < v + 3 && O < x.length; O++) {
                let b = x[O].trim();
                if (b && !b.startsWith("#") && G > M) {
                  M = G, D = b.startsWith("http") ? b : new URL(b, y).toString();
                  break;
                }
              }
            }
          }
          M > 0 && (R = D, console.log(`[Filemoon] Mejor calidad: ${M}p`));
        } catch (w) {
          console.log(`[Filemoon] No se pudo parsear master: ${w.message}`);
        }
      return { url: R, headers: { "User-Agent": T, Referer: e, Origin: "https://filemoon.sx" } };
    } catch (r) {
      return console.log(`[Filemoon] Error: ${r.message}`), null;
    }
  });
}
var oe = S(require("axios"));
var ne = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
function U(e) {
  return h(this, null, function* () {
    try {
      let n = (yield oe.default.get(e, { headers: { "User-Agent": ne, Referer: "https://hlswish.com/", Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8" }, timeout: 15e3, maxRedirects: 5 })).data;
      console.log(`[HLSWish] Resolviendo: ${e}`);
      let o = n.match(/eval\(function\(p,a,c,k,e,[dr]\)\{[\s\S]+?\}\('([\s\S]+?)',(\d+),(\d+),'([\s\S]+?)'\.split\('\|'\)/);
      if (o) {
        let r = o[1], u = parseInt(o[2]), l = o[4].split("|"), s = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ", i = (f) => {
          let d = 0;
          for (let m = 0; m < f.length; m++)
            d = d * u + s.indexOf(f[m]);
          return d;
        }, a = r.replace(/\b(\w+)\b/g, (f) => {
          let d = i(f);
          return l[d] && l[d] !== "" ? l[d] : f;
        }).match(/["']([^"']+\.m3u8[^"']*)['"]/i);
        if (a)
          return console.log(`[HLSWish] URL encontrada: ${a[1].substring(0, 80)}...`), { url: a[1], headers: { "User-Agent": ne, Referer: "https://hlswish.com/" } };
      }
      return console.log("[HLSWish] No se encontr\xF3 URL"), null;
    } catch (t) {
      return console.log(`[HLSWish] Error: ${t.message}`), null;
    }
  });
}
var se = S(require("axios"));
var re = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
function ae(e) {
  return h(this, null, function* () {
    try {
      console.log(`[Vimeos] Resolviendo: ${e}`);
      let o = (yield se.default.get(e, { headers: { "User-Agent": re, Referer: "https://vimeos.net/", Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8" }, timeout: 15e3, maxRedirects: 5 })).data.match(/eval\(function\(p,a,c,k,e,[dr]\)\{[\s\S]+?\}\('([\s\S]+?)',(\d+),(\d+),'([\s\S]+?)'\.split\('\|'\)/);
      if (o) {
        let r = o[1], u = parseInt(o[2]), l = o[4].split("|"), s = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ", i = (f) => {
          let d = 0;
          for (let m = 0; m < f.length; m++)
            d = d * u + s.indexOf(f[m]);
          return d;
        }, a = r.replace(/\b(\w+)\b/g, (f) => {
          let d = i(f);
          return l[d] && l[d] !== "" ? l[d] : f;
        }).match(/["']([^"']+\.m3u8[^"']*)['"]/i);
        if (a)
          return console.log(`[Vimeos] URL encontrada: ${a[1].substring(0, 80)}...`), { url: a[1], headers: { "User-Agent": re, Referer: "https://vimeos.net/" } };
      }
      return console.log("[Vimeos] No se encontr\xF3 URL"), null;
    } catch (t) {
      return console.log(`[Vimeos] Error: ${t.message}`), null;
    }
  });
}
var $e = "439c478a771f35c05022f9feabcca01c", ue = "https://cinecalidad.vg", Ae = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36", _ = { "User-Agent": Ae, Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8", "Accept-Language": "es-MX,es;q=0.9", Referer: ue + "/" }, ie = { "goodstream.one": Y, "hlswish.com": U, "streamwish.com": U, "streamwish.to": U, "strwish.com": U, "voe.sx": ee, "filemoon.sx": B, "filemoon.to": B, "vimeos.net": ae }, le = (e) => e.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim(), ce = (e, t) => {
  let n = le(e), o = le(t);
  if (n === o)
    return 1;
  if (n.includes(o) || o.includes(n))
    return 0.8;
  let r = new Set(n.split(/\s+/)), u = new Set(o.split(/\s+/));
  return [...r].filter((s) => u.has(s)).length / Math.max(r.size, u.size);
}, Ce = (e) => e.includes("goodstream") ? "GoodStream" : e.includes("hlswish") || e.includes("streamwish") || e.includes("strwish") ? "StreamWish" : e.includes("voe.sx") ? "VOE" : e.includes("filemoon") ? "Filemoon" : e.includes("vimeos") ? "Vimeos" : "Online", Re = (e) => {
  if (!e || !e.startsWith("http"))
    return null;
  for (let t in ie)
    if (e.includes(t))
      return ie[t];
  return null;
};
function ve(e) {
  try {
    return typeof atob != "undefined" ? atob(e) : Buffer.from(e, "base64").toString("utf8");
  } catch (t) {
    return null;
  }
}
function be(e, t) {
  return h(this, null, function* () {
    let n = [{ lang: "es-MX", name: "Latino" }, { lang: "es-ES", name: "Espa\xF1a" }, { lang: "en-US", name: "Ingl\xE9s" }];
    for (let { lang: o, name: r } of n)
      try {
        let u = `https://api.themoviedb.org/3/${t}/${e}?api_key=${$e}&language=${o}`, { data: l } = yield W.default.get(u, { timeout: 5e3 }), s = t === "movie" ? l.title : l.name, i = t === "movie" ? l.original_title : l.original_name;
        if (!s || o === "es-MX" && /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]/.test(s))
          continue;
        return console.log(`[CineCalidad] TMDB (${r}): "${s}"${s !== i ? ` | Original: "${i}"` : ""}`), { title: s, originalTitle: i, year: (l.release_date || l.first_air_date || "").substring(0, 4) };
      } catch (u) {
        console.log(`[CineCalidad] Error TMDB ${r}: ${u.message}`);
      }
    return null;
  });
}
function Ee(e) {
  let t = /* @__PURE__ */ new Set(), { title: n, originalTitle: o, year: r } = e;
  if (n) {
    t.add(n.trim());
    let u = n.replace(/[¿¡:;"']/g, "").replace(/\s+/g, " ").trim();
    u !== n && t.add(u);
  }
  return o && o !== n && !/[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]/.test(o) && t.add(o.trim()), [...t].slice(0, 4);
}
function Ue(e) {
  return h(this, null, function* () {
    let t = `${ue}/?s=${encodeURIComponent(e)}`;
    try {
      let { data: n } = yield W.default.get(t, { timeout: 8e3, headers: _ }), o = [], r = 0;
      for (; ; ) {
        let l = n.indexOf("<article", r);
        if (l === -1)
          break;
        let s = n.indexOf("</article>", l);
        if (s === -1)
          break;
        o.push(n.substring(l, s + 10)), r = s + 10;
      }
      let u = [];
      for (let l of o) {
        if (l.includes("/serie/"))
          continue;
        let s = l.match(/class="absolute top-0[^"]*"[^>]+href="([^"]+)"/);
        if (!s)
          continue;
        let i = s[1], c = l.match(/<span class="sr-only">([^<]+)<\/span>/);
        if (!c)
          continue;
        let a = c[1].trim(), f = l.match(/>\s*(\d{4})\s*<\/div>/), d = f ? f[1] : "";
        u.push({ url: i, title: a, year: d });
      }
      return u;
    } catch (n) {
      return console.log(`[CineCalidad] Error b\xFAsqueda "${e}": ${n.message}`), [];
    }
  });
}
function We(e, t) {
  if (e.length === 0)
    return null;
  if (e.length === 1)
    return e[0];
  let n = e.map((o) => {
    let r = ce(o.title, t.title) * 2;
    return t.originalTitle && (r += ce(o.title, t.originalTitle)), t.year && o.year && o.year === t.year && (r += 0.5), { result: o, score: r };
  });
  return n.sort((o, r) => r.score - o.score), n[0].result;
}
function ke(e) {
  return h(this, null, function* () {
    try {
      let { data: t } = yield W.default.get(e, { timeout: 8e3, headers: _ }), n = [], o = /class="[^"]*inline-block[^"]*"[^>]+data-url="([^"]+)"/g, r;
      for (; (r = o.exec(t)) !== null; )
        n.push(r[1]);
      let u = /data-src="([A-Za-z0-9+/=]{20,})"/g;
      for (; (r = u.exec(t)) !== null; )
        n.push(r[1]);
      let l = [...new Set(n.map((i) => ve(i)).filter((i) => i && i.startsWith("http")))];
      console.log(`[CineCalidad] ${l.length} URLs intermedias \xFAnicas`);
      let s = /* @__PURE__ */ new Set();
      return yield Promise.allSettled(l.map((i) => h(this, null, function* () {
        try {
          let { data: c } = yield W.default.get(i, { timeout: 6e3, headers: _, maxRedirects: 5 }), a = "", f = c.match(/id="btn_enlace"[^>]*>[\s\S]*?href="([^"]+)"/);
          if (f && (a = f[1]), !a) {
            let d = c.match(/<iframe[^>]+src="([^"]+)"/);
            d && (a = d[1]);
          }
          !a && i.includes("/e/") && (a = i), a && a.startsWith("http") && s.add(a);
        } catch (c) {
        }
      }))), [...s];
    } catch (t) {
      return console.log(`[CineCalidad] Error obteniendo embeds: ${t.message}`), [];
    }
  });
}
function Me(e) {
  return h(this, null, function* () {
    try {
      let t = Re(e);
      if (!t)
        return console.log(`[CineCalidad] Sin resolver para: ${e.substring(0, 60)}`), null;
      let n = Ce(e), o = yield t(e);
      return !o || !o.url ? null : { name: "CineCalidad", title: `1080p \xB7 ${n}`, url: o.url, quality: "1080p", headers: o.headers || {} };
    } catch (t) {
      return null;
    }
  });
}
function Oe(e, t, n, o) {
  return h(this, null, function* () {
    if (!e || !t)
      return [];
    let r = Date.now();
    if (console.log(`[CineCalidad] Buscando: TMDB ${e} (${t})${n ? ` S${n}E${o}` : ""}`), t === "tv")
      return console.log("[CineCalidad] Series no soportadas a\xFAn"), [];
    try {
      let u = yield be(e, t);
      if (!u)
        return [];
      let l = Ee(u);
      console.log(`[CineCalidad] ${l.length} variantes: ${l.join(", ")}`);
      let s = null;
      for (let m of l) {
        let p = yield Ue(m);
        if (p.length > 0) {
          let g = We(p, u);
          if (g) {
            s = g, console.log(`[CineCalidad] \u2713 "${m}" \u2192 "${g.title}" (${g.url})`);
            break;
          }
        }
      }
      if (!s)
        return console.log("[CineCalidad] Sin resultados"), [];
      let i = yield ke(s.url);
      if (i.length === 0)
        return console.log("[CineCalidad] No se encontraron embeds"), [];
      console.log(`[CineCalidad] Resolviendo ${i.length} embeds...`);
      let c = 5e3, a = [...new Set(i)];
      console.log(`[CineCalidad DEBUG] uniqueEmbeds length: ${a.length}`, a);
      let f = yield new Promise((m) => {
        let p = [], g = 0, C = a.length, k = () => m(p.filter(Boolean)), y = setTimeout(k, c);
        console.log(`[CineCalidad DEBUG] embedUrls: ${JSON.stringify([...i])}`), a.forEach((R, w) => {
          console.log(`[CineCalidad DEBUG] forEach item ${w}: ${R}`), Me(R).then((x) => {
            x && p.push(x), g++, g === C && (clearTimeout(y), k());
          }).catch(() => {
            g++, g === C && (clearTimeout(y), k());
          });
        });
      }), d = ((Date.now() - r) / 1e3).toFixed(2);
      return console.log(`[CineCalidad] \u2713 ${f.length} streams en ${d}s`), f;
    } catch (u) {
      return console.log(`[CineCalidad] Error: ${u.message}`), [];
    }
  });
}
