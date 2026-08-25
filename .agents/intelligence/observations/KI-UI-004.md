# KI-UI-004

- Knowledge-ID: `KI-UI-004`
- State: `OBSERVED`
- Topic: accessibility runtime / touch verification
- Scope: UI / accessibility review lens
- Evaluation intent: `GUIDANCE_ONLY`
- Reference use: `GUIDANCE_REFERENCE`
- Terminal recommendation: `REFERENCE_ACCEPTED`
- Finding: jakubkrehel/skills `better-accessibility` describes accessibility engineering for product interfaces with emphasis on keyboard-only completion walks, screen-reader walks, touch hit areas (including ~44×44px targets on touch), motion/zoom/reflow checks (200% zoom, 320px reflow), hover persistence on touch, and forced-colors focus visibility. It instructs fixes to be written in the project's existing styling system rather than introducing a second approach.
- Local rationale: DADS-06 and `design-review` already cover semantic a11y channels and static gate checks. This external guidance complements them with runtime / touch / zoom verification lenses without becoming a new a11y authority or replacing DADS-06.
- Authority: NONE（promotion 待ち。runtime a11y lens != DADS-06 gate authority）
- Evidence:
  - Canonical repository: https://github.com/jakubkrehel/skills
  - Skill path: `skills/better-accessibility/SKILL.md`
  - Observed at: `2026-08-26`
  - UI-RENDERED-REVIEW-V1 Definition selection: GUIDANCE_ONLY supplement to `design-review` / DADS-06, not a standalone Skill install

## Evaluation evidence contract

```text
knowledgeId: KI-UI-004
knowledgeState: OBSERVED
evaluationIntent: GUIDANCE_ONLY
source: https://github.com/jakubkrehel/skills
sourceType: OPEN_SOURCE_SKILL_REPOSITORY
canonicalSourceIdentity: https://github.com/jakubkrehel/skills
exactPageFileComponentOrMaterialIdentity: skills/better-accessibility/SKILL.md
observedAt: 2026-08-26
sourceVersionCommitRelease: NOT_PINNED_DEFINITION_PHASE
contentDigestOrEquivalentFingerprint: NOT_REQUIRED_FOR_GUIDANCE_ONLY
referenceUse: GUIDANCE_REFERENCE
observedPatternOrGuidance: keyboard-only and screen-reader review walks; touch hit-area targets; 200% zoom and reflow checks; hover-on-touch and forced-colors focus checks; write fixes in existing styling system only
localProblemBeingSolved: supplement static a11y gate with runtime verification questions without installing external Skill or changing Product UI Contract
localContractsChecked: UI-EXTERNAL-INTELLIGENCE-V1; DADS-06 accessibility gate; design-review a11y meaning channels; Human GO / mutation boundary
compatibilityResult: COMPATIBLE_AS_GUIDANCE_ONLY
stackCompatibility: COMPATIBLE_AS_REVIEW_LENS_ONLY_NO_INSTALL
licenseOrReuseStatus: NOT_APPLICABLE_NO_CODE_OR_MATERIAL_REUSE
accessibilityImpact: REVIEW_LENS_ONLY_NO_DIRECT_CHANGE
behaviorSemanticImpact: NO_DIRECT_CHANGE
motionImpact: REVIEW_LENS_ONLY
security / dependency impact: NONE_NO_INSTALL_NO_EXECUTION
localRationale: adopt verification questions only; do not install Skill, auto-apply fixes, or elevate external px guidance above SBS/DADS tokens
terminalRecommendation: REFERENCE_ACCEPTED
implementationRevalidationRequired: REVALIDATE_IF_USED_FOR_EXACT_SLICE
implementationAuthorityReference: NONE
```

- Retrieval keys: accessibility runtime, touch target, 44px, keyboard-only, 200% zoom, reflow, forced-colors, hover on touch, better-accessibility
- Rule authority: NONE
- Promotion notes: `OBSERVED` only. Do not install the external Skill or treat runtime checks as CI gate replacements. Static a11y authority remains DADS-06 and `design-review`.
