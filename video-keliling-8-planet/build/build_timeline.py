"""Bangun timeline video: penyelarasan kalimat ke audio VO + jadwal scene & SFX.
Output: timeline.json (dibaca renderer & mixer audio)."""
import json, re, subprocess, sys, os
import numpy as np
sys.path.insert(0, os.path.dirname(__file__))
from script_data import SEGMENTS

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
VO = os.path.join(ROOT, "vo")
SR = 16000

# ---------- angka -> kata (untuk estimasi panjang ucapan) ----------
SAT = ["", "satu", "dua", "tiga", "empat", "lima", "enam", "tujuh", "delapan", "sembilan", "sepuluh", "sebelas"]
def terbilang(n):
    n = int(n)
    if n < 12: return SAT[n] or "nol"
    if n < 20: return SAT[n - 10] + " belas"
    if n < 100: return SAT[n // 10] + " puluh " + SAT[n % 10]
    if n < 200: return "seratus " + terbilang(n - 100) if n > 100 else "seratus"
    if n < 1000: return SAT[n // 100] + " ratus " + (terbilang(n % 100) if n % 100 else "")
    if n < 2000: return "seribu " + (terbilang(n - 1000) if n > 1000 else "")
    if n < 1000000: return terbilang(n // 1000) + " ribu " + (terbilang(n % 1000) if n % 1000 else "")
    return "banyak sekali"

def spoken(text):
    def rep(m):
        s = m.group(0)
        if "," in s:
            a, b = s.split(",")
            return terbilang(a) + " koma " + " ".join(terbilang(c) for c in b)
        return terbilang(s.replace(".", ""))
    return re.sub(r"\d+(?:[.,]\d+)?", rep, text)

def split_sentences(p):
    return [s.strip() for s in re.split(r'(?<=[.!?])\s+(?=[A-Z"])', p) if s.strip()]

def weight(s):
    w = len(spoken(s))
    w += 6 * len(re.findall(r"[,:;]", s)) + 10 * len(re.findall(r"\.\.\.", s))
    return w + 8  # jeda antar kalimat

# ---------- audio ----------
def load(path):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", path, "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"],
                         capture_output=True, check=True).stdout
    return np.frombuffer(raw, dtype=np.float32)

def envelope(x, hop=0.01):
    h = int(SR * hop)
    n = len(x) // h
    e = np.sqrt(np.mean(x[: n * h].reshape(n, h) ** 2, axis=1) + 1e-12)
    db = 20 * np.log10(e + 1e-9)
    k = np.ones(15) / 15  # smoothing 150 ms
    return np.convolve(db, k, mode="same"), hop

def align(seg):
    x = load(os.path.join(VO, seg["audio"]))
    dur = len(x) / SR
    env, hop = envelope(x)
    thr = env.max() - 38
    voiced = np.where(env > thr)[0]
    s0, s1 = voiced[0] * hop, voiced[-1] * hop + hop
    sents = []
    for pi, p in enumerate(seg["paras"]):
        for s in split_sentences(p):
            sents.append(dict(text=s, para=pi, w=weight(s)))
    W = sum(s["w"] for s in sents)
    # boundary tiap kalimat: cari lembah energi terdalam di sekitar posisi perkiraan
    acc, prev = 0, s0
    bounds = [s0]
    for i, s in enumerate(sents[:-1]):
        acc += s["w"]
        exp = s0 + (s1 - s0) * acc / W
        lo = max(prev + 0.6, exp - 1.6)
        hi = min(s1 - 0.4, exp + 1.6)
        if hi <= lo:
            t = exp
        else:
            a, b = int(lo / hop), int(hi / hop)
            seg_env = env[a:b]
            dist = np.abs(np.arange(a, b) * hop - exp)
            score = seg_env + 4.0 * dist  # utamakan lembah, tapi jangan jauh dari perkiraan
            t = (a + int(np.argmin(score))) * hop
        bounds.append(t)
        prev = t
    bounds.append(s1)
    for i, s in enumerate(sents):
        s["start"] = round(bounds[i], 3)
        s["end"] = round(bounds[i + 1], 3)
        del s["w"]
    paras = []
    for pi in range(len(seg["paras"])):
        ss = [s for s in sents if s["para"] == pi]
        paras.append(dict(start=ss[0]["start"], end=ss[-1]["end"], nsent=len(ss)))
    out = dict(dur=round(dur, 3), sentences=sents, paras=paras)
    if seg["key"] == "intro":
        # cari 4 jeda terdalam di kalimat terakhir: sebelum "tiga", "dua", "satu", "meluncur"
        last = sents[-1]
        a, b = int((last["start"] + 0.8) / hop), int((last["end"] - 0.3) / hop)
        idx = list(np.argsort(env[a:b]))
        picks = []
        for j in idx:
            tj = (a + j) * hop
            if all(abs(tj - p) > 0.35 for p in picks):
                picks.append(tj)
            if len(picks) == 4:
                break
        out["countdown"] = sorted(round(p + 0.12, 3) for p in picks)
    return out

# ---------- timeline ----------
def main():
    t = 0.0
    scenes, vo, events, captions = [], [], [], []
    TRANS = 1.6
    planet_idx = 0
    countdown = []
    for seg in SEGMENTS:
        al = align(seg)
        key = seg["key"]
        if seg.get("label"):
            scenes.append(dict(kind="transition", key=key, label=seg["label"], start=round(t, 3), end=round(t + TRANS, 3)))
            events.append(dict(t=round(t + 0.05, 3), sfx="whoosh"))
            t += TRANS
        lead = 0.8 if key == "intro" else (0.25 if key.startswith("a") else 0.45)
        sc_start = t
        vo_start = t + lead
        vo.append(dict(file=seg["audio"], t=round(vo_start, 3), dur=al["dur"]))
        beats = []
        for p in al["paras"]:
            beats.append(dict(start=round(vo_start + p["start"] - sc_start, 3), end=round(vo_start + p["end"] - sc_start, 3)))
        beats[0]["start"] = 0.0
        sents = [dict(text=s["text"], para=s["para"], start=round(vo_start + s["start"] - sc_start, 3),
                      end=round(vo_start + s["end"] - sc_start, 3)) for s in al["sentences"]]
        for s in sents:
            captions.append(dict(text=s["text"], start=round(sc_start + s["start"], 3), end=round(sc_start + s["end"] + 0.15, 3)))
        end = vo_start + al["dur"] + 0.5
        timer_start = None
        if seg.get("timer"):
            timer_start = round(end - sc_start, 3)
            for k in range(seg["timer"]):
                events.append(dict(t=round(end + k, 3), sfx="tick"))
            events.append(dict(t=round(end + seg["timer"] - 0.05, 3), sfx="buzz"))
            end += seg["timer"] + 0.2
        if key in ("merkurius", "venus", "bumi", "mars", "jupiter", "saturnus", "uranus", "neptunus"):
            planet_idx += 1
        sc = dict(kind="segment", key=key, start=round(sc_start, 3), end=round(end, 3), beats=beats,
                  sentences=sents, planet_idx=planet_idx, timer_start=timer_start)
        scenes.append(sc)
        # SFX per beat
        for bi, b in enumerate(beats):
            if bi > 0 or key not in ("intro",):
                events.append(dict(t=round(sc_start + b["start"] + 0.25, 3), sfx="pop"))
        if key.startswith("a"):
            events.append(dict(t=round(sc_start + 0.05, 3), sfx="correct"))
        if key == "intro":
            countdown = [round(vo_start + c - sc_start, 3) for c in al["countdown"]]
            for c in countdown[:3]:
                events.append(dict(t=round(sc_start + c, 3), sfx="beep"))
            events.append(dict(t=round(sc_start + countdown[3], 3), sfx="launch"))
        t = end
    # end card
    scenes.append(dict(kind="endcard", key="end", start=round(t, 3), end=round(t + 5.0, 3)))
    events.append(dict(t=round(t + 0.1, 3), sfx="chime"))
    t += 5.0
    events.sort(key=lambda e: e["t"])
    out = dict(fps=30, width=1920, height=1080, duration=round(t, 3), countdown=countdown, scenes=scenes, vo=vo, events=events, captions=captions)
    with open(os.path.join(ROOT, "build", "timeline.json"), "w") as f:
        json.dump(out, f, ensure_ascii=False, indent=1)
    print("duration", round(t, 2), "s =", f"{int(t//60)}:{t%60:04.1f}")
    for sc in scenes:
        print(f'{sc["kind"]:10s} {sc["key"]:10s} {sc["start"]:7.2f} -> {sc["end"]:7.2f}')

if __name__ == "__main__":
    main()
