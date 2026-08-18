# PRODUCTION-FIELD-STAFF-ACCEPTANCE-1

この文書は **FIELD_STAFF 本番ホスト受入** の repository SSOT である。
Full Application Acceptance へ昇格しない。UI 実装 GO ではない。

```text
repository: yasutakesougo/severe-behavior-support-spfx
Unit: PRODUCTION-FIELD-STAFF-ACCEPTANCE-1
Kind: FIELD_STAFF-only production-host acceptance against current Artifact A
Status: ACCEPT — FIELD_STAFF CURRENT ARTIFACT SCOPE
authoritative main: ba573ee9b04d780aae36acf31f67427d49ddb90c
Host: SitePages/Home.aspx
Bound Artifact: Artifact A
Authority: UI INTERACTION / FIXTURE ONLY
LIVE WRITE: HOLD
Production data write: NOT AUTHORIZED
This closeout: != Full Application Acceptance
This closeout: != UX Implementation GO
This closeout: != Redeploy GO
This closeout: != LIVE WRITE GO
```

Live gate（Ready / Merge 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

## 1. Frozen upstream

```text
PRODUCTION-APPLICATION-ACCEPTANCE-1:
HOLD WITH GAP

Reason:
production host cannot evaluate PLANNER / ADMIN_AUDIT

Synthetic role switch on production host:
NOT ADDED
```

本番ホストは [`ScaffoldShellWebPart.ts`](../../spfx/src/webparts/scaffoldShellWebPart/ScaffoldShellWebPart.ts) が `SHELL_UX_DEFAULT_FIXTURE` のみを渡す。`presentationRole` は未配線で、実行時は FIELD_STAFF 固定である。これは認可機構ではない。受入試験のためだけに本番へロール切替を足していない。

## 2. Observable production scope (Artifact A)

Code facts, not inferred defects:

```text
Users list:
8 synthetic users

ProcedureRecord reachable:
A only
```

- User list: [`DEMO_UX_USERS_FIXTURE`](../../spfx/src/shell/users/users-fixture.ts) **8** synthetic users
- User Detail preview: `user-a` / `user-c`
- ProcedureRecord reachable: [`FIELD_WORKFLOW_PROCEDURE_FIXTURE.currentByUserId`](../../spfx/src/shell/procedure/procedure-fixture.ts) is **`user-a` only**

```text
4 / 6 / 18 user production-host PASS/FAIL:
NOT CLAIMED

Reason:
Artifact A fixture coverage is insufficient.
```

Do not infer PASS, FAIL, scalability success, or production defect from the production-host fixture. This is **FIXTURE / ACCEPTANCE COVERAGE LIMITATION**.

Do not convert this result into **FULL APPLICATION ACCEPTANCE**.

## 3. Production-host evidence

| Check | Result |
|---|---|
| fail-closed unselected | PASS |
| site selection SITE-ISG | PASS |
| FIELD_STAFF Overview | PASS |
| Users list | PASS |
| User Detail A / C | PASS |
| Current Procedure A | PASS |
| ProcedureRecord A | PASS |
| Records | PASS |
| Support Plan read | PASS |
| Review / Monitoring read | PASS |
| save-state under LIVE WRITE HOLD | PASS（未保存 → 保存中 → 保存失敗。draft retained within observed flow） |
| return navigation | PASS |
| responsive 768px | PASS |
| keyboard within observed scope | PASS |
| unexpected write | NONE OBSERVED |

```text
PRODUCTION-FIELD-STAFF-ACCEPTANCE-1:
ACCEPT — FIELD_STAFF CURRENT ARTIFACT SCOPE

LIVE WRITE:
HOLD

Production data write:
NOT AUTHORIZED
```

C は User Detail まで到達し、Current Procedure / Support Plan / ProcedureRecord は disabled。これは fixture coverage であり、このゲートの HOLD 理由ではない。

## 4. Multi-user scale separation

```text
MULTI-USER SCALE ACCEPTANCE:
NOT EVALUATED ON PRODUCTION HOST

4 / 6 / 18 user production-host inference:
FORBIDDEN
```

複数人連続記録の評価は別文書
[`field-staff-multi-user-ux-simulation-1.md`](./field-staff-multi-user-ux-simulation-1.md)
（browser / synthetic harness）。本番受入と意味を混ぜない。

## 5. Forbidden (this unit)

- UI implementation
- production fixture modification
- synthetic role switch on production host
- Artifact A replacement / redeploy
- page edit / default-page change / canvas title change
- LIVE WRITE enable
- SharePoint production data write
- Graph / Entra mutation

## 6. Next gate

```text
Next gate: FIELD-STAFF-MULTI-USER-UX-POLISH-1
Status: IMPLEMENTATION COMPLETE / ACCEPT / PASS
SSOT: field-staff-multi-user-ux-polish-1.md
Human confirmation: Human Acceptance GO 2026-08-18
authoritative implementation main:
  acaae9d3ac0bb261a9dee42590138fdba04805c0
closeout merge:
  8a060213bd0291fea9ecd305f36087b8d23acdbb
Implementation in this predecessor closeout: NO
Unit 7: NOT STARTED
Human-selected next slice: FIELD-STAFF-NEXT-UNRECORDED-USER-1
Selection: B / UX-P1-3
Selection SSOT:
  decision-field-staff-ux-p1-3-next-unrecorded-user-selection.md
Implementation Start: recorded separately
Start SSOT:
  field-staff-next-unrecorded-user-1-implementation-start.md
This predecessor closeout: != Implementation Start
```
