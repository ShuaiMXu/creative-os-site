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
import "./studio.css";

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
    <label className="token-row" id={`token-${name}`}>
      <span>
        {labels[name] || name}
        <small>{name}</small>
      </span>
      <div className="token-input-fields">
        {colorKeys.includes(name) && (
          <input
            type="color"
            aria-label={`${name} picker`}
            value={hex(value)}
            onChange={(e) => onChange(e.target.value)}
          />
        )}
        <input
          aria-label={name}
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
            aria-label={`${name} slider`}
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
      <header className="studio-header">
        <a className="wordmark" href="/apps/portal/">
          HappyHands<span> / Studio</span>
        </a>
        <div className="project-select">
          <select
            aria-label="选择项目"
            value={draft.id}
            onChange={(e) => switchProject(e.target.value)}
          >
            {projectIds.map((id) => (
              <option key={id}>{id}</option>
            ))}
          </select>
          <button
            onClick={() => {
              const id = prompt("新项目 ID（英文、数字和短横线）");
              if (id && /^[\w-]{1,80}$/.test(id)) switchProject(id);
            }}
          >
            ＋
          </button>
        </div>
        <a href="/apps/designer/">Review 工作台 ↗</a>
      </header>
      <main className="studio-shell">
        <div className="studio-title">
          <div>
            <p className="eyebrow">DESIGN SYSTEM / THEME STUDIO</p>
            <h1>把设计语言，变成你的。</h1>
            <p>从主题到组件，再到真实页面。每一次调整，都可以被验证。</p>
          </div>
          <div className="toolbar">
            <button disabled={!h.past.length} onClick={() => setH(undo)}>
              ↶ 撤销
            </button>
            <button disabled={!h.future.length} onClick={() => setH(redo)}>
              ↷ 重做
            </button>
            <button
              onClick={() =>
                guard(() => {
                  persist();
                })
              }
            >
              保存
            </button>
            <button
              onClick={() => setPanel(panel === "import" ? "" : "import")}
            >
              导入
            </button>
            <button
              onClick={() => setPanel(panel === "export" ? "" : "export")}
            >
              导出
            </button>
            <button
              className="primary-action"
              onClick={() => {
                setConfirmed(false);
                setPanel(panel === "review" ? "" : "review");
              }}
            >
              审核变更 {changes.length || ""}
            </button>
          </div>
        </div>
        <div className="status-line">
          <span role="status">{notice}</span>
          <span>
            {Object.keys(presets).length} 预设 · {keys.length} 变量 × 2 模式 ·{" "}
            {draft.foundation
              ? `Foundation ${draft.foundation.foundationVersion}`
              : "尚无批准版本"}
          </span>
        </div>
        {error && (
          <div className="error" role="alert">
            {error}
            <button
              onClick={() =>
                download(
                  "recovery-draft.json",
                  JSON.stringify(current(), null, 2),
                )
              }
            >
              导出备份
            </button>
            <button onClick={() => location.reload()}>重新载入</button>
          </div>
        )}
        <div className="mobile-tabs">
          <button
            aria-pressed={mobile === "edit"}
            onClick={() => setMobile("edit")}
          >
            编辑
          </button>
          <button
            aria-pressed={mobile === "preview"}
            onClick={() => setMobile("preview")}
          >
            预览
          </button>
        </div>
        {panel && (
          <section className="utility-panel" aria-label={panel}>
            <div className="panel-title">
              <h2>
                {panel === "import"
                  ? "导入主题"
                  : panel === "export"
                    ? "导出到你的工程"
                    : "审核与 Foundation"}
              </h2>
              <button onClick={() => setPanel("")} aria-label="关闭面板">
                ×
              </button>
            </div>
            {panel === "import" ? (
              <>
                <p>
                  支持 :root / .dark CSS，或 Studio 草稿
                  JSON。导入前会展示无法应用的内容。
                </p>
                <input
                  aria-label="导入主题文件"
                  type="file"
                  accept=".css,.json"
                  onChange={(e) =>
                    guard(() => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      if (file.size > 250000)
                        throw Error("文件不能超过 250 KB");
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
                  aria-label="导入源代码"
                  value={source}
                  onChange={(e) => {
                    setSource(e.target.value);
                    setPending(null);
                  }}
                  placeholder=":root { --primary: #f57f28; }"
                />
                <div className="toolbar">
                  <button
                    onClick={() =>
                      guard(() => setPending(importCSS(source, styles)))
                    }
                  >
                    解析 CSS
                  </button>
                  <button
                    onClick={() =>
                      guard(() => {
                        importDraft(source);
                        setPanel("");
                      })
                    }
                  >
                    导入草稿 JSON
                  </button>
                </div>
                {pending && (
                  <>
                    <p>识别 {pending.count} 个变量，待确认应用。</p>
                    <ul>
                      {pending.warnings.map((w) => (
                        <li key={w}>{w}</li>
                      ))}
                    </ul>
                    <button className="primary-action" onClick={applyImport}>
                      应用已识别值（可撤销）
                    </button>
                  </>
                )}
              </>
            ) : panel === "export" ? (
              <>
                <div className="toolbar">
                  <select
                    aria-label="导出格式"
                    value={format}
                    onChange={(e) => setFormat(e.target.value as ExportKind)}
                  >
                    <option value="css">CSS variables</option>
                    <option value="tailwind4">Tailwind 4 CSS</option>
                    <option value="tailwind3">Tailwind 3 CSS</option>
                    <option value="tailwind3-config">Tailwind 3 config</option>
                    <option value="registry">shadcn registry</option>
                  </select>
                  <button
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
                    下载代码
                  </button>
                  <button
                    onClick={() =>
                      download(
                        "theme.draft.json",
                        JSON.stringify(current(), null, 2),
                      )
                    }
                  >
                    下载草稿 JSON
                  </button>
                  <button
                    onClick={() =>
                      guard(() => {
                        navigator.clipboard
                          .writeText(exportTheme(styles, format))
                          .then(() => setNotice("代码已复制"))
                          .catch(() => setError("无法访问剪贴板，请下载代码"));
                      })
                    }
                  >
                    复制
                  </button>
                </div>
                <pre>{exportTheme(styles, format)}</pre>
                <p>
                  Tailwind 3 需要同时导出 CSS 与 config。导出不会更改批准版本。
                </p>
              </>
            ) : (
              <>
                <div className="review-grid">
                  <div>
                    <h3>1. 项目基础</h3>
                    <p>
                      {draft.foundation
                        ? `基于 ${draft.foundation.foundationVersion}；品牌、组件与模式将完整保留。`
                        : "没有导入基础版本时，将创建仅含主题 token 的初始 Foundation，品牌与组件为空。"}
                    </p>
                    <label>
                      导入现有 foundation-approval.json
                      <input
                        type="file"
                        accept=".json"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          if (file.size > 1000000) {
                            setError("Foundation 文件不能超过 1 MB");
                            return;
                          }
                          file
                            .text()
                            .then((text) =>
                              guard(() => {
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
                    <h3>2. 变更明细 · {changes.length}</h3>
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
                        <p>相对本地基线暂无修改。</p>
                      )}
                    </div>
                    <button
                      onClick={() =>
                        download(
                          "theme-proposal.json",
                          JSON.stringify(createProposal(current()), null, 2),
                        )
                      }
                    >
                      导出提案（未批准）
                    </button>
                  </div>
                  <div>
                    <h3>3. 人工批准</h3>
                    <p>对比度只是局部检查。请同时审阅浅色、深色及页面状态。</p>
                    {contrastChecks(styles, mode).map((c) => (
                      <p key={c.bg}>
                        {c.bg} / {c.fg}：
                        {c.ratio === null
                          ? "含透明度，需检查实际背景"
                          : `${c.ratio.toFixed(2)}:1 ${c.ratio >= 4.5 ? "✓" : "需关注"}`}
                      </p>
                    ))}
                    <label>
                      新版本
                      <input
                        aria-label="Foundation 版本"
                        value={version}
                        onChange={(e) => setVersion(e.target.value)}
                      />
                    </label>
                    <label>
                      审核人
                      <input
                        aria-label="审核人"
                        value={reviewer}
                        onChange={(e) => setReviewer(e.target.value)}
                      />
                    </label>
                    <label>
                      批准理由
                      <textarea
                        aria-label="批准理由"
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
                      我已审阅当前变更与双模式预览
                    </label>
                    <button
                      className="primary-action"
                      onClick={approveAndExport}
                    >
                      批准并导出 Harness 文件
                    </button>
                    <p>
                      映射使用 theme.light.* / theme.dark.*
                      名称，值保持字符串。下载后交给 Harness 的新 bootstrap run
                      导入；已开始规划的运行不能覆盖版本。
                    </p>
                    <button
                      onClick={() => {
                        setReason("");
                        setConfirmed(false);
                        setPanel("");
                        setNotice("未批准；当前草稿保留，基础版本不变。");
                      }}
                    >
                      暂不批准，保留草稿
                    </button>
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
              <summary>面板宽度</summary>
              <input
                type="range"
                aria-label="面板宽度"
                min="260"
                max="460"
                value={panelWidth}
                onChange={(e) => setPanelWidth(+e.target.value)}
              />
            </details>
            <label className="project-name">
              项目名称
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
                起始预设
                <select
                  aria-label="主题预设"
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
              <button
                onClick={() => {
                  replace(presetStyles(preset));
                  setDraft((d) => ({
                    ...d,
                    provenance: { revision, source: preset },
                  }));
                  setConfirmed(false);
                }}
              >
                应用
              </button>
            </div>
            <p className="micro">
              替换双模式值，可撤销。默认使用苹方优先的无衬线字体。
            </p>
            <div className="segmented">
              {(["light", "dark"] as const).map((m) => (
                <button
                  key={m}
                  aria-pressed={mode === m}
                  onClick={() => setMode(m)}
                >
                  {m === "light" ? "☀ 浅色" : "☾ 深色"}
                </button>
              ))}
            </div>
            <div className="control-tabs">
              {[
                ["colors", "颜色"],
                ["type", "字体"],
                ["layout", "细节"],
              ].map(([id, name]) => (
                <button
                  aria-pressed={tab === id}
                  key={id}
                  onClick={() => setTab(id)}
                >
                  {name}
                </button>
              ))}
            </div>
            {tab === "colors" ? (
              <>
                <input
                  className="token-search"
                  aria-label="搜索 token"
                  placeholder="搜索 token…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <Section title="语义颜色">
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
                <Section title="整体色彩调整">
                  <label>
                    色相偏移 {hue}°
                    <input
                      aria-label="色相偏移"
                      type="range"
                      min="-180"
                      max="180"
                      value={hue}
                      onChange={(e) => setHue(+e.target.value)}
                    />
                  </label>
                  <label>
                    饱和度 × {saturation}
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
                    明度 × {lightness}
                    <input
                      type="range"
                      min="0"
                      max="2"
                      step="0.05"
                      value={lightness}
                      onChange={(e) => setLightness(+e.target.value)}
                    />
                  </label>
                  <button
                    onClick={() => {
                      replace(
                        adjustHsl(styles, mode, hue, saturation, lightness),
                      );
                      setHue(0);
                      setSaturation(1);
                      setLightness(1);
                    }}
                  >
                    应用到当前模式
                  </button>
                </Section>
              </>
            ) : tab === "type" ? (
              <Section title="字体与阅读节奏">
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
                  字体需已安装或由项目加载。苹方不可用时使用备用字体；官网不会因预设切换为衬线字体。
                </p>
              </Section>
            ) : (
              <>
                <Section title="尺寸与间距">
                  {(["radius", "spacing"] as Key[]).map((k) => (
                    <TokenInput
                      key={k}
                      name={k}
                      value={values[k]!}
                      onChange={(v) => change(k, v)}
                    />
                  ))}
                </Section>
                <Section title="阴影">
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
                  字体、圆角、间距与阴影尺寸同步明暗模式；阴影颜色分别编辑。
                </p>
              </>
            )}
          </aside>
          <section className="preview-workspace">
            <div className="preview-toolbar">
              <select
                aria-label="预览场景"
                value={scene}
                onChange={(e) => setScene(e.target.value)}
              >
                {[
                  "Components",
                  "Dashboard",
                  "Marketing",
                  "Mail",
                  "Typography",
                  "Connected page",
                ].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
              <div className="toolbar">
                <select
                  aria-label="预览宽度"
                  value={viewport}
                  onChange={(e) => setViewport(e.target.value)}
                >
                  <option value="desktop">桌面</option>
                  <option value="tablet">平板 · 768</option>
                  <option value="mobile">手机 · 390</option>
                </select>
                <button
                  aria-pressed={compare}
                  onClick={() => setCompare(!compare)}
                >
                  前后对比
                </button>
                <button
                  aria-pressed={inspector}
                  onClick={() => setInspector(!inspector)}
                >
                  检查 token
                </button>
                <button
                  onClick={() =>
                    guard(() => {
                      document
                        .querySelector(".preview-workspace")
                        ?.requestFullscreen()
                        .catch(() => setError("浏览器不支持全屏"));
                    })
                  }
                >
                  全屏
                </button>
              </div>
            </div>
            {inspector && (
              <div className="inspector-bar">
                <b>{selected}</b>
                <code>{values[selected]}</code>
                <button onClick={() => focusToken(selected)}>定位编辑</button>
                <span>点击组件查看绑定的语义 token</span>
              </div>
            )}
            <div className={`preview-stage viewport-${viewport}`}>
              {scene === "Connected page" ? (
                <ConnectedPreview styles={styles} mode={mode} />
              ) : (
                <>
                  {compare && (
                    <div className="comparison-label">修改前 · 本地基线</div>
                  )}
                  {compare && (
                    <Preview
                      styles={draft.baseline}
                      mode={mode}
                      scene={scene}
                      inspect={false}
                      onInspect={() => {}}
                    />
                  )}
                  {compare && <div className="comparison-label">当前草稿</div>}
                  <Preview
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
                {mode === "light" ? "浅色" : "深色"} · {scene} ·
                样式仅作用于预览
              </span>
              <a
                href={`https://github.com/jnsahaj/tweakcn/tree/${revision}`}
                target="_blank"
                rel="noreferrer"
              >
                Theme engine adapted from tweakcn ↗
              </a>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
createRoot(document.getElementById("root")!).render(<App />);
