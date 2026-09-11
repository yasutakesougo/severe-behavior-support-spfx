# SBS-MGMT-HOME-CORRECTION-1 — Definition Correction-1

Independent Definition Review-1 の **CORRECTION REQUIRED** に応答する。
Human Definition / Scope Lock GO は **CONSUMED**。実装、Implementation Start、Actual Staff、Ready は開始しない。

```text
repository: yasutakesougo/severe-behavior-support-spfx
unit: SBS-MGMT-HOME-CORRECTION-1
kind: Definition Correction-1（docs-only）
date: 2026-09-11
parent Definition Start:
  docs/architecture/sbs-mgmt-home-correction-1-definition-start-1.md
scope being corrected:
  docs/architecture/sbs-mgmt-home-correction-1-scope-definition-1.md
primary evidence:
  docs/architecture/sbs-mgmt-home-5-persona-real-browser-simulation-2.md
Independent Definition Review-1: CORRECTION REQUIRED / CONSUMED（内容レベル）
  exact-file consumption: PASS at Re-Review-2
Independent Definition Re-Review-2: PASS / REVIEW-CLEARED
Human Definition / Scope Lock GO: RECEIVED / CONSUMED
lock packet: docs/architecture/sbs-mgmt-home-correction-1-definition-scope-lock-1.md
Implementation Start GO: HOLD / NOT RECEIVED
Actual Staff Value Check: NOT CONSUMED
Human Ready / Promotion: NOT IMPLIED
SIM-AUTH-001 product Issue: NOT CREATED
Repository / tenant mutation: 0
```

## 1. Review-1 判定の取り込み

```text
VERDICT = CORRECTION REQUIRED
P0 = 0
P1 = 4（P1-1 … P1-4）
P2 = 2（P2-1, P2-2）
```

Review-1 が維持した境界は本 Correction でも維持する。

```text
見る != 記録する != 訂正する != SharePointページを編集する
SupportPlan.currentVersion = current applied authority
Draft exists != Applied
RevisionIntent CONSUMED != Applied
UNKNOWN / UNAVAILABLE != NONE / ZERO / 未実施
SharePoint page Edit = tenant mutationで除去しない
Apply / next-version creation / LIVE WRITE = OUT
SharePoint / M365 / Entra mutation = OUT
READ-ONLY Management Home
no write-first primary CTA
Simulation 2 = primary simulation evidence != Actual Staff substitute
Actual Staff Value Check = separate Gate
```

既存 authority（再計算しない）:

```text
#442 / SP-LC-3
  reviewDueDate は caller-supplied だが authoritative due input
  固定90日 / hard overdue を導入しない
  期限を本 slice で再計算しない
  正本: docs/architecture/review-due.md
        docs/architecture/sp-lc-3-d5-residual-reassessment-1.md

#554 / SBS-MGMT-HOME-C
  Management Home = read-only
  Draft != Applied
  existing deadline authority の人向け表示
  取得不能 != なし / 0件
```

## 2. Required Correction C1–C6

優先: **C1（Re-Simulation P1=0）と C2（reviewDueDate authority）を先に固定する。**

### C1 — Re-Simulation PASS（closes P1-1）

```text
Authenticated 5-Persona Re-Simulation PASS
=
  P0 = 0
  P1 = 0
  Persona 1–5 required meaning checks = PASS
  P2 = 明示的に non-blocking と判定されたものだけ carry-forward 可

Actual Staff Value Check
  この PASS 条件に含めない
  Simulation PASS 後も別 Gate
```

Persona meaning checks（C1 に含まれる。件数減だけでは合格にしない）:

```text
Persona 1  「見るだけ」が安全に成立する
Persona 2  現状 PASS を維持する
Persona 3  Active と Draft / 未適用を区別できる
Persona 4  利用者 → 計画まで迷わず到達し、
           未実施 / 未記録 / 未保存を区別できる
Persona 5  件数と利用者単位の表示が整合し、
           Draft と Active を説明できる
```

### C2 — reviewDueDate（closes P1-2）

利用者向け画面から除くもの:

```text
raw field name「reviewDueDate」
technical origin 説明
「caller-supplied」という内部実装説明
```

維持するもの:

```text
authoritative review due semantics（#442）
Management Home 上の次回確認情報（#554）
```

表示規則:

```text
authority available
  → 次回確認日を人向けに表示（再計算しない）
authority unavailable
  → 「確認できません」
authority unavailable
  != 期限なし
  != 未設定と断定
  != 0
deadline を再計算しない
固定90日を導入しない
```

R-INTERNAL の誤読防止:

