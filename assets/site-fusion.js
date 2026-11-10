(()=>{
'use strict';
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const body=document.body, modeButton=$('#mode-switch'), modeText=$('#mode-label');
const store={get(k){try{return localStorage.getItem(k)}catch{return null}},set(k,v){try{localStorage.setItem(k,v)}catch{}}};
function setMode(value){const v=value==='afterhours'?'afterhours':'studio';body.dataset.mode=v;modeText.textContent=v==='afterhours'?'AFTER HOURS':'STUDIO MODE';modeButton.setAttribute('aria-pressed',String(v==='afterhours'));modeButton.title=v==='afterhours'?'Switch to studio mode':'Switch to after-hours mode';store.set('vishwas-fusion-mode',v)}
setMode(store.get('vishwas-fusion-mode')||'studio');
modeButton.addEventListener('click',()=>setMode(body.dataset.mode==='studio'?'afterhours':'studio'));
function clock(){const el=$('#pc-clock');if(el)el.textContent=new Date().toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit',hour12:false})}
clock();setInterval(clock,45000);
$$('.filter[data-filter]').forEach(b=>b.addEventListener('click',()=>{const f=b.dataset.filter;$$('.filter[data-filter]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));let n=0;$$('.project[data-kind]').forEach(card=>{const yes=f==='all'||card.dataset.kind.split(' ').includes(f);card.hidden=!yes;if(yes)n++});$('#filter-status').textContent=n+' projects shown'}));
const cmds=[
 ['Selected work','Explore all projects','#work'],['The story','From Windows to now','#story'],['Side quests','Arcade and retro experiences','#sidequests'],['Say hello','Social profiles','#contact'],
 ['Snake and Pinball arcade','Play the arcade','./arcade/'],['Memory OS','Explore the desktop','./memory/'],['Internet Museum','Internet time capsule','./museum/'],['Overload workbench','Play interactive experiments','./overload/'],
 ['GitHub','Browse source repositories','https://github.com/vishwasaithalz'],['LinkedIn','Professional profile','https://www.linkedin.com/in/vishwas-aithal'],['YouTube','Video channel','https://www.youtube.com/@vishwasaithalz']
];
const modal=$('#quick-layer'),search=$('#quick-search'),results=$('#quick-results'),closeBtn=$('#quick-close');let lastFocus=null,visible=cmds;
function render(){const q=search.value.trim().toLowerCase();visible=cmds.filter(i=>(i[0]+' '+i[1]).toLowerCase().includes(q));results.replaceChildren();if(!visible.length){const p=document.createElement('p');p.textContent='No matching shortcuts.';results.append(p)}visible.forEach(i=>{const a=document.createElement('a'),title=document.createElement('span'),sub=document.createElement('small');a.href=i[2];title.textContent=i[0];sub.textContent=i[1]+' ↗';a.append(title,sub);if(i[2].startsWith('https://')){a.target='_blank';a.rel='noopener noreferrer'}a.addEventListener('click',close);results.append(a)})}
function open(){lastFocus=document.activeElement;modal.classList.add('open');modal.setAttribute('aria-hidden','false');search.value='';render();search.focus()}
function close(){modal.classList.remove('open');modal.setAttribute('aria-hidden','true');if(lastFocus?.focus)lastFocus.focus()}
$('#quick-launch').addEventListener('click',open);closeBtn.addEventListener('click',close);search.addEventListener('input',render);
search.addEventListener('keydown',e=>{if(e.key==='Enter'&&visible.length){e.preventDefault();$('#quick-results a')?.click()}});
modal.addEventListener('click',e=>{if(e.target===modal)close()});$$('[data-open-palette]').forEach(b=>b.addEventListener('click',open));
document.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();modal.classList.contains('open')?close():open()}if(e.key==='Escape'&&modal.classList.contains('open'))close()});
const output=$('#mini-term-screen'),inp=$('#mini-term-input'),form=$('#mini-term-form');
const intro='VISHWAS.EXE LOCAL TERMINAL / v2.6\nSTATUS: ONLINE / SAFE SIMULATOR\nTYPE help TO SEE COMMANDS.\n';
output.textContent=intro;const history=[];let cursor=0;
const answers={
 help:'COMMANDS:\nhelp, whoami, projects, memories, links, date, clear\nopen arcade, open museum, open memory, open overload\nmode studio, mode afterhours',
 whoami:'VISHWAS AITHAL\nCurious builder. Windows explorer. Defensive cybersecurity, web experiences, AI automation.\nSTATUS: STILL PRESSING EVERY BUTTON.',
 projects:'PROGRAM FILES:\n01 CYBERPLAYGROUND\n02 LOGSENTRY\n03 RECON LITE\n04 AI AUTOMATION LAB\n05 YINYANGYOHACKERS\n06 MORE ON GITHUB',
 memories:'1990s: Windows desktops\n2000s: Winamp, VLC, PowerISO, Daemon Tools, Counter-Strike, IGI\n2013: YinYangYoHackers Blogspot\nNOW: Still tinkering.',
 links:'GITHUB: github.com/vishwasaithalz\nLINKEDIN: linkedin.com/in/vishwas-aithal\nYOUTUBE: youtube.com/@vishwasaithalz'
};
function run(line){const raw=line.trim();if(!raw)return;const cmd=raw.toLowerCase().replace(/\s+/g,' ');if(['clear','cls'].includes(cmd)){output.textContent=intro;return}let response=answers[cmd];if(cmd==='date')response=new Date().toLocaleString('en-IN',{timeZone:'Asia/Kolkata'});if(cmd==='mode studio'||cmd==='mode afterhours'){setMode(cmd.slice(5));response='DISPLAY MODE: '+body.dataset.mode.toUpperCase()}
const pages={arcade:'./arcade/',museum:'./museum/',memory:'./memory/',overload:'./overload/'};
if(cmd.startsWith('open ')){const target=cmd.slice(5);if(pages[target]){response='LAUNCHING '+target.toUpperCase()+'...';window.location.assign(pages[target])}else if(target==='github'){window.open('https://github.com/vishwasaithalz','_blank','noopener,noreferrer');response='OPENING GITHUB'}}
if(!response)response='COMMAND NOT FOUND. TYPE help';
output.textContent+='\nC:\\VISHWAS> '+raw+'\n'+response+'\n';output.scrollTop=output.scrollHeight;history.push(raw);cursor=history.length}
form.addEventListener('submit',e=>{e.preventDefault();run(inp.value);inp.value='';inp.focus()});
inp.addEventListener('keydown',e=>{if(e.key==='ArrowUp'&&history.length){e.preventDefault();cursor=Math.max(0,cursor-1);inp.value=history[cursor]||''}if(e.key==='ArrowDown'&&history.length){e.preventDefault();cursor=Math.min(history.length,cursor+1);inp.value=history[cursor]||''}});
const desk=$('#desk-scene');if(desk&&!matchMedia('(prefers-reduced-motion: reduce)').matches&&matchMedia('(hover:hover) and (pointer:fine)').matches){desk.addEventListener('pointermove',e=>{const r=desk.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;desk.style.setProperty('--ry',(-x*7).toFixed(2)+'deg');desk.style.setProperty('--rx',(y*5).toFixed(2)+'deg')});desk.addEventListener('pointerleave',()=>{desk.style.setProperty('--ry','0deg');desk.style.setProperty('--rx','0deg')})}
let seq='';document.addEventListener('keydown',e=>{if(e.target instanceof HTMLInputElement||e.ctrlKey||e.metaKey)return;const valid=['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','b','a'];if(!valid.includes(e.key))return;seq=(seq+'|'+e.key).split('|').slice(-10).join('|');if(seq.endsWith('ArrowUp|ArrowUp|ArrowDown|ArrowDown|ArrowLeft|ArrowRight|ArrowLeft|ArrowRight|b|a')){seq='';setMode('afterhours');const toast=$('#easter-egg');if(toast){toast.textContent='CHEAT CODE ACCEPTED. AFTER HOURS UNLOCKED.';toast.hidden=false;setTimeout(()=>toast.hidden=true,4500)}}});
})();