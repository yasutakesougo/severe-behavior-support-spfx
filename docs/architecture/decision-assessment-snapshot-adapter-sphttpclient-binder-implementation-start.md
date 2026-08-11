# Decision-AS-ADAPTER-SPHTTPCLIENT-BINDER-IMPLEMENTATION-START-1

## Authority

Human GO received for **synthetic SPHttpClient binder Implementation Start** after:

```text
Decision-AS-ADAPTER-SPHTTPCLIENT-BINDING-1 = ACCEPTED / LOCKED / B1 PREREQUISITE-FIRST
Decision-AS-ADAPTER-SPFX-VERSION-SCAFFOLD-1 = ACCEPTED / LOCKED / V-1 + A + D-HOLD
Scaffold materialization + Heft verification = PASS（PR #228 stack）
```

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-AS-ADAPTER-SPHTTPCLIENT-BINDER-IMPLEMENTATION-START-1
Status: ACCEPTED / STARTED（docs + code slice）
Human Decision: GO
Kind: Binder Implementation Start（synthetic/local verification）
PR: #229
```

## Authorized IN

```text
IN:
  concrete SPFx SPHttpClient List Items transport under spfx/
  import @microsoft/sp-http@1.23.2 inside the isolated SPFx boundary
  AssessmentSnapshots list only
  TR-1-A / TC-1-A REST surfaces（create / MERGE update / filtered read）
  preserve CL-1-A omit-on-create and CL-1-B null-on-clear payload semantics
  synthetic/local doubles（SV-1-A）
  update root host seam marker to point at the spfx binder module
  Heft build + Jest verification inside spfx/
```

## Explicit OUT / FORBIDDEN

```text
OUT:
  live tenant read
  live tenant write
  SharePoint / M365 / Entra mutation
  Deploy / App Catalog / real data
  root package.json / root TypeScript mutation
  Ready / Merge of stacked Draft PRs（HUMAN-ONLY）
  wiring that auto-executes binder methods against a real site
```

## Delivered surface

```text
spfx/src/adapters/assessment-snapshot/sphttpclient-list-transport.ts
spfx/src/adapters/assessment-snapshot/transport-types.ts
spfx/src/adapters/assessment-snapshot/sphttpclient-list-transport.test.ts
spfx/src/adapters/assessment-snapshot/index.ts

root marker update:
  src/adapters/sharepoint/assessment-snapshot/transport-seam.ts
  SPFX_SPHTTPCLIENT_HOST_SEAM.bindWhenAvailable = true
  liveTenantIoAuthorized = false
```

## Verification

```text
spfx heft build: PASS
spfx Jest（synthetic double）: PASS（6 tests）
  create omit supersedes
  MERGE null clear（CL-1-B）
  MERGE omit ≠ clear
  filtered getBySnapshotId
  403 -> FORBIDDEN / empty -> NOT_FOUND
  synthetic URL only（no live tenant）
root unit tests: PASS（524）
root typecheck / lint / format:check: PASS

Live tenant I/O: NOT RUN / NOT AUTHORIZED
Deploy: NOT RUN / NOT AUTHORIZED
```

## IR-P2-002 disposition

```text
IR-P2-002 close condition（B1）:
  closes only after an actually authorized concrete SPHttpClient binder
  exists and has passed its required verification.

This Implementation Start delivers the concrete binder + synthetic verification.
IR-P2-002 = CLOSED / VERIFIED（synthetic/local）
  ≠ live tenant verification
  ≠ Deploy authorization
```

## Stop condition

```text
Binder Implementation Start = GO / DELIVERED（synthetic）
Next gates（separate Human GO each）:
  Independent Review / Human Ready / Human Merge
  separate live-read verification GO
  separate live-write / Deploy GO
```
