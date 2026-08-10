# LOW-AUTO-PILOT-V1 — Limited LOW Auto-Loop Pilot

- 文書: `docs/process/low-auto-pilot-v1.md`
- Unit: **LOW-AUTO-PILOT-V1**
- 位置づけ: PROCESS-OPT-V1 の下位 **限定試行 enablement Decision 正本（packet）**
- 状態: **READY_FOR_HUMAN_DECISION**（ACCEPT / HOLD）
- 推奨 Option: **LA1-A（Option A）**
- 上位正本（緩和・上書きしない）:
  - `docs/decisions/DEC-AI-ORG-003.md`
  - `docs/decisions/DEC-AA-001.md`
  - `docs/decisions/DEC-AA-003.md`
  - `docs/process/routine-aug-v1.md`
  - `docs/process/process-optimization-v1.md`（PROCESS-OPT-V1 / ACCEPTED / LOCKED）
- 関連:
  - Selection: [`../architecture/decision-low-auto-pilot-v1-selection.md`](../architecture/decision-low-auto-pilot-v1-selection.md)
  - Independent Review: [`../architecture/decision-low-auto-pilot-v1-independent-review.md`](../architecture/decision-low-auto-pilot-v1-independent-review.md)

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](./self-referential-gate-policy.md)）。

## Current fixed state（入力）

```text
PR #202: MERGED
PROCESS-OPT-V1: ACCEPTED / LOCKED
LOW auto-loop: DEFINED / NOT ENABLED
Authorization expansion: NONE
Implementation: DO NOT START（本 packet 時点）
```

## 目的

「LOW 全部を自動化するか」ではなく、**pure domain 系だけを試験的に自動化するか**を
独立 unit として Human Decision 可能にする。

```text
本 unit の目的 = LA1-A / LA1-B の判断単位固定 + IR
本 unit の目的 ≠ 実装開始
本 unit の目的 ≠ SharePoint / M365 / Deploy 解禁
本 packet 時点の Authorization effect = NONE
```

## Human Decision requested

```text
Decision:
LA1-A Option A — ACCEPT / HOLD
```

| Choice | Meaning |
|---|---|
| **ACCEPT** Option A（LA1-A） | 限定 LOW pilot を **ENABLED**（下記 envelope のみ） |
| **HOLD** | enable しない。PROCESS-OPT-V1 の DEFINED / NOT ENABLED を維持 |
| LA1-B（参考） | 定義だけ維持して NOT ENABLED（HOLD と同趣旨の明示 option） |

```text
Agent recommendation / Independent Review: NOT Human Acceptance evidence
本 packet は ACCEPT を自己成立させない
```

## Option A — LA1-A（推奨）

```text
LA1-A — Option A
LOW-AUTO-PILOT-V1 を限定試行として ENABLED
```

### 対象（すべて必須）

```text
Accepted / LOCKED 済み
LOW 分類
Domain type
runtime validator
pure domain function
domain / contract tests
mechanical export wiring
```

追加除外（対象外）:

```text
DTO wiring
複数 domain module 統合 / union wiring
adapter 内部ロジック
MEDIUM / HIGH
SharePoint / M365
permission change
real data
Deploy
destructive action
制度解釈 / 新規業務語彙 / FindingCode 値定義
project-wide Implementation Start
```

### 自動化候補（ACCEPT 時のみ・pilot envelope 内）

```text
per-slice Implementation Start（pilot 対象 slice に限る）
mechanical verification
Independent Review
bounded repair（DEC-AA-003: max_repair_cycles = 3）
next LOW slice selection（一意かつ下記停止条件を満たす場合のみ）
```

### 自動停止条件

次を検出したら即 STOP / HOLD:

```text
UNKNOWN
authority conflict
scope ambiguity
P0 / P1
semantic failure
SharePoint / M365
permission change
real data
destructive action
next slice が一意でない
```

原則:

```text
UNKNOWN → HOLD
```

### Human-only（ACCEPT 後も維持）

```text
Merge
HIGH 判断
permission expansion（pilot 外）
SharePoint / M365 mutation
Deploy
Ready（本 pilot では自動 Ready を含めない）
Issue mutation
Decision Acceptance / 新制度 Decision
GitHub publication の一般解禁（pilot 外）
```

