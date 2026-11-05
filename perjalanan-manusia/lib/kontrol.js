/* ---------- kontrol: autoplay + loop tanpa player; ?debug=1 panel; ?clean=1 export ---------- */
const q=new URLSearchParams(location.search),vo=$('#vo'),hasVO=!!vo.getAttribute('src');let audioOn=false;
function applyAll(){scenes.forEach(s=>s.apply());}
function start(){tl.play(0);if(hasVO){vo.currentTime=0;vo.play().then(()=>audioOn=true).catch(()=>{});}}
tl.eventCallback('onComplete',()=>start());
gsap.ticker.add(()=>{if(!audioOn||tl.paused())return;if(Math.abs(vo.currentTime-tl.time())>.12)vo.currentTime=tl.time();});
window.OPENER={W,H,DURATION:DUR,tl,ready:false,seek(t){tl.pause(t,false);applyAll();if(gsap.ticker.tick)gsap.ticker.tick();},play:start};
/* ================= FOOTAGE — layer video yang terikat timeline (seperti footage di After Effects) =================
   Markup : <div class="clipbox"><video class="clip" src="assets/klip.mp4" muted playsinline preload="auto"></video></div>
   Pasang : const k = clip($('#v1'), {at:4, in:1.5, out:6, rate:1, hold:false});
            at = detik timeline klip mulai · in/out = potongan sumber (dtk) · rate = kecepatan · hold = tahan frame akhir
   Animasi: tween PEMBUNGKUSNYA dengan tl (posisi, skala, mask, opacity, filter). Isi video mengikuti jam timeline,
            bukan jamnya sendiri — scrub ?debug=1, snap.mjs, dan export-frames.mjs (OPENER.seekFrame) tetap presisi.
   Format : MP4 H.264 (yuv420p, +faststart) atau WebM VP9, tanpa suara, 720p–1080p, 3–8 dtk per klip. */
var CLIPS = CLIPS || [];
function clip(el, o){ o = o || {}; el.muted = true; el.playsInline = true; el.preload = 'auto'; el.loop = false;
  try { el.pause(); } catch(e) {}
  var c = { el: el, at: o.at || 0, inT: o.in || 0, out: (o.out == null ? null : o.out), rate: o.rate || 1, hold: !!o.hold };
  (CLIPS = CLIPS || []).push(c); return c; }
function clipTime(c, t){ var end = c.out != null ? c.out : (isFinite(c.el.duration) ? c.el.duration : 1e9);
  var lt = (t - c.at) * c.rate; if (lt < 0) return null; var vt = c.inT + lt;
  if (vt > end - 1/120) { if (!c.hold) return null; vt = end - 1/60; } return vt; }
function syncClips(t, playing){ for (var i = 0; i < CLIPS.length; i++){ var c = CLIPS[i], v = c.el, vt = clipTime(c, t);
  if (vt === null) { if (!v.paused) v.pause(); continue; }
  if (playing) { if (v.playbackRate !== c.rate) v.playbackRate = c.rate; if (v.paused) v.play().catch(function(){});
    if (Math.abs(v.currentTime - vt) > .2) v.currentTime = vt; }
  else { if (!v.paused) v.pause(); if (Math.abs(v.currentTime - vt) > 1/90) v.currentTime = vt; } } }
function seekClips(t){ return Promise.all(CLIPS.map(function(c){ return new Promise(function(res){
  var v = c.el, vt = clipTime(c, t); try { v.pause(); } catch(e) {}
  if (vt === null) return res();
  var fin = function(){ requestAnimationFrame(function(){ requestAnimationFrame(res); }); };
  if (Math.abs(v.currentTime - vt) < 1/240 && v.readyState >= 2) return fin();
  var to = setTimeout(res, 4000);
  v.addEventListener('seeked', function h(){ v.removeEventListener('seeked', h); clearTimeout(to); fin(); });
  v.currentTime = vt; }); })); }
