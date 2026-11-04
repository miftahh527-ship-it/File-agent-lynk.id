// Thumbnail YouTube (16:9) & cover Shorts (9:16) — memakai ulang planet()/txt() dari engine.js.
const LOGO = new Image(); LOGO.src = 'assets/logo-badge.png';
function logoBadge(x, y, r, label = true, size = 44) {
  X.save(); X.shadowColor = 'rgba(0,0,0,0.5)'; X.shadowBlur = 20;
  X.fillStyle = '#9CC45E'; X.beginPath(); X.arc(x, y, r + 8, 0, TAU); X.fill(); X.restore();
  X.save(); X.beginPath(); X.arc(x, y, r, 0, TAU); X.clip(); X.drawImage(LOGO, x - r, y - r, 2 * r, 2 * r); X.restore();
  if (label) { txt('Let.', x + r + 24, y, size, { align: 'left', color: '#fff' }); X.font = FONT(size); const w = X.measureText('Let.').width; txt('growww', x + r + 24 + w, y, size, { align: 'left', color: '#9CC45E' }); }
}
function glowBg(cx, cy, rad, col) { const g = X.createRadialGradient(cx, cy, 0, cx, cy, rad); g.addColorStop(0, col); g.addColorStop(1, 'rgba(0,0,0,0)'); X.fillStyle = g; X.fillRect(0, 0, C.width, C.height); }
function coverBg(key) { const s = 1920 / 1080; X.save(); X.translate(540, 960); X.scale(s, s); X.translate(-960, -540); space(3, key, 0); X.restore(); }

