var ye = Object.create;
var W = Object.defineProperty;
var ve = Object.getOwnPropertyDescriptor;
var $e = Object.getOwnPropertyNames, Y = Object.getOwnPropertySymbols, we = Object.getPrototypeOf, ee = Object.prototype.hasOwnProperty, Ae = Object.prototype.propertyIsEnumerable;
var Z = (e, t, o) => t in e ? W(e, t, { enumerable: true, configurable: true, writable: true, value: o }) : e[t] = o, F = (e, t) => {
  for (var o in t || (t = {}))
    ee.call(t, o) && Z(e, o, t[o]);
  if (Y)
    for (var o of Y(t))
      Ae.call(t, o) && Z(e, o, t[o]);
  return e;
};
var Se = (e, t) => {
  for (var o in t)
    W(e, o, { get: t[o], enumerable: true });
}, te = (e, t, o, n) => {
  if (t && typeof t == "object" || typeof t == "function")
    for (let r of $e(t))
      !ee.call(e, r) && r !== o && W(e, r, { get: () => t[r], enumerable: !(n = ve(t, r)) || n.enumerable });
  return e;
};
var $ = (e, t, o) => (o = e != null ? ye(we(e)) : {}, te(t || !e || !e.__esModule ? W(o, "default", { value: e, enumerable: true }) : o, e)), Re = (e) => te(W({}, "__esModule", { value: true }), e);
var m = (e, t, o) => new Promise((n, r) => {
  var s = (l) => {
    try {
      a(o.next(l));
    } catch (u) {
      r(u);
    }
  }, i = (l) => {
    try {
      a(o.throw(l));
    } catch (u) {
      r(u);
    }
  }, a = (l) => l.done ? n(l.value) : Promise.resolve(l.value).then(s, i);
  a((o = o.apply(e, t)).next());
});
var Ge = {};
Se(Ge, { getStreams: () => je });
module.exports = Re(Ge);
var N = $(require("axios"));
var ne = $(require("axios"));
var oe = $(require("axios"));
var xe = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
function I(e, t) {
  return e >= 3840 || t >= 2160 ? "4K" : e >= 1920 || t >= 1080 ? "1080p" : e >= 1280 || t >= 720 ? "720p" : e >= 854 || t >= 480 ? "480p" : "360p";
}
function A(o) {
  return m(this, arguments, function* (e, t = {}) {
    try {
      let { data: n } = yield oe.default.get(e, { timeout: 3e3, headers: F({ "User-Agent": xe }, t), responseType: "text" });
      if (!n.includes("#EXT-X-STREAM-INF")) {
        let a = e.match(/[_-](\d{3,4})p/);
        return a ? `${a[1]}p` : "1080p";
      }
      let r = 0, s = 0, i = n.split(`
`);
      for (let a of i) {
        let l = a.match(/RESOLUTION=(\d+)x(\d+)/);
        if (l) {
          let u = parseInt(l[1]), c = parseInt(l[2]);
          c > s && (s = c, r = u);
        }
      }
      return s > 0 ? I(r, s) : "1080p";
    } catch (n) {
      return "1080p";
    }
  });
}
var re = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
function se(e) {
  return m(this, null, function* () {
    try {
      console.log(`[GoodStream] Resolviendo: ${e}`);
      let o = (yield ne.default.get(e, { headers: { "User-Agent": re, Referer: "https://goodstream.one", Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8" }, timeout: 15e3, maxRedirects: 5 })).data.match(/file:\s*"([^"]+)"/);
      if (!o)
        return console.log('[GoodStream] No se encontr\xF3 patr\xF3n file:"..."'), null;
      let n = o[1], r = { Referer: e, Origin: "https://goodstream.one", "User-Agent": re }, s = yield A(n, r);
      return console.log(`[GoodStream] URL encontrada (${s}): ${n.substring(0, 80)}...`), { url: n, quality: s, headers: r };
    } catch (t) {
      return console.log(`[GoodStream] Error: ${t.message}`), null;
    }
  });
}
var ae = $(require("axios"));
var Ee = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
function ie(e) {
  try {
    return typeof atob != "undefined" ? atob(e) : Buffer.from(e, "base64").toString("utf8");
  } catch (t) {
    return null;
  }
}
function Me(e, t) {
  try {
    let n = t.replace(/^\[|\]$/g, "").split("','").map((u) => u.replace(/^'+|'+$/g, "")).map((u) => u.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")), r = "";
    for (let u of e) {
      let c = u.charCodeAt(0);
      c > 64 && c < 91 ? c = (c - 52) % 26 + 65 : c > 96 && c < 123 && (c = (c - 84) % 26 + 97), r += String.fromCharCode(c);
    }
    for (let u of n)
      r = r.replace(new RegExp(u, "g"), "_");
    r = r.split("_").join("");
    let s = ie(r);
    if (!s)
      return null;
    let i = "";
    for (let u = 0; u < s.length; u++)
      i += String.fromCharCode((s.charCodeAt(u) - 3 + 256) % 256);
    let a = i.split("").reverse().join(""), l = ie(a);
    return l ? JSON.parse(l) : null;
  } catch (o) {
    return console.log("[VOE] voeDecode error:", o.message), null;
  }
}
function z(o) {
  return m(this, arguments, function* (e, t = {}) {
    return ae.default.get(e, { timeout: 15e3, maxRedirects: 5, headers: F({ "User-Agent": Ee, Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8" }, t), validateStatus: (n) => n < 500 });
  });
}
function le(e) {
  return m(this, null, function* () {
    try {
      console.log(`[VOE] Resolviendo: ${e}`);
      let t = yield z(e, { Referer: e }), o = String(t && t.data ? t.data : "");
      if (/permanentToken/i.test(o)) {
        let l = o.match(/window\.location\.href\s*=\s*'([^']+)'/i);
        if (l) {
          console.log(`[VOE] Permanent token redirect -> ${l[1]}`);
          let u = yield z(l[1], { Referer: e });
          u && u.data && (o = String(u.data));
        }
      }
      let n = o.match(/json">\s*\[\s*['"]([^'"]+)['"]\s*\]\s*<\/script>\s*<script[^>]*src=['"]([^'"]+)['"]/i);
      if (n) {
        let l = n[1], u = n[2].startsWith("http") ? n[2] : new URL(n[2], e).href;
        console.log(`[VOE] Found encoded array + loader: ${u}`);
        let c = yield z(u, { Referer: e }), p = c && c.data ? String(c.data) : "", f = p.match(/(\[(?:'[^']{1,10}'[\s,]*){4,12}\])/i) || p.match(/(\[(?:"[^"]{1,10}"[,\s]*){4,12}\])/i);
        if (f) {
          let d = Me(l, f[1]);
          if (d && (d.source || d.direct_access_url)) {
            let g = d.source || d.direct_access_url, v = yield A(g, { Referer: e });
            return console.log(`[VOE] URL encontrada: ${g.substring(0, 80)}...`), { url: g, quality: v, headers: { Referer: e } };
          }
        }
      }
      let r = /(?:mp4|hls)'\s*:\s*'([^']+)'/gi, s = /(?:mp4|hls)"\s*:\s*"([^"]+)"/gi, i = [], a;
      for (; (a = r.exec(o)) !== null; )
        i.push(a);
      for (; (a = s.exec(o)) !== null; )
        i.push(a);
      for (let l of i) {
        let u = l[1];
        if (!u)
          continue;
        let c = u;
        if (c.startsWith("aHR0"))
          try {
            c = atob(c);
          } catch (p) {
          }
        return console.log(`[VOE] URL encontrada (fallback): ${c.substring(0, 80)}...`), { url: c, quality: yield A(c, { Referer: e }), headers: { Referer: e } };
      }
      return console.log("[VOE] No se encontr\xF3 URL"), null;
    } catch (t) {
      return console.log(`[VOE] Error: ${t.message}`), null;
    }
  });
}
var V = $(require("axios")), S = $(require("crypto-js"));
var H = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
function C(e) {
  e = e.replace(/-/g, "+").replace(/_/g, "/");
  let t = (4 - e.length % 4) % 4;
  return S.default.enc.Base64.parse(e + "=".repeat(t));
}
function R(e) {
  let t = e.words, o = e.sigBytes, n = new Uint8Array(o);
  for (let r = 0; r < o; r++)
    n[r] = t[r >>> 2] >>> 24 - r % 4 * 8 & 255;
  return n;
}
function B(e) {
  let t = [];
  for (let o = 0; o < e.length; o += 4)
    t.push((e[o] || 0) << 24 | (e[o + 1] || 0) << 16 | (e[o + 2] || 0) << 8 | (e[o + 3] || 0));
  return S.default.lib.WordArray.create(t, e.length);
}
function ce(e) {
  let t = new Uint8Array(e);
  for (let o = 15; o >= 12 && (t[o]++, t[o] === 0); o--)
    ;
  return t;
}
function Le(e, t, o) {
  try {
    let n = new Uint8Array(16);
    n.set(t, 0), n[15] = 1;
    let r = ce(n), s = B(e), i = new Uint8Array(o.length);
    for (let a = 0; a < o.length; a += 16) {
      let l = Math.min(16, o.length - a), u = B(r), c = S.default.AES.encrypt(u, s, { mode: S.default.mode.ECB, padding: S.default.pad.NoPadding }), p = R(c.ciphertext);
      for (let f = 0; f < l; f++)
        i[a + f] = o[a + f] ^ p[f];
      r = ce(r);
    }
    return i;
  } catch (n) {
    return console.log("[Filemoon] AES-GCM error:", n.message), null;
  }
}
function D(e) {
  return m(this, null, function* () {
    var t, o, n;
    console.log(`[Filemoon] Resolviendo: ${e}`);
    try {
      let r = e.match(/\/(?:e|d)\/([a-z0-9]{12})/i);
      if (!r)
        return null;
      let s = r[1], { data: i } = yield V.default.get(`https://filemooon.link/api/videos/${s}/embed/playback`, { timeout: 7e3, headers: { "User-Agent": H, Referer: e } });
      if (i.error)
        return console.log(`[Filemoon] API error: ${i.error}`), null;
      let a = i.playback;
      if ((a == null ? void 0 : a.algorithm) !== "AES-256-GCM" || ((t = a.key_parts) == null ? void 0 : t.length) !== 2)
        return console.log("[Filemoon] Formato de cifrado no soportado"), null;
      let l = R(C(a.key_parts[0])), u = R(C(a.key_parts[1])), c = new Uint8Array(l.length + u.length);
      c.set(l, 0), c.set(u, l.length);
      let p;
      if (c.length === 32)
        p = c;
      else {
        let y = B(c);
        p = R(S.default.SHA256(y));
      }
      let f = R(C(a.iv)), d = R(C(a.payload));
      if (d.length < 16)
        return null;
      let g = d.slice(0, -16), v = Le(p, f, g);
      if (!v)
        return null;
      let w = "";
      for (let y = 0; y < v.length; y++)
        w += String.fromCharCode(v[y]);
      let h = (n = (o = JSON.parse(w).sources) == null ? void 0 : o[0]) == null ? void 0 : n.url;
      if (!h)
        return null;
      console.log(`[Filemoon] URL encontrada: ${h.substring(0, 80)}...`);
      let x = h, E = "1080p";
      if (h.includes("master"))
        try {
          let O = (yield V.default.get(h, { timeout: 3e3, headers: { "User-Agent": H, Referer: e }, responseType: "text" })).data.split(`
`), k = 0, K = 0, X = h;
          for (let M = 0; M < O.length; M++) {
            let J = O[M].trim();
            if (J.startsWith("#EXT-X-STREAM-INF")) {
              let T = J.match(/RESOLUTION=(\d+)x(\d+)/), he = T ? parseInt(T[1]) : 0, Q = T ? parseInt(T[2]) : 0;
              for (let _ = M + 1; _ < M + 3 && _ < O.length; _++) {
                let L = O[_].trim();
                if (L && !L.startsWith("#") && Q > k) {
                  k = Q, K = he, X = L.startsWith("http") ? L : new URL(L, h).toString();
                  break;
                }
              }
            }
          }
          k > 0 && (x = X, E = I(K, k), console.log(`[Filemoon] Mejor calidad: ${E}`));
        } catch (y) {
          console.log(`[Filemoon] No se pudo parsear master: ${y.message}`);
        }
      return { url: x, quality: E, headers: { "User-Agent": H, Referer: e, Origin: "https://filemoon.sx" } };
    } catch (r) {
      return console.log(`[Filemoon] Error: ${r.message}`), null;
    }
  });
}
var P = $(require("axios"));
var b = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
function We(e, t, o) {
  let n = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ", r = (s) => {
    let i = 0;
    for (let a = 0; a < s.length; a++) {
      let l = n.indexOf(s[a]);
      if (l === -1)
        return NaN;
      i = i * t + l;
    }
    return i;
  };
  return e.replace(/\b([0-9a-zA-Z]+)\b/g, (s) => {
    let i = r(s);
    return isNaN(i) || i >= o.length ? s : o[i] && o[i] !== "" ? o[i] : s;
  });
}
function be(e, t) {
  let o = e.match(/\{[^{}]*"hls[234]"\s*:\s*"([^"]+)"[^{}]*\}/);
  if (o)
    try {
      let r = o[0].replace(/(\w+)\s*:/g, '"$1":'), s = JSON.parse(r), i = s.hls4 || s.hls3 || s.hls2;
      if (i)
        return i.startsWith("/") ? t + i : i;
    } catch (r) {
      let s = o[0].match(/"hls[234]"\s*:\s*"([^"]+\.m3u8[^"]*)"/);
      if (s) {
        let i = s[1];
        return i.startsWith("/") ? t + i : i;
      }
    }
  let n = e.match(/["']([^"']{30,}\.m3u8[^"']*)['"]/i);
  if (n) {
    let r = n[1];
    return r.startsWith("/") ? t + r : r;
  }
  return null;
}
var Ue = { "hglink.to": "vibuxer.com" };
function U(e) {
  return m(this, null, function* () {
    var t, o, n, r;
    try {
      let s = e;
      for (let [f, d] of Object.entries(Ue))
        if (s.includes(f)) {
          s = s.replace(f, d);
          break;
        }
      let i = ((t = s.match(/^(https?:\/\/[^/]+)/)) == null ? void 0 : t[1]) || "https://hlswish.com";
      console.log(`[HLSWish] Resolviendo: ${e}`), s !== e && console.log(`[HLSWish] \u2192 Mapped to: ${s}`);
      let a = yield P.default.get(s, { headers: { "User-Agent": b, Referer: "https://embed69.org/", Origin: "https://embed69.org", Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8", "Accept-Language": "es-MX,es;q=0.9" }, timeout: 15e3, maxRedirects: 5 }), l = typeof a.data == "string" ? a.data : JSON.stringify(a.data), u = l.match(/file\s*:\s*["']([^"']+)["']/i);
      if (u) {
        let f = u[1];
        if (f.startsWith("/") && (f = i + f), f.includes("vibuxer.com/stream/")) {
          console.log(`[HLSWish] Siguiendo redirect: ${f.substring(0, 80)}...`);
          try {
            let d = yield P.default.get(f, { headers: { "User-Agent": b, Referer: i + "/" }, timeout: 8e3, maxRedirects: 5, validateStatus: (v) => v < 400 }), g = ((n = (o = d.request) == null ? void 0 : o.res) == null ? void 0 : n.responseUrl) || ((r = d.config) == null ? void 0 : r.url);
            g && g.includes(".m3u8") && (f = g);
          } catch (d) {
          }
        }
        return console.log(`[HLSWish] URL encontrada: ${f.substring(0, 80)}...`), { url: f, quality: "1080p", headers: { "User-Agent": b, Referer: i + "/" } };
      }
      let c = l.match(/eval\(function\(p,a,c,k,e,[a-z]\)\{[^}]+\}\s*\('([\s\S]+?)',\s*(\d+),\s*(\d+),\s*'([\s\S]+?)'\.split\('\|'\)/);
      if (c) {
        let f = We(c[1], parseInt(c[2]), c[4].split("|")), d = be(f, i);
        if (d)
          return console.log(`[HLSWish] URL encontrada: ${d.substring(0, 80)}...`), { url: d, quality: "1080p", headers: { "User-Agent": b, Referer: i + "/" } };
      }
      let p = l.match(/https?:\/\/[^"'\s\\]+\.m3u8[^"'\s\\]*/i);
      return p ? (console.log(`[HLSWish] URL encontrada: ${p[0].substring(0, 80)}...`), { url: p[0], quality: "1080p", headers: { "User-Agent": b, Referer: i + "/" } }) : (console.log("[HLSWish] No se encontr\xF3 URL"), null);
    } catch (s) {
      return console.log(`[HLSWish] Error: ${s.message}`), null;
    }
  });
}
var fe = $(require("axios"));
var ue = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
function pe(e) {
  return m(this, null, function* () {
    try {
      console.log(`[Vimeos] Resolviendo: ${e}`);
      let n = (yield fe.default.get(e, { headers: { "User-Agent": ue, Referer: "https://vimeos.net/", Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8" }, timeout: 15e3, maxRedirects: 5 })).data.match(/eval\(function\(p,a,c,k,e,[dr]\)\{[\s\S]+?\}\('([\s\S]+?)',(\d+),(\d+),'([\s\S]+?)'\.split\('\|'\)/);
      if (n) {
        let r = n[1], s = parseInt(n[2]), i = n[4].split("|"), a = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ", l = (p) => {
          let f = 0;
          for (let d = 0; d < p.length; d++)
            f = f * s + a.indexOf(p[d]);
          return f;
        }, c = r.replace(/\b(\w+)\b/g, (p) => {
          let f = l(p);
          return i[f] && i[f] !== "" ? i[f] : p;
        }).match(/["']([^"']+\.m3u8[^"']*)['"]/i);
        if (c) {
          let p = c[1], f = { "User-Agent": ue, Referer: "https://vimeos.net/" }, d = yield A(p, f);
          return console.log(`[Vimeos] URL encontrada: ${p.substring(0, 80)}...`), { url: p, quality: d, headers: f };
        }
      }
      return console.log("[Vimeos] No se encontr\xF3 URL"), null;
    } catch (t) {
      return console.log(`[Vimeos] Error: ${t.message}`), null;
    }
  });
}
var Ne = "439c478a771f35c05022f9feabcca01c", ge = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36", j = { "User-Agent": ge, Accept: "application/json" }, G = "https://la.movie", Oe = ["JP", "CN", "KR"], ke = 16, Te = { "goodstream.one": se, "hlswish.com": U, "streamwish.com": U, "streamwish.to": U, "strwish.com": U, "voe.sx": le, "filemoon.sx": D, "filemoon.to": D, "vimeos.net": pe }, _e = [];
var Fe = (e) => {
  let t = e.toString().toLowerCase(), o = t.match(/(\d+)/);
  return o ? `${o[1]}p` : t.includes("4k") || t.includes("uhd") ? "2160p" : t.includes("full") || t.includes("fhd") ? "1080p" : t.includes("hd") ? "720p" : "SD";
}, Ce = (e) => e.includes("goodstream") ? "GoodStream" : e.includes("hlswish") || e.includes("streamwish") ? "StreamWish" : e.includes("voe.sx") ? "VOE" : e.includes("filemoon") ? "Filemoon" : e.includes("vimeos.net") ? "Vimeos" : "Online", qe = (e) => {
  try {
    if (_e.some((t) => e.includes(t)))
      return null;
    for (let [t, o] of Object.entries(Te))
      if (e.includes(t))
        return o;
  } catch (t) {
  }
  return null;
};
function de(e, t) {
  let o = e.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9\s-]/g, " ").replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
  return t ? `${o}-${t}` : o;
}
function Ie(e, t, o) {
  return e === "movie" ? ["peliculas"] : (t || []).includes(ke) ? (o || []).some((s) => Oe.includes(s)) ? ["animes"] : ["animes", "series"] : ["series"];
}
function ze(e, t) {
  return m(this, null, function* () {
    var n;
    let o = [{ lang: "es-MX", name: "Latino" }, { lang: "en-US", name: "Ingl\xE9s" }];
    for (let { lang: r, name: s } of o)
      try {
        let i = `https://api.themoviedb.org/3/${t}/${e}?api_key=${Ne}&language=${r}`, { data: a } = yield N.default.get(i, { timeout: 5e3, headers: j }), l = t === "movie" ? a.title : a.name, u = t === "movie" ? a.original_title : a.original_name;
        if (r === "es-MX" && /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]/.test(l))
          continue;
        return console.log(`[LaMovie] TMDB (${s}): "${l}"${l !== u ? ` | Original: "${u}"` : ""}`), { title: l, originalTitle: u, year: (a.release_date || a.first_air_date || "").substring(0, 4), genres: (a.genres || []).map((c) => c.id), originCountries: a.origin_country || ((n = a.production_countries) == null ? void 0 : n.map((c) => c.iso_3166_1)) || [] };
      } catch (i) {
        console.log(`[LaMovie] Error TMDB ${s}: ${i.message}`);
      }
    return null;
  });
}
var He = { "User-Agent": ge, Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8", "Accept-Language": "es-MX,es;q=0.9", Connection: "keep-alive", "Upgrade-Insecure-Requests": "1" };
function Ve(e) {
  let t = e.match(/rel=['"]shortlink['"]\s+href=['"][^'"]*\?p=(\d+)['"]/);
  return t ? t[1] : null;
}
function me(e, t) {
  return m(this, null, function* () {
    let o = `${G}/${e}/${t}/`;
    try {
      let { data: n } = yield N.default.get(o, { timeout: 8e3, headers: He, validateStatus: (s) => s === 200 }), r = Ve(n);
      return r ? (console.log(`[LaMovie] \u2713 Slug directo: /${e}/${t} \u2192 id:${r}`), { id: r }) : null;
    } catch (n) {
      return null;
    }
  });
}
function Be(e, t) {
  return m(this, null, function* () {
    let { title: o, originalTitle: n, year: r, genres: s, originCountries: i } = e, a = Ie(t, s, i), l = [];
    o && l.push(de(o, r)), n && n !== o && l.push(de(n, r));
    for (let u of l)
      if (a.length === 1) {
        let c = yield me(a[0], u);
        if (c)
          return c;
      } else {
        let p = (yield Promise.allSettled(a.map((f) => me(f, u)))).find((f) => f.status === "fulfilled" && f.value);
        if (p)
          return p.value;
      }
    return null;
  });
}
function De(e, t, o) {
  return m(this, null, function* () {
    var r;
    let n = `${G}/wp-api/v1/single/episodes/list?_id=${e}&season=${t}&page=1&postsPerPage=50`;
    try {
      let { data: s } = yield N.default.get(n, { timeout: 12e3, headers: j });
      if (!((r = s == null ? void 0 : s.data) != null && r.posts))
        return null;
      let i = s.data.posts.find((a) => a.season_number == t && a.episode_number == o);
      return (i == null ? void 0 : i._id) || null;
    } catch (s) {
      return console.log(`[LaMovie] Error episodios: ${s.message}`), null;
    }
  });
}
function Pe(e) {
  return m(this, null, function* () {
    try {
      let t = qe(e.url);
      if (!t)
        return console.log(`[LaMovie] Sin resolver para: ${e.url}`), null;
      let o = yield t(e.url);
      if (!o || !o.url)
        return null;
      let n = Fe(e.quality || "1080p"), r = Ce(e.url);
      return { name: "LaMovie", title: `${n} \xB7 ${r}`, url: o.url, quality: n, headers: o.headers || {} };
    } catch (t) {
      return console.log(`[LaMovie] Error procesando embed: ${t.message}`), null;
    }
  });
}
function je(e, t, o, n) {
  return m(this, null, function* () {
    var s;
    if (!e || !t)
      return [];
    let r = Date.now();
    console.log(`[LaMovie] Buscando: TMDB ${e} (${t})${o ? ` S${o}E${n}` : ""}`);
    try {
      let i = yield ze(e, t);
      if (!i)
        return [];
      let a = yield Be(i, t);
      if (!a)
        return console.log("[LaMovie] No encontrado por slug"), [];
      let l = a.id;
      if (t === "tv" && o && n) {
        let g = yield De(l, o, n);
        if (!g)
          return console.log(`[LaMovie] Episodio S${o}E${n} no encontrado`), [];
        l = g;
      }
      let { data: u } = yield N.default.get(`${G}/wp-api/v1/player?postId=${l}&demo=0`, { timeout: 6e3, headers: j });
      if (!((s = u == null ? void 0 : u.data) != null && s.embeds))
        return console.log("[LaMovie] No hay embeds disponibles"), [];
      let c = 5e3, p = u.data.embeds.map((g) => Pe(g)), f = yield new Promise((g) => {
        let v = [], w = 0, q = p.length, h = () => g(v.filter(Boolean)), x = setTimeout(h, c);
        p.forEach((E) => {
          E.then((y) => {
            y && v.push(y), w++, w === q && (clearTimeout(x), h());
          }).catch(() => {
            w++, w === q && (clearTimeout(x), h());
          });
        });
      }), d = ((Date.now() - r) / 1e3).toFixed(2);
      return console.log(`[LaMovie] \u2713 ${f.length} streams en ${d}s`), f;
    } catch (i) {
      return console.log(`[LaMovie] Error: ${i.message}`), [];
    }
  });
}
