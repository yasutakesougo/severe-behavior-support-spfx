# DADS-01 — Digital Agency Design System Adoption Decision（DADS-ADOPTION-V1）

```text
Issue / program: DADS（法人アプリ UI 収束）
Unit: DADS-01 — Adoption Decision
Decision: Decision-DADS-ADOPTION-V1
Status: SELECTED / LOCKED（docs-only）
Human direction: 2026-08-13 — 「既存UIをDADS基準で収束」；最初の実作業 = DADS-01 docs-only
Baseline main: 69962ca（includes DEMO-UX-14 MERGED / PR #330）
Kind: docs-only / existing behavior mutation = 0
React / CSS / SPFx code change: NOT AUTHORIZED（this PR）
DADS-02 Inventory Start: NOT AUTHORIZED（separate GO）
DADS-04+ Implementation: NOT AUTHORIZED
Deploy / SharePoint write / #299 Close: NOT AUTHORIZED
```

## 1. Purpose

本 Decision は、**デジタル庁デザインシステム（DADS）** を本リポジトリへ取り込むときの **位置づけ・権限境界・Adopt/Adapt/Application-Specific 分割・後続工程** だけを固定する。

```text
目標 = 「DADSへの全面移行」ではない
目標 = 「既存UIをDADS基準で収束させる」
```

既存の制度・業務ルール / Domain / Contracts / DEMO-UX の意味を、UI 刷新の副作用で変えない。

## 2. Reference

| Item | Value |
|---|---|
| Name | デジタル庁デザインシステム（Digital Agency Design System / DADS） |
| Site | https://design.digital.go.jp/ |
| Style guide guidance | https://design.digital.go.jp/dads/guidance/style-guides/ |
| Character | **プラットフォーム型**デザインシステム（そのまま企業ブランドの Style Guide としては使わない） |

DADS 自身の案内どおり、個別サービスはブランド・情報設計に合わせて **Style Guide として再定義**する。  
「DADS と見た目が違う = 必ず修正」ではない。

## 3. Authority Boundary（LOCKED）

### 3.1 Layer model（正本の上下関係）

```text
制度・業務ルール
        ↓
Domain / Contracts
        ↓
法人アプリ UI Style Guide     ← 表示・操作の正本（アプリ固有）
        ↑
       DADS                   ← Style Guide の基礎・参考（Domain より上位にしない）
        ↓
SPFx / React 実装
```

| 問い | 正本 |
|---|---|
| 業務上「何を意味するか」 | 既存 Decision / Domain / Contracts |
| それを「どう表示・操作するか」 | 法人アプリ UI Style Guide（DADS-03 以降） |
| Style Guide の基礎・参考 | DADS |

**DADS を Domain / Contracts より上位の正本にしない。**  
DADS の更新によって業務仕様・権限・スキーマが変わる事故を防ぐ。

### 3.2 DADS が変更権限を持たないもの（FORBIDDEN for DADS-driven change）

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

例: UI の色やラベル配置を変えても、制度上の作成者（例: 実践研修修了者）Acceptance や `recordStatus` の意味は **UNCHANGED** のままとする。見た目変更は別 Decision なしに業務意味を書き換えない。

### 3.3 DADS が影響してよいもの（UI presentation only）

```text
Accessibility / Typography / Spacing / Focus
Form semantics（ラベル関連付け等の提示） / Error presentation（提示）
Heading structure / Interaction principles（操作の分かりやすさ）
法人アプリ Style Guide に明示された presentation tokens / primitives
```

意味の変更が必要な場合は **別 Decision** に分離する（本 Adoption では許可しない）。

## 4. Adopt / Adapt / Application Specific（LOCKED）

### 4.1 Adopt（原則として取り込む）

| Area | Intent |
|---|---|
| Accessibility | キーボード、フォーカス、名前、コントラスト、色だけに依存しない状態表現 |
| Typography | 読みやすさ・階層の基礎 |
| Spacing | 余白の一貫性の基礎 |
| Focus | focus-visible 等の操作可能性 |
| Form semantics | ラベル・説明・エラー関連付けの提示原則 |
| Error presentation | エラーの伝わり方（業務エラー語彙の意味は Contracts 側） |
| Heading structure | 見出し階層 |
| Interaction principles | 操作可能性・状態の分かりやすさ |

### 4.2 Adapt（サービス固有に寄せてよい）

| Area | Intent |
|---|---|
| Navigation | App Shell / primary nav は法人アプリ IA に合わせる |
| Cards | 使う場合のみ；既存 DEMO-UX の「カード過剰」方針と衝突させない |
| Tables / lists | 利用者一覧等の密度・操作はアプリ IA 優先 |
| Status presentation | 業務状態ラベルはアプリ定義（色だけ禁止は Adopt） |
| Forms | 記録入力等は業務フロー優先で DADS フォーム原則へ寄せる |
| Notifications | DemoBanner / 部分取得警告等は安全境界を崩さない |

### 4.3 Application Specific（法人アプリ固有・DADS に無い／足りない）

最低限、後続 Style Guide（DADS-03）で定義する候補:

```text
未記録
確認待ち
期限接近
通常（業務上の平常表示）
支援計画
見直し状態
保存成功 / 保存中 / 保存失敗 / 保存結果不明（SHELL-UX vocabulary は既存正本）
入力エラー（提示）
操作不可 / 実保存なし（DEMO mutation boundary）
```

これらは **業務 Semantic（Domain/Contracts）と Presentation（Style Guide）を分離**して定義する。

