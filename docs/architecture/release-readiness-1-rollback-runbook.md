# RELEASE-READINESS-1 — SPFx App Catalog Rollback Runbook

```text
Unit: RELEASE-READINESS-1（docs-only operational evidence）
Kind: App Catalog package rollback procedure
Status: DOCUMENTED / CREDIBLE（not executed）
RC SHA: 8173a4c18f6ce85254467c67ce81b481a537a35d
Authority: Human RELEASE-READINESS-1 RESUME GO
Date: 2026-08-14
```

## 1. Purpose

Give a Human operator a **credible, non-destructive** way to reverse a Tenant App Catalog deployment of
`severe-behavior-support-spfx-shell.sppkg` for the pilot tenant, without SharePoint list/column schema
rollback and without destructive data deletion.

```text
This document ≠ Deploy GO
This document ≠ authorization to execute rollback now
Agent App Catalog mutation = FORBIDDEN
```

## 2. Package identities（fixed）

### 2.1 Previous known-good（live catalog as of 2026-08-11 Deploy PASS）

Authority: `docs/architecture/decision-assessment-snapshot-adapter-sphttpclient-deploy-verification.md`

```text
path（build-time）: spfx/sharepoint/solution/severe-behavior-support-spfx-shell.sppkg
size: 38661 bytes
name: severe-behavior-support-spfx-shell-client-side-solution
solution id / ProductId: 4342db47-21a3-4c48-aed1-ef615f55c404
version: 1.0.0.0
Tenant App Catalog app Id（PnP metadata）: 0d75630f-f757-45ec-b055-de53f1fd2476
AppCatalogVersion: 1.0.0.0
Deployed: True
Catalog scope used: Tenant
Tenant App Catalog URL: https://isogokatudouhome.sharepoint.com/sites/appcatalog
Pilot site context: https://isogokatudouhome.sharepoint.com/sites/severe-support-isogo
```

### 2.2 Release Candidate package（built from RC；not uploaded by this unit）

```text
RC SHA: 8173a4c18f6ce85254467c67ce81b481a537a35d
path: spfx/sharepoint/solution/severe-behavior-support-spfx-shell.sppkg
size: 116174 bytes
sha256: c8850e735c6ecbbe16ca77b9aa81bc4028d8926a3ae722e5d28cacc091430fec
name: severe-behavior-support-spfx-shell-client-side-solution
solution id / ProductId: 4342db47-21a3-4c48-aed1-ef615f55c404
version: 1.0.0.0
```

### 2.3 Version-collision note（mandatory）

```text
RC and previous known-good share version 1.0.0.0 and the same solution ProductId.
Do NOT rely on version string alone to tell packages apart.
Prefer: retained .sppkg file bytes / sha256 / build SHA / recorded size.
Operator MUST keep a copy of the previous known-good .sppkg before overwriting the catalog.
```

## 3. Owner / operator

```text
Owner: Human SharePoint / App Catalog operator（pilot tenant）
Agent: NOT AUTHORIZED to upload, overwrite, remove, or trust apps
NoScript / DenyAddAndCustomizePages temporary change: requires separate Human GO
  （historical: Decision-AS-ADAPTER-SPHTTPCLIENT-DEPLOY-NOSCRIPT-1）
```

## 4. Preconditions before rollback

1. Confirm which package is currently deployed（title / ProductId / size if available / deploy time）.
2. Confirm the **previous known-good `.sppkg` file** is retained offline（38661-byte build from 2026-08-11 evidence, or re-built from the commit that produced that deploy）.
3. Confirm Site Collection App Catalog remains NOT PRESENT；Tenant App Catalog remains the target scope unless Human re-decides.
4. Confirm rollback trigger reason is recorded（smoke fail / visual regress / package identity error / other）.

## 5. Rollback procedure（package only）

Human or credentialed operator only. Example PnP surface（adjust to installed cmdlets）:

```powershell
# Connect to pilot site or tenant App Catalog host as required by local ops practice
Connect-PnPOnline -Url "https://isogokatudouhome.sharepoint.com/sites/appcatalog" -Interactive

# Re-publish previous known-good package (Overwrite). Do NOT invent a new ProductId.
Add-PnPApp -Path ".\path\to\previous-known-good\severe-behavior-support-spfx-shell.sppkg" `
  -Scope Tenant `
  -Publish `
  -Overwrite

Get-PnPApp -Scope Tenant |
  Where-Object {
    $_.Title -like "*severe-behavior-support-spfx-shell*" -or
    $_.ProductId -eq "4342db47-21a3-4c48-aed1-ef615f55c404"
  }
```

If Tenant NoScript / scripting guard blocks upload, **STOP**. Do not force. Separate Human GO is required（same family as historical DEPLOY-NOSCRIPT）.

Optional removal of a broken app entry is **out of default path**. Prefer Overwrite re-publish of known-good. Removal/uninstall from sites requires explicit Human decision and is not required for package rollback credibility.

## 6. Expected effect on SharePoint data

```text
List / column schema: unchanged by package rollback
AssessmentSnapshots / SupportPlans items: retained（no delete）
ProcedureRecord / FIELD-WORKFLOW: synthetic in RC UI — no live list dependency for rollback of package
Permission / Entra groups: unchanged
Site URLs: unchanged
```

Schema rollback is **NOT REQUIRED** for SPFx package rollback.

## 7. Destructive actions

```text
Default rollback path: NON-DESTRUCTIVE（Overwrite previous .sppkg）
Forbidden without separate Human GO:
  - list / item deletion
  - column removal
  - site deletion
  - permanent NoScript leave-behind
  - Entra / M365 tenant setting changes
```

If an operator believes destructive cleanup is required, **HOLD** and escalate — do not improvise.

## 8. Verification after rollback

1. `Get-PnPApp` shows Deployed = True for the shell solution; version/title match expected known-good.
2. Open pilot site page hosting the web part；confirm shell loads（or fails closed as designed）.
3. Confirm DEMO / synthetic boundary still readable if demo host is used.
4. Record evidence（timestamp, operator, package path/sha256/size, Get-PnPApp output）.
5. Confirm NoScript / DenyAddAndCustomizePages restored if a temporary change was authorized.

## 9. Rollback triggers（examples）

```text
- Post-deploy smoke fails on primary destinations
- Save 5-state / fail-closed regression observed live
- Wrong package / wrong SHA uploaded
- Human abort during Deploy GO window
```

## 10. Credibility verdict for RELEASE-READINESS-1

```text
Rollback procedure: DOCUMENTED
Destructive dependency: NONE on default path
Schema rollback required: NO
Owner/operator: IDENTIFIED（Human App Catalog operator）
Previous known-good identity: RECORDED（2026-08-11；size 38661；ProductId fixed）
RC package distinctiveness: RECORDED via sha256/size/RC SHA（version string insufficient alone）
Execution status: NOT RUN（this unit）
```

Verdict for readiness: **CREDIBLE** — sufficient to clear the prior rollback HOLD, provided the operator retains the previous known-good `.sppkg` before any future RC upload.
