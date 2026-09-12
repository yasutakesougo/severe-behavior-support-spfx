# SBS-MGMT-HOME-CORRECTION-1 — Implementation Scope Definition

```text
repository: yasutakesougo/severe-behavior-support-spfx
unit: SBS-MGMT-HOME-CORRECTION-1-IMPLEMENTATION-SCOPE-1
kind: implementation scope / start-gate definition
status: RECORDED / SCOPE-CORRECTION-1-APPLIED / START-GO-CONSUMED
  Independent Implementation Scope Review-1: CORRECTION（historical）
  Implementation Scope Correction-1: APPLIED（docs-only）
  Independent Implementation Scope Re-Review: PASS / REVIEW-CLEARED
  Human Implementation Start GO: RECEIVED / CONSUMED（2026-09-12）
  Implementation candidate tip: 2529191（may advance with in-scope commits）
  != LOCKED Definition の再開
  != Independent Implementation Review PASS
  != Human Ready / Merge / Deploy
date: 2026-09-11
corrected: 2026-09-12
start-go-consumed: 2026-09-12
branch: cursor/sbs-mgmt-home-5-persona-sim-c53a
PR: #604（Draft）
parent Correction Scope: LOCKED（unchanged）
correction packet:
  docs/architecture/sbs-mgmt-home-correction-1-implementation-scope-correction-1.md
lock packet:
  docs/architecture/sbs-mgmt-home-correction-1-definition-scope-lock-1.md
  git blob @ ebe8f9f = 98eac53fc6238dee0cc2ac0fcecaa0394ed5cb34
C1–C6 meaning blobs @ 38c5439:
  Definition Start     92ce437c6c843576aea49376b8971abdf873b3f5
  Definition Correction-1 debd3992dee917eecd1dbae86f137a781b764a8b
  Correction Scope     685b343b174ada3b911e79a6d794aaaa5cce8d22
primary evidence:
  docs/architecture/sbs-mgmt-home-5-persona-real-browser-simulation-2.md
  Outcome = CORRECTION（再判定しない）
Human Definition / Scope Lock GO: RECEIVED / CONSUMED
Human Implementation Scope Correction-1 GO: RECEIVED / CONSUMED（2026-09-12）
Independent Definition Re-Review-2: PASS / REVIEW-CLEARED
Human Implementation Start GO: RECEIVED / CONSUMED（2026-09-12）
Implementation: AUTHORIZED within LOCKED Definition / Correction Scope + this Scope
Actual Staff Value Check: NOT CONSUMED
Ready / Merge / Deploy / LIVE WRITE: NOT AUTHORIZED
SharePoint / M365 / Entra mutation: NOT AUTHORIZED
```

This document fixes the smallest Implementation Scope that can realize locked C1–C6
without redesigning the Definition or inventing business states.

Human Implementation Start GO has been **RECEIVED / CONSUMED**. Product / SPFx work
is authorized only inside this Scope. Ready / Merge / Deploy remain separate Human Gates.

---

## 1. Goal（1 sentence）

職員が Home.aspx 上の既存 SPFx シェルで、閲覧 / 業務記録 / SharePoint ページ編集 /
適用中計画 / 未適用 Draft / 件数の単位を取り違えないようにする。機能追加ではない。

---

## 2. Binding（do not reopen）

```text
見る != 記録する != 訂正する != SharePointページを編集する
SupportPlan.currentVersion = current applied authority
Draft exists != Applied
RevisionIntent CONSUMED != Applied
UNKNOWN / UNAVAILABLE != NONE / ZERO / 未実施
SharePoint page Edit = サイト mutation で除去しない
Apply / next-version creation / LIVE WRITE = OUT
READ-ONLY Management Home
no write-first primary CTA
Simulation 2 = CORRECTION
Actual Staff Value Check = 別 Gate
#442 reviewDueDate authority 維持（再計算しない / 固定90日を導入しない）
```

Lock 文書が挙げた `managementHomePresentation.ts` / `ManagementHomeApp.tsx` /
`data-shell-nav` は **現行ツリーに存在しない**。本 Scope は実在パスへ bind する。

