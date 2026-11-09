/* BAB 5 — Kerajaan besar dunia dan Nusantara */
const T=voPlan(['b5-1','b5-2','b5-3','b5-4','b5-5'],3.6,.8);
const B0=bumper('500 SM','BAB 5');
const BRICK='#B5634C',STONE='#A9A296',STONE2='#8F897E';
function col(p,x,y,h,c=C.paper){R(x-22,y-h,44,h,c,4,p);R(x-32,y-h-16,64,18,c,4,p);R(x-32,y-4,64,14,c,4,p);for(let k=-1;k<=1;k++)LN(`M ${x+k*12} ${y-h+6} L ${x+k*12} ${y-8}`,sh(c,.9),3,p);}
function books(p,x,y,n,w=40){for(let i=0;i<n;i++)R(x+i*w,y-90-(i%3)*10,w-6,90+(i%3)*10,[C.coral,C.blue,C.sun,C.mint,C.lilac2][i%5],4,p);}

/* ---------- P1a YUNANI: demokrasi ---------- */
const P1=scene('yunani');{const p=P1.g,gy=880;bgSky(p);P1.clouds=[cloud(p,300,180,.8),cloud(p,1500,140,.6)];bgHills(p,780,C.mint,.5);bgGround(p,gy,'#C9C3B8','#E3DDD0');
  const tp=G({},p);R(560,gy-60,800,60,C.paper,4,tp);R(600,gy-90,720,30,'#E4E0D6',4,tp);for(let i=0;i<7;i++)col(tp,640+i*106,gy-90,320);R(580,gy-450,760,50,C.paper,6,tp);PA(`M 560 ${gy-450} L 960 ${gy-620} L 1360 ${gy-450} Z`,'#E4E0D6',tp);
  const jar=G({},p);P1.jar=J(jar,960,gy);PA('M -70 0 C -110 -60 -100 -150 -50 -170 L 50 -170 C 100 -150 110 -60 70 0 Z',C.coral,jar);R(-56,-190,112,24,sh(C.coral,.8),8,jar);
  P1.voters=[[560,C.blue],[760,C.mint],[1160,C.sun],[1360,C.lilac2]].map(([x,c],i)=>character(p,x,gy+30,.7,{who:'v'+i,shirt:c,pants:C.paper,hair:['#2A2350','#5A3A2A','#1E1A3F','#3A2A44'][i],skin:['#D9A07A','#C98A62','#B97A52','#E3A57B'][i],style:i%2?'pony':'short'}));
  P1.peb=[0,1,2,3].map(i=>CI(960,gy-420,14,C.paper,p,{opacity:0}));P1.tag=tag(p,1560,420,'Yunani','awal demokrasi');}
slide(3.0,B0,P1,'x',96);Object.assign(P1.cam,{x:960,y:560,z:1.15});P1.apply();
{const t=T['b5-1'];P1.voters.forEach((v,i)=>{idle(v,3+i*.1);});P1.clouds.forEach(c=>tl.fromTo(c,{x:0},{x:120,duration:12,ease:'none',immediateRender:false},3));
  const c1=capT(T,'b5-1',1);pop(P1.tag,c1);sfx('pop',c1,.3);cam(P1,c1,960,600,1.4,1.2,'power2.inOut');
  P1.voters.forEach((v,i)=>{const at=c1+.8+i*.9,side=i<2?'R':'L';rot(v[side+'arm'],at,side==='R'?-110:110,.35,'back.out(1.6)');rot(v[side+'arm'],at+.6,0,.3);
    tl.fromTo(P1.peb[i],{opacity:0,x:(i<2?-260:260),y:0},{keyframes:{opacity:[1,1,0]},x:0,y:300,duration:.6,ease:'power2.in',immediateRender:false},at+.25);sfx('pop',at+.8,.15);});
  tl.to(P1.jar,{sy:.94,duration:.12,yoyo:true,repeat:7,onUpdate:P1.jar.apply},c1+1.6);}

