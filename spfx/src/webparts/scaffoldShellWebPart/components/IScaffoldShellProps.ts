import type {
  ShellPartialRetrievalPresentation,
  ShellPresentationRole,
  ShellSaveState,
  ShellSiteSelection,
  ShellViewMode,
} from "../../../shell/ux";
import type { PlannerCyclePosition } from "../../../shell/ux/planner-task-navigation";

export interface IScaffoldShellProps {
  description: string;
  isDarkTheme: boolean;
  environmentMessage: string;
  userDisplayName: string;
  /** SHELL-UX: always true in this slice's fixture path. */
  demoMode: boolean;
  siteSelection: ShellSiteSelection;
  saveState: ShellSaveState;
  viewMode: ShellViewMode;
  correlationId: string;
  errorCode: string;
  partialRetrieval: ShellPartialRetrievalPresentation;
  /** Synthetic presentationRole. Default FIELD_STAFF preserves CORR-1F/1G. */
  presentationRole?: ShellPresentationRole;
  /** Smoke/demo fixture only — PLANNER Task-First cycle context. */
  initialPlannerCycle?: PlannerCyclePosition;
}
