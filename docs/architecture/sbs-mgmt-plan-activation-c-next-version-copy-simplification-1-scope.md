# SBS-MGMT-PLAN-ACTIVATION-C — NEXT-VERSION-COPY-SIMPLIFICATION-1 Scope Definition

```text
unit: SBS-MGMT-PLAN-ACTIVATION-C-NEXT-VERSION-COPY-SIMPLIFICATION-1
kind: Scope Definition
mode: READ-ONLY / SCOPE DEFINITION ONLY
date: 2026-09-03
product HEAD: 5437e64703db055eef2bf230f5a682cf0286dc1a = FROZEN / NO CHANGE
Human UI Copy Correction Start GO = NOT RECEIVED
Implementation = NOT AUTHORIZED
Ready / Merge / Deploy / LIVE WRITE = NOT AUTHORIZED
```

---

## PHASE 1 — Current copy exact re-read

### ⑥ 次版準備 section (`nextVersionBlock`) — `SupportPlan.tsx` L545–L649

ブロックは 4 つの状態区間 (`activationReceipt` / `revisionDraft` / `revisionEligible` / none) にわたる。
以下は T2 状態（`revisionDraft` 存在, Apply 前）の表示文字列の全一覧。

#### 区間 A — 常に表示（`revisionDraft` の有無によらない）

| DOM selector | 文字列 | 定数 |
|---|---|---|
| `data-review-new-version="immutability-note"` | `次回の変更は新しい版を作ります。現行の適用中版は残します。作成・保存は接続されていません。` | `SUPPORT_PLAN_NEXT_VERSION_NOTE` |
| `(no selector)` | `計画は上書きせず、版を重ねます。現場記録は実施時点の計画版に残ります。` | `SUPPORT_PLAN_IMMUTABLE_VERSION_NOTE` |
| `data-review-new-version="next-version-number"` | `現行は版 3（適用中）。次に重ねる概念上の版は 4 です。` | inline JSX |
| `data-review-new-version="observation-not-invalidating"` | `観察の不足だけでは、この計画を無効にしません。` | `SUPPORT_PLAN_OBSERVATION_NOT_INVALIDATING_NOTE` |
| `data-review-new-version="overdue-not-invalidating"` | `見直し期限の超過だけでは、この計画を無効にしません。` | `SUPPORT_PLAN_REVIEW_OVERDUE_NOT_INVALIDATING_NOTE` |
| `data-review-new-version="create-cta"` | `次の版を作る（表示専用）` (disabled button) | `SUPPORT_PLAN_NEXT_VERSION_CTA` |

#### 区間 B — `revisionDraft` 存在時（T2 draft あり、Apply 前）

| DOM selector | 文字列 |
|---|---|
| `(inline)` | `変更内容の下書き: 版 4` |
| `(inline)` | `元の版: 3（変更しない）` |
| `data-sbs-mgmt-loop-b-active-version="true"` | `現在適用中: 版 3` |
| `data-sbs-mgmt-loop-b-draft-lifecycle="true"` | `版 4 は下書きです。まだ適用開始されていません。` |
| `(inline)` | `状態: 下書き / 本番未保存` |
| `data-sbs-mgmt-plan-activation-c-action="apply"` | `版 4 を適用開始する` (primary button) |

#### 区間 C — 常に表示（末尾）

| DOM selector | 文字列 |
|---|---|
| `data-sbs-mgmt-loop-b-boundary="true"` | `本番には保存されていません` |

---

### Locked invariants — 削除 / 変更禁止

以下の 2 ノートは `SP-LC-1 D5=B / D6=A` として LOCKED である。
⑥ から除去するには別の locked Decision 変更が必要になる。

| 定数 | 根拠 Decision |
|---|---|
| `SUPPORT_PLAN_OBSERVATION_NOT_INVALIDATING_NOTE`「観察の不足だけでは、この計画を無効にしません。」 | SP-LC-1 **D6=A** — 観察不足で計画を自動無効化しない |
| `SUPPORT_PLAN_REVIEW_OVERDUE_NOT_INVALIDATING_NOTE`「見直し期限の超過だけでは、この計画を無効にしません。」 | SP-LC-1 **D5=B** — 超過だけで計画を無効化しない |