| Lock 上の名前 | 実装 bind（実在） |
|---|---|
| `managementHomePresentation.ts` | `spfx/src/shell/users/management-home-read-model.ts` |
| `ManagementHomeApp.tsx` | `spfx/src/shell/users/ManagementHome.tsx`（`SupportPlanWithManagementHome`） |
| planner `data-shell-nav` | `PLANNER_SUPPORT_PLAN_PROCESS_NAVIGATION`（`support-plan-copy.ts`）+ `primary-navigation.ts` |

---

## 3. RR2-P2-1 必須証明（C4）

### 観測（現行コード）

```text
今日の対象カード
  DASHBOARD_UX_OVERVIEW_FIXTURE.kpiCards[today_targets].count = 12
  独立ハードコード。Users roster とも TodaySupportItem とも非結合
  正本: spfx/src/shell/dashboard/overview-fixture.ts

利用者 全N名
  DEMO_UX_USERS_FIXTURE.summaryLabel = 全8名
  rows[].id = user-a … user-h（UserId）
  正本: spfx/src/shell/users/users-fixture.ts

今日の支援ボード
  getKioskSyntheticTodaySupportItems()
  TodaySupportItem.userId は既存フィールド（kiosk-read-model.bundle.d.ts）
  現行合成は KIOSK_FIXTURE_USER_ID = user-a のみ
  正本: spfx/src/shell/procedure/kiosk-today-support-fixture.ts
```

12 を人数として再利用する既存ソースは **無い**。新しい集計アルゴリズム / 新しいデータ源は OUT。

### Decision S-POP — 採用

```text
今日の対象（人カード）
  = distinct TodaySupportItem.userId
    のうち DEMO_UX_USERS_FIXTURE.rows[].id に含まれるもの
  = 既存ボード items の UserId 部分集合
  件数 N_today <= 全N名
  ボード自体はこれまで通り occurrenceId の予定リスト（人数カードにしない）

導出タイミング
  Overview が既に受けている todaySupportItems と
  既存 roster rows からのみ数える
  （DEMO-UX-10 の countRowsWithBadgeId と同じ「既存配列を数える」パターン）
  新規 resolver / 新規 list / 新規 KPI カテゴリ = OUT

fail-closed
  todaySupportItems 欠落 / UNAVAILABLE
    → 今日の対象は「確認できません」
    → count を 0 にしない
    → 12 に戻さない
  item.userId が roster に無い
    → その item は人数に入れない（部分取得を全体にしない）
  distinct が空で items は RESOLVED かつ 0 件予定
    → 人数 0 は「予定が無い」であり UNAVAILABLE ではない
    → ボード空コピーは既存「本日の支援予定はありません。」を維持

FORBIDDEN
  12 の再利用
  personLabel 文字列のユニーク数を UserId の代用にすること
  occurrence 件数を今日の対象に出すこと
```

#### S-POP / OverviewKpiCard UNAVAILABLE exact contract（ISR1-P1-2 CLOSE）

既存型 `OverviewKpiCard`（`spfx/src/shell/dashboard/overview-types.ts`）は維持する:

```text
OverviewKpiCard = Readonly<{
  id: OverviewKpiCategory;
  label: string;
  count: number;       // 型上必須。意味は availability で分岐する
  statusHint: string;  // 色だけにしない hint
}>
```

`id = "today_targets"` は **互いに排他な 2 mode** のみ。実装者の第3解釈を禁止する。

```text
MODE_RESOLVED（todaySupportItems が取得でき、読める）
  meaning:
    count = distinct 適格 userId の人数（0 を許す = 「予定が無い」）
    statusHint = 通常の対象 hint（例: 本日の支援対象）
  display:
    count を人数として描画してよい
  NOT:
    count=0 を UNAVAILABLE と読んではならない

MODE_UNAVAILABLE（todaySupportItems 欠落 / UNAVAILABLE）
  meaning:
    表示状態 = UNAVAILABLE
    count は人数・件数・ゼロ・12 のいずれの population 意味も持たない
    statusHint = 固定文言「確認できません」
  type compatibility:
    count: number は型充足のため残す
    値は population として解釈してはならない
    count=0 / count=12 / その他の番兵値を UNAVAILABLE の意味に使ってはならない
  display（実装 Start 後に満たす exact UI 規則）:
    today_targets カードで count を population 数字として描画してはならない
    主値は statusHint「確認できません」（または同等の非数値 unavailable 表示）とする
    data-demo-ux-kpi-count に population を載せてはならない
```

