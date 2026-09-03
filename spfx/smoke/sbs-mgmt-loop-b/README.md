# SBS-MGMT-LOOP-B B12 browser smoke

Synthetic/session-only browser acceptance for the Planning-PC revision-start path.

Exact B12 / RBA matrix: `docs/architecture/sbs-mgmt-loop-b-browser-smoke.md`.

Checks both `1280x900` and `390x844`:

`CHANGE_REQUIRED` + human-authored reason → C2 single primary + demoted review predecessor + retained disabled `create-cta` → separate `start-revision` CTA → exact N+1 draft readback → repeated action does not double-create → source version unchanged → `LIVE_WRITE=false` / external requests=0.

Negative paths: `NO_CHANGE` does not enable revision-start; historical v2 selection blocks start / forbids N+2.

The isolated browser runtime resolves package entrypoints from each package's canonical export rather than depending on internal package paths.

No persistence, SharePoint/M365 mutation, Deploy, or LIVE WRITE is performed.
