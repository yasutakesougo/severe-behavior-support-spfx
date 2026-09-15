# SBS-ROLE-TASK-FIRST-IA-V1 — Correction-2 Complete Controlled Packet

```text
repository: yasutakesougo/severe-behavior-support-spfx
workstream: SBS-ROLE-TASK-FIRST-IA-V1
record type: Correction-2 Complete Controlled Packet
kind: Definition packet (single body)
status: COMPLETE / AWAITING FRESH INDEPENDENT DEFINITION RE-REVIEW
normative surface: THIS PACKET BODY ONLY
attachment / sidecar: EXCLUDED / NON-NORMATIVE
parent: SBS-ROLE-TASK-FIRST-IA-V1 Correction-1 Complete Controlled Packet
parent location: Notion page body
  https://app.notion.com/p/3dc128e1229d81ea9350eba5c55d2a6c
Independent Definition Re-Review-1: HOLD / CORRECTION REQUIRED / CONSUMED
  (P0=0, P1=2, P2=2; Human Definition / Scope Lock = NOT YET ELIGIBLE)
Correction-1: APPLIED / CONSUMED (CORR-1A / CORR-1B / CORR-1C)
Correction-2: APPLIED / THIS PACKET (CORR-2A / CORR-2B only)
Human Definition Lock: NOT GENERATED / NOT CONSUMED
Human Implementation Start / Ready / Merge / Deploy: NOT AUTHORIZED
Implementation Authority: NONE
Repository Mutation (product / schema / persistence / SPFx): NONE at this gate
SharePoint / M365 / Entra mutation: NOT AUTHORIZED
Notion production page update: NOT PERFORMED (permission-matrix 禁止)
```

This document is the complete Controlled Packet after Correction-2.

Reviewers must use this body only. Attachments, transcripts, and Notion sidecars are non-normative.

Creating or reviewing this packet does not create Implementation Authority and does not consume Human Gates.

---

## Packet identity

```text
Workstream = SBS-ROLE-TASK-FIRST-IA-V1
Record Type = Correction-2 Complete Controlled Packet
Parent = Correction-1 Complete Controlled Packet (Notion body)
Independent Definition Re-Review-1 = HOLD / CORRECTION REQUIRED / CONSUMED
Correction-2 Exact Slice = CORR-2A + CORR-2B
Skeleton change = NOT REQUIRED / NOT PERFORMED
NEXT = Fresh Independent Definition Re-Review
```

Unchanged in meaning from Correction-1 unless a later section marks a CORR-2 replacement:

- C1 / C2
- C3 complete Task tables
- C4 Destination inventory (IDs, Purpose, Primary info/action, Completion, Next) except Entry / identity rows called out in §7–§8
- PLANNER Global = `今の工程 · 探す`
- C6 orientation rules
- C7 / C8
- C9 six numbered Human Task Acceptance scenarios
- presentation Role ≠ authorization Role
- Product vs Governance
- Browser Smoke ≠ Human Task PASS
- SHELL-UX-7 dual-run REJECTED as product target (CORR-1A)

---

## 0. Why Correction-2 exists

Independent Definition Re-Review-1 found no P0 that would discard Top-Level IA.

It found two P1 navigation-semantic gaps that implementers must not choose:

```text
P1-1  Global item → Destination / context resolution is not unique
P1-2  D-HOME vs Role first Destination identity is not unique
```

P2-1 (quiet 合成 badge) and P2-2 (AA-T1 cadence) remain Open Questions. They are not Correction-2.

---

## 1. Correction-2 Exact Slice

```text
IN
  CORR-2A  each Top-Level Global item
           → Entry Condition
           → Destination
           → context不足時の意味

  CORR-2B  D-HOME vs Role first Destination
           identity / separation contract per Role

OUT
  C1 / C2 / C3 rewrite
  new Destinations (no Search Hub, no context-resolver place)
  PLANNER Global item list change
  C7 / C8 / C9 rewrite
  six HTA rewrite
  React / CSS / router / schema / LIVE WRITE
  Entra / Deploy
  new 制度責任者
  Human Lock / Start / Ready / Merge
  consuming a Gate to repeal SHELL-UX-7 in the Decision ledger
```

---

