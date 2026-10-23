import { mkdir, readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";

// Updating this revision is an explicit review operation, never part of a build.
const revision = "7f031dc812f7bda10213bab62752dd6d080297ff";
const root = new URL("../vendor/cult-ui/upstream/", import.meta.url);
const base = `https://raw.githubusercontent.com/nolly-studio/cult-ui/${revision}/apps/www/public/r/`;
await mkdir(root, { recursive: true });
async function download(name, url = base + name) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${name}: ${response.status}`);
  const bytes = Buffer.from(await response.arrayBuffer());
  await writeFile(new URL(name, root), bytes);
  return createHash("sha256").update(bytes).digest("hex");
}
const registryHash = await download("registry.json");
const registry = JSON.parse(
  await readFile(new URL("registry.json", root), "utf8"),
);
const queue = [...registry.items];
const hashes = { "registry.json": registryHash };
await Promise.all(
  Array.from({ length: 6 }, async () => {
    while (queue.length) {
      const item = queue.shift();
      if (!/^[a-z0-9-]+$/.test(item.name))
        throw new Error("Unsafe registry name");
      hashes[item.name + ".json"] = await download(item.name + ".json");
    }
  }),
);
const sourceBase = `https://raw.githubusercontent.com/nolly-studio/cult-ui/${revision}/`;
for (const name of ["button", "input", "label", "badge", "card", "slider", "textarea", "checkbox", "avatar", "tooltip", "select", "switch"]) {
  hashes[`support-${name}.tsx`] = await download(
    `support-${name}.tsx`,
    `${sourceBase}apps/www/components/ui/${name}.tsx`,
  );
}
const extraSupports = JSON.parse(await readFile(new URL("../vendor/cult-ui/support-modules.json", import.meta.url), "utf8"));
for (const [key, name] of Object.entries(extraSupports)) {
  try { hashes[name] = await download(name, `${sourceBase}apps/www/${key}.tsx`); }
  catch { hashes[name] = await download(name, `${sourceBase}apps/www/${key}.ts`); }
}
hashes["globals.css"] = await download(
  "globals.css",
  `${sourceBase}apps/www/styles/globals.css`,
);
for(const name of ['fabric-of-squares','grid-noise','inflicted','debut-light','groovepaper']) hashes[`texture-${name}.png`]=await download(`texture-${name}.png`,`${sourceBase}apps/www/public/textures/${name}.png`);
hashes["LICENSE.md"] = await download("LICENSE.md", `${sourceBase}LICENSE.md`);
await writeFile(
  new URL("provenance.json", root),
  JSON.stringify(
    {
      repository: "https://github.com/nolly-studio/cult-ui",
      revision,
      license: "MIT",
      hashes: Object.fromEntries(Object.entries(hashes).sort()),
    },
    null,
    2,
  ) + "\n",
);
console.log(`Pinned ${registry.items.length} registry entries at ${revision}`);
