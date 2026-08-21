# SPFX-RELEASE-GATE-HARDENING-2-AUTOMATION-1

## Status

Implementation slice for the deterministic, tenant-independent subset of SPFx release GATE 0.

This slice does not authorize deployment, Production Binding, App Catalog mutation, API permission approval, SharePoint mutation, Microsoft Entra mutation, or LIVE WRITE.

## Objective

Convert the already-defined GATE 0 package-inspection checklist into a repeatable machine-readable check that can be used for internally built and commercial `.sppkg` artifacts.

The automation must not claim that the full release gate has passed when tenant-side permission state or runtime network behavior has not been observed.

## IN

The command `npm run check:spfx-release-gate0` performs deterministic inspection of:

- `package-solution.json` readability and JSON shape.
- `solution.name`.
- `solution.id`.
- `solution.version`.
- explicit `skipFeatureDeployment` boolean.
- explicit `isDomainIsolated` boolean.
- `features` shape when present.
- `webApiPermissionRequests` shape, duplicate resource/scope pairs, and broad-scope warnings.
- `paths.zippedPackage`.
- existence of the target `.sppkg` artifact.
- SHA-256 and byte length of the target `.sppkg` artifact.
- machine-readable evidence output with an explicit list of checks that were not performed.

The `.sppkg` path can be supplied with `--sppkg`.

Without `--sppkg`, the command resolves the normal SPFx output path from `spfx/config/package-solution.json` and `paths.zippedPackage`.

## Decision semantics

`PASS_AUTOMATED_SUBSET` means only that this exact deterministic subset passed.

It does not mean that GATE 0, GATE 2, Pilot, Acceptance, Production Binding, or Deploy has been approved.

`BLOCKED` is returned when required package metadata cannot be determined or package provenance cannot be established.

Examples of blocking conditions include:

- unreadable or invalid `package-solution.json`.
- missing required solution identity/version fields.
- missing explicit `skipFeatureDeployment`.
- missing explicit `isDomainIsolated`.
- malformed or duplicate API permission requests.
- unresolved package output path.
- missing `.sppkg` artifact.
- unavailable package hash evidence.

Broad API scopes are reported as warnings for mandatory least-privilege review.

They are not silently treated as approved permissions.

## Evidence schema

The command emits JSON with schema version:

```text
spfx-release-gate0-evidence@1.0.0
```

The evidence records:

- automated scope.
- explicitly unverified scope.
- decision.
- blockers.
- warnings.
- normalized package configuration facts.
- package path, byte length, and SHA-256 when available.

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

Commercial `.sppkg` and internally built `.sppkg` artifacts are subject to the same evidence semantics.

## Tests

Focused tests cover:

- successful deterministic inspection with SHA-256 evidence.
- fail-closed behavior when deployment flags are absent.
- malformed and duplicate API permission requests.
- broad-scope warning behavior without GATE 2 elevation.
- missing package fail-closed behavior.
- machine-readable evidence file output.

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

After independent implementation review and Human approval, a separate slice may decide whether this command becomes a mandatory CI release check.

GATE 2 automation remains separately gated because it requires authoritative tenant-side read access.