## 2. CORR-2A — Global → Destination / context resolution

### 2.1 Contract shape (normative)

Every Top-Level Global item has exactly one of these tuples. Implementers do not pick among leftovers.

```text
Global Item
→ Entry Condition
→ Destination (context sufficient)
→ context不足時の意味（fallback Destination + what is NOT done）
```

Standing rules for all Roles:

```text
1. Global item remains available. Default is NOT to disable the item.
2. No new Destination is invented for resolution
   (no Search Hub, no Context Resolver place).
3. Empty procedure / empty write form is NOT a Destination meaning.
4. One Global item does not resolve to two Destinations at once.
5. 「探す」is person-find from Global.
   Record-find is in-flow, never a second Global meaning of 探す.
```

### 2.2 FIELD_STAFF Global resolution

Global items (ordered, unchanged): `今日 · 手順 · 記録する · 未記録 · 探す`

| Global item | Entry Condition | Destination when context sufficient | context不足時の意味 |
|---|---|---|---|
| 今日 | usable session + FIELD_STAFF | D-TODAY | Context is not required. D-TODAY is the day’s object list. |
| 手順 | usable session + FIELD_STAFF | D-PROCEDURE, only if current support object exists | Go to D-TODAY so the object can be chosen first. Do not open D-PROCEDURE empty. Do not disable 手順. |
| 記録する | usable session + FIELD_STAFF | D-RECORD-WRITE, only if current occurrence / procedure context exists | Go to D-UNRECORDED (the job of choosing what to record). Do not open D-RECORD-WRITE empty. Do not disable 記録する. Empty D-UNRECORDED is valid; do not bounce to D-TODAY. |
| 未記録 | usable session + FIELD_STAFF | D-UNRECORDED | Context is not required. Empty list is still D-UNRECORDED. |
| 探す | usable session + FIELD_STAFF | D-FIND-PERSON | Context is not required. D-FIND-RECORD is not this item. |

`current support object` = person + support occurrence already in Role context (D-TODAY selection, D-PERSON, or in-progress procedure). The Global item does not mint that object.

`current occurrence / procedure context` = the occurrence (and its current procedure, when relevant) already identified from D-PROCEDURE completion or from an unrecorded item. The Global item does not mint a blank record.

### 2.3 PLANNER Global resolution

Global items (ordered, unchanged): `今の工程 · 探す`

| Global item | Entry Condition | Destination when context sufficient | context不足時の意味 |
|---|---|---|---|
| 今の工程 | usable session + PLANNER | D-HOME (cycle orientation; see CORR-2B) | Still D-HOME. Unknown cycle position is shown as fail-closed orientation, not guessed as D-ASSESS. Primary Action does not enter a Task Destination until the current cycle place is known. |
| 探す | usable session + PLANNER | D-FIND-PERSON | Context is not required. D-FIND-RECORD is not this item. |

D-ASSESS / D-PLAN / D-MONITOR / D-REVIEW / D-NEXT remain Destinations. They are reached from D-HOME Primary Action or from PROCESS-VISIBILITY in-flow (①–⑥), not as a second meaning of Global `今の工程`.

### 2.4 ADMIN_AUDIT Global resolution

Global items (ordered, unchanged): `運用確認 · 証跡 · 探す`

| Global item | Entry Condition | Destination when context sufficient | context不足時の意味 |
|---|---|---|---|
| 運用確認 | usable session + ADMIN_AUDIT | D-OPS | Context is not required. D-OPS is the ops object list. |
| 証跡 | usable session + ADMIN_AUDIT | D-EVIDENCE | Context is not required. D-EVIDENCE is the evidence index. Do not open a specific record until an object is chosen there or from D-PERSON. |
| 探す | usable session + ADMIN_AUDIT | D-FIND-PERSON | Context is not required. D-FIND-RECORD is not this item. |

### 2.5 Rejected Global resolutions (normative)

```text
REJECTED: Global 探す → D-FIND-PERSON and D-FIND-RECORD (dual)
REJECTED: Global 探す → new Search Hub Destination
REJECTED: Global 手順 / 記録する → empty Destination content
REJECTED: Global 手順 / 記録する → disabled when context missing
REJECTED: Global 今の工程 → five Destinations chosen by implementer
REJECTED: context resolver as its own Destination
```

