# SBS-MGMT-HOME — 5-Persona Authenticated Real-Browser Simulation 2

```text
repository: yasutakesougo/severe-behavior-support-spfx
unit: SBS-MGMT-HOME
kind: 5-PERSONA AUTHENTICATED REAL-BROWSER SIMULATION
mode: READ-ONLY UX TEST
date: 2026-09-11
predecessor: docs/architecture/sbs-mgmt-home-5-persona-real-browser-simulation-1.md
  Simulation 1 = BLOCKED / SIM-AUTH-001 (test-session precondition, not a product Issue)
target URL:
  https://isogokatudouhome.sharepoint.com/sites/severe-support-isogo/SitePages/Home.aspx
AUTH_STATE: AUTHENTICATED_APP
loaded asset exact identity: NOT_OBSERVABLE
synthetic smoke substitute: NOT USED as this simulation
LIVE WRITE / Deploy / App Catalog / schema / page edit: NOT PERFORMED
Actual Staff Value Check: NOT CONSUMED
Human Ready / Promotion: NOT IMPLIED
Simulation Outcome: CORRECTION
```

## Boundary

```text
This packet
= authenticated real SharePoint browser UX simulation
!= Actual Staff Value Check
!= Management Home product PASS
!= Human Ready / Promotion
!= SIM-AUTH-001 product Issue
```

```text
UX timing starts after Sign in is cleared.
Authentication time is excluded from task time.
Do not infer binary SHA from the browser display.
```

## Start condition (all personas)

Every persona started from the Home.aspx direct URL.

| Field | Observed |
|---|---|
| AUTH_STATE | AUTHENTICATED_APP |
| SharePoint title | 強度行動障害支援 - 磯子活動ホーム |
| Web part heading | 強度行動障害支援（シェル表示） |
| Default 表示ロール | 現場職員 / Tablet / 今日の支援・記録 |
| Default tab | 概要 |
| Management Home heading `支援マネジメント` | NOT OBSERVED on this landing |
| Demo banner | デモ環境 \| 表示内容は合成データです。保存されません。 |
| Web part chrome | 未保存 |
| SharePoint command bar | +新規 / ページの詳細 / プレビュー / 分析 / 共有 / 編集 |

Initial view is **not** Management Home. It is the field-staff 概要 / 今日の支援 board. Testing continued from that fact.

Evidence: `/opt/cursor/artifacts/persona1_home_start.webp`

## Persona 1 — 慎重なベテラン支援員

```text
Start heading: 強度行動障害支援（シェル表示） / 概要
Start state: 現場職員, 今日の支援 timeline
Task 1 今日誰に何を: SUCCESS — 09:30〜18:00 Aさん（合成日次ボード。一覧の対象集合とは別と明示）
Task 2 適用中計画: SUCCESS — 利用者 → Aさん 詳細を見る → 支援計画を表示
  現行版・適用中（合成） / 版 3 / 適用中
Task 3 見るだけ安心: HOLD — デモバナーは読むだけで保存されないと書くが、
  「この予定を記録 / 手順表示」「記録する」「作成する / 編集する / 保存する」
  SharePoint「編集」「+新規」、手順画面の「この記録を訂正する」「この記録を取り消す」が並ぶ
Task 4 Home復帰: SUCCESS — 概要タブで復帰
Success / Friction / Blocked: Friction (見るだけ安心は HOLD)
迷った箇所: 計画は概要に無く利用者詳細まで潜る。手順ID proc-morning (v1) 等
誤解した箇所: 利用者行の「未保存」を自分の未保存編集と取り違えやすい
危険操作: この予定を記録 / 手順表示（見るためだけに押せない結合CTA）
  記録する / SharePoint 編集 / 計画操作の作成する・編集する・保存する
クリック数: 6（利用者, 詳細を見る, 支援計画, 支援計画を表示, 戻る, 概要）
概算時間: 4–5分（認証除く）
```

Persona 1 = **HOLD**（業務確認はできたが、慎重な職員が「見るだけ」と安心できない）

