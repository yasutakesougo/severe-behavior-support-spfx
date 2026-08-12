# AI Governance

- 文書: `docs/process/ai-governance.md`
- 位置づけ: AI開発組織構成の Governance（開発原則・品質入口）入口
- 配置根拠: `docs/decisions/ADR-AI-ORG-001.md`（承認済み）
- 実装単位: AI-ORG-IMPL-1（入口作成） / AI-ORG-IMPL-4（MCP 権限参照整合）
- 方針: 既存正本の内容を移動・複製せず、単一入口から参照する

## 開発原則

1. DEC 優先 — 未決 DEC が実装をブロックする場合は `HOLD`
2. ADR 必須 — 主要判断は `docs/decisions/` に記録する
3. Contracts First — Domain / Contracts / SharePoint の境界を崩さない
4. Evidence First — 証跡がない事項を推測で補完しない
5. Fail Closed — 権限マトリクス未記載の操作は禁止扱い（`docs/decisions/DEC-AI-ORG-003.md`）
6. Read Only 工程では変更禁止 — 読取・監査工程で変更手順を実行しない
7. レビュー PASS なし Merge 禁止 — 同一 head SHA の Review PASS と人の事前承認が必須

## 判定語と重大度

正本:

- `docs/process/development-process.md`
- `.agents/skills/_shared/judgement-rules.md`

判定語: `PASS` / `READY` / `HOLD` / `FAIL` / `NOT APPLICABLE`

重大度: `P0` / `P1` / `P2`

`HOLD` は通過ではない。`P0` が残る場合は `FAIL` とする。

## Gate

正本:

- `docs/process/gate-definitions.md`
- `docs/development/quality-gates.md`

主要 Gate:

- Architecture Gate
- Implementation Gate
- Merge Gate
- Release Gate

自己参照 stale（マージ後に残る当該 PR 自身の `Merge: NOT RUN` 等）の扱い:

- 正本: `docs/process/self-referential-gate-policy.md`
- Gate failure にしない（`EXPECTED_P2` / `NON_BLOCKING`）
- 専用 sync PR は原則禁止（`NO_DEDICATED_SYNC_PR`）

## 権限境界

上位正本: `docs/decisions/DEC-AI-ORG-003.md`

Auto-Approval Policy v1（追加分類層・緩和なし）: `docs/decisions/DEC-AA-001.md`（Accepted / LOCKED / Option A；canonical kill-switch text = `AUTO_APPROVAL_DISABLED`；運用 `AUTO_APPROVAL_ENABLED` と Implementation Start は別 GO）

AUTO-UNTIL-GATE Policy v1（追加分類層・GitHub 公開前 STOP）: `docs/decisions/DEC-AA-003.md`（Accepted / LOCKED / Option A3-1；`AUTO_UNTIL_GATE_DISABLED`；`AUTO_UNTIL_GATE_ENABLED` と Implementation Start は別 GO）

Routine AUG v1 標準運用モデル（eligible slice のみ・Human Adoption 記録）: `docs/process/routine-aug-v1.md`（Accepted / LOCKED / ADOPTED / Option R1；Routine adoption ≠ project-wide Implementation Start；per-slice Start = REQUIRED）

Process Optimization v1（risk classification / LOW auto-loop **定義採択**）: `docs/process/process-optimization-v1.md`（Accepted / LOCKED / Option POV1-A；LOW auto-loop DEFINED / NOT ENABLED；Authorization effect NONE；Merge = HUMAN-ONLY；permission expansion NONE）

LOW-AUTO-PILOT-V1（pure-domain 限定 LOW auto-loop pilot）: `docs/process/low-auto-pilot-v1.md`（LA1-A Option A = ACCEPTED；Pilot policy ACCEPTED；Pilot execution NOT STARTED；Implementation DO NOT START YET；Ready/Merge HUMAN-ONLY；Ready auto NOT accepted）

FAST-LANE-V1（standing LOW execution lane candidate）: `docs/process/fast-lane-v1.md`（CANDIDATE / NOT YET ACTIVE；Standing LOW authorization NOT GRANTED；Human Decision NOT YET GRANTED；Merge HUMAN-ONLY；LIVE/Entra/SharePoint/Deploy FORBIDDEN by this candidate alone）

AUTONOMY-POLICY-V1（AUTO-1 / AI Development OS の機械判定可能な policy contract）: `docs/process/autonomy-policy-v1.md`（ACCEPTED / NOT ENABLED；Authorization effect NONE；UNKNOWN → DENY；Gateway に Ready / Merge executor なし）

実行参照（操作単位マトリクス）: `.agents/mcp/permission-matrix.md`

区分:

| 区分 | 意味 |
|---|---|
| AI単独 | AI が証跡付きで実施してよい |
| 人の事前承認 | 投稿・反映・実行の前に人の明示承認が必要 |
| 禁止 | この基盤の手順としては実施しない |

