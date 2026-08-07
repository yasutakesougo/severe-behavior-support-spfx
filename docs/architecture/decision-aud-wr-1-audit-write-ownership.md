# Decision-AUD-WR-1 — AuditEvent 書込先所有

この文書は、AuditEvent 実保存前の **Decision-AUD-WR-1** を固定する。

状態は **Pending**（最終候補あり・人 Accepted 待ち）。
本 PR で Accepted にしない。adapter / SharePoint 実装を開始しない。

## 基準

```text
repository: yasutakesougo/severe-behavior-support-spfx
main: 89d868c734d30157f7141e929ec16662fa5d5bb3
PR #97 / AuditEvent persistence Entry Criteria: MERGED
Decision ID: Decision-AUD-WR-1
Status: Pending（最終候補作成済み）
```

上位入口:

- [`audit-event-persistence-entry-criteria.md`](./audit-event-persistence-entry-criteria.md)
- [`finding-audit-ownership.md`](./finding-audit-ownership.md)

## 判断単位

```text
Question:
  AuditEvent 実保存（repository port / adapter / 永続ストア境界）の
  technical owner Issue はどれか。
```

## 最終候補（未承認・採択ではない）

```text
Status: Pending candidate
ID: Decision-AUD-WR-1

実保存 technical owner = Issue #22A
```

意味:

- 候補生成（Issue #17 / PR #96）と実保存所有を分離する
- `#22A` は人が命名・採番した候補 ID として記録する（本 PR で Issue を作成しない）
- 保存期間ポリシー（AUD-RET-1）とは独立に承認可能

## 決めないこと

- 保存期間の具体値（Decision-AUD-RET-1）
- SharePoint List / 列 mapping の確定
- retry / 冪等の実装詳細
- UI / deploy / 実データ
- `buildHandoffStatusChangedAuditEventCandidate` の再定義

## Gate

```text
Decision-AUD-WR-1: Pending（候補あり）
AuditEvent 実保存設計: HOLD
AuditEvent 実保存実装: HOLD
SharePoint adapter: NO-GO
SharePoint / Microsoft 365 / Deploy: NO-GO
```

## 人向け Accepted 投稿案（未投稿）

```text
Status: Accepted
ID: Decision-AUD-WR-1

Technical owner for AuditEvent persistence:
  Issue #22A

Separation:
  - candidate builder ownership remains Issue #17 / PR #96
  - retention remains Decision-AUD-RET-1
  - GOV-AUD-06 / DEC-011 answer is independent but both must be Accepted
    before persistence design Start

OUT:
  SharePoint List creation / M365 / deploy / real data
```
