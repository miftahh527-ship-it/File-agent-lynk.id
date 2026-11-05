/* SHORT 9:16 — Lukisan gua tertua di dunia ada di Indonesia (±29 dtk, tanpa intro) */
const T=voPlan(['s-1'],.25,0);const c=i=>capT(T,'s-1',i);

/* ---------- S1 GUA: cap tangan langsung menyala (hook 0–2 dtk) ---------- */
const S1=scene('gua');{const p=S1.g;R(-800,-800,2700,3500,'url(#caveG)',0,p);for(let i=0;i<12;i++)EL(-200+(i%4)*420,200+Math.floor(i/4)*600+rnd(i)*200,220,90,'#4A5074',p,{opacity:.5});
  for(let i=0;i<6;i++){const x=-100+i*260;PA(`M ${x-60} -300 L ${x+60} -300 L ${x} ${60+rnd(i)*160} Z`,'#33374F',p);}
  const hp=G({transform:'translate(540,860) rotate(-8)'},p);S1.halo=CI(0,0,330,'url(#spray)',hp);handShape(hp,'#494F73',2.0);
  for(let i=0;i<18;i++){const a=i*2.4,r=250+rnd(i)*110;CI(Math.cos(a)*r,Math.sin(a)*r,6+rnd(i+5)*8,C.coral,hp,{opacity:.8});}
  const m=N('mask',{id:'sBeam',maskUnits:'userSpaceOnUse',x:-800,y:-800,width:2700,height:3500},defs);R(-800,-800,2700,3500,'#fff',0,m);S1.hole=CI(540,860,80,'url(#hole)',m);
  S1.dark=R(-800,-800,2700,3500,'#0E1018',0,p,{opacity:.92,mask:'url(#sBeam)'});
  S1.st=stamp(p,540,420,'TERTUA DI DUNIA',C.sun,62,-6);S1.st.el.setAttribute('opacity',0);
  S1.flag=G({},p);S1.flagJ=J(S1.flag,540,1110);R(-110,-40,220,40,C.red,6,S1.flag);R(-110,0,220,40,C.paper,6,S1.flag);TX(0,100,'Indonesia',64,C.paper,S1.flag,{'font-weight':700});
  S1.dust=[];for(let i=0;i<14;i++)S1.dust.push(CI(540+(rnd(i+3)-.5)*600,1000,4+rnd(i)*4,'#F4ECCF',p,{opacity:0}));}
tl.set(S1.g,{display:'block'},0);Object.assign(S1.cam,{x:540,y:860,z:1.5});S1.apply();
{const H0={r:80,d:.92};tl.to(H0,{r:900,d:.25,duration:.9,ease:'power2.out',onUpdate(){S1.hole.setAttribute('r',H0.r);S1.dark.setAttribute('opacity',H0.d);}},.1);sfx('senter',.1,.5);
  cam(S1,.1,540,840,1.15,1.4,'power2.out');tl.to(S1.halo,{keyframes:{opacity:[1,.8,1]},duration:1.4,repeat:-1},.5);
  tl.set(S1.st.el,{attr:{opacity:1}},0);pop(S1.st,.9,.45);sfx('pop',.9,.45);pop(S1.flagJ,c(1),.5);sfx('pop',c(1),.35);S1.dust.forEach((d,i)=>drift(d,i*.15,{y:-500,dur:3,peak:.7}));}

