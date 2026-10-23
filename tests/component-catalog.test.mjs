import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import Ajv from "ajv";
const catalog = JSON.parse(
  await readFile("public/components/cult-ui/catalog.json", "utf8"),
);
test("catalog satisfies the versioned Harness candidate contract", async () => {
  const validate = new Ajv({ allErrors: true }).compile(
    JSON.parse(await readFile("components/catalog.schema.json", "utf8")),
  );
  assert.ok(validate(catalog), JSON.stringify(validate.errors));
  assert.equal(new Set(catalog.items.map((x) => x.id)).size, catalog.count);
  assert.equal(
    catalog.items.filter((x) => x.preview).length,
    catalog.previewCount,
  );
  for (const item of catalog.items) {
    assert.equal(item.revision, catalog.revision);
    if (item.aliasOf)
      assert.ok(catalog.items.some((x) => x.id === item.aliasOf));
    if (item.preview) assert.equal(item.limitations.length, 0);
  }
});
test("published sources are byte-identical to the reviewed upstream snapshots", async () => {
  for (const item of catalog.items) {
    const published = await readFile("public" + item.source);
    assert.equal(
      createHash("sha256").update(published).digest("hex"),
      item.sourceSha256,
      item.id,
    );
  }
});

test("every canonical component has a runnable preview while aliases resolve to canonical entries", () => {
 const canonical=catalog.items.filter(item=>!item.aliasOf);
 assert.equal(canonical.length,137);
 assert.deepEqual(canonical.filter(item=>!item.preview).map(item=>item.id),[]);
 for(const alias of catalog.items.filter(item=>item.aliasOf)) assert.ok(canonical.find(item=>item.id===alias.aliasOf)?.preview,alias.id);
});
test("media and pixel fonts used by the expanded previews exist locally", async()=>{
 for(const path of ['sample.webm','device-frame.svg',...['Square','Grid','Circle','Triangle','Line'].map(v=>`fonts/GeistPixel-${v}.woff2`)])assert.ok((await readFile('public/components/cult-ui/'+path)).length>0,path);
});
