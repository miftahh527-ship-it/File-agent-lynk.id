/* BAB 7 — Revolusi Industri */
const T=voPlan(['b7-1','b7-2','b7-3','b7-4'],3.6,.8);
const B0=bumper('1760','BAB 7');

/* ---------- P1 PABRIK, MESIN UAP, KERETA ---------- */
const P1=scene('pabrik');{const p=P1.g,gy=860;R(-900,-900,3800,2900,'url(#smog)',0,p);P1.cl=[cloud(p,400,160,.9,'#B9B4AC',.9),cloud(p,1500,120,.7,'#B9B4AC',.9)];
  bgGround(p,gy,'#8E8A80','#A9A296');
  const fa=G({},p);[[200,420],[560,520],[920,380]].forEach(([x,h],i)=>{R(x,gy-h,320,h,i%2?'#B5634C':'#9E5442',6,fa);for(let k=0;k<3;k++)R(x+40+k*90,gy-h+60,50,70,C.sun,4,fa,{opacity:.8});PA(`M ${x} ${gy-h} L ${x+80} ${gy-h-60} L ${x+160} ${gy-h} L ${x+240} ${gy-h-60} L ${x+320} ${gy-h} Z`,'#7A3E34',fa);});
  P1.chim=[[300,gy-700],[680,gy-800],[1050,gy-660]];P1.chim.forEach(([x,y])=>R(x-30,y,60,300,'#5E4A3A',6,p));
  P1.smoke=[];P1.chim.forEach(([x,y],k)=>{for(let i=0;i<5;i++)P1.smoke.push([CI(x,y-10,40+rnd(i+k*5)*30,'#7D7A78',p,{opacity:0}),k*.4+i*.6]);});
  /* mesin uap */
  const en=G({},p);R(1300,gy-260,260,260,'#4D5378',16,en);CI(1430,gy-130,90,'#3E4366',en);P1.wheel=J(G({},en),1430,gy-130);CI(0,0,80,'none',P1.wheel.el,{stroke:C.sun,'stroke-width':14});for(let k=0;k<4;k++)R(-6,-80,12,160,C.sun,4,P1.wheel.el,{transform:`rotate(${k*45})`});
  P1.piston=R(1560,gy-150,120,40,'#8E8E94',8,p);
  /* rel + kereta */
  R(-900,gy+120,3800,16,'#5E4A3A',0,p);for(let i=0;i<40;i++)R(-900+i*100,gy+110,50,36,'#6E5A48',4,p);
  const tr=G({},p);P1.train=tr;const tb=G({transform:`translate(0,${gy+110})`},tr);R(0,-200,300,170,C.coral,16,tb);R(220,-300,70,110,C.ink,10,tb);R(300,-150,140,120,C.coral,12,tb);R(40,-170,100,70,C.sky,8,tb);
  for(let c=1;c<3;c++){R(-340*c,-180,300,150,c%2?C.blue2:C.mint2,14,tb);for(let k=0;k<3;k++)R(-340*c+30+k*90,-160,60,50,C.sky,6,tb);}
  P1.tw=[];for(let c=0;c<3;c++)for(let k=0;k<2;k++){const w=G({},tb),j=J(w,-340*c+60+k*180,-20);CI(0,0,36,C.ink,w);CI(0,0,14,C.paper,w);R(-3,-34,6,24,C.paper,3,w);P1.tw.push(j);}
  P1.tsmoke=[];for(let i=0;i<6;i++)P1.tsmoke.push(CI(0,0,30,'#C9C6D6',tb,{opacity:0,transform:'translate(255,-310)'}));
  P1.tag=tag(p,960,170,'Revolusi Industri','±1760 · Inggris',{s1:44});P1.tag2=tag(p,1430,gy-380,'mesin uap · James Watt','',{s1:30});}
slide(3.0,B0,P1,'x',96);Object.assign(P1.cam,{x:960,y:540,z:1.15});P1.apply();
{const t=T['b7-1'];P1.smoke.forEach(([c,d])=>drift(c,3+d,{y:-380,x:60,scale:2.2,dur:3,peak:.75}));P1.cl.forEach(c=>tl.fromTo(c,{x:0},{x:120,duration:14,ease:'none',immediateRender:false},3));
  pop(P1.tag,t+.3);sfx('pop',t+.3,.3);spin(P1.wheel,3,1.4);tl.to(P1.piston,{x:-60,duration:.35,yoyo:true,repeat:-1,ease:'sine.inOut'},3);
  const c2=capT(T,'b7-1',2);cam(P1,c2-.3,1400,600,1.4,1.0,'power2.inOut');pop(P1.tag2,c2);
  tl.fromTo(P1.train,{x:-1300},{x:2600,duration:6.5,ease:'power1.inOut',immediateRender:false},c2+1.2);P1.tw.forEach(j=>spin(j,c2+1.2,.6));P1.tsmoke.forEach((s,i)=>drift(s,c2+1.2+i*.25,{y:-160,x:-120,scale:2,dur:1.4,peak:.8}));
  cam(P1,c2+1.4,1000,620,1.2,1.4,'power2.inOut');}