追加規則:

- 区分重複時は `禁止` > `人の事前承認` > `AI単独`
- 人の承認は対象・操作・範囲・版に拘束する
- head SHA / artifact / 環境 / 変更範囲が変わった場合、承認と Review PASS は失効する
- 実行参照が上位正本と矛盾する場合は DEC-AI-ORG-3 を優先する

この基盤の手順として禁止する代表例:

- 本番環境への deploy
- SharePoint App Catalog への登録・更新
- SharePoint 本番変更
- Entra ID 変更
- Microsoft 365 権限・テナント設定変更
- 本番データ変更・物理削除
- Notion 本番ページ更新
- main / 保護ブランチへの直接 push / force-push

権限境界に関して既存正本と矛盾する場合、`DEC-AI-ORG-3` を優先し、後続 Issue で既存正本を整合更新する。

## 既存正本への参照（移動しない）

| 主題 | 正本 |
|---|---|
| Skill 実行順・AI/人の責務 | `docs/process/development-process.md` |
| Gate 通過条件 | `docs/process/gate-definitions.md` |
| 自己参照 Gate 方針 | `docs/process/self-referential-gate-policy.md` |
| 品質ゲート詳細 | `docs/development/quality-gates.md` |
| Skill カタログ | `docs/process/skill-catalog.md` |
| 共通判定 | `.agents/skills/_shared/judgement-rules.md` |
| 出力形式 | `.agents/skills/_shared/output-format.md` |
| 権限境界（上位） | `docs/decisions/DEC-AI-ORG-003.md` |
| Auto-Approval Policy v1 | `docs/decisions/DEC-AA-001.md` |
| AUTO-UNTIL-GATE Policy v1 | `docs/decisions/DEC-AA-003.md` |
| Routine AUG v1 運用モデル | `docs/process/routine-aug-v1.md` |
| Process Optimization v1（Accepted / NOT ENABLED） | `docs/process/process-optimization-v1.md` |
| LOW-AUTO-PILOT-V1（LA1-A ACCEPTED / execution NOT STARTED） | `docs/process/low-auto-pilot-v1.md` |
| FAST-LANE-V1（CANDIDATE / NOT YET ACTIVE） | `docs/process/fast-lane-v1.md` |
| AUTONOMY-POLICY-V1（AUTO-1 ACCEPTED / NOT ENABLED） | `docs/process/autonomy-policy-v1.md` |
| MCP 権限実行参照 | `.agents/mcp/permission-matrix.md` |

## 本入口が承認しないこと

- 既存正本の移動
- MCP 接続・認証・OAuth・コネクタ設定
- token / secret / credential 等の記録
- Ready 化・マージそのもの（人の事前承認が別途必要）
- SharePoint / Entra ID / Microsoft 365 / 本番データの変更
- DEC-AI-ORG-3 にない新権限の追加、禁止操作の緩和
- Auto-Approval の有効化（`AUTO_APPROVAL_ENABLED`）。DEC-AA-1 Accepted でも別 Human Explicit GO が必要
- AUTO-UNTIL-GATE の有効化（`AUTO_UNTIL_GATE_ENABLED`）。DEC-AA-3 Accepted でも別 Human Explicit GO が必要
- Implementation Start（DEC-AA-1 / DEC-AA-3 Policy Accepted では成立しない）
- Process Optimization v1 の LOW auto-loop / Start / Ready / next-slice 自動候補の有効化（`docs/process/process-optimization-v1.md` Accepted / LOCKED でも Authorization effect NONE；別 Human Explicit GO が必要）
- LOW-AUTO-PILOT-V1 の pilot execution / first-slice Start（`docs/process/low-auto-pilot-v1.md` LA1-A ACCEPTED でも Pilot execution = NOT STARTED；別 Human execution GO が必要）
- LOW-AUTO-PILOT-V1 recording PR の Ready / Merge（Acceptance 単独では付与しない；Human Ready / Merge Decision が必要）
- FAST-LANE-V1 の standing LOW authorization（`docs/process/fast-lane-v1.md` は CANDIDATE / NOT YET ACTIVE；Human Decision ACCEPT 前は効力なし）
- Issue #4 Entra readiness Acceptance または Entra Mutation GO（readiness packet 単独では mutation を認可しない）
- AUTONOMY-POLICY-V1 の enablement、Capability Registry / Task Packet / Action Gateway / execution backend の実装（AUTO-1 ACCEPTED でも Authorization effect NONE；別 unit / GO が必要）
- AUTONOMY-POLICY-V1 を根拠とする Ready / Merge / Decision Acceptance、SharePoint / M365 / Entra / permission / secret / production deploy（Gateway executor を持たず、上位正本を緩和しない）
- AssessmentSnapshot adapter EC-3 / EC-4 または Implementation Start の自動充足・迂回（法人アプリ lane の現行 Gate を維持）
