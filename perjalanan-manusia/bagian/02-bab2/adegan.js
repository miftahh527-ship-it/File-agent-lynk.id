/* BAB 2 — Hidup berpindah dan lukisan gua tertua */
const T=voPlan(['b2-1','b2-2','b2-3','b2-4','b2-5'],3.6,.8,{'b2-3':.9});
const B0=bumper('−60.000','BAB 2');

/* ---------- P1 BERBURU & MERAMU ---------- */
const P1=scene('buru');{const p=P1.g,gy=900;bgSky(p);P1.clouds=[cloud(p,300,200,.9),cloud(p,1500,160,.7)];bgHills(p,800,C.mint,.6);bgGround(p,gy,C.lime2,C.sand);
  P1.trees=[roundTree(p,140,gy,1.1),roundTree(p,2050,gy,1.0)];
  const ft=G({},p);R(1586,gy-330,30,330,'#6E5A48',10,ft);const fc=G({},p);P1.ftree=J(fc,1600,gy-330);CI(0,-70,170,C.mint2,fc);CI(-110,10,110,C.mint,fc);CI(120,0,120,C.mint,fc);
  P1.fruits=[[-90,-40],[-20,-120],[60,-60],[110,20],[-60,40],[20,10]].map(([x,y],i)=>{const g=G({},fc),j=J(g,x,y);CI(0,0,20,i%2?C.coral:C.sun,g);return j;});
  P1.tufts=[];for(let i=0;i<10;i++)P1.tufts.push(tuft(p,-300+i*270,gy+40+rnd(i)*60,1.1,C.lime2));
  const dg=G({},p);P1.deer=dg;const db=G({transform:`translate(420,${gy})`},dg);P1.deerJ=J(G({},db));const d=P1.deerJ.el;EL(0,-120,80,38,'#B98A5E',d);R(50,-200,24,80,'#B98A5E',10,d,{transform:'rotate(20 62 -160)'});EL(84,-206,30,20,'#B98A5E',d);LN('M 80 -224 L 70 -260 M 92 -224 L 102 -258',C.wood,6,d);
  [[-50],[-24],[30],[56]].forEach(([x])=>R(x-6,-96,12,96,'#A6794F',6,d));
  P1.hunter=character(p,760,gy,.95,{...PURBA,who:'pemburu'});const sp=G({},P1.hunter.Rhand.el);LN('M 0 -160 L 0 160',C.wood,10,sp);PA('M -12 -160 L 0 -210 L 12 -160 Z','#8E8E94',sp);
  P1.picker=character(p,1380,gy,.85,{...PURBA,who:'peramu',shirt:'#D9A46E',beard:false,blush:true,skin:'#C4875D'});
  const bk=G({},P1.picker.Lhand.el);PA('M -50 10 L 50 10 L 40 80 L -40 80 Z','#B08458',bk);LN('M -50 10 C -30 -40 30 -40 50 10',C.wood,6,bk);
  P1.bfruit=[0,1,2].map(i=>CI(1380-85*.85+(i-1)*16,gy-120,12,i%2?C.coral:C.sun,p,{opacity:0}));
}
slide(3.0,B0,P1,'x',96);Object.assign(P1.cam,{x:900,y:620,z:1.18});P1.apply();
{const t0=T['b2-1'];idle(P1.hunter,3);idle(P1.picker,3.2);P1.trees.forEach((j,i)=>sway(j,3+i*.4,1.4,2));sway(P1.ftree,3,1.2,2.2);P1.tufts.forEach((j,i)=>sway(j,3+i*.1,8,.9+rnd(i)*.5));
  P1.clouds.forEach((c,i)=>tl.fromTo(c,{x:0},{x:160,duration:18,ease:'none',immediateRender:false},3));
  tl.to(P1.deerJ,{y:-40,duration:.25,yoyo:true,repeat:-1,ease:'sine.out',onUpdate:P1.deerJ.apply},3);tl.fromTo(P1.deer,{x:0},{x:-900,duration:9,ease:'none',immediateRender:false},capT(T,'b2-1',1));
  rot(P1.hunter.Rarm,capT(T,'b2-1',1),-40,.4);rot(P1.hunter.Rfore,capT(T,'b2-1',1),-60,.4);
  cam(P1,capT(T,'b2-1',1)+1.8,1450,600,1.4,1.4,'power2.inOut');
  /* memetik buah → masuk keranjang */
  P1.fruits.forEach((f,i)=>{const at=capT(T,'b2-1',1)+2.6+i*.45;rot(P1.picker.Rarm,at-.2,150,.25);rot(P1.picker.Rarm,at+.2,120,.2);tl.to(f.el,{opacity:0,duration:.15},at+.1);});
  P1.bfruit.forEach((b,i)=>show(b,capT(T,'b2-1',1)+2.8+i*.9,.15));
  const t2=capT(T,'b2-1',2);rot(P1.picker.Rarm,t2,0,.4);face(P1.picker,'cemas',t2);face(P1.hunter,'cemas',t2+.2);cam(P1,t2,1100,600,1.2,1.0,'power2.inOut');
  walk(P1.hunter,t2+1.4,3.2,900);walk(P1.picker,t2+1.6,3.0,800);tl.to(P1.bfruit,{x:'+=680',duration:3.0,ease:'none'},t2+1.6);
  tl.to(P1.cam,{x:1700,duration:3,ease:'sine.inOut',onUpdate:P1.apply},t2+1.6);face(P1.hunter,'senang',t2+1.4);face(P1.picker,'senang',t2+1.6);}

