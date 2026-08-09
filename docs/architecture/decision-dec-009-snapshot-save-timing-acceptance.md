# DEC-009 — AssessmentSnapshot 保存タイミング Human Acceptance

この文書は、**DEC-009**（AssessmentSnapshot の保存タイミング）についての
**Human Acceptance 正本（LOCKED）** である。

論理契約: [`assessment-snapshot-save-timing-contract.md`](./assessment-snapshot-save-timing-contract.md)

Selected via: [`decision-ilb-1-third-residual-decision-selection.md`](./decision-ilb-1-third-residual-decision-selection.md)
（ILB-1 third residual / Option A）

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: DEC-009（AssessmentSnapshot save timing）
Status: Accepted / LOCKED
Human Acceptance: Explicit Human Option A on 2026-08-09
Selected Option: A
Selected via: ILB1_THIRD_RESIDUAL_DECISION_SELECTION Option A

LOCKED:

アセスメント作成途中:
  下書き扱い
正式記録:
  確定時に保存
確定後の修正:
  元の確定記録を残す
修正後:
  新しい版として保存する
既存確定記録の上書き:
  NOT ADOPTED
履歴:
  保持する
FindingCode:
  HOLD
A-5:
  HOLD
Implementation Start:
  HOLD

Closes only:
  AssessmentSnapshot 保存タイミングの業務意味
  （下書き / 確定時保存 / 版管理・履歴保持 / 上書き禁止）
Does NOT close:
  AS-EC-1 全体の Entry satisfied 宣言
  Schema / DTO / SharePoint storage / provider
  Finding / findingIds 境界
  GOV-AUD-03 訂正承認ロール Binding（Accepted / Option E 維持）
Implementation auto-start: FORBIDDEN
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

## Human Acceptance（固定結論）

```text
Human Acceptance: Explicit Human Option A on 2026-08-09
DEC-009: Accepted / LOCKED
Selected Option: A

アセスメント作成途中: 下書き扱い
正式記録: 確定時に保存
確定後の修正: 元の確定記録を残す
修正後: 新しい版として保存する
既存確定記録の上書き: NOT ADOPTED
履歴: 保持する
```

理由（Human / 境界）:

```text
正式記録は確定時に残す。
確定後の修正は上書きせず、元を残して新しい版として保存し、履歴を保持する。
作成途中は下書き扱いとする。
```

```text
Agent recommendation: NOT Human Acceptance evidence
This document records the Human Decision only.
```

## Accepted 内容

```text
DEC-009: Accepted / LOCKED（Option A）
Scope locked:
  in-progress assessment: draft handling
  formal record: save on finalize / confirm
  after finalize, correction:
    retain original finalized record
    save correction as a new version
  overwrite of existing finalized record: NOT ADOPTED
  history: retained
```

論理表現（schema / storage 実装ではない）:

```ts
type AssessmentSnapshotSaveTimingPolicy = {
  kind: "assessment_snapshot_save_timing";
  inProgressHandling: "draft";
  formalRecordSavePoint: "on_finalize";
  postFinalizeCorrection: "retain_original_and_save_new_version";
  overwriteFinalizedRecord: "not_adopted";
  historyRetention: "retain";
};
```

意味:

- アセスメント作成途中の内容は **下書き扱い** とする。
- **正式記録**は確定時に保存する。
- 確定後の修正では、元の確定記録を残し、修正後は新しい版として保存する。
- 既存確定記録の上書きは採択しない。
- 履歴は保持する。
- AS-EC-1 Entry Criteria #3（DEC-009 保存タイミング）を満たす候補となる。
- AS-EC-1 全体・保存実装・Schema は本 Acceptance だけでは開始しない。

### この決定からは導出しない

```text
NOT derived / MUST NOT equate:
  本 Acceptance = AS-EC-1 overall Entry satisfied
  本 Acceptance = Snapshot Schema / DTO / SharePoint 実装開始
  本 Acceptance = FindingCode / findingIds 境界の確定
  本 Acceptance = GOV-AUD-03 訂正承認ロール Binding の再定義
  下書き = 正式記録
  確定後修正 = 既存確定記録の上書き
```

既存契約との関係（変更しない）:

```text
Result conversion（永続なし）: UNCHANGED
GOV-AUD-03: Accepted / Option E（application 対象外 / UNCHANGED）
GOV-AUD-04 / GOV-AUD-05·DEC-012 retention prohibition: UNCHANGED
Decision-AUD-RET-1: UNCHANGED
Finding catalog DEC-019: EMPTY / NOT ADOPTED（UNCHANGED）
```

## Acceptance boundary

```text
NOT derived / MUST NOT start from this Acceptance alone:
  AS-EC-1 overall Entry satisfied
  AssessmentSnapshot 保存実装
  Schema / DTO / validator / fixture
  SharePoint / provider / UI
  FindingCode 作成
  A-5
  Implementation Start
  他 inventory 行の Accepted
  SharePoint / M365 / Deploy / real data
```

## AS-EC-1 との関係

```text
AS-EC-1 Entry Criteria #3（DEC-009）:
  Accepted / LOCKED（本文書）
Decision-AS-EC-1 overall:
  HOLD（残条件あり）
```

残る主な Entry 条件の例: Finding / findingIds 境界、`NOT_APPLICABLE` reason、
Schema / DTO versioning、型・validator・fixture 計画。

## Next

```text
DEC-009: Accepted / LOCKED / Option A
PR #157: MERGED
Consistency: FINAL CONSISTENT（decision-dec-009-canonicalization-consistency-check.md）
AS-EC-1 overall / FindingCode / A-5 / Implementation: HOLD
Next residual Decision: NOT SELECTED
```
