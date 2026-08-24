# LIMITED-DEMO-DEPLOY-GATE-DEFINITION-1

この文書は **LIMITED-DEMO-DEPLOY-GATE-DEFINITION-1** の exact-scope definition である。
`Definition Start GO` により、限定デモ用 Deploy gate の定義作業だけを開始する。
この文書は Deploy、App Catalog mutation、page mutation、Production Binding、LIVE WRITE を実行しない。

```text
repository: yasutakesougo/severe-behavior-support-spfx
Unit: LIMITED-DEMO-DEPLOY-GATE-DEFINITION-1
Kind: Exact Scope Definition（docs-only）
Definition Start: GO RECEIVED
Definition Correction-1 Implementation Start: GO RECEIVED
Focused Independent Definition Re-Review: PASS / LOCKABLE
P0: 0
P1: 0
Human Decision: ACCEPTED / LOCKED
Definition Correction-1 status: APPLIED / PUBLISHED
Definition status: ACCEPTED / LOCKED
Publication status: PR #507 OPEN / DRAFT / NOT IN MAIN
```

## 1. Authority and exact basis

```text
GitHub live main:
  145dcb349f80590b91a7267caf79fdc1587064a5
  CONFIRMED by refs/heads/main read-only lookup

Current open draft PRs relevant to release gates at this review basis
(named set; not an exhaustive inventory):
  #504 RELEASE-CURRENT-RC-EXACT-SCOPE-DEFINITION-1
  #505 RELEASE-CURRENT-RC-U2-ENVIRONMENT-GATE-1
  #506 RELEASE-CURRENT-RC-U1-TENANT-ISOLATION-EXACT-SCOPE-1
  #491 SPFX-RELEASE-GATE-HARDENING-2-AUTOMATION-1
  OPEN / DRAFT / not part of main@145dcb3...
```

This PR list is time-scoped context only, not current Deploy evidence. The later
precondition must re-read GitHub live state and must not infer status from this
snapshot.

The working tree contains unrelated and pre-existing WIP. This definition does not
use that WIP as evidence, stage it, rebase it, stash it, or overwrite it.

Historical records remain historical snapshots. In particular:

```text
SPFX-CURRENT-DEPLOYMENT-DEMO-ACCEPTANCE-1
  ACCEPT — CURRENT FIXTURE DEMO SCOPE at its recorded basis

SPFX-CURRENT-DEPLOYMENT-ALIGNMENT-DECISION-1
  OPTION B ADOPT at its recorded basis
  separate Deploy GO still required
```

Those records do not prove that the current main tree, current artifact, current
catalog object, or current host is aligned. They are not silently re-run or
promoted by this definition.

## 2. Purpose

The gate governs a narrowly bounded demonstration deployment whose purpose is to
show the existing SPFx fixture shell in an already authorized demo host.

```text
Limited demo = synthetic fixture presentation only
Limited demo != product release
Limited demo != Full Application Acceptance
Limited demo != Production Binding
Limited demo != LIVE WRITE
Limited demo != U1 / U2 / U3 clearance
```

The gate may later support a Human-authorized deployment of one exact artifact to
one exact existing demo target. It does not grant that authorization now.

## 3. In-scope contract

The later deploy candidate must satisfy all of the following:

### 3.1 Runtime boundary

```text
mode: fixture-only
data: synthetic only
presentationRole: presentation-only
role resolution: not authorized
site selection: unselected by default unless the demo contract explicitly records it
application-data API traffic: none, read or write
SharePoint / Graph / M365 / Entra application-data traffic: none, read or write
allowed non-application read traffic: only named host/page bootstrap, static
  asset/config retrieval, authentication/session transport required to open the
  named host, and read-only catalog metadata reconciliation where applicable
application-data reads: no list/item/column/business-record, membership, role,
  tenant-isolation, or application API reads
save / correction / review mutations: disabled or fail-closed
Production Binding: NOT ACTIVE
LIVE WRITE: HOLD
```

The demo may demonstrate navigation and presentation states that are explicitly
inside the fixture catalog. It must not imply that a displayed role is an
authenticated authorization result.

### 3.2 Existing host boundary

The target must be an already existing, explicitly identified demo host and page.
Candidate names alone are insufficient.

```text
tenant identifier: exact read-back required
site identifier: exact read-back required
page identifier / URL: exact read-back required
web part instance: existing instance required
existing placement observation: read-only only
page edit / web part add / move / delete: out of scope
new site / list / column / group / permission: out of scope
```

If the existing host does not contain the required web part, this gate is HOLD;
it does not authorize host placement or schema work. If placement or any page
change is needed, the current gate remains HOLD and a separate Host Placement
definition plus an explicit Human Host Placement GO are required.

### 3.3 Artifact boundary

The deploy candidate is one exact package identity, bound to one exact source
basis. The following must be recorded and re-verified at the later precondition
gate:

```text
expected main SHA
observed source SHA
shaMatch
solution name
ProductId
version
package path
package SHA-256
package size
build provenance
rollback artifact path / SHA-256 / size
```

