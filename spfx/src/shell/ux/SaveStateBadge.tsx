import * as React from "react";
import {
  ariaLiveForShellSaveState,
  emphasisForShellSaveState,
  presentationLabelForShellSaveState,
  type ShellSaveState,
  type ShellSaveStateSurface,
} from "./save-state";
import styles from "./ShellUx.module.scss";

export type SaveStateBadgeProps = Readonly<{
  state: ShellSaveState;
  surface?: ShellSaveStateSurface;
}>;

export const SaveStateBadge: React.FC<SaveStateBadgeProps> = ({ state, surface = "business" }) => {
  const label = presentationLabelForShellSaveState(state, surface);
  const emphasis = emphasisForShellSaveState(state);
  const emphasisClass =
    emphasis === "emphasized" ? styles.saveStateBadgeEmphasized : styles.saveStateBadgeQuiet;

  return (
    <span
      className={`${styles.saveStateBadge} ${emphasisClass} ${styles[`saveState_${state}`]}`}
      role="status"
      aria-live={ariaLiveForShellSaveState(state)}
      aria-atomic="true"
      aria-label={`保存状態: ${label}`}
      data-shell-ux="save-state"
      data-save-state={state}
      data-save-surface={surface}
      data-save-emphasis={emphasis}
    >
      {label}
    </span>
  );
};
