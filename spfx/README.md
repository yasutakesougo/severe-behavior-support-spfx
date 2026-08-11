# Isolated SPFx scaffold boundary

This directory is the dedicated SharePoint Framework boundary accepted by
`Decision-AS-ADAPTER-SPFX-VERSION-SCAFFOLD-1` (`V-1 + A + D-HOLD` Accepted / LOCKED).

## Locked targets

- SPFx version: `1.23.2` exact
- Node.js: `22` (`>=22.14.0 <23.0.0`)
- React / React DOM: `17.0.1` exact
- TypeScript: `~5.8.3` inside this directory only
- Root repository TypeScript remains unchanged (`5.9.2`)
- `@microsoft/sp-*` packages aligned to `1.23.2`
- Heft orchestrator via `@microsoft/spfx-web-build-rig@1.23.2`

## Scaffold materialization

Scaffold files were generated with `@microsoft/spfx-cli@0.1.0-pre.3` from the official
`SharePoint/spfx` `webpart-react` template (`spfxVersion: 1.23.2`) using a local template source.

Included for toolchain verification:

- `config/rig.json` and related SPFx Heft config
- `tsconfig.json`
- minimal `ScaffoldShell` web part (template default; not binder logic)
- `package.json` / lockfile for isolated dependency resolution

`@microsoft/sp-http@1.23.2` is used by the concrete AssessmentSnapshot List Items binder:

- `src/adapters/assessment-snapshot/sphttpclient-list-transport.ts`

Synthetic/local Jest doubles verify REST request construction（including CL-1-B `null` clear）.
This directory does **not** authorize live tenant I/O or Deploy.

## Verification

- Scaffold / dependency / Heft: `docs/architecture/assessment-snapshot-adapter-spfx-scaffold-dependency-implementation-start.md`
- Binder Implementation Start: `docs/architecture/decision-assessment-snapshot-adapter-sphttpclient-binder-implementation-start.md`
