# AssessmentSnapshot Schema ID — value / naming Decision packet（read-only compare）

この文書は、Human A（proceed to Schema ID value / naming Decision）承認後の
**具体候補・命名規則の比較用 Human Decision Packet** である。

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-AS-SCHEMA-ID-1（value / naming）
Kind: Human Decision packet（compare only）
Status: OPEN / NOT ACCEPTED
Depends on:
  decision-ilb-1-eleventh-residual-schema-id-selection.md（SELECTED / C）
  decision-assessment-snapshot-schema-id-packet.md
  decision-schema-id-value-naming-proceed-acceptance.md（Human A）
  assessment-snapshot-schema-dto-versioning.md（Entry #7）
  contracts-v1.md（DEC-1）
Implementation Start: HOLD
Schema ID assignment: HOLD / NOT STARTED
Schema ID concrete value: NOT DECIDED
Schema ID naming rule: NOT DECIDED
value invention by Agent as Accepted: FORBIDDEN
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
本 packet に候補が書いてあっても Accepted にはならない。
採択は明示 Human Acceptance が必要。
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

## 3. Naming rule 候補（比較・未採択）

| ID | 規則 | 例の形 | 利点 | リスク / 欠点 |
|---|---|---|---|---|
| **NR-1** | `{product}.{aggregate}.{artifact}` 小文字ドット区切り（SupportPlan 同型） | `severe-behavior-support.assessment-snapshot.<leaf>` | 既存正本と一貫 | leaf 名の選択が別判断 |
| **NR-2** | `{product}.{aggregate}` のみ（leaf なし） | `severe-behavior-support.assessment-snapshot` | 短い | 将来 artifact 分割時に改名圧力 |
| **NR-3** | reverse-DNS / URI 風 | `jp.local...assessment-snapshot` | 全球一意っぽい | 本 repo 先例と不一致；組織ドメイン発明になりやすい |
| **NR-4** | opaque UUID | `urn:uuid:...` | 意味衝突しにくい | 可読性・先例不一致；運用しづらい |
| **NR-X** | Human 明示規則 | （Human が書く） | 最大の自由度 | 規則未記載なら採択不可 |

```text
FORBIDDEN as naming rule / ID source:
  TypeScript 型名そのもの（例: AssessmentSnapshot）
  SharePoint List 名そのもの
  Schema Version を ID 文字列に埋め込む（版は SemVer 側）
  環境名・テナント名・ブランチ名を ID に含める
```

## 4. Concrete Schema ID 候補（比較・未採択）

前提: 下表は **NR-1 を仮定した比較用**。NR-1 未採択なら葉の議論も保留してよい。

| ID | 候補文字列 | 意図 | 整合 | 注意 |
|---|---|---|---|---|
| **ID-1** | `severe-behavior-support.assessment-snapshot.snapshot` | 集約本体 | SupportPlan の `.plan` に対応しやすい | 「snapshot」重複感 |
| **ID-2** | `severe-behavior-support.assessment-snapshot.result` | Result 面強調 | Result 変換と語彙が近い | 完全契約全体より狭い命名 |
| **ID-3** | `severe-behavior-support.assessment-snapshot.record` | 永続記録面 | draft/finalized 記録に合う | 「record」が汎用すぎる可能性 |
| **ID-4** | `severe-behavior-support.assessment-snapshot.complete` | 完全契約面 | PR-J 呼称に近い | プロセス用語が ID に残る |
| **ID-X** | Human 明示文字列 | Human 指定 | — | Agent が書き換えない |

```text
NOT candidates（比較表に載せない / 採択禁止）:
  AssessmentSnapshot
  assessment-snapshot（List 名想定）
  severe-behavior-support.assessment-snapshot.v1（版を ID に混入）
```

## 5. Initial schemaVersion 候補（分離可・未採択）

| ID | 値 | 意味 |
|---|---|---|
| **SV-1** | `1.0.0` | 初回採番の慣例 |
| **SV-HOLD** | 未設定のまま | Schema ID だけ先に決め、Version は DTO 着手時 |
| **SV-X** | Human 明示 SemVer | Human 指定 |

```text
DTO Version = Schema Version（DEC-1）。別値にしない。
SV を決めても DTO / SharePoint 実装は自動開始しない。
```

## 6. 判断単位の分離

| 決める / 決めない | 本 packet |
|---|---|
| Naming rule（NR-*） | **比較対象** |
| Concrete Schema ID（ID-*） | **比較対象** |
| Initial schemaVersion（SV-*） | **比較対象（分離可）** |
| DTO 型実装 | OUT |
| SharePoint / DEC-6 | OUT |
| application save | OUT |
| FindingCode / A-5 | OUT |
| Implementation Start | HOLD |

## 7. Human Decision（未選択）

Human は次を明示する（組み合わせ可。未記載は NOT DECIDED）。

```text
Naming rule:    NR-1 / NR-2 / NR-3 / NR-4 / NR-X:<text> / HOLD
Schema ID:      ID-1 / ID-2 / ID-3 / ID-4 / ID-X:<text> / HOLD
schemaVersion:  SV-1 / SV-HOLD / SV-X:<semver> / HOLD
```

```text
Until explicit Human Acceptance of concrete values:
  Schema ID assignment: HOLD / NOT STARTED
  value invention: FORBIDDEN
  Implementation Start: HOLD
  Schema / DTO / SharePoint / adapter: DO NOT START
```

## 8. Explicit prohibitions

```text
Do NOT:
  treat this compare packet as Acceptance
  lock any NR-* / ID-* / SV-* by Agent recommendation alone
  invent an ID outside the table without Human ID-X text
  start TypeScript / DTO / SharePoint / adapter / application save
  reopen FindingCode / A-5
```

## 9. Next after Human Acceptance（将来）

```text
If Human Accepts naming + concrete ID（and optional SV）:
  → write Acceptance LOCKED doc（別 PR）
  → still NOT auto Implementation Start
Else:
  → remain HOLD
```
