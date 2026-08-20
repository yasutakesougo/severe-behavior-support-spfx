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
- `FINDINGS` は事実と提案を混同しない。
- `CHANGED` は実際に変更した path のみを書く。
- `VALIDATION` は未実行を PASS と書かない。
- `NEXT` は現在の authorization で可能な次の一手に限定する。
- Gate を越える必要がある場合、`NEXT` ではなく `STOP IF` に Human GO を明記する。

この形式自体は authorization、Review PASS、Ready GO、Merge GO、Deploy GO を付与しない。
