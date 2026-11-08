"""Cek tata letak semua bagian (skill motion-format) + saring tumpukan sah proyek ini:
subtitle (#cap, berlatar blok gelap, selalu di depan) di atas tubuh tokoh/gambar = sah."""
import json, subprocess, sys, pathlib
R=pathlib.Path(__file__).resolve().parent.parent;CK=R.parent/'.claude/skills/motion-format/scripts/cek_tata_letak.py'
targets=sys.argv[1:] or [d.name for d in sorted((R/'bagian').iterdir())]+['short']
tot=0
for b in targets:
    d=R/'bagian'/b if (R/'bagian'/b).exists() else R/b
    subprocess.run(['python3',str(CK),str(d),'--langkah','0.5'],capture_output=True)
    rep=json.load(open(d/'cek-tata-letak.json'))
    sah=lambda m: m['masalah']=='gambar menutupi teks' and (m['a'].startswith('span') or m['b'].startswith('span'))
    g=[m for m in rep if m['tingkat']=='GALAT' and not sah(m)];w=[m for m in rep if m['tingkat']!='GALAT']
    tot+=len(g);print(f"== {b}: {len(g)} galat, {len(w)} peringatan, {sum(sah(m) for m in rep)} subtitle-di-atas-gambar (sah)")
    for m in g: print(f"   {m['dari']:.1f}–{m['sampai']:.1f}  {m['masalah']}: {m['a']} ↔ {m['b']}")
print('TOTAL GALAT',tot)
