(() => {
  'use strict';
  const canvas=document.querySelector('#yeti'),ctx=canvas.getContext('2d');
  const buttons=[...document.querySelectorAll('[data-mode]')],status=document.querySelector('#status');
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let mode='idle',age=0,time=0,last=null;
  const clamp=x=>Math.max(0,Math.min(1,x)),ease=x=>{x=clamp(x);return x*x*(3-2*x);},mix=(a,b,t)=>a+(b-a)*t;
  const labels={idle:'Idle · a little light reading',attack:'Make yourself a culture',pen:'harms more the pen than the sword',die:'Disappointed · such uncivilized behaviour'};
  const descriptions={idle:'A refined white-furred yeti stands upright in a tailcoat, waistcoat, top hat and monocle, reading an open book.',attack:'The yeti throws his book to the left: Make yourself a culture.',pen:'The yeti lunges left with a sword shaped like a giant fountain pen: harms more the pen than the sword.',die:'The yeti looks disappointed, gives a clear thumbs-up, then jumps away unharmed.'};
  function oval(x,y,rx,ry,c,r=0){ctx.beginPath();ctx.ellipse(x,y,rx,ry,r,0,Math.PI*2);ctx.fillStyle=c;ctx.fill();}
  function poly(p,c){ctx.beginPath();ctx.moveTo(...p[0]);p.slice(1).forEach(v=>ctx.lineTo(...v));ctx.closePath();ctx.fillStyle=c;ctx.fill();}
  function line(p,c,w=2){ctx.beginPath();ctx.moveTo(...p[0]);p.slice(1).forEach(v=>ctx.lineTo(...v));ctx.strokeStyle=c;ctx.lineWidth=w;ctx.lineCap='round';ctx.lineJoin='round';ctx.stroke();}
  function curve(p,c,w){ctx.beginPath();ctx.moveTo(p[0],p[1]);ctx.bezierCurveTo(...p.slice(2));ctx.strokeStyle=c;ctx.lineWidth=w;ctx.lineCap='round';ctx.stroke();}
  function background(){
    const g=ctx.createLinearGradient(0,0,0,562);g.addColorStop(0,'#27394e');g.addColorStop(.68,'#98b5bd');g.addColorStop(1,'#d8dfd9');ctx.fillStyle=g;ctx.fillRect(0,0,900,562);
    oval(721,94,33,33,'#f1e6c2aa');
    for(const [x,y,w] of [[81,122,166],[311,78,215],[663,139,220],[875,181,138]]){poly([[x-w,425],[x,y],[x+w,426]],'#748e9f');poly([[x,y],[x+32,y+104],[x+w,426],[x+66,409]],'#566f85');poly([[x,y],[x-40,y+78],[x-11,y+59],[x+10,y+88],[x+23,y+55],[x+59,y+91]],'#e7ece5');}
    poly([[0,427],[190,399],[452,426],[666,404],[900,420],[900,562],[0,562]],'#d3dfdf');
    // An old balustrade turns the mountain ledge into a gentleman's reading terrace.
    for(let i=0;i<10;i++){const x=38+i*95;line([[x,358],[x,416]],'#879b9f',13);oval(x,364,12,8,'#afbdba');oval(x,407,12,7,'#9dafb1');}
    line([[0,349],[900,349]],'#657e8d',12);line([[0,343],[900,343]],'#d9e0d7',9);
    poly([[0,488],[298,441],[602,439],[900,479],[900,562],[0,562]],'#b3c5cc');
    for(let i=0;i<25;i++){const x=i*139%900,y=461+i*43%91;line([[x,y],[x+28,y-3]],'#f0f2e988',2);}
  }
  function book(x,y,angle=0,open=true,page=0){
    ctx.save();ctx.translate(x,y);ctx.rotate(angle);
    if(open){
      poly([[-68,-28],[-6,-18],[0,-12],[6,-18],[68,-28],[65,34],[8,42],[0,38],[-8,42],[-65,34]],'#593347');
      poly([[-62,-23],[-10,-16],[0,-9],[0,32],[-11,29],[-60,25]],'#f4e6be');poly([[0,-9],[10,-16],[62,-23],[60,25],[11,29],[0,32]],'#e4d3a8');
      for(let i=0;i<6;i++){line([[-51,-12+i*6],[-13,-5+i*6]],'#aa947166',1);line([[13,-5+i*6],[50,-12+i*6]],'#aa947166',1);}
      line([[0,-9],[0,33]],'#9e7958',2);line([[6,31],[9,52]],'#ac4b4f',5);
      if(page>0){const edge=Math.cos(page*Math.PI)*57;poly([[0,-9],[edge,-24],[edge,23],[0,32]],'#fff0cf');}
    }else{poly([[-48,-32],[43,-32],[48,27],[-43,33]],'#60334a');poly([[-41,-26],[40,-26],[40,26],[-41,29]],'#e8d8b5');poly([[-49,-35],[39,-35],[43,20],[-46,26]],'#754058');line([[-41,-28],[31,-28],[34,13],[-38,19],[-41,-28]],'#c3a061',2);ctx.fillStyle='#eedca9';ctx.textAlign='center';ctx.font='bold 10px Georgia';ctx.fillText('CULTURE',-3,-5);}
    ctx.restore();
  }
  function pen(x,y,angle){
    ctx.save();ctx.translate(x,y);ctx.rotate(angle);
    // Fountain-pen barrel, gold bands, and a split nib form a full-length sword.
    line([[24,0],[-100,0]],'#233544',17);line([[21,-5],[-95,-5]],'#56747d',3);
    for(const px of [15,-26,-92])line([[px,-9],[px,9]],'#d9b76f',4);
    poly([[-103,-14],[-164,-19],[-224,0],[-164,19],[-103,14]],'#e5c37c');poly([[-105,-10],[-164,-14],[-218,0],[-158,0]],'#ffebae');line([[-218,0],[-137,0]],'#79673f',2);oval(-137,0,4,4,'#384a57');
    line([[-31,-26],[-31,26]],'#e0c386',6);oval(28,0,11,10,'#e0c386');ctx.restore();
  }
  function hand(x,y,thumb=false){
    oval(x,y,21,19,'#e6ebe2');for(let i=0;i<3;i++)line([[x-10,y-6+i*7],[x+8,y-4+i*7]],'#a7b8bd',1.5);
    if(thumb){line([[x-12,y-5],[x-15,y-25],[x-12,y-40]],'#9fb2bb',15);line([[x-14,y-7],[x-17,y-25],[x-14,y-40]],'#f3f2e7',11);}
    else oval(x-16,y-5,9,12,'#f0f2e8',-.5);
  }
  function face(disappointed,reading,t){
    ctx.save();ctx.translate(0,-251+(reading?4:0));ctx.rotate(disappointed?-.07:reading?.045:0);
    poly([[-55,-27],[-43,-51],[-19,-60],[17,-60],[44,-45],[56,-17],[52,19],[62,34],[43,36],[40,50],[24,46],[14,59],[-5,51],[-22,56],[-34,43],[-49,45],[-49,29],[-61,23]],'#edf0e7');
    oval(-49,-4,13,20,'#c1d2d6');oval(49,-4,13,20,'#c1d2d6');oval(0,2,43,38,'#a9c1ca');oval(0,18,34,23,'#c7d8d8');
    for(const x of [-20,22]){
      oval(x,-7,10,8,'#f7f5df');oval(x+(reading?-2:0),reading?-4:-7,3,5,'#354f63');
      line([[x-11,disappointed?-12:-21],[x+11,disappointed?-17:-22]],'#f6f4e9',6);
      if(disappointed)line([[x-9,-9],[x+9,-11]],'#7d9ba7',4);
    }
    oval(0,11,15,9,'#7798a8');line([[-14,31],[0,disappointed?25:34],[17,31]],'#6c8796',2.5);
    // The single gold-rimmed monocle and its chain remain attached to the face.
    ctx.strokeStyle='#dabc77';ctx.lineWidth=3;ctx.beginPath();ctx.arc(23,-7,18,0,Math.PI*2);ctx.stroke();curve([40,-4,67,36,34,78,33,106],'#d5bc80',1.5);line([[18,-17],[29,-11]],'#f4f5dfaa',2);
    for(let i=0;i<5;i++)line([[-31+i*14,39],[-26+i*13,48]],'#b5c7cb',1.5);
    oval(0,-53,67,12,'#273541');poly([[-41,-56],[-44,-100],[40,-100],[43,-56]],'#293a48');poly([[-34,-95],[-22,-95],[-23,-61],[-35,-61]],'#455967');line([[-40,-62],[41,-62]],'#73435a',12);line([[-40,-68],[40,-68]],'#bb9e68',2);ctx.restore();
  }
  function character(t){
    const departing=mode==='die',jump=departing?Math.max(0,t-2.05):0;
    if(departing&&t>=3.2)return;
    const thumbs=departing&&t>=.95,reading=mode==='idle';
    const thrust=mode==='pen'?ease((t-.3)/.22)*(1-ease((t-.85)/.55)):0;
    const crouch=departing?ease((t-1.7)/.3)*(1-ease((t-2.05)/.12)):0;
    const x=485-thrust*65+(reduced.matches?0:jump*370),y=451+crouch*20-(reduced.matches?0:jump*520);
    const breathe=reduced.matches?0:Math.sin(time*1.8)*1.7;
    oval(x,460,105*(1-clamp(jump)*.7),13,'#45627a44');
    ctx.save();ctx.translate(x,y+breathe);ctx.rotate(-thrust*.1+(jump?.12:0));
    // Wide shoulders, long arms, large bare furred feet: an unmistakable yeti silhouette.
    for(const side of [-1,1]){const knee=side*37+thrust*(side<0?-38:15);line([[side*31,-108],[knee,-61],[side*48+thrust*(side<0?-40:28),-18]],'#374f62',34);line([[side*30,-101],[knee-4,-59],[side*48+thrust*(side<0?-40:28)-4,-21]],'#617887',3);const foot=side*48+thrust*(side<0?-40:28);oval(foot,-8,33,18,'#dce7e3');for(let i=0;i<3;i++)line([[foot-17+i*13,-5],[foot-20+i*13,1]],'#a7bfc6',2);}
    poly([[-62,-211],[-92,-177],[-78,-117],[-83,-58],[-24,-87],[0,-134],[29,-86],[83,-60],[73,-135],[84,-180],[61,-212]],'#293e50');
    poly([[-38,-223],[36,-223],[52,-177],[33,-116],[-34,-116],[-53,-177]],'#bdac7d');
    poly([[-26,-221],[27,-221],[18,-191],[0,-176],[-20,-195]],'#f1f0df');
    for(let i=0;i<4;i++)oval(1,-174+i*15,3,3,'#675d4f');curve([8,-158,24,-126,39,-137,39,-158],'#ebd29b',2);
    poly([[-38,-224],[-65,-208],[-54,-177],[-38,-185],[-49,-161],[-21,-134],[-22,-190]],'#4d6471');poly([[36,-224],[65,-207],[53,-180],[37,-186],[48,-162],[22,-134],[20,-193]],'#4d6471');
    poly([[-2,-203],[-21,-212],[-20,-191],[0,-198],[21,-211],[21,-190]],'#6d3c54');oval(0,-200,5,6,'#a16b78');
    poly([[43,-180],[61,-181],[51,-194],[45,-184],[41,-193]],'#f1e8cc');
    let left=[-54,-138],right=[57,-136];
    if(mode==='attack'){const wind=ease(t/.28),release=ease((t-.3)/.24);left=[-54+wind*74-release*169,-138-wind*42];right=[58,-145];}
    if(mode==='pen'){left=[-60-thrust*94,-154-thrust*11];right=[78,-140];}
    if(departing){left=[-87,-118];right=thumbs?[94,-199]:[78,-140];}
    for(const [side,p] of [[-1,left],[1,right]]){line([[side*71,-193],[side*91,-158],p],'#30495d',29);line([[side*75,-182],[side*91,-158],p],'#536d7c',4);oval(p[0],p[1]+4,22,14,'#f4f1e2');}
    face(departing&&!thumbs,reading,time);
    if(reading){const phase=reduced.matches?0:time%4;book(-5,-141,-.03,true,phase>3.3?(phase-3.3)/.7:0);hand(-65,-123);hand(57,-126);}
    else if(mode==='attack'){if(t<.54)book(left[0]-10,left[1]-19,-.35,false);hand(...left);hand(...right);}
    else if(mode==='pen'){pen(left[0]-4,left[1],-.06+thrust*.06);hand(...left);hand(...right);}
    else{hand(...left);hand(...right,thumbs);}
    ctx.restore();
    if(mode==='attack'&&t>=.54){const q=(t-.54)/1.1;if(q<1.1)book(376-q*490,270-q*94+q*q*142,-.35-q*7,false);}
    if(mode==='pen'&&t>.42&&t<.83){ctx.save();ctx.globalAlpha=Math.sin((t-.42)/.41*Math.PI);line([[91,284],[257,285]],'#fff5cd',4);line([[129,275],[242,275]],'#d3edf0',2);ctx.restore();}
    if(departing&&jump>0&&!reduced.matches)for(let i=0;i<8;i++){const q=clamp(jump*1.6);oval(485+(i-4)*q*22,459-q*18,3+q*6,2+q*3,`rgba(244,247,231,${1-q})`);}
  }
  function select(next){mode=next;age=0;last=null;buttons.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.mode===next)));canvas.setAttribute('aria-label',descriptions[next]);}
  function frame(now){requestAnimationFrame(frame);if(document.hidden){last=null;return;}const dt=last===null?0:Math.min((now-last)/1000,.05);last=now;age+=dt;if(!reduced.matches)time+=dt;if((mode==='attack'&&age>1.9)||(mode==='pen'&&age>1.55))select('idle');background();const t=reduced.matches?(mode==='idle'?0:mode==='attack'?(age<.54?.3:1):mode==='pen'?.65:age<.95?.3:age<2.05?1.3:age<3.2?2.2:3.3):age;character(t);const label=mode==='die'?(age<.95?labels.die:age<2.05?'A gracious thumbs-up · no hard feelings':age<3.2?'Departure · a gentleman knows when to leave':'Departed unharmed · choose Idle to return'):labels[mode];if(status.textContent!==label)status.textContent=label;}
  buttons.forEach(b=>b.addEventListener('click',()=>select(b.dataset.mode)));
  document.addEventListener('keydown',e=>{if(e.repeat||e.altKey||e.ctrlKey||e.metaKey||e.target.closest('input,textarea,select,button,a,[contenteditable]'))return;const next={i:'idle',a:'attack',' ':'attack',p:'pen',d:'die'}[e.key.toLowerCase()];if(next){e.preventDefault();select(next);}});
  canvas.width=900;canvas.height=562;requestAnimationFrame(frame);
})();
