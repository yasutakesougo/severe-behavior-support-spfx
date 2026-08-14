# RELEASE-READINESS-1 — Start = GO

```text
Unit: RELEASE-READINESS-1
Gate: Release Gate（判定のみ。Deploy 実行はしない）
Start: GO（Human authorized 2026-08-14）
Skill: .agents/skills/release-review/SKILL.md
Command affinity: release-check / review → Audit（merge-audit ではない）
```

## Upstream complete

```text
DADS-01…06 / DADS-UX-1…6 / DADS-VERIFY = COMPLETE
VISUAL-ACCEPTANCE-1 = ACCEPT / COMPLETE
  baseline SHA: 709804548a42fc7bf3e3e6da3f24cfd57d4677f0
  decision: A. VISUAL ACCEPTANCE READY
  evidence: docs/architecture/visual-acceptance-1-closeout.md
FIELD-WORKFLOW UI (#356 / PR #357) = MERGED on later main tip（see SHA pin）
Deploy / SharePoint write / #299 Close = HOLD（unchanged）
```

## Objective

本番 / SharePoint 展開の**前**に、最終 Readiness 判定材料を作る。

この Unit の成果は **Deploy GO / HOLD / FAIL の判定** であり、Deploy 実行・App Catalog 登録・tenant mutation ではない。

## SHA pin（必須・最初に固定）

Human Start 時点の事実:

| Label | SHA | Note |
|---|---|---|
| Visual Acceptance baseline | `709804548a42fc7bf3e3e6da3f24cfd57d4677f0` | VA-1 ACCEPT/COMPLETE |
| Current `origin/main` tip（at packet authoring） | `8173a4c18f6ce85254467c67ce81b481a537a35d` | includes PR #357 FIELD-WORKFLOW UI |

Agent は作業開始時に `git fetch origin main` し、**Release Candidate SHA を明示固定**する。

推奨ピン（Start 既定）:

```text
Release Candidate = current origin/main tip after fetch
Also record: VA baseline 7098045… and delta since VA（commit list summary）
If tip moved again: use new tip and restate delta
```

VA baseline のみを RC にする場合は Human が別途明示する。推測で VA に巻き戻さない。

## In scope（read-only / docs evidence）

1. **Package**
   - `spfx/config/package-solution.json` identity（name / id / version）
   - production build / `heft package-solution --production` 再実行可否と結果（実行可なら実行。失敗は HOLD/FAIL）
   - `.sppkg` 成果物の有無とパス
2. **SharePoint 列・権限**
   - 既存正本から「必要な list/column / permission」を列挙
   - live 未確認は `INTENDED` / `UNKNOWN` と明示（CONFIRMED にしない）
   - Domain が SharePoint 実装に依存していないことの再確認
3. **live 接続条件**
   - binder / SpHttpClient / site context の前提
   - demo / synthetic / live の境界フラグ
   - live read / live write の承認状態
4. **Rollback**
   - App Catalog / package 差し戻し手順の文書有無
   - 手順が無い・未確認なら HOLD（Deploy GO にしない）
5. **既知 P2**
   - VA-1 P2（User Detail 表示順ラベル）
   - FIELD-WORKFLOW / DADS residual P2 if any
   - Deploy ブロッカーかどうかの分類
6. **#299 Close 条件**
   - #299 は既に CLOSED（completed）であることの live 確認
   - 「この Readiness で reopen / close しない」こと
   - もし Human が Close 条件の再確認を求める場合は条件表のみ（mutation 禁止）
7. **Release Gate checklist**（`docs/process/gate-definitions.md` Release Gate）
   - main SHA 固定
   - artifact 定義
   - 環境差分
   - 権限影響
   - ロールバック
   - 受入証跡（DADS + VA-1）
   - deploy 承認 / 本番承認の要否と状態

## Out of scope / FORBIDDEN

```text
Deploy / App Catalog publish / tenant install
SharePoint list/column mutation
Microsoft 365 / Entra mutation
production write / real user data
Ready / Merge of unrelated PRs as side effect（docs evidence PR only if needed）
#299 / #68 / #69 / #347 / #352 / #356 Issue mutation
application CSS/UI fixes for VA P2/P3
DADS-UX-7+ implementation
```

