# SBS-ROLE-TASK-FIRST-IA-V1 — CORR-1G Complete Controlled Packet

```text
repository: yasutakesougo/severe-behavior-support-spfx
workstream: SBS-ROLE-TASK-FIRST-IA-V1
unit: CORR-1G
record type: CORR-1G Complete Controlled Packet
kind: Definition packet (single body)
status: COMPLETE / CORRECTION-2 APPLIED / AWAITING FRESH INDEPENDENT DEFINITION RE-REVIEW-2
normative surface: THIS PACKET BODY ONLY
attachment / sidecar: EXCLUDED / NON-NORMATIVE
parent Definition: Correction-2 Complete Controlled Packet (LOCKED; not rewritten)
  path: docs/architecture/sbs-role-task-first-ia-v1-correction-2-complete-controlled-packet.md
  locked blob: 5eeb8140772ebfefe050cff93361a6d81c470f81
parent Lock:
  docs/architecture/sbs-role-task-first-ia-v1-correction-2-human-definition-lock.md
  blob: 794d227a1e69c709e679337be6478b32de81d74a
parent unit: CORR-1F COMPLETE / ARCHIVED PRESERVED
parent disposition:
  docs/architecture/sbs-role-task-first-ia-v1-human-parent-carry-forward-disposition-decision.md
kickoff:
  docs/architecture/sbs-role-task-first-ia-v1-corr-1g-human-definition-review-kickoff.md
Independent Definition Review-1: CORRECTION REQUIRED / CONSUMED
  record: docs/architecture/sbs-role-task-first-ia-v1-corr-1g-independent-definition-review-1.md
  reviewed packet HEAD: 6b070fd1ea844dfc1176cc9a1239f12e71e04701
Definition Correction-1: APPLIED / CONSUMED
  GO record: docs/architecture/sbs-role-task-first-ia-v1-corr-1g-human-definition-correction-1-go.md
Independent Definition Re-Review-1: CORRECTION REQUIRED / CONSUMED
  record: docs/architecture/sbs-role-task-first-ia-v1-corr-1g-independent-definition-re-review-1.md
  reviewed packet HEAD: 4a80746b8d837c8aceebee2e03ee3ac088166446
  reviewed packet blob: cc7a3f92729521417f4163968e7f37b46757c127
Definition Correction-2: APPLIED / CONSUMED
  GO record: docs/architecture/sbs-role-task-first-ia-v1-corr-1g-human-definition-correction-2-go.md
Independent Definition Re-Review-2: NOT YET / NOT CONSUMED
Human Definition Lock (CORR-1G): NOT GENERATED / NOT CONSUMED
Human Implementation Start / Ready / Merge / Deploy: NOT AUTHORIZED
Implementation Authority: NONE
Repository Mutation (product / schema / persistence / SPFx): NONE at this gate
SharePoint / M365 / Entra mutation: NOT AUTHORIZED
Notion production page update: NOT PERFORMED
```

This document is the complete Controlled Packet for **CORR-1G**, including Definition Correction-1 and Definition Correction-2.

Reviewers must use this body only. Attachments, transcripts, and Notion sidecars are non-normative.

The locked Correction-2 packet remains the workstream IA SSOT. This packet does **not** replace CORR-2A / CORR-2B tables. It adds the missing unique meaning for **Product-reachable sufficient-path Destinations** after CORR-1F froze Role session context.

Creating or reviewing this packet does not create Implementation Authority. Human Gates consumed for this unit so far: Kickoff GO, Definition Correction-1 GO, and Definition Correction-2 GO, each recorded separately.

---

## Packet identity

```text
Workstream = SBS-ROLE-TASK-FIRST-IA-V1
Unit = CORR-1G
Record Type = CORR-1G Complete Controlled Packet
Parent Definition = Correction-2 Complete Controlled Packet (LOCKED blob 5eeb8140…)
Parent Product unit = CORR-1F COMPLETE / ARCHIVED
Independent Definition Review-1 = CORRECTION REQUIRED / CONSUMED
Definition Correction-1 = APPLIED
Independent Definition Re-Review-1 = CORRECTION REQUIRED / CONSUMED
Definition Correction-2 = APPLIED
Independent Definition Re-Review-2 = NOT YET
CORR-1G Exact Slice = CORR-1G-A + CORR-1G-B + CORR-1G-C
Skeleton change = NOT REQUIRED / NOT PERFORMED
NEXT = Fresh Independent Definition Re-Review-2
```

