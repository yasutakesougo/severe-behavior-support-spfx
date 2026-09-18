# SBS-PLANNER-PRODUCT-ROLE-BINDING-V1 — Artifact / Version Correction Definition-1

Docs-only Definition for reconciling git package-version SSOT with the live Tenant App Catalog after SBS-PLANNER-PRODUCT-ROLE-BINDING-V1 merge. This record does **not** implement the correction, does **not** mutate `package-solution.json`, and does **not** authorize Deploy.

```text
repository: yasutakesougo/severe-behavior-support-spfx
workstream: SBS-PLANNER-PRODUCT-ROLE-BINDING-V1
unit: SBS-PLANNER-PRODUCT-ROLE-BINDING-V1-ARTIFACT-VERSION-CORRECTION
kind: Artifact / Version Correction Definition-1
mode: READ ONLY SCOUT → DOCS-ONLY DEFINITION AUTHORSHIP
date: 2026-09-18
status: AUTHORED / AWAITING FRESH INDEPENDENT DEFINITION REVIEW

Product basis main: f8eed43b7548af34d0662f43a983118079fbdf8f
Related Product Issue: #669 OPEN (FE-F002 Product; not closed by this unit)
Related Deploy lineage Issue: #602 CLOSED (SBS-MGMT-HOME-DEPLOY-V1 post-deploy 1.0.0.3)

Human Correction Definition Lock: NOT CONSUMED
Implementation Start: NOT AUTHORIZED
Human Deploy GO: NOT ELIGIBLE / NOT CONSUMED
Deploy / LIVE WRITE / App Catalog upload: NOT AUTHORIZED
package-solution.json mutation by this document: NONE
Product mutation by this document: NONE
Issue #669 close: NOT AUTHORIZED
FE-F006 close: NOT AUTHORIZED
PL-HTA: NOT EVALUATED / NOT CONSUMED
```

Prior workstream gates (Definition Lock / Scope Lock / Implementation Start / Ready / Merge for FE-F002 Product) do **not** authorize this correction unit.

Human Correction Definition Lock ≠ Implementation Start ≠ Human Deploy GO ≠ Deploy.

---

## 1. Identity

```text
TASK CLASS = DEFINITION AUTHORSHIP
RISK = MEDIUM (version collision / overwrite of live catalog)
Product Mutation = FORBIDDEN (this record)
package-solution.json mutation = FORBIDDEN (this record)
Tenant Mutation = FORBIDDEN
```

Authority order:

1. Live Tenant App Catalog evidence (Recovery-2): AppManifest `1.0.0.3`, solution id match, tenant sppkg sha256 `4175351e…`
2. Git SSOT on `origin/main` `f8eed43b…`: `package-solution.json` `solution.version` = `1.0.0.2`
3. Lineage: Issue #602 post-deploy record (2026-09-15T07:36:12Z) AppCatalogVersion `1.0.0.3` bound to main `5b777001…`
4. Git version history: `1.0.0.0` → `1.0.0.1` → `1.0.0.2`; `1.0.0.3` never committed

If live tenant solution id is not `4342db47-21a3-4c48-aed1-ef615f55c404`, this Definition does not apply.

If live tenant AppManifest is no longer `1.0.0.3` when implementation or Deploy is later attempted, re-read and apply §10 collision rules. Do not assume this snapshot is still live.

---

## 2. Current evidence

Repository target (deployment candidate that **must not** be uploaded):

```text
main: f8eed43b7548af34d0662f43a983118079fbdf8f
git package version: 1.0.0.2
solution id: 4342db47-21a3-4c48-aed1-ef615f55c404
CI candidate sppkg sha256: 6b10c7f7c1629d1edc9d80d2c6231dc0dc2aefb5f29a3f0a4fd1810d4f27ce96
feature.version (unchanged historically): 1.0.0.0
skipFeatureDeployment: true
```

Live Tenant (Recovery-2; current at observation):

```text
catalog site: https://isogokatudouhome.sharepoint.com/sites/appcatalog
library: SharePoint 用アプリ /sites/appcatalog/AppCatalog
package filename: severe-behavior-support-spfx-shell.sppkg
solution id: 4342db47-21a3-4c48-aed1-ef615f55c404
AppManifest version: 1.0.0.3
tenant sppkg sha256: 4175351e90b716c2a8d62886b58c91f79d0b2cab427fdf2817ce84b792196f40
tenant package updated_at: 2026-09-15T05:07:47Z
```

