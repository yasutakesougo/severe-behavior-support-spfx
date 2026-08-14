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

```text
Preferred: PC + PnP PowerShell（§4.A）
Alternative: SharePoint 管理センター browser upload（§4.B；Safari / iPhone 可）
Not required: PowerShell on iPhone
```

This Deploy includes overwrite of an existing app, retention of the prior 38661-byte package,
prevention of swapping the new 116174-byte package, and rollback readiness.
For a first-time operator, **PC is safer** than phone overwrite.

Common preconditions（both paths）:

1. **Retain** previous known-good `.sppkg`（38661-byte / 2026-08-11）in a **different name/folder** before overwrite.
2. Confirm RC package size = `116174` and sha256 = `c8850e735c6ecbbe16ca77b9aa81bc4028d8926a3ae722e5d28cacc091430fec`.
3. If NoScript / scripting / enablement error appears: **STOP**. Do not force. Obtain separate DEPLOY-NOSCRIPT GO.
4. After success: optional pilot page smoke；keep FIELD-WORKFLOW synthetic / fail-closed expectations.
5. Record verification evidence（timestamp, operator, path used, size/sha256, enable/deploy confirmation）.

Rollback if needed: `docs/architecture/release-readiness-1-rollback-runbook.md`.

### 4.A Preferred — PC + PnP PowerShell

PnP PowerShell targets Windows / Linux / macOS. Do not treat iPhone-native PowerShell as the primary path.

1. Connect（PnP）to Tenant App Catalog host / pilot context as local ops practice requires.
2. Publish:

```powershell
Add-PnPApp -Path ".\sharepoint\solution\severe-behavior-support-spfx-shell.sppkg" `
  -Scope Tenant `
  -Publish `
  -Overwrite
```

3. Verify:

```powershell
Get-PnPApp -Scope Tenant |
  Where-Object {
    $_.Title -like "*severe-behavior-support-spfx-shell*" -or
    $_.ProductId -eq "4342db47-21a3-4c48-aed1-ef615f55c404"
  }
```

Expect Deployed = True；title/ProductId match；record AppCatalogVersion / PnP Id.

### 4.B Alternative — SharePoint 管理センター（browser / Safari）

Microsoft’s Apps management UI allows uploading a `.sppkg` from the browser.
If the RC `.sppkg` is in iPhone「ファイル」, Safari can upload it. This path is **authorized** by Deploy GO,
but is **higher risk** for first-time overwrite than §4.A.

1. Save the **new** `116174`-byte `.sppkg` into「ファイル」（or equivalent）.
2. Keep the **old** `38661`-byte `.sppkg` under a different name/folder — do not overwrite the backup copy.
3. Open SharePoint admin center in Safari（or desktop browser）.
4. Navigate: その他の機能 → アプリ → 開く.
5. アプリの管理 → アップロード.
6. Select the **new** `.sppkg` only（confirm size/name before choosing）.
7. Carefully confirm overwrite / enable dialogs for the existing shell app.
8. If error or NoScript-related messaging appears: **中止 / STOP**. Do not retry blindly.
9. Record that the admin-center path was used（device, browser, enable result）.

```text
§4.B ≠ permission to skip prior-package retention
§4.B ≠ permission to ignore NoScript / enable failures
§4.B ≠ Agent upload
```

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
1. Human executes Tenant App Catalog overwrite via §4.A（preferred）or §4.B（browser）
2. Prefer PC for first overwrite; phone/Safari is possible but easier to mis-select package
3. Human（or follow-up Agent docs-only）records Deploy verification PASS/FAIL
4. Do not treat Deploy GO alone as verification PASS
```
