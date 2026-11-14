/* ---------- adegan layar penuh: foto arsip & grafik gerak (bukan peta) ----------
   Beat boleh punya `sc` = { t: jenis, id?: nama, ... }. Beat berikutnya dengan id yang sama MELANJUTKAN adegan
   (elemen baru ditambahkan, tanpa keluar-masuk). Semua waktu (`at`) sudah dihitung build.mjs dari kata kunci `k`. */
const scL = $('#sc'), SVGNS = NS;
const svgEl = (tag, attrs, par) => { const e = document.createElementNS(SVGNS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); if (par) par.appendChild(e); return e; };
const div = (cls, html, par) => { const e = document.createElement('div'); e.className = cls; if (html != null) e.innerHTML = html; par.appendChild(e); return e; };
const P = (x, y) => TEGAK ? [x * W, y * H] : [x * W, y * H];
let SC = null;                                                   // adegan aktif { id, el, t, st }

function scEnd(bi) { let k = bi, id = B[bi].sc.id; while (id && B[k + 1] && B[k + 1].sc && B[k + 1].sc.id === id) k++; return B[k].t1; }
function scIn(d, at) { tl.fromTo(d, { opacity: 0, clipPath: 'inset(0 100% 0 0)' }, { opacity: 1, clipPath: 'inset(0 0% 0 0)', duration: .55, ease: 'power3.inOut', immediateRender: false }, at); }
function scOut(d, at) { tl.to(d, { opacity: 0, duration: .4, ease: 'power2.in' }, at); }

function SCENE(b, bi) {
  const s = b.sc, cont = SC && s && s.id && SC.id === s.id;
  if (SC && !cont) { scOut(SC.el, b.t0 - .35); SC = null; }
  if (!s) return;
  const end = scEnd(bi);
  if (!cont) { const el = div('scn ' + s.t + (s.bingkai ? ' bingkai' : '') + (s.portret ? ' portret' : '') + (b.side ? ' sisi' : ''), null, scL); SC = { id: s.id, el, t: s.t, st: {} }; scIn(el, b.t0 - .15); SC.end = end;
    if (!B[bi + 1] || !(B[bi + 1].sc && s.id && B[bi + 1].sc.id === s.id)) { /* keluar diatur oleh beat berikutnya */ } }
  (BUILD[s.t] || (() => 0))(s, SC.el, b, cont, SC.st, end);
  if (!B[bi + 1]) scOut(SC.el, b.t1 - .3);
}

