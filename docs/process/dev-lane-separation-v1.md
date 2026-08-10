# Development Lane Separation v1 — LANE-SEP-V1

- 文書: `docs/process/dev-lane-separation-v1.md`
- Unit: **LANE-SEP-V1**（AUTO-1 と同時に記録する sequencing 制約）
- 位置づけ: **法人アプリ本体 lane** と **AI Development OS lane** の分離規則
- 状態: **rule = ACCEPTED（Human directive / 2026-08-10）** / **本文書の encoding = CANDIDATE**
- Authorization effect: **NONE**
- 上位正本（緩和・上書きしない）:
  - `docs/decisions/DEC-AI-ORG-003.md`
  - `docs/decisions/DEC-AA-001.md`
  - `docs/decisions/DEC-AA-003.md`
  - `docs/process/routine-aug-v1.md`
  - `docs/process/process-optimization-v1.md`
  - `docs/process/low-auto-pilot-v1.md`
- 関連:
  - AUTO-1 candidate policy: [`autonomy-policy-v1.md`](./autonomy-policy-v1.md)
  - Selection: [`../architecture/decision-auto-1-autonomy-policy-v1-selection.md`](../architecture/decision-auto-1-autonomy-policy-v1-selection.md)

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](./self-referential-gate-policy.md)）。

## Human directive（固定結論）

```text
Human directive（2026-08-10）:
2 本の lane を分ける。
AUTO-1 を始めても、法人アプリ本体 lane の残 Decision を飛ばしてはならない。
```

```text
rule: ACCEPTED（Human directive）
this document's L-1〜L-6 encoding: CANDIDATE（Human Acceptance 待ち / packet AP1-LANE-1）
Authorization effect: NONE
```

## Lane 定義

```text
LANE-APP  — 法人アプリ本体
            AssessmentSnapshot adapter / SharePoint mapping / domain / DTO
            目的: アプリ本体を完成させる

LANE-DEVOS — AI Development OS
            AUTONOMY-POLICY → Capability Registry → Action Gateway → execution backend
            目的: 開発方法を強制可能にする
```

```text
LANE-APP   = 「何を作るか」の lane
LANE-DEVOS = 「どう作るか」の lane
片方の進行は他方の gate を満たさない
```

## 分離規則（L-1〜L-6）

| # | Rule |
|---|---|
| L-1 | LANE-DEVOS unit の Accepted / PASS は、LANE-APP のいかなる gate も満たさない |
| L-2 | LANE-APP の Accepted 順序を LANE-DEVOS の進行で飛ばさない・並び替えない |
| L-3 | Human GO は lane・unit・版に拘束される。lane を越えて流用しない。完了時に consumed |
| L-4 | LANE-DEVOS は LANE-APP の HIGH capability（SharePoint schema / permission / real data / Deploy）を取得する経路を作らない |
| L-5 | 一方の lane の HOLD は、他方の docs-only 進行の停止理由にしない。逆に、他方の進行は Human Decision を代替しない |
| L-6 | lane 識別子が不明な作業は `UNKNOWN → HOLD`。lane を推測で割り当てない |

```text
LANE-DEVOS progress ≠ LANE-APP progress
LANE-DEVOS Accepted ≠ LANE-APP Implementation Start
LANE-APP HOLD ≠ LANE-DEVOS docs-only unit blocked
```

## LANE-APP の repository-anchored open items（本文書では判定しない）

次は既存 Accepted 正本に記録済みの残件であり、本文書は状態を変更しない。

| Item | 現在の記録 | 正本 |
|---|---|---|
| MAP-AS-010 physical column | NOT PRESENT | [`../architecture/decision-assessment-snapshot-map010-column-acceptance.md`](../architecture/decision-assessment-snapshot-map010-column-acceptance.md) |
| MAP-AS-010 VR-1 | NOT RUN | 同上 |
| mapping-complete | NOT YET | [`../architecture/assessment-snapshot-sharepoint-mapping.md`](../architecture/assessment-snapshot-sharepoint-mapping.md) |
| P2-002（SharePoint clear/omit transport API） | OPEN / CARRY-FORWARD | [`../architecture/decision-assessment-snapshot-map010-column-acceptance.md`](../architecture/decision-assessment-snapshot-map010-column-acceptance.md) |
| adapter Implementation Start | HOLD | 同上 |
| AS-EC-1 overall Entry Criteria | MET / Accepted（≠ Implementation Start） | [`../architecture/decision-as-ec-1-overall-entry-acceptance.md`](../architecture/decision-as-ec-1-overall-entry-acceptance.md) |

## `EC-3` / `EC-4` — UNRESOLVED_REFERENCE

Human directive は LANE-APP の待ち Decision を `EC-3` / `EC-4` と呼んでいる。

```text
repository 内に EC-3 / EC-4 という Decision ID は存在しない
既存の Entry Criteria 系 ID は Decision-AS-EC-1 entry #1〜#8（すべて個別に閉鎖済み）
```

したがって:

```text
EC-3 / EC-4: UNRESOLVED_REFERENCE
binding: UNKNOWN
Agent による推測束縛: FORBIDDEN
```

| 扱い | 値 |
|---|---|
| Agent が `EC-3` / `EC-4` を既存 ID へ写像する | **FORBIDDEN** |
| Agent が `EC-3` / `EC-4` を「充足済み」と扱う | **FORBIDDEN** |
| Agent が `EC-3` / `EC-4` を「存在しない」と扱う | **FORBIDDEN** |
| 解消方法 | Human が対象 Decision を明示するまで `UNKNOWN` として保持 |

`EC-3` / `EC-4` の binding が未解消であっても、L-2 は上表の
repository-anchored open items に対して有効である。

```text
UNRESOLVED_REFERENCE ≠ no constraint
UNRESOLVED_REFERENCE → 該当 lane の推測進行は FORBIDDEN
```

## 本文書が承認しないこと

```text
LANE-APP の Implementation Start
SharePoint column create / VR-1 / mapping-complete 判定
adapter / DTO / schema wiring
AUTO-1 の Human Acceptance
Action Gateway の実装 / 有効化
permission expansion
Ready / Merge
```

## OPEN

```text
LANE-P2-1: OPEN — EC-3 / EC-4 の repository binding 未解消（UNRESOLVED_REFERENCE）
LANE-P2-2: OPEN — L-1〜L-6 encoding は Human Acceptance 待ち（packet AP1-LANE-1）
```

## 次工程（Human only）

1. AUTO-1 candidate policy と本 encoding の Human Acceptance（別 Decision）
2. `EC-3` / `EC-4` の対象 Decision 明示（Human only）
3. LANE-APP の次 gate（SharePoint column create GO / VR-1）は別 Human Decision
