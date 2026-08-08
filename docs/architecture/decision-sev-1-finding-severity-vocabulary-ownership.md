# Decision-SEV-1 — FindingSeverity vocabulary ownership

この文書は、**Decision-SEV-1**（FindingSeverity vocabulary ownership / DEC 方式 A/B）の
**Accepted 正本**である。

値一覧・意味・assignment 主体は本 Decision では決めない。

## 基準

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-SEV-1
Status: Accepted
Selected: Option A
main before this canonicalization: 08d4a2533f31b94ff86df50cb28c7a93b8426928
Prior state: READY_FOR_HUMAN_DECISION / CANDIDATE / NOT ACCEPTED
```

### Human Acceptance（durable）

```text
Human Acceptance: Explicit Human GO on 2026-08-08
Acceptance: Decision-SEV-1 / Option A
Canonical ownership / change control: Issue #8 に新しい DEC を追加する方式
Contract break: NO
FindingIdentity: UNCHANGED
stable Finding ID: UNCHANGED
```

```text
Agent execution evidence: NOT Human Acceptance evidence
```

Cloud Agent run ID・PR 作成 agent 識別子は実行証跡であり、Human Acceptance 証跡に用いない。
GitHub Issue comment ID が後から付与された場合は、その comment ID を durable evidence として追記してよい。

上位入口:

- [`issue-24-decision-backlog.md`](./issue-24-decision-backlog.md)
- [`finding-audit-ownership.md`](./finding-audit-ownership.md)
- [`domain-reconstruction-foundation.md`](./domain-reconstruction-foundation.md)
- [`issue-24-remaining-audit-post-rsv.md`](./issue-24-remaining-audit-post-rsv.md)

## Accepted 内容

```text
Status: Accepted
Selected: Option A

Canonical ownership / change control:
  Issue #8 に新しい DEC を追加する方式

Contract break: NO
FindingIdentity: UNCHANGED
stable Finding ID: UNCHANGED
```

意味:

- FindingSeverity の vocabulary 正本・変更管理は **Issue #8 の新規 DEC** に置く。
- Issue #27 配下の technical decision として Severity vocabulary を固定する方式（Option B）は **不採用**。
- 本 Accepted は ownership / change-control 方式のみを確定する。
- Severity の正式値・意味・判定主体・assignment アルゴリズムは **決めない**（Decision-SEV-2 以降）。
  後続: SEV-2-VOCAB Human Decision は Accepted / Option A / FindingSeverity NOT ADOPTED
  （[`decision-sev-2-vocab-not-adopted.md`](./decision-sev-2-vocab-not-adopted.md)）。
  Canonical status: PENDING_ISSUE_8_DEC_RECORD（Issue #8 DEC が最終 ownership）。
  SEV-2-ASSIGN は N/A / DO NOT START。
- `low` / `medium` / `high` 等を暗黙の正本として採用しない方針は維持する。
- `FindingIdentity` 契約と安定 Finding ID 導出は変更しない。
- 既存 contract を壊す変更を本 Decision から開始しない。

## 採択しなかった方式

```text
Option B:
  Issue #27 配下の technical decision として FindingSeverity vocabulary を固定する
```

## DEC 番号

```text
Issue #8 ledger 上の新規 DEC 番号: UNASSIGNED
```

番号採番・Issue #8 本文／コメントへの台帳追記は、本 docs 正本化とは別操作とする。
本 Accepted は「Issue #8 に新しい DEC を追加する」という **方式** を固定する。
DEC 本文（値一覧等）は Decision-SEV-2 以降の Accepted 内容を受けて Issue #8 に記録する。

## 既存契約との整合

| 正本 | 整合 |
|---|---|
| [`finding-audit-ownership.md`](./finding-audit-ownership.md) | FindingSeverity Decision 節の方式 A を Accepted |
| `FindingIdentity`（Issue #27 / PR #41） | **UNCHANGED**。Severity を Identity キーに追加しない |
| [`finding-stable-id.md`](./finding-stable-id.md) / `deriveStableFindingId` | **UNCHANGED** |
| [`finding-identity-assembly.md`](./finding-identity-assembly.md) | **UNCHANGED** |
| `DEC-001〜017`（Issue #8） | Severity 正本は従来どおり無し。新規 DEC 追加方式のみ Accepted |

## 分離（維持）

| 単位 | 扱い |
|---|---|
| Vocabulary ownership / change control | **本 Decision（Accepted / Option A）** |
| 正式値・意味 / 採否 | Decision-SEV-2-VOCAB Human Decision Accepted / Option A（NOT ADOPTED）；Canonical PENDING_ISSUE_8_DEC_RECORD |
| assignment algorithm / caller-supplied 境界 | SEV-2-ASSIGN = N/A / DO NOT START（不採用のため） |
| FindingIdentity / stable Finding ID | UNCHANGED |
| 完全 Finding 契約 | HOLD（SEV-2 以降 + Entry Criteria） |
| FindingCode 業務カタログ | Decision-FC-1 / FC-2 |
| SharePoint / M365 / Deploy | NO-GO |

## 実装ゲート

```text
Decision-SEV-1: Accepted
Implementation Start (本 Decision): N/A（ownership のみ。実装開始しない）
src/** / tests/**: 変更しない
FindingIdentity / stable Finding ID: UNCHANGED
Contract break: NO
Next substantive unit: Decision-SEV-2 decision packet
Decision-SEV-2 Implementation: NOT STARTED
Issue #24 Close: NO-GO
SharePoint / tenant / M365 / Entra / Deploy: NO-GO
real data: PROHIBITED
```

## 対象外

- FindingSeverity 正式値・意味の採択
- domain 算出 vs caller-supplied の確定
- `FindingSeverity` TypeScript 型 / validator / fixture 実装
- 完全 Finding 契約
- FindingCode カタログ
- AssessmentSnapshot 保存・DTO
- SharePoint / adapter / UI / deploy / 実データ

## 変更禁止境界

```text
SharePoint changes: NO-GO
Entra ID changes: NO-GO
Microsoft 365 changes: NO-GO
tenant changes: NO-GO
deploy: NO-GO
real data: prohibited
src/** / tests/**: 本 Decision では変更しない
FindingIdentity: UNCHANGED
stable Finding ID: UNCHANGED
```
