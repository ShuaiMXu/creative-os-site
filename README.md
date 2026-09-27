# Creative OS Site

The static website for [creative-os](https://github.com/ShuaiMXu/creative-os) — the AI Product Designer harness for apps built with coding agents. Extracted from the main repository so the site can iterate and deploy on its own.

**给 creative-os 的静态门户站。从主仓库提取，独立迭代与部署。**

```text
apps/portal/    中文门户 — Apps / Explore / Screens / UI Elements / Get Started
apps/web/       Product page — the English product page
apps/designer/  Review Workbench — reads exported harness runs
public/runs/    Run artifacts published by `pnpm harness export` in creative-os
packages/       The only backend code the pages truly need: spec validation
                (experience-core) and the Expert Loop state machine (workflow.js)
examples/       The bundled Experience Specs the workbench opens without a run
```

## Run

```sh
npm install
npm run dev
```

- Portal: `http://127.0.0.1:4173/apps/portal/`
- Product page: `http://127.0.0.1:4173/apps/web/`
- Workbench: `http://127.0.0.1:4173/apps/designer/?case=happyclaw`

## Data flow

The site is read-only for review data. Runs are produced in the
[creative-os](https://github.com/ShuaiMXu/creative-os) harness and published with
`pnpm harness export`, which copies an allow-list (manifest, spec, captures,
screenshots, skill results, reviews) into `public/runs/`. Nothing here edits a
run; judgments are recorded in the harness CLI.

Portal content lives in `apps/portal/content.js`; reusable render functions live
in `apps/portal/components.js`. The hero and Screens section use only exported
Creative OS run captures. Product claims link back to the core repository,
issues or Workbench evidence.
