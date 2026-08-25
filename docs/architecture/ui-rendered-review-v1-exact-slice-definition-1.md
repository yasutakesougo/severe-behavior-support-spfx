# UI-RENDERED-REVIEW-V1 — Rendered Usability Review Boundary

```text
Program: UI-AGENT-SYSTEM-V1（review layer extension）
Unit: UI-RENDERED-REVIEW-V1 — rendered-usability-review boundary
Status: Definition Correction-2 APPLIED（this PR）
Definition Correction-1: APPLIED (P1-1 + P1-2 + P1-3 + P2-1 + P2-2 + P2-3)
Definition Correction-2: APPLIED (P1-1 + P1-2 + P2-1 + P2-2)
Definition status: CORRECTED / AWAITING FOCUSED RE-REVIEW
Authority:
  Human GO: UI-RENDERED-REVIEW-V1 Definition Start
  docs/architecture/ui-agent-system-v1-design-issue-body.md
  docs/process/skill-catalog.md
  .agents/skills/design-review/SKILL.md
Kind: read-only Definition（Skill boundary / evidence contract / workflow wiring plan）
Implementation Start: NOT AUTHORIZED
Skill directory promotion: NOT AUTHORIZED（verify:skills 導入済み set 未更新）
Deploy / SharePoint write / Product UI Contract mutation: FORBIDDEN
Domain semantics mutation: FORBIDDEN
NEXT: UI-RENDERED-REVIEW-V1 Definition focused Re-Review
then: Definition ACCEPT/LOCK → Ready → Merge → Post-Merge → Implementation Start GO
Agent: STOP on implementation
```

## 0. Correction-1（closes Definition Review HOLD）

Consumed review against Definition Start publication（PR #521 / branch `cursor/ui-rendered-review-v1-definition-9913`）:

| ID | Severity | Status | Correction |
|---|---|---|---|
| P1-1 | P1 | **CLOSED** | **V1 execution order locked.** V1 runs `rendered-usability-review → design-review` only. `adaptive-layout-review` is P2 deferred; V1 records layout-break handoff notes but does not require that Skill. Full target order after P2: `rendered-usability-review → adaptive-layout-review → design-review`. |
| P1-2 | P1 | **CLOSED** | **Gate independence locked.** `rendered-usability-review` PASS does **not** substitute `design-review` PASS. Contract / semantics / a11y gate failures remain blocking via `design-review` even when rendered usability passes. |
| P1-3 | P1 | **CLOSED** | **Responsive ownership split.** V1 `rendered-usability-review` may raise P0/P1 only for width-labeled screenshot evidence of operation-blocking clip / overlap / state invisibility on representative viewports. Breakpoint philosophy, safe area, content growth, touch-target layout verification, and tablet-specific layout adaptation are **handoff notes** to P2 `adaptive-layout-review`（KI-UI-006）, not primary P0/P1 owners in V1 unless clip/overlap is already visible in rendered evidence. |
| P2-1 | P2 | **CLOSED** | **Runtime a11y lens relocated.** Touch / zoom / keyboard-only / forced-colors runtime checks（KI-UI-004）are **not** primary dimensions of `rendered-usability-review` V1. They supplement `design-review` / DADS-06; static gate regressions stay in `design-review`. |
| P2-2 | P2 | **CLOSED** | **KI-UI-005 Allowed/Forbidden explicit.** Local use of Superfuture/design-review guidance is limited to Allowed list; Forbidden list includes `--apply`, source mutation, Contract/Domain change, and local `design-review` replacement. |
| P2-3 | P2 | **CLOSED** | **Path typo fixed.** `.adents/` → `.agents/` in Implementation Start prerequisites. |

Prior Definition Start items that remain PASS（unchanged by Correction-1）:

