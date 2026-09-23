import * as React from "react";
import {
  buildHumanReviewMaterials,
  type MonitoringReadModel,
  type ReviewPresentationContext,
} from "../../sbs-domain/monitoring-read-model.bundle";
import type { MonitoringPeriodReviewDecision } from "../../sbs-domain/monitoring-period-review-outcome.bundle";
import type { MonitoringReviewInputResult } from "./monitoring-review-input";
import { EmptyNotice } from "../primitives";
import { HumanReviewView, type HumanReviewProcedureLabelContext } from "./HumanReviewView";
import {
  captureSyntheticCapturedReview,
  capturedReviewMatchesMaterials,
  reviewOutcomeContextKey,
  type SyntheticCapturedReview,
  type SyntheticCapturedReviewResult,
} from "./review-outcome-capture";
import styles from "./MonitoringViewUx.module.scss";

export type MonitoringViewProps = Readonly<{
  model: MonitoringReadModel;
  reviewInput?: MonitoringReviewInputResult;
  reviewPresentationContext?: ReviewPresentationContext;
  personLabel: string;
  procedureLabelContext?: HumanReviewProcedureLabelContext;
  onCapturedReviewChange?: (capturedReview: SyntheticCapturedReview | null) => void;
}>;

function formatTokyoDate(value: string): string {
  return new Intl.DateTimeFormat("ja-JP", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(value));
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim() !== "";
}

function isValidReviewPresentationContext(value: unknown): value is ReviewPresentationContext {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const context = value as Record<string, unknown>;

  return (
    isNonEmptyString(context.OrganizationId) &&
    isNonEmptyString(context.SiteId) &&
    isNonEmptyString(context.UserId) &&
    isNonEmptyString(context.planId) &&
    typeof context.planVersion === "number" &&
    Number.isInteger(context.planVersion) &&
    context.planVersion >= 1 &&
    isNonEmptyString(context.periodStart) &&
    isNonEmptyString(context.periodEnd) &&
    !Number.isNaN(Date.parse(context.periodStart)) &&
    !Number.isNaN(Date.parse(context.periodEnd)) &&
    Date.parse(context.periodStart) <= Date.parse(context.periodEnd)
  );
}

function sameMonitoringContext(left: MonitoringReadModel, right: MonitoringReadModel): boolean {
  return (
    left.OrganizationId === right.OrganizationId &&
    left.SiteId === right.SiteId &&
    left.UserId === right.UserId &&
    left.planId === right.planId &&
    left.planVersion === right.planVersion &&
    left.periodStart === right.periodStart &&
    left.periodEnd === right.periodEnd
  );
}

