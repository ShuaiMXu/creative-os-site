export const repositories = { core: 'https://github.com/ShuaiMXu/creative-os', site: 'https://github.com/ShuaiMXu/creative-os-site', happyclaw: 'https://github.com/ShuaiMXu/happyclaw-site' };
export const apps = [
  { index: '01', state: 'AVAILABLE', title: 'Review an existing app', description: '从代码和实际页面建立基线，找出影响关键任务的体验问题，再生成一条可验证的修改路径。', meta: ['SOURCE + RENDER', 'HAPPYCLAW CASE'], href: '/apps/designer/?case=happyclaw', action: 'Open Workbench' },
  { index: '02', state: 'FOUNDATION', title: 'Extract its design system', description: '把散落在代码里的颜色、字体、间距、组件、状态与品牌资产整理成项目可以持续使用的 Design Foundation。', meta: ['TOKENS', 'COMPONENTS', 'BRAND'], href: `${repositories.core}/issues/29`, action: 'Track foundation work' },
  { index: '03', state: 'IN PROGRESS', title: 'Keep design quality online', description: '每次产品变化后，只复查受影响的页面和任务，保留 Before / After、人的判定和项目级经验。', meta: ['GIT DIFF', 'INCREMENTAL REVIEW'], href: `${repositories.core}/issues`, action: 'View roadmap' }
];
export const systems = [
  { tag: 'SYSTEM / 01', title: 'HappyHands Design System', description: '来自 HappyHands 品牌书的深色产品语言：墨黑与纸白建立层级，品牌橙只用于关键提示和入口。', values: ['#111111', '#F7F6F3', '#F57F28', '#96918A'], traits: ['Professional', 'Calm', 'Friendly'], href: repositories.core },
  { tag: 'CASE / 02', title: 'HappyClaw', description: '首个真实审阅案例。保存产品基线、诊断、限定修改和相同状态下的视觉复核。', values: ['BEFORE', 'AFTER', 'VERDICT'], traits: ['Web', 'Review', 'Evidence'], href: '/apps/designer/?case=happyclaw' },
  { tag: 'STUDY / 03', title: 'Firefly UI Kit', description: '先建立系统再设计页面的代表性研究，覆盖 Token、组件清单、状态和一致性治理。', values: ['TOKENS', 'STATES', 'PATTERNS'], traits: ['System-first', 'Archive'], href: `${repositories.core}/blob/main/docs/firefly-ui-kit-case.md` },
  { tag: 'TEMPLATE / 04', title: 'SaaS Product Foundation', description: '为仪表盘与工作台预设的基础系统，覆盖侧栏、数据密度、表单、反馈与空状态。', values: ['SHELL', 'DATA', 'FORMS'], traits: ['SaaS', 'Desktop', 'Template'], href: `${repositories.core}/issues` },
  { tag: 'TEMPLATE / 05', title: 'Consumer App Foundation', description: '面向移动产品的预设系统，覆盖导航、内容卡片、付费节点和关键任务连续性。', values: ['NAV', 'CONTENT', 'PAYWALL'], traits: ['Mobile', 'Consumer', 'Template'], href: `${repositories.core}/issues` },
  { tag: 'TRACK / 06', title: 'SwiftUI Foundation', description: '为原生 App 预留的设计系统提取路径；目前作为待验证方向公开记录，不把计划写成已交付能力。', values: ['COLOR', 'TYPE', 'MOTION'], traits: ['SwiftUI', 'Planned'], href: `${repositories.core}/issues` }
];
export const screens = [
  { label: 'BEFORE · DESKTOP', src: '/runs/06dabc2c/before/desktop.png', caption: '初始产品页面与原始信息层级' }, { label: 'AFTER · DESKTOP', src: '/runs/06dabc2c/after/desktop.png', caption: '限定范围修改后的同视口结果' },
  { label: 'BEFORE · MOBILE', src: '/runs/06dabc2c/before/mobile.png', caption: '移动端基线与任务连续性' }, { label: 'AFTER · MOBILE', src: '/runs/06dabc2c/after/mobile.png', caption: '相同状态下的复核证据' }
];
export const screenPairs = [
  { title: 'Homepage · Desktop', task: 'Information hierarchy', before: screens[0], after: screens[1], result: 'Hierarchy aligned' },
  { title: 'Homepage · Mobile', task: 'Responsive continuity', before: screens[2], after: screens[3], result: 'Task path preserved' }
];
export const elements = [
  { kind: 'button', title: 'Button', description: 'Primary、secondary 与 disabled 使用统一的动作层级；品牌橙不作为按钮底色。' }, { kind: 'input', title: 'PromptBox', description: '输入、焦点、生成中、成功与错误状态都进入组件档案。' },
  { kind: 'status', title: 'AI Label & Badge', description: 'Observed、candidate、approved 与 AI 生成内容拥有稳定、透明的状态标识。' }, { kind: 'tokens', title: 'Semantic tokens', description: '品牌原始值映射到 surface、text、brand 和 feedback，跨页面保持一致。' },
  { kind: 'tabs', title: 'Tabs', description: '诊断、Design System 和 Visual QA 复用同一套导航与可见状态。' }, { kind: 'progress', title: 'AgentStep', description: 'Expert Loop 每一步显示当前位置、阻塞原因和下一项可执行动作。' },
  { kind: 'empty', title: 'Empty State', description: '用一个明确的下一步替代无内容页面，覆盖首次进入、筛选为空和加载失败。' }, { kind: 'dialog', title: 'Confirm Dialog', description: '为高影响操作提供结果说明、主次动作和可撤销边界。' },
  { kind: 'card', title: 'Content Card', description: '把标题、状态、证据与动作组合成可复用的内容模板。' }
];
export const steps = [['01', 'Connect', '提供仓库和可运行的预览入口。'], ['02', 'Capture', '采集关键任务、页面状态和双视口基线。'], ['03', 'Review', '确认一条问题，再让 Harness 执行完整闭环。']];
