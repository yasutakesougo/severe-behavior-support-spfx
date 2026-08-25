# KI-UI-001

- Knowledge-ID: `KI-UI-001`
- State: `OBSERVED`
- Topic: evidence-first read-only UI audit
- Scope: UI review / design intelligence
- Evaluation intent: `GUIDANCE_ONLY`
- Reference use: `GUIDANCE_REFERENCE`
- Terminal recommendation: `REFERENCE_ACCEPTED`
- Finding: UI Skills `improve-ui` describes an audit pattern that starts from the product's own governing design evidence, rejects unsupported findings, and stops at plans/recommendations rather than product-source mutation. This is useful as a review lens for this repository, but it does not become repository instruction or implementation authority.
- Local rationale: Aligns with the existing contract-first UI workflow and the locked `UI-EXTERNAL-INTELLIGENCE-V1` boundary in which UI research/review stops before product mutation. The external Skill's install/runtime instructions are not adopted.
- Authority: NONE（promotion 待ち。既存 Product UI Contract / Human GO を置き換えない）
- Evidence:
  - Canonical page: https://www.ui-skills.com/skills/ibelick/improve-ui
  - Observed at: `2026-08-26`
  - Supporting repository: https://github.com/ibelick/ui-skills
  - Repository HEAD observed: `ff7ca0a475e0dbb26a2db458beb03081b3dfd892`
  - Observed guidance includes: use the system that actually governs the surface; prefer no finding to an unsupported one; do not modify product source during the audit.

## Evaluation evidence contract

```text
knowledgeId: KI-UI-001
knowledgeState: OBSERVED
evaluationIntent: GUIDANCE_ONLY
source: https://www.ui-skills.com/skills/ibelick/improve-ui
sourceType: WEBSITE_SKILL_PAGE
canonicalSourceIdentity: https://www.ui-skills.com/skills/ibelick/improve-ui
exactPageFileComponentOrMaterialIdentity: improve-ui guidance page
observedAt: 2026-08-26
sourceVersionCommitRelease: ff7ca0a475e0dbb26a2db458beb03081b3dfd892 (supporting repository HEAD)
contentDigestOrEquivalentFingerprint: NOT_REQUIRED_FOR_GUIDANCE_ONLY
referenceUse: GUIDANCE_REFERENCE
observedPatternOrGuidance: evidence-first read-only UI audit; prefer supported findings; stop before product-source mutation
localProblemBeingSolved: provide a bounded review lens for identifying UI issues without bypassing existing local design evidence or implementation gates
localContractsChecked: UI-EXTERNAL-INTELLIGENCE-V1; existing Product UI Contract hierarchy; existing Human GO / mutation boundary
compatibilityResult: COMPATIBLE_AS_GUIDANCE_ONLY
stackCompatibility: NOT_APPLICABLE_GUIDANCE_ONLY
licenseOrReuseStatus: NOT_APPLICABLE_NO_CODE_OR_MATERIAL_REUSE
accessibilityImpact: NO_DIRECT_CHANGE
behaviorSemanticImpact: NO_DIRECT_CHANGE
motionImpact: NOT_APPLICABLE
security / dependency impact: NONE_NO_INSTALL_NO_EXECUTION
localRationale: use as a review lens only; external Skill install/runtime instructions remain untrusted reference data
terminalRecommendation: REFERENCE_ACCEPTED
implementationRevalidationRequired: REVALIDATE_IF_USED_FOR_EXACT_SLICE
implementationAuthorityReference: NONE
```

- Retrieval keys: UI audit, evidence-first, local design evidence, unsupported finding, read-only, improve-ui
- Rule authority: NONE
- Promotion notes: `OBSERVED` only. Do not install the external Skill, create product changes, or treat this entry as a new UI authority. Promotion requires the existing External Intelligence policy and Human confirmation where applicable.
