# Issue Status Reconciliation — Close candidates #5 / #10 / #11

この文書は、Decision-ISSUE-STATUS-RECONCILE-1 Phase ① の
**Close 候補判定と Human Close コメント下書き**である。

Parent:
[`issue-status-reconciliation-packet.md`](./issue-status-reconciliation-packet.md)

```text
Status: READY for Human Close confirmation
Agent GitHub Issue mutation: FORBIDDEN
Human Close: AUTHORIZED only after Human confirms each Issue
Batch Close: FORBIDDEN（1 Issue = 1 confirmation）
```

## Shared SoT freeze（at draft write-up）

```text
main HEAD: 658c790f34adb3489808121a72c6dcccbde97d2f
PR #192 MERGED / PR #193 MERGED
CN-1 observation: CLOSED / CONSUMED / DEFAULT_COLUMNS_ONLY
Decision-AS-COLUMN-EG-1: Accepted / LOCKED / EG-1+XB-1+AP-1
Implementation Start: HOLD
SharePoint adapter / schema mapping impl: HOLD
Deploy / real data: NO-GO
```

---

## Issue #5 — Phase 0 再利用境界

### Recommendation

**CLOSE（superseded / consumed by later Accepted units）**

### Why

- Phase 0 の再利用境界固定 Issue。
- 現行 SoT では再利用境界は README / `docs/architecture/reuse-boundary.md` /
  後続 Decision 群で運用されている。
- CN-1 まで閉鎖済み。SharePoint 列経路 Decision は #192 まで進行。
- Issue 本文の基準 SHA は初期状態のまま（Human attestation）。

### Does NOT mean

```text
Close #5 ≠ 再利用境界の破棄
Close #5 ≠ Implementation Start
Close #5 ≠ SharePoint schema change
```

### Human Close comment draft

```text
Close reason: SUPERSEDED / CONSUMED

本 Issue の Phase 0 再利用境界固定は、後続の Accepted Decision /
README 現在工程 / CN-1 CLOSED / COLUMN-EG-1 Accepted（PR #192 経路）
により消費済みです。

Current SoT tip: 658c790f34adb3489808121a72c6dcccbde97d2f
CN-1: CLOSED / DEFAULT_COLUMNS_ONLY
Implementation Start: HOLD

再利用境界そのものは破棄しません。正本は repository docs を参照してください。
本 Close は Issue 本文の初期 SHA / 初期 Gate 記述の整理です。
```

---

## Issue #10 — AGENTS.md / PR テンプレート / ADR 追加前提

### Recommendation

**CLOSE（superseded）**

### Why

- 「将来リポジトリへ AGENTS.md・PR テンプレート・ADR を追加する」前提の Issue。
- 現行リポジトリは `.agents/`、`.github/`、`docs/decisions/` /
  `docs/architecture/`、process / skill 群を大幅に通過済み。
- 初期 bootstrapping Issue として役割を終えている。

### Does NOT mean

```text
Close #10 ≠ AI governance / ADR 運用の終了
Close #10 ≠ 今後の ADR 追加禁止
```

### Human Close comment draft

```text
Close reason: SUPERSEDED

本 Issue の前提（AGENTS.md / PR テンプレート / ADR を将来追加）は、
現行リポジトリ構成（.agents / .github / docs/decisions / docs/architecture /
docs/process）により通過済みです。

Current SoT tip: 658c790f34adb3489808121a72c6dcccbde97d2f

今後の ADR / process 追加は個別 Decision / PR で扱います。
本 Close は bootstrapping Issue の整理です。
```

---

## Issue #11 — Codex 3か月試行 承認前前提

### Recommendation

**CLOSE（timeline superseded）**

### Why

- 「Codex 3か月試行の承認前」という前提 Issue。
- 実際の開発履歴（多数 Decision / PR / CN-1 / column path）と時間軸がずれる。
- 試行そのものの親追跡は #6 側に残し、承認前前提の Issue は閉じる。

### Does NOT mean

```text
Close #11 ≠ 3か月試行の中止
Close #11 ≠ #6 parent の Close
Close #11 ≠ Codex / AI 利用停止
```

### Human Close comment draft

```text
Close reason: SUPERSEDED（timeline）

本 Issue の前提は「Codex 3か月試行の承認前」です。
現行 main は CN-1 CLOSED および SharePoint 列経路 Decision
（COLUMN-EG-1 Accepted / PR #192）まで進行しており、
承認前前提としては時間軸がずれています。

Current SoT tip: 658c790f34adb3489808121a72c6dcccbde97d2f
親追跡: Issue #6 を OPEN 維持（Status Reconciliation 対象）

本 Close は承認前前提 Issue の整理であり、試行中止ではありません。
```

---

## Human execution checklist

| Step | Action | Status |
|---|---|---|
| 1 | Confirm #5 superseded against reuse-boundary SoT | Human |
| 2 | Post Close comment + Close #5 | Human |
| 3 | Confirm #10 superseded against repo bootstrap SoT | Human |
| 4 | Post Close comment + Close #10 | Human |
| 5 | Confirm #11 timeline superseded；keep #6 open | Human |
| 6 | Post Close comment + Close #11 | Human |
| 7 | Record results back into packet / next handoff | docs PR if needed |

```text
If Human rejects Close for any one Issue:
  leave that Issue OPEN
  add a short comment pointing to this doc
  do not batch-close the others as a substitute
```
