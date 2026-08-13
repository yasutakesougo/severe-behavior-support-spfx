# DEMO-UX-13 — 一覧詳細プレビュー拡張 Selection（DUX7-P2-1）

```text
Issue: #299（RESPONSIBLE-PERSON-DEMO-V1）
Unit: DEMO-UX-13 — Users list detail-preview expansion
Decision: Decision-DEMO-UX-13-DETAIL-PREVIEW-EXPANSION-1
Status: SELECTED / LOCKED
Human Selection: GO（2026-08-13）
Baseline main: 59c4a89b6378f6c9219fe351bfbdb795e11f65fb
Predecessor: DEMO-UX-12 MERGED（PR #326 / ea12849）+ closeout sync MERGED（PR #327 / 59c4a89）
Source finding: DUX7-P2-1（DEMO-UX-7 Fresh Review P2）
Follow-on queue（not this slice）: RPF-007
Implementation Start: NOT AUTHORIZED
Ready / Merge: NOT AUTHORIZED
#299 Close: NOT AUTHORIZED
Production deploy: NOT AUTHORIZED
SharePoint write: NOT AUTHORIZED
```

## Authority

Human は DEMO-UX-12 closeout（PR #327）Merge SUCCESS を確認し、次として **DUX7-P2-1 Selection** を進める方針を示した。

本 Selection は **DUX7-P2-1 のみ** を SELECTED / LOCKED とする。

```text
DEMO-UX-13 Implementation Start = NOT AUTHORIZED（separate Human GO）
RPF-007 Implementation = NOT AUTHORIZED
Deploy / SharePoint write / #299 Close = NOT AUTHORIZED
Ready / Merge = NOT AUTHORIZED
```

大規模ビジュアル刷新・全利用者分の詳細 fixture 新造は行わない。
**Users 一覧の詳細ボタン許可集合**を、既に存在する合成詳細 presentation に合わせて拡張する。

## Goal

```text
Users 一覧から、合成詳細 fixture がある利用者は詳細プレビューへ進める
  → 現状の A-only ハードコードをやめる
  → C（fixture 既存・Overview 今日やることから到達可）を一覧からも到達可能にする
  → fixture が無い行は disabled のまま（fail-closed）
  → live 詳細 / SharePoint / 保存は接続しない
```

## Selection-phase investigation（LOCKED findings）

### 1. Current enablement inventory

| ID | Surface / source | Behavior |
|---|---|---|
| DP-PROP | `UsersList` `detailPreviewUserId?: string` | 単一 ID のみ許可 |
| DP-GATE | `UsersList` row button | `row.id === detailPreviewUserId` のときだけ enabled |
| DP-WIRE | `AppShellChrome` | `detailPreviewUserId={userDetailPresentation.userId}` → **常に A（user-a）** |
| DP-MAP | `AppShellChrome` `userDetailById` | A fixture + `additionalUserDetailPresentations`（default **C**）を保持 |
| DP-REQ | `handleUserDetailRequest` | map にある ID なら詳細を開ける（一覧ゲートとは別） |
| DP-OV-C | Overview today-action C「見る」 | `user_detail` / `user-c` → Users 詳細へ到達可 |
| DP-NOTE | `DEMO_USERS_DETAIL_DISABLED_NOTE` | 「Aさんのみ…詳細プレビュー」 |
| DP-SP | Support plan preview | `supportPlanPresentation.userId === selectedUserDetail.userId`（A のみ） |

### 2. Fixture coverage（synthetic detail）

| userId | List row | Detail fixture | List button today | Other path |
|---|---|---|---|---|
| user-a | yes | `DEMO_UX_USER_DETAIL_FIXTURE` | **enabled** | — |
| user-b | yes | none | disabled | — |
| user-c | yes | `DEMO_UX_USER_DETAIL_C_FIXTURE` | **disabled** | Overview today-action |
| user-d..h | yes | none | disabled | — |

### 3. Problem（DUX7-P2-1）

```text
observation:
  Users list detail-preview enablement remains A-only.
  C detail already exists and is reachable from Overview today-action,
  but the Users list「詳細を見る」for C stays disabled.

requestedOutcome:
  Expand list detail-preview enablement beyond A-only,
  without inventing live user-detail navigation or SharePoint connection.
```

### 4. Options considered

| ID | Approach | Result |
|---|---|---|
| **A** | Enable list preview for **every userId that has a registered synthetic detail presentation**（現在 A+C） | **SELECTED** |
| B | Enable C only via second hard-coded id | NOT SELECTED（A-only と同型のハードコードが残る） |
| C | Create detail fixtures for all 8 users and enable all | NOT SELECTED（scope 過大；本 slice OUT） |
| D | Enable all list buttons even without fixtures | NOT SELECTED（空詳細 / 誤認；fail-closed 違反） |
| E | HOLD / leave A-only | NOT SELECTED（Human Selection GO） |

### 5. Canonical enablement rule（LOCKED）

```text
Users list「詳細を見る」is enabled
  IFF
    onUserDetailRequest is provided
    AND a synthetic ShellUserDetailPresentation exists for that row.id
       in the shell userDetailById map（primary + additional fixtures）

Otherwise the button stays disabled.
No fixture ⇒ no preview（fail-closed）.
```

Implementation は単一 `detailPreviewUserId` をやめて、
`detailPreviewUserIds`（readonly set/array）または map 由来の許可集合を渡す形にしてよい。
**規則（fixture がある ID のみ）は変更不可。**

### 6. Keep / change matrix（LOCKED）