Unchanged in meaning from locked Correction-2 unless a later section marks a CORR-1G addition:

- CORR-2A Global tuples (including insufficient-context fallbacks)
- CORR-2B D-HOME identity per Role
- C1 / C2 / C3 / C4 Destination inventory (IDs, Purpose, Completion, Next) except session-context acquisition uniqueness in §2–§4
- C5 first paint after usable session = D-TODAY for FIELD_STAFF
- C7 / C8
- C9 six numbered HTA scenarios (CORR-1G may **exercise** FS-HTA-1 remainder; it does not rewrite the scenarios)
- presentation Role ≠ authorization Role
- Browser Smoke ≠ Human Task PASS
- SHELL-UX-7 dual-run REJECTED as product target (CORR-1A)
- CORR-1F FIELD_STAFF-only Global labels/order and fallback identities

---

## 0. Why CORR-1G exists

Independent Implementation Review-2 on CORR-1F recorded parent-locked **P2-1**:

```text
ScaffoldShell freezes sessionContext at
  { hasSupportObject: false, hasOccurrenceContext: false }

Sufficient-path Destinations
  D-PROCEDURE / D-RECORD-WRITE
are unit-proven only and unreachable from Product UI.
```

Locked Correction-2 already defines the sufficient-path tuples:

```text
手順     + object exists      → D-PROCEDURE
記録する + occurrence exists  → D-RECORD-WRITE
```

It also defines where the object / occurrence is supposed to come from (D-TODAY selection, D-PERSON, in-progress procedure, D-UNRECORDED). CORR-1F proved only the **insufficient-context** fallbacks in Product UI.

Independent Definition Review-1 (packet HEAD `6b070fd1`) found no P0 and three P1 leftovers in acquisition/release uniqueness. Definition Correction-1 closed those leftovers in §2–§4 and §8.

Independent Definition Re-Review-1 (packet HEAD `4a80746b`, blob `cc7a3f92`) found no P0 and three remaining P1 leftovers. Definition Correction-2 closes **only** those leftovers (P1-1 RELEASE; P1-2 OPTION A; P1-3 NOT ACTIONABLE / STAY D-PERSON). Implementers must not choose leftovers for:

```text
P1-risk  How Role session context becomes true in Product UI
P1-risk  Whether Primary Action / object choice auto-enters D-PROCEDURE
         vs only enabling Global 手順
P1-risk  Location identity of newly reachable Destinations
         (must not remain a generic non-place)
P1-risk  When true context becomes false again (release / persistence)
```

P2-2 (smoke `.gitignore`) and P2-3 (smoke `github.sha` binding) remain **SEPARATE** per parent disposition. They are not CORR-1G.

Workstream Open Questions (quiet 合成 badge; AA-T1 cadence; PLANNER cycle-③ Primary Action) remain Open. They are not CORR-1G.

---

## 1. Correction-1G Exact Slice

```text
IN
  CORR-1G-A  FIELD_STAFF current support object
             acquisition / release is unique
             → Product-reachable D-PROCEDURE

  CORR-1G-B  FIELD_STAFF current occurrence / procedure context
             acquisition / release is unique
             → Product-reachable D-RECORD-WRITE

  CORR-1G-C  C6 location identity for the newly reachable Destinations
             is unique (手順 / 記録する / 今日の支援)
             and D-PERSON location identity is unique when that
             Destination is the post-acquisition place

OUT
  CORR-2A / CORR-2B table rewrite
  new Destinations (no Search Hub, no context-resolver place, no fixture-toggle place)
  PLANNER Global / Distinct D-HOME
  ADMIN_AUDIT Global / D-HOME alias D-OPS
  P2-2 SEPARATE HYGIENE
  P2-3 SEPARATE VERIFICATION HYGIENE
  C7 / C8 / C9 rewrite
  six HTA rewrite (exercise FS-HTA-1 remainder only)
  React / CSS / router / schema / LIVE WRITE as Definition
  Entra / Deploy
  new 制度責任者
  Human Lock / Start / Ready / Merge by this packet
  consuming a Gate to repeal SHELL-UX-7 in the Decision ledger
  CORR-1F reopen
```

---

## 2. CORR-1G-A — current support object (unique)

### 2.1 Meaning (normative)

