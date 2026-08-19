# design-context

## 目的

UI / presentation 作業の前に、repository SSOT から domain semantics と visual intent を収集し、既存 component で表現できるかを判定します。

Figma をそのままコード化しません。意味の正本は Domain / Contracts です。

## 使用する場面

- UI slice / Visual Polish / Support Plan UI / screen 追加の設計確認
- `implementation-plan` の前に Product UI Contract 前提を固定したいとき
- Figma または Visual Decision があるが、repository 意味と照合が必要なとき

## 入力

- 対象 screen / slice / Issue
- `docs/architecture/` 該当文書（DADS-03 Style Guide、DADS-UX、Visual Polish 等）
- Domain / Contracts 該当語彙
- Component Catalog v1（`docs/architecture/ui-component-catalog-v1.md`）。該当 entry が無ければ GAP / HOLD
- Screen Templates v1（`docs/architecture/ui-screen-templates-v1.md`）。該当 template が無ければ GAP / HOLD
- Visual Hierarchy Contract v1（`docs/architecture/ui-visual-hierarchy-contract-1.md`）。EMPHASIS / CTA weight / density
- 既存 components / tests / smoke / a11y gate
- （任意）Figma MCP — layout / component / variables / screen reference

## 前提条件

- 対象 slice が識別できる
- Domain / Contracts の参照先を列挙できる、または不足を HOLD にできる
- Figma MCP 未接続でも repository 正本だけで続行できる

## 実行手順

1. 対象 screen / 利用者入口（現場職員 / 計画担当者等）を固定する
2. 関係する Domain / Contracts 語彙を列挙する（status、save 5-state、procedure binding 等）
3. Visual Principles（DADS-03 / DADS-04）と Screen Templates v1 を読む。primary template を 1 つ選ぶ
4. Visual Hierarchy Contract で EMPHASIS-1 と `SBS_ACTION.primary` を各 1 つ固定する。複数 / 不明なら HOLD
5. Component Catalog v1 で表現候補を探す。未掲載なら GAP / HOLD（勝手に新 primitive を増やさない）
6. 任意で Figma から visual intent のみ取得する（コード化しない）
7. Figma intent を repository domain semantics と照合する
8. 既存 component で表現可能か、GAP / 新 primitive 要否を判定する
9. `implementation-plan` へ渡す前提と HOLD を出力する

## 確認項目

- 業務意味の正本が Domain / Contracts か
- 「要確認」と「未記録」等の語彙を混同していないか
- `save_failed` と `save_outcome_unknown` を丸めていないか
- CurrentProcedure と historical procedure を区別しているか
- 既存 primitive（`StatusBadge` / `EmptyNotice` 等）で足りるか
- 既存 Screen Template で足りるか。新 layout を推測で増やしていないか
- EMPHASIS-1 と `SBS_ACTION.primary` が各 1 つか。情報ランクと CTA ウェイトを混ぜていないか
- Figma を SSOT として扱っていないか
- Storybook を新 SSOT として扱っていないか

## 停止条件

- Domain 意味が未決で UI が推測補完を求められている
- Figma のみを正本としてコード化を求められている
- Component Catalog も Screen Templates も primitives も参照できず、新 UI を発明するしかない
- Token 同期パイプライン導入を本 Skill の完了条件にされている

## 判定基準

- `PASS`: この Skill では原則使用しない。Gate 通過は後続 Skill で扱う
- `READY`: domain semantics、visual intent、component mapping、対象外が揃い、`implementation-plan` へ渡せる
- `HOLD`: 該当 Catalog entry / Screen Template 不足、意味 Decision 不足、Figma と repository の不一致が未解消
- `FAIL`: P0 / P1 の意味破壊（語彙丸め、fail-closed 無視、権限を UI だけに置く）がある。P2 は記録のうえで後続可
- `NOT APPLICABLE`: UI / presentation 変更がない

## 成果物

- domain semantics summary（正本参照）
- visual intent summary
- component mapping（既存 / GAP）
- screen template（primary / compose / GAP）
- Figma 差分メモ（任意。Token 自動同期はしない）
- Findings（P0 / P1 / P2）
- `implementation-plan` への引き渡し条件

## 禁止事項

- merge、push、deploy を自動実行手順に含めること
- SharePoint変更、Microsoft 365変更、Entra ID変更を承認不要または自動実行として扱うこと
- 本番データ変更や物理削除を許可または手順化すること
- 未確認事項を推測で確定すること
- `HOLD` を `PASS` / `READY` と同義に扱うこと
- Figma をそのままコード化すること
- Domain / Contracts の意味を UI 都合で変更すること
- Storybook / Chromatic / Tokens Studio を新 SSOT にすること

## 出力形式

```md
# design-context

## Summary
- 判定: READY / HOLD / FAIL / NOT APPLICABLE
- 対象 slice:
- 対象リポジトリ:

## Domain Semantics
- 正本:
- 語彙:
- 非丸め:

## Visual Intent
- 正本:
- Figma: 未使用 / intent のみ / HOLD

## Component Mapping
- 既存で表現可能:
- GAP:
- 禁止 substitution:

## Screen Template
- primary:
- compose:
- GAP:

## Visual Hierarchy
- EMPHASIS-1:
- SBS_ACTION.primary:
- density:
- GAP:

## Findings
| ID | 重大度 | 状態 | 内容 | 根拠 | 対応 |
|---|---|---|---|---|---|
| F-001 | P1 | OPEN |  |  |  |

## HOLD
- なし / または列挙

## Approvals
- 必要な承認:
- 承認状態:

## Next Actions
1.
2.
```
