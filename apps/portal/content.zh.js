// 中文版文案 — 全部纯中文，按中文产品设计师的语言习惯撰写
export const hero = {
  eyebrow: ['17 个有处理器的 Skill', '10 个契约级 Skill', '本地优先'],
  h1: 'AI 写完了代码。',
  h1Accent: '谁来管体验',
  h1Suffix: '？',
  copy: '自动审阅真实页面，定位影响用户任务的体验问题，修改后截图对比，结果由你判定。',
  cta: '了解能力',
  ctaSecondary: '查看真实审阅',
};

export const sections = {
  apps: {
    kicker: '01 / 应用',
    title: '产品做完之后',
    copy: '三件事：看看哪里不好用、把散落的样式理清楚、改了代码只查受影响的部分。',
    link: '在 GitHub 查看源码 ↗',
  },
  explore: {
    kicker: '02 / 设计系统',
    title: '设计系统档案',
    copy: '我们自己的设计系统，加上已经跑完全流程的项目记录。',
  },
  screens: {
    kicker: '03 / 前后对比',
    title: '改了什么，一目了然',
    copy: '同一页面、同一视口，改前和改后放在一起看。',
    link: '查看完整审阅 ↗',
  },
  elements: {
    kicker: '04 / 组件',
    title: '常用组件',
    copy: '什么时候用、什么时候别用，都写清楚了。',
  },
  getStarted: {
    kicker: '05 / 开始使用',
    title: '试一个真实产品',
    titleLine2: '五分钟出结果',
    copy: '本地运行，不用注册。一条命令，五分钟内看到第一次审阅。',
    quickstartLabel: '快速开始',
    quickstartTitle: '五分钟本地验证',
    copyBtn: '复制命令',
  },
};

export const apps = [
  { index: '01', state: '可用', title: '审阅现有产品', description: '看你的页面，不是看文档。哪个按钮用户找不到、哪段文案看不懂，截个图就知道。', meta: ['源码 + 渲染', 'HappyClaw 案例'], action: '看一次审阅' },
  { index: '02', state: '在建', title: '理清设计系统', description: '代码里到处都是颜色和间距，但没人说得清哪个是对的。帮你收拢成一份可维护的系统。', meta: ['令牌', '组件', '品牌'], action: '跟进进度' },
  { index: '03', state: '规划中', title: '改了代码，只查受影响的', description: 'Git 知道哪些文件变了，我们只复查那些页面。不用每次全站过一遍。', meta: ['Git 差异', '增量复查'], action: '看路线图' },
];

export const systems = [
  { tag: '系统 / 01', title: 'HappyHands 设计系统', description: '深色打底，品牌橙只用在关键处，每个设计决策都有出处。', values: ['#111111', '#F7F6H3', '#F57F28', '#96918A'], traits: ['专业', '克制', '亲和'], link: '查看 ↗' },
  { tag: '案例 / 02', title: 'HappyClaw', description: '第一个从头走到尾的真实项目。改了什么、改前长什么样、最后怎么判的，全都在这里。', values: ['改前', '改后', '判定'], traits: ['网页', '审阅', '证据'], link: '查看 ↗' },
  { tag: '研究 / 03', title: '萤火虫组件库', description: '先把系统建好再画页面的尝试。想知道这条路走不走得通，看看这个。', values: ['令牌', '状态', '模式'], traits: ['系统先行', '存档'], link: '查看 ↗' },
  { tag: '模板 / 04', title: 'SaaS 基础套件', description: '仪表盘和工作台的底子。侧栏、表格、表单、空状态，拿来就能用。', values: ['框架', '数据', '表单'], traits: ['SaaS', '桌面', '模板'], link: '查看 ↗' },
  { tag: '模板 / 05', title: '移动端基础套件', description: '手机产品常用的一套。导航、内容卡片、付费页，几个核心场景都覆盖了。', values: ['导航', '内容', '付费'], traits: ['移动', '消费', '模板'], link: '查看 ↗' },
  { tag: '方向 / 06', title: 'SwiftUI', description: '原生 App 这条路还没走通，先记下来，做了再说。', values: ['颜色', '字体', '动效'], traits: ['SwiftUI', '规划中'], link: '查看 ↗' },
];

export const screenPairs = [
  { title: '首页 · 桌面端', task: '信息层级', beforeLabel: '改前', afterLabel: '改后', before: { src: '/runs/06dabc2c/before/desktop.png', caption: '改之前的首页，信息层级有问题' }, after: { src: '/runs/06dabc2c/after/desktop.png', caption: '改之后，同一视口' }, result: '层级清楚了' },
  { title: '首页 · 移动端', task: '任务连贯', beforeLabel: '改前', afterLabel: '改后', before: { src: '/runs/06dabc2c/before/mobile.png', caption: '手机端基线' }, after: { src: '/runs/06dabc2c/after/mobile.png', caption: '同一页面，改后' }, result: '路径没断' },
];

export const elements = [
  { kind: 'button', title: '按钮', description: '主要操作用墨色实底，不用品牌橙，一屏只放一个。' },
  { kind: 'input', title: '输入框', description: '打字、生成中、出错，每一步用户都得看得见。' },
  { kind: 'status', title: 'AI 标签', description: 'AI 参与的内容要能认出来，已批准和待审核不能搞混。' },
  { kind: 'tokens', title: '语义令牌', description: '别在代码里写死色值，用变量。改一处，处处生效。' },
  { kind: 'tabs', title: '标签页', description: '诊断、设计系统、视觉复核共用一套导航，不另起一套。' },
  { kind: 'progress', title: '步骤指示', description: '现在走到哪、卡在哪、下一步做什么，扫一眼就知道。' },
  { kind: 'empty', title: '空状态', description: '没内容的时候告诉用户该干嘛，不是放个图标就完了。' },
  { kind: 'dialog', title: '确认弹窗', description: '高风险操作说清后果，给用户反悔的机会。' },
  { kind: 'card', title: '内容卡片', description: '标题、状态、证据、操作，一张卡片讲完一件事。' },
];

export const steps = [
  ['01', '接入', '给我一个仓库地址和一个能跑的预览。'],
  ['02', '截图', '我先把你的页面截一遍，电脑和手机各一套。'],
  ['03', '审阅', '你确认哪个问题最值得改，剩下的我来。'],
];

export const ui = {
  scrollNote: '往下看',
  githubLink: 'GitHub ↗',
  footer: { left: '创意操作系统 · 产品设计师', middle: '先看证据，再下结论', right: '查看源码 ↗' },
};
