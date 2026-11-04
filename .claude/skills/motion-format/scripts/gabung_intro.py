#!/usr/bin/env python3
"""Motion Format — tempel intro kanal yang sudah ditetapkan di depan video YouTube.

Pemakaian:
  python3 gabung_intro.py <video-utama.mp4>                      # → <video-utama>-youtube.mp4
  python3 gabung_intro.py <video-utama.mp4> --intro intro.mp4 --out hasil.mp4
  python3 gabung_intro.py <video-utama.mp4> --jeda 0.3           # layar hitam 0,3 dtk di sambungan

Intro default: ../assets/intro-kanal/intro.mp4 (relatif ke script ini).
Intro diskalakan (letterbox bila rasionya beda) ke resolusi & fps video utama. Bagian yang tidak
bersuara diberi audio senyap supaya sambungan audio tetap rapi. Durasi intro dicetak — pakai untuk
menggeser timestamp chapter di deskripsi.
"""
import argparse, json, os, pathlib, shutil, subprocess, sys

HERE = pathlib.Path(__file__).resolve().parent
DEFAULT_INTRO = HERE.parent / 'assets' / 'intro-kanal' / 'intro.mp4'


def tool(name):
    p = os.environ.get(name.upper()) or shutil.which(name)
    if not p:
        sys.exit(f'{name} tidak ditemukan. Pasang ffmpeg dulu (Mac "brew install ffmpeg", '
                 f'Windows "winget install Gyan.FFmpeg").')
    return p


def probe(ffprobe, path):
    out = subprocess.run([ffprobe, '-v', 'error', '-show_streams', '-show_format', '-of', 'json', str(path)],
                         capture_output=True, text=True, check=True).stdout
    info = json.loads(out)
    v = next((s for s in info['streams'] if s['codec_type'] == 'video'), None)
    if not v:
        sys.exit(f'{path}: tidak ada track video.')
    has_audio = any(s['codec_type'] == 'audio' for s in info['streams'])
    num, den = (v.get('avg_frame_rate') or v.get('r_frame_rate') or '30/1').split('/')
    fps = float(num) / float(den or 1) if float(num) else 30.0
    return {'w': int(v['width']), 'h': int(v['height']), 'fps': fps, 'audio': has_audio,
            'dur': float(info['format']['duration'])}


def main():
    ap = argparse.ArgumentParser(description='Tempel intro kanal di depan video utama.')
    ap.add_argument('video', help='MP4 video utama (tanpa intro)')
    ap.add_argument('--intro', default=str(DEFAULT_INTRO), help=f'MP4 intro (default: {DEFAULT_INTRO})')
    ap.add_argument('--out', default='', help='nama MP4 hasil (default: <video>-youtube.mp4)')
    ap.add_argument('--jeda', type=float, default=0.0, help='detik layar hitam senyap di sambungan')
    a = ap.parse_args()

    video, intro = pathlib.Path(a.video), pathlib.Path(a.intro)
    if not video.exists():
        sys.exit(f'Video utama tidak ada: {video}')
    if not intro.exists():
        sys.exit(f'Intro kanal belum ada: {intro}\n'
                 'Simpan intro tetap di assets/intro-kanal/intro.mp4 (lihat references/paket-youtube.md, Langkah 0).')
    out = pathlib.Path(a.out) if a.out else video.with_name(video.stem + '-youtube.mp4')
    if not out.is_absolute() and a.out:
        out = video.parent / out

    ffmpeg, ffprobe = tool('ffmpeg'), tool('ffprobe')
    mi, mv = probe(ffprobe, intro), probe(ffprobe, video)
    W, H, FPS = mv['w'], mv['h'], mv['fps']
    norm_v = (f'scale={W}:{H}:force_original_aspect_ratio=decrease,pad={W}:{H}:(ow-iw)/2:(oh-ih)/2:color=black,'
              f'setsar=1,fps={FPS:.6f},format=yuv420p')
    norm_a = 'aresample=48000,aformat=sample_fmts=fltp:channel_layouts=stereo'

    cmd = [ffmpeg, '-y', '-v', 'error', '-stats', '-i', str(intro), '-i', str(video)]
    idx = 2
    silent = {}
    for key, m in (('intro', mi), ('video', mv)):
        if not m['audio']:
            cmd += ['-f', 'lavfi', '-t', f"{m['dur']:.3f}", '-i', 'anullsrc=r=48000:cl=stereo']
            silent[key] = idx
            idx += 1
    if a.jeda > 0:
        cmd += ['-f', 'lavfi', '-t', f'{a.jeda:.3f}', '-i', f'color=c=black:s={W}x{H}:r={FPS:.6f}',
                '-f', 'lavfi', '-t', f'{a.jeda:.3f}', '-i', 'anullsrc=r=48000:cl=stereo']
        gap_v, gap_a = idx, idx + 1

    fc = [f'[0:v]{norm_v}[v0]', f'[1:v]{norm_v}[v1]',
          f"[{silent.get('intro', 0)}:a]{norm_a}[a0]",
          f"[{silent.get('video', 1)}:a]{norm_a}[a1]"]
    if a.jeda > 0:
        fc += [f'[{gap_v}:v]{norm_v}[vg]', f'[{gap_a}:a]{norm_a}[ag]',
               '[v0][a0][vg][ag][v1][a1]concat=n=3:v=1:a=1[v][a]']
    else:
        fc += ['[v0][a0][v1][a1]concat=n=2:v=1:a=1[v][a]']

    cmd += ['-filter_complex', ';'.join(fc), '-map', '[v]', '-map', '[a]',
            '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p',
            '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', str(out)]
    subprocess.run(cmd, check=True)

    geser = mi['dur'] + max(a.jeda, 0)
    print(f'\nSelesai: {out}')
    print(f'Intro {mi["dur"]:.2f} dtk · video utama {mv["dur"]:.2f} dtk · total {geser + mv["dur"]:.2f} dtk')
    print(f'Geser semua timestamp chapter sebesar {geser:.2f} dtk (video utama mulai di '
          f'{int(geser // 60)}:{int(geser % 60):02d}).')


if __name__ == '__main__':
    main()
