// node capture_short.js <short.json> stills <outdir> t1,t2,...   |   node capture_short.js <short.json> video <out.mp4>
const { chromium } = require('playwright'); const { spawn } = require('child_process');
const fs = require('fs'), path = require('path');
(async () => {
  const [jf, mode, a, b] = process.argv.slice(2); const S = JSON.parse(fs.readFileSync(jf, 'utf8'));
  const browser = await chromium.launch(); const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  page.on('pageerror', e => { console.error('PAGEERROR', e.message); process.exitCode = 2; });
  await page.goto('file://' + path.join(__dirname, 'portrait.html'));
  await page.evaluate(async s => { window.setShort(s); for (const w of [500, 600, 700]) await document.fonts.load(`${w} 40px F`); await document.fonts.load('40px "Noto Color Emoji"', '🚀'); await document.fonts.ready; }, S);
  const grab = t => page.evaluate(t => { window.renderShort(t); return document.getElementById('c').toDataURL('image/jpeg', 0.93); }, t);
  if (mode === 'stills') { fs.mkdirSync(a, { recursive: true }); for (const ts of b.split(',')) { const d = await grab(+ts); fs.writeFileSync(path.join(a, `${path.basename(jf, '.json')}_${(+ts).toFixed(2).padStart(6, '0')}.jpg`), Buffer.from(d.split(',')[1], 'base64')); } }
  else {
    const ff = spawn('ffmpeg', ['-y', '-v', 'error', '-f', 'image2pipe', '-framerate', '30', '-c:v', 'mjpeg', '-i', '-', '-c:v', 'libx264', '-preset', 'medium', '-crf', '19', '-pix_fmt', 'yuv420p', a], { stdio: ['pipe', 'inherit', 'inherit'] });
    const N = Math.round(S.duration * 30);
    for (let f = 0; f < N; f++) { const buf = Buffer.from((await grab(f / 30)).split(',')[1], 'base64'); if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r)); }
    ff.stdin.end(); await new Promise(r => ff.on('close', r));
  }
  await browser.close();
})();
