import {test,expect} from '@playwright/test';
import {createServer} from 'node:http';
import {readFile,mkdir} from 'node:fs/promises';
import {resolve,extname,sep} from 'node:path';
import {fileURLToPath} from 'node:url';

const root=fileURLToPath(new URL('../../',import.meta.url));
let server,base;
test.setTimeout(75000);

test.beforeAll(async()=>{
 server=createServer(async(req,res)=>{
  try{
   const url=new URL(req.url,'http://localhost');
   const pathname=decodeURIComponent(url.pathname);
   const filename=resolve(root,'.'+(pathname.endsWith('/')?pathname+'index.html':pathname));
   if(!filename.startsWith(resolve(root)+sep)){res.writeHead(403).end();return}
   const data=await readFile(filename);
   const mime={'.html':'text/html','.mjs':'text/javascript','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.json':'application/json','.png':'image/png','.gif':'image/gif','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.ico':'image/x-icon'};
   res.writeHead(200,{'Content-Type':(mime[extname(filename)]||'application/octet-stream'),'Cache-Control':'no-store'}).end(data);
  }catch{res.writeHead(404).end('Not found')}
 });
 await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve)});
 base='http://127.0.0.1:'+server.address().port;
});
test.afterAll(async()=>{if(server)await new Promise(done=>server.close(done))});

const screens=[
 ['Bootdisk','/'],['Overload','/overload/'],['Museum','/museum/'],['Arcade','/arcade/']
];
for(const [name,path] of screens){
 test(name+' desktop and mobile screenshot smoke',async({page})=>{
  const errors=[];
  page.on('pageerror',err=>errors.push(err.message));
  const response=await page.goto(base+path,{waitUntil:'domcontentloaded'});
  expect(response?.status()).toBe(200);
  await expect(page.locator('h1').first()).toBeVisible();
  await mkdir('qa-screenshots',{recursive:true});
  await page.screenshot({path:'qa-screenshots/'+name+'-desktop.png',fullPage:true});
  await page.setViewportSize({width:390,height:844});
  await expect(page.locator('h1').first()).toBeVisible();
  await page.screenshot({path:'qa-screenshots/'+name+'-mobile.png',fullPage:true});
  expect(errors,'Local page exceptions on '+name).toEqual([]);
  const width=await page.evaluate(()=>document.documentElement.scrollWidth);
  expect(width).toBeLessThanOrEqual(398);
 });
}

test('Bootdisk small terminal responds to local commands',async({page})=>{
 await page.goto(base+'/');
 await page.locator('#mini-term-input').fill('whoami');
 await page.locator('#mini-term-form button').click();
 await expect(page.locator('#mini-term-screen')).toContainText('VISHWAS AITHAL');
});

test('Arcade story chapters and simulated terminal remain interactive',async({page})=>{
 await page.goto(base+'/arcade/#chat');
 await page.locator('button[data-prompt="tour"]').click();
 await expect(page.locator('#chat-log')).toContainText('CHAPTER 1');
 await page.locator('button[data-tab="terminal"]').click();
 await page.locator('#term-input').fill('help');
 await page.locator('#term-input').press('Enter');
 await expect(page.locator('#term-output')).toContainText('projects');
 await page.locator('#term-input').press('ArrowUp');
 await expect(page.locator('#term-input')).toHaveValue('help');
});


