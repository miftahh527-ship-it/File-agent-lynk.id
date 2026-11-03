// Renderer Shorts 9:16 — memakai ulang adegan landscape dari engine.js lewat "kamera" per beat.
const PW = 1080, PH = 1920;
const BAND = { y: 340, h: 900 };          // area adegan (di bawah judul, di atas caption)
let NOBG = false, SHORT = null;
{ // latar adegan tidak digambar saat dibingkai kamera; latar portrait digambar sendiri
  const _space = space, _warp = warp, _quizBg = quizBg;
  space = (...a) => { if (!NOBG) _space(...a); };
  warp = (...a) => { if (!NOBG) _warp(...a); };
  quizBg = (...a) => { if (!NOBG) _quizBg(...a); };
  window.__bg = { space: _space, warp: _warp, quizBg: _quizBg };
}

// Kamera: per adegan, per beat, daftar keyframe [kapan, cx, w, cy?]. kapan: detik dari awal beat,
// 'rv' (nama planet diungkap), 's1'/'s2'/... (kalimat ke-n dalam beat).
const CAM = {
  matahari: [[[0, 760, 1150], ['s2', 1330, 1150]], [[0, 760, 1150], [1.0, 1250, 1150]], [[0, 1150, 1300]], [[0, 960, 1340]]],
  merkurius: [[[0, 960, 1250], ['rv', 1230, 1250]], [[0, 700, 1150], ['s1', 1300, 1150]], [[0, 900, 1250], [0.8, 1340, 1150]], [[0, 1100, 1250]]],
  venus: [[[0, 1150, 1300]], [[0, 800, 1200], [0.7, 1300, 1150]], [[0, 700, 1200], [0.9, 1340, 1100]], [[0, 1040, 1460]]],
  bumi: [[[0, 960, 1300]], [[0, 1000, 1250], ['s1', 1330, 1100]], [[0, 1060, 1400], ['s1', 1350, 1100]], [[0, 960, 1360]]],
  mars: [[[0, 1100, 1300]], [[0, 1050, 1300]], [[0, 1050, 1500]], [[0, 1060, 1560]]],
  jupiter: [[[0, 1110, 1500]], [[0, 1050, 1560]], [[0, 960, 1300], ['s1', 1050, 1720]], [[0, 1000, 1650]]],
  saturnus: [[[0, 960, 1300], ['rv', 1190, 1500]], [[0, 960, 1240]], [[0, 1030, 1420]], [[0, 620, 1200], ['s1', 1320, 1100]]],
  uranus: [[[0, 960, 1300], ['rv', 1100, 1500]], [[0, 600, 1150], [0.9, 1300, 1150], ['s2', 980, 1660]], [[0, 900, 1500]]],
  neptunus: [[[0, 1150, 1580]], [[0, 1240, 1120]], [[0, 1070, 1720]], [[0, 1100, 1580]]],
  q1: [[[0, 960, 1300]], [[0, 840, 1340, 640]]], q2: [[[0, 965, 1520, 640]]], q3: [[[0, 965, 1520, 640]]],
  a1: [[[0, 960, 1240]]], a2: [[[0, 960, 1240]]], a3: [[[0, 960, 1240]]],
};
function kfTime(sc, bi, at) {
  if (typeof at === 'number') return at;
  if (at === 'rv') return revealT(sc) - sc.beats[bi].start;
  if (at === 'ts') return (sc.timer_start == null ? 99 : sc.timer_start - 0.3) - sc.beats[bi].start;
  return sentT(sc, bi, parseInt(at.slice(1))) - sc.beats[bi].start - 0.2;
}
function camAt(sc, st) {
  const cfg = CAM[sc.key]; const B = beatInfo(sc, st);
  const list = [];
  cfg.forEach((beat, bi) => beat.forEach(k => list.push({ t: sc.beats[Math.min(bi, sc.beats.length - 1)].start + kfTime(sc, bi, k[0]), cx: k[1], w: k[2], cy: k[3] || 540 })));
  let cur = list[0], prev = list[0];
  for (let i = 0; i < list.length; i++) if (st >= list[i].t) { cur = list[i]; prev = list[Math.max(0, i - 1)]; }
  const k = eio((st - cur.t) / 0.8);
  return { cx: lerp(prev.cx, cur.cx, k), cy: lerp(prev.cy, cur.cy, k), w: lerp(prev.w, cur.w, k) };
}

