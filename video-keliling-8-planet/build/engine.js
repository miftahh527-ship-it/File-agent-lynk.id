// Mesin animasi "Keliling 8 Planet" — semua digambar prosedural di canvas, deterministik terhadap waktu t.
const C = document.getElementById('c'), X = C.getContext('2d');
const W = 1920, H = 1080, TAU = Math.PI * 2;
const FONT = (s, w = 700) => `${w} ${s}px F, "Noto Color Emoji", sans-serif`;
const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * t;
const eo = t => 1 - Math.pow(1 - clamp(t), 3);
const eio = t => { t = clamp(t); return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
const eob = t => { t = clamp(t); const c1 = 1.9, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); };
function rng(seed) { let s = (Math.abs(seed * 2654435761) % 2147483646) + 1; const f = () => (s = s * 16807 % 2147483647, (s - 1) / 2147483646); f(); f(); f(); return f; }
const mix = (c1, c2, k) => { const a = hex(c1), b = hex(c2); return `rgb(${a.map((v, i) => Math.round(lerp(v, b[i], k))).join(',')})`; };
function hex(h) { h = h.replace('#', ''); return [0, 2, 4].map(i => parseInt(h.substr(i, 2), 16)); }

let TL = null;
var PORTRAIT = false;
// ---------------------------------------------------------------- teks & UI
function txt(s, x, y, size, o = {}) {
  const { color = '#fff', w = 700, align = 'center', stroke = '#1d1147', sw = size * 0.14, alpha = 1, scale = 1, rot = 0, base = 'middle', shadow = true } = o;
  if (alpha <= 0.001 || scale <= 0.001) return;
  X.save(); X.globalAlpha *= alpha; X.translate(x, y); X.rotate(rot); X.scale(scale, scale);
  X.font = FONT(size, w); X.textAlign = align; X.textBaseline = base; X.lineJoin = 'round';
  if (shadow) { X.shadowColor = 'rgba(0,0,0,0.45)'; X.shadowBlur = size * 0.12; X.shadowOffsetY = size * 0.06; }
  if (sw > 0) { X.strokeStyle = stroke; X.lineWidth = sw; X.strokeText(s, 0, 0); }
  X.shadowColor = 'transparent';
  X.fillStyle = color; X.fillText(s, 0, 0);
  X.restore();
}
function emo(ch, x, y, size, o = {}) {
  const { alpha = 1, scale = 1, rot = 0 } = o;
  if (alpha <= 0.001 || scale <= 0.001) return;
  X.save(); X.globalAlpha *= alpha; X.translate(x, y); X.rotate(rot); X.scale(scale, scale);
  X.font = `${size}px "Noto Color Emoji"`; X.textAlign = 'center'; X.textBaseline = 'middle';
  X.fillText(ch, 0, size * 0.04); X.restore();
}
function rrect(x, y, w, h, r) { X.beginPath(); X.moveTo(x + r, y); X.arcTo(x + w, y, x + w, y + h, r); X.arcTo(x + w, y + h, x, y + h, r); X.arcTo(x, y + h, x, y, r); X.arcTo(x, y, x + w, y, r); X.closePath(); }
function pill(s, x, y, size, o = {}) {
  const { bg = '#ffd23f', fg = '#1d1147', alpha = 1, scale = 1, w = 700, border = null } = o;
  if (alpha <= 0.001) return;
  X.save(); X.globalAlpha *= alpha; X.translate(x, y); X.scale(scale, scale);
  X.font = FONT(size, w); const tw = X.measureText(s).width, ph = size * 1.5, pw = tw + size * 1.3;
  X.shadowColor = 'rgba(0,0,0,0.35)'; X.shadowBlur = 18; X.shadowOffsetY = 6;
  X.fillStyle = bg; rrect(-pw / 2, -ph / 2, pw, ph, ph / 2); X.fill(); X.shadowColor = 'transparent';
  if (border) { X.lineWidth = 5; X.strokeStyle = border; X.stroke(); }
  X.fillStyle = fg; X.textAlign = 'center'; X.textBaseline = 'middle'; X.fillText(s, 0, size * 0.05);
  X.restore();
  return pw;
}
function card(x, y, w, h, o = {}) {
  const { bg = 'rgba(255,255,255,0.95)', alpha = 1, r = 36, border = null, scale = 1 } = o;
  X.save(); X.globalAlpha *= alpha; X.translate(x, y); X.scale(scale, scale);
  X.shadowColor = 'rgba(0,0,0,0.4)'; X.shadowBlur = 30; X.shadowOffsetY = 10;
  X.fillStyle = bg; rrect(-w / 2, -h / 2, w, h, r); X.fill(); X.shadowColor = 'transparent';
  if (border) { X.lineWidth = 8; X.strokeStyle = border; X.stroke(); }
  X.restore();
}
function wrap(s, size, maxW, w = 600) {
  X.font = FONT(size, w); const words = s.split(' '); const lines = []; let cur = '';
  for (const wd of words) { const tst = cur ? cur + ' ' + wd : wd; if (X.measureText(tst).width > maxW && cur) { lines.push(cur); cur = wd; } else cur = tst; }
  if (cur) lines.push(cur); return lines;
}
function arrow(x1, y1, x2, y2, color = '#fff', lw = 8, alpha = 1) {
  X.save(); X.globalAlpha *= alpha; X.strokeStyle = color; X.fillStyle = color; X.lineWidth = lw; X.lineCap = 'round';
  X.beginPath(); X.moveTo(x1, y1); X.lineTo(x2, y2); X.stroke();
  const a = Math.atan2(y2 - y1, x2 - x1), s = lw * 3;
  X.beginPath(); X.moveTo(x2 + Math.cos(a) * s * .6, y2 + Math.sin(a) * s * .6); X.lineTo(x2 + Math.cos(a + 2.5) * s, y2 + Math.sin(a + 2.5) * s); X.lineTo(x2 + Math.cos(a - 2.5) * s, y2 + Math.sin(a - 2.5) * s); X.fill();
  X.restore();
}
// angka besar dengan efek pop
function bigNum(s, x, y, size, lt, o = {}) {
  const { color = '#ffd23f', delay = 0, alpha = 1 } = o;
  const k = lt - delay; if (k < 0) return;
  const sc = eob(k / 0.55);
  txt(s, x, y, size, { color, scale: sc, alpha: alpha * clamp(k / 0.15), ...o });
}

// ---------------------------------------------------------------- latar luar angkasa
const STARS = (() => { const r = rng(7); return Array.from({ length: 520 }, () => ({ x: r() * W, y: r() * H, r: r() * 1.8 + 0.4, ph: r() * TAU, sp: 0.5 + r() * 2, l: 0.2 + r() * 1 })); })();
const PAL = {
  intro: ['#120a35', '#3b1c7a', '#0d4b8c'], matahari: ['#1a0b2b', '#7a2d12', '#5a1a5e'], merkurius: ['#0f0f24', '#4a4560', '#2b2f5a'],
  venus: ['#1d0f1f', '#7a4f12', '#5a2a4e'], bumi: ['#06102e', '#0e4d8a', '#145a3c'], mars: ['#1a0a12', '#7a2410', '#3a1240'],
  jupiter: ['#140c1c', '#6a3e1c', '#3e2a5e'], saturnus: ['#14101e', '#6e5a2a', '#2e3a6e'], uranus: ['#061a24', '#0e6a7a', '#28407a'],
  neptunus: ['#050a2a', '#1430a0', '#3a1a7a'], transition: ['#0a0628', '#3a1a8a', '#0a5a9a'], end: ['#120a35', '#3b1c7a', '#0d4b8c'],
};
function space(t, key, drift = 1) {
  const p = PAL[key] || PAL.intro;
  X.fillStyle = p[0]; X.fillRect(0, 0, W, H);
  const blobs = [[0.25, 0.3, 0.55, p[1]], [0.8, 0.75, 0.6, p[2]], [0.65, 0.15, 0.35, p[1]]];
  for (const [bx, by, br, col] of blobs) {
    const x = bx * W + Math.sin(t * 0.07 + bx * 9) * 60, y = by * H + Math.cos(t * 0.05 + by * 7) * 40;
    const g = X.createRadialGradient(x, y, 0, x, y, br * W);
    g.addColorStop(0, col + 'aa'); g.addColorStop(1, col + '00'); X.fillStyle = g; X.fillRect(0, 0, W, H);
  }
  for (const s of STARS) {
    const x = ((s.x - t * 12 * s.l * drift) % W + W) % W;
    const tw = 0.55 + 0.45 * Math.sin(t * s.sp + s.ph);
    X.globalAlpha = tw * 0.9; X.fillStyle = '#fff'; X.beginPath(); X.arc(x, s.y, s.r, 0, TAU); X.fill();
  }
  X.globalAlpha = 1;
}
function warp(t, k) {
  X.fillStyle = '#080420'; X.fillRect(0, 0, W, H);
  const g = X.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, 900); g.addColorStop(0, '#5b2bd6aa'); g.addColorStop(1, '#08042000'); X.fillStyle = g; X.fillRect(0, 0, W, H);
  X.lineCap = 'round';
  for (const s of STARS) {
    const ang = Math.atan2(s.y - H / 2, s.x - W / 2), d0 = ((Math.hypot(s.x - W / 2, s.y - H / 2) + t * 900 * s.l) % 1100);
    const len = 20 + 140 * k * s.l;
    X.strokeStyle = `rgba(255,255,255,${0.3 + 0.6 * s.l / 1.2})`; X.lineWidth = s.r * 1.6;
    X.beginPath(); X.moveTo(W / 2 + Math.cos(ang) * d0, H / 2 + Math.sin(ang) * d0); X.lineTo(W / 2 + Math.cos(ang) * (d0 + len), H / 2 + Math.sin(ang) * (d0 + len)); X.stroke();
  }
}

