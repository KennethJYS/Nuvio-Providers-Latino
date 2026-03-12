var pe = Object.create;
var N = Object.defineProperty, he = Object.defineProperties, me = Object.getOwnPropertyDescriptor, ge = Object.getOwnPropertyDescriptors, ye = Object.getOwnPropertyNames, Q = Object.getOwnPropertySymbols, be = Object.getPrototypeOf, Z = Object.prototype.hasOwnProperty, Ae = Object.prototype.propertyIsEnumerable;
var Y = (e, t, n) => t in e ? N(e, t, { enumerable: true, configurable: true, writable: true, value: n }) : e[t] = n, L = (e, t) => {
  for (var n in t || (t = {}))
    Z.call(t, n) && Y(e, n, t[n]);
  if (Q)
    for (var n of Q(t))
      Ae.call(t, n) && Y(e, n, t[n]);
  return e;
}, ee = (e, t) => he(e, ge(t));
var Re = (e, t) => {
  for (var n in t)
    N(e, n, { get: t[n], enumerable: true });
}, te = (e, t, n, i) => {
  if (t && typeof t == "object" || typeof t == "function")
    for (let o of ye(t))
      !Z.call(e, o) && o !== n && N(e, o, { get: () => t[o], enumerable: !(i = me(t, o)) || i.enumerable });
  return e;
};
var $ = (e, t, n) => (n = e != null ? pe(be(e)) : {}, te(t || !e || !e.__esModule ? N(n, "default", { value: e, enumerable: true }) : n, e)), ve = (e) => te(N({}, "__esModule", { value: true }), e);
var y = (e, t, n) => new Promise((i, o) => {
  var r = (s) => {
    try {
      l(n.next(s));
    } catch (c) {
      o(c);
    }
  }, a = (s) => {
    try {
      l(n.throw(s));
    } catch (c) {
      o(c);
    }
  }, l = (s) => s.done ? i(s.value) : Promise.resolve(s.value).then(r, a);
  l((n = n.apply(e, t)).next());
});
var Be = {};
Re(Be, { getStreams: () => qe });
module.exports = ve(Be);
var K = $(require("axios"));
var re = $(require("axios"));
var ne = $(require("axios"));
var Se = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
function q(e, t) {
  return e >= 3840 || t >= 2160 ? "4K" : e >= 1920 || t >= 1080 ? "1080p" : e >= 1280 || t >= 720 ? "720p" : e >= 854 || t >= 480 ? "480p" : "360p";
}
function B(n) {
  return y(this, arguments, function* (e, t = {}) {
    try {
      let { data: i } = yield ne.default.get(e, { timeout: 3e3, headers: L({ "User-Agent": Se }, t), responseType: "text" });
      if (!i.includes("#EXT-X-STREAM-INF")) {
        let l = e.match(/[_-](\d{3,4})p/);
        return l ? `${l[1]}p` : "1080p";
      }
      let o = 0, r = 0, a = i.split(`
`);
      for (let l of a) {
        let s = l.match(/RESOLUTION=(\d+)x(\d+)/);
        if (s) {
          let c = parseInt(s[1]), u = parseInt(s[2]);
          u > r && (r = u, o = c);
        }
      }
      return r > 0 ? q(o, r) : "1080p";
    } catch (i) {
      return "1080p";
    }
  });
}
var $e = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
function oe(e) {
  try {
    return typeof atob != "undefined" ? atob(e) : Buffer.from(e, "base64").toString("utf8");
  } catch (t) {
    return null;
  }
}
function xe(e, t) {
  try {
    let i = t.replace(/^\[|\]$/g, "").split("','").map((c) => c.replace(/^'+|'+$/g, "")).map((c) => c.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")), o = "";
    for (let c of e) {
      let u = c.charCodeAt(0);
      u > 64 && u < 91 ? u = (u - 52) % 26 + 65 : u > 96 && u < 123 && (u = (u - 84) % 26 + 97), o += String.fromCharCode(u);
    }
    for (let c of i)
      o = o.replace(new RegExp(c, "g"), "_");
    o = o.split("_").join("");
    let r = oe(o);
    if (!r)
      return null;
    let a = "";
    for (let c = 0; c < r.length; c++)
      a += String.fromCharCode((r.charCodeAt(c) - 3 + 256) % 256);
    let l = a.split("").reverse().join(""), s = oe(l);
    return s ? JSON.parse(s) : null;
  } catch (n) {
    return console.log("[VOE] voeDecode error:", n.message), null;
  }
}
function F(n) {
  return y(this, arguments, function* (e, t = {}) {
    return re.default.get(e, { timeout: 15e3, maxRedirects: 5, headers: L({ "User-Agent": $e, Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8" }, t), validateStatus: (i) => i < 500 });
  });
}
function se(e) {
  return y(this, null, function* () {
    try {
      console.log(`[VOE] Resolviendo: ${e}`);
      let t = yield F(e, { Referer: e }), n = String(t && t.data ? t.data : "");
      if (/permanentToken/i.test(n)) {
        let s = n.match(/window\.location\.href\s*=\s*'([^']+)'/i);
        if (s) {
          console.log(`[VOE] Permanent token redirect -> ${s[1]}`);
          let c = yield F(s[1], { Referer: e });
          c && c.data && (n = String(c.data));
        }
      }
      let i = n.match(/json">\s*\[\s*['"]([^'"]+)['"]\s*\]\s*<\/script>\s*<script[^>]*src=['"]([^'"]+)['"]/i);
      if (i) {
        let s = i[1], c = i[2].startsWith("http") ? i[2] : new URL(i[2], e).href;
        console.log(`[VOE] Found encoded array + loader: ${c}`);
        let u = yield F(c, { Referer: e }), g = u && u.data ? String(u.data) : "", d = g.match(/(\[(?:'[^']{1,10}'[\s,]*){4,12}\])/i) || g.match(/(\[(?:"[^"]{1,10}"[,\s]*){4,12}\])/i);
        if (d) {
          let p = xe(s, d[1]);
          if (p && (p.source || p.direct_access_url)) {
            let f = p.source || p.direct_access_url, b = yield B(f, { Referer: e });
            return console.log(`[VOE] URL encontrada: ${f.substring(0, 80)}...`), { url: f, quality: b, headers: { Referer: e } };
          }
        }
      }
      let o = /(?:mp4|hls)'\s*:\s*'([^']+)'/gi, r = /(?:mp4|hls)"\s*:\s*"([^"]+)"/gi, a = [], l;
      for (; (l = o.exec(n)) !== null; )
        a.push(l);
      for (; (l = r.exec(n)) !== null; )
        a.push(l);
      for (let s of a) {
        let c = s[1];
        if (!c)
          continue;
        let u = c;
        if (u.startsWith("aHR0"))
          try {
            u = atob(u);
          } catch (g) {
          }
        return console.log(`[VOE] URL encontrada (fallback): ${u.substring(0, 80)}...`), { url: u, quality: yield B(u, { Referer: e }), headers: { Referer: e } };
      }
      return console.log("[VOE] No se encontr\xF3 URL"), null;
    } catch (t) {
      return console.log(`[VOE] Error: ${t.message}`), null;
    }
  });
}
var C = $(require("axios")), x = $(require("crypto-js"));
var z = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
function V(e) {
  e = e.replace(/-/g, "+").replace(/_/g, "/");
  let t = (4 - e.length % 4) % 4;
  return x.default.enc.Base64.parse(e + "=".repeat(t));
}
function k(e) {
  let t = e.words, n = e.sigBytes, i = new Uint8Array(n);
  for (let o = 0; o < n; o++)
    i[o] = t[o >>> 2] >>> 24 - o % 4 * 8 & 255;
  return i;
}
function j(e) {
  let t = [];
  for (let n = 0; n < e.length; n += 4)
    t.push((e[n] || 0) << 24 | (e[n + 1] || 0) << 16 | (e[n + 2] || 0) << 8 | (e[n + 3] || 0));
  return x.default.lib.WordArray.create(t, e.length);
}
function ie(e) {
  let t = new Uint8Array(e);
  for (let n = 15; n >= 12 && (t[n]++, t[n] === 0); n--)
    ;
  return t;
}
function we(e, t, n) {
  try {
    let i = new Uint8Array(16);
    i.set(t, 0), i[15] = 1;
    let o = ie(i), r = j(e), a = new Uint8Array(n.length);
    for (let l = 0; l < n.length; l += 16) {
      let s = Math.min(16, n.length - l), c = j(o), u = x.default.AES.encrypt(c, r, { mode: x.default.mode.ECB, padding: x.default.pad.NoPadding }), g = k(u.ciphertext);
      for (let d = 0; d < s; d++)
        a[l + d] = n[l + d] ^ g[d];
      o = ie(o);
    }
    return a;
  } catch (i) {
    return console.log("[Filemoon] AES-GCM error:", i.message), null;
  }
}
function O(e) {
  return y(this, null, function* () {
    var t, n, i;
    console.log(`[Filemoon] Resolviendo: ${e}`);
    try {
      let o = e.match(/\/(?:e|d)\/([a-z0-9]{12})/i);
      if (!o)
        return null;
      let r = o[1], { data: a } = yield C.default.get(`https://filemooon.link/api/videos/${r}/embed/playback`, { timeout: 7e3, headers: { "User-Agent": z, Referer: e } });
      if (a.error)
        return console.log(`[Filemoon] API error: ${a.error}`), null;
      let l = a.playback;
      if ((l == null ? void 0 : l.algorithm) !== "AES-256-GCM" || ((t = l.key_parts) == null ? void 0 : t.length) !== 2)
        return console.log("[Filemoon] Formato de cifrado no soportado"), null;
      let s = k(V(l.key_parts[0])), c = k(V(l.key_parts[1])), u = new Uint8Array(s.length + c.length);
      u.set(s, 0), u.set(c, s.length);
      let g;
      if (u.length === 32)
        g = u;
      else {
        let R = j(u);
        g = k(x.default.SHA256(R));
      }
      let d = k(V(l.iv)), p = k(V(l.payload));
      if (p.length < 16)
        return null;
      let f = p.slice(0, -16), b = we(g, d, f);
      if (!b)
        return null;
      let m = "";
      for (let R = 0; R < b.length; R++)
        m += String.fromCharCode(b[R]);
      let h = (i = (n = JSON.parse(m).sources) == null ? void 0 : n[0]) == null ? void 0 : i.url;
      if (!h)
        return null;
      console.log(`[Filemoon] URL encontrada: ${h.substring(0, 80)}...`);
      let v = h, S = "1080p";
      if (h.includes("master"))
        try {
          let w = (yield C.default.get(h, { timeout: 3e3, headers: { "User-Agent": z, Referer: e }, responseType: "text" })).data.split(`
`), E = 0, T = 0, J = h;
          for (let U = 0; U < w.length; U++) {
            let G = w[U].trim();
            if (G.startsWith("#EXT-X-STREAM-INF")) {
              let H = G.match(/RESOLUTION=(\d+)x(\d+)/), fe = H ? parseInt(H[1]) : 0, X = H ? parseInt(H[2]) : 0;
              for (let I = U + 1; I < U + 3 && I < w.length; I++) {
                let M = w[I].trim();
                if (M && !M.startsWith("#") && X > E) {
                  E = X, T = fe, J = M.startsWith("http") ? M : new URL(M, h).toString();
                  break;
                }
              }
            }
          }
          E > 0 && (v = J, S = q(T, E), console.log(`[Filemoon] Mejor calidad: ${S}`));
        } catch (R) {
          console.log(`[Filemoon] No se pudo parsear master: ${R.message}`);
        }
      return { url: v, quality: S, headers: { "User-Agent": z, Referer: e, Origin: "https://filemoon.sx" } };
    } catch (o) {
      return console.log(`[Filemoon] Error: ${o.message}`), null;
    }
  });
}
var D = $(require("axios"));
var _ = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
function Ee(e, t, n) {
  let i = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ", o = (r) => {
    let a = 0;
    for (let l = 0; l < r.length; l++) {
      let s = i.indexOf(r[l]);
      if (s === -1)
        return NaN;
      a = a * t + s;
    }
    return a;
  };
  return e.replace(/\b([0-9a-zA-Z]+)\b/g, (r) => {
    let a = o(r);
    return isNaN(a) || a >= n.length ? r : n[a] && n[a] !== "" ? n[a] : r;
  });
}
function Le(e, t) {
  let n = e.match(/\{[^{}]*"hls[234]"\s*:\s*"([^"]+)"[^{}]*\}/);
  if (n)
    try {
      let o = n[0].replace(/(\w+)\s*:/g, '"$1":'), r = JSON.parse(o), a = r.hls4 || r.hls3 || r.hls2;
      if (a)
        return a.startsWith("/") ? t + a : a;
    } catch (o) {
      let r = n[0].match(/"hls[234]"\s*:\s*"([^"]+\.m3u8[^"]*)"/);
      if (r) {
        let a = r[1];
        return a.startsWith("/") ? t + a : a;
      }
    }
  let i = e.match(/["']([^"']{30,}\.m3u8[^"']*)['"]/i);
  if (i) {
    let o = i[1];
    return o.startsWith("/") ? t + o : o;
  }
  return null;
}
var ke = { "hglink.to": "vibuxer.com" };
function W(e) {
  return y(this, null, function* () {
    var t, n, i, o;
    try {
      let r = e;
      for (let [d, p] of Object.entries(ke))
        if (r.includes(d)) {
          r = r.replace(d, p);
          break;
        }
      let a = ((t = r.match(/^(https?:\/\/[^/]+)/)) == null ? void 0 : t[1]) || "https://hlswish.com";
      console.log(`[HLSWish] Resolviendo: ${e}`), r !== e && console.log(`[HLSWish] \u2192 Mapped to: ${r}`);
      let l = yield D.default.get(r, { headers: { "User-Agent": _, Referer: "https://embed69.org/", Origin: "https://embed69.org", Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8", "Accept-Language": "es-MX,es;q=0.9" }, timeout: 15e3, maxRedirects: 5 }), s = typeof l.data == "string" ? l.data : JSON.stringify(l.data), c = s.match(/file\s*:\s*["']([^"']+)["']/i);
      if (c) {
        let d = c[1];
        if (d.startsWith("/") && (d = a + d), d.includes("vibuxer.com/stream/")) {
          console.log(`[HLSWish] Siguiendo redirect: ${d.substring(0, 80)}...`);
          try {
            let p = yield D.default.get(d, { headers: { "User-Agent": _, Referer: a + "/" }, timeout: 8e3, maxRedirects: 5, validateStatus: (b) => b < 400 }), f = ((i = (n = p.request) == null ? void 0 : n.res) == null ? void 0 : i.responseUrl) || ((o = p.config) == null ? void 0 : o.url);
            f && f.includes(".m3u8") && (d = f);
          } catch (p) {
          }
        }
        return console.log(`[HLSWish] URL encontrada: ${d.substring(0, 80)}...`), { url: d, quality: "1080p", headers: { "User-Agent": _, Referer: a + "/" } };
      }
      let u = s.match(/eval\(function\(p,a,c,k,e,[a-z]\)\{[^}]+\}\s*\('([\s\S]+?)',\s*(\d+),\s*(\d+),\s*'([\s\S]+?)'\.split\('\|'\)/);
      if (u) {
        let d = Ee(u[1], parseInt(u[2]), u[4].split("|")), p = Le(d, a);
        if (p)
          return console.log(`[HLSWish] URL encontrada: ${p.substring(0, 80)}...`), { url: p, quality: "1080p", headers: { "User-Agent": _, Referer: a + "/" } };
      }
      let g = s.match(/https?:\/\/[^"'\s\\]+\.m3u8[^"'\s\\]*/i);
      return g ? (console.log(`[HLSWish] URL encontrada: ${g[0].substring(0, 80)}...`), { url: g[0], quality: "1080p", headers: { "User-Agent": _, Referer: a + "/" } }) : (console.log("[HLSWish] No se encontr\xF3 URL"), null);
    } catch (r) {
      return console.log(`[HLSWish] Error: ${r.message}`), null;
    }
  });
}
var ae = $(require("axios"));
var le = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
function We(e) {
  try {
    let t = e.match(/eval\(function\(p,a,c,k,e,[rd]\)\{.*?\}\s*\('([\s\S]*?)',\s*(\d+),\s*(\d+),\s*'([\s\S]*?)'\.split\('\|'\)/);
    if (!t)
      return null;
    let [, n, i, o, r] = t;
    i = parseInt(i), o = parseInt(o), r = r.split("|");
    let a = (l, s) => {
      let c = "0123456789abcdefghijklmnopqrstuvwxyz", u = "";
      for (; l > 0; )
        u = c[l % s] + u, l = Math.floor(l / s);
      return u || "0";
    };
    return n = n.replace(/\b\w+\b/g, (l) => {
      let s = parseInt(l, 36);
      return s < r.length && r[s] ? r[s] : a(s, i);
    }), n;
  } catch (t) {
    return null;
  }
}
function P(e) {
  return y(this, null, function* () {
    var t;
    try {
      console.log(`[VidHide] Resolviendo: ${e}`);
      let { data: n } = yield ae.default.get(e, { timeout: 15e3, maxRedirects: 10, headers: { "User-Agent": le, Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8", Referer: "https://embed69.org/" } }), i = n.match(/eval\(function\(p,a,c,k,e,[rd]\)[\s\S]*?\.split\('\|'\)[^\)]*\)\)/);
      if (!i)
        return console.log("[VidHide] No se encontr\xF3 bloque eval"), null;
      let o = We(i[0]);
      if (!o)
        return console.log("[VidHide] No se pudo desempacar"), null;
      let r = o.match(/"hls4"\s*:\s*"([^"]+)"/), a = o.match(/"hls2"\s*:\s*"([^"]+)"/), l = (t = r || a) == null ? void 0 : t[1];
      if (!l)
        return console.log("[VidHide] No se encontr\xF3 hls4/hls2"), null;
      let s = l;
      l.startsWith("http") || (s = `${new URL(e).origin}${l}`), console.log(`[VidHide] URL encontrada: ${s.substring(0, 80)}...`);
      let c = new URL(e).origin;
      return { url: s, headers: { "User-Agent": le, Referer: `${c}/`, Origin: c } };
    } catch (n) {
      return console.log(`[VidHide] Error: ${n.message}`), null;
    }
  });
}
var ce = "439c478a771f35c05022f9feabcca01c", de = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36", ue = "https://embed69.org", Ue = 4e3, Me = { "voe.sx": se, "hglink.to": W, "streamwish.com": W, "streamwish.to": W, "wishembed.online": W, "filelions.com": W, "bysedikamoum.com": O, "filemoon.sx": O, "filemoon.to": O, "moonembed.pro": O, "dintezuvio.com": P, "vidhide.com": P }, Ne = { voe: "VOE", streamwish: "StreamWish", filemoon: "Filemoon", vidhide: "VidHide" }, Oe = ["LAT", "ESP", "SUB"];
function _e(e) {
  try {
    let t = e.split(".");
    if (t.length < 2)
      return null;
    let n = t[1].replace(/-/g, "+").replace(/_/g, "/");
    return n += "=".repeat((4 - n.length % 4) % 4), JSON.parse(atob(n));
  } catch (t) {
    return null;
  }
}
function Te(e) {
  try {
    let t = e.match(/let\s+dataLink\s*=\s*(\[.+\]);/);
    return t ? JSON.parse(t[1]) : null;
  } catch (t) {
    return null;
  }
}
function He(e) {
  if (!e)
    return null;
  for (let [t, n] of Object.entries(Me))
    if (e.includes(t))
      return n;
  return null;
}
function Ie(e, t) {
  return y(this, null, function* () {
    let n = t === "movie" ? `https://api.themoviedb.org/3/movie/${e}/external_ids?api_key=${ce}` : `https://api.themoviedb.org/3/tv/${e}/external_ids?api_key=${ce}`, { data: i } = yield K.default.get(n, { timeout: 5e3, headers: { "User-Agent": de } });
    return i.imdb_id || null;
  });
}
function Ve(e, t, n, i) {
  if (t === "movie")
    return `${ue}/f/${e}`;
  let o = String(i).padStart(2, "0");
  return `${ue}/f/${e}-${parseInt(n)}x${o}`;
}
function qe(e, t, n, i) {
  return y(this, null, function* () {
    if (!e || !t)
      return [];
    let o = Date.now();
    console.log(`[Embed69] Buscando: TMDB ${e} (${t})${n ? ` S${n}E${i}` : ""}`);
    try {
      let g2 = function(f) {
        return y(this, null, function* () {
          return (yield Promise.allSettled(f.map(({ url: m, resolver: A, lang: h, servername: v }) => Promise.race([A(m).then((S) => S ? ee(L({}, S), { lang: h, servername: v }) : null), new Promise((S, R) => setTimeout(() => R(new Error("timeout")), Ue))])))).filter((m) => {
            var A;
            return m.status === "fulfilled" && ((A = m.value) == null ? void 0 : A.url);
          }).map((m) => m.value);
        });
      };
      var g = g2;
      let u = function(f) {
        let b = f.video_language || "LAT", m = [];
        for (let A of f.sortedEmbeds || []) {
          if (A.servername === "download")
            continue;
          let h = _e(A.link);
          if (!h || !h.link)
            continue;
          let v = He(h.link);
          if (!v) {
            console.log(`[Embed69] Sin resolver para ${A.servername}: ${h.link.substring(0, 60)}`);
            continue;
          }
          m.push({ url: h.link, resolver: v, lang: b, servername: A.servername });
        }
        return m;
      }, r = yield Ie(e, t);
      if (!r)
        return console.log("[Embed69] No se encontr\xF3 IMDB ID"), [];
      console.log(`[Embed69] IMDB ID: ${r}`);
      let a = Ve(r, t, n, i);
      console.log(`[Embed69] Fetching: ${a}`);
      let { data: l } = yield K.default.get(a, { timeout: 8e3, headers: { "User-Agent": de, Referer: "https://sololatino.net/", Accept: "text/html,application/xhtml+xml" } }), s = Te(l);
      if (!s || s.length === 0)
        return console.log("[Embed69] No se encontr\xF3 dataLink en el HTML"), [];
      console.log(`[Embed69] ${s.length} idiomas disponibles: ${s.map((f) => f.video_language).join(", ")}`);
      let c = {};
      for (let f of s)
        c[f.video_language] = f;
      let d = [];
      for (let f of Oe) {
        let b = c[f];
        if (!b)
          continue;
        let m = u(b);
        if (m.length === 0)
          continue;
        console.log(`[Embed69] Resolviendo ${m.length} embeds (${f})...`);
        let A = yield g2(m);
        if (A.length > 0) {
          for (let { url: h, quality: v, lang: S, servername: R, headers: w } of A) {
            let E = S === "LAT" ? "Latino" : S === "ESP" ? "Espa\xF1ol" : "Subtitulado", T = Ne[R] || R;
            d.push({ name: "Embed69", title: `${v || "1080p"} \xB7 ${E} \xB7 ${T}`, url: h, quality: v || "1080p", headers: w || {} });
          }
          console.log(`[Embed69] \u2713 Streams encontrados en ${f}, omitiendo idiomas de menor prioridad`);
          break;
        } else
          console.log(`[Embed69] Sin streams en ${f}, intentando siguiente idioma...`);
      }
      let p = ((Date.now() - o) / 1e3).toFixed(2);
      return console.log(`[Embed69] \u2713 ${d.length} streams en ${p}s`), d;
    } catch (r) {
      return console.log(`[Embed69] Error: ${r.message}`), [];
    }
  });
}
