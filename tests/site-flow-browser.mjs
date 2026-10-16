import { chromium } from "playwright-core";
import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
const base = process.env.SITE_URL || "http://127.0.0.1:4192";
const browser = await chromium.launch({
  channel: process.env.BROWSER_CHANNEL || "chrome",
  headless: true,
});
await mkdir("test-results/site-flow", { recursive: true });
try {
  for (const width of [1280, 768, 390])
    for (const theme of ["light", "dark"]) {
      const context = await browser.newContext({
        viewport: { width, height: 900 },
        colorScheme: theme,
        reducedMotion: "reduce",
      });
      const page = await context.newPage();
      const errors = [];
      page.on("pageerror", (e) => errors.push(e.message));
      async function check(name) {
        assert.equal(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
          true,
          name + " overflow",
        );
        assert.equal(
          await page.locator("html").getAttribute("data-theme"),
          theme,
          name + " appearance",
        );
        await page.screenshot({
          path: `test-results/site-flow/${width}-${theme}-${name}.png`,
        });
      }
      async function follow(selector) {
        await page.locator(selector).click();
        await page.waitForLoadState("networkidle");
      }
      await page.goto(base + "/apps/portal/", { waitUntil: "networkidle" });
      await check("home");
      assert.equal(await page.locator('header a[aria-current="page"]').count(),0);
      await follow('header a[href="/apps/portal/#explore"]');
      assert.deepEqual(
        await page.locator(".system-collection article h3").allTextContents(),
        ["HappyHands", "Quartz"],
      );
      assert.equal(
        await page.locator("#explore textarea, #explore pre").count(),
        0,
      );
      await check("catalog");
      await follow('#happyhands a[href="/systems/happyhands/"]');
      assert.equal(
        await page.evaluate(() => localStorage.getItem("hh-theme")),
        null,
        "system appearance must not become an explicit preference",
      );
      if (width < 900) {
        assert.equal(
          await page.locator(".system-directory nav").isVisible(),
          false,
        );
        await page.locator(".system-directory summary").click();
      }
      assert.equal(
        await page.locator(".system-directory nav").isVisible(),
        true,
      );
      await follow('.system-directory a[href="#components"]');
      const dialogButton = page.getByRole('button', {name:'打开确认弹窗', exact:true});
      await dialogButton.focus();
      await page.keyboard.press('Enter');
      assert.equal(await page.getByRole('dialog').isVisible(), true);
      await page.keyboard.press('Escape');
      assert.equal(await page.getByRole('dialog').isVisible(), false);
      assert.equal(await dialogButton.evaluate(el=>el===document.activeElement), true);

      await follow('.system-directory a[href="#overview"]');
      await check("happyhands");
      await page.getByRole("button", { name: "English", exact: true }).click();
      assert.equal(await page.locator("html").getAttribute("lang"), "en");
      await follow('header a[href="/apps/portal/#explore"]');
      assert.equal(await page.locator("html").getAttribute("lang"), "en");
      await follow('#quartz a[href="/systems/quartz/"]');
      await check("quartz-en");
      assert.equal(await page.locator("html").getAttribute("lang"), "en");
      await follow('header a[href="/apps/studio/"]');
      await check("studio-en");
      assert.equal(
        await page
          .getByRole("heading", { name: "Project design system", exact: true })
          .isVisible(),
        true,
      );
      assert.equal(
        await page.locator(".review-link").getAttribute("href"),
        "/apps/portal/#connect-agent",
      );
      if (width < 700)
        await page.getByRole("button", { name: "Edit", exact: true }).click();
      // Project names are user content and must not be translated with the UI.
      await page.locator(".project-name input").fill("Review project");
      assert.equal(
        await page.locator(".sample-nav > b").innerText(),
        "Review project",
      );
      await page
        .getByRole("textbox", { name: "primary", exact: true })
        .fill("#336699");
      await page
        .getByRole("textbox", { name: "primary", exact: true })
        .press("Tab");
      await page.getByRole("button", { name: "中文", exact: true }).click();
      assert.equal(
        await page
          .getByRole("textbox", { name: "primary", exact: true })
          .inputValue(),
        "#336699",
        "language switch must retain edits",
      );
      await page.getByRole("button", { name: "English", exact: true }).click();
      for (const label of [
        "Design standards",
        "Import",
        "Export",
        "Review changes",
      ]) {
        await page
          .getByRole("button", {
            name: label === "Review changes" ? /^Review changes/ : label,
            exact: label !== "Review changes",
          })
          .click();
        const text = await page.locator("main").innerText();
        assert.equal(
          /[\u3400-\u9fff]/.test(text),
          false,
          `${label} contains untranslated UI`,
        );
        await page.getByRole("button", { name: "Close panel" }).click();
      }
      await page
        .getByRole("button", {
          name: `Switch to ${theme === "light" ? "dark" : "light"} mode`,
        })
        .click();
      const changed = theme === "light" ? "dark" : "light";
      await follow('header a[aria-label="HappyHands"]');
      assert.equal(
        await page.locator("html").getAttribute("data-theme"),
        changed,
      );
      assert.equal(await page.locator("html").getAttribute("lang"), "en");
      await follow('header a[href="/apps/portal/#connect-agent"]');
      assert.ok(page.url().endsWith("#connect-agent"));
      assert.deepEqual(errors, []);
      await context.close();
    }
  console.log(
    "PASS: home → HappyHands → home → Quartz → Theme Studio → home → connection guide, 390/768/1280px, both themes, language persistence, mobile directory, edits retained, translated panels, no page errors or overflow.",
  );
} finally {
  await browser.close();
}
