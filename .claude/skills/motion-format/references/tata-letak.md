# Tata letak — rapi, tidak tumpang tindih

Dibaca SEBELUM menulis rundown/kode untuk video apa pun, dan sebelum membuat thumbnail.
Video yang animasinya bagus tetap terlihat berantakan bila label menempel ke kalimat, catatan
duduk di atas kata kunci, atau gambar menutupi teks. Penyebabnya hampir selalu sama: posisi
ditebak per elemen, bukan direncanakan per adegan. Aturan di sini mengunci TEMPAT tiap elemen;
gaya tetap bebas (Hukum #3).

## Hukum tata letak

1. **Setiap elemen punya tempat sendiri.** Teks tidak pernah menimpa teks, gambar tidak pernah
   menutupi teks, dan teks tidak berdiri setengah di atas gambar setengah di luar.
2. **Tumpukan hanya bila disengaja** (daftar "Tumpukan yang sah" di bawah) dan ditandai di kode.
3. **Rencanakan dulu, baru kode.** Rundown memuat peta tata letak per adegan (format di bawah).
4. **Cek mekanis, lalu cek mata.** `scripts/cek_tata_letak.py` harus 0 galat sebelum
   `snap.mjs`/preview ditunjukkan ke user.

## Lajur — kerangka tiap adegan

Bagi frame menjadi lajur horizontal. Satu jenis elemen = satu lajur; lajur tidak saling
bertumpuk; jarak antar-lajur ≥ 48 px.

**16:9 (1920×1080)** — margin aman 96 px kiri/kanan, 54 px atas/bawah:

| Lajur | y | Isi |
|---|---|---|
| Gambar | 110–710 | foto, cutout, ilustrasi, karakter, UI, anotasi yang melingkarinya |
| Label | 730–790 | nama, kredit foto, blok tanggal, catatan tangan |
| Kalimat | 840–950 | kalimat/klaim utama (maks. 1 baris pada 92–96 px, atau 2 baris pada ≤ 72 px) |

**9:16 (1080×1920)** — zona aman Shorts/Reels: atas 220, bawah 380, kiri 60, kanan 140:

| Lajur | y | Isi |
|---|---|---|
| Gambar | 260–1180 | subjek utama, lebar ≤ 880 px |
| Label | 1210–1280 | label/kredit |
| Kalimat | 1320–1540 | kalimat, ≤ 2 baris, huruf ≥ 64 px |

Variasi dibolehkan dan dianjurkan (Hukum #4 melarang posisi teks yang sama di adegan
berturut-turut): kalimat di atas & gambar di bawah, gambar kiri & teks kanan (kolom, bukan lajur),
satu gambar besar di tengah. Yang wajib tetap: **pembagian ruangnya ditulis dulu dan tidak ada
dua zona yang bertumpuk.** Untuk kolom: kolom gambar dan kolom teks dipisah ≥ 64 px.

Untuk 1:1 (1080×1080) pakai lajur 16:9 yang diskalakan: gambar 90–620, label 650–700,
kalimat 750–960, margin 64.

## Jarak, ukuran, penjajaran

- **Jarak minimum**: 48 px antar-elemen yang berdekatan (gambar↔label, label↔kalimat,
  gambar↔gambar). 24 px adalah batas bawah mutlak; di bawah itu terbaca "menempel".
- **Hitung gerak, bukan hanya posisi diam.** Kamera bernapas (scale 1,03), objek melayang
  (float ±10–20 px), dan `fly()` yang memantul menggeser elemen. Beri cadangan ≥ 30 px di
  atas jarak minimum, dan jauhkan teks dari tepi frame ≥ 1,5× margin aman bila kamera bernapas.
- **Satu elemen dominan per adegan**: luasnya ≥ 2× elemen berikutnya. Dua gambar sama besar
  yang bersaing = berantakan; jadikan satu utama, satu pendukung.
- **≤ 5 elemen bermakna terlihat bersamaan** (di luar latar/dekor). Lebih dari itu → pecah ke
  beat berikutnya atau adegan baru.
- **Satu sumbu penjajaran per adegan**: label rata kiri dengan tepi kiri gambarnya; kalimat
  tunggal di bawah satu gambar → rata tengah terhadap gambar itu; beberapa blok teks →
  satu tepi kiri yang sama. Jangan ada elemen "hampir sejajar" (selisih 5–30 px) — sejajarkan
  persis atau bedakan jelas.
- **Kalimat tidak boleh lebih lebar dari 1500 px** (16:9) atau 880 px (9:16); pecah atau
  kecilkan, jangan biarkan menyentuh zona aman.

## Perlakuan gambar yang konsisten

- Satu radius sudut, satu jenis bayangan, satu jenis bingkai per video (atau per gaya).
- Gambar dalam satu adegan selaras ukurannya: tinggi sama, atau rasio jelas (1 : 2).
- Rotasi kecil konsisten (semua ±2–4°, berlawanan arah bergantian), bukan acak tiap gambar.
- Tidak pernah terdistorsi: `object-fit:cover` + `object-position` ke subjek untuk foto;
  cutout dipangkas ke bbox alpha (`explainer.md`) supaya ukuran CSS = isi.
- Wajah/subjek foto tidak terpotong tepi gambar atau tepi frame, kecuali close-up yang disengaja.

## Tumpukan yang sah (tandai dengan `data-boleh-tumpuk`)

| Tumpukan | Syarat |
|---|---|
| Anotasi (lingkaran, panah, garis) di atas gambarnya sendiri | tidak menyentuh teks/label di luar gambar |
| Tag sumber/label DI DALAM foto | di pojok foto, punya latar sendiri (pita/blok), ≥ 16 px dari tepi foto |
| Dokumen/kartu menindih SUDUT foto | menutup ≤ 25 % foto, titik fokus foto tetap terlihat |
| Kartu bertumpuk (setumpuk foto) | offset seragam (mis. 24 px + rotasi ±3°), yang paling atas terbaca utuh |
| Stempel di atas dokumen | tidak menutup baris teks dokumen; taruh di ruang kosong/pojok |

Cara menandai: bungkus elemen-elemen yang boleh saling tumpuk dalam satu wadah
`<div style="display:contents" data-boleh-tumpuk>…</div>` (tidak mengubah posisi). Tumpukan
hanya dimaafkan DI DALAM wadah itu; elemen lain yang menimpanya tetap galat.

Teks latar raksasa (tahun hantu, kata latar), partikel, ornamen: beri `data-tata="dekor"`
(pastikan opacity ≤ .08–.12 dan berada di belakang). Placeholder starter (`.ph`) sudah ditandai
`data-tata="gambar"`; ganti dengan `<img>` dan atributnya tidak diperlukan lagi.

## Waktu — tumpang tindih juga terjadi saat bergerak

- Elemen lama KELUAR sebelum elemen baru masuk ke tempat yang sama (selesai ≥ 0,15 dtk lebih
  dulu). Jangan ada sisa label/kalimat adegan sebelumnya saat kamera tiba di adegan berikutnya
  (`unsay`/`unlabel` semua sebelum `into`).
- Animasi masuk (`fly`, `say` dari bawah, pantulan) tidak boleh melintasi teks yang sedang
  terbaca; pilih arah masuk dari sisi yang kosong.
- Saat kamera close-up, gambar boleh terpotong tepi frame (itu framing), tetapi teks tidak.

## Peta tata letak di rundown

Tambahkan per adegan, di bawah baris rundown:

```
Adegan 2 (16:9) — lajur: gambar 110–710 · label 730–790 · kalimat 840–950
  cutA   foto pabrik      x 200–760   y 120–690   utama (dominan)
  ring   anotasi          melingkari cutA         [tumpuk sah]
  cutB   foto buruh       x 1060–1660 y 180–660   pendukung
  nameA  "PABRIK X · 1972" x 200      y 735       rata kiri cutA
  line1  kalimat          x 120–1500  y 840–935
  masuk: cutA 0,3 → cutB 2,5 → line1 5,5 → ring 6,8 → nameA 7,2 · keluar semua 10,4
```

## Verifikasi

```
python3 scripts/cek_tata_letak.py <folder-proyek> --gambar
python3 scripts/cek_tata_letak.py <folder-proyek>/thumbnail-long.html          # thumbnail (diam)
```

- Mengecek tiap 0,25 dtk: teks menimpa teks, gambar menutupi teks, teks terpotong tepi frame
  (GALAT); gambar bertumpuk, teks di luar zona aman, gambar terpotong tepi, jarak < 24 px
  (PERINGATAN). Masalah < 0,4 dtk (lintasan transisi) diabaikan; atur dengan `--minimal`.
- `--gambar` memotret tiap masalah dengan kotak merah/kuning di `cek-tata-letak/`. LIHAT
  potretnya — kadang perbaikannya memindah satu elemen, kadang adegan perlu dipecah.
- Target: **0 galat**. Peringatan "gambar terpotong tepi" saat close-up kamera boleh
  dibiarkan; peringatan lain diperbaiki atau dijelaskan alasannya.
- Setelah 0 galat, tetap potret detik kunci (`snap.mjs`) dan nilai dengan mata: jarak terasa
  lega? penjajaran tegas? satu elemen dominan? Mesin menangkap tabrakan, mata menangkap
  kesan sesak.

## Jebakan yang pernah terjadi

| Gejala | Penyebab | Perbaikan |
|---|---|---|
| Kata dalam pill hilang total | varian sorotan memakai class pendek (`.hl.t`) yang bentrok dengan `.t{opacity:0}` | nama varian deskriptif (`.hl.teal`); jangan pakai ulang class 1–2 huruf |
| Garis vertikal keras di tengah frame adegan 2 | kertas latar `inset:-1400px` lebih sempit dari dunia | latar menutupi semua adegan (`inset:-1400px -3000px -1400px -1400px`) |
| Label menempel ke kalimat | label di y 820, kalimat di y 860 | lajur label 730–790, kalimat 840+ |
| Catatan tangan di atas kata kunci | catatan ditaruh di baris kalimat tanpa cek lebar kalimat | catatan di lajur label, atau ≥ 120 px setelah ujung kalimat |
| Lingkaran anotasi memotong label | kanvas SVG anotasi lebih besar dari gambarnya | lingkaran memeluk gambarnya, berakhir ≥ 30 px di atas lajur label |
| Kalimat adegan 2 menempel tepi kanan | posisi kalimat tidak diturunkan dari posisi gambar | rata tengah terhadap gambar adegan itu |
| Label kecil bertumpuk dengan angka besar | kotak huruf font display (Unbounded dll.) tinggi | jarak eksplisit (`margin-bottom` ≥ 24 px) antara label dan angka |
