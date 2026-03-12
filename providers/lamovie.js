var he = Object.create;
var O = Object.defineProperty;
var ge = Object.getOwnPropertyDescriptor;
var ye = Object.getOwnPropertyNames, J = Object.getOwnPropertySymbols, ve = Object.getPrototypeOf, Z = Object.prototype.hasOwnProperty, we = Object.prototype.propertyIsEnumerable;
var Y = (e, o, t) => o in e ? O(e, o, { enumerable: true, configurable: true, writable: true, value: t }) : e[o] = t, V = (e, o) => {
  for (var t in o || (o = {}))
    Z.call(o, t) && Y(e, t, o[t]);
  if (J)
    for (var t of J(o))
      we.call(o, t) && Y(e, t, o[t]);
  return e;
};
var Se = (e, o) => {
  for (var t in o)
    O(e, t, { get: o[t], enumerable: true });
}, ee = (e, o, t, r) => {
  if (o && typeof o == "object" || typeof o == "function")
    for (let n of ye(o))
      !Z.call(e, n) && n !== t && O(e, n, { get: () => o[n], enumerable: !(r = ge(o, n)) || r.enumerable });
  return e;
};
var $ = (e, o, t) => (t = e != null ? he(ve(e)) : {}, ee(o || !e || !e.__esModule ? O(t, "default", { value: e, enumerable: true }) : t, e)), $e = (e) => ee(O({}, "__esModule", { value: true }), e);
var h = (e, o, t) => new Promise((r, n) => {
  var a = (c) => {
    try {
      i(t.next(c));
    } catch (f) {
      n(f);
    }
  }, s = (c) => {
    try {
      i(t.throw(c));
    } catch (f) {
      n(f);
    }
  }, i = (c) => c.done ? r(c.value) : Promise.resolve(c.value).then(a, s);
  i((t = t.apply(e, o)).next());
});
var Ie = {};
Se(Ie, { getStreams: () => He });
module.exports = $e(Ie);
var T = $(require("axios"));
var re = $(require("axios"));
var te = $(require("axios"));
var Re = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
function D(e, o) {
  return e >= 3840 || o >= 2160 ? "4K" : e >= 1920 || o >= 1080 ? "1080p" : e >= 1280 || o >= 720 ? "720p" : e >= 854 || o >= 480 ? "480p" : "360p";
}
function A(t) {
  return h(this, arguments, function* (e, o = {}) {
    try {
      let { data: r } = yield te.default.get(e, { timeout: 3e3, headers: V({ "User-Agent": Re }, o), responseType: "text" });
      if (!r.includes("#EXT-X-STREAM-INF")) {
        let i = e.match(/[_-](\d{3,4})p/);
        return i ? `${i[1]}p` : "1080p";
      }
      let n = 0, a = 0, s = r.split(`
`);
      for (let i of s) {
        let c = i.match(/RESOLUTION=(\d+)x(\d+)/);
        if (c) {
          let f = parseInt(c[1]), l = parseInt(c[2]);
          l > a && (a = l, n = f);
        }
      }
      return a > 0 ? D(n, a) : "1080p";
    } catch (r) {
      return "1080p";
    }
  });
}
var oe = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
function ne(e) {
  return h(this, null, function* () {
    try {
      console.log(`[GoodStream] Resolviendo: ${e}`);
      let t = (yield re.default.get(e, { headers: { "User-Agent": oe, Referer: "https://goodstream.one", Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8" }, timeout: 15e3, maxRedirects: 5 })).data.match(/file:\s*"([^"]+)"/);
      if (!t)
        return console.log('[GoodStream] No se encontr\xF3 patr\xF3n file:"..."'), null;
      let r = t[1], n = { Referer: e, Origin: "https://goodstream.one", "User-Agent": oe }, a = yield A(r, n);
      return console.log(`[GoodStream] URL encontrada (${a}): ${r.substring(0, 80)}...`), { url: r, quality: a, headers: n };
    } catch (o) {
      return console.log(`[GoodStream] Error: ${o.message}`), null;
    }
  });
}
var ae = $(require("axios"));
var xe = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
function se(e) {
  try {
    return typeof atob != "undefined" ? atob(e) : Buffer.from(e, "base64").toString("utf8");
  } catch (o) {
    return null;
  }
}
function Ae(e, o) {
  try {
    let r = o.replace(/^\[|\]$/g, "").split("','").map((f) => f.replace(/^'+|'+$/g, "")).map((f) => f.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")), n = "";
    for (let f of e) {
      let l = f.charCodeAt(0);
      l > 64 && l < 91 ? l = (l - 52) % 26 + 65 : l > 96 && l < 123 && (l = (l - 84) % 26 + 97), n += String.fromCharCode(l);
    }
    for (let f of r)
      n = n.replace(new RegExp(f, "g"), "_");
    n = n.split("_").join("");
    let a = se(n);
    if (!a)
      return null;
    let s = "";
    for (let f = 0; f < a.length; f++)
      s += String.fromCharCode((a.charCodeAt(f) - 3 + 256) % 256);
    let i = s.split("").reverse().join(""), c = se(i);
    return c ? JSON.parse(c) : null;
  } catch (t) {
    return console.log("[VOE] voeDecode error:", t.message), null;
  }
}
function H(t) {
  return h(this, arguments, function* (e, o = {}) {
    return ae.default.get(e, { timeout: 15e3, maxRedirects: 5, headers: V({ "User-Agent": xe, Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8" }, o), validateStatus: (r) => r < 500 });
  });
}
function ie(e) {
  return h(this, null, function* () {
    try {
      console.log(`[VOE] Resolviendo: ${e}`);
      let o = yield H(e, { Referer: e }), t = String(o && o.data ? o.data : "");
      if (/permanentToken/i.test(t)) {
        let c = t.match(/window\.location\.href\s*=\s*'([^']+)'/i);
        if (c) {
          console.log(`[VOE] Permanent token redirect -> ${c[1]}`);
          let f = yield H(c[1], { Referer: e });
          f && f.data && (t = String(f.data));
        }
      }
      let r = t.match(/json">\s*\[\s*['"]([^'"]+)['"]\s*\]\s*<\/script>\s*<script[^>]*src=['"]([^'"]+)['"]/i);
      if (r) {
        let c = r[1], f = r[2].startsWith("http") ? r[2] : new URL(r[2], e).href;
        console.log(`[VOE] Found encoded array + loader: ${f}`);
        let l = yield H(f, { Referer: e }), d = l && l.data ? String(l.data) : "", u = d.match(/(\[(?:'[^']{1,10}'[\s,]*){4,12}\])/i) || d.match(/(\[(?:"[^"]{1,10}"[,\s]*){4,12}\])/i);
        if (u) {
          let p = Ae(c, u[1]);
          if (p && (p.source || p.direct_access_url)) {
            let g = p.source || p.direct_access_url, v = yield A(g, { Referer: e });
            return console.log(`[VOE] URL encontrada: ${g.substring(0, 80)}...`), { url: g, quality: v, headers: { Referer: e } };
          }
        }
      }
      let n = /(?:mp4|hls)'\s*:\s*'([^']+)'/gi, a = /(?:mp4|hls)"\s*:\s*"([^"]+)"/gi, s = [], i;
      for (; (i = n.exec(t)) !== null; )
        s.push(i);
      for (; (i = a.exec(t)) !== null; )
        s.push(i);
      for (let c of s) {
        let f = c[1];
        if (!f)
          continue;
        let l = f;
        if (l.startsWith("aHR0"))
          try {
            l = atob(l);
          } catch (d) {
          }
        return console.log(`[VOE] URL encontrada (fallback): ${l.substring(0, 80)}...`), { url: l, quality: yield A(l, { Referer: e }), headers: { Referer: e } };
      }
      return console.log("[VOE] No se encontr\xF3 URL"), null;
    } catch (o) {
      return console.log(`[VOE] Error: ${o.message}`), null;
    }
  });
}
var B = $(require("axios")), E = $(require("crypto-js"));
var I = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
function z(e) {
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
function j(e) {
  let o = [];
  for (let t = 0; t < e.length; t += 4)
    o.push((e[t] || 0) << 24 | (e[t + 1] || 0) << 16 | (e[t + 2] || 0) << 8 | (e[t + 3] || 0));
  return E.default.lib.WordArray.create(o, e.length);
}
function le(e) {
  let o = new Uint8Array(e);
  for (let t = 15; t >= 12 && (o[t]++, o[t] === 0); t--)
    ;
  return o;
}
function Ee(e, o, t) {
  try {
    let r = new Uint8Array(16);
    r.set(o, 0), r[15] = 1;
    let n = le(r), a = j(e), s = new Uint8Array(t.length);
    for (let i = 0; i < t.length; i += 16) {
      let c = Math.min(16, t.length - i), f = j(n), l = E.default.AES.encrypt(f, a, { mode: E.default.mode.ECB, padding: E.default.pad.NoPadding }), d = M(l.ciphertext);
      for (let u = 0; u < c; u++)
        s[i + u] = t[i + u] ^ d[u];
      n = le(n);
    }
    return s;
  } catch (r) {
    return console.log("[Filemoon] AES-GCM error:", r.message), null;
  }
}
function P(e) {
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
      let c = M(z(i.key_parts[0])), f = M(z(i.key_parts[1])), l = new Uint8Array(c.length + f.length);
      l.set(c, 0), l.set(f, c.length);
      let d;
      if (l.length === 32)
        d = l;
      else {
        let y = j(l);
        d = M(E.default.SHA256(y));
      }
      let u = M(z(i.iv)), p = M(z(i.payload));
      if (p.length < 16)
        return null;
      let g = p.slice(0, -16), v = Ee(d, u, g);
      if (!v)
        return null;
      let L = "";
      for (let y = 0; y < v.length; y++)
        L += String.fromCharCode(v[y]);
      let m = (r = (t = JSON.parse(L).sources) == null ? void 0 : t[0]) == null ? void 0 : r.url;
      if (!m)
        return null;
      console.log(`[Filemoon] URL encontrada: ${m.substring(0, 80)}...`);
      let R = m, w = "1080p";
      if (m.includes("master"))
        try {
          let S = (yield B.default.get(m, { timeout: 3e3, headers: { "User-Agent": I, Referer: e }, responseType: "text" })).data.split(`
`), x = 0, F = 0, W = m;
          for (let b = 0; b < S.length; b++) {
            let Q = S[b].trim();
            if (Q.startsWith("#EXT-X-STREAM-INF")) {
              let _ = Q.match(/RESOLUTION=(\d+)x(\d+)/), me = _ ? parseInt(_[1]) : 0, X = _ ? parseInt(_[2]) : 0;
              for (let q = b + 1; q < b + 3 && q < S.length; q++) {
                let U = S[q].trim();
                if (U && !U.startsWith("#") && X > x) {
                  x = X, F = me, W = U.startsWith("http") ? U : new URL(U, m).toString();
                  break;
                }
              }
            }
          }
          x > 0 && (R = W, w = D(F, x), console.log(`[Filemoon] Mejor calidad: ${w}`));
        } catch (y) {
          console.log(`[Filemoon] No se pudo parsear master: ${y.message}`);
        }
      return { url: R, quality: w, headers: { "User-Agent": I, Referer: e, Origin: "https://filemoon.sx" } };
    } catch (n) {
      return console.log(`[Filemoon] Error: ${n.message}`), null;
    }
  });
}
var G = $(require("axios"));
var k = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
function Me(e, o, t) {
  let r = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ", n = (a) => {
    let s = 0;
    for (let i = 0; i < a.length; i++) {
      let c = r.indexOf(a[i]);
      if (c === -1)
        return NaN;
      s = s * o + c;
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
var We = { "hglink.to": "vibuxer.com" };
function N(e) {
  return h(this, null, function* () {
    var o, t, r, n;
    try {
      let a = e;
      for (let [u, p] of Object.entries(We))
        if (a.includes(u)) {
          a = a.replace(u, p);
          break;
        }
      let s = ((o = a.match(/^(https?:\/\/[^/]+)/)) == null ? void 0 : o[1]) || "https://hlswish.com";
      console.log(`[HLSWish] Resolviendo: ${e}`), a !== e && console.log(`[HLSWish] \u2192 Mapped to: ${a}`);
      let i = yield G.default.get(a, { headers: { "User-Agent": k, Referer: "https://embed69.org/", Origin: "https://embed69.org", Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8", "Accept-Language": "es-MX,es;q=0.9" }, timeout: 15e3, maxRedirects: 5 }), c = typeof i.data == "string" ? i.data : JSON.stringify(i.data), f = c.match(/file\s*:\s*["']([^"']+)["']/i);
      if (f) {
        let u = f[1];
        if (u.startsWith("/") && (u = s + u), u.includes("vibuxer.com/stream/")) {
          console.log(`[HLSWish] Siguiendo redirect: ${u.substring(0, 80)}...`);
          try {
            let p = yield G.default.get(u, { headers: { "User-Agent": k, Referer: s + "/" }, timeout: 8e3, maxRedirects: 5, validateStatus: (v) => v < 400 }), g = ((r = (t = p.request) == null ? void 0 : t.res) == null ? void 0 : r.responseUrl) || ((n = p.config) == null ? void 0 : n.url);
            g && g.includes(".m3u8") && (u = g);
          } catch (p) {
          }
        }
        return console.log(`[HLSWish] URL encontrada: ${u.substring(0, 80)}...`), { url: u, quality: "1080p", headers: { "User-Agent": k, Referer: s + "/" } };
      }
      let l = c.match(/eval\(function\(p,a,c,k,e,[a-z]\)\{[^}]+\}\s*\('([\s\S]+?)',\s*(\d+),\s*(\d+),\s*'([\s\S]+?)'\.split\('\|'\)/);
      if (l) {
        let u = Me(l[1], parseInt(l[2]), l[4].split("|")), p = Le(u, s);
        if (p)
          return console.log(`[HLSWish] URL encontrada: ${p.substring(0, 80)}...`), { url: p, quality: "1080p", headers: { "User-Agent": k, Referer: s + "/" } };
      }
      let d = c.match(/https?:\/\/[^"'\s\\]+\.m3u8[^"'\s\\]*/i);
      return d ? (console.log(`[HLSWish] URL encontrada: ${d[0].substring(0, 80)}...`), { url: d[0], quality: "1080p", headers: { "User-Agent": k, Referer: s + "/" } }) : (console.log("[HLSWish] No se encontr\xF3 URL"), null);
    } catch (a) {
      return console.log(`[HLSWish] Error: ${a.message}`), null;
    }
  });
}
var ue = $(require("axios"));
var ce = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
function fe(e) {
  return h(this, null, function* () {
    try {
      console.log(`[Vimeos] Resolviendo: ${e}`);
      let r = (yield ue.default.get(e, { headers: { "User-Agent": ce, Referer: "https://vimeos.net/", Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8" }, timeout: 15e3, maxRedirects: 5 })).data.match(/eval\(function\(p,a,c,k,e,[dr]\)\{[\s\S]+?\}\('([\s\S]+?)',(\d+),(\d+),'([\s\S]+?)'\.split\('\|'\)/);
      if (r) {
        let n = r[1], a = parseInt(r[2]), s = r[4].split("|"), i = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ", c = (d) => {
          let u = 0;
          for (let p = 0; p < d.length; p++)
            u = u * a + i.indexOf(d[p]);
          return u;
        }, l = n.replace(/\b(\w+)\b/g, (d) => {
          let u = c(d);
          return s[u] && s[u] !== "" ? s[u] : d;
        }).match(/["']([^"']+\.m3u8[^"']*)['"]/i);
        if (l) {
          let d = l[1], u = { "User-Agent": ce, Referer: "https://vimeos.net/" }, p = yield A(d, u);
          return console.log(`[Vimeos] URL encontrada: ${d.substring(0, 80)}...`), { url: d, quality: p, headers: u };
        }
      }
      return console.log("[Vimeos] No se encontr\xF3 URL"), null;
    } catch (o) {
      return console.log(`[Vimeos] Error: ${o.message}`), null;
    }
  });
}
var be = "439c478a771f35c05022f9feabcca01c", Ue = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36", C = { "User-Agent": Ue, Accept: "application/json" }, Oe = { "goodstream.one": ne, "hlswish.com": N, "streamwish.com": N, "streamwish.to": N, "strwish.com": N, "voe.sx": ie, "filemoon.sx": P, "filemoon.to": P, "vimeos.net": fe }, ke = [], pe = (e) => e.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim(), de = (e, o) => {
  let t = pe(e).replace(/\s*\(\d{4}\)\s*$/, "").trim(), r = pe(o).replace(/\s*\(\d{4}\)\s*$/, "").trim();
  if (t === r)
    return 1;
  if (t.includes(r) || r.includes(t))
    return 0.8 * (Math.min(t.length, r.length) / Math.max(t.length, r.length));
  let n = new Set(t.split(/\s+/)), a = new Set(r.split(/\s+/));
  return [...n].filter((i) => a.has(i)).length / Math.max(n.size, a.size);
}, Ne = (e) => {
  let o = e.toString().toLowerCase(), t = o.match(/(\d+)/);
  return t ? `${t[1]}p` : o.includes("4k") || o.includes("uhd") ? "2160p" : o.includes("full") || o.includes("fhd") ? "1080p" : o.includes("hd") ? "720p" : "SD";
}, Te = (e) => e.includes("goodstream") ? "GoodStream" : e.includes("hlswish") || e.includes("streamwish") ? "StreamWish" : e.includes("voe.sx") ? "VOE" : e.includes("filemoon") ? "Filemoon" : e.includes("vimeos.net") ? "Vimeos" : "Online", Fe = (e) => {
  try {
    let o = new URL(e).hostname.replace("www.", "");
    if (ke.some((t) => e.includes(t)))
      return null;
    for (let [t, r] of Object.entries(Oe))
      if (e.includes(t))
        return r;
  } catch (o) {
  }
  return null;
};
function _e(e, o) {
  return h(this, null, function* () {
    let t = [{ lang: "es-MX", name: "Latino" }, { lang: "en-US", name: "Ingl\xE9s" }, { lang: "es-ES", name: "Espa\xF1a" }];
    for (let { lang: r, name: n } of t)
      try {
        let a = `https://api.themoviedb.org/3/${o}/${e}?api_key=${be}&language=${r}`, { data: s } = yield T.default.get(a, { timeout: 5e3, headers: C }), i = o === "movie" ? s.title : s.name, c = o === "movie" ? s.original_title : s.original_name;
        if (r === "es-MX" && /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]/.test(i))
          continue;
        return console.log(`[LaMovie] TMDB (${n}): "${i}"${i !== c ? ` | Original: "${c}"` : ""}`), { title: i, originalTitle: c, year: (s.release_date || s.first_air_date || "").substring(0, 4) };
      } catch (a) {
        console.log(`[LaMovie] Error TMDB ${n}: ${a.message}`);
      }
    return null;
  });
}
function qe(e, o) {
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
function Ve(e, o) {
  return h(this, null, function* () {
    var n;
    let r = `https://la.movie/wp-api/v1/search?filter=%7B%7D&postType=any&q=${encodeURIComponent(e.trim())}&postsPerPage=10`;
    try {
      let { data: a } = yield T.default.get(r, { timeout: 8e3, headers: C });
      return (n = a == null ? void 0 : a.data) != null && n.posts ? a.data.posts.filter((s) => o === "movie" ? s.type === "movie" || s.type === "movies" : s.type === "tvshow" || s.type === "tvshows" || s.type === "series") : [];
    } catch (a) {
      return [];
    }
  });
}
function ze(e, o) {
  if (e.length === 0)
    return null;
  if (e.length === 1)
    return e[0];
  let t = e.map((r) => {
    let n = de(r.title || "", o.title) * 2;
    return o.originalTitle && (n += de(r.title || "", o.originalTitle)), o.year && r.year && r.year.toString() === o.year && (n += 0.5), { result: r, score: n };
  });
  return t.sort((r, n) => n.score - r.score), t[0].result;
}
function Ce(e, o, t) {
  return h(this, null, function* () {
    var n;
    let r = `https://la.movie/wp-api/v1/single/episodes/list?_id=${e}&season=${o}&page=1&postsPerPage=50`;
    try {
      let { data: a } = yield T.default.get(r, { timeout: 12e3, headers: C });
      if (!((n = a == null ? void 0 : a.data) != null && n.posts))
        return null;
      let s = a.data.posts.find((i) => i.season_number == o && i.episode_number == t);
      return (s == null ? void 0 : s._id) || null;
    } catch (a) {
      return console.log(`[LaMovie] Error episodios: ${a.message}`), null;
    }
  });
}
function De(e) {
  return h(this, null, function* () {
    try {
      let o = Fe(e.url);
      if (!o)
        return console.log(`[LaMovie] Sin resolver para: ${e.url}`), null;
      let t = yield o(e.url);
      if (!t || !t.url)
        return null;
      let r = Ne(e.quality || "1080p"), n = Te(e.url);
      return { name: "LaMovie", title: `${r} \xB7 ${n}`, url: t.url, quality: r, headers: t.headers || {} };
    } catch (o) {
      return console.log(`[LaMovie] Error procesando embed: ${o.message}`), null;
    }
  });
}
function He(e, o, t, r) {
  return h(this, null, function* () {
    var a;
    if (!e || !o)
      return [];
    let n = Date.now();
    console.log(`[LaMovie] Buscando: TMDB ${e} (${o})${t ? ` S${t}E${r}` : ""}`);
    try {
      let s = yield _e(e, o);
      if (!s)
        return [];
      let i = qe(s, o);
      console.log(`[LaMovie] ${i.length} variantes generadas`);
      let c = i.slice(0, 3).map((m) => h(this, null, function* () {
        let R = yield Ve(m, o);
        return { variant: m, results: R };
      })), f = yield Promise.allSettled(c), l = null;
      for (let m of f)
        if (m.status === "fulfilled" && m.value.results.length > 0) {
          l = m.value;
          break;
        }
      if (!l)
        return console.log("[LaMovie] Sin resultados"), [];
      console.log(`[LaMovie] \u2713 "${l.variant}" (${l.results.length} resultados)`);
      let d = ze(l.results, s);
      if (!d)
        return [];
      let u = d._id;
      if (o === "tv" && t && r) {
        let m = yield Ce(u, t, r);
        if (!m)
          return console.log(`[LaMovie] Episodio S${t}E${r} no encontrado`), [];
        u = m;
      }
      let { data: p } = yield T.default.get(`https://la.movie/wp-api/v1/player?postId=${u}&demo=0`, { timeout: 6e3, headers: C });
      if (!((a = p == null ? void 0 : p.data) != null && a.embeds))
        return console.log("[LaMovie] No hay embeds disponibles"), [];
      let g = 5e3, v = p.data.embeds.map((m) => De(m)), L = yield new Promise((m) => {
        let R = [], w = 0, y = v.length, S = () => m(R.filter(Boolean)), x = setTimeout(S, g);
        v.forEach((F) => {
          F.then((W) => {
            W && R.push(W), w++, w === y && (clearTimeout(x), S());
          }).catch(() => {
            w++, w === y && (clearTimeout(x), S());
          });
        });
      }), K = ((Date.now() - n) / 1e3).toFixed(2);
      return console.log(`[LaMovie] \u2713 ${L.length} streams en ${K}s`), L;
    } catch (s) {
      return console.log(`[LaMovie] Error: ${s.message}`), [];
    }
  });
}
