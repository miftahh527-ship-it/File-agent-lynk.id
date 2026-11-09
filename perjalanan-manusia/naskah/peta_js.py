#!/usr/bin/env python3
"""Bangun lib/peta-data.js dari data peta skill (.claude/skills/motion-format/scripts/peta_data.py).
Garis pantai digambar sendiri (titik tulisan tangan), bukan data unduhan. Titik batas darat bersama
(B_*) ditandai keras → digambar lurus oleh landD()."""
import pathlib, sys
ROOT = pathlib.Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / '.claude/skills/motion-format/scripts'))
import peta_data as D

shapes = [(bid, nama, pts) for bid, b in D.BENUA.items() for nama, pts in b['bentuk'].items()]
cnt = {}
for _, _, pts in shapes:
    for p in set(pts):
        cnt[p] = cnt.get(p, 0) + 1
f = lambda v: f'{v:g}'
def ring(pts):
    flat = ','.join(f'{f(a)},{f(b)}' for a, b in pts)
    hard = [i for i, p in enumerate(pts) if cnt[p] > 1]
    return f'mk([{flat}],[{",".join(map(str, hard))}])'
nus = [s for s in shapes if s[1] in D.INDONESIA]
dun = [s for s in shapes if s[1] not in D.INDONESIA]
afr = [s for s in shapes if s[0] == 'afrika']
out = ['/* PETA BUATAN SENDIRI — dibangkitkan naskah/peta_js.py dari data skill motion-format (peta_data.py):',
       '   garis pantai titik demi titik (lon,lat) ditulis tangan, BUKAN data unduhan. Dihaluskan Catmull-Rom',
       '   sentripetal di landD(); titik batas darat bersama (r.h) digambar lurus. */',
       'const PETA=(()=>{const mk=(a,h)=>{a.h=new Set(h);return a;};']
for key, grp in (('nusantara', nus), ('dunia', dun), ('afrika', afr)):
    out.append(f'const {key}=[')
    out += [f' /*{n}*/{ring(p)},' for _, n, p in grp]
    out.append('];')
out.append('return {dunia,nusantara,afrika,laut:[]};})();')
(ROOT / 'perjalanan-manusia/lib/peta-data.js').write_text('\n'.join(out) + '\n')
print(len(nus), 'pulau RI,', len(dun), 'daratan lain')
