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
