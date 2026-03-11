var ge = Object.create;
var k = Object.defineProperty;
var ye = Object.getOwnPropertyDescriptor;
var ve = Object.getOwnPropertyNames, Q = Object.getOwnPropertySymbols, we = Object.getPrototypeOf, Y = Object.prototype.hasOwnProperty, Se = Object.prototype.propertyIsEnumerable;
var X = (e, o, t) => o in e ? k(e, o, { enumerable: true, configurable: true, writable: true, value: t }) : e[o] = t, q = (e, o) => {
  for (var t in o || (o = {}))
    Y.call(o, t) && X(e, t, o[t]);
  if (Q)
    for (var t of Q(o))
      Se.call(o, t) && X(e, t, o[t]);
  return e;
};
var Ae = (e, o) => {
  for (var t in o)
    k(e, t, { get: o[t], enumerable: true });
}, Z = (e, o, t, r) => {
  if (o && typeof o == "object" || typeof o == "function")
    for (let n of ve(o))
      !Y.call(e, n) && n !== t && k(e, n, { get: () => o[n], enumerable: !(r = ye(o, n)) || r.enumerable });
  return e;
};
var S = (e, o, t) => (t = e != null ? ge(we(e)) : {}, Z(o || !e || !e.__esModule ? k(t, "default", { value: e, enumerable: true }) : t, e)), xe = (e) => Z(k({}, "__esModule", { value: true }), e);
var h = (e, o, t) => new Promise((r, n) => {
  var a = (u) => {
    try {
      i(t.next(u));
    } catch (c) {
      n(c);
    }
  }, s = (u) => {
    try {
      i(t.throw(u));
    } catch (c) {
      n(c);
    }
  }, i = (u) => u.done ? r(u.value) : Promise.resolve(u.value).then(a, s);
  i((t = t.apply(e, o)).next());
});
var He = {};
Ae(He, { getStreams: () => De });
module.exports = xe(He);
var N = S(require("axios"));
var oe = S(require("axios"));
var ee = S(require("axios"));
var $e = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
function D(e, o) {
  return e >= 3840 || o >= 2160 ? "4K" : e >= 1920 || o >= 1080 ? "1080p" : e >= 1280 || o >= 720 ? "720p" : e >= 854 || o >= 480 ? "480p" : "360p";
}
function R(t) {
  return h(this, arguments, function* (e, o = {}) {
    try {
      let { data: r } = yield ee.default.get(e, { timeout: 3e3, headers: q({ "User-Agent": $e }, o), responseType: "text" });
      if (!r.includes("#EXT-X-STREAM-INF")) {
        let i = e.match(/[_-](\d{3,4})p/);
        return i ? `${i[1]}p` : "1080p";
      }
      let n = 0, a = 0, s = r.split(`
`);
      for (let i of s) {
        let u = i.match(/RESOLUTION=(\d+)x(\d+)/);
        if (u) {
          let c = parseInt(u[1]), l = parseInt(u[2]);
          l > a && (a = l, n = c);
        }
      }
      return a > 0 ? D(n, a) : "1080p";
    } catch (r) {
      return "1080p";
    }
  });
}
var te = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
function re(e) {
  return h(this, null, function* () {
    try {
      console.log(`[GoodStream] Resolviendo: ${e}`);
      let t = (yield oe.default.get(e, { headers: { "User-Agent": te, Referer: "https://goodstream.one", Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8" }, timeout: 15e3, maxRedirects: 5 })).data.match(/file:\s*"([^"]+)"/);
      if (!t)
        return console.log('[GoodStream] No se encontr\xF3 patr\xF3n file:"..."'), null;
      let r = t[1], n = { Referer: e, Origin: "https://goodstream.one", "User-Agent": te }, a = yield R(r, n);
      return console.log(`[GoodStream] URL encontrada (${a}): ${r.substring(0, 80)}...`), { url: r, quality: a, headers: n };
    } catch (o) {
      return console.log(`[GoodStream] Error: ${o.message}`), null;
    }
  });
}
var se = S(require("axios"));
var Re = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
function ne(e) {
  try {
    return typeof atob != "undefined" ? atob(e) : Buffer.from(e, "base64").toString("utf8");
  } catch (o) {
    return null;
  }
}
function Ee(e, o) {
  try {
    let r = o.replace(/^\[|\]$/g, "").split("','").map((c) => c.replace(/^'+|'+$/g, "")).map((c) => c.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")), n = "";
    for (let c of e) {
      let l = c.charCodeAt(0);
      l > 64 && l < 91 ? l = (l - 52) % 26 + 65 : l > 96 && l < 123 && (l = (l - 84) % 26 + 97), n += String.fromCharCode(l);
    }
    for (let c of r)
      n = n.replace(new RegExp(c, "g"), "_");
    n = n.split("_").join("");
    let a = ne(n);
    if (!a)
      return null;
    let s = "";
    for (let c = 0; c < a.length; c++)
      s += String.fromCharCode((a.charCodeAt(c) - 3 + 256) % 256);
    let i = s.split("").reverse().join(""), u = ne(i);
    return u ? JSON.parse(u) : null;
  } catch (t) {
    return console.log("[VOE] voeDecode error:", t.message), null;
  }
}
function H(t) {
  return h(this, arguments, function* (e, o = {}) {
    return se.default.get(e, { timeout: 15e3, maxRedirects: 5, headers: q({ "User-Agent": Re, Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8" }, o), validateStatus: (r) => r < 500 });
  });
}
function ae(e) {
  return h(this, null, function* () {
    try {
      console.log(`[VOE] Resolviendo: ${e}`);
      let o = yield H(e, { Referer: e }), t = String(o && o.data ? o.data : "");
      if (/permanentToken/i.test(t)) {
        let u = t.match(/window\.location\.href\s*=\s*'([^']+)'/i);
        if (u) {
          console.log(`[VOE] Permanent token redirect -> ${u[1]}`);
          let c = yield H(u[1], { Referer: e });
          c && c.data && (t = String(c.data));
        }
      }
      let r = t.match(/json">\s*\[\s*['"]([^'"]+)['"]\s*\]\s*<\/script>\s*<script[^>]*src=['"]([^'"]+)['"]/i);
      if (r) {
        let u = r[1], c = r[2].startsWith("http") ? r[2] : new URL(r[2], e).href;
        console.log(`[VOE] Found encoded array + loader: ${c}`);
        let l = yield H(c, { Referer: e }), p = l && l.data ? String(l.data) : "", f = p.match(/(\[(?:'[^']{1,10}'[\s,]*){4,12}\])/i) || p.match(/(\[(?:"[^"]{1,10}"[,\s]*){4,12}\])/i);
        if (f) {
          let m = Ee(u, f[1]);
          if (m && (m.source || m.direct_access_url)) {
            let A = m.source || m.direct_access_url, y = yield R(A, { Referer: e });
            return console.log(`[VOE] URL encontrada: ${A.substring(0, 80)}...`), { url: A, quality: y, headers: { Referer: e } };
          }
        }
      }
      let n = /(?:mp4|hls)'\s*:\s*'([^']+)'/gi, a = /(?:mp4|hls)"\s*:\s*"([^"]+)"/gi, s = [], i;
      for (; (i = n.exec(t)) !== null; )
        s.push(i);
      for (; (i = a.exec(t)) !== null; )
        s.push(i);
      for (let u of s) {
        let c = u[1];
        if (!c)
          continue;
        let l = c;
        if (l.startsWith("aHR0"))
          try {
            l = atob(l);
          } catch (p) {
          }
        return console.log(`[VOE] URL encontrada (fallback): ${l.substring(0, 80)}...`), { url: l, quality: yield R(l, { Referer: e }), headers: { Referer: e } };
      }
      return console.log("[VOE] No se encontr\xF3 URL"), null;
    } catch (o) {
      return console.log(`[VOE] Error: ${o.message}`), null;
    }
  });
}
var B = S(require("axios")), E = S(require("crypto-js"));
var I = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
function V(e) {
  e = e.replace(/-/g, "+").replace(/_/g, "/");
  let o = (4 - e.length % 4) % 4;
  return E.default.enc.Base64.parse(e + "=".repeat(o));
}
function M(e) {
  let o = e.words, t = e.sigBytes, r = new Uint8Array(t);
  for (let n = 0; n < t; n++)
    r[n] = o[n >>> 2] >>> 24 - n % 4 * 8 & 255;
  return r;
}
function P(e) {
  let o = [];
  for (let t = 0; t < e.length; t += 4)
    o.push((e[t] || 0) << 24 | (e[t + 1] || 0) << 16 | (e[t + 2] || 0) << 8 | (e[t + 3] || 0));
  return E.default.lib.WordArray.create(o, e.length);
}
function ie(e) {
  let o = new Uint8Array(e);
  for (let t = 15; t >= 12 && (o[t]++, o[t] === 0); t--)
    ;
  return o;
}
function Me(e, o, t) {
  try {
    let r = new Uint8Array(16);
    r.set(o, 0), r[15] = 1;
    let n = ie(r), a = P(e), s = new Uint8Array(t.length);
    for (let i = 0; i < t.length; i += 16) {
      let u = Math.min(16, t.length - i), c = P(n), l = E.default.AES.encrypt(c, a, { mode: E.default.mode.ECB, padding: E.default.pad.NoPadding }), p = M(l.ciphertext);
      for (let f = 0; f < u; f++)
        s[i + f] = t[i + f] ^ p[f];
      n = ie(n);
    }
    return s;
  } catch (r) {
    return console.log("[Filemoon] AES-GCM error:", r.message), null;
  }
}
function j(e) {
  return h(this, null, function* () {
    var o, t, r;
    console.log(`[Filemoon] Resolviendo: ${e}`);
    try {
      let n = e.match(/\/(?:e|d)\/([a-z0-9]{12})/i);
      if (!n)
        return null;
      let a = n[1], { data: s } = yield B.default.get(`https://filemooon.link/api/videos/${a}/embed/playback`, { timeout: 7e3, headers: { "User-Agent": I, Referer: e } });
      if (s.error)
        return console.log(`[Filemoon] API error: ${s.error}`), null;
      let i = s.playback;
      if ((i == null ? void 0 : i.algorithm) !== "AES-256-GCM" || ((o = i.key_parts) == null ? void 0 : o.length) !== 2)
        return console.log("[Filemoon] Formato de cifrado no soportado"), null;
      let u = M(V(i.key_parts[0])), c = M(V(i.key_parts[1])), l = new Uint8Array(u.length + c.length);
      l.set(u, 0), l.set(c, u.length);
      let p;
      if (l.length === 32)
        p = l;
      else {
        let g = P(l);
        p = M(E.default.SHA256(g));
      }
      let f = M(V(i.iv)), m = M(V(i.payload));
      if (m.length < 16)
        return null;
      let A = m.slice(0, -16), y = Me(p, f, A);
      if (!y)
        return null;
      let W = "";
      for (let g = 0; g < y.length; g++)
        W += String.fromCharCode(y[g]);
      let d = (r = (t = JSON.parse(W).sources) == null ? void 0 : t[0]) == null ? void 0 : r.url;
      if (!d)
        return null;
      console.log(`[Filemoon] URL encontrada: ${d.substring(0, 80)}...`);
      let x = d, v = "1080p";
      if (d.includes("master"))
        try {
          let w = (yield B.default.get(d, { timeout: 3e3, headers: { "User-Agent": I, Referer: e }, responseType: "text" })).data.split(`
`), $ = 0, O = 0, L = d;
          for (let b = 0; b < w.length; b++) {
            let G = w[b].trim();
            if (G.startsWith("#EXT-X-STREAM-INF")) {
              let F = G.match(/RESOLUTION=(\d+)x(\d+)/), me = F ? parseInt(F[1]) : 0, J = F ? parseInt(F[2]) : 0;
              for (let _ = b + 1; _ < b + 3 && _ < w.length; _++) {
                let U = w[_].trim();
                if (U && !U.startsWith("#") && J > $) {
                  $ = J, O = me, L = U.startsWith("http") ? U : new URL(U, d).toString();
                  break;
                }
              }
            }
          }
          $ > 0 && (x = L, v = D(O, $), console.log(`[Filemoon] Mejor calidad: ${v}`));
        } catch (g) {
          console.log(`[Filemoon] No se pudo parsear master: ${g.message}`);
        }
      return { url: x, quality: v, headers: { "User-Agent": I, Referer: e, Origin: "https://filemoon.sx" } };
    } catch (n) {
      return console.log(`[Filemoon] Error: ${n.message}`), null;
    }
  });
}
var le = S(require("axios"));
var z = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
function We(e, o, t) {
  let r = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ", n = (a) => {
    let s = 0;
    for (let i = 0; i < a.length; i++) {
      let u = r.indexOf(a[i]);
      if (u === -1)
        return NaN;
      s = s * o + u;
    }
    return s;
  };
  return e.replace(/\b([0-9a-zA-Z]+)\b/g, (a) => {
    let s = n(a);
    return isNaN(s) || s >= t.length ? a : t[s] && t[s] !== "" ? t[s] : a;
  });
}
function Le(e, o) {
  let t = e.match(/\{[^{}]*"hls[234]"\s*:\s*"([^"]+)"[^{}]*\}/);
  if (t)
    try {
      let n = t[0].replace(/(\w+)\s*:/g, '"$1":'), a = JSON.parse(n), s = a.hls4 || a.hls3 || a.hls2;
      if (s)
        return s.startsWith("/") ? o + s : s;
    } catch (n) {
      let a = t[0].match(/"hls[234]"\s*:\s*"([^"]+\.m3u8[^"]*)"/);
      if (a) {
        let s = a[1];
        return s.startsWith("/") ? o + s : s;
      }
    }
  let r = e.match(/["']([^"']{30,}\.m3u8[^"']*)['"]/i);
  if (r) {
    let n = r[1];
    return n.startsWith("/") ? o + n : n;
  }
  return null;
}
var be = { "hglink.to": "vibuxer.com" };
function T(e) {
  return h(this, null, function* () {
    var o;
    try {
      let t = e;
      for (let [c, l] of Object.entries(be))
        if (t.includes(c)) {
          t = t.replace(c, l);
          break;
        }
      let r = ((o = t.match(/^(https?:\/\/[^/]+)/)) == null ? void 0 : o[1]) || "https://hlswish.com";
      console.log(`[HLSWish] Resolviendo: ${e}`), t !== e && console.log(`[HLSWish] \u2192 Mapped to: ${t}`);
      let n = yield le.default.get(t, { headers: { "User-Agent": z, Referer: "https://embed69.org/", Origin: "https://embed69.org", Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8", "Accept-Language": "es-MX,es;q=0.9" }, timeout: 15e3, maxRedirects: 5 }), a = typeof n.data == "string" ? n.data : JSON.stringify(n.data), s = a.match(/file\s*:\s*["']([^"']+\.m3u8[^"']*)["']/i);
      if (s) {
        let c = s[1];
        return c.startsWith("/") && (c = r + c), console.log(`[HLSWish] URL encontrada: ${c.substring(0, 80)}...`), { url: c, quality: "1080p", headers: { "User-Agent": z, Referer: r + "/" } };
      }
      let i = a.match(/eval\(function\(p,a,c,k,e,[a-z]\)\{[^}]+\}\s*\('([\s\S]+?)',\s*(\d+),\s*(\d+),\s*'([\s\S]+?)'\.split\('\|'\)/);
      if (i) {
        let c = We(i[1], parseInt(i[2]), i[4].split("|")), l = Le(c, r);
        if (l)
          return console.log(`[HLSWish] URL encontrada: ${l.substring(0, 80)}...`), { url: l, quality: "1080p", headers: { "User-Agent": z, Referer: r + "/" } };
      }
      let u = a.match(/https?:\/\/[^"'\s\\]+\.m3u8[^"'\s\\]*/i);
      return u ? (console.log(`[HLSWish] URL encontrada: ${u[0].substring(0, 80)}...`), { url: u[0], quality: "1080p", headers: { "User-Agent": z, Referer: r + "/" } }) : (console.log("[HLSWish] No se encontr\xF3 URL"), null);
    } catch (t) {
      return console.log(`[HLSWish] Error: ${t.message}`), null;
    }
  });
}
var ue = S(require("axios"));
var ce = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
function fe(e) {
  return h(this, null, function* () {
    try {
      console.log(`[Vimeos] Resolviendo: ${e}`);
      let r = (yield ue.default.get(e, { headers: { "User-Agent": ce, Referer: "https://vimeos.net/", Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8" }, timeout: 15e3, maxRedirects: 5 })).data.match(/eval\(function\(p,a,c,k,e,[dr]\)\{[\s\S]+?\}\('([\s\S]+?)',(\d+),(\d+),'([\s\S]+?)'\.split\('\|'\)/);
      if (r) {
        let n = r[1], a = parseInt(r[2]), s = r[4].split("|"), i = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ", u = (p) => {
          let f = 0;
          for (let m = 0; m < p.length; m++)
            f = f * a + i.indexOf(p[m]);
          return f;
        }, l = n.replace(/\b(\w+)\b/g, (p) => {
          let f = u(p);
          return s[f] && s[f] !== "" ? s[f] : p;
        }).match(/["']([^"']+\.m3u8[^"']*)['"]/i);
        if (l) {
          let p = l[1], f = { "User-Agent": ce, Referer: "https://vimeos.net/" }, m = yield R(p, f);
          return console.log(`[Vimeos] URL encontrada: ${p.substring(0, 80)}...`), { url: p, quality: m, headers: f };
        }
      }
      return console.log("[Vimeos] No se encontr\xF3 URL"), null;
    } catch (o) {
      return console.log(`[Vimeos] Error: ${o.message}`), null;
    }
  });
}
var Ue = "439c478a771f35c05022f9feabcca01c", ke = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36", C = { "User-Agent": ke, Accept: "application/json" }, pe = { "goodstream.one": re, "hlswish.com": T, "streamwish.com": T, "streamwish.to": T, "strwish.com": T, "voe.sx": ae, "filemoon.sx": j, "filemoon.to": j, "vimeos.net": fe }, de = (e) => e.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim(), he = (e, o) => {
  let t = de(e), r = de(o);
  if (t === r)
    return 1;
  if (t.includes(r) || r.includes(t))
    return 0.8;
  let n = new Set(t.split(/\s+/)), a = new Set(r.split(/\s+/));
  return [...n].filter((i) => a.has(i)).length / Math.max(n.size, a.size);
}, Te = (e) => {
  let o = e.toString().toLowerCase(), t = o.match(/(\d+)/);
  return t ? `${t[1]}p` : o.includes("4k") || o.includes("uhd") ? "2160p" : o.includes("full") || o.includes("fhd") ? "1080p" : o.includes("hd") ? "720p" : "SD";
}, Ne = (e) => e.includes("goodstream") ? "GoodStream" : e.includes("hlswish") || e.includes("streamwish") ? "StreamWish" : e.includes("voe.sx") ? "VOE" : e.includes("filemoon") ? "Filemoon" : e.includes("vimeos.net") ? "Vimeos" : "Online", Oe = (e) => {
  if (!e || !e.startsWith("http"))
    return null;
  for (let o in pe)
    if (e.includes(o))
      return pe[o];
  return null;
};
function Fe(e, o) {
  return h(this, null, function* () {
    let t = (i, u) => h(this, null, function* () {
      let c = `https://api.themoviedb.org/3/${o}/${e}?api_key=${Ue}&language=${i}`, { data: l } = yield N.default.get(c, { timeout: 5e3, headers: C }), p = o === "movie" ? l.title : l.name, f = o === "movie" ? l.original_title : l.original_name;
      if (!p)
        throw new Error("No title");
      if (i === "es-MX" && /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]/.test(p))
        throw new Error("Japanese title");
      return { title: p, originalTitle: f, year: (l.release_date || l.first_air_date || "").substring(0, 4) };
    }), [r, n, a] = yield Promise.allSettled([t("es-MX", "Latino"), t("en-US", "Ingl\xE9s"), t("es-ES", "Espa\xF1a")]), s = r.status === "fulfilled" ? r.value : n.status === "fulfilled" ? n.value : a.status === "fulfilled" ? a.value : null;
    return s && console.log(`[LaMovie] TMDB: "${s.title}"${s.title !== s.originalTitle ? ` | Original: "${s.originalTitle}"` : ""}`), s;
  });
}
function _e(e, o) {
  let t = /* @__PURE__ */ new Set(), { title: r, originalTitle: n, year: a } = e;
  if (r) {
    t.add(r.trim());
    let s = r.replace(/[¿¡:;"']/g, "").replace(/\s+/g, " ").trim();
    s !== r && t.add(s);
  }
  return n && n !== r && !/[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]/.test(n) && t.add(n.trim()), o === "movie" && a && [...t].forEach((i) => {
    i.includes(a) || (t.add(`${i} ${a}`), t.add(`${i} (${a})`));
  }), [...t].forEach((s) => {
    let i = s.replace(/^(el|la|los|las|the|a|an)\s+/i, "").trim();
    i.length > 2 && t.add(i);
  }), [...t].slice(0, 8);
}
function qe(e, o) {
  return h(this, null, function* () {
    var n;
    let r = `https://la.movie/wp-api/v1/search?filter=%7B%7D&postType=any&q=${encodeURIComponent(e.trim())}&postsPerPage=10`;
    try {
      let { data: a } = yield N.default.get(r, { timeout: 8e3, headers: C });
      return (n = a == null ? void 0 : a.data) != null && n.posts ? a.data.posts.filter((s) => o === "movie" ? s.type === "movie" || s.type === "movies" : s.type === "tvshow" || s.type === "tvshows" || s.type === "series") : [];
    } catch (a) {
      return [];
    }
  });
}
function Ve(e, o) {
  if (e.length === 0)
    return null;
  if (e.length === 1)
    return e[0];
  let t = e.map((r) => {
    let n = he(r.title || "", o.title) * 2;
    return o.originalTitle && (n += he(r.title || "", o.originalTitle)), o.year && r.year && r.year.toString() === o.year && (n += 0.5), { result: r, score: n };
  });
  return t.sort((r, n) => n.score - r.score), t[0].result;
}
function ze(e, o, t) {
  return h(this, null, function* () {
    var n;
    let r = `https://la.movie/wp-api/v1/single/episodes/list?_id=${e}&season=${o}&page=1&postsPerPage=50`;
    try {
      let { data: a } = yield N.default.get(r, { timeout: 12e3, headers: C });
      if (!((n = a == null ? void 0 : a.data) != null && n.posts))
        return null;
      let s = a.data.posts.find((i) => i.season_number == o && i.episode_number == t);
      return (s == null ? void 0 : s._id) || null;
    } catch (a) {
      return console.log(`[LaMovie] Error episodios: ${a.message}`), null;
    }
  });
}
function Ce(e) {
  return h(this, null, function* () {
    try {
      let o = Oe(e.url);
      if (!o)
        return console.log(`[LaMovie] Sin resolver para: ${e.url}`), null;
      let t = yield o(e.url);
      if (!t || !t.url)
        return null;
      let r = Te(e.quality || "1080p"), n = Ne(e.url);
      return { name: "LaMovie", title: `${t.quality || "1080p"} \xB7 ${n}`, url: t.url, quality: t.quality || "1080p", headers: t.headers || {} };
    } catch (o) {
      return console.log(`[LaMovie] Error procesando embed: ${o.message}`), null;
    }
  });
}
function De(e, o, t, r) {
  return h(this, null, function* () {
    var a;
    if (!e || !o)
      return [];
    let n = Date.now();
    console.log(`[LaMovie] Buscando: TMDB ${e} (${o})${t ? ` S${t}E${r}` : ""}`);
    try {
      let s = yield Fe(e, o);
      if (!s)
        return [];
      let i = _e(s, o);
      console.log(`[LaMovie] ${i.length} variantes generadas`);
      let u = i.slice(0, 3).map((d) => h(this, null, function* () {
        let x = yield qe(d, o);
        return { variant: d, results: x };
      })), c = yield Promise.allSettled(u), l = null;
      for (let d of c)
        if (d.status === "fulfilled" && d.value.results.length > 0) {
          l = d.value;
          break;
        }
      if (!l)
        return console.log("[LaMovie] Sin resultados"), [];
      console.log(`[LaMovie] \u2713 "${l.variant}" (${l.results.length} resultados)`);
      let p = Ve(l.results, s);
      if (!p)
        return [];
      let f = p._id;
      if (o === "tv" && t && r) {
        let d = yield ze(f, t, r);
        if (!d)
          return console.log(`[LaMovie] Episodio S${t}E${r} no encontrado`), [];
        f = d;
      }
      let { data: m } = yield N.default.get(`https://la.movie/wp-api/v1/player?postId=${f}&demo=0`, { timeout: 6e3, headers: C });
      if (!((a = m == null ? void 0 : m.data) != null && a.embeds))
        return console.log("[LaMovie] No hay embeds disponibles"), [];
      let A = 5e3, y = m.data.embeds.map((d) => Ce(d)), W = yield new Promise((d) => {
        let x = [], v = 0, g = y.length, w = () => d(x.filter(Boolean)), $ = setTimeout(w, A);
        y.forEach((O) => {
          O.then((L) => {
            L && x.push(L), v++, v === g && (clearTimeout($), w());
          }).catch(() => {
            v++, v === g && (clearTimeout($), w());
          });
        });
      }), K = ((Date.now() - n) / 1e3).toFixed(2);
      return console.log(`[LaMovie] \u2713 ${W.length} streams en ${K}s`), W;
    } catch (s) {
      return console.log(`[LaMovie] Error: ${s.message}`), [];
    }
  });
}
