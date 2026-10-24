# Website #22: project creation and export delivery

2026-10-23. Follow-up to merged PR #31 (`db08321`).

## Change

Theme Studio creates projects in a page form instead of a native browser prompt. Invalid IDs and existing projects have inline errors; Escape/cancel returns focus to the trigger. Creation reuses existing project persistence and switching, preserving the existing save/conflict guard. The old project is saved before switching. Full skill files and third-party sources are unchanged.

Browser inspection also found two static status/preview translations and the saved-revision translation still keyed by the old middle-dot separator. Their current slash-separated copy now resolves in English.

## Validation

- Typecheck, production build and 18 Studio tests pass. Independent Codex review found no actionable correctness issues; its sandbox could not rerun the catalog copy, so typecheck was run separately in the working environment.
- `tests/studio-project-browser.mjs`: 1440×900 and 390×900, invalid/duplicate IDs, Escape and focus return, create/save/reload, no horizontal overflow and no native dialog or page error.
- The browser flow was repeated successfully against the production build on port 4251.
- Downloaded `theme.css` bytes equal the export preview. Actual clipboard readback equals the same code. Clipboard permissions granted only to the isolated test browser; this does not assert user browser permission availability.
- Screenshots: `/issue22-preview/desktop.png`, `/issue22-preview/mobile.png`.

## Remaining acceptance

Production `/release.json` still returned `e05655775be3222dd5b6d6ce29238cd8442f151b` on 2026-10-23 after PR #31 was merged. Local and production version must not be conflated. Production rollout and repeat of this interaction check remain pending. Remote CI has not been verified. Existing Tailwind 3 compatibility-test dependency warnings remain tracked by #22; this change does not address them. Keep #22 open until those remaining items are resolved or explicitly scoped out.

Core Harness work remains separate: #7 needs real user feedback and final judgment; #29 needs Foundation professional calibration and operational evidence; #9/#10/#11 remain P1. Website approval is not a substitute for any Harness judgment.
