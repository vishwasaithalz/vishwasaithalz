"use strict";
/* KARMA Arcade 3.0 | Original, deterministic pinball physics. No external APIs or telemetry. */
(() => {
  const canvas = document.querySelector("#pinball-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const W = 560, H = 690;
  const scoreElement = document.querySelector("#pinball-score");
  const livesElement = document.querySelector("#pinball-lives");
  const statusElement = document.querySelector("#pinball-status");
  const launchButton = document.querySelector("#pinball-launch");
  const resetButton = document.querySelector("#pinball-reset");
  const pauseButton = document.querySelector("#pinball-pause");
  const buttons = [...document.querySelectorAll("[data-flipper]")];
  const colors = { pink:"#ff73a8", aqua:"#65deff", lime:"#a9ff78", amber:"#ffc55a", purple:"#d8a3ff" };
  const pins = [
    {x:168,y:218,r:28,points:120,color:colors.pink},
    {x:340,y:196,r:28,points:150,color:colors.aqua},
    {x:257,y:328,r:31,points:200,color:colors.lime},
    {x:114,y:407,r:21,points:80,color:colors.amber},
    {x:415,y:403,r:21,points:80,color:colors.purple}
  ];
  let ball, score, lives, state, hold, lastTime=0, accumulator=0, lastBumper=-1, sparks=[];
  const fixedStep = 1/120;
  const gravity=790;
  let launcherCharge=0;
  function resetBall() { ball={x:506,y:585,vx:0,vy:0,r:9,trail:[],live:false};launcherCharge=0; }
  function updateBoardText(){
    scoreElement.textContent=String(score).padStart(5,"0");
    livesElement.textContent=String(lives);
    statusElement.textContent=state.toUpperCase();
    launchButton.textContent=ball.live?"● BALL IN PLAY":"🚀 LAUNCH";
  }
  function reset() { score=0;lives=3;state="ready";hold={left:false,right:false};lastBumper=-1;sparks=[];resetBall();updateBoardText();draw(); }
  function play(){
    if (state==="over") reset();
    if (ball.live) return;
    ball.live=true;ball.vx=-105-Math.random()*75;ball.vy=-980;
    state="playing";updateBoardText();
  }
  function pause(){if (state==="playing")state="paused";else if(state==="paused")state="playing";updateBoardText();draw();}
  function loseBall(){
    lives--;
    if(lives<=0){state="over";resetBall();}
    else {state="ready";resetBall();}
    updateBoardText();
  }
  function normCollision(nx,ny,restitution=0.85){
    const magnitude=Math.hypot(nx,ny)||1;nx/=magnitude;ny/=magnitude;
    const dot=ball.vx*nx+ball.vy*ny;
    if(dot<0){ball.vx-=(1+restitution)*dot*nx;ball.vy-=(1+restitution)*dot*ny;}
  }
  function circleCollision(cx,cy,r,boost=1.08){
    const dx=ball.x-cx,dy=ball.y-cy,dist=Math.hypot(dx,dy)||.001,min=ball.r+r;
    if(dist>=min)return false;
    const nx=dx/dist,ny=dy/dist;
    ball.x=cx+nx*(min+.25);ball.y=cy+ny*(min+.25);
    normCollision(nx,ny,.95);
    ball.vx+=nx*80*boost;ball.vy+=ny*80*boost;
    return true;
  }
  function segmentCollision(ax,ay,bx,by,extra=0,restitution=.82) {
    const vx=bx-ax,vy=by-ay,den=vx*vx+vy*vy;
    const t=Math.max(0,Math.min(1,((ball.x-ax)*vx+(ball.y-ay)*vy)/den));
    const cx=ax+t*vx,cy=ay+t*vy,dx=ball.x-cx,dy=ball.y-cy,dist=Math.hypot(dx,dy)||.001;
    if(dist>ball.r+extra)return false;
    const nx=dx/dist,ny=dy/dist;
    ball.x=cx+nx*(ball.r+extra+.4);ball.y=cy+ny*(ball.r+extra+.4);
    normCollision(nx,ny,restitution);
    return true;
  }
  function flipper(side){
    const left=side==="left";
    const pivotX=left?182:376,pivotY=581;
    const raised=hold[side];
    const angle=left?(raised?-.5:.36):(raised?Math.PI+.5:Math.PI-.36);
    const length=104;
    return {x:pivotX,y:pivotY,x2:pivotX+Math.cos(angle)*length,y2:pivotY+Math.sin(angle)*length,raised};
  }
  function blast(x,y,color){
    for(let i=0;i<9;i++)sparks.push({x,y,vx:(Math.random()-.5)*220,vy:(Math.random()-.5)*220,life:.35,color});
  }
  function step(dt){
    sparks=sparks.filter(s=>s.life>0);
    sparks.forEach(s=>{s.x+=s.vx*dt;s.y+=s.vy*dt;s.life-=dt;});
    if(state!=="playing"||!ball.live)return;
    const speed=Math.hypot(ball.vx,ball.vy);
    if(speed>1350){const k=1350/speed;ball.vx*=k;ball.vy*=k;}
    ball.vy+=gravity*dt;
    ball.x+=ball.vx*dt;ball.y+=ball.vy*dt;
    if(ball.x<ball.r+18){ball.x=ball.r+18;normCollision(1,0);}
    if(ball.x>W-ball.r-17){ball.x=W-ball.r-17;normCollision(-1,0);}
    if(ball.y<ball.r+20){ball.y=ball.r+20;normCollision(0,1);}
    // The triangular slingshots steer the ball toward the flippers.
    segmentCollision(38,470,124,542,4,.9);
    segmentCollision(428,542,522,470,4,.9);
    segmentCollision(38,466,38,536,4);
    segmentCollision(522,466,522,536,4);
    segmentCollision(72,125,147,89,2);
    segmentCollision(399,89,480,125,2);
    pins.forEach((b,i)=>{
      if(circleCollision(b.x,b.y,b.r,1.2)&&lastBumper!==i){
        score+=b.points;lastBumper=i;blast(b.x,b.y,b.color);updateBoardText();
      }
    });
    if(!pins.some(b=>Math.hypot(ball.x-b.x,ball.y-b.y)<b.r+ball.r+6))lastBumper=-1;
    ["left","right"].forEach(side=>{
      const f=flipper(side);
      if(segmentCollision(f.x,f.y,f.x2,f.y2,8,.91)){
        if(f.raised){
          ball.vy=Math.min(ball.vy,-590);
          ball.vx+=(side==="left"?180:-180);
          score+=10;
          updateBoardText();
        }
      }
    });
    // Gravity well is intentionally open at center bottom, between flipper pivots.
    if(ball.y>H+24)loseBall();
    ball.trail.unshift({x:ball.x,y:ball.y});
    if(ball.trail.length>11)ball.trail.pop();
  }
  function draw(){
    const grad=ctx.createLinearGradient(0,0,W,H);
    grad.addColorStop(0,"#1e1744");grad.addColorStop(.54,"#101a3a");grad.addColorStop(1,"#082d3a");
    ctx.fillStyle=grad;ctx.fillRect(0,0,W,H);
    ctx.strokeStyle="#375075";ctx.lineWidth=1;
    for(let x=0;x<W;x+=40){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}
    for(let y=0;y<H;y+=40){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
    ctx.strokeStyle=colors.aqua;ctx.lineWidth=7;ctx.lineJoin="round";
    ctx.beginPath();ctx.moveTo(22,520);ctx.lineTo(22,88);ctx.quadraticCurveTo(22,21,115,21);ctx.lineTo(448,21);ctx.quadraticCurveTo(536,22,538,91);ctx.lineTo(538,517);ctx.stroke();
    ctx.strokeStyle=colors.pink;ctx.lineWidth=8;
    ctx.beginPath();ctx.moveTo(38,470);ctx.lineTo(124,542);ctx.moveTo(522,470);ctx.lineTo(428,542);ctx.stroke();
    ctx.textAlign="center";ctx.font="900 22px monospace";ctx.fillStyle="#ffc55a";ctx.fillText("KARMA PINBALL // 198X",280,70);
    ctx.font="12px monospace";ctx.fillStyle="#c9b7e6";ctx.fillText("LAUNCH  •  BOUNCE  •  COLLECT",280,92);
    pins.forEach(b=>{
      const g=ctx.createRadialGradient(b.x-7,b.y-7,3,b.x,b.y,b.r+8);
      g.addColorStop(0,"#ffffff");g.addColorStop(.25,b.color);g.addColorStop(1,"#18213b");
      ctx.fillStyle=g;ctx.beginPath();ctx.arc(b.x,b.y,b.r,0,Math.PI*2);ctx.fill();
      ctx.strokeStyle=b.color;ctx.lineWidth=3;ctx.stroke();
      ctx.fillStyle="#09122b";ctx.font="900 13px monospace";ctx.fillText("+"+b.points,b.x,b.y+4);
    });
    for(const side of ["left","right"]){const f=flipper(side);ctx.lineWidth=19;ctx.lineCap="round";ctx.strokeStyle=side==="left"?colors.pink:colors.aqua;ctx.beginPath();ctx.moveTo(f.x,f.y);ctx.lineTo(f.x2,f.y2);ctx.stroke();ctx.fillStyle="#fff";ctx.beginPath();ctx.arc(f.x,f.y,11,0,Math.PI*2);ctx.fill();}
    ctx.strokeStyle="#ffd17a";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(480,114);ctx.lineTo(480,623);ctx.stroke();
    ctx.fillStyle="#99fc8c";ctx.font="12px monospace";ctx.fillText("BALL",506,650);
    ball.trail.forEach((t,i)=>{ctx.globalAlpha=(11-i)/31;ctx.fillStyle=colors.yellow;ctx.beginPath();ctx.arc(t.x,t.y,Math.max(2,ball.r-i*.65),0,Math.PI*2);ctx.fill();});
    ctx.globalAlpha=1;ctx.fillStyle="#fff";ctx.shadowColor=colors.yellow;ctx.shadowBlur=18;ctx.beginPath();ctx.arc(ball.x,ball.y,ball.r,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;
    for(const s of sparks){ctx.globalAlpha=Math.max(0,s.life/.35);ctx.fillStyle=s.color;ctx.fillRect(s.x,s.y,5,5);}ctx.globalAlpha=1;
    if(state!=="playing"){
      ctx.fillStyle="#050918c9";ctx.fillRect(95,264,365,117);
      ctx.strokeStyle="#d8a3ff";ctx.lineWidth=2;ctx.strokeRect(95,264,365,117);
      ctx.fillStyle="#ffffff";ctx.font="bold 23px monospace";
      ctx.fillText(state==="over"?"GAME OVER":state==="paused"?"PAUSED":"PRESS LAUNCH",280,311);
      ctx.font="15px monospace";ctx.fillStyle="#a9ff78";ctx.fillText(state==="over"?"RESTART TO TRY AGAIN":"A / D OR LEFT / RIGHT FLIPPERS",280,344);
    }
  }
  function frame(timestamp){
    const dt=lastTime?Math.min((timestamp-lastTime)/1000,.06):0;
    lastTime=timestamp;accumulator+=dt;
    while(accumulator>=fixedStep){step(fixedStep);accumulator-=fixedStep;}
    if(!document.querySelector("#pinball").hidden)draw();
    requestAnimationFrame(frame);
  }
  function setFlip(side,isDown){hold[side]=isDown;draw();}
  document.addEventListener("keydown",event=>{
    if(document.querySelector("#pinball").hidden||event.target.matches("input,textarea"))return;
    const key=event.key.toLowerCase();
    if(key==="arrowleft"||key==="a"){event.preventDefault();setFlip("left",true);}
    if(key==="arrowright"||key==="d"){event.preventDefault();setFlip("right",true);}
    if(key===" "){event.preventDefault();if(!event.repeat)play();}
    if(key==="p"&&!event.repeat)pause();
  });
  document.addEventListener("keyup",event=>{const key=event.key.toLowerCase();if(["a","arrowleft"].includes(key))setFlip("left",false);if(["d","arrowright"].includes(key))setFlip("right",false);});
  buttons.forEach(button=>{
    const side=button.dataset.flipper;
    button.addEventListener("pointerdown",e=>{e.preventDefault();button.setPointerCapture(e.pointerId);setFlip(side,true);});
    for(const name of ["pointerup","pointercancel","lostpointercapture"])button.addEventListener(name,()=>setFlip(side,false));
  });
  launchButton.addEventListener("click",play);
  resetButton.addEventListener("click",reset);
  pauseButton.addEventListener("click",pause);
  document.addEventListener("visibilitychange",()=>{if(document.hidden&&state==="playing"){state="paused";hold.left=false;hold.right=false;updateBoardText();}});
  reset();requestAnimationFrame(frame);
})();