// ---------------------------------------------------------------- planet prosedural
const FEAT = {};
function features(kind) {
  if (FEAT[kind]) return FEAT[kind];
  const r = rng(kind.length * 977 + kind.charCodeAt(0) * 31); const f = [];
  const add = (n, o) => { for (let i = 0; i < n; i++) f.push({ u: r(), v: (r() * 2 - 1) * (o.vmax || 0.85), s: o.s0 + r() * o.s1, c: o.c[Math.floor(r() * o.c.length)], a: o.a || 1, el: o.el || 1, layer: o.layer || 0 }); };
  if (kind === 'mercury' || kind === 'moon') add(40, { s0: 0.04, s1: 0.13, c: ['crater'] });
  if (kind === 'earth') {
    const conts = [[0.1, 0.35], [0.18, -0.1], [0.42, 0.4], [0.5, -0.3], [0.7, 0.15], [0.85, -0.45]];
    for (const [u, v] of conts) for (let i = 0; i < 9; i++) f.push({ u: u + (r() - .5) * 0.12, v: v + (r() - .5) * 0.35, s: 0.1 + r() * 0.12, c: r() < .75 ? '#3fae4f' : '#c9a35a', a: 1, el: 1, layer: 0 });
    add(26, { s0: 0.06, s1: 0.1, c: ['#ffffff'], a: 0.75, el: 2.2, layer: 1 });
  }
  if (kind === 'mars') { add(22, { s0: 0.08, s1: 0.16, c: ['#8f3519', '#a8441f', '#6e2a17'], a: 0.6 }); }
  if (kind === 'venus') add(30, { s0: 0.1, s1: 0.2, c: ['#fff3d6', '#c98a3c'], a: 0.35, el: 3 });
  if (kind === 'neptune') { f.push({ u: 0.3, v: -0.25, s: 0.16, c: '#14287a', a: 0.9, el: 1.6, layer: 0 }); add(10, { s0: 0.04, s1: 0.06, c: ['#ffffff'], a: 0.85, el: 5, layer: 1, vmax: 0.6 }); }
  if (kind === 'jupiter') f.push({ u: 0.35, v: 0.32, s: 0.17, c: '#c1440e', a: 1, el: 1.6, layer: 0, grs: 1 });
  return FEAT[kind] = f;
}
function drawFeatures(kind, x, y, r, rot, layerFilter, extraRot = 0) {
  for (const f of features(kind)) {
    if (layerFilter !== undefined && f.layer !== layerFilter) continue;
    const lon = (f.u + rot * (f.layer ? 1.3 : 1) + extraRot) * TAU;
    const cz = Math.cos(lon); if (cz < -0.05) continue;
    const lat = Math.asin(clamp(f.v, -0.99, 0.99));
    const px = x + r * Math.sin(lon) * Math.cos(lat), py = y + r * Math.sin(lat);
    const rr = f.s * r, sx = rr * f.el * Math.max(0.05, cz), sy = rr * Math.cos(lat) * 0.95;
    X.globalAlpha = f.a * clamp(cz * 3 + 0.15);
    if (f.c === 'crater') {
      X.fillStyle = 'rgba(70,64,60,0.55)'; X.beginPath(); X.ellipse(px, py, sx, sy, 0, 0, TAU); X.fill();
      X.strokeStyle = 'rgba(230,225,215,0.45)'; X.lineWidth = Math.max(1, rr * 0.18); X.beginPath(); X.ellipse(px + sx * 0.1, py + sy * 0.1, sx * 0.9, sy * 0.9, 0, Math.PI * 0.1, Math.PI * 1.1); X.stroke();
    } else {
      X.fillStyle = f.c; X.beginPath(); X.ellipse(px, py, sx, sy, 0, 0, TAU); X.fill();
      if (f.grs) { X.strokeStyle = '#ffb38a'; X.lineWidth = rr * 0.12; X.beginPath(); X.ellipse(px, py, sx * 0.7, sy * 0.6, 0, 0, TAU); X.stroke(); }
    }
  }
  X.globalAlpha = 1;
}
function glow(x, y, r, col, size = 1.4, a = 0.6) {
  const g = X.createRadialGradient(x, y, r * 0.8, x, y, r * size);
  g.addColorStop(0, col.replace(')', `,${a})`).replace('rgb', 'rgba')); g.addColorStop(1, col.replace(')', ',0)').replace('rgb', 'rgba'));
  X.fillStyle = g; X.beginPath(); X.arc(x, y, r * size, 0, TAU); X.fill();
}
function shade(x, y, r, dir = -0.4) {
  const g = X.createRadialGradient(x + r * dir, y + r * dir, r * 0.05, x, y, r * 1.02);
  g.addColorStop(0, 'rgba(255,255,255,0.28)'); g.addColorStop(0.45, 'rgba(255,255,255,0)'); g.addColorStop(0.8, 'rgba(0,0,30,0.35)'); g.addColorStop(1, 'rgba(0,0,30,0.7)');
  X.fillStyle = g; X.beginPath(); X.arc(x, y, r, 0, TAU); X.fill();
}
function body(x, y, r, c1, c2) {
  const g = X.createLinearGradient(x - r, y - r, x + r, y + r); g.addColorStop(0, c1); g.addColorStop(1, c2);
  X.fillStyle = g; X.beginPath(); X.arc(x, y, r, 0, TAU); X.fill();
}
function bands(x, y, r, cols, t, amp = 0.015, vertical = false) {
  X.save(); X.beginPath(); X.arc(x, y, r, 0, TAU); X.clip();
  if (vertical) { X.translate(x, y); X.rotate(Math.PI / 2); X.translate(-x, -y); }
  const n = cols.length;
  for (let i = 0; i < n; i++) {
    const y0 = y - r + (2 * r * i) / n, h = (2 * r) / n + 2;
    X.fillStyle = cols[i]; X.beginPath(); X.moveTo(x - r, y0);
    for (let k = 0; k <= 24; k++) { const xx = x - r + (2 * r * k) / 24; X.lineTo(xx, y0 + Math.sin(k * 0.9 + i * 1.7 + t * 0.8) * r * amp); }
    X.lineTo(x + r, y0 + h + r * 0.03); X.lineTo(x - r, y0 + h + r * 0.03); X.closePath(); X.fill();
  }
  X.restore();
}
function rings(x, y, r, tilt, front, t, tiltRot = 0, alpha = 1) {
  X.save(); X.translate(x, y); X.rotate(tiltRot); X.globalAlpha = alpha;
  const specs = [[1.25, 1.38, 'rgba(201,178,124,0.55)'], [1.4, 1.75, 'rgba(232,214,168,0.85)'], [1.8, 1.86, 'rgba(0,0,0,0)'], [1.88, 2.2, 'rgba(214,193,140,0.75)'], [2.24, 2.32, 'rgba(190,170,120,0.45)']];
  for (const [a, b, col] of specs) {
    X.strokeStyle = col; X.lineWidth = (b - a) * r;
    const rr = (a + b) / 2 * r; X.beginPath();
    if (front) X.ellipse(0, 0, rr, rr * tilt, 0, 0, Math.PI); else X.ellipse(0, 0, rr, rr * tilt, 0, Math.PI, TAU);
    X.stroke();
  }
  X.restore();
}
function planet(kind, x, y, r, t, o = {}) {
  const { lit = 1, rot = t * 0.03, tiltRot = 0, ringA = 1 } = o;
  if (r <= 0.5) return;
  X.save();
  switch (kind) {
    case 'sun': {
      glow(x, y, r, 'rgb(255,170,40)', 1.9, 0.55);
      X.save(); X.translate(x, y); X.rotate(t * 0.08);
      for (let i = 0; i < 24; i++) { const a = i * TAU / 24, l = r * (1.25 + 0.12 * Math.sin(t * 2 + i)); X.fillStyle = 'rgba(255,210,63,0.28)'; X.beginPath(); X.moveTo(Math.cos(a - 0.08) * r, Math.sin(a - 0.08) * r); X.lineTo(Math.cos(a) * l, Math.sin(a) * l); X.lineTo(Math.cos(a + 0.08) * r, Math.sin(a + 0.08) * r); X.fill(); }
      X.restore();
      const g = X.createRadialGradient(x - r * .2, y - r * .2, r * .1, x, y, r); g.addColorStop(0, '#fffbd0'); g.addColorStop(0.45, '#ffd23f'); g.addColorStop(0.85, '#ff9f1c'); g.addColorStop(1, '#f3722c');
      X.fillStyle = g; X.beginPath(); X.arc(x, y, r, 0, TAU); X.fill();
      X.save(); X.beginPath(); X.arc(x, y, r, 0, TAU); X.clip(); const rr = rng(3);
      for (let i = 0; i < 40; i++) { const a = rr() * TAU, d = rr() * r, s = r * (0.05 + rr() * 0.08); X.fillStyle = `rgba(255,${120 + rr() * 80 | 0},20,${0.18 + 0.12 * Math.sin(t * 1.5 + i)})`; X.beginPath(); X.arc(x + Math.cos(a + t * 0.02) * d, y + Math.sin(a + t * 0.02) * d, s, 0, TAU); X.fill(); }
      X.restore();
      break;
    }
    case 'mercury': glow(x, y, r, 'rgb(200,200,220)', 1.15, 0.25); body(x, y, r, '#c9c4bc', '#6f6a66'); X.save(); X.beginPath(); X.arc(x, y, r, 0, TAU); X.clip(); drawFeatures('mercury', x, y, r, rot); X.restore(); shade(x, y, r); break;
    case 'moon': body(x, y, r, '#e4e1dc', '#8d8a86'); X.save(); X.beginPath(); X.arc(x, y, r, 0, TAU); X.clip(); drawFeatures('moon', x, y, r, rot); X.restore(); shade(x, y, r); break;
    case 'venus': glow(x, y, r, 'rgb(255,214,140)', 1.25, 0.45); body(x, y, r, '#f8e2b0', '#d08f45'); bands(x, y, r, ['rgba(255,240,210,0.0)', 'rgba(220,160,90,0.25)', 'rgba(255,240,210,0.3)', 'rgba(210,150,80,0.25)', 'rgba(255,240,210,0.2)', 'rgba(200,140,70,0.3)'], t, 0.04);
      X.save(); X.beginPath(); X.arc(x, y, r, 0, TAU); X.clip(); drawFeatures('venus', x, y, r, rot * 0.5); X.restore(); shade(x, y, r); break;
    case 'earth': glow(x, y, r, 'rgb(90,180,255)', 1.22, 0.55); body(x, y, r, '#3b9cff', '#1a4fa0');
      X.save(); X.beginPath(); X.arc(x, y, r, 0, TAU); X.clip(); drawFeatures('earth', x, y, r, rot, 0);
      X.fillStyle = 'rgba(255,255,255,0.92)'; X.beginPath(); X.ellipse(x, y - r * 0.97, r * 0.55, r * 0.14, 0, 0, TAU); X.fill(); X.beginPath(); X.ellipse(x, y + r * 0.98, r * 0.6, r * 0.13, 0, 0, TAU); X.fill();
      drawFeatures('earth', x, y, r, rot, 1); X.restore(); shade(x, y, r); break;
    case 'mars': glow(x, y, r, 'rgb(255,120,70)', 1.15, 0.35); body(x, y, r, '#f08050', '#a63d1e');
      X.save(); X.beginPath(); X.arc(x, y, r, 0, TAU); X.clip(); drawFeatures('mars', x, y, r, rot); X.fillStyle = 'rgba(255,250,245,0.9)'; X.beginPath(); X.ellipse(x, y - r * 0.95, r * 0.35, r * 0.12, 0, 0, TAU); X.fill(); X.restore(); shade(x, y, r); break;
    case 'jupiter': glow(x, y, r, 'rgb(240,200,150)', 1.12, 0.3); body(x, y, r, '#e9d2ad', '#b0805a');
      bands(x, y, r, ['#d9b48a', '#f2e2c4', '#c48a5c', '#f5e6cc', '#b9764a', '#ead3ae', '#d6a77a', '#f3e3c6', '#c08452', '#e4c9a2', '#cf9a6c', '#efdcbc'], t, 0.02);
      X.save(); X.beginPath(); X.arc(x, y, r, 0, TAU); X.clip(); drawFeatures('jupiter', x, y, r, rot); X.restore(); shade(x, y, r); break;
    case 'saturn': rings(x, y, r, o.tilt || 0.3, false, t, tiltRot, ringA); glow(x, y, r, 'rgb(240,220,160)', 1.12, 0.3); body(x, y, r, '#f3e0b0', '#c49a5a');
      bands(x, y, r, ['#ecd49e', '#f6e7c3', '#dcbc80', '#f2e0b4', '#d4b070', '#efdcae', '#e2c48c', '#f5e6c0'], t, 0.01); shade(x, y, r); rings(x, y, r, o.tilt || 0.3, true, t, tiltRot, ringA); break;
    case 'uranus': X.save(); X.translate(x, y); X.rotate(tiltRot); X.translate(-x, -y);
      X.strokeStyle = 'rgba(200,250,255,0.35)'; X.lineWidth = r * 0.04; X.beginPath(); X.ellipse(x, y, r * 0.35, r * 1.8, 0, Math.PI / 2, Math.PI * 1.5); X.stroke();
      glow(x, y, r, 'rgb(150,240,245)', 1.2, 0.4); body(x, y, r, '#c6f5f6', '#4fb8c9'); bands(x, y, r, ['rgba(255,255,255,0.08)', 'rgba(80,180,200,0.12)', 'rgba(255,255,255,0.1)', 'rgba(80,180,200,0.1)', 'rgba(255,255,255,0.06)'], t, 0.01, true);
      X.restore(); shade(x, y, r);
      X.save(); X.translate(x, y); X.rotate(tiltRot); X.translate(-x, -y); X.strokeStyle = 'rgba(200,250,255,0.5)'; X.lineWidth = r * 0.04; X.beginPath(); X.ellipse(x, y, r * 0.35, r * 1.8, 0, -Math.PI / 2, Math.PI / 2); X.stroke(); X.restore();
      break;
    case 'neptune': glow(x, y, r, 'rgb(90,130,255)', 1.2, 0.5); body(x, y, r, '#5b8cff', '#1b3fa8'); bands(x, y, r, ['rgba(255,255,255,0.0)', 'rgba(30,60,160,0.2)', 'rgba(255,255,255,0.06)', 'rgba(30,60,160,0.2)', 'rgba(255,255,255,0.0)'], t, 0.01);
      X.save(); X.beginPath(); X.arc(x, y, r, 0, TAU); X.clip(); drawFeatures('neptune', x, y, r, rot); X.restore(); shade(x, y, r); break;
  }
  if (lit < 1) {
    X.globalAlpha = (1 - lit) * 0.93; X.fillStyle = '#0b0820'; X.beginPath(); X.arc(x, y, r * 1.01, 0, TAU); X.fill();
    if (kind === 'saturn') { rings(x, y, r, o.tilt || 0.3, true, t, tiltRot, 1); }
    X.globalAlpha = 1;
    txt('?', x, y + r * 0.04, r * 0.9, { color: '#ffd23f', alpha: clamp((0.6 - lit) / 0.6), scale: 1 + 0.06 * Math.sin(t * 6) });
  }
  X.restore();
}
const KIND = { merkurius: 'mercury', venus: 'venus', bumi: 'earth', mars: 'mars', jupiter: 'jupiter', saturnus: 'saturn', uranus: 'uranus', neptunus: 'neptune', matahari: 'sun' };
const NAMES = { merkurius: 'MERKURIUS', venus: 'VENUS', bumi: 'BUMI', mars: 'MARS', jupiter: 'JUPITER', saturnus: 'SATURNUS', uranus: 'URANUS', neptunus: 'NEPTUNUS', matahari: 'MATAHARI' };
const ORDER = ['merkurius', 'venus', 'bumi', 'mars', 'jupiter', 'saturnus', 'uranus', 'neptunus'];

