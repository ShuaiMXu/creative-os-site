# Website deployment

## Vercel migration

The production host is Vercel: https://happyhands-design.vercel.app . Project: `shakaka/happyhands-design`, linked to `ShuaiMXu/creative-os-site` on GitHub. The first production deployment on 2026-10-17 (Asia/Shanghai), `dpl_9yvRoow3PzyfHwZybwNPLCPLu15D`, reached `READY`.

`vercel.json` defines an npm build with `dist` output, preserves directory URLs, and uses static multi-page routing rather than an SPA catch-all. Deploy with `vercel --prod` from the application checkout. Do not commit `.vercel` credentials or local project state. Anonymous HTTP checks passed for the homepage, portal, HappyHands, Quartz and Studio paths. Studio brand browser checks also passed against the Vercel production URL.

## Earlier Sites deployment

The deployment below is historical and is not the selected production host. Retain its identity to manage the existing deployment without creating duplicates.

- Public URL: https://happyhands-design.quietmole14.chatgpt.site
- Hosting: Sites, public access (no account required).
- Site identity: `.openai/hosting.json`. Reuse this ID for future releases.
- First release: 2026-10-17 (Asia/Shanghai), built from GitHub commit `bcc3e0b` after PR #6.
- Hosted static source commit: `48d1eaafd92d4adba6ee2f5d05a71d26acc88e33`.
- Saved version: `appgprj_6ad263a57e648191a55f6c9b6d554dbd~appgver_f25a7da5eb788191bfb32fb1341e9537`.

Build with `npm run build`. The complete `dist` directory is published, preserving absolute asset paths and the root redirect to `/apps/portal/`. Theme Studio remains browser-local; hosting does not expose the local engineering workspace or start a local harness service.

The Sites source repository contains the built static output and hosting manifest. The editable application source remains in this GitHub repository. To release again, replace the hosted static output with a fresh build, push that exact source state, package it with the hosting manifest, then save and deploy a new Sites version. Never create a replacement Site for an update.

On this Windows host, the bundled Bash packager failed with an access error. The release used native PowerShell copy and tar packaging of the same static output and manifest after the Sites helper verified the pushed source commit. No credentials are stored in the repository.

GitHub Actions billing failures were excluded by user instruction; local type checking, Studio browser checks and production build passed before release.
