# design-review

## 目的

UI 変更が Product UI Contract に沿っているかを監査します。

主眼は Component Catalog / Screen Templates / Visual Hierarchy / semantic UI 規則 / a11y 意味チャネルです。Domain / SharePoint / ADR の Architecture Gate は `architecture-review` が担当します。

旧パスの同名 Skill とは別です。旧パスは実行正本にしません。実行正本は `.agents/skills/design-review/` のみです。

## 使用する場面

- UI / presentation / primitives / tokens を含む PR レビュー
- `review-pr` で UI 意味チャネルを確認するとき
- Visual Polish / DADS-UX / Support Plan UI の差分監査

## 入力

- 対象 PR / head SHA / 差分
- `design-context` 出力（あれば）
- Domain / Contracts 語彙
- DADS-03 Style Guide / DADS-04 tokens / DADS-05 primitives
- Component Catalog v1（`docs/architecture/ui-component-catalog-v1.md`）。該当 entry が無ければ GAP / HOLD
- Screen Templates v1（`docs/architecture/ui-screen-templates-v1.md`）。該当 template が無ければ GAP / HOLD
- Visual Hierarchy Contract v1（`docs/architecture/ui-visual-hierarchy-contract-1.md`）
- a11y gate / semantic tests / browser smoke 結果

## 前提条件

- 対象 head SHA が固定できる
- UI 差分の有無を判定できる
- 非 UI PR なら `NOT APPLICABLE` を出せる

## 実行手順

1. UI / presentation 差分の有無を判定する。なければ `NOT APPLICABLE`
2. `architecture-review` と重複する Domain / SharePoint 判定をしない（参照のみ）
3. status vocabulary が label / text channel で表現されているか確認する
4. empty / failure / all-clear / fail-closed パネルの混同がないか確認する
5. save 5-state 語彙外の発明がないか確認する
6. CurrentProcedure と historical procedure の表示混同がないか確認する
7. 既存 Catalog / Templates / primitives の forbidden substitution がないか確認する
8. Visual Hierarchy: EMPHASIS と `SBS_ACTION` の混同、1 view 複数 primary CTA、非操作 KPI の新規 card 化がないか確認する
9. a11y 意味チャネル（label、live region）、smoke hook、`lint:ui-sem`（UI-SEM-01..05）の退行を確認する
10. Findings を P0 / P1 / P2 で整理し判定する

## 確認項目

- color-only status になっていないか
- `EmptyNotice` を failure / access_denied に流用していないか
- `save_failed` と `save_outcome_unknown` を同一表示に丸めていないか
- 現場職員と計画担当者の入口を navigation だけで暗黙にしていないか
- 新 hex / ad-hoc rem を DADS-04 抜きで増やしていないか（`npm run lint:ui-sem`）
- Storybook / Figma をレビュー正本にしていないか
- Catalog 未掲載・Template 未掲載を FAIL 理由にしていないか（GAP は P2 または HOLD）
- EMPHASIS と `SBS_ACTION.primary` を混ぜていないか。1 view に primary CTA が複数ないか

## 停止条件

- head SHA 不明
- UI 差分があるのに visual / a11y 証跡が不明で推測補完を求められている
- Domain 意味変更を本 Skill だけで確定するよう求められている
- 旧パスの同名 Skill を実行正本として使うよう求められている

## 判定基準

- `PASS`: Product UI Contract 整合と検証証跡が揃い、未解決 P0 / P1 がない
- `READY`: この Skill では原則使用しない
- `HOLD`: Catalog / Template / 証跡不足、承認待ち、意味 Decision 未決
- `FAIL`: P0 / P1 の意味破壊または a11y 意味チャネル破壊。P2 は後続可
- `NOT APPLICABLE`: UI / presentation 差分がない

## 成果物

- UI 差分要約
- Catalog / Templates / Visual Hierarchy / primitives 適合判定
- semantic / a11y / smoke / lint:ui-sem / verify:ui-templates 証跡
- Findings（P0 / P1 / P2）
- 次アクション

## 禁止事項

- merge、push、deploy を自動実行手順に含めること
- SharePoint変更、Microsoft 365変更、Entra ID変更を承認不要または自動実行として扱うこと
- 本番データ変更や物理削除を許可または手順化すること
- 未確認事項を推測で確定すること
- `HOLD` を `PASS` / `READY` と同義に扱うこと
- `architecture-review` を本 Skill で置換すること
- 旧パスの同名 Skill を実行すること
- Domain 意味を UI レビューで変更すること

## 出力形式

```md
# design-review

## Summary
- 判定: PASS / HOLD / FAIL / NOT APPLICABLE
- 対象PR:
- head SHA:

## UI Diff
- surfaces:
- primitives:
- template:

## Contract Fit
- vocabulary:
- save states:
- empty vs fail-closed:
- procedure binding:
- EMPHASIS / SBS_ACTION:
- card / density:

## Evidence
- a11y gate:
- smoke:
- semantic tests:
- lint:ui-sem:
- verify:ui-templates:

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
