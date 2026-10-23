import messages from "./messages.en.json";
import { readLanguage } from "../../packages/ui/site-preferences";

const english: Record<string, string> = messages;
const chinese = Object.fromEntries(
  Object.entries(english).map(([zh, en]) => [en, zh]),
);
const dynamic = [
  [
    "{0}:1，普通文字参考阈值 4.5:1",
    "{0}:1; reference threshold for normal text: 4.5:1",
  ],
  ["已保存在此浏览器 / 修订 {0}", "Saved in this browser / Revision {0}"],
  [
    "已应用 {0} 个变量；{1} 项未应用。原始输入保留在导入面板。",
    "Applied {0} tokens; {1} skipped. Original input remains in the import panel.",
  ],
  [
    "已批准并导出 {0}。请通过 Harness 的 foundation-approve 导入；不会自动修改仓库。",
    "Approved and exported {0}. Import with Harness foundation-approve; no repository is changed automatically.",
  ],
  [
    "基于 {0}；品牌、组件与模式将完整保留。",
    "Based on {0}; brand, components and patterns are preserved.",
  ],
  [
    "已载入基础版本与 {0} 个命名匹配的主题变量；其他品牌、组件与 token 原样保留。",
    "Foundation loaded with {0} matching theme tokens; other brand, component and token data is preserved.",
  ],
  ["{0} 项需要关注", "{0} checks need attention"],
  [
    "已载入 Foundation {0}：{1} 条品牌原则、{2} 个组件规范。原记录保留在批准流程中。",
    "Foundation {0} loaded: {1} brand principles and {2} component rules. Original records remain in the approval flow.",
  ],
  [
    "无法载入原草稿，已保留原始数据：{0}",
    "Could not load the draft. Original data is preserved: {0}",
  ],
];
function pattern(value: string) {
  return new RegExp(
    "^" +
      value
        .split(/\{\d+\}/)
        .map((s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
        .join("(.*?)") +
      "$",
  );
}
export function t(value: string): string {
  const key = value.replace(/\s+/g, " ").trim();
  const en = readLanguage() === "en";
  const translated = (en ? english : chinese)[key];
  if (translated) return translated;
  for (const pair of dynamic) {
    const match = key.match(pattern(pair[en ? 0 : 1]));
    if (match)
      return pair[en ? 1 : 0].replace(
        /\{(\d+)\}/g,
        (_, i) => match[Number(i) + 1],
      );
  }
  return value;
}
const scenes: Record<string, string> = {
  Components: "组件",
  Dashboard: "仪表盘",
  Marketing: "营销页",
  Mail: "邮件",
  Typography: "排版",
  States: "组件状态",
  "Connected page": "连接页面",
};
export function sceneLabel(value: string) {
  return readLanguage() === "zh" ? scenes[value] || value : value;
}
