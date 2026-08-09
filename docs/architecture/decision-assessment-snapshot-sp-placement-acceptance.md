# Decision-AS-SP-PLACEMENT-1 — Site / List / Internal Column Name Human Acceptance

この文書は、**Decision-AS-SP-PLACEMENT-1**（AssessmentSnapshot 向け
Site / List / Internal Column Name の確定根拠・SoT 境界）についての
**Human Acceptance 正本（LOCKED）** である。

Compare packet:
[`decision-assessment-snapshot-sp-placement-packet.md`](./decision-assessment-snapshot-sp-placement-packet.md)

Selected via:
[`decision-ilb-1-sixteenth-residual-sp-placement-selection.md`](./decision-ilb-1-sixteenth-residual-sp-placement-selection.md)

Depends on（再 Decision しない）:
[`decision-assessment-snapshot-dec6-mapping-acceptance.md`](./decision-assessment-snapshot-dec6-mapping-acceptance.md)
[`decision-assessment-snapshot-sp-adapter-acceptance.md`](./decision-assessment-snapshot-sp-adapter-acceptance.md)
[`decision-assessment-snapshot-application-save-acceptance.md`](./decision-assessment-snapshot-application-save-acceptance.md)

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-AS-SP-PLACEMENT-1
Status: Accepted / LOCKED
Human Decision: SV-1 + LV-1 + CN-1 + SC-1
Human Acceptance: Explicit Human Decision on 2026-08-09

LOCKED:

Site confirmation:
  SV-1 — 実 SharePoint / tenant の確認済み一次情報のみで Site を確定
         未確認なら HOLD
         推測・命名案を Accepted 値にしない

List confirmation:
  LV-1 — 実 List の確認済み一次情報のみで List を確定
         未作成 / 未確認なら HOLD

Internal Column Name:
  CN-1 — SharePoint が実際に保持する Internal Column Name を確認して確定
         Display Name / TypeScript 名から推論しない

Source-of-truth / config:
  SC-1 — mapping 正本と deployment/config 値を分離
         logical mapping = repository contract
         tenant/site/list/internal-name 環境値 = deployment configuration

Concrete values（本 Acceptance では埋めない）:
  Site value: NOT CONFIRMED / HOLD
  List value: NOT CONFIRMED / HOLD
  Internal Column Name: NOT CONFIRMED / HOLD

DEC-009 / APP-SAVE / SP-ADAPTER / DEC6-MAPPING:
  UNCHANGED / LOCKED（再 Decision しない）

Implementation Start:
  HOLD
SharePoint implementation:
  DO NOT START
Schema / DTO code assignment:
  DO NOT START / HOLD
tenant changes:
  NO-GO
Deploy / real data:
  NO-GO
FindingCode:
  HOLD
A-5:
  HOLD
Post-retention deletion:
  OPEN / AUTO-START FORBIDDEN

Closes only:
  Decision-AS-SP-PLACEMENT-1 確認根拠・SoT 境界（SV/LV/CN/SC）
Does NOT close:
  Site / List / Internal Name 具体値
  実テナント確認 GO
  SharePoint / adapter / application 実装
  Schema / DTO コード割当
  FindingCode / A-5
  Implementation Start
  post-retention deletion
Implementation auto-start: FORBIDDEN
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

## Human Acceptance（固定結論）

```text
Human Decision: SV-1 + LV-1 + CN-1 + SC-1
Decision-AS-SP-PLACEMENT-1: Accepted / LOCKED

Site confirmation:         SV-1
List confirmation:         LV-1
Internal Column Name:      CN-1
Source-of-truth / config:  SC-1
```

日本語正本:

```text
SV-1:
  Site は実 SharePoint / tenant の確認済み一次情報のみで確定する。
  未確認なら HOLD。推測・命名案は Accepted 値にしない。
LV-1:
  List は実 List の確認済み一次情報のみで確定する。
  未作成 / 未確認なら HOLD。
CN-1:
  Internal Column Name は SharePoint が実際に保持する値を確認して確定する。
  Display Name や TypeScript 名から推論しない。
SC-1:
  logical mapping は repository contract 正本に置き、
  tenant/site/list/internal-name の環境値は deployment configuration に分離する。
```

```text
Agent recommendation（SV-1 + LV-1 + CN-1 + SC-1）:
  NOT Human Acceptance evidence
This document records the Human Decision only.
```

## Accepted 内容

```text
Decision-AS-SP-PLACEMENT-1: Accepted / LOCKED

Site confirmation:         SV-1
List confirmation:         LV-1
Internal Column Name:      CN-1
Source-of-truth / config:  SC-1

NOT SELECTED:
  SV-2 / SV-3 / SV-HOLD / SV-X
  LV-2 / LV-3 / LV-HOLD / LV-X
  CN-2 / CN-3 / CN-HOLD / CN-X
  SC-2 / SC-3 / SC-HOLD / SC-X
```

具体値（LOCKED として埋めない）:

```text
Site value: NOT CONFIRMED / HOLD
List value: NOT CONFIRMED / HOLD
Internal Column Name: NOT CONFIRMED / HOLD
```

失敗時 MUST NOT（LOCKED）:

```text
未確認 Site / List / Internal Name を Accepted 値として書く
Display Name / TypeScript 名から Internal Name を推論して確定する
命名案・例示 URL を本番配置値として扱う
logical mapping 正本へ環境固有値を直書きして同一視する
実テナント確認 NO-GO のまま具体値を確定扱いにする
```

### この決定からは導出しない

```text
NOT derived / MUST NOT equate:
  Decision-AS-SP-PLACEMENT-1 Accepted = Site / List / Internal Name 具体値確定
  Decision-AS-SP-PLACEMENT-1 Accepted = tenant confirmation GO
  Decision-AS-SP-PLACEMENT-1 Accepted = Implementation Start
  Decision-AS-SP-PLACEMENT-1 Accepted = SharePoint / adapter コード開始
  Decision-AS-SP-PLACEMENT-1 Accepted = Schema / DTO コード割当
  Decision-AS-SP-PLACEMENT-1 Accepted = FindingCode / A-5 再開
  Decision-AS-SP-PLACEMENT-1 Accepted = post-retention 開始
  Decision-AS-SP-PLACEMENT-1 Accepted = DEC-009 / APP-SAVE / SP-ADAPTER / DEC6-MAPPING 再定義
```

## Acceptance boundary

```text
This Acceptance locks confirmation method + SoT/config boundary only.

MUST NOT start from this Acceptance alone:
  inventing Site URL / List name / Internal Column Name
  tenant confirmation / SharePoint / Entra / M365 changes
  TypeScript / application / persistence port / adapter code
  Schema / DTO implementation
  Schema ID / schemaVersion / dtoVersion code assignment
  FindingCode / A-5
  post-retention deletion
  Implementation Start
  Deploy / real data
```

## Next

```text
Decision-AS-SP-PLACEMENT-1: Accepted / LOCKED / SV-1 + LV-1 + CN-1 + SC-1
Site / List / Internal Column Name values: NOT CONFIRMED / HOLD
Implementation Start: HOLD
SharePoint implementation: DO NOT START
tenant changes: NO-GO
Schema / DTO: HOLD
FindingCode / A-5: HOLD
Post-retention deletion: OPEN / AUTO-START FORBIDDEN
Next substantive unit: NOT SELECTED by this Acceptance
Ready: NOT RUN
Merge: NOT RUN
```
