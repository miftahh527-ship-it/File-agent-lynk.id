"""Gabung semua bagian → perjalanan-manusia.mp4 (+ backsound yang merunduk di bawah VO), lalu tempel intro kanal."""
import subprocess, pathlib, json
R=pathlib.Path(__file__).resolve().parent.parent
B=['01-pembuka-bab1','02-bab2','03-bab3','04-bab4','05-bab5','06-bab6','07-bab7','08-bab8','09-penutup']
dur=lambda f: float(subprocess.run(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',str(f)],capture_output=True,text=True).stdout)
files=[R/'bagian'/b/f'{b}.mp4' for b in B]
lst=R/'naskah'/'_concat.txt';lst.write_text(''.join(f"file '{f}'\n" for f in files))
raw=R/'naskah'/'_gabung.mp4'
subprocess.run(['ffmpeg','-v','error','-y','-f','concat','-safe','0','-i',str(lst),'-c','copy',str(raw)],check=True)
D=dur(raw); starts=[];t=0
for f in files: starts.append(t); t+=dur(f)
music=R/'audio-semua'/'music.mp3'
# musik: diulang dengan sambungan silang 3 dtk, volume rendah, merunduk (sidechain) saat ada suara, fade masuk/keluar
fc=(f"[1:a]aloop=loop=-1:size=2e9,atrim=0:{D:.2f},asetpts=N/SR/TB,volume=0.30,afade=t=in:d=2,afade=t=out:st={D-5:.2f}:d=5[m];"
    f"[0:a]asplit=2[v][k];[m][k]sidechaincompress=threshold=0.03:ratio=8:attack=40:release=600[md];"
    f"[v][md]amix=inputs=2:duration=first:normalize=0,loudnorm=I=-15:TP=-1.5:LRA=11[a]")
out=R/'perjalanan-manusia.mp4'
subprocess.run(['ffmpeg','-v','error','-y','-i',str(raw),'-stream_loop','-1','-i',str(music),'-filter_complex',fc,'-map','0:v','-map','[a]','-c:v','copy','-c:a','aac','-b:a','192k','-ar','48000','-movflags','+faststart',str(out)],check=True)
json.dump({'durasi':D,'mulai':dict(zip(B,starts))},open(R/'naskah'/'_waktu.json','w'),indent=1)
print('durasi',round(D,2));[print(b,round(s,2)) for b,s in zip(B,starts)]
