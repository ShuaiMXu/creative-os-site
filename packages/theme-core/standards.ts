import { parse, formatHex8 } from "culori";
import brand from "../design-tokens/happyhands.json";
import { contrastChecks, type ThemeStyles, type Mode } from "./index";
export type StandardCheck = {
  id: string;
  mode: Mode;
  label: string;
  status: "pass" | "attention" | "manual";
  detail: string;
  source: string;
};
export function checkStandards(
  styles: ThemeStyles,
  profile: "general" | "happyhands",
): StandardCheck[] {
  return (["light", "dark"] as const).flatMap((mode) => {
    const values = styles[mode];
    const checks: StandardCheck[] = contrastChecks(styles, mode).map((c) => ({
      id: `${mode}:${c.bg}`,
      mode,
      label: `${c.bg} / ${c.fg}`,
      status:
        c.ratio === null ? "manual" : c.ratio >= 4.5 ? "pass" : "attention",
      detail:
        c.ratio === null
          ? "透明色需要结合实际背景检查"
          : `${c.ratio.toFixed(2)}:1，普通文字参考阈值 4.5:1`,
      source: "文字对比度检查（不是完整无障碍审计）",
    }));
    if (profile === "happyhands") {
      const same = (a: string, b: string) =>
        formatHex8(parse(a)!) === formatHex8(parse(b)!);
      checks.push({
        id: `${mode}:primary-role`,
        mode,
        label: "主操作使用中性色",
        status: same(values.primary, brand[mode].primary)
          ? "pass"
          : "attention",
        detail: "主按钮使用墨色 / 近白；暖橙用于少量强调，不用作按钮底色。",
        source: "HappyHands · Button / 色彩",
      });
      checks.push({
        id: `${mode}:font`,
        mode,
        label: "中英文无衬线字体",
        status:
          values["font-sans"].includes("PingFang SC") &&
          !/serif/i.test(values["font-sans"].replaceAll("sans-serif", ""))
            ? "pass"
            : "attention",
        detail: "苹方优先，并保留平台备用字体。实际字体取决于设备安装情况。",
        source: "用户字体要求（覆盖品牌书的衬线标题规则）",
      });
      checks.push({
        id: `${mode}:shadow`,
        mode,
        label: "卡片以边框分层",
        status: Number(values["shadow-opacity"]) === 0 ? "pass" : "attention",
        detail: "品牌规范不使用卡片阴影；浮层可单独使用浮层阴影。",
        source: "HappyHands · 工艺",
      });
    }
    return checks;
  });
}
