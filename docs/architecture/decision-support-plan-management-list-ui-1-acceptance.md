# SUPPORT-PLAN-MANAGEMENT-LIST-UI-1 — Human Acceptance（SELECT）

この文書は、**SUPPORT-PLAN-MANAGEMENT-LIST-UI-1** に対する
Human Visual Decision の Acceptance 正本である。

Packet:
[`decision-support-plan-management-list-ui-1-selection.md`](./decision-support-plan-management-list-ui-1-selection.md)

Depends on（再 Decision しない）:
[`decision-support-plan-lifecycle-semantics-selection.md`](./decision-support-plan-lifecycle-semantics-selection.md)
[`decision-shell-ux-7-navigation-destination-placeholders-selection.md`](./decision-shell-ux-7-navigation-destination-placeholders-selection.md)

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-SUPPORT-PLAN-MANAGEMENT-LIST-UI-1
Status: Accepted / LOCKED（Visual Decision boundary）
Human Decision: SELECT SUPPORT-PLAN-MANAGEMENT-LIST-UI-1
Human Acceptance date: 2026-08-19
Issue: #444
Baseline main: ea6ec1c1671041c87b9bb0222e1d23370aadb806

Selected:
  SUPPORT-PLAN-MANAGEMENT-LIST-UI-1 — Planning PC 支援計画一覧 Visual Decision

Implementation Start: NOT AUTHORIZED by this Acceptance alone
#444 Close: NOT AUTHORIZED
#70 reopen: NOT AUTHORIZED
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

## Human Acceptance（固定結論）

```text
Human Decision: SELECT SUPPORT-PLAN-MANAGEMENT-LIST-UI-1
Decision-SUPPORT-PLAN-MANAGEMENT-LIST-UI-1: Accepted / LOCKED

Meaning:
  lock list meaning for Planning PC 支援計画一覧
  要確認 / 見直し時期 / 観察待ち
  今日やること
  一覧1行の7要素
  状態と要対応の分離
  約3か月見直しの表現
  承認状態を制度要件として入れない
  Implementation Start is a separate Human GO
```

## Boundary

```text
SELECT SUPPORT-PLAN-MANAGEMENT-LIST-UI-1 ≠ Implementation Start
SELECT SUPPORT-PLAN-MANAGEMENT-LIST-UI-1 ≠ Demo Scope Freeze code mutation
SELECT SUPPORT-PLAN-MANAGEMENT-LIST-UI-1 ≠ #444 Close
SELECT SUPPORT-PLAN-MANAGEMENT-LIST-UI-1 ≠ #70 reopen
SELECT SUPPORT-PLAN-MANAGEMENT-LIST-UI-1 ≠ live SharePoint / REST / binder / adapter I/O
SELECT SUPPORT-PLAN-MANAGEMENT-LIST-UI-1 ≠ Deploy
SELECT SUPPORT-PLAN-MANAGEMENT-LIST-UI-1 ≠ 90-day auto-expiry
SELECT SUPPORT-PLAN-MANAGEMENT-LIST-UI-1 ≠ 承認済み as statutory requirement
```

## Stop / HOLD

```text
Do not start implementation without IMPLEMENTATION START GO
Do not Ready / Merge automatically
Do not Close #444
Do not reopen #70
Do not enable live I/O
```
