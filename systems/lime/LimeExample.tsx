import { useEffect, useRef, useState, type CSSProperties } from "react";
import palette from "./palette.json";
import "./style.css";

// Authored here to demonstrate palette roles; not an installed upstream component.
export function LimeExample({ lang, dark }: { lang: string; dark: boolean }) {
  const t = (zh: string, en: string) => (lang === "zh" ? zh : en);
  const [appearance, setAppearance] = useState<boolean | null>(null);
  const isDark = appearance ?? dark;
  const [selected, setSelected] = useState(["tickets"]);
  const [time, setTime] = useState("morning");
  const [confirmed, setConfirmed] = useState(false);
  const result = useRef<HTMLDivElement>(null),
    action = useRef<HTMLButtonElement>(null),
    previous = useRef(false);
  useEffect(() => {
    if (confirmed) result.current?.focus();
    else if (previous.current) action.current?.focus();
    previous.current = confirmed;
  }, [confirmed]);
  const values = isDark ? palette.dark : palette.light;
  return (
    <div
      className="lime-preview"
      data-appearance={isDark ? "dark" : "light"}
      style={
        Object.fromEntries(
          Object.entries(values).map(([key, value]) => [`--lm-${key}`, value]),
        ) as CSSProperties
      }
    >
      <header className="lime-preview-header">
        <strong>Lime</strong>
        <button
          type="button"
          onClick={() => setAppearance(!isDark)}
          aria-label={t("切换 Lime 示例外观", "Switch Lime example appearance")}
        >
          {isDark ? t("查看浅色", "View light") : t("查看深色", "View dark")}
        </button>
      </header>
      <h2>{t("准备下一次出行", "Prepare for your next trip")}</h2>
      <p>
        {t(
          "选择事项与提醒时间。以下内容仅供演示。",
          "Choose a task and reminder time. This is a local demo.",
        )}
      </p>
      <fieldset disabled={confirmed}>
        <legend>{t("提醒事项", "Reminders")}</legend>
        {[
          ["tickets", "确认车票", "Check tickets"],
          ["packing", "整理行李", "Pack essentials"],
        ].map(([id, zh, en]) => (
          <label className="lime-preview-row" key={id}>
            <input
              type="checkbox"
              checked={selected.includes(id)}
              onChange={() =>
                setSelected((old) =>
                  old.includes(id)
                    ? old.filter((item) => item !== id)
                    : [...old, id],
                )
              }
            />
            <span>{t(zh, en)}</span>
          </label>
        ))}
        <label className="lime-preview-field">
          {t("提醒时间", "Reminder time")}
          <select
            value={time}
            onChange={(event) => setTime(event.target.value)}
          >
            <option value="morning">{t("上午", "Morning")}</option>
            <option value="evening">{t("晚上", "Evening")}</option>
          </select>
        </label>
      </fieldset>
      {confirmed ? (
        <>
          <div
            ref={result}
            tabIndex={-1}
            role="status"
            className="lime-preview-result"
          >
            <strong>
              {t(
                `已启用 ${selected.length} 项演示提醒`,
                `${selected.length} demo reminders enabled`,
              )}
            </strong>
            <p>
              {t(
                "未创建系统通知，也不会联系任何人。",
                "No system notification was created and no one was contacted.",
              )}
            </p>
          </div>
          <button type="button" onClick={() => setConfirmed(false)}>
            {t("撤销演示操作", "Undo demo action")}
          </button>
        </>
      ) : (
        <>
          <button
            ref={action}
            type="button"
            data-demo-primary
            disabled={!selected.length}
            onClick={() => setConfirmed(true)}
          >
            {t("启用演示提醒", "Enable demo reminders")}
          </button>
          {!selected.length && (
            <p role="status">
              {t("请先选择一项提醒。", "Choose at least one reminder first.")}
            </p>
          )}
        </>
      )}
    </div>
  );
}
