// Thumbnail long (1280×720) per gaya → <gaya>/long/thumbnail-long.html
import fs from 'fs'; import path from 'path';
const M = JSON.parse(fs.readFileSync('map.json', 'utf8'));
const paths = M.negara.map(c => `<path d="${c.d}"/>`).join('');
const S = {
  a: { dir: 'A-jurnalisme', font: 'family=Barlow+Condensed:wght@700;800&family=IBM+Plex+Mono:wght@500', css: `
body{background:#0B0B0C;color:#F5F2EA;font-family:"Barlow Condensed",sans-serif} svg path{fill:#34343B;stroke:#8F897C;stroke-width:2}
.scrim{background:linear-gradient(90deg,rgba(11,11,12,.92) 0,rgba(11,11,12,.55) 55%,rgba(11,11,12,.15)),linear-gradient(0deg,rgba(11,11,12,.85),transparent 45%)}
.t{font-weight:800;font-size:178px;line-height:.92;letter-spacing:-.01em} .t s{text-decoration:none;color:#FFD400} .t .q{display:inline-block;background:#E8402F;color:#fff;padding:0 .12em}
.k{font:500 34px/1 "IBM Plex Mono",monospace;letter-spacing:.16em;text-transform:uppercase;border-left:8px solid #FFD400;padding:10px 0 10px 18px;margin-bottom:26px}` },
  b: { dir: 'B-sketsa', font: 'family=Playfair+Display:ital,wght@0,900;1,700&family=Cinzel:wght@700', css: `
body{background:#E2D3B1;color:#2B1D12;font-family:"Playfair Display",serif} svg path{fill:#D0BB8E;stroke:#4A3524;stroke-width:2.2}
.scrim{background:linear-gradient(90deg,rgba(239,228,202,.95) 0,rgba(239,228,202,.7) 52%,rgba(239,228,202,0) 80%),radial-gradient(90% 80% at 50% 50%,transparent 50%,rgba(74,53,36,.45))}
.t{font-weight:900;font-size:150px;line-height:.98} .t s{text-decoration:none;color:#9C3B1B} .t .q{font-style:italic;font-weight:700;color:#9C3B1B;border-bottom:10px solid #9C3B1B}
.k{font:700 32px/1 "Cinzel",serif;letter-spacing:.2em;text-transform:uppercase;color:#9C3B1B;border:4px double #9C3B1B;display:inline-block;padding:12px 18px;margin-bottom:24px}` },
};
for (const [m, s] of Object.entries(S)) {
  const html = `<!doctype html><html lang="id"><head><meta charset="utf-8"><title>Thumbnail long</title>
<link href="https://fonts.googleapis.com/css2?${s.font}&display=swap" rel="stylesheet">
<style>html,body{margin:0;width:1280px;height:720px;overflow:hidden;position:relative}
svg{position:absolute;left:0;top:0;width:1280px;height:720px} .scrim{position:absolute;inset:0}
.box{position:absolute;left:64px;top:70px} ${s.css}</style></head><body>
<svg viewBox="150 330 2200 1238" data-tata="dekor">${paths}</svg><div class="scrim" data-tata="dekor"></div>
<div class="box"><div class="k">1914 · 1939 · 2026</div><div class="t">PD 1 <s>→</s> PD 2<br><s>→</s> <span class="q">PD 3?</span></div></div>
</body></html>`;
  const f = path.join('..', s.dir, 'long', 'thumbnail-long.html'); fs.writeFileSync(f, html); console.log(f);
}
