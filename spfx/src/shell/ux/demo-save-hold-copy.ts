/**
 * ADMIN-DEMO-UX-POLISH-1 — synthetic demo save presentation.
 * Does not change save 5-state, result 3-value, LIVE WRITE HOLD, or persistence.
 */

import type { ShellSaveState } from "./save-state";

export const ADMIN_DEMO_UX_POLISH_1_SLICE = {
  id: "ADMIN-DEMO-UX-POLISH-1",
  presentationOnly: true as const,
  demoSaveHoldCopyAuthorized: true as const,
  firstListNextUnrecordedAuthorized: true as const,
  demoPresentationRoleEntryAuthorized: true as const,
  nextVersionHighlightClearAuthorized: true as const,
  saveSuccessClaimAuthorized: false as const,
  liveWriteAuthorized: false as const,
  procedureRecordPersistenceEnablementAuthorized: false as const,
  unrecordedBadgeMutationAuthorized: false as const,
  kpiFamilyRRecountAuthorized: false as const,
  saveStateSemanticsChangeAuthorized: false as const,
  authorizationResolverChangeAuthorized: false as const,
  productionRoleSwitchAuthorized: false as const,
  schemaChangeAuthorized: false as const,
  deployAuthorized: false as const,
} as const;

/** Expected disconnected demo save — not a production error story, not a success claim. */
export const DEMO_LIVE_WRITE_HOLD_SAVE_NOTE =
  "デモでは保存しません。入力内容の確認まで行えます。このデモでの内容は実際の業務データには反映されません。" as const;

export const DEMO_UNRECORDED_AFTER_HOLD_SAVE_NOTE =
  "デモでは保存しないため、未記録の表示は合成データのままです。このデモでの内容は実際の業務データには反映されません。" as const;

const FORBIDDEN_SUCCESS_CLAIMS = [
  `保存${"成功"}`,
  "本番保存済み",
  "記録完了",
  "SharePointへ保存済み",
  "SharePoint へ保存済み",
] as const;

export function demoHoldCopyAvoidsSuccessClaim(text: string): boolean {
  return FORBIDDEN_SUCCESS_CLAIMS.every((token) => text.indexOf(token) < 0);
}

/**
 * Presentation-only status note for LIVE WRITE HOLD save_failed.
 * Internal save_failed remains; this copy explains the expected disconnect.
 */
export function demoHoldSaveStatusNote(
  saveState: ShellSaveState,
  liveWriteHold: boolean,
): string | undefined {
  if (!liveWriteHold || saveState !== "save_failed") {
    return undefined;
  }
  return DEMO_LIVE_WRITE_HOLD_SAVE_NOTE;
}
