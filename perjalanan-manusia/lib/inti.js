let DUR=60;   /* diisi ulang oleh adegan.js tiap bagian */
const $=(s,r=document)=>r.querySelector(s);
const W=(window.STAGE||{}).w||1920,H=(window.STAGE||{}).h||1080,NS='http://www.w3.org/2000/svg',XL='http://www.w3.org/1999/xlink';
/* palet segar (bukan palet intro): tosca, biru listrik, kuning cerah, koral, lilac, lime, indigo malam */
const C={ink:'#2E3448',indigo:'#3E4366',indigo2:'#4D5378',night:'#1F2233',blue:'#5B8DB8',blue2:'#4A78A0',sky:'#A9D4DE',sky2:'#EEF5F0',
  mint:'#6BAE9A',mint2:'#4F8F7C',lime:'#A3C47A',lime2:'#86AA5E',sun:'#E8C15A',coral:'#D9735E',pink:'#E2A39C',lilac:'#B3A8C8',lilac2:'#8E84A8',
  sand:'#E8CFA0',sand2:'#D4AE74',white:'#FFFFFF',paper:'#F3F1EC',skin:'#C98A62',skinKid:'#D9A07A',wood:'#8A5A3C',bone:'#F2E8D2',red:'#C8443C'};
function fit(){const s=Math.min(innerWidth/W,innerHeight/H);$('#stage').style.transform=`translate(-50%,-50%) scale(${s})`;}addEventListener('resize',fit);fit();
const rnd=i=>{const s=Math.sin(i*127.1+311.7)*43758.5453;return s-Math.floor(s);};

/* ---------- penyusun bentuk ---------- */
const S=$('#scene');
function N(tag,a={},p=S){const n=document.createElementNS(NS,tag);for(const k in a)n.setAttribute(k,a[k]);p.appendChild(n);return n;}
const G=(a={},p=S)=>N('g',a,p),R=(x,y,w,h,f,rx=0,p=S,a={})=>N('rect',{x,y,width:w,height:h,rx,fill:f,...a},p),
  CI=(cx,cy,r,f,p=S,a={})=>N('circle',{cx,cy,r,fill:f,...a},p),EL=(cx,cy,rx,ry,f,p=S,a={})=>N('ellipse',{cx,cy,rx,ry,fill:f,...a},p),
  PA=(d,f,p=S,a={})=>N('path',{d,fill:f||'none',...a},p),
  LN=(d,st,w,p=S,a={})=>N('path',{d,fill:'none',stroke:st,'stroke-width':w,'stroke-linecap':'round','stroke-linejoin':'round',...a},p),
  TX=(x,y,t,size,f,p=S,a={})=>{const n=N('text',{'data-tata':'teks',x,y,'font-size':size,fill:f,'font-weight':600,'text-anchor':'middle',...a},G({'data-jaga':''},p));n.textContent=t;return n;},
  shadow=(x,y,rx,p=S)=>EL(x,y,rx,16,C.night,p,{opacity:.16}),
  sh=(hex,f)=>{const n=parseInt(hex.slice(1),16);const r=Math.min(255,Math.round(((n>>16)&255)*f)),g=Math.min(255,Math.round(((n>>8)&255)*f)),b=Math.min(255,Math.round((n&255)*f));return '#'+((1<<24)+(r<<16)+(g<<8)+b).toString(16).slice(1);};
function J(el,tx=0,ty=0){const j={el,tx,ty,x:0,y:0,r:0,sx:1,sy:1,apply(){el.setAttribute('transform',`translate(${j.tx+j.x},${j.ty+j.y}) rotate(${j.r}) scale(${j.sx},${j.sy})`);}};j.apply();return j;}
const defs=N('defs',{},S);
function lg(id,stops,x2=0,y2=1){const g=N('linearGradient',{id,x1:0,y1:0,x2,y2},defs);stops.forEach(([o,c,op=1])=>N('stop',{offset:o,'stop-color':c,'stop-opacity':op},g));}
function rg(id,stops){const g=N('radialGradient',{id},defs);stops.forEach(([o,c,op=1])=>N('stop',{offset:o,'stop-color':c,'stop-opacity':op},g));}
lg('caveG',[[0,'#474C6E'],[1,'#262A40']]);lg('camp',[[0,'#5A5B80'],[1,'#3A3C5C']]);lg('skyA',[[0,'#9CCBD8'],[1,'#EEF4EE']]);
lg('skyS',[[0,'#93C4D4'],[.75,'#D7E8E2'],[1,'#F1E4C2']]);lg('room',[[0,'#ECE8EE'],[1,'#F2E6E0']]);lg('curtain',[[0,'#3A3F5E'],[1,'#1F2233']]);
lg('city',[[0,'#9CCBD8'],[1,'#EFF4F0']]);lg('spot',[[0,'#F4ECCF',.55],[1,'#F4ECCF',0]]);
rg('spray',[[0,C.coral,.95],[.55,C.coral,.7],[1,C.coral,0]]);rg('fireGlow',[[0,C.sun,.55],[1,C.sun,0]]);rg('hole',[[0,'#000'],[.55,'#000'],[1,'#fff']]);
rg('glowSoft',[[0,'#FFFFFF',.9],[1,'#FFFFFF',0]]);