test('Unified homepage retains studio and afterhours controls',async({page})=>{
 const errors=[];
 page.on('pageerror',err=>errors.push(err.message));
 await page.goto(base+'/');
 await expect(page.locator('body')).toHaveAttribute('data-mode','studio');
 await page.locator('#mode-switch').click();
 await expect(page.locator('body')).toHaveAttribute('data-mode','afterhours');
 await expect(page.locator('#mode-switch')).toHaveAttribute('aria-pressed','true');
 await page.locator('#tone').click();
 await expect(page.locator('body')).toHaveAttribute('data-tone','ice');
 await page.locator('button[data-filter="security"]').click();
 await expect(page.locator('.project:visible')).toHaveCount(3);
 await page.locator('button[data-filter="all"]').click();
 await expect(page.locator('.project:visible')).toHaveCount(6);
 await page.locator('#quick-launch').click();
 await expect(page.locator('#quick-layer')).toHaveClass(/open/);
 await page.locator('#quick-search').fill('Arcade');
 await expect(page.locator('#quick-results a[href="./arcade/"]')).toHaveCount(1);
 await page.keyboard.press('Escape');
 await expect(page.locator('#quick-layer')).not.toHaveClass(/open/);
 await expect(page.locator('#launch-grid a')).toHaveCount(4);
 expect(errors).toEqual([]);
});
test('Unified homepage stays inside mobile viewport and runs the mini terminal',async({page})=>{
 await page.setViewportSize({width:390,height:844});
 await page.goto(base+'/');
 await expect(page.locator('#headline')).toBeVisible();
 await page.locator('#mini-term-input').fill('whoami');
 await page.locator('#mini-term-form button').click();
 await expect(page.locator('#mini-term-screen')).toContainText('VISHWAS AITHAL');
 const width=await page.evaluate(()=>document.documentElement.scrollWidth);
 expect(width).toBeLessThanOrEqual(398);
});

test('Overload physical workstation stays functional',async({page})=>{
 await page.goto(base+'/overload/');
 await expect(page.locator('#vx-monitor-power')).toBeVisible();
 await expect(page.locator('#mine-grid button')).toHaveCount(81);
 await expect(page.locator('.vx-screen-icons a')).toHaveCount(4);
 await page.locator('#vx-monitor-power').click();
 await expect(page.locator('#vx-monitor-glass')).toHaveClass(/vx-screen-off/);
 await page.locator('#vx-monitor-power').click();
 await expect(page.locator('#vx-monitor-glass')).not.toHaveClass(/vx-screen-off/);
 await expect(page.locator('.vx-global-nav a[href="../museum/"]')).toHaveAttribute('target','_blank');
});

test('Museum physical archive controls filter existing records',async({page})=>{
 await page.goto(base+'/museum/');
 await expect(page.locator('#archive .card')).toHaveCount(102);
 await expect(page.locator('#vx-folder-buttons button')).toHaveCount(8);
 await page.locator('[data-vx-era="00s"]').click();
 await expect(page.locator('#era')).toHaveValue('00s');
 const count=await page.locator('#archive .card').count();
 expect(count).toBeGreaterThan(0);
 expect(count).toBeLessThan(102);
 await page.locator('[data-vx-era="all"]').click();
 await expect(page.locator('#archive .card')).toHaveCount(102);
 await page.locator('#vx-folder-buttons button').nth(1).click();
 await expect(page.locator('#category')).not.toHaveValue('all');
});

test('Physical workstation V2 has functional light and focus controls',async({page})=>{
 await page.goto(base+'/overload/');
 const stage=page.locator('.vx-workbench');
 const monitor=page.locator('#vx-monitor-glass');
 await expect(page.locator('.vx-v2-keys i')).toHaveCount(64);
 await page.locator('#vx-ambient-range').fill('40');
 await expect(page.locator('#vx-light-status')).toHaveText('LAMP 40%');
 await page.locator('#vx-lamp-toggle').click();
 await expect(page.locator('#vx-light-status')).toHaveText('LAMP OFF');
 await page.locator('#vx-lamp-toggle').click();
 await expect(page.locator('#vx-light-status')).toHaveText('LAMP 40%');
 await page.locator('#vx-focus-toggle').click();
 await expect(page.locator('body')).toHaveClass(/vx-v2-focus/);
 await page.keyboard.press('Escape');
 await expect(page.locator('body')).not.toHaveClass(/vx-v2-focus/);
 await expect(stage).toBeVisible();
 await expect(monitor).toBeVisible();
 await expect(page.locator('#mine-grid button')).toHaveCount(81);
});

