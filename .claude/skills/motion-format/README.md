# Motion Format — skill motion graphic untuk Claude Code

Bikin video motion graphic cukup dengan ngobrol. Ceritakan idemu ke Claude Code, skill ini
yang mengurus konsep, animasi, voiceover, efek suara, sampai file MP4 siap upload.

**Versi 1.0.0** · dibangun di atas [Bang Motion](https://github.com/bangtutorial/bang-motion)
v1.19.0 karya Bang Tutorial (lisensi MIT). Lihat `CREDITS.md`.

## Yang bisa kamu bikin

| Jenis | Durasi umum |
|---|---|
| Video promo & iklan produk | 15–40 detik |
| Intro kanal, opener, bumper | 3–12 detik |
| Kinetic typography | 10–60 detik |
| Demo aplikasi / SaaS | 20–60 detik |
| Explainer (kartun, jurnalisme visual, katalog, sketsa vintage, aksi kontinu) | 30–90 detik |

Format 16:9 (YouTube), 9:16 (Reels, TikTok, Shorts), atau 1:1 (feed).

## Yang perlu disiapkan

1. **Claude Pro** (atau paket di atasnya), karena Claude Code sudah termasuk.
2. **Claude Code**, bisa lewat aplikasi desktop Claude atau terminal.
3. **Plugin ElevenLabs** untuk voiceover dan efek suara (opsional tapi disarankan):
   buka menu **Connectors** di aplikasi Claude → pilih **ElevenLabs** → login. Tidak perlu API key.
4. Untuk export MP4: **Google Chrome**, **Python 3**, dan **ffmpeg**. Tidak perlu hafal
   caranya. Kalau belum ada, Claude akan menawarkan untuk memasangkannya.

## Cara pasang

**Cara paling mudah:** buka Claude Code, lampirkan file zip ini, lalu ketik:

```
pasang skill dari zip ini ke folder skill Claude Code
```

**Cara manual:** ekstrak zip, lalu pindahkan folder `motion-format` ke:

| Sistem | Lokasi |
|---|---|
| Mac / Linux | `~/.claude/skills/motion-format` |
| Windows | `C:\Users\<nama-kamu>\.claude\skills\motion-format` |

Tutup lalu buka lagi Claude Code. Cek dengan mengetik: `skill motion-format sudah aktif?`

> Sudah memasang Bang Motion sebelumnya? Cukup pakai salah satu, supaya Claude tidak bingung
> memilih skill.

## Cara pakai

Mulai chat baru untuk setiap video, lalu sebutkan 5 hal ini:

1. **Mau bikin apa**: promo, intro, explainer, …
2. **Topik atau produk** + bahan kalau ada (logo, foto, link)
3. **Untuk siapa**
4. **Durasi**
5. **Format**: 16:9, 9:16, atau 1:1

Contoh:

```
bikin video promo 20 detik untuk kedai kopi "Senja", target mahasiswa,
format 9:16 untuk Reels. pakai voiceover dan efek suara dari ElevenLabs. logo terlampir.
```

```
bikin explainer 60 detik: kenapa langit berwarna biru? gaya kartun, untuk anak SD,
16:9, pakai voiceover suara perempuan yang hangat.
```

Alurnya:
1. Claude menawarkan **3 konsep**, lalu kamu pilih satu.
2. Claude menulis **naskah per adegan**, lalu kamu setujui.
3. **Voiceover & efek suara** dibuat di ElevenLabs. Adegan pertama dites dulu supaya hemat kuota.
4. Animasi dibangun mengikuti suara. Kamu bisa langsung buka `index.html` di browser.
5. **Revisi cukup 1 kalimat**, misalnya "logonya lebih besar" atau "adegan 3 kelamaan".
6. **Export MP4**: ketik `render jadi mp4`.

## Paket Gaya Explainer Kartun (paket Kreator)

Tambahan berbayar yang dipasang di atas skill ini: gaya kartun kertas khas Motion Format (seperti
video "Kenapa Bulan ikut kita?"), 10 karakter berekspresi, 17 efek suara, dan 3 musik latar.
Cara pasang ada di `PAKET-GAYA-KARTUN.md` di dalam zip paketnya.

## Isi paket

```
SKILL.md                     aturan & alur kerja (dibaca Claude)
references/
  suara-elevenlabs.md        voiceover + efek suara ElevenLabs, AUDIO_PLAN, render bersuara
  opener-konsep.md           19 konsep opener/promo
  explainer.md               6 gaya explainer
  techniques.md              tipografi, kamera, transisi, latar
  anti-ppt.md                supaya hasilnya video, bukan slide
  kartun-panggung.md         explainer kartun berkarakter
  architecture.md, roadmap.md, ae-bridge-higgsfield.md
assets/                      7 starter (sudah siap suara)
scripts/
  render_mp4.py              render MP4 bersuara (Python + Chrome + ffmpeg)
  vo-pauses.html             deteksi jeda voiceover di browser
  snap.mjs, export-frames.mjs, serve.py, kepala-ekspresi.py, ae/
```

## Lisensi

MIT. Lihat `LICENSE` dan `CREDITS.md`. Video yang kamu buat adalah karyamu. Tetap cek
ketentuan penggunaan tiap layanan, misalnya ElevenLabs untuk pemakaian suara komersial.
