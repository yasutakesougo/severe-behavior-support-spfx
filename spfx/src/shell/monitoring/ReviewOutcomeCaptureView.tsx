import * as React from "react";
import { MONITORING_PERIOD_REVIEW_OUTCOME_NOTE_MAX_LENGTH } from "../../sbs-domain/monitoring-period-review-outcome-note.bundle";
import type { MonitoringPeriodReviewDecision } from "../../sbs-domain/monitoring-period-review-outcome.bundle";
import type { HumanReviewMaterials } from "../../sbs-domain/monitoring-read-model.bundle";
import {
  reviewOutcomeContextKey,
  reviewOutcomeCurrentEpochBindingKey,
  type SyntheticCapturedReview,
  type SyntheticCapturedReviewResult,
} from "./review-outcome-capture";
import { REVIEW_OUTCOME_CAPTURE_COPY, labelForReviewDecision } from "./review-outcome-capture-copy";
import styles from "./ReviewOutcomeCaptureView.module.scss";

export type ReviewOutcomeCaptureViewProps = Readonly<{
  materials: HumanReviewMaterials;
  capturedReview: SyntheticCapturedReview | null;
  onCapture: (
    decision: MonitoringPeriodReviewDecision,
    draftNoteText: string,
  ) => SyntheticCapturedReviewResult;
}>;

export const ReviewOutcomeCaptureView: React.FC<ReviewOutcomeCaptureViewProps> = ({
  materials,
  capturedReview,
  onCapture,
}) => {
  const [draftNoteText, setDraftNoteText] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const contextKey = reviewOutcomeContextKey(materials);
  const currentEpochBindingKey = reviewOutcomeCurrentEpochBindingKey(materials);
  const disabled = capturedReview !== null;

  React.useEffect(() => {
    setDraftNoteText("");
    setError(null);
  }, [currentEpochBindingKey]);

  const capture = (decision: MonitoringPeriodReviewDecision): void => {
    if (draftNoteText.length > MONITORING_PERIOD_REVIEW_OUTCOME_NOTE_MAX_LENGTH) {
      setError(REVIEW_OUTCOME_CAPTURE_COPY.noteLengthError);
      return;
    }
    const result = onCapture(decision, draftNoteText);
    if (result.status === "INVALID") {
      setError(REVIEW_OUTCOME_CAPTURE_COPY.error);
      return;
    }
    if (result.status === "DUPLICATE") {
      setError(REVIEW_OUTCOME_CAPTURE_COPY.duplicate);
      return;
    }
    setError(null);
  };

  return (
    <section
      className={styles.capture}
      aria-label="見直し結果のデモ記録"
      data-review-outcome-capture="REVIEW-OUTCOME-CONTEXT-NOTE-SLICE-B"
      data-presentation-only="true"
      data-live-write-authorized="false"
    >
      <h4 className={styles.heading}>見直し結果</h4>

      {capturedReview ? (
        <div data-review-outcome-readback="true">
          <p className={styles.status}>{labelForReviewDecision(capturedReview.outcome.decision)}</p>
          {capturedReview.outcome.decision === "CHANGE_REQUIRED" ? (
            <p className={styles.pending}>{REVIEW_OUTCOME_CAPTURE_COPY.revisionPending}</p>
          ) : null}
          {capturedReview.note ? (
            <p className={styles.noteReadback} data-review-outcome-note-readback="true">
              補足メモ: {capturedReview.note.note}
            </p>
          ) : null}
          <p className={styles.boundary}>{REVIEW_OUTCOME_CAPTURE_COPY.nonProduction}</p>
          <p className={styles.meta}>
            計画版 {materials.planVersion} · 対象期間 {materials.periodStart}〜{materials.periodEnd}
          </p>
        </div>
      ) : (
        <p className={styles.status} data-review-outcome-undecided="true">
          {REVIEW_OUTCOME_CAPTURE_COPY.undecided}
        </p>
      )}

      <div className={styles.noteField}>
        <label className={styles.noteLabel} htmlFor={`review-outcome-note-${contextKey}`}>
          {REVIEW_OUTCOME_CAPTURE_COPY.noteLabel}
        </label>
        <p className={styles.noteHelper} id={`review-outcome-note-help-${contextKey}`}>
          {REVIEW_OUTCOME_CAPTURE_COPY.noteHelper}
        </p>
        <textarea
          id={`review-outcome-note-${contextKey}`}
          className={styles.noteTextarea}
          value={draftNoteText}
          onChange={(event) => setDraftNoteText(event.currentTarget.value)}
          maxLength={MONITORING_PERIOD_REVIEW_OUTCOME_NOTE_MAX_LENGTH}
          disabled={disabled}
          aria-describedby={`review-outcome-note-help-${contextKey}`}
          data-review-outcome-note-input="true"
        />
        <p className={styles.noteCounter} data-review-outcome-note-count="true">
          {draftNoteText.length} / {MONITORING_PERIOD_REVIEW_OUTCOME_NOTE_MAX_LENGTH}
        </p>
      </div>

      <div className={styles.actions} role="group" aria-label="見直し結果を選択">
        <button
          type="button"
          className={styles.action}
          disabled={disabled}
          onClick={() => capture("NO_CHANGE")}
          data-review-outcome-action="NO_CHANGE"
        >
          {REVIEW_OUTCOME_CAPTURE_COPY.actionNoChange}
        </button>
        <button
          type="button"
          className={styles.action}
          disabled={disabled}
          onClick={() => capture("CHANGE_REQUIRED")}
          data-review-outcome-action="CHANGE_REQUIRED"
        >
          {REVIEW_OUTCOME_CAPTURE_COPY.actionChangeRequired}
        </button>
      </div>

      <p className={styles.boundary}>{REVIEW_OUTCOME_CAPTURE_COPY.nonProduction}</p>
      {error ? (
        <p className={styles.error} role="alert">
          {error}
        </p>
      ) : null}
    </section>
  );
};
