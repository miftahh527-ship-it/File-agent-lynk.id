// Perekam frame deterministik: node capture.js stills <outdir> t1,t2,...
//                              node capture.js range <frameStart> <frameEnd> <out.mp4>
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const fs = require('fs'), path = require('path');
const DIR = __dirname;
const TL = JSON.parse(fs.readFileSync(path.join(DIR, 'timeline.json'), 'utf8'));

async function open() {
  const browser = await chromium.launch({ args: ['--disable-gpu-vsync', '--force-device-scale-factor=1'] });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
  page.on('pageerror', e => { console.error('PAGEERROR', e.message); process.exitCode = 2; });
  await page.goto('file://' + path.join(DIR, 'render.html'));
  await page.evaluate(async tl => {
    window.setTimeline(tl);
    for (const w of [500, 600, 700]) await document.fonts.load(`${w} 40px F`);
    await document.fonts.load('40px "Noto Color Emoji"', '🚀');
    await document.fonts.ready;
  }, TL);
  return { browser, page };
}
async function grab(page, t) {
  return page.evaluate(t => { window.renderAt(t); return document.getElementById('c').toDataURL('image/jpeg', 0.93); }, t);
}
(async () => {
  const [mode, ...a] = process.argv.slice(2);
  const { browser, page } = await open();
  if (mode === 'stills') {
    const out = a[0]; fs.mkdirSync(out, { recursive: true });
    for (const ts of a[1].split(',')) {
      const t = parseFloat(ts); const d = await grab(page, t);
      fs.writeFileSync(path.join(out, `f_${t.toFixed(2).padStart(7, '0')}.jpg`), Buffer.from(d.split(',')[1], 'base64'));
    }
  } else if (mode === 'range') {
    const f0 = +a[0], f1 = +a[1], out = a[2], fps = TL.fps;
    const ff = spawn('ffmpeg', ['-y', '-v', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'mjpeg', '-i', '-',
      '-c:v', 'libx264', '-preset', 'medium', '-crf', '19', '-pix_fmt', 'yuv420p', '-r', String(fps), out], { stdio: ['pipe', 'inherit', 'inherit'] });
    const t0 = Date.now();
    for (let f = f0; f < f1; f++) {
      const d = await grab(page, f / fps);
      const buf = Buffer.from(d.split(',')[1], 'base64');
      if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
      if ((f - f0) % 300 === 0) console.log(`${out}: ${f - f0}/${f1 - f0} (${((Date.now() - t0) / 1000).toFixed(0)}s)`);
    }
    ff.stdin.end(); await new Promise(r => ff.on('close', r));
  }
  await browser.close();
})();
