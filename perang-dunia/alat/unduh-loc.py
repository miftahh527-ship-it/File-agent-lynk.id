# Unduh foto arsip dari Library of Congress (master TIFF -> JPG lebar 1920) + catat ke foto/SUMBER.md.
# Hanya item berstatus "No known restrictions". Jalankan dari folder alat/: python3 unduh-loc.py
import json, os, subprocess, sys, time, urllib.request
UA = {'User-Agent': 'ClaudeCode-media-research/1.0 (https://claude.ai/code; educational video)'}
FOTO = {  # nama berkas -> id item loc.gov
  'franz-ferdinand.jpg': '2014687642', 'dreadnought.jpg': '2014696981', 'kitchener.jpg': '93517736',
  'kereta-1914.jpg': '2014697213', 'parit.jpg': '2005697186', 'tank.jpg': '2014703287',
  'somme.jpg': '2014707066', 'gencatan.jpg': '2017682944', 'versailles.jpg': '2016646068',
  'liga.jpg': '97518251', 'antrean.jpg': '93508985', 'pearl-harbor.jpg': '92500933',
  'dday.jpg': '94505434', 'nagasaki.jpg': '2002722137', 'hiroshima-awan.jpg': '2017659326',
}
DIR = os.path.abspath('../foto'); os.makedirs(DIR, exist_ok=True); CATAT = os.path.join(DIR, 'SUMBER.md')
def get(u, n=5):
  for k in range(n):
    try: return urllib.request.urlopen(urllib.request.Request(u, headers=UA), timeout=180).read()
    except Exception as e:
      if k == n - 1: raise
      print('  ulang', e); time.sleep(20 * (k + 1))
for nama, iid in FOTO.items():
  out = os.path.join(DIR, nama)
  if os.path.exists(out): print('ada', nama); continue
  d = json.loads(get(f'https://www.loc.gov/item/{iid}/?fo=json')); it = d['item']
  hak = it.get('rights_advisory') or ''; hak = hak[0] if isinstance(hak, list) else hak
  if 'no known restrictions' not in hak.lower(): print('LEWATI', nama, hak[:80]); continue
  files = [x for r in d.get('resources', []) for f in r.get('files', []) for x in f]
  tif = [x for x in files if x.get('mimetype') == 'image/tiff']
  jpg = sorted([x for x in files if x.get('mimetype') == 'image/jpeg'], key=lambda x: x.get('width') or 0)
  src = (tif or jpg)[-1]['url'] if (tif or jpg) else None
  if not src: print('TANPA GAMBAR', nama); continue
  tmp = out + '.src'; open(tmp, 'wb').write(get(src))
  subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', tmp, '-vf', "scale='min(1920,iw)':-2", '-q:v', '3', out], check=True); os.remove(tmp)
  judul = it.get('title', '').replace('|', '/')[:90]
  if not os.path.exists(CATAT): open(CATAT, 'w').write('# Sumber foto\n\n| Berkas | Judul | Lisensi | Pembuat |\n|---|---|---|---|\n')
  open(CATAT, 'a').write(f"| {nama} | [{judul}](https://www.loc.gov/item/{iid}/) — Library of Congress | No known restrictions | {', '.join(it.get('contributor_names') or [])[:60] or '–'} |\n")
  print('ok', nama, os.path.getsize(out)); time.sleep(3)
