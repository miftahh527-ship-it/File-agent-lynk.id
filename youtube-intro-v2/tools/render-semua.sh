#!/usr/bin/env bash
# Render semua konsep jadi MP4 (butuh Python 3, Chrome/Chromium, ffmpeg).
# Pemakaian: bash tools/render-semua.sh            (dari folder youtube-intro-v2)
#            CHROME=/path/ke/chrome bash tools/render-semua.sh
# tools/render_mp4.py berasal dari skill Motion Format (MIT).
set -e
cd "$(dirname "$0")/.."
[ -z "$CHROME" ] && [ -x /opt/pw-browsers/chromium-1243/chrome-linux64/chrome ] && export CHROME=/opt/pw-browsers/chromium-1243/chrome-linux64/chrome
mkdir -p hasil
for k in konsep-1-benih konsep-2-kebun konsep-3-huruf; do
  python3 tools/render_mp4.py "$k/intro" --out "../../hasil/$k-intro-lengkap.mp4" "$@"
  python3 tools/render_mp4.py "$k/outro" --out "../../hasil/$k-outro-10detik.mp4" "$@"
  # potongan intro 5 detik (tanpa layar Perhatian)
  if ffprobe -v error -select_streams a -show_entries stream=index -of csv=p=0 "hasil/$k-intro-lengkap.mp4" | grep -q .; then
    AF=(-af "afade=t=out:st=4.6:d=0.4" -c:a aac -b:a 192k); else AF=(-an); fi
  ffmpeg -y -loglevel error -i "hasil/$k-intro-lengkap.mp4" -t 5 "${AF[@]}" \
    -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p -movflags +faststart "hasil/$k-intro-5detik.mp4"
done
ls -la hasil
