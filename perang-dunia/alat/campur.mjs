// Campur ulang audio video yang sudah dirender: VO + efek suara + musik latar (otomatis turun saat narasi).
// Gambar tidak dirender ulang: video disalin apa adanya, hanya trek audionya diganti.
// Pakai: node alat/campur.mjs <folder-halaman> <video-masuk.mp4> <video-keluar.mp4>
import fs from 'fs'; import path from 'path'; import { execFileSync } from 'child_process';

const [dir, vin, vout] = process.argv.slice(2);
const html = fs.readFileSync(path.join(dir, 'index.html'), 'utf8');
const CFG = JSON.parse(html.match(/window\.CFG\s*=\s*(\{.*?\});?\s*\n/s)[1]);
const PLAN = JSON.parse(html.match(/window\.AUDIO_PLAN=(\{.*?\});/s)[1]);
const D = +execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', vin]).toString();
const L = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../audio/latar');
const B = CFG.beats, gayaB = CFG.mode === 'b';

/* ---------- efek suara dari isi adegan ---------- */
const ev = [];   // [waktu, jenis, volume]
let tagNow = null;
B.forEach((b, bi) => {
  const { t0, t1 } = b, nxt = B[bi + 1], keepNext = nxt && nxt.keep && !nxt.card;
  const cl = (at, pad) => keepNext ? at : Math.max(t0 + .2, Math.min(at, t1 - (pad || 1.3)));
  if (b.card) ev.push([b.card.at + .2, 'boom', .55]);
  else if (b.tag != null && b.tag !== tagNow && bi > 0) ev.push([t0 - .35, gayaB ? 'kertas' : 'whoosh', .4]);
  if (b.tag != null) tagNow = b.tag;
  (b.it || []).forEach((it, i) => ev.push([cl(it.at != null ? it.at : t0 + .4 + i * .45), 'pop', .3]));
  (b.mk || []).forEach((m, i) => ev.push([cl(m.at != null ? m.at : t0 + .5 + i * .35), 'pin', .28]));
  if (b.num) ev.push([Math.max(t0 + .3, Math.min(b.num.at != null ? b.num.at : t0 + .5, t1 - 2.2)), 'angka', .22]);
});
// jangan menumpuk: efek sejenis minimal 0,22 detik terpisah
ev.sort((a, b) => a[0] - b[0]);
const sfx = []; const last = {};
for (const e of ev) if (e[0] >= 0 && e[0] < D - .5 && !(last[e[1]] > e[0] - .22)) { sfx.push(e); last[e[1]] = e[0]; }

/* ---------- musik latar per suasana ---------- */
const kini = s => /\/(3\.|4\.|p9|s6x|s[678]-)/.test(s);
const segs = []; // [mulai, selesai, lagu]
PLAN.vo.forEach(v => { const m = kini(v.src) ? 'kini' : 'sejarah'; const s = segs[segs.length - 1];
  if (!s || s[2] !== m) { if (s) s[1] = v.at - .4; segs.push([segs.length ? v.at - .4 : 0, D, m]); } });
if (!segs.length) segs.push([0, D, 'sejarah']);

/* ---------- graf ffmpeg ---------- */
const inp = [], fl = [];
const add = f => (inp.push('-i', f), inp.length / 2 - 1);
add(vin);
const vo = PLAN.vo.filter(c => c.at < D).map(c => [add(path.resolve(dir, c.src)), c]);
vo.forEach(([k, c], i) => fl.push(`[${k}:a]aresample=48000,aformat=channel_layouts=stereo,volume=${c.vol ?? 1},adelay=${Math.round(c.at * 1000)}:all=1[v${i}]`));
fl.push(`${vo.map((_, i) => `[v${i}]`).join('')}amix=inputs=${vo.length}:normalize=0,apad=whole_dur=${D.toFixed(3)},asplit=2[vo][key]`);

const jenis = [...new Set(sfx.map(e => e[1]))];
const parts = [];
jenis.forEach(j => {
  const list = sfx.filter(e => e[1] === j), k = add(path.join(L, `sfx-${j}.mp3`));
  const cut = j === 'angka' ? ',atrim=0:1.6,afade=t=out:st=1.2:d=0.4' : '';
  fl.push(`[${k}:a]aresample=48000,aformat=channel_layouts=stereo${cut},asplit=${list.length}${list.map((_, i) => `[${j}${i}]`).join('')}`);
  list.forEach(([t, , vol], i) => { fl.push(`[${j}${i}]volume=${vol},adelay=${Math.round(t * 1000)}:all=1[${j}d${i}]`); parts.push(`[${j}d${i}]`); });
});

segs.forEach(([a, b, m], i) => {
  const k = add(path.join(L, `musik-${m}.mp3`)), len = Math.max(1, b - a);
  // lagu diulang tanpa putus; tiap segmen mulai dari bagian lagu yang berbeda supaya tidak terdengar mengulang
  fl.push(`[${k}:a]aresample=48000,aformat=channel_layouts=stereo,aloop=loop=-1:size=2147483647,atrim=start=${(i * 37) % 120}:duration=${(len + 2).toFixed(3)},asetpts=PTS-STARTPTS,afade=t=in:d=2,afade=t=out:st=${(len - .5).toFixed(3)}:d=2.5,adelay=${Math.round(a * 1000)}:all=1[m${i}]`);
});
fl.push(`${segs.map((_, i) => `[m${i}]`).join('')}amix=inputs=${segs.length}:normalize=0,volume=0.62,apad=whole_dur=${D.toFixed(3)}[mus]`);
fl.push(`[mus][key]sidechaincompress=threshold=0.03:ratio=4:attack=30:release=600:makeup=1[duck]`);
if (process.env.STEM) fl.push(`[duck]atrim=0:${D.toFixed(3)}[aout]`, `[vo]anullsink`, ...parts.map(p => `${p}anullsink`)); else fl.push(`[vo][duck]${parts.join('')}amix=inputs=${2 + parts.length}:normalize=0,atrim=0:${D.toFixed(3)},afade=t=out:st=${(D - 1.5).toFixed(3)}:d=1.5,loudnorm=I=-15:TP=-1.5:LRA=11[aout]`);

const script = path.join(path.dirname(vout), '.campur.txt'); fs.writeFileSync(script, fl.join(';\n'));
execFileSync('ffmpeg', ['-v', 'error', '-y', ...inp, '-filter_complex_script', script, '-map', '0:v', '-map', '[aout]', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', '-movflags', '+faststart', vout], { stdio: 'inherit' });
fs.unlinkSync(script);
console.log(`${vout} · ${sfx.length} efek suara (${jenis.map(j => j + ' ' + sfx.filter(e => e[1] === j).length).join(', ')}) · musik ${segs.map(s => `${s[2]} ${s[0].toFixed(0)}–${s[1].toFixed(0)}s`).join(' | ')}`);
