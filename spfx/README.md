# Isolated SPFx scaffold boundary

This directory is the dedicated SharePoint Framework boundary accepted by `Decision-AS-ADAPTER-SPFX-VERSION-SCAFFOLD-1`.

Current slice:

- SPFx version: `1.23.2` exact.
- Node.js: `22` (`>=22.14.0 <23.0.0`).
- React / React DOM: `17.0.1` exact.
- TypeScript: `~5.8.3` inside this directory only.
- Root repository TypeScript remains unchanged.
- `@microsoft/sp-*` packages used by this boundary are aligned to `1.23.2`.
- Heft is the build orchestrator.

This slice does not add an application web part, binder implementation, live HTTP call, tenant configuration, deployment, or real-data access.

`package-lock.json` is intentionally absent in this commit because the current execution environment cannot reach the npm registry. Dependency installation and lockfile verification therefore remain incomplete and must not be represented as successful.
