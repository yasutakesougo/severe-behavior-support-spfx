# KI-UI-006

- Knowledge-ID: `KI-UI-006`
- State: `OBSERVED`
- Topic: adaptive / tablet layout review
- Scope: UI / responsive layout review lens
- Evaluation intent: `GUIDANCE_ONLY`
- Reference use: `GUIDANCE_REFERENCE`
- Terminal recommendation: `REFERENCE_ACCEPTED`
- Finding: jakubkrehel/skills `better-layout` describes layout structure for web interfaces: grouping with space over lines, shared alignment edges, reading order, progressive disclosure, breakpoints derived from content rather than device presets, safe-area and full-bleed considerations, text-container growth, and responsive verification. It requires changes to be expressed in the project's existing styling system and not to introduce a second styling approach.
- Local rationale: Visual Hierarchy Contract already defines FIELD_STAFF = LOW / tablet / touch-first, but verification procedure for layout breaks is under-specified. This guidance supports a future `adaptive-layout-review` lens while keeping SBS_SPACE / DADS tokens as the governing numeric authority.
- Authority: NONE（promotion 待ち。layout review lens != Visual Hierarchy Contract authority）
- Evidence:
  - Canonical repository: https://github.com/jakubkrehel/skills
  - Skill path: `skills/better-layout/SKILL.md`
  - Observed at: `2026-08-26`
  - UI-RENDERED-REVIEW-V1 Definition selection: P2 follow-on; GUIDANCE_ONLY; external spacing examples must not override SBS tokens

## Evaluation evidence contract

```text
knowledgeId: KI-UI-006
knowledgeState: OBSERVED
evaluationIntent: GUIDANCE_ONLY
source: https://github.com/jakubkrehel/skills
sourceType: OPEN_SOURCE_SKILL_REPOSITORY
canonicalSourceIdentity: https://github.com/jakubkrehel/skills
exactPageFileComponentOrMaterialIdentity: skills/better-layout/SKILL.md
observedAt: 2026-08-26
sourceVersionCommitRelease: NOT_PINNED_DEFINITION_PHASE
contentDigestOrEquivalentFingerprint: NOT_REQUIRED_FOR_GUIDANCE_ONLY
referenceUse: GUIDANCE_REFERENCE
observedPatternOrGuidance: content-derived breakpoints; clip prevention; safe area; no fixed-height text containers; reading order; control/content separation; responsive verification in existing styling system
localProblemBeingSolved: provide adaptive/tablet layout review questions without importing external px spacing as token authority
localContractsChecked: UI-EXTERNAL-INTELLIGENCE-V1; Visual Hierarchy Contract v1; DADS-04 tokens; SBS_SPACE; FIELD_STAFF tablet owner #448
compatibilityResult: COMPATIBLE_AS_GUIDANCE_ONLY
stackCompatibility: COMPATIBLE_AS_REVIEW_LENS_ONLY_NO_INSTALL
licenseOrReuseStatus: NOT_APPLICABLE_NO_CODE_OR_MATERIAL_REUSE
accessibilityImpact: REVIEW_LENS_ONLY_NO_DIRECT_CHANGE
behaviorSemanticImpact: NO_DIRECT_CHANGE
motionImpact: NOT_APPLICABLE
security / dependency impact: NONE_NO_INSTALL_NO_EXECUTION
localRationale: adopt layout verification thinking only; external 8/16/24px examples remain subordinate to SBS_SPACE and DADS tokens
terminalRecommendation: REFERENCE_ACCEPTED
implementationRevalidationRequired: REVALIDATE_IF_USED_FOR_EXACT_SLICE
implementationAuthorityReference: docs/architecture/ui-rendered-review-v1-exact-slice-definition-1.md Appendix B
```

- Retrieval keys: adaptive layout, tablet layout, responsive review, breakpoints, safe area, clipping, reading order, better-layout, FIELD_STAFF tablet
- Rule authority: NONE
- Promotion notes: `OBSERVED` only. Priority P2 / SECOND for future `adaptive-layout-review`. Do not install external Skill or elevate example spacing above local tokens.
