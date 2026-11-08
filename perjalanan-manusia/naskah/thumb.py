"""Rakit thumbnail/<long|short>.js + lib → thumbnail/thumbnail-<nama>.html (dipotret oleh scripts/thumbnail.py)."""
import pathlib
R=pathlib.Path(__file__).resolve().parent.parent
head=(R/'lib/_head.html').read_text();libs='\n'.join((R/'lib'/n).read_text() for n in ['captions.js','peta-data.js','inti.js','benda.js'])
for name,w in [('long',1280),('short',1080)]:
    vw,vh=(1920,1080) if name=='long' else (1080,1920)
    hh=head.replace('__TITLE__','Thumbnail '+name).replace('width:1920px;height:1080px',f'width:{vw}px;height:{vh}px').replace('width="1920" height="1080" viewBox="0 0 1920 1080"',f'width="{vw}" height="{vh}" viewBox="0 0 {vw} {vh}"')
    hh=hh.replace('#stage{position:absolute;left:50%;top:50%;',f'#stage{{position:absolute;left:0;top:0;transform-origin:0 0 !important;transform:scale({w/vw}) !important;')
    pre='' if name=='long' else '<script>window.STAGE={w:1080,h:1920};</script>'
    (R/f'thumbnail/thumbnail-{name}.html').write_text(hh+pre+'<script>\n'+libs+'\n'+(R/f'thumbnail/{name}.js').read_text()+'\n</script></body></html>')
print('ok')
