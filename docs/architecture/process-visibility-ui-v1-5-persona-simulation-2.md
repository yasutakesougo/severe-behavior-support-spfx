# PROCESS-VISIBILITY-UI-V1 — 5 Persona Simulation 2

```text
repository: yasutakesougo/severe-behavior-support-spfx
unit: PROCESS-VISIBILITY-UI-V1
kind: 5 Persona Process-Comprehension Simulation 2
target: Prototype Correction-1（IA change verification）
html: docs/architecture/process-visibility-ui-v1-presentation-prototype-1.html
correction: docs/architecture/process-visibility-ui-v1-presentation-prototype-correction-1.md
basis HEAD（PR #580 at run）: 5e0bedbbf488cae630615d16c999531198065c60
date: 2026-09-03
mode: READ-ONLY / presentation prototype only
product mutation: 0
verdict: PASS WITH MINOR FRICTION（SIMULATION EVIDENCE ONLY）
P0 = 0
P1 = 0
P2 = 3（non-blocking）
Human Definition Lock: CONSUMED（Human message 2026-09-03）
Human Visual Acceptance: CONSUMED（Human message 2026-09-03）
#576 Actual Staff Re-Check: NOT SUBSTITUTED / STILL REQUIRED
Implementation Start: NOT AUTHORIZED
```

## 1. Why Simulation 2 exists

Correction-1 is an **information architecture** change, not copy-only:

```text
旧: 情報カテゴリを縦に探す
新: ①計画 → ②支援 → ③記録 → ④モニタリング → ⑤見直し → ⑥次版準備
```

```text
#580 Simulation 2
= 新しい6工程UIの理解しやすさ（Process-Comprehension）

#576 Actual Staff Re-Check
= 版3 / Draft4 / 未適用の安全境界（実職員）

Simulation 2 != #576 Staff Re-Check substitute
Simulation 2 != Implementation Start
Simulation 2 != post-impl Actual Staff Process-Comprehension Check
```

## 2. Probe set

### Core（Definition T1–T5）

| ID | Question | Expect |
|---|---|---|
| T1 | 今使っている計画はどれか | ①計画 → 版3・適用中 |
| T2 | 最近の支援と結果はどこか | ②支援 / ③記録 / ④モニタリング を区別 |
| T3 | なぜ見直す必要があるか | ⑤見直し → 判断理由 |
| T4 | 次に何をするか | ⑥次版準備 → 正しい CTA |
| T5 | 版4はもう使われているか | NO → 版3適用中 / 版4下書き・未適用 |

### IA add-ons（Simulation 2）

| ID | Question | Expect |
|---|---|---|
| T6 Process Orientation | この画面は何の順番で並んでいるか | 支援サイクル 計画→…→次版準備 |
| T7 Navigation Semantics | ①〜⑥は「①が終わって②に進む進捗表」か | **NO** — ページ内の情報分類・移動 |
| T8 Information Ownership | 判断理由 / 最近の記録 / 現在の支援内容はどこか | ⑤ / ③ / ② |

### Severity rule（this packet）

```text
P1:
  版4を適用中と思う
  現行版を特定できない
  次操作を特定できない
  ①〜⑥を業務状態進捗と誤解し操作判断を誤る

P2:
  ③記録と④モニタリングを少し迷う
  ⑤見直しを少し探す
  6工程の意味を一度読み直す
  履歴・詳細まで少しスクロールする

P0=0 / P1=0 / P2あり → PASS WITH MINOR FRICTION
P1あり → CORRECTION REQUIRED
```

## 3. Personas

| Persona | Focus |
|---|---|
| A 新人 | ①〜⑥だけで意味を推測できるか |
| B ベテラン | 目的情報へ早く到達できるか |
| C 管理責任者 | 版3/版4/適用状態を誤認しないか |
| D 引継ぎ職員 | 前提知識なしで⑤の理由まで辿れるか |
| E IT不慣れ | ナビを進捗表や操作ボタンと誤解しないか |

