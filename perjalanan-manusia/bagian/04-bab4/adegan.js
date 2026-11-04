/* BAB 4 — Kota pertama dan lahirnya tulisan */
const T=voPlan(['b4-1','b4-2','b4-3','b4-4'],3.6,.8);
const B0=bumper('−3.200','BAB 4');
const MUD='#C9A47A',MUD2='#B08458';

/* ---------- P1 SUNGAI: desa tumbuh jadi kota bertembok ---------- */
const P1=scene('sungai');{const p=P1.g,gy=860;R(-900,-900,3800,2900,'url(#desert)',0,p);P1.clouds=[cloud(p,400,180,.7),cloud(p,1600,150,.5)];
  R(-900,gy,3800,900,'#E3C79A',0,p);P1.river=PA('M -900 1010 C -200 960 400 1060 1000 1000 C 1600 940 2200 1040 2900 990 L 2900 1100 C 2200 1150 1600 1050 1000 1110 C 400 1170 -200 1070 -900 1120 Z','url(#sea)',p);
  P1.rip=waves(p,1050,C.white,10,.45);P1.reeds=[];for(let i=0;i<10;i++)P1.reeds.push(tuft(p,-300+i*300,1000,1.2,C.lime2));
  P1.huts=[300,560,1360,1620].map((x,i)=>{const g=G({},p),j=J(g,x,gy);hut(g,0,0,.7);return j;});
  P1.city=G({opacity:0},p);for(let i=0;i<9;i++){const x=200+i*190,h=120+rnd(i+40)*140;R(x,gy-h,150,h,i%2?MUD:MUD2,6,P1.city);R(x+50,gy-h+30,40,40,'#7A5A44',4,P1.city);}
  const zg=G({},P1.city);[[0,420,140],[60,300,120],[110,200,110]].forEach(([dy,w,h],k)=>R(960-w/2,gy-140-dy-h,w,h,k%2?MUD:MUD2,4,zg));R(950,gy-540,20,120,'#7A5A44',4,zg);
  P1.wall=R(100,gy,1720,0,MUD2,6,p);P1.wallTop=G({},p);for(let i=0;i<22;i++)R(100+i*80,gy,40,0,MUD2,4,P1.wallTop);
  const roles=[['raja',C.sun,620],['juru tulis',C.paper,860],['petani',C.lime2,1100],['tukang',C.coral,1340]];
  P1.roles=roles.map(([n,col,x],i)=>{const ch=character(p,x,gy+80,.62,{who:'r'+i,shirt:[C.lilac2,C.blue,'#C98B5E',C.mint][i],pants:C.indigo,hair:'#2A2350',skin:['#B97A52','#C98A62','#A86B47','#D9A07A'][i]});return {ch,tg:tag(p,x,gy-370,n,'',{s1:32,c1:C.ink,bg:col})};});
  const crown=G({},P1.roles[0].ch.head.el);PA('M -60 -150 L -60 -190 L -30 -165 L 0 -200 L 30 -165 L 60 -190 L 60 -150 Z',C.sun,crown);}
slide(3.0,B0,P1,'x',96);Object.assign(P1.cam,{x:960,y:640,z:1.15});P1.apply();
{const t=T['b4-1'];P1.reeds.forEach((j,i)=>sway(j,3,8,1+rnd(i)*.4));tl.fromTo(P1.rip,{x:0},{x:-360,duration:4,ease:'none',repeat:-1,immediateRender:false},3);
  P1.clouds.forEach(c=>tl.fromTo(c,{x:0},{x:120,duration:20,ease:'none',immediateRender:false},3));
  P1.huts.forEach((j,i)=>tl.to(j,{sy:0,duration:.3,ease:'power2.in',onUpdate:j.apply},t+1.6+i*.12));tl.to(P1.city,{opacity:1,y:0,duration:.8,ease:'power2.out'},t+1.8);tl.fromTo(P1.city,{y:120},{y:0,duration:.8,ease:'back.out(1.4)',immediateRender:false},t+1.8);
  tl.to(P1.wall,{attr:{y:760,height:100},duration:.8,ease:'power2.out'},t+2.6);tl.to(P1.wallTop.childNodes,{attr:{y:730,height:30},duration:.5,stagger:.03,ease:'power2.out'},t+3.0);
  cam(P1,t+.4,960,560,1.3,2.8,'sine.inOut');
  const c1=capT(T,'b4-1',1);cam(P1,c1+.2,980,700,1.35,1.2,'power2.inOut');P1.roles.forEach((r,i)=>{tl.set([r.ch.place,r.ch.sd],{opacity:0},0);tl.to([r.ch.place,r.ch.sd],{opacity:1,duration:.3},c1+.6+i*.5);idle(r.ch,c1);pop(r.tg,capT(T,'b4-1',2)+i*.6,.4);});}

