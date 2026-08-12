/**
 * DEMO-UX-9 — synthetic local draft helpers for daily record input image.
 * Client-side only. No persistence / SharePoint / save API.
 */

import type { ShellDailyRecordIncompleteItem } from "./daily-record-types";

export const DEMO_UX_9_SLICE = {
  id: "DEMO-UX-9",
  presentationOnly: true as const,
  incompleteSelectionAuthorized: true as const,
  localDraftEditAuthorized: true as const,
  draftPersistenceAuthorized: false as const,
  autosaveAuthorized: false as const,
  saveMutationAuthorized: false as const,
  sharePointWriteAuthorized: false as const,
  recordCreationAuthorized: false as const,
  liveTenantIoAuthorized: false as const,
  sharePointRestAuthorized: false as const,
  binderHostWiringAuthorized: false as const,
  adapterFetchAuthorized: false as const,
  authJudgmentAuthorized: false as const,
  businessRuleCalculationAuthorized: false as const,
  visualRedesignAuthorized: false as const,
  failClosedSemanticsChangeAuthorized: false as const,
  unselectedStateRelaxationAuthorized: false as const,
  saveOutcomeUnknownNormalizationAuthorized: false as const,
} as const;

/** Seed text for the selected incomplete item. Not a saved record. */
export function seedLocalDraftForIncompleteItem(
  item: ShellDailyRecordIncompleteItem | undefined,
): string {
  if (!item) {
    return "";
  }
  return [
    `${item.personLabel}の入力イメージ（合成・未保存）`,
    `状態: ${item.statusLabel}`,
    `理由: ${item.reasonLabel}`,
    "",
    "ここに今日の支援内容を書く想定です。保存は接続されていません。",
  ].join("\n");
}

export function findIncompleteItemById(
  items: readonly ShellDailyRecordIncompleteItem[],
  id: string | undefined,
): ShellDailyRecordIncompleteItem | undefined {
  if (!id) {
    return undefined;
  }
  return items.find((item) => item.id === id);
}
