# AuditEvent 実保存 — Entry Criteria / 次工程ゲート

この文書は、Handoff AuditEvent **候補生成**（PR #96 MERGED）完了後に、
**実保存境界の設計へ進む前**に確認する Entry Criteria 正本である。

保存期間・書込先所有の **最終候補は作成済み**だが、人 Accepted までは採択しない。
SharePoint / adapter / deploy を開始しない。

## 基準

```text
repository: yasutakesougo/severe-behavior-support-spfx
main: 89d868c734d30157f7141e929ec16662fa5d5bb3
PR #97 / 本 Entry Criteria 初版: MERGED
PR #96 / Handoff AuditEvent candidate: MERGED
HANDOFF_STATUS_CHANGED Accepted comment: 5215557663（Issue #17）
Decision-HO-1: Accepted（Owner #17）
Decision-AUD-RET-1: Pending（最終候補あり）
Decision-AUD-WR-1: Pending（最終候補あり）
AuditEvent 実保存設計: HOLD
AuditEvent 実保存実装: HOLD
SharePoint / Microsoft 365: NO-GO
Deploy: NO-GO
```

上位入口:

- [`handoff-audit-event.md`](./handoff-audit-event.md)
- [`finding-audit-ownership.md`](./finding-audit-ownership.md)
- [`decision-aud-ret-1-auditlog-retention.md`](./decision-aud-ret-1-auditlog-retention.md)
- [`decision-aud-wr-1-audit-write-ownership.md`](./decision-aud-wr-1-audit-write-ownership.md)
- [`domain-reconstruction-foundation.md`](./domain-reconstruction-foundation.md)

## 完了済み（再オープンしない）

| 単位 | 状態 | 正本 |
|---|---|---|
| Handoff 状態遷移 | MERGED（PR #90） | `handoff-status-transition.md` |
| 現場主体ロールポリシー | MERGED（PR #91） | `handoff-transition-role-policy.md` |
| HandoffState timestamp / actor mutation | MERGED（PR #93） | `handoff-state-mutation.md` |
| AuditEvent candidate builder | MERGED（PR #96） | `handoff-audit-event.md` |
| 本 Entry Criteria 初版 | MERGED（PR #97） | 本文書 |

候補の固定形（再定義しない）:

```text
actionCode: HANDOFF_STATUS_CHANGED
targetType: HandoffState
result: success
reasonCode: HANDOFF_<変更前>_TO_<変更後>
```

前進・差し戻しとも同一 `actionCode`。方向は `reasonCode` で追跡する。

## 次工程で決めること（実保存設計の前）

実保存境界の docs / 実装に入る前に、次を **独立に** Accepted する。
一括 Accepted 前提にしない。候補の存在は Accepted と同義ではない。

### 1. Decision-AUD-RET-1 — 保存期間

| 項目 | 内容 |
|---|---|
| 問い | AuditLog（および関連業務データ）の保存期間は何か |
| 正本候補 | `GOV-AUD-06`（Issue #19） / `DEC-011`（Issue #8） |
| 現状 | **Pending**（最終候補作成済み / 未承認） |
| 最終候補 | 最低5年 / `occurredAt` 起算 / 5年経過だけでは自動削除しない |
| 正本 | [`decision-aud-ret-1-auditlog-retention.md`](./decision-aud-ret-1-auditlog-retention.md) |
| 混ぜない | 書込先所有、SharePoint 列、候補 builder 再定義 |

### 2. Decision-AUD-WR-1 — 書込先所有境界

| 項目 | 内容 |
|---|---|
| 問い | AuditEvent 実保存（repository port / adapter / 永続ストア）の所有 Issue はどれか |
| 現状 | **Pending**（最終候補作成済み / 未承認） |
| 最終候補 | 実保存 technical owner = Issue `#22A` |
| 正本 | [`decision-aud-wr-1-audit-write-ownership.md`](./decision-aud-wr-1-audit-write-ownership.md) |
| 混ぜない | 保存期間の Accepted、SharePoint 列 mapping の暗黙確定、deploy |

### 3. 分離して後続扱い（本ゲートで採択しない）

```text
許可フィールド値のサニタイズ（Issue #22 または audit-write-boundary）
AuditEvent.actionCode 最終 enum 全体
SharePoint List/列 mapping
retry / 冪等
UI
実データ
deploy
```

## Entry Criteria 表

| # | 条件 | 現状 |
|---|---|---|
| 1 | AuditEvent 構造・strict allowlist が main にある | DONE（Issue #27 / PR #41） |
| 2 | Handoff 候補生成契約・実装が main にある | DONE（PR #96） |
| 3 | `HANDOFF_STATUS_CHANGED` Accepted 証跡 | DONE（`5215557663`） |
| 4 | `GOV-AUD-06` / `DEC-011` 保存期間 Accepted または対象外明示 | **未**（AUD-RET-1 候補あり / Pending） |
| 5 | 書込先所有 Issue Accepted | **未**（AUD-WR-1 候補 `#22A` / Pending） |
| 6 | 実保存技術契約（port / fail-closed / OUT） | **未**（4・5 Accepted 後） |
| 7 | SharePoint / M365 変更方針 | **NO-GO**（別 Gate） |

```text
Entry Criteria: NOT MET
本当のブロッカー: AUD-RET-1 Accepted / AUD-WR-1 Accepted
AuditEvent 実保存設計: HOLD
AuditEvent 実保存実装: HOLD
```

## 禁止（Criteria 充足前）

- 候補を Accepted 扱いして実装を開始すること
- 保存期間日数・年数をコードへ埋め込むこと
- SharePoint adapter / List 作成
- AuditEvent の実保存実装
- 候補 builder（`buildHandoffStatusChangedAuditEventCandidate`）の永続化責務への拡張
- Issue #24 Close を保存未了のまま実行すること
- deploy / 実データ変更

## 実装ゲート（現状維持）

```text
PR #97: MERGED
Handoff domain units: MERGED（transition / role / mutation / audit candidate）
Decision-AUD-RET-1: Pending（最終候補あり）
Decision-AUD-WR-1: Pending（最終候補あり）
AuditLog保存期間: HOLD（人 Accepted 待ち）
AuditEvent実保存: 未実装 / HOLD
SharePoint adapter: 未実装 / NO-GO
SharePoint / Entra ID / Microsoft 365: NO-GO
Deploy: NO-GO
```

## 変更禁止境界

```text
SharePoint changes: NO-GO
Entra ID changes: NO-GO
Microsoft 365 changes: NO-GO
deploy: NO-GO
real data: prohibited
src/** / tests/**: 本ゲート文書では変更しない
候補の推測 Accepted 化: 禁止
```
