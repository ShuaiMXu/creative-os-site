# HappyHands product film — V5 storyboard

Static storyboard for approval, **80 seconds / eight scenes**. Video production starts only after storyboard approval. Preview at `/film/storyboard/`; download the nine-page PDF from the page header. This isolated route changes no existing product flow, shared font rules or Skills.

## Story

| Time        | Scene                             | Actual capability represented                                  |
| ----------- | --------------------------------- | -------------------------------------------------------------- |
| 00:00–00:06 | A working product                 | Review an existing product; Northstar is fictional             |
| 00:06–00:16 | Connect the real project          | Website handoff, local project/task/design-source confirmation |
| 00:16–00:28 | Review the experience             | Captured desktop/phone evidence and planned interactions       |
| 00:28–00:40 | Use the project's design language | Source inventory and versioned Foundation approval             |
| 00:40–00:50 | Confirm one bounded change        | Confirm the issue and scope before editing                     |
| 00:50–01:02 | Turn the decision into code       | Configured agent, isolated working copy and preview            |
| 01:02–01:14 | Compare, review and decide        | Matching evidence, independent review and human decision       |
| 01:14–01:20 | Return to the same record         | Retain source, evidence, diff and review in a durable run      |

`film/storyboard/scenes.js` is the source of timing, English copy, camera directions, transitions, narration drafts and capability boundaries. Each scene links to supporting core documentation pinned at `8b1541a9488b9413f98096f8547163f7c261acda`. Northstar is solely the demonstration target. Its code, measurements and outcomes are illustrative; they are not live execution evidence. Replace illustrative UI text and claimed outcomes with deterministically typeset UI and real Harness evidence before producing the finished film.

## Identity and typography

The original `public/brand/happyhands-logo-{ink,paper}.png` is overlaid separately, with unchanged artwork/proportions. Never regenerate the logo in a scene plate.

Self-hosted Instrument Sans Regular/Bold supplies HappyHands captions and viewer controls. Instrument Serif Regular is confined to the fictional Northstar display specimen. No synthetic weights or external font requests. Raster lettering inside the generated concepts is indicative; final UI typography must be typeset from these exact font files. Both fonts include OFL notices under `public/film/storyboard/fonts/`. Upstream: [Instrument Sans](https://github.com/Instrument/instrument-sans), [Instrument Serif](https://github.com/Instrument/instrument-serif).

The approved direction uses warm ivory, ink, copper, architectural depth and continuous object-led transitions. These are shots in a continuous story rather than title slides; camera/transition notes describe the intended motion, not rendered animation.

## Reproduction and review

- Artwork prompts: `docs/film/storyboard-prompts.md`; plate checksums: `public/film/storyboard/artwork-manifest.json`. Eight optimized WebP plates total about 1.06 MB. Original generated PNGs remain outside the repository.
- Run `npm run typecheck`, `npm run test:studio`, `npm run test:components`, `npm run build`.
- Run `npm run preview -- --port 4236 --strictPort`; inspect `/film/storyboard/` in a real browser. Check all scenes, deep links, image/font loading, normal desktop and phone widths, and PDF availability.
- Rebuild PDF with `python3 scripts/export-film-storyboard.py` (Pillow and reportlab required), then rebuild the site. The PDF is committed so Vercel does not need Python.
- No video, audio, target-project modification, automatic acceptance, merge or production deployment is part of this deliverable. PR preview is for user approval.
