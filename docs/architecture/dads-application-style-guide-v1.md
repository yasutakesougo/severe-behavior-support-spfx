# DADS-03 — Application Style Guide v1（法人アプリ UI 正本）

```text
Issue / program: DADS（法人アプリ UI 収束）
Unit: DADS-03 — Application Style Guide
Document: Application Style Guide v1
Status: SELECTED / LOCKED（docs-only；this PR）
Authority upstream:
  Decision-DADS-ADOPTION-V1
    docs/architecture/decision-dads-adoption-v1.md
  DADS-02 Existing UI Inventory（MERGED）
    docs/architecture/dads-existing-ui-inventory.md
Baseline main: a527f8aa97e0c86f9d37b86eb5c9e9264951872e
  （includes DADS-01 + DADS-02）
Kind: docs-only / existing behavior mutation = 0
React / CSS / SPFx / tests / scripts mutation: NOT AUTHORIZED（this PR）
DADS-04 Design Tokens Start: NOT AUTHORIZED（separate GO）
DADS-05 Shared UI Primitives Start: NOT AUTHORIZED（separate GO）
DADS-06 Accessibility Gate Start: NOT AUTHORIZED（separate GO）
DADS-UX-* screen migration: NOT AUTHORIZED（separate GO each）
Deploy / SharePoint write / #299 Close: NOT AUTHORIZED
```

## 1. Purpose

本 Style Guide は、デジタル庁デザインシステム（DADS）を **プラットフォーム参考** としつつ、本リポジトリの **表示・操作の正本** を法人アプリ固有に再定義する。

```text
目標 ≠ DADS 見た目への全面移行
目標 = 既存 DEMO-UX をベースラインとして保存し、DADS 基準で収束する原則を docs で固定する
```

入力:

```text
DADS-01 Adopt / Adapt / Application Specific 分割
DADS-02 Inventory 25 件（PASS 8 / ADAPT 11 / GAP 4 / N/A 2）
特に高影響 GAP: INV-07 / INV-10 / INV-17 / INV-19
```

## 2. Authority Boundary（LOCKED；DADS-01 継承）

```text
制度・業務ルール
        ↓
Domain / Contracts
        ↓
法人アプリ UI Style Guide（本文書）  ← 表示・操作の正本
        ↑
       DADS                           ← 基礎・参考（Domain より上位にしない）
        ↓
SPFx / React 実装
```

| 問い | 正本 |
|---|---|
| 業務上「何を意味するか」 | 既存 Decision / Domain / Contracts |
| それを「どう表示・操作するか」 | **本文書** |
| Style Guide の基礎・参考 | DADS |

### 2.1 FORBIDDEN for Style Guide–driven change

```text
業務ルール / 制度 Decision
Domain モデルの意味
Contracts（入出力・不変条件・語彙の意味）
SharePoint schema / mapping
権限モデル / Entra / role policy
recordStatus 等の業務上の意味
reasonCodes / result 等の契約語彙の意味
支援計画シート等の作成者・提出・差戻し等の既存 Decision の意味
handoff / 引き継ぎ状態更新の業務意味
fail-closed / unselected / access_denied / save_outcome_unknown 非丸め 等の安全境界の意味
```

見た目・構造・a11y の原則変更でも、上記の意味は **UNCHANGED**。意味変更が必要なら **別 Decision**。

### 2.2 Style Guide が規定してよいもの

```text
Accessibility / Typography / Spacing / Focus
Form semantics（提示） / Error presentation（提示）
Heading structure / Interaction principles
Application Specific の presentation vocabulary
PASS 継承 / ADAPT 候補 / GAP 是正原則
後続 DADS-04 tokens / DADS-05 primitives / DADS-06 gate への入力方針
```

## 3. Non-negotiable judgment rules

1. **「DADS と違う = 修正」にしない**
2. 既存で問題なし（Inventory **PASS**）→ **置換しない**（既定 KEEP）
3. ADAPT は **presentation-only**（業務意味・fail-closed 意味を変えない）
4. GAP 是正は原則の固定までが DADS-03。実装は **別 GO**
5. 見た目統一（余白・角丸等）は **a11y / 構造の後**
6. React に DADS 値を直書きしない → **DADS-04 中間トークン層**
7. 既存 browser smoke の業務不変条件を捨てない／テスト改変で PASS させない

