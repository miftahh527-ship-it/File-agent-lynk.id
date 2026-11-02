"""SFX outro Let.growww (10 dtk) — memakai sonic logo yang sama dengan intro.

Pemakaian: python3 outro_sfx.py  -> outro-sfx.wav
"""
from sfxlib import *

track = Track(10.0)
add = track.add


def click():
    n = int(SR * 0.05)
    t = np.arange(n) / SR
    return (rng.standard_normal(n) * np.exp(-t / 0.003) * .6
            + np.sin(2 * np.pi * 2200 * t) * np.exp(-t / 0.01))


# logo masuk: whoosh + ting-ting-ting + pop (sama seperti intro)
add(noise_sweep(0.75, 300, 6000, "bell"), 0.0, .35)
for i, nn in enumerate(["C5", "E5", "G5"]):
    add(marimba(note(nn)), 0.62 + i * .25, .55, pan=-.35 + i * .35)
add(bloop(300, 1100, .12), 1.58, .5)
add(bell(note("C6"), 1.8), 1.62, .28)
add(glitter(), 1.62, .45)
# wordmark: blup-blup-blup "www"
for i, (a, b) in enumerate([(660, 990), (780, 1170), (990, 1480)]):
    add(bloop(a, b), 2.1 + i * .12, .5, pan=-.3 + i * .3)
# judul + ajakan
add(noise_sweep(0.3, 800, 7000, "up"), 2.15, .2)
add(sub_hit(.9), 2.45, .45)
add(pad([note("C4"), note("E4"), note("G4")], 7.4, 1.2, 1.4), 2.4, .09)   # ambient
add(bell(note("G5"), 1.6), 3.05, .12, pan=-.2)
# kartu sosial muncul
add(marimba(note("G4")), 3.62, .45, pan=-.4)
add(marimba(note("C5")), 3.82, .45, pan=.4)
# kursor klik SUBSCRIBE (+ lonceng notifikasi)
add(noise_sweep(0.5, 500, 3000, "bell"), 4.5, .12)
add(click(), 5.2, .55, pan=-.35)
add(bell(note("E6"), 1.2), 5.26, .22, pan=-.35)
add(bell(note("A6"), 1.2), 5.4, .2, pan=-.35)
# kursor klik Follow (+ pop hati)
add(click(), 6.6, .55, pan=.35)
for i in range(3):
    add(bloop(700 + i * 180, 1300 + i * 220, .12), 6.68 + i * .1, .32, pan=.35)
# penutup: akor terang + hit lembut
add(pad([note("C4"), note("E4"), note("G4"), note("C5")], 2.2, .3, 1.2), 7.7, .2)
add(bell(note("C6"), 2.0), 7.8, .16)
add(sub_hit(.9), 7.8, .3)

track.write("outro-sfx.wav", fade_out=0.8)
