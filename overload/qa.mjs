// VISHWAS.EXE: dependency-free, read-only static quality gate.
// Run at repository root: node overload/qa.mjs
import {readFileSync, existsSync} from 'node:fs';
import {resolve, dirname, join} from 'node:path';
import {Script} from 'node:vm';
const root=resolve(import.meta.dirname,'..');
const required={
 'index.html':['launch-grid','theme','tone'],
 'memory/index.html':['windows','start-menu','task-apps'],
 'museum/index.html':['archive','match-grid','quiz-answers'],
 'overload/index.html':['mine-grid','pong','paint','pc-cpu','term-output','defrag','feed-items','bsod'],
 'overload/game-room.html':['space','race','space-start','race-start'],
 'overload/network.html':['net-map','nodes','project-list','details'],
 'overload/capsule.html':['floppies','note','save','export','clear'],
 'overload/tracker.html':['tracker','play','stop','bpm','volume','eq','status']
};
const failures=[],results=[];
function bad(file,reason){failures.push(file+': '+reason)}
for(const [file,expected] of Object.entries(required)){
 const absolute=join(root,file);
 if(!existsSync(absolute)){bad(file,'page does not exist');continue}
 const text=readFileSync(absolute,'utf8');
 if(!/<!doctype html>/i.test(text))bad(file,'HTML doctype missing');
 if(!/<meta\s+charset=/i.test(text))bad(file,'charset missing');
 if(!/name="viewport"/i.test(text))bad(file,'mobile viewport missing');
 if(/[\u2014\u2015]/.test(text))bad(file,'long dash punctuation in public text');
 if(/<script\b[^>]*\bsrc\s*=/.test(text))bad(file,'external script unexpectedly present');
 if(/Build-Journal|nostalgia-karma-dashboard|karma-cloudflare-ops/.test(text))bad(file,'private repository names exposed');
 const before=text.split(/<script\b/i)[0];
 const ids=[...before.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
 for(const id of expected)if(!ids.includes(id))bad(file,'required HTML element missing: '+id);
 for(const id of ids)if(ids.indexOf(id)!==ids.lastIndexOf(id)){bad(file,'duplicate ID: '+id);break}
 const scripts=[...text.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)].map(m=>m[1]);
 if(!scripts.length)bad(file,'inline app code missing');
 scripts.forEach((code,i)=>{try{new Script(code,{filename:file+' #'+i})}catch(e){bad(file,'JavaScript parse failed: '+e.message)}});
 for(const match of text.matchAll(/\bhref="([^"]+)"/g)){
   const href=match[1];
   if(/^(https?:|mailto:|tel:|#|data:)/i.test(href))continue;
   const local=href.split(/[?#]/)[0];if(!local)continue;
   let target=resolve(dirname(absolute),local);
   if(local.endsWith('/'))target=join(target,'index.html');
   if(!target.startsWith(root))bad(file,'link leaves repository: '+href);
   else if(!existsSync(target))bad(file,'missing local destination: '+href);
 }
 results.push(file+' | '+scripts.length+' JS block(s) | '+ids.length+' HTML IDs');
}
const readme=readFileSync(join(root,'README.md'),'utf8');
for(const path of [
 'assets/retro-overload-marquee.svg',
 'overload/',
 'overload/game-room.html',
 'overload/network.html',
 'overload/capsule.html',
 'overload/tracker.html'
])if(!readme.includes(path))bad('README.md','missing launch reference: '+path);
if(!existsSync(join(root,'assets/retro-overload-marquee.svg')))bad('README.md','missing launcher artwork');
if(/Build-Journal|nostalgia-karma-dashboard|karma-cloudflare-ops/.test(readme))bad('README.md','private project name exposed');
console.log('VISHWAS.EXE static quality\n'+results.join('\n'));
if(failures.length){console.error('FAILED:\n'+failures.join('\n'));process.exitCode=1}
else console.log('PASS: eight pages parsed, local links resolved and public-only references checked.');
