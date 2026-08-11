# Decision-AS-ADAPTER-SPHTTPCLIENT-DEPLOY-NOSCRIPT-1 — Human Acceptance（GO）

この文書は、Tenant App Catalog の **一時 scripting 有効化 + scoped Deploy + 復帰**
に対する Human GO の Acceptance 正本である。

Packet:
[`decision-assessment-snapshot-adapter-sphttpclient-deploy-noscript-packet.md`](./decision-assessment-snapshot-adapter-sphttpclient-deploy-noscript-packet.md)

Depends on（再 Decision しない）:
[`decision-assessment-snapshot-adapter-sphttpclient-deploy-acceptance.md`](./decision-assessment-snapshot-adapter-sphttpclient-deploy-acceptance.md)
[`decision-assessment-snapshot-adapter-sphttpclient-deploy-verification.md`](./decision-assessment-snapshot-adapter-sphttpclient-deploy-verification.md)
[`../decisions/DEC-AI-ORG-003.md`](../decisions/DEC-AI-ORG-003.md)

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-AS-ADAPTER-SPHTTPCLIENT-DEPLOY-NOSCRIPT-1
Status: Accepted / LOCKED（GO boundary）
Human Decision: GO-DEPLOY-NOSCRIPT-TEMP
Human Acceptance date: 2026-08-11
Deploy HEAD: a0fc767c5df4349c43f8176e9a7388c33f45a167
Deploy evidence: 6524785bc993a261f8f8cc2a3e2c4422b9291178
PR: #233

Authorized（one set）:
  temporary scripting enable on Tenant App Catalog only
  → Add-PnPApp scoped .sppkg（Tenant）
  → confirm
  → restore baseline scripting/NoScript
  → evidence

NOT AUTHORIZED:
  permanent scripting leave-behind
  Agent execution
  Ready / Merge auto-progress
  scripting enable on other sites
  real business data writes
  SPO_* secrets merely to unblock Agent
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

## Human Acceptance（固定結論）

```text
Human Decision: GO-DEPLOY-NOSCRIPT-TEMP
Decision-AS-ADAPTER-SPHTTPCLIENT-DEPLOY-NOSCRIPT-1: Accepted / LOCKED

Meaning:
  authorize the temporary NoScript/scripting exception solely to finish
  Decision-AS-ADAPTER-SPHTTPCLIENT-DEPLOY-1 for this .sppkg
  as one atomic enable → Deploy → confirm → restore set
```

## Boundary

```text
GO-DEPLOY-NOSCRIPT-TEMP ≠ Ready / Merge
GO-DEPLOY-NOSCRIPT-TEMP ≠ permanent NoScript disable
GO-DEPLOY-NOSCRIPT-TEMP ≠ Agent upload / Agent mutation
prior GO-DEPLOY alone ≠ NoScript mutation authorization
```

## Current execution snapshot

```text
Parent Deploy:
  NOT PASS / BLOCKED_BY_NOSCRIPT_GUARD
  NoScript mutation = 0
  Tenant Deploy = NOT COMPLETED

This GO:
  Accepted / LOCKED（boundary）
  execution = NOT STARTED / HOLD FOR HUMAN ONE-SET
```

## Next

```text
1. Human runs packet §3 one set
2. Paste evidence（chat or commit）
3. Record PASS/FAIL on this verification + update parent Deploy verification
4. stop（Ready / Merge remains separate）
```