/* ---------- panggung ---------- */
const scenes=[];
function scene(name){const g=G({'data-name':name},S);g.style.display='none';const sc={name,g,cam:{x:W/2,y:H/2,z:1.1,ox:0,oy:0},
  apply(){const c=sc.cam;g.setAttribute('transform',`translate(${W/2-(c.x+c.ox)*c.z},${H/2-(c.y+c.oy)*c.z}) scale(${c.z})`);}};sc.apply();scenes.push(sc);return sc;}

/* ---------- KARAKTER: rig sendi (kaki di y=0) ---------- */
function character(p,x,ground,scale,o={}){
  const {who='v',shirt=C.blue,pants=C.ink,shoes='#2E2C3A',hair=C.ink,skin=C.skinKid,style='short',tunic=false,sx=1,brow=false,beard=false,blush=false}=o;
  const sd=shadow(x,ground+4,72*scale*sx,p),place=G({'data-tata':'subjek',transform:`translate(${x},${ground}) scale(${scale*sx},${scale})`},p),rootEl=G({},place),root=J(rootEl),ref={root,place,who,scale,sd};
  const legC=tunic?skin:pants,footC=tunic?sh(skin,.8):shoes;
  for(const side of ['R','L']){const lx=side==='L'?-26:26,dk=side==='R'?.86:1;
    const tEl=G({},rootEl),thigh=J(tEl,lx,-214);R(-24,-10,48,118,sh(legC,dk),21,tEl);
    const sEl=G({},tEl),shin=J(sEl,0,102);R(-21,-8,42,108,sh(legC,dk),18,sEl);
    const fEl=G({},sEl),foot=J(fEl,0,96);PA('M -24 -10 L 16 -10 C 24 4 46 4 50 16 L 50 26 L -26 26 Z',sh(footC,dk),fEl);
    ref[side+'thigh']=thigh;ref[side+'shin']=shin;ref[side+'foot']=foot;}
  const tEl=G({},rootEl),torso=J(tEl,0,-214);ref.torso=torso;
  const arm=(side,front)=>{const s=side==='L'?-1:1,aEl=G({},tEl),a=J(aEl,50*s,-126);R(-17,-16,34,98,tunic?(front?skin:sh(skin,.88)):(front?shirt:sh(shirt,.86)),16,aEl);
    const fEl=G({},aEl),f=J(fEl,0,78);R(-15,-12,30,90,front?skin:sh(skin,.9),14,fEl);const hEl=G({},fEl),h=J(hEl,0,74);EL(0,4,17,21,front?skin:sh(skin,.9),hEl);
    ref[side+'arm']=a;ref[side+'fore']=f;ref[side+'hand']=h;};
  arm('R',false);
  PA('M -48 -152 C -64 -144 -70 -112 -66 -76 L -58 8 C -28 22 32 22 60 8 L 67 -76 C 71 -112 60 -144 45 -152 Z',shirt,tEl);
  PA('M 46 -146 C 64 -130 68 -100 64 -62 L 57 8 L 36 12 L 40 -140 Z',sh(shirt,.88),tEl);
  if(tunic){PA('M -60 0 L -44 34 L -24 8 L -4 38 L 16 8 L 38 34 L 60 0 Z',shirt,tEl);LN('M -40 -150 L 46 -20',sh(shirt,.72),9,tEl);}
  else R(-58,-2,117,22,sh(shirt,.82),9,tEl);
  R(-15,-178,30,40,skin,12,tEl);
  arm('L',true);
  const hEl=G({},tEl),head=J(hEl,0,-160);ref.head=head;ref.faces={};
  if(style==='pony'){EL(84,-118,22,46,hair,hEl,{transform:'rotate(-18 84 -118)'});CI(70,-150,14,C.coral,hEl);}
  if(style==='wild')PA('M -92 -86 C -112 -150 -70 -205 -10 -196 C 40 -214 104 -176 96 -112 C 104 -86 92 -62 80 -60 L -80 -60 C -96 -62 -100 -74 -92 -86 Z',hair,hEl);
  EL(-72,-70,13,20,skin,hEl);EL(72,-70,13,20,skin,hEl);PA('M -74 -120 C -74 -180 74 -180 74 -120 L 74 -60 C 74 -6 -74 -6 -74 -60 Z',skin,hEl);
  if(style==='wild')PA('M -76 -112 C -70 -170 70 -170 76 -112 L 58 -122 L 40 -106 L 18 -126 L -4 -108 L -26 -126 L -46 -106 L -62 -120 Z',hair,hEl);
  else PA('M -76 -110 C -80 -175 80 -175 76 -110 L 62 -104 C 20 -130 -10 -120 -50 -108 Z',hair,hEl);
  if(beard)PA('M -66 -76 C -64 -6 64 -6 66 -76 C 50 -44 30 -40 0 -40 C -30 -40 -50 -44 -66 -76 Z',hair,hEl);
  if(blush){EL(-44,-62,13,8,C.pink,hEl,{opacity:.75});EL(44,-62,13,8,C.pink,hEl,{opacity:.75});}
  const eyes=G({},hEl),ej=J(eyes,0,-86);ref.eyes=ej;CI(-28,0,7.5,C.ink,eyes);CI(28,0,7.5,C.ink,eyes);CI(-25,-3,2.4,C.white,eyes);CI(31,-3,2.4,C.white,eyes);
  if(brow)LN('M -50 -102 C -20 -112 20 -112 50 -102',sh(skin,.62),12,hEl);
  else{LN('M -40 -104 C -33 -110 -22 -110 -16 -106',C.ink,4,hEl);LN('M 16 -106 C 22 -110 33 -110 40 -104',C.ink,4,hEl);}
  ref.mouth=LN('M -16 -46 C -6 -36 6 -36 16 -46',beard?C.night:C.ink,5,hEl);
  return ref;}
