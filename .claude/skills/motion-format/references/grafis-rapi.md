# Grafis rapi — peta akurat, tokoh rapi, ikon seragam

Dibaca SEBELUM menggambar peta, benua, negara, tokoh/orang, ikon, atau grafik data. Kegagalan
paling sering: model menggambar path SVG "dari ingatan". Hasilnya benua berupa gumpalan miring,
Indonesia jadi lima bulatan, orang dengan lengan seperti tongkat yang ditempel, siku patah, leher
melayang, dan ikon dengan tebal garis berbeda-beda. Penonton langsung menangkapnya sebagai
"acak-acakan", walau animasinya halus.

## Hukum grafis

1. **Bentuk yang punya bentuk asli tidak pernah dicoret asal dari ingatan.** Peta, benua, pulau:
   pakai `peta_svg.py` (garis pantai yang sudah digambar rapi di `peta_data.py`). Logo → path
   vektor resmi dari user. Produk/gedung/hewan → foto/cutout dari user atau generate.
2. **Bentuk generik dibangun dari primitif dan sistem, bukan coretan bebas**: lingkaran, persegi
   bersudut seragam, garis bertutup bulat, di grid 8 px, simetris lewat cermin (bukan
   menggambar dua sisi terpisah).
3. **Satu sistem per video**: satu kit tokoh, satu keluarga ikon, satu tebal garis, satu radius
   sudut, satu palet. Campuran gaya = berantakan.
4. **Dicek dengan mata dalam ukuran asli** (PNG pratinjau / snap), bukan dianggap benar karena
   kodenya jalan.

## Peta — `scripts/peta_svg.py` (digambar sendiri)

Garis pantai benua dan pulau ditulis tangan oleh skill ini di `scripts/peta_data.py` (titik
bujur-lintang bergaya atlas), BUKAN diunduh dari internet. `peta_svg.py` memproyeksikannya
(rumus proyeksi ditulis sendiri), menghaluskan garis pantai dengan Catmull-Rom sentripetal (tanpa
simpul di bagian sempit), dan menggambar batas darat antar-benua lurus dan rapat. Python 3 murni;
Chrome hanya untuk pratinjau `--png`. Keluaran: SVG bersih (satu `<path>` ber-id per benua atau
pulau) + JSON titik label + PNG.

| Kebutuhan | Perintah |
|---|---|
| Dunia per benua | `python3 scripts/peta_svg.py assets/img/dunia.svg --png` |
| Satu benua + benua lain samar | `… asia.svg --wilayah benua:Asia --konteks --png` |
| Benua disorot di peta dunia | `… dunia.svg --sorot Asia --png` |
| Indonesia per pulau | `… ri.svg --wilayah indonesia --mode pulau --konteks --png` |
| Beberapa pulau | `… jawa-bali.svg --wilayah pulau:Jawa,Madura,Bali --mode pulau --png` |
| Bola dunia | `… bola.svg --proyeksi orthographic --pusat 118,-2 --ukuran 900x900 --garis --png` |

- **Isi peta**: 6 benua (Amerika Utara, Amerika Selatan, Eropa, Afrika, Asia, Oseania) dengan
  pulau-pulau besar (Greenland, Britania, Jepang, Filipina, Madagaskar, Selandia Baru…) dan 15
  pulau utama Indonesia (Sumatra, Jawa, Madura, Bali, Lombok, Sumbawa, Flores, Sumba, Timor,
  Kalimantan, Sulawesi, Halmahera, Seram, Buru, Papua). Tanpa batas negara dan tanpa Antartika.
- **Batas benua** mengikuti konvensi atlas sekolah: Eropa–Asia di Ural–Kaspia–Kaukasus, Afrika–Asia
  di Suez, Papua (Asia, Indonesia) – Papua Nugini (Oseania) di 141° BT.
- **Proyeksi**: dunia → `natural-earth` (bawaan, bentuk benua paling dikenali); benua/pulau →
  `mercator`; bola → `orthographic`. Satu proyeksi per video. Peta dunia berpusat di 11° BT supaya
  garis 180° jatuh di Selat Bering (tidak ada daratan terbelah).
