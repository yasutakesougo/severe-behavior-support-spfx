# SBS-MGMT-LOOP-B — Actual Staff Value Check

```text
repository: yasutakesougo/severe-behavior-support-spfx
unit: SBS-MGMT-LOOP-B (#553)
kind: actual staff value check packet + C1-C3 observer scoring
product basis HEAD (PR #576): 633a5b461eabe49902e92486670272f6ac9231bc
matrix: Understanding Test Matrix v1
correction: Correction-1（Test ID semantics frozen）
matrix application: docs/architecture/sbs-mgmt-loop-b-understanding-test-matrix-v1.md
date: 2026-09-03
Human Ready GO: NOT CONSUMED / NOT ELIGIBLE UNTIL STAFF RESULT
Simulation substitute: FORBIDDEN
```

## Status

```text
5 Persona Simulation = PASS WITH MINOR FRICTION（SIMULATION EVIDENCE ONLY）
C1-C3 Test Matrix = DEFINED（Correction-1）
Actual Staff Value Check = HOLD / REQUIRED
Human Ready GO consumption = NOT AUTHORIZED BY THIS PACKET
Ready / Merge / Deploy / LIVE WRITE = NOT AUTHORIZED
#576 Human Ready GO = separate gate / not consumed
```

Agent / Simulation は実職員判断を代替しない。本 packet は Staff 1 セッションが揃うまでの gate 状態と採点手順を固定する。

## Process（不変）

```text
5 Persona Simulation
= PASS WITH MINOR FRICTION
C1-C3 Test Matrix
= DEFINED（Correction-1）
↓ NEXT
Actual Staff Value Check
  + C1-C3 observer scoring
↓
PASS / ACCEPTABLE / HOLD
↓ PASS / ACCEPTABLE
Human Ready GO consumption
```

## Staff-facing questions（4 のみ）

職員本人には Matrix の全項目を読み上げない。自然な 1 タスク操作のあと、次だけ尋ねる。

| # | Question | 裏取りする主 Test IDs |
|---|---|---|
| Q1 | 次に何をすればよいと思いますか？ | C1-1 / C1-2（導線）。Moment を記録 |
| Q2 | このボタンを押すと、今使っている計画はどうなると思いますか？ | C1-1 / C1-2、必要なら C1-3 / C1-4 |
| Q3 | 今使っている版と、新しくできた版について説明してください。 | C3-1〜C3-4、C1-3 / C1-4 |
| Q4 | 新しい版は、もう現場で使い始める状態ですか？ | C2-4 / C2-4a / C2-4b、C2-1〜C2-3 |

タスク例（合成 / session-only）:

```text
支援計画 → 対象利用者 → 見直し資料で「変更が必要」+ 理由
→ 「次の版の考え方」
→ 「変更内容の作成を始める」
→ 元の版と下書き版の表示を確認
```

## Observer scoring sheet（C1〜C3）

採点規則:
[`understanding-test-matrix-version-management-v1.md`](./understanding-test-matrix-version-management-v1.md)

| Test ID | Agreed probe (FROZEN) | Result | Severity | Moment of friction |
|---|---|---|---|---|
| C1-1 | 「次の版の考え方」セクションを読む | | | |
| C1-2 | 「変更内容の作成を始める」ボタン認識 | | | |
| C1-3 | 「元の版: 3（変更しない）」 | | | |
| C1-4 | 押下後、版3を残して Draft 別作成 | | | |
| C2-1 | 「変更内容の下書き: 版 4」認識 | | | |
| C2-2 | 「状態: 下書き / 本番未保存」理解 | | | |
| C2-3 | 「本番には保存されていません」境界 | | | |
| C2-4 | Draft ≠ 本番保存 ≠ 適用開始（親） | | | |
| C2-4a | Draft ≠ 本番保存 | | | |
| C2-4b | Draft ≠ 適用開始 | | | |
| C3-1 | 現行3 → 次4 | | | |
| C3-2 | Draft4 / 元3 | | | |
| C3-3 | 過去版一覧 | | | |
| C3-4 | 「版3を残して版4 Draft」と説明 | | | |

必須 Evidence fields:

```text
Persona = Staff 1
Psychological state = <1 sentence>
Test ID / Moment of friction / Result / Severity
```

### Judgement / Severity reminders（Correction-1）

```text
「消えるのでは？」不安 → C2-2 PARTIAL / UI_FRICTION（即 NO にしない）
「すでに本番保存」→ C2-4a NO / P1 候補
「適用開始された / 現場で使い始め」→ C2-4b NO / P1
過去版一覧の軽い混乱 → C3-3 / P2 候補
現行3→次4 を追えない → C3-1 NO / P1 候補
Draft4/元3 を対比できない → C3-2 NO / P1 候補
版3残して版4 Draft と説明できない（上書き・適用済み）→ C3-4 NO / P1
```

## Staff session record template

```text
Actual Staff Value Check — Staff 1
basis HEAD = 633a5b461eabe49902e92486670272f6ac9231bc
matrix = Understanding Test Matrix v1
correction = Correction-1

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
C2-4:
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
  （例: C1-2 PARTIAL + C1-3 YES、C2-4b PARTIAL、C3-3 PARTIAL）

HOLD
= 現行版が直接変更されると思う
  または Draft 作成 = 適用開始 / 本番保存と思う
  または 現行版を特定できない
  または 次の操作が特定できない
```

## Gate

```text
C1-C3 Test Matrix @ Understanding Test Matrix v1 = DEFINED（Correction-1）
Actual Staff Value Check = HOLD / REQUIRED（Staff 1 pending）
Human Definition/Docs Adoption = HOLD（Independent Docs Re-Review-1 待ち）
Human Ready GO = NOT CONSUMED / NOT ELIGIBLE
Human Merge GO = NOT RECEIVED
Deploy / LIVE WRITE = NOT AUTHORIZED
mutation = 0
```
