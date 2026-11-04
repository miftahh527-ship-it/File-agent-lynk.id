# Riwayat perubahan — Motion Format

## 1.1.0 · 4 November 2026

**Baru**
- Paket YouTube: setiap brief untuk YouTube menghasilkan lima hal — video long dengan intro
  kanal tetap, Short 9:16 dari tema paling menarik, deskripsi (`youtube.md`), thumbnail long,
  dan thumbnail Short. Panduan di `references/paket-youtube.md`.
- `assets/intro-kanal/` → tempat intro kanal yang sudah ditetapkan.
- `scripts/gabung_intro.py` → tempel intro di depan video (resolusi/fps/audio disamakan).
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
