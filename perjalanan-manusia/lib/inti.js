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

/* ---------- KARAKTER: kit resmi skill (assets/tokoh-rapi.js, TOKOH.buat) — proporsi & sendi terkunci ----------
   Pembungkus agar adegan lama tetap jalan: opsi lama (shirt/pants/hair/style/tunic/beard/brow/sx) dipetakan ke kit.
   ch.headAcc = lapisan aksesori kepala (topi, mahkota, peci, helm) dalam koordinat kepala lama (diskalakan .72). */
const KID=new Set(['nara','bima','anak','anakapi']);
function character(p,x,ground,scale,o={}){
  const {who='v',shirt=C.blue,pants=C.ink,shoes='#2E2C3A',hair=C.ink,skin=C.skinKid,style='short',tunic=false,sx=1,brow=false,beard=false}=o;
  const anak=KID.has(who),rambut={short:'pendek',pony:'panjang',wild:'keriting'}[style]||'pendek';
  const ref=TOKOH.buat(p,x,ground,anak?scale/.72:scale,{who,kulit:skin,baju:shirt,celana:tunic?skin:pants,sepatu:tunic?sh(skin,.8):shoes,warnaRambut:hair,rambut,anak,hadap:sx<0?-1:1});
  const s=ref.scale;ref.place.setAttribute('data-tata','subjek');
  if(Math.abs(sx)!==1){ref.place.setAttribute('transform',`translate(${x},${ground}) scale(${s*sx},${s})`);ref.sd.setAttribute('rx',66*s*Math.abs(sx));}
  if(tunic){const t=ref.torso.el,hem=N('g',{},t);t.insertBefore(hem,ref.Larm.el);
    PA('M -55 -16 L -44 34 L -26 12 L -8 40 L 10 12 L 30 36 L 55 -16 Z',shirt,hem);LN('M -50 -200 L 50 -40',sh(shirt,.72),8,hem);}
  const hd=ref.head.el,old=N('g',{transform:'translate(0,-3) scale(.72)'},hd);hd.insertBefore(old,ref.mouth);
  if(beard){PA('M -66 -76 C -64 -6 64 -6 66 -76 C 50 -44 30 -40 0 -40 C -30 -40 -50 -44 -66 -76 Z',hair,old);ref.mouth.setAttribute('stroke','#F1E3C8');}
  if(brow)LN('M -50 -102 C -20 -112 20 -112 50 -102',sh(skin,.62),12,old);
  ref.headAcc=G({transform:'translate(0,-3) scale(.72)'},hd);
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
const MOUTH={senang:'M -14 -31 C -6 -22 6 -22 14 -31',netral:'M -10 -27 L 10 -27',cemas:'M -12 -24 C -4 -31 4 -31 12 -24',kaget:'M -7 -31 C -7 -18 7 -18 7 -31 Z',lebar:'M -16 -34 C -10 -12 10 -12 16 -34 Z'};
const face=(ch,e,at)=>{const isi=e==='lebar'||e==='kaget';tl.set(ch.mouth,{attr:{d:MOUTH[e],fill:isi?'#263746':'none'}},at);
  const up=e==='kaget'?-6:0,tilt=e==='cemas'?12:0;tl.to(ch.Lbrow,{y:up,r:tilt,duration:.12,onUpdate:ch.Lbrow.apply},at);tl.to(ch.Rbrow,{y:up,r:-tilt,duration:.12,onUpdate:ch.Rbrow.apply},at);};
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
