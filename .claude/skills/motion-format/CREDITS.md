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

Data & pustaka peta (di `assets/data/`, dipakai oleh `scripts/peta_svg.py`):
- Natural Earth 1:50m & 1:110m — domain publik (<https://www.naturalearthdata.com>)
- world-atlas 2.0.2 (TopoJSON Natural Earth) — Mike Bostock, ISC
- d3-geo 3.1.1 & d3-array 3.2.4 — Mike Bostock, ISC
- topojson-client 3.1.0 — Mike Bostock, ISC
- polygon-clipping 0.15.7 — Mike Fogel, MIT

Terima kasih kepada Bang Tutorial yang membagikan Bang Motion secara terbuka.
