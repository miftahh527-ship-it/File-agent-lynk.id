// Potret detik kunci -> lembar kontak. node tools/snap.js <file.html> <out.jpg> t1 t2 ...
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const [html, out, ...ts] = process.argv.slice(2);
  const b = await chromium.launch({ args: ['--allow-file-access-from-files'] });
  const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  p.on('pageerror', e => console.log('ERR', e.message));
  p.on('console', m => { if (m.type() === 'error') console.log('CONSOLE', m.text()); });
  await p.goto('file://' + path.resolve(html) + '?clean=1');
  await p.waitForFunction(() => window.OPENER && window.OPENER.ready);
  const shots = [];
  for (const t of ts) { await p.evaluate(t => OPENER.seek(+t), t); await p.waitForTimeout(60);
    shots.push((await p.screenshot({ type: 'jpeg', quality: 70 })).toString('base64')); }
  // lembar kontak 3 kolom
  const cols = 3, w = 640, h = 360;
  await p.setViewportSize({ width: cols * w, height: Math.ceil(shots.length / cols) * (h + 30) });
  await p.setContent(`<body style="margin:0;background:#222;display:flex;flex-wrap:wrap;width:${cols * w}px">` +
    shots.map((s, i) => `<div style="width:${w}px;height:${h + 30}px;color:#fff;font:20px monospace"><img src="data:image/jpeg;base64,${s}" width="${w}" height="${h}"><div>${ts[i]}s</div></div>`).join('') + '</body>');
  await p.screenshot({ path: out, type: 'jpeg', quality: 80, fullPage: true });
  await b.close();
})();
