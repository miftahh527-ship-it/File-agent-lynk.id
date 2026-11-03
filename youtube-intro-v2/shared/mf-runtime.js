/* Let.growww — runtime bersama (arsitektur Motion Format: timeline GSAP deterministik,
   tanpa player, autoplay + loop, ?debug=1 untuk scrub, ?clean=1 untuk export, AUDIO_PLAN).
   Skrip klasik (bukan module) supaya index.html tetap bisa dibuka lewat klik dua kali (file://). */
(function () {
  const Q = new URLSearchParams(location.search);
  const $ = (s, r = document) => r.querySelector(s);
  const NS = 'http://www.w3.org/2000/svg';

  /* ---------- stage pas layar ---------- */
  function fit() {
    const st = $('#stage'); if (!st) return;
    const k = Math.min(innerWidth / 1920, innerHeight / 1080);
    st.style.transform = `translate(${(innerWidth - 1920 * k) / 2}px,${(innerHeight - 1080 * k) / 2}px) scale(${k})`;
  }
  addEventListener('resize', fit);

  /* ---------- acak deterministik (mulberry32) — TIDAK ada Math.random di jalur render ---------- */
  function rand(seed) {
    return function () {
      seed |= 0; seed = seed + 0x6D2B79F5 | 0;
      let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  /* ---------- motion blur berarah (feGaussianBlur x/y terpisah) ---------- */
  let defs = null, fc = 0;
  function makeBlur() {
    if (!defs) {
      const svg = document.createElementNS(NS, 'svg'); svg.setAttribute('width', 0); svg.setAttribute('height', 0);
      svg.style.position = 'absolute'; defs = document.createElementNS(NS, 'defs'); svg.appendChild(defs); document.body.appendChild(svg);
    }
    const id = 'mb' + (fc++), f = document.createElementNS(NS, 'filter'); f.id = id;
    f.setAttribute('x', '-70%'); f.setAttribute('y', '-70%'); f.setAttribute('width', '240%'); f.setAttribute('height', '240%');
    const g = document.createElementNS(NS, 'feGaussianBlur'); g.setAttribute('stdDeviation', '0 0'); f.appendChild(g); defs.appendChild(f);
    return { url: `url(#${id})`, node: g };
  }
  /* blur(tl, el, at, dur, {from, ax, ay}) : blur searah gerak yang meluruh ke 0 */
  function blur(tl, targets, at, dur, o = {}) {
    const b = makeBlur(), s = { v: o.from == null ? 14 : o.from }, ax = o.ax == null ? .1 : o.ax, ay = o.ay == null ? 1 : o.ay;
    tl.set(targets, { filter: b.url }, at);
    tl.to(s, { v: o.to || 0, duration: dur, ease: o.ease || 'power3.out',
      onUpdate() { b.node.setAttribute('stdDeviation', `${(s.v * ax).toFixed(2)} ${(s.v * ay).toFixed(2)}`); } }, at);
    if (!o.to) tl.set(targets, { filter: 'none' }, at + dur);
  }

  /* ---------- pecah teks ---------- */
  function chars(el) {
    const txt = el.textContent; el.textContent = ''; const out = [];
    for (const c of txt) { const s = document.createElement('span'); s.className = 'ch'; s.innerHTML = c === ' ' ? '&nbsp;' : c; el.appendChild(s); out.push(s); }
    return out;
  }
  function words(el) {
    const ws = el.textContent.split(' '); el.textContent = ''; const out = [];
    ws.forEach((w, i) => { const s = document.createElement('span'); s.className = 'wd'; s.textContent = w; el.appendChild(s); out.push(s);
      if (i < ws.length - 1) el.appendChild(document.createTextNode(' ')); });
    return out;
  }
  /* wordmark Let.growww berwarna */
  function wordmark(el) {
    const cls = ['c-let', 'c-let', 'c-let', 'c-dot', 'c-grow', 'c-grow', 'c-grow', 'c-w1', 'c-w2', 'c-w3'];
    el.textContent = ''; return [...'Let.growww'].map((c, i) => {
      const s = document.createElement('span'); s.className = 'ch ' + cls[i]; s.textContent = c; el.appendChild(s); return s; });
  }

  /* ---------- SVG kecil ---------- */
  const leafSVG = (c1 = '#9CC45E', c2 = '#5E8C3A') =>
    `<svg viewBox="0 0 100 100" width="100%" height="100%"><path d="M8 92 C 10 40, 45 8, 94 6 C 92 55, 60 90, 8 92 Z" fill="${c1}"/>` +
    `<path d="M10 90 C 35 65, 60 40, 88 12" stroke="${c2}" stroke-width="5" fill="none" stroke-linecap="round"/></svg>`;
  const ICON = {
    youtube: `<svg viewBox="0 0 100 100" width="100%" height="100%"><rect x="2" y="18" width="96" height="64" rx="20" fill="#FF0033"/><path d="M40 34 L68 50 L40 66 Z" fill="#fff" stroke="#fff" stroke-width="4" stroke-linejoin="round"/></svg>`,
    instagram: `<svg viewBox="0 0 100 100" width="100%" height="100%"><defs><linearGradient id="igg" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#FEDA75"/><stop offset=".3" stop-color="#FA7E1E"/><stop offset=".55" stop-color="#D62976"/><stop offset=".8" stop-color="#962FBF"/><stop offset="1" stop-color="#4F5BD5"/></linearGradient></defs><rect x="4" y="4" width="92" height="92" rx="26" fill="url(#igg)"/><rect x="22" y="22" width="56" height="56" rx="17" fill="none" stroke="#fff" stroke-width="7"/><circle cx="50" cy="50" r="13" fill="none" stroke="#fff" stroke-width="7"/><circle cx="68" cy="32" r="4.5" fill="#fff"/></svg>`,
    warn: `<svg viewBox="0 0 100 100" width="100%" height="100%"><path d="M50 8 L94 88 L6 88 Z" fill="#F2A33A" stroke="#F2A33A" stroke-width="10" stroke-linejoin="round"/><rect x="45" y="36" width="10" height="30" rx="5" fill="#4A2E1D"/><circle cx="50" cy="76" r="6" fill="#4A2E1D"/></svg>`,
    cursor: `<svg viewBox="0 0 28 36" width="100%" height="100%"><path d="M2 2 L2 30 L9 23 L14 34 L19 32 L14 21 L24 21 Z" fill="#fff" stroke="#2B1A10" stroke-width="2.2" stroke-linejoin="round"/></svg>`,
    heart: `<svg viewBox="0 0 100 100" width="100%" height="100%"><path d="M50 88 C 10 60, 4 36, 18 22 C 30 10, 46 16, 50 30 C 54 16, 70 10, 82 22 C 96 36, 90 60, 50 88 Z" fill="#F0607A"/></svg>`,
  };
  function social(parent, o) {
    const d = document.createElement('div'); d.className = 'social ' + (o.cls || '');
    d.innerHTML = `<div class="ico">${ICON[o.platform]}</div><div class="txt"><div class="lbl">${o.label}</div><div class="usr">${o.user}</div></div>` +
      `<div class="btn" style="background:${o.color}"><span class="b1">${o.b1}</span><span class="b2">${o.b2}</span></div>`;
    parent.appendChild(d); return d;
  }

  /* ---------- latar kebun hidup: gradien + matahari bergeser + grain + serbuk sari + daun melayang ---------- */
  function garden(host, o = {}) {
    const R = rand(o.seed || 7);
    const base = document.createElement('div'); base.className = 'bg-base';
    base.style.background = o.base || 'linear-gradient(180deg,#FFF6E2 0%,#F7EBD3 55%,#EFDDBB 100%)';
    const sun = document.createElement('div'); sun.className = 'bg-sun'; if (o.sun) sun.style.background = o.sun;
    host.appendChild(base); host.appendChild(sun);
    const pol = [], lv = [];
    for (let i = 0; i < (o.pollen == null ? 34 : o.pollen); i++) {
      const p = document.createElement('div'); p.className = 'pollen'; const r = 3 + R() * 7;
      p.style.width = p.style.height = r + 'px'; host.appendChild(p);
      pol.push({ el: p, x: R() * 1920, y: R() * 1080, sp: 14 + R() * 30, ph: R() * 6.28, a: .35 + R() * .5 });
    }
    for (let i = 0; i < (o.leaves == null ? 7 : o.leaves); i++) {
      const l = document.createElement('div'); l.className = 'fleaf'; l.innerHTML = leafSVG(R() < .5 ? '#9CC45E' : '#B5D37A', '#5E8C3A');
      const s = .6 + R() * .9; l.style.width = l.style.height = (46 * s) + 'px'; l.style.opacity = .55; host.appendChild(l);
      lv.push({ el: l, x: R() * 1920, y: R() * 1080, sp: 30 + R() * 40, ph: R() * 6.28, rot: R() * 360 });
    }
    const grain = document.createElement('div'); grain.className = 'bg-grain'; host.appendChild(grain);
    return {
      base, sun,
      update(t) {
        sun.style.transform = `translate(${Math.sin(t * .35) * 90}px,${Math.cos(t * .28) * 30}px)`;
        grain.style.transform = `translate(${(Math.floor(t * 12) % 5) * 7}px,${(Math.floor(t * 12) % 3) * 9}px)`;
        for (const p of pol) {
          const y = ((p.y - t * p.sp) % 1100 + 1100) % 1100 - 10, x = p.x + Math.sin(t * .9 + p.ph) * 22;
          p.el.style.transform = `translate(${x}px,${y}px)`; p.el.style.opacity = p.a * (.65 + .35 * Math.sin(t * 2.2 + p.ph));
        }
        for (const l of lv) {
          const x = ((l.x + t * l.sp) % 2040 + 2040) % 2040 - 60, y = l.y + Math.sin(t * .7 + l.ph) * 40 + t * 12;
          l.el.style.transform = `translate(${x}px,${(y % 1140 + 1140) % 1140 - 60}px) rotate(${l.rot + Math.sin(t + l.ph) * 30}deg)`;
        }
      }
    };
  }

  /* ---------- boot: timeline + kontrak OPENER (render_mp4.py) + loop + debug + suara ---------- */
  function boot({ duration, build, render }) {
    fit();
    const tl = gsap.timeline({ paused: true });
    build(tl);
    tl.set({}, {}, duration);                         // kunci durasi
    const draw = t => { render && render(t); };
    const seek = t => { tl.pause(); tl.time(t, false); if (gsap.ticker.tick) gsap.ticker.tick(); draw(t); };
    window.OPENER = { tl, DURATION: duration, seek, ready: false };
    window.OPENER.seekFrame = t => { seek(t); return Promise.resolve(); };

    const ui = document.createElement('div'); ui.id = 'ui';
    ui.innerHTML = '<button id="pp">Play</button><input id="scr" type="range" min="0" max="1000" value="0"><span id="clk">0.00s</span>';
    document.body.appendChild(ui); if (Q.has('debug')) ui.classList.add('on');
    const scr = $('#scr'), clk = $('#clk'); let scrubbing = false;
    scr.addEventListener('pointerdown', () => { scrubbing = true; tl.pause(); });
    addEventListener('pointerup', () => scrubbing = false);
    scr.addEventListener('input', () => { tl.pause(); tl.time(scr.value / 1000 * duration); });
    $('#pp').onclick = () => tl.paused() ? tl.play() : tl.pause();
    addEventListener('keydown', e => {
      if (e.code === 'Space') { e.preventDefault(); tl.paused() ? tl.play() : tl.pause(); }
      if (/^[rR]$/.test(e.key)) { tl.pause(0); tl.play(); }
    });
    (function frame() { const t = tl.time(); draw(t); clk.textContent = t.toFixed(2) + 's';
      if (!scrubbing) scr.value = String(t / duration * 1000); requestAnimationFrame(frame); })();
    tl.eventCallback('onComplete', () => tl.play(0));  // loop

    /* ===== SUARA Motion Format — AUDIO_PLAN terikat timeline (dari starter, disederhanakan) ===== */
    const P = window.AUDIO_PLAN = window.AUDIO_PLAN || { vo: [], sfx: [], music: null };
    let on = false, last = 0;
    const mk = (s, music) => { const a = new Audio(s.src); a.preload = 'auto'; a.volume = s.vol == null ? (music ? .15 : 1) : s.vol; return { at: s.at || 0, el: a, music: !!music }; };
    const LONG = (P.vo || []).map(s => mk(s)).concat(P.music ? [mk(P.music, true)] : []);
    const SFX = (P.sfx || []).map(s => mk(s)); const ALL = LONG.concat(SFX);
    const unlock = () => { on = true; };
    addEventListener('pointerdown', unlock, { once: true }); addEventListener('keydown', unlock, { once: true });
    gsap.ticker.add(() => {
      const t = tl.time(), playing = !tl.paused();
      if (!on) { last = t; return; }
      for (const c of LONG) { const d = c.el.duration, rel = t - c.at, inside = rel >= 0 && (c.music || !d || !isFinite(d) || rel < d);
        if (playing && inside) { const want = c.music && d && isFinite(d) ? rel % d : rel;
          if (Math.abs(c.el.currentTime - want) > .25) c.el.currentTime = want; if (c.el.paused) c.el.play().catch(() => {}); }
        else if (!c.el.paused) c.el.pause(); }
      if (playing) { if (t < last) last = -.001;
        if (t - last < .5) for (const s of SFX) if (s.at > last && s.at <= t) { s.el.currentTime = 0; s.el.play().catch(() => {}); } }
      last = t;
    });
    const probe = () => { const a = ALL[0].el, v = a.volume; a.volume = 0;
      return a.play().then(() => { a.pause(); a.currentTime = 0; a.volume = v; on = true; }, e => { a.volume = v; throw e; }); };

    document.fonts.ready.then(() => {
      draw(0); window.OPENER.ready = true; if (Q.has('clean')) return;
      if (!ALL.length) { tl.play(0); return; }
      probe().then(() => tl.play(0)).catch(e => {
        if (e && e.name !== 'NotAllowedError') { tl.play(0); return; }   // berkas audio belum ada → tetap putar
        tl.pause(0); const go = () => { removeEventListener('pointerdown', go); removeEventListener('keydown', go); tl.play(0); };
        addEventListener('pointerdown', go); addEventListener('keydown', go);
      });
    });
    return tl;
  }

  window.MF = { boot, rand, blur, chars, words, wordmark, garden, social, ICON, leafSVG, $ };
})();
