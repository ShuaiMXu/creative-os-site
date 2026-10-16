# Public design-system detail alignment

Reviewed 2026-10-17 against `public/systems/happyhands/SKILL.md`, canonical HappyHands tokens, the real Button implementation and the portal's design-system catalog.

## Findings and changes

The HappyHands detail page shared color variables but retained a separate documentation layout. Its 220px directory shifted the content grid, a long promotional heading wrapped into orphan lines, and the catalog return link was hidden in the directory. Broad `header` and `nav` rules could also compete with the shared site shell. Quartz depended on the HappyHands page stylesheet for unrelated base rules.

Both detail pages now use `packages/ui/system-page.css`, shared page gutters and `SystemBreadcrumb({ current, lang })`. The breadcrumb links to the homepage and design-system catalog; its active item names the system. Default, hover and keyboard-focus behavior follows the site shell, and narrow layouts wrap naturally. The header uses the same content inset as the parent catalog.

HappyHands uses the catalog's name, introduction and visual language, with an interactive specimen built from the real Button. Its directory sits below the introduction, highlights the current section and collapses on tablet/phone. The overview link reveals the site header as well as the introduction. Foundation swatches, component examples and adoption prompts retain semantic light/dark tokens. Static examples use the card radius; the native dialog retains floating-surface radius and shadow.

Catalog return and Theme Studio continuation links are available at the end of the page. Source links now point at the maintained main branch. Engineering limitations remain in the scope disclosure. Existing native form, dialog and task-state demos retain their behavior.

## Verification and scope

Production build and type checking passed. Independent Chrome checked the complete homepage → catalog → HappyHands → catalog → Quartz → Theme Studio → homepage/connection guide flow at 390/768/1280 pixels in both themes, including language persistence, identical parent/detail content alignment, stable header alignment, short system heading, active section navigation, mobile directory, dialog Escape/focus return, preserved edits, no page errors and no horizontal overflow. Screenshots are in ignored `test-results/site-flow/`.

The in-app automation backend was unavailable; these checks ran in independent Chrome against the same local application. This review covers the public website detail family and shared header gutters. It does not claim that the separate review workbench has adopted all of these components.
