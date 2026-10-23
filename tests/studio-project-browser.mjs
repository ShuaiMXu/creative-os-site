import { chromium } from 'playwright-core';
import assert from 'node:assert/strict';
import { mkdir, readFile } from 'node:fs/promises';
const base = process.env.STUDIO_URL || 'http://127.0.0.1:4250/apps/studio/';
const output = process.env.EVIDENCE_DIR || '/private/tmp/issue22-studio';
await mkdir(output, {recursive:true});
const browser = await chromium.launch({channel:process.env.BROWSER_CHANNEL || 'chrome',headless:true});
try {
 for (const width of [1440,390]) {
  const context = await browser.newContext({viewport:{width,height:900},acceptDownloads:true,permissions:['clipboard-read','clipboard-write']});
  await context.addInitScript(() => localStorage.setItem("pd-lang", "en"));
  const page = await context.newPage();
  page.setDefaultTimeout(15000);
  const errors=[]; page.on('pageerror', e=>errors.push(e.message));
  page.on('dialog', async dialog=>{errors.push('Unexpected native dialog');await dialog.dismiss();});
  await page.goto(`${base}?project=baseline&lang=en`);
  const trigger=page.getByRole('button',{name:'New project',exact:true});
  await trigger.click();
  const input=page.getByLabel('Project ID',{exact:true});
  await input.fill('bad id'); await input.press('Enter');
  await page.getByRole('alert').filter({hasText:'Use 1–80'}).waitFor();
  await input.fill('baseline'); await input.press('Enter');
  await page.getByRole('alert').filter({hasText:'already exists'}).waitFor();
  await input.press('Escape');
  assert(await trigger.evaluate(el=>el===document.activeElement));
  await trigger.click(); await input.fill(`acceptance-${width}`);
  await page.screenshot({path:`${output}/project-${width}.png`});
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  await input.press('Enter');
  await page.waitForFunction(id=>new URL(location.href).searchParams.get('project')===id,`acceptance-${width}`);
  await page.waitForFunction(id=>!!localStorage.getItem(`hh-studio:${id}`),`acceptance-${width}`);
  await page.reload();
  assert.equal(await page.getByLabel('Choose project',{exact:true}).inputValue(),`acceptance-${width}`);
  await page.getByRole('button',{name:'Export',exact:true}).click();
  const code=await page.locator('.utility-panel pre').textContent();
  const downloadEvent=page.waitForEvent('download');
  await page.getByRole('button',{name:'Download code',exact:true}).click();
  const download=await downloadEvent;
  assert.equal(download.suggestedFilename(),'theme.css');
  assert.equal(await readFile(await download.path(),'utf8'),code);
  await page.getByRole('button',{name:'Copy',exact:true}).click();
  await page.waitForFunction(expected=>navigator.clipboard.readText().then(text=>text===expected),code);
  assert.deepEqual(errors,[]);
  await context.close();
 }
 console.log('PASS: desktop/phone project validation, Escape/focus, creation/persistence, actual CSS download and clipboard bytes');
} finally {await browser.close();}