## 5. Relationship to current DEMO-UX / #299

```text
DEMO-UX を完成させてから DADS で作り直す = NOT SELECTED
現在の DEMO-UX をベースラインとして保存し、DADS-01〜03 を挟み、基準に沿って後続 DEMO-UX を続ける = SELECTED
```

- DEMO-UX 開発の **全面停止は不要**
- 新しい画面を大量追加するより、**DADS-01〜03（docs）を短期間で固定**することを優先推奨
- 既存 browser smoke / fail-closed 不変条件は **捨てない**（DADS-VERIFY / Phase 7）

本 Decision は #299 Close・Deploy・SharePoint write を認可しない。

## 6. Program roadmap（LOCKED dependency；後続は別 GO）

| ID | Title | Kind | Depends on |
|---|---|---|---|
| **DADS-01** | Adoption Decision（本文書） | docs-only | — |
| DADS-02 | Existing UI Inventory（PASS/ADAPT/GAP/N/A） | read-only / docs-only | DADS-01 |
| DADS-03 | Application Style Guide | docs-only | DADS-02 |
| DADS-04 | Design Tokens（中間層） | implementation | DADS-03 |
| DADS-05 | Shared UI Primitives | implementation | DADS-04（+ DADS-06 連携） |
| DADS-06 | Accessibility Gate（test/CI） | test / CI | DADS-03 |
| DADS-UX-\* | Existing screen migration（1 Issue = 1 UI slice） | implementation | DADS-05 |
| DADS-VERIFY | Final consistency review | read-only | DADS-UX-\* |

依存グラフ:

```text
DADS-01
   ↓
DADS-02
   ↓
DADS-03
   ├─────────┐
   ↓         ↓
DADS-04    DADS-06
   ↓         │
DADS-05 ←────┘
   ↓
DADS-UX-1 … DADS-UX-n
   ↓
DADS-VERIFY
```

推奨 screen 順（DADS-UX-\*；全面リファクタ PR 禁止）:

```text
1 App Shell
2 Overview
3 利用者一覧
4 利用者詳細
5 記録入力
6 見直し状況
7 エラー / 空状態 / 通知
```

Primitive 原則（DADS-05）:

```text
KEEP / ADAPT / FIX / CONSOLIDATE
既存で問題なし → 置換しない
```

Inventory 判定（DADS-02）:

| 判定 | 意味 |
|---|---|
| PASS | 現状維持 |
| ADAPT | DADS に寄せる価値あり |
| GAP | アクセシビリティ等の不足 |
| N/A | DADS 適用対象外 |

**「DADS と違う = 修正」にしない**（LOCKED）。

## 7. Non-negotiable engineering rules（forward-looking；本 PR では未実装）

1. React に DADS 値を直接ハードコードしない → **法人アプリ Design Tokens 中間層**（DADS-04）
2. DADS UI 変更前後で既存 browser smoke の **業務不変条件**を維持する
3. DADS 対応のために既存テストを変更して PASS させることは **原則禁止**
4. 仕様変更が必要なら **別 Decision** に分離する
5. 見た目統一（余白・角丸等）は a11y / 構造の後（Phase 9）

## 8. Exact OUT（this Decision / this PR）

```text
React / CSS / SCSS / SPFx component mutation = OUT
Design token code = OUT（DADS-04）
Primitive rewrite = OUT（DADS-05）
Screen migration = OUT（DADS-UX-*）
Inventory execution = OUT（DADS-02 separate GO）
Style Guide body authoring = OUT（DADS-03 separate GO）
actual save / SharePoint write / live I/O = OUT
Domain / Contracts / schema / permission mutation = OUT
Deploy / #299 Close / Ready-as-code-merge-of-behavior = OUT
DADS 全面置換 / Figma 一括導入必須化 = OUT
```

## 9. Acceptance for DADS-01（docs-only）

本ユニットの完了条件:

1. Reference / Position / Authority Boundary が文書化されている
2. Adopt / Adapt / Application Specific が分離されている
3. 4 層モデルと「DADS ≠ Domain 上位正本」が明示されている
4. 後続 Issue 依存（DADS-02…VERIFY）が固定されている
5. **コード差分 0**（docs のみ）
6. Deploy / SharePoint / #299 Close / DADS-02+ が非認可のまま

## 10. Gate separation

```text
DADS-01 LOCKED ≠ DADS-02 Inventory Start
DADS-01 LOCKED ≠ DADS-03 Style Guide authoring Start
DADS-01 LOCKED ≠ DADS-04 Token Implementation Start
DADS-01 LOCKED ≠ any DEMO-UX Ready/Merge auto-advance
DADS-01 LOCKED ≠ Deploy / SharePoint write / #299 Close
```

次の Human gate（推奨）: **DADS-02 Existing UI Inventory Start GO**（read-only / docs-only）。

## 11. Evidence / inputs

```text
Human plan（2026-08-13）:
  既存開発を壊さず DADS を取り込む = 全面移行ではなく収束
  制度・業務と UI 表現の分離
  Phase 1 = DADS-01 docs-only / behavior mutation 0
DADS style-guide guidance:
  https://design.digital.go.jp/dads/guidance/style-guides/
Existing business-meaning examples（must remain UNCHANGED by UI redesign）:
  docs/architecture/decision-dec-008-submit-return-roles-*.md（制度上の作成者等）
  DEMO-UX / SHELL-UX save-state vocabulary and fail-closed boundaries
Current DEMO-UX baseline on main includes DEMO-UX-14（PR #330）
```
