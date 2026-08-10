# Decision-AUTO-1 — AUTONOMY-POLICY-V1 packet

この文書は、AI Development OS レーンの最初の unit **AUTO-1 AUTONOMY-POLICY-V1**
（autonomy policy contract）についての Human Decision Packet である。

Contract candidate 正本:
[`../process/autonomy-policy-v1.md`](../process/autonomy-policy-v1.md)

Depends on（再 Decision しない）:
[`../../docs/decisions/DEC-AI-ORG-003.md`](../../docs/decisions/DEC-AI-ORG-003.md)
[`../../docs/decisions/DEC-AA-001.md`](../../docs/decisions/DEC-AA-001.md)
[`../../docs/decisions/DEC-AA-003.md`](../../docs/decisions/DEC-AA-003.md)
[`../process/routine-aug-v1.md`](../process/routine-aug-v1.md)
[`../process/process-optimization-v1.md`](../process/process-optimization-v1.md)
[`../process/low-auto-pilot-v1.md`](../process/low-auto-pilot-v1.md)

```text
repository: yasutakesougo/severe-behavior-support-spfx
Unit: AUTO-1 — AUTONOMY-POLICY-V1
Kind: Human Decision packet（contract acceptance → CONSUMED）
Status: CONSUMED（Human Decision Accepted / LOCKED）
Baseline main: 5ddb05950a2123a1fb609698b9673102a6190721
Candidate HEAD: 9fff0b6ee30090d88f06270a70347263e0baea56
Human unit selection: AUTO-1 = SELECTED / CONSUMED（2026-08-10）
Human plan adoption: Cursor = Builder / Codex = Independent Reviewer = ADOPTED（2026-08-10）
Human Decision: AUTO-1-A = ACCEPT（2026-08-10；S-1〜S-8 を candidate 記録どおり Accept）
Contract: ACCEPTED / LOCKED
Authorization expansion: NONE
Implementation Start: NOT GRANTED
Lane: AI Development OS（法人アプリ本体レーンと分離；EC-3 / EC-4 は skip しない）
Lane A（AIS-1-B ACCEPTED / LOCKED；EC-3 / EC-4 PENDING；Start HOLD）: UNCHANGED
Acceptance 正本: ../process/autonomy-policy-v1.md
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`../process/self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

## 1. Question

```text
LOW-AUTO-PILOT-V1 で成立した自律運用を機械強制へ移すため、
AUTONOMY-POLICY-V1（capability taxonomy / AUTO_ALLOWED・HUMAN_ONLY・FORBIDDEN /
risk binding / baseline SHA binding / allowedPaths / limits / fail-closed /
UNKNOWN → DENY / approval / audit / Gateway 判定 pipeline / reasonCode /
negative test 期待値）を契約として固定するか。

本 Decision ≠ Registry / Gateway / backend 実装開始
本 Decision ≠ capability 実行有効化
本 Decision ≠ 上位正本の緩和
本 Decision ≠ EC-3 / EC-4 skip
本 Decision ≠ LOW-AUTO-PILOT-V2 開始
```

## 2. Human 入力として記録済み（2026-08-10；再 Decision しない）

| 項目 | Human 入力 |
| --- | --- |
| Plan | Cursor = Builder / Codex = Independent Reviewer 構成を採用 |
| Unit | 次 substantive unit = AUTO-1 に固定 |
| 進め方 | AUTO-1 ではコードを書かず、機械判定可能な契約のみ固定 |
| Capability set | 提示の AUTO_ALLOWED 候補 10 件 / HUMAN_ONLY・DENY 9 件を「ほぼそのまま」採用 |
| 強制方式 | Prompt 禁止ではなく Gateway の capability 非保持で強制 |
| 判定順 | capability → packet → risk → approval → baseline → path → idempotency → ALLOW |
| DENY reason | UNKNOWN / POLICY_MISMATCH / BASELINE_MOVED / HUMAN_ONLY / OUT_OF_SCOPE |
| SDK | 特定 SDK 言語に依存しない「Cursor execution backend」抽象化（TypeScript SDK は AUTO-8 の最初の backend 候補；Python SDK は一次情報未確認のため前提にしない） |
| Negative tests | 5 件を LOW-AUTO-PILOT-V2 の前に置く |
| レーン | 法人アプリ本体（EC-3 / EC-4）と AI Development OS を分離。skip 禁止 |

## 3. Candidate contract が Human 入力へ追加した具体化（AUTO-1-A の確認対象）

