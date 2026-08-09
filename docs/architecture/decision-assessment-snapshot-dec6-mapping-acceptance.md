# Decision-AS-DEC6-MAPPING-1 — DEC-6 concrete mapping Human Acceptance

この文書は、**Decision-AS-DEC6-MAPPING-1**（AssessmentSnapshot 向け
DEC-6 concrete mapping の写像規則）についての **Human Acceptance 正本（LOCKED）** である。

Compare packet:
[`decision-assessment-snapshot-dec6-mapping-packet.md`](./decision-assessment-snapshot-dec6-mapping-packet.md)

Selected via:
[`decision-ilb-1-fifteenth-residual-dec6-mapping-selection.md`](./decision-ilb-1-fifteenth-residual-dec6-mapping-selection.md)

Depends on（再 Decision しない）:
[`decision-assessment-snapshot-sp-adapter-acceptance.md`](./decision-assessment-snapshot-sp-adapter-acceptance.md)
[`decision-assessment-snapshot-application-save-acceptance.md`](./decision-assessment-snapshot-application-save-acceptance.md)
[`decision-dec-009-snapshot-save-timing-acceptance.md`](./decision-dec-009-snapshot-save-timing-acceptance.md)

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-AS-DEC6-MAPPING-1
Status: Accepted / LOCKED
Human Decision: LF-1 + RW-1 + MF-1 + VR-1
Human Acceptance: Explicit Human Decision on 2026-08-09

LOCKED:

Logical ↔ persistence:
  LF-1 — 明示 mapping 表（logical field → persistence field slot）
         Internal Name / Site / List の具体値は未確認なら書かない
         Status=未確認のまま残してよい

Read/write conversion:
  RW-1 — 写像対象フィールドごとに read/write 変換規則を文書化
         変換失敗は成功へ倒さない
         変換は adapter 内（CV-1）

Missing/malformed:
  MF-1 — 必須欠落・型不正・未知必須列は fail-closed
         成功空結果や部分成功へ倒さない
         adapter が FR-1 語彙へ写像（EM-1）

Version handling:
  VR-1 — persistence 上でも Accepted 1.0.0 / 1.0.0
         （または明示 readable set）と照合
         不一致は fail-closed
         TypeScript/DTO へのコード割当は依然 HOLD

DEC-009 / Decision-AS-APP-SAVE-1 / Decision-AS-SP-ADAPTER-1:
  UNCHANGED / LOCKED（再 Decision しない）

Implementation Start:
  HOLD
SharePoint implementation:
  DO NOT START
Site URL / List name / Internal Column Name:
  NOT DECIDED
Schema ID / schemaVersion / dtoVersion のコード割当:
  DO NOT START / HOLD
Schema / DTO:
  HOLD
FindingCode:
  HOLD
A-5:
  HOLD
Post-retention deletion:
  OPEN / AUTO-START FORBIDDEN
Deploy / real data:
  NO-GO

Closes only:
  Decision-AS-DEC6-MAPPING-1 写像規則（LF/RW/MF/VR）
Does NOT close:
  Site / List / Internal Name 具体値
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
Human Decision: LF-1 + RW-1 + MF-1 + VR-1
Decision-AS-DEC6-MAPPING-1: Accepted / LOCKED

Logical ↔ persistence = LF-1
Read/write conversion  = RW-1
Missing/malformed      = MF-1
Version handling       = VR-1
```

日本語正本:

```text
LF-1:
  logical field と persistence field slot の対応は明示 mapping 表で持つ。
  未確認の Internal Name / Site / List は推測で埋めず、未確認のまま残す。
RW-1:
  写像対象ごとに read/write 変換規則を文書化し、変換失敗は成功へ倒さない。
  変換責務は adapter 内（CV-1）に閉じる。
MF-1:
  必須欠落・型不正・未知必須列は fail-closed。
  成功空結果や部分成功へ倒さず、adapter が FR-1 へ写像する（EM-1）。
VR-1:
  persistence でも schemaVersion / dtoVersion = 1.0.0 / 1.0.0
  （または明示 readable set）と照合し、不一致は fail-closed。
  コード割当は開始しない。
```

```text
Agent recommendation（LF-1 + RW-1 + MF-1 + VR-1）:
  NOT Human Acceptance evidence
This document records the Human Decision only.
```

## Accepted 内容

```text
Decision-AS-DEC6-MAPPING-1: Accepted / LOCKED

Logical ↔ persistence:   LF-1
Read/write conversion:    RW-1
Missing/malformed:        MF-1
Version handling:         VR-1

NOT SELECTED:
  LF-2 / LF-3 / LF-HOLD / LF-X
  RW-2 / RW-3 / RW-HOLD / RW-X
  MF-2 / MF-3 / MF-HOLD / MF-X
  VR-2 / VR-3 / VR-HOLD / VR-X
```

失敗時 MUST NOT（LOCKED）:

```text
未確認 Internal Name を確定値として書く
missing / malformed を draft/finalize 成功として扱う
変換失敗を成功空結果や部分成功へ隠す
未知 version を自動 migrate して成功にする
schemaVersion / dtoVersion 文字列自体を本 Acceptance で変更する
TypeScript / DTO への version コード割当を開始する
```

### この決定からは導出しない

```text
NOT derived / MUST NOT equate:
  Decision-AS-DEC6-MAPPING-1 Accepted = Implementation Start
  Decision-AS-DEC6-MAPPING-1 Accepted = SharePoint / adapter コード開始
  Decision-AS-DEC6-MAPPING-1 Accepted = Site URL / List / Internal Name 確定
  Decision-AS-DEC6-MAPPING-1 Accepted = Schema / DTO コード割当
  Decision-AS-DEC6-MAPPING-1 Accepted = FindingCode / A-5 再開
  Decision-AS-DEC6-MAPPING-1 Accepted = post-retention 開始
  Decision-AS-DEC6-MAPPING-1 Accepted = DEC-009 / SC-1 / FR-1 / SP-ADAPTER 再定義
```

## Acceptance boundary

```text
This Acceptance locks DEC-6 mapping rules（LF/RW/MF/VR）only.

MUST NOT start from this Acceptance alone:
  inventing or deploying Site / List / Internal Column Name
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
Decision-AS-DEC6-MAPPING-1: Accepted / LOCKED / LF-1 + RW-1 + MF-1 + VR-1
Implementation Start: HOLD
SharePoint implementation: DO NOT START
Site URL / List name / Internal Column Name: NOT DECIDED
Schema / DTO: HOLD
FindingCode / A-5: HOLD
Post-retention deletion: OPEN / AUTO-START FORBIDDEN
Next substantive unit: NOT SELECTED by this Acceptance
Ready: NOT RUN
Merge: NOT RUN
```