/* ---------- P1b ZAMAN BATU: kapak batu dipangkas ---------- */
const P1b=scene('batu');{const p=P1b.g;R(-900,-900,3800,2900,'url(#skyD)',0,p);EL(960,1040,1100,260,'#6E5A48',p);EL(960,1010,900,200,'#8A6A4A',p);
  const ax=G({},p);P1b.axe=J(ax,860,760);PA('M -90 60 C -110 -40 -40 -150 20 -150 C 80 -120 100 -20 80 60 Z','#9EA3B0',ax);PA('M -40 40 C -50 -30 -10 -100 20 -110 C 30 -60 20 0 10 40 Z','#B9BDC8',ax);
  const hm=G({},p);P1b.ham=J(hm,1160,640);EL(0,0,70,54,'#7D828E',hm);
  P1b.flakes=[];for(let i=0;i<8;i++)P1b.flakes.push(PA('M 0 0 L 16 -6 L 10 12 Z','#B9BDC8',p,{opacity:0,transform:`translate(${920+rnd(i)*40},${650})`}));
  const spG=G({},p);PA('M 1350 860 L 1450 700 L 1470 860 Z','#9EA3B0',spG);LN('M 1460 860 L 1480 1000',C.wood,12,spG);
  P1b.tag=tag(p,960,300,'Zaman Batu','alat dari batu');P1b.dust=[];for(let i=0;i<6;i++)P1b.dust.push(CI(860+(rnd(i+3)-.5)*200,700,10,C.sand,p,{opacity:0}));}
{const t=capT(T,'b2-1',3)-.2;cut(t,P1,P1b);Object.assign(P1b.cam,{x:960,y:640,z:1.3});P1b.apply();
  for(let k=0;k<4;k++){const a=t+.3+k*.7;tl.to(P1b.ham,{x:-170,y:60,r:-20,duration:.18,ease:'power2.in',onUpdate:P1b.ham.apply},a);tl.to(P1b.ham,{x:0,y:0,r:0,duration:.3,ease:'power2.out',onUpdate:P1b.ham.apply},a+.18);}
  P1b.flakes.forEach((f,i)=>tl.fromTo(f,{opacity:0,x:0,y:0},{keyframes:{opacity:[1,1,0]},x:(rnd(i)-.3)*260,y:-80+rnd(i+1)*160,duration:.6,ease:'power2.out',immediateRender:false},t+.48+(i%4)*.7));
  sfx('pop',t+.48,.25);sfx('pop',t+1.18,.2);pop(P1b.tag,capT(T,'b2-1',4),.5);sfx('pop',capT(T,'b2-1',4),.35);cam(P1b,t+.4,960,560,1.5,2.4,'sine.inOut');
  P1b.dust.forEach((d,i)=>drift(d,t+.5+i*.2,{y:-140,scale:2,dur:1.6,peak:.5}));}

