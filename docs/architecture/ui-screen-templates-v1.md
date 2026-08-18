# UI Screen Templates v1

```text
Program: UI-AGENT-SYSTEM-V1
Unit: UI-AGENT-IMPL-4 — canonical screen templates
Status: SELECTED / LOCKED（docs + verify；this PR）
Authority:
  docs/architecture/ui-agent-system-v1-design-issue-body.md
  docs/architecture/ui-component-catalog-v1.md
  docs/architecture/dads-application-style-guide-v1.md
IMPL-1: #425 MERGED
IMPL-2: #426 MERGED
IMPL-3: #427 MERGED
GitHub tracking Issue: 未採番
Kind: Product UI Contract — Screen Patterns
generator / Plop / Storybook / Chromatic / Figma MCP / Deploy: NOT AUTHORIZED
```

## 1. Purpose

本 Templates は、新 screen の **骨格正本** である。

```text
Domain / Contracts          ← 何を意味するか
Visual Principles（DADS-03） ← どう見えるか・操作するか（原則）
Component Catalog           ← どの component で表現するか
Screen Templates（本文書）   ← どの screen 骨格か
```

```text
template = domain-neutral layout + catalog component slots + smoke hooks
generator / Plop = Later
```

Storybook を新 SSOT にしない。generator / Plop は Later。必要なら後続 generator は本 Templates を入力にする（新しい骨格正本を発明しない）。

既存 DADS-UX-* / Visual Polish / Support Plan / FIELD-WORKFLOW の画面を継承する。新 React layout の抽出はしない。

意味チャネルを壊す骨格は禁止する。

| 意味 | 混同してはいけない相手 |
|---|---|
| destination `h1` | host の shell-host-status |
| EmptyNotice（zero-result） | StatusPanelFamily（fail-closed） |
| 現場職員入口 | 計画担当者入口（navigation だけで暗黙にしない） |
| CurrentProcedure | historical procedure / past plan version |
| 支援計画 | 支援手順 |
| `save_failed` | `save_outcome_unknown` |
| 要確認 | 未記録 |

## 2. Registry（verify hook）

`scripts/verify-ui-templates.mjs` が本表と各 entry の `template-meta` を検査する。

| template-id | status | meaning |
|---|---|---|
| ShellHost | EXISTS | fail-closed / nav / save chrome。destination `h1` を汚染しない |
| DestinationOverview | EXISTS | 概要ボード。role は強調順のみ。destination は変えない |
| DestinationList | EXISTS | 一覧。zero-result は EmptyNotice。行の意味は StatusBadge label |
| DestinationDetail | EXISTS | 詳細。section `h2`。plan と procedure を同じスロットにしない |
| RecordEditor | EXISTS | 記録編集。save 5-state。label 必須。mutation fail-closed |
| PlanDocument | EXISTS | 支援計画文書。手順サマリと計画本体を混同しない |

status:

```text
EXISTS — 既存 screen がこの骨格。新 screen はこれを起点にする
PATTERN — 画面内方言。抽出は後続。意味規則は本 entry が正（v1 では使わない）
KEEP    — 既存例外。新 screen に複製しない（v1 では使わない）
GAP     — 骨格は必要だが実装がない（v1 では使わない）
```

1 つの実装ファイルが複数 template を **compose** してよい（例: DailyRecords は DestinationList + RecordEditor draft）。新 screen は primary template を 1 つ選び、内側スロットだけ compose する。

## 3. How agents use these templates

- `design-context`: 対象 UI の primary template を選ぶ。無いなら GAP / HOLD。新 layout を推測で増やさない
- `design-review`: 差分が template forbidden substitutions に当たるかを監査する
- Template 不在を FAIL にしない。P2 または HOLD
- Domain 意味変更が必要なら **別 Decision**。Templates は骨格のみ
- `lint:ui-sem` は component 語彙ゲート。本 Templates は heading / slot / smoke 骨格ゲート

## 4. Entries

### ShellHost

