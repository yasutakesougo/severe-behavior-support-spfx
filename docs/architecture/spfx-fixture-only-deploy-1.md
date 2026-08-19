# SPFX-FIXTURE-ONLY-DEPLOY-1

この文書は **SPFX-FIXTURE-ONLY-DEPLOY-1** の closeout 正本である。
判定材料は、同一 basis 上で完了した fixture-only Deploy Precheck と
Human SELECT **Option A — KEEP CURRENT DEPLOYMENT** である。
本記録は Deploy しない。App Catalog を変更しない。LIVE WRITE を開かない。

[`spfx-release-artifact-reproducibility-1.md`](./spfx-release-artifact-reproducibility-1.md)
は Artifact Reproducibility closeout 正本である。本記録はそれを再解釈しない。

[`spfx-production-binding-decision-1.md`](./spfx-production-binding-decision-1.md)
は Production Binding Decision closeout 正本である。本記録はそれを再解釈しない。

後続の current-deployment demo acceptance 記録（この closeout を書き換えない）:
[`spfx-current-deployment-demo-acceptance-1.md`](./spfx-current-deployment-demo-acceptance-1.md)
（basis `8cc1d53…` / ACCEPT CURRENT FIXTURE DEMO SCOPE）。
next-gate 文言は本記録時点の snapshot である。

後続の alignment decision 記録（この closeout を書き換えない）:
[`spfx-current-deployment-alignment-decision-1.md`](./spfx-current-deployment-alignment-decision-1.md)
（basis `cf0d45d…` / OPTION B ADOPT）。
当時の Option A SELECT snapshot は維持する。

```text
repository: yasutakesougo/severe-behavior-support-spfx
Closeout ID: SPFX-FIXTURE-ONLY-DEPLOY-1
Kind: Closeout / Human Decision recording（docs-only）
Status: RECORDED
Decision: SELECTED / LOCKED
Option: A — KEEP CURRENT DEPLOYMENT
```

Live gate（Ready / Merge 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

## 1. Exact basis

Record both identities distinctly. Do not collapse them.

```text
Repository current main / decision docs tip:
  f622fcdab9750e8450adf5c520caa095450d32b7
  Merge pull request #436 from yasutakesougo/docs/spfx-release-artifact-reproducibility-1

Application tree (identical spfx):
  16a66488b18073eac3ef6af3a4b1114e147d64e6
  d8cbd0e4e7fa9eaf585ca7acef5b1f8f504829c3
  8a5056c5a93fc6d3de1989d3160c9e3cf9d8aacb
  c100c439f50a06f5fcbcb831e83ea4f67b218ad1
  8f13cd91f9b56cf067fbd0cef799b5d502c33773
  1fedeba4d8bafcf7d59fec92d0126e2ce621a0c6
  f622fcdab9750e8450adf5c520caa095450d32b7
PR #432 / #433 / #434 / #435 / #436 delta:
  docs-only
```

```text
Deep Scan result authority:
  8a5056c5a93fc6d3de1989d3160c9e3cf9d8aacb
  COMPLETE / NO VERIFIED BLOCKERS
Production Binding Decision:
  Option A — KEEP unbound
  SELECTED / LOCKED
  NOT AUTHORIZED / NOT ACTIVE
Recorded artifact authority:
  BUILD 1
  sha256 d264a74326dff42c98eff262dbe608f8ff2886d1779312786d4be15a4b6096ac
  size 58247 bytes
  version 1.0.0.1
```

Precheck `SPFX-FIXTURE-ONLY-DEPLOY-PRECHECK-1` classified
`READY_FOR_DEPLOY_DECISION`. That classification does not authorize upload.
Human SELECT Option A keeps the observed Tenant deployment unchanged.

## 2. Scope

```text
Kind: Human Decision recording
Mode: docs-only
Selected option: A
Option B: NOT SELECTED
  (do not upload / replace with BUILD 1)
package-solution.json edits: NONE
.sppkg rebuild / commit: NONE
App Catalog upload / replace: NONE
Home.aspx edit / web part add: NONE
Issues opened: NONE
SharePoint / Graph / M365 / Entra / App Catalog mutation: NONE
Production mutation: NONE
```

## 3. Decision verdict

```text
SPFX-FIXTURE-ONLY-DEPLOY-1:
SELECTED / LOCKED
Option A — KEEP CURRENT DEPLOYMENT
Upload BUILD 1: NOT PERFORMED
Replace catalog object: NOT PERFORMED
Working-copy BUILD 2: NOT SELECTED FOR DEPLOY
LIVE WRITE: HOLD
Deploy: NOT PERFORMED / HOLD
Production Binding: NOT AUTHORIZED / NOT ACTIVE
```

Meaning of Option A:

