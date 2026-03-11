var ye = Object.create;
var W = Object.defineProperty;
var we = Object.getOwnPropertyDescriptor;
var xe = Object.getOwnPropertyNames, J = Object.getOwnPropertySymbols, Se = Object.getPrototypeOf, Z = Object.prototype.hasOwnProperty, Ae = Object.prototype.propertyIsEnumerable;
var Q = (e, n, t) => n in e ? W(e, n, { enumerable: true, configurable: true, writable: true, value: t }) : e[n] = t, F = (e, n) => {
  for (var t in n || (n = {}))
    Z.call(n, t) && Q(e, t, n[t]);
  if (J)
    for (var t of J(n))
      Ae.call(n, t) && Q(e, t, n[t]);
  return e;
};
var Re = (e, n) => {
  for (var t in n)
    W(e, t, { get: n[t], enumerable: true });
}, Y = (e, n, t, o) => {
  if (n && typeof n == "object" || typeof n == "function")
    for (let r of xe(n))
      !Z.call(e, r) && r !== t && W(e, r, { get: () => n[r], enumerable: !(o = we(n, r)) || o.enumerable });
  return e;
};
var x = (e, n, t) => (t = e != null ? ye(Se(e)) : {}, Y(n || !e || !e.__esModule ? W(t, "default", { value: e, enumerable: true }) : t, e)), $e = (e) => Y(W({}, "__esModule", { value: true }), e);
var h = (e, n, t) => new Promise((o, r) => {
  var l = (u) => {
    try {
      i(t.next(u));
    } catch (c) {
      r(c);
    }
  }, s = (u) => {
    try {
      i(t.throw(u));
    } catch (c) {
      r(c);
    }
  }, i = (u) => u.done ? o(u.value) : Promise.resolve(u.value).then(l, s);
  i((t = t.apply(e, n)).next());
});
var De = {};
Re(De, { getStreams: () => Be });
module.exports = $e(De);
var M = x(require("axios"));
var ne = x(require("axios"));
var ee = x(require("axios"));
var ve = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
function z(e, n) {
  return e >= 3840 || n >= 2160 ? "4K" : e >= 1920 || n >= 1080 ? "1080p" : e >= 1280 || n >= 720 ? "720p" : e >= 854 || n >= 480 ? "480p" : "360p";
}
function S(t) {
  return h(this, arguments, function* (e, n = {}) {
    try {
      let { data: o } = yield ee.default.get(e, { timeout: 3e3, headers: F({ "User-Agent": ve }, n), responseType: "text" });
      if (!o.includes("#EXT-X-STREAM-INF")) {
        let i = e.match(/[_-](\d{3,4})p/);
        return i ? `${i[1]}p` : "1080p";
      }
      let r = 0, l = 0, s = o.split(`
`);
      for (let i of s) {
        let u = i.match(/RESOLUTION=(\d+)x(\d+)/);
        if (u) {
          let c = parseInt(u[1]), a = parseInt(u[2]);
          a > l && (l = a, r = c);
        }
      }
      return l > 0 ? z(r, l) : "1080p";
    } catch (o) {
      return "1080p";
    }
  });
}
var te = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
function oe(e) {
  return h(this, null, function* () {
    try {
      console.log(`[GoodStream] Resolviendo: ${e}`);
      let t = (yield ne.default.get(e, { headers: { "User-Agent": te, Referer: "https://goodstream.one", Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8" }, timeout: 15e3, maxRedirects: 5 })).data.match(/file:\s*"([^"]+)"/);
      if (!t)
        return console.log('[GoodStream] No se encontr\xF3 patr\xF3n file:"..."'), null;
      let o = t[1], r = { Referer: e, Origin: "https://goodstream.one", "User-Agent": te }, l = yield S(o, r);
      return console.log(`[GoodStream] URL encontrada (${l}): ${o.substring(0, 80)}...`), { url: o, quality: l, headers: r };
    } catch (n) {
      return console.log(`[GoodStream] Error: ${n.message}`), null;
    }
  });
}
var se = x(require("axios"));
var be = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
function re(e) {
  try {
    return typeof atob != "undefined" ? atob(e) : Buffer.from(e, "base64").toString("utf8");
  } catch (n) {
    return null;
  }
}
function Ee(e, n) {
  try {
    let o = n.replace(/^\[|\]$/g, "").split("','").map((c) => c.replace(/^'+|'+$/g, "")).map((c) => c.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")), r = "";
    for (let c of e) {
      let a = c.charCodeAt(0);
      a > 64 && a < 91 ? a = (a - 52) % 26 + 65 : a > 96 && a < 123 && (a = (a - 84) % 26 + 97), r += String.fromCharCode(a);
    }
    for (let c of o)
      r = r.replace(new RegExp(c, "g"), "_");
    r = r.split("_").join("");
    let l = re(r);
    if (!l)
      return null;
    let s = "";
    for (let c = 0; c < l.length; c++)
      s += String.fromCharCode((l.charCodeAt(c) - 3 + 256) % 256);
    let i = s.split("").reverse().join(""), u = re(i);
    return u ? JSON.parse(u) : null;
  } catch (t) {
    return console.log("[VOE] voeDecode error:", t.message), null;
  }
}
function H(t) {
  return h(this, arguments, function* (e, n = {}) {
    return se.default.get(e, { timeout: 15e3, maxRedirects: 5, headers: F({ "User-Agent": be, Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8" }, n), validateStatus: (o) => o < 500 });
  });
}
function ae(e) {
  return h(this, null, function* () {
    try {
      console.log(`[VOE] Resolviendo: ${e}`);
      let n = yield H(e, { Referer: e }), t = String(n && n.data ? n.data : "");
      if (/permanentToken/i.test(t)) {
        let u = t.match(/window\.location\.href\s*=\s*'([^']+)'/i);
        if (u) {
          console.log(`[VOE] Permanent token redirect -> ${u[1]}`);
          let c = yield H(u[1], { Referer: e });
          c && c.data && (t = String(c.data));
        }
      }
      let o = t.match(/json">\s*\[\s*['"]([^'"]+)['"]\s*\]\s*<\/script>\s*<script[^>]*src=['"]([^'"]+)['"]/i);
      if (o) {
        let u = o[1], c = o[2].startsWith("http") ? o[2] : new URL(o[2], e).href;
        console.log(`[VOE] Found encoded array + loader: ${c}`);
        let a = yield H(c, { Referer: e }), f = a && a.data ? String(a.data) : "", d = f.match(/(\[(?:'[^']{1,10}'[\s,]*){4,12}\])/i) || f.match(/(\[(?:"[^"]{1,10}"[,\s]*){4,12}\])/i);
        if (d) {
          let p = Ee(u, d[1]);
          if (p && (p.source || p.direct_access_url)) {
            let g = p.source || p.direct_access_url, m = yield S(g, { Referer: e });
            return console.log(`[VOE] URL encontrada: ${g.substring(0, 80)}...`), { url: g, quality: m, headers: { Referer: e } };
          }
        }
      }
      let r = /(?:mp4|hls)'\s*:\s*'([^']+)'/gi, l = /(?:mp4|hls)"\s*:\s*"([^"]+)"/gi, s = [], i;
      for (; (i = r.exec(t)) !== null; )
        s.push(i);
      for (; (i = l.exec(t)) !== null; )
        s.push(i);
      for (let u of s) {
        let c = u[1];
        if (!c)
          continue;
        let a = c;
        if (a.startsWith("aHR0"))
          try {
            a = atob(a);
          } catch (f) {
          }
        return console.log(`[VOE] URL encontrada (fallback): ${a.substring(0, 80)}...`), { url: a, quality: yield S(a, { Referer: e }), headers: { Referer: e } };
      }
      return console.log("[VOE] No se encontr\xF3 URL"), null;
    } catch (n) {
      return console.log(`[VOE] Error: ${n.message}`), null;
    }
  });
}
var D = x(require("axios")), A = x(require("crypto-js"));
var B = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
function q(e) {
  e = e.replace(/-/g, "+").replace(/_/g, "/");
  let n = (4 - e.length % 4) % 4;
  return A.default.enc.Base64.parse(e + "=".repeat(n));
}
function $(e) {
  let n = e.words, t = e.sigBytes, o = new Uint8Array(t);
  for (let r = 0; r < t; r++)
    o[r] = n[r >>> 2] >>> 24 - r % 4 * 8 & 255;
  return o;
}
function j(e) {
  let n = [];
  for (let t = 0; t < e.length; t += 4)
    n.push((e[t] || 0) << 24 | (e[t + 1] || 0) << 16 | (e[t + 2] || 0) << 8 | (e[t + 3] || 0));
  return A.default.lib.WordArray.create(n, e.length);
}
function ie(e) {
  let n = new Uint8Array(e);
  for (let t = 15; t >= 12 && (n[t]++, n[t] === 0); t--)
    ;
  return n;
}
function We(e, n, t) {
  try {
    let o = new Uint8Array(16);
    o.set(n, 0), o[15] = 1;
    let r = ie(o), l = j(e), s = new Uint8Array(t.length);
    for (let i = 0; i < t.length; i += 16) {
      let u = Math.min(16, t.length - i), c = j(r), a = A.default.AES.encrypt(c, l, { mode: A.default.mode.ECB, padding: A.default.pad.NoPadding }), f = $(a.ciphertext);
      for (let d = 0; d < u; d++)
        s[i + d] = t[i + d] ^ f[d];
      r = ie(r);
    }
    return s;
  } catch (o) {
    return console.log("[Filemoon] AES-GCM error:", o.message), null;
  }
}
function I(e) {
  return h(this, null, function* () {
    var n, t, o;
    console.log(`[Filemoon] Resolviendo: ${e}`);
    try {
      let r = e.match(/\/(?:e|d)\/([a-z0-9]{12})/i);
      if (!r)
        return null;
      let l = r[1], { data: s } = yield D.default.get(`https://filemooon.link/api/videos/${l}/embed/playback`, { timeout: 7e3, headers: { "User-Agent": B, Referer: e } });
      if (s.error)
        return console.log(`[Filemoon] API error: ${s.error}`), null;
      let i = s.playback;
      if ((i == null ? void 0 : i.algorithm) !== "AES-256-GCM" || ((n = i.key_parts) == null ? void 0 : n.length) !== 2)
        return console.log("[Filemoon] Formato de cifrado no soportado"), null;
      let u = $(q(i.key_parts[0])), c = $(q(i.key_parts[1])), a = new Uint8Array(u.length + c.length);
      a.set(u, 0), a.set(c, u.length);
      let f;
      if (a.length === 32)
        f = a;
      else {
        let w = j(a);
        f = $(A.default.SHA256(w));
      }
      let d = $(q(i.iv)), p = $(q(i.payload));
      if (p.length < 16)
        return null;
      let g = p.slice(0, -16), m = We(f, d, g);
      if (!m)
        return null;
      let v = "";
      for (let w = 0; w < m.length; w++)
        v += String.fromCharCode(m[w]);
      let y = (o = (t = JSON.parse(v).sources) == null ? void 0 : t[0]) == null ? void 0 : o.url;
      if (!y)
        return null;
      console.log(`[Filemoon] URL encontrada: ${y.substring(0, 80)}...`);
      let k = y, R = "1080p";
      if (y.includes("master"))
        try {
          let L = (yield D.default.get(y, { timeout: 3e3, headers: { "User-Agent": B, Referer: e }, responseType: "text" })).data.split(`
`), T = 0, K = 0, G = y;
          for (let b = 0; b < L.length; b++) {
            let P = L[b].trim();
            if (P.startsWith("#EXT-X-STREAM-INF")) {
              let O = P.match(/RESOLUTION=(\d+)x(\d+)/), ge = O ? parseInt(O[1]) : 0, X = O ? parseInt(O[2]) : 0;
              for (let N = b + 1; N < b + 3 && N < L.length; N++) {
                let E = L[N].trim();
                if (E && !E.startsWith("#") && X > T) {
                  T = X, K = ge, G = E.startsWith("http") ? E : new URL(E, y).toString();
                  break;
                }
              }
            }
          }
          T > 0 && (k = G, R = z(K, T), console.log(`[Filemoon] Mejor calidad: ${R}`));
        } catch (w) {
          console.log(`[Filemoon] No se pudo parsear master: ${w.message}`);
        }
      return { url: k, quality: R, headers: { "User-Agent": B, Referer: e, Origin: "https://filemoon.sx" } };
    } catch (r) {
      return console.log(`[Filemoon] Error: ${r.message}`), null;
    }
  });
}
var le = x(require("axios"));
var V = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
function Ce(e, n, t) {
  let o = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ", r = (l) => {
    let s = 0;
    for (let i = 0; i < l.length; i++) {
      let u = o.indexOf(l[i]);
      if (u === -1)
        return NaN;
      s = s * n + u;
    }
    return s;
  };
  return e.replace(/\b([0-9a-zA-Z]+)\b/g, (l) => {
    let s = r(l);
    return isNaN(s) || s >= t.length ? l : t[s] && t[s] !== "" ? t[s] : l;
  });
}
function Me(e, n) {
  let t = e.match(/\{[^{}]*"hls[234]"\s*:\s*"([^"]+)"[^{}]*\}/);
  if (t)
    try {
      let r = t[0].replace(/(\w+)\s*:/g, '"$1":'), l = JSON.parse(r), s = l.hls4 || l.hls3 || l.hls2;
      if (s)
        return s.startsWith("/") ? n + s : s;
    } catch (r) {
      let l = t[0].match(/"hls[234]"\s*:\s*"([^"]+\.m3u8[^"]*)"/);
      if (l) {
        let s = l[1];
        return s.startsWith("/") ? n + s : s;
      }
    }
  let o = e.match(/["']([^"']{30,}\.m3u8[^"']*)['"]/i);
  if (o) {
    let r = o[1];
    return r.startsWith("/") ? n + r : r;
  }
  return null;
}
var Ue = { "hglink.to": "vibuxer.com" };
function C(e) {
  return h(this, null, function* () {
    var n;
    try {
      let t = e;
      for (let [c, a] of Object.entries(Ue))
        if (t.includes(c)) {
          t = t.replace(c, a);
          break;
        }
      let o = ((n = t.match(/^(https?:\/\/[^/]+)/)) == null ? void 0 : n[1]) || "https://hlswish.com";
      console.log(`[HLSWish] Resolviendo: ${e}`), t !== e && console.log(`[HLSWish] \u2192 Mapped to: ${t}`);
      let r = yield le.default.get(t, { headers: { "User-Agent": V, Referer: "https://embed69.org/", Origin: "https://embed69.org", Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8", "Accept-Language": "es-MX,es;q=0.9" }, timeout: 15e3, maxRedirects: 5 }), l = typeof r.data == "string" ? r.data : JSON.stringify(r.data), s = l.match(/file\s*:\s*["']([^"']+\.m3u8[^"']*)["']/i);
      if (s) {
        let c = s[1];
        return c.startsWith("/") && (c = o + c), console.log(`[HLSWish] URL encontrada: ${c.substring(0, 80)}...`), { url: c, quality: "1080p", headers: { "User-Agent": V, Referer: o + "/" } };
      }
      let i = l.match(/eval\(function\(p,a,c,k,e,[a-z]\)\{[^}]+\}\s*\('([\s\S]+?)',\s*(\d+),\s*(\d+),\s*'([\s\S]+?)'\.split\('\|'\)/);
      if (i) {
        let c = Ce(i[1], parseInt(i[2]), i[4].split("|")), a = Me(c, o);
        if (a)
          return console.log(`[HLSWish] URL encontrada: ${a.substring(0, 80)}...`), { url: a, quality: "1080p", headers: { "User-Agent": V, Referer: o + "/" } };
      }
      let u = l.match(/https?:\/\/[^"'\s\\]+\.m3u8[^"'\s\\]*/i);
      return u ? (console.log(`[HLSWish] URL encontrada: ${u[0].substring(0, 80)}...`), { url: u[0], quality: "1080p", headers: { "User-Agent": V, Referer: o + "/" } }) : (console.log("[HLSWish] No se encontr\xF3 URL"), null);
    } catch (t) {
      return console.log(`[HLSWish] Error: ${t.message}`), null;
    }
  });
}
var ue = x(require("axios"));
var ce = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
function fe(e) {
  return h(this, null, function* () {
    try {
      console.log(`[Vimeos] Resolviendo: ${e}`);
      let o = (yield ue.default.get(e, { headers: { "User-Agent": ce, Referer: "https://vimeos.net/", Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8" }, timeout: 15e3, maxRedirects: 5 })).data.match(/eval\(function\(p,a,c,k,e,[dr]\)\{[\s\S]+?\}\('([\s\S]+?)',(\d+),(\d+),'([\s\S]+?)'\.split\('\|'\)/);
      if (o) {
        let r = o[1], l = parseInt(o[2]), s = o[4].split("|"), i = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ", u = (f) => {
          let d = 0;
          for (let p = 0; p < f.length; p++)
            d = d * l + i.indexOf(f[p]);
          return d;
        }, a = r.replace(/\b(\w+)\b/g, (f) => {
          let d = u(f);
          return s[d] && s[d] !== "" ? s[d] : f;
        }).match(/["']([^"']+\.m3u8[^"']*)['"]/i);
        if (a) {
          let f = a[1], d = { "User-Agent": ce, Referer: "https://vimeos.net/" }, p = yield S(f, d);
          return console.log(`[Vimeos] URL encontrada: ${f.substring(0, 80)}...`), { url: f, quality: p, headers: d };
        }
      }
      return console.log("[Vimeos] No se encontr\xF3 URL"), null;
    } catch (n) {
      return console.log(`[Vimeos] Error: ${n.message}`), null;
    }
  });
}
var ke = "439c478a771f35c05022f9feabcca01c", me = "https://cinecalidad.vg", Le = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36", _ = { "User-Agent": Le, Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8", "Accept-Language": "es-MX,es;q=0.9", Referer: me + "/" }, de = { "goodstream.one": oe, "hlswish.com": C, "streamwish.com": C, "streamwish.to": C, "strwish.com": C, "voe.sx": ae, "filemoon.sx": I, "filemoon.to": I, "vimeos.net": fe }, he = (e) => e.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim(), pe = (e, n) => {
  let t = he(e), o = he(n);
  if (t === o)
    return 1;
  if (t.includes(o) || o.includes(t))
    return 0.8;
  let r = new Set(t.split(/\s+/)), l = new Set(o.split(/\s+/));
  return [...r].filter((i) => l.has(i)).length / Math.max(r.size, l.size);
}, Te = (e) => e.includes("goodstream") ? "GoodStream" : e.includes("hlswish") || e.includes("streamwish") || e.includes("strwish") ? "StreamWish" : e.includes("voe.sx") ? "VOE" : e.includes("filemoon") ? "Filemoon" : e.includes("vimeos") ? "Vimeos" : "Online", Oe = (e) => {
  if (!e || !e.startsWith("http"))
    return null;
  for (let n in de)
    if (e.includes(n))
      return de[n];
  return null;
};
function Ne(e) {
  try {
    return typeof atob != "undefined" ? atob(e) : Buffer.from(e, "base64").toString("utf8");
  } catch (n) {
    return null;
  }
}
function Fe(e, n) {
  return h(this, null, function* () {
    let t = (i, u) => h(this, null, function* () {
      let c = `https://api.themoviedb.org/3/${n}/${e}?api_key=${ke}&language=${i}`, { data: a } = yield M.default.get(c, { timeout: 5e3, headers: _ }), f = n === "movie" ? a.title : a.name, d = n === "movie" ? a.original_title : a.original_name;
      if (!f)
        throw new Error("No title");
      if (i === "es-MX" && /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]/.test(f))
        throw new Error("Japanese title");
      return { title: f, originalTitle: d, year: (a.release_date || a.first_air_date || "").substring(0, 4) };
    }), [o, r, l] = yield Promise.allSettled([t("es-MX", "Latino"), t("en-US", "Ingl\xE9s"), t("es-ES", "Espa\xF1a")]), s = o.status === "fulfilled" ? o.value : r.status === "fulfilled" ? r.value : l.status === "fulfilled" ? l.value : null;
    return s && console.log(`[CineCalidad] TMDB: "${s.title}"${s.title !== s.originalTitle ? ` | Original: "${s.originalTitle}"` : ""}`), s;
  });
}
function qe(e) {
  let n = /* @__PURE__ */ new Set(), { title: t, originalTitle: o, year: r } = e;
  if (t) {
    n.add(t.trim());
    let l = t.replace(/[¿¡:;"']/g, "").replace(/\s+/g, " ").trim();
    l !== t && n.add(l);
  }
  return o && o !== t && !/[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]/.test(o) && n.add(o.trim()), [...n].slice(0, 4);
}
function Ve(e) {
  return h(this, null, function* () {
    let n = `${me}/?s=${encodeURIComponent(e)}`;
    try {
      let { data: t } = yield M.default.get(n, { timeout: 8e3, headers: _ }), o = [], r = 0;
      for (; ; ) {
        let s = t.indexOf("<article", r);
        if (s === -1)
          break;
        let i = t.indexOf("</article>", s);
        if (i === -1)
          break;
        o.push(t.substring(s, i + 10)), r = i + 10;
      }
      let l = [];
      for (let s of o) {
        if (s.includes("/serie/"))
          continue;
        let i = s.match(/class="absolute top-0[^"]*"[^>]+href="([^"]+)"/);
        if (!i)
          continue;
        let u = i[1], c = s.match(/<span class="sr-only">([^<]+)<\/span>/);
        if (!c)
          continue;
        let a = c[1].trim(), f = s.match(/>\s*(\d{4})\s*<\/div>/), d = f ? f[1] : "";
        l.push({ url: u, title: a, year: d });
      }
      return l;
    } catch (t) {
      return console.log(`[CineCalidad] Error b\xFAsqueda "${e}": ${t.message}`), [];
    }
  });
}
function _e(e, n) {
  if (e.length === 0)
    return null;
  if (e.length === 1)
    return e[0];
  let t = e.map((o) => {
    let r = pe(o.title, n.title) * 2;
    return n.originalTitle && (r += pe(o.title, n.originalTitle)), n.year && o.year && o.year === n.year && (r += 0.5), { result: o, score: r };
  });
  return t.sort((o, r) => r.score - o.score), t[0].result;
}
function ze(e) {
  return h(this, null, function* () {
    try {
      let { data: n } = yield M.default.get(e, { timeout: 8e3, headers: _ }), t = [], o = /class="[^"]*inline-block[^"]*"[^>]+data-url="([^"]+)"/g, r;
      for (; (r = o.exec(n)) !== null; )
        t.push(r[1]);
      let l = /data-src="([A-Za-z0-9+/=]{20,})"/g;
      for (; (r = l.exec(n)) !== null; )
        t.push(r[1]);
      let s = [...new Set(t.map((u) => Ne(u)).filter((u) => u && u.startsWith("http")))];
      console.log(`[CineCalidad] ${s.length} URLs intermedias \xFAnicas`);
      let i = /* @__PURE__ */ new Set();
      return yield Promise.allSettled(s.map((u) => h(this, null, function* () {
        try {
          let { data: c } = yield M.default.get(u, { timeout: 3e3, headers: _, maxRedirects: 3 }), a = "", f = c.match(/id="btn_enlace"[^>]*>[\s\S]*?href="([^"]+)"/);
          if (f && (a = f[1]), !a) {
            let d = c.match(/<iframe[^>]+src="([^"]+)"/);
            d && (a = d[1]);
          }
          !a && u.includes("/e/") && (a = u), a && a.startsWith("http") && i.add(a);
        } catch (c) {
        }
      }))), [...i];
    } catch (n) {
      return console.log(`[CineCalidad] Error obteniendo embeds: ${n.message}`), [];
    }
  });
}
function He(e) {
  return h(this, null, function* () {
    try {
      let n = Oe(e);
      if (!n)
        return console.log(`[CineCalidad] Sin resolver para: ${e.substring(0, 60)}`), null;
      let t = Te(e), o = yield n(e);
      return !o || !o.url ? null : { name: "CineCalidad", title: `${o.quality || "1080p"} \xB7 ${t}`, url: o.url, quality: o.quality || "1080p", headers: o.headers || {} };
    } catch (n) {
      return null;
    }
  });
}
function Be(e, n, t, o) {
  return h(this, null, function* () {
    if (!e || !n)
      return [];
    let r = Date.now();
    if (console.log(`[CineCalidad] Buscando: TMDB ${e} (${n})${t ? ` S${t}E${o}` : ""}`), n === "tv")
      return console.log("[CineCalidad] Series no soportadas a\xFAn"), [];
    try {
      let l = yield Fe(e, n);
      if (!l)
        return [];
      let s = qe(l);
      console.log(`[CineCalidad] ${s.length} variantes: ${s.join(", ")}`);
      let i = null;
      for (let p of s) {
        let g = yield Ve(p);
        if (g.length > 0) {
          let m = _e(g, l);
          if (m) {
            i = m, console.log(`[CineCalidad] \u2713 "${p}" \u2192 "${m.title}" (${m.url})`);
            break;
          }
        }
      }
      if (!i)
        return console.log("[CineCalidad] Sin resultados"), [];
      let u = yield ze(i.url);
      if (u.length === 0)
        return console.log("[CineCalidad] No se encontraron embeds"), [];
      console.log(`[CineCalidad] Resolviendo ${u.length} embeds...`);
      let c = 5e3, a = [...new Set(u)], f = yield new Promise((p) => {
        let g = [], m = 0, v = a.length, U = () => p(g.filter(Boolean)), y = setTimeout(U, c);
        a.forEach((k) => {
          He(k).then((R) => {
            R && g.push(R), m++, m === v && (clearTimeout(y), U());
          }).catch(() => {
            m++, m === v && (clearTimeout(y), U());
          });
        });
      }), d = ((Date.now() - r) / 1e3).toFixed(2);
      return console.log(`[CineCalidad] \u2713 ${f.length} streams en ${d}s`), f;
    } catch (l) {
      return console.log(`[CineCalidad] Error: ${l.message}`), [];
    }
  });
}
