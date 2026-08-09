# Decision-AUD-RET-1 — AuditLog 保存期間

この文書は、AuditEvent 実保存前の **Decision-AUD-RET-1** の Accepted 正本である。

## 基準

```text
repository: yasutakesougo/severe-behavior-support-spfx
main before this decision-doc update: 52bfc478d803500845a95985c66c8892524cbc32
Decision ID: Decision-AUD-RET-1
Status: Accepted
Accepted evidence: Issue #19 comment 5215844603
Owner refs: GOV-AUD-06（Issue #19） / DEC-011（Issue #8）
```

## Accepted 内容

```text
minimum retention: 5 years
clock start: AuditEvent.occurredAt
elapsed 5 years alone MUST NOT trigger automatic deletion
```

意味:

- `occurredAt` から最低 5 年は保持する。
- 5 年到達を自動物理削除トリガにしない。
- より長い法令・法人文書管理規程等がある場合は長い方を優先する。
- 削除・完全消去は別 Decision（`GOV-AUD-05` / `DEC-012` 等）に従う。
  法定保存期間中の完全削除禁止は
  [`decision-gov-aud-05-dec-012-retention-delete-prohibition-acceptance.md`](./decision-gov-aud-05-dec-012-retention-delete-prohibition-acceptance.md)
  で **Accepted / LOCKED**（5年経過後の可否は別 Decision）。

## 決めないこと

- 書込先所有（Decision-AUD-WR-1）
- SharePoint List / 列 mapping
- 自動削除ジョブ
- AuditEvent candidate builder の再定義
- deploy / 実データ

## Gate

```text
Decision-AUD-RET-1: Accepted
retention blocker for persistence contract: CLEARED
GOV-AUD-05 / DEC-012 retention prohibition: Accepted / LOCKED（Option A）
post-retention deletion: separate OPEN Decision
SharePoint / Microsoft 365 / Deploy: NO-GO
```
