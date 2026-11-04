/* BAB 3 — Revolusi Pertanian */
const T=voPlan(['b3-1','b3-2','b3-3'],3.6,.8);
const B0=bumper('−12.000','BAB 3');
function animal(p,x,gy,s=1,col=C.paper,head=C.ink,horn=false){const g=G({},p),b=G({transform:`translate(${x},${gy}) scale(${s})`},g);const bd=J(G({},b));const e=bd.el;
  const legs=[-50,-22,26,54].map((lx,i)=>{const lg=G({},e),j=J(lg,lx,-70);R(-7,0,14,70,sh(head,1.2),6,lg);return j;});
  EL(0,-100,80,46,col,e);CI(-50,-120,22,col,e);CI(-10,-130,26,col,e);CI(30,-124,24,col,e);EL(86,-124,26,30,head,e);CI(94,-130,4,C.paper,e);if(horn)LN('M 80 -150 C 70 -180 50 -180 56 -160',C.wood,6,e);
  return {g,bd,legs};}
function trot(a,at,dur,dx){tl.to(a.g,{x:'+='+dx,duration:dur,ease:'none'},at);a.legs.forEach((j,i)=>tl.fromTo(j,{r:i%2?-18:18},{r:i%2?18:-18,duration:.25,yoyo:true,repeat:Math.round(dur/.25)-1,ease:'sine.inOut',onUpdate:j.apply,immediateRender:false},at));
  tl.to(a.bd,{y:-6,duration:.125,yoyo:true,repeat:Math.round(dur/.125)-1,ease:'sine.inOut',onUpdate:a.bd.apply},at);}
function wheat(p,x,gy,s=1,col=C.sun){const g=G({},p),j=J(g,x,gy);LN(`M 0 0 L 0 ${-150*s}`,C.lime2,6*s,g);for(let k=0;k<5;k++){EL(-9*s,(-150+k*18)*s,8*s,14*s,col,g,{transform:`rotate(-25 ${-9*s} ${(-150+k*18)*s})`});EL(9*s,(-142+k*18)*s,8*s,14*s,col,g,{transform:`rotate(25 ${9*s} ${(-142+k*18)*s})`});}return j;}

/* ---------- P1 ZAMAN ES BERAKHIR ---------- */
const P1=scene('es');{const p=P1.g,gy=900;R(-900,-900,3800,2900,'url(#ice)',0,p);const sun=G({},p);P1.rays=J(sun,1500,260);for(let i=0;i<12;i++)R(-10,-200,20,70,C.sun,10,sun,{transform:`rotate(${i*30})`,opacity:.7});P1.sun=J(G({},p),1500,260);CI(0,0,110,C.sun,P1.sun.el);
  bgHills(p,800,C.mint,.7);bgGround(p,gy,C.lime2,'#9DBB7A');P1.snowHills=bgHills(p,810,C.paper,1);P1.snow=R(-900,gy-14,3800,900,C.paper,0,p);
  P1.tree=[roundTree(p,500,gy,1.0,C.paper,'#E4EEF2'),roundTree(p,1300,gy,.8,C.paper,'#E4EEF2')];
  P1.flakes=[];for(let i=0;i<30;i++)P1.flakes.push(CI(-200+rnd(i+11)*2300,-100,5+rnd(i)*4,C.paper,p,{opacity:0}));
  P1.drops=[];for(let i=0;i<8;i++)P1.drops.push(CI(300+i*200,gy-20,8,C.sky,p,{opacity:0}));}
