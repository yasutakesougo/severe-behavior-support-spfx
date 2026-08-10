# Decision-AS-SCHEMA-MAPPING-NEXT-1 — post-CN-1 schema mapping / column path packet

この文書は、Twenty-ninth residual（SELECTED / A）後の
**カスタム列 0 環境における schema mapping / column path / Implementation Start 境界**
についての比較用 Human Decision Packet である。

Selected via:
[`decision-ilb-1-twenty-ninth-residual-schema-mapping-selection.md`](./decision-ilb-1-twenty-ninth-residual-schema-mapping-selection.md)

Depends on（再 Decision しない）:
[`decision-assessment-snapshot-cn1-closure-determination.md`](./decision-assessment-snapshot-cn1-closure-determination.md)
（Decision-AS-CN1-OBSERVATION-1 = CLOSED / CONSUMED / DEFAULT_COLUMNS_ONLY）
[`decision-assessment-snapshot-cn1-readonly-observation-evidence.md`](./decision-assessment-snapshot-cn1-readonly-observation-evidence.md)
[`decision-assessment-snapshot-dec6-mapping-acceptance.md`](./decision-assessment-snapshot-dec6-mapping-acceptance.md)
（Decision-AS-DEC6-MAPPING-1 = LF-1+RW-1+MF-1+VR-1）
[`decision-assessment-snapshot-sp-adapter-acceptance.md`](./decision-assessment-snapshot-sp-adapter-acceptance.md)
[`decision-assessment-snapshot-sp-placement-acceptance.md`](./decision-assessment-snapshot-sp-placement-acceptance.md)
（Decision-AS-SP-PLACEMENT-1 = SV-1+LV-1+CN-1+SC-1）

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-AS-SCHEMA-MAPPING-NEXT-1
Kind: Human Decision packet（compare → Acceptance）
Status: OPEN / NOT ACCEPTED
Human Decision: NOT YET

Baseline（PR #191 MERGED）:
  merge commit: 0738ea79e159e0bc9a60dc6c1bdccfd9784681ad
  reviewed content HEAD: 819b0fe7…
  status: MERGED
  CN-1 observation docs: on main

Locked facts（再 Decision しない）:
  CN-1 observation = CLOSED / CONSUMED
  Result class = DEFAULT_COLUMNS_ONLY
  Custom application columns = 0 / NOT PRESENT
  Match-existing-app-Internal-Names premise = NOT APPLICABLE / INVALIDATED
  DEC-6 rules = LF-1 + RW-1 + MF-1 + VR-1（Accepted / LOCKED）
  CN-1 rule = observe real Internal Names；do not infer
  SC-1 = logical mapping ≠ deployment/config values

Current boundary（unchanged by opening this packet）:
  Implementation Start = HOLD
  SharePoint adapter / schema mapping implementation = HOLD
  SharePoint column creation = FORBIDDEN
  Agent SharePoint mutation = FORBIDDEN
  Deploy / real data = NO-GO
  GitHub Issue mutation / 一括 Close / 一括本文更新 = FORBIDDEN
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

## 1. Question

```text
パイロット 4 Lists は DEFAULT_COLUMNS_ONLY（custom = 0）である。

この事実の下で、次をどう固定するか:
  1. logical mapping 表を今どう扱うか（MT）
  2. intended Internal Names を本 Decision で扱うか（IN）
  3. column provisioning Execution GO を本 Decision に含めるか（CP）
  4. Implementation Start / adapter code / Deploy 境界（XB）

本 packet ≠ Internal Name 発明
本 packet ≠ column 作成実行
本 packet ≠ Implementation Start
本 packet ≠ adapter / schema mapping 実装開始
```

```text
Historical note:
  候補・Agent recommendation は比較用。
  採択は Human Acceptance 正本のみが LOCKED である。
  axes Accepted ≠ concrete Internal Names CONFIRMED
  axes Accepted ≠ column creation completed
  axes Accepted ≠ Implementation Start
```

## 2. 再 Decision しない前提（LOCKED）

| 項目 | 固定値 | 正本 |
|---|---|---|
| CN-1 observation result | DEFAULT_COLUMNS_ONLY / custom = 0 | Decision-AS-CN1-OBSERVATION-1 |
| CN-1 confirmation rule | 実 Internal Name のみ確定；推論禁止 | Decision-AS-SP-PLACEMENT-1 |
| DEC-6 mapping rules | LF-1 + RW-1 + MF-1 + VR-1 | Decision-AS-DEC6-MAPPING-1 |
| Adapter boundary | PB-1+EM-1+CV-1+D6-1+UP-1 | Decision-AS-SP-ADAPTER-1 |
| Site / List | isogo/honmoku；SupportPlans/AssessmentSnapshots | PILOT-* Accepted |
| SoT / config | SC-1（logical ≠ env values） | Decision-AS-SP-PLACEMENT-1 |

```text
MUST NOT re-open in this packet:
  DEC-6 rules themselves（LF/RW/MF/VR）
  CN-1 observation evidence / closure result
  Site / List names
  FindingCode / A-5
  post-retention deletion
```

## 3. Compare axes

### MT — mapping table now

