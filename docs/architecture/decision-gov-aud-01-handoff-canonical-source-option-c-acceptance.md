# GOV-AUD-01 — Handoff の正本 Human Acceptance（Option C）

この文書は、**GOV-AUD-01**（handoff の正本）についての
**Option C Human Acceptance evidence** である。

Decision packet:
[`decision-gov-aud-01-handoff-canonical-source-decision-packet.md`](./decision-gov-aud-01-handoff-canonical-source-decision-packet.md)

Unit Selection:
[`decision-gov-aud-01-handoff-canonical-source-selection.md`](./decision-gov-aud-01-handoff-canonical-source-selection.md)
（PR #256 MERGED）

Owner: Issue #19

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: GOV-AUD-01
Status: Accepted / LOCKED
Human Acceptance: Explicit Human Option C on 2026-08-11
Selected Option: C
Meaning:
  業務正本 = 既存会議・議事録側
  アプリは参照 ID と Handoff 状態（および受理済み契約の範囲）だけを保持
Baseline tip: c34061c0095c172971ae07417db1acd93cc97fc5
PR: （Option C Acceptance / Packet sync / IR）

HUMAN-REQUIRED（本 Acceptance では発明しない / NOT YET PROVIDED）:
  meeting_or_minutes_system_identity: NOT YET PROVIDED
  reference_id_meaning: NOT YET PROVIDED

Does NOT mean:
  外部システム API 実装 GO
  会議システム名・URL・ID 体系の Agent 発明
  アプリ内 HandoffState / HO-EDGE-1 / GOV-AUD-02 の再設計または廃止
  アプリを業務正本にした（Option A NOT SELECTED）

FindingCode: HOLD
A-5: HOLD
Implementation Start: HOLD
Implementation auto-start: FORBIDDEN
next residual auto-select: FORBIDDEN
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

## Human Acceptance

```text
Human Acceptance: Explicit Human Option C on 2026-08-11
GOV-AUD-01: Accepted / LOCKED
Selected Option: C

業務正本:
  既存会議・議事録側

アプリ保持範囲:
  参照 ID
  Handoff 状態（受理済み契約の範囲）
```

補足（Human 未記入 / Agent 非発明）:

```text
meeting_or_minutes_system_identity:
  NOT YET PROVIDED
  （名称または公式識別子。Option C 採択後の Human 記入）

reference_id_meaning:
  NOT YET PROVIDED
  （参照 ID が何を指すか。Option C 採択後の Human 記入）
```

```text
Prior non-binding Agent recommendation: Option C
Agent recommendation ≠ Human Acceptance evidence
This document records the Human Decision「c」only.
```

## Accepted 内容

```text
GOV-AUD-01: Accepted / LOCKED
Selected: Option C

SoT model:
  business canonical source = existing meeting / minutes side
  application = reference ID + Handoff status only
    （plus already-accepted transition / role contracts）

Concrete identity fields:
  meeting_or_minutes_system_identity = NOT YET PROVIDED
  reference_id_meaning = NOT YET PROVIDED
  MUST be Human-provided before any mapping / integration Implementation
  Agent MUST NOT invent system name / URL / ID format
```

日本語正本:

```text
Handoff の正本:
  既存会議・議事録側

アプリ:
  参照 ID と Handoff 状態だけを保持

会議・議事録システムの識別:
  NOT YET PROVIDED（Human 記入）

参照 ID の意味:
  NOT YET PROVIDED（Human 記入）
```

意味:

- **業務上の正本は会議・議事録側**であり、アプリ内 handoff 台帳を業務正本にしない（Option A 不採択）。
- アプリはすでに Accepted の Handoff 状態機械（HO-EDGE-1 / GOV-AUD-02 等）の範囲で
  **参照 ID + 状態**を保持するモデルとする。
- 外部会議システムへの自動連携・API・Deploy は本 Acceptance だけでは開始しない。
- システム識別と参照 ID 意味が未記入の間、それらに依存する実装・列マッピングは HOLD。

## Acceptance boundary

```text
NOT derived / MUST NOT start from this Acceptance alone:
  会議システム名 / URL / ID 体系の発明
  外部 API / connector Implementation Start
  アプリ内 handoff 台帳を業務正本化する変更（Option A）
  GOV-AUD-02 / HO-1 / HO-EDGE-1 の再 Decision
  HandoffStatus 語彙の再定義
  SharePoint / M365 / Entra mutation
  FindingCode / A-5
  Issue #19 Close
  next residual auto-select
  Deploy / real data
```

将来、会議・議事録システムの識別および参照 ID 意味を Human が記入する場合は、
**本 Option C を再オープンせず**、同一 Accepted モデルへの
**Human-provided identity fill-in**（別 docs 追記または狭域 Decision）として記録する。

## 既存契約との関係

| 単位 | 本 Acceptance 後 |
|---|---|
| Decision-HO-1 | **UNCHANGED** |
| Decision-HO-EDGE-1 | **UNCHANGED** |
| GOV-AUD-02 roles | **UNCHANGED** |
| HandoffStatus vocabulary（#27） | **UNCHANGED** |
| App as business SoT（Option A） | **NOT ADOPTED** |
| External meeting API | **NOT STARTED** |
| FindingCode / A-5 / Implementation | **HOLD** |

## Next

```text
GOV-AUD-01: Accepted / LOCKED / Option C
Strict order for this recording PR:
  1. Independent Review
  2. Human Ready
  3. Human Merge → main mirror

After Merge（separate Human steps）:
  - Human fill-in: meeting_or_minutes_system_identity
  - Human fill-in: reference_id_meaning
  - next residual SELECT（one item；Agent auto-advance FORBIDDEN）
Implementation that depends on identity/ID meaning: HOLD until fill-in
Issue #19 Close: NOT AUTHORIZED
```

Agent は本 Acceptance を理由に外部連携実装・ID 体系発明・次 residual 自動 SELECT へ進まない。
