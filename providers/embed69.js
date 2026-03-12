var ue = Object.create;
var O = Object.defineProperty, fe = Object.defineProperties, de = Object.getOwnPropertyDescriptor, pe = Object.getOwnPropertyDescriptors, me = Object.getOwnPropertyNames, X = Object.getOwnPropertySymbols, he = Object.getPrototypeOf, Y = Object.prototype.hasOwnProperty, ge = Object.prototype.propertyIsEnumerable;
var Q = (e, t, o) => t in e ? O(e, t, { enumerable: true, configurable: true, writable: true, value: o }) : e[t] = o, x = (e, t) => {
  for (var o in t || (t = {}))
    Y.call(t, o) && Q(e, o, t[o]);
  if (X)
    for (var o of X(t))
      ge.call(t, o) && Q(e, o, t[o]);
  return e;
}, Z = (e, t) => fe(e, pe(t));
var ye = (e, t) => {
  for (var o in t)
    O(e, o, { get: t[o], enumerable: true });
}, ee = (e, t, o, i) => {
  if (t && typeof t == "object" || typeof t == "function")
    for (let n of me(t))
      !Y.call(e, n) && n !== o && O(e, n, { get: () => t[n], enumerable: !(i = de(t, n)) || i.enumerable });
  return e;
};
var L = (e, t, o) => (o = e != null ? ue(he(e)) : {}, ee(t || !e || !e.__esModule ? O(o, "default", { value: e, enumerable: true }) : o, e)), be = (e) => ee(O({}, "__esModule", { value: true }), e);
var S = (e, t, o) => new Promise((i, n) => {
  var r = (a) => {
    try {
      l(o.next(a));
    } catch (c) {
      n(c);
    }
  }, s = (a) => {
    try {
      l(o.throw(a));
    } catch (c) {
      n(c);
    }
  }, l = (a) => a.done ? i(a.value) : Promise.resolve(a.value).then(r, s);
  l((o = o.apply(e, t)).next());
});
var Ie = {};
ye(Ie, { getStreams: () => Te });
module.exports = be(Ie);
var z = L(require("axios"));
var ne = L(require("axios"));
var te = L(require("axios"));
var Ae = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
function H(e, t) {
  return e >= 3840 || t >= 2160 ? "4K" : e >= 1920 || t >= 1080 ? "1080p" : e >= 1280 || t >= 720 ? "720p" : e >= 854 || t >= 480 ? "480p" : "360p";
}
function C(o) {
  return S(this, arguments, function* (e, t = {}) {
    try {
      let { data: i } = yield te.default.get(e, { timeout: 3e3, headers: x({ "User-Agent": Ae }, t), responseType: "text" });
      if (!i.includes("#EXT-X-STREAM-INF")) {
        let l = e.match(/[_-](\d{3,4})p/);
        return l ? `${l[1]}p` : "1080p";
      }
      let n = 0, r = 0, s = i.split(`
`);
      for (let l of s) {
        let a = l.match(/RESOLUTION=(\d+)x(\d+)/);
        if (a) {
          let c = parseInt(a[1]), u = parseInt(a[2]);
          u > r && (r = u, n = c);
        }
      }
      return r > 0 ? H(n, r) : "1080p";
    } catch (i) {
      return "1080p";
    }
  });
}
var Se = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
function oe(e) {
  try {
    return typeof atob != "undefined" ? atob(e) : Buffer.from(e, "base64").toString("utf8");
  } catch (t) {
    return null;
  }
}
function Ee(e, t) {
  try {
    let i = t.replace(/^\[|\]$/g, "").split("','").map((c) => c.replace(/^'+|'+$/g, "")).map((c) => c.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")), n = "";
    for (let c of e) {
      let u = c.charCodeAt(0);
      u > 64 && u < 91 ? u = (u - 52) % 26 + 65 : u > 96 && u < 123 && (u = (u - 84) % 26 + 97), n += String.fromCharCode(u);
    }
    for (let c of i)
      n = n.replace(new RegExp(c, "g"), "_");
    n = n.split("_").join("");
    let r = oe(n);
    if (!r)
      return null;
    let s = "";
    for (let c = 0; c < r.length; c++)
      s += String.fromCharCode((r.charCodeAt(c) - 3 + 256) % 256);
    let l = s.split("").reverse().join(""), a = oe(l);
    return a ? JSON.parse(a) : null;
  } catch (o) {
    return console.log("[VOE] voeDecode error:", o.message), null;
  }
}
function V(o) {
  return S(this, arguments, function* (e, t = {}) {
    return ne.default.get(e, { timeout: 15e3, maxRedirects: 5, headers: x({ "User-Agent": Se, Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8" }, t), validateStatus: (i) => i < 500 });
  });
}
function re(e) {
  return S(this, null, function* () {
    try {
      console.log(`[VOE] Resolviendo: ${e}`);
      let t = yield V(e, { Referer: e }), o = String(t && t.data ? t.data : "");
      if (/permanentToken/i.test(o)) {
        let a = o.match(/window\.location\.href\s*=\s*'([^']+)'/i);
        if (a) {
          console.log(`[VOE] Permanent token redirect -> ${a[1]}`);
          let c = yield V(a[1], { Referer: e });
          c && c.data && (o = String(c.data));
        }
      }
      let i = o.match(/json">\s*\[\s*['"]([^'"]+)['"]\s*\]\s*<\/script>\s*<script[^>]*src=['"]([^'"]+)['"]/i);
      if (i) {
        let a = i[1], c = i[2].startsWith("http") ? i[2] : new URL(i[2], e).href;
        console.log(`[VOE] Found encoded array + loader: ${c}`);
        let u = yield V(c, { Referer: e }), g = u && u.data ? String(u.data) : "", f = g.match(/(\[(?:'[^']{1,10}'[\s,]*){4,12}\])/i) || g.match(/(\[(?:"[^"]{1,10}"[,\s]*){4,12}\])/i);
        if (f) {
          let p = Ee(a, f[1]);
          if (p && (p.source || p.direct_access_url)) {
            let d = p.source || p.direct_access_url, y = yield C(d, { Referer: e });
            return console.log(`[VOE] URL encontrada: ${d.substring(0, 80)}...`), { url: d, quality: y, headers: { Referer: e } };
          }
        }
      }
      let n = /(?:mp4|hls)'\s*:\s*'([^']+)'/gi, r = /(?:mp4|hls)"\s*:\s*"([^"]+)"/gi, s = [], l;
      for (; (l = n.exec(o)) !== null; )
        s.push(l);
      for (; (l = r.exec(o)) !== null; )
        s.push(l);
      for (let a of s) {
        let c = a[1];
        if (!c)
          continue;
        let u = c;
        if (u.startsWith("aHR0"))
          try {
            u = atob(u);
          } catch (g) {
          }
        return console.log(`[VOE] URL encontrada (fallback): ${u.substring(0, 80)}...`), { url: u, quality: yield C(u, { Referer: e }), headers: { Referer: e } };
      }
      return console.log("[VOE] No se encontr\xF3 URL"), null;
    } catch (t) {
      return console.log(`[VOE] Error: ${t.message}`), null;
    }
  });
}
var D = L(require("axios")), $ = L(require("crypto-js"));
var q = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
function F(e) {
  e = e.replace(/-/g, "+").replace(/_/g, "/");
  let t = (4 - e.length % 4) % 4;
  return $.default.enc.Base64.parse(e + "=".repeat(t));
}
function W(e) {
  let t = e.words, o = e.sigBytes, i = new Uint8Array(o);
  for (let n = 0; n < o; n++)
    i[n] = t[n >>> 2] >>> 24 - n % 4 * 8 & 255;
  return i;
}
function j(e) {
  let t = [];
  for (let o = 0; o < e.length; o += 4)
    t.push((e[o] || 0) << 24 | (e[o + 1] || 0) << 16 | (e[o + 2] || 0) << 8 | (e[o + 3] || 0));
  return $.default.lib.WordArray.create(t, e.length);
}
function se(e) {
  let t = new Uint8Array(e);
  for (let o = 15; o >= 12 && (t[o]++, t[o] === 0); o--)
    ;
  return t;
}
function Re(e, t, o) {
  try {
    let i = new Uint8Array(16);
    i.set(t, 0), i[15] = 1;
    let n = se(i), r = j(e), s = new Uint8Array(o.length);
    for (let l = 0; l < o.length; l += 16) {
      let a = Math.min(16, o.length - l), c = j(n), u = $.default.AES.encrypt(c, r, { mode: $.default.mode.ECB, padding: $.default.pad.NoPadding }), g = W(u.ciphertext);
      for (let f = 0; f < a; f++)
        s[l + f] = o[l + f] ^ g[f];
      n = se(n);
    }
    return s;
  } catch (i) {
    return console.log("[Filemoon] AES-GCM error:", i.message), null;
  }
}
function _(e) {
  return S(this, null, function* () {
    var t, o, i;
    console.log(`[Filemoon] Resolviendo: ${e}`);
    try {
      let n = e.match(/\/(?:e|d)\/([a-z0-9]{12})/i);
      if (!n)
        return null;
      let r = n[1], { data: s } = yield D.default.get(`https://filemooon.link/api/videos/${r}/embed/playback`, { timeout: 7e3, headers: { "User-Agent": q, Referer: e } });
      if (s.error)
        return console.log(`[Filemoon] API error: ${s.error}`), null;
      let l = s.playback;
      if ((l == null ? void 0 : l.algorithm) !== "AES-256-GCM" || ((t = l.key_parts) == null ? void 0 : t.length) !== 2)
        return console.log("[Filemoon] Formato de cifrado no soportado"), null;
      let a = W(F(l.key_parts[0])), c = W(F(l.key_parts[1])), u = new Uint8Array(a.length + c.length);
      u.set(a, 0), u.set(c, a.length);
      let g;
      if (u.length === 32)
        g = u;
      else {
        let A = j(u);
        g = W($.default.SHA256(A));
      }
      let f = W(F(l.iv)), p = W(F(l.payload));
      if (p.length < 16)
        return null;
      let d = p.slice(0, -16), y = Re(g, f, d);
      if (!y)
        return null;
      let h = "";
      for (let A = 0; A < y.length; A++)
        h += String.fromCharCode(y[A]);
      let m = (i = (o = JSON.parse(h).sources) == null ? void 0 : o[0]) == null ? void 0 : i.url;
      if (!m)
        return null;
      console.log(`[Filemoon] URL encontrada: ${m.substring(0, 80)}...`);
      let E = m, R = "1080p";
      if (m.includes("master"))
        try {
          let v = (yield D.default.get(m, { timeout: 3e3, headers: { "User-Agent": q, Referer: e }, responseType: "text" })).data.split(`
`), w = 0, T = 0, J = m;
          for (let U = 0; U < v.length; U++) {
            let K = v[U].trim();
            if (K.startsWith("#EXT-X-STREAM-INF")) {
              let I = K.match(/RESOLUTION=(\d+)x(\d+)/), ce = I ? parseInt(I[1]) : 0, G = I ? parseInt(I[2]) : 0;
              for (let B = U + 1; B < U + 3 && B < v.length; B++) {
                let M = v[B].trim();
                if (M && !M.startsWith("#") && G > w) {
                  w = G, T = ce, J = M.startsWith("http") ? M : new URL(M, m).toString();
                  break;
                }
              }
            }
          }
          w > 0 && (E = J, R = H(T, w), console.log(`[Filemoon] Mejor calidad: ${R}`));
        } catch (A) {
          console.log(`[Filemoon] No se pudo parsear master: ${A.message}`);
        }
      return { url: E, quality: R, headers: { "User-Agent": q, Referer: e, Origin: "https://filemoon.sx" } };
    } catch (n) {
      return console.log(`[Filemoon] Error: ${n.message}`), null;
    }
  });
}
var P = L(require("axios"));
var N = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
function $e(e, t, o) {
  let i = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ", n = (r) => {
    let s = 0;
    for (let l = 0; l < r.length; l++) {
      let a = i.indexOf(r[l]);
      if (a === -1)
        return NaN;
      s = s * t + a;
    }
    return s;
  };
  return e.replace(/\b([0-9a-zA-Z]+)\b/g, (r) => {
    let s = n(r);
    return isNaN(s) || s >= o.length ? r : o[s] && o[s] !== "" ? o[s] : r;
  });
}
function ve(e, t) {
  let o = e.match(/\{[^{}]*"hls[234]"\s*:\s*"([^"]+)"[^{}]*\}/);
  if (o)
    try {
      let n = o[0].replace(/(\w+)\s*:/g, '"$1":'), r = JSON.parse(n), s = r.hls4 || r.hls3 || r.hls2;
      if (s)
        return s.startsWith("/") ? t + s : s;
    } catch (n) {
      let r = o[0].match(/"hls[234]"\s*:\s*"([^"]+\.m3u8[^"]*)"/);
      if (r) {
        let s = r[1];
        return s.startsWith("/") ? t + s : s;
      }
    }
  let i = e.match(/["']([^"']{30,}\.m3u8[^"']*)['"]/i);
  if (i) {
    let n = i[1];
    return n.startsWith("/") ? t + n : n;
  }
  return null;
}
var we = { "hglink.to": "vibuxer.com" };
function k(e) {
  return S(this, null, function* () {
    var t, o, i, n;
    try {
      let r = e;
      for (let [f, p] of Object.entries(we))
        if (r.includes(f)) {
          r = r.replace(f, p);
          break;
        }
      let s = ((t = r.match(/^(https?:\/\/[^/]+)/)) == null ? void 0 : t[1]) || "https://hlswish.com";
      console.log(`[HLSWish] Resolviendo: ${e}`), r !== e && console.log(`[HLSWish] \u2192 Mapped to: ${r}`);
      let l = yield P.default.get(r, { headers: { "User-Agent": N, Referer: "https://embed69.org/", Origin: "https://embed69.org", Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8", "Accept-Language": "es-MX,es;q=0.9" }, timeout: 15e3, maxRedirects: 5 }), a = typeof l.data == "string" ? l.data : JSON.stringify(l.data), c = a.match(/file\s*:\s*["']([^"']+)["']/i);
      if (c) {
        let f = c[1];
        if (f.startsWith("/") && (f = s + f), f.includes("vibuxer.com/stream/")) {
          console.log(`[HLSWish] Siguiendo redirect: ${f.substring(0, 80)}...`);
          try {
            let p = yield P.default.get(f, { headers: { "User-Agent": N, Referer: s + "/" }, timeout: 8e3, maxRedirects: 5, validateStatus: (y) => y < 400 }), d = ((i = (o = p.request) == null ? void 0 : o.res) == null ? void 0 : i.responseUrl) || ((n = p.config) == null ? void 0 : n.url);
            d && d.includes(".m3u8") && (f = d);
          } catch (p) {
          }
        }
        return console.log(`[HLSWish] URL encontrada: ${f.substring(0, 80)}...`), { url: f, quality: "1080p", headers: { "User-Agent": N, Referer: s + "/" } };
      }
      let u = a.match(/eval\(function\(p,a,c,k,e,[a-z]\)\{[^}]+\}\s*\('([\s\S]+?)',\s*(\d+),\s*(\d+),\s*'([\s\S]+?)'\.split\('\|'\)/);
      if (u) {
        let f = $e(u[1], parseInt(u[2]), u[4].split("|")), p = ve(f, s);
        if (p)
          return console.log(`[HLSWish] URL encontrada: ${p.substring(0, 80)}...`), { url: p, quality: "1080p", headers: { "User-Agent": N, Referer: s + "/" } };
      }
      let g = a.match(/https?:\/\/[^"'\s\\]+\.m3u8[^"'\s\\]*/i);
      return g ? (console.log(`[HLSWish] URL encontrada: ${g[0].substring(0, 80)}...`), { url: g[0], quality: "1080p", headers: { "User-Agent": N, Referer: s + "/" } }) : (console.log("[HLSWish] No se encontr\xF3 URL"), null);
    } catch (r) {
      return console.log(`[HLSWish] Error: ${r.message}`), null;
    }
  });
}
var ie = "439c478a771f35c05022f9feabcca01c", le = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36", ae = "https://embed69.org", xe = 4e3, Le = { "voe.sx": re, "hglink.to": k, "streamwish.com": k, "streamwish.to": k, "wishembed.online": k, "filelions.com": k, "bysedikamoum.com": _, "filemoon.sx": _, "filemoon.to": _, "moonembed.pro": _ }, We = { voe: "VOE", streamwish: "StreamWish", filemoon: "Filemoon", vidhide: "VidHide" }, ke = ["LAT", "ESP", "SUB"];
function Ue(e) {
  try {
    let t = e.split(".");
    if (t.length < 2)
      return null;
    let o = t[1].replace(/-/g, "+").replace(/_/g, "/");
    return o += "=".repeat((4 - o.length % 4) % 4), JSON.parse(atob(o));
  } catch (t) {
    return null;
  }
}
function Me(e) {
  try {
    let t = e.match(/let\s+dataLink\s*=\s*(\[.+\]);/);
    return t ? JSON.parse(t[1]) : null;
  } catch (t) {
    return null;
  }
}
function Oe(e) {
  if (!e)
    return null;
  for (let [t, o] of Object.entries(Le))
    if (e.includes(t))
      return o;
  return null;
}
function _e(e, t) {
  return S(this, null, function* () {
    let o = t === "movie" ? `https://api.themoviedb.org/3/movie/${e}/external_ids?api_key=${ie}` : `https://api.themoviedb.org/3/tv/${e}/external_ids?api_key=${ie}`, { data: i } = yield z.default.get(o, { timeout: 5e3, headers: { "User-Agent": le } });
    return i.imdb_id || null;
  });
}
function Ne(e, t, o, i) {
  if (t === "movie")
    return `${ae}/f/${e}`;
  let n = String(i).padStart(2, "0");
  return `${ae}/f/${e}-${parseInt(o)}x${n}`;
}
function Te(e, t, o, i) {
  return S(this, null, function* () {
    if (!e || !t)
      return [];
    let n = Date.now();
    console.log(`[Embed69] Buscando: TMDB ${e} (${t})${o ? ` S${o}E${i}` : ""}`);
    try {
      let g2 = function(d) {
        return S(this, null, function* () {
          return (yield Promise.allSettled(d.map(({ url: h, resolver: b, lang: m, servername: E }) => Promise.race([b(h).then((R) => R ? Z(x({}, R), { lang: m, servername: E }) : null), new Promise((R, A) => setTimeout(() => A(new Error("timeout")), xe))])))).filter((h) => {
            var b;
            return h.status === "fulfilled" && ((b = h.value) == null ? void 0 : b.url);
          }).map((h) => h.value);
        });
      };
      var g = g2;
      let u = function(d) {
        let y = d.video_language || "LAT", h = [];
        for (let b of d.sortedEmbeds || []) {
          if (b.servername === "download")
            continue;
          let m = Ue(b.link);
          if (!m || !m.link)
            continue;
          let E = Oe(m.link);
          if (!E) {
            console.log(`[Embed69] Sin resolver para ${b.servername}: ${m.link.substring(0, 60)}`);
            continue;
          }
          h.push({ url: m.link, resolver: E, lang: y, servername: b.servername });
        }
        return h;
      }, r = yield _e(e, t);
      if (!r)
        return console.log("[Embed69] No se encontr\xF3 IMDB ID"), [];
      console.log(`[Embed69] IMDB ID: ${r}`);
      let s = Ne(r, t, o, i);
      console.log(`[Embed69] Fetching: ${s}`);
      let { data: l } = yield z.default.get(s, { timeout: 8e3, headers: { "User-Agent": le, Referer: "https://sololatino.net/", Accept: "text/html,application/xhtml+xml" } }), a = Me(l);
      if (!a || a.length === 0)
        return console.log("[Embed69] No se encontr\xF3 dataLink en el HTML"), [];
      console.log(`[Embed69] ${a.length} idiomas disponibles: ${a.map((d) => d.video_language).join(", ")}`);
      let c = {};
      for (let d of a)
        c[d.video_language] = d;
      let f = [];
      for (let d of ke) {
        let y = c[d];
        if (!y)
          continue;
        let h = u(y);
        if (h.length === 0)
          continue;
        console.log(`[Embed69] Resolviendo ${h.length} embeds (${d})...`);
        let b = yield g2(h);
        if (b.length > 0) {
          for (let { url: m, quality: E, lang: R, servername: A, headers: v } of b) {
            let w = R === "LAT" ? "Latino" : R === "ESP" ? "Espa\xF1ol" : "Subtitulado", T = We[A] || A;
            f.push({ name: "Embed69", title: `${E || "1080p"} \xB7 ${w} \xB7 ${T}`, url: m, quality: E || "1080p", headers: v || {} });
          }
          console.log(`[Embed69] \u2713 Streams encontrados en ${d}, omitiendo idiomas de menor prioridad`);
          break;
        } else
          console.log(`[Embed69] Sin streams en ${d}, intentando siguiente idioma...`);
      }
      let p = ((Date.now() - n) / 1e3).toFixed(2);
      return console.log(`[Embed69] \u2713 ${f.length} streams en ${p}s`), f;
    } catch (r) {
      return console.log(`[Embed69] Error: ${r.message}`), [];
    }
  });
}
