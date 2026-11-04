/* BAB 6 — Mesin cetak, penjelajahan, dan sains */
const T=voPlan(['b6-1','b6-2','b6-3','b6-4'],3.6,.8);
const B0=bumper('1440','BAB 6');

/* ---------- P1 MESIN CETAK ---------- */
const P1=scene('cetak');{const p=P1.g,gy=900;R(-900,-900,3800,2900,'url(#room)',0,p);R(-900,gy,3800,900,'#8A6A4A',0,p);for(let i=0;i<10;i++)R(-600+i*320,gy,6,900,'#7A5A44',0,p);
  R(200,180,260,200,C.sky,12,p);LN('M 330 180 L 330 380 M 200 280 L 460 280',C.paper,10,p);
  /* biarawan menyalin dengan tangan (kiri) */
  R(160,gy-260,360,24,C.wood,8,p);R(180,gy-236,20,236,C.wood,4,p);R(480,gy-236,20,236,C.wood,4,p);P1.monk=character(p,280,gy,.8,{who:'penyalin',shirt:'#8E84A8',pants:'#6E6A8C',hair:'#5A3A2A',skin:'#D9A07A'});
  P1.candle=G({},p);R(430,gy-330,22,70,C.paper,6,P1.candle);P1.fl=J(G({},P1.candle),441,gy-336);PA('M -10 0 C -14 -20 0 -30 0 -44 C 6 -30 14 -20 10 0 Z',C.sun,P1.fl.el);
  /* mesin cetak (kanan) */
  const pr=G({},p);R(940,180,40,720,C.wood,10,pr);R(1380,180,40,720,C.wood,10,pr);R(940,180,480,50,C.wood,10,pr);R(900,640,560,40,sh(C.wood,.8),8,pr);
  LN('M 1180 230 L 1180 400',C.ink,14,pr);const lv=G({},pr);P1.lever=J(lv,1180,330);LN('M 0 0 L 260 0',C.wood,14,lv);CI(260,0,20,C.wood,lv);
  P1.plate=R(1020,400,320,60,'#6E6A8C',8,pr);
  P1.worker=character(p,1660,gy,.95,{who:'gutenberg',shirt:C.coral,pants:C.ink,hair:'#5A3A2A',skin:'#E3A57B',beard:true});
  P1.sheets=[];for(let i=0;i<8;i++){const g=G({opacity:0},p);R(-60,-40,120,80,C.paper,4,g);for(let k=0;k<3;k++)LN(`M -40 ${-20+k*20} L 40 ${-20+k*20}`,C.ink,4,g);P1.sheets.push(g);}
  P1.stack=[];for(let i=0;i<6;i++)P1.stack.push(R(1520,gy-20-i*18,140,16,C.paper,3,p,{opacity:0}));
  P1.tag=tag(p,1180,110,'Johannes Gutenberg','±1440 · Jerman',{s1:40});
  P1.books=[];for(let i=0;i<6;i++){const g=G({opacity:0},p);R(-34,-26,68,52,[C.coral,C.blue,C.sun,C.mint,C.lilac2,C.pink][i],6,g);R(-4,-26,8,52,C.paper,2,g);P1.books.push(g);}}
