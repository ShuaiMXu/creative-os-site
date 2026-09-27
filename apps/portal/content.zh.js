// 中文版文案 — 全部纯中文，不混英文
export const hero = {
  eyebrow: ['17 个有处理器的 Skill', '10 个契约级 Skill', '本地优先'],
  h1: '跑得起来的产品，也该像被',
  h1Accent: '设计过',
  h1Suffix: '。',
  copy: '你的应用能跑了，但看起来不像被人设计过。看一遍真实页面，挑一个最值得改的地方，改完截图对比。你来说好还是不好。',
  cta: '看看能做什么',
  ctaSecondary: '看一次真实审阅',
};

export const sections = {
  apps: {
    kicker: '01 / 应用',
    title: '产品跑起来之后，我们做什么',
    copy: '审阅现有产品，理清设计系统，改完代码只查受影响的部分。',
    link: '在 GitHub 看源码 ↗',
  },
  explore: {
    kicker: '02 / 设计系统',
    title: '先有系统，再做页面',
    copy: '这里是我们自己的设计系统，和已经走完闭环的项目档案。',
  },
  screens: {
    kicker: '03 / 截图对比',
    title: '同一状态，改前改后',
    copy: '每一张截图都对应一个真实页面的真实状态，不是素材库。',
    link: '看完整审阅 ↗',
  },
  elements: {
    kicker: '04 / 组件',
    title: '拿来就能用的组件',
    copy: '每个组件都写清楚了什么时候用、什么时候别用。',
  },
  getStarted: {
    kicker: '05 / 开始使用',
    title: '带一个真实产品来',
    titleLine2: '走完一次完整的设计流程',
    copy: '本地运行，不用注册。跑一条命令，五分钟内看到第一次审阅。',
    quickstartLabel: '快速开始',
    quickstartTitle: '五分钟本地验证',
    copyBtn: '复制命令',
  },
};

export const apps = [
  { index: '01', state: '可用', title: '审阅现有产品', description: '从真实页面出发，不从需求文档出发。跑起来的应用就是最好的证据。', meta: ['源码 + 渲染', 'HappyClaw 案例'], action: '看一次真实审阅' },
  { index: '02', state: '在建', title: '把散落的样式收拢成系统', description: '代码里到处都是颜色值和间距，但没人说得清哪个是对的。我们帮你理清楚。', meta: ['令牌', '组件', '品牌'], action: '跟进这项工作' },
  { index: '03', state: '规划中', title: '改了代码之后，只查受影响的部分', description: '不用每次都全站复查。Git 告诉我们哪些文件变了，我们只看那些页面。', meta: ['Git 差异', '增量复查'], action: '看路线图' },
];

export const systems = [
  { tag: '系统 / 01', title: 'HappyHands 设计系统', description: '深色为主，品牌橙只用在关键处。不花哨，但每处都有理由。', values: ['#111111', '#F7F6F3', '#F57F28', '#96918A'], traits: ['专业', '克制', '亲和'], link: '查看系统 ↗' },
  { tag: '案例 / 02', title: 'HappyClaw', description: '第一个完整走完全流程的真实项目。改了什么、前后长什么样、最后判了什么，全都在。', values: ['改前', '改后', '判定'], traits: ['网页', '审阅', '证据'], link: '查看案例 ↗' },
  { tag: '研究 / 03', title: '萤火虫 UI 组件库', description: '先有系统再设计页面。想知道这条路走不走得通，看看这个。', values: ['令牌', '状态', '模式'], traits: ['系统先行', '存档'], link: '查看研究 ↗' },
  { tag: '模板 / 04', title: 'SaaS 产品基础', description: '仪表盘和工作台的基础套件。侧栏、表格、表单、空状态，拿来就能用。', values: ['框架', '数据', '表单'], traits: ['SaaS', '桌面端', '模板'], link: '查看模板 ↗' },
  { tag: '模板 / 05', title: '移动端产品基础', description: '面向移动产品的预设。导航、内容卡片、付费页，覆盖最核心的几个场景。', values: ['导航', '内容', '付费'], traits: ['移动端', '消费级', '模板'], link: '查看模板 ↗' },
  { tag: '方向 / 06', title: 'SwiftUI 设计系统', description: '原生 App 的路还没走通，先记下来。做了再说，不提前画饼。', values: ['颜色', '字体', '动效'], traits: ['SwiftUI', '规划中'], link: '查看规划 ↗' },
];

export const screenPairs = [
  { title: '首页 · 桌面端', task: '信息层级', beforeLabel: '改前', afterLabel: '改后', before: { src: '/runs/06dabc2c/before/desktop.png', caption: '改之前的首页，信息层级有问题' }, after: { src: '/runs/06dabc2c/after/desktop.png', caption: '改之后，同一视口' }, result: '层级对齐了' },
  { title: '首页 · 移动端', task: '任务连贯性', beforeLabel: '改前', afterLabel: '改后', before: { src: '/runs/06dabc2c/before/mobile.png', caption: '移动端基线' }, after: { src: '/runs/06dabc2c/after/mobile.png', caption: '同一状态，改后' }, result: '路径没断' },
];

export const elements = [
  { kind: 'button', title: '按钮', description: '主操作用墨色实底，不用品牌橙。一屏只放一个。' },
  { kind: 'input', title: '输入框', description: '输入、生成中、出错，每个阶段都得看得见。' },
  { kind: 'status', title: 'AI 标签与徽章', description: 'AI 参与的内容要能认出来，已批准和待审核要有区分。' },
  { kind: 'tokens', title: '语义令牌', description: '不直接写颜色值，写变量名。一处改，处处改。' },
  { kind: 'tabs', title: '标签页', description: '诊断、设计系统、视觉复核共用一套导航，不另起炉灶。' },
  { kind: 'progress', title: '步骤指示', description: '走到哪一步、卡在哪里、下一步做什么，一眼能看出来。' },
  { kind: 'empty', title: '空状态', description: '没有内容的时候，告诉用户该做什么，不是摆一个图标。' },
  { kind: 'dialog', title: '确认对话框', description: '危险操作要说清楚后果，给用户反悔的机会。' },
  { kind: 'card', title: '内容卡片', description: '标题、状态、证据、动作，一张卡片说完一件事。' },
];

export const steps = [
  ['01', '接入', '给我一个仓库地址和一个能跑的预览。'],
  ['02', '截图', '我先把你的页面截图，桌面和手机各来一遍。'],
  ['03', '审阅', '你确认哪个问题最值得改，剩下的交给我。'],
];

export const ui = {
  scrollNote: '往下滚动探索',
  githubLink: 'GitHub ↗',
  footer: { left: '创意操作系统 · 产品设计师', middle: '证据先于结论', right: '查看源码 ↗' },
};