## Persona 2 — 多忙な現場職員

```text
Start heading: 概要 / 今日の支援
Start state: 現場職員
Task 1 30秒で今日やること: SUCCESS — スクロール先に「今日やること」
  Aさん 支援記録が未入力 / Bさん 見直しまで7日 / Cさん 新しい計画があります
Task 2 注意が必要な利用者: SUCCESS — 要確認3 / 未記録2 / 18:00 確認が必要 / 今日やること
Task 3 今日の支援内容へ: SUCCESS with friction — 「記録する」「この予定を記録」は未クリック。
  「記録を確認・再表示」で「現在の支援手順」へ到達。そこが訂正・取消の青CTAになる
Task 4 Home復帰: SUCCESS — 概要
Success / Friction / Blocked: Success with friction
迷った箇所: 今日の対象12 vs 予定はAさんのみ vs 利用者全8名
誤解した箇所: 未実施（予定）と未記録（記録未入力）の併記
危険操作: 今日やること「記録する」（第一CTA）
クリック数: 約4
概算時間: 約40秒（認証除く）。「今日やること」見出し到達はスクロール依存で初見30秒はギリギリ
```

Persona 2 = **PASS**（30–60秒で今日やることは見える。ただし第一CTAは記録）

## Persona 3 — 計画・見直し担当職員

```text
Start heading: 強度行動障害支援（シェル表示）
Start state: Home直URLは現場職員。計画業務のため表示ロール「計画担当」へ切替（デモ専用ラジオ）
Task 1 対象者: SUCCESS — 利用者一覧 A/B/Cさん（合成）
Task 2 適用中version: PARTIAL — Aさん 版3 適用中は現場ロールでも見えた。
  Cさんは「現行版（合成）」のみで版番号がこの画面に無い
Task 3 見直し必要か: SUCCESS — 「見直し状況を表示」
  要確認 3件（合成表示）/ 期限接近 2件（合成表示）
  Aさん・Bさん: 支援計画の見直し + 要確認 + 期限接近
  Cさん: 新しい計画の確認 / 責任者レビュー用
Task 4 次版Draftの有無: HOLD — 「新しい計画があります」はあるが、
  Cさん詳細の支援計画は「現行版（合成）」のみ。Draft行・未適用ラベルは未観測
Task 5 現行と未適用Draftの混同: HOLD — 区別UIが足りず混同を否定できない
Success / Friction / Blocked: Friction / HOLD on draft
迷った箇所: 計画担当概要は「計画・見直しの確認から始めます」であり
  支援マネジメント4カード（現在の計画 / 見直し / 変更対応 / 次行動）は未出現
誤解した箇所: 「新しい計画」= すでに適用された現行版、と読める
危険操作: 今日やること「確認する」「記録する」。計画操作 作成する/編集する/保存する
クリック数: 約6
概算時間: 約90秒（認証除く）
```

Persona 3 = **HOLD**

`支援マネジメントを見る（読み取り専用）` および heading `支援マネジメント` は、Home.aspx の 概要 / 利用者 / 支援計画 表示では **NOT OBSERVED**。

## Persona 4 — 新人・システム不慣れ職員

```text
Start heading: 強度行動障害支援（シェル表示）
Start state: 現場職員（初見のまま）
Task 1 Homeを開く: SUCCESS
Task 2 画面の目的を説明: PARTIAL — 「今日の支援」「今日やること」は読める。
  「シェル表示」「表示ロール（デモ専用）」「認証ロール判定はありません」は初見負担
Task 3 対象者を探す: SUCCESS — 利用者タブ。全8名（合成データ）
Task 4 支援計画を見る: SUCCESS — Aさん 詳細 / 支援計画を表示
Task 5 Homeへ戻る: FRICTION — 左ナビ「ごみ箱」へ誤入し RecycleBin.aspx。中身は空。書き込みなし。
  ホームへ戻れば復旧
Success / Friction / Blocked: Friction
迷った箇所: SupportPlans / AssessmentSnapshots 英語左ナビ。手順ID。表示ロールの英語副題
誤解した箇所: 未実施 vs 未記録 vs 未入力 vs 未保存。0件と実施できなかったの専用コピーは未観測
  （空状態の説明より、未*バッジの多義が先に来る）
危険操作: ごみ箱、SharePoint 編集、記録する
クリック数: 約7 + ごみ箱誤クリック1
概算時間: 約80秒（認証除く）
```

