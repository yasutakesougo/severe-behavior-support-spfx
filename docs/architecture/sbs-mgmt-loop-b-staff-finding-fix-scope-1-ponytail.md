# SBS-MGMT-LOOP-B — Staff Finding Fix Scope 1 Ponytail / Minimality Check

```text
repository: yasutakesougo/severe-behavior-support-spfx
unit: SBS-MGMT-LOOP-B (#553)
kind: ponytail / minimality check evidence
basis product HEAD (PR #576): 633a5b461eabe49902e92486670272f6ac9231bc
fix scope: docs/architecture/sbs-mgmt-loop-b-staff-finding-fix-scope-1.md
staff evidence: docs/architecture/sbs-mgmt-loop-b-actual-staff-value-check.md
date: 2026-09-03
verdict: PONYTAIL PASS
Human Correction Implementation GO: NOT RECEIVED
UI correction: NOT STARTED / NOT AUTHORIZED
Ready / Merge / Deploy / LIVE WRITE: NOT AUTHORIZED
mutation: 0
```

## 1. Gate position

```text
Actual Staff Value Check — Staff 1 = HOLD
Staff Finding Fix Scope（4点） = DEFINED
↓
Ponytail / Minimality Check
= PONYTAIL PASS
↓ NEXT
Human Correction Implementation GO
（待ち / Agent は付与しない）
↓ GO 後のみ
minimal UI correction
```

## 2. Checklist（Fix Scope §4）

| # | Check | Result | Evidence |
|---|---|---|---|
| 1 | 4 点以外の UI / domain 変更を含めていないか | PASS | Scope IN = copy / label / visual priority / Draft status wording / demote display-only のみ。domain revision contract・永続化・新 route は OUT |
| 2 | Simulation P2 文言候補だけで Staff P1 を解消しようとしていないか | PASS | Fix は Staff P1 3 件（F-ASV-B-001/002/003）を直接閉じる。Simulation の「少し迷う」前提に依存しない |
| 3 | 「適用開始」明示が適用開始機能の実装に拡大していないか | PASS | Fix 3 = Draft 状態行の明示語のみ。適用開始フロー / LIVE WRITE / 本番保存接続 = OUT |
| 4 | display-only 整理が mutation 有効化に拡大していないか | PASS | Fix 4 = disabled predecessor / 「計画操作（表示専用）」の競合低減のみ。mutationButton 有効化・LIVE WRITE = OUT |
| 5 | Exact HEAD 再固定と Actual Staff Re-Check が後段に残っているか | PASS | Fix Scope §5 に RBA → Exact HEAD → Re-Review → Staff Re-Check が残存。本 Check では消費しない |

```text
PONYTAIL PASS
= 上記 1–5 すべて PASS
= 最小 UI correction のみを Human Correction Implementation GO の候補とする
```

## 3. Four-point touch map（実装しない・範囲確認のみ）

対象 surface @ `633a5b4`（読取確認）:

| Fix | Staff Finding | Existing touch（実装候補・未着手） | Expansion risk（禁止） |
|---|---|---|---|
| 1 次操作一意化 | F-ASV-B-001 / C1-2=NO | `ReviewOutcomeCaptureView` readback「次にすること / 支援内容を見直す」↔ primary「変更内容の作成を始める」語整合；`SUPPORT_PLAN_NEXT_VERSION_CTA` disabled predecessor の視覚降格 | 新 wizard / 新 route / 複数 primary |
| 2 現行版は変更しないを CTA 直前で明確化 | F-ASV-B-002 / C1 PRE=NO | `SUPPORT_PLAN_NEXT_VERSION_NOTE` / `SUPPORT_PLAN_IMMUTABLE_VERSION_NOTE` を start-revision CTA 直前へ近接・短縮強調 | domain immutability 契約変更、永続化 |
| 3 まだ適用開始されていないを明示 | F-ASV-B-003 / C2-4b=NO | Draft block「状態: 下書き / 本番未保存」へ適用未開始の明示語を追加 | 適用開始 UI / 本番保存接続 |
| 4 display-only / 計画操作競合の整理 | F-ASV-B-001/002 | disabled「次の版を作る（表示専用）」と「計画操作（表示専用）」見出しの視覚/文言競合低減 | 計画操作の実装有効化 |

```text
new workflow / new state / new component = NOT REQUIRED
change class = copy + visual priority + draft status wording only
```

## 4. Explicit non-authorization

```text
PONYTAIL PASS
!= Human Correction Implementation GO
!= UI implementation start
!= #576 Ready
!= Human Ready GO consumption
!= Merge / Deploy / LIVE WRITE
```

Agent は本 Check の結果だけをもって UI を変更しない。

## 5. NEXT（Human）

```text
Human:
1. Ponytail PASS を確認
2. Human Correction Implementation GO を明示する場合のみ
   minimal UI correction を #576（または後継 correction PR）で許可

Agent:
- GO なし → STOP（mutation = 0）
- GO あり → Fix Scope 4 点のみ実装 → Focused Verification → RBA → …
```

## 6. Frozen gate

```text
#576 = OPEN / DRAFT @ 633a5b461eabe49902e92486670272f6ac9231bc
#579 = OPEN / DRAFT（本証跡を含む docs PR）
Actual Staff Value Check = HOLD
Staff Finding Fix Scope = DEFINED
Ponytail / Minimality Check = PONYTAIL PASS
Human Correction Implementation GO = NOT RECEIVED
Human Ready GO = RECEIVED / NOT CONSUMED / BLOCKED BY STAFF P1
Merge / Deploy / LIVE WRITE = NOT AUTHORIZED
mutation = 0
```
