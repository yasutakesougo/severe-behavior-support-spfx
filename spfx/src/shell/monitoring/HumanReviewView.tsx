import * as React from "react";
import { labelForProcedureRecordResult } from "../procedure/procedure-copy";
import type { HumanReviewMaterialsBuildResult } from "../../sbs-domain/monitoring-read-model.bundle";
import styles from "./MonitoringViewUx.module.scss";

export type HumanReviewViewProps = Readonly<{
  result: HumanReviewMaterialsBuildResult;
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
    timeZoneName: "short",
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

export const HumanReviewView: React.FC<HumanReviewViewProps> = ({ result }) => {
  if (result.status === "CONTEXT_MISMATCH") {
    return (
      <section
        className={styles.monitoringView}
        aria-label="見直し資料"
        data-human-review-status="CONTEXT_MISMATCH"
      >
        <h3 className={styles.heading}>見直し資料</h3>
        <p className={styles.emptyState} role="status">
          選択中の計画・対象期間と見直し資料が一致しません。別の資料への置換は行いません。
        </p>
      </section>
    );
  }

  if (result.status === "MALFORMED_INPUT") {
    return (
      <section
        className={styles.monitoringView}
        aria-label="見直し資料"
        data-human-review-status="MALFORMED_INPUT"
      >
        <h3 className={styles.heading}>見直し資料</h3>
        <p className={styles.emptyState} role="status">
          見直し資料を安全に表示できません。入力内容を確認してください。
        </p>
      </section>
    );
  }

  const model = result.value;
  return (
    <section
      className={styles.monitoringView}
      aria-labelledby="human-review-ui-slice-a-heading"
      data-human-review-status="RESOLVED"
      data-human-review-plan-id={model.planId}
      data-human-review-plan-version={String(model.planVersion)}
    >
      <div className={styles.headingRow}>
        <div>
          <h3 id="human-review-ui-slice-a-heading" className={styles.heading}>
            見直し資料
          </h3>
          <p className={styles.scopeNote}>
            UserId: {model.UserId} · planId: {model.planId} · 計画版 {model.planVersion}
          </p>
          <p className={styles.scopeNote}>
            対象期間: {formatTokyoDate(model.periodStart)}〜{formatTokyoDate(model.periodEnd)}
          </p>
        </div>
        <p className={styles.count} data-human-review-record-count={String(model.recordCount)}>
          {model.recordCount}件
        </p>
      </div>

      <p className={styles.factOnlyNote}>
        ここに表示する内容は見直しのための事実資料です。評価・承認・変更要否の判断は人が行います。
      </p>

      {model.records.length === 0 ? (
        <p className={styles.emptyState} data-human-review-empty="true">
          この計画版・対象期間に一致する実施記録はありません。
        </p>
      ) : (
        <ol className={styles.recordList} data-human-review-record-list="true">
          {model.records.map((record) => (
            <li
              key={record.RecordId}
              className={styles.recordItem}
              data-human-review-record-id={record.RecordId}
            >
              <div className={styles.recordHeader}>
                <strong>{formatTokyoDateTime(record.performedAt)}</strong>
                <span className={styles.resultLabel}>
                  {labelForProcedureRecordResult(record.result)}
                </span>
              </div>
              <dl className={styles.recordFacts}>
                <div>
                  <dt>ProcedureId</dt>
                  <dd>{record.ProcedureId}</dd>
                </div>
                <div>
                  <dt>ProcedureVersion</dt>
                  <dd>{record.ProcedureVersion}</dd>
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
  );
};