### 2.6 In-flow record find (so C4 stays complete)

`D-FIND-RECORD` remains. It is not a Global item.

```text
D-FIND-RECORD Entry
= in-flow only
  PLANNER: D-MONITOR / PROCESS-VISIBILITY ③ / D-PERSON / D-RECORD-READ
  ADMIN_AUDIT: D-EVIDENCE / D-PERSON / D-RECORD-READ
  FIELD_STAFF: D-PERSON / D-RECORD-READ / D-UNRECORDED (read existing; write stays D-RECORD-WRITE)
≠ Global「探す」
```

---

## 3. CORR-2B — D-HOME vs Role first Destination identity

### 3.1 Per-Role fixed choice

The Re-Review allowed Alias or Distinct per Role. This packet fixes one choice per Role. Implementers do not mix them inside a Role.

| Role | Choice | Identity contract |
|---|---|---|
| FIELD_STAFF | **A. Alias** | `D-HOME == D-TODAY` |
| PLANNER | **B. Distinct** | `D-HOME ≠ D-ASSESS` (and ≠ D-PLAN / D-MONITOR / D-REVIEW / D-NEXT) |
| ADMIN_AUDIT | **A. Alias** | `D-HOME == D-OPS` |

### 3.2 FIELD_STAFF (Alias)

```text
D-HOME identity = D-TODAY
Location identity (C6) = 今日の支援
Purpose = FS-T1
Primary information = 当日対象・これからやること
Primary action = 対象の支援を始める
First paint = D-TODAY
Global「今日」= D-TODAY
```

There is no second Product place named 「今日 / 今やること」 beside D-TODAY.

C4 row `D-HOME` is not a distinct FIELD_STAFF Destination. For this Role it is an alias label for D-TODAY.

### 3.3 PLANNER (Distinct)

```text
D-HOME
  Purpose = 今の工程の所在と次の一手（orientation）
  Primary information = サイクル上の現在地、次の一手
  Primary action = 現在地の Task Destination へ進む
                   （現在地が不明なら進まない / fail-closed copy）
  First paint = D-HOME
  Global「今の工程」= D-HOME
  Completion = 今どの工程にいるかと次の一手が分かる
  Next = current-cycle Destination among
         D-ASSESS / D-PLAN / D-MONITOR / D-REVIEW / D-NEXT

D-ASSESS … D-NEXT
  Purpose = each PL-T* execution Destination (unchanged from Correction-1)
  These are not D-HOME.
```

C6: Location identity changes when leaving D-HOME for D-PLAN (and the reverse). Orientation copy on a Task Destination is in-flow PROCESS-VISIBILITY, not a second Global row.

### 3.4 ADMIN_AUDIT (Alias)

```text
D-HOME identity = D-OPS
Location identity (C6) = 運用確認
Purpose = AA-T1
Primary information = 未記録・要確認・運用の穴
Primary action = 対象へ辿る
First paint = D-OPS
Global「運用確認」= D-OPS
```

There is no second Product place named 「今日 / 今やること」 beside D-OPS for this Role.

### 3.5 Shared C4 D-HOME row (replacement)

Correction-1 shared D-HOME as a place whose Next was 「Role の第一 Destination」. That duplicated D-TODAY / D-OPS and left PLANNER underspecified.

Replacement meaning:

```text
D-HOME
= Role-scoped identity, not a universal extra Product place

FIELD_STAFF: alias of D-TODAY
ADMIN_AUDIT: alias of D-OPS
PLANNER: distinct orientation Destination（今やることの地図。Task 実行場所ではない）
```

---

## 4. C1 / C2 (unchanged meaning)

Problem: staff cannot start, reach, or finish the job. Taxonomy nav is not Role → Task.

Outcome: Human Task Acceptance, not Browser Smoke.

Roles: FIELD_STAFF / PLANNER / ADMIN_AUDIT are presentation Roles only. Authorization roles are a separate layer. Viewport ≠ Role. ADMIN_AUDIT does not mint edit authority.

---

## 5. C3. Task Inventory (complete tables — normative)

Tasks are jobs, not screen ids.

### FIELD_STAFF

