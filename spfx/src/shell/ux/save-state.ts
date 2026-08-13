/**
 * SHELL-UX save-state vocabulary + presentation helpers.
 * Presentation-only — not wired to SharePoint adapters or live save outcomes.
 * DEMO-UX-12: emphasis hierarchy only (does not change state meaning).
 */

import type { ShellSaveStateEmphasis } from "./save-badge-hierarchy";

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

/**
 * Presentation-only helper copy. Does not judge save outcomes.
 * 保存結果不明 must remain independent (never collapsed to 失敗 / 済み).
 */
export const SHELL_SAVE_STATE_DESCRIPTIONS: Readonly<Record<ShellSaveState, string>> = {
  unsaved: "まだ保存していません。",
  saving: "保存処理を表示中です。",
  saved: "保存済みとして表示しています。",
  save_failed: "保存失敗として表示しています。",
  save_outcome_unknown: "保存結果を確認できていません。成功・失敗のいずれにも丸めません。",
};

export type ShellSaveStateLive = "polite" | "assertive";

export function isShellSaveState(value: string): value is ShellSaveState {
  return (SHELL_SAVE_STATES as readonly string[]).indexOf(value) >= 0;
}

export function labelForShellSaveState(state: ShellSaveState): string {
  return SHELL_SAVE_STATE_LABELS[state];
}

export function descriptionForShellSaveState(state: ShellSaveState): string {
  return SHELL_SAVE_STATE_DESCRIPTIONS[state];
}

/**
 * DEMO-UX-12 / RPF-005 hierarchy:
 * QUIET = ready browsing (saved / unsaved)
 * EMPHASIZED = saving / save_failed / save_outcome_unknown
 */
export function emphasisForShellSaveState(state: ShellSaveState): ShellSaveStateEmphasis {
  if (state === "saving" || state === "save_failed" || state === "save_outcome_unknown") {
    return "emphasized";
  }
  return "quiet";
}

/** Description stays visible only when emphasized (QUIET hides chrome noise). */
export function isSaveStateDescriptionVisible(state: ShellSaveState): boolean {
  return emphasisForShellSaveState(state) === "emphasized";
}

/** Fail / unknown announce assertively; other states stay polite. */
export function ariaLiveForShellSaveState(state: ShellSaveState): ShellSaveStateLive {
  if (state === "save_failed" || state === "save_outcome_unknown") {
    return "assertive";
  }
  return "polite";
}
