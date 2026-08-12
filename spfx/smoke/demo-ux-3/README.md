# DEMO-UX-3 browser smoke

Synthetic fixture harness for the user detail presentation skeleton.

Production SCSS from `ShellUx.module.scss`, `DashboardUx.module.scss`, `UsersUx.module.scss`, and `UserDetailUx.module.scss` is compiled with `sass`, SPFx theme tokens are normalized to CSS defaults, and the result is loaded via `smoke-production.css`.

```bash
cd /tmp && npm install puppeteer-core@24 esbuild@0.25 sass --no-save
node spfx/smoke/demo-ux-3/run-smoke.mjs
```

Assertions include Aさん local detail preview, current-support-first ordering, business/system state separation, disabled non-preview detail buttons, back-to-list navigation, tablet layout, and keyboard focus with real CSS applied.

Artifacts: `/opt/cursor/artifacts/demo-ux-3-browser-smoke/`
