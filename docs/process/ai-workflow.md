# AI Workflow

- 文書: `docs/process/ai-workflow.md`
- 位置づけ: AI開発組織構成の Workflow（実行順）入口
- 配置根拠: `docs/decisions/ADR-AI-ORG-001.md`（承認済み）
- 実装単位: AI-ORG-IMPL-1
- 工程詳細の正本: `docs/process/development-process.md`

## 標準フロー

```text
Requirements
  ↓
DEC
  ↓
Architecture
  ↓
ADR
  ↓
Implementation Plan
  ↓
Issue
  ↓
Implementation
  ↓
Review
  ↓
Contracts
  ↓
Security
  ↓
Audit
  ↓
Human Approval
  ↓
Merge
  ↓
Release
```

Human Approval と Merge は人の事前承認が必須である。Review PASS なしの Merge は禁止する。

## Skill 実行順との対応

工程詳細と Skill 名の正本は `docs/process/development-process.md` とする。

```text
Requirements / DEC
  → /project-audit（後続）
  → /requirements-review（後続）
  → /decision-review（後続）
Architecture / ADR
  → /domain-design（後続）
  → /sharepoint-design（後続）
  → /schema-design（後続）
  → /architecture-review（後続）
Implementation Plan / Issue
  → /implementation-plan（導入済み）
  → /implementation-review（導入済み）
Implementation
  → 承認済み Issue 範囲の実装
Review / Contracts / Security / Audit
  → /contracts-review（後続）
  → /test-review（後続）
  → /merge-audit（導入済み）
Human Approval → Merge
  → 人による merge 承認（同一 head の Review PASS 必須）
Release
  → /release-review（後続）
  → /handoff-builder（導入済み）
```

## 最小実用セット（現行）

導入済み Skill（`.agents/skills/`）:

1. `implementation-plan`
2. `implementation-review`
3. `merge-audit`
4. `handoff-builder`

最初の適用順（現行試行）:

```text
/implementation-plan
  ↓
/implementation-review
  ↓
実装
  ↓
/merge-audit
  ↓
人による merge 承認
  ↓
/handoff-builder
```

## Logical Command（将来）

正本は Logical Command。ツール別スラッシュコマンドは Adapter とする。実体（`.agents/commands/`）は未作成。

| Logical Command | 起動内容 |
|---|---|
| `new-feature` | 要件整理開始 |
| `review-pr` | PR レビュー開始 |
| `audit` | 監査開始 |
| `release-check` | リリース判定 |

Adapter 未整備時の Fallback は、対応 Skill の直接実行とする。

## Agents（将来）

`.agents/agents/` は未作成。担当の論理割り当てのみ示す。

| Agent | 担当の目安 | 現行で使える Skill |
|---|---|---|
| Requirements | 要件整理・DEC・Requirement ID | 後続 Skill |
| Architecture | Domain / DTO / Schema / SharePoint | 後続 Skill |
| Implementation | 実装計画・Issue・PR | `implementation-plan` |
| Review | コード / UI / Security | `implementation-review`、後続 review 系 |
| Audit | Ledger / Approval / 最終監査 | `merge-audit`、`handoff-builder` |

## 停止条件

次のいずれかに該当する場合、次工程へ進まない。

- 必要な DEC / ADR が未承認
- 実装開始承認がない（ローカル変更が必要な工程）
- Review PASS が対象 head SHA と一致しない
- unresolved P0 / P1 が残っている
- 承認証跡の対象・範囲・版が現操作と一致しない
- SharePoint / Entra ID / Microsoft 365 / 本番変更が工程に含まれている

## 関連正本

| 主題 | 正本 |
|---|---|
| Role | `docs/process/ai-role.md` |
| Governance | `docs/process/ai-governance.md` |
| Skill 実行順詳細 | `docs/process/development-process.md` |
| Gate | `docs/process/gate-definitions.md` |
| Skill カタログ | `docs/process/skill-catalog.md` |
| 権限境界 | `docs/decisions/DEC-AI-ORG-003.md` |
| 配置 | `docs/decisions/ADR-AI-ORG-001.md` |
