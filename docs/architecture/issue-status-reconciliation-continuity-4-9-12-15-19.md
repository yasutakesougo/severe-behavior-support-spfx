# Issue Status Reconciliation — Continuity re-check #4 / #9 / #12 / #15–#19

この文書は、Decision-ISSUE-STATUS-RECONCILE-1 Phase ③ の
**継続必要性再判定メモ**である。今は一括 Close しない。

Parent:
[`issue-status-reconciliation-packet.md`](./issue-status-reconciliation-packet.md)

```text
Status: DEFERRED judgment notes（no batch Close）
Default: KEEP OPEN
Agent GitHub Issue mutation: FORBIDDEN
Batch Close of #15〜#19: FORBIDDEN
```

## Principle

```text
本文が古い ≠ Close 理由
未決定の法人運用・ルール・監査・性能条件を保持している Issue は、
設計文書が古く見えても残す。
```

## Per-Issue default judgment

| Issue | Default | Why keep for now | Re-check later when |
|---|---|---|---|
| #4 | KEEP OPEN | 正本系。本文 stale でも役割再確認が先 | Phase ② 後に Current が docs と重複のみなら Close 再考 |
| #9 | KEEP OPEN | 正本系。即 Close しない | 後続 Decision で完全消費が証明できたとき |
| #12 | KEEP OPEN | 正本系。即 Close しない | 同上 |
| #15 | KEEP OPEN | 未決定の法人運用・条件を保持 | 条件が別 Accepted DEC に移管完了したとき |
| #16 | KEEP OPEN | 同上 | 同上 |
| #17 | KEEP OPEN | 監査・handoff 系条件の保持可能性 | 関連 Accepted 契約へ完全移管後 |
| #18 | KEEP OPEN | 同上 | 同上 |
| #19 | KEEP OPEN | 性能 / 運用条件の保持可能性 | 正式回答または Accepted DEC 移管後 |

## Explicit non-actions now

```text
Do NOT:
  close #15〜#19 as a set
  close #4 / #9 / #12 just because SHA / Gate text is old
  treat Phase ③ as Implementation Start
  invent missing corporate answers to force Close
```

## Phase ③ checklist

| Step | Action |
|---|---|
| 1 | After Phase ① / ②，Human skims each Issue against docs SoT |
| 2 | If fully consumed by Accepted docs，open a dedicated Close note |
| 3 | Otherwise leave OPEN and optionally add one reconciliation comment |
| 4 | Record any dedicated Close in a later docs PR |

```text
Phase ③ success criteria:
  judgment exists per Issue
  no batch Close
  backlog Groups C/D untouched except optional #22 dependency note later
```
