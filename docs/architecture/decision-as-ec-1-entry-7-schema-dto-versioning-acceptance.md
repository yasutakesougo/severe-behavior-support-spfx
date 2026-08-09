# AS-EC-1 Entry #7 — Schema / DTO versioning 方針 Human Acceptance

この文書は、**Decision-AS-EC-1** Entry Criteria **#7**
（Schema ID・schemaVersion・DTO versioning 方針）についての
**Human Acceptance 正本（LOCKED）** である。

方針本体: [`assessment-snapshot-schema-dto-versioning.md`](./assessment-snapshot-schema-dto-versioning.md)

Selected via: [`decision-ilb-1-eighth-residual-decision-selection.md`](./decision-ilb-1-eighth-residual-decision-selection.md)
（ILB-1 eighth residual / Option A — AS-EC-1 Entry #7）

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-AS-EC-1 Entry #7（Schema / DTO versioning policy）
Status: Accepted / LOCKED
Human Acceptance: Explicit Human Decision on 2026-08-09
Selected Option: A（Entry #7）
Selected meaning:
  AssessmentSnapshot 完全契約の Schema / DTO versioning は DEC-1 に従う
  固有 Schema ID 文字列の採番は今行わない

LOCKED:

Schema / DTO versioning:
  DEC-1 に従う
Schema ID:
  安定識別子（SP List名 / TS 型名と同一視しない）
Schema Version:
  SemVer
DTO Version:
  Schema Version と同一
AssessmentSnapshot 固有 Schema ID 採番:
  今は行わない
この段階で行うこと:
  versioning 方針を正本化する
  Entry #7 を PASS / MET として閉じる
この段階で行わないこと:
  Schema ID / schemaVersion 具体値の採択
  SharePoint / DTO 実装
  TypeScript型 / validator / fixture / contract tests 実装
  PR-J 実装開始
FindingCode:
  HOLD
A-5:
  HOLD
Implementation Start:
  HOLD
PR-J implementation:
  DO NOT START

Closes only:
  AS-EC-1 Entry #7（versioning 方針 = DEC-1；固有 ID 採番は今しない）
Does NOT close:
  AS-EC-1 overall Entry satisfied
  AssessmentSnapshot Schema ID 具体値
  SharePoint / DTO 実装
  FindingCode / A-5
  TypeScript / validator / fixture / contract tests の実装着手
  PR-J の GitHub PR 採番・コード実装
Implementation auto-start: FORBIDDEN
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

## Human Acceptance（固定結論）

```text
Human Acceptance: Explicit Human Decision on 2026-08-09
AS-EC-1 Entry #7: Accepted / LOCKED / PASS / MET
Selected: A — Entry #7

Schema / DTO versioning: DEC-1 に従う
固有 Schema ID 採番: 今は行わない
この段階: versioning 方針の固定のみ
この段階で行わない: Schema ID 発明 / SharePoint・DTO 実装 / PR-J 実装
```

```text
Agent recommendation: NOT Human Acceptance evidence
This document records the Human Decision only.
```

## Accepted 内容

```text
AS-EC-1 Entry #7: Accepted / LOCKED / PASS / MET（Option A）
Meaning:
  AssessmentSnapshot complete-contract versioning MUST follow DEC-1
  Schema ID / SemVer / DTO Version = Schema Version
  concrete AssessmentSnapshot Schema ID is NOT assigned in this Acceptance
  this Acceptance does NOT authorize SharePoint / DTO / code implementation
```

方針正本:

- [`assessment-snapshot-schema-dto-versioning.md`](./assessment-snapshot-schema-dto-versioning.md)
- 共通: [`contracts-v1.md`](./contracts-v1.md)（DEC-1）

### この決定からは導出しない

```text
NOT derived / MUST NOT equate:
  Entry #7 Accepted = Schema ID 文字列の採択
  Entry #7 Accepted = SharePoint / DTO 実装開始
  Entry #7 Accepted = AS-EC-1 overall Entry satisfied
  Entry #7 Accepted = PR-J / TypeScript 実装開始
  Entry #7 Accepted = DEC-1 の再定義
```

## Acceptance boundary

```text
NOT started from this Acceptance alone:
  AssessmentSnapshot Schema ID assignment
  schemaVersion / dtoVersion concrete adoption
  SharePoint / DTO / provider
  TypeScript type / validator / fixture / contract tests
  FindingCode / A-5
  Implementation Start
  PR-J implementation
  AS-EC-1 overall Entry satisfied
```

## AS-EC-1 との関係

```text
AS-EC-1 Entry #7: Accepted / LOCKED / PASS / MET（本文書 + 方針）
AS-EC-1 Entry #1: PASS / MET
AS-EC-1 Entry #2: PASS / MET（PR-J）
AS-EC-1 Entry #3: Accepted（DEC-009）
AS-EC-1 Entry #4: Accepted（GOV-AUD-03 Option E）
AS-EC-1 Entry #5: PASS / MET（findingIds NOT REQUIRED）
AS-EC-1 Entry #6: PASS / MET（NOT_APPLICABLE HOLD方針）
AS-EC-1 Entry #8: Accepted / LOCKED / FINAL CONSISTENT（plan only）
Decision-AS-EC-1 overall: MET / Accepted（[`decision-as-ec-1-overall-entry-acceptance.md`](./decision-as-ec-1-overall-entry-acceptance.md)）
  （overall MET ≠ Implementation Start / PR-J / FindingCode / A-5）
```

## Next

```text
AS-EC-1 Entry #7: Accepted / LOCKED / Option A / PASS / MET
  Consistency: decision-as-ec-1-entry-7-canonicalization-consistency-check.md
Decision-AS-EC-1 overall: MET / Accepted / LOCKED（ninth residual Option A）
FindingCode / A-5 / Implementation / PR-J: HOLD
Next residual Decision: NOT SELECTED（Implementation Start は別 Human）
```
