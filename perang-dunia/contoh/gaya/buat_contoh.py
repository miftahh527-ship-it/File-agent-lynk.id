#!/usr/bin/env python3
"""Membangun tiga contoh gaya (A jurnalisme gelap, B sketsa arsip, C kartun kertas) untuk adegan
pembuka "dua peluru di Sarajevo". Satu rig & satu timeline, tiga kulit + tiga bahasa gerak.
Pakai: python3 buat_contoh.py   → gaya-a/ gaya-b/ gaya-c/ (index.html + assets/audio/vo1.mp3)"""
import pathlib, re, shutil

HERE = pathlib.Path(__file__).resolve().parent
SKILL = HERE.parents[2] / '.claude/skills/motion-format'
svg = (HERE / 'eropa.svg').read_text()
MAP = re.search(r'<g class="peta-isi">(.*)</g>\s*</svg>', svg, re.S).group(1).rsplit('</g>', 1)[0]
starter = (SKILL / 'assets/starter-explainer-jurnalisme.html').read_text()
TAIL = starter[starter.index('/* ---------- kontrol:'):starter.index('</script>\n</body>')]
VO = HERE.parent / 'suara/L3-adi.mp3'
SX, SY = 915, 912          # Sarajevo (18,4° BT · 43,9° LU) pada eropa.svg, mercator

GRAIN = ("url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='260' height='260'%3E%3Cfilter id='n'%3E"
         "%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E"
         "%3Crect width='260' height='260' filter='url(%23n)'/%3E%3C/svg%3E\")")

BASE = """
html,body{margin:0;height:100%;background:#0a0a0a;overflow:hidden}
#stage{position:absolute;left:50%;top:50%;width:1920px;height:1080px;overflow:hidden;background:var(--sea);color:var(--ink)}
#world{position:absolute;inset:0;transform-origin:0 0;will-change:transform}
#world svg{position:absolute;left:0;top:0;width:1920px;height:1080px;overflow:visible}
#filters{position:fixed;width:0;height:0;opacity:0;pointer-events:none}
.ov{position:absolute;opacity:0;will-change:transform,opacity}
.w{display:inline-block;white-space:nowrap;margin:0 .12em;opacity:0}
.grain{position:absolute;inset:0;pointer-events:none;background-image:GRAIN}
#date{left:96px;top:84px}
#lbl{left:772px;top:446px;white-space:nowrap}
#bul{left:1380px;top:250px;width:360px;height:420px}
#bul svg{position:absolute;width:150px;height:420px;overflow:visible}
#cap{left:96px;top:760px;height:224px;width:1040px;box-sizing:border-box}
#date #dB,#date #tB{display:none}\n#date b{line-height:1 !important;margin-top:34px !important}
.line{position:absolute;left:0;top:0;white-space:nowrap;opacity:0}
#num{font-variant-numeric:tabular-nums;display:inline-block;min-width:1.2em;text-align:right}
#yr{font-variant-numeric:tabular-nums;display:inline-block;min-width:2.3em}
#dbg{position:fixed;left:50%;bottom:20px;transform:translateX(-50%);display:none;gap:12px;align-items:center;padding:10px 16px;border-radius:14px;background:rgba(14,16,22,.9);color:#cfd5e3;font:13px system-ui;z-index:50}
#dbg input{width:360px}#dbg span{font-variant-numeric:tabular-nums;min-width:6ch}
""".replace('GRAIN', GRAIN)

