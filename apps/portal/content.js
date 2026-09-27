export const repositories = { core: 'https://github.com/ShuaiMXu/creative-os', site: 'https://github.com/ShuaiMXu/creative-os-site', happyclaw: 'https://github.com/ShuaiMXu/happyclaw-site' };

// hero whirl screenshots — from the crawled appllama screens (public/assets/hero/)
export const heroScreens = Array.from({ length: 111 }, (_, i) =>
  `/assets/hero/screen-${String(i + 1).padStart(3, '0')}.webp`
);

export const heroCopy = '你的应用能跑了，但看起来不像被人设计过。我们做的事很简单：看一遍真实页面，挑一个最值得改的地方，改完再截图对比。你来说好还是不好。';

export const apps = [
  { index: '01', state: '可用', title: '审阅一个现有产品', description: '从真实页面出发，不是从需求文档出发。跑起来的应用就是最好的证据。', meta: ['SOURCE + RENDER', 'HAPPYCLAW CASE'], href: '/apps/designer/?case=happyclaw', action: '看一次真实审阅' },
  { index: '02', state: '在建', title: '把散落的样式收拢成系统', description: '代码里到处都是颜色值和间距，但没人说得清哪个是对的。我们帮你理清楚。', meta: ['TOKENS', 'COMPONENTS', 'BRAND'], href: `${repositories.core}/issues/29`, action: '跟进这项工作' },
  { index: '03', state: '规划中', title: '改了代码之后，只查受影响的部分', description: '不需要每次都全站复查。Git 告诉我们哪些文件变了，我们只看那些页面。', meta: ['GIT DIFF', 'INCREMENTAL REVIEW'], href: `${repositories.core}/issues`, action: '看路线图' }
];

export const systems = [
  { tag: 'SYSTEM / 01', title: 'HappyHands Design System', description: '深色为主，品牌橙只用在关键处。不花哨，但每处都有理由。', values: ['#111111', '#F7F6F3', '#F57F28', '#96918A'], traits: ['Professional', 'Calm', 'Friendly'], href: repositories.core },
  { tag: 'CASE / 02', title: 'HappyClaw', description: '第一个完整走完闭环的真实项目。改了什么、前后长什么样、最后判了什么，全都在。', values: ['BEFORE', 'AFTER', 'VERDICT'], traits: ['Web', 'Review', 'Evidence'], href: '/apps/designer/?case=happyclaw' },
  { tag: 'STUDY / 03', title: 'Firefly UI Kit', description: '先有系统，再设计页面的做法。想知道这条路走不走得通，看看这个。', values: ['TOKENS', 'STATES', 'PATTERNS'], traits: ['System-first', 'Archive'], href: `${repositories.core}/blob/main/docs/firefly-ui-kit-case.md` },
  { tag: 'TEMPLATE / 04', title: 'SaaS Product Foundation', description: '仪表盘和工作台的基础套件。侧栏、表格、表单、空状态，拿来就能用。', values: ['SHELL', 'DATA', 'FORMS'], traits: ['SaaS', 'Desktop', 'Template'], href: `${repositories.core}/issues` },
  { tag: 'TEMPLATE / 05', title: 'Consumer App Foundation', description: '移动端产品的预设。导航、内容卡片、付费页，覆盖最核心的几个场景。', values: ['NAV', 'CONTENT', 'PAYWALL'], traits: ['Mobile', 'Consumer', 'Template'], href: `${repositories.core}/issues` },
  { tag: 'TRACK / 06', title: 'SwiftUI Foundation', description: '原生 App 的路还没走通，先记下来。做了再说，不提前画饼。', values: ['COLOR', 'TYPE', 'MOTION'], traits: ['SwiftUI', 'Planned'], href: `${repositories.core}/issues` }
];

export const screens = [
  { label: 'BEFORE · DESKTOP', src: '/runs/06dabc2c/before/desktop.png', caption: '改之前的首页，信息层级有问题' },
  { label: 'AFTER · DESKTOP', src: '/runs/06dabc2c/after/desktop.png', caption: '改之后，同一视口' },
  { label: 'BEFORE · MOBILE', src: '/runs/06dabc2c/before/mobile.png', caption: '移动端基线' },
  { label: 'AFTER · MOBILE', src: '/runs/06dabc2c/after/mobile.png', caption: '同一状态，改后' }
];

export const screenPairs = [
  { title: '首页 · 桌面端', task: '信息层级', before: screens[0], after: screens[1], result: '层级对齐了' },
  { title: '首页 · 移动端', task: '任务连贯性', before: screens[2], after: screens[3], result: '路径没断' }
];

export const elements = [
  { kind: 'button', title: 'Button', description: '主操作用墨色实底，不用品牌橙。一屏只放一个。' },
  { kind: 'input', title: 'PromptBox', description: '输入、生成中、出错，每个阶段都得看得见。' },
  { kind: 'status', title: 'AI Label & Badge', description: 'AI 参与的内容要能认出来，已批准和待审核要有区分。' },
  { kind: 'tokens', title: 'Semantic tokens', description: '不直接写 #F57F28，写 var(--brand)。一处改，处处改。' },
  { kind: 'tabs', title: 'Tabs', description: '诊断、设计系统、视觉复核共用一套导航，不另起炉灶。' },
  { kind: 'progress', title: 'AgentStep', description: '走到哪一步、卡在哪里、下一步做什么，一眼能看出来。' },
  { kind: 'empty', title: 'Empty State', description: '没有内容的时候，告诉用户该做什么，不是摆一个图标。' },
  { kind: 'dialog', title: 'Confirm Dialog', description: '危险操作要说清楚后果，给用户反悔的机会。' },
  { kind: 'card', title: 'Content Card', description: '标题、状态、证据、动作，一张卡片说完一件事。' }
];

export const steps = [
  ['01', 'Connect', '给我一个仓库地址和一个能跑的预览。'],
  ['02', 'Capture', '我先把你的页面截图，桌面和手机各来一遍。'],
  ['03', 'Review', '你确认哪个问题最值得改，剩下的交给我。']
];
