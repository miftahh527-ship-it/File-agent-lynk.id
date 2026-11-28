# Rakit index.html satu berkas: src.html + data peta (proyeksi dunia.json, garis pantai Natural Earth 1:10m)
import json
P=json.load(open('assets/peta/dunia.json'));D=json.load(open('assets/peta/pantai-ne10m.json'))
peta={k:v for k,v in P.items() if k!='bentuk'}
data='const PETA='+json.dumps(peta)+';\nconst PANTAI='+json.dumps(D['pantai'])+';\nconst PULAU='+json.dumps(D['pulau'])+';\n'
open('index.html','w').write(open('src.html').read().replace('/*PETADATA*/',data))
