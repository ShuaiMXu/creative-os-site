import { chromium } from "playwright-core";
import assert from "node:assert/strict";
const browser = await chromium.launch({channel:"chrome",headless:true});
const base = process.env.SITE_URL || "http://127.0.0.1:4212";
try {
  for (const width of [390, 768, 1440]) for (const lang of ["zh", "en"]) {
    const page = await browser.newPage({viewport:{width,height:1000},reducedMotion:"reduce"});
    await page.addInitScript(({lang,width}) => {localStorage.setItem("pd-lang",lang);localStorage.setItem("hh-theme",width===768?"dark":"light");},{lang,width});
    const errors=[];page.on("pageerror",e=>errors.push(e.message));
    await page.goto(base+"/apps/portal/");
    const demo=page.locator(".hero-demo");await demo.waitFor();
    assert.equal(await page.locator(".pd-whirl-tile").count(),0);
    assert.equal(await page.locator(".demo-running").count(),0);
    await page.locator('[data-demo-step="2"]').click();
    assert.equal(await page.locator(".demo-canvas").getAttribute("data-step"),"2");
    assert.equal(await page.locator('[data-demo-step="2"]').getAttribute("aria-pressed"),"true");
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
    await page.locator("#lang-switch button").click();
    assert.equal(await demo.count(),1);
    assert.equal(await page.locator(".demo-running").count(),0);
    await page.locator('[data-demo-step="1"]').focus();await page.keyboard.press("Enter");
    assert.equal(await page.locator(".demo-canvas").getAttribute("data-step"),"1");
    assert.equal(await page.locator(".demo-action-primary").evaluate(e=>getComputedStyle(e).transform),"none");
    assert.deepEqual(errors,[]);
    if(width===390) await page.screenshot({path:`test-results/home-motion-mobile-${lang}.png`,fullPage:false});
    await page.close();
  }
  const page=await browser.newPage({viewport:{width:1440,height:1000}});
  await page.goto(base+"/apps/portal/");await page.locator(".demo-running").waitFor();
  await page.waitForFunction(()=>document.querySelector(".demo-canvas").dataset.step==="1");
  await page.locator(".demo-pause").click();
  const step=await page.locator(".demo-canvas").getAttribute("data-step");
  await page.waitForTimeout(4500);
  assert.equal(await page.locator(".demo-canvas").getAttribute("data-step"),step);
  await page.emulateMedia({reducedMotion:"reduce"});
  assert.equal(await page.locator(".demo-running").count(),0);
  await page.locator(".hero-actions .button-primary").click();
  assert.equal(new URL(page.url()).hash,"#connect-agent");
  console.log("PASS homepage: 6 responsive/language layouts, dark theme, reduced motion, keyboard steps, playback/pause and primary CTA");
} finally {await browser.close();}
