/* =====================================================================
   PANGGUNG 1 — GUA GELAP: senter menyapu, cap tangan merah, peta Indonesia
   VO1 1.2–8.8 · "Tahukah kamu di mana?" 6.1 · "Di Indonesia!" 7.45
   ===================================================================== */
const P1=scene('gua');{const p=P1.g;
  R(-600,-400,3200,1900,'url(#caveG)',0,p);
  PA('M -600 260 C -100 160 300 360 700 280 C 1050 210 1350 350 1750 260 C 2100 190 2400 280 2600 250 L 2600 -400 L -600 -400 Z','#3D4264',p,{opacity:.7});
  for(let i=0;i<10;i++){EL(-260+i*290,170+rnd(i)*560,170+rnd(i+9)*120,70+rnd(i+3)*60,i%2?'#555B80':'#474C70',p,{opacity:.5});}
  P1.drips=[];
  for(let i=0;i<9;i++){const x=-160+i*300+rnd(i+40)*90,h=150+rnd(i+20)*170;PA(`M ${x-70} -400 L ${x+70} -400 L ${x+10} ${-240+h} Q ${x} ${-224+h} ${x-10} ${-240+h} Z`,'#33374F',p);
    if(i===2||i===6)P1.drips.push(CI(x,-232+h,8,C.sky,p,{opacity:0}));}
  PA('M -600 900 C 100 850 600 930 1000 890 C 1400 850 1900 920 2600 880 L 2600 1500 L -600 1500 Z','#262A3E',p);
  EL(1260,965,200,28,C.blue,p,{opacity:.28});P1.rip=[EL(1260,965,40,8,'none',p,{stroke:C.sky,'stroke-width':4,opacity:0}),EL(1260,965,40,8,'none',p,{stroke:C.sky,'stroke-width':4,opacity:0})];
  /* cap tangan lama (redup) + cap tangan utama */
  const old=G({transform:'translate(1010,330) rotate(14)',opacity:.5},p);CI(0,0,110,'url(#spray)',old);handShape(old,'#4A5074',.75);
  const hp=G({transform:'translate(720,470) rotate(-8)'},p);P1.halo=CI(0,0,200,'url(#spray)',hp);handShape(hp,'#494F73',1.25);
  for(let i=0;i<14;i++){const a=i*2.4,r=150+rnd(i)*70;CI(Math.cos(a)*r,Math.sin(a)*r,4+rnd(i+5)*6,C.coral,hp,{opacity:.8});}
  P1.hp=hp;
  /* peta Indonesia dilukis di dinding */
  const mp=G({transform:'translate(1330,520)'},p);P1.isles=[];
  /* peta Indonesia buatan sendiri (data skill), dikelompokkan per pulau besar supaya muncul satu per satu */
  const PI=(lo,la)=>[(lo-118)*14.6,(-2.5-la)*14.6];
  const grup=[(x,y)=>x<106.2&&y>-6.2,(x,y)=>y<-5.6&&x<115.8,(x,y)=>x>=108&&x<119.3&&y>-4.6,(x,y)=>x>=118.7&&x<126&&y>-6.8&&y<3,(x,y)=>x>=130.8&&y<.5,()=>true];
  const sudah=(x,y)=>grup.slice(0,5).some(f=>f(x,y));
  grup.forEach((f,k)=>{const keep=(x,y,sp)=>sp<25&&!(y>5&&x>116.5)&&(k<5?f(x,y):!sudah(x,y));const d=landD(PETA.nusantara,PI,[94,142,-11.5,6.5],keep);
    const g=G({},mp);PA(d,C.sand2,g);PA(d,'none',g,{stroke:C.sun,'stroke-width':3,opacity:.6,'stroke-linejoin':'round'});P1.isles.push(g);});
  const pm=PI(122.6,-4.9),pinG=G({},mp);P1.pin=J(pinG,pm[0],pm[1]);PA('M 0 0 C -30 -40 -30 -76 0 -80 C 30 -76 30 -40 0 0 Z',C.coral,pinG);CI(0,-52,12,C.white,pinG);
  P1.pinRing=EL(pm[0],pm[1]+4,10,4,'none',mp,{stroke:C.coral,'stroke-width':4,opacity:0});
  /* gelap + lubang senter */
  const m=N('mask',{id:'beamM',maskUnits:'userSpaceOnUse',x:-600,y:-600,width:3200,height:2400},defs);R(-600,-600,3200,2400,'#fff',0,m);P1.hole=CI(300,820,40,'url(#hole)',m);
  P1.dark=R(-600,-600,3200,2400,'#0E1018',0,p,{opacity:.93,mask:'url(#beamM)'});
  P1.cone=PA('',C.sun,p,{opacity:.09});
  P1.dust=G({},p);for(let i=0;i<10;i++){CI((rnd(i)-.5)*360,(rnd(i+11)-.5)*300,3+rnd(i+30)*4,'#F4ECCF',P1.dust,{opacity:0});}
  P1.bats=[];for(let i=0;i<2;i++){const bg=G({},p),b=G({transform:`translate(${300+i*900},${150+i*40}) scale(${1-i*.25})`},bg);EL(0,0,14,10,'#1A1C28',b);
    const wl=G({},b),wr=G({},b);PA('M 0 0 C -20 -26 -50 -20 -64 -4 C -50 -6 -40 2 -30 4 C -20 0 -10 4 0 0 Z','#1A1C28',wl);PA('M 0 0 C 20 -26 50 -20 64 -4 C 50 -6 40 2 30 4 C 20 0 10 4 0 0 Z','#1A1C28',wr);
    const jl=J(wl),jr=J(wr);tl.to(jl,{sy:-.6,duration:.16,yoyo:true,repeat:-1,ease:'sine.inOut',onUpdate:jl.apply},0);tl.to(jr,{sy:-.6,duration:.16,yoyo:true,repeat:-1,ease:'sine.inOut',onUpdate:jr.apply},0);P1.bats.push(bg);}
}
const B={x:300,y:820,r:40,d:.93};
function beam(){P1.hole.setAttribute('cx',B.x);P1.hole.setAttribute('cy',B.y);P1.hole.setAttribute('r',B.r);P1.dark.setAttribute('opacity',B.d);
  const k=B.r*.72;P1.cone.setAttribute('d',`M -260 1300 L 180 1340 L ${B.x+k} ${B.y+k} L ${B.x-k} ${B.y-k} Z`);P1.cone.setAttribute('opacity',.06*Math.min(1,(B.d-.1)/.6));
  P1.dust.setAttribute('transform',`translate(${B.x},${B.y}) scale(${Math.min(1.4,B.r/220)})`);P1.dust.style.display=B.r>700?'none':'';}