| ID | 内容 | 結果 |
|---|---|---|
| **MT-1** | logical mapping 表を更新可。ただし app Internal Name は `未確認` / `NOT PRESENT` のまま。CONFIRMED 値を書かない | OPEN candidate |
| MT-2 | mapping 表は列が存在するまで触らない | OPEN candidate |
| MT-HOLD | mapping 表扱いも未決定のまま | OPEN candidate |
| MT-X | Human 明示 | OPEN candidate |

```text
NOT candidates:
  未確認 Internal Name を確定値として書く
  Display Name / TS / Domain 名から Internal Name を推論して埋める
  DEFAULT_COLUMNS_ONLY を mapping-complete と書く
```

### IN — intended Internal Names

| ID | 内容 | 結果 |
|---|---|---|
| **IN-A** | 本 Decision では intended Internal Names を採択しない。NOT PRESENT のまま残す | OPEN candidate |
| **IN-B** | Human Acceptance で intended Internal Names を明示採択する。状態 = HUMAN-PROVIDED / INTENDED。≠ OBSERVED / CONFIRMED。作成後に CN-1 再観測必須 | OPEN candidate |
| IN-HOLD | intended names 方針も未決定 | OPEN candidate |
| IN-X | Human 明示 | OPEN candidate |

```text
NOT candidates:
  Agent が concrete Internal Name 文字列を発明して Accepted にする
  INTENDED を CONFIRMED / OBSERVED と同一視する
  Title だけをもって SupportPlan / AssessmentSnapshot mapping 完了とみなす
```

### CP — column provisioning path

| ID | 内容 | 結果 |
|---|---|---|
| **CP-1** | column provisioning Execution GO は本 Acceptance に含めない。別 Human gate | OPEN candidate |
| CP-2 | 本 Acceptance に column provisioning Execution GO を含める | OPEN candidate |
| CP-HOLD | provisioning 経路も未決定 | OPEN candidate |
| CP-X | Human 明示 | OPEN candidate |

```text
NOT candidates（いずれを選んでも）:
  Agent による SharePoint column create / rename / delete
  本 packet オープンだけで列作成開始
  AP-1 / DEC-AI-ORG-003 の緩和を本 packet から導出
```

### XB — Implementation / adapter / Deploy boundary

| ID | 内容 | 結果 |
|---|---|---|
| **XB-1** | 本 Decision ≠ Implementation Start ≠ adapter/schema mapping code start ≠ Deploy / real data | OPEN candidate（必須維持候補） |
| XB-2 | 本 Decision で adapter / schema mapping 実装開始を許可 | NOT selectable while required columns NOT PRESENT |
| XB-3 | 本 Decision で Implementation Start = GO | NOT selectable while required columns NOT PRESENT |
| XB-X | Human 明示 | OPEN candidate |

```text
While custom application columns = 0:
  XB-2 / XB-3 = NOT SELECTABLE
  MF-1 fail-closed still applies to missing required columns
```

## 4. Agent recommendation（比較用；Acceptance ではない）

```text
Agent recommendation:
  MT-1 + IN-A + CP-1 + XB-1

Meaning:
  MT-1 — logical mapping は LF-1 どおり更新してよいが、
         Internal Name は 未確認 / NOT PRESENT のまま
  IN-A — 本 Decision で intended Internal Names を発明・採択しない
  CP-1 — column creation Execution GO は別 Human gate
  XB-1 — Implementation / adapter code / Deploy は開始しない

Why not IN-B now:
  concrete Internal Name 文字列は Human 明示が必要であり、
  本 packet では Agent が値を埋めない。
  Human が intended names を用意できるなら Acceptance で IN-B へ切替可。

Why not CP-2 now:
  column mutation は観測・命名・Execution GO を混ぜると境界が壊れる。
  CN-1 再観測前提を残すため provisioning GO は分離する。

Why XB-1 required:
  custom columns = 0 のまま Implementation / adapter start は
  MF-1 / mapping-complete 禁止と衝突する。

NOT Human Acceptance evidence.
```

## 5. Explicit non-authorization

```text
This OPEN packet does NOT authorize:
  Internal Name invention
  treating INTENDED as CONFIRMED
  SharePoint column create / rename / delete
  permissions / Entra / Graph / tenant mutation
  SharePoint adapter / schema mapping implementation
  Implementation Start
  Deploy / real data
  GitHub Issue mutation / 一括 Close / 一括本文更新
  Issue Status Reconciliation as substitute for this Decision
```

## 6. Related process debt（not this packet）

```text
Issue Status Reconciliation:
  assessed in issue-status-reconciliation-assessment.md
  independent candidate
  NOT a substitute for MT/IN/CP/XB Decision
```

## 7. Next

```text
Decision-AS-SCHEMA-MAPPING-NEXT-1: OPEN / NOT ACCEPTED
Awaiting: Human Decision on MT + IN + CP + XB
Recommended compare set: MT-1 + IN-A + CP-1 + XB-1
Until Accepted + prerequisites met:
  Implementation Start = HOLD
  adapter / schema mapping implementation = HOLD
  SharePoint column creation = FORBIDDEN
  Deploy / real data = NO-GO
  Internal Name invention = FORBIDDEN
If IN-B later Accepted:
  intended names = HUMAN-PROVIDED / INTENDED only
  then separate CP Execution GO
  then CN-1 re-observation before CONFIRMED
```
