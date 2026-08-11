# Issue Status Reconciliation — Post-Deploy resync #6 / #8 / #4 / #22 / #28

この文書は、Deploy / App Catalog PASS（2026-08-11）後に、
Issue 本文が main SoT より古い状態を残している5件について、
**read-only 照合 → KEEP OPEN / 更新内容確定** の正本である。

Parent lineage:
[`issue-status-reconciliation-packet.md`](./issue-status-reconciliation-packet.md)
[`issue-status-reconciliation-resync-6-8.md`](./issue-status-reconciliation-resync-6-8.md)

```text
repository: yasutakesougo/severe-behavior-support-spfx
Kind: Status Reconciliation（Issue hygiene；not re-Decision）
Status: EXECUTED（body Current-status patches + comments）
Date: 2026-08-11
Assessor: Agent read-only against origin/main + Accepted / LOCKED docs
Original SoT tip（reconciliation freeze）: 1c24f3ebad3819b12cb8ee05f83c6ff558cfbf38
SoT tip（baseline refresh）: 30a1656416e83917b5bad08b0278037c02b8e0fe
Close of any of the 5 Issues: FORBIDDEN
SharePoint / M365 / Entra mutation by this packet: FORBIDDEN
Implementation Start of unrelated backlog: NOT AUTHORIZED
```

## Baseline refresh（PR #234）

```text
Purpose: rebase + tip sync only；not a new Status Reconciliation Decision
Original freeze tip: 1c24f3ebad3819b12cb8ee05f83c6ff558cfbf38
Current main tip: 30a1656416e83917b5bad08b0278037c02b8e0fe
Tip advance since freeze: PR #235 squash merge
  feat(spfx): SHELL-UX-1 presentation chrome (#28)

Semantic outcome unchanged（diff 0 on Close / KEEP OPEN）:
  #6 / #8 / #4 / #22 / #28 = KEEP OPEN
  Deploy evidence HEAD unchanged: 7358a12160e4cf4835230df0b4fe64250d8f52f1
  SharePoint / M365 / Entra mutation by this packet: FORBIDDEN
  Ready / Merge of this PR: HUMAN-ONLY（Merge = separate GO）
```

## Shared SoT freeze

```text
main HEAD: 30a1656416e83917b5bad08b0278037c02b8e0fe
Deploy evidence HEAD: 7358a12160e4cf4835230df0b4fe64250d8f52f1
Live-write evidence HEAD: f8cc4ceb02b9c99643f48e333de66ab0bef8a4c0
Binder HEAD（referenced）: e52ad05cd5d8e2ec705034bb98cb22e9673dbf55
SHELL-UX-1 merge（post-freeze tip advance）: 30a1656416e83917b5bad08b0278037c02b8e0fe

AssessmentSnapshots column path（prior）:
  CN-1 CLOSED / CONSUMED / DEFAULT_COLUMNS_ONLY
  Decision-AS-COLUMN-EG-1 Accepted / LOCKED
  Human Column Create COMPLETE
  VR-1 PASS
  Isogo / Honmoku OBSERVED / CONFIRMED
  CV-REQ 8 / 8 OBSERVED / CONFIRMED

SPFx / binder / live / Deploy path（new since 2026-08-10 resync）:
  Decision-AS-ADAPTER-SPFX-VERSION-SCAFFOLD-1
    = Accepted / LOCKED / V-1 + A + D-HOLD（PR #224 / #225）
  SPFx 1.23.2 isolated scaffold + Heft + Jest + package-solution
    = DELIVERED on main（stack referenced as PR #226–#228）
  AssessmentSnapshot SPHttpClient binder
    = DELIVERED / synthetic VERIFIED（PR #229 stack；IR-P2-002 CLOSED / VERIFIED synthetic）
  Decision-AS-ADAPTER-SPHTTPCLIENT-LIVE-READ-1
    = PASS / VERIFIED（PR #230 stack）
  Decision-AS-ADAPTER-SPHTTPCLIENT-LIVE-WRITE-1
    = PASS / VERIFIED（PR #231 stack；synthetic residue = 0）
  Decision-AS-ADAPTER-SPHTTPCLIENT-DEPLOY-1
    = PASS / VERIFIED（PR #232 stack）
  Decision-AS-ADAPTER-SPHTTPCLIENT-DEPLOY-NOSCRIPT-1
    = PASS / VERIFIED（PR #233；Tenant App Catalog temp scripting + restore）

Catalog discovery（Deploy verification）:
  Site Collection App Catalog = NOT PRESENT
  Tenant App Catalog = PRESENT
  Tenant App Catalog URL = https://isogokatudouhome.sharepoint.com/sites/appcatalog
  Tenant Deploy / Publish = PASS
  NoScript baseline restored = Enabled
  permanent scripting leave-behind = 0
  Agent App Catalog upload = 0

Still true:
  Ready / Merge = HUMAN-ONLY
  Deploy PASS ≠ Ready / Merge
  Deploy PASS ≠ 3-month trial complete
  Deploy PASS ≠ production GO
  SHELL-UX-1 Merge ≠ #28 Close
  real business data writes = NOT AUTHORIZED
  Entra / tenant config changes = NOT AUTHORIZED
```

