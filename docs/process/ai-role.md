# AI Role

- 文書: `docs/process/ai-role.md`
- 位置づけ: AI開発組織構成の Role（プロジェクト使命）入口
- 配置根拠: `docs/decisions/ADR-AI-ORG-001.md`（承認済み）
- 実装単位: AI-ORG-IMPL-1

## Project

Severe Behavior Support SPFx（`severe-behavior-support-spfx`）

## Mission

同一法人・同一 Microsoft 365 テナント向けに、強度行動障害支援アプリを構築する。

## Users

- 管理者
- サービス管理責任者
- 支援員

## Target

- SharePoint Online
- SPFx
- Microsoft 365

## Scope

本プロジェクトの AI 開発組織が扱う工程範囲:

- 要件整理
- 設計
- 実装
- テスト
- レビュー
- 監査

## Out of Scope

次は Role の対象外とする。着手には別途の明示承認または別プロセスが必要である。

- 本番 SharePoint 変更
- Microsoft 365 設定変更
- Entra ID 変更
- 本番データ変更・物理削除
- 未承認仕様の確定
- 現行キオスクの変更

## 論理構成

DEC-AI-ORG-1 により、次の論理分離を採用する。

- Role（本文書）
- Governance（`docs/process/ai-governance.md`）
- Skills（`.agents/skills/`）
- Agents（将来。未作成）
- Commands（将来。未作成）
- Workflows（`docs/process/ai-workflow.md`）
- MCP（権限原則は `docs/decisions/DEC-AI-ORG-003.md`。実体未作成）

## 再利用方針

DEC-AI-ORG-2 により、本論理モデルは法人内の他アプリでも再利用可能な論理モデルとして設計する。

他アプリへの適用・複製・移植・共通化は、本文書では承認しない。

## 関連正本

| 種類 | パス |
|---|---|
| リポジトリ概要 | `README.md` |
| 実装計画 | `docs/process/ai-org-onboarding-implementation-plan.md` |
| 採用 DEC | `docs/decisions/DEC-AI-ORG-001.md` |
| 再利用範囲 DEC | `docs/decisions/DEC-AI-ORG-002.md` |
| 配置 ADR | `docs/decisions/ADR-AI-ORG-001.md` |
| 権限境界 DEC | `docs/decisions/DEC-AI-ORG-003.md` |
