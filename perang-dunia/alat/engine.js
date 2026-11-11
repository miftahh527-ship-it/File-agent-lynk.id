/* Mesin animasi "Perang Dunia" — satu dunia peta yang disusuri kamera + benda layar yang menumpuk per frasa.
   Semua gerak adalah fungsi murni tl.time() (deterministik). Data: window.CFG (dibuat alat/build.mjs). */
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const CFG = window.CFG, W = CFG.W, H = CFG.H, DUR = CFG.DUR, MODE = CFG.mode, TEGAK = H > W;
const el = (tag, cls, html, par) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; (par || ov).appendChild(e); return e; };
const stage = $('#stage'), world = $('#world'), ov = $('#ov'), svg = $('#peta'), NS = 'http://www.w3.org/2000/svg';
stage.style.width = W + 'px'; stage.style.height = H + 'px';
function fit() { const s = Math.min(innerWidth / W, innerHeight / H); stage.style.transform = `translate(-50%,-50%) scale(${s})`; }
addEventListener('resize', fit); fit();

/* ---------- peta ---------- */
const M = window.MAP, RAD = Math.PI / 180;
const proj = ([lon, lat]) => [M.W / 2 + M.R * RAD * (((lon - 150 + 540) % 360) - 180), M.Y0 - M.R * Math.log(Math.tan(Math.PI / 4 + lat * RAD / 2))];
const gL = document.createElementNS(NS, 'g'); svg.appendChild(gL);
const NEG = {};
for (const c of M.negara) { const p = document.createElementNS(NS, 'path'); p.setAttribute('d', c.d); p.setAttribute('class', 'land'); gL.appendChild(p); NEG[c.n] = p; }
const gA = document.createElementNS(NS, 'g'); svg.appendChild(gA);
const mkL = $('#mk');
const css = getComputedStyle(document.documentElement), V = n => css.getPropertyValue(n).trim();
const COL = { land: V('--land'), a: V('--ha'), b: V('--hb'), c: V('--hc') };

const tl = gsap.timeline({ paused: true });
const EIN = MODE === 'a' ? 'power4.out' : 'power2.out';

/* ---------- kamera ---------- */
const C = { x: 2000, y: 1100, z: .5 }, FX = { v: .5 }, FY = TEGAK ? .30 : .47;
function applyCam() {
  world.style.transform = `translate(${W * FX.v - C.x * C.z}px,${H * FY - C.y * C.z}px) scale(${C.z})`;
  world.style.setProperty('--iz', 1 / C.z);
}
const ZK = TEGAK ? .62 : 1;                      // format tegak: sedikit lebih lebar supaya wilayahnya muat
const camTo = (at, cam, dur, ease) => { const [x, y] = proj(cam); tl.to(C, { x, y, z: cam[2] * ZK, duration: dur, ease, onUpdate: applyCam }, at); };

/* ---------- lapisan tetap: tag bagian, penunjuk tahun, peredup peta, kartu babak ---------- */
const dim = $('#dim');
const tag = el('div', 'tag fix'), yrB = el('div', 'yr fix', '<i>TAHUN</i><b>1914</b>'), yrN = $('b', yrB);
const card = el('div', 'card fix', '<i></i><b></b>');
let yrNow = null, yrOn = false;

/* ---------- pembantu masuk/keluar ---------- */
const inn = (e, at, kind) => {
  if (kind === 'cap') { tl.fromTo(e, { opacity: 0, yPercent: 35 }, { opacity: 1, yPercent: 0, duration: .5, ease: EIN, immediateRender: false }, at);
    $$('.hl i', e).forEach((h, i) => tl.fromTo(h, { scaleX: 0 }, { scaleX: 1, duration: .45, ease: 'power3.out', immediateRender: false }, at + .35 + i * .2)); return; }
  if (MODE === 'a') tl.fromTo(e, { opacity: 0, x: -46, clipPath: 'inset(0 100% 0 0)' }, { opacity: 1, x: 0, clipPath: 'inset(0 0% 0 0)', duration: .45, ease: 'power4.out', immediateRender: false }, at);
  else tl.fromTo(e, { opacity: 0, scale: 1.22, rotate: -2.5 }, { opacity: 1, scale: 1, rotate: 0, duration: .34, ease: 'power4.in', immediateRender: false }, at);
};
const out = (e, at) => tl.to(e, { opacity: 0, y: MODE === 'a' ? 0 : -18, x: MODE === 'a' ? -30 : 0, duration: .28, ease: 'power2.in' }, at);
const capHTML = s => s.replace(/\*(.+?)\*/g, '<span class="hl"><i></i>$1</span>').replace(/!(.+?)!/g, '<span class="hl r"><i></i>$1</span>');
const fmtN = n => Math.round(n).toLocaleString('id-ID');
const ICON = n => `<svg class="ic" viewBox="0 0 24 24"><use href="#i-${n}"/></svg>`;

