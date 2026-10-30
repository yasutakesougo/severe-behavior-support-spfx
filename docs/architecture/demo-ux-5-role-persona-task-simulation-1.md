# DEMO-UX-5 — Role / Experience Persona Task Simulation-1

```text
Kind: Agent Simulation — Pre-Staff Role Persona Task Check
Evidence class: Simulation Evidence Only
NOT a substitute for Actual Staff Evidence
Date: 2026-08-31
Current main: 72f2bb1dd0cfde2301b01cbad0c2fce7bfe266e0
Surface primary: synthetic Daily Records (DEMO-UX-5 / #525 merge)
Surface secondary (Persona G only): Monitoring summary + Human Review materials (Slice B)
Related open PR: #539 (Slice B staff-value docs; separate simulation A/B/C)
```

## Boundary

```text
Agent Simulation = PRELIMINARY EVIDENCE
Human Staff Check = REQUIRED FOR FINAL VALUE JUDGMENT

No Actual Staff Evidence PASS is established by this record.
No Deploy / Production Binding / LIVE WRITE authority is created.
No HUMAN-REVIEW-UI-FRICTION-SLICE-C is authorized by this record.
No UI Implementation Start is authorized by this record.

Simulation PASS ≠ Actual Staff Value PASS
UI_FRICTION ≠ INFORMATION_GAP ≠ WORKFLOW_GAP
```

## Why this simulation exists

