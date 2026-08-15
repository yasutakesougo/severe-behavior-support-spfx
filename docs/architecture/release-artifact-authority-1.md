# RELEASE-ARTIFACT-AUTHORITY-1 — Closeout

```text
Unit: RELEASE-ARTIFACT-AUTHORITY-1
Status: COMPLETE（docs evidence）
Classification: ARTIFACT_NOT_REPRODUCIBLE
Deployment: EXECUTION_HOLD
Date: 2026-08-15
Application RC: 8173a4c18f6ce85254467c67ce81b481a537a35d
Kind: independent clean rebuild authority check（Human / second worktree）
App Catalog mutation: 0
```

## 1. Decision

```text
Final: ARTIFACT_NOT_REPRODUCIBLE / EXECUTION_HOLD
```

Meaning:

```text
No .sppkg byte-identity is promoted to deployment artifact authority for this RC.
Deploy upload / overwrite remains HOLD until a reproducible authority process exists.
RELEASE-READINESS-1 A. DEPLOY READY ≠ authority to upload a non-reproducible package.
Prior Deploy GO execution remains blocked on artifact authority.
```

## 2. Build provenance（second clean rebuild）

```text
Target RC: 8173a4c18f6ce85254467c67ce81b481a537a35d
Second worktree: /Users/yasutakesougo/severe-behavior-support-spfx-release-8173a4c-20260815-second
Git status: clean detached HEAD
Node: v22.23.1
npm: 10.9.8
SPFx build rig: 1.23.2
Heft: 1.2.22
TypeScript: 5.8.3
Build command: heft test --clean --production && heft package-solution --production
```

## 3. Artifact comparison

| Artifact | Size | SHA-256 | Authority |
|---|---:|---|---|
| Existing candidate | 35,947 | `32ed5eafb59d1dcc1d44c89e0f5f34dc057569dded5d2b44b1f5724f24275746` | **NOT AUTHORITATIVE**（not independently reproduced） |
| Second clean rebuild | 35,948 | `97b6ec3ff3af4ab2b779988ae7dc4fffc31c933bda3ea9462ae030240135a7b9` | **NOT AUTHORITATIVE**（differs from candidate） |
| Legacy agent reference | 116,174 | `c8850e735c6ecbbe16ca77b9aa81bc4028d8926a3ae722e5d28cacc091430fec` | **UNVERIFIED LEGACY REFERENCE / NOT AUTHORITATIVE** |

```text
Both 35,947 / 35,948 packages: unzip -t = PASS
Size mismatch: YES
SHA-256 mismatch: YES
```

Note: the 116,174-byte legacy agent artifact is a different build lineage than the 2026-08-15 second-worktree pair above. It remains unverified and is **not** deployment authority.

## 4. Expanded content analysis

16 files each. Shared XML / manifest / PNG / localized resource content matched where expected.

Observed differing surfaces:

```text
- bundle filename / content hash
- bundle body SHA-256
- WebPart XML bundle reference
- ClientSideAssets.xml generated Feature ID
- ClientSideAssets.xml.config.xml generated ID
- _rels/ClientSideAssets.xml.rels bundle reference
- feature config generated ID
- LICENSE filename only（content identical）
  sha256 d267720e13a0e64f3c112753bc87a157ef071165ed1bc268803316ed0d231d31
```

Bundle bodies were both 117,743 bytes. After normalizing 11 CSS Modules generated class hashes, logical CSS/JS content matched. Absolute worktree path–sensitive CSS Modules hashing plus package-solution random generated IDs explain the byte-level `.sppkg` mismatch.

```text
Logical package family: equivalent after CSS-hash normalization
Byte-identical .sppkg authority: FAIL
```

## 5. Verification / CI（RC remains sound as source）

```text
SPFx production test: 137 success / 0 failure
root verify:ci: PASS
  - 578 tests PASS
  - contract boundary PASS
  - scope PASS
  - accessibility 33 checks PASS
GitHub CI on RC:
  - SHA match
  - conclusion: success
  - https://github.com/yasutakesougo/severe-behavior-support-spfx/actions/runs/31751056170
```

Source/RC verification PASS does **not** create package byte authority.

## 6. Rollback prerequisite（CONFIRMED）

Human-retained previous known-good package:

```text
Path: /Users/yasutakesougo/severe-behavior-support-spfx-deploy232/spfx/sharepoint/solution/severe-behavior-support-spfx-shell.sppkg
Size: 38,661 bytes
SHA-256: 456dfb62b15b9ea5e1ee51335e471aa8e6dabc00571d5bd8cd09ed737a34f6dd
ZIP integrity: PASS
```

Keep this file. Do not delete. Prefer size + sha256 over version `1.0.0.0`.

## 7. Non-claims

```text
ARTIFACT_NOT_REPRODUCIBLE ≠ RC source defect
ARTIFACT_NOT_REPRODUCIBLE ≠ VA-2 reopen
ARTIFACT_NOT_REPRODUCIBLE ≠ permission to upload “close enough” packages
ARTIFACT_NOT_REPRODUCIBLE ≠ App Catalog delete-and-readd
c885… / 32ed… / 97b6… ≠ deployment authority
```

## 8. Gate board

```text
DADS = COMPLETE
VISUAL-ACCEPTANCE-2 = PASS / ACCEPTED
RELEASE-READINESS-1 = A. DEPLOY READY（readiness evidence；package authority deferred）
Deploy GO = RECEIVED historically
RELEASE-ARTIFACT-AUTHORITY-1 = ARTIFACT_NOT_REPRODUCIBLE
App Catalog upload execution = EXECUTION_HOLD
```

## 9. Next Human gate

```text
Resolve package reproducibility / authority before any App Catalog overwrite.
Candidates（separate Human selection）:
  1. Deterministic build path（stable CSS Modules hashing / pinned generated IDs）
  2. Explicit Human authority process for a single retained .sppkg byte identity
     （retain + dual-person confirm + sha256 lock）— only if Human accepts non-rebuild identity
Do not upload until authority is explicit.
```
