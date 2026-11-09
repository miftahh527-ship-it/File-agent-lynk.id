/* BAB 8 — Abad ke-20 sampai hari ini */
const T=voPlan(['b8-1','b8-2','b8-3','b8-4','b8-5'],3.6,.8);
const B0=bumper('1914','BAB 8');

/* ---------- P1 BUMI RETAK → BERSATU (PBB) ---------- */
const P1=scene('pbb');{const p=P1.g;R(-900,-900,3800,2900,'url(#skyN)',0,p);P1.st=stars(p,50,1500);
  const gc=N('clipPath',{id:'gl1'},defs);CI(0,0,260,null,gc);
  P1.halves=[-1,1].map(s=>{const g=G({},p),j=J(g,960,520);const inner=G({'clip-path':'url(#gl1)'},g);const half=G({},inner);R(s<0?-270:0,-270,270,540,C.blue,0,half);
    PA('M -200 -120 C -120 -180 -40 -100 -80 -20 C -120 40 -200 0 -200 -120 Z M 40 -160 C 120 -200 200 -120 160 -60 C 120 0 60 -40 40 -160 Z M -60 80 C 20 40 120 100 60 180 C 0 220 -80 160 -60 80 Z',C.lime,half);
    R(s<0?-270:0,-270,270,540,'none',0,inner);return j;});
  P1.crack=route(p,'M 960 260 L 940 340 L 980 420 L 945 500 L 985 580 L 950 680 L 960 780',C.paper,8);
  P1.flags=[];const fc=[C.coral,C.sun,C.mint,C.blue2,C.lilac,C.pink,C.lime2,C.paper];for(let i=0;i<8;i++){const a=i/8*Math.PI*2,x=960+Math.cos(a)*400,y=520+Math.sin(a)*330;const g=G({opacity:0},p);LN(`M ${x} ${y+50} L ${x} ${y-50}`,C.paper,6,g);R(x,y-50,70,44,fc[i],4,g);P1.flags.push(g);}
  P1.tag=tag(p,960,150,'1945 · PBB','menjaga perdamaian',{s1:42});P1.tagW=tag(p,960,150,'Perang Dunia I & II','1914–1918 · 1939–1945',{s1:38,bg:'#C9C6D6'});}
slide(3.0,B0,P1,'x',96);Object.assign(P1.cam,{x:960,y:540,z:1.12});P1.apply();
{const t=T['b8-1'];twinkle(P1.st,3);pop(P1.tagW,t+.6);drawOn(P1.crack,t+1.0,.8,'power2.in');
  P1.halves.forEach((j,i)=>tl.to(j,{x:i?90:-90,r:i?8:-8,duration:.8,ease:'power2.out',onUpdate:j.apply},t+1.8));tl.to(P1.crack,{opacity:0,duration:.3},t+2.0);
  const c1=capT(T,'b8-1',1);P1.halves.forEach((j,i)=>tl.to(j,{x:0,r:0,duration:.9,ease:'back.out(1.4)',onUpdate:j.apply},c1));hide(P1.tagW.el,c1,.3);
  P1.flags.forEach((f,i)=>tl.to(f,{opacity:1,duration:.25},c1+1+i*.15));pop(P1.tag,c1+2.4);sfx('pop',c1+2.4,.35);
  P1.halves.forEach(j=>tl.to(j,{r:'+=360',duration:24,ease:'none',onUpdate:j.apply},c1+1.2));cam(P1,t,960,540,1.3,6,'sine.inOut');}

