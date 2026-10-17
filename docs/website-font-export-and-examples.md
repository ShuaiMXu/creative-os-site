# Font export and interactive system examples

Implemented after the production walkthrough on 2026-10-18, based on main `3a2b109`.

## Font handoff

`apps/studio/theme-export.ts` wraps the existing serializer without changing saved drafts or Foundation contracts. CSS, Tailwind 3 CSS and Tailwind 4 CSS include deduplicated imports for library fonts selected in either mode, across body/serif/mono stacks. Imports precede theme rules, use the public HappyHands font origin even when exported locally, and carry OFL license links. Display, clipboard and download use the same output.

Tailwind config and shadcn registry remain valid in their original formats. The export panel explicitly offers a companion `fonts.css` download and tells the user to import it into their global stylesheet. Default platform stacks and unknown custom fonts are not replaced or fetched. Hosted fonts require connectivity; self-hosting requires retaining font files and licenses. This is a hosted-reference export, not an offline font archive.

## Examples and language

HappyHands now presents a working page-selection example using the shared Button and canonical brand tokens. Quartz has a file-action confirmation example, reached from its primary link and page directory. Both share `SystemExample({system, lang, dark})`, with local selection, empty/disabled, confirmed/reset, keyboard operation and an independently switchable appearance. They do not access project files or persist changes.

Quartz is an original HappyHands-authored illustration of observed palette/corner values, **not** an installed upstream component. Palette source: https://design.how/r/quartz/theme.json, checked 2026-10-18. Light ink/paper/grey channels are `20% .024 262`, `99.7% .001 250`, `95.6% .004 255`; dark channels are `96.5% .006 250`, `18.5% .016 262`, `23.5% .018 262`; control corner is 6px. Example spacing and layout are our own. No upstream component source, screenshots, proprietary fonts or additional runtime dependency was copied. Public text distinguishes this illustration from upstream API documentation.

Homepage and detail copy now explain colors, fonts and feedback directly. The hero says “让你的产品，更好用”; Studio uses “导出主题” and “界面颜色”. Exact technical format names and advanced approval semantics are retained.

## Verification

- Type checking, 18 core tests and production build passed.
- New browser regression: both examples at 390/1280px × light/dark, English, empty selection, confirmation/reset, keyboard input, independent appearance and no page overflow.
- Real CSS download was loaded into an unrelated blank page; Noto Sans SC loaded as a real font face. Companion CSS download and registry JSON checked, with translated export guidance.
- Full cross-page regression passed: homepage → HappyHands → Quartz → Studio → setup at 390/768/1280px × light/dark, including language persistence and focus return.
- Evidence is local under ignored `test-results/site-examples-export/` and `test-results/site-flow/`. Public release status is recorded by the PR and Vercel deployment.

Existing build warnings for two archived example-image references remain outside this change.
