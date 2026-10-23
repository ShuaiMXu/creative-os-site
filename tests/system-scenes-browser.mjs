import {chromium} from 'playwright-core';
import assert from 'node:assert/strict';
const base=process.env.SITE_URL||'http://127.0.0.1:4212';
const browser=await chromium.launch({channel:'chrome',headless:true});
try {
for(const system of ['happyhands','quartz','lime']) for(const width of [390,1440]) {
 const p=await browser.newPage({viewport:{width,height:900}});const errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.addInitScript(w=>{localStorage.setItem('pd-lang','zh');localStorage.setItem('hh-theme',w===390?'dark':'light');},width);
 await p.goto(`${base}/systems/${system}/`);const scene=p.locator('.system-scenes');await scene.waitFor();
 assert.equal(await p.locator('h1').count(),1);
 await scene.locator('.scene-selector button').nth(1).click();
 await scene.locator('input[type=search]').fill('不存在');await scene.getByRole('status').filter({hasText:'没有匹配'}).waitFor();
 await scene.locator('input[type=search]').fill('');await scene.locator('.scene-list button').nth(1).click();
 await scene.getByRole('button',{name:'标记已处理',exact:true}).click();await scene.getByRole('status').filter({hasText:'示例状态已更新'}).waitFor();
 await scene.locator('.scene-selector button').nth(2).click();await scene.getByRole('button',{name:'保存示例',exact:true}).click();
 assert.equal(await scene.locator('input[aria-invalid=true]').count(),1);await scene.getByLabel('名称',{exact:true}).fill('测试工作空间');await scene.getByRole('button',{name:'保存示例',exact:true}).click();await scene.getByRole('status').filter({hasText:'示例设置已保存'}).waitFor();
 assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await scene.screenshot({path:`test-results/scenes-${system}-${width}.png`});
 if(system!=='happyhands') {const f=p.locator('.foundation-specimen');await f.locator('summary').click();await f.getByRole('button',{name:'深色',exact:true}).click();await f.getByLabel('搜索变量名称').fill('zzzz');await f.getByRole('status').waitFor();await f.getByLabel('搜索变量名称').fill('');assert.ok(await f.locator('dl>div').count()>0);}
 await p.locator('#lang-switch button').count().then(async count=>{if(count) await p.locator('#lang-switch button').click();});
 assert.deepEqual(errors,[]);await p.close();
}
console.log('PASS three systems: mobile/dark + desktop/light, selection/search/state, form validation/save, token search');
} finally {await browser.close();}
