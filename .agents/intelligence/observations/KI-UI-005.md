# KI-UI-005

- Knowledge-ID: `KI-UI-005`
- State: `OBSERVED`
- Topic: rendered evidence usability review
- Scope: UI / rendered usability review
- Evaluation intent: `GUIDANCE_ONLY`
- Reference use: `GUIDANCE_REFERENCE`
- Terminal recommendation: `REFERENCE_ACCEPTED`
- Finding: Superfuture/design-review is an external Claude Code skill that critiques URLs, screenshots, or component code against visual hierarchy, typography, spacing, contrast, component states, responsiveness, accessibility, motion, and brand consistency. It ranks findings and can optionally apply fixes with `--apply`. The repository's local skill must use a distinct name (`rendered-usability-review`) and forbid `--apply`, source mutation, and Product UI Contract changes.
- Local rationale: Aligns with evidence-first UI review (KI-UI-001) and the need to evaluate rendered usability separately from Product UI Contract compliance (`design-review`). External name collision with local `design-review` is explicitly avoided. Priority P1 / FIRST for local Skill introduction.
- Allowed（local GUIDANCE_ONLY）: screenshot review; rendered hierarchy review; spacing / density review; responsive visual review（width-labeled evidence）; component state review; concrete findings with evidence refs
- Forbidden（local）: `--apply`; source mutation; Product UI Contract change; Domain semantics change; local `design-review` replacement; external Skill install / runtime execution
- Authority: NONE（promotion 待ち。rendered review lens != Product UI Contract authority）
- Evidence:
  - Canonical repository: https://github.com/Superfuture/design-review
  - Observed at: `2026-08-26`
  - Observed guidance: URL / screenshot / component review; ranked findings; requires rendered artifact; optional `--apply` (FORBIDDEN locally)
  - Local mapping: `docs/architecture/ui-rendered-review-v1-exact-slice-definition-1.md`

## Evaluation evidence contract

```text
knowledgeId: KI-UI-005
knowledgeState: OBSERVED
evaluationIntent: GUIDANCE_ONLY
source: https://github.com/Superfuture/design-review
sourceType: OPEN_SOURCE_SKILL_REPOSITORY
canonicalSourceIdentity: https://github.com/Superfuture/design-review
exactPageFileComponentOrMaterialIdentity: design-review skill rubric (repository root)
observedAt: 2026-08-26
sourceVersionCommitRelease: NOT_PINNED_DEFINITION_PHASE
contentDigestOrEquivalentFingerprint: NOT_REQUIRED_FOR_GUIDANCE_ONLY
referenceUse: GUIDANCE_REFERENCE
observedPatternOrGuidance: rendered critique from URL/screenshot/code; hierarchy/spacing/state/responsive review; ranked findings; no unsupported visual claims without artifact
localProblemBeingSolved: provide a bounded rendered-usability review lens without replacing design-review or mutating product source
localContractsChecked: UI-EXTERNAL-INTELLIGENCE-V1; Product UI Contract hierarchy; design-review boundary; Human GO / mutation boundary
compatibilityResult: COMPATIBLE_AS_GUIDANCE_ONLY
stackCompatibility: COMPATIBLE_AS_REVIEW_LENS_ONLY_NO_INSTALL
licenseOrReuseStatus: NOT_APPLICABLE_NO_CODE_OR_MATERIAL_REUSE
accessibilityImpact: REVIEW_LENS_ONLY_NO_DIRECT_CHANGE
behaviorSemanticImpact: NO_DIRECT_CHANGE
motionImpact: REVIEW_LENS_ONLY
security / dependency impact: NONE_NO_INSTALL_NO_EXECUTION
localRationale: use review dimensions and evidence discipline only; forbid --apply, install, local design-review name collision, and Contract/Domain mutation
terminalRecommendation: REFERENCE_ACCEPTED
implementationRevalidationRequired: REVALIDATE_IF_USED_FOR_EXACT_SLICE
implementationAuthorityReference: docs/architecture/ui-rendered-review-v1-exact-slice-definition-1.md
```

- Retrieval keys: rendered usability, screenshot review, visual hierarchy, spacing review, component state review, Superfuture design-review, rendered-usability-review
- Rule authority: NONE
- Promotion notes: `OBSERVED` only. Priority P1 / FIRST for local Skill `rendered-usability-review`. Allowed/Forbidden boundary locked in UI-RENDERED-REVIEW-V1 Definition Correction-1 / P2-2. Source commit/release pin deferred to Post-Merge / Implementation Start preflight（Definition Correction-2 / P2-2）.