```text
Product UI Contract remains authority: PASS
no screenshot => no unsupported visual finding: PASS
Domain semantics cannot be changed: PASS
no source mutation / no automatic apply: PASS
findings classified P0 / P1 / P2: PASS
FIELD_STAFF tablet evidence supported: PASS
PLANNER desktop evidence supported: PASS
external design-review name collision avoided: PASS
Implementation Start until Skill directory promotion: PASS
```

## 0.1 Correction-2（closes Definition publication gate-chain HOLD）

Consumed review against Definition Correction-1 publication:

| ID | Severity | Status | Correction |
|---|---|---|---|
| P1-1 | P1 | **CLOSED** | **Remove Implementation Start shortcut.** Definition Re-Review PASS / ACCEPT alone does **not** authorize Implementation Start. Explicit Post-Merge `Implementation Start GO` remains required. |
| P1-2 | P1 | **CLOSED** | **Human gate chain locked.** Required order: `Definition ACCEPT/LOCK → Ready → Merge → Post-Merge → Implementation Start GO`. Each gate is Human-owned; agents STOP between gates. |
| P2-1 | P2 | **CLOSED** | **Command path corrected.** Implementation Start prerequisite references `.agents/commands/review-pr.md`, not bare `review-pr.md`. |
| P2-2 | P2 | **CLOSED** | **KI source pin deferred.** KI-UI-004 / 005 / 006 retain `NOT_PINNED_DEFINITION_PHASE` during Definition. Source commit/release pin is a **Post-Merge / Implementation Start preflight** revalidation item, not a Definition blocker. |

Prior Correction-1 items that remain PASS（unchanged by Correction-2）:

```text
V1 workflow order: PASS
Gate independence: PASS
Responsive ownership split: PASS
Runtime a11y relocation: PASS
KI-UI-005 Allowed/Forbidden: PASS
Evidence contract: PASS
Product UI Contract authority: PASS
```


## 1. Purpose

既存 Product UI Contract を変更せず、**browser / screenshot evidence** を使って実画面の usability / visual quality を **read-only** で評価するレビュー境界を定義する。

```text
design-review          = Contract に適合しているか
rendered-usability-review = 実際の画面が使いやすいか（rendered evidence 必須）
adaptive-layout-review  = tablet / narrow / touch / clip（P2 / 後続）
```

外部 Skill は **「問題を見つける目」** としてのみ参照する。**「何が正しい UI か」** の正本は引き続き Domain / Contracts / DADS / Component Catalog / Screen Templates / Visual Hierarchy Contract である。

## 2. Problem statement

現行 `design-review` は Product UI Contract 適合監査に強いが、次の gap がある。

| gap | 現状 | 本 Definition で固定すること |
|---|---|---|
| rendered usability | visual finding は証跡不足時 `HOLD` だが、専用 review lens がない | screenshot / browser evidence を前提とした usability review 境界 |
| visual hierarchy（実画面） | Contract 上の EMPHASIS / density は見るが、**見た目の hierarchy** は別能力 | hierarchy / spacing / density / state の rendered 評価 |
| evidence discipline | 停止条件はあるが、visual finding の証跡契約が Skill 単位で未固定 | no screenshot => no unsupported visual finding |
| external intelligence | KI-UI-001..003 は OBSERVED。rendered / layout / runtime a11y lens が未索引 | KI-UI-004 / 005 / 006 を GUIDANCE_ONLY で索引 |

## 3. Naming / collision boundary

| 名称 | 扱い |
|---|---|
| `rendered-usability-review` | **正式 Skill 名**（ローカル実行正本予定パス: `.agents/skills/rendered-usability-review/`） |
| 外部 `Superfuture/design-review` | **参照のみ**。ローカル Skill 名と衝突させない |
| 導入済み `design-review` | **置換しない**。Contract / semantics / a11y gate / smoke を担当 |
| `ui-review`（後続候補） | 本 Skill 導入後も汎用 UI 分割要否は未決。rendered usability は本 Skill が担当 |
| `adaptive-layout-review` | **P2 後続**。本 V1 では境界のみ定義 |

