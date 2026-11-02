# Suara lewat ElevenLabs — voiceover per adegan + efek suara

Tambahan Motion Format. Dibaca setiap kali video memakai suara: explainer ber-VO,
promo dengan narasi, atau video apa pun yang diberi efek suara. Tujuannya: user cukup
ngobrol, lalu suara dibuat, disimpan, disinkronkan, dan ikut masuk ke MP4 tanpa mereka
menyentuh editor audio.

## 0. Urutan wajib: naskah → suara → animasi

Suara dibuat SEBELUM animasi dibangun, bukan sesudahnya. Durasi tiap klip VO menentukan
panjang tiap adegan, jadi animasi langsung pas dengan suara dan tidak perlu retime.
Membangun dulu lalu menyesuaikan dengan VO yang datang belakangan = kerja dua kali dan
token dua kali. Retime (`explainer.md` → "Retime ke VO yang datang belakangan") hanya
untuk VO yang direkam user sendiri setelah video jadi.

## 1. Cek plugin ElevenLabs

ElevenLabs dipasang sebagai **connector/plugin** di aplikasi Claude (menu Connectors →
ElevenLabs → login akun). Tidak perlu API key.

- Lihat daftar tool yang tersedia. Connector ElevenLabs biasanya punya tool untuk
  daftar suara (list voices), membuat suara dari teks (generate speech / text to speech),
  dan membuat efek suara (sound effects / sound generation). Nama tool bisa berbeda antar
  versi; pilih berdasarkan fungsinya, bukan nama persisnya.
- **Belum tersambung?** Beri tahu user satu kalimat: "Plugin ElevenLabs belum tersambung.
  Buka menu Connectors, pilih ElevenLabs, login, lalu mulai chat baru." Sambil menunggu,
  lanjutkan naskah. Jangan meminta API key.
- **User tidak mau pakai ElevenLabs?** Video tetap jadi tanpa suara (atau user merekam
  sendiri → alur retime di `explainer.md`). Naskah VO tetap ditulis.

## 2. Naskah VO (`vo-script.md`)

Satu paragraf = satu klip = satu adegan. Tulis sebagai tabel dan tunjukkan ke user
sebelum generate, karena generate memakai kuota karakter mereka.

```markdown
# Naskah VO: <judul>

Suara: <nama suara> (<id suara>), model <model>, bahasa Indonesia.
Satu paragraf = satu klip = satu adegan (`assets/audio/vo1.mp3` … `voN.mp3`).
Efek suara: `assets/audio/sfx-*.mp3`. Musik: tidak ada (kecuali user meminta).

| # | Adegan | Naskah |
|---|---|---|
| 1 | … | … |
```

Aturan naskah:
- Kalimat pendek dan lisan; angka ditulis dengan kata ("tiga ratus delapan puluh ribu"),
  singkatan dieja sesuai cara diucapkan.
- Perkiraan durasi bahasa Indonesia ±2,3 kata per detik (±140 kata per menit). Pakai
  angka ini untuk menjaga durasi sesuai brief SEBELUM generate.
- Beri tahu perkiraan kuota: jumlah karakter naskah ≈ karakter ElevenLabs yang terpakai.
  Contoh: "Naskah ini ±900 karakter, jadi memakai ±900 kredit karakter ElevenLabs."
- Titik tiga (…) atau koma memberi jeda alami; jangan menulis tag jeda yang tidak didukung.

## 3. Pilih suara (sekali, lalu konsisten)

- Ambil daftar suara, saring yang berbahasa Indonesia atau multibahasa. Tawarkan 2–3
  pilihan dengan alasan singkat (hangat/ceria/berwibawa, perempuan/laki-laki), satu
  direkomendasikan sesuai nuansa brief. Bila user sudah pernah memilih suara di proyek
  sebelumnya dan menyebutnya, pakai itu.
