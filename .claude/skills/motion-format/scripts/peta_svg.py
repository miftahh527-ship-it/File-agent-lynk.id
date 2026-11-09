#!/usr/bin/env python3
"""Motion Format — peta benua & pulau sebagai SVG rapi, DIGAMBAR SENDIRI (tanpa data/pustaka unduhan).

Garis pantai berasal dari scripts/peta_data.py (titik bujur-lintang yang ditulis tangan). Script ini
memproyeksikannya (rumus proyeksi ditulis sendiri), menghaluskan garis pantai dengan kurva
Catmull-Rom, menggambar batas darat antar-benua lurus dan rapat, lalu menulis SVG bersih: satu
<path> ber-id per benua (atau per pulau) untuk dianimasikan, + JSON titik label, + PNG pratinjau.
Python 3 murni; Chrome hanya untuk --png.

Pemakaian:
  python3 peta_svg.py dunia.svg --png                                   # dunia per benua
  python3 peta_svg.py asia.svg --wilayah benua:Asia --konteks --png     # Asia + benua lain samar
  python3 peta_svg.py ri.svg --wilayah indonesia --mode pulau --konteks --png
  python3 peta_svg.py jawa-bali.svg --wilayah pulau:Jawa,Madura,Bali --mode pulau
  python3 peta_svg.py bola.svg --proyeksi orthographic --pusat 118,-2 --ukuran 900x900 --garis --png
  python3 peta_svg.py dunia.svg --sorot Asia --konteks                  # Asia disorot

Wilayah: dunia · benua:Asia,Eropa (Amerika Utara, Amerika Selatan, Eropa, Afrika, Asia, Oseania) ·
         pulau:Sumatra,Jawa (nama bentuk di peta_data.py) · indonesia (pulau-pulau utama Indonesia).
Mode:    benua = satu path per benua · pulau = satu path per pulau/daratan.
Proyeksi: auto (dunia → natural-earth, wilayah → mercator) · natural-earth · equirectangular ·
         mercator · orthographic (bola dunia).
"""
import argparse, base64, json, math, os, pathlib, re, shutil, subprocess, sys, tempfile, time, urllib.request

HERE = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))
import peta_data as D  # noqa: E402

R = math.pi / 180


def slug(s):
    s = s.lower()
    for a, b in (('é', 'e'), ('è', 'e'), ('á', 'a'), ('ó', 'o')):
        s = s.replace(a, b)
    return re.sub(r'[^a-z0-9]+', '-', s).strip('-')


# ---------------- proyeksi (lon/lat derajat relatif pusat → x,y dengan y ke atas) ----------------
def p_natural_earth(l, p):
    l, p = l * R, p * R
    p2 = p * p
    p4 = p2 * p2
    x = l * (0.8707 - 0.131979 * p2 + p4 * (-0.013791 + p4 * (0.003971 * p2 - 0.001529 * p4)))
    y = p * (1.007226 + p2 * (0.015085 + p4 * (-0.044475 + 0.028874 * p2 - 0.005916 * p4)))
    return x, y


def p_equirect(l, p):
    return l * R, p * R


def p_mercator(l, p):
    p = max(-85.0, min(85.0, p))
    return l * R, math.log(math.tan(math.pi / 4 + p * R / 2))


PROJ = {'natural-earth': p_natural_earth, 'equirectangular': p_equirect, 'mercator': p_mercator}


def ortho_vec(l, p, l0, p0):
    """koordinat 3D setelah rotasi; z > 0 = terlihat."""
    l, p, l0, p0 = l * R, p * R, l0 * R, p0 * R
    x = math.cos(p) * math.sin(l - l0)
    y = math.cos(p0) * math.sin(p) - math.sin(p0) * math.cos(p) * math.cos(l - l0)
    z = math.sin(p0) * math.sin(p) + math.cos(p0) * math.cos(p) * math.cos(l - l0)
    return x, y, z


# ---------------- geometri ----------------
def rel_ring(ring, l0):
    """bujur relatif pusat, dibuat kontinu di sepanjang cincin, dijepit ke ±180."""
    out, prev = [], None
    for lon, lat in ring:
        r = ((lon - l0 + 540) % 360) - 180
        if prev is not None:
            while r - prev > 180:
                r -= 360
            while r - prev < -180:
                r += 360
        out.append([r, lat])
        prev = r
    mid = (max(p[0] for p in out) + min(p[0] for p in out)) / 2
    shift = -360 if mid > 180 else (360 if mid < -180 else 0)
    return [(max(-180.0, min(180.0, a + shift)), b) for a, b in out]


