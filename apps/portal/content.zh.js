// 中文版文案 — 全部纯中文，不混英文
export const hero = {
  eyebrow: ['17 个有处理器的 Skill', '10 个契约级 Skill', '本地优先'],
  h1: '跑得起来的产品，也该像被',
  h1Accent: '设计过',
  h1Suffix: '。',
  copy: '从真实页面出发，识别影响关键任务的体验问题，执行一次可验证的修改，以同状态截图对比结果。',
  cta: '了解能力',
  ctaSecondary: '查看真实审阅',
};

export const sections = {
  apps: {
    kicker: '01 / 应用',
    title: '产品构建之后的设计工作',
    copy: '审阅现有产品、提取设计系统、在代码变更后执行增量复查。',
    link: '在 GitHub 查看源码 ↗',
  },
  explore: {
    kicker: '02 / 设计系统',
    title: '先建立系统，再设计页面',
    copy: '我们的设计系统与已完成完整审阅闭环的项目档案。',
  },
  screens: {
    kicker: '03 / 截图对比',
    title: '同一状态，改前与改后',
    copy: '每张截图对应一个可复现的页面状态与视口。',
    link: '查看完整审阅 ↗',
  },
  elements: {
    kicker: '04 / 组件',
    title: '可直接使用的组件',
    copy: '每个组件均标注适用场景、状态定义与使用边界。',
  },
  getStarted: {
    kicker: '05 / 开始使用',
    title: '接入一个真实产品',
    titleLine2: '完成一次完整的设计闭环',
    copy: '本地运行，无需注册。执行一条命令，五分钟内获得首次审阅。',
    quickstartLabel: '快速开始',
    quickstartTitle: '五分钟本地验证',
    copyBtn: '复制命令',
  },
};

export const apps = [
  { index: '01', state: '可用', title: '审阅现有产品', description: '从实际页面出发建立基线，识别影响关键任务的体验问题，生成可验证的修改路径。', meta: ['源码 + 渲染', 'HappyClaw 案例'], action: '查看真实审阅' },
  { index: '02', state: '在建', title: '提取设计系统', description: '将散落在代码中的颜色、字体、间距、组件与品牌资产整理为可持续使用的 Design Foundation。', meta: ['令牌', '组件', '品牌'], action: '跟进此项工作' },
  { index: '03', state: '规划中', title: '增量复查', description: '代码变更后仅复查受影响的页面与任务，保留前后对比与项目级经验。', meta: ['Git 差异', '增量复查'], action: '查看路线图' },
];

export const systems = [
  { tag: '系统 / 01', title: 'HappyHands 设计系统', description: '深色界面为基础，品牌橙仅用于关键强调。每个设计决策均有明确依据。', values: ['#111111', '#F7F6F3', '#F57F28', '#96918A'], traits: ['专业', '克制', '亲和'], link: '查看系统 ↗' },
  { tag: '案例 / 02', title: 'HappyClaw', description: '首个完成完整闭环的真实项目，包含基线、诊断、限定修改、视觉复核与最终判定。', values: ['改前', '改后', '判定'], traits: ['网页', '审阅', '证据'], link: '查看案例 ↗' },
  { tag: '研究 / 03', title: '萤火虫 UI 组件库', description: '先建立系统再设计页面的代表性研究，覆盖令牌、组件状态与一致性治理。', values: ['令牌', '状态', '模式'], traits: ['系统先行', '存档'], link: '查看研究 ↗' },
  { tag: '模板 / 04', title: 'SaaS 产品基础', description: '仪表盘与工作台的基础套件，覆盖侧栏、数据表格、表单与空状态。', values: ['框架', '数据', '表单'], traits: ['SaaS', '桌面端', '模板'], link: '查看模板 ↗' },
  { tag: '模板 / 05', title: '移动端产品基础', description: '面向移动产品的预设系统，覆盖导航、内容卡片与付费节点。', values: ['导航', '内容', '付费'], traits: ['移动端', '消费级', '模板'], link: '查看模板 ↗' },
  { tag: '方向 / 06', title: 'SwiftUI 设计系统', description: '原生应用的设计系统提取路径，当前作为待验证方向记录。', values: ['颜色', '字体', '动效'], traits: ['SwiftUI', '规划中'], link: '查看规划 ↗' },
];

export const screenPairs = [
  { title: '首页 · 桌面端', task: '信息层级', beforeLabel: '改前', afterLabel: '改后', before: { src: '/runs/06dabc2c/before/desktop.png', caption: '改之前的首页，信息层级有问题' }, after: { src: '/runs/06dabc2c/after/desktop.png', caption: '改之后，同一视口' }, result: '层级对齐了' },
  { title: '首页 · 移动端', task: '任务连贯性', beforeLabel: '改前', afterLabel: '改后', before: { src: '/runs/06dabc2c/before/mobile.png', caption: '移动端基线' }, after: { src: '/runs/06dabc2c/after/mobile.png', caption: '同一状态，改后' }, result: '路径没断' },
];

export const elements = [
  { kind: 'button', title: '按钮', description: '主操作采用墨色实底，品牌橙不作为按钮底色。每屏仅保留一个主操作。' },
  { kind: 'input', title: '输入框', description: '输入、生成中、出错，每个阶段均有明确的视觉状态。' },
  { kind: 'status', title: 'AI 标签与徽章', description: 'AI 参与的内容需可识别，已批准与待审核状态有明确区分。' },
  { kind: 'tokens', title: '语义令牌', description: '不直接使用颜色值，统一通过变量引用。修改一处，全局生效。' },
  { kind: 'tabs', title: '标签页', description: '诊断、设计系统与视觉复核共用同一套导航结构。' },
  { kind: 'progress', title: '步骤指示', description: '当前步骤、阻塞原因与下一步操作均可一目了然。' },
  { kind: 'empty', title: '空状态', description: '无内容时提供明确的下一步指引，而非仅展示图标。' },
  { kind: 'dialog', title: '确认对话框', description: '高风险操作需说明后果，并提供撤销途径。' },
  { kind: 'card', title: '内容卡片', description: '标题、状态、证据与操作组合为一个完整的信息单元。' },
];

export const steps = [
  ['01', '接入', '提供仓库地址与可运行的预览环境。'],
  ['02', '截图', '采集桌面端与移动端的双视口页面基线。'],
  ['03', '审阅', '确认优先问题后，由系统执行完整闭环。'],
];

export const ui = {
  scrollNote: '往下滚动探索',
  githubLink: 'GitHub ↗',
  footer: { left: '创意操作系统 · 产品设计师', middle: '证据先于结论', right: '查看源码 ↗' },
};