// ---------------------------------------------------------------- helper waktu beat/kalimat
function beatInfo(sc, st) {
  const bs = sc.beats; let i = 0; for (let k = 0; k < bs.length; k++) if (st >= bs[k].start) i = k;
  const start = bs[i].start, end = i + 1 < bs.length ? bs[i + 1].start : sc.end - sc.start;
  const lt = st - start, d = end - start;
  return { i, lt, d, a: clamp(lt / 0.35) * clamp((d - lt) / 0.3), p: clamp(lt / d) };
}
function sentT(sc, para, idx) { const ss = sc.sentences.filter(s => s.para === para); const s = ss[Math.max(0, Math.min(ss.length - 1, idx < 0 ? ss.length + idx : idx))]; return s.start; }
function sentInBeat(sc, B, idx) { return sentT(sc, B.i, idx) - sc.beats[B.i].start; } // waktu relatif awal beat
function lay(L, B, dur = 0.9) { const cur = L[B.i], prev = L[Math.max(0, B.i - 1)]; const k = eio(B.lt / dur); return cur.map((v, j) => lerp(prev[j], v, k)); }
function revealT(sc) { return sentT(sc, 0, -1); }

// ---------------------------------------------------------------- dekorasi kecil
function thermo(x, y, h, level, col, label, alpha = 1) {
  X.save(); X.globalAlpha *= alpha;
  X.fillStyle = '#fff'; rrect(x - 34, y - h, 68, h, 34); X.fill(); X.beginPath(); X.arc(x, y + 20, 56, 0, TAU); X.fill();
  X.fillStyle = col; X.beginPath(); X.arc(x, y + 20, 42, 0, TAU); X.fill();
  const lh = (h - 40) * clamp(level); rrect(x - 18, y - lh, 36, lh + 30, 18); X.fill();
  X.strokeStyle = '#1d1147'; X.lineWidth = 6; rrect(x - 34, y - h, 68, h, 34); X.stroke();
  for (let i = 1; i < 6; i++) { X.beginPath(); X.moveTo(x + 34, y - h * i / 6); X.lineTo(x + 14, y - h * i / 6); X.stroke(); }
  X.restore();
  if (label) txt(label, x, y + 110, 46, { alpha });
}
function calendar(x, y, s, big, small, o = {}) {
  const { alpha = 1, rot = 0, scale = 1 } = o;
  X.save(); X.globalAlpha *= alpha; X.translate(x, y); X.rotate(rot); X.scale(scale, scale);
  X.shadowColor = 'rgba(0,0,0,.4)'; X.shadowBlur = 20; X.fillStyle = '#fff'; rrect(-s / 2, -s / 2, s, s * 1.05, s * 0.1); X.fill(); X.shadowColor = 'transparent';
  X.fillStyle = '#ff4d6d'; rrect(-s / 2, -s / 2, s, s * 0.28, s * 0.1); X.fill(); X.fillRect(-s / 2, -s / 2 + s * 0.15, s, s * 0.13);
  X.restore();
  X.save(); X.globalAlpha *= alpha; X.translate(x, y); X.rotate(rot); X.scale(scale, scale);
  txt(small, 0, -s / 2 + s * 0.14, s * 0.12, { sw: 0, shadow: false });
  txt(big, 0, s * 0.15, s * 0.42, { color: '#1d1147', sw: 0, shadow: false });
  X.restore();
}
function mountain(x, base, w, h, col, snow = true, alpha = 1) {
  X.save(); X.globalAlpha *= alpha; X.fillStyle = col; X.beginPath(); X.moveTo(x - w / 2, base); X.quadraticCurveTo(x - w * 0.12, base - h * 0.9, x, base - h); X.quadraticCurveTo(x + w * 0.12, base - h * 0.9, x + w / 2, base); X.closePath(); X.fill();
  if (snow) { X.fillStyle = '#fff'; X.beginPath(); X.moveTo(x, base - h); X.lineTo(x - w * 0.09, base - h * 0.8); X.lineTo(x - w * 0.03, base - h * 0.84); X.lineTo(x + w * 0.02, base - h * 0.78); X.lineTo(x + w * 0.09, base - h * 0.8); X.closePath(); X.fill(); }
  X.restore();
}
function rocket(x, y, size, ang, flame = 1, alpha = 1) { // ang: arah gerak (rad, 0 = kanan)
  X.save(); X.globalAlpha *= alpha; X.translate(x, y); X.rotate(ang);
  if (flame > 0) { for (let i = 0; i < 3; i++) { const l = size * (0.6 + 0.25 * Math.sin(performanceT * 40 + i)) * flame; X.fillStyle = ['rgba(255,80,40,0.8)', 'rgba(255,170,40,0.85)', 'rgba(255,240,180,0.9)'][i]; X.beginPath(); X.ellipse(-size * 0.45 - l * 0.5 * (1 - i * 0.2), 0, l * (1 - i * 0.25) * 0.6, size * (0.16 - i * 0.04), 0, 0, TAU); X.fill(); } }
  X.rotate(Math.PI / 4); emo('🚀', 0, 0, size); X.restore();
}
let performanceT = 0;
function confetti(lt, seed = 1, n = 90) {
  const r = rng(seed); const cols = ['#ff4d6d', '#ffd23f', '#3ddc97', '#4cc9f0', '#b388ff', '#ff9f1c'];
  for (let i = 0; i < n; i++) {
    const x0 = r() * W, vy = 200 + r() * 300, sp = r() * 6, c = cols[i % cols.length], s = 10 + r() * 14, ph = r() * TAU;
    const y = -40 + lt * vy + 0 * ph; if (y > H + 40) continue;
    const x = x0 + Math.sin(lt * 2 + ph) * 60;
    X.save(); X.translate(x, y); X.rotate(lt * sp + ph); X.fillStyle = c; X.fillRect(-s / 2, -s / 4, s, s / 2); X.restore();
  }
}
function voyager(x, y, s, rot) {
  X.save(); X.translate(x, y); X.rotate(rot); X.lineCap = 'round';
  X.strokeStyle = '#d9d9e6'; X.lineWidth = s * 0.04; X.beginPath(); X.moveTo(-s * 1.4, 0); X.lineTo(s * 0.2, 0); X.moveTo(0, 0); X.lineTo(s * 0.9, s * 0.9); X.stroke();
  X.fillStyle = '#d4a017'; X.fillRect(-s * 0.22, -s * 0.12, s * 0.44, s * 0.3);
  X.fillStyle = '#f2f2f7'; X.beginPath(); X.ellipse(0, -s * 0.38, s * 0.62, s * 0.2, 0, 0, TAU); X.fill();
  X.strokeStyle = '#9a9ab0'; X.lineWidth = s * 0.03; X.stroke();
  X.fillStyle = '#9a9ab0'; X.beginPath(); X.arc(-s * 1.4, 0, s * 0.08, 0, TAU); X.fill();
  X.restore();
}
function noSign(x, y, r, alpha = 1) { X.save(); X.globalAlpha *= alpha; X.strokeStyle = '#ff2d55'; X.lineWidth = r * 0.16; X.beginPath(); X.arc(x, y, r, 0, TAU); X.stroke(); X.beginPath(); X.moveTo(x - r * 0.7, y - r * 0.7); X.lineTo(x + r * 0.7, y + r * 0.7); X.stroke(); X.restore(); }
function factTitle(s, B, y = 200, x = 1340, size = 64, color = '#fff') { txt(s, x, y, size, { alpha: B.a, scale: eob(B.lt / 0.5), color }); }

// ---------------------------------------------------------------- SCENES
const SCENES = {};

SCENES.intro = (sc, st, t) => {
  space(t, 'intro', 1.2);
  const B = beatInfo(sc, st);
  if (B.i === 0) {
    planet('venus', 620, 540, 230, t, { lit: 1 });
    bigNum('1 HARI', 1330, 400, 150, B.lt, { delay: 0.6 });
    bigNum('>', 1330, 540, 130, B.lt, { delay: 1.2, color: '#ff4d6d' });
    bigNum('1 TAHUN?!', 1330, 680, 150, B.lt, { delay: 1.8 });
  } else if (B.i === 1) {
    const bob = Math.sin(t * 2.2) * 18;
    planet('saturn', 960, 470 + bob, 170, t, { tilt: 0.28, tiltRot: -0.12 });
    // air
    X.save(); X.globalAlpha = 0.85; const g = X.createLinearGradient(0, 560, 0, H); g.addColorStop(0, '#4cc9f0'); g.addColorStop(1, '#1b4fa8'); X.fillStyle = g;
    X.beginPath(); X.moveTo(0, H); for (let k = 0; k <= 40; k++) { const xx = k * W / 40; X.lineTo(xx, 560 + Math.sin(k * 0.7 + t * 3) * 14); } X.lineTo(W, H); X.fill(); X.restore();
    for (let k = 0; k < 8; k++) emo('💧', 300 + k * 190, 640 + Math.sin(t * 3 + k) * 20, 40, { alpha: 0.7 });
    bigNum('BISA MENGAPUNG!', 960, 200, 120, B.lt, { delay: 0.5, color: '#ffd23f' });
  } else if (B.i === 2) {
    const k = eo(B.lt / 1.6);
    X.fillStyle = '#3a1a3e'; X.fillRect(0, 860, W, 220);
    mountain(560, 860, 260, 150 * k, '#8d99ae');
    mountain(1200, 860, 1100, 450 * eo((B.lt - 0.4) / 1.8), '#c1440e', false);
    txt('Everest', 560, 900, 42, { alpha: k });
    txt('Gunung di Mars', 1200, 900, 42, { alpha: clamp((B.lt - 0.8)) });
    bigNum('3× EVEREST!', 1200, 260, 130, B.lt, { delay: 1.4 });
  } else if (B.i === 3) {
    planet('earth', 1500, 1000, 420, t, { rot: t * 0.02 });
    const title = 'KELILING 8 PLANET';
    const cols = ['#ffd23f', '#ff9f1c', '#ff4d6d', '#b388ff', '#4cc9f0', '#3ddc97'];
    X.font = FONT(140); const tw = X.measureText(title).width; let cx = 960 - tw / 2;
    for (let i = 0; i < title.length; i++) {
      const ch = title[i], cw = X.measureText(ch).width; const d = 0.05 * i;
      const s = eob((B.lt - d) / 0.5); const bob = Math.sin(t * 4 + i * 0.6) * 8;
      if (ch !== ' ') txt(ch, cx + cw / 2, 330 + bob, 140, { color: cols[i % cols.length], scale: s, alpha: clamp((B.lt - d) / 0.2) });
      X.font = FONT(140); cx += cw;
    }
    txt('Petualangan Tata Surya', 960, 470, 60, { alpha: clamp((B.lt - 1) / 0.4), color: '#fff' });
    pill('✅ Fakta asli dari data NASA', 960, 600, 46, { alpha: clamp((B.lt - sentInBeat(sc, B, 2)) / 0.4), bg: '#3ddc97' });
    rocket(1500, 560, 120, -Math.PI / 2, 0.3);
    // tombol subscribe kecil di pojok
    const sa = clamp((B.lt - 2) / 0.4) * clamp((B.d - B.lt) / 0.3);
    pill('🔔 SUBSCRIBE', 1700, 190, 34, { alpha: sa, bg: '#ff2d55', fg: '#fff', scale: 1 + 0.04 * Math.sin(t * 5) });
  } else if (B.i === 4) {
    const s1 = sentInBeat(sc, B, 1);
    if (B.lt < s1) {
      planet('earth', 1500, 1000, 420, t, { rot: t * 0.02 });
      emo('✏️', 640, 480, 160, { scale: eob(B.lt / 0.5), rot: Math.sin(t * 3) * 0.1 });
      emo('📝', 880, 500, 170, { scale: eob((B.lt - 0.3) / 0.5) });
      bigNum('ADA KUIS DI AKHIR!', 760, 720, 90, B.lt, { delay: 0.6 });
      rocket(1500, 560, 120, -Math.PI / 2, 0.3);
    } else {
      const cd = TL.countdown || [];
      const lt2 = st; // waktu scene
      const launchT = cd.length >= 4 ? cd[3] : sc.beats[4].start + s1 + 3.2;
      const lk = clamp((st - launchT) / 1.6);
      planet('earth', 1500, 1000 + lk * 500, 420, t, { rot: t * 0.02 });
      const ry = 560 - eio(lk) * 900;
      rocket(1500 + Math.sin(t * 50) * (lk > 0 ? 4 : 0), ry, 120 + lk * 60, -Math.PI / 2, 0.3 + lk * 1.5);
      if (lk > 0) for (let i = 0; i < 18; i++) { const a = i * 0.9, d = lk * 300 * (0.5 + (i % 5) / 5); X.fillStyle = `rgba(230,230,240,${0.5 * (1 - lk)})`; X.beginPath(); X.arc(1500 + Math.cos(a) * d, 660 + Math.abs(Math.sin(a)) * d * 0.3, 40 + lk * 60, 0, TAU); X.fill(); }
      const nums = ['3', '2', '1'];
      for (let k = 0; k < 3; k++) {
        const ts = cd.length >= 4 ? cd[k] : (sc.beats[4].start + s1 + 1.0 + k * 0.8);
        const te = cd.length >= 4 ? cd[k + 1] : ts + 0.8;
        if (st >= ts && st < te) bigNum(nums[k], 700, 520, 340, st - ts, { color: ['#ff4d6d', '#ffd23f', '#3ddc97'][k] });
      }
      if (st >= launchT) bigNum('MELUNCUR!', 700, 520, 170, st - launchT, { color: '#ffd23f' });
      else if (!cd.length || st < cd[0]) bigNum('PASANG SABUK PENGAMAN!', 760, 300, 80, B.lt - s1, {});
    }
  }
};

