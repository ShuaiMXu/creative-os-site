import { chromium } from "playwright-core";
import assert from "node:assert/strict";
const browser = await chromium.launch({
  channel: process.env.BROWSER_CHANNEL || "chrome",
  headless: true,
});
try {
  const page = await browser.newPage({
    viewport: { width: 1468, height: 1121 },
  });
  await page.addInitScript(() => localStorage.setItem("pd-lang", "zh"));
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(
    `${process.env.STUDIO_URL || "http://127.0.0.1:4212/apps/studio/"}?project=instant-preset-check`,
  );
  const preset = page.getByLabel("主题预设", { exact: true });
  await preset.waitFor();
  assert.equal(await page.locator(".preset-bar button").count(), 0);
  const initial = await preset.inputValue();
  const token = () =>
    page
      .locator(".theme-preview")
      .first()
      .evaluate((e) => e.style.getPropertyValue("--primary"));
  const before = await token();
  const options = await preset
    .locator("option")
    .evaluateAll((es) => es.map((e) => e.value));
  const target =
    options.find((x) => x === "violet-bloom") ||
    options.find((x) => x !== initial && x !== "custom");
  await preset.selectOption(target);
  assert.notEqual(await token(), before);
  await page.getByRole("button", { name: "撤销", exact: true }).click();
  assert.equal(await token(), before);
  assert.equal(await preset.inputValue(), initial);
  await page.getByRole("button", { name: "重做", exact: true }).click();
  assert.equal(await preset.inputValue(), target);
  assert.equal(await page.locator(".component-specimen article").count(), 6);
  await page.getByRole("switch", { name: "接收更新通知" }).click();
  assert.equal(
    await page.getByRole("switch").getAttribute("aria-checked"),
    "false",
  );
  await page.getByLabel("搜索示例页面").fill("不存在");
  await page.getByText("没有匹配的页面").waitFor();
  await page.getByRole("button", { name: "打开示例弹窗" }).click();
  assert.equal(await page.locator("dialog").evaluate((e) => e.open), true);
  await page.keyboard.press("Escape");
  assert.equal(await page.locator("dialog").evaluate((e) => e.open), false);
  await page.getByRole("button", { name: "打开示例弹窗" }).click();
  await page
    .locator("dialog")
    .getByRole("button", { name: "确认", exact: true })
    .click();
  await page.getByText("示例设置已确认").waitFor();
  await page.screenshot({
    path: "test-results/studio-instant-preset.png",
    fullPage: true,
  });
  await page.setViewportSize({ width: 390, height: 844 });
  assert.equal(
    await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
    false,
  );
  assert.deepEqual(errors, []);
  console.log(
    "PASS immediate preset, undo/redo, six component groups, switch, search, dialog, mobile overflow",
  );
} finally {
  await browser.close();
}
