# RELEASE-READINESS-1 — Deploy GO（RC 8173a4c）

```text
Unit: Deploy GO（post RELEASE-READINESS-1 A. DEPLOY READY）
Status: GO RECEIVED / EXECUTION_HOLD（RELEASE-ARTIFACT-AUTHORITY-1）
Human Decision: Deploy GO（2026-08-14）
Repository main at GO: 775e4f6a10adf2967dc0f99de37bc95947d9da6d（#361 MERGED）
Application RC: 8173a4c18f6ce85254467c67ce81b481a537a35d
Artifact authority: ARTIFACT_NOT_REPRODUCIBLE（2026-08-15）
Agent App Catalog upload: NOT PERFORMED / NOT EXECUTABLE HERE
Human App Catalog upload: HOLD until package authority is resolved
```

## 1. Authority

```text
Upstream:
  VISUAL-ACCEPTANCE-2 = PASS / ACCEPTED
  RELEASE-READINESS-1 = A. DEPLOY READY（#361 MERGED）
  Rollback runbook = CREDIBLE（docs/architecture/release-readiness-1-rollback-runbook.md）
  RELEASE-ARTIFACT-AUTHORITY-1 = ARTIFACT_NOT_REPRODUCIBLE / EXECUTION_HOLD
    evidence: docs/architecture/release-artifact-authority-1.md

Deploy GO was received, but package byte-identity is not reproducible across
independent clean rebuilds of the same RC. Therefore App Catalog overwrite
remains EXECUTION_HOLD until a later Human-selected authority process lands.

This Deploy GO ≠ Agent App Catalog upload
This Deploy GO ≠ authorization to upload a non-authoritative / unreproducible .sppkg
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
| Repository main（docs tip at Deploy GO） | `775e4f6a10adf2967dc0f99de37bc95947d9da6d` |
| Application RC | `8173a4c18f6ce85254467c67ce81b481a537a35d` |
| Package path（build output） | `spfx/sharepoint/solution/severe-behavior-support-spfx-shell.sppkg` |
| Authoritative deploy package sha256 | **NONE**（ARTIFACT_NOT_REPRODUCIBLE） |
| Legacy agent reference（NOT AUTHORITATIVE） | size `116174` / sha256 `c8850e735c6ecbbe16ca77b9aa81bc4028d8926a3ae722e5d28cacc091430fec` |
| 2026-08-15 candidate（NOT AUTHORITATIVE） | size `35947` / sha256 `32ed5eafb59d1dcc1d44c89e0f5f34dc057569dded5d2b44b1f5724f24275746` |
| 2026-08-15 second rebuild（NOT AUTHORITATIVE） | size `35948` / sha256 `97b6ec3ff3af4ab2b779988ae7dc4fffc31c933bda3ea9462ae030240135a7b9` |
| Solution name | `severe-behavior-support-spfx-shell-client-side-solution` |
| ProductId | `4342db47-21a3-4c48-aed1-ef615f55c404` |
| Version | `1.0.0.0`（same as prior known-good — do not rely on version alone） |
| Previous known-good（rollback；CONFIRMED） | size `38661` / sha256 `456dfb62b15b9ea5e1ee51335e471aa8e6dabc00571d5bd8cd09ed737a34f6dd` |
| Catalog scope | Tenant（Site Collection App Catalog = NOT PRESENT） |
| Tenant App Catalog URL | `https://isogokatudouhome.sharepoint.com/sites/appcatalog` |
| Pilot site | `https://isogokatudouhome.sharepoint.com/sites/severe-support-isogo` |

```text
No application delta between Application RC 8173a4c… and repository main tip.
Main is docs-only ahead（VA-2 closeout + RELEASE-READINESS-1 evidence）.
```

## 3. Agent / Human execution status

```text
SPO / PnP credentials in Agent VM: ABSENT
Agent App Catalog upload: FORBIDDEN
RELEASE-ARTIFACT-AUTHORITY-1: ARTIFACT_NOT_REPRODUCIBLE
Authoritative RC .sppkg sha256: NONE
Result: EXECUTION_HOLD — do not upload/overwrite until package authority is resolved
```

## 4. Human operator procedure（AUTHORIZED ONLY AFTER package authority）

```text
Current status: PROCEDURE DOCUMENTED / EXECUTION HOLD
Do not run §4.A or §4.B until Human selects a package-authority resolution
（see docs/architecture/release-artifact-authority-1.md §9）.
```