STYLES = {
 'a': dict(
  judul='Contoh gaya A — Jurnalisme visual gelap',
  font='family=Barlow+Condensed:wght@600;700;800&family=IBM+Plex+Mono:wght@400;500',
  css="""
:root{--sea:#0B0B0C;--land:#2A2A30;--line:#8F897C;--ctx:#141416;--ink:#F5F2EA;--acc:#FFD400;--red:#E8402F}
#stage{font-family:"Barlow Condensed",sans-serif}
.land{fill:var(--land);stroke:var(--line);stroke-width:1.1;vector-effect:non-scaling-stroke}
.konteks{fill:var(--ctx)} .gridl{stroke:rgba(245,242,234,.07);stroke-width:1;vector-effect:non-scaling-stroke;fill:none}
.grain{opacity:.16;mix-blend-mode:overlay}
.scrim{position:absolute;inset:0;pointer-events:none;background:linear-gradient(180deg,rgba(11,11,12,.72) 0,transparent 26%,transparent 58%,rgba(11,11,12,.94) 86%),radial-gradient(80% 70% at 50% 50%,transparent 55%,rgba(0,0,0,.55))}
.sweep{position:absolute;top:-20%;bottom:-20%;left:0;width:520px;background:linear-gradient(90deg,transparent,rgba(255,212,0,.07),transparent);transform:skewX(-14deg)}
#date{font-family:"IBM Plex Mono",monospace;font-size:34px;letter-spacing:.14em;padding:14px 22px;background:rgba(11,11,12,.78);border-left:6px solid var(--acc)}
#date b{display:block;font:800 124px/.9 "Barlow Condensed";letter-spacing:-.01em;margin-top:8px}
#lbl{font-family:"IBM Plex Mono",monospace;font-size:36px;letter-spacing:.16em;padding:10px 16px;background:rgba(11,11,12,.8);border-left:5px solid var(--red)}
.bl{fill:none;stroke:var(--acc);stroke-width:5;stroke-linejoin:round}
.line{font-weight:700;font-size:150px;line-height:1;letter-spacing:-.01em}
.hl{position:relative;display:inline-block;color:#111;padding:0 .12em}
.hl i{position:absolute;left:0;right:0;top:.08em;bottom:.02em;background:var(--acc);transform:scaleX(0);transform-origin:0 50%;z-index:-1}
.hl.r{color:var(--ink)} .hl.r i{background:var(--red)}
.dot{fill:var(--red)} .ring{fill:none;stroke:var(--red);stroke-width:2.5;vector-effect:non-scaling-stroke}
.spread{fill:var(--red);opacity:.5}
""",
  extra_world='<g id="deco">' + ''.join(f'<line class="gridl" x1="-400" x2="2400" y1="{y}" y2="{y}"/>' for y in range(100, 1100, 100))
              + ''.join(f'<line class="gridl" y1="-200" y2="1300" x1="{x}" x2="{x}"/>' for x in range(0, 2000, 100)) + '</g>',
  extra_stage='<div class="scrim"></div><div class="sweep" id="sweep"></div>',
  date='<span id="tA">SARAJEVO, BOSNIA</span><span id="tB">EMPAT TAHUN KEMUDIAN</span><b id="dA">28 Juni 1914</b><b id="dB"><span id="yr">1914</span></b>', lbl='SARAJEVO',
  l1='<span class="hl"><i></i>Dua peluru</span>', l2='<span id="num">0</span> juta+ <span class="hl r"><i></i>tewas</span>',
  js="const EASE='power4.out',POP='power4.out',MODE='a';"),
 'b': dict(
  judul='Contoh gaya B — Sketsa arsip',
  font='family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Cinzel:wght@600;700',
  css="""
:root{--sea:#E7DABD;--land:#D6C39A;--line:#4A3524;--ctx:#DECFAC;--ink:#2B1D12;--acc:#B08A2E;--red:#9C3B1B}
#stage{font-family:"Playfair Display",serif;background:radial-gradient(120% 90% at 30% 20%,#EFE4CA,#DCCBA6 70%,#C9B58B)}
.land{fill:var(--land);stroke:var(--line);stroke-width:1.5;vector-effect:non-scaling-stroke;stroke-linejoin:round}
.hatch{fill:url(#hatch);pointer-events:none} .konteks{fill:var(--ctx);stroke:#8a7353;stroke-width:.8;vector-effect:non-scaling-stroke}
.grain{opacity:.5;mix-blend-mode:multiply}
.scrim{position:absolute;inset:0;pointer-events:none;background:radial-gradient(85% 75% at 50% 50%,transparent 50%,rgba(74,53,36,.42))}
#date{font:600 34px/1 "Cinzel",serif;letter-spacing:.2em;color:var(--red);padding:22px 30px 20px;border:3px double var(--red);background:rgba(239,228,202,.9)}
#date b{display:block;font:900 112px/.95 "Playfair Display";letter-spacing:0;color:var(--ink);margin-top:10px}
#lbl{font:700 38px/1 "Cinzel",serif;letter-spacing:.22em;color:var(--ink);padding:12px 20px;background:rgba(239,228,202,.92);border-bottom:3px solid var(--red)}
.bl{fill:#3a2819;stroke:#2B1D12;stroke-width:3;stroke-linejoin:round} .bl.tip{fill:var(--acc)}
#cap{padding:0 44px;background:rgba(239,228,202,.93);border-top:3px solid var(--ink);border-bottom:3px solid var(--ink)}
.line{position:absolute;left:44px;top:34px;font-weight:900;font-style:normal;font-size:132px;line-height:1.15}
.hl{position:relative;display:inline-block;font-style:italic;font-weight:700;color:var(--red)}
.hl i{position:absolute;left:0;right:0;bottom:.04em;height:.07em;background:var(--red);transform:scaleX(0);transform-origin:0 50%}
.dot{fill:var(--red)} .ring{fill:none;stroke:var(--red);stroke-width:2;vector-effect:non-scaling-stroke}
.spread{fill:var(--red);opacity:.42} .rose{fill:none;stroke:var(--line);stroke-width:1.2;vector-effect:non-scaling-stroke;opacity:.55}
""",
  extra_world='<g id="deco" transform="translate(640,985)"><g id="rose"><circle class="rose" r="34"/><circle class="rose" r="24"/>'
              '<path class="rose" d="M0 -46L7 -7L46 0L7 7L0 46L-7 7L-46 0L-7 -7Z"/></g></g>',
  extra_stage='<div class="scrim"></div>',
  date='<span id="tA">SARAJEVO · BOSNIA</span><span id="tB">EMPAT TAHUN KEMUDIAN</span><b id="dA">28 Juni 1914</b><b id="dB"><span id="yr">1914</span></b>', lbl='SARAJEVO',
  l1='Dua <span class="hl"><i></i>peluru</span>', l2='<span id="num">0</span> juta+ <span class="hl"><i></i>tewas</span>',
  js="const EASE='power2.out',POP='power3.out',MODE='b';"),
 'c': dict(
  judul='Contoh gaya C — Kartun kertas cerah',
  font='family=Bricolage+Grotesque:wght@600;700;800&family=Caveat:wght@700',
  css="""
:root{--sea:#BFE3E0;--land:#F8EAC6;--line:#4A3628;--ctx:#E4E3C4;--ink:#22324A;--acc:#FFC93C;--red:#EF5B3C}
#stage{font-family:"Bricolage Grotesque",sans-serif;background:linear-gradient(160deg,#CDECE8,#A9D8D6)}
.land{fill:var(--land);stroke:var(--line);stroke-width:3.5;vector-effect:non-scaling-stroke;stroke-linejoin:round}
.konteks{fill:var(--ctx);stroke:#8d8a6c;stroke-width:2;vector-effect:non-scaling-stroke}
.wave{fill:none;stroke:#fff;stroke-width:3;stroke-linecap:round;vector-effect:non-scaling-stroke;opacity:.75}
.grain{opacity:.22;mix-blend-mode:multiply}
#date{font:700 36px/1 "Bricolage Grotesque";color:var(--red);padding:22px 30px;background:#fff;border:5px solid var(--line);border-radius:26px;box-shadow:10px 10px 0 var(--line)}
#date b{display:block;font:800 108px/.95 "Bricolage Grotesque";color:var(--ink);margin-top:10px}
#lbl{font:700 64px/1 "Caveat",cursive;color:var(--red);padding:6px 22px 10px;background:#fff;border:4px solid var(--line);border-radius:18px;transform:rotate(-3deg)}
.bl{fill:#F2A541;stroke:var(--line);stroke-width:7;stroke-linejoin:round} .bl.tip{fill:var(--red)} .bl.rim{fill:#C97B2A}
#cap{padding:0 46px;background:#fff;border:5px solid var(--line);border-radius:34px;box-shadow:12px 12px 0 var(--line)}
.line{position:absolute;left:46px;top:40px;font-weight:800;font-size:124px;line-height:1.15}
.hl{position:relative;display:inline-block;padding:0 .18em;color:var(--ink)}
.hl i{position:absolute;inset:.1em 0 .04em;background:var(--acc);border-radius:.3em;transform:scaleX(0);transform-origin:0 50%;z-index:-1}
.hl.r{color:#fff} .hl.r i{background:var(--red)}
.line{isolation:isolate}
.dot{fill:var(--red);stroke:var(--line);stroke-width:2;vector-effect:non-scaling-stroke} .ring{fill:none;stroke:var(--red);stroke-width:4;vector-effect:non-scaling-stroke}
.spread{fill:var(--red);opacity:.55}
""",
  extra_world='<g id="deco">' + ''.join(
      f'<path class="wave" transform="translate({x},{y})" d="M0 0q8 -8 16 0t16 0t16 0"/>'
      for x, y in [(520, 760), (430, 930), (640, 860), (300, 640), (760, 1010), (1190, 1040), (560, 560), (350, 1020)]) + '</g>',
  extra_stage='',
  date='<span id="tA">Sarajevo, Bosnia</span><span id="tB">Empat tahun kemudian</span><b id="dA">28 Juni 1914</b><b id="dB"><span id="yr">1914</span></b>', lbl='Sarajevo',
  l1='<span class="hl"><i></i>Dua peluru</span>', l2='<span id="num">0</span> juta+ <span class="hl r"><i></i>tewas</span>',
  js="const EASE='back.out(1.6)',POP='back.out(2.2)',MODE='c';"),
}

