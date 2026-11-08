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

Foto asli berlisensi bebas + sumbernya: `foto/SUMBER.md` (kredit tampil di bawah tiap foto di video dan di deskripsi). Foto berhak cipta penuh tidak dipakai — diganti motion grafik.

Tata letak (skill motion-format 1.2, Hukum #5 "Rapi"): `python3 naskah/cek.py` menjalankan `cek_tata_letak.py` ke semua bagian + Short. Target 0 galat.
Elemen SVG diberi peran (`data-tata="teks|subjek|gambar"`), label/kartu memakai penjaga tepi (`data-jaga`: memudar sebelum terpotong frame), kartu foto `data-boleh-tumpuk`.
Pengecualian sah proyek ini: subtitle (#cap, berlatar blok gelap, selalu di depan) di atas tubuh tokoh/gambar.

Peta: digambar sendiri (titik lon/lat buatan tangan di `lib/peta-data.js`, dihaluskan dengan kurva) — tidak memakai data peta dari internet.
