import {
  exportTheme,
  type ExportKind,
  type ThemeStyles,
} from "../../packages/theme-core";
import { fontsInStack } from "../../packages/font-library";

// Public, version-independent font URLs also work when a theme is exported locally.
export const fontAssetOrigin = "https://happyhands-design.vercel.app";
export function themeExport(styles: ThemeStyles, kind: ExportKind) {
  const fonts = [
    ...new Map(
      (["light", "dark"] as const).flatMap((mode) =>
        (["font-sans", "font-serif", "font-mono"] as const).flatMap((key) =>
          fontsInStack(styles[mode][key]).map(
            (font) => [font.id, font] as const,
          ),
        ),
      ),
    ).values(),
  ];
  const fontCss = fonts
    .map(
      (font) =>
        `/* ${font.family} · OFL-1.1 · ${fontAssetOrigin}${font.licenseUrl} */\n@import url("${fontAssetOrigin}${font.stylesheet}");`,
    )
    .join("\n");
  const includesFonts =
    kind === "css" || kind === "tailwind3" || kind === "tailwind4";
  const raw = exportTheme(styles, kind);
  return {
    fonts,
    fontCss,
    includesFonts,
    code: includesFonts && fontCss ? `${fontCss}\n\n${raw}` : raw,
  };
}