/* ---------- P1b ROMAWI: jalan & hukum ---------- */
const P1b=scene('romawi');{const p=P1b.g,gy=700;bgSky(p);bgHills(p,700,C.mint,.6);R(-900,gy,3800,900,C.lime2,0,p);
  PA(`M 860 ${gy} L 1060 ${gy} L 1700 1300 L 220 1300 Z`,STONE,p);P1b.lines=G({},p);for(let i=0;i<10;i++){const y=gy+20+i*i*7;LN(`M ${960-(100+i*i*7*.8)} ${y} L ${960+(100+i*i*7*.8)} ${y}`,STONE2,4,P1b.lines);}
  R(1500,gy-140,60,160,C.paper,8,p);TX(1530,gy-60,'X',44,C.ink,p,{'font-weight':700});
  P1b.sold=[0,1,2].map(i=>{const ch=character(p,700+i*170,1040,.8,{who:'s'+i,shirt:C.coral,pants:'#C9A47A',hair:'#2A2350',skin:'#C98A62'});const hg=G({},ch.headAcc);PA('M -84 -110 C -84 -200 84 -200 84 -110 Z','#B9A06A',hg);R(-12,-226,24,40,C.coral,8,hg);return ch;});
  P1b.law=G({},p);P1b.lawJ=J(P1b.law,1500,380);R(-150,-120,300,240,C.paper,16,P1b.law);TX(0,-60,'HUKUM',40,C.ink,P1b.law,{'font-weight':700});for(let k=0;k<4;k++)LN(`M -100 ${-10+k*36} L 100 ${-10+k*36}`,C.lilac2,5,P1b.law);
  P1b.tag=tag(p,560,260,'Romawi','jalan & hukum');}
{const t=capT(T,'b5-1',2)-.2;cut(t,P1,P1b);Object.assign(P1b.cam,{x:960,y:640,z:1.2});P1b.apply();P1b.sold.forEach((s,i)=>{walk(s,t,3.8,-40);idle(s,t);});
  tl.fromTo(P1b.lines,{y:0},{y:60,duration:.6,ease:'none',repeat:-1,immediateRender:false},t);pop(P1b.tag,t+.4);pop(P1b.lawJ,t+1.8);sfx('pop',t+1.8,.3);cam(P1b,t+.2,1060,560,1.35,3.2,'sine.inOut');}

/* ---------- P1c TIONGKOK: Cai Lun membuat kertas ---------- */
const P1c=scene('kertas');{const p=P1c.g,gy=880;R(-900,-900,3800,2900,'url(#room)',0,p);R(-900,gy,3800,900,'#C9A47A',0,p);
  const roof=G({},p);PA('M -200 120 C 400 60 1500 60 2100 120 L 2100 200 L -200 200 Z','#7A3E34',roof);
  R(600,gy-170,360,170,'#8A6A4A',20,p);R(616,gy-150,328,40,C.sky,10,p);P1c.water=waves(p,gy-140,C.paper,4,.6);
  P1c.cai=character(p,860,gy,.95,{who:'cailun',shirt:C.blue2,pants:C.indigo,hair:'#1E1A3F',skin:'#D9A07A'});const fr=G({},P1c.cai.Rhand.el);R(-60,0,120,80,'none',6,fr,{stroke:C.wood,'stroke-width':8});
  LN('M 1100 300 L 1900 300',C.wood,6,p);P1c.sheets=[0,1,2,3,4].map(i=>{const g=G({},p),j=J(g,1180+i*150,300);R(-56,0,112,150,C.paper,4,g);return j;});
  P1c.tag=tag(p,860,250,'Cai Lun','±105 M · kertas');}
{const t=capT(T,'b5-1',3)-.2;slide(t,P1b,P1c,'x',96);Object.assign(P1c.cam,{x:1100,y:560,z:1.22});P1c.apply();idle(P1c.cai,t);
  tl.to(P1c.cai.Rarm,{r:-60,duration:.5,yoyo:true,repeat:5,ease:'sine.inOut',onUpdate:P1c.cai.Rarm.apply},t+.2);tl.fromTo(P1c.water,{x:0},{x:-120,duration:2,ease:'none',repeat:-1,immediateRender:false},t);
  P1c.sheets.forEach((j,i)=>{tl.set(j.el,{opacity:0},0);tl.to(j.el,{opacity:1,duration:.2},t+1+i*.5);sway(j,t+1+i*.5,6,1.1+rnd(i)*.4);});pop(P1c.tag,t+.6);sfx('pop',t+.6,.3);cam(P1c,t+.2,1250,500,1.4,4,'sine.inOut');}

