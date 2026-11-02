# Let.growww — Intro YouTube

| File | Isi |
|---|---|
| `letgrowww-intro-5detik.mp4` | Intro 5 detik (logo, judul **Let.growww**, tagline *mari bertumbuh bersama*) + SFX |
| `letgrowww-intro-lengkap.mp4` | Intro 5 detik + layar **Perhatian** (total 13 detik) |
| `sfx.wav` | Audio SFX terpisah (48 kHz stereo) untuk diedit di editor video |

Format: 1920×1080, 30 fps, H.264 + AAC — siap upload ke YouTube.

## Alur animasi
- **0.0–0.8 dtk** — whoosh, lingkaran logo tergambar
- **0.6–1.4 dtk** — 3 batang data naik, tiap batang berbunyi *ting* (C–E–G)
- **1.4–1.9 dtk** — tunas tumbuh, daun "pop" + kilau
- **2.0–3.0 dtk** — logo naik, judul muncul huruf per huruf dengan bass hit; tiga huruf **w** melompat dengan bunyi *blup-blup-blup* (ini "sonic logo" yang mudah diingat)
- **3.0–4.4 dtk** — tagline + garis bawah tumbuh, akor C mayor
- **4.4–5.0 dtk** — transisi lingkaran hijau lime
- **5.0–13.0 dtk** — layar Perhatian dengan chime 2 nada + progress bar waktu baca

## Edit & render ulang
Teks, warna, dan timing ada di `scene.html` (buka `scene.html?preview` di browser untuk preview langsung).
SFX disintesis di `sfx.py` (tanpa sampel berlisensi). Render ulang: `bash build.sh` (butuh Node + Playwright, Python + NumPy, ffmpeg).
