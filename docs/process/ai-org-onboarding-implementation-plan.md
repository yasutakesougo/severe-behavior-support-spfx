# implementation-plan

## Summary
- 判定: HOLD
- 実装目的: 強度行動障害支援アプリの現行開発プロセスを、Role / Governance / Skills / Agents / Commands / Workflows / MCP に分離した「AI社員オンボーディング基盤」としてリポジトリへ導入する
- 対象リポジトリ: severe-behavior-support-spfx
- 本 PR の位置づけ: 実装開始の承認ではない。HOLD 付き実装計画の正本として、採用前に決める判断単位と導入手順を固定する

## Scope
- 対象範囲:
  - AI開発組織構成（role / governance / skills / agents / commands / workflows / mcp）の正本定義
  - 既存 `docs/process/`・`.agents/skills/`・`docs/decisions/`・`docs/development/quality-gates.md` との対応表
  - 既存最小実用セット（implementation-plan / implementation-review / merge-audit / handoff-builder）の位置づけ維持
  - Agent 定義、Logical Command 定義、Workflow 定義の文書追加
  - ツール別 Adapter（Codex / Claude Code / Cursor 等）の対応表。正本は Logical Command
  - MCP 操作単位の権限マトリクス（AI単独 / 人の事前承認 / 禁止）
  - 旧 `skills/` の移行・廃止・参照専用方針と検証
  - Skill カタログと検証スクリプトの追随更新
- 対象外:
  - SPFx UI 実装
  - SharePoint / Microsoft 365 / Entra ID の実変更
  - 本番データ変更・物理削除
  - MCP の本番接続実装・認証設定変更（権限マトリクス文書化までは対象）
  - 未承認仕様の確定
  - 提案にある全 Skill の一括新規実装（段階導入）
  - 特定ツール専用プラグインの必須化（Adapter は任意）
  - 番号付き `01-role` … `07-mcp` ツリーの新設（候補 C は不採用）

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
  - 次の判断単位が未作成（下記 HOLD）。採用・再利用・権限・配置を一つの DEC に混ぜない

## Decision Units

判断は次の 4 単位に分離する。1 つの DEC にまとめない。

| ID | 種類 | 決める内容 | 決めない内容 |
|---|---|---|---|
| DEC-AI-ORG-1 | DEC | AI開発組織構成（Role / Governance / Skills / Agents / Commands / Workflows / MCP の論理分離）を採用するか | 物理パス、再利用範囲、操作権限の詳細 |
| DEC-AI-ORG-2 | DEC | 本リポジトリ専用か、法人内他アプリでも再利用する共通基盤か | 配置パス、個別 Adapter 実装 |
| ADR-AI-ORG-1 | ADR | ファイルとディレクトリの物理配置 | 採用可否そのもの |
| DEC-AI-ORG-3 | DEC | AI に許可する操作と人の承認境界（MCP 権限マトリクスの原則） | 各 MCP サーバの認証設定そのもの |

### 推奨配置（ADR-AI-ORG-1 の基準案: 候補 A）

候補 A を基準案とする。候補 B は文書集約の代替、候補 C（番号付きツリー新設）は既存正本との二重化リスクが高いため不採用とする。

```text
docs/process/
├─ ai-role.md
├─ ai-governance.md
└─ ai-workflow.md
.agents/
├─ skills/
├─ agents/
├─ commands/
└─ mcp/
docs/decisions/
├─ DEC-AI-ORG-001.md   # DEC-AI-ORG-1
├─ DEC-AI-ORG-002.md   # DEC-AI-ORG-2
├─ DEC-AI-ORG-003.md   # DEC-AI-ORG-3
└─ ADR-AI-ORG-001.md   # ADR-AI-ORG-1
```

- `docs/process/ai-*.md` は人間が読む正本入口
- `.agents/skills|agents|commands|mcp` は AI 実行実体
- DEC / ADR は既存 `docs/decisions/` に置く
- 空ディレクトリの先行固定は行わない。各 Issue で必要ファイルと同時に追加する

## Change Targets
- 変更対象（上記 Decision Units 確定後）:
  - `docs/process/ai-role.md` / `ai-governance.md` / `ai-workflow.md`
  - `docs/process/skill-catalog.md`（対応表・旧 `skills/` 方針）
  - `docs/decisions/DEC-AI-ORG-00{1,2,3}.md` / `ADR-AI-ORG-001.md`
  - `docs/development/quality-gates.md`（Governance 入口への参照関係）
  - `.agents/agents/`（Agent 定義）
  - `.agents/commands/`（Logical Command 正本。ツール Adapter は別ファイルまたは別節）
  - `.agents/mcp/`（操作単位の権限マトリクス）
  - `scripts/verify-skills.mjs`（必須ファイル、旧 `skills/` 新規参照検知）
  - `package.json`（検証 script の維持）
