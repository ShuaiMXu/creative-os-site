import { chromium } from "playwright-core";
import assert from "node:assert/strict";
const browser = await chromium.launch({ channel: "chrome", headless: true });
try {
  for (const width of [390, 1280]) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    const errors = [];
    page.on("pageerror", e => errors.push(e.message));
    await page.goto((process.env.SITE_URL || "http://127.0.0.1:4211") + "/components/?provider=kage");
    await page.locator(".provider-reference textarea").waitFor();
    assert.equal(await page.locator("iframe").count(), 0);
    await page.locator(".provider-columns input").fill("PROJECT-REFERENCE-TEST");
    assert.match(await page.locator(".provider-reference textarea").inputValue(), /PROJECT-REFERENCE-TEST/);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
    assert.equal(await page.locator('.hh-site-header nav a').count(), 4);
    await page.locator('.provider-navigation a[href="?provider=refero"]').click();
    await page.getByRole('heading', {name: '将参考风格整理为项目规范'}).waitFor();
    await page.locator('.resource-sections a[href="?provider=cult-ui"]').click();
    await page.locator(".catalog-list a").first().waitFor();
    assert.equal(await page.locator(".catalog-list a").count(), 154);
    await page.goBack();
    await page.getByRole('heading', {name: '将参考风格整理为项目规范'}).waitFor();
    assert.deepEqual(errors, []);
    await page.screenshot({ path: `test-results/component-library/providers-${width}.png`, fullPage: true });
    await page.close();
  }
  console.log("PASS provider links, history, reference guidance, desktop/mobile layout");
} finally { await browser.close(); }
