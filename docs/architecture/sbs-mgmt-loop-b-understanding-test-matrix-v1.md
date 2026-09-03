# SBS-MGMT-LOOP-B — Understanding Test Matrix v1 application

```text
repository: yasutakesougo/severe-behavior-support-spfx
unit: SBS-MGMT-LOOP-B (#553)
kind: understanding test matrix application / gate evidence
matrix: Understanding Test Matrix v1
correction: Correction-1（Test ID semantics frozen）
authority: docs/architecture/understanding-test-matrix-version-management-v1.md
product basis HEAD (PR #576): 633a5b461eabe49902e92486670272f6ac9231bc
status: C1-C3 Test Matrix = DEFINED（Correction-1）
5 Persona Simulation: PASS WITH MINOR FRICTION（SIMULATION EVIDENCE ONLY）
Actual Staff Value Check — Staff 1: HOLD（P1 >= 2）
Human Ready GO consumption: BLOCKED BY STAFF P1
Ready / Merge / Deploy / LIVE WRITE: NOT AUTHORIZED
Mutation: 0
```

## 1. Gate position

```text
5 Persona Simulation
= PASS WITH MINOR FRICTION
C1-C3 Test Matrix
= DEFINED（Correction-1）
↓
Actual Staff Value Check — Staff 1
= HOLD
↓
Staff Finding Fix Scope = DEFINED
↓
Ponytail / Minimality Check = PONYTAIL PASS
↓ NEXT
Human Correction Implementation GO
（Ready / GO consumption = BLOCKED）
（GO なし → UI mutation = 0）
```

```text
Simulation Evidence < Actual Staff Evidence
Simulation PASS != Actual Staff Value Check PASS
Matrix DEFINED != Staff Value PASS
#576 Human Ready GO = RECEIVED / NOT CONSUMED / BLOCKED BY STAFF P1
```

Staff 1 証跡:
[`sbs-mgmt-loop-b-actual-staff-value-check.md`](./sbs-mgmt-loop-b-actual-staff-value-check.md)

Fix Scope:
[`sbs-mgmt-loop-b-staff-finding-fix-scope-1.md`](./sbs-mgmt-loop-b-staff-finding-fix-scope-1.md)

## 2. Correction-1 binding

```text
C1-1〜C1-4 / C2-1〜C2-3 / C2-4 / C3-1〜C3-4
= FROZEN to agreed probe semantics

C1-PRE / C1-POST = grouping only
C2-4a / C2-4b = sub-IDs of C2-4

Do not compare Evidence across silent remaps.
Use Understanding Test Matrix v1 + Correction-1 only.
```

## 3. Surface under test（PR #576 exact HEAD）

| Moment | Observed copy / control | Primary Test IDs |
|---|---|---|
| Section | 「次の版の考え方」 | C1-1 |
| Primary CTA | 「変更内容の作成を始める」 | C1-2 |
| Predecessor | 「次の版を作る（表示専用）」 disabled | (導線摩擦; C1-2 Moment) |
| Boundary | 「本番には保存されていません」 | C2-3 |
| Post-draft | 「変更内容の下書き: 版 4」 | C2-1 |
| Post-draft | 「元の版: 3（変更しない）」 | C1-3 |
| Post-draft | 「状態: 下書き / 本番未保存」 | C2-2 |
| Post-draft | 版3残置 + Draft 別作成 | C1-4 |
| Relation | 現行3 → 次4 / Draft4・元3 | C3-1 / C3-2 |
| History | 過去版一覧 | C3-3 |
| Explain | 「版3を残して版4 Draft」 | C3-4 |
| Separation | Draft ≠ 本番保存 ≠ 適用開始 | C2-4 / C2-4a / C2-4b |

明示が弱い点:

```text
「まだ適用開始していない」相当の Draft 行明示 = 弱い / 推論依存
→ C2-4b を C2-4a と分けて採点する根拠
（C2-4 親 ID は残す）
```

## 4. Matrix checklist（observer）

採点規則の正本は
[`understanding-test-matrix-version-management-v1.md`](./understanding-test-matrix-version-management-v1.md)。

| Test ID | Grouping | Result | Severity | Moment of friction | Notes |
|---|---|---|---|---|---|
| C1-1 | C1-PRE | | | | 「次の版の考え方」 |
| C1-2 | C1-PRE | | | | 「変更内容の作成を始める」 |
| C1-3 | C1-POST | | | | 「元の版: 3（変更しない）」 |
| C1-4 | C1-POST | | | | 版3残置 + Draft 別作成 |
| C2-1 | C2 | | | | 「変更内容の下書き: 版 4」 |
| C2-2 | C2 | | | | 「状態: 下書き / 本番未保存」 |
| C2-3 | C2 | | | | 「本番には保存されていません」 |
| C2-4 | C2 | | | | 親: ≠保存 ≠適用 |
| C2-4a | C2-4 sub | | | | Draft ≠ 本番保存 |
| C2-4b | C2-4 sub | | | | Draft ≠ 適用開始 |
| C3-1 | C3 | | | | 現行3 → 次4 |
| C3-2 | C3 | | | | Draft4 / 元3 |
| C3-3 | C3 | | | | 過去版一覧 |
| C3-4 | C3 | | | | 「版3を残して版4 Draft」説明 |

Evidence 各行に Persona / Psychological state を添える（5 Persona または Staff 1）。

## 5. Simulation vs Actual Staff（Evidence priority）

```text
Evidence Type (Simulation) = SIMULATION-DERIVED EXPECTATION ONLY
Evidence Type (Staff 1) = ACTUAL STAFF VALUE EVIDENCE / HOLD
Simulation Evidence < Actual Staff Evidence
```

Simulation 予測は P2 寄りだったが、Staff 1 では安全境界 P1 が出た。

| Pattern | Simulation 予測 | Staff 1 実測 |
|---|---|---|
| C1-2 | PARTIAL | NO（P1）— 次操作が複数候補 |
| C1 PRE | PARTIAL→理解 | NO — 新規/既存の作成編集？ |
| C2-4b | PARTIAL | NO（P1）— 最新版を使っている前提 |
| C3-4 | YES 寄り | NO（P1）— 版3残置/版4 Draft 未説明 |

既知の Simulation P2（導線）は secondary。Staff P1 を優先して Fix Scope へ渡す。

## 6. Actual Staff Value Check / Fix Scope

- Staff 1 HOLD 証跡: [`sbs-mgmt-loop-b-actual-staff-value-check.md`](./sbs-mgmt-loop-b-actual-staff-value-check.md)
- Fix Scope: [`sbs-mgmt-loop-b-staff-finding-fix-scope-1.md`](./sbs-mgmt-loop-b-staff-finding-fix-scope-1.md)

## 7. Boundaries

```text
C1-C3 Test Matrix = DEFINED（Correction-1）
Actual Staff Value Check — Staff 1 = HOLD
Human Ready GO consumption = BLOCKED BY STAFF P1
Ready / Merge / Deploy / LIVE WRITE = NOT AUTHORIZED
SharePoint / M365 / Entra mutation = NOT AUTHORIZED
source SupportPlanVersion N mutation = NOT AUTHORIZED
Human Correction Implementation GO = REQUIRED BEFORE UI FIX
mutation = 0
```