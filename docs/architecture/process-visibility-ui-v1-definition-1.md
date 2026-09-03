# PROCESS-VISIBILITY-UI-V1 — Definition 1

```text
repository: yasutakesougo/severe-behavior-support-spfx
unit: PROCESS-VISIBILITY-UI-V1
kind: exact slice definition
status: REVIEW-CLEARED / Human Definition Lock ELIGIBLE
PHASE 0 freeze: docs/architecture/process-visibility-ui-v1-information-mapping-freeze-1.md
#576 product HEAD invariant: 4eab190eecdec5b05d7051d1ede3240dfdfa0052
date: 2026-09-03
Implementation Start: NOT AUTHORIZED
Ready / Merge / Deploy / LIVE WRITE: NOT AUTHORIZED
```

## 1. Purpose

PLANNER の支援計画画面を、「情報を探す画面」から「支援サイクルを辿れば必要な情報に着く画面」へ再編する。

```text
presentation-only
!= new workflow
!= new business status
!= domain / persistence change
```

## 2. Problem

1. PLANNER 表示順が業務プロセスと不一致（目標・支援内容が次版の後ろ）
2. 上部ナビに「計画」「モニタリング」が工程として現れない
3. Monitoring が記録ブロック内に埋まり所属が曖昧
4. 見直し結果と次版準備の情報が分散
5. 履歴・制度情報がサイクル内に割り込み、長さと迷いを増やす

## 3. Solution shape

画面骨格 = **支援サイクル**（情報の所属先ナビゲーション）。

```text
① 計画
② 支援
③ 記録
④ モニタリング
⑤ 見直し
⑥ 次版準備
────────
履歴・詳細（過去版 / 計画操作 / 制度・システム）
```

進捗 Stepper（①完了→②現在）は作らない。右側 meta は既存データの要約のみ。

| Process | Right-side summary（例） |
|---|---|
| ① 計画 | 版3・適用中 |
| ② 支援 | 手順 N件 |
| ③ 記録 | 直近 N件 |
| ④ モニタリング | 根拠 N件 |
| ⑤ 見直し | 変更が必要 / 変更なし |
| ⑥ 次版準備 | 版4・下書き・未適用 |

## 4. Exact IN / OUT

### IN

- PLANNER presentation only
- 6 Process headings + Process navigation
- existing block reorder / visual grouping
- Monitoring visual separation（既存 `MonitoringView` 維持）
- Review result visual grouping（表示位置のみ）
- 履歴・詳細への階層下げ（削除なし、Accordion なし）
- Desktop nav（既存 `sectionNavButton*`）
- Mobile 390px: 2列×3行 Process nav
- tests + planning-pc smoke + #576 lifecycle regression（B12）

### OUT

- domain / contract semantic changes
- new workflow / new business status
- persistence / RevisionIntent / N+1 semantics changes
- MonitoringView rewrite / new component system
- FIELD_STAFF / ADMIN_AUDIT presentation changes
- SharePoint / M365 / Entra / Deploy / LIVE WRITE
- #576 Ready / Merge の代替

## 5. Role rule

```text
V1 changes apply when presentationRole === PLANNER

FIELD_STAFF = unchanged
ADMIN_AUDIT = unchanged
```

`isPlanningPcPresentationRole`（PLANNER∪ADMIN_AUDIT）を無差別に流用して ADMIN_AUDIT まで変えない。

## 6. Process ↔ existing blocks

| Process | Blocks |
|---|---|
| ① | summary + goals + actions |
| ② | procedures |
| ③ | recent records only |
| ④ | MonitoringView + Process Header |
| ⑤ | reviewStatus + capturedReview outcome/reason |
| ⑥ | nextVersion（#576 safety copy preserved） |
| 履歴・詳細 | versions + mutation + stateGrid |

## 7. #576 invariant

V1 実装は #576 Merge 後の product 上で行う。少なくとも次を regression する。

```text
現在適用中: 版 N
版 N+1 は下書き / まだ適用開始されていない
現行版は変更しない
LIVE_WRITE = false
```

## 8. Acceptance（Staff Process-Comprehension）

| ID | Question | Expect |
|---|---|---|
| T1 | 今使っている計画はどれですか？ | 版3・適用中 |
| T2 | 最近の支援とその結果はどこを見ますか？ | ② / ③ / ④ を区別 |
| T3 | なぜ見直す必要がありますか？ | ⑤ から判断理由 |
| T4 | 次に何をしますか？ | ⑥ から正しい CTA |
| T5 | 版4はもう現場で使っていますか？ | いいえ（版3適用中 / 版4下書き） |

```text
PASS = プロセスを迷わず特定 + lifecycle 誤認なし
ACCEPTABLE = 少し探すがプロセスと安全境界は正しい
HOLD = 所属先誤認 or 次操作不能 or Draft=適用中
```

## 9. Gate chain

```text
PHASE 0 Mapping Freeze = FROZEN
↓
PHASE 1 Definition（本書類）
↓
Independent Definition Review
↓
Human Definition Lock GO
↓
PHASE 2 Prototype → 5 Persona → Human Visual Acceptance
↓
PHASE 3 Implementation Scope → Ponytail → Independent Scope Review
↓
Human Implementation Start GO
  （prerequisite: #576 Merged + post-merge fixation）
↓
PHASE 4 PLANNER-only implementation → … → Staff Check → Ready
```

```text
Definition DRAFT != Definition Lock
Definition Lock != Implementation Start
Implementation Start != Ready / Merge
```

## 10. File surface（implementation preview only）

| File | Change class |
|---|---|
| `SupportPlan.tsx` | Process grouping / order / review placement |
| `support-plan-copy.ts` | 6工程 labels / nav |
| `SupportPlanUx.module.scss` | Process Header / nav layout |
| `presentation-role.ts` | PLANNER-only order |
| `support-plan.test.ts` / `presentation-role.test.ts` | order / nav regression |
| planning-pc smoke | nav focus / mobile |
| `sbs-mgmt-loop-b/run-smoke.mjs` | lifecycle regression only |

## 11. Status

```text
Definition = REVIEW-CLEARED
Independent Definition Review-1 = PASS
Human Definition Lock GO = CONSUMED（Human 2026-09-03）
Human Visual Acceptance = CONSUMED（Human 2026-09-03）
PHASE 2 Prototype Correction-1 = PASS
5 Persona Simulation 2 = PASS WITH MINOR FRICTION（SIMULATION ONLY）
PHASE 3 Scope = CLEARED CANDIDATE
PHASE 4 = BLOCKED（WAIT #576 + Implementation Start GO）
further design mutation = STOP
Implementation Start = NOT AUTHORIZED
mutation = 0
```

Companion:

```text
docs/architecture/process-visibility-ui-v1-human-gate-packet-1.md
docs/architecture/process-visibility-ui-v1-definition-independent-review-1.md
docs/architecture/process-visibility-ui-v1-presentation-prototype-correction-1.md
docs/architecture/process-visibility-ui-v1-independent-visual-re-check-1.md
docs/architecture/process-visibility-ui-v1-5-persona-simulation-2.md
docs/architecture/process-visibility-ui-v1-visual-acceptance-packet-1.md
docs/architecture/process-visibility-ui-v1-implementation-scope-1.md
docs/architecture/process-visibility-ui-v1-implementation-scope-1-ponytail.md
docs/architecture/process-visibility-ui-v1-implementation-scope-independent-review-1.md
docs/architecture/process-visibility-ui-v1-576-gate-status.md
```