/* ---------- P1d BAGHDAD: pusat ilmu, aljabar ---------- */
const P1d=scene('baghdad');{const p=P1d.g,gy=900;R(-900,-900,3800,2900,'url(#room)',0,p);R(-900,gy,3800,900,'#8E84A8',0,p);
  PA('M 200 900 L 200 300 C 200 120 600 120 600 300 L 600 900 Z','#E8DCC8',p);PA('M 1320 900 L 1320 300 C 1320 120 1720 120 1720 300 L 1720 900 Z','#E8DCC8',p);
  for(let s=0;s<4;s++){R(240,360+s*130,320,12,C.wood,4,p);books(p,250,360+s*130,7,44);R(1360,360+s*130,320,12,C.wood,4,p);books(p,1370,360+s*130,7,44);}
  R(720,300,520,340,'#2F3A36',16,p);R(708,288,544,364,'none',20,p,{stroke:C.wood,'stroke-width':14});
  P1d.eq=route(p,'M 780 470 l 30 40 m 0 -40 l -30 40 M 860 490 l 50 0 m -25 -25 l 0 50 M 960 470 c 30 -10 40 30 0 40 c 40 0 30 50 -10 40 M 1050 480 l 50 0 m -50 20 l 50 0 M 1150 468 l -30 0 l -6 20 c 30 -6 40 40 0 40',C.paper,7);
  P1d.sch=character(p,1000,gy,.9,{who:'khawarizmi',shirt:C.mint2,pants:C.paper,hair:'#2E2140',skin:'#B97A52',beard:true});const tb=G({},P1d.sch.headAcc);EL(0,-172,92,38,C.paper,tb);
  P1d.tag=tag(p,960,190,'Baghdad · abad ke-9','Al-Khawarizmi · aljabar',{s1:36,s2:30});}
{const t=capT(T,'b5-1',4)-.2;cut(t,P1c,P1d);Object.assign(P1d.cam,{x:960,y:520,z:1.2});P1d.apply();idle(P1d.sch,t);pop(P1d.tag,t+.4);sfx('pop',t+.4,.3);
  const c5=capT(T,'b5-1',5);rot(P1d.sch.Rarm,c5-.4,-130,.4);drawOn(P1d.eq,c5,2.4,'none');tl.to(P1d.sch.Rfore,{r:-30,duration:.2,yoyo:true,repeat:11,onUpdate:P1d.sch.Rfore.apply},c5);cam(P1d,c5-.2,980,480,1.45,1.4,'power2.inOut');}

/* ---------- P2 NUSANTARA: peta → Prasasti Yupa ---------- */
const P2=scene('yupa');{const p=P2.g;R(-900,-900,3800,2900,'url(#skyD)',0,p);P2.m=mapBox(p,110,110,1700,860,[94,142,-11,8],['su','jv','bo','sl','pp']);const m=P2.m;
  P2.pin=pin(p,...m.pt(117,0.2),C.coral,1.3);P2.tagK=tag(p,m.pt(117,0)[0]-40,m.pt(117,0)[1]+80,'Kutai','Kalimantan Timur',{s1:40});}
