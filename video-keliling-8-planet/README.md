# Video: Keliling 8 Planet Tata Surya

Video edukasi (16:9, 1920×1080, 30 fps, ±8:09) untuk pelajar SD–SMP, dibuat dari naskah
"Naskah YouTube — Keliling 8 Planet Tata Surya". Gaya storytelling ceria & energik,
voiceover oleh **Zulfa** (ElevenLabs, model eleven_v4, bahasa Indonesia).

Video final (dengan intro v2) ada di `Keliling_8_Planet_dengan_Intro_v2.mp4` (1080p, 8:22, ±87 MB — dikompres 2-pass agar muat di bawah batas 100 MB GitHub).

## Isi
- `vo/` — 17 klip voiceover Zulfa per segmen (intro, Matahari, 8 planet, kuis 3 soal, outro).
- `build/script_data.py` — teks naskah per segmen/paragraf (juga dipakai sebagai caption).
- `build/build_timeline.py` — menyelaraskan kalimat ke audio (deteksi jeda), menyusun adegan,
  transisi, timer kuis 5 detik, dan jadwal efek suara → `timeline.json`.
- `build/engine.js` + `render.html` — animasi canvas prosedural (planet, angka besar, caption,
  pelacak perjalanan 8 planet, label "Sumber: NASA").
- `build/capture.js` — merender frame deterministik lewat Playwright/Chromium → H.264.
- `build/build_audio.py` — musik latar & SFX yang disintesis sendiri (bebas royalti) + ducking VO.

## Render ulang
```bash
cd build
python3 build_timeline.py
node capture.js range 0 14657 ../video.mp4      # bisa dipecah paralel per rentang frame
python3 build_audio.py                            # -> build/mix.wav
ffmpeg -i ../video.mp4 -i mix.wav -map 0:v -map 1:a -c:v copy \
  -af loudnorm=I=-14:TP=-1.5 -c:a aac -b:a 192k ../Keliling_8_Planet_Tata_Surya.mp4
```

## Versi dengan intro channel
Video final diawali **intro v2 Let.growww — konsep 3 "Huruf jadi tanaman"** (13 detik: huruf tumbuh
dari tanah + layar Perhatian) dari `youtube-intro-v2/hasil/konsep-3-huruf-intro-lengkap.mp4`
(branch `claude/letgrowww-youtube-intro-8ys7no`). Hasil: `Keliling_8_Planet_dengan_Intro_v2.mp4` (8:22).
```bash
ffmpeg -i konsep-3-huruf-intro-lengkap.mp4 -i Keliling_8_Planet_Tata_Surya.mp4 -filter_complex \
  "[0:a]aresample=48000[a0];[1:a]aresample=48000[a1];[0:v][a0][1:v][a1]concat=n=2:v=1:a=1[v][a]" \
  -map "[v]" -map "[a]" -c:v libx264 -crf 19 -c:a aac -b:a 192k Keliling_8_Planet_dengan_Intro_v2.mp4
```

## Shorts 9:16 (10 video)
Hasil di `shorts/` (1080×1920, 30 fps, −14 LUFS), mengikuti tabel "Peta pemecahan Shorts" di naskah:

| File | Judul | Durasi |
|---|---|---|
| `short01_matahari.mp4` | 1,3 Juta Bumi Muat di Matahari! | 0:41 |
| `short02_merkurius.mp4` | Siang Membara, Malam Membeku | 0:46 |
| `short03_venus.mp4` | 1 Hari Lebih Lama dari 1 Tahun?! | 0:52 |
| `short04_bumi.mp4` | Satu-satunya Planet Berpenghuni | 0:37 |
| `short05_mars.mp4` | Mars Itu Berkarat? | 0:38 |
| `short06_jupiter.mp4` | Badai Lebih Besar dari Bumi | 0:45 |
| `short07_saturnus.mp4` | Planet yang Bisa Mengapung! | 0:46 |
| `short08_uranus.mp4` | Planet yang Rebahan | 0:33 |
| `short09_neptunus.mp4` | Planet Paling Berangin | 0:51 |
| `short10_kuis.mp4` | Kuis Planet, Berapa Skormu? | 1:02 |

- Kalimat [LONG-ONLY] dipotong (Matahari, Merkurius, Mars); Short 1–9 diakhiri layar ajakan follow (5,9 dtk) dengan suara Zulfa: "Mau tahu planet mana yang paling aneh? Follow, ada fakta planet tiap hari!" (`vo/18_cta_follow.mp3`).
- Tata letak: judul Short di sepertiga atas, adegan dibingkai ulang "kamera" per beat (`build/portrait.js`, tabel `CAM`),
  caption besar sedikit ke kiri agar tidak tertutup tombol YouTube.
- Render ulang: `cd build && python3 build_shorts.py && ./render_shorts.sh ../shorts`.

## Thumbnail
`thumbnail/thumbnail_video_panjang.jpg` (1280×720) untuk video panjang, dan `thumbnail/cover_shortNN_*.jpg` (1080×1920)
untuk tiap Short. Render ulang: `cd build && node capture_thumbs.js ../thumbnail-png` (desain di `build/thumb.js`).
