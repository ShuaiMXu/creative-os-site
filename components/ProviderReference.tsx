import React, { useState } from "react";
import providers from "../public/components/providers.json";
import { KageGallery } from './KageGallery';

export function ProviderReference({ lang }: { lang: "zh" | "en" }) {
  const t = (zh: string, en: string) => lang === "zh" ? zh : en;
  const provider = providers.providers.find(p => p.id === "kage")!;
  const [brief, setBrief] = useState("");
  const [notice, setNotice] = useState("");
  const command = `codex mcp add kage --url ${provider.endpoint}`;
  const guidance = t(
    `使用 Kage MCP 为当前项目寻找设计参考。需求：${brief.trim() || "根据当前页面和产品目标选择相关参考"}。\n先读取项目设计系统、已有组件和任务范围。通过 design_brief 或 search_designs 按需检索，再用 get_design/get_component 查看少量相关参考；不要批量抓取或镜像。\n保留参考来源，将布局、排版、间距映射到项目已有 token 和组件。截图不代表可安装源码；不要复制品牌、文案或专有素材。\n先说明建议与适配差异，再按已确认范围修改。验证响应式、键盘、深浅色和减少动态效果，提交实际页面的前后证据。若 MCP 不可用，明确报告，不编造结果。`,
    `Use Kage MCP to find design references for this project. Request: ${brief.trim() || "Choose relevant references for the current page and product goals"}.\nRead the project design system, existing components and scope first. Query design_brief or search_designs on demand, then inspect a few relevant references with get_design/get_component. Do not bulk scrape or mirror.\nKeep attribution and map layout, typography and spacing to project tokens and components. Screenshots are not installable source. Do not copy branding, copy or proprietary assets.\nExplain adaptations before editing within the agreed scope. Verify responsive layout, keyboard access, themes and reduced motion; provide before/after evidence. Report MCP unavailability honestly.`
  );
  async function copy(value: string) {
    try { await navigator.clipboard.writeText(value); setNotice(t("已复制", "Copied")); }
    catch { setNotice(t("请选中文本后复制。", "Select and copy the text.")); }
  }
  return <main id="catalog-main" className="provider-reference">
    <p className="catalog-eyebrow">Kage · {t("设计参考", "Design references")}</p>
    <h2>{t("从真实产品中寻找设计参考", "Find references from real products")}</h2>
    <p>{t("查找页面布局、区块和交互参考，查看来源后再应用到项目。", "Find page layouts, sections and interaction references, with sources to review before applying them.")}</p>
    <KageGallery lang={lang} />
    <details className="reference-setup"><summary>{t("在 AI 工具中使用 Kage", "Use Kage in your AI tool")}</summary>
    <div className="provider-columns">
      <section>
        <h3>{t("连接到你的 AI 工具", "Connect your agent")}</h3>
        <p>{t("在本地终端运行以下命令，为 Codex 添加 Kage。这里不会自动更改你的配置。", "Run this locally to add Kage to Codex. This page does not change your configuration.")}</p>
        <pre>{command}</pre>
        <button onClick={() => copy(command)}>{t("复制连接命令", "Copy connection command")}</button>
        <details><summary>{t("其他支持 MCP 的工具", "Other MCP clients")}</summary>
          <pre>{JSON.stringify({ mcpServers: { kage: { url: provider.endpoint } } }, null, 2)}</pre>
        </details>
      </section>
      <section>
        <h3>{t("带着项目要求使用参考", "Use references in project context")}</h3>
        <label className="catalog-search">{t("设计需求（可选）", "Design request (optional)")}<input type="search" value={brief} onChange={e => setBrief(e.target.value)} placeholder={t("例如：清晰紧凑的项目管理页面", "For example: a compact project dashboard")} /></label>
        <textarea aria-label={t("参考使用说明", "Reference guidance")} readOnly rows={9} value={guidance} />
        <button onClick={() => copy(guidance)}>{t("复制给 AI", "Copy for your agent")}</button>
        <p>{t("需求仅用于生成本地说明，不会自动发送到 Kage。", "Your request only generates local guidance; it is not automatically sent to Kage.")}</p>
      </section>
    </div>
    </details>
    <p aria-live="polite">{notice}</p>
    <details><summary>{t("来源与使用范围", "Source and usage")}</summary>
      <p>{t("Kage 提供参考截图和设计分析，不是开源组件包。分析提示词可用于项目；截图与品牌资产属于原产品。该来源不做整库镜像，也不计入本站可运行组件数量。", "Kage provides screenshots and design analysis, not an open-source component package. Prompts can inform projects; screenshots and brand assets belong to their owners. This source is not mirrored or counted as runnable components.")}</p>
      <a href={provider.documentation} target="_blank" rel="noreferrer">{t("官方接入说明", "Official connection guide")}</a>{" · "}<a href={provider.terms} target="_blank" rel="noreferrer">{t("使用条款", "Terms")}</a>
    </details>
  </main>;
}
