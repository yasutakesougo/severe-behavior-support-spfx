# Issue #4 — Entra / Test-Group Readiness Packet（Read-Only）

この文書は、Issue **#4** の **Entra試験グループ / A-B分離 / 試験アカウント** に関する
read-only readiness packet である。

```text
repository: yasutakesougo/severe-behavior-support-spfx
Unit: ISSUE-4-ENTRA-TEST-GROUP-READINESS-1
Kind: read-only readiness packet（no tenant mutation）
Status: CANDIDATE / READY FOR HUMAN READINESS ACCEPTANCE
Baseline tip: 8b8aa6d523070bfe6e7a952fee631c472a2df7c4
Issue: #4 OPEN / KEEP OPEN
Entra mutation: NOT AUTHORIZED
SharePoint mutation: NOT AUTHORIZED
Deploy: NOT AUTHORIZED
Microsoft Graph mutation: NOT AUTHORIZED
Issue body mutation: NOT AUTHORIZED
```

Selection / Decision packet:
[`decision-issue-4-entra-readiness-selection.md`](./decision-issue-4-entra-readiness-selection.md)

Canonical site identities for this packet:

```text
SITE-ISG
SITE-HOM
```

Do **NOT** introduce:

```text
SITE-MCD
MCD
SITE-MACHIDA
SBS-MCD-*
SBS-MACHIDA-*
```

Do **not** infer SharePoint URLs from stale Issue #4 comments.
Accepted pilot Site URLs（when needed later）come from
`decision-assessment-snapshot-pilot-facility-identity-acceptance.md`.

## 1. Authority inventory

| Item | Authority source | Status | Notes |
|---|---|---|---|
| SITE-ISG / SITE-HOM tokens | contracts-v1 / #21-A/#21-B Accepted | **ACCEPTED / LOCKED** | fixture / schema tokens |
| Pilot facility Site URLs (`severe-support-isogo` / `severe-support-honmoku`) | Decision-AS-PILOT-FACILITY-IDENTITY-1 | **ACCEPTED / LOCKED** | creatable-target naming for Sites；≠ Entra group names |
| DEC-013 SharePoint site naming ledger row | Issue #8 body | **PROPOSED / STALE vs pilot identity** | ledger still Proposed；`/sites/sbs-*` must not override Accepted pilot URLs |
| DEC-014 M365 group naming | Issue #8 body | **PROPOSED** | `SBS-{SiteCode}-{ROLE}` is candidate only |
| Issue #4 early Entra group name list | Issue #4 comments | **STALE / PROPOSED** | includes deprecated MCD names；later HOM rewrite still not Accepted Decision |
| Formal Role ×7 | contracts-v1 / #21-A | **ACCEPTED / LOCKED** | SUPPORTER…VIEWER |
| Role → Entra group cardinality / scope map | — | **HOLD / UNKNOWN** | no Accepted Decision that every role needs one group per site |
| DEC-001 pilot 2 sites formal approval | Issue #8 | **PROPOSED** | operational pilot Sites observed；formal DEC-001 still Proposed in ledger |
| DEC-010 ORG_ADMIN personal-data scope | Issue #8 | **DEFERRED** | blocks org-admin live semantics |
| GOV-STAFF-01 transfer/retirement confirmer | Decision docs | **ACCEPTED / LOCKED / Option C** | ≠ Entra mutation |
| GOV-STAFF-02 Entra removal operator | Decision docs | **ACCEPTED / LOCKED / Option B** | Microsoft 365管理者；mutation still not authorized |
| GOV-STAFF-03 access-stop deadline | Decision docs | **ACCEPTED / LOCKED / Option A** | deadline policy；procedure execution later |
| GOV-STAFF-04 / 05 | Decision docs | **ACCEPTED / LOCKED** | ledger / past-record scope；not group naming |
| #21-A/#21-B auth contracts | Decision + main | **ACCEPTED / MERGED** | synthetic only；live provider OUT |
| #21 live principal / membership provider | — | **HOLD** | depends on #4 live groups |
| #22 SharePoint auth composition | Issue #22 | **OPEN / PARTIAL** | AssessmentSnapshots path only |
| #23 P0 E2E | Issue #23 | **OPEN / HOLD** | needs #4 + #21 + #22 |
| #30 operations/handoff | Issue #30 | **OPEN / HOLD** | offboarding procedure docs later |
| Tenant App Catalog / Deploy | Issue #4 reconcile + Deploy evidence | **CONFIRMED** | PRESENT / PASS / VERIFIED |
| Conditional Access confirmation | — | **UNKNOWN** | read-only confirmation still incomplete |
| Exact Entra group object IDs | — | **UNKNOWN** | none created under authorized test op |

Classification legend used below:

```text
CONFIRMED | ACCEPTED | PROPOSED | HOLD | UNKNOWN | STALE
```

## 2. Proposed test-group model（fail-closed）

Evaluate formal roles:

```text
SUPPORTER
PLANNER
SERVICE_MANAGER
SITE_ADMIN
ORG_ADMIN
SYSTEM_ADMIN
VIEWER
```

### Scope classification from current SoT

