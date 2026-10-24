# C / Follow the change — cinematic re-edit

2026-10-24. The user rejected the previous draft as PPT animation and asked for the project's film skills. This revision uses video-shotcraft in the ongoing autonomous mode while retaining the user-selected C premise. It replaces that draft rather than adding polish to its layout. The stopped 72-second render is not a delivery candidate.

## Decisions

| Requirement | Execution |
|---|---|
| Page flips to reveal source | One semantic flip/reverse pair; same 1000×640 front/back plane. |
| Remove PPT staging | No persistent title, explanation column, chapter slide or header chrome. The page occupies the frame; a moving camera follows the selected region. |
| Product clarity | Review scope → authored design discrepancy → confirmed scoped edit → matched comparison → pending review/decision. |
| Original product identity | Official logo unchanged, neutral surfaces and ink text; restrained selection blue. Instrument Sans/Serif belong to the existing approved Northstar film direction. |
| Honest demo | Original fictional Northstar fixture, labelled throughout. Source excerpt is illustrative. No private core source or real run is presented. |
| Keep C and proceed | Existing direction is accepted; this is autonomous execution of the user's visual correction, not a new choice or approval gate. |
| Runtime | Separate pinned Remotion project; no application code or global Skill files changed. |

## Shot grammar and sources

Scanned all 157 shot frontmatters and resolved styles against the Gallery index. The exact CardFlipReveal.tsx, SpotlightHeroCard.tsx, PageCam.tsx and FocusHandoffTransition.tsx were read before implementation. Two corresponding Gallery MP4s were downloaded locally for frame analysis, not reused as film footage.

- `card-flip-reveal / card-flip-reveal`: preserve the 18f travel to 192°, 8f settle to 180°, moving angle-linked sheen and backface handling. Adapt one page rather than a row of metric cards; replace the metric with three large source lines. The necessary reverse restores the same page; it is one causal set-piece.
- `spotlight-hero-card / spotlight-hero-card`: adapt the slow, single-subject camera arc and 4x texture strategy. Do not claim exact card reproduction: this project deliberately omits decorative perimeter laps and levitating cards; the entire page is the subject, not a slot item.
- `PageCam`: retain layout-level CSS zoom and focal-point coordinate math so magnified text samples from 2x/4x textures.
- Comparison is a custom same-coordinate wipe; no unrelated scene replaces the page. Validate texture origins and actual 16/32px CSS states.

## Current cut: 28-second motion preview

The 36-second first re-edit was independently reviewed. Its comparison paused outside the button and the source/page reading holds still relied too heavily on captions. The current cut concentrates on the measured boundaries and isolates the actual component at the same page coordinate. The repaired comparison selects Before and After explicitly and moves a single complete DOM button through its real flex gap, without cutting its text or swapping layers. It is a direction preview with SFX, not an approved final sound master.

## Re-edit storyboard

| # | Time | Shot | Main action |
|---|---|---|---|
| 1 | 0–4s | Page as object | Whole page, oblique move into the intro; official logo identifies the product. |
| 2 | 4–7s | Follow selection | Camera follows the paragraph/button boundaries. Gap band measures 16px. Cursor confirms the 32px target. |
| 3 | 7–10s | Turn inside out | Same page rotates to corresponding source; code becomes a macro subject. |
| 4 | 10–16s | Scoped source edit | Token changes to space-8. Reverse turn returns to the same coordinate; the component separates from its page context. |
| 5 | 16–21s | Compare in place | Before/After selection changes explicitly. One complete button moves through its actual 32→16→32px gap; the measurement band follows both boundaries. |
| 6 | 21–24s | Review remains open | Pull out. Pending review and decision are outside the Northstar surface. |
| 7 | 24–28s | Brand resolution | Page recedes; official logo, review/change/verify and happyhands.cc hold. |

The former 72-second explanatory pacing is reduced to 28 seconds. One continuous subject replaces recurring headings. A five-second central movement was rendered before the full re-edit. Captions use 78px type; macro auxiliary labels are ≥32 effective pixels. Full-page and component captures are now 6x; measured 16/32px states are recorded in layout.json. Incidental page text is texture until brought into focus. No shake, strobe, particle field or perpetual idle drift.

Audio decision for this preview: five short real-world material SFX; no BGM, narration or synthetic confirmation tones. Original Mixkit source URLs are recorded in attribution.md. Film timing is content-led; strong-beat music synchronization is not applicable to this cut. Human listening and continuous playback are separate from technical measurements and sampled-frame review.
