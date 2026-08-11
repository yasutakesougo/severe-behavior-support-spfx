import * as React from "react";
import { labelForShellSaveState, type ShellSaveState } from "./save-state";
import styles from "./ShellUx.module.scss";

export type SaveStateBadgeProps = Readonly<{
  state: ShellSaveState;
}>;

export const SaveStateBadge: React.FC<SaveStateBadgeProps> = ({ state }) => {
  return (
    <span
      className={`${styles.saveStateBadge} ${styles[`saveState_${state}`]}`}
      data-shell-ux="save-state"
      data-save-state={state}
    >
      {labelForShellSaveState(state)}
    </span>
  );
};