slide(3.0,B0,P1,'x',96);Object.assign(P1.cam,{x:1180,y:520,z:1.2});P1.apply();
{const t=T['b6-1'];idle(P1.worker,3);idle(P1.monk,3);pop(P1.tag,t+.5);sfx('pop',t+.5,.3);rot(P1.worker.Larm,3,100,.01);
  tl.to(P1.fl,{sy:1.2,sx:.85,duration:.2,yoyo:true,repeat:-1,ease:'sine.inOut',onUpdate:P1.fl.apply},3);
  for(let k=0;k<6;k++){const a=t+1.2+k*1.6;tl.to(P1.lever,{r:28,duration:.35,ease:'power2.in',onUpdate:P1.lever.apply},a);tl.to(P1.plate,{attr:{y:570},duration:.35,ease:'power2.in'},a);
    tl.to(P1.lever,{r:0,duration:.5,ease:'power2.out',onUpdate:P1.lever.apply},a+.45);tl.to(P1.plate,{attr:{y:400},duration:.5,ease:'power2.out'},a+.45);
    if(k<P1.sheets.length)flyAlong(P1.sheets[k],'M 1180 610 C 1300 520 1440 560 1590 '+(880-k*18),a+.6,.6);tl.set(P1.sheets[k],{opacity:1},a+.6);tl.set(P1.sheets[k],{opacity:0},a+1.2);if(k<6)tl.set(P1.stack[k],{opacity:1},a+1.2);}
  const c1=capT(T,'b6-1',1);cam(P1,c1-.2,380,560,1.4,1.0,'power2.inOut');tl.to(P1.monk.Rfore,{r:-20,duration:.6,yoyo:true,repeat:5,ease:'sine.inOut',onUpdate:P1.monk.Rfore.apply},c1);face(P1.monk,'cemas',c1+1);
  const c2=capT(T,'b6-1',2);cam(P1,c2-.2,1300,520,1.22,1.0,'power2.inOut');const c3=capT(T,'b6-1',3);
  P1.books.forEach((b,i)=>{tl.set(b,{opacity:1},c3+i*.12);flyAlong(b,`M 1590 760 C ${1500-i*80} ${300-i*30} ${900-i*150} ${200+i*40} ${300+i*260} ${-200}`,c3+i*.12,1.2,{ease:'power1.in'});});}

/* ---------- P2 RUTE LAUT ---------- */
const P2=scene('rute');{const p=P2.g;R(-900,-900,3800,2900,'url(#skyD)',0,p);P2.m=worldMap(p,110,130,1700,820);const m=P2.m;
  const mk=(pts,col)=>{const d='M '+pts.map(([a,b])=>m.pt(a,b).join(' ')).join(' L ');return {d,n:route(p,d,col,9)};};
  P2.r=[mk([[-6,37],[-20,32],[-45,26],[-70,22],[-76,21]],C.sun),mk([[-9,38],[-18,22],[-20,5],[0,-25],[18,-37],[35,-30],[45,-15],[55,5],[68,14],[75,13]],C.coral),mk([[75,13],[80,6],[95,5],[101,2.5],[115,-4],[127,-1]],C.paper)];
  P2.sh=P2.r.map(()=>{const g=G({opacity:0},p);PA('M -26 0 L 26 0 L 18 14 L -18 14 Z',C.wood,g);PA('M 2 -40 L 2 0 L 26 -6 Z',C.paper,g);return g;});
  P2.tg=[['Columbus · 1492',-60,38],['Vasco da Gama · 1498',62,26],['Malaka · 1511',100,14]].map(([n,a,b])=>{const[x,y]=m.pt(a,b);return tag(p,x,y,n,'',{s1:32});});
  P2.spice=pin(p,...m.pt(128,-1.5),C.sun,1.0);}
{const t=T['b6-2']-.4;slide(t,P1,P2,'x',96);Object.assign(P2.cam,{x:960,y:540,z:1.12});P2.apply();
  pop(P2.spice,capT(T,'b6-2',1),.4);sfx('pop',capT(T,'b6-2',1),.25);
  [2,3,4].forEach((ci,i)=>{const a=capT(T,'b6-2',ci);drawOn(P2.r[i].n,a,2.4,'power1.inOut');tl.set(P2.sh[i],{opacity:1},a);flyAlong(P2.sh[i],P2.r[i].d,a,2.4);pop(P2.tg[i],a+.3);sfx('pop',a+.3,.25);});
  cam(P2,capT(T,'b6-2',2)-.3,700,520,1.3,1.0,'power2.inOut');cam(P2,capT(T,'b6-2',3)-.3,1000,620,1.3,1.0,'power2.inOut');cam(P2,capT(T,'b6-2',4)-.3,1300,560,1.35,1.0,'power2.inOut');}