/* ---------- P2 PROKLAMASI 17 AGUSTUS 1945 ---------- */
const P2=scene('proklamasi');{const p=P2.g,gy=900;bgSky(p);P2.cl=[cloud(p,400,170,.8),cloud(p,1500,140,.6)];bgGround(p,gy,C.lime2,'#9DBB7A');
  R(560,gy-160,800,160,C.paper,10,p);R(520,gy-200,880,50,'#E4E0D6',10,p);for(let i=0;i<5;i++)R(620+i*170,gy-480,30,280,C.paper,6,p);R(580,gy-520,760,50,C.paper,10,p);
  LN('M 1560 900 L 1560 180',C.ink,10,p);const fg=G({},p);P2.flag=J(fg,1560,820);R(0,0,200,64,C.red,0,fg);R(0,64,200,64,C.paper,0,fg);
  P2.flagW=fg;
  P2.sk=character(p,860,gy-160,.85,{who:'soekarno',shirt:C.paper,pants:C.paper,hair:'#1E1A3F',skin:'#B97A52'});P2.ht=character(p,1060,gy-160,.85,{who:'hatta',shirt:C.paper,pants:C.paper,hair:'#1E1A3F',skin:'#C98A62'});
  [P2.sk,P2.ht].forEach(c=>{const pc=G({},c.headAcc);R(-70,-200,140,60,C.ink,8,pc);});const pp=G({},P2.sk.Rhand.el);R(-40,-10,80,100,C.paper,6,pp);
  P2.crowd=[];for(let i=0;i<7;i++){P2.crowd.push(character(p,240+i*240,gy+170,.6,{who:'rakyat'+i,shirt:[C.coral,C.paper,C.blue2,C.sun,C.mint,C.paper,C.lilac2][i],pants:C.indigo,hair:'#1E1A3F',skin:['#B97A52','#C98A62','#A86B47','#D9A07A'][i%4]}));}
  P2.tag=tag(p,960,170,'17 Agustus 1945','Proklamasi Kemerdekaan',{s1:50,c1:C.red});P2.conf=[];for(let i=0;i<24;i++)P2.conf.push(R(200+rnd(i)*1500,-60,14,24,i%2?C.red:C.paper,3,p,{opacity:0}));}
{const t=T['b8-2']-.4;cut(t,P1,P2);Object.assign(P2.cam,{x:960,y:520,z:1.15});P2.apply();pop(P2.tag,t+.5);sfx('pop',t+.5,.35);
  [P2.sk,P2.ht,...P2.crowd].forEach((c,i)=>idle(c,t+i*.05));rot(P2.sk.Rarm,t,-60,.01);rot(P2.sk.Rfore,t,-60,.01);
  const c1=capT(T,'b8-2',1);cam(P2,c1-.2,960,480,1.45,1.2,'power2.inOut');
  const c2=capT(T,'b8-2',2);tl.fromTo(P2.flag,{ty:820},{ty:200,duration:2.6,ease:'power1.inOut',onUpdate:P2.flag.apply,immediateRender:false},c2-1.6);tl.to(P2.flag,{sy:.92,duration:.3,yoyo:true,repeat:-1,ease:'sine.inOut',onUpdate:P2.flag.apply},c2-1.6);
  cam(P2,c2-.4,1250,500,1.18,1.2,'power2.inOut');P2.crowd.forEach((c,i)=>{rot(c[i%2?'Larm':'Rarm'],c2+.4+i*.05,i%2?160:-160,.3,'back.out(1.6)');face(c,'lebar',c2+.4);hop(c,c2+.6+i*.08);});
  P2.conf.forEach((c,i)=>tl.fromTo(c,{opacity:0,y:0,rotation:0},{opacity:1,y:1100,rotation:360*(rnd(i)>.5?1:-1),duration:3+rnd(i)*1.5,ease:'none',immediateRender:false},c2+.4+rnd(i+2)*.8));P2.cl.forEach(c=>tl.fromTo(c,{x:0},{x:120,duration:14,ease:'none',immediateRender:false},t));}