## 4. Authority stack（変更不可）

### 4.1 Full target order（P2 導入後）

```text
Domain / Contracts
  ↓
DADS-03 Style Guide / DADS-04 tokens / DADS-05 primitives
  ↓
Component Catalog v1
Screen Templates v1
Visual Hierarchy Contract v1
  ↓
design-context（実装前 mapping）
  ↓
Implementation（React / SCSS / SBS_*）
  ↓
Browser / Screenshot Evidence
  ↓
rendered-usability-review   ← 本 Definition
  ↓
adaptive-layout-review      ← P2 後続（Correction-1 / P1-1）
  ↓
design-review               ← 既存 Contract gate
  ↓
Independent Review
```

### 4.2 V1 execution order（Correction-1 / P1-1）

```text
Browser / Screenshot Evidence
  ↓
rendered-usability-review
  ↓
design-review
```

`adaptive-layout-review` は V1 では **未導入**。layout-break 疑いは handoff note として記録し、P2 で Skill 化する。

### 4.3 Gate independence（Correction-1 / P1-2）

```text
rendered-usability-review PASS  ≠  design-review PASS
rendered-usability-review FAIL   ≠  design-review 不要
Contract / semantics / a11y gate = design-review が最終 blocking gate
```

## 5. External Intelligence（GUIDANCE_ONLY）

| ID | Topic | External reference | Priority | Use |
|---|---|---|---|---|
| KI-UI-001 | evidence-first read-only UI audit | improve-ui | — | 証跡不足時は finding を出さない |
| KI-UI-004 | accessibility runtime / touch verification | jakubkrehel/skills `better-accessibility` | P3 | design-review / DADS-06 補強 lens |
| KI-UI-005 | rendered evidence usability review | Superfuture/design-review | **P1 / FIRST** | hierarchy / spacing / state / screenshot discipline |
| KI-UI-006 | adaptive / tablet layout review | jakubkrehel/skills `better-layout` | P2 | 後続 adaptive-layout-review lens |

### 5.1 KI-UI-005 local use boundary（Correction-1 / P2-2）

**Allowed（GUIDANCE_ONLY）**

- screenshot review
- rendered hierarchy review
- spacing / density review
- responsive visual review（width-labeled screenshot evidence のみ）
- component state review
- concrete findings（evidence ref 必須）

**Forbidden**

- `--apply`
- source mutation
- Product UI Contract 変更
- Domain semantics 変更
- local `design-review` 置換
- external Skill install / runtime execution

```text
外部 Skill install / --apply / runtime execution: FORBIDDEN
外部 px 値を SBS token より上位にしない
Product UI Contract 変更: FORBIDDEN
```

### 5.2 External Intelligence source pin（Correction-2 / P2-2）

KI-UI-004 / 005 / 006 は Definition 段階では **source commit/release pin 不要**（`NOT_PINNED_DEFINITION_PHASE`）。

```text
Pin timing: Post-Merge reconciliation または Implementation Start preflight
Revalidation trigger: Implementation Start GO 直前
Required action: canonical source identity の live HEAD / release pin を observation に追記
Failure handling: pin 不能または source drift 疑い → HOLD（Promotion しない）
Definition blocker: NO（OBSERVED + GUIDANCE_ONLY のまま進行可）
```

## 6. In scope（Definition）

- 本 Exact Scope Definition 文書
- KI-UI-004 / 005 / 006 observation 登録（`.agents/intelligence/`）
- `rendered-usability-review` Skill 仕様（本書 Appendix A）。**ディレクトリ未作成**
- skill-catalog **後続** 掲載
- Review Agent 後続 Skill 行の追加
- workflow 上の位置づけ（development-process 追記は Implementation Start）

## 7. Explicit OUT