slide(3.0,B0,P1,'x',96);Object.assign(P1.cam,{x:960,y:560,z:1.15});P1.apply();
{const t=T['b3-1'];spin(P1.rays,3,30);P1.flakes.forEach((f,i)=>tl.fromTo(f,{y:0,x:0},{y:1200,x:80,duration:4+rnd(i)*2,repeat:1,ease:'none',immediateRender:false},3+rnd(i+2)*2));
  P1.flakes.forEach(f=>tl.to(f,{opacity:.9,duration:.3},3));P1.flakes.forEach(f=>tl.to(f,{opacity:0,duration:.6},t+2.2));
  tl.to(P1.sun,{sx:1.6,sy:1.6,duration:3,ease:'sine.inOut',onUpdate:P1.sun.apply},t+.6);tl.to(P1.snow,{opacity:0,y:60,duration:2.6,ease:'power1.in'},t+1.6);tl.to(P1.snowHills,{opacity:0,duration:2.4},t+1.8);
  P1.tree.forEach(j=>{const cs=j.el.querySelectorAll('circle');tl.to(cs,{fill:(i)=>i===0?C.mint2:C.mint,duration:1.6},t+2.6);sway(j,t,1.5,2);});
  P1.drops.forEach((d,i)=>tl.fromTo(d,{opacity:0,y:0},{keyframes:{opacity:[0,1,0]},y:60,duration:.8,repeat:2,ease:'power1.in',immediateRender:false},t+1.8+i*.15));cam(P1,t+.5,1100,520,1.35,3.5,'sine.inOut');}

/* ---------- P1b BULAN SABIT SUBUR (peta) ---------- */
const P1b=scene('sabit');{const p=P1b.g;R(-900,-900,3800,2900,'url(#skyD)',0,p);P1b.m=mapBox(p,160,110,1600,860,[20,62,18,46],['af','as','eu']);const m=P1b.m;
  const cr=[[34,31],[35.5,34],[37,36.5],[40,37.2],[43,36.6],[45,34],[47,31],[48,29.5]].map(([a,b])=>m.pt(a,b));P1b.cres=route(p,'M '+cr.map(q=>q.join(' ')).join(' L '),C.lime2,70);P1b.cres.setAttribute('opacity',.85);
  P1b.tag=tag(p,...m.pt(41,28),'Bulan Sabit Subur','Timur Tengah');P1b.wh=[[38,36],[44,34],[36,33]].map(([a,b])=>{const[x,y]=m.pt(a,b);return wheat(p,x,y+30,.5);});}
{const t=capT(T,'b3-1',1)-.3;cut(t,P1,P1b);Object.assign(P1b.cam,{x:960,y:540,z:1.12});P1b.apply();drawOn(P1b.cres,t+.4,1.6);pop(P1b.tag,t+1.8);sfx('pop',t+1.8,.3);
  P1b.wh.forEach((j,i)=>{tl.set(j,{sy:0,onUpdate:j.apply},0);tl.to(j,{sy:1,duration:.6,ease:'back.out(2)',onUpdate:j.apply},t+2.3+i*.2);});cam(P1b,t+.2,1100,500,1.35,3,'sine.inOut');}

