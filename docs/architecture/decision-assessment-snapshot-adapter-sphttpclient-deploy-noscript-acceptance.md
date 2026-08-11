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

## Execution result

```text
Human one-set execution = COMPLETE / PASS

Baseline:
  Tenant App Catalog DenyAddAndCustomizePages = Enabled

Temporary enable:
  DenyAddAndCustomizePages = Disabled

Deploy:
  Tenant Add-PnPApp -Publish -Overwrite = PASS
  app title = severe-behavior-support-spfx-shell-client-side-solution
  AppCatalogVersion = 1.0.0.0
  Deployed = True

Restore:
  final DenyAddAndCustomizePages = Enabled
  matches baseline = YES
  RESTORE CONFIRMED = Enabled

Permanent scripting leave-behind = 0
Agent mutation / upload = 0
```

## Resulting gate state

```text
Decision-AS-ADAPTER-SPHTTPCLIENT-DEPLOY-NOSCRIPT-1
= PASS / VERIFIED

Parent Decision-AS-ADAPTER-SPHTTPCLIENT-DEPLOY-1
= PASS / VERIFIED

Ready / Merge remains separate / HUMAN-ONLY
```
