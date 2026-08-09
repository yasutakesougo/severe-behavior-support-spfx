# Decision-AS-SCHEMA-ID-1 — Schema ID value / naming Human Acceptance

この文書は、**Decision-AS-SCHEMA-ID-1**（AssessmentSnapshot Schema ID の
naming rule / concrete value）についての **Human Acceptance 正本（LOCKED）** である。

Compare packet:
[`decision-assessment-snapshot-schema-id-value-naming-packet.md`](./decision-assessment-snapshot-schema-id-value-naming-packet.md)

Proceed acceptance:
[`decision-schema-id-value-naming-proceed-acceptance.md`](./decision-schema-id-value-naming-proceed-acceptance.md)

Selected via:
[`decision-ilb-1-eleventh-residual-schema-id-selection.md`](./decision-ilb-1-eleventh-residual-schema-id-selection.md)

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-AS-SCHEMA-ID-1
Status: Accepted / LOCKED
Human Decision: ACCEPT
Human Acceptance: Explicit Human Decision on 2026-08-09

LOCKED:

Naming rule:
  NR-1 — {product}.{aggregate}.{artifact}
  （小文字ドット区切り / SupportPlan 同型）
Concrete Schema ID:
  ID-1 — severe-behavior-support.assessment-snapshot.snapshot
Initial schemaVersion:
  SV-HOLD — 未設定のまま維持
  schemaVersion / dtoVersion = HOLD / NOT DECIDED
  （DTO / Schema 実装着手時の別 Decision まで）

Implementation Start:
  HOLD
TypeScript / validator / fixture / tests:
  DO NOT START
Schema / DTO implementation:
  DO NOT START
Schema ID assignment into code / DTO / SharePoint:
  HOLD / NOT STARTED
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
  Decision-AS-SCHEMA-ID-1 naming rule + concrete Schema ID string
Does NOT close:
  schemaVersion / dtoVersion adoption
  Schema / DTO / SharePoint / adapter implementation
  application save
  FindingCode / A-5
  Implementation Start
Implementation auto-start: FORBIDDEN
value invention beyond Accepted ID-1: FORBIDDEN
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

## Human Acceptance（固定結論）

```text
Human Decision: ACCEPT
Decision-AS-SCHEMA-ID-1: Accepted / LOCKED

Naming rule:
  NR-1 — {product}.{aggregate}.{artifact}

Concrete Schema ID:
  ID-1 — severe-behavior-support.assessment-snapshot.snapshot

Initial schemaVersion:
  SV-HOLD — 未設定のまま維持
```

日本語正本:

```text
NR-1:
  既存 SupportPlan と同型の小文字ドット区切り命名規則を採択する。
ID-1:
  AssessmentSnapshot 完全契約の安定 Schema ID として
  severe-behavior-support.assessment-snapshot.snapshot
  を採択する。
SV-HOLD:
  初回 schemaVersion / dtoVersion は今回決めない。
  DTO / Schema 実装着手時の別 Decision まで HOLD とする。
```

```text
Agent recommendation: NOT Human Acceptance evidence
This document records the Human Decision only.
```

## Accepted 内容

```text
Decision-AS-SCHEMA-ID-1: Accepted / LOCKED

Naming rule = NR-1 / Accepted
Schema ID = severe-behavior-support.assessment-snapshot.snapshot / Accepted
schemaVersion = HOLD / NOT DECIDED
dtoVersion = HOLD / NOT DECIDED（DEC-1: dtoVersion = schemaVersion）

NOT SELECTED:
  NR-2 / NR-3 / NR-4 / NR-X
  ID-2 / ID-3 / ID-4 / ID-X
  SV-1 / SV-X
```

方針整合:

- [`assessment-snapshot-schema-dto-versioning.md`](./assessment-snapshot-schema-dto-versioning.md)（Entry #7 / DEC-1）
- [`contracts-v1.md`](./contracts-v1.md)（DEC-1）
- SupportPlan 先例（UNCHANGED）:
  `severe-behavior-support.support-plan.plan`
  `severe-behavior-support.support-plan.plan-version`

### この決定からは導出しない

```text
NOT derived / MUST NOT equate:
  Decision-AS-SCHEMA-ID-1 Accepted = schemaVersion 1.0.0 採択
  Decision-AS-SCHEMA-ID-1 Accepted = dtoVersion 作成
  Decision-AS-SCHEMA-ID-1 Accepted = TypeScript への schemaId 追加
  Decision-AS-SCHEMA-ID-1 Accepted = validator / fixture / tests 変更
  Decision-AS-SCHEMA-ID-1 Accepted = Schema / DTO 実装開始
  Decision-AS-SCHEMA-ID-1 Accepted = SharePoint / adapter / DEC-6 開始
  Decision-AS-SCHEMA-ID-1 Accepted = application save 開始
  Decision-AS-SCHEMA-ID-1 Accepted = FindingCode / A-5 再開
  Decision-AS-SCHEMA-ID-1 Accepted = Implementation Start
  Decision-AS-SCHEMA-ID-1 Accepted = Ready / Merge
```

## Acceptance boundary

```text
This Acceptance locks naming + concrete Schema ID string only.

MUST NOT start from this Acceptance alone:
  schemaVersion / dtoVersion concrete adoption（含む 1.0.0 補完）
  TypeScript type / validator / fixture / contract tests
  Schema / DTO implementation
  SharePoint columns / adapter / DEC-6
  application save
  FindingCode / A-5
  Implementation Start
  Deploy / real data
```

## Next

```text
Decision-AS-SCHEMA-ID-1: Accepted / LOCKED
schemaVersion / dtoVersion: HOLD / NOT DECIDED
Schema ID code assignment / DTO / SharePoint: HOLD / NOT STARTED
Implementation Start: HOLD
FindingCode / A-5: HOLD
Next substantive unit: NOT SELECTED by this Acceptance
Ready: NOT RUN
Merge: NOT RUN
```