両ノートは `data-review-new-version="observation-not-invalidating"` / `"overdue-not-invalidating"` セレクターで固定されており、テスト `support-plan.test.ts` L233–234 で `"無効にしません"` を assert している。

**この Scope では除去しない。詳細領域への退避も今回の OUT とする。**
理由: 別 locked Decision の変更が必要であり、Presentation-Copy-Only の境界を越える。

---

## PHASE 2 — Minimal Copy Scope Definition

### 対象ファイル（正本 2 ファイルのみ）

```text
spfx/src/shell/users/support-plan-copy.ts   — string 定数
spfx/src/shell/users/SupportPlan.tsx        — JSX インライン文字列
```

テスト影響:

```text
spfx/src/shell/users/support-plan.test.ts   — 変更した定数の assert を同期更新
```

### 提案 A（最小構成）

`revisionDraft` 存在時（T2 draft あり、Apply 前）の区間 B を次のように整理する。

**Before（区間 B 現在）:**

```text
変更内容の下書き: 版 4
元の版: 3（変更しない）
現在適用中: 版 3
版 4 は下書きです。まだ適用開始されていません。
状態: 下書き / 本番未保存
[版 4 を適用開始する]
```

**After（提案 A）:**

```text
適用中: 版 3
下書き: 版 4

[版 4 を適用開始する]

本番未保存
```

削除できる行:

| 行 | 削除理由 |
|---|---|
| `変更内容の下書き: 版 4` | 直後の `下書き: 版 4` で重複 |
| `元の版: 3（変更しない）` | `適用中: 版 3` で重複; 「変更しない」は apply CTA 前から自明 |
| `版 4 は下書きです。まだ適用開始されていません。` | `下書き: 版 4` と `[版 4 を適用開始する]` が状態を完結させる |
| `状態: 下書き / 本番未保存` | `下書き: 版 4` と末尾 `本番未保存` に分解 |

### 提案 B（1行説明を残す場合）

```text
現在適用中: 版 3
次の版: 版 4（下書き）

版 4 はまだ支援に適用されていません。

[版 4 を適用開始する]

本番未保存
```

削除できる行（提案 A との差分）:

- `変更内容の下書き: 版 4` / `元の版: 3（変更しない）` / `状態: 下書き / 本番未保存` を除去
- 「版 4 は下書きです。まだ適用開始されていません。」を短縮して 1 行残す

---

### 区間 A の扱い（`revisionDraft` を問わず常時表示の部分）

