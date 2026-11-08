#!/usr/bin/env python3
"""Motion Format — cek tata letak: cari teks/gambar yang tumpang tindih, terlalu rapat, atau keluar frame.

Halaman dibuka lewat Chrome headless, timeline di-seek tiap --langkah detik, lalu kotak setiap teks dan
gambar yang TERLIHAT diukur dan dibandingkan. Masalah yang bertahan ≥ --minimal detik dilaporkan
beserta rentang waktunya, dan (dengan --gambar) dipotret dengan kotak merah/kuning di elemennya.

Pemakaian:
  python3 cek_tata_letak.py <folder-proyek>                 # index.html, cek tiap 0,25 dtk
  python3 cek_tata_letak.py <folder-proyek> --gambar        # + potret tiap masalah ke cek-tata-letak/
  python3 cek_tata_letak.py thumbnail-long.html             # halaman diam (thumbnail): satu kali cek
  python3 cek_tata_letak.py <folder> --langkah 0.5 --minimal 0.5 --html short.html

Yang diukur (otomatis):
  teks   = elemen yang punya teks langsung (kotak = tepat di hurufnya, bukan lebar blok)
  gambar = img, video, canvas, svg teratas, dan elemen ber-background-image
  Atur manual dengan atribut:
    data-tata="teks|gambar|subjek"     paksa peran (subjek = gambar utama)
    data-tata="latar|dekor|abaikan"    elemen & isinya tidak dicek (latar, partikel, ornamen)
    data-boleh-tumpuk                  pada WADAH: elemen di dalamnya boleh saling tumpuk (label di atas
                                       fotonya sendiri, kartu bertumpuk); elemen di luar wadah tetap dicek
    data-boleh-keluar                  boleh terpotong tepi frame (bleed disengaja)

Aturan (lihat references/tata-letak.md):
  GALAT       teks menimpa teks · gambar menutupi teks (> 3 % luas teks) · teks terpotong tepi frame
  PERINGATAN  gambar bertumpuk (> 8 % luas yang lebih kecil) · teks di luar zona aman ·
              gambar terpotong tepi (> 12 %) · jarak teks–gambar/gambar–gambar < 24 px
Kode keluar 1 bila ada GALAT.
"""
import argparse, base64, json, pathlib, shutil, subprocess, sys, tempfile, time, urllib.request, os

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
from render_mp4 import WS, evaluate, find_chrome  # noqa: E402

PORT = 9335

