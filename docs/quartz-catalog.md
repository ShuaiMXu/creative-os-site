# Quartz catalog entry

The portal Design Systems section lists Quartz as an external system from design.how. The entry links to the official preview and registry and offers separate Chinese/English setup prompts for new and existing projects. It retains HappyHands tokens and does not install Quartz or change the design of reviewed products.

Source checked on 2026-10-16: https://design.how/r/quartz/skill.json, theme.json, registry.json, lint.json and project-home.json. The registry supplies React/TSX components and a Tailwind theme. The prompt checks compatibility first, scopes migration, includes the portal provider, preserves approved rules and asks the executing agent to record adopted versions. This is a dated documentation check, not a pinned upstream release or license certification. No upstream component code, fonts or screenshots are redistributed.

The startup link opens the existing local-workbench documentation. It does not claim that clicking it starts a hosted review or automatically imports Quartz into Harness.

Implementation is based on `feat/creative-os-content-portal` (879be14), the pending website PR #2 containing the current catalog. The older main branch has a different portal. Existing uncommitted work in that checkout remains untouched.

Validation: production build; Chrome at 1280 and 390 pixels, Chinese and English, light and dark; both prompt disclosure/copy actions; denied clipboard fallback; horizontal overflow and page errors. Tests use a clipboard stub to verify exact payloads, not the system clipboard. No deployment performed.