/* ---------- P1b EMPAT LEMBAH SUNGAI ---------- */
const P1b=scene('lembah');{const p=P1b.g;R(-900,-900,3800,2900,'url(#skyD)',0,p);P1b.m=mapBox(p,110,130,1700,820,[0,125,5,52],['af','as','eu']);const m=P1b.m;
  const rv=(pts)=>route(p,'M '+pts.map(([a,b])=>m.pt(a,b).join(' ')).join(' L '),C.blue2,12);
  P1b.rv=[rv([[44,36],[45,33],[47,30.5]]),rv([[31,30],[32.5,25],[33,19],[32.5,15]]),rv([[73,34],[71,30],[68,25]]),rv([[100,36],[106,38],[112,36],[118,37]])];
  P1b.tg=[['Mesopotamia',48,38],['Mesir',29,22],['Lembah Indus',70,22],['Tiongkok',111,41]].map(([n,a,b])=>{const[x,y]=m.pt(a,b);return tag(p,x,y-40,n,'',{s1:34});});}
{const t=capT(T,'b4-1',3)-.3;cut(t,P1,P1b);Object.assign(P1b.cam,{x:960,y:540,z:1.1});P1b.apply();
  const nm=[.2,1.4,2.3,3.4];P1b.rv.forEach((r,i)=>{drawOn(r,t+nm[i],.6);pop(P1b.tg[i],t+nm[i]+.2,.4);sfx('pop',t+nm[i]+.2,.22);});cam(P1b,t,960,540,1.16,5,'sine.inOut');}

/* ---------- P2 HURUF PAKU: juru tulis + lempeng tanah liat ---------- */
const P2=scene('paku');{const p=P2.g,gy=920;R(-900,-900,3800,2900,'url(#desert)',0,p);R(-900,gy,3800,900,'#D4B48A',0,p);R(-900,300,3800,620,MUD,0,p);for(let i=0;i<8;i++)R(-600+i*400,300,12,620,MUD2,0,p);
  R(520,700,880,30,C.wood,10,p);R(560,730,24,190,C.wood,6,p);R(1340,730,24,190,C.wood,6,p);
  P2.scribe=character(p,420,gy,.95,{who:'juru',shirt:C.blue,pants:C.indigo,hair:'#2A2350',skin:'#B97A52',beard:true});
  const sty=G({},P2.scribe.Rhand.el);LN('M 0 0 L 0 110',C.wood,8,sty);
  const tb=G({},p);P2.tab=J(tb,960,520);R(-240,-180,480,360,'#B98A5E',30,tb);R(-224,-164,448,328,'#C9A47A',24,tb);
  P2.marks=[];for(let r=0;r<5;r++)for(let c=0;c<8;c++){const g=G({opacity:0},tb);const x=-180+c*50,y=-120+r*60;PA(`M ${x} ${y} L ${x+26} ${y+8} L ${x} ${y+16} Z`,'#7A5A44',g);LN(`M ${x+26} ${y+8} L ${x+38} ${y+8}`,'#7A5A44',4,g);P2.marks.push(g);}
  P2.list=G({opacity:0},tb);for(let k=0;k<5;k++){sack(P2.list,-140+k*70,140,.55);}for(let k=0;k<5;k++)LN(`M ${90+k*22} 80 L ${90+k*22} 140`,'#5E4A3A',6,P2.list);
  P2.tag=tag(p,960,265,'Huruf paku','±3200 SM');P2.note=G({opacity:0},p);P2.noteJ=J(P2.note,1560,520);R(-110,-140,220,280,C.paper,12,P2.note);for(let k=0;k<6;k++)LN(`M -80 ${-90+k*40} L 80 ${-90+k*40}`,C.lilac2,4,P2.note);R(-110,-140,24,280,C.coral,8,P2.note);
  P2.nara=character(p,1720,gy,.75,NARA);}
{const t=T['b4-2']-.4;slide(t,P1b,P2,'x',96);Object.assign(P2.cam,{x:900,y:560,z:1.3});P2.apply();idle(P2.scribe,t);idle(P2.nara,t);
  rot(P2.scribe.Rarm,t,-75,.4);tl.to(P2.scribe.Rfore,{r:-40,duration:.25,yoyo:true,repeat:30,ease:'sine.inOut',onUpdate:P2.scribe.Rfore.apply},t+.4);
  const c1=capT(T,'b4-2',1);cam(P2,c1,960,520,1.55,1.2,'power2.inOut');P2.marks.forEach((g,i)=>tl.to(g,{opacity:1,duration:.06},c1+.4+i*.2));pop(P2.tag,capT(T,'b4-2',2));sfx('pop',capT(T,'b4-2',2),.3);
  const c3=capT(T,'b4-2',3);tl.to(P2.marks,{opacity:.25,duration:.4},c3+.6);tl.to(P2.list,{opacity:1,duration:.5},c3+.8);cam(P2,c3,1150,520,1.25,1.2,'power2.inOut');
  const c4=capT(T,'b4-2',4);tl.to(P2.note,{opacity:1,duration:.3},c4-.2);tl.fromTo(P2.noteJ,{r:-20,sx:.5,sy:.5},{r:6,sx:1,sy:1,duration:.5,ease:'back.out(2)',onUpdate:P2.noteJ.apply,immediateRender:false},c4-.2);face(P2.nara,'lebar',c4);hop(P2.nara,c4+.2);}

