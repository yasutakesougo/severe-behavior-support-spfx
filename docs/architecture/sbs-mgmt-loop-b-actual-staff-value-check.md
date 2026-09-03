# SBS-MGMT-LOOP-B — Actual Staff Value Check

```text
repository: yasutakesougo/severe-behavior-support-spfx
unit: SBS-MGMT-LOOP-B (#553)
kind: actual staff value check evidence + C1-C3 observer scoring
product basis HEAD (PR #576): 633a5b461eabe49902e92486670272f6ac9231bc
matrix: Understanding Test Matrix v1
correction: Correction-1（Test ID semantics frozen）
matrix application: docs/architecture/sbs-mgmt-loop-b-understanding-test-matrix-v1.md
fix scope: docs/architecture/sbs-mgmt-loop-b-staff-finding-fix-scope-1.md
date: 2026-09-03
Human Ready GO: RECEIVED / NOT CONSUMED / BLOCKED BY STAFF P1
Simulation substitute: FORBIDDEN
```

## Status

```text
5 Persona Simulation = PASS WITH MINOR FRICTION（SIMULATION EVIDENCE ONLY）
C1-C3 Test Matrix = DEFINED（Correction-1）
Actual Staff Value Check — Staff 1 = HOLD
P0 = 0
P1 >= 2
P2 = secondary
Human Ready GO consumption = BLOCKED
#576 Ready = NOT AUTHORIZED
Merge / Deploy / LIVE WRITE = NOT AUTHORIZED
mutation = 0
```

```text
Simulation Evidence < Actual Staff Evidence
ACCEPTABLE = NOT ESTABLISHED
```

## Process

```text
5 Persona Simulation
= PASS WITH MINOR FRICTION
C1-C3 Test Matrix
= DEFINED
↓
Actual Staff Value Check — Staff 1
= HOLD
↓ NEXT
Staff Finding Fix Scope
↓
Ponytail / Minimality Check
↓
Human Correction Implementation GO
↓
minimal UI correction
↓
Focused Verification
↓
Rendered Browser Acceptance
↓
Exact HEAD fixation
↓
Independent Implementation Re-Review
↓
Actual Staff Re-Check
```

## Staff-facing questions（4 のみ）

| # | Question | 裏取りする主 Test IDs |
|---|---|---|
| Q1 | 次に何をすればよいと思いますか？ | C1-1 / C1-2 |
| Q2 | このボタンを押すと、今使っている計画はどうなると思いますか？ | C1 PRE（C1-1 / C1-2）、必要なら C1-POST |
| Q3 | 今使っている版と、新しくできた版について説明してください。 | C3-1〜C3-4、C1-POST |
| Q4 | 新しい版は、もう現場で使い始める状態ですか？ | C2-4 / C2-4a / C2-4b、C2-1〜C2-3 |

## Staff 1 session record（CONFIRMED）

```text
Actual Staff Value Check — Staff 1
basis HEAD = 633a5b461eabe49902e92486670272f6ac9231bc
matrix = Understanding Test Matrix v1
correction = Correction-1
VERDICT = HOLD
```

### Q responses（observed）

| # | Staff 1 response（要約） | Observer note |
|---|---|---|
| Q1 | 「次の版を作る or 支援の目標、具体的な支援内容の確認」 | 正しい次操作を一意に特定できていない |
| Q2 | 「次の版をつくる or 計画操作の二つの選択肢」「新規計画と既存計画の作成編集？」 | 「変更内容の作成を始める」= 現行残置の別 Draft 作成、が未伝達。既存計画の編集？が残る |
| Q3 | 「過去の版でバージョン管理」 | 一般概念は理解。版3=現行残置 / 版4=別 Draft の関係は未説明 |
| Q4 | 「最新版を使ってる前提だと思う」 | Draft ≠ 適用開始 の誤解。決定的 P1 |

### Observer C1–C3 scoring