| ID | Task | Trigger | Object | Done when | Next |
|---|---|---|---|---|---|
| FS-T1 | 今日の支援を始める | 勤務開始 / アプリを開く | 当日の対象利用者・予定された支援 | 今日やる対象と最初の一手が分かる | FS-T2 |
| FS-T2 | 手順を確認する | 支援の直前・最中 | 当該支援の現行手順 | 今やる手順が現行版として識別できる | FS-T3 |
| FS-T3 | 支援結果を記録する | 実施後（できた / できなかった含む） | 当該発生・当該手順 | 事実結果が記録済み、または回復可能な失敗が分かる | FS-T1 or FS-T4 |
| FS-T4 | 未記録・気になる変化に対応する | 抜け・変化・気になる点 | 未記録の発生または対象利用者 | 対象に戻って記録または確認が終わる | FS-T2 / FS-T3 |

### PLANNER

| ID | Task | Trigger | Object | Done when | Next |
|---|---|---|---|---|---|
| PL-T1 | アセスメントを確認・進める | 新規 / 見直し前 | 対象利用者の評価情報 | 計画に必要な評価の所在と次操作が分かる | PL-T2 |
| PL-T2 | 支援計画を扱う | 作成・確認・適用中の確認 | SupportPlan の現行版 | 今の版（Current）がどれか誤認せず扱える | PL-T3 / PL-T5 |
| PL-T3 | 記録を集約しモニタリングする | 期間の確認 | 期間内の記録・件数 | 件数と意味（0件 vs 実施できなかった等）を混同せず読める | PL-T4 |
| PL-T4 | 見直しをする | モニタリング後 / 見直し時期 | Review outcome | 変更が必要か不要かが見直し結果として残る | PL-T5 |
| PL-T5 | 次版を準備する | 見直しで変更が必要なとき | Draft / next version | Draft が Current と別物だと分かる | PL-T2 |

### ADMIN_AUDIT

| ID | Task | Trigger | Object | Done when | Next |
|---|---|---|---|---|---|
| AA-T1 | 運用状況を確認する | 開局確認 / 巡回 | 事業所の運用サマリ | 未記録・要確認が業務語で見える | AA-T2 |
| AA-T2 | 証跡を辿る | 問い合わせ・監査 | 対象の記録 / 計画版 / 時刻 | 何がいつ残ったか辿れる | AA-T3 |
| AA-T3 | システム上の確認をする | 障害・権限・接続の疑い | 接続・権限・失敗の回復情報 | 業務停止か一時失敗か、次の人向け確認先が分かる | AA-T1 |

Open Question: AA-T1 cadence (daily vs weekly) is operational, not invented here. (P2-2; not Correction-2.)

---

## 6. C4. Destination Model (complete tables — normative)

Destinations are stable places. Names are IA names, not React routes. One Destination must not hide an unbounded boolean multiplex.

### Shared / demoted

| ID | Name | Purpose | Entry | Primary info | Primary action | Completion | Next |
|---|---|---|---|---|---|---|---|
| D-HOME | Role-scoped: 今日 / 今の工程 / 運用確認 | See CORR-2B. Not a universal extra place. | App start, or Global first item | Role-specific (alias or orientation) | Role-specific Primary Action | 対象 Task の開始点が分かる | FIELD_STAFF: D-PROCEDURE after object; PLANNER: current-cycle Destination; ADMIN_AUDIT: D-EVIDENCE or D-PERSON |
| D-FIND-PERSON | 利用者を探す | object index | Global「探す」; also in-flow from Destinations that need a person | 対象者の識別（業務に足る範囲） | 対象を開く | 対象コンテキストに入る | D-PERSON |
| D-FIND-RECORD | 記録を探す | object index | **in-flow only** (see §2.6). Not Global「探す」 | 記録の一覧・期間 | 対象記録を開く | 対象記録に到達 | D-RECORD-READ |
| D-RECORD-READ | 記録を見る | 既存記録の確認（読む専用） | D-FIND-RECORD / 証跡 / この人から | 当該記録の事実 | 読む（書かない） | 内容を確認できる | 元の Task |
| D-PERSON | この人の支援コンテキスト | 対象の所属を保つ | 今日の対象選択、または D-FIND-PERSON | この人の今日/現行計画の要約 | Role に応じた次仕事へ | 対象を見失わない | FS-T2 / PL-T2 等 |
| D-GOV | 確認・開発用情報 | governance / developer | 明示エントリのみ | 合成/未接続/WRITE/相関 | 業務を完了しない | 必要な確認だけできる | 元の Product Destination |

