# Decision-AS-SCHEMA-VERSION-1 — schemaVersion / dtoVersion Human Acceptance

この文書は、**Decision-AS-SCHEMA-VERSION-1**（AssessmentSnapshot 初回
schemaVersion / dtoVersion 具体値）についての **Human Acceptance 正本（LOCKED）** である。

Compare packet:
[`decision-assessment-snapshot-schema-version-packet.md`](./decision-assessment-snapshot-schema-version-packet.md)

Selected via:
[`decision-ilb-1-twelfth-residual-schemaversion-selection.md`](./decision-ilb-1-twelfth-residual-schemaversion-selection.md)

Schema ID Acceptance:
[`decision-assessment-snapshot-schema-id-value-naming-acceptance.md`](./decision-assessment-snapshot-schema-id-value-naming-acceptance.md)

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-AS-SCHEMA-VERSION-1
Status: Accepted / LOCKED
Human Decision: A
Human Acceptance: Explicit Human Decision on 2026-08-09

LOCKED:

Selected Option:
  A — Initial version = 1.0.0
schemaVersion:
  1.0.0
dtoVersion:
  1.0.0
  （DEC-1: dtoVersion = Schema Version）

Schema ID（前提・UNCHANGED）:
  severe-behavior-support.assessment-snapshot.snapshot
  Accepted / LOCKED（Decision-AS-SCHEMA-ID-1）

Implementation Start:
  HOLD
TypeScript / validator / fixtures / tests:
  DO NOT START
Schema ID / schemaVersion / dtoVersion のコード割当:
  DO NOT START
Schema / DTO implementation:
  DO NOT START
SharePoint / adapter / DEC-6:
  HOLD
application save:
  HOLD
FindingCode:
  HOLD
A-5:
  HOLD
Deploy / real data:
  NO-GO

Closes only:
  Decision-AS-SCHEMA-VERSION-1 concrete initial schemaVersion / dtoVersion
Does NOT close:
  TypeScript / DTO / SharePoint / adapter implementation
  application save
  FindingCode / A-5
  Implementation Start
Implementation auto-start: FORBIDDEN
SemVer invention beyond Accepted 1.0.0: FORBIDDEN without new Human Decision
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

## Human Acceptance（固定結論）

```text
Human Decision: A
Decision-AS-SCHEMA-VERSION-1: Accepted / LOCKED

schemaVersion = 1.0.0
dtoVersion    = 1.0.0
```

日本語正本:

```text
A:
  AssessmentSnapshot 初回 schemaVersion / dtoVersion を 1.0.0 として採択する。
  DEC-1 により両値は同一。
B:
  NOT SELECTED
```

```text
Agent recommendation（A）: NOT Human Acceptance evidence
This document records the Human Decision only.
```

## Accepted 内容

```text
Decision-AS-SCHEMA-VERSION-1: Accepted / LOCKED / Option A

Schema identity pair（logical）:
  Schema ID = severe-behavior-support.assessment-snapshot.snapshot
  schemaVersion = 1.0.0
  dtoVersion = 1.0.0

NOT SELECTED:
  B — HOLD
```

方針整合:

- [`assessment-snapshot-schema-dto-versioning.md`](./assessment-snapshot-schema-dto-versioning.md)
- [`contracts-v1.md`](./contracts-v1.md)（DEC-1）
- SupportPlan 先例（UNCHANGED）: `@ 1.0.0`

### この決定からは導出しない

```text
NOT derived / MUST NOT equate:
  Decision-AS-SCHEMA-VERSION-1 Accepted = Implementation Start
  Decision-AS-SCHEMA-VERSION-1 Accepted = TypeScript への schemaId / schemaVersion 追加
  Decision-AS-SCHEMA-VERSION-1 Accepted = validator / fixture / tests 変更
  Decision-AS-SCHEMA-VERSION-1 Accepted = Schema / DTO 実装開始
  Decision-AS-SCHEMA-VERSION-1 Accepted = SharePoint / adapter / DEC-6 開始
  Decision-AS-SCHEMA-VERSION-1 Accepted = application save 開始
  Decision-AS-SCHEMA-VERSION-1 Accepted = FindingCode / A-5 再開
  Decision-AS-SCHEMA-VERSION-1 Accepted = Ready / Merge
```

## Acceptance boundary

```text
This Acceptance locks initial schemaVersion / dtoVersion = 1.0.0 only.

MUST NOT start from this Acceptance alone:
  TypeScript type / validator / fixture / contract tests
  Schema ID / schemaVersion / dtoVersion のコード割当
  Schema / DTO implementation
  SharePoint columns / adapter / DEC-6
  application save
  FindingCode / A-5
  Implementation Start
  Deploy / real data
```

## Next

```text
Decision-AS-SCHEMA-VERSION-1: Accepted / LOCKED / A = 1.0.0
Schema ID / schemaVersion / dtoVersion code assignment: DO NOT START
Implementation Start: HOLD
FindingCode / A-5: HOLD
Next substantive unit: NOT SELECTED by this Acceptance
Ready: NOT RUN
Merge: NOT RUN
```
