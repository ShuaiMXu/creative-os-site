# HappyHands design-language alignment

Source: user-supplied HappyHands brand/design-system package (`design-system/tokens.css`, `tokens.json`, README, Button specification and evaluator rules), reviewed 2026-09-28. The user's explicit instruction to use PingFang-first sans-serif for Chinese and English overrides the package's serif display-heading recommendation. No bundled font files are redistributed.

## Shared foundation

`packages/design-tokens/happyhands.json` is the canonical light/dark shell palette, spacing, radius and font data. Run `node scripts/brand-tokens.mjs` after changing it; the generated CSS uses `--hh-*` names to avoid colliding with edited project variables. Portal aliases and Studio consume the same values. Appearance preference uses the existing `hh-theme` key; shell appearance is independent of the project preview mode.

The HappyHands project preset now uses ink/near-white primary actions, warm neutral backgrounds, brand-specified chart colors, 10px radius and no card shadow. Existing drafts are not silently replaced. Apply the updated preset or the Standards panel action; changes remain undoable and require normal Foundation approval.

## Added beyond theme editing

- Shared Button primitive with primary/secondary/ghost/danger variants, disabled/loading semantics and reduced-motion behavior. Studio uses one primary action at a time.
- Design standards panel: optional HappyHands profile or generic readability checks; both modes checked; results point to rules rather than producing a synthetic Experience Score. Checks flag contrast, non-neutral primary actions, missing PingFang fallback and card shadow deviation. Export includes the examined theme and leaves manual review pending.
- Component-state preview: empty, loading/cancel, error/retry, disabled with reason, completed/restart, keyboard focus. These are demonstrative states, not assertions about target application behavior.
- Imported Foundation brand/component counts are visible. Logo correctness, actual page hierarchy, brand-color area and real task behavior remain manual checks; source extraction and target-page state coverage cannot be inferred from token values.

## Validation

Core tests cover correct brand defaults and drift detection without mutation. Browser checks cover brand assets, standards/application, single primary action, state transitions, independent shell/preview modes, persisted appearance and 390px layout. Existing export/Harness tests remain in place. Product copy distinguishes local checks from verified application results.