/* ---------- P1c LADANG: menanam & menjinakkan ---------- */
const P1c=scene('ladang');{const p=P1c.g,gy=900;bgSky(p);P1c.clouds=[cloud(p,400,200,.8),cloud(p,1500,150,.6)];bgHills(p,800,C.mint,.6);bgGround(p,gy,C.lime2,'#C9A47A');
  for(let r=0;r<3;r++)R(-200,gy+40+r*60,2400,16,'#A9845E',8,p);P1c.wh=[];for(let i=0;i<16;i++)P1c.wh.push(wheat(p,300+i*80,gy+30+(i%3)*50,1.0,i%2?C.sun:'#E8D08A'));
  P1c.farmer=character(p,560,gy,.95,{...PURBA,who:'petani'});const hoe=G({},P1c.farmer.Rhand.el);LN('M 0 -40 L 0 200',C.wood,10,hoe);R(-40,190,60,20,'#8E8E94',4,hoe);
  P1c.wife=character(p,1500,gy,.85,{...PURBA,who:'penggembala',shirt:'#D9A46E',beard:false,blush:true});
  P1c.goat=animal(p,2100,gy,.9,'#C9B9A0','#6E5A48',true);P1c.sheep=animal(p,2300,gy,.95,C.paper,C.ink);P1c.sheep2=animal(p,2480,gy,.8,C.paper,C.ink);
  P1c.tag=tag(p,1000,250,'Revolusi Pertanian','',{s1:50,c1:C.coral});P1c.tufts=[];for(let i=0;i<6;i++)P1c.tufts.push(tuft(p,-100+i*450,gy+20,1,C.lime2));}
{const t=capT(T,'b3-1',2)-.3;slide(t,P1b,P1c,'x',96);Object.assign(P1c.cam,{x:900,y:600,z:1.25});P1c.apply();idle(P1c.farmer,t);idle(P1c.wife,t);
  P1c.wh.forEach((j,i)=>{tl.set(j,{sy:0,onUpdate:j.apply},0);tl.to(j,{sy:1,duration:.8,ease:'back.out(1.6)',onUpdate:j.apply},t+.4+i*.08);sway(j,t+1.6+i*.05,5,1.2+rnd(i)*.5);});
  tl.to(P1c.farmer.Rarm,{r:-50,duration:.35,yoyo:true,repeat:7,ease:'sine.inOut',onUpdate:P1c.farmer.Rarm.apply},t+.2);
  const c3=capT(T,'b3-1',3);cam(P1c,c3-.3,1550,620,1.25,1.2,'power2.inOut');[P1c.goat,P1c.sheep,P1c.sheep2].forEach((a,i)=>trot(a,c3-.4+i*.2,2.6,-560));wave(P1c.wife,c3+2.2,'R');
  const c4=capT(T,'b3-1',4);cam(P1c,c4-.4,1200,520,1.15,.9,'power2.inOut');pop(P1c.tag,c4);sfx('pop',c4,.4);hop(P1c.farmer,c4+.2);face(P1c.farmer,'lebar',c4);
  P1c.clouds.forEach(c=>tl.fromTo(c,{x:0},{x:140,duration:12,ease:'none',immediateRender:false},t));P1c.tufts.forEach((j,i)=>sway(j,t,8,1+rnd(i)*.4));}

/* ---------- P2 TIGA TEMPAT LAIN ---------- */
const P2=scene('tiga');{const p=P2.g;R(-900,-900,3800,2900,'url(#skyD)',0,p);P2.m=worldMap(p,110,130,1700,820);const m=P2.m;
  const ic=(x,y,kind)=>{const g=G({},p),j=J(g,x,y);CI(0,0,62,C.white,g);if(kind==='padi'){for(let k=-2;k<=2;k++)LN(`M ${k*12} 30 C ${k*12} 0 ${k*16+6} -20 ${k*20+10} -34`,C.lime2,6,g);for(let k=0;k<4;k++)EL(18+k*-6,-30+k*10,6,10,C.sun,g);}
    if(kind==='jagung'){EL(0,0,18,40,C.sun,g);for(let k=0;k<4;k++)LN(`M -14 ${-24+k*14} L 14 ${-24+k*14}`,sh(C.sun,.8),3,g);PA('M -10 40 C -40 10 -30 -20 -20 -40 C -18 0 -6 20 0 40 Z',C.lime2,g);PA('M 10 40 C 40 10 30 -20 20 -40 C 18 0 6 20 0 40 Z',C.lime,g);}
    if(kind==='kebun'){R(-6,-10,12,50,C.wood,4,g);CI(0,-24,34,C.mint2,g);CI(-26,10,18,C.lime2,g);CI(26,12,18,C.lime2,g);}return j;};
  P2.items=[[110,32,'padi','Tiongkok'],[-95,18,'jagung','Amerika Tengah'],[145,-6,'kebun','Papua Nugini']].map(([lo,la,k,n])=>{const[x,y]=m.pt(lo,la);const pp=pin(p,x,y);return {pp,ic:ic(x,y-160,k),tg:tag(p,x,y+56,n,'',{s1:34})};});}
{const t=T['b3-2']-.4;cut(t,P1c,P2);Object.assign(P2.cam,{x:960,y:540,z:1.12});P2.apply();
  [t+2.4,capT(T,'b3-2',1)+.3,capT(T,'b3-2',1)+2.4].forEach((a,i)=>{const it=P2.items[i];pop(it.pp,a,.4);pop(it.ic,a+.15);pop(it.tg,a+.3);sfx('pop',a,.3);tl.to(it.ic,{y:-12,duration:.6,yoyo:true,repeat:-1,ease:'sine.inOut',onUpdate:it.ic.apply},a+.7);});
  cam(P2,t+.5,1060,520,1.18,6,'sine.inOut');}

