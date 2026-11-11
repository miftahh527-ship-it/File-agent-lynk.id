// Merakit index.html per video & gaya. Pakai: node build.mjs long|s1..s8|semua [a|b]
import fs from 'fs'; import path from 'path'; import { spawnSync } from 'child_process';
import { SECTIONS, SHORTS, EXTRA } from './naskah.mjs';
const ROOT = path.resolve('..'), AUD = path.join(ROOT, 'audio');
const SKILL = path.resolve(ROOT, '../.claude/skills/motion-format');
const starter = fs.readFileSync(path.join(SKILL, 'assets/starter-explainer-jurnalisme.html'), 'utf8');
const TAIL = starter.slice(starter.indexOf('/* ---------- kontrol:'), starter.indexOf('</script>\n</body>'));
const MAP = fs.readFileSync('map.json', 'utf8'), ENGINE = fs.readFileSync('engine.js', 'utf8');
const ALL = [...SECTIONS, ...EXTRA], byId = Object.fromEntries(ALL.map(s => [s.id, s]));
const has = id => fs.existsSync(path.join(AUD, id + '.mp3'));
const dur = id => +spawnSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', path.join(AUD, id + '.mp3')]).stdout.toString();
function silences(id) {
  const o = spawnSync('ffmpeg', ['-i', path.join(AUD, id + '.mp3'), '-af', 'silencedetect=n=-32dB:d=0.22', '-f', 'null', '-']).stderr.toString();
  const s = [...o.matchAll(/silence_start: ([\d.]+)/g)].map(m => +m[1]), e = [...o.matchAll(/silence_end: ([\d.]+)/g)].map(m => +m[1]);
  return s.map((a, i) => ({ s: Math.max(0, a), e: e[i] ?? a + .3 }));
}
// batas beat di dalam klip: perkiraan proporsional jumlah huruf, lalu ditempelkan ke jeda terdekat
function align(sec) {
  const D = dur(sec.id), sil = silences(sec.id), lens = sec.beats.map(b => b.v.length + 1), tot = lens.reduce((a, b) => a + b, 0);
  const s0 = sil.length && sil[0].s < .05 ? sil[0].e : 0, last = sil[sil.length - 1], s1 = last && last.e > D - .05 ? last.s : D;
  const bnd = [s0]; let c = 0;
  for (let i = 0; i < lens.length - 1; i++) { c += lens[i]; const pred = s0 + c / tot * (s1 - s0);
    let best = null; for (const x of sil) { if (x.e <= bnd[bnd.length - 1] + .8 || x.s > s1 - .3) continue; const dd = Math.abs((x.s + x.e) / 2 - pred) - Math.min(.6, (x.e - x.s)); if (dd < 2.4 && (!best || dd < best.dd)) best = { dd, x }; }
    bnd.push(best ? best.x.e - .04 : pred); }
  return { D, bnd, ends: bnd.slice(1).concat([s1]) };
}
function timeline(kind) {
  const beats = [], vo = []; let T = kind === 'long' ? 1.3 : .35; const miss = [];
  const push = (sec, opts = {}) => {
    if (!has(sec.id)) { miss.push(sec.id); return; }
    let card = null; if (sec.part && kind === 'long') { card = { ...sec.part, at: T }; T += 3.0; }
    const A = align(sec), at = T; vo.push({ at, src: `../../audio/${sec.id}.mp3`, vol: 1 });
    sec.beats.forEach((b, i) => { const t0 = at + A.bnd[i] - (i ? .12 : .25), sp1 = at + A.ends[i], t1 = i < sec.beats.length - 1 ? at + A.bnd[i + 1] - .12 : at + A.D + .45;
      const key = k => k && b.v.includes(k) ? Math.max(t0 + .25, at + A.bnd[i] + b.v.indexOf(k) / b.v.length * (sp1 - at - A.bnd[i]) - .18) : undefined;
      const o = { ...b, t0, t1 }; delete o.v;
      for (const f of ['it', 'mk', 'ar']) if (o[f]) o[f] = o[f].map(x => { const y = { ...x, at: key(x.k) }; delete y.k; return y; });
      if (o.num) o.num = { ...o.num, at: key(o.num.k) };
      if (i === 0) { if (card) o.card = card; o.tag = 'tag' in opts ? opts.tag : sec.tag; o.keep = 0; o.tagEnd = opts.tagEnd === null ? undefined : at + A.D + .45; }
      beats.push(o); });
    T = at + A.D + .55;
  };
  if (kind === 'long') { for (const s of SECTIONS) push(s); }
  else { const sh = SHORTS.find(x => x.id === kind), first = byId[sh.sec[0]];
    const edge = (id, cap, cam) => { const f = path.join(AUD, id + '.mp3'); let d = 2.6; if (fs.existsSync(f)) { d = dur(id) + .25; vo.push({ at: T + .1, src: `../../audio/${id}.mp3`, vol: 1 }); }
      beats.push({ t0: T, t1: T + d, cap, cam, hi: null, yr: undefined, hook: 1 }); T += d; };
    edge(kind + '-hook', sh.hcap, first.beats[0].cam);
    beats[0].tag = first.tag.replace(/^[\d.]+ /, ''); 
    for (const id of sh.sec) push(byId[id], { tag: null, tagEnd: null });
    const lastCam = beats[beats.length - 1].cam; edge(kind + '-tutup', sh.tcap, [lastCam[0], lastCam[1], lastCam[2] * .8]);
    beats.forEach(b => { if (b.tag === null) delete b.tag; });
  }
  return { beats, vo, DUR: +(T + (kind === 'long' ? 1.6 : .5)).toFixed(2), miss };
}
// ikon
const used = new Set(); for (const s of ALL) for (const b of s.beats) for (const i of b.it || []) if (i.ic) used.add(i.ic);
let SPRITE = '<symbol id="i-peluru" viewBox="0 0 24 24"><path d="M12 2c2.5 3 3.5 6 3.5 9h-7c0-3 1-6 3.5-9z"/><path d="M8.5 12h7v8h-7z"/><path d="M7.5 20h9v2h-9z"/></symbol>';
for (const n of used) { if (n === 'peluru') continue; const s = fs.readFileSync(`node_modules/@tabler/icons/icons/outline/${n}.svg`, 'utf8');
  SPRITE += `<symbol id="i-${n}" viewBox="0 0 24 24">${[...s.matchAll(/<path[^>]*\/>/g)].map(m => m[0]).filter(p => !p.includes('M0 0h24v24H0z')).join('')}</symbol>`; }

const GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='260' height='260'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='260' height='260' filter='url(%23n)'/%3E%3C/svg%3E")`;
const BASE = fs.readFileSync('gaya.css', 'utf8').replace(/GRAIN/g, GRAIN);
const FONT = { a: 'family=Barlow+Condensed:wght@500;600;700;800&family=IBM+Plex+Mono:wght@500', b: 'family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Cinzel:wght@600;700' };
const NAMA = { a: 'A-jurnalisme', b: 'B-sketsa' };
function build(kind, mode) {
  const tlm = timeline(kind), tegak = kind !== 'long', W = tegak ? 1080 : 1920, H = tegak ? 1920 : 1080;
  const dir = path.join(ROOT, NAMA[mode], kind === 'long' ? 'long' : 'short-' + kind.slice(1)); fs.mkdirSync(dir, { recursive: true });
  const cfg = { W, H, DUR: tlm.DUR, mode, beats: tlm.beats };
  const html = `<!doctype html>
<html lang="id">
<!-- Made with the Bang Motion skill by Bang Tutorial (https://youtube.com/bangtutorial) - MIT · dimodifikasi untuk skill Motion Format -->
<head><meta charset="utf-8"><title>Perang Dunia · ${kind} · gaya ${mode.toUpperCase()}</title>
<link href="https://fonts.googleapis.com/css2?${FONT[mode]}&display=swap" rel="stylesheet">
<style>${BASE}</style></head>
<body class="g${mode}${tegak ? ' tegak' : ''}">
<svg style="position:fixed;width:0;height:0"><defs>${SPRITE}</defs></svg>
<div id="stage">
  <div id="world" data-tata="dekor"><svg id="peta" data-tata="dekor" viewBox="0 0 4000 2300" width="4000" height="2300"></svg><div id="mk"></div></div>
  <div id="vig" data-tata="dekor"></div><div id="sweep" data-tata="dekor"></div>
  <div id="dim" data-tata="dekor"></div>
  <div class="grain" data-tata="dekor"></div>
  <div id="ov"></div>
  <div id="dbg"><button id="dPlay">Pause</button><input id="dScrub" type="range" min="0" max="1000" value="0"><span id="dClock">0.00s</span></div>
</div>
<audio id="vo" src="" preload="auto"></audio>
<script src="../../lib/gsap.min.js"></script>
<script>window.MAP=${MAP};
window.CFG=${JSON.stringify(cfg)};
window.AUDIO_PLAN=${JSON.stringify({ vo: tlm.vo, sfx: [], music: null })};
${ENGINE}
${TAIL}
</script>
</body></html>`;
  fs.writeFileSync(path.join(dir, 'index.html'), html);
  console.log(kind, mode, '→', path.relative(ROOT, dir), 'DUR', tlm.DUR, 'beat', tlm.beats.length, tlm.miss.length ? '| TANPA AUDIO: ' + tlm.miss.join(' ') : '');
}
const [what = 'long', m] = process.argv.slice(2);
const kinds = what === 'semua' ? ['long', ...SHORTS.map(s => s.id)] : [what];
for (const k of kinds) for (const mode of m ? [m] : ['a', 'b']) build(k, mode);