`current support object` remains the Correction-2 meaning, with the parent sources uniquely bound for Product UI:

```text
person + support occurrence already in Role context
(D-TODAY selection, D-PERSON, or in-progress procedure)

The Global item 手順 does not mint that object.
```

Correction-1 unique binding of those parent sources (no leftover):

```text
D-TODAY selection
  = the acquisition episode in §2.2
    (a day’s object is chosen AND Primary Action 対象の支援を始める is taken)
  ≠ seeing, highlighting, or listing that object on D-TODAY

D-PERSON with a current day’s support occurrence
  = person opened into Role context
    AND that person has a current support occurrence for the day
  Destination after that event = D-PERSON only

D-PERSON without a current day’s support occurrence
  = person opened into Role context
    AND that person has no current support occurrence for the day
  = a §2.4 RELEASE (not sticky persistence)
  Destination after that event = D-PERSON only

D-UNRECORDED occurrence choice
  = one Product-visible episode in §2.2 + §3.2
    acquire or replace the corresponding support object
    AND acquire the selected occurrence context
  Destination after that event = D-RECORD-WRITE

in-progress procedure
  = user is on D-PROCEDURE after a successful §2.2 acquisition
    and the object has not been released per §2.4
```

CORR-1G adds: Product UI **must** be able to move this meaning from false → true and true → false during a usable FIELD_STAFF session. Frozen-false for the whole session is **REJECTED** as the CORR-1G Product target.

Once true, the meaning stays true until a §2.4 release. Unlisted events do not change it (H-6).

### 2.2 Acquisition events (exactly these; no leftover)

| Event | Resulting support-object meaning | Destination after the event |
|---|---|---|
| Usable session first paint (unchanged C5) | false | D-TODAY |
| On D-TODAY, a day’s object is chosen **and** Primary Action `対象の支援を始める` is taken | true | **D-PROCEDURE** (this **is** C4 D-TODAY Next; not a second procedure place) |
| On D-TODAY, object is visible or highlighted but Primary Action is not taken, **and** no sticky true object exists | false | D-TODAY. Global 手順 still fallback **D-TODAY** |
| On D-TODAY after a sticky true object (not released) | true | D-TODAY. Global 手順 → **D-PROCEDURE** |
| D-FIND-PERSON / D-PERSON: person opened into Role context **and** that person has a current support occurrence for the day | true | **D-PERSON only** (not D-TODAY, not auto D-PROCEDURE) |
| D-FIND-PERSON / D-PERSON: person opened but no current support occurrence for the day | false (RELEASE per §2.4; coupled occurrence also false) | **D-PERSON only**. Global 手順 fallback **D-TODAY**. Global 記録する fallback **D-UNRECORDED**. Do not open empty D-PROCEDURE |
| On D-UNRECORDED, an unrecorded occurrence is chosen | true (acquire, or replace if a different object was sticky) | **D-RECORD-WRITE** (same Product-visible episode as §3.2 occurrence acquire) |
| Replacement: a new row’s qualifying acquisition (D-TODAY Primary Action episode, D-PERSON open with that day’s occurrence, or D-UNRECORDED occurrence choice) for a **different** object | old false; new true | Destination of the new acquisition event |

Standing rules:

```text
1. Primary Action does not mint a blank object. No chosen day’s object → no D-PROCEDURE.
2. Auto-jump to D-PROCEDURE on first paint is REJECTED, even if a synthetic list contains objects.
3. A hidden developer / fixture toggle that is not a Product object choice or Primary Action
   is REJECTED as the acquisition event.
4. Global 手順 with object true → D-PROCEDURE (Correction-2). Same Destination identity
   as Primary Action Next. Not a second procedure place.
5. Global 手順 with object false → D-TODAY acquisition (CORR-1F preserved).
6. Empty D-PROCEDURE content is still not a Destination meaning (Correction-2 §2.1).
7. Opening D-PERSON does not consume C4 D-PERSON Next.
   Required unique Destination identity from D-PERSON when object true
   = D-PROCEDURE.
   Existing C4 Primary Action (object true) → D-PROCEDURE.
   Global 手順 (object true) → D-PROCEDURE.
   These are not required to be a unique control path.
   When object false on D-PERSON, the existing C4 Primary Action is
   NOT ACTIONABLE / STAY D-PERSON:
     it must not navigate
     it must not open empty D-PROCEDURE
     it must not acquire or mint a support object
     it must not silently fall back to D-TODAY
     Destination remains D-PERSON
     session-context meaning remains unchanged
8. Highlighting a different D-TODAY row without Primary Action does not acquire
   and does not release a sticky true object.
9. D-UNRECORDED occurrence choice is one episode with §3.2. It must not leave
   occurrence-true while object-false.
```

