# implementation-plan

## Summary
- 判定: HOLD
- 実装目的: 強度行動障害支援アプリの現行開発プロセスを、Role / Governance / Skills / Agents / Commands / Workflows / MCP に分離した「AI社員オンボーディング基盤」としてリポジトリへ導入する
- 対象リポジトリ: severe-behavior-support-spfx

## Scope
- 対象範囲:
  - AI開発組織構成（role / governance / skills / agents / commands / workflows / mcp）の正本定義
  - 既存 `docs/process/`・`.agents/skills/`・`docs/decisions/`・`docs/development/quality-gates.md` との対応表
  - 既存最小実用セット（implementation-plan / implementation-review / merge-audit / handoff-builder）の位置づけ維持
  - Agent 定義、Command 定義、Workflow 定義の文書追加
  - MCP 接続対象の棚卸し文書（読取専用の対象一覧）
  - Skill カタログと検証スクリプトの追随更新
- 対象外:
  - SPFx UI 実装
  - SharePoint / Microsoft 365 / Entra ID の実変更
  - 本番データ変更・物理削除
  - MCP の本番接続実装・認証設定変更
  - 未承認仕様の確定
  - 提案にある全 Skill の一括新規実装（段階導入）
  - Codex / Cursor / Claude Code など特定ツール専用プラグインの必須化

## Preconditions
- 前提条件:
  - 工程正本: `docs/process/development-process.md`
  - Gate 正本: `docs/process/gate-definitions.md`
  - Skill カタログ: `docs/process/skill-catalog.md`
  - 品質ゲート: `docs/development/quality-gates.md`
  - 共通判定: `.agents/skills/_shared/judgement-rules.md`
  - 出力形式: `.agents/skills/_shared/output-format.md`
  - 初回導入済み Skill: `.agents/skills/{implementation-plan,implementation-review,merge-audit,handoff-builder}/`
  - 決定記録置き場: `docs/decisions/`
  - 本構成を採用する DEC が未作成（下記 HOLD）
  - 物理配置（ディレクトリ正本）が未決定（下記 HOLD）

## Change Targets
- 変更対象（DEC 確定後）:
  - `docs/process/`（role / workflow / org 正本、skill-catalog 更新）
  - `docs/decisions/`（AI org 採用 DEC / 配置 ADR）
  - `docs/development/quality-gates.md`（Governance との参照関係）
  - `.agents/`（agents / commands / mcp 棚卸し、必要なら skills 分類）
  - `scripts/verify-skills.mjs`（新配置・必須ファイル検証）
  - `package.json`（検証 script の維持）
- 変更しないもの:
  - `src/` 配下の domain / contracts / application / infrastructure / webparts
  - SharePoint 実体
  - GitHub Actions の権限拡大（読取以外を暗黙追加しない）

## Issue Breakdown
1. DEC: AI開発組織構成の採用可否と再利用範囲を記録する
2. ADR: Role / Governance / Skills / Agents / Commands / Workflows / MCP の物理配置を決定する
3. `role.md` を追加し、Mission / Users / Target / Scope / Out of Scope を固定する
4. Governance 入口を整理する（開発原則・DEC優先・Contracts First・Evidence First・Fail Closed・Read Only 変更禁止・Review PASS なし Merge 禁止）。既存 `development-process.md` / `quality-gates.md` / `gate-definitions.md` への参照を正本化し、重複定義を作らない
5. Agents 定義を追加する（Requirements / Architecture / Implementation / Review / Audit）。各 Agent の担当と呼び出し Skill を明示する。現行の `handoff-builder` の所属 Agent も決める
6. Commands 定義を追加する（`/new-feature` / `/review-pr` / `/audit` / `/release-check`）。各 Command がどの Workflow と Agent を起動するかを固定する
7. Workflow 正本を追加する。現行 `development-process.md` の Skill 実行順と提案フロー（Requirements → DEC → Architecture → ADR → Implementation Plan → Issue → Implementation → Review → Contracts → Security → Audit → Human Approval → Merge → Release）を突合し、単一の実行順に統合する
8. Skills 対応表を更新する。提案 Skill と現行カタログ（初回導入 / 第2段階）の差分を記録し、導入順を再固定する。`skills/` 配下の旧 Skill と `.agents/skills/` の関係も明示する
9. MCP 棚卸し文書を追加する（GitHub / Microsoft 365 / Notion の「読取対象」と「禁止操作」）。接続実装は別 Issue
10. `verify:skills` を新構成の必須ファイル検証へ拡張する

