# AssessmentSnapshot 完全契約 — 技術計画（AS-EC-1 Entry #8）

この文書は、**AS-EC-1 Entry #8** が要求する
TypeScript 型 / runtime validator / 合成 fixture / contract tests の
**技術計画正本**である。

Human Acceptance:
[`decision-as-ec-1-entry-8-technical-plan-acceptance.md`](./decision-as-ec-1-entry-8-technical-plan-acceptance.md)

```text
Kind: technical plan only
Status: Accepted as Entry #8 evidence（Option A）
Implementation Start: HOLD
Implementation auto-start: FORBIDDEN
```

## 1. 目的

AssessmentSnapshot 完全契約の **実装開始前**に、計画・責務・検証範囲だけを固定する。

本計画は実装許可ではない。

## 2. 計画対象

| 対象 | 計画上の位置づけ | 本段階 |
|---|---|---|
| TypeScript 型（完全契約面） | 実装前に型境界・必須面を計画する | 計画のみ |
| runtime validator | 型と対応する検証責務を計画する | 計画のみ |
| 合成 fixture | 正常系 / fail-closed 系の合成データを計画する | 計画のみ |
| contract tests | 契約遵守の検証範囲を計画する | 計画のみ |

既存の Result 変換（永続なし）は本計画の再実装対象ではない。

```text
UNCHANGED / DO NOT REOPEN here:
  assessment-snapshot-result-design.md
  assessment-snapshot-result-conversion.md
  toAssessmentSnapshotResultCandidate（PR #72）
```

## 3. 責務分割（計画）

| 層 | 責務（計画） | 今しないこと |
|---|---|---|
| docs / Decision | Entry Criteria・DEC-009・GOV-AUD 境界 | 実装 GO |
| domain | 将来の純関数・型・validator（別 Implementation Start） | 本 PR で追加しない |
| application | 保存・確定フロー（DEC-009 準拠、別 GO） | 本段階で作らない |
| adapter / SharePoint | 物理保存・DTO 写像（別 Gate） | NO-GO |

## 4. 検証範囲（計画）

実装開始時に含める検証（**今は計画のみ**）:

```text
1. 型面:
   - 完全契約に必要な論理フィールド境界
   - Result 変換出力との接続点（再発明しない）
2. runtime validator:
   - missing / malformed の fail-closed
   - DEC-009（下書き / 確定 / 版管理）と矛盾する状態を正常扱いにしない
3. 合成 fixture:
   - draft / finalized / corrected-new-version の最小合成例
   - 個人情報・実データを使わない
4. contract tests:
   - validator と fixture の契約対応
   - Result 変換純関数を壊さない回帰
```

明示的に本計画の検証範囲外:

```text
FindingCode 値一覧
A-5 representation strategy
SharePoint 列写像
実 tenant / real data
```

## 5. 依存する Accepted / HOLD

```text
Depends on / keep:
  DEC-009 Accepted / LOCKED / FINAL CONSISTENT
  GOV-AUD-03 Accepted / Option E
  Result conversion DONE（PR #72）
Still HOLD / OPEN for implementation:
  Implementation Start / PR-J / FindingCode / A-5
Decision-AS-EC-1 overall Entry satisfied: MET / Accepted（[`decision-as-ec-1-overall-entry-acceptance.md`](./decision-as-ec-1-overall-entry-acceptance.md)）
Entry #5 findingIds boundary: PASS / MET（NOT REQUIRED；完全 Finding 実装は別）
Entry #6 NOT_APPLICABLE reason: PASS / MET（HOLD方針；値一覧不採択）
Entry #7 Schema / DTO versioning: PASS / MET（DEC-1；固有 Schema ID 未採番）
Entry #2 ownership / PR-J: PASS / MET（境界のみ；実装は別 GO）
```

## 6. 実装開始条件（計画上のゲート）

```text
Implementation Start requires separate Human GO after:
  - Decision-AS-EC-1 overall Entry Criteria = MET / Accepted（done）
  - explicit Implementation Start Decision
MUST NOT start from overall MET / Entry #8 Acceptance alone
```

## 7. Explicit non-goals（本段階）

```text
TypeScript型の実装: DO NOT START
validator実装: DO NOT START
fixture実装: DO NOT START
contract tests実装: DO NOT START
SharePoint / DTO 実装: DO NOT START
FindingCode: HOLD
A-5: HOLD
Implementation Start: HOLD
src/** / tests/**: unchanged in this plan PR
```
