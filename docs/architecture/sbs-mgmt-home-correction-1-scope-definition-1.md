# SBS-MGMT-HOME-CORRECTION-1 — Correction Scope Definition

```text
repository: yasutakesougo/severe-behavior-support-spfx
unit: SBS-MGMT-HOME-CORRECTION-1
kind: Correction Scope Definition
status: LOCKED
Definition Correction-1: APPLIED THEN LOCKED
lock packet: docs/architecture/sbs-mgmt-home-correction-1-definition-scope-lock-1.md
date: 2026-09-11
parent: docs/architecture/sbs-mgmt-home-correction-1-definition-start-1.md
correction: docs/architecture/sbs-mgmt-home-correction-1-definition-correction-1.md
re-review: docs/architecture/sbs-mgmt-home-correction-1-independent-definition-re-review-2.md
primary evidence:
  docs/architecture/sbs-mgmt-home-5-persona-real-browser-simulation-2.md
Definition Start GO: RECEIVED / CONSUMED
Independent Definition Review-1: CORRECTION REQUIRED / CONSUMED（内容レベル）
  exact-file consumption: PASS at Re-Review-2
Independent Definition Re-Review-2: PASS / REVIEW-CLEARED
Human Definition / Scope Lock GO: RECEIVED / CONSUMED
Implementation Start GO: HOLD / NOT RECEIVED
Actual Staff Value Check: NOT CONSUMED
Ready / Merge / Deploy / LIVE WRITE: NOT AUTHORIZED
```

この文書は **5 Persona が誤読した意味境界の修正だけ** に範囲を固定する。
機能追加、新しい業務フロー、永続化、適用開始、次版作成は OUT。

Definition Correction-1（C1–C6）を反映し、Human Definition / Scope Lock GO により **LOCKED**。
実装は開始しない。実装順序の先頭は C1（Re-Simulation P0=0 かつ P1=0）と C2（reviewDueDate authority）。

---

## 1. Primary evidence binding

Simulation 2 判定を再判定しない。切り出し対象 finding は次に対応する。

| Simulation 2 ID | Severity | Correction group |
|---|---|---|
| F-P0-001 | P0 | 1 編集・保存の意味境界 |
| F-P1-001 | P1 | 1 見る / 記録する 分離 |
| F-P1-002 | P1 | 1 READ-ONLY 導線から write CTA |
| F-P1-003 | P1 | 2 Active / Draft |
| F-P1-004 | P1 | 2 支援マネジメント到達 |
| F-P1-005 | P1 | 3 件数母集団 |
| F-P1-006 | P1 | 2 未実施 / 未記録 / 未保存 |
| F-P1-007 | P1 | 3 内部実装情報の非表示 |
| F-P2-001 | P2 | OUT（手順ID併記は人・場面ラベルがある。本 slice で必須にしない） |
| F-P2-002 | P2 | 3 英語左ナビ / ごみ箱 — in-shell のみ |
| F-P2-003 | P2 | 1 表示専用の作成する/編集する/保存する |

F-P2-001（`proc-morning` 等）は本 slice の必須 IN にしない。人・場面の日本語は既に併記されている。

---

## 2. Priority groups（fixed）

実装順序もこの順とする。Group 2 を Group 1 より先に広げない。

### Group 1 — P0 編集・保存の意味境界

IN:

```text
業務Home（SPFx シェル枠内）で、SharePoint のページ編集操作を
業務の保存・記録と誤認しにくくする（copy / in-shell 案内）。
「未保存」が何を保存していないのかを、利用者向けに明示する。
  - ページ/web part の未保存
  - 業務記録の未保存
  を同じ裸の「未保存」で置かない。
「見る」と「記録する / 訂正する / 取り消す」を別操作として表現する。
結合 CTA「この予定を記録 / 手順表示」を止める。
READ-ONLY の確認導線（記録を確認・再表示、支援計画を表示、見直し状況を表示）
の到着面で、書き込み操作を無意識の第一CTAにしない。
計画操作（表示専用）の 作成する / 編集する / 保存する を、
閲覧面の主操作に見せない。
```

OUT（Group 1）:

```text
Home.aspx の SharePoint コマンドバー自体をテナント設定で消す
ページ編集 / web part 編集 / Application Customizer によるサイト chrome 除去
業務記録の live 保存接続
訂正・取消の実書き込み実装
```

