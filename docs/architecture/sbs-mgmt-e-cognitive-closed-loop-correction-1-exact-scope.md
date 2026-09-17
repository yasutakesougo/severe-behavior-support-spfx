# SBS-MGMT-E — Cognitive Closed-Loop Correction-1 Exact Scope

```text
repository: yasutakesougo/severe-behavior-support-spfx
unit: SBS-MGMT-E-COGNITIVE-CLOSED-LOOP-CORRECTION-1
kind: Exact Implementation Scope (docs lock; no product mutation yet)
parent Definition: docs/architecture/sbs-mgmt-e-cognitive-closed-loop-correction-1-definition.md
basis main: ac6b3d665b0e514852775b5b58f5f9e254d107ae
Human Implementation Start GO: RECEIVED / CONSUMED
  record: docs/architecture/sbs-mgmt-e-cognitive-closed-loop-correction-1-human-implementation-start-go.md
Product mutation: AUTHORIZED (CORR-1A / CORR-1B / CORR-1C presentation only)
Ready / Merge / Deploy / LIVE WRITE: NOT AUTHORIZED
```

## 1. Live strings at basis（as-is）

### CORR-1A — Review next-step

| Item | Current |
|---|---|
| File | `spfx/src/shell/monitoring/ReviewOutcomeCaptureView.tsx` |
| Label | `次にすること` |
| CHANGE_REQUIRED cue | `支援内容を見直す` (`data-next-support-cue`) |
| Helper | `この場で決められなければ、追加で検討します。` |
| data-* | `data-next-support-summary` / `data-next-support-step` / `data-next-support-cue` |
| Centralized? | No（`review-outcome-capture-copy.ts` does not own these） |

### CORR-1B — Draft start + Draft≠Applied framing

| Item | Current |
|---|---|
| File | `spfx/src/shell/users/SupportPlan.tsx` |
| Draft-start CTA | `支援内容の見直しを始める（版 {N+1} の下書き）` (`data-sbs-mgmt-loop-b-action="start-revision"`) |
| Source-safety | `現在使用中の版 {N} は変更しません。版 {N+1} の下書きを別に作ります。` |
| Draft lifecycle lines | `適用中: 版 {N}` / `下書き: 版 {N+1}` via `support-plan-copy.ts` |
| Apply CTA | `版 {N+1} を適用開始する` (`data-sbs-mgmt-plan-activation-c-action="apply"`) — **label OUT of rewrite** |
| Gap | Draft block has no explicit first-scan sentence that Apply is required to start using N+1; speech-act “見直しを始める” vs “適用開始する” still requires staff to invent T3 |

### CORR-1C — Home next-action

| Item | Current |
|---|---|
| Files | `spfx/src/shell/users/management-home-read-model.ts`, `ManagementHome.tsx` |
| Heading | `次に必要な人の行動` |
| Draft pending template | `次に必要な人の行動: 次版 v{N+1} の内容と適用可否を確認してください` |
| Post-apply template | `次に必要な人の行動: 新しい版が現在適用中` |
| Gap | 「適用可否」does not name explicit Human Apply / `版 N+1 を適用開始する` |

## 2. Locked target copy candidates（reviewable; not applied）

Japanese targets locked for Independent Definition/Scope Review. Implementation may adjust punctuation only if review requires; speech-act family must remain.

### CORR-1A targets

```text
次にすること
= KEEP

CHANGE_REQUIRED cue
= 支援内容の見直しを始める（次版の下書き）
  （must share stem with Loop-B start-revision CTA family）

Helper
= 次は計画画面で、版 N+1 の下書き作成を始めます。適用はまだしません。
  （Draft create ≠ Apply; no domain change）
```

NO_CHANGE cue `次回のモニタリングへ` = OUT（unchanged）.

### CORR-1B targets

```text
Draft-start CTA label
= KEEP
  支援内容の見直しを始める（版 {N+1} の下書き）

Apply CTA label
= KEEP
  版 {N+1} を適用開始する

ADD adjacent first-scan line on draft block (new or replace weak lifecycle helper)
= 版 {N+1} は下書きです。使い始めるには「版 {N+1} を適用開始する」が必要です。
  （Draft ≠ Applied; T3 binds to Apply CTA）

既存
  適用中: 版 {N}
  下書き: 版 {N+1}
= KEEP（SIMPLIFICATION-1 labels）
```

