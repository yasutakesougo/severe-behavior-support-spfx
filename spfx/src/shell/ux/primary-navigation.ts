import { isUnauthenticatedViewMode, type ShellViewMode } from "./shell-view-mode";
import { isSiteUnselected, type ShellSiteSelection } from "./site-selection";

/**
 * Presentation-only primary navigation vocabulary.
 * The items deliberately have no destinations or business handlers in this slice.
 */
export const SHELL_PRIMARY_NAV_ITEMS = [
  { id: "overview", label: "概要" },
  { id: "users", label: "利用者" },
  { id: "records", label: "記録" },
] as const;

export type ShellPrimaryNavigationId = (typeof SHELL_PRIMARY_NAV_ITEMS)[number]["id"];

/**
 * Keep primary navigation unavailable at the presentation boundary when the
 * shell is unauthenticated or no display site has been selected.
 * This is not an authorization or membership decision.
 */
export function isShellPrimaryNavigationEnabled(
  viewMode: ShellViewMode,
  siteSelection: ShellSiteSelection,
): boolean {
  return !isUnauthenticatedViewMode(viewMode) && !isSiteUnselected(siteSelection);
}