- 変更しないもの:
  - `src/` 配下の domain / contracts / application / infrastructure / webparts
  - SharePoint 実体
  - GitHub Actions の権限を、DEC-AI-ORG-3 承認なしに拡大しない

## Issue Breakdown
1. DEC-AI-ORG-1: AI開発組織構成の採用可否のみを記録する
2. DEC-AI-ORG-2: 本リポジトリ専用か法人内再利用かを記録する
3. ADR-AI-ORG-1: 候補 A を基準に物理配置を記録する（不採用理由に候補 C を含める）
4. DEC-AI-ORG-3: AI 許可操作と人の承認境界、MCP 権限マトリクス原則を記録する
5. `docs/process/ai-role.md` を追加し、Mission / Users / Target / Scope / Out of Scope を固定する
6. `docs/process/ai-governance.md` を追加する（開発原則・DEC優先・Contracts First・Evidence First・Fail Closed・承認境界・Review PASS なし Merge 禁止）。既存 `development-process.md` / `quality-gates.md` / `gate-definitions.md` への参照を正本化し、重複定義を作らない。ファイル名はツール非依存（`CLAUDE.md` は使わない）
7. `.agents/agents/` に Agents 定義を追加する（Requirements / Architecture / Implementation / Review / Audit）。各 Agent の担当と呼び出し Skill を明示する。`handoff-builder` の所属 Agent も決める
8. Logical Command 正本を追加する（`new-feature` / `review-pr` / `audit` / `release-check`）。各 Logical Command が起動する Workflow と Agent を固定する。ツール別 `/review-pr` 等は Adapter として分離し、Fallback は Skill 直接実行とする
9. `docs/process/ai-workflow.md` を追加する。現行 Skill 実行順と提案フローを突合し、単一の実行順に統合する
10. Skills 対応表を更新する。提案 Skill と現行カタログの差分、改名候補、`handoff-builder` 必須追加を記録する
11. 旧 `skills/` の全エントリについて、移行先 / 廃止 / 参照専用のいずれかを記録する。有効参照 0 件化と `verify:skills` の旧パス検知を同一 Issue または連続 Issue で完了条件にする
12. `.agents/mcp/` に操作単位の権限マトリクスを追加する（接続実装は別 Issue）
13. `verify:skills` を新必須ファイル検証と旧 `skills/` 新規参照検知へ拡張する

## PR Breakdown
1. Decision Units のみ（DEC-AI-ORG-1/2/3 + ADR-AI-ORG-1）。アプリコード・Skill 本文変更なし
2. `ai-role.md` + `ai-governance.md` + `ai-workflow.md`（文書のみ）
3. Agents + Logical Commands + Adapter 対応表（文書のみ）。既存 4 Skill の参照を壊さない
4. Skill カタログ差分 + 旧 `skills/` 移行記録
5. MCP 権限マトリクス（操作単位）。認証・接続設定は含めない
6. `scripts/verify-skills.mjs` 追随（必須ファイル、禁止操作、旧パス新規参照検知）

## Implementation Order
1. Issue 1: DEC-AI-ORG-1（採用）
2. Issue 2: DEC-AI-ORG-2（再利用範囲）
3. Issue 3: ADR-AI-ORG-1（配置。基準案 A）
4. Issue 4: DEC-AI-ORG-3（権限境界）
5. Issue 5–6: role + governance 入口
6. Issue 9: workflow 統合
7. Issue 7–8: agents + logical commands / adapters
8. Issue 10–11: skills 対応表 + 旧 `skills/` 移行記録
9. Issue 12: MCP 権限マトリクス
10. Issue 13: 検証スクリプト更新
11. 以降: カタログ「後続」Skill を Team 単位で追加。空ディレクトリ先行禁止。`SKILL.md` と sample-output を同時追加

## Commands Model

正本は Logical Command。スラッシュ付き文字列はツール Adapter とする。

```text
Logical Command: review-pr
  ↓
Codex adapter:      /review-pr
Claude Code adapter:/review-pr
Cursor adapter:     対応する Rule または Command
Fallback:           Skill を直接実行
```

| Logical Command | 起動内容 | Adapter 例 | Fallback |
|---|---|---|---|
| `new-feature` | 要件整理開始（Workflow 入口） | `/new-feature` | requirements 系 Skill を直接実行 |
| `review-pr` | PR レビュー開始 | `/review-pr` | review / merge-audit 系 Skill を直接実行 |
| `audit` | 監査開始 | `/audit` | merge-audit 等を直接実行 |
| `release-check` | リリース判定 | `/release-check` | release-review / handoff-builder を直接実行 |

Adapter が未整備でも Logical Command と Skill Fallback で工程を進められる状態を維持する。

## MCP Permission Matrix

MCP は「読取専用で一括」しない。操作単位で次の 3 区分に分ける。

