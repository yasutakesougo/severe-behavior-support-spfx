# KI-STATE-002

- Knowledge-ID: `KI-STATE-002`
- State: `LOCKED_REFERENCE`
- Topic: FALSE_WAIT prevention
- Scope: repository-wide
- Finding: WAIT 対象の実在を確認できない場合は WAIT とせず `UNKNOWN` とする（FALSE_WAIT 防止）。
- Authority: `.agents/skills/project-status/SKILL.md`
- Evidence: project-status WAIT / UNKNOWN 規則
- Retrieval keys: WAIT, UNKNOWN, FALSE_WAIT
- Rule authority: `.agents/skills/project-status/SKILL.md`
