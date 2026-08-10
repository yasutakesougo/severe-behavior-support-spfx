# DEC-AA-1: Auto-Approval Policy v1

- ID: DEC-AA-1
- ファイル: `docs/decisions/DEC-AA-001.md`
- 状態: **Accepted / LOCKED**
- 作成日: 2026-08-10
- 決定日: 2026-08-10
- Human Decision: **Option A — ACCEPTED / LOCKED**
- 上位正本: `docs/decisions/DEC-AI-ORG-003.md`（上書きしない）
- 入力: AA-0 PASS；AA-1 design READY_FOR_HUMAN_POLICY_ACCEPTANCE；Human Acceptance；Canonical Recording GO
- 前提:
  - DEC-AI-ORG-1 / 2 / 3 および ADR-AI-ORG-1 は承認済み
  - Implementation Start = HOLD（本 DEC は解除しない）
  - Phase ② / Issue #6 / #8 = OUT OF SCOPE（本 DEC は触らない）
  - Kill switch 初期値 = `AUTO_APPROVAL_DISABLED`（本 Acceptance でも変更しない）

## 判断する対象

本 DEC が決める対象は次のみとする。

- Auto-Approval の操作分類（AUTO / AUTO-UNTIL-GATE / HUMAN-ONLY / FORBIDDEN）
- AA-1 v1 で実際に AUTO とする操作集合
- Fail Closed 停止条件と `UNKNOWN → HOLD`
- Kill switch 状態と、Policy Accepted と ENABLED の分離
- AUTO 操作の監査証跡要件（秘密値は記録しない）
- AUTO-UNTIL-GATE を将来候補として定義するが v1 では enable しないこと

## 本 DEC で決めないこと / 承認しないこと

| 対象外 | 扱い |
|---|---|
| `AUTO_APPROVAL_ENABLED` | 別 Human Explicit GO が必要。本 DEC では認可しない |
| Implementation Start | HOLD 維持。本 DEC ≠ Start |
| application / feature / SharePoint adapter 実装 | 非認可 |
| code mutation（本 canonical recording 以外） | 非認可 |
| branch / commit / push / Draft PR（一般運用） | DEC-AI-ORG-3 のまま。本 DEC は一般解禁しない |
| Issue mutation / Ready / Merge | 非認可 |
| Decision auto-Accepted | FORBIDDEN |
| Phase ② recovery / #6 / #8 mutation | 非認可 |
| SharePoint / Microsoft 365 write | FORBIDDEN（基盤手順） |
| schema / permission / tenant / secret / credential mutation | 非認可 / FORBIDDEN |
| production data access/write | FORBIDDEN |
| Deploy / production release | 非認可 / 本番 FORBIDDEN |
| AUTO-UNTIL-GATE enable | 別 Human Decision が必要 |
| DEC-AI-ORG-3 マトリクス行の緩和 | しない |
| AA1-P2-1 / AA1-P2-2 の解消 | OPEN のまま。本 DEC で変更しない |

## 背景

- AA-0 は現行ゲート棚卸しを PASS し、AA-1 Policy 設計入力を固定した
- AA-1 設計は Option A（read-only + 機械検証のみ AUTO）を推奨し、Independent Review で P0/P1 = 0 だった
- Human が Option A を Accepted / LOCKED とした
- 本文書は、その Accepted 状態を repository 正本へ記録するための canonical recording である
- 本 DEC は DEC-AI-ORG-3 の下位・追加分類層であり、既存権限区分を緩和しない

## 選択肢

### A. v1 = read-only observation + existing mechanical verification only（採用）

AUTO を観測と既存機械検証に限定する。AUTO-UNTIL-GATE は定義のみで NOT ENABLED。HUMAN-ONLY / FORBIDDEN は現行境界を維持する。Kill switch は `AUTO_APPROVAL_DISABLED` のまま。Policy Accepted ≠ ENABLED。

### B. mutation 系を AUTO-UNTIL-GATE で即 enable（不採用）

code/docs edit、commit、push、Draft PR 等を v1 で連続実行可能にする。DEC-AI-ORG-3 と衝突し、特権昇格となるため採用しない。

### C. Policy Accepted と同時に ENABLED（不採用）

Kill switch の Fail Closed と矛盾するため採用しない。

## 決定

**選択肢 A を承認する（ACCEPTED / LOCKED）。**