### FIELD_STAFF

| ID | Name | Purpose | Entry | Primary info | Primary action | Completion | Next |
|---|---|---|---|---|---|---|---|
| D-TODAY | 今日の支援 | FS-T1. **Identity = D-HOME for this Role.** | App start / Global「今日」 / Global「手順」when object missing | 当日対象・これからやること | 対象の支援を始める | 対象が選べる / 分かる | D-PROCEDURE |
| D-PROCEDURE | 手順 | FS-T2 | D-TODAY / D-PERSON when object exists; Global「手順」only with object | 現行手順 | 手順に沿って実施する（記録は別） | 手順を現行として確認 | D-RECORD-WRITE |
| D-RECORD-WRITE | 記録する | FS-T3 | After D-PROCEDURE, or from D-UNRECORDED with an occurrence; Global「記録する」only with occurrence context | 事実結果の入力に必要な項目 | 記録する | 記録済み、または回復可能な失敗 | D-TODAY or D-UNRECORDED |
| D-UNRECORDED | 未記録 | FS-T4 | Global「未記録」; Global「記録する」when occurrence context missing; 今日 / 通知相当 | 未記録の対象 | 対象の記録へ進む | 未記録が減る or 理由が付く | D-RECORD-WRITE |

### PLANNER Destinations

| ID | Name | Purpose | Entry | Primary info | Primary action | Completion | Next |
|---|---|---|---|---|---|---|---|
| D-ASSESS | アセスメント | PL-T1 | D-HOME Primary Action when current cycle = ①; in-flow サイクル① | 評価の所在と状態 | 確認 / 進める（編集権限は別層） | 次の計画工程へ渡せる | D-PLAN |
| D-PLAN | 支援計画 | PL-T2 | D-HOME Primary Action when current cycle = ②; in-flow サイクル② / この人から | Current 版の計画 | 計画を扱う（Current を壊さない） | Current が識別できる | D-MONITOR |
| D-MONITOR | モニタリング | PL-T3 | D-HOME Primary Action when current cycle = ④; in-flow サイクル④ | 期間の記録の意味ある集約 | 見直す材料を見る | 件数意味を混同しない | D-REVIEW |
| D-REVIEW | 見直し | PL-T4 | D-HOME Primary Action when current cycle = ⑤; in-flow サイクル⑤ | 見直し結果 | 結果を残す（権限は別層） | 変更必要/不要が残る | D-NEXT |
| D-NEXT | 次版準備 | PL-T5 | D-HOME Primary Action when current cycle = ⑥; in-flow サイクル⑥ | Draft vs Current | 次版の作業を始める | Draft ≠ 適用中 | D-PLAN |

PROCESS-VISIBILITY ③記録 is PLANNER read/search (D-FIND-RECORD / D-RECORD-READ), not D-RECORD-WRITE. D-RECORD-READ has no record-create CTA.

PLANNER D-HOME is not in this table as a fifth cycle step. It is the Distinct orientation Destination in §3.3 / shared D-HOME row.

### ADMIN_AUDIT Destinations

| ID | Name | Purpose | Entry | Primary info | Primary action | Completion | Next |
|---|---|---|---|---|---|---|---|
| D-OPS | 運用確認 | AA-T1. **Identity = D-HOME for this Role.** | App start / Global「運用確認」 | 未記録・要確認・運用の穴 | 対象へ辿る | 確認対象が特定できる | D-EVIDENCE or D-PERSON |
| D-EVIDENCE | 証跡 | AA-T2 | Global「証跡」; from D-OPS; in-flow after a person is known | いつ・何が残ったか | 証跡を開く | 辿れる | D-AUDIT |
| D-AUDIT | システム確認 | AA-T3 | 障害・接続の疑い | 回復に必要な業務向け説明 | 確認する / 問い合わせに渡す | 次の確認先が分かる | D-OPS |