gsap.ticker.add(function(){ if (CLIPS.length) syncClips(window.OPENER.tl.time(), !window.OPENER.tl.paused()); });
window.OPENER.clipsReady = function(){ return CLIPS.every(function(c){ return c.el.readyState >= 2; }); };
window.OPENER.seekFrame = function(t){ window.OPENER.seek(t); return seekClips(t); };   // ekspor/snap: tunggu frame klip
addEventListener('keydown',e=>{if(/^[rR]$/.test(e.key))start();if(e.code==='Space'){e.preventDefault();tl.paused()?tl.play():tl.pause();}});
if(q.has('debug')){const dbg=$('#dbg');dbg.style.display='flex';const sc=$('#dScrub'),ck=$('#dClock');let drag=false;
  gsap.ticker.add(()=>{if(!drag)sc.value=String(tl.time()/DUR*1000);ck.textContent=tl.time().toFixed(2)+'s';$('#dPlay').textContent=tl.paused()?'Play':'Pause';});
  sc.addEventListener('pointerdown',()=>{drag=true;tl.pause();});addEventListener('pointerup',()=>drag=false);
  sc.addEventListener('input',()=>{tl.pause();tl.time(sc.value/1000*DUR);});$('#dPlay').onclick=()=>tl.paused()?tl.play():tl.pause();}
/* ================= SUARA Motion Format — VO per adegan + efek suara (ElevenLabs), terikat timeline =================
   Isi AUDIO_PLAN saja; sisanya otomatis: ikut scrub ?debug=1, pause, loop, dan dibaca scripts/render_mp4.py untuk mix MP4.
   vo   : satu klip per adegan  {at: detik mulai bicara, src:'assets/audio/vo1.mp3', vol:1}
   sfx  : efek suara pendek     {at: detik bunyi,        src:'assets/audio/sfx-pop.mp3', vol:.5}
   music: null, kecuali user MEMINTA musik → {src:'assets/audio/music.mp3', vol:.15}
   Panduan lengkap: references/suara-elevenlabs.md */
window.AUDIO_PLAN = window.AUDIO_PLAN || { vo: [], sfx: [], music: null };
var MF = (function(){
  var P = window.AUDIO_PLAN, T = window.OPENER.tl, on = false, last = 0, noop = function(){};
  function mk(s, music){ var a = new Audio(s.src); a.preload = 'auto'; a.volume = s.vol == null ? (music ? .15 : 1) : s.vol;
    return { at: s.at || 0, el: a, music: !!music }; }
  var LONG = (P.vo || []).map(function(s){ return mk(s); }).concat(P.music ? [mk(P.music, true)] : []);
  var SFX = (P.sfx || []).map(function(s){ return mk(s); });
  var ALL = LONG.concat(SFX);
  function unlock(){ on = true; }
  addEventListener('pointerdown', unlock, { once: true }); addEventListener('keydown', unlock, { once: true });
  gsap.ticker.add(function(){
    var t = T.time(), playing = !T.paused();
    if (!on) { last = t; return; }
    for (var i = 0; i < LONG.length; i++){ var c = LONG[i], d = c.el.duration, rel = t - c.at;
      var inside = rel >= 0 && (c.music || !d || !isFinite(d) || rel < d);
      if (playing && inside){ var want = c.music && d && isFinite(d) ? rel % d : rel;
        if (Math.abs(c.el.currentTime - want) > .25) c.el.currentTime = want;
        if (c.el.paused) c.el.play().catch(noop); }
      else if (!c.el.paused) c.el.pause(); }
    if (playing){ if (t < last) last = -.001;                       // loop: mulai lagi dari awal
      if (t - last < .5) for (var j = 0; j < SFX.length; j++){ var s = SFX[j];
        if (s.at > last && s.at <= t){ s.el.currentTime = 0; s.el.play().catch(noop); } } }
    last = t;
  });
  return {
    has: ALL.length > 0,
    /* uji autoplay bersuara: resolve bila browser mengizinkan, reject bila harus menunggu klik/tombol pertama */
    probe: function(){ var a = ALL[0].el, v = a.volume; a.volume = 0;
      return a.play().then(function(){ a.pause(); a.currentTime = 0; a.volume = v; on = true; }, function(e){ a.volume = v; throw e; }); }
  };
})();
Promise.all([document.fonts.ready,...(window.IMGWAIT||[])]).then(()=>{applyAll();window.OPENER.ready=true;if(q.has('clean'))return;if(!hasVO&&!MF.has){start();return;}
  (hasVO?vo.play():MF.probe()).then(()=>{audioOn=hasVO;vo.currentTime=0;tl.play(0);}).catch(()=>{const go=()=>{removeEventListener('pointerdown',go);removeEventListener('keydown',go);start();};addEventListener('pointerdown',go);addEventListener('keydown',go);});});
