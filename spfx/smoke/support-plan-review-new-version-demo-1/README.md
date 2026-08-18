# SUPPORT-PLAN-REVIEW-NEW-VERSION-DEMO-1 browser smoke

Synthetic Planning PC next-version concept (`presentationRole=PLANNER`, `ADMIN_AUDIT` read, `FIELD_STAFF` regression).

```bash
cd spfx
RNVD_CHROME_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
RNVD_ARTIFACTS_DIR="$(pwd)/smoke/support-plan-review-new-version-demo-1/artifacts" \
node smoke/support-plan-review-new-version-demo-1/run-smoke.mjs
```

Requires esbuild / puppeteer-core / sass under `/tmp/node_modules` (or `RNVD_*_PATH` overrides).

NO SharePoint / Deploy / production write / Schema change.