```text
FORBIDDEN（ISR1-P1-2）
  UNAVAILABLE を count=0 で偽装すること
  UNAVAILABLE を count=12（旧ハードコード）で埋めること
  OverviewKpiCard.count だけで availability を表現すること
  LOCKED C4 を超える新しい業務状態を足すこと
```

現行合成に MODE_RESOLVED を適用すると 今日の対象 = **1**（user-a）。全8名を超えない。ボードは Aさん予定の subset のまま。

この決定で RR2-P2-1 は Implementation Start 後に **CLOSE 予定**（本 docs ではコードを変えないので OPEN のまま）。ISR1-P1-2 は本契約で **CLOSE**。

---

## 4. Exact Scope decisions

実装順序は Correction Scope の Group 1 → 2 → 3。Group 2 を Group 1 より先に広げない。

### S-CTA — 結合 CTA を止める（F-P1-001 / Group 1）

現行: `todaySupportOccurrenceActionLabel` が 未実施 field で
`この予定を記録 / 手順表示` を 1 ボタンに結合。

```text
field / 未実施・未記録相当
  第一操作（quiet / 既定）: 手順を表示
  第二操作（記録）: この予定を記録
  1 ボタンに結合しない
  クリック先は既存 onSelectOccurrence / 既存記録入口のまま
  新しいワークフローを作らない

field / 記録済み
  第一: 記録を確認・再表示（現行維持）

ADMIN_AUDIT confirm / 未実施
  予定を確認（現行維持）
```

対象: `TodaySupportDayBoard.tsx` + `today-support.test.ts`。
概要「今日やること」の `記録する` は記録導線のままにしてよいが、
Persona 1 の第一操作にはしない（視覚強度を手順表示より上げない）。

### S-VIEW — 確認到着面の write CTA（F-P1-002 / Group 1）

現行: `記録を確認・再表示` の到着 `CurrentProcedure.tsx` で
`この記録を訂正する` / `この記録を取り消す` が primary。

```text
確認・再表示で開いた面
  第一操作 = 戻る / 見る
  訂正する・取り消す = secondary（quiet）。削除しない（write 実装は OUT）
作成する / 編集する / 保存する
  計画閲覧面の主 CTA にしない（既存 MUTATION_LABELS は disabled 表示専用のまま、強度を下げる）
```

訂正・取消の **live 書き込み** は OUT のまま。

### S-PAGE — SharePoint 編集 vs 業務保存（F-P0-001 / Group 1）

サイト コマンドバー `編集` / `+新規` / web part `未保存` は **除去しない**。

```text
IN: シェル内案内（既存 DemoBanner 近傍 / AppShellChrome）
  SharePoint の「編集」とページの「未保存」はページ編集です。
  支援の記録や保存ではありません。

既存 VP1_DEMO_SAFETY_NOTICE
  デモ環境｜表示内容は合成データです。保存されません。
  維持する（業務未保存と読むリスクがあるので、上のページ編集案内を併記する）
```

対象: `DemoBanner.tsx` / `vp1-demo-separation.ts` / `AppShellChrome.tsx`。Home.aspx は触らない。

### S-UNSAVED — 裸の「未保存」（F-P0-001 / F-P1-006 / C3）

```text
ShellSaveState 識別子 unsaved は維持する（新しい状態機械 OUT）

利用者カード overlay
  明示 session unsaved だけ「記録が未保存」
  save_outcome_unknown は「保存結果不明」のまま（畳まない）
  missing / undefined
    → overlay を出さない
    → 裸の「未保存」にしない
    （現行 overlayForUserSessionSaveState(undefined) = 未保存 は C3 違反なので直す）

ページ chrome の「未保存」
  S-PAGE の案内でページ未保存と区別する
```

対象: `users-session-save-overlay.ts` + 対応テスト。
`save-state.ts` の vocabulary キーは変えない。利用者向けラベルだけ修飾してよい。