/* ---------- P2 API: malam, keluarga di sekeliling api ---------- */
const P2=scene('api');{const p=P2.g,gy=900;R(-900,-900,3800,2900,'url(#skyN)',0,p);P2.st=stars(p,50,700);P2.moon=CI(1500,200,60,C.paper,p);
  bgHills(p,820,'#2F3550',1);bgGround(p,gy,'#3E4A3C','#4A4E5E');
  P2.bush=[];[[1700,860],[1840,880],[160,870]].forEach(([x,y],i)=>{const g=G({},p),j=J(g,x,y);CI(0,0,110,'#2E3A30',g);CI(-80,20,80,'#26302A',g);CI(80,20,80,'#26302A',g);P2.bush.push(j);});
  P2.eyes=G({},p);[[1680,840],[1720,840],[1830,860],[1866,860]].forEach(([x,y])=>CI(x,y,9,C.sun,P2.eyes));
  P2.glow=CI(960,860,420,'url(#fireGlow)',p);
  R(870,868,180,26,C.wood,13,p,{transform:'rotate(12 960 880)'});R(870,868,180,26,sh(C.wood,.8),13,p,{transform:'rotate(-12 960 880)'});
  P2.flames=[[C.coral,1.2],[C.sun,.85],[C.paper,.5]].map(([col,s])=>{const g=G({},p),j=J(g,960,872);PA(`M ${-70*s} 0 C ${-80*s} ${-90*s} ${-20*s} ${-120*s} 0 ${-210*s} C ${30*s} ${-130*s} ${80*s} ${-90*s} ${70*s} 0 Z`,col,g);return j;});
  P2.sparks=[];for(let i=0;i<10;i++)P2.sparks.push(CI(960+(rnd(i)-.5)*140,800,4+rnd(i+7)*4,C.sun,p,{opacity:0}));
  LN('M 820 700 L 1100 700',C.wood,8,p);LN('M 830 700 L 830 890 M 1090 700 L 1090 890',C.wood,8,p);const mt=G({},p);P2.meat=J(mt,960,700);EL(0,0,60,34,'#B5533C',mt);EL(-14,-8,24,12,'#D9735E',mt);
  P2.a=character(p,620,gy,.95,{...PURBA,who:'ayahapi'});P2.b=character(p,1290,gy,.8,{...PURBA,who:'ibuapi',shirt:'#D9A46E',beard:false,style:'wild',blush:true,skin:'#C4875D'});P2.c=character(p,460,gy,.6,{...PURBA,who:'anakapi',shirt:'#E0B07A',beard:false,blush:true});
  const tc=G({},P2.a.Rhand.el);LN('M 0 0 L 0 -150',C.wood,12,tc);P2.torch=G({},tc);PA('M -24 -150 C -30 -200 0 -230 0 -260 C 10 -220 30 -200 24 -150 Z',C.sun,P2.torch);}
{const t=T['b2-2']-.4;slide(t,P1b,P2,'x',96);Object.assign(P2.cam,{x:960,y:640,z:1.5});P2.apply();
  P2.flames.forEach((j,i)=>{tl.to(j,{sy:1.16,sx:.92,duration:.21+i*.05,yoyo:true,repeat:-1,ease:'sine.inOut',onUpdate:j.apply},t);sway(j,t,4-i,.37+i*.07);});
  tl.to(P2.glow,{keyframes:{opacity:[1,.75,1]},duration:.9,repeat:-1},t);P2.sparks.forEach((s,i)=>drift(s,t+(i*.23)%1.2,{y:-300,x:(rnd(i+2)-.5)*80,dur:1.5,peak:1}));
  spin(P2.meat,t,2.4);twinkle(P2.st,t);[P2.a,P2.b,P2.c].forEach((ch,i)=>idle(ch,t+i*.2));
  rot(P2.b.Rarm,t+.2,-60,.5);rot(P2.b.Rfore,t+.2,-60,.5);rot(P2.c.Rarm,t+.2,-70,.5);rot(P2.c.Rfore,t+.2,-30,.5);
  const c1=capT(T,'b2-2',1);cam(P2,c1,1350,720,1.4,1.0,'power2.inOut');rot(P2.a.Rarm,c1+1.2,-120,.4);
  tl.to(P2.eyes,{keyframes:{opacity:[1,1,0]},x:300,duration:1.2,ease:'power2.in'},c1+1.6);tl.to(P2.bush[0],{r:6,duration:.12,yoyo:true,repeat:5,onUpdate:P2.bush[0].apply},c1+1.6);
  cam(P2,c1+3.2,960,700,1.7,1.0,'power2.inOut');face(P2.c,'lebar',c1+3.6);rot(P2.a.Rarm,c1+3.2,-30,.4);}