beam();
tl.set(P1.g,{display:'block'},0);Object.assign(P1.cam,{x:640,y:600,z:1.5});P1.apply();
tl.to(B,{keyframes:[{x:430,y:720,r:120,duration:.9,ease:'sine.inOut'},{x:560,y:560,r:180,duration:.7,ease:'sine.inOut'},{x:720,y:470,r:300,duration:.5,ease:'back.out(1.4)'}],onUpdate:beam},0);
tl.set(P1.halo,{opacity:.35},0);tl.to(P1.halo,{opacity:1,duration:.5,ease:'power2.out'},2.0);tl.to(P1.halo,{keyframes:{opacity:[1,.82,1],easeEach:'sine.inOut'},duration:1.6,repeat:-1},2.5);
cam(P1,1.5,720,500,1.75,2.4,'power2.inOut');
tl.to(B,{x:1000,y:500,r:1500,d:.12,duration:1.4,ease:'power2.inOut',onUpdate:beam},6.0);
cam(P1,5.9,1010,520,1.15,1.5,'power2.inOut');
P1.isles.forEach((g,i)=>{tl.set(g,{opacity:0},0);tl.fromTo(g,{opacity:0,y:18},{opacity:1,y:0,duration:.35,ease:'back.out(2)',immediateRender:false},7.4+i*.09);});
tl.set(P1.pin.el,{opacity:0},0);tl.set(P1.pin,{y:-160,onUpdate:P1.pin.apply},0);tl.set(P1.pin.el,{opacity:1},8.0);tl.to(P1.pin,{y:0,duration:.45,ease:'bounce.out',onUpdate:P1.pin.apply},8.0);
tl.to(P1.pinRing,{keyframes:{opacity:[0,.9,0],easeEach:'none'},attr:{rx:60,ry:22},duration:1.1,repeat:-1,ease:'power1.out'},8.4);
P1.dust.childNodes.forEach((d,i)=>drift(d,(i*.37)%2,{y:-120,x:20,dur:2.6+rnd(i)*1.4,peak:.85}));
P1.drips.forEach((d,i)=>{tl.fromTo(d,{y:0},{y:1100,duration:1.2,ease:'power2.in',repeat:-1,repeatDelay:1.4,immediateRender:false},.6+i*1.1);tl.to(d,{keyframes:{opacity:[0,1,1,0],easeEach:'none'},duration:1.2,repeat:-1,repeatDelay:1.4},.6+i*1.1);});
P1.rip.forEach((r,i)=>tl.to(r,{keyframes:{opacity:[0,.7,0],easeEach:'none'},attr:{rx:170,ry:24},duration:2,repeat:-1,ease:'power1.out'},i));
P1.bats.forEach((b,i)=>tl.fromTo(b,{x:-200,y:0},{x:900,y:40,duration:7,ease:'sine.inOut',yoyo:true,repeat:-1,immediateRender:false},i*1.5));

/* =====================================================================
   PANGGUNG 2 — KEMAH GUA: manusia purba, api unggun, belum bertani/menulis
   VO2 9.4 · "bertani" ~13.2 · "menulis" ~14.4 · match cut tangan 15.1
   ===================================================================== */
const P2=scene('kemah');{const p=P2.g,gy=900;
  R(-600,-400,3200,1900,'url(#camp)',0,p);
  const cp=N('clipPath',{id:'arch'},defs);PA('M 260 905 C 260 420 500 230 800 230 C 1100 230 1340 420 1340 905 Z',null,cp);
  const out=G({'clip-path':'url(#arch)'},p);R(200,200,1200,720,'url(#skyA)',0,out);CI(1100,380,70,C.sun,out);
  P2.clouds=[cloud(out,500,360,.7),cloud(out,1000,300,.55)];
  PA('M 200 760 C 420 640 620 720 800 660 C 1000 600 1200 700 1400 650 L 1400 920 L 200 920 Z',C.mint,out);PA('M 200 820 C 500 760 800 800 1400 770 L 1400 920 L 200 920 Z',C.lime2,out);
  P2.birds=[bird(out,500,420,.9,C.indigo),bird(out,620,460,.7,C.indigo)];
  LN('M 260 905 C 260 420 500 230 800 230 C 1100 230 1340 420 1340 905',C.indigo,46,p);
  PA('M -600 880 C 0 860 600 900 1000 880 C 1500 860 2000 890 2600 880 L 2600 1500 L -600 1500 Z',C.sand2,p);
  R(-600,900,3200,600,sh(C.sand2,.9),0,p);
  /* lukisan dinding kanan */
  const wall=G({transform:'translate(1640,560)'},p);[[0,0,-12],[120,-70,10],[-110,90,-4]].forEach(([x,y,r])=>{const g=G({transform:`translate(${x},${y}) rotate(${r})`},wall);CI(0,0,70,'url(#spray)',g);handShape(g,'#4C4F74',.48);});
  P2.newPrint=G({transform:'translate(1470,640) rotate(-6)',opacity:0},p);CI(0,0,90,'url(#spray)',P2.newPrint);handShape(P2.newPrint,'#4C4F74',.6);
  /* api unggun */
  P2.glow=CI(990,860,300,'url(#fireGlow)',p);
  const f=G({},p);R(900,868,180,26,C.wood,13,f,{transform:'rotate(12 990 880)'});R(900,868,180,26,sh(C.wood,.8),13,f,{transform:'rotate(-12 990 880)'});
  P2.flames=[[C.coral,1.0],[C.sun,.72],[C.white,.42]].map(([col,s],i)=>{const g=G({},p),j=J(g,990,872);PA(`M ${-70*s} 0 C ${-80*s} ${-90*s} ${-20*s} ${-120*s} 0 ${-210*s} C ${30*s} ${-130*s} ${80*s} ${-90*s} ${70*s} 0 Z`,col,g);return j;});
  P2.sparks=[];for(let i=0;i<9;i++)P2.sparks.push(CI(990+(rnd(i)-.5)*120,820,4+rnd(i+7)*4,C.sun,p,{opacity:0}));
  P2.smoke=[];for(let i=0;i<5;i++)P2.smoke.push(CI(990+(rnd(i+3)-.5)*60,700,26+rnd(i)*20,'#C9C6D6',p,{opacity:0}));
  P2.dad=character(p,720,gy,1.0,{...PURBA,who:'ayah'});
  const stk=G({},P2.dad.Rhand.el);LN('M 0 6 L 0 250',C.wood,12,stk);CI(0,252,9,C.coral,stk);
  P2.kid=character(p,1310,gy,.7,{...PURBA,who:'anak',shirt:'#D9A46E',beard:false,blush:true,skin:'#C4875D'});
  /* gelembung pikiran */
  const bub=(x,y,icon)=>{const g=G({},p),j=J(g,x,y);CI(-70,110,14,C.white,g);CI(-40,74,22,C.white,g);CI(0,0,86,C.white,g);icon(g);LN('M -44 -44 L 44 44 M 44 -44 L -44 44',C.coral,14,g);return j;};
  P2.b1=bub(520,300,g=>{LN('M 0 50 L 0 -20',C.lime2,9,g);PA('M 0 -10 C -40 -10 -50 -40 -46 -58 C -20 -56 -2 -40 0 -10 Z',C.lime,g);PA('M 0 -24 C 36 -26 48 -54 44 -70 C 18 -68 2 -52 0 -24 Z',C.lime2,g);R(-44,44,88,16,C.wood,8,g);});
  P2.b2=bub(820,250,g=>{R(-12,-56,24,96,C.sun,6,g,{transform:'rotate(32)'});PA('M -12 40 L 0 64 L 12 40 Z',C.bone,g,{transform:'rotate(32)'});R(-50,30,70,8,C.ink,4,g);R(-50,46,50,8,C.ink,4,g);});
}
cut(9.2,P1,P2);Object.assign(P2.cam,{x:900,y:620,z:1.2});P2.apply();
P2.flames.forEach((j,i)=>{tl.to(j,{sy:1.16,sx:.92,duration:.21+i*.05,yoyo:true,repeat:-1,ease:'sine.inOut',onUpdate:j.apply},9);sway(j,9,4-i,.37+i*.07);});
tl.to(P2.glow,{keyframes:{opacity:[1,.7,1],easeEach:'sine.inOut'},duration:.9,repeat:-1},9);
P2.sparks.forEach((s,i)=>drift(s,9+(i*.23)%1.2,{y:-260-rnd(i)*120,x:(rnd(i+2)-.5)*80,dur:1.4+rnd(i)*.8,peak:1}));
P2.smoke.forEach((s,i)=>drift(s,9+i*.5,{y:-380,x:40,scale:1.8,dur:3,peak:.5}));
P2.clouds.forEach((c,i)=>tl.fromTo(c,{x:0},{x:160-i*40,duration:6,ease:'none',immediateRender:false},9));
P2.birds.forEach((b,i)=>tl.fromTo(b,{x:-40,y:0},{x:420,y:-40,duration:6,ease:'none',immediateRender:false},9+i*.4));
idle(P2.dad,9);idle(P2.kid,9.3);
rot(P2.dad.Rarm,9.2,-42,.01);rot(P2.dad.Rfore,9.2,-18,.01);tl.to(P2.dad.Rfore,{r:-34,duration:.55,yoyo:true,repeat:-1,ease:'sine.inOut',onUpdate:P2.dad.Rfore.apply},9.4);
sway(P2.kid.Larm,9.4,10,.8);
cam(P2,11.6,800,540,1.34,1.4,'power2.inOut');
pop(P2.b1,12.9);pop(P2.b2,13.9);face(P2.dad,'cemas',13.0);
rot(P2.kid.Rarm,13.9,-96,.6,'power2.out');rot(P2.kid.Rfore,13.9,-6,.6);rot(P2.kid.head,13.9,8,.6);face(P2.kid,'senang',13.9);
show(P2.newPrint,14.6,.35);
cam(P2,14.3,1450,640,1.9,.8,'power2.inOut');

