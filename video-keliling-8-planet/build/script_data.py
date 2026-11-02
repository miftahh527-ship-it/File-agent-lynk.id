# Teks naskah per segmen (versi tampilan/caption, angka ditulis sebagai angka).
# Setiap segmen: list paragraf; setiap paragraf = satu "beat" visual.

SEGMENTS = [
    dict(key="intro", audio="01_intro.mp3", label=None, paras=[
        "Ada planet yang satu harinya... lebih lama dari satu tahunnya!",
        "Ada planet yang bisa... mengapung di air!",
        "Dan ada gunung yang tingginya tiga kali Gunung Everest!",
        "Halo, teman-teman penjelajah! Hari ini kita naik roket imajinasi dan keliling delapan planet di tata surya kita. Semua fakta di video ini diambil dari data NASA dan lembaga antariksa dunia. Jadi bukan hoaks, ya!",
        "Siapkan pensil dan kertas, karena di akhir video ada kuis seru. Yuk, pasang sabuk pengaman... tiga... dua... satu... meluncur!",
    ]),
    dict(key="matahari", audio="02_matahari.mp3", label="Kenalan dengan Bos Tata Surya!", paras=[
        "Sebelum ke planet, kenalan dulu sama bosnya: Matahari! Tahu nggak, Matahari itu besaaar banget. Kalau Matahari itu kosong di dalamnya, kira-kira 1,3 juta Bumi bisa masuk ke dalamnya!",
        "Lebarnya saja sekitar 109 kali lebar Bumi. Wow!",
        "Terus, cahaya Matahari yang kamu lihat pagi ini? Itu butuh sekitar 8 menit untuk sampai ke Bumi. Jadi kamu sebenarnya melihat Matahari 8 menit yang lalu!",
        "Ingat ya, jangan pernah melihat Matahari langsung dengan mata, bisa merusak mata.",
        "Nah, Matahari punya delapan planet yang setia mengelilinginya. Kita mulai dari yang paling dekat!",
    ]),
    dict(key="merkurius", audio="03_merkurius.mp3", label="Planet ke-1", paras=[
        "Planet mana yang siangnya panas membara, tapi malamnya beku banget? Jawabannya: Merkurius!",
        "Merkurius adalah planet paling dekat dengan Matahari. Siang hari, suhunya bisa mencapai 430 derajat Celsius. Tapi malam hari, bisa turun sampai minus 180 derajat! Kenapa begitu? Karena Merkurius hampir tidak punya atmosfer untuk menyimpan panas.",
        "Satu tahun di Merkurius cuma 88 hari Bumi. Kalau kamu tinggal di sana, kamu ulang tahun kira-kira tiap tiga bulan. Asyik, kuenya banyak!",
        "Oh iya, Merkurius tidak punya bulan sama sekali.",
        "Lanjut ke tetangga sebelah yang lebih panas lagi!",
    ]),
    dict(key="venus", audio="04_venus.mp3", label="Planet ke-2", paras=[
        "Coba tebak, mana yang lebih lama: satu hari, atau satu tahun? Di Venus, jawabannya... satu hari!",
        "Venus berputar sangat pelan. Satu kali putaran butuh 243 hari Bumi. Padahal untuk mengelilingi Matahari, Venus cuma butuh sekitar 225 hari Bumi. Jadi satu harinya lebih lama dari satu tahunnya!",
        "Venus juga planet paling panas, suhunya lebih dari 460 derajat Celsius. Lho, kok bukan Merkurius? Karena awan tebal Venus memerangkap panas, seperti mobil yang diparkir di bawah terik matahari dengan kaca tertutup.",
        "Bonus: Venus berputar ke arah berlawanan dengan Bumi. Di sana, Matahari terbit dari barat!",
    ]),
    dict(key="bumi", audio="05_bumi.mp3", label="Planet ke-3", paras=[
        "Dari delapan planet, cuma satu yang sejauh ini diketahui punya kehidupan. Yap, rumah kita sendiri: Bumi!",
        "Sebagian besar permukaan Bumi, sekitar 71 persen, tertutup air. Jaraknya dari Matahari pas, tidak terlalu panas dan tidak terlalu dingin, jadi air bisa tetap cair.",
        "Bumi punya satu bulan yang setia menemani. Kalau Merkurius dan Venus tadi? Nol!",
        "Jadi, jaga Bumi baik-baik ya, teman-teman. Kita belum punya planet cadangan!",
    ]),
    dict(key="mars", audio="06_mars.mp3", label="Planet ke-4", paras=[
        "Kenapa Mars disebut Planet Merah? Jawabannya ternyata... karat!",
        "Tanah Mars mengandung banyak besi oksida, alias karat. Sama seperti paku yang dibiarkan basah, lama-lama jadi merah kecokelatan. Debu karat inilah yang membuat Mars terlihat merah.",
        "Mars juga punya gunung berapi terbesar di tata surya, namanya Olympus Mons. Tingginya sekitar tiga kali Gunung Everest, gunung tertinggi di Bumi!",
        "Mars punya dua bulan kecil, namanya Phobos dan Deimos.",
        "Sekarang kita lewati sabuk asteroid, dan masuk ke wilayah planet raksasa!",
    ]),
    dict(key="jupiter", audio="07_jupiter.mp3", label="Planet ke-5", paras=[
        "Ada badai yang sudah berputar ratusan tahun, dan lebih besar dari Bumi. Di mana? Di Jupiter!",
        "Jupiter adalah planet terbesar di tata surya. Lebih dari 1.000 Bumi bisa masuk ke dalamnya!",
        "Bintik merah di Jupiter itu sebenarnya badai raksasa, namanya Bintik Merah Raksasa. Badai ini sudah ada setidaknya sejak tahun 1800-an. Sekarang lebarnya sekitar 1,3 kali lebar Bumi. Dulu malah lebih besar, tapi pelan-pelan menyusut.",
        "Jupiter juga punya lebih dari 90 bulan. Tapi tunggu dulu, ada planet yang punya lebih banyak lagi!",
    ]),
    dict(key="saturnus", audio="08_saturnus.mp3", label="Planet ke-6", paras=[
        "Planet raksasa yang bisa mengapung di air? Ada! Namanya Saturnus.",
        "Saturnus memang besar, tapi sangat ringan untuk ukurannya. Kepadatannya lebih rendah dari air. Jadi kalau ada bak mandi sebesar itu, Saturnus bisa mengapung! Tentu ini cuma bayangan, karena bak mandi sebesar itu tidak ada.",
        "Cincin Saturnus yang cantik itu terbuat terutama dari bongkahan es, ada yang sekecil butiran debu, sampai sebesar rumah.",
        "Dan inilah juara bulan terbanyak! Per Maret 2025, Saturnus punya 274 bulan yang sudah diketahui. Jauh lebih banyak dari Jupiter!",
    ]),
    dict(key="uranus", audio="09_uranus.mp3", label="Planet ke-7", paras=[
        "Ada planet yang berputar sambil rebahan. Itu Uranus!",
        "Sumbu Uranus miring hampir 98 derajat. Jadi Uranus mengelilingi Matahari seperti bola yang menggelinding. Para ilmuwan menduga, dulu Uranus pernah ditabrak benda sebesar planet.",
        "Uranus juga misterius, karena baru satu wahana antariksa yang pernah mengunjunginya dari dekat, yaitu Voyager 2 milik NASA.",
    ]),
    dict(key="neptunus", audio="10_neptunus.mp3", label="Planet ke-8", paras=[
        "Planet paling jauh dari Matahari, ternyata juga planet paling berangin. Kenalan dengan Neptunus!",
        "Angin di Neptunus bisa melaju lebih dari 2.000 kilometer per jam. Angin terkuat di Bumi \"cuma\" sekitar 400 kilometer per jam. Jadi angin Neptunus kira-kira lima kali lebih kencang!",
        "Satu tahun di Neptunus sama dengan sekitar 165 tahun Bumi. Neptunus ditemukan tahun 1846, dan baru menyelesaikan satu putaran penuh mengelilingi Matahari pada tahun 2011. Jadi sejak ditemukan, Neptunus baru berulang tahun satu kali!",
        "Neptunus juga satu-satunya planet yang tidak bisa dilihat dengan mata telanjang dari Bumi.",
    ]),
    dict(key="q1", audio="11_kuis_q1.mp3", label="KUIS!", paras=[
        "Saatnya kuis! Jawab dalam hati, atau tulis di kolom komentar ya!",
        "Soal pertama: planet mana yang paling panas? A, Merkurius. B, Venus.",
    ], timer=5),
    dict(key="a1", audio="12_q1ans.mp3", label=None, paras=[
        "Jawabannya: B, Venus! Karena awan tebalnya memerangkap panas.",
    ]),
    dict(key="q2", audio="13_q2.mp3", label=None, paras=[
        "Soal kedua: planet mana yang punya bulan paling banyak?",
    ], timer=5),
    dict(key="a2", audio="14_q2ans.mp3", label=None, paras=[
        "Jawabannya: Saturnus, dengan 274 bulan!",
    ]),
    dict(key="q3", audio="15_q3.mp3", label=None, paras=[
        "Soal ketiga, ini yang paling susah: di planet mana, satu harinya lebih lama dari satu tahunnya?",
    ], timer=5),
    dict(key="a3", audio="16_q3ans.mp3", label=None, paras=[
        "Jawabannya: Venus lagi! Berapa yang kamu jawab benar? Tulis skormu di komentar!",
    ]),
    dict(key="outro", audio="17_outro.mp3", label=None, paras=[
        "Wah, perjalanan kita hari ini seru banget! Kita sudah keliling dari Merkurius yang panas-dingin, sampai Neptunus yang super berangin.",
        "Kalau kamu suka video ini, kasih jempol, subscribe, dan tulis di komentar: planet apa yang mau kita bahas lebih dalam di video berikutnya? Sampai jumpa, teman-teman penjelajah!",
    ]),
]
