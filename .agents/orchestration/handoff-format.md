# Agent Handoff Format

Agent 間の引き継ぎでは、次の項目だけを task に必要な範囲で記録する。
会話全文、secret、token、Cookie、個人情報は転記しない。

```text
HANDOFF

TASK
<task-id>

FROM
<agent>

TO
<agent>

BASE
repository: <owner/repo>
base/head SHA: <sha>

AUTHORIZATION
read-only: <YES/NO>
implementation-start: <scope or NO>
github-mutation: <scope or NO>
deploy: <scope or NO>
production-mutation: <scope or NO>

SCOPE
IN:
- <authorized item>

OUT:
- <excluded item>

OBJECTIVE / QUESTION
- <what the next agent is asked to determine or produce>

INPUT EVIDENCE
- <exact source / SHA / path / CI / artifact already available>

REQUIRED OUTPUT
- <required format, verdict fields, evidence classes, or deliverable>

FINDINGS
- <fact + evidence/source>

CHANGED
- <path or NONE>

VALIDATION
- <command/check + result>

OPEN RISKS
- <risk or NONE>

NEXT
- <single next authorized action>

STOP IF
- <condition requiring HOLD or Human GO>
```

## 記入規則

- `BASE` は可能な限り exact SHA を使う。
- `AUTHORIZATION` は推測しない。
- `OBJECTIVE / QUESTION` は次 Agent の担当範囲に限定する。
- `INPUT EVIDENCE` は会話全文ではなく、次工程に必要な正本・証跡だけを書く。
- `REQUIRED OUTPUT` は出力形式を指定するだけで、authority や PASS を先取りしない。
- `FINDINGS` は事実と提案を混同しない。
- `CHANGED` は実際に変更した path のみを書く。
- `VALIDATION` は未実行を PASS と書かない。
- `NEXT` は現在の authorization で可能な次の一手に限定する。
- Gate を越える必要がある場合、`NEXT` ではなく `STOP IF` に Human GO を明記する。
- review / research handoff では必要に応じて `CONFIRMED` / `INFERENCE` / `NOT ESTABLISHED` を分離する。

## 互換性

既存 handoff の `AUTHORIZATION` / `SCOPE` / `FINDINGS` / `CHANGED` / `VALIDATION` / `NEXT` / `STOP IF` の意味は変更しない。

`OBJECTIVE / QUESTION`、`INPUT EVIDENCE`、`REQUIRED OUTPUT` は task に必要な場合の追加項目であり、既存 handoff の authorization を拡張しない。

この形式自体は authorization、Review PASS、Ready GO、Merge GO、Deploy GO を付与しない。

`HANDOFF != AUTHORIZATION`
