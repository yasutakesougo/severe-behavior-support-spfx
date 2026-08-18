# Skill カタログ

- 文書: `docs/process/skill-catalog.md`
- 位置づけ: Skill の運用カタログ（対応表）
- Skill 実行正本: `.agents/skills/` 配下の `SKILL.md`
- 旧パス区分正本: `docs/process/skill-migration-ledger.md`
- 実装単位: AI-ORG-IMPL-6（後続 Skill 導入 + Adapter / CI / handoff）

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
- Background Agent 契約: `docs/process/background-agent-contract.md`
- 旧 `skills/` 区分: `docs/process/skill-migration-ledger.md`

## 状態の定義

| 状態 | 意味 |
|---|---|
| 導入済み | `.agents/skills/<name>/SKILL.md` が存在し、実行してよい |
| 後続 | 未導入。呼び出し時は `HOLD`（推測で補完しない） |
| alias候補 | 提案名。現行正式名を正とし、改名しない |
| 廃止 | 採用しない（本カタログでは使用しない） |

## 導入済み

| 正式Skill名 | 状態 | 所属Agent | 起動Command | Fallback | 移行判断 | HOLD条件 |
|---|---|---|---|---|---|---|
| [`requirements-review`](../../.agents/skills/requirements-review/SKILL.md) | 導入済み | Requirements | `new-feature` | Skill 直接実行 | 移行済み（旧 `skills/requirements-review/` は参照専用維持可） | 対象利用者・保存先・権限・失敗時・受入が未確定 |
| [`decision-review`](../../.agents/skills/decision-review/SKILL.md) | 導入済み | Requirements | `new-feature` | Skill 直接実行 | 対象なし | 未決 DEC が設計・実装をブロック |
| [`domain-design`](../../.agents/skills/domain-design/SKILL.md) | 導入済み | Architecture | なし（Workflow 工程） | Skill 直接実行 | 対象なし | 要件不足 / SharePoint 依存混入 |
| [`sharepoint-design`](../../.agents/skills/sharepoint-design/SKILL.md) | 導入済み | Architecture | なし（Workflow 工程） | Skill 直接実行 | 対象なし | 権限・分離未定義。本番変更手順を含めない |
| [`schema-design`](../../.agents/skills/schema-design/SKILL.md) | 導入済み | Architecture | なし（Workflow 工程） | Skill 直接実行 | 対象なし | 未入力表現・互換方針が未定義 |
| [`architecture-review`](../../.agents/skills/architecture-review/SKILL.md) | 導入済み | Architecture | なし（Workflow 工程） | Skill 直接実行 | 参照専用（旧 `skills/design-review/`） | Architecture Gate 未充足 |
| [`design-context`](../../.agents/skills/design-context/SKILL.md) | 導入済み | Architecture | なし（UI slice 工程） | Skill 直接実行 | 対象なし（旧パスなし） | Domain 意味未決、Figma コード化要求、UI 対象なのに repository 正本が参照できない |
| [`design-review`](../../.agents/skills/design-review/SKILL.md) | 導入済み | Review | `review-pr`（UI 差分時） | Skill 直接実行 | 新設。旧 `skills/design-review/` とは別（旧パスは実行正本にしない） | head SHA 不明、UI 証跡不足、Domain 意味変更を本 Skill で確定するよう求められている |
| [`implementation-plan`](../../.agents/skills/implementation-plan/SKILL.md) | 導入済み | Implementation | なし（Workflow 工程） | Skill 直接実行 | 対象なし（旧パスなし） | 要件・DEC・設計・対象外が揃わない場合 |
| [`implementation-review`](../../.agents/skills/implementation-review/SKILL.md) | 導入済み | Review | `review-pr` | Skill 直接実行 | 対象なし（旧パスなし） | 計画・証跡不足、head SHA 不明 |
| [`contracts-review`](../../.agents/skills/contracts-review/SKILL.md) | 導入済み | Review | `review-pr` | Skill 直接実行 | 対象なし | 契約テスト / boundaries 証跡不足 |
| [`test-review`](../../.agents/skills/test-review/SKILL.md) | 導入済み | Review | `review-pr` | Skill 直接実行 | 対象なし | テスト結果不明、新規/既知失敗を区別不能 |
| [`severe-behavior-cycle-review`](../../.agents/skills/severe-behavior-cycle-review/SKILL.md) | 導入済み | Review | なし（直接実行。`review-pr` 時は任意） | Skill 直接実行 | 対象なし（旧パスなし） | 対象ハーネス不明、実在個人情報の新規入力が求められる、未確認を FAIL へ変換するよう求められている |
| [`merge-audit`](../../.agents/skills/merge-audit/SKILL.md) | 導入済み | Audit | `audit`（`review-pr` からの引き渡し可） | Skill 直接実行 | 対象なし（旧パスなし） | CI/テスト/承認証跡不足、P0/P1 残存 |
| [`release-review`](../../.agents/skills/release-review/SKILL.md) | 導入済み | Audit | `release-check` | Skill 直接実行 | 対象なし | SHA/artifact/承認/ロールバック不足。deploy は実行しない |
| [`handoff-builder`](../../.agents/skills/handoff-builder/SKILL.md) | 導入済み | **Audit** | `release-check` / `audit`（必要時） | Skill 直接実行 / `handoff:auto` | 対象なし（旧パスなし） | SHA / Issue / PR / 検証結果が不明 |
| [`project-status`](../../.agents/skills/project-status/SKILL.md) | 導入済み | **Audit** | なし（直接実行 / 「進めて」時） | Skill 直接実行 | 対象なし（旧パスなし） | GitHub live state / Evidence 不足、Human 判断未解決、明示 GO なし mutation |

