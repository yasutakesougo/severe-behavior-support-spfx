# DASHBOARD-UX-1 browser smoke

Synthetic fixture harness for the overview presentation skeleton.

Production SCSS from `ShellUx.module.scss` and `DashboardUx.module.scss` is compiled with `sass`, SPFx theme tokens are normalized to CSS defaults, and the result is loaded in the browser via `smoke-production.css`.

```bash
cd /tmp && npm install puppeteer-core@24 esbuild@0.25 sass --no-save
node spfx/smoke/dashboard-ux-1/run-smoke.mjs
```

Assertions include computed `grid-template-columns` at desktop (4), tablet 768px (2), and 200% equivalent 640px / DPR 2 (2), plus horizontal overflow checks with real CSS applied.

Artifacts: `/opt/cursor/artifacts/dashboard-ux-1-browser-smoke/`
