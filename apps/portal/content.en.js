// English copy — plain, direct, the way a designer would actually pitch this
export const hero = {
  eyebrow: ['17 bounded skills', '10 contract-only', 'local-first'],
  h1: 'Make what AI builds\nworth ',
  h1Accent: 'showing',
  h1Suffix: '.',
  copy: 'Automated design review of live pages: find the issue that hurts your users most, fix it, screenshot the difference, you decide.',
  cta: 'Explore capabilities',
  ctaSecondary: 'View a real review',
};

export const sections = {
  apps: {
    kicker: '01 / APPS',
    title: 'After the build',
    copy: 'Three things: review what exists, clean up scattered styles, and check only what changed after each edit.',
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
  { index: '01', state: 'AVAILABLE', title: 'Review a live product', description: 'Look at your pages, not your docs. Which button users can\'t find, which copy they don\'t understand — a screenshot tells you.', meta: ['SOURCE + RENDER', 'HAPPYCLAW CASE'], action: 'See a review' },
  { index: '02', state: 'IN PROGRESS', title: 'Clean up the design system', description: 'Colors and spacing scattered across the codebase, and nobody can say which one is right. We pull it into one maintainable system.', meta: ['TOKENS', 'COMPONENTS', 'BRAND'], action: 'Track progress' },
  { index: '03', state: 'PLANNED', title: 'Check only what changed', description: 'Git knows which files moved. We only re-review those pages, not the whole site every time.', meta: ['GIT DIFF', 'INCREMENTAL'], action: 'View roadmap' },
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