// ---------------------------------------------------------------- latar portrait
function bgCover(fn) { // gambar latar 1920x1080 menutupi 1080x1920
  const s = PH / 1080; X.save(); X.translate(PW / 2, PH / 2); X.scale(s, s); X.translate(-960, -540); fn(); X.restore();
}
function portraitBg(sc, t) {
  const k = sc.kind === 'cta' ? 'intro' : sc.key;
  if (k[0] === 'q' || k[0] === 'a') bgCover(() => window.__bg.quizBg(t));
  else bgCover(() => window.__bg.space(t, k, 0.5));
}

// ---------------------------------------------------------------- header & caption
function header(t) {
  const a = clamp(t / 0.4);
  const lines = wrap(SHORT.title, 76, 940, 700);
  const y0 = 165 - (lines.length - 1) * 44;
  lines.forEach((l, i) => txt(l, PW / 2, y0 + i * 88, 76, { color: '#ffd23f', alpha: a, scale: eob(t / 0.5) }));
  txt('Sumber: NASA', PW - 40, 46, 28, { align: 'right', w: 600, sw: 6, color: '#e8e4ff', alpha: 0.9 * a });
  if (SHORT.badge) pill(SHORT.badge, 40 + 130, 46, 28, { bg: '#ffffff', fg: '#1d1147', alpha: a });
}
function captionsP(t) {
  let cur = null; for (const c of SHORT.captions) if (t >= c.start && t < c.end) cur = c;
  if (!cur) return;
  const a = clamp((t - cur.start) / 0.15) * clamp((cur.end - t) / 0.12);
  const lines = wrap(cur.text, 52, 860, 600).slice(0, 4);
  X.font = FONT(52, 600); const mw = Math.max(...lines.map(l => X.measureText(l).width));
  const h = lines.length * 66 + 34, y = 1265, cx = 500;   // sedikit ke kiri: jauhi tombol like/komen
  X.save(); X.globalAlpha = a * 0.66; X.fillStyle = '#0b0726'; rrect(cx - mw / 2 - 30, y, mw + 60, h, 28); X.fill(); X.restore();
  lines.forEach((l, i) => txt(l, cx, y + 50 + i * 66, 52, { w: 600, alpha: a, sw: 0 }));
}

// ---------------------------------------------------------------- adegan ajakan follow (native 9:16)
function ctaScene(sc, st, t) {
  const ks = ORDER.map(k => KIND[k]);
  for (let i = 0; i < 8; i++) { const a = i * TAU / 8 + t * 0.4; planet(ks[i], PW / 2 + Math.cos(a) * 380, 760 + Math.sin(a) * 260, (i === 4 || i === 5 ? 46 : 34) * eob((st - i * 0.06) / 0.5), t, { tilt: 0.3 }); }
  emo('🚀', PW / 2, 760, 170, { scale: eob(st / 0.5), rot: Math.sin(t * 3) * 0.15 });
  txt('Planet mana yang', PW / 2, 470, 70, { scale: eob((st - 0.2) / 0.5), color: '#fff' });
  txt('PALING ANEH? 🤔', PW / 2, 1060, 84, { scale: eob((st - 0.6) / 0.5), color: '#ffd23f' });
  const fa = clamp((st - 1.6) / 0.3);
  pill('➕ FOLLOW', PW / 2, 1200, 70, { bg: '#ff2d55', fg: '#fff', alpha: fa, scale: eob((st - 1.6) / 0.5) * (1 + 0.05 * Math.sin(t * 6)) });
  txt('Fakta planet seru tiap hari!', PW / 2, 1340, 52, { alpha: clamp((st - 2.2) / 0.4) });
}

// ---------------------------------------------------------------- render utama
window.setShort = s => { SHORT = s; TL = s; PORTRAIT = true; };
window.renderShort = function (t) {
  performanceT = t;
  let sc = SHORT.scenes[0]; for (const s of SHORT.scenes) if (t >= s.start) sc = s;
  const st = t - sc.start;
  X.setTransform(1, 0, 0, 1, 0, 0); X.globalAlpha = 1; X.clearRect(0, 0, PW, PH);
  portraitBg(sc, t);
  if (sc.kind === 'cta') ctaScene(sc, st, t);
  else {
    const cam = camAt(sc, st); const s = PW / cam.w;
    X.save(); X.beginPath(); X.rect(0, BAND.y, PW, BAND.h); X.clip();
    X.translate(PW / 2, BAND.y + BAND.h / 2); X.scale(s, s); X.translate(-cam.cx, -cam.cy);
    NOBG = true; try { SCENES[sc.key](sc, st, t); } finally { NOBG = false; }
    X.restore();
  }
  header(t);
  captionsP(t);
  const fa = Math.max(clamp(1 - t / 0.25), clamp((t - (SHORT.duration - 0.5)) / 0.5));
  if (fa > 0) { X.fillStyle = `rgba(0,0,0,${fa})`; X.fillRect(0, 0, PW, PH); }
};
