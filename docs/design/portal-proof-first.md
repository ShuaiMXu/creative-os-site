# Portal: evidence before explanation

Audience: independent developers with a working interface who need help deciding what to fix, applying their own design rules and reviewing the result.

Subject inventory: HappyHands official hand logo; local Web Alpha; project repository handoff; DESIGN.md; style tokens; existing component code; explicit scope approval; isolated edits; matched page/device/state screenshots; independent review and a distinct human decision; HappyClaw command-scroll case; original evidence retained.

Argument / copy deck:
- 把页面问题，改到位。 / Review your UI. Verify the change. → the real workbench, with an interactive selector between page evidence and a diagnostic report.
- 看清每一处变化 / See the exact change → the actual HappyClaw command-scroll before/after at 390×844. Keep long commands on one line; add the scroll hint. Scope and pending human acceptance remain explicit.
- 从发现到复核 / From finding to decision → four concrete steps, each with its output; avoid promising fully autonomous work.
- 沿用你的设计规范 / Keep your design system → DESIGN.md, tokens and component sources; retain links to HappyHands, Quartz, Cult UI, Kage, Refero and Theme Studio.
- 从你的项目开始 / Start with your project → one local handoff form; full setup prompt, prerequisites, FAQ and same-record link remain within this section.

Idea: on this page, HappyHands' retained page evidence becomes the product demonstration. The live thing is a viewer of real workbench captures and a before/after toggle with a no-script pair fallback.

Taste direction: product-performs, seed 1303294650. Brand palette/type retained. Redraw hero because variable-font controls do not belong to this product; replacement is Sentence split by a frame. Proof changed from logos on tiles to plain columns because no customer endorsements exist (the content is a resource list). CTA changed to First step already open because local repository/task/design-source fields cannot be reduced to a one-field sentence. The existing handoff is kept intact. No decorative architecture images or invented product outputs.

The pinned workflow blueprint is adapted to an ordinary reading flow with concrete outputs because these are real historical screenshots, not executable stages of a live run. No scroll-locked simulation of successful edits. Browser verification uses the available browser controller in place of the skill's external browser automation scripts; do not claim an inspect.mjs score.

Skill files are not modified. Existing brand token values remain canonical. All source images are copied unchanged and their provenance is recorded in public/portal-evidence/provenance.json.


## Verification — 2026-10-22

- Website base: d3adc94. Core checkout synchronized to 479f13c; the existing portal handoff contract test passes against this core version.
- Local routing and handoff tests: 2/2 passed. TypeScript check and production build passed. Taste source lint: 0 failures, 0 warnings.
- Browser inspection: 1440×1000 desktop, 768×1024 tablet, 390×844 phone; light/dark and Chinese/English. No horizontal page overflow at these widths. Images loaded; no browser console errors in the final session.
- Verified viewer selection, mobile before/after selection, collapsed navigation, keyboard validation of an empty handoff, project/task/design-source URL generation, language-switch field retention, and full Codex/Claude setup prompt selection.
- Independent Codex review against d3adc94: no definite actionable regressions found. This is a code review, not a substitute for the user's visual approval.
- Full-page and first-screen captures are in public/portal-preview. Historical screenshots are labeled with their original dates and do not claim a new execution or completed human acceptance.
- This presentation change did not execute a new repository modification run. Existing handoff behavior and same-record linkage are preserved; contract compatibility was rechecked after synchronizing core.

## Visual critique and remaining boundary

The product is now visible before explanation; the case names the exact scope and retained constraint. Typography, whitespace and section rhythm have been checked on desktop and phone. Mobile uses a single selected comparison image, while desktop shows both. The historical workbench is still visually dense; it is an honest product capture, with a link to the unaltered original, rather than a fabricated simplified interface. The report selector is a preview of another explicitly dated record. User visual acceptance and merge remain pending.


## Synced-main review — 2026-10-23

Base: e056557 (design-system showcase PR #30); merged locally in 9b2c625. Found and fixed a semantic merge omission: the redesigned resource index did not link to the new Lime system. Added its Chinese/English entry and navigated from the phone menu through the resource link to the real Lime catalog.

Rechecked full-page screenshots at 1440×1000, 768×1024 and 390×844; page widths match the viewport without horizontal overflow. Checked phone menu open/close on section selection, before/after selection, report selection, empty handoff keyboard validation, repository/task/three design-source paths encoded in the loopback URL, and draft retention during language changes. Full Codex and Claude setup prompts retain approval and complete-Skills requirements. English phone headings remain within two lines; dark theme remains readable. Browser error log was empty. Updated public/portal-preview captures show this revision, not the previous build.

Build, typecheck, routing/handoff 2/2 tests and source lint (0 FAIL / 0 WARN) passed. Independent Codex review against e056557 found no definite actionable regressions. Browser inspection used the supported in-app browser controller; inspect.mjs was not run and no inspector score is claimed. No new project execution or human acceptance is implied by these presentation checks. Skill sources remain unchanged.

ROUND 2
Seen in one second: a large promise paired with the real HappyHands workbench.
Idea (one sentence): retained HappyHands review evidence becomes the product demonstration.
Live thing: real page/report selection and matched before/after selection.
Layout words by section: hero=split-and-frame / case=paired-evidence / workflow=sequence / sources=definition-and-index / connect=form / footer=close.
Scores: design 7 · usability 8 · creativity 7 · content 8 → overall 7.4.
Caps applied: creativity capped at 7 for a familiar product-evidence approach; restrained motion does not earn a higher design score.
Top three problems (most visible first), each with the screenshot it shows in and the fix:
1. The synced resource catalog was missing Lime in the old index; corrected in desktop-page.png and mobile-page.png.
2. Historical workbench captures remain dense at reduced width (tablet-page.png); originals are available for inspection. This is an honest preview, not a replacement for using the workbench.
3. The phone workflow is a long reading sequence (mobile-page.png); it remains fully visible and grouped by output, with installation details collapsed. Further visual changes await user feedback rather than removing useful content.

Visual approval is pending. Do not merge PR #29 until the user confirms.
