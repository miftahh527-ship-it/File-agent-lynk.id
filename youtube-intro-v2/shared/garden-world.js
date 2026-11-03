/* Let.growww — dunia kebun berlapis untuk konsep 2 (kamera menyusuri, parallax).
   GW.build(world, {length, seed, dusk}) -> { layers, place(layer, el, x, y), update(camX) } */
(function () {
  const FL = ['#F2A33A', '#F08C7A', '#FFFFFF', '#F6C65B', '#E7A1C4'];
  function flower(c, s = 1) {
    const petals = Array.from({ length: 6 }, (_, i) => {
      const a = i * 60 * Math.PI / 180; return `<ellipse cx="${50 + Math.cos(a) * 16}" cy="${40 + Math.sin(a) * 16}" rx="13" ry="13" fill="${c}"/>`; }).join('');
    return `<svg viewBox="0 0 100 160" width="${100 * s}" height="${160 * s}"><path d="M50 160 C 52 120, 46 90, 50 50" stroke="#5E8C3A" stroke-width="6" fill="none"/>` +
      `<path d="M50 118 C 30 110, 22 96, 20 86 C 38 88, 48 100, 50 118 Z" fill="#7BAA48"/>${petals}<circle cx="50" cy="40" r="11" fill="#8A5A3B"/></svg>`;
  }
  function bush(c1, c2, w) {
    const h = w * .55;
    return `<svg viewBox="0 0 200 110" width="${w}" height="${h}"><ellipse cx="55" cy="72" rx="55" ry="38" fill="${c2}"/><ellipse cx="140" cy="70" rx="60" ry="40" fill="${c2}"/>` +
      `<ellipse cx="100" cy="52" rx="62" ry="50" fill="${c1}"/><ellipse cx="60" cy="62" rx="40" ry="32" fill="${c1}"/><ellipse cx="150" cy="64" rx="42" ry="32" fill="${c1}"/></svg>`;
  }
  function hill(c, w, h) { return `<svg viewBox="0 0 400 100" width="${w}" height="${h}" preserveAspectRatio="none"><path d="M0 100 C 60 20, 140 0, 200 10 C 270 20, 330 30, 400 100 Z" fill="${c}"/></svg>`; }
  function picket(x) { return `<div style="position:absolute;left:${x}px;top:0;width:34px;height:150px;background:linear-gradient(90deg,#E9D4B0,#F7E7C9,#DCC29A);clip-path:polygon(0 18%,50% 0,100% 18%,100% 100%,0 100%);border-radius:4px"></div>`; }

  function build(world, o = {}) {
    const R = MF.rand(o.seed || 9), L = o.length || 6000, dusk = !!o.dusk;
    const mk = (id, f) => { const d = document.createElement('div'); d.className = 'gw-layer'; d.id = id;
      d.style.cssText = 'position:absolute;left:0;top:0;height:1080px;width:' + (L * f + 2000) + 'px'; world.appendChild(d); return { el: d, f }; };
    const far = mk('gw-far', .35), mid = mk('gw-mid', .7), near = mk('gw-near', 1), fg = mk('gw-fg', 1.35);
    const add = (lay, html, x, y, z) => { const d = document.createElement('div'); d.style.cssText = `position:absolute;left:${x}px;top:${y}px` + (z ? `;z-index:${z}` : ''); d.innerHTML = html; lay.el.appendChild(d); return d; };
    // bukit jauh
    for (let x = -400; x < L * .35 + 1600; x += 700 + R() * 300)
      add(far, hill(dusk ? '#C9A27A' : '#BFD8A0', 1100 + R() * 400, 260 + R() * 120), x, 560 + R() * 60);
    // semak + bunga tengah
    for (let x = -200; x < L * .7 + 1600; x += 260 + R() * 220) {
      add(mid, bush(dusk ? '#7E9A4E' : '#8DBB55', dusk ? '#5F7E3B' : '#6E9E3E', 260 + R() * 160), x, 640 + R() * 40);
    }
    // jalan setapak + pagar + bunga dekat
    const path = document.createElement('div');
    path.style.cssText = `position:absolute;left:-400px;top:880px;width:${L + 2400}px;height:260px;background:linear-gradient(180deg,${dusk ? '#C99A6B,#A97A4E' : '#E4C597,#CFA977'});border-radius:60px 60px 0 0`;
    near.el.appendChild(path);
    const grass = document.createElement('div');
    grass.style.cssText = `position:absolute;left:-400px;top:820px;width:${L + 2400}px;height:80px;background:${dusk ? '#6E8E40' : '#86B44E'};border-radius:40px 40px 0 0`;
    near.el.insertBefore(grass, path);
    let fence = ''; for (let x = -300; x < L + 1600; x += 56) fence += picket(x);
    add(near, `<div style="position:relative;height:150px">${fence}<div style="position:absolute;left:-300px;top:40px;width:${L + 1900}px;height:18px;background:#E3CBA4"></div></div>`, 0, 690).style.zIndex = 0;
    for (let x = -200; x < L + 1600; x += 90 + R() * 120) add(near, flower(FL[Math.floor(R() * FL.length)], .7 + R() * .5), x, 740 + R() * 50);
    // rumput depan (paling cepat)
    for (let x = -300; x < L * 1.35 + 1600; x += 160 + R() * 200)
      add(fg, `<svg viewBox="0 0 120 120" width="${150 + R() * 80}" height="160"><path d="M10 120 Q 22 50 30 0 Q 40 60 46 120 M50 120 Q 62 30 80 6 Q 74 70 78 120 M82 120 Q 96 60 116 30 Q 104 80 100 120" fill="${dusk ? '#4F6E2E' : '#5E8C3A'}"/></svg>`, x, 960 + R() * 40);
    return {
      far, mid, near, fg,
      place(el, x, y) { el.style.position = 'absolute'; el.style.left = x + 'px'; el.style.top = y + 'px'; near.el.appendChild(el); return el; },
      update(camX) { for (const l of [far, mid, near, fg]) l.el.style.transform = `translateX(${-camX * l.f}px)`; },
    };
  }
  window.GW = { build, flower, bush };
})();