```template-meta
id: ShellHost
status: EXISTS
path: spfx/src/shell/ux/AppShellChrome.tsx
path: spfx/src/shell/ux/StatusPanel.tsx
path: spfx/src/shell/ux/UnauthenticatedPanel.tsx
path: spfx/src/shell/ux/SiteUnselectedStop.tsx
```

#### Domain meaning

Shell は destination の外側にある。未認証・事業所未選択・取得失敗は destination を描画しない。これは権限モデルそのものではなく、presentation の fail-closed 境界である。

#### Layout skeleton

```text
AppShellChrome
  DemoBanner（synthetic 注記。screen 内に複製しない）
  fail-closed?
    UnauthenticatedPanel | SiteUnselectedStop | StatusPanelFamily
  else
    SaveStateNotice（chrome）
    primary nav（overview / users / records。role-neutral）
    destination region
      ちょうど 1 つの destination surface（h1 は surface が持つ）
```

Host の `shell-host-status` は非見出し（`p`）。destination `h1` を汚染しない。

#### Catalog slots

- StatusPanelFamily — fail-closed / 取得失敗 / アクセス不可
- SaveStateNotice — chrome の save 5-state
- EmptyNotice — **使わない**（zero-result は destination 内）

#### Forbidden substitutions

- host 文言を `h1` / `h2` にする（INV-19 / A11Y-HD-01）
- fail-closed を EmptyNotice で表す
- primary nav に `FIELD_STAFF` / `PLANNER` / `ADMIN_AUDIT` を埋め込む
- presentationRole で destination id を選ぶ（UI-SEM-05）
- destination 未選択のまま業務 surface を描く

#### Required a11y channel

- host status は非見出し
- fail-closed は alert/status のテキスト意味チャネル
- 未選択・未認証は stop panel。空一覧に見せない

#### Smoke hooks

- SHELL-UX smokes（nav / save chrome / unauthenticated / site-unselected）
- `data-shell-ux=shell-host-status`

#### Good examples

- 取得失敗で StatusPanel「判定していない状態として扱います」
- 未選択で SiteUnselectedStop。利用者一覧を出さない

#### Bad examples

- host「Shell ready」を `h2` にして destination 見出しをずらす
- 未認証を EmptyNotice「該当する利用者はいません」で表す
- `role === "PLANNER" ? "users" : "overview"`

#### Adoption surfaces

- AppShellChrome（唯一の host）
- 新 destination は host を複製しない。destination region に載せる

### DestinationOverview

```template-meta
id: DestinationOverview
status: EXISTS
path: spfx/src/shell/dashboard/OverviewDashboard.tsx
path: spfx/src/shell/dashboard/TodaySupportDayBoard.tsx
```

#### Domain meaning

概要 destination。今日の支援・KPI・最近の記録を **強調順** で見せる。業務 destination 自体は `overview` のまま。現場職員と計画担当者で入口 URL を分けない。

#### Layout skeleton

```text
section
  h1（destination 主見出し。ちょうど 1）
  sections（h2）
    TodaySupportDayBoard?
    KPI / actions / recent records
  presentationRole は section 順のみ変更
```

#### Catalog slots

- StatusBadge — KPI/行の意味が status なら label 必須。color-only 禁止
- UserSummary / ProcedureSummary — 行の要約が必要なら PATTERN を使う。新 primitive を発明しない
- EmptyNotice — 概要の「施設が空」を表すために使わない
- StatusPanelFamily — destination 内に置かない（host の仕事）

#### Forbidden substitutions

- presentationRole で primary destination を切り替える
- 要確認 と 未記録 を同じバッジ文言に丸める
- host を destination 内に複製する
- 今日の支援ボードを記録編集フォームに置き換える

#### Required a11y channel

- 単一 `h1` + section `h2`（A11Y-HD-02）
- プログラム見出しフォーカス（`:focus` + `:focus-visible`）を維持

#### Smoke hooks

- `data-dashboard-ux` / `data-kiosk-ux="today-support-primary"`
- dashboard-ux-1 / demo-ux-7 / demo-ux-10 smokes

#### Good examples

- FIELD_STAFF では TodaySupport を先に、PLANNER では reviewDue 強調。nav は overview のまま
- KPI 数値の横に「要確認」テキスト

