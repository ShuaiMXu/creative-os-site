# C-v3b quality record — 2026-10-24

Status: **motion-direction preview, not a final publishing master**.

| Check | Result / evidence |
|---|---|
| Encoded video | 1920×1080, 30fps, 840 frames / 28.000s video track. AAC padding gives a slightly longer container duration. |
| Frame extraction | 5fps dense frames and 2fps blind contact sheets extracted from the MP4; 15-frame full-film overview. |
| Black frames | FFmpeg blackdetect found no intervals at d=0.05, pix_th=0.02. |
| Scope truth | Fictional/illustrative label throughout; review and decision stay pending outside Northstar. No private core source or internal address appears. |
| Fixture measurements | CSS gaps 16px and 32px; page/component captures at 6x. The live comparison uses one flex group and complete button. |
| Official logo | Copy SHA-256 equals website asset: 235A2CFEBA071A57CED90873D82880D0EF465BEB89BB85BA1730D80C7BFF02B8. |
| Source legibility | f275/f330 target value moved inside macro framing; regression reviewer confirms complete and readable. |
| Comparison legibility | Stitched button text removed; one complete button moves through actual 32→16→32px gaps with explicit mode selection. f540 and implementation independently checked. |
| Code | Separate project TypeScript check passes; root site application source unchanged. |
| Audio | Five declared SFX with explicit frame bounds; no BGM or narration. Encoded-media reading: −27.5 LUFS integrated for this mostly silent SFX preview, true peak about −10.2dBFS. No clipping found; human listening is unverified. |
| Continuous playback | **Not verified by the frame-only independent reviewers.** Their reports do not approve motion feel, output audio offset, SFX audibility or final sound direction. |
| Publishing | Preview only; no production deployment or PR merge authorized by this result. |

## Independent rounds and fixes

1. Initial 72s composition: reviewer found overlapping labels, clipped measurements/crops and ambiguous planned device scope. This design was rejected by the user as PPT animation and stopped.
2. 36s re-edit: blind reviewer reconstructed the story, but the wipe paused in blank space rather than crossing the button. A comparison entry reset the visible state. Source/page holds still depended heavily on subtitles. Recut to 28s, focus actual gap boundaries and preserve the existing After state.
3. 28s candidate: independent review accepted the causal page/source relationship as a motion preview but found clipped Target32px and a comparison seam cutting the button wording. Repair moved the target into the code close-up and replaced the stitched wipe with explicit Before/After states on one live DOM button. Read-only regression review found both issues fixed and no new blocking frame/implementation issue. It noted that After highlights at the start of its 18-frame transition, while the moving gap briefly still begins at 16px; that is the selected target state, not a persistent mismatch.

The original Skill files were not modified. Gallery reference previews were sampled, not reused as film footage. The local project retains the Apache-2.0 motion-source license, font OFLs and traceable audio attribution.
