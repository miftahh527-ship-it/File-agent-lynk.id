/* PENUTUP + KUIS */
const T=voPlan(['b9-1','b9-2','b9-3'],3.6,.9);
const B0=bumper('2026','PULANG');

/* ---------- P1 GARIS WAKTU DIPUTAR ULANG: dari gua sampai smartphone ---------- */
const P1=scene('ulang');{const p=P1.g;R(-900,-900,3800,2900,'url(#board)',0,p);
  P1.belt=G({},p);const icons=[
    g=>{CI(0,0,70,'url(#spray)',g);handShape(g,'#4A5074',.42);},
    g=>{PA('M -34 34 C -44 -10 -10 -34 0 -70 C 10 -34 44 -10 34 34 Z',C.coral,g);PA('M -16 34 C -20 6 -4 -10 0 -30 C 4 -10 20 6 16 34 Z',C.sun,g);},
    g=>{for(let k=-1;k<=1;k++){LN(`M ${k*20} 50 L ${k*20} -30`,C.lime2,6,g);for(let j=0;j<3;j++)EL(k*20+8,-30+j*16,7,12,C.sun,g);}},
    g=>{R(-40,-50,80,100,'#C9A47A',10,g);for(let k=0;k<4;k++)LN(`M -24 ${-30+k*20} L 24 ${-30+k*20}`,'#7A5A44',5,g);},
    g=>{PA('M -70 50 L 0 -60 L 70 50 Z','#CFAD72',g);},
    g=>{R(-46,-34,92,68,C.coral,8,g);R(-4,-34,8,68,C.paper,2,g);},
    g=>{R(-60,-30,120,60,C.coral,12,g);R(30,-60,24,40,C.ink,6,g);CI(-30,34,16,C.ink,g);CI(30,34,16,C.ink,g);},
    g=>{PA('M -18 40 L -18 -40 C -18 -70 18 -70 18 -40 L 18 40 Z',C.paper,g);PA('M -18 20 L -40 50 L -18 40 Z M 18 20 L 40 50 L 18 40 Z',C.coral,g);},
    g=>{R(-30,-56,60,112,C.ink,12,g);R(-24,-48,48,92,C.sky,8,g);}];
  P1.ic=icons.map((f,i)=>{const g=G({transform:`translate(${200+i*260},280)`},P1.belt);CI(0,0,96,C.white,g,{opacity:.95});f(g);return g;});
  LN('M -400 400 L 2600 400',C.paper,6,p,{opacity:.4});
  P1.farmer=character(p,560,960,.85,{...PURBA,who:'petanipertama'});P1.kid=character(p,1360,960,.85,BIMA);const ph=G({},P1.kid.Rhand.el);R(-22,-30,44,76,C.ink,9,ph);R(-17,-24,34,60,C.sky,6,ph);
  P1.heart=G({opacity:0},p);PA('M 960 860 C 900 800 860 860 960 930 C 1060 860 1020 800 960 860 Z',C.coral,P1.heart);}
slide(3.0,B0,P1,'x',96);Object.assign(P1.cam,{x:960,y:600,z:1.12});P1.apply();
{const t=T['b9-1'];tl.fromTo(P1.belt,{x:600},{x:-1100,duration:7,ease:'power1.inOut',immediateRender:false},3.2);idle(P1.farmer,3);idle(P1.kid,3);
  rot(P1.kid.Rarm,3,-25,.01);rot(P1.kid.Rfore,3,-95,.01);const c1=capT(T,'b9-1',1);cam(P1,c1-.2,960,760,1.35,1.2,'power2.inOut');
  const c2=capT(T,'b9-1',2);walk(P1.farmer,c2-.4,1.2,200);walk(P1.kid,c2-.4,1.2,-200);tl.to(P1.heart,{opacity:1,duration:.3},c2+1);tl.fromTo(P1.heart,{scale:.4,transformOrigin:'50% 50%'},{scale:1,duration:.5,ease:'back.out(2)',immediateRender:false},c2+1);
  rot(P1.farmer.Rarm,c2+1,-60,.4);rot(P1.kid.Larm,c2+1,60,.4);face(P1.farmer,'lebar',c2+1);face(P1.kid,'lebar',c2+1);}