- Gunakan model multibahasa terbaru yang tersedia di connector (mis. keluarga
  `eleven_multilingual`), karena lafal bahasa Indonesianya paling stabil.
- Tulis nama + id suara + model di kepala `vo-script.md`, supaya video berikutnya
  memakai suara yang sama.

## 4. Hemat kuota

0. **Selalu minta 1 variasi per generate.** Tool ElevenLabs bawaannya membuat 4 variasi
   (`generations_count` default 4), jadi kuota terpakai 4× lipat. Set ke 1, kecuali user
   memang minta beberapa pilihan. Jangan memanggil ulang untuk "mencoba lagi" bila hasil
   masih diproses — itu generate baru dan dikenai biaya lagi.
   Patokan biaya (teruji Sep 2026): VO `eleven_multilingual_v2` ≈ 1 kredit per karakter
   (kalimat 40 karakter = 40 kredit); satu efek suara ≈ 17 kredit.
1. Generate **adegan 1 dulu** sebagai tes suara. Minta user mendengar, baru generate
   sisanya.
2. Revisi naskah hanya meng-generate ulang paragraf yang berubah (`vo3.mp3` saja), bukan
   semua.
3. Jangan generate ulang hanya untuk mengubah jeda; jeda diatur lewat `at` di AUDIO_PLAN.

## 5. Efek suara (SFX)

- Default: 3–8 efek per video, hanya di momen yang berarti: elemen penting muncul (pop),
  transisi besar (whoosh), angka/hasil selesai (ding), benda jatuh/mendarat (thud), kertas
  (paper swish). Bukan di setiap gerakan.
- Prompt efek suara dalam bahasa Inggris, pendek dan spesifik, dengan durasi:
  "soft cartoon pop, short, 0.4 seconds", "quick airy whoosh transition, 0.8 seconds",
  "bright bell ding notification, 1 second".
- Satu efek dapat dipakai berkali-kali; generate sekali, tulis beberapa `at`.
- Model efek suara: `eleven_text_to_sound_v2` (tipe node `sfx`). Hasil minimal ±2 detik
  walau diminta lebih pendek; bunyinya di awal dan sisanya hening, jadi aman dipakai apa
  adanya (`at` = detik bunyi).
- Nama berkas: `assets/audio/sfx-<nama>.mp3` (sfx-pop, sfx-whoosh, sfx-ding, …).
- **Musik latar: tidak ada, kecuali user memintanya.** Bila diminta, satu berkas
  `assets/audio/music.mp3`, volume .12–.18 di bawah VO.

## 6. Menyimpan berkas ke folder proyek

Semua audio harus ada sebagai berkas di `assets/audio/` di dalam folder proyek.

**Jalur yang teruji dengan connector ElevenLabs (Sep 2026):**
1. Generate (tool speech / generate in flow) → langsung kembali dengan `flow_id` dan
   `session_ids`; generate berjalan di latar (VO pendek ±5–10 detik).
2. Baca status run (tool run status dengan `flow_id` + `session_ids`) sampai
   `all_completed`. Hasilnya memuat `media[].url` (MP3, link bertanda tangan yang
   **kedaluwarsa ±2 jam**) dan `duration_secs`.
3. Unduh SEGERA: `curl -sSL -o assets/audio/vo1.mp3 "<url>"`, lalu cek
   `file assets/audio/vo1.mp3` (harus "Audio file") dan ukur durasinya.
4. Generate beberapa adegan dalam satu flow (`flow_id` yang sama) supaya rapi di akun
   ElevenLabs user.

Variasi lain bila versi connector berbeda:
- Bila tool mengembalikan berkas/path → pindahkan/salin ke `assets/audio/` dengan nama
  yang benar.
- Bila tool mengembalikan URL unduhan → unduh (`curl -L -o assets/audio/vo1.mp3 "<url>"`).
- Bila hasil hanya tampil di chat (pemutar) tanpa berkas atau URL → minta user mengklik
  unduh pada setiap hasil dan menaruhnya di `assets/audio/` dengan nama yang kamu sebutkan
  persis (tulis daftarnya: `vo1.mp3` = adegan 1, …). Tunggu sampai berkas ada sebelum
  lanjut.
