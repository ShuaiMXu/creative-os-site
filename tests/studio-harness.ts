import { mkdtemp, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { resolve, join } from "node:path";
import { pathToFileURL } from "node:url";
import assert from "node:assert/strict";
import {
  newDraft,
  approve,
  validateFoundation,
} from "../packages/theme-core/project.ts";
const root = resolve(process.env.HARNESS_ROOT || "../creative-os");
const { createRun, saveFoundationApproval, loadRun } = await import(
  pathToFileURL(join(root, "packages/harness-core/store.js")).href
);
const { assertExperienceSpec, bootstrapBrief } = await import(
  pathToFileURL(join(root, "packages/experience-core/index.js")).href
);
const original = JSON.parse(
  await readFile(
    join(root, "examples/bootstrap-surface/foundation-approval.json"),
    "utf8",
  ),
);
const spec = JSON.parse(
  await readFile(
    join(root, "examples/bootstrap-surface/experience.json"),
    "utf8",
  ),
);
const draft = newDraft("integration", "Harness integration");
draft.foundation = validateFoundation(original);
const approval = approve(
  draft,
  "1.1.0",
  "Integration test",
  "Validate source integration",
  original.foundationVersion,
);
const outputRoot = await mkdtemp(join(tmpdir(), "happyhands-foundation-"));
const created = await createRun({
  spec,
  outputRoot,
  id: "studio-integration",
  mode: "bootstrap",
});
await saveFoundationApproval(created.directory, approval);
const run = await loadRun(created.directory);
assertExperienceSpec(run.spec);
assert.equal(run.manifest.foundationApproval.foundationVersion, "1.1.0");
assert.deepEqual(run.spec.designFoundation.brand, original.foundation.brand);
assert.deepEqual(
  run.spec.designFoundation.components,
  original.foundation.components,
);
assert.ok(
  run.spec.designFoundation.tokens.some((t) => t.name === "theme.dark.primary"),
);
assert.match(
  bootstrapBrief(run.spec, { approval: run.manifest.foundationApproval }),
  /theme.dark.primary/,
);
console.log(
  "PASS: Studio approval → real Harness saveFoundationApproval → persisted Experience Spec → bootstrap brief; original brand/components preserved.",
);
console.log(`Isolated evidence: ${created.directory}`);
