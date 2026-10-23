import "./component-examples.css";
import { useRef, useState } from "react";
import { t } from "./i18n";

export function ComponentExamples() {
  const [enabled, setEnabled] = useState(true);
  const [progress, setProgress] = useState(64);
  const [filter, setFilter] = useState("");
  const [saved, setSaved] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const rows = [
    ["产品首页", "已完成"],
    ["账户设置", "进行中"],
    ["帮助中心", "待处理"],
  ];
  return (
    <>
      <article data-token="card">
        <h3>{t("列表与标签")}</h3>
        <label>
          {t("搜索示例页面")}
          <input
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder={t("输入页面名称")}
          />
        </label>
        <table className="specimen-table">
          <caption className="specimen-caption">{t("示例页面")}</caption>
          <thead>
            <tr>
              <th>{t("页面")}</th>
              <th>{t("状态")}</th>
            </tr>
          </thead>
          <tbody>
            {rows
              .filter(([name]) => t(name).includes(filter))
              .map(([name, status]) => (
                <tr key={name}>
                  <td>{t(name)}</td>
                  <td>
                    <span className="sample-badge">{t(status)}</span>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        {!rows.some(([name]) => t(name).includes(filter)) && (
          <p role="status">{t("没有匹配的页面")}</p>
        )}
      </article>
      <article data-token="card">
        <h3>{t("开关与进度")}</h3>
        <label className="specimen-switch-row">
          {t("接收更新通知")}
          <button
            type="button"
            role="switch"
            aria-label={t("接收更新通知")}
            aria-checked={enabled}
            className="specimen-switch"
            onClick={() => setEnabled(!enabled)}
          >
            <span />
          </button>
        </label>
        <label>
          {t("完成进度")} / {progress}%
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={(e) => setProgress(Number(e.target.value))}
          />
        </label>
        <progress aria-label={t("完成进度")} max={100} value={progress} />
        <p>{enabled ? t("通知已开启") : t("通知已关闭")}</p>
      </article>
      <article data-token="card">
        <h3>{t("提示与反馈")}</h3>
        <div className="specimen-notice" data-token="muted">
          <b>{t("草稿已保存")}</b>
          <p>{t("可以继续编辑，确认后再导出。")}</p>
        </div>
        <div
          className="specimen-notice specimen-error"
          data-token="destructive"
        >
          <b>{t("示例连接失败")}</b>
          <p>{t("请检查地址后重试。")}</p>
        </div>
      </article>
      <article data-token="card">
        <h3>{t("弹窗与确认")}</h3>
        <p>{t("打开弹窗，检查浮层、背景遮罩与键盘操作。")}</p>
        <button onClick={() => dialog.current?.showModal()}>
          {t("打开示例弹窗")}
        </button>
        <p role="status">
          {saved ? t("示例设置已确认") : t("此处操作不会修改项目。")}
        </p>
        <dialog
          ref={dialog}
          className="specimen-dialog"
          aria-label={t("确认示例设置")}
        >
          <h3>{t("确认示例设置")}</h3>
          <p>{t("此处操作不会修改项目。")}</p>
          <form method="dialog" className="sample-actions">
            <button className="secondary">{t("取消")}</button>
            <button onClick={() => setSaved(true)}>{t("确认")}</button>
          </form>
        </dialog>
      </article>
    </>
  );
}