### 2.3 Rejected support-object resolutions

```text
REJECTED: sessionContext frozen false for the whole Product session
REJECTED: Global 手順 mints a support object
REJECTED: first paint lands on D-PROCEDURE because fixtures exist
REJECTED: new Destination whose only job is to flip a boolean
REJECTED: AppShellChrome overview/users id as the support-object meaning
REJECTED: LIVE SharePoint person write as the only way to set the flag
REJECTED: D-TODAY list visibility / highlight as D-TODAY selection
REJECTED: D-PERSON open auto-navigates to D-PROCEDURE
REJECTED: D-PERSON open returns to D-TODAY as part of the same event
REJECTED: D-PERSON open without current occurrence keeps a previously sticky object
REJECTED: D-PERSON C4 Primary Action navigates when object false
REJECTED: D-PERSON C4 Primary Action opens empty D-PROCEDURE
REJECTED: D-PERSON C4 Primary Action mints or acquires an object when object false
REJECTED: D-PERSON C4 Primary Action silently falls back to D-TODAY when object false
REJECTED: Global 今日 as an implied object release
REJECTED: Back as an implied object release unless the Back event is listed in §2.4
```

### 2.4 Release events (exactly these; no leftover)

Support-object meaning becomes false only on:

| Event | Resulting support-object meaning | Destination after the event |
|---|---|---|
| Explicit deselect / no remaining chosen object on D-TODAY | false | D-TODAY. Fallbacks restored |
| Back that drops person context from D-PERSON to D-FIND-PERSON (person no longer in Role context) | false | D-FIND-PERSON. Fallbacks restored |
| D-PERSON open of a person with **no** current support occurrence for the day | false (any previously sticky object released; coupled occurrence also released) | **D-PERSON**. Global 手順 fallback **D-TODAY**. Global 記録する fallback **D-UNRECORDED** |
| Replacement acquisition for a different object (§2.2 replacement / D-UNRECORDED choice rows) | old false (new true) | Destination of the new acquisition |

Not release (persistence stays true if already true):

```text
Global 今日 → D-TODAY (object sticky true unless a release row also occurs)
Back from D-PROCEDURE to D-TODAY or D-PERSON
Back from D-RECORD-WRITE that does not drop the object
Viewing the D-TODAY list while sticky true
```

Occurrence-context, if true, becomes false when object becomes false (§3.4 coupling).

---

## 3. CORR-1G-B — current occurrence / procedure context (unique)

### 3.1 Meaning (normative)

`current occurrence / procedure context` remains the Correction-2 meaning:

```text
the occurrence (and its current procedure, when relevant)
already identified from D-PROCEDURE completion or from an unrecorded item

The Global item 記録する does not mint a blank record.
```

CORR-1G adds: Product UI **must** be able to move this meaning from false → true and true → false during a usable FIELD_STAFF session.

Once true, the meaning stays true until a §3.4 release. Unlisted events do not change it (H-6).

Coupling (unique):

```text
occurrence-true requires object-true.
object-false forces occurrence-false.
object-true does not by itself make occurrence-true.
```

### 3.2 Acquisition events (exactly these; no leftover)

| Event | Resulting occurrence-context meaning | Destination after the event |
|---|---|---|
| Usable session first paint | false | D-TODAY |
| D-PROCEDURE Completion (`手順を現行として確認`) | true | **D-RECORD-WRITE** (C4 D-PROCEDURE Next) |
| On D-UNRECORDED, an unrecorded occurrence is chosen | true | **D-RECORD-WRITE** (C4 D-UNRECORDED Next). Same episode as §2.2 object acquire/replace |
| On D-UNRECORDED, list is viewed but no occurrence chosen, **and** no sticky true occurrence exists | false | D-UNRECORDED. Global 記録する still fallback **D-UNRECORDED** |
| On D-UNRECORDED after a sticky true occurrence (not released) | true | D-UNRECORDED. Global 記録する → **D-RECORD-WRITE** |
| Global 記録する with occurrence true | true (unchanged) | **D-RECORD-WRITE** |
| Global 記録する with occurrence false | false | **D-UNRECORDED** (CORR-1F preserved) |
| Replacement: D-PROCEDURE Completion or D-UNRECORDED choice for a **different** occurrence | old false; new true | **D-RECORD-WRITE** |

