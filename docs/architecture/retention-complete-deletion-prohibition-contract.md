# 法定保存期間中の完全削除禁止（Retention Complete-Deletion Prohibition）論理契約

## 目的

**GOV-AUD-05 / DEC-012** として、法定保存期間（5年間）中の
**完全削除禁止** を論理契約として固定する。

5年経過後の削除可否、自動完全削除、物理削除の自動実行は本契約に含めない
（経過後の可否は別 Human Decision；自動実行は NOT ADOPTED）。

本単位は **Accepted logical contract** である。
cleanup / purge job / Schema 実装は含めない。

## 基準

```text
repository: yasutakesougo/severe-behavior-support-spfx
Contract ID: RetentionCompleteDeletionProhibitionPolicy
Kind: logical contract（Implementation Start ではない）
Status: Accepted（GOV-AUD-05 / DEC-012 Human Acceptance / Option A）
Human Acceptance: decision-gov-aud-05-dec-012-retention-delete-prohibition-acceptance.md
Depends on:
  Decision-AUD-RET-1 Accepted（最低5年 / 自動削除トリガにしない）
  GOV-AUD-04 Accepted / Option E
  Decision-ILB-1 Human Policy FINAL CONSISTENT
Related Issues: #19 / #8 / #17
Implementation Start: HOLD
Implementation auto-start: FORBIDDEN
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

上位入口:

- [`decision-gov-aud-05-dec-012-retention-delete-prohibition-acceptance.md`](./decision-gov-aud-05-dec-012-retention-delete-prohibition-acceptance.md)
- [`decision-aud-ret-1-auditlog-retention.md`](./decision-aud-ret-1-auditlog-retention.md)
- [`decision-gov-aud-04-logical-delete-role-acceptance.md`](./decision-gov-aud-04-logical-delete-role-acceptance.md)
- [`finding-audit-ownership.md`](./finding-audit-ownership.md)
- [`issue-24-decision-backlog.md`](./issue-24-decision-backlog.md)

## Decision 単位（混ぜない）

| ID | 決める内容 | 決めない内容 | 状態 |
|---|---|---|---|
| Decision-AUD-RET-1 | AuditLog 最低保存期間 | 物理削除許可 | **Accepted** |
| GOV-AUD-04 | 論理削除ロール | 物理/完全削除 | **Accepted / Option E** |
| **GOV-AUD-05 / DEC-012（本契約）** | 保存期間中の完全削除禁止 | 経過後の削除可否 | **Accepted / LOCKED** |
| post-retention deletion | 5年経過後の削除可否 | — | **OPEN / 別 Decision** |

## Accepted 型

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

| フィールド | 値 | 意味 |
|---|---|---|
| `kind` | `"retention_complete_deletion_prohibited"` | 保存期間中完全削除禁止 |
| `retentionYears` | `5` | 保存期間 5 年 |
| `duringRetentionCompleteDeletion` | `"prohibited"` | 期間中は完全削除しない |
| `afterRetentionDeletionPermissibility` | `"separate_decision"` | 経過後は別 Decision |
| `automaticCompleteDeletionAfterRetention` | `"not_adopted"` | 自動完全削除しない |
| `automaticPhysicalDeletionExecution` | `"not_adopted"` | 物理削除自動実行しない |

日本語正本:

```text
法定保存期間中: 完全削除を禁止する
保存期間: 5年間
5年経過後: 削除可否は別 Decision に分離する
5年経過後の自動完全削除: NOT ADOPTED
物理削除の自動実行: NOT ADOPTED
Closes only: 「5年間は完全削除しない」
```

### 禁止表現

```text
MUST NOT convert this contract into:
  purge / cleanup job Implementation Start
  5年到達 = 自動完全削除
  5年到達 = 物理削除許可の確定

MUST NOT equate:
  本契約 Accepted = post-retention deletion Accepted
```

## Explicit non-goals

```text
FindingCode: HOLD
A-5: HOLD
Implementation Start: HOLD
post-retention deletion Decision: OPEN
Schema / SharePoint / UI / job: NOT STARTED
```
