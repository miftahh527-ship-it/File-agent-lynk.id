# Riwayat perubahan — Motion Format

## 1.2.0 · 8 November 2026

**Baru**
- Hukum #5 "Rapi" + `references/tata-letak.md`: lajur per adegan (16:9, 9:16, 1:1), jarak
  minimum 48 px, satu elemen dominan, penjajaran, perlakuan gambar seragam, daftar tumpukan
  yang sah (`data-boleh-tumpuk`), peta tata letak di rundown, jebakan.
- `scripts/cek_tata_letak.py`: cek tiap 0,25 dtk — teks menimpa teks, gambar menutupi teks,
  teks terpotong tepi (galat); gambar bertumpuk, teks di luar zona aman, jarak < 24 px
  (peringatan); `--gambar` memotret tiap masalah dengan kotak merah/kuning. Juga untuk thumbnail.

**Diperbaiki di starter explainer** (semua kini 0 galat)
- Kartun, katalog, jurnalisme, sketsa: label, catatan tangan, dan kalimat tidak lagi
  berhimpitan — dipisah ke lajur gambar/label/kalimat; lingkaran anotasi memeluk gambarnya;
  stempel tidak menutup teks dokumen; kalimat adegan 2 rata tengah terhadap gambarnya;
  kamera close-up diarahkan ke pusat gambar.
- Kartun: kata sorotan teal ("satu ide") selalu hilang karena class `.hl.t` bentrok dengan
  `.t{opacity:0}` → diganti `.hl.teal`.
- Latar kertas diperlebar sehingga tepi kertas tidak lagi tampak sebagai garis vertikal di adegan 2.
- Aksi kontinu: jarak label "JARAK" → angka besar.
- Titik yang terlepas setelah kata sorotan dihapus (judul tanpa titik, Hukum #4).

## 1.1.0 · 4 November 2026

**Baru**
- Paket YouTube: setiap brief untuk YouTube menghasilkan lima hal — video long dengan intro
  kanal tetap, Short 9:16 dari tema paling menarik, deskripsi (`youtube.md`), thumbnail long,
  dan thumbnail Short. Panduan di `references/paket-youtube.md`.
- `assets/intro-kanal/` → tempat intro kanal yang sudah ditetapkan.
- `scripts/gabung_intro.py` → tempel intro di depan video dengan transisi memudar lewat layar
  hitam 1 dtk (`--pudar`, `--gaya silang`; resolusi/fps/audio disamakan).
- `scripts/thumbnail.py` → thumbnail HTML jadi PNG + versi kecil untuk uji keterbacaan.

## 1.0.0 · 28 September 2026

Rilis pertama, berbasis Bang Motion v1.19.0 (riwayat versi sebelumnya ada di
<https://github.com/bangtutorial/bang-motion>).

**Baru**
- `SKILL.md` → nama `motion-format`; bagian "cara kerja untuk pemula": rumus brief 5 hal,
  alur 7 langkah, revisi 1 kalimat, folder proyek baku.
- `references/suara-elevenlabs.md` → plugin ElevenLabs (tanpa API key), naskah VO per adegan,
  pilih suara, hemat kuota (tes adegan 1 dulu), efek suara, menyimpan berkas, menyusun
  timeline dari durasi VO, `AUDIO_PLAN`, checklist suara.
- `scripts/render_mp4.py` → render frame-by-frame lewat Chrome headless (tanpa Node),
  mix VO + SFX + musik opsional, loudness ±-15 LUFS; opsi `--sampai`, `--fps`, `--out`,
  `--tanpa-audio`; mendeteksi Chrome/Edge/Chromium dan ffmpeg di Mac, Windows, Linux;
  mengikuti ukuran panggung (`OPENER.W/H`) untuk 9:16 dan 1:1.
- Blok "SUARA Motion Format" di ketujuh starter: `window.AUDIO_PLAN` (vo/sfx/music) yang
  mengikuti timeline (scrub, pause, loop) dan menahan video di frame awal bila autoplay
  bersuara diblokir.
- Jalur connector ElevenLabs yang teruji: generate → baca status → unduh `media[].url`
  (kedaluwarsa ±2 jam) dengan curl; selalu 1 variasi per generate; patokan kredit.
- Dukungan Paket Gaya: SKILL.md dan `explainer.md` mendeteksi `references/gaya-kartun-mf.md`
  (Paket Gaya Explainer Kartun) dan menjadikannya rekomendasi pertama untuk explainer edukasi.

**Diubah**
- Alur kerja langkah 6–7 dan checklist: suara dibuat sebelum animasi, render bersuara lewat
  `render_mp4.py`, render cek 8 detik sebelum render penuh.
- `references/explainer.md`: pilihan suara di "Langkah nol" dan "Penyerahan" mengutamakan
  ElevenLabs; retime tetap tersedia untuk VO rekaman sendiri.
- Judul starter "Motion Format — …"; komentar atribusi Bang Motion dipertahankan.

**Dihapus dari paket**
- Manifest plugin Bang Motion (`.claude-plugin/`), galeri `docs/`, dan ikon Bang Motion.
