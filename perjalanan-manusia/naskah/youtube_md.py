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

## Judul (pilih satu)
1. Perjalanan 300.000 Tahun: Dari Gua Sampai Smartphone
2. Sejarah Manusia dalam 11 Menit — Lukisan Tertua Dunia Ada di Indonesia!
3. Dari Manusia Gua ke Zaman HP: Kisah 300.000 Tahun Manusia

## Deskripsi
Tahukah kamu, lukisan gua tertua di dunia ada di Indonesia? Ayo naik mesin waktu dan tempuh perjalanan 300.000 tahun sejarah manusia — dari gua sampai smartphone!

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

#SejarahManusia #EdukasiAnak #LetGrowww #SejarahIndonesia #BelajarSejarah

## Tag
sejarah manusia, perjalanan manusia, sejarah dunia untuk anak, manusia purba, homo sapiens, lukisan gua tertua, pulau muna, liang metanduno, maros, revolusi pertanian, huruf paku, piramida giza, kerajaan nusantara, prasasti yupa, kutai, sriwijaya, borobudur, majapahit, rempah rempah, mesin cetak, revolusi industri, proklamasi kemerdekaan, sejarah sd, ips sd, kurikulum merdeka, video edukasi, animasi edukasi

# Short

## Judul
Lukisan Gua Tertua di Dunia Ada di Indonesia! #Shorts

## Deskripsi
Cap tangan merah di Pulau Muna, Sulawesi Tenggara, berumur minimal 67.800 tahun — lukisan gua tertua di dunia yang usianya sudah dibuktikan!
Versi lengkap: Perjalanan 300.000 Tahun: Dari Gua Sampai Smartphone — <link video long>
#Shorts #SejarahIndonesia #FaktaUnik

## Komentar tersemat (jawaban kuis — jangan ditulis di deskripsi)
Jawaban kuis: 1) Pulau Muna, Sulawesi Tenggara · 2) Huruf paku · 3) Prasasti Yupa, Kerajaan Kutai. Berapa yang kamu jawab benar? 🎉
"""
(R/'youtube.md').write_text(md);print(chap);print('total',tot)
