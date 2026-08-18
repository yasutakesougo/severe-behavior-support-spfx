# ADMIN-DEMO-UX-POLISH-1 browser smoke

Unified synthetic demo acceptance harness for FIELD_STAFF Tablet, PLANNER / ADMIN_AUDIT PC, save-hold copy, first-list unrecorded CTA, and next-version highlight lifetime.

```bash
cd spfx
ADUX_CHROME_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
ADUX_ARTIFACTS_DIR="$(pwd)/smoke/admin-demo-ux-polish-1/artifacts" \
node smoke/admin-demo-ux-polish-1/run-smoke.mjs
```

Requires esbuild / puppeteer-core / sass under `/tmp/node_modules` (or `ADUX_*_PATH` overrides).

NO SharePoint / Deploy / production write / Schema change.
