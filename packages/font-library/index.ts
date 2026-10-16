import catalog from "./catalog.json";

export type OpenFont = (typeof catalog)[number];
export const openFonts = catalog;
export function previewFontFamily(font: OpenFont): string {
  return `HH Preview ${font.family}`;
}
export function previewFontStack(stack: string): string {
  const active = fontsInStack(stack);
  if (!active.length) return stack;
  return stack
    .split(",")
    .map((family) => {
      const name = family
        .trim()
        .replace(/^['"]|['"]$/g, "")
        .toLowerCase();
      const font = active.find((item) => item.family.toLowerCase() === name);
      return font ? `"${previewFontFamily(font)}"` : family.trim();
    })
    .join(", ");
}
export function previewFontVariables(
  values: Record<string, string>,
): Record<string, string> {
  return Object.fromEntries(
    Object.entries(values).map(([key, value]) => [
      key,
      key.startsWith("--font-") ? previewFontStack(value) : value,
    ]),
  );
}
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