| 区分 | 意味 |
|---|---|
| AI単独 | AI が証跡付きで実施してよい |
| 人の事前承認 | 下書き・提案までは可。投稿・反映・実行前に人の明示承認が必要 |
| 禁止 | AI も人も、この基盤の手順としては実施しない（別の承認プロセスが必要） |

初期マトリクス（DEC-AI-ORG-3 で確定する草案）:

| 操作 | AI単独 | 人の事前承認 | 禁止 |
|---|---|---|---|
| GitHub 参照（Issue / PR / Actions / 差分） | 可 | 不要 | — |
| Issue 案作成（ローカル出力） | 可 | 不要 | — |
| Issue 投稿 | — | 必須 | — |
| PR 案作成（ローカル出力） | 可 | 不要 | — |
| PR 作成・更新投稿 | — | 必須 | — |
| PR レビューコメント案 | 可 | 不要 | — |
| PR レビュー投稿 | — | 必須 | — |
| ラベル更新 | — | 必須 | — |
| PR マージ | — | 必須 | — |
| deploy | — | 必須 | — |
| SharePoint 本番変更 | — | — | 禁止 |
| Entra ID 変更 | — | — | 禁止 |
| Microsoft 365 権限・テナント設定変更 | — | — | 禁止 |
| 本番データ変更・物理削除 | — | — | 禁止 |
| Notion 要件 / ADR / Meeting 参照 | 可（承認後接続時） | 不要 | — |
| Notion 本番ページの無断更新 | — | — | 禁止 |

「案作成（AI単独）」と「投稿・反映（人の事前承認）」を混同しない。Fail Closed: マトリクス未記載の操作は禁止扱いとする。

## Test Plan
- typecheck: `npm run typecheck`（文書中心 PR では変更なし確認）
- unit test: `npm test`（回帰なし確認）
- integration test: `npm run verify:skills`（必須見出し、判定語、権限境界、カタログリンク、旧 `skills/` 新規参照検知）
- scenario:
  1. Decision Units が 4 文書に分離され、1 DEC に採用・再利用・権限・配置が混在していない
  2. 匿名化 Issue で `implementation-plan` → `implementation-review` → `merge-audit` → `handoff-builder` が新 Workflow 上でも同順で到達できる
  3. Requirements Agent から未導入 Skill を辿ると「後続 / HOLD」と明示される
  4. Logical Command `new-feature` が要件整理開始までで止まり、SharePoint 変更手順を含まない
  5. Adapter 未整備時でも Skill Fallback 経路が文書上存在する
  6. MCP マトリクスが操作単位で AI単独 / 人の事前承認 / 禁止を区別し、GitHub 投稿系が「人の事前承認」、SharePoint / Entra / M365 変更が「禁止」である
  7. Review PASS なし Merge 禁止が Governance / Workflow / Audit Agent で矛盾なく参照できる
  8. 旧 `skills/` の各エントリに移行先 / 廃止 / 参照専用が記録され、既存文書からの有効参照が 0 件、`verify:skills` が旧パス新規参照で失敗する

## Risks
- P0:
  - MCP や Command 手順に SharePoint / Microsoft 365 / Entra ID / 本番変更が混入し、Fail Closed が崩れる
  - Governance を二重定義して、既存 Gate（PASS/READY/HOLD/FAIL）と矛盾する
  - 「案作成」と「投稿・マージ」を AI単独に誤分類する
- P1:
  - Decision Units を再び 1 DEC に混在させる
  - Logical Command とツール Adapter を同一正本に混ぜ、特定ツール依存になる
  - `.agents/skills/` と番号付きツリー等の二重正本化
  - 提案 Skill 名と現行カタログ名の不一致（`merge-audit` ↔ `ledger-audit`、`handoff-builder` 欠落）
  - 旧 `skills/` 併存のままオンボーディングが進む
- P2:
  - Adapter 実装の優先順位差
  - Team 配下への Skill 再配置コスト

## HOLD
- HOLD-1: DEC-AI-ORG-1（採用）未作成。人の承認前にディレクトリ新設や既存正本の移動を開始しない
- HOLD-2: DEC-AI-ORG-2（再利用範囲）未作成
- HOLD-3: ADR-AI-ORG-1（物理配置）未確定。基準案は候補 A。候補 C は不採用方針
- HOLD-4: DEC-AI-ORG-3（権限境界）未作成。MCP 接続実装はマトリクス承認後
- HOLD-5: 提案 Skill 一式と現行カタログの名称マッピング未承認
- HOLD-6: 旧 `skills/` の移行先 / 廃止 / 参照専用が未記録
- HOLD-7: Governance 入口ファイル名は `ai-governance.md`（ツール非依存）を基準とするが、DEC/ADR 承認までは既存正本を移動しない

