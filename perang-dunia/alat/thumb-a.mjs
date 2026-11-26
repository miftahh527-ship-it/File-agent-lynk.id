// Thumbnail long gaya A dengan foto arsip (1280×720) → A-jurnalisme/long/thumbnail-long.{html,png}
import fs from 'fs'; import { createRequire } from 'module'; const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT || '/opt/node-tools/node_modules/playwright');
const b64 = f => 'data:image/jpeg;base64,' + fs.readFileSync('../foto/' + f).toString('base64');
const html = `<!doctype html><html lang="id"><head><meta charset="utf-8"><title>Thumbnail long</title>
<link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800&family=IBM+Plex+Mono:wght@500&display=swap" rel="stylesheet">
<style>html,body{margin:0;width:1280px;height:720px;overflow:hidden;background:#0B0B0C;color:#F5F2EA;font-family:"Barlow Condensed",sans-serif}
.f{position:absolute;top:0;height:720px;background-size:auto 128%;background-position:center 45%;filter:grayscale(1) contrast(1.15) brightness(.8)}
.f1{left:430px;width:440px;background-image:url(${b64('parit.jpg')})}
.f2{left:870px;width:410px;background-image:url(${b64('hiroshima-awan.jpg')})}
.sc{position:absolute;inset:0;background:linear-gradient(90deg,#0B0B0C 0,#0B0B0C 34%,rgba(11,11,12,.55) 52%,rgba(11,11,12,0) 70%),linear-gradient(0deg,rgba(11,11,12,.7),transparent 40%)}
.gap{position:absolute;left:866px;top:0;width:8px;height:720px;background:#0B0B0C}
.box{position:absolute;left:60px;top:58px}
.k{font:500 30px/1 "IBM Plex Mono",monospace;letter-spacing:.14em;border-left:8px solid #FFD400;padding:8px 0 8px 18px;margin-bottom:22px}
.r{font-weight:800;font-size:150px;line-height:.9;white-space:nowrap}
.r i{font-style:normal;color:#FFD400;font-size:110px;margin-left:18px;vertical-align:8px}
.q{display:inline-block;background:#E8402F;color:#fff;padding:2px 22px 0;margin-top:14px}
.lab{position:absolute;bottom:26px;white-space:nowrap;font:500 20px/1 "IBM Plex Mono",monospace;letter-spacing:.12em;color:#F5F2EA;background:rgba(11,11,12,.75);padding:8px 12px}
</style></head><body>
<div class="f f1"></div><div class="f f2"></div><div class="sc"></div><div class="gap"></div>
<div class="lab" style="right:434px">PARIT · 1916</div><div class="lab" style="right:24px">HIROSHIMA · 1945</div>
<div class="box"><div class="k">1914 · 1939 · 2026</div>
<div class="r">PD 1<i>›</i></div><div class="r">PD 2<i>›</i></div><div class="r"><span class="q">PD 3?</span></div></div>
</body></html>`;
const out = '../A-jurnalisme/long/thumbnail-long'; fs.writeFileSync(out + '.html', html);
const br = await chromium.launch(); const p = await br.newPage({ viewport: { width: 1280, height: 720 } });
await p.setContent(html, { waitUntil: 'networkidle' }); await p.evaluate(() => document.fonts.ready);
await p.screenshot({ path: out + '.png' }); await br.close(); console.log('ok');
