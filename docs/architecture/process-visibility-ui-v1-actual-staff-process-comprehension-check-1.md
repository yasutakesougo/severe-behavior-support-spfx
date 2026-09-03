# PROCESS-VISIBILITY-UI-V1 — Actual Staff Process-Comprehension Check Packet 1

```text
repository: yasutakesougo/severe-behavior-support-spfx
unit: PROCESS-VISIBILITY-UI-V1
kind: actual staff process-comprehension check packet
product binding HEAD: 0fba4e506842effd38dc4195be831b6dc86d7dc5
rba: PASS
independent implementation review: PASS / REVIEW-CLEARED
date: 2026-09-03
status: NOT YET / REQUIRED
Simulation substitute: FORBIDDEN
Human Ready GO: NOT ELIGIBLE UNTIL STAFF RESULT
```

## Probes（T1–T5）

| ID | Question | Expect |
|---|---|---|
| T1 | 今使っている計画はどれですか？ | ① / 版3・適用中 |
| T2 | 最近の支援とその結果はどこを見ますか？ | ② / ③ / ④ を区別 |
| T3 | なぜ見直す必要がありますか？ | ⑤ 判断理由 |
| T4 | 次に何をしますか？ | ⑥ 正しい CTA |
| T5 | 版4はもう現場で使っていますか？ | NO（版3適用中 / 版4下書き・未適用） |

Optional orientation（from Simulation 2; not required to block Ready if T1–T5 PASS）:

```text
T6 Process Orientation / T7 Nav≠Stepper / T8 Ownership
```

## Judgement

```text
PASS = 迷わずプロセス特定 + lifecycle 誤認なし
ACCEPTABLE = 少し探すがプロセスと安全境界は正しい
HOLD = 所属先誤認 or 次操作不能 or Draft=適用中
```

## Status

```text
Actual Staff Process-Comprehension Check = NOT YET
5 Persona Simulation 2 ≠ this check
Human Ready / Merge = NOT AUTHORIZED
```
