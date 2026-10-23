import { useState } from "react";
import { Button } from "./index";
import { Select } from "./Select";
import { Icon } from "./Icon";
type Registry = {
  source: string;
  checkedAt: string;
  items: { name: string; title: string; type: string }[];
};
import "./components.css";
import "./system-reference.css";

const labels: Record<string, [string, string]> = {
  button: ["按钮", "触发操作，保留加载时的操作名称。"],
  "button-group": ["按钮组", "组合有关联的操作。"],
  "copy-button": ["复制按钮", "复制内容，并在原位置确认结果。"],
  input: ["输入框", "输入文字、密码、搜索词与数字。"],
  textarea: ["多行输入", "输入较长的内容。"],
  field: ["表单字段", "组合标签、控件、说明和错误。"],
  "date-picker": ["日期选择", "选择日期、区间或时间。"],
  combobox: ["可搜索选择", "搜索并选择一个或多个选项。"],
  checkbox: ["复选框", "选择独立选项或表达部分选择。"],
  "radio-group": ["单选组", "从可见选项中选择一项。"],
  switch: ["开关", "即时更改一项设置。"],
  slider: ["滑块", "调整数值或区间。"],
  select: ["下拉选择", "从固定选项中选择一项。"],
  "segmented-control": ["分段选择", "切换少量关联选项。"],
  badge: ["徽标", "标记数量、类型或类别。"],
  chip: ["筛选标签", "切换筛选条件或移除已选值。"],
  status: ["状态", "标记排队、运行、完成或失败。"],
  stat: ["统计值", "展示数值、趋势与变化。"],
  avatar: ["头像", "识别人、代理或信息来源。"],
  kbd: ["快捷键", "展示键盘操作。"],
  "relative-time": ["相对时间", "简写时间并保留精确值。"],
  truncate: ["长文本", "截断长内容，同时保留完整值入口。"],
  item: ["列表项", "组合标题、媒体、状态与操作。"],
  card: ["内容卡片", "承载单一主题的内容。"],
  panel: ["面板", "组织概览或设置中的一组内容。"],
  "data-list": ["详情列表", "逐项呈现名称与数值。"],
  alert: ["行内提示", "说明当前页面需要注意的情况。"],
  toast: ["轻提示", "确认操作或提示后台结果。"],
  "empty-state": ["空状态", "说明无内容、无权限或加载失败的原因。"],
  skeleton: ["加载占位", "在加载期间保留内容形状。"],
  progress: ["进度", "通过条形、环形或步骤展示进度。"],
  dialog: ["对话框", "集中处理一项任务或确认操作。"],
  sheet: ["侧边面板", "从边缘打开补充内容。"],
  popover: ["浮层", "在相关控件旁展示内容。"],
  tooltip: ["悬停提示", "补充图标名称或快捷键。"],
  "dropdown-menu": ["操作菜单", "展开与当前对象有关的操作。"],
  command: ["命令面板", "搜索并选择可执行的命令。"],
  tabs: ["标签页", "在同一任务的相关视图间切换。"],
  breadcrumb: ["面包屑", "说明页面层级。"],
  pagination: ["分页", "浏览不同页的结果。"],
  collapsible: ["折叠内容", "按需展开补充信息。"],
  "page-header": ["页面标题", "组织标题、说明与主要操作。"],
  table: ["数据表格", "按行阅读结构化数据。"],
  "filter-bar": ["筛选栏", "缩小当前数据的范围。"],
  timeline: ["时间线", "按时间顺序组织事件。"],
  "code-block": ["代码块", "阅读与复制代码。"],
  "json-view": ["JSON 查看", "查看结构化内容。"],
  "log-viewer": ["日志查看", "阅读执行日志。"],
  attachment: ["附件", "展示消息中的文件。"],
  chart: ["图表", "呈现数据的分布与变化。"],
  message: ["消息", "组织单条对话内容。"],
  conversation: ["对话", "组织连续消息。"],
  response: ["回复", "展示逐步生成的内容。"],
  reasoning: ["过程说明", "按需展开执行过程说明。"],
  "tool-call": ["工具调用", "展示调用参数、状态与结果。"],
  activity: ["当前活动", "说明代理正在执行的任务。"],
  "prompt-input": ["请求输入", "编辑请求并引用资源。"],
  "send-button": ["发送与停止", "发送请求，或停止当前生成。"],
  mention: ["资源引用", "标记请求或回复中提及的资源。"],
  "bulk-action-bar": ["批量操作", "操作已选择的多行内容。"],
  "data-grid": ["可编辑表格", "提供单元格焦点、编辑与粘贴。"],
  "project-home": ["项目首页", "项目概况、待办和最近活动。"],
  "agent-session": ["代理会话", "回复、工具调用与输入区域。"],
  "tool-approval": ["工具审批", "检查操作范围后允许或拒绝。"],
  "api-keys": ["访问密钥", "创建、查看与撤销密钥。"],
  "deploy-detail": ["发布详情", "发布状态、检查结果与回退。"],
  "run-trace": ["运行追踪", "按步骤查看执行过程与详情。"],
  "live-requests": ["实时活动", "筛选和查看持续产生的调用。"],
  theme: ["主题", "作用域样式与设计变量。"],
  skill: ["接入 Skill", "供项目代理读取的设计约定。"],
  lint: ["规范检查", "检查迁移范围内的样式使用。"],
  icon: ["图标", "统一图标的引用入口。"],
  portal: ["浮层作用域", "保持浮层内的设计变量。"],
  overlay: ["浮层基础", "浮层布局、焦点和背景遮罩。"],
  utils: ["样式工具", "合并类名与引用。"],
  kind: ["类型定义", "统一类别与状态名称。"],
  format: ["数值格式", "统一列中的数值单位。"],
  "css-var": ["变量读取", "为图表和画布读取设计变量。"],
  direction: ["文字方向", "传递界面的文字方向。"],
  "use-focus-when-replaced": ["焦点恢复", "操作区域替换后保留键盘位置。"],
  "use-offscreen": ["屏外活动", "在内容不可见时暂停活动表现。"],
  children: ["组合部件", "识别组件内的组合部件。"],
  "scroll-focus": ["滚动焦点", "为溢出内容提供键盘滚动入口。"],
};
Object.assign(labels, {
  dropzone: ["文件上传", "选择或拖入文件，并说明接收条件。"],
  keypad: ["数字键盘", "为金额等数值提供输入方式。"],
  radio: ["单选", "选择一项可见选项。"],
  segmented: ["分段选择", "切换相关选项。"],
  list: ["列表", "组织可浏览和操作的内容。"],
  "list-item-menu": ["列表项菜单", "展开与一行内容有关的操作。"],
  amount: ["金额", "明确展示金额、方向与格式。"],
  empty: ["空状态", "说明当前没有内容及后续操作。"],
  "error-state": ["错误状态", "说明失败原因并提供恢复操作。"],
  "alert-dialog": ["重要确认", "在执行重要操作前确认范围。"],
  toolbar: ["工具栏", "组织同一任务中的操作。"],
  accordion: ["手风琴", "按需展开分组内容。"],
  separator: ["分隔线", "分隔有关联的内容组。"],
  "scroll-area": ["滚动区域", "为超出空间的内容保留浏览入口。"],
  "chat-input": ["对话输入", "编辑发给助手的请求。"],
  "follow-ups": ["后续建议", "为当前任务提供可选择的后续动作。"],
  "approval-request": ["审批请求", "先展示操作范围，再请求允许。"],
  "action-receipt": ["操作回执", "说明已完成的动作及撤销入口。"],
  "autonomy-rule": ["自主操作规则", "设定助手可执行的范围和限制。"],
  "receipt-match": ["凭证核对", "对照交易与凭证中的信息。"],
  insight: ["信息洞察", "说明变化并给出有关联的操作。"],
  "bill-schedule": ["账单计划", "按日期组织待处理账单。"],
  balance: ["余额", "突出当前可用金额。"],
  home: ["个人首页", "余额、待办和近期活动。"],
  "assistant-approval": ["助手审批", "核对助手建议并允许或拒绝。"],
  "assistant-alert": ["助手提醒", "说明需要处理的情况。"],
  "settings-rules": ["规则设置", "查看和调整助手操作边界。"],
  "split-request": ["分账请求", "核对分配金额与收款对象。"],
  popup: ["浮层样式", "为弹出内容提供共享样式。"],
});
const purposes: Record<string, string> = {
  button: "Trigger an action and keep its name visible while pending.",
  "button-group": "Keep related actions together.",
  "copy-button": "Copy a value with confirmation beside it.",
  input: "Enter text, search terms, numbers or secrets.",
  textarea: "Write a longer response.",
  field: "Keep labels, help and validation with the control.",
  "date-picker": "Choose a date, range or time.",
  combobox: "Search a choice list before selecting.",
  checkbox: "Select independent options.",
  "radio-group": "Choose one of the visible options.",
  switch: "Change an immediately applied setting.",
  slider: "Adjust a number along a track.",
  select: "Choose a value from a fixed list.",
  "segmented-control": "Choose among a few related options.",
  badge: "Label a count or category.",
  chip: "Toggle a filter or remove a selected value.",
  status: "Name the current state of a task.",
  stat: "Present a metric and its change.",
  avatar: "Identify a person or source.",
  kbd: "Make keyboard actions recognizable.",
  "relative-time": "Keep an exact timestamp behind a short label.",
  truncate: "Shorten a value without losing access to it.",
  item: "Combine a row title with metadata and actions.",
  card: "Group content around one topic.",
  panel: "Separate a related group of controls or content.",
  "data-list": "Read named values in a detail view.",
  alert: "Explain an issue within the current view.",
  toast: "Confirm an action without interrupting the task.",
  "empty-state": "Explain missing content and the next useful step.",
  skeleton: "Reserve space while content is loading.",
  progress: "Show how far a task has advanced.",
  dialog: "Focus attention on a task or decision.",
  sheet: "Open supporting content from a screen edge.",
  popover: "Show extra content next to its trigger.",
  tooltip: "Explain an icon or keyboard shortcut.",
  "dropdown-menu": "Offer contextual actions.",
  command: "Search and run a command.",
  tabs: "Switch between related views.",
  breadcrumb: "Show the page hierarchy.",
  pagination: "Move through result pages.",
  collapsible: "Reveal secondary information when needed.",
  "page-header": "Put a title and its main action together.",
  table: "Read structured information by row.",
  "filter-bar": "Narrow a set of results.",
  timeline: "Read events in time order.",
  "code-block": "Read and copy source text.",
  "json-view": "Inspect structured values.",
  "log-viewer": "Follow execution output.",
  attachment: "Present a file alongside a message.",
  chart: "Compare values and changes visually.",
  message: "Present one entry in a conversation.",
  conversation: "Arrange messages in a continuing thread.",
  response: "Display a response as it arrives.",
  reasoning: "Disclose process notes when needed.",
  "tool-call": "Inspect an operation and its result.",
  activity: "Explain what is currently running.",
  "prompt-input": "Compose a request with resource references.",
  "send-button": "Send a request or stop generation.",
  mention: "Identify a referenced resource.",
  "bulk-action-bar": "Act on selected rows together.",
  "data-grid": "Edit values with cell-level keyboard navigation.",
  "project-home": "Bring project activity and pending work together.",
  "agent-session": "Combine a thread, tool operations and composer.",
  "tool-approval": "Inspect an operation before allowing it.",
  "api-keys": "Create, reveal and revoke access keys.",
  "deploy-detail": "Inspect release checks and recovery actions.",
  "run-trace": "Read execution steps with their details.",
  "live-requests": "Filter an ongoing stream of operations.",
  theme: "Apply scoped styles and design variables.",
  skill: "Provide design conventions to a project agent.",
  lint: "Check styles against the system rules.",
  icon: "Share one icon import point.",
  portal: "Keep overlay content within the theme scope.",
  overlay: "Share overlay layout and focus behavior.",
  utils: "Combine class names and references.",
  kind: "Share category and state definitions.",
  format: "Keep numeric units consistent in a column.",
  "css-var": "Read theme variables for charts and canvases.",
  direction: "Pass text direction to interface controls.",
  "use-focus-when-replaced": "Keep keyboard focus when content is replaced.",
  "use-offscreen": "Pause activity outside the visible area.",
  children: "Identify compound component parts.",
  "scroll-focus": "Make overflowing content reachable by keyboard.",
};
Object.assign(purposes, {
  dropzone: "Choose or drop a file with clear upload requirements.",
  keypad: "Enter numeric values with dedicated keys.",
  radio: "Choose one visible option.",
  segmented: "Switch between related options.",
  list: "Browse rows with their available actions.",
  "list-item-menu": "Offer actions for a specific row.",
  amount: "Show the amount, direction and numeric format.",
  empty: "Explain missing content and how to proceed.",
  "error-state": "Explain a failure with a recovery action.",
  "alert-dialog": "Confirm the scope of an important action.",
  toolbar: "Group actions for the current task.",
  accordion: "Expand related content groups.",
  separator: "Separate related groups of content.",
  "scroll-area": "Keep overflowing content accessible.",
  "chat-input": "Write a request to the assistant.",
  "follow-ups": "Choose a relevant next step.",
  "approval-request": "Inspect an operation before allowing it.",
  "action-receipt": "Inspect a completed action and its undo option.",
  "autonomy-rule": "Set limits for assistant actions.",
  "receipt-match": "Compare a transaction with its receipt.",
  insight: "Explain a change with a relevant action.",
  "bill-schedule": "Review bills by due date.",
  balance: "Focus attention on the available amount.",
  home: "Bring a personal overview and pending work together.",
  "assistant-approval": "Allow or decline an assistant proposal.",
  "assistant-alert": "Respond to an issue raised by the assistant.",
  "settings-rules": "Review limits for assistant operations.",
  "split-request": "Review shared amounts and their recipients.",
  popup: "Share popup layout and appearance.",
});
const groups = [
  ["all", "全部", "All"],
  ["inputs", "操作与输入", "Actions & inputs"],
  ["feedback", "反馈与浮层", "Feedback & overlays"],
  ["navigation", "导航", "Navigation"],
  ["data", "内容与数据", "Content & data"],
  ["ai", "AI 工作流", "AI workflows"],
  ["screens", "页面模板", "Screen blocks"],
  ["setup", "接入与工具", "Setup & utilities"],
];
function groupOf(item: Registry["items"][number]) {
  if (item.type === "registry:block") return "screens";
  if (
    ["registry:lib", "registry:item"].includes(item.type) ||
    item.name === "icon"
  )
    return "setup";
  if (
    item.type === "registry:component" ||
    [
      "chat-input",
      "message",
      "tool-call",
      "follow-ups",
      "approval-request",
      "action-receipt",
      "autonomy-rule",
      "receipt-match",
      "insight",
    ].includes(item.name)
  )
    return "ai";
  if (
    [
      "button",
      "button-group",
      "copy-button",
      "input",
      "textarea",
      "field",
      "date-picker",
      "combobox",
      "checkbox",
      "radio-group",
      "switch",
      "slider",
      "select",
      "segmented-control",
      "dropzone",
      "keypad",
      "radio",
      "segmented",
    ].includes(item.name)
  )
    return "inputs";
  if (
    [
      "alert",
      "toast",
      "empty-state",
      "skeleton",
      "progress",
      "dialog",
      "sheet",
      "popover",
      "tooltip",
      "dropdown-menu",
      "command",
      "status",
      "empty",
      "error-state",
      "alert-dialog",
    ].includes(item.name)
  )
    return "feedback";
  if (
    [
      "tabs",
      "breadcrumb",
      "pagination",
      "collapsible",
      "page-header",
      "filter-bar",
      "toolbar",
      "accordion",
      "separator",
      "scroll-area",
    ].includes(item.name)
  )
    return "navigation";
  return "data";
}
export function SystemCatalog({
  lang,
  system,
  registry,
}: {
  lang: string;
  system: "quartz" | "lime";
  registry: Registry;
}) {
  const t = (zh: string, en: string) => (lang === "zh" ? zh : en);
  const [limit, setLimit] = useState(12);
  const [query, setQuery] = useState(""),
    [group, setGroup] = useState("all"),
    [notice, setNotice] = useState("");
  const items = registry.items.filter(
    (item) =>
      (group === "all" || groupOf(item) === group) &&
      `${item.name} ${item.title} ${labels[item.name]?.join(" ") || ""}`
        .toLowerCase()
        .includes(query.trim().toLowerCase()),
  );
  return (
    <div className={`${system}-catalog system-registry`}>
      <div className="reference-toolbar">
        <label>
          {t("查找组件或模板", "Find a component or screen")}
          <input
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setLimit(12);
            }}
            placeholder={t(
              "例如：表格、对话框、运行追踪",
              "e.g. table, dialog, run trace",
            )}
          />
        </label>
        <label>
          {t("内容分类", "Category")}
          <Select
            value={group}
            onChange={(event) => {
              setGroup(event.target.value);
              setLimit(12);
            }}
          >
            {groups.map(([id, zh, en]) => (
              <option key={id} value={id}>
                {t(zh, en)}  / {" "}
                {
                  registry.items.filter(
                    (item) => id === "all" || groupOf(item) === id,
                  ).length
                }
              </option>
            ))}
          </Select>
        </label>
      </div>
      <p className="reference-count" role="status">
        {t(
          `显示 ${Math.min(limit, items.length)} / ${items.length} 项匹配 / 共 ${registry.items.length} 项`,
          `${Math.min(limit, items.length)} of ${items.length} matches / ${registry.items.length} entries total`,
        )}
      </p>
      <div className="registry-grid">
        {items.slice(0, limit).map((item) => {
          const command = `npx shadcn@latest add https://design.how/r/${system}/${item.name}.json`;
          return (
            <article
              key={item.name}
              className="registry-entry"
              data-registry-item={item.name}
            >
              <span className="reference-kicker">
                {t(
                  ...(groups.find(([id]) => id === groupOf(item))!.slice(1) as [
                    string,
                    string,
                  ]),
                )}
              </span>
              <h3>{t(labels[item.name]?.[0] || item.title, item.title)}</h3>
              <code>{item.name}</code>
              <p>
                {t(
                  labels[item.name]?.[1] || "项目接入的配套工具。",
                  purposes[item.name] ||
                    "A supporting module for project setup.",
                )}
              </p>
              <details>
                <summary>
                  {t("查看接入", "Setup details")}
                  <Icon name="down" />
                </summary>
                <p>
                  {t(
                    "目录说明。本站未安装此上游组件；先检查项目兼容性，再使用以下接入命令。",
                    "Catalog entry. This upstream component is not installed here. Check project compatibility before using this command.",
                  )}
                </p>
                <pre>{command}</pre>
                <div className="reference-actions">
                  <Button
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(command);
                        setNotice(
                          t(
                            `已复制 ${item.name} 的命令。`,
                            `Command for ${item.name} copied.`,
                          ),
                        );
                      } catch {
                        setNotice(
                          t(
                            "无法复制，请手动选择命令。",
                            "Copy unavailable. Select the command manually.",
                          ),
                        );
                      }
                    }}
                  >
                    {t("复制命令", "Copy command")}
                  </Button>
                  <a
                    href={`https://design.how/r/${system}/${item.name}.json`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {t("来源", "Source")} <Icon name="external" />
                  </a>
                </div>
              </details>
            </article>
          );
        })}
      </div>
      {limit < items.length && (
        <div className="reference-pagination">
          <Button onClick={() => setLimit((value) => value + 12)}>
            {t("继续浏览", "Show more")}
          </Button>
          <Button variant="ghost" onClick={() => setLimit(items.length)}>
            {t("显示全部匹配项", "Show all matches")}
          </Button>
        </div>
      )}
      {!items.length && (
        <p className="reference-empty">
          {t(
            "没有匹配的内容，换个关键词或选择全部分类。",
            "No matching entries. Try another term or select all categories.",
          )}
        </p>
      )}
      <output className="reference-notice" aria-live="polite">
        {notice}
      </output>
      <p className="note">
        {t(
          `收录日期：${registry.checkedAt}。目录由 HappyHands 整理，组件来源为 design.how；更新可能晚于上游。`,
          `Catalog checked ${registry.checkedAt}. Curated by HappyHands from design.how; upstream may have changed.`,
        )}{" "}
        <a href={registry.source} target="_blank" rel="noreferrer">
          {t("原始目录", "Upstream registry")}
        </a>
      </p>
    </div>
  );
}