### CORR-1C targets

```text
When draft.candidate.version === currentVersion + 1:
= 次に必要な人の行動: 次版 v{N+1} を適用開始する前に内容を確認してください
  （names Apply speech-act; still Human decision; no auto-Apply）

When draft.candidate.version === currentVersion (applied):
= 次に必要な人の行動: 新しい版 v{currentVersion} が現在適用中
  （optional minor clarify; keep fail-closed authority = SupportPlan.currentVersion）

Unavailable / mismatch templates
= OUT（keep existing fail-closed wording）
```

## 3. File-level IN / OUT

### IN（Implementation Start GO 後のみ）

```text
spfx/src/shell/monitoring/ReviewOutcomeCaptureView.tsx
spfx/src/shell/monitoring/review-outcome-capture-copy.ts   (optional centralize CORR-1A)
spfx/src/shell/monitoring/ReviewOutcomeCaptureView*.test.tsx
spfx/src/shell/monitoring/HumanReviewView.test.tsx         (string asserts only if needed)

spfx/src/shell/users/SupportPlan.tsx                       (CORR-1B framing only)
spfx/src/shell/users/support-plan-copy.ts                  (optional CORR-1B helper string)
spfx/src/shell/users/support-plan.test.ts                  (string asserts only)

spfx/src/shell/users/management-home-read-model.ts         (CORR-1C templates)
spfx/src/shell/users/ManagementHome.tsx                    (heading unchanged unless required)
spfx/src/shell/users/management-home-read-model.test.ts
spfx/src/shell/users/ManagementHome.test.tsx

spfx/smoke/sbs-mgmt-loop-a-review-completion/run-smoke.mjs (string asserts)
spfx/smoke/sbs-mgmt-loop-b/run-smoke.mjs                   (string asserts)
spfx/smoke/support-plan-management-list-demo-1/run-smoke.mjs (string asserts if any)
docs/architecture/* cognitive / evidence follow-ups for this unit
```

### OUT

```text
src/domain/**
tests/domain/support-plan-revision.test.ts     (as mutation target; must remain green unchanged)
tests/domain/support-plan-activation.test.ts   (as mutation target; must remain green unchanged)
activation handler logic / CAS / ALREADY_APPLIED rules
SharePoint adapters / LIVE WRITE gates
FIELD_STAFF Task-First IA / AppShellChrome / ScaffoldShell
cold create-cta redesign / CTA-ROLE visibility rewrite beyond assert updates
Deploy / App Catalog / M365 / Entra
```

## 4. Regression commands（post-GO steps 5–6）

Semantic unchanged check:

```bash
npx tsx --test \
  tests/domain/support-plan-revision.test.ts \
  tests/domain/support-plan-activation.test.ts
```

Presentation / read-model:

```bash
cd spfx && npm run prepare:b2-build-basis \
  && ./node_modules/.bin/heft test --clean \
       --test-path-pattern "management-home-read-model|ManagementHome|ReviewOutcomeCaptureView|support-plan\\.test"
```

RBA 1280×900 + 390×844:

```bash
node spfx/smoke/sbs-mgmt-loop-a-review-completion/run-smoke.mjs
node spfx/smoke/sbs-mgmt-loop-b/run-smoke.mjs
node spfx/smoke/support-plan-management-list-demo-1/run-smoke.mjs
```

Expect: domain expectations **byte-stable**; UI/smoke asserts updated only for locked target copy.

## 5. Gate

```text
Exact Scope = AUTHORIZED for CORR-1A / CORR-1B / CORR-1C after Human Implementation Start GO
Implementation = IN PROGRESS / presentation only
Domain semantics change = FORBIDDEN
Ready / Merge / Deploy / LIVE WRITE = NOT AUTHORIZED
Post-impl STOP = Fresh Independent Implementation Review
```
