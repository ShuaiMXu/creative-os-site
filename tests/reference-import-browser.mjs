import assert from "node:assert/strict";
import { chromium } from "playwright-core";
const browser = await chromium.launch({ channel: "chrome", headless: true });
try {
  const context = await browser.newContext({
    permissions: ["clipboard-read", "clipboard-write"],
  });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  const base = process.env.SITE_URL || "http://127.0.0.1:4212";
  await page.goto(base + "/apps/portal/");
  await page.locator("#connect-agent").waitFor();
  assert.equal(await page.locator("#explore").count(), 0);
  assert.equal(
    await page.locator("#portal-content > section").first().getAttribute("id"),
    "connect-agent",
  );
  assert.equal(await page.locator(".how-to-steps article").count(), 3);
  assert.equal(
    await page.locator(".desktop-nav a").nth(1).getAttribute("href"),
    "/components/?provider=systems",
  );
  await page.goto(base + "/components/?provider=refero");
  const file = page.locator("input[type=file]");
  const markdown =
    "# Test guidelines\n\nColor: #123456\n<script>window.injected=true</script>";
  await file.setInputFiles({
    name: "DESIGN.md",
    mimeType: "text/markdown",
    buffer: Buffer.from(markdown),
  });
  await page.locator(".reference-text").waitFor();
  assert.equal(await page.locator(".reference-text").textContent(), markdown);
  assert.equal(await page.evaluate(() => window.injected), undefined);
  await page.locator(".reference-actions summary").click();
  await page.locator(".reference-actions button").click();
  assert.match(
    await page.evaluate(() => navigator.clipboard.readText()),
    /Test guidelines/,
  );
  await file.setInputFiles({
    name: "bad.md",
    mimeType: "text/markdown",
    buffer: Buffer.alloc(256 * 1024 + 1),
  });
  assert.ok((await page.locator("[role=alert]").textContent()).includes("256"));
  assert.equal(await page.locator(".reference-text").textContent(), markdown);
  await page.locator(".reference-document-heading button").click();
  assert.equal(await page.locator(".reference-text").count(), 0);
  let fail = true;
  const fixture = {
    slug: "linear",
    title: "Linear reference",
    description: "Layout analysis",
    image: null,
    fullImage: null,
    source: "https://kage.design/designs/linear",
    product: "Linear",
    styles: ["Minimal"],
    prompt: "# Structure\nUse existing components.",
  };
  await page.route("**/api/kage?*", async (route) => {
    if (route.request().url().includes("slug=")) {
      if (fail) {
        fail = false;
        return route.fulfill({ status: 502, body: "{}" });
      }
      return route.fulfill({ json: { design: fixture } });
    }
    return route.fulfill({ json: { designs: [fixture] } });
  });
  await page.goto(base + "/components/?provider=kage");
  await page.locator(".kage-search input").fill("Linear");
  await page.locator(".kage-search button").click();
  await page.locator(".kage-card").click();
  await page.locator(".kage-detail button").nth(1).waitFor();
  await page.locator(".kage-detail button").nth(1).click();
  await page.locator(".kage-detail .reference-text").waitFor();
  assert.match(
    await page.locator(".reference-text").textContent(),
    /Structure/,
  );
  for (const width of [390, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    assert.ok(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth + 1,
      ),
    );
    await page.screenshot({
      path: `test-results/reference-${width}.png`,
      fullPage: true,
    });
  }
  await page.locator(".kage-detail > button").click();
  assert.equal(await page.locator(".kage-detail").count(), 0);
  assert.ok(
    await page
      .locator(".kage-card")
      .evaluate((e) => e === document.activeElement),
  );
  assert.deepEqual(errors, []);
  console.log(
    "PASS homepage flow, Refero local import/invalid file/escaping/copy/clear, Kage search/detail/retry/focus, responsive widths",
  );
} finally {
  await browser.close();
}
