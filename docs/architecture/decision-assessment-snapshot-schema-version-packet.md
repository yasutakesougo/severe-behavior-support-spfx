# Decision-AS-SCHEMA-VERSION-1 — schemaVersion / dtoVersion Decision packet（read-only compare）

この文書は、Twelfth residual（SELECTED / A — schemaVersion / dtoVersion）後の
**初回 schemaVersion / dtoVersion 具体値の比較用 Human Decision Packet** である。

Accepted 正本:
[`decision-assessment-snapshot-schema-version-acceptance.md`](./decision-assessment-snapshot-schema-version-acceptance.md)

```text
repository: yasutakesougo/severe-behavior-support-spfx
baseline main: 337ffe87b8de17819d37b036d2fd0b2e8b18816b
Decision ID: Decision-AS-SCHEMA-VERSION-1
Kind: Human Decision packet（compare → CONSUMED）
Status: CONSUMED（Human Decision Accepted / LOCKED）
Human Decision: A
Human Selected:
  schemaVersion = 1.0.0
  dtoVersion    = 1.0.0
Depends on:
  decision-ilb-1-twelfth-residual-schemaversion-selection.md（SELECTED / A）
  decision-assessment-snapshot-schema-id-value-naming-acceptance.md
    （Decision-AS-SCHEMA-ID-1 Accepted / LOCKED）
  assessment-snapshot-schema-dto-versioning.md（Entry #7）
  contracts-v1.md（DEC-1）
Implementation Start: HOLD
schemaVersion concrete value: Accepted / 1.0.0
dtoVersion concrete value: Accepted / 1.0.0
Schema ID assignment into code / DTO / SharePoint: HOLD / NOT STARTED
Schema / DTO / SharePoint / adapter: HOLD
application save: HOLD
FindingCode / A-5: HOLD
Deploy / real data: NO-GO
SemVer invention beyond Accepted 1.0.0: FORBIDDEN without new Human Decision
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
Historical note:
  候補・Agent recommendation は比較用。採択は Acceptance 正本のみが LOCKED である。
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

## 3. Options（比較履歴）

### A — Initial version = 1.0.0 — **Accepted**

```text
Meaning:
  schemaVersion = 1.0.0
  dtoVersion    = 1.0.0
  （DEC-1: 同一値）
```

### B — HOLD — **NOT SELECTED**

```text
Meaning:
  concrete value は未決定のまま維持する
```

| ID | 結果の意味 | 結果 |
|---|---|---|
| **A** | `1.0.0` / `1.0.0` を採択 | **Accepted** |
| **B** | 未決定維持 | NOT SELECTED |

```text
NOT candidates（本 packet に載せない / 採択禁止）:
  0.1.0 / 0.0.1 等の仮版を Agent が発明すること
  dtoVersion を schemaVersion と別値にすること
  Schema ID 文字列を変更すること
  版を Schema ID に埋め込むこと
```

## 4. Agent recommendation（historical / NOT Acceptance）

```text
Agent recommendation: A — Initial version = 1.0.0
Human Decision: A（Accepted / LOCKED）
Agent recommendation alone was NOT Acceptance evidence.
```

## 5. 判断単位の分離

| 決める / 決めない | 本 packet |
|---|---|
| 初回 schemaVersion 具体値 | **Accepted / 1.0.0** |
| dtoVersion（= schemaVersion） | **Accepted / 1.0.0** |
| Schema ID 文字列 | OUT（LOCKED） |
| TypeScript / validator / fixtures / tests | OUT |
| Schema ID / schemaVersion / dtoVersion のコード割当 | OUT |
| DTO / SharePoint / adapter | OUT |
| application save | OUT |
| FindingCode / A-5 | OUT |
| Implementation Start | HOLD |

## 6. Human Decision（固定）

```text
Decision-AS-SCHEMA-VERSION-1: A
schemaVersion = 1.0.0
dtoVersion    = 1.0.0
```

```text
After Acceptance:
  schemaVersion / dtoVersion concrete values: LOCKED（Acceptance 正本）
  Implementation Start: HOLD
  TypeScript / validator / fixtures / tests: DO NOT START
  Schema ID / schemaVersion / dtoVersion のコード割当: DO NOT START
  Schema / DTO / SharePoint / adapter: HOLD
  application save: HOLD
  FindingCode / A-5: HOLD
```

## 7. A を選んでも自動開始しない境界

```text
Human Accepted A（1.0.0）:
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
  treat this compare packet alone as the LOCKED Acceptance（use Acceptance 正本）
  invent a SemVer beyond Accepted 1.0.0 without new Human Decision
  set dtoVersion ≠ schemaVersion
  start TypeScript / DTO / SharePoint / adapter / application save
  reopen FindingCode / A-5
```

## 9. Next after Human Decision

```text
Decision-AS-SCHEMA-VERSION-1: Accepted / LOCKED / A = 1.0.0
  → decision-assessment-snapshot-schema-version-acceptance.md
Implementation Start: HOLD
Ready / Merge: NOT RUN by this Decision
```
