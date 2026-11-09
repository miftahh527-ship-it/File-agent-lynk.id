/* Thumbnail Short: SIAPA PELUKISNYA? — cap tangan tetap terbaca, Nara kaget menunjuk.
   Elemen penting di atas y≈1600 dan jauh dari tepi kanan (tombol UI Shorts). */
const P=scene('thumb');{const p=P.g;R(-400,-400,1900,2800,'url(#caveG)',0,p);for(let i=0;i<12;i++)EL(-100+(i%3)*500,200+Math.floor(i/3)*480+rnd(i)*200,240,90,'#4A5074',p,{opacity:.45});
  for(let i=0;i<5;i++){const x=40+i*250;PA(`M ${x-70} -100 L ${x+70} -100 L ${x} ${110+rnd(i)*110} Z`,'#2A2E44',p);}
  /* sinar senter dari kanan bawah ke cap tangan */
  PA('M 1300 1500 L 1100 1800 L 220 1080 L 560 720 Z','#F4ECCF',p,{opacity:.10});CI(400,960,520,'url(#fireGlow)',p,{opacity:.7});
  const hp=G({transform:'translate(400,960) rotate(-10)'},p);CI(0,0,340,'url(#spray)',hp);handShape(hp,'#33374F',2.1);
  for(let i=0;i<22;i++){const a=i*2.4,r=280+rnd(i)*110;CI(Math.cos(a)*r,Math.sin(a)*r,8+rnd(i+5)*10,C.coral,hp,{opacity:.9});}
  /* Nara kaget menunjuk cap tangan */
  const k=character(p,800,2080,1.45,NARA);k.mouth.setAttribute('d','M -12 -36 C -13 -12 13 -12 12 -36 C 11 -46 -11 -46 -12 -36 Z');k.mouth.setAttribute('fill',C.night);
  k.Lbrow.y=k.Rbrow.y=-9;k.Lbrow.r=-10;k.Rbrow.r=10;k.Lbrow.apply();k.Rbrow.apply();k.eyes.sx=1.35;k.eyes.sy=1.35;k.eyes.apply();k.head.r=-8;k.head.apply();
  k.Larm.r=138;k.Larm.apply();k.Lfore.r=-4;k.Lfore.apply();k.Rarm.r=-150;k.Rarm.apply();k.Rfore.r=-30;k.Rfore.apply();
  PA('M 70 -150 C 60 -130 64 -112 78 -112 C 92 -112 94 -130 70 -150 Z',C.sky,G({},k.headAcc));
  const tx=(x,y,s,txt,f,a={})=>{const t=N('text',{x,y,'font-size':s,'font-weight':700,fill:f,stroke:C.night,'stroke-width':s*.17,'paint-order':'stroke','stroke-linejoin':'round','text-anchor':'middle','font-family':'Fredoka, sans-serif',...a},p);t.textContent=txt;return t;};
  tx(450,330,190,'SIAPA',C.paper);tx(540,500,150,'PELUKISNYA',C.sun);tx(880,360,300,'?',C.coral,{transform:'rotate(12 880 260)'});
  /* petunjuk kecil, jawabannya disembunyikan */
  const st=G({transform:'translate(320,1600) rotate(-6)'},p);R(-250,-62,500,124,C.night,20,st,{opacity:.85});R(-250,-62,500,124,'none',20,st,{stroke:C.sun,'stroke-width':8});
  N('text',{x:0,y:24,'font-size':70,'font-weight':700,fill:C.sun,'text-anchor':'middle','font-family':'Space Mono, monospace'},st).textContent='67.800 THN';}
P.g.style.display='block';Object.assign(P.cam,{x:540,y:960,z:1});P.apply();DUR=1;
