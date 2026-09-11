# SBS-MGMT-HOME-CORRECTION-1 — Independent Implementation Scope Review-1

```text
repository: yasutakesougo/severe-behavior-support-spfx
unit: SBS-MGMT-HOME-CORRECTION-1
kind: Independent Implementation Scope Review-1
task class: REVIEW
risk: HIGH
mode: docs read + review packet only
date: 2026-09-11
branch: cursor/sbs-mgmt-home-5-persona-sim-c53a
tip at review: b6a77ea7c3cb816f4b667c3956e7adce19a4fad9
verdict: CORRECTION
P0 = 0
P1 = 2
P2 = 2 / EXPLICIT NON-BLOCKING ONLY
Implementation Start GO: NOT CONSUMED / NOT ELIGIBLE
Implementation: NOT AUTHORIZED
Actual Staff Value Check: NOT CONSUMED
Ready / Merge / Deploy / LIVE WRITE: NOT AUTHORIZED
product / SPFx / fixture mutation: 0
```

Independent Implementation Scope Review-1

Verdict:
CORRECTION

P0:
0

P1:
2

P2:
2

Findings:
- ISR1-P1-1 S-DRAFT が N+1 を `draft.candidate.version` **または** `conceptualNextVersion` としている。後者は Draft 実体ではなく「次の版の考え方」。C6 の Draft ≠ Applied を実装者が再解釈できる。
- ISR1-P1-2 S-POP は missing を「確認できません」かつ 0 禁止とするが、現行 `OverviewKpiCard.count: number` の UNAVAILABLE 表現を固定していない。実装者が 0 / 12 / 番兵値を選べる。
- ISR1-P2-1 S-NAV が「既存ボタン」と「概要からの同等リンク 1 本」を併記。新 navigation architecture を足す余地がある。
- ISR1-P2-2 Files IN の「対応する既存 *.test.ts / *.test.tsx」が上限として開いている。

RR2-P2-1:
STILL OPEN

C1–C6 semantic preservation:
FAIL

Implementation exactness:
INSUFFICIENT

Scope creep:
FOUND

Human Implementation Start GO eligibility:
NOT ELIGIBLE

Repository mutation:
0

```text
This packet
= Independent Implementation Scope Review of the Candidate
!= Implementation Start
!= Scope Correction applied
!= Re-Sim
!= Actual Staff Value Check
```

STOP after this packet. Do not consume Implementation Start GO.

---

## Exact review basis

| Artifact | git blob / commit | Role |
|---|---|---|
| Definition Correction-1 C1–C6 | `debd3992dee917eecd1dbae86f137a781b764a8b` @ `38c5439` | Locked semantic baseline |
| Correction Scope | `685b343b174ada3b911e79a6d794aaaa5cce8d22` @ `38c5439` | Locked IN/OUT |
| Definition / Scope Lock | `98eac53fc6238dee0cc2ac0fcecaa0394ed5cb34` @ `ebe8f9f` | Human Lock CONSUMED |
| Implementation Scope Candidate | `aff19e25db47fe2c9d4776acad2ad722bdfb675e` @ `b6a77ea` | Review target |
| Simulation 2 | Outcome **CORRECTION** maintained（再判定しない） | Evidence |

C1–C6 meaning は Re-Review-2 PASS blobs で読む。Lock / Candidate の NEXT 行更新は判定材料にしない。

Code は **read-only 照合**（変更しない）:

```text
spfx/src/shell/dashboard/overview-fixture.ts          today_targets count: 12
spfx/src/shell/dashboard/overview-types.ts            OverviewKpiCard.count: number
spfx/src/shell/dashboard/overview.test.ts             asserts [12, 3, 2, 3]
spfx/src/shell/users/users-fixture.ts                 rows id user-a … user-h / 全8名
spfx/src/shell/procedure/kiosk-today-support-fixture.ts  KIOSK_FIXTURE_USER_ID = user-a
spfx/src/sbs-domain/kiosk-read-model.bundle.d.ts      TodaySupportItem.userId 既存
spfx/src/shell/users/support-plan-fixture.ts          conceptualNextVersion = 4
spfx/src/shell/users/management-home-fixture.ts       draft.candidate.version = 4（Aさん）
spfx/src/shell/users/user-detail-fixture.ts           Cさん Draft 無し / 現行版のみ
```

---

## CHECK 1 — S-POP / RR2-P2-1

