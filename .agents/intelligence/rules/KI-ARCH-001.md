# KI-ARCH-001

- Knowledge-ID: `KI-ARCH-001`
- State: `LOCKED_REFERENCE`
- Topic: lifecycle vs record mutation
- Scope: domain / handoff / cancellation
- Finding: ProcedureRecord 等の record 本体 mutation（UPDATE/hard DELETE）と、append-only lifecycle event は分離する。cancellation は record を書き換えない。
- Authority: `docs/architecture/cancellation-exact-slice-definition-1.md`, `docs/architecture/handoff-state-mutation.md`
- Evidence: cancellation exact-slice definition（immutable record / CANCEL lifecycle）
- Retrieval keys: append-only, lifecycle event, record mutation, cancellation, ProcedureRecord
- Rule authority: `docs/architecture/cancellation-exact-slice-definition-1.md`
