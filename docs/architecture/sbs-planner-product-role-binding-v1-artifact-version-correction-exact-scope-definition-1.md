# SBS-PLANNER-PRODUCT-ROLE-BINDING-V1 — Artifact / Version Correction Exact Scope Definition-1

Docs-only Exact Scope for the later `1.0.0.4` correction implementation surface. This record converts the Human-locked Definition into a finite file / field surface. It does **not** bump the version, does **not** consume Human Scope Lock, and does **not** authorize Implementation Start.

```text
repository: yasutakesougo/severe-behavior-support-spfx
workstream: SBS-PLANNER-PRODUCT-ROLE-BINDING-V1
unit: SBS-PLANNER-PRODUCT-ROLE-BINDING-V1-ARTIFACT-VERSION-CORRECTION
kind: Exact Scope Definition-1
mode: READ ONLY SCOUT → DOCS-ONLY EXACT SCOPE AUTHORSHIP
date: 2026-09-18
status: AUTHORED / AWAITING FRESH INDEPENDENT SCOPE REVIEW

Product basis main: f8eed43b7548af34d0662f43a983118079fbdf8f
scout HEAD: 4ae8efc0be674281f096962a48947d698ab77296

locked definition path:
  docs/architecture/sbs-planner-product-role-binding-v1-artifact-version-correction-definition-1.md
locked definition blob: 05535205d4bd4c814a9dfab033656441deea97e0
locked definition HEAD: d205accb5ab1876d35f391763144cc0fb9ccd25f
Human Correction Definition Lock:
  docs/architecture/sbs-planner-product-role-binding-v1-artifact-version-correction-human-definition-lock.md
  lock HEAD: 4ae8efc0be674281f096962a48947d698ab77296
  lock blob: 250e838b95c93817c8cc17d9ea6420206ce14a9c
Independent Definition Review-1: PASS / REVIEW-CLEARED / CONSUMED
  record: docs/architecture/sbs-planner-product-role-binding-v1-artifact-version-correction-independent-definition-review-1.md
  record HEAD: c209092c8c45ed9df7faaa853e2ae07170e14ed0
  record blob: cea5dded22769ece2ccca54905776af64c573bc3
  P0 = 0
  P1 = 0
  P2 = 2 (Correction NOT REQUIRED; carry-forward)

Human Correction Definition Lock: RECEIVED / CONSUMED (prior; not consumed by this Scope)
Human Scope Lock: NOT CONSUMED
Human Scope Lock Eligibility: NOT YET (await Independent Scope Review PASS)
Implementation Start: NOT AUTHORIZED
package-solution.json mutation by this document: NONE
current package-solution.json solution.version: 1.0.0.2  (MUST REMAIN during this Scope)
1.0.0.4 bump: NOT AUTHORIZED by this Scope
.sppkg build as Deploy candidate publication: NOT AUTHORIZED
Human Ready / Merge (this unit): NOT AUTHORIZED
Human Deploy GO: NOT ELIGIBLE / NOT CONSUMED
Deploy / LIVE WRITE / App Catalog upload: NOT AUTHORIZED
Product / SPFx / domain / schema mutation by this document: NONE
Rewrite locked Definition-1 blob 05535205…: NOT AUTHORIZED
Issue #669 close: NOT AUTHORIZED
FE-F006: OPEN / close NOT AUTHORIZED
PL-HTA: NOT EVALUATED / SEPARATE GATE
```

Creating or reviewing this Scope does **not** authorize `package-solution.json` mutation and does **not** consume Human Scope Lock or Implementation Start.

Human Correction Definition Lock ≠ Exact Scope complete ≠ Independent Scope Review PASS ≠ Human Scope Lock ≠ Implementation Start ≠ Deploy.

---

## 1. Identity / authority

```text
TASK CLASS = SCOUT → SCOPE AUTHORSHIP
RISK = MEDIUM (version collision / overwrite of live catalog — Deploy still OUT)
Product Mutation = FORBIDDEN (this record)
package-solution.json mutation = FORBIDDEN (this record)
Human Gate Consumption = FORBIDDEN (this record)
Tenant Mutation = FORBIDDEN
```

Authority order for this Scope:

1. Locked Definition blob `05535205d4bd4c814a9dfab033656441deea97e0`
2. Human Correction Definition Lock blob `250e838b95c93817c8cc17d9ea6420206ce14a9c`
3. Independent Definition Review-1 PASS / REVIEW-CLEARED (P0=0 / P1=0 / P2=2)
4. Current-main Product / package evidence at `f8eed43b7548af34d0662f43a983118079fbdf8f`

