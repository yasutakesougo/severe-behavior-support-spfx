# UI-RENDERED-REVIEW-V1 — Rendered Usability Review Boundary

```text
Program: UI-AGENT-SYSTEM-V1（review layer extension）
Unit: UI-RENDERED-REVIEW-V1 — rendered-usability-review boundary
Status: ACCEPTED / LOCKED（Human Decision recorded）
Definition Correction-1: APPLIED (P1-1 + P1-2 + P1-3 + P2-1 + P2-2 + P2-3)
Definition Correction-2: APPLIED (P1-1 + P1-2 + P2-1 + P2-2)
Definition status: ACCEPTED / LOCKED
Human Decision: ACCEPTED / LOCKED
Human GO: UI-RENDERED-REVIEW-V1 Definition ACCEPT / LOCK — RECEIVED / CONSUMED
Human GO: UI-RENDERED-REVIEW-V1 Implementation Start GO — RECEIVED / CONSUMED
Authority:
  Human GO: UI-RENDERED-REVIEW-V1 Definition Start
  Human GO: UI-RENDERED-REVIEW-V1 Definition ACCEPT / LOCK
  Human GO: UI-RENDERED-REVIEW-V1 Implementation Start GO
  docs/architecture/ui-agent-system-v1-design-issue-body.md
  docs/process/skill-catalog.md
  .agents/skills/design-review/SKILL.md
  docs/architecture/ui-rendered-review-v1-post-merge-reconciliation-1.md
Kind: Skill / catalog / workflow wiring（Implementation Start）
Implementation Start: AUTHORIZED（this PR）
Skill directory promotion: AUTHORIZED（this PR）
Deploy / SharePoint write / Product UI Contract mutation: FORBIDDEN
Domain semantics mutation: FORBIDDEN
Publication status:
  PR #521 MERGED / CONSUMED ON MAIN（f8b247f；HEAD a4beec5）
  PR #522 MERGED / CONSUMED ON MAIN（21c3427；HEAD 276c8eb）
Post-Merge reconciliation: COMPLETE（ui-rendered-review-v1-post-merge-reconciliation-1.md）
NEXT: Implementation Start publication → Ready → Merge
Agent: STOP on Product UI Contract / Domain / Deploy mutation
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

## 16. Definition acceptance / lock（Human GO consumed）

```text
Human GO: UI-RENDERED-REVIEW-V1 Definition ACCEPT / LOCK
Received: 2026-08-25
Human Decision: ACCEPTED / LOCKED
Publication: PR #521 MERGED / CONSUMED ON MAIN
  merge commit: f8b247f9b4cbf310e0c7c3fe07cd86924ac4cdd5
  consumed HEAD: a4beec5bf53bbd75c97aaa27437de1ae960eb6ca
Post-Merge publication: PR #522 MERGED / CONSUMED ON MAIN
  merge commit: 21c34277c701cdd2ae497fcc73c8f6b8a23fb5d2
  exact HEAD: 276c8ebe91223502bf806ab75db88f728f36ed2e
  CI #1424: SUCCESS
Post-Merge: COMPLETE（docs/architecture/ui-rendered-review-v1-post-merge-reconciliation-1.md）
Implementation Start: AUTHORIZED（Human Start GO RECEIVED / CONSUMED）
```

### Locked scope

本 ACCEPT/LOCK は次を固定する。

- `rendered-usability-review` 境界（evidence contract、V1 workflow、gate independence、responsive split）
- External Intelligence 索引 KI-UI-004 / 005 / 006（GUIDANCE_ONLY）
- Human gate chain §15（ACCEPT/LOCK → Ready → Merge → Post-Merge 完了；次は Implementation Start GO）
- Implementation Start 前提（§14）— 明示 Start GO まで Skill 未導入

### Not authorized by this ACCEPT/LOCK

```text
Implementation Start
Skill directory promotion / verify:skills 導入済み昇格
Product UI Contract / Domain semantics 変更
Deploy（Human-only；別 GO）
Issue mutation
```

### Gate chain progress

| Step | Status |
|---|---|
| 1. Definition focused Re-Review | **CONSUMED BY Human ACCEPT/LOCK** |
| 2. Human Definition ACCEPT/LOCK | **COMPLETE / CONSUMED** |
| 3. PR Ready | **COMPLETE / CONSUMED**（#521） |
| 4. Merge | **COMPLETE / CONSUMED**（#521 → main@f8b247f） |
| 5. Post-Merge reconciliation | **COMPLETE**（#522 → main@21c3427） |
| 6. Implementation Start GO | **RECEIVED / CONSUMED** |
| 7. Implementation Start | **IN PROGRESS**（Skill / catalog / workflow wiring） |

## 17. Implementation Start（Human GO consumed）

```text
Human GO: UI-RENDERED-REVIEW-V1 Implementation Start GO
Received: 2026-08-26
Basis main: 21c34277c701cdd2ae497fcc73c8f6b8a23fb5d2
Post-Merge: COMPLETE（PR #522）
```

### In scope

```text
.agents/skills/rendered-usability-review/SKILL.md
.agents/skills/rendered-usability-review/sample-output.md
scripts/verify-skills.mjs expectedInstalledSkills
docs/process/skill-catalog.md 導入済み昇格
.agents/agents/review.md 導入済み行
docs/process/development-process.md workflow 追記
.agents/commands/review-pr.md UI 差分時 Fallback
KI-UI-004 / 005 / 006 source pin revalidation（GUIDANCE_ONLY）
Post-Merge reconciliation COMPLETE recording
```

### Explicit OUT

```text
Product UI Contract / DADS / Catalog / Templates / Visual Hierarchy 変更
Domain semantics 変更
React / SCSS / token 変更
adaptive-layout-review Skill 実装
外部 Skill install / --apply
Deploy / SharePoint write / Issue mutation
```

### KI source pin revalidation（§5.2）

| ID | Canonical source | Pinned HEAD（Implementation Start preflight） |
|---|---|---|
| KI-UI-004 | jakubkrehel/skills `better-accessibility` | `ca483852de23d48ab4f4ea71da37dad12bd70a95`（repo main） |
| KI-UI-005 | Superfuture/design-review | `d4d2609b53fccb475d11490e2c6261e5eb2f0c5d`（repo main） |
| KI-UI-006 | jakubkrehel/skills `better-layout` | `ca483852de23d48ab4f4ea71da37dad12bd70a95`（repo main） |

Pins are GUIDANCE_ONLY fingerprints. Authority remains NONE. Pin ≠ PROMOTED.

## Appendix A — rendered-usability-review SKILL specification

実行正本は `.agents/skills/rendered-usability-review/SKILL.md`（Implementation Start で正本化）。本 Appendix は履歴参照。

## Appendix B — adaptive-layout-review boundary sketch（P2 / 後続）

本 V1 では Skill 未作成。KI-UI-006 を GUIDANCE_ONLY で参照。

- breakpoint は端末名ではなく content break 地点
- critical action の clip 禁止
- safe area / content growth / reading order
- FIELD_STAFF tablet evidence
- SBS_SPACE / DADS token 下位。外部 8/16/24px を token より上位にしない

Implementation unit 候補: `UI-ADAPTIVE-LAYOUT-REVIEW-V1`