/* kostum siap pakai */
const NARA={who:'nara',shirt:C.coral,pants:C.indigo,hair:'#2A2350',style:'pony',blush:true};
const BIMA={who:'bima',shirt:C.blue,pants:C.ink,hair:'#1E1A3F',style:'short',blush:true};
const PURBA={who:'purba',shirt:'#C98B5E',skin:'#B97A52',hair:'#2A1E3D',style:'wild',tunic:true,beard:true};

/* ---------- mesin animasi ---------- */
const tl=gsap.timeline({paused:true}),world=$('#world');
const show=(t,at,d=.4)=>tl.fromTo(t,{opacity:0},{opacity:1,duration:d,ease:'power2.out',immediateRender:false},at),hide=(t,at,d=.35)=>tl.to(t,{opacity:0,duration:d,ease:'power2.in'},at);
const rot=(j,at,v,dur,ease='power2.inOut')=>tl.to(j,{r:v,duration:dur,ease,onUpdate:j.apply},at);
const sway=(j,at,v,dur)=>tl.to(j,{r:v,duration:dur,ease:'sine.inOut',yoyo:true,repeat:-1,onUpdate:j.apply},at);
const spin=(j,at,period)=>tl.fromTo(j,{r:0},{r:360,duration:period,ease:'none',repeat:-1,onUpdate:j.apply,immediateRender:false},at);
const prop=(j,at,vars,dur,ease='power2.inOut')=>tl.to(j,{...vars,duration:dur,ease,onUpdate:j.apply},at);
const pop=(j,at,dur=.5)=>{tl.set(j,{sx:0,sy:0,onUpdate:j.apply},0);tl.set(j.el,{opacity:0},0);tl.set(j.el,{opacity:1},at);tl.to(j,{sx:1,sy:1,duration:dur,ease:'back.out(2.2)',onUpdate:j.apply},at);};
const drift=(el,at,{y=-200,x=0,scale=null,dur=3,peak=.8}={})=>{const to={y,x,duration:dur,ease:'sine.out',repeat:-1,immediateRender:false};if(scale!=null)to.scale=scale;
  tl.fromTo(el,{y:0,x:0,scale:scale!=null?.5:1,transformOrigin:'50% 50%'},to,at);tl.to(el,{keyframes:{opacity:[0,peak,peak,0],easeEach:'none'},duration:dur,repeat:-1,ease:'none'},at);};
