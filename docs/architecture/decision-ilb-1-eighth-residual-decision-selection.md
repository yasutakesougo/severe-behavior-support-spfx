# Decision-ILB-1 後の第8残存 Decision 選定 — Human Selection

Decision packet: [`decision-ilb-1-eighth-residual-decision-selection-packet.md`](./decision-ilb-1-eighth-residual-decision-selection-packet.md)

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: ILB1_EIGHTH_RESIDUAL_DECISION_SELECTION
Status: SELECTED
Human Selection: Explicit Human Option A on 2026-08-09
Selected residual Decision:
  A — AS-EC-1 Entry #7（Schema / DTO versioning policy）
Selected meaning:
  AssessmentSnapshot 完全契約の Schema / DTO versioning は DEC-1 に従う
  固有 Schema ID 採番は今行わない
Acceptance: decision-as-ec-1-entry-7-schema-dto-versioning-acceptance.md
Policy: assessment-snapshot-schema-dto-versioning.md
Prior CONSUMED:
  first residual C — Decision-RD-3
  second residual A — GOV-AUD-05 / DEC-012 retention prohibition
  third residual A — DEC-009
  fourth residual A — AS-EC-1 Entry #8
  fifth residual A — AS-EC-1 Entry #2
  sixth residual A — AS-EC-1 Entry #5
  seventh residual A — AS-EC-1 Entry #6
FindingCode: HOLD
A-5: HOLD
Implementation Start: HOLD
PR-J implementation: DO NOT START
```

## Human Selection

```text
Selected: A
AS-EC-1 Entry #7 Schema / DTO versioning policy
versioning: DEC-1 に従う
固有 Schema ID 採番: 今は行わない
この判断で行うこと:
  versioning 方針を正本化する
  Entry #7 を PASS / MET へ閉じる
この判断で行わないこと:
  Schema ID 具体値の採択
  overall Entry satisfied の自動宣言
  Implementation Start / PR-J 実装
```

## Next

```text
Acceptance + policy: LOCKED
Entry #7: PASS / MET
Decision-AS-EC-1 overall: MET / Accepted（[`decision-as-ec-1-overall-entry-acceptance.md`](./decision-as-ec-1-overall-entry-acceptance.md)）
FindingCode / A-5 / Implementation Start / PR-J: HOLD
Next residual Decision: NOT SELECTED
Recommended next candidate（Human only）: Implementation Start（別単位；自動開始禁止）
```
