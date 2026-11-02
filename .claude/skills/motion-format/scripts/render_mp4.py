#!/usr/bin/env python3
"""Motion Format — render index.html jadi MP4 BERSUARA, frame demi frame.

Tanpa Node, tanpa pip: cukup Python 3.8+, Google Chrome (atau Edge/Chromium), dan ffmpeg.
Chrome headless dikendalikan lewat DevTools Protocol (websocket ditulis dengan stdlib),
setiap frame diambil setelah timeline di-seek, jadi tidak ada frame drop. Audio dicampur
dari window.AUDIO_PLAN (VO per adegan + efek suara + musik opsional) lalu dinormalkan ke
±-15 LUFS (standar YouTube/Reels).

Pemakaian (dari folder mana saja):
  python3 render_mp4.py <folder-proyek>                  # 30 fps, keluaran <nama-folder>.mp4
  python3 render_mp4.py <folder-proyek> --fps 60
  python3 render_mp4.py <folder-proyek> --sampai 5       # render 5 detik pertama saja (cek cepat)
  python3 render_mp4.py <folder-proyek> --out promo.mp4
  python3 render_mp4.py <folder-proyek> --tanpa-audio

Syarat halaman (sudah ada di semua starter Motion Format):
  window.OPENER = { ready, DURATION, seek(t) [, seekFrame(t) -> Promise] [, W, H] }
  window.AUDIO_PLAN = { vo:[{at,src,vol}], sfx:[{at,src,vol}], music:null|{src,vol} }   (opsional)
Path lain: env CHROME=/path/ke/chrome, FFMPEG=/path/ke/ffmpeg.
"""
import argparse, base64, json, os, pathlib, platform, shutil, socket, struct, subprocess, sys, tempfile, time, urllib.request

PORT = 9333


def find_chrome():
    env = os.environ.get('CHROME')
    if env and os.path.exists(env):
        return env
    sysname = platform.system()
    cands = []
    if sysname == 'Darwin':
        cands = ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
                 '/Applications/Chromium.app/Contents/MacOS/Chromium',
                 '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
                 '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser']
    elif sysname == 'Windows':
        for base in [os.environ.get('PROGRAMFILES', r'C:\Program Files'), os.environ.get('PROGRAMFILES(X86)', r'C:\Program Files (x86)'),
                     os.environ.get('LOCALAPPDATA', '')]:
            cands += [os.path.join(base, r'Google\Chrome\Application\chrome.exe'),
                      os.path.join(base, r'Microsoft\Edge\Application\msedge.exe')]
    for c in cands:
        if c and os.path.exists(c):
            return c
    for name in ['google-chrome', 'google-chrome-stable', 'chromium', 'chromium-browser', 'chrome', 'msedge']:
        p = shutil.which(name)
        if p:
            return p
    sys.exit('Chrome tidak ditemukan. Pasang Google Chrome, atau set env CHROME=/path/ke/chrome.')


def find_ffmpeg():
    env = os.environ.get('FFMPEG')
    if env and os.path.exists(env):
        return env
    p = shutil.which('ffmpeg')
    if p:
        return p
    sys.exit('ffmpeg tidak ditemukan. Pasang dulu: Mac "brew install ffmpeg", Windows "winget install Gyan.FFmpeg", '
             'lalu jalankan ulang. (Atau set env FFMPEG=/path/ke/ffmpeg.)')


class WS:
    """Klien websocket minimal untuk Chrome DevTools Protocol."""

    def __init__(self, url):
        host, rest = url[len('ws://'):].split('/', 1)
        h, p = host.split(':')
        self.s = socket.create_connection((h, int(p)))
        key = base64.b64encode(os.urandom(16)).decode()
        self.s.sendall((f'GET /{rest} HTTP/1.1\r\nHost: {host}\r\nUpgrade: websocket\r\nConnection: Upgrade\r\n'
                        f'Sec-WebSocket-Key: {key}\r\nSec-WebSocket-Version: 13\r\n\r\n').encode())
        buf = b''
        while b'\r\n\r\n' not in buf:
            buf += self.s.recv(4096)
        self.buf = buf.split(b'\r\n\r\n', 1)[1]
        self.id = 0

    def _read(self, n):
        while len(self.buf) < n:
            chunk = self.s.recv(1 << 20)
            if not chunk:
                raise ConnectionError('koneksi ke Chrome terputus')
            self.buf += chunk
        d, self.buf = self.buf[:n], self.buf[n:]
        return d

    def send(self, text):
        data = text.encode()
        hdr = bytearray([0x81])
        n = len(data)
        if n < 126:
            hdr.append(0x80 | n)
        elif n < 65536:
            hdr.append(0x80 | 126); hdr += struct.pack('>H', n)
        else:
            hdr.append(0x80 | 127); hdr += struct.pack('>Q', n)
        mask = os.urandom(4)
        self.s.sendall(bytes(hdr) + mask + bytes(b ^ mask[i % 4] for i, b in enumerate(data)))

    def recv(self):
        msg = b''
        while True:
            b1, b2 = self._read(2)
            n = b2 & 0x7f
            if n == 126:
                n = struct.unpack('>H', self._read(2))[0]
            elif n == 127:
                n = struct.unpack('>Q', self._read(8))[0]
            payload = self._read(n)
            if (b1 & 0x0f) in (0x0, 0x1, 0x2):
                msg += payload
                if b1 & 0x80:
                    return msg.decode()

    def call(self, method, **params):
        self.id += 1
        mid = self.id
        self.send(json.dumps({'id': mid, 'method': method, 'params': params}))
        while True:
            m = json.loads(self.recv())
            if m.get('id') == mid:
                if 'error' in m:
                    raise RuntimeError(m['error'])
                return m.get('result', {})


