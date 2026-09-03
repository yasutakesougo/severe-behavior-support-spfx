# SBS-MGMT-LOOP-B B12 browser smoke

Synthetic/session-only browser acceptance for the Planning-PC revision-start path
(and #583 Apply path on the same harness).

Exact B12 / RBA matrix: `docs/architecture/sbs-mgmt-loop-b-browser-smoke.md`.

## Interactive staff check (keep server open)

From repository root, on PR branch / exact HEAD:

```bash
# once
npm ci
cd spfx && npm ci && cd ..
npm install esbuild sass --no-save

node spfx/smoke/sbs-mgmt-loop-b/serve-smoke.mjs
```

Staff Plan-Transition（Apply 直前。推奨）:

```text
http://127.0.0.1:4194/index.html?staffPlanTransition=beforeApply&presentationRole=PLANNER
```

この URL は計画画面を直接開き、版3適用中 + 版4下書きの状態で `版 4 を適用開始する` を出します。LOOP-B の見直し入力は不要です。

LOOP-B 冷起動（見直し → 下書き → Apply の全経路）:

```text
http://127.0.0.1:4194/index.html?viewMode=ready&siteSelection=SITE-ISG&destination=users&presentationRole=PLANNER
```

`run-smoke.mjs` auto-closes after Puppeteer. Use `serve-smoke.mjs` for manual confirmation.

## Automated smoke

Checks both `1280x900` and `390x844`:

`CHANGE_REQUIRED` + human-authored reason → C2 single primary + demoted review predecessor + retained disabled `create-cta` → clear `支援内容の見直しを始める（版 N+1 の下書き）` CTA with CTA-adjacent source-safety copy → exact N+1 draft readback including `現在適用中: 版 N` and `まだ適用開始されていません` → Apply → v4 current / v3 history → repeated action does not double-create → source version unchanged → `LIVE_WRITE=false` / external requests=0.

Negative paths: `NO_CHANGE` does not enable revision-start; historical v2 selection blocks start / forbids N+2.

The isolated browser runtime resolves package entrypoints from each package's canonical export rather than depending on internal package paths.

No persistence, SharePoint/M365 mutation, Deploy, or LIVE WRITE is performed.