```text
Keep the Tenant App Catalog deployment observed at precheck.
Do not upload BUILD 1.
Do not replace the catalog object.
Do not add or move web parts.
Do not edit Home.aspx.
ScaffoldShellWebPart remains fixture-only.
```

```text
Option A ≠ Deploy GO
Option A ≠ App Catalog upload GO
Option A ≠ Production Binding GO
Option B upload BUILD 1: NOT SELECTED
Option A LOCKED ≠ later upload without a new Human GO
```

## 4. Precheck facts recorded at SELECT

These are observations at SELECT time. This closeout does not re-run them.

```text
Authoritative artifact file:
  AVAILABLE
  path /tmp/spfx-repro-1fedeba/build1.sppkg
  sha256 d264a74326dff42c98eff262dbe608f8ff2886d1779312786d4be15a4b6096ac
  size 58247 bytes
  NOT UPLOADED

BUILD 2 (evaluation only; not selected):
  path spfx/sharepoint/solution/severe-behavior-support-spfx-shell.sppkg
  sha256 31a7345e3501d191efa3677b59543d2b31241c8ca47cc66bf5eb327f18f52f64
  NOT UPLOADED

Package identity:
  PASS
  name severe-behavior-support-spfx-shell-client-side-solution
  id 4342db47-21a3-4c48-aed1-ef615f55c404
  version 1.0.0.1
  skipFeatureDeployment true
  isDomainIsolated false

Runtime:
  fixture-only / CLOSED
  DEPLOYABLE FIXTURE HOST
  not PRODUCTION-BOUND APPLICATION

Tenant App Catalog:
  PRESENT
  ProductId 4342db47-21a3-4c48-aed1-ef615f55c404
  AppCatalogVersion 1.0.0.1
  Deployed true
  CurrentVersionDeployed true
  catalog size/hash: NOT OBSERVABLE
  catalog object ≠ proven BUILD 1 hash
  UNCHANGED by this decision

Host placement:
  READY
  SitePages/Home.aspx exists
  contains ScaffoldShellWebPart id ab6c480a-ad30-41d6-9b66-8d944ee07f9c
  page not edited
```

## 5. UNVERIFIED / RELEASE-GAP

Do not convert these into PASS.

```text
U1:
  Live tenant OrganizationId / SiteId isolation
  Status: UNVERIFIED

U2:
  Exact-SHA Deep Security Scan
  Status: EXECUTED for 8a5056c5a93fc6d3de1989d3160c9e3cf9d8aacb

U3:
  Current-basis .sppkg hash
  Status: RECORDED for BUILD 1
  Local hash ≠ proven catalog object hash

RG-REPRO:
  Artifact reproducibility
  Status: EVALUATED / BYTE-IDENTICAL NOT ACHIEVED
  Classification: NON-BLOCKING / CARRY
  Do not convert to PASS.
  Byte-identical NOT ACHIEVED is not a Deploy blocker.

RG-BIND:
  Production Binding Decision
  Status: TAKEN
  Result: Option A KEEP unbound
  Binding remains NOT AUTHORIZED / NOT ACTIVE
```

Candidate handling is unchanged:

```text
DS-C1: CANDIDATE / NOT VERIFIED
DS-C2: CANDIDATE / NOT VERIFIED
SR-P3-1: CARRY / NON-BLOCKING
SR-P3-2: CARRY / NON-BLOCKING
VP4-P2-2: CARRY / NON-BLOCKING / CONFIRMED
```

## 6. Release interpretation

```text
READY_FOR_DEPLOY_DECISION != Deploy GO
Option A KEEP CURRENT DEPLOYMENT != upload BUILD 1
Option A LOCKED != catalog overwrite
Local BUILD 1 file != App Catalog object
Catalog version 1.0.0.1 != proven BUILD 1 hash
KEEP unbound unchanged
LIVE WRITE remains HOLD
```

A later upload / replace requires a **new** Human GO. This Option A does not
expire into Option B.

## 7. Next gate

```text
Next gate identity: NONE FROM THIS DECISION
This closeout does not start upload.
This closeout does not start LIVE WRITE.
This closeout does not start Option B.
This closeout does not start Production Binding.
```

Reason:

- Human selected KEEP CURRENT DEPLOYMENT
- observed Tenant deployment remains unchanged
- fixture-only host remains the durable runtime
- no production mutation is required by this decision

## 8. STOP

```text
This closeout is documentation / decision recording only.
Do not upload BUILD 1.
Do not upload BUILD 2.
Do not replace the Tenant App Catalog object.
Do not edit Home.aspx.
Do not add web parts.
Do not begin Option B from this document.
Do not enable LIVE WRITE.
Do not Production Bind.
Do not rebuild or commit .sppkg.
Wait for a separate Human GO.
CURRENT ACTION: STOP
```
