"use strict";
// KARMA.EXE: local-only scripted interactions. No analytics, APIs, user-data storage or code execution.
const $ = (selector) => document.querySelector(selector);
const all = (selector) => [...document.querySelectorAll(selector)];
const tabs = all(".tab");
const panels = all(".panel");
function changeTab(id) {
  for (const tab of tabs) {
    const selected = tab.dataset.tab === id;
    tab.classList.toggle("active", selected);
    tab.setAttribute("aria-selected", String(selected));
  }
  for (const panel of panels) {
    const selected = panel.id === id;
    panel.hidden = !selected;
    panel.classList.toggle("active", selected);
  }
  if (id === "terminal") $("#term-input").focus();
  if (id === "snake") $("#game").focus();
  if (id === "pinball") $("#pinball-canvas").focus();
  if (id === "chat") $("#chat-input").focus();
  if (location.hash !== "#" + id) history.replaceState(null, "", "#" + id);
}
tabs.forEach(tab => tab.addEventListener("click", () => changeTab(tab.dataset.tab)));
const initial = location.hash.slice(1);
if (["chat", "terminal", "snake", "pinball", "roulette"].includes(initial)) changeTab(initial);
window.addEventListener("hashchange", () => {
  const tabId = location.hash.slice(1);
  if (["chat","terminal","snake","pinball","roulette"].includes(tabId)) changeTab(tabId);
});
document.querySelectorAll(".gif-gallery img[data-fallback]").forEach(img => {
  img.addEventListener("error", () => {
    if (img.dataset.didFallback) return;
    img.dataset.didFallback="true";
    img.src=img.dataset.fallback;
  });
});

const topics = [
  {match: /^(2013|history|origin|start|blog|old)/i, text: "2013. The first tech blog was YinYangYoHackers. Curiosity came first, polish arrived much later. The archive is still part of this story. 🌗"},
  {match: /(security|logsentry|cyber|ethical|hacking)/i, text: "Security is the workshop: LogSentry explores imported Windows event data. Recon Lite studies HTTP response headers. Everything here is intended for defensive, authorized learning. 🛡"},
  {match: /(automation|ai|workflow|agent)/i, text: "The Automation Lab builds provider-neutral workflows and deterministic mock examples. The goal is reproducible behavior, not screenshots of impossible magic. 🤖"},
  {match: /(projects|repo|build|work)/i, text: "Pick a door: LogSentry, Recon Lite, AI Automation Lab, CyberPlayground, YinYangYoHackers, or Vishwas Aithal Ops Monitor. Go to the project roulette tab to discover one. 🚀"},
  {match: /(bootdisk|1995|press start|boot)/i, text: "BOOTDISK 1995 is the entry point to this retro computer. PRESS START on the homepage to explore the original desktop, games and engineering workbench. 💾"},
  {match: /(museum|internet|winamp|software)/i, text: "The Internet Museum preserves retro software memories, searchable exhibits and playful browser activities. Open ../museum/ to explore the collection. 📼"},
  {match: /(overload|minesweeper|pong|paint)/i, text: "OVERLOAD 2.0 contains the interactive workbench, Minesweeper, Pong, Paint, a PC builder and local terminal. Open ../overload/ to play. 🖥️"},
  {match: /(karma|psych|name|why)/i, text: "Vishwas Aithal is the creator. PSYCHKARMA / PSYCH / KARMA is part of the creative identity behind these security, automation and web experiments. ✨"},
  {match: /(hello|hi|hey|help)/i, text: "Hey! Try 2013, security, automation, projects or about Vishwas Aithal. This is a local scripted story, not a remote chatbot. 💬"},
  {match: /(music|rap|song)/i, text: "There is a music chapter too, but this little chat focuses on the engineering journey. Explore the linked public projects for code and experiments. 🎧"}
];
function addMessage(who, message) {
  const wrapper = document.createElement("div");
  wrapper.className = "message " + who;
  const by = document.createElement("div");
  by.className = "by";
  by.textContent = who === "bot" ? "VISHWAS AITHAL ARCHIVE" : "YOU";
  const content = document.createElement("div");
  content.textContent = message;
  wrapper.append(by, content);
  $("#chat-log").appendChild(wrapper);
  $("#chat-log").scrollTop = $("#chat-log").scrollHeight;
}
addMessage("bot", "Connection established. 👋 Welcome to a small interactive scrapbook. Ask about 2013, security, automation, or the projects. The replies are scripted, local and private.");
let chatPending = false;
function ask(question) {
  const clean = question.trim().slice(0, 160);
  if (!clean || chatPending) return;
  addMessage("user", clean);
  chatPending = true;
  $("#typing").hidden = false;
  $("#chat-input").disabled = true;
  const found = topics.find(item => item.match.test(clean));
  const reply = found ? found.text : "There are more stories than fit in this little archive. Try 2013, security, projects, automation, or about Vishwas Aithal. Each topic opens a different corner of the workshop. 🧩";
  window.setTimeout(() => {
    addMessage("bot", reply);
    $("#typing").hidden = true;
    $("#chat-input").disabled = false;
    $("#chat-input").focus();
    chatPending = false;
  }, window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 480);
}
$("#chat-form").addEventListener("submit", event => {
  event.preventDefault();
  const input = $("#chat-input");
  const value = input.value;
  input.value = "";
  ask(value);
});
all("[data-prompt]").forEach(button => button.addEventListener("click", () => ask(button.dataset.prompt)));