/* =====================================================================
   PANGGUNG 3 — KAMAR: tangan + HP (match cut), pesan terbang ke globe
   "Sekarang..." 15.3 · "satu detik" ~19.3 · "Bagaimana bisa begitu?" 20.2
   ===================================================================== */
const P3=scene('kamar');{const p=P3.g,gy=980;
  R(-600,-400,3200,1900,'url(#room)',0,p);
  for(let i=0;i<14;i++)CI(-200+i*190,120+(i%2)*90,10,C.lilac,p,{opacity:.35});
  PA('M -600 900 L 2600 900 L 2600 1500 L -600 1500 Z',C.lilac2,p);R(-600,900,3200,14,sh(C.lilac2,.85),0,p);EL(820,990,420,46,C.mint,p,{opacity:.8});
  /* jendela + kota */
  const wg=G({},p);R(1230,230,460,400,C.white,24,wg);R(1250,250,420,360,'url(#city)',14,wg);
  P3.clouds=[cloud(wg,1400,330,.4),cloud(wg,1580,300,.3)];
  [[1260,150],[1320,230],[1380,120],[1440,260],[1510,170],[1580,210],[1630,130]].forEach(([x,h],i)=>{R(x,610-h,56,h,i%2?C.blue2:C.blue,4,wg);for(let k=0;k<3;k++)R(x+12,610-h+20+k*40,12,16,C.sun,2,wg,{opacity:(i+k)%3?0:.9});});
  LN('M 1460 250 L 1460 610 M 1250 430 L 1670 430',C.white,12,wg);
  /* poster roket + jam + kasur */
  R(280,200,220,300,C.ink,16,p);PA('M 390 250 C 430 300 430 380 410 420 L 370 420 C 350 380 350 300 390 250 Z',C.coral,p);CI(390,330,18,C.sky,p);P3.rf=PA('M 372 420 L 390 470 L 408 420 Z',C.sun,p);
  CI(960,230,64,C.white,p);CI(960,230,54,C.paper,p);const hand=G({},p);P3.clock=J(hand,960,230);LN('M 0 0 L 0 -40',C.ink,6,hand);LN('M 0 0 L 26 0',C.coral,6,p,{transform:'translate(960 230)'});CI(960,230,7,C.ink,p);
  R(-80,700,520,200,C.pink,30,p);R(-80,660,520,70,C.white,30,p);R(320,600,120,110,C.sun,24,p);
  /* meja + globe */
  R(1250,760,420,26,C.ink,10,p);R(1280,786,24,120,C.ink,8,p);R(1620,786,24,120,C.ink,8,p);
  const gl=G({},p);LN('M 1460 760 L 1460 730',C.ink,10,gl);EL(1460,760,50,10,C.ink,gl);CI(1460,630,100,C.blue,gl);
  const gcl=N('clipPath',{id:'globeC'},defs);CI(1460,630,100,null,gcl);
  const land=G({'clip-path':'url(#globeC)'},gl);P3.land=G({},land);for(let k=0;k<2;k++){PA(`M ${1380+k*420} 570 C ${1420+k*420} 550 ${1470+k*420} 580 ${1450+k*420} 620 C ${1430+k*420} 660 ${1390+k*420} 640 ${1380+k*420} 600 Z`,C.lime,P3.land);PA(`M ${1500+k*420} 640 C ${1540+k*420} 630 ${1580+k*420} 660 ${1560+k*420} 700 C ${1530+k*420} 720 ${1500+k*420} 690 ${1500+k*420} 640 Z`,C.lime,P3.land);PA(`M ${1300+k*420} 660 C ${1330+k*420} 650 ${1350+k*420} 680 ${1330+k*420} 700 C ${1310+k*420} 710 ${1290+k*420} 690 ${1300+k*420} 660 Z`,C.lime,P3.land);}
  P3.net=[];[[1400,590,1520,600],[1520,600,1480,690],[1480,690,1400,590],[1400,590,1470,640],[1520,600,1470,640]].forEach(([a,b,c,d])=>P3.net.push(LN(`M ${a} ${b} L ${c} ${d}`,C.sun,5,gl,{'stroke-dasharray':200,'stroke-dashoffset':200})));
  P3.nodes=[[1400,590],[1520,600],[1480,690],[1470,640]].map(([x,y])=>CI(x,y,9,C.sun,gl,{opacity:0}));
  /* tanaman */
  const pl=G({},p);R(1730,800,120,110,C.coral,18,pl);P3.leaves=[[-30,-70],[0,-110],[34,-80]].map(([dx,len],i)=>{const g=G({},pl),j=J(g,1790,800);PA(`M 0 0 C ${dx-40} ${len*.5} ${dx-10} ${len} ${dx} ${len} C ${dx+20} ${len*.6} 20 ${len*.3} 0 0 Z`,i%2?C.lime2:C.mint,g);return j;});
  P3.boy=character(p,820,gy,1.0,BIMA);
  const ph=G({},P3.boy.Rhand.el);R(-24,-34,48,84,C.ink,9,ph);P3.screen=R(-19,-28,38,68,C.sky,6,ph);CI(0,-4,8,C.white,ph,{opacity:.8});
  P3.msgs=[0,1,2].map(i=>{const g=G({opacity:0},p);R(-34,-24,68,48,i===1?C.sun:C.white,10,g);LN('M -30 -20 L 0 4 L 30 -20',C.blue,5,g);return g;});
  P3.q=G({},p);const qj=J(P3.q,640,330);P3.qj=qj;CI(0,0,62,C.white,P3.q);TX(0,26,'?',84,C.coral,P3.q,{'font-weight':700});
}
cut(15.1,P2,P3);Object.assign(P3.cam,{x:965,y:700,z:1.95});P3.apply();
idle(P3.boy,15.1);rot(P3.boy.Rarm,15.0,-25,.01);rot(P3.boy.Rfore,15.0,-95,.01);rot(P3.boy.head,15.1,6,.4);
tl.to(P3.screen,{keyframes:{fill:[C.sky,C.mint,C.sky]},duration:.8,repeat:-1},15.1);
cam(P3,15.5,1060,600,1.2,1.5,'power2.inOut');
P3.msgs.forEach((m,i)=>{const at=16.6+i*.8;flyAlong(m,`M 975 690 C ${1080+i*30} ${430-i*60} ${1300+i*40} ${440+i*30} ${[1400,1520,1480][i]} ${[590,600,690][i]}`,at,.75,{scale:1,ease:'power2.inOut'});
  tl.set(m,{opacity:1},at);tl.to(m,{opacity:0,duration:.15},at+.72);rot(P3.boy.Rarm,at,-40,.15);rot(P3.boy.Rarm,at+.15,-25,.25);});