function flyAlong(el,d,at,dur,{scale=1,ease='power1.inOut'}={}){const p=N('path',{d},defs),L=p.getTotalLength(),o={q:0};
  const put=()=>{const pt=p.getPointAtLength(o.q*L);el.setAttribute('transform',`translate(${pt.x},${pt.y}) scale(${scale})`);};put();
  tl.fromTo(o,{q:0},{q:1,duration:dur,ease,onUpdate:put,immediateRender:false},at);}
const cam=(sc,at,x,y,z,dur=1.6,ease='sine.inOut')=>tl.to(sc.cam,{x,y,z,duration:dur,ease,onUpdate:sc.apply},at);
function cut(at,from,to){tl.set(from.g,{display:'none'},at);tl.set(to.g,{display:'block'},at);}
function slide(at,from,to,axis='x',dist=96){const o=axis==='x'?'ox':'oy';
  tl.to(from.cam,{[o]:-dist,duration:.28,ease:'power2.in',onUpdate:from.apply},at);tl.set(to.cam,{[o]:dist,onUpdate:to.apply},at+.28);cut(at+.28,from,to);
  tl.to(to.cam,{[o]:0,duration:.42,ease:'power3.out',onUpdate:to.apply},at+.28);
  const b={v:0};tl.to(b,{v:10,duration:.28,ease:'power2.in',onUpdate(){world.style.filter=`blur(${b.v}px)`}},at);
  tl.to(b,{v:0,duration:.42,ease:'power3.out',onUpdate(){world.style.filter=b.v>.05?`blur(${b.v}px)`:'none'}},at+.28);}
function idle(ch,from,to=DUR){sway(ch.torso,from,1.1,1.7);sway(ch.head,from+.3,-1.7,2.3);
  const kf=[{duration:3.1+ch.who.length*.17},{duration:.01},{duration:.13},{duration:.01}];
  tl.to(ch.eyes,{keyframes:kf.map((k,i)=>({sy:i===1||i===2?.08:1,...k})),repeat:-1,ease:'none',onUpdate:ch.eyes.apply},from);}
const MOUTH={senang:'M -16 -46 C -6 -36 6 -36 16 -46',lebar:'M -22 -50 C -12 -26 12 -26 22 -50 Z',cemas:'M -16 -38 C -6 -46 6 -46 16 -38',kaget:'M -9 -48 C -9 -30 9 -30 9 -48 Z'};
const face=(ch,e,at)=>tl.to(ch.mouth,{attr:{d:MOUTH[e]},duration:.1},at);
function walk(ch,at,dur,dx){const n=Math.max(1,Math.round(dur/.39));
  tl.to(ch.root,{x:'+='+dx,duration:dur,ease:'none',onUpdate:ch.root.apply},at);tl.to(ch.sd,{x:'+='+dx*ch.scale,duration:dur,ease:'none'},at);
  const leg=(j,a,b)=>tl.fromTo(j,{r:a},{r:b,duration:.39,ease:'sine.inOut',yoyo:true,repeat:n-1,onUpdate:j.apply,immediateRender:false},at);
  leg(ch.Lthigh,-15,15);leg(ch.Rthigh,15,-15);leg(ch.Lshin,0,18);leg(ch.Rshin,18,0);leg(ch.Larm,12,-12);
  tl.fromTo(ch.root,{y:0},{y:-5,duration:.195,ease:'sine.inOut',yoyo:true,repeat:n*2-1,onUpdate:ch.root.apply,immediateRender:false},at);
  [ch.Lthigh,ch.Rthigh,ch.Lshin,ch.Rshin,ch.Larm].forEach(j=>rot(j,at+dur,0,.3));}
function wave(ch,at,side='L'){const s=side==='L'?1:-1;rot(ch[side+'arm'],at,150*s,.35,'back.out(1.6)');tl.to(ch[side+'fore'],{r:25*s,duration:.22,yoyo:true,repeat:5,ease:'sine.inOut',onUpdate:ch[side+'fore'].apply},at+.3);
  rot(ch[side+'arm'],at+1.7,0,.4);rot(ch[side+'fore'],at+1.7,0,.4);}