def ortho_ring(ring, l0, p0, hard):
    """potong cincin di cakrawala bola; titik cakrawala ditandai keras (digambar lurus/busur)."""
    vs = [ortho_vec(lon, lat, l0, p0) for lon, lat in ring]
    n = len(vs)
    if not any(v[2] > 0 for v in vs):
        return []
    start = next(i for i in range(n) if vs[i][2] > 0)
    out, exit_ang = [], None

    def horizon(a, b):
        lo, hi = 0.0, 1.0            # a terlihat, b tidak
        for _ in range(30):
            m = (lo + hi) / 2
            v = [a[k] + (b[k] - a[k]) * m for k in range(3)]
            if v[2] > 0:
                lo = m
            else:
                hi = m
        v = [a[k] + (b[k] - a[k]) * lo for k in range(3)]
        d = math.hypot(v[0], v[1]) or 1
        return v[0] / d, v[1] / d

    def arc(a0, a1):
        da = (a1 - a0 + math.pi) % (2 * math.pi) - math.pi
        steps = max(2, int(abs(da) / (4 * R)))
        return [(math.cos(a0 + da * k / steps), math.sin(a0 + da * k / steps)) for k in range(1, steps)]

    for k in range(n + 1):
        i, j = (start + k) % n, (start + k + 1) % n
        a, b = vs[i], vs[j]
        if k < n and a[2] > 0:
            out.append(((a[0], a[1]), hard[i]))
        if k == n:
            break
        if a[2] > 0 and b[2] <= 0:
            h = horizon(a, b)
            out.append((h, True))
            exit_ang = math.atan2(h[1], h[0])
        elif a[2] <= 0 and b[2] > 0:
            h = horizon(b, a)
            ang = math.atan2(h[1], h[0])
            if exit_ang is not None:
                out += [(q, True) for q in arc(exit_ang, ang)]
            out.append((h, True))
            exit_ang = None
    return out


def catmull(pts, hard, tension=.85):
    """path tertutup halus (Catmull-Rom SENTRIPETAL: tanpa simpul/putaran di bagian sempit);
    segmen di antara dua titik keras (batas darat bersama, cakrawala bola) digambar lurus."""
    n = len(pts)
    f = lambda v: f'{v:.1f}'.rstrip('0').rstrip('.') if abs(v) < 1e6 else '0'
    dist = lambda p, q: math.hypot(q[0] - p[0], q[1] - p[1]) ** .5 or 1e-6
    d = [f'M{f(pts[0][0])} {f(pts[0][1])}']
    for i in range(n):
        p0, p1, p2, p3 = pts[i - 1], pts[i], pts[(i + 1) % n], pts[(i + 2) % n]
        if hard[i] and hard[(i + 1) % n]:
            d.append(f'L{f(p2[0])} {f(p2[1])}')
            continue
        d1, d2, d3 = dist(p0, p1), dist(p1, p2), dist(p2, p3)
        c1 = [(d1 * d1 * p2[k] - d2 * d2 * p0[k] + (2 * d1 * d1 + 3 * d1 * d2 + d2 * d2) * p1[k]) / (3 * d1 * (d1 + d2)) for k in (0, 1)]
        c2 = [(d3 * d3 * p1[k] - d2 * d2 * p3[k] + (2 * d3 * d3 + 3 * d3 * d2 + d2 * d2) * p2[k]) / (3 * d3 * (d3 + d2)) for k in (0, 1)]
        c1 = [p1[k] + (c1[k] - p1[k]) * tension for k in (0, 1)]
        c2 = [p2[k] + (c2[k] - p2[k]) * tension for k in (0, 1)]
        d.append(f'C{f(c1[0])} {f(c1[1])} {f(c2[0])} {f(c2[1])} {f(p2[0])} {f(p2[1])}')
    return ''.join(d) + 'Z'


def area_centroid(pts):
    a = cx = cy = 0.0
    for i in range(len(pts)):
        x0, y0 = pts[i]
        x1, y1 = pts[(i + 1) % len(pts)]
        c = x0 * y1 - x1 * y0
        a += c
        cx += (x0 + x1) * c
        cy += (y0 + y1) * c
    if abs(a) < 1e-9:
        return 0.0, sum(p[0] for p in pts) / len(pts), sum(p[1] for p in pts) / len(pts)
    return abs(a / 2), cx / (3 * a), cy / (3 * a)


