# HUMAN-GATE-UNKNOWN-DIAGNOSTICS-V1 — PHASE 1 Gate Input Inventory

```text
Unit: HUMAN-GATE-UNKNOWN-DIAGNOSTICS-V1-PHASE1-INVENTORY-1
Kind: READ-ONLY gate input inventory for Source PR #557
Mode: READ ONLY / NO EXECUTION AUTHORITY
Parent freeze: docs/architecture/human-gate-unknown-diagnostics-v1-phase0-freeze-1.md
Freeze basis main SHA: 919eeba5d061ba81fb05f536d4828301b3dcc212
Status: INVENTORY COMPLETE / ROOT-CAUSE NOT LOCKED
Implementation = NOT AUTHORIZED
PR #557 mutation = NOT AUTHORIZED
```

This inventory lists inputs that the machine Human Gate path
(`buildGatePacket` / `deriveNextHumanAction`) needs, and classifies each for
Source PR #557 as **OBTAINABLE** / **NOT_OBTAINABLE** / **NOT_APPLICABLE**.

It does **not** decide what the correct Human Action is.

---

## 1. Resolver surface under inventory

```text
Entry:
  npm run gate-packet:read -- <issue>
  → readGatePacketForIssue(issue)
  → getPilot(issue)  (REQUIRED; null ⇒ no packet)
  → buildGatePacket(...)
  → deriveNextHumanAction(gates)

Code:
  scripts/lib/gate-packet/pilots.mjs
  scripts/lib/gate-packet/read-gate-packet.mjs
  scripts/lib/gate-packet/parse-markdown-evidence.mjs
  scripts/lib/gate-packet/constants.mjs
```

User phrase `resolveHumanAction()` maps to `deriveNextHumanAction(gates)` only
after a pilot bind and gate parse succeed.

---

## 2. Inventory table — Source PR #557

| # | Input (user / machine) | Machine field / path | #557 class | Evidence |
|---|---|---|---|---|
| 1 | PR identity | `packet.pr` / GitHub `number` | **OBTAINABLE** (live) / **NOT_OBTAINABLE** (packet) | Live PR #557 exists; pilot registry has no entry for 557 |
| 2 | PR state | `live.pr_state` | **OBTAINABLE** (live) / **NOT_OBTAINABLE** (packet) | OPEN via `gh`; packet path never built |
| 3 | draft state | GitHub `isDraft` | **OBTAINABLE** (live) / **NOT_APPLICABLE** (packet schema) | draft=true; packet has no draft field |
| 4 | HEAD SHA | GitHub `headRefOid` | **OBTAINABLE** (live) / **NOT_OBTAINABLE** (packet) | `d56bf66c1003fe86d2694fbcc55d3ec3033abdf4` |
| 5 | base SHA | GitHub `baseRefOid` | **OBTAINABLE** (live) / **NOT_OBTAINABLE** (packet) | `08492b65412053c78bcd976d7dde547b632dacfe` |
| 6 | merge state | `mergeable` / `mergeStateStatus` / `live.pr_state` | **OBTAINABLE** (live) / **NOT_OBTAINABLE** (packet) | MERGEABLE / CLEAN; not MERGED |
| 7 | CI state | GitHub check rollup | **OBTAINABLE** (live) / **NOT_APPLICABLE** (packet schema) | SUCCESS; packet does not index CI |
| 8 | review state | GitHub reviews | **OBTAINABLE** (live) / **NOT_APPLICABLE** (packet schema) | reviews=`[]`; packet does not index reviews |
| 9 | Definition lineage | `locked_heads.definition` | **NOT_OBTAINABLE** (packet) | No pilot evidence / slice-bind for #557; PR body mentions Slice A lineage in prose only |
| 10 | Scope lineage | `locked_heads.scope` | **NOT_OBTAINABLE** (packet) | Same as Definition |
| 11 | Implementation lineage | `locked_heads.implementation` | **NOT_OBTAINABLE** (packet) | Same as Definition |
| 12 | Human GO records | `gates.*` formal tokens | **NOT_OBTAINABLE** (formal) | Body uses HOLD prose; no `Key = FORMAL_TOKEN` lines for packet aliases |
| 13 | GO consumed state | `gates.* = CONSUMED` | **NOT_OBTAINABLE** | No formal CONSUMED lines on #557 for Ready/Merge of #557 itself |
| 14 | GO invalidation state | `gates.* = INVALIDATED` | **NOT_OBTAINABLE** | No formal INVALIDATED lines |
| 15 | required current Human action | `next_human_action` | **NOT_OBTAINABLE** via packet | Cannot call derive without gates object from pilot path |
| 16 | authority provenance | `sources.*` | **NOT_OBTAINABLE** (packet) | No packet `sources` for #557 |
| 17 | sourceRefs | `sources.pilot_evidence_paths` / `slice_bind_paths` | **NOT_OBTAINABLE** | `getPilot(557) === null` |
| 18 | freshness | `freshness.*` | **NOT_OBTAINABLE** (packet) | No packet freshness for #557; live observation time recorded only in PHASE 0 freeze |
| 19 | Decision Candidate | (not in packet today) | **NOT_PRESENT** (observation) / **NOT_OBTAINABLE** (machine field) | Freeze: Decision Candidate = NOT_PRESENT; no machine field exists |
| 20 | Pilot registry bind | `getPilot(557)` | **NOT_OBTAINABLE** | Returns `null` |

### Classification legend

```text
OBTAINABLE     = value can be read from an existing READ-ONLY source at freeze time
NOT_OBTAINABLE = required by machine path but not available for this Source
NOT_APPLICABLE = not represented in current packet schema (may still be live-observable)
NOT_PRESENT    = diagnostic observation that no decision candidate exists
```

---

## 3. What can be obtained vs not (summary)

### Obtainable without packet (GitHub live only)

```text
PR identity, state, draft, HEAD, base, mergeable, CI, review emptiness
```

### Not obtainable for machine `deriveNextHumanAction` on #557

```text
pilot bind
evidence markdown → gates formal tokens
locked_heads lineage bind
sources / freshness packet fields
next_human_action via Option B CLI
decisionCandidate machine field
UNKNOWN resolution.code / missingInputs / ambiguousInputs
```

### Obtainable on collateral pilot #552 (not Source)

```text
packet JSON including next_human_action=UNKNOWN
gates with several UNKNOWN values
locked_heads populated
live.pr_state=MERGED
```

Still **missing** on #552 packet (diagnostic gap shared with Source problem class):

```text
resolution.code
missingInputs
ambiguousInputs
structured decisionCandidate
```

---

## 4. Explicit non-decisions

This PHASE does **not**:

- Assert the correct next Human Action for PR #557
- Promote HOLD prose into formal gate tokens
- Register #557 as a gate-packet pilot
- Treat CI SUCCESS or draft=false eligibility as Ready

---

## 5. Next

```text
PHASE 2 — UNKNOWN Root-Cause Classification (candidate labels only)
```
