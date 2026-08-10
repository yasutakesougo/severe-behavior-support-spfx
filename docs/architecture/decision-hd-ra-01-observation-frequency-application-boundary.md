# HD-RA-01 — Observation frequency application boundary

Status: ACCEPTED / LOCKED
Human decision date: 2026-08-11
Source evidence: Issue #219 / RA-1 / HD-RA-01 Human Decision

## Accepted boundary

The official evidence for the scoped life-care / severe-behavior-support context states that the practical-training completer observes the applicable user, in principle, at least once per week.

The application SHALL preserve and expose observation evidence sufficient to review the actual history, including at minimum:

- observation timestamp
- observer identity
- latest observation timestamp
- observation history

## Not adopted

The following are NOT adopted as application rules by this Decision:

- automatic weekly compliance PASS / FAIL
- automatic violation or unmet status
- invented week-start boundary
- rolling-seven-day substitution for the official wording
- automatic hard gate derived from the weekly wording
- invented absence-week semantics
- invented same-day multiple-record counting semantics

## Separation from observation-period membership

`periodFrom / periodTo` membership and weekly-observation compliance are separate concepts.

An observation being inside a configured observation period does not, by itself, establish weekly compliance.

## Existing design reconciliation

Historical candidate text in Issue #16 / GOV-RULE-04 that assumes a required observation count, count comparison, or automatic compliance judgment MUST NOT be treated as Accepted merely because it exists in that issue.

Any future automatic compliance or warning logic requires a separate Human Decision supported by explicit application semantics.

## Gate

```text
HD-RA-01: ACCEPTED / LOCKED
Code implementation: NOT AUTHORIZED by this Decision alone
SharePoint / M365 / Entra mutation: NOT AUTHORIZED
Deploy / real data: NO-GO
```
