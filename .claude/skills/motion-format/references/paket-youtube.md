# Paket YouTube — satu brief, lima hasil

Dibaca SETIAP kali brief menyebut YouTube sebagai tujuan video ("video YouTube", "upload ke
kanal", "untuk YouTube", "video long + short", "konten kanal"). Satu brief YouTube TIDAK
selesai dengan satu MP4. Pekerjaannya selalu lima hasil:

| # | Hasil | Berkas | Ukuran |
|---|---|---|---|
| 1 | **Video long** dengan intro kanal yang sudah ditetapkan di depannya | `nama-proyek-youtube.mp4` | 16:9, 1920×1080 |
| 2 | **Short**: satu tema paling menarik dari video long, dibangun ulang tegak | `short/nama-proyek-short.mp4` | 9:16, 1080×1920, ≤ 60 dtk |
| 3 | **Deskripsi**: judul, deskripsi, chapter, tag (long + short) | `youtube.md` | — |
| 4 | **Thumbnail long** | `thumbnail-long.png` | 1280×720 |
| 5 | **Thumbnail short** (cover) | `short/thumbnail-short.png` | 1080×1920 |

Jangan berhenti di hasil 1 lalu bertanya "mau dibuatkan short-nya juga?". Kelima hasil
adalah bagian dari brief; yang boleh ditanyakan hanya hal yang tidak bisa diturunkan.

## Folder proyek YouTube

```
nama-proyek/
  index.html              # video utama (tanpa intro, intro ditempel saat render)
  vo-script.md
  assets/audio/  assets/img/
  nama-proyek.mp4         # render video utama saja
  nama-proyek-youtube.mp4 # HASIL 1: intro + video utama
  youtube.md              # HASIL 3
  thumbnail-long.html  thumbnail-long.png      # HASIL 4
  short/
    index.html            # short dibangun ulang 9:16
    vo-script.md
    assets/audio/
    nama-proyek-short.mp4               # HASIL 2
    thumbnail-short.html  thumbnail-short.png   # HASIL 5
```

## Langkah 0 — intro kanal yang sudah ditetapkan

Intro adalah identitas kanal: **sama persis di setiap video**. Ia tidak didesain ulang,
tidak diwarnai ulang mengikuti tema video, dan tidak dipotong.

Lokasi bakunya di dalam folder skill ini (ikut tersimpan di repo):

```
assets/intro-kanal/
  intro.mp4      # WAJIB: intro final, 16:9, bersuara bila intronya bersuara
  intro.json     # opsional: {"nama_kanal": "...", "durasi": 6.0, "catatan": "..."}
  index.html     # opsional: sumber intro bila dulu dibuat dengan skill ini
```

1. **`assets/intro-kanal/intro.mp4` ada** → pakai apa adanya. Sebutkan satu kalimat
   ke user: "Intro kanal yang biasa (6 dtk) aku tempel di depan." Jangan tanya ulang.
2. **Tidak ada** → tanyakan SEKALI, digabung ke pertanyaan brief:
   - "kirim file intro kanalmu (MP4)", atau
   - "belum punya — aku buatkan intro kanal sekarang (5–12 dtk, jenis *intro kanal* di
     SKILL.md), lalu kusimpan sebagai intro tetap untuk video berikutnya".
   Setelah ada, simpan ke `assets/intro-kanal/intro.mp4` (+ `intro.json`) dan commit,
   supaya video berikutnya tinggal memakainya.
3. Intro hanya ditempel ke **video long**. **Short tidak memakai intro**: detik pertama
   Short harus langsung hook, intro di sana membuat penonton menggeser layar. Bila user
   ingin identitas di Short, pakai logo kecil di pojok atau sting ≤ 1 dtk di AKHIR.
4. User minta intro diganti → buat/terima intro baru, timpa `assets/intro-kanal/`, dan
   sebutkan bahwa mulai sekarang semua video memakai intro baru.

## Langkah 1 — brief YouTube

Tetap rumus 5 hal + suara (SKILL.md). Default khusus YouTube:

- Format long **16:9** (jangan tanya). Short **9:16** (jangan tanya).
- Durasi long mengikuti brief/VO; default explainer 60–90 dtk, promo 30–40 dtk.
- Tambahan yang ditanyakan dalam pertanyaan yang SAMA hanya bila tidak bisa ditebak:
  nama kanal (bila `intro.json` tidak ada), intro (Langkah 0), dan link/CTA yang wajib
  masuk deskripsi (situs, toko, sosial media).

Style brief + 3 konsep tetap untuk video long. Short dan thumbnail **mewarisi** style brief
long (palet, font, tanda tangan gerak) — tidak perlu persetujuan gaya kedua.

