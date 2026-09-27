import { chromium } from "playwright-core";
import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
const browser = await chromium.launch({
  channel: process.env.BROWSER_CHANNEL || "msedge",
  headless: true,
});
const context = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
  colorScheme: "light",
});
const page = await context.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
try {
  await page.goto("http://127.0.0.1:4173/apps/studio/?project=brand-check");
  await page
    .getByRole("heading", { name: "项目设计系统", exact: true })
    .waitFor();
  assert.equal(
    await page.locator(".wordmark img").getAttribute("src"),
    "/brand/happyhands-logo-ink.png",
  );
  assert.equal(
    await page
      .locator(".theme-preview")
      .evaluate((el) => el.style.getPropertyValue("--primary")),
    "#161616",
  );
  await page.getByRole("button", { name: "设计规范", exact: true }).click();
  await page
    .getByText("已执行的自动检查未发现偏离", { exact: false })
    .waitFor();
  await page
    .getByRole("textbox", { name: "primary", exact: true })
    .fill("#F57F28");
  await page
    .getByRole("textbox", { name: "primary", exact: true })
    .press("Tab");
  await page
    .locator(".standards-results article[data-status=attention]")
    .first()
    .waitFor();
  await page
    .getByRole("button", { name: "应用 HappyHands 主题（可撤销）" })
    .click();
  await page
    .getByText("已执行的自动检查未发现偏离", { exact: false })
    .waitFor();
  assert.ok(
    (await page
      .locator(".studio-shell > .studio-title [data-variant=primary]")
      .count()) === 0,
  );
  await mkdir("test-results", { recursive: true });
  await page.screenshot({
    path: "test-results/studio-standards.png",
    fullPage: true,
  });
  await page.getByRole("button", { name: "关闭面板" }).click();
  await page.getByLabel("预览场景").selectOption("States");
  await page.getByRole("button", { name: "新建审阅示例" }).click();
  await page.locator(".state-example[aria-busy=true]").waitFor();
  await page.getByRole("button", { name: "取消示例" }).click();
  await page.getByRole("heading", { name: "还没有设计审阅" }).waitFor();
  await page.getByRole("button", { name: "错误", exact: true }).click();
  await page.locator(".state-example [role=alert]").waitFor();
  await page.getByRole("button", { name: "重试示例" }).click();
  await page.getByRole("heading", { name: "示例审阅已完成" }).waitFor();
  await page.getByRole("button", { name: "禁用", exact: true }).click();
  assert.ok(
    await page
      .getByRole("button", { name: "开始审阅", exact: true })
      .isDisabled(),
  );
  await page.getByLabel("预览场景").selectOption("Components");
  await page.screenshot({
    path: "test-results/studio-brand-light.png",
    fullPage: true,
  });
  const before = await page
    .locator(".theme-preview")
    .evaluate((el) => el.style.getPropertyValue("--primary"));
  await page.getByLabel("切换工作台外观").click();
  await page.waitForFunction(
    () => document.documentElement.dataset.hhTheme === "dark",
  );
  assert.equal(
    await page
      .locator(".theme-preview")
      .evaluate((el) => el.style.getPropertyValue("--primary")),
    before,
  );
  assert.equal(
    await page
      .locator(".studio-header")
      .evaluate((el) => getComputedStyle(el).backgroundColor),
    "rgb(22, 22, 22)",
  );
  await page.screenshot({
    path: "test-results/studio-brand-dark.png",
    fullPage: true,
  });
  await page.reload();
  await page.waitForFunction(
    () => document.documentElement.dataset.hhTheme === "dark",
  );
  await page.setViewportSize({ width: 390, height: 844 });
  assert.ok(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  );
  await page.screenshot({
    path: "test-results/studio-brand-mobile.png",
    fullPage: true,
  });
  const portal = await context.newPage();
  portal.on("pageerror", (e) => errors.push(e.message));
  await portal.goto("http://127.0.0.1:4173/apps/portal/");
  await portal.waitForFunction(
    () => document.documentElement.dataset.theme === "dark",
  );
  assert.equal(
    await portal.evaluate(() =>
      getComputedStyle(document.documentElement)
        .getPropertyValue("--hh-bg")
        .trim(),
    ),
    "#111111",
  );
  await portal.locator("#theme-toggle").click();
  await page.waitForFunction(
    () => document.documentElement.dataset.hhTheme === "light",
  );
  assert.equal(
    await portal.evaluate(() =>
      getComputedStyle(document.documentElement)
        .getPropertyValue("--hh-bg")
        .trim(),
    ),
    "#F7F6F3",
  );
  assert.deepEqual(errors, []);
  console.log(
    "PASS: brand defaults, standards drift/apply, single primary action, empty/loading/error/disabled recovery, independent shell theme, persistence, mobile layout.",
  );
} finally {
  await browser.close();
}
