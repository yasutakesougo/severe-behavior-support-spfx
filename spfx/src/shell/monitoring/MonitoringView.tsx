import * as React from "react";
import { labelForProcedureRecordResult } from "../procedure/procedure-copy";
import {
  buildHumanReviewMaterials,
  type MonitoringReadModel,
  type ReviewPresentationContext,
} from "../../sbs-domain/monitoring-read-model.bundle";
import { HumanReviewView } from "./HumanReviewView";
import styles from "./MonitoringViewUx.module.scss";

export type MonitoringViewProps = Readonly<{
  model: MonitoringReadModel;
  personLabel: string;
}>;

function formatTokyoDateTime(value: string): string {
  return new Intl.DateTimeFormat("ja-JP", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(value));
}

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
export const MonitoringView: React.FC<MonitoringViewProps> = ({ model, personLabel }) => {
  const humanReviewResult = buildHumanReviewMaterials(model, exactReviewContext(model));

  return (
    <>
      <section
        className={styles.monitoringView}
        aria-labelledby="monitoring-link-slice-a-heading"
        data-monitoring-link-slice="MONITORING-LINK-SLICE-A"
        data-monitoring-plan-id={model.planId}
        data-monitoring-plan-version={String(model.planVersion)}
      >
        <div className={styles.headingRow}>
          <div>
            <h3 id="monitoring-link-slice-a-heading" className={styles.heading}>
              期間モニタリング（実施記録）
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
          記録された事実を表示します。支援の良否、効果、計画変更の要否はこの画面では判定しません。
        </p>
        <p className={styles.scopeNote}>
          <a href="#human-review-materials">見直し資料へ移動</a>
        </p>

        {model.records.length === 0 ? (
          <p className={styles.emptyState} data-monitoring-empty="true">
            この期間・計画版に一致する実施記録はありません。
          </p>
        ) : (
          <ol className={styles.recordList} data-monitoring-record-list="true">
            {model.records.map((record) => (
              <li
                key={record.RecordId}
                className={styles.recordItem}
                data-monitoring-record-id={record.RecordId}
              >
                <div className={styles.recordHeader}>
                  <strong>{formatTokyoDateTime(record.performedAt)}</strong>
                  <span className={styles.resultLabel}>
                    {labelForProcedureRecordResult(record.result)}
                  </span>
                </div>
                <dl className={styles.recordFacts}>
                  <div>
                    <dt>支援手順</dt>
                    <dd>{record.Procedure.ProcedureId}</dd>
                  </div>
                  <div>
                    <dt>計画版</dt>
                    <dd>{record.planVersion}</dd>
                  </div>
                  <div>
                    <dt>記録時刻</dt>
                    <dd>{formatTokyoDateTime(record.recordedAt)}</dd>
                  </div>
                </dl>
              </li>
            ))}
          </ol>
        )}
      </section>

      <HumanReviewView result={humanReviewResult} personLabel={personLabel} />
    </>
  );
};
