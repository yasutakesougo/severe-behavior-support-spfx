import * as React from "react";
import { SaveStateBadge } from "./SaveStateBadge";
import { descriptionForShellSaveState, type ShellSaveState } from "./save-state";
import styles from "./ShellUx.module.scss";

export type SaveStatePresentationProps = Readonly<{
  state: ShellSaveState;
}>;

/**
 * SHELL-UX-2 shared save-state presentation surface.
 * Props/enum only — no save-outcome judgment or live I/O.
 */
export const SaveStatePresentation: React.FC<SaveStatePresentationProps> = ({ state }) => {
  return (
    <div
      className={styles.saveStatePresentation}
      data-shell-ux="save-state-presentation"
      data-save-state={state}
    >
      <SaveStateBadge state={state} />
      <p className={styles.saveStateDescription} data-shell-ux="save-state-description">
        {descriptionForShellSaveState(state)}
      </p>
    </div>
  );
};
