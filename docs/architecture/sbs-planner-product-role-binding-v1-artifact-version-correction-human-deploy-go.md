# SBS-PLANNER-PRODUCT-ROLE-BINDING-V1 — Artifact / Version Correction Human Deploy GO

Consumes **Human Deploy GO** bound to Deploy Candidate A. This record authorizes a credentialed Human operator to upload that exact `.sppkg` to the Tenant App Catalog. It does **not** execute Agent App Catalog upload, does **not** close FE-F006, and does **not** treat GO as post-deploy verification PASS.

```text
repository: yasutakesougo/severe-behavior-support-spfx
workstream: SBS-PLANNER-PRODUCT-ROLE-BINDING-V1
unit: SBS-PLANNER-PRODUCT-ROLE-BINDING-V1-ARTIFACT-VERSION-CORRECTION
kind: Human Deploy GO
date: 2026-09-18
recorded_at: 2026-09-18T09:12:42Z

origin/main: 7414f9d08f6fcf64829fad66c3df2355e94b0bc7
Candidate Decision:
  docs/architecture/sbs-planner-product-role-binding-v1-artifact-version-correction-human-deploy-candidate-decision.md

Human speech-act (verbatim):
  SBS-PLANNER-PRODUCT-ROLE-BINDING-V1
  Artifact / Version Correction
  Human Deploy GO
  Deploy candidate:
  HEAD = f33650442f7b9046dac0bc4354ee3adac3c397b1
  version = 1.0.0.4
  solution id = 4342db47-21a3-4c48-aed1-ef615f55c404
  sppkg sha256 = c4a15dcf63f25a5130904f78c70bd8b3feed8c3f2a4fe99980299e0b7a805890
  artifact id = 10535354012

Human Deploy GO: RECEIVED / CONSUMED
GO bind vs Candidate A: MATCH
Deploy: AUTHORIZED (Human operator / exact Candidate A bytes only)
Agent App Catalog upload: NOT PERFORMED / NOT EXECUTABLE HERE
  DEC-AI-ORG-003: SharePoint App Catalog 登録・更新 = 禁止（この基盤の手順）
  background-agent-contract: deploy / SharePoint mutation = forbidden
FE-F006: OPEN
PL-HTA: NOT EVALUATED / SEPARATE GATE
```

Human Deploy GO ≠ Agent upload ≠ post-deploy PASS ≠ FE-F006 close.

---

## 1. Bound identities (must not change at execution)

```text
DEPLOY CANDIDATE A
source HEAD     = f33650442f7b9046dac0bc4354ee3adac3c397b1
version         = 1.0.0.4
solution id     = 4342db47-21a3-4c48-aed1-ef615f55c404
sppkg sha256    = c4a15dcf63f25a5130904f78c70bd8b3feed8c3f2a4fe99980299e0b7a805890
artifact id     = 10535354012
  name          = b2-production-artifact-f33650442f7b9046dac0bc4354ee3adac3c397b1
  workflow run  = 35317521522
  expired       = false
Review          = PASS / REVIEW-CLEARED
```

Independent re-download of artifact `10535354012` at GO consumption:

```text
inner path = sharepoint/solution/severe-behavior-support-spfx-shell.sppkg
size       = 121376
sha256     = c4a15dcf63f25a5130904f78c70bd8b3feed8c3f2a4fe99980299e0b7a805890  MATCH
AppManifest Version   = 1.0.0.4
AppManifest ProductID = 4342db47-21a3-4c48-aed1-ef615f55c404
build_basis_sha       = f33650442f7b9046dac0bc4354ee3adac3c397b1
```

Must not upload:

```text
post-merge rebuild  7414f9d0… / 6d5f9001…
local rebuild / heft package-solution
git 1.0.0.2 / 6b10c7f7…
live tenant copy    1.0.0.3 / 4175351e…  (rollback retain only)
```

**Do not rebuild** at Deploy time. Use the exact `.sppkg` from artifact `10535354012`.

---

## 2. Agent execution status

```text
PnP / az / m365 CLI in this VM     = NOT PRESENT
Browser App Catalog session        = NOT AUTHENTICATED
Agent App Catalog upload           = NOT PERFORMED
Result                             = EXECUTION HOLD — Human operator runs §4
```

---

## 3. Pre-mutation fail-closed (binding on Human execution)

Immediately before App Catalog mutation, re-read live Tenant. Proceed only if:

```text
live AppManifest = 1.0.0.3
live ProductID   = 4342db47-21a3-4c48-aed1-ef615f55c404 MATCH
```

Last reconciled live (not a substitute for the pre-mutation re-read):

```text
Live Tenant
= 1.0.0.3
= ProductID MATCH
= Deployed true
= CurrentVersionDeployed true
= sha256 4175351e90b716c2a8d62886b58c91f79d0b2cab427fdf2817ce84b792196f40
Collision vs Candidate A
= NONE OBSERVED
= expected upgrade path
```

Any other live version, ProductID mismatch, or unread catalog → **FAIL CLOSED**. Do not upload.

---

## 4. Human operator procedure (authorized now)

Catalog: `https://isogokatudouhome.sharepoint.com/sites/appcatalog`  
Package filename: `severe-behavior-support-spfx-shell.sppkg`

1. **Retain** the current live package (`1.0.0.3` / sha256 `4175351e…` / 117671 bytes) under a **different name/folder**. Do not delete it.
2. Download GitHub Actions artifact `10535354012` (run `35317521522`). Do not rebuild.
3. Confirm inner `.sppkg` sha256 = `c4a15dcf63f25a5130904f78c70bd8b3feed8c3f2a4fe99980299e0b7a805890` and size = `121376`.
4. Re-read live Tenant. Require `1.0.0.3` / ProductID MATCH. Else STOP.
5. Upload / overwrite / publish **that file only**. Do not delete the catalog app to “reinstall”.
6. If NoScript / unexpected warning / enable failure: **STOP**. Do not force. Do not delete.
7. Record post-upload: AppManifest version, ProductID, tenant sha256, Deployed, CurrentVersionDeployed, timestamp.

Preferred (PC + PnP), overwrite only:

```powershell
Add-PnPApp -Path ".\sharepoint\solution\severe-behavior-support-spfx-shell.sppkg" `
  -Scope Tenant `
  -Publish `
  -Overwrite
```

Then `Get-PnPApp -Scope Tenant` for ProductID `4342db47-21a3-4c48-aed1-ef615f55c404`. Expect AppCatalogVersion `1.0.0.4`, Deployed true, CurrentVersionDeployed true.

Rollback: overwrite with the retained `4175351e…` / `1.0.0.3` package. Available only if that file was kept.

---

## 5. Verdict

```text
RESULT: Human Deploy GO = GO / CONSUMED
Authorized action: Human Tenant App Catalog overwrite of Candidate A
Agent upload: NOT PERFORMED
Deploy verification: NOT YET
FE-F006: OPEN until post-deploy identity match
```

---

## 6. STOP (still binding on this agent)

```text
STOP
  ≠ Agent Add / Update / Publish App Catalog
  ≠ install / upgrade from this VM
  ≠ LIVE WRITE by Agent
  ≠ rebuild 6d5f9001… or local package
  ≠ FE-F006 close
  ≠ treat GO as verification PASS
```
