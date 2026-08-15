# VISUAL-POLISH — Agent Instruction Amendment（DADS React Storybook Reference）

```text
Unit: VISUAL-POLISH — Agent Instruction amendment
Kind: docs-only / agent-instruction amendment
Status: Fresh Review PASS / ACCEPT（PR #371）
  → READY FOR HUMAN READY → MERGE
Date: 2026-08-15
Baseline main: fa76c11759e3b5ab79c8923bfbad00fe6e306010
Reviewed HEAD: 247d5b03b82defc036d5b67733d7d49c04f1cd9f
Fresh Review: docs/architecture/visual-polish-agent-instruction-dads-react-reference-fresh-review.md
Application mutation: 0
External mutation: 0
Deploy: NO-GO
Human Ready / Merge: NOT AUTHORIZED by this document alone
```

## 1. Purpose

Visual Polish のエージェント指示へ、次の **1 項目**を追加固定する。

```text
DADS React Storybook を Visual / Interaction / Accessibility Reference として照合する
```

これは DADS-UX / Visual Polish の設計をひっくり返すものではない。  
これまで抽象的だった「DADS 準拠」を、公式 Storybook の具体的な画面状態と照合できる状態にする前進である。

```text
本 Amendment ≠ Tailwind 導入
本 Amendment ≠ React 18 / Fluent UI v9 移行
本 Amendment ≠ DADS React コンポーネント全面移植
本 Amendment ≠ RC / Release Readiness / Deploy の再オープン
本 Amendment ≠ VP-2+ Implementation Start
```

## 2. Authority layers（Visual Polish 実装参照）

Visual Polish 作業では、次の 3 層で参照を分離する。

| 層 | 役割 | 正本 / 参照 |
|---|---|---|
| DADS ガイドライン | 規範（見た目・操作・a11y の設計思想） | https://design.digital.go.jp/dads/ |
| DADS React Storybook | 実装参考（状態・HTML 構造・interaction / a11y の具体例） | https://design.digital.go.jp/dads/react/ |
| Fluent UI v8 + SCSS（SPFx） | SPFx 上の実装基盤 | 既存 `spfx/` / DADS-04 tokens / DADS-05 primitives |

```text
DADS React = 依存ライブラリにしない
DADS React Storybook = Visual / Interaction / Accessibility Reference
実装 = SPFx 1.23.2 / React 17 / Fluent UI v8 + SCSS で再現
```

既存 Authority Boundary（`decision-dads-adoption-v1.md`）は変更しない。

```text
制度・業務ルール → Domain / Contracts → 法人アプリ UI Style Guide
DADS は Style Guide の基礎・参考（Domain より上位にしない）
```

## 3. Agent Instruction — 追加項目（必須）

Visual Polish のエージェント指示（チャット起動文 / 後続 slice 指示）に、次を **必須チェック項目**として含める。

```text
DADS React Storybook を visual reference として照合する
  URL: https://design.digital.go.jp/dads/react/
  対象例: Button / Text field / Text area / Notification / Table / Accordion 等
  状態例: default / hover / focus / disabled / readonly（該当時）
  照合観点: 見た目・状態差分・HTML 構造の意図・アクセシビリティ上の注意
  反映先: 既存 SPFx コンポーネント（React 17 + Fluent UI v8 + SCSS）
  禁止: DADS React / Tailwind / React 18 依存の持ち込み
```

Agent Start / slice 実施時の読み順:

1. 法人アプリ UI Style Guide / DADS-04 / DADS-05 / 当該 VP slice 正本
2. **DADS React Storybook（本項目）** — 具体状態の比較対象
3. 既存 SPFx 実装へ additive / ADAPT で反映

## 4. Why this separation

公式 React サンプルは React 18 + Tailwind CSS 3 + TypeScript の参照実装であり、完成済みライブラリ配布ではない。  
現行アプリは React 17 + Fluent UI v8 のため、DADS React を直接コピーすると依存が食い違う。

したがって:

```text
そのまま導入しない
設計・見た目・アクセシビリティ仕様を正本として参照する
SPFx 側で再現する
```

DADS React コードスニペットは MIT License（編集・加工利用が前提）。  
加工 UI の出典明記は公式注意上必須ではないが、本リポジトリでは参照 URL を docs / PR に残して追跡可能にする。

## 5. Explicit OUT

```text
@digital-go-jp/* を package dependency として追加すること
Tailwind CSS / tailwind-theme-plugin の導入
React 18 化 / Fluent UI v9 化
DADS React コンポーネントの全面移植・コピー貼り付け依存
VA-1 / VA-2 closeout の書き換え
RELEASE-READINESS / Deploy GO の再判定要求（本 docs 単独）
SharePoint / App Catalog / M365 / Entra mutation
業務意味・status vocabulary・save 5-state・navigation semantics の変更
```

## 6. Relation to open VP work

| Work | Relation |
|---|---|
| VISUAL-POLISH-1 Foundations Assessment（PR #367） | UNCHANGED；本 Amendment は Foundations 実装を再定義しない |
| VISUAL-POLISH-1 Foundations tokens（PR #368） | UNCHANGED；token 層は引き続き DADS-04 additive |
| VP-2 Overview / VP-3 Users / VP-4 Workflow | 後続 slice の Agent Instruction に §3 項目を含める |
| RC `8173a4c…` / Release Readiness | 分離維持；本 Amendment ≠ 新 RC / Deploy |

## 7. Non-claims

```text
This Amendment ≠ Implementation Start for any VP slice
This Amendment ≠ Visual Acceptance for a new RC
This Amendment ≠ Deploy GO
This Amendment ≠ authorization to add DADS React / Tailwind / React 18
This Amendment ≠ rewrite of Decision-DADS-ADOPTION-V1
```

## 8. Acceptance（docs-only）

1. §3 の必須チェック項目が文書化されている  
2. 3 層モデル（Guideline / Storybook / Fluent v8+SCSS）が明示されている  
3. DADS React を依存にしないこと、および技術基盤維持が明示されている  
4. RC / Release / Deploy と分離していること  
5. Application code mutation = 0  

## 9. Next

```text
1. Fresh Review = PASS（see companion fresh-review doc）
2. Human Ready → Human Merge of #371 only（docs amendment）
3. #371 MERGE ≠ #367 / #368 MERGE ≠ VP-2 Start ≠ 新 RC ≠ Visual Acceptance ≠ Deploy GO
4. Preferred later order: #367 Assessment → #368 Foundations → VP-2+
5. 後続 Visual Polish slice の起動文に §3 項目を含める（#371 Merge 後）
```