Prior Slice B simulation (Personas A/B/C on #539) evaluated IT familiarity /
everyday use / first-look axes on Monitoring + Human Review.

This record uses a **different axis**: role, experience, and work purpose
(Personas D–H), primarily against the **Daily Records** rendered screens that
passed post-merge runtime smoke on current main.

Position in gate:

```text
PHASE 1 runtime smoke (#525 / demo-ux-5) = PASS @ 72f2bb1
  → this Role Persona Task Simulation (Simulation Evidence Only)
    → STOP further AI evaluation
      → Actual Staff Value Check (#539 checklist path)
```

## Method

```text
Order: D → E → F → G → H (independent)
Eval style: task-based (not “is this UI clear?”)
Verdict classes: RESOLVED | MINOR_FRICTION | BLOCKING_FRICTION
Gap classes (when friction is not UI): UI_FRICTION | INFORMATION_GAP | WORKFLOW_GAP
```

### Evidence surfaces (rendered)

| ID | Surface | Path / capture |
|---|---|---|
| DR-NE | Daily Records non-empty incomplete | `/opt/cursor/artifacts/demo-ux-5-browser-smoke/desktop-daily-records.png` |
| DR-E | Daily Records incomplete empty | `/opt/cursor/artifacts/demo-ux-5-browser-smoke/desktop-daily-records-incomplete-empty.png` |
| MR-V3 | Monitoring summary + Human Review (plan v3, sceneLabel) | `/opt/cursor/artifacts/monitoring-view-persona-g/monitoring-plus-review-v3.png` |

Runtime binding for Daily Records:

```text
Runner: node spfx/smoke/demo-ux-5/run-smoke.mjs
SHA: 72f2bb1dd0cfde2301b01cbad0c2fce7bfe266e0
allPass: true
cases: 6 / 6 (includes non-empty + incomplete-empty)
```

Persona G secondary surface is the merged Slice B `MonitoringView` composition
(summary-only + `#human-review-materials`), not a new implementation.

## Persona results

### Persona D — 新人支援員

```text
Perspective: 支援経験が浅い
Task: Aさんについて、今日確認すべきことを探し、
      記録するとしたらどこを使うか説明してください。
Evidence: DR-NE (primary), DR-E (empty contrast)
```

| Observation | Finding |
|---|---|
| 最初にどこを見るか | 上部「未完了確認」へ自然に到達。Aさん「本日の支援記録が未入力／未記録」が主表示 |
| 「未完了確認」の意味 | 選択→下の入力イメージ追随の hint あり。作業キューとして理解可能 |
| 対象者把握 | Aさんが未完了リストと入力対象の両方で一致 |
| 記録入力が保存可能に見えるか | 「作成する」「保存する」は disabled。複数の非保存注記あり。ボタン存在自体で一瞬迷う余地あり |
| 最近の記録 | 「閲覧サンプル／ここからは編集できません」で参考情報と読める |

```text
Task verdict: RESOLVED
UI note: MINOR_FRICTION — disabled 作成/保存ボタンの存在による一瞬の迷い
Gap class: UI_FRICTION (minor only)
INFORMATION_GAP / WORKFLOW_GAP: not required to complete this task
```

Empty contrast (DR-E): 未完了が空でも入力イメージに「Aさん」が残る。新人は
「確認事項は無いのになぜ Aさん入力欄があるのか」で短く迷う余地あり →
same MINOR_FRICTION / UI_FRICTION。empty 注記の非同値コピーは誤解防止として機能。

### Persona E — ベテラン支援員

```text
Perspective: 紙・口頭共有に慣れている
Task: 「今日のAさんについて何か確認事項が残っているか」
      できるだけ早く確認してください。
Evidence: DR-NE (primary), DR-E (empty contrast)
```

| Observation | Finding |
|---|---|
| 必要情報への到達 | 「未完了確認」最上段で Aさん未記録を即答可能 |
| 説明文量 | デモ帯・事業所/ロール選択・各セクション hint・非保存注記が多く、紙の一目確認より視線コストが高い |
| 紙なら一目の情報が埋もれていないか | 確認事項そのものは埋もれていない。周囲 chrome が速度税 |
| 最近の記録 | 本タスクには不要。邪魔にはならないが視線を奪う |

```text
Task verdict: RESOLVED
UI note: MINOR_FRICTION — 速度確認時の説明/chrome 密度
Gap class: UI_FRICTION (minor only)
Do not treat as Slice C label-expansion trigger
```

Empty contrast (DR-E): 「表示する未完了確認はありません」＋業務非同値注記で
「この表示上は残件なし」を速く判断可能 → RESOLVED。

### Persona F — 引継ぎ職員

```text
Perspective: 対象利用者をよく知らない
Task: 初めてAさんを担当すると仮定して、
      最近どのような支援が行われているか説明してください。
Evidence: DR-NE
```

| Observation | Finding |
|---|---|
| 「最近の記録」発見 | セクション見出しで発見可能 |
| 3件の読み取り | Aさん2件 + Dさん1件。Aさんに絞れば支援手法（活動カード、2択意思確認）を説明可能 |
| 出来事 vs 支援上の意味 | 要約は支援行為を含む。単なる出来事ログだけではない |
| 追加で見たい情報 | **支援計画のどの目標/手順に対応するか**、より長い経過、行動関連の文脈 |

```text
Task verdict: RESOLVED (recent support actions can be narrated from 最近の記録)
UI note: MINOR_FRICTION — 最近の記録に他利用者(Dさん)が混在し、一瞬の選別が必要
Observed residual: INFORMATION_GAP — 日々の記録要約 ↔ 支援計画/手順の対応関係が画面に無い
Gap class: INFORMATION_GAP (not UI_FRICTION)
```

Important disposition:

```text
「計画の何に対応するか分からない」
  ≠ ラベルを直す / 説明を増やす (Slice C UI)
  = INFORMATION_GAP / possible WORKFLOW_GAP for later Human triage
```

### Persona G — サービス管理責任者相当

```text
Perspective: 計画・振り返り中心
Task: Daily Record → Monitoring → Human Review materials を通して、
      「日々の事実」「期間の概要」「見直し材料」の役割を区別できるか。
Evidence: DR-NE + MR-V3
```

#### Within Monitoring + Human Review (MR-V3)

| Role | Rendered signal | Distinction |
|---|---|---|
| 期間の概要 | 「期間モニタリング（概要）」・件数のみ・良否/効果/計画変更は判定しない | Clear |
| 見直し材料 | 「見直し資料」・事実資料注記・支援場面(sceneLabel)・人が判断 | Clear |
| Jump | 「見直し資料へ移動」 | Clear |

```text
On-surface role separation: RESOLVED
(consistent with prior Slice B Personas A/B/C simulation)
```

#### Cross-surface journey (Daily Record → Monitoring → Review)

| Step | Observation |
|---|---|
| Daily Record (現場職員 / 記録) | 日々の事実（未完了・入力イメージ・最近の記録）は提示される |
| 導線 | 同画面から「期間モニタリング」「見直し資料」へ進む操作導線は無い |
| Evidence model | 日々の記録要約 ≠ 手順実施記録（Monitoring/Review の Record モデル） |
| Traceability | 日々の3件から計画版モニタリング件数/見直し資料へ対応付けできない |

```text
End-to-end task verdict: BLOCKING_FRICTION for continuous journey
Gap class: WORKFLOW_GAP (+ INFORMATION_GAP on cross-model linkage)
NOT UI_FRICTION on Monitoring/Review labels
```

Disposition:

```text
Do NOT open Slice C to “explain Monitoring on Daily Records”.
Record WORKFLOW_GAP for Human / Actual Staff triage.
Prior Slice B simulation PASS on Monitoring/Review remains intact.
```

### Persona H — 短時間勤務・応援職員

```text
Perspective: 利用頻度が低い（業務知識は多少あるが操作体系を覚えていない）
Task: 久しぶりに開いても、説明なしで操作方向を判断できるか。
Evidence: DR-NE, DR-E
```

| Observation | Finding |
|---|---|
| 操作方向 | 上→下（未完了確認 → 記録入力イメージ → 最近の記録）が読み取れる |
| 初動の迷い | 事業所/表示ロールのデモ操作群が先に目に入り、本番操作か設定か一瞬迷う |
| 保存不能 | disabled 作成/保存 + 注記で「書けない／保存できない」方向は判断可能 |
| Empty | 非同値注記により「全部終わった」と誤読しにくい |

```text
Task verdict: MINOR_FRICTION
Gap class: UI_FRICTION (minor — chrome / disabled actions hesitation)
BLOCKING_FRICTION: not observed
```

## Aggregate matrix

| Persona | Task verdict | Dominant gap class | Slice C UI trigger? |
|---|---|---|---|
| D 新人 | RESOLVED (+ minor) | UI_FRICTION (minor) | No |
| E ベテラン | RESOLVED (+ minor) | UI_FRICTION (minor) | No |
| F 引継ぎ | RESOLVED (+ minor) | **INFORMATION_GAP** (plan linkage) | No |
| G サビ管相当 | on-surface RESOLVED / journey **BLOCKING** | **WORKFLOW_GAP** | No |
| H 応援 | MINOR_FRICTION | UI_FRICTION (minor) | No |

```text
BLOCKING UI_FRICTION on Daily Records primary tasks: 0
INFORMATION_GAP observed: 1 (F — daily notes ↔ plan/procedure)
WORKFLOW_GAP observed: 1 (G — Daily → Monitoring → Review journey)
Major “fix labels / add more copy” recommendation: NOT MADE
```

## Simulation verdict

```text
AGENT SIMULATION ONLY
Persona D                 RESOLVED (MINOR UI_FRICTION)
Persona E                 RESOLVED (MINOR UI_FRICTION)
Persona F                 RESOLVED (INFORMATION_GAP residual)
Persona G                 MIXED — Review surface RESOLVED;
                          journey BLOCKING via WORKFLOW_GAP
Persona H                 MINOR_FRICTION
Slice C from this record  NOT RECOMMENDED
Actual Staff Evidence     UNKNOWN
Further AI evaluation     STOP — move to Actual Staff Value Check
```

## Product disposition

```text
This is the final pre-staff Agent Simulation for the current gate package.
Do not add another AI persona layer before real staff.

Next rational gate:
  Actual Staff Value Check
    (synthetic screens; #539 staff-check checklist as entry)
      → PASS     → friction-close candidate (Human GO)
      → PARTIAL  → record only where staff actually hesitated
                   → triage UI_FRICTION vs INFORMATION_GAP vs WORKFLOW_GAP
                   → only then consider a bounded next slice
      → HOLD     → do not invent UI work from simulation alone
```

Carry into staff sessions (ask, do not presuppose):

1. F-shaped: 最近の記録だけで引継ぎに足りるか。足りないなら何の情報か。
2. G-shaped: 日々の記録と期間モニタリング/見直し資料を、職員が同じ仕事の連続と見ているか。
3. Do not prompt staff toward “ラベルを増やしてほしい” as the default fix.

## Non-claims

- Simulation ≠ Actual Staff Value PASS
- Simulation ≠ Ready / Merge / Deploy / LIVE WRITE
- INFORMATION_GAP / WORKFLOW_GAP ≠ automatic UI Implementation Start
- #539 Independent Evidence Review remains separate (Slice B A/B/C)
- demo-ux-5 runtime smoke PASS remains separate (PHASE 1 / AC-7 runtime)
