# Outcome-first resource browsing

2026-10-23. Candidate for PR #31; user confirmation is required before merge.

## Changes

The component landing page now shows actual local previews in a three-column desktop/two-column phone gallery. Search and categories operate on 137 canonical components; all 17 compatibility aliases remain directly addressable. Selecting a card opens the existing interactive preview, source and integration tabs. “Use in project” opens the existing guidance instead of introducing an installer or parallel workflow. Returning preserves the in-memory filter/page and restores focus to the selected card.

Only intersecting cards mount preview frames, with 18 entries per page. Frames are inert thumbnails with motion disabled; interactive behavior is available in detail. Original component sources and complete skills are unchanged.

Design systems open as a cover gallery; full system documents load only after selection. Reference details hide the result grid while open and restore it on close. Existing source attribution, project guidance, dependencies and limitations remain available.

## Verification

- Production build, TypeScript and nine targeted tests passed.
- CUA browser review at actual 1440x1000 and 390x844: grid, filter, empty result, clear filters, detail, integration, pagination, back navigation and phone overflow.
- Desktop first page: 18 cards, nine mounted preview frames in the observed viewport; offscreen previews are released by IntersectionObserver.
- Returning to a filtered Base Select preserves the search. Keyboard focus restoration verified on Shift Card. Mobile integration has no document horizontal overflow.
- Systems: default has three covers and no iframe; selecting Quartz loads one correct system document; returning removes it.
- Independent Codex review reported no discrete actionable regression. Its sandbox could not run generated-asset typecheck; our separate typecheck passed.
- Browser regression script updated for the new navigation. Browser checks in this session were executed through CUA, not by running that script.

## Evidence and limits

Screenshots: public/pr31-preview/gallery-desktop.png, gallery-mobile.png, gallery-detail-mobile.png. Thumbnails are cropped local source previews, not bespoke marketing artwork. External Kage availability is not asserted by local gallery checks. Full refresh does not persist local search/page state. Remote CI and cloud deployment were not independently verified; the preview remains behind Vercel authentication. No production merge performed.
