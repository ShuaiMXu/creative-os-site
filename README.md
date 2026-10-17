# HappyHands

The HappyHands website for [creative-os](https://github.com/ShuaiMXu/creative-os) — the AI Product Designer harness for apps built with coding agents. The site is extracted from the main repository so the product story, design system and evidence can iterate and deploy independently.

**HappyHands 是 creative-os 的产品与内容门户。从主仓库提取，独立迭代与部署。**

```text
apps/portal/    中文门户 — Apps / Explore / Screens / UI Elements / Get Started
apps/web/       Product page — the English product page
apps/designer/  Review Workbench — reads exported harness runs
apps/studio/    Theme Studio — project themes, previews, exports and Foundation approval
packages/theme-core/  Adapted tweakcn engine, presets, import/export and project logic
packages/contracts/   Versioned drafts and Harness Foundation schema snapshot
public/runs/    Run artifacts published by `pnpm harness export` in creative-os
packages/       Shared theme/contracts/UI modules, spec validation
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
- Theme Studio: `http://127.0.0.1:4173/apps/studio/`

## Theme Studio

The local editor integrates theme configuration, built-in presets, shadow calculation
and Tailwind generation from [tweakcn](https://github.com/jnsahaj/tweakcn), pinned to
`a3b47b37`. Its HappyHands interface includes 44 presets, 44 variables per mode,
undo/redo, project drafts, five preview scenes, before/after comparison, token
inspection, controlled-page preview, CSS import and CSS/Tailwind/registry exports.

Reviewed themes can be exported as Harness-compatible Foundation approvals. Existing
brand, component and pattern records are preserved. Drafts are stored in the browser;
the editor does not automatically write repositories or connect upstream SaaS services.

See [architecture and usage](docs/studio-architecture.md),
[integration details](docs/tweakcn-integration.md), and
[source attribution](packages/theme-core/vendor/NOTICE.md).

```sh
npm run typecheck
npm run test:studio
npm run build
npm run test:studio:browser  # dev server running; Edge by default
npm run test:studio:harness # sibling ../creative-os checkout required
```

## Data flow

The Review Workbench is read-only for run data. Runs are produced in the
[creative-os](https://github.com/ShuaiMXu/creative-os) harness and published with
`pnpm harness export`, which copies an allow-list (manifest, spec, captures,
screenshots, skill results, reviews) into `public/runs/`. Nothing here edits a
run; judgments are recorded in the harness CLI.

Portal content lives in `apps/portal/content.js`; reusable render functions live
in `apps/portal/components.js`. The hero and Screens section use only exported
creative-os run captures. Product claims link back to the core repository,
issues or Workbench evidence.

## Brand foundation

The portal uses the HappyHands identity and design-system semantics: ink and
paper establish hierarchy, brand orange is reserved for a small point of
emphasis, and product actions remain neutral. Chinese and Latin copy share a
PingFang-first sans-serif stack; the portal uses no serif typeface. Studio can
preview a project's optional serif token independently. The
official dark-background logo and mark live in `public/brand/`.