| # | 具体化 | 内容 |
| --- | --- | --- |
| S-1 | HUMAN_ONLY / FORBIDDEN の 2 分割 | 提示の 9 件を、Ready / Merge / decision.\* = HUMAN_ONLY、sharepoint.\* / github.permission.write / secret.write / deploy.production = FORBIDDEN に分割（DEC-AI-ORG-003 の「人の事前承認 / 禁止」区分へ整合） |
| S-2 | reasonCode 割当表 | 各判定段の失敗 → 5 reasonCode の固定 mapping（FORBIDDEN → POLICY_MISMATCH、approval 不備 → HUMAN_ONLY 等） |
| S-3 | POLICY_BLOCKED の定義 | reasonCode ではなく表示ラベル: DENY ∧ reasonCode ∈ { HUMAN_ONLY, POLICY_MISMATCH, OUT_OF_SCOPE } |
| S-4 | Limits v1 数値 | max_repair_cycles = 3（DEC-AA-003 固定）、slices ≤ 4 / batch = 1（LOW-AUTO-PILOT-V1 整合）、changed files ≤ 20、diff ≤ 1000 行、commits ≤ 10、draft PR ≤ 1、requests ≤ 200 |
| S-5 | riskClass 割当 | branch.push / pull_request.create_draft / update_draft / review.request = MEDIUM、他 = LOW |
| S-6 | Idempotency 規則 | side-effect capability は idempotencyKey 必須。同一 key ＋ 同一 payload = 前回結果、異 payload = DENY |
| S-7 | audit-before-execute | 監査記録の書込成功まで実行しない。書けなければ DENY / UNKNOWN |
| S-8 | Conflict register | AUTO-C1〜C3: Draft PR / push / review.request の AUTO_ALLOWED 分類は現行 HUMAN-ONLY（別 GO）境界と衝突 → RECORDED ONLY。分類 ≠ 有効化。有効化は別 Human Explicit GO ＋ 上位正本整合更新 |

## 4. Options disposition

| Option | 内容 | 結果 |
| --- | --- | --- |
| **AUTO-1-A** | candidate contract をそのまま Accept（S-1〜S-8 含む） | **ACCEPTED（2026-08-10）** |
| AUTO-1-B | 修正付き Accept | NOT SELECTED |
| AUTO-1-HOLD | 保留 | NOT SELECTED |

```text
Human Decision（Accepted / LOCKED）: AUTO-1-A
S-1〜S-8: ACCEPTED（S-4 は policy ceilings 解釈つき；
  packet / pilot policy はより厳しい limit を設定してよい）
S-8 確認: taxonomy classification ≠ current enablement ≠ current authorization
  branch.push / pull_request.create_draft / update_draft / review.request:
  NOT newly enabled
pull_request.merge: HUMAN_ONLY ＋ Gateway 実装 MUST NOT EXIST（両立・非矛盾）

Agent recommendation（historical）: AUTO-1-A
Agent recommendation alone is NOT Human Acceptance evidence.
```

## 5. Done criteria（本 unit）

- [x] Contract candidate が machine-checkable（判定順 / reason / limits / 期待値が閉集合）で固定されている
- [x] 上位正本（DEC-AI-ORG-003 / DEC-AA / Routine AUG / PROCESS-OPT-V1 / LOW-AUTO-PILOT-V1）を緩和・書換していない
- [x] 衝突は Conflict register に RECORDED ONLY で残っている（偽解消なし）
- [x] AUTO-NT-1〜5 の期待値が固定されている
- [x] コード変更 0（docs のみ）
- [x] Human Acceptance = AUTO-1-A ACCEPT（2026-08-10）が正本化されている
- [ ] Draft PR のまま Human Ready Decision で停止（Live gate は PR 側で判断）

## 6. Explicit OUT / non-authorization

```text
This packet does NOT authorize:
  Capability Registry / Task Packet Schema / Action Gateway の実装
  Gateway 経由のいかなる実行有効化
  TypeScript SDK 採択（AUTO-8 の Human Decision）
  EC-3 / EC-4 の skip・順序変更
  LOW-AUTO-PILOT-V2 実行
  Ready / Merge without separate Human authorization
  SharePoint / M365 / Deploy / real data
```

## 7. Next

```text
AUTO-1 packet: CONSUMED
Contract: ACCEPTED / LOCKED（AUTO-1-A）
Authorization expansion: NONE
Implementation Start: NOT GRANTED
AUTO-2 / AUTO-3 / AUTO-4: NOT STARTED
Cursor execution backend: NOT STARTED
LOW-AUTO-PILOT-V2: NOT AUTHORIZED
Lane A EC-3 / EC-4: UNCHANGED / PENDING
Next gate: HUMAN READY DECISION FOR AUTO-1 recording PR
Negative tests AUTO-NT-1〜5 PASS まで LOW-AUTO-PILOT-V2 は開始しない
```
