/* Motion Format — TOKOH RAPI: karakter flat vektor dengan proporsi tetap dan sendi mulus.
 *
 * Kenapa rapi:
 *  - Proporsi dikunci (±4,8 kepala): pinggul y −232, bahu y −416, dagu y −448, puncak kepala y −566
 *    (kaki di y = 0). Tidak ada ukuran yang ditebak per tokoh.
 *  - Lengan & kaki = garis bertutup bulat (stroke-linecap:round) yang berpangkal TEPAT di titik
 *    sendi: siku, lutut, bahu menyambung mulus di sudut berapa pun — tidak ada celah/patahan.
 *  - Wajah di grid tetap (mata y −60 ±19, alis −80, hidung −46, mulut −30 dari leher).
 *  - Lengan/kaki belakang satu tingkat lebih gelap (×0,86), digambar di belakang badan.
 *  - Satu palet per tokoh; warna kulit dari daftar KULIT.
 *
 * Pakai (satu berkas: salin isi berkas ini ke <script> di index.html; starter panggung sudah berisi):
 *   const t = TOKOH.buat(svgGroup, x, groundY, skala, {rambut:'jilbab', kulit:'sawo', baju:'#237C80'});
 *   TOKOH.pose(t, 'melambai');                      // set langsung (frame 0)
 *   tl.to(t.Larm, {r: 150, duration: .5, onUpdate: t.Larm.apply}, 2);   // atau tween sendi sendiri
 *
 * Opsi: kulit (terang|kuning|sawo|cokelat|gelap|#hex) · rambut (pendek|cepak|panjang|bob|keriting|jilbab|botak)
 *   warnaRambut · jilbab (warna) · atasan (kaos|kemeja) · baju · bawahan (celana|rok) · celana · sepatu
 *   hadap (1 = menghadap kanan, −1 = kiri) · anak (true = tokoh anak, kepala relatif lebih besar)
 *   Kompatibel dengan nama lama: shirt, pants, shoes, hair.
 * Sendi (objek {r,x,y,sx,sy,apply()}, putar dengan r dalam derajat; 0 = lurus ke bawah):
 *   root, torso, head, eyes, Lbrow, Rbrow, Larm, Lfore, Lhand, Rarm, Rfore, Rhand,
 *   Lthigh, Lshin, Lfoot, Rthigh, Rshin, Rfoot.  L = sisi depan (dekat kamera), R = belakang.
 *   Arah putar: r negatif = ke depan (arah hadap), r positif = ke belakang.
 * Ekspresi: t.mouth (path) + t.mouthD {senang, netral, cemas, kaget}; pakai face() di starter atau
 *   TOKOH.ekspresi(t, 'kaget') untuk set langsung.
 */
