# REVIEW-OUTCOME-CAPTURE-SLICE-A browser smoke

Synthetic `MonitoringView` composition harness for Scope S12 rendered browser acceptance.

Viewports:

```text
1280×900
390×844
```

Checks:

```text
undecided visible
NO_CHANGE capture + non-production readback
CHANGE_REQUIRED capture + revision-pending meaning + non-production note
no N+1 creation control
materials section still present
actions disabled after successful capture
no horizontal overflow
```

Run from the repository root after installing the isolated smoke dependencies under `/tmp`:

```bash
(cd /tmp && npm install puppeteer-core@24 esbuild@0.25 sass --no-save)
REVIEW_OUTCOME_CHROME_PATH=/usr/bin/google-chrome-stable \
REVIEW_OUTCOME_HEAD=<exact-head-sha> \
node spfx/smoke/review-outcome-capture-slice-a/run-smoke.mjs
```

Artifacts:

```text
/opt/cursor/artifacts/review-outcome-capture-slice-a-browser-smoke/
```

Synthetic verification only. No LIVE tenant I/O, SharePoint write, Deploy, Ready, or Merge authority is implied.
