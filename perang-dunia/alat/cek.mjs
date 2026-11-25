import { SECTIONS, SHORTS, EXTRA } from './naskah.mjs';
import fs from 'fs';
const world = JSON.parse(fs.readFileSync('node_modules/world-atlas/countries-50m.json'));
const names = new Set(world.objects.countries.geometries.map(g => g.properties.name));
const miss = new Set(), cm = new Set(); let tot = 0, nb = 0;
for (const s of [...SECTIONS, ...EXTRA]) {
  const txt = s.beats.map(b => b.v).join(' '); tot += txt.length; nb += s.beats.length;
  console.log(s.id.padEnd(5), String(s.beats.length).padStart(2), 'beat', String(txt.length).padStart(5), 'kar', txt.split(/\s+/).length, 'kata');
  for (const b of s.beats) {
    for (const i of b.it || []) if (i.ic && i.ic !== 'peluru' && !fs.existsSync(`node_modules/@tabler/icons/icons/outline/${i.ic}.svg`)) miss.add(i.ic);
    for (const g of Object.values(b.hi || {})) for (const n of g) if (!names.has(n)) cm.add(n);
    for (const x of [...(b.it || []), ...(b.mk || []), ...(b.ar || [])]) if (x.k && !b.v.includes(x.k)) console.log('  KUNCI TIDAK ADA:', s.id, x.k);
    if (b.num?.k && !b.v.includes(b.num.k)) console.log('  KUNCI NUM:', s.id, b.num.k);
  }
}
let sh = 0; for (const s of SHORTS) sh += s.hook.length + s.tutup.length;
console.log('total', tot, 'kar,', nb, 'beat; short hook+tutup', sh, 'kar');
console.log('ikon hilang:', [...miss].join(' '), '| negara hilang:', [...cm].join(' | '));
