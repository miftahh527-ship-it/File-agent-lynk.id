#!/usr/bin/env python3
"""Rakit index.html satu-berkas untuk tiap video: sisipkan core.css + core.js (inline, tanpa module lokal)."""
import pathlib
SRC = pathlib.Path(__file__).resolve().parent
ROOT = SRC.parent
core_js, core_css = (SRC/'core.js').read_text(), (SRC/'core.css').read_text()
for name in ['promo', 'explainer', 'kinetik', 'bumper']:
    f = SRC/f'{name}.html'
    if not f.exists():
        continue
    html = f.read_text().replace('/*@@CORE@@*/', core_js).replace('/*@@CSS@@*/', core_css)
    (ROOT/name/'index.html').write_text(html)
    print('ok', name)
