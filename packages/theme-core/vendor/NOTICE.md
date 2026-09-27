# tweakcn source attribution

Source: https://github.com/jnsahaj/tweakcn
Revision: a3b47b37cba97dd637de517aab52c45ec0f83456
License: Apache-2.0, retained in LICENSE.

Adapted files retain their upstream directory names. Changes: remove Drizzle Theme alias and Next font layout generator; rewrite alias imports; remove document-global shadow application. Theme defaults, built-in presets, schema, shadow calculation and Tailwind generation originate upstream. Color export uses RGB to preserve alpha. No upstream branding, paid assets, account, billing or AI service is copied.

Additional shadow adaptation: multiply the source color's alpha into shadow opacity and clamp combined opacity. HappyHands' export adapter supplies Tailwind 3 shadow utilities and normalizes `letter-spacing: normal` for arithmetic tracking output.

HappyHands editor UI, project persistence, history reducer, AST CSS importer, proposal/approval adapter and preview protocol are new implementations around this core. This is a source integration, not an unmodified full-app fork. Upstream update procedure: compare each listed file against the pinned revision, record adaptations, then run core, export and browser tests before advancing the revision.

Review fixes: preserve imported mode-specific spacing/tracking in Tailwind output and apply tracking even when only the dark theme changes it.
