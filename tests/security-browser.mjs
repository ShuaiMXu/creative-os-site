import { chromium } from 'playwright-core';
import { mkdir, readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
const base = process.env.SITE_URL || 'http://127.0.0.1:4212';
const browser = await chromium.launch({channel:'chrome',headless:true});
await mkdir('test-results/security',{recursive:true});
try {
 const page=await browser.newPage();
 await page.goto(base+'/components/?component=minimal-card');
 const frameElement=page.locator('iframe[src*="component=minimal-card"]').last();
 await frameElement.waitFor();
 let frame=await (await frameElement.elementHandle()).contentFrame();
 await frame.waitForSelector('.preview-runtime');
 await frame.waitForFunction(()=>document.querySelector('.preview-runtime')?.children.length>0);
 assert.equal(await frame.evaluate(()=>{try{return !!parent.document}catch{return false}}),false);
 assert.equal(await frame.evaluate(()=>{try{localStorage.getItem('test');return true}catch{return false}}),false);
 const catalog=JSON.parse(await readFile('public/components/cult-ui/catalog.json','utf8'));
 await page.evaluate(()=>{ document.body.innerHTML='<iframe sandbox="allow-scripts" id="security-preview"></iframe>'; });
 frame=await (await page.locator('#security-preview').elementHandle()).contentFrame();
 const errors=[];
 for(const item of catalog.items.filter(x=>x.preview && (!process.env.QUICK || ["minimal-card","pixel-heading-word","bg-image-texture"].includes(x.id)))) {
   await frame.goto(`${base}/components/preview/?component=${item.id}&theme=light&motion=off`);
   try {
     await frame.waitForFunction(()=>{const el=document.querySelector('.preview-runtime');return el?.children.length>0&&!/Loading component/.test(el.textContent)}, null, {timeout:10000});
     const alerts=await frame.locator('[role=alert]').allTextContents();
     if(alerts.length)errors.push({id:item.id,alerts});
   }catch(e){errors.push({id:item.id,error:e.message})}
 }
 console.log(JSON.stringify({sandboxErrors:errors}));
 assert.equal(errors.length,0);
 for(const width of [1468,390]) {
   await page.setViewportSize({width,height:1000});
   await page.goto(base+'/apps/portal/');
   for(const theme of ['dark','light']) {
     await page.evaluate(t=>document.documentElement.dataset.theme=t,theme);
     await page.locator('.section-apps').evaluate(el=>window.scrollTo(0,el.getBoundingClientRect().top+window.scrollY-170));
     const style=await page.locator('.section-apps').evaluate(el=>({radius:getComputedStyle(el).borderRadius,shadow:getComputedStyle(el).boxShadow}));
     assert.equal(style.radius,'0px'); assert.equal(style.shadow,'none');
     await page.screenshot({path:`test-results/security/transition-${width}-${theme}.png`});
   }
 }
} finally {await browser.close()}
