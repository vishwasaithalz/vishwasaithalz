// VISHWAS.EXE Shared Theme and Site Quality Gate
// Dependency-free, read-only. Run: node overload/qa.mjs
import {readFileSync,existsSync} from 'node:fs';
import {resolve,dirname,join,relative} from 'node:path';
import {Script} from 'node:vm';

const root=resolve(import.meta.dirname,'..'),failures=[],results=[];
const required={
 'index.html':['launch-grid','theme','tone'],
 'memory/index.html':['windows','start-menu','task-apps'],
 'museum/index.html':['archive','match-grid','quiz-answers'],
 'arcade/index.html':['chat','terminal','snake','pinball','roulette'],
 'overload/index.html':['mine-grid','pong','paint','pc-cpu','term-output','defrag','feed-items','bsod'],
 'overload/game-room.html':['space','race','space-start','race-start'],
 'overload/network.html':['net-map','nodes','project-list','details'],
 'overload/capsule.html':['floppies','note','save','export','clear'],
 'overload/tracker.html':['tracker','play','stop','bpm','volume','eq','status']
};
const brands=['main','yyyh','flagship-api','recon-lite','nextjs-boilerplate','logsentry','cyberplayground','automation-lab','ops-monitor'];
const err=(file,reason)=>failures.push(file+': '+reason);
function toFile(from,target){
  const base=target.split(/[?#]/)[0];
  let resolved=resolve(dirname(join(root,from)),base);
  if(base.endsWith('/'))resolved=join(resolved,'index.html');
  if(!resolved.startsWith(root+'/')){err(from,'path escapes checkout: '+target);return null}
  return resolved;
}
function checkScript(code,file,label){
 try{new Script(code,{filename:file+':'+label})}
 catch(error){err(file,'JavaScript syntax ('+label+'): '+error.message)}
}
for(const [file,expected] of Object.entries(required)){
 const absolute=join(root,file);
 if(!existsSync(absolute)){err(file,'missing HTML page');continue}
 const html=readFileSync(absolute,'utf8');
 if(!/<!doctype html>/i.test(html))err(file,'missing HTML doctype');
 if(!/<meta\s+charset=/i.test(html))err(file,'missing character set');
 if(!/name="viewport"/i.test(html))err(file,'missing mobile viewport');
 if(/[\u2013\u2014\u2015]/.test(html))err(file,'long dash in public page');
 const textSurface=html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,'').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi,'').replace(/<!--[\s\S]*?-->/g,'').replace(/<[^>]+>/g,' ');
 if(/\s-\s/.test(textSurface))err(file,'visible spaced dash in public page');
 if(!html.includes('assets/brand/new-tabs.js'))err(file,'new tab navigation script missing');
 if(/Build-Journal|nostalgia-karma-dashboard|karma-cloudflare-ops/.test(html))err(file,'private repository name in public page');
 if(!html.includes('class="vx-global-nav"'))err(file,'shared top navigation missing');
 if(!html.includes('class="vx-universe"')&&!/class="[^"]*\bvx-universe\b/.test(html))err(file,'shared body theme missing');
 if(!html.includes('assets/brand/retro-shell.css'))err(file,'shared CSS missing');
 if(!html.includes('assets/brand/favicon.svg'))err(file,'shared favicon missing');
 if(!html.includes('name="theme-color" content="#0b1b30"'))err(file,'shared browser theme color missing');
 const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
 for(const id of expected)if(!ids.includes(id))err(file,'missing interactive element: '+id);
 const duplicated=ids.filter((id,i)=>ids.indexOf(id)!==i);
 if(duplicated.length)err(file,'duplicate IDs: '+[...new Set(duplicated)].join(', '));
 const scripts=[...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)];
 if(!scripts.length)err(file,'missing JavaScript');
 for(let i=0;i<scripts.length;i++){
   const [_,attrs,body]=scripts[i];
   const src=attrs.match(/\bsrc="([^"]+)"/)?.[1];
   if(src){
     if(/^(https?:)?\/\//i.test(src)){err(file,'remote JS dependency: '+src);continue}
     const target=toFile(file,src);
     if(!target||!existsSync(target)){err(file,'local script missing: '+src);continue}
     checkScript(readFileSync(target,'utf8'),file,src);
   }else checkScript(body,file,'inline '+(i+1));
 }
 for(const match of html.matchAll(/\b(?:href|src)="([^"]+)"/g)){
   const target=match[1];
   if(/^(https?:|mailto:|tel:|#|data:|javascript:)/i.test(target))continue;
   if(!target.split(/[?#]/)[0])continue;
   const abs=toFile(file,target);
   if(abs&&!existsSync(abs))err(file,'broken local resource link: '+target);
 }
 if((html.match(/aria-current="page"/g)||[]).length!==1)err(file,'expected exactly one highlighted shared navigation entry');
 results.push(file+': shared shell, local links, scripts and interactive IDs inspected');
}
const cssPath=join(root,'assets/brand/retro-shell.css');
if(!existsSync(cssPath))err('theme','central stylesheet missing');
else{
 const css=readFileSync(cssPath,'utf8');
 for(const expected of ['--vx-navy','--vx-mint','--vx-amber','.vx-global-nav','prefers-reduced-motion'])
   if(!css.includes(expected))err('theme','missing shared token or rule: '+expected);
}
for(const slug of brands){
 const path='assets/brand/vishwas-exe-'+slug+'.svg',absolute=join(root,path);
 if(!existsSync(absolute)){err(path,'matching banner missing');continue}
 const svg=readFileSync(absolute,'utf8');
 if(!svg.includes('<svg ')||!svg.includes('</svg>'))err(path,'malformed SVG envelope');
 if(!svg.includes('VISHWAS.EXE'))err(path,'unified identity missing');
 if(!svg.includes('prefers-reduced-motion'))err(path,'reduced-motion fallback missing');
}
const faviconPath=join(root,'assets/brand/favicon.svg');
if(!existsSync(faviconPath))err('theme','favicon asset missing');
const arcadeStyle=join(root,'arcade/styles.css');
if(!existsSync(arcadeStyle))err('theme','arcade stylesheet missing');
else{
 const arcadeCss=readFileSync(arcadeStyle,'utf8');
 for(const token of ['--bg:#0b1b30','--lime:#aaf0c8','--yellow:#f6d08b'])
  if(!arcadeCss.includes(token))err('arcade','palette drift: '+token);
}
const readme=readFileSync(join(root,'README.md'),'utf8');
if(/[\u2013\u2014\u2015]| - /.test(readme))err('README.md','visible dash punctuation');
if(/\/labs\//.test(readme))err('README.md','retired standalone demo link present');
for(const key of ['assets/brand/overload-workbench-cover.svg','assets/brand/museum-archive-cover.svg']){
 if(!readme.includes(key)||!existsSync(join(root,key)))err('README.md','immersive cover missing: '+key);
}
for(const asset of ['assets/brand/new-tabs.js','assets/brand/immersive.js']){
 const abs=join(root,asset);
 if(!existsSync(abs))err(asset,'missing program');
 else checkScript(readFileSync(abs,'utf8'),asset,'standalone');
}
const immersiveStyle=join(root,'assets/brand/immersive.css');
if(!existsSync(immersiveStyle))err('immersive.css','missing original UI stylesheet');
else for(const token of ['.vx-workbench','.vx-archive-foyer','prefers-reduced-motion'])if(!readFileSync(immersiveStyle,'utf8').includes(token))err('immersive.css','missing '+token);

const heroCandidates=['assets/brand/vishwas-exe-main.svg','assets/brand/afterhours-cybercafe.svg'];
const activeHero=heroCandidates.find(name=>readme.includes(name));
if(!activeHero)err('README.md','missing visible approved original hero asset');
else{
 const asset=join(root,activeHero),art=existsSync(asset)?readFileSync(asset,'utf8'):'';
 if(!art.includes('<svg ')||!art.includes('</svg>'))err(activeHero,'missing or malformed SVG envelope');
 if(!art.includes('VISHWAS')||!art.includes('Aithal'))err(activeHero,'personal identity missing');
 if(!art.includes('prefers-reduced-motion'))err(activeHero,'motion fallback missing');
 if(/<script\b|\bonload\s*=|\bonerror\s*=|\b(?:href|src)\s*=\s*["']https?:|url\(\s*["']?https?:/i.test(art))err(activeHero,'unsafe external or executable SVG content');
}
for(const needed of ['overload/','overload/game-room.html','overload/network.html','overload/capsule.html','overload/tracker.html'])
 if(!readme.includes(needed))err('README.md','required public link missing: '+needed);
if(/Build-Journal|nostalgia-karma-dashboard|karma-cloudflare-ops/.test(readme))err('README.md','private repository name disclosed');
if(/[\u2014\u2015]/.test(readme))err('README.md','visible long dash found');
console.log('VISHWAS.EXE UNIFIED THEME QUALITY CHECK\n'+results.join('\n'));
console.log('Shared assets: '+brands.length+' custom project banners and one canonical CSS file');
if(failures.length){
 console.error('\nFAILED:\n'+failures.map(x=>' - '+x).join('\n'));
 process.exitCode=1;
}else console.log('\nPASS: '+Object.keys(required).length+' interactive pages, nine matching banners, shared CSS and public-only links checked.');