| Test ID | Result | Severity | Moment of friction / Finding |
|---|---|---|---|
| C1-1 | UNKNOWN / not decisive alone | — | Q1 でセクション到達は示唆されるが、次操作一意化には至らず |
| C1-2 | NO | P1 | 次操作が複数候補に分岐（「次の版を作る」/ 目標・支援内容確認） |
| C1-3 | UNKNOWN | — | Q3 で「元の版: 3（変更しない）」明示理解は未確認 |
| C1-4 | NO / unresolved via Q2–Q3 | P1 candidate | 現行残置 + 別 Draft 作成として説明されていない |
| C1 PRE | NO / unresolved | P1 candidate | Source Immutability 未成立（「既存計画の編集？」残存） |
| C2-1 | UNKNOWN | — | Draft ラベル単独の確認は弱い |
| C2-2 | UNKNOWN | — | 本番未保存の明示理解は Q4 で打ち消される |
| C2-3 | UNKNOWN | — | Q4 が適用中前提のため境界は未成立 |
| C2-4 | NO | P1 | Draft ≠ 本番保存 ≠ 適用開始 が分離されていない |
| C2-4a | UNKNOWN / not decisive | — | 「最新版を使っている」は適用側の誤認が主 |
| C2-4b | NO | P1 | 「最新版を使ってる前提」= Draft = 適用開始 |
| C3-1 | PARTIAL or NO | P1/P2 boundary | 現行3→次4 を説明できていない |
| C3-2 | NO | P1/P2 boundary | Draft4 / 元3 の対比未説明 |
| C3-3 | PARTIAL | P2 secondary | 「過去の版でバージョン管理」は一般概念止まり |
| C3-4 | NO | P1 | 「版3を残して版4 Draft」と説明できず、最新=適用中と理解 |

### Findings

| ID | Severity | 内容 | 根拠 |
|---|---|---|---|
| F-ASV-B-001 | P1 | 次操作が一意に定まらない | Q1 / C1-2 = NO |
| F-ASV-B-002 | P1 | Source Immutability 未成立（新規/既存の作成編集と解釈） | Q2 / C1 PRE = NO |
| F-ASV-B-003 | P1 | Draft 作成後の最新版を適用中版と理解 | Q4 / C2-4b = NO, C3-4 = NO |
| F-ASV-B-004 | P2 secondary | 版関係の一般理解のみで、3残置/4 Draft を説明できない | Q3 / C3-1..C3-4 |

```text
ACCEPTABLE 不可
理由: Q1・Q2・Q4 が探索摩擦ではなく安全境界・ライフサイクル理解の不足
```

## Simulation vs Actual Staff

| | Simulation（予測） | Actual Staff 1 |
|---|---|---|
| Verdict | PASS WITH MINOR FRICTION | HOLD |
| Next action | 少し迷うが到達 | 複数候補に分岐 / 一意化失敗 |
| Source immutability | 最終的に理解 | 新規/既存の作成編集？が残る |
| Draft ≠ 適用 | 推論で PARTIAL 想定 | 「最新版を使っている前提」= NO |

本質（Staff 1）:

```text
「版を作る」
「変更内容の作成を始める」
「計画操作 / 作成・編集・保存」
が職員視点で十分に分離されていない
```

## Overall judgment（適用）

```text
HOLD
= 次の操作が特定できない
  かつ / または 現行版が直接変更されると誤解しうる
  かつ / または Draft 作成 = 適用開始と理解
```

## Next

正本: [`sbs-mgmt-loop-b-staff-finding-fix-scope-1.md`](./sbs-mgmt-loop-b-staff-finding-fix-scope-1.md)

```text
Staff Finding Fix Scope
1. 次操作を一意化
2. 「現行版は変更しない」を CTA 直前で明確化
3. Draft 作成後に「まだ適用開始されていない」を明示
4. display-only / 計画操作との競合を最小限整理
↓
Ponytail / Minimality Check
↓
Human Correction Implementation GO
（新 workflow / 新 state / 新 component = まだ不要）
```

## Gate

```text
#576 = OPEN / DRAFT
Exact product HEAD = 633a5b461eabe49902e92486670272f6ac9231bc
Actual Staff Value Check — Staff 1 = HOLD
Human Ready GO = RECEIVED / NOT CONSUMED / BLOCKED BY STAFF P1
Ready / Merge / Deploy / LIVE WRITE = NOT AUTHORIZED
mutation = 0
```
