# TODO — Creative OS website

> Updated 2026-09-27 after the content-portal rebuild.

## Current structure

- **Apps**: the three product entry points—review, foundation extraction and continuous quality.
- **Explore**: governed Design and Brand Foundations from real projects and documented studies.
- **Screens**: replayable before/after evidence exported by the Harness.
- **UI Elements**: a component-oriented view of states, semantic tokens and review patterns.
- **Get Started**: local quickstart and GitHub entry points.

The root URL redirects to `/apps/portal/`. The portal is an original static implementation. Third-party compiled bundles, brand assets, catalog screenshots and crawler scripts have been removed.

## P0 · Before public launch

- [ ] Replace the temporary geometric mark with the approved Creative OS identity and favicon.
- [ ] Confirm the public product name and domain.
- [ ] Add deployment configuration and verify all GitHub links in the deployed environment.
- [ ] Run accessibility, mobile and performance checks against the production build.

## P1 · Content system

- [ ] Add the next user-provided real cases to `apps/portal/content.js` after review.
- [ ] Export a governed foundation artifact for each project shown under Explore.
- [ ] Add component detail pages when the extraction schema and state coverage are stable.
- [ ] Add case filters only when enough real projects exist; do not populate the portal with placeholder catalog data.
- [ ] Replace the SwiftUI planned card with evidence when the native pipeline is implemented.

## P2 · Product connection

- [ ] Read release/maturity data from a generated core-repository manifest instead of maintaining counts manually.
- [ ] Publish exported run metadata through the allow-listed `public/runs/` format.
- [ ] Add a guided repository intake when the Harness has a stable remote onboarding boundary.
- [ ] Keep Experience Score hidden until its evaluator and regression cases are calibrated.

## Completed in this rebuild

- [x] Component-oriented content model (`content.js` + `components.js`).
- [x] Apps, Explore, Screens, UI Elements and Get Started navigation.
- [x] GitHub links for the core, website and referenced project repositories.
- [x] Hero rotor rebuilt with Creative OS run captures.
- [x] Real HappyClaw before/after evidence in the Screens section.
- [x] Removal of third-party application catalog, trust claims, compiled code and visual assets.
- [x] Root route points to the maintained portal.
