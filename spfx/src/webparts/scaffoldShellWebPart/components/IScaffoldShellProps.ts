import type {
  ShellSaveState,
  ShellSiteLabelFixture,
  ShellViewMode,
} from "../../../shell/ux";

export interface IScaffoldShellProps {
  description: string;
  isDarkTheme: boolean;
  environmentMessage: string;
  userDisplayName: string;
  /** SHELL-UX-1: always true in this slice's fixture path. */
  demoMode: boolean;
  currentSite: ShellSiteLabelFixture;
  saveState: ShellSaveState;
  viewMode: ShellViewMode;
  correlationId: string;
}
