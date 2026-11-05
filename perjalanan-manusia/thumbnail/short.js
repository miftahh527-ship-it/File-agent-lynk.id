/* Thumbnail Short: SIAPA PELUKISNYA? */
const P=scene('thumb');{const p=P.g;R(-400,-400,1900,2800,'url(#caveG)',0,p);for(let i=0;i<12;i++)EL(-100+(i%3)*500,200+Math.floor(i/3)*480+rnd(i)*200,240,90,'#4A5074',p,{opacity:.45});
  PA('M 1200 1900 L 900 2000 L 300 1000 L 800 760 Z','#F4ECCF',p,{opacity:.10});CI(540,980,640,'url(#fireGlow)',p,{opacity:.65});
  const hp=G({transform:'translate(540,1000) rotate(-8)'},p);CI(0,0,400,'url(#spray)',hp);handShape(hp,'#33374F',2.6);
  for(let i=0;i<24;i++){const a=i*2.4,r=320+rnd(i)*120;CI(Math.cos(a)*r,Math.sin(a)*r,9+rnd(i+5)*11,C.coral,hp,{opacity:.9});}
  const tx=(y,s,txt,f,a={})=>{const t=N('text',{x:540,y,'font-size':s,'font-weight':700,fill:f,stroke:C.night,'stroke-width':s*.17,'paint-order':'stroke','stroke-linejoin':'round','text-anchor':'middle','font-family':'Fredoka, sans-serif',...a},p);t.textContent=txt;return t;};
  tx(440,190,'SIAPA',C.paper);tx(600,150,'PELUKISNYA',C.sun);tx(1060,420,'?',C.coral,{opacity:.95});
  const st=G({transform:'translate(540,1500) rotate(-5)'},p);R(-260,-62,520,124,C.night,20,st,{opacity:.85});R(-260,-62,520,124,'none',20,st,{stroke:C.sun,'stroke-width':8});
  N('text',{x:0,y:24,'font-size':70,'font-weight':700,fill:C.sun,'text-anchor':'middle','font-family':'Space Mono, monospace'},st).textContent='67.800 THN';}
P.g.style.display='block';Object.assign(P.cam,{x:540,y:960,z:1});P.apply();DUR=1;
