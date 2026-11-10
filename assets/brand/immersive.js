/* VISHWAS.EXE: original opt-in workbench and archive controls.
   Existing game logic and museum data remain unchanged. */
(()=>{"use strict";
const power=document.getElementById("vx-monitor-power"),glass=document.getElementById("vx-monitor-glass");
if(power&&glass){power.addEventListener("click",()=>{
 const off=glass.classList.toggle("vx-screen-off");
 power.setAttribute("aria-pressed",String(off));
 power.textContent=off?"◉ POWER ON":"◯ DISPLAY STANDBY";
 const status=document.getElementById("global-status");
 if(status)status.textContent=off?"Monitor in visual standby. Games remain available below.":"Desktop display restored. Programs ready.";
});}
const eraSelect=document.getElementById("era"),catSelect=document.getElementById("category");
const eraButtons=document.querySelectorAll("[data-vx-era]"),folderBox=document.getElementById("vx-folder-buttons");
const status=document.getElementById("vx-foyer-status");
function sync(){
 eraButtons.forEach(button=>button.setAttribute("aria-pressed",String(eraSelect&&button.dataset.vxEra===eraSelect.value)));
 if(folderBox&&catSelect)folderBox.querySelectorAll("button").forEach(button=>button.setAttribute("aria-pressed",String(button.dataset.vxCategory===catSelect.value)));
 if(status&&eraSelect&&catSelect)status.textContent="Viewing "+(eraSelect.selectedOptions[0]?.textContent||"All eras")+" / "+(catSelect.selectedOptions[0]?.textContent||"All collections")+".";
}
if(eraSelect&&catSelect){
 eraButtons.forEach(button=>button.addEventListener("click",()=>{
 eraSelect.value=button.dataset.vxEra;eraSelect.dispatchEvent(new Event("change",{bubbles:true}));sync();
 document.getElementById("archive")?.scrollIntoView({block:"start",behavior:"auto"});
 }));
 if(folderBox){
 const options=Array.from(catSelect.options).filter(option=>option.value!=="all");
 [{value:"all",text:"📁 ALL FOLDERS"},...options.map(option=>({value:option.value,text:option.textContent}))].forEach(option=>{
 const button=document.createElement("button");button.type="button";button.dataset.vxCategory=option.value;
 button.textContent=option.text;button.addEventListener("click",()=>{
 catSelect.value=button.dataset.vxCategory;catSelect.dispatchEvent(new Event("change",{bubbles:true}));sync();
 document.getElementById("archive")?.scrollIntoView({block:"start",behavior:"auto"});
 });folderBox.append(button);
 });
 }
 eraSelect.addEventListener("change",sync);catSelect.addEventListener("change",sync);sync();
}
})();