/* ---------- tata letak ---------- */
const L = TEGAK
  ? { m: 70, capTop: 1330, capW: 870, rowY: 600, rowH: 620, numY: 640 }
  : { m: 96, capTop: 812, capW: 1500, rowY: 250, rowH: 420, numY: 250 };
function layoutItems(nodes, side) {
  const n = nodes.length;
  if (TEGAK) {                                   // kisi 2 kolom (1 kolom bila ≤ 2), di bawah titik fokus peta
    const cols = n <= 2 ? 1 : 2, tw = cols === 1 ? 560 : 420, th = n > 6 ? 200 : 230, gap = 28, rows = Math.ceil(n / cols);
    const top = (side ? 760 : 560) + Math.max(0, (3 - rows)) * 40;
    nodes.forEach((e, i) => { const r = Math.floor(i / cols), c = i % cols, inRow = (r === rows - 1 && n % cols) ? n % cols : cols;
      const x0 = (W - 70 - (inRow * tw + (inRow - 1) * gap)) / 2 + (cols === 2 ? 0 : 35);
      e.style.cssText += `left:${x0 + c * (tw + gap)}px;top:${top + r * (th + gap)}px;width:${tw}px;height:${th}px`; e.classList.add('tile'); });
    return;
  }
  if (side) { const h = 128, gap = 22, tot = n * h + (n - 1) * gap, top = 190 + Math.max(0, (560 - tot) / 2);
    nodes.forEach((e, i) => { e.style.cssText += `left:1290px;top:${top + i * (h + gap)}px;width:534px;height:${h}px`; e.classList.add('rowi'); }); return; }
  const per = n > 5 ? Math.ceil(n / 2) : n, rows = Math.ceil(n / per), tw = per >= 5 ? 320 : 400, th = rows > 1 ? 236 : 340, gap = per >= 5 ? 30 : 48;
  const top = L.rowY + (L.rowH + 60 - (rows * th + (rows - 1) * 34)) / 2;
  nodes.forEach((e, i) => { const r = Math.floor(i / per), c = i % per, inRow = r === rows - 1 ? n - per * (rows - 1) : per;
    const x0 = (W - (inRow * tw + (inRow - 1) * gap)) / 2;
    e.style.cssText += `left:${x0 + c * (tw + gap)}px;top:${top + r * (th + 34)}px;width:${tw}px;height:${th}px`; e.classList.add('tile'); });
}

/* ---------- bangun timeline dari beat ---------- */
const mapState = {};                              // negara → kelompok sorotan saat ini
function setHi(at, hi) {
  const want = {}; if (hi) for (const g of ['a', 'b', 'c']) for (const n of (hi[g] || [])) want[n] = g;
  for (const n of new Set([...Object.keys(mapState), ...Object.keys(want)])) {
    if (mapState[n] === want[n]) continue; const p = NEG[n]; if (!p) continue;
    tl.to(p, { fill: want[n] ? COL[want[n]] : COL.land, duration: .7, ease: 'power2.out' }, at);
    if (want[n]) mapState[n] = want[n]; else delete mapState[n];
  }
}
let dimNow = 0, fxNow = .5;
const B = CFG.beats;
tl.set(C, { x: proj(B[0].cam)[0], y: proj(B[0].cam)[1], z: B[0].cam[2] * ZK * .82, onUpdate: applyCam }, 0);
tl.fromTo('#world', { opacity: 0 }, { opacity: 1, duration: 1.1, ease: 'power2.out' }, 0);

