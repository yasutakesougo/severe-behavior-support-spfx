# Decision-AUD-WR-1 — AuditEvent 書込先所有

この文書は、AuditEvent 実保存前の **Decision-AUD-WR-1** の Accepted 正本である。

## 基準

```text
repository: yasutakesougo/severe-behavior-support-spfx
main before this decision-doc update: 52bfc478d803500845a95985c66c8892524cbc32
Decision ID: Decision-AUD-WR-1
Status: Accepted
Accepted evidence: Issue #17 comment 5215846338
```

## Accepted 内容

```text
AuditEvent persistence technical owner: Issue #22A
```

責務分離:

- AuditEvent 型・validator: Issue #27
- Handoff 監査運用・candidate: Issue #17
- 法人保存方針: Issue #19 / DEC-011
- repository / adapter 論理契約: Issue #22A
- 物理 SharePoint 構成: Issue #29
- concrete SharePoint adapter: Issue #22B

## 決めないこと

- SharePoint List / 列 mapping
- retry / 冪等の具体実装
- UI
- Microsoft 365 変更
- deploy / 実データ
- `buildHandoffStatusChangedAuditEventCandidate` の再定義

## Gate

```text
Decision-AUD-WR-1: Accepted
ownership blocker for persistence contract: CLEARED
AuditEvent persistence technical contract: MERGED（PR #99）
Logical persistence / Replay: MERGED（PR #104 / #106）
Decision-AUD-REPO-1: Accepted
Issue #29 physical definition / mapping alignment: Accepted
Canonicalization to main: PENDING / THIS PR（docs-only）
Dependency blocker: NOT CLEARED
Next: Merge 後に Concrete Repository Entry Review 再実行
Concrete repository / #22B: HOLD
SharePoint adapter: NO-GO
SharePoint / Microsoft 365 / Deploy: NO-GO
```