This Scope restates locked meaning only as far as needed to close a finite implementation surface. It does not rewrite the Definition.

If the Definition blob at the locked path is not `05535205d4bd4c814a9dfab033656441deea97e0`, this Scope does not apply.

---

## 2. Locked Definition bind

Preserve AVC-1 through AVC-14. Observable correction meaning (locked; not redesigned here):

```text
AVC-1  VERSION / ARTIFACT LINEAGE MISMATCH
AVC-2  live Tenant 1.0.0.3 = LIVE DEPLOYMENT FACT
       git history rewrite to fabricate 1.0.0.3 = FORBIDDEN
AVC-3  next candidate = 1.0.0.4  (strictly > 1.0.0.3)
AVC-4  solution id = 4342db47-21a3-4c48-aed1-ef615f55c404 UNCHANGED
AVC-5  Product source remains f8eed43b-equivalent except version metadata
AVC-6  App Catalog identity = spfx/config/package-solution.json
       feature.version separate; spfx/package.json is not App Catalog identity
AVC-7  candidate must bind HEAD + 1.0.0.4 + AppManifest 1.0.0.4
       + solution id + sppkg sha256
AVC-8  Deploy current-main 1.0.0.2 / 6b10c7f7… over live 1.0.0.3 = FORBIDDEN
AVC-9  Recovery-2 snapshot is not permanent Deploy authority
AVC-10 same-version / different-artifact = STOP
       live version > candidate 1.0.0.4 = STOP
AVC-11 FE-F006 OPEN until post-deploy identity match
AVC-12 post-deploy SSOT write-back mandatory for FE-F006 closure
AVC-13 Product / FE-F002 / ADMIN_AUDIT = OUT
AVC-14 PL-HTA independent
```

Locked acceptance A1–A12 remain the observable requirements. This Scope does not add Product acceptance.

Definition P2 carry-forward (Correction NOT REQUIRED; this Scope must not expand to “close” them):

| ID | Carry-forward |
|---|---|
| F-DEF-P2-001 | §7 “authorizes” wording is Lock-scope hygiene. Do not treat this Scope as Implementation Start. |
| F-DEF-P2-002 | FE-F006 stays OPEN through Artifact Review and Deploy Readiness because the controlling rule is post-deploy identity match. |

---

## 3. Current-main evidence (scout)

Observed on Product basis `f8eed43b…` / scout tree `4ae8efc0…`. Informative for Scope close. Not a Lock of code. This Scope authorship must leave these values unchanged.

| Surface | Observation | Scope impact |
|---|---|---|
| `spfx/config/package-solution.json` `solution.version` | `1.0.0.2` | **IN** for later implementation only. Exact mutation `1.0.0.2` → `1.0.0.4`. This Scope record must not apply it. |
| `spfx/config/package-solution.json` `solution.id` | `4342db47-21a3-4c48-aed1-ef615f55c404` | **OUT / MUST REMAIN UNCHANGED** |
| `solution.name`, `skipFeatureDeployment`, `isDomainIsolated`, `developer`, `metadata`, `paths.zippedPackage` | present; `skipFeatureDeployment` = true; zip name `solution/severe-behavior-support-spfx-shell.sppkg` | **OUT / UNCHANGED** |
| `features[0].id` | `34cf0c0f-1829-48f8-b907-4cb4a2722634` | **OUT / UNCHANGED** |
| `features[0].version` | `1.0.0.0` | **OUT / UNCHANGED** |
| `spfx/package.json` `version` | `0.0.1` | **OUT.** Not App Catalog identity. Web part `version: "*"` comments say it tracks this field, not `package-solution.json`. |
| `ScaffoldShellWebPart.manifest.json` | `"version": "*"` | **OUT** |
| `LifecycleCreateTestHarnessWebPart.manifest.json` | `"version": "*"` | **OUT** |
| Product / shell / navigation sources | FE-F002 already merged on `f8eed43b` | **OUT.** Mutation NONE. |
| `.github/workflows/contracts-ci.yml` job `build-spfx-production` | Existing “Build SPFx production artifact with exact basis”: checkout SHA assertion, `npm run build`, record `sppkg` sha256 into `b2-production-artifact-sha256.txt`, upload `.sppkg` | **REQUIRED TO RUN** at later implementation HEAD. **OUT to redesign / new workflow.** |
| `scripts/ci/prepare-b2-build-basis.mjs` | Generates B2 harness SHA file during existing `npm run build` | **OUT.** Existing build side-effect. Do not edit. |
| Tests pinning `solution.version` | **NONE found** | Do not invent a new test harness. |
| `spfx/.gitignore` `*.sppkg` | `.sppkg` must not be committed | **KEEP.** Committing `.sppkg` = OUT. |
| `src/governance/ai-autonomy-classifier-gate-evaluator.ts` | `spfx/config/package-solution*` classified L3 | **OUT.** Informational: later bump remains Human Implementation Start, not AI-only. Do not edit classifier. |