const P2b=scene('tugu');{const p=P2b.g,gy=900;bgSky(p);bgHills(p,800,C.mint,.6);bgGround(p,gy,C.lime2,'#C9A47A');P2b.trees=[roundTree(p,200,gy,1.1),roundTree(p,1760,gy,1.0)];
  const st=G({},p);P2b.st=J(st,960,gy);PA('M -90 0 L -80 -560 C -70 -620 70 -620 80 -560 L 90 0 Z',STONE,st);PA('M 40 0 L 50 -560 C 60 -600 80 -590 80 -560 L 90 0 Z',STONE2,st);
  P2b.ins=[];for(let r=0;r<8;r++)P2b.ins.push(route(st,`M -56 ${-510+r*58} c 10 -14 20 -14 26 0 s 16 14 24 0 s 16 -14 24 0 s 16 14 26 0`,C.ink,6));
  P2b.tag=tag(p,1400,350,'Prasasti Yupa','abad ke-4/5 Masehi',{s1:44});P2b.bima=character(p,560,gy,.8,BIMA);}
{const t=T['b5-2']-.4;slide(t,P1d,P2,'x',96);Object.assign(P2.cam,{x:960,y:540,z:1.12});P2.apply();
  const c1=capT(T,'b5-2',1);cam(P2,c1,1080,520,1.35,1.6,'power2.inOut');pop(P2.pin,c1+.8);pop(P2.tagK,capT(T,'b5-2',2)+.3);sfx('pop',c1+.8,.3);
  const c2=capT(T,'b5-2',2)+1.4;cut(c2,P2,P2b);Object.assign(P2b.cam,{x:960,y:540,z:1.15});P2b.apply();P2b.ins.forEach((n,i)=>drawOn(n,c2+.2+i*.25,.4));pop(P2b.tag,c2+.8);
  idle(P2b.bima,c2);rot(P2b.bima.Rarm,c2+.5,-80,.4);P2b.trees.forEach((j,i)=>sway(j,c2+i*.3,1.4,2));cam(P2b,c2+.2,1060,460,1.3,3,'sine.inOut');}

/* ---------- P3 SRIWIJAYA (laut) → BOROBUDUR ---------- */
const P3=scene('sriwijaya');{const p=P3.g;bgSky(p);P3.clouds=[cloud(p,400,180,.8),cloud(p,1500,130,.6)];PA('M -900 640 C -200 600 300 620 700 600 L 700 700 L -900 700 Z',C.mint2,p);
  R(-900,640,3800,900,'url(#sea)',0,p);P3.w=[waves(p,720),waves(p,860),waves(p,980)];
  P3.ships=[[300,760,.9,C.sun],[1000,880,1.1,C.coral],[1600,760,.8,C.paper]].map(([x,y,s,c])=>ship(p,x,y,s,c));P3.tag=tag(p,960,200,'Sriwijaya','kerajaan maritim · abad ke-7');}
const P3b=scene('borobudur');{const p=P3b.g,gy=880;bgSky(p);bgHills(p,760,C.mint2,.7);bgGround(p,gy,C.lime2,'#9DBB7A');P3b.trees=[roundTree(p,140,gy,1.0),roundTree(p,1800,gy,1.1)];
  P3b.lv=[];for(let k=0;k<7;k++){const w=1300-k*150,h=62;P3b.lv.push(R(960-w/2,gy-(k+1)*h,w,h+2,k%2?STONE:STONE2,4,p,{opacity:0}));}
  P3b.stupa=[];for(let k=0;k<9;k++){const x=430+k*130,y=gy-7*62-10;const g=G({opacity:0},p);PA(`M ${x-36} ${y} C ${x-36} ${y-60} ${x+36} ${y-60} ${x+36} ${y} Z`,STONE,g);R(x-4,y-80,8,26,STONE2,3,g);if(k>=3&&k<=5)P3b.stupa.push(g);else P3b.stupa.push(g);}
  const top=G({opacity:0},p);P3b.top=top;PA(`M 900 ${gy-454} C 900 ${gy-560} 1020 ${gy-560} 1020 ${gy-454} Z`,STONE2,top);R(954,gy-610,12,60,STONE2,4,top);
  P3b.tag=tag(p,960,180,'Candi Borobudur','Wangsa Syailendra · abad ke-8–9',{s1:42,s2:30});P3b.st=stamp(p,1560,330,'Candi Buddha terbesar!',C.coral,36,-6);
  P3b.nara=character(p,1600,gy+20,.7,NARA);}
{const t=T['b5-3']-.4;cut(t,P2b,P3);Object.assign(P3.cam,{x:960,y:560,z:1.15});P3.apply();
  P3.ships.forEach((s,i)=>{bob(s,t+i*.2,6,1.1+i*.2);tl.fromTo(s.g,{x:0},{x:420-i*60,duration:8,ease:'none',immediateRender:false},t);});P3.w.forEach((w,i)=>tl.fromTo(w,{x:0},{x:-360,duration:3+i,ease:'none',repeat:-1,immediateRender:false},t));
  pop(P3.tag,t+.8);sfx('pop',t+.8,.3);cam(P3,capT(T,'b5-3',1),1100,660,1.35,2,'sine.inOut');
  const c2=capT(T,'b5-3',2)-.2;slide(c2,P3,P3b,'x',96);Object.assign(P3b.cam,{x:960,y:560,z:1.15});P3b.apply();
  P3b.lv.forEach((r,i)=>tl.fromTo(r,{opacity:0,y:-30},{opacity:1,y:0,duration:.3,ease:'power2.out',immediateRender:false},c2+.4+i*.3));P3b.stupa.forEach((g,i)=>tl.to(g,{opacity:1,duration:.2},c2+2.6+i*.1));tl.to(P3b.top,{opacity:1,duration:.3},c2+3.6);
  pop(P3b.tag,c2+.8);idle(P3b.nara,c2);P3b.trees.forEach((j,i)=>sway(j,c2+i*.3,1.4,2));const c3=capT(T,'b5-3',3);pop(P3b.st,c3);sfx('pop',c3,.35);face(P3b.nara,'lebar',c3);hop(P3b.nara,c3+.2);cam(P3b,c2+.4,960,500,1.22,4,'sine.inOut');}

