import json,sys,math
NE,OUT=sys.argv[1],sys.argv[2]
def rings(fn,flt=None):
    d=json.load(open(f'{NE}/{fn}.geojson'));out=[]
    for f in d['features']:
        if flt and not flt(f['properties']):continue
        g=f['geometry'];polys=g['coordinates'] if g['type']=='MultiPolygon' else [g['coordinates']]
        for poly in polys: out.append(poly[0])   # cincin luar saja
    return out
def dp(pts,eps):
    if len(pts)<3:return pts
    st=[(0,len(pts)-1)];keep={0,len(pts)-1}
    while st:
        a,b=st.pop();ax,ay=pts[a];bx,by=pts[b];dx,dy=bx-ax,by-ay;L=math.hypot(dx,dy) or 1e-12;best,bi=0,-1
        for i in range(a+1,b):
            px,py=pts[i];dd=abs(dy*(px-ax)-dx*(py-ay))/L
            if dd>best:best,bi=dd,i
        if best>eps:keep.add(bi);st+=[(a,bi),(bi,b)]
    return [pts[i] for i in sorted(keep)]
def area(r):return abs(sum(r[i][0]*r[i+1][1]-r[i+1][0]*r[i][1] for i in range(len(r)-1)))/2
def bbox(r):xs=[p[0] for p in r];ys=[p[1] for p in r];return min(xs),max(xs),min(ys),max(ys)
def hit(r,b):x0,x1,y0,y1=bbox(r);return not(x1<b[0] or x0>b[1] or y1<b[2] or y0>b[3])
def pack(rs,eps,minA,dec):
    o=[]
    for r in rs:
        if area(r)<minA:continue
        m=max(range(len(r)),key=lambda i:(r[i][0]-r[0][0])**2+(r[i][1]-r[0][1])**2)
        s=dp(r[:m+1],eps)+dp(r[m:],eps)[1:]
        if len(s)<4:continue
        o.append([v for p in s for v in (round(p[0],dec),round(p[1],dec))])
    return o
NUS=[90,152,-12,10]
dunia=[r for r in rings('ne_50m_land') if not hit(r,NUS)]
nus=[r for r in rings('ne_10m_land') if hit(r,NUS)]
afr=rings('ne_110m_admin_0_countries',lambda p:p.get('CONTINENT')=='Africa')
data={'dunia':pack(dunia,.12,.15,2),'nusantara':pack(nus,.03,.01,2),'afrika':pack(afr,.15,.05,2),'nusBox':NUS}
s=json.dumps(data,separators=(',',':'))
open(OUT,'w').write('/* Peta: Natural Earth (naturalearthdata.com), domain publik. Diolah naskah/peta.py: land 50m (dunia), land 10m (Nusantara), negara Afrika 110m. Format: [lon,lat,lon,lat,...] per pulau. */\nconst PETA='+s+';\n')
print({k:(len(v),sum(len(x) for x in v)//2) for k,v in data.items() if k!='nusBox'},len(s))
