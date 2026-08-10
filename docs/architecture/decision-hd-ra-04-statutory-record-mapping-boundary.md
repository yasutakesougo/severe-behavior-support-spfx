# HD-RA-04 — Application record to statutory-record mapping boundary

Status: ACCEPTED / LOCKED
Human decision date: 2026-08-11
Source evidence: Issue #219 / RA-2 / HD-RA-04 Human Decision

## Accepted boundary

Application record types SHALL be mapped to statutory / operational record categories conservatively and only where official primary evidence directly supports the mapping.

If direct evidence is insufficient, the mapping status SHALL remain `NOT_CONFIRMED` rather than being inferred from similar names, nearby concepts, retention duration, or implementation convenience.

## Separation of meaning and retention

Record-category meaning and retention policy are separate decisions.

A five-year retention rule, by itself, does not establish that an application record is legally identical to a statutory service record.

Likewise, an application-specific retention policy does not establish statutory equivalence.

## Current conservative mapping boundary

```text
SupportPlan:
  relation to 支援計画シート等 = SUPPORTED / RELATED
  exact statutory-record equivalence = NOT_CONFIRMED unless separately evidenced

AssessmentSnapshot:
  statutory-record equivalence = NOT_CONFIRMED

Observation / ABC:
  statutory-record equivalence = NOT_CONFIRMED

Handoff:
  statutory-record equivalence = NOT_CONFIRMED

AuditEvent:
  statutory-record equivalence = NOT_CONFIRMED
```

## Forbidden inference

The application SHALL NOT automatically conclude any of the following without direct evidence and a separate Accepted mapping:

- `AuditEvent == statutory service record`
- `AssessmentSnapshot == statutory service record`
- `Observation == statutory service record`
- `SupportPlan == 生活介護計画`
- identical retention period implies identical statutory category

## Existing Decision relation

Existing Accepted / LOCKED retention and deletion-prohibition decisions remain in force but do not auto-assign statutory meaning to application record types.

## Gate

```text
HD-RA-04: ACCEPTED / LOCKED
Automatic statutory equivalence: FORBIDDEN
Code implementation: NOT AUTHORIZED by this Decision alone
SharePoint / M365 / Entra mutation: NOT AUTHORIZED
Deploy / real data: NO-GO
```
