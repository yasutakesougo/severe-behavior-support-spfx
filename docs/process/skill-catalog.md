# Skill カタログ

- 文書: `docs/process/skill-catalog.md`
- 位置づけ: Skill の運用カタログ（対応表）
- Skill 実行正本: `.agents/skills/` 配下の `SKILL.md`
- 旧パス区分正本: `docs/process/skill-migration-ledger.md`
- 実装単位: AI-ORG-IMPL-3（対応表正本化）

## 目的

この文書は、`severe-behavior-support-spfx` へ導入する Skill の目的、状態、所属 Agent、起動 Command、Fallback、HOLD 条件を一覧化する。

`.agents/skills/` 配下の `SKILL.md` を実行正本とし、この文書は運用カタログとして扱う。

## 共通参照

- 判定規則: `.agents/skills/_shared/judgement-rules.md`
- 出力形式: `.agents/skills/_shared/output-format.md`
- 開発工程: `docs/process/development-process.md`
- Gate 定義: `docs/process/gate-definitions.md`
- Agents: `.agents/agents/`
- Logical Commands: `.agents/commands/`
- Adapter 対応: `.agents/commands/adapter-matrix.md`
- 旧 `skills/` 区分: `docs/process/skill-migration-ledger.md`

## 状態の定義

| 状態 | 意味 |
|---|---|
| 導入済み | `.agents/skills/<name>/SKILL.md` が存在し、実行してよい |
| 後続 | 未導入。呼び出し時は `HOLD`（推測で補完しない） |
| alias候補 | 提案名。現行正式名を正とし、改名しない |
| 廃止 | 採用しない（本カタログでは使用しない） |

## 導入済み（最小実用セット）

| 正式Skill名 | 状態 | 所属Agent | 起動Command | Fallback | 移行判断 | HOLD条件 |
|---|---|---|---|---|---|---|
| [`implementation-plan`](../../.agents/skills/implementation-plan/SKILL.md) | 導入済み | Implementation | なし（Workflow 工程） | Skill 直接実行 | 対象なし（旧パスなし） | 要件・DEC・設計・対象外が揃わない場合 |
| [`implementation-review`](../../.agents/skills/implementation-review/SKILL.md) | 導入済み | Review | `review-pr` | Skill 直接実行 | 対象なし（旧パスなし） | 計画・証跡不足、head SHA 不明 |
| [`merge-audit`](../../.agents/skills/merge-audit/SKILL.md) | 導入済み | Audit | `audit`（`review-pr` からの引き渡し可） | Skill 直接実行 | 対象なし（旧パスなし） | CI/テスト/承認証跡不足、P0/P1 残存 |
| [`handoff-builder`](../../.agents/skills/handoff-builder/SKILL.md) | 導入済み | **Audit** | `release-check` / `audit`（必要時） | Skill 直接実行 | 対象なし（旧パスなし） | SHA / Issue / PR / 検証結果が不明 |

`handoff-builder` の所属 Agent は **Audit** とする（AI-ORG-IMPL-2 維持）。

### 導入済み Skill の目的・入出力

| Skill | 目的 | 主入力 | 主出力 | 実行タイミング |
|---|---|---|---|---|
| `implementation-plan` | 設計済み内容を Issue / PR / テストへ分割する | 要件、DEC、設計、制約 | 実装目的、Issue 分割、PR 分割、テスト計画、HOLD | 実装前 |
| `implementation-review` | 着手可能かを判定する | 要件、DEC、設計、Contracts、計画 | Gate 判定、未着手条件、ブロッカー | 実装直前 |
| `merge-audit` | PR のマージ可否を監査する | PR、差分、CI、テスト結果、レビュー状態 | 監査結果、P0/P1/P2/HOLD、マージ可否 | 実装後 |
| `handoff-builder` | 現在状態を次作業者へ引き継ぐ | repo 状態、SHA、Issue、PR、検証結果 | handoff 文面、完了/未完了/HOLD | 節目ごと |

## 後続（カタログ掲載）

| 正式Skill名 | 状態 | 所属Agent | 起動Command | Fallback | 移行判断 | HOLD条件 |
|---|---|---|---|---|---|---|
| `project-audit` | 後続 | Audit（候補） | なし | 未導入のため HOLD | 対象なし | Skill 未導入 |
| `requirements-review` | 後続 | Requirements | `new-feature` | 未導入のため HOLD | 参照専用（旧 `skills/requirements-review/`） | Skill 未導入 |
| `decision-review` | 後続 | Requirements | `new-feature` | 未導入のため HOLD | 対象なし | Skill 未導入 / 未決 DEC |
| `domain-design` | 後続 | Architecture | なし | 未導入のため HOLD | 対象なし | Skill 未導入 |
| `sharepoint-design` | 後続 | Architecture | なし | 未導入のため HOLD | 対象なし | Skill 未導入。本番変更手順を含めない |
| `schema-design` | 後続 | Architecture | なし | 未導入のため HOLD | 対象なし | Skill 未導入 |
| `architecture-review` | 後続 | Architecture | なし | 未導入のため HOLD | 対象なし | Skill 未導入 / Architecture Gate 未充足 |
| `contracts-review` | 後続 | Review | `review-pr` | 未導入のため HOLD | 対象なし | Skill 未導入 |
| `test-review` | 後続 | Review | `review-pr` | 未導入のため HOLD | 対象なし | Skill 未導入 |
| `release-review` | 後続 | Audit | `release-check` | 未導入のため HOLD（`handoff-builder` は導入済み） | 対象なし | Skill 未導入 |
| `finding-review` | 後続 | Requirements（候補） | なし | 未導入のため HOLD | 対象なし | Skill 未導入 |

