# Video: Keliling 8 Planet Tata Surya

Video edukasi (16:9, 1920×1080, 30 fps, ±8:09) untuk pelajar SD–SMP, dibuat dari naskah
"Naskah YouTube — Keliling 8 Planet Tata Surya". Gaya storytelling ceria & energik,
voiceover oleh **Zulfa** (ElevenLabs, model eleven_v4, bahasa Indonesia).

File video final (±139 MB) tidak disimpan di git karena melebihi batas 100 MB GitHub.

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
