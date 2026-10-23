import { ComponentTile } from "./ComponentTile";
import { ReferoImport } from "./ReferoImport";
import { SystemLibrary } from "./SystemLibrary";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { Icon } from "../packages/ui/Icon";
import "../packages/ui/components.css";
import { SiteHeader } from "../packages/ui/SiteHeader";
import { useSitePreferences } from "../packages/ui/useSitePreferences";
import data from "../public/components/cult-ui/catalog.json";
import "../packages/design-tokens/happyhands.css";
import "../packages/ui/site-layout.css";
import "./style.css";
import "../packages/ui/owned-ui.css";
import { ProviderReference } from "./ProviderReference";
import providers from "../public/components/providers.json";
const groups: Record<string, [string, string]> = {
  all: ["全部组件", "All components"],
  buttons: ["按钮", "Buttons"],
  inputs: ["输入与选择", "Inputs"],
  cards: ["卡片与投票", "Cards and polls"],
  navigation: ["导航与切换", "Navigation"],
  overlays: ["弹层与展开", "Overlays"],
  type: ["文字与数字", "Typography"],
  illustrations: ["插画与设备", "Illustrations"],
  sections: ["页面区块", "Sections"],
  effects: ["背景与效果", "Effects"],
};
type Item = (typeof data.items)[number];
const title = (x: Item) =>
  x.title.replace("Ui", "UI").replace("Svg", "SVG").replace("Ai ", "AI ");
const readSelection = () =>
  data.items.find(
    (x) => x.id === new URLSearchParams(location.search).get("component"),
  )?.id || "";