P3.net.forEach((n,i)=>tl.to(n,{attr:{'stroke-dashoffset':0},duration:.4,ease:'power2.out'},18.6+i*.12));P3.nodes.forEach((n,i)=>show(n,17.35+i*.6,.2));
tl.fromTo(P3.land,{x:0},{x:-420,duration:6,ease:'none',repeat:-1,immediateRender:false},15.1);
cam(P3,18.3,1300,620,1.4,1.1,'power2.inOut');
cam(P3,19.9,870,560,1.38,.9,'power2.inOut');
face(P3.boy,'kaget',20.2);rot(P3.boy.Larm,20.25,150,.4,'back.out(1.4)');rot(P3.boy.Lfore,20.25,40,.4);tl.to(P3.boy.Lfore,{r:55,duration:.16,yoyo:true,repeat:5,ease:'sine.inOut',onUpdate:P3.boy.Lfore.apply},20.7);
pop(P3.qj,20.4);sway(P3.qj,20.9,10,.5);
spin(P3.clock,15.1,6);P3.leaves.forEach((j,i)=>sway(j,15.1+i*.3,7,1.4+i*.2));P3.clouds.forEach((c,i)=>tl.fromTo(c,{x:0},{x:80,duration:7,ease:'none',immediateRender:false},15.1));
tl.to(P3.rf,{keyframes:{opacity:[1,.4,1]},duration:.3,repeat:-1},15.1);

/* =====================================================================
   PANGGUNG 4 — HALAMAN + KAPSUL WAKTU: dial berputar ke −300.000
   VO3 22.4 · "tiga ratus ribu tahun" ~25.6–26.9 · "sebelas menit" ~27.0 · "Siap?" 28.7 · "Kita berangkat!" 29.45
   ===================================================================== */
const P4=scene('kapsul');{const p=P4.g,gy=960;
  R(-600,-1400,3200,2900,'url(#skyA)',0,p);P4.clouds=[cloud(p,300,240,1),cloud(p,1300,180,.8),cloud(p,1800,320,.6),cloud(p,700,-200,.9),cloud(p,1500,-500,.7)];
  PA('M -600 800 C -200 640 300 760 700 680 C 1100 600 1500 720 2000 660 C 2300 620 2500 700 2600 690 L 2600 1200 L -600 1200 Z',C.mint,p);
  R(-600,gy,3200,600,C.lime2,0,p);R(-600,gy-10,3200,22,C.lime,0,p);
  for(let i=0;i<18;i++){R(-300+i*160,gy-110,18,110,C.white,6,p);}R(-600,gy-90,3200,14,C.white,6,p);R(-600,gy-46,3200,14,C.white,6,p);
  P4.trees=[[60,1.0],[1800,.85]].map(([x,s])=>{R(x-16,gy-300*s,32,300*s,'#6E5A48',12,p);const g=G({},p),j=J(g,x,gy-300*s);CI(0,-60*s,130*s,C.mint2,g);CI(-80*s,0,90*s,C.mint,g);CI(90*s,-10*s,100*s,C.mint,g);return j;});
  P4.tufts=[];for(let i=0;i<10;i++)P4.tufts.push(tuft(p,-200+i*260+rnd(i)*80,gy+40+rnd(i+4)*60,1.1,C.lime));
  P4.flies=[0,1].map(i=>{const g=G({},p),b=G({transform:`translate(${400+i*1100},${700-i*80})`},g);const wl=G({},b),wr=G({},b);EL(-14,0,16,12,i?C.pink:C.sun,wl);EL(14,0,16,12,i?C.pink:C.sun,wr);R(-3,-10,6,20,C.ink,3,b);
    const jl=J(wl),jr=J(wr);tl.to(jl,{sx:.2,duration:.12,yoyo:true,repeat:-1,ease:'sine.inOut',onUpdate:jl.apply},0);tl.to(jr,{sx:.2,duration:.12,yoyo:true,repeat:-1,ease:'sine.inOut',onUpdate:jr.apply},0);return g;});
  P4.cap=makeCapsule(p,1060,gy);
  P4.puffs=[];for(let i=0;i<10;i++)P4.puffs.push(CI(1060+(rnd(i)-.5)*380,gy,30+rnd(i+2)*30,C.white,p,{opacity:0}));
  P4.nara=character(p,380,gy,.8,NARA);P4.bima=character(p,190,gy,.8,BIMA);
}
slide(21.9,P3,P4,'x',96);tl.set(P4.cap.num,{opacity:0},0);tl.to(P4.cap.num,{opacity:1,duration:.2},24.4);Object.assign(P4.cam,{x:860,y:600,z:1.16});P4.apply();
idle(P4.nara,22.2);idle(P4.bima,22.4);
walk(P4.nara,22.3,2.0,740);walk(P4.bima,22.45,1.95,780);
tl.to([P4.nara.place,P4.nara.sd,P4.bima.place,P4.bima.sd],{opacity:0,duration:.2},24.35);
tl.fromTo(P4.cap.door,{attr:{height:0}},{attr:{height:230},duration:.01,immediateRender:false},0);
tl.set(P4.cap.door,{attr:{height:0}},0);tl.to(P4.cap.door,{attr:{height:230},duration:.35,ease:'power2.in'},24.3);
show(P4.cap.faces,24.7,.25);
cam(P4,24.4,930,690,1.72,.9,'power2.inOut');
const dialV={v:2026};tl.to(dialV,{v:-300000,duration:2.3,ease:'power3.inOut',onUpdate(){P4.cap.num.textContent=fmt(dialV.v);}},24.7);
tl.fromTo(P4.cap.num,{attr:{'font-size':42}},{attr:{'font-size':48},duration:.18,yoyo:true,repeat:1,ease:'power2.out',immediateRender:false},27.0);
tl.to(P4.cap.num,{fill:C.sun,duration:.01},27.0);show(P4.cap.sub,27.2,.3);
cam(P4,28.2,1060,560,1.22,1.0,'power2.inOut');
P4.cap.lights.forEach((l,i)=>{tl.to(l,{keyframes:{opacity:[1,.25,1]},duration:1.2,repeat:-1,ease:'none'},22+i*.17);});
tl.to(P4.cap.tip,{keyframes:{opacity:[1,.2,1]},duration:.6,repeat:-1},22);
tl.to(P4.cap.body,{x:7,duration:.05,yoyo:true,repeat:30,ease:'sine.inOut',onUpdate:P4.cap.body.apply},28.8);
P4.puffs.forEach((pf,i)=>drift(pf,29.0+i*.08,{y:-120,x:(rnd(i)-.5)*260,scale:2,dur:1.2,peak:.95}));
show(P4.cap.flame,29.95,.15);tl.to(P4.cap.flame,{keyframes:{opacity:[1,.7,1]},duration:.12,repeat:-1},30.1);
tl.to(P4.cap.body,{y:-1500,duration:.75,ease:'power2.in',onUpdate:P4.cap.body.apply},30.3);tl.to(P4.cap.sd,{opacity:0,attr:{rx:60},duration:.5},30.3);
cam(P4,30.25,1060,300,1.25,.6,'power2.in');
P4.clouds.forEach((c,i)=>tl.fromTo(c,{x:0},{x:120+i*20,duration:9,ease:'none',immediateRender:false},22));P4.trees.forEach((j,i)=>sway(j,22+i*.4,2,1.8));P4.tufts.forEach((j,i)=>sway(j,22+i*.1,8,.9+rnd(i)*.5));
P4.flies.forEach((f,i)=>tl.fromTo(f,{x:0,y:0},{x:260-i*400,y:-60,duration:4,ease:'sine.inOut',yoyo:true,repeat:-1,immediateRender:false},22));