No repository evidence requires changing `feature.version`, `spfx/package.json`, web part manifests, Product sources, or CI workflow files to produce App Catalog identity `1.0.0.4`.

If later implementation discovers another file copied into AppManifest / `.sppkg` identity: **STOP = SCOPE EXPANSION REQUIRED**. Do not edit it silently.

---

## 4. Exact IN surface (later implementation, not this record)

### 4.1 Unique runtime / identity mutation

Only this file may change, and only this field:

```text
spfx/config/package-solution.json
  solution.version
    "1.0.0.2" → "1.0.0.4"
```

Authorized:

```text
exactly one JSON string change: solution.version
```

Forbidden on the same file:

```text
solution.id change / ProductId rotation
feature.version change
skipFeatureDeployment change
name / metadata / developer / paths / features[].id change
any second field “while we are here”
```

### 4.2 Unique evidence / docs mutation (later implementation)

Directly related **IN** after a separate Human Implementation Start GO:

```text
docs/architecture/*
  this correction unit only
  (implementation record, artifact identity tuple, CI evidence citation)
```

These docs record the produced candidate. They do not Deploy it.

### 4.3 Unique verification surface (existing; no new code)

```text
REQUIRED RUN
  workflow: .github/workflows/contracts-ci.yml
  job:     build-spfx-production
  name:    Build SPFx production artifact with exact basis

REQUIRED BIND from that job at implementation HEAD
  checkout SHA == implementation HEAD
  b2-production-artifact-sha256.txt contains
    .sppkg sha256 of severe-behavior-support-spfx-shell.sppkg
  do not substitute a locally rebuilt package from a different HEAD
  do not reuse current-main sha256 6b10c7f7…

REQUIRED READ from the same produced .sppkg (evidence, not new harness)
  AppManifest Version = 1.0.0.4
  solution id inside package / package-solution.json = 4342db47-21a3-4c48-aed1-ef615f55c404

NEW verification source / new workflow / new smoke / new unit test
  = NONE
```

AppManifest read is independently necessary (locked A7). It is satisfied by reading the **existing** CI-produced `.sppkg`, not by adding a new test tree. Editing `contracts-ci.yml` to print AppManifest is **not** required. If implementation cannot read AppManifest from that artifact without new code: **STOP = SCOPE EXPANSION REQUIRED**.

Existing `heft test --clean --production` that already runs inside `npm run build` remains regression only. No Product test changes.

---

## 5. Exact OUT surface

```text
spfx/package.json
spfx/package-lock.json
spfx/src/** (all Product / shell / webpart / domain / adapters)
spfx/src/webparts/**/*.manifest.json
spfx/config/write-manifests.json
spfx/config/config.json
spfx/config/package-solution.json features[].version
.github/workflows/**  (including contracts-ci.yml redesign)
scripts/**
src/governance/**
spfx/smoke/**
committed .sppkg
Tenant / App Catalog / LIVE WRITE
Entra / SharePoint data / schema
FE-F002 Product files
AppShellChrome.tsx
ScaffoldShell.tsx
ScaffoldShell.module.scss
planner-task-navigation.ts
field-staff-task-navigation.ts
ADMIN_AUDIT / FE-F001 / FE-F003
PL-HTA
Issue #669 close
FE-F006 close
git history rewrite
fabricated 1.0.0.3 commit
Deploy of 1.0.0.2 / 6b10c7f7… over live 1.0.0.3
```

---

## 6. Uniqueness leftovers

Implementers must not choose among competing surfaces.

