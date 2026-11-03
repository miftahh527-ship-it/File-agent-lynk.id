#!/bin/bash
# Render semua Shorts: video (Playwright) + audio (mixer) lalu gabung. Jalankan dari folder build/.
set -e
OUT=${1:-../shorts_out}; mkdir -p "$OUT"
render_one() {
  j=$1; b=$(basename $j .json); OUT=$2
  [ -s "$OUT/$b.mp4" ] && { echo "skip $b"; return; }
  [ -s "$OUT/$b.video.mp4" ] || node capture_short.js $j video "$OUT/$b.video.mp4"
  python3 build_audio.py $j "$OUT/$b.wav" > /dev/null
  ffmpeg -v error -y -i "$OUT/$b.video.mp4" -i "$OUT/$b.wav" -map 0:v -map 1:a -c:v copy -af loudnorm=I=-14:TP=-1.5:LRA=11 -c:a aac -b:a 192k -ar 48000 -shortest -movflags +faststart "$OUT/$b.mp4"
  rm "$OUT/$b.video.mp4" "$OUT/$b.wav"; echo "done $b"
}
export -f render_one
ls shorts/*.json | xargs -P 4 -I{} bash -c 'render_one {} '"$OUT"
