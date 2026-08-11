# Decision-AS-ADAPTER-SPHTTPCLIENT-DEPLOY-1 — Verification Evidence

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-AS-ADAPTER-SPHTTPCLIENT-DEPLOY-1
Verification target: App Catalog Deploy of severe-behavior-support-spfx-shell.sppkg
Verification status: PASS / VERIFIED
Date: 2026-08-11
Pilot site: severe-support-isogo
Catalog scope used: Tenant
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

Additional Human gate:
  Decision-AS-ADAPTER-SPHTTPCLIENT-DEPLOY-NOSCRIPT-1
  = PASS / VERIFIED
```

## Package build evidence

```text
Operator: Human
Date: 2026-08-11
Toolchain:
  Node = v22.23.1
  npm = 10.9.8
  PnP.PowerShell = 3.1.0
  PowerShell = 7.5.3

npm ci = PASS (warnings only)
npm run build = PASS
Jest = 6 passed / 0 failed
package-solution = ALL DONE

Package:
  path = spfx/sharepoint/solution/severe-behavior-support-spfx-shell.sppkg
  size = 38661 bytes
  name = severe-behavior-support-spfx-shell-client-side-solution
  solution id / ProductId = 4342db47-21a3-4c48-aed1-ef615f55c404
  version = 1.0.0.0
```

## Catalog discovery

```text
Site Collection App Catalog = NOT PRESENT
Tenant App Catalog = PRESENT
Tenant App Catalog URL = https://isogokatudouhome.sharepoint.com/sites/appcatalog
```

## NoScript boundary and authorized resolution

Initial deploy attempt correctly stopped at the PnP NoScript guard under the original GO-DEPLOY.
A separate Human authorization was then recorded:

```text
GO-DEPLOY-NOSCRIPT-TEMP
Decision-AS-ADAPTER-SPHTTPCLIENT-DEPLOY-NOSCRIPT-1
```

Human executed one atomic set against the Tenant App Catalog only:

```text
baseline DenyAddAndCustomizePages = Enabled
→ temporary value = Disabled
→ Add-PnPApp -Scope Tenant -Publish -Overwrite = SUCCESS
→ Get-PnPApp confirmation = Deployed True
→ restore DenyAddAndCustomizePages = Enabled
→ RESTORE CONFIRMED: Enabled
```

## Deploy confirmation

```text
Get-PnPApp -Scope Tenant result:
  Id = 0d75630f-f757-45ec-b055-de53f1fd2476
  AppCatalogVersion = 1.0.0.0
  Deployed = True
  IsClientSideSolution = True
  Title = severe-behavior-support-spfx-shell-client-side-solution
```

The PnP App Catalog metadata `Id` above is recorded separately from the SPFx package solution ProductId.
The deployed package was generated from the locked package-solution.json with solution id
`4342db47-21a3-4c48-aed1-ef615f55c404`, and the live catalog title/version/deployed state match the built package.

## Out-of-scope checks

```text
Tenant App Catalog scripting final state = restored to baseline Enabled
permanent scripting leave-behind = 0
scripting enabled on other sites = 0
Agent App Catalog upload = 0
Agent NoScript mutation = 0
list / column schema mutation = 0
Entra configuration change = 0
real business AssessmentSnapshots writes = 0
Ready / Merge performed = 0
```

## Verdict

```text
Decision-AS-ADAPTER-SPHTTPCLIENT-DEPLOY-1
= PASS / VERIFIED

package build = PASS
Tenant App Catalog Deploy / Publish = PASS
app deployed confirmation = PASS
NoScript temporary gate = PASS / VERIFIED
NoScript baseline restore = PASS

Ready / Merge = HUMAN-ONLY
```