/** Fact-only monitoring input. No automatic success/failure, effectiveness, or plan-change judgment. */
export const MonitoringView: React.FC<MonitoringViewProps> = ({
  model,
  reviewInput,
  reviewPresentationContext,
  personLabel,
  procedureLabelContext,
  onCapturedReviewChange,
}) => {
  const reviewInputMatchesModel =
    reviewInput?.status === "RESOLVED" &&
    sameMonitoringContext(reviewInput.value.monitoringReadModel, model);
  const reviewAuthority = reviewInputMatchesModel ? "FOUND" : "UNRESOLVED";
  const humanReviewResult =
    reviewInputMatchesModel && isValidReviewPresentationContext(reviewPresentationContext)
      ? buildHumanReviewMaterials(reviewInput.value.monitoringReadModel, reviewPresentationContext)
      : ({ status: "UNRESOLVED" } as const);
  const [capturedReviews, setCapturedReviews] = React.useState<
    Readonly<Record<string, SyntheticCapturedReview>>
  >({});
  const capturedReviewsRef = React.useRef<Record<string, SyntheticCapturedReview>>({});

  const contextKey =
    humanReviewResult.status === "RESOLVED"
      ? reviewOutcomeContextKey(humanReviewResult.value)
      : null;
  const storedReview = contextKey ? (capturedReviews[contextKey] ?? null) : null;
  const capturedReview =
    humanReviewResult.status === "RESOLVED" &&
    storedReview !== null &&
    capturedReviewMatchesMaterials(storedReview, humanReviewResult.value)
      ? storedReview
      : null;

  React.useEffect(() => {
    onCapturedReviewChange?.(capturedReview);
  }, [capturedReview, onCapturedReviewChange]);

  const handleCaptureOutcome = React.useCallback(
    (
      decision: MonitoringPeriodReviewDecision,
      draftDecisionReason: string,
      draftNoteText: string,
    ): SyntheticCapturedReviewResult => {
      if (humanReviewResult.status !== "RESOLVED") {
        return { status: "INVALID" };
      }
      const key = reviewOutcomeContextKey(humanReviewResult.value);
      const stored = capturedReviewsRef.current[key] ?? null;
      const effectiveExisting =
        stored !== null && capturedReviewMatchesMaterials(stored, humanReviewResult.value)
          ? stored
          : null;
      const result = captureSyntheticCapturedReview(
        effectiveExisting,
        humanReviewResult.value,
        decision,
        draftDecisionReason,
        draftNoteText,
      );
      if (result.status === "CAPTURED") {
        capturedReviewsRef.current = {
          ...capturedReviewsRef.current,
          [key]: result.captured,
        };
        setCapturedReviews(capturedReviewsRef.current);
      }
      return result;
    },
    [humanReviewResult],
  );

  return (
    <>
      <section
        className={`${styles.monitoringView} ${styles.roleSummary}`}
        aria-labelledby="monitoring-link-slice-a-heading"
        data-monitoring-link-slice="MONITORING-LINK-SLICE-A"
        data-monitoring-plan-id={model.planId}
        data-monitoring-plan-version={String(model.planVersion)}
        data-monitoring-summary-only="true"
        data-monitoring-role="summary"
        data-monitoring-review-authority={reviewAuthority}
      >
        <p className={styles.roleCue} data-monitoring-role-cue="summary">
          期間の件数確認
        </p>
        <div className={styles.headingRow}>
          <div>
            <h3 id="monitoring-link-slice-a-heading" className={styles.heading}>
              期間モニタリング（概要）
            </h3>
            <p className={styles.personIdentity} data-monitoring-person-identity="true">
              {personLabel}
            </p>
            <p className={styles.scopeMeta} data-monitoring-scope-meta="true">
              計画版 {model.planVersion} · {formatTokyoDate(model.periodStart)}〜
              {formatTokyoDate(model.periodEnd)}
            </p>
          </div>
          <p className={styles.count} data-monitoring-record-count={String(model.recordCount)}>
            {model.recordCount}件
          </p>
        </div>
        <p className={styles.factOnlyNote}>
          この期間に一致した記録の件数を確認します。個別の記録は下の見直し資料で確認できます。支援の良否、効果、計画変更の要否はこの画面では判定しません。
        </p>
        <p className={styles.scopeNote}>
          <a href="#human-review-materials">見直し資料へ移動</a>
        </p>
        {model.records.length === 0 ? (
          <div
            className={styles.emptyState}
            data-monitoring-empty="true"
            data-state-kind="zero-records"
          >
            <EmptyNotice
              announce
              className={styles.emptyStateDetail}
              dataAttrs={{ "data-monitoring-empty-notice": "true" }}
            >
              この期間・計画版に一致する実施記録はありません。
            </EmptyNotice>
            <p data-monitoring-zero-not-not-performed="true">
              0件であることは、「実施できなかった」という結果を意味しません。
            </p>
          </div>
        ) : (
          <p className={styles.scopeNote} data-monitoring-detail-owner="human-review">
            {model.recordCount}件の詳細は「見直し資料」にまとめて表示します。
          </p>
        )}
      </section>

      <HumanReviewView
        result={humanReviewResult}
        personLabel={personLabel}
        procedureLabelContext={procedureLabelContext}
        capturedReview={capturedReview}
        onCaptureOutcome={handleCaptureOutcome}
      />
    </>
  );
};
