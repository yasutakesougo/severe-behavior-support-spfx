import type { ShellSaveState } from "./save-state";
import type { ShellViewMode } from "./shell-view-mode";

/**
 * Display-only site label fixture for SHELL-UX-1.
 * Not SiteContext authorization truth (#21 OUT).
 */
export type ShellSiteLabelFixture = Readonly<{
  siteId: "SITE-ISG" | "SITE-HOM";
  displayName: string;
}>;

export type ShellUxFixture = Readonly<{
  demoMode: true;
  currentSite: ShellSiteLabelFixture;
  saveState: ShellSaveState;
  viewMode: ShellViewMode;
  correlationId: string;
}>;

/** Default synthetic fixture — no tenant observation. */
export const SHELL_UX_DEFAULT_FIXTURE: ShellUxFixture = {
  demoMode: true,
  currentSite: {
    siteId: "SITE-ISG",
    displayName: "磯子（表示専用フィクスチャ）",
  },
  saveState: "unsaved",
  viewMode: "ready",
  correlationId: "shell-ux-1-synth-corr",
};

export const SHELL_UX_SLICE = {
  id: "SHELL-UX-1",
  liveTenantIoAuthorized: false as const,
  sharePointRestAuthorized: false as const,
  binderHostWiringAuthorized: false as const,
} as const;
