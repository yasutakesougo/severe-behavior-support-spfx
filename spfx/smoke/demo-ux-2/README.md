# DEMO-UX-2 browser smoke

Synthetic fixture harness for the users list presentation skeleton.

Production SCSS from `ShellUx.module.scss`, `DashboardUx.module.scss`, and `UsersUx.module.scss` is compiled with `sass`, SPFx theme tokens are normalized to CSS defaults, and the result is loaded in the browser via `smoke-production.css`.

```bash
cd /tmp && npm install puppeteer-core@24 esbuild@0.25 sass --no-save
node spfx/smoke/demo-ux-2/run-smoke.mjs
```

Assertions include users list density, disabled filter/detail controls, overview unchanged, records placeholder preserved, tablet layout, and keyboard navigation with real CSS applied.

Artifacts: `/opt/cursor/artifacts/demo-ux-2-browser-smoke/`