SharePoint 標準の `編集` / `+新規` はサイト chrome であり、本 slice はそれを **サイト mutation で消さない**。
シェル枠内で「上の編集はページ編集であり、支援の保存ではない」と誤認しにくくする。

### Group 2 — P1 Active / Draft / Review の状態理解

IN:

```text
同一利用者について、適用中 vN と 下書き vN+1（未適用）を
同じ文脈（同一人の計画面）で確認できるようにする。
「新しい計画」単独ラベルは使わない（C6）。INTENDED primary:
  次版下書き vN+1（未適用）
  または 新しい計画の下書き（まだ適用されていません）
計画・見直し担当が既存の「支援マネジメントを見る（読み取り専用）」へ
application-internal / 既存 host 内だけで到達できる（C5）。
未実施 / 未記録 / 未保存 は C3 に従う。
  未実施 = 実施状態の既存明示情報からのみ
  未記録 = 対象記録の正常取得・照合結果からのみ
  未保存 = 明示的 local/session draft、または既存保存状態 authority がある場合だけ
禁止:
  取得失敗 → 未記録
  source unavailable → 未実施
  保存状態不明 → 未保存
  データなし → 未保存
read-only Management Home は新しい保存状態・業務状態を推論しない。
```

OUT（Group 2）:

```text
新しい版の作成
plan activation
Draft の live 永続化
Monitoring と見直し資料の情報アーキテクチャ再設計（重複感の大規模整理）
Management Home の新しい第5カード / 新しい KPI
FIELD_STAFF に計画編集を開くこと
```

観測事実: 現行コードは PLANNER かつ fixture 一致の支援計画面にだけ
`支援マネジメントを見る（読み取り専用）` を出す。
実 Home の計画担当概要では heading `支援マネジメント` は未観測だった。
本 slice は **既存の読み取り専用 Management Home へ辿れること** であり、
新しいマネジメント製品を作ることではない。

### Group 3 — P1/P2 情報整合性

IN:

```text
今日の対象 / 利用者 全N名 / 今日の支援ボードの母集団契約（C4）:
  OrganizationId + SiteId でスコープ
  User identity = UserId
  全N名 = distinct UserId（Users roster RESOLVED）
  今日の対象 = 同一 UserId 空間の today support-target distinct UserId（全N名を超えない）
  ボード = occurrenceId の当日予定 subset（人数カードではない）
  UNAVAILABLE → 確認できません（0 にしない）
  部分取得を全体母集団として表示しない
  独立ハードコード 12 を人頭の確定値として置かない
reviewDueDate（C2 / #442 / #554）:
  除く = raw field / technical origin / caller-supplied 説明
  維持 = authoritative due semantics と Management Home の次回確認
  available → 次回確認日（再計算しない）
  unavailable → 確認できません != 期限なし != 未設定断定 != 0
  固定90日を導入しない
英語左ナビ / ごみ箱 = in-shell 案内のみ（C5）
```

OUT（Group 3）:

```text
SharePoint サイトナビゲーション編集
Home.aspx edit
tenant navigation mutation
site chrome mutation
リスト表示名のテナント変更
ごみ箱のサイトからの削除
新しい集計アルゴリズム / 新しいデータソース
手順ID（proc-*）の全面削除（任意の後続。本 slice 必須ではない）
deadline 再計算 / 固定90日
reviewDueDate authority / 次回確認 semantics の削除
```

サイト左ナビ変更は別 Human GO が必要である。Persona 4 の「迷わず到達」は
**シェル内 概要 → 利用者 → 支援計画** で成立させ、サイト chrome 除去に依存しない。

---

## 3. Explicit OUT（slice-wide）

```text
機能追加の横展開（新規ワークフロー、新規ロール、新規画面群）
Domain 状態機械の新設
Contracts / schema 破壊的変更（本誤認の表示契約に不要なら触らない）
plan activation / next-version preparation
LIVE WRITE / SharePoint List write
Home.aspx edit / web part add
Deploy / App Catalog / Production Binding
Entra / M365 設定
SIM-AUTH-001 の製品 Issue 化
Simulation 2 本文の判定改ざん
Actual Staff Value Check の実施または PASS 宣言
```

---

## 4. Intended presentation rules（INTENDED copy; pixel-exact は実装 Scope）

