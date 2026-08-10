# Issue Status Reconciliation — read-only assessment

この文書は、OPEN Issue 本文の Current status / Gate / Dependency が
repository SoT からずれていることについての **read-only 評価正本** である。

Issue の close・本文更新・コメント投稿は本文書では行わない。
CN-1 を次 substantive gate から奪わない。

```text
repository: yasutakesougo/severe-behavior-support-spfx
Kind: Process assessment（read-only）
Status: ASSESSED / NOT EXECUTED
Assessment date: 2026-08-10
Assessor: Human read of OPEN Issues + repository SoT
Agent GitHub Issues API: 403（cannot read/write Issue bodies in this environment）
GitHub Issue mutation by this assessment: NONE

Current SoT（durable）:
  main HEAD at assessment write-up: 2a0b34c9e45f9125728240b41dee26b02999fd02
  PR #186: CLOSED / NOT MERGED / SUPERSEDED by PR #187
  PR #187: MERGED / Current SoT（merge ab64c35…）
  PR #188: MERGED / Independent Review PASS
  Next substantive gate: CN-1（Internal Column Names）
  SharePoint adapter / schema mapping impl: HOLD until CN-1 closed
  Implementation Start: HOLD
  Deploy / real data: NO-GO
```

## 1. Verdict

| 対象 | 判定 |
|---|---|
| 最新 PR / Decision 進行 | 整合して進行中 |
| CN-1 を次ゲートとする停止 | 整合 |
| Implementation Start HOLD | 整合 |
| SharePoint adapter / schema mapping HOLD | 整合 |
| OPEN Issue 本文の Current status | **STALE 多数** |
| Issue #6 プロジェクト進捗 | **重大な STALE**（Human attestation） |
| Issue #8 DEC-008 台帳本文 | **最新一次資料 / docs SoT と未同期**（Human attestation） |
| Issue #22 依存関係表示 | **CN-1 導入前モデルが残存**（Human attestation） |
| 即時コード実装 | **NO-GO** |

```text
最大の整合性問題:
  進捗そのものより、Issue 本文が現在の正本状態に追随していないこと。

今やるべきこと:
  新しい実装ではない。
  次 substantive unit = CN-1 Selection / Packet / read-only observation。

その後に入れるべき process unit:
  Issue Status Reconciliation
  （#6 / #8 / #22 を中心に Current / Gate / Dependency のみ再同期）

分離規則:
  Issue を閉じること ≠ 本文を最新状態にすること
```

## 2. Human-attested STALE snapshots（not Agent-observed)

Agent はこの環境で Issue body を API 取得できない（403）。
以下は Human の実読結果を durable に固定する。

### 2.1 Issue #6（重大 STALE）

```text
Human-observed Current status still showing initial-era markers:
  Implemented: 0
  Verified: 0
  Issue #7 contracts correction: HOLD
  contracts CI: MISSING
  Issue #19 正式回答待ち

Contradicts current SoT facts such as:
  Contracts / Process CI green on recent PRs（e.g. #188）
  many Decision / Canonical units CONSUMED
  PR #187 MERGED / Current SoT
  PR #188 Independent Review PASS
  next substantive gate = CN-1
```

### 2.2 Issue #8 / DEC-008（docs SoT と未同期）

```text
Human-observed Issue #8 ledger text still showing:
  DEC-008 Status: Deferred
  制度上の作成・確認資格と、法人内の起票・承認フローを
  Batch A-2 で分離して決定する。

Repository SoT（Accepted / LOCKED）:
  docs/architecture/decision-dec-008-acceptance.md
  制度上の作成者 = 実践研修修了者 = ACCEPTED
  独立した最終承認者 = NOT ADOPTED
  サービス管理責任者を最終承認者とする案 = NOT ADOPTED
  提出・差戻しロール = application に固定しない（Option C）
  Issue #8 ledger comment previously posted: 5229571943
    （decision-dec-008-issue8-ledger-registration.md）

Primary-source note retained by Human:
  生活介護の重度障害者支援加算について
  「実践研修修了者が支援計画シート等を作成する」制度根拠は確認済み。
  独立した「サービス管理責任者による最終承認」を制度要件とする根拠は未確認。
```

