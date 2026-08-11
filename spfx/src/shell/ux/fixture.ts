import type { ShellSaveState } from "./save-state";
import type { ShellViewMode } from "./shell-view-mode";
import {
  SHELL_SITE_OPTIONS,
  SHELL_SITE_SELECTION_UNSELECTED,
  type ShellSiteOption,
  type ShellSiteSelection,
} from "./site-selection";

/**
 * Display-only site label fixture for SHELL-UX.
 * Not SiteContext authorization truth (#21 OUT).
 */
export type ShellSiteLabelFixture = Readonly<{
  siteId: "SITE-ISG" | "SITE-HOM";
  displayName: string;
}>;

export type ShellUxFixture = Readonly<{
  demoMode: true;
  siteSelection: ShellSiteSelection;
  siteOptions: readonly ShellSiteOption[];
  saveState: ShellSaveState;
  viewMode: ShellViewMode;
  correlationId: string;
}>;

/** Default synthetic fixture — no tenant observation. Starts unselected for stop chrome. */
export const SHELL_UX_DEFAULT_FIXTURE: ShellUxFixture = {
  demoMode: true,
  siteSelection: SHELL_SITE_SELECTION_UNSELECTED,
  siteOptions: SHELL_SITE_OPTIONS,
  saveState: "unsaved",
  viewMode: "ready",
  correlationId: "shell-ux-3-synth-corr",
};

export const SHELL_UX_SLICE = {
  id: "SHELL-UX-3",
  liveTenantIoAuthorized: false as const,
  sharePointRestAuthorized: false as const,
  binderHostWiringAuthorized: false as const,
  membershipLookupAuthorized: false as const,
} as const;
