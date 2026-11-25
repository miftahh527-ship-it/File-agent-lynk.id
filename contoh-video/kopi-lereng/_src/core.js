/* ===== INTI Motion Format (dari starter skill motion-format; dipasang ke tiap video oleh _src/build.py) =====
   Butuh: W, H, DUR, window.AUDIO_PLAN didefinisikan sebelum blok ini, GSAP sudah dimuat.
   Menyediakan: $, $$, tl, makeBlur/blurTween, VERT/HORZ, splitChars, splitWords, everyFrame(fn), finish().
   Hukum #2: semua visual adalah fungsi dari tl.time() — tidak ada Date.now()/Math.random(). */
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const Q=new URLSearchParams(location.search);
const stageEl=$('#stage');
const fit=()=>{const s=Math.min(innerWidth/W,innerHeight/H);stageEl.style.transform=`translate(-50%,-50%) scale(${s})`;};
addEventListener('resize',fit);fit();

/* motion blur berarah: feGaussianBlur dengan stdDeviation x/y terpisah */
const defs=$('#filters defs');let fc=0;
function makeBlur(){const id='mb'+(fc++),NS='http://www.w3.org/2000/svg';const f=document.createElementNS(NS,'filter');f.id=id;
  f.setAttribute('x','-70%');f.setAttribute('y','-70%');f.setAttribute('width','240%');f.setAttribute('height','240%');
  const g=document.createElementNS(NS,'feGaussianBlur');g.setAttribute('stdDeviation','0 0');f.appendChild(g);defs.appendChild(f);
  return {url:`url(#${id})`,node:g};}
function blurTween(tl,targets,at,from,to,dur,{ease='power3.out',ax=1,ay=.08}={}){const b=makeBlur(),o={v:from};
  tl.set(targets,{filter:b.url},at);
  tl.to(o,{v:to,duration:dur,ease,onUpdate(){b.node.setAttribute('stdDeviation',`${(o.v*ax).toFixed(2)} ${(o.v*ay).toFixed(2)}`);}},at);
  tl.set(targets,{filter:'none'},at+dur);}
const VERT={ax:.1,ay:1},HORZ={ax:1,ay:.1};

/* pecah teks per huruf (.ch) dan per kata (.wd) */
function splitChars(el){const words=(el.textContent||'').trim().split(/\s+/);el.textContent='';const out=[];
  words.forEach((w,i)=>{const wr=document.createElement('span');wr.className='wd';
    for(const c of w){const s=document.createElement('span');s.className='ch';s.textContent=c;wr.appendChild(s);out.push(s);}
    el.appendChild(wr);if(i<words.length-1)el.appendChild(document.createTextNode(' '));});
  return out;}
function splitWords(el){const words=(el.textContent||'').trim().split(/\s+/);el.textContent='';
  return words.map((w,i)=>{const s=document.createElement('span');s.className='wd';s.textContent=w;el.appendChild(s);
    if(i<words.length-1)el.appendChild(document.createTextNode(' '));return s;});}

const tl=gsap.timeline({paused:true});
/* gerak per frame yang deterministik (ayunan, partikel, putaran): fungsi murni dari t */
const FRAME=[];const everyFrame=fn=>FRAME.push(fn);const runFrame=t=>{for(const f of FRAME)f(t);};
gsap.ticker.add(()=>runFrame(tl.time()));
/* angka seed tetap (pengganti Math.random) */
const seeded=i=>{const x=Math.sin(i*127.1+311.7)*43758.5453;return x-Math.floor(x);};

function finish(){
  tl.set({},{},DUR);
  const start=()=>tl.play(0);
  tl.eventCallback('onComplete',start);                                   // default: loop
  const seek=t=>{tl.pause();tl.time(t,false);if(gsap.ticker.tick)gsap.ticker.tick();runFrame(t);};
  window.OPENER={W,H,DURATION:DUR,tl,seek,ready:false,seekFrame:t=>{seek(t);return Promise.resolve();}};
  addEventListener('keydown',e=>{if(/^[rR]$/.test(e.key))start();if(e.code==='Space'){e.preventDefault();tl.paused()?tl.play():tl.pause();}});
  if(Q.has('debug')){const d=document.createElement('div');d.id='dbg';
    d.innerHTML='<button id="dPlay">Pause</button><input id="dScrub" type="range" min="0" max="1000" value="0"><span id="dClock">0.00s</span>';
    document.body.appendChild(d);const sc=$('#dScrub'),ck=$('#dClock');let drag=false;
    gsap.ticker.add(()=>{if(!drag)sc.value=String(tl.time()/DUR*1000);ck.textContent=tl.time().toFixed(2)+'s';$('#dPlay').textContent=tl.paused()?'Play':'Pause';});
    sc.addEventListener('pointerdown',()=>{drag=true;tl.pause();});addEventListener('pointerup',()=>drag=false);
    sc.addEventListener('input',()=>{tl.pause();tl.time(sc.value/1000*DUR);runFrame(tl.time());});$('#dPlay').onclick=()=>tl.paused()?tl.play():tl.pause();}
  /* SUARA Motion Format — VO + efek suara terikat timeline (ikut scrub, pause, loop; dibaca render_mp4.py) */
  const P=window.AUDIO_PLAN||{vo:[],sfx:[],music:null};let on=false,last=0;const noop=()=>{};
  const mk=(s,music)=>{const a=new Audio(s.src);a.preload='auto';a.volume=s.vol==null?(music?.15:1):s.vol;return {at:s.at||0,el:a,music:!!music};};
  const LONG=(P.vo||[]).map(s=>mk(s)).concat(P.music?[mk(P.music,true)]:[]),SFX=(P.sfx||[]).map(s=>mk(s)),ALL=LONG.concat(SFX);
  const unlock=()=>{on=true;};addEventListener('pointerdown',unlock,{once:true});addEventListener('keydown',unlock,{once:true});
  gsap.ticker.add(()=>{const t=tl.time(),playing=!tl.paused();if(!on){last=t;return;}
    for(const c of LONG){const d=c.el.duration,rel=t-c.at,inside=rel>=0&&(c.music||!d||!isFinite(d)||rel<d);
      if(playing&&inside){const want=c.music&&d&&isFinite(d)?rel%d:rel;if(Math.abs(c.el.currentTime-want)>.25)c.el.currentTime=want;if(c.el.paused)c.el.play().catch(noop);}
      else if(!c.el.paused)c.el.pause();}
    if(playing){if(t<last)last=-.001;if(t-last<.5)for(const s of SFX)if(s.at>last&&s.at<=t){s.el.currentTime=0;s.el.play().catch(noop);}}
    last=t;});
  const probe=()=>{const a=ALL[0].el,v=a.volume;a.volume=0;return a.play().then(()=>{a.pause();a.currentTime=0;a.volume=v;on=true;},e=>{a.volume=v;throw e;});};
  document.fonts.ready.then(()=>{seek(0);window.OPENER.ready=true;if(Q.has('clean'))return;
    if(!ALL.length){start();return;}
    probe().then(start).catch(()=>{tl.pause(0);const go=()=>{removeEventListener('pointerdown',go);removeEventListener('keydown',go);start();};
      addEventListener('pointerdown',go);addEventListener('keydown',go);});});
}