## 4. Application Specific vocabulary（presentation）

> Semantic（Domain/Contracts）と Presentation（本節）を分離する。  
> 本節のラベルは **画面提示語彙** であり、判定ロジック・永続語彙の再定義ではない。

### 4.1 Roster / attention status labels（INV-12 PASS → KEEP）

| Presentation label | Role | Notes |
|---|---|---|
| **要確認** | primary | DEMO-UX-7 canon |
| **未記録** | primary | DEMO-UX-7 canon |
| **期限接近** | primary | DEMO-UX-7 canon |
| 確認待ち / 確認対象 / 期限間近 | **deprecated as primary** | 新規 primary 使用禁止（既存 DEMO-UX-7） |

```text
通常（平常表示）: 上記 primary が付かない行・カードの既定見た目
色だけに依存しない: テキストラベルが正本（Adopt）
形状の統一: ADAPT 候補（INV-13）→ DADS-05 StatusBadge CONSOLIDATE 候補
```

### 4.2 Save-state vocabulary（INV-14 PASS → KEEP）

| State id | Presentation label | Rule |
|---|---|---|
| `unsaved` | 未保存 | KEEP |
| `saving` | 保存中 | KEEP；主要操作一時停止表示可 |
| `saved` | 保存済み | KEEP |
| `save_failed` | 保存失敗 | KEEP |
| `save_outcome_unknown` | 保存結果不明 | **成功・失敗へ丸めない**（LOCKED） |

Emphasis（DEMO-UX-12）:

```text
QUIET = saved / unsaved
EMPHASIZED = saving / save_failed / save_outcome_unknown
```

### 4.3 Review / plan / demo mutation boundary

| Presentation concept | Rule |
|---|---|
| 支援計画 | Application Specific 画面。制度上の作成者・提出意味は Domain/Decision 正本 |
| 見直し状態 | Application Specific。Family R vs Family A 母集団差の説明方針は DEMO-UX-10 を維持 |
| 操作不可 / 実保存なし | DEMO mutation boundary。disabled + 説明。緩和禁止 |
| 入力エラー（提示） | フォーム原則（§6.4）。業務エラー語彙の意味は Contracts |

### 4.4 Fail-closed presentation vocabulary（INV-15/16/24 PASS → KEEP）

| Mode / surface | Presentation rule |
|---|---|
| loading | テキスト status 許容；PII なし |
| access_denied | alert；個人情報を出さない |
| retrieval_failed | alert；「判定していない」系の安全提示を維持 |
| unauthenticated | alert；ユーザ表示抑制 |
| site unselected | 業務操作停止 |
| partial retrieval | 成功件数へ失敗を混ぜない；警告維持 |
| DemoBanner | 常時表示方針を維持 |

**置換禁止の安全境界**として扱う。見た目トークンのみ後続 ADAPT 可。

## 5. KEEP（Inventory PASS → Style Guide 既定）

| INV | Principle |
|---|---|
| INV-01 | App Shell IA（skip / banner / nav / main）を法人アプリ固有として継承。DADS 標準ナビへ強制置換しない |
| INV-03 | 画面遷移後に destination `<h1 tabIndex=-1>` へフォーカスするパターンを標準とする |
| INV-12 | §4.1 status label canon を継承 |
| INV-14 | §4.2 save-state + 非丸め + QUIET/EMPHASIZED を継承 |
| INV-15 | §4.4 fail-closed パネル群を置換禁止で継承 |
| INV-16 | DemoBanner / inquiry / partial-retrieval 通知パターンを継承。トースト必須化しない |
| INV-21 | landmark / live-region 基盤を継承。個別 GAP のみ後続で扱う |
| INV-24 | loading はテキスト `role=status` を許容。装飾スピナーは任意・非必須 |

## 6. Adopt principles（DADS 基礎を法人アプリへ取り込む）

### 6.1 Accessibility

- キーボードで主要導線（ナビ、フィルタ、戻る、主要 CTA）に到達できること
- 名前（accessible name）・状態・現在位置が AT に伝わること
- 状態は色だけに依存しない（テキストラベル正本）
- コントラストは後続トークン／検証（DADS-04 / DADS-06）で計測可能にする

### 6.2 Typography / Spacing