```text
Merge = HUMAN-ONLY
本 pilot は Ready 自動遷移を ENABLED にしない
PROCESS-OPT-V1 の Ready auto candidate は本 pilot では採用しない
```

### Pilot 上限

```text
2〜4 LOW slices
1 batch まで
Pilot 終了後に Human review 必須
巨大 PR 禁止
slice 単位の failure attribution 維持
```

### ACCEPT 時の効力 / 非効力

**効力（ACCEPT 後）:**

- 上記 pure-domain LOW envelope 内でのみ LOW auto-loop pilot を ENABLED
- Routine AUG の「per-slice Human Implementation Start REQUIRED」および
  「next slice selection = HUMAN-ONLY」に対する **限定例外**（pilot 対象のみ）
- POV1-P2-1 / POV1-P2-2 の **pilot 範囲での意図的解消試行**（全体政策の書き換えではない）

**非効力（ACCEPT 後も）:**

```text
LOW 全体の恒久自動化 ≠ 本 pilot
MEDIUM / HIGH の自動化 ≠ 本 pilot
Merge HUMAN-ONLY 維持
SharePoint / M365 / Deploy / real data FORBIDDEN 維持
DEC-AA-001 / DEC-AA-003 の広範 semantic rewrite ≠ 本 pilot
project-wide Implementation Start ≠ 本 pilot
Pilot 上限超過の継続実行 FORBIDDEN
```

## Option B — LA1-B（参考）

```text
LA1-B:
定義だけ維持して NOT ENABLED
```

PROCESS-OPT-V1 のまま。自動進行は開始しない。

## Conflict register（上書きしない）

| ID | Current authority | LA1-A if ACCEPT | Handling in this packet |
|---|---|---|---|
| LA1-C1 | Routine AUG: next slice selection = HUMAN-ONLY | pilot 内のみ auto selection | **SCOPED EXCEPTION candidate** — 全体上書きしない |
| LA1-C2 | Routine AUG: per-slice Human Start REQUIRED | pilot 内 Start auto | **SCOPED EXCEPTION candidate** |
| LA1-C3 | PROCESS-OPT-V1: LOW auto-loop NOT ENABLED | pilot ENABLED | **これが本 Decision の本丸** |
| LA1-C4 | Ready HUMAN-ONLY / PROCESS-OPT Ready candidate | Ready auto **NOT in pilot** | **NO CHANGE** |
| LA1-C5 | Merge HUMAN-ONLY | Merge HUMAN-ONLY | **NO CONFLICT** |

```text
古い正本（Routine AUG / DEC-AA）を本 packet で書き換えない
ACCEPT 後も、例外は本 unit 正本 + pilot envelope に閉じる
矛盾時の全体政策改訂は別 unit
```

## OUT OF SCOPE（本 docs packet）

```text
application / domain / test code changes
SharePoint / M365 / Entra / Deploy
Issue mutation
Ready / Merge of unrelated work
permission expansion beyond stated pilot envelope
DEC-AA-001 / DEC-AA-003 / Routine AUG 本文 rewrite
Implementation Start of any domain slice
```

## OPEN P2 carry-forward

```text
POV1-P2-1: OPEN — next-slice HUMAN-ONLY vs auto-advance（ACCEPT 時は pilot 例外として扱う候補）
POV1-P2-2: OPEN — Start/Ready HUMAN-ONLY vs auto candidates（ACCEPT 時 Start のみ pilot 例外候補；Ready は対象外）
AA3-P2-1 / AA3-P2-2 / AA3-P2-3: OPEN carry-forward（本 unit で解消しない）
```

## 次工程

1. 本 packet の Independent Review（docs-only）
2. Human Decision: **LA1-A Option A — ACCEPT / HOLD**
3. ACCEPT の場合のみ: Acceptance 正本記録 → その後に pilot 実行 GO（実装は別）
4. HOLD / LA1-B の場合: NOT ENABLED 維持

## Independent Review

正本: [`../architecture/decision-low-auto-pilot-v1-independent-review.md`](../architecture/decision-low-auto-pilot-v1-independent-review.md)
