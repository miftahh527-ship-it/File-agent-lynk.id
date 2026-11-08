# Kredit

**Motion Format** dibangun di atas **Bang Motion v1.19.0** karya
[Bang Tutorial](https://youtube.com/bangtutorial) —
<https://github.com/bangtutorial/bang-motion> — dirilis dengan lisensi MIT.

Dari Bang Motion (dipertahankan, dengan penyesuaian kecil):
- hukum anti-PPT, style brief, menu 10 arah gaya dan 19 konsep opener
- 6 gaya explainer beserta starter-nya, rig kamera, resep teknis
- skrip `snap.mjs`, `export-frames.mjs`, `vo-pauses.html`, `serve.py`,
  `kepala-ekspresi.py`, dan bridge After Effects

Tambahan Motion Format (lihat `CHANGELOG.md`):
- alur untuk pemula lewat chat dalam bahasa Indonesia (rumus brief 5 hal, revisi 1 kalimat,
  folder proyek baku)
- suara lewat plugin ElevenLabs: VO per adegan + efek suara, dibuat sebelum animasi
  (`references/suara-elevenlabs.md`)
- blok "SUARA Motion Format" (`AUDIO_PLAN`) di semua starter
- `scripts/render_mp4.py`: render MP4 bersuara tanpa Node, dengan normalisasi loudness

Peta (`scripts/peta_data.py`, `scripts/peta_svg.py`): garis pantai, proyeksi, dan penghalusan
ditulis sendiri untuk Motion Format — tanpa data atau pustaka pihak ketiga. Rumus proyeksi Natural
Earth (Šavrič dkk., 2015) dipakai sebagai rumus matematika publik.

Terima kasih kepada Bang Tutorial yang membagikan Bang Motion secara terbuka.