## Langkah 2 — video long + intro

1. Bangun dan render video utama seperti biasa (alur SKILL.md) → `nama-proyek.mp4`.
2. Tempel intro:

   ```
   python3 scripts/gabung_intro.py nama-proyek/nama-proyek.mp4
   # → nama-proyek/nama-proyek-youtube.mp4
   ```

   **Sambungan intro → video selalu memakai transisi memudar** (pudar silang 1 dtk, gambar
   dan suara memudar bersamaan) — bukan cut. Script mengikuti resolusi & fps video utama
   dan menambahkan audio senyap bila salah satu tidak bersuara. Opsi: `--pudar 1.5`
   (durasi pudar), `--gaya hitam` (memudar lewat layar hitam), `--pudar 0` (cut, hanya
   bila user memintanya), `--intro path.mp4`, `--out nama.mp4`.
   Supaya pudarnya enak, **detik pertama video utama jangan langsung berisi teks/aksi
   penting** — mulai dengan latar/establishing yang sudah bergerak, isi masuk ≥ 1 dtk.
3. Script mencetak geseran chapter = durasi intro − durasi pudar (intro 13 dtk, pudar
   1 dtk → video utama mulai di 0:12). **Semua timestamp chapter di deskripsi digeser
   sebesar angka itu**, bukan ditebak.

## Langkah 3 — short: ambil tema paling menarik

Short BUKAN potongan crop dari video long. Ia dibangun ulang 9:16 dari satu tema.

**Memilih tema.** Dari naskah long (`vo-script.md`), tulis 3 kandidat dengan satu baris
alasan masing-masing, lalu pilih satu (tunjukkan ke user bersama pilihannya, tanpa
menunggu bila user sudah bilang "terserah"). Urutan prioritas:

1. Fakta/angka paling mengejutkan ("ternyata 70 % …").
2. Kontras / sebelum-sesudah / mitos vs fakta.
3. Satu langkah atau trik yang bisa langsung dipraktikkan.
4. Pertanyaan yang membuat orang ingin tahu jawabannya.

Tema yang butuh konteks panjang dari adegan lain → bukan kandidat.

**Struktur Short (15–60 dtk, default 30–45):**

| Bagian | Detik | Isi |
|---|---|---|
| Hook | 0–2 | kalimat/visual paling kuat SEGERA, tanpa logo, tanpa salam |
| Isi | 2–(N-5) | satu gagasan, 2–4 beat visual, VO padat |
| Payoff + ajakan | 5 dtk terakhir | jawaban/hasil + "versi lengkap di kanal" (tanpa menyebut "link di deskripsi" — Short tidak menampilkannya) |
| Loop | frame akhir | sebisa mungkin menyambung mulus ke frame pertama (Short diputar ulang otomatis) |

**Membangun:**

- Salin `index.html` long ke `short/index.html`, ubah panggung ke 1080×1920
  (`OPENER.W/H`), lalu **tata ulang** komposisi: subjek di tengah vertikal, teks lebih
  besar (≥ 64 px body), kamera lebih dekat. Jangan sekadar mem-crop panggung 16:9.
- **Zona aman 9:16:** jauhi 220 px teratas dan 380 px terbawah (judul, tombol, caption
  YouTube), serta 140 px tepi kanan (tombol like/komentar). Teks penting di kotak tengah.
- VO: tulis naskah baru yang padat untuk Short (bukan memotong file VO long, karena kalimat
  long biasanya merujuk adegan lain). Suara/voice_id SAMA dengan long. Efek suara boleh
  dipakai ulang dari `../assets/audio/`.
- Hukum anti-PPT, determinisme, dan checklist SKILL.md tetap berlaku penuh.
- Render: `python3 scripts/render_mp4.py nama-proyek/short --out nama-proyek-short.mp4`.

## Langkah 4 — deskripsi (`youtube.md`)

Satu berkas berisi dua bagian yang siap disalin-tempel. Bahasa mengikuti bahasa video.

```markdown
# Video long

## Judul (pilih satu)
1. … (≤ 70 karakter, kata kunci di depan)
2. …
3. …

## Deskripsi
<2 baris pertama: hook + kata kunci utama — inilah yang terlihat sebelum "lainnya">

<1 paragraf ringkasan isi, 2–4 kalimat>

⏱️ Chapter
0:00 Intro
0:12 <judul adegan/bagian 1>
…

🔗 Link
<link/CTA dari user>

📚 Sumber
<sumber fakta, bila explainer>

#tag1 #tag2 #tag3

## Tag (untuk kolom Tag YouTube, dipisah koma, ≤ 500 karakter)
…

# Short

## Judul
… (≤ 60 karakter, hook, diakhiri #Shorts)

## Deskripsi
<1–2 kalimat> 
Versi lengkap: <judul video long>
#Shorts #tag1 #tag2
```