/* ---------- P3 PETA PENYEBARAN: dari Afrika lewat Indonesia ke Australia ---------- */
const P3=scene('sebar');{const p=P3.g;R(-900,-900,3800,2900,'url(#skyD)',0,p);P3.m=worldMap(p,110,130,1700,820);const m=P3.m;
  const pts=[[32,2],[42,12],[52,22],[64,24],[76,20],[90,20],[100,10],[104,2],[110,-6],[120,-8],[130,-14],[136,-22]].map(([a,b])=>m.pt(a,b));
  P3.main=route(p,'M '+pts.map(q=>q.join(' ')).join(' L '),C.coral,12);
  const e=[[32,2],[34,30],[28,42],[15,50]].map(([a,b])=>m.pt(a,b));P3.eu=route(p,'M '+e.map(q=>q.join(' ')).join(' L '),C.sun,9);
  const a=[[76,20],[90,35],[110,40],[125,45]].map(([a,b])=>m.pt(a,b));P3.as=route(p,'M '+a.map(q=>q.join(' ')).join(' L '),C.sun,9);
  P3.walker=G({opacity:0},p);CI(0,-40,16,C.ink,P3.walker);R(-12,-26,24,40,C.ink,10,P3.walker);
  P3.pathD='M '+pts.map(q=>q.join(' ')).join(' L ');
  P3.tA=tag(p,...m.pt(20,-5),'Afrika');P3.tI=tag(p,m.pt(112,0)[0],m.pt(112,0)[1]-70,'Indonesia','',{c1:C.coral});P3.tU=tag(p,m.pt(134,-28)[0],m.pt(134,-28)[1]+40,'Australia');
  P3.glowI=CI(...m.pt(114,-2),80,'url(#glowSoft)',p,{opacity:0});}
{const t=T['b2-3']-.4;cut(t,P2,P3);Object.assign(P3.cam,{x:960,y:540,z:1.12});P3.apply();
  pop(P3.tA,t+.4);drawOn(P3.main,t+1.2,6.5,'none');drawOn(P3.eu,t+2.4,2.0);drawOn(P3.as,t+3.4,2.4);
  show(P3.walker,t+1.2,.2);flyAlong(P3.walker,P3.pathD,t+1.2,6.5,{ease:'none'});
  const c1=capT(T,'b2-3',2);cam(P3,c1-.6,1360,600,1.55,1.4,'power2.inOut');pop(P3.tI,c1);tl.to(P3.glowI,{keyframes:{opacity:[0,1,.5,1]},duration:1.5},c1);pop(P3.tU,c1+1.6);sfx('pop',c1,.3);}

