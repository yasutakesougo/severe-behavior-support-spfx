# SP-LC-3-REVIEW-DUE-SEMANTIC-EVIDENCE-1 — Fresh Review

```text
repository: yasutakesougo/severe-behavior-support-spfx
Kind: Fresh Review（implementation PR）
Unit: SP-LC-3-REVIEW-DUE-SEMANTIC-EVIDENCE-1
PR: #456（Draft）
Implementation verified HEAD: 272e76bde2c08d8f960f5283953c8ef216d9aeab
Review authority:
  #419 / Decision-SUPPORT-PLAN-LIFECYCLE-SEMANTICS-1 / D5=B
  #442 / SP-LC-3 Review / deadline domain rules
  review-anchor-contract.md
  review-notice-contract.md
Slice selection:
  residual-next-exact-slice-selection-1.md
Status: PASS
Findings code: P0 = 0 / P1 = 0 / P2 = 0
Findings tooling: P2 = 2 OPEN（standalone eslint / tsc mismatch only）
Human Fresh Review: 2026-08-19（Agent 実施）
Ready eligibility: HOLD（Human-only；this review does not authorize Ready）
Merge / Issue close / Deploy / LIVE WRITE: NOT AUTHORIZED
```

## Authority

```text
Fresh Review PASS ≠ Human Ready GO
Fresh Review PASS ≠ Merge GO
Fresh Review PASS ≠ Issue close
Fresh Review PASS ≠ Deploy
Fresh Review PASS ≠ LIVE WRITE

This review verifies evidence strength only.
It does not change D5 semantics or open any new production gate.
```

## Review scope

Changed files exactly:

- `spfx/src/shell/review/review-due-fixture.ts`
- `spfx/src/shell/review/review-due.test.ts`
- `spfx/src/shell/review/index.ts`
- `spfx/src/shell/ux/index.ts`
- `spfx/smoke/demo-ux-6/smoke-entry.tsx`
- `spfx/smoke/demo-ux-6/run-smoke.mjs`
- `docs/architecture/demo-ux-6-browser-smoke.md`

Confirmed out of scope / unchanged:

- no production semantics change
- no schema / DTO change
- no review mutation
- no auth judgment
- no LIVE WRITE
- no unrelated `#443` / `#444` / `#448` work

## Review matrix

| # | Check | Result |
|---|---|---|
| A1 | `#419 D5=B` を変更していない | **PASS** |
| A2 | `review-anchor-contract` の意味を変更していない | **PASS** |
| A3 | `review-notice-contract` の意味を変更していない | **PASS** |
| B1 | first anchor を positive assertion で証明 | **PASS** |
| B2 | subsequent anchor を positive assertion で証明 | **PASS** |
| B3 | caller-supplied `reviewDueDate` を証明 | **PASS** |
| B4 | calendar-month notice を positive assertion で証明 | **PASS** |
| B5 | 「30日前」の否定文 token の単純 substring 一致に依存していない | **PASS** |
| C1 | first / subsequent 両 branch が実際に render される | **PASS** |
| C2 | origin / due / approaching を別 selector で確認 | **PASS** |
| C3 | 7 / 7 PASS evidence と runner が一致 | **PASS** |
| D1 | changed-file scope が exact 7 files に閉じている | **PASS** |
| D2 | no production semantics / schema / mutation / unrelated issue work | **PASS** |
| E1 | `Heft 291 / 291 PASS` | **PASS** |
| E2 | `demo-ux-6 7 / 7 PASS` | **PASS** |
| E3 | standalone `eslint` failure = tooling/config mismatch only | **PASS** |
| E4 | standalone `tsc` failure = SCSS module resolution mismatch only | **PASS** |
| E5 | hidden NEW FAILURE なし | **PASS** |

## Evidence inspected

```text
HEAD: 272e76bde2c08d8f960f5283953c8ef216d9aeab

Core code:
  spfx/src/shell/review/review-due-fixture.ts
  spfx/src/shell/review/review-due.test.ts
  spfx/smoke/demo-ux-6/smoke-entry.tsx
  spfx/smoke/demo-ux-6/run-smoke.mjs
  docs/architecture/demo-ux-6-browser-smoke.md

Focused verification:
  ./node_modules/.bin/heft test --clean
    -> 291 PASS / 0 FAIL
  DEMO_UX_6_PUPPETEER_PATH=/tmp/node_modules/puppeteer-core/lib/esm/puppeteer/puppeteer-core.js
     node spfx/smoke/demo-ux-6/run-smoke.mjs
    -> 7 / 7 PASS

Auxiliary checks:
  npx prettier --check (changed files) -> PASS
  standalone eslint -> config/rule resolution mismatch before file-level judgment
  standalone tsc --noEmit -> SCSS module resolution mismatch outside normal Heft pipeline
```

## Findings

| Sev | ID | Status | Note |
|---|---|---|---|
| P2 | RDSE-P2-1 | OPEN | standalone `eslint` CLI is not a trustworthy local signal here because the SPFx flat-config chain fails on `no-unassigned-vars` rule resolution before file analysis. Heft lint/build passed with only an unrelated warning. |
| P2 | RDSE-P2-2 | OPEN | standalone `tsc --noEmit -p spfx/tsconfig.json` is not a trustworthy local signal here because SCSS module declarations are resolved through the normal Heft pipeline. Heft compile/test passed and was used as the authoritative signal. |

```text
P0 = 0
P1 = 0
P2 OPEN = 2（tooling only）
Fresh Review: PASS
```

## Strict progression

```text
1. SP-LC-3-REVIEW-DUE-SEMANTIC-EVIDENCE-1 Fresh Review = PASS
2. Ready eligibility = HOLD / Human-only
3. Merge = NOT AUTHORIZED
4. Issue close = NOT AUTHORIZED
5. Deploy / LIVE WRITE = NOT AUTHORIZED
CURRENT ACTION: STOP
```

## Non-claims

```text
This review does not authorize Ready
This review does not authorize Merge
This review does not authorize Issue close
This review does not authorize Deploy
This review does not authorize LIVE WRITE
This review does not start any #443 / #444 / #448 work
```