/* ---------- P4 MAJAPAHIT: gapura + Sumpah Palapa → peta kerajaan Islam ---------- */
const P4=scene('majapahit');{const p=P4.g,gy=900;bgSky(p);bgHills(p,780,C.mint,.5);bgGround(p,gy,C.lime2,'#C9A47A');
  [[-1,700],[1,1220]].forEach(([s,x])=>{const g=G({},p);for(let k=0;k<6;k++){const w=220-k*26;R(x-w/2,gy-(k+1)*90,w,92,k%2?BRICK:sh(BRICK,.88),4,g);}});
  P4.gm=character(p,960,gy,1.0,{who:'gajahmada',shirt:C.coral,pants:'#3E4366',hair:'#1E1A3F',skin:'#A86B47',beard:false});const hg=G({},P4.gm.headAcc);R(-80,-150,160,40,C.sun,10,hg);
  P4.scroll=G({},p);P4.scJ=J(P4.scroll,1440,420);R(-130,-150,260,300,C.paper,14,P4.scroll);TX(0,-90,'Sumpah',34,C.ink,P4.scroll,{'font-weight':700});TX(0,-46,'Palapa',34,C.ink,P4.scroll,{'font-weight':700});for(let k=0;k<4;k++)LN(`M -90 ${0+k*34} L 90 ${0+k*34}`,C.lilac2,4,P4.scroll);
  P4.tag=tag(p,520,250,'Majapahit','berdiri 1293');}
const P4b=scene('islam');{const p=P4b.g;R(-900,-900,3800,2900,'url(#skyD)',0,p);P4b.m=mapBox(p,110,110,1700,860,[94,142,-11,8],['su','jv','bo','sl','pp']);const m=P4b.m;
  EL(...m.pt(127.4,0.8),14,18,C.lime,p);EL(...m.pt(127.4,0.4),12,16,C.lime,p);
  P4b.k=[['Samudra Pasai',97.1,5.1,40,90],['Demak',110.6,-6.9,0,-120],['Ternate',127.4,0.8,-170,-60],['Tidore',127.4,0.4,150,30]].map(([n,a,b,dx,dy])=>{const[x,y]=m.pt(a,b);return {pp:pin(p,x,y,C.sun,1.0),tg:tag(p,x+dx,y+dy,n,'',{s1:34})};});}
{const t=T['b5-4']-.4;slide(t,P3b,P4,'x',96);Object.assign(P4.cam,{x:960,y:560,z:1.2});P4.apply();idle(P4.gm,t);pop(P4.tag,t+.4);sfx('pop',t+.4,.3);
  const c1=capT(T,'b5-4',1);rot(P4.gm.Rarm,c1-.2,-160,.5,'back.out(1.4)');rot(P4.gm.Rfore,c1-.2,-10,.5);face(P4.gm,'senang',c1);pop(P4.scJ,c1+.4);cam(P4,c1-.3,1150,480,1.4,1.2,'power2.inOut');
  const c2=capT(T,'b5-4',2)-.2;cut(c2,P4,P4b);Object.assign(P4b.cam,{x:960,y:540,z:1.15});P4b.apply();
  const at=[c2+2.6,capT(T,'b5-4',3)+.1,capT(T,'b5-4',3)+.9,capT(T,'b5-4',3)+1.8];P4b.k.forEach((k,i)=>{pop(k.pp,at[i],.4);pop(k.tg,at[i]+.15);sfx('pop',at[i],.25);});cam(P4b,c2,960,520,1.22,6,'sine.inOut');}