#### Bad examples

- PLANNER なら nav を users に変える
- 未記録件数を「要確認」カードに合算する

#### Adoption surfaces

- OverviewDashboard
- 新「ホーム」は本 template。別ダッシュボードを増やす前に GAP / HOLD

### DestinationList

```template-meta
id: DestinationList
status: EXISTS
path: spfx/src/shell/users/UsersList.tsx
path: spfx/src/shell/records/DailyRecords.tsx
path: spfx/src/shell/review/ReviewDueState.tsx
```

#### Domain meaning

一覧 destination。行は人物・案件・注意の **いまの集合** を示す。フィルタ zero-result は「該当なし」であり、取得失敗でも施設空でもない。

#### Layout skeleton

```text
section[data-demo-ux]
  h1（destination 主見出し。ちょうど 1）
  optional back
  optional filter / summary
  EmptyNotice?（zero-result のみ。announce status）
  ul 行
    主ラベル
    StatusBadge label
    optional SaveState overlay（行単位。chrome 5-state と独立）
  optional compose: RecordEditor draft
```

#### Catalog slots

- StatusBadge — 行 status の label channel（要確認 ≠ 未記録）
- EmptyNotice — filter / incomplete / attention の zero-result
- SaveStateNotice — 行 overlay がある場合のみ。`save_failed` ≠ `save_outcome_unknown`
- StatusPanelFamily — 一覧の空を fail-closed にしない

#### Forbidden substitutions

- EmptyNotice に「アクセス不可」「取得失敗」「判定していない」
- 空一覧を all-clear / 成功に見せる
- color-only 行 status
- 行の save overlay を chrome の `saved` に丸める
- SectionLabelStrip を `tablist` にする（Detail の規則。List に tabs を新設しない）

#### Required a11y channel

- 単一 `h1`（A11Y-HD-03 / A11Y-HD-05 / A11Y-HD-06）
- EmptyNotice announce → `role=status` + `aria-live=polite`（INV-17）
- 行 StatusBadge は label 必須（A11Y-SC-01 / A11Y-INV-13-RV）

#### Smoke hooks

- `data-demo-ux="users-list"` / `users-filter-empty-note`
- `data-demo-ux="daily-record-recent-empty-note"`
- `data-demo-ux="review-due-attention-empty-note"`
- demo-ux-2 / 8 / 5 / 6 smokes

#### Good examples

- フィルタ該当なし: EmptyNotice「該当する利用者はいません」
- 行に StatusBadge `label="要確認"` と別行 `label="未記録"`

#### Bad examples

- 権限エラーを EmptyNotice で表す
- 要注意 0 件を「すべて確認済み」成功パネルにする

#### Adoption surfaces

- UsersList / DailyRecords の incomplete・recent / ReviewDue attention
- 新一覧は本 template。カード壁紙を増やして EmptyNotice を省略しない

### DestinationDetail

```template-meta
id: DestinationDetail
status: EXISTS
path: spfx/src/shell/users/UserDetail.tsx
path: spfx/src/shell/procedure/CurrentProcedure.tsx
```

#### Domain meaning

一覧から開く詳細。利用者サマリと、計画・手順・最近の記録を **別 section** で見せる。CurrentProcedure はいま有効な手順であり、過去版計画でも過去の記録でもない。

#### Layout skeleton

```text
section
  h1（詳細主見出し。ちょうど 1）
  back（明示 return。timeout で戻さない）
  sections（h2）
    UserSummary PATTERN?
    支援計画 section（PlanDocument へ手オフ）
    現在の支援手順 section（ProcedureSummary / RecordEditor へ手オフ）
    最近の記録
  SectionLabelStrip（tablist にしない）
```

#### Catalog slots

- UserSummary — PATTERN（UsersList / UserDetail 内。未抽出）
- ProcedureSummary — PATTERN（CurrentProcedure。historical と混同しない）
- StatusBadge — 詳細内 status の label
- EmptyNotice — 詳細の権限失敗に使わない
- PlanDocument / RecordEditor — nested surface。同じ section に融合しない

