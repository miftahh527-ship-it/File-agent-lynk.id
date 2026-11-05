/* ============ BENDA BERSAMA (dipakai semua bab) ============ */
lg('skyD',[[0,'#2E3550'],[1,'#56607E']]);lg('skyN',[[0,'#1F2438'],[1,'#3B4462']]);lg('sea',[[0,'#7FB2C4'],[1,'#5B8DB8']]);
lg('desert',[[0,'#A9D0DB'],[.7,'#F0E2C0'],[1,'#F3D9A6']]);lg('ice',[[0,'#C9DDE6'],[1,'#EEF4F6']]);lg('tunnel',[[0,'#262A40'],[1,'#3A3F5E']]);
lg('board',[[0,'#4D5378'],[1,'#3E4366']]);lg('smog',[[0,'#8E8E94'],[1,'#C9C3B8']]);
function bgSky(p,id='skyA'){return R(-900,-900,3800,2900,`url(#${id})`,0,p);}
function bgGround(p,gy,top=C.lime2,base=C.sand){R(-900,gy,3800,900,base,0,p);R(-900,gy-10,3800,24,top,0,p);}
function bgHills(p,b,col=C.mint,op=.7){return PA(`M -900 ${b} C -400 ${b-120} 0 ${b-40} 500 ${b-110} C 1000 ${b-170} 1500 ${b-60} 2000 ${b-130} C 2400 ${b-170} 2700 ${b-80} 2900 ${b-100} L 2900 ${b+400} L -900 ${b+400} Z`,col,p,{opacity:op});}
function roundTree(p,x,gy,s=1,c1=C.mint2,c2=C.mint){R(x-14*s,gy-260*s,28*s,260*s,'#6E5A48',10,p);const g=G({},p),j=J(g,x,gy-250*s);CI(0,-50*s,120*s,c1,g);CI(-80*s,10*s,84*s,c2,g);CI(84*s,0,92*s,c2,g);return j;}
function hut(p,x,gy,s=1,wall='#C9A47A',roof='#8A6A4A'){const g=G({transform:`translate(${x},${gy}) scale(${s})`},p);R(-110,-150,220,150,wall,8,g);PA('M -150 -140 L 0 -260 L 150 -140 Z',roof,g);R(-30,-90,60,90,'#5E4A3A',6,g);return g;}
function house(p,x,gy,s=1,wall=C.paper,roof=C.coral){const g=G({transform:`translate(${x},${gy}) scale(${s})`},p);R(-120,-180,240,180,wall,6,g);PA('M -150 -170 L 0 -290 L 150 -170 Z',roof,g);R(-34,-100,68,100,C.indigo2,6,g);R(50,-140,50,44,C.sky,4,g);R(-100,-140,50,44,C.sky,4,g);return g;}
/* label diegetik: papan nama 1–2 baris, dimunculkan dengan pop() */
function tag(p,x,y,l1,l2='',{w=null,c1=C.ink,c2=C.mint2,bg=C.white,s1=40,s2=32}={}){const g=G({},p),j=J(g,x,y);const ww=w||Math.max(l1.length*s1*.56,l2.length*s2*.56)+60,hh=l2?s1+s2+44:s1+36;
  R(-ww/2,-hh/2,ww,hh,bg,16,g);TX(0,l2?-hh/2+s1+12:s1*.36,l1,s1,c1,g,{'font-weight':700});if(l2)TX(0,hh/2-18,l2,s2,c2,g);return j;}
function stamp(p,x,y,txt,col=C.coral,size=44,rot=-8){const g=G({},p),j=J(g,x,y);const w=txt.length*size*.6+60;R(-w/2,-size*.9,w,size*1.8,'none',14,g,{stroke:col,'stroke-width':7,transform:`rotate(${rot})`});TX(0,size*.35,txt,size,col,g,{'font-weight':700,transform:`rotate(${rot})`});return j;}
/* peta dunia ekuirektangular (lon,lat) → kotak w×h */
const CONT={na:[[-165,65],[-140,70],[-95,72],[-65,62],[-55,50],[-70,43],[-80,32],[-80,25],[-90,29],[-97,24],[-97,18],[-88,15],[-80,8],[-84,10],[-105,20],[-117,32],[-125,48],[-140,60],[-165,60]],
  sa:[[-80,10],[-60,10],[-50,0],[-35,-6],[-40,-22],[-58,-38],[-68,-55],[-74,-45],[-70,-18],[-81,-5]],
  eu:[[-10,36],[-9,44],[-2,48],[5,52],[10,56],[18,60],[25,70],[40,68],[45,50],[40,45],[28,41],[22,38],[15,38],[10,44],[3,42],[-5,36]],
  af:[[-17,15],[-16,24],[-10,30],[-5,36],[10,37],[32,31],[34,28],[43,12],[51,12],[40,-15],[33,-26],[20,-35],[12,-17],[9,4],[-8,5],[-15,10]],
  as:[[40,68],[70,75],[110,77],[140,72],[178,67],[160,58],[140,52],[130,42],[122,38],[122,25],[108,20],[106,10],[100,14],[100,4],[98,16],[92,22],[88,22],[80,14],[77,8],[72,20],[62,25],[57,26],[52,15],[44,12],[34,28],[36,36],[28,41],[40,45],[45,50]],
  au:[[114,-22],[122,-17],[131,-12],[137,-12],[142,-11],[146,-19],[153,-27],[150,-37],[140,-38],[130,-32],[115,-34]],
  uk:[[-5,50],[1,51],[0,54],[-3,58],[-6,56],[-5,53]],jp:[[130,31],[136,34],[141,38],[142,44],[140,41],[134,35]],
  mg:[[44,-25],[47,-25],[50,-15],[49,-12],[44,-17]],
  su:[[95,5],[98,4],[106,-4],[105,-6],[101,-2],[95,3]],jv:[[105,-6],[111,-6.5],[114,-7.5],[110,-8],[106,-7]],
  bo:[[109,1],[112,3],[117,7],[119,5],[118,1],[116,-3],[111,-3],[109,-1]],sl:[[119,1],[124,1.5],[121,0],[123,-1],[122,-5],[120,-5],[120,-2]],
  pp:[[131,-1],[138,-2],[146,-6],[150,-10],[141,-9],[137,-5],[132,-3]]};
