import * as React from "react";
import {
  buildHumanReviewMaterials,
  type MonitoringReadModel,
  type ReviewPresentationContext,
} from "../../sbs-domain/monitoring-read-model.bundle";
import type {
  MonitoringPeriodReviewDecision,
  MonitoringPeriodReviewOutcome,
} from "../../sbs-domain/monitoring-period-review-outcome.bundle";
import { HumanReviewView, type HumanReviewProcedureLabelContext } from "./HumanReviewView";
import {
  captureSyntheticReviewOutcome,
  reviewOutcomeContextKey,
  type SyntheticReviewOutcomeCaptureResult,
} from "./review-outcome-capture";
import styles from "./MonitoringViewUx.module.scss";

export type MonitoringViewProps = Readonly<{
  model: MonitoringReadModel;
  personLabel: string;
  procedureLabelContext?: HumanReviewProcedureLabelContext;
}>;

function formatTokyoDate(value: string): string {
  return new Intl.DateTimeFormat("ja-JP", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(value));
}

function exactReviewContext(model: MonitoringReadModel): ReviewPresentationContext {
  return {
    OrganizationId: model.OrganizationId,
    SiteId: model.SiteId,
    UserId: model.UserId,
    planId: model.planId,
    planVersion: model.planVersion,
    periodStart: model.periodStart,
    periodEnd: model.periodEnd,
  };
}

/** Fact-only monitoring input. No automatic success/failure, effectiveness, or plan-change judgment. */
export const MonitoringView: React.FC<MonitoringViewProps> = ({
  model,
  personLabel,
  procedureLabelContext,
}) => {
  const humanReviewResult = buildHumanReviewMaterials(model, exactReviewContext(model));
  const [capturedOutcomes, setCapturedOutcomes] = React.useState<
    Readonly<Record<string, MonitoringPeriodReviewOutcome>>
  >({});
  const capturedOutcomesRef = React.useRef<Record<string, MonitoringPeriodReviewOutcome>>({});

  const contextKey =
    humanReviewResult.status === "RESOLVED"
      ? reviewOutcomeContextKey(humanReviewResult.value)
      : null;
  const capturedOutcome = contextKey ? (capturedOutcomes[contextKey] ?? null) : null;

  const handleCaptureOutcome = React.useCallback(
    (decision: MonitoringPeriodReviewDecision): SyntheticReviewOutcomeCaptureResult => {
      if (humanReviewResult.status !== "RESOLVED") {
        return { status: "INVALID" };
      }
      const key = reviewOutcomeContextKey(humanReviewResult.value);
      const existing = capturedOutcomesRef.current[key] ?? null;
      const result = captureSyntheticReviewOutcome(existing, humanReviewResult.value, decision);
      if (result.status === "CAPTURED") {
        capturedOutcomesRef.current = {
          ...capturedOutcomesRef.current,
          [key]: result.outcome,
        };
        setCapturedOutcomes(capturedOutcomesRef.current);
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
          <p className={styles.emptyState} data-monitoring-empty="true">
            この期間・計画版に一致する実施記録はありません。
          </p>
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
        capturedOutcome={capturedOutcome}
        onCaptureOutcome={handleCaptureOutcome}
      />
    </>
  );
};