function App() {
  const readProvider = () => {
    const value = new URLSearchParams(location.search).get("provider");
    return value === "kage" || value === "refero" || value === "systems"
      ? value
      : "cult-ui";
  };
  const [provider, setProvider] = useState(readProvider);
  const { lang, dark, toggleLanguage, toggleTheme } = useSitePreferences();
  const t = (zh: string, en: string) => (lang === "zh" ? zh : en);
  const [selected, setSelected] = useState(readSelection),
    [group, setGroup] = useState("all"),
    [query, setQuery] = useState("");
  const [tab, setTab] = useState("preview"),
    [motion, setMotion] = useState(false),
    [running, setRunning] = useState(true),
    [mobile, setMobile] = useState(false),
    [notice, setNotice] = useState("");
  const [source, setSource] = useState<{
      files: { path: string; content: string }[];
    } | null>(null),
    [sourceError, setSourceError] = useState(false);
  const main = useRef<HTMLElement>(null);
  const lastTile = useRef("");
  const returning = useRef(false);
  useLayoutEffect(() => {
    if (!selected && returning.current) {
      returning.current = false;
      document
        .querySelector<HTMLAnchorElement>(
          `.component-tile[href$="component=${lastTile.current}"]`,
        )
        ?.focus();
    }
  }, [selected]);
  const item = data.items.find((x) => x.id === selected) || data.items[0];
  const [page, setPage] = useState(0);
  useEffect(() => setPage(0), [group, query]);
  useEffect(() => {
    if (selected) main.current?.focus();
  }, [selected]);
  const limitation = (reason: string) =>
    reason.startsWith("dependency:")
      ? t("需要运行依赖：", "Requires dependency: ") + reason.slice(11)
      : reason.startsWith("module:")
        ? t("需要配套模块：", "Requires module: ") + reason.slice(7)
        : {
            "host-api": t(
              "需要网络或宿主环境能力",
              "Needs network or host capabilities",
            ),
            "media-or-host-setup": t(
              "需要媒体资源或服务配置",
              "Needs media or service setup",
            ),
            "pixel-font-setup": t(
              "需要配套像素字体",
              "Needs matching pixel fonts",
            ),
            "device-frame-asset": t(
              "需要设备边框素材及许可核对",
              "Needs device frame assets and license review",
            ),
            "no-demo": t(
              "上游未提供独立示例",
              "No standalone upstream example",
            ),
          }[reason] || reason;
  useEffect(() => {
    document.title =
      lang === "zh"
        ? "HappyHands / 组件目录"
        : "HappyHands / Component library";
  }, [lang]);
  useEffect(() => {
    const handle = () => {
      setProvider(readProvider());
      setSelected(readSelection());
      setTab("preview");
    };
    addEventListener("popstate", handle);
    return () => removeEventListener("popstate", handle);
  }, []);
  useEffect(() => {
    setSource(null);
    setSourceError(false);
    setNotice("");
    setRunning(true);
    setMotion(false);
  }, [selected]);
  useEffect(() => {
    if (tab !== "source") return;
    const c = new AbortController();
    fetch(item.source, { signal: c.signal })
      .then((r) => {
        if (!r.ok) throw Error("source");
        return r.json();
      })
      .then(setSource)
      .catch((e) => {
        if (e.name !== "AbortError") setSourceError(true);
      });
    return () => c.abort();
  }, [selected, tab]);
  function select(id: string) {
    lastTile.current = id;
    setSelected(id);
    setTab("preview");
    history.pushState(
      null,
      "",
      `?provider=cult-ui&component=${encodeURIComponent(id)}`,
    );
    main.current?.focus();
  }
  const filtered = data.items.filter(
    (x) =>
      !x.aliasOf &&
      (group === "all" || x.category === group) &&
      `${x.id} ${x.title} ${x.description} ${groups[x.category]?.join(" ")}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  const guidance = t(
    `评估 Cult UI 的 ${item.id} 是否适合当前项目。固定源码版本：${item.revision}。\n先读取 ${location.origin}${item.source} 和 ${location.origin}/components/cult-ui/catalog.json，核对 MIT 许可、源码 SHA-256：${item.sourceSha256}、React/Tailwind 兼容性、npm 依赖和 registryDependencies。\n读取目标项目的设计规范，列出颜色、字体、间距、圆角和组件状态映射。不得直接覆盖全局主题或为演示引入无关服务。\n当前条目只是候选组件，站内可预览不等于项目适配通过。确认范围后再接入，验证键盘、触屏、减少动态效果、深浅色、响应式及原有业务流程。交付差异、验证证据与未解决限制。`,
    `Evaluate Cult UI ${item.id} for this project. Pinned source revision: ${item.revision}.\nRead ${location.origin}${item.source} and ${location.origin}/components/cult-ui/catalog.json. Verify MIT licensing, source SHA-256: ${item.sourceSha256}, React/Tailwind compatibility, npm dependencies and registryDependencies.\nRead project design rules and map colors, typography, spacing, corners and states. Do not overwrite global themes or add unrelated services.\nThis entry is a candidate; a preview is not project approval. Confirm scope before integration. Validate keyboard, touch, reduced motion, themes, responsive layout and business flows. Deliver the diff, evidence and limitations.`,
  );
  async function copy() {
    try {
      await navigator.clipboard.writeText(guidance);
      setNotice(t("接入说明已复制。", "Guidance copied."));
    } catch {
      setNotice(
        t(
          "无法自动复制，请选择下方文本复制。",
          "Copy unavailable. Select and copy the text below.",
        ),
      );
    }
  }
  const tabs = [
    ["preview", t("效果预览", "Preview")],
    ["source", t("源码", "Source")],
    ["integration", t("接入规范", "Integration")],
  ];
  return (
    <>
      <a className="catalog-skip" href="#catalog-main">
        {t("跳到内容", "Skip to content")}
      </a>
      <SiteHeader
        lang={lang}
        dark={dark}
        onLanguage={toggleLanguage}
        onTheme={toggleTheme}
        active="/apps/portal/#explore"
      />
      <div className="library-heading">
        <div>
          <h1>{t("设计资源", "Design resources")}</h1>
        </div>
      </div>
      <nav
        className="resource-sections"
        aria-label={t("设计系统分类", "Design system sections")}
      >
        {[
          ["systems", t("设计系统", "Design systems")],
          ["cult-ui", t("组件库", "Component libraries")],
          ["kage", t("设计参考", "Design references")],
        ].map(([id, label]) => (
          <a
            key={id}
            href={`?provider=${id}`}
            aria-current={
              provider === id || (id === "kage" && provider === "refero")
                ? "page"
                : undefined
            }
            onClick={(e) => {
              if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
              e.preventDefault();
              setProvider(id);
              setSelected("");
              history.pushState(null, "", `?provider=${id}`);
            }}
          >
            {label}
          </a>
        ))}
      </nav>
      {provider !== "systems" && provider !== "cult-ui" && (
        <nav
          className="provider-navigation"
          aria-label={t("资源来源", "Resource sources")}
        >
          {providers.providers
            .filter((p) =>
              provider === "cult-ui"
                ? p.kind === "source-registry"
                : p.kind !== "source-registry",
            )
            .map((p) => (
              <a
                key={p.id}
                href={`?provider=${p.id}`}
                aria-current={provider === p.id ? "page" : undefined}
                onClick={(e) => {
                  if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
                  e.preventDefault();
                  setProvider(p.id);
                  history.pushState(null, "", `?provider=${p.id}`);
                }}
              >
                <strong>{p.name}</strong>
                <span>
                  {p.kind === "source-registry"
                    ? t(
                        "组件源码 / 站内预览",
                        "Component source / Local previews",
                      )
                    : p.id === "refero"
                      ? t(
                          "风格与规范 / DESIGN.md",
                          "Style guidelines / DESIGN.md",
                        )
                      : t("页面与区块 / MCP", "Pages and sections / MCP")}
                </span>
              </a>
            ))}
        </nav>
      )}
      {provider === "systems" ? (
        <SystemLibrary lang={lang} />
      ) : provider === "refero" ? (
        <ReferoImport lang={lang} />
      ) : provider === "kage" ? (
        <ProviderReference lang={lang} />
      ) : (
        <div
          className={`library-layout ${selected ? "library-detail" : "library-browse"}`}
        >
          {!selected && (
            <>
              <aside
                className="library-directory"
                aria-label={t("组件目录", "Component directory")}
              >
                <label className="catalog-search">
                  {t("搜索组件", "Search components")}
                  <input
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={t(
                      "名称、分类或关键词",
                      "Name, category or keyword",
                    )}
                  />
                </label>
                <label className="catalog-category">
                  {t("分类", "Category")}
                  <span className="hh-select-field">
                    <select
                      value={group}
                      onChange={(e) => setGroup(e.target.value)}
                    >
                      {Object.entries(groups).map(([id, labels]) => (
                        <option key={id} value={id}>
                          {labels[lang === "zh" ? 0 : 1]} /{" "}
                          {id === "all"
                            ? data.items.filter((x) => !x.aliasOf).length
                            : data.items.filter(
                                (x) => !x.aliasOf && x.category === id,
                              ).length}
                        </option>
                      ))}
                    </select>
                    <Icon name="down" />
                  </span>
                </label>
                <p className="catalog-results" role="status">
                  {filtered.length} {t("个结果", "results")}
                </p>
              </aside>
              <main
                id="catalog-main"
                className="component-results"
                tabIndex={-1}
              >
                <div className="component-grid">
                  {filtered.slice(page * 18, (page + 1) * 18).map((entry) => (
                    <ComponentTile
                      key={entry.id}
                      id={entry.id}
                      name={title(entry)}
                      category={
                        groups[entry.category]?.[lang === "zh" ? 0 : 1] || ""
                      }
                      dark={dark}
                      lang={lang}
                      onSelect={select}
                    />
                  ))}
                </div>
                {!filtered.length && (
                  <div className="catalog-empty">
                    <h2>{t("没有匹配的组件", "No matching components")}</h2>
                    <button
                      onClick={() => {
                        setQuery("");
                        setGroup("all");
                      }}
                    >
                      {t("清除筛选", "Clear filters")}
                    </button>
                  </div>
                )}
                {filtered.length > 18 && (
                  <nav
                    className="gallery-pagination"
                    aria-label={t("组件分页", "Component pages")}
                  >
                    <button
                      disabled={page === 0}
                      onClick={() => {
                        setPage(page - 1);
                        document.getElementById("catalog-main")?.focus();
                      }}
                    >
                      {t("上一页", "Previous")}
                    </button>
                    <span>
                      {page + 1} / {Math.ceil(filtered.length / 18)}
                    </span>
                    <button
                      disabled={(page + 1) * 18 >= filtered.length}
                      onClick={() => {
                        setPage(page + 1);
                        document.getElementById("catalog-main")?.focus();
                      }}
                    >
                      {t("下一页", "Next")}
                    </button>
                  </nav>
                )}
              </main>
            </>
          )}
          {selected && (
            <main
              id="catalog-main"
              ref={main}
              tabIndex={-1}
              className="catalog-main"
            >
              <div className="component-detail-actions">
                <button
                  onClick={() => {
                    returning.current = true;
                    setSelected("");
                    history.pushState(null, "", "?provider=cult-ui");
                  }}
                >
                  {t("← 返回组件库", "← All components")}
                </button>
                <button onClick={() => setTab("integration")}>
                  {t("用于项目", "Use in project")}
                </button>
              </div>
              <div className="catalog-item-head">
                <h2>{title(item)}</h2>
                <details className="upstream-description">
                  <summary>
                    {t("上游组件说明（英文）", "Component description")}
                  </summary>
                  <p>{item.description}</p>
                </details>
              </div>
              <div
                className="catalog-tabs"
                role="tablist"
                aria-label={t("组件内容", "Component content")}
              >
                {tabs.map(([id, label], i) => (
                  <button
                    key={id}
                    role="tab"
                    id={`tab-${id}`}
                    aria-selected={tab === id}
                    aria-controls={`panel-${id}`}
                    tabIndex={tab === id ? 0 : -1}
                    onClick={() => setTab(id)}
                    onKeyDown={(e) => {
                      if (
                        ["ArrowRight", "ArrowLeft", "Home", "End"].includes(
                          e.key,
                        )
                      ) {
                        e.preventDefault();
                        const n =
                          e.key === "Home"
                            ? 0
                            : e.key === "End"
                              ? 2
                              : (i + (e.key === "ArrowRight" ? 1 : 2)) % 3;
                        setTab(tabs[n][0]);
                        document.getElementById(`tab-${tabs[n][0]}`)?.focus();
                      }
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <section
                id={`panel-${tab}`}
                role="tabpanel"
                aria-labelledby={`tab-${tab}`}
                className="catalog-panel"
              >
                {tab === "preview" &&
                  (item.preview ? (
                    <>
                      <div className="preview-toolbar">
                        <label>
                          <input
                            type="checkbox"
                            checked={motion}
                            onChange={(e) => setMotion(e.target.checked)}
                          />
                          {t("启用动态效果", "Enable motion")}
                        </label>
                        <button
                          onClick={() => setMobile(!mobile)}
                          aria-pressed={mobile}
                        >
                          {mobile
                            ? t("手机宽度", "Mobile width")
                            : t("自适应宽度", "Flexible width")}
                        </button>
                        <button onClick={() => setRunning(!running)}>
                          {running
                            ? t("停止预览", "Stop preview")
                            : t("启动预览", "Start preview")}
                        </button>
                      </div>
                      <div
                        className={`preview-frame-wrap ${mobile ? "mobile" : ""}`}
                      >
                        {running ? (
                          <iframe
                            key={`${selected}-${dark}-${motion}`}
                            title={`${title(item)} ${t("交互预览", "interactive preview")}`}
                            src={`/components/preview/?component=${item.id}&theme=${dark ? "dark" : "light"}&lang=${lang}&motion=${motion ? "on" : "off"}`}
                            sandbox={`allow-scripts${item.id === "bg-image-texture" ? " allow-downloads" : ""}`}
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <p>{t("预览已停止。", "Preview stopped.")}</p>
                        )}
                      </div>
                      <p className="catalog-footnote">
                        {t(
                          "本地示例，不连接外部服务。接入项目后仍需验证。",
                          "Local demo; no external service connection. Validate again in your project.",
                        )}
                      </p>
                    </>
                  ) : (
                    <div className="catalog-unavailable">
                      <h3>
                        {item.aliasOf
                          ? t(
                              "请使用当前组件名称",
                              "Use the current component name",
                            )
                          : t(
                              "源码已收录，预览尚需配置",
                              "Source available; preview needs setup",
                            )}
                      </h3>
                      <p>
                        {item.aliasOf
                          ? t(
                              "此名称是上游保留的兼容别名。",
                              "This is an upstream compatibility alias.",
                            )
                          : t(
                              "此组件需要额外依赖、媒体或框架配置。可在源码与接入规范中查看条件。",
                              "This component needs additional dependencies, media or framework setup. See Source and Integration for details.",
                            )}
                      </p>
                      {item.aliasOf && (
                        <button onClick={() => select(item.aliasOf!)}>
                          {item.aliasOf} →
                        </button>
                      )}
                      <ul>
                        {!item.aliasOf &&
                          item.limitations.map((reason) => (
                            <li key={reason}>
                              <span>{limitation(reason)}</span>
                            </li>
                          ))}
                      </ul>
                    </div>
                  ))}
                {tab === "source" && (
                  <>
                    <p>
                      {t(
                        "固定版本的原始源码，未经演示适配。",
                        "Original source at the pinned revision, before preview adaptations.",
                      )}
                    </p>
                    <a className="catalog-download" href={item.source} download>
                      {t("下载源码清单", "Download source registry")}
                    </a>
                    {sourceError ? (
                      <p role="alert">
                        {t(
                          "源码读取失败，请重试或下载文件。",
                          "Source could not load. Retry or download the file.",
                        )}
                      </p>
                    ) : source ? (
                      source.files.length ? (
                        source.files.map((file) => (
                          <details
                            key={file.path}
                            className="source-file"
                            open={source.files.length === 1}
                          >
                            <summary>{file.path}</summary>
                            <pre>
                              <code>{file.content}</code>
                            </pre>
                          </details>
                        ))
                      ) : (
                        <p>
                          {t(
                            "兼容别名不包含独立源码。",
                            "This alias has no separate source files.",
                          )}
                        </p>
                      )
                    ) : (
                      <p>{t("正在读取源码…", "Loading source…")}</p>
                    )}
                  </>
                )}
                {tab === "integration" && (
                  <>
                    <h3>{t("接入前核对", "Before integration")}</h3>
                    <dl className="integration-facts">
                      <div>
                        <dt>{t("源码版本", "Revision")}</dt>
                        <dd>
                          <code>{item.revision}</code>
                        </dd>
                      </div>
                      <div>
                        <dt>{t("许可", "License")}</dt>
                        <dd>
                          <a href="/components/cult-ui/LICENSE.txt">
                            MIT / Cult UI / Jordan Gilliam
                          </a>
                        </dd>
                      </div>
                      <div>
                        <dt>{t("运行依赖", "Runtime dependencies")}</dt>
                        <dd>
                          {item.dependencies.join(", ") ||
                            t(
                              "注册表未额外声明；仍需 React 与 Tailwind 环境。",
                              "No additional packages declared; React and Tailwind are still required.",
                            )}
                        </dd>
                      </div>
                      <div>
                        <dt>{t("组件依赖", "Registry dependencies")}</dt>
                        <dd>
                          {item.registryDependencies.join(", ") ||
                            t("无额外声明", "None declared")}
                        </dd>
                      </div>
                    </dl>
                    <p>
                      {t(
                        "本站预览与目标项目的正式接入分别验证。先匹配项目技术栈和设计规范，再决定是否采用。",
                        "Verify previews and target integration separately. Match the project stack and design rules before adoption.",
                      )}
                    </p>
                    <h3>
                      {t("交给项目代理", "Guidance for your project agent")}
                    </h3>
                    <textarea
                      aria-label={t("接入说明", "Integration guidance")}
                      readOnly
                      value={guidance}
                      rows={10}
                    />
                    <div className="catalog-actions">
                      <button onClick={copy}>
                        {t("复制接入说明", "Copy guidance")}
                      </button>
                      <a href="/components/cult-ui/catalog.json" download>
                        {t("下载 Harness 组件目录", "Download Harness catalog")}
                      </a>
                    </div>
                    <p role="status">{notice}</p>
                    <p className="catalog-footnote">
                      {t(
                        "目录可供 Harness 读取；当前未连接自动选用或自动安装。",
                        "The catalog is readable by Harness; automatic selection and installation are not connected.",
                      )}
                    </p>
                  </>
                )}
              </section>
              <details className="catalog-provenance">
                <summary>
                  {t("来源与展示规范", "Source and display rules")}
                </summary>
                <p>
                  {t(
                    "目录来自固定版本的 Cult UI 注册表。网站外壳沿用 HappyHands；组件在独立预览文档中运行，样式不影响官网。原始源码、示例源码和许可证一并保留。",
                    "The catalog uses a pinned Cult UI registry. The shell uses HappyHands; components run in isolated preview documents without styling the site. Original sources, examples and licensing are retained.",
                  )}
                </p>
                <p>
                  <code>{data.revision}</code>
                </p>
                <p>
                  {t(
                    "原版预览不代表已满足 HappyHands 或目标项目的可访问性规范。",
                    "Source previews do not imply HappyHands or target-project accessibility approval.",
                  )}
                </p>
              </details>
            </main>
          )}
        </div>
      )}
    </>
  );
}
createRoot(document.getElementById("root")!).render(<App />);