```text
.agents/skills/rendered-usability-review/ 作成（Implementation Start まで）
verify:skills expectedInstalledSkills 更新
review-pr 必須観点への組み込み
adaptive-layout-review Skill 実装
Product UI Contract / DADS / Catalog / Templates / Visual Hierarchy 変更
Domain semantics 変更
React / SCSS / token 変更
Tailwind / Radix / Base UI 導入
Figma as SSOT
Storybook / Chromatic 新 SSOT 化
外部 Skill の install / --apply / 自動修正
Deploy / SharePoint write / Issue mutation / Merge / Ready
```

## 8. Evidence contract（Must establish）

### 8.1 Rendered evidence required

visual / usability finding は **rendered evidence** を根拠にのみ出す。

| Finding 種別 | 最低証跡 |
|---|---|
| visual hierarchy | screenshot または browser capture + 対象 surface 特定 |
| typography / spacing / density | screenshot または measured capture + 対象要素特定 |
| component state（hover / focus / disabled / empty / error） | 該当 state の screenshot または smoke 証跡 |
| contrast（visual） | screenshot + 対象要素。数値断定は measured evidence がなければ `HOLD` |
| responsive visual break | width-labeled screenshot。操作 blocking の clip / overlap / state 不可視のみ P0/P1 可（Correction-1 / P1-3） |
| runtime a11y（touch / zoom / keyboard-only） | **OUT of V1 primary scope**（Correction-1 / P2-1）。`design-review` + KI-UI-004 補強 lens へ handoff |

### 8.2 No evidence => no unsupported finding

```text
screenshot / browser evidence なし
  → visual usability finding を出さない
  → 「推測」「おそらく」「改善余地」で PASS を維持しない
  → HOLD または NOT APPLICABLE
```

### 8.3 Evidence vs preference

| 区分 | 例 | 扱い |
|---|---|---|
| evidence-backed defect | primary CTA が fold 下で clip、error state が視認不能 | P0 / P1 candidate |
| responsive break | 320px screenshot で label が control と重なる（操作 blocking） | P1（width-labeled evidence 必須） |
| responsive layout hypothesis | breakpoint 設計 / safe area / content growth の改善提案 | **handoff note のみ**（P2 adaptive-layout-review） |
| visual preference | 「もう少し余白があるとよい」 | **finding にしない**（Contract 未違反なら） |
| Contract violation | save 5-state 語彙混同 | **design-review** へ handoff（本 Skill では確定しない） |

### 8.4 Role-specific minimum evidence

| Role / surface | 最低 rendered evidence |
|---|---|
| FIELD_STAFF | tablet 幅（Visual Hierarchy: LOW / touch-first）。Today / Users 等の代表 surface screenshot |
| PLANNER | desktop 幅。Overview / Review / Support Plan 等の代表 surface screenshot |
| ADMIN / AUDIT | 本 V1 では任意。指定 slice が ADMIN のみなら desktop evidence |

smoke 証跡（`spfx/smoke/**`）は synthetic / presentation 境界を維持する。本番データ・個人情報は使わない。

### 8.5 Responsive vs adaptive-layout boundary（Correction-1 / P1-3）

| 観点 | `rendered-usability-review` V1 | `adaptive-layout-review` P2 |
|---|---|---|
| width-labeled clip / overlap / unreadable state | P0/P1 可（screenshot 根拠） | 受け取り可 |
| breakpoint を content break で決める | finding にしない | 主担当 |
| safe area / notch / full-bleed | handoff note | 主担当 |
| long-string / i18n content growth | handoff note（clip が見えれば P1） | 主担当 |
| touch-target layout verification | handoff note（44px 等は KI-UI-004 補強） | 共有 |
| visual preference / polish | finding にしない | finding にしない |

## 9. Review dimensions（rendered-usability-review）

Contract 適合は **design-review** に委譲し、本 Skill は rendered 観点のみを見る。

