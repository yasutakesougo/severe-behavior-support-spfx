# PROCESS-VISIBILITY-UI-V1 — PHASE 0 Information Mapping Freeze

```text
repository: yasutakesougo/severe-behavior-support-spfx
unit: PROCESS-VISIBILITY-UI-V1
kind: current UI / information mapping freeze
status: FROZEN
basis main: d8f46891f3f857f6de397c3422bad4f7ad4d2bcc
#576 product HEAD (lifecycle invariant source): 4eab190eecdec5b05d7051d1ede3240dfdfa0052
#576 tip (may include docs): 87bbadccabd15134418efcb3a9e78a0cc067b9bc
date: 2026-09-03
Implementation Start: NOT AUTHORIZED
UI mutation: NOT AUTHORIZED BY THIS DOC
```

## 1. Purpose

Definition / Scope / Implementation に入る前に、現行 PLANNER 画面の block・ナビ・所属先を固定する。

```text
この Freeze
= 現状の事実記録
!= Implementation authorization
!= #576 Ready / Merge
```

## 2. Current PLANNER block order（fact）

Authority: [`supportPlanBlockOrderForRole`](../../spfx/src/shell/ux/presentation-role.ts)

```text
summary → review → procedures → records → versions → nextVersion → goals → actions → mutation
(+ stateGrid after map)
```

観測される業務順との不一致:

| 現表示位置 | Block | 問題 |
|---|---|---|
| 先頭付近 | summary / review | 目標・支援内容が後段 |
| 中盤 | procedures / records | Monitoring が records 内 |
| 中盤 | versions | サイクル内に履歴が割込 |
| 後段前 | nextVersion | 見直し結果の一部も同居 |
| 最後 | goals / actions | 計画の核が最下流 |

## 3. Current section navigation（fact）

Authority: [`PLANNING_PC_SUPPORT_PLAN_SECTION_NAVIGATION`](../../spfx/src/shell/users/support-plan-copy.ts)

```text
見直し状況
現在の支援手順
最近の支援手順記録
過去の版
次の版の考え方
```

欠落（工程として見えない）:

```text
計画（目標・支援内容を含む）
モニタリング
```

## 4. Block → 支援サイクル mapping（V1 target）

| Process | Existing blocks / nodes | Notes |
|---|---|---|
| ① 計画 | `summaryBlock` + `goalsBlock` + `actionsBlock` | 最上流へ再配置 |
| ② 支援 | `proceduresBlock` | ほぼそのまま |
| ③ 記録 | `recordsBlock` の recent records のみ | 版紐づけ copy 維持 |
| ④ モニタリング | `MonitoringView`（records から視覚分離） | 新 component なし |
| ⑤ 見直し | `reviewBlock` + `capturedReview` outcome/reason | 表示位置のみ集約 |
| ⑥ 次版準備 | `nextVersionBlock`（#576 correction 維持） | lifecycle 文言不変 |
| 履歴・詳細 | `versionsBlock` + `mutationBlock` + `stateGrid` | 削除せず下位階層 |

## 5. Nesting facts to separate visually

| Fact | Location today | V1 action |
|---|---|---|
| `MonitoringView` | inside `recordsBlock` when `planningPc` | extract to Process ④ wrapper; do not rewrite MonitoringView |
| `capturedReview` readback | inside `nextVersionBlock` on #576 | show under Process ⑤; state stays where it is |
| `#576` source-safety / draft-lifecycle | `nextVersionBlock` | keep in Process ⑥ |

## 6. Role boundary freeze

```text
isPlanningPcPresentationRole = PLANNER | ADMIN_AUDIT（現行）

V1 presentation reorder / nav
= PLANNER only

FIELD_STAFF block order
= unchanged

ADMIN_AUDIT block order / nav
= unchanged（現行 planning-PC 順を維持）
```

## 7. #576 lifecycle invariants（must survive V1）

Product basis: `4eab190`

```text
現在適用中: 版 N
版 N+1 は下書きです。まだ適用開始されていません
現在使用中の版 N は変更しません
CTA: 支援内容の見直しを始める（版 N+1 の下書き）
LIVE_WRITE = false
domain / RevisionIntent / N+1 semantics = unchanged by V1
```

V1 はこれらの **文言・境界 assertion を消さない / 弱めない**。

## 8. Non-goals frozen

```text
new workflow state（完了/進行中）= FORBIDDEN
progress stepper = FORBIDDEN
new Monitoring domain = FORBIDDEN
new component system = FORBIDDEN
Accordion of 履歴・詳細 = V1.1 candidate only
tabs = FORBIDDEN
```

## 9. Gate

```text
PHASE 0 Information Mapping Freeze = FROZEN
NEXT = PHASE 1 Definition
Implementation Start = NOT AUTHORIZED
#576 Merge prerequisite for Implementation = REQUIRED
```