## Done Criteria
- 完了条件:
  - DEC-AI-ORG-1 / DEC-AI-ORG-2 / DEC-AI-ORG-3 / ADR-AI-ORG-1 が `docs/decisions/` に分離記録されている
  - `docs/process/ai-role.md` の Mission / Scope / Out of Scope が正本として参照できる
  - `docs/process/ai-governance.md` が既存 process / gate / quality 文書への単一入口になっている（二重正本がない）
  - `docs/process/ai-workflow.md` で実行順が 1 つに固定され、現行最小実用セット 4 Skill の位置が明示されている
  - 5 Agent が文書化され、Logical Command 4 種の担当・呼び出し先・Adapter・Fallback が文書化されている
  - Skill 対応表で「導入済み / 後続 / 改名候補 / 対象外」が区別されている
  - MCP 権限マトリクスが操作単位で AI単独 / 人の事前承認 / 禁止を列挙している
  - 旧 `skills/` の全 Skill について、移行先 / 廃止 / 参照専用のいずれかが記録されている
  - 既存文書から旧 `skills/` への有効な参照が 0 件である
  - `verify:skills` が旧 `skills/` パスの新規参照を検出して失敗する
  - `npm run verify:skills` が新必須ファイルを検証して成功する
  - 対象外（本番変更、未承認仕様、全 Skill 一括実装、特定ツール必須化、候補 C）が文書上残っている

## Appendix A: 現行資産との対応

| 提案レイヤ | 現行資産 | 差分 |
|---|---|---|
| role | `README.md` の目的・工程 | `docs/process/ai-role.md` が未作成 |
| Governance | `docs/process/development-process.md` | `ai-governance.md` 入口が未作成 |
| QUALITY | `docs/development/quality-gates.md` + `docs/process/gate-definitions.md` | 内容は既存正本維持。入口から参照 |
| DEC / ADR | `docs/decisions/` | DEC-AI-ORG-* / ADR-AI-ORG-1 未作成 |
| Skills | `.agents/skills/`（正本）+ `skills/`（旧） | 旧ディレクトリの移行完了条件が必要 |
| Agents | なし | `.agents/agents/` 新規 |
| Commands | なし | Logical Command 正本 + Adapter 対応が必要 |
| Workflows | `development-process.md` の Skill 実行順 | `ai-workflow.md` で単一化 |
| MCP | なし | 操作単位マトリクスが必要。読取一括は不採用 |

## Appendix B: Skill 差分（提案 ↔ 現行）

| 提案 Skill | 現行カタログ | 状態案 |
|---|---|---|
| requirements-review | 後続（旧 `skills/requirements-review` あり） | 後続導入。旧パスは移行先 / 廃止 / 参照専用を記録 |
| requirements-gap | なし | 後続。requirements-review との責務分割を別途確認 |
| requirements-trace | なし | 後続 |
| domain-design / schema-design / sharepoint-design | 後続 | 後続 |
| adr-builder | なし | 後続 |
| implementation-plan | 初回導入済み | 維持 |
| issue-builder / pr-builder / test-plan | なし（implementation-plan に内包） | 分割要否は後続判断。当面は内包で可 |
| review / contracts-review / security-review / ui-review | contracts-review は後続、他はなし | 後続。implementation-review との名称衝突に注意 |
| ledger-audit / dependency-audit / approval-audit / final-audit | merge-audit 初回導入、release-review 後続 | 現行名を正とし、提案名は alias 候補 |
| （提案欠落）handoff-builder | 初回導入済み | Workflow / Agent に必須追加 |

## Appendix C: 推奨する初期導入（Decision Units 承認後）

空ディレクトリの先行固定は行わない（`README.md` 方針）。

1. Decision Units 4 文書
2. `ai-role` / `ai-governance` / `ai-workflow`
3. Agents / Logical Commands / Adapter 対応 / MCP マトリクス
4. 実行実体: 既存 `.agents/skills` 4 Skill を維持
5. 旧 `skills/` の移行記録と参照 0 件化
6. 拡張: カタログ「後続」を 1 Skill ずつ追加
7. 検証: `verify:skills` で構造破綻と旧パス新規参照を検知

## Appendix D: レビュー反映メモ（PR #45）

| 指摘 | 反映 |
|---|---|
| P1-1 採用 DEC が広すぎる | Decision Units を DEC-AI-ORG-1/2/3 + ADR-AI-ORG-1 に分離 |
| P1-2 Command とツール依存の混同 | Logical Command 正本 + Adapter + Skill Fallback |
| P1-3 MCP 読取一括が実運用に合わない | 操作単位の権限マトリクスへ変更 |
| P2-1 配置候補は A に絞れる | 候補 A を基準案、候補 C は不採用 |
| P2-2 旧 `skills/` 移行完了条件不足 | Done Criteria / Test Plan / Issue 11 に追加 |
