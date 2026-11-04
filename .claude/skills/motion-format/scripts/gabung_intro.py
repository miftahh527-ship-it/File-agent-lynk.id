#!/usr/bin/env python3
"""Motion Format — tempel intro kanal yang sudah ditetapkan di depan video YouTube.

Pemakaian:
  python3 gabung_intro.py <video-utama.mp4>                      # → <video-utama>-youtube.mp4
  python3 gabung_intro.py <video-utama.mp4> --intro intro.mp4 --out hasil.mp4
  python3 gabung_intro.py <video-utama.mp4> --pudar 1.5          # transisi memudar 1,5 dtk (default 1 dtk)
  python3 gabung_intro.py <video-utama.mp4> --gaya silang        # pudar silang langsung ke video
  python3 gabung_intro.py <video-utama.mp4> --pudar 0            # tanpa transisi (cut langsung)

Intro default: ../assets/intro-kanal/intro.mp4 (relatif ke script ini).
Intro disambung ke video dengan transisi MEMUDAR (default: memudar lewat layar hitam 1 dtk —
0,5 dtk akhir intro memudar ke hitam, lalu 0,5 dtk awal video muncul dari hitam; suara ikut memudar.
Tidak bertumpuk, jadi video utama mulai tepat di akhir intro).
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
    ap.add_argument('--pudar', type=float, default=1.0, help='durasi transisi memudar dalam detik (0 = cut langsung)')
    ap.add_argument('--gaya', choices=['hitam', 'silang'], default='hitam',
                    help='hitam = memudar lewat layar hitam (default); silang = intro memudar langsung ke video')
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

    d = max(0.0, min(a.pudar, mi['dur'] - 0.1, mv['dur'] - 0.1))
    cmd = [ffmpeg, '-y', '-v', 'error', '-stats', '-i', str(intro), '-i', str(video)]
    idx = 2
    silent = {}
    for key, m in (('intro', mi), ('video', mv)):
        if not m['audio']:
            cmd += ['-f', 'lavfi', '-t', f"{m['dur']:.3f}", '-i', 'anullsrc=r=48000:cl=stereo']
            silent[key] = idx
            idx += 1

    fc = [f'[0:v]{norm_v},settb=AVTB[v0]', f'[1:v]{norm_v},settb=AVTB[v1]',
          f"[{silent.get('intro', 0)}:a]{norm_a}[a0]",
          f"[{silent.get('video', 1)}:a]{norm_a}[a1]"]
    if d > 0 and a.gaya == 'hitam':
        # Simetris: separuh durasi intro memudar ke hitam, separuh durasi video muncul dari hitam.
        # Tidak bertumpuk, jadi video utama mulai tepat di akhir intro.
        h = d / 2
        st = mi['dur'] - h
        fc = [f'[0:v]{norm_v},fade=t=out:st={st:.3f}:d={h:.3f}[v0]',
              f'[1:v]{norm_v},fade=t=in:st=0:d={h:.3f}[v1]',
              f"[{silent.get('intro', 0)}:a]{norm_a},afade=t=out:st={st:.3f}:d={h:.3f}[a0]",
              f"[{silent.get('video', 1)}:a]{norm_a},afade=t=in:st=0:d={h:.3f}[a1]",
              '[v0][a0][v1][a1]concat=n=2:v=1:a=1[v][a]']
        geser = mi['dur']
    elif d > 0:
        fc += [f'[v0][v1]xfade=transition=fade:duration={d:.3f}:offset={mi["dur"] - d:.3f}[v]',
               f'[a0][a1]acrossfade=d={d:.3f}:c1=tri:c2=tri[a]']
        geser = mi['dur'] - d
    else:
        fc += ['[v0][a0][v1][a1]concat=n=2:v=1:a=1[v][a]']
        geser = mi['dur']

    cmd += ['-filter_complex', ';'.join(fc), '-map', '[v]', '-map', '[a]',
            '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p',
            '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', str(out)]
    subprocess.run(cmd, check=True)

    jenis = f'{"pudar lewat hitam" if a.gaya == "hitam" else "pudar silang"} {d:.1f} dtk' if d > 0 else 'cut langsung'
    print(f'\nSelesai: {out}')
    print(f'Intro {mi["dur"]:.2f} dtk · transisi {jenis} · video utama {mv["dur"]:.2f} dtk · '
          f'total {geser + mv["dur"]:.2f} dtk')
    print(f'Geser semua timestamp chapter sebesar {geser:.2f} dtk (video utama mulai di '
          f'{int(geser // 60)}:{int(geser % 60):02d}).')

if __name__ == '__main__':
    main()