#### Forbidden substitutions

- 支援計画と支援手順を一つの「支援」スロットにまとめる
- CurrentProcedure を past plan version / historical record として出す
- SectionLabelStrip を `tab` / `tablist` にする（INV-07）
- 詳細を host fail-closed の代わりにする
- 戻る操作を自動 timeout にする

#### Required a11y channel

- 単一 `h1` + section `h2`（A11Y-HD-04）
- SectionLabelStrip は static labels（A11Y-INV-07）
- disabled 操作は `aria-disabled` を伴う

#### Smoke hooks

- `data-demo-ux` user-detail / current-procedure
- `data-field-workflow="current-procedure"`
- demo-ux-3 / field-workflow-ui smokes

#### Good examples

- UserDetail の「支援計画を表示」と「現在の支援手順を確認」を別ボタンにする
- CurrentProcedure に planVersion と procedureVersion を並記し、同一視しない

#### Bad examples

- 「支援」タブ一つで計画と手順を切り替える
- 過去の手順記録を CurrentProcedure 見出しで出す

#### Adoption surfaces

- UserDetail / CurrentProcedure
- 新詳細は本 template。一覧カードの展開だけで Detail を省略しない（意味スロットが必要なとき）

### RecordEditor

```template-meta
id: RecordEditor
status: EXISTS
path: spfx/src/shell/procedure/ProcedureRecordForm.tsx
path: spfx/src/shell/records/DailyRecords.tsx
```

#### Domain meaning

記録の下書きと保存境界。結果値・時刻・対象は Domain / Contracts の語彙を表示する。保存結果は Shell 5-state のまま。`save_outcome_unknown` を失敗にも成功にも丸めない。

#### Layout skeleton

```text
section / form
  h1 または親 Destination の section h2
  labels + controls（未ラベル入力を置かない）
  SingleSelectListbox?（button+option hybrid 禁止）
  SaveStateNotice（unsaved / saving / saved / save_failed / save_outcome_unknown）
  mutation disabled + aria-disabled（LIVE WRITE HOLD 時）
```

DailyRecords の incomplete draft は DestinationList に compose される RecordEditor スロットである。独立 destination を増やさない。

#### Catalog slots

- SaveStateNotice — 必須。5-state 外の `save_error` 等を発明しない
- StatusBadge — 対象行の status があるとき label 必須
- EmptyNotice — 保存失敗に使わない
- StatusPanelFamily — フォーム内に複製しない。host か chrome SaveState

#### Forbidden substitutions

- `save_failed` と `save_outcome_unknown` を同じラベルにする
- 「保存成功」「保存エラー」「保存完了」「保存不明」を発明する
- 未ラベル input / button+option hybrid（INV-10）
- 保存失敗を EmptyNotice や saved に見せる
- Domain result 語彙を UI 都合で変える

#### Required a11y channel

- label 関連付け（A11Y-FL-01 / INV-18）
- SingleSelectListbox listbox/option（A11Y-INV-10）
- disabled + aria-disabled（A11Y-DIS-02）
- save live region は SaveStateNotice の既存 channel

#### Smoke hooks

- `data-field-workflow` procedure record form
- `data-demo-ux` daily-record draft
- field-workflow-ui / demo-ux-9 / demo-ux-14 smokes

#### Good examples

- `save_outcome_unknown` を「保存結果不明」とし、再試行可否を `save_failed` と分ける
- incomplete 選択後の local draft。LIVE WRITE しない

#### Bad examples

- 保存結果不明を「保存失敗」バッジに落とす
- select を `button` + `role=option` にする

#### Adoption surfaces

- ProcedureRecordForm
- DailyRecords draft（compose）
- 新記録 UI は本 template。自由入力カードを増やして 5-state を省略しない

### PlanDocument

```template-meta
id: PlanDocument
status: EXISTS
path: spfx/src/shell/users/SupportPlan.tsx
```

#### Domain meaning

支援計画の表示。計画期間・目標・支援内容・見直しは計画語彙。いま有効な支援手順や記録結果は別スロット。過去版は read-only であり、現行計画でも現行手順でもない。