Lineage:

```text
Issue #602 SBS-MGMT-HOME-DEPLOY-V1
post-deploy: AppCatalogVersion 1.0.0.3 / Deployed true / CurrentVersionDeployed true
bound repository main: 5b777001027af8b3b0e75f8031a65a248f0fd189
5b777001 is an ancestor of f8eed43b
#602 definition body still named git Version 1.0.0.2
1.0.0.3 was not written back to package-solution.json
```

Product delta (informational; not a Product defect):

```text
tenant Product lineage HEAD = 5b777001
current main Product HEAD = f8eed43b
#674 FE-F002 role-binding files exist on f8eed43b and not on 5b777001
```

---

## 3. Established defect

```text
classification = VERSION / ARTIFACT LINEAGE MISMATCH
```

Root cause:

```text
A controlled tenant Deploy (#602) left App Catalog at AppManifest 1.0.0.3
while git SSOT remaining at 1.0.0.2.
The FE-F002 Product merge (#674) then produced a 1.0.0.2 CI package
(sha256 6b10c7f7…) that is version-older than live catalog and
Product-newer than the tenant package tree.
```

This is **not**:

```text
foreign ProductId
unknown Tenant package
unexplained unauthorized solution
FE-F002 Product correction defect
```

Same Solution ID is confirmed.

Forbidden action under this defect:

```text
Deploy current 1.0.0.2 candidate (6b10c7f7…) over live 1.0.0.3 (4175351e…)
```

---

## 4. Historical lineage interpretation

```text
1.0.0.3
= LIVE DEPLOYMENT FACT
= historically deployed (Issue #602 post-deploy record + Recovery-2 unpack)
= independently confirmed
= not represented in git package-version SSOT
```

Forbidden treatments:

```text
rewrite git history to insert package-solution.json version 1.0.0.3
fabricate a missing 1.0.0.3 source artifact / commit as if it predated #602
claim 1.0.0.3 was never deployed
treat historical docs catalog 1.0.0.1 as current
```

The correction must keep git history honest: recorded versions remain `1.0.0.0` → `1.0.0.1` → `1.0.0.2` → **next controlled candidate** (skip fabricating `1.0.0.3` in git). The skip is an explicit reconciliation of live fact vs SSOT lag, not a missing increment to invent later.

---

## 5. Version policy

Repository convention (observed):

```text
spfx/config/package-solution.json solution.version
  1.0.0.0  (scaffold)
  1.0.0.1  (internal tenant release bump; catalog was 1.0.0.0)
  1.0.0.2  (B2 harness package slice; ProductId unchanged)
fourth-component increment only
feature.version remained 1.0.0.0 across those bumps
skipFeatureDeployment remained true
```

Normative next candidate:

```text
next candidate version = 1.0.0.4
constraint: next candidate > 1.0.0.3
```

`1.0.0.4` is the smallest fourth-component value strictly greater than live `1.0.0.3` and consistent with existing `1.0.0.x` increments. Do not select `1.0.0.3` or any lesser version.

```text
solution id = 4342db47-21a3-4c48-aed1-ef615f55c404  UNCHANGED
feature.version = 1.0.0.0  UNCHANGED unless later evidence proves SPFx requires otherwise
  (no repository evidence currently requires a feature version bump)
```

If implementation discovers another version-bearing file that is copied into AppManifest / `.sppkg` identity, **STOP = SCOPE EXPANSION REQUIRED**. Do not silently edit it.

---

## 6. Product boundary

```text
Product mutation = NONE
Product basis = main f8eed43b7548af34d0662f43a983118079fbdf8f
```

Forbidden Product / domain paths (not authorized by this unit):

```text
spfx/src/shell/ux/AppShellChrome.tsx
spfx/src/webparts/scaffoldShellWebPart/components/ScaffoldShell.tsx
spfx/src/webparts/scaffoldShellWebPart/components/ScaffoldShell.module.scss
planner-task-navigation.ts
field-staff-task-navigation.ts
domain / schema / persistence / SharePoint data / authorization / Entra
ADMIN_AUDIT Task-First / FE-F001 / FE-F003
```