- 読みやすさ・階層の基礎を Style Guide で定義する（具体トークン値は **DADS-04**）
- 現状の rem / px 方言差（INV-22）は **必須修正ではない**。収束はトークン層で候補化
- 見た目統一は a11y / 構造是正の後

### 6.3 Focus

- 操作可能コントロールはフォーカス可視を保証する
- 方針候補: インタラクティブ要素は **`:focus-visible`** を既定に寄せる（INV-20 ADAPT）
- destination heading の programmatic focus（INV-03）は KEEP

### 6.4 Form semantics

- すべての入力に可視ラベル（または同等の accessible name）
- 説明・エラーは対象コントロールへ関連付ける（提示原則）
- 記録フォームは業務フロー優先で寄せる（Adapt）。実保存なし境界は維持（INV-09）

### 6.5 Error / status presentation

- エラー・警告は `role="alert"` または適切な live region で伝える
- 業務エラー語彙の意味は Contracts 側；Style Guide は **伝わり方** のみ
- save_outcome_unknown を失敗へ丸めない（§4.2）

### 6.6 Heading structure

- **1 画面（1 destination view）に主見出し h1 は 1 つ**
- セクションは h2 以降で階層化
- 製品名／ブランドは banner 内でよいが、**勝手に h1 を奪わない**（INV-02）
- ホスト補助文言を content 見出し階層へ混ぜない（→ §8 INV-19）

### 6.7 Interaction principles

- 操作可能に見えるものは操作可能であること
- 操作不能は disabled + 理由の提示（DEMO mutation / fail-closed）
- 「タブに見えるがタブでない」UI を作らない（→ §8 INV-07）

## 7. Adapt principles（サービス固有に寄せてよい）

| Area | Corporate-app rule | Inventory |
|---|---|---|
| Navigation | 概要 / 利用者 / 記録の primary IA を維持 | INV-01 KEEP；INV-02 ADAPT |
| Cards | 必要時のみ。KPI 等の非操作ブロックをカード過剰にしない | INV-04 |
| Tables / lists | 利用者一覧の密度・フィルタはアプリ IA 優先 | INV-05 |
| Status presentation | ラベルは §4.1。形状統一は候補であり必須ではない | INV-11, INV-13 |
| Forms | 記録・照会は業務フロー優先でフォーム原則へ寄せる | INV-09, INV-18 |
| Notifications | 安全境界を崩さない範囲で提示を整える | INV-16 KEEP |
| Visual dialects | rem/px・radius 方言はトークン収束候補 | INV-22 |
| Focus styles | `:focus` / `:focus-visible` 混在を統一候補に | INV-20 |
| Nested screens | 詳細 / 支援計画 / 見直しの入れ子 IA を維持しつつ見た目寄せ | INV-06, INV-08, INV-11 |

**ADAPT ≠ 今すぐ実装。** 実装は DADS-04+ / DADS-UX-* の別 GO。

## 8. GAP remediation principles（INV-07 / 10 / 17 / 19）

> 本節は **原則の正本化** のみ。実装・コンポーネント置換は NOT AUTHORIZED。

### 8.1 INV-07 — Section chrome ≠ ARIA tabs（VALID GAP）

**現状:** 利用者詳細の「表示順」ストリップが tabs に見えるが、`tablist`/`tab`/`tabpanel` ではなく `span`/`button` 混在。

**Style Guide 原則（SELECTED）:**

```text
原則 A（LOCKED）:
  見た目がタブでも、ARIA tabs パターンを満たさないなら tabs と呼称・実装しない。

原則 B（SELECTED default for current DEMO-UX）:
  現行ストリップは「セクション表示順ラベル（非タブ）」として扱う。
  - 非操作ラベルは button に見せない（同一視覚クラスの button/span 混在を解消する方針）
  - 支援計画への遷移は明示的なリンク/ボタンとして分離する方針

原則 C（alternate；別 GO で選択可）:
  真の in-page tabs が必要なら、tablist / tab / tabpanel + 鍵盤操作を揃えてから導入する。
```

```text
業務セクション意味（現在の支援 / 支援計画 / 記録 / 評価 / 履歴）= UNCHANGED
実装開始 = NOT AUTHORIZED（DADS-UX / DADS-05 別 GO）
```

### 8.2 INV-10 — Selection control semantics（VALID GAP）