## Agent 未カタログ後続（Agent 定義上の候補）

Agent 文書に記載があるが、本カタログの第 2 段階表に未掲載の候補。状態はすべて **後続**。導入前は `HOLD`。

| 正式Skill名 | 状態 | 所属Agent | 起動Command | Fallback | 移行判断 | HOLD条件 |
|---|---|---|---|---|---|---|
| `requirements-gap` | 後続 | Requirements | `new-feature` | HOLD | 対象なし | 未導入。`requirements-review` との責務分割は後続判断 |
| `requirements-trace` | 後続 | Requirements | `new-feature` | HOLD | 対象なし | 未導入 |
| `adr-builder` | 後続 | Architecture | なし | HOLD | 対象なし | 未導入 |
| `issue-builder` | 後続 | Implementation | なし | 当面は `implementation-plan` に内包 | 対象なし | 分割要否は後続判断 |
| `pr-builder` | 後続 | Implementation | なし | 当面は `implementation-plan` に内包 | 対象なし | 分割要否は後続判断 |
| `test-plan` | 後続 | Implementation | なし | 当面は `implementation-plan` に内包 | 対象なし | 分割要否は後続判断 |
| `security-review` | 後続 | Review | `review-pr` | HOLD | 対象なし | 未導入 |
| `ui-review` | 後続 | Review | `review-pr` | HOLD | 対象なし | 未導入 |
| `dependency-audit` | 後続 | Audit | `audit` | HOLD | 対象なし | 未導入 |
| `approval-audit` | 後続 | Audit | `audit` | HOLD | 対象なし | 未導入 |
| `final-audit` | 後続 | Audit | `audit` | HOLD | 対象なし | 未導入 |

## alias 候補（改名しない）

| 提案名 | 現行正式名 | 状態 | 所属Agent | 備考 |
|---|---|---|---|---|
| `ledger-audit` | `merge-audit` | alias候補 | Audit | 現行名を正とする |
| `review` | （`implementation-review` 等と衝突注意） | alias候補 | Review | 単独正式名としては採用しない |

## Logical Command と Skill Fallback の対応

| Logical Command | 起動 Agent | Skill Fallback（正） |
|---|---|---|
| `new-feature` | Requirements | `requirements-review` / `decision-review` 等。未導入なら HOLD |
| `review-pr` | Review（→ Audit） | `implementation-review`。実装後は後続 review 系（未導入なら HOLD）。必要時 `merge-audit` |
| `audit` | Audit | `merge-audit`（必要時 `handoff-builder`） |
| `release-check` | Audit | `release-review`（未導入なら HOLD）+ `handoff-builder` |

詳細: `.agents/commands/adapter-matrix.md`

## Agents と導入済み Skill の一意対応

| Agent | 導入済み Skill |
|---|---|
| Requirements | （なし。後続のみ → HOLD） |
| Architecture | （なし。後続のみ → HOLD） |
| Implementation | `implementation-plan` |
| Review | `implementation-review` |
| Audit | `merge-audit`, `handoff-builder` |

同一導入済み Skill を複数 Agent の主所属にしない。`handoff-builder` は Audit のみ。

## 旧 `skills/` 

区分の正本は `docs/process/skill-migration-ledger.md` とする。

| 旧パス | 移行判断 |
|---|---|
| `skills/requirements-review/` | 参照専用 |
| `skills/design-review/` | 参照専用 |
| 上記以外 | 対象 0 件。新規作成禁止 |

旧パスは実行正本ではない。

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
- 移行 ledger: `docs/process/skill-migration-ledger.md`

`verify:skills`（AI-ORG-IMPL-5）は少なくとも次を構造検査する。

- 5 Agents / 4 Logical Commands / Adapter Matrix（実体集合と期待集合の**完全一致**）
- 導入済み 4 Skills / Skill Catalog / Skill Migration Ledger（directory・カタログ「導入済み」も**完全一致**）
- MCP Permission Matrix
- 必須ファイル欠落、旧 `skills/` への新規実行参照、存在しない Skill の「導入済み」扱い
- 許可集合外の extra Agent / Logical Command / 導入済み Skill
- `handoff-builder` の Audit 所属、正本参照切れ
- credential / secret 実値混入、未承認 merge / deploy を許可する構造

## 運用ルール

- Skill はコードを直接変更するものとして定義しない
- 出力は GitHub Issue、PR、設計文書、監査記録へ転記できる形式にする
- 未確認事項を推測で補完しない
- 証跡不足は `PASS` ではなく `HOLD`
- 未導入 Skill を導入済みと扱わない
- merge、deploy、本番変更は人の明示承認を必須とする
- 旧 `skills/` への新規実行参照を追加しない
