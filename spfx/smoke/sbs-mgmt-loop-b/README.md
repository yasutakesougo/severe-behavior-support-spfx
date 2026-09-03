# SBS-MGMT-LOOP-B B12 browser smoke

Synthetic/session-only browser acceptance for the Planning-PC revision-start path.

Checks both `1280x900` and `390x844`:

`CHANGE_REQUIRED` + human-authored reason → explicit `変更内容の作成を始める` → exact N+1 draft readback → source version unchanged → `本番には保存されていません`.

No persistence, SharePoint/M365 mutation, Deploy, or LIVE WRITE is performed.
