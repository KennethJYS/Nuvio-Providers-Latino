var ue = Object.create;
var S = Object.defineProperty;
var pe = Object.getOwnPropertyDescriptor;
var fe = Object.getOwnPropertyNames, J = Object.getOwnPropertySymbols, he = Object.getPrototypeOf, Q = Object.prototype.hasOwnProperty, de = Object.prototype.propertyIsEnumerable;
var G = (e, o, t) => o in e ? S(e, o, { enumerable: true, configurable: true, writable: true, value: t }) : e[o] = t, k = (e, o) => {
  for (var t in o || (o = {}))
    Q.call(o, t) && G(e, t, o[t]);
  if (J)
    for (var t of J(o))
      de.call(o, t) && G(e, t, o[t]);
  return e;
};
var ge = (e, o) => {
  for (var t in o)
    S(e, t, { get: o[t], enumerable: true });
}, Y = (e, o, t, c) => {
  if (o && typeof o == "object" || typeof o == "function")
    for (let n of fe(o))
      !Q.call(e, n) && n !== t && S(e, n, { get: () => o[n], enumerable: !(c = pe(o, n)) || c.enumerable });
  return e;
};
var R = (e, o, t) => (t = e != null ? ue(he(e)) : {}, Y(o || !e || !e.__esModule ? S(t, "default", { value: e, enumerable: true }) : t, e)), me = (e) => Y(S({}, "__esModule", { value: true }), e);
var d = (e, o, t) => new Promise((c, n) => {
  var r = (i) => {
    try {
      a(t.next(i));
    } catch (u) {
      n(u);
    }
  }, s = (i) => {
    try {
      a(t.throw(i));
    } catch (u) {
      n(u);
    }
  }, a = (i) => i.done ? c(i.value) : Promise.resolve(i.value).then(r, s);
  a((t = t.apply(e, o)).next());
});
var Le = {};
ge(Le, { getStreams: () => ke });
module.exports = me(Le);
var D = R(require("axios"));
var H = R(require("axios"));
var W = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
function ye(e, o, t) {
  let c = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ", n = (r) => {
    let s = 0;
    for (let a = 0; a < r.length; a++) {
      let i = c.indexOf(r[a]);
      if (i === -1)
        return NaN;
      s = s * o + i;
    }
    return s;
  };
  return e.replace(/\b([0-9a-zA-Z]+)\b/g, (r) => {
    let s = n(r);
    return isNaN(s) || s >= t.length ? r : t[s] && t[s] !== "" ? t[s] : r;
  });
}
function Ae(e, o) {
  let t = e.match(/\{[^{}]*"hls[234]"\s*:\s*"([^"]+)"[^{}]*\}/);
  if (t)
    try {
      let n = t[0].replace(/(\w+)\s*:/g, '"$1":'), r = JSON.parse(n), s = r.hls4 || r.hls3 || r.hls2;
      if (s)
        return s.startsWith("/") ? o + s : s;
    } catch (n) {
      let r = t[0].match(/"hls[234]"\s*:\s*"([^"]+\.m3u8[^"]*)"/);
      if (r) {
        let s = r[1];
        return s.startsWith("/") ? o + s : s;
      }
    }
  let c = e.match(/["']([^"']{30,}\.m3u8[^"']*)['"]/i);
  if (c) {
    let n = c[1];
    return n.startsWith("/") ? o + n : n;
  }
  return null;
}
var Re = { "hglink.to": "vibuxer.com" };
function V(e) {
  return d(this, null, function* () {
    var o, t, c, n;
    try {
      let r = e;
      for (let [p, f] of Object.entries(Re))
        if (r.includes(p)) {
          r = r.replace(p, f);
          break;
        }
      let s = ((o = r.match(/^(https?:\/\/[^/]+)/)) == null ? void 0 : o[1]) || "https://hlswish.com";
      console.log(`[HLSWish] Resolviendo: ${e}`), r !== e && console.log(`[HLSWish] \u2192 Mapped to: ${r}`);
      let a = yield H.default.get(r, { headers: { "User-Agent": W, Referer: "https://embed69.org/", Origin: "https://embed69.org", Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8", "Accept-Language": "es-MX,es;q=0.9" }, timeout: 15e3, maxRedirects: 5 }), i = typeof a.data == "string" ? a.data : JSON.stringify(a.data), u = i.match(/file\s*:\s*["']([^"']+)["']/i);
      if (u) {
        let p = u[1];
        if (p.startsWith("/") && (p = s + p), p.includes("vibuxer.com/stream/")) {
          console.log(`[HLSWish] Siguiendo redirect: ${p.substring(0, 80)}...`);
          try {
            let f = yield H.default.get(p, { headers: { "User-Agent": W, Referer: s + "/" }, timeout: 8e3, maxRedirects: 5, validateStatus: (y) => y < 400 }), g = ((c = (t = f.request) == null ? void 0 : t.res) == null ? void 0 : c.responseUrl) || ((n = f.config) == null ? void 0 : n.url);
            g && g.includes(".m3u8") && (p = g);
          } catch (f) {
          }
        }
        return console.log(`[HLSWish] URL encontrada: ${p.substring(0, 80)}...`), { url: p, quality: "1080p", headers: { "User-Agent": W, Referer: s + "/" } };
      }
      let l = i.match(/eval\(function\(p,a,c,k,e,[a-z]\)\{[^}]+\}\s*\('([\s\S]+?)',\s*(\d+),\s*(\d+),\s*'([\s\S]+?)'\.split\('\|'\)/);
      if (l) {
        let p = ye(l[1], parseInt(l[2]), l[4].split("|")), f = Ae(p, s);
        if (f)
          return console.log(`[HLSWish] URL encontrada: ${f.substring(0, 80)}...`), { url: f, quality: "1080p", headers: { "User-Agent": W, Referer: s + "/" } };
      }
      let h = i.match(/https?:\/\/[^"'\s\\]+\.m3u8[^"'\s\\]*/i);
      return h ? (console.log(`[HLSWish] URL encontrada: ${h[0].substring(0, 80)}...`), { url: h[0], quality: "1080p", headers: { "User-Agent": W, Referer: s + "/" } }) : (console.log("[HLSWish] No se encontr\xF3 URL"), null);
    } catch (r) {
      return console.log(`[HLSWish] Error: ${r.message}`), null;
    }
  });
}
var T = R(require("axios")), x = R(require("crypto-js"));
var Z = R(require("axios"));
var xe = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
function I(e, o) {
  return e >= 3840 || o >= 2160 ? "4K" : e >= 1920 || o >= 1080 ? "1080p" : e >= 1280 || o >= 720 ? "720p" : e >= 854 || o >= 480 ? "480p" : "360p";
}
function _(t) {
  return d(this, arguments, function* (e, o = {}) {
    try {
      let { data: c } = yield Z.default.get(e, { timeout: 3e3, headers: k({ "User-Agent": xe }, o), responseType: "text" });
      if (!c.includes("#EXT-X-STREAM-INF")) {
        let a = e.match(/[_-](\d{3,4})p/);
        return a ? `${a[1]}p` : "1080p";
      }
      let n = 0, r = 0, s = c.split(`
`);
      for (let a of s) {
        let i = a.match(/RESOLUTION=(\d+)x(\d+)/);
        if (i) {
          let u = parseInt(i[1]), l = parseInt(i[2]);
          l > r && (r = l, n = u);
        }
      }
      return r > 0 ? I(n, r) : "1080p";
    } catch (c) {
      return "1080p";
    }
  });
}
var q = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
function L(e) {
  e = e.replace(/-/g, "+").replace(/_/g, "/");
  let o = (4 - e.length % 4) % 4;
  return x.default.enc.Base64.parse(e + "=".repeat(o));
}
function v(e) {
  let o = e.words, t = e.sigBytes, c = new Uint8Array(t);
  for (let n = 0; n < t; n++)
    c[n] = o[n >>> 2] >>> 24 - n % 4 * 8 & 255;
  return c;
}
function P(e) {
  let o = [];
  for (let t = 0; t < e.length; t += 4)
    o.push((e[t] || 0) << 24 | (e[t + 1] || 0) << 16 | (e[t + 2] || 0) << 8 | (e[t + 3] || 0));
  return x.default.lib.WordArray.create(o, e.length);
}
function ee(e) {
  let o = new Uint8Array(e);
  for (let t = 15; t >= 12 && (o[t]++, o[t] === 0); t--)
    ;
  return o;
}
function ve(e, o, t) {
  try {
    let c = new Uint8Array(16);
    c.set(o, 0), c[15] = 1;
    let n = ee(c), r = P(e), s = new Uint8Array(t.length);
    for (let a = 0; a < t.length; a += 16) {
      let i = Math.min(16, t.length - a), u = P(n), l = x.default.AES.encrypt(u, r, { mode: x.default.mode.ECB, padding: x.default.pad.NoPadding }), h = v(l.ciphertext);
      for (let p = 0; p < i; p++)
        s[a + p] = t[a + p] ^ h[p];
      n = ee(n);
    }
    return s;
  } catch (c) {
    return console.log("[Filemoon] AES-GCM error:", c.message), null;
  }
}
function te(e) {
  return d(this, null, function* () {
    var o, t, c;
    console.log(`[Filemoon] Resolviendo: ${e}`);
    try {
      let n = e.match(/\/(?:e|d)\/([a-z0-9]{12})/i);
      if (!n)
        return null;
      let r = n[1], { data: s } = yield T.default.get(`https://filemooon.link/api/videos/${r}/embed/playback`, { timeout: 7e3, headers: { "User-Agent": q, Referer: e } });
      if (s.error)
        return console.log(`[Filemoon] API error: ${s.error}`), null;
      let a = s.playback;
      if ((a == null ? void 0 : a.algorithm) !== "AES-256-GCM" || ((o = a.key_parts) == null ? void 0 : o.length) !== 2)
        return console.log("[Filemoon] Formato de cifrado no soportado"), null;
      let i = v(L(a.key_parts[0])), u = v(L(a.key_parts[1])), l = new Uint8Array(i.length + u.length);
      l.set(i, 0), l.set(u, i.length);
      let h;
      if (l.length === 32)
        h = l;
      else {
        let m = P(l);
        h = v(x.default.SHA256(m));
      }
      let p = v(L(a.iv)), f = v(L(a.payload));
      if (f.length < 16)
        return null;
      let g = f.slice(0, -16), y = ve(h, p, g);
      if (!y)
        return null;
      let F = "";
      for (let m = 0; m < y.length; m++)
        F += String.fromCharCode(y[m]);
      let A = (c = (t = JSON.parse(F).sources) == null ? void 0 : t[0]) == null ? void 0 : c.url;
      if (!A)
        return null;
      console.log(`[Filemoon] URL encontrada: ${A.substring(0, 80)}...`);
      let z = A, O = "1080p";
      if (A.includes("master"))
        try {
          let b = (yield T.default.get(A, { timeout: 3e3, headers: { "User-Agent": q, Referer: e }, responseType: "text" })).data.split(`
`), E = 0, C = 0, B = A;
          for (let w = 0; w < b.length; w++) {
            let j = b[w].trim();
            if (j.startsWith("#EXT-X-STREAM-INF")) {
              let M = j.match(/RESOLUTION=(\d+)x(\d+)/), ie = M ? parseInt(M[1]) : 0, K = M ? parseInt(M[2]) : 0;
              for (let U = w + 1; U < w + 3 && U < b.length; U++) {
                let $ = b[U].trim();
                if ($ && !$.startsWith("#") && K > E) {
                  E = K, C = ie, B = $.startsWith("http") ? $ : new URL($, A).toString();
                  break;
                }
              }
            }
          }
          E > 0 && (z = B, O = I(C, E), console.log(`[Filemoon] Mejor calidad: ${O}`));
        } catch (m) {
          console.log(`[Filemoon] No se pudo parsear master: ${m.message}`);
        }
      return { url: z, quality: O, headers: { "User-Agent": q, Referer: e, Origin: "https://filemoon.sx" } };
    } catch (n) {
      return console.log(`[Filemoon] Error: ${n.message}`), null;
    }
  });
}
var ne = R(require("axios"));
var we = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
function oe(e) {
  try {
    return typeof atob != "undefined" ? atob(e) : Buffer.from(e, "base64").toString("utf8");
  } catch (o) {
    return null;
  }
}
function $e(e, o) {
  try {
    let c = o.replace(/^\[|\]$/g, "").split("','").map((u) => u.replace(/^'+|'+$/g, "")).map((u) => u.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")), n = "";
    for (let u of e) {
      let l = u.charCodeAt(0);
      l > 64 && l < 91 ? l = (l - 52) % 26 + 65 : l > 96 && l < 123 && (l = (l - 84) % 26 + 97), n += String.fromCharCode(l);
    }
    for (let u of c)
      n = n.replace(new RegExp(u, "g"), "_");
    n = n.split("_").join("");
    let r = oe(n);
    if (!r)
      return null;
    let s = "";
    for (let u = 0; u < r.length; u++)
      s += String.fromCharCode((r.charCodeAt(u) - 3 + 256) % 256);
    let a = s.split("").reverse().join(""), i = oe(a);
    return i ? JSON.parse(i) : null;
  } catch (t) {
    return console.log("[VOE] voeDecode error:", t.message), null;
  }
}
function X(t) {
  return d(this, arguments, function* (e, o = {}) {
    return ne.default.get(e, { timeout: 15e3, maxRedirects: 5, headers: k({ "User-Agent": we, Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8" }, o), validateStatus: (c) => c < 500 });
  });
}
function re(e) {
  return d(this, null, function* () {
    try {
      console.log(`[VOE] Resolviendo: ${e}`);
      let o = yield X(e, { Referer: e }), t = String(o && o.data ? o.data : "");
      if (/permanentToken/i.test(t)) {
        let i = t.match(/window\.location\.href\s*=\s*'([^']+)'/i);
        if (i) {
          console.log(`[VOE] Permanent token redirect -> ${i[1]}`);
          let u = yield X(i[1], { Referer: e });
          u && u.data && (t = String(u.data));
        }
      }
      let c = t.match(/json">\s*\[\s*['"]([^'"]+)['"]\s*\]\s*<\/script>\s*<script[^>]*src=['"]([^'"]+)['"]/i);
      if (c) {
        let i = c[1], u = c[2].startsWith("http") ? c[2] : new URL(c[2], e).href;
        console.log(`[VOE] Found encoded array + loader: ${u}`);
        let l = yield X(u, { Referer: e }), h = l && l.data ? String(l.data) : "", p = h.match(/(\[(?:'[^']{1,10}'[\s,]*){4,12}\])/i) || h.match(/(\[(?:"[^"]{1,10}"[,\s]*){4,12}\])/i);
        if (p) {
          let f = $e(i, p[1]);
          if (f && (f.source || f.direct_access_url)) {
            let g = f.source || f.direct_access_url, y = yield _(g, { Referer: e });
            return console.log(`[VOE] URL encontrada: ${g.substring(0, 80)}...`), { url: g, quality: y, headers: { Referer: e } };
          }
        }
      }
      let n = /(?:mp4|hls)'\s*:\s*'([^']+)'/gi, r = /(?:mp4|hls)"\s*:\s*"([^"]+)"/gi, s = [], a;
      for (; (a = n.exec(t)) !== null; )
        s.push(a);
      for (; (a = r.exec(t)) !== null; )
        s.push(a);
      for (let i of s) {
        let u = i[1];
        if (!u)
          continue;
        let l = u;
        if (l.startsWith("aHR0"))
          try {
            l = atob(l);
          } catch (h) {
          }
        return console.log(`[VOE] URL encontrada (fallback): ${l.substring(0, 80)}...`), { url: l, quality: yield _(l, { Referer: e }), headers: { Referer: e } };
      }
      return console.log("[VOE] No se encontr\xF3 URL"), null;
    } catch (o) {
      return console.log(`[VOE] Error: ${o.message}`), null;
    }
  });
}
var ae = R(require("axios"));
var se = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
function Se(e) {
  try {
    let o = e.match(/eval\(function\(p,a,c,k,e,[rd]\)\{.*?\}\s*\('([\s\S]*?)',\s*(\d+),\s*(\d+),\s*'([\s\S]*?)'\.split\('\|'\)/);
    if (!o)
      return null;
    let [, t, c, n, r] = o;
    c = parseInt(c), n = parseInt(n), r = r.split("|");
    let s = (a, i) => {
      let u = "0123456789abcdefghijklmnopqrstuvwxyz", l = "";
      for (; a > 0; )
        l = u[a % i] + l, a = Math.floor(a / i);
      return l || "0";
    };
    return t = t.replace(/\b\w+\b/g, (a) => {
      let i = parseInt(a, 36);
      return i < r.length && r[i] ? r[i] : s(i, c);
    }), t;
  } catch (o) {
    return null;
  }
}
function N(e) {
  return d(this, null, function* () {
    var o;
    try {
      console.log(`[VidHide] Resolviendo: ${e}`);
      let { data: t } = yield ae.default.get(e, { timeout: 15e3, maxRedirects: 10, headers: { "User-Agent": se, Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8", Referer: "https://embed69.org/" } }), c = t.match(/eval\(function\(p,a,c,k,e,[rd]\)[\s\S]*?\.split\('\|'\)[^\)]*\)\)/);
      if (!c)
        return console.log("[VidHide] No se encontr\xF3 bloque eval"), null;
      let n = Se(c[0]);
      if (!n)
        return console.log("[VidHide] No se pudo desempacar"), null;
      let r = n.match(/"hls4"\s*:\s*"([^"]+)"/), s = n.match(/"hls2"\s*:\s*"([^"]+)"/), a = (o = r || s) == null ? void 0 : o[1];
      if (!a)
        return console.log("[VidHide] No se encontr\xF3 hls4/hls2"), null;
      let i = a;
      a.startsWith("http") || (i = `${new URL(e).origin}${a}`), console.log(`[VidHide] URL encontrada: ${i.substring(0, 80)}...`);
      let u = new URL(e).origin;
      return { url: i, headers: { "User-Agent": se, Referer: `${u}/`, Origin: u } };
    } catch (t) {
      return console.log(`[VidHide] Error: ${t.message}`), null;
    }
  });
}
var We = "439c478a771f35c05022f9feabcca01c", le = "https://xupalace.org", ce = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36", be = { "User-Agent": ce, Accept: "text/html", "Accept-Language": "es-MX,es;q=0.9", Connection: "keep-alive" }, Ee = { "hglink.to": { fn: V, name: "StreamWish" }, "vibuxer.com": { fn: V, name: "StreamWish" }, "bysedikamoum.com": { fn: te, name: "Filemoon" }, "voe.sx": { fn: re, name: "VOE" }, "vidhidepro.com": { fn: N, name: "VidHide" }, "vidhide.com": { fn: N, name: "VidHide" }, "dintezuvio.com": { fn: N, name: "VidHide" } };
function Me(e, o) {
  return d(this, null, function* () {
    try {
      let t = `https://api.themoviedb.org/3/${o}/${e}/external_ids?api_key=${We}`, { data: c } = yield D.default.get(t, { timeout: 5e3, headers: { "User-Agent": ce } });
      return c.imdb_id || null;
    } catch (t) {
      return console.log(`[XuPalace] Error IMDB ID: ${t.message}`), null;
    }
  });
}
function Ue(e, o, t, c) {
  return d(this, null, function* () {
    try {
      let n;
      o === "movie" ? n = `/video/${e}/` : n = `/video/${e}-${t}x${String(c).padStart(2, "0")}/`, console.log(`[XuPalace] Fetching: ${le}${n}`);
      let { data: r } = yield D.default.get(`${le}${n}`, { timeout: 8e3, headers: be }), s = [...r.matchAll(/go_to_playerVast\('(https?:\/\/[^']+)'/g)];
      return [...new Set(s.map((a) => a[1]))];
    } catch (n) {
      return console.log(`[XuPalace] Error fetch: ${n.message}`), [];
    }
  });
}
function ke(e, o, t, c) {
  return d(this, null, function* () {
    if (!e)
      return [];
    let n = Date.now();
    console.log(`[XuPalace] Buscando: TMDB ${e} (${o})`);
    try {
      let r = yield Me(e, o);
      if (!r)
        return console.log("[XuPalace] No se encontr\xF3 IMDB ID"), [];
      console.log(`[XuPalace] IMDB ID: ${r}`);
      let s = yield Ue(r, o, t, c);
      if (s.length === 0)
        return console.log("[XuPalace] No hay embeds"), [];
      console.log(`[XuPalace] Resolviendo ${s.length} embeds...`);
      let i = (yield Promise.allSettled(s.map((l) => d(this, null, function* () {
        let h = new URL(l).hostname.replace("www.", ""), p = Ee[h];
        if (!p)
          return console.log(`[XuPalace] Sin resolver para: ${h}`), null;
        let f = yield p.fn(l);
        return f && (f.server = p.name), f;
      })))).filter((l) => l.status === "fulfilled" && l.value).map((l) => ({ name: "XuPalace", title: `${l.value.quality || "1080p"} \xB7 ${l.value.server || "Stream"}`, url: l.value.url, quality: l.value.quality || "1080p", headers: l.value.headers || {} })), u = ((Date.now() - n) / 1e3).toFixed(2);
      return console.log(`[XuPalace] \u2713 ${i.length} streams en ${u}s`), i;
    } catch (r) {
      return console.log(`[XuPalace] Error: ${r.message}`), [];
    }
  });
}
