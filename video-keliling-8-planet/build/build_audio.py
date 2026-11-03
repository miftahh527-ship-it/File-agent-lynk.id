"""Mixer audio: VO Zulfa + musik latar ceria (disintesis) + SFX, dengan ducking otomatis."""
import json, os, subprocess, wave, sys
import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SR = 48000
TL_PATH = sys.argv[1] if len(sys.argv) > 1 else os.path.join(ROOT, "build", "timeline.json")
OUT_PATH = sys.argv[2] if len(sys.argv) > 2 else os.path.join(ROOT, "build", "mix.wav")
TL = json.load(open(TL_PATH))
N = int(TL["duration"] * SR) + SR
rs = np.random.default_rng(1)

def load(path):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", path, "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"], capture_output=True, check=True).stdout
    return np.frombuffer(raw, dtype=np.float32).copy()

def env_adsr(n, a=0.005, d=0.1, s=0.0, r=0.05):
    t = np.arange(n) / SR
    e = np.where(t < a, t / a, np.maximum(s, np.exp(-(t - a) / max(d, 1e-4))))
    tail = int(r * SR)
    if tail and n > tail: e[-tail:] *= np.linspace(1, 0, tail)
    return e

def note(f, dur, kind="sine", decay=0.4, amp=1.0):
    n = int(dur * SR); t = np.arange(n) / SR
    if kind == "sine": w = np.sin(2 * np.pi * f * t)
    elif kind == "tri": w = 2 / np.pi * np.arcsin(np.sin(2 * np.pi * f * t))
    elif kind == "bell": w = np.sin(2 * np.pi * f * t) + 0.4 * np.sin(2 * np.pi * f * 2.76 * t) * np.exp(-t * 6) + 0.2 * np.sin(2 * np.pi * f * 5.4 * t) * np.exp(-t * 10)
    elif kind == "pad": w = sum(np.sin(2 * np.pi * f * h * t * (1 + dt)) / h for h, dt in [(1, 0), (1, 0.003), (2, -0.002), (3, 0.001)])
    return w * env_adsr(n, 0.004 if kind != "pad" else 0.35, decay, 0, 0.08) * amp

def onepole_lp(x, a):
    y = np.empty_like(x); acc = 0.0
    for i in range(len(x)):
        acc += a[i] * (x[i] - acc); y[i] = acc
    return y

midi = lambda m: 440 * 2 ** ((m - 69) / 12)

# ---------------- musik latar (C mayor, 112 bpm: C - G - Am - F)
def music():
    bpm = 112; beat = 60 / bpm; bar = 4 * beat
    chords = [[60, 64, 67], [55, 59, 62], [57, 60, 64], [53, 57, 60]]
    loop_bars = 8; L = int(loop_bars * bar * SR) + SR
    m = np.zeros(L)
    def put(sig, t):
        i = int(t * SR); j = min(L, i + len(sig)); m[i:j] += sig[: j - i]
    arp_pat = [0, 1, 2, 1, 0, 2, 1, 2]
    for b in range(loop_bars):
        ch = chords[b % 4]; t0 = b * bar
        for k, nn in enumerate(ch):
            put(note(midi(nn), bar + 0.4, "pad", decay=3.0, amp=0.07), t0)
        put(note(midi(ch[0] - 24), beat * 1.8, "sine", decay=0.5, amp=0.28), t0)
        put(note(midi(ch[0] - 24), beat * 1.8, "sine", decay=0.5, amp=0.22), t0 + 2 * beat)
        for e in range(8):
            nn = ch[arp_pat[e]] + 12 + (12 if (b % 2 == 1 and e in (3, 7)) else 0)
            put(note(midi(nn), beat * 0.6, "tri", decay=0.16, amp=0.12), t0 + e * beat / 2)
        for e in range(8):  # shaker
            if e % 2 == 1:
                n = int(0.05 * SR); sh = rs.standard_normal(n) * env_adsr(n, 0.001, 0.02) * 0.05
                sh = np.diff(sh, prepend=0)
                put(sh, t0 + e * beat / 2)
    m = m[: int(loop_bars * bar * SR)]
    reps = N // len(m) + 1
    return np.tile(m, reps)[:N]

