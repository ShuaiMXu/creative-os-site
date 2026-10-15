# Open-source Token Studio candidates

Research date: 2026-09-28. Repository metadata, README, package.json and tweakcn LICENSE inspected directly on GitHub.

| Candidate | License at review | Fit | Integration cost |
| --- | --- | --- | --- |
| [tweakcn](https://github.com/jnsahaj/tweakcn) | Apache-2.0 | Best first candidate for a visual shadcn/Tailwind theme editor and presets | Next.js 15 / React 19 app, not a drop-in vanilla Vite widget; isolate editor and export logic from auth, database, AI and billing |
| [shadcn-themer](https://github.com/miketromba/shadcn-themer) | MIT | Alternative with live previews, light/dark editing, CSS import/export and registry output | Next.js + Supabase + Postgres; similar extraction work |
| [Style Dictionary](https://github.com/style-dictionary/style-dictionary) | Apache-2.0 | Future token transformation/build layer | Not a visual editor; does not replace preview UI |

## Proposed integration

Use tweakcn as the leading source candidate for an isolated `/apps/token-studio/` application. Keep the current portal and Hero unchanged. First validate a pinned revision with a narrow spike: no login, no AI service, no billing; preset selection, core colors/fonts/radius, scoped component previews, light/dark editing, local draft persistence and CSS export.

Extract only reviewed dependencies. Retain upstream license and required notices, record upstream revision and modified files. Do not describe the project as an official integration or assume theme values are approved design rules.

After the editor spike, add our own JSON adapter with provenance and draft state. A later Harness integration validates the schema and records explicit Foundation approval before any generated page or scoped change consumes the tokens. A theme alone does not provide a complete Brand Foundation or component inventory.

## Acceptance for the spike

- Runs without upstream credentials and without remote writes.
- Token edits affect only the preview, not portal styling.
- Light/dark values remain distinct and survive reload.
- CSS export preserves configured values; malformed imports report errors.
- Exported Foundation proposals remain drafts; no fabricated approval.
- Source, pinned revision and license notices are included.

Research is complete; upstream code has not yet been integrated or runtime-tested. No claim of embeddable SDK compatibility is made.