/* ---------- P3 VOC: awal penjajahan ---------- */
const P3=scene('voc');{const p=P3.g,gy=760;R(-900,-900,3800,2900,'url(#skyD)',0,p);P3.cl=[cloud(p,400,180,.9,'#6E6A8C',.8),cloud(p,1500,140,.7,'#6E6A8C',.8)];
  R(-900,gy+60,3800,900,'url(#sea)',0,p);P3.w=[waves(p,gy+140,C.paper,10,.3),waves(p,gy+260,C.paper,10,.3)];R(-900,gy-20,1500,80,C.wood,0,p);
  P3.ships=[[1300,gy+170,1.25],[1800,gy+210,1.0]].map(([x,y,s])=>{const S=ship(p,x,y,s,C.paper,'#5E4A3A');const fl=G({},S.bob.el);R(4,-260,60,14,'#C8443C',0,fl);R(4,-246,60,14,C.paper,0,fl);R(4,-232,60,14,C.blue2,0,fl);return S;});
  P3.workers=[0,1,2].map(i=>{const ch=character(p,120+i*200,gy-20,.72,{who:'pk'+i,shirt:['#C98B5E','#B97A52','#D9A46E'][i],pants:'#6E5A48',hair:'#1E1A3F',skin:'#8C5A3C'});const sk=G({},ch.torso.el);sack(sk,74,-40,.8);return ch;});
  P3.tag=tag(p,960,190,'1602 · VOC','awal masa penjajahan',{s1:44});}
{const t=T['b6-3']-.4;cut(t,P2,P3);Object.assign(P3.cam,{x:960,y:540,z:1.15});P3.apply();
  P3.ships.forEach((s,i)=>{bob(s,t,5,1.4+i*.2);tl.fromTo(s.g,{x:300},{x:0,duration:5,ease:'power1.out',immediateRender:false},t);});P3.w.forEach((w,i)=>tl.fromTo(w,{x:0},{x:-360,duration:4+i,ease:'none',repeat:-1,immediateRender:false},t));
  P3.workers.forEach((c,i)=>{idle(c,t);rot(c.torso,t,8,.4);face(c,'cemas',t);walk(c,capT(T,'b6-3',1),4,260);});P3.cl.forEach(c=>tl.fromTo(c,{x:0},{x:120,duration:14,ease:'none',immediateRender:false},t));
  pop(P3.tag,capT(T,'b6-3',2));sfx('pop',capT(T,'b6-3',2),.3);cam(P3,capT(T,'b6-3',1),560,560,1.35,1.4,'power2.inOut');cam(P3,capT(T,'b6-3',2)-.2,1300,480,1.25,1.4,'power2.inOut');}

/* ---------- P4 SAINS: percobaan → Galileo → Newton ---------- */
const P4=scene('lab');{const p=P4.g,gy=900;R(-900,-900,3800,2900,'url(#room)',0,p);R(-900,gy,3800,900,'#8E84A8',0,p);R(560,640,800,30,C.wood,10,p);
  const fl=(x,c)=>{const g=G({},p);PA(`M ${x-16} 560 L ${x-16} 600 L ${x-50} 640 L ${x+50} 640 L ${x+16} 600 L ${x+16} 560 Z`,C.paper,g,{opacity:.9});PA(`M ${x-34} 620 L ${x+34} 620 L ${x+50} 640 L ${x-50} 640 Z`,c,g);return g;};fl(700,C.mint);fl(860,C.coral);fl(1020,C.sun);
  P4.bub=[];for(let i=0;i<8;i++)P4.bub.push(CI(700+(i%3)*160,600,6,C.paper,p,{opacity:0}));
  P4.sci=character(p,1200,gy,.9,{who:'ilmuwan',shirt:C.paper,pants:C.ink,hair:'#3A2A44',skin:'#D9A07A',style:'pony'});const mg=G({},P4.sci.Rhand.el);CI(0,40,30,'none',mg,{stroke:C.ink,'stroke-width':8});LN('M 0 10 L 0 -30',C.ink,8,mg);
  P4.tag=tag(p,960,250,'pengamatan & percobaan','',{s1:40});}