const BUILD = {
  /* foto arsip: penuh layar atau berbingkai, gerak Ken Burns pelan */
  foto(s, d, b, cont, st, end) {
    if (cont) return;
    const box = div('fbox', `<img src="../../foto/${s.src}" alt="">`, d), img = $('img', box);
    if (s.pos) img.style.objectPosition = s.pos;
    if (s.label) div('flab', s.label, box);
    if (s.kr) div('kr', 'FOTO · ' + s.kr, d);
    const z = s.z || 'in', dur = end - b.t0 + .8;
    const from = z === 'in' ? { scale: 1.02, xPercent: -1 } : z === 'out' ? { scale: 1.14, xPercent: 1 } : z === 'kiri' ? { scale: 1.1, xPercent: 3 } : { scale: 1.1, xPercent: -3 };
    const to = z === 'in' ? { scale: 1.13, xPercent: 1 } : z === 'out' ? { scale: 1.02, xPercent: -1 } : z === 'kiri' ? { scale: 1.1, xPercent: -3 } : { scale: 1.1, xPercent: 3 };
    tl.fromTo(img, from, { ...to, duration: dur, ease: 'none', immediateRender: false }, b.t0 - .2);
    if (s.bingkai) tl.fromTo(box, { y: 40, rotate: -1.2 }, { y: 0, rotate: 0, duration: .8, ease: 'power3.out', immediateRender: false }, b.t0 - .1);
  },

  /* kartu tokoh: potret + nama + keterangan */
  orang(s, d, b) {
    const n = s.org.length;
    s.org.forEach((o, i) => {
      const c = div('org', `<div class="pf"><img src="../../foto/${o.src}" alt=""${o.pos ? ` style="object-position:${o.pos}"` : ''}></div><b>${o.nama}</b><i>${o.ket}</i>`, d);
      const cw = TEGAK ? 600 : 470, gap = 60, x0 = b.side && !TEGAK ? 150 + i * (cw + gap) : (W - (n * cw + (n - 1) * gap)) / 2 + i * (cw + gap);
      c.style.cssText = `left:${x0}px;top:${TEGAK ? 300 + i * 40 : 120}px;width:${cw}px`;
      const at = o.at != null ? o.at : b.t0 + .2 + i * .6;
      tl.fromTo(c, { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: .6, ease: 'power3.out', immediateRender: false }, at);
      tl.fromTo($('img', c), { scale: 1.18 }, { scale: 1.02, duration: (b.t1 - at) + .5, ease: 'none', immediateRender: false }, at);
      tl.fromTo($('b', c), { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: .5, ease: 'power3.out', immediateRender: false }, at + .35);
    });
  },

  /* rantai domino: tiap baris = satu deklarasi perang, kepingnya jatuh berurutan */
  domino(s, d, b, cont, st) {
    if (!cont) { st.n = 0; st.list = div('dlist', null, d); }
    s.ev.forEach((e, j) => {
      const i = st.n++, row = div('drow', `<span class="dp"><u></u></span><time>${e.d}</time><b>${e.a}</b><em>menyatakan perang ke</em><b class="tg">${e.b}</b>`, st.list);
      const top = TEGAK ? 470 + i * 178 : 200 + i * 148; row.style.top = top + 'px';
      const at = e.at != null ? e.at : b.t0 + .4 + j * 1.2;
      tl.fromTo(row, { opacity: 0, x: -60 }, { opacity: 1, x: 0, duration: .45, ease: 'power3.out', immediateRender: false }, at);
      tl.fromTo($('u', row), { rotate: 0, backgroundColor: '#FFD400' }, { rotate: -80, backgroundColor: '#E8402F', duration: .55, ease: 'power2.in', immediateRender: false }, at + .3);
      tl.fromTo($('.tg', row), { color: '#F5F2EA' }, { color: '#E8402F', duration: .3, immediateRender: false }, at + .8);
    });
  },

  /* grafik garis (linear atau logaritmik) yang tergambar pelan */
  garis(s, d, b) {
    const X0 = TEGAK ? 240 : 300, X1 = TEGAK ? 960 : 1640, Y0 = TEGAK ? 640 : 290, Y1 = TEGAK ? 1180 : 720;
    div('gj', s.judul, d).style.cssText = `left:${TEGAK ? 70 : 96}px;top:${TEGAK ? 440 : 170}px`;
    const g = svgEl('svg', { width: W, height: H, viewBox: `0 0 ${W} ${H}`, class: 'gsvg' }, d);
    const xs = s.d.map(p => p[0]), xmin = s.x0 ?? Math.min(...xs), xmax = s.x1 ?? Math.max(...xs);
    const f = s.log ? (v => Math.log10(v)) : (v => v), ys = s.d.map(p => f(p[1])), ymin = s.log ? Math.floor(Math.min(...ys)) : 0, ymax = s.log ? Math.ceil(Math.max(...ys)) : (s.ymax || Math.max(...ys) * 1.1);
    const px = x => X0 + (x - xmin) / (xmax - xmin) * (X1 - X0), py = v => Y1 - (f(v) - ymin) / (ymax - ymin) * (Y1 - Y0);
    (s.grid || []).forEach(([v, lab]) => { svgEl('line', { x1: X0, x2: X1, y1: py(v), y2: py(v), class: 'gg' }, g); const t = svgEl('text', { x: X0 - 18, y: py(v) + 9, class: 'gyl', 'text-anchor': 'end' }, g); t.textContent = lab; });
    svgEl('line', { x1: X0, x2: X1, y1: Y1, y2: Y1, class: 'gax' }, g);
    (s.xt || []).forEach(([x, lab]) => { svgEl('line', { x1: px(x), x2: px(x), y1: Y1, y2: Y1 + 14, class: 'gax' }, g); const t = svgEl('text', { x: px(x), y: Y1 + 52, class: 'gxl', 'text-anchor': 'middle' }, g); t.textContent = lab; });
    const pts = s.d.map(p => [px(p[0]), py(p[1])]), dd = 'M' + pts.map(p => p.join(' ')).join('L');
    const area = svgEl('path', { d: dd + `L${pts[pts.length - 1][0]} ${Y1}L${pts[0][0]} ${Y1}Z`, class: 'garea' }, g);
    const ln = svgEl('path', { d: dd, class: 'gln', pathLength: 1 }, g);
    const at = s.at != null ? s.at : b.t0 + .6, dur = Math.min(s.dur || 4, b.t1 - at - 1.2);
    tl.fromTo(ln, { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: dur, ease: s.ease || 'power1.in', immediateRender: false }, at);
    tl.fromTo(area, { opacity: 0 }, { opacity: 1, duration: dur, ease: 'power1.in', immediateRender: false }, at);
    (s.titik || []).forEach(([x, v, lab, kanan], i) => {
      const [cx, cy] = [px(x), py(v)], tt = at + dur * ((x - xmin) / (xmax - xmin)) ** (s.ease === 'none' ? 1 : .55);
      const c = svgEl('circle', { cx, cy, r: 11, class: 'gdot' }, g);
      const lb = div('glab' + (kanan ? ' kn' : ''), lab, d); lb.style.cssText = `left:${cx + (kanan ? 26 : -26)}px;top:${cy - 34}px`;
      tl.fromTo(c, { scale: 0, transformOrigin: `${cx}px ${cy}px` }, { scale: 1, duration: .3, ease: 'back.out(3)', immediateRender: false }, Math.min(tt, at + dur));
      tl.fromTo(lb, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: .35, immediateRender: false }, Math.min(tt, at + dur) + .1);
    });
    if (s.sumber) div('gs', 'SUMBER: ' + s.sumber, d);
  },

  /* garis waktu mendatar; peristiwa muncul satu per satu, kepala waktu bergerak */
  waktu(s, d, b, cont, st) {
    const X0 = TEGAK ? 110 : 170, X1 = TEGAK ? 970 : 1750, Y = TEGAK ? 860 : 560;
    if (!cont) {
      st.px = y => X0 + (y - s.a) / (s.b - s.a) * (X1 - X0); st.n = 0;
      st.g = svgEl('svg', { width: W, height: H, viewBox: `0 0 ${W} ${H}`, class: 'gsvg' }, d);
      const base = svgEl('line', { x1: X0, x2: X1, y1: Y, y2: Y, class: 'wax', pathLength: 1 }, st.g);
      tl.fromTo(base, { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1, ease: 'power2.out', immediateRender: false }, b.t0);
      for (let y = Math.ceil(s.a / 10) * 10; y <= s.b; y += (s.step || 10)) { svgEl('line', { x1: st.px(y), x2: st.px(y), y1: Y - 10, y2: Y + 10, class: 'wtk' }, st.g);
        const t = div('wyl', y, d); t.style.cssText = `left:${st.px(y)}px;top:${Y + 26}px`; }
      st.head = div('whead', '<u></u>', d); st.head.style.cssText = `left:${st.px(s.a)}px;top:${Y}px`; st.hx = s.a;
    }
    (s.ev || []).forEach((e, j) => {
      const at = e.at != null ? e.at : b.t0 + .5 + j * 1.2, i = st.n++, up = i % 2 === 0, x = st.px(e.y);
      if (e.y1) {   // rentang
        const r = div('wspan', `<span>${e.t}</span>`, d); r.style.cssText = `left:${x}px;width:${st.px(e.y1) - x}px;top:${Y - (TEGAK ? 380 : 330)}px`;
        tl.fromTo(r, { clipPath: 'inset(0 100% 0 0)', opacity: 1 }, { clipPath: 'inset(0 0% 0 0)', duration: 1.4, ease: 'power2.inOut', immediateRender: false }, at);
        tl.fromTo(r, { opacity: 0 }, { opacity: 1, duration: .01, immediateRender: false }, at);
        return;
      }
      const m = div('wev' + (up ? ' up' : ' dn') + (e.c ? ' ' + e.c : ''), `<u></u><b>${e.ty || e.y}</b><span>${e.t}</span>`, d); m.style.cssText = `left:${x}px;top:${Y}px`;
      tl.to(st.head, { left: x, duration: .7, ease: 'power2.inOut' }, at - .2);
      tl.fromTo(m, { opacity: 0, y: up ? 24 : -24 }, { opacity: 1, y: 0, duration: .45, ease: 'power3.out', immediateRender: false }, at + .3);
    });
  },

  /* Jam Kiamat: seperempat jam, jarum bergerak lewat tahun-tahun penting */
  jam(s, d, b) {
    const cx = TEGAK ? 900 : 1190, cy = TEGAK ? 1150 : 760, R = TEGAK ? 640 : 560;
    const g = svgEl('svg', { width: W, height: H, viewBox: `0 0 ${W} ${H}`, class: 'gsvg' }, d);
    svgEl('path', { d: `M${cx - R} ${cy}A${R} ${R} 0 0 1 ${cx} ${cy - R}L${cx} ${cy}Z`, class: 'jface' }, g);
    for (let m = 0; m <= 15; m++) { const a = (-90 - m * 6) * Math.PI / 180, r1 = m % 5 ? R - 34 : R - 70;
      svgEl('line', { x1: cx + Math.cos(a) * r1, y1: cy + Math.sin(a) * r1, x2: cx + Math.cos(a) * (R - 8), y2: cy + Math.sin(a) * (R - 8), class: m % 5 ? 'jt' : 'jt5' }, g); }
    const hand = svgEl('line', { x1: cx, y1: cy, x2: cx, y2: cy - R + 90, class: 'jh' }, g);
    svgEl('circle', { cx, cy, r: 20, class: 'jc' }, g);
    const info = div('jinfo', '<i>JAM KIAMAT</i><b>1947</b><span>7 menit</span><em>menuju tengah malam</em>', d);
    info.style.cssText = TEGAK ? 'left:70px;top:420px' : 'left:96px;top:250px';
    const yB = $('b', info), vS = $('span', info);
    const rot = sec => -(sec / 3600) * 360;
    tl.set(hand, { rotate: rot(s.lang[0][1]), svgOrigin: `${cx} ${cy}` }, b.t0);
    let t = s.at != null ? s.at : b.t0 + .8;
    s.lang.forEach(([yr, sec, lab], i) => {
      if (i) tl.to(hand, { rotate: rot(sec), svgOrigin: `${cx} ${cy}`, duration: .9, ease: 'power3.inOut' }, t);
      tl.call(() => {}, null, t);
      tl.set(yB, { textContent: yr }, t + .2); tl.set(vS, { textContent: lab }, t + .2);
      tl.fromTo(info, { x: -12 }, { x: 0, duration: .3, immediateRender: false }, t + .2);
      t += i === s.lang.length - 2 ? 2.2 : 1.55;
    });
    tl.to(hand, { stroke: '#E8402F', duration: .4 }, t - 1.4);
  },

  /* diagram aliansi: dua kubu saling berhadapan */
  aliansi(s, d, b) {
    const side = (sd, kanan, i0) => {
      const col = div('akol' + (kanan ? ' kn' : ''), `<h4>${sd.j}</h4>`, d);
      col.style.cssText = TEGAK ? `left:70px;right:70px;top:${kanan ? 1030 : 330}px` : `${kanan ? 'right' : 'left'}:150px;top:230px;width:620px`;
      const at = sd.at != null ? sd.at : b.t0 + .4 + i0;
      tl.fromTo(col, { opacity: 0, x: TEGAK ? 0 : (kanan ? 60 : -60) }, { opacity: 1, x: 0, duration: .5, ease: 'power3.out', immediateRender: false }, at);
      sd.n.forEach((n, i) => { const p = div('anode', n, col); tl.fromTo(p, { opacity: 0, scale: .7 }, { opacity: 1, scale: 1, duration: .35, ease: 'back.out(2)', immediateRender: false }, at + .3 + i * .28); });
    };
    side(s.kiri, false, 0); side(s.kanan, true, 1.4);
    const vs = div('avs', 'VS', d); vs.style.cssText = TEGAK ? 'left:0;right:0;top:880px' : 'left:0;right:0;top:400px';
    tl.fromTo(vs, { opacity: 0, scale: 2.2 }, { opacity: 1, scale: 1, duration: .4, ease: 'power4.in', immediateRender: false }, (s.kanan.at != null ? s.kanan.at : b.t0 + 1.8) + .8);
  },

  /* checklist bercentang */
  cek(s, d, b, cont, st) {
    if (!cont) { st.n = 0; const h = div('cj', s.j, d); h.style.cssText = TEGAK ? 'left:70px;top:440px' : 'left:150px;top:170px'; tl.fromTo(h, { opacity: 0 }, { opacity: 1, duration: .4, immediateRender: false }, b.t0); }
    const per = TEGAK ? 99 : 6;
    s.n.forEach((it, j) => {
      const i = st.n++, col = Math.floor(i / per), row = i % per;
      const r = div('crow', `<span class="cb"><svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" pathLength="1"/></svg></span><span>${it.t}</span>`, d);
      r.style.cssText = TEGAK ? `left:70px;top:${530 + row * 62}px;width:940px` : `left:${150 + col * 820}px;top:${270 + row * 86}px;width:780px`;
      const at = it.at != null ? it.at : b.t0 + .4 + j * .8;
      tl.fromTo(r, { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: .35, ease: 'power3.out', immediateRender: false }, at);
      tl.fromTo($('path', r), { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: .35, ease: 'power2.out', immediateRender: false }, at + .3);
      tl.fromTo($('.cb', r), { backgroundColor: 'rgba(255,212,0,0)' }, { backgroundColor: 'rgba(255,212,0,1)', duration: .2, immediateRender: false }, at + .3);
    });
  },

  /* grafik ikon: satu ikon = satu juta jiwa */
  wafel(s, d, b) {
    const per = TEGAK ? 10 : 18, sz = TEGAK ? 62 : 46, gp = TEGAK ? 16 : 12;
    let y = TEGAK ? 380 : 220;
    if (s.ket) { const k = div('wket', s.ket, d); k.style.cssText = TEGAK ? `left:70px;top:${y - 70}px` : `left:640px;top:${y - 56}px`; }
    s.g.forEach((gr, gi) => {
      const lab = div('wlab ' + gr.c, `<b>${gr.t}</b><span>${gr.lab}</span>`, d);
      const n = gr.max, rows = Math.ceil(n / per), x0 = TEGAK ? 70 : 640;
      lab.style.cssText = TEGAK ? `left:70px;top:${y}px` : `left:150px;top:${y}px;width:440px`;
      if (TEGAK) y += 110;
      const at = gr.at != null ? gr.at : b.t0 + .6 + gi * 2.2;
      tl.fromTo(lab, { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: .4, immediateRender: false }, at);
      const icons = [];
      for (let i = 0; i < n; i++) { const e = div('wic ' + gr.c + (i >= gr.min ? ' rng' : ''), '<svg viewBox="0 0 24 24"><circle cx="12" cy="6.5" r="3.5"/><path d="M5.5 22v-6a6.5 6.5 0 0 1 13 0v6z"/></svg>', d);
        e.style.cssText = `left:${x0 + (i % per) * (sz + gp)}px;top:${y + Math.floor(i / per) * (sz + gp)}px;width:${sz}px;height:${sz}px`; icons.push(e); }
      tl.fromTo(icons, { opacity: 0, scale: .4 }, { opacity: (i) => icons[i].classList.contains('rng') ? .38 : 1, scale: 1, duration: .25, stagger: Math.min(.03, 1.6 / n), ease: 'back.out(2)', immediateRender: false }, at + .2);
      y += rows * (sz + gp) + (TEGAK ? 40 : 46);
    });
  },

  /* kutipan besar */
  kutip(s, d, b) {
    const q = div('qt', `<u>“</u><p>${s.teks}</p><i>${s.oleh}</i>`, d);
    const at = b.t0 + .2;
    tl.fromTo($('u', q), { opacity: 0, y: -40 }, { opacity: 1, y: 0, duration: .5, ease: 'power3.out', immediateRender: false }, at);
    tl.fromTo($('p', q), { opacity: 0, clipPath: 'inset(0 100% 0 0)' }, { opacity: 1, clipPath: 'inset(0 0% 0 0)', duration: 1.1, ease: 'power2.inOut', immediateRender: false }, at + .3);
    tl.fromTo($('i', q), { opacity: 0 }, { opacity: 1, duration: .5, immediateRender: false }, at + 1.4);
  },

  /* tipografi besar: baris kata menghantam layar satu per satu */
  ketik(s, d, b) {
    const box = div('kt', s.baris.map((l, i) => `<div class="kl${s.c && s.c[i] ? ' ' + s.c[i] : ''}">${l}</div>`).join(''), d);
    let prev = b.t0 - .4;
    $$('.kl', box).forEach((l, i) => { const nB = s.baris.length, at = prev = Math.min(b.t1 - 1.1 - (nB - 1 - i) * .35, s.at && s.at[i] != null ? Math.max(s.at[i], prev + .3) : prev + (i ? (s.jeda || .6) : .55));
      tl.fromTo(l, { opacity: 0, scale: 1.6, y: -10 }, { opacity: 1, scale: 1, y: 0, duration: .32, ease: 'power4.in', immediateRender: false }, at); });
    tl.fromTo(box, { scale: 1 }, { scale: 1.06, duration: b.t1 - b.t0 + .4, ease: 'none', immediateRender: false }, b.t0);
  },
};
