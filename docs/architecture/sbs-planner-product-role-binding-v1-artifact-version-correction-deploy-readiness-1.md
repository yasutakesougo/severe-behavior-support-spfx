# SBS-PLANNER-PRODUCT-ROLE-BINDING-V1 — Artifact / Version Correction Deploy Readiness-1

Read-only Deploy Readiness after PR #679 merge. This record performs / records the required **live Tenant App Catalog re-read attempt** and collision-policy application. It does **not** consume Human Deploy GO and does **not** authorize Deploy / LIVE WRITE.

```text
repository: yasutakesougo/severe-behavior-support-spfx
workstream: SBS-PLANNER-PRODUCT-ROLE-BINDING-V1
unit: SBS-PLANNER-PRODUCT-ROLE-BINDING-V1-ARTIFACT-VERSION-CORRECTION
kind: Deploy Readiness-1
mode: READ ONLY tenant observation + Candidate A bind
date: 2026-09-18

origin/main: 7414f9d08f6fcf64829fad66c3df2355e94b0bc7
PR #679: MERGED
git package version on main: 1.0.0.4
solution id: 4342db47-21a3-4c48-aed1-ef615f55c404

Human Merge GO: CONSUMED / Merge SUCCESS
DEPLOY READINESS: READY FOR HUMAN DEPLOY CANDIDATE DECISION
Human Deploy GO Eligibility: ELIGIBLE
Human Deploy GO: RECEIVED / CONSUMED (Candidate A)
Deploy: AUTHORIZED (Human operator / exact c4a15dcf… bytes)
Agent App Catalog upload: NOT PERFORMED
FE-F006: OPEN
Issue #669: CLOSED on GitHub (Definition Draft-1; this record does not reopen)
PL-HTA: NOT EVALUATED / SEPARATE GATE
Recovery-2 snapshot: NOT LIVE AUTHORITY (AVC-9)
Live catalog identity: OBSERVED
Deployed / CurrentVersionDeployed: true / true
Bound Deploy candidate: A (c4a15dcf…)
GO record: docs/architecture/sbs-planner-product-role-binding-v1-artifact-version-correction-human-deploy-go.md
```

Human Merge ≠ Deploy Readiness PASS ≠ Human Deploy GO ≠ Deploy.

---

## 1. Authorized reviewed candidate (Independent Implementation Review-1)

```text
source HEAD           = f33650442f7b9046dac0bc4354ee3adac3c397b1
package version       = 1.0.0.4
AppManifest version   = 1.0.0.4
solution id           = 4342db47-21a3-4c48-aed1-ef615f55c404
.sppkg sha256         = c4a15dcf63f25a5130904f78c70bd8b3feed8c3f2a4fe99980299e0b7a805890
workflow run          = 35317521522
artifact id           = 10535354012
Review-1              = PASS / REVIEW-CLEARED
```

This remains the **reviewed** 1.0.0.4 package identity and is now the **bound Deploy Candidate A**. See `docs/architecture/sbs-planner-product-role-binding-v1-artifact-version-correction-human-deploy-candidate-decision.md`.

---

## 2. Post-merge main rebuild (same version / different artifact)

Contracts CI on `origin/main` push `7414f9d0…` (run `35323534871`) produced a second 1.0.0.4 package because `B2_HARNESS_BUILD_BASIS_SHA` is the merge commit SHA:

```text
build_basis_sha       = 7414f9d08f6fcf64829fad66c3df2355e94b0bc7
AppManifest version   = 1.0.0.4
ProductID             = 4342db47-21a3-4c48-aed1-ef615f55c404
.sppkg sha256         = 6d5f9001b033c3a726a46c91f9a4b6c0ec5c7dec16c2210068e1101b72a27e71
artifact name         = b2-production-artifact-7414f9d08f6fcf64829fad66c3df2355e94b0bc7
```

```text
c4a15dcf…  ≠  6d5f9001…
same AppManifest version 1.0.0.4
= SAME-VERSION / DIFFERENT-ARTIFACT (git-side)
```

Locked Definition §10 same-version / different-artifact STOP applies to **live Tenant vs candidate**. Candidate A is the named `.sppkg` sha256. A main-tip rebuild is **not** Candidate A. Deploy must use the exact `c4a15dcf…` bytes (no rebuild).

Superseded / must not deploy:

```text
1.0.0.2 / 6b10c7f7c1629d1edc9d80d2c6231dc0dc2aefb5f29a3f0a4fd1810d4f27ce96
```

