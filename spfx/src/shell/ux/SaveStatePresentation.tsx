import * as React from "react";
import { DEMO_UX_12_SLICE } from "./save-badge-hierarchy";
import { SaveStateBadge } from "./SaveStateBadge";
import {
  descriptionForShellSaveState,
  emphasisForShellSaveState,
  isSaveStateDescriptionVisible,
  type ShellSaveState,
} from "./save-state";
import { DEMO_UX_14_SLICE, isSavingProgressActive } from "./saving-progress-observability";
import styles from "./ShellUx.module.scss";

export type SaveStatePresentationProps = Readonly<{
  state: ShellSaveState;
}>;

/**
 * SHELL-UX-2 shared save-state presentation surface.
 * DEMO-UX-12: QUIET vs EMPHASIZED hierarchy — no save-outcome judgment or live I/O.
 * DEMO-UX-14: saving-only progress cue + aria-busy (presentation-only).
 */
export const SaveStatePresentation: React.FC<SaveStatePresentationProps> = ({ state }) => {
  const emphasis = emphasisForShellSaveState(state);
  const showDescription = isSaveStateDescriptionVisible(state);
  const progressActive = isSavingProgressActive(state);
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
      data-saving-progress={progressActive ? "true" : "false"}
      data-demo-ux-12-slice={DEMO_UX_12_SLICE.id}
      data-demo-ux-14-slice={DEMO_UX_14_SLICE.id}
      aria-busy={progressActive ? true : undefined}
    >
      <SaveStateBadge state={state} />
      {progressActive ? (
        <div
          className={styles.saveStateProgressCue}
          data-shell-ux="save-state-progress-cue"
          aria-hidden="true"
        >
          <span className={styles.saveStateProgressTrack}>
            <span className={styles.saveStateProgressBar} />
          </span>
          <span className={styles.saveStateProgressLabel}>進行中</span>
        </div>
      ) : null}
      {showDescription ? (
        <p className={styles.saveStateDescription} data-shell-ux="save-state-description">
          {descriptionForShellSaveState(state)}
        </p>
      ) : null}
    </div>
  );
};