/* ---------- P4 LIANG METANDUNO: peta Sulawesi + jurnal, lalu gua & peneliti ---------- */
const P4=scene('muna');{const p=P4.g;R(-900,-900,3800,2900,'url(#skyD)',0,p);P4.m=mapBox(p,160,110,1600,860,[112,132,-10,4],['bo','sl','jv','su']);const m=P4.m;
  P4.muna=PA(landD(PETA.nusantara,m.P,[122.2,123.2,-5.5,-4.4],(x,y,sp)=>sp<1.2&&x>122.3&&x<122.75&&y<-4.5&&y>-5.4),C.sun,m.inner,{opacity:0,stroke:C.coral,'stroke-width':3});P4.ring=CI(...m.pt(122.6,-4.9),40,'none',p,{stroke:C.coral,'stroke-width':6,opacity:0});
  P4.tagM=tag(p,m.pt(122.6,-4.9)[0]+250,m.pt(122.6,-4.9)[1],'Pulau Muna','Sulawesi Tenggara');
  const jr=G({},p);P4.jr=J(jr,560,520);R(-170,-230,340,460,C.paper,16,jr);R(-170,-230,340,90,C.ink,16,jr);TX(0,-168,'NATURE',48,C.paper,jr,{'font-weight':700,'letter-spacing':6});
  TX(0,-80,'Januari 2026',32,C.ink,jr);const hs=G({transform:'translate(0,70)'},jr);CI(0,0,110,'url(#spray)',hs);handShape(hs,'#4A5074',.8);}
const P4b=scene('lab-gua');{const p=P4b.g,gy=960;R(-900,-900,3800,2900,'url(#caveG)',0,p);for(let i=0;i<8;i++)EL(-200+i*320,200+rnd(i+80)*500,180,80,'#4A5074',p,{opacity:.5});
  PA('M -900 930 C 0 900 900 960 2800 920 L 2800 1900 L -900 1900 Z','#262A3E',p);
  const hp=G({transform:'translate(1000,430) rotate(-6)'},p);P4b.halo=CI(0,0,210,'url(#spray)',hp);handShape(hp,'#494F73',1.3);
  P4b.r1=character(p,520,gy,.9,{who:'peneliti1',shirt:C.mint,pants:C.indigo,hair:'#2A2350',skin:'#D9A07A'});P4b.r2=character(p,1500,gy,.9,{who:'peneliti2',shirt:C.sun,pants:C.ink,hair:'#3A2A44',skin:'#B97A52',style:'pony'});
  [P4b.r1,P4b.r2].forEach(r=>{const hg=G({},r.head.el);PA('M -82 -116 C -80 -196 80 -196 82 -116 Z',C.sun,hg);R(-90,-124,180,16,sh(C.sun,.8),8,hg);CI(0,-176,14,C.paper,hg);});
  P4b.beam=PA('',C.paper,p,{opacity:.12});const dv=G({},P4b.r2.Rhand.el);R(-26,-20,52,70,C.ink,8,dv);P4b.scr=R(-18,-12,36,30,C.mint,4,dv);
  P4b.st1=stamp(p,1000,690,'≥ 67.800 tahun',C.coral,54);P4b.st2=stamp(p,1000,190,'Tertua di dunia!',C.sun,48,6);
  P4b.dust=[];for(let i=0;i<8;i++)P4b.dust.push(CI(1000+(rnd(i+20)-.5)*400,500,4,C.paper,p,{opacity:0}));}
{const t=T['b2-4']-.4;slide(t,P3,P4,'x',96);Object.assign(P4.cam,{x:960,y:540,z:1.12});P4.apply();
  pop(P4.jr,t+.5);sfx('pop',t+.5,.3);tl.to(P4.jr,{r:-4,duration:.8,yoyo:true,repeat:3,ease:'sine.inOut',onUpdate:P4.jr.apply},t+1);
  const c2=capT(T,'b2-4',2);cam(P4,c2-.3,1300,640,1.45,1.0,'power2.inOut');show(P4.muna,c2,.3);tl.to(P4.ring,{keyframes:{opacity:[0,1,0]},attr:{r:110},duration:1.2,repeat:-1},c2);pop(P4.tagM,c2+.4);
  const c3=capT(T,'b2-4',3);
  /* foto asli dinding Liang Metanduno */
  const F1=scene('foto-metanduno');{const p=F1.g;R(-900,-900,3800,2900,'url(#board)',0,p);F1.card=photo(p,960,400,900,'metanduno-perahu.jpg',1.5,'Dinding Gua Liang Metanduno, Pulau Muna (lukisan perahu)','Foto: Purnawibawa · CC BY-SA 4.0 · Wikimedia Commons',{s1:34});}
  cut(c2+1.7,P4,F1);Object.assign(F1.cam,{x:960,y:560,z:1.08});F1.apply();tl.fromTo(F1.card,{y:60,r:-4},{y:0,r:0,duration:.5,ease:'back.out(1.6)',onUpdate:F1.card.apply,immediateRender:false},c2+1.7);cam(F1,c2+1.8,960,560,1.1,3,'sine.inOut');
  cut(c3+.3,F1,P4b);Object.assign(P4b.cam,{x:1000,y:560,z:1.2});P4b.apply();idle(P4b.r1,c3);idle(P4b.r2,c3);
  rot(P4b.r2.Rarm,c3,-40,.4);rot(P4b.r2.Rfore,c3,-70,.4);tl.to(P4b.scr,{keyframes:{fill:[C.mint,C.sun,C.mint]},duration:.6,repeat:-1},c3);
  const bm={k:0};tl.to(bm,{k:1,duration:2,ease:'sine.inOut',yoyo:true,repeat:-1,onUpdate(){const x=900+bm.k*220;P4b.beam.setAttribute('d',`M 1430 650 L ${x-90} ${380+bm.k*60} L ${x+90} ${480+bm.k*60} Z`);}},c3);
  rot(P4b.r1.Rarm,c3+.3,-80,.5,'power2.out');rot(P4b.r1.Rfore,c3+.3,-10,.5);cam(P4b,c3+.2,1000,500,1.4,1.4,'power2.inOut');pop(P4b.st1,c3+2.0);sfx('pop',c3+2.0,.35);
  const c4=capT(T,'b2-4',4);pop(P4b.st2,c4+.6);face(P4b.r1,'lebar',c4+.6);face(P4b.r2,'lebar',c4+.6);hop(P4b.r1,c4+.8);cam(P4b,c4,1000,500,1.25,1.2,'power2.inOut');
  P4b.dust.forEach((d,i)=>drift(d,c3+i*.3,{y:-200,dur:3,peak:.6}));tl.to(P4b.halo,{keyframes:{opacity:[1,.8,1]},duration:1.6,repeat:-1},c3);}

