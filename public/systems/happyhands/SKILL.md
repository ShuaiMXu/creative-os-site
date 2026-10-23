---
name: happyhands
description: Apply HappyHands design tokens and existing components to an explicitly selected website or workbench UI, and review its states and responsive behavior.
---

# HappyHands

Use for UI explicitly adopting HappyHands. Reviewed customer products retain their own approved Foundation. This skill does not authorize replacing their brand.

## Sources and scope

In happyhands-site, read `packages/design-tokens/happyhands.json` (canonical values), generated `happyhands.css`, `packages/ui/index.tsx`, `packages/ui/components.css`, and `docs/studio-design-language.md`. Generate CSS with `node scripts/brand-tokens.mjs` if token data changes. In other projects obtain these files from an explicitly recorded repository revision; do not assume an npm or shadcn registry exists.

The local workbench in happyhands currently uses `--ff-*` rather than `--hh-*`. Inspect its shared rules before adapting; do not silently claim the two libraries have already been unified.

Public website detail pages use `packages/ui/site-layout.css`, `system-page.css`, `SiteHeader`, `SystemBreadcrumb` and `SystemDirectory`. HappyHands and Quartz are the real consumers. Preserve the shared content grid, parent-catalog return path, language/theme preference and responsive directory. Do not import one app's page stylesheet as another app's base, or add broad `header`/`nav` rules that override the shared shell.

## Design decisions

- Warm neutral surfaces, ink primary actions, orange used sparingly for brand emphasis. Use role tokens, including light/dark pairs; no copied raw values in component styles.
- Chinese and English use the PingFang-first sans-serif stack in the tokens. Preserve readable hierarchy, ordinary sentence case and natural wrapping.
- Website copy follows `docs/website-language-and-icons.md`: explain the task in plain language, use specific verb labels, and keep implementation details in setup guidance. Translate labels and placeholders together. Use the original shared web SVGs in `packages/ui/icons.ts` through `Icon.tsx` or `iconMarkup`; preserve text labels and accessible names. Do not substitute emoji or font-dependent glyphs for controls, or bundle proprietary Apple symbols or fonts.
- Use the existing spacing/radius scale. Controls use the control radius; floating surfaces use the floating radius. Avoid decorative nested cards and shadows on every surface.
- Show one main action per task stage. Keep evidence and advanced details accessible through progressive disclosure, not deleted.
- Reuse the real Button with primary, secondary, ghost and danger variants. Loading blocks repeat submission and exposes aria-busy. Preserve accessible names and state explanations. Other form/dialog examples on the system page are native HTML examples, not published reusable components.
- Any new reusable component needs an identified real consumer, a documented API and relevant default/focus/disabled/loading/error states. Do not abstract every layout fragment.

## Implementation and verification

Inspect the current stack and consumer sites first. Migrate one agreed screen while preserving data, business behavior and approved copy. Scope styling to the selected app; do not affect embedded reviewed pages. Remove old rules only when unused.

Check normal desktop, tablet and phone layouts first; then keyboard navigation, Escape and focus return, long Chinese/English content, light/dark contrast, reduced motion, and zoom as an additional check. Verify loading, errors and empty states where applicable. Build and run relevant behavior checks. Record source revision, changed consumers, screenshots and remaining gaps. A token check or lint pass is not a visual acceptance decision.
