import { chromium } from "playwright-core";
import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
const browser = await chromium.launch({
  channel: process.env.BROWSER_CHANNEL || "msedge",
  headless: true,
});
const context = await browser.newContext({
  viewport: { width: 1440, height: 1100 },
  acceptDownloads: true,
});
const page = await context.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
try {
  await page.goto(
    `${process.env.STUDIO_URL || "http://127.0.0.1:4173/apps/studio/"}?project=browser-test`,
  );
  await page.getByRole("heading", { name: "项目设计系统" }).waitFor();
  const shell = await page
    .locator(".studio-header")
    .evaluate((el) => getComputedStyle(el).backgroundColor);
  await page
    .getByRole("textbox", { name: "primary", exact: true })
    .fill("#336699");
  await page
    .getByRole("textbox", { name: "primary", exact: true })
    .press("Tab");
  await page.waitForFunction(
    () =>
      document
        .querySelector(".theme-preview")
        ?.style.getPropertyValue("--primary") === "#336699",
  );
  await page.getByRole("button", { name: "↶ 撤销", exact: true }).click();
  assert.notEqual(
    await page
      .locator(".theme-preview")
      .evaluate((el) => el.style.getPropertyValue("--primary")),
    "#336699",
  );
  await page.getByRole("button", { name: "↷ 重做", exact: true }).click();
  await page.getByRole("button", { name: "☾ 深色", exact: true }).click();
  assert.notEqual(
    await page
      .locator(".theme-preview")
      .evaluate((el) => el.style.getPropertyValue("--primary")),
    "#336699",
  );
  assert.equal(
    await page
      .locator(".studio-header")
      .evaluate((el) => getComputedStyle(el).backgroundColor),
    shell,
  );
  await page.getByRole("button", { name: "☀ 浅色", exact: true }).click();
  await page.getByRole("button", { name: "保存", exact: true }).click();
  await page.reload();
  await page.getByRole("heading", { name: "项目设计系统" }).waitFor();
  assert.equal(
    await page
      .getByRole("textbox", { name: "primary", exact: true })
      .inputValue(),
    "#336699",
  );
  await page.getByRole("button", { name: "导入", exact: true }).click();
  await page
    .getByRole("textbox", { name: "导入源代码" })
    .fill(":root { --primary: #884422; --unknown: red; }");
  await page.getByRole("button", { name: "解析 CSS", exact: true }).click();
  assert.ok(
    await page.getByText("未识别 --unknown", { exact: true }).isVisible(),
  );
  await page.getByRole("button", { name: "应用已识别值（可撤销）" }).click();
  await page.waitForFunction(
    () =>
      document.querySelector("input[aria-label=primary]")?.value === "#884422",
  );
  await page.getByRole("button", { name: "导出", exact: true }).click();
  const downloadEvent = page.waitForEvent("download");
  await page.getByRole("button", { name: "下载草稿 JSON" }).click();
  const download = await downloadEvent;
  assert.equal(download.suggestedFilename(), "theme.draft.json");
  await page.getByRole("button", { name: "关闭面板" }).click();
  for (const scene of [
    "Dashboard",
    "Marketing",
    "Mail",
    "Typography",
    "Components",
  ]) {
    await page.getByLabel("预览场景").selectOption(scene);
    assert.ok(await page.locator(".theme-preview").isVisible());
  }
  await page.getByRole("button", { name: "前后对比", exact: true }).click();
  assert.equal(await page.locator(".theme-preview").count(), 2);
  await page.getByRole("button", { name: "前后对比", exact: true }).click();
  await page.getByRole("button", { name: "检查 token", exact: true }).click();
  await page.locator('.theme-preview [data-token="primary"]').first().click();
  assert.ok(await page.locator(".inspector-bar").isVisible());
  await page.getByLabel("预览场景").selectOption("Connected page");
  await page
    .getByText("已连接 · 主题已应用", { exact: true })
    .waitFor({ timeout: 12000 });
  assert.equal(
    await page
      .frameLocator("iframe")
      .locator("html")
      .evaluate((el) => el.style.getPropertyValue("--primary")),
    "#884422",
  );
  await page.getByLabel("预览场景").selectOption("Components");
  await page.getByRole("button", { name: /审核变更/ }).click();
  await page.getByLabel("审核人", { exact: true }).fill("Browser test");
  await page
    .getByLabel("批准理由", { exact: true })
    .fill("Verified preview in browser");
  await page
    .getByRole("checkbox", { name: "我已审阅当前变更与双模式预览" })
    .check();
  const approvalDownload = page.waitForEvent("download");
  await page.getByRole("button", { name: "批准并导出 Harness 文件" }).click();
  assert.equal(
    (await approvalDownload).suggestedFilename(),
    "foundation-approval.json",
  );
  await page.getByRole("button", { name: "关闭面板" }).click();
  await mkdir("test-results", { recursive: true });
  await page.screenshot({
    path: "test-results/studio-desktop.png",
    fullPage: true,
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "预览", exact: true }).click();
  assert.ok(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  );
  await page.screenshot({
    path: "test-results/studio-mobile.png",
    fullPage: true,
  });
  await page.getByRole("button", { name: "编辑", exact: true }).click();
  assert.ok(
    await page
      .getByRole("textbox", { name: "primary", exact: true })
      .isVisible(),
  );
  await page.setViewportSize({ width: 1440, height: 1100 });
  const foundation = await page.evaluate(
    () => JSON.parse(localStorage.getItem("hh-studio:browser-test")).foundation,
  );
  await page.evaluate(() => {
    const original = File.prototype.text;
    File.prototype.text = function () {
      const file = this;
      return new Promise((resolve) => {
        window.finishImport = async () => {
          File.prototype.text = original;
          resolve(await original.call(file));
        };
      });
    };
  });
  await page.getByRole("button", { name: /审核变更/ }).click();
  await page
    .locator(".review-grid input[type=file]")
    .setInputFiles({
      name: "foundation.json",
      mimeType: "application/json",
      buffer: Buffer.from(JSON.stringify(foundation)),
    });
  page.once("dialog", (dialog) => dialog.accept("review-race"));
  await page.getByRole("button", { name: "＋", exact: true }).click();
  await page.evaluate(() => window.finishImport());
  await page
    .getByRole("alert")
    .filter({ hasText: "文件读取期间项目或主题已变化" })
    .waitFor();
  assert.equal(await page.getByLabel("选择项目").inputValue(), "review-race");
  await page.getByRole("button", { name: "保存", exact: true }).click();
  assert.equal(
    await page.evaluate(
      () =>
        JSON.parse(localStorage.getItem("hh-studio:review-race")).foundation,
    ),
    undefined,
  );
  assert.deepEqual(errors, []);
  console.log(
    "PASS: edit, undo/redo, mode isolation, persistence, CSS warnings, JSON download, 5 scenes, compare, inspector, preview bridge, approval, mobile, no page errors",
  );
} finally {
  await browser.close();
}