## Explicit non-claims

```text
This reconciliation ≠ Close of #6 / #8 / #4 / #22 / #28
This reconciliation ≠ #22 complete（AssessmentSnapshots binder path only advanced）
This reconciliation ≠ #28 shell UX complete
  （scaffold / binder / package / Deploy + SHELL-UX-1 presentation on main
   still leave Issue completion criteria / approval deps open）
This reconciliation ≠ #4 M365 env complete（App Catalog / Deploy slice only）
This reconciliation ≠ #19 / #20 / #21 / #23 / #24 / #27 / #68–#71 Close
This reconciliation ≠ Ready / Merge auto-progress
This reconciliation ≠ additional SharePoint column creation
Baseline tip refresh ≠ new Close / KEEP OPEN Decision
```

---

## Issue #6 — 3か月試行 parent

### Recommendation

**KEEP OPEN** + replace stale Current status / Gate markers.

### Stale markers（do not treat as truth）

```text
Deploy: 0
SPFx generation: HOLD
SharePoint integration: HOLD
SharePoint adapter / schema mapping implementation: HOLD
Implementation Start: HOLD
Deploy / real data: NO-GO（blanket；now partial Deploy PASS exists）
```

### Why KEEP OPEN

- 3-month anonymous trial parent remains unfinished.
- Governance (#19), assessment contracts (#20), security (#21), P0 acceptance (#23),
  domain (#24), finding/audit (#27), UI (#68–#71) remain OPEN.
- Deploy of SPFx shell package ≠ trial start complete / production ready.

### Replacement Current status（applied）

See Issue #6 body `Current status（reconciled 2026-08-11）`.

---

## Issue #8 — Decision Ledger

### Recommendation

**KEEP OPEN**（Decision Ledger role）+ sync AssessmentSnapshots / Deploy path.

### Stale markers

```text
Deploy: 0
SharePoint adapter / schema mapping implementation: HOLD
Implementation Start: HOLD
Deploy / real data: NO-GO（blanket）
```

### Why KEEP OPEN

- DEC-001〜017 ledger role remains active.
- Many DEC rows remain Proposed / Partial / Deferred.
- Status Reconciliation is not a re-Decision and not a Close reason.

### Replacement Current status（applied）

See Issue #8 body `Current status（reconciled 2026-08-11）`.

---

## Issue #4 — M365試験環境

### Recommendation

**KEEP OPEN** + record App Catalog / Deploy verification slice.

### Stale markers

```text
App Catalog利用可否: 未確認
（comments still say App Catalog変更: HOLD / SPFx配置: HOLD）
```

### Confirmed from main SoT

```text
Tenant App Catalog = PRESENT
Site Collection App Catalog = NOT PRESENT
Tenant Deploy / Publish = PASS / VERIFIED
package = severe-behavior-support-spfx-shell.sppkg
```

### Still OPEN / incomplete

```text
A/B formal site approval checklist items
Entra試験グループ作成
権限・分離テスト完了
SPFx配置承認者の恒久運用記録（Deploy GO は別切片）
本番変更境界の運用定着
```

### Why KEEP OPEN

- Environment readiness Issue is broader than App Catalog discovery + one Deploy.
- Entra groups / A-B separation tests remain unchecked.

---

## Issue #22 — SharePoint adapter

### Recommendation

**KEEP OPEN** + record AssessmentSnapshots SPHttpClient path progress.

### Stale markers

```text
#22A Implementation: HOLD
#22B Implementation: HOLD
SharePoint integration: 未実施
Tests executed: 0
Merge: NO-GO
```

### Confirmed from main SoT（AssessmentSnapshots slice）

```text
SPHttpClient binder under spfx/: DELIVERED
synthetic binder Jest: PASS（6）
live read: PASS / VERIFIED
live write: PASS / VERIFIED（synthetic）
Deploy: PASS / VERIFIED
IR-P2-002: CLOSED / VERIFIED（synthetic/local）
```

### Still OPEN / incomplete（Issue purpose）

```text
Full fail-closed adapter for ABC / Observation / LinkFailure / etc.
#22 completion criteria checkboxes（broad）
E2E / manual acceptance for all failure modes
treating Deploy PASS as #22 Close = FORBIDDEN
```

### Why KEEP OPEN

- Issue #22 owns broad SharePoint fail-closed adapter completion, not only
  AssessmentSnapshots binder + Deploy.
- Comments also show AuditEvent #22B path with separate gates; that does not
  Close the whole Issue.

---

## Issue #28 — SPFx shell

### Recommendation

**KEEP OPEN** + record scaffold / package / Deploy + SHELL-UX-1 presentation progress.

### Stale markers

```text
SPFx generation: HOLD
Implementation: HOLD
Tests executed: 0
Merge: NO-GO
```

### Confirmed from main SoT

```text
SPFx 1.23.2 exact isolated scaffold: DELIVERED（spfx/）
Node 22 / React 17.0.1 / @microsoft/sp-* 1.23.2: LOCKED + materialised
Heft build: PASS
Jest: PASS（binder + SHELL-UX-1 presentation tests on main）
package-solution: PASS
Tenant App Catalog Deploy: PASS / VERIFIED
SHELL-UX-1 presentation chrome: MERGED on main（PR #235 → 30a1656）
  demo banner / 保存5状態 / loading / access-denied / retrieval-failed
  current-site label（display-only）/ PC・tablet / keyboard chrome
  OUT held: REST / mapping / tenant / live R/W / binder host wiring = false
```

### Still OPEN / incomplete（Issue purpose）

```text
Issue #28 completion criteria beyond SHELL-UX-1 slice
業務固有ロジックを含まない shell 完了の残り（Issue checkbox / acceptance）
browser smoke（IR P2 on #235）= PASS / VERIFIED
  evidence: shell-ux-1-browser-smoke-p2-closeout.md
Approval dependencies（#19 / #21）and broader shell acceptance tests
next shell UX slice = SHELL-UX-2 DELIVERED on tip `61a212a…`（PR #238）
  evidence: shell-ux-2-implementation-start.md / shell-ux-2-browser-smoke.md
Close criteria assessment = FAIL / KEEP OPEN
  evidence: issue-28-close-criteria-assessment.md
  Decision-ISSUE-28-CLOSE-CRITERIA-ASSESSMENT-1 = SELECTED / LOCKED
#28 Close = NOT AUTHORIZED
next residual slice = NOT SELECTED（Human Selection required）
```

### Why KEEP OPEN

- Scaffold + binder + Deploy + SHELL-UX-1 presentation ≠ Issue #28 Close.
- Approval dependencies (#19 / #21) and remaining acceptance remain.

---

## Execution checklist

| Step | Action | Status |
|---|---|---|
| 1 | Freeze SoT tip `1c24f3e…` and Deploy evidence | **DONE** |
| 1b | Baseline refresh tip → `30a1656…`（PR #235 on main） | **DONE**（docs tip sync；KEEP OPEN unchanged） |
| 2 | Recommend KEEP OPEN for all 5 | **DONE** |
| 3 | Patch #6 Current status / Gate | **DONE**（Issue body） |
| 4 | Patch #8 Current status / Deploy path | **DONE**（Issue body） |
| 5 | Patch #4 Current status（App Catalog / Deploy） | **DONE**（Issue body） |
| 6 | Patch #22 Current status（binder / live / Deploy） | **DONE**（Issue body） |
| 7 | Patch #28 Current status（scaffold / Deploy / SHELL-UX-1） | **DONE**（Issue body + tip sync） |
| 8 | Leave all 5 OPEN | **required** |
| 9 | Do not Close #219 / #19 / #20 / #21 / #23 / #24 / #27 / #68–#71 | **untouched** |

## Success criteria

```text
#6 / #8 / #4 / #22 / #28 remain OPEN
Current status blocks no longer claim Deploy:0 / SPFx HOLD / App Catalog未確認
as current truth
Repository Accepted / LOCKED docs remain primary SoT
No unrelated Issue Closed
No SharePoint / M365 / Entra mutation performed by this packet
```
