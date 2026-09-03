# SBS-MGMT-LOOP-B — Understanding Test Matrix v1 application

```text
repository: yasutakesougo/severe-behavior-support-spfx
unit: SBS-MGMT-LOOP-B (#553)
kind: understanding test matrix application / gate evidence
matrix: Understanding Test Matrix v1
authority: docs/architecture/understanding-test-matrix-version-management-v1.md
product basis HEAD (PR #576): 633a5b461eabe49902e92486670272f6ac9231bc
status: C1-C3 Test Matrix = DEFINED
5 Persona Simulation: PASS WITH MINOR FRICTION（SIMULATION EVIDENCE ONLY）
Actual Staff Value Check: REQUIRED / NOT YET
Human Ready GO consumption: NOT AUTHORIZED BY THIS DOC
Ready / Merge / Deploy / LIVE WRITE: NOT AUTHORIZED
Mutation: 0
```

## 1. Gate position

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

```text
Simulation PASS != Actual Staff Value Check PASS
Matrix DEFINED != Staff Value PASS
Matrix DEFINED != Human Ready Authority
```

## 2. Surface under test（PR #576 exact HEAD）

観測面（synthetic / session-only Planning-PC）:

| Moment | Observed copy / control |
|---|---|
| Pre-CTA | 「計画は上書きせず、版を重ねます」「現行の適用中版は残します」「作成・保存は接続されていません」 |
| Primary CTA | 「変更内容の作成を始める」（`data-sbs-mgmt-loop-b-action=start-revision`） |
| Predecessor | 「次の版を作る（表示専用）」 disabled |
| Boundary | 「本番には保存されていません」 |
| Post-draft | 「変更内容の下書き: 版 4」「元の版: 3（変更しない）」「状態: 下書き / 本番未保存」 |
| Active retained | 現行タブ「版 3 · 現行版」のまま |

明示語が弱い点（採点上の注意）:

```text
「まだ適用開始していない」相当の Draft 行明示 = 弱い / 推論依存
→ C2-4b を C2-4a と分けて採点する根拠
```

## 3. Matrix checklist（observer）

採点規則の正本は
[`understanding-test-matrix-version-management-v1.md`](./understanding-test-matrix-version-management-v1.md)。

| Test ID | Axis | Result | Severity | Moment of friction | Notes |
|---|---|---|---|---|---|
| C1-1 | C1-PRE | | | | CTA 語だけの予測 |
| C1-2 | C1-PRE | | | | 操作前コピーでの安心 |
| C1-3 | C1-POST | | | | 「元の版: N（変更しない）」 |
| C1-4 | C1-POST | | | | 現行タブが N のまま |
| C2-1 | C2 | | | | 下書き識別 |
| C2-2 | C2 | | | | 消失不安 ≠ 本番保存誤認 |
| C2-3 | C2 | | | | Draft ≠ 現在の適用版 |
| C2-4a | C2 | | | | Draft ≠ 本番保存 |
| C2-4b | C2 | | | | Draft ≠ 適用開始 |
| C3-1 | C3 | | | | 版一覧の追跡 |
| C3-2 | C3 | | | | 現行版の特定 |
| C3-3 | C3 | | | | N+1 が N を上書きした誤認 |
| C3-4 | C3 | | | | N+1 が適用中という誤認 |

Evidence 各行に Persona / Psychological state を添える（5 Persona または Staff 1）。

## 4. Simulation-derived expected pattern（非 Staff 結果）

5 Persona Simulation（PASS WITH MINOR FRICTION）から導いた、本画面の**予測パターン**。Staff 採点を先取り確定しない。

```text
Evidence Type = SIMULATION-DERIVED EXPECTATION ONLY
!= Actual Staff Value Check result
```

| Pattern | Expected shape | Finding 化 |
|---|---|---|
| C1 PRE vs POST | C1-2 = PARTIAL, C1-3 = YES が出やすい | 操作後は安全と分かるが、押す前の不安が残る → P2 |
| C2 save vs apply | C2-4a = YES, C2-4b = PARTIAL が出やすい | 本番未保存は明確、未適用の明示だけ弱い → P2 |
| C2-2 | 「消えるのでは？」不安があっても即 NO にしない | PARTIAL / UI_FRICTION |
| C3 | 一覧の軽い混乱は P2。現行特定不能・上書き・適用中誤認のみ P1 | Severity discipline |

既知の Simulation P2（Matrix 外 / 導線）:

- readback「支援内容を見直す」↔ CTA「変更内容の作成を始める」語対応
- disabled predecessor 並置による探索コスト
- 説明量 / 適用未開始の明示不足

## 5. Actual Staff Value Check への受け渡し

正本セッション票:
[`sbs-mgmt-loop-b-actual-staff-value-check.md`](./sbs-mgmt-loop-b-actual-staff-value-check.md)

職員には 4 問のみ。C1〜C3 は observer が裏採点する。

## 6. Boundaries

```text
C1-C3 Test Matrix = DEFINED
Actual Staff Value Check = REQUIRED
Human Ready GO consumption = NOT BY THIS DOC
Ready / Merge / Deploy / LIVE WRITE = NOT AUTHORIZED
SharePoint / M365 / Entra mutation = NOT AUTHORIZED
source SupportPlanVersion N mutation = NOT AUTHORIZED
```
