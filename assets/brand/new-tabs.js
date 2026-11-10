/* GitHub Pages links: keep fragment navigation in place; open real destinations in new tabs.
   This only runs on pages owned by the project, never on github.com README rendering. */
(()=>{"use strict";
function apply(a){
 if(!a||!a.getAttribute)return;
 const raw=(a.getAttribute("href")||"").trim();
 if(!raw||raw[0]==="#"||/^(?:mailto:|tel:|javascript:|data:)/i.test(raw)||a.hasAttribute("download")||a.hasAttribute("data-same-tab"))return;
 a.setAttribute("target","_blank");
 a.setAttribute("rel",Array.from(new Set(((a.getAttribute("rel")||"")+" noopener noreferrer").trim().split(/\s+/))).join(" "));
 if(!a.hasAttribute("title"))a.setAttribute("title","Opens in a new tab");
}
function applyAll(){document.querySelectorAll("a[href]").forEach(apply);}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",applyAll,{once:true});else applyAll();
document.addEventListener("click",event=>{const a=event.target.closest?.("a[href]");if(a)apply(a);},true);
document.addEventListener("focusin",event=>{const a=event.target.closest?.("a[href]");if(a)apply(a);},true);
})();
