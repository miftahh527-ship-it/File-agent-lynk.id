// Thumbnail Short (1080×1920) per gaya → <gaya>/short-N/thumbnail-short.html
import fs from 'fs'; import path from 'path';
const M = JSON.parse(fs.readFileSync('map.json', 'utf8'));
const RAD = Math.PI / 180;
const proj = ([lon, lat]) => [M.W / 2 + M.R * RAD * (((lon - 150 + 540) % 360) - 180), M.Y0 - M.R * Math.log(Math.tan(Math.PI / 4 + lat * RAD / 2))];
const ISO = { s4: ['Germany'], s5: ['Indonesia'], s7: ['Indonesia'], s8: ['Indonesia'], s2: ['Serbia', 'Bosnia and Herz.'], s3: ['France'], s1: ['Germany', 'Austria', 'Hungary'] };

// Tiap Short: pusat peta [lon, lat], lebar tampilan (px peta), teks kecil, judul (*kuning* = warna aksen)
const T = [
  ['s1', [15, 48], 900, 'Penyebab Perang Dunia I', '*M·A·I·N*<br>empat huruf<br>pemicu perang'],
  ['s2', [18, 45], 700, 'Sarajevo, 1914', '2 peluru,<br>*1 minggu*,<br>Eropa terbakar'],
  ['s3', [3, 49], 600, 'Perang parit 1916', '*20.000*<br>tewas dalam<br>satu hari'],
  ['s4', [10, 51], 700, 'Jerman, 1923', 'Uang lebih<br>murah dari<br>*kayu bakar*'],
  ['s5', [115, -3], 1300, 'Agustus 1945', '15 → *17*<br>kenapa<br>dua hari?'],
  ['s6', [60, 30], 2600, 'Khawatir atau tenang?', 'Perang<br>Dunia<br>*III?*'],
  ['s7', [115, -3], 1300, 'Versi BNPB', 'Tas siaga<br>*3 hari*:<br>isinya apa?'],
  ['s8', [115, -3], 1300, 'Bahas malam ini', 'Kalau terpisah,<br>kumpul<br>*di mana?*'],
];

const S = {
  a: { dir: 'A-jurnalisme', font: 'family=Barlow+Condensed:wght@700;800&family=IBM+Plex+Mono:wght@500', css: `
body{background:#0B0B0C;color:#F5F2EA;font-family:"Barlow Condensed",sans-serif} svg path{fill:#34343B;stroke:#8F897C;stroke-width:1.4} svg path.on{fill:#D9B500}
.scrim{background:linear-gradient(0deg,rgba(11,11,12,.97) 0,rgba(11,11,12,.88) 42%,rgba(11,11,12,.1) 70%),radial-gradient(80% 60% at 50% 30%,transparent 50%,rgba(0,0,0,.5))}
.t{font-weight:800;font-size:178px;line-height:.92;letter-spacing:-.01em} .t s{text-decoration:none;color:#FFD400}
.k{font:500 40px/1 "IBM Plex Mono",monospace;letter-spacing:.14em;text-transform:uppercase;border-left:10px solid #FFD400;padding:12px 0 12px 22px;margin-bottom:40px;display:inline-block}` },
  b: { dir: 'B-sketsa', font: 'family=Playfair+Display:ital,wght@0,900;1,700&family=Cinzel:wght@700', css: `
body{background:#E2D3B1;color:#2B1D12;font-family:"Playfair Display",serif} svg path{fill:#D0BB8E;stroke:#4A3524;stroke-width:1.6} svg path.on{fill:#C19A3A}
.scrim{background:linear-gradient(0deg,rgba(239,228,202,.98) 0,rgba(239,228,202,.9) 42%,rgba(239,228,202,0) 72%),radial-gradient(90% 80% at 50% 40%,transparent 50%,rgba(74,53,36,.45))}
.t{font-weight:900;font-size:150px;line-height:1} .t s{text-decoration:none;font-style:italic;font-weight:700;color:#9C3B1B}
.k{font:700 38px/1 "Cinzel",serif;letter-spacing:.18em;text-transform:uppercase;color:#9C3B1B;border:5px double #9C3B1B;display:inline-block;padding:14px 22px;margin-bottom:40px}` },
};

for (const [m, s] of Object.entries(S)) for (const [id, c, w, k, t] of T) {
  const [x, y] = proj(c), h = w * 1920 / 1080, vb = `${x - w / 2} ${y - h * .32} ${w} ${h}`;
  const on = ISO[id] || [];
  const paths = M.negara.map(n => `<path${on.includes(n.n) ? ' class="on"' : ''} d="${n.d}"/>`).join('');
  const html = `<!doctype html><html lang="id"><head><meta charset="utf-8"><title>Thumbnail ${id}</title>
<link href="https://fonts.googleapis.com/css2?${s.font}&display=swap" rel="stylesheet">
<style>html,body{margin:0;width:1080px;height:1920px;overflow:hidden;position:relative}
svg{position:absolute;left:0;top:0;width:1080px;height:1920px} .scrim{position:absolute;inset:0}
.box{position:absolute;left:80px;right:80px;bottom:300px} ${s.css}</style></head><body>
<svg viewBox="${vb}" preserveAspectRatio="xMidYMid slice" data-tata="dekor">${paths}</svg><div class="scrim" data-tata="dekor"></div>
<div class="box"><div class="k">${k}</div><div class="t">${t.replace(/\*(.+?)\*/g, '<s>$1</s>')}</div></div>
</body></html>`;
  const f = path.join('..', s.dir, 'short-' + id.slice(1), 'thumbnail-short.html'); fs.writeFileSync(f, html); console.log(f);
}