SCENES.transition = (sc, st, t) => {
  const d = sc.end - sc.start, k = clamp(st / d);
  warp(t, 0.5 + Math.sin(k * Math.PI));
  const x = lerp(-200, W + 200, eio(k));
  rocket(x, 560 + Math.sin(k * 8) * 30, 170, 0, 1.4);
  const s = eob(st / 0.45) * clamp((d - st) / 0.25);
  txt(sc.label, 960, 360, 120, { scale: s, color: '#ffd23f' });
  if (sc.key !== 'matahari' && sc.key !== 'q1') txt('Siap? Meluncur!', 960, 780, 60, { scale: s, alpha: s });
};

function hudSegment(sc, st, t) {
  const key = sc.key; const rv = revealT(sc); const named = key === 'matahari' || key === 'mars' || st >= rv;
  const label = key === 'matahari' ? '☀️ MATAHARI' : `PLANET KE-${ORDER.indexOf(key) + 1} · ${named ? NAMES[key] : '???'}`;
  X.save(); X.font = FONT(38); const tw = X.measureText(label).width; X.restore();
  pill(label, 60 + (tw + 50) / 2, 70, 38, { bg: '#ffffff', fg: '#1d1147', alpha: clamp(st / 0.4) });
  txt('Sumber: NASA', 1860, 70, 30, { align: 'right', w: 600, sw: 6, color: '#e8e4ff', alpha: 0.9 * clamp(st / 0.4) });
}
function tracker(cur, t, alpha = 1) { // cur: indeks 0..8 (0 = matahari)
  if (alpha <= 0) return;
  X.save(); X.globalAlpha = alpha;
  const x0 = 640, x1 = 1280, y = 70; const xs = i => lerp(x0, x1, i / 8);
  X.strokeStyle = 'rgba(255,255,255,0.45)'; X.lineWidth = 4; X.setLineDash([8, 10]); X.beginPath(); X.moveTo(x0, y); X.lineTo(x1, y); X.stroke(); X.setLineDash([]);
  const kinds = ['sun', ...ORDER.map(k => KIND[k])];
  for (let i = 0; i <= 8; i++) {
    const r = i === 0 ? 16 : 12 + (i >= 5 && i <= 6 ? 4 : 0); const active = Math.round(cur) === i;
    X.globalAlpha = alpha * (i <= cur + 0.01 ? 1 : 0.45);
    planet(kinds[i], xs(i), y, r * (active ? 1.35 : 1), t, { tilt: 0.3 });
    X.globalAlpha = alpha;
  }
  rocket(xs(cur), y - 42, 44, 0, 0.5);
  X.restore();
}

// layout default: [x,y,r]
function planetScene(key, layouts, facts, o = {}) {
  return (sc, st, t) => {
    space(t, key, 0.6);
    const B = beatInfo(sc, st);
    const P = lay(layouts, B);
    const rv = revealT(sc);
    const lit = o.alwaysLit ? 1 : clamp((st - rv) / 0.6);
    if (o.under) o.under(sc, st, t, B, P);
    if (!(o.hidePlanet && o.hidePlanet(B))) planet(KIND[key], P[0], P[1], P[2], t, { lit, ...(o.popts ? o.popts(B, t) : {}) });
    if (!o.noName && B.i === 0 && st >= rv) bigNum(NAMES[key] + '!', o.nameX || 1380, o.nameY || 540, 140, st - rv, { color: '#ffd23f' });
    const f = facts[B.i]; if (f) f(sc, st, t, B, P);
  };
}

// ---- MATAHARI
SCENES.matahari = (sc, st, t) => {
  space(t, 'matahari', 0.6);
  const B = beatInfo(sc, st);
  const L = [[700, 560, 330], [760, 560, 400], [-60, 560, 460], [760, 600, 260], [130, 560, 150]];
  const P = lay(L, B);
  if (B.i === 4) { // orbit tata surya
    const k = eo(B.lt / 1.2);
    const xs = [330, 470, 620, 780, 1000, 1260, 1520, 1760], rs = [14, 22, 24, 18, 54, 46, 32, 30];
    for (let i = 0; i < 8; i++) { X.strokeStyle = `rgba(255,255,255,${0.25 * k})`; X.lineWidth = 3; X.beginPath(); X.ellipse(P[0], P[1], Math.max(1, xs[i] - P[0]), Math.max(1, xs[i] - P[0]) * 0.32, 0, -0.5, 0.5); X.stroke(); }
    planet('sun', P[0], P[1], P[2], t);
    for (let i = 0; i < 8; i++) {
      const s = eob((B.lt - 0.15 * i) / 0.5); const hl = i === 0 ? 1 + 0.18 * Math.sin(t * 6) : 1;
      planet(KIND[ORDER[i]], xs[i], 560, rs[i] * s * hl, t, { tilt: 0.3 });
      txt(NAMES[ORDER[i]], xs[i], 560 + 90, 26, { alpha: clamp((B.lt - 0.15 * i) / 0.3) * 0.9, sw: 5 });
    }
    const hk = clamp((B.lt - 1.8) / 0.4);
    arrow(330, 420, 330, 500, '#ffd23f', 10, hk); txt('Mulai dari sini!', 330, 370, 52, { color: '#ffd23f', alpha: hk });
    factTitle('8 PLANET mengelilingi Matahari', B, 230, 1100, 66);
    return;
  }
  planet('sun', P[0], P[1], P[2], t);
  if (B.i === 0) {
    const ex = 1180, ey = 780, er = P[2] / 109 * 1.0;
    // titik-titik bumi mengisi matahari
    const n = Math.floor(700 * eo((B.lt - 3) / 5)); const r = rng(11);
    for (let i = 0; i < n; i++) { const a = r() * TAU, d = Math.sqrt(r()) * P[2] * 0.95; X.fillStyle = 'rgba(70,160,255,0.85)'; X.beginPath(); X.arc(P[0] + Math.cos(a) * d, P[1] + Math.sin(a) * d, 3.2, 0, TAU); X.fill(); }
    planet('earth', ex, ey, Math.max(er, 5), t); X.strokeStyle = `rgba(255,255,255,${0.9 * B.a})`; X.lineWidth = 4; X.beginPath(); X.arc(ex, ey, 26 + 4 * Math.sin(t * 6), 0, TAU); X.stroke(); txt('← Bumi (sekecil ini!)', ex + 50, ey, 40, { alpha: B.a, align: 'left' });
    const s2 = sentInBeat(sc, B, 2);
    const cnt = Math.floor(1300000 * eo((B.lt - s2) / 2.2));
    if (B.lt > s2) { bigNum(cnt >= 1300000 ? '1,3 JUTA' : cnt.toLocaleString('id-ID'), 1440, 330, 140, B.lt, { delay: s2 }); txt('Bumi bisa masuk!', 1440, 450, 60, { alpha: clamp((B.lt - s2 - 0.5) / 0.4) }); }
    else factTitle('MATAHARI = BOS TATA SURYA 👑', B, 220, 1340, 60);
  } else if (B.i === 1) {
    const n = Math.floor(109 * eo((B.lt - 0.6) / 2.4)); const er = P[2] / 109;
    X.strokeStyle = 'rgba(255,255,255,0.8)'; X.lineWidth = 3; X.beginPath(); X.moveTo(P[0] - P[2], P[1]); X.lineTo(P[0] + P[2], P[1]); X.stroke();
    for (let i = 0; i < n; i++) { X.fillStyle = '#3b9cff'; X.beginPath(); X.arc(P[0] - P[2] + er + i * er * 2, P[1], er * 0.95, 0, TAU); X.fill(); }
    bigNum('109×', 1520, 420, 200, B.lt, { delay: 1.0 }); txt('lebar Bumi', 1520, 560, 64, { alpha: clamp((B.lt - 1.4) / 0.4) });
    txt(`${n} Bumi berjajar`, P[0], P[1] + 60, 40, { alpha: B.a });
  } else if (B.i === 2) {
    const ex = 1660, ey = 560; planet('earth', ex, ey, 50, t);
    const s1 = sentInBeat(sc, B, 1); const k = clamp((B.lt - s1 * 0.3) / (B.d * 0.75));
    const px = lerp(420, ex - 60, k);
    X.strokeStyle = 'rgba(255,230,120,0.8)'; X.lineWidth = 10; X.setLineDash([24, 18]); X.lineDashOffset = -t * 120; X.beginPath(); X.moveTo(420, ey); X.lineTo(px, ey); X.stroke(); X.setLineDash([]);
    glow(px, ey, 16, 'rgb(255,240,150)', 3, 0.9); X.fillStyle = '#fff8c0'; X.beginPath(); X.arc(px, ey, 16, 0, TAU); X.fill();
    // stopwatch
    const mins = Math.min(8, k * 8); const cx = 1060, cy = 300;
    X.save(); X.globalAlpha = B.a; X.fillStyle = '#fff'; X.beginPath(); X.arc(cx, cy, 120, 0, TAU); X.fill(); X.strokeStyle = '#1d1147'; X.lineWidth = 10; X.stroke();
    X.fillStyle = '#ffd23f'; X.beginPath(); X.moveTo(cx, cy); X.arc(cx, cy, 104, -Math.PI / 2, -Math.PI / 2 + TAU * mins / 8); X.fill();
    X.restore(); txt(`${Math.floor(mins)} menit`, cx, cy + 4, 50, { alpha: B.a, color: '#1d1147', sw: 0, shadow: false });
    bigNum('8 MENIT', 1060, 780, 140, B.lt, { delay: 0.8 }); txt('cahaya Matahari → Bumi', 1060, 880, 46, { alpha: clamp((B.lt - 1.2) / 0.4) });
  } else if (B.i === 3) {
    card(960, 210, 1300, 150, { alpha: B.a, bg: '#ff2d55', scale: eob(B.lt / 0.5) });
    txt('⚠️ JANGAN lihat Matahari langsung!', 960, 212, 60, { alpha: B.a, scale: eob(B.lt / 0.5), sw: 0 });
    emo('👀', 1450, 600, 170, { alpha: B.a, scale: eob((B.lt - 0.3) / 0.5) }); noSign(1450, 600, 130, B.a * clamp((B.lt - 0.6) / 0.3));
  }
  // HUD tracker
};

