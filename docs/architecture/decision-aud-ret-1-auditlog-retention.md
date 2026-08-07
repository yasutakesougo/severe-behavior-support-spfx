# Decision-AUD-RET-1 — AuditLog 保存期間

この文書は、AuditEvent 実保存前の **Decision-AUD-RET-1** を固定する。

状態は **Pending**（最終候補あり・人 Accepted 待ち）。
本 PR で Accepted にしない。保存期間をコードへ埋め込まない。

## 基準

```text
repository: yasutakesougo/severe-behavior-support-spfx
main: 89d868c734d30157f7141e929ec16662fa5d5bb3
PR #97 / AuditEvent persistence Entry Criteria: MERGED
Decision ID: Decision-AUD-RET-1
Status: Pending（最終候補作成済み）
正本参照: GOV-AUD-06（Issue #19） / DEC-011（Issue #8）
```

上位入口:

- [`audit-event-persistence-entry-criteria.md`](./audit-event-persistence-entry-criteria.md)
- [`finding-audit-ownership.md`](./finding-audit-ownership.md)

## 判断単位

```text
Question:
  AuditLog（AuditEvent 実保存後の保持）の保存期間ポリシーは何か。
```

## 最終候補（未承認・採択ではない）

```text
Status: Pending candidate
ID: Decision-AUD-RET-1

1. 最低保存期間: 5年
2. 起算: occurredAt
3. 5年経過だけでは自動削除しない
```

意味:

- `occurredAt` から最低 5 年は保持する
- 5 年到達を自動物理削除トリガにしない
- 削除・完全消去は別 Decision（`GOV-AUD-05` / `DEC-012` 等）の対象

## 決めないこと

- 書込先所有（Decision-AUD-WR-1）
- SharePoint List / 列
- 自動削除ジョブの実装
- AuditEvent 候補 builder の再定義
- deploy / 実データ

## Gate

```text
Decision-AUD-RET-1: Pending（候補あり）
AuditEvent 実保存設計: HOLD
AuditEvent 実保存実装: HOLD
SharePoint / Microsoft 365 / Deploy: NO-GO
```

## 人向け Accepted 投稿案（未投稿）

```text
Status: Accepted
ID: Decision-AUD-RET-1
Owner refs: GOV-AUD-06 / DEC-011

Retention policy:
  - minimum retention: 5 years
  - clock start: occurredAt
  - elapsed 5 years alone MUST NOT trigger automatic deletion

OUT:
  write ownership (AUD-WR-1)
  SharePoint / adapter / deploy
```
