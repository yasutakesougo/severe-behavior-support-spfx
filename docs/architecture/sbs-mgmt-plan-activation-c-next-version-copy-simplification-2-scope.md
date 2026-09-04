# NEXT-VERSION-COPY-SIMPLIFICATION-2 — Scope Definition

```text
unit: SBS-MGMT-PLAN-ACTIVATION-C-NEXT-VERSION-COPY-SIMPLIFICATION-2
kind: Scope Definition
mode: READ-ONLY / SCOPE DEFINITION ONLY
date: 2026-09-04
Staff T1–T5 = PASS
FUNCTIONAL COMPREHENSION = PASS
Staff finding = AFTER-APPLY COPY TOO LONG
Human Ready GO = HOLD
Human UI Copy Correction Start GO = NOT RECEIVED
Implementation = NOT AUTHORIZED
Proposal A product candidate = fed08fd49d12fccf323991fb95a4f5e58d6f9e55
PR #589 tip / CI authority = f85ee757a9795b62ad5da475dc0aebc78e3ad6d3
#584 @ 5437e64 = FROZEN / historical basis only
Ready / Merge / Deploy / LIVE WRITE = NOT AUTHORIZED
```

---

## Why this unit

Actual Staff Plan-Transition Re-Test は機能理解 T1–T5 PASS。
Human Ready 前の残件は **適用後⑥の情報量** だけ。

機能・Apply・CAS・session・schema は触らない。

---

## PHASE 1 — Current after-apply copy (exact)

`nextVersionBlock`（`SupportPlan.tsx`）は 区間 A を **常時** 描画する。`activationReceipt` があっても同じ。

### 区間 A（Apply 後も同強度で残る）

| Selector / 定数 | Apply 後の例 |
|---|---|
| `SUPPORT_PLAN_NEXT_VERSION_HEADING` | 次の版の考え方 |
| `SUPPORT_PLAN_NEXT_VERSION_NOTE` | 次回の変更は新しい版を作ります。… |
| `SUPPORT_PLAN_IMMUTABLE_VERSION_NOTE` | 計画は上書きせず、版を重ねます。… |
| `data-review-new-version="next-version-number"` | `現行は版 4（適用中）。次に重ねる概念上の版は 4 です。` |
| D6 note | 観察の不足だけでは、この計画を無効にしません。 |
| D5 note | 見直し期限の超過だけでは、この計画を無効にしません。 |
| `create-cta` | 次の版を作る（表示専用） disabled |

### 区間 applied（`activationReceipt`）

| Selector | 文字列 |
|---|---|
| `data-sbs-mgmt-plan-activation-c-active-version` | 現在適用中: 版 4 |
| `data-sbs-mgmt-plan-activation-c-history` | 版 3: 過去版 |
| `data-sbs-mgmt-plan-activation-c-receipt` | 適用: planning-pc-synthetic-staff / ISO timestamp |
| process kicker | 版 4・適用中 |

### 区間 C

| Selector | 文字列 |
|---|---|
| `data-sbs-mgmt-loop-b-boundary` | 本番には保存されていません |

### Display inconsistency（削除候補）

```text
現行は版 4（適用中）。次に重ねる概念上の版は 4 です。
```

`liveCurrentVersion` は Apply 後 4 になる。
`conceptualNextVersion` は **fixture `presentation` のまま 4**。
Apply 後の「次版」は 5 であるべきなので、この行は長文であるだけでなく **表示不整合**。
最小修正は Apply 後にこの行を出さないこと。`conceptualNextVersion` の計算式変更は今回 OUT。

---

## PHASE 2 — Minimal Copy Scope

### IN

適用後（`activationReceipt` 存在時）の ⑥ presentation のみ。

推奨主画面:

```text
⑥ 次版準備
版 4・適用中

現在適用中: 版 4
過去版: 版 3

次に変更するときは、新しい版を作ります。

[次の版を作る（表示専用）]

本番未保存
```

D5/D6 の 2 文は **⑥に残す**（この unit では削らない）。

実際の⑥は概ね:

```text
⑥ 次版準備
版 4・適用中

観察の不足だけでは、この計画を無効にしません。
見直し期限の超過だけでは、この計画を無効にしません。

現在適用中: 版 4
過去版: 版 3

次に変更するときは、新しい版を作ります。

[次の版を作る（表示専用）]

本番未保存
```