- **Kehalusan**: `--halus 0.85` (bawaan); `0` = sudut tajam bergaya poligon, `1` = sangat bulat.
- **Label**: ambil `x,y` dari `<nama>.json` (pusat daratan terbesar tiap bentuk). Jangan menebak.
- **Menambah/merapikan pulau**: edit `scripts/peta_data.py` (titik searah jarum jam, 8–40 titik,
  nama Indonesia). Batas darat bersama ditulis sebagai konstanta `B_*` dan dipakai kedua sisi
  supaya tidak ada celah. Setelah mengedit, SELALU lihat `--png` untuk bentuk itu dalam ukuran besar
  (`--wilayah pulau:<nama> --ukuran 900x900 --png`).
- Ukuran berkas ±35–55 KB per peta: ringan untuk ditempel inline.

**Memasang & menganimasikan** (tempel isi SVG inline di dalam `#world` atau panggung):

```html
<div class="peta" id="peta">…isi dunia.svg…</div>
<style>
  .peta svg{width:1600px;height:900px}
  .peta .benua{fill:var(--tanah)} .peta #benua-asia{fill:var(--aksen)}   /* warna dari palet video */
</style>
<script>
// muncul satu per satu dari pusatnya — bentuk tidak diubah, hanya skala/opacity
['amerika-utara','amerika-selatan','eropa','afrika','asia','oseania'].forEach((b,i)=>
  tl.fromTo('#benua-'+b,{opacity:0,scale:.92,transformOrigin:'50% 50%'},
            {opacity:1,scale:1,duration:.5,ease:'power3.out',immediateRender:false},1+i*.18));
</script>
```

- Garis tepi memakai `vector-effect:non-scaling-stroke` (sudah di SVG): saat kamera zoom, garis
  tetap tipis rapi.
- Sorotan = lapisan `#sorot` yang sudah terpisah; animasikan warna/skala lapisan itu, jangan
  menggambar ulang bentuknya.
- Penanda kota/rute: titik dan garis di ATAS peta pada koordinat yang dihitung dengan proyeksi
  yang sama (pakai titik label dari `.json`, atau hitung dengan rumus di `peta_svg.py`). Garis rute
  = lengkung halus (quadratic) dengan tebal seragam.
- Butuh batas negara atau garis pantai sangat rinci → itu di luar peta bergaya ini; tulis sebagai
  bentuk baru di `peta_data.py`, atau pakai foto/citra yang disediakan user.

## Tokoh/orang — `assets/tokoh-rapi.js`

Kit karakter flat dengan proporsi terkunci dan sendi mulus. Sudah tertanam di
`starter-explainer-panggung.html` (`character()`), dan bisa ditempel ke starter lain sebagai
`<script>`. Lihat semua varian di `assets/tokoh-galeri.html`.

```js
const ibu = TOKOH.buat(panggung, 760, 1000, 1, {rambut:'jilbab', jilbab:'#E0714F', kulit:'kuning',
  baju:'#F4BC52', bawahan:'rok', celana:'#345867'});
TOKOH.pose(ibu, 'melambai');                       // pose awal
tl.to(ibu.Larm, {r: 120, duration: .4, yoyo: true, repeat: 3, onUpdate: ibu.Larm.apply}, 2);   // melambai
```

- **Varian**: rambut `pendek | cepak | panjang | bob | keriting | jilbab | botak` · kulit
  `terang | kuning | sawo | cokelat | gelap` · atasan `kaos | kemeja` · bawahan `celana | rok` ·
  `anak:true` · `hadap:-1`.
- **Pose**: `berdiri, melambai, menunjuk, angkat-tangan, pinggang, berpikir, bingung, senang`.
  Ekspresi: `senang, netral, cemas, kaget` (`face()` di starter atau `TOKOH.ekspresi`).
- **Kenapa rapi**: proporsi ±4,8 kepala, lengan dan kaki berupa garis bertutup bulat yang
  berpangkal tepat di sendi (siku, lutut, dan bahu mulus di sudut berapa pun), wajah di grid tetap,
  anggota badan belakang satu tingkat lebih gelap.

Aturan memakai tokoh:

- **Satu tokoh = satu definisi** (opsi `TOKOH.buat`) yang dipakai ulang di semua adegan. Tidak
  ada versi kedua yang digambar ulang.