/* =====================================================================
   PANGGUNG 5 — SABANA AFRIKA: kapsul mendarat, peta 3 titik, Jebel Irhoud, fosil, manusia bijak, topi
   VO4 32.4 · "Afrika" 33.9 · "Jebel Irhoud" 37.6 · "fosil tertua" ~40.4 · "Homo sapiens" ~42.9 · "manusia bijak" ~44.9
   "Wajah mereka" 46.6 · "memakai topi" ~49.9 · cut jalan raya 51.0
   ===================================================================== */
const P5=scene('sabana');{const p=P5.g,gy=940;
  R(-600,-600,3600,2200,'url(#skyS)',0,p);
  const sun=G({},p);P5.rays=J(sun,1480,250);for(let i=0;i<12;i++)R(-10,-210,20,70,C.sun,10,sun,{transform:`rotate(${i*30})`,opacity:.7});CI(1480,250,120,C.sun,p);
  P5.clouds=[cloud(p,500,200,.8),cloud(p,2000,160,.6)];
  PA('M -600 760 C -200 650 200 720 600 660 C 1000 600 1400 690 1800 640 C 2200 600 2600 680 3000 650 L 3000 1000 L -600 1000 Z',C.lilac,p,{opacity:.55});
  PA('M -600 830 C 0 780 600 830 1200 800 C 1800 770 2400 820 3000 800 L 3000 1000 L -600 1000 Z',C.mint,p,{opacity:.7});
  const gir=G({},p);P5.gir=gir;const gb=G({transform:'translate(700,820) scale(.6)'},gir);EL(0,-120,70,34,C.lilac2,gb);LN('M 50 -130 L 100 -260',C.lilac2,24,gb);EL(110,-268,26,14,C.lilac2,gb);
  P5.gl=[[-40,0],[-14,0],[30,0],[52,0]].map(([x])=>{const g=G({},gb),j=J(g,x,-100);R(-6,0,12,100,C.lilac2,6,g);return j;});
  R(-600,gy,3600,700,C.sand,0,p);R(-600,gy-10,3600,24,C.lime2,0,p);
  P5.trees=[[180,1.0],[2150,.9],[1250,.45]].map(([x,s])=>{LN(`M ${x} ${gy} C ${x+10} ${gy-150*s} ${x-30} ${gy-260*s} ${x+20} ${gy-360*s}`,'#6A5A4A',26*s,p);const g=G({},p),j=J(g,x+20,gy-360*s);
    EL(0,-10*s,240*s,50*s,C.mint2,g);EL(-60*s,-46*s,160*s,40*s,C.mint,g);EL(70*s,-40*s,150*s,36*s,C.mint,g);return j;});
  P5.tufts=[];for(let i=0;i<12;i++)P5.tufts.push(tuft(p,-200+i*230+rnd(i+50)*90,gy+30+rnd(i+8)*80,1.2,C.lime2));
  P5.birds=[bird(p,300,260,1.1),bird(p,380,300,.8),bird(p,460,250,.9)];
  /* papan peta Afrika */
  const bd=G({transform:'translate(1050,940)'},p);R(-230,-120,26,120,C.wood,8,bd);R(204,-120,26,120,C.wood,8,bd);shadow(0,4,260,bd);
  R(-310,-640,620,540,C.wood,26,bd);R(-290,-620,580,500,C.indigo,18,bd);
  const af=G({transform:'translate(-200,-605)'},bd);const PA5=(lo,la)=>[(lo+18)*5.8,(38-la)*5.8+10];
  PA(landD(PETA.afrika,PA5,[-30,60,-40,40]),C.lime,af,{stroke:sh(C.lime,.8),'stroke-width':2,'stroke-linejoin':'round'});
  /* titik: Jebel Irhoud (Maroko), Omo Kibish (Etiopia), Florisbad (Afrika Selatan) */
  const AFP=[[-8.9,31.9],[35.9,5.4],[26.0,-28.7]].map(([a,b])=>PA5(a,b));
  P5.dots=AFP.map(([x,y])=>{const g=G({},af),j=J(g,x,y);CI(0,0,16,C.coral,g);CI(0,0,6,C.white,g);return j;});
  P5.rings=AFP.map(([x,y])=>CI(x,y,16,'none',af,{stroke:C.coral,'stroke-width':4,opacity:0}));
  const tg=G({},af);P5.tag=J(tg,AFP[0][0]+34,AFP[0][1]-22);R(0,-44,250,96,C.white,14,tg);PA('M 0 -6 L -18 0 L 0 8 Z',C.white,tg);TX(125,-4,'Jebel Irhoud',36,C.ink,tg,{'font-weight':700});TX(125,36,'Maroko',30,C.mint2,tg);
  /* lubang galian + fosil */
  P5.mound=PA('M 1440 950 C 1480 880 1560 880 1600 950 Z',C.sand2,p);
  EL(1680,960,230,52,'#C79A62',p);EL(1680,968,200,40,'#A97F4E',p);
  const skG=G({},p);P5.skull=J(skG,1690,1090);PA('M -70 -20 C -80 -110 80 -110 70 -20 C 70 0 50 10 40 10 L 40 30 L -40 30 L -40 10 C -50 10 -70 0 -70 -20 Z',C.bone,skG);
  EL(-28,-28,18,16,'#8A6A4A',skG);EL(28,-28,18,16,'#8A6A4A',skG);PA('M 0 -10 L -8 6 L 8 6 Z','#8A6A4A',skG);[-24,-8,8,24].forEach(x=>R(x-5,14,10,14,'#E9DAB8',3,skG));
  PA('M 1450 962 C 1560 1010 1800 1010 1910 962 L 1910 1300 L 1450 1300 Z',C.sand,p);
  P5.spark=G({opacity:0},p);[[1690,860],[1600,900],[1790,890]].forEach(([x,y])=>PA(`M ${x} ${y-22} L ${x+6} ${y-6} L ${x+22} ${y} L ${x+6} ${y+6} L ${x} ${y+22} L ${x-6} ${y+6} L ${x-22} ${y} L ${x-6} ${y-6} Z`,C.white,P5.spark));
  const cd=G({},p);P5.card=J(cd,1690,600);R(-230,-80,460,170,C.white,22,cd);R(-230,-80,20,170,C.mint,10,cd);TX(10,-6,'Homo sapiens',58,C.ink,cd,{'font-style':'italic','font-weight':700});
  P5.card2=TX(10,58,'= manusia bijak',40,C.mint2,cd,{opacity:0});
  P5.cap=makeCapsule(p,420,gy);P5.cap.num.textContent=fmt(-300000);P5.cap.num.setAttribute('fill',C.sun);P5.cap.sub.setAttribute('opacity',1);
  P5.dust=[];for(let i=0;i<9;i++)P5.dust.push(CI(420+(rnd(i+60)-.5)*420,gy,26+rnd(i)*26,C.sand2,p,{opacity:0}));
  P5.nara=character(p,515,gy,.8,NARA);P5.bima=character(p,515,gy,.8,BIMA);
  P5.purba=character(p,2520,gy,1.0,{...PURBA,who:'sapiens'});
  const cpG=G({},P5.purba.headAcc);P5.topi=J(cpG,0,0);PA('M -80 -126 C -76 -196 76 -196 80 -126 Z',C.coral,cpG);R(30,-140,96,20,sh(C.coral,.8),10,cpG);CI(0,-192,10,C.sun,cpG);
}
slide(31.1,P4,P5,'y',72);Object.assign(P5.cam,{x:700,y:620,z:1.16});P5.apply();
tl.set(P5.cap.body,{y:-1300,onUpdate:P5.cap.body.apply},0);tl.set(P5.cap.sd,{opacity:0},0);
tl.to(P5.cap.body,{y:0,duration:.55,ease:'power2.in',onUpdate:P5.cap.body.apply},31.4);tl.to(P5.cap.sd,{opacity:.16,duration:.4},31.6);
tl.to(P5.cap.body,{sy:.9,sx:1.06,duration:.12,yoyo:true,repeat:1,ease:'power2.out',onUpdate:P5.cap.body.apply},31.95);
P5.dust.forEach((d,i)=>tl.fromTo(d,{opacity:0,x:0,y:0,scale:.6,transformOrigin:'50% 50%'},{keyframes:{opacity:[0,.9,0]},x:(rnd(i)-.5)*300,y:-60-rnd(i+1)*60,scale:1.8,duration:1.1,ease:'power2.out',immediateRender:false},31.95));
show(P5.cap.faces,0,.01);hide(P5.cap.faces,32.6,.2);
tl.set(P5.cap.door,{attr:{height:230}},0);tl.to(P5.cap.door,{attr:{height:0},duration:.35,ease:'power2.out'},32.5);
[P5.nara,P5.bima].forEach(ch=>tl.set([ch.place,ch.sd],{opacity:0},0));tl.set([P5.nara.place,P5.nara.sd,P5.bima.place,P5.bima.sd],{opacity:1},32.75);
idle(P5.nara,32.8);idle(P5.bima,33.0);walk(P5.nara,32.8,1.2,300);walk(P5.bima,32.95,2.0,900);
P5.dots.forEach((d,i)=>{pop(d,34.0+i*.45,.45);tl.to(P5.rings[i],{keyframes:{opacity:[0,.9,0],easeEach:'none'},attr:{r:46},duration:1.2,repeat:-1,ease:'power1.out'},34.2+i*.45);});
rot(P5.nara.Rarm,34.0,-80,.5,'power2.out');rot(P5.nara.Rfore,34.0,-12,.5);rot(P5.nara.head,34.0,6,.5);
cam(P5,34.2,1000,560,1.3,1.2,'power2.inOut');
cam(P5,37.3,1000,520,1.62,1.0,'power2.inOut');
tl.to(P5.dots[0],{sx:1.5,sy:1.5,duration:.3,ease:'back.out(3)',onUpdate:P5.dots[0].apply},37.6);pop(P5.tag,37.75,.5);
rot(P5.nara.Rarm,38.6,0,.5);rot(P5.nara.Rfore,38.6,0,.5);
cam(P5,39.7,1640,760,1.55,1.1,'power2.inOut');
rot(P5.bima.Rarm,39.6,-60,.4);tl.to(P5.bima.Rfore,{r:-50,duration:.22,yoyo:true,repeat:11,ease:'sine.inOut',onUpdate:P5.bima.Rfore.apply},39.9);
tl.to(P5.mound,{attr:{d:'M 1440 950 C 1480 930 1560 930 1600 950 Z'},duration:1.4,ease:'power1.inOut'},40.0);
tl.to(P5.skull,{y:-112,duration:1.5,ease:'power2.out',onUpdate:P5.skull.apply},40.2);
tl.to(P5.spark,{keyframes:{opacity:[0,1,0,1,0]},duration:1.3},41.5);face(P5.bima,'kaget',41.6);rot(P5.bima.Rarm,42.3,0,.4);rot(P5.bima.Rfore,42.3,0,.4);
pop(P5.card,42.9,.55);show(P5.card2,44.7,.4);
cam(P5,42.6,1690,660,1.48,.8,'power2.inOut');
hide(P5.card.el,46.2,.3);
walk(P5.purba,45.3,1.7,-600);idle(P5.purba,45.6);face(P5.purba,'senang',46.6);face(P5.bima,'senang',46.8);
cam(P5,46.4,1700,600,1.42,.9,'power2.inOut');
cam(P5,48.8,1900,470,1.85,.8,'power2.inOut');
tl.set(P5.topi.el,{opacity:0},0);tl.set(P5.topi,{y:-460,onUpdate:P5.topi.apply},0);tl.set(P5.topi.el,{opacity:1},49.7);
tl.to(P5.topi,{y:0,duration:.5,ease:'bounce.out',onUpdate:P5.topi.apply},49.7);face(P5.purba,'lebar',50.2);rot(P5.purba.head,50.2,-6,.3);
spin(P5.rays,31,40);P5.trees.forEach((j,i)=>sway(j,31+i*.5,1.5,2));P5.tufts.forEach((j,i)=>sway(j,31+i*.13,9,.8+rnd(i)*.6));
P5.birds.forEach((b,i)=>tl.fromTo(b,{x:0,y:0},{x:1900,y:-80+i*20,duration:14,ease:'none',immediateRender:false},31+i*.2));
P5.clouds.forEach((c,i)=>tl.fromTo(c,{x:0},{x:200,duration:20,ease:'none',immediateRender:false},31));
tl.fromTo(P5.gir,{x:0},{x:520,duration:20,ease:'none',immediateRender:false},31);P5.gl.forEach((j,i)=>{tl.fromTo(j,{r:-14},{r:14,duration:.5,yoyo:true,repeat:-1,ease:'sine.inOut',onUpdate:j.apply,immediateRender:false},31+(i%2)*.5);});

