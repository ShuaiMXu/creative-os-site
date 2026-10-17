# HappyHands Studio architecture

Studio is a React + TypeScript entry in the existing Vite site at `/apps/studio/`.
The Harness remains a separate Node application in creative-os.

```text
Portal → Studio project
           ├─ theme-core: upstream defaults/presets/shadows/export + adapters
           ├─ project: validation, history, browser storage, proposal/approval
           ├─ Preview: components, dashboard, marketing, mail, typography
           └─ ConnectedPreview: controlled page protocol
                    ↓
          reviewed foundation-approval.json
                    ↓
          creative-os foundation-approve → versioned run → agent brief
```

## Data ownership

- `packages/contracts/index.ts`: draft schema version 0.2 and Foundation interchange types.
- `packages/contracts/foundation.schema.json`: extracted designFoundation schema and referenced definitions from creative-os `experience.schema.json` at `0bffdb78b8ed05b231c5b53e3bcdd0891c4bc357`. Update with the producer contract and rerun the Harness integration test.
- `packages/theme-core/vendor`: pinned Apache-2.0 upstream source; dependencies on Next, database types, global DOM mutation and framework font output removed.
- `packages/theme-core/index.ts`: semantic validation, AST import, export adapters, scoped preview variables and comparisons.
- `packages/theme-core/project.ts`: per-project drafts, revision checking, bounded undo/redo, Foundation preservation and approval validation.
- `apps/studio`: HappyHands UI. Does not invoke coding agents or write repository files.

Draft storage uses `hh-studio:<project-id>`; the old single `hh-token-draft` value is read as a migration source and retained. Storage failures leave export available. Revision checking and storage events guard stale tabs; this is a local single-user store, not a transactional collaboration service.

Font, radius, spacing and shadow dimensions use shared-mode edits. Colors are mode-specific. Project CSS variables are applied only to the preview surface. Shell controls retain their own styling.

## Foundation handoff

Import an existing approval before editing an established project. Matching `theme.light.*` / `theme.dark.*` tokens populate the editor; unrelated tokens are retained without guessed mappings. An approval exports a full snapshot, preserving brand, components and patterns. Mode-qualified names keep both values visible to the current Harness text serializer. `usage` records CSS variable and selector semantics.

The current Harness accepts `foundation-approve` only for a new bootstrap run before planning, and does not permit replacement of a recorded approval. The Studio UI and docs make this limitation explicit. Existing review runs are not silently mutated.

No cloud account, payment service, model API key or upstream community API is needed for this editor. Those remain service-layer work, outside the source integration.

See [integration guide](tweakcn-integration.md) for exact commands and verification.
