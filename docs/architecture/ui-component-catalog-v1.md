# UI Component Catalog v1

```text
Program: UI-AGENT-SYSTEM-V1
Unit: UI-AGENT-IMPL-2 — Component Catalog v1 + verify hook
Status: SELECTED / LOCKED（docs + verify；this PR）
Authority:
  docs/architecture/ui-agent-system-v1-design-issue-body.md
  docs/architecture/dads-application-style-guide-v1.md
  docs/architecture/dads-05-shared-ui-primitives.md
  docs/architecture/contracts-v1.md
IMPL-1: #425 MERGED（design-context / design-review）
GitHub tracking Issue: 未採番
Kind: Product UI Contract — Component Usage Rule
Storybook / Chromatic / Tokens Studio / Figma MCP / ESLint rules / Deploy: NOT AUTHORIZED
```

## 1. Purpose

本 Catalog は、業務意味を UI でどう表現するかの **Component Usage Rule 正本** である。

```text
Domain / Contracts          ← 何を意味するか
Visual Principles（DADS-03） ← どう見えるか・操作するか（原則）
Component Catalog（本文書）  ← どの component で表現するか
Screen Patterns             ← どの screen 骨格か（IMPL-4）
```

Storybook を新 SSOT にしない。必要なら後続で Catalog の実行可能ビューアにする。

Token 同期（Figma Variables → Style Dictionary）より、次の意味チャネルを先に固定する。

| 意味 | 混同してはいけない相手 |
|---|---|
| 要確認 | 未記録 |
| `save_failed` | `save_outcome_unknown` |
| CurrentProcedure | historical procedure / past plan version |
| 現場職員入口 | 計画担当者入口 |
| 支援計画 | 支援手順 |
| EmptyNotice（zero-result） | StatusPanelFamily（fail-closed） |

## 2. Registry（verify hook）

`scripts/verify-ui-catalog.mjs` が本表と各 entry の `catalog-meta` を検査する。

| catalog-id | status | meaning |
|---|---|---|
| StatusBadge | EXISTS | status vocabulary の label channel |
| EmptyNotice | EXISTS | zero-result ≠ failure ≠ all-clear |
| SaveStateNotice | EXISTS | save 5-state の UI 表現（契約名。実装は SaveStatePresentation） |
| UserSummary | PATTERN | 利用者サマリ。共有 primitive 未抽出 |
| ProcedureSummary | PATTERN | current vs historical procedure。共有 primitive 未抽出 |
| StatusPanelFamily | KEEP | fail-closed パネル。EmptyNotice で置換しない |

status:

```text
EXISTS  — 共有実装があり、Catalog 名で参照する
PATTERN — 画面内実装。抽出は後続。意味規則は本 entry が正
KEEP    — 既存実装を維持。Catalog は分離規則のみ固定
GAP     — 意味は必要だが実装がない（本 v1 では使わない）
```

## 3. How agents use this catalog

- `design-context`: 対象 UI を既存 entry で表現できるか判定する。無いなら GAP / HOLD。新 primitive を推測で増やさない
- `design-review`: 差分が forbidden substitutions に当たるかを監査する
- Catalog 不在 entry を FAIL にしない。P2 または HOLD
- Domain 意味変更が必要なら **別 Decision**。Catalog は表示規則のみ

## 4. Entries

### StatusBadge

```catalog-meta
id: StatusBadge
status: EXISTS
path: spfx/src/shell/primitives/StatusBadge.tsx
```

#### Domain meaning

業務 status の **label text が意味チャネル**。色・形は補助。`recordStatus` を color token に埋め込まない。

正本語彙（presentation labels）: `spfx/src/shell/ux/status-labels.ts`

- 要確認 = `SHELL_STATUS_LABEL_NEEDS_REVIEW`
- 未記録 = `SHELL_STATUS_LABEL_UNRECORDED`
- 期限接近 = `SHELL_STATUS_LABEL_DUE_SOON`

要確認 ≠ 未記録。廃止一次ラベル（確認待ち / 確認対象 / 期限間近）を primary に復活させない。

#### Allowed props / states

- `label` 必須（空文字禁止）
- `shape`: `square` | `soft` | `pill`（INV-13 ACCEPTED ADAPT）
- `statusId` は presentation id。Domain `recordStatus` ではない

#### Forbidden substitutions

- color-only status（背景色だけで要確認/未記録を示す）
- `EmptyNotice` や `StatusPanel` で status badge を代替する
- 要確認 と 未記録 を同一 badge に丸める

#### Required a11y channel

- 可視テキスト `label`
- Gate: `A11Y-SC-01`、Review 面 `A11Y-INV-13-RV`

#### Good examples

- Users list 行の状態バッジに「要確認」「未記録」を **別 label** で出す
- CurrentProcedure の occurrenceStatus を `StatusBadge` の label で出す

#### Bad examples

- 赤丸だけ置いて「要確認」と読む
- 「未記録」filter 件数を「要確認」KPI と同一集合として見せる

#### Related smoke / a11y gate IDs

