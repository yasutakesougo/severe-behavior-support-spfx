# KI-UI-007

- Knowledge-ID: `KI-UI-007`
- State: `OBSERVED`
- Topic: field relationship / empty-state structure
- Scope: UI / component-pattern review
- Evaluation intent: `PATTERN_TRANSLATION`
- Reference use: `PATTERN_REFERENCE`
- Terminal recommendation: `REFERENCE_ACCEPTED_TRANSLATE_ONLY`
- Finding: coss ui expresses two useful abstract patterns: (1) field label, control, supporting description, and validation error belong to one semantic field relationship; (2) an empty state separates the primary statement, supporting description, and action area rather than flattening them into one undifferentiated block.
- Local rationale: These patterns can be translated into the existing SPFx / Fluent UI stack to improve form comprehension and zero-state action hierarchy without importing coss components or changing local status, CTA, navigation, workflow, save-state, or accessibility semantics.
- Authority: NONE（promotion 待ち。external component pattern != Product UI authority）
- Evidence:
  - Canonical repository: https://github.com/cosscom/coss
  - Observed commit: `19620ae8cae81e30775f2cde03829326cb4916b2`
  - Field source: `apps/ui/content/docs/components/field.mdx`
  - Empty-state source: `apps/ui/registry/default/particles/p-empty-1.tsx`
  - Observed at: `2026-08-26`

## Evaluation evidence contract

```text
knowledgeId: KI-UI-007
knowledgeState: OBSERVED
materialUseClassification: ABSTRACT_PATTERN_TRANSLATION
evaluationIntent: PATTERN_TRANSLATION
source: https://github.com/cosscom/coss
sourceType: COMPONENT_PATTERN_CATALOG
canonicalSourceIdentity: https://github.com/cosscom/coss/tree/19620ae8cae81e30775f2cde03829326cb4916b2
exactPageFileComponentOrMaterialIdentity: apps/ui/content/docs/components/field.mdx + apps/ui/registry/default/particles/p-empty-1.tsx at commit 19620ae8cae81e30775f2cde03829326cb4916b2
observedAt: 2026-08-26
sourceVersionCommitRelease: 19620ae8cae81e30775f2cde03829326cb4916b2
contentDigestOrEquivalentFingerprint: field blob a723deefe1a47e836d4ed6684c8021574e93d519; empty-state blob 34e45e3e5524b6bba32213f5c14d6b943140d533
referenceUse: PATTERN_REFERENCE
observedPatternOrGuidance: preserve semantic field relationships across label/control/description/error; structure empty states as primary statement + supporting description + bounded action area
localProblemBeingSolved: improve form comprehension and empty-state action hierarchy without creating a new component authority or changing business semantics
localContractsChecked: UI-EXTERNAL-INTELLIGENCE-V1; UI Review Playbook; existing Component Catalog; Screen Templates; UI Semantic Rules; UI Visual Hierarchy H-04/H-05/H-06/H-07; accessibility requirements; existing interaction/status/CTA/navigation/save-state semantics
compatibilityResult: COMPATIBLE_AS_ABSTRACT_PATTERN_TRANSLATION_ONLY
stackCompatibility: ABSTRACT_PATTERN_COMPATIBLE; DIRECT_RUNTIME_REUSE_INCOMPATIBLE_WITH_LOCAL_SPFX_REACT17_FLUENTUI8_STACK
licenseOrReuseStatus: NOT_APPLICABLE_NO_CODE_OR_MATERIAL_REUSE
accessibilityImpact: LOCAL_ACCESSIBILITY_VERIFICATION_REQUIRED_IF_LATER_IMPLEMENTED; NO_EXTERNAL_CLAIM_ADOPTED
behaviorSemanticImpact: NO_DIRECT_CHANGE
motionImpact: NOT_APPLICABLE
security / dependency impact: NONE_NO_INSTALL_NO_IMPORT_NO_EXECUTION
sensitiveEvidenceHandling: PUBLIC_NON_SENSITIVE_SOURCE_IDENTITIES_ONLY; NO_CREDENTIAL_OR_PERSONAL_DATA_PERSISTED
missingOrAmbiguousEvidence: NONE
localRationale: translate only the relationship and hierarchy patterns using existing local components/tokens; do not import Base UI, shadcn, Tailwind, coss runtime, source code, CSS, icons, or assets
terminalRecommendation: REFERENCE_ACCEPTED_TRANSLATE_ONLY
implementationRevalidationRequired: REVALIDATE_SOURCE_AND_LOCAL_CONTRACTS_IF_USED_FOR_EXACT_SLICE
implementationAuthorityReference: NONE
```

## Translation boundary

Allowed translation candidates:

```text
field label / control / description / error relationship
empty-state title / description / action separation
```

Explicitly not carried forward:

```text
coss component source
Base UI runtime
shadcn installer path
Tailwind tokens / CSS architecture
icons / copied assets
external validation semantics as Product semantics
```

- Retrieval keys: coss ui, field, label, description, validation error, empty state, action hierarchy, pattern translation
- Rule authority: NONE
- Promotion notes: `OBSERVED` only. Any Product UI change requires a separate Exact Slice and Human Implementation Start GO.