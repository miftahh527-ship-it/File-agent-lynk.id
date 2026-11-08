# Grafis rapi — peta akurat, tokoh rapi, ikon seragam

Dibaca SEBELUM menggambar peta, benua, negara, tokoh/orang, ikon, atau grafik data. Kegagalan
paling sering: model menggambar path SVG "dari ingatan". Hasilnya benua berupa gumpalan miring,
Indonesia jadi lima bulatan, orang dengan lengan seperti tongkat yang ditempel, siku patah, leher
melayang, dan ikon dengan tebal garis berbeda-beda. Penonton langsung menangkapnya sebagai
"acak-acakan", walau animasinya halus.

## Hukum grafis

1. **Bentuk yang punya bentuk asli tidak pernah digambar tangan.** Peta, benua, negara, pulau,
   logo, produk, gedung terkenal, hewan nyata: ambil dari data atau sumber aslinya (peta →
   `peta_svg.py`, logo → path vektor resmi, produk/gedung/hewan → foto/cutout atau generate).
2. **Bentuk generik dibangun dari primitif dan sistem, bukan coretan bebas**: lingkaran, persegi
   bersudut seragam, garis bertutup bulat, di grid 8 px, simetris lewat cermin (bukan
   menggambar dua sisi terpisah).
3. **Satu sistem per video**: satu kit tokoh, satu keluarga ikon, satu tebal garis, satu radius
   sudut, satu palet. Campuran gaya = berantakan.
4. **Dicek dengan mata dalam ukuran asli** (PNG pratinjau / snap), bukan dianggap benar karena
   kodenya jalan.

## Peta — `scripts/peta_svg.py`

Data Natural Earth 1:50m (domain publik) + d3-geo, semua ada di `assets/data/` (jalan tanpa
internet; butuh Python 3 + Chrome). Keluaran: SVG bersih (satu `<path>` ber-id per benua/negara)
+ JSON titik label + PNG pratinjau.

| Kebutuhan | Perintah |
|---|---|
| Dunia per benua (tanpa Antartika) | `python3 scripts/peta_svg.py assets/img/dunia.svg --png` |
| Dunia per negara | `… dunia.svg --mode negara --png` |
| Satu benua + dunia samar di sekitar | `… asia.svg --wilayah benua:Asia --konteks --batas --png` |
| Satu negara disorot di kawasannya | `… ri.svg --wilayah "region:South-Eastern Asia" --mode negara --sorot IDN --konteks --png` |
| Daftar negara | `… asean.svg --wilayah negara:IDN,MYS,SGP,THA,VNM,PHL,BRN,KHM,LAO,MMR --mode negara` |
| Bola dunia | `… bola.svg --proyeksi orthographic --pusat 118,-2 --ukuran 900x900 --garis --png` |

- **Proyeksi**: dunia → `natural-earth` (bawaan, bentuk benua paling dikenali); benua/kawasan
  → `mercator` (bawaan) atau `conic` untuk wilayah lebar di lintang tinggi; bola →
  `orthographic`. Satu proyeksi per video.
- **Rusia** dipotong di Pegunungan Ural (Siberia = Asia, konvensi atlas sekolah). `--rusia eropa`
  = data asli Natural Earth.
- **Wilayah seberang laut** (Guyana Prancis, Hawaii…) tetap digambar tetapi tidak membuat peta
  ter-zoom-out.
- **Nama** benua dalam bahasa Indonesia (`data-nama="Amerika Selatan"`), negara dengan nama
  Indonesia (`Rusia`, `Prancis`); kode `--wilayah`/`--sorot` boleh ISO A3 atau nama.
- **Label**: ambil `x,y` dari `<nama>.json` (pusat poligon terbesar, jadi label Indonesia tidak
  jatuh di laut). Jangan menebak posisi label.
- **Ukuran berkas**: 50m ±600–800 KB per peta, aman untuk inline. Peta kecil di layar →
  `--detail 110m`.

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

- Garis tepi/batas memakai `vector-effect:non-scaling-stroke` (sudah di SVG): saat kamera zoom,
  batas tetap tipis rapi, tidak menebal.
- Sorotan negara = lapisan `sorot-*` yang sudah terpisah; animasikan warna/skala lapisan itu,
  jangan menggambar ulang bentuknya.
- Penanda kota/rute: titik dan garis di ATAS peta pada koordinat yang dihitung (proyeksikan
  lon/lat dengan proyeksi yang sama — tambahkan ke JSON lewat `peta_svg.py` bila perlu, atau
  pakai titik dari `.json`). Garis rute = lengkung halus (quadratic) dengan tebal seragam.
- Citra satelit (NASA, domain publik) tetap pilihan untuk gaya jurnalisme; bentuk vektor dari
  `peta_svg.py` untuk gaya flat, kartun, katalog.

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

- Peta: buka `<nama>.png` hasil `--png` dan bandingkan dengan atlas: bentuk benua dikenali?
  pulau-pulau utama ada? label di daratannya?
- Tokoh: potret tiap pose yang dipakai (snap / `?debug=1`) dan periksa: tangan menyentuh yang
  seharusnya (pinggang, dagu, benda), tidak ada sendi yang menekuk terbalik, tidak ada anggota
  badan yang menembus kepala/badan secara janggal.
- Seluruh video: `scripts/cek_tata_letak.py` (tumpang tindih) lalu lembar kontak snap.