Standing rules:

```text
1. Empty D-RECORD-WRITE form is not a Destination meaning.
2. D-UNRECORDED empty list is still D-UNRECORDED (Correction-2). Do not bounce to D-TODAY.
3. PROCESS-VISIBILITY ③ / PLANNER D-FIND-RECORD is not this slice.
4. FIELD_STAFF write stays D-RECORD-WRITE. D-RECORD-READ remains read-only.
5. Completing D-PROCEDURE and choosing D-UNRECORDED are the same Destination identity
   D-RECORD-WRITE, not two write places.
6. D-PERSON open does not acquire occurrence-context, even when it acquires the support object.
7. D-UNRECORDED occurrence choice always acquires or replaces the corresponding
   support object in the same episode (§2.2 OPTION A). occurrence-true while
   object-false remains forbidden.
8. Global 未記録 remains reachable when no support object is currently selected.
```

### 3.3 Rejected occurrence resolutions

```text
REJECTED: Global 記録する mints a blank record
REJECTED: D-RECORD-WRITE opened empty because a fixture toggle flipped
REJECTED: new Search Hub / context-resolver Destination
REJECTED: D-FIND-RECORD as Global or as the write place
REJECTED: LIVE WRITE / SharePoint save as the acquisition event
REJECTED: Global 今日 as an implied occurrence release
REJECTED: Back as an implied occurrence release unless the Back event is listed in §3.4
REJECTED: D-UNRECORDED occurrence choice that sets occurrence-true without acquiring the corresponding support object
REJECTED: occurrence-true while object-false
```

### 3.4 Release events (exactly these; no leftover)

Occurrence-context meaning becomes false only on:

| Event | Resulting occurrence-context meaning | Destination after the event |
|---|---|---|
| Any §2.4 support-object release | false | Destination of that object-release event. Global 記録する fallback restored |
| Explicit deselect / no remaining chosen occurrence on D-UNRECORDED | false | D-UNRECORDED. Global 記録する fallback **D-UNRECORDED** |
| Replacement acquisition for a different occurrence (§3.2 last row) | old false (new true) | D-RECORD-WRITE |

Not release (persistence stays true if already true and object remains true):

```text
Global 今日 → D-TODAY
Back from D-RECORD-WRITE to D-PROCEDURE
Back from D-RECORD-WRITE to D-UNRECORDED while the same occurrence remains selected
Back from D-PROCEDURE to D-TODAY or D-PERSON
Viewing D-TODAY while occurrence sticky true
```

---

## 4. CORR-1G-C — location identity (C6; unique)

Meaning only; no router.

When the sufficient path is Product-reachable, location identity **must** change with Destination identity:

| Destination | Location identity (C6 今どこ) |
|---|---|
| D-TODAY (D-HOME alias) | 今日の支援 |
| D-PROCEDURE | 手順 |
| D-RECORD-WRITE | 記録する |
| D-UNRECORDED | 未記録 |
| D-FIND-PERSON | 探す |
| D-PERSON | この人の支援コンテキスト |

```text
D-HOME is still not a second Product place. Alias = D-TODAY only.
A generic non-place label for every non-today Destination is REJECTED
  (it impersonates one place while D-* identity differs).
Boolean session flags must not be named as a place.
Back names the previous Destination identity.
D-PERSON is not a newly invented Destination. C6 here only unique-ifies
  its location identity when CORR-1G-A lands there.
```

Orientation copy (今どこ / どこから / 何ができる / 次はどこ) remains required. CORR-1G does not invent a router.

---

## 5. Binding to locked CORR-2A FIELD_STAFF table (restated, not replaced)

| Global | Destination (context sufficient) | context不足時の意味 |
|---|---|---|
| 今日 | D-TODAY | N/A |
| 手順 | D-PROCEDURE (object exists via §2) | **D-TODAY** acquisition; do not open empty D-PROCEDURE |
| 記録する | D-RECORD-WRITE (occurrence exists via §3) | **D-UNRECORDED**; do not open empty D-RECORD-WRITE |
| 未記録 | D-UNRECORDED | N/A |
| 探す | D-FIND-PERSON | N/A |