/* ---------- P3 BULAN → KOMPUTER → HP ---------- */
const P3=scene('bulan');{const p=P3.g;R(-900,-900,3800,2900,'url(#skyN)',0,p);P3.st=stars(p,70,1300);CI(300,220,90,C.blue,p);PA('M 240 190 C 270 170 300 200 280 230 Z M 320 240 C 340 220 360 250 340 270 Z',C.lime,p);
  PA('M -900 760 C -200 700 600 740 1200 720 C 1800 700 2400 740 2900 730 L 2900 1700 L -900 1700 Z','#C9C6D6',p);[[400,880,60],[1100,820,40],[1600,900,70]].forEach(([x,y,r])=>EL(x,y,r,r*.3,'#ADA8BC',p));
  const rk=G({},p);P3.rocket=rk;const rb=G({transform:'translate(1500,760)'},rk);PA('M -50 0 L -50 -260 C -50 -340 50 -340 50 -260 L 50 0 Z',C.paper,rb);CI(0,-220,24,C.sky,rb);PA('M -50 -60 L -100 10 L -50 0 Z M 50 -60 L 100 10 L 50 0 Z',C.coral,rb);P3.rf=PA('M -30 0 C -30 50 0 90 0 120 C 0 90 30 50 30 0 Z',C.sun,rb);
  P3.astro=character(p,800,800,.85,{who:'astronot',shirt:C.paper,pants:C.paper,shoes:'#C9C6D6',hair:C.paper,skin:'#E3A57B'});const hm=G({},P3.astro.headAcc);CI(0,-92,98,'none',hm,{stroke:C.paper,'stroke-width':14});CI(0,-92,98,C.sky,hm,{opacity:.25});
  LN('M 1000 800 L 1000 560',C.paper,8,p);P3.fl=J(G({},p),1000,560);R(0,0,120,70,C.sun,4,P3.fl.el);P3.prints=[0,1,2,3].map(i=>EL(560+i*60,810+(i%2)*14,18,7,'#ADA8BC',p,{opacity:0}));
  P3.tag=tag(p,960,180,'1969 · Apollo 11','manusia berjalan di Bulan',{s1:42});}
const P3b=scene('komputer');{const p=P3b.g;R(-900,-900,3800,2900,'url(#room)',0,p);R(-900,860,3800,900,'#8E84A8',0,p);R(260,820,1400,40,C.wood,10,p);
  const cp=G({},p);P3b.comp=J(cp,960,820);R(-500,-560,1000,560,'#6E6A8C',16,cp);for(let r=0;r<3;r++)for(let c=0;c<8;c++)CI(-420+c*120,-460+r*90,16,(r+c)%3?C.sun:C.mint,cp,{opacity:.9});R(-440,-200,880,140,'#4D5378',10,cp);
  const lp=G({opacity:0},p);P3b.lap=J(lp,960,820);R(-200,-260,400,250,C.ink,14,lp);R(-180,-240,360,210,C.sky,8,lp);R(-240,-10,480,20,'#8E8E94',8,lp);
  const ph=G({opacity:0},p);P3b.ph=J(ph,960,820);R(-70,-270,140,260,C.ink,22,ph);P3b.scr=R(-56,-250,112,220,C.sky,14,ph);
  P3b.web=G({opacity:0},p);[[700,300],[960,220],[1220,300],[820,460],[1100,460]].forEach(([x,y],i,a)=>{a.forEach(([x2,y2],j)=>{if(j>i)LN(`M ${x} ${y} L ${x2} ${y2}`,C.mint2,4,P3b.web,{opacity:.6});});CI(x,y,22,C.mint,P3b.web);});
  P3b.tag=tag(p,1500,300,'1989 · World Wide Web','Tim Berners-Lee',{s1:38});P3b.bima=character(p,1600,860,.85,BIMA);}
{const t=T['b8-3']-.4;slide(t,P2,P3,'x',96);Object.assign(P3.cam,{x:960,y:560,z:1.15});P3.apply();twinkle(P3.st,t);pop(P3.tag,t+.5);sfx('pop',t+.5,.3);
  tl.to(P3.rf,{keyframes:{opacity:[1,.5,1]},duration:.2,repeat:-1},t);idle(P3.astro,t);walk(P3.astro,t+.6,2.0,150);P3.prints.forEach((f,i)=>show(f,t+.8+i*.4,.2));
  rot(P3.astro.Rarm,t+2.8,-100,.4);tl.to(P3.fl,{sx:.9,duration:.4,yoyo:true,repeat:-1,ease:'sine.inOut',onUpdate:P3.fl.apply},t);cam(P3,t+.3,900,620,1.35,3,'sine.inOut');
  const c1=capT(T,'b8-3',1)-.2;cut(c1,P3,P3b);Object.assign(P3b.cam,{x:960,y:520,z:1.15});P3b.apply();idle(P3b.bima,c1);
  tl.to(P3b.comp,{sx:.4,sy:.45,duration:1.2,ease:'power2.inOut',onUpdate:P3b.comp.apply},c1+1.2);tl.to(P3b.comp.el,{opacity:0,duration:.3},c1+2.3);tl.to(P3b.lap.el,{opacity:1,duration:.3},c1+2.3);
  tl.to(P3b.lap,{sx:.4,sy:.4,duration:1,ease:'power2.inOut',onUpdate:P3b.lap.apply},c1+3.4);tl.to(P3b.lap.el,{opacity:0,duration:.3},c1+4.3);tl.to(P3b.ph.el,{opacity:1,duration:.3},c1+4.3);
  const c2=capT(T,'b8-3',2);tl.to(P3b.web,{opacity:1,duration:.5},c2);pop(P3b.tag,c2+.3);sfx('pop',c2+.3,.3);tl.to(P3b.scr,{keyframes:{fill:[C.sky,C.mint,C.sky]},duration:1,repeat:-1},c2);
  const c3=capT(T,'b8-3',3);cam(P3b,c3-.2,960,600,1.6,1.0,'power2.inOut');face(P3b.bima,'lebar',c3);}