```text
「利用者向けから除く」
= raw / technical / caller-supplied 説明の露出を除く
!= reviewDueDate authority / deadline semantics の削除
```

### C3 — 未実施 / 未記録 / 未保存 source-of-truth（closes P1-3）

```text
未実施
  = 実施状態を示す既存の明示情報からのみ表示
  （例: 日次ボード occurrence の effectiveStatus）

未記録
  = 対象記録の正常取得・照合結果からのみ表示

未保存
  = 明示的な local/session draft 状態、
    または既存保存状態 authority が存在する場合だけ表示
  save_outcome_unknown は「保存結果不明」のまま
  未保存に畳まない
```

禁止:

```text
取得失敗 → 未記録
source unavailable → 未実施
保存状態不明 → 未保存
データなし → 未保存
```

```text
read-only Management Home
  新しい保存状態や業務状態を推論してはならない
```

### C4 — 母集団契約（closes P1-4）

見た目の数字合わせだけでは足りない。単位・境界・fail-closed を固定する。

共通境界:

```text
Organization boundary = 現在の表示 OrganizationId
Site boundary         = 現在の表示 SiteId
User identity         = UserId
source availability   = RESOLVED | UNAVAILABLE | 部分取得
UNAVAILABLE
  → 「確認できません」
  → 件数を 0 にしない
部分取得した母集団を全体母集団として表示しない
```

| 画面上の数 | 単位 | dedup key | 母集団 |
|---|---|---|---|
| 利用者「全N名」 | 人 | UserId | 当該 Org+Site の Users roster で RESOLVED した distinct UserId |
| 今日の対象 | 人 | UserId | 同一 UserId 空間のうち、today support-target set に入る distinct UserId。Users roster と別ハードコード件数にしてはならない。N は全N名を超えない |
| Aさんボード（今日の支援） | 予定 | occurrenceId | 上記 today-target UserId 集合に属する当日 occurrence の subset。人数カードではない |

```text
独立ハードコード「今日の対象 12」を
全N名（UserId）と同じ確定人数として置くこと = FORBIDDEN
```

デモで当日ボードが一部 UserId しか出さない場合、subset であることを人数カードと矛盾しない語で示す。
「別集合です」と書きつつ 12 を人頭に見せることは禁止する。

### C5 — navigation（closes P2-1）

```text
計画担当から既存 read-only 支援マネジメントへの到達
= application-internal navigation
  または既存 host（Home.aspx 上の既存 SPFx シェル）内の既存導線
```

OUT 維持:

```text
SharePoint site navigation edit
Home.aspx edit
tenant navigation mutation
site chrome mutation
```

英語左ナビ / ごみ箱対応 = in-shell 案内・説明のみ。

### C6 — 「新しい計画」primary wording（closes P2-2）

「新しい計画」を単独ラベルにしない。未適用は補足ではなく意味の一部として常に読める。

INTENDED primary wording（Lock CONSUMED。Implementation Scope S-DRAFT が実行時 1 行に固定）:

```text
次版下書き vN+1（未適用）
```

または同等:

```text
新しい計画の下書き（まだ適用されていません）
```

```text
SupportPlan.currentVersion = 適用中
Draft vN+1 = 未適用
RevisionIntent CONSUMED != Applied
```

## 3. Confirmed OUT（unchanged）

```text
Apply / plan activation
next-version creation
LIVE WRITE
SharePoint / M365 / Entra mutation
Home.aspx / site chrome / site nav mutation
新しいマネジメント製品
Management Home が write-first CTA を持つこと
Actual Staff を Simulation PASS に含めること
SIM-AUTH-001 の製品 Issue 化
```

## 4. Status after this Correction

```text
Definition Correction-1 = APPLIED THEN LOCKED
exact-file re-read = PASS
Independent Definition Re-Review-2 = PASS / REVIEW-CLEARED
Human Definition / Scope Lock GO = RECEIVED / CONSUMED
Implementation Start GO = HOLD / NOT RECEIVED
```

Human Definition / Scope Lock GO != Implementation Start GO  
Implementation Start GO != Actual Staff / Ready / Promotion / Merge / Deploy / LIVE WRITE

## 5. Next Gate

```text
SBS-MGMT-HOME-CORRECTION-1
Independent Definition Re-Review-2 = PASS / REVIEW-CLEARED
        ↓
Human Definition / Scope Lock GO = RECEIVED / CONSUMED
        ↓
Implementation Scope Definition = RECORDED / CANDIDATE
        ↓
Independent Implementation Scope Review / HOLD
        ↓
separate Human Implementation Start GO / HOLD
```

```text
Agent: 実装しない
```
