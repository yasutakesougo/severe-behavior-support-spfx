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

## Verification evidence（this continuation）

```text
npm install: RUN / PASS（registry reachable in this environment）
package-lock.json: GENERATED
dependency resolution: VERIFIED for locked targets
  @microsoft/sp-http = 1.23.2
  @microsoft/sp-core-library = 1.23.2
  @microsoft/sp-webpart-base = 1.23.2
  react / react-dom = 17.0.1
  typescript = 5.8.3
  @microsoft/spfx-web-build-rig = 1.23.2
  @rushstack/heft = 1.2.22（requested ^1.2.19）

SPFx CLI / generator: NOT RUN
Heft build: NOT RUN / BLOCKED
  reason: config/heft.json absent
  meaning: dependency boundary exists; full scaffold/toolchain project files are not yet present
```

This slice does not add an application web part, binder implementation, live HTTP call, tenant configuration, deployment, or real-data access.

Root `package.json` / root lockfile are intentionally unchanged.
