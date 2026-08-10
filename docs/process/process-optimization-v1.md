# Process Optimization v1 — PROCESS-OPT-V1

- 文書: `docs/process/process-optimization-v1.md`
- Unit: **PROCESS-OPT-V1**
- 位置づけ: Process Optimization v1 の **方針正本（proposal / design SoT）**
- 状態: **PROPOSED / READY_FOR_HUMAN_DECISION**（Accepted / LOCKED **ではない**）
- 入力: PR #195–#201 Current State；DEC-AA-001 / DEC-AA-003；Routine AUG v1；本 unit の Agent Instruction
- 上位正本（緩和・上書きしない）:
  - `docs/decisions/DEC-AI-ORG-003.md`
  - `docs/decisions/DEC-AA-001.md`（Auto-Approval Policy v1 / Option A）
  - `docs/decisions/DEC-AA-003.md`（AUTO-UNTIL-GATE Policy v1 / Option A3-1）
  - `docs/process/routine-aug-v1.md`（Routine AUG v1 / Option R1）
- 関連:
  - Selection: [`../architecture/decision-process-optimization-v1-selection.md`](../architecture/decision-process-optimization-v1-selection.md)
  - Independent Review: [`../architecture/decision-process-optimization-v1-independent-review.md`](../architecture/decision-process-optimization-v1-independent-review.md)

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](./self-referential-gate-policy.md)）。

## 目的

Accepted / LOCKED 済みの **低リスク実装**について、将来 Human 停止を減らすための
risk classification・LOW auto-loop・Stop Conditions・Human Gate 整理・batch 案・
Human-facing 3 状態を **正本として定義**する。

```text
今回の目的 = 方針の docs-only 正本化 + Independent Review
今回の目的 ≠ 実装開始
今回の目的 ≠ permission expansion
今回の目的 ≠ DEC-AA-001 / DEC-AA-003 semantic change
```

## 非効力（厳守）

```text
Policy proposal ≠ authorization change
Accepted docs ≠ AUTO permission expansion
PROCESS-OPT-V1 PROPOSED ≠ Implementation Start
PROCESS-OPT-V1 PROPOSED ≠ AUTO_APPROVAL / AUTO_UNTIL_GATE semantic rewrite
PROCESS-OPT-V1 PROPOSED ≠ Ready / Merge authorization change
Independent Review PASS ≠ Human Acceptance
```

本 unit は次を **認可しない・変更しない**:

| 対象 | 扱い |
|---|---|
| DEC-AA-001 semantic change | FORBIDDEN（本 unit） |
| DEC-AA-003 semantic change | FORBIDDEN（本 unit） |
| Routine AUG v1 上書き | FORBIDDEN（本 unit） |
| project-wide Implementation Start | NOT GRANTED |
| LOW Implementation Start の実効自動許可 | **NOT ENABLED**（候補定義のみ） |
| Ready の実効自動遷移 | **NOT ENABLED**（候補定義のみ） |
| next LOW slice の実効自動進行 | **NOT ENABLED**（候補定義のみ） |
| Merge | **HUMAN-ONLY**（維持） |
| SharePoint / M365 / Entra / Deploy / production data | FORBIDDEN / UNCHANGED |
| application / domain / test code | OUT OF SCOPE |
| Issue mutation / close / comment | OUT OF SCOPE |

## Current State authority（read-only 確認結果）

確認対象: remote `main` 上の PR #195–#201（#201 は #200 直後の GOV-RULE-07）。

| Source | Authority | Notes |
|---|---|---|
| PR #195 / DEC-AA-001 | Accepted / LOCKED / Option A | AUTO = read-only + mechanical verification；Policy Accepted ≠ ENABLED（DEC 本文） |
| PR #196 / DEC-AA-003 | Accepted / LOCKED / Option A3-1 | Local loop / stop before GitHub；Policy Accepted ≠ ENABLED（DEC 本文） |
| PR #198 / Routine AUG v1 | Accepted / LOCKED / ADOPTED / Option R1 | per-slice Implementation Start = REQUIRED；next slice selection = HUMAN-ONLY |
| PR #197 / OP-3 | domain slice MERGED | AUG-PILOT-1 qualification evidence |
| PR #199 / GOV-RULE-06 | domain slice MERGED | per-slice Start consumed on completion |
| PR #200 / GOV-RULE-05 | domain slice MERGED | per-slice Start consumed on completion |
| PR #201 / GOV-RULE-07 | domain slice MERGED | per-slice Start consumed on completion |

### Operational vs DEC-text（上書きしない記録）

Routine AUG v1 Independent Review は運用状態を次のように記録している:

```text
AUTO_APPROVAL: ENABLED（DEC-AA-001 Option A scope only）
AUTO_UNTIL_GATE: ENABLED
Project-wide Implementation Start: NOT GRANTED
Per-slice Implementation Start: REQUIRED
```

