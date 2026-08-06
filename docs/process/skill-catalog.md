# Skill カタログ

## 目的

この文書は、`severe-behavior-support-spfx`へ導入する Skill の目的、入力、出力、実行タイミング、導入順序を一覧化します。

`.agents/skills/` 配下の `SKILL.md` を正本とし、この文書は運用カタログとして扱います。

## 共通参照

- 判定規則: `.agents/skills/_shared/judgement-rules.md`
- 出力形式: `.agents/skills/_shared/output-format.md`
- 開発工程: `docs/process/development-process.md`
- Gate 定義: `docs/process/gate-definitions.md`

## 初回導入対象

| Skill | 目的 | 主入力 | 主出力 | 実行タイミング | 状態 |
|---|---|---|---|---|---|
| [`implementation-plan`](../../.agents/skills/implementation-plan/SKILL.md) | 設計済み内容を Issue / PR / テストへ分割する | 要件、DEC、設計、制約 | 実装目的、Issue 分割、PR 分割、テスト計画、HOLD 条件 | 実装前 | 初回導入 |
| [`implementation-review`](../../.agents/skills/implementation-review/SKILL.md) | 着手可能かを判定する | 要件、DEC、設計、Contracts、計画 | Gate 判定、未着手条件、ブロッカー | 実装直前 | 初回導入 |
| [`merge-audit`](../../.agents/skills/merge-audit/SKILL.md) | PR のマージ可否を監査する | PR、差分、CI、テスト結果、レビュー状態 | 監査結果、P0/P1/P2/HOLD、マージ可否 | 実装後 | 初回導入 |
| [`handoff-builder`](../../.agents/skills/handoff-builder/SKILL.md) | 現在状態を次作業者へ引き継ぐ | repo 状態、SHA、Issue、PR、検証結果 | handoff 文面、完了/未完了/HOLD | 節目ごと | 初回導入 |

## 第 2 段階以降の対象

| Skill | 目的 | 実行タイミング | 状態 |
|---|---|---|---|
| `project-audit` | 既存資産、制約、未解決事項、HOLD を棚卸しする | 着手前 | 後続 |
| `requirements-review` | 要件の不足、重複、矛盾、検証可能性を確認する | 要件確定前 | 後続 |
| `decision-review` | DEC を整理し、未決定事項を特定する | 実装前 | 後続 |
| `domain-design` | 業務ルールを Domain として整理する | 設計時 | 後続 |
| `sharepoint-design` | SharePoint Lists、権限、接続を設計する | 設計時 | 後続 |
| `schema-design` | JSON Schema、DTO、列挙値、日付表現を設計する | 設計時 | 後続 |
| `architecture-review` | Domain / Contracts / SharePoint / UI / ADR の整合性を確認する | 実装前 | 後続 |
| `contracts-review` | 契約変更の互換性を監査する | 実装後 | 後続 |
| `test-review` | テスト結果と網羅範囲を確認する | 実装後 | 後続 |
| `release-review` | リリース可否を判定する | merge 後 | 後続 |
| `finding-review` | 問い合わせ、障害、改善要望を整理する | 運用時 | 後続 |

## 導入順序

1. 共通規約
2. `implementation-plan`
3. `implementation-review`
4. `merge-audit`
5. `handoff-builder`
6. `requirements-review`
7. `decision-review`
8. 設計 Skill
9. 品質確認 Skill
10. リリース・運用 Skill

## 関連ファイル

- 検証スクリプト: `scripts/verify-skills.mjs`
- 実行コマンド: `npm run verify:skills`

## 運用ルール

- Skill はコードを直接変更するものとして定義しない
- 出力は GitHub Issue、PR、設計文書、監査記録へ転記できる形式にする
- 未確認事項を推測で補完しない
- 証跡不足は `PASS` ではなく `HOLD`
- merge、deploy、本番変更は人の明示承認を必須とする
