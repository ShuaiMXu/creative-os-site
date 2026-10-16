import { SystemDirectory } from "../../packages/ui/SystemDirectory";
import { useSitePreferences } from "../../packages/ui/useSitePreferences";
import { SiteHeader } from "../../packages/ui/SiteHeader";
import { SystemBreadcrumb } from "../../packages/ui/SystemBreadcrumb";
import React, { useState, useRef } from "react";
import { createRoot } from "react-dom/client";
import { Button } from "../../packages/ui";
import tokens from "../../packages/design-tokens/happyhands.json";
import "../../packages/design-tokens/happyhands.css";
import "../../packages/ui/components.css";
import "../../packages/ui/site-layout.css";
import "../../packages/ui/system-page.css";
import "./style.css";

function App() {
  const { lang, dark, toggleLanguage, toggleTheme } = useSitePreferences();

  const [status, setStatus] = useState("");
  const [mode, setMode] = useState("existing");
  const [state, setState] = useState("empty");
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement>(null);
  React.useEffect(() => {
    document.title =
      lang === "zh" ? "HappyHands · 设计系统" : "HappyHands · Design system";
  }, [lang]);
  const t = (zh: string, en: string) => (lang === "zh" ? zh : en);
  const buttonLabels = {
    primary: t("主要操作", "Primary action"),
    secondary: t("次要操作", "Secondary action"),
    ghost: t("轻量操作", "Quiet action"),
    danger: t("危险操作", "Destructive action"),
  };

  const prompt = t(
    `${mode === "existing" ? "将本项目的一个页面逐步对齐" : "用本项目的技术栈构建采用"} HappyHands 设计系统。先读取 ${location.origin}/systems/happyhands/SKILL.md，并核对 creative-os-site 的 packages/design-tokens/happyhands.json、packages/ui 与 docs/studio-design-language.md，记录采用的提交版本。先检查现有规范和技术兼容性，保留已批准品牌、业务行为和数据；不修改被审阅项目的品牌。复用已有 Button 和设计变量，其他组件按真实需求实现并标记新增 API。检查中英文、深浅色、390/768/1280px、键盘焦点和加载/错误状态，交付前后截图与剩余问题。当前无公开安装包，不虚构安装命令。`,
    `${mode === "existing" ? "Migrate one screen in this project to" : "Build a screen in the current stack with"} HappyHands. Read ${location.origin}/systems/happyhands/SKILL.md and inspect creative-os-site packages/design-tokens/happyhands.json, packages/ui and docs/studio-design-language.md. Record the adopted commit. Check existing rules and compatibility; preserve approved branding, data and business behavior. Do not rebrand reviewed products. Reuse Button and tokens, document any new component API. Verify Chinese/English, light/dark, 390/768/1280px, keyboard focus and loading/error states. Deliver before/after captures and remaining gaps. There is no public installer; do not invent installation commands.`,
  );
  const source = "https://github.com/ShuaiMXu/creative-os-site/tree/main";
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
      <div className="system-landing happyhands-system">
        <main>
          <SystemBreadcrumb current="HappyHands" lang={lang} />
          <section id="overview" className="system-introduction">
            <div>
              <p className="eyebrow">
                {t("我们的设计系统", "Our design system")}
              </p>
              <h1>HappyHands</h1>
              <p className="system-tagline">
                {t("清楚、克制、亲和。", "Clear. Considered. Human.")}
              </p>
              <p className="lead">
                {t(
                  "从品牌、语义颜色到组件状态，让每个页面遵循同一套规则。官网与主题工作室正在使用的设计基础。",
                  "From brand and semantic colors to component states: shared rules for every screen. The foundation used by this website and Theme Studio.",
                )}
              </p>
              <div className="actions">
                <a className="action" href="#components">
                  {t("试用组件", "Try components")}
                </a>
                <a href="#adopt">{t("接入项目", "Use in your project")} →</a>
              </div>
            </div>
            <aside
              className="system-showcase"
              aria-label={t(
                "HappyHands 组件预览",
                "HappyHands component preview",
              )}
            >
              <div className="showcase-heading">
                <span>{t("页面审阅", "Page review")}</span>
                <span className="showcase-status">
                  {t("待确认", "Awaiting confirmation")}
                </span>
              </div>
              <p className="eyebrow">{t("交互示例", "Interactive example")}</p>
              <h2>{t("确认本次审阅范围", "Confirm the review scope")}</h2>
              <p>
                {t(
                  "选择需要改进的页面，再核对修改结果。",
                  "Choose the pages to improve, then review the results.",
                )}
              </p>
              <div className="actions">
                <Button
                  variant="primary"
                  onClick={() =>
                    setStatus(
                      t(
                        "示例范围已确认，未修改项目。",
                        "Demo scope confirmed. No project was changed.",
                      ),
                    )
                  }
                >
                  {t("确认范围", "Confirm scope")}
                </Button>
                <a href="#components">
                  {t("查看组件状态", "See component states")}
                </a>
              </div>
              <div className="showcase-palette" aria-hidden="true">
                <i />
                <i />
                <i />
                <i />
              </div>
            </aside>
          </section>
          <SystemDirectory label={t("本页目录", "On this page")}>
            <nav aria-label={t("设计系统目录", "Design system navigation")}>
              {[
                ["overview", "概览", "Overview"],
                ["foundations", "基础规范", "Foundations"],
                ["components", "组件与状态", "Components & states"],
                ["patterns", "页面模式", "Screen patterns"],
                ["adopt", "接入项目", "Setup"],
              ].map(([id, zh, en]) => (
                <a key={id} href={"#" + id}>
                  {t(zh, en)}
                </a>
              ))}
            </nav>
          </SystemDirectory>
          <section id="foundations">
            <p className="eyebrow">{t("01 / 基础规范", "01 / Foundations")}</p>
            <h2>{t("颜色、文字与间距", "Color, type and spacing")}</h2>
            <div className="swatches">
              {["bg", "bg-raised", "ink", "brand", "success", "danger"].map(
                (key) => (
                  <div key={key}>
                    <i style={{ background: `var(--hh-${key})` }} />
                    <strong>{key}</strong>
                    <code>
                      {
                        (dark ? tokens.dark : tokens.light)[
                          key as keyof typeof tokens.light
                        ]
                      }
                    </code>
                  </div>
                ),
              )}
            </div>
            <div className="rules">
              <article>
                <h3>{t("文字", "Type")}</h3>
                <p>
                  {t(
                    "苹方优先的无衬线字体。标题明确，正文自然换行，技术编号才使用等宽。",
                    "PingFang-first sans serif. Clear headings, natural wrapping; monospace for technical identifiers.",
                  )}
                </p>
              </article>
              <article>
                <h3>{t("空间与形状", "Space & shape")}</h3>
                <p>
                  {t(
                    "间距使用 4 / 8 / 12 / 16 / 24 / 32；控件圆角 10，浮层 18。平面内容不堆阴影。",
                    "Spacing: 4 / 8 / 12 / 16 / 24 / 32. Controls: radius 10; floating surfaces: 18. Keep flat content free of stacked shadows.",
                  )}
                </p>
              </article>
              <article>
                <h3>{t("动作与证据", "Actions & evidence")}</h3>
                <p>
                  {t(
                    "黑白主按钮表达下一步。橙色用于品牌强调；成功、警告和错误同时使用明确文案。",
                    "Ink primary actions show the next step. Orange is a brand accent; success, warning and errors also have explicit text.",
                  )}
                </p>
              </article>
            </div>
          </section>
          <section id="components">
            <p className="eyebrow">
              {t("02 / 组件与状态", "02 / Components & states")}
            </p>
            <h2>{t("试用组件与交互", "Try the components")}</h2>
            <div className="demo">
              <h3>Button</h3>
              <p>
                {t(
                  "复用 packages/ui 的 React 组件：四种意图、禁用与加载。",
                  "Uses the React component from packages/ui: four intents, disabled and loading states.",
                )}
              </p>
              <div className="actions">
                {(["primary", "secondary", "ghost", "danger"] as const).map(
                  (v) => (
                    <Button
                      key={v}
                      variant={v}
                      onClick={() =>
                        setStatus(
                          t("已触发演示按钮：", "Demo action: ") +
                            buttonLabels[v],
                        )
                      }
                    >
                      {buttonLabels[v]}
                    </Button>
                  ),
                )}
                <Button disabled>{t("不可用", "Unavailable")}</Button>
                <Button loading>{t("处理中", "Working")}</Button>
              </div>
              <p className="note">
                {t(
                  "不可用示例：尚未选择审阅记录。加载按钮仅展示状态。",
                  "Unavailable example: no review selected. The loading button demonstrates a state only.",
                )}
              </p>
              <pre>
                {`<Button variant="primary" loading={saving} onClick={save}>${t("保存", "Save")}</Button>`}
              </pre>
            </div>
            <div className="demo">
              <h3>
                {t(
                  "表单与弹窗 · 原生交互示例",
                  "Form & dialog · native examples",
                )}
              </h3>
              <p>
                {t(
                  "以下展示键盘与状态约定，尚未封装为可安装组件。不会保存数据或执行项目修改。",
                  "These demonstrate keyboard and state conventions, not installable components. No data is saved or project changes executed.",
                )}
              </p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setStatus(
                    t(
                      "演示提交成功，未保存数据。",
                      "Demo submitted. No data saved.",
                    ),
                  );
                }}
              >
                <label>
                  {t("项目名称", "Project name")}
                  <input
                    required
                    name="project"
                    placeholder={t(
                      "例如：产品工作台",
                      "e.g. Product workspace",
                    )}
                  />
                </label>
                <Button type="submit" variant="primary">
                  {t("验证表单", "Validate form")}
                </Button>
              </form>
              <button
                ref={opener}
                className="action secondary"
                onClick={() => dialog.current?.showModal()}
              >
                {t("打开确认弹窗", "Open confirmation dialog")}
              </button>
              <dialog
                ref={dialog}
                onClose={() => opener.current?.focus()}
                aria-labelledby="dialog-title"
              >
                <h3 id="dialog-title">{t("确认本次范围", "Confirm scope")}</h3>
                <p>
                  {t(
                    "这是交互演示，不会修改项目。",
                    "This is a demonstration. It will not change your project.",
                  )}
                </p>
                <Button autoFocus onClick={() => dialog.current?.close()}>
                  {t("关闭", "Close")}
                </Button>
              </dialog>
            </div>
            <div className="demo">
              <h3>{t("任务反馈 · 演示", "Task feedback · demo")}</h3>
              <div className="actions">
                {[
                  ["empty", "空", "Empty"],
                  ["loading", "加载", "Loading"],
                  ["error", "错误", "Error"],
                  ["success", "完成", "Complete"],
                ].map(([id, zh, en]) => (
                  <Button
                    key={id}
                    aria-pressed={state === id}
                    onClick={() => setState(id)}
                  >
                    {t(zh, en)}
                  </Button>
                ))}
              </div>
              <p role="status">
                {state === "empty"
                  ? t(
                      "暂无审阅，连接项目后开始。",
                      "No reviews yet. Connect a project to begin.",
                    )
                  : state === "loading"
                    ? t(
                        "正在采集页面，请稍候。",
                        "Capturing the page. Please wait.",
                      )
                    : state === "error"
                      ? t(
                          "无法连接预览，请检查地址后重试。",
                          "Preview unavailable. Check the address and retry.",
                        )
                      : t(
                          "采集完成，等待核对证据。",
                          "Capture complete. Evidence awaits review.",
                        )}
              </p>
              {state === "error" && (
                <Button onClick={() => setState("loading")}>
                  {t("重试演示", "Retry demo")}
                </Button>
              )}
            </div>
          </section>
          <section id="patterns">
            <p className="eyebrow">
              {t("03 / 页面模式", "03 / Screen patterns")}
            </p>
            <h2>{t("从真实使用处查看", "See it in use")}</h2>
            <div className="rules">
              <article>
                <h3>{t("官网", "Portal")}</h3>
                <p>
                  {t(
                    "品牌、内容与设计系统档案。",
                    "Brand, content and design-system catalog.",
                  )}
                </p>
                <a href="/apps/portal/">{t("打开官网", "Open portal")}</a>
              </article>
              <article>
                <h3>Theme Studio</h3>
                <p>
                  {t(
                    "设计变量编辑和组件状态预览。",
                    "Token editing and component-state previews.",
                  )}
                </p>
                <a href="/apps/studio/">{t("打开 Studio", "Open Studio")}</a>
              </article>
              <article>
                <h3>{t("本地审阅工作台", "Local review workbench")}</h3>
                <p>
                  {t(
                    "独立工程，部分规范仍待统一。",
                    "A separate project; alignment is still in progress.",
                  )}
                </p>
                <a href="https://github.com/ShuaiMXu/creative-os/blob/main/docs/local-workbench.md">
                  {t("启动说明", "Startup guide")}
                </a>
              </article>
            </div>
          </section>
          <section id="adopt">
            <p className="eyebrow">{t("04 / 接入项目", "04 / Setup")}</p>
            <h2>{t("获取 AI 接入指令", "Get the AI setup prompt")}</h2>
            <p>
              {t(
                "复制指令，交给你正在使用的 AI 代理。它会先核对项目规范，再逐页调整。",
                "Copy the prompt into your AI agent. It checks project conventions before adapting individual screens.",
              )}
            </p>
            <label>
              {t("接入方式", "Setup mode")}
              <select value={mode} onChange={(e) => setMode(e.target.value)}>
                <option value="existing">
                  {t(
                    "已有项目 · 逐页迁移",
                    "Existing project · migrate a screen",
                  )}
                </option>
                <option value="new">
                  {t("新项目 · 从首屏开始", "New project · first screen")}
                </option>
              </select>
            </label>
            <textarea
              aria-label={t("接入指令", "Setup prompt")}
              value={prompt}
              readOnly
              rows={8}
            />
            <div className="actions">
              <Button
                variant="primary"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(prompt);
                    setStatus(t("指令已复制。", "Prompt copied."));
                  } catch {
                    setStatus(
                      t(
                        "无法复制，请选中上方指令手动复制。",
                        "Copy unavailable. Select the prompt above manually.",
                      ),
                    );
                  }
                }}
              >
                {t("复制指令", "Copy prompt")}
              </Button>
              <a href="/systems/happyhands/SKILL.md">
                {t("阅读 Skill", "Read Skill")}
              </a>
              <a href={source + "/packages/design-tokens"}>
                {t("查看设计变量源码", "Token source")}
              </a>
            </div>
            <p className="note">
              {t(
                "当前提供设计变量与 React Button 源码，接入前请核对项目技术栈。",
                "Tokens and the React Button source are available. Check compatibility with your project before adoption.",
              )}
            </p>
          </section>
          <footer>
            <div className="system-related">
              <div>
                <p className="eyebrow">
                  {t("把规范用到你的项目", "Apply the rules to your project")}
                </p>
                <h2>
                  {t("在主题工作室中调整", "Make it yours in Theme Studio")}
                </h2>
                <p>
                  {t(
                    "编辑设计变量、选择字体，再查看组件的实际表现。",
                    "Edit tokens, choose fonts and preview component behavior.",
                  )}
                </p>
              </div>
              <a className="action secondary" href="/apps/studio/">
                {t("打开主题工作室", "Open Theme Studio")} →
              </a>
            </div>
            <div className="system-return">
              <a href="/apps/portal/#explore">
                ← {t("返回设计系统", "All design systems")}
              </a>
              <a href="/systems/quartz/">
                {t("了解 Quartz", "Explore Quartz")} →
              </a>
            </div>
            <details>
              <summary>
                {t("范围、源码与进度", "Scope, source and progress")}
              </summary>
              <p>
                {t(
                  "官网与主题工作室共用设计变量。审阅工作台属于独立工程，组件统一仍在进行。",
                  "The portal and Theme Studio share tokens. The review workbench is a separate project; component alignment is still in progress.",
                )}
              </p>
              {t(
                "来源：HappyHands 既有品牌规范与组件。页面复核见对齐记录。",
                "Source: existing HappyHands brand rules and components. See the alignment record for page validation.",
              )}{" "}
              <a href={source + "/docs/website-detail-alignment.md"}>
                {t("对齐记录", "Alignment record")}
              </a>
              <p>
                {t(
                  "暂无 npm / shadcn 安装包或完整自动 lint。品牌素材不因此授予第三方商标使用权。",
                  "No npm/shadcn installer or comprehensive automated lint is published. Brand assets do not grant third-party trademark rights.",
                )}
              </p>
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