/* ---------- P3 DESA + 5 JUTA vs JAKARTA ---------- */
const P3=scene('desa');{const p=P3.g,gy=800;bgSky(p);P3.clouds=[cloud(p,300,180,.8),cloud(p,1600,140,.6)];bgHills(p,800,C.mint,.6);bgGround(p,gy,C.lime2,'#C9A47A');
  P3.huts=[[300,.8],[620,.9],[1340,.85],[1640,.8],[960,1.0],[1960,.75],[-40,.75]].map(([x,s],i)=>{const g=G({},p),j=J(g,x,gy);hut(g,0,0,s,i%2?'#C9A47A':'#D4B48A',i%2?'#8A6A4A':'#7A5A44');return j;});
  const lb=G({},p);P3.barn=J(lb,1180,gy);R(-60,-200,120,200,'#B08458',10,lb);PA('M -80 -190 L 0 -270 L 80 -190 Z','#7A5A44',lb);
  P3.sacks=[0,1,2].map(i=>{const g=G({},p),j=J(g,1260+i*60,gy);sack(g,0,0,.8);return j;});
  P3.ppl=[];for(let i=0;i<7;i++){const ch=character(p,180+i*260,gy+40,.5,{...PURBA,who:'warga'+i,beard:i%2===0,shirt:['#D9A46E','#C98B5E','#E0B07A'][i%3]});P3.ppl.push(ch);}
  P3.board=tag(p,960,230,'Penduduk dunia','±5 juta orang',{s1:46,s2:44,c2:C.coral,w:560});
  const jk=G({opacity:0},p);P3.jkt=jk;[[1400,330],[1480,420],[1560,280],[1640,380],[1720,460],[1800,300],[1880,360]].forEach(([x,h],i)=>{R(x,gy-h-20,70,h,i%2?'#8E84A8':'#6E6A8C',4,jk);for(let k=0;k<4;k++)R(x+16,gy-h+10+k*60,14,20,C.sun,2,jk,{opacity:.7});});
  P3.jtag=tag(p,1640,330,'Jakarta hari ini','',{s1:38});
  P3.nara=character(p,820,gy+40,.75,NARA);}
{const t=T['b3-3']-.4;slide(t,P2,P3,'x',96);Object.assign(P3.cam,{x:960,y:520,z:1.25});P3.apply();
  P3.huts.forEach((j,i)=>{tl.set(j,{sy:0,onUpdate:j.apply},0);tl.to(j,{sy:1,duration:.45,ease:'back.out(2)',onUpdate:j.apply},capT(T,'b3-3',1)-.2+i*.25);});
  pop(P3.barn,capT(T,'b3-3',2));P3.sacks.forEach((j,i)=>pop(j,capT(T,'b3-3',2)+.5+i*.25,.35));
  P3.ppl.forEach((ch,i)=>{tl.set(ch.place,{opacity:0},0);tl.set(ch.sd,{opacity:0},0);tl.to([ch.place,ch.sd],{opacity:1,duration:.3},capT(T,'b3-3',2)+1.2+i*.3);idle(ch,t+i*.1);});
  idle(P3.nara,t);cam(P3,capT(T,'b3-3',1)-.4,960,500,1.12,1.4,'power2.inOut');
  const c3=capT(T,'b3-3',3);pop(P3.board,c3);sfx('pop',c3,.35);cam(P3,c3-.2,960,440,1.3,1.0,'power2.inOut');
  const c4=capT(T,'b3-3',4);tl.to(P3.jkt,{opacity:1,y:-20,duration:.6,ease:'power2.out'},c4-.2);pop(P3.jtag,c4+.3);face(P3.nara,'kaget',c4+.2);rot(P3.nara.Rarm,c4+.3,-80,.4);
  cam(P3,c4-.3,1300,460,1.15,1.0,'power2.inOut');P3.clouds.forEach(c=>tl.fromTo(c,{x:0},{x:140,duration:20,ease:'none',immediateRender:false},t));}

DUR=T.end+1.4;tl.to({},{duration:.01},DUR);