const T = 2.0; // waktu beku untuk animasi prosedural
const THUMBS = {
  long: { w: 1920, h: 1080, draw() {
    space(T, 'intro', 0);
    glowBg(1450, 560, 900, 'rgba(120,70,255,0.45)');
    planet('sun', -120, 1180, 520, T);
    planet('jupiter', 1720, 1000, 290, T, { rot: 0.1 });
    planet('saturn', 1590, 400, 165, T, { tilt: 0.32, tiltRot: -0.22 });
    planet('earth', 1170, 860, 100, T, { rot: 0.62 });
    planet('mars', 1840, 120, 58, T);
    planet('neptune', 1230, 150, 52, T);
    planet('venus', 1300, 640, 54, T);
    planet('mercury', 1420, 760, 30, T);
    planet('uranus', 1880, 640, 46, T, { tiltRot: 98 * Math.PI / 180 });
    rocket(1010, 240, 160, -0.5, 1.4);
    txt('KELILING', 90, 260, 150, { align: 'left', color: '#fff', sw: 24 });
    txt('8 PLANET!', 70, 460, 225, { align: 'left', color: '#ffd23f', sw: 32 });
    txt('dalam 8 menit!', 100, 640, 92, { align: 'left', color: '#fff', sw: 16 });
    pill('✅ FAKTA ASLI NASA', 390, 790, 58, { bg: '#3ddc97', fg: '#10331f' });
    logoBadge(150, 960, 70, true, 54);
  } },
};
const SHORTC = [
  ['short01_matahari', 'matahari', '1,3 Juta Bumi', 'MUAT DI MATAHARI!', p => planet('sun', 540, 1010, 330, T)],
  ['short02_merkurius', 'merkurius', 'Siang Membara,', 'MALAM MEMBEKU!', p => { planet('mercury', 540, 1000, 300, T); X.save(); X.beginPath(); X.arc(540, 1000, 300, 0, TAU); X.clip(); X.fillStyle = 'rgba(255,110,30,0.35)'; X.fillRect(240, 700, 300, 600); X.fillStyle = 'rgba(40,70,220,0.45)'; X.fillRect(540, 700, 300, 600); X.restore(); txt('430°C', 300, 1400, 120, { color: '#ff8a5c' }); txt('−180°C', 790, 1400, 120, { color: '#8fe3ff' }); }],
  ['short03_venus', 'venus', '1 HARI > 1 TAHUN?!', 'di Venus 🤯', p => planet('venus', 540, 1010, 320, T)],
  ['short04_bumi', 'bumi', 'Satu-satunya', 'PLANET BERPENGHUNI', p => { planet('earth', 540, 1010, 320, T, { rot: 0.62 }); ['🐳', '🌳', '🦒', '🐦', '🌻', '🦋'].forEach((e, i) => { const a = i * TAU / 6 - 0.4; emo(e, 540 + Math.cos(a) * 430, 1010 + Math.sin(a) * 400, 100); }); }],
  ['short05_mars', 'mars', 'Mars Itu', 'BERKARAT?! 🔩', p => planet('mars', 540, 1010, 320, T)],
  ['short06_jupiter', 'jupiter', 'Badai Lebih Besar', 'DARI BUMI! 🌀', p => { planet('jupiter', 540, 1010, 340, T, { rot: 0.2 }); planet('earth', 820, 1300, 90, T); }],
  ['short07_saturnus', 'saturnus', 'Planet yang Bisa', 'MENGAPUNG! 🛁', p => { planet('saturn', 540, 960, 230, T, { tilt: 0.3, tiltRot: -0.15 }); X.fillStyle = 'rgba(76,201,240,0.85)'; X.beginPath(); X.moveTo(0, 1920); for (let k = 0; k <= 20; k++) X.lineTo(k * 54, 1110 + Math.sin(k * 0.8) * 18); X.lineTo(1080, 1920); X.fill(); }],
  ['short08_uranus', 'uranus', 'Planet yang', 'REBAHAN! 😴', p => planet('uranus', 540, 1010, 300, T, { tiltRot: 98 * Math.PI / 180 })],
  ['short09_neptunus', 'neptunus', 'Angin 2.000 km/jam!', 'PALING BERANGIN 💨', p => { for (let i = 0; i < 14; i++) { const y = 700 + i * 50, x = (i * 173) % 900; X.strokeStyle = 'rgba(200,220,255,0.55)'; X.lineWidth = 6; X.lineCap = 'round'; X.beginPath(); X.moveTo(x - 200, y); X.lineTo(x + 150, y); X.stroke(); } planet('neptune', 540, 1010, 320, T); }],
  ['short10_kuis', 'kuis', 'KUIS PLANET 🧠', 'BERAPA SKORMU?', p => { const ks = ORDER.map(k => KIND[k]); ks.forEach((k, i) => { const a = i * TAU / 8 - Math.PI / 2; planet(k, 540 + Math.cos(a) * 330, 1010 + Math.sin(a) * 330, k === 'jupiter' || k === 'saturn' ? 75 : 55, T, { tilt: 0.3 }); }); txt('?', 540, 1020, 330, { color: '#ffd23f', sw: 40 }); }],
];
for (const [name, key, l1, l2, art] of SHORTC) THUMBS[name] = { w: 1080, h: 1920, draw() {
  if (key === 'kuis') { X.save(); X.translate(540, 960); X.scale(1.78, 1.78); X.translate(-960, -540); quizBg(3); X.restore(); } else coverBg(key);
  glowBg(540, 1000, 700, 'rgba(255,255,255,0.10)');
  art();
  const fit = (s, base) => { X.font = FONT(base); const w = X.measureText(s).width; return Math.min(base, base * 980 / w); };
  txt(l1, 540, 330, fit(l1, 104), { color: '#fff', sw: 18 });
  txt(l2, 540, 480, fit(l2, 130), { color: '#ffd23f', sw: 22 });
  pill('Sumber: NASA', 540, 1560, 46, { bg: '#ffffff', fg: '#1d1147' });
  logoBadge(390, 1700, 52, true, 50);
} };

window.renderThumb = name => { const th = THUMBS[name]; C.width = th.w; C.height = th.h; X.setTransform(1, 0, 0, 1, 0, 0); th.draw(); };
window.thumbNames = () => Object.keys(THUMBS);
window.logoReady = () => new Promise(r => LOGO.complete ? r() : (LOGO.onload = r));
