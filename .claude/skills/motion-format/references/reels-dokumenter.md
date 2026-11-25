# Reels Dokumenter — explainer edukasi tegak bergaya film dokumenter

Dibaca bila user meminta video edukasi pendek untuk Reels/TikTok/Shorts tentang sejarah, misteri,
geografi, sains, tempat, atau tokoh ("seperti video edukasi Instagram", "gaya dokumenter",
"caption kata per kata", atau menyodorkan video sejenis). Starter: `assets/starter-reels-dokumenter.html`.

Disusun dari analisis empat video referensi (9:16, 38–55 dtk, berbahasa Indonesia, VO + musik):
manuskrip kuno (cahaya lilin), kerajaan Nusantara (sulaman/tenun), gunung api purba (poster
sablon), dan monumen batu (footage sinematik). Keempatnya memakai ANATOMI yang sama dengan KULIT
berbeda. Yang diambil dari referensi: anatomi, ritme, dan komponen. Yang tidak diambil: kalimat,
urutan adegan, dan aset (Hukum #3). Palet dan font diturunkan dari topik.

## Anatomi (wajib)

| Lapisan | Isi | Ciri dari referensi |
|---|---|---|
| 1. Dunia | satu objek/tempat utama per adegan, kamera bergerak pelan | push-in terus-menerus, close-up ke detail, kedalaman (latar buram) |
| 2. Atmosfer | debu bercahaya, sapuan cahaya, vinyet, grain, cahaya hangat | partikel berkilau melayang naik, cahaya utama dari satu arah |
| 3. Judul atas | **hook angka** 0–1 dtk → nama topik + ornamen → (opsional) angka baru per babak | "±600 TAHUN / dan belum terbaca"; angka berjalan ±2.700 → ±74.000 TAHUN LALU; "671 M"; "1.000+ biksu belajar" |
| 4. Callout | alis kecil berspasi + nilai + sumber, garis tipis ke titik bercincin di objek | "UJI KARBON PERKAMEN / 1404–1438 / Univ. …, 2009"; digit diacak lalu mengunci |
| 5. Caption karaoke | frasa 1–2 baris, kata terucap terang, belum terucap redup, kata kunci berwarna | selalu ada; ±1–1,6 dtk per frasa; pelat sesuai kulit |
| 6. Penutup | pertanyaan bertumpuk ATAU kembali ke frame pembuka (loop) | "bahasa rahasia? / sandi? / tipuan?" bertingkat; poster judul di akhir sama dengan pembuka |

Caption adalah bagian format ini. Aturan umum "tanpa caption kecuali diminta" TIDAK berlaku di sini.

## Ritme & struktur (patokan 45 dtk)

| Detik | Babak | Isi |
|---|---|---|
| 0–2 | Hook | angka/klaim paling mengejutkan + objek utama; tanpa salam, tanpa logo |
| 2–6 | Nama | nama topik + ornamen; di mana/apa (callout lokasi/tahun) |
| 6–20 | Fakta 1–3 | tiap fakta = satu callout/angka + satu gerak kamera ke detailnya |
| 20–32 | Usaha/proses | daftar (percobaan, perjalanan, tahap) sebagai rangkaian benda/instrumen, bukan teks |
| 32–40 | Kondisi sekarang | tempat/objek hari ini |
| 40–45 | Penutup | pertanyaan terbuka bertumpuk atau kalimat pulang ke hook; frame akhir ≈ frame awal (Reels berputar ulang) |

- Ganti shot/gerak kamera tiap 3–5 dtk; frasa caption ganti tiap 1–1,6 dtk.
- Satu angka besar per babak; angka berjalan (count-up) atau digit acak → kunci.
- Babak "daftar" (ahli bahasa → pemecah sandi → komputer; India → Selat Malaka → Tiongkok) =
  benda/instrumen yang muncul berurutan, masing-masing dengan callout kecil.
- Transisi: iris cincin bercahaya, larut perlahan, objek menutup/membalik, kamera menembus.

## Empat kulit (titik awal, turunkan warna dari topik)

`<body data-gaya="…">` di starter; pratinjau cepat `index.html?gaya=sulam`.

| Gaya | Dunia | Judul & angka | Caption | Cocok untuk |
|---|---|---|---|---|
| **arsip** | ruang gelap hangat, satu sumber cahaya (lilin/jendela), objek ilustrasi 2,5D di meja, debu emas | display bersejarah (blackletter/serif tua) emas + ornamen garis–belah ketupat | serif putih, kunci emas, tanpa pelat, bayangan lembut | naskah, misteri, artefak, sejarah Eropa/Timur Tengah |
| **sulam** | kain bertekstur anyaman, garis jahitan putus-putus, benang emas, motif tenun/batik sebagai bidang | serif kontras tinggi emas berkilau | pelat pita kain marun berjahitan emas | sejarah Nusantara, kerajaan, budaya, jalur dagang |
| **sablon** | poster wisata cetak sablon: kertas, bidang warna datar, bayangan offset, penampang berlapis | slab tebal putih + bayangan offset 2 warna + kotak label gelap | pelat gelap bertepi kuas, kunci kuning | geografi, gunung, danau, proses alam, penampang |
| **sinema** | footage (generate/user) atau foto bergerak, cahaya matahari, kabut, lens flare | serif tipis putih elegan | sans putih kecil, kunci oranye/biru | monumen, tempat nyata, arkeologi, alam |

Membangun dunia per gaya:

- **arsip**: objek dari ilustrasi generate (satu prompt gaya untuk semua objek) atau primitif;
  2–3 lapis kedalaman (meja tajam, rak buram `.jauh`), cahaya `.cahaya` radial + debu canvas.
  Close-up = kamera z 1,3–1,8 ke detail, bukan potongan gambar baru.
- **sulam**: bidang dari SVG berisi pola tenun (repeating gradient / pattern), garis tepi
  `stroke-dasharray` (jahitan), kilau emas = gradien + `drop-shadow` hangat. "Menggambar" garis
  ala sketsa jarum: `jahit()` (stroke tergambar). Peta jalur dagang dari `peta_svg.py` diberi
  tekstur kain + rute bertitik.
- **sablon**: bidang datar 3–5 warna, sedikit salah cetak (bayangan offset), grain kertas;
  penampang (lapisan tanah, magma, air) = tumpukan path bergelombang yang bergeser per babak;
  cuaca/waktu = bidang langit berganti warna + awan datar bergerak.
- **sinema**: klip dari `clip()` (layer footage di starter) — generate lewat MCP (Higgsfield/
  ElevenLabs video) dengan prompt sinematik konsisten, atau footage user; tipografi & callout di
  atasnya. Rute/peta udara: peta `peta_svg.py` dimiringkan (`perspective` + `rotateX` 40–55°).

## Komponen di starter (`starter-reels-dokumenter.html`)

| Fungsi | Pakai |
|---|---|
| `NASKAH=[{at,sampai,teks,kunci,kata?}]` + `caption()` | caption karaoke dari naskah VO; waktu tiap kata dibagi menurut suku kata, atau `kata:[detik…]` dari stempel waktu transkripsi |
| `angka(at,{dari,ke,awal:'±',satuan,dur,dec})` | hook/angka judul berjalan, format Indonesia (`74.000`, `3,4`) |
| `namaJudul(at)` | judul topik + ornamen garis–belah ketupat |
| `callout(at,{x,y,lx,ly,alis,nilai,sumber,sampai})` | titik (x,y) dalam koordinat DUNIA (ikut kamera); label di (lx,ly) layar |
| `acak(el,at,'1404–1438',dur)` | digit berputar lalu mengunci satu per satu (deterministik) |
| `sapu(at,dari,ke,dur)` | sapuan cahaya (pindai, uji, sinar) |
| `iris(at,'#a1','#a2',dur)` | transisi cincin bercahaya yang membuka adegan berikutnya |
| `jahit('#path',at,dur)` | garis/rute/jahitan tergambar (untuk garis putus-putus: animasikan path penyingkap di `<mask>`) |
| `tanya(at)` | penutup pertanyaan bertumpuk (#t1–#t3) |
| `cam(at,x,y,z,dur)` / `napas(a,b,z)` | kamera; dorong pelan terus-menerus saat "diam" |
| `clip()` + `AUDIO_PLAN` | footage & suara (sama dengan starter lain) |

## Aturan caption

- Frasa 2–6 kata, ≤ 2 baris, `text-wrap:balance` (tidak ada kata yatim di baris kedua).
- Lajur caption y 1310–1540, kiri 60, kanan 140 (zona aman Reels). Ukuran 50–58 px.
- Kata terucap: warna penuh; belum: ±35–50 % ; kata kunci (angka, nama, tempat, kata misteri):
  warna aksen. Maksimal 1–2 kunci per frasa.
- Waktu dari VO: batas frasa dari jeda (`vo-pauses.html` / silencedetect). Stempel per kata bila
  transkripsi menyediakannya; jika tidak, pembagian per suku kata sudah cukup rapi.
- Teks caption = naskah VO persis (ejaan sama); angka ditulis dengan digit.

## Tata letak 9:16 (selaras `tata-letak.md`)

| Zona | y | Isi |
|---|---|---|
| Judul | 236–420 | angka hook / nama + ornamen / pertanyaan penutup |
| Callout | 440–560 (label) | label di atas objek; garis turun ke objek |
| Objek | 600–1250 | satu objek dominan (kamera boleh mendekat, objek tetap di bawah label) |
| Caption | 1310–1540 | karaoke |

Kanan 140 px dan bawah 380 px tertutup UI Reels. Bila kamera mendekat, kurangi zoom atau geser
fokus supaya objek tidak naik ke zona label (`cek_tata_letak.py` menangkapnya).

## Audio

- VO naratif hangat-tenang (tempo sedang, jeda dramatis sebelum angka/pertanyaan).
- **Musik latar tipis terus-menerus** (ambient/orkestra lembut, ±−24 LUFS di bawah VO; semua
  referensi tidak punya jeda hening). Tanyakan sumbernya di brief (ElevenLabs music / musik user).
- SFX halus: denting/kilau untuk angka & callout, desir untuk iris/whoosh, kertas/kain untuk
  benda, gemuruh untuk peristiwa besar. ≤ 1 SFX per 2 dtk.
- Master akhir ±−14 LUFS (render_mp4.py menormalkan ke ±−15; cukup).

## Checklist Reels dokumenter

- [ ] Hook angka/klaim di 0–2 dtk; nama topik + ornamen sebelum dtk 6
- [ ] Tiap fakta punya instrumennya (callout dengan sumber, angka berjalan, digit acak, sapuan)
- [ ] Caption karaoke dari naskah VO, ≤ 2 baris, seimbang, kunci berwarna, di lajur aman
- [ ] Satu objek dominan per adegan; kamera selalu bergerak pelan; atmosfer (debu/cahaya/vinyet/grain)
- [ ] Kulit dipilih dari 4 gaya dan diturunkan dari topik (palet, font), tidak menyalin referensi
- [ ] Penutup: pertanyaan bertumpuk atau frame akhir ≈ frame awal (loop)
- [ ] Musik latar + VO + SFX; master ±−14/−15 LUFS
- [ ] Peta dari `peta_svg.py`, tokoh dari `tokoh-rapi.js` / generate satu gaya (Hukum #6)
- [ ] `cek_tata_letak.py` 0 galat (peringatan saat iris/transisi boleh)

## Gaya satelit & teknik modern (gelombang referensi ke-2)

Dari tiga video berikutnya (pulau bersarang Danau Toba–Samosir, kapal pinisi, suku penyelam):
lebih "modern-dokumenter" — pandangan udara/3D, caption yang menjadi label, warna kata yang
bermakna, dan visual sains (tembus pandang, USG, DNA). Starter: `assets/starter-reels-satelit.html`
(demo 25 dtk: Sumatra → Danau Toba → Samosir → Danau Sidihoni → rangkuman → "dulu" tersambung
tanah sempit → kanal Tano Ponggol → "74 ribu tahun lalu").

### Teknik

| Teknik | Cara di starter | Aturan |
|---|---|---|
| **Zoom bersarang** ("di dalam … ada …") | `zoom(at,x,y,z,dur)` — tween pada skala LOG, kamera = `viewBox` SVG (selalu tajam sampai ±300×) | tiap tingkat: tiba → garis tepi → label → lanjut; lalu MUNDUR untuk rangkuman dengan label bertingkat |
| **Garis tepi menyala** | `garisTepi(d,at,{warna:'air'|'darat'|'bahaya'})` | warna sama dengan kata kuncinya di caption; hilang sebelum tingkat berikutnya |
| **Warna bermakna** | `NASKAH[].kunci={kata:'air'}`; CSS `--air` biru, `--darat` kuning, `--bahaya` oranye | air/sungai/laut = biru; pulau/tempat/negeri = kuning; peristiwa/bahaya/manusia/waktu = oranye. Konsisten satu video |
| **Caption sebagai label** | `NASKAH[].pos={x,y,rata:'kiri'}` + `labelTitik()` | caption boleh pindah ke dekat subjek (atas/tengah, rata kiri) — tetap di zona aman dan tidak menutup subjek |
| **Label titik** | `labelTitik(at,{x,y,teks,panjang,arah:-1|1})` — garis tegak + titik, ikut kamera | teks label ≤ 3 kata, boleh 2 warna (`<span class="air">`) |
| **Lensa waktu** | `lensa(at,{r,isi:gDulu})` — lingkaran bercincin, isi = lapisan "dulu" (`<clipPath>` satuan peta) | sebelum mengubah seluruh layar ke "dulu", tunjukkan dulu di dalam lensa |
| **Gradasi era** | `gradasi(at,{sepia,saturasi,terang})` | dulu = sepia/kusam; kembali normal saat cerita kembali ke "kini" |
| **Awan lewat** | `awanLewat(at)` saat zoom menembus ketinggian | hanya di zoom besar, ≤ 1,6 dtk |
| **Angka tengah** | `#tengah` (alis berspasi + angka besar + satuan) `angkaTengah(at,sampai)` | satu kali per video untuk angka puncak ("74 ribu / tahun lalu", "UNESCO / 2017") |
| **Label tempat** | `#tempat` kecil berspasi lebar + garis bawah, kiri atas | menandai lokasi adegan ("BULUKUMBA") |
| **Silang** | `silang(at,{x,y})` | negasi visual ("tanpa tabung oksigen"): objek + silang merah tergambar |
| **Morf** | `morf(path,dTujuan,at,dur)` (96 titik merata, titik awal diselaraskan) | metafora bentuk (limpa → tabung oksigen); bentuk tujuan sederhana & seukuran |
| **Tembus pandang** | `tembus(at,luar,[dalam…])` | kulit luar memudar & berpendar, organ/struktur dalam muncul bergiliran |
| **Instrumen** | bangun dari primitif: kerucut USG (path kipas + grain + garis busur), penggaris tick di tepi, panel A/B bertumpuk dengan label kecil | perbandingan = dua panel identik bentuknya, beda satu hal |
| **Garis bantu** | `jahit()`/`garisTepi` pada kurva bentuk (lambung kapal) | 2–4 garis, putih tipis, menyusur bentuk lalu hilang |
| **Jumlah + bagian** | `labelTitik` dengan teks "2 tiang", angka besar + kata kecil | garis menuju ujung bagian yang dihitung |

### Medan bergaya satelit (DIBUAT SENDIRI)

- Garis pantai: `peta_svg.py --wilayah pulau:<nama> --ukuran 4320x7680 --tepi 160 --tanpa-gaya`;
  hasil SVG ditempel ke `#sumber`, isi `.json` ke `PETA` (proyeksi → `titikPeta(bujur,lintang)`).
- Danau dan pulau di dalamnya ada di `peta_data.py` → `PERAIRAN` (Danau Toba, Samosir, Danau
  Sidihoni). Tambah danau/pulau bersarang lain di sana (titik searah jarum jam + `di` = wadahnya).
- Relief = `ubin()` (noise berperiode + bayangan bukit) + `UB_MAKRO` (bercak warna besar,
  multiply) dalam 4 tingkat kerincian (`Z=[1,5,25,125]`) yang muncul mengikuti zoom; ubin diputar
  agar grid noise tidak tampak. Laut = ubin riak + halo laut dangkal.
- Lapisan sejarah (tanah sempit, garis pantai lama) = bentuk dari `poli([[bujur,lintang],…])`
  (dihaluskan Chaikin) di grup terpisah yang dibuka dengan `lensa`.

### Yang tidak dibuat dengan kode

Render 3D realistis (kapal, penyelam, rangka tubuh, DNA) → gambar/video generate dengan satu
prompt gaya (MCP Higgsfield/ElevenLabs) atau footage user, dipasang lewat `clip()`; semua
tipografi, label, garis, silang, dan caption tetap dari starter. Bila tidak ada akses generate,
pilih kulit ilustrasi (arsip/sulam/sablon) atau satelit, jangan memalsukan 3D dengan gradasi.

### Checklist tambahan

- [ ] Warna bermakna konsisten (air/darat/bahaya) antara caption, garis tepi, dan label
- [ ] Zoom bersarang: tiap tingkat ditandai garis tepi + label; ada rangkuman mundur
- [ ] Caption yang dipindah ke dekat subjek tetap di zona aman dan tidak menutup subjeknya
- [ ] "Dulu vs kini" lewat lensa + gradasi, bukan potongan mendadak
- [ ] Ujung garis bulat yang belum tergambar disembunyikan (tidak ada titik nyasar)
