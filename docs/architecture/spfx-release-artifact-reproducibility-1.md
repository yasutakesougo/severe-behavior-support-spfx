# SPFX-RELEASE-ARTIFACT-REPRODUCIBILITY-1

この文書は **SPFX-RELEASE-ARTIFACT-REPRODUCIBILITY-1** の closeout 正本である。
判定材料は、同一 basis 上で完了した local 再 package 比較である。
本記録は package を再ビルドしない。`.sppkg` を repository に入れない。
recorded authority を BUILD 2 に差し替えない。

[`spfx-release-artifact-authority-1.md`](./spfx-release-artifact-authority-1.md)
は Artifact Authority closeout 正本である。本記録はそれを再解釈しない。

後続の fixture-only Deploy 記録（この closeout を書き換えない）:
[`spfx-fixture-only-deploy-1.md`](./spfx-fixture-only-deploy-1.md)
（basis `f622fcd…` / Option A KEEP CURRENT DEPLOYMENT）。
next-gate 文言は本記録時点の snapshot である。

```text
repository: yasutakesougo/severe-behavior-support-spfx
Closeout ID: SPFX-RELEASE-ARTIFACT-REPRODUCIBILITY-1
Kind: Closeout / evidence recording（docs-only）
Status: RECORDED
Decision: COMPLETE / BYTE-IDENTICAL NOT ACHIEVED
Classification: NON-BLOCKING / CARRY
```

Live gate（Ready / Merge 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

## 1. Exact basis

Record both identities distinctly. Do not collapse them.

```text
Repository current main / reproducibility docs tip:
  1fedeba4d8bafcf7d59fec92d0126e2ce621a0c6
  Merge pull request #435 from yasutakesougo/docs/spfx-production-binding-decision-1

Application tree (identical spfx):
  16a66488b18073eac3ef6af3a4b1114e147d64e6
  d8cbd0e4e7fa9eaf585ca7acef5b1f8f504829c3
  8a5056c5a93fc6d3de1989d3160c9e3cf9d8aacb
  c100c439f50a06f5fcbcb831e83ea4f67b218ad1
  8f13cd91f9b56cf067fbd0cef799b5d502c33773
  1fedeba4d8bafcf7d59fec92d0126e2ce621a0c6
PR #432 / #433 / #434 / #435 delta:
  docs-only
```

```text
Deep Scan result authority:
  8a5056c5a93fc6d3de1989d3160c9e3cf9d8aacb
  COMPLETE / NO VERIFIED BLOCKERS
Production Binding Decision:
  Option A — KEEP unbound
  SELECTED / LOCKED
  NOT AUTHORIZED / NOT ACTIVE
```

RG-REPRO from Artifact Authority closeout（**NOT EVALUATED**）
is superseded by this record for this basis.
That supersession does not convert reproducibility to PASS,
does not replace BUILD 1 as recorded artifact authority,
and does not authorize Production Binding, LIVE WRITE,
App Catalog mutation, or Deploy.

## 2. Scope

```text
Kind: local two-build .sppkg comparison
Mode: local Heft only
Fixes during closeout: NONE
package-solution.json edits: NONE
.sppkg committed: NO
Rebuild during this closeout: NO
Issues opened: NONE
SharePoint / Graph / M365 / Entra / App Catalog mutation: NONE
Production mutation: NONE
```

Generated `spfx/sharepoint/solution/**` remains gitignored and is not
Deploy evidence.

## 3. Reproducibility verdict

```text
SPFX-RELEASE-ARTIFACT-REPRODUCIBILITY-1:
COMPLETE
Byte-identical .sppkg: NOT ACHIEVED
Classification: NON-BLOCKING / CARRY
VP4-P2-2: CONFIRMED on this application tree
Do not convert RG-REPRO to PASS
```

Recorded artifact authority remains BUILD 1:

