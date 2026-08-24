# VP-7 optical alignment browser smoke

Synthetic fixture harness for Procedure Record Correction result-option optical alignment (PR #503).

```bash
cd /tmp && npm install puppeteer-core@24 esbuild@0.25 sass --no-save
node spfx/smoke/vp-7-optical-alignment/run-smoke.mjs
```

Artifacts: `/opt/cursor/artifacts/vp-7-browser-smoke/`

Environment overrides:

- `VP7_ARTIFACTS_DIR`
- `VP7_EXACT_HEAD`
- `VP7_DEFINITION_BASE`
