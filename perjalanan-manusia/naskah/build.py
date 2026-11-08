"""Rakit tiap bagian/<nn>/adegan.js + lib/* jadi SATU index.html (CSS/JS inline, bisa dibuka file://)."""
import pathlib, sys
R = pathlib.Path(__file__).resolve().parent.parent
TITLES = {'01-pembuka-bab1':'Pembuka + Bab 1','02-bab2':'Bab 2 — Hidup berpindah','03-bab3':'Bab 3 — Revolusi Pertanian','04-bab4':'Bab 4 — Kota & tulisan',
 '05-bab5':'Bab 5 — Kerajaan besar & Nusantara','06-bab6':'Bab 6 — Mesin cetak & penjelajahan','07-bab7':'Bab 7 — Revolusi Industri','08-bab8':'Bab 8 — Abad ke-20 sampai hari ini','09-penutup':'Penutup & kuis'}
head = (R/'lib/_head.html').read_text()
libs = [(R/'lib'/n).read_text() for n in ['captions.js','peta-data.js','inti.js','benda.js']]
kontrol = (R/'lib/kontrol.js').read_text()
for d in sorted((R/'bagian').iterdir()):
    a = d/'adegan.js'
    if not a.exists() or (len(sys.argv)>1 and d.name not in sys.argv[1:]): continue
    html = head.replace('__TITLE__', 'Perjalanan 300.000 Tahun — '+TITLES.get(d.name,d.name))
    html += '<script>\n' + '\n'.join(libs) + '\n</script>\n<script>\n' + a.read_text() + '\n</script>\n<script>\n' + kontrol + '\n</script>\n</body>\n</html>\n'
    (d/'index.html').write_text(html); print('ok', d.name)

# ---- Short 9:16 ----
sd = R/'short'
if (sd/'adegan.js').exists() and (len(sys.argv)==1 or 'short' in sys.argv[1:]):
    h = head.replace('__TITLE__','Short — Lukisan gua tertua di dunia').replace('width:1920px;height:1080px','width:1080px;height:1920px')
    h = h.replace('width="1920" height="1080" viewBox="0 0 1920 1080"','width="1080" height="1920" viewBox="0 0 1080 1920"')
    h = h.replace('#cap{position:absolute;left:50%;bottom:46px;','#cap{position:absolute;left:50%;bottom:430px;font-size:58px !important;')
    h = h.replace('max-width:1560px;','max-width:900px;')
    pre = '<script>window.STAGE={w:1080,h:1920};window.AUDBASE="../audio-semua/";</script>\n'
    html = h + pre + '<script>\n' + '\n'.join(libs) + '\n</script>\n<script>\n' + (sd/'adegan.js').read_text() + '\n</script>\n<script>\n' + kontrol + '\n</script>\n</body>\n</html>\n'
    (sd/'index.html').write_text(html); print('ok short')
