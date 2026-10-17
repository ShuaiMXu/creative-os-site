import { chromium } from "playwright-core";
import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";

const browser = await chromium.launch({
  channel: process.env.BROWSER_CHANNEL || "chrome",
  headless: true,
});
const base = process.env.STUDIO_URL || "http://127.0.0.1:4193/apps/studio/";
try {
  for (const width of [1280, 390]) {
    const context = await browser.newContext({
      viewport: { width, height: 1000 },
      colorScheme: "dark",
    });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(`${base}?project=font-picker-check`);
    if (width < 700)
      await page.getByRole("button", { name: "编辑", exact: true }).click();
    await page.getByRole("button", { name: "字体", exact: true }).click();
    const selected = {};
    for (const key of ["font-sans", "font-serif", "font-mono"]) {
      const select = page.locator(`#${key}-select`);
      const option = await select
        .locator("option")
        .nth(2)
        .getAttribute("value");
      await select.selectOption(option);
      selected[key] = option;
      await page.waitForFunction(
        ([key, value]) =>
          document
            .querySelector(".theme-preview")
            .style.getPropertyValue(`--${key}`) === value,
        [key, option],
      );
      assert.equal(await page.locator(`#${key}-custom`).inputValue(), option);
      assert.equal(
        await page
          .locator(`#token-${key} .font-specimen`)
          .evaluate((node) => node.style.fontFamily),
        await select.evaluate((node) => {
          const test = document.createElement("span");
          test.style.fontFamily = node.value;
          return test.style.fontFamily;
        }),
      );
    }
    const input = page.locator("#font-sans-custom");
    await page.locator("#font-sans-select").selectOption("custom");
    assert.equal(
      await input.evaluate((node) => node === document.activeElement),
      true,
    );
    const custom = '"Example Font", Georgia, serif';
    await input.fill(custom);
    await page.waitForFunction(
      (value) =>
        document
          .querySelector(".theme-preview")
          .style.getPropertyValue("--font-sans") === value,
      custom,
    );
    assert.equal(
      await input.evaluate((node) => node === document.activeElement),
      true,
      "custom changes apply without blur",
    );
    await page.getByRole("button", { name: "撤销", exact: true }).click();
    await page.waitForFunction(
      (value) => document.querySelector("#font-sans-custom").value === value,
      selected["font-sans"],
    );
    assert.equal(await input.inputValue(), selected["font-sans"]);
    await page.getByRole("button", { name: "重做", exact: true }).click();
    await page.waitForFunction(
      (value) => document.querySelector("#font-sans-custom").value === value,
      custom,
    );
    assert.equal(await input.inputValue(), custom);
    await input.fill("Arial; color: red");
    assert.equal(await input.getAttribute("aria-invalid"), "true");
    assert.equal(
      await page
        .locator(".theme-preview")
        .evaluate((node) => node.style.getPropertyValue("--font-sans")),
      custom,
    );
    await input.fill(custom);
    await page.getByRole("button", { name: "保存", exact: true }).click();
    const saved = await page.evaluate(() => JSON.parse(localStorage.getItem("hh-studio:font-picker-check")));
    assert.equal(saved.styles.light["font-sans"], custom);
    assert.equal(saved.styles.dark["font-sans"], custom, "fonts stay synchronized across modes");
    await page.reload();
    if (width < 700)
      await page.getByRole("button", { name: "编辑", exact: true }).click();
    await page.getByRole("button", { name: "字体", exact: true }).click();
    assert.equal(await input.inputValue(), custom);
    await page.getByRole("button", { name: "English", exact: true }).click();
    assert.equal(
      await page.locator("#font-sans-select option:checked").innerText(),
      "Custom font",
    );
    assert.equal(
      await input.inputValue(),
      custom,
      "language changes preserve custom fonts",
    );
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      true,
    );
    if (width === 1280) {
      await mkdir("test-results/fonts", { recursive: true });
      await page.screenshot({ path: "test-results/fonts/editor.png" });
    }
    assert.deepEqual(errors, []);
    await context.close();
  }
  console.log(
    "PASS: font selection, immediate custom preview, invalid input recovery, undo/redo, persistence, localization and mobile layout.",
  );
} finally {
  await browser.close();
}
