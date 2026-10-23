import React, { useState } from "react";
import quartz from "../../systems/quartz/foundations.json";
import lime from "../../systems/lime/palette.json";
import "./system-foundations.css";
export function FoundationSpecimen({
  system,
  lang,
}: {
  system: "quartz" | "lime";
  lang: string;
}) {
  const zh = lang === "zh",
    t = (a: string, b: string) => (zh ? a : b);
  const [theme, setTheme] = useState<"light" | "dark">("light"),
    [query, setQuery] = useState(""),
    [all, setAll] = useState(false);
  const data = system === "quartz" ? quartz : lime,
    values: Record<string, string> = data[theme];
  const entries = Object.entries(values).filter(([k]) =>
    k.toLowerCase().includes(query.trim().toLowerCase()),
  );
  const names =
    system === "quartz"
      ? [
          "paper-c",
          "grey-c",
          "ink-c",
          "hue-1-field",
          "hue-3-field",
          "hue-5-field",
        ]
      : ["page", "surface", "fg", "accent", "accent-wash", "success-tint"];
  return (
    <div className="foundation-specimen">
      <div className="foundation-section-heading">
        <h3>{t("颜色与文字实样", "Color & typography specimens")}</h3>
        <div role="group" aria-label={t("变量外观", "Token appearance")}>
          <button
            aria-pressed={theme === "light"}
            onClick={() => setTheme("light")}
          >
            {t("浅色", "Light")}
          </button>
          <button
            aria-pressed={theme === "dark"}
            onClick={() => setTheme("dark")}
          >
            {t("深色", "Dark")}
          </button>
        </div>
      </div>
      <div className="foundation-swatches">
        {names.map((k) => (
          <div key={k}>
            <i
              style={{
                background: k.endsWith("-c")
                  ? `oklch(${values[k]})`
                  : values[k],
              }}
            />
            <strong>{k}</strong>
            <code>{values[k]}</code>
          </div>
        ))}
      </div>
      <div className="foundation-type">
        <div>
          <span>Aa / 字</span>
          <p>
            {t(
              "标题引导阅读，正文承载信息。",
              "Headings guide. Body text informs.",
            )}
          </p>
          <small>
            {t(
              "本站使用系统字体回退；不分发上游授权字体。",
              "System font fallback; licensed upstream fonts are not distributed.",
            )}
          </small>
        </div>
        <div>
          <h4>{t("尺度与形状", "Scale & shape")}</h4>
          {system === "quartz" ? (
            <>
              <p>
                {t(
                  "界面正文 14 / 20 / 面板标题 24 / 28",
                  "Body 14 / 20 / Panel title 24 / 28",
                )}
              </p>
              <p>
                {t(
                  "间距、圆角与动效参数可在下方查询。",
                  "Browse spacing, radius and motion parameters below.",
                )}
              </p>
            </>
          ) : (
            <>
              <p>
                {t(
                  "面板圆角 16 / 输入圆角 12 / 胶囊操作按钮",
                  "Panel radius 16 / Field radius 12 / Pill actions",
                )}
              </p>
              <p>
                {t(
                  "黄绿色保留给主要操作，正文保持深浅对比。",
                  "Reserve lime for primary actions. Keep text contrast clear.",
                )}
              </p>
            </>
          )}
          <div className="foundation-shapes" aria-hidden="true">
            <i />
            <i />
            <i />
          </div>
        </div>
      </div>
      <details className="foundation-values">
        <summary>
          {t("查阅设计变量", "Browse design tokens")} /{" "}
          {Object.keys(values).length}
        </summary>
        <label>
          {t("搜索变量名称", "Search token names")}
          <input
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setAll(false);
            }}
            placeholder="font, radius, surface…"
          />
        </label>
        <dl>
          {entries.slice(0, all ? undefined : 20).map(([k, v]) => (
            <div key={k}>
              <dt>
                <code>--{k}</code>
              </dt>
              <dd>
                <code>{v}</code>
              </dd>
            </div>
          ))}
        </dl>
        {entries.length === 0 && (
          <p role="status">{t("没有匹配变量。", "No matching tokens.")}</p>
        )}
        {entries.length > 20 && !all && (
          <button onClick={() => setAll(true)}>
            {t("显示全部匹配项", "Show all matches")}
          </button>
        )}
      </details>
      <p className="note">
        {t(
          "变量摘录自公开主题文件，值按原始表达式保留。核对日期：",
          "Extracted from the public theme file; expressions retained as written. Checked: ",
        )}
        {data.checkedAt} /{" "}
        <a href={data.source} target="_blank" rel="noreferrer">
          {t("查看来源", "View source")}
        </a>
      </p>
    </div>
  );
}
