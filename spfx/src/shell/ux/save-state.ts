/**
 * SHELL-UX-1 — presentation-only save-state vocabulary.
 * Not wired to SharePoint adapters or live save outcomes.
 */

export const SHELL_SAVE_STATES = [
  "unsaved",
  "saving",
  "saved",
  "save_failed",
  "save_outcome_unknown",
] as const;

export type ShellSaveState = (typeof SHELL_SAVE_STATES)[number];

export const SHELL_SAVE_STATE_LABELS: Readonly<Record<ShellSaveState, string>> = {
  unsaved: "未保存",
  saving: "保存中",
  saved: "保存済み",
  save_failed: "保存失敗",
  save_outcome_unknown: "保存結果不明",
};

export function isShellSaveState(value: string): value is ShellSaveState {
  return (SHELL_SAVE_STATES as readonly string[]).indexOf(value) >= 0;
}

export function labelForShellSaveState(state: ShellSaveState): string {
  return SHELL_SAVE_STATE_LABELS[state];
}
