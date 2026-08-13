/**
 * DEMO-UX-13 — presentation-only Users list detail-preview enablement (DUX7-P2-1).
 * Enabled IFF a synthetic detail fixture exists for the userId.
 * Does not authorize live user detail, SharePoint, or support-plan expansion.
 */

import type { ShellUserDetailPresentation } from "./user-detail-types";

export const DEMO_UX_13_SLICE = {
  id: "DEMO-UX-13",
  presentationOnly: true as const,
  detailPreviewExpansionAuthorized: true as const,
  /** Enable list preview only when a synthetic detail fixture exists. */
  fixtureBackedDetailPreviewOnly: true as const,
  newEightUserDetailCatalogAuthorized: false as const,
  supportPlanExpansionAuthorized: false as const,
  liveUserDetailNavigationAuthorized: false as const,
  liveTenantIoAuthorized: false as const,
  sharePointRestAuthorized: false as const,
  sharePointWriteAuthorized: false as const,
  saveMutationAuthorized: false as const,
  businessRuleCalculationAuthorized: false as const,
  visualRedesignAuthorized: false as const,
  saveProgressUiAuthorized: false as const, // RPF-007 OUT
} as const;

/**
 * Collect userIds that have a registered synthetic detail presentation.
 * Primary + additional fixtures; order is stable (primary first, then additional).
 */
export function collectSyntheticDetailPreviewUserIds(
  primary: ShellUserDetailPresentation,
  additional: readonly ShellUserDetailPresentation[] = [],
): readonly string[] {
  const ids: string[] = [primary.userId];
  for (const detail of additional) {
    if (ids.indexOf(detail.userId) < 0) {
      ids.push(detail.userId);
    }
  }
  return ids;
}

/** Canonical DUX7-P2-1 rule: fixture presence is the sole enablement condition. */
export function isSyntheticDetailPreviewEnabled(
  userId: string,
  detailPreviewUserIds: readonly string[] | undefined,
): boolean {
  if (!detailPreviewUserIds || detailPreviewUserIds.length === 0) {
    return false;
  }
  return detailPreviewUserIds.indexOf(userId) >= 0;
}
