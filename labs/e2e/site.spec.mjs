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
 ['Bootdisk','/'],['ProductLab','/labs/'],['ImpactHub','/labs/impact/'],
 ['Commerce','/labs/commerce/'],['Overload','/overload/'],['Museum','/museum/'],['Arcade','/arcade/']
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
  if(['ImpactHub','Commerce','ProductLab'].includes(name)){
   expect(errors,'Local page exceptions on '+name).toEqual([]);
   const width=await page.evaluate(()=>document.documentElement.scrollWidth);
   expect(width).toBeLessThanOrEqual(398);
  }
 });
}

test('ImpactHub stores local sample planning records and supports filters',async({page})=>{
 await page.goto(base+'/labs/impact/');
 await expect(page.locator('#campaign-grid .card')).toHaveCount(6);
 await page.locator('#category').selectOption('Education');
 await expect(page.locator('#campaign-grid .card')).toHaveCount(1);
 await page.locator('#category').selectOption('All');
 await page.locator('#alias').fill('Volunteer A');
 await page.locator('#hours').fill('3');
 await page.locator('#pledge-form button[type=submit]').click();
 await expect(page.locator('#status')).toContainText('Added 3');
 await expect(page.locator('#count-hours')).toHaveText('3');
 await expect(page.locator('#pledge-ledger')).toContainText('Volunteer A');
 await page.reload();
 await expect(page.locator('#count-hours')).toHaveText('3');
});

test('Commerce Sandbox updates stock and issues a demo receipt only',async({page})=>{
 await page.goto(base+'/labs/commerce/');
 await expect(page.locator('#product-grid .card')).toHaveCount(6);
 await page.locator('#product-grid .card').first().getByRole('button',{name:'ADD TO CART'}).click();
 await expect(page.locator('#count-cart')).toHaveText('1');
 page.on('dialog',dialog=>dialog.accept());
 await page.locator('#checkout').click();
 await expect(page.locator('#status')).toContainText('This is not a purchase');
 await expect(page.locator('#count-orders')).toHaveText('1');
 await expect(page.locator('#count-cart')).toHaveText('0');
 await page.reload();
 await expect(page.locator('#count-orders')).toHaveText('1');
});

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
