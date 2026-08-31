import * as React from "react";
import type {
  MonitoringPeriodReviewDecision,
  MonitoringPeriodReviewOutcome,
} from "../../sbs-domain/monitoring-period-review-outcome.bundle";
import type { HumanReviewMaterials } from "../../sbs-domain/monitoring-read-model.bundle";
import type { SyntheticReviewOutcomeCaptureResult } from "./review-outcome-capture";
import { REVIEW_OUTCOME_CAPTURE_COPY, labelForReviewDecision } from "./review-outcome-capture-copy";
import styles from "./ReviewOutcomeCaptureView.module.scss";

export type ReviewOutcomeCaptureViewProps = Readonly<{
  materials: HumanReviewMaterials;
  capturedOutcome: MonitoringPeriodReviewOutcome | null;
  onCapture: (decision: MonitoringPeriodReviewDecision) => SyntheticReviewOutcomeCaptureResult;
}>;

export const ReviewOutcomeCaptureView: React.FC<ReviewOutcomeCaptureViewProps> = ({
  materials,
  capturedOutcome,
  onCapture,
}) => {
  const [error, setError] = React.useState<string | null>(null);
  const disabled = capturedOutcome !== null;

  const capture = (decision: MonitoringPeriodReviewDecision): void => {
    const result = onCapture(decision);
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
      data-review-outcome-capture="REVIEW-OUTCOME-CAPTURE-SLICE-A"
      data-presentation-only="true"
      data-live-write-authorized="false"
    >
      <h4 className={styles.heading}>見直し結果</h4>

      {capturedOutcome ? (
        <div data-review-outcome-readback="true">
          <p className={styles.status}>{labelForReviewDecision(capturedOutcome.decision)}</p>
          {capturedOutcome.decision === "CHANGE_REQUIRED" ? (
            <p className={styles.pending}>{REVIEW_OUTCOME_CAPTURE_COPY.revisionPending}</p>
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