## PR Breakdown
1. DEC + ADR（採用判断と物理配置のみ）。アプリコード・Skill 本文変更なし
2. role.md + Governance 入口整理 + Workflow 正本統合（文書のみ）
3. Agents + Commands 定義追加（文書のみ）。既存 4 Skill の参照を壊さない
4. Skill カタログ差分更新 + 旧 `skills/` と `.agents/skills/` の位置づけ明確化
5. MCP 棚卸し（読取対象・禁止操作の文書）。認証・接続設定は含めない
6. `scripts/verify-skills.mjs` 追随（必須ファイル・禁止操作検査の更新）

## Implementation Order
1. Issue 1: 採用 DEC
2. Issue 2: 配置 ADR
3. Issue 3–4: role + Governance 入口（既存正本へのポインタ）
4. Issue 7: Workflow 統合（実行順の単一正本化）
5. Issue 5–6: Agents / Commands
6. Issue 8: Skills 対応表と導入順
7. Issue 9: MCP 棚卸し文書
8. Issue 10: 検証スクリプト更新
9. 以降: カタログ「後続」Skill を Team 単位で追加（Requirements → Architecture → Quality → Audit）。新規 Skill は空ディレクトリ先行禁止。`SKILL.md` 本文と sample-output を同時に追加する

## Test Plan
- typecheck: `npm run typecheck`（文書中心 PR では変更なし確認）
- unit test: `npm test`（回帰なし確認）
- integration test: `npm run verify:skills`（必須見出し、判定語、禁止操作、カタログリンク）
- scenario:
  1. 匿名化した既存実装 Issue で `/implementation-plan` → `/implementation-review` → `/merge-audit` → `/handoff-builder` が新 Workflow 上でも同じ順序で到達できる
  2. Requirements Agent 定義から `requirements-review` 等の未導入 Skill を辿ると、状態が「後続 / HOLD」と明示される
  3. `/new-feature` Command 定義が「要件整理開始」までで止まり、SharePoint 変更手順を含まない
  4. MCP 棚卸しが読取対象のみを列挙し、変更操作を禁止事項として持つ
  5. Review PASS なし Merge 禁止が Governance / Workflow / Audit Agent の三箇所で矛盾なく参照できる

## Risks
- P0:
  - MCP や Command 手順に SharePoint / Microsoft 365 / Entra ID / 本番変更が混入し、Fail Closed が崩れる
  - Governance を二重定義して、既存 Gate（PASS/READY/HOLD/FAIL）と矛盾する
- P1:
  - `.agents/skills/` と提案 `03-skills/{team}/` の二重正本化
  - 提案 Skill 名と現行カタログ名の不一致（例: `merge-audit` ↔ `ledger-audit`、`handoff-builder` 欠落）により実行順が曖昧になる
  - `CLAUDE.md` などツール固有名が「ツール非依存」方針と衝突する
  - `skills/`（旧）と `.agents/skills/`（現行正本）の併存がオンボーディングを混乱させる
- P2:
  - Team 配下への Skill 再配置に伴うパス変更コスト
  - Command / Agent 文言の粒度差

## HOLD
- HOLD-1: 本構成を正式採用する DEC が未作成。人の承認前にディレクトリ新設や既存正本の移動を開始しない
- HOLD-2: 物理配置未決。候補を固定するまで Change Targets の最終パスを確定しない
  - 候補 A: `.agents/` 配下に agents / commands / mcp を追加し、role / workflow は `docs/process/` に置く（現行正本との整合が取りやすい）
  - 候補 B: `docs/ai-org/` に論理構成を文書化し、実行実体は現行 `.agents/skills/` を維持する
  - 候補 C: 提案どおり `01-role` … `07-mcp` の番号付きツリーを新設する（既存パスとの移行方針が必須）
