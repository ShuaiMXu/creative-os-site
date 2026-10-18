# Component catalog and integration contract

## Multiple providers

`public/components/providers.json` is the provider manifest. Provider IDs namespace each source; its own catalog retains its source-specific contract. The UI distinguishes installable source registries from design references, rather than flattening screenshots into component packages. Cult UI has local previews; Kage now supports on-demand screenshot search through `/api/kage`, with a six-result limit and no bulk mirroring. The server initializes a new MCP session for each search and carries its session header into the tool call. The earlier 404 was caused by missing session state. Results are not persisted; images are loaded from the upstream URLs, with source attribution. Browser requests contain only the user-entered search phrase, not project data. Vite development/preview and Vercel use the same handler.

Kage terms prohibit bulk scraping or mirroring. Use its official MCP on demand, keep reference provenance, and distinguish reusable analysis from third-party screenshots and branding. Future providers must declare type, status, license/terms, connection method and automatic-use policy before appearing. Preview counts include only locally runnable examples; adding a provider does not imply Harness integration or project approval.

The `/components/` route displays the pinned Cult UI registry, with searchable categories and explicit source/preview/alias states. The site shell uses HappyHands tokens and shared navigation. It does not change the target product's design system.

## Source and ownership

- Upstream: `https://github.com/nolly-studio/cult-ui`.
- Fixed revision: `7f031dc812f7bda10213bab62752dd6d080297ff`.
- 154 UI registry entries, including 17 legacy aliases; 153 example registry entries.
- All original JSON snapshots are in `vendor/cult-ui/upstream`, with SHA-256 checksums and MIT licensing. Builds fail if a pinned file changes.
- `scripts/sync-cult-registry.mjs` is a manual maintenance action, not part of development or production startup. Updating the revision requires reviewing source, dependencies and licensing again.
- Public source downloads preserve exact snapshot bytes; `sourceSha256` refers to the downloaded JSON, not a transformed preview module.

## Real previews

The initial catalog runs 77 source-based examples. Components requiring additional frameworks, shaders, fonts, media or host services retain their source entries and list their setup requirements. A compatible import graph is only a build eligibility check, not a security or accessibility certification.

Preview generation resolves explicit local imports and an allowed set of installed packages. It transpiles the pinned TSX and generates a statically analyzable lazy loader per example. Production runtime does not fetch or evaluate arbitrary remote code. Only the selected example is mounted; Stop Preview unmounts its document. Error boundaries show load/render failures.

Each example runs in a separate iframe document with its own Tailwind CSS. It cannot apply styles to the HappyHands shell. The iframe is not claimed as a security boundary against malicious same-origin code; only pinned reviewed sources belong here. CSP blocks external services/media, forms do not submit, and outbound example links are inert. Previews do not expose a bridge into Harness or target repositories.

Explicit preview adaptations:

1. Rewrite imports to generated local modules; remove TypeScript syntax.
2. Replace illustrative images/avatars with our authored `sample.svg`. Device frame assets are not substituted: the Mac Screen entry stays source-only.
3. Supply standard system sans-serif font fallbacks; pixel-font examples stay source-only until matching font assets are configured.
4. Compile upstream theme/utilities inside the preview only, omitting the unused dither import. Preserve component layout, source sample copy and interaction logic.
5. Start with reduced-motion controls and offer an explicit stop action. This does not guarantee that every upstream JS timer follows reduced-motion preferences; target integration must review that behavior.
6. Adapt the named `TerminalAnimationDemo` export to the gallery loader's default-export contract.

Original sources shown in the Source tab remain unchanged. Do not label these examples as HappyHands-approved components, fully accessible implementations, production-ready workflows or fully working services. Original English sample copy is labeled as upstream content even in the Chinese shell.

## Harness consumption

`/components/cult-ui/catalog.json` follows `components/catalog.schema.json`. Each entry contains:

- Stable ID/category and alias target.
- Fixed source revision, same-site source URL, SHA-256 and license.
- Upstream-declared npm and registry dependencies (not a guarantee that upstream declarations cover every imported dependency).
- Preview availability and specific limitations.
- `integration.status: candidate`, `approval: required`, `automaticUse: false`, plus required checks.

The registry is ready for a consumer to read. Automatic selection/installation by the core Harness is **not connected** by this website change. Copy Guidance supplies the exact source and constraints to a project agent. Raw upstream registry JSON is a source snapshot, not a promise of a one-command local installer: nested registry dependencies must be resolved and pinned before installation.

Before applying a component to a project, the consuming agent must read its design rules, resolve imports and dependencies, map semantic tokens/states, confirm scope, and validate keyboard, touch, reduced motion, themes, responsive layout and business behavior. Keep target-project evidence and approval separate from gallery rendering checks.

## Maintenance and validation

- `npm run catalog:build`: offline source-integrity verification, catalog and preview generation.
- `npm run test:components`: schema, alias and published-source integrity checks.
- `npm run test:components:browser`: all advertised previews, then search/filter/source/integration flows across viewport/theme/language combinations. `SITE_URL` selects the preview origin.
- `npm run typecheck` and `npm run build` generate the catalog first.
- Generated preview modules/CSS and public JSON downloads are ignored by Git and recreated from the checked-in source snapshots. Authored `sample.svg` and preview runtime stay in source control.

This change has not been deployed or automatically approved for target projects.

## Preview repairs

Pinned Slider and Textarea support modules plus Radix dependencies enable bg-image-texture, toolbar-expandable and wizard-expandable. Five original texture assets are vendored and hashed. Only the reviewed texture demo is exempted from the generic host-API detector: its fetch downloads local textures, not a third-party service. Its blob download is allowed in the preview; other demo navigation remains inert. Remaining source-only entries still require separate framework/media/service integration and are not claimed as working previews.

Additional pinned Checkbox, Avatar, Tooltip, Select and Switch modules enable rolling-number, sortable-list, expandable, mock-browser-window and halo-toast with Sonner. Expandable demo product imagery is replaced by the documented local sample illustration; upstream source remains unchanged.