| Role | Scope from SoT | Status | Blocking for mutation? |
|---|---|---|---|
| SUPPORTER | likely site-scoped（membership carries SiteId in #21） | **HOLD**（no Accepted Entra map） | Yes for exact group create |
| PLANNER | likely site-scoped | **HOLD** | Yes |
| SERVICE_MANAGER | likely site-scoped | **HOLD** | Yes |
| SITE_ADMIN | likely site-scoped | **HOLD** | Yes |
| VIEWER | likely site-scoped | **HOLD** | Yes |
| ORG_ADMIN | organization-scoped candidate；DEC-010 Deferred | **HOLD** | Yes |
| SYSTEM_ADMIN | system-scoped candidate | **HOLD** | Yes |

```text
Do NOT assume every role requires one group per site.
Do NOT invent missing naming or membership semantics.
If ownership/scope is not Accepted → HOLD that mapping.
```

### A/B separation intent（readiness model only）

```text
SITE-ISG test principals must not gain SITE-HOM membership by default
SITE-HOM test principals must not gain SITE-ISG membership by default
multi-site account is an explicit exception (T-AB-01)
unassigned authenticated account belongs to neither A nor B test groups
```

## 3. Group naming matrix

Derive names **ONLY** from Accepted naming decisions.

| Purpose | SITE-ISG group | SITE-HOM group | Scope | Authority | Status |
|---|---|---|---|---|---|
| SUPPORTER test group | **UNKNOWN** | **UNKNOWN** | site? **HOLD** | DEC-014 Proposed only | **UNKNOWN** |
| PLANNER test group | **UNKNOWN** | **UNKNOWN** | site? **HOLD** | DEC-014 Proposed only | **UNKNOWN** |
| SERVICE_MANAGER test group | **UNKNOWN** | **UNKNOWN** | site? **HOLD** | DEC-014 Proposed only | **UNKNOWN** |
| SITE_ADMIN test group | **UNKNOWN** | **UNKNOWN** | site? **HOLD** | DEC-014 Proposed only | **UNKNOWN** |
| VIEWER test group | **UNKNOWN** | **UNKNOWN** | site? **HOLD** | DEC-014 Proposed only | **UNKNOWN** |
| ORG_ADMIN test group | **UNKNOWN**（org-wide; not per-site） | n/a until decided | org? **HOLD** | DEC-014 / DEC-010 | **UNKNOWN** |
| SYSTEM_ADMIN test group | **UNKNOWN**（system-wide; not per-site） | n/a until decided | system? **HOLD** | DEC-014 | **UNKNOWN** |

Historical Issue #4 comment candidates such as `SBS-ISG-SUPPORTER` / `SBS-HOM-*` /
`SBS-ORG-ADMIN` are **PROPOSED / STALE design comments**, not Accepted names.
They must not be treated as creatable authority.

### Exact Human Decision required before names leave UNKNOWN

```text
Human Decision required:
  DEC-014 ACCEPT（or equivalent Accepted group-naming Decision）
  covering:
    naming pattern
    role → group cardinality
    site vs org vs system scope per role
    test-prefix / production-prefix separation if any
    whether ORG_ADMIN / SYSTEM_ADMIN are single shared groups
```

## 4. Test-account matrix（no account creation now）

Synthetic/test-account roles only. No account creation in this run.

| ID | Membership | Role(s) | Selected site | Expected app auth | Expected SP auth | Expected result |
|---|---|---|---|---|---|---|
| T-A-01 | SITE-ISG only | sufficient normal role **UNKNOWN exact** until DEC-014/map | SITE-ISG | allow within ISG after selection | **UNKNOWN** live SP ACL | A-only authorized path |
| T-B-01 | SITE-HOM only | sufficient normal role **UNKNOWN exact** | SITE-HOM | allow within HOM after selection | **UNKNOWN** live SP ACL | B-only authorized path |
| T-AB-01 | SITE-ISG + SITE-HOM | sufficient role(s) **UNKNOWN exact** | explicit selection required | `SITE_SELECTION_REQUIRED` until selected；then selected site only | **UNKNOWN** live SP ACL | multi-site selection path |
| T-NONE-01 | neither A nor B test groups | none | n/a | deny / no membership | deny or no site access | authenticated but unauthorized |
| T-DISABLED-01 | any prior membership irrelevant | n/a | n/a | principal LookupResult failure only（EMPTY/UNKNOWN/FETCH_FAILED） | **UNKNOWN** directory disable semantics beyond LookupResult mapping | fail-closed；no AccountStatus invention |
| T-ROLE-01 | membership present | insufficient role vs requiredRoles | member site | role fail-closed deny | **UNKNOWN** if SP still grants | authenticated but insufficient role |
| T-ORG-01 | org mismatch if safely testable | any | any | OrganizationId mismatch deny | **UNKNOWN** | org mismatch deny；**HOLD** if no safe synthetic org fixture |

Rules:

```text
Unknown live semantics remain UNKNOWN.
Do not invent disabled-account behavior beyond existing LookupResult fail-closed mapping
（#21-B / contracts-v1）.
SharePoint permission expectations stay UNKNOWN until #22 composition + live ACL design.
```

