# HD-RA-03 — Training / staffing application-enforcement boundary

Status: ACCEPTED / LOCKED
Human decision date: 2026-08-11
Source evidence: Issue #219 / RA-2 / HD-RA-03 Human Decision

## Accepted boundary

Official training, qualification, and staffing requirements MAY be represented in the application as reviewable evidence and explanatory reference information.

The application MAY expose, subject to separately Accepted data and authorization contracts:

- qualification / training information
- staffing / assignment information
- applicable official requirement text or structured evidence
- evidence confirmation / missing / expiry state where already supported by an Accepted contract

## Not adopted

The application SHALL NOT, from this Decision alone, automatically determine:

- statutory compliant / non-compliant status
- billing eligibility
- reimbursement eligibility
- automatic hard gate
- automatic violation
- automatic legal conclusion from missing evidence

Missing qualification evidence MUST NOT be silently converted into a confirmed `not completed` conclusion.

## Existing design reconciliation

Issue #15 contains candidate contracts for Staff, StaffAssignment, StaffQualification, and training-ratio aggregation. Those structures remain candidate / dependent on their own Accepted decisions where applicable.

The following unresolved organization-policy items in #15 / #19 are not resolved by HD-RA-03:

- qualification / training master owner
- qualification evidence confirmer
- denominator population rules
- concurrent assignment handling
- leave / long absence / temporary support staff handling
- qualification codes and evidence governance

Until those dependencies are Accepted, candidate ratio or eligibility logic MUST NOT be promoted into an automatic statutory eligibility engine.

## Gate

```text
HD-RA-03: ACCEPTED / LOCKED
Evidence / reference representation: ALLOWED AS A DESIGN BOUNDARY
Automatic statutory eligibility engine: NOT ADOPTED
Code implementation: NOT AUTHORIZED by this Decision alone
SharePoint / M365 / Entra mutation: NOT AUTHORIZED
Deploy / real data: NO-GO
```
