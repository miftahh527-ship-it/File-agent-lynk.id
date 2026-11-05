# Perjalanan 300.000 Tahun — paket YouTube

| Hasil | Berkas |
|---|---|
| Video long + intro kanal (11:12, subtitle, backsound) | `perjalanan-manusia-youtube.mp4` |
| Short 9:16 (27 dtk) | `short/perjalanan-manusia-short.mp4` |
| Deskripsi, judul, chapter, tag | `youtube.md` |
| Thumbnail long 1280×720 | `thumbnail-long.png` |
| Thumbnail Short 1080×1920 | `short/thumbnail-short.png` |

Sumber: `bagian/<nn>/adegan.js` (animasi per bab) + `lib/` (rig, benda, subtitle) → `python3 naskah/build.py` → `bagian/<nn>/index.html`.
Render: `naskah/render-semua.sh <bagian…>` lalu `python3 naskah/gabung.py` (gabung + backsound) dan `gabung_intro.py`.
Naskah VO & subtitle: `naskah/vo.py`, `naskah/caps.py`, `vo-script.md`. Audio: `audio-semua/`.

Foto asli + lisensi: `foto/SUMBER.md` (kredit tampil di bawah tiap foto di video). Draf email izin foto cap tangan Liang Metanduno: `izin-foto-muna.md`.
