# SBS-MGMT-LOOP-B — Staff Finding Fix Scope 1

```text
repository: yasutakesougo/severe-behavior-support-spfx
unit: SBS-MGMT-LOOP-B (#553)
kind: staff finding fix scope / correction scope packet
basis product HEAD (PR #576): 633a5b461eabe49902e92486670272f6ac9231bc
authority evidence: docs/architecture/sbs-mgmt-loop-b-actual-staff-value-check.md
matrix: Understanding Test Matrix v1 / Correction-1
status: SCOPE DRAFT / AWAITING PONYTAIL + Human Correction Implementation GO
Ready / Merge / Deploy / LIVE WRITE: NOT AUTHORIZED
Human Ready GO consumption: BLOCKED
UI implementation: NOT STARTED / NOT AUTHORIZED BY THIS DOC
mutation: 0
```

## 1. Why this scope exists

Actual Staff Value Check — Staff 1 = HOLD。

Simulation の P2 予測より重い、安全境界・ライフサイクル理解の不足が実職員で確認された。

```text
Simulation Evidence < Actual Staff Evidence
#576 Ready = NOT AUTHORIZED
ACCEPTABLE = NOT ESTABLISHED
```

## 2. Frozen findings（Staff 1）

| ID | Severity | Finding | Matrix |
|---|---|---|---|
| F-ASV-B-001 | P1 | 次操作が一意に定まらない | C1-2 = NO |
| F-ASV-B-002 | P1 | Source Immutability 未成立（新規/既存の作成編集？） | C1 PRE = NO |
| F-ASV-B-003 | P1 | Draft 作成後の最新版を適用中と理解 | C2-4b = NO, C3-4 = NO |
| F-ASV-B-004 | P2 secondary | 版3残置 / 版4 Draft 関係を説明できない | C3-1..C3-4 |

## 3. Fix Scope（最小・4 点）

新 workflow / 新 state / 新 component はまだ不要。主に文言・視覚的優先順位・状態表示の最小修正。

| # | Fix | Closes | Allowed change class | Forbidden expansion |
|---|---|---|---|---|
| 1 | 次操作を一意化 | F-ASV-B-001 | CTA 語・readback「次にすること」整合、primary 単独化、競合 CTA の視覚降格 | 新画面 / 新 wizard / 新 route |
| 2 | 「現行版は変更しない」を CTA 直前で明確化 | F-ASV-B-002 | CTA 直前の immutability コピー強調 / 近接配置 | domain 契約変更、永続化追加 |
| 3 | Draft 作成後に「まだ適用開始されていない」を明示 | F-ASV-B-003 | Draft 状態行の明示語追加（適用未開始） | 適用開始フロー実装、本番保存接続 |
| 4 | display-only / 計画操作との競合を最小限整理 | F-ASV-B-001 / F-ASV-B-002 | disabled predecessor・「計画操作（表示専用）」の視覚/文言競合低減 | 計画操作の実装有効化、LIVE WRITE |

```text
IN:
- copy / label / visual priority
- Draft status wording
- demote or separate competing display-only controls

OUT:
- new workflow
- new state machine
- new component system
- SharePoint / LIVE WRITE / Deploy
- Ready / Merge
- Human Ready GO consumption
```

## 4. Minimality / Ponytail Check（必須）

Human Correction Implementation GO の前に確認する。

```text
1. 4 点以外の UI / domain 変更を含めていないか
2. Simulation P2 の文言候補だけで Staff P1 を解消しようとしていないか
   （Staff Evidence を優先し、P1 3 件を閉じる）
3. 「適用開始」明示が適用開始機能の実装に拡大していないか
4. display-only 整理が mutation 有効化に拡大していないか
5. Exact HEAD 再固定と Actual Staff Re-Check が後段に残っているか
```

判定語:

```text
PONYTAIL PASS
= 上記 1–5 を満たし、最小 UI correction のみ

PONYTAIL HOLD
= 範囲拡大 / 新 component / 永続化 / Ready 消費が混入
```

## 5. Required gate sequence

```text
Actual Staff Value Check = HOLD
↓
Staff Finding Fix Scope（本書類）
↓
Ponytail / Minimality Check
↓
Human Correction Implementation GO
↓
minimal UI correction on #576（または後継 correction PR）
↓
Focused Verification
↓
Rendered Browser Acceptance（1280×900 + 390×844）
↓
Exact HEAD fixation
↓
Independent Implementation Re-Review
↓
Actual Staff Re-Check（同一 4 問 + C1–C3 observer scoring）
↓
PASS / ACCEPTABLE のみ Human Ready GO consumption 可
```

## 6. Re-Check acceptance bar（予告）

Staff Re-Check で少なくとも次が必要:

| Check | Required direction |
|---|---|
| C1-2 | YES または PARTIAL（次操作が一意） |
| C1 PRE / Source Immutability | 「既存計画の編集」誤認が消える |
| C2-4b | Draft ≠ 適用開始（「最新版を使っている前提」が消える） |
| C3-4 | 「版3を残して版4 Draft」を説明できる |

```text
Q4 「最新版を使ってる前提」再発
→ HOLD 継続
```

## 7. Current frozen gate

```text
#576 = OPEN / DRAFT
product HEAD = 633a5b461eabe49902e92486670272f6ac9231bc
Actual Staff Value Check = HOLD
Human Ready GO = RECEIVED / NOT CONSUMED / BLOCKED BY STAFF P1
Merge / Deploy / LIVE WRITE = NOT AUTHORIZED
Human Correction Implementation GO = NOT RECEIVED
mutation = 0
```
