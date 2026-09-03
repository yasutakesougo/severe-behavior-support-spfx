# SBS-MGMT-LOOP-B — Actual Staff Value Check

```text
repository: yasutakesougo/severe-behavior-support-spfx
unit: SBS-MGMT-LOOP-B (#553)
kind: actual staff value check packet + C1-C3 observer scoring
product basis HEAD (PR #576): 633a5b461eabe49902e92486670272f6ac9231bc
matrix: Understanding Test Matrix v1
matrix application: docs/architecture/sbs-mgmt-loop-b-understanding-test-matrix-v1.md
date: 2026-09-03
Human Ready GO: NOT CONSUMED / NOT ELIGIBLE UNTIL STAFF RESULT
Simulation substitute: FORBIDDEN
```

## Status

```text
5 Persona Simulation = PASS WITH MINOR FRICTION（SIMULATION EVIDENCE ONLY）
C1-C3 Test Matrix = DEFINED
Actual Staff Value Check = HOLD / REQUIRED
Human Ready GO consumption = NOT AUTHORIZED BY THIS PACKET
Ready / Merge / Deploy / LIVE WRITE = NOT AUTHORIZED
```

Agent / Simulation は実職員判断を代替しない。本 packet は Staff 1 セッションが揃うまでの gate 状態と採点手順を固定する。

## Process（不変）

```text
5 Persona Simulation
= PASS WITH MINOR FRICTION
C1-C3 Test Matrix
= DEFINED
↓ NEXT
Actual Staff Value Check
  + C1-C3 observer scoring
↓
PASS / ACCEPTABLE / HOLD
↓ PASS / ACCEPTABLE
Human Ready GO consumption
```

## Staff-facing questions（4 のみ）

職員本人には Matrix の 12+ 問を読み上げない。自然な 1 タスク操作のあと、次だけ尋ねる。

| # | Question | 裏取りする主 Test IDs |
|---|---|---|
| Q1 | 次に何をすればよいと思いますか？ | 次操作特定（導線）。Moment を記録 |
| Q2 | このボタンを押すと、今使っている計画はどうなると思いますか？ | C1-1 / C1-2（必要なら C1-3 / C1-4） |
| Q3 | 今使っている版と、新しくできた版について説明してください。 | C3-1〜C3-4、C1-POST |
| Q4 | 新しい版は、もう現場で使い始める状態ですか？ | C2-4a / C2-4b、C2-3 |

タスク例（合成 / session-only）:

```text
支援計画 → 対象利用者 → 見直し資料で「変更が必要」+ 理由
→ 「変更内容の作成を始める」
→ 元の版と下書き版の表示を確認
```

## Observer scoring sheet（C1〜C3）

採点規則:
[`understanding-test-matrix-version-management-v1.md`](./understanding-test-matrix-version-management-v1.md)

| Test ID | Result (YES/PARTIAL/NO) | Severity | Moment of friction |
|---|---|---|---|
| C1-1 | | | |
| C1-2 | | | |
| C1-3 | | | |
| C1-4 | | | |
| C2-1 | | | |
| C2-2 | | | |
| C2-3 | | | |
| C2-4a | | | |
| C2-4b | | | |
| C3-1 | | | |
| C3-2 | | | |
| C3-3 | | | |
| C3-4 | | | |

必須 Evidence fields:

```text
Persona = Staff 1
Psychological state = <1 sentence>
Test ID / Moment of friction / Result / Severity
```

### C2-2 / C2-4 / C3 Severity reminders

```text
「消えるのでは？」不安 → PARTIAL / UI_FRICTION（即 NO にしない）
「すでに本番保存」→ C2-4a NO / P1 候補
「適用開始された / 現場で使い始め」→ C2-4b NO / P1
現行版特定不能 → C3-2 NO / P1
N+1 が N を上書き → C3-3 NO / P1
版一覧の軽い混乱のみ → C3-1 NO or PARTIAL / P2 候補
```

## Staff session record template

```text
Actual Staff Value Check — Staff 1
basis HEAD = 633a5b461eabe49902e92486670272f6ac9231bc
matrix = Understanding Test Matrix v1

Psychological state:

Q1:
Q2:
Q3:
Q4:

その他気になった点:

Observer C1-C3:
C1-1:
C1-2:
C1-3:
C1-4:
C2-1:
C2-2:
C2-3:
C2-4a:
C2-4b:
C3-1:
C3-2:
C3-3:
C3-4:

Overall:
PASS | ACCEPTABLE | HOLD
```

## Overall judgment

```text
PASS
= 安全境界の重大誤解なし
  （現行上書き / Draft=適用開始 / 現行特定不能 がない）
  かつ次操作が特定できる

ACCEPTABLE
= 軽微な文言・探索摩擦（P2）はあるが、
  誤操作や lifecycle 誤認につながらない
  （例: C1-2 PARTIAL + C1-3 YES、C2-4b PARTIAL）

HOLD
= 現行版が直接変更されると思う
  または Draft 作成 = 適用開始 / 本番保存と思う
  または 現行版を特定できない
  または 次の操作が特定できない
```

## Gate

```text
C1-C3 Test Matrix @ Understanding Test Matrix v1 = DEFINED
Actual Staff Value Check = HOLD / REQUIRED（Staff 1 pending）
Human Ready GO = NOT CONSUMED / NOT ELIGIBLE
Human Merge GO = NOT RECEIVED
Deploy / LIVE WRITE = NOT AUTHORIZED
```