| Item | Action | Rationale |
|---|---|---|
| A list → detail | **KEEP enabled** | 既存 DEMO-UX-3 |
| C list → detail | **ENABLE** | fixture 既存；Overview との非対称を解消 |
| B / D–H list → detail | **KEEP disabled** | fixture なし；本 slice で新造しない |
| Overview C today-action | **KEEP** | DEMO-UX-7 導線非回帰 |
| `handleUserDetailRequest` map guard | **KEEP** | 未知 ID を開かない |
| Support plan from detail | **KEEP A-only** | support-plan fixture は A；本 slice OUT |
| Detail content shape（currentSupport first 等） | **KEEP** | DEMO-UX-3 受入 |
| DemoBanner / no-live / no-save | **KEEP** | 安全境界 |
| `DEMO_USERS_DETAIL_DISABLED_NOTE` | **UPDATE** | 「Aさんのみ」→ fixture 保有者のみ、の境界説明に更新 |

**Note copy 方針（LOCKED）**

```text
必須意味:
  - 合成データ内の詳細プレビューである
  - 業務データの詳細画面には接続されていない
  - 一覧から開けるのは詳細 fixture がある利用者に限る

禁止:
  - 「全員の詳細が見られます」「業務詳細に接続」系
```

文言の最終形は Implementation で固定してよい。

### 7. Explicit non-changes（safety meaning）

```text
live user detail / SharePoint user list = forbidden
enabling detail without fixture = forbidden
support-plan mutation / record mutation = forbidden
creating full 8-user detail catalog in this slice = OUT
changing DEMO-UX-7/8/9/10/11/12 semantics = forbidden
save_outcome_unknown normalization = forbidden
unselected / access_denied relaxation = forbidden
```

## Selected scope（IN）

### DUX7-P2-1 — 一覧詳細プレビュー拡張

1. Users 一覧の詳細ボタン許可を **canonical rule（fixture 保有 ID）** に合わせる
2. 既定 fixture 集合（A + C）では **C の一覧詳細ボタンを enabled** にする
3. fixture の無い行は disabled のまま
4. 詳細境界注記を A-only 表現から更新する（合成・未接続は維持）
5. Overview → C 詳細の today-action を壊さない
6. unit / browser smoke で A・C enabled、B disabled、C 一覧→詳細、境界注記、fail-closed を確認する

## Exact OUT

```text
new detail fixtures for user-b / d / e / f / g / h = OUT（this slice）
support-plan preview expansion beyond A = OUT
live I/O / SharePoint write / user directory = OUT
save / autosave / persisted draft = OUT
RPF-007 保存中進行表示 = OUT
large visual redesign = OUT
business-rule / GOV-RULE changes = OUT
Deploy = OUT
#299 Close = OUT
Implementation Start / Ready / Merge auto-advance = OUT
```

## Must preserve（non-negotiable）

- DEMO / synthetic / no live SharePoint（DemoBanner）
- 詳細は presentation-only（live 詳細ナビ禁止）
- fail-closed: `access_denied` / `retrieval_failed` / `unselected`
- `save_outcome_unknown` 非丸め
- DEMO-UX-7 today-actions（A→記録 / B→見直し / C→詳細）
- DEMO-UX-8 users filters（件数・セマンティクス）
- DEMO-UX-9 daily-record experience
- DEMO-UX-10 Family R / Family A
- DEMO-UX-11 note consolidation
- DEMO-UX-12 save badge hierarchy

## Acceptance criteria

Implementation Start 後の受入は次をすべて満たすこと。

1. **Canonical enablement**
   詳細 fixture がある利用者（少なくとも A と C）の一覧「詳細を見る」が enabled。

2. **Fail-closed rows**
   fixture が無い利用者（少なくとも B）の一覧詳細ボタンは disabled のまま。

3. **C list path**
   Users 一覧から C 詳細プレビューへ到達でき、Overview today-action 経路も維持される。

4. **Boundary copy**
   A-only 固定の誤った説明をやめ、合成詳細・業務未接続の境界が読める。

5. **No live / no-save**
   詳細拡張後も live 詳細・保存・SharePoint 接続を主張しない。

6. **Prior UX non-regression**
   DEMO-UX-7〜12 の受入意味を壊さない。

7. **検証**
   unit および browser smoke で A/C enabled・B disabled・C 詳細表示・安全境界を確認する。

## Gate separation

```text
Selection GO ≠ Implementation Start GO
Selection GO ≠ Verification GO
Selection GO ≠ Ready GO
Selection GO ≠ Merge GO
Selection GO ≠ #299 Close GO
```

次の Human gate は **DEMO-UX-13 Implementation Start GO** のみ。

## Evidence referenced

```text
finding:
  docs/architecture/demo-ux-7-fresh-review.md（DUX7-P2-1）
predecessor merges:
  PR #326 / ea12849f9b21b9a465b53c0e915167483ba83ad4
  PR #327 / 59c4a89b6378f6c9219fe351bfbdb795e11f65fb
  expected tip 76ee13413de03311ca4e5b45b77c8d46ea1b5f62（ancestor）
code:
  spfx/src/shell/users/UsersList.tsx
  spfx/src/shell/ux/AppShellChrome.tsx
  spfx/src/shell/users/user-detail-fixture.ts
  spfx/src/shell/users/users-copy.ts（DEMO_USERS_DETAIL_DISABLED_NOTE）
  spfx/src/shell/users/users-fixture.ts
  spfx/src/shell/dashboard/overview-fixture.ts（C today-action）
```
