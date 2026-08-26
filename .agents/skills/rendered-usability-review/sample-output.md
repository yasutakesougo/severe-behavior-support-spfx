# rendered-usability-review sample

## Summary
- 判定: HOLD
- 対象PR: FIELD_STAFF Today presentation-only
- head SHA: abcdef1
- role / viewport: FIELD_STAFF / 768px tablet

## Rendered Evidence
| ID | kind | viewport | role | surface | ref |
|---|---|---|---|---|---|
| E-001 | smoke doc | 768px | FIELD_STAFF | Today | docs/architecture/shell-ux-1-browser-smoke.md（例） |

## Usability Assessment
- hierarchy: primary CTA は証跡上視認可能
- density: LOW / touch-first と矛盾する詰まりは未観測
- readability: ラベル可読。数値 contrast は未測定
- visual states: empty / error の別 state 証跡は不足
- spacing / alignment: control / content 分離は保持

## Findings
| ID | 重大度 | 状態 | 内容 | evidence ref | 対応 |
|---|---|---|---|---|---|
| — | — | — | visual P0/P1 なし（error state 証跡不足のため HOLD） |  |  |

## Handoff
- design-review: なし（Contract 疑いなし）
- adaptive-layout-review: なし（layout break 疑いなし）

## HOLD
- error / disabled state の width-labeled screenshot 不足

## Next Actions
1. error state screenshot を追加して再実行
2. `design-review` へ Contract 観点を渡す
