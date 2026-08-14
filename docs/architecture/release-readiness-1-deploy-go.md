# RELEASE-READINESS-1 — Deploy GO（RC 8173a4c）

```text
Unit: Deploy GO（post RELEASE-READINESS-1 A. DEPLOY READY）
Status: GO RECEIVED / AGENT EXECUTION HOLD
Human Decision: Deploy GO（2026-08-14）
Repository main at GO: 775e4f6a10adf2967dc0f99de37bc95947d9da6d（#361 MERGED）
Application RC: 8173a4c18f6ce85254467c67ce81b481a537a35d
Agent App Catalog upload: NOT PERFORMED / NOT EXECUTABLE HERE
```

## 1. Authority

```text
Upstream:
  VISUAL-ACCEPTANCE-2 = PASS / ACCEPTED
  RELEASE-READINESS-1 = A. DEPLOY READY（#361 MERGED）
  Rollback runbook = CREDIBLE（docs/architecture/release-readiness-1-rollback-runbook.md）

This Deploy GO authorizes Human（credentialed operator）to upload/publish the
scoped RC .sppkg to the pilot Tenant App Catalog.

This Deploy GO ≠ Agent App Catalog upload
This Deploy GO ≠ SharePoint list/column mutation
This Deploy GO ≠ Entra / M365 tenant config mutation
This Deploy GO ≠ real business data writes beyond existing authorized paths
This Deploy GO ≠ NoScript / DenyAddAndCustomizePages temporary change
  （requires separate DEPLOY-NOSCRIPT Human GO if guard trips）
```

Related historical procedure family:
`docs/architecture/decision-assessment-snapshot-adapter-sphttpclient-deploy-packet.md`

## 2. Fixed identities

| Label | Value |
|---|---|
| Repository main（docs tip） | `775e4f6a10adf2967dc0f99de37bc95947d9da6d` |
| Application RC | `8173a4c18f6ce85254467c67ce81b481a537a35d` |
| Package path | `spfx/sharepoint/solution/severe-behavior-support-spfx-shell.sppkg` |
| Package size | `116174` bytes |
| Package sha256 | `c8850e735c6ecbbe16ca77b9aa81bc4028d8926a3ae722e5d28cacc091430fec` |
| Solution name | `severe-behavior-support-spfx-shell-client-side-solution` |
| ProductId | `4342db47-21a3-4c48-aed1-ef615f55c404` |
| Version | `1.0.0.0`（same as prior known-good — do not rely on version alone） |
| Previous known-good size | `38661` bytes（2026-08-11 Tenant Deploy PASS） |
| Catalog scope | Tenant（Site Collection App Catalog = NOT PRESENT） |
| Tenant App Catalog URL | `https://isogokatudouhome.sharepoint.com/sites/appcatalog` |
| Pilot site | `https://isogokatudouhome.sharepoint.com/sites/severe-support-isogo` |

```text
No application delta between Application RC 8173a4c… and repository main tip.
Main is docs-only ahead（VA-2 closeout + RELEASE-READINESS-1 evidence）.
```

## 3. Agent execution status

```text
SPO / PnP credentials in Agent VM: ABSENT
Interactive Human login surface in Agent VM: NOT AVAILABLE for this Deploy
Agent App Catalog upload: FORBIDDEN by deploy authority pattern
Result: EXECUTION HOLD — Human operator must run §4
```

## 4. Human operator procedure（authorized now）

1. **Retain** previous known-good `.sppkg`（38661-byte / 2026-08-11）before overwrite.
2. Confirm RC package sha256 = `c8850e735c6ecbbe16ca77b9aa81bc4028d8926a3ae722e5d28cacc091430fec`.
3. Connect（PnP）to Tenant App Catalog host / pilot context as local ops practice requires.
4. Publish:

```powershell
Add-PnPApp -Path ".\sharepoint\solution\severe-behavior-support-spfx-shell.sppkg" `
  -Scope Tenant `
  -Publish `
  -Overwrite
```

5. If NoScript / scripting guard blocks: **STOP**. Do not `-Force`. Obtain separate DEPLOY-NOSCRIPT GO.
6. Verify:

```powershell
Get-PnPApp -Scope Tenant |
  Where-Object {
    $_.Title -like "*severe-behavior-support-spfx-shell*" -or
    $_.ProductId -eq "4342db47-21a3-4c48-aed1-ef615f55c404"
  }
```

Expect Deployed = True；title/ProductId match；record AppCatalogVersion / PnP Id.
7. Optional site smoke on pilot page；keep FIELD-WORKFLOW synthetic / fail-closed expectations.
8. Record verification evidence（timestamp, operator, sha256, Get-PnPApp output, NoScript final state if touched）.

Rollback if needed: `docs/architecture/release-readiness-1-rollback-runbook.md`.

## 5. Gate board

```text
DADS = COMPLETE
VISUAL-ACCEPTANCE-2 = PASS / ACCEPTED
RELEASE-READINESS-1 = A. DEPLOY READY（#361 MERGED）
Deploy GO = RECEIVED
App Catalog upload execution = HOLD FOR HUMAN OPERATOR
Deploy verification evidence = NOT YET
```

## 6. Next

```text
1. Human executes §4 Tenant App Catalog Overwrite
2. Human（or follow-up Agent docs-only）records Deploy verification PASS/FAIL
3. Do not treat Deploy GO alone as verification PASS
```
