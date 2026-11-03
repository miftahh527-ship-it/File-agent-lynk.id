"""Sintesis SFX intro Let.growww (tanpa sampel eksternal, bebas hak cipta).

Signature audio ("sonic logo") yang mudah diingat:
  whoosh -> 3 nada naik "ting-ting-ting" (C-E-G, saat batang data tumbuh)
  -> "pop" + kilau (daun muncul) -> bass hit (judul)
  -> "blup-blup-blup" naik (tiga huruf w) -> akor C mayor bersinar.
Lalu chime lembut untuk layar "Perhatian" + pad ambient.

Pemakaian: python3 sfx.py  -> menghasilkan sfx.wav (48 kHz, stereo)
"""
from sfxlib import *

track = Track(13.0)
add = track.add

# ---------------- INTRO ----------------
add(noise_sweep(0.75, 300, 6000, "bell"), 0.0, .35)                 # whoosh masuk
for i, nn in enumerate(["C5", "E5", "G5"]):                           # 3 batang data
    add(marimba(note(nn)), 0.62 + i * .25, .55, pan=-.35 + i * .35)
add(bloop(300, 1100, .12), 1.58, .5)                                  # pop daun
add(bell(note("C6"), 1.8), 1.62, .30)                                 # kilau
add(glitter(), 1.62, .5)
add(noise_sweep(0.35, 800, 8000, "up"), 1.75, .25)                    # whoosh judul
add(sub_hit(), 2.05, .8)                                              # bass hit
add(bell(note("C4"), 1.5), 2.05, .25)
for i, (a, b) in enumerate([(660, 990), (780, 1170), (990, 1480)]):   # blup-blup-blup "www"
    add(bloop(a, b), 2.72 + i * .12, .55, pan=-.3 + i * .3)
add(pad([note("C4"), note("E4"), note("G4"), note("C5")], 1.8, .35, .9), 3.05, .22)   # akor tagline
add(bell(note("G5"), 2.0), 3.1, .18, pan=.2)
add(bell(note("C6"), 2.0), 3.25, .14, pan=-.2)
add(noise_sweep(0.45, 400, 9000, "up"), 4.42, .4)                     # riser transisi
add(sub_hit(.9), 4.86, .45)

# ---------------- PERHATIAN ----------------
add(bell(note("E5"), 1.5), 5.35, .30, pan=-.15)                       # chime 2 nada
add(bell(note("A5"), 1.8), 5.55, .30, pan=.15)
add(pad([note("A3"), note("E4"), note("C5")], 7.6, 1.5, 1.6), 5.3, .10)  # ambient lembut

track.write("sfx.wav")
