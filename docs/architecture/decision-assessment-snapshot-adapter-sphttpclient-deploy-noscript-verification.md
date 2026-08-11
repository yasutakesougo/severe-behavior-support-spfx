# Decision-AS-ADAPTER-SPHTTPCLIENT-DEPLOY-NOSCRIPT-1 — Verification Evidence

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-AS-ADAPTER-SPHTTPCLIENT-DEPLOY-NOSCRIPT-1
Verification target: temporary Tenant App Catalog scripting + scoped Deploy + restore
Verification status: PASS / VERIFIED
Date: 2026-08-11
Tenant App Catalog: https://isogokatudouhome.sharepoint.com/sites/appcatalog
Agent mutation: 0
Ready / Merge performed: 0
```

## Authority

```text
Human Decision: GO-DEPLOY-NOSCRIPT-TEMP
Acceptance: decision-assessment-snapshot-adapter-sphttpclient-deploy-noscript-acceptance.md
Procedure: decision-assessment-snapshot-adapter-sphttpclient-deploy-noscript-packet.md §3
Parent:
  Decision-AS-ADAPTER-SPHTTPCLIENT-DEPLOY-1
  = GO RECEIVED / previously BLOCKED_BY_NOSCRIPT_GUARD
```

## Human one-set execution evidence

```text
Operator: Human
Date: 2026-08-11
Tool: PnP.PowerShell 3.1.0 / PowerShell 7.5.3

Package:
  path = spfx/sharepoint/solution/severe-behavior-support-spfx-shell.sppkg
  generated from locked #232 worktree
  size = 38661 bytes
  solution name = severe-behavior-support-spfx-shell-client-side-solution
  solution id / ProductId = 4342db47-21a3-4c48-aed1-ef615f55c404
  version = 1.0.0.0

3.1 Baseline:
  Tenant App Catalog = https://isogokatudouhome.sharepoint.com/sites/appcatalog
  DenyAddAndCustomizePages = Enabled
  meaning = NoScript ON / scripting disabled

Authentication note:
  explicit Connect-PnPOnline to tenant admin with -ReturnConnection emitted:
    "Please specify a valid client id for an Entra ID App Registration"
    "Specified method is not supported"
  Despite that connection attempt, the subsequent Get-PnPTenantSite / Set-PnPTenantSite
  operations and read-backs completed successfully in the effective authenticated PnP context.
  No Entra configuration change was performed.

3.2 Temporary enable:
  Set-PnPTenantSite -DenyAddAndCustomizePages:$false = SUCCESS
  read-back DenyAddAndCustomizePages = Disabled
  target = Tenant App Catalog only

3.3 Deploy:
  Add-PnPApp scope = Tenant
  Publish = YES
  Overwrite = YES
  package = severe-behavior-support-spfx-shell.sppkg
  result = SUCCESS

Deploy confirmation:
  Get-PnPApp -Scope Tenant matched expected solution title
  Id = 0d75630f-f757-45ec-b055-de53f1fd2476
  AppCatalogVersion = 1.0.0.0
  Deployed = True
  IsClientSideSolution = True
  Title = severe-behavior-support-spfx-shell-client-side-solution

Identity note:
  PnP Get-PnPApp.Id is the App Catalog app metadata identity and is not treated as
  the SPFx package solution ProductId. The package ProductId remains the locked
  package-solution.json solution id 4342db47-21a3-4c48-aed1-ef615f55c404.

3.4 Restore:
  baseline = Enabled
  Set-PnPTenantSite -DenyAddAndCustomizePages:$true = SUCCESS
  final read-back DenyAddAndCustomizePages = Enabled
  matches baseline = YES
  terminal evidence = "RESTORE CONFIRMED: Enabled"
```

## Out-of-scope checks

```text
scripting enabled on other sites = 0
permanent scripting leave-behind = 0
Agent NoScript mutation = 0
Agent App Catalog upload = 0
Entra configuration change = 0
real business AssessmentSnapshots writes = 0
Ready / Merge performed = 0
```

## Verdict

```text
Decision-AS-ADAPTER-SPHTTPCLIENT-DEPLOY-NOSCRIPT-1
= PASS / VERIFIED

one-set:
  baseline record = PASS
  temporary enable = PASS
  Tenant Add-PnPApp / Publish = PASS
  deployed confirmation = PASS
  restore baseline = PASS
  final state = Enabled / baseline restored

Parent Decision-AS-ADAPTER-SPHTTPCLIENT-DEPLOY-1
= eligible for PASS / VERIFIED based on completed scoped deploy evidence

Ready / Merge = HUMAN-ONLY
```
