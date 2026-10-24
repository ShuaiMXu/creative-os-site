import { chromium } from "playwright-core";
import assert from "node:assert/strict";
const base = process.env.SITE_URL || "http://127.0.0.1:4212";
const browser = await chromium.launch({
  channel: process.env.BROWSER_CHANNEL || "chrome",
  headless: true,
});
const svg =
  '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500"><rect width="800" height="500" fill="#eee"/><text x="60" y="100" font-size="36">Reference fixture</text></svg>';
const fixture = {
  slug: "example",
  title: "Example reference",
  description: "Example description",
  image: base + "/test-reference.svg",
  fullImage: base + "/test-reference.svg",
  fullPageImage: base + "/test-full.svg",
  source: "https://kage.design/designs/example",
  website: "https://example.com",
  product: "Example",
  styles: ["Minimal"],
  prompt: "PAGE ANALYSIS",
  components: [
    {
      slug: "hero",
      title: "Hero section",
      kind: "Hero",
      description: "Section description",
      image: base + "/test-reference.svg",
      source: "https://kage.design/components/hero",
      prompt: "SECTION ANALYSIS",
    },
    {
      slug: "footer",
      title: "Footer section",
      kind: "Footer",
      description: "Another section",
      image: base + "/missing.svg",
      source: null,
      prompt: "",
    },
  ],
};
try {
  for (const lang of ["zh", "en"])
    for (const width of [390, 768, 1280]) {
      const context = await browser.newContext({
        viewport: { width, height: 900 },
      });
      await context.addInitScript(
        ({ lang, width }) => {
          localStorage.setItem("pd-lang", lang);
          localStorage.setItem("hh-theme", width === 768 ? "dark" : "light");
        },
        { lang, width },
      );
      const page = await context.newPage();
      const errors = [];
      page.on("pageerror", (e) => errors.push(e.message));
      let calls = 0;
      const urls = [];
      await page.route("**/test-*.svg", (r) =>
        r.fulfill({ contentType: "image/svg+xml", body: svg }),
      );
      await page.route("**/missing.svg", (r) =>
        r.fulfill({ status: 404, body: "" }),
      );
      await page.route("**/api/kage?*", (r) => {
        calls++;
        urls.push(r.request().url());
        return r.fulfill({
          json: r.request().url().includes("slug=")
            ? { design: fixture }
            : { designs: [fixture] },
        });
      });
      await page.goto(base + "/components/?provider=kage");
      await page.locator(".kage-card").waitFor();
      assert.equal(calls, 1);
      assert.ok(urls[0].endsWith("?browse=all"));
      await page.getByRole("button", { name: "Linear", exact: true }).click();
      await page.locator(".kage-card").waitFor();
      assert.ok(urls.at(-1).endsWith("?query=Linear"));
      await page.getByRole("button", { name: lang === "zh" ? "全部类型" : "All types", exact: true }).click();
      await page.locator(".kage-card").waitFor();
      assert.ok(urls.at(-1).endsWith("?browse=all"));
      await page.locator(".kage-card").click();
      const label = (zh, en) => (lang === "zh" ? zh : en);
      await page
        .getByRole("button", {
          name: label("页面区块 / 2", "Page sections / 2"),
          exact: true,
        })
        .click();
      await page.locator(".kage-section-analysis summary").click();
      assert.equal(
        await page.locator(".kage-section-analysis pre").textContent(),
        "SECTION ANALYSIS",
      );
      await page
        .getByRole("button", {
          name: label("放大查看", "Enlarge image"),
          exact: true,
        })
        .click();
      assert.equal(await page.locator("dialog").evaluate((e) => e.open), true);
      await page.keyboard.press("Escape");
      assert.equal(await page.locator("dialog").evaluate((e) => e.open), false);
      assert.equal(
        await page
          .getByRole("button", {
            name: label("放大查看", "Enlarge image"),
            exact: true,
          })
          .evaluate((e) => e === document.activeElement),
        true,
      );
      await page.locator(".kage-section-option").nth(1).click();
      await page
        .locator(".kage-section-content .kage-image-fallback")
        .waitFor();
      assert.equal(await page.locator(".kage-section-analysis").count(), 0);
      await page
        .getByRole("button", {
          name: label("页面效果", "Page preview"),
          exact: true,
        })
        .click();
      await page
        .getByRole("button", {
          name: label("查看整页", "Show full page"),
          exact: true,
        })
        .click();
      assert.equal(
        await page.locator(".kage-page-image img").getAttribute("src"),
        fixture.fullPageImage,
      );
      assert.equal(calls, 4); // switching sections never fetches the catalog again
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth > innerWidth + 1,
        ),
        false,
      );
      await page
        .getByRole("button", {
          name: label("设计分析", "Design analysis"),
          exact: true,
        })
        .click();
      assert.equal(
        await page.locator(".kage-detail .reference-text").textContent(),
        "PAGE ANALYSIS",
      );
      await page
        .getByRole("button", {
          name: label("收起详情", "Close details"),
          exact: true,
        })
        .click();
      await page.waitForFunction(() => document.activeElement?.classList.contains("kage-card"));
      assert.equal(
        await page
          .locator(".kage-card")
          .evaluate((e) => e === document.activeElement),
        true,
      );
      assert.deepEqual(errors, []);
      await context.close();
    }
  console.log(
    "PASS 6 layouts/languages with dark mode; on-demand requests, sections, failure fallback, full page, modal/focus, analysis",
  );
} finally {
  await browser.close();
}