# ---------------- SFX
def sfx(name):
    if name == "whoosh":
        n = int(0.9 * SR); x = rs.standard_normal(n)
        a = np.interp(np.arange(n), [0, n * 0.6, n], [0.01, 0.35, 0.02])
        y = onepole_lp(x, a); y -= onepole_lp(y, np.full(n, 0.02))
        return y * np.sin(np.linspace(0, np.pi, n)) ** 2 * 0.5
    if name == "pop":
        n = int(0.12 * SR); t = np.arange(n) / SR; f = 900 * np.exp(-t * 18) + 250
        return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 30) * 0.35
    if name == "tick":
        n = int(0.05 * SR); t = np.arange(n) / SR
        return (np.sin(2 * np.pi * 1700 * t) + 0.5 * np.sin(2 * np.pi * 3400 * t)) * np.exp(-t * 90) * 0.4
    if name == "beep":
        return note(880, 0.22, "sine", decay=0.2, amp=0.3)
    if name == "buzz":
        n = int(0.35 * SR); t = np.arange(n) / SR
        return np.tanh(3 * np.sin(2 * np.pi * 196 * t)) * env_adsr(n, 0.01, 0.3, 0, 0.05) * 0.18
    if name in ("correct", "chime"):
        out = np.zeros(int(1.6 * SR))
        seq = [72, 76, 79, 84] if name == "correct" else [79, 84, 88]
        for i, m_ in enumerate(seq):
            s = note(midi(m_), 1.2, "bell", decay=0.5, amp=0.22); j = int(i * 0.09 * SR); out[j:j + len(s)] += s[: len(out) - j]
        return out
    if name == "launch":
        n = int(2.4 * SR); x = rs.standard_normal(n)
        y = onepole_lp(x, np.full(n, 0.02)) * 6
        e = np.interp(np.arange(n), [0, n * 0.25, n], [0, 1, 0])
        return np.tanh(y) * e * 0.5
    raise ValueError(name)

def main():
    vo = np.zeros(N)
    for v in TL["vo"]:
        x = load(os.path.join(ROOT, "vo", v["file"]))
        if v.get("trim"):
            x = x[: int(v["trim"] * SR)].copy(); f = int(0.12 * SR); x[-f:] *= np.linspace(1, 0, f)
        i = int(v["t"] * SR); vo[i:i + len(x)] += x[: N - i]
    # ducking: musik turun saat VO berbicara
    mask = np.zeros(N)
    for v in TL["vo"]:
        i, j = int((v["t"] - 0.15) * SR), int((v["t"] + v.get("trim", v["dur"]) + 0.1) * SR); mask[max(0, i):j] = 1
    k = int(0.25 * SR); c = np.concatenate([[0.0], np.cumsum(mask)]); idx = np.arange(N); lo = np.clip(idx - k // 2, 0, N); hi = np.clip(idx + k // 2, 0, N); mask = (c[hi] - c[lo]) / k
    gain = 0.30 - 0.19 * mask   # 0.30 tanpa VO, 0.11 saat VO
    mus = music() * gain
    fx = np.zeros(N)
    for e in TL["events"]:
        s = sfx(e["sfx"]); i = int(e["t"] * SR); j = min(N, i + len(s)); fx[i:j] += s[: j - i]
    # fade in/out musik
    fi = int(1.5 * SR); mus[:fi] *= np.linspace(0, 1, fi)
    end = int(TL["duration"] * SR); fo = int(3 * SR); mus[end - fo:end] *= np.linspace(1, 0, fo); mus[end:] = 0
    mixL = vo * 1.0 + mus + fx * 0.8
    mixR = vo * 1.0 + np.roll(mus, int(0.012 * SR)) + fx * 0.8
    mix = np.stack([mixL, mixR], 1)[:end]
    mix /= max(1e-6, np.abs(mix).max()) / 0.89
    out = OUT_PATH
    with wave.open(out, "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((mix * 32767).astype("<i2").tobytes())
    print("wrote", out, mix.shape[0] / SR)

if __name__ == "__main__":
    main()
