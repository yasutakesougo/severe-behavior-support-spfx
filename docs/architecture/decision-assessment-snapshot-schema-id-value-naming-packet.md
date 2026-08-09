# AssessmentSnapshot Schema ID — value / naming Decision packet（read-only compare）

この文書は、Human A（proceed to Schema ID value / naming Decision）承認後の
**具体候補・命名規則の比較用 Human Decision Packet** である。

Accepted 正本:
[`decision-assessment-snapshot-schema-id-value-naming-acceptance.md`](./decision-assessment-snapshot-schema-id-value-naming-acceptance.md)

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-AS-SCHEMA-ID-1（value / naming）
Kind: Human Decision packet（compare → CONSUMED）
Status: CONSUMED（Human Decision Accepted / LOCKED）
Human Decision: ACCEPT
Human Selected:
  Naming rule: NR-1
  Concrete Schema ID: ID-1
  Initial schemaVersion: SV-HOLD
Depends on:
  decision-ilb-1-eleventh-residual-schema-id-selection.md（SELECTED / C）
  decision-assessment-snapshot-schema-id-packet.md
  decision-schema-id-value-naming-proceed-acceptance.md（Human A）
  assessment-snapshot-schema-dto-versioning.md（Entry #7）
  contracts-v1.md（DEC-1）
Implementation Start: HOLD
Schema ID naming rule: Accepted / NR-1
Schema ID concrete value: Accepted / severe-behavior-support.assessment-snapshot.snapshot
schemaVersion / dtoVersion: HOLD / NOT DECIDED（SV-HOLD）
Schema ID assignment into code / DTO / SharePoint: HOLD / NOT STARTED
value invention beyond Accepted ID-1: FORBIDDEN
Schema / DTO / SharePoint / adapter: HOLD
FindingCode / A-5: HOLD
Deploy / real data: NO-GO
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

## 1. 本 packet の問い

```text
Question 1 — Naming rule:
  AssessmentSnapshot 固有 Schema ID の命名規則はどれか。

Question 2 — Concrete Schema ID:
  採択する具体 Schema ID 文字列はどれか（または Human 明示文字列）。

Question 3 — Initial schemaVersion（任意・分離可）:
  初回 schemaVersion（= dtoVersion）を今決めるか。未決のままにするか。
```

```text
Historical note:
  候補表は比較用。採択は Acceptance 正本のみが LOCKED である。
```

## 2. 再 Decision しない前提（LOCKED）

| 項目 | 固定値 |
|---|---|
| Schema ID の役割 | 個別契約の安定識別子 |
| Schema ID ≠ SharePoint List 名 | LOCKED |
| Schema ID ≠ TypeScript 型名 | LOCKED |
| Schema Version | SemVer |
| DTO Version | Schema Version と同一 |
| SupportPlan Schema ID | UNCHANGED（触らない） |

SupportPlan 先例（参照のみ）:

```text
severe-behavior-support.support-plan.plan @ 1.0.0
severe-behavior-support.support-plan.plan-version @ 1.0.0
```

## 3. Naming rule 候補（比較履歴）

| ID | 規則 | 例の形 | 結果 |
|---|---|---|---|
| **NR-1** | `{product}.{aggregate}.{artifact}` 小文字ドット区切り（SupportPlan 同型） | `severe-behavior-support.assessment-snapshot.<leaf>` | **Accepted** |
| **NR-2** | `{product}.{aggregate}` のみ（leaf なし） | `severe-behavior-support.assessment-snapshot` | NOT SELECTED |
| **NR-3** | reverse-DNS / URI 風 | `jp.local...assessment-snapshot` | NOT SELECTED |
| **NR-4** | opaque UUID | `urn:uuid:...` | NOT SELECTED |
| **NR-X** | Human 明示規則 | （Human が書く） | NOT SELECTED |

```text
FORBIDDEN as naming rule / ID source:
  TypeScript 型名そのもの（例: AssessmentSnapshot）
  SharePoint List 名そのもの
  Schema Version を ID 文字列に埋め込む（版は SemVer 側）
  環境名・テナント名・ブランチ名を ID に含める
```

## 4. Concrete Schema ID 候補（比較履歴）

前提: 下表は **NR-1 を仮定した比較用**。

| ID | 候補文字列 | 意図 | 結果 |
|---|---|---|---|
| **ID-1** | `severe-behavior-support.assessment-snapshot.snapshot` | 集約本体 | **Accepted** |
| **ID-2** | `severe-behavior-support.assessment-snapshot.result` | Result 面強調 | NOT SELECTED |
| **ID-3** | `severe-behavior-support.assessment-snapshot.record` | 永続記録面 | NOT SELECTED |
| **ID-4** | `severe-behavior-support.assessment-snapshot.complete` | 完全契約面 | NOT SELECTED |
| **ID-X** | Human 明示文字列 | Human 指定 | NOT SELECTED |

```text
NOT candidates（比較表に載せない / 採択禁止）:
  AssessmentSnapshot
  assessment-snapshot（List 名想定）
  severe-behavior-support.assessment-snapshot.v1（版を ID に混入）
```

## 5. Initial schemaVersion 候補（分離可）

| ID | 値 | 結果 |
|---|---|---|
| **SV-1** | `1.0.0` | NOT SELECTED |
| **SV-HOLD** | 未設定のまま | **Accepted（HOLD / NOT DECIDED）** |
| **SV-X** | Human 明示 SemVer | NOT SELECTED |

```text
DTO Version = Schema Version（DEC-1）。別値にしない。
SV-HOLD は schemaVersion を補完しない。DTO / SharePoint 実装は自動開始しない。
```

## 6. 判断単位の分離

| 決める / 決めない | 本 packet |
|---|---|
| Naming rule（NR-*） | **Accepted / NR-1** |
| Concrete Schema ID（ID-*） | **Accepted / ID-1** |
| Initial schemaVersion（SV-*） | **Accepted as SV-HOLD** |
| DTO 型実装 | OUT |
| SharePoint / DEC-6 | OUT |
| application save | OUT |
| FindingCode / A-5 | OUT |
| Implementation Start | HOLD |

## 7. Human Decision（固定）

```text
Naming rule:    NR-1
Schema ID:      ID-1 — severe-behavior-support.assessment-snapshot.snapshot
schemaVersion:  SV-HOLD
Human Decision: ACCEPT
```

```text
After Acceptance:
  Schema ID naming + concrete value: LOCKED（Acceptance 正本）
  schemaVersion / dtoVersion: HOLD / NOT DECIDED
  Schema ID assignment into code / DTO / SharePoint: HOLD / NOT STARTED
  value invention beyond Accepted ID-1: FORBIDDEN
  Implementation Start: HOLD
  Schema / DTO / SharePoint / adapter: DO NOT START
```

## 8. Explicit prohibitions

```text
Do NOT:
  treat this compare packet alone as the LOCKED Acceptance（use Acceptance 正本）
  invent an ID outside Accepted ID-1
  complement schemaVersion as 1.0.0 from this packet
  start TypeScript / DTO / SharePoint / adapter / application save
  reopen FindingCode / A-5
```

## 9. Next after Human Acceptance

```text
Decision-AS-SCHEMA-ID-1: Accepted / LOCKED
  → decision-assessment-snapshot-schema-id-value-naming-acceptance.md
schemaVersion / dtoVersion: HOLD / NOT DECIDED
Implementation Start: HOLD
Ready / Merge: NOT RUN by this Decision
```