/* ---------- S2 PETA: Pulau Muna + umur ---------- */
const S2=scene('peta');{const p=S2.g;R(-800,-800,2700,3500,'url(#skyD)',0,p);S2.m=mapBox(p,40,420,1000,1000,[117,127,-8,2],['sl','bo','jv']);const m=S2.m;
  S2.muna=EL(...m.pt(122.6,-4.9),26,44,C.sun,p,{opacity:0});S2.ring=CI(...m.pt(122.6,-4.9),46,'none',p,{stroke:C.coral,'stroke-width':8,opacity:0});
  S2.tag=tag(p,540,410,'Liang Metanduno','Pulau Muna · Sulawesi Tenggara',{s1:52,s2:36});S2.st=stamp(p,540,960,'≥ 67.800 tahun',C.coral,76,-6);S2.card=photo(p,600,880,760,'metanduno-perahu.jpg',1.5,'Gua Liang Metanduno, Pulau Muna','Purnawibawa · CC BY-SA 4.0 · Wikimedia Commons',{s1:36,s2:30});S2.card.el.setAttribute('opacity',0);}
{const t=c(2)-.2;slide(t,S1,S2,'y',72);Object.assign(S2.cam,{x:540,y:860,z:1.12});S2.apply();pop(S2.tag,t+.3);show(S2.muna,t+.8,.3);
  tl.to(S2.ring,{keyframes:{opacity:[0,1,0]},attr:{r:140},duration:1.1,repeat:-1},t+.8);cam(S2,t+.4,600,1000,1.15,2.6,'power2.inOut');tl.to(S2.card.el,{opacity:1,duration:.01},c(3)+.2);tl.fromTo(S2.card,{y:80,r:-5},{y:0,r:0,duration:.5,ease:'back.out(1.6)',onUpdate:S2.card.apply,immediateRender:false},c(3)+.2);tl.to(S2.card.el,{opacity:0,duration:.25},c(5)-.1);pop(S2.st,c(5)+.2,.5);sfx('pop',c(5)+.2,.45);}

/* ---------- S3 CARANYA: tangan + semburan pewarna ---------- */
const S3=scene('cara');{const p=S3.g;R(-800,-800,2700,3500,'url(#caveG)',0,p);for(let i=0;i<10;i++)EL(-200+(i%3)*500,300+Math.floor(i/3)*500,220,90,'#4A5074',p,{opacity:.5});
  S3.print=G({transform:'translate(480,820) rotate(-10)',opacity:0},p);CI(0,0,300,'url(#spray)',S3.print);handShape(S3.print,'#494F73',1.8);
  const hd=G({},p);S3.hand=J(hd,480,820);const hh=G({transform:'rotate(-10)'},hd);handShape(hh,C.skin,1.8);R(-80,140,160,900,C.skin,60,hh);
  const tb=G({},p);S3.tube=J(tb,1000,700);R(-340,-18,340,36,'#B08458',18,tb);EL(40,0,60,66,'#B97A52',tb);
  S3.spray=[];for(let i=0;i<34;i++)S3.spray.push(CI(660,700,7+rnd(i)*8,C.coral,p,{opacity:0}));}
{const t=c(6)-.4;cut(t,S2,S3);Object.assign(S3.cam,{x:540,y:840,z:1.12});S3.apply();
  tl.set(S3.hand,{y:500,onUpdate:S3.hand.apply},0);tl.to(S3.hand,{y:0,duration:.5,ease:'power2.out',onUpdate:S3.hand.apply},t+.2);
  tl.set(S3.tube,{x:500,onUpdate:S3.tube.apply},0);tl.to(S3.tube,{x:0,duration:.5,ease:'power2.out',onUpdate:S3.tube.apply},c(7)-.6);
  S3.spray.forEach((s,i)=>tl.fromTo(s,{opacity:0,x:0,y:0},{keyframes:{opacity:[0,.9,0]},x:-(260+rnd(i)*340),y:(rnd(i+1)-.5)*560,duration:.6,ease:'power1.out',repeat:3,immediateRender:false},c(7)-.1+rnd(i+5)*.5));
  show(S3.print,c(7)+.3,1.0);tl.to(S3.tube,{x:600,duration:.4,ease:'power2.in',onUpdate:S3.tube.apply},c(8)+1.0);tl.to(S3.hand,{y:800,duration:.6,ease:'power2.in',onUpdate:S3.hand.apply},c(8)+1.1);cam(S3,t,540,820,1.3,3.5,'sine.inOut');}