FE-F002 Product remains as merged. This unit does not redesign PLANNER navigation.

---

## 7. Expected implementation surface

Implementation (when separately authorized) **IN**:

```text
spfx/config/package-solution.json
  = solution.version only
  = 1.0.0.2 → 1.0.0.4
  = solution.id MUST remain 4342db47-21a3-4c48-aed1-ef615f55c404
```

Directly related **IN** (verification / evidence; not Product):

```text
docs/architecture/* for this correction unit
  (implementation record, artifact identity, post-deploy SSOT write-back template)
optional version-identity check
  (assert package-solution.json solution.version == intended 1.0.0.4
   and/or record AppManifest version from the produced .sppkg)
CI production package job evidence at the implementation HEAD
  (existing Contracts CI "Build SPFx production artifact with exact basis")
```

**OUT** unless STOP = SCOPE EXPANSION:

```text
spfx/package.json version (currently 0.0.1; not App Catalog identity)
feature.version (1.0.0.0)
.sppkg committed into git
Product / smoke harness behavior changes
unrelated CI workflow redesign
```

This Definition authorizes **metadata + evidence** only. It does **not** authorize App Catalog upload.

---

## 8. Artifact identity requirements

Later implementation and any future Deploy eligibility packet MUST record:

```text
package-solution.json solution.version
AppManifest version (from produced .sppkg)
solution id
source HEAD (git SHA)
.sppkg sha256
Product tree identity (must remain f8eed43b-equivalent except version metadata)
```

Filename `severe-behavior-support-spfx-shell.sppkg` is not sufficient identity.

Solution ID change is **forbidden**.

---

## 9. Reproducibility

The correction implementation must produce the candidate package from a **fixed repository HEAD** after the `1.0.0.4` metadata commit (or the same HEAD if version and evidence land together).

Required evidence tuple:

```text
source HEAD
package-solution.json version = 1.0.0.4
AppManifest version = 1.0.0.4
sppkg sha256
solution id = 4342db47-21a3-4c48-aed1-ef615f55c404
```

The `.sppkg` must be attributable to that exact HEAD (CI production package job with checkout SHA assertion, matching current Contracts CI pattern).

Do not substitute a locally rebuilt package from a different HEAD.

Do not use the current-main `1.0.0.2` sha256 `6b10c7f7…` as the new candidate identity.

---

## 10. Collision rules

Before any future Human Deploy decision, **re-read live Tenant App Catalog** (authenticated read-only).

```text
If live AppManifest / AppCatalogVersion > 1.0.0.4
  STOP = VERSION COLLISION
  (select a new candidate > live version; do not overwrite)

If live version == 1.0.0.4 AND live sppkg sha256 != candidate sha256
  STOP = SAME-VERSION / DIFFERENT-ARTIFACT COLLISION
  (no overwrite-by-assumption)

If live version == 1.0.0.3 AND candidate is 1.0.0.4 with matching solution id
  collision class = expected upgrade path
  (still requires separate Human Deploy GO; this Definition does not authorize it)

If live solution id != 4342db47-21a3-4c48-aed1-ef615f55c404
  STOP = SOLUTION IDENTITY MISMATCH
```

No overwrite-by-assumption. Version equality is not artifact equality.

---

## 11. FE-F006 closure rule

```text
FE-F006 = OPEN
```

until future **post-deploy** verification proves:

```text
repository intended artifact
= deployed tenant artifact
```

with exact version and sha256 evidence.

FE-F006 must **not** close at version-bump implementation time, at Independent Implementation Review, or at Human Ready.

---

## 12. Post-deploy SSOT rule

To prevent recurrence of the #602 git/catalog split, any future Deploy that uses this candidate **must** record durably (repository docs, same correction unit or dedicated post-deploy record) at least:

```text
repository main / deploy HEAD
package-solution.json version
App Catalog / AppManifest version
solution id
deployed sppkg sha256
CurrentVersionDeployed (or tenant-tooling equivalent)
deployment timestamp
```

Git/repository record and tenant record must not intentionally diverge without an explicit reconciliation record.

This rule is **binding on a future Deploy unit**. It is not authorization to Deploy now.

---

## 13. Acceptance A1–A12

