# design-review sample

## Summary
- 判定: PASS
- 対象PR: Support Plan presentation-only
- head SHA: abcdef1

## UI Diff
- surfaces: SupportPlan
- primitives: 既存 `StatusBadge` label channel KEEP。新 primitive なし

## Contract Fit
- vocabulary: 「要確認」text channel 維持。未記録と非混同
- save states: 対象外（本 slice は presentation-only）
- empty vs fail-closed: EmptyNotice 未使用。fail-closed panel KEEP
- procedure binding: Current vs historical 非変更

## Evidence
- a11y gate: PASS（既存 A11Y-HD-07 / A11Y-SP-01）
- smoke: PASS（DEMO-UX SupportPlan hooks）
- semantic tests: PASS（既存 presentation fixtures）
- lint:ui-sem: PASS

## Findings
| ID | 重大度 | 状態 | 内容 | 根拠 | 対応 |
|---|---|---|---|---|---|
| — | — | — | なし |  |  |

## HOLD
- なし

## Approvals
- 必要な承認: なし
- 承認状態: N/A

## Next Actions
1. `merge-audit` へ証跡を渡す
2. Catalog v1 の SupportPlan KEEP 規則を `merge-audit` へ渡す
