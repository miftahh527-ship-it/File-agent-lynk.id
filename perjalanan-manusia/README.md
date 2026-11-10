# Perjalanan 300.000 Tahun — paket YouTube

| Hasil | Berkas |
|---|---|
| Video long + intro kanal (11:12, subtitle, backsound) | `perjalanan-manusia-youtube.mp4` |
| Short 9:16 (27 dtk) | `short/perjalanan-manusia-short.mp4` |
| 5 potongan 9:16 untuk Shorts/Reels + caption | `potongan/*.mp4`, `potongan/CAPTION.md` |
| Deskripsi, judul, chapter, tag | `youtube.md` |
| Thumbnail long 1280×720 | `thumbnail-long.png` |
| Thumbnail Short 1080×1920 | `short/thumbnail-short.png` |

Sumber: `bagian/<nn>/adegan.js` (animasi per bab) + `lib/` (tokoh, benda, peta, subtitle) → `python3 naskah/build.py` → `bagian/<nn>/index.html`.
Render: `naskah/render-semua.sh <bagian…>` lalu `python3 naskah/gabung.py` (gabung + backsound) dan `gabung_intro.py`.
Naskah VO & subtitle: `naskah/vo.py`, `naskah/caps.py`, `vo-script.md`. Audio: `audio-semua/`.

Foto asli berlisensi bebas + sumbernya: `foto/SUMBER.md` (kredit tampil di bawah tiap foto di video dan di deskripsi). Foto berhak cipta penuh tidak dipakai — diganti motion grafik.

Tata letak (skill motion-format 1.2, Hukum #5 "Rapi"): `python3 naskah/cek.py` menjalankan `cek_tata_letak.py` ke semua bagian + Short. Target 0 galat.
Elemen SVG diberi peran (`data-tata="teks|subjek|gambar"`), label/kartu memakai penjaga tepi (`data-jaga`: memudar sebelum terpotong frame), kartu foto `data-boleh-tumpuk`.
Pengecualian sah proyek ini: subtitle (#cap, berlatar blok gelap, selalu di depan) di atas tubuh tokoh/gambar.

Grafis rapi (skill motion-format 1.4, Hukum #6):
- Peta: data garis pantai buatan tangan milik skill (`.claude/skills/motion-format/scripts/peta_data.py`; Muna, Buton, Bangka, Ternate, Tidore ditambahkan di sana) → `python3 naskah/peta_js.py` → `lib/peta-data.js`. Dihaluskan Catmull-Rom sentripetal, batas darat lurus; proyeksi natural-earth (dunia) dan mercator (wilayah) ditulis sendiri di `lib/benda.js`. Tidak memakai data peta dari internet.
- Tokoh: kit resmi `assets/tokoh-rapi.js` (`TOKOH.buat`), dibungkus `character()` di `lib/inti.js`; aksesori kepala di `ch.headAcc`.
