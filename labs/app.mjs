import {
 priorities,statuses,safeUrl,createTicket,filterTickets,ticketStats,parseStored,addBookmark,
 filterBookmarks,createQuote,pageItems,demoTickets,demoBookmarks,demoQuotes,demoFeed
} from "./core.mjs";

// PRODUCT LAB / Vishwas Aithal. All interactions are local to the visitor's browser.
const $=id=>document.getElementById(id);
const key={tickets:"va-labs-tickets-v1",bookmarks:"va-labs-bookmarks-v1",quotes:"va-labs-quotes-v1"};
const notify=text=>{$("lab-status").textContent=text;};
const item=(tag,className,text)=>{const e=document.createElement(tag);if(className)e.className=className;if(text!==undefined)e.textContent=String(text);return e;};
const button=(label,onClick,style="table-action")=>{const el=item("button",style,label);el.type="button";el.addEventListener("click",onClick);return el;};
function load(name,seed){
 try{const raw=localStorage.getItem(name);return raw===null?seed():parseStored(raw,seed());}
 catch{return seed();}
}
function save(name,value){
 try{localStorage.setItem(name,JSON.stringify(value));return true;}
 catch{notify("Storage unavailable. Your changes might not survive this session.");return false;}
}
function exportData(filename,data){
 const blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"});
 const url=URL.createObjectURL(blob),a=item("a");a.href=url;a.download=filename;
 document.body.append(a);a.click();a.remove();
 window.setTimeout(()=>URL.revokeObjectURL(url),800);
 notify("Exported "+filename+".");
}
function resetData(name,seed,setValue,render){
 if(!window.confirm("Replace this browser's saved records with sample data? Export first to keep a backup."))return;
 const values=seed();setValue(values);save(name,values);render();notify("Local demo data reset.");
}
async function copyValue(value){
 try{if(!navigator.clipboard?.writeText)throw Error("Clipboard unavailable");await navigator.clipboard.writeText(value);notify("Copied to clipboard.");}
 catch{notify("Clipboard access was blocked. You can select and copy the text manually.");}
}

// Navigate the tab list with ArrowLeft, ArrowRight, Home and End.
const tabs=[...document.querySelectorAll("[data-tab]")];
let active="desk";
document.querySelector(".lab-tabs").setAttribute("role","tablist");
function switchTab(which,focus=false){
 if(!tabs.some(t=>t.dataset.tab===which))return;
 active=which;
 tabs.forEach(t=>{
  const yes=t.dataset.tab===which;
  t.classList.toggle("is-active",yes);t.setAttribute("aria-selected",String(yes));
  t.tabIndex=yes?0:-1;
  $("panel-"+t.dataset.tab).hidden=!yes;
 });
 if(focus)tabs.find(t=>t.dataset.tab===which).focus();
 if(which==="feed")renderFeed(true);
}
tabs.forEach((tab,i)=>{
 tab.addEventListener("click",()=>switchTab(tab.dataset.tab));
 tab.addEventListener("keydown",e=>{
  const n=e.key==="ArrowRight"?(i+1)%tabs.length:e.key==="ArrowLeft"?(i-1+tabs.length)%tabs.length:e.key==="Home"?0:e.key==="End"?tabs.length-1:null;
  if(n===null)return;e.preventDefault();switchTab(tabs[n].dataset.tab,true);
 });
});
const requested=new URLSearchParams(location.search).get("tab");
switchTab(tabs.some(t=>t.dataset.tab===requested)?requested:"desk");