Business recovery copy may appear on D-AUDIT; slice IDs stay on D-GOV.

---

## 7. C5. Top-Level Navigation (Correction-1 unique + Correction-2 resolution)

Observed: SHELL-UX-7 locked Global to 概要 / 利用者 / 記録. That is Current Product, not V1 target.

### 7.1 First paint after usable session

| Role | First paint |
|---|---|
| FIELD_STAFF | D-TODAY（D-HOME alias）= 今日の支援（対象 + Primary Action） |
| PLANNER | D-HOME（Distinct）= 今の工程（サイクル上の現在地 + 次の一手） |
| ADMIN_AUDIT | D-OPS（D-HOME alias）= 運用確認（要確認が先） |

Unknown site is Entry Condition, fail-closed, recovery copy only.

### 7.2 Global (exact, ordered — unchanged items)

| Role | Top-Level Global items |
|---|---|
| FIELD_STAFF | 今日 · 手順 · 記録する · 未記録 · 探す |
| PLANNER | 今の工程 · 探す |
| ADMIN_AUDIT | 運用確認 · 証跡 · 探す |

Resolution of each item is §2. Not repeated here.

PLANNER in-flow (not Global): PROCESS-VISIBILITY ①–⑥ on PLANNER Destinations.

Rejected: PLANNER six Global cycle tabs; dual-run of SHELL-UX-7 Global with Role/Task-first Global.

概要 / 利用者 / 記録 are NOT V1 Global items. Meaning moves to D-HOME / 探す / 記録する or D-RECORD-READ.

### 7.3 SHELL-UX-7 (CORR-1A, unchanged)

Product target: V1 Global = Role/Task-first items only. SHELL-UX-7 `概要/利用者/記録` are NOT concurrent Global. **dual-run = REJECTED as product target**.

Decision disposition (not this Human Gate): SHELL-UX-7 remains historically LOCKED. Recommended later Lock record = **supersede** as product Global, optional **alias notes** only (概要→D-HOME, 利用者→D-FIND-PERSON, 記録→write vs read destinations). Alias is not a second Global row.

---

## 8. C6 Orientation

Meaning only; no router. Always: 今どこ / どこから / 何ができる / 次はどこ. Booleans must not impersonate a place. Back names previous Destination. Deep link restores role+Destination+object or fail-closes.

Identity notes from CORR-2B:

```text
FIELD_STAFF: being on D-HOME and being on D-TODAY are the same location identity.
ADMIN_AUDIT: being on D-HOME and being on D-OPS are the same location identity.
PLANNER: D-HOME and D-PLAN (etc.) are different location identities.
```

---

## 9. C7 Product vs Governance

Keep if needed to judge, act, or recover. MOVE to D-GOV: standing 合成, fixture, slice ID, demo role switch, harness. Disabled live-looking CTA is Product failure. Fail-closed unknown site ≠ empty success. Q2 quiet 合成 badge remains Open; default = no standing synthetic chrome on Product. (P2-1; not Correction-2.)

---

## 10. C8 Priority

```text
1. 今日 / 今やること
2. 対象となる利用者・支援
3. Primary Action
4. 判断に必要な状態・経過
5. 補足説明
6. system / developer metadata
```

Always 1–3. Never equal-weight 6 with 1–3.

---

## 11. C9. State Meaning / Human Task Acceptance

Do not collapse: 0件 / 実施できなかった / 未記録 / 記録済み / 取消済み / Draft / Current / Next version.

Browser Smoke PASS is not Human Task PASS.

### FS-HTA-1

```text
Given: FIELD_STAFFが当日の支援を開始する
When: アプリを開く（usable session）
Then: 開発用selectorを理解しなくても今日の対象と Primary Action が分かる
And: 手順確認 → 記録 → 完了まで現在位置を失わない
```

### FS-HTA-2

```text
Given: 当日の対象に未記録がある
When: FIELD_STAFFが「未記録」または「今日」を見る
Then: 未記録が 0件 や 実施できなかった と同一視されない
And: 対象の「記録する」へ迷わず戻れる
```

### PL-HTA-1