function hop(ch,at){tl.to(ch.root,{y:-34,duration:.18,ease:'power2.out',yoyo:true,repeat:3,onUpdate:ch.root.apply},at);}

/* ---------- benda berulang ---------- */
function handShape(par,fill,s=1){const g=G({},par);EL(0,34*s,60*s,70*s,fill,g);
  [[-46,4,-24,.82],[-20,-16,-8,.95],[6,-22,0,1],[32,-14,10,.92],[62,30,52,.7]].forEach(([x,y,r,l])=>R(-14*s,-84*l*s,28*s,(84*l+18)*s,fill,14*s,g,{transform:`translate(${x*s},${y*s}) rotate(${r})`}));return g;}
function bird(p,x,y,s=1,col=C.ink){const g=G({},p),b=G({transform:`translate(${x},${y}) scale(${s})`},g);const wl=G({},b),wr=G({},b);
  LN('M 0 0 C -14 -14 -30 -14 -42 -4',col,6,wl);LN('M 0 0 C 14 -14 30 -14 42 -4',col,6,wr);const jl=J(wl),jr=J(wr);
  tl.to(jl,{r:22,duration:.22,yoyo:true,repeat:-1,ease:'sine.inOut',onUpdate:jl.apply},0);tl.to(jr,{r:-22,duration:.22,yoyo:true,repeat:-1,ease:'sine.inOut',onUpdate:jr.apply},0);return g;}
function cloud(p,x,y,s=1,f=C.white,op=.95){const g=G({},p),c=G({transform:`translate(${x},${y}) scale(${s})`,opacity:op},g);
  EL(0,0,120,46,f,c);CI(-50,-20,48,f,c);CI(30,-34,60,f,c);CI(84,-6,40,f,c);return g;}
function tuft(p,x,y,s,col){const g=G({},p),j=J(g,x,y);LN(`M 0 0 L ${-14*s} ${-46*s} M 0 0 L 0 ${-60*s} M 0 0 L ${16*s} ${-44*s}`,col,7*s,g);return j;}
function makeCapsule(p,x,ground){const k={};const place=G({transform:`translate(${x},${ground})`},p);k.sd=shadow(0,6,250,place);
  const bodyEl=G({},place);k.body=J(bodyEl);
  [-150,0,150].forEach(lx=>{LN(`M ${lx} -80 L ${lx*1.25} 0`,C.indigo2,18,bodyEl);EL(lx*1.25,2,34,10,C.indigo,bodyEl);});
  k.flame=G({opacity:0},bodyEl);PA('M -70 -60 C -60 20 -20 80 0 120 C 20 80 60 20 70 -60 Z',C.sun,k.flame);PA('M -36 -60 C -30 0 -10 40 0 70 C 10 40 30 0 36 -60 Z',C.white,k.flame);
  PA('M -250 -330 C -280 -230 -250 -130 -320 -60 L -220 -90 Z',C.coral,bodyEl);PA('M 250 -330 C 280 -230 250 -130 320 -60 L 220 -90 Z',C.coral,bodyEl);
  EL(0,-330,255,290,C.paper,bodyEl);PA('M -255 -330 C -255 -170 -150 -40 0 -40 C 150 -40 255 -170 255 -330 Z',sh(C.paper,.93),bodyEl);
  R(-255,-250,510,34,C.blue,0,bodyEl,{'clip-path':'none'});
  LN('M 0 -620 L 0 -700',C.indigo2,10,bodyEl);k.tip=CI(0,-708,18,C.coral,bodyEl);
  CI(0,-460,98,C.blue2,bodyEl);k.glass=CI(0,-460,80,'#CFE6EA',bodyEl);PA('M -50 -500 C -30 -530 10 -535 30 -520',null,bodyEl,{stroke:C.white,'stroke-width':12,'stroke-linecap':'round',opacity:.8});
  k.faces=G({opacity:0},bodyEl);[[-30,'#2A2350',C.skinKid],[32,'#1E1A3F',C.skinKid]].forEach(([fx,hc,sc])=>{CI(fx,-440,32,sc,k.faces);PA(`M ${fx-33} -446 C ${fx-34} -486 ${fx+34} -486 ${fx+33} -446 Z`,hc,k.faces);CI(fx-11,-436,4,C.ink,k.faces);CI(fx+11,-436,4,C.ink,k.faces);LN(`M ${fx-9} -420 C ${fx-3} -414 ${fx+3} -414 ${fx+9} -420`,C.ink,3,k.faces);});
  R(30,-300,140,230,C.blue2,26,bodyEl);k.door=R(30,-300,140,230,C.blue,26,bodyEl);CI(150,-190,9,C.sun,bodyEl);
  R(-262,-336,268,156,C.ink,22,bodyEl);R(-252,-326,248,136,'#1A2030',16,bodyEl);
  k.num=TX(-128,-274,'2026',42,C.mint,bodyEl,{'font-family':'Space Mono, monospace','font-weight':700,'font-variant-numeric':'tabular-nums'});
  k.sub=TX(-128,-206,'11 MENIT',32,C.sun,bodyEl,{'font-family':'Space Mono, monospace','font-weight':700,opacity:0});
  k.lights=[];for(let i=0;i<7;i++){const a=Math.PI*(.12+i*.127);k.lights.push(CI(Math.cos(a)*-232,-330+Math.sin(a)*-260+520*0,11,i%2?C.sun:C.mint,bodyEl));}
  k.lights.forEach((l,i)=>{const a=Math.PI*(1.08+i*.14);l.setAttribute('cx',Math.cos(a)*236);l.setAttribute('cy',-330+Math.sin(a)*270);});
  k.place=place;return k;}
