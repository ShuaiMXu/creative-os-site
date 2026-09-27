# Studio integration review — 2026-09-28

Scope: project Theme Studio, theme core/adapters, Foundation handoff and preview bridge. Reviewed input validation, persistence, asynchronous import, approval version ordering and output fidelity.

Fixed findings:
- P1: prerelease versions were numerically parsed with a suffix, producing NaN and allowing patch downgrades. Compare numeric core components exactly and allow promotion from prerelease to the corresponding stable release.
- P1: a delayed Foundation file read could complete after switching projects and use the stale target with the new revision reference. Reject imports when the active project or theme changes. Browser regression delays File.text, switches projects and verifies the target has no imported approval.
- P2: deletion in another tab could be undone by a stale save. Require a fresh revision-zero draft when no stored record exists.
- P2: Tailwind exports discarded dark-only imported spacing/tracking and omitted tracking application when the light value was zero. Preserve both modes and apply the tracking variable in both Tailwind formats.

Validation: 16 core/bridge tests pass, including Tailwind 3/4 compilation and the new regression cases; browser smoke and delayed-import regression pass; TypeScript and production build pass. Actual Harness integration passes. Build retains two pre-existing missing designer preview image warnings.

No further blocking findings identified in this scoped review. Hosted collaboration/authorization and upstream AI/payment services are outside the implementation and review scope. Remote CI was previously prevented from starting by the GitHub account billing lock; local results are not a substitute claim of remote CI success.