| 要求 | Candidate | Independent result |
|---|---|---|
| 全N名 = `DEMO_UX_USERS_FIXTURE` UserId | `rows[].id` + summary 全8名 | **PASS**（user-a…h を read-only 確認） |
| 今日の対象 = `TodaySupportItem.userId` ∩ roster | S-POP Decision | **PASS**（既存フィールド。新ソース無し） |
| fixture 12 を人数に使わない | FORBIDDEN 明示 | **PASS**（規則） |
| items missing → 確認できません | 欠落 / UNAVAILABLE 分岐 | **規則 PASS** |
| missing を 0 にしない | 明示 | **規則 PASS** |
| 新集計 / 新 data source 無し | countRowsWithBadgeId と同型 | **PASS** |
| subset 証明不能 → fail-closed | 12 に戻さない | **規則 PASS** |
| implicit fallback 12 / 無関係 array length | FORBIDDEN: occurrence 件数・personLabel unique | **規則 PASS** |
| UNAVAILABLE を KPI カードへどう載せるか | 未固定。`count: number` 必須型のまま | **P1 / ISR1-P1-2** |

現行合成に S-POP を機械適用すると distinct UserId = `user-a` → 1。12 の既存結合は無い。これは証明として足りる。

足りないのは **fail-closed の表示契約**。`OverviewKpiCard` は `count: number`。実装者は次を独断できる:

```text
count: 0 + hint「確認できません」     ← C4 違反になり得る
count: 12 を残す                     ← RR2-P2-1 再利用
count: -1 等の番兵
型を変える（本 Scope は shape を書いていない）
```

そのため RR2-P2-1 はソース規則としては閉じたが、**実装着手可能な exact slice としては STILL OPEN**。BLOCKING（12 再利用を許可）ではない。

---

## CHECK 2 — S-DRAFT / C6

| 要求 | Candidate | Independent result |
|---|---|---|
| 実行時 copy が `次版下書き vN+1（未適用）` のみ | S-DRAFT 1 行固定。同等文は画面に出さない | **PASS**（文言） |
| Cさんに Draft fixture を新造しない | 明示 OUT | **PASS** |
| Persona 3 は Aさん面 | MANAGEMENT_HOME draft v4 | **PASS** |
| Draft 不在を別状態へ推測しない | Cさん「新しい計画があります」を消す | **PASS**（不在の主張削除） |
| Definition の意味を増やさない | `N+1 = draft.candidate.version **または** conceptualNextVersion` | **FAIL / ISR1-P1-1** |

`conceptualNextVersion` は `support-plan-fixture.ts` の「次の版の考え方」（SUPPORT_PLAN_NEXT_VERSION）であり、Draft 実体ではない。Aさん計画面は currentVersion=3 と conceptualNextVersion=4 を持つ。Draft オブジェクトは Management Home fixture 側。

実装者が conceptualNextVersion だけで `次版下書き v4（未適用）` を出すと:

```text
Draft exists != Applied
```

を「次版の概念がある = 下書きがある」へ再解釈する。C6 / C1 Persona 3 の意味を拡張する。**Scope creep FOUND。**

Correction に必要な固定（本 review では適用しない）:

```text
次版下書き vN+1（未適用）
  を出してよい
  iff 既存 draft 実体がある（例: draft.candidate.version）
conceptualNextVersion 単独では出さない
Draft が無い対象（Cさん）は現行版のみ。確認できませんへ畳まない。
```

---

## CHECK 3 — CTA separation

結合 CTA を 2 操作に分け、遷移は既存 `onSelectOccurrence` / 既存記録入口のまま。新ワークフロー禁止。

`AppShellChrome` の overview `onSelectOccurrence` は既存 `handleTodayActionNavigate({ kind: "occurrence" })`。ラベル分割は authority を増やさない。

「未実施・未記録相当」は occurrence `effectiveStatus` に C3 の未記録を持ち込む余地があるが、現行結合ラベルは else 分岐（非 記録済み / 取消済み / 確認が必要）。**CHECK 3 = PASS**。未記録語の混在は P2 相当の注意であり、本 review では P1 に上げない（else 分岐を分割すれば C3 を増やさない）。

---

## CHECK 4 — correction / cancellation

S-VIEW: 確認到着面の第一操作を戻る / 見る、訂正・取消は secondary。削除しない。live write OUT。approval gate なし。

**PASS**

---

## CHECK 5 — page edit vs business save

S-PAGE: in-shell 案内のみ。コマンドバー除去なし。新 persistence / 新 ShellSaveState キーなし。

**PASS**

---

## CHECK 6 — overlay missing semantics

S-UNSAVED:

```text
明示 session unsaved → 記録が未保存
save_outcome_unknown → 保存結果不明（C3。未保存に畳まない）
undefined / missing overlay → 出さない（未保存にしない）
```

C3 @ `38c5439`: データなし → 未保存 禁止。不明は 保存結果不明。取得不能を 未実施 / 未記録へ畳まない。

CHECK 6 文面の「確認できません」は **UNAVAILABLE 件数・期限** の C4/C2 語彙。session overlay の missing を「確認できません」にすると、無い下書きを取得不能へ推測する（C3 違反になり得る）。

