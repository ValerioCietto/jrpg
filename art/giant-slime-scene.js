(() => {
  'use strict';
  const canvas=document.querySelector('#giant-slime'),ctx=canvas.getContext('2d');
  const buttons=[...document.querySelectorAll('[data-mode]')],status=document.querySelector('#status');
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const labels={idle:'Idle · keeping dessert upright',attack:'Attack · a spoonful of trouble',hug:'Group hug · come a little closer',die:'Death · an unexpected dinner guest'};
  const descriptions={idle:'A huge panna cotta wobbles on a plate while tiny bugs scuttle beneath it to keep it balanced.',attack:'The panna cotta scoops itself with a giant spoon and launches creamy pieces to the left.',hug:'The dessert extends two enormous creamy arms, then closes them in a crushing hug.',die:'A hungry giant appears behind the panna cotta and eats it completely in exactly three munches, leaving the plate and bugs.'};
  let mode='idle',age=0,time=0,last=null;
  const clamp=v=>Math.max(0,Math.min(1,v)),mix=(a,b,t)=>a+(b-a)*t;
  const ease=v=>{v=clamp(v);return v*v*(3-2*v);};
  function oval(x,y,rx,ry,c,r=0){ctx.beginPath();ctx.ellipse(x,y,rx,ry,r,0,Math.PI*2);ctx.fillStyle=c;ctx.fill();}
  function poly(p,c){ctx.beginPath();ctx.moveTo(...p[0]);p.slice(1).forEach(v=>ctx.lineTo(...v));ctx.closePath();ctx.fillStyle=c;ctx.fill();}
  function line(p,c,w=2){ctx.beginPath();ctx.moveTo(...p[0]);p.slice(1).forEach(v=>ctx.lineTo(...v));ctx.strokeStyle=c;ctx.lineWidth=w;ctx.lineCap='round';ctx.lineJoin='round';ctx.stroke();}
  function curve(p,c,w){ctx.beginPath();ctx.moveTo(p[0],p[1]);ctx.bezierCurveTo(...p.slice(2));ctx.strokeStyle=c;ctx.lineWidth=w;ctx.lineCap='round';ctx.stroke();}
  function background(){
    const sky=ctx.createLinearGradient(0,0,0,562);sky.addColorStop(0,'#232b34');sky.addColorStop(.7,'#5d6c60');sky.addColorStop(1,'#293b38');ctx.fillStyle=sky;ctx.fillRect(0,0,900,562);
    oval(702,99,42,42,'#ddc99b33');
    for(let i=0;i<9;i++){const x=i*121-23;curve([x,439,x+55,286,x-20,161,x+26,52+i%3*37],'#253c3b',20+i%3*7);line([[x+16,230],[x+61,168],[x+68,121]],'#253c3b',10);line([[x+9,172],[x-29,137],[x-39,94]],'#253c3b',8);}
    ctx.fillStyle='#384940';ctx.fillRect(0,448,900,114);
    oval(481,465,262,23,'#202e2c77');
    for(let i=0;i<40;i++){const x=i*137%900,y=463+i*43%87;line([[x,y],[x+17+i%5*5,y]],'#b3c0a123',1);}
    for(const x of [68,120,802,864]){line([[x,484],[x-8,424],[x+5,454],[x+19,433]],'#202f29',3);oval(x-8,423,4,12,'#8b7251');}
    for(const [x,y] of [[168,477],[752,469]]){line([[x,y],[x,y-17]],'#d7c8a6',5);oval(x,y-20,17,8,'#ad6c59');oval(x-6,y-23,3,2,'#e6c99d');}
  }
  function bug(x,y,i,t,load){
    const step=reduced.matches?0:Math.sin(t*13+i*2),lift=load?0:Math.sin(t*6+i)*2;
    for(let side=-1;side<=1;side+=2)for(let j=0;j<3;j++)line([[x+side*5,y-5],[x+side*(11+j*3),y-1+step*(j%2?2:-2)],[x+side*(14+j*4),y+7]],'#171e21',2);
    oval(x,y-7+lift,9,12,i%2?'#a78b5b':'#657f71');line([[x,y-16+lift],[x,y+3+lift]],'#364637',1.5);oval(x-2,y-21+lift,7,6,'#35443e');
    for(const dx of [-5,2]){oval(x+dx,y-23+lift,2,3,'#f4e6b9');oval(x+dx-1,y-23+lift,1,1.5,'#1d2627');}
    line([[x-7,y-24],[x-13,y-31],[x-16,y-30]],'#26382e',1.5);line([[x+2,y-25],[x+6,y-31]],'#26382e',1.5);
    // Raised forelegs stay beneath the plate, visibly bearing its weight.
    line([[x-6,y-13],[x-15,y-24],[x-12,y-36]],'#26382e',2);line([[x+6,y-13],[x+15,y-24],[x+12,y-36]],'#26382e',2);
  }
  function giant(t,bites){
    const entry=ease(t/.7),current=Math.floor(Math.max(0,t-.85)/.95);
    const cycle=(t-.85-current*.95)/.95;
    const eating=t>=.85&&t<3.7;
    const lean=eating?Math.sin(clamp(cycle/.72)*Math.PI):0;
    const target=[221,289,357][Math.min(current,2)];
    const hy=mix(-190,105,entry)+(target-166)*lean;
    const open=eating?Math.sin(clamp(cycle/.62)*Math.PI):0;
    ctx.save();ctx.translate(493,hy);
    // Broad shoulders and huge hands sit behind the dessert, establishing scale.
    poly([[-68,56],[-155,91],[-184,278],[180,278],[155,94],[62,56]],'#674c48');
    poly([[-55,68],[-103,96],[-89,260],[83,260],[98,99],[48,68]],'#a88962');
    line([[-61,95],[-66,245]],'#d0b78b',5);line([[55,95],[61,245]],'#d0b78b',5);
    oval(-146,239,40,31,'#b89973');oval(143,239,40,31,'#b89973');
    oval(-77,6,21,28,'#b08d68');oval(77,6,21,28,'#b08d68');
    oval(0,1,80,82,'#c9a77a');oval(18,21,58,57,'#d4b587');
    poly([[-77,-12],[-82,-61],[-63,-83],[-47,-80],[-27,-97],[-8,-86],[12,-100],[30,-81],[57,-84],[79,-52],[80,-7],[64,-30],[55,-53],[27,-48],[4,-61],[-22,-49],[-51,-56],[-66,-27]],'#514333');
    for(const x of [-31,31]){oval(x,-10,15,12,'#f2e3c4');oval(x,-6,5,7,'#4e4b39');line([[x-16,-29],[x+13,-32]],'#60462f',7);}
    oval(-3,15,21,16,'#b58f64');oval(-5,11,13,9,'#dabb8c');
    oval(-2,55,42,9+open*34,'#49302b');
    if(open>.15){poly([[-33,39-open*15],[30,39-open*15],[29,49-open*15],[-32,49-open*15]],'#f2e0b6');oval(0,64+open*13,21,8,'#b76c59');}
    else curve([-34,54,-20,75,22,75,36,51],'#76543b',4);
    if(bites>0){oval(-28,65,6,3,'#fff0cd');oval(21,70,4,3,'#fff0cd');}
    ctx.restore();
  }
  function pudding(bites,scoop,hug,t){
    if(bites===3)return;
    // Each bite removes one full third. The scalloped cut edges remain until the next munch.
    const top=bites?-220+bites*68:-280;
    ctx.save();ctx.beginPath();ctx.rect(-170,top,340,40-top);ctx.clip();
    const cream=ctx.createLinearGradient(-140,-100,160,-100);cream.addColorStop(0,'#d4b88d');cream.addColorStop(.2,'#fff1cf');cream.addColorStop(.55,'#fff6dc');cream.addColorStop(1,'#c9a579');
    ctx.beginPath();ctx.moveTo(-98,-205);ctx.bezierCurveTo(-102,-160,-128,-75,-150,-18);ctx.bezierCurveTo(-155,17,155,17,150,-18);ctx.bezierCurveTo(128,-76,102,-164,98,-205);ctx.closePath();ctx.fillStyle=cream;ctx.fill();
    for(let i=0;i<9;i++){const x=-87+i*22;curve([x,-192,x*1.1,-140,x*1.34,-70,x*1.5,-10],i%2?'#b8916340':'#fffbee99',i%2?8:10);}
    oval(0,-205,99,25,'#fff3d5');
    if(!bites){
      // Glossy berry sauce runs over the rim of the fluted panna cotta.
      oval(0,-207,97,23,'#a84952');
      for(const [x,l,w] of [[-81,33,9],[-46,17,7],[8,42,11],[58,26,8],[84,13,6]])curve([x,-207,x-7,-186,x+5,-192+l,x,-192+l],'#a84952',w);
      oval(-20,-211,59,9,'#d3727755');line([[-58,-215],[-35,-220],[-5,-221]],'#f0a69d',3);
      for(const [x,y] of [[-7,-233],[8,-238],[19,-230]])oval(x,y,12,11,'#9d3549');
      poly([[8,-246],[30,-262],[43,-256],[26,-245]],'#6d9956');line([[11,-246],[36,-256]],'#bdd085',2);
    }
    if(bites){oval(0,top+4,110+bites*14,13,'#fff3d5');for(let i=0;i<7;i++)oval(-90+i*30,top,15,7,'#d4b88d');}
    if(scoop>0){oval(-120,-102,28*scoop,32*scoop,'#786956');oval(-111,-98,21*scoop,28*scoop,'#c6a67c');}
    if(!bites){
      const blink=!reduced.matches&&t%4.7>4.5;
      for(const x of [-43,37]){if(blink)line([[x-10,-115],[x+10,-115]],'#584330',3);else{oval(x,-119,10,14,'#534534');oval(x-2,-123,3,5,'#fff8db');}oval(x,-94,16,6,'#d7987e66');}
      if(mode==='die')oval(-3,-88,11,14,'#634438');else curve([-18,-87,-8,-72,12,-72,22,-91],'#805a43',3);
    }
    ctx.restore();
  }
  function spoon(t){
    const scoop=ease(t/.45),fling=ease((t-.65)/.3),recover=ease((t-1.4)/.5);
    const bx=mix(mix(85,-121,scoop),-191,fling)*(1-recover)+85*recover;
    const by=mix(mix(-164,-107,scoop),-195,fling)*(1-recover)-145*recover;
    const angle=mix(.3,-.45,fling);
    const hx=bx+Math.cos(angle)*168,hy=by+Math.sin(angle)*168;
    curve([109,-97,163,-64,hx+12,hy+20,hx,hy],'#d4b68d',24);
    curve([109,-101,159,-69,hx+12,hy+14,hx,hy-4],'#fff0ca',16);
    ctx.save();ctx.translate(bx,by);ctx.rotate(angle);
    line([[10,0],[184,0]],'#526e72',12);line([[14,-3],[182,-3]],'#cfe0d9',6);
    oval(0,0,39,24,'#6e8789');oval(-3,-4,33,18,'#d2e2da');oval(-4,-1,26,12,'#8fa8a8');
    if(t>.4&&t<.91){oval(-7,-9,27,19,'#ffedc6');oval(-12,-20,16,5,'#bb6870');}
    ctx.restore();oval(hx,hy,18,13,'#f9e6bb',angle);
  }
  function hugArms(t){
    const spread=ease(t/.55),close=ease((t-.75)/.5),relax=ease((t-1.8)/.6);
    const reach=spread*(1-relax),squeeze=close*(1-relax);
    for(const side of [-1,1]){
      const handX=side*mix(118+175*reach,24,squeeze),handY=-97-20*reach;
      const elbow=side*(160+105*reach);
      curve([side*110,-111,elbow,-174,elbow,-45,handX,handY],'#c7a77e',43);
      curve([side*110,-117,elbow,-180,elbow,-51,handX,handY-6],'#ffedc6',31);
      oval(handX,handY,36,49,'#f9e6bf',side*mix(.8,.05,squeeze));
      for(let i=0;i<3;i++)line([[handX-15,handY-19+i*13],[handX+12,handY-17+i*13]],'#c8a77c',2);
    }
    if(close>.85&&relax<.1){for(const side of [-1,1])for(let i=0;i<3;i++)line([[side*(57+i*14),-170],[side*(44+i*10),-152]],'#ffe0a0',3);}
  }
  function scene(t){
    const dying=mode==='die',bites=dying?(t>=3.35?3:t>=2.4?2:t>=1.45?1:0):0;
    if(dying)giant(t,bites);
    const wobble=reduced.matches||bites===3?0:Math.sin(time*2.4)*.034+Math.sin(time*4.1)*.012;
    const sway=reduced.matches||bites===3?0:Math.sin(time*2.4)*9;
    const cx=473+sway,cy=416;
    for(let i=0;i<7;i++){const x=cx-143+i*47+(reduced.matches?0:Math.sin(time*3+i)*4);bug(x,482+(x-cx)*wobble,i,time,bites<3);}
    ctx.save();ctx.translate(cx,cy);ctx.rotate(wobble);
    oval(0,11,196,31,'#6f8c89');oval(0,3,199,30,'#e2e6d5');oval(0,-1,177,21,'#a2b6ae');oval(0,-4,167,17,'#faf0d8');
    ctx.beginPath();ctx.ellipse(0,2,189,24,0,0,Math.PI);ctx.strokeStyle='#c6ac71';ctx.lineWidth=3;ctx.stroke();
    if(bites===3){oval(-31,-1,35,7,'#b8686677');for(let i=0;i<8;i++)oval(-90+i*24,-2+Math.sin(i)*5,3+i%3,2,'#c7a575');}
    const squeeze=mode==='hug'?ease((t-.75)/.5)*(1-ease((t-1.8)/.6)):0;
    ctx.save();ctx.scale(1+squeeze*.08,1-squeeze*.12);
    pudding(bites,mode==='attack'?ease((t-.4)/.2)*(1-ease((t-1.55)/.4)):0,squeeze,time);
    if(mode==='attack')spoon(t);
    if(mode==='hug')hugArms(t);
    ctx.restore();ctx.restore();
    if(mode==='attack')for(let i=0;i<3;i++){
      const q=(t-.88-i*.1)/.85;
      if(q>=0&&q<=1){const x=cx-174-q*(250+i*24),y=cy-182-q*106+q*q*219;ctx.save();ctx.translate(x,y);ctx.rotate(-q*7+i);oval(0,0,20-i*3,16-i*2,'#ffedc6');oval(-4,-11+i*2,12-i*2,4,'#b76871');ctx.restore();}
    }
    if(dying&&bites>0&&t<3.8){const phase=(t-1.45)% .95;if(phase<.3){ctx.save();ctx.globalAlpha=1-phase/.3;ctx.fillStyle='#fff0cc';ctx.font='bold 25px Georgia';ctx.textAlign='center';ctx.fillText('MUNCH '+bites,701,166);ctx.restore();}}
    const message=dying?(bites===3?'Gone · three munches. Not a crumb of boss left.':bites===2?'Death · munch 2 / 3':bites===1?'Death · munch 1 / 3':labels.die):mode==='hug'?(t<.75?'Group hug · arms wide open':t<1.8?'Group hug · squiiiiish!':'Group hug · releasing'):labels[mode];
    if(status.textContent!==message)status.textContent=message;
  }
  function select(next){mode=next;age=0;last=null;status.textContent=labels[next];canvas.setAttribute('aria-label',descriptions[next]);buttons.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.mode===next)));}
  function frame(now){
    requestAnimationFrame(frame);if(document.hidden){last=null;return;}const dt=last===null?0:Math.min((now-last)/1000,.05);last=now;age+=dt;if(!reduced.matches)time+=dt;
    if((mode==='attack'&&age>2.2)||(mode==='hug'&&age>2.6))select('idle');
    background();
    const t=reduced.matches?(mode==='idle'?0:mode==='attack'?(age<.85?.55:1.15):mode==='hug'?(age<.75?.6:age<1.8?1.4:2.2):(age<1.45?.75:age<2.4?1.65:age<3.35?2.6:4)):age;
    scene(t);
  }
  buttons.forEach(b=>b.addEventListener('click',()=>select(b.dataset.mode)));
  document.addEventListener('keydown',e=>{if(e.repeat||e.altKey||e.ctrlKey||e.metaKey||e.target.closest('input,textarea,select,button,a,[contenteditable]'))return;const next={i:'idle',a:'attack',' ':'attack',h:'hug',d:'die'}[e.key.toLowerCase()];if(next){e.preventDefault();select(next);}});
  canvas.width=900;canvas.height=562;requestAnimationFrame(frame);
})();
