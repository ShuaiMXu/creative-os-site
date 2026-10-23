import { chromium } from "playwright-core";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import assert from "node:assert/strict";
const base = process.env.SITE_URL || "http://127.0.0.1:4210";
const catalog = JSON.parse(
  await readFile("public/components/cult-ui/catalog.json", "utf8"),
);
await mkdir("test-results/component-library", { recursive: true });
const browser = await chromium.launch({ channel: "chrome", headless: true });
const results = [];
try {
  const queue = catalog.items.filter((x) => x.preview);
  await Promise.all(
    Array.from({ length: 3 }, async () => {
      while (queue.length) {
        const item = queue.shift();
        const page = await browser.newPage({
          viewport: { width: 850, height: 650 },
        });
        const errors = [];
        const requests = [];
        page.on("pageerror", (e) => errors.push(e.message));
        page.on("response", (r) => {
          if (r.status() >= 400) requests.push(r.url());
        });
        try {
          await page.goto(
            `${base}/components/preview/?component=${item.id}&theme=light&motion=off`,
            { waitUntil: "networkidle" },
          );
          await page.waitForFunction(
            () =>
              document.querySelector(".preview-runtime")?.children.length > 0 &&
              !/Loading component/.test(
                document.querySelector(".preview-runtime").textContent,
              ),
          );
          const alert = await page.locator("[role=alert]").allTextContents();
          const images = await page
            .locator("img")
            .evaluateAll((imgs) =>
              imgs
                .filter((x) => !x.complete || x.naturalWidth === 0)
                .map((x) => x.src),
            );
          const text = await page.locator(".preview-runtime").innerText();
          results.push({
            id: item.id,
            errors,
            requests,
            images,
            alert,
            rendered:
              text.length > 0 ||
              (await page.locator("svg,canvas,img").count()) > 0,
          });
          if (
            [
              "shift-card",
              "halo-input",
              "cosmic-button",
              "illustration-card-grid",
              "halo-switch",
              "halo-tabs",
            ].includes(item.id)
          )
            await page.screenshot({
              path: `test-results/component-library/${item.id}.png`,
            });
        } catch (e) {
          results.push({ id: item.id, error: e.message });
        }
        await page.close();
      }
    }),
  );
  await writeFile(
    "test-results/component-library/previews.json",
    JSON.stringify(results, null, 2),
  );
  const failed = results.filter(
    (x) =>
      x.error ||
      x.errors?.length ||
      x.requests?.length ||
      x.images?.length ||
      x.alert?.length ||
      !x.rendered,
  );
  console.log(JSON.stringify({ checked: results.length, failed }, null, 2));
  assert.equal(failed.length, 0, "every advertised preview must render");
  for (const width of [390, 768, 1280])
    for (const theme of ["light", "dark"])
      for (const lang of ["zh", "en"]) {
        const ctx = await browser.newContext({
          viewport: { width, height: 1000 },
          reducedMotion: "reduce",
        });
        await ctx.addInitScript(
          ({ theme, lang }) => {
            localStorage.setItem("hh-theme", theme);
            localStorage.setItem("pd-lang", lang);
          },
          { theme, lang },
        );
        const page = await ctx.newPage();
        const errors = [];
        page.on("pageerror", (e) => errors.push(e.message));
        await page.goto(base + "/components/", { waitUntil: "networkidle" });
        await page.locator(".component-tile").first().waitFor();
        assert.equal(await page.locator(".component-tile").count(),18);
        assert.equal(await page.locator(".catalog-tabs").count(),0);
        await page.locator("input[type=search]").fill("shift-card");
        assert.equal(await page.locator(".component-tile").count(),1);
        await page.locator("input[type=search]").fill("no-such-component-000");
        assert.equal(await page.locator(".component-tile").count(),0);
        await page.getByRole('button',{name:lang==='zh'?'清除筛选':'Clear filters',exact:true}).click();
        await page.locator("input[type=search]").fill("halo-input");
        await page.locator('.component-tile').click();
        await page.getByRole('button',{name:lang==='zh'?'← 返回组件库':'← All components',exact:true}).click();
        assert.equal(await page.locator('input[type=search]').inputValue(),'halo-input');
        await page.locator('.component-tile').click();
        const frame = page.frameLocator("iframe");
        await frame.getByPlaceholder("Display name").fill("HappyHands");
        await page
          .getByRole("tab", {
            name: lang === "zh" ? "源码" : "Source",
            exact: true,
          })
          .click();
        await page.locator(".source-file pre").waitFor();
        assert.ok(
          (await page.locator(".source-file pre").innerText()).includes(
            "HaloInput",
          ),
        );
        await page
          .getByRole("tab", {
            name: lang === "zh" ? "接入规范" : "Integration",
            exact: true,
          })
          .click();
        assert.ok(
          (await page.locator("textarea").inputValue()).includes(
            catalog.revision,
          ),
        );
        assert.equal(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
          true,
        );
        await page
          .getByRole("tab", {
            name: lang === "zh" ? "效果预览" : "Preview",
            exact: true,
          })
          .click();
        await page
          .getByRole("button", {
            name: lang === "zh" ? "停止预览" : "Stop preview",
            exact: true,
          })
          .click();
        assert.equal(await page.locator("iframe").count(), 0);
        await page
          .getByRole("button", {
            name: lang === "zh" ? "启动预览" : "Start preview",
            exact: true,
          })
          .click();
        await page.frameLocator("iframe").getByPlaceholder("Display name").waitFor();
        assert.deepEqual(errors, []);
        if (lang === "zh")
          await page.screenshot({
            path: `test-results/component-library/catalog-${width}-${theme}.png`,
            fullPage: true,
          });
        await ctx.close();
      }
  console.log(
    "PASS: all local previews + 12 catalog viewport/theme/language flows",
  );
} finally {
  await browser.close();
}