未実施 = 既存 `TodaySupportItem.effectiveStatus` のみ。
未記録 = 既存 Users badge `unrecorded` / Family R のみ。
Management Home は保存状態を推論しない。

### S-DRAFT — C6 pixel-exact（F-P1-003）

Lock の INTENDED 2 行から **実行時に使うのは次の 1 行だけ**。

```text
次版下書き vN+1（未適用）
```

#### S-DRAFT N+1 authority（ISR1-P1-1 CLOSE）

`conceptualNextVersion` と actual draft candidate を分離する。N+1 Draft 表示の authority は **draft 実体のみ**。

```text
Draft N+1 表示（「次版下書き vN+1（未適用）」）を出してよい
  iff 既存 draft 実体があり、draft.candidate.version が存在する
N+1 = draft.candidate.version のみ

conceptualNextVersion
  = 次版の考え方 / 版番号の概念値（fixture 上の概念）
  ≠ Draft 実体
  ≠ Draft exists の証拠
  単独では「次版下書き vN+1（未適用）」を出してはならない
  単独では Draft の存在を表現してはならない

現行版が無い対象ではカードを出さない
スタンドアロン「新しい計画」禁止
同等文「新しい計画の下書き（まだ適用されていません）」は
  文書上の別名として残してよいが、画面には出さない
  （「新しい計画」部分が Persona 3 誤読の核）

FORBIDDEN（ISR1-P1-1）
  N+1 = draft.candidate.version または conceptualNextVersion
  conceptualNextVersion だけで Draft ラベルを出すこと
  Draft 不在を conceptual next で埋めること
```

既存ソース:

```text
Aさん
  DEMO_UX_SUPPORT_PLAN_FIXTURE.currentVersion = 3
  conceptualNextVersion = 4
    → 概念値。これだけでは Draft 表示を許可しない
  MANAGEMENT_HOME_RESOLVED_FIXTURE.draft.candidate.version = 4
    → Draft 実体あり。N+1 表示 authority = 4
  → 適用中 v3 と 次版下書き v4（未適用）を同一計画面 / Management Home で並記
  → v4 表示の根拠は draft.candidate.version。conceptualNextVersion との一致は偶然の一致であり authority ではない

Cさん
  既存 fixture に Draft が無い（詳細は「現行版（合成）」のみ）
  conceptualNextVersion があっても Draft 表示は出さない
  → Draft を新造しない（next-version creation = OUT）
  → 「新しい計画があります」を消す
  → 現行版のみ表示。無い Draft をあるように書かない
```

Persona 3 の meaning check は **Draft が存在する Aさん面** で成立させる。
Cさんで Draft を捏造して PASS にしない。
ISR1-P1-1 は本契約で **CLOSE**。

対象コピー: `overview-fixture.ts` action-c reason、`users-fixture.ts` attentionNote、
`user-detail-fixture.ts` / `review-due-fixture.ts` の「新しい計画」文言、
`support-plan-copy.ts` の Draft ラベル、`management-home-read-model.ts` の変更対応行。

### S-NAV — Management Home 到達（F-P1-004 / C5）

現行: `SupportPlanWithManagementHome` は PLANNER かつ
`userId`/`planId` が `MANAGEMENT_HOME_RESOLVED_FIXTURE` と一致するときだけ
`支援マネジメントを見る（読み取り専用）` を出す。概要初期面では heading `支援マネジメント` は出ない。

```text
IN
  既存ボタン文言を維持
  PLANNER の計画面（既存 host）から同じ ManagementHome を開けることを保証
  PLANNER 概要から、既存ユーザー詳細 → 支援計画 → 上記ボタン、
    または同一 host 内の同等リンク 1 本
  FIELD_STAFF には開かない（現行テスト維持）

OUT
  新しいマネジメント製品
  サイト左ナビ / Home.aspx / ごみ箱削除
  英語左ナビのテナント変更（in-shell 案内のみ可）
```

### S-DUE — reviewDueDate 表示（F-P1-007 / C2）

除く（利用者向け）:

```text
raw「reviewDueDate」
「caller-supplied」
technical origin 説明
```

