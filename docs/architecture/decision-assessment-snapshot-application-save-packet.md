# Decision-AS-APP-SAVE-1 — application save Decision packet（read-only compare）

この文書は、Thirteenth residual（SELECTED / A — application save）後の
**application 層 save candidate / 失敗結果境界の比較用 Human Decision Packet** である。

```text
repository: yasutakesougo/severe-behavior-support-spfx
baseline main: 9514128ee32322337126e2aadf532390f60a0552
Decision ID: Decision-AS-APP-SAVE-1
Kind: Human Decision packet（compare only）
Status: OPEN / NOT ACCEPTED
Depends on:
  decision-ilb-1-thirteenth-residual-application-save-selection.md（SELECTED / A）
  decision-dec-009-snapshot-save-timing-acceptance.md（LOCKED — 再 Decision しない）
  assessment-snapshot-save-timing-contract.md
  assessment-snapshot-complete-contract.md（PR-J domain）
  decision-assessment-snapshot-schema-id-value-naming-acceptance.md
  decision-assessment-snapshot-schema-version-acceptance.md
Implementation Start: HOLD
Application save concrete design: HOLD / NOT DECIDED
Schema ID / schemaVersion / dtoVersion code assignment: HOLD / NOT STARTED
Schema / DTO / SharePoint / adapter: HOLD
FindingCode / A-5: HOLD
Post-retention deletion: OPEN / AUTO-START FORBIDDEN
Deploy / real data: NO-GO
value invention as Accepted without Human Decision: FORBIDDEN
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

## 1. 本 packet の問い

```text
Question 1 — Save candidate:
  application 層は何を save candidate として受け取るか。

Question 2 — Failure results:
  application 層はどの失敗結果を返すか（fail-closed）。
```

```text
本 packet に候補・Agent recommendation が書いてあっても Accepted にはならない。
採択は明示 Human Decision / Acceptance が必要。
```

## 2. 再 Decision しない前提（LOCKED）

| 項目 | 固定値 | 正本 |
|---|---|---|
| 作成途中 | 下書き扱い | DEC-009 |
| 正式記録 | 確定時に保存 | DEC-009 |
| 確定後修正 | 元保持＋新版 | DEC-009 |
| 確定済み上書き | NOT ADOPTED | DEC-009 |
| 履歴 | 保持 | DEC-009 |
| domain 完全契約 | `validateAssessmentSnapshot` 等 | PR-J |
| Schema ID 文字列 | `…assessment-snapshot.snapshot` | Decision-AS-SCHEMA-ID-1 |
| schemaVersion / dtoVersion | `1.0.0` / `1.0.0` | Decision-AS-SCHEMA-VERSION-1 |
| コード割当 | NOT STARTED | living sync |

```text
MUST NOT re-open in this packet:
  DEC-009 業務意味（下書き / 確定時保存 / 新版 / 上書き禁止 / 履歴）
  PR-J domain 型・validator の再定義
  Schema ID / SemVer 文字列の変更
```

DEC-009 → application 操作概念（参照のみ・再決定しない）:

| DEC-009 | application 操作概念 |
|---|---|
| 下書き | `draft` save |
| 確定時保存 | `finalize` |
| 元保持＋新版 | `correct-as-new-version` |
| 上書き NOT ADOPTED | overwrite 成功に倒さない |
| 履歴保持 | 旧版消去・置換しない |

## 3. Save candidate 候補（比較・未採択）

| ID | candidate | 意味 | 利点 | リスク |
|---|---|---|---|---|
| **SC-1** | validated `AssessmentSnapshot` + explicit intent（`draft` / `finalize` / `correct-as-new-version`） | domain `validateAssessmentSnapshot` ok 後のみ保存対象 | fail-closed と整合；domain 境界が明確 | intent の扱いを別途固定する必要 |
| **SC-2** | raw `unknown` + intent（save 内で validate） | 入口が一つ | application が domain 失敗と persistence 失敗を混同しやすい | |
| **SC-3** | UI/DTO 形を直接受け取る | 実装が早く見える | Schema/DTO HOLD と衝突；DEC-1 非同一視を崩しやすい | |
| **SC-HOLD** | 未決定のまま | 追加判断を遅延 | Entry が進まない | |
| **SC-X** | Human 明示 | Human 指定 | 未記載なら採択不可 | |

```text
NOT candidates:
  INDETERMINATE / SOURCE_UNAVAILABLE を Result へ倒した候補
  FindingCode 必須化を前提にした候補
  SharePoint List item 形を save candidate と同一視