- HOLD-3: 提案 Skill 一式と現行カタログの名称マッピングが未承認（特に `merge-audit` / `handoff-builder` / `release-review` と提案の audit 系）
- HOLD-4: MCP（Microsoft 365 / Notion）の接続範囲・認証・読取権限の承認がない。棚卸し文書までは可、接続実装は不可
- HOLD-5: Governance ファイル名（例: `CLAUDE.md`）をツール非依存名にするかが未決

## Done Criteria
- 完了条件:
  - 採用 DEC と配置 ADR が `docs/decisions/` に記録されている
  - `role.md` の Mission / Scope / Out of Scope が正本として参照できる
  - Governance が既存 process / gate / quality 文書への単一入口になっている（二重正本がない）
  - Workflow 実行順が 1 つに固定され、現行最小実用セット 4 Skill の位置が明示されている
  - 5 Agent と 4 Command の担当・呼び出し先が文書化されている
  - Skill 対応表で「導入済み / 後続 / 改名候補 / 対象外」が区別されている
  - MCP 棚卸しが読取対象と禁止操作を列挙している
  - `npm run verify:skills` が新必須ファイルを検証して成功する
  - 対象外（本番変更、未承認仕様、全 Skill 一括実装、特定ツール依存）が文書上残っている

## Appendix A: 現行資産との対応

| 提案レイヤ | 現行資産 | 差分 |
|---|---|---|
| role.md | `README.md` の目的・工程 | Mission / Users / Out of Scope の独立正本がない |
| Governance / 原則 | `docs/process/development-process.md` | DEC優先・Contracts First 等の短い入口がない |
| QUALITY.md | `docs/development/quality-gates.md` + `docs/process/gate-definitions.md` | 名称統合が未決。内容は既存を正本維持すべき |
| DEC / ADR | `docs/decisions/` | 配置は既存を維持推奨 |
| Skills | `.agents/skills/`（正本）+ `skills/`（旧） | Team 分類なし。旧ディレクトリ併存 |
| Agents | なし | 新規 |
| Commands | なし | 新規 |
| Workflows | `development-process.md` の Skill 実行順 | 提案フローとの突合・単一化が必要 |
| MCP | なし | 新規（接続は HOLD） |

## Appendix B: Skill 差分（提案 ↔ 現行）

| 提案 Skill | 現行カタログ | 状態案 |
|---|---|---|
| requirements-review | 後続（旧 `skills/requirements-review` あり） | 後続導入。旧パスからの移行方針が必要 |
| requirements-gap | なし | 後続。requirements-review との責務分割を DEC で確認 |
| requirements-trace | なし | 後続 |
| domain-design / schema-design / sharepoint-design | 後続 | 後続 |
| adr-builder | なし | 後続 |
| implementation-plan | 初回導入済み | 維持 |
| issue-builder / pr-builder / test-plan | なし（implementation-plan に内包） | 分割要否を DEC。当面は implementation-plan 内包で可 |
| review / contracts-review / security-review / ui-review | contracts-review は後続、他はなし | 後続。implementation-review との名称衝突に注意 |
| ledger-audit / dependency-audit / approval-audit / final-audit | merge-audit 初回導入、release-review 後続 | 改名ではなく、現行名を正とし提案名を alias にするか DEC |
| （提案欠落）handoff-builder | 初回導入済み | Workflow / Agent に必須追加 |

## Appendix C: 推奨する初期導入（DEC 後）

空ディレクトリの先行固定は行わない（`README.md` 方針）。

1. 文書: role / governance 入口 / workflow / agents / commands / mcp 棚卸し
2. 実行実体: 既存 `.agents/skills` 4 Skill を維持
3. 拡張: カタログ「後続」を Team 単位で 1 Skill ずつ追加
4. 検証: `verify:skills` で構造破綻を検知
