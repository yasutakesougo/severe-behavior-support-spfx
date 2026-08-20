# KI-GITHUB-001

- Knowledge-ID: `KI-GITHUB-001`
- State: `LOCKED_REFERENCE`
- Topic: environment-specific GitHub limits
- Scope: GitHub / MCP / Worker environments
- Finding: 特定 Worker / 環境での GitHub 権限制約や 404 等は、確認なしに全環境の一般ルールへ昇格しない。
- Authority: `.agents/mcp/permission-matrix.md`, `docs/process/background-agent-contract.md`
- Evidence: permission matrix; background-agent Fail Closed
- Retrieval keys: GitHub Worker, 404, permissions, generalize, environment
- Rule authority: NONE（環境固有は OBSERVED/REPEATED として扱う。一般化は Human promotion）
