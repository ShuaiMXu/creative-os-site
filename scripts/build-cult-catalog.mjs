import fs from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";
import ts from "typescript-compiler";
import { compile } from "@tailwindcss/node";

const root = path.resolve(import.meta.dirname, "..");
const upstream = path.join(root, "vendor/cult-ui/upstream");
const generated = path.join(root, "components/preview/generated");
const output = path.join(root, "public/components/cult-ui");
const read = async (name) => fs.readFile(path.join(upstream, name), "utf8");
const registry = JSON.parse(await read("registry.json"));
const provenance = JSON.parse(await read("provenance.json"));
// Builds are offline. Fail on modified upstream snapshots instead of silently updating.
for (const [name, hash] of Object.entries(provenance.hashes)) {
  const bytes = await fs.readFile(path.join(upstream, name));
  if (createHash("sha256").update(bytes).digest("hex") !== hash)
    throw new Error(`Source integrity: ${name}`);
}
await fs.mkdir(generated, { recursive: true });
await fs.mkdir(output, { recursive: true });
await fs.mkdir(path.join(root,'public/textures'),{recursive:true});
for(const name of ['fabric-of-squares','grid-noise','inflicted','debut-light','groovepaper']) await fs.copyFile(path.join(upstream,`texture-${name}.png`),path.join(root,'public/textures',`${name}.png`));
await fs.mkdir(path.join(output,'fonts'),{recursive:true});
for (const variant of ['Square','Grid','Circle','Triangle','Line']) await fs.copyFile(path.join(root,'node_modules/geist/dist/fonts/geist-pixel',`GeistPixel-${variant}.woff2`),path.join(output,'fonts',`GeistPixel-${variant}.woff2`));
await fs.copyFile(path.join(root,'node_modules/geist/LICENSE.txt'),path.join(output,'fonts','LICENSE.txt'));
const allowed = new Set([
  "react",
  "@radix-ui/react-slider",
  "sonner", "sonner/dist/styles.css", "@radix-ui/react-checkbox", "@radix-ui/react-avatar", "@radix-ui/react-tooltip", "@radix-ui/react-select", "@radix-ui/react-switch",
  "@radix-ui/react-scroll-area",
  "motion/react",
  "lucide-react",
  "clsx",
  "tailwind-merge",
  "class-variance-authority",
  "@radix-ui/react-slot",
  "@radix-ui/react-use-controllable-state",
  "@radix-ui/react-label",
  "radix-ui",
  "react-use-measure",
]);
const extraPackages = ['poline','jotai','three','embla-carousel-autoplay','embla-carousel-react','react-wrap-balancer','@hugeicons/core-free-icons','@hugeicons/react','@radix-ui/react-icons','metal-fx','vaul','@paper-design/shaders-react','@tabler/icons-react','cobe','cmdk','border-beam','motion/react-client'];
for (const name of extraPackages) allowed.add(name);
for (const name of ['accordion','tabs','toast','popover','separator','dialog','hover-card','collapsible','aspect-ratio','progress']) allowed.add('@radix-ui/react-'+name);
const adapters = {'next/image':'image','next/link':'link','next-themes':'theme','next/navigation':'navigation','react-player/lazy':'player'};
const modules = new Map();
const snapshots = new Map();
for (const entry of registry.items) {
  const snapshot = JSON.parse(await read(`${entry.name}.json`));
  snapshots.set(entry.name, snapshot);
  for (const file of snapshot.files || []) {
    if (file.path.endsWith(".tsx") || file.path.endsWith(".ts"))
      modules.set(file.path.replace(/\.tsx?$/, ""), file.content);
  }
  // Full source snapshots are available on our own site, including non-preview entries.
  await fs.copyFile(
    path.join(upstream, `${entry.name}.json`),
    path.join(output, `${entry.name}.json`),
  );
}
for (const name of ["button", "input", "label", "badge", "card", "slider", "textarea", "checkbox", "avatar", "tooltip", "select", "switch"])
  modules.set(`components/ui/${name}`, await read(`support-${name}.tsx`));
