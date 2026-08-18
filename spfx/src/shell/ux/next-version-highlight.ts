/**
 * ADMIN-DEMO-UX-POLISH-1 F-001 — next-version concept highlight lifetime.
 * Presentation-only. Does not change SupportPlan version semantics.
 */

import type { ShellPrimaryNavigationId } from "./primary-navigation";

/**
 * Highlight from Review → next-version must not leak after leaving users,
 * and must not remain on a fresh SupportPlan entry.
 */
export function shouldClearNextVersionConceptHighlight(input: {
  destination: ShellPrimaryNavigationId;
  freshSupportPlanEntry: boolean;
}): boolean {
  if (input.destination !== "users") {
    return true;
  }
  return input.freshSupportPlanEntry;
}
