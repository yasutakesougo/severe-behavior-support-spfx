# AUTO-1 — AUTONOMY-POLICY-V1 Selection / Human Acceptance

この文書は、AI Development OS の次 substantive unit として
**AUTO-1 — AUTONOMY-POLICY-V1** を選定し、Human Acceptance を記録する
docs-only Decision Packet である。

Canonical policy contract:
[`../process/autonomy-policy-v1.md`](../process/autonomy-policy-v1.md)

```text
repository: yasutakesougo/severe-behavior-support-spfx
Unit: AUTO-1
Kind: docs-only policy contract / Human Acceptance recording
Selection status: SELECTED / CONSUMED
Decision status: ACCEPTED
Human Decision: AUTO-1 scope を採用（2026-08-10）
Policy: DEFINED / NOT ENABLED
Authorization effect: NONE
Implementation: DO NOT START YET
Ready: HUMAN-ONLY
Merge: HUMAN-ONLY / Gateway executor ABSENT
SharePoint / M365 / Entra / permission / secret / production deploy:
  Gateway execution FORBIDDEN
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`../process/self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

## Why this unit now

| Input | State |
|---|---|
| Cursor execution backend | 技術候補。AUTO-1 では SDK 言語を固定しない |
| DEC-AI-ORG-003 | Accepted authority / Fail Closed |
| DEC-AA-001 | Accepted / LOCKED；mutation auto は NOT ENABLED |
| DEC-AA-003 | Accepted / LOCKED；AUTO-UNTIL-GATE は NOT ENABLED |
| PROCESS-OPT-V1 | Accepted / LOCKED；LOW auto-loop DEFINED / NOT ENABLED |
| LOW-AUTO-PILOT-V1 | Pilot policy ACCEPTED；execution NOT STARTED |
| Enforcement gap | Prompt rule だけでなく Gateway 境界で deny する契約が必要 |

## Human Decision recorded

```text
次 substantive unit:
AUTO-1 — AUTONOMY-POLICY-V1

AUTO-1 scope:
1. Capability taxonomy
2. AUTO_ALLOWED / HUMAN_ONLY / FORBIDDEN
3. risk = LOW / MEDIUM / HIGH
4. baseline SHA binding
5. allowedPaths enforcement
6. limits
7. fail-closed rules
8. UNKNOWN → DENY
9. Approval requirement
10. Audit requirement

Implementation in AUTO-1:
NONE
```

## Locked policy outcomes

- execution backend は抽象化し、AUTO-1 で SDK 言語を拘束しない
- `AUTO_ALLOWED` initial set は read / scoped edit / test / feature branch /
  commit / normal push / Draft PR / CI read / review request
- effective classification は上位 authority との intersection で最も厳しい分類を採用。
  現行 DEC-AA-003 の external write `NONE` を supersede しない
- automatic risk ceiling は `LOW`
- `pull_request.ready` / `pull_request.merge` / `decision.accept` /
  `decision.lock` は Gateway executable route を持たない
- SharePoint schema / permission、GitHub permission、secret、production deploy は
  Gateway で `FORBIDDEN`
- policy、Task Packet、approval、baseline、paths、limits、idempotency、audit の
  どれかが不明または不一致なら DENY
- mutation は exact-slice Implementation Start、unresolved HOLD = 0、
  inherited kill switches、trusted authority closure の完全一致が必須
- `test.run` は digest-bound command manifest と network-denied / write-scoped
  sandbox が必須
- read は allowedReadPaths と trusted data classification の intersection、
  mutation は dedicated worktree lease と head / index / worktree binding が必須
- `Policy Accepted ≠ Policy Enabled`

## Required negative contract outcomes

```text
merge → DENY / POLICY_BLOCKED / HUMAN_ONLY
SharePoint schema write → DENY / POLICY_BLOCKED / FORBIDDEN
Decision accept → DENY / POLICY_BLOCKED / HUMAN_ONLY
allowedPaths outside → DENY / POLICY_BLOCKED / OUT_OF_SCOPE
stale baseline → DENY / BASELINE_MOVED / BASELINE_MOVED
```

これらは後続 Gateway 実装の mandatory acceptance tests であり、
AUTO-1 自体では test code を作らない。

## Two-lane boundary

法人アプリ本体と AI Development OS を別 lane とする。

| Lane | AUTO-1 の効力 |
|---|---|
| AssessmentSnapshot adapter | Entry Criteria / Human Gate / HOLD を変更・迂回しない |
| AI Development OS | policy contract のみ固定。Registry / Gateway / backend を実装しない |

最新の AssessmentSnapshot 正本では、Decision-AS-ADAPTER-START-1 は
AIS-1-B として Accepted / LOCKED だが、EC-3 / EC-4 未充足のため
Implementation Start は HOLD である。

正本:
[`decision-assessment-snapshot-adapter-start-acceptance.md`](./decision-assessment-snapshot-adapter-start-acceptance.md)

## Explicit non-claims

```text
AUTO-1 Acceptance ≠ policy enablement
AUTO-1 Acceptance ≠ Implementation Start
AUTO-1 Acceptance ≠ Capability Registry implementation
AUTO-1 Acceptance ≠ Task Packet Schema implementation
AUTO-1 Acceptance ≠ Action Gateway implementation
AUTO-1 Acceptance ≠ Cursor SDK Runner implementation
AUTO-1 Acceptance ≠ LOW-AUTO-PILOT-V2 enablement
AUTO-1 Acceptance ≠ AssessmentSnapshot adapter EC-3 / EC-4 satisfaction
AUTO-1 Acceptance ≠ Ready / Merge
```

## Done criteria（AUTO-1）

- canonical policy contract が 10 scope 項目を機械判定可能な形で固定
- classification / risk / decision code / deny reason の enum が一意
- initial allow / human-only / forbidden set が一意
- baseline / expected head / allowedPaths / limits / idempotency が一意
- authority intersection / exact-slice Start / inherited HOLD・kill switch が一意
- deterministic risk matcher、read boundary、test sandbox、path grammar、
  worktree binding、atomic limit ledger が一意
- approval と audit の fail-closed requirement が一意
- mandatory negative contract outcomes が一意
- execution backend が SDK 言語非依存
- AssessmentSnapshot adapter lane の現行 HOLD を維持
- application / domain / adapter / tests / runtime configuration の変更なし
- Independent Review on AUTO-1 HEAD で P0 = 0 / P1 = 0
- mechanical verification PASS
- Draft PR のまま Human Ready Decision で停止

## Next substantive units

```text
AUTO-1
  ↓
Capability Registry contract
  ↓
Task Packet Schema
  ↓
Action Gateway contract
  ↓
execution backend selection / implementation
```

各矢印は別 substantive unit / Gate であり、AUTO-1 Acceptance から自動開始しない。
