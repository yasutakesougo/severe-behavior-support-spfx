# project-status examples

## Example A — Evidence不足（UNKNOWN）

```text
CURRENT
main: c26e992
PR: none
Evidence: UNKNOWN

GATE
HumanAction: UNKNOWN

ALLOWED
- read-only observation
- CI/status inspection

FORBIDDEN
- merge
- SharePoint mutation
- implementation requiring unresolved decision
- Ready
- Issue mutation

NEXT
Human:
なし

Agent:
不足しているEvidenceをread-onlyで取得
```

## Example B — Human Ready 待ち（FALSE_WAIT ではない）

前提: Open draft PR #245 の実在と head SHA を GitHub live state で確認済み。

```text
CURRENT
main: c26e992
PR: #245
Evidence: CONFIRMED

GATE
HumanAction: Ready

ALLOWED
- read-only observation
- CI/status inspection
- Independent Review（read-only）

FORBIDDEN
- merge
- Ready auto-execution
- SharePoint mutation
- Implementation Start without GO

NEXT
Human:
PR #245 の Human Ready Decision

Agent:
STOP（Ready / Merge は実行しない）
```

## Example C — Decision Accepted だが Implementation Start なし

```text
CURRENT
main: c26e992
PR: none
Evidence: INTENDED

GATE
HumanAction: Implementation Start

ALLOWED
- read-only observation
- Decision / docs 参照

FORBIDDEN
- implementation mutation
- SharePoint mutation
- merge
- Decision を Accepted と推測確定

NEXT
Human:
exact-slice Implementation Start GO

Agent:
STOP（Accepted Decision を Start とみなさない）
```

## Example D — WAIT対象未確認（FALSE_WAIT → UNKNOWN）

悪い判定:

```text
GATE
HumanAction: WAIT for PR #999 Ready
```

PR #999 の実在を確認できない場合の正しい判定:

```text
CURRENT
main: c26e992
PR: UNKNOWN
Evidence: UNKNOWN

GATE
HumanAction: UNKNOWN

ALLOWED
- read-only observation
- CI/status inspection

FORBIDDEN
- merge
- SharePoint mutation
- implementation requiring unresolved decision

NEXT
Human:
なし

Agent:
待つ対象（PR / Decision / CI）の実在をread-onlyで確認。確認できない間はUNKNOWNのままSTOP
```