// ---- MERKURIUS
SCENES.merkurius = planetScene('merkurius', [[700, 560, 250], [480, 580, 230], [520, 580, 220], [700, 560, 240], [960, 560, 200]], {
  0: (sc, st, t, B) => { if (st < revealT(sc)) factTitle('Siang membara, malam membeku?', B, 860, 960, 66); },
  1: (sc, st, t, B, P) => {
    // separuh malam (biru) di kanan planet
    X.save(); X.beginPath(); X.arc(P[0], P[1], P[2], 0, TAU); X.clip(); X.fillStyle = 'rgba(40,60,200,0.45)'; X.fillRect(P[0], P[1] - P[2], P[2], P[2] * 2); X.fillStyle = 'rgba(255,120,30,0.3)'; X.fillRect(P[0] - P[2], P[1] - P[2], P[2], P[2] * 2); X.restore();
    emo('☀️', P[0] - P[2] - 30, P[1] - P[2] + 10, 80, { alpha: B.a }); emo('🌙', P[0] + P[2] + 30, P[1] - P[2] + 10, 70, { alpha: B.a });
    const s1 = sentInBeat(sc, B, 1), s2 = sentInBeat(sc, B, 2), s4 = sentInBeat(sc, B, 4);
    const hot = eo((B.lt - s1) / 1.2), cold = eo((B.lt - s2) / 1.2);
    thermo(1060, 700, 420, 0.15 + 0.85 * hot, '#ff4d3d', 'SIANG', B.a * clamp((B.lt - s1 + 0.3) / 0.3));
    bigNum('430°C', 1060, 200, 100, B.lt, { delay: s1 + 0.6, color: '#ff8a5c' });
    thermo(1560, 700, 420, 0.75 - 0.7 * cold, '#4cc9f0', 'MALAM', B.a * clamp((B.lt - s2 + 0.3) / 0.3));
    bigNum('−180°C', 1560, 200, 100, B.lt, { delay: s2 + 0.6, color: '#8fe3ff' });
    if (B.lt > s4) pill('Hampir tanpa atmosfer = panas kabur!', PORTRAIT ? 1310 : 960, PORTRAIT ? 930 : 900, 40, { alpha: clamp((B.lt - s4) / 0.4) * B.a, bg: '#ffffff' });
  },
  2: (sc, st, t, B) => {
    const k = clamp(B.lt / 2.4); const day = Math.floor(88 * eo(k));
    calendar(1100, 470, 330, String(day), 'HARI KE-', { alpha: B.a, rot: Math.sin(k * 30) * 0.05 * (1 - k), scale: eob(B.lt / 0.5) });
    bigNum('1 TAHUN = 88 HARI', 1380, 200, 84, B.lt, { delay: 0.4 }); txt('(hari Bumi)', 1380, 280, 44, { alpha: clamp((B.lt - 0.8) / 0.4) });
    const s1 = sentInBeat(sc, B, 1);
    for (let i = 0; i < 4; i++) emo('🎂', 1450 + (i % 2) * 180, 420 + Math.floor(i / 2) * 190, 120, { scale: eob((B.lt - s1 - i * 0.35) / 0.4), alpha: B.a });
    if (B.lt > s1) pill('Ulang tahun tiap ±3 bulan!', 1440, 820, 42, { alpha: clamp((B.lt - s1) / 0.4) * B.a });
  },
  3: (sc, st, t, B) => { bigNum('0 BULAN', 1380, 480, 150, B.lt, { delay: 0.3 }); emo('🌙', 1380, 700, 120, { alpha: B.a }); noSign(1380, 700, 90, B.a * clamp((B.lt - 0.6) / 0.3)); },
  4: (sc, st, t, B, P) => { arrow(1250, 560, 1650, 560, '#ffd23f', 16, B.a * clamp(B.lt / 0.4)); txt('Berikutnya…', 1450, 460, 56, { alpha: B.a }); planet('venus', 1780, 560, 70 * eob(B.lt / 0.6), t, { lit: 0.2 }); },
});

// ---- VENUS
SCENES.venus = planetScene('venus', [[620, 560, 260], [460, 560, 220], [460, 560, 240], [960, 560, 0]], {
  0: (sc, st, t, B) => {
    const rv = revealT(sc) - sc.beats[0].start;
    bigNum('1 HARI  vs  1 TAHUN', 1350, 300, 84, B.lt, { delay: 0.3 });
    if (B.lt > rv) bigNum('1 HARI > 1 TAHUN?!', 1350, 780, 92, B.lt, { delay: rv + 0.6, color: '#ff8a5c' });
  },
  1: (sc, st, t, B) => {
    const s1 = sentInBeat(sc, B, 1), s2 = sentInBeat(sc, B, 2), s3 = sentInBeat(sc, B, 3);
    const k1 = eo((B.lt - s1) / 1.4), k2 = eo((B.lt - s2) / 1.4);
    const x0 = 900, maxw = 820;
    X.save(); X.globalAlpha = B.a;
    X.fillStyle = 'rgba(255,255,255,0.15)'; rrect(x0, 330, maxw, 110, 24); X.fill(); rrect(x0, 560, maxw, 110, 24); X.fill();
    X.fillStyle = '#ffd23f'; rrect(x0, 330, maxw * k1, 110, 24); X.fill();
    X.fillStyle = '#4cc9f0'; rrect(x0, 560, maxw * (225 / 243) * k2, 110, 24); X.fill(); X.restore();
    txt('1 HARI (1× berputar)', x0, 290, 46, { align: 'left', alpha: B.a * clamp((B.lt - s1 + 0.3) / 0.3) });
    txt(String(Math.round(243 * k1)), x0 + 30, 387, 64, { align: 'left', color: '#1d1147', sw: 0, shadow: false, alpha: B.a * clamp((B.lt - s1) / 0.3) });
    txt('1 TAHUN (keliling Matahari)', x0, 520, 46, { align: 'left', alpha: B.a * clamp((B.lt - s2 + 0.3) / 0.3) });
    txt(String(Math.round(225 * k2)), x0 + 30, 617, 64, { align: 'left', color: '#1d1147', sw: 0, shadow: false, alpha: B.a * clamp((B.lt - s2) / 0.3) });
    txt('hari Bumi', x0 + maxw, 740, 40, { align: 'right', alpha: B.a * 0.85 });
    if (B.lt > s3) pill('Sehari lebih lama dari setahun! 🤯', 1300, 850, 46, { alpha: clamp((B.lt - s3) / 0.4) * B.a, bg: '#ff4d6d', fg: '#fff' });
  },
  2: (sc, st, t, B, P) => {
    // panas terperangkap
    for (let i = 0; i < 6; i++) { const a = i * TAU / 6 + t * 0.6, d = P[2] + 40 + 20 * Math.sin(t * 3 + i); emo('🔥', P[0] + Math.cos(a) * d, P[1] + Math.sin(a) * d, 50, { alpha: B.a }); }
    const s1 = sentInBeat(sc, B, 1), s2 = sentInBeat(sc, B, 2);
    thermo(980, 700, 440, 0.2 + 0.85 * eo(B.lt / 1.6) + 0.02 * Math.sin(t * 20), '#ff2d1d', '', B.a);
    bigNum('460°C+', 1400, 330, 150, B.lt, { delay: 0.6, color: '#ff8a5c' }); txt('PLANET PALING PANAS', 1400, 450, 54, { alpha: clamp((B.lt - 1) / 0.4) * B.a });
    if (B.lt > s1) txt('Lho, kok bukan Merkurius? 🤔', 1400, 560, 50, { alpha: clamp((B.lt - s1) / 0.4) * B.a, color: '#ffd23f' });
    if (B.lt > s2) { const k = clamp((B.lt - s2) / 0.4) * B.a; emo('☀️', 1300, 650, 100, { alpha: k }); emo('🚗', 1500, 680, 150, { alpha: k, scale: eob((B.lt - s2) / 0.5) }); txt('Awan tebal = kaca mobil tertutup', 1400, 790, 44, { alpha: k }); }
  },
  3: (sc, st, t, B) => {
    // pemandangan matahari terbit dari barat
    const k = eo(B.lt / 3.5);
    const sy = lerp(900, 430, k);
    const g = X.createLinearGradient(0, 300, 0, 900); g.addColorStop(0, `rgba(255,170,60,${0.25 * k})`); g.addColorStop(1, 'rgba(255,170,60,0)'); X.fillStyle = g; X.fillRect(0, 300, W, 600);
    planet('sun', 420, sy, 110, t);
    X.fillStyle = '#c98a3c'; X.beginPath(); X.moveTo(0, H); X.lineTo(0, 820); for (let i = 0; i <= 12; i++) X.lineTo(i * W / 12, 820 + Math.sin(i * 1.3) * 25); X.lineTo(W, H); X.fill();
    X.fillStyle = '#a86a2a'; X.fillRect(0, 900, W, 180);
    txt('BARAT', 420, 860, 54, { color: '#ffd23f' }); txt('TIMUR', 1500, 860, 54, { alpha: 0.7 });
    bigNum('Matahari terbit dari BARAT!', 1120, 260, 84, B.lt, { delay: 0.5 });
    pill('Venus berputar terbalik ↻', 1120, 380, 42, { alpha: clamp((B.lt - 1.2) / 0.4) * B.a });
  },
});

// ---- BUMI
SCENES.bumi = planetScene('bumi', [[960, 540, 280], [520, 560, 240], [700, 560, 200], [960, 520, 260]], {
  0: (sc, st, t, B, P) => {
    const em = ['🐳', '🌳', '🦒', '🐦', '🐠', '🌻', '🦋', '🐘'];
    em.forEach((e, i) => { const a = i * TAU / em.length + t * 0.25, d = P[2] + 120; emo(e, P[0] + Math.cos(a) * d * 1.35, P[1] + Math.sin(a) * d * 0.95, 78, { scale: eob((B.lt - 0.4 - i * 0.18) / 0.5), alpha: B.a }); });
    if (st < revealT(sc)) factTitle('Satu-satunya planet berkehidupan', B, 140, 960, 60);
    else pill('Satu-satunya planet berkehidupan (sejauh ini)', 960, 900, 42, { alpha: B.a });
  },
  1: (sc, st, t, B, P) => {
    const k = eo((B.lt - 0.3) / 1.6), cx = 1300, cy = 420, r = 190;
    X.save(); X.globalAlpha = B.a; X.lineWidth = 70;
    X.strokeStyle = 'rgba(255,255,255,0.15)'; X.beginPath(); X.arc(cx, cy, r, 0, TAU); X.stroke();
    X.strokeStyle = '#3b9cff'; X.beginPath(); X.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + TAU * 0.71 * k); X.stroke();
    X.strokeStyle = '#3fae4f'; X.beginPath(); X.arc(cx, cy, r, -Math.PI / 2 + TAU * 0.71, -Math.PI / 2 + TAU * (0.71 + 0.29 * clamp((k - 0.9) * 10))); X.stroke();
    X.restore();
    txt(`${Math.round(71 * k)}%`, cx, cy - 15, 110, { alpha: B.a, color: '#4cc9f0' }); txt('AIR', cx, cy + 75, 50, { alpha: B.a });
    const s1 = sentInBeat(sc, B, 1);
    if (B.lt > s1) {
      const a = clamp((B.lt - s1) / 0.4) * B.a; const y = 800;
      X.save(); X.globalAlpha = a;
      const zs = [['#ff4d3d', 'Terlalu panas'], ['#3ddc97', 'PAS! ✔'], ['#4cc9f0', 'Terlalu dingin']];
      zs.forEach(([c, l], i) => { X.fillStyle = c + 'cc'; rrect(940 + i * 300, y - 45, 280, 90, 45); X.fill(); });
      X.restore();
      zs.forEach(([c, l], i) => txt(l, 1080 + i * 300, y + 2, 38, { alpha: a, sw: 5 }));
      planet('sun', 860, y, 46, t);
      planet('earth', 1380, y - 100, 34, t);
    }
  },
  2: (sc, st, t, B, P) => {
    const a = t * 0.9; const mx = P[0] + Math.cos(a) * P[2] * 1.9, my = P[1] + Math.sin(a) * P[2] * 0.6;
    X.strokeStyle = `rgba(255,255,255,${0.3 * B.a})`; X.lineWidth = 3; X.beginPath(); X.ellipse(P[0], P[1], P[2] * 1.9, P[2] * 0.6, 0, 0, TAU); X.stroke();
    if (Math.sin(a) < 0) { planet('earth', P[0], P[1], P[2], t); planet('moon', mx, my, P[2] * 0.27, t); } else planet('moon', mx, my, P[2] * 0.27, t);
    bigNum('1 BULAN', 1450, 300, 130, B.lt, { delay: 0.3 });
    const s1 = sentInBeat(sc, B, 1);
    if (B.lt > s1) { const k = clamp((B.lt - s1) / 0.4) * B.a; planet('mercury', 1330, 620, 50, t); planet('venus', 1330, 760, 50, t); txt('Merkurius: 0', 1520, 620, 50, { alpha: k, align: 'left' }); txt('Venus: 0', 1520, 760, 50, { alpha: k, align: 'left' }); }
  },
  3: (sc, st, t, B, P) => {
    for (let i = 0; i < 10; i++) { const r = rng(i + 3); const x = 300 + r() * 1320, ph = r(); const y = 1000 - ((B.lt * 120 + ph * 900) % 900); emo('💚', x, y, 50 + r() * 30, { alpha: B.a * 0.8 }); }
    bigNum('JAGA BUMI!', 960, 170, 130, B.lt, { delay: 0.3, color: '#3ddc97' });
    pill('Kita belum punya planet cadangan 😉', 960, 860, 46, { alpha: clamp((B.lt - sentInBeat(sc, B, 1)) / 0.4) * B.a });
  },
}, { nameX: 960, nameY: 170, popts: (B, t) => ({ rot: t * 0.04 }) });
// Bumi: pastikan planet utama tetap tergambar di beat 2 (bulan di depan/belakang ditangani manual)
const _bumi = SCENES.bumi;
SCENES.bumi = (sc, st, t) => { _bumi(sc, st, t); };

