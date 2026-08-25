# KI-UI-003

- Knowledge-ID: `KI-UI-003`
- State: `OBSERVED`
- Topic: purpose / frequency-sensitive motion
- Scope: UI / motion review
- Evaluation intent: `GUIDANCE_ONLY`
- Reference use: `GUIDANCE_REFERENCE`
- Terminal recommendation: `REFERENCE_ACCEPTED`
- Finding: Emil Kowalski's guidance frames animation as purpose-dependent and frequency-sensitive: frequently repeated interactions can become slower or more irritating with motion, and keyboard-initiated repeated actions are presented as especially poor candidates for animation. The article also gives a general under-300ms rule of thumb for UI motion, but that numeric threshold remains external guidance rather than a local contract.
- Local rationale: Useful as a motion-review lens for operational UI where repeated tasks and input speed matter. It supports asking whether motion has a concrete UX purpose without changing existing status, priority, interaction, accessibility, or timing contracts.
- Authority: NONE（promotion 待ち。external motion guidance != Product Motion Contract）
- Evidence:
  - Canonical article: https://emilkowal.ski/ui/you-dont-need-animations
  - Observed at: `2026-08-26`
  - Observed guidance: animation should have a purpose; frequency of use affects whether motion helps; repeated keyboard actions should avoid motion; UI animation speed guidance is presented as a rule of thumb rather than repository authority.
- Retrieval keys: motion, animation, frequency of use, keyboard, repeated interaction, purposeful animation
- Rule authority: NONE
- Promotion notes: `OBSERVED` only. Do not lock numeric duration/easing rules from this entry. Any Product Motion Contract change requires separate local evidence and authority.