def main():
    ap = argparse.ArgumentParser(description='Peta benua & pulau rapi (digambar sendiri) untuk motion graphic.')
    ap.add_argument('keluaran', help='berkas .svg keluaran')
    ap.add_argument('--wilayah', default='dunia', help='dunia | benua:Asia,Eropa | pulau:Jawa,Bali | indonesia')
    ap.add_argument('--mode', choices=['benua', 'pulau'], default='', help='satu path per benua, atau per pulau/daratan')
    ap.add_argument('--proyeksi', default='auto', help='auto | natural-earth | equirectangular | mercator | orthographic')
    ap.add_argument('--pusat', default='', help='bujur[,lintang] pusat peta/bola, mis. 118,-2')
    ap.add_argument('--ukuran', default='1600x900')
    ap.add_argument('--tepi', type=int, default=24)
    ap.add_argument('--sorot', default='', help='benua atau pulau yang disorot, mis. Asia atau Jawa,Bali')
    ap.add_argument('--konteks', action='store_true', help='gambar daratan lain samar di sekitar wilayah')
    ap.add_argument('--garis', action='store_true', help='garis lintang-bujur tiap 30°')
    ap.add_argument('--bola', action='store_true', help='gambar laut/bola (otomatis untuk orthographic)')
    ap.add_argument('--halus', type=float, default=.85, help='kehalusan garis pantai 0 (sudut) – 1 (bulat)')
    ap.add_argument('--tanpa-gaya', action='store_true', help='tanpa <style> bawaan')
    ap.add_argument('--png', action='store_true', help='pratinjau PNG (butuh Chrome)')
    a = ap.parse_args()

    W, H = (int(v) for v in a.ukuran.lower().split('x'))
    pad = a.tepi
    split = lambda s: [x.strip() for x in s.split(',') if x.strip()]
    tipe, _, nilai = a.wilayah.partition(':')
    tipe = tipe.strip().lower()

    shapes = []      # {bid, bnama, nama, pts}
    for bid, b in D.BENUA.items():
        for nama, pts in b['bentuk'].items():
            shapes.append({'bid': bid, 'bnama': b['nama'], 'nama': nama, 'pts': pts})
    eq = lambda x, y: slug(x) == slug(y)
    if tipe == 'dunia':
        sel = shapes
    elif tipe == 'benua':
        sel = [s for s in shapes if any(eq(v, s['bnama']) or eq(v, s['bid']) for v in split(nilai))]
    elif tipe == 'pulau':
        sel = [s for s in shapes if any(eq(v, s['nama']) for v in split(nilai))]
    elif tipe == 'indonesia':
        sel = [s for s in shapes if s['nama'] in D.INDONESIA]
    else:
        sys.exit('--wilayah harus dunia | benua:… | pulau:… | indonesia')
    if not sel:
        nama = sorted({s['bnama'] for s in shapes}) + sorted(s['nama'] for s in shapes)
        sys.exit('Tidak ada benua/pulau yang cocok. Pilihan: ' + ', '.join(nama))
    mode = a.mode or ('pulau' if tipe in ('pulau', 'indonesia') else 'benua')
    rest = [s for s in shapes if s not in sel] if a.konteks else []
    sorot = split(a.sorot)
    is_sorot = lambda s: any(eq(v, s['bnama']) or eq(v, s['nama']) or eq(v, s['bid']) for v in sorot)

    # titik bersama (batas darat) → digambar lurus
    count = {}
    for s in shapes:
        for p in set(s['pts']):
            count[p] = count.get(p, 0) + 1
    shared = {p for p, c in count.items() if c > 1}

    proj = a.proyeksi
    if proj == 'auto':
        proj = 'natural-earth' if tipe == 'dunia' else 'mercator'
    pz = [float(v) for v in a.pusat.split(',')] if a.pusat else []
    allpts = [p for s in sel for p in s['pts']]
    if pz:
        l0 = pz[0]
    elif tipe == 'dunia':
        l0 = 11.0                 # garis 180° jatuh di Selat Bering: tidak ada daratan terbelah
    else:
        lons = sorted(p[0] for p in allpts)
        l0 = (lons[0] + lons[-1]) / 2
    p0 = pz[1] if len(pz) > 1 else (sum(p[1] for p in allpts) / len(allpts) if proj == 'orthographic' else 0.0)

    def project_shape(s):
        hard = [p in shared for p in s['pts']]
        if proj == 'orthographic':
            res = ortho_ring(s['pts'], l0, p0, hard)
            return [q for q, _ in res], [h for _, h in res]
        f = PROJ.get(proj)
        if not f:
            sys.exit('Proyeksi tidak dikenal: ' + proj)
        return [f(l, p) for l, p in rel_ring(s['pts'], l0)], hard

    for s in sel + rest:
        s['xy'], s['hard'] = project_shape(s)
    sel = [s for s in sel if len(s['xy']) >= 3]
    rest = [s for s in rest if len(s['xy']) >= 3]

    if proj == 'orthographic':
        x0, x1, y0, y1 = -1.0, 1.0, -1.0, 1.0
    else:
        fit = [q for s in sel for q in s['xy']]
        xs, ys = [q[0] for q in fit], [q[1] for q in fit]
        x0, x1, y0, y1 = min(xs), max(xs), min(ys), max(ys)
    k = min((W - 2 * pad) / ((x1 - x0) or 1), (H - 2 * pad) / ((y1 - y0) or 1))
    cx, cy = (x0 + x1) / 2, (y0 + y1) / 2
    to_screen = lambda q: (W / 2 + (q[0] - cx) * k, H / 2 - (q[1] - cy) * k)
    for s in sel + rest:
        s['sc'] = [to_screen(q) for q in s['xy']]
        s['d'] = catmull(s['sc'], s['hard'], a.halus)

    out, anchors = [], []
    if proj == 'orthographic' or a.bola:
        if proj == 'orthographic':
            ccx, ccy = to_screen((0, 0))
            out.append(f'<clipPath id="bola-klip"><circle cx="{ccx:.1f}" cy="{ccy:.1f}" r="{k:.1f}"/></clipPath>')
            out.append(f'<circle class="laut" cx="{ccx:.1f}" cy="{ccy:.1f}" r="{k:.1f}"/>')
        else:
            out.append(f'<rect class="laut" x="0" y="0" width="{W}" height="{H}"/>')
    clip = ' clip-path="url(#bola-klip)"' if proj == 'orthographic' else ''
    out.append(f'<g class="peta-isi"{clip}>')
    if a.garis:
        lines = []
        for lat in range(-60, 61, 30):
            lines.append([(lon, lat) for lon in range(-180, 181, 3)])
        for lon in range(-180, 180, 30):
            lines.append([(lon, lat) for lat in range(-84, 85, 3)])
        for ln in lines:
            segs, cur = [], []
            for lon, lat in ln:
                if proj == 'orthographic':
                    v = ortho_vec(lon, lat, l0, p0)
                    if v[2] <= 0:
                        if len(cur) > 1:
                            segs.append(cur)
                        cur = []
                        continue
                    q = (v[0], v[1])
                else:
                    r = ((lon - l0 + 540) % 360) - 180
                    if cur and abs(r - cur[-1][2]) > 180:
                        segs.append(cur)
                        cur = []
                    q = PROJ[proj](r, lat) + (r,)
                    q = q
                sx, sy = to_screen(q[:2])
                cur.append((sx, sy, q[2] if len(q) > 2 else 0))
            if len(cur) > 1:
                segs.append(cur)
            for sg in segs:
                out.append('<path class="garis-lintang" d="M' + 'L'.join(f'{x:.1f} {y:.1f}' for x, y, _ in sg) + '"/>')
    if rest:
        out.append('<path class="konteks" d="' + ''.join(s['d'] for s in rest) + '"/>')

    def anchor(id_, nama, group):
        best = max(group, key=lambda s: area_centroid(s['sc'])[0])
        _, ax, ay = area_centroid(best['sc'])
        xs = [p[0] for s in group for p in s['sc']]
        ys = [p[1] for s in group for p in s['sc']]
        anchors.append({'id': id_, 'nama': nama, 'x': round(ax, 1), 'y': round(ay, 1),
                        'kotak': [[round(min(xs), 1), round(min(ys), 1)], [round(max(xs), 1), round(max(ys), 1)]]})

    if mode == 'benua':
        out.append('<g class="benua-semua">')
        for bid, b in D.BENUA.items():
            grp = [s for s in sel if s['bid'] == bid]
            if grp:
                out.append(f'<path id="benua-{bid}" class="benua benua-{bid}" data-nama="{b["nama"]}" d="' + ''.join(s['d'] for s in grp) + '"/>')
                anchor('benua-' + bid, b['nama'], grp)
        out.append('</g>')
    else:
        out.append('<g class="pulau-semua">')
        for s in sel:
            id_ = 'pulau-' + slug(s['nama'])
            out.append(f'<path id="{id_}" class="pulau benua-{s["bid"]}" data-nama="{s["nama"]}" d="{s["d"]}"/>')
            anchor(id_, s['nama'], [s])
        out.append('</g>')
    sor = [s for s in sel if is_sorot(s)]
    if sor:
        out.append('<path id="sorot" class="sorot" d="' + ''.join(s['d'] for s in sor) + '"/>')
        anchor('sorot', ', '.join(sorot), sor)
    out.append('</g>')

    css = ('.laut{fill:#eef3f6}.garis-lintang{fill:none;stroke:#00000022;stroke-width:1;vector-effect:non-scaling-stroke}'
           '.konteks{fill:#1d1d1b;opacity:.08}'
           '.benua,.pulau{fill:#d8cdb8;stroke:#fff;stroke-width:1.5;stroke-linejoin:round;vector-effect:non-scaling-stroke}'
           '.benua-asia{fill:#e9b44c}.benua-eropa{fill:#6fa8a0}.benua-afrika{fill:#e07a5f}'
           '.benua-amerika-utara{fill:#8fa6cf}.benua-amerika-selatan{fill:#9cbf7f}.benua-oseania{fill:#c79acb}'
           '.sorot{fill:#d1495b;stroke:#fff;stroke-width:2;stroke-linejoin:round;vector-effect:non-scaling-stroke}')
    svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}" class="peta">'
           + (f'<style>{css}</style>' if not a.tanpa_gaya else '') + '\n' + '\n'.join(out) + '\n</svg>\n')

    outp = pathlib.Path(a.keluaran).resolve()
    outp.parent.mkdir(parents=True, exist_ok=True)
    outp.write_text(svg)
    outp.with_suffix('.json').write_text(json.dumps({'ukuran': [W, H], 'proyeksi': proj, 'pusat': [l0, p0],
                                                     'bentuk': anchors}, ensure_ascii=False, indent=1))
    print(f'Peta: {outp} ({W}×{H}, proyeksi {proj}, {len(sel)} bentuk, {outp.stat().st_size / 1024:.0f} KB)')
    print(f'Titik label & kotak: {outp.with_suffix(".json")}')
    if a.png:
        png(svg, W, H, outp.with_suffix('.png'))


