import * as React from "react";
import {
  buildHumanReviewMaterials,
  type MonitoringReadModel,
  type ReviewPresentationContext,
} from "../../sbs-domain/monitoring-read-model.bundle";
import {
  HumanReviewView,
  type HumanReviewProcedureLabelContext,
} from "./HumanReviewView";
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

/** Fact-only monitoring input. No success/failure, effectiveness, or plan-change judgment. */
export const MonitoringView: React.FC<MonitoringViewProps> = ({
  model,
  personLabel,
  procedureLabelContext,
}) => {
  const humanReviewResult = buildHumanReviewMaterials(model, exactReviewContext(model));

  return (
    <>
      <section
        className={styles.monitoringView}
        aria-labelledby="monitoring-link-slice-a-heading"
        data-monitoring-link-slice="MONITORING-LINK-SLICE-A"
        data-monitoring-plan-id={model.planId}
        data-monitoring-plan-version={String(model.planVersion)}
        data-monitoring-summary-only="true"
      >
        <div className={styles.headingRow}>
          <div>
            <h3 id="monitoring-link-slice-a-heading" className={styles.heading}>
              期間モニタリング（概要）
            </h3>
            <p className={styles.scopeNote}>
              {personLabel} · 計画版 {model.planVersion} · {formatTokyoDate(model.periodStart)}〜
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
      />
    </>
  );
};
