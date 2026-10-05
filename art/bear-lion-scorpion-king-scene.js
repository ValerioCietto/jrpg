(() => {
  'use strict';
  const canvas=document.querySelector('#bear-lion-scorpion-king'),ctx=canvas.getContext('2d');
  const buttons=[...document.querySelectorAll('[data-mode]')],status=document.querySelector('#status');
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const labels={idle:'Idle · the ragged sovereign',run:'Run · thundering right to left',sting:'Sting · the royal venom',claw:'Claw · a king’s fury',die:'Death · a terrible miscalculation'};
  let mode='idle',age=0,time=0,last=null;
  const clamp=x=>Math.max(0,Math.min(1,x)),ease=x=>{x=clamp(x);return x*x*(3-2*x);},mix=(a,b,t)=>a+(b-a)*t;
  const oval=(x,y,rx,ry,c,r=0)=>{ctx.beginPath();ctx.ellipse(x,y,rx,ry,r,0,Math.PI*2);ctx.fillStyle=c;ctx.fill();};
  function poly(p,c){ctx.beginPath();ctx.moveTo(...p[0]);p.slice(1).forEach(v=>ctx.lineTo(...v));ctx.closePath();ctx.fillStyle=c;ctx.fill();}
  function line(p,c,w=2){ctx.beginPath();ctx.moveTo(...p[0]);p.slice(1).forEach(v=>ctx.lineTo(...v));ctx.strokeStyle=c;ctx.lineWidth=w;ctx.lineCap='round';ctx.lineJoin='round';ctx.stroke();}
  function background(){
    const g=ctx.createRadialGradient(470,230,20,450,250,550);g.addColorStop(0,'#625448');g.addColorStop(.5,'#2b2b31');g.addColorStop(1,'#11161f');ctx.fillStyle=g;ctx.fillRect(0,0,900,562);
    oval(453,177,117,117,'#c8a27415');oval(453,177,96,96,'#e8b7650c');
    for(let i=0;i<7;i++){const x=50+i*139,h=130+(i*47)%110;poly([[x-24,416],[x-18,h],[x-5,h-14],[x+5,h+7],[x+23,h-2],[x+28,416]],'#171c25');line([[x-9,h+24],[x-5,370]],'#8d785425',3);}
    poly([[0,423],[181,398],[333,422],[546,404],[733,419],[900,400],[900,562],[0,562]],'#343035');
    for(let i=0;i<42;i++){const x=i*139%900,y=430+i*43%123;line([[x,y],[x+19,y-2],[x+33,y+3]],'#b09a7522',1);}
    for(const x of [92,782]){poly([[x-30,435],[x-18,405],[x+4,394],[x+34,429]],'#49413c');line([[x-18,405],[x+4,394],[x+19,421]],'#a78b5c',2);}
  }
  // Tail is a continuous cubic spine. Its death target is on the bear's back.
  function tail(sting,self,t){
    const rest=[[101,-89],[229,-230],[127,-294],[35,-225]];
    const strike=[[101,-89],[230,-253],[-211,-296],[-228,-125]];
    const own=[[101,-89],[224,-256],[22,-278],[9,-157]];
    const points=rest.map((p,i)=>p.map((n,k)=>mix(mix(n,strike[i][k],sting),own[i][k],self)));
    points[2][0]+=Math.sin(t*2)*5*(1-sting)*(1-self);
    const at=u=>[0,1].map(k=>(1-u)**3*points[0][k]+3*(1-u)**2*u*points[1][k]+3*(1-u)*u*u*points[2][k]+u**3*points[3][k]);
    for(let i=0;i<15;i++){const a=at(i/15),b=at((i+1)/15),d=Math.hypot(b[0]-a[0],b[1]-a[1]);ctx.save();ctx.translate(...a);ctx.rotate(Math.atan2(b[1]-a[1],b[0]-a[0]));oval(d/2,0,d*.75,15-i*.58,'#171c20');oval(d/2,-2,d*.64,12-i*.5,i%2?'#7f704c':'#a18a55');line([[2,-9+i*.3],[d*.7,-9+i*.3]],'#dcc17c',2);poly([[d*.2,-9],[d*.45,-23+i*.6],[d*.7,-9]],'#a79460');ctx.restore();}
    const tip=at(1),prev=at(.97);ctx.save();ctx.translate(...tip);ctx.rotate(Math.atan2(tip[1]-prev[1],tip[0]-prev[0]));oval(-6,0,17,12,'#b1aa56');oval(-2,-3,8,5,'#b4e876');poly([[4,-8],[29,0],[4,8],[12,0]],'#d5ed9a');ctx.restore();
  }
  function paw(x,y,near){oval(x-6,y,24,14,near?'#8b6850':'#473d37');for(let i=0;i<4;i++)poly([[x-21+i*9,y+2],[x-25+i*9,y+17],[x-14+i*9,y+8]],'#dac8a4');}
  function leg(x,phase,near,run,swipe){
    const swing=run?Math.sin(phase)*34:0,lift=run?Math.max(0,Math.cos(phase))*29:0;
    const foot=[x+swing-swipe*92,-12-lift-swipe*91],elbow=[x+12-swipe*30,-51-lift*.4];
    line([[x,-92],elbow,foot],'#251f20',37);line([[x,-92],elbow,foot],near?'#75503b':'#45362e',30);paw(...foot,near);
    for(let i=0;i<4;i++)poly([[x-19,-85+i*10],[x-29,-65+i*10],[x-10,-73+i*10]],near?'#866046':'#49382e');
  }
  function head(poison,shock,dead,t,roar){
    ctx.save();ctx.translate(-113,-127);ctx.rotate(roar?-.14:Math.sin(t*1.4)*.015);
    // Layered, torn mane silhouette, with uneven tips and fine fur ridges.
    for(let layer=0;layer<2;layer++){
      const pts=[];for(let i=0;i<48;i++){const a=i/48*Math.PI*2,r=(i%2?64:88+(i*13)%19)-layer*13;pts.push([Math.cos(a)*r,Math.sin(a)*r*1.13]);}poly(pts,layer?'#9c673a':'#362a26');
    }
    for(let i=0;i<29;i++){const a=i/29*Math.PI*2;line([[Math.cos(a)*53,Math.sin(a)*58],[Math.cos(a+.07)*(76+i%4*5),Math.sin(a+.07)*(81+i%3*4)]],i%3?'#cb965345':'#edbd7155',2);}
    oval(-34,-46,18,20,'#b98751');oval(-34,-46,10,12,'#4c3027');oval(29,-45,16,19,'#b98751');
    poly([[-39,-44],[-12,-59],[30,-39],[37,-4],[24,32],[-25,37],[-53,13],[-56,-16]],poison?'#81ae4a':'#c29254');
    poly([[7,-48],[31,-35],[34,8],[22,26],[5,23],[13,-4]],poison?'#608a37':'#9b683e');
    oval(-31,18,29,19,poison?'#b5d470':'#ddbb7d');oval(-3,19,18,17,poison?'#a9ca64':'#d1a667');
    if(dead){for(const x of [-31,7]){line([[x-6,-18],[x+5,-7]],'#292620',3);line([[x+5,-18],[x-6,-7]],'#292620',3);}}
    else if(shock){oval(-31,-14,12,14,'#f5f0d8');oval(-30,-13,4,6,'#202623');oval(8,-12,6,6,'#f5f0d8');oval(9,-12,2,3,'#202623');}
    else{for(const x of [-31,7]){oval(x,-13,10,6,'#33271f');oval(x-2,-13,5,4,'#f2d477');oval(x-3,-13,1.5,4,'#201f1d');}line([[-44,-27],[-21,-21]],'#513b28',5);line([[0,-22],[17,-27]],'#513b28',4);}
    poly([[-34,10],[-15,9],[-24,20]],'#332a28');line([[-24,20],[-23,28],[-35,30]],'#523829',2);
    if(shock){oval(-19,32,7,8,'#463327');}
    else if(roar){oval(-26,33,20,13,'#342127');poly([[-41,26],[-32,27],[-36,42]],'#f2dfb4');poly([[-14,26],[-7,25],[-11,38]],'#f2dfb4');}
    else line([[-23,28],[-8,30]],'#513928',2);
    // Battle scars and a battered crown, partially swallowed by the mane.
    line([[19,-36],[13,-18],[20,-4]],'#e6b982',2);line([[23,-34],[17,-17]],'#674830',1);
    poly([[-44,-58],[-51,-89],[-29,-76],[-18,-104],[-4,-77],[18,-96],[20,-69],[35,-78],[29,-50]],'#332a23');
    poly([[-40,-59],[-45,-81],[-27,-70],[-17,-94],[-5,-69],[14,-86],[14,-65],[29,-70],[24,-55]],'#b99648');line([[-38,-59],[23,-55]],'#e3c979',4);poly([[-13,-67],[-6,-75],[1,-67],[-6,-60]],'#9e392c');ctx.restore();
  }
  function creature(t){
    const dying=mode==='die',run=mode==='run',poison=dying&&t>=1.15,shock=dying&&t>=1.8,dead=dying&&t>=3.8;
    const roll=dying?ease((t-2.55)/1.25):0;
    const self=dying?ease((t-.35)/.6)*(1-.3*ease((t-1.4)/.5)):0;
    const sting=mode==='sting'?ease(t/.5)*(1-ease((t-.8)/.55)):0;
    const swipe=mode==='claw'?Math.sin(clamp(t/1.05)*Math.PI):0;
    const phase=t*11,bob=dead?0:run?Math.sin(phase*2)*5:Math.sin(time*2)*2;
    const x=run&&!reduced.matches?1150-(t*220)%1500:470-swipe*26;
    oval(x,453,183,17,'#0c111777');
    ctx.save();ctx.translate(x,443+bob-76*roll);ctx.scale(1.1,1.1);
    ctx.translate(0,-76);ctx.rotate(-Math.PI*roll);ctx.translate(0,76);
    tail(sting,self,dead?0:time);
    leg(87,phase+Math.PI,false,run,0);leg(-72,phase,false,run,0);
    oval(7,-104,115,66,'#513a2d');oval(-61,-113,66,77,'#6b4931');oval(48,-86,70,52,'#70503b');
    for(let i=0;i<15;i++){const x=-72+i*12,y=-150+Math.abs(x+15)*.2;poly([[x-10,y+8],[x+2,y-20-i%3*5],[x+17,y+12]],i%2?'#74543b':'#8b6543');}
    for(let i=0;i<35;i++){const x=-63+i*47%159,y=-129+i*19%69;line([[x,y],[x+10,y+5],[x+4,y+11]],i%3?'#c38a4833':'#291e2444',2);}
    // Ragged royal mantle and broken shoulder armor.
    poly([[-68,-154],[-10,-152],[35,-108],[74,-84],[61,-57],[45,-65],[40,-44],[21,-61],[6,-45],[-7,-74],[-29,-68],[-49,-113]],'#64373b');
    line([[-61,-150],[-12,-146],[27,-106],[61,-86]],'#c4a35e',3);
    for(let i=0;i<4;i++)line([[-31+i*15,-133+i*9],[-17+i*14,-86+i*6]],'#9d5c5155',2);
    leg(83,phase,true,run,0);leg(-74,phase+Math.PI,true,run,swipe);
    head(poison,shock,dead,dead?0:time,mode==='claw'||mode==='sting');
    if(poison&&!dead){ctx.fillStyle='#c7e978';ctx.font='bold 20px Georgia';ctx.fillText(shock?'O.o':'!',-163,-242);}
    if(mode==='claw'&&t>.3&&t<.8){ctx.globalAlpha=Math.sin((t-.3)/.5*Math.PI);for(let i=0;i<3;i++)line([[-222+i*13,-155],[-260+i*15,-89],[-225+i*14,-49]],'#fff0c6',4);ctx.globalAlpha=1;}
    ctx.restore();
    if(run&&!reduced.matches)for(let i=0;i<9;i++){const q=(t*2+i/9)%1;oval(x+85+q*160,450-q*21,4+q*15,2+q*5,`rgba(185,154,114,${(1-q)*.22})`);}
    if(dying){status.textContent=dead?'Dead · belly up. Click Die to replay.':t>=2.55?'Death · long live the king?':shock?'Death · O.o':poison?'Death · that was definitely venom':t>=.9?'Death · he stings his own back!':labels.die;}
  }
  function select(next){mode=next;age=0;last=null;status.textContent=labels[next];buttons.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.mode===next)));canvas.setAttribute('aria-label',`${labels[next]}. A ragged bear-bodied, lion-headed king with a scorpion tail.${next==='die'?' He stings his own back, turns green, makes an O.o face, and flips onto his back.':''}`);}
  function frame(now){requestAnimationFrame(frame);if(document.hidden){last=null;return;}const dt=last===null?0:Math.min((now-last)/1000,.05);last=now;age+=dt;if(!reduced.matches)time+=dt;if((mode==='claw'&&age>1.2)||(mode==='sting'&&age>1.55))select('idle');background();creature(reduced.matches?({idle:0,run:.1,sting:.6,claw:.5,die:age<1.15?.95:age<1.8?1.3:age<2.8?2:4}[mode]):age);}
  buttons.forEach(b=>b.addEventListener('click',()=>select(b.dataset.mode)));
  document.addEventListener('keydown',e=>{if(e.repeat||e.altKey||e.ctrlKey||e.metaKey||e.target.closest('input,textarea,select,button,a,[contenteditable]'))return;const next={i:'idle',r:'run',s:'sting','2':'sting',a:'claw','1':'claw',' ':'claw',d:'die'}[e.key.toLowerCase()];if(next){e.preventDefault();select(next);}});
  canvas.width=900;canvas.height=562;requestAnimationFrame(frame);
})();
