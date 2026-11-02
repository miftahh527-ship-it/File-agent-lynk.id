// Render scene.html / outro.html frame-by-frame -> PNG
// Pemakaian: node render.js [fps] [file.html] [folder-frames]
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  const fps = Number(process.argv[2] || 30);
  const html = process.argv[3] || 'scene.html';
  const out = path.join(__dirname, process.argv[4] || 'frames');
  fs.rmSync(out, { recursive: true, force: true });
  fs.mkdirSync(out);
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  await page.goto('file://' + path.join(__dirname, html));
  await page.evaluate(() => document.fonts.ready);
  // logo dimuat sebagai data URL agar canvas tidak "tainted" (file://)
  const logo = 'data:image/png;base64,' + fs.readFileSync(path.join(__dirname, 'assets', 'logo-badge.png')).toString('base64');
  await page.evaluate(src => window.setLogo(src), logo);
  const total = await page.evaluate(() => window.TOTAL);
  const n = Math.round(total * fps);
  for (let i = 0; i < n; i++) {
    const dataUrl = await page.evaluate(t => { window.render(t); return document.getElementById('c').toDataURL('image/png'); }, i / fps);
    fs.writeFileSync(path.join(out, `f${String(i).padStart(5, '0')}.png`), Buffer.from(dataUrl.split(',')[1], 'base64'));
    if (i % 60 === 0) process.stdout.write(`frame ${i}/${n}\n`);
  }
  await browser.close();
})();