// ---- MARS
SCENES.mars = planetScene('mars', [[700, 560, 250], [520, 580, 230], [300, 300, 120], [760, 540, 200], [960, 540, 0]], {
  0: (sc, st, t, B, P) => {
    for (let i = 0; i < 40; i++) { const r = rng(i + 50); const x = (r() * W + t * 60 * (0.5 + r())) % W, y = 200 + r() * 700; X.fillStyle = `rgba(230,120,70,${0.35 * B.a})`; X.beginPath(); X.arc(x, y, 3 + r() * 5, 0, TAU); X.fill(); }
    factTitle('Kenapa Mars MERAH?', B, 220, 1380, 76);
    const s1 = sentInBeat(sc, B, 1);
    if (B.lt > s1) { emo('🔩', 1380, 560, 200, { scale: eob((B.lt - s1 - 0.6) / 0.5), alpha: B.a }); bigNum('KARAT!', 1380, 800, 140, B.lt, { delay: s1 + 1.0, color: '#ff8a5c' }); }
  },
  1: (sc, st, t, B, P) => {
    const k = clamp(B.lt / (B.d * 0.8)); const cx = 1300, cy = 470;
    X.save(); X.globalAlpha = B.a; X.translate(cx, cy); X.rotate(-0.5);
    X.fillStyle = mix('#b8bcc6', '#a0461e', k); rrect(-260, -26, 440, 52, 14); X.fill(); X.beginPath(); X.moveTo(180, -26); X.lineTo(260, 0); X.lineTo(180, 26); X.fill();
    X.fillStyle = mix('#d5d8df', '#8f3a18', k); rrect(-300, -80, 60, 160, 16); X.fill();
    const r = rng(9); for (let i = 0; i < 26 * k; i++) { X.fillStyle = 'rgba(120,50,20,0.6)'; X.beginPath(); X.arc(-250 + r() * 430, (r() - .5) * 46, 4 + r() * 8, 0, TAU); X.fill(); }
    X.restore();
    for (let i = 0; i < 3; i++) emo('💧', 1150 + i * 120, 300 - ((B.lt * 140 + i * 60) % 160), 54, { alpha: B.a * (1 - k) });
    pill('Besi + air + oksigen = KARAT', 1300, 720, 46, { alpha: B.a * clamp((B.lt - 0.4) / 0.4) });
    pill('Tanah Mars penuh besi oksida', 1300, 830, 46, { alpha: B.a * clamp((B.lt - 1.2) / 0.4), bg: '#ff8a5c' });
  },
  2: (sc, st, t, B) => {
    const k = eo(B.lt / 1.6), base = 800;
    X.fillStyle = `rgba(80,30,30,${B.a})`; X.fillRect(0, base, W, H - base);
    mountain(620, base, 300, 150 * k, '#8d99ae', true, B.a);
    mountain(1260, base, 1100, 450 * eo((B.lt - 0.5) / 2), '#c1440e', false, B.a);
    txt('Everest', 620, base + 50, 44, { alpha: B.a }); txt('±8,8 km', 620, base - 150 * k - 40, 40, { alpha: B.a * k, color: '#cfe8ff' });
    txt('Olympus Mons', 1260, base + 50, 44, { alpha: B.a * clamp(B.lt - 0.8) }); txt('±22–26 km', 1260, base - 450 * eo((B.lt - 0.5) / 2) - 40, 40, { alpha: B.a * clamp(B.lt - 1.2), color: '#ffd23f' });
    bigNum('3× EVEREST', 1500, 190, 110, B.lt, { delay: 1.6 });
    pill('Gunung berapi terbesar di tata surya', 760, 220, 40, { alpha: B.a * clamp((B.lt - 0.6) / 0.4) });
  },
  3: (sc, st, t, B, P) => {
    const ms = [['Phobos', 1.5, 1.6, 30], ['Deimos', 2.3, 0.8, 22]];
    for (const [n, d, sp, r] of ms) {
      X.strokeStyle = `rgba(255,255,255,${0.25 * B.a})`; X.lineWidth = 3; X.beginPath(); X.ellipse(P[0], P[1], P[2] * d, P[2] * d * 0.35, 0, 0, TAU); X.stroke();
      const a = t * sp + d; const mx = P[0] + Math.cos(a) * P[2] * d, my = P[1] + Math.sin(a) * P[2] * d * 0.35;
      X.fillStyle = '#9b8b80'; X.beginPath(); X.ellipse(mx, my, r * 1.2, r, a, 0, TAU); X.fill(); txt(n, mx, my - r - 30, 34, { alpha: B.a, sw: 5 });
    }
    bigNum('2 BULAN KECIL', 1420, 260, 100, B.lt, { delay: 0.4 });
  },
  4: (sc, st, t, B) => {
    const r = rng(77);
    for (let i = 0; i < 70; i++) {
      const sp = 300 + r() * 900, y = r() * H, s = 10 + r() * 50, ph = r() * W;
      const x = W + 100 - ((B.lt * sp + ph) % (W + 200));
      X.save(); X.translate(x, y); X.rotate(t * (r() - 0.5) * 3); X.fillStyle = mix('#6e6258', '#a89a8c', r()); X.beginPath();
      for (let k = 0; k < 7; k++) { const a = k * TAU / 7, rr = s * (0.7 + r() * 0.4); X.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); }
      X.closePath(); X.fill(); X.restore();
    }
    rocket(760, 560 + Math.sin(t * 3) * 30, 170, 0, 1.4);
    bigNum('SABUK ASTEROID', 1300, 260, 100, B.lt, { delay: 0.3 });
    pill('Menuju planet raksasa! 🚀', 1300, 380, 44, { alpha: clamp((B.lt - 0.8) / 0.4) * B.a });
  },
}, { alwaysLit: true, noName: true, hidePlanet: B => B.i === 4 });

// ---- JUPITER
SCENES.jupiter = planetScene('jupiter', [[700, 560, 300], [600, 560, 320], [960, 1500, 1250], [700, 560, 230]], {
  0: (sc, st, t, B) => { if (st < revealT(sc)) { factTitle('Badai ratusan tahun?', B, 330, 1400, 70); factTitle('Lebih besar dari Bumi?!', B, 440, 1400, 70, '#ff8a5c'); } },
  1: (sc, st, t, B, P) => {
    const n = Math.floor(1000 * eo((B.lt - 0.5) / 2.6)); const r = rng(5); const er = P[2] / 11 * 0.95;
    let cnt = 0;
    for (let gy = -P[2]; gy <= P[2] && cnt < n; gy += er * 0.9) for (let gx = -P[2]; gx <= P[2] && cnt < n; gx += er * 0.9) { if (gx * gx + gy * gy < P[2] * P[2] * 0.92) { X.fillStyle = 'rgba(60,150,255,0.8)'; X.beginPath(); X.arc(P[0] + gx, P[1] + gy, er * 0.18, 0, TAU); X.fill(); cnt++; } }
    bigNum('> 1.000', 1420, 380, 170, B.lt, { delay: 0.6 }); txt('Bumi bisa masuk!', 1420, 520, 60, { alpha: clamp((B.lt - 1) / 0.4) * B.a });
    pill('PLANET TERBESAR 👑', 1420, 660, 50, { alpha: clamp((B.lt - 0.3) / 0.4) * B.a });
  },
  2: (sc, st, t, B, P) => {
    // zoom ke Bintik Merah Raksasa
    const s2_ = sentInBeat(sc, B, 2), mv = eio((B.lt - s2_) / 0.8); const sx = lerp(960, 640, mv), sy = 560, k = eo(B.lt / 1.0);
    const shrink = 1 - 0.08 * clamp((B.lt - sentInBeat(sc, B, 3)) / 2);
    const rx = 330 * shrink, ry = 200 * shrink;
    X.save(); X.globalAlpha = k;
    const g = X.createRadialGradient(sx, sy, 10, sx, sy, rx); g.addColorStop(0, '#f08a5c'); g.addColorStop(0.6, '#c1440e'); g.addColorStop(1, '#8a2a0a');
    X.fillStyle = g; X.beginPath(); X.ellipse(sx, sy, rx, ry, 0, 0, TAU); X.fill();
    X.strokeStyle = 'rgba(255,200,170,0.6)'; X.lineWidth = 6;
    for (let i = 1; i < 5; i++) { X.beginPath(); X.ellipse(sx, sy, rx * i / 5, ry * i / 5, 0, t * (0.6 + i * 0.2), t * (0.6 + i * 0.2) + 4.5); X.stroke(); }
    X.restore();
    const s2 = sentInBeat(sc, B, 2);
    if (B.lt > s2) {
      const a = clamp((B.lt - s2) / 0.5);
      X.globalAlpha = a; planet('earth', 1380, sy, rx / 1.3, t, {}); // lebar badai = 1,3× lebar Bumi
      X.globalAlpha = a; X.strokeStyle = '#fff'; X.lineWidth = 5; X.setLineDash([12, 10]);
      for (const yy of [sy - ry - 40]) { X.beginPath(); X.moveTo(sx - rx, yy); X.lineTo(sx + rx, yy); X.stroke(); }
      X.beginPath(); X.moveTo(1380 - rx / 1.3, sy - ry - 40); X.lineTo(1380 + rx / 1.3, sy - ry - 40); X.stroke(); X.setLineDash([]);
      txt('Badai', sx, sy - ry - 80, 44, { alpha: a }); txt('Bumi', 1380, sy - ry - 80, 44, { alpha: a });
      X.globalAlpha = 1;
      bigNum('1,3× lebar Bumi', 960, 210, 96, B.lt, { delay: s2 + 0.4 });
    } else factTitle('BINTIK MERAH RAKSASA = BADAI!', B, 210, 960, 76, '#ffd23f');
    const s1 = sentInBeat(sc, B, 1);
    pill('Sejak 1800-an', PORTRAIT ? 430 : 300, 860, 44, { alpha: B.a * clamp((B.lt - s1) / 0.4) });
    if (B.lt > sentInBeat(sc, B, 3)) pill('Pelan-pelan menyusut ↘', 1600, 860, 44, { alpha: B.a * clamp((B.lt - sentInBeat(sc, B, 3)) / 0.4), bg: '#4cc9f0' });
  },
  3: (sc, st, t, B, P) => {
    const n = Math.floor(95 * eo(B.lt / 2.5)); const r = rng(12);
    for (let i = 0; i < n; i++) { const d = 1.25 + r() * 1.6, sp = 0.3 + r() * 0.8, ph = r() * TAU, a = t * sp / d + ph; const x = P[0] + Math.cos(a) * P[2] * d, y = P[1] + Math.sin(a) * P[2] * d * 0.4; X.fillStyle = '#d9d4cc'; X.beginPath(); X.arc(x, y, 4 + r() * 4, 0, TAU); X.fill(); }
    bigNum('90+ BULAN', 1450, 300, 130, B.lt, { delay: 0.4 });
    const s1 = sentInBeat(sc, B, 1);
    if (B.lt > s1) { txt('Tapi tunggu dulu…', 1450, 560, 64, { alpha: clamp((B.lt - s1) / 0.4) * B.a, color: '#ffd23f' }); emo('🤔', 1450, 720, 140, { scale: eob((B.lt - s1 - 0.3) / 0.5), alpha: B.a }); }
  },
}, { nameX: 1400, nameY: 560, popts: (B, t) => ({ rot: t * 0.05 }), hidePlanet: B => B.i === 2 });