```

## 4. Failure results 候補（比較・未採択）

| ID | 失敗結果の形 | 意味 | 利点 | リスク |
|---|---|---|---|---|
| **FR-1** | 判別可能な fail-closed 結果（例: `VALIDATION_FAILED` / `PERSISTENCE_UNAVAILABLE` / `OVERWRITE_FORBIDDEN` / `MALFORMED_INTENT`） | 失敗種別を成功に倒さない | 監査・テストしやすい | 結果集合の固定が別 Acceptance になる |
| **FR-2** | throw / exception のみ | 実装が薄い | 契約テストしづらい；成功黙殺と区別しにくい | |
| **FR-3** | boolean / 無言失敗 | 最短 | fail-closed と衝突しやすい | |
| **FR-HOLD** | 未決定のまま | 遅延可 | Entry #7 相当が進まない | |
| **FR-X** | Human 明示集合 | Human 指定 | 未記載なら採択不可 | |

失敗時に **やってはいけないこと**（比較前提・LOCKED 志向）:

```text
MUST NOT:
  validate 失敗を保存成功として扱う
  persistence 失敗 / port 未実装を成功レスポンスや黙殺にする
  finalized 上書き要求を成功に倒す / 旧版を消す
  draft を formal finalized と同一表示する
  domain 禁止 Result を application で迂回する
```

## 5. Agent recommendation（NOT Acceptance）

```text
Agent recommendation:
  Save candidate: SC-1
  Failure results: FR-1

Rationale（比較用）:
  PR-J domain validator を前提に、validated snapshot + intent のみを candidate にする
  失敗は判別可能な fail-closed 結果で返し、成功へ倒さない

This is NOT Human Acceptance evidence.
Human must explicitly Accept SC-* and FR-*（組み合わせ可）.
```

## 6. 判断単位の分離

| 決める / 決めない | 本 packet |
|---|---|
| Save candidate 境界（SC-*） | **比較対象** |
| Failure results 境界（FR-*） | **比較対象** |
| DEC-009 業務意味 | OUT（LOCKED） |
| persistence port 実装 / SharePoint adapter | OUT |
| Schema / DTO コード割当 | OUT |
| application コード実装 | OUT |
| FindingCode / A-5 | OUT |
| post-retention deletion | OUT |
| Implementation Start | HOLD |

## 7. Human Decision（未選択）

Human は次を明示する（未記載は NOT DECIDED）。

```text
Save candidate:   SC-1 / SC-2 / SC-3 / SC-HOLD / SC-X:<text>
Failure results:  FR-1 / FR-2 / FR-3 / FR-HOLD / FR-X:<text>
```

```text
Until explicit Human Acceptance:
  Application save concrete design: HOLD / NOT DECIDED
  Implementation Start: HOLD
  TypeScript / application / adapter: DO NOT START
  Schema ID / schemaVersion / dtoVersion code assignment: DO NOT START
  Schema / DTO / SharePoint: HOLD
  FindingCode / A-5: HOLD
  Post-retention deletion: OPEN / AUTO-START FORBIDDEN
```

## 8. Explicit prohibitions

```text
Do NOT:
  treat this compare packet as Acceptance
  re-decide DEC-009
  lock SC-* / FR-* by Agent recommendation alone
  start application / persistence / SharePoint / DTO code
  assign schemaId / schemaVersion / dtoVersion into TypeScript
  reopen FindingCode / A-5
  auto-start post-retention deletion
```

## 9. Next after Human Acceptance（将来）

```text
If Human Accepts SC-* + FR-*:
  → write Acceptance LOCKED doc（別手順）
  → still NOT auto Implementation Start
  → SharePoint / DTO / Schema code assignment remain separate
Else:
  → remain HOLD
```
