import test from "node:test";
import assert from "node:assert/strict";
import handler, { normalizeDesign, normalizeDesignResponse } from "../api/kage.mjs";
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

test("detail preserves content for direct and wrapped upstream results", () => {
  const source = {slug:"reference-page",title:"Reference page",description:"Full page",screenshot_url:"https://example.com/page.png",page_url:"https://example.com/",prompt:"# Design analysis"};
  for (const response of [source, {design:source}]) {
    const result=normalizeDesignResponse(response).design;
    assert.equal(result.slug,source.slug);
    assert.equal(result.title,source.title);
    assert.equal(result.description,source.description);
    assert.equal(result.fullImage,source.screenshot_url);
    assert.equal(result.source,source.page_url);
    assert.equal(result.prompt,source.prompt);
  }
  for (const invalid of [null, {}, {design:{}}, {design:{slug:"missing-title"}}]) {
    assert.throws(()=>normalizeDesignResponse(invalid),/Invalid Kage design response/);
  }
});

 test("normalizes section images without accepting unsafe URLs", () => {
 const result = normalizeDesign({full_page_url:"https://example.com/full.webp", source_url:"javascript:alert(1)", components:[null,{slug:"hero", image_url:"javascript:alert(1)",page_url:"https://user:pass@example.com",prompt:"Source analysis"}]});
 assert.equal(result.fullPageImage,"https://example.com/full.webp");
 assert.equal(result.website,null);
 assert.equal(result.components.length,1);
 assert.equal(result.components[0].image,null);
 assert.equal(result.components[0].source,null);
 assert.equal(result.components[0].prompt,"Source analysis");
});