/* ---------- P5 PELABUHAN REMPAH ---------- */
const P5=scene('rempah');{const p=P5.g,gy=760;bgSky(p);P5.clouds=[cloud(p,400,160,.8),cloud(p,1500,120,.6)];R(-900,gy+60,3800,900,'url(#sea)',0,p);P5.w=[waves(p,gy+140),waves(p,gy+260)];
  R(-900,gy-20,1700,80,C.wood,0,p);for(let i=0;i<8;i++)R(-860+i*210,gy+50,24,180,sh(C.wood,.8),4,p);
  P5.ships=[[1900,gy+160,1.0,C.paper],[2400,gy+200,.85,C.sun],[2900,gy+150,.9,C.coral]].map(([x,y,s,c])=>ship(p,x,y,s,c));
  P5.sacks=[];[[80,'#7A4A34'],[200,'#C9A47A'],[320,'#7A4A34'],[140,'#C9A47A']].forEach(([x,c],i)=>{const g=G({},p),j=J(g,x,gy-20-(i===3?70:0));sack(g,0,0,1.0,c);P5.sacks.push(j);});
  P5.spice=G({opacity:0},p);for(let k=0;k<6;k++){LN(`M ${120+k*40} ${gy-150} l 6 30`,'#5E3A2A',8,P5.spice);CI(126+k*40,gy-150,8,'#5E3A2A',P5.spice);}CI(330,gy-150,20,'#8A5A3A',P5.spice);CI(290,gy-140,16,'#8A5A3A',P5.spice);
  P5.glow=CI(220,gy-80,260,'url(#fireGlow)',p,{opacity:0});
  P5.tr=[[520,C.sun,'#8C5A3C',true],[700,C.blue2,'#D9A07A',false],[880,C.paper,'#B97A52',true]].map(([x,c,sk,bd],i)=>character(p,x,gy-20,.75,{who:'t'+i,shirt:c,pants:C.indigo,hair:'#1E1A3F',skin:sk,beard:bd}));
  P5.tag=tag(p,220,250,'Rempah dari Maluku','cengkih · pala',{s1:40});}
{const t=T['b5-5']-.4;cut(t,P4b,P5);Object.assign(P5.cam,{x:960,y:520,z:1.15});P5.apply();
  P5.ships.forEach((s,i)=>{bob(s,t,6,1.2+i*.2);tl.fromTo(s.g,{x:0},{x:-900,duration:6+i,ease:'power1.out',immediateRender:false},t);});P5.w.forEach((w,i)=>tl.fromTo(w,{x:0},{x:-360,duration:3+i,ease:'none',repeat:-1,immediateRender:false},t));
  P5.tr.forEach((c,i)=>{idle(c,t+i*.2);walk(c,t+.3,2.2,-200);});P5.clouds.forEach(c=>tl.fromTo(c,{x:0},{x:120,duration:14,ease:'none',immediateRender:false},t));
  const c1=capT(T,'b5-5',1);cam(P5,c1-.2,500,480,1.4,1.2,'power2.inOut');P5.tr.forEach((c,i)=>{rot(c.head,c1+i*.15,-8,.3);});
  const c2=capT(T,'b5-5',2);tl.to(P5.spice,{opacity:1,duration:.3},c2);tl.to(P5.glow,{opacity:1,duration:.4},c2);tl.to(P5.glow,{keyframes:{opacity:[1,.6,1]},duration:1,repeat:-1},c2+.4);pop(P5.tag,c2+.2);sfx('pop',c2+.2,.35);
  P5.tr.forEach(c=>face(c,'lebar',c2+.2));const c3=capT(T,'b5-5',3);cam(P5,c3,240,470,1.7,2.6,'power2.inOut');}

DUR=T.end+1.4;tl.to({},{duration:.01},DUR);