Preferred later path remains PC + PnP（§4.A）. Browser / Safari（§4.B）remains an alternative after authority exists.
PowerShell on iPhone is not required.

Common preconditions（both paths；when execution is later re-authorized）:

1. **Retain** previous known-good `.sppkg`（38661-byte；sha256 `456dfb62…`）in a **different name/folder**. Never delete this backup.
2. Confirm the **authoritative** RC package size + sha256 from the then-current authority doc — **do not** use legacy `c885…` / `32ed…` / `97b6…` as authority.
3. Both packages may share version `1.0.0.0` / same ProductId — **do not identify by version or filename alone**.
4. If NoScript / scripting / enablement error / unexpected warning appears: **STOP**. Do not force. Do not delete. Obtain separate DEPLOY-NOSCRIPT GO if needed.
5. **Do not remove** the existing app from App Catalog to “reinstall”. Replacement/overwrite only.
6. After success: optional pilot page smoke；keep FIELD-WORKFLOW synthetic / fail-closed expectations.
7. Record verification evidence（timestamp, operator, path used, size/sha256, enable/deploy confirmation）.

Rollback if needed: re-upload/overwrite with the retained 38661-byte known-good `.sppkg` per
`docs/architecture/release-readiness-1-rollback-runbook.md`.

### 4.0 Mobile / Safari safety（when §4.B is later re-authorized）

Phone Deploy can be 許容範囲 after package authority exists, but the main risk is **file mix-up**.
If using iPhone / Safari, obey all four:

```text
1. Keep old 38661 B forever under a different name/folder — never delete it for this run
2. Select only the authoritative new package after confirming the locked size/sha256
3. Read overwrite / enable confirmation screens before confirming
4. On error, NoScript, or unexpected warning: STOP immediately — no delete, no force, no blind retry
```

```text
IN（when re-authorized）: upload + overwrite / enable confirmation only（§4.B）
OUT: App Catalog app deletion
OUT: forced retry through NoScript / unexplained errors
OUT: broader tenant changes
OUT: uploading unreproducible / non-authoritative packages
If anything feels wrong: capture screenshot(s) and STOP for judgment
```

### 4.A Preferred — PC + PnP PowerShell（execution currently HOLD）

PnP PowerShell targets Windows / Linux / macOS. Do not treat iPhone-native PowerShell as the primary path.

1. Connect（PnP）to Tenant App Catalog host / pilot context as local ops practice requires.
2. Publish only the **authority-locked** `.sppkg`:

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

### 4.B Alternative — SharePoint 管理センター（browser / Safari）（execution currently HOLD）

1. Save only the **authority-locked** new `.sppkg` into「ファイル」（or equivalent）.
2. Keep the **old** `38661`-byte `.sppkg` under a different name/folder.
3. Open SharePoint admin center in Safari（or desktop browser）.
4. Navigate: その他の機能 → アプリ → 開く.
5. アプリの管理 → アップロード.
6. Select the authoritative new `.sppkg` only（confirm size/sha256 before choosing）.
7. Carefully confirm overwrite / enable dialogs for the existing shell app.
8. If error or NoScript-related messaging appears: **中止 / STOP**. Do not retry blindly.
9. Record that the admin-center path was used（device, browser, enable result）.

```text
§4.B ≠ permission to skip prior-package retention
§4.B ≠ permission to ignore NoScript / enable failures
§4.B ≠ permission to delete the App Catalog app and re-add
§4.B ≠ permission to upload unreproducible packages
§4.B ≠ Agent upload
```

## 5. Gate board

```text
DADS = COMPLETE
VISUAL-ACCEPTANCE-2 = PASS / ACCEPTED
RELEASE-READINESS-1 = A. DEPLOY READY（readiness evidence）
Deploy GO = RECEIVED
RELEASE-ARTIFACT-AUTHORITY-1 = ARTIFACT_NOT_REPRODUCIBLE
App Catalog upload execution = EXECUTION_HOLD
Deploy verification evidence = NOT YET
```

## 6. Next

```text
1. Do NOT upload c885… / 32ed… / 97b6… as deployment authority
2. Resolve package reproducibility or an explicit Human byte-identity authority process
   （docs/architecture/release-artifact-authority-1.md §9）
3. Keep rollback package 38661 B / sha256 456dfb62… retained
4. Only after authority: execute §4.A or §4.B and record verification
5. Deploy GO alone ≠ verification PASS ≠ package authority
```