```text
Human Decision:
Option A — ACCEPTED / LOCKED

AUTO:
read-only observation
existing mechanical verification only

AUTO-UNTIL-GATE:
defined
NOT ENABLED

HUMAN-ONLY / FORBIDDEN:
unchanged

UNKNOWN → HOLD

Capability ≠ Authorization
CI PASS ≠ authorization
Independent Review PASS ≠ Human Acceptance / Ready / Merge / Implementation Start
Decision Accepted ≠ Implementation Start

Kill switch:
AUTO_APPROVAL_DISABLED

Policy Accepted ≠ AUTO_APPROVAL_ENABLED
```

## 操作分類（正本）

### AUTO（v1 — `AUTO_APPROVAL_ENABLED` かつ本 DEC Accepted のときのみ実効）

| 操作 | 備考 |
|---|---|
| repository read-only observation | working tree 変更なし |
| permitted GitHub read-only observation | Issue / PR / Actions / 差分の参照。投稿なし |
| CI result read-back | CI PASS ≠ authorization |
| lint | 既存機械検証 |
| typecheck | 既存機械検証 |
| unit test | 既存機械検証 |
| contract test | 既存機械検証 |
| build（配布・登録を含まない） | App Catalog 登録は含まない |
| format check | 既存機械検証 |
| contracts-boundaries verification | 例: `check:contracts-boundaries` |
| verify:skills 等の既存機械検証 | 例: `verify:skills` / `check:scope`（逸脱時 HOLD） |
| read-only inventory / audit | canonical への書込なし |
| ローカル監査レポート案の生成 | 応答/一時出力のみ。正本への書込・commit は含まない |

AUTO は mutation 権限を意味しない。

### AUTO-UNTIL-GATE（定義のみ — v1 NOT ENABLED）

将来候補（この DEC では enable しない）:

- code edit（Accepted 範囲内）
- docs canonical edit
- branch create
- commit
- push（非保護 feature）
- Draft PR create/update

v1 でこれらを AUTO または enabled AUTO-UNTIL-GATE と解釈することは禁止する。

Ready / Merge / Issue mutation は将来も原則 HUMAN-ONLY とする。

### HUMAN-ONLY / FORBIDDEN（v1 固定・現行境界を維持）

| 操作 | 区分 |
|---|---|
| Implementation Start | HUMAN-ONLY |
| new Decision / Decision Accepted / policy acceptance | HUMAN-ONLY |
| 制度解釈 / 新しい業務ルール | HUMAN-ONLY |
| GitHub Issue mutation | HUMAN-ONLY |
| Draft PR create/update（一般） | HUMAN-ONLY（DEC-AI-ORG-3: 人の事前承認） |
| Ready for Review | HUMAN-ONLY |
| Merge | HUMAN-ONLY |
| SharePoint schema mutation | HUMAN-ONLY / Agent FORBIDDEN |
| Microsoft 365 write | FORBIDDEN |
| permission / tenant mutation | FORBIDDEN |
| secret / credential mutation | FORBIDDEN |
| production data access/write | FORBIDDEN |
| security-boundary change | HUMAN-ONLY |
| Deploy / production release | HUMAN-ONLY / 本番 FORBIDDEN |
| Phase ② recovery / #6 / #8 reconciliation | HUMAN-ONLY |
| `AUTO_APPROVAL_ENABLED` への変更 | HUMAN-ONLY（別 Explicit GO） |
| AUTO-UNTIL-GATE の enable | HUMAN-ONLY（別 Decision） |

## Fail Closed 停止条件

AUTO 処理中に次を検出したら停止し `HOLD` とする（該当が FORBIDDEN 要求なら実行せず停止）:

1. specification ambiguity
2. new Decision required
3. unresolved HOLD
4. evidence conflict
5. authority conflict（Capability ≠ Authorization を含む）
6. missing evidence
7. schema mutation required
8. permission mutation required
9. Microsoft 365 write required
10. production data access/write required
11. secret/credential mutation required
12. security-boundary change required
13. Deploy required
14. reviewed HEAD movement
15. Accepted behavior を変更しないと解決できない CI/review failure
16. Phase ② を迂回する必要がある
17. Implementation Start を自己成立させる必要がある
18. 未分類または未記載の操作 → **`UNKNOWN → HOLD`**

追加:

- `AUTO_APPROVAL_DISABLED` なのに AUTO 実行を求めること
- 本 DEC 未 Accepted なのに ENABLED を求めること（歴史的・再オープン時）
- CI PASS / Independent Review PASS / Decision Accepted を Ready・Merge・Implementation Start・ENABLED へ変換すること

## 認可関数（概念）

