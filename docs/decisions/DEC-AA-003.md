# DEC-AA-3: AUTO-UNTIL-GATE Policy v1

- ID: DEC-AA-3
- ファイル: `docs/decisions/DEC-AA-003.md`
- 状態: **Accepted / LOCKED**
- 作成日: 2026-08-10
- 決定日: 2026-08-10
- Human Decision: **Option A3-1 — ACCEPTED / LOCKED**
- 上位正本: `docs/decisions/DEC-AI-ORG-003.md`（上書きしない）
- 関連: `docs/decisions/DEC-AA-001.md`（Auto-Approval Policy v1 / Option A）
- 入力: AA-3 design READY_FOR_HUMAN_POLICY_ACCEPTANCE；Human Acceptance；Canonical Recording GO
- 前提:
  - DEC-AA-1 Option A — Accepted / LOCKED
  - `AUTO_APPROVAL` 運用状態 = ENABLED（DEC-AA-001 Option A scope のみ）
  - `AUTO_UNTIL_GATE` 運用状態 = **DISABLED**（本 Acceptance でも変更しない）
  - Implementation Start = HOLD（本 DEC は解除しない）
  - Phase ② / Issue #6 / #8 = OUT OF SCOPE

## 判断する対象

本 DEC が決める対象は次のみとする。

- AUTO-UNTIL-GATE（AUG）の前提条件・実行ループ・停止境界
- AA-3 v1 で AUG に含める操作（local only、GitHub 公開前停止）
- bounded repair 規則（`max_repair_cycles = 3`）
- scope envelope 必須フィールド
- anti-bypass 規則
- baseline / HEAD 移動時の fail-closed 挙動
- kill switch `AUTO_UNTIL_GATE_DISABLED` / `ENABLED` の分離
- AUG 監査証跡要件（秘密値は記録しない）

## 本 DEC で決めないこと / 承認しないこと

| 対象外 | 扱い |
|---|---|
| `AUTO_UNTIL_GATE_ENABLED` | 別 Human Explicit GO が必要。本 DEC では認可しない |
| Implementation Start | HOLD 維持。本 DEC ≠ Start。slice ごとに別 GO |
| substantive slice 選択 | HUMAN-ONLY |
| branch / commit / push / Draft PR（AA-3 v1） | HUMAN-ONLY（GitHub 公開境界） |
| Ready / Merge / Issue mutation | HUMAN-ONLY |
| AUTO-UNTIL-GATE 前提の自己成立 | FORBIDDEN |
| DEC-AI-ORG-003 / DEC-AA-001 の緩和 | しない |
| M365 / SharePoint / schema / permission / production / Deploy | FORBIDDEN |
| Decision auto-Accepted | FORBIDDEN |
| AA3-P2-1 / AA3-P2-2 / AA3-P2-3 の解消 | OPEN のまま |

## Policy model（採用）

**Option A3-1 — Local implementation loop, stop before GitHub**

```text
Human-selected implementation slice
        ↓
Human Explicit Implementation Start（exact slice）
        ↓
AUTO_UNTIL_GATE_ENABLED（別 GO）
        ↓
scoped local file edit
        ↓
mechanical verification
        ↓
bounded repair（max 3 cycles）
        ↓
re-verification
        ↓
Independent Review execution
        ↓
STOP
        ↓
Human next gate
```

AUG は前提を自己成立させてはならない。

## 前提条件（9 件すべて必須）

将来 AUG が動作してよいのは、次が **すべて** 独立に満たされている場合のみ。

| # | Prerequisite |
|---|---|
| 1 | Accepted Decision / specification が存在 |
| 2 | implementation scope が explicit |
| 3 | acceptance criteria が testable |
| 4 | 当該 slice に unresolved HOLD なし |
| 5 | **exact slice に Human Explicit Implementation Start** |
| 6 | `base_sha` と `allowed_paths` が bound |
| 7 | M365 / production mutation 不要 |
| 8 | new Decision 不要 |
| 9 | **AUTO_UNTIL_GATE が別 Human enable 済み** |

任意 1 つでも欠落 → `HOLD`。

## AUTO-UNTIL-GATE scope（Accepted / v1 有効化時）

`AUTO_UNTIL_GATE_ENABLED` かつ上記 9 前提が満たされた slice に限り:

| 操作 | 備考 |
|---|---|
| scoped local repository file edit | `allowed_paths` 内のみ |
| bounded implementation repair | 下記 repair LOCK |
| mechanical verification | DEC-AA-001 Option A 既存検証を含む |
| re-verification | repair 後必須 |
| Independent Review execution | ローカル監査成果物。PASS ≠ Ready/Merge/Start |

**AA-3 v1 external write:**

```text
external_write_permissions = NONE
```

## Bounded repair LOCK

repair は次が **すべて** 真の間のみ:

- `allowed_paths` 内
- Accepted behavior 不変
- selected implementation scope 内
- 新 business/domain Decision なし
- schema 変更なし
- 新 dependency なし（slice で明示許可がある場合のみ例外；なければ STOP）
- security / authorization 弱化なし
- validation 弱化なし
- failing test の削除なし
- test skip を PASS 取得目的で導入しない
- Accepted test expectation 弱化なし

