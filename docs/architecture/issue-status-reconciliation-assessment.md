# Issue Status Reconciliation — read-only assessment

この文書は、OPEN Issue 本文の Current status / Gate / Dependency が
repository SoT からずれていることについての **read-only 評価正本** である。

**実行正本は後続の Selection / Packet へ移した。**

- Selection:
  [`decision-ilb-1-thirty-sixth-residual-issue-status-reconciliation-selection.md`](./decision-ilb-1-thirty-sixth-residual-issue-status-reconciliation-selection.md)
- Packet:
  [`issue-status-reconciliation-packet.md`](./issue-status-reconciliation-packet.md)

Issue の close・本文更新・コメント投稿は本文書では行わない。
Agent GitHub Issue mutation は引き続き FORBIDDEN。

```text
repository: yasutakesougo/severe-behavior-support-spfx
Kind: Process assessment（read-only）
Status: ASSESSED → SELECTED（see thirty-sixth residual）
Assessment date: 2026-08-10
Assessor: Human read of OPEN Issues + repository SoT
GitHub Issue connector capability: AVAILABLE
Agent GitHub Issue mutation policy for this packet: FORBIDDEN
Capability ≠ Authorization
GitHub Issue mutation by this assessment: NONE

Current SoT（durable；updated）:
  main HEAD at assessment update: 658c790f34adb3489808121a72c6dcccbde97d2f
  PR #192: MERGED
  PR #193: MERGED
  Decision-AS-CN1-OBSERVATION-1: CLOSED / CONSUMED / DEFAULT_COLUMNS_ONLY
  Decision-AS-COLUMN-EG-1: Accepted / LOCKED / EG-1+XB-1+AP-1
  Implementation Start: HOLD
  Deploy / real data: NO-GO
  OPEN Issues: 28（Human attestation）
  Next process unit: Issue Status Reconciliation（SELECTED）
```

## 1. Verdict

| 対象 | 判定 |
|---|---|
| 最新 PR / Decision 進行 | 整合して進行中（CN-1 CLOSED；EG-1 Accepted） |
| CN-1 を次ゲートとする停止 | **CONSUMED**（もはや現行 substantive gate ではない） |
| Implementation Start HOLD | 整合 |
| SharePoint adapter / schema mapping HOLD | 整合 |
| OPEN Issue 本文の Current status | **STALE 多数** |
| Issue #6 プロジェクト進捗 | **重大な STALE**（Human attestation） |
| Issue #8 DEC ledger 本文 | **最新一次資料 / docs SoT と未同期**（Human attestation） |
| Issue #5 / #10 / #11 | **Close 候補（強い）**（Human 2026-08-10 triage） |
| Issue #22 依存関係表示 | **STALE 残存の可能性**（prior；Phase ② 以降） |
| 即時コード実装 | **NO-GO** |

```text
最大の整合性問題:
  進捗そのものより、Issue 本文が現在の正本状態に追随していないこと。

今やるべきこと:
  新しい実装ではない。
  Issue Status Reconciliation（Human Phase ①〜④）

分離規則:
  Issue を閉じること ≠ 本文を最新状態にすること
  28件削減 ≠ 整理完了
```

## 2. Human-attested STALE snapshots

Issue body triage は Human 実読を durable に固定する。
GitHub Issue connector capability = AVAILABLE。
本 packet / assessment の Agent Issue mutation policy = FORBIDDEN。
Capability ≠ Authorization。

### 2.1 Issue #6（重大 STALE）

```text
Human-observed Current status still showing initial-era markers:
  Implemented: 0
  Verified: 0
  Issue #7 / #3 OPEN などの初期記述
  試験サイト未確定
  Codex 利用承認前 / Implementation Start 未承認 表現

Contradicts current SoT facts such as:
  CN-1 CLOSED / CONSUMED
  column path Decisions through COLUMN-EG-1 Accepted
  many Decision / Canonical units CONSUMED
  Contracts / Process CI green on recent PRs
  PR #192 / #193 MERGED
```

### 2.2 Issue #8 / DEC ledger（docs SoT と未同期）

```text
Human-observed Issue #8 ledger text still showing stale DEC rows
（example from prior read）:
  DEC-008 Status: Deferred

Repository SoT（Accepted / LOCKED）:
  docs/architecture/decision-dec-008-acceptance.md
  制度上の作成者 = 実践研修修了者 = ACCEPTED
  独立した最終承認者 = NOT ADOPTED
  提出・差戻しロール = application に固定しない（Option C）

#8 MUST remain OPEN as Decision Ledger.
Close ではなく reconcile 対象。
```