/* ---------- P4 8,3 MILIAR + HARAPAN HIDUP ---------- */
const P4=scene('populasi');{const p=P4.g;R(-900,-900,3800,2900,'url(#board)',0,p);
  P4.num=TX(960,360,'0',120,C.sun,p,{'font-family':'Space Mono, monospace','font-weight':700});P4.sub=TX(960,450,'manusia di Bumi',40,C.paper,p);
  P4.crowd=G({},p);for(let i=0;i<40;i++){const x=200+(i%20)*80,y=620+Math.floor(i/20)*90;const g=G({opacity:0},P4.crowd);CI(x,y-40,18,[C.coral,C.sun,C.mint,C.lilac,C.blue][i%5],g);R(x-16,y-22,32,40,[C.coral,C.sun,C.mint,C.lilac,C.blue][i%5],12,g);}
  P4.bars=[[46,'1950'],[73,'sekarang']].map(([v,l],i)=>{const x=560+i*560;R(x-90,880-0,180,0,C.mint,10,p);const b=R(x-90,880,180,0,i?C.mint:C.lilac2,10,p,{opacity:0});const tx=TX(x,860,'',46,C.paper,p,{'font-weight':700});const lb=TX(x,940,l,34,C.paper,p,{opacity:0});return {b,tx,lb,v};});
  P4.tagL=tag(p,960,180,'Harapan hidup','rata-rata umur manusia',{s1:42});}
{const t=T['b8-4']-.4;cut(t,P3b,P4);Object.assign(P4.cam,{x:960,y:500,z:1.15});P4.apply();
  const n={v:0};tl.to(n,{v:8e9,duration:4,ease:'power2.out',onUpdate(){P4.num.textContent=Math.round(n.v).toString().replace(/\B(?=(\d{3})+(?!\d))/g,'.');}},t+.3);
  [...P4.crowd.childNodes].forEach((g,i)=>tl.to(g,{opacity:1,duration:.1},t+.4+i*.08));
  const c1=capT(T,'b8-4',1);tl.call(()=>{},null,c1);tl.to(P4.num,{opacity:0,duration:.15},c1+.4);tl.set(P4.num,{textContent:'±8,3 miliar'},c1+.55);tl.to(P4.num,{opacity:1,duration:.2},c1+.6);tl.set(P4.sub,{textContent:'manusia pada 2026'},c1+.55);sfx('pop',c1+.6,.3);
  const c2=capT(T,'b8-4',2);tl.to([P4.num,P4.sub,P4.crowd],{opacity:0,duration:.4},c2-.3);pop(P4.tagL,c2);cam(P4,c2-.3,960,600,1.18,1.0,'power2.inOut');
  P4.bars.forEach((bb,i)=>{const at=i?capT(T,'b8-4',3):c2+1.2;tl.set(bb.b,{opacity:1},at);tl.to(bb.b,{attr:{y:880-bb.v*6,height:bb.v*6},duration:1.2,ease:'power2.out'},at);tl.to(bb.lb,{opacity:1,duration:.3},at);
    const o={v:0};tl.to(o,{v:bb.v,duration:1.2,ease:'power2.out',onUpdate(){bb.tx.textContent='±'+Math.round(o.v)+' tahun';bb.tx.setAttribute('y',860-o.v*6);}},at);sfx('pop',at+1.2,.25);});}

