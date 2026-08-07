# AuditEvent 実保存 — Entry Criteria / 次工程ゲート

この文書は、Handoff AuditEvent **候補生成**（PR #96 MERGED）完了後に、
**実保存境界の設計へ進む前**に確認する Entry Criteria 正本である。

保存期間・書込先所有を本 PR で採択しない。
SharePoint / adapter / deploy を開始しない。

## 基準

```text
repository: yasutakesougo/severe-behavior-support-spfx
main: 37369b9156631e10877932d210de0606b592798b
PR #96 / Handoff AuditEvent candidate: MERGED
final head: 5a3515a8d7f229af1920f1e3fb42b4006d232a80
HANDOFF_STATUS_CHANGED Accepted comment: 5215557663（Issue #17）
Decision-HO-1: Accepted（Owner #17）
Next pure unit (persistence): HOLD
AuditEvent 実保存: 未実装
SharePoint / Microsoft 365: NO-GO
Deploy: NO-GO
```

上位入口:

- [`handoff-audit-event.md`](./handoff-audit-event.md)
- [`finding-audit-ownership.md`](./finding-audit-ownership.md)
- [`domain-reconstruction-foundation.md`](./domain-reconstruction-foundation.md)

## 完了済み（再オープンしない）

| 単位 | 状態 | 正本 |
|---|---|---|
| Handoff 状態遷移 | MERGED（PR #90） | `handoff-status-transition.md` |
| 現場主体ロールポリシー | MERGED（PR #91） | `handoff-transition-role-policy.md` |
| HandoffState timestamp / actor mutation | MERGED（PR #93） | `handoff-state-mutation.md` |
| AuditEvent candidate builder | MERGED（PR #96） | `handoff-audit-event.md` |

候補の固定形（再定義しない）:

```text
actionCode: HANDOFF_STATUS_CHANGED
targetType: HandoffState
result: success
reasonCode: HANDOFF_<変更前>_TO_<変更後>
```

前進・差し戻しとも同一 `actionCode`。方向は `reasonCode` で追跡する。

## 次工程で決めること（実保存設計の前）

実保存境界の docs / 実装に入る前に、次を **独立に** 確認する。
一括 Accepted 前提にしない。

### 1. Decision-AUD-RET-1 — 保存期間

| 項目 | 内容 |
|---|---|
| 問い | AuditLog（および関連業務データ）の保存期間は何か |
| 正本候補 | `GOV-AUD-06`（Issue #19） / `DEC-011`（Issue #8） |
| 現状 | **HOLD**（Deferred / 正式回答待ち） |
| 混ぜない | 書込先所有、SharePoint 列、候補 builder 再定義 |

### 2. Decision-AUD-WR-1 — 書込先所有境界

| 項目 | 内容 |
|---|---|
| 問い | AuditEvent 実保存（repository port / adapter / 永続ストア）の所有 Issue はどれか |
| 現状 | **未確定** |
| 候補枠（採択しない） | Issue #17 / #19 / #22 / #27 / 新規 audit-write-boundary |
| 混ぜない | 保存期間の具体値、SharePoint 列 mapping の暗黙確定、deploy |

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
| 4 | `GOV-AUD-06` / `DEC-011` 保存期間 Accepted または対象外明示 | **未** |
| 5 | 書込先所有 Issue Accepted | **未** |
| 6 | 実保存技術契約（port / fail-closed / OUT） | **未**（4・5 後） |
| 7 | SharePoint / M365 変更方針 | **NO-GO**（別 Gate） |

```text
Entry Criteria: NOT MET
AuditEvent 実保存設計: HOLD
AuditEvent 実保存実装: HOLD
```

## 禁止（Criteria 充足前）

- 保存期間日数・年数の推測埋め込み
- SharePoint adapter / List 作成
- AuditEvent の実保存実装
- 候補 builder（`buildHandoffStatusChangedAuditEventCandidate`）の永続化責務への拡張
- Issue #24 Close を保存未了のまま実行すること
- deploy / 実データ変更

## 人向け確認案（Pending・未投稿）

```text
Status: Pending Decision gate
ID: Decision-AUD-RET-1 / Decision-AUD-WR-1

Before designing AuditEvent persistence:
  1. Confirm GOV-AUD-06 / DEC-011 retention answer (or explicit N/A)
  2. Assign write-destination ownership Issue (do not invent)

Reuse:
  - Handoff AuditEvent candidate = PR #96 MERGED（再定義しない）
  - HANDOFF_STATUS_CHANGED = Accepted 5215557663

OUT:
  SharePoint / Microsoft 365 / deploy / real data
  candidate builder persistence side-effects
```

## 実装ゲート（現状維持）

```text
Handoff domain units: MERGED（transition / role / mutation / audit candidate）
AuditLog保存期間: HOLD（GOV-AUD-06 / DEC-011）
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
保存期間・書込先の推測採択: 禁止
```
