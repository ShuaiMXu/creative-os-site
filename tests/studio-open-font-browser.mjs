import { openStudioActions } from "./studio-ui-helpers.mjs";
import { chromium } from "playwright-core";
import assert from "node:assert/strict";
import { readFile, mkdir } from "node:fs/promises";

const fonts = JSON.parse(
  await readFile(
    new URL("../packages/font-library/catalog.json", import.meta.url),
    "utf8",
  ),
);
assert.equal(fonts.length, 21);
assert.equal(new Set(fonts.map((font) => font.family)).size, fonts.length);
// License retention and complete, real WOFF2 assets are release requirements.
for (const font of fonts) {
  const css = await readFile(
    new URL(`../public${font.stylesheet}`, import.meta.url),
    "utf8",
  );
  const license = await readFile(
    new URL(`../public${font.licenseUrl}`, import.meta.url),
    "utf8",
  );
  assert.match(license, /SIL OPEN FONT LICENSE/);
  assert.match(css, /unicode-range:/);
  for (const [, asset] of css.matchAll(/url\('(.+?\.woff2)'\)/g)) {
    const bytes = await readFile(
      new URL(`../public/fonts/${font.id}/${asset}`, import.meta.url),
    );
    assert.equal(bytes.subarray(0, 4).toString(), "wOF2");
  }
}
const browser = await chromium.launch({
  channel: process.env.BROWSER_CHANNEL || "chrome",
  headless: true,
});
const base = process.env.STUDIO_URL || "http://127.0.0.1:4193/apps/studio/";
try {
  const context = await browser.newContext({
    viewport: { width: 1280, height: 1000 },
  });
  const page = await context.newPage();
  const errors = [],
    fontRequests = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("request", (request) => {
    if (request.url().includes("/fonts/")) fontRequests.push(request.url());
  });
  await page.goto(`${base}?project=open-font-check`);
  await page.getByRole("button", { name: "字体", exact: true }).click();
  assert.equal(
    fontRequests.length,
    0,
    "the library must not download before selection",
  );
  for (const font of fonts) {
    const key =
      font.category === "serif"
        ? "font-serif"
        : font.category === "mono"
          ? "font-mono"
          : "font-sans";
    const select = page.locator(`#${key}-select`);
    const value = await select
      .locator("option")
      .evaluateAll(
        (options, family) =>
          options
            .map((option) => option.value)
            .find((value) => value.startsWith(`"${family}",`)),
        font.family,
      );
    assert.ok(value, `${font.family} should be selectable`);
    await select.selectOption(value);
    await page.locator(`#token-${key} [data-font-state="ready"]`).waitFor();
    assert.equal(
      await page.evaluate(
        (family) =>
          [...document.fonts].some(
            (face) =>
              face.family.replaceAll(/["']/g, "") === `HH Preview ${family}` &&
              face.status === "loaded",
          ),
        font.family,
      ),
      true,
      `${font.family} must load real font faces`,
    );
    assert.equal(
      fontRequests.some(
        (url) =>
          url.includes(`/fonts/${font.id}/files/`) && url.endsWith(".woff2"),
      ),
      true,
    );
  }
  await openStudioActions(page);
  await page.getByRole("button", { name: "保存", exact: true }).click();
  assert.equal(
    await page.evaluate(() =>
      [...document.fonts].some(
        (face) => face.family.replaceAll(/["']/g, "") === "Noto Sans SC",
      ),
    ),
    false,
    "preview fonts must not register the shell's fallback family",
  );
  await page.reload();
  // Reload starts on the colors tab; saved fonts must load without opening typography.
  await page.waitForFunction(() =>
    [...document.fonts].some(
      (face) => face.family.includes("Space Mono") && face.status === "loaded",
    ),
  );
  await page.getByRole("button", { name: "字体", exact: true }).click();
  await page.locator("#token-font-mono summary").click();
  await page.evaluate(() => {
    window.copiedFontCode = "";
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: async (text) => {
          window.copiedFontCode = text;
        },
      },
    });
  });
  await page
    .locator("#token-font-mono")
    .getByRole("button", { name: "复制字体引用", exact: true })
    .click();
  assert.match(
    await page.evaluate(() => window.copiedFontCode),
    /\/fonts\/space-mono\/index.css/,
  );
  assert.match(
    await page.evaluate(() => window.copiedFontCode),
    /\/fonts\/noto-sans-sc\/index.css/,
  );
  await page.setViewportSize({ width: 390, height: 1000 });
  await page.getByRole("button", { name: "编辑", exact: true }).click();
  await page.getByRole("button", { name: "English", exact: true }).click();
  assert.equal(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
    true,
  );
  assert.equal(
    await page
      .locator("#token-font-mono")
      .innerText()
      .then((text) => /[\u3400-\u9fff]/.test(text)),
    false,
  );
  await mkdir("test-results/fonts", { recursive: true });
  await page.screenshot({ path: "test-results/fonts/open-library-mobile.png" });
  assert.deepEqual(errors, []);
  await context.close();

  const failure = await browser.newContext({
    viewport: { width: 1280, height: 1000 },
  });
  const failedPage = await failure.newPage();
  await failedPage.route("**/fonts/inter/**", (route) => route.abort());
  await failedPage.goto(`${base}?project=open-font-failure`);
  await failedPage.getByRole("button", { name: "字体", exact: true }).click();
  await failedPage
    .locator("#font-sans-select")
    .selectOption({ label: "Inter" });
  await failedPage
    .locator('#token-font-sans [data-font-state="error"]')
    .waitFor();
  await failedPage.unroute("**/fonts/inter/**");
  await failedPage
    .getByRole("button", { name: "重试加载", exact: true })
    .click();
  await failedPage
    .locator('#token-font-sans [data-font-state="ready"]')
    .waitFor();
  await failure.close();
  console.log(
    "PASS: 21 real open fonts, licenses/assets, lazy loading, saved fonts across tabs, import code, translated mobile UI, failure and retry.",
  );
} finally {
  await browser.close();
}