// Support queue.
let tickets=load(key.tickets,demoTickets).filter(x=>x&&typeof x.id==="string"&&typeof x.title==="string"&&statuses.includes(x.status));
function renderTickets(){
 const stats=ticketStats(tickets);
 for(const [k,value] of Object.entries(stats))$("metric-"+k).textContent=value;
 const filters={q:$("desk-search").value,status:$("desk-status").value,priority:$("desk-priority").value};
 const visible=filterTickets(tickets,filters),tbody=$("tickets-body");tbody.replaceChildren();
 $("tickets-empty").hidden=visible.length!==0;
 for(const ticket of visible){
  const tr=item("tr"),name=item("td"),title=item("span","ticket-title",ticket.title),id=item("span","ticket-id",ticket.id);
  name.append(title,id);tr.append(name);
  const priority=item("td"),pill=item("span","pill priority-"+String(ticket.priority).toLowerCase(),ticket.priority);
  priority.append(pill);tr.append(priority,item("td","",ticket.owner),item("td","",ticket.status));
  const action=item("td"),next=statuses[(statuses.indexOf(ticket.status)+1)%statuses.length];
  action.append(button("→ "+next,()=>{
   tickets=tickets.map(record=>record.id===ticket.id?{...record,status:next}:record);
   save(key.tickets,tickets);renderTickets();notify("Ticket "+ticket.id+" moved to "+next+".");
  }));tr.append(action);tbody.append(tr);
 }
}
["desk-search","desk-status","desk-priority"].forEach(id=>$(id).addEventListener("input",renderTickets));
$("ticket-form").addEventListener("submit",e=>{
 e.preventDefault();
 try{
  const record=createTicket({title:$("ticket-title").value,priority:$("ticket-priority").value,owner:$("ticket-owner").value});
  tickets=[record,...tickets].slice(0,200);save(key.tickets,tickets);
  e.currentTarget.reset();renderTickets();notify("Ticket "+record.id+" added locally.");
 }catch(error){notify(error.message);}
});
$("desk-export").addEventListener("click",()=>exportData("vishwas-tickets.json",tickets));
$("desk-reset").addEventListener("click",()=>resetData(key.tickets,demoTickets,v=>tickets=v,renderTickets));
renderTickets();

// LinkVault. Each URL is validated and opened with safe rel attributes.
let bookmarks=load(key.bookmarks,demoBookmarks).filter(b=>b&&typeof b.title==="string"&&safeUrl(b.url)&&Array.isArray(b.tags));
function renderBookmarks(){
 const found=filterBookmarks(bookmarks,$("vault-search").value),grid=$("bookmark-grid");grid.replaceChildren();
 $("vault-count").textContent=bookmarks.length+" SAVED";
 $("vault-empty").hidden=found.length!==0;
 for(const b of found){
  const card=item("article","bookmark"),heading=item("h4"),link=item("a","",b.title);
  link.href=safeUrl(b.url);link.target="_blank";link.rel="noopener noreferrer";heading.append(link);card.append(heading);
  card.append(item("div","domain",new URL(b.url).hostname));
  if(b.notes)card.append(item("p","",b.notes));
  const tags=item("div","bookmark-tags");
  (b.tags||[]).forEach(t=>tags.append(item("span","",t)));card.append(tags);
  const actions=item("div","bookmark-actions");
  actions.append(button(b.favorite?"★ Favorite":"☆ Favorite",()=>{
   bookmarks=bookmarks.map(record=>record.id===b.id?{...record,favorite:!record.favorite}:record);
   save(key.bookmarks,bookmarks);renderBookmarks();
  }));
  actions.append(button("Remove",()=>{
   if(!window.confirm("Remove this bookmark from local storage?"))return;
   bookmarks=bookmarks.filter(record=>record.id!==b.id);save(key.bookmarks,bookmarks);renderBookmarks();
  }));
  card.append(actions);grid.append(card);
 }
}
$("vault-search").addEventListener("input",renderBookmarks);
$("bookmark-form").addEventListener("submit",e=>{
 e.preventDefault();
 try{
  const b=addBookmark({title:$("bookmark-title").value,url:$("bookmark-url").value,tags:$("bookmark-tags").value,notes:$("bookmark-notes").value});
  bookmarks=[b,...bookmarks].slice(0,200);save(key.bookmarks,bookmarks);
  e.currentTarget.reset();renderBookmarks();notify("Bookmark saved on this device.");
 }catch(error){notify(error.message);}
});
$("vault-export").addEventListener("click",()=>exportData("vishwas-bookmarks.json",bookmarks));
$("vault-reset").addEventListener("click",()=>resetData(key.bookmarks,demoBookmarks,v=>bookmarks=v,renderBookmarks));
renderBookmarks();

