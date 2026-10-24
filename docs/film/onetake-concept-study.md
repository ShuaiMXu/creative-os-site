# HappyHands — OneTake concept study

Status: three concept boards for selection. Not an approved storyboard or a rendered film.

## Source and use

Applied the complete upstream [OneTake skill](https://github.com/feitangyuan/onetake/blob/main/SKILL.md), pinned to `013a61ac8d98883c73733f59c06e49e9ba444f14`. The full upstream checkout remains intact in the adjacent `onetake-reference` study directory; no upstream skill content was shortened or replaced. This site change adds an original concept comparison, not a copy of the video engine.

OneTake uses PolyForm Noncommercial 1.0.0. The user explicitly confirmed this film is a personal, noncommercial project showcase on 2026-10-22. This confirmation is not permission for later commercial use.

Required Notice: Copyright (c) 2026 Patrick. onetake is free for noncommercial use only.

Read the full skill, reference-deconstruction, product-demo and rhythm guidance, and the skill-demo, one-dot and clearing case notes. The protocol requires: “Show the three and let the user pick.” Concept choice precedes the detailed beat sheet and video production.

## Reference study

Decoded the local upstream `skill-demo` and `clearing` reference films with PyAV. Sampled grayscale 320×180 frames at 12 fps and applied upstream `analyze_ref.py` energy/statistics functions. Contact sheets were sampled at 2 fps and inspected locally. Reference films and their frames are not redistributed by this site.

| Reference  | Duration | Approximate still-frame share | Longest quiet span |
| ---------- | -------- | ----------------------------- | ------------------ |
| skill-demo | 15 s     | 56.1%                         | 2.58 s             |
| clearing   | 15 s     | 31.1%                         | 4.17 s             |

These are sampling-dependent energy measurements, not perceptual or continuity scores. Energy-threshold “cuts” can be fast zooms rather than actual edits. Optical flow, blur t80, audio and the continuity oracle were not measured. The samples show why readable holds belong in the film; they do not establish a universal timing recipe.

The useful mechanism is an enduring subject: a selected chip becomes a working input, or one calendar position connects nested views. Motion should follow a visible action and pause when the viewer needs to read.

## Three central ideas

### A — Follow the selection (recommended)

Hook: a cursor selects the full page, then focuses on one region.

Carry: the same selection becomes a component boundary, a source highlight and the comparison seam. The cursor visibly causes each transition. The complete page remains the spatial reference.

Look: chalk canvas, graphite text, restrained emerald selection. Familiar design-editor chrome establishes context and recedes for readable close-ups. Official HappyHands logo; Instrument Sans for the tool and Instrument Serif for the fictional demo heading.

Excludes: separate slide-like screen replacements, fake issue totals, invented QA outcomes and automatic acceptance.

This is the best fit for explaining HappyHands' actual review → scope approval → edit → verification workflow. Detailed findings and source must come from a real matched run before production.

### B — Dive through scale

Hook: begin inside a letterform and pull back through typography, component and complete page.

Carry: one page coordinate anchors the camera. Each close-up returns through the same location.

Look: ink canvas, bone-white type, quiet citrus focus. Distinct moves separated by genuinely still reading holds.

Excludes: constant drifting, tiny UI fly-throughs and arbitrary zooms. The production must still show whole-page and interaction review, rather than reducing the product to typography inspection.

### C — Turn the page inside out

Hook: a selected control reveals the source on the reverse side of the same surface.

Carry: the same page plane and region remain recognizable through page/source/comparison.

Look: cool-gray canvas, white page, restrained blue source highlight and a shallow fold.

Excludes: disconnected before/code/after screens and any suggestion that approval automatically pushes, merges or deploys code. The source in this concept board is illustrative pseudocode, not an actual diff.

## Capability and visual boundaries

The editor is a film art-direction concept inspired by familiar design tools. It is not a shipped HappyHands editor redesign or a Figma plugin/integration. Northstar is a fictional demo surface. The boards assert no live run, diagnosed problem, executed edit, QA verdict or acceptance result.

The eventual film should demonstrate existing HappyHands capabilities using supported outputs: webpage and local repository/design-source connection; full-page and declared interaction review; design-system and component inspection; explicit approval and scoped editing; exact source changes; matched before/after evidence; independent review and a human final decision in the same result record. Do not invent operational success in the mockup.

All visible board copy is English. The official logo is reused unchanged. No local hosts, private paths, fake scores or runtime claims appear in the canvas. No existing skill files are modified.

## Review and next gate

Comparison page: `/film/onetake-concepts/index.html`; hash routes `#a`, `#b`, `#c` select each concept. Static PNGs sit alongside it for cloud review without a running workbench.

Verified all three selectors in the browser at the normal 1280 px desktop viewport. Checked the 390×844 phone layout: document width equals viewport width, controls stack and explanatory copy remains readable; the 16:9 board is a thumbnail overview. Viewport reset afterward. Browser console reported no errors. Selection outlines were corrected to attach to the actual control rather than spanning unrelated content.

After concept approval: prepare a 60–90 s beat sheet, provisionally around 75 s, with time, beat, motion, stillness and carry. Set final timing after narration measurement. Then present keyframes and readable operation close-ups for approval before rendering a complete film. Concept boards alone cannot validate temporal continuity or final video legibility.

Local validation on 2026-10-22: typecheck and production build passed. Existing build warnings about generated UI assets and dependency directives remain outside this static-page change. Independent Codex review against `fe9f43c` reported no clear correctness or regression issues. This does not approve the artistic direction or temporal continuity; those still require concept selection and an actual cut.
