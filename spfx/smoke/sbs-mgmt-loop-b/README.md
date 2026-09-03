# SBS-MGMT-LOOP-B B12 browser smoke

Synthetic/session-only browser acceptance for the Planning-PC revision-start path.

Exact B12 / RBA matrix: `docs/architecture/sbs-mgmt-loop-b-browser-smoke.md`.

Checks both `1280x900` and `390x844`:

`CHANGE_REQUIRED` + human-authored reason → C2 single primary + demoted review predecessor → explicit `変更内容の作成を始める` → exact N+1 draft readback → source version unchanged → `本番には保存されていません`.

The isolated browser runtime resolves package entrypoints from each package's canonical export rather than depending on internal package paths.

No persistence, SharePoint/M365 mutation, Deploy, or LIVE WRITE is performed.
