#!/usr/bin/env python3
"""Potongan 9:16 (YouTube Shorts / IG Reels) dari video panjang.

Bahan: render tiap bagian TANPA subtitle (bagian/<nn>/<nn>-bersih.mp4, dari index-bersih.html) supaya
subtitle bisa ditulis ulang besar-besar untuk layar tegak. Susunan 1080×1920:
  latar = video yang sama diburamkan · judul pancingan di atas · video 16:9 di tengah ·
  subtitle besar di bawah video · ajakan menonton versi lengkap. Semua teks di zona aman UI Shorts/Reels.
Pakai: python3 naskah/potongan.py <caps.json> <folder-font>   → potongan/*.mp4
"""
import json, pathlib, subprocess, sys

R = pathlib.Path(__file__).resolve().parent.parent
CAPS = json.load(open(sys.argv[1]))
FONT = sys.argv[2]
OUT = R / 'potongan'
OUT.mkdir(exist_ok=True)

# (nama, bagian, indeks subtitle awal, akhir, judul baris 1, judul baris 2)
KLIP = [
    ('1-saudara-jauh', '01-pembuka-bab1', 16, 21, 'Dulu ada manusia', 'selain kita?!'),
    ('2-tulisan-pertama', '04-bab4', 4, 10, 'Tulisan pertama', 'di dunia: buat apa?'),
    ('3-kerajaan-nusantara', '05-bab5', 6, 17, 'Sejarah Nusantara', 'dalam 50 detik'),
    ('4-gara-gara-rempah', '06-bab6', 4, 12, 'Gara-gara rempah,', 'dunia berubah'),
    ('5-ledakan-penduduk', '07-bab7', 5, 10, '1 miliar manusia:', 'butuh berapa lama?'),
]
VY, VH = 600, 608          # video 16:9 selebar layar
INK, SUN, PAPER, MINT = '&H00402D2A', '&H005AC2E8', '&H00E6F0F4', '&H00B4C79A'   # ASS = BBGGRR


def tc(t):
    t = max(0, t)
    return f'{int(t // 3600)}:{int(t % 3600 // 60):02d}:{t % 60:05.2f}'


def ass(caps, t0, dur, j1, j2):
    L = ['[Script Info]', 'ScriptType: v4.00+', 'PlayResX: 1080', 'PlayResY: 1920', 'WrapStyle: 0', 'ScaledBorderAndShadow: yes', '',
         '[V4+ Styles]',
         'Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding',
         f'Style: J1,Fredoka,92,{PAPER},{PAPER},&H00181410,&H00000000,1,0,0,0,100,100,0,0,1,9,0,8,50,50,270,1',
         f'Style: J2,Fredoka,92,{SUN},{SUN},&H00181410,&H00000000,1,0,0,0,100,100,0,0,1,9,0,8,50,50,385,1',
         f'Style: Cap,Fredoka,62,&H00FFFFFF,&H00FFFFFF,&H00181410,&H00000000,1,0,0,0,100,100,0,0,1,6,0,8,80,80,{VY + VH + 70},1',
         f'Style: Cta,Fredoka,40,{MINT},{MINT},&H00181410,&H00000000,1,0,0,0,100,100,0,0,1,4,0,8,60,60,1575,1',
         '', '[Events]', 'Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text']
    ev = lambda a, b, st, tx: L.append(f'Dialogue: 0,{tc(a)},{tc(b)},{st},,0,0,0,,{tx}')
    ev(0, dur, 'J1', '{\\fad(250,0)}' + j1)
    ev(0, dur, 'J2', '{\\fad(250,0)}' + j2)
    ev(0, dur, 'Cta', 'Versi lengkap 11 menit ▸ YouTube Let.growww')
    for k in caps:
        ev(k['a'] - t0, k['b'] - t0, 'Cap', '{\\fad(100,80)}' + k['t'])
    return '\n'.join(L) + '\n'


for nama, bag, i0, i1, j1, j2 in KLIP:
    caps = CAPS[bag][i0:i1 + 1]
    t0, t1 = caps[0]['a'] - .4, caps[-1]['b'] + .7
    dur = t1 - t0
    src = R / 'bagian' / bag / f'{bag}-bersih.mp4'
    sub = OUT / f'_{nama}.ass'
    sub.write_text(ass(caps, t0, dur, j1, j2))
    fc = (f"[0:v]split=2[a][b];"
          f"[a]scale=-2:1920,crop=1080:1920,boxblur=28:4,eq=brightness=-0.22:saturation=0.8[bg];"
          f"[b]scale=1080:{VH},pad=1080:{VH + 12}:0:6:color=0xE8C25A[fg];"
          f"[bg][fg]overlay=0:{VY - 6},ass='{sub}':fontsdir='{FONT}',fade=t=in:d=0.25,fade=t=out:st={dur - .35:.2f}:d=0.35[v];"
          f"[1:a]atrim=20:{20 + dur:.2f},asetpts=N/SR/TB,volume=0.30,afade=t=in:d=0.4,afade=t=out:st={dur - 1.2:.2f}:d=1.2[m];"
          f"[0:a]afade=t=in:d=0.15,afade=t=out:st={dur - .4:.2f}:d=0.4,asplit=2[vo][k];"
          f"[m][k]sidechaincompress=threshold=0.03:ratio=8:attack=40:release=600[md];"
          f"[vo][md]amix=inputs=2:duration=first:normalize=0,loudnorm=I=-14:TP=-1.5[au]")
    out = OUT / f'{nama}.mp4'
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', f'{t0:.3f}', '-t', f'{dur:.3f}', '-i', str(src),
                    '-stream_loop', '-1', '-i', str(R / 'audio-semua/music.mp3'), '-filter_complex', fc,
                    '-map', '[v]', '-map', '[au]', '-t', f'{dur:.3f}', '-r', '30', '-c:v', 'libx264', '-preset', 'medium', '-crf', '20',
                    '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', '-movflags', '+faststart', str(out)], check=True)
    sub.unlink()
    print(f'{out.name}  {dur:.1f} dtk')