const P4b=scene('galileo');{const p=P4b.g,gy=900;R(-900,-900,3800,2900,'url(#skyN)',0,p);P4b.st=stars(p,60,800);bgHills(p,860,'#2F3550',1);bgGround(p,gy,'#3E4A3C','#4A4E5E');
  P4b.gal=character(p,560,gy,.95,{who:'galileo',shirt:'#8E84A8',pants:C.ink,hair:'#5A3A2A',skin:'#E3A57B',beard:true});
  const ts=G({},p);LN('M 720 900 L 780 640 M 840 900 L 780 640',C.wood,10,ts);const tb=G({},ts);P4b.tel=J(tb,780,640);R(-20,-24,240,48,C.sun,16,tb);R(200,-30,40,60,sh(C.sun,.8),10,tb);
  CI(1420,330,110,'#D9A07A',p);for(let k=0;k<3;k++)LN(`M 1310 ${300+k*30} L 1530 ${300+k*30}`,'#B5634C',10,p,{opacity:.6});
  P4b.moons=[0,1,2,3].map(i=>{const o={a:i*1.6},c=CI(1420,330,12,C.paper,p);return {o,c,r:170+i*45};});P4b.tag=tag(p,1420,600,'Galileo · ±1609','bulan-bulan Jupiter',{s1:38});}
const P4c=scene('newton');{const p=P4c.g,gy=900;bgSky(p);P4c.cl=[cloud(p,500,170,.8),cloud(p,1500,130,.6)];bgHills(p,800,C.mint,.6);bgGround(p,gy,C.lime2,'#9DBB7A');
  const tr=G({},p);R(1000,gy-420,50,420,'#6E5A48',14,tr);const cn=G({},p);P4c.can=J(cn,1025,gy-430);CI(0,-80,220,C.mint2,cn);CI(-160,0,140,C.mint,cn);CI(170,-10,150,C.mint,cn);
  P4c.apple=CI(1160,gy-380,22,C.coral,p);P4c.arrow=route(p,'M 1240 360 L 1240 760 M 1210 720 L 1240 760 L 1270 720',C.sun,10);
  P4c.nw=character(p,1250,gy,.9,{who:'newton',shirt:C.blue2,pants:C.ink,hair:'#F3F1EC',skin:'#E3A57B',style:'wild'});
  P4c.tag=tag(p,560,280,'Isaac Newton · 1687','hukum gravitasi',{s1:38});}
{const t=T['b6-4']-.4;slide(t,P3,P4,'x',96);Object.assign(P4.cam,{x:960,y:560,z:1.2});P4.apply();idle(P4.sci,t);pop(P4.tag,t+.6);
  P4.bub.forEach((b,i)=>drift(b,t+i*.2,{y:-200,dur:1.6,peak:.9}));rot(P4.sci.Rarm,t+.4,-70,.4);cam(P4,t+.3,960,520,1.4,4,'sine.inOut');
  const c1=capT(T,'b6-4',1)-.2;cut(c1,P4,P4b);Object.assign(P4b.cam,{x:960,y:560,z:1.15});P4b.apply();twinkle(P4b.st,c1);idle(P4b.gal,c1);rot(P4b.gal.Rarm,c1,-70,.4);
  rot(P4b.tel,c1,-24,.01);P4b.moons.forEach((mm,i)=>tl.to(mm.o,{a:mm.o.a+Math.PI*2*(2-i*.3),duration:6,ease:'none',onUpdate(){mm.c.setAttribute('cx',1420+Math.cos(mm.o.a)*mm.r);mm.c.setAttribute('cy',330+Math.sin(mm.o.a)*mm.r*.25);}},c1));
  pop(P4b.tag,c1+1.2);sfx('pop',c1+1.2,.3);cam(P4b,c1+.3,1200,420,1.3,2,'power2.inOut');
  const c2=capT(T,'b6-4',2)-.2;slide(c2,P4b,P4c,'x',96);Object.assign(P4c.cam,{x:1000,y:560,z:1.2});P4c.apply();idle(P4c.nw,c2);sway(P4c.can,c2,1.2,2);
  tl.to(P4c.apple,{attr:{r:26},duration:.15,yoyo:true,repeat:3},c2+.9);tl.fromTo(P4c.apple,{attr:{cy:520}},{attr:{cy:880},duration:.7,ease:'power2.in',immediateRender:false},c2+1.6);
  drawOn(P4c.arrow,c2+1.6,.7);face(P4c.nw,'kaget',c2+2.3);pop(P4c.tag,c2+2.4);sfx('pop',c2+2.4,.3);cam(P4c,c2+.2,1100,520,1.4,2,'power2.inOut');}

DUR=T.end+1.4;tl.to({},{duration:.01},DUR);
