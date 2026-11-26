// Thumbnail long gaya A dengan foto arsip (1280×720) → A-jurnalisme/long/thumbnail-long.{html,png}
import fs from 'fs'; import { createRequire } from 'module'; const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT || '/opt/node-tools/node_modules/playwright');
const b64 = f => 'data:image/jpeg;base64,' + fs.readFileSync('../foto/' + f).toString('base64');
const html = `<!doctype html><html lang="id"><head><meta charset="utf-8"><title>Thumbnail long</title>
<link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800;900&family=IBM+Plex+Mono:wght@500;600&display=swap" rel="stylesheet">
<style>html,body{margin:0;width:1280px;height:720px;overflow:hidden;background:#0B0B0C;color:#F5F2EA;font-family:"Barlow Condensed",sans-serif;position:relative}
.foto{position:absolute;right:-60px;top:-10px;width:840px;height:740px;-webkit-mask-image:linear-gradient(90deg,transparent 0,#000 32%);background:url(${b64('nagasaki.jpg')}) center 22%/cover;filter:grayscale(1) contrast(1.4) brightness(1.3)}
.api{position:absolute;inset:0;background:radial-gradient(60% 75% at 78% 38%,#FF8A1F 0,#E8402F 45%,#3A0A06 85%);mix-blend-mode:multiply}
.glow{position:absolute;inset:0;background:radial-gradient(28% 34% at 78% 30%,rgba(255,196,80,.55),transparent 70%);mix-blend-mode:screen}
.sc{position:absolute;inset:0;background:linear-gradient(90deg,#0B0B0C 0,#0B0B0C 36%,rgba(11,11,12,.6) 50%,rgba(11,11,12,0) 66%),linear-gradient(0deg,rgba(11,11,12,.85),transparent 35%)}
.box{position:absolute;left:58px;top:54px}
.k{font:600 30px/1 "IBM Plex Mono",monospace;letter-spacing:.12em;margin-bottom:18px}
.k b{color:#E8402F}
.t1{font-weight:800;font-size:128px;line-height:.86;letter-spacing:.005em;text-shadow:0 6px 24px rgba(0,0,0,.6)}
.t2{font-weight:900;font-size:300px;line-height:.8;color:#FFD400;letter-spacing:-.02em;text-shadow:0 10px 40px rgba(0,0,0,.7);margin-left:-8px}
.pil{display:inline-block;margin-top:22px;background:#E8402F;color:#fff;font-weight:800;font-size:64px;line-height:1;padding:12px 24px 8px;transform:rotate(-2deg);box-shadow:0 10px 30px rgba(0,0,0,.5)}
.jam{position:absolute;right:46px;bottom:40px;display:flex;align-items:center;gap:16px;background:rgba(11,11,12,.82);border:3px solid #FFD400;padding:12px 20px}
.jam svg{width:74px;height:74px}
.jam div{font:600 22px/1.2 "IBM Plex Mono",monospace;letter-spacing:.08em}
.jam div b{display:block;font:800 52px/1 "Barlow Condensed",sans-serif;color:#FFD400;letter-spacing:0}
</style></head><body>
<div class="foto"></div><div class="api"></div><div class="glow"></div><div class="sc"></div>
<div class="box"><div class="k">1914 · 1939 · <b>20??</b></div>
<div class="t1">PERANG<br>DUNIA</div><div class="t2">KE-3?</div><div class="pil">AKAN TERJADI?</div></div>
<div class="jam"><svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="44" fill="none" stroke="#F5F2EA" stroke-width="7"/><line x1="50" y1="50" x2="50" y2="14" stroke="#E8402F" stroke-width="7" stroke-linecap="round"/><line x1="50" y1="50" x2="44" y2="17" stroke="#F5F2EA" stroke-width="5" stroke-linecap="round"/><circle cx="50" cy="50" r="6" fill="#FFD400"/></svg>
<div><b>85 DETIK</b>JAM KIAMAT 2026</div></div>
</body></html>`;
const out = '../A-jurnalisme/long/thumbnail-long'; fs.writeFileSync(out + '.html', html);
const br = await chromium.launch(); const p = await br.newPage({ viewport: { width: 1280, height: 720 } });
await p.setContent(html, { waitUntil: 'networkidle' }); await p.evaluate(() => document.fonts.ready);
await p.screenshot({ path: out + '.png' }); await br.close(); console.log('ok');