function worldMap(p,x,y,w,h,{land=C.lime,sea='url(#sea)',grid=true}={}){const g=G({transform:`translate(${x},${y})`},p);R(0,0,w,h,sea,28,g);
  if(grid)for(let i=1;i<6;i++){LN(`M ${w*i/6} 20 L ${w*i/6} ${h-20}`,C.white,2,g,{opacity:.15});LN(`M 20 ${h*i/6} L ${w-20} ${h*i/6}`,C.white,2,g,{opacity:.15});}
  const P=(lo,la)=>[((lo+180)/360)*w,((80-la)/140)*h];const m={g,P,pt:(lo,la)=>{const[a,b]=P(lo,la);return[x+a,y+b];},parts:{}};
  for(const k in CONT){const d='M '+CONT[k].map(([a,b])=>P(a,b).map(v=>v.toFixed(1)).join(' ')).join(' L ')+' Z';m.parts[k]=PA(d,land,g,{stroke:land,'stroke-width':10,'stroke-linejoin':'round'});}return m;}
function mapBox(p,x,y,w,h,[lo0,lo1,la0,la1],keys=null,{land=C.lime,sea='url(#sea)'}={}){const g=G({transform:`translate(${x},${y})`},p);R(0,0,w,h,sea,28,g);
  const cp=N('clipPath',{id:'mb'+x+'_'+y},defs);R(0,0,w,h,null,28,cp);const inner=G({'clip-path':`url(#mb${x}_${y})`},g);
  const P=(lo,la)=>[((lo-lo0)/(lo1-lo0))*w,((la1-la)/(la1-la0))*h];const m={g,inner,P,pt:(lo,la)=>{const[a,b]=P(lo,la);return[x+a,y+b];},parts:{}};
  for(const k of (keys||Object.keys(CONT))){const d='M '+CONT[k].map(([a,b])=>P(a,b).map(v=>v.toFixed(1)).join(' ')).join(' L ')+' Z';m.parts[k]=PA(d,land,inner,{stroke:land,'stroke-width':14,'stroke-linejoin':'round'});}return m;}
