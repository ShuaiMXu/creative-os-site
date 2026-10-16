import { t, sceneLabel } from "./i18n";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import {
  keys,
  colorKeys,
  presets,
  presetStyles,
  setToken,
  adjustHsl,
  hex,
  contrastChecks,
  differences,
  importCSS,
  exportTheme,
  validateStyles,
  revision,
  type Key,
  type Mode,
  type ExportKind,
  type ThemeStyles,
} from "../../packages/theme-core";
import {
  newDraft,
  validateDraft,
  saveDraft,
  history,
  edit,
  undo,
  redo,
  validateFoundation,
  attachFoundation,
  approve,
  createProposal,
  type Draft,
} from "../../packages/theme-core/project";
import { Preview } from "./Preview";
import { ConnectedPreview } from "./ConnectedPreview";
import { Button } from "../../packages/ui";
import { StandardsPanel } from "./StandardsPanel";
import { useSitePreferences } from "../../packages/ui/useSitePreferences";
import { SiteHeader } from "../../packages/ui/SiteHeader";
import "../../packages/design-tokens/happyhands.css";
import "./studio.css";
import "../../packages/ui/components.css";

function download(name: string, text: string) {
  const url = URL.createObjectURL(
    new Blob([text], {
      type: name.endsWith(".css") ? "text/css" : "application/json",
    }),
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}
function read(id: string): Draft {
  const raw = localStorage.getItem(`hh-studio:${id}`);
  if (raw) return validateDraft(JSON.parse(raw));
  return newDraft(id, "我的产品");
}
function initial() {
  try {
    const id =
      new URLSearchParams(location.search).get("project") || "my-product";
    if (!/^[\w-]{1,80}$/.test(id)) throw Error("项目 ID 无效");
    const draft = read(id);
    const legacy = localStorage.getItem("hh-token-draft");
    if (
      !localStorage.getItem(`hh-studio:${id}`) &&
      legacy &&
      id === "my-product"
    ) {
      const old = JSON.parse(legacy);
      draft.styles = validateStyles(old.styles);
      draft.baseline = structuredClone(draft.styles);
      draft.project = old.project || draft.project;
    }
    return { draft, error: "" };
  } catch (e) {
    return {
      draft: newDraft("recovery", "恢复草稿"),
      error: `无法载入原草稿，已保留原始数据：${(e as Error).message}`,
    };
  }
}
const boot = initial();
const labels: Partial<Record<Key, string>> = {
  background: "页面背景",
  foreground: "主要文字",
  primary: "主要操作",
  "primary-foreground": "操作文字",
  secondary: "次要操作",
  "secondary-foreground": "次要文字",
  muted: "柔和背景",
  "muted-foreground": "辅助文字",
  accent: "强调背景",
  "accent-foreground": "强调文字",
  destructive: "危险操作",
  "destructive-foreground": "危险文字",
  card: "卡片背景",
  "card-foreground": "卡片文字",
  popover: "浮层背景",
  "popover-foreground": "浮层文字",
  border: "边框",
  input: "输入边框",
  ring: "焦点环",
  "shadow-color": "阴影颜色",
};
function TokenInput({
  name,
  value,
  onChange,
}: {
  name: Key;
  value: string;
  onChange: (value: string) => void;
}) {
  const [text, setText] = useState(value);
  const numeric =
    !colorKeys.includes(name) &&
    !name.startsWith("font-") &&
    Number.isFinite(parseFloat(value));
  const unit =
    value.match(/(px|rem|em)$/)?.[1] ??
    (name === "shadow-opacity"
      ? ""
      : name.startsWith("shadow-")
        ? "px"
        : "rem");
  const negative =
    name === "letter-spacing" ||
    ["shadow-offset-x", "shadow-offset-y", "shadow-spread"].includes(name);
  const maximum =
    name === "shadow-opacity"
      ? 1
      : unit === "px"
        ? 100
        : name === "letter-spacing"
          ? 0.2
          : 3;
  useEffect(() => setText(value), [value]);
  return (
    <label className="token-row" id={`token-${t(name)}`}>
      <span>
        {t(labels[name] || name)}
        <small>{t(name)}</small>
      </span>
      <div className="token-input-fields">
        {colorKeys.includes(name) && (
          <input
            type="color"
            aria-label={`${t(name)} picker`}
            value={hex(value)}
            onChange={(e) => onChange(e.target.value)}
          />
        )}
        <input
          aria-label={t(name)}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onBlur={() => {
            if (text !== value) onChange(text);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") e.currentTarget.blur();
          }}
        />
        {numeric && (
          <input
            type="range"
            aria-label={`${t(name)} slider`}
            min={negative ? -maximum : 0}
            max={maximum}
            step={unit === "px" ? 1 : 0.01}
            value={parseFloat(value)}
            onChange={(e) => onChange(`${e.target.value}${unit}`)}
          />
        )}
      </div>
    </label>
  );
}
function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="control-section">
      <h3>{title}</h3>
      {children}
    </section>
  );
}
function App() {
  const { lang, dark, toggleLanguage, toggleTheme } = useSitePreferences();
  useEffect(() => {
    document.title =
      lang === "zh" ? "主题工作室 · HappyHands" : "Theme Studio · HappyHands";
  }, [lang]);
  const [panelWidth, setPanelWidth] = useState(320);
  const [draft, setDraft] = useState(boot.draft),
    [h, setH] = useState(() => history(boot.draft.styles));
  const saved = useRef(boot.draft.revision);
  const blocked = useRef(false);
  const [mode, setMode] = useState<Mode>("light"),
    [tab, setTab] = useState("colors"),
    [scene, setScene] = useState("Components"),
    [viewport, setViewport] = useState("desktop"),
    [mobile, setMobile] = useState("preview");
  const [notice, setNotice] = useState(boot.error || "本地项目 · 自动保存"),
    [error, setError] = useState(""),
    [inspector, setInspector] = useState(false),
    [selected, setSelected] = useState<Key>("primary"),
    [compare, setCompare] = useState(false),
    [panel, setPanel] = useState("");
  const [source, setSource] = useState(""),
    [pending, setPending] = useState<{
      styles: ThemeStyles;
      warnings: string[];
      count: number;
    } | null>(null),
    [format, setFormat] = useState<ExportKind>("css");
  const [preset, setPreset] = useState("happyhands"),
    [search, setSearch] = useState(""),
    [hue, setHue] = useState(0),
    [saturation, setSaturation] = useState(1),
    [lightness, setLightness] = useState(1);
  const [reviewer, setReviewer] = useState(""),
    [reason, setReason] = useState(""),
    [version, setVersion] = useState("1.0.0"),
    [confirmed, setConfirmed] = useState(false);
  const styles = h.present,
    values = styles[mode],
    changes = differences(draft.baseline, styles);
  const liveImportTarget = useRef({ id: draft.id, styles });
  liveImportTarget.current = { id: draft.id, styles };
  useEffect(() => setConfirmed(false), [styles, draft.foundation]);
  function current(): Draft {
    return { ...draft, styles, revision: saved.current };
  }
  function guard(action: () => void) {
    try {
      setError("");
      action();
    } catch (e) {
      setError((e as Error).message);
    }
  }
  function persist(next = current()) {
    if (blocked.current)
      throw Error("项目存在外部修改，请导出当前草稿后重新载入");
    const stored = saveDraft(localStorage, next, saved.current);
    saved.current = stored.revision;
    setNotice(`已保存在此浏览器 · 修订 ${stored.revision}`);
    return stored;
  }
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        persist();
      } catch (e) {
        setError((e as Error).message);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [styles, draft.id, draft.project, draft.foundation, draft.provenance]);
  useEffect(() => {
    const listener = (e: StorageEvent) => {
      if (e.key === `hh-studio:${draft.id}`) {
        blocked.current = true;
        setError("另一个窗口修改了这个项目。请导出当前草稿，再重新载入。");
      }
    };
    window.addEventListener("storage", listener);
    return () => window.removeEventListener("storage", listener);
  }, [draft.id]);
  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (
        !(e.metaKey || e.ctrlKey) ||
        e.key.toLowerCase() !== "z" ||
        (e.target as HTMLElement).closest(
          "input,textarea,select,[contenteditable]",
        )
      )
        return;
      e.preventDefault();
      setH((old) => (e.shiftKey ? redo(old) : undo(old)));
    };
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, []);
  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setPanel("");
        setInspector(false);
      }
    };
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, []);
  function change(key: Key, value: string) {
    guard(() =>
      setH((old) =>
        edit(old, setToken(old.present, mode, key, value), `${mode}:${key}`),
      ),
    );
  }
  function replace(next: ThemeStyles) {
    setH((old) => edit(old, validateStyles(next)));
  }
  function focusToken(key: Key) {
    setSelected(key);
    setTab(
      colorKeys.includes(key)
        ? "colors"
        : key.startsWith("font-")
          ? "type"
          : "layout",
    );
    setSearch("");
    setMobile("edit");
    setTimeout(
      () =>
        document
          .getElementById(`token-${key}`)
          ?.scrollIntoView({ block: "nearest", behavior: "smooth" }),
      50,
    );
  }
  function switchProject(id: string) {
    guard(() => {
      persist();
      const next = read(id);
      saved.current = next.revision;
      blocked.current = false;
      setDraft(next);
      setH(history(next.styles));
      setPanel("");
      setPending(null);
      setConfirmed(false);
      historyURL(id);
    });
  }
  function historyURL(id: string) {
    const url = new URL(location.href);
    url.searchParams.set("project", id);
    window.history.replaceState(null, "", url);
  }
  function applyImport() {
    if (!pending) return;
    replace(pending.styles);
    setDraft((d) => ({ ...d, provenance: { revision, source: "CSS import" } }));
    setNotice(
      `已应用 ${pending.count} 个变量；${pending.warnings.length} 项未应用。原始输入保留在导入面板。`,
    );
    setPending(null);
    setPanel("");
  }
  function importDraft(text: string) {
    const next = validateDraft(JSON.parse(text));
    replace(next.styles);
    setDraft((d) => ({
      ...d,
      provenance: {
        revision: next.provenance.revision,
        source: `Imported draft: ${next.project}`,
      },
    }));
    setNotice("已导入主题值，保留当前项目身份与基础版本");
  }
  function approveAndExport() {
    guard(() => {
      if (!confirmed) throw Error("请确认已经审阅变更与预览");
      const stored = persist();
      const artifact = approve(
        stored,
        version,
        reviewer,
        reason,
        stored.foundation?.foundationVersion,
      );
      const next = persist({
        ...stored,
        foundation: artifact,
        baseline: structuredClone(styles),
      });
      setDraft(next);
      setConfirmed(false);
      download("foundation-approval.json", JSON.stringify(artifact, null, 2));
      setNotice(
        `已批准并导出 ${version}。请通过 Harness 的 foundation-approve 导入；不会自动修改仓库。`,
      );
    });
  }
  let projectIds: string[] = [];
  try {
    projectIds = Object.keys(localStorage)
      .filter((k) => k.startsWith("hh-studio:"))
      .map((k) => k.slice(10));
  } catch {
    /* Export remains available when storage is blocked. */
  }
  if (!projectIds.includes(draft.id)) projectIds.push(draft.id);
  return (
    <>
      <SiteHeader
        lang={lang}
        dark={dark}
        onLanguage={toggleLanguage}
        onTheme={toggleTheme}
        active="/apps/studio/"
      />
      <div className="studio-project-bar">
        <span>{lang === "zh" ? "主题工作室" : "Theme Studio"}</span>
        <div className="project-select">
          <select
            aria-label={t("选择项目")}
            value={draft.id}
            onChange={(e) => switchProject(e.target.value)}
          >
            {projectIds.map((id) => (
              <option key={id}>{id}</option>
            ))}
          </select>
          <Button
            onClick={() => {
              const id = prompt(t("新项目 ID（英文、数字和短横线）"));
              if (id && /^[\w-]{1,80}$/.test(id)) switchProject(id);
            }}
          >
            ＋
          </Button>
        </div>
        <a className="review-link" href="/apps/portal/#connect-agent">
          {lang === "zh" ? "接入本地工作台 →" : "Connect local workbench →"}
        </a>
      </div>
      <main className="studio-shell">
        <div className="studio-title">
          <div>
            <p className="eyebrow">{t("设计系统 / 主题编辑")}</p>
            <h1>{t("项目设计系统")}</h1>
            <p>{t("调整主题、检查组件状态，再将设计约束交给你的项目。")}</p>
          </div>
          <div className="toolbar">
            <Button
              onClick={() => setPanel(panel === "standards" ? "" : "standards")}
            >
              {t("设计规范")}
            </Button>
            <Button disabled={!h.past.length} onClick={() => setH(undo)}>
              {t("↶ 撤销")}
            </Button>
            <Button disabled={!h.future.length} onClick={() => setH(redo)}>
              {t("↷ 重做")}
            </Button>
            <Button
              onClick={() =>
                guard(() => {
                  persist();
                })
              }
            >
              {t("保存")}
            </Button>
            <Button
              onClick={() => setPanel(panel === "import" ? "" : "import")}
            >
              {t("导入")}
            </Button>
            <Button
              onClick={() => setPanel(panel === "export" ? "" : "export")}
            >
              {t("导出")}
            </Button>
            <Button
              variant={panel ? "secondary" : "primary"}
              onClick={() => {
                setConfirmed(false);
                setPanel(panel === "review" ? "" : "review");
              }}
            >
              {t("审核变更")} {changes.length || ""}
            </Button>
          </div>
        </div>
        <div className="status-line">
          <span role="status">{t(notice)}</span>
          <span>
            {Object.keys(presets).length} {t("预设 ·")} {keys.length}{" "}
            {t("变量 × 2 模式 ·")}{" "}
            {draft.foundation
              ? `Foundation ${draft.foundation.foundationVersion}`
              : t("尚无批准版本")}
          </span>
        </div>
        {error && (
          <div className="error" role="alert">
            {t(error)}
            <Button
              onClick={() =>
                download(
                  "recovery-draft.json",
                  JSON.stringify(current(), null, 2),
                )
              }
            >
              {t("导出备份")}
            </Button>
            <Button onClick={() => location.reload()}>{t("重新载入")}</Button>
          </div>
        )}
        <div className="mobile-tabs">
          <Button
            aria-pressed={mobile === "edit"}
            onClick={() => setMobile("edit")}
          >
            {t("编辑")}
          </Button>
          <Button
            aria-pressed={mobile === "preview"}
            onClick={() => setMobile("preview")}
          >
            {t("预览")}
          </Button>
        </div>
        {panel && (
          <section className="utility-panel" aria-label={panel}>
            <div className="panel-title">
              <h2>
                {panel === "standards"
                  ? t("设计规范")
                  : panel === "import"
                    ? t("导入主题")
                    : panel === "export"
                      ? t("导出到你的工程")
                      : t("审核与 Foundation")}
              </h2>
              <Button onClick={() => setPanel("")} aria-label={t("关闭面板")}>
                ×
              </Button>
            </div>
            {panel === "standards" ? (
              <StandardsPanel
                styles={styles}
                foundation={draft.foundation}
                onApply={() => {
                  replace(presetStyles("happyhands"));
                  setDraft((d) => ({
                    ...d,
                    provenance: { revision, source: "happyhands" },
                  }));
                  setNotice(
                    t("已应用 HappyHands 设计语言，可撤销；尚未批准。"),
                  );
                }}
                onExport={(text) => download("design-checks.json", text)}
              />
            ) : panel === "import" ? (
              <>
                <p>
                  {t(
                    "支持 :root / .dark CSS，或 Studio 草稿 JSON。导入前会展示无法应用的内容。",
                  )}
                </p>
                <input
                  aria-label={t("导入主题文件")}
                  type="file"
                  accept=".css,.json"
                  onChange={(e) =>
                    guard(() => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      if (file.size > 250000)
                        throw Error(t("文件不能超过 250 KB"));
                      file
                        .text()
                        .then((text) => {
                          setSource(text);
                          setPending(null);
                        })
                        .catch((e) => setError(String(e)));
                    })
                  }
                />
                <textarea
                  aria-label={t("导入源代码")}
                  value={source}
                  onChange={(e) => {
                    setSource(e.target.value);
                    setPending(null);
                  }}
                  placeholder=":root { --primary: #f57f28; }"
                />
                <div className="toolbar">
                  <Button
                    onClick={() =>
                      guard(() => setPending(importCSS(source, styles)))
                    }
                  >
                    {t("解析 CSS")}
                  </Button>
                  <Button
                    onClick={() =>
                      guard(() => {
                        importDraft(source);
                        setPanel("");
                      })
                    }
                  >
                    {t("导入草稿 JSON")}
                  </Button>
                </div>
                {pending && (
                  <>
                    <p>
                      {t("识别")}
                      {pending.count}
                      {t("个变量，待确认应用。")}
                    </p>
                    <ul>
                      {pending.warnings.map((w) => (
                        <li key={t(w)}>{t(w)}</li>
                      ))}
                    </ul>
                    <Button variant="primary" onClick={applyImport}>
                      {t("应用已识别值（可撤销）")}
                    </Button>
                  </>
                )}
              </>
            ) : panel === "export" ? (
              <>
                <div className="toolbar">
                  <select
                    aria-label={t("导出格式")}
                    value={format}
                    onChange={(e) => setFormat(e.target.value as ExportKind)}
                  >
                    <option value="css">CSS variables</option>
                    <option value="tailwind4">Tailwind 4 CSS</option>
                    <option value="tailwind3">Tailwind 3 CSS</option>
                    <option value="tailwind3-config">Tailwind 3 config</option>
                    <option value="registry">shadcn registry</option>
                  </select>
                  <Button
                    onClick={() =>
                      download(
                        format === "registry"
                          ? "theme.registry.json"
                          : format === "tailwind3-config"
                            ? "tailwind.config.cjs"
                            : "theme.css",
                        exportTheme(styles, format),
                      )
                    }
                  >
                    {t("下载代码")}
                  </Button>
                  <Button
                    onClick={() =>
                      download(
                        "theme.draft.json",
                        JSON.stringify(current(), null, 2),
                      )
                    }
                  >
                    {t("下载草稿 JSON")}
                  </Button>
                  <Button
                    onClick={() =>
                      guard(() => {
                        navigator.clipboard
                          .writeText(exportTheme(styles, format))
                          .then(() => setNotice(t("代码已复制")))
                          .catch(() =>
                            setError(t("无法访问剪贴板，请下载代码")),
                          );
                      })
                    }
                  >
                    {t("复制")}
                  </Button>
                </div>
                <pre>{exportTheme(styles, format)}</pre>
                <p>
                  {t(
                    "Tailwind 3 需要同时导出 CSS 与 config。导出不会更改批准版本。",
                  )}
                </p>
              </>
            ) : (
              <>
                <div className="review-grid">
                  <div>
                    <h3>{t("1. 项目基础")}</h3>
                    <p>
                      {draft.foundation
                        ? t(
                            `基于 ${draft.foundation.foundationVersion}；品牌、组件与模式将完整保留。`,
                          )
                        : t(
                            "没有导入基础版本时，将创建仅含主题 token 的初始 Foundation，品牌与组件为空。",
                          )}
                    </p>
                    <label>
                      {t("导入现有 foundation-approval.json")}
                      <input
                        type="file"
                        accept=".json"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          if (file.size > 1000000) {
                            setError(t("Foundation 文件不能超过 1 MB"));
                            return;
                          }
                          file
                            .text()
                            .then((text) =>
                              guard(() => {
                                if (
                                  liveImportTarget.current.id !== draft.id ||
                                  liveImportTarget.current.styles !== styles
                                )
                                  throw Error(
                                    t(
                                      "文件读取期间项目或主题已变化，请重新导入 Foundation",
                                    ),
                                  );
                                const attached = attachFoundation(
                                  current(),
                                  JSON.parse(text),
                                );
                                const next = persist(attached.draft);
                                setDraft(next);
                                setH((old) => edit(old, next.styles));
                                setConfirmed(false);
                                setNotice(
                                  `已载入基础版本与 ${attached.mapped} 个命名匹配的主题变量；其他品牌、组件与 token 原样保留。`,
                                );
                              }),
                            )
                            .catch((e) => setError(String(e)));
                        }}
                      />
                    </label>
                    <h3>
                      {t("2. 变更明细 ·")}
                      {changes.length}
                    </h3>
                    <div className="diff-list">
                      {changes.length ? (
                        changes.map((c) => (
                          <div key={`${c.mode}-${c.key}`}>
                            <b>
                              {c.mode} / {c.key}
                            </b>
                            <del>{c.before}</del>
                            <span>→ {c.after}</span>
                          </div>
                        ))
                      ) : (
                        <p>{t("相对本地基线暂无修改。")}</p>
                      )}
                    </div>
                    <Button
                      onClick={() =>
                        download(
                          "theme-proposal.json",
                          JSON.stringify(createProposal(current()), null, 2),
                        )
                      }
                    >
                      {t("导出提案（未批准）")}
                    </Button>
                  </div>
                  <div>
                    <h3>{t("3. 人工批准")}</h3>
                    <p>
                      {t(
                        "对比度只是局部检查。请同时审阅浅色、深色及页面状态。",
                      )}
                    </p>
                    {contrastChecks(styles, mode).map((c) => (
                      <p key={c.bg}>
                        {c.bg} / {c.fg}：
                        {c.ratio === null
                          ? t("含透明度，需检查实际背景")
                          : `${c.ratio.toFixed(2)}:1 ${c.ratio >= 4.5 ? "✓" : t("需关注")}`}
                      </p>
                    ))}
                    <label>
                      {t("新版本")}
                      <input
                        aria-label={t("Foundation 版本")}
                        value={version}
                        onChange={(e) => setVersion(e.target.value)}
                      />
                    </label>
                    <label>
                      {t("审核人")}
                      <input
                        aria-label={t("审核人")}
                        value={reviewer}
                        onChange={(e) => setReviewer(e.target.value)}
                      />
                    </label>
                    <label>
                      {t("批准理由")}
                      <textarea
                        aria-label={t("批准理由")}
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                      />
                    </label>
                    <label className="check">
                      <input
                        type="checkbox"
                        checked={confirmed}
                        onChange={(e) => setConfirmed(e.target.checked)}
                      />
                      {t("我已审阅当前变更与双模式预览")}
                    </label>
                    <Button variant="primary" onClick={approveAndExport}>
                      {t("批准并导出 Harness 文件")}
                    </Button>
                    <p>
                      {t(
                        "映射使用 theme.light.* / theme.dark.* 名称，值保持字符串。下载后交给 Harness 的新 bootstrap run 导入；已开始规划的运行不能覆盖版本。",
                      )}
                    </p>
                    <Button
                      onClick={() => {
                        setReason("");
                        setConfirmed(false);
                        setPanel("");
                        setNotice(t("未批准；当前草稿保留，基础版本不变。"));
                      }}
                    >
                      {t("暂不批准，保留草稿")}
                    </Button>
                  </div>
                </div>
              </>
            )}
          </section>
        )}
        <div
          className={`editor-grid mobile-${mobile}`}
          style={
            {
              "--panel-width": `${panelWidth}px`,
            } as import("react").CSSProperties
          }
        >
          <aside className="controls">
            <details className="panel-settings">
              <summary>{t("面板宽度")}</summary>
              <input
                type="range"
                aria-label={t("面板宽度")}
                min="260"
                max="460"
                value={panelWidth}
                onChange={(e) => setPanelWidth(+e.target.value)}
              />
            </details>
            <label className="project-name">
              {t("项目名称")}
              <input
                value={draft.project}
                maxLength={200}
                onChange={(e) =>
                  setDraft({ ...draft, project: e.target.value })
                }
              />
            </label>
            <div className="preset-bar">
              <label>
                {t("起始预设")}
                <select
                  aria-label={t("主题预设")}
                  value={preset}
                  onChange={(e) => setPreset(e.target.value)}
                >
                  {Object.entries(presets).map(([id, p]) => (
                    <option value={id} key={id}>
                      {p.label || id}
                    </option>
                  ))}
                </select>
              </label>
              <Button
                onClick={() => {
                  replace(presetStyles(preset));
                  setDraft((d) => ({
                    ...d,
                    provenance: { revision, source: preset },
                  }));
                  setConfirmed(false);
                }}
              >
                {t("应用")}
              </Button>
            </div>
            <p className="micro">
              {t("替换双模式值，可撤销。默认使用苹方优先的无衬线字体。")}
            </p>
            <div className="segmented">
              {(["light", "dark"] as const).map((m) => (
                <Button
                  key={m}
                  aria-pressed={mode === m}
                  onClick={() => setMode(m)}
                >
                  {m === "light" ? t("☀ 浅色") : t("☾ 深色")}
                </Button>
              ))}
            </div>
            <div className="control-tabs">
              {[
                ["colors", "颜色"],
                ["type", "字体"],
                ["layout", "细节"],
              ].map(([id, name]) => (
                <Button
                  aria-pressed={tab === id}
                  key={id}
                  onClick={() => setTab(id)}
                >
                  {t(name)}
                </Button>
              ))}
            </div>
            {tab === "colors" ? (
              <>
                <input
                  className="token-search"
                  aria-label={t("搜索 token")}
                  placeholder={t("搜索 token…")}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <Section title={t("语义颜色")}>
                  {colorKeys
                    .filter(
                      (k) =>
                        k.includes(search) ||
                        (labels[k] || "").includes(search),
                    )
                    .map((k) => (
                      <TokenInput
                        key={k}
                        name={k}
                        value={values[k]!}
                        onChange={(value) => change(k, value)}
                      />
                    ))}
                </Section>
                <Section title={t("整体色彩调整")}>
                  <label>
                    {t("色相偏移")} {hue}°
                    <input
                      aria-label={t("色相偏移")}
                      type="range"
                      min="-180"
                      max="180"
                      value={hue}
                      onChange={(e) => setHue(+e.target.value)}
                    />
                  </label>
                  <label>
                    {t("饱和度 ×")} {saturation}
                    <input
                      type="range"
                      min="0"
                      max="2"
                      step="0.05"
                      value={saturation}
                      onChange={(e) => setSaturation(+e.target.value)}
                    />
                  </label>
                  <label>
                    {t("明度 ×")} {lightness}
                    <input
                      type="range"
                      min="0"
                      max="2"
                      step="0.05"
                      value={lightness}
                      onChange={(e) => setLightness(+e.target.value)}
                    />
                  </label>
                  <Button
                    onClick={() => {
                      replace(
                        adjustHsl(styles, mode, hue, saturation, lightness),
                      );
                      setHue(0);
                      setSaturation(1);
                      setLightness(1);
                    }}
                  >
                    {t("应用到当前模式")}
                  </Button>
                </Section>
              </>
            ) : tab === "type" ? (
              <Section title={t("字体与阅读节奏")}>
                {(
                  [
                    "font-sans",
                    "font-serif",
                    "font-mono",
                    "letter-spacing",
                  ] as Key[]
                ).map((k) => (
                  <TokenInput
                    key={k}
                    name={k}
                    value={values[k]!}
                    onChange={(v) => change(k, v)}
                  />
                ))}
                <p className="micro">
                  {t(
                    "字体需已安装或由项目加载。苹方不可用时使用备用字体；官网不会因预设切换为衬线字体。",
                  )}
                </p>
              </Section>
            ) : (
              <>
                <Section title={t("尺寸与间距")}>
                  {(["radius", "spacing"] as Key[]).map((k) => (
                    <TokenInput
                      key={k}
                      name={k}
                      value={values[k]!}
                      onChange={(v) => change(k, v)}
                    />
                  ))}
                </Section>
                <Section title={t("阴影")}>
                  {keys
                    .filter((k) => k.startsWith("shadow-"))
                    .map((k) => (
                      <TokenInput
                        key={k}
                        name={k}
                        value={values[k]!}
                        onChange={(v) => change(k, v)}
                      />
                    ))}
                </Section>
                <p className="micro">
                  {t(
                    "字体、圆角、间距与阴影尺寸同步明暗模式；阴影颜色分别编辑。",
                  )}
                </p>
              </>
            )}
          </aside>
          <section className="preview-workspace">
            <div className="preview-toolbar">
              <select
                aria-label={t("预览场景")}
                value={sceneLabel(scene)}
                onChange={(e) => setScene(e.target.value)}
              >
                {[
                  "Components",
                  "Dashboard",
                  "Marketing",
                  "Mail",
                  "Typography",
                  "States",
                  "Connected page",
                ].map((s) => (
                  <option key={s} value={s}>
                    {sceneLabel(s)}
                  </option>
                ))}
              </select>
              <div className="toolbar">
                <select
                  aria-label={t("预览宽度")}
                  value={viewport}
                  onChange={(e) => setViewport(e.target.value)}
                >
                  <option value="desktop">{t("桌面")}</option>
                  <option value="tablet">{t("平板 · 768")}</option>
                  <option value="mobile">{t("手机 · 390")}</option>
                </select>
                <Button
                  aria-pressed={compare}
                  onClick={() => setCompare(!compare)}
                >
                  {t("前后对比")}
                </Button>
                <Button
                  aria-pressed={inspector}
                  onClick={() => setInspector(!inspector)}
                >
                  {t("检查 token")}
                </Button>
                <Button
                  onClick={() =>
                    guard(() => {
                      document
                        .querySelector(".preview-workspace")
                        ?.requestFullscreen()
                        .catch(() => setError(t("浏览器不支持全屏")));
                    })
                  }
                >
                  {t("全屏")}
                </Button>
              </div>
            </div>
            {inspector && (
              <div className="inspector-bar">
                <b>{selected}</b>
                <code>{values[selected]}</code>
                <Button onClick={() => focusToken(selected)}>
                  {t("定位编辑")}
                </Button>
                <span>{t("点击组件查看绑定的语义 token")}</span>
              </div>
            )}
            <div className={`preview-stage viewport-${viewport}`}>
              {scene === "Connected page" ? (
                <ConnectedPreview styles={styles} mode={mode} />
              ) : (
                <>
                  {compare && (
                    <div className="comparison-label">
                      {t("修改前 · 本地基线")}
                    </div>
                  )}
                  {compare && (
                    <Preview
                      project={draft.project}
                      styles={draft.baseline}
                      mode={mode}
                      scene={scene}
                      inspect={false}
                      onInspect={() => {}}
                    />
                  )}
                  {compare && (
                    <div className="comparison-label">{t("当前草稿")}</div>
                  )}
                  <Preview
                    project={draft.project}
                    styles={styles}
                    mode={mode}
                    scene={scene}
                    inspect={inspector}
                    onInspect={focusToken}
                  />
                </>
              )}
            </div>
            <div className="preview-footer">
              <span>
                {mode === "light" ? t("浅色") : t("深色")} · {sceneLabel(scene)}{" "}
                {t("· 样式仅作用于预览")}
              </span>
              <a
                href={`https://github.com/jnsahaj/tweakcn/tree/${revision}`}
                target="_blank"
                rel="noreferrer"
              >
                {t("主题引擎改编自 tweakcn ↗")}
              </a>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
createRoot(document.getElementById("root")!).render(<App />);
