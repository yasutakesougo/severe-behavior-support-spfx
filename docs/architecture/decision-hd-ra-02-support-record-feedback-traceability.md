# HD-RA-02 — Support-record feedback traceability boundary

Status: ACCEPTED / LOCKED
Human decision date: 2026-08-11
Source evidence: Issue #219 / RA-1 / HD-RA-02 Human Decision

## Accepted boundary

The application SHALL preserve traceability from a support record to the support plan / plan version on which the support was based.

The traceable record SHALL retain enough information to explain the support-progress evidence, including at minimum:

- referenced support plan / plan version
- record timestamp
- recorder identity

The practical-training completer SHALL be able to review the support progress represented by those records, subject to separately Accepted authorization boundaries.

## Not adopted

The following workflow semantics are NOT adopted by this Decision:

- `submitted`
- `received`
- `read`
- `acknowledged`
- `approved`
- `rejected`
- `returned`
- submission deadline
- acknowledgement deadline
- automatic unsubmitted / unread / violation status
- reuse of HandoffState as the support-record feedback workflow

## Existing Decision relation

This preserves DEC-008's Accepted boundary that application submit / return roles are not fixed by the application contract.

Existing Handoff state-machine contracts are separate and MUST NOT be treated as the statutory support-record feedback process without a new Human Decision.

## Gate

```text
HD-RA-02: ACCEPTED / LOCKED
Code implementation: NOT AUTHORIZED by this Decision alone
SharePoint / M365 / Entra mutation: NOT AUTHORIZED
Deploy / real data: NO-GO
```