Compact expected-result view:

| ID | Membership | Roles | Expected result |
|---|---|---|---|
| T-A-01 | A only | normal authorized（exact TBD） | A authorized / B denied |
| T-B-01 | B only | normal authorized（exact TBD） | B authorized / A denied |
| T-AB-01 | A+B | normal authorized（exact TBD） | selection required；no cross-site bleed |
| T-NONE-01 | none | none | deny |
| T-DISABLED-01 | n/a | n/a | principal LookupResult fail-closed |
| T-ROLE-01 | member | insufficient | role deny |
| T-ORG-01 | mismatch / HOLD | any | org deny if safely testable；else HOLD |

## 5. Minimum first mutation bundle（future only）

Smallest useful live Entra mutation bundle:

```text
IN:
  create test-only Entra groups whose names are Accepted under DEC-014
  assign synthetic/test accounts only（T-A-01 / T-B-01 / T-AB-01 / T-NONE-01 / T-ROLE-01 as applicable）
  capture object IDs

OUT:
  Conditional Access changes
  production groups
  SharePoint permission changes
  Deploy
  real staff / production accounts
  App Catalog changes
  site / list / column creation
  ORG_ADMIN / SYSTEM_ADMIN groups if scope still HOLD
  any group name still UNKNOWN
```

```text
If DEC-014 / role-scope map still UNKNOWN:
  first mutation bundle = NOT READY
  readiness model may still be accepted without Mutation GO
```

## 6. Mutation inventory（future rows; no mutation now）

For each future mutation, record:

| Field | Required value |
|---|---|
| object type | Entra security/M365 group（exact type TBD by naming Decision） |
| proposed name / identifier | Accepted name only；else UNKNOWN |
| site | SITE-ISG / SITE-HOM / org / system |
| role/purpose | one formal Role or documented multi-role exception |
| create/update | create（preferred for test-only） |
| expected membership | exact test-account UPNs/object IDs |
| owner | Microsoft 365管理者（GOV-STAFF-02） for removal ops；create operator still Human GO |
| reversibility | high if test-only + no SP ACL bind |
| rollback | remove synthetic members；delete only groups created by this authorized op |
| verification | see §8 |

No row is executable until Decision C（Mutation GO）.

## 7. Rollback plan（for later Mutation GO）

```text
1. remove synthetic test members added by the authorized operation
2. delete newly-created test-only groups created by that same authorized operation
3. restore prior membership only if an update touched a pre-existing group
   （prefer create-new; avoid updating pre-existing groups）
4. verify no production group changed
5. verify no SharePoint permission changed
6. verify no production account unintentionally added/removed
7. capture before/after object ID inventory
```

```text
Never propose deletion of pre-existing groups
unless proven created by this authorized test operation.
```

## 8. Verification plan（read-after-write； later execution）

Minimum checks after a future Mutation GO:

```text
group exists
group identity/object ID captured
intended group membership exact
A/B groups distinct
multi-site account membership exact
unassigned account belongs to neither A nor B
disabled test case status observable（directory）and mapped only via LookupResult fail-closed in app
no production account unintentionally added
no SharePoint permission changed
no production data touched
```

Later consumers:

| Consumer | Use of #4 groups |
|---|---|
| #21 live principal / membership provider | resolve memberships → AuthorizationContext |
| #22 SharePoint authorization composition | compose app auth + SP ACL fail-closed |
| #23 P0 E2E | A/B separation / deny paths |

## 9. Required Human Decisions（separated）

```text
Decision A:
FAST-LANE v1 standing authorization
→ docs/architecture/decision-fast-lane-v1-selection.md

Decision B:
#4 Entra readiness / test-group model acceptance
→ this packet + decision-issue-4-entra-readiness-selection.md
→ Entra mutation = NOT AUTHORIZED by Decision B alone

Decision C:
actual Entra mutation GO
→ requires Decision B ACCEPT
→ requires DEC-014（or equivalent）Accepted names/scopes
→ requires exact mutation inventory filled（no UNKNOWN names）
→ NOT OUTPUT in this run
```

```text
Readiness acceptance ≠ tenant mutation authorization.
```

## Dependencies

```text
Blocking for Mutation GO:
  DEC-014 Accepted naming + role scope map
  exact test group names
  exact test account identities
  Human Mutation GO（Decision C）

Non-blocking for Readiness ACCEPT:
  stale Issue #4 body markers
  Conditional Access confirmation（record as UNKNOWN / later）
  #30 procedure docs completion
  #21 live provider implementation
  #22 / #23 execution
```

## Findings

```text
P0: 0
P1:
  I4-P1-1 OPEN — DEC-014 group naming not Accepted；exact group names = UNKNOWN
  I4-P1-2 OPEN — role → site/org/system group map not Accepted；HOLD
P2:
  I4-P2-1 OPEN — Issue #4 / #8 DEC-013 still show /sites/sbs-* while pilot identity Accepted
    severe-support-* URLs；stale-body sync later
  I4-P2-2 OPEN — Conditional Access confirmation UNKNOWN
  I4-P2-3 OPEN — #30 offboarding procedure docs still HOLD
```
