// English copy — plain, direct, no jargon
export const hero = {
  eyebrow: ['17 bounded skills', '10 contract-only', 'local-first'],
  h1: 'Your app works.\nMake it feel ',
  h1Accent: 'designed',
  h1Suffix: '.',
  copy: 'Identify the experience problem that matters most, execute a verified change, and compare the result with same-state screenshots.',
  cta: 'Explore capabilities',
  ctaSecondary: 'View a real review',
};

export const sections = {
  apps: {
    kicker: '01 / APPS',
    title: 'Design work after the first build',
    copy: 'Review existing products, extract design systems, and run incremental checks after code changes.',
    link: 'View source on GitHub ↗',
  },
  explore: {
    kicker: '02 / DESIGN SYSTEMS',
    title: 'Build the system before the page',
    copy: 'Our design system and project archives from completed review loops.',
  },
  screens: {
    kicker: '03 / SCREENS',
    title: 'Same state, before and after',
    copy: 'Every screenshot maps to a reproducible page state and viewport.',
    link: 'Open the full review ↗',
  },
  elements: {
    kicker: '04 / UI ELEMENTS',
    title: 'Components ready for production',
    copy: 'Each component documents its use cases, state definitions, and boundaries.',
  },
  getStarted: {
    kicker: '05 / GET STARTED',
    title: 'Connect one real product',
    titleLine2: 'Complete a full design loop',
    copy: 'Runs locally, no signup required. One command, first review in five minutes.',
    quickstartLabel: 'QUICKSTART',
    quickstartTitle: 'Five-minute local proof',
    copyBtn: 'Copy command',
  },
};

export const apps = [
  { index: '01', state: 'AVAILABLE', title: 'Review an existing app', description: 'Start from real pages, not spec documents. A running app is the best evidence you\'ll get.', meta: ['SOURCE + RENDER', 'HAPPYCLAW CASE'], action: 'See a real review' },
  { index: '02', state: 'IN PROGRESS', title: 'Pull scattered styles into a system', description: 'Colors and spacing scattered across the codebase, and nobody can say which one is right. We sort that out.', meta: ['TOKENS', 'COMPONENTS', 'BRAND'], action: 'Track this work' },
  { index: '03', state: 'PLANNED', title: 'After a code change, only check what broke', description: 'No full-site rechecks every time. Git tells us which files changed; we only look at those pages.', meta: ['GIT DIFF', 'INCREMENTAL'], action: 'View roadmap' },
];

export const systems = [
  { tag: 'SYSTEM / 01', title: 'HappyHands Design System', description: 'Dark surfaces, one warm accent used sparingly. Nothing flashy, everything deliberate.', values: ['#111111', '#F7F6F3', '#F57F28', '#96918A'], traits: ['Professional', 'Calm', 'Friendly'], link: 'View system ↗' },
  { tag: 'CASE / 02', title: 'HappyClaw', description: 'The first real project to complete the full loop. What changed, what it looked like before and after, what the verdict was — all here.', values: ['BEFORE', 'AFTER', 'VERDICT'], traits: ['Web', 'Review', 'Evidence'], link: 'View case ↗' },
  { tag: 'STUDY / 03', title: 'Firefly UI Kit', description: 'System first, pages second. Want to know if that path works? Look at this.', values: ['TOKENS', 'STATES', 'PATTERNS'], traits: ['System-first', 'Archive'], link: 'View study ↗' },
  { tag: 'TEMPLATE / 04', title: 'SaaS Product Foundation', description: 'Base kit for dashboards and workbenches. Sidebar, tables, forms, empty states — ready to use.', values: ['SHELL', 'DATA', 'FORMS'], traits: ['SaaS', 'Desktop', 'Template'], link: 'View template ↗' },
  { tag: 'TEMPLATE / 05', title: 'Consumer App Foundation', description: 'Presets for mobile products. Navigation, content cards, paywalls — the core scenarios.', values: ['NAV', 'CONTENT', 'PAYWALL'], traits: ['Mobile', 'Consumer', 'Template'], link: 'View template ↗' },
  { tag: 'TRACK / 06', title: 'SwiftUI Foundation', description: 'The native app path isn\'t proven yet. Noted, not promised.', values: ['COLOR', 'TYPE', 'MOTION'], traits: ['SwiftUI', 'Planned'], link: 'View plan ↗' },
];

export const screenPairs = [
  { title: 'Homepage · Desktop', task: 'Information hierarchy', beforeLabel: 'BEFORE', afterLabel: 'AFTER', before: { src: '/runs/06dabc2c/before/desktop.png', caption: 'Homepage before the change' }, after: { src: '/runs/06dabc2c/after/desktop.png', caption: 'Same viewport after' }, result: 'Aligned' },
  { title: 'Homepage · Mobile', task: 'Task continuity', beforeLabel: 'BEFORE', afterLabel: 'AFTER', before: { src: '/runs/06dabc2c/before/mobile.png', caption: 'Mobile baseline' }, after: { src: '/runs/06dabc2c/after/mobile.png', caption: 'Same state after' }, result: 'Path intact' },
];

export const elements = [
  { kind: 'button', title: 'Button', description: 'Primary action gets solid ink, never brand orange. One per screen.' },
  { kind: 'input', title: 'Prompt Box', description: 'Typing, generating, error — every stage visible.' },
  { kind: 'status', title: 'AI Label & Badge', description: 'AI-assisted content is identifiable. Approved vs pending is clear.' },
  { kind: 'tokens', title: 'Semantic Tokens', description: 'Don\'t hardcode hex values. Use variables. Change once, update everywhere.' },
  { kind: 'tabs', title: 'Tabs', description: 'Diagnosis, design system, and visual QA share one navigation. No reinvention.' },
  { kind: 'progress', title: 'Agent Step', description: 'Where you are, what\'s blocking, what to do next — visible at a glance.' },
  { kind: 'empty', title: 'Empty State', description: 'When there\'s nothing to show, tell the user what to do. Don\'t just put up an icon.' },
  { kind: 'dialog', title: 'Confirm Dialog', description: 'Destructive actions explain consequences and offer a way back.' },
  { kind: 'card', title: 'Content Card', description: 'Title, status, evidence, action — one card, one story.' },
];

export const steps = [
  ['01', 'Connect', 'Give me a repo URL and a running preview.'],
  ['02', 'Capture', 'I screenshot your pages, desktop and mobile.'],
  ['03', 'Review', 'You confirm which problem matters most. I handle the rest.'],
];

export const ui = {
  scrollNote: 'SCROLL TO EXPLORE',
  githubLink: 'GitHub ↗',
  footer: { left: 'CREATIVE OS · PRODUCT DESIGNER', middle: 'Evidence before claims', right: 'View source ↗' },
};
