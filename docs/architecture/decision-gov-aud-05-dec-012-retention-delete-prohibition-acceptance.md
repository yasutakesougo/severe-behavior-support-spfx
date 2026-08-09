# GOV-AUD-05 / DEC-012 — 法定保存期間中の完全削除禁止 Human Acceptance

この文書は、**GOV-AUD-05**（物理削除方針）および **DEC-012**（論理削除データの完全削除方針）のうち、
**法定保存期間中は完全削除しない** という範囲についての
**Human Acceptance 正本（LOCKED）** である。

論理契約: [`retention-complete-deletion-prohibition-contract.md`](./retention-complete-deletion-prohibition-contract.md)

Selected via: [`decision-ilb-1-second-residual-decision-selection.md`](./decision-ilb-1-second-residual-decision-selection.md)
（ILB-1 second residual / Option A）

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: GOV-AUD-05 / DEC-012（retention-period complete-deletion prohibition）
Status: Accepted / LOCKED
Human Acceptance: Explicit Human Option A on 2026-08-09
Selected Option: A
Selected via: ILB1_SECOND_RESIDUAL_DECISION_SELECTION Option A

LOCKED:

法定保存期間中:
  完全削除を禁止する
保存期間:
  5年間
5年経過後:
  削除可否は別 Decision に分離する
5年経過後の自動完全削除:
  NOT ADOPTED
物理削除の自動実行:
  NOT ADOPTED
FindingCode:
  HOLD
A-5:
  HOLD
Implementation Start:
  HOLD

Closes only:
  「5年間は完全削除しない」
Does NOT close:
  5年経過後の削除可否（別 Human Decision）
Implementation auto-start: FORBIDDEN
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

## Human Acceptance（固定結論）

```text
Human Acceptance: Explicit Human Option A on 2026-08-09
GOV-AUD-05 / DEC-012（retention prohibition）: Accepted / LOCKED
Selected Option: A

法定保存期間中: 完全削除を禁止する
保存期間: 5年間
5年経過後: 削除可否は別 Decision に分離する
5年経過後の自動完全削除: NOT ADOPTED
物理削除の自動実行: NOT ADOPTED
```

理由（Human / 境界）:

```text
この判断で閉じるのは、「5年間は完全削除しない」という部分だけ。
5年経過後の削除可否は別の Human Decision として残す。
```

```text
Agent recommendation: NOT Human Acceptance evidence
This document records the Human Decision only.
```

## Accepted 内容

```text
GOV-AUD-05 / DEC-012: Accepted / LOCKED（Option A）
Scope locked:
  during statutory retention (5 years): complete deletion PROHIBITED
  retention period: 5 years
  after 5 years: deletion permissibility = SEPARATE Decision（OPEN）
  automatic complete deletion after 5 years: NOT ADOPTED
  automatic physical deletion execution: NOT ADOPTED
```

論理表現（schema / job 実装ではない）:

```ts
type RetentionCompleteDeletionProhibitionPolicy = {
  kind: "retention_complete_deletion_prohibited";
  retentionYears: 5;
  duringRetentionCompleteDeletion: "prohibited";
  afterRetentionDeletionPermissibility: "separate_decision";
  automaticCompleteDeletionAfterRetention: "not_adopted";
  automaticPhysicalDeletionExecution: "not_adopted";
};
```

意味:

- 法定保存期間（5年間）中は、完全削除を禁止する。
- GOV-AUD-05（物理削除）と DEC-012（論理削除データの完全削除）の
  **当該範囲**を本 Acceptance で閉じる。
- 5年経過後に削除してよいかは **別 Human Decision** に残す（本文書では決めない）。
- 5年経過後の自動完全削除、および物理削除の自動実行は採択しない。
- Decision-AUD-RET-1（AuditLog 最低5年 / 5年到達だけでは自動削除しない）と整合する。

### この決定からは導出しない

```text
NOT derived / MUST NOT equate:
  5年経過 = 自動完全削除
  5年経過 = 物理削除実行許可
  本 Acceptance = 5年経過後の削除可否の確定
  論理削除概念の廃止
  cleanup / purge job の実装開始
```

既存契約との関係（変更しない）:

```text
Decision-AUD-RET-1: Accepted（最低5年 / occurredAt / 5年到達 alone ≠ 自動削除）
GOV-AUD-03 / GOV-AUD-04: Accepted / Option E（UNCHANGED）
Decision-RD-3: FINAL CONSISTENT（UNCHANGED）
Decision-ILB-1 Human Policy: FINAL CONSISTENT（上位方針）
```

## Acceptance boundary

```text
NOT derived / MUST NOT start from this Acceptance alone:
  5年経過後の削除可否の Accepted
  自動完全削除 / 自動物理削除ジョブ
  FindingCode 作成
  A-5
  Implementation Start
  Schema / SharePoint / UI / cleanup job 実装
  論理削除ロール Binding（GOV-AUD-04）
  他 inventory 行の Accepted
  SharePoint / M365 / Deploy / real data
```

## Separate Decision（OPEN）

```text
ID（暫定ラベル）: GOV-AUD-05 / DEC-012 post-retention deletion permissibility
Status: NOT SELECTED / NOT Accepted
Meaning to decide later:
  5年経過後に完全削除・物理削除を許可するか否か
MUST NOT be auto-started from this Acceptance
```

## Next

```text
GOV-AUD-05 / DEC-012 retention prohibition: Accepted / LOCKED / Option A
Next after Merge:
  FINAL CONSISTENT 同期（別 PR）または次残存 Decision の Human 選定
  post-retention deletion: 別 Human Decision（OPEN）
FindingCode / A-5 / Implementation: HOLD
```
