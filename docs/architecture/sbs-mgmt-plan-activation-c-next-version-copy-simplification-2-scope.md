# NEXT-VERSION-COPY-SIMPLIFICATION-2 — Scope Definition

```text
unit: SBS-MGMT-PLAN-ACTIVATION-C-NEXT-VERSION-COPY-SIMPLIFICATION-2
kind: Scope Definition
mode: IMPLEMENTATION (after-apply ⑥ presentation only)
date: 2026-09-04
authority: Human after-apply copy correction (display inconsistency + density)
Staff T1–T5 = PASS
FUNCTIONAL COMPREHENSION = PASS
Usability finding = CORRECTION REQUIRED
Human Ready GO = HOLD
Human UI Copy Correction Start GO — SIMPLIFICATION-2 = RECEIVED
Implementation = COMPLETE LOCALLY
Proposal A historical product = fed08fd49d12fccf323991fb95a4f5e58d6f9e55
PR #589 tip / historical CI = f85ee757a9795b62ad5da475dc0aebc78e3ad6d3
  = NOT SIMPLIFICATION-2 implementation CI authority
SIMPLIFICATION-2 SupportPlan mutation HEAD = 1cde2182ff1adbbd8414a0c6fca398169d29c7b8
#584 @ 5437e64 = FROZEN / historical basis only
Ready / Merge / Deploy / LIVE WRITE = NOT AUTHORIZED
```

---

## Why this unit

Actual Staff Plan-Transition Re-Test は機能理解 T1–T5 PASS。
残件は適用後⑥の **長さだけではない**。

表示不整合が 1 件ある:

```text
現行は版 4（適用中）。
次に重ねる概念上の版は 4 です。
```

現在版が `4` なら次版は本来 `5`。この行は誤認を招く。
`conceptualNextVersion` の計算ロジックを増やして `版5` を出すより、**この説明自体を削除する**のが最小。

機能・Apply・CAS・session・schema は触らない。

---

## PHASE 1 — Current after-apply copy (exact)

`nextVersionBlock`（`SupportPlan.tsx`）は 区間 A を **常時** 描画する。`activationReceipt` があっても同じ。

見出し `h2#review-new-version-next-heading` は `SUPPORT_PLAN_NEXT_VERSION_HEADING`（次の版の考え方）。
PLANNER 工程ナビのスロット名は別で `⑥ 次版準備`。

### 区間 A（Apply 後も同強度で残る）

| Selector / 定数 | Apply 後の例 |
|---|---|
| `SUPPORT_PLAN_NEXT_VERSION_HEADING` | 次の版の考え方 |
| `SUPPORT_PLAN_NEXT_VERSION_NOTE` | 次回の変更は新しい版を作ります。現行の適用中版は残します。作成・保存は接続されていません。 |
| `SUPPORT_PLAN_IMMUTABLE_VERSION_NOTE` | 計画は上書きせず、版を重ねます。現場記録は実施時点の計画版に残ります。 |
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

### Display inconsistency（削除する。計算しない）

```text
現行は版 4（適用中）。次に重ねる概念上の版は 4 です。
```

`liveCurrentVersion` は Apply 後 4 になる。
`conceptualNextVersion` は **fixture `presentation` のまま 4**。
Apply 後の「次版」は 5 であるべきなので、この行は長文であるだけでなく **表示不整合**。
最小修正は Apply 後にこの行を出さないこと。`conceptualNextVersion` の計算式変更は今回 OUT。

---

## PHASE 2 — Minimal Copy Scope

Human 確定の適用後⑥（この文書の正本コピー）:

```text
⑥ 次版準備

版 4・適用中

現在適用中: 版 4
過去版: 版 3

次に変更するときは、新しい版を作ります。
現在の版はそのまま残ります。

観察の不足だけでは、この計画を無効にしません。
見直し期限の超過だけでは、この計画を無効にしません。

[次の版を作る（表示専用）]

本番未保存
```

工程スロット名 `⑥ 次版準備` は既存 PLANNER nav。新カードは作らない。

### IN

```text
- 適用後の⑥だけ（activationReceipt 存在時）
- 重複説明の削除
- 「次に重ねる概念上の版は 4」の削除（計算ロジックは増やさない）
- 現在版 / 過去版を主情報として残す
- 適用証跡の主表示からの降格候補
```

### REMOVE from after-apply ⑥ primary

Human 削除候補（適用後の⑥主画面）:

```text
「次の版の考え方」見出し

次回の変更は新しい版を作ります。
現行の適用中版は残します。
作成・保存は接続されていません。

計画は上書きせず、版を重ねます。
現場記録は実施時点の計画版に残ります。

現行は版4（適用中）。
次に重ねる概念上の版は4です。

適用: planning-pc-synthetic-staff / ISO timestamp
```

対応:

```text
REMOVE from after-apply ⑥ visible primary
  SUPPORT_PLAN_NEXT_VERSION_HEADING の可視見出し
    （#review-new-version-next-heading の in-page ジャンプは壊さない。
      適用後の可視文言だけ消す / 工程スロットに寄せる。Apply 前は変更しない）
  SUPPORT_PLAN_NEXT_VERSION_NOTE
  SUPPORT_PLAN_IMMUTABLE_VERSION_NOTE
  next-version-number 行（版4/版4 不整合）

REPLACE those two long notes with the two short lines above
  次に変更するときは、新しい版を作ります。
  現在の版はそのまま残ります。

DEMOTE from ⑥ primary（selector は保持）
  data-sbs-mgmt-plan-activation-c-receipt
  → 履歴・詳細の「適用情報」補助へ移す
  主画面に ISO actor/time を出さない
  planning-pc-synthetic-staff / timestamp は職員向け主画面の情報密度が高く、
  T1–T5 理解確認にも使われていない
```

履歴ラベル短縮（意味は同じ）:

```text
版 3: 過去版  →  過去版: 版 3
```

Apply 前（SIMPLIFICATION-1 区間 B）は変更しない。

### RETAIN

```text
観察の不足だけでは、この計画を無効にしません。
見直し期限の超過だけでは、この計画を無効にしません。
次の版を作る（表示専用）  disabled（Scope Correction-1）
本番未保存
現在適用中: 版 N（activation-c-active-version）
過去版行（activation-c-history）— 文言短縮可
Apply 前 区間 B（SIMPLIFICATION-1）
Apply CTA / 表示条件 / 状態遷移
```

### OUT

```text
Applyロジック
version transition
session / CAS / schema
SharePoint
Deploy / LIVE WRITE
activation domain / session contract
conceptualNextVersion の計算ロジック変更（版5 を出さない）
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
3. 「現行は版 4（適用中）。次に重ねる概念上の版は 4 です。」が Apply 後に出ない
4. ⑥主画面に ISO 適用証跡 / planning-pc-synthetic-staff が出ない（補助へ）
5. D5/D6 2文が ⑥に残る
6. create-cta disabled が残る
7. 「次に変更するときは、新しい版を作ります。」「現在の版はそのまま残ります。」が出る
8. B12 afterApply: active v4 / history v3 / receipt 要素は document に残る
9. T1–T5 機能理解を PASS のまま維持（遷移は変えない）
```

---

## implementation-plan

- 判定: READY（Scope 固定。実装着手は別 GO）
- 実装目的: 適用後⑥から重複説明と版4/版4不整合行を消し、現在版/過去版を主情報にする
- 対象リポジトリ: yasutakesougo/severe-behavior-support-spfx
- 対象範囲: 適用後⑥ presentation copy のみ
- 対象外: Apply / version transition / session / CAS / schema / SharePoint / Deploy / LIVE WRITE
- 変更対象: SupportPlan.tsx / support-plan-copy.ts / support-plan.test.ts / B12 assert 維持
- Issue 分割: #583 本 unit のみ
- PR 分割: 実装は本 Scope の Human Start GO 後に別 PR。本 PR は docs のみ
- 実装順序: GO → after-apply 分岐 → 定数 → test 同期 → B12
- テスト計画: typecheck / unit（copy 定数）/ B12 afterApply selector / 不整合行非表示。Apply 遷移の再発明テストはしない
- HOLD: Human UI Copy Correction Start GO — SIMPLIFICATION-2。Human Ready GO
- 完了条件: 上記 Acceptance。Ready / Merge / Deploy は含まない

---

## PHASE 3 — Ponytail

別ファイル `sbs-mgmt-plan-activation-c-next-version-copy-simplification-2-ponytail-1.md`

---

## PHASE 4 — Independent Scope Review

別ファイル `sbs-mgmt-plan-activation-c-next-version-copy-simplification-2-independent-scope-review-1.md`

---

## GATE

```text
NEXT-VERSION-COPY-SIMPLIFICATION-2

Implementation = COMPLETE LOCALLY
Focused Verification = PASS
Rendered Visual Check = PASS
Functional regression = NOT OBSERVED
Scope = presentation copy only
  Apply / version transition / session / CAS / schema unchanged
Boundary sentence = RETAIN 「本番には保存されていません」
  Human shorthand 「本番未保存」 is locked as non-exact retain
  see boundary-copy-lock-1.md
「過去の版」見出し = OUT
Human Ready GO = HOLD
#589 @ f85ee757 = NOT this implementation's exact-head CI authority

NEXT
Exact Implementation HEAD Fixation
→ exact-head CI
→ Ponytail / Minimality Implementation Review
→ Independent Implementation Review
→ Actual Staff Re-Check
→ Human Ready GO / HOLD
```