Persona 4 = **HOLD**

## Persona 5 — 責任者 / サービス管理視点

```text
Start heading: 強度行動障害支援（シェル表示）
Start state: Home直URLは現場職員。のち「運用確認」ラジオ
  コピー: 運用状況と記録の確認用です（合成表示）。編集機能は追加しません。
Task 1 今日確認すべき対象: PARTIAL — 今日の対象12 / 要確認3 / 未記録2 / 期限接近3
  件数と「今日の支援」Aさんボードが一致しない（画面自身が別集合と書く）
Task 2 見直し必要: SUCCESS — 見直し状況を表示（計画担当時と同じ合成一覧）
Task 3 適用中 / Draft / 未確認: HOLD — 要確認バッジはある。Draft版は未観測。
  見直し画面上部に英語: reviewDueDate is caller-supplied の基準日です。
Task 4 職員へ依頼すること: PARTIAL — 今日やることの3行は依頼候補になる。
  第一ボタンが「記録する」「確認する」で、責任者が依頼内容を読み違えうる
Success / Friction / Blocked: Friction / HOLD on draft and count meaning
迷った箇所: OverviewカードはあるがマネジメントHomeではない
誤解した箇所: 12件を「今日動かす人数」と読むと、下のAさんボードと矛盾する
危険操作: SharePoint 編集。見直し画面の開発者英語を業務ルールと読む
クリック数: 約4
概算時間: 約50秒（認証除く）
```

Persona 5 = **HOLD**

## Findings

| ID | Severity | State | Content | evidence |
|---|---|---|---|---|
| F-P0-001 | P0 | OPEN | 職員業務Homeの上に SharePoint `編集` / `+新規` と web part `未保存` が常時ある。ページ編集・新規は LIVE WRITE。慎重な職員ほど「保存しなければ」と押しうる。本シミュレーションでは未クリック。 | persona1_home_start.webp ほか全画面 |
| F-P1-001 | P1 | OPEN | 「この予定を記録 / 手順表示」が単一CTA。手順を見るためだけに記録語を踏む必要がある。 | home_today_schedule.webp |
| F-P1-002 | P1 | OPEN | 「記録を確認・再表示」の先が「この記録を訂正する」「この記録を取り消す」青ボタン。閲覧導線の先が write 形。デモは保存されないと書くが、誤認は残る。 | persona2_procedure_view_write_ctas.webp |
| F-P1-003 | P1 | OPEN | 「新しい計画があります」と Cさん詳細「現行版（合成）」だけが並び、Draft / 未適用を確認できない。混同を否定できない。 | persona3_csan_current_version_only.webp |
| F-P1-004 | P1 | OPEN | SBS-MGMT-HOME の heading `支援マネジメント` と読み取り専用入口が、この Home.aspx 初期〜計画担当概要で観測されない。 | persona3_planner_overview.webp |
| F-P1-005 | P1 | OPEN | 今日の対象12 / 利用者全8名 / 今日の支援はAさんのみ。別集合と注記はあるが、多忙・責任者は件数を業務人数と読みやすい。 | persona1_home_start.webp / persona1_user_list.webp |
| F-P1-006 | P1 | OPEN | 未実施 / 未記録 / 未入力 / 未保存 が併存。新人は「0件」と「実施できなかった」以前に、未保存=自分が壊した、未実施=実施失敗、と取り違えうる。 | persona1_user_list.webp |
| F-P1-007 | P1 | OPEN | 見直し状況の判定前提に英語開発者コピー `reviewDueDate is caller-supplied`。責任者Overviewとして読めない。 | persona5_review_english_copy.webp |
| F-P2-001 | P2 | OPEN | 手順ID `proc-morning (v1)` 等。人・場面ラベルは日本語で併記されている。 | home_today_schedule.webp |
| F-P2-002 | P2 | OPEN | 左ナビ `SupportPlans` / `AssessmentSnapshots`。新人は業務画面とサイト管理を混線し、ごみ箱へも行ける。 | persona4_recycle_bin_detour.webp |
| F-P2-003 | P2 | OPEN | 計画操作（表示専用）に作成する / 編集する / 保存するが残る。 | persona1_plan_write_looking_ctas.webp |

