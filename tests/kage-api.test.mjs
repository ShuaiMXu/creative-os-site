import test from "node:test";
import assert from "node:assert/strict";
import handler, { normalizeDesign, getKage } from "../api/kage.mjs";
test("reference URLs cannot execute code or carry credentials", () => {
  const x = normalizeDesign({
    slug: "sample",
    page_url: "javascript:alert(1)",
    screenshot_url: "https://user:pass@example.com/a",
    styles: [null, "Minimal"],
    prompt: "# Reference",
  });
  assert.equal(x.source, null);
  assert.equal(x.image, null);
  assert.deepEqual(x.styles, ["Minimal"]);
  assert.equal(x.prompt, "# Reference");
});
test("reject invalid requests before contacting upstream", async () => {
  for (const url of [
    "/api/kage?slug=../../secret",
    "/api/kage?query=",
    "/api/kage?query=" + "x".repeat(161),
  ]) {
    const res = { setHeader() {}, end() {} };
    await handler({ method: "GET", url }, res);
    assert.equal(res.statusCode, 400);
  }
});
