# PR31 preview review — 2026-10-23

## Scope
Preserve production Hero from e056557: copy, CTA, real screenshot whirl and scroll treatment. Remove the later illustrative Hero demo. Keep the other PR31 navigation, setup presets and resource-directory changes. Restore existing homepage resource illustrations.

Add illustrated HappyHands, Quartz and Lime selectors to the design-system directory. These locally authored SVGs are decorative illustrations, not screenshots of upstream components. Native links, modifier clicks, history and complete embedded system documents remain intact. Desktop uses three columns; phone uses compact image/text rows.

## Verification
- Typecheck and production build passed.
- Handoff, portal routing and Kage API tests: 4 passed.
- CUA visual checks: 1440×1000 desktop and 390×844 phone; production Hero, homepage resource cards and directory cards.
- All three directory images loaded; no document-level horizontal overflow at those sizes.
- Quartz click and Lime Enter-key activation updated the selected state and corresponding embedded document.
- English/dark phone layout checked.
- Independent Codex review of changes against d87e31d: no clear functional regressions. Earlier review found reduced-motion inline Hero styles; reset now clears those styles and responds to preference changes.
- Browser regression source updated; standalone browser scripts were not executed. Actual browser verification used CUA.
- Full skill sources were not edited or shortened.

## Release boundary
PR preview only. Await user visual approval before merging. Local screenshots are under public/pr31-preview. Production is unchanged.
