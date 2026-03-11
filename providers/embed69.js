var ue = Object.create;
var U = Object.defineProperty, fe = Object.defineProperties, de = Object.getOwnPropertyDescriptor, pe = Object.getOwnPropertyDescriptors, me = Object.getOwnPropertyNames, G = Object.getOwnPropertySymbols, he = Object.getPrototypeOf, Q = Object.prototype.hasOwnProperty, ge = Object.prototype.propertyIsEnumerable;
var X = (e, o, t) => o in e ? U(e, o, { enumerable: true, configurable: true, writable: true, value: t }) : e[o] = t, x = (e, o) => {
  for (var t in o || (o = {}))
    Q.call(o, t) && X(e, t, o[t]);
  if (G)
    for (var t of G(o))
      ge.call(o, t) && X(e, t, o[t]);
  return e;
}, Y = (e, o) => fe(e, pe(o));
var ye = (e, o) => {
  for (var t in o)
    U(e, t, { get: o[t], enumerable: true });
}, Z = (e, o, t, r) => {
  if (o && typeof o == "object" || typeof o == "function")
    for (let n of me(o))
      !Q.call(e, n) && n !== t && U(e, n, { get: () => o[n], enumerable: !(r = de(o, n)) || r.enumerable });
  return e;
};
var L = (e, o, t) => (t = e != null ? ue(he(e)) : {}, Z(o || !e || !e.__esModule ? U(t, "default", { value: e, enumerable: true }) : t, e)), be = (e) => Z(U({}, "__esModule", { value: true }), e);
var y = (e, o, t) => new Promise((r, n) => {
  var c = (i) => {
    try {
      l(t.next(i));
    } catch (s) {
      n(s);
    }
  }, a = (i) => {
    try {
      l(t.throw(i));
    } catch (s) {
      n(s);
    }
  }, l = (i) => i.done ? r(i.value) : Promise.resolve(i.value).then(c, a);
  l((t = t.apply(e, o)).next());
});
var Ie = {};
ye(Ie, { getStreams: () => Te });
module.exports = be(Ie);
var P = L(require("axios"));
var oe = L(require("axios"));
var ee = L(require("axios"));
var Ae = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
function C(e, o) {
  return e >= 3840 || o >= 2160 ? "4K" : e >= 1920 || o >= 1080 ? "1080p" : e >= 1280 || o >= 720 ? "720p" : e >= 854 || o >= 480 ? "480p" : "360p";
}
function H(t) {
  return y(this, arguments, function* (e, o = {}) {
    try {
      let { data: r } = yield ee.default.get(e, { timeout: 3e3, headers: x({ "User-Agent": Ae }, o), responseType: "text" });
      if (!r.includes("#EXT-X-STREAM-INF")) {
        let l = e.match(/[_-](\d{3,4})p/);
        return l ? `${l[1]}p` : "1080p";
      }
      let n = 0, c = 0, a = r.split(`
`);
      for (let l of a) {
        let i = l.match(/RESOLUTION=(\d+)x(\d+)/);
        if (i) {
          let s = parseInt(i[1]), u = parseInt(i[2]);
          u > c && (c = u, n = s);
        }
      }
      return c > 0 ? C(n, c) : "1080p";
    } catch (r) {
      return "1080p";
    }
  });
}
var Ee = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
function te(e) {
  try {
    return typeof atob != "undefined" ? atob(e) : Buffer.from(e, "base64").toString("utf8");
  } catch (o) {
    return null;
  }
}
function $e(e, o) {
  try {
    let r = o.replace(/^\[|\]$/g, "").split("','").map((s) => s.replace(/^'+|'+$/g, "")).map((s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")), n = "";
    for (let s of e) {
      let u = s.charCodeAt(0);
      u > 64 && u < 91 ? u = (u - 52) % 26 + 65 : u > 96 && u < 123 && (u = (u - 84) % 26 + 97), n += String.fromCharCode(u);
    }
    for (let s of r)
      n = n.replace(new RegExp(s, "g"), "_");
    n = n.split("_").join("");
    let c = te(n);
    if (!c)
      return null;
    let a = "";
    for (let s = 0; s < c.length; s++)
      a += String.fromCharCode((c.charCodeAt(s) - 3 + 256) % 256);
    let l = a.split("").reverse().join(""), i = te(l);
    return i ? JSON.parse(i) : null;
  } catch (t) {
    return console.log("[VOE] voeDecode error:", t.message), null;
  }
}
function V(t) {
  return y(this, arguments, function* (e, o = {}) {
    return oe.default.get(e, { timeout: 15e3, maxRedirects: 5, headers: x({ "User-Agent": Ee, Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8" }, o), validateStatus: (r) => r < 500 });
  });
}
function ne(e) {
  return y(this, null, function* () {
    try {
      console.log(`[VOE] Resolviendo: ${e}`);
      let o = yield V(e, { Referer: e }), t = String(o && o.data ? o.data : "");
      if (/permanentToken/i.test(t)) {
        let i = t.match(/window\.location\.href\s*=\s*'([^']+)'/i);
        if (i) {
          console.log(`[VOE] Permanent token redirect -> ${i[1]}`);
          let s = yield V(i[1], { Referer: e });
          s && s.data && (t = String(s.data));
        }
      }
      let r = t.match(/json">\s*\[\s*['"]([^'"]+)['"]\s*\]\s*<\/script>\s*<script[^>]*src=['"]([^'"]+)['"]/i);
      if (r) {
        let i = r[1], s = r[2].startsWith("http") ? r[2] : new URL(r[2], e).href;
        console.log(`[VOE] Found encoded array + loader: ${s}`);
        let u = yield V(s, { Referer: e }), b = u && u.data ? String(u.data) : "", m = b.match(/(\[(?:'[^']{1,10}'[\s,]*){4,12}\])/i) || b.match(/(\[(?:"[^"]{1,10}"[,\s]*){4,12}\])/i);
        if (m) {
          let E = $e(i, m[1]);
          if (E && (E.source || E.direct_access_url)) {
            let f = E.source || E.direct_access_url, A = yield H(f, { Referer: e });
            return console.log(`[VOE] URL encontrada: ${f.substring(0, 80)}...`), { url: f, quality: A, headers: { Referer: e } };
          }
        }
      }
      let n = /(?:mp4|hls)'\s*:\s*'([^']+)'/gi, c = /(?:mp4|hls)"\s*:\s*"([^"]+)"/gi, a = [], l;
      for (; (l = n.exec(t)) !== null; )
        a.push(l);
      for (; (l = c.exec(t)) !== null; )
        a.push(l);
      for (let i of a) {
        let s = i[1];
        if (!s)
          continue;
        let u = s;
        if (u.startsWith("aHR0"))
          try {
            u = atob(u);
          } catch (b) {
          }
        return console.log(`[VOE] URL encontrada (fallback): ${u.substring(0, 80)}...`), { url: u, quality: yield H(u, { Referer: e }), headers: { Referer: e } };
      }
      return console.log("[VOE] No se encontr\xF3 URL"), null;
    } catch (o) {
      return console.log(`[VOE] Error: ${o.message}`), null;
    }
  });
}
var j = L(require("axios")), S = L(require("crypto-js"));
var D = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
function B(e) {
  e = e.replace(/-/g, "+").replace(/_/g, "/");
  let o = (4 - e.length % 4) % 4;
  return S.default.enc.Base64.parse(e + "=".repeat(o));
}
function k(e) {
  let o = e.words, t = e.sigBytes, r = new Uint8Array(t);
  for (let n = 0; n < t; n++)
    r[n] = o[n >>> 2] >>> 24 - n % 4 * 8 & 255;
  return r;
}
function q(e) {
  let o = [];
  for (let t = 0; t < e.length; t += 4)
    o.push((e[t] || 0) << 24 | (e[t + 1] || 0) << 16 | (e[t + 2] || 0) << 8 | (e[t + 3] || 0));
  return S.default.lib.WordArray.create(o, e.length);
}
function re(e) {
  let o = new Uint8Array(e);
  for (let t = 15; t >= 12 && (o[t]++, o[t] === 0); t--)
    ;
  return o;
}
function Re(e, o, t) {
  try {
    let r = new Uint8Array(16);
    r.set(o, 0), r[15] = 1;
    let n = re(r), c = q(e), a = new Uint8Array(t.length);
    for (let l = 0; l < t.length; l += 16) {
      let i = Math.min(16, t.length - l), s = q(n), u = S.default.AES.encrypt(s, c, { mode: S.default.mode.ECB, padding: S.default.pad.NoPadding }), b = k(u.ciphertext);
      for (let m = 0; m < i; m++)
        a[l + m] = t[l + m] ^ b[m];
      n = re(n);
    }
    return a;
  } catch (r) {
    return console.log("[Filemoon] AES-GCM error:", r.message), null;
  }
}
function _(e) {
  return y(this, null, function* () {
    var o, t, r;
    console.log(`[Filemoon] Resolviendo: ${e}`);
    try {
      let n = e.match(/\/(?:e|d)\/([a-z0-9]{12})/i);
      if (!n)
        return null;
      let c = n[1], { data: a } = yield j.default.get(`https://filemooon.link/api/videos/${c}/embed/playback`, { timeout: 7e3, headers: { "User-Agent": D, Referer: e } });
      if (a.error)
        return console.log(`[Filemoon] API error: ${a.error}`), null;
      let l = a.playback;
      if ((l == null ? void 0 : l.algorithm) !== "AES-256-GCM" || ((o = l.key_parts) == null ? void 0 : o.length) !== 2)
        return console.log("[Filemoon] Formato de cifrado no soportado"), null;
      let i = k(B(l.key_parts[0])), s = k(B(l.key_parts[1])), u = new Uint8Array(i.length + s.length);
      u.set(i, 0), u.set(s, i.length);
      let b;
      if (u.length === 32)
        b = u;
      else {
        let g = q(u);
        b = k(S.default.SHA256(g));
      }
      let m = k(B(l.iv)), E = k(B(l.payload));
      if (E.length < 16)
        return null;
      let f = E.slice(0, -16), A = Re(b, m, f);
      if (!A)
        return null;
      let p = "";
      for (let g = 0; g < A.length; g++)
        p += String.fromCharCode(A[g]);
      let d = (r = (t = JSON.parse(p).sources) == null ? void 0 : t[0]) == null ? void 0 : r.url;
      if (!d)
        return null;
      console.log(`[Filemoon] URL encontrada: ${d.substring(0, 80)}...`);
      let $ = d, R = "1080p";
      if (d.includes("master"))
        try {
          let w = (yield j.default.get(d, { timeout: 3e3, headers: { "User-Agent": D, Referer: e }, responseType: "text" })).data.split(`
`), v = 0, N = 0, z = d;
          for (let M = 0; M < w.length; M++) {
            let J = w[M].trim();
            if (J.startsWith("#EXT-X-STREAM-INF")) {
              let T = J.match(/RESOLUTION=(\d+)x(\d+)/), ce = T ? parseInt(T[1]) : 0, K = T ? parseInt(T[2]) : 0;
              for (let I = M + 1; I < M + 3 && I < w.length; I++) {
                let O = w[I].trim();
                if (O && !O.startsWith("#") && K > v) {
                  v = K, N = ce, z = O.startsWith("http") ? O : new URL(O, d).toString();
                  break;
                }
              }
            }
          }
          v > 0 && ($ = z, R = C(N, v), console.log(`[Filemoon] Mejor calidad: ${R}`));
        } catch (g) {
          console.log(`[Filemoon] No se pudo parsear master: ${g.message}`);
        }
      return { url: $, quality: R, headers: { "User-Agent": D, Referer: e, Origin: "https://filemoon.sx" } };
    } catch (n) {
      return console.log(`[Filemoon] Error: ${n.message}`), null;
    }
  });
}
var se = L(require("axios"));
var F = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
function Se(e, o, t) {
  let r = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ", n = (c) => {
    let a = 0;
    for (let l = 0; l < c.length; l++) {
      let i = r.indexOf(c[l]);
      if (i === -1)
        return NaN;
      a = a * o + i;
    }
    return a;
  };
  return e.replace(/\b([0-9a-zA-Z]+)\b/g, (c) => {
    let a = n(c);
    return isNaN(a) || a >= t.length ? c : t[a] && t[a] !== "" ? t[a] : c;
  });
}
function we(e, o) {
  let t = e.match(/\{[^{}]*"hls[234]"\s*:\s*"([^"]+)"[^{}]*\}/);
  if (t)
    try {
      let n = t[0].replace(/(\w+)\s*:/g, '"$1":'), c = JSON.parse(n), a = c.hls4 || c.hls3 || c.hls2;
      if (a)
        return a.startsWith("/") ? o + a : a;
    } catch (n) {
      let c = t[0].match(/"hls[234]"\s*:\s*"([^"]+\.m3u8[^"]*)"/);
      if (c) {
        let a = c[1];
        return a.startsWith("/") ? o + a : a;
      }
    }
  let r = e.match(/["']([^"']{30,}\.m3u8[^"']*)['"]/i);
  if (r) {
    let n = r[1];
    return n.startsWith("/") ? o + n : n;
  }
  return null;
}
var ve = { "hglink.to": "vibuxer.com" };
function W(e) {
  return y(this, null, function* () {
    var o;
    try {
      let t = e;
      for (let [s, u] of Object.entries(ve))
        if (t.includes(s)) {
          t = t.replace(s, u);
          break;
        }
      let r = ((o = t.match(/^(https?:\/\/[^/]+)/)) == null ? void 0 : o[1]) || "https://hlswish.com";
      console.log(`[HLSWish] Resolviendo: ${e}`), t !== e && console.log(`[HLSWish] \u2192 Mapped to: ${t}`);
      let n = yield se.default.get(t, { headers: { "User-Agent": F, Referer: "https://embed69.org/", Origin: "https://embed69.org", Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8", "Accept-Language": "es-MX,es;q=0.9" }, timeout: 15e3, maxRedirects: 5 }), c = typeof n.data == "string" ? n.data : JSON.stringify(n.data), a = c.match(/file\s*:\s*["']([^"']+\.m3u8[^"']*)["']/i);
      if (a) {
        let s = a[1];
        return s.startsWith("/") && (s = r + s), console.log(`[HLSWish] URL encontrada: ${s.substring(0, 80)}...`), { url: s, quality: "1080p", headers: { "User-Agent": F, Referer: r + "/" } };
      }
      let l = c.match(/eval\(function\(p,a,c,k,e,[a-z]\)\{[^}]+\}\s*\('([\s\S]+?)',\s*(\d+),\s*(\d+),\s*'([\s\S]+?)'\.split\('\|'\)/);
      if (l) {
        let s = Se(l[1], parseInt(l[2]), l[4].split("|")), u = we(s, r);
        if (u)
          return console.log(`[HLSWish] URL encontrada: ${u.substring(0, 80)}...`), { url: u, quality: "1080p", headers: { "User-Agent": F, Referer: r + "/" } };
      }
      let i = c.match(/https?:\/\/[^"'\s\\]+\.m3u8[^"'\s\\]*/i);
      return i ? (console.log(`[HLSWish] URL encontrada: ${i[0].substring(0, 80)}...`), { url: i[0], quality: "1080p", headers: { "User-Agent": F, Referer: r + "/" } }) : (console.log("[HLSWish] No se encontr\xF3 URL"), null);
    } catch (t) {
      return console.log(`[HLSWish] Error: ${t.message}`), null;
    }
  });
}
var ae = "439c478a771f35c05022f9feabcca01c", ie = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36", le = "https://embed69.org", xe = 4e3, Le = { "voe.sx": ne, "hglink.to": W, "streamwish.com": W, "streamwish.to": W, "wishembed.online": W, "filelions.com": W, "bysedikamoum.com": _, "filemoon.sx": _, "filemoon.to": _, "moonembed.pro": _ }, ke = { voe: "VOE", streamwish: "StreamWish", filemoon: "Filemoon", vidhide: "VidHide" }, We = ["LAT", "ESP", "SUB"];
function Me(e) {
  try {
    let o = e.split(".");
    if (o.length < 2)
      return null;
    let t = o[1].replace(/-/g, "+").replace(/_/g, "/");
    return t += "=".repeat((4 - t.length % 4) % 4), JSON.parse(atob(t));
  } catch (o) {
    return null;
  }
}
function Oe(e) {
  try {
    let o = e.match(/let\s+dataLink\s*=\s*(\[.+\]);/);
    return o ? JSON.parse(o[1]) : null;
  } catch (o) {
    return null;
  }
}
function Ue(e) {
  if (!e)
    return null;
  for (let [o, t] of Object.entries(Le))
    if (e.includes(o))
      return t;
  return null;
}
function _e(e, o) {
  return y(this, null, function* () {
    let t = o === "movie" ? `https://api.themoviedb.org/3/movie/${e}/external_ids?api_key=${ae}` : `https://api.themoviedb.org/3/tv/${e}/external_ids?api_key=${ae}`, { data: r } = yield P.default.get(t, { timeout: 5e3, headers: { "User-Agent": ie } });
    return r.imdb_id || null;
  });
}
function Ne(e, o, t, r) {
  return o === "movie" ? `${le}/f/${e}` : `${le}/f/${e}/${t}/${r}`;
}
function Te(e, o, t, r) {
  return y(this, null, function* () {
    if (!e || !o)
      return [];
    let n = Date.now();
    console.log(`[Embed69] Buscando: TMDB ${e} (${o})${t ? ` S${t}E${r}` : ""}`);
    try {
      let b2 = function(f) {
        return y(this, null, function* () {
          return (yield Promise.allSettled(f.map(({ url: p, resolver: h, lang: d, servername: $ }) => Promise.race([h(p).then((R) => R ? Y(x({}, R), { lang: d, servername: $ }) : null), new Promise((R, g) => setTimeout(() => g(new Error("timeout")), xe))])))).filter((p) => {
            var h;
            return p.status === "fulfilled" && ((h = p.value) == null ? void 0 : h.url);
          }).map((p) => p.value);
        });
      };
      var b = b2;
      let u = function(f) {
        let A = f.video_language || "LAT", p = [];
        for (let h of f.sortedEmbeds || []) {
          if (h.servername === "download")
            continue;
          let d = Me(h.link);
          if (!d || !d.link)
            continue;
          let $ = Ue(d.link);
          if (!$) {
            console.log(`[Embed69] Sin resolver para ${h.servername}: ${d.link.substring(0, 60)}`);
            continue;
          }
          p.push({ url: d.link, resolver: $, lang: A, servername: h.servername });
        }
        return p;
      }, c = yield _e(e, o);
      if (!c)
        return console.log("[Embed69] No se encontr\xF3 IMDB ID"), [];
      console.log(`[Embed69] IMDB ID: ${c}`);
      let a = Ne(c, o, t, r);
      console.log(`[Embed69] Fetching: ${a}`);
      let { data: l } = yield P.default.get(a, { timeout: 8e3, headers: { "User-Agent": ie, Referer: "https://sololatino.net/", Accept: "text/html,application/xhtml+xml" } }), i = Oe(l);
      if (!i || i.length === 0)
        return console.log("[Embed69] No se encontr\xF3 dataLink en el HTML"), [];
      console.log(`[Embed69] ${i.length} idiomas disponibles: ${i.map((f) => f.video_language).join(", ")}`);
      let s = {};
      for (let f of i)
        s[f.video_language] = f;
      let m = [];
      for (let f of We) {
        let A = s[f];
        if (!A)
          continue;
        let p = u(A);
        if (p.length === 0)
          continue;
        console.log(`[Embed69] Resolviendo ${p.length} embeds (${f})...`);
        let h = yield b2(p);
        if (h.length > 0) {
          for (let { url: d, quality: $, lang: R, servername: g, headers: w } of h) {
            let v = R === "LAT" ? "Latino" : R === "ESP" ? "Espa\xF1ol" : "Subtitulado", N = ke[g] || g;
            m.push({ name: "Embed69", title: `${$ || "1080p"} \xB7 ${v} \xB7 ${N}`, url: d, quality: $ || "1080p", headers: w || {} });
          }
          console.log(`[Embed69] \u2713 Streams encontrados en ${f}, omitiendo idiomas de menor prioridad`);
          break;
        } else
          console.log(`[Embed69] Sin streams en ${f}, intentando siguiente idioma...`);
      }
      let E = ((Date.now() - n) / 1e3).toFixed(2);
      return console.log(`[Embed69] \u2713 ${m.length} streams en ${E}s`), m;
    } catch (c) {
      return console.log(`[Embed69] Error: ${c.message}`), [];
    }
  });
}