一方、DEC-AA-001 / DEC-AA-003 の Acceptance 本文は kill-switch / enable を
**DISABLED 維持**として記録し、ENABLED は **別 Human Explicit GO** としている。

```text
記録方針: 古い DEC 本文を PROCESS-OPT-V1 で書き換えない
矛盾は CONFLICT NOTE として残し、解消は別 Human Decision / 別 unit
現在の実装運用の標準モデル正本 = Routine AUG v1（eligibility 充足 slice のみ）
```

### Active HUMAN-ONLY boundaries（現行 — 本 unit で緩和しない）

Routine AUG v1 / DEC-AA-001 / DEC-AA-003 が現行で要求する境界:

```text
substantive / next slice selection          HUMAN-ONLY
exact-slice Implementation Start            HUMAN-ONLY（REQUIRED）
GitHub publication / branch / commit / push HUMAN-ONLY（別 GO）
Draft PR create/update                      HUMAN-ONLY（別 GO）
Ready for Review                            HUMAN-ONLY
Merge                                       HUMAN-ONLY
Issue mutation / Decision Acceptance        HUMAN-ONLY
SharePoint / M365 / permission / Deploy     FORBIDDEN or HUMAN-ONLY
UNKNOWN → HOLD
```

## Risk classification（3 段階）

Risk class は **実装 slice 単位**で判定する。曖昧・未分類は `UNKNOWN → HOLD`。

### LOW

対象例:

- Accepted / LOCKED 済み契約の TypeScript representation
- runtime validator
- pure domain function
- domain test
- contract test
- mechanical export wiring

必要条件（すべて必須）:

| # | Condition |
|---|---|
| L1 | Authority = Accepted / LOCKED |
| L2 | implementation boundary が明確 |
| L3 | 新しい業務判断なし |
| L4 | 制度解釈なし |
| L5 | SharePoint / M365 mutation なし |
| L6 | 権限変更なし |
| L7 | 実データなし |
| L8 | 未決 Decision への依存なし |

いずれか欠落 / 不明 → **NOT LOW**（再分類または HOLD）。

### MEDIUM

対象例:

- DTO wiring
- 複数 domain module の統合
- 既存 schema への union wiring
- adapter 内部ロジック
- 既存 domain behavior に影響する接続

MEDIUM は LOW auto-loop 対象外。現行 Human Gate / Routine AUG eligibility を維持する。

### HIGH

対象例:

- 制度要件の採否
- 新規業務語彙
- FindingCode 等の値定義
- SharePoint schema 変更
- column create / rename / delete
- Entra / SharePoint permission
- production data
- Deploy
- destructive mutation
- project-wide Implementation Start

HIGH は **現行 Human Gate を維持**する。LOW auto-loop への暗黙降格は禁止。

```text
LOW → HIGH への暗黙昇格経路を作らない
HIGH 要素が混入した slice は LOW として扱わない
batch 内に HIGH 要素を隠さない
```

## LOW auto-loop（提案モデル — NOT ENABLED）

将来 Human が別 Decision / Explicit GO で有効化した場合のみ対象。
**本 unit では定義のみ。実効権限は付与しない。**

```text
Accepted / LOCKED authority
        ↓
Risk Classification = LOW
        ↓
Next slice selection
        ↓
Per-slice local implementation
        ↓
Mechanical verification
        ↓
Independent Review
        ↓
必要なら bounded repair（DEC-AA-003: max_repair_cycles = 3）
        ↓
PASS
        ↓
次の LOW slice 候補を判定
```

### 次 slice 自動進行条件（将来有効化時 — すべて必須）

| # | Condition |
|---|---|
| A1 | Authority = Accepted / LOCKED |
| A2 | scope が一意 |
| A3 | 未決 Decision に依存しない |
| A4 | SharePoint / M365 mutation なし |
| A5 | permission 変更なし |
| A6 | production / real data なし |
| A7 | 前 slice verification PASS |
| A8 | Independent Review で P0=0 / P1=0 |
| A9 | 次候補が一意 |

1 つでも満たさない / 不明 → **HOLD**（自動進行しない）。

```text
現行 Routine AUG: next slice selection = HUMAN-ONLY
本提案の next-slice auto-advance = FUTURE CANDIDATE only
有効化には別 Human Decision が必要（DEC-AA / Routine AUG 改訂または下位 enable DEC）
```

## Stop Conditions

次を検出した時点で自動進行を停止する（将来 loop 有効時も、現行 Agent も）:

```text
UNKNOWN
authority conflict
specification ambiguity
new institutional interpretation required
new business vocabulary required
scope expansion
SharePoint / M365 mutation required
permission change required
production data required
destructive action required
P0
P1
semantic test failure
next candidate ambiguity
```

原則:

```text
UNKNOWN → HOLD
```