**現状:** 未完了確認が `listbox` + `button[role=option]`。鍵盤 listbox パターンなし。

**Style Guide 原則（SELECTED）:**

```text
原則:
  選択 UI は、採用した ARIA パターンの鍵盤・構造要件を満たすこと。
  満たせないなら、より単純なパターンへ落とす。

推奨パターン順位（presentation-only）:
  1) 明示的な button group / 単一選択ボタン列（最も単純；現行クリック選択に近い）
  2) radiogroup + radio
  3) 正規 listbox（option は適切な子、矢印キー / aria-activedescendant 等を実装）

禁止:
  listbox を名乗りつつ option をネイティブ button に載せる中途半端なハイブリッドを新規に増やさない
```

```text
選択の業務意味（どの利用者の下書きイメージか）= UNCHANGED
実保存配線 = NOT AUTHORIZED
```

### 8.3 INV-17 — Empty presentation（VALID GAP）

**現状:** 利用者フィルタ 0 件は plain `<p>`。共有 EmptyState なし。

**Style Guide 原則（SELECTED）:**

```text
Empty presentation 必須要素:
  1. 何が空か（フィルタ結果 / 取得成功ゼロ 等）が分かる文言
  2. 動的変化で現れる空状態は status として伝える（例: role="status" または同等 live region）
  3. 見出し階層を壊さない（空状態のために勝手に h1 を増やさない）

非要件:
  - 共有 EmptyState コンポーネントの即時導入は必須ではない（DADS-05 候補）
  - カード化・イラスト必須化はしない
  - 「コンポーネントが無い = 修正」にしない

Partial-retrieval succeeded-empty:
  親が既に alert なら追加 live region は必須としない。
  文言の一貫性だけ Adapt 候補。
```

### 8.4 INV-19 — Host chrome vs content headings（VALID GAP）

**現状:** destination の h1/h2 の後に Scaffold host の「Shell ready」系 `<h2>` が続く。

**Style Guide 原則（SELECTED）:**

```text
原則:
  ホスト／スキャフォールド補助文言は、業務画面の見出し階層に混入させない。

是正方針（いずれか；実装は別 GO）:
  1) 補助文言を非見出し（p / status）にする
  2) デモ準備完了面を業務 destination と同時表示しない
  3) どうしても見出しにする場合は、文書構造上の補足位置を明示し主 h1 を奪わない

1 画面 1 主見出し（§6.6）と整合させる。
業務見出しの意味 = UNCHANGED
```

## 9. Inventory → Style Guide traceability（25）

| INV | Class | Style Guide disposition |
|---|---|---|
| INV-01 | PASS | KEEP §5 |
| INV-02 | ADAPT | Brand/製品名は banner テキスト可；h1 は destination（§6.6） |
| INV-03 | PASS | KEEP §5 / §6.3 |
| INV-04 | ADAPT | Overview IA・件数語彙 KEEP；余白/カードは §7 |
| INV-05 | ADAPT | 一覧密度・フィルタ表現 §7；フィルタ意味 KEEP |
| INV-06 | ADAPT | 詳細 IA KEEP；見た目 §7；タブは §8.1 |
| INV-07 | GAP | §8.1 原則 A+B |
| INV-08 | ADAPT | 支援計画 Application Specific；mutation fail-closed KEEP |
| INV-09 | ADAPT | 記録フロー §6.4/§7；保存意味 KEEP |
| INV-10 | GAP | §8.2 |
| INV-11 | ADAPT | 見直し表示語彙 Application Specific；色だけ禁止 |
| INV-12 | PASS | KEEP §4.1 |
| INV-13 | ADAPT | 形状 CONSOLIDATE 候補（DADS-05）；必須修正にしない |
| INV-14 | PASS | KEEP §4.2 |
| INV-15 | PASS | KEEP §4.4 |
| INV-16 | PASS | KEEP §5 |
| INV-17 | GAP | §8.3 |
| INV-18 | ADAPT | §6.4 / §7 Forms |
| INV-19 | GAP | §8.4 |
| INV-20 | ADAPT | §6.3 focus-visible 寄せ |
| INV-21 | PASS | KEEP §5 |
| INV-22 | ADAPT | §6.2；値は DADS-04 |
| INV-23 | N/A | DADS-04 専任（§10） |
| INV-24 | PASS | KEEP §5 |
| INV-25 | N/A | Style Guide 対象外；削除整理は別 Issue |

