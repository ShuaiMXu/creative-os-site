# HappyHands — Follow the change / C

28-second, 1920×1080, 30fps motion-direction preview. Same page → selected gap → corresponding source → scoped token edit → matched component comparison → pending review and human decision. Northstar is an authored fictional fixture; the film does not show an executed or accepted product run.

## Run

```powershell
npm ci
npm run typecheck
npm run dev
```

Render with installed Chrome (Windows example):

```powershell
npx remotion render src/index.tsx HappyHandsC out/HappyHands-Follow-the-change-C-v3b.mp4 --browser-executable="C:/Program Files/Google/Chrome/Application/chrome.exe" --concurrency=4 --crf=18
```

The local restricted execution environment caused bundled FFmpeg/FFprobe to exit with access-violation code 3221225477. Running the same rendering command through the approved local execution path succeeded. No upstream binaries or Skill files were modified. `out/` is local-only and ignored.

`node stills.mjs` renders source verification frames. Python helpers require Python 3.11+, `pip install -r requirements.txt`, installed Chrome, and FFmpeg/FFprobe on PATH. `python qa.py` checks the encoded MP4 and extracts 5fps review frames, 2fps blind contact sheets and the 15-frame overview. This is not a substitute for continuous playback or listening.

## Assets and sources

- `src/timeline.ts`: single source for shot bounds, captions and SFX timing.
- `src/Film.tsx`: deterministic composition, PageCam coordinate math and documented CardFlipReveal adaptation.
- `fixtures/northstar.html`: original demo page. `capture.py` generates 6x page/component textures and measured layout metadata using Playwright with Chrome.
- `public/logo.png`: unchanged official logo; its SHA-256 matches the website asset.
- Instrument Sans/Serif fonts are accompanied by their OFL licenses.
- `attribution.md` and `VIDEO-SHOTCRAFT-LICENSE.txt`: code references and audio sources.
- `design-spec.md`: creative decisions, feature/shot mapping and frame-led storyboard.

No private core source, credentials, internal address, customer data or Firefly file is included. Core repository visibility is unchanged. This preview does not authorize merging PR #28 or production deployment.
