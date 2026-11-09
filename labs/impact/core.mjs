// Vishwas Aithal ImpactHub. All records are synthetic or locally entered.
export const seedCampaigns=()=>[
 {id:"IH01",title:"Community reading corners",category:"Education",area:"Bengaluru",goal:120,description:"Organize volunteer hours to sort books and create welcoming reading spaces.",skills:["Writing","Teaching"]},
 {id:"IH02",title:"Clean park weekend",category:"Environment",area:"Bengaluru",goal:80,description:"Coordinate local environmental cleanups with a transparent volunteer-hours goal.",skills:["Logistics","Photography"]},
 {id:"IH03",title:"Digital confidence workshops",category:"Digital",area:"Remote",goal:150,description:"Help newcomers navigate basic internet safety and productivity skills.",skills:["Teaching","Technology"]},
 {id:"IH04",title:"Food redistribution coordination",category:"Community",area:"Bengaluru",goal:100,description:"Practice scheduling and inventory coordination using a fictional initiative.",skills:["Logistics","Data"]},
 {id:"IH05",title:"Accessibility review sprint",category:"Digital",area:"Remote",goal:95,description:"Review fictional service pages for keyboard and readability barriers.",skills:["Technology","Writing"]},
 {id:"IH06",title:"Neighbourhood art day",category:"Community",area:"Bengaluru",goal:65,description:"Plan an inclusive community event with volunteer role assignments.",skills:["Photography","Logistics"]}
];
export const categories=["All","Education","Environment","Digital","Community"];
export const skills=["Writing","Teaching","Logistics","Photography","Technology","Data"];
export function createPledge({campaignId,alias,hours},id="P"+Math.random().toString(36).slice(2,9)){
 const h=Number(hours),person=String(alias||"Anonymous").trim();
 if(!/^IH\d{2}$/.test(campaignId))throw Error("Choose a valid campaign.");
 if(!Number.isInteger(h)||h<1||h>40)throw Error("Hours must be a whole number from 1 to 40.");
 if(person.length<2||person.length>40)throw Error("Display name must be 2 to 40 characters.");
 return {id,campaignId,alias:person,hours:h,at:new Date().toISOString()};
}
export function validPledges(input){
 if(!Array.isArray(input))return [];
 return input.filter(p=>p&&typeof p.id==="string"&&/^IH\d{2}$/.test(p.campaignId)&&typeof p.alias==="string"&&Number.isInteger(p.hours)&&p.hours>=1&&p.hours<=40).slice(0,300);
}
export function filterCampaigns(campaigns,{query="",category="All",skill="All"}={}){
 const needle=String(query).trim().toLowerCase();
 return campaigns.filter(c=>(category==="All"||c.category===category)&&
  (skill==="All"||c.skills.includes(skill))&&
  [c.title,c.description,c.area,c.category,...c.skills].join(" ").toLowerCase().includes(needle));
}
export function hoursFor(campaignId,pledges){return pledges.filter(p=>p.campaignId===campaignId).reduce((sum,p)=>sum+p.hours,0);}
export function metrics(campaigns,pledges){
 const pledged=pledges.reduce((sum,p)=>sum+p.hours,0);
 const goal=campaigns.reduce((sum,c)=>sum+c.goal,0);
 return {campaigns:campaigns.length,pledges:pledges.length,hours:pledged,goal,percent:goal?Math.min(100,Math.round(pledged/goal*100)):0};
}
export function exportSafeData(pledges){return {notice:"Local-only demo data. Not NGO registrations or verified volunteering.",generatedAt:new Date().toISOString(),pledges:validPledges(pledges)};}
