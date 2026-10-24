// Fetch catalog metadata only. No component code, fonts or executable files.
import { writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
const system = process.argv[2] || "quartz";
if (!["quartz", "lime"].includes(system)) throw Error("Unknown design system");
const source = `https://design.how/r/${system}/registry.json`;
const response = await fetch(source, { signal: AbortSignal.timeout(30000) });
if (!response.ok) throw Error(`${system} registry HTTP ${response.status}`);
const bytes = await response.text(),
  document = JSON.parse(bytes);
if (!Array.isArray(document.items) || !document.items.length)
  throw Error("Missing registry entries");
const names = new Set();
const items = document.items.map(({ name, title, type }) => {
  if (
    !/^[a-z][a-z0-9-]{0,80}$/.test(name) ||
    names.has(name) ||
    typeof title !== "string" ||
    title.length > 160 ||
    !/^registry:(ui|component|block|lib|item)$/.test(type)
  )
    throw Error("Invalid or duplicate registry entry");
  names.add(name);
  return { name, title, type };
});
await writeFile(
  new URL(`../systems/${system}/catalog.json`, import.meta.url),
  JSON.stringify(
    {
      source,
      checkedAt: new Date().toISOString().slice(0, 10),
      sourceHash: createHash("sha256").update(bytes).digest("hex"),
      items,
    },
    null,
    2,
  ) + "\n",
);
console.log(
  `${system} metadata: ${items.length} entries. Review new or changed entries before publishing.`,
);
