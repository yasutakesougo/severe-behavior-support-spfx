# AGENTS.md

## Cursor Cloud specific instructions

This repository is a **headless TypeScript contracts/domain library** for a severe-behavior-support (強度行動障害支援) app. There is **no server, web UI, or SPFx build yet** — the "application" is the domain/contracts modules under `src/`, exercised by the test/verification pipeline. Do not expect a dev server or a page to load; validate work by running the gates below.

### Running / testing

All commands are defined in `package.json` scripts; use those rather than duplicating flags:
- `npm run typecheck` — `tsc --noEmit`.
- `npm test` — runs `tsx --test tests/**/*.test.ts` (Node's built-in test runner via `tsx`).
- `npm run check:contracts-boundaries` — boundary/PII linter (see caveat below).
- `npm run verify:skills` — validates `.agents/skills` docs structure.
- `npm run verify:contracts` — the combined quality gate (typecheck + test + boundary). This mirrors `.github/workflows/contracts-ci.yml`; run it before committing changes to `src/**` or `tests/**`.

To manually exercise domain logic, write a small `.ts` file **inside the repo root** (not `/tmp`) and run it with `npx tsx <file>.ts`; imports are relative with explicit `.ts` extensions (e.g. `import { classifyBehaviorScore } from "./src/domain/index.ts"`). Relative imports break if the script lives outside the workspace.

### Non-obvious caveats

- `scripts/ci/check-contracts-boundaries.mjs` fails the build if files under `src/contracts`, `src/domain`, `tests/contracts`, or `tests/domain` contain browser globals (`window`/`document`/`localStorage`), `process.env`, React/SPFx/PnP imports, SharePoint REST paths, secrets, emails, or PII-shaped strings. Keep those directories pure and framework-free. Fixture files (`*fixtures.ts`) must use only synthetic identifiers/reason codes prefixed with `synthetic-` or `SYNTHETIC_`.
- Node: `.node-version`/`engines` pin `22.23.1`, but the Cloud VM's default `node` (`/exec-daemon/node`) is `22.14.0` and takes PATH precedence over nvm. Everything (tsc, tsx, `node --test`) runs correctly on the default; the `npm ci` `EBADENGINE` warning is expected and non-fatal, so no Node switch is required.
