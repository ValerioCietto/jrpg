(() => {
  'use strict';
  const canvas=document.querySelector('#rock-golem'),ctx=canvas.getContext('2d');
  const buttons=[...document.querySelectorAll('[data-mode]')],status=document.querySelector('#status'),soundButton=document.querySelector('#sound');
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let mode='idle',age=0,time=0,last=null,audio=null,sound=false,lastBeat=-1;
  const clamp=x=>Math.max(0,Math.min(1,x)),ease=x=>{x=clamp(x);return x*x*(3-2*x);},mix=(a,b,t)=>a+(b-a)*t;
  const labels={idle:'Idle · a slow stone groove',attack:'Riff · bringing down the mountain',guitar:'Guitar slash · the hard side of rock',die:'Death · this gig is over'};
  const descriptions={idle:'Rock Golem slowly strums his electric guitar, bobbing his blonde-wigged head to the same beat.',attack:'Rock Golem plays an aggressive riff while boulders rain down on the left side.',guitar:'Rock Golem swings the back of his guitar in a descending slash from head height to hip height.',die:'Rock Golem furiously raises his guitar, smashes it into the ground, then crumbles into a pile of rocks.'};
  function oval(x,y,rx,ry,c,r=0){ctx.beginPath();ctx.ellipse(x,y,rx,ry,r,0,Math.PI*2);ctx.fillStyle=c;ctx.fill();}
  function poly(p,c){ctx.beginPath();ctx.moveTo(...p[0]);p.slice(1).forEach(v=>ctx.lineTo(...v));ctx.closePath();ctx.fillStyle=c;ctx.fill();}
  function line(p,c,w=2){ctx.beginPath();ctx.moveTo(...p[0]);p.slice(1).forEach(v=>ctx.lineTo(...v));ctx.strokeStyle=c;ctx.lineWidth=w;ctx.lineCap='round';ctx.lineJoin='round';ctx.stroke();}
  function curve(p,c,w){ctx.beginPath();ctx.moveTo(p[0],p[1]);ctx.bezierCurveTo(...p.slice(2));ctx.strokeStyle=c;ctx.lineWidth=w;ctx.lineCap='round';ctx.stroke();}
  function rock(x,y,s,r=0){ctx.save();ctx.translate(x,y);ctx.rotate(r);poly([[-s,-s*.2],[-s*.55,-s*.85],[s*.34,-s],[s*.94,-s*.2],[s*.7,s*.65],[-s*.44,s*.8]],'#7b828a');poly([[-s,-s*.2],[-s*.55,-s*.85],[s*.34,-s],[s*.15,-s*.1]],'#a8afb0');poly([[s*.15,-s*.1],[s*.94,-s*.2],[s*.7,s*.65]],'#525e6b');line([[-s*.43,-s*.2],[-s*.08,s*.07],[-s*.2,s*.4]],'#45515c',1.5);ctx.restore();}
  function background(){
    const g=ctx.createLinearGradient(0,0,0,562);g.addColorStop(0,'#202331');g.addColorStop(.65,'#796e73');g.addColorStop(1,'#403e49');ctx.fillStyle=g;ctx.fillRect(0,0,900,562);
    oval(693,114,49,49,'#e4aa7955');
    for(const [x,y,w] of [[99,88,199],[340,153,184],[632,59,234],[872,162,166]]){poly([[x-w,446],[x,y],[x+w,446]],'#3b4556');poly([[x,y],[x+36,y+125],[x+w,446],[x+64,435]],'#2c3548');poly([[x,y],[x-34,y+75],[x-7,y+54],[x+22,y+83]],'#b7b6b2');}
    poly([[0,443],[241,415],[528,442],[739,421],[900,438],[900,562],[0,562]],'#504d54');
    for(let i=0;i<32;i++){const x=i*139%900,y=458+i*41%95;line([[x,y],[x+17,y-4],[x+29,y]],'#9f929347',2);}
    for(const [x,y,s] of [[48,449,24],[807,470,32],[861,496,17]])rock(x,y,s);
  }
  function flame(x,y,s){poly([[x-10*s,y],[x-14*s,y-16*s],[x-5*s,y-28*s],[x-7*s,y-44*s],[x+4*s,y-32*s],[x+8*s,y-14*s],[x+15*s,y-29*s],[x+17*s,y-10*s],[x+11*s,y]],'#bd393a');poly([[x-5*s,y],[x-6*s,y-12*s],[x+1*s,y-23*s],[x+4*s,y-8*s],[x+9*s,y-14*s],[x+8*s,y]],'#eb7651');}
  function guitar(x,y,angle,back=false){
    ctx.save();ctx.translate(x,y);ctx.rotate(angle);
    line([[-34,0],[-166,0]],'#2a2730',17);line([[-40,-2],[-162,-2]],'#a88057',11);
    poly([[-164,-10],[-194,-18],[-208,-8],[-199,10],[-163,8]],'#333340');for(let i=0;i<4;i++)oval(-172-i*7,-12-i*1.1,3,4,'#cbd0cb');
    ctx.beginPath();ctx.moveTo(-42,-9);ctx.bezierCurveTo(-69,-43,-25,-48,-17,-27);ctx.bezierCurveTo(17,-46,64,-21,46,14);ctx.bezierCurveTo(29,54,-17,37,-25,23);ctx.bezierCurveTo(-64,32,-73,4,-42,-9);ctx.closePath();ctx.fillStyle=back?'#49252d':'#aa3944';ctx.fill();ctx.strokeStyle='#e18b73';ctx.lineWidth=3;ctx.stroke();
    if(back){poly([[-11,-15],[22,-14],[25,15],[-10,17]],'#282c34');for(const x of [-6,18])oval(x,-10,2,2,'#9ea6a9');line([[-31,9],[-10,-8],[9,3]],'#ad655c',2);}
    else{poly([[-36,-10],[-8,-21],[30,-10],[17,19],[-24,13]],'#eee4c8');for(const x of [-22,-3]){ctx.fillStyle='#343844';ctx.fillRect(x,-11,8,22);}line([[20,-12],[20,13]],'#9faeb2',5);for(let i=0;i<6;i++)line([[-192,-4+i*1.6],[23,-4+i*1.6]],'#d8e0d7',.65);for(let i=0;i<10;i++)line([[-50-i*11,-7],[-50-i*11,7]],'#d0b394',1);oval(31,15,4,4,'#e0ca8e');oval(18,26,4,4,'#e0ca8e');}
    ctx.restore();
  }
  function pose(t){
    if(mode==='guitar'){const wind=ease(t/.3),hit=ease((t-.32)/.43),back=ease((t-.95)/.4);return {x:mix(-90*wind,-115,hit)*(1-back),y:mix(-140-135*wind,-112,hit)*(1-back)-140*back,a:mix(-1.2*wind,.65,hit)*(1-back)-.22*back,rear:true};}
    if(mode==='die'){const raise=ease(t/.65),smash=ease((t-.7)/.35);return {x:-104*smash,y:mix(-140-179*raise,-15,smash),a:mix(-1.6*raise,.35,smash),rear:true};}
    return {x:12,y:-141,a:-.22+(reduced.matches?0:Math.sin(t*(mode==='attack'?22:Math.PI))*.035),rear:false};
  }
  function head(beat,angry){
    ctx.save();ctx.translate(0,-256+beat*(angry?9:4));ctx.rotate(beat*(angry?.16:.04));
    // Long blonde wig hangs behind a clearly faceted stone face.
    poly([[-47,-29],[-31,-57],[12,-62],[44,-39],[50,17],[64,72],[43,58],[30,79],[16,57],[-11,74],[-31,63],[-52,75],[-43,28]],'#b68d43');
    for(let i=0;i<9;i++)curve([-38+i*9,-30,-44+i*10,3,-28+i*8,39,-43+i*11,65],'#ecd085',4);
    poly([[-35,-31],[-14,-46],[26,-35],[41,-10],[32,28],[7,42],[-28,28],[-40,2]],'#a5aaab');poly([[9,-34],[26,-35],[41,-10],[32,28],[8,38],[18,4]],'#727f8a');
    line([[-30,-5],[-8,angry?3:-4]],'#354550',6);line([[7,angry?3:-4],[28,-6]],'#354550',6);line([[-28,5],[-10,5]],'#e6bc71',3);line([[9,5],[26,5]],'#e6bc71',3);
    poly([[-3,3],[-10,19],[5,19]],'#616f7d');line([[-21,28],[17,29]],'#3b4a57',4);if(angry){ctx.fillStyle='#374451';ctx.fillRect(-19,25,34,12);for(let i=0;i<4;i++)line([[-14+i*8,26],[-14+i*8,31]],'#d5d0b5',4);}
    line([[-26,-27],[-16,-16],[-24,-8]],'#53626d',2);
    poly([[-41,-22],[-36,-46],[-13,-58],[18,-56],[41,-37],[43,-16],[24,-30],[6,-37],[-10,-32],[-24,-17]],'#e5c56d');
    line([[-37,-39],[-26,-46],[-19,-32]],'#fff0a8',3);line([[2,-47],[22,-42],[32,-29]],'#fff0a8',3);
    line([[-39,-18],[0,-22],[38,-18]],'#9e3544',10);line([[-37,-21],[0,-25],[37,-21]],'#e46d61',2);poly([[35,-19],[63,-2],[51,4],[69,13],[44,7]],'#a23d48');ctx.restore();
  }
  function body(t){
    const dying=mode==='die',broken=dying&&t>=1.07,collapse=dying?ease((t-1.65)/1.05):0;
    const beat=reduced.matches?0:Math.sin(t*(mode==='attack'?Math.PI*8:Math.PI));
    const x=502;oval(x,462,127,16,'#212b3a66');
    if(collapse<1){ctx.save();ctx.translate(x,451+collapse*20);ctx.scale(1,1-collapse*.65);ctx.globalAlpha=1-collapse;
      // Tight denim legs follow the angular stone limbs.
      for(const side of [-1,1]){line([[side*33,-118],[side*43,-66],[side*48,-19]],'#243d59',34);line([[side*25,-112],[side*34,-68],[side*40,-24]],'#527b98',7);line([[side*42,-108],[side*53,-69],[side*55,-27]],'#94a4a044',2);rock(side*49,-7,26);line([[side*36,-67],[side*54,-64]],'#9eaaa6',2);}
      poly([[-60,-218],[-28,-237],[32,-235],[64,-210],[49,-125],[-43,-122]],'#879397');poly([[-24,-222],[23,-226],[36,-189],[16,-160],[-22,-163],[-39,-190]],'#a9b2ae');line([[-5,-222],[-16,-198],[-4,-180],[-13,-163]],'#5b6c74',3);line([[24,-191],[42,-181],[31,-155]],'#596c76',3);
      // Open short-sleeved black jacket: chest stays exposed between two flame panels.
      poly([[-38,-232],[-71,-218],[-87,-188],[-60,-174],[-48,-193],[-52,-122],[-16,-126],[-25,-194]],'#23242e');
      poly([[36,-232],[72,-217],[88,-187],[61,-174],[48,-194],[52,-122],[16,-126],[24,-194]],'#20232b');
      line([[-36,-226],[-25,-194],[-18,-130]],'#626573',3);line([[34,-226],[24,-194],[18,-130]],'#626573',3);
      flame(-38,-135,.75);flame(37,-135,.75);flame(-70,-188,.42);flame(70,-188,.42);
      line([[-43,-120],[44,-120]],'#252935',10);ctx.fillStyle='#c1b89a';ctx.fillRect(-9,-126,18,13);ctx.fillStyle='#3a3c43';ctx.fillRect(-5,-123,10,7);
      const p=pose(t),c=Math.cos(p.a),s=Math.sin(p.a);
      const fret=[p.x-116*c,p.y-116*s],strum=[p.x-4*c,p.y-4*s+beat*(mode==='attack'?14:7)];
      for(const [shoulder,hand] of [[[-67,-184],fret],[[67,-184],strum]]){line([shoulder,[shoulder[0]*1.2,-148],hand],'#647581',23);line([[shoulder[0]-3,shoulder[1]],[shoulder[0]*1.2-3,-153],[hand[0]-3,hand[1]-3]],'#a4b1b2',12);}
      if(!broken){if(mode==='idle'||mode==='attack')line([[42,-219],[-25,-121]],'#1d2632',8);guitar(p.x,p.y,p.a,p.rear);rock(...fret,13);rock(...strum,15);}
      head(beat,mode!=='idle');ctx.restore();
    }
    if(broken){guitar(x-104,447,.35,true);ctx.save();ctx.translate(x-104,447);ctx.rotate(.35);line([[-50,-19],[-23,3],[-41,18]],'#e6bc83',5);ctx.restore();for(let i=0;i<8;i++){const q=clamp((t-1.07)/.65);const dx=(i-4)*19;rock(x-96+dx*q,451-Math.sin(q*Math.PI)*(25+i%3*16),4+i%3,q*i);}}
    if(collapse>0){for(let i=0;i<31;i++){const sx=(i*41%135)-67,sy=-290+(i*67%285),endX=(i*71%230)-115,endY=-5-Math.abs(Math.sin(i*2))*37;rock(x+mix(sx,endX,collapse),451+mix(sy,endY,collapse),11+i%5*3,collapse*(i%5-.7));}if(collapse===1){curve([x-35,405,x-57,430,x+42,423,x+21,441],'#e6c477',9);line([[x-31,416],[x+27,425]],'#aa3e49',6);}}
    if(dying&&t>1.02&&t<1.35){ctx.save();ctx.globalAlpha=1-(t-1.02)/.33;for(let i=0;i<7;i++){const a=Math.PI+i*Math.PI/6;line([[x-101+Math.cos(a)*33,455+Math.sin(a)*22],[x-101+Math.cos(a)*72,455+Math.sin(a)*63]],'#ffe2ac',4);}ctx.restore();}
    if(mode==='guitar'&&t>.35&&t<.85){ctx.save();ctx.globalAlpha=Math.sin((t-.35)/.5*Math.PI);curve([x-95,163,x-226,221,x-209,316,x-77,365],'#e3c4dc',6);ctx.restore();}
  }
  function rockfall(t){if(t<.35)return;for(let i=0;i<9;i++){const q=(t-.35-i*.12)/.9;if(q<0||q>1.45)continue;const x=87+(i*79%244);if(q<1)rock(x,25+q*q*425,15+i%4*5,q*(i%2?2:-2));else{rock(x,455,15+i%4*5);ctx.save();ctx.globalAlpha=(1.45-q)*1.5;oval(x,459,22+(q-1)*60,5+(q-1)*10,'#b8ada6');ctx.restore();}}}
  // A quiet synthesized power chord; audio starts only through the sound button.
  function chord(heavy){if(!audio||audio.state!=='running')return;const now=audio.currentTime;for(const freq of [82.41,123.47,164.82]){const osc=audio.createOscillator(),gain=audio.createGain(),filter=audio.createBiquadFilter();osc.type=heavy?'sawtooth':'triangle';osc.frequency.value=freq;filter.type='lowpass';filter.frequency.value=heavy?1800:950;gain.gain.setValueAtTime(.0001,now);gain.gain.exponentialRampToValueAtTime(heavy?.028:.035,now+.008);gain.gain.exponentialRampToValueAtTime(.0001,now+(heavy?.18:.8));osc.connect(filter);filter.connect(gain);gain.connect(audio.destination);osc.start(now);osc.stop(now+(heavy?.2:.85));osc.onended=()=>{osc.disconnect();filter.disconnect();gain.disconnect();};}}
  soundButton.addEventListener('click',async()=>{try{if(!audio)audio=new (window.AudioContext||window.webkitAudioContext)();sound=!sound;if(sound){await audio.resume();lastBeat=-1;}else await audio.suspend();soundButton.setAttribute('aria-pressed',String(sound));soundButton.textContent='Guitar sound: '+(sound?'on':'off');}catch{sound=false;soundButton.textContent='Guitar sound unavailable';}});
  function select(next){mode=next;age=0;last=null;lastBeat=-1;buttons.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.mode===next)));canvas.setAttribute('aria-label',descriptions[next]);}
  function frame(now){requestAnimationFrame(frame);if(document.hidden){last=null;return;}const dt=last===null?0:Math.min((now-last)/1000,.05);last=now;age+=dt;time+=dt;if((mode==='attack'&&age>2.8)||(mode==='guitar'&&age>1.5))select('idle');
    const beat=Math.floor(age*(mode==='attack'?4:.5));if(sound&&(mode==='idle'||mode==='attack')&&beat!==lastBeat){chord(mode==='attack');lastBeat=beat;}
    background();const t=reduced.matches?(mode==='idle'?0:mode==='attack'?1.4:mode==='guitar'?(age<.4?.3:.75):age<.7?.65:age<1.65?1.15:age<2.7?2.2:3):age;body(t);if(mode==='attack')rockfall(t);
    const message=mode==='die'?(age<.7?'Death · a fit of rock-star rage':age<1.65?'Death · guitar meets ground':age<2.7?'Death · falling to pieces':'Silence · a pile of rocks and a ruined guitar'):labels[mode];if(status.textContent!==message)status.textContent=message;
  }
  buttons.forEach(b=>b.addEventListener('click',()=>select(b.dataset.mode)));
  document.addEventListener('keydown',e=>{if(e.repeat||e.altKey||e.ctrlKey||e.metaKey||e.target.closest('input,textarea,select,button,a,[contenteditable]'))return;const next={i:'idle',a:'attack',r:'attack',g:'guitar',d:'die',' ':'attack'}[e.key.toLowerCase()];if(next){e.preventDefault();select(next);}});
  canvas.width=900;canvas.height=562;requestAnimationFrame(frame);
})();
