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

test('cache and request budget bound upstream work and recover after a minute', async () => {
 const {createHandler}=await import('../api/kage.mjs');
 let time=0,calls=0;
 const api=createHandler({now:()=>time,search:async()=>{calls++;return {designs:[]}}});
 const request=async(query)=>{const headers={};const res={statusCode:200,setHeader(k,v){headers[k]=v},end(body){this.body=body}};await api({method:'GET',url:'/api/kage?query='+query},res);return {res,headers}};
 await request('same');await request('same');assert.equal(calls,1);
 for(let i=0;i<29;i++)await request('query'+i);
 const denied=await request('overflow');assert.equal(denied.res.statusCode,429);assert.equal(denied.headers['Cache-Control'],'no-store');
 time=60001;assert.equal((await request('overflow')).res.statusCode,200);
 time=300001;await request('same');assert.equal(calls,32);
});
test('upstream response size is bounded',async()=>{
 const {boundedText}=await import('../api/kage.mjs');
 assert.equal(await boundedText({body:[Buffer.from('ok')]}),'ok');
 await assert.rejects(()=>boundedText({body:[Buffer.alloc(2*1024*1024+1)]}),/too large/);
});
test('concurrent requests are capped and errors are not cached',async()=>{
 const {createHandler}=await import('../api/kage.mjs');
 let release;const gate=new Promise(r=>release=r);
 const api=createHandler({search:async()=>{await gate;throw Error('private upstream information')}});
 const res=()=>({statusCode:200,setHeader(){},end(body){this.body=body}});
 const pending=Array.from({length:4},()=>api({method:'GET',url:'/api/kage?query=test'},res()));
 const blocked=res();await api({method:'GET',url:'/api/kage?query=extra'},blocked);assert.equal(blocked.statusCode,429);
 release();await Promise.all(pending);
 const retry=res();await api({method:'GET',url:'/api/kage?query=test'},retry);assert.equal(retry.statusCode,502);assert.ok(!retry.body.includes('private'));
});