def evaluate(ws, expr):
    r = ws.call('Runtime.evaluate', expression=expr, awaitPromise=True, returnByValue=True)
    if r.get('exceptionDetails'):
        raise RuntimeError('error di halaman: ' + json.dumps(r['exceptionDetails'])[:400])
    return r.get('result', {}).get('value')


def render_frames(proj, html, fps, until, silent_path, ffmpeg):
    chrome = find_chrome()
    prof = tempfile.mkdtemp(prefix='mf-render-')
    proc = subprocess.Popen([chrome, '--headless=new', f'--remote-debugging-port={PORT}', f'--user-data-dir={prof}',
                             '--hide-scrollbars', '--force-device-scale-factor=1', '--allow-file-access-from-files',
                             '--autoplay-policy=no-user-gesture-required', '--mute-audio', '--enable-webgl',
                             '--ignore-gpu-blocklist', 'about:blank'], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
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
            sys.exit('Chrome tidak merespons. Tutup Chrome yang memakai port 9333 lalu coba lagi.')
        ws = WS(page['webSocketDebuggerUrl'])
        ws.call('Page.enable')
        ws.call('Emulation.setDeviceMetricsOverride', width=1920, height=1080, deviceScaleFactor=1, mobile=False)
        ws.call('Page.navigate', url=pathlib.Path(html).resolve().as_uri() + '?clean=1')
        ok = False
        for _ in range(600):
            if evaluate(ws, '!!(window.OPENER && window.OPENER.ready && (!window.OPENER.clipsReady || window.OPENER.clipsReady()))'):
                ok = True
                break
            time.sleep(.1)
        if not ok:
            sys.exit('Halaman tidak siap (window.OPENER.ready tidak pernah true). Buka index.html di browser dan cek error-nya.')
        evaluate(ws, 'document.fonts.ready.then(()=>1)')
        info = evaluate(ws, 'JSON.stringify({d:OPENER.DURATION,w:OPENER.W||1920,h:OPENER.H||1080,'
                            'a:window.AUDIO_PLAN||null})')
        info = json.loads(info)
        W, H = int(info['w']), int(info['h'])
        ws.call('Emulation.setDeviceMetricsOverride', width=W, height=H, deviceScaleFactor=1, mobile=False)
        time.sleep(.6)
        dur = float(info['d'])
        if until:
            dur = min(dur, until)
        nframes = int(round(dur * fps))
        print(f'[1/3] render {nframes} frame · {W}×{H} · {fps} fps · {dur:.1f} detik')
        enc = subprocess.Popen([ffmpeg, '-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', str(fps), '-c:v', 'mjpeg',
                                '-i', '-', '-c:v', 'libx264', '-preset', 'medium', '-crf', '17', '-pix_fmt', 'yuv420p',
                                '-movflags', '+faststart', silent_path], stdin=subprocess.PIPE)
        seek = ('(async()=>{const O=window.OPENER;await (O.seekFrame?O.seekFrame(%s):O.seek(%s));'
                'await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));return 1})()')
        t0 = time.time()
        for i in range(nframes):
            t = f'{i / fps:.5f}'
            evaluate(ws, seek % (t, t))
            shot = ws.call('Page.captureScreenshot', format='jpeg', quality=95,
                           clip={'x': 0, 'y': 0, 'width': W, 'height': H, 'scale': 1})
            enc.stdin.write(base64.b64decode(shot['data']))
            if i and i % (fps * 5) == 0:
                el = time.time() - t0
                sisa = el / i * (nframes - i)
                print(f'   {i}/{nframes} frame · sisa ± {sisa:.0f} detik', flush=True)
        enc.stdin.close()
        enc.wait()
        return dur, info.get('a')
    finally:
        proc.terminate()
        shutil.rmtree(prof, ignore_errors=True)


def mix_audio(proj, plan, dur, out_m4a, ffmpeg):
    inputs, filters, labels = [], [], []

    def add(src, at, vol, extra='', loop=False):
        path = os.path.join(proj, src)
        if not os.path.exists(path):
            print(f'   ! audio tidak ditemukan, dilewati: {src}')
            return
        k = len(labels)
        if loop:
            inputs.extend(['-stream_loop', '-1'])
        inputs.extend(['-i', path])
        ms = int(round(max(0.0, float(at)) * 1000))
        filters.append(f'[{k}:a]aresample=44100,aformat=channel_layouts=stereo{extra},volume={vol},adelay={ms}|{ms}[a{k}]')
        labels.append(f'[a{k}]')

    for v in plan.get('vo') or []:
        if float(v.get('at', 0)) < dur:
            add(v['src'], v.get('at', 0), v.get('vol', 1))
    for s in plan.get('sfx') or []:
        if float(s.get('at', 0)) < dur:
            add(s['src'], s.get('at', 0), s.get('vol', .5))
    mus = plan.get('music')
    if mus:
        add(mus['src'], 0, mus.get('vol', .15), f',atrim=0:{dur:.2f},afade=t=out:st={max(0, dur - 2):.2f}:d=1.8', loop=True)
    for lp in plan.get('loops') or []:   # ambience berulang di rentang tertentu: {src, from, to, vol}
        a, b = float(lp['from']), min(float(lp['to']), dur)
        if b > a:
            add(lp['src'], a, lp.get('vol', .4), f',atrim=0:{b - a:.2f},asetpts=N/SR/TB,afade=t=in:d=0.5,'
                                                   f'afade=t=out:st={max(0, b - a - .7):.2f}:d=0.7', loop=True)
    if not labels:
        return False
    fc = ';'.join(filters) + ';' + ''.join(labels) + \
        f'amix=inputs={len(labels)}:normalize=0:dropout_transition=0,apad=whole_dur={dur:.2f},atrim=0:{dur:.2f}[mix]'
    raw = out_m4a + '.wav'
    subprocess.run([ffmpeg, '-y', '-loglevel', 'error', *inputs, '-filter_complex', fc, '-map', '[mix]', '-c:a', 'pcm_s16le', raw],
                   check=True)
    subprocess.run([ffmpeg, '-y', '-loglevel', 'error', '-i', raw, '-af', 'loudnorm=I=-15:TP=-1.5:LRA=11', '-ar', '44100',
                    '-c:a', 'aac', '-b:a', '192k', out_m4a], check=True)
    os.remove(raw)
    return True


def main():
    ap = argparse.ArgumentParser(description='Render proyek Motion Format jadi MP4 bersuara.')
    ap.add_argument('proyek', nargs='?', default='.', help='folder berisi index.html (default: folder sekarang)')
    ap.add_argument('--fps', type=int, default=30)
    ap.add_argument('--sampai', type=float, default=0, help='render hanya N detik pertama (cek cepat)')
    ap.add_argument('--out', default='', help='nama file MP4 (default: nama folder proyek)')
    ap.add_argument('--html', default='index.html')
    ap.add_argument('--tanpa-audio', action='store_true')
    a = ap.parse_args()

    proj = os.path.abspath(a.proyek)
    html = os.path.join(proj, a.html)
    if not os.path.exists(html):
        sys.exit(f'Tidak ada {a.html} di {proj}')
    ffmpeg = find_ffmpeg()
    out = a.out or (os.path.basename(proj.rstrip(os.sep)) + ('-cek' if a.sampai else '') + '.mp4')
    out = out if os.path.isabs(out) else os.path.join(proj, out)
    silent = os.path.join(proj, '.video-silent.mp4')
    mix = os.path.join(proj, '.mix.m4a')

    dur, plan = render_frames(proj, html, a.fps, a.sampai, silent, ffmpeg)

    print('[2/3] campur audio')
    has_audio = False
    if plan and not a.tanpa_audio:
        has_audio = mix_audio(proj, plan, dur, mix, ffmpeg)
    if not has_audio:
        print('   (tanpa audio)')

    print('[3/3] gabung')
    if has_audio:
        subprocess.run([ffmpeg, '-y', '-loglevel', 'error', '-i', silent, '-i', mix, '-map', '0:v', '-map', '1:a', '-c:v', 'copy',
                        '-c:a', 'copy', '-shortest', '-movflags', '+faststart', out], check=True)
        os.remove(mix)
        os.remove(silent)
    else:
        shutil.move(silent, out)
    print('selesai ->', out)


if __name__ == '__main__':
    main()
