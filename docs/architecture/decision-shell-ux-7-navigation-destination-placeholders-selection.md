# SHELL-UX-7 — Safe Navigation Destination Placeholders — Human Selection Packet

この文書は、Issue #28 の次 shell UX slice として
**SHELL-UX-7 — Safe Navigation Destination Placeholders** を固定する
docs-only Selection Packet である。

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-SHELL-UX-7-NAVIGATION-DESTINATION-PLACEHOLDERS-1
Kind: Human Selection（Issue #28 next slice / SHELL-UX-7）
Status: SELECTED / LOCKED（GO boundary）
Human Decision: SELECT SHELL-UX-7
Date: 2026-08-12
PR: TBD（Selection / Acceptance / Independence Review only）

Baseline:
  main tip = bd5a6ae214c18137d095310106857fe298a448ef
  SHELL-UX-6 = MERGED（PR #250）
  Primary navigation keyboard traversal = MERGED（PR #252）
  Viewport / 200% equivalent evidence = MERGED（PR #254）
  Issue #28 SoT tip（pre-selection body）= c0e0a11…（stale vs live main）
  Issue #28 SoT tip for this Decision = bd5a6ae214c18137d095310106857fe298a448ef

Candidate origin:
  Issue #28 UI-01〜04 business destinations = OUT / NOT IMPLEMENTED
  existing SHELL_PRIMARY_NAV_ITEMS = overview / users / records
  future business UI #68〜#71 = NOT STARTED / OUT of this Selection

Implementation Start: NOT AUTHORIZED（separate Human GO）
#28 Close: NOT AUTHORIZED
#21 authorization truth: OUT
#22 adapter continuation: NOT AUTHORIZED
#68〜#71 business UI: NOT AUTHORIZED
Agent auto-select: FORBIDDEN（this Selection is Human）
```

## 1. Why this slice now

```text
SHELL-UX-1〜6 / keyboard traversal / viewport evidence まで進行済み。
一方、主要ナビから業務 UI への destination surface は未接続のまま。

SHELL-UX-7 は業務画面を実装せず、
画面遷移・画面識別・共通レイアウトの presentation boundary だけを
既存 primary navigation vocabulary に拘束して固定する。

Dashboard / Plans / Administration の新規 primary nav 化は採用しない。
```

## 2. Selected unit

```text
SHELL-UX-7
Safe Navigation Destination Placeholders
```

## 3. Destination vocabulary（LOCKED）

既存 `SHELL_PRIMARY_NAV_ITEMS` と一致させる。新規業務分類を発明しない。

```text
overview → 概要
users    → 利用者
records  → 記録
```

採用しない候補（Packet 草案の語彙）:

```text
Dashboard（英語ラベルとしての新規採用）
Plans / 支援計画 の新規 primary navigation 化
Administration / 管理 の新規 primary navigation 化
#70 / #71 の future contract 確定
```

## 4. Authorized IN（Selection scope）

```text
IN:
  既存主要ナビの destination surface
  presentation-only page routing / selected-page state
  各 destination の見出し
  共通 page title / current navigation indication
  現在事業所表示の維持
  demo表示の維持
  destination が未接続であることを明示する安全な表示
  keyboard navigation
  focus management
  PC / tablet layout
  200%相当表示
  synthetic / fixture-only unit tests
  browser smoke
```

## 5. Explicit OUT / FORBIDDEN

```text
OUT:
  Plans / 支援計画の新規 primary navigation 化
  Administration / 管理の新規 primary navigation 化
  #70 / #71 の future contract 確定
  利用者データ取得
  支援計画データ取得
  ABC / Observation データ取得・保存
  finding取得
  SharePoint REST
  SPHttpClient binder追加
  #22 adapter変更
  #21 authorization semantics
  Entra group lookup
  role resolution
  業務ロール別 destination 制御
  URL直指定の本番認可判定
  業務domain判定
  期限計算
  finding計算
  支援計画状態遷移
  実データ
  SharePoint / M365 / Entra mutation
  Deploy
  Production
  Issue #28 Close
  Issue #68〜#71 Implementation Start
  Implementation Start（this Selection alone）
  Ready / Merge auto-progress
```

## 6. Fail-closed presentation rules（Selection boundary）

禁止:

```text
未接続 destination → 利用可能と表示
retrieval未実施 → 正常0件と表示
authorization未判定 → authorized と表示
fixture → live business data と表示
未実装業務画面 → 完成済み画面と表示
```

未接続 destination は、例えば次の意味で明示する（実装時に既存 UX tone と整合）:

```text
この画面は現在、共通シェルの表示確認用です。
業務データには接続されていません。
```

## 7. Independence Check（candidate recorded at Selection）

```text
PERF-07 / 08 / 09 = NO DEPENDENCY
#22 broad adapter = HOLD / not required
#21 authorization semantics = OUT
GOV-RULE-01〜12 = no new dependency
Issue #68〜#71 = NOT REQUIRED

Independence Verdict Candidate:
  Independent = YES — CANDIDATE
  Reason:
    presentation-only / fixture-driven
    no live I/O
    no authorization judgment
    no unresolved PERF dependency
    no business workflow implementation
    vocabulary locked to existing primary nav only
```

正式 Independence Review は Selection / Acceptance 正本化後に実施する。

## 8. Stop condition

```text
Decision-SHELL-UX-7-NAVIGATION-DESTINATION-PLACEHOLDERS-1
= SELECTED / LOCKED

HOLD:
  Implementation Start = separate Human GO

Still NOT AUTHORIZED:
  code Implementation Start
  #28 Close
  #21 / #22 continuation
  #68〜#71 business UI
  Plans / Administration primary-nav expansion
  live I/O / auth judgment / Entra / role / REST / binder
```

## Reference

- Acceptance: `decision-shell-ux-7-navigation-destination-placeholders-acceptance.md`
- Independence Review: `decision-shell-ux-7-navigation-destination-placeholders-independent-review.md`
- Prior: `decision-shell-ux-6-unauthenticated-panel-acceptance.md`
- Prior: `shell-ux-6-implementation-start.md`, `shell-ux-6-browser-smoke.md`
- Vocabulary source: `spfx/src/shell/ux/primary-navigation.ts`
- Issue #28 remains OPEN; Close = NOT AUTHORIZED
- Next gate after Selection docs: Independence Review → separate Implementation Start Decision
