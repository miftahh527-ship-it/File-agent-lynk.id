// Render index.html → MP4 bersuara, paralel. Pakai: node render.mjs <folder> <keluaran.mp4> [pekerja=4] [sampai_detik]
import { createRequire } from 'module'; const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT || '/opt/node-tools/node_modules/playwright'); import { spawn, spawnSync } from 'child_process'; import fs from 'fs'; import path from 'path';
const [dir, outFile, nW = '4', until] = process.argv.slice(2), FPS = 30, abs = path.resolve(dir);
const seg = path.join(abs, '_seg'); fs.rmSync(seg, { recursive: true, force: true }); fs.mkdirSync(seg);
const b = await chromium.launch({ args: ['--disable-gpu-vsync', '--force-color-profile=srgb'] });
async function open() { const p = await b.newPage({ deviceScaleFactor: 1 }); await p.goto('file://' + abs + '/index.html?clean=1');
  await p.waitForFunction('window.OPENER && window.OPENER.ready', null, { timeout: 60000 }); const o = await p.evaluate('({W:OPENER.W,H:OPENER.H,D:OPENER.DURATION})');
  await p.setViewportSize({ width: o.W, height: o.H }); return [p, o]; }
const [p0, info] = await open(); const plan = await p0.evaluate('window.AUDIO_PLAN'); await p0.close();
const D = until ? Math.min(+until, info.D) : info.D, N = Math.round(D * FPS), n = Math.min(+nW, Math.ceil(N / 60)), per = Math.ceil(N / n);
let done = 0; const t0 = Date.now();
const tick = setInterval(() => process.stdout.write(`\r${done}/${N} frame · ${(done / ((Date.now() - t0) / 1000)).toFixed(1)} fps   `), 5000);
await Promise.all([...Array(n)].map(async (_, w) => {
  const [p] = await open(), a = w * per, z = Math.min(N, a + per), f = path.join(seg, `s${String(w).padStart(2, '0')}.mp4`);
  const ff = spawn('ffmpeg', ['-v', 'error', '-y', '-f', 'image2pipe', '-framerate', FPS, '-c:v', 'mjpeg', '-i', '-', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '18', '-pix_fmt', 'yuv420p', '-r', FPS, f]);
  const fin = new Promise(r => ff.on('close', r));
  for (let i = a; i < z; i++) { await p.evaluate(t => window.OPENER.seek(t), i / FPS); const buf = await p.screenshot({ type: 'jpeg', quality: 93 });
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r)); done++; }
  ff.stdin.end(); await fin; await p.close();
}));
clearInterval(tick); await b.close(); console.log(`\nframe selesai dalam ${((Date.now() - t0) / 1000).toFixed(0)} dtk`);
fs.writeFileSync(path.join(seg, 'list.txt'), fs.readdirSync(seg).filter(f => f.endsWith('.mp4')).sort().map(f => `file '${f}'`).join('\n'));
const vid = path.join(seg, 'video.mp4'); spawnSync('ffmpeg', ['-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', path.join(seg, 'list.txt'), '-c', 'copy', vid]);
const clips = [...(plan.vo || []), ...(plan.sfx || [])].filter(c => c.at < D);
if (!clips.length) fs.copyFileSync(vid, outFile);
else { const args = ['-v', 'error', '-y', '-i', vid]; clips.forEach(c => args.push('-i', path.resolve(abs, c.src)));
  const fl = clips.map((c, i) => `[${i + 1}:a]aresample=48000,volume=${c.vol ?? 1},adelay=${Math.round(c.at * 1000)}:all=1[a${i}]`).join(';') + ';' + clips.map((_, i) => `[a${i}]`).join('') + `amix=inputs=${clips.length}:normalize=0,loudnorm=I=-15:TP=-1.5:LRA=11,apad[a]`;
  args.push('-filter_complex', fl, '-map', '0:v', '-map', '[a]', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-t', String(D), '-movflags', '+faststart', outFile);
  const r = spawnSync('ffmpeg', args); if (r.status) console.log(r.stderr.toString().slice(-800)); }
fs.rmSync(seg, { recursive: true, force: true }); console.log('selesai →', outFile);