---

## 3. Live Tenant catalog re-read (dual channel)

Required by locked Definition §10 / AVC-9 before any Human Deploy decision.

Observation-2 packet (browser channel kept): `docs/architecture/sbs-planner-product-role-binding-v1-artifact-version-correction-live-catalog-observation-2.md`

```text
Browser channel
= NOT AUTHENTICATED
= Microsoft Sign-in redirect
= screenshot CONFIRMED
= 2026-09-18T08:39:36Z

Authenticated SharePoint channel
= LIVE READ AVAILABLE
= Tenant Mutation NONE
= reconciliation 2026-09-18T08:47:36Z

App Catalog site
= isogokatudouhome.sharepoint.com/sites/appcatalog
package
= severe-behavior-support-spfx-shell.sppkg
live AppManifest version
= 1.0.0.3
live ProductID
= 4342db47-21a3-4c48-aed1-ef615f55c404
= MATCH
live tenant sppkg sha256
= 4175351e90b716c2a8d62886b58c91f79d0b2cab427fdf2817ce84b792196f40
catalog file updated_at
= 2026-09-15T05:07:47Z
Deployed (Human live flag recovery; 2026-09-18)
= true
CurrentVersionDeployed (Human live flag recovery; 2026-09-18)
= true
```

Independent unpack of the two Human-uploaded catalog copies: identical, sha256 `4175351e…`, AppManifest `Version="1.0.0.3"`, ProductID match.

```text
Live catalog identity = OBSERVED
Deployed / CurrentVersionDeployed = true / true
```

Matching Recovery-2 hash is **live re-observation**, not Recovery-2 as Deploy authority.

---

## 4. Collision policy (applied to reconciled live identity)

```text
candidate = 1.0.0.4
live      = 1.0.0.3

live > 1.0.0.4                         = FALSE  → VERSION COLLISION = NONE OBSERVED
live == 1.0.0.4 AND sha256 mismatch    = FALSE  → SAME-VERSION / DIFFERENT-ARTIFACT vs live = NONE OBSERVED
live == 1.0.0.3 AND ProductID match    = TRUE   → expected upgrade path
live ProductID != 4342db47-…           = FALSE  → SOLUTION IDENTITY MISMATCH = NONE OBSERVED
```

```text
Collision = NONE OBSERVED
```

Expected upgrade path still requires a **separate** Human Deploy GO bound to Candidate A.

Git-side second `1.0.0.4` (`6d5f9001…`) is **not** interchangeable with Candidate A:

```text
Bound Deploy Candidate A    f3365044… / c4a15dcf… / artifact 10535354012
Post-merge rebuild          7414f9d0… / 6d5f9001… = MUST NOT USE
same 1.0.0.4 ≠ interchangeable
silent substitution / rebuild = FORBIDDEN
```

---

## 5. Deploy Readiness verdict

```text
DEPLOY READINESS
= READY FOR HUMAN DEPLOY CANDIDATE DECISION

Live Tenant
= 1.0.0.3
= ProductID MATCH
= Deployed true
= CurrentVersionDeployed true
= sha256 4175351e...

Collision
= NONE OBSERVED

FE-F006
= OPEN

Human Deploy GO Eligibility
= ELIGIBLE

Human Deploy GO
= RECEIVED / CONSUMED

Deploy
= AUTHORIZED (Human operator / Candidate A only)

Agent App Catalog upload
= NOT PERFORMED

Bound candidate
= A / c4a15dcf… / artifact 10535354012

Tenant Mutation During this record
= NONE
```

Human Deploy GO consumed: `docs/architecture/sbs-planner-product-role-binding-v1-artifact-version-correction-human-deploy-go.md`. Agent does not upload. Human re-reads live Tenant immediately before mutation; fail closed if not still `1.0.0.3` / ProductID MATCH. Do not rebuild.

---

## 6. STOP

```text
STOP
  ≠ Human Deploy GO
  ≠ Add / Update / Publish App Catalog
  ≠ install / upgrade
  ≠ LIVE WRITE
  ≠ FE-F006 close
  ≠ Issue #669 close
  ≠ reuse Recovery-2 as live catalog
  ≠ deploy 1.0.0.2 / 6b10c7f7…
  ≠ treat unreviewed 6d5f9001… as Review-1 identity
  ≠ Agent App Catalog upload (Human operator only, after GO)
```
