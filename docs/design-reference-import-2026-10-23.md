# Design references and homepage flow — 2026-10-23

The homepage now leads with a three-step usage guide and the existing Harness tool presets. Design-system and reference collections live in the secondary resource directory. The shared navigation and return links point there; old #explore bookmarks redirect to the directory.

Kage search remains on demand (six results), with a separate get_design request when a visitor opens a card. Original analysis, screenshot and source remain visible. Copyable project instructions ask the Agent to compare the reference with existing guidelines before proposing changes. No bulk mirror or automatic project write is introduced. The real upstream Linear detail returned a 5,910-character prompt during verification.

Refero imports user-provided UTF-8 .md files up to 256 KB. Contents stay in component memory and clear when leaving the page. Markdown is displayed as escaped original text, not executed HTML; embedded resources are not fetched. Invalid imports retain the previous valid document. The project handoff preserves original text and identifies it as external reference material.

Verification: typecheck and production build pass; API tests reject unsafe URLs and invalid requests; browser coverage exercises homepage navigation, file validation, script escaping, clipboard, clearing, Kage loading/retry and focus restoration at desktop/mobile widths. Upstream availability remains external; failures offer retry.
