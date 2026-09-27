// English copy — plain, direct, the way a designer would actually pitch this
export const hero = {
  eyebrow: ['17 bounded skills', '10 contract-only', 'local-first'],
  h1: 'Make your product\ntruly ',
  h1Accent: 'professional',
  h1Suffix: '.',
  copy: 'Automated design review of live pages: find the issue that hurts your users most, fix it, screenshot the difference, you decide.',
  cta: 'Explore capabilities',
  ctaSecondary: 'View a real review',
};

export const sections = {
  apps: {
    kicker: '01 / APPS',
    title: 'After the build',
    copy: 'Review the pages, systematize the foundation, fix within constraints, optimize visual and experience — each step\'s output feeds the next.',
    link: 'View source on GitHub ↗',
  },
  explore: {
    kicker: '02 / DESIGN SYSTEMS',
    title: 'Design system archive',
    copy: 'Our own design system, plus project records from completed review cycles.',
  },
  screens: {
    kicker: '03 / BEFORE & AFTER',
    title: 'See what changed',
    copy: 'Same page, same viewport, before and after side by side.',
    link: 'Open the full review ↗',
  },
  elements: {
    kicker: '04 / UI ELEMENTS',
    title: 'Common components',
    copy: 'Each one says when to use it and when not to.',
  },
  getStarted: {
    kicker: '05 / GET STARTED',
    title: 'Try a real product',
    titleLine2: 'Five minutes to results',
    copy: 'Runs locally, no signup. One command, first review in five minutes.',
    quickstartLabel: 'QUICKSTART',
    quickstartTitle: 'Five-minute local proof',
    copyBtn: 'Copy command',
  },
};

export const apps = [
  { index: '01', state: 'AVAILABLE', title: 'Review', description: 'Start from live pages. Screenshot, diagnose, rank — find the one issue worth fixing first.', meta: ['SOURCE + RENDER', 'HAPPYCLAW CASE'], action: 'See a review' },
  { index: '02', state: 'IN PROGRESS', title: 'Systematize', description: 'Pull scattered colors, type, spacing and components into a maintainable Design Foundation that constrains future changes.', meta: ['TOKENS', 'COMPONENTS', 'BRAND'], action: 'Track progress' },
  { index: '03', state: 'PLANNED', title: 'Fix', description: 'Scoped changes within system constraints. Isolated worktree, no push, same-state before/after screenshots.', meta: ['GIT DIFF', 'BEFORE/AFTER'], action: 'View roadmap' },
  { index: '04', state: 'PLANNED', title: 'Optimize', description: 'Visual: hierarchy, spacing, consistency. Experience: task paths, information architecture, error recovery. Both tracks in parallel.', meta: ['VISUAL', 'UX', 'INCREMENTAL'], action: 'View roadmap' },
];

export const systems = [
  { tag: 'Design System', title: 'HappyHands', description: 'Dark surfaces, one warm accent used sparingly.', values: ['#111111', '#F7F6F3', '#F57F28', '#96918A'], traits: ['Professional', 'Calm', 'Friendly'] },
  { tag: 'Case Study', title: 'HappyClaw', description: 'First real project end to end. What changed, before and after, final verdict.', values: ['BEFORE', 'AFTER', 'VERDICT'], traits: ['Web', 'Review', 'Evidence'] },
  { tag: 'Design System', title: 'Firefly', description: 'System first, pages second — an attempt worth studying.', values: ['TOKENS', 'STATES', 'PATTERNS'], traits: ['System-first', 'Archive'] },
  { tag: 'Template', title: 'SaaS Starter', description: 'Dashboard and workbench foundation. Sidebar, tables, forms, empty states.', values: ['SHELL', 'DATA', 'FORMS'], traits: ['SaaS', 'Desktop', 'Template'] },
  { tag: 'Template', title: 'Mobile Starter', description: 'Common set for phone products. Navigation, cards, paywalls.', values: ['NAV', 'CONTENT', 'PAYWALL'], traits: ['Mobile', 'Consumer', 'Template'] },
  { tag: 'Planned', title: 'SwiftUI', description: 'Native path not proven yet. Noted, not promised.', values: ['COLOR', 'TYPE', 'MOTION'], traits: ['SwiftUI', 'Planned'] },
];

export const screenPairs = [
  { title: 'Homepage · Desktop', task: 'Hierarchy', beforeLabel: 'BEFORE', afterLabel: 'AFTER', before: { src: '/runs/06dabc2c/before/desktop.png', caption: 'Homepage before the change' }, after: { src: '/runs/06dabc2c/after/desktop.png', caption: 'Same viewport after' }, result: 'Clearer' },
  { title: 'Homepage · Mobile', task: 'Task flow', beforeLabel: 'BEFORE', afterLabel: 'AFTER', before: { src: '/runs/06dabc2c/before/mobile.png', caption: 'Mobile baseline' }, after: { src: '/runs/06dabc2c/after/mobile.png', caption: 'Same state after' }, result: 'Intact' },
];

export const elements = [
  { kind: 'button', title: 'Button', description: 'Primary action gets solid ink, never brand orange. One per screen.' },
  { kind: 'input', title: 'Input', description: 'Typing, generating, error — every stage visible to the user.' },
  { kind: 'status', title: 'AI Label', description: 'AI-assisted content is identifiable. Approved and pending never look the same.' },
  { kind: 'tokens', title: 'Semantic Tokens', description: 'Don\'t hardcode hex values. Use variables. Change once, update everywhere.' },
  { kind: 'tabs', title: 'Tabs', description: 'Diagnosis, design system, and visual QA share one navigation. No duplicates.' },
  { kind: 'progress', title: 'Step Indicator', description: 'Where you are, what\'s blocking, what comes next — visible at a glance.' },
  { kind: 'empty', title: 'Empty State', description: 'When there\'s nothing to show, tell users what to do. An icon alone isn\'t enough.' },
  { kind: 'dialog', title: 'Confirm Dialog', description: 'Destructive actions explain consequences and offer a way back.' },
  { kind: 'card', title: 'Content Card', description: 'Title, status, evidence, action — one card tells one story.' },
];

export const steps = [
  ['01', 'Connect', 'Give me a repo URL and a running preview.'],
  ['02', 'Capture', 'I screenshot your pages — desktop and mobile.'],
  ['03', 'Review', 'You pick which problem matters most. I handle the rest.'],
];

export const ui = {
  scrollNote: 'SCROLL',
  githubLink: 'GitHub ↗',
  footer: { left: 'CREATIVE OS · PRODUCT DESIGNER', middle: 'Evidence before claims', right: 'View source ↗' },
};