/* =====================================================================
   PANGGUNG 6 — JALAN RAYA: manusia purba bertopi berjalan, tak ada yang sadar
   "berjalan di jalan raya" ~51.3 · "manusia purba" ~55.2 · [laughs] 55.6
   ===================================================================== */
const P6=scene('jalan');{const p=P6.g,gy=900;
  R(-600,-600,3600,2200,'url(#city)',0,p);P6.clouds=[cloud(p,400,180,.8),cloud(p,1500,140,.6),cloud(p,2300,220,.7)];
  const cols=[C.pink,C.lilac,C.blue,C.sun,C.mint,C.coral,C.lilac2,C.sky,C.pink];P6.win=[];
  for(let i=0;i<10;i++){const x=-300+i*290,h=380+rnd(i+70)*300,c=cols[i%cols.length];R(x,gy-h,270,h,c,10,p);R(x,gy-h,270,24,sh(c,.85),10,p);
    for(let r=0;r<Math.floor(h/110);r++)for(let k=0;k<3;k++){const w=R(x+30+k*80,gy-h+60+r*100,50,60,C.white,8,p,{opacity:.85});if((i+r+k)%4===0)P6.win.push(w);}}
  R(-600,gy,3600,60,'#E8E6E0',0,p);for(let i=0;i<36;i++)R(-600+i*100,gy,4,60,'#CFCFD6',0,p);
  R(-600,gy+60,3600,700,C.ink,0,p);P6.lane=G({},p);for(let i=0;i<30;i++)R(-600+i*160,gy+150,90,14,C.white,7,P6.lane,{opacity:.8});
  R(1960,gy-420,20,420,C.ink,8,p);R(1930,gy-560,80,160,C.ink,16,p);P6.tl=[CI(1970,gy-520,20,C.coral,p),CI(1970,gy-470,20,'#454A60',p),CI(1970,gy-430,20,'#454A60',p)];
  P6.pots=[[260,.9],[1250,.8]].map(([x,s])=>{R(x-50,gy-90,100,90,C.coral,14,p);const g=G({},p),j=J(g,x,gy-90);CI(0,-80*s,80*s,C.mint2,g);CI(-40*s,-40*s,50*s,C.mint,g);return j;});
  P6.cars=[[C.sun,0],[C.coral,1]].map(([col,i])=>{const g=G({},p),b=G({transform:`translate(0,${gy+200-i*40})`},g);R(-150,-90,300,90,col,26,b);R(-90,-140,170,60,col,22,b);R(-76,-128,66,44,C.sky,8,b);R(0,-128,66,44,C.sky,8,b);
    const wh=[-90,90].map(x=>{const w=G({},b),j=J(w,x,0);CI(0,0,32,C.night,w);CI(0,0,12,C.paper,w);R(-3,-30,6,20,C.paper,3,w);return j;});return {g,wh};});
  P6.purba=character(p,300,gy,1.0,{...PURBA,who:'sapiens'});
  const cpG=G({},P6.purba.headAcc);PA('M -80 -126 C -76 -196 76 -196 80 -126 Z',C.coral,cpG);R(30,-140,96,20,sh(C.coral,.8),10,cpG);CI(0,-192,10,C.sun,cpG);
  P6.warga=character(p,1900,gy,.95,{who:'warga',shirt:C.mint,pants:C.indigo,hair:'#3A2F5C',skin:'#D49A72'});
  P6.nara=character(p,1680,gy,.8,NARA);const ph=G({},P6.nara.Rhand.el);R(-22,-30,44,76,C.ink,9,ph);R(-17,-24,34,60,C.sky,6,ph);
}
cut(51.0,P5,P6);Object.assign(P6.cam,{x:640,y:600,z:1.34});P6.apply();
idle(P6.purba,51.0);idle(P6.warga,51.0);idle(P6.nara,51.0);face(P6.purba,'senang',51);
walk(P6.purba,51.0,5.0,1180);walk(P6.warga,51.2,4.6,-1000);
rot(P6.nara.Rarm,51,-25,.01);rot(P6.nara.Rfore,51,-95,.01);rot(P6.nara.head,51,10,.01);
tl.to(P6.cam,{x:1420,duration:5.2,ease:'sine.inOut',onUpdate:P6.apply},51.1);
rot(P6.nara.head,54.0,-10,.25,'back.out(2)');face(P6.nara,'kaget',54.0);rot(P6.nara.Rarm,54.1,0,.3);rot(P6.nara.Rfore,54.1,-30,.3);
face(P6.nara,'lebar',55.5);hop(P6.nara,55.6);face(P6.purba,'lebar',55.4);
P6.cars.forEach((c,i)=>{tl.fromTo(c.g,{x:i?2800:-400},{x:i?-400:2800,duration:3.4+i,ease:'none',repeat:-1,immediateRender:false},51+i*.6);c.wh.forEach(j=>spin(j,51,i?-.5:.5));});
tl.fromTo(P6.lane,{x:0},{x:-160,duration:.8,ease:'none',repeat:-1,immediateRender:false},51);
P6.win.forEach((w,i)=>tl.to(w,{keyframes:{fill:[C.white,C.sun,C.white]},duration:1.6+rnd(i)*.8,repeat:-1,ease:'none'},51+rnd(i+3)));
P6.pots.forEach((j,i)=>sway(j,51+i*.3,3,1.4));P6.clouds.forEach(c=>tl.fromTo(c,{x:0},{x:140,duration:7,ease:'none',immediateRender:false},51));
tl.to(P6.tl[0],{keyframes:{opacity:[1,1,.35,.35]},duration:2,repeat:-1,ease:'none'},51);

