# Let.growww — intro & outro YouTube v2 (skill Motion Format)

**Konsep terpilih: `konsep-3-huruf` (Huruf jadi tanaman).** File siap pakai:
`hasil/konsep-3-huruf-intro-5detik.mp4`, `hasil/konsep-3-huruf-intro-lengkap.mp4`, `hasil/konsep-3-huruf-outro-10detik.mp4`.

Tiga konsep untuk dipilih. Masing-masing berisi **intro** (5 dtk + layar Perhatian, total 13 dtk) dan
**outro** (10 dtk). 16:9, 1920×1080, 30 fps.

| Konsep | Ide | Tanda tangan gerak |
|---|---|---|
| `konsep-1-benih` | Sebutir benih jatuh, bertunas, lalu mekar jadi maskot; huruf tumbuh dari tanah; Perhatian di papan kayu; outro: akun sosial di papan yang tumbuh dari tanah | benda tumbuh dari tanah dengan pantulan |
| `konsep-2-kebun` | Kamera menyusuri kebun berlapis (parallax), berhenti di papan nama, maskot & pita tagline; whip ke papan pengumuman; outro: kebun senja, spanduk + papan panah | kamera berjalan menyamping + ukuran shot dekat ↔ lebar |
| `konsep-3-huruf` | Tipografi murni: huruf menyembul dari tanah, titik "Let." melompat dan mekar jadi maskot; Perhatian di atas tanah gelap; outro: kata dan kartu menyembul dari tanah | huruf menyembul dari garis tanah |

## Gaya (berlaku untuk semua konsep)
- **Palet dari maskot:** cokelat benih `#8A5A3B`, hijau tunas `#9CC45E`, krem cahaya pagi `#F7EBD3`, aksen jingga marigold `#F2A33A`.
- **Font:** Fredoka (display) + Nunito (teks) — disimpan lokal di `shared/fonts/` (SIL OFL).
- **Latar:** gradien krem dengan matahari yang bergeser, tekstur kertas halus, serbuk sari & daun melayang.

## Menonton & mengedit
Buka `konsep-*/intro/index.html` atau `konsep-*/outro/index.html` (klik dua kali). Tambah `?debug=1`
di alamat untuk panel scrub. Spasi = jeda, R = ulang.

## Render MP4
```
bash tools/render-semua.sh          # hasil di folder hasil/
```
Butuh Python 3, Chrome/Chromium, dan ffmpeg. `tools/render_mp4.py` berasal dari skill Motion Format
(MIT), ditambah `--no-sandbox` saat berjalan sebagai root (container).

## Suara
Efek suara dibuat lewat ElevenLabs (lihat `vo-script.md`) dan diletakkan di `shared/audio/`.
Semua MP4 di `hasil/` sudah bersuara (dinormalkan ±-15 LUFS).
