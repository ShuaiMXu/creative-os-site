import { useState } from "react";
import { Button } from "../../packages/ui";
import { Select } from "../../packages/ui/Select";
import tokens from "../../packages/design-tokens/happyhands.json";

const names: Record<string, string> = {
  bg: "页面背景",
  "bg-raised": "内容表面",
  "bg-sunken": "内嵌表面",
  "bg-hover": "悬停背景",
  ink: "主要文字",
  "ink-2": "次要文字",
  "ink-muted": "辅助文字",
  "ink-subtle": "弱化文字",
  line: "常规边界",
  "line-strong": "控件边界",
  primary: "主要操作",
  "on-primary": "主要操作文字",
  brand: "品牌强调",
  "on-brand": "品牌色上文字",
  "brand-text": "品牌文字",
  "brand-soft": "品牌浅底",
  success: "成功文字",
  "success-soft": "成功背景",
  warning: "警告文字",
  "warning-soft": "警告背景",
  danger: "错误文字",
  "danger-soft": "错误背景",
  info: "信息文字",
  "info-soft": "信息背景",
  ring: "键盘焦点",
  scrim: "遮罩",
  "on-media": "图片上文字",
  "media-scrim": "图片遮罩",
  "font-sans": "界面字体",
  "font-mono": "代码字体",
};
const groupOf = (key: string) =>
  key.startsWith("space-")
    ? "space"
    : key.startsWith("radius-") ||
        key.startsWith("shadow-") ||
        key.startsWith("z-")
      ? "shape"
      : key.startsWith("font-")
        ? "type"
        : "color";
const groups = [
  ["all", "全部", "All"],
  ["color", "颜色", "Colors"],
  ["type", "字体", "Type"],
  ["space", "间距", "Spacing"],
  ["shape", "圆角与层次", "Shape & layers"],
];

export function TokenReference({
  lang,
  dark,
}: {
  lang: string;
  dark: boolean;
}) {
  const t = (zh: string, en: string) => (lang === "zh" ? zh : en);
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState("all");
  const [limit, setLimit] = useState(12);
  const [notice, setNotice] = useState("");
  const entries = Object.entries(tokens.light).filter(
    ([key, value]) =>
      (group === "all" || groupOf(key) === group) &&
      `${key} ${names[key] || ""} ${value} ${tokens.dark[key as keyof typeof tokens.dark]}`
        .toLowerCase()
        .includes(query.trim().toLowerCase()),
  );
  const download = (format: "json" | "css") => {
    const css = Object.entries(tokens)
      .map(
        ([mode, values]) =>
          `${mode === "light" ? ":root" : '[data-theme="dark"]'} {\n${Object.entries(
            values,
          )
            .map(([key, value]) => `  --hh-${key}: ${value};`)
            .join("\n")}\n}`,
      )
      .join("\n\n");
    const url = URL.createObjectURL(
      new Blob([format === "json" ? JSON.stringify(tokens, null, 2) : css], {
        type: format === "json" ? "application/json" : "text/css",
      }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = `happyhands-tokens.${format}`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setNotice(t("已导出深浅色设计变量。", "Light and dark tokens exported."));
  };
  return (
    <div className="token-reference">
      <div className="reference-heading">
        <div>
          <h3>{t("完整设计变量", "Complete token reference")}</h3>
          <p>
            {t(
              `${Object.keys(tokens.light).length} 项变量，包含深浅两种外观。数值直接读取本站使用的规范。`,
              `${Object.keys(tokens.light).length} tokens in light and dark modes, read from the same source used by this site.`,
            )}
          </p>
        </div>
        <div className="reference-actions">
          <Button onClick={() => download("css")}>
            {t("导出 CSS", "Export CSS")}
          </Button>
          <Button onClick={() => download("json")}>
            {t("导出 JSON", "Export JSON")}
          </Button>
        </div>
      </div>
      <div className="reference-toolbar">
        <label>
          {t("查找变量", "Find a token")}
          <input
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setLimit(12);
            }}
            placeholder={t("名称、用途或色值", "Name, role or value")}
          />
        </label>
        <label>
          {t("变量分类", "Token group")}
          <Select
            value={group}
            onChange={(event) => {
              setGroup(event.target.value);
              setLimit(12);
            }}
          >
            {groups.map(([id, zh, en]) => (
              <option key={id} value={id}>
                {t(zh, en)}
              </option>
            ))}
          </Select>
        </label>
      </div>
      <p className="reference-count" role="status">
        {t(
          `显示 ${Math.min(limit, entries.length)} / ${entries.length} 项匹配 / 共 ${Object.keys(tokens.light).length} 项变量`,
          `${Math.min(limit, entries.length)} of ${entries.length} matches / ${Object.keys(tokens.light).length} tokens total`,
        )}
      </p>
      <div className="token-grid">
        {entries.slice(0, limit).map(([key, light]) => {
          const night = tokens.dark[key as keyof typeof tokens.dark],
            current = dark ? night : light,
            group = groupOf(key);
          return (
            <article className="token-entry" key={key} data-token={key}>
              <div className="token-specimen" aria-hidden="true">
                {group === "color" ? (
                  <>
                    <i style={{ background: light }} />
                    <i style={{ background: night }} />
                  </>
                ) : group === "space" ? (
                  <span className="space-specimen" style={{ width: current }} />
                ) : key.startsWith("radius-") ? (
                  <span
                    className="shape-specimen"
                    style={{ borderRadius: current }}
                  />
                ) : key.startsWith("shadow-") ? (
                  <span
                    className="shape-specimen"
                    style={{ boxShadow: current }}
                  />
                ) : group === "type" ? (
                  <span style={{ fontFamily: current }}>字 Aa 012</span>
                ) : (
                  <span>{current}</span>
                )}
              </div>
              <h4>
                {t(
                  names[key] ||
                    (key.startsWith("chart-")
                      ? `图表色 ${key.slice(6)}`
                      : key.startsWith("space-")
                        ? `间距 ${key.slice(6)}`
                        : key),
                  key,
                )}
              </h4>
              <code>--hh-{key}</code>
              <dl>
                <div>
                  <dt>{t("浅色", "Light")}</dt>
                  <dd>{light}</dd>
                </div>
                <div>
                  <dt>{t("深色", "Dark")}</dt>
                  <dd>{night}</dd>
                </div>
              </dl>
              <Button
                variant="ghost"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(`var(--hh-${key})`);
                    setNotice(t(`已复制 ${key}`, `${key} copied`));
                  } catch {
                    setNotice(
                      t(
                        `请手动复制：var(--hh-${key})`,
                        `Copy manually: var(--hh-${key})`,
                      ),
                    );
                  }
                }}
              >
                {t("复制变量", "Copy token")}
              </Button>
            </article>
          );
        })}
      </div>
      {limit < entries.length && (
        <div className="reference-pagination">
          <Button onClick={() => setLimit((value) => value + 12)}>
            {t("继续浏览", "Show more")}
          </Button>
          <Button variant="ghost" onClick={() => setLimit(entries.length)}>
            {t("显示全部匹配项", "Show all matches")}
          </Button>
        </div>
      )}
      {!entries.length && (
        <p className="reference-empty">
          {t(
            "没有匹配的变量，换个关键词或选择全部分类。",
            "No matching tokens. Try another term or select all groups.",
          )}
        </p>
      )}
      <output className="reference-notice" aria-live="polite">
        {notice}
      </output>
    </div>
  );
}