// ---- SATURNUS
function bathtub(x, y, w, h, t, alpha) {
  X.save(); X.globalAlpha *= alpha;
  X.fillStyle = '#4cc9f0'; X.beginPath(); X.moveTo(x - w / 2 + 20, y); for (let k = 0; k <= 20; k++) X.lineTo(x - w / 2 + 20 + (w - 40) * k / 20, y + Math.sin(k * 0.9 + t * 3) * 10); X.lineTo(x + w / 2 - 20, y + 30); X.lineTo(x - w / 2 + 20, y + 30); X.fill();
  X.fillStyle = '#ffffff'; X.beginPath(); X.moveTo(x - w / 2, y + 10); X.lineTo(x + w / 2, y + 10); X.quadraticCurveTo(x + w / 2, y + h, x + w / 2 - 80, y + h); X.lineTo(x - w / 2 + 80, y + h); X.quadraticCurveTo(x - w / 2, y + h, x - w / 2, y + 10); X.fill();
  X.strokeStyle = '#c9d6e8'; X.lineWidth = 10; X.stroke();
  X.fillStyle = '#ffd23f'; for (const fx of [x - w / 2 + 110, x + w / 2 - 110]) { X.beginPath(); X.arc(fx, y + h + 24, 26, 0, TAU); X.fill(); }
  for (let i = 0; i < 8; i++) { const r = rng(i + 20); X.strokeStyle = 'rgba(255,255,255,0.8)'; X.lineWidth = 3; X.beginPath(); X.arc(x - w / 2 + 60 + r() * (w - 120), y - 20 - ((t * 60 + r() * 200) % 200), 8 + r() * 10, 0, TAU); X.stroke(); }
  X.restore();
}
SCENES.saturnus = planetScene('saturnus', [[700, 520, 200], [960, 420, 170], [960, 540, 0], [620, 540, 170]], {
  0: (sc, st, t, B) => { if (st < revealT(sc)) factTitle('Planet raksasa bisa mengapung?', B, 860, 960, 66); },
  1: (sc, st, t, B, P) => {
    bathtub(960, 560, 1100, 300, t, B.a);
    pill('Lebih ringan dari air!', 960, 200, 56, { alpha: clamp((B.lt - sentInBeat(sc, B, 1)) / 0.4) * B.a, bg: '#4cc9f0' });
    const s3 = sentInBeat(sc, B, 3);
    if (B.lt > s3) txt('(cuma bayangan, ya! 😄)', 960, 930 - 60, 46, { alpha: clamp((B.lt - s3) / 0.4) * B.a });
  },
  2: (sc, st, t, B) => {
    const r = rng(31);
    for (let i = 0; i < 90; i++) {
      const depth = r(), s = 4 + depth * depth * 120, y = 140 + r() * 760, ph = r() * W;
      const x = ((ph - B.lt * (40 + depth * 260)) % (W + 300) + W + 300) % (W + 300) - 150;
      X.save(); X.globalAlpha = B.a * (0.4 + depth * 0.6); X.translate(x, y); X.rotate(depth * 5 + t * 0.2);
      const g = X.createLinearGradient(-s, -s, s, s); g.addColorStop(0, '#ffffff'); g.addColorStop(1, '#9fd8f0'); X.fillStyle = g; X.beginPath();
      for (let k = 0; k < 6; k++) { const a = k * TAU / 6, rr = s * (0.7 + ((i * 7 + k * 3) % 5) / 10); X.lineTo(Math.cos(a) * rr, Math.sin(a) * rr * 0.8); }
      X.closePath(); X.fill(); X.restore();
    }
    bigNum('CINCIN = BONGKAHAN ES 🧊', 960, 200, 86, B.lt, { delay: 0.3 });
    const s1 = 1.6;
    pill('sekecil debu…', 560, 860, 46, { alpha: clamp((B.lt - s1) / 0.4) * B.a });
    pill('…sampai sebesar rumah 🏠', 1360, 860, 46, { alpha: clamp((B.lt - s1 - 1.2) / 0.4) * B.a, bg: '#4cc9f0' });
  },
  3: (sc, st, t, B, P) => {
    const s1 = sentInBeat(sc, B, 1);
    const n = Math.floor(274 * eo((B.lt - s1) / 2.6)); const r = rng(44);
    for (let i = 0; i < n; i++) { const d = 2.4 + r() * 1.4, sp = 0.2 + r() * 0.5, ph = r() * TAU, a = t * sp / d + ph; X.fillStyle = '#e8e2d6'; X.beginPath(); X.arc(P[0] + Math.cos(a) * P[2] * d, P[1] + Math.sin(a) * P[2] * d * 0.35, 2.5 + r() * 3, 0, TAU); X.fill(); }
    emo('🏆', 1420, 330, 150, { scale: eob((B.lt - 0.2) / 0.5), alpha: B.a });
    txt('JUARA BULAN TERBANYAK!', 1420, 470, 58, { alpha: B.a * clamp(B.lt / 0.4), color: '#ffd23f' });
    if (B.lt > s1) { bigNum(n >= 274 ? '274 BULAN' : String(n), 1420, 640, 140, B.lt, { delay: s1 }); txt('(per Maret 2025)', 1420, 760, 40, { alpha: clamp((B.lt - s1 - 0.5) / 0.4) * B.a }); }
    const s2 = sentInBeat(sc, B, 2);
    if (B.lt > s2) pill('Jupiter: 90+ 😮', 1420, 860, 42, { alpha: clamp((B.lt - s2) / 0.4) * B.a, bg: '#ffffff' });
  },
}, { nameX: 1400, nameY: 520, popts: (B, t) => ({ tilt: 0.3, tiltRot: -0.15 }), hidePlanet: B => B.i === 2,
  under: (sc, st, t, B, P) => { if (B.i === 1) { /* planet mengapung */ } } });
// override: posisi mengapung di bathtub
{ const base = SCENES.saturnus; SCENES.saturnus = (sc, st, t) => base(sc, st, t); }

// ---- URANUS
SCENES.uranus = planetScene('uranus', [[760, 560, 230], [560, 560, 230], [1150, 560, 200]], {
  0: (sc, st, t, B) => { emo('😴', 1080, 380, 110, { alpha: B.a, rot: Math.sin(t * 2) * 0.2 }); if (st < revealT(sc)) factTitle('Planet yang "rebahan"?', B, 860, 960, 70); else pill('Berputar sambil rebahan!', 760, 880, 50, { alpha: B.a }); },
  1: (sc, st, t, B, P) => {
    const ang = (98 * Math.PI / 180) * eo((B.lt - 0.5) / 1.5);
    X.save(); X.globalAlpha = B.a; X.setLineDash([16, 14]); X.strokeStyle = 'rgba(255,255,255,0.6)'; X.lineWidth = 6;
    X.beginPath(); X.moveTo(P[0], P[1] - P[2] * 1.6); X.lineTo(P[0], P[1] + P[2] * 1.6); X.stroke(); X.setLineDash([]);
    X.strokeStyle = '#ffd23f'; X.lineWidth = 10; X.beginPath(); X.moveTo(P[0] - Math.sin(ang) * P[2] * 1.6, P[1] + Math.cos(ang) * P[2] * 1.6); X.lineTo(P[0] + Math.sin(ang) * P[2] * 1.6, P[1] - Math.cos(ang) * P[2] * 1.6); X.stroke();
    X.lineWidth = 6; X.beginPath(); X.arc(P[0], P[1], P[2] * 1.25, -Math.PI / 2, -Math.PI / 2 + ang); X.stroke(); X.restore();
    bigNum(`${Math.round(98 * eo((B.lt - 0.5) / 1.5))}°`, P[0] + P[2] * 1.1, P[1] - P[2] * 1.15, 90, B.lt, { delay: 0.5 });
    bigNum('MIRING 98°', 1420, 260, 120, B.lt, { delay: 0.4 });
    const s1 = sentInBeat(sc, B, 1), s2 = sentInBeat(sc, B, 2);
    if (B.lt > s1) { pill('Menggelinding seperti bola ⚽', 1420, 420, 46, { alpha: clamp((B.lt - s1) / 0.4) * B.a }); }
    if (B.lt > s2) {
      const k = clamp((B.lt - s2) / 1.6); const bx = lerp(1900, P[0] + P[2] * 0.9, eo(k)), by = lerp(150, P[1] - P[2] * 0.5, eo(k));
      if (k < 1) { X.fillStyle = '#8d7b6a'; X.beginPath(); X.arc(bx, by, 50, 0, TAU); X.fill(); }
      else emo('💥', P[0] + P[2] * 0.8, P[1] - P[2] * 0.5, 160, { scale: eob((B.lt - s2 - 1.6) / 0.4) });
      pill('Dulu pernah ditabrak?!', 1420, 700, 46, { alpha: clamp((B.lt - s2) / 0.4) * B.a, bg: '#ff8a5c' });
    }
  },
  2: (sc, st, t, B, P) => {
    const k = clamp(B.lt / (B.d * 0.95)); const vx = lerp(-150, 1950, k), vy = lerp(300, 820, k);
    voyager(vx, vy, 90, -0.4 + k * 0.6);
    X.strokeStyle = 'rgba(255,255,255,0.35)'; X.setLineDash([10, 14]); X.lineWidth = 3; X.beginPath(); X.moveTo(-150, 300); X.lineTo(vx, vy); X.stroke(); X.setLineDash([]);
    bigNum('VOYAGER 2', 560, 220, 110, B.lt, { delay: 0.6 }); txt('milik NASA', 560, 320, 50, { alpha: clamp((B.lt - 1) / 0.4) * B.a });
    pill('Satu-satunya yang pernah berkunjung! 🔍', 560, 420, 42, { alpha: clamp((B.lt - 1.5) / 0.4) * B.a });
  },
}, { nameX: 1380, nameY: 560, popts: (B, t) => ({ tiltRot: 98 * Math.PI / 180 }) });

// ---- NEPTUNUS
SCENES.neptunus = planetScene('neptunus', [[700, 560, 250], [400, 520, 190], [960, 560, 0], [560, 560, 220]], {
  0: (sc, st, t, B, P) => {
    for (let i = 0; i < 26; i++) { const r = rng(i + 90); const y = 180 + r() * 760, sp = 900 + r() * 900, x = W - ((t * sp + r() * W * 2) % (W * 1.4)); X.strokeStyle = `rgba(200,220,255,${0.5 * B.a})`; X.lineWidth = 3 + r() * 3; X.lineCap = 'round'; X.beginPath(); X.moveTo(x, y); X.lineTo(x + 140 + r() * 160, y); X.stroke(); }
    if (st < revealT(sc)) { factTitle('Planet TERJAUH…', B, 330, 1400, 74); factTitle('…dan PALING BERANGIN!', B, 450, 1400, 74, '#4cc9f0'); }
    emo('💨', 1000, 700, 120, { alpha: B.a, scale: 1 + 0.08 * Math.sin(t * 6) });
  },
  1: (sc, st, t, B) => {
    const s1 = sentInBeat(sc, B, 1), s2 = sentInBeat(sc, B, 2);
    const k1 = eo((B.lt - 0.3) / 1.6), k2 = eo((B.lt - s1) / 1.2);
    const x0 = 720, maxw = 1050;
    X.save(); X.globalAlpha = B.a; X.fillStyle = 'rgba(255,255,255,0.12)'; rrect(x0, 360, maxw, 100, 50); X.fill(); rrect(x0, 600, maxw, 100, 50); X.fill();
    X.fillStyle = '#4cc9f0'; rrect(x0, 360, Math.max(100, maxw * k1), 100, 50); X.fill();
    X.fillStyle = '#3ddc97'; rrect(x0, 600, Math.max(100, maxw * 0.2 * k2), 100, 50); X.fill(); X.restore();
    txt('Angin Neptunus', x0, 320, 46, { align: 'left', alpha: B.a }); txt('2.000+ km/jam', x0 + maxw - 20, 410, 54, { align: 'right', alpha: B.a * k1, color: '#1d1147', sw: 0, shadow: false });
    txt('Angin terkuat di Bumi', x0, 560, 46, { align: 'left', alpha: B.a * clamp((B.lt - s1 + 0.3) / 0.3) }); txt('±400 km/jam', x0 + maxw * 0.2 + 30, 650, 50, { align: 'left', alpha: B.a * k2 });
    emo('✈️', x0 + maxw * 0.2 * k2 + 420, 650, 70, { alpha: B.a * k2 });
    if (B.lt > s2) bigNum('5× LEBIH KENCANG!', 1240, 830, 92, B.lt, { delay: s2 + 0.3, color: '#ffd23f' });
  },
  2: (sc, st, t, B) => {
    const cx = 760, cy = 560, rx = 520, ry = 300;
    planet('sun', cx, cy, 60, t);
    X.strokeStyle = `rgba(255,255,255,${0.35 * B.a})`; X.lineWidth = 3; X.beginPath(); X.ellipse(cx, cy, rx, ry, 0, 0, TAU); X.stroke();
    const s1 = sentInBeat(sc, B, 1), s2 = sentInBeat(sc, B, 2);
    const k = clamp((B.lt - s1 - 0.3) / Math.max(1, s2 - s1 - 0.6));
    const a = -Math.PI / 2 + TAU * eio(k);
    X.strokeStyle = `rgba(76,201,240,${0.9 * B.a})`; X.lineWidth = 10; X.beginPath(); X.ellipse(cx, cy, rx, ry, 0, -Math.PI / 2, a); X.stroke();
    planet('neptune', cx + Math.cos(a) * rx, cy + Math.sin(a) * ry, 46, t);
    const year = Math.round(1846 + 165 * eio(k));
    bigNum('1 TAHUN = 165 TAHUN BUMI', 960, 160, 70, B.lt, { delay: 0.2 });
    if (B.lt > s1) { card(1600, 470, 380, 170, { alpha: B.a }); txt(String(year), 1600, 470, 110, { color: '#1d1147', sw: 0, shadow: false, alpha: B.a }); txt('ditemukan 1846', 1600, 600, 38, { alpha: B.a }); }
    if (B.lt > s2) { emo('🎂', 1600, 760, 130, { scale: eob((B.lt - s2) / 0.5), alpha: B.a }); txt('Ulang tahun ke-1 (2011)!', 1600, 880, 46, { alpha: clamp((B.lt - s2) / 0.4) * B.a, color: '#ffd23f' }); }
  },
  3: (sc, st, t, B, P) => {
    emo('👁️', 1250, 420, 170, { alpha: B.a, scale: eob(B.lt / 0.5) }); noSign(1250, 420, 130, B.a * clamp((B.lt - 0.6) / 0.3));
    emo('🔭', 1580, 420, 170, { alpha: B.a, scale: eob((B.lt - 0.9) / 0.5) });
    txt('Harus pakai teleskop!', 1420, 640, 60, { alpha: clamp((B.lt - 1.2) / 0.4) * B.a, color: '#ffd23f' });
    pill('Tak terlihat dengan mata telanjang', 1420, 760, 44, { alpha: clamp((B.lt - 0.4) / 0.4) * B.a });
  },
}, { nameX: 1400, nameY: 640, popts: (B, t) => ({ rot: t * 0.08 }) });