/* ---------- P3 GARIS WAKTU: prasejarah | sejarah ---------- */
const P3=scene('garis');{const p=P3.g;R(-900,-900,3800,2900,'url(#board)',0,p);P3.rib=R(160,520,1600,40,C.paper,20,p,{opacity:.9});
  P3.left=R(160,520,0,40,C.sand2,20,p);P3.right=R(1100,520,0,40,C.mint,20,p);
  const ic=(x,kind)=>{const g=G({},p),j=J(g,x,400);CI(0,0,70,C.white,g);if(kind==='hand'){handShape(g,C.coral,.4);}if(kind==='fire'){PA('M -30 30 C -40 -10 -10 -30 0 -60 C 10 -30 40 -10 30 30 Z',C.coral,g);}if(kind==='tab'){R(-36,-44,72,88,'#C9A47A',10,g);for(let k=0;k<3;k++)LN(`M -20 ${-20+k*20} L 20 ${-20+k*20}`,'#7A5A44',5,g);}if(kind==='scroll'){R(-40,-34,80,68,C.paper,6,g,{stroke:C.wood,'stroke-width':6});for(let k=0;k<3;k++)LN(`M -24 ${-14+k*16} L 24 ${-14+k*16}`,C.ink,4,g);}return j;};
  P3.ics=[ic(380,'hand'),ic(700,'fire'),ic(1340,'tab'),ic(1620,'scroll')];P3.pinJ=pin(p,1100,520,C.coral,1.2);
  P3.tL=tag(p,620,680,'Prasejarah','sebelum ada tulisan',{s1:46});P3.tR=tag(p,1440,680,'Sejarah','sesudah ada tulisan',{s1:46,c1:C.mint2});}
{const t=T['b4-3']-.4;cut(t,P2,P3);Object.assign(P3.cam,{x:960,y:540,z:1.15});P3.apply();pop(P3.pinJ,t+.3);
  tl.to(P3.right,{attr:{width:660},duration:1.2,ease:'power2.out'},t+.6);pop(P3.ics[2],t+1.0);pop(P3.ics[3],t+1.4);pop(P3.tR,t+1.8);sfx('pop',t+1.8,.3);
  const c1=capT(T,'b4-3',1);tl.to(P3.left,{attr:{width:940},duration:1.2,ease:'power2.out'},c1);pop(P3.ics[0],c1+.3);pop(P3.ics[1],c1+.6);pop(P3.tL,c1+.8);sfx('pop',c1+.8,.3);
  P3.ics.forEach((j,i)=>tl.to(j,{y:-10,duration:.7,yoyo:true,repeat:-1,ease:'sine.inOut',onUpdate:j.apply},t+2+i*.2));cam(P3,t,960,520,1.25,6,'sine.inOut');}

