# SBS-MGMT-LOOP-B B12 browser smoke

Synthetic/session-only browser acceptance for the Planning-PC revision-start path.

## Staff Arrival (verification HEAD)

```bash
node spfx/smoke/sbs-mgmt-loop-b/serve-smoke.mjs
```

Staff Apply 前:

```text
http://127.0.0.1:4194/index.html?viewMode=ready&siteSelection=SITE-ISG&destination=users&presentationRole=PLANNER&staffPlanTransition=beforeApply
```

到着: ページ最上部の緑バナー + タブ `【適用待機】` + ⑤ `変更が必要` + ⑥ `版 4 を適用開始する`。
`見直し結果: 変更なし` と `次の版を作る（表示専用）` だけなら未到着。

Product source stays #584 `@ 5437e64703db055eef2bf230f5a682cf0286dc1a`. See `docs/architecture/sbs-mgmt-plan-activation-c-staff-arrival-1-procedure-1.md`.

Exact B12 / RBA matrix: `docs/architecture/sbs-mgmt-loop-b-browser-smoke.md`.

Checks both `1280x900` and `390x844`:

`CHANGE_REQUIRED` + human-authored reason → C2 single primary + demoted review predecessor + retained disabled `create-cta` → clear `支援内容の見直しを始める（版 N+1 の下書き）` CTA with CTA-adjacent source-safety copy → exact N+1 draft readback including `現在適用中: 版 N` and `まだ適用開始されていません` → repeated action does not double-create → source version unchanged → `LIVE_WRITE=false` / external requests=0.

Negative paths: `NO_CHANGE` does not enable revision-start; historical v2 selection blocks start / forbids N+2.

The isolated browser runtime resolves package entrypoints from each package's canonical export rather than depending on internal package paths.

No persistence, SharePoint/M365 mutation, Deploy, or LIVE WRITE is performed.
