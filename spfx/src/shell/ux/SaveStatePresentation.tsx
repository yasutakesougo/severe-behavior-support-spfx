import * as React from "react";
import { DEMO_UX_12_SLICE } from "./save-badge-hierarchy";
import { SaveStateBadge } from "./SaveStateBadge";
import {
  descriptionForShellSaveState,
  emphasisForShellSaveState,
  isSaveStateDescriptionVisible,
  type ShellSaveState,
} from "./save-state";
import styles from "./ShellUx.module.scss";

export type SaveStatePresentationProps = Readonly<{
  state: ShellSaveState;
}>;

/**
 * SHELL-UX-2 shared save-state presentation surface.
 * DEMO-UX-12: QUIET vs EMPHASIZED hierarchy — no save-outcome judgment or live I/O.
 */
export const SaveStatePresentation: React.FC<SaveStatePresentationProps> = ({ state }) => {
  const emphasis = emphasisForShellSaveState(state);
  const showDescription = isSaveStateDescriptionVisible(state);
  const presentationClass =
    emphasis === "emphasized"
      ? styles.saveStatePresentationEmphasized
      : styles.saveStatePresentationQuiet;

  return (
    <div
      className={`${styles.saveStatePresentation} ${presentationClass}`}
      data-shell-ux="save-state-presentation"
      data-save-state={state}
      data-save-emphasis={emphasis}
      data-demo-ux-12-slice={DEMO_UX_12_SLICE.id}
    >
      <SaveStateBadge state={state} />
      {showDescription ? (
        <p className={styles.saveStateDescription} data-shell-ux="save-state-description">
          {descriptionForShellSaveState(state)}
        </p>
      ) : null}
    </div>
  );
};