```text
max_repair_cycles = 3
```

超過 → `STOP → HUMAN`

### Mandatory stop triggers

- scope expansion
- public contract change
- domain behavior change
- schema change
- new dependency required without prior authorization
- security-control change
- authorization-logic change
- Accepted expectation change
- test deletion / weakening
- repair cycles > 3
- failure not confidently implementation-local
- material baseline movement

## Scope envelope（必須）

各 AUG 実行は開始前に固定:

```text
unit_id
policy_version
base_sha
allowed_paths
forbidden_paths
accepted_decisions
acceptance_tests
implementation_start_evidence
max_repair_cycles          # default 3
external_write_permissions # v1: NONE
stop_gate                  # Independent Review 後 → Human
```

scope mismatch → `HOLD`

## HUMAN-ONLY（AA-3 v1 — AUG に含めない）

```text
substantive slice selection
Implementation Start
branch creation
commit
push
Draft PR create/update
Ready for Review
Merge
Issue mutation
new Decision / Decision Accepted / policy mutation
scope expansion
Phase ② recovery / #6 / #8 reconciliation
AUTO_UNTIL_GATE enablement
security-boundary change
```

## FORBIDDEN

```text
SharePoint / Microsoft 365 mutation
schema mutation by Agent
permission / tenant mutation
secret / credential mutation
production data access/write
production Deploy
Decision auto-Accepted
requirement weakening to make tests pass
missing-spec inference followed by implementation
silent rebase
silent authority expansion
```

## Anti-bypass rules

```text
test failure → change requirement → PASS     FORBIDDEN
missing specification → infer behavior → implement   FORBIDDEN
CI PASS ≠ Ready
Independent Review PASS ≠ Merge
Entry Criteria MET ≠ Implementation Start
AA-3 Accepted ≠ AUTO_UNTIL_GATE_ENABLED
```

## Baseline / HEAD movement（fail-closed）

```text
origin/main materially moves     → HOLD
base_sha mismatch                → HOLD
scope diff expands               → HOLD
reviewed HEAD changes            → prior IR invalid
silent rebase                    → FORBIDDEN
silent authority expansion       → FORBIDDEN
```

## Kill-switch inheritance

```text
AUTO_APPROVAL_DISABLED           → AUTO も AUG も不可
AUTO_APPROVAL_ENABLED            → DEC-AA-001 Option A AUTO のみ（現行）
AUTO_UNTIL_GATE_DISABLED         → 初期値・現行（本 Acceptance でも変更しない）
AUTO_UNTIL_GATE_ENABLED          → 別 Human Explicit GO のみ
```

```text
AA-3 Policy Accepted ≠ AUTO_UNTIL_GATE_ENABLED
```

## DEC-AI-ORG-003 との関係（AA3-P2-1 注記）

DEC-AI-ORG-003 は Implementation Start 後の commit/push 等を AI単独と定義しうる。
本 DEC の AUG 経路は **より狭い envelope**（local loop、GitHub 公開前 STOP）を定義する。
矛盾時は DEC-AI-ORG-003 を上位とし、AUG 経路は追加制約として適用する。AA3-P2-1 は OPEN（完全整合は別 Issue）。

## OPEN P2（本 DEC で解消しない）

```text
AA3-P2-1
DEC-AI-ORG-003 Start後 commit/push AI単独経路と AA-3 v1 経路の優先関係
Status: OPEN

AA3-P2-2
background-agent-contract verification vs Start wording（AA1-P2-2 carry-forward）
Status: OPEN

AA3-P2-3
development-process vs DEC-AI-ORG-003 M365 wording（AA1-P2-1 carry-forward）
Status: OPEN
```

## 承認記録

- 承認内容: Option A3-1（Local implementation loop, stop before GitHub）
- 状態: Accepted / LOCKED
- 承認日: 2026-08-10
- Canonical Recording GO: Human Explicit GO（AA-3 Option A3-1 正本記録のみ）
- 承認範囲の上限:
  - `AUTO_UNTIL_GATE` = DISABLED 維持
  - Implementation Start = HOLD 維持
  - branch/commit/push/Draft PR = HUMAN-ONLY（v1）
  - P2 = OPEN 維持

## 本決定の効力と非効力

### 効力

- AUTO-UNTIL-GATE Policy v1 Option A3-1 を Accepted / LOCKED 正本とする
- 前提 9 件・repair LOCK・scope envelope・GitHub 停止境界を固定する

### 非効力

- `AUTO_UNTIL_GATE_ENABLED` にはならない
- Implementation Start にはならない
- いかなる implementation slice も認可しない
- GitHub 公開操作を許可しない
- P2 findings の解消にはならない

## 次工程（Human only）

1. 本 canonical recording の Independent Review / Draft PR 境界
2. 別 Human Explicit GO: `AUTO_UNTIL_GATE_ENABLED`
3. slice ごとの Human Explicit Implementation Start
4. 任意: AA3-P2 / AA1-P2 整合 Issue

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（`docs/process/self-referential-gate-policy.md`）。