// ---- KUIS
function quizBg(t) {
  X.fillStyle = '#2b0f6b'; X.fillRect(0, 0, W, H);
  X.save(); X.translate(W / 2, H / 2); X.rotate(t * 0.15);
  for (let i = 0; i < 16; i++) { X.fillStyle = i % 2 ? 'rgba(255,255,255,0.05)' : 'rgba(255,77,109,0.10)'; X.beginPath(); X.moveTo(0, 0); X.arc(0, 0, 1400, i * TAU / 16, (i + 1) * TAU / 16); X.fill(); }
  X.restore();
  const g = X.createRadialGradient(W / 2, H / 2, 100, W / 2, H / 2, 1100); g.addColorStop(0, 'rgba(120,60,255,0)'); g.addColorStop(1, 'rgba(10,0,40,0.75)'); X.fillStyle = g; X.fillRect(0, 0, W, H);
}
function timerRing(sc, st, t) {
  if (sc.timer_start == null || st < sc.timer_start) return;
  const k = clamp((st - sc.timer_start) / 5), left = Math.ceil(5 - (st - sc.timer_start));
  const cx = PORTRAIT ? (sc.key === 'q1' ? 840 : 960) : 1660, cy = PORTRAIT ? 1030 : 300, r = 120;
  X.save(); X.fillStyle = '#fff'; X.beginPath(); X.arc(cx, cy, r + 20, 0, TAU); X.fill();
  X.strokeStyle = k > 0.6 ? '#ff4d6d' : '#3ddc97'; X.lineWidth = 26; X.lineCap = 'round'; X.beginPath(); X.arc(cx, cy, r - 8, -Math.PI / 2, -Math.PI / 2 + TAU * (1 - k)); X.stroke(); X.restore();
  const frac = (st - sc.timer_start) % 1;
  txt(left > 0 ? String(left) : '⏰', cx, cy + 6, 120, { color: '#1d1147', sw: 0, shadow: false, scale: 1 + 0.25 * (1 - eo(frac / 0.3)) });
  if (PORTRAIT) txt('Ayo jawab!', cx + 360, cy, 60, { color: '#ffd23f' }); else txt('Ayo jawab!', cx, cy + 200, 48, { color: '#ffd23f' });
}
function lineup(y, r, t, alpha = 1, bounce = 0, hl = -1) {
  const ks = ORDER.map(k => KIND[k]);
  for (let i = 0; i < 8; i++) { const x = 300 + i * 190; const b = bounce ? Math.max(0, Math.sin(t * 4 - i * 0.6)) * bounce : 0; const s = hl === i ? 1.35 + 0.1 * Math.sin(t * 6) : 1; X.globalAlpha = alpha * (hl >= 0 && hl !== i ? 0.4 : 1); planet(ks[i], x, y - b, r * s * (i === 4 || i === 5 ? 1.25 : 1), t, { tilt: 0.3 }); X.globalAlpha = 1; txt(NAMES[ORDER[i]], x, y + r + 50, 26, { alpha: alpha * (hl >= 0 && hl !== i ? 0.5 : 1), sw: 5 }); }
}
SCENES.q1 = (sc, st, t) => {
  quizBg(t); const B = beatInfo(sc, st);
  if (B.i === 0) { bigNum('KUIS TIME!', 960, 420, 200, B.lt, { delay: 0.1, color: '#ffd23f' }); emo('🧠', 960, 660, 160, { scale: eob((B.lt - 0.4) / 0.5) }); pill('Jawab di kolom komentar 💬', 960, 840, 50, { alpha: clamp((B.lt - 1) / 0.4) * B.a }); return; }
  const a = clamp(B.lt / 0.4);
  pill('SOAL 1', 960, 120, 48, { bg: '#ff4d6d', fg: '#fff', alpha: a });
  card(840, 290, 1300, 190, { alpha: a, scale: eob(B.lt / 0.5) }); txt('Planet mana yang paling panas?', 840, 292, 66, { color: '#1d1147', sw: 0, shadow: false, alpha: a, scale: eob(B.lt / 0.5) });
  const s1 = sentInBeat(sc, B, 1);
  const opts = [['A', 'Merkurius', 'mercury', '#4cc9f0'], ['B', 'Venus', 'venus', '#ffd23f']];
  opts.forEach(([l, n, k, c], i) => {
    const ox = 560 + i * 600, oy = 680, ap = clamp((B.lt - s1 - i * 0.9) / 0.4);
    card(ox, oy, 500, 330, { alpha: ap, bg: c, scale: eob((B.lt - s1 - i * 0.9) / 0.5) });
    X.globalAlpha = ap; planet(k, ox, oy - 40, 90, t); X.globalAlpha = 1;
    txt(`${l}. ${n}`, ox, oy + 110, 56, { alpha: ap, color: '#1d1147', sw: 0, shadow: false });
  });
  timerRing(sc, st, t);
};
function quizQ(num, q) {
  return (sc, st, t) => {
    quizBg(t); const B = beatInfo(sc, st); const a = clamp(B.lt / 0.4);
    pill('SOAL ' + num, 960, 120, 48, { bg: '#ff4d6d', fg: '#fff', alpha: a });
    const lines = wrap(q, 64, 1150, 700);
    card(840, 320, 1300, 120 + lines.length * 80, { alpha: a, scale: eob(B.lt / 0.5) });
    lines.forEach((ln, i) => txt(ln, 840, 320 - (lines.length - 1) * 40 + i * 80, 64, { color: '#1d1147', sw: 0, shadow: false, alpha: a }));
    lineup(720, 46, t, clamp((B.lt - 0.6) / 0.5), 14);
    timerRing(sc, st, t);
  };
}
SCENES.q2 = quizQ(2, 'Planet mana yang punya bulan paling banyak?');
SCENES.q3 = quizQ(3, 'Di planet mana satu harinya lebih lama dari satu tahunnya?');
function answer(name, kind, extra) {
  return (sc, st, t) => {
    quizBg(t); confetti(st, kind.length * 13);
    const s = eob(st / 0.55);
    card(960, 470, 1100, 560, { bg: '#3ddc97', scale: s, alpha: clamp(st / 0.2) });
    X.globalAlpha = clamp(st / 0.3); planet(kind, 960, 420, 150, t, { tilt: 0.3 }); X.globalAlpha = 1;
    txt('✅ ' + name, 960, 660, 100, { scale: s, color: '#fff' });
    if (extra) pill(extra, 960, 860, 46, { alpha: clamp((st - 1) / 0.4), bg: '#ffffff' });
  };
}
SCENES.a1 = answer('B. VENUS', 'venus', 'Awan tebalnya memerangkap panas 🔥');
SCENES.a2 = answer('SATURNUS', 'saturn', '274 bulan! 🏆');
SCENES.a3 = (sc, st, t) => { answer('VENUS LAGI!', 'venus', null)(sc, st, t); const s1 = sc.sentences.length > 1 ? sc.sentences[1].start : 2; pill('Berapa skormu? Tulis di komentar! 💬', 960, 860, 50, { alpha: clamp((st - s1) / 0.4), bg: '#ffd23f' }); };

// ---- OUTRO & END
SCENES.outro = (sc, st, t) => {
  space(t, 'intro', 0.8); const B = beatInfo(sc, st);
  if (B.i === 0) {
    lineup(440, 52, t, clamp(st / 0.6), 26);
    const k = eo(B.lt / 3);
    planet('earth', 960, 1180, 380, t, { rot: t * 0.02 });
    rocket(960, lerp(-100, 760, k), 150, Math.PI / 2, 1 - k * 0.7);
    txt('Perjalanan selesai! 🎉', 960, 170, 84, { scale: eob(B.lt / 0.5), color: '#ffd23f' });
  } else {
    lineup(300, 40, t, 0.9, 16);
    const items = [['👍 SUKA', '#3b82f6'], ['🔔 SUBSCRIBE', '#ff2d55'], ['💬 KOMENTAR', '#3ddc97']];
    items.forEach(([s, c], i) => pill(s, 460 + i * 500, 560, 62, { bg: c, fg: '#fff', scale: eob((B.lt - 0.5 - i * 0.6) / 0.5) * (1 + 0.04 * Math.sin(t * 5 + i)), alpha: clamp((B.lt - 0.5 - i * 0.6) / 0.2) }));
    txt('Planet apa yang mau dibahas berikutnya?', 960, 760, 62, { alpha: clamp((B.lt - 2.4) / 0.4), color: '#ffd23f' });
    const s1 = sentInBeat(sc, B, 1);
    emo('👋', 960, 160, 120, { alpha: clamp((B.lt - s1) / 0.3), rot: Math.sin(t * 8) * 0.3 });
  }
};
SCENES.end = (sc, st, t) => {
  space(t, 'end', 0.5);
  lineup(330, 44, t, clamp(st / 0.5), 20);
  txt('Sampai jumpa, penjelajah! 👋', 960, 600, 96, { scale: eob(st / 0.6), color: '#ffd23f' });
  txt('Sumber data: NASA, UCAR, Sky & Telescope, Natural History Museum', 960, 760, 36, { alpha: clamp((st - 0.6) / 0.5), w: 500, sw: 6 });
  txt('Gambar: ilustrasi animasi', 960, 820, 32, { alpha: clamp((st - 0.9) / 0.5) * 0.8, w: 500, sw: 6 });
};

// ---------------------------------------------------------------- caption
function captions(t) {
  let cur = null; for (const c of TL.captions) if (t >= c.start && t < c.end) cur = c;
  if (!cur) return;
  const a = clamp((t - cur.start) / 0.15) * clamp((cur.end - t) / 0.12);
  const lines = wrap(cur.text, 46, 1500, 600).slice(0, 3);
  X.font = FONT(46, 600); const mw = Math.max(...lines.map(l => X.measureText(l).width));
  const h = lines.length * 60 + 30, y = H - 40 - h;
  X.save(); X.globalAlpha = a * 0.62; X.fillStyle = '#0b0726'; rrect(960 - mw / 2 - 34, y, mw + 68, h, 26); X.fill(); X.restore();
  lines.forEach((l, i) => txt(l, 960, y + 45 + i * 60, 46, { w: 600, alpha: a, sw: 0 }));
}

// ---------------------------------------------------------------- render utama
window.setTimeline = tl => { TL = tl; };
window.renderAt = function (t) {
  performanceT = t;
  let sc = TL.scenes[0]; for (const s of TL.scenes) if (t >= s.start) sc = s;
  const st = t - sc.start;
  X.setTransform(1, 0, 0, 1, 0, 0); X.globalAlpha = 1; X.clearRect(0, 0, W, H);
  // guncangan saat roket meluncur
  let shake = 0; if (sc.key === 'intro' && TL.countdown && TL.countdown.length >= 4) { const k = st - TL.countdown[3]; if (k > 0 && k < 1.4) shake = 12 * (1 - k / 1.4); }
  X.save(); if (shake) X.translate(Math.sin(t * 90) * shake, Math.cos(t * 77) * shake);
  const fn = sc.kind === 'transition' ? SCENES.transition : sc.kind === 'endcard' ? SCENES.end : SCENES[sc.key];
  fn(sc, st, t);
  X.restore();
  // HUD
  const planetKeys = ['matahari', ...ORDER];
  if (sc.kind === 'segment' && planetKeys.includes(sc.key)) {
    hudSegment(sc, st, t);
    tracker(planetKeys.indexOf(sc.key), t, clamp(st / 0.4));
  } else if (sc.kind === 'transition' && planetKeys.includes(sc.key)) {
    const i = planetKeys.indexOf(sc.key); tracker(Math.max(0, i - 1) + eio(st / (sc.end - sc.start)) * (i === 0 ? 0 : 1), t, 1);
  }
  captions(t);
  // fade awal & akhir
  const fa = Math.max(clamp(1 - t / 0.8), clamp((t - (TL.duration - 1.0)) / 1.0));
  if (fa > 0) { X.fillStyle = `rgba(0,0,0,${fa})`; X.fillRect(0, 0, W, H); }
};
