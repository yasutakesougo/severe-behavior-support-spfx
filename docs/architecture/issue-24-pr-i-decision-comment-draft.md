# Issue #24 Decision コメント案（PR-I）

この文書は、Issue #24 へ投稿した Decision のドラフト保管である。

状態: **Accepted（GitHub comment `5211039927`）**

関連正本: [`issue-24-remaining-audit-pr-i-selection.md`](./issue-24-remaining-audit-pr-i-selection.md)
関連 PR: #73

---

## 記録済み内容（要約）

```text
Status: Accepted
Comment ID: 5211039927

Ownership:
  #26 = SupportPlan contract / status enum / Schema / DTO / repository port
  #24 = SupportPlan status transition（純粋ルール）

Allowed edges (PR-I only):
  Draft → PendingReview
  PendingReview → Returned
  Returned → Draft
  PendingReview → Active
  Active → Closed

OUT OF SCOPE / HOLD for PR-I:
  Role authorization
  Active uniqueness
  Observation period
  Review deadline
  RuleSetVersion
  SharePoint / UI
```

## 反映済み

1. `issue-24-remaining-audit-pr-i-selection.md` — Accepted + Implementation GO
2. `finding-audit-ownership.md` — Issue #24 Accepted `5211039927`
3. PR #73 — Decision Accepted 証跡を追記