```text
BUILD 1 (Artifact Authority recorded; not replaced):
  sha256 d264a74326dff42c98eff262dbe608f8ff2886d1779312786d4be15a4b6096ac
  size 58247 bytes
  Node v22.23.1
  packed 2026-08-18 14:20:18 UTC
```

Evaluation rebuild:

```text
BUILD 2 (this gate only; not recorded authority):
  command:
    cd spfx
    npx heft test --clean --production
    npx heft package-solution --production
  heft test --clean --production: PASS 277/277
  heft package-solution --production: ALL DONE
  sha256 31a7345e3501d191efa3677b59543d2b31241c8ca47cc66bf5eb327f18f52f64
  size 58247 bytes
  packed 2026-08-18 16:32:14 UTC
```

Comparison:

```text
zip entries: 19 / 19 same names
content hash diffs: 3
  ClientSideAssets.xml
  ClientSideAssets.xml.config.xml
  feature_34cf0c0f-1829-48f8-b907-4cb4a2722634.xml.config.xml
  GUID-stripped text: identical
  generated UniqueId GUIDs: differ
ZIP date-only diffs: 16 remaining entries
JS / PNG / AppManifest / feature.xml content: identical
```

This matches existing VP4-P2-2: generated XML UniqueIds and ZIP timestamps
vary between otherwise identical Node 22.23.1 builds.

## 4. UNVERIFIED / RELEASE-GAP

Do not convert these into PASS.

```text
U1:
  Live tenant OrganizationId / SiteId isolation
  Status: UNVERIFIED

U2:
  Exact-SHA Deep Security Scan
  Status: EXECUTED for 8a5056c5a93fc6d3de1989d3160c9e3cf9d8aacb

U3:
  Current-basis .sppkg hash
  Status: RECORDED for BUILD 1
  sha256 d264a74326dff42c98eff262dbe608f8ff2886d1779312786d4be15a4b6096ac
  BUILD 2 is evaluation only.

RG-REPRO:
  Artifact reproducibility
  Status: EVALUATED / BYTE-IDENTICAL NOT ACHIEVED
  Classification: NON-BLOCKING / CARRY
  Do not convert to PASS.

RG-BIND:
  Production Binding Decision
  Status: TAKEN
  Result: Option A KEEP unbound
  Binding remains NOT AUTHORIZED / NOT ACTIVE
```

Candidate handling is unchanged:

```text
DS-C1: CANDIDATE / NOT VERIFIED
DS-C2: CANDIDATE / NOT VERIFIED
SR-P3-1: CARRY / NON-BLOCKING
SR-P3-2: CARRY / NON-BLOCKING
VP4-P2-2: CARRY / NON-BLOCKING / CONFIRMED
```

## 5. Release interpretation

```text
Reproducibility COMPLETE != byte-identical PASS
Reproducibility COMPLETE != Production Binding GO
Reproducibility COMPLETE != LIVE WRITE GO
Reproducibility COMPLETE != Deploy GO
BUILD 2 hash != recorded artifact authority
Local .sppkg hash != App Catalog object
Option A KEEP unbound unchanged
```

## 6. Next gate

```text
Next gate identity: NONE FROM THIS EVALUATION
This closeout does not start Deploy.
This closeout does not start LIVE WRITE.
This closeout does not start Option B.
Deploy / LIVE WRITE / App Catalog remain HOLD and require separate Human GOs.
```

Reason:

- byte-identical rebuild is not achieved and is recorded as NON-BLOCKING carry
- Binding Decision is already Option A KEEP unbound
- no production mutation is required by this evaluation

## 7. STOP

```text
This closeout is documentation / evidence recording only.
Do not rebuild .sppkg from this document.
Do not commit .sppkg.
Do not replace BUILD 1 recorded authority with BUILD 2.
Do not convert RG-REPRO to PASS.
Do not Production Bind.
Do not enable LIVE WRITE.
Do not Deploy.
Do not mutate SharePoint / Graph / M365 / Entra / App Catalog.
Wait for a separate Human GO.
CURRENT ACTION: STOP
```