COLLECT = r"""(() => {
const st = document.querySelector('#stage') || document.documentElement;
const S = st.getBoundingClientRect();
const W0 = (window.OPENER && OPENER.W) || S.width, k = S.width / W0 || 1;
const SKIP = '[data-tata="latar"],[data-tata="dekor"],[data-tata="abaikan"],#gl,.bgfx';
function op(el) {
  let o = 1;
  for (let e = el; e && e.nodeType === 1; e = e.parentElement) {
    const cs = getComputedStyle(e);
    if (cs.display === 'none' || cs.visibility === 'hidden') return 0;
    o *= parseFloat(cs.opacity);
    if (o < 0.05) return 0;
  }
  return o;
}
function ownText(el) {
  for (const n of el.childNodes) if (n.nodeType === 3 && n.textContent.trim()) return true;
  return false;
}
function role(el) {
  const d = el.dataset && el.dataset.tata;
  if (d) return d;
  const t = el.tagName.toLowerCase();
  if (t === 'img' || t === 'video' || t === 'canvas') return 'gambar';
  if (t === 'svg' && !(el.parentElement && el.parentElement.closest('svg'))) return 'gambar';
  if (el.closest('svg')) return null;
  if (ownText(el) && !['script','style','title','noscript'].includes(t)) return 'teks';
  const bg = getComputedStyle(el).backgroundImage;
  if (bg && bg.includes('url(')) return 'gambar';
  return null;
}
function name(el) {
  let s = el.tagName.toLowerCase();
  if (el.id) s += '#' + el.id;
  else if (el.classList && el.classList.length) s += '.' + [...el.classList].slice(0, 2).join('.');
  if (el.tagName === 'IMG') s += ' [' + (el.getAttribute('src') || '').split('/').pop().slice(0, 28) + ']';
  else if (ownText(el)) s += ' "' + el.textContent.trim().replace(/\s+/g, ' ').slice(0, 30) + '"';
  return s;
}
const out = [];
let i = 0;
for (const el of document.querySelectorAll('body *')) {
  const r0 = role(el);
  if (!r0 || ['latar','dekor','abaikan'].includes(r0)) continue;
  if (el.closest(SKIP)) continue;
  const o = op(el);
  if (o < 0.5) continue;
  let r;
  if (r0 === 'teks') { const g = document.createRange(); g.selectNodeContents(el); r = g.getBoundingClientRect(); }
  else if (el.tagName.toLowerCase() === 'svg') {
    // kotak = garis/bentuk yang benar-benar digambar, bukan kanvas viewBox yang kosong
    let L = 1e9, T = 1e9, R = -1e9, B = -1e9;
    for (const c of el.querySelectorAll('path,circle,ellipse,rect,line,polyline,polygon,text,image,use')) {
      if (op(c) < 0.05) continue;
      const q = c.getBoundingClientRect();
      if (q.width + q.height < 1) continue;
      L = Math.min(L, q.left); T = Math.min(T, q.top); R = Math.max(R, q.right); B = Math.max(B, q.bottom);
    }
    if (R < L) continue;
    r = {left: L, top: T, width: R - L, height: B - T};
  }
  else r = el.getBoundingClientRect();
  if (r.width < 4 || r.height < 4) continue;
  const x = (r.left - S.left) / k, y = (r.top - S.top) / k, w = r.width / k, h = r.height / k;
  const H0 = S.height / k;
  if (x > W0 || y > H0 || x + w < 0 || y + h < 0) continue;
  if (r0 === 'gambar' && !(el.dataset && el.dataset.tata) && w * h > 0.55 * W0 * H0) continue;   // latar penuh
  el.setAttribute('data-cek-id', String(i));
  out.push({id: i++, nama: name(el), peran: r0 === 'subjek' ? 'gambar' : r0, x, y, w, h,
            keluar: !!el.closest('[data-boleh-keluar]')});
}
// pasangan induk-anak tidak dibandingkan; tumpukan disengaja hanya berlaku di dalam wadah
// [data-boleh-tumpuk] yang sama (label di atas fotonya sendiri), bukan untuk elemen lain
const rel = [], ok = [];
const els = out.map(o => document.querySelector('[data-cek-id="' + o.id + '"]'));
const box = els.map(e => e.closest('[data-boleh-tumpuk]'));
for (let a = 0; a < els.length; a++) for (let b = 0; b < els.length; b++) {
  if (a === b) continue;
  if (els[a].contains(els[b])) rel.push([out[a].id, out[b].id]);
  if (box[a] && box[a].contains(els[b])) ok.push([out[a].id, out[b].id]);
}
els.forEach(e => e.removeAttribute('data-cek-id'));
return JSON.stringify({W: W0, H: S.height / k, el: out, nest: rel, ok});
})()"""


def inter(a, b):
    ix = max(0, min(a['x'] + a['w'], b['x'] + b['w']) - max(a['x'], b['x']))
    iy = max(0, min(a['y'] + a['h'], b['y'] + b['h']) - max(a['y'], b['y']))
    return ix * iy


def gap(a, b):
    dx = max(b['x'] - (a['x'] + a['w']), a['x'] - (b['x'] + b['w']), 0)
    dy = max(b['y'] - (a['y'] + a['h']), a['y'] - (b['y'] + b['h']), 0)
    return max(dx, dy) if (dx == 0 or dy == 0) else (dx * dx + dy * dy) ** .5


def outside(e, W, H):
    vis = max(0, min(e['x'] + e['w'], W) - max(e['x'], 0)) * max(0, min(e['y'] + e['h'], H) - max(e['y'], 0))
    return 1 - vis / (e['w'] * e['h'])