const capT=(T,id,i)=>T[id]+VODATA[id].cap[i][0];
function pin(p,x,y,col=C.coral,s=1){const g=G({},p),j=J(g,x,y);G({},g);PA(`M 0 0 C ${-30*s} ${-40*s} ${-30*s} ${-76*s} 0 ${-80*s} C ${30*s} ${-76*s} ${30*s} ${-40*s} 0 0 Z`,col,g);CI(0,-52*s,12*s,C.white,g);return j;}
/* garis rute yang menggambar dirinya */
function route(p,d,col=C.coral,w=8,dash=true){const n=PA(d,null,p,{stroke:col,'stroke-width':w,'stroke-linecap':'round','stroke-linejoin':'round'});const L=n.getTotalLength();n.setAttribute('stroke-dasharray',L);n.setAttribute('stroke-dashoffset',L);n._L=L;return n;}
const drawOn=(n,at,dur=1.2,ease='power1.inOut')=>tl.to(n,{attr:{'stroke-dashoffset':0},duration:dur,ease},at);
function ship(p,x,y,s=1,sail=C.paper,hull='#7A5A44'){const g=G({},p),b=G({transform:`translate(${x},${y}) scale(${s})`},g);const bob=J(G({},b));PA('M -120 0 L 120 0 L 90 50 L -90 50 Z',hull,bob.el);LN('M 0 0 L 0 -200',C.ink,8,bob.el);PA('M 6 -190 C 90 -150 90 -60 6 -20 Z',sail,bob.el);PA('M -6 -170 C -70 -130 -70 -70 -6 -40 Z',sh(sail,.9),bob.el);return {g,bob};}
function bob(sh_,at,amp=6,dur=1.2){tl.to(sh_.bob,{y:amp,r:2,duration:dur,yoyo:true,repeat:-1,ease:'sine.inOut',onUpdate:sh_.bob.apply},at);}
function waves(p,y,col=C.white,n=10,op=.5){const g=G({},p);for(let i=0;i<n;i++)LN(`M ${-600+i*360} ${y+(i%2)*30} c 30 -16 60 -16 90 0 c 30 16 60 16 90 0`,col,6,g,{opacity:op});return g;}
function stars(p,n=40,h=700){const out=[];for(let i=0;i<n;i++)out.push(CI(-700+rnd(i+300)*3300,-400+rnd(i+400)*h,2+rnd(i+500)*3,C.paper,p,{opacity:.4+rnd(i)*.5}));return out;}
function twinkle(list,at){list.forEach((s,i)=>tl.to(s,{keyframes:{opacity:[.9,.2,.9]},duration:1.2+rnd(i)*1.6,repeat:-1,ease:'none'},at+rnd(i+9)));}
function sack(p,x,y,s=1,col='#C9A47A'){const g=G({transform:`translate(${x},${y}) scale(${s})`},p);PA('M -40 0 C -50 -50 -30 -80 -14 -86 L 14 -86 C 30 -80 50 -50 40 0 Z',col,g);LN('M -16 -80 L 16 -80',sh(col,.7),6,g);return g;}
/* panggung pembuka tiap bab: kapsul menembus terowongan waktu, layar = tahun tujuan + nama bab */
function bumper(year,label){const sc=scene('terowongan');const p=sc.g;R(-900,-900,3800,2900,'url(#tunnel)',0,p);
  const rings=[];for(let i=0;i<8;i++)rings.push(CI(960,540,60,'none',p,{stroke:i%2?C.lilac:C.mint,'stroke-width':10,opacity:0}));
  const streaks=[];for(let i=0;i<22;i++){const a=i*2.39,r=120+rnd(i)*80;streaks.push(LN(`M ${960+Math.cos(a)*r} ${540+Math.sin(a)*r} l ${Math.cos(a)*90} ${Math.sin(a)*90}`,C.paper,5,p,{opacity:0}));}
  const k=makeCapsule(p,960,820);k.sd.setAttribute('opacity',0);[].forEach.call(k.body.el.querySelectorAll('path'),()=>{});
  show(k.faces,0,.01);k.num.textContent=year;k.num.setAttribute('fill',C.sun);k.sub.textContent=label;k.sub.setAttribute('opacity',1);k.sub.setAttribute('font-size',26);
  rings.forEach((r,i)=>tl.fromTo(r,{attr:{r:40},opacity:0},{keyframes:{opacity:[0,.8,0]},attr:{r:1300},duration:1.6,ease:'power1.in',repeat:-1,immediateRender:false},i*.2));
  streaks.forEach((s,i)=>{const a=i*2.39;tl.fromTo(s,{x:0,y:0,opacity:0},{keyframes:{opacity:[0,.8,0]},x:Math.cos(a)*900,y:Math.sin(a)*900,duration:.9,repeat:-1,ease:'power2.in',immediateRender:false},rnd(i)*.9);});
  tl.to(k.body,{r:3,y:-14,duration:.4,yoyo:true,repeat:-1,ease:'sine.inOut',onUpdate:k.body.apply},0);show(k.flame,0,.01);tl.to(k.flame,{keyframes:{opacity:[1,.6,1]},duration:.12,repeat:-1},0);
  k.lights.forEach((l,i)=>tl.to(l,{keyframes:{opacity:[1,.2,1]},duration:.5,repeat:-1},i*.07));
  tl.set(p,{display:'block'},0);Object.assign(sc.cam,{x:960,y:560,z:1.35});sc.apply();cam(sc,0,960,520,1.5,3.2,'power1.inOut');
  sfx('dial',.15,.4);sfx('luncur',2.55,.45);return sc;}
function capStart(){/* cadangan */}

/* FOTO ASLI + SUMBER: bingkai putih, foto, lalu label & kredit di bawah foto (bagian dari bingkai) */
window.IMGWAIT=window.IMGWAIT||[];const FOTO=AUD.replace('audio-semua','foto');
function photo(p,x,y,w,file,ar,l1,l2,{rot=-2,s1=36,s2=30}={}){const h=w/ar,g=G({},p),j=J(g,x,y);const inner=G({transform:`rotate(${rot})`},g);
  const H=h+40+s1+s2+40;R(-w/2-20+10,-h/2-20+14,w+40,H,C.night,14,inner,{opacity:.35});R(-w/2-20,-h/2-20,w+40,H,C.paper,14,inner);
  const href=FOTO+file;const im=N('image',{x:-w/2,y:-h/2,width:w,height:h,preserveAspectRatio:'xMidYMid slice'},inner);im.setAttributeNS(XL,'href',href);im.setAttribute('href',href);
  IMGWAIT.push(new Promise(r=>{const i=new Image();i.onload=i.onerror=()=>r();i.src=href;}));
  TX(0,h/2+20+s1,l1,s1,C.ink,inner,{'font-weight':700});TX(0,h/2+30+s1+s2,l2,s2,C.mint2,inner,{'font-weight':600});return j;}
