# KI-SPFX-002

- Knowledge-ID: `KI-SPFX-002`
- State: `LOCKED_REFERENCE`
- Topic: Deploy evidence vs acceptance
- Scope: release / production
- Finding: Deploy 実行証跡や package 成功は application acceptance / Production GO ではない。Deploy GO は Human-only。
- Authority: `AGENTS.md`, `.agents/skills/release-review/SKILL.md`, `docs/decisions/DEC-AI-ORG-003.md`
- Evidence: Deploy GO Human-only; release-review は deploy を実行しない
- Retrieval keys: Deploy evidence, application acceptance, Production GO, App Catalog
- Rule authority: `AGENTS.md`, DEC-AI-ORG-003