def problems(snap, jarak_min):
    W, H, els = snap['W'], snap['H'], snap['el']
    nest = {(a, b) for a, b in snap['nest']}
    oks = {(a, b) for a, b in snap['ok']}
    # zona aman: 16:9 → 5 % tepi; 9:16 → atas 220, bawah 380, kanan 140, kiri 60 (UI Shorts/Reels)
    if H > W:
        safe = (60, 220, W - 140, H - 380)
    else:
        safe = (W * .05, H * .05, W * .95, H * .95)
    found = []
    for i, a in enumerate(els):
        if a['peran'] == 'teks':
            if not a['keluar'] and outside(a, W, H) > 0.002:
                found.append(('GALAT', 'teks terpotong tepi frame', a['nama'], ''))
            elif not a['keluar'] and (a['x'] < safe[0] - 1 or a['y'] < safe[1] - 1
                                      or a['x'] + a['w'] > safe[2] + 1 or a['y'] + a['h'] > safe[3] + 1):
                found.append(('PERINGATAN', 'teks di luar zona aman', a['nama'], ''))
        elif not a['keluar'] and outside(a, W, H) > 0.12:
            found.append(('PERINGATAN', 'gambar terpotong tepi frame', a['nama'], ''))
        for b in els[i + 1:]:
            if (a['id'], b['id']) in nest or (b['id'], a['id']) in nest:
                continue
            ok = (a['id'], b['id']) in oks or (b['id'], a['id']) in oks
            ar, br = a['peran'], b['peran']
            ov = inter(a, b)
            pair = sorted([a['nama'], b['nama']])
            if ar == 'teks' and br == 'teks':
                if ov > 0 and not ok:
                    found.append(('GALAT', 'teks menimpa teks', pair[0], pair[1]))
                continue
            if 'teks' in (ar, br):
                t = a if ar == 'teks' else b
                if ov > 0.03 * t['w'] * t['h']:
                    if not ok:
                        found.append(('GALAT', 'gambar menutupi teks', pair[0], pair[1]))
                    continue
            else:
                small = min(a['w'] * a['h'], b['w'] * b['h'])
                if ov > 0.08 * small:
                    if not ok:
                        found.append(('PERINGATAN', 'gambar bertumpuk', pair[0], pair[1]))
                    continue
            if ov == 0 and not ok and gap(a, b) < jarak_min:
                found.append(('PERINGATAN', f'terlalu rapat (< {jarak_min} px)', pair[0], pair[1]))
    return found


def draw_boxes(ws, snap, names_bad, names_warn):
    boxes = []
    for e in snap['el']:
        c = '#ff2d2d' if e['nama'] in names_bad else ('#ffc400' if e['nama'] in names_warn else None)
        if c:
            boxes.append({**e, 'c': c})
    js = """(b => { const st = document.querySelector('#stage') || document.documentElement;
      const S = st.getBoundingClientRect(); const W0 = (window.OPENER && OPENER.W) || S.width, k = S.width / W0 || 1;
      const L = document.createElement('div'); L.id = '__cek'; L.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:2147483647';
      for (const e of b) { const d = document.createElement('div');
        d.style.cssText = `position:fixed;left:${S.left + e.x * k}px;top:${S.top + e.y * k}px;width:${e.w * k}px;height:${e.h * k}px;outline:4px solid ${e.c};background:${e.c}22`;
        L.appendChild(d); }
      document.body.appendChild(L); return 1; })(%s)""" % json.dumps(boxes)
    evaluate(ws, js)


