# GOV-AUD-08 — 復旧後の業務確認者 Human Acceptance（Option B）

この文書は、**GOV-AUD-08**（復旧後の業務確認者）についての
**Option B Human Acceptance evidence** である。

Decision packet:
[`decision-gov-aud-08-post-recovery-confirmer-decision-packet.md`](./decision-gov-aud-08-post-recovery-confirmer-decision-packet.md)

Unit Selection:
[`decision-gov-aud-08-post-recovery-confirmer-selection.md`](./decision-gov-aud-08-post-recovery-confirmer-selection.md)
（PR #261 MERGED）

Owner: Issue #19

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: GOV-AUD-08
Status: Accepted / LOCKED
Human Acceptance: Explicit Human Option B on 2026-08-11
Selected Option: B
Meaning:
  復旧後の業務確認者 = 業務責任者または指定確認者
Baseline tip: 952c82b00f56581b56e6ae5d4ed23c4150fbd394
PR: #262（Option B Acceptance / Packet sync / IR）

Does NOT mean:
  復旧確認手順・チェックリスト・再開条件の発明
  「指定確認者」の個人名を Agent が確定した
  GOV-AUD-09 / 10 の同時 SELECT または Accepted
  GOV-AUD-07 の再 Decision / 上書き
  SharePoint / Microsoft 365 / Entra mutation GO
  Implementation Start / Deploy / real data

FindingCode: HOLD
A-5: HOLD
Implementation Start: HOLD
Implementation auto-start: FORBIDDEN
next residual auto-select: FORBIDDEN
GOV-AUD-09/10 auto-SELECT: FORBIDDEN
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

## Human Acceptance

```text
Human Acceptance: Explicit Human Option B on 2026-08-11
GOV-AUD-08: Accepted / LOCKED
Selected Option: B

復旧後の業務確認者:
  業務責任者または指定確認者
```

```text
Prior non-binding recommendation: B または C（復旧実施者と分離）
  （Issue #19 設計上の推奨 / Recommended ≠ Binding）
Agent recommendation / Issue design tip ≠ Human Acceptance evidence
This document records the Human Decision「B」only.
```

## Accepted 内容

```text
GOV-AUD-08: Accepted / LOCKED
Selected: Option B

Post-recovery business confirmer:
  業務責任者または指定確認者
```

日本語正本:

```text
復旧後の業務確認者:
  業務責任者または指定確認者
```

意味:

- **復旧後の業務確認者は業務責任者または指定確認者**とする。
- 役割分担: Microsoft 365管理者が技術的に復旧したあと、業務責任者または指定された確認者が「業務として正常に戻ったか」を確認する。
- 復旧実施者と同一人物（A）/ 事業所管理者（C）/ その他（D）は本 Decision では採択しない。
- 再開承認者（GOV-AUD-09）・連絡経路（GOV-AUD-10）は別残件。
- 確認手順・チェックリスト・再開条件・tenant 操作・実装は本 Acceptance だけでは開始しない。
- 「指定確認者」の具体個人・名簿は本 Acceptance では確定しない（Human が別途明示するまで Agent は発明しない）。

## Acceptance boundary

```text
NOT derived / MUST NOT start from this Acceptance alone:
  復旧確認手順 / チェックリスト / 再開条件の発明
  指定確認者の個人名確定
  GOV-AUD-09 / 10 SELECT または Accepted
  GOV-AUD-07 re-Decision
  SharePoint / M365 / Entra mutation
  FindingCode / A-5
  Issue #19 Close
  next residual auto-select
  Implementation Start / Deploy / real data
```

## 既存契約との関係

| 単位 | 本 Acceptance 後 |
|---|---|
| Decision-GOV-AUD-08-SELECTION-1 | **UNCHANGED**（unit SELECTED / LOCKED） |
| GOV-AUD-01〜06（該当 Accepted 分） | **UNCHANGED** |
| GOV-AUD-07 | **UNCHANGED**（Accepted / Option A = Microsoft 365管理者） |
| GOV-AUD-09 / 10 | **OUT / NOT SELECTED** |
| Option A / C / D / H | **NOT SELECTED** |
| 確認手順 / tenant mutation | **HOLD / NOT STARTED** |
| FindingCode / A-5 / Implementation | **HOLD** |

## Next

```text
GOV-AUD-08: Accepted / LOCKED / Option B
next residual SELECT（one item；Agent auto-advance FORBIDDEN）
Issue #19 Close: NOT AUTHORIZED
Implementation Start: NOT AUTHORIZED
```

Agent は本 Acceptance を理由に確認手順発明・tenant mutation・GOV-AUD-09/10 自動 SELECT・次 residual 自動 SELECT へ進まない。
