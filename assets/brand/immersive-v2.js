/* VISHWAS.EXE V2: real controls for optional light, focus, cabinet drawers and safe visual depth.
   Does not intercept game keys, change archive data or call network APIs. */
(()=>{"use strict";
const qs=s=>document.querySelector(s);
const body=document.body;
const stage=qs(".vx-workbench");
const ambient=qs("#vx-ambient-range");
const lamp=qs("#vx-lamp-toggle");
const focus=qs("#vx-focus-toggle");
const stageLabel=qs("#vx-light-status");
if(stage){
 let dim=false;
 const applyLight=()=>{
  const value=dim?0:Math.max(.08,Number(ambient?.value||75)/100);
  stage.style.setProperty("--v2-ambient",String(value));
  if(stageLabel)stageLabel.textContent=dim?"LAMP OFF":"LAMP "+Math.round(value*100)+"%";
  if(lamp){lamp.setAttribute("aria-pressed",String(!dim));lamp.textContent=dim?"◉ TURN LAMP ON":"◉ TURN LAMP OFF";}
 };
 ambient?.addEventListener("input",()=>{dim=false;applyLight()});
 lamp?.addEventListener("click",()=>{dim=!dim;applyLight()});
 applyLight();
 const toggleFocus=next=>{
  body.classList.toggle("vx-v2-focus",next);
  if(focus){focus.setAttribute("aria-pressed",String(next));focus.textContent=next?"↙ EXIT FOCUS":"⛶ FOCUS DESKTOP";}
  if(next)focus?.focus();
 };
 focus?.addEventListener("click",()=>toggleFocus(!body.classList.contains("vx-v2-focus")));
 document.addEventListener("keydown",event=>{
  if(event.key==="Escape"&&body.classList.contains("vx-v2-focus"))toggleFocus(false);
 });
 const assembly=qs(".vx-monitor-assembly");
 if(assembly&&!assembly.querySelector(".vx-v2-keyboard")){
  const keyboard=document.createElement("div"),keys=document.createElement("div"),cap=document.createElement("div");
  keyboard.className="vx-v2-keyboard";keyboard.setAttribute("aria-hidden","true");
  keys.className="vx-v2-keys";cap.className="vx-v2-keyboard-caption";
  cap.textContent="VISHWAS / 104 KEY / ORIGINAL HARDWARE STUDY";
  for(let i=0;i<64;i++){const key=document.createElement("i");keys.append(key)}
  keyboard.append(keys,cap);assembly.append(keyboard);
 }
}
const selectors=document.querySelectorAll("[data-vx-drawer]");
const era=qs("#era");
if(selectors.length&&era){
 const sync=()=>selectors.forEach(button=>button.setAttribute("aria-pressed",String(era.value===button.dataset.vxDrawer)));
 selectors.forEach(button=>button.addEventListener("click",()=>{
  era.value=button.dataset.vxDrawer;
  era.dispatchEvent(new Event("change",{bubbles:true}));
  sync();
  qs("#archive")?.scrollIntoView({block:"start",behavior:"auto"});
 }));
 era.addEventListener("change",sync);sync();
}
const museumLamp=qs("#vx-museum-light"),museum=qs(".vx-archive-foyer");
if(museum&&museumLamp){
 let on=true;
 museumLamp.addEventListener("click",()=>{
  on=!on;
  museum.style.setProperty("--v2-ambient",on?".6":"0");
  museumLamp.setAttribute("aria-pressed",String(on));
  museumLamp.textContent=on?"◉ READING LAMP ON":"◯ READING LAMP OFF";
 });
 museum.style.setProperty("--v2-ambient",".6");
}
const noMotion=matchMedia("(prefers-reduced-motion: reduce)").matches;
if(!noMotion&&matchMedia("(hover: hover) and (pointer: fine)").matches){
 for(const surface of [stage,museum]){
  if(!surface)continue;
  let pending=false,last=null;
  surface.addEventListener("pointermove",event=>{
   last=event;if(pending)return;pending=true;
   requestAnimationFrame(()=>{
    pending=false;if(!last)return;
    const b=surface.getBoundingClientRect();
    if(!b.width||!b.height)return;
    const x=Math.min(100,Math.max(0,(last.clientX-b.left)/b.width*100));
    const y=Math.min(100,Math.max(0,(last.clientY-b.top)/b.height*100));
    surface.style.setProperty("--vx-px",x.toFixed(1)+"%");
    surface.style.setProperty("--vx-py",y.toFixed(1)+"%");
    if(surface===stage){
     surface.style.setProperty("--vx-rotate-y",((x-50)/50*.85).toFixed(2)+"deg");
     surface.style.setProperty("--vx-rotate-x",((50-y)/50*.6).toFixed(2)+"deg");
    }
   });
  },{passive:true});
  surface.addEventListener("pointerleave",()=>{
   surface.style.removeProperty("--vx-px");surface.style.removeProperty("--vx-py");
   surface.style.removeProperty("--vx-rotate-y");surface.style.removeProperty("--vx-rotate-x");
  });
 }
}
})();
