#!/usr/bin/env python3
"""Motion Format — peta SVG yang AKURAT dari data Natural Earth (bukan digambar tangan).

Benua, negara, dan garis pantai diambil dari data geografi asli (Natural Earth 1:50m, domain publik,
lewat world-atlas) lalu diproyeksikan dengan d3-geo di Chrome headless. Hasilnya SVG bersih yang
bisa ditempel inline di index.html: tiap benua/negara satu <path> ber-id (untuk dianimasikan),
batas negara rapi, tanpa celah atau tumpang tindih. Semua data & pustaka ada di assets/data/
(tanpa internet).

Pemakaian:
  python3 peta_svg.py dunia.svg                                    # dunia per benua, tanpa Antartika
  python3 peta_svg.py dunia.svg --mode negara                      # dunia per negara
  python3 peta_svg.py asia.svg --wilayah benua:Asia --konteks      # Asia + dunia samar di sekitarnya
  python3 peta_svg.py asean.svg --wilayah negara:IDN,MYS,SGP,THA,VNM,PHL,BRN,KHM,LAO,MMR --mode negara
  python3 peta_svg.py ri.svg --wilayah negara:Indonesia --sorot IDN --konteks --ukuran 1600x900
  python3 peta_svg.py bola.svg --proyeksi orthographic --pusat 118,-2 --ukuran 900x900 --garis
  python3 peta_svg.py dunia.svg --batas --png                       # + garis batas negara + pratinjau PNG

Wilayah:  dunia · benua:Asia,Eropa (nama Indonesia/Inggris) · negara:IDN,Malaysia (kode ISO A3 atau
          nama) · region:South-Eastern Asia (subregion Natural Earth). --tambah / --buang kode
          negara untuk menyesuaikan. Rusia otomatis dipotong di Ural (Siberia = Asia); --rusia eropa
          untuk data asli.
Keluaran: <nama>.svg + <nama>.json (titik label & kotak tiap bentuk dalam koordinat SVG, supaya label
          ditaruh di tempat yang tepat, bukan ditebak) [+ <nama>.png dengan --png].
"""
import argparse, base64, json, os, pathlib, shutil, subprocess, sys, tempfile, time, urllib.request

HERE = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))
from render_mp4 import WS, evaluate, find_chrome  # noqa: E402

DATA = HERE.parent / 'assets' / 'data'
PORT = 9336