| Dimension | 見ること | 見ないこと |
|---|---|---|
| hierarchy | 視線誘導、primary vs secondary、情報の前後関係 | Domain 意味、status vocabulary 正否 |
| density | 詰まり、scan 可能性、role density との視覚的一致 | nav / destination 変更 |
| readability | 行長、ラベル可読性、状態の視認性 | 文言の業務意味変更 |
| visual state | empty / loading / error / disabled の区別（見た目） | fail-closed 語彙正否 |
| spacing / alignment | グループ境界、control と content の分離 | 新 token 提案 |
| motion（visual） | 過剰 motion の視覚的妨害 | KI-UI-003 数値の自動採用 |
| brand / polish | DADS 既存 dialect との一貫性（見た目） | 新 design system 提案 |
| responsive visual（V1） | 代表 viewport で clip / overlap / state 不可視（width-labeled evidence） | breakpoint / safe-area 設計 |

Runtime a11y（touch / zoom / keyboard-only / forced-colors）は **見ない**（Correction-1 / P2-1）。`design-review` + KI-UI-004 へ handoff。

## 10. Findings classification

| 重大度 | 定義（rendered usability） |
|---|---|
| P0 | rendered evidence 上、業務操作不能・重大な誤認・安全上の視認不能 |
| P1 | 代表フロー usability を著しく損なう clip / overlap / state 不可視 |
| P2 | 改善余地だが代表フローは完了可能。記録して後続可 |

`READY` は本 Skill では原則使用しない。

## 11. Handoff rules

### 11.1 To design-review

次を見つけたら **Contract 側** として design-review へ handoff する。本 Skill 単独で FAIL 確定しない。

- status vocabulary / save 5-state / empty vs fail-closed 混同
- Catalog / Template / Visual Hierarchy Contract 違反
- a11y 意味チャネル（label / live region / color-only status）
- `lint:ui-sem` / a11y gate 退行
- runtime a11y verification 疑い（touch / zoom / keyboard-only / forced-colors）（KI-UI-004 補強 lens）

### 11.2 From design-review

design-review が `HOLD`（visual / rendered 証跡不足）とした UI PR は、本 Skill の入力候補となる。

### 11.3 To adaptive-layout-review（P2 後続）

- breakpoint 崩れ地点
- safe area / clip / content growth
- tablet width 専用 layout break

本 V1 では **P0/P1 finding に昇格せず** handoff note として記録する（Correction-1 / P1-3）。clip / overlap が rendered evidence 上で既に visible なら §8.5 のとおり P1 可。

## 12. Workflow placement（target）

Implementation Start 時に `docs/process/development-process.md` へ追記予定:

```text
Implementation
  ↓
Browser / Screenshot Evidence
  ↓
rendered-usability-review（UI 差分 + rendered 証跡あり）
  ↓
design-review（Contract gate — blocking）
  ↓
review-pr 他観点
```

V1 では `adaptive-layout-review` ステップは **挿入しない**（Correction-1 / P1-1）。P2 導入後は §4.1 full target order へ拡張する。

`rendered-usability-review` PASS は `design-review` PASS を **置換しない**（Correction-1 / P1-2）。

`review-pr` 必須化は Implementation Start で判断する。Definition 時点では **後続 Skill** として HOLD。

## 13. Acceptance（Definition）

1. 本 Definition 文書が repository-canonical である
2. Definition Correction-1 / Correction-2 が適用され、P1/P2 残が text 上 zero である
3. KI-UI-004 / 005 / 006 が catalog に索引されている
4. `rendered-usability-review` が skill-catalog **後続** に掲載されている
5. 外部 `design-review` との名前衝突回避が明記されている
6. evidence contract（no screenshot => no unsupported visual finding）が固定されている
7. V1 workflow / gate independence / responsive ownership split が固定されている
8. Human gate chain（§15）が固定され、Implementation Start 直行記述がない
9. Product UI Contract remains authority が明記されている
10. Implementation Start まで Skill ディレクトリを作らない（verify:skills 整合）

## 14. Next phase — Implementation Start prerequisites

