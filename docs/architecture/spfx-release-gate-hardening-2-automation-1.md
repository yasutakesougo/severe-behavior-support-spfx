# SPFX-RELEASE-GATE-HARDENING-2-AUTOMATION-1

## Status

Implementation slice for the deterministic, tenant-independent subset of SPFx release GATE 0.

CORRECTION-1 extends the inspector so a commercial `.sppkg` can be inspected directly without requiring the vendor's source `package-solution.json`.

This slice does not authorize deployment, Production Binding, App Catalog mutation, API permission approval, SharePoint mutation, Microsoft Entra mutation, or LIVE WRITE.

## Objective

Convert the GATE 0 package-inspection checklist into repeatable machine-readable evidence for internally built and commercial `.sppkg` artifacts.

The automation must not claim that the full release gate has passed when tenant-side permission state or runtime network behavior has not been observed.

## Inspection modes

`SOURCE_AND_SPPKG` is used when `package-solution.json` and a packaged artifact are supplied.

This mode checks source metadata and packaged `AppManifest.xml`, and it fail-closes on mismatches in solution identity, version, deployment flags, isolation flag, or API permission requests.

`SPPKG_DIRECT` is used when `--sppkg` is supplied without `--config`.

This mode reads the packaged `AppManifest.xml` and packaged Feature manifests directly.

It supports commercial packages for which source configuration is not available.

## IN

The command `npm run check:spfx-release-gate0` performs deterministic inspection of:

- source `package-solution.json` when available.
- packaged `AppManifest.xml`.
- solution name, id, and version.
- explicit `skipFeatureDeployment` boolean.
- explicit `isDomainIsolated` boolean.
- packaged and source Feature metadata.
- `webApiPermissionRequests`, including duplicate resource/scope pairs and broad-scope warnings.
- `paths.zippedPackage` when source configuration is used.
- `.sppkg` existence, byte length, and SHA-256.
- source/package consistency when both sources are available.
- machine-readable evidence with an explicit list of checks that were not performed.

The `.sppkg` ZIP is parsed read-only in-process.

Stored and deflated ZIP entries are supported.

## Feature validation

Each source Feature entry must have non-empty `id`, `title`, and `version` values.

Each packaged `feature_<guid>.xml` manifest must also have non-empty `Id`, `Title`, and `Version` attributes.

Missing values are blocking findings rather than nullable evidence.

## Decision semantics

`PASS_AUTOMATED_SUBSET` means only that this deterministic subset passed.

It does not mean that GATE 0, GATE 2, Pilot, Acceptance, Production Binding, or Deploy has been approved.

`BLOCKED` is returned when required package metadata cannot be determined, source/package evidence conflicts, or package provenance cannot be established.

Broad API scopes are warnings that require later least-privilege review.

They are not treated as approved permissions.

## Evidence schema

The command emits JSON with schema version:

```text
spfx-release-gate0-evidence@1.1.0
```

The evidence records the inspection mode, automated scope, explicitly unverified scope, decision, blockers, warnings, normalized metadata, package byte length, and SHA-256.

## Explicitly not checked

The automation intentionally does not inspect or mutate:

- existing tenant-wide API grants.
- admin-consent state.
- live tenant data.
- runtime network destinations.
- App Catalog state.
- Site Collection App Catalog state.
- Production Binding.
- deployment state.

These remain later gates or independent evidence requirements.

## Preserved rules

```text
Deployment Scope != Data Access Scope != API Permission Scope
package deployed != API permission granted
PASS_AUTOMATED_SUBSET != GATE 0 full acceptance
```

Commercial `.sppkg` and internally built `.sppkg` artifacts are subject to the same packaged-manifest and provenance evidence semantics.

## Tests

Focused tests cover source-plus-package inspection, commercial package direct inspection, explicit deployment flags, malformed or duplicate permission requests, broad-scope warnings, source and packaged Feature validation, missing package fail-closed behavior, and machine-readable evidence output.

## OUT

- mandatory `verify:ci` integration.
- GitHub Actions workflow mutation.
- GATE 2 tenant grant enumeration.
- PnP PowerShell or CLI for Microsoft 365 integration.
- Microsoft Graph live calls.
- App Catalog upload or activation.
- API permission approval or rejection.
- Production Binding.
- Deploy.
- LIVE WRITE.

## Next gate

After independent implementation re-review and Human approval, a separate slice may decide whether this command becomes a mandatory CI release check.

GATE 2 automation remains separately gated because it requires authoritative tenant-side read access.
