// Unduh foto arsip dari Wikimedia Commons (lebar 1920 px) + catat sumber & lisensi ke foto/SUMBER.md.
// Jalankan dengan proxy: NODE_USE_ENV_PROXY=1 NODE_EXTRA_CA_CERTS=/root/.ccr/ca-bundle.crt node unduh-foto.mjs
import fs from 'fs'; import path from 'path';
const FOTO = {
  'sarajevo-mobil.jpg': 'File:Franz Ferdinand & Sophie Leave Sarajevo Guildhall in a Car.jpg',
  'franz-ferdinand.jpg': 'File:Franz Ferdinand, Erzherzog von Österreich-Este (cropped).jpg',
  'princip.jpg': 'File:Gavrilo Princip, cell, headshot, bw (cropped).jpg',
  'dreadnought.jpg': 'File:HMS Dreadnought 1906 H61017.jpg',
  'kitchener.jpg': 'File:(Kitchener) Your Country Needs You.jpg',
  'kereta-1914.jpg': 'File:German soldiers in a railroad car on the way to the front during early World War I, taken in 1914. Taken from greatwar.nl site.jpg',
  'parit.jpg': 'File:Cheshire Regiment trench Somme 1916 (higher res).png',
  'tank.jpg': 'File:British Mark I male tank Somme 25 September 1916.jpg',
  'somme.jpg': 'File:The Battle of the Somme, July-november 1916 Q3990.jpg',
  'gencatan.jpg': 'File:Ceremonies - France - Crowd in Place de la Concorde, Paris, France, celebrating the signing of the Armistice - NARA - 23922325.jpg',
  'versailles.jpg': 'File:William Orpen - The Signing of Peace in the Hall of Mirrors - Detail 5.jpg',
  'liga.jpg': 'File:Eerste zitting van de Volkenbond Genève 1920, SFA001004095.jpg',
  'antrean.jpg': 'File:Unemployed men queued outside a depression soup kitchen opened in Chicago by Al Capone, 02-1931 - NARA - 541927 (cropped).jpg',
  'pearl-harbor.jpg': 'File:The USS Arizona (BB-39) burning after the Japanese attack on Pearl Harbor - NARA 195617 - Edit.jpg',
  'proklamasi.jpg': 'File:Indonesia declaration of independence 17 August 1945.jpg',
  'dday.jpg': 'File:Into the Jaws of Death 23-0455M edit.jpg',
  ...JSON.parse(process.env.FOTO_TAMBAHAN || '{}'),
};
const UA = { 'User-Agent': 'ClaudeCode-media-research/1.0 (https://claude.ai/code; educational video)' };
const tidur = ms => new Promise(r => setTimeout(r, ms));
async function get(u, bin) {
  for (let k = 0; k < 8; k++) { const r = await fetch(u, { headers: UA });
    if (r.status === 429) { const w = Math.min(900, +(r.headers.get('retry-after') || 120)) + 20; console.log(`429, tunggu ${w} dtk`); await tidur(w * 1000); continue; }
    if (!r.ok) throw new Error(r.status + ' ' + u); const out = bin ? Buffer.from(await r.arrayBuffer()) : await r.json(); await tidur(bin ? 45000 : 4000); return out; }
  throw new Error('429 terus: ' + u); }
const dir = path.resolve('../foto'); fs.mkdirSync(dir, { recursive: true });
const catat = path.join(dir, 'SUMBER.md'), lama = fs.existsSync(catat) ? fs.readFileSync(catat, 'utf8') : '# Sumber foto\n\nSemua foto dari Wikimedia Commons, berstatus domain publik atau CC0 (dicek lewat metadata lisensi saat diunduh).\n\n| Berkas | Judul di Commons | Lisensi | Pembuat |\n|---|---|---|---|\n';
let baris = lama;
for (const [nama, judul] of Object.entries(FOTO)) {
  if (fs.existsSync(path.join(dir, nama))) { console.log('ada', nama); continue; }
  const u = 'https://commons.wikimedia.org/w/api.php?' + new URLSearchParams({ action: 'query', format: 'json', titles: judul, prop: 'imageinfo', iiprop: 'url|extmetadata', iiurlwidth: '1920', iiextmetadatafilter: 'LicenseShortName|Artist' });
  const j = await get(u), p = Object.values(j.query.pages)[0], ii = p.imageinfo?.[0];
  if (!ii) { console.log('TIDAK ADA', judul); continue; }
  const lis = ii.extmetadata?.LicenseShortName?.value || '?', art = (ii.extmetadata?.Artist?.value || '').replace(/<[^>]+>/g, '').trim().slice(0, 80);
  if (!/public domain|cc0|no restrictions/i.test(lis)) { console.log('LEWATI (lisensi ' + lis + ')', judul); continue; }
  const buf = await get(ii.thumburl || ii.url, true);
  fs.writeFileSync(path.join(dir, nama + '.tmp'), buf); fs.renameSync(path.join(dir, nama + '.tmp'), path.join(dir, nama));
  baris += `| ${nama} | [${judul.replace('File:', '')}](${ii.descriptionurl}) | ${lis} | ${art || '–'} |\n`;
  fs.writeFileSync(catat, baris); console.log('ok', nama, lis, buf.length);
}
