# Decision-AS-ADAPTER-SPHTTPCLIENT-DEPLOY-1 — Human Decision Packet

この文書は、live write PASS（PR #231）後の次 gate として、
**SPFx `.sppkg` App Catalog Deploy** の境界を固定する docs-only Decision Packet である。

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-AS-ADAPTER-SPHTTPCLIENT-DEPLOY-1
Status: GO RECEIVED / EXECUTION HOLD
Human Decision: GO（Deploy / App Catalog）
Live-write HEAD: 93c119cbcb5db94ba1b28d0ef9ff53ce989d7971
Live-write evidence: f8cc4ceb02b9c99643f48e333de66ab0bef8a4c0
PR: #232
Kind: Deploy authorization gate（pilot App Catalog）

Ready / Merge: HUMAN-ONLY
real business data writes via binder: NOT AUTHORIZED by this GO
Agent App Catalog upload: NOT AUTHORIZED（Human execution）
```

Authority basis（上位）:

```text
DEC-AI-ORG-003:
  SharePoint App Catalog 登録・更新 = 禁止（基盤手順としては）
  → 別の承認プロセスが必要

This Decision Packet = that separate Human approval for the
scoped AssessmentSnapshot SPFx shell package only.
```

## 1. Locked inputs（再 Decision しない）

```text
Decision-AS-ADAPTER-SPFX-VERSION-SCAFFOLD-1
= ACCEPTED / LOCKED / V-1 + A + D-HOLD

Decision-AS-ADAPTER-SPHTTPCLIENT-LIVE-READ-1
= PASS / VERIFIED

Decision-AS-ADAPTER-SPHTTPCLIENT-LIVE-WRITE-1
= PASS / VERIFIED
  create / MERGE null clear / cleanup
  synthetic residue = 0

Binder Implementation Start = PASS（PR #229）
Heft package-solution --production = previously PASS（scaffold verify）

Package identity（from spfx/config/package-solution.json）:
  name = severe-behavior-support-spfx-shell-client-side-solution
  id = 4342db47-21a3-4c48-aed1-ef615f55c404
  version = 1.0.0.0
  zippedPackage = solution/severe-behavior-support-spfx-shell.sppkg
  skipFeatureDeployment = true

Pilot site:
  https://isogokatudouhome.sharepoint.com/sites/severe-support-isogo
```

## 2. Human Decision meaning（this GO）

```text
GO-DEPLOY = authorize Human to:
  rebuild package if needed
  upload / add / deploy the scoped .sppkg to the authorized App Catalog
  record Deploy evidence

Still separate:
  Ready / Merge of Draft stack #225–#231（+ this PR）
  real business data writes
  Entra / tenant-wide M365 config changes
```

## 3. Authorized IN

```text
IN（Human or credentialed operator only）:
  1. From spfx/: heft package-solution --production（if fresh .sppkg needed）
  2. Upload severe-behavior-support-spfx-shell.sppkg to
     Site Collection App Catalog（preferred for pilot）
     OR Tenant App Catalog if site catalog unavailable
     Target site context:
       https://isogokatudouhome.sharepoint.com/sites/severe-support-isogo
  3. Deploy / trust the app（skipFeatureDeployment = true）
  4. Optional smoke: confirm app appears as deployed in App Catalog
  5. Record evidence in verification doc
```

Example operator commands（adjust to installed PnP 3.x surface）:

```powershell
Connect-PnPOnline -Url "https://isogokatudouhome.sharepoint.com/sites/severe-support-isogo" -Interactive

# Prefer site collection App Catalog when present
Add-PnPApp -Path ".\sharepoint\solution\severe-behavior-support-spfx-shell.sppkg" `
  -Scope Site `
  -Publish `
  -Overwrite

Get-PnPApp -Scope Site |
  Where-Object { $_.Title -like "*severe-behavior-support-spfx-shell*" -or $_.Id -eq "4342db47-21a3-4c48-aed1-ef615f55c404" }
```

If `-Scope Site` is unavailable, document Tenant scope explicitly in evidence.

## 4. Explicit OUT / FORBIDDEN

```text
OUT:
  Agent-performed App Catalog upload
  Ready / Merge auto-progress
  treating Deploy PASS as Ready / Merge
  Tenant App Catalog NoScript / scripting mutation（even temporary）
    — requires separate Human GO / NO-GO
  Add-PnPApp retry / -Force while BLOCKED_BY_NOSCRIPT_GUARD
  Entra ID / Microsoft 365 tenant setting changes
  list / column / site schema mutation
  real business AssessmentSnapshots data writes
  production content page redesign beyond optional smoke add
  SPO_* secrets merely to unblock Agent
```

## 5. Agent execution attempt（this environment）

```text
Authenticated SharePoint session: ABSENT
Unauthenticated probe: HTTP 403
pwsh / PnP for App Catalog: not used by Agent for this gate

Therefore:
  Deploy execution by Agent = NOT RUN / ENVIRONMENT BLOCKED
  Deploy verification = NOT PASS（pending Human execution）
```

## 6. Pass criteria（when Human executes）

```text
PASS requires all:
  1. .sppkg identity matches package-solution.json（name/id/version）
  2. App Catalog add/deploy succeeds for authorized catalog scope
  3. app shows as deployed / published in catalog evidence
  4. no unintended schema / Entra / real-data writes
  5. evidence recorded in verification doc
  6. Ready / Merge still HUMAN-ONLY
```

## 7. Stop condition

```text
Decision-AS-ADAPTER-SPHTTPCLIENT-DEPLOY-1
= GO RECEIVED / EXECUTION HOLD

Deploy verification = NOT PASS
HOLD = BLOCKED_BY_NOSCRIPT_GUARD

Evidence HEAD: 6524785bc993a261f8f8cc2a3e2c4422b9291178

Observed:
  package build = PASS
  Site App Catalog = NOT PRESENT
  Tenant App Catalog = PRESENT
  Tenant Deploy = NOT COMPLETED
  NoScript mutation = 0
  Agent App Catalog upload = 0

Operator stop（correct）:
  Add-PnPApp prompt to temporarily enable scripting = answered N
  no Add-PnPApp retry
  no -Force

Still NOT AUTHORIZED by this GO:
  Tenant App Catalog NoScript / scripting mutation
  Ready / Merge auto-progress
  Agent Deploy

Next substantive gate（separate Human Decision only）:
  GO / NO-GO temporary scripting enablement on Tenant App Catalog
  solely to complete this scoped .sppkg Deploy
  If GO: enable → Deploy → confirm → restore = one set
```