/* ---------- P5 MASA DEPAN: AI, iklim, plastik → kamu ---------- */
const P5=scene('masadepan');{const p=P5.g,gy=880;bgSky(p);P5.cl=[cloud(p,400,170,.8),cloud(p,1500,130,.6)];bgHills(p,780,C.mint,.6);bgGround(p,gy,C.lime2,'#9DBB7A');
  P5.sea=R(1300,gy-40,1600,900,'url(#sea)',0,p);P5.w=waves(p,gy+40,C.paper,10,.4);
  P5.pan=[0,1,2].map(i=>{const g=G({},p);R(180+i*190,gy-160,170,100,C.blue2,6,g,{transform:`skewX(-12)`});for(let k=1;k<3;k++)LN(`M ${180+i*190+k*56} ${gy-160} L ${170+i*190+k*56} ${gy-60}`,C.sky,3,g);LN(`M ${260+i*190} ${gy-60} L ${260+i*190} ${gy}`,C.ink,6,g);return g;});
  P5.sunG=CI(400,200,80,C.sun,p);
  const rb=G({},p);P5.robot=J(rb,900,gy);R(-60,-220,120,140,C.paper,30,rb);CI(-24,-160,12,C.mint,rb);CI(24,-160,12,C.mint,rb);R(-50,-80,100,80,C.paper,20,rb);LN('M 0 -220 L 0 -260',C.ink,6,rb);P5.ant=CI(900,gy-264,10,C.coral,p);
  P5.trash=[[1500,gy+80,C.coral],[1700,gy+140,C.sun],[1900,gy+90,C.paper]].map(([x,y,c])=>{const g=G({},p),j=J(g,x,y);R(-18,-30,36,60,c,10,g,{opacity:.85});return j;});
  P5.net=G({},p);LN('M 1380 1000 C 1600 940 1900 960 2100 1010',C.ink,6,P5.net);
  P5.nara=character(p,1100,gy,.85,NARA);P5.bima=character(p,1300,gy,.85,BIMA);const tb=G({},P5.nara.Rhand.el);R(-36,-24,72,52,C.ink,8,tb);R(-30,-18,60,40,C.sky,4,tb);
  P5.tagAI=tag(p,740,430,'kecerdasan buatan','',{s1:34});P5.tagC=tag(p,1700,560,'iklim & plastik','',{s1:34,c1:C.coral});P5.you=stamp(p,960,300,'KAMU!',C.coral,90,-6);}
{const t=T['b8-5']-.4;slide(t,P4,P5,'x',96);Object.assign(P5.cam,{x:900,y:560,z:1.18});P5.apply();idle(P5.nara,t);idle(P5.bima,t);
  rot(P5.nara.Rarm,t,-25,.01);rot(P5.nara.Rfore,t,-95,.01);tl.to(P5.robot,{y:-10,duration:.5,yoyo:true,repeat:-1,ease:'sine.inOut',onUpdate:P5.robot.apply},t);tl.to(P5.ant,{keyframes:{opacity:[1,.2,1]},duration:.8,repeat:-1},t);
  pop(P5.tagAI,t+.8);P5.cl.forEach(c=>tl.fromTo(c,{x:0},{x:120,duration:14,ease:'none',immediateRender:false},t));tl.fromTo(P5.w,{x:0},{x:-360,duration:4,ease:'none',repeat:-1,immediateRender:false},t);
  const c1=capT(T,'b8-5',1);cam(P5,c1-.2,1600,620,1.3,1.2,'power2.inOut');pop(P5.tagC,c1+.6);P5.trash.forEach((j,i)=>tl.to(j,{y:-12,r:10,duration:.9+i*.2,yoyo:true,repeat:-1,ease:'sine.inOut',onUpdate:j.apply},t));
  tl.fromTo(P5.net,{x:-300},{x:200,duration:4,ease:'power1.inOut',immediateRender:false},c1+1.5);P5.trash.forEach((j,i)=>tl.to(j.el,{opacity:0,duration:.3},c1+3.5+i*.3));
  const c3=capT(T,'b8-5',3);cam(P5,c3-.4,1200,520,1.55,1.0,'power2.inOut');rot(P5.bima.Rarm,c3+.6,-80,.3);rot(P5.nara.Larm,c3+.6,80,.3);face(P5.nara,'lebar',c3+.6);face(P5.bima,'lebar',c3+.6);pop(P5.you,c3+1.4);sfx('pop',c3+1.4,.45);}

DUR=T.end+1.4;tl.to({},{duration:.01},DUR);