def png(svg, W, H, out):
    try:
        from render_mp4 import WS, evaluate, find_chrome
    except Exception:
        print('Pratinjau PNG dilewati (render_mp4.py tidak ditemukan).')
        return
    tmp = pathlib.Path(tempfile.mkdtemp(prefix='mf-peta-'))
    page = tmp / 'p.html'
    page.write_text(f'<!doctype html><meta charset="utf-8"><body style="margin:0;background:#fff">{svg}</body>')
    port = 9336
    args = [find_chrome(), '--headless=new', f'--remote-debugging-port={port}', f'--user-data-dir={tmp / "prof"}',
            '--hide-scrollbars', '--force-device-scale-factor=1', 'about:blank']
    if hasattr(os, 'geteuid') and os.geteuid() == 0:
        args.insert(1, '--no-sandbox')
    proc = subprocess.Popen(args, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    try:
        tab = None
        for _ in range(150):
            try:
                tab = next(t for t in json.load(urllib.request.urlopen(f'http://127.0.0.1:{port}/json')) if t.get('type') == 'page')
                break
            except Exception:
                time.sleep(.2)
        ws = WS(tab['webSocketDebuggerUrl'])
        ws.call('Page.enable')
        ws.call('Emulation.setDeviceMetricsOverride', width=W, height=H, deviceScaleFactor=1, mobile=False)
        ws.call('Page.navigate', url=page.as_uri())
        for _ in range(100):
            if evaluate(ws, 'document.readyState') == 'complete':
                break
            time.sleep(.1)
        time.sleep(.2)
        shot = ws.call('Page.captureScreenshot', format='png', clip={'x': 0, 'y': 0, 'width': W, 'height': H, 'scale': 1})
        out.write_bytes(base64.b64decode(shot['data']))
        print(f'Pratinjau: {out}')
    finally:
        proc.terminate()
        shutil.rmtree(tmp, ignore_errors=True)


if __name__ == '__main__':
    main()