/* ---------- P2 PENEMUAN: rak dengan 4 benda ---------- */
const P2=scene('penemuan');{const p=P2.g;R(-900,-900,3800,2900,'url(#room)',0,p);R(-900,780,3800,900,'#8E84A8',0,p);R(160,700,1600,40,C.wood,12,p);
  const items=[];const box=(x,draw)=>{const g=G({},p),j=J(g,x,560);CI(0,0,110,C.white,g);draw(g);items.push(j);return j;};
  box(360,g=>{R(-70,-10,120,24,C.paper,8,g,{stroke:C.blue2,'stroke-width':5});R(50,-4,30,12,C.blue2,4,g);LN('M -70 2 L -100 2',C.ink,4,g);R(-50,-8,60,20,C.coral,4,g,{opacity:.6});});
  box(760,g=>{CI(0,-20,50,C.sun,g);R(-20,26,40,40,'#8E8E94',6,g);LN('M -12 -10 L 0 6 L 12 -10',C.coral,4,g);});
  box(1160,g=>{R(-80,-10,160,24,C.paper,10,g);R(-20,-60,40,120,C.paper,8,g);R(-70,-48,140,12,C.blue2,6,g);R(-70,40,40,12,C.blue2,6,g);});
  box(1560,g=>{CI(0,0,60,'#F2EAD8',g,{stroke:C.mint2,'stroke-width':5});CI(-18,-10,10,C.mint,g);CI(16,12,12,C.mint,g);CI(10,-20,8,C.mint,g);});
  P2.items=items;P2.tags=[['vaksin cacar','Jenner · 1796',360],['bola lampu','Edison · 1879',760],['pesawat','Wright · 1903',1160],['penisilin','Fleming · 1928',1560]].map(([a,b,x])=>tag(p,x,350,a,b,{s1:34,s2:28}));
  const pl=G({opacity:0},p);P2.plane=pl;R(-120,-14,240,28,C.paper,12,pl);R(-30,-80,40,160,C.paper,10,pl);R(-110,-40,30,80,C.paper,8,pl);}
{const t=T['b7-2']-.4;slide(t,P1,P2,'x',96);Object.assign(P2.cam,{x:960,y:600,z:1.15});P2.apply();
  const at=[t+1.6,t+3.6,capT(T,'b7-2',1)+.1,capT(T,'b7-2',1)+2.6];P2.items.forEach((j,i)=>{pop(j,at[i]);pop(P2.tags[i],at[i]+.2);sfx('pop',at[i],.25);tl.to(j,{y:-14,duration:.7,yoyo:true,repeat:-1,ease:'sine.inOut',onUpdate:j.apply},at[i]+.6);});
  tl.set(P2.plane,{opacity:1},at[2]+.4);flyAlong(P2.plane,'M -300 300 C 400 150 1200 150 2300 260',at[2]+.4,2.6,{scale:.8});}

