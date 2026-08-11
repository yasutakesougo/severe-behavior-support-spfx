# SHELL-UX-1 browser smoke

Synthetic fixture harness for IR P2 closeout.

```bash
# from repo root（requires Chrome + npm packages in /tmp for one-shot runner deps）
cd /tmp && npm install puppeteer-core@24 esbuild@0.25 --no-save
cd /path/to/repo/spfx/smoke/shell-ux-1
node run-smoke.mjs
```

Generated `smoke-bundle.js` / `smoke-report.json` are gitignored.
Screenshots land under `/opt/cursor/artifacts/shell-ux-1-browser-smoke/` in agent VMs.
