// node capture_thumbs.js <outdir>  -> PNG/JPG thumbnail semua video
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
(async () => {
  const out = process.argv[2]; fs.mkdirSync(out, { recursive: true });
  const browser = await chromium.launch(); const page = await browser.newPage({ viewport: { width: 1920, height: 1920 } });
  page.on('pageerror', e => { console.error('PAGEERROR', e.message); process.exitCode = 2; });
  await page.goto('file://' + path.join(__dirname, 'thumb.html'));
  const names = await page.evaluate(async () => { for (const w of [500, 600, 700]) await document.fonts.load(`${w} 40px F`); await document.fonts.load('40px "Noto Color Emoji"', '🚀'); await document.fonts.ready; await window.logoReady(); return window.thumbNames(); });
  for (const n of names) {
    await page.evaluate(n => window.renderThumb(n), n);
    await page.locator('#c').screenshot({ path: path.join(out, `${n}.png`) });
  }
  await browser.close(); console.log(names.length, 'thumbnails');
})();
