"""Fungsi sintesis SFX bersama untuk intro & outro Let.growww (tanpa sampel eksternal)."""
import wave
import numpy as np

SR = 48000
rng = np.random.default_rng(7)


def note(f):
    names = {"C": -9, "D": -7, "E": -5, "F": -4, "G": -2, "A": 0, "B": 2}
    return 440.0 * 2 ** ((names[f[0]] + 12 * (int(f[1:]) - 4)) / 12)


def env(n, a, d):
    t = np.arange(n) / SR
    e = np.minimum(1, t / max(a, 1e-4)) * np.exp(-t / d)
    return e


def marimba(f, dur=1.2):
    n = int(SR * dur)
    t = np.arange(n) / SR
    s = (np.sin(2 * np.pi * f * t) * np.exp(-t / 0.45)
         + 0.35 * np.sin(2 * np.pi * f * 4 * t) * np.exp(-t / 0.08)
         + 0.15 * np.sin(2 * np.pi * f * 10 * t) * np.exp(-t / 0.03))
    return s * np.minimum(1, t / 0.002)


def bell(f, dur=2.0):
    n = int(SR * dur)
    t = np.arange(n) / SR
    s = 0
    for mult, amp, dec in [(1, 1, .9), (2.0, .5, .5), (2.76, .35, .35), (5.4, .2, .15)]:
        s = s + amp * np.sin(2 * np.pi * f * mult * t) * np.exp(-t / dec)
    return s * np.minimum(1, t / 0.003)


def bloop(f0, f1, dur=0.16):
    n = int(SR * dur)
    t = np.arange(n) / SR
    f = np.geomspace(f0, f1, n)
    ph = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(ph) * np.sin(np.pi * np.minimum(1, t / dur)) ** 0.6 * np.exp(-t / 0.08)


def noise_sweep(dur, f_from, f_to, shape="up"):
    n = int(SR * dur)
    x = rng.standard_normal(n)
    # filter low-pass satu kutub dengan cutoff berubah
    fc = np.geomspace(f_from, f_to, n)
    a = np.exp(-2 * np.pi * fc / SR)
    y = np.zeros(n)
    acc = 0.0
    for i in range(n):
        acc = a[i] * acc + (1 - a[i]) * x[i]
        y[i] = acc
    t = np.linspace(0, 1, n)
    e = np.sin(np.pi * t) ** 2 if shape == "bell" else (t ** 2 if shape == "up" else (1 - t) ** 2)
    return y * e / (np.abs(y).max() + 1e-9)


def sub_hit(dur=1.2):
    n = int(SR * dur)
    t = np.arange(n) / SR
    f = 45 + 110 * np.exp(-t / 0.05)
    ph = 2 * np.pi * np.cumsum(f) / SR
    click = rng.standard_normal(n) * np.exp(-t / 0.004) * .3
    return np.sin(ph) * np.exp(-t / 0.35) + click


def pad(freqs, dur, a=0.6, r=1.0):
    n = int(SR * dur)
    t = np.arange(n) / SR
    s = 0
    for f in freqs:
        for det in (-0.25, 0.25):
            s = s + np.sin(2 * np.pi * (f + det) * t) + 0.25 * np.sin(2 * np.pi * 2 * (f + det) * t)
    e = np.minimum(1, t / a) * np.minimum(1, (dur - t) / r)
    return s * e / (len(freqs) * 2)


def glitter(dur=0.8, count=14):
    n = int(SR * dur)
    out = np.zeros(n)
    for _ in range(count):
        st = int(rng.uniform(0, dur * .7) * SR)
        f = rng.uniform(3000, 7000)
        s = bell(f, 0.25) * .25
        out[st : st + len(s)] += s[: n - st]
    return out




class Track:
    def __init__(self, total):
        self.N = int(SR * total)
        self.L = np.zeros(self.N)
        self.R = np.zeros(self.N)

    def add(self, sig, t, gain=1.0, pan=0.0):
        i = int(t * SR)
        sig = sig[: max(0, self.N - i)]
        l = np.cos((pan + 1) * np.pi / 4)
        r = np.sin((pan + 1) * np.pi / 4)
        self.L[i : i + len(sig)] += sig * gain * l * 1.414
        self.R[i : i + len(sig)] += sig * gain * r * 1.414

    def write(self, path, fade_out=0.4):
        mix = np.stack([self.L, self.R], axis=1)
        # reverb sederhana (multi-tap feedback delay)
        rev = np.zeros_like(mix)
        for d, g in [(0.029, .35), (0.041, .3), (0.067, .25), (0.089, .2), (0.131, .15), (0.173, .1)]:
            k = int(d * SR)
            rev[k:] += mix[:-k] * g
            rev[2 * k:] += mix[:-2 * k] * g * .5
        mix = mix + rev[:, ::-1] * .6
        mix = np.tanh(mix * 1.1)                    # soft clip
        mix *= 0.89 / np.abs(mix).max()
        fade = int(fade_out * SR)
        mix[-fade:] *= np.linspace(1, 0, fade)[:, None]
        with wave.open(path, "wb") as w:
            w.setnchannels(2)
            w.setsampwidth(2)
            w.setframerate(SR)
            w.writeframes((mix * 32767).astype("<i2").tobytes())
        print(path, "ok", mix.shape[0] / SR, "detik")
