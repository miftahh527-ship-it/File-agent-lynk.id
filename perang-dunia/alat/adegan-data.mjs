// Revisi visual: foto arsip & grafik gerak per beat. Kunci = "<id bagian>:<urutan beat>".
// sc = adegan; hapus = elemen lama yang dibuang di beat itu; side = paksa ubin ke kolom kanan.
// Foto: domain publik dari Wikimedia Commons (rincian sumber di foto/SUMBER.md).
export const ADEGAN = {
  // ---------- Pembuka ----------
  'p0:0': { sc: { t: 'foto', src: 'sarajevo-mobil.jpg', kr: 'Sarajevo, 28 Juni 1914 · domain publik', z: 'in' }, side: 1 },
  'p0:2': { sc: { t: 'foto', src: 'hiroshima-awan.jpg', bingkai: 1, portret: 1, label: 'Hiroshima · 6 Agustus 1945', kr: 'Angkatan Darat AS, 1945 · domain publik' }, side: 1 },

  // ---------- 1.1 MAIN ----------
  '1.1:1': { sc: { t: 'foto', src: 'dreadnought.jpg', bingkai: 1, label: 'HMS Dreadnought · 1906', kr: 'Imperial War Museum · domain publik' }, side: 1 },
  '1.1:2': { sc: { t: 'aliansi', kiri: { j: 'Blok Sentral', n: ['Jerman', 'Austria-Hongaria'], k: 'Jerman dan Austria' }, kanan: { j: 'Blok Entente', n: ['Prancis', 'Rusia', 'Inggris'], k: 'Prancis, Rusia' } }, hapus: ['mk'] },
  '1.1:4': { sc: { t: 'foto', src: 'kitchener.jpg', bingkai: 1, portret: 1, label: 'Poster rekrutmen · 1914', kr: 'Alfred Leete, 1914 · domain publik' }, side: 1 },

  // ---------- 1.2 Sarajevo ----------
  '1.2:0': { sc: { t: 'orang', org: [{ src: 'franz-ferdinand.jpg', nama: 'Franz Ferdinand', ket: 'Putra mahkota Austria-Hongaria' }] }, hapus: ['it'], side: 1 },
  '1.2:1': { sc: { t: 'orang', org: [{ src: 'franz-ferdinand.jpg', nama: 'Franz Ferdinand', ket: '1863–1914' }, { src: 'princip.jpg', nama: 'Gavrilo Princip', ket: 'Penembak · 19 tahun', k: 'Gavrilo' }] }, hapus: ['it'] },
  '1.2:2': { sc: { t: 'domino', id: 'dom', ev: [{ d: '28 Juli', a: 'Austria-Hongaria', b: 'Serbia', k: 'menyatakan perang' }] } },
  '1.2:3': { sc: { t: 'domino', id: 'dom', ev: [{ d: '1 Agustus', a: 'Jerman', b: 'Rusia', k: 'kepada Rusia' }, { d: '3 Agustus', a: 'Jerman', b: 'Prancis', k: 'dan Prancis' }] } },
  '1.2:4': { sc: { t: 'domino', id: 'dom', ev: [{ d: '4 Agustus', a: 'Inggris', b: 'Jerman', k: 'Inggris pun' }] } },
  '1.2:6': { sc: { t: 'foto', src: 'kereta-1914.jpg', kr: 'Tentara Jerman berangkat ke front, 1914 · domain publik', z: 'kanan' }, side: 1 },

  // ---------- 1.3 Perang parit ----------
  '1.3:1': { sc: { t: 'foto', src: 'parit.jpg', kr: 'Parit di Somme, 1916 · domain publik', z: 'in' }, side: 1 },
  '1.3:3': { sc: { t: 'foto', src: 'tank.jpg', kr: 'Tank Mark I, Somme 1916 · domain publik', z: 'kiri' } },
  '1.3:4': { sc: { t: 'foto', src: 'somme.jpg', kr: 'Pertempuran Somme, Juli 1916 · domain publik', z: 'out' } },
  '1.3:6': { sc: { t: 'foto', src: 'gencatan.jpg', kr: 'Paris merayakan gencatan senjata, 1918 · domain publik', z: 'in' }, side: 1 },

  // ---------- 1.4 Damai yang menanam perang ----------
  '1.4:2': { sc: { t: 'foto', src: 'versailles.jpg', bingkai: 1, label: 'Versailles · 28 Juni 1919', kr: 'Lukisan William Orpen, 1919 · domain publik' }, hapus: ['mk'], side: 1 },
  '1.4:3': { sc: { t: 'foto', src: 'liga.jpg', bingkai: 1, label: 'Sidang pertama · Jenewa 1920', kr: 'Arsip Nasional Belanda · domain publik' }, hapus: ['mk'], side: 1 },
  '1.4:6': { sc: { t: 'kutip', teks: 'Perang untuk mengakhiri semua perang', oleh: 'Slogan populer 1914 · dari judul buku H. G. Wells' }, hapus: ['it'] },

  // ---------- 2.1 Krisis ke diktator ----------
  '2.1:1': { sc: { t: 'garis', judul: 'Harga 1 dolar AS dalam mark Jerman', log: 1, ease: 'none', dur: 4.2,
    d: [[1914.5, 4.2], [1919.95, 46.8], [1921.95, 191.8], [1922.5, 493], [1922.95, 7589], [1923.05, 17972], [1923.55, 353412], [1923.62, 4620455], [1923.7, 98860000], [1923.8, 25260208000], [1923.87, 4.2e12]],
    x0: 1914, x1: 1924, xt: [[1914, '1914'], [1916, '1916'], [1918, '1918'], [1920, '1920'], [1922, '1922'], [1924, '1924']],
    grid: [[1, '1'], [1e3, '1 ribu'], [1e6, '1 juta'], [1e9, '1 miliar'], [1e12, '1 triliun']],
    titik: [[1914.5, 4.2, '1914 · 4,2 mark', 1], [1923.87, 4.2e12, 'Nov 1923 · 4,2 triliun mark']], sumber: 'kurs mark–dolar 1914–1923' }, hapus: ['it'] },
  '2.1:2': { sc: { t: 'foto', src: 'antrean.jpg', kr: 'Antrean makanan gratis, Chicago 1931 · domain publik', z: 'kanan' }, side: 1 },

  // ---------- 2.2 Perang meledak ----------
  '2.2:4': { sc: { t: 'foto', src: 'pearl-harbor.jpg', kr: 'USS Arizona, Pearl Harbor, 7 Des 1941 · domain publik', z: 'in' } },
  '2.2:5': { sc: { t: 'aliansi', kiri: { j: 'Blok Poros', n: ['Jerman', 'Italia', 'Jepang'], k: 'Blok Poros' }, kanan: { j: 'Sekutu', n: ['Inggris', 'Uni Soviet', 'Amerika Serikat', 'Tiongkok'], k: 'yaitu Inggris' } } },

  // ---------- 2.3 Indonesia ----------
  '2.3:3': { sc: { t: 'foto', src: 'romusha.jpg', bingkai: 1, portret: 1, label: 'Soekarno di depan romusha · 1944', kr: 'Arsip 1944 · domain publik' }, side: 1 },
  '2.3:5': { sc: { t: 'foto', src: 'proklamasi.jpg', bingkai: 1, label: 'Jakarta · 17 Agustus 1945', kr: 'Frans Mendur, 1945 · domain publik' }, hapus: ['mk'], side: 1 },

  // ---------- 2.4 Titik balik ----------
  '2.4:2': { sc: { t: 'foto', src: 'dday.jpg', kr: 'Pantai Omaha, 6 Juni 1944 · domain publik', z: 'in' } },
  '2.4:5': { sc: { t: 'foto', src: 'nagasaki.jpg', kr: 'Nagasaki, 9 Agustus 1945 · domain publik', z: 'out', pos: '50% 35%' }, hapus: ['mk'], side: 1 },
  '2.4:6': { sc: { t: 'wafel', ket: '1 ikon = 1 juta jiwa', g: [{ t: 'Perang Dunia I', lab: '15–20 juta', c: 'a', min: 15, max: 20 }, { t: 'Perang Dunia II', lab: '70–85 juta', c: 'b', min: 70, max: 85, k: 'tujuh puluh' }] }, hapus: ['bars'] },

  // ---------- 2.5 Delapan puluh tahun ----------
  '2.5:0': { sc: { t: 'waktu', id: 'w45', a: 1940, b: 2030, ev: [{ y: 1945, t: 'PBB berdiri', k: 'Perserikatan' }] }, hapus: ['it', 'mk'] },
  '2.5:1': { sc: { t: 'waktu', id: 'w45', ev: [{ y: 1947, t: 'Perang Dingin', k: 'Perang Dingin' }] }, hapus: ['it', 'mk'] },
  '2.5:2': { sc: { t: 'waktu', id: 'w45', ev: [] }, hapus: ['it'] },
  '2.5:3': { sc: { t: 'waktu', id: 'w45', ev: [{ y: 1962, t: 'Krisis Rudal Kuba', c: 'r', k: 'Krisis Rudal' }] }, hapus: ['it', 'mk'] },
  '2.5:4': { sc: { t: 'waktu', id: 'w45', ev: [{ y: 1991, t: 'Perang Dingin berakhir', k: 'berakhir' }, { y: 1945, y1: 2026, t: '80+ tahun tanpa perang dunia', k: 'delapan puluh tahun' }] }, hapus: ['num'] },
  '2.5:5': { sc: { t: 'waktu', id: 'w45', ev: [{ y: 2026, t: 'Akan bertahan?', k: 'bertahan' }] } },

  // ---------- 3.1 Jam Kiamat ----------
  '3.1:7': { sc: { t: 'jam', k: 'Jam Kiamat', lang: [[1947, 420, '7 menit'], [1953, 120, '2 menit'], [1991, 1020, '17 menit'], [2020, 100, '100 detik'], [2026, 85, '85 detik']] }, hapus: ['num'] },

  // ---------- 3.2 / 3.3 ----------
  '3.2:0': { sc: { t: 'ketik', baris: ['1914', '1939', '2026?'], c: ['', '', 'y'], ka: ['sembilan belas empat belas', 'tiga puluh sembilan', null] } },
  '3.3:0': { sc: { t: 'ketik', baris: ['TAPI', 'ADA BEDANYA'], c: ['s', 'y'], ka: [null, 'perbedaan besar'] } },
  '3.3:1': { sc: { t: 'garis', judul: 'Jumlah hulu ledak nuklir di dunia', ease: 'none', dur: 5,
    d: [[1945, 2], [1950, 300], [1955, 2500], [1960, 20000], [1965, 37000], [1970, 39000], [1975, 47000], [1980, 54000], [1986, 70300], [1990, 56000], [1995, 41000], [2000, 31000], [2005, 26000], [2010, 22000], [2015, 16000], [2020, 13400], [2025, 12100]],
    x0: 1945, x1: 2025, ymax: 80000, xt: [[1945, '1945'], [1965, '1965'], [1985, '1985'], [2005, '2005'], [2025, '2025']],
    grid: [[20000, '20 rb'], [40000, '40 rb'], [60000, '60 rb']],
    titik: [[1986, 70300, 'Puncak 1986 · ±70.000'], [2025, 12100, '2025 · ±12.000']], sumber: 'Federation of American Scientists (perkiraan)' }, hapus: ['it'] },

  // ---------- 4.2 Tas siaga ----------
  '4.2:1': { sc: { t: 'cek', id: 'tas', j: 'Isi Tas Siaga Bencana · 3 hari', n: [{ t: 'Dokumen penting + salinan digital', k: 'Dokumen' }, { t: 'Uang tunai secukupnya', k: 'Uang tunai' }, { t: 'Air minum & makanan tahan lama', k: 'Air minum' }, { t: 'Obat pribadi & kotak P3K', k: 'Obat-obatan' }] }, hapus: ['it'] },
  '4.2:2': { sc: { t: 'cek', id: 'tas', n: [{ t: 'Senter & baterai cadangan', k: 'Senter' }, { t: 'Power bank', k: 'power bank' }, { t: 'Radio kecil bertenaga baterai', k: 'Radio' }, { t: 'Peluit & masker', k: 'Peluit' }, { t: 'Pakaian ganti & perlengkapan mandi', k: 'pakaian ganti' }] }, hapus: ['it'] },
  '4.2:3': { sc: { t: 'cek', id: 'tas', n: [{ t: 'Susu & popok untuk bayi', k: 'susu' }, { t: 'Obat rutin untuk lansia', k: 'obat rutin' }, { t: 'Cek isi tas tiap beberapa bulan', k: 'Periksa' }] }, hapus: ['it'] },

  // ---------- 4.4 Memilah informasi ----------
  '4.4:1': { sc: { t: 'cek', j: 'Sebelum membagikan kabar, tanya:', n: [{ t: 'Siapa sumbernya?', k: 'siapa' }, { t: 'Kapan kejadiannya?', k: 'kapan' }, { t: 'Adakah media tepercaya lain yang memberitakan?', k: 'adakah' }] }, hapus: ['it'] },

  // ---------- Penutup ----------
  'p9:5': { sc: { t: 'ketik', baris: ['MENOLAK', 'DIBENTURKAN'], c: ['', 'y'], ka: ['menolak', 'dibenturkan'] } },
};
