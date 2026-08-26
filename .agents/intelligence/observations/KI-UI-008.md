# KI-UI-008

- Knowledge-ID: `KI-UI-008`
- State: `OBSERVED`
- Topic: filter-state / presentation separation and explicit list states
- Scope: UI / component-pattern review
- Evaluation intent: `PATTERN_TRANSLATION`
- Reference use: `PATTERN_REFERENCE`
- Terminal recommendation: `REFERENCE_ACCEPTED_TRANSLATE_ONLY`
- Finding: ReUI exposes two useful abstract patterns: (1) filter/query state remains one model while basic versus advanced UI is presentation chrome over that state; (2) list/grid presentation explicitly distinguishes loading, empty, record-count, and density concerns rather than encoding them as one generic table state.
- Local rationale: These patterns are useful for deterministic operational UI because display density or filter chrome can vary without silently changing business meaning. The pattern must be translated into the existing SPFx / React 17 / Fluent UI 8 stack and may not import ReUI, TanStack Table, Base UI, Radix, Tailwind, or its query-tree semantics by default.
- Authority: NONE（promotion 待ち。external component pattern != Product UI authority）
- Evidence:
  - Canonical repository: https://github.com/keenthemes/reui
  - Observed release/commit: `v2.3.0` / `0daf79dff3ebe0ede7fa05bedcaefeaac93a8949`
  - Filters source: `content/docs/(components)/base/filters.mdx`
  - Data-grid source: `content/docs/(components)/base/data-grid.mdx`
  - Observed at: `2026-08-26`

## Evaluation evidence contract

```text
knowledgeId: KI-UI-008
knowledgeState: OBSERVED
materialUseClassification: ABSTRACT_PATTERN_TRANSLATION
evaluationIntent: PATTERN_TRANSLATION
source: https://github.com/keenthemes/reui
sourceType: COMPONENT_PATTERN_CATALOG
canonicalSourceIdentity: https://github.com/keenthemes/reui/tree/0daf79dff3ebe0ede7fa05bedcaefeaac93a8949
exactPageFileComponentOrMaterialIdentity: content/docs/(components)/base/filters.mdx + content/docs/(components)/base/data-grid.mdx at commit 0daf79dff3ebe0ede7fa05bedcaefeaac93a8949
observedAt: 2026-08-26
sourceVersionCommitRelease: v2.3.0 / 0daf79dff3ebe0ede7fa05bedcaefeaac93a8949
contentDigestOrEquivalentFingerprint: filters blob e4d548c607bc5846611deb855180b7e30522a7e7; data-grid blob ffb275d107d06cc40a5f314142cacc9fff9c4319
referenceUse: PATTERN_REFERENCE
observedPatternOrGuidance: keep filter/query state independent from basic/advanced presentation chrome; distinguish loading, empty, record-count, and density presentation states explicitly
localProblemBeingSolved: allow operational list/filter presentation to vary by task and role without duplicating state models or changing domain/status/action meaning
localContractsChecked: UI-EXTERNAL-INTELLIGENCE-V1; UI Review Playbook; existing Component Catalog; Screen Templates; UI Semantic Rules; UI Visual Hierarchy H-04/H-05/H-06/H-07; role/device density; accessibility; existing interaction/status/CTA/navigation/save-state semantics
compatibilityResult: COMPATIBLE_AS_ABSTRACT_PATTERN_TRANSLATION_ONLY
stackCompatibility: ABSTRACT_PATTERN_COMPATIBLE; DIRECT_RUNTIME_REUSE_INCOMPATIBLE_WITH_LOCAL_SPFX_REACT17_FLUENTUI8_STACK
licenseOrReuseStatus: NOT_APPLICABLE_NO_CODE_OR_MATERIAL_REUSE
accessibilityImpact: LOCAL_ACCESSIBILITY_VERIFICATION_REQUIRED_IF_LATER_IMPLEMENTED; EXTERNAL_KEYBOARD_ARIA_CLAIMS_NOT_ADOPTED_AS_LOCAL_PROOF
behaviorSemanticImpact: NO_DIRECT_CHANGE; FILTER_DOMAIN_SEMANTICS_NOT_IMPORTED
motionImpact: NOT_APPLICABLE
security / dependency impact: NONE_NO_INSTALL_NO_IMPORT_NO_EXECUTION
sensitiveEvidenceHandling: PUBLIC_NON_SENSITIVE_SOURCE_IDENTITIES_ONLY; NO_CREDENTIAL_OR_PERSONAL_DATA_PERSISTED
missingOrAmbiguousEvidence: NONE
localRationale: reuse only the separation-of-state-and-chrome and explicit-list-state ideas; keep local filtering semantics, status meanings, CTA hierarchy, record identity, persistence, and role rules authoritative
terminalRecommendation: REFERENCE_ACCEPTED_TRANSLATE_ONLY
implementationRevalidationRequired: REVALIDATE_SOURCE_AND_LOCAL_CONTRACTS_IF_USED_FOR_EXACT_SLICE
implementationAuthorityReference: NONE
```

## Translation boundary

Allowed translation candidates:

```text
single local filter-state model with alternate presentation chrome
explicit loading / empty / count presentation states
role-appropriate density without changing object or workflow semantics
```

Explicitly not carried forward:

```text
ReUI component source
ReUI query-tree domain model
TanStack Table runtime
Base UI / Radix runtime
Tailwind / shadcn architecture
DnD / virtualization / infinite-scroll behavior
copied styles, icons, assets, or package dependencies
```

- Retrieval keys: ReUI, filters, state model, presentation chrome, data grid, loading state, empty state, record count, density, pattern translation
- Rule authority: NONE
- Promotion notes: `OBSERVED` only. Any Product UI change requires a separate Exact Slice and Human Implementation Start GO.