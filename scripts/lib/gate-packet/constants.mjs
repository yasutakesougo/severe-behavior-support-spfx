/** Gate vocabulary subset (Scope §8 / Definition §4.4). */
export const GATE_KEYS = [
  "definition_lock",
  "implementation_start",
  "ready",
  "merge",
  "deploy",
  "production_write",
  "actual_staff_value",
];

export const GATE_STATES = new Set([
  "NOT_RECEIVED",
  "ELIGIBLE",
  "CONSUMED",
  "INVALIDATED",
  "FORBIDDEN",
  "UNKNOWN",
]);

/** Scope §9 closed enum for next_human_action. */
export const NEXT_HUMAN_ACTIONS = new Set([
  "DEFINITION_LOCK",
  "IMPLEMENTATION_START",
  "READY",
  "MERGE",
  "DEPLOY",
  "PRODUCTION_WRITE",
  "ACTUAL_STAFF_VALUE_CONFIRMED",
  "UNKNOWN",
]);

export const GATE_LINE_ALIASES = {
  "Human Definition Lock GO": "definition_lock",
  "Human Implementation Start GO": "implementation_start",
  "revised-scope Human Implementation Correction GO": "implementation_start",
  "Human Ready GO": "ready",
  "Human Merge GO": "merge",
  "Deploy / LIVE WRITE": "deploy",
  "Deploy / Production Binding / LIVE WRITE": "production_write",
  "Actual Staff Value Check": "actual_staff_value",
};
