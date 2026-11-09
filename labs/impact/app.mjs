import {seedCampaigns,createPledge,validPledges,filterCampaigns,hoursFor,metrics,exportSafeData} from "./core.mjs";

const $=id=>document.getElementById(id);
const campaigns=seedCampaigns(),key="vishwas-impacthub-pledges-v1";
const node=(tag,text,className="")=>{const el=document.createElement(tag);if(text!==undefined)el.textContent=String(text);if(className)el.className=className;return el;};
let pledges=[];
try{pledges=validPledges(JSON.parse(localStorage.getItem(key)||"[]"))}catch{pledges=[]}
const notice=message=>{$("status").textContent=message;};
const store=()=>{try{localStorage.setItem(key,JSON.stringify(pledges));return true}catch{notice("Browser storage is unavailable. Export your records to preserve them.");return false}};
const refreshMetrics=()=>{
 const m=metrics(campaigns,pledges);
 $("count-campaigns").textContent=m.campaigns;$("count-pledges").textContent=m.pledges;
 $("count-hours").textContent=m.hours;$("count-percent").textContent=m.percent+"%";
};
function renderBoard(){
 const rows=filterCampaigns(campaigns,{query:$("search").value,category:$("category").value,skill:$("skill").value});
 const grid=$("campaign-grid");grid.replaceChildren();$("board-empty").hidden=rows.length>0;
 for(const campaign of rows){
  const card=node("article",undefined,"card"),kind=node("div",campaign.category.toUpperCase()+" / "+campaign.area.toUpperCase(),"card-meta");
  card.append(kind,node("h3",campaign.title),node("p",campaign.description));
  const tags=node("div");for(const skill of campaign.skills)tags.append(node("span",skill,"chip"));card.append(tags);
  const used=hoursFor(campaign.id,pledges),goal=campaign.goal,percent=Math.min(100,Math.round(used/goal*100));
  card.append(node("p",used+" / "+goal+" sample hours planned"));
  const progress=node("div",undefined,"progress"),fill=node("span");fill.style.width=percent+"%";
  progress.setAttribute("role","progressbar");progress.setAttribute("aria-label",campaign.title+" goal progress");
  progress.setAttribute("aria-valuemin","0");progress.setAttribute("aria-valuemax","100");progress.setAttribute("aria-valuenow",String(percent));
  progress.append(fill);card.append(progress);
  const foot=node("div",undefined,"card-foot");
  foot.append(node("span",String(percent)+"% OF EXAMPLE GOAL","small"));
  const action=node("button","PLAN HOURS");action.type="button";action.className="secondary";
  action.addEventListener("click",()=>{
   $("pledge-campaign").value=campaign.id;$("alias").focus();notice("Selected "+campaign.title+".");
  });
  foot.append(action);card.append(foot);grid.append(card);
 }
}
function renderLedger(){
 const box=$("pledge-ledger");box.replaceChildren();
 if(!pledges.length){box.append(node("p","No local pledges. Choose a sample campaign and add a few hours.","small"));return}
 for(const pledge of pledges.slice().reverse().slice(0,25)){
  const campaign=campaigns.find(c=>c.id===pledge.campaignId);
  const row=node("div",undefined,"entry"),description=node("div");
  description.append(node("strong",pledge.alias),node("div",(campaign?.title??"Unknown demo")+" / "+pledge.hours+" h","small"));
  const remove=node("button","REMOVE");remove.type="button";remove.className="secondary";
  remove.setAttribute("aria-label","Remove "+pledge.alias+" pledge");
  remove.addEventListener("click",()=>{
   pledges=pledges.filter(p=>p.id!==pledge.id);store();render();notice("Local sample pledge removed.");
  });
  row.append(description,remove);box.append(row);
 }
 if(pledges.length>25)box.append(node("p","Showing the 25 most recent pledges. Export JSON to see them all.","small"));
}
function render(){refreshMetrics();renderBoard();renderLedger()}
for(const campaign of campaigns){
 const option=node("option",campaign.title);option.value=campaign.id;$("pledge-campaign").append(option);
}
for(const id of ["search","category","skill"])$(id).addEventListener("input",renderBoard);
$("pledge-form").addEventListener("submit",event=>{
 event.preventDefault();
 try{
  if(pledges.length>=300)throw Error("Maximum 300 local demo pledges. Export and reset before continuing.");
  const pledge=createPledge({campaignId:$("pledge-campaign").value,alias:$("alias").value,hours:$("hours").value});
  pledges=[...pledges,pledge];store();render();event.currentTarget.reset();notice("Added "+pledge.hours+" sample volunteer hours.");
 }catch(error){notice(error.message)}
});
$("export").addEventListener("click",()=>{
 const blob=new Blob([JSON.stringify(exportSafeData(pledges),null,2)],{type:"application/json"}),url=URL.createObjectURL(blob),link=node("a");
 link.href=url;link.download="vishwas-impacthub-planning.json";document.body.append(link);link.click();link.remove();
 setTimeout(()=>URL.revokeObjectURL(url),1000);notice("Local planning ledger exported.");
});
$("reset").addEventListener("click",()=>{
 if(!window.confirm("Reset all sample volunteer pledges saved in this browser? Export first to keep a copy."))return;
 pledges=[];store();render();notice("Demo reset. No external data was changed.");
});
render();
