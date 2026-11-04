#!/bin/bash
# render tiap bagian (paralel per port) → bagian/<nn>/<nn>.mp4
cd "$(dirname "$0")/.."
SK=../.claude/skills/motion-format/scripts/render_mp4.py
port=${PORT0:-9400}
for b in "$@"; do port=$((port+1)); ( MF_PORT=$port python3 $SK bagian/$b --out $b.mp4 > render-log/$b.log 2>&1; echo "SELESAI $b" >> render-log/selesai.txt ) & done
wait
