# KI-STATE-003

- Knowledge-ID: `KI-STATE-003`
- State: `OBSERVED`
- Topic: Issue vs implementation PR drift
- Scope: repository-wide
- Finding: Issue CURRENT が IMPLEMENTATION NOT STARTED / NOT AUTHORIZED と示していても、implementation PR が live（open または merged）に存在する場合、Issue 単独から CURRENT を確定しない。`STATE_DRIFT` として分類し、mutation 前に reconciliation する。
- Authority: NONE（Human promotion 待ち。運用規則化していない）
- Evidence:
  - Issue #448 CURRENT: A/B/C/D/E = IMPLEMENTATION NOT STARTED; Implementation Start = NOT AUTHORIZED
  - PR #468 `feat(domain): add cancellation semantics contract` — domain cancellation contract を追加し MERGED（HEAD `0dbcdc4...`、merge 後 main tip は `1e1a708...`）
- Retrieval keys: STATE_DRIFT, NOT STARTED, implementation PR, reconciliation, CURRENT
- Rule authority: NONE
- Promotion notes: `REPEATED` 以上かつ Human confirmation 後にのみ `PROMOTED` 候補。本エントリは Issue #448 reconciliation や Cancellation Ready/Merge を認可しない。
