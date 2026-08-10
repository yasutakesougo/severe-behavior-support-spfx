# AssessmentSnapshot adapter — Next Slice Selection（post GO-SLICE-1）

この文書は、GO-SLICE-1 COMPLETE 後の
**次 substantive slice Selection 候補比較と Agent recommendation** である。

```text
repository: yasutakesougo/severe-behavior-support-spfx
Selection ID: Decision-AS-ADAPTER-NEXT-SLICE-1
Kind: Next-slice selection（docs-only）
Status: AWAITING HUMAN NEXT-SLICE SELECTION
Baseline main: cf8bb8bf7e8a1974428e0fdef4e5cf86350e25b6

Closeout:
  decision-assessment-snapshot-go-slice-1-closeout.md
IR:
  decision-assessment-snapshot-go-slice-1-closeout-independent-review.md

Authority（再 Decision しない）:
  Decision-AS-ADAPTER-IMPLEMENTATION-START-1 = ACCEPTED / LOCKED / GO-SLICE-1 CONSUMED
  Decision-AS-ADAPTER-EC3-EC4-1 = ACCEPTED / LOCKED
    / TC-1-A + DP-1-A + CO-1-A + SV-1-A + XB-1
  Decision-AS-MAP010-COLUMN-1 = ACCEPTED / LOCKED / R-1-A + W-1-A + O-1-A
  Decision-AS-CONVERSION-1 = ACCEPTED / LOCKED

Deploy / real data: NO-GO
runtime dependency install: NOT AUTHORIZED
live SharePoint / M365 / Entra I/O: FORBIDDEN
MAP-AS-009: EXPLICITLY OUT
Implementation Start（next code）: NOT AUTHORIZED until separate Human Decision
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

## 1. Purpose

GO-SLICE-1 実装完了後に、次の substantive unit を **1 つ**選ぶ。
本文書は実装開始を許可しない。

## 2. Candidate comparison

### Candidate A — IR-P2-001 semantics closure

Question: corrupt existing physical `supersedesSnapshotId`（empty / whitespace-only / non-string）+ update mode **omit** の扱い。

| Option | Behavior | Relation to Accepted contracts | Code change? | New Human Decision? |
|---|---|---|---|---|
| **A1** | Preserve existing physical value exactly；later read remains fail-closed（`MALFORMED_PHYSICAL`）. No repair. | **DERIVED** from CO-1-A「Update + omit → leave existing persisted value unchanged」+ R-1-A read fail-closed for `""` / whitespace | **NONE**（living GO-SLICE-1 behavior） | Disposition recording / Human Acceptance of derived close；**no new semantic Decision** if A1 selected as DERIVED |
| **A2** | Require pre-update physical validation/read；**fail before mutation** when existing physical supersedes is malformed | **NOT YET Accepted**. Compatible with RW-1 / MF-1 fail-closed spirit；**does not** authorize repair/trim/coerce/silent clear | Small synthetic adapter change **only after** Acceptance | **YES** — new Decision required before Implementation Start |
| **A3** | Other narrowly defined fail-closed behavior supported by existing Accepted contracts | Only behaviors already implied by CO-1-A / R-1-A / W-1-A / MF-1. **FORBIDDEN examples**: omit→clear, trim-to-accept, default id, coerce whitespace→absent | Depends | Only if truly DERIVED；else YES |

```text
FORBIDDEN under Candidate A（any option）:
  repair
  trim-to-accept
  coercion to valid id
  default synthetic value
  silent clear via omit
  inventing MAP-AS-009
```

### Candidate B — IR-P2-002 transport binding gate

Define prerequisites for concrete SPFx `SPHttpClient` binding.

| Axis | Required posture |
|---|---|
| Runtime `@microsoft/sp-*` install | **NOT AUTHORIZED** unless separate Human GO |
| Live tenant I/O | **NOT AUTHORIZED** |
| SharePoint / M365 / Entra mutation | **FORBIDDEN** |
| Deploy / real data | separate GO / NO-GO until then |
| Binding Implementation Start | **NOT AUTHORIZED** by gate docs alone |
| Synthetic/local doubles | remain required until live GO |

```text
Candidate B product（if selected）:
  docs-only binding-gate Decision packet
  prerequisites checklist
  still FORBIDDEN: install / bind-live / Deploy

