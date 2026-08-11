# AssessmentSnapshot adapter SPFx scaffold/dependency implementation start

## Authority

Human GO received for the separate scaffold / dependency Implementation Start gate following `Decision-AS-ADAPTER-SPFX-VERSION-SCAFFOLD-1 = ACCEPTED / LOCKED / V-1 + A + D-HOLD`.

Subsequent Human GO received for **scaffold materialization + Heft build verification**.

This record does not replace or impersonate a Human-authored GitHub authorization comment.

## Authorized scope

This slice may establish the isolated `spfx/` dependency boundary and materialize the official SPFx 1.23.2 Heft scaffold required before any binder work.

The accepted constraints are:

- SPFx `1.23.2` exact.
- Node.js 22.
- React and React DOM `17.0.1` exact.
- SPFx-local TypeScript no later than 5.8; selected manifest value is `~5.8.3`.
- Relevant `@microsoft/sp-*` packages are aligned to `1.23.2`.
- Root TypeScript `5.9.2` is not changed.
- The SPFx boundary is isolated in a dedicated subdirectory.

## Current implementation

Created / updated under `spfx/`:

- official `webpart-react` scaffold files (`config/`, `src/`, `tsconfig.json`, etc.)
- `package.json` / `package-lock.json`
- `README.md`

Scaffold generation method:

```text
tool: @microsoft/spfx-cli@0.1.0-pre.3
template source: SharePoint/spfx templates/webpart-react
template spfxVersion: 1.23.2
template name: webpart-react
component: Scaffold Shell（toolchain verification shell only）
package-manager during create: none
```

No root dependency file is changed.

## Verification state

### Dependency install

```text
Continuation / materialization PR stack:
  #225 Accepted/Locked recording（Draft）
  #226 dependency boundary start（Draft）
  #227 lockfile verification（Draft）
  #228 scaffold materialization + Heft verification（Draft）

npm install: RUN / PASS
  Node: v22.14.0
  packages added after scaffold package.json: 1376

package-lock.json: GENERATED / UPDATED
dependency resolution: VERIFIED
  @microsoft/sp-http = 1.23.2
  @microsoft/sp-core-library = 1.23.2
  @microsoft/sp-webpart-base = 1.23.2
  @microsoft/spfx-web-build-rig = 1.23.2
  react = 17.0.1
  react-dom = 17.0.1
  typescript = 5.8.3

root package.json mutation: 0
root lockfile mutation: 0
```

### Scaffold materialization

```text
SPFx CLI / generator: RUN / PASS
  @microsoft/spfx-cli create webpart-react from official 1.23.2 template
config/rig.json: PRESENT
config/heft.json: not required locally（rig-provided）
tsconfig.json: PRESENT
ScaffoldShell web part: PRESENT（template default；not binder）
```

### Heft build verification

```text
heft run --only build -- --clean: PASS
  TypeScript 5.8.3
  ESLint 8.57.1
  Webpack 5.105.4
  duration ~3.8s

heft test --clean: PASS
  Jest 30.2.0
  Successes: 0 / Failures: 0 / Total: 0
  （no project tests in this scaffold shell）

heft package-solution --production: PASS
  local artifact only:
    spfx/sharepoint/solution/severe-behavior-support-spfx-shell.sppkg
  Deploy: NOT RUN / NOT AUTHORIZED
```

Build outputs (`lib/`, `release/`, `sharepoint/solution/`, `*.sppkg`, `.heft/`) remain gitignored and are not treated as Deploy evidence.

## Still forbidden in the scaffold slice itself

- SharePoint / Microsoft 365 / Entra mutation.
- tenant I/O.
- Deploy of `.sppkg` / real data.
- automatic Ready or Merge of #225 / #226 / #227 / #228.
- root TypeScript / root package mutation.

Binder Implementation Start is a **separate** Human GO recorded in
`decision-assessment-snapshot-adapter-sphttpclient-binder-implementation-start.md`.

## Stop condition（scaffold / dependency gate）

```text
Advanced to PASS:
  isolated dependency boundary
  npm install + lockfile
  official 1.23.2 scaffold materialization
  Heft build / test / package-solution verification

Scaffold/dependency gate: COMPLETE for technical blocker purposes
Next substantive gate after this stack:
  Binder Implementation Start（separate Human GO）
```
