# SBS-MGMT-HOME-CORRECTION-1 — Independent Implementation Review Entry-1

```text
repository: yasutakesougo/severe-behavior-support-spfx
unit: SBS-MGMT-HOME-CORRECTION-1
kind: Fresh Independent Implementation Review ENTRY
status: READY FOR FRESH INDEPENDENT RUNTIME / NOT STARTED
date: 2026-09-12
PR: #604（Draft）
branch: cursor/sbs-mgmt-home-5-persona-sim-c53a
implementation tip to bind: PR #604 HEAD（re-pin live; product @ 77dc5ba70e2be1c3e03e2d6ab836df234a4ba23e）
This Project runtime: MUST NOT perform / self-PASS the Implementation Review
This packet: entry / basis pin only
!= Implementation Review PASS
!= Human Ready / Merge / Deploy
!= C1 PASS（C1 packet Outcome = HOLD）
```

## 1. Why this entry exists

Human Implementation Start GO was consumed. Groups 1–3 presentation work and
required local verification are on tip `PR#604-HEAD`. Authenticated 5-persona
Re-Sim（C1）is recorded as **HOLD**（Deploy equivalence + auth session missing）.
A Fresh Independent Implementation Review must now judge the completed packet
set（implementation + verification + C1 evidence）without implementer self-PASS.

## 2. Basis to review（pin these）

| Artifact | Path | Role |
|---|---|---|
| Implementation tip | PR #604 HEAD（re-pin live; product `77dc5ba70e2be1c3e03e2d6ab836df234a4ba23e`） | Product + verification + evidence docs | Product + verification closure |
| Implementation evidence | `docs/architecture/sbs-mgmt-home-correction-1-implementation-evidence.md` | S-* map / tests / CI notes |
| C1 packet | `docs/architecture/sbs-mgmt-home-5-persona-real-browser-simulation-3.md` | HOLD（not PASS） |
| Simulation 2 | `docs/architecture/sbs-mgmt-home-5-persona-real-browser-simulation-2.md` | Historical CORRECTION（do not rewrite） |
| LOCKED Definition Correction-1 | `docs/architecture/sbs-mgmt-home-correction-1-definition-correction-1.md` | C1–C6 meaning |
| LOCKED Correction Scope | `docs/architecture/sbs-mgmt-home-correction-1-scope-definition-1.md` | IN/OUT |
| Implementation Scope | `docs/architecture/sbs-mgmt-home-correction-1-implementation-scope-1.md` | Files IN / S-* |
| Scope Re-Review | PASS / REVIEW-CLEARED（prior Fresh Runtime） | Start eligibility only |

At review start, Fresh Runtime must re-pin tip SHA / blob SHAs from live PR #604
head（do not trust stale SHAs from this entry alone）.

## 3. Mandatory checks for Fresh Implementation Review

```text
1. Diff ⊆ Files IN / Correction Scope（no scope expansion）
2. S-CTA…S-DUE wording vs LOCKED Definition（no combined CTA;
   UNAVAILABLE ≠ 0/12; draft authority = draft.candidate.version;
   no standalone「新しい計画」; due copy clean）
3. Required verification complete or explicitly HOLDed with cause
4. C1 evidence present:
     PASS with P0=0 P1=0 + persona meaning
     OR explicit HOLD with blocked reason（this tip: HOLD）
   Synthetic smoke must not be treated as C1 PASS
5. Actual Staff Value Check = NOT CONSUMED
6. No Ready / Merge / Deploy authorization smuggled into docs or PR metadata
7. Implementer runtime contamination: treat self-authored PASS claims as invalid
```

## 4. Forbidden to the Fresh Runtime

```text
Do not treat this entry as PASS
Do not generate / consume Human Ready or Merge GO
Do not Deploy / LIVE WRITE / SharePoint mutate
Do not rewrite Simulation 2 CORRECTION history
Do not convert C1 HOLD into PASS without a new authenticated Re-Sim
Do not use implementer self-judgment as Independent PASS
```

## 5. Eligibility reminder

```text
Implementation Review PASS
  → Human may then decide Ready GO / HOLD
Implementation Review CORRECTION / FAIL
  → further fix or HOLD
C1 HOLD on this tip
  → Review may still run; must not invent C1 PASS
This entry alone
  → NOT Ready / Merge eligibility
```

## 6. Sequencing note（Next Gates-1 + Verification Deploy GO）

Preferred order before a strong Fresh Review:

```text
PR metadata（Human UI；≠ GO）
  → existing verification authority OR Human Verification Deploy GO
  → tip-equivalent deployed identity
  → Authenticated C1 Re-Sim（PASS or findings packet）
  → Fresh Independent Implementation Review
  → Human Ready GO（separate；not inferred）
```

Current C1 Outcome = HOLD（not yet run against tip-equivalent deploy）. Review may still inspect the HOLD packet, but must not invent C1 PASS. Strong review waits for authenticated C1 evidence after Verification Deploy path is explicit.

See:

- `docs/architecture/sbs-mgmt-home-correction-1-next-gates-1.md`
- `docs/architecture/sbs-mgmt-home-correction-1-verification-deploy-go-1.md`（Decision = NOT RECEIVED）

## 7. STOP（this Project）

```text
Entry prepared.
Fresh Independent Implementation Review = REQUIRED（Fresh Independent Runtime）
Human Ready / Merge / Production Deploy = NOT AUTHORIZED by this packet
This Project runtime does not self-PASS Review.
This Project runtime stops at Verification Deploy authority wait
  （PR metadata + existing authority or Verification Deploy GO = Human）
Verification Deploy GO ≠ Production Deploy GO
```