# Issue Status Reconciliation — Resync drafts #6 / #8

この文書は、Decision-ISSUE-STATUS-RECONCILE-1 Phase ② の
**#6 / #8 Current-state reconciliation 下書き**である。

Parent:
[`issue-status-reconciliation-packet.md`](./issue-status-reconciliation-packet.md)

```text
Status: READY after Phase ①（may draft now；apply after Close confirmations）
Both Issues: KEEP OPEN
Agent GitHub Issue mutation: FORBIDDEN
Human body / Current / Gate / Dependency patch: AUTHORIZED under this packet
Close #6 / #8: FORBIDDEN by this Phase
```

## Shared SoT freeze（at draft write-up）

```text
main HEAD: 658c790f34adb3489808121a72c6dcccbde97d2f
PR #192 MERGED / PR #193 MERGED
CN-1 observation: CLOSED / CONSUMED / DEFAULT_COLUMNS_ONLY
Decision-AS-SCHEMA-MAPPING-NEXT-1: Accepted / LOCKED / MT-1+IN-A+CP-1+XB-1
Decision-AS-COLUMN-EG-1: Accepted / LOCKED / EG-1+XB-1+AP-1
Human create: AUTHORIZED / NOT STARTED by Acceptance
Implementation Start: HOLD
SharePoint adapter / schema mapping impl: HOLD
Deploy / real data: NO-GO
GitHub Issue mutation by Agent: FORBIDDEN
```

---

## Issue #6 — 3か月試行 parent

### Recommendation

**KEEP OPEN** + replace stale Current status markers.

### Human-attested stale markers（do not treat as truth）

```text
Implemented: 0
Verified: 0
Issue #7 contracts correction: OPEN / HOLD（初期記述）
Issue #3 OPEN（初期記述）
試験サイト未確定
Codex 利用承認前 / Implementation Start 未承認 などの初期 Gate 表現
```

### Replacement Current status block（draft）

Human が Issue #6 本文の Current status / Gate 節へ貼る用。
未確認の個別子 Issue 状態は発明しない。

```text
## Current status（reconciled 2026-08-10）

SoT tip: 658c790f34adb3489808121a72c6dcccbde97d2f
PR #192 MERGED / PR #193 MERGED

Project location:
  CN-1 observation: CLOSED / CONSUMED / DEFAULT_COLUMNS_ONLY
  SharePoint column path: through Decision-AS-COLUMN-EG-1 Accepted
    （EG-1 + XB-1 + AP-1）
  Human create: AUTHORIZED / NOT STARTED by Acceptance
  Implementation Start: HOLD
  SharePoint adapter / schema mapping implementation: HOLD
  Deploy / real data: NO-GO

Issue hygiene:
  Decision-ISSUE-STATUS-RECONCILE-1 SELECTED
  Close candidates: #5 / #10 / #11（Phase ①）
  This Issue (#6): KEEP OPEN as trial parent
  Decision ledger (#8): KEEP OPEN + reconcile（not Close）

Do not use pre-CN-1 Issue body markers（Implemented:0 / 試験サイト未確定 /
承認前 Gate など）as current project truth.
Repository docs under docs/architecture/ are SoT for Decision state.
```

### Explicit non-claims for #6 patch

```text
#6 resync ≠ trial complete
#6 resync ≠ Implementation Start
#6 resync ≠ Close of backlog Issues
```

---

## Issue #8 — Decision Ledger（DEC-001〜）

### Recommendation

**KEEP OPEN** + reconcile ledger body to Accepted / LOCKED SoT.
**Do not Close.**

### Why keep open

- DEC-001〜017（および後続 DEC）の Decision Ledger 役割は有効。
- 本文が古いことは Close 理由にならない。
- prior assessment でも DEC-008 Accepted / LOCKED と Issue 本文 Deferred の乖離を記録済み。

### Human-attested stale markers（examples）

```text
DEC-008 Status: Deferred
  （repository SoT: Accepted / LOCKED；
   docs/architecture/decision-dec-008-acceptance.md）
その他 DEC 行が初期 / Deferred / OPEN のまま残存している可能性
```

### Replacement Current status / sync note（draft）

```text
## Current status（reconciled 2026-08-10）

Role: Decision Ledger（KEEP OPEN）
SoT tip: 658c790f34adb3489808121a72c6dcccbde97d2f

Ledger sync rule:
  Issue #8 body is secondary.
  Accepted / LOCKED Decision docs under docs/architecture/ and
  docs/decisions/ are primary SoT.
  When body and docs conflict, docs win until Human updates this ledger.

Known sync debt（examples；not exhaustive）:
  DEC-008: Accepted / LOCKED in repository docs
    （authoring = 実践研修修了者；independent final approver NOT ADOPTED；
     submit/return roles = Option C）
  Column / SharePoint path Decisions through COLUMN-EG-1:
    Accepted / LOCKED；see residual inventory and acceptance docs
  CN-1: CLOSED / CONSUMED / DEFAULT_COLUMNS_ONLY

This Issue is NOT a Close candidate.
Status Reconciliation ≠ re-Decision.
```

### Human follow-up for DEC rows

```text
Preferred approach:
  1. Add the Current status block above
  2. For each clearly Accepted DEC，update Status line to Accepted / LOCKED
     with doc link
  3. Leave genuinely open DEC rows as OPEN / HOLD with current blocker
  4. Do not invent DEC outcomes not present in docs

Do not:
  Close #8
  Re-open Accepted DECs
  Treat Issue comment history as higher SoT than Accepted docs
```

---

## Phase ② checklist

| Step | Action | Status |
|---|---|---|
| 1 | Confirm Phase ① Close outcomes recorded | Human |
| 2 | Patch #6 Current status with draft above | Human |
| 3 | Patch #8 Current status / DEC-008 sync note | Human |
| 4 | Optionally sync other clearly Accepted DEC rows | Human |
| 5 | Leave #6 / #8 OPEN | required |

```text
#22 dependency STALE（prior assessment）is deferred to a later resync slice.
It is Group C backlog，not Phase ② Close/ledger work.
```
