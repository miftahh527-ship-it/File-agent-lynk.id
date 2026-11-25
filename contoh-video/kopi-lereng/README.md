# Contoh video motion-format: Kopi Lereng

Empat contoh video untuk satu brand fiktif, **Kopi Lereng**. Semuanya dibuat dengan skill
`motion-format` (HTML + CSS + GSAP, ditambah suara ElevenLabs), lalu dirender ke MP4 bersuara.
Brief, konsep, dan naskahnya ada di [`BRIEF.md`](BRIEF.md).

| Folder | Jenis | Durasi | Konsep / gaya |
|---|---|---|---|
| [`promo/`](promo/) | Promo / opener | 32 dtk | Estafet benda: satu ceri dari lereng sampai ke cangkir di tangan. Editorial terang, lalu medan terakota. Logo lahir dari crema. |
| [`explainer/`](explainer/) | Explainer | 61 dtk | Kartun kolase: kenapa biji kopi berubah cokelat saat disangrai (Maillard, karamel, first crack). |
| [`kinetik/`](kinetik/) | Kinetic typography | 19,5 dtk | Tipografi murni, poster color-block. Kata raksasa menabrak tepi frame di tiap ketukan VO. |
| [`bumper/`](bumper/) | Bumper / logo sting | 6,5 dtk | Mewah gelap: uap naik dan menggambar garis lereng, yang ternyata logo. |

Isi tiap folder:
- `index.html` — video-nya. Klik dua kali untuk menonton di browser (autoplay dan loop).
  Tambahkan `?debug=1` di alamat untuk panel scrub. Tombol R untuk ulang, Space untuk jeda.
- `<nama>.mp4` — hasil render 1920×1080, 30 fps, dengan suara.
- `vo-script.md` — naskah, suara, dan jadwal VO.
- `assets/audio/` — VO dan efek suara dari ElevenLabs (suara Serena, `eleven_multilingual_v2`).

## Mengedit dan merender ulang

Sumber setiap video ada di `_src/<nama>.html`. Bagian yang sama di semua video
(timeline, motion blur, sinkron suara, hook render) ada di `_src/core.js` dan `_src/core.css`.

```bash
python3 _src/build.py                                                  # rakit ulang semua index.html
python3 ../../.claude/skills/motion-format/scripts/cek_tata_letak.py promo   # cek tumpang tindih (target 0 galat)
python3 ../../.claude/skills/motion-format/scripts/render_mp4.py promo       # render MP4 bersuara
```

Semua gerak adalah fungsi dari waktu timeline (tanpa `Math.random()` atau jam sistem),
jadi setiap render menghasilkan frame yang identik.