Candidate の hide は Locked C3 に沿う。missing ≠ 未保存、missing ≠ 0。**PASS**（C3 優先。CHECK 6 を overlay に機械適用して 確認できません を新発明してはならない）。

---

## CHECK 7 — PLANNER entry

既存 `SupportPlanWithManagementHome` ボタンを維持。FIELD_STAFF に開かない。サイトナビ OUT。

「または同一 host 内の同等リンク 1 本」は **新導線を足す選択**を残す。**CHECK 7 = PASS with P2 / ISR1-P2-1**。Correction では既存計画面ボタンのみを IN とし、概要への新規リンクを OUT にするのが fail-closed。

---

## CHECK 8 — deadline authority

人向けから `reviewDueDate` / `caller-supplied` を除く。値・#442 / 次回確認 / 確認できません / 90 日禁止を維持。内部 flag `callerSuppliedDueAuthorized` は残してよい。

置換文は期限再計算ではない。**PASS**

---

## CHECK 9 — exact implementation boundary

Files IN はシェル presentation に閉じ、domain bundle / contracts / schema を OUT としている。C2/C5/CTA/PAGE は実装者が schema を決めなくてよい。

実装者が決めなければならない残り:

```text
ISR1-P1-1  Draft の N の authority（population ではないが Draft semantics）
ISR1-P1-2  UNAVAILABLE 今日の対象カードの shape（population display contract）
ISR1-P2-1  入口リンクを増やすか
ISR1-P2-2  テスト glob の上限
```

CHECK 9 不合格条件「population authority / Draft semantics を実装者が決める」に **ISR1-P1-1 と ISR1-P1-2 が該当**。**INSUFFICIENT**

---

## CHECK 10 — prohibited work（this review）

| 禁止 | 本 review |
|---|---|
| SPFx / domain code | 未変更 |
| fixture mutation | 未変更 |
| Re-Sim | 未実施 |
| Actual Staff Value Check | 未消費 |
| Ready / Merge / Deploy / LIVE WRITE | 未実施 |
| Implementation Start GO 推定・消費 | しない |
| 本 packet 以外の製品 mutation | 0 |

docs に本 review を記録することだけが後続 commit の許可範囲。Candidate 本文の Correction は別単位。

---

## C1–C6 map

| ID | Preservation | Note |
|---|---|---|
| C1 Re-Sim Gate | PASS（触れない） | Start 後。Actual Staff 除外維持 |
| C2 due authority | PASS | copy のみ |
| C3 status SoT | PASS | overlay hide + 保存結果不明 |
| C4 population | FAIL-closed 規則は PASS。表示 shape 不足 | ISR1-P1-2 |
| C5 nav | PASS + P2 | 既存 host。任意リンクが creep |
| C6 Draft copy | 文言 PASS。N の根拠 FAIL | ISR1-P1-1 |

Overall **C1–C6 semantic preservation = FAIL**（C6 authority と C4 表示契約）。

---

## Findings table

| ID | Severity | Status | Content |
|---|---|---|---|
| ISR1-P1-1 | P1 | OPEN | S-DRAFT `N+1 = draft.candidate.version または conceptualNextVersion`。conceptualNextVersion 単独表示は Draft 捏造。Scope Correction で draft 実体のみに bind する。 |
| ISR1-P1-2 | P1 | OPEN | S-POP fail-closed を `OverviewKpiCard.count: number` 上で 0/12 以外にどう表すか未決。UNAVAILABLE カード shape を Scope で固定する。 |
| ISR1-P2-1 | P2 | OPEN / NON-BLOCKING | S-NAV の「同等リンク 1 本」。Correction では既存 `支援マネジメントを見る（読み取り専用）` のみ IN。 |
| ISR1-P2-2 | P2 | OPEN / NON-BLOCKING | Files IN のテスト glob。named test パスに閉じる。 |
| RR2-P2-1 | P2 | STILL OPEN | 12 再利用は Candidate で禁止済み。ISR1-P1-2 が閉じるまで実装 exact ではない。 |

```text
P0 = 0
P1 = 2
P2 = 2 / EXPLICIT NON-BLOCKING ONLY
```

---

## Does NOT authorize

```text
Human Implementation Start GO
SPFx / domain / fixture 実装
Home.aspx / SharePoint / LIVE WRITE
Ready / Merge / Deploy
Actual Staff Value Check
Candidate 本文の無断修正（Scope Correction-1 は別単位）
```

## NEXT

```text
Agent:
  Implementation Scope Correction-1（docs-only）
  ISR1-P1-1 / ISR1-P1-2 を閉じる
  実装しない
  Implementation Start GO を消費しない

Human:
  Scope Correction と Independent Re-Review の後
  Human Implementation Start GO / HOLD

Independent Implementation Scope Review-1 = CORRECTION
!= Implementation Start
!= PASS
```