## Required decision（exactly one）

```text
A. DEPLOY READY（Release Gate PASS 相当 — Deploy 実行は別 Human Deploy GO）
B. HOLD — readiness gaps remain
C. FAIL — P0/P1 release blocker
```

### A requires

- P0 = 0 / unresolved P1 = 0 for release blockers
- Release Candidate SHA fixed
- package identity + build/package evidence recorded
- SharePoint/permission requirements listed（CONFIRMED or explicitly UNKNOWN/HOLD）
- live connection conditions explicit
- rollback procedure exists or HOLD
- VA-1 + DADS acceptance cited
- deploy/本番承認の要否が明示（未取得なら A にしない → B）

### B

証跡不足・承認待ち・環境差分未整理・rollback 未確認・live 条件 UNKNOWN など。

### C

P0/P1 のリリースブロッカー。

## Required output

Agent 最終出力は次の固定形（長文で代替しない）:

```text
RELEASE-READINESS-1 Review
Release Candidate SHA:
VA baseline SHA:
Package:
SharePoint / permissions:
Live connection conditions:
Rollback:
Known P2:
#299 Close conditions:
Release Gate checklist:
P0:
P1:
P2:
Decision:
A. DEPLOY READY
or
B. HOLD — readiness gaps remain
or
C. FAIL — P0/P1 release blocker
Recommended next Human action:
<one action only>
Repository mutation:
<0 or docs-only evidence PR>
External mutation:
0
```

加えて Skill 形式の `release-review` セクションを添付してよい。

## Evidence priority

1. GitHub live state
2. Current main / Release Candidate SHA
3. Accepted / LOCKED Decision
4. Evidence Packet / VA-1 closeout / DADS closeout
5. Repository documentation
6. Historical documentation

`INTENDED != CONFIRMED`。古い docs 単独で CONFIRMED にしない。

## Docs evidence PR（任意）

判定結果を `docs/architecture/release-readiness-1-review.md` に残す場合:

- branch: `cursor/release-readiness-1-review-c62b`（または同等）
- docs-only
- Ready / Merge = HUMAN-ONLY
- Deploy を PR 完了条件にしない

## Copy-paste Start prompt（次 Agent へ）

次ブロックを次 Agent に渡してよい（Start = GO 済み）:

````text
# RELEASE-READINESS-1 — Final readiness before Deploy
Start = GO

Repository: yasutakesougo/severe-behavior-support-spfx

Upstream:
- DADS = COMPLETE
- VISUAL-ACCEPTANCE-1 = ACCEPT / COMPLETE
  baseline: 709804548a42fc7bf3e3e6da3f24cfd57d4677f0
  docs: docs/architecture/visual-acceptance-1-closeout.md
- Start packet: docs/architecture/release-readiness-1-start.md
- Skill: .agents/skills/release-review/SKILL.md

## Objective
Perform Release Gate readiness judgment only.
Do NOT Deploy. Do NOT mutate SharePoint / M365 / Entra. Do NOT close Issues.

## First steps
1. git fetch origin main
2. Fix Release Candidate SHA = current origin/main tip（record full SHA）
3. Record delta since VA baseline 7098045…
4. Execute release-review checklist

## Must cover
- package / package-solution / .sppkg
- SharePoint columns & permissions（CONFIRMED vs UNKNOWN）
- live connection conditions
- rollback
- known P2（including VA-1 P2）
- #299 Close conditions（no mutation）
- deploy approval / production approval state

## Decision
Exactly one of:
A. DEPLOY READY
B. HOLD — readiness gaps remain
C. FAIL — P0/P1 release blocker

## FORBIDDEN
Deploy, App Catalog publish, SharePoint write, Entra/M365 mutation,
production write, Issue close/reopen, UI fixes, Ready/Merge without Human.

If Deploy would be required to answer a question: record UNKNOWN/HOLD and stop.
````

## Current gate board

```text
DADS = COMPLETE
Visual Acceptance = COMPLETE
RELEASE-READINESS-1 = AUTHORIZED（Start GO） / NOT YET RUN
Deploy = HOLD
SharePoint write = HOLD
#299 Close = HOLD
```