#### Layout skeleton

```text
section
  h1（計画主見出し。ちょうど 1）
  back → UserDetail
  person / period / lifecycle / version
  StatusBadge?（reviewStatus「要確認」label）
  sections（h2）
    目標 / 支援内容 / 見直し
    現在の支援手順（ProcedureSummary 参照。計画本体に埋め込んで同一視しない）
    過去版 / 最近の記録（historical。Current と混ぜない）
    現行版と過去版の比較?（optional。historical vs current。過去版を Current にしない）
    次の版の考え方?（optional。概念表示。persistence しない）
  mutation disabled + aria-disabled
```

presentationRole は block 順のみ変更できる。計画 destination を変えない。UserDetail 配下の nested surface であり、primary nav 項目にしない。

Optional presentation slots（SUPPORT-PLAN-REVIEW-NEW-VERSION-DEMO-1 で merged 済み。新 primitive ではない）:

- current vs historical version comparison — 現行版と過去版の並置。過去版は read-only。historical ProcedureRecord は実施時点の planVersion に残る
- next-version concept — 「次の版の考え方」概念表示。作成 CTA は disabled。永続版を増やさない

#### Catalog slots

- StatusBadge — reviewStatus の label（要確認 ≠ 未記録）
- ProcedureSummary — 「現在の支援手順」参照スロット。計画本文の置換ではない
- SaveStateNotice — 計画 mutation を本 v1 では synthetic disabled。5-state を発明しない
- EmptyNotice — 計画取得失敗に使わない
- UserSummary — 見出し付近の人物表示 PATTERN

#### Forbidden substitutions

- 支援計画と支援手順を同じ見出しで出す
- past version を CurrentProcedure として出す
- mutation 可能なのに fail-closed を外す
- 計画画面を records destination に置く
- 要確認 を未記録バッジで表す

#### Required a11y channel

- 単一 `h1` + section `h2`（A11Y-HD-07）
- 見出し / mutation の focus-visible（A11Y-SP-01）
- disabled + aria-disabled（A11Y-DIS-04）

#### Smoke hooks

- `data-demo-ux="support-plan"` 一式
- `data-review-new-version="version-compare"` / `data-review-new-version="next-version-concept"`
- demo-ux-4 / planning-pc-demo-1 / support-plan-review-new-version-demo-1 smokes

#### Good examples

- 「現在の支援手順」section と計画目標 list を分ける
- 過去版に read-only 注記を出し、編集ボタンを aria-disabled にする
- 現行版と過去版の比較を optional slot として出し、過去版を CurrentProcedure にしない
- 「次の版の考え方」を概念表示にし、作成 CTA を disabled のままにする

#### Bad examples

- 計画タイトルを「支援手順」にする
- 過去版を保存成功として見せる

#### Adoption surfaces

- SupportPlan
- 新計画文書は本 template。UserDetail の注記だけで計画画面を省略しない

## 5. Adding a new screen

```text
1. design-context で Domain 語彙と Catalog entry を固定する
2. 本 Templates から primary template を 1 つ選ぶ
3. 足りないスロットは Catalog GAP / HOLD（新 primitive を推測しない）
4. smoke hook と a11y heading 規則を template からコピーする
5. lint:ui-sem が通る語彙だけを使う
6. generator / Plop が必要なら別 GO（本ファイルを入力にする）
```

新 template id が必要なら Catalog と同様、別 Implementation GO。v1 の 6 件を無断で増やさない。

## 6. Explicit OUT

```text
generator / Plop / コード生成
React 共通 layout コンポーネント抽出
Storybook / Chromatic
Figma MCP / Token 同期
application / Domain / Contracts mutation
Deploy / Visual Acceptance / #299 Close
```

## 7. Verification

```text
npm run verify:ui-templates
npm run verify:ui-catalog
npm run lint:ui-sem
```

Catalog は component usage SSOT、Templates は screen 骨格 SSOT、`lint:ui-sem` は UI-SEM-01..05 の決定論ゲート。
