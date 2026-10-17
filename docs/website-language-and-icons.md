# Website language and icons

Reviewed 2026-10-18. Applies to the public portal, HappyHands and Quartz system pages, and Theme Studio. Archived experiments and the separate local workbench are outside this release.

## Writing

Follow the clarity, consistency, action labels and contextual guidance in [Apple HIG: Writing](https://developer.apple.com/design/human-interface-guidelines/writing). Keep HappyHands branding and existing warm neutral tokens.

- Explain what people can do before describing the implementation. Use “设计变量” / “design variables” in editing controls; keep exact token names in code and exported files.
- Describe the next action with a verb: copy, save, export, choose. Do not substitute “continue” for a specific action.
- Keep English in sentence case. Translate labels and placeholders together. Do not translate project names or user content.
- Keep actual CLI names, commands, adapters, file formats and agent prompt constraints accurate. Codex and Claude Code remain named in setup because they are actual supported tools.
- Preserve limits: local setup is required, unfinished services are unavailable, demonstrations are examples, and automated checks do not establish acceptance.

## Icons

Use the shared original web SVGs in `packages/ui/icons.ts`, through `Icon.tsx` in React and `iconMarkup` in the plain JavaScript portal. Geometry is shared; no icon font, external request, SF Symbols assets or Apple typeface files are bundled.

The [Apple HIG icon guidance](https://developer.apple.com/design/human-interface-guidelines/icons) informs familiar meanings and consistent optical weight. These assets are HappyHands web icons, not an Apple component package or an Apple endorsement.

- 24-unit view box, 18px rendered size, 1.65-unit stroke, rounded caps and joins, inherited foreground color.
- Use recognizable symbols only where they help: appearance, language, undo/redo, copy and navigation. Keep text labels for actions.
- Decorative icons are hidden from assistive technology; icon-only controls still need an action label. SVGs are not focus targets and do not intercept pointer events.
- Never inject user-provided markup into the icon renderer. Its names and SVG paths are static source constants.

## Verification

Check the complete homepage → catalog → HappyHands → Quartz → Theme Studio → setup flow in Chinese and English, both appearances, and at 390/768/1280px. Recheck font selection, custom values, undo/redo, saved drafts, button feedback and keyboard access when changing controls.
