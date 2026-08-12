# DEMO-UX-8 — Users list status filter Selection（RPF-003）

```text
Issue: #299（RESPONSIBLE-PERSON-DEMO-V1）
Unit: DEMO-UX-8 — Users list status filter
Decision: Decision-DEMO-UX-8-USERS-LIST-STATUS-FILTER-1
Status: SELECTED / LOCKED
Human Selection: GO（2026-08-12）
Baseline main: 5655fc750ef9f4dfde37fdf12bf99b7e138d855e
Predecessor: DEMO-UX-7 MERGED（PR #320 / merge 5655fc7；tip 1d7e9a733e03b1f8bffead2353b2209bd423f3df）
Source feedback: RPF-003
Follow-on queue（not this slice）: RPF-002
Implementation Start: NOT AUTHORIZED
Ready / Merge: NOT AUTHORIZED
#299 Close: NOT AUTHORIZED
Production deploy: NOT AUTHORIZED
SharePoint write: NOT AUTHORIZED
```

## Authority

Human は DEMO-UX-7（RPF-Q01 + RPF-001）Merge SUCCESS を確認し、予定どおり次 slice を **RPF-003 Selection** とすると判断した。

本 Selection は **RPF-003 のみ** を SELECTED / LOCKED とする。

```text
RPF-003 Implementation Start = NOT AUTHORIZED
RPF-002 Implementation Start = NOT AUTHORIZED
Deploy / SharePoint write / #299 Close = NOT AUTHORIZED
```

大規模ビジュアルデザイン改善は本 slice では行わない。

## Goal

責任者・現場職員が、合成デモ上で次を実操作で説明できる状態へ進める。

```text
利用者一覧を開く
  → 状態チップ（要確認 / 未記録 / 期限接近）で絞り込む
  → 該当する利用者だけが一覧に残る
  → 「状態から人を探す」導線を説明できる
```

無効チップのまま「将来フィルタ予定」で止めない。保存や live 判定は入れない。

## Selected scope（IN）

### RPF-003 — 利用者一覧の状態フィルタを体験可能にする

Users list の状態チップを、**合成 fixture 上の client-side 絞り込み**として操作可能にする。

#### Chip set（terminology inherits DEMO-UX-7）

| Chip label（表示） | Internal match key（badge.id） | Role |
|---|---|---|
| `すべて` | —（clear filter） | default |
| `要確認` | `needs_review` | status filter |
| `未記録` | `unrecorded` | status filter |
| `期限接近` | `deadline_near` | status filter |

Canonical labels は DEMO-UX-7 正本を再利用する。本 Selection で用語を再決定しない。

#### Interaction rules（LOCKED）

```text
selectionMode = single（同時に有効な状態チップは 1 つ）
defaultChip = すべて
matchSemantics = ANY badge.id on the row equals selected key
matchSource = badge.id（表示ラベル文字列マッチではない）
dataScope = DEMO_UX_USERS_FIXTURE rows only
persistence = view-local（Users 画面を離れたら default に戻ってよい）
liveCalculation = forbidden
SharePoint / binder / adapter I/O = forbidden
```

#### Expected fixture outcomes（Selection acceptance anchors）

現行合成 fixture（8 rows）を前提にした説明用アンカー。Implementation で fixture を不用意に増やさない。

| Active chip | Matching rows（ids） | Count |
|---|---|---|
| すべて | user-a … user-h | 8 |
| 要確認 | user-a, user-c, user-f | 3 |
| 未記録 | user-a, user-e | 2 |
| 期限接近 | user-b, user-e, user-h | 3 |

多バッジ行（例: user-a = 未記録+要確認、user-e = 未記録+期限接近）は、選択キーを **いずれか1つでも持てば** 残す。

#### Presentation updates（IN）

- 選択中チップは selected / `aria-pressed` 等で視認できる
- フィルタ適用時の件数表示を更新する（例: `3名（要確認・合成データ）`）。文言の最終形は Implementation で固定してよいが、「全件のまま」は不可
- `絞り込みは表示専用のため操作できません。` 注記は除去または「合成データ内の絞り込み」へ置換する
- `filterHint` の「表示専用」表現を、操作可能であることに矛盾しない文言へ更新する
- `filterExecutionAuthorized`（本 slice flag）を true にする対象を Users list presentation に限定する

#### Empty / fail-closed

現行アンカーでは空集合にならない。もし空になった場合:

```text
空一覧を「事業所に利用者がいない」と主張しない
合成デモ内で該当なし、と明示する
access_denied / retrieval_failed / unselected を空成功へ丸めない
```

## Explicit OUT

```text
RPF-002 daily-record experience cleanup = OUT（next after this slice）
multi-select chips / AND combination = OUT
URL / query persistence of filter = OUT
live user directory / SharePoint list filter = OUT
GOV-RULE / due-window calculation changes = OUT
renaming internal id deadline_near → due_soon = OUT（DUX7-P2-2 deferred）
expanding list detail-preview beyond user-a = OUT（DUX7-P2-1 deferred）
record save / review mutation / SharePoint write = OUT
real user data = OUT
auth / Entra / role mutation = OUT
large visual redesign = OUT
Production deploy = OUT
#299 Close = OUT
Implementation Start / Ready / Merge auto-advance = OUT
```

## Must preserve（non-negotiable）

次は正常状態へ丸めない。本 slice でも維持する。

- `access_denied`
- `retrieval_failed`
- `save_outcome_unknown`
- `siteSelection=unselected` stop
- DEMO / synthetic / no live SharePoint 明示
- DEMO-UX-7 terminology canon（要確認 / 期限接近 / 未記録）

## Gate separation

```text
Selection GO ≠ Implementation Start GO
Selection GO ≠ Verification GO
Selection GO ≠ Ready GO
Selection GO ≠ Merge GO
Selection GO ≠ #299 Close GO
```

次の Human gate は `DEMO-UX-8 Implementation Start GO`（＝ RPF-003 Implementation Start）。

## Evidence referenced

```text
flow feedback record:
  docs/architecture/responsible-person-demo-v1-flow-review-feedback-record.md
four-perspective review:
  /opt/cursor/artifacts/human-ui-review-screenshots/four-perspective-review.md
predecessor merge:
  PR #320 / merge 5655fc750ef9f4dfde37fdf12bf99b7e138d855e
  expected tip 1d7e9a733e03b1f8bffead2353b2209bd423f3df
terminology canon:
  docs/architecture/decision-demo-ux-7-terminology-today-actions-selection.md
current disabled filter surface:
  spfx/src/shell/users/UsersList.tsx
  spfx/src/shell/users/users-fixture.ts
```