function termLine(text, kind = "") {
  const line = document.createElement("div");
  if (kind) line.className = kind;
  line.textContent = text;
  $("#term-output").appendChild(line);
  $("#term-output").scrollTop = $("#term-output").scrollHeight;
}
termLine("VISHWAS AITHAL [version 3.0]  |  public, local, read-only", "system");
termLine("Type 'help' for available commands. No shell commands are executed.", "system");
termLine(" ");
const projects = [
  {key:"logsentry",icon:"🛡️",name:"LogSentry",desc:"Defensive analysis of imported Windows security events",url:"https://github.com/vishwasaithalz/LogSentry",type:"SECURITY"},
  {key:"recon-lite",icon:"🔎",name:"Recon Lite",desc:"HTTP response and security-header investigation",url:"https://github.com/vishwasaithalz/recon-lite",type:"SECURITY"},
  {key:"automation",icon:"🤖",name:"AI Automation Lab",desc:"Provider-neutral workflows with local mock mode",url:"https://github.com/vishwasaithalz/AI-Automation-Lab",type:"AUTOMATION"},
  {key:"cyberplayground",icon:"🎮",name:"CyberPlayground",desc:"Safe browser-based security learning labs",url:"https://cyber-playground-nu.vercel.app",type:"LEARNING"},
  {key:"yyyh",icon:"🌗",name:"YinYangYoHackers",desc:"Cybersecurity publishing with roots in 2013",url:"https://yyyh-phi.vercel.app",type:"PUBLISHING"},
  {key:"karma",icon:"🛰️",name:"Vishwas Aithal Ops",desc:"Personal workshop and portfolio operations",url:"https://karma-ops-monitor.vercel.app",type:"OPERATIONS"}
];
function command(value) {
  const clean = value.trim().toLowerCase();
  if (!clean) return;
  termLine("vishwas@github:~$ " + value, "command");
  const parts = clean.split(/\s+/);
  switch(parts[0]) {
    case "help": termLine("help | about | ls | projects | story | status | whoami | date | open [project] | chat | snake | pinball | roulette | gallery | clear"); break;
    case "about": termLine("Vishwas Aithal develops public experiments in defensive security, automation and web engineering."); break;
    case "whoami": termLine("vishwasaithalz | returning technologist | learning by shipping"); break;
    case "ls": termLine("LogSentry/  recon-lite/  AI-Automation-Lab/  CyberPlayground/  YYYH/  KARMA-Ops-Monitor/"); break;
    case "projects": projects.forEach(p => termLine(p.icon + " " + p.name + ": " + p.desc)); break;
    case "story": termLine("2013: the first blog. Now: local security labs, reproducible automation, and public engineering notes.");break;
    case "status": termLine("LOCAL SIMULATION: ACTIVE | NETWORK: NONE | VISITOR LOGGING: OFF | PROJECT SOURCES: PUBLIC"); break;
    case "date": termLine(new Date().toLocaleString()); break;
    case "chat": changeTab("chat");break;
    case "snake": changeTab("snake");break;
    case "roulette": changeTab("roulette");break;
    case "pinball": changeTab("pinball");break;
    case "gallery": document.querySelector("#project-motion")?.scrollIntoView({behavior:"smooth"});break;
    case "clear": $("#term-output").replaceChildren();break;
    case "open": {
      const key = parts.slice(1).join("-").replace(/[^a-z0-9-]/g,"");
      const found = projects.find(p => p.key === key || p.name.toLowerCase().replace(/[^a-z0-9]/g,"") === key.replace(/-/g,""));
      if (!found) termLine("Unknown project. Try 'projects' for available names.", "error");
      else {termLine("Opening verified public project: " + found.name, "system");window.open(found.url,"_blank","noopener,noreferrer");}
      break;
    }
    default: termLine("Command not recognized. Try 'help'. Commands are simulated, never executed.", "error");
  }
}
$("#term-form").addEventListener("submit", e=>{e.preventDefault();const i=$("#term-input");const v=i.value;i.value="";command(v);});
all("[data-command]").forEach(b=>b.addEventListener("click",()=>command(b.dataset.command)));