| Question | Unique close |
|---|---|
| Which file is App Catalog package identity? | `spfx/config/package-solution.json` only |
| Which field bumps? | `solution.version` only |
| From → to | `1.0.0.2` → `1.0.0.4` |
| Solution ID | `4342db47-21a3-4c48-aed1-ef615f55c404` unchanged |
| Feature version | `1.0.0.0` unchanged |
| npm package version | `spfx/package.json` `0.0.1` unchanged |
| Web part manifests | `"version": "*"` unchanged |
| Product tree | `f8eed43b`-equivalent; mutation NONE |
| How is the package built? | Existing Contracts CI `build-spfx-production` at exact implementation HEAD |
| How is sha256 obtained? | Existing `b2-production-artifact-sha256.txt` from that job |
| How is AppManifest proven? | Read Version from the same produced `.sppkg` |
| New verification code? | NONE unless STOP = SCOPE EXPANSION |
| Does bump close FE-F006? | NO |
| Does this Scope authorize the bump? | NO |

No uniqueness leftover remains inside this unit.

---

## 7. FE-F006 / Deploy boundary

```text
FE-F006 = OPEN
```

Version bump, CI package build, Independent Implementation Review, Artifact Review, and Deploy Readiness **must not** close FE-F006.

FE-F006 closes only after a later, separately gated post-deploy proof:

```text
intended repository artifact = live Tenant artifact
```

with version and sha256 evidence, plus mandatory SSOT write-back (locked A12 / §12).

This Scope does **not** authorize:

```text
upload / install / publish / upgrade / Deploy / LIVE WRITE
live catalog mutation
Human Deploy GO
```

Live catalog must be re-read before any future Human Deploy decision. Recovery-2 is not permanent authority. Collision rules in locked Definition §10 remain controlling.

---

## 8. Acceptance mapped to this Scope

| ID | Scope close |
|---|---|
| A1–A2 | Historical `1.0.0.3` / no git rewrite. No Scope file work. |
| A3 | Unique mutation `solution.version` → `1.0.0.4` (later implementation). |
| A4 | `solution.id` OUT / unchanged. |
| A5 | Product paths OUT. Diff vs `f8eed43b` limited to §4 IN. |
| A6 | Existing CI job at exact implementation HEAD. |
| A7 | AppManifest Version read from that `.sppkg` = `1.0.0.4`. |
| A8 | Existing sha256 evidence file from that job. |
| A9 | Deploy OUT of this unit and of later implementation until a separate Human Deploy GO. |
| A10 | Live re-read is a future Deploy-readiness requirement, not this Scope mutation. |
| A11 | Collision handling remains Definition §10; not implemented as Tenant write here. |
| A12 | FE-F006 stays OPEN; write-back is post-deploy only. |

---

## 9. STOP / HOLD for later implementation

Implementation (when separately authorized) must STOP if:

```text
Definition blob ≠ 05535205…
solution.id would change
feature.version would change
spfx/package.json or manifests would change
Product source would change
a second identity-bearing file is required
new verification harness is invented without Scope Expansion
.sppkg would be committed
Tenant / App Catalog write is attempted
FE-F006 close is claimed from bump or build
candidate version ≤ live Tenant version after a fresh live read
same-version / different-hash collision
```

---

## 10. Gate state

```text
Exact Scope Definition-1                         = AUTHORED / AWAITING FRESH INDEPENDENT SCOPE REVIEW
Human Correction Definition Lock                 = CONSUMED (prior)
Human Scope Lock                                 = NOT CONSUMED
Implementation Start                             = NOT AUTHORIZED
package-solution.json solution.version           = 1.0.0.2 (unchanged by this record)
Human Deploy GO                                  = NOT ELIGIBLE / NOT CONSUMED
Deploy / LIVE WRITE                              = NOT AUTHORIZED
FE-F006                                          = OPEN
PL-HTA                                           = NOT EVALUATED / SEPARATE GATE
Product Mutation                                 = NONE
Tenant Mutation                                  = NONE
```

Authorship self-check:

```text
IN files authored now
  = this Exact Scope markdown only
package-solution.json
  = 1.0.0.2
solution.id
  = 4342db47-21a3-4c48-aed1-ef615f55c404
P0 = none
P1 = none
P2 = none new (Definition P2 carry-forward only)
```

---

## 11. NEXT

```text
NEXT = Fresh Independent Scope Review
       against this Exact Scope body
       bound to locked Definition blob 05535205…

NOT NEXT
= Human Scope Lock
= Implementation Start
= package-solution.json edit
= 1.0.0.4 bump
= .sppkg build as Deploy candidate publication
= Human Deploy GO
= App Catalog upload
= FE-F006 close
= Issue #669 close
= PL-HTA
```

```text
STOP = Exact Scope authored
     = no Product mutation
     = no package-solution.json mutation
     = no Deploy
     = no Human Scope Lock consumed
     = no Implementation Start
```