/* ---------- P5 CARA MELUKIS + MAROS ---------- */
const P5=scene('melukis');{const p=P5.g;R(-900,-900,4800,2900,'url(#caveG)',0,p);for(let i=0;i<12;i++)EL(-200+i*320,200+rnd(i+90)*600,180,80,'#4A5074',p,{opacity:.5});
  P5.print=G({transform:'translate(860,520) rotate(-10)',opacity:0},p);CI(0,0,200,'url(#spray)',P5.print);handShape(P5.print,'#494F73',1.2);
  const hand=G({},p);P5.hand=J(hand,860,520);const hh=G({transform:'rotate(-10)'},hand);handShape(hh,C.skin,1.2);R(-50,90,100,400,C.skin,40,hh);
  const tube=G({},p);P5.tube=J(tube,1500,560);R(-260,-14,260,28,'#B08458',14,tube);EL(30,0,46,52,'#B97A52',tube);
  P5.spray=[];for(let i=0;i<26;i++)P5.spray.push(CI(1240,560,5+rnd(i)*6,C.coral,p,{opacity:0}));
  /* Maros: babi hutan */
  const pg=G({transform:'translate(2500,500)'},p);P5.pig=[route(pg,'M -260 40 C -250 -60 -120 -110 20 -100 C 140 -92 230 -40 260 20 C 280 60 250 90 200 90 L -200 90 C -250 90 -262 70 -260 40 Z',C.coral,14),
    route(pg,'M -190 90 L -200 180 M -120 90 L -110 180 M 120 90 L 130 180 M 190 90 L 200 180',C.coral,12),route(pg,'M 240 0 L 310 -10 M 250 30 L 300 40',C.coral,10),route(pg,'M -60 -100 L -40 -150 M 0 -104 L 20 -150 M 60 -100 L 80 -144',C.coral,8)];
  P5.tagP=tag(p,2500,250,'Leang Karampuang, Maros','±51.200 tahun',{s1:38});
  P5.nara=character(p,2140,960,.8,NARA);P5.bima=character(p,2860,960,.8,BIMA);}
{const t=T['b2-5']-.4;cut(t,P4b,P5);Object.assign(P5.cam,{x:1000,y:540,z:1.3});P5.apply();
  const c1=capT(T,'b2-5',1);tl.set(P5.hand,{y:320,onUpdate:P5.hand.apply},0);tl.to(P5.hand,{y:0,duration:.6,ease:'power2.out',onUpdate:P5.hand.apply},t+.4);
  tl.set(P5.tube,{x:400,onUpdate:P5.tube.apply},0);tl.to(P5.tube,{x:0,duration:.6,ease:'power2.out',onUpdate:P5.tube.apply},c1+1.2);
  P5.spray.forEach((s,i)=>tl.fromTo(s,{opacity:0,x:0,y:0},{keyframes:{opacity:[0,.9,0]},x:-(260+rnd(i)*280),y:(rnd(i+1)-.5)*360,duration:.7,ease:'power1.out',repeat:3,immediateRender:false},c1+1.8+rnd(i+5)*.6));
  show(P5.print,c1+2.2,1.4);tl.to(P5.tube,{x:400,duration:.5,ease:'power2.in',onUpdate:P5.tube.apply},c1+4.6);tl.to(P5.hand,{y:420,duration:.7,ease:'power2.in',onUpdate:P5.hand.apply},c1+4.8);
  const c2=capT(T,'b2-5',2);tl.to(P5.cam,{x:2500,y:560,z:1.25,duration:1.4,ease:'power2.inOut',onUpdate:P5.apply},c2-.4);
  P5.pig.forEach((n,i)=>drawOn(n,c2+.8+i*.5,1.0));pop(P5.tagP,c2+2.4);sfx('pop',c2+2.4,.3);
  /* foto asli: cap tangan Leang Pettakere → lukisan Leang Karampuang (Maros) */
  const F2=scene('foto-maros');{const p=F2.g;R(-900,-900,3800,2900,'url(#board)',0,p);
    F2.a=photo(p,960,390,760,'pettakere.jpg',4/3,'Cap tangan asli di Leang Pettakere, Maros','Foto: Cahyo · CC BY-SA 3.0 · Wikimedia Commons',{s1:34});
    F2.b=photo(p,960,400,1000,'karampuang-lukisan.jpg',500/278,'Lukisan Leang Karampuang, Maros · ±51.200 tahun (foto diperjelas)','Foto: Oktaviana dkk., Nature 2024 · CC BY 4.0 · Wikimedia Commons',{s1:32,rot:2});}
  const c3b=capT(T,'b2-5',3);cut(c2-.25,P5,F2);Object.assign(F2.cam,{x:960,y:560,z:1.08});F2.apply();tl.set(F2.b.el,{opacity:0},0);
  tl.fromTo(F2.a,{y:60,r:-4},{y:0,r:0,duration:.5,ease:'back.out(1.6)',onUpdate:F2.a.apply,immediateRender:false},c2-.25);
  tl.to(F2.a.el,{opacity:0,duration:.25},c3b+.2);tl.set(F2.b.el,{opacity:1},c3b+.35);tl.fromTo(F2.b,{x:300,r:6},{x:0,r:0,duration:.55,ease:'back.out(1.4)',onUpdate:F2.b.apply,immediateRender:false},c3b+.35);
  cam(F2,c2,960,560,1.1,5,'sine.inOut');
  idle(P5.nara,t);idle(P5.bima,t);const c4=capT(T,'b2-5',VODATA['b2-5'].cap.length-1);cut(c4-.35,F2,P5);
  cam(P5,c4-.3,2500,540,1.15,1.0,'power2.inOut');face(P5.nara,'lebar',c4);face(P5.bima,'lebar',c4);wave(P5.nara,c4+.2,'L');wave(P5.bima,c4+.4,'R');hop(P5.bima,c4+.6);}

DUR=T.end+1.4;tl.to({},{duration:.01},DUR);
