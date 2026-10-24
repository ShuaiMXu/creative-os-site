import { chromium } from "playwright-core";
import assert from "node:assert/strict";
import { readFile, mkdir } from "node:fs/promises";
const base = process.env.SITE_URL || "http://127.0.0.1:4212";
const registry = JSON.parse(
  await readFile(
    new URL("../systems/lime/catalog.json", import.meta.url),
    "utf8",
  ),
);
const palette = JSON.parse(
  await readFile(
    new URL("../systems/lime/palette.json", import.meta.url),
    "utf8",
  ),
);
const browser = await chromium.launch({
  channel: process.env.BROWSER_CHANNEL || "chrome",
  headless: true,
});
await mkdir("test-results/lime", { recursive: true });
try {
  for (const width of [390, 768, 1280])
    for (const theme of ["light", "dark"])
      for (const lang of ["zh", "en"]) {
        const t = (zh, en) => (lang === "zh" ? zh : en);
        const context = await browser.newContext({
          viewport: { width, height: 960 },
          colorScheme: theme,
          reducedMotion: "reduce",
        });
        await context.addInitScript(
          ({ lang, theme }) => {
            localStorage.setItem("pd-lang", lang);
            localStorage.setItem("hh-theme", theme);
            Object.defineProperty(navigator, "clipboard", {
              configurable: true,
              value: {
                writeText: async (text) => {
                  window.copiedLime = text;
                },
              },
            });
          },
          { lang, theme },
        );
        const page = await context.newPage(),
          errors = [];
        page.on("pageerror", (error) => errors.push(error.message));
        await page.goto(base + "/apps/portal/#explore", {
          waitUntil: "networkidle",
        });
        await page.locator('.resource-cover[href="/components/?provider=systems"]').click();
        await page.locator('.provider-navigation a[href="?provider=systems&system=lime"]').click();
        await page.frameLocator('iframe[src="/systems/lime/?embedded=1"]').getByRole("heading", { name:"Lime", exact:true }).waitFor();
        await page.goto(base + '/systems/lime/');
        await page
          .getByRole("heading", { name: "Lime", exact: true })
          .waitFor();
        assert.match(page.url(), /\/systems\/lime\//);
        assert.equal(
          await page.locator("html").getAttribute("data-theme"),
          theme,
        );
        const demo = page.locator(".lime-preview"),
          action = demo.getByRole("button", {
            name: t("启用演示提醒", "Enable demo reminders"),
            exact: true,
          });
        assert.equal(
          await demo.evaluate((element) =>
            element.style.getPropertyValue("--lm-accent"),
          ),
          palette[theme].accent,
        );
        const colorBefore = await page
          .locator(".hh-site-header")
          .evaluate((element) => getComputedStyle(element).backgroundColor);
        await demo
          .getByRole("button", {
            name: t("切换 Lime 示例外观", "Switch Lime example appearance"),
            exact: true,
          })
          .click();
        assert.equal(
          await demo.getAttribute("data-appearance"),
          theme === "dark" ? "light" : "dark",
        );
        assert.equal(
          await page.locator("html").getAttribute("data-theme"),
          theme,
        );
        assert.equal(
          await page
            .locator(".hh-site-header")
            .evaluate((element) => getComputedStyle(element).backgroundColor),
          colorBefore,
        );
        await demo
          .getByRole("button", {
            name: t("切换 Lime 示例外观", "Switch Lime example appearance"),
            exact: true,
          })
          .click();
        const first = demo.getByRole("checkbox", {
          name: t("确认车票", "Check tickets"),
          exact: true,
        });
        await first.uncheck();
        assert.equal(await action.isEnabled(), false);
        await first.focus();
        await page.keyboard.press("Space");
        await demo.getByRole("combobox").selectOption("evening");
        await action.click();
        await page.waitForFunction(() =>
          document.activeElement?.matches(".lime-preview-result"),
        );
        assert.equal(await first.isEnabled(), false);
        await demo
          .getByRole("button", {
            name: t("撤销演示操作", "Undo demo action"),
            exact: true,
          })
          .click();
        assert.equal(await action.isEnabled(), true);
        await page.waitForFunction(() =>
          document.activeElement?.matches("[data-demo-primary]"),
        );
        await page.goto(base + "/systems/lime/", { waitUntil: "networkidle" });
        await page.screenshot({
          path: `test-results/lime/${width}-${theme}-${lang}.png`,
        });
        const catalog = page.locator(".lime-catalog");
        await catalog
          .getByRole("button", {
            name: t("显示全部匹配项", "Show all matches"),
            exact: true,
          })
          .click();
        assert.deepEqual(
          (
            await catalog
              .locator("[data-registry-item]")
              .evaluateAll((items) =>
                items.map((item) => item.dataset.registryItem),
              )
          ).sort(),
          registry.items.map((item) => item.name).sort(),
        );
        await catalog.getByRole("combobox").selectOption("screens");
        assert.equal(await catalog.locator("[data-registry-item]").count(), 5);
        await catalog.getByRole("combobox").selectOption("all");
        await catalog.getByRole("searchbox").fill("approval-request");
        const entry = catalog.locator(
          '[data-registry-item="approval-request"]',
        );
        await entry.locator("summary").focus();
        await page.keyboard.press("Enter");
        await entry
          .getByRole("button", {
            name: t("复制命令", "Copy command"),
            exact: true,
          })
          .click();
        assert.equal(
          await page.evaluate(() => window.copiedLime),
          "npx shadcn@latest add https://design.how/r/lime/approval-request.json",
        );
        const setup = page.locator("#adopt"),
          prompt = setup.getByRole("textbox");
        const old = await prompt.inputValue();
        await setup.getByRole("combobox").selectOption("new");
        assert.notEqual(await prompt.inputValue(), old);
        assert.match(await prompt.inputValue(), /LimePortalProvider/);
        await setup
          .getByRole("button", {
            name: t("复制接入指令", "Copy setup prompt"),
            exact: true,
          })
          .click();
        assert.equal(
          await page.evaluate(() => window.copiedLime),
          await prompt.inputValue(),
        );
        await page.evaluate(() => {
          navigator.clipboard.writeText = async () => {
            throw Error("denied");
          };
        });
        await setup
          .getByRole("button", {
            name: t("复制接入指令", "Copy setup prompt"),
            exact: true,
          })
          .click();
        assert.match(
          await page.locator("output.notice").innerText(),
          /手动|manually/,
        );
        assert.ok(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
        );
        assert.deepEqual(errors, []);
        await context.close();
      }
  const page = await browser.newPage({
    viewport: { width: 1280, height: 900 },
  });
  await page.goto(`${base}/components/?provider=systems&system=lime`, {
    waitUntil: "networkidle",
  });
  const frame = page.frameLocator(".system-library-full iframe");
  await frame.getByRole("heading", { name: "Lime", exact: true }).waitFor();
  await page.waitForFunction(
    () =>
      parseInt(
        document.querySelector(".system-library-full iframe").style.height,
      ) > 1200,
  );
  await frame.locator(".lime-catalog").getByRole("searchbox").fill("balance");
  assert.equal(await frame.locator("[data-registry-item]").count(), 1);
  await page
    .locator('.provider-navigation a[href="?provider=systems&system=quartz"]')
    .click();
  await page
    .frameLocator(".system-library-full iframe")
    .locator(".quartz-catalog")
    .waitFor();
  await page.goBack();
  await page
    .frameLocator(".system-library-full iframe")
    .locator(".lime-catalog")
    .waitFor();
  await page.close();
  console.log(
    "Lime: portal and embedded entry, all 64 entries / five blocks, demo focus/undo, scoped appearance, setup copy/failure and 390/768/1280 bilingual themes passed.",
  );
} finally {
  await browser.close();
}
