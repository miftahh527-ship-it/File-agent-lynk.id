import json,pathlib
R=pathlib.Path(__file__).resolve().parent.parent;W=json.load(open(R/'naskah/_waktu.json'));I=13.0;s=W['mulai']
def ts(x):x=int(x);return f"{x//60}:{x%60:02d}"
ch=[(0,'Intro'),(I,'Pembuka: lukisan gua tertua ada di Indonesia'),(I+s['01-pembuka-bab1']+31.1,'Bab 1 — Manusia pertama dari Afrika'),
 (I+s['02-bab2'],'Bab 2 — Hidup berpindah & lukisan gua tertua'),(I+s['03-bab3'],'Bab 3 — Revolusi Pertanian'),(I+s['04-bab4'],'Bab 4 — Kota pertama & lahirnya tulisan'),
 (I+s['05-bab5'],'Bab 5 — Kerajaan besar dunia & Nusantara'),(I+s['06-bab6'],'Bab 6 — Mesin cetak, penjelajahan & sains'),(I+s['07-bab7'],'Bab 7 — Revolusi Industri'),
 (I+s['08-bab8'],'Bab 8 — Abad ke-20 sampai hari ini'),(I+s['09-penutup'],'Penutup & kuis')]
chap='\n'.join(f"{ts(t)} {n}" for t,n in ch)
tot=ts(I+W['durasi'])
md=f"""# Video long ({tot})

Thumbnail: `thumbnail-long.png` (1280×720)

## Judul (pilih satu)
1. Siapa Pelukis Cap Tangan 67.800 Tahun di Indonesia? | Perjalanan 300.000 Tahun Manusia
2. Perjalanan 300.000 Tahun: Dari Gua Sampai Smartphone
3. Sejarah Manusia dalam 11 Menit — Lukisan Tertua Dunia Ada di Indonesia!

Judul no. 1 paling cocok dengan thumbnail (SIAPA PELUKISNYA? · 67.800 THN).

## Deskripsi
Di dinding gua di Pulau Muna ada cap tangan merah berumur minimal 67.800 tahun — lukisan gua tertua di dunia yang usianya sudah dibuktikan. Siapa yang melukisnya, dan bagaimana caranya? Ayo naik mesin waktu dan tempuh perjalanan 300.000 tahun sejarah manusia — dari gua sampai smartphone!

Bersama Nara dan Bima, kita singgah di Afrika tempat Homo sapiens pertama ditemukan, melihat cap tangan berumur minimal 67.800 tahun di Pulau Muna, menyaksikan lahirnya pertanian, tulisan huruf paku, piramida, kerajaan-kerajaan Nusantara, mesin cetak, Revolusi Industri, sampai Proklamasi 17 Agustus 1945 dan zaman internet. Cocok untuk siswa SD kelas 4 sampai SMP. Di akhir video ada kuis — tulis jawabanmu di kolom komentar!

⏱️ Chapter
{chap}

📚 Sumber
- Fosil Homo sapiens tertua, Jebel Irhoud (±300.000 tahun): Max Planck Society; perdebatan klasifikasi: Scientific American
- Cap tangan Liang Metanduno, Pulau Muna, minimal 67.800 tahun (Nature, Januari 2026): EurekAlert / Griffith University, Science News
- Lukisan babi Leang Karampuang, Maros, ±51.200 tahun: Bradshaw Foundation
- Penduduk dunia (5 juta di awal pertanian; 1 miliar ±1800; 2 miliar 1930; 3 miliar 1960): Worldometer
- Penduduk dunia 2026 ±8,3 miliar dan harapan hidup 46 → ±73 tahun: UN WPP 2024 / StatisticsTimes
- Tahun peristiwa lain mengikuti buku IPS/Sejarah Kurikulum Merdeka dan ensiklopedia.

🖼️ Foto asli (Wikimedia Commons)
- Lukisan perahu, Gua Liang Metanduno, Pulau Muna — Purnawibawa, CC BY-SA 4.0
- Cap tangan Leang Pettakere, Maros — Cahyo, CC BY-SA 3.0
- Lukisan Leang Karampuang, Maros (foto diperjelas) — Oktaviana dkk., Nature 2024, CC BY 4.0
Lisensi: creativecommons.org/licenses/by-sa/4.0 · /by-sa/3.0 · /by/4.0

🎨 Animasi, tokoh, dan peta digambar sendiri oleh tim Let.growww (peta adalah ilustrasi sederhana, bukan peta presisi). Suara narator: AI (ElevenLabs).

#SejarahManusia #EdukasiAnak #LetGrowww #SejarahIndonesia #BelajarSejarah

## Tag
sejarah manusia, perjalanan manusia, sejarah dunia untuk anak, manusia purba, homo sapiens, lukisan gua tertua, pulau muna, liang metanduno, maros, revolusi pertanian, huruf paku, piramida giza, kerajaan nusantara, prasasti yupa, kutai, sriwijaya, borobudur, majapahit, rempah rempah, mesin cetak, revolusi industri, proklamasi kemerdekaan, sejarah sd, ips sd, kurikulum merdeka, video edukasi, animasi edukasi

# Short

Thumbnail: `short/thumbnail-short.png` (1080×1920)

## Judul
Siapa yang Melukis Ini 67.800 Tahun Lalu? 🤔 #Shorts

Alternatif: Lukisan Gua Tertua di Dunia Ada di Indonesia! #Shorts

## Deskripsi
Cap tangan merah di Gua Liang Metanduno, Pulau Muna, Sulawesi Tenggara, berumur minimal 67.800 tahun — lukisan gua tertua di dunia yang usianya sudah dibuktikan (Nature, Januari 2026). Pelukisnya menempelkan tangan ke dinding, lalu menyemburkan pewarna merah di sekelilingnya!
Versi lengkap (11 menit): Siapa Pelukis Cap Tangan 67.800 Tahun di Indonesia? — <link video long>
#Shorts #SejarahIndonesia #FaktaUnik
Foto: Purnawibawa (CC BY-SA 4.0), Cahyo (CC BY-SA 3.0) — Wikimedia Commons

## Komentar tersemat (jawaban kuis — jangan ditulis di deskripsi)
Jawaban kuis: 1) Pulau Muna, Sulawesi Tenggara · 2) Huruf paku · 3) Prasasti Yupa, Kerajaan Kutai. Berapa yang kamu jawab benar? 🎉
"""
(R/'youtube.md').write_text(md);print(chap);print('total',tot)