Walkthrough basis: Correction-1 Desktop 1280 + Mobile 390 captures / HTML（synthetic）. No SharePoint. No LIVE WRITE.

## 4. Scoring matrix

Legend: YES = expect met; PARTIAL = expect met after brief re-read / scroll（P2 only）; NO = fail（P1 candidate）.

| Persona | T1 | T2 | T3 | T4 | T5 | T6 | T7（expect NO） | T8 | Notes |
|---|---|---|---|---|---|---|---|---|---|
| A 新人 | YES | YES | YES | YES | YES | YES | NO（correct） | YES | 番号を一度読み直し（P2） |
| B ベテラン | YES | YES | YES | YES | YES | YES | NO | YES | nav jump で高速到達 |
| C 管理責任者 | YES | YES | YES | YES | YES | YES | NO | YES | ⑥の適用中/未適用近接で T5 安定 |
| D 引継ぎ職員 | YES | YES | YES | YES | YES | YES | NO | YES | ⑤を一度探す（P2） |
| E IT不慣れ | YES | PARTIAL | YES | YES | YES | YES | NO after hint | YES | 初見で進捗表に見えかけ→hintで訂正（P2）。操作誤判断なし |

### T7 detail（critical）

All five personas **do not treat ①〜⑥ as a progress Stepper after reading the visible hint**:

```text
選択中 = いま見ているセクション位置
（完了 / 現在工程 / 未完了は表示しません）
```

Persona E initially glances at numbering as “step 1…”, then corrects via hint + absence of 完了/未完了 badges. No wrong next-action chosen → **not P1**.

### T5 / lifecycle（must not fake #576 Staff Check）

Simulation sees prototype placeholders only:

```text
現在適用中：版 3
版 4：まだ適用開始されていない
CTA in ⑥
```

All personas answer T5 = NO（not in field use）. This remains **simulation evidence**; #576 Actual Staff Re-Check on product HEAD `4eab190` is still required.

## 5. Aggregate verdict

```text
P0 = 0
P1 = 0
P2 = 3
```

| ID | Severity | Content | Disposition |
|---|---|---|---|
| S2-PV-001 | P2 | A: 6工程ラベルを一度読み直す | Accept for V1; labels already explicit ①〜⑥ |
| S2-PV-002 | P2 | D: ⑤見直しを一度探す | Accept; Process nav + heading restore ⑤ |
| S2-PV-003 | P2 | E: 初見で進捗表に見えかけ → hintで訂正；T2で③/④を一瞬迷う | Keep no-Stepper hint in Scope/impl; Header weight for ③≠④ |

```text
PASS WITH MINOR FRICTION
= IA 転換（探す → 辿る）は Simulation 上成立
= Stepper 誤認は P1 まで悪化せず
= Draft≠適用 は prototype 上誤認なし
≠ #576 Actual Staff Re-Check PASS
≠ Implementation Start
≠ post-impl Actual Staff Process-Comprehension Check
```

## 6. Separation freeze

| Track | Artifact | Purpose |
|---|---|---|
| #580 | This Simulation 2 | Process-Comprehension of 6-process IA |
| #576 | Actual Staff Re-Check @ `4eab190` | Lifecycle safety boundary on product |
| Later V1 impl | Actual Staff Process-Comprehension Check T1–T5（+T6–T8 optional） | Post-implementation staff evidence |

## 7. Gate NEXT

```text
Simulation 2 = PASS WITH MINOR FRICTION
↓
WAIT #576
  Actual Staff Re-Check → PASS|ACCEPTABLE
  → Human Ready GO consumption
  → Human Merge GO
  → post-merge fixation
↓
PROCESS-VISIBILITY-UI-V1 Human Implementation Start GO
↓
実装 → RBA → Actual Staff Process-Comprehension Check
```

```text
further design mutation = STOP（unless Human orders Correction）
product mutation = 0
```