```text
Given: PLANNERが適用中の計画を確認する
When: 支援計画 Destination を開く
Then: Current がどれか分かり、Draft / 次版を適用中と誤認しない
And: 次の工程（モニタリングまたは見直し）が入口から辿れる
And: Global が 今の工程 と 探す のみでも、サイクル内の現在位置が分かる
```

### PL-HTA-2

```text
Given: PLANNERが期間の記録を見る
When: モニタリング Destination を開く
Then: 0件 と 実施できなかった を別意味として読める
And: Browser Smoke の PASS 表示を業務完了と取り違えない
```

### AA-HTA-1

```text
Given: ADMIN_AUDITが開局後の運用を確認する
When: 運用確認 Destination を開く
Then: 要確認・未記録が仕事として見える
And: 記録作成や計画編集が主CTAになっていない
```

### AA-HTA-2

```text
Given: 問い合わせで特定記録を辿る
When: 証跡 Destination から対象を開く
Then: いつ何が残ったかを業務語で辿れる
And: slice ID / harness 情報を読まなくても確認を始められる
```

Count check: FIELD_STAFF 2, PLANNER 2, ADMIN_AUDIT 2.

---

## 12. C10 Scope

IN: Top-Level IA; Role→Task→Destination; nav/orientation; surface split; priority; Human Task acceptance; Correction-1 uniqueness; Correction-2 Global resolution and D-HOME identity.

OUT: React/CSS; router; schema; LIVE WRITE; Entra; Deploy; new 制度責任者; new features; visual polish; Human Lock/Start/Ready/Merge; consuming a Gate to repeal SHELL-UX-7 in the Decision ledger; Notion production mutation.

### Re-Review questions (Correction-2)

1. C3/C4 tables in retrieved body without attachment?
2. Primary Tasks clear?
3. Task→Destination replayable from tables, **and each Global item unique per §2**?
4. Nav is jobs not taxonomy?
5. dual-run rejected as product target, Decision disposition separated?
6. PLANNER Global uniquely `今の工程 · 探す`, and `今の工程` uniquely D-HOME?
7. two numbered HTA per Role?
8. here/from/next without router, **and D-HOME identity unique per Role per §3**?
9. governance moved not deleted?
10. Smoke ≠ Human Task?
11. no invented auth roles?
12. implementation not over-fixed?
13. `探す` does not dual-bind D-FIND-PERSON and D-FIND-RECORD from Global?
14. FIELD_STAFF D-HOME is not a second place beside D-TODAY; ADMIN_AUDIT D-HOME is not a second place beside D-OPS?

---

## 13. Correction-2 uniqueness check (author self-audit; not a Lock)

```text
CORR-2A FIELD_STAFF 今日     → D-TODAY                         unique
CORR-2A FIELD_STAFF 手順     → D-PROCEDURE | fallback D-TODAY  unique
CORR-2A FIELD_STAFF 記録する → D-RECORD-WRITE | fallback D-UNRECORDED unique
CORR-2A FIELD_STAFF 未記録   → D-UNRECORDED                    unique
CORR-2A FIELD_STAFF 探す     → D-FIND-PERSON                   unique
CORR-2A PLANNER 今の工程     → D-HOME                          unique
CORR-2A PLANNER 探す         → D-FIND-PERSON                   unique
CORR-2A ADMIN_AUDIT 運用確認 → D-OPS                           unique
CORR-2A ADMIN_AUDIT 証跡     → D-EVIDENCE                      unique
CORR-2A ADMIN_AUDIT 探す     → D-FIND-PERSON                   unique
CORR-2B FIELD_STAFF          → D-HOME == D-TODAY               unique
CORR-2B PLANNER              → D-HOME Distinct vs cycle dests  unique
CORR-2B ADMIN_AUDIT          → D-HOME == D-OPS                 unique
```

P2 remaining (not this slice): Q2 quiet 合成 badge; AA-T1 cadence.

---

## 14. Close

```text
Correction-2 = APPLIED
Normative surface = this packet body
P0 / P1 = for Independent Re-Review only
Human Definition Lock eligibility = NOT YET (await Re-Review)
Human Definition Lock = NOT GENERATED / NOT CONSUMED
Repository Mutation (product / schema / persistence / SPFx) = NONE
Human Gate Consumption = NONE
Implementation Authority = NONE
NEXT = Fresh Independent Definition Re-Review
```