### 2.3 Issue #22（依存モデル STALE）

```text
Human-observed Current判定 still showing pre-CN-1 model:
  #22A -> #29 -> #22B
  #22A Implementation: HOLD
  #22B Implementation: HOLD

Current progressing model（repository SoT）:
  PR #186 CLOSED / SUPERSEDED
  PR #187 MERGED / Current SoT
  PR #188 Independent Review PASS
  Next substantive gate: CN-1
  SharePoint adapter / schema mapping: HOLD
  Implementation Start: HOLD
```

## 3. Reconciliation scope（when selected later）

| In scope | Out of scope |
|---|---|
| Current status 節の SoT 追随 | 新規実装 |
| Gate / Dependency 表示の追随 | CN-1 観測値の発明 |
| DEC-008 Accepted / LOCKED 文言への同期 | DEC-008 再 Decision |
| 「close」と「body resync」の分離実行 | Issue を閉じただけで整合完了とみなすこと |
| #6 / #8 / #22 を中心にした OPEN Issue 本文 | tenant / SharePoint mutation |

```text
Recommended order when Reconciliation is selected:
  1. Freeze SoT pointers（main SHA / PR #187 / #188 / CN-1 state）
  2. Patch Issue bodies Current/Gate/Dependency only
  3. Decide close vs keep-open separately per Issue
  4. Do not treat close as substitute for body sync
```

## 4. Sequencing lock

| Order | Unit | Status |
|---|---|---|
| 1 | CN-1 Selection / Packet / read-only observation | **CURRENT substantive gate** |
| 2 | Issue Status Reconciliation（#6 / #8 / #22 center） | **SCHEDULED after CN-1** |
| — | Implementation Start | HOLD |
| — | SharePoint adapter / schema mapping impl | HOLD until CN-1 closed |

```text
This assessment does NOT select Issue Status Reconciliation as the current gate.
This assessment does NOT authorize hygiene-only Issue mutation PR as Implementation.
NO_DEDICATED_SYNC_PR policy remains for self-referential PR live-state cleanup
（docs/process/self-referential-gate-policy.md）。
Issue body SoT drift is a separate process debt from PR self-referential stale.
```

## 5. Explicit non-authorization

```text
This assessment does NOT authorize:
  GitHub Issue create / edit / close / comment
  Implementation Start
  SharePoint adapter / schema mapping code
  CN-1 Internal Name invention
  DEC-008 re-open / re-Decision
  Deploy / real data
  treating STALE Issue Current status as project truth over repository docs
```

## 6. Next

```text
Stop point: HUMAN_CN1_INTERNAL_NAME_READ_ONLY_OBSERVATION
Immediate substantive unit: CN-1
  selection: decision-ilb-1-twenty-eighth-residual-cn1-selection.md
  packet: decision-assessment-snapshot-cn1-observation-packet.md
  method: Human read-only observation；mutation 0
  evidence shape: Display Name → Internal Name → Column Type → List → Site
  Sites: isogo / honmoku
  Lists: SupportPlans / AssessmentSnapshots

After CN-1:
  Issue Status Reconciliation = independent next-unit candidate
  resync #6 / #8 / #22 Current/Gate/Dependency against SoT
  keep close decisions separate from body updates

Until then / FORBIDDEN now:
  Implementation Start = HOLD
  adapter / schema mapping = HOLD
  Issue 一括 Close / 一括本文更新 = FORBIDDEN
  SharePoint schema/list/column change = FORBIDDEN
  GitHub Issue mutation = FORBIDDEN
  Deploy / real data = NO-GO
```
