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
PR: #257（Option C Acceptance / Packet sync / IR）

IDENTITY FILL-IN（別 Decision；Option C は UNCHANGED）:
  Decision-GOV-AUD-01-IDENTITY-1
  = Accepted / LOCKED
  正本: decision-gov-aud-01-identity-fill-in-acceptance.md
  meeting_or_minutes_system_identity:
  - 支援計画アセスメント会議
  - 支援計画モニタリング会議
  reference_id_meaning:
  会議種別 + 開催日 + 利用者ID

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
meeting_or_minutes_system_identity / reference_id_meaning:
  PROVIDED via Decision-GOV-AUD-01-IDENTITY-1
  （decision-gov-aud-01-identity-fill-in-acceptance.md）
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
  PROVIDED / LOCKED via Decision-GOV-AUD-01-IDENTITY-1
  meeting_or_minutes_system_identity:
  - 支援計画アセスメント会議
  - 支援計画モニタリング会議
  reference_id_meaning:
  会議種別 + 開催日 + 利用者ID
  physical ID format = OUT / NOT DECIDED here
```

日本語正本:

```text
Handoff の正本:
  既存会議・議事録側

アプリ:
  参照 ID と Handoff 状態だけを保持

会議・議事録の識別:
  支援計画アセスメント会議
  支援計画モニタリング会議

参照 ID の意味:
  会議種別 + 開催日 + 利用者ID
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

Identity fill-in は **本 Option C を再オープンせず**、
[`decision-gov-aud-01-identity-fill-in-acceptance.md`](./decision-gov-aud-01-identity-fill-in-acceptance.md)
として記録する。

## 既存契約との関係

| 単位 | 本 Acceptance 後 |
|---|---|
| Decision-HO-1 | **UNCHANGED** |
| Decision-HO-EDGE-1 | **UNCHANGED** |
| GOV-AUD-02 roles | **UNCHANGED** |
| HandoffStatus vocabulary（#27） | **UNCHANGED** |
| App as business SoT（Option A） | **NOT ADOPTED** |
| Identity fill-in | **Decision-GOV-AUD-01-IDENTITY-1** |
| External meeting API | **NOT STARTED** |
| FindingCode / A-5 / Implementation | **HOLD** |

## Next

```text
GOV-AUD-01: Accepted / LOCKED / Option C
identity fill-in: Decision-GOV-AUD-01-IDENTITY-1（Accepted / LOCKED）
physical ID format / Schema / connector: HOLD
next residual SELECT（one item；Agent auto-advance FORBIDDEN）
Issue #19 Close: NOT AUTHORIZED
```

Agent は本 Acceptance を理由に外部連携実装・物理 ID 発明・次 residual 自動 SELECT へ進まない。