維持:

```text
presentReviewDueSemanticBasis の originLabel / approachingLabel（既に日本語・#442 整合）
Management Home「次回確認: {日付}」/「次回確認: 確認できません」
fixture の reviewDueDate 値そのもの（authority。再計算しない）
```

実行時 dueLabel を次に置換する（90 日を導入しない）:

```text
次回確認日は既存の見直し期限です。固定90日や自動失効には変換しません。
```

対象: `review-due-semantics.ts` + `review-due.test.ts`。
テストが `caller-supplied` を **画面 copy として要求している箇所だけ** を人向け文に合わせる。
authority コメント / slice flag `callerSuppliedDueAuthorized` は内部のまま残してよい。

### S-NAV-TRASH — 英語左ナビ / ごみ箱（F-P2-002）

in-shell の短い案内のみ。サイト設定は OUT。本 slice の Re-Sim P1 条件には含めない（P2）。

### S-PROC-ID — F-P2-001

手順ID併記の削除は OUT（Correction Scope どおり必須にしない）。

---

## 5. Files IN（上限）

Implementation Start 後に触ってよいパス（新規ディレクトリを増やさない）:

```text
spfx/src/shell/dashboard/overview-fixture.ts
spfx/src/shell/dashboard/overview-copy.ts
spfx/src/shell/dashboard/overview-types.ts
spfx/src/shell/dashboard/OverviewDashboard.tsx
spfx/src/shell/dashboard/TodaySupportDayBoard.tsx
spfx/src/shell/dashboard/today-support.test.ts
spfx/src/shell/dashboard/overview.test.ts
spfx/src/shell/review/review-due-semantics.ts
spfx/src/shell/review/review-due.test.ts
spfx/src/shell/review/review-due-fixture.ts
spfx/src/shell/review/ReviewDueState.tsx
spfx/src/shell/users/ManagementHome.tsx
spfx/src/shell/users/ManagementHome.test.tsx
spfx/src/shell/users/management-home-read-model.ts
spfx/src/shell/users/management-home-read-model.test.ts
spfx/src/shell/users/users-fixture.ts
spfx/src/shell/users/user-detail-fixture.ts
spfx/src/shell/users/users-session-save-overlay.ts
spfx/src/shell/users/users-session-save-overlay.test.ts
spfx/src/shell/users/users.test.ts
spfx/src/shell/users/SupportPlan.tsx
spfx/src/shell/users/support-plan-copy.ts
spfx/src/shell/users/support-plan.test.ts
spfx/src/shell/procedure/CurrentProcedure.tsx
spfx/src/shell/ux/DemoBanner.tsx
spfx/src/shell/ux/vp1-demo-separation.ts
spfx/src/shell/ux/AppShellChrome.tsx
spfx/src/shell/ux/kpi-review-count.ts   （既存 count helper 再利用時のみ）
対応する既存 *.test.ts / *.test.tsx
既存 synthetic smoke（presentation only）が壊れた場合の修正
```

上記以外（domain bundle、contracts、schema、Home.aspx、site chrome）= OUT。

---

## 6. Files / 行為 OUT

```text
SPFx domain bundle / schema / list 変更
Apply / next-version 作成 / RevisionIntent 新規発行
LIVE WRITE / SharePoint REST write
Home.aspx / サイトナビ / App Catalog / Deploy
FIELD_STAFF に計画編集や Management Home を開くこと
未実施 / 未記録 / 未保存 の新状態
90 日再計算
件数 12 の再利用
SIM-AUTH-001 の製品 Issue 化
Simulation 2 判定の改ざん
Actual Staff Value Check
#554 close / Ready / Merge
```

---

## 7. Issue / PR 分割

```text
Issue 新設 = しない（#554 を close しない。本 PR #604 は docs 継続）

Implementation Start GO 後のコード
  = 単一 Implementation PR（推奨）
  理由: C1 Re-Sim は Group 1+2+3 が揃わないと P1=0 を判定できない

順序（同一 PR 内）
  1. Group 1  S-PAGE / S-CTA / S-VIEW / S-UNSAVED
  2. Group 2  S-DRAFT / S-NAV / C3 明示
  3. Group 3  S-POP / S-DUE
  4. 既存 npm test / typecheck
  5. synthetic smoke（代替にしない）
  6. 別 Gate: authenticated 5-persona Re-Sim
```

