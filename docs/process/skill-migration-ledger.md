# Skill Migration Ledger

- 文書: `docs/process/skill-migration-ledger.md`
- 位置づけ: 旧 `skills/` パスの移行・廃止・参照専用区分の正本
- 実装単位: AI-ORG-IMPL-3
- 基準 main（着手時）: `9f58477feecf14cbace191c3d1a227f9adcde03a`
- Skill 実行正本: `.agents/skills/`（旧 `skills/` は実行正本にしない）
- 関連カタログ: `docs/process/skill-catalog.md`

## 方針

- 旧 `skills/` 配下の全エントリについて、次のいずれか 1 区分を記録する。
  - `.agents/skills/` へ移行済み
  - 廃止
  - 参照専用
  - 対象なし
- 本 ledger は区分記録のみ行う。Skill 本文の移動・改名・削除は行わない。
- 旧パスを Workflow / Agent / Logical Command の実行先として指定しない。
- 新規に旧 `skills/` パスへの有効な実行参照を追加しない。

## 棚卸し結果

調査時点で旧 `skills/` に存在するエントリは **2 件** である。

| 旧パス | 対応する正式 Skill 名（予定） | 移行判断 | 根拠 | 備考 |
|---|---|---|---|---|
| `skills/requirements-review/` | `requirements-review` | **参照専用** | `.agents/skills/` 未移行。カタログ上は後続 | 実行時は後続導入まで `HOLD`。旧パスを実行しない |
| `skills/design-review/` | （カタログ未掲載。設計レビュー系後続と別判断） | **参照専用** | `.agents/skills/` 未移行。正式名未確定 | 実行正本にしない。後続 Skill 導入時に再区分してよい |

## 対象なし / 新規作成禁止

- 上記 2 件以外の旧 `skills/` エントリは **対象 0 件** とする。
- 旧 `skills/` 配下への **新規 Skill 作成は禁止** する。追加は `.agents/skills/` のみ（別承認・別実装単位）。

## 有効な実行参照

| 確認項目 | 結果 |
|---|---|
| Agent / Command / Catalog から旧 `skills/` を実行先とする参照 | **0 件** |
| 計画・ADR 等での旧パスへの言及（履歴・区分説明） | 許容（実行指示ではない） |

本単位では旧パスの削除を行わない。削除は別承認が必要である。

## 再区分ルール

次のいずれかが発生した場合、本 ledger を同一 Issue または後続 Issue で更新する。

- `.agents/skills/` へ移行した場合 → 移行済み
- 内容を採用せず破棄する場合 → 廃止
- 参照専用のまま残す場合 → 参照専用を維持
- エントリが存在しなくなった場合 → 対象なしへ更新し、新規作成禁止を再確認

## 関連正本

| 主題 | 正本 |
|---|---|
| Skill カタログ | `docs/process/skill-catalog.md` |
| Workflow | `docs/process/ai-workflow.md` |
| Agents | `.agents/agents/` |
| Commands | `.agents/commands/` |
| 配置 ADR | `docs/decisions/ADR-AI-ORG-001.md` |
