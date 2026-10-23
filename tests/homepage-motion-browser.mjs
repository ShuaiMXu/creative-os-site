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
    assert.equal(await page.locator(".hero-demo").count(),0);
    assert.ok(await page.locator(".pd-whirl-tile").count()>0);
    assert.equal(await page.locator(".hero-actions .button-primary").getAttribute("href"),"#apps");
    assert.equal(await page.locator("#design-resources .resource-cover").count(),2);
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
    await page.locator("#lang-switch button").click();
    assert.equal(await page.locator(".hero-demo").count(),0);
    assert.equal(await page.locator("#design-resources .resource-cover").count(),2);
    assert.deepEqual(errors,[]);
    if(width===390) await page.screenshot({path:`test-results/home-motion-mobile-${lang}.png`,fullPage:false});
    await page.close();
  }
  console.log("PASS homepage: production Hero retained, resource covers present, responsive/language layouts");
} finally {await browser.close();}
