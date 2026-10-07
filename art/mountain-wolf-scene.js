(() => {
  'use strict';
  const canvas=document.querySelector('#mountain-wolf'),ctx=canvas.getContext('2d');
  const modes=[...document.querySelectorAll('[data-mode]')],outfits=[...document.querySelectorAll('[data-dress]')],status=document.querySelector('#status');
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let mode='idle',dress='tyrol',age=0,time=0,last=null;
  const clamp=x=>Math.max(0,Math.min(1,x)),ease=x=>{x=clamp(x);return x*x*(3-2*x);};
  function oval(x,y,rx,ry,c,r=0){ctx.beginPath();ctx.ellipse(x,y,rx,ry,r,0,Math.PI*2);ctx.fillStyle=c;ctx.fill();}
  function poly(p,c){ctx.beginPath();ctx.moveTo(...p[0]);p.slice(1).forEach(v=>ctx.lineTo(...v));ctx.closePath();ctx.fillStyle=c;ctx.fill();}
  function line(p,c,w=2){ctx.beginPath();ctx.moveTo(...p[0]);p.slice(1).forEach(v=>ctx.lineTo(...v));ctx.strokeStyle=c;ctx.lineWidth=w;ctx.lineCap='round';ctx.lineJoin='round';ctx.stroke();}
  function curve(p,c,w){ctx.beginPath();ctx.moveTo(p[0],p[1]);ctx.bezierCurveTo(...p.slice(2));ctx.strokeStyle=c;ctx.lineWidth=w;ctx.lineCap='round';ctx.stroke();}
  function background(){
    const g=ctx.createLinearGradient(0,0,0,562);g.addColorStop(0,'#283a57');g.addColorStop(.65,'#91afb9');g.addColorStop(1,'#d4dddb');ctx.fillStyle=g;ctx.fillRect(0,0,900,562);
    oval(713,104,33,33,'#f3e8c0aa');
    for(const [x,y,w] of [[120,122,200],[363,73,244],[672,133,201],[875,170,173]]){
      poly([[x-w,431],[x,y],[x+w,433]],'#657f91');poly([[x,y],[x+w,433],[x+24,294]],'#506a82');poly([[x,y],[x-58,y+90],[x-19,y+66],[x+8,y+98],[x+22,y+64],[x+66,y+101]],'#e0e8e7');
    }
    poly([[0,424],[152,397],[346,423],[602,405],[900,417],[900,562],[0,562]],'#d4dfdd');
    poly([[0,510],[290,436],[528,443],[900,496],[900,562],[0,562]],'#b4c9cc');
    for(let i=0;i<18;i++){const x=(i*137)%900,y=452+(i*47)%100;line([[x,y],[x+15,y-3],[x+32,y+1]],'#f4f5e955',2);}
    for(const x of [65,126,802,858]){line([[x,445],[x,317]],'#4f6b73',7);for(let j=0;j<4;j++)poly([[x,305+j*27],[x-19-j*9,351+j*27],[x+19+j*9,351+j*27]],'#486975');}
  }
  function flower(x,y,s=1){for(let i=0;i<6;i++){const a=i*Math.PI/3;oval(x+Math.cos(a)*5*s,y+Math.sin(a)*5*s,4*s,2*s,'#f7edda',a);}oval(x,y,2.5*s,2.5*s,'#e0b96c');}
  function pick(x,y,angle){
    ctx.save();ctx.translate(x,y);ctx.rotate(angle);
    line([[0,21],[0,-58]],'#374d5b',8);line([[-2,18],[-2,-57]],'#9cb0b5',3);
    line([[0,13],[0,-9]],'#694e43',10);for(let i=0;i<5;i++)line([[-4,-7+i*4],[4,-5+i*4]],'#bb9780',1);
    poly([[-7,-66],[13,-66],[30,-58],[47,-38],[30,-47],[10,-53],[-23,-53],[-33,-57],[-33,-65]],'#d5e4e4');
    line([[-29,-64],[12,-64],[29,-57],[45,-39]],'#fff7dc',2);poly([[-4,23],[0,35],[4,23]],'#b7cbd1');
    curve([3,4,24,14,18,39,2,24],'#6d7c83',2);ctx.restore();
  }
  function arm(side,strike,run,t){
    const sx=side*37,sy=-198;
    const phase=t*12+(side<0?0:Math.PI);
    let hx=side*72,hy=-130,angle=side*.23;
    if(run){hx+=Math.sin(phase)*25;hy+=Math.cos(phase)*17;angle+=Math.sin(phase)*.45;}
    if(strike>0){hx=side*62-135*strike;hy=-172+Math.sin(strike*Math.PI)*59;angle=-1.8*strike+side*.3;}
    const elbow=[sx+side*25,-161];
    line([[sx,sy],elbow,[hx,hy]],'#738491',19);line([[sx-2,sy-2],[elbow[0]-2,elbow[1]-2],[hx-2,hy-2]],'#c5d2d4',13);
    oval(sx,sy+5,20,24,'#f3f0e4',-side*.3);line([[sx-15,sy+17],[sx+12,sy+20]],'#c8c9be',3);
    pick(hx,hy,angle);oval(hx,hy,11,10,'#bbc9cf');for(let i=0;i<3;i++)line([[hx-5,hy-4+i*4],[hx+5,hy-3+i*4]],'#758590',1);
  }
  function head(t,run){
    ctx.save();ctx.translate(-3,-248);ctx.rotate(run?.13:Math.sin(t*1.5)*.025);
    poly([[-37,-6],[-44,-60],[-13,-38],[11,-40],[43,-61],[37,-9],[47,10],[33,29],[4,38],[-25,31],[-48,9]],'#b6c5cd');
    poly([[-36,-46],[-30,-19],[-17,-32]],'#ae8f9c');poly([[18,-32],[35,-48],[30,-17]],'#ae8f9c');
    poly([[-37,7],[-53,15],[-39,19],[-46,26],[-28,28],[-26,37],[-5,32]],'#e4e8e2');poly([[30,7],[48,16],[35,21],[42,28],[23,32]],'#e4e8e2');
    poly([[-30,-30],[-12,-43],[0,-37],[13,-45],[29,-27],[12,-30],[2,-17],[-4,-31],[-16,-21]],'#7b8e9e');
    for(const x of [-19,17]){const blink=mode==='idle'&&!reduced.matches&&t%4.5>4.3;if(blink)line([[x-9,-4],[x+9,-4]],'#344b59',2);else{oval(x,-5,11,8,'#d4e3ad',x<0?.13:-.13);oval(x-2,-5,2.5,6,'#344654');oval(x-4,-8,2,2,'#fcf7da');}line([[x-10,-13],[x+8,-12]],'#566b7c',3);}
    oval(-10,16,16,11,'#ecede1');oval(10,16,16,11,'#ecede1');poly([[-6,8],[6,8],[0,16]],'#7a5866');line([[0,16],[0,22],[-7,25]],'#596571',1.5);line([[0,22],[8,24]],'#596571',1.5);
    for(const side of [-1,1])for(let i=0;i<3;i++)line([[side*17,13+i*4],[side*51,8+i*10]],'#e0e8e5',.9);
    // Braided locks and an edelweiss pin echo the outfit without obscuring feline ears.
    for(const side of [-1,1])for(let i=0;i<5;i++)oval(side*(33+i*1.2),23+i*7,7,6,i%2?'#718596':'#91a2af',side*.45);
    line([[-41,56],[-33,56]],dress==='tyrol'?'#b66461':'#5b91b0',4);line([[33,56],[41,56]],dress==='tyrol'?'#b66461':'#5b91b0',4);
    flower(30,-35,1.2);ctx.restore();
  }
  function character(t){
    const fleeing=mode==='die',run=fleeing&&t>1.15,escaped=fleeing&&t>=3.3;
    if(escaped)return;
    const travel=run&&!reduced.matches?Math.pow(t-1.15,1.2)*265:0;
    const x=447+travel,bob=reduced.matches?0:run?Math.sin(t*24)*5:Math.sin(time*2)*2;
    const first=mode==='attack'?Math.sin(clamp((t-.12)/.62)*Math.PI):0;
    const second=mode==='attack'?Math.sin(clamp((t-.48)/.65)*Math.PI):0;
    oval(x,456,92,12,'#34546744');ctx.save();ctx.translate(x-(first+second)*16,447+bob);
    // Long wolf tail and digitigrade legs distinguish the body from a human in costume.
    const wag=reduced.matches?0:Math.sin(time*2.6)*10;
    ctx.beginPath();ctx.moveTo(29,-127);ctx.bezierCurveTo(115,-149,105,-64,153,-78+wag);ctx.bezierCurveTo(149,-16+wag,62,-39,29,-104);ctx.closePath();ctx.fillStyle='#8c9dab';ctx.fill();
    poly([[115,-71+wag],[153,-78+wag],[150,-57+wag],[158,-50+wag],[137,-44+wag],[126,-36+wag],[107,-46+wag]],'#e3e7df');
    for(const side of [-1,1]){
      const phase=t*12+(side<0?0:Math.PI),swing=run?Math.sin(phase)*35:0,lift=run?Math.max(0,Math.cos(phase))*22:0;
      line([[side*23,-91],[side*32+swing*.5,-49],[side*29+swing,-15-lift]],'#92a4ae',20);
      line([[side*31+swing*.5,-51],[side*29+swing,-22-lift]],'#e2e4d8',15);
      oval(side*29+swing+5,-10-lift,23,13,'#4b4b4e');line([[side*29+swing-12,-4-lift],[side*29+swing+23,-4-lift]],'#a4a998',3);
      for(let i=0;i<3;i++)line([[side*29+swing-4,-22+i*4-lift],[side*29+swing+7,-20+i*4-lift]],'#cfb48b',1.5);
    }
    arm(1,second,run,t);
    const tyrol=dress==='tyrol',skirt=tyrol?'#4b6455':'#466c8a',bodice=tyrol?'#7c3941':'#33516d',apron=tyrol?'#b8af91':'#ded6c7';
    oval(0,-205,37,21,'#eaece0');poly([[-32,-205],[-41,-172],[-30,-143],[31,-143],[42,-175],[32,-205],[14,-197],[-13,-197]],bodice);
    poly([[-17,-197],[0,-185],[17,-197],[11,-205],[-10,-205]],'#f5f0df');
    line([[-23,-197],[-19,-152]],'#c9a76e',2);line([[23,-197],[19,-152]],'#c9a76e',2);
    for(let i=0;i<5;i++){const y=-187+i*7;line([[-12,y],[12,y+7],[-12,y+7]],tyrol?'#dec394':'#b6cdd5',1.5);oval(-14,y,2,2,'#d5c49b');oval(14,y,2,2,'#d5c49b');}
    const flutter=run?Math.sin(t*12)*8:Math.sin(time*2)*2;
    poly([[-29,-145],[-48,-116],[-76+flutter,-53],[-43,-43],[0,-47],[43,-43],[76+flutter,-53],[48,-116],[29,-145]],skirt);
    for(let i=-3;i<=3;i++)curve([i*8,-137,i*12,-105,i*20+flutter,-75,i*23+flutter,-51],i%2?'#ffffff18':'#142b3444',5);
    // Tyrol: striped apron with embroidered hem. Bavaria: pale floral apron and blue piping.
    poly([[-22,-140],[-35,-112],[-44+flutter,-60],[0,-55],[44+flutter,-60],[34,-111],[22,-140]],apron);
    if(tyrol){for(let i=-3;i<=3;i++)line([[i*6,-129],[i*12+flutter,-65]],'#6c7d69',2);line([[-40+flutter,-67],[0,-62],[40+flutter,-67]],'#843e47',4);for(let i=-2;i<=2;i++)flower(i*14+flutter,-76,.6);}
    else{for(let row=0;row<3;row++)for(let i=-1;i<=1;i++)flower(i*20+row%2*5,-111+row*18,.65);line([[-41+flutter,-63],[0,-58],[41+flutter,-63]],'#7199b2',3);}
    line([[-30,-143],[30,-143]],tyrol?'#d2b580':'#91b4c7',6);
    poly([[26,-141],[48,-154],[50,-136],[27,-140],[42,-119],[34,-119]],tyrol?'#d2b580':'#8faec4');
    arm(-1,first,run,t);head(time,run);ctx.restore();
    if(mode==='attack')for(const [start,offset] of [[.28,0],[.65,17]]){
      const q=(t-start)/.36;if(q>0&&q<1){ctx.save();ctx.globalAlpha=Math.sin(q*Math.PI);curve([x-97-offset,210,x-195,251,x-165,340,x-65-offset,358],'#f4ffff',5);curve([x-105-offset,220,x-204,260,x-172,334,x-75-offset,346],'#a4dce9',2);ctx.restore();}
    }
    if(fleeing&&t<1.15){
      ctx.fillStyle='#f5f2df';ctx.beginPath();ctx.roundRect(x+57,102,93,58,15);ctx.fill();poly([[x+77,154],[x+59,175],[x+98,157]],'#f5f2df');ctx.fillStyle='#39506a';ctx.font='bold 26px Georgia';ctx.textAlign='center';ctx.fillText('GG',x+104,140);
    }
    if(run&&!reduced.matches)for(let i=0;i<6;i++){const q=(t*2+i/6)%1;oval(x-45-q*100,450-q*14,3+q*9,2+q*4,`rgba(247,248,230,${(1-q)*.6})`);}
  }
  function describe(){canvas.setAttribute('aria-label',`Female cat-headed wolf humanoid wearing the ${dress==='tyrol'?'South Tyrolean-inspired dress':'Bavarian-inspired dirndl'} and holding two ice picks. ${mode==='attack'?'She slashes twice with the picks.':mode==='die'?'She says GG, then runs away to the right.':'She stands upright, breathing and swaying her bushy tail.'}`);}
  function select(next){mode=next;age=0;last=null;modes.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.mode===mode)));describe();}
  function choose(next){dress=next;outfits.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.dress===dress)));describe();}
  function frame(now){requestAnimationFrame(frame);if(document.hidden){last=null;return;}const dt=last===null?0:Math.min((now-last)/1000,.05);last=now;age+=dt;if(!reduced.matches)time+=dt;if(mode==='attack'&&age>1.45)select('idle');background();const t=reduced.matches?(mode==='idle'?0:mode==='attack'?(age<.65?.43:.8):age<1.15?.4:age<3.3?1.8:3.4):age;character(t);const label=mode==='die'?(age<1.15?'GG · good game!':age<3.3?'Retreat · she knows when to leave':'Escaped · choose Idle to bring her back'):mode==='attack'?'Attack · double ice-pick slash':'Idle · watching the pass';if(status.textContent!==label)status.textContent=label;}
  modes.forEach(b=>b.addEventListener('click',()=>select(b.dataset.mode)));outfits.forEach(b=>b.addEventListener('click',()=>choose(b.dataset.dress)));
  document.addEventListener('keydown',e=>{if(e.repeat||e.altKey||e.ctrlKey||e.metaKey||e.target.closest('input,textarea,select,button,a,[contenteditable]'))return;const key=e.key.toLowerCase();if(key==='1'||key==='2'){e.preventDefault();choose(key==='1'?'tyrol':'bavaria');return;}const next={i:'idle',a:'attack',' ':'attack',d:'die'}[key];if(next){e.preventDefault();select(next);}});
  canvas.width=900;canvas.height=562;describe();requestAnimationFrame(frame);
})();