Global order remains: `今日 · 手順 · 記録する · 未記録 · 探す`.

CORR-1G does not authorize PLANNER or ADMIN_AUDIT Global change.

---

## 6. Presentation / verification meaning (not implementation lock)

```text
presentationRole remains synthetic FIELD_STAFF. No authorization-role invention.
Object / occurrence choice may use existing synthetic / demo list surfaces
  (CORR-1F overview/users adapter transport remains allowed).
LIVE I/O is not required and not authorized.
Browser Smoke may prove that Destinations become reachable after Product-visible
  object / occurrence choice. Smoke PASS ≠ Human Task PASS.
FS-HTA-1 remainder (今日の対象と Primary Action; 手順確認 → 記録 until place is kept)
  is the Human Task Acceptance target after implementation. Not claimed by this packet.
FS-HTA-2 full state-meaning depth remains not over-claimed.
```

Exact Product file lists, AC numbering, and smoke scenario names belong in a later **Exact Scope** document. This packet must not over-fix React / CSS / hooks.

---

## 7. Explicit OUT (CORR-1G)

```text
PLANNER Global (今の工程 · 探す) and Distinct D-HOME
ADMIN_AUDIT Global (運用確認 · 証跡 · 探す) and D-HOME alias D-OPS
P2-2 smoke .gitignore hygiene
P2-3 smoke evidence merge-ref SHA hygiene
Retiring SHELL-UX-7 Global rows globally in AppShellChrome
New Destinations
Domain / schema / persistence / SharePoint mutation
LIVE WRITE / Deploy / Entra / App Catalog
SHELL-UX-7 Decision ledger supersede record
Notion production mutation
Workstream P2 Open Questions (quiet 合成 badge; AA-T1 cadence; PLANNER cycle-③)
Human Task Acceptance sign-off by this packet
Visual polish unrelated to sufficient-path reachability
unrelated refactor
CORR-1F archive rewrite
```

---

## 8. HOLD conditions (Definition)

| ID | Condition | Stop line |
|---|---|---|
| H-1 | Satisfying CORR-1G-A/B would require a new Destination | Stop; do not invent; re-packet |
| H-2 | Satisfying CORR-1G-A/B would require LIVE WRITE / SharePoint / Entra | Stop; outside authority |
| H-3 | Satisfying location identity would require AppShellChrome to become a second V1 Global | Stop; CORR-1G insufficient; dual-run still REJECTED |
| H-4 | Packet is used as Implementation Start | Stop; Kickoff ≠ Start; Correction-1 GO ≠ Start; Correction-2 GO ≠ Start |
| H-5 | Independent Review or Re-Review finds P0 / P1 | Human Definition Lock = NOT ELIGIBLE until Correction |
| H-6 | A Product-visible event is not listed in §2.2 / §2.4 / §3.2 / §3.4 | That event must not change object or occurrence meaning. Do not infer a leftover. If the job cannot complete without changing meaning, stop; re-packet |

---

## 9. Independent Definition Re-Review questions (CORR-1G)