BULLET = ('<svg viewBox="0 0 60 200" style="left:{x}px;top:0" id="{id}"><path class="bl tip" d="M30 4C48 30 54 60 54 84L6 84C6 60 12 30 30 4Z"/>'
          '<rect class="bl" x="6" y="90" width="48" height="92" rx="4"/><rect class="bl rim" x="2" y="182" width="56" height="13" rx="3"/></svg>')

HTML = """<!doctype html>
<html lang="id">
<!-- Made with the Bang Motion skill by Bang Tutorial (https://youtube.com/bangtutorial) - MIT · dimodifikasi untuk skill Motion Format -->
<head><meta charset="utf-8"><title>__JUDUL__</title>
<link href="https://fonts.googleapis.com/css2?__FONT__&display=swap" rel="stylesheet">
<style>__BASE____CSS__</style></head>
<body>
<svg id="filters"><defs></defs></svg>
<div id="stage">
  <!-- TATA LETAK: peta = latar (dunia, kamera) · blok tanggal kiri-atas y 84–290 · label kota di samping titik (y 446–500)
       · dua peluru kolom kanan x 1380–1720, y 250–670 · kalimat kiri-bawah y 760–984 (line1 keluar sebelum line2 masuk) -->
  <div id="world" data-tata="dekor">
    <svg viewBox="0 0 1920 1080" data-tata="dekor">
      <defs><pattern id="hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(38)"><line x1="0" y1="0" x2="0" y2="7" stroke="#4A3524" stroke-width="1" opacity=".28"/></pattern>
        <clipPath id="klip"><use href="#benua-eropa"/></clipPath></defs>
      __EXTRA_WORLD__
      <g id="peta">__MAP__</g>
      <use href="#benua-eropa" class="hatch" id="hatchUse"/>
      <g clip-path="url(#klip)"><circle class="spread" id="spread" cx="__SX__" cy="__SY__" r="0"/></g>
      <circle class="ring" id="ring1" cx="__SX__" cy="__SY__" r="3" opacity="0"/><circle class="ring" id="ring2" cx="__SX__" cy="__SY__" r="3" opacity="0"/>
      <circle class="dot" id="dot" cx="__SX__" cy="__SY__" r="0"/>
    </svg>
  </div>
  __EXTRA_STAGE__
  <div class="grain" data-tata="dekor"></div>
  <div class="ov" id="date">__DATE__</div>
  <div class="ov" id="lbl">__LBL__</div>
  <div class="ov" id="bul" data-tata="gambar">__B1____B2__</div>
  <div class="ov" id="cap"><div class="line" id="line1">__L1__</div><div class="line" id="line2">__L2__</div></div>
  <div id="dbg"><button id="dPlay">Pause</button><input id="dScrub" type="range" min="0" max="1000" value="0"><span id="dClock">0.00s</span></div>
</div>
<audio id="vo" src="" preload="auto"></audio>
<script src="gsap.min.js"></script>
<script>
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const W=1920,H=1080,DUR=16.6,SX=__SX__,SY=__SY__;
__JS__
function fit(){const s=Math.min(innerWidth/W,innerHeight/H);$('#stage').style.transform=`translate(-50%,-50%) scale(${s})`;}
addEventListener('resize',fit);fit();
$('#benua-eropa').classList.add('land');if(MODE!=='b')$('#hatchUse').remove();
window.AUDIO_PLAN={vo:[{at:.8,src:'assets/audio/vo1.mp3',vol:1}],sfx:[],music:null};

const tl=gsap.timeline({paused:true});const rig=$('#world');
const C={x:1010,y:790,z:2.2};
function applyCam(){rig.style.transform=`translate(${960-C.x*C.z}px,${540-C.y*C.z}px) scale(${C.z})`;}
const look=(at,x,y,z,dur,ease='sine.inOut')=>tl.to(C,{x,y,z,duration:dur,ease,onUpdate:applyCam},at);
const camEase=MODE==='a'?'expo.inOut':MODE==='b'?'sine.inOut':'power3.inOut';
/* masuk / keluar elemen layar: tiap gaya punya bahasa geraknya */
const show=(sel,at,from={})=>{const el=$(sel);
  if(MODE==='a'&&sel==='#bul')tl.fromTo(el,{opacity:0},{opacity:1,duration:.2,immediateRender:false},at);
  else if(MODE==='a')tl.fromTo(el,{opacity:0,x:-60,clipPath:'inset(0 100% 0 0)',...from},{opacity:1,x:0,clipPath:'inset(0 0% 0 0)',duration:.5,ease:EASE,immediateRender:false},at);
  else if(MODE==='b')tl.fromTo(el,{opacity:0,scale:1.25,...from},{opacity:1,scale:1,duration:.38,ease:'power4.in',immediateRender:false},at);     /* dihentak seperti stempel */
  else tl.fromTo(el,{opacity:0,scale:.4,y:60,...from},{opacity:1,scale:1,y:0,duration:.6,ease:POP,immediateRender:false},at);};
const hide=(sel,at)=>tl.to($(sel),{opacity:0,y:MODE==='c'?40:0,x:MODE==='a'?-40:0,duration:.28,ease:'power2.in'},at);
const say=(sel,at)=>{const el=$(sel);tl.set(el,{opacity:1},at);
  $$('.hl i',el).forEach((h,i)=>tl.fromTo(h,{scaleX:0},{scaleX:1,duration:.4,ease:'power3.out',immediateRender:false},at+.3+i*.25));
  tl.fromTo(el,{yPercent:MODE==='c'?50:30,opacity:0,scale:MODE==='c'?.8:1},{yPercent:0,opacity:1,scale:1,duration:.5,ease:POP,immediateRender:false},at);};
const unsay=(sel,at)=>tl.to($(sel),{opacity:0,yPercent:-30,duration:.25,ease:'power2.in'},at);

/* ---------- latar hidup ---------- */
if(MODE==='a')tl.fromTo('#sweep',{x:-700},{x:2300,duration:7,ease:'none',repeat:2},0);
if(MODE==='b')tl.to('#rose',{rotation:38,svgOrigin:'0 0',duration:DUR,ease:'none'},0);
if(MODE==='c')$$('.wave').forEach((w,i)=>tl.to(w,{x:'+=14',y:'+=5',duration:1.3+i*.11,ease:'sine.inOut',yoyo:true,repeat:14},i*.17));
/* peta lahir */
if(MODE==='b'){const p=$('#benua-eropa');p.setAttribute('pathLength','1');tl.fromTo(p,{strokeDasharray:1,strokeDashoffset:1,fillOpacity:0},{strokeDashoffset:0,duration:2.2,ease:'power1.inOut'},0);
  tl.to(p,{fillOpacity:1,duration:1},1.2);tl.fromTo('#hatchUse',{opacity:0},{opacity:1,duration:1.2},1.6);}
else tl.fromTo('#peta',{opacity:0},{opacity:1,duration:MODE==='a'?1.1:.7,ease:'power2.out'},0);

/* ---------- beat 1: 28 Juni 1914 (VO 0,8–3,9) ---------- */
tl.set(C,{x:1010,y:790,z:2.2,onUpdate:applyCam},0);
look(0,975,860,2.6,4.6,'sine.inOut');
show('#date',1.0);
/* ---------- beat 2: pemuda 19 tahun, dua peluru, Sarajevo (VO 4,45–8,85) ---------- */
look(4.5,SX+260/4.4,SY+20/4.4,4.4,1.7,camEase);
tl.to('#dot',{attr:{r:3.4},duration:.5,ease:POP},5.9);
[['#ring1',6.0],['#ring2',6.7]].forEach(([r,at])=>tl.fromTo(r,{attr:{r:3},opacity:.9},{attr:{r:30},opacity:0,duration:1.4,ease:'power1.out',repeat:3,immediateRender:false},at));
show('#lbl',6.1);
show('#bul',6.7,{});
tl.fromTo('#b1',{y:-420,rotate:-30},{y:0,rotate:-8,duration:.55,ease:MODE==='c'?'bounce.out':'power4.out',immediateRender:false},6.7);
tl.fromTo('#b2',{y:-420,rotate:30},{y:0,rotate:7,duration:.55,ease:MODE==='c'?'bounce.out':'power4.out',immediateRender:false},6.95);
look(6.2,SX+260/4.75,SY+20/4.75,4.75,4.5,'sine.inOut');
/* ---------- beat 3: "Dua peluru." (VO 9,45–9,95) ---------- */
show('#cap',9.25);say('#line1',9.35);
tl.to(['#b1','#b2'],{scale:1.12,duration:.22,ease:'power2.out',yoyo:true,repeat:1,stagger:.16,transformOrigin:'50% 100%'},9.45);
/* ---------- beat 4: empat tahun kemudian, 15 juta+ (VO 10,9–14,2) ---------- */
unsay('#line1',10.55);hide('#bul',10.55);hide('#lbl',10.55);
look(10.8,960,705,1.5,1.9,camEase);
tl.set(['#dA','#tA'],{display:'none'},10.95);tl.set('#dB',{display:'block'},10.95);tl.set('#tB',{display:'inline'},10.95);
const yr={v:1914};tl.to(yr,{v:1918,duration:1.3,ease:'steps(4)',onUpdate(){$('#yr').textContent=Math.round(yr.v);}},10.95);
tl.fromTo('#date',{scale:1},{scale:1.08,duration:.16,yoyo:true,repeat:7,ease:'power1.inOut',immediateRender:false},10.95);
tl.to('#spread',{attr:{r:470},duration:4.6,ease:'power2.out'},11.0);
say('#line2',12.2);
const n={v:0};tl.to(n,{v:15,duration:1.3,ease:'power2.out',onUpdate(){$('#num').textContent=Math.round(n.v);}},12.3);
look(12.7,960,715,1.6,DUR-12.7,'sine.inOut');
tl.to({},{duration:.01},DUR);

__TAIL__
</script>
</body>
</html>
"""

for k, s in STYLES.items():
    d = HERE / f'gaya-{k}'
    (d / 'assets/audio').mkdir(parents=True, exist_ok=True)
    shutil.copy(HERE / 'gsap.min.js', d / 'gsap.min.js')
    shutil.copy(VO, d / 'assets/audio/vo1.mp3')
    h = HTML
    for a, b in [('__JUDUL__', s['judul']), ('__FONT__', s['font']), ('__BASE__', BASE), ('__CSS__', s['css']),
                 ('__EXTRA_WORLD__', s['extra_world']), ('__EXTRA_STAGE__', s['extra_stage']), ('__MAP__', MAP),
                 ('__DATE__', s['date']), ('__LBL__', s['lbl']), ('__L1__', s['l1']), ('__L2__', s['l2']),
                 ('__B1__', BULLET.format(x=0, id='b1')), ('__B2__', BULLET.format(x=205, id='b2')),
                 ('__JS__', s['js']), ('__TAIL__', TAIL), ('__SX__', str(SX)), ('__SY__', str(SY))]:
        h = h.replace(a, b)
    (d / 'index.html').write_text(h)
    print('ok', d)