Aturan:

- **Chapter:** baris pertama wajib `0:00`, minimal 3 chapter, masing-masing ≥ 10 dtk
  (syarat YouTube). Timestamp diambil dari `at` adegan di timeline + durasi intro, bukan
  ditebak. Video < 30 dtk → tanpa chapter.
- Hashtag 3–5 yang relevan; yang pertama paling penting (tampil di atas judul).
- Tidak ada klaim yang tidak ada di video/sumber. Tidak ada janji clickbait yang tidak
  dibayar oleh isi video.
- Link video long di deskripsi Short ditulis sebagai placeholder `<link video long>`
  bila belum diunggah — sebutkan itu ke user.

## Langkah 5 — thumbnail long & short

Thumbnail dibangun sebagai HTML (satu berkas, inline, font dari CDN) lalu dipotret jadi PNG:

```
python3 scripts/thumbnail.py nama-proyek/thumbnail-long.html            # → .png 1280×720
python3 scripts/thumbnail.py nama-proyek/short/thumbnail-short.html --short   # → .png 1080×1920
```

Script juga membuat `*-kecil.png` (thumbnail long 246×138, ukuran di daftar saran HP) untuk
uji keterbacaan — LIHAT berkas kecil itu sebelum menyerahkan.

**Hukum thumbnail (long, 1280×720):**

1. **Satu fokus.** Satu subjek besar (karakter/objek/foto dari video, ≥ 40 % tinggi
   frame) + teks ≤ 4 kata. Bukan kolase banyak adegan.
2. **Teks ≠ judul.** Teks thumbnail melengkapi judul, tidak mengulangnya. Tinggi huruf
   ≥ 110 px, bobot 800–900 boleh (pengecualian Hukum #4: thumbnail adalah poster, bukan
   adegan), maksimal 2 baris.
3. **Kontras keras.** Teks punya outline/bayangan tebal atau bidang warna di belakangnya;
   lolos uji grayscale dan uji `-kecil.png`.
4. **Pojok kanan bawah kosong** (± 180×60 px) — tertutup label durasi YouTube.
5. **Kulit = video.** Palet, font display, dan gaya render dari style brief long, supaya
   penonton mengenali isi videonya. Aset diambil dari adegan video (frame terbaik bisa
   dipotret lewat `snap.mjs`/`?debug=1` lalu dipakai sebagai latar), ditambah ekspresi
   atau momen yang paling "berbunyi".
6. Tidak ada logo kanal besar, tidak ada watermark, tidak ada panah/lingkaran merah
   kecuali benar-benar menunjuk sesuatu di gambar.

**Thumbnail short (1080×1920):** dipakai sebagai cover Short (unggah lewat aplikasi YouTube
atau pilih frame). Aturan sama, ditambah: semua teks & subjek di kotak tengah
(zona aman 9:16 di atas), teks ≤ 3 kata, huruf ≥ 140 px. Buat juga versi frame: pastikan
salah satu frame di 1 detik pertama Short mirip cover ini, untuk jaga-jaga user memilih frame.

## Penyerahan

Pesan penutup memuat daftar lima hasil dengan path lengkap, ditambah:

- durasi intro yang dipakai dan nama berkasnya;
- tema Short yang dipilih + alasannya satu kalimat;
- tiga judul long untuk dipilih;
- catatan placeholder yang harus diisi user (link video long di deskripsi Short, dsb).

## Checklist paket YouTube

- [ ] Intro dari `assets/intro-kanal/intro.mp4`, tidak diubah; ditempel di depan video long
      lewat `gabung_intro.py` dengan transisi memudar (default 1 dtk); hasil `-youtube.mp4` diputar & sambungannya dicek (potret
      detik intro-akhir dan detik video-awal)
- [ ] Short tanpa intro; hook di 2 detik pertama; 9:16 ditata ulang (bukan crop);
      teks di zona aman; ≤ 60 dtk; suara sama dengan long
- [ ] Tema Short dipilih dari 3 kandidat tertulis
- [ ] `youtube.md` berisi judul (3 opsi), deskripsi, chapter (0:00, ≥ 3, ≥ 10 dtk, sudah
      digeser durasi intro), hashtag, tag — untuk long DAN short
- [ ] `thumbnail-long.png` 1280×720 dan `thumbnail-short.png` 1080×1920 ada; uji
      `-kecil.png` terbaca; pojok kanan bawah long kosong; teks ≤ 4 kata (short ≤ 3)
- [ ] Kelima hasil disebut di pesan penutup dengan path lengkap