Candidate B does NOT unlock GO-SLICE-1 residual code authority by itself.
```

### Candidate C — HOLD / different next slice

| Option | Meaning |
|---|---|
| **C-HOLD** | Select neither A nor B；wait for Human direction |
| **C-OTHER** | Different narrow slice from canonical state |

```text
C-OTHER candidates examined and NOT recommended now:
  MAP-AS-009 persistence — EXPLICITLY OUT
  SupportPlan / other adapters — OUT of AssessmentSnapshot GO chain
  Deploy / real data — NO-GO
  SPFx scaffold / App Catalog — FORBIDDEN without separate GO
  live tenant write — FORBIDDEN
  application UI wiring — OUT of adapter port scope
```

No other authorized implementation slice exists under current Accepted Decisions.

## 3. Agent recommendation

```text
Recommended next substantive unit:
  Candidate A — IR-P2-001 semantics closure（docs-first）

Recommended option inside A:
  A1 — DERIVED preserve-on-omit；later read fail-closed；no repair

Rationale:
  1. Matches Accepted CO-1-A omit semantics exactly.
  2. Living GO-SLICE-1 code already implements A1；no code authority needed.
  3. Closes IR-P2-001 as recorded residual without inventing repair.
  4. A2 is legitimate but requires a NEW Decision before any mutation-path change.
  5. Candidate B is valuable later but cannot authorize install/bind/live I/O now；
     Implementation Start would remain HOLD after B docs Acceptance.
  6. No alternate C-OTHER slice is currently authorized.
```

```text
Agent recommendation ≠ Human Selection / Acceptance.
Human NEXT-SLICE SELECTION / DECISION is required.
```

## 4. Exact IN / OUT if Human selects recommended A1

### IN（docs-only Acceptance / recording）

```text
IN:
  record IR-P2-001 disposition = A1 DERIVED from CO-1-A + R-1-A
  mark IR-P2-001 = CLOSED as ACCEPTED residual / NON-BLOCKING
  keep fail-closed read for corrupt physical supersedes
  keep update omit ≠ clear
```

### OUT

```text
OUT / FORBIDDEN:
  adapter code mutation for A1（already present）
  A2 pre-update fail semantics（unless separately Accepted）
  repair / trim / coerce / default / silent clear
  SPHttpClient bind
  runtime dependency install
  live tenant I/O
  Deploy / real data
  MAP-AS-009
  SupportPlan / other adapters
  Issue bulk mutation
```

## 5. Exact IN / OUT if Human selects A2 instead

### IN（after separate Decision Acceptance）

```text
IN（Decision docs first）:
  Decision packet / selection / Acceptance for A2
  then Implementation Start GO for a narrow synthetic change:
    pre-update physical supersedes validation
    malformed prior → fail-closed before transport/mutation
    FR-1 distinguishable failure（no success）

OUT:
  repair / trim / coerce / silent clear
  live I/O / dep install / Deploy
  MAP-AS-009 / other adapters
```

## 6. Exact IN / OUT if Human selects Candidate B

### IN

```text
IN:
  docs-only SPHttpClient binding-gate Decision
  prerequisites: SPFx host presence, Human GO for runtime dep install,
                 still-separate Human GO for any live tenant write,
                 Deploy/real data remains separate GO
```

### OUT

```text
OUT / FORBIDDEN until later separate GOs:
  npm install @microsoft/sp-*
  concrete live SPHttpClient calls
  SharePoint / M365 / Entra mutation
  Deploy / real data
  treating B Acceptance as Implementation Start for live binding
```

## 7. Decision / Implementation Start answers

| Question | Answer |
|---|---|
| New Human Decision required? | **YES** — Human NEXT-SLICE SELECTION among A / B / C（and A1/A2/A3 if A） |
| New semantic Decision required for recommended A1? | **NO** — A1 is DERIVED；needs Human Acceptance of disposition recording only |
| New semantic Decision required for A2? | **YES** before any code |
| Implementation Start currently authorized for next code? | **NO** |
| GO-SLICE-1 code authority remaining? | **NONE**（CONSUMED） |
| Deploy / real data authorized? | **NO** |

## 8. Stop condition

```text
Stop at:
  HUMAN NEXT-SLICE SELECTION / DECISION

MUST NOT from this selection recording alone:
  implement A2
  bind SPHttpClient
  install runtime dependencies
  call SharePoint
  mutate M365 / Entra
  Deploy / real data
  auto Ready / Merge
  start next implementation slice
```
