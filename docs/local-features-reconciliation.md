# Local feature reconciliation — 2026-10-23

Base: main 314c5d1 (PRs #31 and #32). Only missing functionality was reapplied from local backup 07ad0a8.

- Studio preset selection immediately updates both themes. Undo/redo and customized values determine the displayed preset. Existing project creation and exports remain in place.
- Four additional theme-bound component groups cover lists/filtering, switches/progress, notices and confirmation dialogs. Together with the two existing groups, six are available.
- Kage defaults to an unfiltered bounded request (24 maximum, not the complete upstream catalog). Topic search, retry and return focus remain. Detail views expose full-page images, original analysis and section images; remote URL sanitization and direct/wrapped response compatibility remain.
- Existing HappyHands, Quartz and Lime covers, navigation, component directories and adoption instructions remain. Additional scenes offer search/selection and form validation. Quartz and Lime provide searchable light/dark token specimens. These are local illustrative scenes, not installed upstream components or live project data.
- The current homepage and component-gallery implementation are untouched. No package or lockfile changes are needed. The original local backup is retained.

Validation: TypeScript and production build; 18 Studio core tests; Kage normalization and wrapped response tests; actual Kage 24-result response and Linear detail with 12 sections; browser flows for immediate presets, undo/redo, sample controls, three system scenes, token search and Kage detail/image dialogs at phone/tablet/desktop sizes.

Not deployed or merged. Screenshot evidence is in local test-results/.