- `A11Y-SC-01` / `A11Y-INV-13-RV`
- Users / Review DEMO-UX smokes（`data-demo-ux` status badges）

#### Adoption surfaces

- UsersList / DailyRecords / ReviewDueState / CurrentProcedure

---

### EmptyNotice

```catalog-meta
id: EmptyNotice
status: EXISTS
path: spfx/src/shell/primitives/EmptyNotice.tsx
```

#### Domain meaning

**zero-result / 該当なし** の案内。取得失敗・権限拒否・全クリア成功ではない。

INV-17: empty filter ≠ fail-closed StatusPanel ≠ partial retrieval ≠ all-clear。

#### Allowed props / states

- `children` 必須
- `announce` 既定 true → `role="status"` + `aria-live="polite"`
- 図示 EmptyState は非必須

#### Forbidden substitutions

- `StatusPanel`（access_denied / retrieval_failed）の代替に EmptyNotice を使う
- 保存失敗 / `save_outcome_unknown` を EmptyNotice で表す
- 空の画面を「問題なし」に丸める

#### Required a11y channel

- 動的 zero-result は live/status（`A11Y-LIVE-01`）
- Users / Records / Review empty: `A11Y-INV-17` / `A11Y-INV-17-RC` / `A11Y-INV-17-RV`

#### Good examples

- Users filter 0 件で EmptyNotice announce
- DailyRecords incomplete/recent 空リストで EmptyNotice

#### Bad examples

- access_denied を EmptyNotice「表示する項目がありません」にする
- color-only の空カード

#### Related smoke / a11y gate IDs

- `A11Y-LIVE-01` / `A11Y-INV-17` / `A11Y-INV-17-RC` / `A11Y-INV-17-RV`

#### Adoption surfaces

- UsersList / DailyRecords / ReviewDueState

---

### SaveStateNotice

```catalog-meta
id: SaveStateNotice
status: EXISTS
path: spfx/src/shell/ux/SaveStatePresentation.tsx
path: spfx/src/shell/ux/SaveStateBadge.tsx
path: spfx/src/shell/ux/save-state.ts
```

#### Domain meaning

Product UI Contract 名は **SaveStateNotice**。実装は既存 `SaveStatePresentation` + `SaveStateBadge` + `SHELL_SAVE_STATES`。

5-state 語彙（非丸め）:

```text
unsaved              未保存
saving               保存中
saved                保存済み
save_failed          保存失敗
save_outcome_unknown 保存結果不明
```

`save_failed` ≠ `save_outcome_unknown` ≠ `saved`。未知語彙を invent しない。

Domain persist の `save_failed` / `save_outcome_unknown` と同じ語彙を UI が勝手に縮退しない。

#### Allowed props / states

- `state: ShellSaveState` のみ
- QUIET = saved / unsaved
- EMPHASIZED = saving / save_failed / save_outcome_unknown
- `save_failed` / `save_outcome_unknown` は `aria-live="assertive"`

#### Forbidden substitutions

- 不明を失敗または成功に丸める
- 5-state 外の「エラー」「OK」だけにする
- EmptyNotice / StatusBadge だけで save 5-state を代替する（Users 行 overlay は session 投影であり chrome SaveStateNotice を消さない）

#### Required a11y channel

- 可視 label（`labelForShellSaveState`）
- EMPHASIZED 時は description 可視
- fail / unknown は assertive live

#### Good examples

- Shell header の `SaveStatePresentation`
- Users 行 overlay が `save_outcome_unknown` を「保存結果不明」のまま出す

#### Bad examples

- `save_outcome_unknown` を「保存失敗」に置換
- saving を saved と同じ静かな badge にする

#### Related smoke / a11y gate IDs

- SHELL-UX / DEMO-UX-12 / DEMO-UX-14 save-state tests
- `spfx/src/shell/ux/save-state.test.ts`

#### Adoption surfaces

- AppShellChrome header
- UsersList session overlay（投影。語彙は同一）

---

### UserSummary

```catalog-meta
id: UserSummary
status: PATTERN
path: spfx/src/shell/users/UsersList.tsx
path: spfx/src/shell/users/UserDetail.tsx
```

#### Domain meaning

利用者の **識別サマリ**（合成 `personLabel` + 状態チャネル）。氏名・生年月日等の個人属性を Domain `UserId` に載せない（`contracts-v1.md`）。

現場職員入口（Users list / 次の未記録）と計画担当者入口（Support Plan / Planning PC）で、同じ UserId でも **画面の強調は role で変えてよい。status 語彙は変えない**。

#### Allowed props / states

- `personLabel`（合成表示名）
- status は `StatusBadge` label channel
- session save overlay は SaveStateNotice 語彙に従う
- UserDetail の section 順は `presentationRole`（FIELD_STAFF vs 計画/監査）

#### Forbidden substitutions

- UserId を氏名として表示する
- 現場職員向け「未記録」を計画画面の「要確認」に読み替える
- 個人情報実データを fixture に足す

#### Required a11y channel