const fmt=v=>{const n=Math.round(Math.abs(v)).toString().replace(/\B(?=(\d{3})+(?!\d))/g,'.');return (v<0?'−':'')+n;};

/* ---------- SUARA + SUBTITLE: say(idKlip, detik) menaruh VO dan teksnya sekaligus ---------- */
window.AUDIO_PLAN={vo:[],sfx:[],music:null};
const AUD=window.AUDBASE||'../../audio-semua/',CAPS=[];
function vdur(id){return VODATA[id].dur;}
function say(id,at,vol=1){AUDIO_PLAN.vo.push({at,src:AUD+id+'.mp3',vol});VODATA[id].cap.forEach(([a,b,t])=>CAPS.push({a:at+a,b:at+b,t}));return at+vdur(id);}
function sfx(name,at,vol=.4){AUDIO_PLAN.sfx.push({at,src:AUD+'sfx-'+name+'.mp3',vol});}
/* urutkan klip: tiap klip mulai setelah klip sebelumnya + jeda; kembalikan detik mulai tiap klip */
function voPlan(ids,t0=1.0,gap=.7,gaps={}){const T={};let t=t0;ids.forEach(id=>{T[id]=t;say(id,t);t+=vdur(id)+(gaps[id]!=null?gaps[id]:gap);});T.end=t-gap;return T;}
const capEl=document.getElementById('cap'),capTx=capEl&&capEl.firstElementChild;let capCur=null;
function capRender(t){if(!capEl)return;let c=null;for(const k of CAPS){if(t>=k.a&&t<k.b){c=k;break;}}
  if(c!==capCur){capCur=c;capTx.textContent=c?c.t:'';}
  const o=c?Math.min(1,(t-c.a)/.12,(c.b-t)/.12):0;capEl.style.opacity=o.toFixed(3);capEl.style.transform=`translateX(-50%) translateY(${((1-Math.min(1,(t-(c?c.a:0))/.18))*10).toFixed(1)}px)`;}
gsap.ticker.add(()=>capRender(tl.time()));

/* PENJAGA TEPI (Hukum #5 tata letak): label/teks yang mulai keluar frame memudar lebih dulu,
   jadi teks tidak pernah tampil terpotong tepi saat kamera zoom/geser. Deterministik: hanya
   bergantung pada posisi kamera di detik itu. */
function jagaTepi(){const st=document.getElementById('stage');if(!st)return;const S0=st.getBoundingClientRect(),m=10*S0.width/W,S={left:S0.left+m,top:S0.top+m,right:S0.right-m,bottom:S0.bottom-m};
  for(const e of document.querySelectorAll('[data-jaga]')){const r=e.getBoundingClientRect();if(r.width<1||r.height<1)continue;
    const vx=Math.max(0,Math.min(r.right,S.right)-Math.max(r.left,S.left)),vy=Math.max(0,Math.min(r.bottom,S.bottom)-Math.max(r.top,S.top));
    const f=vx*vy/(r.width*r.height),o=Math.max(0,Math.min(1,(f-.99)/.01));e.style.opacity=o<1?o.toFixed(3):'';}}
gsap.ticker.add(jagaTepi);