def main():
    ap = argparse.ArgumentParser(description='Cek tumpang tindih & tata letak motion graphic.')
    ap.add_argument('proyek', help='folder proyek (berisi index.html) atau berkas .html')
    ap.add_argument('--html', default='index.html')
    ap.add_argument('--langkah', type=float, default=0.25, help='jarak antar-cek dalam detik')
    ap.add_argument('--minimal', type=float, default=0.4, help='laporkan hanya masalah yang bertahan ≥ N detik')
    ap.add_argument('--jarak', type=int, default=24, help='jarak minimum antar-elemen (px panggung)')
    ap.add_argument('--gambar', action='store_true', help='potret tiap masalah (kotak merah = galat, kuning = peringatan)')
    ap.add_argument('--ukuran', default='', help='LEBARxTINGGI untuk halaman tanpa window.OPENER (default 1920x1080)')
    a = ap.parse_args()

    p = pathlib.Path(a.proyek).resolve()
    html = p if p.is_file() else p / a.html
    if not html.exists():
        sys.exit(f'Tidak ada: {html}')
    outdir = html.parent / 'cek-tata-letak'

    chrome = find_chrome()
    prof = tempfile.mkdtemp(prefix='mf-cek-')
    args = [chrome, '--headless=new', f'--remote-debugging-port={PORT}', f'--user-data-dir={prof}', '--hide-scrollbars',
            '--force-device-scale-factor=1', '--allow-file-access-from-files', '--mute-audio', '--enable-webgl',
            '--ignore-gpu-blocklist', 'about:blank']
    if hasattr(os, 'geteuid') and os.geteuid() == 0:
        args.insert(1, '--no-sandbox')
    proc = subprocess.Popen(args, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    try:
        page = None
        for _ in range(150):
            try:
                tabs = json.load(urllib.request.urlopen(f'http://127.0.0.1:{PORT}/json'))
                page = next(t for t in tabs if t.get('type') == 'page')
                break
            except Exception:
                time.sleep(.2)
        if not page:
            sys.exit(f'Chrome tidak merespons (port {PORT}).')
        ws = WS(page['webSocketDebuggerUrl'])
        ws.call('Page.enable')
        W, H = (int(x) for x in (a.ukuran or '1920x1080').lower().split('x'))
        ws.call('Emulation.setDeviceMetricsOverride', width=W, height=H, deviceScaleFactor=1, mobile=False)
        ws.call('Page.navigate', url=html.as_uri() + '?clean=1')
        anim = False
        for _ in range(300):
            st = evaluate(ws, 'document.readyState==="complete" ? (window.OPENER ? (OPENER.ready ? "anim" : "wait") : "diam") : "wait"')
            if st != 'wait':
                anim = st == 'anim'
                break
            time.sleep(.1)
        evaluate(ws, 'document.fonts.ready.then(()=>1)')
        dur = 0.0
        if anim:
            info = json.loads(evaluate(ws, 'JSON.stringify({d:OPENER.DURATION,w:OPENER.W||1920,h:OPENER.H||1080})'))
            W, H, dur = int(info['w']), int(info['h']), float(info['d'])
            ws.call('Emulation.setDeviceMetricsOverride', width=W, height=H, deviceScaleFactor=1, mobile=False)
        time.sleep(.5)
        seek = ('(async()=>{const O=window.OPENER;await (O.seekFrame?O.seekFrame(%s):O.seek(%s));'
                'await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));return 1})()')
        times = [round(i * a.langkah, 3) for i in range(int(dur / a.langkah) + 1)] if anim else [0.0]
        print(f'Cek tata letak: {html.name} · {W}×{H} · ' +
              (f'{len(times)} titik waktu tiap {a.langkah} dtk' if anim else 'halaman diam'))

        runs = {}   # key -> list of times
        snaps = {}
        for t in times:
            if anim:
                evaluate(ws, seek % (t, t))
            snap = json.loads(evaluate(ws, COLLECT))
            snaps[t] = snap
            for f in problems(snap, a.jarak):
                runs.setdefault(f, []).append(t)

        # gabungkan jadi rentang waktu yang berurutan
        report = []
        for key, ts in runs.items():
            start = prev = ts[0]
            for t in ts[1:] + [None]:
                if t is not None and t - prev <= a.langkah + 1e-6:
                    prev = t
                    continue
                if (prev - start) + a.langkah >= a.minimal or not anim:
                    report.append({'tingkat': key[0], 'masalah': key[1], 'a': key[2], 'b': key[3],
                                   'dari': start, 'sampai': prev})
                if t is not None:
                    start = prev = t
        report.sort(key=lambda r: (r['tingkat'] != 'GALAT', r['dari']))

        if a.gambar and report:
            if outdir.exists():
                shutil.rmtree(outdir)
            outdir.mkdir()
            for n, r in enumerate(report, 1):
                t = round(round(((r['dari'] + r['sampai']) / 2) / a.langkah) * a.langkah, 3) if anim else 0.0
                t = min(times, key=lambda x: abs(x - t))
                if anim:
                    evaluate(ws, seek % (t, t))
                bad = {r['a'], r['b']} if r['tingkat'] == 'GALAT' else set()
                warn = {r['a'], r['b']} - bad
                draw_boxes(ws, snaps[t], bad, warn)
                shot = ws.call('Page.captureScreenshot', format='jpeg', quality=80)
                f = outdir / f'{n:02d}-{t:06.2f}s.jpg'
                f.write_bytes(base64.b64decode(shot['data']))
                r['gambar'] = str(f)
                evaluate(ws, 'document.getElementById("__cek")?.remove(),1')
    finally:
        proc.terminate()
        shutil.rmtree(prof, ignore_errors=True)

    (html.parent / 'cek-tata-letak.json').write_text(json.dumps(report, ensure_ascii=False, indent=1))
    galat = sum(r['tingkat'] == 'GALAT' for r in report)
    if not report:
        print('✓ Rapi: tidak ada tumpang tindih, teks di zona aman, jarak antar-elemen cukup.')
        return
    for r in report:
        waktu = f"{r['dari']:.2f}–{r['sampai']:.2f} dtk" if anim else 'statis'
        dua = f"  ↔  {r['b']}" if r['b'] else ''
        print(f"[{r['tingkat']}] {waktu} · {r['masalah']}: {r['a']}{dua}" + (f"\n          ↳ {r['gambar']}" if r.get('gambar') else ''))
    print(f'\n{galat} galat, {len(report) - galat} peringatan. Laporan: {html.parent / "cek-tata-letak.json"}')
    if galat:
        sys.exit(1)


if __name__ == '__main__':
    main()
