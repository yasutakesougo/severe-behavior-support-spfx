# rendered-usability-review

## 目的

browser / screenshot evidence を根拠に、実画面の usability / visual quality を read-only で評価する。

Product UI Contract 適合、Domain 意味、a11y gate / smoke / lint:ui-sem は `design-review` が担当する。本 Skill は **rendered 結果が実際に使いやすいか** のみを見る。

外部 `Superfuture/design-review` とは別 Skill である。実行正本は `.agents/skills/rendered-usability-review/` のみ。

Authority:
- `docs/architecture/ui-rendered-review-v1-exact-slice-definition-1.md`
- Human GO: UI-RENDERED-REVIEW-V1 Implementation Start GO

## 使用する場面

- UI / presentation 差分があり、screenshot または browser smoke 証跡がある PR レビュー
- design-review が visual / rendered 証跡不足で `HOLD` とした UI PR の follow-up
- Visual Polish / DADS-UX / FIELD_STAFF tablet / PLANNER desktop の rendered 品質確認

## 入力

- 対象 PR / head SHA / UI 差分要約
- rendered evidence（screenshot / browser capture / smoke 証跡 doc への参照）
- 任意: `design-context` 出力
- 任意: 対象 role（FIELD_STAFF / PLANNER / ADMIN）
- External Intelligence（GUIDANCE_ONLY）: KI-UI-001, KI-UI-005（Allowed list のみ）。layout / runtime a11y は handoff

## 前提条件

- head SHA が固定できる
- UI / presentation 差分がある
- visual finding に必要な rendered evidence が添付または参照可能

## 実行手順

1. UI 差分の有無を判定する。なければ `NOT APPLICABLE`
2. rendered evidence の有無を判定する。visual finding に必要な証跡がなければ `HOLD`
3. 対象 role / viewport（FIELD_STAFF tablet、PLANNER desktop 等）を evidence から特定する
4. hierarchy / density / readability / visual state / spacing を rendered evidence 上で評価する
5. component state（empty / error / disabled / loading）が視覚的に区別できるか確認する
6. visual preference と evidence-backed defect を分離する
7. responsive layout 設計疑いは adaptive-layout handoff note とし、V1 では P0/P1 に昇格しない（clip/overlap visible 時を除く）
8. runtime a11y 疑いは design-review + KI-UI-004 へ handoff する
9. Contract / semantics / a11y 意味の疑いがあれば design-review へ handoff し、本 Skill では確定しない
10. Findings を P0 / P1 / P2 で整理し判定する。本 Skill PASS は design-review PASS を置換しない

## 確認項目

- primary action が rendered 上で視認・到達可能か
- 情報 hierarchy が scan 可能か（証跡上）
- error / empty / disabled state が視覚的に区別できるか
- FIELD_STAFF tablet / PLANNER desktop の代表 evidence が揃っているか（slice による）
- screenshot なしの visual finding を出していないか
- 外部 Skill の `--apply` や source mutation を提案していないか
- SBS / DADS token を外部 px 値で上書き提案していないか

## 停止条件

- head SHA 不明
- UI 差分があるのに rendered evidence がなく、visual finding の推測補完を求められている
- Domain 意味変更を本 Skill だけで確定するよう求められている
- 外部 `design-review` Skill をローカル実行正本として使うよう求められている
- Product UI Contract 変更を本 Skill 出力だけで確定するよう求められている

## 判定基準

- `PASS`: rendered evidence 上、未解決 P0 / P1 がない
- `READY`: 本 Skill では原則使用しない
- `HOLD`: rendered 証跡不足、role / viewport 不明、measured evidence 不足
- `FAIL`: P0 / P1 の rendered usability 破壊。P2 は後続可
- `NOT APPLICABLE`: UI / presentation 差分がない

## 成果物

- rendered evidence 一覧（path / viewport / role / surface）
- usability / visual quality 評価要約
- Findings（P0 / P1 / P2）— 各 finding に evidence ref 必須
- design-review / adaptive-layout-review への handoff 項目
- 次アクション

## 禁止事項

- merge、push、deploy を自動実行手順に含めること
- SharePoint変更、Microsoft 365変更、Entra ID変更を承認不要または自動実行として扱うこと
- 本番データ変更や物理削除を許可または手順化すること
- 未確認事項を推測で確定すること
- `HOLD` を `PASS` / `READY` と同義に扱うこと
- `design-review` を本 Skill で置換すること
- 外部 Skill の `--apply`、install、runtime execution を手順化すること
- Product UI Contract / Domain semantics を変更すること
- rendered evidence なしの visual finding を出すこと

## 出力形式

```md
# rendered-usability-review

## Summary
- 判定: PASS / HOLD / FAIL / NOT APPLICABLE
- 対象PR:
- head SHA:
- role / viewport:

## Rendered Evidence
| ID | kind | viewport | role | surface | ref |
|---|---|---|---|---|---|
| E-001 | screenshot | 768px | FIELD_STAFF | Today | path or smoke doc |

## Usability Assessment
- hierarchy:
- density:
- readability:
- visual states:
- spacing / alignment:

## Findings
| ID | 重大度 | 状態 | 内容 | evidence ref | 対応 |
|---|---|---|---|---|---|
| F-001 | P1 | OPEN |  | E-001 |  |

## Handoff
- design-review:
- adaptive-layout-review:

## HOLD
- なし / または列挙

## Next Actions
1.
2.
```
