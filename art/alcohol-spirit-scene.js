(() => {
  'use strict';
  const canvas=document.querySelector('#alcohol-spirit'),ctx=canvas.getContext('2d');
  const buttons=[...document.querySelectorAll('[data-mode]')],status=document.querySelector('#status');
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const labels={idle:'Idle · unsteady spirits',attack:'Attack · bottle incoming',flame:'Flame · a little liquid courage',die:'Death · one last drink'};
  const descriptions={idle:'A tipsy turquoise wisp levitates at hip height, swaying with a green bottle labeled XXX.',attack:'The wisp winds up and throws its green XXX beer bottle to the left.',flame:'The wisp drinks from its bottle, lowers it, then spits a jet of fire to the left.',die:'The wisp drinks the entire bottle, collapses to the ground, and releases a final burst of flames.'};
  let mode='idle',age=0,time=0,last=null;
  const clamp=v=>Math.max(0,Math.min(1,v)),mix=(a,b,t)=>a+(b-a)*t;
  const ease=v=>{v=clamp(v);return v*v*(3-2*v);};
  function oval(x,y,rx,ry,c,r=0){ctx.beginPath();ctx.ellipse(x,y,rx,ry,r,0,Math.PI*2);ctx.fillStyle=c;ctx.fill();}
  function poly(p,c){ctx.beginPath();ctx.moveTo(...p[0]);p.slice(1).forEach(v=>ctx.lineTo(...v));ctx.closePath();ctx.fillStyle=c;ctx.fill();}
  function line(p,c,w=2){ctx.beginPath();ctx.moveTo(...p[0]);p.slice(1).forEach(v=>ctx.lineTo(...v));ctx.strokeStyle=c;ctx.lineWidth=w;ctx.lineCap='round';ctx.lineJoin='round';ctx.stroke();}
  function curve(p,c,w){ctx.beginPath();ctx.moveTo(p[0],p[1]);ctx.bezierCurveTo(...p.slice(2));ctx.strokeStyle=c;ctx.lineWidth=w;ctx.lineCap='round';ctx.stroke();}
  const backdrop=document.createElement('canvas');backdrop.width=900;backdrop.height=562;
  function buildBackdrop(){
    const b=backdrop.getContext('2d');
    const sky=b.createLinearGradient(0,0,0,562);sky.addColorStop(0,'#14232c');sky.addColorStop(.65,'#365452');sky.addColorStop(1,'#1c302f');b.fillStyle=sky;b.fillRect(0,0,900,562);
    const moon=b.createRadialGradient(693,105,8,693,105,130);moon.addColorStop(0,'#d3dec43b');moon.addColorStop(1,'#c9e0c000');b.fillStyle=moon;b.fillRect(550,0,290,250);
    b.beginPath();b.arc(693,105,28,0,Math.PI*2);b.fillStyle='#c3d0b788';b.fill();
    for(let layer=0;layer<2;layer++)for(let i=0;i<9;i++){
      const x=i*125+layer*44-20,y=390+layer*39;
      b.strokeStyle=layer?'#172f30':'#233e40';b.lineWidth=19+layer*9;b.lineCap='round';b.beginPath();b.moveTo(x,y);b.bezierCurveTo(x+44,280,x-29,172,x+8,50+i%3*33);b.stroke();
      b.lineWidth=7;b.beginPath();b.moveTo(x+7,205);b.lineTo(x-36,151);b.lineTo(x-52,90);b.moveTo(x+9,279);b.lineTo(x+55,202);b.lineTo(x+80,179);b.stroke();
      b.strokeStyle='#61807444';b.lineWidth=2;for(let j=0;j<4;j++){b.beginPath();b.moveTo(x-34+j*8,151+j*10);b.quadraticCurveTo(x-43+j*9,189+j*10,x-32+j*8,217+j*8);b.stroke();}
    }
    b.fillStyle='#1b3334';b.fillRect(0,442,900,120);
    for(let i=0;i<48;i++){const x=i*137%900,y=455+i*31%104;b.fillStyle=i%3?'#83aa9520':'#adceb735';b.fillRect(x,y,16+i%5*10,1);}
    for(const x of [32,99,770,858])for(let i=0;i<6;i++){b.strokeStyle='#101f25';b.lineWidth=2;b.beginPath();b.moveTo(x+i*3,489);b.quadraticCurveTo(x+i*4-12,440,x+i*10-22,412+i%3*15);b.stroke();}
  }
  // Bottle coordinates are anchored at the open neck so it meets the mouth exactly.
  function bottle(x,y,angle,fill=1){
    ctx.save();ctx.translate(x,y);ctx.rotate(angle);
    ctx.beginPath();ctx.moveTo(-7,0);ctx.lineTo(7,0);ctx.lineTo(7,24);ctx.quadraticCurveTo(20,31,20,40);ctx.lineTo(20,83);ctx.quadraticCurveTo(0,92,-20,83);ctx.lineTo(-20,40);ctx.quadraticCurveTo(-20,31,-7,24);ctx.closePath();
    ctx.fillStyle='#235f3c';ctx.fill();ctx.strokeStyle='#9dcc74';ctx.lineWidth=2;ctx.stroke();
    ctx.save();ctx.clip();ctx.fillStyle='#9faf4388';ctx.fillRect(-20,84-53*fill,40,53*fill+3);ctx.fillStyle='#d7f4a23b';ctx.fillRect(-14,31,5,49);ctx.restore();
    line([[-7,2],[7,2]],'#cee5a0',4);line([[-3,7],[-3,23]],'#bded9588',2);
    poly([[-18,43],[18,43],[18,69],[-18,69]],'#e6d7a1');line([[-16,46],[16,46]],'#a38950',1);
    ctx.fillStyle='#38452d';ctx.font='bold 15px Georgia';ctx.textAlign='center';ctx.fillText('XXX',0,61);ctx.restore();
  }
  function fire(x,y,power,t,burst=false){
    if(power<=0)return;
    ctx.save();ctx.translate(x,y);
    const glow=ctx.createRadialGradient(burst?0:-95,-20,0,burst?0:-95,-20,burst?210:250);glow.addColorStop(0,`rgba(255,159,49,${power*.35})`);glow.addColorStop(1,'#ff8d2100');ctx.fillStyle=glow;ctx.fillRect(-370,-250,620,410);
    for(let i=0;i<24;i++){
      const q=((burst?(i*7%24):i)/24+(reduced.matches?0:t*1.4))%1;
      const theta=-Math.PI+(i/23)*Math.PI;
      const px=burst?Math.cos(theta)*q*180:-q*310;
      const py=burst?Math.sin(theta)*q*200:-q*18+Math.sin(i*9+t*9)*q*30;
      const size=(burst?38:23)*(1-q*.7)*power;
      ctx.globalAlpha=(1-q)*power;
      oval(px,py,size*1.6,size,i%3?'#ff8b35':'#e65330',burst?theta:.2);
      poly([[px+size,py+size*.45],[px-size*2.3,py-size*1.6],[px-size*.4,py+size]],'#ffc05a');
      oval(px+size*.2,py,size*.7,size*.5,'#fff3ad');
    }
    ctx.restore();
  }
  function spirit(t){
    const dying=mode==='die',flaming=mode==='flame',throwing=mode==='attack';
    const fall=dying?ease((t-1.9)/.7):0,dead=dying&&t>=2.6;
    const drink=(flaming||dying)?ease(t/.5)*(1-ease((t-(dying?1.65:.95))/.35)):0;
    const pour=dying?1-ease((t-.55)/1.05):flaming?1-.4*ease((t-.5)/.5):1;
    const flame=flaming?ease((t-1.35)/.2)*(1-ease((t-2.25)/.45)):0;
    const sway=reduced.matches||dead?0:Math.sin(time*1.65)*15+Math.sin(time*3.1)*5;
    const bob=reduced.matches||dead?0:Math.sin(time*2.1)*10+Math.cos(time*.9)*5;
    const x=493+sway*(1-fall),y=mix(318+bob,451,fall);
    const tilt=mix(reduced.matches?0:Math.sin(time*1.7)*.12,-1.25,fall);
    const scale=1-fall*.5;
    oval(x,458,61+fall*22,8,'#061e2366');
    if(!dead){
      const halo=ctx.createRadialGradient(x,y-20,10,x,y,150);halo.addColorStop(0,'#a2efcf22');halo.addColorStop(1,'#99f6d000');ctx.fillStyle=halo;ctx.fillRect(x-160,y-160,320,320);
    }
    ctx.save();ctx.translate(x,y);ctx.rotate(tilt);ctx.scale(scale,scale);
    ctx.globalAlpha=dead?.35:1;
    // A tapering, curling vapor body with no feet keeps the wisp visibly airborne.
    const flutter=reduced.matches||dead?0:Math.sin(time*3)*10;
    const body=ctx.createLinearGradient(-50,-90,55,120);body.addColorStop(0,'#d3f5dd');body.addColorStop(.45,'#91cec3');body.addColorStop(1,'#659fac11');
    ctx.beginPath();ctx.moveTo(-47,-49);ctx.bezierCurveTo(-66,-108,33,-115,49,-59);ctx.bezierCurveTo(69,-26,26,4,41,44);ctx.bezierCurveTo(54,75,89+flutter,75,94+flutter,112);ctx.bezierCurveTo(42,82,16,111,-10,71);ctx.bezierCurveTo(-25,100,-43,77,-33,48);ctx.bezierCurveTo(-71,35,-62,-4,-47,-49);ctx.closePath();ctx.fillStyle=body;ctx.fill();
    curve([26,-79,60,-12,1,18,38,71],'#d5ffeb66',3);
    curve([-43,17,-73,53,-52,72,-65+flutter,94],'#8bd0c073',5);
    curve([13,54,-6,100,62,94,70+flutter,117],'#92e0cb66',4);
    // Half-lidded eyes, asymmetric eyebrows and a rosy drunken blush.
    oval(-32,-58,12,10,'#e9fae8');oval(1,-60,11,10,'#e9fae8');
    if(dead){line([[-40,-62],[-24,-53]],'#355f59',3);line([[-40,-53],[-24,-62]],'#355f59',3);line([[-6,-64],[7,-55]],'#355f59',3);line([[-6,-55],[7,-64]],'#355f59',3);}
    else{oval(-35,-56,4,6,'#2c5655');oval(-2,-58,4,6,'#2c5655');line([[-43,-63],[-22,-59]],'#689c8e',7);line([[-9,-64],[11,-67]],'#689c8e',7);}
    line([[-43,-77],[-24,-74]],'#426d61',3);line([[-8,-78],[10,-84]],'#426d61',3);
    oval(-43,-42,10,5,'#cd8e8588');oval(9,-43,10,5,'#cd8e8588');
    if(drink>.6||flame>0)oval(-39,-32,9,8,'#264b4b');
    else curve([-32,-29,-21,-19,-11,-24,-5,-31],'#345e56',3);
    const released=throwing&&t>=.5;
    let bx=mix(-77,-42,drink),by=mix(3,-32,drink),angle=mix(-.18,2.2,drink);
    if(throwing&&!released){const wind=ease(t/.3),release=ease((t-.3)/.2);bx+=wind*93-release*125;by-=wind*48;angle-=wind*.8;}
    if(!released&&!dead){
      const hx=bx-Math.sin(angle)*32,hy=by+Math.cos(angle)*32;
      curve([-38,0,-84,9,hx+30,hy+14,hx,hy],'#477f79',15);
      curve([-38,-2,-83,5,hx+30,hy+10,hx,hy-2],'#aadac6',10);
      bottle(bx,by,angle,pour);oval(hx,hy,12,8,'#c6ead2',angle);
      for(let i=0;i<3;i++)line([[hx-5,hy-4+i*4],[hx+5,hy-2+i*4]],'#659c87',1);
    }else if(released){curve([-38,0,-75,-7,-97,-38,-116,-39],'#9fdac9',12);oval(-116,-39,12,8,'#c6ead2');}
    curve([36,-2,80,16,45,40,68,48],'#9ddaca99',12);oval(68,48,12,8,'#b8e6ce');
    if(!dying&&!flaming&&!throwing){
      for(let i=0;i<3;i++){const q=(time*.35+i/3)%1;ctx.globalAlpha=(1-q)*.45;ctx.strokeStyle='#c3e4c7';ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(-70-q*15,-95-q*38,3+q*3,0,Math.PI*2);ctx.stroke();}ctx.globalAlpha=1;
    }
    if(flame>0)fire(-48,-32,flame,t);
    ctx.restore();
    // The projectile is detached from the hand and follows a ballistic arc.
    if(released){const q=clamp((t-.5)/.95);if(q<1){const bx=493-109-q*370,by=318-45-q*115+q*q*245;bottle(bx,by,-1-q*7,1);}}
    if(dead){
      bottle(429,458,-Math.PI/2,0);
      const burst=ease((t-2.6)/.13)*(1-ease((t-3.02)/.7));
      fire(493,450,burst,t,true);
      if(t>3.15){const smoke=clamp((t-3.15)/1.1);ctx.save();ctx.globalAlpha=(1-smoke)*.23;for(let i=0;i<6;i++)oval(480+Math.sin(i*4)*30,437-smoke*95-i*10,15+i*3,12+i*4,'#a1b6ab');ctx.restore();}
    }
    const message=dying?(t<1.9?'Death · draining the last drop':t<2.6?'Death · last orders, last stumble':t<3.72?'Death · one final blaze':'Gone · an empty bottle and a cold marsh'):flaming?(t<1.3?'Flame · taking a swig':'Flame · spitting fire'):labels[mode];
    if(status.textContent!==message)status.textContent=message;
  }
  function select(next){mode=next;age=0;last=null;status.textContent=labels[next];canvas.setAttribute('aria-label',descriptions[next]);buttons.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.mode===next)));}
  function frame(now){
    requestAnimationFrame(frame);if(document.hidden){last=null;return;}
    const dt=last===null?0:Math.min((now-last)/1000,.05);last=now;age+=dt;if(!reduced.matches)time+=dt;
    if((mode==='attack'&&age>1.7)||(mode==='flame'&&age>3.05))select('idle');
    ctx.drawImage(backdrop,0,0);
    // Reduced motion presents readable key poses, including every death stage.
    const t=reduced.matches?(mode==='idle'?0:mode==='attack'?(age<.5?.25:1):mode==='flame'?(age<1.3?.8:1.8):(age<1.9?1.3:age<2.6?2.35:age<3.72?2.95:4.3)):age;
    spirit(t);
  }
  buttons.forEach(b=>b.addEventListener('click',()=>select(b.dataset.mode)));
  document.addEventListener('keydown',e=>{if(e.repeat||e.altKey||e.ctrlKey||e.metaKey||e.target.closest('input,textarea,select,button,a,[contenteditable]'))return;const next={i:'idle',a:'attack',' ':'attack',f:'flame',d:'die'}[e.key.toLowerCase()];if(next){e.preventDefault();select(next);}});
  canvas.width=900;canvas.height=562;buildBackdrop();requestAnimationFrame(frame);
})();
