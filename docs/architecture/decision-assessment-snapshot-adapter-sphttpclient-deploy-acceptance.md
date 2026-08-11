# Decision-AS-ADAPTER-SPHTTPCLIENT-DEPLOY-1 — Human Acceptance（GO）

この文書は、**Deploy / App Catalog** に対する Human GO の
Acceptance 正本である。実行完了証跡は別 verification 文書へ記録する。

Packet:
[`decision-assessment-snapshot-adapter-sphttpclient-deploy-packet.md`](./decision-assessment-snapshot-adapter-sphttpclient-deploy-packet.md)

Depends on（再 Decision しない）:
[`decision-assessment-snapshot-adapter-sphttpclient-live-write-acceptance.md`](./decision-assessment-snapshot-adapter-sphttpclient-live-write-acceptance.md)
[`decision-assessment-snapshot-adapter-sphttpclient-live-write-verification.md`](./decision-assessment-snapshot-adapter-sphttpclient-live-write-verification.md)
[`decision-assessment-snapshot-adapter-spfx-version-scaffold-acceptance.md`](./decision-assessment-snapshot-adapter-spfx-version-scaffold-acceptance.md)
[`../decisions/DEC-AI-ORG-003.md`](../decisions/DEC-AI-ORG-003.md)

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-AS-ADAPTER-SPHTTPCLIENT-DEPLOY-1
Status: Accepted / LOCKED（GO boundary）
Human Decision: GO-DEPLOY
Human Acceptance date: 2026-08-11
Live-write HEAD: 93c119cbcb5db94ba1b28d0ef9ff53ce989d7971
Live-write evidence: f8cc4ceb02b9c99643f48e333de66ab0bef8a4c0
PR: #232

Authorized:
  Human Deploy of severe-behavior-support-spfx-shell.sppkg
  to pilot App Catalog（site preferred; tenant only if required）

NOT authorized by this GO:
  Tenant App Catalog NoScript / scripting setting mutation
  （even temporary）

Execution status:
  package build = PASS
  Site App Catalog = NOT PRESENT
  Tenant App Catalog = PRESENT
  Tenant Deploy = NOT COMPLETED
  NoScript mutation = 0
  Deploy verification = NOT PASS / BLOCKED_BY_NOSCRIPT_GUARD
  Evidence HEAD: 6524785bc993a261f8f8cc2a3e2c4422b9291178

NOT AUTHORIZED:
  Ready / Merge auto-progress
  Agent App Catalog upload
  Add-PnPApp retry / -Force under current HOLD
  real business data writes
  Entra / tenant config changes
  SPO_* secrets merely to unblock Agent
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

## Human Acceptance（固定結論）

```text
Human Decision: GO-DEPLOY
Decision-AS-ADAPTER-SPHTTPCLIENT-DEPLOY-1: Accepted / LOCKED（GO boundary）

Meaning:
  authorize Human App Catalog Deploy of the scoped SPFx shell package now
  keep Ready / Merge as a later separate Human action
```

## Boundary

```text
GO-DEPLOY ≠ Ready / Merge
GO-DEPLOY ≠ Agent tenant login / Agent upload
GO-DEPLOY ≠ real business data authorization
GO-DEPLOY ≠ Tenant App Catalog NoScript / scripting mutation
live write PASS ≠ Deploy PASS
Deploy PASS ≠ Ready / Merge
```

## Current execution snapshot

```text
Prerequisites:
  live read = PASS
  live write = PASS / VERIFIED
  synthetic residue = 0

package build = PASS
Site App Catalog = NOT PRESENT
Tenant App Catalog = PRESENT
Tenant Deploy = NOT COMPLETED
NoScript mutation = 0
Agent App Catalog upload = 0

Deploy verification = NOT PASS
HOLD = BLOCKED_BY_NOSCRIPT_GUARD

Ready / Merge = HUMAN-ONLY
```

## Next

```text
1. stop — no Add-PnPApp retry / no -Force
2. separate Human GO / NO-GO for temporary Tenant App Catalog
   scripting enablement solely to complete this scoped .sppkg Deploy
3. If GO: temporary enable → Deploy → confirm → restore = one set
4. Ready / Merge remains separate
```
