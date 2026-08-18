# design-context sample

## Summary
- 判定: READY
- 対象 slice: Support Plan presentation-only convergence
- 対象リポジトリ: yasutakesougo/severe-behavior-support-spfx

## Domain Semantics
- 正本: `docs/architecture/contracts-v1.md` / SupportPlan Decision
- 語彙: reviewStatus「要確認」は既存 text channel。未記録と混同しない
- 非丸め: mutation fail-closed、save 5-state 非対象（本 slice は presentation-only）

## Visual Intent
- 正本: `docs/architecture/dads-application-style-guide-v1.md` / DADS-UX-6
- Figma: 未使用

## Component Mapping
- 既存で表現可能: `StatusBadge`（label channel）、既存 SupportPlan IA KEEP
- GAP: なし（Catalog v1 の StatusBadge / SupportPlan IA KEEP）
- 禁止 substitution: color-only status、EmptyNotice を failure panel に流用

## Screen Template
- primary: PlanDocument
- compose: DestinationDetail（UserDetail から手オフ）
- GAP: なし

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
1. `implementation-plan` へ presentation-only 境界を渡す
2. Catalog v1 の StatusBadge / EmptyNotice 規則と PlanDocument template を `implementation-plan` へ渡す
