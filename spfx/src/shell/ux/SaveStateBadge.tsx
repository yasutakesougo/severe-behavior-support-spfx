import * as React from "react";
import {
  ariaLiveForShellSaveState,
  labelForShellSaveState,
  type ShellSaveState,
} from "./save-state";
import styles from "./ShellUx.module.scss";

export type SaveStateBadgeProps = Readonly<{
  state: ShellSaveState;
}>;

export const SaveStateBadge: React.FC<SaveStateBadgeProps> = ({ state }) => {
  const label = labelForShellSaveState(state);

  return (
    <span
      className={`${styles.saveStateBadge} ${styles[`saveState_${state}`]}`}
      role="status"
      aria-live={ariaLiveForShellSaveState(state)}
      aria-atomic="true"
      aria-label={`保存状態: ${label}`}
      data-shell-ux="save-state"
      data-save-state={state}
    >
      {label}
    </span>
  );
};
