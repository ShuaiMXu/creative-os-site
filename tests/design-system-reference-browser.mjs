import { chromium } from "playwright-core";
import assert from "node:assert/strict";
import { readFile, mkdir } from "node:fs/promises";
const base = process.env.SITE_URL || "http://127.0.0.1:4212";
const tokens = JSON.parse(
  await readFile(
    new URL("../packages/design-tokens/happyhands.json", import.meta.url),
  ),
);
const registry = JSON.parse(
  await readFile(
    new URL("../systems/quartz/catalog.json", import.meta.url),
    "utf8",
  ).then((text) => text.replace(/^\uFEFF/, "")),
);
const browser = await chromium.launch({
  channel: process.env.BROWSER_CHANNEL || "chrome",
  headless: true,
});
await mkdir("test-results/design-system-reference", { recursive: true });
try {
  for (const width of [390, 1280])
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
                  window.copiedReference = text;
                },
              },
            });
          },
          { lang, theme },
        );
        const page = await context.newPage(),
          errors = [];
        page.on("pageerror", (error) => errors.push(error.message));
        const check = async () => {
          assert.equal(
            await page.locator("html").getAttribute("data-theme"),
            theme,
          );
          assert.ok(
            await page.evaluate(
              () => document.documentElement.scrollWidth <= innerWidth,
            ),
            "no page overflow",
          );
          assert.deepEqual(errors, []);
        };
        await page.goto(`${base}/systems/happyhands/`, {
          waitUntil: "networkidle",
        });
        const reference = page.locator(".token-reference");
        assert.equal(await reference.locator("[data-token]").count(), 12);
        await reference
          .getByRole("button", {
            name: t("显示全部匹配项", "Show all matches"),
            exact: true,
          })
          .click();
        assert.deepEqual(
          (
            await reference
              .locator("[data-token]")
              .evaluateAll((items) => items.map((item) => item.dataset.token))
          ).sort(),
          Object.keys(tokens.light).sort(),
        );
        for (const format of ["json", "css"]) {
          const pending = page.waitForEvent("download");
          await reference
            .getByRole("button", {
              name: t(
                `导出 ${format.toUpperCase()}`,
                `Export ${format.toUpperCase()}`,
              ),
              exact: true,
            })
            .click();
          const download = await pending,
            content = await readFile(await download.path(), "utf8");
          if (format === "json") assert.deepEqual(JSON.parse(content), tokens);
          else
            for (const [mode, values] of Object.entries(tokens))
              for (const [key, value] of Object.entries(values))
                assert.ok(
                  content.includes(`--hh-${key}: ${value};`),
                  `${mode}/${key} exported`,
                );
        }
        await reference.getByRole("searchbox").fill("font-sans");
        assert.equal(await reference.locator("[data-token]").count(), 1);
        await reference
          .getByRole("button", {
            name: t("复制变量", "Copy token"),
            exact: true,
          })
          .click();
        assert.equal(
          await page.evaluate(() => window.copiedReference),
          "var(--hh-font-sans)",
        );
        await reference.getByRole("searchbox").fill("no-such-token");
        assert.equal(await reference.locator("[data-token]").count(), 0);
        await reference.getByRole("searchbox").fill("");
        await reference.getByRole("combobox").selectOption("space");
        assert.equal(
          await reference.locator("[data-token]").count(),
          Object.keys(tokens.light).filter((key) => key.startsWith("space-"))
            .length,
        );
        await reference.getByRole("combobox").selectOption("all");
        await reference.scrollIntoViewIfNeeded();
        await check();
        await page.screenshot({
          path: `test-results/design-system-reference/tokens-${width}-${theme}-${lang}.png`,
        });
        const gallery = page.locator(".showcase-grid");
        await gallery.getByRole("combobox").selectOption("compact");
        assert.equal(
          await gallery.locator("ul").getAttribute("data-density"),
          "compact",
        );
        await gallery.getByRole("checkbox").focus();
        await page.keyboard.press("Space");
        assert.equal(await gallery.getByRole("checkbox").isChecked(), false);
        await gallery.getByRole("searchbox").fill("no-page");
        assert.equal(await gallery.locator("li").count(), 0);
        const patterns = page.locator(".pattern-reference");
        await patterns
          .getByRole("button", { name: t("设置页面", "Settings"), exact: true })
          .click();
        await patterns.getByRole("textbox").fill("Reference Studio");
        assert.equal(
          await patterns.locator("header b").innerText(),
          "Reference Studio",
        );
        await patterns
          .getByRole("button", {
            name: t("保存示例", "Save example"),
            exact: true,
          })
          .click();
        assert.ok(await patterns.locator("output").innerText());
        await patterns
          .getByRole("button", { name: t("任务结果", "Result"), exact: true })
          .click();
        await patterns
          .getByRole("button", {
            name: t("返回项目列表", "Back to projects"),
            exact: true,
          })
          .click();
        await check();
        await page.goto(`${base}/systems/quartz/`, {
          waitUntil: "networkidle",
        });
        const catalog = page.locator(".quartz-catalog");
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
        assert.equal(
          await catalog.locator("[data-registry-item]").count(),
          registry.items.filter((item) => item.type === "registry:block")
            .length,
        );
        await catalog.getByRole("combobox").selectOption("all");
        await catalog.getByRole("searchbox").fill("dialog");
        assert.equal(await catalog.locator("[data-registry-item]").count(), 1);
        await catalog.locator("summary").click();
        await catalog
          .getByRole("button", {
            name: t("复制命令", "Copy command"),
            exact: true,
          })
          .click();
        assert.equal(
          await page.evaluate(() => window.copiedReference),
          "npx shadcn@latest add https://design.how/r/quartz/dialog.json",
        );
        await page.evaluate(() => {
          navigator.clipboard.writeText = async () => {
            throw Error("denied");
          };
        });
        await catalog
          .getByRole("button", {
            name: t("复制命令", "Copy command"),
            exact: true,
          })
          .click();
        assert.match(
          await catalog.locator("output").innerText(),
          /手动|manually/,
        );
        await catalog.scrollIntoViewIfNeeded();
        await check();
        await page.screenshot({
          path: `test-results/design-system-reference/catalog-${width}-${theme}-${lang}.png`,
        });
        await context.close();
      }
  const embedded = await browser.newPage({
    viewport: { width: 1280, height: 900 },
  });
  await embedded.goto(
    `${base}/components/?provider=systems&system=happyhands`,
    { waitUntil: "networkidle" },
  );
  const frame = embedded.frameLocator(".system-library-full iframe");
  await frame.locator(".token-reference [data-token]").first().waitFor();
  await embedded.waitForFunction(
    () =>
      parseInt(
        document.querySelector(".system-library-full iframe").style.height,
      ) > 1200,
  );
  const height = await embedded
    .locator(".system-library-full iframe")
    .evaluate((element) => parseInt(element.style.height));
  await frame
    .locator(".token-reference")
    .getByRole("button", { name: "继续浏览", exact: true })
    .click();
  await embedded.waitForFunction(
    (height) =>
      parseInt(
        document.querySelector(".system-library-full iframe").style.height,
      ) > height,
    height,
  );
  await embedded
    .locator('.provider-navigation a[href="?provider=systems&system=quartz"]')
    .click();
  await embedded
    .frameLocator(".system-library-full iframe")
    .locator(".quartz-catalog")
    .getByRole("searchbox")
    .fill("run-trace");
  assert.equal(
    await embedded
      .frameLocator(".system-library-full iframe")
      .locator("[data-registry-item]")
      .count(),
    1,
  );
  assert.ok(
    await embedded.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  );
  await embedded.close();
  console.log(
    "Design references: complete token/catalog coverage, exact exports, selection, filtering, clipboard failure, bilingual themes and embedded library resizing passed.",
  );
} finally {
  await browser.close();
}