Version, filename, title, or ProductId alone does not identify the package. A
locally generated or CI-generated `.sppkg` is not authoritative merely because a
build succeeded. If package identity, source basis, or rollback authority is
missing or mismatched, the gate is HOLD.

### 3.4 Catalog and deployment-mode boundary

The later precondition must read the existing target in read-only mode and bind
the operation to exact identity. It must classify the operation as exactly one of
`FIRST INSTALL`, `UPGRADE`, or `REPLACE`.

```text
catalog object identity: exact read-back required
ProductId / version / deployed state: exact read-back required where exposed
deployment mode: exactly one classification
operator: named Human operator required
rollback: available and identified before Deploy GO
```

Title similarity, filename similarity, or a version match is not sufficient to
classify the target. If the live identity is not exposed or cannot be reconciled,
the operation is `UNKNOWN` and remains HOLD.

### 3.5 Acceptance and verification boundary

Acceptance must be tied to the same source/artifact/host basis. It must include:

```text
authenticated launch:
  required PASS when targetType = existing-authenticated-host and this demo
  claims deployment/use of the named existing host/page/web-part
  NOT APPLICABLE only when the later target contract explicitly selects
  fixture-harness-only or hostless-fixture presentation and makes no claim of
  authenticated host launch, page placement, or host deployment
  an inaccessible, unattempted, failed, or missing-web-part existing host is
  UNKNOWN/HOLD, not NOT APPLICABLE
fixture-harness alternative:
  permitted only when targetType and the evidence packet explicitly identify
  the harness as the selected target; its result is labeled harness-only and
  cannot be promoted to authenticated-host acceptance. It is a distinct
  evidence mode, not a fallback after an existing-host launch failure, and it
  cannot satisfy an existing-host deployment claim or authorize catalog/page
  mutation.
For this unit, existing-authenticated-host is the default targetType. A later
fixture-harness-only selection must explicitly state that no authenticated-host
deployment is being claimed.
fixture shell render: PASS
synthetic-data-only observation: PASS
intended demo entrance / navigation: PASS
write controls: disabled or fail-closed
application-data traffic: none, read or write
allowed non-application read traffic: only the enumerated host/bootstrap/config,
  authentication/session, static asset, and catalog metadata reads
target page mutation: NONE in this gate; existing placement may only be read
  back. A Host Placement gate's existence does not authorize mutation. Page
  placement/change requires a separate explicit Human Host Placement GO.
loaded asset identity: matches the accepted artifact basis
post-deploy catalog read-back: PASS when catalog deployment is in scope; it is
  NOT APPLICABLE only for an explicitly fixture-harness-only target, which must
  make no catalog deployment claim
rollback observation: recorded as available
```

An observation from an older package, older main SHA, or different host is not
current-basis acceptance evidence.

## 4. Gate sequence

```text
Definition Start GO
  -> definition review / lock
  -> read-only deploy precondition
      -> PRECONDITION READY or HOLD
  -> separate Human Limited Demo Deploy GO
  -> Human operator performs the authorized deployment mutation
  -> post-deploy read-back and fixture smoke
      -> POST-DEPLOY ACCEPTED or HOLD
  -> limited-demo closeout
```

Each transition is separate:

| Transition | Required authority | What it does not authorize |
|---|---|---|
| Definition Start | Human GO received | implementation, build, Deploy |
| Definition review / lock | Human definition acceptance | Deploy, Binding, LIVE WRITE |
| Read-only precondition | read-only observation; may produce `PRECONDITION READY` | catalog mutation, page mutation, or Deploy authorization |
| Limited Demo Deploy GO | Human GO bound to exact SHA, artifact, target, mode, operator, rollback | Full Application Acceptance or Production Binding |
| Post-deploy verification | Human/Agent evidence within the authorized demo scope; may produce `POST-DEPLOY ACCEPTED` | new mutation or scope expansion |

The phrase `go` without the named gate does not advance more than the explicitly
named transition.

`PRECONDITION READY` is a deploy-before result. It is evaluated only from
read-only preconditions and does not require, imply, or consume a Human Deploy
GO. `POST-DEPLOY ACCEPTED` is evaluated only after the separate Human Deploy GO,
the authorized mutation, and post-deploy evidence. Post-deploy criteria are not
eligible inputs to `PRECONDITION READY`; before mutation, post-deploy acceptance
is `NOT STARTED`, never `READY`.

## 5. Phase-separated limited-demo criteria

The following criteria define two separate phases. They are not evidence that
either phase has already passed.

### 5.1 Deploy-before read-only preconditions

`PRECONDITION READY` requires all applicable precondition criteria below to be
`CONFIRMED`, with no unexplained `UNKNOWN` or `HOLD`:

```text
LDD-AC1  exact current-main SHA is recorded and matches the deploy basis
LDD-AC2  one package identity, SHA-256, size, and provenance are recorded
LDD-AC3  rollback artifact is retained and independently identifiable
LDD-AC4  exact existing tenant/site/page/web-part target is read back
LDD-AC5  deployment mode is classified without name-based inference
LDD-AC6  existing permission/access evidence is sufficient for the selected demo
         target; no access expansion is performed
LDD-PC1  named Human operator is recorded; no credential, token, or secret is
         recorded
LDD-PC2  targetType and authenticated-launch applicability are explicitly
         declared under §3.5
LDD-PC3  allowed non-application read channels are enumerated; application-data
         read channels are explicitly excluded
LDD-PC4  existing placement is sufficient; no page placement or page mutation
         is required for this gate
LDD-PC5  precondition evidence is redacted and contains no token, cookie, secret,
         or PII
```