// QuoteAtlas, with original demo lines and user-authored notes.
let quotes=load(key.quotes,demoQuotes).filter(q=>q&&typeof q.text==="string"&&typeof q.author==="string");
let quoteIndex=0;
function selectedQuote(){return quotes[quoteIndex]??null;}
function renderQuotes(){
 if(quoteIndex>=quotes.length)quoteIndex=0;
 const q=selectedQuote();
 $("quote-text").textContent=q?q.text:"Your notebook is empty.";
 $("quote-author").textContent=q?q.author:"Add a quote to begin.";
 $("quote-save").disabled=!q;$("quote-copy").disabled=!q;
 $("quote-save").textContent=q?.saved?"★ Saved":"☆ Save";
 const list=$("quote-saved-list");list.replaceChildren();
 const saved=quotes.filter(x=>x.saved);
 if(!saved.length)list.append(item("p","fine","Nothing saved yet. Save a line from the current selection."));
 for(const record of saved){
  const card=item("div","saved-quote");card.append(item("q","",record.text),item("span","",record.author));
  card.append(button("Remove favorite",()=>{
   quotes=quotes.map(q=>q.id===record.id?{...q,saved:false}:q);
   save(key.quotes,quotes);renderQuotes();
  },"ghost"));list.append(card);
 }
}
$("quote-next").addEventListener("click",()=>{
 if(!quotes.length)return;quoteIndex=(quoteIndex+1)%quotes.length;renderQuotes();
});
$("quote-save").addEventListener("click",()=>{
 const q=selectedQuote();if(!q)return;
 quotes=quotes.map(record=>record.id===q.id?{...record,saved:!record.saved}:record);
 save(key.quotes,quotes);renderQuotes();
});
$("quote-copy").addEventListener("click",()=>{
 const q=selectedQuote();if(q)copyValue('"'+q.text+'" '+q.author);
});
$("quote-form").addEventListener("submit",e=>{
 e.preventDefault();
 try{
  const quote=createQuote($("quote-input").value,$("quote-author-input").value);
  quotes.push(quote);quoteIndex=quotes.length-1;save(key.quotes,quotes);
  e.currentTarget.reset();renderQuotes();notify("Original quote added to this device.");
 }catch(error){notify(error.message);}
});
$("quotes-export").addEventListener("click",()=>exportData("vishwas-saved-quotes.json",quotes.filter(q=>q.saved)));
$("quotes-reset").addEventListener("click",()=>resetData(key.quotes,demoQuotes,v=>{quotes=v;quoteIndex=0;},renderQuotes));
renderQuotes();

// FlowFeed: progressive rendering of a finite local dataset.
const feed=demoFeed();let currentFeed=feed,feedPage=0;
function renderFeed(reset=false){
 if(reset){
  currentFeed=feed.filter(entry=>{
   const query=$("feed-search").value.trim().toLowerCase(),category=$("feed-category").value;
   return (category==="All"||entry.category===category) &&
    (entry.title+" "+entry.category+" "+entry.summary).toLowerCase().includes(query);
  });
  feedPage=0;$("feed-grid").replaceChildren();
 }
 if(active!=="feed")return;
 const batch=pageItems(currentFeed,feedPage,12);
 for(const entry of batch){
  const card=item("article","feed-card");
  card.append(item("span","number","#"+String(entry.id).padStart(3,"0")),
    item("h3","",entry.title),item("p","",entry.summary),item("span","category",entry.category.toUpperCase()));
  $("feed-grid").append(card);
 }
 if(batch.length)feedPage++;
 const count=$("feed-grid").children.length;
 $("feed-progress").textContent=count+" / "+currentFeed.length+" RECORDS";
 $("feed-more").disabled=count>=currentFeed.length;
 $("feed-more").textContent=count>=currentFeed.length?"END OF FEED":"LOAD MORE ↓";
}
["feed-search","feed-category"].forEach(id=>$(id).addEventListener("input",()=>renderFeed(true)));
$("feed-more").addEventListener("click",()=>renderFeed());
if("IntersectionObserver" in window){
 const observer=new IntersectionObserver(entries=>{
  if(entries.some(x=>x.isIntersecting)&&active==="feed"&& !$("feed-more").disabled)renderFeed();
 },{rootMargin:"180px"});
 observer.observe($("feed-sentinel"));
}
