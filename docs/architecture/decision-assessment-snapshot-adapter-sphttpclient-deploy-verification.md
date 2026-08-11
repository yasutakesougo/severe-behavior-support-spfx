# Decision-AS-ADAPTER-SPHTTPCLIENT-DEPLOY-1 — Verification Evidence

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-AS-ADAPTER-SPHTTPCLIENT-DEPLOY-1
Verification target: App Catalog Deploy of severe-behavior-support-spfx-shell.sppkg
Verification status: NOT PASS / BLOCKED_BY_NOSCRIPT_GUARD
Date: 2026-08-11
Pilot site: severe-support-isogo
Agent App Catalog upload: 0
Ready / Merge performed: 0
```

## Authority

```text
Human Decision: GO-DEPLOY
Acceptance: decision-assessment-snapshot-adapter-sphttpclient-deploy-acceptance.md
Procedure: decision-assessment-snapshot-adapter-sphttpclient-deploy-packet.md §3
Prerequisites:
  Decision-AS-ADAPTER-SPHTTPCLIENT-LIVE-READ-1 = PASS / VERIFIED
  Decision-AS-ADAPTER-SPHTTPCLIENT-LIVE-WRITE-1 = PASS / VERIFIED
```

## Human execution evidence

```text
Operator: Human
Date: 2026-08-11
Tool: PnP.PowerShell 3.1.0 / PowerShell 7.5.3
Node: v22.23.1
npm: 10.9.8

Package build:
  npm ci = PASS (warnings only)
  npm run build = PASS
  Jest = 6 passed / 0 failed
  package-solution = ALL DONE
  path = spfx/sharepoint/solution/severe-behavior-support-spfx-shell.sppkg
  file size = 38661 bytes
  name = severe-behavior-support-spfx-shell-client-side-solution
  id = 4342db47-21a3-4c48-aed1-ef615f55c404
  version = 1.0.0.0

Catalog discovery:
  Site Collection App Catalog = NOT PRESENT
  Tenant App Catalog = PRESENT
  URL = https://isogokatudouhome.sharepoint.com/sites/appcatalog

Tenant deploy attempt:
  command = Add-PnPApp -Scope Tenant -Publish -Overwrite
  PnP guard = tenant appcatalog is a no-script site
  prompt = temporarily enable scripting?
  Human response = N / No
  result = command cannot proceed while scripting is disabled

NoScript mutation = 0
App Catalog deploy completion = 0
```

## Boundary discovered

```text
GO-DEPLOY authorized Human .sppkg upload/deploy.
It did not explicitly authorize changing the Tenant App Catalog site's
NoScript / scripting setting, even temporarily.

Therefore the operator correctly declined the prompt and stopped.

Next substantive gate:
  separate Human GO / NO-GO for temporary scripting enablement
  on the Tenant App Catalog site solely to complete this scoped deploy.
```

## Out-of-scope checks

```text
Agent App Catalog upload = 0
NoScript / scripting setting mutation = 0
list / column schema mutation = 0
Entra change = 0
real business AssessmentSnapshots writes = 0
Ready / Merge performed = 0
```

## Verdict（current）

```text
Decision-AS-ADAPTER-SPHTTPCLIENT-DEPLOY-1
= GO RECEIVED / EXECUTION HOLD

Deploy verification = NOT PASS
reason = Tenant App Catalog NoScript guard requires separate Human authorization

package build = PASS
Site Collection App Catalog = NOT PRESENT
Tenant App Catalog = PRESENT
Tenant deploy = NOT COMPLETED
NoScript mutation = 0

Ready / Merge = HUMAN-ONLY
```