Implementation Start は **§15 Human gate chain** の Post-Merge 到達 **かつ** 明示 `UI-RENDERED-REVIEW-V1 Implementation Start GO` 後のみ実施:

```text
.agents/skills/rendered-usability-review/SKILL.md   （Appendix A を正本化）
.agents/skills/rendered-usability-review/sample-output.md
scripts/verify-skills.mjs                           expectedInstalledSkills 追加
docs/process/skill-catalog.md                       導入済みへ昇格
.agents/agents/review.md                            導入済み行
docs/process/development-process.md                 workflow 追記
.agents/commands/review-pr.md                       UI 差分時 Fallback（任意）
npm run verify:skills / verify:ci                   PASS
KI-UI-004 / 005 / 006                               source pin revalidation（§5.2）
```

```text
Definition ACCEPT/LOCK alone     → Implementation Start NOT AUTHORIZED
Merge alone                      → Implementation Start NOT AUTHORIZED
Post-Merge without Start GO      → Implementation Start NOT AUTHORIZED
```

## 15. Human gate chain（Correction-2 / P1-2）

Definition publication から Implementation Start までの **唯一の許可順序**:

```text
1. Definition focused Re-Review PASS
2. Human Definition ACCEPT/LOCK
3. PR Ready（Human）
4. Merge（Human）
5. Post-Merge reconciliation（definition canonical on main）
6. Human UI-RENDERED-REVIEW-V1 Implementation Start GO
7. Implementation Start authorized
```

```text
FORBIDDEN shortcuts:
  Re-Review PASS → Implementation Start
  Definition ACCEPT/LOCK → Implementation Start
  Ready → Implementation Start
  Merge → Implementation Start
  Post-Merge → Implementation Start（without explicit Start GO）
```

Agent rule: 各 gate 間で STOP。次 gate の Human GO / action なしに Implementation Start 前提作業（Skill ディレクトリ作成、verify:skills 昇格、application mutation）を開始しない。

## Appendix A — rendered-usability-review SKILL specification（draft）

Implementation Start まで **実行正本にしない**。正本化時は Appendix を `.agents/skills/rendered-usability-review/SKILL.md` へ移す。