/* ---------- P3 GRAFIK PENDUDUK DUNIA ---------- */
const P3=scene('grafik');{const p=P3.g;R(-900,-900,3800,2900,'url(#board)',0,p);const x0=260,y0=860,w=1400,h=620;
  LN(`M ${x0} ${y0-h} L ${x0} ${y0} L ${x0+w} ${y0}`,C.paper,6,p);for(let k=1;k<=3;k++){LN(`M ${x0} ${y0-k*180} L ${x0+w} ${y0-k*180}`,C.paper,2,p,{opacity:.2});TX(x0-60,y0-k*180+14,k+' M',34,C.paper,p);}
  TX(x0+w/2,y0+70,'tahun',32,C.paper,p,{opacity:.7});
  const px=f=>x0+f*w,py=v=>y0-v*180;P3.line=route(p,`M ${px(0)} ${py(.02)} L ${px(.55)} ${py(.06)} C ${px(.66)} ${py(.2)} ${px(.72)} ${py(.6)} ${px(.76)} ${py(1)} C ${px(.82)} ${py(1.5)} ${px(.86)} ${py(2)} ${px(.9)} ${py(2)} C ${px(.94)} ${py(2.5)} ${px(.96)} ${py(3)} ${px(.98)} ${py(3)}`,C.sun,12);
  P3.pts=[[.76,1,'1800'],[.9,2,'1930'],[.98,3,'1960']].map(([f,v,y])=>{const g=G({},p),j=J(g,px(f),py(v));CI(0,0,18,C.coral,g);CI(0,0,8,C.paper,g);TX(0,-34,v+' miliar · '+y,32,C.paper,g,{'font-weight':700,'text-anchor':'end'});return j;});
  TX(px(.25),py(.25),'ratusan ribu tahun…',36,C.paper,p,{opacity:.8});P3.nara=character(p,1780,960,.8,NARA);}
{const t=T['b7-3']-.4;cut(t,P2,P3);Object.assign(P3.cam,{x:960,y:560,z:1.12});P3.apply();idle(P3.nara,t);rot(P3.nara.Larm,t+.4,120,.4);
  drawOn(P3.line,capT(T,'b7-3',1),9,'power1.in');pop(P3.pts[0],capT(T,'b7-3',2)+1.6);sfx('pop',capT(T,'b7-3',2)+1.6,.3);
  const c5=capT(T,'b7-3',5);pop(P3.pts[1],c5+.2);pop(P3.pts[2],c5+2.4);sfx('pop',c5+.2,.3);sfx('pop',c5+2.4,.3);face(P3.nara,'kaget',capT(T,'b7-3',4));cam(P3,capT(T,'b7-3',3),1460,480,1.4,2.4,'power2.inOut');}

/* ---------- P4 POLUSI → ATURAN KERJA ---------- */
const P4=scene('aturan');{const p=P4.g,gy=880;P4.sky=R(-900,-900,3800,2900,'url(#smog)',0,p);P4.skyB=R(-900,-900,3800,2900,'url(#skyA)',0,p,{opacity:0});bgGround(p,gy,'#8E8A80','#A9A296');
  R(1200,gy-480,500,480,'#9E5442',6,p);R(1400,gy-760,60,300,'#5E4A3A',6,p);P4.smoke=[];for(let i=0;i<6;i++)P4.smoke.push(CI(1430,gy-770,50,'#6E6A68',p,{opacity:0}));
  P4.kids=[0,1,2].map(i=>{const ch=character(p,300+i*220,gy,.6,{who:'buruh'+i,shirt:['#8E84A8','#A9A296','#B9A06A'][i],pants:'#5E4A3A',hair:'#2A2350',skin:'#C98A62'});const bx=G({},ch.torso.el);R(-50,-120,100,70,'#8A6A4A',6,bx);return ch;});
  P4.doc=G({},p);P4.docJ=J(P4.doc,960,440);R(-200,-260,400,520,C.paper,18,P4.doc);TX(0,-180,'Aturan Kerja',44,C.ink,P4.doc,{'font-weight':700});for(let k=0;k<5;k++)LN(`M -140 ${-110+k*50} L 140 ${-110+k*50}`,C.lilac2,6,P4.doc);
  P4.st=stamp(p,1060,620,'lebih adil',C.mint2,48,-10);}
{const t=T['b7-4']-.4;slide(t,P3,P4,'x',96);Object.assign(P4.cam,{x:960,y:560,z:1.18});P4.apply();P4.smoke.forEach((s,i)=>drift(s,t+i*.4,{y:-420,x:-120,scale:2.4,dur:2.6,peak:.8}));
  P4.kids.forEach((c,i)=>{idle(c,t);rot(c.torso,t,10,.5);face(c,'cemas',t);});cam(P4,capT(T,'b7-4',1),600,620,1.4,1.0,'power2.inOut');
  const c2=capT(T,'b7-4',2);pop(P4.docJ,c2);pop(P4.st,c2+1.6);sfx('pop',c2+1.6,.4);tl.to(P4.skyB,{opacity:1,duration:1.4},c2+1.2);tl.to(P4.smoke,{autoAlpha:0,duration:.6},c2+1.2);
  P4.kids.forEach((c,i)=>{rot(c.torso,c2+1.4,0,.4);face(c,'lebar',c2+1.6);});cam(P4,c2,960,520,1.2,1.2,'power2.inOut');}

DUR=T.end+1.4;tl.to({},{duration:.01},DUR);
