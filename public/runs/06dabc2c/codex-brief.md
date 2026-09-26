# Scoped product experience improvement

Project: HappyClaw site — repository review
Goal: Help an interested team understand the offer and choose a path to try or deploy HappyClaw
Audience: Teams evaluating a self-hosted AI agent workspace
Critical user task: Understand the value and start a trial from the homepage
Source: https://github.com/ShuaiMXu/happyclaw-site (baseline cf1da7b, reviewed 2026-09-18). The live happyclaw.cc page currently differs from this repository.

## Problem to address
The first screen describes the category before the user outcome

## Observed evidence
- [E1] Repository / src/components/Hero.astro: The hero headline is only the product name, HappyClaw. The first descriptive line labels it a self-hosted multi-user AI Agent system; it does not state the team outcome. (source-code)
- [E2] Repository / src/components/Hero.astro: The two hero actions are a jump to Quick start and an external GitHub link. The online trial shown on the current public site is absent from this repository version. (source-code)

## Design intent
Lead with a concrete team outcome and explain self-hosting as the supporting mechanism. Make the online trial the primary action; keep GitHub and deployment instructions as clear alternatives.

## Instructions
1. Inspect the actual app and confirm or correct this authored diagnosis before changing code.
2. Make one scoped, reversible change in an isolated branch/worktree. Preserve the product goal and existing working paths.
3. Run the app. Capture the same state on desktop and mobile before and after.
4. Check task clarity, visual hierarchy, keyboard/accessibility behavior and regressions.
5. Report exactly what changed, what improved, what remains uncertain, and any evidence still missing.

Do not claim an Experience Score or conversion uplift without a validated rubric or behavioral data.