| ID | Requirement | Evidence when implemented |
|---|---|---|
| A1 | Known Tenant version `1.0.0.3` is represented as live historical fact | This Definition §2 / §4; not a fake git commit |
| A2 | Git history is not rewritten to fabricate `1.0.0.3` | no history rewrite; next git version is `1.0.0.4` |
| A3 | Next candidate version is strictly greater than `1.0.0.3` | `package-solution.json` `1.0.0.4` |
| A4 | Solution ID unchanged | `4342db47-21a3-4c48-aed1-ef615f55c404` |
| A5 | Product source tree remains `f8eed43b`-equivalent except version/artifact metadata | diff vs `f8eed43b` limited to §7 IN |
| A6 | New package reproducibly built from exact implementation HEAD | CI package job + SHA bind |
| A7 | New AppManifest version matches intended candidate | unpack / manifest read = `1.0.0.4` |
| A8 | New sppkg SHA-256 is recorded | CI evidence file / correction record |
| A9 | No Deploy during correction implementation | no Add/Update/Publish-PnPApp |
| A10 | Live catalog version re-read before future Human Deploy decision | read-only Recovery before Deploy GO |
| A11 | Same-version / different-artifact collision fails closed | §10 |
| A12 | Post-deploy version/artifact write-back is mandatory for final FE-F006 closure | §11 / §12 |

---

## 14. Out of scope

```text
Product feature changes
FE-F002 redesign
ADMIN_AUDIT Task-First
FE-F001
FE-F003
PL-HTA
Deploy
App Catalog upload
LIVE WRITE
SharePoint data changes
Entra changes
Issue #669 close
historical git rewrite
retroactive fake 1.0.0.3 commit
closing FE-F006 at implementation time
changing Solution ID
committing .sppkg
```

---

## 15. Gate state

```text
Artifact / Version Correction Definition-1     = AUTHORED / AWAITING FRESH INDEPENDENT DEFINITION REVIEW
Human Correction Definition Lock               = NOT CONSUMED
Implementation Start                           = NOT AUTHORIZED
Human Ready / Merge (this unit)                = NOT AUTHORIZED
Human Deploy GO                                = NOT ELIGIBLE / NOT CONSUMED
Deploy / LIVE WRITE / App Catalog              = NOT AUTHORIZED
FE-F006                                        = OPEN
PL-HTA                                         = NOT EVALUATED / SEPARATE GATE
Issue #669 close                               = NOT AUTHORIZED
```

Independent Definition Review PASS ≠ Human Correction Definition Lock ≠ Implementation Start ≠ Deploy.

Authorship self-check (this unit; not Independent Definition Review):

```text
P0 = none
P1 = none
P2 = live Tenant AppManifest 1.0.0.3 is a snapshot (Recovery-2).
     Implementation and Deploy units must re-read catalog; this Definition
     does not freeze tenant state.
```

Confirmed on authorship HEAD `f8eed43b`:

```text
package-solution.json solution.version = 1.0.0.2
package-solution.json solution.id = 4342db47-21a3-4c48-aed1-ef615f55c404
git package-solution.json history = 1.0.0.0 → 1.0.0.1 → 1.0.0.2
1.0.0.3 in git package-solution.json = NOT PRESENT
this Definition mutates package-solution.json = NO
```

---

## 16. NEXT

```text
NEXT = Fresh Independent Definition Review
       against this Definition body only

NOT NEXT
= Human Correction Definition Lock
= Implementation Start
= package-solution.json edit
= .sppkg build as a Deploy candidate publication
= Human Deploy GO
= App Catalog upload
= FE-F006 close
= Issue #669 close
= PL-HTA
```

Expected later lifecycle (**not authorized here**):

```text
Independent Definition Review PASS
→ Human Correction Definition Lock
→ Exact Scope (if Review requires a finite file surface lock)
→ Implementation Start (version metadata + evidence only)
→ reproducible 1.0.0.4 package from exact HEAD
→ Independent Implementation Review
→ Deploy Readiness Review (live catalog re-read)
→ Human Deploy GO (separate)
→ tenant deployment (separate)
→ post-deploy SSOT write-back
→ FE-F006 close eligibility
```

```text
STOP = Definition authored
     = self-verification complete
     = no Product mutation
     = no package-solution.json mutation
     = no Deploy
     = no Human gate consumed
```
