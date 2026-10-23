const record =
  "https://github.com/ShuaiMXu/creative-os/blob/main/docs/counter-evidence-review-2026-10-21.md";
const core = "https://github.com/ShuaiMXu/creative-os";
export function productViewer(lang) {
  const zh = lang === "zh",
    t = (a, b) => (zh ? a : b);
  return `<figure class="product-viewer" data-ui><div class="viewer-bar"><strong>${t("HappyHands 工作台", "HappyHands workbench")}</strong><div class="viewer-switch" role="group" aria-label="${t("查看实际界面", "View actual interface")}"><button type="button" data-view="page" aria-pressed="true">${t("页面审阅", "Page review")}</button><button type="button" data-view="report" aria-pressed="false">${t("诊断报告", "Diagnosis")}</button></div></div><div class="viewer-stage"><a class="capture-link" href="/portal-evidence/workbench-desktop.png" target="_blank" rel="noopener" aria-label="${t("打开页面审阅原图", "Open full page-review capture")}"><picture><source media="(max-width: 600px)" srcset="/portal-evidence/workbench-mobile.png"><img src="/portal-evidence/workbench-desktop.png" alt="${t("HappyHands 实际工作台：页面状态、历史证据与最终判断入口", "Actual HappyHands workbench showing page states, historical evidence and the final decision action")}" width="1440" height="900" fetchpriority="high"></picture></a><a class="capture-link report-view" href="/portal-evidence/report.png" target="_blank" rel="noopener" hidden aria-label="${t("打开诊断报告原图", "Open full diagnosis capture")}"><img src="/portal-evidence/report.png" alt="${t("实际首次诊断报告，独立复核尚未进行", "Actual initial diagnosis report with independent review still pending")}" width="1280" height="720" loading="lazy"></a></div><figcaption id="viewer-caption">${t("页面审阅实录 · 2026 年 10 月 15 日。点击界面查看原图。", "Page-review capture · October 15, 2026. Select the image to view it in full.")}</figcaption></figure>`;
}
export function proofContent(lang) {
  const zh = lang === "zh",
    t = (a, b) => (zh ? a : b);
  const steps = zh
    ? [
        [
          "看清问题",
          "采集正常尺寸的整页和交互状态，把位置、影响和原始证据一起留下。",
          "页面截图与问题清单",
        ],
        [
          "确认规范",
          "读取 DESIGN.md、样式 token 和组件代码，先确认哪些规则适用于这次修改。",
          "已确认的设计约束",
        ],
        [
          "批准修改",
          "你选择范围，Agent 在隔离工作副本中修改。每处变更都能回到源码核对。",
          "修改范围与代码差异",
        ],
        [
          "复核结果",
          "对照同尺寸、同状态的前后页面，独立审阅后，由你决定接受或拒绝。",
          "前后证据与最终决定",
        ],
      ]
    : [
        [
          "Find the problem",
          "Capture full pages and interaction states at normal sizes. Keep the location, impact and original evidence together.",
          "Screenshots and findings",
        ],
        [
          "Confirm the rules",
          "Read DESIGN.md, style tokens and component code. Confirm which rules apply before editing.",
          "Confirmed design constraints",
        ],
        [
          "Approve the change",
          "Choose the scope. Your agent edits in an isolated working copy, with every change traceable to source.",
          "Scope and source diff",
        ],
        [
          "Review the result",
          "Compare matching sizes and states. An independent review informs your final accept or reject decision.",
          "Evidence and final decision",
        ],
      ];
  const resources = [
    [
      "HappyHands",
      t("我们的设计规范与组件状态", "Our design rules and component states"),
      "/systems/happyhands/",
    ],
    [
      "Quartz",
      t("AI 产品的组件与页面模板", "Components and screens for AI products"),
      "/systems/quartz/",
    ],
    [
      "Lime",
      t("消费类应用与个人助手的组件模板", "Components for consumer apps and personal assistants"),
      "/systems/lime/",
    ],
    [
      "Cult UI",
      t("可预览的交互组件与源码", "Interactive components and source"),
      "/components/?provider=cult-ui",
    ],
    [
      "Kage",
      t("页面结构与设计参考", "Page structure and design references"),
      "/components/?provider=kage",
    ],
    [
      "Refero Styles",
      t("风格来源与使用说明", "Style sources and usage guidance"),
      "/components/?provider=refero",
    ],
  ];
  return `<section class="case-section" id="screens"><div class="case-copy"><h2>${t("看清每一处变化", "See the exact change")}</h2><p class="section-intro">${t("改动可以很小，体验要更明确。", "A small change. A clearer experience.")}</p><p>${t("HappyClaw 的长命令可以横向滚动，但页面没有告诉用户。批准后的修改增加了滚动提示，保留命令原本的单行排版。", "HappyClaw’s long command could scroll horizontally, but gave no indication. The approved change adds a scroll hint and keeps the command on one line.")}</p><dl class="change-notes"><div><dt>${t("修改范围", "Scope")}</dt><dd>${t("长命令滚动提示", "Long-command scroll hint")}</dd></div><div><dt>${t("保留约束", "Preserved")}</dt><dd>${t("不强制折行，不扩大修改", "No forced wrapping or expanded scope")}</dd></div></dl><a class="text-link" href="${record}">${t("查看完整验证记录", "Read the verification record")} <span aria-hidden="true">↗</span></a><p class="case-status">${t("该记录的独立重审已通过，人工接受仍待记录。", "Independent re-review passed in this record; human acceptance is still pending.")}</p></div><div class="case-evidence" data-ui><div class="comparison-heading"><strong>HappyClaw</strong><span>${t("手机 · 同一页面状态", "Mobile · matching page state")}</span></div><div class="comparison-controls" role="group" aria-label="${t("前后截图", "Before and after captures")}"><button type="button" data-compare="before" aria-pressed="false">${t("修改前", "Before")}</button><button type="button" data-compare="after" aria-pressed="true">${t("修改后", "After")}</button></div><div class="comparison-pair" data-selected="after"><figure data-side="before"><figcaption>${t("修改前", "Before")}</figcaption><a href="/portal-evidence/before-mobile.png" target="_blank" rel="noopener"><img src="/portal-evidence/before-mobile.png" alt="${t("修改前：命令右侧被截断，没有滚动指引", "Before: the command extends beyond the visible area without a scroll hint")}" width="390" height="844" loading="lazy"></a></figure><figure data-side="after"><figcaption>${t("修改后", "After")}</figcaption><a href="/portal-evidence/after-mobile.png" target="_blank" rel="noopener"><img src="/portal-evidence/after-mobile.png" alt="${t("修改后：长命令下方新增横向滚动查看完整命令的提示", "After: a visible hint beneath the long command explains horizontal scrolling")}" width="390" height="844" loading="lazy"></a></figure></div><p class="evidence-caption">${t("原始截图 390 × 844 · 2026 年 10 月 21 日", "Original captures 390 × 844 · October 21, 2026")}</p></div></section>
 <section class="workflow-section" id="apps"><span id="harness" class="anchor-alias"></span><div class="section-heading"><h2>${t("从发现到复核", "From finding to decision")}</h2><p>${t("每一步都有可检查的结果，修改范围始终由你确认。", "Every stage leaves something you can inspect. You stay in control of the scope.")}</p></div><ol class="workflow">${steps.map(([title, copy, output]) => `<li><h3>${title}</h3><p>${copy}</p><span class="step-output">${output}</span></li>`).join("")}</ol></section>
 <section class="foundation-section" id="explore"><div class="foundation-lead"><h2>${t("沿用你的设计规范", "Keep your design system")}</h2><p>${t("项目已有的品牌、间距和组件是起点。把规范来源一起带进审阅，让下一次修改有据可依。", "Start with your project’s brand, spacing and components. Bring the sources into each review so future changes follow the same rules.")}</p><a class="text-link" href="${core}/blob/main/docs/reusable-design-system-extraction.md">${t("了解设计规范提取", "Explore design-system extraction")} <span aria-hidden="true">↗</span></a></div><div class="foundation-sources"><h3>${t("把这些带进工作台", "Bring these into the workbench")}</h3><dl><div><dt>DESIGN.md</dt><dd>${t("品牌与使用规则", "Brand and usage rules")}</dd></div><div><dt>${t("样式 token", "Style tokens")}</dt><dd>${t("颜色、字体与间距", "Color, type and spacing")}</dd></div><div><dt>${t("组件代码", "Component code")}</dt><dd>${t("结构、状态与交互", "Structure, states and interactions")}</dd></div></dl></div><div class="resource-links" id="elements"><h3>${t("设计资源", "Design resources")}</h3><div>${resources.map(([name, copy, url]) => `<a href="${url}"><strong>${name}</strong><span>${copy}</span><span aria-hidden="true">↗</span></a>`).join("")}</div></div></section>`;
}
export function setupProof(lang) {
  const zh = lang === "zh";
  document.querySelectorAll("[data-view]").forEach((button) =>
    button.addEventListener("click", () => {
      const report = button.dataset.view === "report";
      document
        .querySelectorAll("[data-view]")
        .forEach((b) => b.setAttribute("aria-pressed", String(b === button)));
      document.querySelector(".viewer-stage .capture-link").hidden = report;
      document.querySelector(".report-view").hidden = !report;
      document.querySelector("#viewer-caption").textContent = report
        ? zh
          ? "首次诊断实录 · 2026 年 10 月 21 日。此记录尚未独立复核。"
          : "Initial diagnosis · October 21, 2026. This record had not yet been independently reviewed."
        : zh
          ? "页面审阅实录 · 2026 年 10 月 15 日。点击界面查看原图。"
          : "Page-review capture · October 15, 2026. Select the image to view it in full.";
    }),
  );
  document.querySelectorAll("[data-compare]").forEach((button) =>
    button.addEventListener("click", () => {
      document.querySelector(".comparison-pair").dataset.selected =
        button.dataset.compare;
      document
        .querySelectorAll("[data-compare]")
        .forEach((b) => b.setAttribute("aria-pressed", String(b === button)));
    }),
  );
}