/* ---------- P4 MESIR: hieroglif, piramida, roda ---------- */
const P4=scene('giza');{const p=P4.g,gy=880;R(-900,-900,3800,2900,'url(#desert)',0,p);const sun=G({},p);P4.rays=J(sun,1550,230);for(let i=0;i<12;i++)R(-10,-190,20,60,C.sun,10,sun,{transform:`rotate(${i*30})`,opacity:.7});CI(1550,230,100,C.sun,p);
  PA('M -900 820 C -300 760 300 800 900 770 C 1500 740 2100 790 2900 770 L 2900 1100 L -900 1100 Z','#EBD3A6',p);R(-900,gy,3800,900,'#E3C79A',0,p);
  P4.pyr=[[1150,1.0],[1560,.75],[1840,.55]].map(([x,s])=>{const g=G({},p);const rows=7,ws=560*s,hs=400*s;const L=[];for(let r=0;r<rows;r++){const w=ws*(1-r/rows),y=gy-(r+1)*hs/rows;L.push(R(x-w/2,y,w,hs/rows+2,r%2?'#D8B77E':'#CFAD72',2,g,{opacity:0}));}return L;});
  const wall=G({},p);R(-200,320,560,560,'#D8B77E',10,wall);P4.gly=[];const gl=['M -24 0 C -10 -20 10 -20 24 0 C 10 20 -10 20 -24 0 Z','M -20 20 L -20 -10 C -20 -30 20 -30 20 -10 L 30 -16 L 20 0 L 20 20 Z','M -30 0 c 10 -12 20 -12 30 0 c 10 12 20 12 30 0','M 0 -30 L 0 30 M -20 -10 L 20 -10'];
  for(let r=0;r<4;r++)for(let c=0;c<3;c++){const g=G({opacity:0,transform:`translate(${-60+c*150},${400+r*120})`},wall);const d=gl[(r+c)%4];if((r+c)%4===2||(r+c)%4===3)LN(d,C.indigo,7,g);else PA(d,C.indigo,g);P4.gly.push(g);}
  const cart=G({},p);P4.cart=cart;const cb=G({transform:`translate(600,${gy})`},cart);R(-160,-120,320,40,C.wood,8,cb);R(-120,-240,240,120,'#CFAD72',4,cb);P4.wh=[-100,100].map(x=>{const w=G({},cb),j=J(w,x,-50);CI(0,0,50,C.wood,w);CI(0,0,36,'#E3C79A',w);for(let k=0;k<4;k++)R(-4,-36,8,72,C.wood,3,w,{transform:`rotate(${k*45})`});CI(0,0,10,C.wood,w);return j;});
  P4.worker=character(p,330,gy,.85,{who:'pekerja',shirt:C.paper,pants:C.sand2,hair:'#1E1A3F',skin:'#A86B47'});
  P4.tag=tag(p,1150,340,'Piramida Agung Giza','±2560 SM');P4.tagR=tag(p,620,560,'roda','',{s1:40,c1:C.coral});}
{const t=T['b4-4']-.4;slide(t,P3,P4,'x',96);Object.assign(P4.cam,{x:300,y:560,z:1.4});P4.apply();spin(P4.rays,t,40);
  P4.gly.forEach((g,i)=>tl.to(g,{opacity:1,duration:.15},t+.4+i*.18));
  const c1=capT(T,'b4-4',1);cam(P4,c1-.4,1350,600,1.22,1.4,'power2.inOut');P4.pyr.forEach((L,k)=>L.forEach((r,i)=>tl.fromTo(r,{opacity:0,y:-40},{opacity:1,y:0,duration:.25,ease:'power2.out',immediateRender:false},c1+k*.5+i*.12)));pop(P4.tag,c1+1.6);sfx('pop',c1+1.6,.3);
  const c2=capT(T,'b4-4',2);cam(P4,c2-.3,800,640,1.35,1.0,'power2.inOut');idle(P4.worker,t);
  tl.fromTo(P4.cart,{x:-900},{x:300,duration:4.2,ease:'power1.out',immediateRender:false},c2-.6);P4.wh.forEach(j=>tl.fromTo(j,{r:0},{r:720,duration:4.2,ease:'power1.out',onUpdate:j.apply,immediateRender:false},c2-.6));
  walk(P4.worker,c2-.4,3.6,560);pop(P4.tagR,c2+.6);tl.to(P4.tagR,{x:300,duration:3.6,ease:'power1.out',onUpdate:P4.tagR.apply},c2+.6);
  tl.to(P4.cam,{x:1200,duration:3.6,ease:'power1.inOut',onUpdate:P4.apply},c2+.8);}

DUR=T.end+1.4;tl.to({},{duration:.01},DUR);