(function (root) {
  const NS = 'http://www.w3.org/2000/svg';
  const KULIT = {terang: '#F1C9A5', kuning: '#E2B48A', sawo: '#CB895F', cokelat: '#A86B45', gelap: '#7A4A2E'};
  const INK = '#263746';

  function el(tag, a, p) { const n = document.createElementNS(NS, tag); for (const k in a) n.setAttribute(k, a[k]); p.appendChild(n); return n; }
  const g = (p, a = {}) => el('g', a, p);
  const path = (p, d, fill, a = {}) => el('path', {d, fill, ...a}, p);
  const line = (p, d, stroke, w, a = {}) => el('path', {d, fill: 'none', stroke, 'stroke-width': w, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', ...a}, p);
  const circ = (p, cx, cy, r, fill, a = {}) => el('circle', {cx, cy, r, fill, ...a}, p);
  const ell = (p, cx, cy, rx, ry, fill, a = {}) => el('ellipse', {cx, cy, rx, ry, fill, ...a}, p);
  const rect = (p, x, y, w, h, fill, rx = 0, a = {}) => el('rect', {x, y, width: w, height: h, rx, fill, ...a}, p);
  function shade(hex, f) {
    const n = parseInt(hex.slice(1), 16), c = v => Math.max(0, Math.min(255, Math.round(v * f)));
    return '#' + ((1 << 24) + (c((n >> 16) & 255) << 16) + (c((n >> 8) & 255) << 8) + c(n & 255)).toString(16).slice(1);
  }
  /* sendi: transform manual (sumbu putar = titik asal lokal), sama dengan J() di starter panggung */
  function J(node, tx = 0, ty = 0) {
    const j = {el: node, tx, ty, x: 0, y: 0, r: 0, sx: 1, sy: 1,
      apply() { node.setAttribute('transform', `translate(${j.tx + j.x},${j.ty + j.y}) rotate(${j.r}) scale(${j.sx},${j.sy})`); }};
    j.apply(); return j;
  }
  /* segmen anggota badan: garis dari sendi (0,0) ke (0,len) bertutup bulat → sambungan mulus */
  function seg(parent, tx, ty, len, w, col) {
    const n = g(parent), j = J(n, tx, ty);
    line(n, `M0 0 L0 ${len}`, col, w);
    return {n, j};
  }

  /* ---- rambut (koordinat kepala: leher di 0,0; pusat wajah 0,−62; puncak −122) ---- */
  const HAIR = {
    pendek: {front: 'M -55 -58 C -60 -112 -30 -131 0 -131 C 32 -131 60 -112 55 -58 C 51 -78 41 -90 24 -95 C 6 -86 -20 -87 -42 -93 C -50 -85 -54 -73 -55 -58 Z'},
    cepak: {front: 'M -53 -70 C -54 -110 -28 -127 0 -127 C 28 -127 54 -110 53 -70 C 46 -96 26 -107 0 -107 C -26 -107 -46 -96 -53 -70 Z'},
    panjang: {back: 'M -63 -62 C -67 -120 -34 -135 0 -135 C 34 -135 67 -120 63 -62 L 65 26 C 65 42 54 50 40 50 L -40 50 C -54 50 -65 42 -65 26 Z',
      front: 'M -54 -62 C -58 -115 -29 -131 0 -131 C 30 -131 58 -115 54 -62 C 45 -92 21 -101 -5 -99 C -24 -97 -42 -86 -54 -62 Z'},
    bob: {back: 'M -63 -62 C -67 -120 -34 -135 0 -135 C 34 -135 67 -120 63 -62 L 64 -22 C 64 -12 58 -6 48 -6 L -48 -6 C -58 -6 -64 -12 -64 -22 Z',
      front: 'M -54 -62 C -58 -115 -29 -131 0 -131 C 30 -131 58 -115 54 -62 C 47 -84 34 -97 14 -100 L 10 -86 C -10 -96 -36 -94 -54 -62 Z'},
    keriting: {curls: true},
    jilbab: {jilbab: true},
    botak: {}
  };
  const FACE_D = {
    senang: 'M -14 -31 C -6 -22 6 -22 14 -31',
    netral: 'M -10 -27 L 10 -27',
    cemas: 'M -12 -24 C -4 -31 4 -31 12 -24',
    kaget: 'M -7 -31 C -7 -18 7 -18 7 -31 Z'
  };

  function buat(parent, x, ground, scale = 1, o = {}) {
    const skin = KULIT[o.kulit] || o.kulit || KULIT.sawo;
    const shirt = o.shirt || o.baju || '#237C80';
    const pants = o.pants || o.celana || '#FFF3DC';
    const shoes = o.shoes || o.sepatu || '#2C2A2E';
    const hairC = o.hair || o.warnaRambut || INK;
    const hijabC = o.jilbab || '#E0714F';
    const style = HAIR[o.rambut] ? o.rambut : (o.rambut === undefined ? 'pendek' : 'botak');
    const rok = o.bawahan === 'rok', kemeja = o.atasan === 'kemeja';
    const hadap = o.hadap === -1 ? -1 : 1, anak = !!o.anak, s = scale * (anak ? .72 : 1);
    const skinD = shade(skin, .86);

    const sd = ell(parent, x, ground + 4, 66 * s, 15, '#172E3C', {opacity: .13});
    const place = g(parent, {transform: `translate(${x},${ground}) scale(${s * hadap},${s})`});
    const rootN = g(place), ref = {who: o.who || 'tokoh', scale: s, place, sd, root: J(rootN), faces: {}};

    /* kaki: R (belakang) dulu, lalu L (depan) */
    for (const side of ['R', 'L']) {
      const dk = side === 'R' ? .86 : 1, hx = side === 'R' ? 20 : -20;
      const legC = rok ? shade(skin, dk) : shade(pants, dk);
      const th = seg(rootN, hx, -232, 108, 44, rok ? shade(skin, dk) : shade(pants, dk));
      const sh = seg(th.n, 0, 108, 104, 38, legC);
      const fN = g(sh.n), ft = J(fN, 0, 104);
      path(fN, 'M -20 -6 C -20 -16 -10 -20 -2 -20 L 12 -20 C 30 -20 41 -8 41 6 L 41 14 C 41 18 38 20 34 20 L -16 20 C -19 20 -20 18 -20 14 Z', shade(shoes, dk));
      ref[side + 'thigh'] = th.j; ref[side + 'shin'] = sh.j; ref[side + 'foot'] = ft;
    }
    if (!rok) rect(rootN, -46, -262, 92, 50, pants, 22);         // panggul: menutup pangkal paha

    /* badan (sendi di pinggul) */
    const tN = g(rootN), torso = J(tN, 0, -232); ref.torso = torso;
    const arm = (side) => {
      const front = side === 'L', dk = front ? 1 : .86, sx = front ? -44 : 44;
      const sk = shade(skin, dk), sc = shade(shirt, dk);
      const up = seg(tN, sx, -184, 94, kemeja ? 32 : 28, kemeja ? sc : sk);
      if (!kemeja) line(up.n, 'M0 0 L0 44', sc, 36);              // lengan kaos pendek
      const fo = seg(up.n, 0, 94, 84, 27, kemeja ? sc : sk);
      if (kemeja) line(fo.n, 'M0 70 L0 76', shade(shirt, dk * .8), 30, {'stroke-linecap': 'butt'});   // manset
      const hN = g(fo.n), hd = J(hN, 0, 84);
      circ(hN, 0, 6, 17, sk); ell(hN, front ? 12 : -12, -2, 7, 9, sk);   // telapak + ibu jari
      ref[side + 'arm'] = up.j; ref[side + 'fore'] = fo.j; ref[side + 'hand'] = hd;
    };
    arm('R');
    rect(tN, -13, -228, 26, 34, skinD, 9);                       // leher (di belakang baju)
    if (rok) path(tN, 'M -50 -24 L 50 -24 L 70 150 C 40 160 -40 160 -70 150 Z', pants);   // rok A, sampai betis
    path(tN, 'M -58 -186 C -58 -199 -48 -206 -35 -206 L -14 -206 C -9 -196 9 -196 14 -206 L 35 -206 C 48 -206 58 -199 58 -186 L 53 -12 C 53 0 46 6 35 6 L -35 6 C -46 6 -53 0 -53 -12 Z', shirt);
    rect(tN, -53, -14, 106, 20, shade(shirt, .88), 9);            // lipatan bawah baju
    if (kemeja) {
      path(tN, 'M -14 -206 L 0 -186 L -22 -192 Z', shade(shirt, 1.12)); path(tN, 'M 14 -206 L 0 -186 L 22 -192 Z', shade(shirt, 1.12));
      line(tN, 'M0 -186 L0 -18', shade(shirt, .8), 3);
      for (const y of [-160, -120, -80, -40]) circ(tN, 0, y, 3.5, shade(shirt, .75));
    } else line(tN, 'M -14 -205 C -9 -195 9 -195 14 -205', shade(shirt, .78), 4);
    arm('L');

    /* kepala (sendi di leher) */
    const hN = g(tN), head = J(hN, 0, -212); ref.head = head;
    if (anak) { head.sx = head.sy = 1.18; head.apply(); }
    const H = HAIR[style];
    if (H.jilbab) path(hN, 'M -66 -40 C -72 -122 -36 -142 0 -142 C 36 -142 72 -122 66 -40 L 72 44 L -72 44 Z', shade(hijabC, .86));
    if (H.back) path(hN, H.back, shade(hairC, .9));
    if (!H.jilbab) { ell(hN, -52, -58, 9, 13, skinD); ell(hN, 52, -58, 9, 13, skinD); }
    path(hN, 'M 0 -122 C 31 -122 52 -101 52 -68 L 52 -52 C 52 -22 29 -4 0 -4 C -29 -4 -52 -22 -52 -52 L -52 -68 C -52 -101 -31 -122 0 -122 Z', skin);
    if (H.curls) {
      for (let i = 0; i <= 9; i++) { const a = Math.PI * (1.05 + i * .1), cx = Math.cos(a) * 48, cy = -74 + Math.sin(a) * 50;
        circ(hN, +cx.toFixed(1), +cy.toFixed(1), 19, hairC); }
      path(hN, 'M -50 -84 C -46 -116 -24 -128 0 -128 C 24 -128 46 -116 50 -84 C 30 -100 -30 -100 -50 -84 Z', hairC);
    }
    if (H.front) path(hN, H.front, hairC);
    if (H.jilbab) {
      path(hN, 'M -55 -50 C -59 -117 -30 -135 0 -135 C 30 -135 59 -117 55 -50 C 51 -86 31 -104 0 -104 C -31 -104 -51 -86 -55 -50 Z', hijabC);
      path(hN, 'M 55 -58 C 55 -22 30 -1 0 -1 C -30 -1 -55 -22 -55 -58 L -70 40 C -42 60 42 60 70 40 Z', hijabC);
    }
    /* wajah */
    const eN = g(hN), eyes = J(eN, 0, -60); ref.eyes = eyes;
    for (const ex of [-19, 19]) { ell(eN, ex, 0, 6, 7.5, INK); circ(eN, ex + 2, -3, 2, '#fff'); }
    const browC = H.jilbab || style === 'botak' ? INK : hairC;
    const lb = g(hN), rb = g(hN); ref.Lbrow = J(lb, -18, -82); ref.Rbrow = J(rb, 18, -82);
    line(lb, 'M -10 2 C -5 -3 4 -3 9 0', browC, 4.5); line(rb, 'M -9 0 C -4 -3 5 -3 10 2', browC, 4.5);
    line(hN, 'M -4 -46 C -1 -42 3 -42 6 -46', shade(skin, .72), 3.5);
    circ(hN, -33, -40, 7, '#E0714F', {opacity: .22}); circ(hN, 33, -40, 7, '#E0714F', {opacity: .22});
    ref.mouthD = FACE_D;
    ref.mouth = line(hN, FACE_D.senang, INK, 4.5);
    return ref;
  }

  /* pose siap pakai (derajat). r negatif = ke depan. Gabungkan dengan tween sendiri bila perlu. */
  const POSE = {
    berdiri:   {Larm: 6, Lfore: -4, Rarm: -6, Rfore: 4, Lthigh: 0, Rthigh: 0, Lshin: 0, Rshin: 0, torso: 0, head: 0},
    melambai:  {Larm: 150, Lfore: 25, Rarm: -6, Rfore: 4},
    menunjuk:  {Rarm: -82, Rfore: -8, Larm: 6, Lfore: -4, head: 4},
    'angkat-tangan': {Larm: 172, Lfore: 6, Rarm: -6, Rfore: 4},
    pinggang:  {Larm: 40, Lfore: -72, Lhand: 20, Rarm: -40, Rfore: 72, Rhand: -20},
    berpikir:  {Larm: -60, Lfore: -134, Lhand: 0, Rarm: -6, Rfore: 4, head: 6},
    bingung:   {Larm: 150, Lfore: 70, Rarm: -6, Rfore: 4, head: -8},
    senang:    {Larm: 150, Lfore: -20, Rarm: -150, Rfore: 20}
  };
  function pose(t, name) {
    const p = POSE[name]; if (!p) throw new Error('Pose tidak dikenal: ' + name);
    for (const k in p) if (t[k]) { t[k].r = p[k]; t[k].apply(); }
  }
  function ekspresi(t, e) {
    t.mouth.setAttribute('d', FACE_D[e] || FACE_D.senang);
    t.mouth.setAttribute('fill', e === 'kaget' ? INK : 'none');
    const up = e === 'kaget' ? -6 : 0, tilt = e === 'cemas' ? 12 : 0;
    t.Lbrow.y = up; t.Rbrow.y = up; t.Lbrow.r = tilt; t.Rbrow.r = -tilt; t.Lbrow.apply(); t.Rbrow.apply();
  }
  root.TOKOH = {buat, pose, ekspresi, POSE, KULIT, J};
})(window);
