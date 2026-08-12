import { SHELL_DEFAULT_DESTINATION } from "./destination";
import type { ShellPartialRetrievalPresentation } from "./partial-retrieval";
import type { ShellPrimaryNavigationId } from "./primary-navigation";
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
  selectedDestination: ShellPrimaryNavigationId;
  correlationId: string;
  errorCode: string;
  partialRetrieval: ShellPartialRetrievalPresentation;
}>;

/** Synthetic partial-retrieval props — not adapter outcomes. */
export const SHELL_UX_PARTIAL_RETRIEVAL_FIXTURE: ShellPartialRetrievalPresentation = {
  succeededItems: [{ id: "synth-ok-1", label: "表示項目A（取得できた・合成）" }],
  failedItems: [{ id: "synth-ng-1", label: "表示項目B（取得できなかった・合成）" }],
};

/** Default synthetic fixture — no tenant observation. Starts unselected for stop chrome. */
export const SHELL_UX_DEFAULT_FIXTURE: ShellUxFixture = {
  demoMode: true,
  siteSelection: SHELL_SITE_SELECTION_UNSELECTED,
  siteOptions: SHELL_SITE_OPTIONS,
  saveState: "unsaved",
  viewMode: "ready",
  selectedDestination: SHELL_DEFAULT_DESTINATION,
  correlationId: "shell-ux-7-synth-corr",
  errorCode: "SHELL-UX-7-SYNTH-E001",
  partialRetrieval: SHELL_UX_PARTIAL_RETRIEVAL_FIXTURE,
};

export const SHELL_UX_SLICE = {
  id: "SHELL-UX-7",
  liveTenantIoAuthorized: false as const,
  sharePointRestAuthorized: false as const,
  binderHostWiringAuthorized: false as const,
  membershipLookupAuthorized: false as const,
  adapterFetchAuthorized: false as const,
  outcomeJudgmentAuthorized: false as const,
  errorCodeGenerationAuthorized: false as const,
  adapterFailureClassificationAuthorized: false as const,
  telemetryBackendAuthorized: false as const,
  authJudgmentAuthorized: false as const,
  entraTokenHandlingAuthorized: false as const,
  roleResolutionAuthorized: false as const,
  redirectSignInOrchestrationAuthorized: false as const,
  businessDestinationAuthorized: false as const,
  plansAdministrationNavExpansionAuthorized: false as const,
} as const;
