# implementation-plan sample

## Summary
- 判定: READY
- 実装目的: 開発プロセス Skill の最小実用セットを導入する
- 対象リポジトリ: severe-behavior-support-spfx

## Scope
- 対象範囲: 共通規約、4 Skill、検証スクリプト、npm script
- 対象外: SPFx 実装、Contracts 変更、SharePoint変更、deploy

## Preconditions
- 前提条件: 共通判定基準と Gate 定義を先に確定する

## Change Targets
- 変更対象: docs/process、.agents/skills、scripts/verify-skills.mjs、package.json

## Issue Breakdown
1. 共通規約を追加する
2. 最小実用セット Skill を追加する
3. 検証スクリプトと npm script を追加する

## PR Breakdown
1. 共通規約と最小実用セットを同一 PR で追加する

## Implementation Order
1. 共通規約
2. implementation-plan
3. implementation-review
4. merge-audit
5. handoff-builder
6. verify:skills

## Test Plan
- typecheck: 実行
- unit test: 既存テストを実行
- integration test: 対象外
- scenario: 匿名化した既存 Issue で試行

## Risks
- P0: なし
- P1: 既存工程文書との不整合
- P2: 文言の改善余地

## HOLD
- 匿名化した試行 Issue の選定待ち

## Done Criteria
- 完了条件: 4 Skill と verify:skills が repo に追加されている
