# SBS-PLANNER — Human PL-HTA Re-Run checklist (D-MONITOR STATE A / B)

```text
repository: yasutakesougo/severe-behavior-support-spfx
unit: SBS-PLANNER Human PL-HTA Re-Run
kind: Human visual judgment checklist + local harness
BOUND HEAD = 4647223e82d175e35748a5107bef6e322f316935
harness: spfx/smoke/sbs-planner-pl-hta-rerun-human/
local:
  http://127.0.0.1:4217/state-a
  http://127.0.0.1:4217/state-b
LIVE WRITE / Deploy / SharePoint: NOT AUTHORIZED
HARNESS READY ≠ PL-HTA PASS
```

## Checklist (sufficient)

### 共通確認

- 画面が actual **D-MONITOR** である
- person が **Aさん / `user-a`**
- support plan が **`synthetic-plan-001`**
- Organization / Site が **`synthetic-org-001` / `SITE-ISG`**
- 対象期間が **2026-08-01〜2026-08-31**
- review authority が **FOUND**
- HumanReview が **RESOLVED**
- D-PLAN 内の表示ではなく、D-MONITOR 本体で確認している
- 白画面やアプリ例外が出ていない

### STATE A — `/state-a`

- 計画版が **1**
- 期間件数が **0件**
- 「この期間・計画版に一致する実施記録はありません」と表示される
- **0件 ≠ 実施できなかった** と区別されている
- `NOT_PERFORMED` の実記録が表示されていない
- 「実施できなかった」という記録を0件状態から勝手に生成していない

### STATE B — `/state-b`

- 計画版が **2**
- 期間件数が **3件**
- `synthetic-monitoring-v2-003` が実在する記録として表示される
- その記録の結果が **`NOT_PERFORMED`**
- 画面上で **「実施できなかった」** と確認できる
- 0件状態と同じ表示に潰れていない

### 最終Human判定

- STATE A が期待どおり → `PASS`
- STATE B が期待どおり → `PASS`
- 両方PASS → `PL-HTA RESULT = PASS` を人間が記録可能
- どちらか不一致・確認不能 → `FAIL` または `UNRESOLVED / NOT CONFIRMED`
- `HARNESS READY` や technical check の成功だけでは `PL-HTA PASS` にしない

## Result form

```text
HUMAN PL-HTA RE-RUN RESULT

BOUND HEAD =
4647223e82d175e35748a5107bef6e322f316935

STATE A = PASS / FAIL / UNRESOLVED
STATE B = PASS / FAIL / UNRESOLVED

PL-HTA RESULT = PASS / FAIL / UNRESOLVED
Human Acceptance = ACCEPTED / NOT ACCEPTED / UNRESOLVED

Reviewer = HUMAN
```

## Harness start

```bash
git checkout 4647223e82d175e35748a5107bef6e322f316935
cd spfx
node smoke/sbs-planner-pl-hta-rerun-human/serve-smoke.mjs
```
