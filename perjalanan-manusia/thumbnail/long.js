/* Thumbnail long: tanda tanya besar — siapa yang melukis cap tangan ini? */
const P=scene('thumb');{const p=P.g;R(-200,-200,2400,1500,'url(#caveG)',0,p);for(let i=0;i<9;i++)EL(-100+i*260,120+rnd(i)*800,200,80,'#4A5074',p,{opacity:.45});
  for(let i=0;i<8;i++){const x=-60+i*280;PA(`M ${x-70} -200 L ${x+70} -200 L ${x} ${40+rnd(i)*120} Z`,'#2A2E44',p);}
  /* sinar senter dari kanan ke cap tangan */
  PA('M 2100 1200 L 1700 1300 L 380 700 L 760 260 Z','#F4ECCF',p,{opacity:.10});CI(620,560,520,'url(#fireGlow)',p,{opacity:.7});
  const hp=G({transform:'translate(560,700) rotate(-12)'},p);CI(0,0,330,'url(#spray)',hp);handShape(hp,'#33374F',2.2);
  for(let i=0;i<24;i++){const a=i*2.4,r=280+rnd(i)*120;CI(Math.cos(a)*r,Math.sin(a)*r,8+rnd(i+5)*10,C.coral,hp,{opacity:.9});}
  /* Nara terkejut menunjuk */
  const k=character(p,1500,1330,1.75,NARA);k.mouth.setAttribute('d','M -18 -60 C -20 -20 20 -20 18 -60 C 16 -76 -16 -76 -18 -60 Z');k.mouth.setAttribute('fill',C.night);k.eyes.sx=1.35;k.eyes.sy=1.35;k.eyes.apply();k.head.r=-8;k.head.apply();
  k.Larm.r=105;k.Larm.apply();k.Lfore.r=-8;k.Lfore.apply();k.Rarm.r=-150;k.Rarm.apply();k.Rfore.r=-30;k.Rfore.apply();
  const sw=G({},k.head.el);LN('M -52 -118 C -40 -134 -22 -134 -12 -124',C.ink,7,sw);LN('M 12 -124 C 22 -134 40 -134 52 -118',C.ink,7,sw);R(-60,-112,120,10,C.skinKid,0,sw);PA('M 70 -150 C 60 -130 64 -112 78 -112 C 92 -112 94 -130 70 -150 Z',C.sky,sw);
  /* teks pertanyaan */
  const tx=(x,y,s,txt,f,a={})=>{const t=N('text',{x,y,'font-size':s,'font-weight':700,fill:f,stroke:C.night,'stroke-width':s*.17,'paint-order':'stroke','stroke-linejoin':'round','font-family':'Fredoka, sans-serif',...a},p);t.textContent=txt;return t;};
  tx(70,205,170,'SIAPA',C.paper);tx(70,370,170,'PELUKISNYA',C.sun);
  tx(1130,330,330,'?',C.coral,{transform:'rotate(10 1200 230)'});
  /* petunjuk kecil, jawabannya disembunyikan */
  const st=G({transform:'translate(420,1000) rotate(-6)'},p);R(-250,-62,500,124,C.night,20,st,{opacity:.85});R(-250,-62,500,124,'none',20,st,{stroke:C.sun,'stroke-width':8});
  N('text',{x:0,y:24,'font-size':70,'font-weight':700,fill:C.sun,'text-anchor':'middle','font-family':'Space Mono, monospace'},st).textContent='67.800 THN';}
P.g.style.display='block';Object.assign(P.cam,{x:960,y:540,z:1});P.apply();DUR=1;