`handoff-builder` の所属 Agent は **Audit** とする（AI-ORG-IMPL-2 維持）。

`project-status` の所属 Agent は **Audit** とする（SKILL-PILOT-1）。状態判定・Gate・ALLOWED/FORBIDDEN の観測 Skill であり、正本は GitHub / Decision / Evidence のまま。

### 導入済み Skill の目的・入出力

| Skill | 目的 | 主入力 | 主出力 | 実行タイミング |
|---|---|---|---|---|
| `requirements-review` | 要件不足・権限・検証可能性を検出 | 機能、利用者、入出力、権限、受入 | 要件判定、未確定、実装可能範囲 | 要件整理 |
| `decision-review` | DEC/ADR の不足と衝突を検出 | 要件、DEC/ADR | 未決・ブロッカー一覧 | 要件後 |
| `domain-design` | Domain 境界と業務ルールを整理 | 要件、DEC、既存 Domain | Domain 設計草稿 | 設計 |
| `sharepoint-design` | List/権限設計（実変更なし） | Domain/Contracts、権限 | 対応表草稿、対象外 | 設計 |
| `schema-design` | Schema/DTO/列挙/未入力を設計 | Domain、Contracts | Schema 設計草稿 | 設計 |
| `architecture-review` | Architecture Gate 判定材料 | 設計一式、Gate 定義 | Gate 判定、Findings | 設計後 |
| `design-context` | UI 作業前に domain semantics と visual intent を照合する | slice、Contracts、DADS、primitives、任意 Figma intent | mapping、GAP、HOLD、implementation-plan 引き渡し | UI 設計後・実装計画前 |
| `design-review` | Product UI Contract 適合を監査する | PR、UI 差分、Catalog/primitives、a11y/smoke | Gate 判定、Findings | UI 実装後（`review-pr`） |
| `implementation-plan` | Issue/PR/テストへ分割 | 要件、DEC、設計、制約 | 実装目的、分割、HOLD | 実装前 |
| `implementation-review` | 着手可能かを判定 | 要件、DEC、設計、Contracts、計画 | Gate 判定、ブロッカー | 実装直前 |
| `contracts-review` | 契約互換と境界を監査 | PR、差分、契約テスト | 互換判定、Findings | 実装後 |
| `test-review` | テスト結果と網羅を監査 | PR、テスト結果 | 失敗分類、Findings | 実装後 |
| `severe-behavior-cycle-review` | 強度行動障害支援サイクルの実操作レビュー | スモーク/ビルド、合成データ、Decision | CYCLE 要約、in-scope 点、Findings | サイクル監査時（直接実行） |
| `merge-audit` | PR のマージ可否を監査 | PR、差分、CI、レビュー状態 | 監査結果、マージ可否 | 実装後 |
| `release-review` | リリース可否判定材料 | main SHA、artifact、承認 | Release Gate 判定 | リリース前 |
| `handoff-builder` | 現在状態を次作業者へ引き継ぐ | repo 状態、SHA、Issue、PR、検証結果 | handoff 文面 | 節目ごと |
| `project-status` | 現在状態と次工程を判定する | GitHub live state、Decision、Evidence、CI | CURRENT / GATE / ALLOWED / FORBIDDEN / NEXT | 「進めて」時・着手前 |

## 後続（カタログ掲載）

