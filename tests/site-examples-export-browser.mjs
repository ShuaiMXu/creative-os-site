import { chromium } from "playwright-core";
import assert from "node:assert/strict";
import { mkdir, readFile } from "node:fs/promises";
const base = process.env.SITE_URL || "http://127.0.0.1:4192";
const out = "test-results/site-examples-export";
await mkdir(out, { recursive: true });
const browser = await chromium.launch({
  channel: process.env.BROWSER_CHANNEL || "chrome",
  headless: true,
});
try {
  for (const width of [390, 1280])
    for (const theme of ["light", "dark"]) {
      const context = await browser.newContext({
        viewport: { width, height: 1000 },
        colorScheme: theme,
        reducedMotion: "reduce",
      });
      const page = await context.newPage();
      page.setDefaultTimeout(15000);
      const errors = [];
      page.on("pageerror", (e) => errors.push(e.message));
      for (const system of ["happyhands", "quartz"]) {
        await page.goto(`${base}/systems/${system}/`, {
          waitUntil: "networkidle",
        });
        const sample = page.locator(".system-example");
        await sample.scrollIntoViewIfNeeded();
        await page.screenshot({
          path: `${out}/${system}-${width}-${theme}.png`,
        });
        assert.ok(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
        );
        const first = sample.getByRole("checkbox").nth(0);
        await first.uncheck();
        const confirm = sample.getByRole("button", {
          name: system === "happyhands" ? "确认选择" : "允许本次操作",
          exact: true,
        });
        assert.equal(await confirm.isEnabled(), false);
        await first.focus();
        await page.keyboard.press("Space");
        await confirm.click();
        assert.match(
          await sample.getByRole("status").innerText(),
          /已确认 1 项/,
        );
        assert.equal(await first.isEnabled(), false);
        await sample
          .getByRole("button", { name: "重新选择", exact: true })
          .click();
        await sample
          .getByRole("button", { name: "切换示例外观", exact: true })
          .click();
        assert.equal(
          await sample.getAttribute("data-appearance"),
          theme === "dark" ? "light" : "dark",
        );
        assert.equal(
          await page.locator("html").getAttribute("data-theme"),
          theme,
        );
        await page
          .getByRole("button", { name: "English", exact: true })
          .click();
        assert.equal(/[\u3400-\u9fff]/.test(await sample.innerText()), false);
        await sample.screenshot({
          path: `${out}/${system}-${width}-${theme}-en.png`,
        });
        await page.getByRole("button", { name: "中文", exact: true }).click();
      }
      assert.deepEqual(errors, []);
      await context.close();
    }
  const context = await browser.newContext({
    viewport: { width: 1280, height: 1000 },
    acceptDownloads: true,
  });
  const page = await context.newPage();
  page.setDefaultTimeout(15000);
  await page.goto(`${base}/apps/studio/?project=export-font-integration`, {
    waitUntil: "networkidle",
  });
  await page.getByRole("button", { name: "字体", exact: true }).click();
  await page
    .locator("#font-sans-select")
    .selectOption({ label: "Noto Sans SC · 黑体" });
  await page
    .locator('#token-font-sans [data-font-state="ready"]')
    .waitFor({ timeout: 30000 });
  await page.getByRole("button", { name: "导出", exact: true }).click();
  const code = await page.locator(".utility-panel pre").innerText();
  assert.match(
    code,
    /@import url\("https:\/\/happyhands-design.vercel.app\/fonts\/noto-sans-sc\/index.css"\)/,
  );
  await page
    .locator(".utility-panel")
    .screenshot({ path: `${out}/export-fonts.png` });
  const downloadWait = page.waitForEvent("download");
  await page.getByRole("button", { name: "下载代码", exact: true }).click();
  const download = await downloadWait;
  await download.saveAs(`${out}/theme.css`);
  assert.equal(await readFile(`${out}/theme.css`, "utf8"), code);
  const consumer = await context.newPage();
  await consumer.setContent(
    `<style>${code}</style><p style="font-family:var(--font-sans)">中文 Aa</p>`,
  );
  await consumer.evaluate(async () => {
    await document.fonts.load('16px "Noto Sans SC"', "中文 Aa");
    await document.fonts.ready;
  });
  assert.ok(
    await consumer.evaluate(() =>
      [...document.fonts].some(
        (f) =>
          f.family.replaceAll('"', "") === "Noto Sans SC" &&
          f.status === "loaded",
      ),
    ),
    "Exported CSS must load a real font in an unrelated blank page",
  );
  for (const format of ["registry", "tailwind3-config"]) {
    await page.getByLabel("导出格式").selectOption(format);
    assert.ok(
      await page
        .getByRole("button", { name: "下载字体 CSS", exact: true })
        .isVisible(),
    );
    if (format === "registry")
      JSON.parse(await page.locator(".utility-panel pre").innerText());
  }
  const fontDownloadWait = page.waitForEvent("download");
  await page.getByRole("button", { name: "下载字体 CSS", exact: true }).click();
  const fontDownload = await fontDownloadWait;
  await fontDownload.saveAs(`${out}/fonts.css`);
  assert.match(await readFile(`${out}/fonts.css`, "utf8"), /@import/);
  await page.getByRole("button", { name: "English", exact: true }).click();
  assert.equal(
    /[\u3400-\u9fff]/.test(await page.locator(".utility-panel").innerText()),
    false,
  );
  await context.close();
  console.log(
    "PASS: interactive examples, selection/empty/confirmed states, local appearance, English, 390/1280 light/dark; real CSS download loads font in a blank page; companion CSS and translated export guidance.",
  );
} finally {
  await browser.close();
}
