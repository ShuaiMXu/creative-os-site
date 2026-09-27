export const repositories = { core: 'https://github.com/ShuaiMXu/creative-os', site: 'https://github.com/ShuaiMXu/creative-os-site', happyclaw: 'https://github.com/ShuaiMXu/happyclaw-site' };
export const apps = [
  { index: '01', state: 'AVAILABLE', title: 'Review an existing app', description: '从代码和实际页面建立基线，找出影响关键任务的体验问题，再生成一条可验证的修改路径。', meta: ['SOURCE + RENDER', 'HAPPYCLAW CASE'], href: '/apps/designer/?case=happyclaw', action: 'Open Workbench' },
  { index: '02', state: 'FOUNDATION', title: 'Extract its design system', description: '把散落在代码里的颜色、字体、间距、组件、状态与品牌资产整理成项目可以持续使用的 Design Foundation。', meta: ['TOKENS', 'COMPONENTS', 'BRAND'], href: `${repositories.core}/issues/29`, action: 'Track foundation work' },
  { index: '03', state: 'IN PROGRESS', title: 'Keep design quality online', description: '每次产品变化后，只复查受影响的页面和任务，保留 Before / After、人的判定和项目级经验。', meta: ['GIT DIFF', 'INCREMENTAL REVIEW'], href: `${repositories.core}/issues`, action: 'View roadmap' }
];
export const systems = [
  { tag: 'SYSTEM / 01', title: 'Creative OS Foundation', description: 'Harness 自身的深色产品语言：高密度证据面板、清楚的状态层级和暖色操作信号。', values: ['#10100F', '#F4EEE6', '#E8CDB7', '#79746E'], traits: ['Utility', 'Dense', 'Calm'], href: repositories.core },
  { tag: 'CASE / 02', title: 'HappyClaw', description: '首个真实审阅案例。保存产品基线、诊断、限定修改和相同状态下的视觉复核。', values: ['BEFORE', 'AFTER', 'VERDICT'], traits: ['Web', 'Review', 'Evidence'], href: '/apps/designer/?case=happyclaw' },
  { tag: 'STUDY / 03', title: 'Firefly UI Kit', description: '先建立系统再设计页面的代表性研究，覆盖 Token、组件清单、状态和一致性治理。', values: ['TOKENS', 'STATES', 'PATTERNS'], traits: ['System-first', 'Archive'], href: `${repositories.core}/blob/main/docs/firefly-ui-kit-case.md` },
  { tag: 'TRACK / 04', title: 'SwiftUI Foundation', description: '为原生 App 预留的设计系统提取路径；目前作为待验证方向公开记录，不把计划写成已交付能力。', values: ['COLOR', 'TYPE', 'MOTION'], traits: ['SwiftUI', 'Planned'], href: `${repositories.core}/issues` }
];
export const screens = [
  { label: 'BEFORE · DESKTOP', src: '/runs/06dabc2c/before/desktop.png', caption: '初始产品页面与原始信息层级' }, { label: 'AFTER · DESKTOP', src: '/runs/06dabc2c/after/desktop.png', caption: '限定范围修改后的同视口结果' },
  { label: 'BEFORE · MOBILE', src: '/runs/06dabc2c/before/mobile.png', caption: '移动端基线与任务连续性' }, { label: 'AFTER · MOBILE', src: '/runs/06dabc2c/after/mobile.png', caption: '相同状态下的复核证据' }
];
export const elements = [
  { kind: 'button', title: 'Action hierarchy', description: 'Primary、secondary、danger 与 disabled 状态共享语义层级。' }, { kind: 'input', title: 'Field states', description: 'Default、focus、loading、success 和 error 都进入组件档案。' },
  { kind: 'status', title: 'Evidence status', description: 'Observed、candidate、approved 与 needs-evidence 不再混写。' }, { kind: 'tokens', title: 'Semantic tokens', description: '原始值保留来源，再映射到 surface、text、accent 和 feedback。' },
  { kind: 'tabs', title: 'Review modes', description: '诊断、Foundation 和 Visual QA 使用同一套可见状态语言。' }, { kind: 'progress', title: 'Expert Loop', description: '每一步显示当前位置、阻塞原因和下一项可执行动作。' }
];
export const steps = [['01', 'Connect', '提供仓库和可运行的预览入口。'], ['02', 'Capture', '采集关键任务、页面状态和双视口基线。'], ['03', 'Review', '确认一条问题，再让 Harness 执行完整闭环。']];
