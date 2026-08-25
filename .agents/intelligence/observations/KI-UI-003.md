# KI-UI-003

- Knowledge-ID: `KI-UI-003`
- State: `OBSERVED`
- Topic: purpose / frequency-sensitive motion
- Scope: UI / motion review
- Evaluation intent: `GUIDANCE_ONLY`
- Reference use: `GUIDANCE_REFERENCE`
- Terminal recommendation: `REFERENCE_ACCEPTED`
- Finding: Emil Kowalski's guidance frames animation as purpose-dependent and frequency-sensitive: frequently repeated interactions can become slower or more irritating with motion, and keyboard-initiated repeated actions are presented as especially poor candidates for animation. The article also gives a general under-300ms rule of thumb for UI motion, but that numeric threshold remains external guidance rather than a local contract.
- Local rationale: Useful as a motion-review lens for operational UI where repeated tasks and input speed matter. It supports asking whether motion has a concrete UX purpose without changing existing status, priority, interaction, accessibility, or timing contracts.
- Authority: NONE（promotion 待ち。external motion guidance != Product Motion Contract）
- Evidence:
  - Canonical article: https://emilkowal.ski/ui/you-dont-need-animations
  - Observed at: `2026-08-26`
  - Observed guidance: animation should have a purpose; frequency of use affects whether motion helps; repeated keyboard actions should avoid motion; UI animation speed guidance is presented as a rule of thumb rather than repository authority.

## Evaluation evidence contract

```text
knowledgeId: KI-UI-003
knowledgeState: OBSERVED
evaluationIntent: GUIDANCE_ONLY
source: https://emilkowal.ski/ui/you-dont-need-animations
sourceType: GUIDANCE_ARTICLE
canonicalSourceIdentity: https://emilkowal.ski/ui/you-dont-need-animations
exactPageFileComponentOrMaterialIdentity: You Don't Need Animations article page
observedAt: 2026-08-26
sourceVersionCommitRelease: NOT_AVAILABLE_MUTABLE_WEB_ARTICLE
contentDigestOrEquivalentFingerprint: NOT_REQUIRED_FOR_GUIDANCE_ONLY
referenceUse: GUIDANCE_REFERENCE
observedPatternOrGuidance: animation should have a concrete UX purpose; frequency matters; repeated keyboard interactions are poor candidates for decorative motion; numeric timing remains external rule-of-thumb only
localProblemBeingSolved: provide a bounded motion-review lens for high-frequency operational UI without introducing a new Product Motion Contract
localContractsChecked: UI-EXTERNAL-INTELLIGENCE-V1 motion boundary; existing interaction semantics; status semantics; CTA priority; accessibility requirements; existing timing/visual hierarchy contracts
compatibilityResult: COMPATIBLE_AS_GUIDANCE_ONLY
stackCompatibility: NOT_APPLICABLE_GUIDANCE_ONLY
licenseOrReuseStatus: NOT_APPLICABLE_NO_CODE_OR_MATERIAL_REUSE
accessibilityImpact: REVIEW_LENS_ONLY_NO_DIRECT_CHANGE
behaviorSemanticImpact: NO_DIRECT_CHANGE
motionImpact: GUIDANCE_ONLY_NO_NUMERIC_RULE_ADOPTED
security / dependency impact: NONE_NO_INSTALL_NO_EXECUTION
localRationale: use purpose/frequency questions during motion review while keeping exact durations/easing and behavior semantics under separate local authority
terminalRecommendation: REFERENCE_ACCEPTED
implementationRevalidationRequired: REVALIDATE_IF_USED_FOR_EXACT_SLICE
implementationAuthorityReference: NONE
```

- Retrieval keys: motion, animation, frequency of use, keyboard, repeated interaction, purposeful animation
- Rule authority: NONE
- Promotion notes: `OBSERVED` only. Do not lock numeric duration/easing rules from this entry. Any Product Motion Contract change requires separate local evidence and authority.