## 10. Hand-off to later units（NOT START）

### 10.1 DADS-04 — Design Tokens

```text
Start: NOT AUTHORIZED by this document
Input from DADS-03:
  - Typography / Spacing / Focus / Color presentation tokens の必要性
  - React に DADS 値を直書きしない
  - SPFx theme 文字列 + ハードコード色の中間層化
OUT of DADS-03: 具体トークンコード
```

### 10.2 DADS-05 — Shared UI Primitives

```text
Start: NOT AUTHORIZED
Candidate primitives（KEEP / ADAPT / FIX / CONSOLIDATE）:
  - StatusBadge（表示のみ；INV-13）
  - Empty presentation helper（INV-17；必須コンポーネント化は非強制）
  - Alert / StatusPanel family consolidation（INV-15/16 KEEP 意味）
  - Selection control（INV-10 FIX 候補）
  - Section label / in-page nav（INV-07 FIX 候補）
既存で問題なし → 置換しない
```

### 10.3 DADS-06 — Accessibility Gate

```text
Start: NOT AUTHORIZED
Input: §6 Adopt principles + §8 GAP principles を検証可能な受入に落とす
既存 smoke の業務不変条件は維持；テスト改変で PASS させない
```

### 10.4 DADS-UX-* — Screen migration order

```text
Start: NOT AUTHORIZED each
Order（DADS-01 継承）:
  1 App Shell
  2 Overview
  3 利用者一覧
  4 利用者詳細（含 INV-07）
  5 記録入力（含 INV-10）
  6 見直し状況
  7 エラー / 空状態 / 通知（含 INV-17/19）
1 Issue = 1 UI slice；全面リファクタ PR 禁止
```

## 11. Exact OUT（this unit / this PR）

```text
React / CSS / SCSS / SPFx component mutation = OUT
Design token code = OUT（DADS-04）
Primitive rewrite = OUT（DADS-05）
Accessibility CI wiring = OUT（DADS-06）
Screen migration = OUT（DADS-UX-*）
Domain / Contracts / schema / permission mutation = OUT
fail-closed / recordStatus meaning change = OUT
actual save / SharePoint write / live I/O = OUT
Deploy / #299 Close = OUT
DADS 全面置換 / Figma 一括必須化 = OUT
```

## 12. Acceptance for DADS-03（docs-only）

1. Authority Boundary と「DADS ≠ Domain 上位正本」が再掲・固定されている  
2. Application Specific vocabulary（status / save / fail-closed）が定義されている  
3. PASS → KEEP、ADAPT → presentation 候補、GAP → 是正原則が固定されている  
4. INV-07 / 10 / 17 / 19 に SELECTED 原則がある  
5. DADS-04 / 05 / 06 / UX-* への hand-off と **Start NOT AUTHORIZED** が明示されている  
6. **コード差分 0**（docs のみ）  
7. Deploy / SharePoint / #299 Close / 実装開始が非認可のまま  

## 13. Gate separation

```text
DADS-03 LOCKED ≠ DADS-04 Token Implementation Start
DADS-03 LOCKED ≠ DADS-05 Primitive Start
DADS-03 LOCKED ≠ DADS-06 Accessibility Gate Start
DADS-03 LOCKED ≠ any DADS-UX-* Start
DADS-03 LOCKED ≠ Deploy / SharePoint write / #299 Close
DADS-03 LOCKED ≠ Ready-as-code-merge-of-behavior
```

次の Human gate（推奨）: **DADS-03 Fresh Review** →（PASS 後）Merge。  
その後の実装系は **DADS-04 Start GO** 等の別指示。

## 14. References

```text
docs/architecture/decision-dads-adoption-v1.md
docs/architecture/dads-program-roadmap.md
docs/architecture/dads-existing-ui-inventory.md
https://design.digital.go.jp/
https://design.digital.go.jp/dads/guidance/style-guides/
SHELL-UX / DEMO-UX vocabulary:
  spfx/src/shell/ux/status-labels.ts
  spfx/src/shell/ux/save-state.ts
Baseline for this unit: a527f8aa97e0c86f9d37b86eb5c9e9264951872e
```
