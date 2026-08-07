# Issue #24 Decision コメント案（PR-I）

この文書は、Issue #24 へ人が投稿するための **Decision コメント案** である。
AI による Issue 投稿は行わない（人の事前承認が必要）。

状態: **Recommended（GitHub Accepted 未記録）**

関連正本: [`issue-24-remaining-audit-pr-i-selection.md`](./issue-24-remaining-audit-pr-i-selection.md)  
関連 PR: #73

---

## 投稿本文案

```text
## Decision: SupportPlan status transition（PR-I）

Status: Accepted

### Decision 1 — Ownership

PR-I ownership: Issue #24

Boundary:
- Issue #26: SupportPlan / SupportPlanVersion / status enum / Schema / DTO / repository port
- Issue #24: SupportPlan status transition（および後続の Active一意性・期限・期間等の純粋ルール）

状態 enum 自体は #26、状態遷移関数は #24。

### Decision 2 — Allowed edges（PR-I only）

Permit only these 5 edges:

- Draft → PendingReview
- PendingReview → Returned
- Returned → Draft
- PendingReview → Active
- Active → Closed

Reject all other transitions fail-closed, including but not limited to:

- Draft → Active
- Closed → Active
- Active → Draft
- Active → PendingReview
- Returned → Active
- Closed → *
- self-transitions

### Explicitly OUT OF SCOPE for PR-I

- Role authorization
- Active uniqueness
- Observation period
- Review deadline calculation / approaching / overdue policy
- RuleSetVersion selection
- SharePoint / adapter / Entra ID / Microsoft 365
- deploy / real data
- Issue #24 Close

### Function shape

PR-I owns a pure function only:

current status + requested transition → allow / deny

No role checks. No persistence. No clock generation inside the function.

### Next gate

After this Accepted Decision is recorded on Issue #24:
1. Reflect Accepted + comment ID into PR #73 docs
2. Implementation GO judgment
3. Only then start src/** / tests/** / technical contract implementation
```

---

## 記録後に必要な反映

Accepted コメントの ID が付いたら、次を更新する:

1. `issue-24-remaining-audit-pr-i-selection.md` — GitHub Accepted / comment ID / Implementation GO 再判定
2. `finding-audit-ownership.md` — SupportPlan status transition 行を Issue #24 Accepted へ更新
3. PR #73 本文 — Decision Accepted 証跡を追記
