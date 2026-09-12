# SBS-MGMT-HOME-CORRECTION-1 — Implementation Scope Correction-1

```text
repository: yasutakesougo/severe-behavior-support-spfx
unit: SBS-MGMT-HOME-CORRECTION-1
kind: Implementation Scope Correction-1
task class: DOCS-ONLY SCOPE CORRECTION
risk: HIGH
mode: docs-only on Draft PR #604
date: 2026-09-12
branch: cursor/sbs-mgmt-home-5-persona-sim-c53a
PR: #604（Draft）
Human Implementation Scope Correction-1 GO: RECEIVED / CONSUMED
Human Definition / Scope Lock GO: remains CONSUMED
LOCKED Definition / Correction Scope: UNCHANGED
Human Implementation Start GO: NOT AUTHORIZED / NOT CONSUMED / NOT ELIGIBLE
product / SPFx / runtime mutation: 0
Fresh Independent Implementation Scope Re-Review: REQUIRED / NOT PERFORMED HERE
```

## 1. Authority

```text
This packet consumes Human Implementation Scope Correction-1 GO only.

It does NOT:
  reopen or modify LOCKED Definition / Correction Scope meaning
  authorize product / SPFx implementation
  constitute or consume Human Implementation Start GO
  perform or substitute Fresh Independent Implementation Scope Re-Review
  authorize Ready / Merge / Deploy / LIVE WRITE
```

Corrected candidate:

```text
docs/architecture/sbs-mgmt-home-correction-1-implementation-scope-1.md
```

Historical review (unchanged verdict record):

```text
docs/architecture/sbs-mgmt-home-correction-1-independent-implementation-scope-review-1.md
verdict remains CORRECTION（historical）
```

## 2. Required Corrections（Human GO）

| ID | Required close | Status |
|---|---|---|
| ISR1-P1-1 | Draft N+1 authority unique; `conceptualNextVersion` alone must not mean Draft exists | **CLOSED** in Scope candidate |
| ISR1-P1-2 | S-POP UNAVAILABLE exact contract compatible with `OverviewKpiCard.count: number`; not fake as 0 | **CLOSED** in Scope candidate |
| P2 findings | Not required by this GO | **NOT EXPANDED** |

## 3. P1-1 RESOLUTION（ISR1-P1-1）

### Closed by wording

In `sbs-mgmt-home-correction-1-implementation-scope-1.md` § S-DRAFT:

```text
Draft N+1 表示（「次版下書き vN+1（未適用）」）を出してよい
  iff 既存 draft 実体があり、draft.candidate.version が存在する
N+1 = draft.candidate.version のみ

conceptualNextVersion
  = 次版の考え方 / 版番号の概念値
  ≠ Draft 実体
  ≠ Draft exists の証拠
  単独では Draft N+1 を出してはならない
  単独では Draft の存在を表現してはならない

FORBIDDEN
  N+1 = draft.candidate.version または conceptualNextVersion
  conceptualNextVersion だけで Draft ラベルを出すこと
  Draft 不在を conceptual next で埋めること
```

### Evidence

| Before（Review-1） | After（Correction-1） |
|---|---|
| `N+1 = draft.candidate.version または conceptualNextVersion` | `N+1 = draft.candidate.version のみ` |
| conceptual next と draft candidate が同列 | 明示分離。概念値は Draft exists の証拠にならない |
| Cさんで概念値があれば Draft 表示し得る曖昧さ | Draft 実体が無い対象は現行版のみ。概念値があっても Draft 非表示 |

C6 preservation: Draft exists != Applied の authority を補完するのみ。新しい product requirement は追加していない。

## 4. P1-2 RESOLUTION（ISR1-P1-2）

### Closed by wording

In `sbs-mgmt-home-correction-1-implementation-scope-1.md` § S-POP:

既存型を維持:

```text
OverviewKpiCard = Readonly<{
  id: OverviewKpiCategory;
  label: string;
  count: number;       // 型上必須。意味は availability で分岐
  statusHint: string;
}>
```

排他 2 mode:

```text
MODE_RESOLVED
  count = distinct 適格 userId 人数（0 可 = 予定が無い）
  statusHint = 通常 hint
  count を人数として描画可
  count=0 ≠ UNAVAILABLE

MODE_UNAVAILABLE
  表示状態 = UNAVAILABLE
  count は population 意味を持たない（0/12/番兵禁止）
  statusHint = 「確認できません」
  count を population 数字として描画してはならない
  主値 = statusHint（非数値 unavailable 表示）
```

### Evidence

| Before（Review-1） | After（Correction-1） |
|---|---|
| missing →「確認できません」かつ 0 禁止のみ | display state と `count: number` の意味を mode で分離 |
| `OverviewKpiCard.count: number` 上の UNAVAILABLE shape 未固定 | MODE_UNAVAILABLE exact UI/type 規則を固定 |
| 実装者が 0 / 12 / 番兵を独断し得る | 0/12/番兵による UNAVAILABLE 偽装を FORBIDDEN |

C4 preservation: UNAVAILABLE != NONE/ZERO を補完するのみ。新しい業務状態は追加していない。

## 5. C1–C6 PRESERVATION

```text
C1 Re-Sim Gate     — untouched（Start 後）
C2 due authority   — untouched
C3 status SoT      — untouched
C4 population      — display contract only（ISR1-P1-2）
C5 nav             — untouched（P2 not expanded）
C6 Draft copy      — N authority only（ISR1-P1-1）
LOCKED Definition / Correction Scope blobs — not rewritten for meaning
definition-correction-1.md — trailing whitespace mechanical fix only
```

## 6. Mechanical CI fix

```text
file: docs/architecture/sbs-mgmt-home-correction-1-definition-correction-1.md
change: trailing whitespace removal only（content meaning unchanged）
```

## 7. Out of scope（explicit）

```text
ISR1-P2-1 / ISR1-P2-2 — not required by this GO; no scope expansion
product / SPFx source change
Human Implementation Start GO
Fresh Independent Re-Review execution / PASS substitution
Ready / Merge / Deploy / cloud write
```

## 8. Gate after this packet

```text
Implementation Scope Correction-1 = APPLIED
ISR1-P1-1 = CLOSED（docs contract）
ISR1-P1-2 = CLOSED（docs contract）
Independent Implementation Scope Re-Review = REQUIRED
Human Implementation Start GO = NOT ELIGIBLE until Re-Review path completes
```

## 9. NEXT

```text
STOP in this Project runtime.

Next required action（separate Fresh Independent Runtime）:
  Independent Implementation Scope Re-Review
  entry: docs/architecture/sbs-mgmt-home-correction-1-independent-implementation-scope-re-review-entry-1.md
  basis: corrected Implementation Scope candidate on PR #604
```