- **Jangan menggambar orang dengan path bebas.** Butuh kostum/aksesori → tambah bentuk primitif
  ke grup sendi yang tepat (topi di `head`, tas di `torso`, ponsel di `Lhand`), digambar di
  koordinat lokal sendi itu.
- **Sudut sendi masuk akal**: siku 0 sampai −150° (tidak menekuk ke belakang), lutut 0–90°, kepala
  ±12°. Pose baru: hitung dari panjang segmen (lengan atas 94, lengan bawah 84, paha 108, betis
  104), jangan ditebak. Lihat contoh `berpikir`/`pinggang` di kit.
- **Tinggi seragam**: dewasa skala sama dalam satu adegan (variasi ≤ ±6 %), anak `anak:true`.
- ≤ 3 tokoh per frame; jarak antar-tokoh ≥ setengah lebar badan; tidak bertumpuk kecuali sengaja
  (berpelukan, berdiri berjajar dengan overlap ≤ 15 %).
- Gaya kolase/foto (kartun kertas, katalog): orang dari foto atau gambar hasil generate dengan
  **satu prompt gaya yang sama untuk semua tokoh** + latar dihapus + dipangkas bbox. Kepala
  hasil generate di kartun panggung: `kartun-panggung.md` + `scripts/kepala-ekspresi.py`.

## Ikon & objek generik

- **Satu keluarga ikon per video.** Tanpa koneksi/aturan khusus: bangun sendiri di grid 24 px
  (skala ke ukuran tampil) dengan tebal garis SATU nilai (mis. 2 px pada 24 → 8 px pada 96),
  `stroke-linecap/linejoin:round`, radius sudut sama. Atau pakai set berlisensi terbuka
  yang seragam (Lucide ISC, Phosphor MIT) — salin path SVG-nya inline, jangan campur set.
- Objek (rumah, pabrik, mobil, pohon) dibangun dari primitif bersudut seragam, proporsi dari
  ukuran tokoh (pintu = 1,2× tinggi tokoh, meja = 0,45×), palet video. Bayangan satu arah untuk
  semua objek.
- Benda yang identik (deret rumah, pohon, orang di kerumunan) = satu fungsi yang dipanggil
  berulang dengan variasi terkontrol (warna dari palet, skala ±8 %), bukan digambar satu per satu.

## Grafik data (batang, garis, lingkaran)

- Skala dihitung dari data (min/maks → piksel), bukan diperkirakan. Batang dimulai dari 0.
- Maks. 5–7 kategori; label langsung di ujung batang/garis (bukan legenda jauh); angka dibulatkan
  dan memakai pemisah Indonesia (`12.500`, `3,4 %`); satuan ditulis sekali.
- Animasi tumbuh dari garis dasar / digambar dari kiri; angka berjalan memakai `tabular-nums`.
- Tanpa 3D, tanpa bayangan berlebihan, tanpa pie > 5 irisan. Sumber data ditulis di layar.

## Kebersihan bentuk SVG

- Koordinat dibulatkan ke 0,5 px; ukuran & jarak kelipatan 8 px; radius sudut dari satu set (8/16/24).
- Bentuk yang bersebelahan bertumpuk 1–2 px (tidak ada celah tipis berkedip saat kamera zoom).
- Bentuk di dalam rig kamera: `vector-effect:non-scaling-stroke` untuk garis tipis yang harus
  tetap tipis; garis ilustrasi (tokoh) boleh ikut skala.
- Simetri lewat cermin (`scale(-1,1)`) atau loop, bukan dua path yang digambar terpisah.
- Satu objek ≤ ±12 path; detail kecil yang tidak terbaca di 1080 px dibuang.

## Verifikasi

- Peta: buka `<nama>.png` hasil `--png`: bentuk benua/pulau dikenali (Sulawesi berbentuk K,
  Italia sepatu bot)? tidak ada pulau yang bertumpuk? label di daratannya?
- Tokoh: potret tiap pose yang dipakai (snap / `?debug=1`) dan periksa: tangan menyentuh yang
  seharusnya (pinggang, dagu, benda), tidak ada sendi yang menekuk terbalik, tidak ada anggota
  badan yang menembus kepala/badan secara janggal.
- Seluruh video: `scripts/cek_tata_letak.py` (tumpang tindih) lalu lembar kontak snap.
