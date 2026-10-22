import { useState } from "react";
import { Button } from "../../packages/ui";
import { Select } from "../../packages/ui/Select";
import "../../packages/ui/system-reference.css";

export function ComponentShowcase({ lang }: { lang: string }) {
  const t = (zh: string, en: string) => (lang === "zh" ? zh : en);
  const [density, setDensity] = useState("comfortable"),
    [notify, setNotify] = useState(true),
    [query, setQuery] = useState("");
  const [view, setView] = useState("all");
  const rows = [
    ["website", "官网首页", "Website", "ready"],
    ["settings", "偏好设置", "Preferences", "review"],
    ["mobile", "移动端导航", "Mobile navigation", "ready"],
  ];
  const visible = rows.filter(
    ([id, zh, en, state]) =>
      (view === "all" || state === view) &&
      `${id} ${t(zh, en)}`.toLowerCase().includes(query.trim().toLowerCase()),
  );
  return (
    <div className="showcase-grid">
      <article className="demo">
        <p className="reference-kicker">
          {t("输入与选择", "Inputs & selection")}
        </p>
        <h3>{t("偏好设置", "Preferences")}</h3>
        <p>
          {t(
            "下拉、复选与密度设置可直接操作。",
            "Try the select, checkbox and density setting.",
          )}
        </p>
        <label>
          {t("列表密度", "List density")}
          <Select
            value={density}
            onChange={(event) => setDensity(event.target.value)}
          >
            <option value="comfortable">{t("宽松", "Comfortable")}</option>
            <option value="compact">{t("紧凑", "Compact")}</option>
          </Select>
        </label>
        <label className="reference-checkbox">
          <input
            type="checkbox"
            checked={notify}
            onChange={(event) => setNotify(event.target.checked)}
          />
          {t("完成后通知我", "Notify me when finished")}
        </label>
        <p className="reference-note" role="status">
          {notify
            ? t(
                "通知已开启，仅影响本次演示。",
                "Notifications on for this demo.",
              )
            : t(
                "通知已关闭，仅影响本次演示。",
                "Notifications off for this demo.",
              )}
        </p>
      </article>
      <article className="demo">
        <p className="reference-kicker">
          {t("导航与数据", "Navigation & data")}
        </p>
        <h3>{t("搜索与列表", "Search & list")}</h3>
        <div
          className="reference-switcher"
          role="group"
          aria-label={t("列表范围", "List scope")}
        >
          {[
            ["all", "全部", "All"],
            ["ready", "已完成", "Complete"],
            ["review", "待核对", "Needs review"],
          ].map(([id, zh, en]) => (
            <Button
              key={id}
              aria-pressed={view === id}
              onClick={() => setView(id)}
            >
              {t(zh, en)}
            </Button>
          ))}
        </div>
        <label>
          {t("搜索示例页面", "Search example pages")}
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t("按页面名称搜索", "Search by page name")}
          />
        </label>
        <ul className="reference-list" data-density={density}>
          {visible.map(([id, zh, en, state]) => (
            <li key={id}>
              <span>{t(zh, en)}</span>
              <span className="reference-tag" data-state={state}>
                {state === "ready"
                  ? t("已完成", "Complete")
                  : t("待核对", "Needs review")}
              </span>
            </li>
          ))}
        </ul>
        {!visible.length && (
          <p role="status">{t("没有匹配的页面。", "No matching pages.")}</p>
        )}
        <p className="reference-note">
          {t(
            "示例内容。密度跟随左侧设置。",
            "Sample content. Density follows the preference control.",
          )}
        </p>
      </article>
    </div>
  );
}

export function ScreenPatterns({ lang }: { lang: string }) {
  const t = (zh: string, en: string) => (lang === "zh" ? zh : en);
  const [screen, setScreen] = useState("projects");
  const [name, setName] = useState("HappyHands"),
    [notice, setNotice] = useState("");
  return (
    <div className="pattern-reference">
      <div className="reference-heading">
        <div>
          <h3>{t("页面组合预览", "Screen compositions")}</h3>
          <p>
            {t(
              "使用同一套颜色、控件与反馈组合页面。以下均为演示内容。",
              "Shared colors, controls and feedback across three sample screens.",
            )}
          </p>
        </div>
        <div
          className="reference-switcher"
          role="group"
          aria-label={t("页面组合", "Screen composition")}
        >
          {[
            ["projects", "项目列表", "Projects"],
            ["settings", "设置页面", "Settings"],
            ["result", "任务结果", "Result"],
          ].map(([id, zh, en]) => (
            <Button
              key={id}
              aria-pressed={screen === id}
              onClick={() => {
                setScreen(id);
                setNotice("");
              }}
            >
              {t(zh, en)}
            </Button>
          ))}
        </div>
      </div>
      <div className="pattern-window">
        <header>
          <b>{name || "HappyHands"}</b>
          <span>{t("工作空间 / 示例", "Workspace / Example")}</span>
        </header>
        <div className="pattern-body">
          {screen === "projects" ? (
            <>
              <p className="reference-kicker">{t("项目", "Projects")}</p>
              <h3>{t("最近的工作", "Recent work")}</h3>
              <p>
                {t(
                  "查看项目状态，继续未完成的工作。",
                  "See project status and continue your work.",
                )}
              </p>
              <ul className="reference-list">
                <li>
                  <div>
                    <strong>{t("品牌网站", "Brand website")}</strong>
                    <p>{t("首页与内容页面", "Home and content pages")}</p>
                  </div>
                  <span className="reference-tag" data-state="ready">
                    {t("已完成", "Complete")}
                  </span>
                </li>
                <li>
                  <div>
                    <strong>{t("产品工作台", "Product workspace")}</strong>
                    <p>{t("导航与任务详情", "Navigation and task details")}</p>
                  </div>
                  <span className="reference-tag">
                    {t("待核对", "Needs review")}
                  </span>
                </li>
              </ul>
            </>
          ) : screen === "settings" ? (
            <form
              onSubmit={(event) => {
                event.preventDefault();
                setNotice(
                  t(
                    "示例设置已更新，未保存到项目。",
                    "Demo settings updated. No project data saved.",
                  ),
                );
              }}
            >
              <p className="reference-kicker">{t("设置", "Settings")}</p>
              <h3>{t("工作空间信息", "Workspace details")}</h3>
              <label>
                {t("工作空间名称", "Workspace name")}
                <input
                  required
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
              </label>
              <p>
                {t(
                  "名称会同步显示在此预览的页头。",
                  "The name is reflected in this preview header.",
                )}
              </p>
              <Button variant="primary" type="submit">
                {t("保存示例", "Save example")}
              </Button>
            </form>
          ) : (
            <>
              <p className="reference-kicker">{t("任务结果", "Task result")}</p>
              <h3>{t("页面已完成检查", "Page checks complete")}</h3>
              <p>
                {t(
                  "检查结果与后续操作放在同一处。",
                  "Keep the result and next action together.",
                )}
              </p>
              <div className="reference-feedback">
                <strong>{t("演示检查完成", "Demo checks complete")}</strong>
                <p>
                  {t(
                    "这是页面模式演示，不是实际项目的审阅结论。",
                    "This is a screen pattern, not a review of a real project.",
                  )}
                </p>
              </div>
              <Button onClick={() => setScreen("projects")}>
                {t("返回项目列表", "Back to projects")}
              </Button>
            </>
          )}
          <output className="reference-notice" aria-live="polite">
            {notice}
          </output>
        </div>
      </div>
    </div>
  );
}
