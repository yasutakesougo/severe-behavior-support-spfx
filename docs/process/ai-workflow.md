# AI Workflow

- 文書: `docs/process/ai-workflow.md`
- 位置づけ: AI開発組織構成の Workflow（実行順）入口
- 配置根拠: `docs/decisions/ADR-AI-ORG-001.md`（承認済み）
- 実装単位: AI-ORG-IMPL-1（入口作成） / AI-ORG-IMPL-2（Agents / Commands 整合） / AI-ORG-IMPL-3（Skill 対応表整合） / AI-ORG-IMPL-4（MCP 権限参照整合）
- 工程詳細の正本: `docs/process/development-process.md`

## 実行可能な順序（正本）

実行可能な Skill / 工程の順序正本は、次のみとする。

- `docs/process/development-process.md`

本文書は入口であり、独自の実行順を定義しない。順序が衝突する場合は `development-process.md` を優先する。

標準の実行順（正本からの引用）:

```text
/project-audit
  ↓
/requirements-review
  ↓
/decision-review
  ↓
/domain-design
  ↓
/sharepoint-design
  ↓
/schema-design
  ↓
/architecture-review
  ↓
/implementation-plan
  ↓
/implementation-review
  ↓
実装
  ↓
/contracts-review
  ↓
/test-review
  ↓
/merge-audit
  ↓
人による merge 承認
  ↓
/release-review
  ↓
/handoff-builder
```

Human Approval と Merge は人の事前承認が必須である。Review PASS なしの Merge は禁止する。

## 概念レイヤー対応表（非正本）

次の図は Role / Governance 理解用の概念レイヤー対応であり、**実行順序の正本ではない**。

```text
Requirements / DEC
  ↔ requirements-review, decision-review 等
Architecture / ADR
  ↔ domain-design, sharepoint-design, schema-design, architecture-review 等
Implementation Plan / Issue / Implementation
  ↔ implementation-plan, implementation-review, 実装
Review / Contracts / Security / Audit
  ↔ contracts-review, test-review, merge-audit 等
  （Security は独立工程ではなく、品質・監査確認の概念要素）
Human Approval / Merge / Release
  ↔ 人による merge 承認, release-review, handoff-builder
```

実行時は、上記対応表ではなく「実行可能な順序（正本）」に従う。

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

## Logical Command

正本は Logical Command。ツール別スラッシュコマンドは Adapter とする。

定義実体: `.agents/commands/`

| Logical Command | 正本 | 起動 Agent | 起動内容 |
|---|---|---|---|
| `new-feature` | `.agents/commands/new-feature.md` | Requirements | 要件整理開始（そこまでで停止） |
| `review-pr` | `.agents/commands/review-pr.md` | Review（→ Audit） | PR レビュー開始 |
| `audit` | `.agents/commands/audit.md` | Audit | 監査開始 |
| `release-check` | `.agents/commands/release-check.md` | Audit | リリース判定 |

Adapter 対応表: `.agents/commands/adapter-matrix.md`

Adapter 未整備時の Fallback は、対応 Skill の直接実行とする。Skill 未導入なら `HOLD`。

Logical Command は文書上の正本定義に限定する。GitHub 投稿、Ready 化、マージ、deploy 等を自動実行する実装は含めない。

## Agents

定義実体: `.agents/agents/`

| Agent | 正本 | 担当 | 現行で使える Skill |
|---|---|---|---|
| Requirements | `.agents/agents/requirements.md` | 要件整理・DEC・Requirement ID | 後続 Skill（未導入時は HOLD） |
| Architecture | `.agents/agents/architecture.md` | Domain / DTO / Schema / SharePoint | 後続 Skill（未導入時は HOLD） |
| Implementation | `.agents/agents/implementation.md` | 実装計画・Issue・PR・承認後実装 | `implementation-plan` |
| Review | `.agents/agents/review.md` | 着手判定・コード / Contracts / テスト確認 | `implementation-review`、後続 review 系 |
| Audit | `.agents/agents/audit.md` | マージ監査・引き継ぎ・リリース判定 | `merge-audit`、`handoff-builder`（`release-review` は後続） |

`handoff-builder` の所属 Agent は **Audit** とする。

## 停止条件

次のいずれかに該当する場合、次工程へ進まない。

- 必要な DEC / ADR が未承認
- 実装開始承認がない（ローカル変更が必要な工程）
- Review PASS が対象 head SHA と一致しない
- unresolved P0 / P1 が残っている
- 承認証跡の対象・範囲・版が現操作と一致しない
- SharePoint / Entra ID / Microsoft 365 / 本番変更が工程に含まれている
- 呼び出し Skill が未導入で当該工程の完了を求められている

## 関連正本

| 主題 | 正本 |
|---|---|
| Role | `docs/process/ai-role.md` |
| Governance | `docs/process/ai-governance.md` |
| Skill 実行順詳細 | `docs/process/development-process.md` |
| Gate | `docs/process/gate-definitions.md` |
| Skill カタログ | `docs/process/skill-catalog.md` |
| 旧 `skills/` 区分 | `docs/process/skill-migration-ledger.md` |
| Agents | `.agents/agents/` |
| Logical Commands | `.agents/commands/` |
| Adapter 対応 | `.agents/commands/adapter-matrix.md` |
| 権限境界（上位） | `docs/decisions/DEC-AI-ORG-003.md` |
| MCP 権限実行参照 | `.agents/mcp/permission-matrix.md` |
| 配置 | `docs/decisions/ADR-AI-ORG-001.md` |
