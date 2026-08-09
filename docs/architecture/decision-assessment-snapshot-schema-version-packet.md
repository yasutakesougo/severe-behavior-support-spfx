# Decision-AS-SCHEMA-VERSION-1 — schemaVersion / dtoVersion Decision packet（read-only compare）

この文書は、Twelfth residual（SELECTED / A — schemaVersion / dtoVersion）後の
**初回 schemaVersion / dtoVersion 具体値の比較用 Human Decision Packet** である。

```text
repository: yasutakesougo/severe-behavior-support-spfx
baseline main: 337ffe87b8de17819d37b036d2fd0b2e8b18816b
Decision ID: Decision-AS-SCHEMA-VERSION-1
Kind: Human Decision packet（compare only）
Status: OPEN / NOT ACCEPTED
Depends on:
  decision-ilb-1-twelfth-residual-schemaversion-selection.md（SELECTED / A）
  decision-assessment-snapshot-schema-id-value-naming-acceptance.md
    （Decision-AS-SCHEMA-ID-1 Accepted / LOCKED）
  assessment-snapshot-schema-dto-versioning.md（Entry #7）
  contracts-v1.md（DEC-1）
Implementation Start: HOLD
schemaVersion concrete value: HOLD / NOT DECIDED
dtoVersion concrete value: HOLD / NOT DECIDED
Schema ID assignment into code / DTO / SharePoint: HOLD / NOT STARTED
Schema / DTO / SharePoint / adapter: HOLD
application save: HOLD
FindingCode / A-5: HOLD
Deploy / real data: NO-GO
value invention as Accepted without Human Decision: FORBIDDEN
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

## 1. 本 packet の問い

```text
Question:
  AssessmentSnapshot の初回 schemaVersion を採択するか。
```

前提（LOCKED / 再 Decision しない）:

```text
Schema ID =
  severe-behavior-support.assessment-snapshot.snapshot
  Accepted / LOCKED（Decision-AS-SCHEMA-ID-1）
DEC-1:
  Schema Version = SemVer
  DTO Version = Schema Version
  LOCKED
```

```text
本 packet に候補・Agent recommendation が書いてあっても Accepted にはならない。
採択は明示 Human Decision / Acceptance が必要。
```

## 2. 再 Decision しない前提（LOCKED）

| 項目 | 固定値 |
|---|---|
| Schema ID 文字列 | `severe-behavior-support.assessment-snapshot.snapshot` |
| Naming rule | NR-1 `{product}.{aggregate}.{artifact}` |
| Schema Version 形式 | SemVer |
| DTO Version | Schema Version と同一（別値にしない） |
| SupportPlan Schema Version 先例 | UNCHANGED（触らない） |

SupportPlan 先例（参照のみ）:

```text
severe-behavior-support.support-plan.plan @ 1.0.0
severe-behavior-support.support-plan.plan-version @ 1.0.0
```

## 3. Options（比較・未採択）

### A — Initial version = 1.0.0

```text
Meaning:
  schemaVersion = 1.0.0
  dtoVersion    = 1.0.0
  （DEC-1: 同一値）

Rationale（比較用・非 Acceptance）:
  初回完全契約に対する最初の安定版として自然
  SupportPlan 先例も 1.0.0
```

### B — HOLD

```text
Meaning:
  concrete value は未決定のまま維持する
  schemaVersion / dtoVersion = HOLD / NOT DECIDED
```

| ID | 結果の意味 | 利点 | リスク / 欠点 |
|---|---|---|---|
| **A** | `1.0.0` / `1.0.0` を採択 | 先例一致・初回安定版として明確 | 値採択 ≠ 実装開始を混同しやすい |
| **B** | 未決定維持 | 実装境界をさらに遅延できる | Schema ID だけ LOCKED のまま版が空 |

```text
NOT candidates（本 packet に載せない / 採択禁止）:
  0.1.0 / 0.0.1 等の仮版を Agent が発明すること
  dtoVersion を schemaVersion と別値にすること
  Schema ID 文字列を変更すること
  版を Schema ID に埋め込むこと
```

## 4. Agent recommendation（NOT Acceptance）

```text
Agent recommendation: A — Initial version = 1.0.0

This is NOT Human Acceptance evidence.
Human must explicitly Accept A or B（or HOLD）.
```

## 5. 判断単位の分離

| 決める / 決めない | 本 packet |
|---|---|
| 初回 schemaVersion 具体値 | **比較対象（A/B）** |
| dtoVersion（= schemaVersion） | **A 採択時のみ同値で決まる；別判断にしない** |
| Schema ID 文字列 | OUT（LOCKED） |
| TypeScript / validator / fixtures / tests | OUT |
| Schema ID / schemaVersion / dtoVersion のコード割当 | OUT |
| DTO / SharePoint / adapter | OUT |
| application save | OUT |
| FindingCode / A-5 | OUT |
| Implementation Start | HOLD |

## 6. Human Decision（未選択）

Human は次を明示する（未記載は NOT DECIDED）。

```text
Decision-AS-SCHEMA-VERSION-1: A / B / HOLD
```

```text
Until explicit Human Acceptance:
  schemaVersion concrete value: HOLD / NOT DECIDED
  dtoVersion concrete value: HOLD / NOT DECIDED
  Implementation Start: HOLD
  TypeScript / validator / fixtures / tests: DO NOT START
  Schema ID / schemaVersion / dtoVersion のコード割当: DO NOT START
  Schema / DTO / SharePoint / adapter: HOLD
  application save: HOLD
  FindingCode / A-5: HOLD
```

## 7. A を選んでも自動開始しない境界

```text
Even if Human Accepts A（1.0.0）:
  Implementation Start: HOLD
  TypeScript / validator / fixtures / tests: DO NOT START
  Schema ID / schemaVersion / dtoVersion のコード割当: DO NOT START
  DTO / SharePoint / adapter: HOLD
  application save: HOLD
  FindingCode / A-5: HOLD
  Deploy / real data: NO-GO
```

## 8. Explicit prohibitions

```text
Do NOT:
  treat this compare packet as Acceptance
  lock 1.0.0 by Agent recommendation alone
  invent a SemVer outside A without explicit Human text
  set dtoVersion ≠ schemaVersion
  start TypeScript / DTO / SharePoint / adapter / application save
  reopen FindingCode / A-5
```

## 9. Next after Human Decision（将来）

```text
If Human Accepts A:
  → write Acceptance LOCKED doc（別手順）
  → still NOT auto Implementation Start
If Human Selects B / HOLD:
  → remain HOLD / NOT DECIDED
```