JS = r"""
(() => {
const T = window.TOPO, N = window.NEGARA.negara, O = window.OPT;
const geoms = T.objects.countries.geometries;
const info = g => N[g.id] || N[g.properties.name] || {};
const low = s => String(s || '').toLowerCase().trim();
const eq = (a, b) => low(a) === low(b);
const any = (list, g) => { const i = info(g);
  return list.some(v => eq(v, i.a3) || eq(v, i.nama) || eq(v, i.nama_id) || eq(v, g.id)); };
const slug = s => low(s).normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const W = O.W, H = O.H, pad = O.pad;

function inRegion(g) {
  const i = info(g), w = O.wilayah;
  if (any(O.buang, g)) return false;
  if (any(O.tambah, g)) return true;
  if (w.tipe === 'dunia') return O.antartika || i.benua !== 'Antarctica';
  if (w.tipe === 'benua') return w.nilai.some(v => eq(v, i.benua) || eq(v, i.benua_id));
  if (w.tipe === 'negara') return any(w.nilai, g);
  if (w.tipe === 'region') return w.nilai.some(v => eq(v, i.region));
  return false;
}
// Rusia: Natural Earth memasukkan seluruh Rusia ke Eropa. Dengan --rusia ural (bawaan) Rusia dipotong di
// Pegunungan Ural – Sungai Ural: bagian barat = Eropa, Siberia = Asia (konvensi atlas sekolah).
const URAL = [[20, 40], [20, 85], [69.5, 85], [69.5, 76], [61, 70.3], [66.3, 68.6], [60, 64], [59.5, 58], [59, 55], [59.3, 51.5], [59.3, 45], [20, 40]];   // Novaya Zemlya & Yugra = Eropa, Yamal = Asia
const PC = window.polygonClipping;
function fixWinding(coords) {     // polygon-clipping → aturan putaran d3 (luas bola < 2π)
  return coords.map(poly => d3.geoArea({type: 'Polygon', coordinates: poly}) > 2 * Math.PI ? poly.map(r => r.slice().reverse()) : poly);
}
const multi = g => g.type === 'Polygon' ? [g.coordinates] : g.coordinates;
const asGeo = c => ({type: 'MultiPolygon', coordinates: fixWinding(c)});
const rusG = geoms.find(g => g.id === '643');
const splitRus = O.rusia === 'ural' && rusG && ['dunia', 'benua'].includes(O.wilayah.tipe) && !any(O.buang, rusG);
let rusPart = {};
if (splitRus) {
  // buka garis 180°: bujur negatif (Chukotka) +360 supaya pemotongan bidang datar tidak membuat pita palsu
  const R = multi(topojson.feature(T, rusG).geometry).map(poly => poly.map(ring => ring.map(([x, y]) => [x < 0 ? x + 360 : x, y])));
  rusPart = {Eropa: PC.intersection(R, [URAL]), Asia: PC.difference(R, [URAL])};
}
function inRegionRus(b) {       // bagian Rusia yang masuk wilayah
  const w = O.wilayah;
  return w.tipe === 'dunia' || w.nilai.some(v => eq(v, b) || eq(v, b === 'Eropa' ? 'Europe' : 'Asia'));
}
const rusIn = splitRus ? Object.keys(rusPart).filter(inRegionRus) : [];
const sel = geoms.filter(g => !(splitRus && g === rusG) && inRegion(g));
if (!sel.length && !rusIn.length) return JSON.stringify({error: 'Tidak ada negara yang cocok dengan --wilayah/--tambah.'});
const selFC = topojson.feature(T, {type: 'GeometryCollection', geometries: sel});
for (const b of rusIn) selFC.features.push({type: 'Feature', properties: {}, geometry: asGeo(rusPart[b])});
// bingkai dipaskan ke DARATAN UTAMA tiap negara: wilayah seberang laut yang jauh (Guyana Prancis,
// Réunion, Hawaii…) tetap digambar tetapi tidak membuat peta ter-zoom-out
function mainland(f) {
  const ps = multi(f.geometry);
  if (ps.length < 2) return f;
  let big = ps[0], ba = -1;
  for (const c of ps) { const a = d3.geoArea({type: 'Polygon', coordinates: c}); if (a > ba) { ba = a; big = c; } }
  const c0 = d3.geoCentroid({type: 'Polygon', coordinates: big});
  const keep = ps.filter(c => d3.geoDistance(d3.geoCentroid({type: 'Polygon', coordinates: c}), c0) < 0.5);
  return {type: 'Feature', properties: {}, geometry: {type: 'MultiPolygon', coordinates: keep}};
}
const fitFC = {type: 'FeatureCollection', features: selFC.features.map(mainland)};
const selTopo = splitRus && rusIn.length ? sel.concat([rusG]) : sel;   // untuk garis batas & konteks

const P = {
  'natural-earth': d3.geoNaturalEarth1, 'equal-earth': d3.geoEqualEarth, 'mercator': d3.geoMercator,
  'equirectangular': d3.geoEquirectangular, 'orthographic': d3.geoOrthographic,
  'conic': d3.geoConicEqualArea
};
let name = O.proyeksi === 'auto' ? (O.wilayah.tipe === 'dunia' ? 'natural-earth' : 'mercator') : O.proyeksi;
if (!P[name]) return JSON.stringify({error: 'Proyeksi tidak dikenal: ' + name});
const proj = P[name]();
const ext = [[pad, pad], [W - pad, H - pad]];
if (name === 'orthographic') {
  const c = O.pusat || d3.geoCentroid(selFC);
  proj.rotate([-c[0], -c[1]]).fitExtent(ext, {type: 'Sphere'});
} else if (O.wilayah.tipe === 'dunia') {
  if (O.pusat) proj.rotate([-O.pusat[0], 0]);
  proj.fitExtent(ext, O.antartika ? {type: 'Sphere'} : fitFC);
} else {
  const c = O.pusat || d3.geoCentroid(fitFC);
  proj.rotate([-c[0], 0]);                    // wilayah di tengah: tidak terbelah garis 180°
  if (name === 'conic') proj.parallels([c[1] - 10, c[1] + 10]);
  proj.fitExtent(ext, fitFC);
}
const path = d3.geoPath(proj).digits(O.digit);
const out = [], anchors = [];
const fmt = (d, attrs) => d ? `<path ${Object.entries(attrs).map(([k, v]) => `${k}="${String(v).replace(/"/g, '&quot;')}"`).join(' ')} d="${d}"/>` : '';
function anchor(id, nama, geo) {
  // titik label = pusat poligon TERBESAR (Indonesia/Kanada tidak berlabel di tengah laut)
  let best = geo, area = -1;
  if (geo.type === 'MultiPolygon') for (const c of geo.coordinates) {
    const g = {type: 'Polygon', coordinates: c}, a = path.area(g);
    if (a > area) { area = a; best = g; }
  }
  const [x, y] = path.centroid(best), b = path.bounds(geo);
  if (isFinite(x)) anchors.push({id, nama, x: +x.toFixed(1), y: +y.toFixed(1),
    kotak: b.map(p => p.map(v => +v.toFixed(1)))});
}

if (O.bola) out.push(fmt(path({type: 'Sphere'}), {class: 'laut'}));
if (O.garis) out.push(fmt(path(d3.geoGraticule10()), {class: 'garis-lintang'}));
if (O.konteks) {
  const rest = geoms.filter(g => !selTopo.includes(g) && (O.antartika || info(g).benua !== 'Antarctica'));
  if (rest.length) out.push(fmt(path(topojson.merge(T, rest)), {class: 'konteks'}));
}
if (O.mode === 'benua') {
  const groups = {};
  for (const g of sel) { const b = info(g).benua_id || 'Lain'; (groups[b] = groups[b] || []).push(g); }
  for (const b of rusIn) groups[b] = groups[b] || [];
  out.push('<g class="benua-semua">');
  for (const [b, list] of Object.entries(groups)) {
    let geo = list.length ? topojson.merge(T, list) : null, id = 'benua-' + slug(b);
    if (rusIn.includes(b)) geo = asGeo(geo ? PC.union(multi(geo), rusPart[b]) : rusPart[b]);
    out.push(fmt(path(geo), {id, class: 'benua ' + id, 'data-nama': b}));
    anchor(id, b, geo);
  }
  out.push('</g>');
} else {
  out.push('<g class="negara-semua">');
  for (const b of rusIn) {        // potongan Rusia per benua (mode negara + wilayah dunia/benua)
    const id = 'negara-rus-' + slug(b), geo = asGeo(rusPart[b]);
    out.push(fmt(path(geo), {id, class: 'negara benua-' + slug(b), 'data-nama': 'Rusia (' + b + ')'}));
    anchor(id, 'Rusia (' + b + ')', geo);
  }
  for (const g of sel) {
    const i = info(g), id = 'negara-' + slug(i.a3 || g.properties.name);
    const f = topojson.feature(T, g);
    out.push(fmt(path(f), {id, class: 'negara ' + 'benua-' + slug(i.benua_id || 'lain'), 'data-nama': i.nama_id || g.properties.name}));
    anchor(id, i.nama_id || g.properties.name, f.geometry);
  }
  out.push('</g>');
}
if (O.batas) out.push(fmt(path(topojson.mesh(T, {type: 'GeometryCollection', geometries: selTopo}, (a, b) => a !== b)), {class: 'batas'}));
if (O.sorot.length) {
  out.push('<g class="sorot-semua">');
  for (const g of geoms.filter(g => any(O.sorot, g))) {
    const i = info(g), id = 'sorot-' + slug(i.a3 || g.properties.name), f = topojson.feature(T, g);
    out.push(fmt(path(f), {id, class: 'sorot', 'data-nama': i.nama_id || g.properties.name}));
    anchor(id, i.nama_id || g.properties.name, f.geometry);
  }
  out.push('</g>');
}
const css = `
  .laut{fill:#eef3f6}
  .garis-lintang{fill:none;stroke:#0002;stroke-width:1;vector-effect:non-scaling-stroke}
  .konteks{fill:#1d1d1b;opacity:.08}
  .benua,.negara{fill:#d8cdb8;stroke:#fff;stroke-width:1;stroke-linejoin:round;vector-effect:non-scaling-stroke}
  .benua-asia{fill:#e9b44c}.benua-eropa{fill:#6fa8a0}.benua-afrika{fill:#e07a5f}
  .benua-amerika-utara{fill:#8fa6cf}.benua-amerika-selatan{fill:#9cbf7f}.benua-oseania{fill:#c79acb}
  .benua-antartika{fill:#e6ecef}
  .batas{fill:none;stroke:#fff;stroke-width:1;stroke-linejoin:round;opacity:.9;vector-effect:non-scaling-stroke}
  .sorot{fill:#d1495b;stroke:#fff;stroke-width:1.5;vector-effect:non-scaling-stroke}`;
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" class="peta">` +
  `<style>${O.gaya ? css : ''}</style>\n` + out.filter(Boolean).join('\n') + '\n</svg>';
return JSON.stringify({svg, anchors, proyeksi: name, negara: sel.length + (rusIn.length ? 1 : 0)});
})()
"""