### 5.2 Post-deploy acceptance

`POST-DEPLOY ACCEPTED` is evaluated only after `PRECONDITION READY`, a separate
Human Limited Demo Deploy GO, and the authorized deployment mutation. It requires
all applicable post-deploy criteria below:

```text
LDD-AC7  runtime remains fixture-only and synthetic-data-only
LDD-AC8  presentation role is not represented as authenticated authorization
LDD-AC9  no application-data API request occurs, read or write, including
         authenticated SharePoint / Graph / M365 / Entra application-data
         endpoints; only the §3.1 enumerated non-application reads may occur
LDD-AC10 post-deploy loaded asset and catalog state reconcile to the accepted basis
         when catalog deployment is in scope; fixture-harness-only evidence may
         mark catalog state NOT APPLICABLE only with no deployment claim
LDD-AC11 demo observations are limited to the named host and named fixture scope
LDD-AC12 post-deploy evidence is redacted and contains no token, cookie, secret,
         or PII
LDD-PA1  authenticated launch is PASS for an existing-authenticated-host target;
         a fixture-harness-only target follows the explicit §3.5 alternative
LDD-PA2  fixture shell render, intended demo entrance/navigation, and write
         controls satisfy the §3.5 acceptance boundary
LDD-PA3  application-data traffic is none, read or write
LDD-PA4  target page mutation is none and existing placement is only read back
LDD-PA5  rollback availability is observed and recorded
```

Missing evidence is `UNKNOWN` and therefore `HOLD`; it is not a negative
inference, an implicit PASS, or a reason to mark `NOT APPLICABLE`.

## 6. Fail-closed conditions

The later gate must stop as `HOLD` when any of these occurs:

- current main moves after the evidence basis is fixed;
- artifact SHA, size, ProductId, version, or source provenance is missing or mismatched;
- the catalog object or deployment mode cannot be identified exactly;
- the selected site/page/web-part target is only a candidate name;
- host placement, page editing, schema change, permission change, or access expansion is needed;
- page placement/change is needed without a separate exact-scope Host Placement
  gate and explicit Human Host Placement GO; the existence of that gate alone is
  not authorization;
- synthetic-only / presentation-only behavior is not demonstrated;
- any application-data API, SharePoint, Graph, M365, or Entra application-data
  read or write is observed or required;
- an authenticated existing-host launch is required but missing, failed, or not
  attempted, or the stated `NOT APPLICABLE` conditions are not satisfied;
- post-deploy acceptance is attempted before `PRECONDITION READY`, the separate
  Human Deploy GO, and the authorized mutation;
- rollback is unavailable or the Human operator is not identified;
- the requested outcome expands to full application, production, tenant-isolation,
  security-scan, or release acceptance;
- the evidence basis is stale, mixed, or not reproducible.

## 7. Explicitly separate gates

This definition does not decide or clear the following:

```text
U1  live tenant OrganizationId / SiteId isolation
U2  exact-SHA Deep Security Scan
U3  current-basis artifact authority for release
Production Binding / live List or column mapping
SharePoint schema or permission changes
Full Application Acceptance
Release Gate / production Deploy
Ready / Merge / Issue mutation
```

U1/U2/U3 evidence may be required by a later release decision, but a limited demo
result must never be used as a substitute for those gates. Conversely, a limited
demo can remain narrowly fixture-only without claiming that those release gates
are cleared.

## 8. Forbidden from this Definition Start

```text
App Catalog upload / replace / delete
page edit or web-part placement, including when a Host Placement gate merely exists
Host Placement mutation without a separate explicit Human Host Placement GO
SharePoint / Graph / M365 / Entra mutation
schema / list / column / permission mutation
Production Binding
LIVE WRITE enablement
.sppkg rebuild for deployment
Issue mutation / close
Ready / Merge / push
Full Application Acceptance claim
Release PASS claim
```

## 9. Definition deliverable and next gate

This document is the definition deliverable started by the named GO. Its
Independent Definition Re-Review is PASS / LOCKABLE and the Human Decision is
ACCEPTED / LOCKED. It does not record a Deploy GO.

```text
Current unit: LIMITED-DEMO-DEPLOY-GATE-DEFINITION-1
Current result: DEFINITION CORRECTION-1 APPLIED / PUBLISHED / PASS / LOCKED
Next named gate: read-only Deploy Precondition
After lock: read-only Deploy Precondition
Deploy: separate Human GO required
Current action: STOP after docs-only Correction-1 work
```

The locked definition must still be checked against current main evidence at the
read-only Deploy Precondition. It must not convert historical fixture acceptance,
a visible catalog panel, local build success, or an empty search result into
current Deploy evidence.