- 行 / 見出しの可視 `personLabel`
- 状態リスト `aria-label="{personLabel}の状態"`
- session overlay は独自 aria-label（未記録と混同しない）

#### Good examples

- UsersList 行: personLabel + StatusBadge 群
- UserDetail h1: personLabel。支援計画 CTA は別ボタン

#### Bad examples

- 色だけで「この人は要確認」
- 次の未記録 CTA を要確認 KPI の母集団と同一視する

#### Related smoke / a11y gate IDs

- DEMO-UX Users smokes / `users.test.ts`
- `A11Y-INV-17`（filter empty）

#### Adoption surfaces

- UsersList / UserDetail / Overview attention rows（personLabel PATTERN。共有 primitive 抽出は後続）

---

### ProcedureSummary

```catalog-meta
id: ProcedureSummary
status: PATTERN
path: spfx/src/shell/procedure/CurrentProcedure.tsx
path: spfx/src/shell/users/SupportPlan.tsx
```

#### Domain meaning

支援手順の要約。**CurrentProcedure**（いま実施する手順）と historical procedure / past plan version を混ぜない。

支援計画（SupportPlan / SupportPlanVersion）≠ 支援手順（ProcedureId + ProcedureVersion）。計画画面に手順要約を出してよいが、計画そのものにしない。

FIELD-WORKFLOW 投影:

```text
場面 → 実施する支援 → 避ける対応 → 必要な補足
```

#### Allowed props / states

- current: `CurrentProcedure`（`data-field-workflow="current-procedure"`）
- plan graph: `currentProcedures`（`SupportPlanCurrentProcedureSummary`）
- historical records: `recentProcedureRecords`（結果ラベル。current と別 heading）
- past versions: `versions`（readonly note。current と別 heading）

#### Forbidden substitutions

- historical record を CurrentProcedure として CTA する
- past version を current plan に黙って差し替える
- 手順本文を計画 status「要確認」と同一 badge にする
- 現場の「この手順を記録」を計画担当の計画編集と同一入口にする

#### Required a11y channel

- CurrentProcedure 単一 h1 + 支援の流れ h2
- SupportPlan は current procedures と recent records と versions を別 section heading

#### Good examples

- CurrentProcedure に scene / perform / avoid
- SupportPlan で current procedures と historical records を別リスト

#### Bad examples

- 過去記録の result を current 手順の実施内容として出す
- procedure なしを EmptyNotice「取得失敗」にする（fail-closed は StatusPanel）

#### Related smoke / a11y gate IDs

- FIELD-WORKFLOW current-procedure smoke hooks
- PLANNING-PC-DEMO current-procedures / recent-records / version-list
- SupportPlan A11Y-HD-07 / A11Y-SP-01

#### Adoption surfaces

- CurrentProcedure / SupportPlan / UserDetail「現在の支援」（要約。手順画面へ handoff）

---

### StatusPanelFamily

```catalog-meta
id: StatusPanelFamily
status: KEEP
path: spfx/src/shell/ux/StatusPanel.tsx
```

#### Domain meaning

fail-closed の **画面成立条件** パネル。loading / access_denied / retrieval_failed。未確認情報を確定値にしない。

EmptyNotice（zero-result）でも SaveStateNotice（save 5-state）でもない。

INV-15 / INV-16 / INV-24 KEEP。

#### Allowed props / states

- `mode: ShellViewMode`（ready / loading / access_denied / retrieval_failed / …）
- access_denied / retrieval_failed → `role="alert"`
- loading → `role="status"`
- 個人情報を出さない

#### Forbidden substitutions

- EmptyNotice で access_denied を表す
- StatusBadge 色だけで access_denied を表す
- retrieval_failed を empty / all-clear に丸める
- unselected / access_denied を ready に落とす

#### Required a11y channel

- alert or status に応じた role
- タイトル + 本文のテキスト意味チャネル

#### Good examples

- 取得失敗パネル「判定していない状態として扱います」
- アクセス不可「個人情報は表示していません」

#### Bad examples

- 「該当する利用者がいません」で権限エラーを表す
- 失敗を saved に見せる

#### Related smoke / a11y gate IDs

- SHELL-UX fail-closed smokes
- DADS-05 StatusPanel family KEEP（`primitives/disposition.ts`）

#### Adoption surfaces

- AppShellChrome（host-level）
- 個別 screen の empty には使わない

## 5. Explicit OUT

```text
新 React primitive の抽出（UserSummary / ProcedureSummary の CONSOLIDATE は後続）
Storybook / Chromatic
Screen template / generator（IMPL-4）
Figma MCP / Token 同期
Domain / Contracts / SharePoint 意味変更
Deploy / Visual Acceptance / #299 Close
```

## 6. Verification

```text
npm run verify:ui-catalog
npm run lint:ui-sem
```

UI-SEM-01..05 の正本は `docs/architecture/ui-agent-impl-3-eslint-ui-sem.md`。Catalog は component usage SSOT、ESLint は forbidden substitution の決定論ゲート。