### REMOVE / DEMOTE（Apply 後の⑥主画面から）

```text
REMOVE from after-apply ⑥ primary
  SUPPORT_PLAN_NEXT_VERSION_NOTE（長い「次回の変更は…接続されていません」）
  SUPPORT_PLAN_IMMUTABLE_VERSION_NOTE（「計画は上書きせず…」）
  next-version-number 行（版4/版4 不整合）

DEMOTE from ⑥ primary（selector は保持）
  data-sbs-mgmt-plan-activation-c-receipt
  → 履歴・詳細の「適用情報」補助へ移す
  主画面に ISO actor/time を出さない
```

履歴ラベル短縮（意味は同じ）:

```text
版 3: 過去版  →  過去版: 版 3
```

1 行残す場合の copy（新定数可）:

```text
次に変更するときは、新しい版を作ります。
```

### RETAIN

```text
create-cta disabled（Scope Correction-1）
D5=B / D6=A 2文と既存 selector
現在適用中: 版 N（activation-c-active-version）
過去版行（activation-c-history）— 文言短縮可
本番未保存（boundary / live-write=false）
Apply 前 区間 B（SIMPLIFICATION-1）
Apply CTA / 表示条件 / 状態遷移
```

### OUT

```text
activation domain / session contract
CAS / ActivationReceipt 型
schema / SharePoint / LIVE WRITE
Apply lifecycle / Apply CTA 条件
conceptualNextVersion の計算ロジック変更
D5/D6 の統合短縮（下記 Optional）
新カード・modal・workflow
情報を増やすこと
```

### Optional（この unit に混ぜない）

D5/D6 を 1 行にまとめるなら **別明示 scope**:

```text
※ 観察不足・見直し期限超過だけでは、計画は無効になりません。
```

レビュー対象は別 GO。SIMPLIFICATION-2 では 2 文をそのまま残す。

### Files (GO 後のみ)

```text
spfx/src/shell/users/SupportPlan.tsx
spfx/src/shell/users/support-plan-copy.ts
spfx/src/shell/users/support-plan.test.ts     — 定数同期のみ
spfx/smoke/sbs-mgmt-loop-b/run-smoke.mjs      — receipt が DOM に残る限り assert 維持
```

### DOM selectors

```text
KEEP in document
  data-sbs-mgmt-plan-activation-c="applied"
  data-sbs-mgmt-plan-activation-c-active-version
  data-sbs-mgmt-plan-activation-c-history
  data-sbs-mgmt-plan-activation-c-receipt   （⑥主画面から退避してよい）
  data-review-new-version="create-cta"
  data-review-new-version="observation-not-invalidating"
  data-review-new-version="overdue-not-invalidating"
  data-sbs-mgmt-loop-b-boundary
  data-sbs-mgmt-plan-activation-c-live-write="false"
```

After-apply で `next-version-number` を出さない。selector 削除ではなく **非表示** でよい。

### Acceptance（GO 後）

```text
1. Apply 後 5秒で「今 版4 / 前は版3 / 次は表示専用CTA」が読める
2. 「次に重ねる概念上の版は 4」が Apply 後に出ない
3. ⑥主画面に ISO 適用証跡が出ない（補助へ）
4. D5/D6 2文が ⑥に残る
5. create-cta disabled が残る
6. B12 afterApply: active v4 / history v3 / receipt 要素は document に残る
7. T1–T5 機能理解を PASS のまま維持（遷移は変えない）
```

---

## PHASE 3 — Ponytail

別ファイル `...-simplification-2-ponytail-1.md`

---

## PHASE 4 — Independent Scope Review

別ファイル `...-simplification-2-independent-scope-review-1.md`

---

## GATE

```text
Actual Staff functional comprehension = PASS
Actual Staff usability finding = COPY CORRECTION REQUIRED
Human Ready GO = HOLD
Human UI Copy Correction Start GO — SIMPLIFICATION-2 = NOT RECEIVED
Implementation = NOT AUTHORIZED
Ready / Merge / Deploy / LIVE WRITE = NOT AUTHORIZED
```