/* =====================================================================
   PANGGUNG 7 — AULA SAUDARA JAUH: lampu sorot satu per satu, lalu padam; tinggal kita
   VO5 57.4 · "Neanderthal di Eropa" 60.6 · "Indonesia juga..." 62.5 · "Homo erectus" ~64.9
   "Homo floresiensis" ~68.8 · "sudah punah" ~75.5 · "Yang tersisa hanya kita" 77.8
   ===================================================================== */
const P7=scene('aula');{const p=P7.g,gy=880;
  R(-700,-600,3800,2200,'url(#curtain)',0,p);
  P7.folds=G({},p);for(let i=0;i<22;i++)R(-700+i*170,-600,60,1500,'#454A6A',30,P7.folds,{opacity:.35});
  PA('M -700 -600 L 3100 -600 L 3100 -60 C 2600 40 2200 -40 1800 20 C 1400 80 1000 -20 600 30 C 200 80 -300 -10 -700 40 Z',C.coral,p,{opacity:.9});
  R(-700,gy+140,3800,800,'#2A2D40',0,p);R(-700,gy+140,3800,10,'#3A3E58',0,p);
  P7.refl=[];for(let i=0;i<6;i++)P7.refl.push(R(-300+i*480,gy+200,220,10,C.lilac,5,p,{opacity:.18}));
  const SP=[{x:420,o:{who:'nean',shirt:'#B77A4A',skin:'#C98A62',hair:'#5A3A2A',style:'wild',tunic:true,beard:true,brow:true,sx:1.2},s:.95,t:'Neanderthal',u:'Eropa'},
    {x:900,o:{who:'erectus',shirt:'#D08B4C',skin:'#A86B47',hair:'#2E2140',style:'wild',tunic:true,beard:true,brow:true,sx:.95},s:1.0,t:'Homo erectus',u:'Sangiran · Trinil'},
    {x:1340,o:{who:'flores',shirt:'#E0A25A',skin:'#B57850',hair:'#3A2A44',style:'wild',tunic:true,brow:true},s:.6,t:'H. floresiensis',u:'Liang Bua, Flores'},
    {x:1790,o:{...PURBA,who:'sapiens'},s:1.0,t:'Homo sapiens',u:'kita'}];
  P7.spots=[];P7.figs=[];P7.lv=[];
  SP.forEach((d,i)=>{const cone=PA(`M ${d.x-70} -120 L ${d.x+70} -120 L ${d.x+250} ${gy} L ${d.x-250} ${gy} Z`,'url(#spot)',p,{opacity:0});
    const pool=EL(d.x,gy,250,40,C.sun,p,{opacity:0});
    const ped=G({'data-jaga':''},p);R(d.x-180,gy,360,150,C.lilac2,14,ped);R(d.x-180,gy,360,20,C.lilac,10,ped);R(d.x-160,gy+38,320,98,C.white,14,ped);
    TX(d.x,gy+80,d.t,36,C.ink,ped,{'font-weight':700,'font-style':i?'italic':'normal'});TX(d.x,gy+122,d.u,30,C.mint2,ped);
    const fig=character(p,d.x,gy,d.s,d.o);const lv={b:.3};const ap=()=>{fig.place.style.filter=`brightness(${lv.b}) saturate(${.4+lv.b*.6})`;};ap();lv.ap=ap;
    const motes=[];for(let k=0;k<5;k++)motes.push(CI(d.x+(rnd(i*9+k)-.5)*300,gy-60,4+rnd(k)*3,'#F4ECCF',p,{opacity:0}));
    P7.spots.push({cone,pool,motes});P7.figs.push(fig);P7.lv.push(lv);});
  const bn=G({},p);P7.banner=J(bn,1120,70);LN('M -340 0 L 340 0',C.paper,6,bn);LN('M -300 0 L -300 60 M 300 0 L 300 60',C.paper,4,bn);
  R(-300,60,600,80,C.red,10,bn);R(-300,130,600,80,C.white,10,bn);TX(0,190,'Indonesia',54,C.red,bn,{'font-weight':700});
  P7.nara=character(p,2340,gy+20,.78,NARA);P7.bima=character(p,2480,gy+20,.78,BIMA);
}
slide(57.0,P6,P7,'x',96);Object.assign(P7.cam,{x:1100,y:710,z:1.12});P7.apply();
P7.figs.forEach((f,i)=>idle(f,57.3+i*.2));idle(P7.nara,57.3);idle(P7.bima,57.5);
const spotOn=(i,at,b=1)=>{const s=P7.spots[i];tl.to(s.cone,{opacity:1,duration:.25,ease:'power2.out'},at);tl.to(s.pool,{opacity:.35,duration:.25},at);
  tl.to(P7.lv[i],{b,duration:.3,onUpdate:P7.lv[i].ap},at);s.motes.forEach((m,k)=>drift(m,at+k*.3,{y:-400,x:(rnd(k)-.5)*60,dur:3+rnd(k+i)*1.5,peak:.8}));};
