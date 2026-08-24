# Current-RC Layer A Execution Readiness-1

Status: **READINESS GAP-CLOSURE IMPLEMENTATION ONLY**

Product RC under evaluation:

```text
7944cea0fad20783f178ec613080283b98b5cca5
```

This document records the executable support added for the Layer A readiness
gap. It does not grant `Layer A Execution GO`, Artifact Authority, Deep Scan,
Deploy, Production Binding, or LIVE WRITE permission.

## Scope

The canonical orchestrator is:

```text
scripts/layer-a/run-layer-a.mjs
```

It defines and evaluates ST-01 through ST-10, invokes the existing smoke
runners only when explicitly passed `--execute`, records a raw child-process
log, saves runner network evidence, and writes a provenance manifest with
SHA-256 values for every generated evidence file.

The existing browser runners use:

- `scripts/layer-a/browser-network-evidence.mjs` for request classification;
- local-harness traffic as the only allowed target during fixture execution;
- target-and-purpose classification for application-data mutation requests;
- fail-closed `unknownMutationRisk` handling for unknown non-local mutation
  traffic;
- no query strings, headers, or request bodies in the saved network evidence.

The runner will not mint a compliant provenance manifest if application-data
mutation evidence is observed. The execution summary may still show the
failure, but `provenance-manifest.json` is withheld.

## Locked provenance fields

Each manifest entry contains:

```text
evidence_id
evidence_path
evidence_sha256
product_rc_sha
harness_revision
product_worktree_state
execution_timestamp
environment
synthetic_data_only
live_write_performed
production_bound
```

For a compliant Layer A fixture run, the boolean values are fixed to:

```text
synthetic_data_only: true
live_write_performed: false
production_bound: false
```

The manifest validator also requires a non-empty evidence identity/path, a
64-character lowercase SHA-256, a parseable timestamp, an explicit
`environment_id`, the `synthetic-local` environment kind, a clean
`product_worktree_state`, a distinct `harness_revision`, and the exact Product
RC SHA above. `product_rc_sha` identifies the product being evaluated;
`harness_revision` identifies the revision containing the runner and evidence
tooling. The runner never treats the harness revision itself as the Product RC.

## Exact command inventory

These commands are implemented and documented. The first two are read-only
preflight commands and do not launch a browser or generate evidence.

```bash
node scripts/layer-a/run-layer-a.mjs
```

```bash
node scripts/layer-a/run-layer-a.mjs --preflight
```

The future execution command, usable only after a separate Human Gate named
`Layer A Execution GO`, is:

```bash
node scripts/layer-a/run-layer-a.mjs --execute --artifacts-dir /opt/cursor/artifacts/current-rc-layer-a
```

The selected artifacts directory must be new or empty. The orchestrator
refuses a non-empty directory so a prior report cannot be mistaken for the
current execution.

The orchestrator accepts tool overrides for an approved execution environment:

```bash
LAYER_A_ESBUILD_PATH="/path/to/esbuild/lib/main.js" \
LAYER_A_PUPPETEER_PATH="/path/to/puppeteer-core.js" \
LAYER_A_SASS_PATH="/path/to/sass.node.mjs" \
LAYER_A_CHROME_PATH="/path/to/Chrome" \
LAYER_A_ENVIRONMENT_ID="human-approved-fixture-environment-id" \
LAYER_A_ENVIRONMENT_KIND="synthetic-local" \
node scripts/layer-a/run-layer-a.mjs --preflight
```

The override values above are placeholders for environment-specific paths;
they are not execution evidence and do not authorize a run. The environment
identity values must be supplied by the approved execution environment; they
are not inferred from runtime versions. The orchestrator also supports the
per-runner variables `FW_*`, `KIOSK_*`, `SHELL_UX_1_*`, and `SHELL_UX_5_*` when
a human-approved environment requires them.

Dependency installation remains a separate preparation action and is not
performed by this gap-closure slice:

```bash
npm ci
cd spfx && npm ci
```

## Execution outputs

When a separately authorized execution is performed, the artifact directory
is expected to contain:

- `raw-execution-log.jsonl` — timestamped stdout/stderr from each child runner;
- one directory per existing smoke runner;
- `network-evidence.json` per runner when the runner returns network evidence;
- screenshots and runner reports produced by the existing smoke runners;
- `execution-summary.json` — ST-01 through ST-10 status and no-live-write
  result;
- `provenance-manifest.json` — one SHA-256-bound entry per evidence file.

No execution, screenshot generation, or evidence generation is part of this
gap-closure implementation. A future preflight requires a clean harness
revision descended from the Product RC. It separately verifies that all
changes between the Product RC and harness revision are confined to the
declared Layer A harness paths; product source/content drift is a blocker.

## Verification boundary for this slice

Allowed now:

- static inspection;
- JavaScript syntax checks;
- pure helper/unit tests that do not launch a browser or write evidence;
- documentation inspection.

Not allowed by this slice:

- `--execute`;
- direct invocation of any browser smoke runner;
- screenshot or evidence generation;
- `.sppkg` build/hash;
- Artifact Authority creation;
- Deep Scan, Deploy, Production Binding, or LIVE WRITE.
