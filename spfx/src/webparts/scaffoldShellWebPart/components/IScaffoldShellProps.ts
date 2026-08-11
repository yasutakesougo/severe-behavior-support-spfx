import type { ShellSaveState, ShellSiteSelection, ShellViewMode } from "../../../shell/ux";

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
}
