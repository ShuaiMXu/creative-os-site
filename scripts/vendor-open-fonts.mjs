// Re-run to reproduce the checked-in font assets. Existing versions are pinned.
import { mkdir, readFile, writeFile, copyFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import path from "node:path";

const root = process.cwd();
const catalogPath = path.join(root, "packages/font-library/catalog.json");
const previous = existsSync(catalogPath)
  ? JSON.parse(await readFile(catalogPath, "utf8"))
  : [];
const definitions = [
  ["noto-sans-sc", "Noto Sans SC", "Noto Sans SC · 黑体", "chinese"],
  ["noto-serif-sc", "Noto Serif SC", "Noto Serif SC · 宋体", "chinese"],
  ["ma-shan-zheng", "Ma Shan Zheng", "马善政楷体", "chinese"],
  ["zcool-xiaowei", "ZCOOL XiaoWei", "站酷小薇", "chinese"],
  ["zcool-kuaile", "ZCOOL KuaiLe", "站酷快乐体", "chinese"],
  [
    "zcool-qingke-huangyou",
    "ZCOOL QingKe HuangYou",
    "站酷庆科黄油体",
    "chinese",
  ],
  ["inter", "Inter", "Inter", "sans"],
  ["geist", "Geist", "Geist", "sans"],
  ["dm-sans", "DM Sans", "DM Sans", "sans"],
  ["manrope", "Manrope", "Manrope", "sans"],
  ["plus-jakarta-sans", "Plus Jakarta Sans", "Plus Jakarta Sans", "sans"],
  ["source-sans-3", "Source Sans 3", "Source Sans 3", "sans"],
  ["noto-sans", "Noto Sans", "Noto Sans", "sans"],
  ["lora", "Lora", "Lora", "serif"],
  ["source-serif-4", "Source Serif 4", "Source Serif 4", "serif"],
  ["libre-baskerville", "Libre Baskerville", "Libre Baskerville", "serif"],
  ["playfair-display", "Playfair Display", "Playfair Display", "serif"],
  ["jetbrains-mono", "JetBrains Mono", "JetBrains Mono", "mono"],
  ["ibm-plex-mono", "IBM Plex Mono", "IBM Plex Mono", "mono"],
  ["fira-code", "Fira Code", "Fira Code", "mono"],
  ["space-mono", "Space Mono", "Space Mono", "mono"],
];
await mkdir(path.dirname(catalogPath), { recursive: true });
const output = [];
async function vendor([id, family, zh, category]) {
  const pinned = previous.find((font) => font.id === id);
  let packageName = pinned?.packageName || `@fontsource-variable/${id}`;
  let response = await fetch(
    `https://registry.npmjs.org/${packageName}/${pinned?.version || "latest"}`,
  );
  if (response.status === 404 && !pinned) {
    packageName = `@fontsource/${id}`;
    response = await fetch(`https://registry.npmjs.org/${packageName}/latest`);
  }
  if (!response.ok) throw Error(`Missing package: ${packageName}`);
  const metadata = await response.json();
  if (pinned && pinned.integrity !== metadata.dist.integrity)
    throw Error(`Pinned integrity changed: ${id}`);
  if (metadata.license !== "OFL-1.1")
    throw Error(`Review license for ${id}: ${metadata.license}`);
  const variable = packageName.startsWith("@fontsource-variable/");
  const scratch = path.join(root, "test-results/font-downloads", id);
  await mkdir(scratch, { recursive: true });
  const archive = path.join(scratch, "source.tgz");
  const download = await fetch(metadata.dist.tarball);
  if (!download.ok) throw Error(`Download failed: ${id}`);
  const bytes = Buffer.from(await download.arrayBuffer());
  const integrity = `sha512-${createHash("sha512").update(bytes).digest("base64")}`;
  if (integrity !== metadata.dist.integrity)
    throw Error(`Integrity mismatch: ${id}`);
  await writeFile(archive, bytes);
  const entries = execFileSync("tar", ["-tzf", archive], { encoding: "utf8" })
    .trim()
    .split(/\r?\n/);
  if (
    entries.some(
      (entry) =>
        !entry.startsWith("package/") || entry.split("/").includes(".."),
    )
  )
    throw Error(`Unexpected archive path: ${id}`);
  execFileSync("tar", ["-xzf", archive, "-C", scratch]);
  const source = path.join(scratch, "package");
  const license = await readFile(path.join(source, "LICENSE"), "utf8");
  if (!license.includes("SIL OPEN FONT LICENSE"))
    throw Error(`Missing OFL text: ${id}`);
  const cssFiles = variable
    ? ["index.css"]
    : [
        "400.css",
        ...(existsSync(path.join(source, "700.css")) ? ["700.css"] : []),
      ];
  let css = (
    await Promise.all(
      cssFiles.map((file) => readFile(path.join(source, file), "utf8")),
    )
  ).join("\n");
  if (css.includes("@import"))
    throw Error(`Unresolved stylesheet import: ${id}`);
  css = css
    .replace(/font-family:[^;]+;/g, `font-family: '${family}';`)
    .replace(/src:[^;]+;/g, (declaration) => {
      const url = declaration.match(/url\((['"]?)([^)'"\s]+\.woff2)\1\)/)?.[2];
      if (!url) throw Error(`Missing WOFF2 source: ${id}`);
      return `src: url('${url}') format('woff2');`;
    });
  const destination = path.join(root, "public/fonts", id);
  await mkdir(path.join(destination, "files"), { recursive: true });
  const assets = [
    ...new Set(
      [
        ...css.matchAll(/url\(['"]?(\.\/files\/[a-z0-9._-]+\.woff2)['"]?\)/g),
      ].map((match) => match[1]),
    ),
  ];
  if (!assets.length) throw Error(`No font assets: ${id}`);
  for (const asset of assets)
    await copyFile(path.join(source, asset), path.join(destination, asset));
  const stylesheet = `/* ${family}; ${packageName}@${metadata.version}; OFL-1.1. See LICENSE.txt. */\n${css}`;
  await writeFile(path.join(destination, "index.css"), stylesheet);
  await writeFile(path.join(destination, "LICENSE.txt"), license);
  await writeFile(
    path.join(destination, "preview.css"),
    stylesheet.replace(
      /font-family:[^;]+;/g,
      `font-family: ${JSON.stringify(`HH Preview ${family}`)};`,
    ),
  );
  const font = {
    id,
    family,
    zh,
    category,
    packageName,
    version: metadata.version,
    integrity,
    license: "OFL-1.1",
    source: `https://fontsource.org/fonts/${id}`,
    stylesheet: `/fonts/${id}/index.css`,
    licenseUrl: `/fonts/${id}/LICENSE.txt`,
  };
  console.log(`${id}: ${assets.length} files, ${metadata.version}, OFL-1.1`);
  return font;
}
// Bound concurrency to avoid overwhelming the registry or local disk.
for (let start = 0; start < definitions.length; start += 3)
  output.push(
    ...(await Promise.all(definitions.slice(start, start + 3).map(vendor))),
  );
await writeFile(catalogPath, JSON.stringify(output, null, 2) + "\n");
console.log(`Vendored ${output.length} open font families.`);
