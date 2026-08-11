# AssessmentSnapshot adapter SPFx scaffold/dependency implementation start

## Authority

Human GO received for the separate scaffold / dependency Implementation Start gate following `Decision-AS-ADAPTER-SPFX-VERSION-SCAFFOLD-1 = ACCEPTED / LOCKED / V-1 + A + D-HOLD`.

This record does not replace or impersonate a Human-authored GitHub authorization comment.

## Authorized scope

This slice may establish the isolated `spfx/` dependency boundary required for a future SPFx scaffold.

The accepted constraints are:

- SPFx `1.23.2` exact.
- Node.js 22.
- React and React DOM `17.0.1` exact.
- SPFx-local TypeScript no later than 5.8; selected manifest value is `~5.8.3` to match the official 1.23.2 scaffold template.
- Relevant `@microsoft/sp-*` packages are aligned to `1.23.2`.
- Root TypeScript `5.9.2` is not changed.
- The SPFx boundary is isolated in a dedicated subdirectory.

## Current implementation

Created / updated:

- `spfx/package.json`
- `spfx/package-lock.json`
- `spfx/README.md`

No root dependency file is changed.

## Verification state

The official SPFx 1.23.2 template inventory was used as the dependency source of truth for the Heft toolchain versions.

### Dependency install continuation（registry-reachable environment）

```text
npm install: RUN / PASS
  environment: npm registry reachable
  packages added: 1382
  Node: v22.14.0
  npm: 10.9.8

package-lock.json: GENERATED
dependency resolution: VERIFIED
  @microsoft/sp-http = 1.23.2
  @microsoft/sp-core-library = 1.23.2
  @microsoft/sp-webpart-base = 1.23.2
  @microsoft/decorators = 1.23.2
  @microsoft/spfx-web-build-rig = 1.23.2
  react = 17.0.1
  react-dom = 17.0.1
  typescript = 5.8.3
  @rushstack/heft = 1.2.22（requested ^1.2.19）

root package.json mutation: 0
root lockfile mutation: 0
```

Known non-blocking install notes:

- npm emitted peer-dependency warnings inside `@microsoft/spfx-web-build-rig@1.23.2` about nested `@rushstack/heft` vs plugin peer ranges. These originate from the Microsoft rig package graph and did not prevent install completion.

### Still incomplete / HOLD

```text
SPFx CLI / generator: NOT RUN
Heft build: NOT RUN / BLOCKED
  missing: spfx/config/heft.json and remaining scaffold project files
  observation: npx heft reports "File does not exist: /workspace/spfx/config/heft.json"

scaffold verification: PARTIAL
  PASS = isolated dependency boundary + lockfile resolution against V-1
  HOLD = full Heft-based scaffold/toolchain project shape + build
```

These HOLD items must not be treated as PASS.

## Still forbidden in this slice

- AssessmentSnapshot binder implementation.
- SPHttpClient calls.
- SharePoint / Microsoft 365 / Entra mutation.
- tenant I/O.
- Deploy.
- real data.
- automatic Ready or Merge.
- root TypeScript / root package mutation.

## Stop condition

```text
Advanced:
  npm install
  package-lock.json generation
  dependency resolution verification against V-1 + A

HOLD remaining:
  SPFx CLI / generator execution
  full scaffold project files（config/heft.json etc.）
  Heft build verification

A later binder Implementation Start remains a separate gate.
```
