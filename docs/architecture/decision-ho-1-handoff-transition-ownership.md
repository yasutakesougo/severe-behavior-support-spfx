# Decision-HO-1 — Handoff transition ownership

この文書は、**Decision-HO-1**（Handoff 状態遷移純関数の所有 Issue）の
**Accepted 正本**である。

## 基準

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-HO-1
Status: Accepted
Owner Issue: #17
Handoff transition: PR #90 MERGED
Handoff role policy: PR #91 MERGED
Handoff state mutation: PR #93 MERGED
Handoff AuditEvent candidate: PR #96 MERGED
HANDOFF_STATUS_CHANGED Accepted comment: 5215557663
main (PR #96 merge): 37369b9156631e10877932d210de0606b592798b
```

上位入口:

- [`handoff-status-transition.md`](./handoff-status-transition.md)
- [`decision-ho-edge-1-handoff-allowed-edges.md`](./decision-ho-edge-1-handoff-allowed-edges.md)
- [`finding-audit-ownership.md`](./finding-audit-ownership.md)
- [`audit-event-persistence-entry-criteria.md`](./audit-event-persistence-entry-criteria.md)

## Accepted 内容

```text
Status: Accepted
Owner: Issue #17

Handoff 状態遷移純関数（allow/deny only）の所有は Issue #17 とする。
Issue #24 へ自動割当しない方針は維持したまま、#17 を明示 Accepted した。
```

## 分離（維持）

| 単位 | 扱い |
|---|---|
| `HandoffState` 型 | Issue #27 / PR #41（再定義しない） |
| 許可辺 | Decision-HO-EDGE-1 Accepted（#17） |
| 実行ロール | `GOV-AUD-02` / Issue #19（本 Decision に混ぜない） |
| AuditEvent 候補 | PR #96 MERGED（実保存は別） |
| AuditLog 保存期間 | Decision-AUD-RET-1 Accepted（cleanup / 物理削除は別） |
| Logical persistence boundary | MERGED（PR #104） |
| Decision-AUD-REPLAY-1 | Accepted |
| Replay logical implementation | MERGED（PR #106） |
| Decision-AUD-REPO-1 | Accepted |
| Issue #29 physical mapping | Accepted / MERGED（PR #108） |
| Concrete repository | HOLD |
| SharePoint / M365 / Deploy | NO-GO |

## 実装ゲート

```text
Handoff transition / role / mutation / audit candidate: MERGED
Persistence Entry Review: PASS
Logical AuditEvent persistence boundary: MERGED（PR #104）
Decision-AUD-REPLAY-1: Accepted
Replay logical implementation: MERGED（PR #106）
Decision-AUD-REPO-1: Accepted
Issue #29 physical definition / mapping alignment: Accepted
Canonicalization to main: MERGED（PR #108 / aa0e6fba7dd8abf32523c70232001b5ac78cfc1b）
Dependency blocker（#29 mapping）: CLEARED
Concrete Repository Entry Review: PASS（Issue #22 comment 5224544473）
Next: #22B concrete repository 向けの別の明示的 Human GO（Entry PASS 済）
Concrete repository: HOLD
READY_FOR_HUMAN_GO: YES
SharePoint / Microsoft 365 / Deploy: NO-GO
```