---

## 8. Test plan（Implementation Start 後）

```text
npm test / typecheck / lint（既存回帰）
todaySupportOccurrenceActionLabel: 結合文字列が無い
today_targets: UserId distinct ⊆ roster。12 を assert しない
UNAVAILABLE カードは 0 でも 12 でもない
Cさん attention / 詳細にスタンドアロン「新しい計画」が無い
Aさん計画面: 適用中 v3 と 次版下書き v4（未適用）
review-due 利用者 copy に reviewDueDate / caller-supplied が無い
次回確認 / 確認できません が残る
overlay(undefined) が 未保存 を出さない
PLANNER のみ Management Home 入口
FIELD_STAFF に入口が無い
synthetic smoke: presentation only

Authenticated 5-Persona Re-Simulation
  C1 どおり P0=0 かつ P1=0 + Persona meaning
  Actual Staff を含めない
  synthetic smoke で代替しない
```

---

## 9. HOLD

```text
HOLD: Independent Implementation Scope Review-1 = CORRECTION（historical）
HOLD: SharePoint サイト mutation（別途 Deploy / LIVE WRITE GO なしでは禁止）
HOLD: Actual Staff Value Check
HOLD: Human Ready GO / Human Merge GO — NOT GENERATED / NOT CONSUMED
HOLD: Authenticated 5-persona Re-Sim（C1）— tip-equivalent deploy + auth session が揃うまで実施不可なら HOLD
HOLD: RR2-P2-1 — S-POP MODE_RESOLVED/MODE_UNAVAILABLE 実装 exact 確認まで OPEN 扱い可
```

---

## 10. Done criteria（この Start GO path）

```text
Locked C1–C6 を満たす SPFx presentation 差分がある
S-POP により 12 が人数として残っていない
required verification（test / typecheck / lint / build as applicable）完了または明示 HOLD
Authenticated 5-persona Re-Sim（C1）evidence packet 完了（PASS または明示 HOLD）
Simulation 2 本文の CORRECTION は歴史証跡として残る
Independent Implementation Review entry 準備完了
Actual Staff / Ready / Merge を宣言していない
```

---

## 11. Gate

```text
Human Definition / Scope Lock GO = CONSUMED（unchanged）
LOCKED Definition / Correction Scope = UNCHANGED
Human Implementation Scope Correction-1 GO = CONSUMED
Implementation Scope Definition = RECORDED + SCOPE-CORRECTION-1-APPLIED（this document）
Independent Implementation Scope Review-1 = CORRECTION（historical）
Independent Implementation Scope Re-Review = PASS / REVIEW-CLEARED
Human Implementation Start GO = RECEIVED / CONSUMED（2026-09-12）
Implementation = IN PROGRESS / CANDIDATE（tip 2529191; may advance in-scope）
Independent Implementation Review = REQUIRED after C1 evidence
Human Ready / Merge / Deploy / LIVE WRITE = NOT AUTHORIZED
```

## 12. NEXT

```text
Agent（this Project runtime; Start GO CONSUMED）:
  1. verify / gap-fill implementation candidate within this Scope
  2. Authenticated 5-persona Re-Sim（C1）または明示 HOLD
  3. implementation evidence + Independent Implementation Review entry
  STOP at Review entry ready
  Do not generate / infer Human Ready or Merge GO
  Do not Deploy / LIVE WRITE without separate Human GO

Fresh Independent Runtime（別）:
  Independent Implementation Review
  basis = implementation tip + evidence + C1 packet + LOCKED Definition / Scope

Human（parallel; not Start authority）:
  PR #604 title/body metadata update（GitHub UI）
  tip-equivalent Deploy confirmation or separate Deploy GO（for C1）
  authenticated session for C1

Lock CONSUMED != Ready / Merge
Start GO CONSUMED != Ready / Merge / Deploy
C1 evidence != Actual Staff Value Check
Independent Implementation Review entry != Review PASS
```
