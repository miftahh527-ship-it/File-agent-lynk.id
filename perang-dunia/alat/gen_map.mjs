// Peta dunia dari Natural Earth (world-atlas 50m), Mercator berpusat 150° BT → map.json {W,H,R,negara:[{n,d}]}
import fs from 'fs';
import { feature } from 'topojson-client';
import { geoMercator, geoPath } from 'd3-geo';
const topo = JSON.parse(fs.readFileSync('node_modules/world-atlas/countries-50m.json'));
const fc = feature(topo, topo.objects.countries);
const W = 4000, R = W / (2 * Math.PI), Y0 = 1500, H = 2300;
const proj = geoMercator().rotate([-150, 0]).scale(R).translate([W / 2, Y0]).clipExtent([[0, 40], [W, H]]);
const path = geoPath(proj).digits(1);
const flat = geoPath(proj);
const out = [];
for (const f of fc.features) {
  if (f.properties.name === 'Antarctica') continue;
  // buang pulau sangat kecil supaya ringan
  const g = f.geometry;
  if (g.type === 'MultiPolygon') {
    const polys = g.coordinates.map(c => ({ c, a: flat.area({ type: 'Polygon', coordinates: c }) })).sort((a, b) => b.a - a.a);
    g.coordinates = polys.filter((p, i) => i === 0 || p.a > 1.2).map(p => p.c);
  }
  const d = path(f); if (!d) continue;
  out.push({ n: f.properties.name, d });
}
fs.writeFileSync('map.json', JSON.stringify({ W, H, R, Y0, negara: out }));
console.log(out.length, 'negara', (fs.statSync('map.json').size / 1024 | 0) + ' KB');