- Periksa tiap berkas benar-benar audio dan ukur durasinya: `ffprobe -v error
  -show_entries format=duration -of csv=p=0 berkas.mp3`, atau tanpa ffmpeg buka
  `scripts/vo-pauses.html` dan baca `DUR`.

## 7. Menyusun waktu (AUDIO_PLAN)

Durasi VO menentukan timeline, bukan sebaliknya:

```
T1 = 0.6                          # jeda napas di awal
T(n+1) = T(n) + durasi(vo n) + 0.5   # 0.4–0.8 dtk jeda antar adegan (lebih lama untuk ganti babak)
DUR = T(terakhir) + durasi(vo terakhir) + 1.5   # ekor untuk penutup
```

Adegan ke-n dimulai sedikit sebelum `T(n)` (±0,3 dtk) supaya gambar sudah bergerak saat
suara masuk. Teks/objek yang disebut di kalimat muncul pada detik kata itu diucapkan
(pakai `SEG` dari `vo-pauses.html` bila perlu presisi per frasa).

Isi `window.AUDIO_PLAN` di `index.html` (blok "SUARA Motion Format" sudah ada di semua
starter):

```js
window.AUDIO_PLAN = {
  vo:  [ {at: 0.6,  src: 'assets/audio/vo1.mp3', vol: 1},
         {at: 13.2, src: 'assets/audio/vo2.mp3', vol: 1} ],
  sfx: [ {at: 1.4,  src: 'assets/audio/sfx-pop.mp3',    vol: .5},
         {at: 12.9, src: 'assets/audio/sfx-whoosh.mp3', vol: .45} ],
  music: null
};
```

Volume: VO 1; SFX .35–.6 (lebih pelan bila berbarengan dengan kalimat); musik .12–.18.
Saat MP4 dirender, semuanya dinormalkan ke ±-15 LUFS.

Blok SUARA di starter sudah menangani: audio mengikuti scrub `?debug=1`, pause, loop;
bila browser memblokir autoplay bersuara, video ditahan di frame awal dan mulai bersama
suara pada klik/tombol pertama. Jangan mengubah bagian itu; cukup isi `AUDIO_PLAN`.

## 8. Render MP4 bersuara

```
python3 <folder-skill>/scripts/render_mp4.py <folder-proyek>            # 30 fps
python3 <folder-skill>/scripts/render_mp4.py <folder-proyek> --sampai 8  # cek 8 detik pertama
```

Butuh Python 3, Google Chrome, dan ffmpeg (tanpa Node). Skrip mengambil tiap frame
setelah seek (tidak ada frame drop), mencampur VO + SFX (+ musik) sesuai `AUDIO_PLAN`,
lalu menormalkan loudness. Hasil: `<nama-folder>.mp4` di folder proyek. Untuk 9:16,
starter sudah mengatur `OPENER.W/H`; skrip mengikuti ukurannya.

Sebelum render penuh, render `--sampai 8` lalu minta user menonton sebentar: suara pas
dengan gambar? volume efek tidak menutupi VO?

## 9. Checklist suara

- [ ] Naskah ditunjukkan + perkiraan karakter disebut SEBELUM generate
- [ ] Suara, id, dan model tercatat di `vo-script.md`
- [ ] Adegan 1 dites dulu, baru sisanya
- [ ] Semua berkas ada di `assets/audio/` dengan nama baku, durasi sudah diukur
- [ ] Timeline mengikuti durasi VO (T1…Tn), bukan VO dipaksa masuk ke timeline lama
- [ ] SFX hanya di momen berarti, volume di bawah VO; musik hanya bila diminta
- [ ] Render cek `--sampai 8` sudah ditonton user sebelum render penuh
