# SBS-MGMT-PLAN-ACTIVATION-C — Post-Merge Correction-1

## Authority

Human Post-Merge Correction Start GO was received for the PR #588 post-merge findings only.

Basis:

```text
repository = yasutakesougo/severe-behavior-support-spfx
main = e2aab2f0232db4dd9bb774c2b976ee8df5802d71
#583 = CLOSED / COMPLETED
PR #588 = MERGED
exact-main CI = GREEN
post-merge review = CORRECTION REQUIRED
```

This authority does not authorize Ready, Merge, Deploy, Production Binding, SharePoint/M365/Entra mutation, LIVE WRITE, or #554 Management Home implementation.

## Authorized findings

The correction is limited to these five post-merge findings.

1. Apply後のcurrent version表示をsession current (`liveCurrentVersion`)と整合する。
2. activated versionをversion historyの先頭/currentとして表示し、旧版順序を壊さない。
3. `RevisionIntentId`をcandidate/review bindingから再計算し、forged provenanceをfail-closedにする。
4. Staff Arrival Puppeteer resolutionで不存在candidateを返さず、次候補へ進む。
5. Staff Arrival / RBA evidenceを実際にbundleしたcheckout HEADへbindし、過去HEADを誤って名乗らない。

## Minimal correction

### Current-version presentation

`SupportPlan`はApply後の表示契約に`activationSession.currentPlan.currentVersion`を使用する。

対象は少なくとも次とする。

```text
root data-planning-pc-current-version
planning header version
planner process ① plan summary
version list current marker
```

activated version entryは既存履歴の末尾へappendせず、current versionとして先頭へ置く。

### Revision provenance

Apply前に次を再計算する。

```text
RevisionIntentId = mintRevisionIntentId(
  OrganizationId
  SiteId
  UserId
  planId
  reviewedPlanVersion
  sourceOutcomeId
)
```

Draftの`RevisionIntentId`と一致しなければ次とする。

```text
HOLD / REVISION_INTENT_MISMATCH
no transition
no receipt
```

`DraftSnapshotId`がforged `RevisionIntentId`を含めて再計算可能であっても、Revision provenance validationを代替しない。

### Staff Arrival runtime resolution

Puppeteer candidateの`require.resolve`失敗後は、不存在absolute pathをfile URLへ変換して返さない。

存在する候補だけを採用し、見つからなければfail closedとする。

### Exact product-head evidence

`serve-smoke.mjs`は現在checkoutの`git rev-parse HEAD`を読み、そのHEADからsmoke-entryとproduct importsをbundleする。

観測HEADを`product-head.txt`としてmachine-readableに公開する。

`SBS_MGMT_LOOP_B_EXPECTED_PRODUCT_HEAD`が指定された場合、observed HEADとの不一致は起動時にfail closedとする。

`verify-staff-arrival.mjs`はobserved HEADを取得し、形式とexpected HEADを検証する。

過去の`Product source remains #584 @ 5437e64`という固定表記はcurrent evidenceとして使用しない。

## Focused regression

Domain testに次を追加する。

```text
forged RevisionIntentId
+
forged draftを含むmatching DraftSnapshotId
↓
REVISION_INTENT_MISMATCH / HOLD
```

Staff Arrival verifierはApply後に次を確認する。

```text
root currentVersion = 4
header version = 4
planner process plan summary = 4
current version marker count = 1
version list first = 4 / current
history = version 3
```

## Scope boundary

OUT:

```text
#554 Management Home
new workflow
new persistence
new state machine
SharePoint / M365 / Entra mutation
Production Binding
Deploy
LIVE WRITE
unrelated UI changes
```

## Verification state

At this commit the correction implementation is present, but verification is not yet promoted to PASS.

```text
Focused Verification = PENDING
exact-head CI = PENDING
Rendered Browser Acceptance = PENDING
Ponytail / Minimality Implementation Review = PENDING
Exact HEAD Fixation = PENDING
Independent Implementation Re-Review = PENDING
Actual Staff Plan-Transition Re-Check = PENDING
Human Ready GO = NOT RECEIVED
Human Merge GO = NOT RECEIVED
Deploy / Production Binding / LIVE WRITE = NOT AUTHORIZED
```

PASS must be based on the exact correction HEAD and must not reuse the historical #584 exact-HEAD claim.
