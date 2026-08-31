# REVIEW-OUTCOME-CONTEXT-NOTE-SLICE-B rendered smoke

Synthetic rendered browser acceptance for the optional human-authored review context note.
No tenant, SharePoint, Graph, GitHub write, Deploy, Production Binding, or LIVE WRITE occurs.

## Run

From repository root, with the PR implementation HEAD checked out:

```bash
(cd /tmp && npm install puppeteer-core@24 esbuild@0.25 sass --no-save)
(cd spfx && npm ci)
REVIEW_OUTCOME_CHROME_PATH=/usr/bin/google-chrome-stable \
REVIEW_OUTCOME_NOTE_HEAD=$(git rev-parse HEAD) \
node spfx/smoke/review-outcome-context-note-slice-b/run-smoke.mjs
```

The runner uses local static HTTP on `127.0.0.1:4195` and writes only local smoke artifacts.

## Acceptance

Both `1280x900` and `390x844` must pass:

- optional memo label/helper are visible;
- blank memo remains valid;
- non-blank `NO_CHANGE` shows memo readback;
- blank `CHANGE_REQUIRED` preserves next-plan-not-created meaning;
- textarea and both decision actions are disabled after successful capture;
- uncommitted memo resets on exact review-context change;
- raw 255-code-unit counter/textarea boundary has no horizontal overflow;
- `data-live-write-authorized=false`;
- page errors = 0.

Operational evidence must additionally confirm `smoke-report.json.head` equals the exact checked-out PR HEAD.