```text
P0 = 1
P1 = 7
P2 = 3
```

## Cross-persona

```text
共通して迷った導線:
  概要に適用中計画が無く、利用者詳細まで潜る
  表示ロール切替（デモ）が業務ロールそのものに見える
  SharePoint 左ナビとシェルタブが二重

30秒以内に把握できない情報:
  適用中版と Draft の関係
  今日の対象12の内訳
  支援マネジメント4カード（本Homeでは未出現）

read-only / write境界:
  バナーは「保存されません」
  同時に記録する / 訂正する / SharePoint 編集 が強い
  境界は分かりにくい（P0/P1）

applied / draft / review:
  Aさん 版3 適用中は追える
  Cさん「新しい計画」は Draft と確認できない（P1）
  見直し要確認3件は一覧できる

Homeへの復帰性:
  シェル「概要」なら復帰できる
  左ナビ誤操作でごみ箱へ出ると Home.aspx から外れる（P2、復旧可）
```

## What was not done

```text
Save / Apply / Create / Delete / Submit: NOT CLICKED
plan activation / next-version preparation: NOT PERFORMED
SharePoint 編集 / +新規: NOT CLICKED
この記録を訂正する / 取り消す: NOT CLICKED
記録する / この予定を記録: NOT CLICKED
credentials / MFA / tokens: NOT RECORDED
```

Persona 4 が左ナビ「ごみ箱」を開いた。空の RecycleBin 表示のみ。復元・削除はしていない。

## FINAL REPORT

```text
5-PERSONA AUTHENTICATED REAL-BROWSER SIMULATION

Persona 1 = HOLD
Persona 2 = PASS
Persona 3 = HOLD
Persona 4 = HOLD
Persona 5 = HOLD

P0 = 1
P1 = 7
P2 = 3

Simulation Outcome = CORRECTION

Actual Staff Value Check = NOT CONSUMED

Human Ready / Promotion = NOT IMPLIED
```

共通して理解できた場所:

- 今日の支援の時刻・Aさん・場面名
- デモバナー「合成データ / 保存されません」
- 利用者から Aさん 版3 適用中へ辿れること
- 見直し状況の要確認3件一覧

最も危険な誤解:

- Home の SharePoint `編集` / `未保存` を「この支援を保存する」と読む
- 「新しい計画があります」を適用済みと読む
- 未保存バッジを「自分の書き込みが残っている」と読む

最も価値の高い改善 1〜3:

1. 職員 Home から SharePoint ページ編集 CTA を業務導線と分離する（P0）
2. 見る専用CTAと記録/訂正CTAを分ける。結合「記録 / 手順表示」を止める（P1）
3. 適用中版と次版Draftを同じ人の計画面で並べ、Home相当のマネジメント要約を観測可能にする（P1）

## Next Actions

```text
Human:
  CORRECTION 確定済み
  Independent Definition Re-Review-2 = PASS / REVIEW-CLEARED
  Human Definition / Scope Lock GO = RECEIVED / CONSUMED
  NEXT = Human Implementation Start GO / HOLD
  Actual Staff Value Check は未実施のまま残す
  Simulation Outcome = CORRECTION を維持する

Agent:
  このシミュレーションを Actual Staff PASS に置換しない
  SIM-AUTH-001 を製品Issueにしない
  Ready / Merge / Deploy / LIVE WRITE をしない
  Correction-1 実装を Implementation Start GO なしで始めない
```