for (const [key, file] of Object.entries(JSON.parse(await fs.readFile(path.join(root,'vendor/cult-ui/support-modules.json'),'utf8')))) modules.set(key,await read(file));
for (const name of [...Object.values(adapters),'storage','base-select-demo','base-tooltip-demo']) modules.set('preview-adapters/'+name, await fs.readFile(path.join(root,'components/preview/adapters',name+'.tsx'),'utf8'));
// Only the introductory sample needs storage. Keep it ephemeral in this preview document.
for (const key of ['registry/default/ui/intro-disclosure','registry/default/example/intro-disclosure-demo']) modules.set(key, 'import {previewStorage} from "@/preview-adapters/storage";\n'+modules.get(key).replaceAll('localStorage', 'previewStorage'));
modules.set(
  "lib/utils",
  'import { clsx } from "clsx"; import { twMerge } from "tailwind-merge"; export function cn(...inputs) { return twMerge(clsx(inputs)); }',
);
const imports = (code) => {
  const source = ts.createSourceFile(
    "component.tsx",
    code,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
  return source.statements
    .filter(
      (x) =>
        (ts.isImportDeclaration(x) && !x.importClause?.isTypeOnly) ||
        ts.isExportDeclaration(x),
    )
    .filter((x) => x.moduleSpecifier && ts.isStringLiteral(x.moduleSpecifier))
    .map((x) => x.moduleSpecifier.text);
};
function localKey(from, specifier) {
  if (adapters[specifier]) return "preview-adapters/"+adapters[specifier];
  if (specifier.startsWith("@/")) return specifier.slice(2);
  if (specifier.startsWith("."))
    return path.posix
      .normalize(path.posix.join(path.posix.dirname(from), specifier))
      .replace(/\.tsx?$/, "");
  return null;
}
function inspect(key, visited = new Set()) {
  if (visited.has(key)) return [];
  visited.add(key);
  const code = modules.get(key);
  if (code === undefined) return [`module:${key}`];
  const reasons = [];
  // Components that need network, execution or host storage get source-only listings.
  if (
    key !== "registry/default/example/bg-image-texture-demo" && /\bfetch\s*\(|\bWebSocket\b|\blocalStorage\b|\bsessionStorage\b|\beval\s*\(|dangerouslySetInnerHTML|window\.open\s*\(/.test(
      code,
    )
  )
    reasons.push("host-api");
  for (const specifier of imports(code)) {
    const local = localKey(key, specifier);
    if (local) reasons.push(...inspect(local, visited));
    else if (
      !allowed.has(specifier) &&
      !specifier.startsWith("@base-ui/react/")
    )
      reasons.push(`dependency:${specifier}`);
  }
  return [...new Set(reasons)];
}
function category(name) {
  if (/button/.test(name)) return "buttons";
  if (
    /input|field|select|switch|toggle|dropzone|composer|search|picker/.test(
      name,
    )
  )
    return "inputs";
  if (/card|voting|vote|poll/.test(name)) return "cards";
  if (/tabs|dock|toolbar|segmented/.test(name)) return "navigation";
  if (
    /popover|panel|drawer|expandable|disclosure|onboarding|wizard|island|surface/.test(
      name,
    )
  )
    return "overlays";
  if (
    /text|heading|paragraph|typewriter|number|badge|timer|terminal|code-block/.test(
      name,
    )
  )
    return "type";
  if (
    /illustration|gateway|circuit|fluid|security|bubbles|globe|icons|apple|mac-screen|speech/.test(
      name,
    )
  )
    return "illustrations";
  if (/hero|marketing|feature|chart|kanban|collab/.test(name))
    return "sections";
  return "effects";
}
const selectedModules = new Set();
const catalog = [];
const previewImports = [];
for (const item of registry.items.filter((x) => x.type === "registry:ui")) {
  const snapshot = snapshots.get(item.name);
  const alias = !snapshot.files?.length
    ? snapshot.registryDependencies?.[0]?.match(/\/([^/]+)\.json$/)?.[1]
    : null;
  const demoName =
    item.name === "hero-color-panel"
      ? "hero-color-panels-demo"
      : `${item.name}-demo`;
  const demo = snapshots.get(demoName);
  const demoFile = (["base-select","base-tooltip"].includes(item.name) ? "preview-adapters/"+item.name+"-demo" : null) || demo?.files
    ?.find((x) => x.path.endsWith(".tsx"))
    ?.path.replace(/\.tsx$/, "");
  const graph = new Set();
  const reasons = alias
    ? ["alias"]
    : demoFile
      ? inspect(demoFile, graph)
      : ["no-demo"];
  const available = reasons.length === 0;
  if (available) {
    graph.forEach((x) => selectedModules.add(x));
    const namedExport =
      item.name === "terminal-animation"
        ? ".then(m => ({default:m.TerminalAnimationDemo}))"
        : "";
    previewImports.push(
      `  ${JSON.stringify(item.name)}: () => import('./${demoFile}.jsx')${namedExport},`,
    );
  }
  catalog.push({
    id: item.name,
    title: item.name
      .split("-")
      .map((x) => x[0].toUpperCase() + x.slice(1))
      .join(" "),
    category: category(alias || item.name),
    description: item.description || snapshot.description || "",
    aliasOf: alias || null,
    preview: available,
    previewAdaptations: available ? [
      'Isolated browser document; original downloadable source is unchanged.',
      'Sample images and video are local fixtures; no live external service is connected.',
      ...([...graph].some(key=>key.startsWith('preview-adapters/')) ? ['Framework adapters apply only to the gallery; target integration must resolve its own framework.'] : []),
      ...(item.name.startsWith('pixel-') ? ['Geist Pixel font assets are loaded locally.'] : []),
      ...(['base-select','base-tooltip'].includes(item.name) ? ['HappyHands-authored usage example of the original component.'] : []),
      ...(item.name==='tweet-grid' ? ['The pinned upstream TweetGrid is itself a mock renderer, not a live tweet embed.'] : []),
      ...(item.name==='mac-screen' ? ['Device frame is a locally authored illustration.'] : []),
    ] : [],
    limitations: [...new Set(reasons)],
    dependencies: snapshot.dependencies || item.dependencies || [],
    registryDependencies: snapshot.registryDependencies || [],
    source: `/components/cult-ui/${item.name}.json`,
    demoSource: demo ? `/components/cult-ui/${demoName}.json` : null,
    revision: provenance.revision,
    license: "MIT",
    sourceSha256: provenance.hashes[`${item.name}.json`],
    integration: {
      status: "candidate",
      approval: "required",
      automaticUse: false,
      checks: [
        "framework-and-dependencies",
        "design-token-mapping",
        "keyboard-and-touch",
        "reduced-motion",
        "responsive-layout",
        "target-project-review",
      ],
    },
  });
}
let allCode = "";
for (const key of selectedModules) {
  let code = modules.get(key);
  if (key === "registry/default/example/globe-demo") code = code.replace("  className,", "  className = '',");
  const source = ts.createSourceFile(
    `${key}.tsx`,
    code,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
  const rewrites = [];
  for (const statement of source.statements) {
    if (
      !(
        ts.isImportDeclaration(statement) || ts.isExportDeclaration(statement)
      ) ||
      !statement.moduleSpecifier
    )
      continue;
    const specifier = statement.moduleSpecifier.text;
    const local = localKey(key, specifier);
    if (!local) continue;
    let relative = path.posix.relative(path.posix.dirname(key), local) + ".jsx";
    if (!relative.startsWith(".")) relative = "./" + relative;
    rewrites.push([
      statement.moduleSpecifier.getStart(source),
      statement.moduleSpecifier.end,
      JSON.stringify(relative),
    ]);
  }
  for (const [start, end, value] of rewrites.reverse())
    code = code.slice(0, start) + value + code.slice(end);
  // Sample artwork is ours; never copy an unrelated upstream image without an asset license.
  code = code.replaceAll("/basic-img.png", "/components/cult-ui/sample.svg");
  code = code.replace(
    /(["'])\/placeholder\.svg[^"']*\1/g,
    '"/components/cult-ui/sample.svg"',
  );
  code = code.replace(
    /(["'])(https?:\/\/(?:images\.unsplash\.com|i\.pravatar\.cc|images\.pexels\.com|pisces\.bbystatic\.com)[^"']+)\1/g,
    '"/components/cult-ui/sample.svg"',
  );
  code = code.replace(
    /(["'])https:\/\/products\.ls\.graphics\/[^"']+\1/g,
    '"/components/cult-ui/sample.svg"',
  );
  code = code.replace(
    /`https:\/\/i\.pravatar\.cc\/[^`]+`/g,
    '"/components/cult-ui/sample.svg"',
  );
  // Review media locally: no third-party images, tracking embeds or videos execute here.
  code = code.replace(/(["'])https?:\/\/[^"']+\.(?:mp4|webm)(?:\?[^"']*)?\1/g, '"/components/cult-ui/sample.webm"');
  code = code.replace(/(["'])(?:https?:\/\/[^"']+\.(?:png|jpe?g|gif|webp|svg)(?:\?[^"']*)?|\/(?:feature-\d|basic-img|placeholder|component-frames\/[^"']+)\.(?:png|svg))\1/g, '"/components/cult-ui/sample.svg"');
  code = code.replace(/(["'])\/(?:placeholders|product-images|images)\/[^"']+\.(?:png|jpe?g|gif|webp|svg)\1/g, '"/components/cult-ui/sample.svg"');
  code = code.replace(/`\/images\/gibli\/[^`]+`/g, '"/components/cult-ui/sample.svg"');
  code = code.replaceAll('"/cult-icon.svg"', '"/components/cult-ui/sample.svg"');
  code = code.replace(/(["'])https:\/\/player\.vimeo\.com\/video\/[^"']+\1/g, '"/components/cult-ui/sample.webm"');
  code = code.replace(/`https:\/\/picsum\.photos\/[^`]+`/g, '"/components/cult-ui/sample.svg"');
  if (key === 'registry/default/ui/mac-screen') code = code.replace('src="/components/cult-ui/sample.svg"', 'src="/components/cult-ui/device-frame.svg"');
  if (key === 'registry/default/ui/youtube-video-player') {
    code = code.replace(/`https:\/\/i\.ytimg\.com[^`]+`/g, '"/components/cult-ui/sample.svg"')
      .replace(/<iframe/g, '<video controls').replace(/<\/iframe>/g, '</video>')
      .replace(/`https:\/\/www\.youtube\.com\/embed\/[^`]+`/g, '"/components/cult-ui/sample.webm"');
  }
  const result = ts.transpileModule(code, {
    compilerOptions: {
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.ESNext,
      jsx: ts.JsxEmit.ReactJSX,
    },
  });
  const destination = path.join(generated, key + ".jsx");
  await fs.mkdir(path.dirname(destination), { recursive: true });
  await fs.writeFile(
    destination,
    "// Generated from pinned Cult UI MIT source. See vendor/cult-ui/README.md.\n" +
      result.outputText,
  );
  allCode += code + "\n";
}
await fs.writeFile(
  path.join(generated, "loaders.ts"),
  "export const previews: Record<string, () => Promise<{default: React.ComponentType}>> = {\n" +
    previewImports.join("\n") +
    "\n};\n",
);
const packageJson = JSON.parse(
  await fs.readFile(path.join(root, "package.json"), "utf8"),
);
await fs.writeFile(
  path.join(output, "catalog.json"),
  JSON.stringify(
    {
      schemaVersion: 1,
      source: "Cult UI",
      revision: provenance.revision,
      count: catalog.length,
      previewCount: catalog.filter((x) => x.preview).length,
      previewEnvironment: {
        dependencies: packageJson.dependencies,
        isolation: "separate-document",
        sampleMedia: "locally-authored",
        defaultMotion: "reduced",
        approvedForTargetProject: false,
      },
      items: catalog,
    },
    null,
    2,
  ) + "\n",
);
await fs.copyFile(
  path.join(upstream, "LICENSE.md"),
  path.join(output, "LICENSE.txt"),
);
await fs.copyFile(
  path.join(upstream, "provenance.json"),
  path.join(output, "provenance.json"),
);
// Tailwind's reset and upstream utilities are compiled only into the isolated preview document.
let css = await read("globals.css");
css = css
  .replace('@import "tailwindcss";', '@import "tailwindcss" source(none);');
const compiler = await compile(css, { base: root, onDependency() {} });
await fs.writeFile(
  path.join(generated, "preview.css"),
  compiler.build([...new Set(allCode.match(/[^\s"'`<>]+/g) || [])]),
);
console.log(
  `Catalog: ${catalog.length} entries; ${catalog.filter((x) => x.preview).length} local source previews; ${selectedModules.size} modules`,
);
console.log(
  catalog
    .filter((x) => x.preview)
    .map((x) => x.id)
    .join(", "),
);
