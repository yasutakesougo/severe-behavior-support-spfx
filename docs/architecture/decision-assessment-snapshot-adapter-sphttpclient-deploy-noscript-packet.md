# Decision-AS-ADAPTER-SPHTTPCLIENT-DEPLOY-NOSCRIPT-1 — Human Decision Packet

この文書は、Deploy gate（PR #232）が
**BLOCKED_BY_NOSCRIPT_GUARD** で停止したあとの次 gate として、
Tenant App Catalog の **一時 scripting 有効化 → scoped `.sppkg` Deploy → 確認 → 設定復帰**
を **1セット** で許可する docs-only Decision Packet である。

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-AS-ADAPTER-SPHTTPCLIENT-DEPLOY-NOSCRIPT-1
Status: GO RECEIVED / EXECUTION HOLD
Human Decision: GO（temporary NoScript / scripting enable for Deploy）
Deploy HEAD: a0fc767c5df4349c43f8176e9a7388c33f45a167
Deploy evidence: 6524785bc993a261f8f8cc2a3e2c4422b9291178
Kind: temporary Tenant App Catalog scripting + Deploy + restore（one set）

Ready / Merge: HUMAN-ONLY
Agent App Catalog / NoScript mutation: FORBIDDEN
Permanent NoScript disable: FORBIDDEN
```

## 1. Locked inputs（再 Decision しない）

```text
Decision-AS-ADAPTER-SPHTTPCLIENT-DEPLOY-1
= GO RECEIVED / EXECUTION HOLD
  Deploy verification = NOT PASS
  HOLD = BLOCKED_BY_NOSCRIPT_GUARD

Observed（Human evidence 6524785）:
  package build = PASS
  .sppkg = severe-behavior-support-spfx-shell.sppkg（38661 bytes）
  Site App Catalog = NOT PRESENT
  Tenant App Catalog = PRESENT
  URL = https://isogokatudouhome.sharepoint.com/sites/appcatalog
  Add-PnPApp prompt answered N（correct under prior GO）
  NoScript mutation = 0
  Tenant Deploy = NOT COMPLETED

Package identity:
  name = severe-behavior-support-spfx-shell-client-side-solution
  id = 4342db47-21a3-4c48-aed1-ef615f55c404
  version = 1.0.0.0
```

## 2. Human Decision meaning（this GO）

```text
GO-DEPLOY-NOSCRIPT-TEMP = authorize Human to run ONE atomic set:

  1. record current Tenant App Catalog scripting / NoScript state
  2. temporarily enable scripting（only on Tenant App Catalog site）
  3. Add-PnPApp scoped .sppkg（Tenant scope）+ Publish
  4. confirm app deployed / published
  5. restore prior scripting / NoScript state
  6. confirm restore
  7. record evidence

Still separate:
  Ready / Merge of Draft stack
  permanent scripting disable leave-behind
  Agent execution
```

## 3. Authorized IN（one set only）

Target:

```text
Tenant App Catalog:
  https://isogokatudouhome.sharepoint.com/sites/appcatalog
Package:
  spfx/sharepoint/solution/severe-behavior-support-spfx-shell.sppkg
```

Exact order（do not reorder; do not stop after enable without restore）:

### 3.1 Record baseline

```powershell
Connect-PnPOnline -Url "https://isogokatudouhome.sharepoint.com" -Interactive

# Use the installed PnP 3.1.0 surface; adjust cmdlet names if Get-Command differs.
# Record whatever property your environment exposes for DenyAddAndCustomizePages / NoScript.
$catalogUrl = "https://isogokatudouhome.sharepoint.com/sites/appcatalog"
$baseline = Get-PnPTenantSite -Identity $catalogUrl |
  Select-Object Url, DenyAddAndCustomizePages
$baseline
```

### 3.2 Temporary enable scripting

```powershell
# Prefer explicit property set over relying solely on Add-PnPApp interactive prompt.
Set-PnPTenantSite -Identity $catalogUrl -DenyAddAndCustomizePages Disabled
Get-PnPTenantSite -Identity $catalogUrl |
  Select-Object Url, DenyAddAndCustomizePages
```

If your installed PnP uses a different enable cmdlet, document the exact command used in evidence.

### 3.3 Deploy scoped package

```powershell
Connect-PnPOnline -Url "https://isogokatudouhome.sharepoint.com/sites/severe-support-isogo" -Interactive

Add-PnPApp -Path ".\sharepoint\solution\severe-behavior-support-spfx-shell.sppkg" `
  -Scope Tenant `
  -Publish `
  -Overwrite

Get-PnPApp -Scope Tenant |
  Where-Object {
    $_.Id -eq "4342db47-21a3-4c48-aed1-ef615f55c404" -or
    $_.Title -like "*severe-behavior-support-spfx-shell*"
  }
```

### 3.4 Restore baseline（required）

```powershell
# Restore to the recorded baseline（expected: Enabled / no-script = on）.
Set-PnPTenantSite -Identity $catalogUrl -DenyAddAndCustomizePages Enabled
Get-PnPTenantSite -Identity $catalogUrl |
  Select-Object Url, DenyAddAndCustomizePages
```

If baseline was already Disabled, restore to that recorded value（do not invent a different end state）.

### 3.5 Evidence

Fill verification doc with baseline → enable → deploy → restore → final state.

## 4. Explicit OUT / FORBIDDEN

```text
OUT:
  leaving Tenant App Catalog scripting permanently enabled
  enabling scripting on any site other than Tenant App Catalog
  Add-PnPApp without restore in the same session/set
  Agent NoScript mutation / Agent App Catalog upload
  Ready / Merge auto-progress
  Entra / unrelated tenant config changes
  list / column / site schema mutation on pilot content site
  real business AssessmentSnapshots writes
  SPO_* secrets merely to unblock Agent
```

## 5. Agent execution attempt（this environment）

```text
Authenticated SharePoint session: ABSENT
Unauthenticated probe: HTTP 403
SPO_* secrets: NOT ADDED

Therefore:
  NoScript temp enable / Deploy / restore by Agent = NOT RUN
  verification = NOT PASS（pending Human one-set execution）
```

## 6. Pass criteria

```text
PASS requires all:
  1. baseline scripting/NoScript state recorded
  2. temporary enable succeeds（Tenant App Catalog only）
  3. scoped .sppkg Tenant Deploy / Publish succeeds
  4. app identity confirmed in Tenant App Catalog
  5. scripting/NoScript restored to recorded baseline
  6. restore confirmed by read-back
  7. no Ready / Merge；no Agent upload；no unrelated mutations
  8. evidence recorded
```

## 7. Stop condition

```text
Decision-AS-ADAPTER-SPHTTPCLIENT-DEPLOY-NOSCRIPT-1
= GO RECEIVED / EXECUTION HOLD

HOLD:
  Human one-set execution evidence
  （enable → Deploy → confirm → restore）

Still NOT AUTHORIZED:
  Ready / Merge auto-progress
  Agent execution
  permanent NoScript leave-behind
```
