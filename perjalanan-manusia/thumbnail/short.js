const P=scene('thumb');{const p=P.g;R(-400,-400,1900,2800,'url(#caveG)',0,p);for(let i=0;i<12;i++)EL(-100+(i%3)*500,200+Math.floor(i/3)*480+rnd(i)*200,240,90,'#4A5074',p,{opacity:.5});
  CI(540,860,620,'url(#fireGlow)',p,{opacity:.5});const hp=G({transform:'translate(540,880) rotate(-8)'},p);CI(0,0,380,'url(#spray)',hp);handShape(hp,'#3D4264',2.4);
  for(let i=0;i<22;i++){const a=i*2.4,r=300+rnd(i)*120;CI(Math.cos(a)*r,Math.sin(a)*r,8+rnd(i+5)*10,C.coral,hp,{opacity:.85});}
  const mk=(y,s,txt,f)=>{const t=N('text',{x:540,y,'font-size':s,'font-weight':700,fill:f,stroke:C.night,'stroke-width':s*.16,'paint-order':'stroke','stroke-linejoin':'round','text-anchor':'middle','font-family':'Fredoka, sans-serif'},p);t.textContent=txt;};
  mk(420,150,'TERTUA',C.sun);mk(560,140,'DI DUNIA!',C.sun);mk(1440,110,'Indonesia',C.paper);
  R(430,1490,220,44,C.red,6,p);R(430,1534,220,44,C.paper,6,p);}
P.g.style.display='block';Object.assign(P.cam,{x:540,y:960,z:1});P.apply();DUR=1;
