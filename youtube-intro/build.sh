#!/usr/bin/env bash
# Build ulang video: bash build.sh
set -e
cd "$(dirname "$0")"
python3 sfx.py
node render.js 30
# Versi lengkap: intro 5 dtk + layar Perhatian (13 dtk)
ffmpeg -y -loglevel error -framerate 30 -i frames/f%05d.png -i sfx.wav \
  -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p -c:a aac -b:a 192k -shortest \
  -movflags +faststart letgrowww-intro-lengkap.mp4
# Versi intro saja (5 dtk)
ffmpeg -y -loglevel error -i letgrowww-intro-lengkap.mp4 -t 5 -af "afade=t=out:st=4.6:d=0.4" \
  -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p -c:a aac -b:a 192k \
  -movflags +faststart letgrowww-intro-5detik.mp4
rm -rf frames
echo "Selesai."