### 2.3 Issue #5 / #10 / #11（Close 候補）

```text
#5: Phase 0 再利用境界。CN-1 閉鎖・列経路 #192 進行後も初期 SHA のまま。
#10: AGENTS.md / PR template / ADR 追加前提。現行 repo は通過済み。
#11: Codex 3か月試行 承認前前提。実開発履歴と時間軸がずれる。

Close #11 ≠ Close #6 parent。
```

### 2.4 Issue #22（依存モデル STALE；deferred）

```text
Human-observed Current判定 still showing pre-CN-1 model:
  #22A -> #29 -> #22B
  #22A / #22B Implementation: HOLD

Current SoT has advanced past that model.
#22 remains Group C backlog；not Phase ① Close target.
```

## 3. Reconciliation scope

| In scope | Out of scope |
|---|---|
| Current status 節の SoT 追随 | 新規実装 |
| Gate / Dependency 表示の追随 | CN-1 / Internal Name 発明 |
| DEC ledger の Accepted 同期 | DEC 再 Decision |
| 「close」と「body resync」の分離実行 | Issue を閉じただけで整合完了とみなすこと |
| #5/#10/#11 Close 判定 | #15〜#19 一括 Close |
| #6 / #8 OPEN 維持 + resync | tenant / SharePoint mutation |
| #20以降 / UI 系バックログ維持 | Implementation Start |

```text
Recommended order（LOCKED in packet）:
  ① #5 / #10 / #11 superseded → Close
  ② #6 / #8 current-state reconciliation
  ③ #4 / #9 / #12 / #15〜#19 continuity re-check（no batch Close）
  ④ #20以降 / UI 系は原則バックログ維持
```

## 4. Sequencing lock（updated）

| Order | Unit | Status |
|---|---|---|
| 1 | CN-1 Selection / Packet / observation | **CONSUMED** |
| 2 | Schema mapping / column path through EG-1 | **CONSUMED / Accepted** |
| 3 | Issue Status Reconciliation | **SELECTED（thirty-sixth）** |
| — | Human create under EG-1 | parallel Human process（not this residual） |
| — | Implementation Start | HOLD |
| — | SharePoint adapter / schema mapping impl | HOLD |

```text
This assessment update SELECTS Issue Status Reconciliation via
thirty-sixth residual Selection + packet.
It does NOT authorize Agent Issue mutation.
It does NOT authorize Implementation Start / SharePoint mutation.
NO_DEDICATED_SYNC_PR policy remains for self-referential PR live-state cleanup
（docs/process/self-referential-gate-policy.md）。
Issue body SoT drift is a separate process debt from PR self-referential stale.
```

## 5. Explicit non-authorization

```text
This assessment does NOT authorize:
  Agent GitHub Issue create / edit / close / comment
  一括 Close / 一括本文更新
  Implementation Start
  SharePoint adapter / schema mapping code
  CN-1 Internal Name invention
  DEC-008 re-open / re-Decision
  Deploy / real data
  treating STALE Issue Current status as project truth over repository docs
  closing #8 because ledger text is stale
```

## 6. Next

```text
Selected unit: Issue Status Reconciliation
  selection: decision-ilb-1-thirty-sixth-residual-issue-status-reconciliation-selection.md
  packet: issue-status-reconciliation-packet.md
  Phase ① drafts: issue-status-reconciliation-close-candidates-5-10-11.md
  Phase ② drafts: issue-status-reconciliation-resync-6-8.md
  Phase ③ notes: issue-status-reconciliation-continuity-4-9-12-15-19.md

Human executes Issue Close / body patch under packet authorization.
GitHub Issue connector capability: AVAILABLE
Agent mutation policy for this assessment / packet: FORBIDDEN
Capability ≠ Authorization

Parallel / separate:
  Human create under EG-1
  VR-1 CN-1 re-observation after create

Until Human completes Phase ①〜② / FORBIDDEN for Agent:
  Implementation Start = HOLD
  adapter / schema mapping = HOLD
  Issue 一括 Close / 一括本文更新 = FORBIDDEN
  SharePoint schema/list/column change = FORBIDDEN
  GitHub Issue mutation by Agent = FORBIDDEN
  Deploy / real data = NO-GO
```
