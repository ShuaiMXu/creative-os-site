import { chromium } from 'playwright-core';
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';

const base = process.env.SITE_URL || 'http://127.0.0.1:4212';
const browser = await chromium.launch({ channel:process.env.BROWSER_CHANNEL || 'chrome', headless:true });
const routes = ['/apps/portal/', '/components/?provider=systems', '/components/?provider=cult-ui', '/components/?provider=kage', '/components/?provider=refero', '/systems/happyhands/', '/systems/quartz/', '/systems/lime/', '/apps/studio/'];
await mkdir('test-results/site-consistency', { recursive:true });
try {
  for (const width of [390, 768, 1280]) for (const theme of ['light', 'dark']) {
    // Normal motion is intentional: long homepage sections used to remain invisible.
    const context = await browser.newContext({ viewport:{width,height:900}, colorScheme:theme });
    const page = await context.newPage();
    const errors=[];
    page.on('pageerror', error=>errors.push(error.message));
    for (const [index, route] of routes.entries()) {
      await page.goto(base+route);
      await page.locator('h1').first().waitFor();
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth), true, route+' horizontal overflow');
      assert.equal(await page.locator('html').getAttribute('data-theme'), theme, route+' theme');
      if (index===0) {
        const section=page.locator('#connect-agent');
        await section.scrollIntoViewIfNeeded();
        assert.equal(await section.evaluate(el=>getComputedStyle(el).opacity),'1','long section must not wait for an intersection ratio');
        assert.equal(await page.locator('#agent-prompt').isVisible(),false);
        const copy=page.locator('#copy-agent');
        const original=await copy.getAttribute('data-copy');
        assert.ok(original.length>100);
        await page.locator('[data-agent="cursor"]').click();
        assert.notEqual(await copy.getAttribute('data-copy'),original,'collapsed preview must still update the copied preset');
        await page.locator('.agent-prompt-preview > summary').press('Enter');
        assert.equal(await page.locator('#agent-prompt').isVisible(),true);
      }
      if (route.includes('provider=kage')) {
        assert.equal(await page.locator('.provider-columns').isVisible(),false);
        await page.locator('.reference-setup > summary').press('Enter');
        assert.equal(await page.locator('.provider-columns').isVisible(),true);
        await page.locator('.reference-setup > summary').press('Space');
        assert.equal(await page.locator('.provider-columns').isVisible(),false);
      }
      await page.screenshot({path:`test-results/site-consistency/${width}-${theme}-${index}.png`});
    }
    assert.deepEqual(errors,[],`${width}/${theme} uncaught errors`);
    console.log(`PASS ${width}/${theme}: ${routes.length} public routes`);
    await context.close();
  }
} finally { await browser.close(); }
