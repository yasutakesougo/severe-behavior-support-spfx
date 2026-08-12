# #21-A — Authorization / SiteContext Pure Contract Boundary — Human Selection Packet

この文書は、Issue #21 の次独立スライスとして
**#21-A — Authorization / SiteContext Pure Contract Boundary** を固定する
docs-only Selection Packet である。

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-ISSUE-21A-AUTHORIZATION-SITECONTEXT-1
Kind: Human Selection（Issue #21 next independently implementable slice）
Status: SELECTED / LOCKED（GO boundary）
Human Decision: SELECT #21-A — Authorization / SiteContext Pure Contract Boundary
Date: 2026-08-12
PR: #292（Selection / Acceptance / Independence Review only）

Baseline:
  main tip = a21f5dc0acaa43f18ee6b4a10e1cd0f8ae6db3b4
  #28 spfx-shell presentation boundary = CLOSED / COMPLETE（PR #291 / SHELL-UX-7）
  contracts-v1 / Issue #7 = CLOSED（formal Role ×7 / evaluateAccess fail-closed）
  Issue #21 GitHub body = STALE（old tip 444c7ea… / blanket HOLD on #19+#4）
  #22 overall = OPEN / PARTIAL（AssessmentSnapshots binder only）
  #68〜#71 business UI = NOT STARTED

Candidate origin:
  Issue #21 Entry Criteria Reassessment（read-only）
  Human explicit: SELECT #21-A

Implementation Start: NOT AUTHORIZED（separate Human GO）
Issue #21 Close: NOT AUTHORIZED
#22 adapter continuation: NOT AUTHORIZED
#68〜#71 business UI: NOT AUTHORIZED
Agent auto-select: FORBIDDEN（this Selection is Human）
```

## 1. Why this slice now

```text
#28 presentation boundary は COMPLETE。
current-site / multi-site selector は display-only であり、
認可真理値（SiteContext / membership / role resolution）は #21 OUT のまま残る。

contracts-v1 / #7 は 7 formal Role と evaluateAccess fail-closed を既に固定済み。
#21 の最小独立スライスは、その再利用の上に
AuthorizationContext / SiteContext 純契約と合成 fixture / contract tests を置くこと。

#19 Batch B / #4 live tenant / #22B は本スライスに不要
（#19 自身が「完全合成 fixture の純 contracts」並行可と固定済み）。
```

## 2. Selected unit

```text
#21-A
Authorization / SiteContext Pure Contract Boundary
```

## 3. Locked reuse（再 Decision しない）

| Item | Status | Notes |
|---|---|---|
| Formal Role ×7 | LOCKED | SUPPORTER / PLANNER / SERVICE_MANAGER / SITE_ADMIN / ORG_ADMIN / SYSTEM_ADMIN / VIEWER |
| Deprecated SUPERVISOR / REVIEWER / ADMIN | NOT USED | fail-closed |
| UserId ≠ SiteId | LOCKED | DEC-002 Accepted；ExecutionRecord |
| OrganizationId / SiteId mismatch deny | LOCKED | evaluateAccess |
| requiredRoles empty → DENY | LOCKED | NO_REQUIRED_ROLE |
| unknown role → DENY | LOCKED | UNKNOWN_ROLE |
| auth EMPTY / UNKNOWN / FETCH_FAILED → DENY | LOCKED | evaluateAccess |
| SiteId tokens SITE-ISG / SITE-HOM | LOCKED for fixtures | shell display vocabulary と一致 |
| #28 current-site / multi-site presentation | COMPLETE | display-only；≠ auth truth |
| GOV-STAFF-01〜05 | Accepted / LOCKED | transfer / Entra removal / access-stop decisions；runtime OUT of #21-A |

## 4. Authorized IN（Selection scope）

```text
IN:
  formal Role type reuse
  AuthorizationContext / SiteContext contracts
  fail-closed resolver result types
  unknown / missing role rejection
  empty requiredRoles rejection
  RoleProvider / auth lookup failure rejection（contract-level）
  UserId / SiteId / OrganizationId separation reuse
  multi-site membership → selection-required deny（authorization truth）
  synthetic fixtures（contract-level；FX-AUTH* shape as pure data）
  contract / unit tests（Issue #21 必須 contract tests のうち pure 範囲）
```

## 5. Explicit OUT / FORBIDDEN

```text
OUT:
  Microsoft Graph / Entra API calls
  Entra group creation
  real group membership resolution
  SharePoint permission probing
  #22 adapter / repository
  live SharePoint / tenant I/O
  binder host wiring
  transfer / retirement runtime modeling
  Entra group removal automation
  business UI / #68〜#71
  Deploy / production
  SharePoint URL hard-coding
    （/sites/sbs-* および /sites/severe-support-* を本スライスで固定しない）
  Issue #21 Close
  Issue #21 GitHub body mutation（Human-only / 別工程）
  Implementation Start（this Selection alone）
  Ready / Merge auto-progress
```

## 6. Contract tests（Selection acceptance surface）

Issue #21 body の必須 contract tests のうち、本スライス IN:

```text
- 空の Subject を拒否する
- 未知ロールを拒否する
- requiredRoles が空の場合の契約を明示する
- RoleProvider 取得失敗を拒否する
- OrganizationId 不一致を拒否する
- SiteId 不一致を拒否する
- UserId と SiteId を別 ID として必須化する
- Deprecated 識別子を fixture・schema で拒否する
```

本スライス OUT（後続）:

```text
- 必須 integration tests（A/B live cross-site）
- 必須 E2E / manual（画面・Entra・SharePoint）
- FX-AUTH の live / Entra 解決
```

## 7. Independence Check（candidate recorded at Selection）

```text
#19 GOV-STAFF for pure contracts = NOT REQUIRED（decisions Accepted；runtime OUT）
#4 live Entra / SharePoint = NOT REQUIRED
#22B concrete repository = NOT REQUIRED
#28 display boundary = COMPLETE / NOT a blocker
AUTH-001〜009 prose in repo = UNKNOWN；slice SoT = Issue #21 contract-test list + contracts-v1
SharePoint URL naming conflict = OUT（SiteId tokens only）

Independence Verdict Candidate:
  Independent = YES — CANDIDATE
  Reason:
    pure contracts / synthetic fixtures only
    no live I/O
    no Entra / SharePoint mutation
    no #22 adapter
    no business UI
```

正式 Independence Review は Selection / Acceptance 正本化後に実施する。

## 8. Stop condition

```text
Decision-ISSUE-21A-AUTHORIZATION-SITECONTEXT-1
= SELECTED / LOCKED

HOLD:
  Implementation Start = separate Human GO

Still NOT AUTHORIZED:
  code Implementation Start
  Issue #21 Close
  #22 continuation
  #68〜#71 business UI
  live I/O / Entra / Graph / SharePoint permission probing
  Deploy / Microsoft 365 mutation
```

## Reference

- Acceptance: `decision-issue-21a-authorization-sitecontext-acceptance.md`
- Independence Review: `decision-issue-21a-authorization-sitecontext-independent-review.md`
- Prior: `docs/architecture/contracts-v1.md`
- Prior: Issue #7 CLOSED（formal roles / evaluateAccess）
- Prior: Issue #28 CLOSED（presentation；auth truth OUT）
- Issue #21 remains OPEN; Close = NOT AUTHORIZED
- Next gate after Selection docs: Independence Review → separate Implementation Start Decision
