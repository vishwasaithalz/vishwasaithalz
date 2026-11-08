// VISHWAS.EXE shared README-theme drift audit.
// Read-only. Only public GitHub RAW README files are fetched.
// Run: node tools/check_unified_public_theme.mjs
const username='vishwasaithalz';
const projects={
 'YYYH':'yyyh',
 'flagship-api':'flagship-api',
 'recon-lite':'recon-lite',
 'nextjs-boilerplate':'nextjs-boilerplate',
 'LogSentry':'logsentry',
 'CyberPlayground':'cyberplayground',
 'AI-Automation-Lab':'automation-lab',
 'KARMA-Ops-Monitor':'ops-monitor'
};
const failures=[];
async function readPublicReadme(repo){
 const url='https://raw.githubusercontent.com/'+username+'/'+encodeURIComponent(repo)+'/main/README.md';
 for(let attempt=1;attempt<=3;attempt++){
   try{
     const res=await fetch(url,{headers:{'User-Agent':'VISHWAS-EXE-Public-Theme-QA'},signal:AbortSignal.timeout(15000)});
     if(!res.ok)throw Error('HTTP '+res.status);
     return await res.text();
   }catch(e){
     if(attempt===3)throw e;
     await new Promise(resolve=>setTimeout(resolve,attempt*700));
   }
 }
}
for(const [repo,slug] of Object.entries(projects)){
 try{
   const text=await readPublicReadme(repo);
   const banner='https://raw.githubusercontent.com/'+username+'/'+username+'/main/assets/brand/vishwas-exe-'+slug+'.svg';
   const required=[
     'VISHWAS.EXE UNIFIED THEME START',
     banner,
     'Personal index','All projects','Portfolio',
     'Original editorial illustration by Vishwas Aithal'
   ];
   for(const needle of required)if(!text.includes(needle))failures.push(repo+': missing '+needle);
   if(!text.includes('\n## '))failures.push(repo+': technical documentation headings missing');
   if(/[\u2014\u2015]/.test(text))failures.push(repo+': public long dash punctuation found');
   console.log(repo+': editorial header and navigation '+(failures.some(f=>f.startsWith(repo+':'))?'INCOMPLETE':'OK'));
 }catch(e){failures.push(repo+': cannot inspect public README ('+String(e)+')')}
}
if(failures.length){
 console.error('Theme drift or network error:\n'+failures.map(x=>' - '+x).join('\n'));
 process.exitCode=1;
}else console.log('PASS: all eight project READMEs use the same VISHWAS.EXE design system.');
