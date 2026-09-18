# SBS-PLANNER-PRODUCT-ROLE-BINDING-V1 — Artifact / Version Correction Implementation Evidence-1

Evidence packet for the authorized `1.0.0.4` correction after Human Implementation Start GO. This record cites the Contracts CI production artifact at the version-metadata HEAD. It does **not** declare Independent Implementation Review PASS, and does **not** authorize Ready, Merge, Human Deploy GO, Deploy, or FE-F006 close.

```text
repository: yasutakesougo/severe-behavior-support-spfx
workstream: SBS-PLANNER-PRODUCT-ROLE-BINDING-V1
unit: SBS-PLANNER-PRODUCT-ROLE-BINDING-V1-ARTIFACT-VERSION-CORRECTION
kind: Implementation Evidence-1
date: 2026-09-18

Human Implementation Start GO: RECEIVED / CONSUMED
  record: docs/architecture/sbs-planner-product-role-binding-v1-artifact-version-correction-human-implementation-start-go.md
locked exact scope blob: 43205dc72b6f200e228222aa8b1f1511decd4053
locked definition blob: 05535205d4bd4c814a9dfab033656441deea97e0
Human Scope Lock blob: 38accd41d15dd968a7864b680648d4ad15946bc5

candidate identity HEAD (version metadata + GO):
  f33650442f7b9046dac0bc4354ee3adac3c397b1
this evidence commit is documentation only
  ≠ new package candidate
  do not substitute a later docs-only HEAD sha256

Ready / Merge / Deploy / LIVE WRITE: NOT AUTHORIZED
Human Deploy GO: NOT ELIGIBLE / NOT CONSUMED
FE-F006: OPEN
Issue #669 close: NOT AUTHORIZED
PL-HTA: NOT EVALUATED / SEPARATE GATE
Fresh Independent Implementation Review: NOT STARTED / NOT CONSUMED
```

This packet does **not** consume Independent Implementation Review, Ready, Merge, or Deploy.

---

## 1. Authorized mutation

```text
file = spfx/config/package-solution.json
field = solution.version
before = 1.0.0.2
after  = 1.0.0.4
```

Preserved:

```text
solution.id     = 4342db47-21a3-4c48-aed1-ef615f55c404
feature.version = 1.0.0.0
feature.id      = 34cf0c0f-1829-48f8-b907-4cb4a2722634
Product source  = unchanged vs f8eed43b except this-unit docs + this field
```

---

## 2. Required CI run

```text
workflow = Contracts and Process CI
job      = Build SPFx production artifact with exact basis
run      = 35317521522
event    = pull_request
checkout SHA asserted = f33650442f7b9046dac0bc4354ee3adac3c397b1
conclusion = success
artifact name = b2-production-artifact-f33650442f7b9046dac0bc4354ee3adac3c397b1
```

`b2-production-artifact-sha256.txt` from that job:

```text
build_basis_sha=f33650442f7b9046dac0bc4354ee3adac3c397b1
c4a15dcf63f25a5130904f78c70bd8b3feed8c3f2a4fe99980299e0b7a805890  sharepoint/solution/severe-behavior-support-spfx-shell.sppkg
```

Independent `sha256sum` of the downloaded `.sppkg` matched that digest.

Forbidden reuse:

```text
current-main 1.0.0.2 sha256
  6b10c7f7c1629d1edc9d80d2c6231dc0dc2aefb5f29a3f0a4fd1810d4f27ce96
  = NOT USED
```

`.sppkg` is not committed.

---

## 3. Generated package identity

Read from the same CI `.sppkg` (`AppManifest.xml` / feature XML):

```text
AppManifest Version   = 1.0.0.4
AppManifest ProductID = 4342db47-21a3-4c48-aed1-ef615f55c404
SkipFeatureDeployment = true
feature Version       = 1.0.0.0
feature Id            = 34cf0c0f-1829-48f8-b907-4cb4a2722634
```

Web part component manifests inside the package remain npm `0.0.1` (`version: "*"`). They are not App Catalog identity.

---

## 4. Candidate identity tuple

```text
source HEAD                         = f33650442f7b9046dac0bc4354ee3adac3c397b1
package-solution.json version       = 1.0.0.4
AppManifest version                 = 1.0.0.4
solution id                         = 4342db47-21a3-4c48-aed1-ef615f55c404
.sppkg sha256                       = c4a15dcf63f25a5130904f78c70bd8b3feed8c3f2a4fe99980299e0b7a805890
Product tree                        = f8eed43b-equivalent except version metadata + this-unit docs
Deploy                              = NONE
```

---

## 5. Boundaries

```text
This packet does NOT:
  declare Independent Implementation Review PASS
  authorize Ready / Merge
  authorize Human Deploy GO
  upload / install / publish / upgrade / Deploy / LIVE WRITE
  close FE-F006
  close Issue #669
  reuse 6b10c7f7… as the new candidate
```

```text
NEXT = Fresh Independent Implementation Review
       against candidate HEAD f3365044… and this tuple

NOT NEXT
= Ready / Merge
= Human Deploy GO
= App Catalog upload
= FE-F006 close
```
