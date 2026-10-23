# Component previews and owned UI verification

2026-10-23. Review candidate only; user confirmation is required before merging PR #31.

## Delivered

- Completed the remaining 60 previews: 137 canonical components now have runnable local examples; 17 legacy aliases link to canonical entries. Original 154 registry JSON files remain byte-for-byte intact and hash-tested.
- Added pinned support modules, licensed local pixel fonts, framework adapters and local media. External video/tweet services are intentionally represented by local fixtures; this is not live service integration.
- Selected Base Tooltip through the component catalog, opened Integration and copied the source/version/license instructions. Adapted its original Base UI composition into the real shared SiteHeader. Keyboard focus shows the language hint; Escape dismisses it; theme/language buttons retain their behavior.
- Added the complete eleven-rule HappyHands UI profile without removing any existing skill. Core Harness stages the same complete profile for review and implementation, with hash validation.
- Owned website UI uses Radix semantic light/dark tokens, four type sizes (12/14/20/32), hairline borders, reduced decoration and concise copy. Original third-party examples, external themes and illustration typography retain their source identity. The previously approved Hero composition and spiral remain; its text and colors follow the new profile.

## Checks

- Production build and TypeScript check pass. Nine targeted site tests and 18 Studio tests pass; core Harness profile/compatibility tests: 23 pass. Core design contract and production build pass.
- Desktop runtime sweep: all 137 canonical previews load without reported render errors or broken loaded images, at 1280px. This is a loading smoke test, not comprehensive interaction/accessibility certification.
- Phone runtime sweep: all 60 added previews at confirmed 390x844, no reported render errors, broken loaded images or document horizontal overflow. Viewport dimensions are included per result in `public/pr31-preview/component-runtime-checks.json`.
- Visual checks: catalog at 1440x900 and 390x844; shell text sizes 12/14/20/32. Portal and Studio at the same sizes, no document horizontal overflow. Portal mobile heading hierarchy corrected after visual review.
- Representative interactions: Base Select changes its value; Family Drawer opens, Escape closes it and restores trigger focus; local video reaches readyState 4. Real SiteHeader tooltip opens on keyboard focus and dismisses with Escape; language and light/dark actions work.
- Independent Codex review found an invalid Hero opacity timing function (`ease-out-out`); corrected it to `ease-out` and checked the resulting computed transition. It could not run generation tests in its read-only environment; those tests were run successfully separately. Remote CI is not claimed as passed.

## Limits

Preview readiness is not automatic installation or approval for every production project. Each adoption still needs dependency, design-token and business-flow validation. The inherited Tailwind v3 compatibility-test dependency chain retains five high audit findings (braces); no patched braces release is available. This compiler is test-only and not a browser entry dependency. See the existing dependency-audit record. No production merge or deployment is authorized by these checks.

## Preview evidence

- `public/pr31-preview/components-desktop-radix.png`
- `public/pr31-preview/components-mobile-radix.png`
- `public/pr31-preview/tooltip-real-project-mobile.png`
- `public/pr31-preview/drawer-mobile.png`
- `public/pr31-preview/portal-desktop-radix.png`
- `public/pr31-preview/portal-mobile-radix.png`
