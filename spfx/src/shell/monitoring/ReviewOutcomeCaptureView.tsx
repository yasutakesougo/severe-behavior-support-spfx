import * as React from "react";
import type { MonitoringPeriodReviewDecision } from "../../sbs-domain/monitoring-period-review-outcome.bundle";
import type { HumanReviewMaterials } from "../../sbs-domain/monitoring-read-model.bundle";
import {
  reviewOutcomeContextKey,
  reviewOutcomeCurrentEpochBindingKey,
  type SyntheticCapturedReview,
  type SyntheticCapturedReviewResult,
} from "./review-outcome-capture";
import {
  REVIEW_OUTCOME_CAPTURE_COPY,
  changeRequiredNextHelper,
  labelForReviewDecision,
} from "./review-outcome-capture-copy";
import styles from "./ReviewOutcomeCaptureView.module.scss";

export type ReviewOutcomeCaptureViewProps = Readonly<{
  materials: HumanReviewMaterials;
  capturedReview: SyntheticCapturedReview | null;
  onCapture: (
    decision: MonitoringPeriodReviewDecision,
    draftDecisionReason: string,
    draftNoteText: string,
  ) => SyntheticCapturedReviewResult;
}>;

export const ReviewOutcomeCaptureView: React.FC<ReviewOutcomeCaptureViewProps> = ({
  materials,
  capturedReview,
  onCapture,
}) => {
  const [draftDecisionReason, setDraftDecisionReason] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const contextKey = reviewOutcomeContextKey(materials);
  const currentEpochBindingKey = reviewOutcomeCurrentEpochBindingKey(materials);
  const periodStartLabel = materials.periodStart.slice(0, 10);
  const periodEndLabel = materials.periodEnd.slice(0, 10);
  const reviewContextLabel = [
    `根拠 ${materials.recordCount}件`,
    `計画版 ${materials.planVersion}`,
    `対象期間 ${periodStartLabel}〜${periodEndLabel}`,
  ].join(" · ");

  React.useEffect(() => {
    setDraftDecisionReason("");
    setError(null);
  }, [currentEpochBindingKey]);

  const capture = (decision: MonitoringPeriodReviewDecision): void => {
    if (decision === "CHANGE_REQUIRED" && draftDecisionReason.trim().length === 0) {
      setError(REVIEW_OUTCOME_CAPTURE_COPY.reasonRequired);
      return;
    }
    const result = onCapture(decision, draftDecisionReason, "");
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
      data-review-outcome-capture="SBS-MGMT-LOOP-A"
      data-presentation-only="true"
      data-live-write-authorized="false"
    >
      <h4 className={styles.heading}>見直し結果</h4>

      {capturedReview ? (
        <div data-review-outcome-readback="true">
          <p className={styles.status}>{labelForReviewDecision(capturedReview.outcome.decision)}</p>
          {capturedReview.decisionReason ? (
            <p className={styles.reasonReadback} data-review-outcome-reason-readback="true">
              判断理由: {capturedReview.decisionReason.reason}
            </p>
          ) : null}
          {capturedReview.note ? (
            <p className={styles.noteReadback} data-review-outcome-note-readback="true">
              補足メモ: {capturedReview.note.note}
            </p>
          ) : null}
          <div data-next-support-summary="true" data-current-review-epoch-bound="true">
            <div className={styles.nextStep} data-next-support-step="true">
              <p className={styles.nextStepLabel}>{REVIEW_OUTCOME_CAPTURE_COPY.nextStepLabel}</p>
              <p className={styles.nextStepHeading} data-next-support-cue="true">
                {capturedReview.outcome.decision === "CHANGE_REQUIRED"
                  ? REVIEW_OUTCOME_CAPTURE_COPY.changeRequiredNextCue
                  : REVIEW_OUTCOME_CAPTURE_COPY.noChangeNextCue}
              </p>
              {capturedReview.outcome.decision === "CHANGE_REQUIRED" ? (
                <p className={styles.nextStepCopy}>
                  {changeRequiredNextHelper(materials.planVersion + 1)}
                </p>
              ) : null}
            </div>
            <p
              className={`${styles.meta} ${styles.nextStepEvidence}`}
              data-next-support-evidence-summary="true"
            >
              {reviewContextLabel}
            </p>
          </div>
          <p className={styles.boundary}>{REVIEW_OUTCOME_CAPTURE_COPY.nonProduction}</p>
        </div>
      ) : (
        <>
          <p className={styles.status} data-review-outcome-undecided="true">
            {REVIEW_OUTCOME_CAPTURE_COPY.undecided}
          </p>

          <div className={styles.reasonField}>
            <label className={styles.reasonLabel} htmlFor={`review-outcome-reason-${contextKey}`}>
              {REVIEW_OUTCOME_CAPTURE_COPY.reasonLabel}
            </label>
            <p className={styles.reasonHelper} id={`review-outcome-reason-help-${contextKey}`}>
              {REVIEW_OUTCOME_CAPTURE_COPY.reasonHelper}
            </p>
            <textarea
              id={`review-outcome-reason-${contextKey}`}
              className={styles.reasonTextarea}
              value={draftDecisionReason}
              onChange={(event) => setDraftDecisionReason(event.currentTarget.value)}
              aria-describedby={`review-outcome-reason-help-${contextKey}`}
              data-review-outcome-reason-input="true"
            />
          </div>

          <div className={styles.actions} role="group" aria-label="見直し結果を選択">
            <button
              type="button"
              className={`${styles.action} ${styles.actionNoChange}`}
              onClick={() => capture("NO_CHANGE")}
              data-review-outcome-action="NO_CHANGE"
            >
              {REVIEW_OUTCOME_CAPTURE_COPY.actionNoChange}
            </button>
            <button
              type="button"
              className={`${styles.action} ${styles.actionChangeRequired}`}
              onClick={() => capture("CHANGE_REQUIRED")}
              data-review-outcome-action="CHANGE_REQUIRED"
            >
              {REVIEW_OUTCOME_CAPTURE_COPY.actionChangeRequired}
            </button>
          </div>

          <p className={styles.boundary}>{REVIEW_OUTCOME_CAPTURE_COPY.nonProduction}</p>
        </>
      )}

      {error ? (
        <p className={styles.error} role="alert">
          {error}
        </p>
      ) : null}
    </section>
  );
};
