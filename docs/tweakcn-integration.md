# tweakcn source integration

Implemented 2026-09-28 against upstream `a3b47b37cba97dd637de517aab52c45ec0f83456`.
This is an adapted editor-core integration in the HappyHands Vite application, not an iframe of tweakcn.com or a fork of its SaaS backend.

## Included

- 42 upstream presets plus neutral and HappyHands; 44 variables in each theme mode.
- All semantic colors, charts/sidebar colors, three font slots, radius, spacing, tracking and shadow controls. Text controls accept CSS color syntax; dimension sliders and native color pickers support continuous edits.
- HSL adjustments, undo/redo with 500ms grouping and a 30-entry bound, adjustable desktop panel, mobile edit/preview tabs.
- Project-specific local persistence, legacy draft migration, revision conflict detection and JSON backup.
- Component, dashboard, marketing, mail and typography previews, viewport controls, fullscreen, baseline comparison and explicit semantic-token inspection.
- AST-based CSS import. Unsupported variables, aliases, scopes and conditionals are reported before application. Original pasted input remains available in the import panel during the session.
- CSS variables, Tailwind 3 CSS/config, Tailwind 4 CSS, shadcn registry and draft JSON exports. Alpha is retained by RGB framework exports. Exports do not mutate drafts.
- Controlled-page live preview with explicit origin/source checks, protocol/nonce handshake and timeout handling.
- Contrast checks for selected semantic pairs; translucent pairs are flagged for actual-background review. This is not an Experience Score or full accessibility certification.
- Foundation proposal export, existing Foundation import, explicit reviewer/reason/confirmation, version validation, and complete approval snapshot export.

## Local use

```sh
npm install
npm run dev
```

Open `http://127.0.0.1:4173/apps/studio/?project=my-product`.

Pick a preset or import theme CSS. Edit both modes and preview the relevant component states. Use the review panel to inspect changes. For an established project, import its existing Foundation approval first so its brand, components and patterns remain present. A new project without an import produces an explicitly token-only Foundation.

Approve and download `foundation-approval.json`, then in the creative-os checkout:

```sh
pnpm harness foundation-approve --run PATH_TO_NEW_BOOTSTRAP_RUN --input PATH_TO_DOWNLOADED_FILE
```

This records the version in a new bootstrap run before planning. It does not replace existing recorded approvals, perform a code change, or claim a verified UX improvement. The Harness subsequently controls execution, rendering and review.

## Real-page preview

The bundled `/studio-preview.html` demonstrates the bridge in an independent document. For your own controlled development page, copy `public/happyhands-preview.js` into that project and add:

```html
<script src="/happyhands-preview.js"
        data-studio-origin="http://127.0.0.1:4173"></script>
```

Configure the actual Studio origin, including port. Select Connected page and enter the preview URL. The target must use compatible CSS variables and allow embedding. An unrelated URL, restrictive frame policy or absent bridge will show a connection failure rather than imply it received the theme. Tokens do not rewrite an arbitrary site's stylesheet.

## Verification

```sh
npm run typecheck
npm run test:studio
npm run build
npm run test:studio:browser
npm run test:studio:harness
```

- Core/bridge tests exercise every preset, mode isolation, history branching, CSS import diagnostics, alpha/round-trip export, immutable operations, stale draft protection, Foundation validation and actual Tailwind 3/4 compilation.
- Browser smoke uses a separate headless Edge instance and the dev server. It tests editing, undo/redo, refresh, import warnings, download, five scenes, comparison, token inspector, iframe application, approval export and a 390px viewport. No JavaScript page errors observed. Screenshots go to ignored `test-results/`.
- Set `STUDIO_URL` and `BROWSER_CHANNEL` for another test server/browser installation.
- Harness integration uses the actual `createRun`, `saveFoundationApproval`, Experience Spec validator and bootstrap brief serializer from sibling `../creative-os` (override with `HARNESS_ROOT`). It creates an isolated temporary run; no product run or source file is changed. Verified preservation of existing brand and components and both mode names in the agent brief.

## Explicit boundaries

Cloud accounts, sharing/community, upstream AI generation, subscriptions, Figma/shadcncraft assets and arbitrary website rewriting are not included. The five preview scenes and inspector UI are HappyHands implementations, not verbatim upstream screen copies. Saving and approval are local; do not market them as hosted multi-user approval or automatic repository deployment.

The source inventory and license live in `packages/theme-core/vendor/NOTICE.md` and `LICENSE`. Use the deep research document for the architecture decision; this file supersedes its earlier prototype-status section.
