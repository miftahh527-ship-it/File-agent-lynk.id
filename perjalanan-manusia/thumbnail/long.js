const P=scene('thumb');{const p=P.g;R(-200,-200,2400,1500,'url(#caveG)',0,p);for(let i=0;i<9;i++)EL(-100+i*260,120+rnd(i)*700,200,80,'#4A5074',p,{opacity:.5});
  for(let i=0;i<8;i++){const x=-60+i*280;PA(`M ${x-70} -200 L ${x+70} -200 L ${x} ${60+rnd(i)*140} Z`,'#33374F',p);}
  CI(640,520,560,'url(#fireGlow)',p,{opacity:.55});const hp=G({transform:'translate(620,470) rotate(-10)'},p);CI(0,0,330,'url(#spray)',hp);handShape(hp,'#3D4264',2.2);
  for(let i=0;i<20;i++){const a=i*2.4,r=260+rnd(i)*110;CI(Math.cos(a)*r,Math.sin(a)*r,7+rnd(i+5)*9,C.coral,hp,{opacity:.85});}
  const k=character(p,1480,1240,1.55,NARA);k.root.y=0;rot(k.head,0,0,.01);k.mouth.setAttribute('d',MOUTH.kaget);k.Rarm.r=-25;k.Rarm.apply();k.Rfore.r=-100;k.Rfore.apply();
  const ph=G({},k.Rhand.el);R(-26,-36,52,90,C.ink,10,ph);R(-20,-30,40,72,C.sky,6,ph);
  const t=N('text',{x:90,y:930,'font-size':170,'font-weight':700,fill:C.sun,stroke:C.night,'stroke-width':26,'paint-order':'stroke','stroke-linejoin':'round','font-family':'Fredoka, sans-serif'},p);t.textContent='68.000 TAHUN!';
  const t2=N('text',{x:100,y:1060,'font-size':96,'font-weight':700,fill:C.paper,stroke:C.night,'stroke-width':20,'paint-order':'stroke','stroke-linejoin':'round','font-family':'Fredoka, sans-serif'},p);t2.textContent='di Indonesia';}
P.g.style.display='block';Object.assign(P.cam,{x:960,y:540,z:1});P.apply();DUR=1;