let group = null;                                  // benda yang bertahan lintas beat (keep)
B.forEach((b, bi) => {
  const t0 = b.t0, t1 = b.t1, nxt = B[bi + 1], keepNext = nxt && nxt.keep && !nxt.card;
  /* kartu babak */
  if (b.card) {
    const c = card.cloneNode(true); c.innerHTML = `<i>${b.card.n}</i><b>${b.card.t}</b>`; ov.appendChild(c);
    tl.to(dim, { opacity: .86, duration: .5 }, b.card.at); dimNow = .86;
    tl.fromTo(c, { opacity: 0, scale: MODE === 'a' ? 1 : 1.12 }, { opacity: 1, scale: 1, duration: .5, ease: EIN, immediateRender: false }, b.card.at + .2);
    tl.fromTo($('b', c), { yPercent: 40, opacity: 0 }, { yPercent: 0, opacity: 1, duration: .6, ease: 'power3.out', immediateRender: false }, b.card.at + .45);
    tl.to(c, { opacity: 0, duration: .35 }, t0 - .45);
  }
  /* tag bagian */
  if (b.tag != null) { const tg = tag.cloneNode(); tg.textContent = b.tag; ov.appendChild(tg); inn(tg, t0 - .1); if (b.tagEnd) out(tg, b.tagEnd - .3); }
  /* kamera: meluncur di awal beat, lalu mengapung pelan sampai beat berikutnya */
  const side = !!b.side && !TEGAK, fx = side ? .36 : .5;
  if (fx !== fxNow) { tl.to(FX, { v: fx, duration: 1.4, ease: 'sine.inOut', onUpdate: applyCam }, t0 - .3); fxNow = fx; }
  if (bi > 0 || true) { const d = Math.min(1.9, Math.max(1.1, (t1 - t0) * .45)); camTo(Math.max(0, t0 - .35), b.cam, d, MODE === 'a' ? 'power3.inOut' : 'sine.inOut');
    const s = t0 - .35 + d; if (t1 - s > .6) camTo(s, [b.cam[0] + 1.2 / b.cam[2], b.cam[1], b.cam[2] * 1.06], t1 - s - .35, 'sine.inOut'); }
  /* peta: sorotan */
  if (b.hi !== undefined) setHi(t0, b.hi);
  /* penunjuk tahun */
  if (b.yr !== undefined) {
    if (b.yr === null) { if (yrOn) { out(yrB, t0); yrOn = false; } }
    else { if (!yrOn) { tl.set(yrN, { textContent: b.yr }, t0 - .05); inn(yrB, t0); yrOn = true; }
      else if (yrNow !== b.yr) { const o = { v: yrNow }; tl.to(o, { v: b.yr, duration: 1.1, ease: 'power2.inOut', onUpdate() { yrN.textContent = Math.round(o.v); } }, t0); }
      yrNow = b.yr; }
  }
  /* kalimat layar */
  if (b.cap) { const c = el('div', 'cap', capHTML(b.cap)); c.style.cssText = `left:${L.m}px;top:${L.capTop}px;max-width:${L.capW}px`; b._cap = c; inn(c, t0 + .12, 'cap'); out(c, t1 - .3); }
  /* benda (ikon/huruf besar) — menumpuk per frasa */
  const boardish = (b.it && !b.side) || b.num || b.bars;
  const wantDim = boardish ? (MODE === 'a' ? .62 : .66) : (b.it && TEGAK ? .4 : 0);
  if (wantDim !== dimNow || b.card) { tl.to(dim, { opacity: wantDim, duration: .6, ease: 'power2.out' }, t0 - .1); dimNow = wantDim; }
  if (b.it) {
    if (!b.keep || !group) group = { nodes: [], side: b.side, end: t1 };
    const fresh = b.it.map(it => { const e = el('div', 'it' + (it.big ? ' big' : ''), (it.big ? `<span class="bg">${it.big}</span>` : ICON(it.ic)) + (it.t ? `<span class="lb">${it.t}</span>` : '')); e._at = it.at; return e; });
    group.nodes.push(...fresh); group.fresh = fresh; group.end = t1; b._g = group;
    fresh.forEach((e, i) => inn(e, e._at != null ? e._at : t0 + .4 + i * .45));
    if (!keepNext) { const g = group; layoutItems(g.nodes, g.side); g.nodes.forEach((e, i) => out(e, t1 - .32 + i * .02)); group = null; }
  } else if (!keepNext && group) { layoutItems(group.nodes, group.side); group.nodes.forEach(e => out(e, t1 - .32)); group = null; }
  /* angka besar */
  if (b.num) { const n = b.num, e = el('div', 'num', `<b>${n.pre || ''}<span>0</span>${n.suf || ''}</b><i>${n.label || ''}</i>`); e.style.top = L.numY + 'px';
    const sp = $('span', e), o = { v: n.from != null ? n.from : 0 }, f = n.plain ? (v => Math.round(v)) : fmtN; sp.textContent = f(o.v);
    const at = n.at != null ? n.at : t0 + .5; inn(e, at - .25); tl.to(o, { v: n.to, duration: 1.4, ease: 'power2.out', onUpdate() { sp.textContent = f(o.v); } }, at); out(e, t1 - .3); }
  /* batang banding */
  if (b.bars) { const max = Math.max(...b.bars.map(x => x.v)), e = el('div', 'bars'); e.style.top = (L.numY + 20) + 'px';
    b.bars.forEach((x, i) => { const r = el('div', 'bar', `<i>${x.t}</i><u><s></s></u><b>${x.lab}</b>`, e); tl.fromTo($('s', r), { scaleX: 0 }, { scaleX: x.v / max, duration: 1.3, ease: 'power3.out', immediateRender: false }, t0 + 1 + i * 1.4);
      tl.fromTo($('b', r), { opacity: 0 }, { opacity: 1, duration: .4, immediateRender: false }, t0 + 1.9 + i * 1.4); });
    inn(e, t0 + .4); out(e, t1 - .3); }
  /* penanda peta */
  const endMk = keepNext ? null : t1 - .3;
  (b.mk || []).forEach((m, i) => { const [x, y] = proj(m.p), e = el('div', 'mk', `<u></u><span>${m.t}</span>`, mkL); e.style.left = x + 'px'; e.style.top = y + 'px';
    const at = m.at != null ? m.at : t0 + .5 + i * .35;
    tl.fromTo(e, { opacity: 0 }, { opacity: 1, duration: .35, immediateRender: false }, at);
    tl.fromTo($('u', e), { scale: 0 }, { scale: 1, duration: .5, ease: 'back.out(2.4)', immediateRender: false }, at);
    b._mk = (b._mk || []).concat(e); });
  (b.ar || []).forEach((a, i) => { const [x1, y1] = proj(a.f), [x2, y2] = proj(a.t), mx = (x1 + x2) / 2, my = (y1 + y2) / 2, dx = x2 - x1, dy = y2 - y1, k = a.c === 'parit' ? 0 : .18;
    const p = document.createElementNS(NS, 'path'); p.setAttribute('d', `M${x1} ${y1}Q${mx - dy * k} ${my + dx * k} ${x2} ${y2}`); p.setAttribute('class', 'ar ' + (a.c || '')); p.setAttribute('pathLength', '1');
    gA.appendChild(p);
    const at = a.at != null ? a.at : t0 + .6 + i * .4;
    if (a.c !== 'parit') { const ang = Math.atan2(y2 - (my + dx * k), x2 - (mx - dy * k)) * 180 / Math.PI, h = el('div', 'ah', '<u></u>', mkL); h.style.left = x2 + 'px'; h.style.top = y2 + 'px'; $('u', h).style.transform = `rotate(${ang}deg)`;
      tl.fromTo(h, { opacity: 0 }, { opacity: 1, duration: .25, immediateRender: false }, at + .7); b._mk = (b._mk || []).concat(h); }
    tl.fromTo(p, { strokeDasharray: 1, strokeDashoffset: 1, opacity: 0 }, { strokeDashoffset: 0, opacity: 1, duration: .9, ease: 'power2.inOut', immediateRender: false }, at);
    b._mk = (b._mk || []).concat(p); });
  /* penanda & panah keluar di akhir kelompok */
  if (!keepNext) { let k = bi; const all = []; while (k >= 0) { all.push(...(B[k]._mk || [])); if (!B[k].keep) break; k--; } if (all.length) tl.to(all, { opacity: 0, duration: .3 }, t1 - .32); }
});
tl.to('#world', { opacity: .0, duration: .01 }, DUR + 5);
tl.to({}, { duration: .01 }, DUR);

/* kalimat layar: kecilkan huruf bila tidak muat */
document.fonts.ready.then(() => $$('.cap').forEach(c => { const lim = TEGAK ? 250 : 150; let fs = parseFloat(getComputedStyle(c).fontSize), n = 0; while (c.scrollHeight > lim * 1.15 && n++ < 14) { fs *= .93; c.style.fontSize = fs + 'px'; } }));

/* latar hidup */
if (MODE === 'a') tl.fromTo('#sweep', { x: -800 }, { x: W + 600, duration: 9, ease: 'none', repeat: Math.ceil(DUR / 9) }, 0);
else tl.fromTo('#vig', { backgroundPosition: '40% 40%' }, { backgroundPosition: '60% 55%', duration: 14, ease: 'sine.inOut', yoyo: true, repeat: Math.ceil(DUR / 14) }, 0);