/* ---------- P2 KUIS: papan tiga soal ---------- */
const P2=scene('kuis');{const p=P2.g;R(-900,-900,3800,2900,'url(#room)',0,p);R(-900,900,3800,900,'#8E84A8',0,p);
  R(280,140,1360,700,'#3E4A3C',24,p);R(264,124,1392,732,'none',30,p,{stroke:C.wood,'stroke-width':20});P2.title=TX(960,260,'KUIS!',96,C.sun,p,{'font-weight':700,opacity:0});
  const ics=[g=>{CI(0,0,46,'url(#spray)',g);handShape(g,'#4A5074',.3);},g=>{R(-30,-36,60,72,'#C9A47A',8,g);for(let k=0;k<3;k++)LN(`M -16 ${-18+k*18} L 16 ${-18+k*18}`,'#7A5A44',4,g);},g=>{PA('M -24 40 L -20 -40 C -16 -56 16 -56 20 -40 L 24 40 Z','#A9A296',g);for(let k=0;k<3;k++)LN(`M -12 ${-20+k*20} c 6 -8 12 -8 16 0`,C.ink,4,g);}];
  P2.q=[0,1,2].map(i=>{const g=G({opacity:0},p),j=J(g,460+i*500,560);CI(0,0,120,C.paper,g,{opacity:.12});TX(-90,-90,(i+1)+'',72,C.sun,g,{'font-weight':700});ics[i](g);TX(0,180,'?',90,C.paper,g,{'font-weight':700});return j;});
  P2.nara=character(p,1780,960,.8,NARA);P2.bubble=G({opacity:0},p);R(1500,330,300,120,C.paper,30,P2.bubble);PA('M 1600 450 L 1640 500 L 1660 450 Z',C.paper,P2.bubble);TX(1650,408,'komentar ya!',36,C.ink,P2.bubble,{'font-weight':700});}
{const t=T['b9-2']-.4;cut(t,P1,P2);Object.assign(P2.cam,{x:960,y:520,z:1.15});P2.apply();idle(P2.nara,t);
  tl.to(P2.title,{opacity:1,duration:.2},t+.4);tl.fromTo(P2.title,{attr:{'font-size':40}},{attr:{'font-size':96},duration:.5,ease:'back.out(2.4)',immediateRender:false},t+.4);sfx('pop',t+.4,.45);
  const c1=capT(T,'b9-2',1);tl.to(P2.bubble,{opacity:1,duration:.3},c1);wave(P2.nara,c1,'L');
  [2,3,4].forEach((ci,i)=>{const a=capT(T,'b9-2',ci);pop(P2.q[i],a,.5);sfx('pop',a,.3);cam(P2,a-.3,460+i*500,520,1.4,.9,'power2.inOut');});}

/* ---------- P3 SAMPAI JUMPA + jawaban kuis ---------- */
const P3=scene('dadah');{const p=P3.g,gy=880;bgSky(p);P3.cl=[cloud(p,400,170,.8),cloud(p,1500,130,.6)];bgHills(p,780,C.mint,.6);bgGround(p,gy,C.lime2,'#9DBB7A');
  P3.trees=[roundTree(p,140,gy,1.0),roundTree(p,1800,gy,1.1)];P3.cap=makeCapsule(p,1300,gy);P3.cap.num.textContent='2026';P3.cap.sub.setAttribute('opacity',1);P3.cap.sub.textContent='SAMPAI JUMPA';P3.cap.sub.setAttribute('font-size',26);
  P3.nara=character(p,640,gy,.85,NARA);P3.bima=character(p,860,gy,.85,BIMA);
  const st=(x,y,draw,c)=>{const g=G({},p),j=J(g,x,y);CI(0,0,64,c,g);draw(g);return j;};
  P3.st=[st(520,300,g=>{PA('M -26 30 L -26 -4 L -10 -4 L 4 -36 C 12 -40 20 -32 16 -20 L 12 -6 L 30 -6 C 40 -6 40 10 34 14 L 28 30 Z',C.paper,g);},C.blue2),
    st(760,240,g=>{PA('M -30 10 L 10 -24 L 10 -8 C 30 -8 36 10 34 30 C 28 16 20 10 10 10 L 10 26 Z',C.paper,g);},C.mint2),
    st(1000,300,g=>{PA('M -24 16 C -24 -24 24 -24 24 16 L 32 24 L -32 24 Z',C.paper,g);CI(0,32,8,C.paper,g);},C.coral)];
  const ans=G({opacity:0},p);P3.ans=ans;R(360,380,1200,380,C.paper,24,ans);TX(960,450,'Jawaban kuis',46,C.ink,ans,{'font-weight':700});
  [['1. Pulau Muna, Sulawesi Tenggara',530],['2. Huruf paku',610],['3. Prasasti Yupa, Kerajaan Kutai',690]].forEach(([s,y])=>TX(960,y,s,40,C.mint2,ans,{'font-weight':600}));}
{const t=T['b9-3']-.4;slide(t,P2,P3,'x',96);Object.assign(P3.cam,{x:900,y:540,z:1.15});P3.apply();idle(P3.nara,t);idle(P3.bima,t);P3.trees.forEach((j,i)=>sway(j,t+i*.3,1.4,2));
  P3.cl.forEach(c=>tl.fromTo(c,{x:0},{x:120,duration:14,ease:'none',immediateRender:false},t));P3.cap.lights.forEach((l,i)=>tl.to(l,{keyframes:{opacity:[1,.25,1]},duration:1.2,repeat:-1},t+i*.17));
  const c1=capT(T,'b9-3',1);P3.st.forEach((j,i)=>{pop(j,c1+.3+i*.9);sfx('pop',c1+.3+i*.9,.3);tl.to(j,{y:-14,duration:.6,yoyo:true,repeat:-1,ease:'sine.inOut',onUpdate:j.apply},c1+.8+i*.9);});cam(P3,c1-.2,800,460,1.3,1.0,'power2.inOut');
  const c2=capT(T,'b9-3',2);wave(P3.nara,c2-.2,'L');wave(P3.bima,c2-.1,'R');face(P3.nara,'lebar',c2);face(P3.bima,'lebar',c2);cam(P3,c2-.2,960,520,1.15,.8,'power2.inOut');
  const ea=T.end+.6;P3.st.forEach(j=>tl.to(j.el,{opacity:0,duration:.3},ea));tl.to(P3.ans,{opacity:1,duration:.4},ea+.2);sfx('pop',ea+.2,.35);}

DUR=T.end+6.2;tl.to({},{duration:.01},DUR);
