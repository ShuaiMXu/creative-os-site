import { useState, type CSSProperties } from "react";
import brandTokens from "../design-tokens/happyhands.json";
import { Button } from "./index";
import "./system-example.css";

/** Local interactive examples; Quartz uses observed palette values, not upstream components. */
export function SystemExample({
  system,
  lang,
  dark,
}: {
  system: "happyhands" | "quartz";
  lang: string;
  dark: boolean;
}) {
  const [selected, setSelected] = useState(["home"]);
  const [confirmed, setConfirmed] = useState(false);
  const [appearance, setAppearance] = useState<boolean | null>(null);
  const isDark = appearance ?? dark;
  const quartz = system === "quartz";
  const palette = isDark ? brandTokens.dark : brandTokens.light;
  const t = (zh: string, en: string) => (lang === "zh" ? zh : en);
  const action = t(
    quartz ? "允许本次操作" : "确认选择",
    quartz ? "Allow this action" : "Confirm selection",
  );
  const toggle = (id: string) => {
    setConfirmed(false);
    setSelected((old) =>
      old.includes(id) ? old.filter((item) => item !== id) : [...old, id],
    );
  };
  return (
    <div
      className={`system-example example-${system}`}
      style={
        quartz
          ? undefined
          : ({
              "--ex-bg": palette["bg-raised"],
              "--ex-ink": palette.ink,
              "--ex-muted": palette["ink-muted"],
              "--ex-line": palette["line-strong"],
              "--ex-soft": palette["bg-sunken"],
            } as CSSProperties)
      }
      data-appearance={isDark ? "dark" : "light"}
    >
      <div className="example-top">
        <span>{t("可操作示例", "Interactive example")}</span>
        <button
          type="button"
          aria-label={t("切换示例外观", "Switch example appearance")}
          onClick={() => setAppearance(!isDark)}
        >
          {t(
            isDark ? "查看浅色" : "查看深色",
            isDark ? "View light" : "View dark",
          )}
        </button>
      </div>
      <h2>
        {t(
          quartz ? "核对这次文件修改" : "选择要审阅的页面",
          quartz ? "Review this file change" : "Choose pages to review",
        )}
      </h2>
      <p>
        {t(
          quartz
            ? "先查看涉及的文件，再决定是否允许。"
            : "勾选页面，确认这次审阅的范围。",
          quartz
            ? "Check the files before allowing the action."
            : "Select the pages to include in this review.",
        )}
      </p>
      <fieldset disabled={confirmed}>
        <legend>
          {t(quartz ? "涉及文件" : "页面", quartz ? "Affected files" : "Pages")}
        </legend>
        {(
          [
            ["home", "产品首页", "Homepage"],
            ["settings", "设置页面", "Settings"],
          ] as const
        ).map(([id, zh, en]) => (
          <label key={id} className="example-row">
            <input
              type="checkbox"
              checked={selected.includes(id)}
              onChange={() => toggle(id)}
            />
            <span>
              {quartz ? (
                <code>
                  {id === "home"
                    ? "src/pages/home.tsx"
                    : "src/pages/settings.tsx"}
                </code>
              ) : (
                t(zh, en)
              )}
            </span>
            <small>
              {t(
                quartz ? "待确认" : "桌面 / 手机",
                quartz ? "Pending" : "Desktop / Phone",
              )}
            </small>
          </label>
        ))}
      </fieldset>
      <div className="example-bottom">
        {confirmed ? (
          <button type="button" onClick={() => setConfirmed(false)}>
            {t("重新选择", "Choose again")}
          </button>
        ) : quartz ? (
          <button
            type="button"
            className="example-primary"
            disabled={!selected.length}
            onClick={() => setConfirmed(true)}
          >
            {action}
          </button>
        ) : (
          <Button
            variant="primary"
            disabled={!selected.length}
            onClick={() => setConfirmed(true)}
          >
            {action}
          </Button>
        )}
        <p role="status">
          {confirmed
            ? t(
                `已确认 ${selected.length} 项，仅在示例中生效。`,
                `${selected.length} selected. This affects the example only.`,
              )
            : t(`已选 ${selected.length} 项`, `${selected.length} selected`)}
        </p>
      </div>
      <p className="example-caption">
        {t(
          "示例内容，不会读取项目或修改文件。",
          "Sample content. No project is read or changed.",
        )}
      </p>
    </div>
  );
}