const spotOff=(i,at)=>{const s=P7.spots[i];tl.to(s.cone,{keyframes:{opacity:[1,.3,1,0]},duration:.4},at);tl.to(s.pool,{opacity:0,duration:.3},at+.1);tl.to(P7.lv[i],{b:.12,duration:.5,onUpdate:P7.lv[i].ap},at+.1);
  tl.to(P7.figs[i].place,{opacity:.45,duration:.6},at+.2);s.motes.forEach(m=>tl.to(m,{autoAlpha:0,duration:.2},at));};
tl.to(P7.spots[3].cone,{opacity:.35,duration:.4},57.4);
cam(P7,58.6,470,560,1.48,1.3,'power2.inOut');spotOn(0,60.5);rot(P7.figs[0].Rarm,60.8,-30,.5);rot(P7.figs[0].Rarm,61.9,0,.5);
cam(P7,62.2,1120,430,1.3,1.0,'power2.inOut');
tl.set(P7.banner,{y:-320,onUpdate:P7.banner.apply},0);tl.to(P7.banner,{y:0,duration:.7,ease:'bounce.out',onUpdate:P7.banner.apply},62.55);sway(P7.banner,63.3,1.6,1.6);tl.to(P7.banner.el,{opacity:0,duration:.4},73.0);
cam(P7,64.5,900,560,1.55,.9,'power2.inOut');spotOn(1,64.9);
cam(P7,68.4,1340,680,1.72,.9,'power2.inOut');spotOn(2,68.8);wave(P7.figs[2],69.5);face(P7.figs[2],'senang',69.4);
cam(P7,73.3,1110,710,1.12,1.2,'power2.inOut');
spotOff(0,74.7);spotOff(1,75.35);spotOff(2,76.0);
spotOn(3,77.7,1.05);tl.to(P7.spots[3].pool,{opacity:.5,duration:.3},77.7);
cam(P7,77.6,2000,560,1.45,1.3,'power2.inOut');
walk(P7.nara,77.7,1.3,-240);walk(P7.bima,77.85,1.3,-240);face(P7.figs[3],'lebar',78.9);wave(P7.figs[3],79.0,'L');wave(P7.nara,79.2,'R');face(P7.nara,'lebar',79.1);face(P7.bima,'lebar',79.2);
tl.to(P7.folds,{x:24,duration:3,yoyo:true,repeat:-1,ease:'sine.inOut'},57.3);
P7.refl.forEach((r,i)=>tl.to(r,{keyframes:{opacity:[.18,.05,.18]},x:30,duration:2+i*.3,repeat:-1,ease:'sine.inOut'},57.3));


/* ---------- SUARA + SUBTITLE ---------- */
say('b1-1',1.2);say('b1-2',9.4);say('b1-3',22.4);say('b1-4',32.4);say('b1-5',57.4);
[[ 'senter',1.75,.55],['pop',8.0,.4],['pop',12.9,.35],['pop',13.9,.35],['kirim',16.6,.4],['kirim',17.4,.35],['kirim',18.2,.35],['pop',20.4,.35],
 ['dial',24.7,.45],['luncur',30.2,.5],['pop',31.95,.4],['pop',37.75,.3],['pop',42.9,.35],['pop',50.1,.4],['pop',62.6,.3],['senter',77.7,.45]].forEach(([n,t,v])=>sfx(n,t,v));
DUR=81.5;tl.to({},{duration:.01},DUR);
