/**
 * DEMO-UX-14 — presentation-only saving progress observability (RPF-007).
 * Progress cue + interaction pause appearance while saveState === "saving" only.
 * Does not authorize live save, autosave, SharePoint write, or mutation enablement.
 */

import type { ShellSaveState } from "./save-state";

export const DEMO_UX_14_SLICE = {
  id: "DEMO-UX-14",
  presentationOnly: true as const,
  saveProgressUiAuthorized: true as const,
  savingInteractionPauseAppearanceAuthorized: true as const,
  /** Visual/progress only — never auto-transition saving → saved. */
  savingAutoCompleteAuthorized: false as const,
  saveOutcomeUnknownNormalizationAuthorized: false as const,
  saveStateSemanticsChangeAuthorized: false as const,
  liveTenantIoAuthorized: false as const,
  sharePointRestAuthorized: false as const,
  sharePointWriteAuthorized: false as const,
  saveMutationAuthorized: false as const,
  businessRuleCalculationAuthorized: false as const,
  visualRedesignAuthorized: false as const,
} as const;

/** Ready-region pause note while saving (synthetic boundary). */
export const SAVING_INTERACTION_PAUSE_NOTE =
  "保存中のため操作を一時停止して表示しています（合成・実保存なし）";

/** Layer 1: progress cue is active only for saving. */
export function isSavingProgressActive(state: ShellSaveState): boolean {
  return state === "saving";
}

/** Layer 2: interaction pause appearance is active only for saving. */
export function isSavingInteractionPaused(state: ShellSaveState): boolean {
  return state === "saving";
}
