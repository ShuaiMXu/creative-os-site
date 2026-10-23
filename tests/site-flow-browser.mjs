import { openStudioActions } from "./studio-ui-helpers.mjs";
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
  for (const width of [1280, 965, 768, 390])
    for (const theme of ["light", "dark"]) {
      const context = await browser.newContext({
        viewport: { width, height: 900 },
        colorScheme: theme,
        reducedMotion: "reduce",
      });
      const page = await context.newPage();
      page.setDefaultTimeout(15000);
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
        if (
          selector.startsWith("header ") &&
          !(await page.locator(selector).isVisible())
        ) {
          await page.locator(".hh-site-menu-toggle").click();
        }
        await page.locator(selector).click();
        await page.waitForLoadState("networkidle");
      }
      await page.goto(base + "/apps/portal/", { waitUntil: "networkidle" });
      await check("home");
      const guideLink = page.locator('#harness > a.text-link');
      await guideLink.scrollIntoViewIfNeeded();
      const linkStyle = await guideLink.evaluate(element => ({line:getComputedStyle(element).textDecorationLine,border:getComputedStyle(element).borderBottomWidth,height:element.getBoundingClientRect().height}));
      assert.equal(linkStyle.line, 'none');assert.equal(linkStyle.border, '0px');assert.ok(linkStyle.height>=44);
      await guideLink.hover();assert.equal(await guideLink.evaluate(element=>getComputedStyle(element).textDecorationLine),'none');
      await page.keyboard.press('Tab');await guideLink.focus();
      assert.ok(await guideLink.evaluate(element=>parseFloat(getComputedStyle(element).outlineWidth)>=2),'guide link keeps keyboard focus');
      await page.locator('header.hh-site-header').scrollIntoViewIfNeeded();

      const menu = page.locator(".hh-site-menu-toggle");
      assert.equal(await menu.isVisible(), width <= 1000);
      if (width <= 1000) {
        assert.equal(await page.locator("header nav").isVisible(), false);
        await menu.press("Enter");
        assert.equal(await menu.getAttribute("aria-expanded"), "true");
        await page.locator("header nav a").first().focus();
        await page.keyboard.press("Escape");
        assert.equal(await menu.getAttribute("aria-expanded"), "false");
        assert.equal(
          await menu.evaluate((el) => el === document.activeElement),
          true,
        );
      }
      assert.equal(
        await page.locator('header a[aria-current="page"]').count(),
        0,
      );
      assert.equal(await page.locator('#explore').count(), 0);
      await follow('header a[href="/components/?provider=systems"]');
      await check("catalog");
      const catalogLeft = (await page.locator('.library-heading h1').boundingBox()).x;
      const headerLeft = (await page.locator('header a[aria-label="HappyHands"]').boundingBox()).x;
      await page.frameLocator('iframe[title="HappyHands 完整设计规范"]').getByRole("heading", {name:"HappyHands", exact:true}).waitFor();
      await page.goto(base + '/systems/happyhands/');
      assert.equal(await page.locator("h1").innerText(), "HappyHands");
      const detailLeft = (
        await page.locator(".system-breadcrumb").boundingBox()
      ).x;
      assert.ok(
        Math.abs(detailLeft - catalogLeft) < 1,
        "detail and parent catalog share the same content grid",
      );
      assert.ok(
        Math.abs(
          (
            await page
              .locator('header a[aria-label="HappyHands"]')
              .boundingBox()
          ).x - headerLeft,
        ) < 1,
        "header must not shift when entering the detail page",
      );
      assert.ok(
        (await page.locator("h1").boundingBox()).height < 100,
        "the system name must not break into orphan lines",
      );
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
      await page.waitForFunction(
        () =>
          document
            .querySelector('.system-directory a[href="#components"]')
            .getAttribute("aria-current") === "location",
      );
      const dialogButton = page.getByRole("button", {
        name: "打开确认弹窗",
        exact: true,
      });
      await dialogButton.focus();
      await page.keyboard.press("Enter");
      assert.equal(await page.getByRole("dialog").isVisible(), true);
      await page.keyboard.press("Escape");
      assert.equal(await page.getByRole("dialog").isVisible(), false);
      assert.equal(
        await dialogButton.evaluate((el) => el === document.activeElement),
        true,
      );

      await follow('.system-directory a[href="#overview"]');
      await check("happyhands");
      await page.getByRole("button", { name: "English", exact: true }).click();
      assert.equal(await page.locator("html").getAttribute("lang"), "en");
      await follow('.system-breadcrumb a[href="/components/?provider=systems"]');
      assert.equal(await page.locator(".resource-sections").isVisible(), true);
      assert.equal(await page.locator("html").getAttribute("lang"), "en");
      await follow('.provider-navigation a[href="?provider=systems&system=quartz"]');
      await page.frameLocator('iframe[title="Quartz complete design system"]').getByRole("heading", {name:"Quartz", exact:true}).first().waitFor();
      await page.goto(base + '/systems/quartz/');
      await check("quartz-en");
      const catalog = page.locator(".quartz-catalog");
      await catalog.getByRole("searchbox").fill("button");
      const componentEntry = catalog.locator('[data-registry-item="button"]');
      await componentEntry.locator("summary").focus();
      await page.keyboard.press("Enter");
      assert.ok(await componentEntry.locator("pre").isVisible());
      assert.match(await componentEntry.locator("pre").innerText(), /quartz\/button\.json/);
      assert.equal(await page.locator("html").getAttribute("lang"), "en");
      await follow('header a[href="/apps/studio/"]');
      await check("studio-en");
      assert.equal(
        await page.locator(".studio-more").evaluate((el) => el.open),
        false,
      );
      assert.equal(
        await page
          .locator(".studio-actions > [data-variant=primary]")
          .innerText(),
        "Export",
      );
      assert.equal(await page.getByText("92%", { exact: true }).count(), 0);
      if (width === 390) {
        assert.ok(
          (await page.locator(".theme-preview").boundingBox()).y < 620,
          "Phone preview should appear within the first screen",
        );
        assert.ok(
          await page
            .locator("header nav")
            .evaluate((el) => el.scrollWidth <= el.clientWidth),
          "All navigation labels should fit without horizontal scrolling",
        );
      }
      await page
        .getByRole("button", { name: "Save example", exact: true })
        .click();
      assert.ok(
        await page
          .getByRole("status")
          .filter({ hasText: "Example saved" })
          .isVisible(),
      );
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
      await openStudioActions(page);
      await page.locator(".studio-more > summary").focus();
      await page.keyboard.press("Escape");
      assert.equal(
        await page.locator(".studio-more").evaluate((el) => el.open),
        false,
      );
      for (const label of [
        "Design standards",
        "Import",
        "Export",
        "Review changes",
      ]) {
        if (label !== "Export") await openStudioActions(page);
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
          `${label} contains untranslated UI: ${text.match(/[^\n]*[\u3400-\u9fff][^\n]*/g)?.join("; ")}`,
        );
        await page.getByRole("button", { name: "Close panel" }).click();
        await page.waitForFunction(
          (fromExport) =>
            document.activeElement ===
            document.querySelector(
              fromExport
                ? ".studio-actions > button[data-variant=primary]"
                : ".studio-more > summary",
            ),
          label === "Export",
        );
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
    "PASS: home → resource directory → HappyHands → Quartz → Theme Studio → connection guide, 390/768/965/1280px, both themes, language persistence, mobile directory, edits retained, translated panels, no page errors or overflow.",
  );
} finally {
  await browser.close();
}