```text
authorize(action, context) -> ALLOW | HOLD | REQUIRE_HUMAN | FORBIDDEN

if AUTO_APPROVAL_ENABLED != true:                 HOLD
if DEC-AA-1 not Accepted:                         HOLD
if action not explicitly classified:              HOLD   # UNKNOWN → HOLD
if unresolvedHold(context):                       HOLD
if evidenceConflict(context):                     HOLD
if missingEvidence(context):                      HOLD
if authorityConflict(context):                    HOLD

if requiresNewDecision(action):                   REQUIRE_HUMAN
if touchesM365(action):                           FORBIDDEN
if touchesProductionData(action):                 FORBIDDEN
if requiresSecretMutation(action):                FORBIDDEN
if changesSecurityBoundary(action):               REQUIRE_HUMAN
if action in {Ready, Merge, IssueMutation,
              DraftPR, ImplementationStart,
              DecisionAccepted, Phase2, EnableAA}: REQUIRE_HUMAN

if action.class == AUTO:                          ALLOW
if action.class == AUTO_UNTIL_GATE:
  if separately_enabled_by_Human_GO: ALLOW else HOLD
if action.class == HUMAN_ONLY:                    REQUIRE_HUMAN
if action.class == FORBIDDEN:                     FORBIDDEN

default:                                          HOLD
```

優先: DEC-AI-ORG-3 の `禁止` > `人の事前承認` > 本 DEC 分類。矛盾時は DEC-AI-ORG-3 を優先し、AA 側で上書きしない。

## Kill switch

| 状態 | 意味 |
|---|---|
| `AUTO_APPROVAL_DISABLED` | **現行・初期値**。AUTO 実行不可 |
| `AUTO_APPROVAL_ENABLED` | 本 DEC Accepted **かつ** 別 Human Explicit GO の後のみ |

```text
Policy Accepted ≠ AUTO_APPROVAL_ENABLED
Current kill switch: AUTO_APPROVAL_DISABLED
Agent MUST NOT set ENABLED
```

## 監査証跡（AUTO）

記録する: action / timestamp / repository / base-head SHA（該当時） / classification / authority / evidence used / result / stop reason / next gate

記録しない: secret / token / credential 値 / 個人情報実データ

## 既存正本との関係

| 正本 | 関係 |
|---|---|
| DEC-AI-ORG-003 | 上位。本 DEC は緩和しない |
| ILB-1 / EG-1 / Implementation Entry | UNCHANGED |
| Independent Review / Merge Gate / Release Gate | UNCHANGED。AA は通過を自動付与しない |
| Phase ② / #6 / #8 | OUT OF SCOPE |

### OPEN P2（本 DEC で解消しない）

```text
AA1-P2-1
development-process vs DEC-AI-ORG-003 M365 wording
Status: OPEN

AA1-P2-2
background-agent-contract verification vs Start wording
Status: OPEN
```

## 承認記録

- 承認内容: 選択肢 A（Auto-Approval Policy v1）
- 状態: Accepted / LOCKED
- 承認日: 2026-08-10
- Canonical Recording GO: Human Explicit GO（Accepted Policy の正本記録のみ）
- 承認範囲の上限:
  - Kill switch は `AUTO_APPROVAL_DISABLED` のまま
  - `AUTO_APPROVAL_ENABLED` は承認しない
  - Implementation Start は承認しない
  - AUTO-UNTIL-GATE は enable しない
  - P2 findings は OPEN のまま

## 本決定の効力と非効力

### 効力

- Auto-Approval Policy v1 Option A を Accepted / LOCKED 正本とする
- AUTO / AUTO-UNTIL-GATE（disabled）/ HUMAN-ONLY / FORBIDDEN の分類を固定する
- Fail Closed と kill switch 分離を固定する

### 非効力

- Auto-Approval の有効化（ENABLED）にはならない
- Implementation Start にはならない
- DEC-AI-ORG-3 の操作区分緩和にはならない
- Draft PR / Ready / Merge / Issue / M365 / Deploy の一般許可にはならない
- AA1-P2-1 / AA1-P2-2 の解消にはならない

## 次工程（Human only）

1. 本 canonical recording の Independent Review / Draft PR 境界（本 GO 範囲）
2. 別 Human Explicit GO: `AUTO_APPROVAL_ENABLED`（必要なときのみ）
3. 任意: AA1-P2-1 / AA1-P2-2 整合（別 Issue）

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（`docs/process/self-referential-gate-policy.md`）。