/* ---------- S4 SENIMAN TERTUA: Nara & Bima bersorak ---------- */
const S4=scene('sorak');{const p=S4.g,gy=1540;R(-800,-800,2700,3500,'url(#caveG)',0,p);const hp=G({transform:'translate(540,640) rotate(-8)'},p);CI(0,0,260,'url(#spray)',hp);handShape(hp,'#494F73',1.5);
  R(-800,gy,2700,900,'#262A3E',0,p);S4.card=photo(p,540,520,560,'pettakere.jpg',4/3,'Cap tangan asli · Maros','Cahyo · CC BY-SA 3.0 · Wikimedia Commons',{s1:36,s2:30,rot:-3});S4.nara=character(p,360,gy,1.0,NARA);S4.bima=character(p,720,gy,1.0,BIMA);
  S4.conf=[];for(let i=0;i<30;i++)S4.conf.push(R(rnd(i)*1080,-80,16,28,[C.red,C.paper,C.sun,C.mint][i%4],3,p,{opacity:0}));}
{const t=c(9)-.3;slide(t,S3,S4,'x',96);Object.assign(S4.cam,{x:540,y:980,z:1.12});S4.apply();idle(S4.nara,t);idle(S4.bima,t);
  face(S4.nara,'lebar',t+.3);face(S4.bima,'lebar',t+.3);wave(S4.nara,t+.4,'L');wave(S4.bima,t+.5,'R');hop(S4.nara,t+.8);hop(S4.bima,t+.9);
  S4.conf.forEach((k,i)=>tl.fromTo(k,{opacity:0,y:0,rotation:0},{opacity:1,y:2100,rotation:360*(rnd(i)>.5?1:-1),duration:2.6+rnd(i),ease:'none',immediateRender:false},t+.4+rnd(i+2)*.6));sfx('pop',t+.4,.4);}

/* ---------- S5 AJAKAN: kapsul −300.000 → kembali ke gua (loop) ---------- */
const S5=scene('ajak');{const p=S5.g;R(-800,-800,2700,3500,'url(#tunnel)',0,p);S5.rings=[];for(let i=0;i<7;i++)S5.rings.push(CI(540,820,60,'none',p,{stroke:i%2?C.lilac:C.mint,'stroke-width':12,opacity:0}));
  S5.k=makeCapsule(p,540,1180);S5.k.sd.setAttribute('opacity',0);S5.k.num.textContent=fmt(-300000);S5.k.num.setAttribute('fill',C.sun);S5.k.sub.textContent='VERSI LENGKAP';S5.k.sub.setAttribute('opacity',1);S5.k.sub.setAttribute('font-size',24);
  S5.tag=tag(p,540,340,'Perjalanan 300.000 Tahun','tonton di kanal ini',{s1:50,s2:38});}
{const t=c(11)-.3;cut(t,S4,S5);Object.assign(S5.cam,{x:540,y:860,z:1.15});S5.apply();show(S5.k.faces,t,.01);show(S5.k.flame,t,.01);
  S5.rings.forEach((r,i)=>tl.fromTo(r,{attr:{r:40},opacity:0},{keyframes:{opacity:[0,.8,0]},attr:{r:1200},duration:1.6,ease:'power1.in',repeat:-1,immediateRender:false},t+i*.22));
  tl.to(S5.k.body,{r:3,y:-16,duration:.4,yoyo:true,repeat:-1,ease:'sine.inOut',onUpdate:S5.k.body.apply},t);pop(S5.tag,t+.4);sfx('pop',t+.4,.35);sfx('luncur',T.end-.6,.45);
  tl.to(S5.k.body,{y:-1600,duration:.6,ease:'power2.in',onUpdate:S5.k.body.apply},T.end-.5);}
/* frame akhir = frame awal: kembali ke gua gelap supaya Short berputar mulus */
{const e=T.end+.15;cut(e,S5,S1);tl.set(S1.hole,{attr:{r:80}},e);tl.set(S1.dark,{attr:{opacity:.92}},e);tl.set([S1.st.el,S1.flag],{opacity:0},e);tl.set(S1.cam,{x:540,y:860,z:1.5,onUpdate:S1.apply},e);}
DUR=T.end+.5;tl.to({},{duration:.01},DUR);
