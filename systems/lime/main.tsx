import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { Button } from "../../packages/ui";
import { Select } from "../../packages/ui/Select";
import { SiteHeader } from "../../packages/ui/SiteHeader";
import { SystemBreadcrumb } from "../../packages/ui/SystemBreadcrumb";
import { SystemDirectory } from "../../packages/ui/SystemDirectory";
import { SystemCatalog } from "../../packages/ui/SystemCatalog";
import { useSitePreferences } from "../../packages/ui/useSitePreferences";
import { LimeExample } from "./LimeExample";
import registry from "./catalog.json";
import palette from "./palette.json";
import "../../packages/design-tokens/happyhands.css";
import "../../packages/ui/components.css";
import "../../packages/ui/site-layout.css";
import "../../packages/ui/system-page.css";
import "../../packages/ui/owned-ui.css";
import "../../packages/ui/system-embed";

function App() {
  const { lang, dark, toggleLanguage, toggleTheme } = useSitePreferences();
  const t = (zh: string, en: string) => (lang === "zh" ? zh : en);
  const [mode, setMode] = useState("existing"),
    [notice, setNotice] = useState("");
  React.useEffect(() => {
    document.title = t("Lime / 设计系统", "Lime / Design system");
  }, [lang]);
  const prompt = t(
    `${mode === "existing" ? "将本项目的一个明确页面逐步对齐 Lime。" : "在本项目中用 Lime 构建第一个页面。"}先读取 https://design.how/r/lime/skill.json 与 https://design.how/r/lime/registry.json，检查项目技术栈和已有规范。保留用户已批准的品牌、业务行为、文案与数据，不重置其他应用。确认 React、Tailwind 与 shadcn 兼容后，用项目包管理器添加 https://design.how/r/lime/theme.json；遵循实际安装输出导入样式，在约定根节点设置 lime 作用域并配置 LimePortalProvider。先读取 https://design.how/systems/lime/components/<name>.md，再添加 https://design.how/r/lime/<name>.json；整屏可选 home、assistant-approval、assistant-alert、settings-rules、split-request。只在主要操作使用黄绿色，不把它铺满页面；涉及资金与自主权限时先确认真实范围，不编造金额、收款人或批准。按 https://design.how/r/lime/lint.json 配置检查，并验证深浅色、中英文、390/768/1280px、键盘焦点、错误恢复与既有流程。记录来源版本、改动和剩余限制。复制指令不会安装、执行或部署。`,
    `${mode === "existing" ? "Migrate one agreed screen in this project to Lime." : "Build the first screen in this project with Lime."} Read https://design.how/r/lime/skill.json and https://design.how/r/lime/registry.json first. Inspect the stack and existing rules, preserving approved branding, behavior, copy and data. After checking React, Tailwind and shadcn compatibility, add https://design.how/r/lime/theme.json with the project package manager. Follow its actual output to import styles, scope the agreed root with lime, and configure LimePortalProvider. Read https://design.how/systems/lime/components/<name>.md before adding https://design.how/r/lime/<name>.json. Screen blocks include home, assistant-approval, assistant-alert, settings-rules and split-request. Reserve lime for the main action. Confirm real scope for financial or autonomous actions; never invent amounts, recipients or approvals. Configure checks from https://design.how/r/lime/lint.json and verify both themes, languages, 390/768/1280px, keyboard focus, recovery and existing workflows. Record source versions, changes and limits. Copying does not install, execute or deploy anything.`,
  );
  const colors = dark ? palette.dark : palette.light;
  return (
    <>
      <a className="skip" href="#overview">
        {t("跳到内容", "Skip to content")}
      </a>
      <SiteHeader
        lang={lang}
        dark={dark}
        onTheme={toggleTheme}
        onLanguage={toggleLanguage}
      />
      <div className="system-landing">
        <main>
          <SystemBreadcrumb current="Lime" lang={lang} />
          <section id="overview" className="system-introduction">
            <div>
              <p className="eyebrow">
                {t(
                  "外部设计系统 / design.how",
                  "External design system / design.how",
                )}
              </p>
              <h1>Lime</h1>
              <p className="lead">
                {t(
                  "面向消费类应用与个人助手。暖灰白底承载内容，用黄绿色突出主要操作。",
                  "For consumer apps and personal assistants. Warm neutral surfaces with a lime accent for the main action.",
                )}
              </p>
              <div className="actions">
                <a className="action" href="#components">
                  {t("浏览组件", "Browse components")}
                </a>
                <a href="#adopt">{t("查看接入方式", "View setup options")}</a>
              </div>
              <p className="note">
                {t(
                  "本站编写的提醒交互示例，采用核对过的 Lime 配色与圆角，使用系统字体；不是上游组件原样演示。",
                  "Our local reminder example uses checked Lime palette and radius values with system fonts. It is not an upstream component demo.",
                )}
              </p>
            </div>
            <LimeExample lang={lang} dark={dark} />
          </section>
          <SystemDirectory label={t("本页目录", "On this page")}>
            <nav aria-label={t("设计系统目录", "Design system navigation")}>
              {[
                ["overview", "概览", "Overview"],
                ["foundations", "基础规范", "Foundations"],
                ["components", "组件目录", "Components"],
                ["patterns", "页面模板", "Screen blocks"],
                ["adopt", "接入项目", "Setup"],
              ].map(([id, zh, en]) => (
                <a href={`#${id}`} key={id}>
                  {t(zh, en)}
                </a>
              ))}
            </nav>
          </SystemDirectory>
          <section id="foundations">
            <h2>{t("颜色与交互约定", "Color and interaction conventions")}</h2>
            <div className="rules">
              {[
                [
                  "主要操作",
                  "Primary action",
                  "黄绿色用于主要动作、选择与重点提示。文字使用深色，焦点使用更深的橄榄色边界。",
                  "Use lime for the main action, selection and highlights, with dark text and a distinct olive focus ring.",
                ],
                [
                  "字体与形状",
                  "Type and shape",
                  "上游采用 Hanken Grotesk；本站示例使用系统字体。控件为胶囊形，输入框圆角 12px、面板圆角 16px。",
                  "Upstream uses Hanken Grotesk; our example uses system fonts. Controls are pill-shaped, fields use a 12px radius and panels 16px.",
                ],
                [
                  "确认与恢复",
                  "Confirmation and recovery",
                  "助手执行前明确范围，执行后提供回执和撤销。状态同时使用文字说明，不依赖颜色。",
                  "Define scope before an assistant acts, then provide a receipt and undo. Name states in words as well as color.",
                ],
              ].map(([zh, en, copy, english]) => (
                <article key={en}>
                  <h3>{t(zh, en)}</h3>
                  <p>{t(copy, english)}</p>
                </article>
              ))}
            </div>
            <div className="lime-palette">
              {[
                "page",
                "surface",
                "fg",
                "accent",
                "accent-wash",
                "accent-line",
              ].map((key) => (
                <article key={key}>
                  <i
                    style={{ background: colors[key as keyof typeof colors] }}
                  />
                  <strong>{key}</strong>
                  <code>{colors[key as keyof typeof colors]}</code>
                </article>
              ))}
            </div>
            <p className="note">
              {t(
                "核心配色摘录。切换官网外观可查看对应值，完整变量以来源为准。",
                "Selected palette roles. Switch site appearance to compare values; upstream contains the full token set.",
              )}{" "}
              <a href={palette.source} target="_blank" rel="noreferrer">
                {t("查看配色来源", "Palette source")}
              </a>
            </p>
          </section>
          <section id="components">
            <h2>{t("完整组件目录", "Complete component catalog")}</h2>
            <p>
              {t(
                "包括表单、导航、反馈、个人助手和账单相关条目。支持站内搜索、分类和接入说明。",
                "Browse forms, navigation, feedback, personal assistant and billing entries with search, categories and setup details.",
              )}
            </p>
            <SystemCatalog lang={lang} system="lime" registry={registry} />
          </section>
          <section id="patterns">
            <h2>{t("页面模板", "Screen blocks")}</h2>
            <div className="rules">
              {[
                [
                  "个人首页",
                  "Home",
                  "概览、近期活动与待处理事项。",
                  "Overview, recent activity and pending work.",
                ],
                [
                  "助手审批",
                  "Assistant approval",
                  "核对建议的范围，再允许或拒绝。",
                  "Review a proposed action before allowing it.",
                ],
                [
                  "助手提醒",
                  "Assistant alert",
                  "查看异常并选择处理方式。",
                  "Inspect an issue and choose a response.",
                ],
                [
                  "操作规则",
                  "Settings rules",
                  "设定助手操作的额度和边界。",
                  "Set boundaries for assistant actions.",
                ],
                [
                  "分账请求",
                  "Split request",
                  "核对对象与金额后再发起请求。",
                  "Review recipients and amounts before requesting.",
                ],
              ].map(([zh, en, copy, english]) => (
                <article key={en}>
                  <h3>{t(zh, en)}</h3>
                  <p>{t(copy, english)}</p>
                </article>
              ))}
            </div>
          </section>
          <section id="adopt">
            <h2>{t("接入你的项目", "Use in your project")}</h2>
            <p>
              {t(
                "先核对项目兼容性和已有品牌，再按页面采用组件。以下指令供你正在使用的 AI 代理读取。",
                "Check compatibility and existing branding before adopting components screen by screen. Use this prompt with your own coding agent.",
              )}
            </p>
            <label>
              {t("接入方式", "Setup mode")}
              <Select
                value={mode}
                onChange={(event) => setMode(event.target.value)}
              >
                <option value="existing">
                  {t("已有项目", "Existing project")}
                </option>
                <option value="new">{t("新项目", "New project")}</option>
              </Select>
            </label>
            <textarea
              aria-label={t("接入指令", "Setup prompt")}
              readOnly
              value={prompt}
              rows={10}
            />
            <div className="actions">
              <Button
                variant="primary"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(prompt);
                    setNotice(t("接入指令已复制。", "Setup prompt copied."));
                  } catch {
                    setNotice(
                      t(
                        "无法复制，请手动选择上方指令。",
                        "Copy unavailable. Select the prompt manually.",
                      ),
                    );
                  }
                }}
              >
                {t("复制接入指令", "Copy setup prompt")}
              </Button>
              <a
                href="https://design.how/r/lime/skill.json"
                target="_blank"
                rel="noreferrer"
              >
                {t("查看上游 Skill", "Upstream Skill")}
              </a>
            </div>
          </section>
          <footer>
            <div className="system-return">
              <a href="/components/?provider=systems">
                {t("返回设计系统", "All design systems")}
              </a>
              <a href="/systems/happyhands/">HappyHands</a>
              <a href="/systems/quartz/">Quartz</a>
            </div>
            <p>
              {t(
                "Lime 来自 design.how，本站保留来源与独立演示边界。没有安装上游组件，也不会更改项目或执行真实提醒。",
                "Lime is from design.how. This catalog and local example do not install upstream components, alter projects or create real reminders.",
              )}
            </p>
          </footer>
        </main>
      </div>
      <output className="notice" aria-live="polite">
        {notice}
      </output>
    </>
  );
}
createRoot(document.getElementById("root")!).render(<App />);