Human Lock 受信済み。C6 の採用可能文言は Correction-1 の 2 行に限る。第三の CTA を新発明しない。pixel-exact は Implementation Start GO 後の実装 Scope で決める。

| 規則ID | 規則 | 根拠 |
|---|---|---|
| R-VIEW | 閲覧専用の到着面の第一操作は見る / 戻るであり、記録する・訂正する・保存する・ページ編集ではない | P1 / Persona 1 |
| R-RECORD | 記録する・訂正する・取り消すは「見る」と別ラベル・別視覚強度 | F-P1-001, F-P1-002 |
| R-PAGE | SharePoint ページ編集は業務記録ではない、とシェル内で区別できる | F-P0-001 |
| R-UNSAVED | 裸の「未保存」を、ページ未保存と業務未保存で共用しない | F-P0-001, F-P1-006 |
| R-ACTIVE-DRAFT | 同一人の計画面で 適用中 vN と 下書き vN+1（未適用）が同時に読める | F-P1-003 |
| R-NEW-PLAN | 「新しい計画」単独禁止。未適用が primary wording の一部（C6） | F-P1-003 / P2-2 |
| R-MGMT | 計画担当から read-only 支援マネジメントへ in-app / 既存 host のみ到達（C5） | F-P1-004 / P2-1 |
| R-STATUS | 未実施 ≠ 未記録 ≠ 未保存。C3 の source と fail-closed | F-P1-006 / P1-3 |
| R-COUNT | C4 の UserId / occurrence 母集団。UNAVAILABLE ≠ 0 | F-P1-005 / P1-4 |
| R-INTERNAL | 利用者向けから raw reviewDueDate / caller-supplied 説明だけ除く。authoritative due は維持（C2） | F-P1-007 / P1-2 / #442 / #554 |

---

## 5. Re-Simulation Gate（後続。本文書では実施しない）

件数を減らすこと自体は合格条件にしない。次を Gate にする。

```text
Authenticated 5-Persona Re-Simulation PASS
=
  P0 = 0
  P1 = 0
  Persona 1–5 required meaning checks = PASS
  P2 = 明示的に non-blocking と判定されたものだけ carry-forward 可

Persona 1  「見るだけ」が安全に成立する
Persona 2  現状 PASS を維持する
Persona 3  Active と Draft / 未適用を区別できる
Persona 4  利用者 → 計画まで迷わず到達し、
           未実施 / 未記録 / 未保存を区別できる
Persona 5  件数と利用者単位の表示が整合し、
           Draft と Active を説明できる

Actual Staff Value Check
  この PASS 条件に含めない
```

```text
Authenticated 5-Persona Re-Simulation PASS
!= Actual Staff Value Check
!= Human Ready / Promotion
```

Re-Simulation も READ-ONLY。LIVE WRITE 禁止。
Start = 同一 Home.aspx 直 URL。初期表示が Management Home でなくても記録して継続する。

## 6. Verification during implementation（after Implementation Start GO only）

```text
npm test / typecheck の既存回帰
ManagementHome 既存テストを壊さない
today-support CTA ラベルのユニット
overview 件数と users fixture の母集団テスト
review-due 利用者向けコピーに caller-supplied / raw field が無いこと
authoritative 次回確認 / 確認できません は残ること
overview 母集団（UserId vs occurrenceId）と UNAVAILABLE ≠ 0
synthetic browser smoke（presentation only）
その後: authenticated 5-persona re-simulation
```

synthetic smoke は Re-Simulation を代替しない。

## 7. HOLD

```text
HOLD: Implementation Start GO なしでコード変更しない（Lock CONSUMED）
HOLD: C6 exact 日本語は INTENDED 2 行上限。pixel-exact は実装 Scope
HOLD: SharePoint サイトナビ変更は本 slice に含めない
```

P2 carry-forward（Definition Lock blocker ではない）:

```text
RR2-P2-1
  today_targets は現行 fixture で独立カード count: 12
  正本: docs/architecture/sbs-mgmt-home-correction-1-independent-definition-re-review-2.md
  Implementation Scope で既存 UserId subset を証明できないなら fail-closed
  12 を人数として再利用しない
```

## 8. Next Actions

```text
Human:
  Human Implementation Start GO / HOLD
  Lock CONSUMED != Implementation Start

Agent:
  実装しない
  Simulation 2 を primary evidence のまま残す
  RR2-P2-1 を Implementation Scope 必須証明として残す
```
