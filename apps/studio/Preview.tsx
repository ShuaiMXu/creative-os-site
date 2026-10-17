import { Icon } from "../../packages/ui/Icon";
import { t, sceneLabel } from "./i18n";
import { previewFontVariables } from "../../packages/font-library";
import { useState, type CSSProperties } from "react";
import {
  variables,
  type ThemeStyles,
  type Mode,
  type Key,
} from "../../packages/theme-core";
export function Preview({
  project,
  styles,
  mode,
  scene,
  inspect,
  onInspect,
}: {
  project: string;
  styles: ThemeStyles;
  mode: Mode;
  scene: string;
  inspect: boolean;
  onInspect: (key: Key) => void;
}) {
  const [tab, setTab] = useState("全部");
  const [checked, setChecked] = useState(false);
  const [componentState, setComponentState] = useState("empty");
  const projectLabel = project.trim() || t("我的产品");
  return (
    <div
      className={`theme-preview ${inspect ? "inspecting" : ""}`}
      style={
        {
          ...previewFontVariables(variables(styles, mode)),
          colorScheme: mode,
        } as CSSProperties
      }
      onClickCapture={(e) => {
        if (!inspect) return;
        const node = (e.target as HTMLElement).closest(
          "[data-token]",
        ) as HTMLElement | null;
        if (node) {
          e.preventDefault();
          e.stopPropagation();
          onInspect(node.dataset.token as Key);
        }
      }}
    >
      <div className="sample-nav" data-token="border">
        <b title={projectLabel}>{projectLabel}</b>
        <span>
          {t("工作空间")} / {sceneLabel(scene)}
        </span>
        <span className="avatar" data-token="primary">
          {Array.from(projectLabel)[0].toLocaleUpperCase()}
        </span>
      </div>
      {scene === "States" ? (
        <div className="sample-content state-gallery">
          <h2>{t("组件状态")}</h2>
          <p>
            {t(
              "在同一套主题下，检查操作的反馈与恢复路径。此处仅演示交互，不会调用服务。",
            )}
          </p>
          <div className="sample-tabs" role="group" aria-label={t("组件状态")}>
            {[
              ["empty", "空态"],
              ["loading", "加载"],
              ["error", "错误"],
              ["disabled", "禁用"],
              ["ready", "完成"],
            ].map(([value, label]) => (
              <button
                key={value}
                className={componentState === value ? "" : "secondary"}
                onClick={() => setComponentState(value)}
              >
                {t(label)}
              </button>
            ))}
          </div>
          <article
            className="state-example"
            aria-busy={componentState === "loading"}
          >
            {componentState === "empty" ? (
              <>
                <h3>{t("还没有设计审阅")}</h3>
                <p>{t("选择一个页面，开始记录你的第一轮设计判断。")}</p>
                <button onClick={() => setComponentState("loading")}>
                  {t("新建审阅示例")}
                </button>
              </>
            ) : componentState === "loading" ? (
              <>
                <div role="status">
                  <span className="hh-spinner" aria-hidden="true" />{" "}
                  {t("正在整理页面信息…")}
                </div>
                <div className="sample-skeleton" aria-hidden="true" />
                <p>{t("示例状态。可以取消，或切换到「完成」检查结果。")}</p>
                <button
                  className="secondary"
                  onClick={() => setComponentState("empty")}
                >
                  {t("取消示例")}
                </button>
              </>
            ) : componentState === "error" ? (
              <>
                <div role="alert">
                  <h3>{t("未能连接预览页面")}</h3>
                  <p>{t("页面没有返回内容。请检查地址，或重新尝试。")}</p>
                </div>
                <button onClick={() => setComponentState("ready")}>
                  {t("重试示例")}
                </button>
                <button
                  className="secondary"
                  onClick={() => setComponentState("empty")}
                >
                  {t("返回选择")}
                </button>
              </>
            ) : componentState === "disabled" ? (
              <>
                <h3>{t("请先选择一个页面")}</h3>
                <p>{t("完成选择后才能开始审阅。禁用操作始终附有原因。")}</p>
                <button disabled>{t("开始审阅")}</button>
              </>
            ) : (
              <>
                <h3>{t("示例审阅已完成")}</h3>
                <p>
                  {t(
                    "结果已经可以查看。真实项目仍需检查证据后，才能判断是否通过。",
                  )}
                </p>
                <button onClick={() => setComponentState("empty")}>
                  {t("开始下一轮示例")}
                </button>
              </>
            )}
          </article>
          <p className="focus-help">
            {t(
              "键盘检查：按 Tab 移动到按钮，确认焦点环清晰；按 Enter 或空格执行操作。",
            )}
          </p>
        </div>
      ) : scene === "Marketing" ? (
        <div className="sample-hero">
          <small>{t("让下一个想法发生")}</small>
          <h1>
            {t("认真做好每一步。")}
            <br />
            {t("让协作自然发生。")}
          </h1>
          <p>{t("创建项目，分配任务，与团队分享最新进展。")}</p>
          <div className="sample-actions">
            <button data-token="primary">
              <Icon name="right" />
              {t("开始使用")}
            </button>
            <button className="secondary" data-token="secondary">
              {t("查看案例")}
            </button>
          </div>
          <div className="sample-grid">
            {["快速开始", "保持一致", "持续改进"].map((item, i) => (
              <article key={item} data-token="card">
                <small>0{i + 1}</small>
                <h3>{t(item)}</h3>
                <p>{t("设计、交付与反馈，让团队关注真正重要的事情。")}</p>
              </article>
            ))}
          </div>
        </div>
      ) : scene === "Typography" ? (
        <div className="sample-content">
          <small>{t("字体预览")}</small>
          <h1>{t("让好设计成为日常。")}</h1>
          <h2>{t("让设计有据可依。")}</h2>
          <p>
            {t(
              "我们把字体放到真实段落中。清晰的层级、舒适的阅读节奏和合适的留白，是产品体验的一部分。",
            )}
          </p>
          <h3>Aa Bb Cc · 0123456789</h3>
          <p>
            ABCDEFGHIJKLMNOPQRSTUVWXYZ
            <br />
            abcdefghijklmnopqrstuvwxyz
          </p>
          <pre data-token="font-mono">const theme = 'your next chapter';</pre>
          <blockquote data-token="muted">{t("细节决定质感。")}</blockquote>
          <p className="serif-sample" data-token="font-serif">
            {t("衬线字体示例 · 可选字体槽")}
          </p>
        </div>
      ) : (
        <div
          className={`sample-content ${scene === "Dashboard" ? "with-sidebar" : ""}`}
        >
          {scene === "Dashboard" && (
            <aside className="sample-sidebar" data-token="sidebar">
              <b>{t("工作空间")}</b>
              {["Overview", "Projects", "Analytics", "Settings"].map(
                (item, i) => (
                  <div
                    data-token={
                      i === 0 ? "sidebar-primary" : "sidebar-foreground"
                    }
                    className={i === 0 ? "active" : ""}
                    key={item}
                  >
                    {t(item)}
                  </div>
                ),
              )}
            </aside>
          )}
          <div className="sample-main">
            <div className="sample-heading">
              <div>
                <small>{t("项目进展")}</small>
                <h2>
                  {scene === "Mail"
                    ? t("收件箱")
                    : scene === "Dashboard"
                      ? t("项目概览")
                      : t("项目概览")}
                </h2>
                <p>{t("查看项目、任务和最近更新。")}</p>
              </div>
              <button data-token="primary">
                <Icon name="plus" />
                {t("新建项目")}
              </button>
            </div>
            {scene === "Mail" ? (
              <article className="sample-mail" data-token="card">
                <div>
                  {["设计评审", "新一轮迭代", "团队更新"].map((item) => (
                    <button
                      key={item}
                      className="secondary"
                      onClick={() => setTab(item)}
                    >
                      {t(item)}
                    </button>
                  ))}
                </div>
                <h3>{tab === "全部" ? t("设计评审") : t(tab)}</h3>
                <p>
                  {t(
                    "Hi Alex，新的设计方案已经准备好。请查看改动并留下你的判断。",
                  )}
                </p>
                <textarea
                  aria-label={t("预览回复")}
                  placeholder={t("写下你的回复…")}
                />
                <button data-token="primary">{t("发送回复")}</button>
              </article>
            ) : (
              <>
                <div className="sample-stats">
                  {["活跃项目", "本周任务", "设计一致性"].map((item, i) => (
                    <article key={item} data-token="card">
                      <small>{t(item)}</small>
                      <h2>{["12", "48", "92%"][i]}</h2>
                      <p>{t("↑ 相比上周")}</p>
                    </article>
                  ))}
                </div>
                <div className="sample-grid">
                  <article data-token="card">
                    <h3>{t("活动趋势")}</h3>
                    <p>{t("最近五周的项目进展")}</p>
                    <div className="sample-chart">
                      {[48, 75, 58, 92, 68].map((n, i) => (
                        <div
                          data-token={`chart-${[1, 2, 3, 4, 2][i]}`}
                          key={i}
                          style={{
                            height: `${n}%`,
                            background: `var(--chart-${[1, 2, 3, 4, 2][i]})`,
                          }}
                        />
                      ))}
                    </div>
                    <div className="sample-tabs">
                      {["全部", "进行中", "已完成"].map((item) => (
                        <button
                          className={tab === item ? "" : "secondary"}
                          key={item}
                          onClick={() => setTab(item)}
                        >
                          {t(item)}
                        </button>
                      ))}
                    </div>
                  </article>
                  <article data-token="card">
                    <h3>{t("新建审阅")}</h3>
                    <label>
                      {t("项目名称")}
                      <input
                        data-token="input"
                        placeholder={t("例如：产品首页")}
                      />
                    </label>
                    <label>
                      {t("优先级")}
                      <select>
                        <option>{t("高优先级")}</option>
                        <option>{t("常规")}</option>
                      </select>
                    </label>
                    <label className="sample-check">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(e) => setChecked(e.target.checked)}
                      />{" "}
                      {t("完成后通知我")}
                    </label>
                    <div className="sample-actions">
                      <button data-token="primary">{t("创建任务")}</button>
                      <button disabled>{t("处理中…")}</button>
                    </div>
                  </article>
                  <article data-token="card">
                    <h3>{t("状态与操作")}</h3>
                    <p className="sample-alert" data-token="destructive">
                      {t("连接中断，请检查后重试。")}
                    </p>
                    <div className="sample-actions">
                      <button className="destructive" data-token="destructive">
                        {t("重试连接")}
                      </button>
                      <button className="secondary" data-token="secondary">
                        {t("取消")}
                      </button>
                    </div>
                    <p className="sample-muted" data-token="muted-foreground">
                      {t("辅助说明与不可用状态也需要足够清晰。")}
                    </p>
                  </article>
                  <article data-token="popover">
                    <h3>{t("组件预览")}</h3>
                    <progress value={68} max={100} />
                    <details>
                      <summary>{t("查看说明")}</summary>
                      <p>{t("按钮、表单、图表与卡片使用同一套语义变量。")}</p>
                    </details>
                    <span className="sample-badge" data-token="accent">
                      {t("已批准")}
                    </span>
                    <pre data-token="font-mono">theme.primary</pre>
                  </article>
                </div>
              </>
            )}
          </div>
        </div>
      )}
      <footer className="sample-footer">
        {t("示例界面 · 用于检查主题，不会提交业务数据")}
      </footer>
    </div>
  );
}
