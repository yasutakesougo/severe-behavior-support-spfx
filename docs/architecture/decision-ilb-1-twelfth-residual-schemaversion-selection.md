# Decision-ILB-1 — Twelfth residual Decision selection: schemaVersion / dtoVersion

```text
repository: yasutakesougo/severe-behavior-support-spfx
baseline main: 3e3526e3ffe784686607487622e13010671375ad
Decision kind: residual substantive-unit selection only
Selected: A — schemaVersion / dtoVersion
Status: SELECTED / NOT IMPLEMENTATION START
Human Selection: Explicit A on 2026-08-09
```

## Selected scope

```text
Twelfth residual Decision:
  SELECTED — A / schemaVersion / dtoVersion

Meaning:
  次に扱う substantive unit を AssessmentSnapshot の
  schemaVersion / dtoVersion 判断単位とする。
  本記録は選定のみであり、具体値の採択・実装を決めない。
```

## Explicit non-authorization

```text
schemaVersion concrete value: HOLD / NOT DECIDED
dtoVersion concrete value: HOLD / NOT DECIDED
  （DEC-1: dtoVersion = Schema Version 方針のみ既存 LOCKED）
Implementation Start: HOLD
Schema / DTO / SharePoint / adapter: HOLD
Schema ID assignment into code / DTO / SharePoint: HOLD / NOT STARTED
application save: HOLD
FindingCode: HOLD
A-5: HOLD
Deploy / real data: NO-GO
value invention of schemaVersion / dtoVersion: FORBIDDEN until next explicit Human Decision
```

本 Selection から Implementation Start を導出しない。
本 Selection から schemaVersion / dtoVersion 具体値を導出しない。

## Prior state preserved

- Decision-AS-SCHEMA-ID-1 Accepted / LOCKED on main（PR #171）:
  Naming rule = NR-1
  Schema ID = `severe-behavior-support.assessment-snapshot.snapshot`
- DEC-1 / Entry #7: Schema Version = SemVer；DTO Version = Schema Version（方針 LOCKED）
- PR-J domain complete contract remains without schemaId / schemaVersion / dtoVersion fields
- SharePoint / DTO / application save remain separate units

## Next gate

```text
Next action:
  schemaVersion / dtoVersion Decision packet / compare（read-only）
  or explicit Human Decision on concrete SemVer

Not allowed from this document alone:
  adopting schemaVersion = 1.0.0（or any SemVer）
  creating dtoVersion as a separate value
  modifying TypeScript types / validators / fixtures / tests
  Schema / DTO / SharePoint / adapter implementation
  application save
  FindingCode / A-5
  Implementation Start
```
