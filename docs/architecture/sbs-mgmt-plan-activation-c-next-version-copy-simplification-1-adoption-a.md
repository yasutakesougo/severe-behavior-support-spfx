# SBS-MGMT-PLAN-ACTIVATION-C — NEXT-VERSION-COPY-SIMPLIFICATION-1 Adoption Record

```text
unit: SBS-MGMT-PLAN-ACTIVATION-C-NEXT-VERSION-COPY-SIMPLIFICATION-1
kind: Adopted Copy Direction
date: 2026-09-03
product HEAD: 5437e64703db055eef2bf230f5a682cf0286dc1a = FROZEN / NO CHANGE
Scope review cleared: sbs-mgmt-plan-activation-c-next-version-copy-simplification-1-scope.md
Adopted proposal: A / MINIMAL
Human UI Copy Correction Start GO = NOT RECEIVED
Implementation = NOT AUTHORIZED
Actual Staff Check = HOLD
Ready / Merge / Deploy / LIVE WRITE = NOT AUTHORIZED
```

---

## Adopted copy — Proposal A

T2 状態（`revisionDraft` 存在 / Apply 前）の ⑥ 次版準備 の実際の表示:

```text
⑥ 次版準備

（区間 A — 変更なし）
次回の変更は新しい版を作ります。現行の適用中版は残します。作成・保存は接続されていません。
計画は上書きせず、版を重ねます。現場記録は実施時点の計画版に残ります。
現行は版 3（適用中）。次に重ねる概念上の版は 4 です。
観察の不足だけでは、この計画を無効にしません。        ← LOCKED D6=A 保持
見直し期限の超過だけでは、この計画を無効にしません。  ← LOCKED D5=B 保持
[次の版を作る（表示専用）]                             ← Scope Correction-1 保持

（区間 B — Proposal A 適用後）
適用中: 版 3
下書き: 版 4

[版 4 を適用開始する]

（区間 C — 変更なし）
本番には保存されていません
```

---

## REMOVE（区間 B から削除する行）

```text
変更内容の下書き: 版 4
元の版: 3（変更しない）
版 4 は下書きです。まだ適用開始されていません。
状態: 下書き / 本番未保存
```

---

## RETAIN（触らない）

```text
SUPPORT_PLAN_NEXT_VERSION_NOTE（次回の変更は〜接続されていません。）
SUPPORT_PLAN_IMMUTABLE_VERSION_NOTE（計画は上書きせず〜）
SUPPORT_PLAN_OBSERVATION_NOT_INVALIDATING_NOTE — LOCKED D6=A
SUPPORT_PLAN_REVIEW_OVERDUE_NOT_INVALIDATING_NOTE — LOCKED D5=B
SUPPORT_PLAN_NEXT_VERSION_CTA 「次の版を作る（表示専用）」— Scope Correction-1 保持
Apply CTA ラベル「版 4 を適用開始する」— 変更なし
Apply CTA 表示条件 — 変更なし
DOM selector 6 点 — 変更なし
activation domain / session contract — 変更なし
schema / CAS / ActivationReceipt / DraftSnapshotId — 変更なし
```

---

## Acceptance criteria（実装 GO 後の検証基準）

```text
1. 版 3 適用中 / 版 4 下書きで ⑥ を開いたとき、5秒以内に「版 3 / 版 4 下書き / Apply」の3点が読める
2. 区間 B に「変更内容の下書き」「元の版: 3（変更しない）」「状態: 下書き / 本番未保存」が現れない
3. 「版 4 は下書きです。まだ適用開始されていません。」が現れない
4. 「観察の不足だけでは」が ⑥ に残っている
5. 「見直し期限の超過だけでは」が ⑥ に残っている
6. 「次の版を作る（表示専用）」が ⑥ に残っている（disabled）
7. Apply CTA「版 4 を適用開始する」が変更なし
8. DOM selector 6 点が保持されている
9. npm test が PASS（test assert を定数変更と同期済み）
10. #584 product HEAD が 5437e64 のまま（diff は copy 文字列と test assert のみ）
```

---

## Next action

```text
Human UI Copy Correction Start GO — Proposal A
= NOT RECEIVED

このGOを受けるまで実装は行わない。
GOを受けた時点で:
  exact files = SupportPlan.tsx / support-plan-copy.ts / support-plan.test.ts
  変更 = 区間 B の REMOVE 行を削除し、短縮 copy を挿入
  DOM selector = 保持のまま
  locked invariant = 変更なし
```
