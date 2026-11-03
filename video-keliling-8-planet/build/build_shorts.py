"""Pecah timeline video panjang jadi 10 Shorts 9:16 (sesuai 'Peta pemecahan Shorts' di naskah)."""
import json, os, copy
HERE = os.path.dirname(os.path.abspath(__file__))
TL = json.load(open(os.path.join(HERE, "timeline.json")))
SC = {s["key"]: s for s in TL["scenes"] if s["kind"] == "segment"}
VO = {v["file"]: v for v in TL["vo"]}
SEGFILE = {"matahari": "02_matahari.mp3", "merkurius": "03_merkurius.mp3", "venus": "04_venus.mp3", "bumi": "05_bumi.mp3",
           "mars": "06_mars.mp3", "jupiter": "07_jupiter.mp3", "saturnus": "08_saturnus.mp3", "uranus": "09_uranus.mp3",
           "neptunus": "10_neptunus.mp3", "q1": "11_kuis_q1.mp3", "a1": "12_q1ans.mp3", "q2": "13_q2.mp3", "a2": "14_q2ans.mp3",
           "q3": "15_q3.mp3", "a3": "16_q3ans.mp3"}
# (nomor, slug, judul, segmen, jumlah beat dipakai: None = semua; beat terakhir LONG-ONLY dibuang)
SHORTS = [
    (1, "matahari", "1,3 Juta Bumi Muat di Matahari!", ["matahari"], 4),
    (2, "merkurius", "Siang Membara, Malam Membeku", ["merkurius"], 4),
    (3, "venus", "1 Hari Lebih Lama dari 1 Tahun?!", ["venus"], None),
    (4, "bumi", "Satu-satunya Planet Berpenghuni", ["bumi"], None),
    (5, "mars", "Mars Itu Berkarat?", ["mars"], 4),
    (6, "jupiter", "Badai Lebih Besar dari Bumi", ["jupiter"], None),
    (7, "saturnus", "Planet yang Bisa Mengapung!", ["saturnus"], None),
    (8, "uranus", "Planet yang Rebahan", ["uranus"], None),
    (9, "neptunus", "Planet Paling Berangin", ["neptunus"], None),
    (10, "kuis", "Kuis Planet, Berapa Skormu?", ["q1", "a1", "q2", "a2", "q3", "a3"], None),
]
BADGE = {"matahari": "☀️ MATAHARI", "kuis": "🧠 KUIS"}
CTA = 3.5

def build(num, slug, title, keys, nbeats):
    scenes, vo, caps, events = [], [], [], []
    t = 0.0
    for key in keys:
        sc = copy.deepcopy(SC[key]); g0 = sc["start"]
        end = sc["beats"][nbeats]["start"] + 0.35 if nbeats else sc["end"] - sc["start"]
        if nbeats: sc["beats"] = sc["beats"][:nbeats]; sc["sentences"] = [s for s in sc["sentences"] if s["para"] < nbeats]
        sc["start"], sc["end"] = round(t, 3), round(t + end, 3)
        scenes.append(sc)
        v = VO[SEGFILE[key]]; vt = v["t"] - g0
        item = dict(file=v["file"], t=round(t + vt, 3), dur=v["dur"])
        if nbeats: item["trim"] = round(SC[key]["beats"][nbeats]["start"] - vt, 3)
        vo.append(item)
        for c in TL["captions"]:
            if g0 <= c["start"] < g0 + end - 0.4: caps.append(dict(text=c["text"], start=round(c["start"] - g0 + t, 3), end=round(min(c["end"], g0 + end) - g0 + t, 3)))
        for e in TL["events"]:
            if g0 <= e["t"] < g0 + end: events.append(dict(t=round(e["t"] - g0 + t, 3), sfx=e["sfx"]))
        t += end
    if slug != "kuis":
        scenes.append(dict(kind="cta", key="cta", start=round(t, 3), end=round(t + CTA, 3)))
        events += [dict(t=round(t + 0.05, 3), sfx="whoosh"), dict(t=round(t + 1.6, 3), sfx="pop"), dict(t=round(t + 1.7, 3), sfx="chime")]
        t += CTA
    else:
        t += 0.6; scenes[-1]["end"] = round(t, 3)
    return dict(num=num, slug=slug, title=title, badge=BADGE.get(slug), fps=30, duration=round(t, 3), scenes=scenes, vo=vo,
                captions=caps, events=sorted(events, key=lambda e: e["t"]), countdown=[])

os.makedirs(os.path.join(HERE, "shorts"), exist_ok=True)
for s in SHORTS:
    d = build(*s)
    json.dump(d, open(os.path.join(HERE, "shorts", f"short{d['num']:02d}_{d['slug']}.json"), "w"), ensure_ascii=False, indent=1)
    print(f"#{d['num']:2d} {d['slug']:10s} {d['duration']:6.2f}s  trim={[v.get('trim') for v in d['vo']]}")