1. Does this body keep locked Correction-2 CORR-2A/B tables unreplaced while adding only session-context acquisition uniqueness?
2. Is `current support object` acquisition unique (Primary Action episode on D-TODAY / D-PERSON with occurrence / D-UNRECORDED occurrence choice) without Global 手順 minting, and without treating list visibility as selection?
3. After Primary Action on a chosen D-TODAY object, is Destination uniquely D-PROCEDURE (C4 Next), not a second procedure place?
4. After D-PERSON open with a day’s occurrence, is Destination uniquely D-PERSON (not D-TODAY, not auto D-PROCEDURE)?
5. Is first-paint auto-entry to D-PROCEDURE rejected even when synthetic objects exist?
6. Is `current occurrence` acquisition unique (D-PROCEDURE Completion / D-UNRECORDED choice) without Global 記録する minting, and does D-UNRECORDED choice also acquire/replace the corresponding support object (OPTION A)?
7. Are support-object and occurrence-context **release** sets exhaustive, including D-PERSON open without current occurrence as RELEASE, with Global 今日 / unspecified Back not implied releases, and occurrence-true requiring object-true?
8. Are insufficient-context fallbacks from CORR-1F preserved (手順→D-TODAY, 記録する→D-UNRECORDED)?
9. Are D-PROCEDURE / D-RECORD-WRITE / D-TODAY / D-PERSON location identities unique and not a generic non-place?
10. Is D-HOME still alias of D-TODAY only?
11. Are PLANNER / ADMIN_AUDIT Global, P2-2, P2-3, and workstream Open Questions OUT?
12. Is Smoke ≠ Human Task explicit, with FS-HTA-1 remainder not claimed by this packet?
13. Are no new Destinations and no invented auth roles present?
14. Is implementation (React/CSS/router/file list) not over-fixed?
15. Does this packet avoid closing P2-2 / P2-3 or PLANNER / ADMIN_AUDIT by side-effect?
16. Is Implementation Start still NOT AUTHORIZED by this packet?
17. Does H-6 stop implementers from inferring unlisted session-context changes?
18. Does D-PERSON open without current occurrence uniquely RELEASE sticky object and coupled occurrence, stay D-PERSON, and restore Global fallbacks?
19. When object is false on D-PERSON, is existing C4 Primary Action uniquely NOT ACTIONABLE / STAY D-PERSON (no navigate, no mint, no silent D-TODAY fallback)?
20. When object is true, do existing C4 Primary Action and Global 手順 share unique Destination identity D-PROCEDURE without requiring a unique control path?

---

## 10. Author self-audit (not a Lock)

```text
CORR-1G-A first paint              → object false, D-TODAY                 unique
CORR-1G-A Primary Action + object  → object true, D-PROCEDURE              unique
CORR-1G-A list visible without PA  → object false (unless sticky true)     unique
CORR-1G-A D-PERSON + occurrence    → object true, D-PERSON only            unique
CORR-1G-A D-PERSON − occurrence    → RELEASE object+occ., stay D-PERSON    unique
CORR-1G-A D-UNRECORDED choice      → object true (acquire/replace)         unique
CORR-1G-A C4 PA object false       → NOT ACTIONABLE / stay D-PERSON        unique
CORR-1G-A C4 PA / Global 手順 true → same Destination identity D-PROCEDURE unique
CORR-1G-A Global 手順 + object     → D-PROCEDURE (same identity)           unique
CORR-1G-A Global 手順 − object     → D-TODAY fallback (CORR-1F)            unique
CORR-1G-A Global 今日              → D-TODAY; object not released          unique
CORR-1G-A release set              → deselect / drop person /
                                     D-PERSON − occurrence / replace       unique
CORR-1G-B D-PROCEDURE Completion   → occurrence true, D-RECORD-WRITE       unique
CORR-1G-B D-UNRECORDED choice      → object+occurrence true, D-RECORD-WRITE unique
CORR-1G-B Global 記録する + occ.   → D-RECORD-WRITE                        unique
CORR-1G-B Global 記録する − occ.   → D-UNRECORDED fallback (CORR-1F)        unique
CORR-1G-B occurrence-true          → requires object-true                  unique
CORR-1G-B release set              → object-release / deselect / replace   unique
CORR-1G-C location identities      → 今日の支援 / 手順 / 記録する /
                                     未記録 / 探す / この人の支援コンテキスト unique
CORR-2B FIELD_STAFF D-HOME         → still == D-TODAY                      unique
```

---

## 11. Close

```text
CORR-1G Definition packet = APPLIED (this document)
Definition Correction-1 = APPLIED
Definition Correction-2 = APPLIED
Normative surface = this packet body
Parent Correction-2 packet = PRESERVED / LOCKED (blob 5eeb8140…)
P0 / P1 = for Independent Definition Re-Review-2 only
Human Definition Lock eligibility (CORR-1G) = NOT YET (await Re-Review-2)
Human Definition Lock (CORR-1G) = NOT GENERATED / NOT CONSUMED
Repository Mutation (product / schema / persistence / SPFx) = NONE
Human Gate Consumption = Kickoff GO + Definition Correction-1 GO + Definition Correction-2 GO (separate records)
Implementation Authority = NONE
NEXT = Fresh Independent Definition Re-Review-2
```

```text
STOP = no Product implementation from this packet
     = no self-PASS of Independent Definition Re-Review-2
     = no Ready / Merge / Deploy / LIVE WRITE
     = no PLANNER / ADMIN_AUDIT completion claim
     = no CORR-1F reopen
```