| 正式Skill名 | 状態 | 所属Agent | 起動Command | Fallback | 移行判断 | HOLD条件 |
|---|---|---|---|---|---|---|
| `project-audit` | 後続 | Audit（候補） | なし | 未導入のため HOLD | 対象なし | Skill 未導入 |
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
| `ui-review` | 後続 | Review | `review-pr` | HOLD | 対象なし | 未導入。Product UI Contract 監査は導入済み `design-review`。本候補は汎用 UI 観点の分割要否が未決 |
| `design-implementation` | 後続 | Implementation（候補） | なし | HOLD | 対象なし | 未導入。当面は `implementation-plan` に内包 |
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
| `new-feature` | Requirements | `requirements-review` / `decision-review` |
| `review-pr` | Review（→ Audit） | `implementation-review` / `contracts-review` / `test-review`。UI 差分時 `design-review`。必要時 `merge-audit` |
| `audit` | Audit | `merge-audit`（必要時 `handoff-builder`） |
| `release-check` | Audit | `release-review` + `handoff-builder` |

詳細: `.agents/commands/adapter-matrix.md`

## Agents と導入済み Skill の一意対応

| Agent | 導入済み Skill |
|---|---|
| Requirements | `requirements-review`, `decision-review` |
| Architecture | `domain-design`, `sharepoint-design`, `schema-design`, `architecture-review`, `design-context` |
| Implementation | `implementation-plan` |
| Review | `implementation-review`, `contracts-review`, `test-review`, `severe-behavior-cycle-review`, `design-review` |
| Audit | `merge-audit`, `release-review`, `handoff-builder`, `project-status` |

同一導入済み Skill を複数 Agent の主所属にしない。`handoff-builder` / `project-status` は Audit のみ。

## 旧 `skills/`

区分の正本は `docs/process/skill-migration-ledger.md` とする。

| 旧パス | 移行判断 |
|---|---|
| `skills/requirements-review/` | 移行済み（実行正本は `.agents/skills/requirements-review/`。旧パスは参照専用として残置可） |
| `skills/design-review/` | 参照専用（`architecture-review` 導入時の参考。実行正本にしない。新設 `design-review` は `.agents/skills/design-review/`） |
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
8. 設計 Skill（`domain-design` / `sharepoint-design` / `schema-design` / `architecture-review`）
8a. UI 設計 Skill（`design-context`。UI slice のみ）
9. 品質確認 Skill（`contracts-review` / `test-review`）
9a. UI 品質確認 Skill（`design-review`。UI 差分時）
10. サイクル実操作レビュー（`severe-behavior-cycle-review`）
11. リリース・運用 Skill（`release-review`）
12. 状態判定 Skill（`project-status` / SKILL-PILOT-1）

## 関連ファイル

- 検証スクリプト: `scripts/verify-skills.mjs` / `scripts/verify-ui-catalog.mjs` / `scripts/ui-sem/run.mjs`
- 実行コマンド: `npm run verify:skills` / `npm run verify:ui-catalog` / `npm run lint:ui-sem`
- CI 一括: `npm run verify:ci`
- 移行 ledger: `docs/process/skill-migration-ledger.md`
- scope check: `npm run check:scope`
- auto-handoff: `npm run handoff:auto`

`verify:skills`（AI-ORG-IMPL-5/6）は少なくとも次を構造検査する。

- 5 Agents / 4 Logical Commands / Adapter Matrix / Tool Adapters（Cursor Agent / Cursor CLI / Codex）
- 導入済み Skills / Skill Catalog / Skill Migration Ledger（directory・カタログ「導入済み」も**完全一致**）
- MCP Permission Matrix
- Background Agent 実行契約
- CI（verify:skills / verify:ui-catalog / lint:ui-sem / typecheck / tests / contracts-boundaries / scope check）
- 必須ファイル欠落、旧 `skills/` への新規実行参照、存在しない Skill の「導入済み」扱い
- 許可集合外の extra Agent / Logical Command / 導入済み Skill / Tool Adapter
- `handoff-builder` の Audit 所属、正本参照切れ
- credential / secret 実値混入、未承認 merge / deploy を許可する構造

## 運用ルール

- Skill はコードを直接変更するものとして定義しない（実装 Agent の承認済み作業とは分離）
- 出力は GitHub Issue、PR、設計文書、監査記録へ転記できる形式にする
- 未確認事項を推測で補完しない
- 証跡不足は `PASS` ではなく `HOLD`
- 未導入 Skill を導入済みと扱わない
- merge、deploy、本番変更は人の明示承認を必須とする
- 旧 `skills/` への新規実行参照を追加しない
