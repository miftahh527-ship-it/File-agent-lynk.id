import re, json, subprocess, sys, pathlib
sys.path.insert(0, str(pathlib.Path(__file__).parent))
import vo
P1 = [
 ('b1-1','Tangan ini dilukis di dinding gua hampir 68.000 tahun yang lalu! Tahukah kamu di mana? Di Indonesia!'),
 ('b1-2','Dulu, manusia tinggal di gua. Mereka belum bisa bertani dan belum bisa menulis. Sekarang, kita bisa mengirim pesan ke seluruh dunia hanya dalam satu detik! Bagaimana bisa begitu?'),
 ('b1-3','Ayo, naik mesin waktu! Kita akan menempuh perjalanan 300.000 tahun hanya dalam 15 menit. Siap? Kita berangkat!'),
 ('b1-4','Perhentian pertama: Afrika, sekitar 300.000 tahun yang lalu. Di Jebel Irhoud, Maroko, ilmuwan menemukan fosil tertua dari spesies kita, yaitu Homo sapiens. Artinya, "manusia bijak". Wajah mereka sudah mirip dengan kita. Kalau mereka memakai topi dan berjalan di jalan raya hari ini, mungkin kita tidak sadar bahwa mereka manusia purba!'),
 ('b1-5','Pada zaman itu, kita punya "saudara jauh", seperti Neanderthal di Eropa. Indonesia juga punya kisah penting! Fosil Homo erectus ditemukan di Sangiran dan Trinil, Jawa. Lalu, Homo floresiensis yang bertubuh mungil ditemukan di Liang Bua, Flores. Sekarang, semua spesies manusia lain sudah punah. Yang tersisa hanya kita.'),
]
SH = [('s-1','Lukisan gua tertua di dunia... ada di Indonesia! Di Gua Liang Metanduno, Pulau Muna, Sulawesi Tenggara, ada cap tangan merah yang berumur paling sedikit 67.800 tahun! Caranya? Tangan ditempel ke dinding, lalu pewarna merah disemburkan di sekelilingnya. Jadi, seniman tertua di dunia ada di Indonesia! Mau tahu perjalanan 300.000 tahun manusia? Tonton versi lengkapnya di kanal ini!')]
ALL = SH + P1 + [(i, c if c else re.sub(r'\[[^\]]*\]\s*','',s).strip()) for i,s,c in vo.CLIPS]
AUD = pathlib.Path(__file__).parent.parent/'audio-semua'
MAX = 84
def chunks(text, MAX=84):
    sents = [x.strip() for x in re.split(r'(?<=[.!?])["”]?\s+', text) if x.strip()]
    out=[]
    for s in sents:
        n = -(-len(s)//MAX)
        while n > 1:
            target = len(s)//n; cands=[m.start()+1 for m in re.finditer(r'[,:] ', s)]
            cut = min(cands, key=lambda c: abs(c-target)) if cands else -1
            if cut < 0 or abs(cut-target) > target*.45:
                sp=[m.start() for m in re.finditer(' ', s)]; cut=min(sp, key=lambda c: abs(c-target))
            out.append(s[:cut].strip()); s=s[cut:].strip(); n = -(-len(s)//MAX)
        if out and len(out[-1]) + len(s) < 46: out[-1] += ' ' + s
        else: out.append(s)
    return out
def speech(path):
    d = float(subprocess.run(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',str(path)],capture_output=True,text=True).stdout)
    err = subprocess.run(['ffmpeg','-hide_banner','-i',str(path),'-af','silencedetect=n=-30dB:d=0.18','-f','null','-'],capture_output=True,text=True).stderr
    st=[float(x) for x in re.findall(r'silence_start: ([\d.]+)',err)]; en=[float(x) for x in re.findall(r'silence_end: ([\d.]+)',err)]
    sil=list(zip(st,en)); segs=[]; t=0.0
    for a,b in sil:
        if a>t+0.05: segs.append((t,a))
        t=b
    if d>t+0.05: segs.append((t,d))
    return d, segs, sil
data={}
for cid,text in ALL:
    d,segs,sil = speech(AUD/f'{cid}.mp3')
    cs = chunks(text, 40 if cid.startswith('s-') else 84); tot=sum(len(c) for c in cs); sp=sum(b-a for a,b in segs)
    def at(frac):  # fraksi waktu-bicara → waktu nyata
        k=frac*sp
        for a,b in segs:
            if k <= b-a: return a+k
            k -= b-a
        return segs[-1][1]
    bounds=[0.0]; acc=0
    for c in cs[:-1]:
        acc+=len(c); t=at(acc/tot)
        # tempel ke tengah jeda terdekat bila dekat
        best=min(sil, key=lambda s: abs((s[0]+s[1])/2-t), default=None)
        if best and abs((best[0]+best[1])/2-t) < .6: t=(best[0]+best[1])/2
        bounds.append(t)
    start=segs[0][0] if segs else 0; end=segs[-1][1] if segs else d
    bounds[0]=max(0,start-.1); bounds.append(end+.25)
    data[cid]={'dur':round(d,3),'cap':[[round(bounds[i],2),round(bounds[i+1],2),cs[i]] for i in range(len(cs))]}
out = pathlib.Path(__file__).parent.parent/'lib'/'captions.js'
out.write_text('/* dibuat oleh naskah/caps.py — teks subtitle + durasi tiap klip VO */\nwindow.VODATA='+json.dumps(data,ensure_ascii=False,indent=0)+';\n')
for k,v in data.items(): print(k, v['dur'], len(v['cap']), max(len(c[2]) for c in v['cap']))