| 文字列 | 今回の扱い |
|---|---|
| `SUPPORT_PLAN_NEXT_VERSION_NOTE`（次回の変更は〜接続されていません。） | **出力位置の移動候補のみ**（詳細領域へ）—今回の IN としない |
| `SUPPORT_PLAN_IMMUTABLE_VERSION_NOTE`（計画は上書きせず〜）| **出力位置の移動候補のみ**—今回の IN としない |
| `現行は版 3（適用中）。次に重ねる概念上の版は 4 です。` | `revisionDraft` があるとき重複する。**削除候補**だが区間 A 共通ノードのため追加検討が必要 |
| `SUPPORT_PLAN_OBSERVATION_NOT_INVALIDATING_NOTE` | **LOCKED — 除去しない** |
| `SUPPORT_PLAN_REVIEW_OVERDUE_NOT_INVALIDATING_NOTE` | **LOCKED — 除去しない** |
| `次の版を作る（表示専用）` create-cta | **LOCKED — Scope Correction-1 (#553)** により保持 |

> **今回の IN は区間 B のみ（revisionDraft 存在時の重複削減）。**
> 区間 A の文字列は、除去・退避いずれも別 GO が必要な理由（locked Decision または Scope Correction-1 boundary）があるため OUT とする。

---

### DOM selector 保持

以下は変更後も DOM に残す:

```text
data-sbs-mgmt-loop-b-draft="true"          — 変更なし（親 div）
data-sbs-mgmt-loop-b-active-version="true" — 保持（値 "版 3" を短縮後も属性は保持）
data-sbs-mgmt-loop-b-draft-lifecycle="true" — 保持（テキストを短縮または置換）
data-sbs-mgmt-plan-activation-c-action="apply" — 変更なし（Apply button）
data-sbs-mgmt-loop-b-boundary="true"       — 変更なし（末尾 p）
```

---

## PHASE 3 — Ponytail / Minimality Scope Check

### 追加しないもの

- 新しいカード・modal・section は追加しない
- 新しい workflow / state は追加しない
- 「版 4 の適用で版 3 は過去版になります」等の先行情報は追加しない
- 新しい説明行を増やさない

### 境界確認

| 変更 | 判定 |
|---|---|
| activation domain / session contract | OUT — 変更なし |
| `revisionDraft` 型 / `activationReceipt` 型 | OUT — 変更なし |
| CAS / ActivationReceipt / DraftSnapshotId | OUT — 変更なし |
| Apply CTA の表示条件 | OUT — 変更なし |
| Apply CTA のラベル `版 4 を適用開始する` | OUT — 変更なし |
| `SUPPORT_PLAN_NEXT_VERSION_CTA`（create-cta）| OUT — 変更なし（Scope Correction-1） |
| `SUPPORT_PLAN_OBSERVATION_NOT_INVALIDATING_NOTE` | OUT — LOCKED（D6=A） |
| `SUPPORT_PLAN_REVIEW_OVERDUE_NOT_INVALIDATING_NOTE` | OUT — LOCKED（D5=B） |
| `SUPPORT_PLAN_NEXT_VERSION_NOTE` | OUT — 今回対象外（別 GO） |
| `SUPPORT_PLAN_IMMUTABLE_VERSION_NOTE` | OUT — 今回対象外（別 GO） |
| staff arrival harness | OUT — 変更なし |
| SharePoint / LIVE WRITE / Deploy | OUT |

最小性: 区間 B 内の重複行削減のみ。削減後、5 秒で 3 点を認識できる条件を満たす。

---

## PHASE 4 — Independent Scope Review

### 正本文書確認

| 正本 | 確認内容 | 判定 |
|---|---|---|
| SP-LC-1 D5=B | 超過だけで計画無効化しない → overdue note は LOCKED | 確認済 |
| SP-LC-1 D6=A | 観察不足で計画無効化しない → observation note は LOCKED | 確認済 |
| SP-LC-1 D4=A | 版を上書きしない → immutability note の意味は有効だが今回対象外 | 確認済 |
| SUPPORT-PLAN-REVIEW-NEW-VERSION-DEMO-1 Implementation Start | `observation不足 / reviewDue overdue だけでは計画無効にしない copy` が IN 要件として明示 | 確認済 |
| browser smoke PASS | `"無効化しない copy"` が PASS 要件に含まれる | 確認済 |
| `support-plan.test.ts` L233–234 | `SUPPORT_PLAN_OBSERVATION_NOT_INVALIDATING_NOTE` / `SUPPORT_PLAN_REVIEW_OVERDUE_NOT_INVALIDATING_NOTE` が `"無効にしません"` を assert | 確認済 |
| Scope Correction-1 (#553) | create-cta を非実行のまま保持 | 確認済 |

### 追加確認

- `次の版を作る（表示専用）` は Apply の代替ではなく前身 CTA。Scope Correction-1 で保持が確定。変更なし。
- `本番には保存されていません`（区間 C）は `data-sbs-mgmt-loop-b-boundary`・`data-sbs-mgmt-plan-activation-c-live-write="false"` に紐づく。保持。
- `data-review-new-version="next-version-number"` の `現行は版 3（適用中）。次に重ねる概念上の版は 4 です。` は区間 A の常時ノード。`revisionDraft` 存在時には区間 B の `適用中: 版 3 / 下書き: 版 4` と重複するが、今回はこの行の除去条件の詳細審査が別途必要（区間 A は `revisionDraft` が存在しない状態でも使われる）。今回の OUT とする。

---

## DELIVERABLE

```text
CURRENT
#584 product HEAD = 5437e64703db055eef2bf230f5a682cf0286dc1a = FROZEN
UI copy problem = CONFIRMED
  区間 B に重複表現が複数あり、職員が5秒以内に3点を認識しにくい
Proposed change = PRESENTATION COPY ONLY（区間 B 文字列削減）
Product mutation = NONE
```

### SCOPE

```text
exact files
  spfx/src/shell/users/support-plan-copy.ts   （文字列定数）
  spfx/src/shell/users/SupportPlan.tsx         （JSX インライン）
  spfx/src/shell/users/support-plan.test.ts    （定数 assert 同期のみ）

exact text regions
  SupportPlan.tsx L596–L606 区間 B（revisionDraft 存在時の重複 p 要素）

IN
  区間 B の重複 p 削減（変更内容の下書き、元の版、状態行）
  短縮後のラベル（適用中: 版 N / 下書き: 版 N+1 または 現在適用中: 版 N / 次の版: 版 N+1（下書き））
  dom selector 保持（変更なし）
  test assert 同期（削除した定数参照を除去、残す定数の文字列を更新）

OUT
  SUPPORT_PLAN_OBSERVATION_NOT_INVALIDATING_NOTE — LOCKED D6=A
  SUPPORT_PLAN_REVIEW_OVERDUE_NOT_INVALIDATING_NOTE — LOCKED D5=B
  SUPPORT_PLAN_NEXT_VERSION_NOTE — 今回対象外
  SUPPORT_PLAN_IMMUTABLE_VERSION_NOTE — 今回対象外
  SUPPORT_PLAN_NEXT_VERSION_CTA（create-cta） — Scope Correction-1 保持
  Apply CTA ラベル / 表示条件
  区間 A inline JSX（next-version-number p）
  activation domain / session contract
  schema / CAS / ActivationReceipt / DraftSnapshotId
  staff arrival harness
  SharePoint / LIVE WRITE / Deploy

retained invariants
  data-sbs-mgmt-loop-b-draft="true"
  data-sbs-mgmt-loop-b-active-version="true"
  data-sbs-mgmt-loop-b-draft-lifecycle="true"
  data-sbs-mgmt-plan-activation-c-action="apply"
  data-sbs-mgmt-loop-b-boundary="true"
  data-sbs-mgmt-loop-b-live-write="false"
  data-sbs-mgmt-plan-activation-c-live-write="false"
  SUPPORT_PLAN_OBSERVATION_NOT_INVALIDATING_NOTE（文字列 / selector）
  SUPPORT_PLAN_REVIEW_OVERDUE_NOT_INVALIDATING_NOTE（文字列 / selector）
  SUPPORT_PLAN_NEXT_VERSION_CTA（create-cta disabled button）

removed duplication（提案 A）
  「変更内容の下書き: 版 N」 → 「下書き: 版 N+1」に統合
  「元の版: N（変更しない）」 → 「適用中: 版 N」に集約
  「版 N+1 は下書きです。まだ適用開始されていません。」 → 「下書き: 版 N+1」と Apply で完結
  「状態: 下書き / 本番未保存」 → 「下書き」と末尾 「本番未保存」に分解

acceptance criteria（実装 GO 後の検証基準）
  1. 版 3 適用中 / 版 4 下書きで ⑥ を開いたとき、5 秒以内に「現在 版 3 / 版 4 下書き / Apply」の 3 点が読める
  2. 区間 B に「変更内容の下書き」「元の版: N（変更しない）」「状態: 下書き / 本番未保存」が現れない
  3. 「観察の不足だけでは」「見直し期限の超過だけでは」が ⑥ に残っている
  4. 「次の版を作る（表示専用）」ボタンが ⑥ に残っている（disabled）
  5. Apply CTA「版 4 を適用開始する」が変更なし
  6. DOM selector 6 点が保持されている
  7. npm test が PASS（test assert を定数変更と同期済み）
  8. #584 product HEAD が 5437e64 のまま（diff は copy 文字列と test assert のみ）
```

---

## GATE

```text
Human UI Copy Correction Start GO = NOT RECEIVED
Implementation = NOT AUTHORIZED
#584 product HEAD = FROZEN / NO CHANGE
Ready / Merge / Deploy / LIVE WRITE = NOT AUTHORIZED
```