def main():
    ap = argparse.ArgumentParser(description='Buat peta SVG akurat (Natural Earth) untuk motion graphic.')
    ap.add_argument('keluaran', help='berkas .svg keluaran')
    ap.add_argument('--wilayah', default='dunia', help='dunia | benua:Asia,Eropa | negara:IDN,MYS | region:South-Eastern Asia')
    ap.add_argument('--mode', choices=['benua', 'negara'], default='', help='satu bentuk per benua (batas dilebur) atau per negara')
    ap.add_argument('--proyeksi', default='auto', help='auto | natural-earth | equal-earth | mercator | equirectangular | orthographic | conic')
    ap.add_argument('--pusat', default='', help='bujur,lintang pusat peta/bola, mis. 118,-2 (Indonesia)')
    ap.add_argument('--ukuran', default='1600x900', help='LEBARxTINGGI SVG (px)')
    ap.add_argument('--tepi', type=int, default=24, help='jarak peta ke tepi SVG (px)')
    ap.add_argument('--detail', choices=['50m', '110m'], default='50m', help='50m = garis pantai rinci, 110m = ringan')
    ap.add_argument('--sorot', default='', help='negara yang disorot (lapisan terpisah), mis. IDN,MYS')
    ap.add_argument('--tambah', default='', help='negara yang ditambahkan ke wilayah')
    ap.add_argument('--buang', default='', help='negara yang dibuang dari wilayah')
    ap.add_argument('--konteks', action='store_true', help='gambar sisa dunia samar di sekitar wilayah')
    ap.add_argument('--batas', action='store_true', help='tambah garis batas negara di dalam wilayah')
    ap.add_argument('--garis', action='store_true', help='tambah garis lintang-bujur')
    ap.add_argument('--bola', action='store_true', help='gambar laut/bola (otomatis untuk orthographic)')
    ap.add_argument('--rusia', choices=['ural', 'eropa'], default='ural',
                    help='ural = Rusia dipotong di Pegunungan Ural (Siberia ikut Asia, bawaan); eropa = seluruh Rusia di Eropa (data asli Natural Earth)')
    ap.add_argument('--antartika', action='store_true', help='sertakan Antartika (default tidak, untuk dunia)')
    ap.add_argument('--tanpa-gaya', action='store_true', help='tanpa <style> bawaan (warnai sendiri lewat CSS halaman)')
    ap.add_argument('--digit', type=int, default=1, help='desimal koordinat (1 = cukup untuk video, berkas kecil)')
    ap.add_argument('--png', action='store_true', help='buat juga pratinjau PNG untuk dicek dengan mata')
    a = ap.parse_args()

    W, H = (int(x) for x in a.ukuran.lower().split('x'))
    tipe, _, nilai = a.wilayah.partition(':')
    tipe = tipe.strip().lower()
    if tipe not in ('dunia', 'benua', 'negara', 'region'):
        sys.exit('--wilayah harus dunia | benua:… | negara:… | region:…')
    split = lambda s: [x.strip() for x in s.split(',') if x.strip()]
    opt = {
        'W': W, 'H': H, 'pad': a.tepi, 'digit': a.digit,
        'wilayah': {'tipe': tipe, 'nilai': split(nilai)},
        'mode': a.mode or ('benua' if tipe in ('dunia', 'benua') else 'negara'),
        'proyeksi': a.proyeksi, 'pusat': [float(v) for v in a.pusat.split(',')] if a.pusat else None,
        'sorot': split(a.sorot), 'tambah': split(a.tambah), 'buang': split(a.buang),
        'konteks': a.konteks, 'batas': a.batas, 'garis': a.garis,
        'bola': a.bola or a.proyeksi == 'orthographic', 'antartika': a.antartika, 'gaya': not a.tanpa_gaya,
        'rusia': a.rusia,
    }
    libs = ''.join((DATA / f).read_text() + '\n' for f in ('d3-array.min.js', 'd3-geo.min.js', 'topojson-client.min.js', 'polygon-clipping.min.js'))
    topo = (DATA / f'countries-{a.detail}.json').read_text()
    neg = (DATA / 'negara.json').read_text()

    tmp = pathlib.Path(tempfile.mkdtemp(prefix='mf-peta-'))
    page = tmp / 'peta.html'
    page.write_text('<!doctype html><meta charset="utf-8"><body style="margin:0;background:#fff">'
                    f'<script>{libs}</script><script>window.TOPO={topo};window.NEGARA={neg};'
                    f'window.OPT={json.dumps(opt)};</script><div id="out"></div></body>')
    chrome = find_chrome()
    args = [chrome, '--headless=new', f'--remote-debugging-port={PORT}', f'--user-data-dir={tmp / "prof"}',
            '--hide-scrollbars', '--force-device-scale-factor=1', '--allow-file-access-from-files', 'about:blank']
    if hasattr(os, 'geteuid') and os.geteuid() == 0:
        args.insert(1, '--no-sandbox')
    proc = subprocess.Popen(args, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    try:
        tab = None
        for _ in range(150):
            try:
                tab = next(t for t in json.load(urllib.request.urlopen(f'http://127.0.0.1:{PORT}/json')) if t.get('type') == 'page')
                break
            except Exception:
                time.sleep(.2)
        if not tab:
            sys.exit(f'Chrome tidak merespons (port {PORT}).')
        ws = WS(tab['webSocketDebuggerUrl'])
        ws.call('Page.enable')
        ws.call('Emulation.setDeviceMetricsOverride', width=W, height=H, deviceScaleFactor=1, mobile=False)
        ws.call('Page.navigate', url=page.as_uri())
        for _ in range(300):
            if evaluate(ws, 'document.readyState==="complete" && !!window.topojson && !!window.d3') :
                break
            time.sleep(.1)
        res = json.loads(evaluate(ws, JS))
        if 'error' in res:
            sys.exit(res['error'])
        out = pathlib.Path(a.keluaran).resolve()
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_text(res['svg'])
        out.with_suffix('.json').write_text(json.dumps({'ukuran': [W, H], 'proyeksi': res['proyeksi'],
                                                        'bentuk': res['anchors']}, ensure_ascii=False, indent=1))
        if a.png:
            evaluate(ws, 'document.getElementById("out").innerHTML=%s,1' % json.dumps(res['svg']))
            time.sleep(.3)
            shot = ws.call('Page.captureScreenshot', format='png', clip={'x': 0, 'y': 0, 'width': W, 'height': H, 'scale': 1})
            out.with_suffix('.png').write_bytes(base64.b64decode(shot['data']))
    finally:
        proc.terminate()
        shutil.rmtree(tmp, ignore_errors=True)
    kb = out.stat().st_size / 1024
    print(f'Peta: {out} ({W}×{H}, proyeksi {res["proyeksi"]}, {res["negara"]} negara, {len(res["anchors"])} bentuk, {kb:.0f} KB)')
    print(f'Titik label & kotak: {out.with_suffix(".json")}' + (f'\nPratinjau: {out.with_suffix(".png")}' if a.png else ''))
    if kb > 900:
        print('Catatan: berkas besar — pertimbangkan --detail 110m atau --digit 0 bila peta tampil kecil.')


if __name__ == '__main__':
    main()