test('Archive cabinet drawers open live century filters',async({page})=>{
 await page.goto(base+'/museum/');
 await expect(page.locator('[data-vx-drawer]')).toHaveCount(4);
 const full=await page.locator('#archive .card').count();
 expect(full).toBe(102);
 await page.locator('[data-vx-drawer="90s"]').click();
 await expect(page.locator('#era')).toHaveValue('90s');
 await expect(page.locator('[data-vx-drawer="90s"]')).toHaveAttribute('aria-pressed','true');
 const nineties=await page.locator('#archive .card').count();
 expect(nineties).toBeGreaterThan(0);
 expect(nineties).toBeLessThan(full);
 await page.locator('#vx-museum-light').click();
 await expect(page.locator('#vx-museum-light')).toHaveAttribute('aria-pressed','false');
 await page.locator('#vx-museum-light').click();
 await expect(page.locator('#vx-museum-light')).toHaveAttribute('aria-pressed','true');
 await page.locator('[data-vx-era="all"]').click();
 await expect(page.locator('#archive .card')).toHaveCount(full);
});

test('UHD workstation keeps project links and controls inside viewport',async({page})=>{
 await page.setViewportSize({width:3840,height:2160});
 await page.goto(base+'/overload/');
 await expect(page.locator('.vx-workbench')).toBeVisible();
 const workstationBounds=await page.locator('.vx-workbench').boundingBox();
 expect(workstationBounds.width).toBeGreaterThan(3000);
 await expect(page.locator('#vx-focus-toggle')).toBeVisible();
 await expect(page.locator('.vx-explorer-list a')).toHaveCount(4);
 await expect(page.locator('.vx-v2-keyboard')).toBeVisible();
 await page.screenshot({path:'qa-screenshots/overload-4k.png',animations:'disabled'});
 await page.goto(base+'/museum/');
 await expect(page.locator('#vx-folder-buttons button')).toHaveCount(8);
 const archiveBounds=await page.locator('.vx-archive-foyer').boundingBox();
 expect(archiveBounds.width).toBeGreaterThan(3000);
 await expect(page.locator('[data-vx-drawer]')).toHaveCount(4);
 await page.screenshot({path:'qa-screenshots/museum-4k.png',animations:'disabled'});
});

test('Retired standalone demo route and home shortcuts are absent',async({page})=>{
 await page.goto(base+'/');
 await expect(page.locator('a[href*="/labs/"]')).toHaveCount(0);
 const oldRoute=await page.goto(base+'/labs/');
 expect(oldRoute.status()).toBe(404);
});

test('Three redesigned README visuals decode as images without missing files',async({page})=>{
 await page.goto(base+'/');
 for(const asset of [
  '/assets/brand/era-boot-sequence.svg',
  '/assets/brand/overload-workbench-cover.svg',
  '/assets/brand/museum-archive-cover.svg'
 ]){
  const result=await page.evaluate(async src=>new Promise(resolve=>{
   const img=new Image();
   img.onload=()=>resolve({ok:true,width:img.naturalWidth,height:img.naturalHeight});
   img.onerror=()=>resolve({ok:false,width:0,height:0});
   img.src=src;
  }),asset);
  expect(result.ok,'Unable to render '+asset).toBe(true);
  expect(result.width).toBeGreaterThan(1000);
  expect(result.height).toBeGreaterThan(200);
  const height=Math.round(1200*result.height/result.width);
  await page.setViewportSize({width:1200,height});
  await page.setContent('<style>html,body{margin:0;background:#10161b}img{display:block;width:1200px;height:auto}</style><img src="'+asset+'" alt="Retro artwork">');
  await page.locator('img').evaluate(img=>img.decode());
  await mkdir('qa-screenshots',{recursive:true});
  await page.screenshot({path:'qa-screenshots/visual-'+asset.split('/').pop().replace('.svg','.png'),animations:'disabled'});
 }
});
