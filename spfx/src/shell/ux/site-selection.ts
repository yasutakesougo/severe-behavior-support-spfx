/**
 * SHELL-UX-3 — display-only multi-site selection vocabulary.
 * Not membership / authorization truth (#21 OUT).
 */

export const SHELL_SITE_IDS = ["SITE-ISG", "SITE-HOM"] as const;

export type ShellSiteId = (typeof SHELL_SITE_IDS)[number];

export const SHELL_SITE_SELECTION_UNSELECTED = "unselected" as const;

export type ShellSiteSelection = typeof SHELL_SITE_SELECTION_UNSELECTED | ShellSiteId;

export type ShellSiteOption = Readonly<{
  siteId: ShellSiteId;
  displayName: string;
}>;

/** Display choices only — not Entra / SharePoint membership. */
export const SHELL_SITE_OPTIONS: readonly ShellSiteOption[] = [
  { siteId: "SITE-ISG", displayName: "磯子（表示専用）" },
  { siteId: "SITE-HOM", displayName: "本牧（表示専用）" },
] as const;

export function isShellSiteId(value: string): value is ShellSiteId {
  return (SHELL_SITE_IDS as readonly string[]).indexOf(value) >= 0;
}

export function isShellSiteSelection(value: string): value is ShellSiteSelection {
  return value === SHELL_SITE_SELECTION_UNSELECTED || isShellSiteId(value);
}

export function isSiteUnselected(
  selection: ShellSiteSelection,
): selection is typeof SHELL_SITE_SELECTION_UNSELECTED {
  return selection === SHELL_SITE_SELECTION_UNSELECTED;
}

export function siteOptionForId(siteId: ShellSiteId): ShellSiteOption {
  const found = SHELL_SITE_OPTIONS.find((option) => option.siteId === siteId);
  if (!found) {
    throw new Error(`Unknown display site id: ${siteId}`);
  }
  return found;
}

export function labelForShellSiteSelection(selection: ShellSiteSelection): string {
  if (isSiteUnselected(selection)) {
    return "未選択";
  }
  const option = siteOptionForId(selection);
  return `${option.siteId} / ${option.displayName}`;
}