## Human Gate 整理（提案 — 権限は拡張しない）

目標モデル（**候補**）:

| Gate | 現行 | PROCESS-OPT-V1 候補 |
|---|---|---|
| Implementation Start | HUMAN-ONLY / per-slice REQUIRED | policy 条件を満たす LOW slice では **自動許可候補** |
| Ready | HUMAN-ONLY | verification + IR PASS なら **自動遷移候補** |
| Merge | HUMAN-ONLY | **HUMAN-ONLY**（維持） |

```text
候補 ≠ 認可
本 docs-only unit では権限を実際に拡張しない
DEC-AA-001 / DEC-AA-003 の permission authority を変更しない
Routine AUG eligibility condition 12 を本 unit で満たしたことにしない
```

## LOW batch 案

同一 authority、または強く関連する Accepted authority 群について、
**2〜4 slice** 程度を 1 つの implementation batch として扱える案を記録する。

条件（すべて必須）:

```text
同一 domain
相互依存が明確
HIGH 要素なし
SharePoint / M365 なし
permission 変更なし
scope boundary を個別に追跡可能
各 slice の verification 結果を保持可能
巨大 PR 禁止
batch 内部でも slice 単位の failure attribution を維持
```

例（説明用・本 unit では実装しない）:

```text
GREEN / AUTO（将来）
Completed:
- GOV-RULE-05 domain
- GOV-RULE-06 domain
Current:
- GOV-RULE-07 candidate
Verification:
PASS
Human action:
None
Next stop:
Merge decision or unresolved authority
```

```text
batch ≠ single opaque scope
1 つの batch 失敗で全 slice の責任境界を消さない
```

## Human-facing status（3 状態）

内部の詳細 state（Gate / eligibility / IR findings 等）は維持する。
Human 向け表示だけ次へ正規化する案:

| Status | 意味 |
|---|---|
| **GREEN / AUTO** | Agent が進行可能（現行権限・有効化済み envelope 内） |
| **YELLOW / HUMAN DECISION** | Human 判断が必要 |
| **RED / HOLD** | 外部条件または未解決依存待ち |

Human-facing report 最低項目:

```text
Current state
Completed
Current work
Verification
Human action
Next stop condition
```

例:

```text
GREEN / AUTO
Completed:
- GOV-RULE-05 domain
- GOV-RULE-06 domain
Current:
- GOV-RULE-07 candidate
Verification:
PASS
Human action:
None
Next stop:
Merge decision or unresolved authority
```

```text
Human-facing GREEN ≠ new authorization
表示簡略化は permission expansion ではない
```

## OUT OF SCOPE（本 unit）

```text
application code
domain code
tests
SharePoint schema
SharePoint list/column mutation
M365
Entra
production data
Deploy
Issue body update
Issue close
Issue comment
Ready transition
Merge
permission expansion
DEC-AA-001 semantic change
DEC-AA-003 semantic change
project-wide Implementation Start
```

## Conflict register（上書きしない）

| ID | Older / Current authority | PROCESS-OPT-V1 proposal | Resolution in this unit |
|---|---|---|---|
| POV1-C1 | Routine AUG: next slice selection = HUMAN-ONLY | LOW next-slice auto-advance candidate | **RECORDED ONLY** — 有効化は別 Human Decision |
| POV1-C2 | Routine AUG / AA: per-slice Implementation Start = REQUIRED / HUMAN-ONLY | LOW Start 自動許可候補 | **RECORDED ONLY** |
| POV1-C3 | Ready = HUMAN-ONLY | Ready 自動遷移候補 | **RECORDED ONLY** |
| POV1-C4 | DEC-AA kill-switch text vs Routine AUG operational ENABLED | 本 unit は触れない | **RECORDED ONLY**（既存 P2 系と併記） |
| POV1-C5 | Merge HUMAN-ONLY | Merge HUMAN-ONLY | **NO CONFLICT** — 維持 |

## OPEN P2 carry-forward（解消しない）

```text
AA3-P2-1: OPEN — DEC-AI-ORG-003 vs AA-3 v1 path priority
AA3-P2-2: OPEN — background-agent-contract verification vs Start wording
AA3-P2-3: OPEN — development-process vs DEC-AI-ORG-003 M365 wording
```

## 次工程（Human only）

1. 本 docs-only recording の Independent Review / Draft PR 境界（本 unit）
2. Human Decision: PROCESS-OPT-V1 を Accepted とするか / 改訂するか / 却下するか
3. Accepted 後も、LOW auto-loop / Start / Ready 候補の **実効 enable は別 Explicit GO**
4. DEC-AA / Routine AUG 改訂が必要なら別 unit（本 unit では行わない）

## Independent Review

正本: [`../architecture/decision-process-optimization-v1-independent-review.md`](../architecture/decision-process-optimization-v1-independent-review.md)
