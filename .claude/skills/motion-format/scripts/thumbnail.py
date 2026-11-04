#!/usr/bin/env python3
"""Motion Format — potret thumbnail HTML jadi PNG untuk YouTube.

Pemakaian:
  python3 thumbnail.py <thumbnail-long.html>            # → .png 1280×720 + -kecil.png 246×138
  python3 thumbnail.py <thumbnail-short.html> --short   # → .png 1080×1920 + -kecil.png 180×320
  python3 thumbnail.py <berkas.html> --ukuran 1280x720 --out nama.png --tunggu 2

Chrome headless dikendalikan lewat DevTools Protocol (sama dengan render_mp4.py): halaman dibuka,
font ditunggu sampai dimuat, lalu dipotret persis seukuran thumbnail. Berkas -kecil.png adalah
ukuran thumbnail di daftar saran HP: lihat itu untuk uji keterbacaan.
Butuh Google Chrome/Chromium; ffmpeg dipakai untuk -kecil.png bila ada.
"""
import argparse, base64, json, os, pathlib, shutil, subprocess, sys, tempfile, time, urllib.request

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
from render_mp4 import WS, evaluate, find_chrome  # noqa: E402

PORT = 9334


def main():
    ap = argparse.ArgumentParser(description='Potret thumbnail HTML jadi PNG.')
    ap.add_argument('html')
    ap.add_argument('--short', action='store_true', help='ukuran Short 1080x1920')
    ap.add_argument('--ukuran', default='', help='LEBARxTINGGI, mis. 1280x720')
    ap.add_argument('--out', default='')
    ap.add_argument('--tunggu', type=float, default=1.0, help='detik tambahan menunggu gambar/animasi')
    a = ap.parse_args()

    html = pathlib.Path(a.html).resolve()
    if not html.exists():
        sys.exit(f'Tidak ada: {html}')
    size = a.ukuran or ('1080x1920' if a.short else '1280x720')
    W, H = (int(x) for x in size.lower().split('x'))
    out = pathlib.Path(a.out).resolve() if a.out else html.with_suffix('.png')

    chrome = find_chrome()
    prof = tempfile.mkdtemp(prefix='mf-thumb-')
    args = [chrome, '--headless=new', f'--remote-debugging-port={PORT}', f'--user-data-dir={prof}',
            '--hide-scrollbars', '--force-device-scale-factor=1', '--allow-file-access-from-files', 'about:blank']
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
            sys.exit(f'Chrome tidak merespons. Tutup Chrome yang memakai port {PORT} lalu coba lagi.')
        ws = WS(page['webSocketDebuggerUrl'])
        ws.call('Page.enable')
        ws.call('Emulation.setDeviceMetricsOverride', width=W, height=H, deviceScaleFactor=1, mobile=False)
        ws.call('Page.navigate', url=html.as_uri())
        for _ in range(300):
            if evaluate(ws, 'document.readyState') == 'complete':
                break
            time.sleep(.1)
        evaluate(ws, 'document.fonts.ready.then(()=>1)')
        time.sleep(max(a.tunggu, 0))
        shot = ws.call('Page.captureScreenshot', format='png',
                       clip={'x': 0, 'y': 0, 'width': W, 'height': H, 'scale': 1})
        out.write_bytes(base64.b64decode(shot['data']))
    finally:
        proc.terminate()
        shutil.rmtree(prof, ignore_errors=True)
    print(f'Thumbnail: {out} ({W}×{H})')

    ffmpeg = shutil.which('ffmpeg')
    if ffmpeg:
        small = out.with_name(out.stem + '-kecil.png')
        sw = 180 if H > W else 246
        subprocess.run([ffmpeg, '-y', '-v', 'error', '-i', str(out), '-vf', f'scale={sw}:-1:flags=area', str(small)],
                       check=True)
        print(f'Uji keterbacaan: {small} — teks harus masih terbaca di ukuran ini.')


if __name__ == '__main__':
    main()
