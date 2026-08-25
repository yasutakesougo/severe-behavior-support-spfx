# Intelligence catalog

索引のみ。知識本文ではない。Agent はまず本表を読み、必要な ID の本文だけ開く。

## Operational playbooks

Knowledge state machineとは別の、LOCKED Definitionを実行可能なread/review手順へmaterializeした索引。Playbook自体はSSOTでもmutation authorityでもない。

| Playbook | Basis / authority source | Scope | Authority granted | Retrieval keys | Path |
|---|---|---|---|---|---|
| UI-REVIEW-PLAYBOOK-V1 | Issue #518 `UI-EXTERNAL-INTELLIGENCE-V1` ACCEPTED / LOCKED Definition | external UI intelligence / UI review | `NONE` | UI review, external UI intelligence, evaluationIntent, GUIDANCE_ONLY, PATTERN_TRANSLATION, CODE_OR_MATERIAL_REUSE, provenance, sanitization, sensitive evidence, revalidation, HOLD_UNKNOWN | `ui-review-playbook.md` |

## Knowledge index

| ID | State | Topic | Scope | Authority | Evidence | Retrieval keys | Path |
|---|---|---|---|---|---|---|---|
| KI-GOV-001 | LOCKED_REFERENCE | mutation authorization | repository-wide | `AGENTS.md`, `docs/decisions/DEC-AI-ORG-003.md` | DEC Accepted | Human GO, mutation, Ready, Merge, Issue mutation | `rules/KI-GOV-001.md` |
| KI-GOV-002 | LOCKED_REFERENCE | Ready vs Merge | repository-wide | `.agents/skills/project-status/SKILL.md` | Human boundaries | Ready GO, Merge GO, Human Ready, Human Merge | `rules/KI-GOV-002.md` |
| KI-GOV-003 | LOCKED_REFERENCE | Decision vs Implementation Start | repository-wide | `.agents/skills/project-status/SKILL.md` | Human boundaries | Decision Accepted, Implementation Start, authorization | `rules/KI-GOV-003.md` |
| KI-STATE-001 | LOCKED_REFERENCE | live state priority | repository-wide | `.agents/skills/project-status/evidence.md` | Evidence priority | GitHub live state, historical docs, CURRENT | `rules/KI-STATE-001.md` |
| KI-STATE-002 | LOCKED_REFERENCE | FALSE_WAIT prevention | repository-wide | `.agents/skills/project-status/SKILL.md` | WAIT rules | WAIT, UNKNOWN, FALSE_WAIT | `rules/KI-STATE-002.md` |
| KI-STATE-003 | OBSERVED | Issue vs implementation PR drift | repository-wide | NONE（promotion 待ち） | Issue #448, PR #468 | STATE_DRIFT, NOT STARTED, implementation PR, reconciliation | `observations/KI-STATE-003.md` |
| KI-GITHUB-001 | LOCKED_REFERENCE | environment-specific GitHub limits | GitHub / MCP / Worker | `.agents/mcp/permission-matrix.md`, `docs/process/background-agent-contract.md` | permission matrix | GitHub Worker, 404, permissions, generalize | `rules/KI-GITHUB-001.md` |
| KI-SPFX-001 | LOCKED_REFERENCE | synthetic vs LIVE persistence | SPFx / demo / smoke | `AGENTS.md`, Issue #448 PRESERVED BOUNDARIES | browser smoke policy | synthetic success, LIVE persistence, HOLD | `rules/KI-SPFX-001.md` |
| KI-SPFX-002 | LOCKED_REFERENCE | Deploy evidence vs acceptance | release | `AGENTS.md`, `.agents/skills/release-review/SKILL.md` | Deploy GO Human-only | Deploy evidence, application acceptance, Production GO | `rules/KI-SPFX-002.md` |
| KI-TEST-001 | LOCKED_REFERENCE | smoke identity confirmation | browser smoke | `AGENTS.md`, `docs/architecture/dashboard-ux-1-browser-smoke.md` | smoke 証跡 docs | smoke evidence, identity, synthetic | `rules/KI-TEST-001.md` |
| KI-ARCH-001 | LOCKED_REFERENCE | lifecycle vs record mutation | domain / handoff / cancellation | `docs/architecture/cancellation-exact-slice-definition-1.md`, `docs/architecture/handoff-state-mutation.md` | ProcedureRecord immutable | append-only, lifecycle event, record mutation, cancellation | `rules/KI-ARCH-001.md` |
| KI-UI-001 | OBSERVED | evidence-first read-only UI audit | UI review / design intelligence | NONE（promotion 待ち） | UI Skills `improve-ui`, observed 2026-08-26 | UI audit, evidence-first, local design evidence, read-only, improve-ui | `observations/KI-UI-001.md` |
| KI-UI-002 | OBSERVED | design-system coverage checklist | UI / design-system review | NONE（promotion 待ち） | design-system-checklist `a131d2f...`, observed 2026-08-26 | design system, checklist, coverage, review, tokens, components | `observations/KI-UI-002.md` |
| KI-UI-003 | OBSERVED | purpose / frequency-sensitive motion | UI / motion review | NONE（promotion 待ち） | Emil Kowalski motion guidance, observed 2026-08-26 | motion, animation, frequency of use, keyboard, repeated interaction | `observations/KI-UI-003.md` |
