import { parse, converter, formatHex8, formatRgb, wcagContrast } from "culori";
import postcss from "postcss";
import { defaultThemeState, COMMON_STYLES } from "./vendor/config/theme";
import { defaultPresets } from "./vendor/utils/theme-presets";
import {
  generateThemeCode,
  generateTailwindConfigCode,
} from "./vendor/utils/theme-style-generator";
import { getShadowMap } from "./vendor/utils/shadows";
import type { ThemeStyles, ThemeStyleProps } from "./vendor/types/theme";
export type { ThemeStyles };
export type Mode = "light" | "dark";
export type Key = keyof ThemeStyleProps;
export const revision = "a3b47b37cba97dd637de517aab52c45ec0f83456";
export const fontStack =
  '"PingFang SC", "Microsoft YaHei", system-ui, sans-serif';
export const keys = Object.keys(defaultThemeState.styles.light) as Key[];
export const colorKeys = keys.filter((k) => !COMMON_STYLES.includes(k));
export const presets = {
  default: { label: "Neutral / tweakcn" },
  happyhands: { label: "HappyHands" },
  ...defaultPresets,
};
export function presetStyles(id: string): ThemeStyles {
  const preset = defaultPresets[id];
  const styles = structuredClone(defaultThemeState.styles);
  for (const mode of ["light", "dark"] as const) {
    Object.assign(styles[mode], preset?.styles.light, preset?.styles[mode]);
    // Project UI always defaults to the requested sans-serif stack; fonts remain editable.
    styles[mode]["font-sans"] = fontStack;
    if (id === "happyhands")
      Object.assign(styles[mode], {
        primary: "#f57f28",
        "primary-foreground": "#171614",
        ring: "#f57f28",
      });
  }
  return styles;
}
export function validateValue(key: Key, value: string): void {
  if (
    typeof value !== "string" ||
    !value.trim() ||
    value.length > 400 ||
    /[;{}<>\r\n]|url\s*\(|@import|\/\*|\\/i.test(value)
  )
    throw Error(`${key}：值不安全或为空`);
  if (colorKeys.includes(key)) {
    if (!parse(value)) throw Error(`${key}：无效颜色`);
    return;
  }
  if (key.startsWith("font-")) {
    if (!/^[\p{L}\p{N}\s,'"._-]+$/u.test(value))
      throw Error(`${key}：请输入字体名称与备用字体`);
    return;
  }
  if (key === "shadow-opacity") {
    if (!/^(?:0(?:\.\d+)?|1(?:\.0+)?)$/.test(value))
      throw Error("阴影透明度须在 0–1 之间");
    return;
  }
  if (value === "0") return;
  if (key === "letter-spacing" && value === "normal") return;
  if (!/^-?(?:\d+(?:\.\d+)?|\.\d+)(?:px|rem|em)$/.test(value))
    throw Error(`${key}：须为 px、rem 或 em 长度`);
  const n = parseFloat(value);
  if (
    Math.abs(n) > 200 ||
    (["radius", "spacing", "shadow-blur"].includes(key) && n < 0)
  )
    throw Error(`${key}：长度超出范围`);
  if (key.startsWith("shadow-") && !value.endsWith("px"))
    throw Error(`${key}：阴影尺寸使用 px`);
}
export function validateStyles(input: unknown): ThemeStyles {
  if (!input || typeof input !== "object") throw Error("缺少主题");
  const result = structuredClone(input) as ThemeStyles;
  for (const mode of ["light", "dark"] as const) {
    const values = result[mode];
    if (!values || Object.keys(values).some((k) => !keys.includes(k as Key)))
      throw Error(`${mode}：未知 token`);
    for (const key of keys) validateValue(key, values[key] ?? "");
  }
  return result;
}
export function setToken(
  styles: ThemeStyles,
  mode: Mode,
  key: Key,
  value: string,
): ThemeStyles {
  validateValue(key, value);
  const next = structuredClone(styles);
  for (const m of COMMON_STYLES.includes(key)
    ? (["light", "dark"] as const)
    : [mode])
    next[m][key] = value;
  return next;
}
export function adjustHsl(
  styles: ThemeStyles,
  mode: Mode,
  hue: number,
  saturation: number,
  lightness: number,
): ThemeStyles {
  const next = structuredClone(styles);
  for (const key of colorKeys) {
    const c = converter("hsl")(parse(next[mode][key]!)!);
    next[mode][key] = formatRgb({
      ...c,
      h: (c.h ?? 0) + hue,
      s: Math.min(1, Math.max(0, c.s * saturation)),
      l: Math.min(1, Math.max(0, c.l * lightness)),
    });
  }
  return next;
}
export const hex = (value: string) =>
  formatHex8(parse(value)!)?.slice(0, 7) || "#000000";
export function variables(
  styles: ThemeStyles,
  mode: Mode,
): Record<string, string> {
  return Object.fromEntries(
    Object.entries({
      ...styles[mode],
      ...getShadowMap({ styles, currentMode: mode }),
    }).map(([k, v]) => [`--${k}`, String(v)]),
  );
}
export function differences(before: ThemeStyles, after: ThemeStyles) {
  return (["light", "dark"] as const).flatMap((mode) =>
    keys
      .filter((key) => before[mode][key] !== after[mode][key])
      .map((key) => ({
        mode,
        key,
        before: before[mode][key],
        after: after[mode][key],
      })),
  );
}
export function contrastChecks(styles: ThemeStyles, mode: Mode) {
  return [
    ["background", "foreground"],
    ["primary", "primary-foreground"],
    ["card", "card-foreground"],
    ["muted", "muted-foreground"],
    ["destructive", "destructive-foreground"],
  ].map(([bg, fg]) => {
    const a = parse(styles[mode][bg as Key]!)!,
      b = parse(styles[mode][fg as Key]!)!;
    const ratio =
      (a.alpha ?? 1) < 1 || (b.alpha ?? 1) < 1 ? null : wcagContrast(a, b);
    return { bg, fg, ratio };
  });
}
export function importCSS(
  css: string,
  base: ThemeStyles,
): { styles: ThemeStyles; warnings: string[]; count: number } {
  if (css.length > 250_000) throw Error("CSS 文件不能超过 250 KB");
  const root = postcss.parse(css);
  const styles = structuredClone(base);
  const warnings: string[] = [];
  const priorities = new Map<string, boolean>();
  const aliases: Record<string, Key> = {
    "shadow-x": "shadow-offset-x",
    "shadow-y": "shadow-offset-y",
    "tracking-normal": "letter-spacing",
  };
  let count = 0;
  root.walkDecls((decl) => {
    if (!decl.prop.startsWith("--")) return;
    const rawKey = decl.prop.slice(2);
    const key = aliases[rawKey] ?? (rawKey as Key);
    const parent = decl.parent;
    if (
      parent?.type !== "rule" ||
      ![":root", ".dark"].includes(parent.selector.trim())
    ) {
      warnings.push(`未应用作用域中的 ${decl.prop}`);
      return;
    }
    let ancestor = parent.parent;
    while (ancestor && ancestor.type !== "root") {
      if (ancestor.type !== "atrule" || ancestor.name !== "layer") {
        warnings.push(`未应用条件规则中的 ${decl.prop}`);
        return;
      }
      ancestor = ancestor.parent;
    }
    if (!keys.includes(key)) {
      warnings.push(`未识别 ${decl.prop}`);
      return;
    }
    let value = decl.value.trim();
    if (
      colorKeys.includes(key) &&
      /^[-.\d]+\s+[-.\d]+%\s+[-.\d]+%(?:\s*\/\s*[.\d]+)?$/.test(value)
    )
      value = `hsl(${value})`;
    try {
      validateValue(key, value);
    } catch (err) {
      warnings.push(String((err as Error).message));
      return;
    }
    const mode = parent.selector.trim() === ".dark" ? "dark" : "light";
    const signature = `${mode}:${key}`;
    if (priorities.get(signature) && !decl.important) return;
    priorities.set(signature, Boolean(decl.important));
    styles[mode][key] = value;
    count++;
  });
  if (!count)
    throw Error("没有识别到可用 token；支持 :root / .dark 中的 tweakcn 变量");
  return { styles, warnings: [...new Set(warnings)], count };
}
export type ExportKind =
  "css" | "tailwind3" | "tailwind3-config" | "tailwind4" | "registry";
export function exportTheme(input: ThemeStyles, kind: ExportKind): string {
  const styles = validateStyles(input),
    state = { styles, currentMode: "light" as const };
  if (kind.startsWith("tailwind"))
    for (const mode of ["light", "dark"] as const)
      if (styles[mode]["letter-spacing"] === "normal")
        styles[mode]["letter-spacing"] = "0em";
  if (kind === "tailwind3")
    return generateThemeCode(state, "rgb", "3").replace(
      "@apply bg-background text-foreground;",
      "@apply bg-background text-foreground;\n    letter-spacing: var(--tracking-normal);",
    );
  if (kind === "tailwind3-config")
    return generateTailwindConfigCode(state, "rgb", "3").replace(
      "extend: {",
      `extend: {\n      spacing: { unit: 'var(--spacing)' },\n      letterSpacing: { normal: 'var(--tracking-normal)' },\n      boxShadow: { ${["2xs", "xs", "sm", "md", "lg", "xl", "2xl"].map((size) => `'${size}': 'var(--shadow-${size})'`).join(", ")}, DEFAULT: 'var(--shadow)' },`,
    );
  if (kind === "tailwind4") return generateThemeCode(state, "rgb", "4");
  if (kind === "registry")
    return JSON.stringify(
      {
        $schema: "https://ui.shadcn.com/schema/registry-item.json",
        name: "happyhands-theme",
        type: "registry:theme",
        cssVars: Object.fromEntries(
          (["light", "dark"] as const).map((mode) => [
            mode,
            Object.fromEntries(
              Object.entries(variables(styles, mode)).map(([k, v]) => [
                k.slice(2),
                v,
              ]),
            ),
          ]),
        ),
      },
      null,
      2,
    );
  return (["light", "dark"] as const)
    .map(
      (mode) =>
        `${mode === "light" ? ":root" : ".dark"} {\n${Object.entries(
          variables(styles, mode),
        )
          .map(([k, v]) => `  ${k}: ${v};`)
          .join("\n")}\n}`,
    )
    .join("\n\n");
}