```md
# rendered-usability-review

## 目的

browser / screenshot evidence を根拠に、実画面の usability / visual quality を read-only で評価する。

Product UI Contract 適合、Domain 意味、a11y gate / smoke / lint:ui-sem は `design-review` が担当する。本 Skill は **rendered 結果が実際に使いやすいか** のみを見る。

外部 `Superfuture/design-review` とは別 Skill である。実行正本は `.agents/skills/rendered-usability-review/` のみ。

## 使用する場面

- UI / presentation 差分があり、screenshot または browser smoke 証跡がある PR レビュー
- design-review が visual / rendered 証跡不足で `HOLD` とした UI PR の follow-up
- Visual Polish / DADS-UX / FIELD_STAFF tablet / PLANNER desktop の rendered 品質確認

## 入力

- 対象 PR / head SHA / UI 差分要約
- rendered evidence（screenshot / browser capture / smoke 証跡 doc への参照）
- 任意: `design-context` 出力
- 任意: 対象 role（FIELD_STAFF / PLANNER / ADMIN）
- External Intelligence（GUIDANCE_ONLY）: KI-UI-001, KI-UI-005（Allowed list のみ）。layout / runtime a11y は handoff

## 前提条件

- head SHA が固定できる
- UI / presentation 差分がある
- visual finding に必要な rendered evidence が添付または参照可能

## 実行手順

1. UI 差分の有無を判定する。なければ `NOT APPLICABLE`
2. rendered evidence の有無を判定する。visual finding に必要な証跡がなければ `HOLD`
3. 対象 role / viewport（FIELD_STAFF tablet、PLANNER desktop 等）を evidence から特定する
4. hierarchy / density / readability / visual state / spacing を rendered evidence 上で評価する
5. component state（empty / error / disabled / loading）が視覚的に区別できるか確認する
6. visual preference と evidence-backed defect を分離する
7. responsive layout 設計疑いは adaptive-layout handoff note とし、V1 では P0/P1 に昇格しない（clip/overlap visible 時を除く）
8. runtime a11y 疑いは design-review + KI-UI-004 へ handoff する
9. Contract / semantics / a11y 意味の疑いがあれば design-review へ handoff し、本 Skill では確定しない
10. Findings を P0 / P1 / P2 で整理し判定する。本 Skill PASS は design-review PASS を置換しない

## 確認項目

- primary action が rendered 上で視認・到達可能か
- 情報 hierarchy が scan 可能か（証跡上）
- error / empty / disabled state が視覚的に区別できるか
- FIELD_STAFF tablet / PLANNER desktop の代表 evidence が揃っているか（slice による）
- screenshot なしの visual finding を出していないか
- 外部 Skill の `--apply` や source mutation を提案していないか
- SBS / DADS token を外部 px 値で上書き提案していないか

## 停止条件

- head SHA 不明
- UI 差分があるのに rendered evidence がなく、visual finding の推測補完を求められている
- Domain 意味変更を本 Skill だけで確定するよう求められている
- 外部 `design-review` Skill をローカル実行正本として使うよう求められている
- Product UI Contract 変更を本 Skill 出力だけで確定するよう求められている

## 判定基準

- `PASS`: rendered evidence 上、未解決 P0 / P1 がない
- `READY`: 本 Skill では原則使用しない
- `HOLD`: rendered 証跡不足、role / viewport 不明、measured evidence 不足
- `FAIL`: P0 / P1 の rendered usability 破壊。P2 は後続可
- `NOT APPLICABLE`: UI / presentation 差分がない

## 成果物

- rendered evidence 一覧（path / viewport / role / surface）
- usability / visual quality 評価要約
- Findings（P0 / P1 / P2）— 各 finding に evidence ref 必須
- design-review / adaptive-layout-review への handoff 項目
- 次アクション

## 禁止事項

- merge、push、deploy を自動実行手順に含めること
- SharePoint変更、Microsoft 365変更、Entra ID変更を承認不要または自動実行として扱うこと
- 本番データ変更や物理削除を許可または手順化すること
- 未確認事項を推測で確定すること
- `HOLD` を `PASS` / `READY` と同義に扱うこと
- `design-review` を本 Skill で置換すること
- 外部 Skill の `--apply`、install、runtime execution を手順化すること
- Product UI Contract / Domain semantics を変更すること
- rendered evidence なしの visual finding を出すこと

## 出力形式

# rendered-usability-review

## Summary
- 判定: PASS / HOLD / FAIL / NOT APPLICABLE
- 対象PR:
- head SHA:
- role / viewport:

## Rendered Evidence
| ID | kind | viewport | role | surface | ref |
|---|---|---|---|---|---|
| E-001 | screenshot | 768px | FIELD_STAFF | Today | path or smoke doc |

## Usability Assessment
- hierarchy:
- density:
- readability:
- visual states:
- spacing / alignment:

## Findings
| ID | 重大度 | 状態 | 内容 | evidence ref | 対応 |
|---|---|---|---|---|---|
| F-001 | P1 | OPEN |  | E-001 |  |

## Handoff
- design-review:
- adaptive-layout-review:

## HOLD
- なし / または列挙

## Next Actions
1.
2.
```

## Appendix B — adaptive-layout-review boundary sketch（P2 / 後続）

本 V1 では Skill 未作成。KI-UI-006 を GUIDANCE_ONLY で参照。

- breakpoint は端末名ではなく content break 地点
- critical action の clip 禁止
- safe area / content growth / reading order
- FIELD_STAFF tablet evidence
- SBS_SPACE / DADS token 下位。外部 8/16/24px を token より上位にしない

Implementation unit 候補: `UI-ADAPTIVE-LAYOUT-REVIEW-V1`
