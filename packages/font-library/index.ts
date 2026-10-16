import catalog from "./catalog.json";

export type OpenFont = (typeof catalog)[number];
export const openFonts = catalog;
export function fontStack(font: OpenFont): string {
  const fallback =
    font.category === "serif" ||
    font.id === "noto-serif-sc" ||
    font.id === "zcool-xiaowei"
      ? '"Noto Serif SC", serif'
      : font.category === "mono"
        ? '"Noto Sans SC", monospace'
        : '"Noto Sans SC", sans-serif';
  // Keep a Chinese fallback for Latin-only families; avoid repeating the primary.
  return `"${font.family}", ${fallback}`.replace(
    `"${font.family}", "${font.family}",`,
    `"${font.family}",`,
  );
}
export function fontsInStack(stack: string): OpenFont[] {
  const families = new Set(
    stack.split(",").map((family) =>
      family
        .trim()
        .replace(/^['"]|['"]$/g, "")
        .toLowerCase(),
    ),
  );
  // Leave platform-first/system stacks unchanged; only activate a library primary.
  if (!openFonts.some((font) => font.family.toLowerCase() === [...families][0]))
    return [];
  return [...families].flatMap((family) =>
    openFonts.filter((font) => font.family.toLowerCase() === family),
  );
}
export function fontImports(stack: string, origin: string): string {
  return fontsInStack(stack)
    .map((font) => `@import url("${new URL(font.stylesheet, origin).href}");`)
    .join("\n");
}