const canvas=$("#game"),ctx=canvas.getContext("2d");
const cell=16, cols=35, rows=21;
let snake=[],dir={x:1,y:0},nextDir={x:1,y:0},food={x:20,y:10},score=0,best=0,running=false,paused=false,loop=null;
function paint() {
  ctx.fillStyle="#080e23";ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.strokeStyle="#364063";ctx.lineWidth=.5;
  for(let x=0;x<cols;x++){ctx.beginPath();ctx.moveTo(x*cell,0);ctx.lineTo(x*cell,canvas.height);ctx.stroke();}
  for(let y=0;y<rows;y++){ctx.beginPath();ctx.moveTo(0,y*cell);ctx.lineTo(canvas.width,y*cell);ctx.stroke();}
  ctx.fillStyle="#FF73A8";ctx.beginPath();ctx.arc(food.x*cell+8,food.y*cell+8,6,0,Math.PI*2);ctx.fill();
  snake.forEach((s,i)=>{ctx.fillStyle=i===0?"#A9FF78":(i%2?"#65DEFF":"#63BAE2");ctx.fillRect(s.x*cell+1,s.y*cell+1,cell-2,cell-2);});
  if(!running || paused){ctx.fillStyle="#080C20BB";ctx.fillRect(0,0,canvas.width,canvas.height);ctx.textAlign="center";ctx.fillStyle="#FFE48B";ctx.font="bold 29px system-ui";ctx.fillText(!running?"PRESS START TO PLAY":"PAUSED",canvas.width/2,canvas.height/2);ctx.font="14px monospace";ctx.fillStyle="#FFFFFF";ctx.fillText("Arrow keys or WASD to steer",canvas.width/2,canvas.height/2+28);}
}
function spawnFood(){
  const open=[];for(let y=0;y<rows;y++)for(let x=0;x<cols;x++)if(!snake.some(s=>s.x===x&&s.y===y))open.push({x,y});
  if(!open.length){finish("YOU WON");return;}food=open[Math.floor(Math.random()*open.length)];
}
function refreshScores(){ $("#score").textContent=String(score).padStart(3,"0");$("#best").textContent=String(best).padStart(3,"0");}
function finish(text){running=false;paused=false;clearInterval(loop);loop=null;$("#game-status").textContent=text;paint();}
function tick(){
  if(!running||paused)return;
  dir=nextDir;
  const head={x:snake[0].x+dir.x,y:snake[0].y+dir.y};
  const eating=head.x===food.x&&head.y===food.y;
  const body=eating?snake:snake.slice(0,-1);
  if(head.x<0||head.x>=cols||head.y<0||head.y>=rows||body.some(s=>s.x===head.x&&s.y===head.y)){finish("GAME OVER");return;}
  snake.unshift(head);if(eating){score+=10;best=Math.max(score,best);spawnFood();}else snake.pop();
  refreshScores();paint();
}
function startGame(){clearInterval(loop);snake=[{x:9,y:10},{x:8,y:10},{x:7,y:10}];dir={x:1,y:0};nextDir={x:1,y:0};score=0;running=true;paused=false;spawnFood();$("#game-status").textContent="RUNNING";refreshScores();paint();loop=setInterval(tick,125);canvas.focus();}
function steer(key){const v={up:{x:0,y:-1},down:{x:0,y:1},left:{x:-1,y:0},right:{x:1,y:0}}[key];if(!v)return;if(v.x===-dir.x&&v.y===-dir.y)return;nextDir=v;}
$("#start-game").addEventListener("click",startGame);
$("#pause-game").addEventListener("click",()=>{if(!running)return;paused=!paused;$("#game-status").textContent=paused?"PAUSED":"RUNNING";paint();});
all("[data-dir]").forEach(button=>button.addEventListener("click",()=>steer(button.dataset.dir)));
document.addEventListener("keydown",e=>{if($("#snake").hidden||e.target.matches("input,textarea"))return;const map={ArrowUp:"up",ArrowDown:"down",ArrowLeft:"left",ArrowRight:"right",w:"up",s:"down",a:"left",d:"right"};if(map[e.key]){e.preventDefault();steer(map[e.key]);}if(e.key===" "){e.preventDefault();$("#pause-game").click();}});
document.addEventListener("visibilitychange",()=>{if(document.hidden&&running&&!paused){paused=true;$("#game-status").textContent="PAUSED";paint();}});
snake=[{x:9,y:10},{x:8,y:10},{x:7,y:10}];paint();refreshScores();

let previous=-1;
$("#spin").addEventListener("click",()=>{
  let n=Math.floor(Math.random()*projects.length);if(projects.length>1&&n===previous)n=(n+1)%projects.length;previous=n;
  const p=projects[n];$("#roulette-icon").textContent=p.icon;$("#roulette-type").textContent=p.type+" / PUBLIC PROJECT";$("#roulette-name").textContent=p.name;$("#roulette-desc").textContent=p.desc;$("#roulette-link").href=p.url;$("#roulette-link").textContent="EXPLORE "+p.name.toUpperCase()+" ↗";
});
