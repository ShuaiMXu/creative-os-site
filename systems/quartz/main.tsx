import { FoundationSpecimen } from "../../packages/ui/FoundationSpecimen";
import { SystemScenes } from "../../packages/ui/SystemScenes";
import { QuartzCatalog } from "./QuartzCatalog";
import { SystemExample } from "../../packages/ui/SystemExample";
import { Icon } from "../../packages/ui/Icon";
import { SystemDirectory } from "../../packages/ui/SystemDirectory";
import { useSitePreferences } from "../../packages/ui/useSitePreferences";
import { SiteHeader } from "../../packages/ui/SiteHeader";
import { SystemBreadcrumb } from "../../packages/ui/SystemBreadcrumb";
import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import "../../packages/design-tokens/happyhands.css";
import "../../packages/ui/site-layout.css";
import "../../packages/ui/system-page.css";
import "../../packages/ui/owned-ui.css";
// @ts-ignore The catalog prompt is shared with the plain-JS portal.
import { quartzPrompt } from "../../apps/portal/design-systems.js";

function App() {
  const { lang, dark, toggleLanguage, toggleTheme } = useSitePreferences();
  const [existing, setExisting] = useState(true);
  const [status, setStatus] = useState("");
  React.useEffect(() => {
    document.title =
      lang === "zh" ? "Quartz / 设计系统" : "Quartz / Design system";
  }, [lang]);
  const t = (cn: string, en: string) => (lang === "zh" ? cn : en);

  const prompt = quartzPrompt(lang, existing);
  return (
    <>
      <SiteHeader
        lang={lang}
        dark={dark}
        onTheme={toggleTheme}
        onLanguage={toggleLanguage}
      />
      <div className="system-landing">
        <main>
          <SystemBreadcrumb current="Quartz" lang={lang} />
          <section id="overview" className="system-introduction">
            <div>
              <p className="eyebrow">
                {t(
                  "外部设计系统 / design.how",
                  "External design system / design.how",
                )}
              </p>
              <h1>Quartz</h1>
              <p className="lead">
                {t(
                  "面向 AI 产品和代理工作流。查看组件目录、页面模板与接入说明，再判断是否适合你的项目。",
                  "For AI products and agent workflows. Explore its component catalog, screen blocks and setup guidance to see whether it fits your project.",
                )}
              </p>
              <div className="actions">
                <a className="action" href="#example">
                  {t("查看实际效果", "Try the example")}
                </a>
                <a href="#adopt">{t("查看接入方式", "View setup options")}</a>
              </div>
            </div>
            <aside
              className="system-facts"
              aria-label={t("系统概况", "System overview")}
            >
              <dl>
                <div>
                  <dt>{t("适用场景", "Best for")}</dt>
                  <dd>
                    {t(
                      "代理会话、工具审批、运行追踪",
                      "Agent sessions, tool approvals and run traces",
                    )}
                  </dd>
                </div>
                <div>
                  <dt>{t("技术基础", "Stack")}</dt>
                  <dd>React / Tailwind CSS / shadcn</dd>
                </div>
                <div>
                  <dt>{t("收录内容", "In this catalog")}</dt>
                  <dd>
                    {t(
                      "设计原则、组件目录与接入指令",
                      "Principles, component catalog and setup prompts",
                    )}
                  </dd>
                </div>
              </dl>
              <p className="note">
                {t(
                  "由 HappyHands 整理。组件目录是资料说明，尚未在本站安装 Quartz 交互组件。",
                  "Curated by HappyHands. The catalog describes the system; Quartz interactive components are not installed on this site.",
                )}
              </p>
            </aside>
          </section>
          <SystemDirectory label={t("本页目录", "On this page")}>
            <nav aria-label={t("目录", "Contents")}>
              {[
                ["scenes", "应用场景", "Scenes"],
                ["overview", "概览", "Overview"],
                ["foundations", "设计原则", "Principles"],
                ["example", "效果预览", "Example"],
                ["components", "组件目录", "Components"],
                ["patterns", "页面模板", "Screen blocks"],
                ["adopt", "接入项目", "Setup"],
              ].map(([id, cn, en]) => (
                <a key={id} href={"#" + id}>
                  {t(cn, en)}
                </a>
              ))}
            </nav>
          </SystemDirectory>
          <SystemScenes system="quartz" lang={lang} dark={dark} />
          <section id="foundations">
            <FoundationSpecimen system="quartz" lang={lang} />
            <p className="eyebrow">{t("01 / 设计原则", "01 / Principles")}</p>
            <h2>
              {t(
                "颜色、状态与组件的使用约定",
                "Rules for colors, states and components",
              )}
            </h2>
            <div className="rules">
              <article>
                <h3>{t("中性框架", "Neutral structure")}</h3>
                <p>
                  {t(
                    "黑白框架承载内容，类别通过文字识别；暖色保留给警告与失败。",
                    "A neutral structure carries content, kinds are named in words, and warm colors are reserved for warnings and failures.",
                  )}
                </p>
              </article>
              <article>
                <h3>{t("按角色使用变量", "Role-based tokens")}</h3>
                <p>
                  {t(
                    "组件使用语义变量，不在页面临时拼颜色、字号与阴影。",
                    "Components use role tokens rather than ad hoc colors, sizes and shadows.",
                  )}
                </p>
              </article>
              <article>
                <h3>{t("组件优先", "Components first")}</h3>
                <p>
                  {t(
                    "先选已有组件，再组合页面；保留键盘、焦点、加载与错误反馈。",
                    "Compose screens from existing components while preserving keyboard, focus, loading and error behavior.",
                  )}
                </p>
              </article>
            </div>
          </section>
          <section id="example">
            <p className="eyebrow">{t("效果预览", "See it in use")}</p>
            <h2>
              {t(
                "文件修改确认",
                "File change approval",
              )}
            </h2>
            <div className="system-example-layout">
              <div>
                <p>
                  {t(
                    "通过文件列表与主要操作呈现修改范围。切换外观、选择文件，预览选择与确认状态。",
                    "A file list and primary action define the scope. Switch appearance and select files to preview selection and confirmation states.",
                  )}
                </p>
                <p className="micro">
                  {t(
                    "HappyHands 编写的交互示例，配色与圆角参考 Quartz。使用系统字体；并非上游组件的原样展示，也不会访问你的文件。",
                    "An interactive example authored by HappyHands, using Quartz palette and corner values with system fonts. It is not an upstream component demo and cannot access your files.",
                  )}
                </p>
                <a
                  href="https://design.how/r/quartz/theme.json"
                  target="_blank"
                  rel="noreferrer"
                >
                  {t("查看配色来源", "Palette source")} <Icon name="external" />
                </a>
              </div>
              <SystemExample system="quartz" lang={lang} dark={dark} />
            </div>
          </section>
          <section id="components">
            <p className="eyebrow">{t("02 / 组件目录", "02 / Components")}</p>
            <h2>{t("浏览完整组件目录", "Browse the complete catalog")}</h2>
            <p>
              {t(
                "按操作、导航、反馈和工作流分类查找，也可搜索全部注册项。展开条目，在本站查看用途和接入方式；实际组件接口以来源为准。",
                "Search all registered entries, or browse actions, navigation, feedback and workflow categories. Open an entry here for its purpose and setup. Refer to upstream for component APIs.",
              )}
            </p>
            <QuartzCatalog lang={lang} />
          </section>
          <section id="patterns">
            <p className="eyebrow">
              {t("03 / 页面模板", "03 / Screen blocks")}
            </p>
            <h2>
              {t("按使用场景选择页面模板", "Choose a screen for your task")}
            </h2>
            <div className="rules">
              {[
                [
                  "项目首页",
                  "Workspace home",
                  "项目概况与待处理事项",
                  "Project overview and pending work",
                ],
                [
                  "代理会话",
                  "Agent session",
                  "输入、回复与工具调用",
                  "Input, responses and tool calls",
                ],
                [
                  "工具审批",
                  "Tool approval",
                  "查看操作范围并做出决定",
                  "Inspect scope and make a decision",
                ],
                [
                  "运行追踪",
                  "Run trace",
                  "查看执行过程与结果",
                  "Inspect execution and results",
                ],
                [
                  "实时活动",
                  "Live activity",
                  "浏览持续产生的事件",
                  "Browse ongoing events",
                ],
                [
                  "访问密钥",
                  "API keys",
                  "创建、查看与撤销密钥",
                  "Create, inspect and revoke keys",
                ],
                [
                  "发布详情",
                  "Prompt release",
                  "发布检查与回退",
                  "Release checks and rollback",
                ],
              ].map(([cn, en, desc, eng]) => (
                <article key={en}>
                  <h3>{t(cn, en)}</h3>
                  <p>{t(desc, eng)}</p>
                </article>
              ))}
            </div>
          </section>
          <section id="adopt">
            <p className="eyebrow">{t("04 / 接入项目", "04 / Setup")}</p>
            <h2>{t("带回你的项目", "Bring it to your project")}</h2>
            <p>
              {t(
                "需要 React、Tailwind 和兼容的 shadcn 配置。先检查技术栈与已有品牌，再逐页迁移。复制指令不会安装或执行命令。",
                "Requires React, Tailwind and compatible shadcn configuration. Check the stack and existing brand before migrating screen by screen. Copying does not install or execute anything.",
              )}
            </p>
            <label>
              {t("接入方式", "Setup mode")}
              <select
                value={existing ? "existing" : "new"}
                onChange={(e) => setExisting(e.target.value === "existing")}
              >
                <option value="existing">
                  {t("已有项目", "Existing project")}
                </option>
                <option value="new">{t("新项目", "New project")}</option>
              </select>
            </label>
            <textarea
              aria-label={t("接入指令", "Setup prompt")}
              value={prompt}
              readOnly
              rows={12}
            />
            <div className="actions">
              <button
                className="action"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(prompt);
                    setStatus(t("已复制", "Copied"));
                  } catch {
                    setStatus(
                      t(
                        "复制失败，请手动选择指令。",
                        "Copy unavailable. Select the prompt manually.",
                      ),
                    );
                  }
                }}
              >
                {t("复制接入指令", "Copy setup prompt")}
              </button>
              <a href="https://github.com/ShuaiMXu/creative-os/blob/main/docs/local-workbench.md">
                {t("本地工作台指引", "Local workbench guide")}
              </a>
            </div>
          </section>
          <footer>
            <div className="system-related">
              <div>
                <p className="eyebrow">
                  {t("我们的设计系统", "Our design system")}
                </p>
                <h2>HappyHands</h2>
                <p>
                  {t(
                    "也可以从官网正在使用的规范与组件开始。",
                    "Explore the rules and components used by this website.",
                  )}
                </p>
              </div>
              <a className="action secondary" href="/systems/happyhands/">
                {t("探索 HappyHands", "Explore HappyHands")}{" "}
                <Icon name="right" />
              </a>
            </div>
            <div className="system-return"><a href="/components/?provider=systems">{t("返回设计系统", "All design systems")}</a><a href="/systems/lime/">{t("了解 Lime", "Explore Lime")} <Icon name="right" /></a></div>
            <details>
              <summary>
                {t("来源、版本与许可", "Sources, versions & licensing")}
              </summary>
              <p>
                {t(
                  "资料核对于 2026-10-16，未锁定上游发布版本。未转载组件源码、字体和官方截图。使用时请核对上游许可、依赖及锁文件。",
                  "Documentation checked on 2026-10-16; no upstream release is pinned. Component source, fonts and screenshots are not redistributed. Check upstream licenses, dependencies and lockfiles before adoption.",
                )}
              </p>
              <a href="https://design.how/systems/quartz">
                {t(
                  "原始设计系统文档（外部）",
                  "Original documentation (external)",
                )}
              </a>{" "}
               / {" "}
              <a href="https://design.how/r/quartz/registry.json">
                {t("上游组件注册表（外部）", "Upstream registry (external)")}
              </a>
            </details>
          </footer>
        </main>
      </div>
      <output className="notice" aria-live="polite">
        {status}
      </output>
    </>
  );
}
createRoot(document.getElementById("root")!).render(<App />);
import '../../packages/ui/system-embed';
