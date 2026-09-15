import * as React from "react";
import {
  hintForProcedureRecordResult,
  labelForProcedureRecordResult,
} from "../procedure/procedure-copy";
import { EmptyNotice, StatusBadge } from "../primitives";
import type {
  HumanReviewMaterialRecord,
  HumanReviewMaterials,
  HumanReviewMaterialsBuildResult,
} from "../../sbs-domain/monitoring-read-model.bundle";
import type { MonitoringPeriodReviewDecision } from "../../sbs-domain/monitoring-period-review-outcome.bundle";
import { ReviewOutcomeCaptureView } from "./ReviewOutcomeCaptureView";
import {
  reviewOutcomeCurrentEpochBindingKey,
  type SyntheticCapturedReview,
  type SyntheticCapturedReviewResult,
} from "./review-outcome-capture";
import styles from "./MonitoringViewUx.module.scss";

export type HumanReviewProcedureLabelItem = Readonly<{
  procedureId: string;
  procedureVersion: string;
  planVersion: number;
  sceneLabel: string;
}>;

export type HumanReviewProcedureLabelContext = Readonly<{
  userId: string;
  planId: string;
  currentVersion: number;
  currentProcedures: readonly HumanReviewProcedureLabelItem[];
}>;

export type HumanReviewViewProps = Readonly<{
  result: HumanReviewMaterialsBuildResult;
  personLabel?: string;
  procedureLabelContext?: HumanReviewProcedureLabelContext;
  capturedReview?: SyntheticCapturedReview | null;
  onCaptureOutcome?: (
    decision: MonitoringPeriodReviewDecision,
    draftDecisionReason: string,
    draftNoteText: string,
  ) => SyntheticCapturedReviewResult;
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

function exactSceneLabel(
  model: HumanReviewMaterials,
  record: HumanReviewMaterialRecord,
  context?: HumanReviewProcedureLabelContext,
): string | undefined {
  if (
    !context ||
    context.userId !== model.UserId ||
    context.planId !== model.planId ||
    context.currentVersion !== model.planVersion
  ) {
    return undefined;
  }

  const matches = context.currentProcedures.filter(
    (procedure) =>
      procedure.procedureId === record.ProcedureId &&
      procedure.procedureVersion === record.ProcedureVersion &&
      procedure.planVersion === model.planVersion,
  );

  if (matches.length !== 1 || matches[0].sceneLabel.trim().length === 0) {
    return undefined;
  }

  return matches[0].sceneLabel;
}

export const HumanReviewView: React.FC<HumanReviewViewProps> = ({
  result,
  personLabel,
  procedureLabelContext,
  capturedReview = null,
  onCaptureOutcome,
}) => {
  if (result.status === "CONTEXT_MISMATCH") {
    return (
      <section
        id="human-review-materials"
        className={`${styles.monitoringView} ${styles.roleMaterials}`}
        aria-label="見直し資料"
        data-human-review-status="CONTEXT_MISMATCH"
        data-human-review-role="materials"
      >
        <p className={styles.roleCue} data-human-review-role-cue="materials">
          個別の事実資料
        </p>
        <h3 className={styles.heading}>見直し資料</h3>
        {personLabel ? (
          <p className={styles.personIdentity} data-human-review-person-identity="true">
            {personLabel}
          </p>
        ) : null}
        <p className={styles.emptyState} role="status">
          選択中の計画・対象期間と見直し資料が一致しません。別の資料への置換は行いません。
        </p>
      </section>
    );
  }

  if (result.status === "MALFORMED_INPUT") {
    return (
      <section
        id="human-review-materials"
        className={`${styles.monitoringView} ${styles.roleMaterials}`}
        aria-label="見直し資料"
        data-human-review-status="MALFORMED_INPUT"
        data-human-review-role="materials"
      >
        <p className={styles.roleCue} data-human-review-role-cue="materials">
          個別の事実資料
        </p>
        <h3 className={styles.heading}>見直し資料</h3>
        {personLabel ? (
          <p className={styles.personIdentity} data-human-review-person-identity="true">
            {personLabel}
          </p>
        ) : null}
        <p className={styles.emptyState} role="status">
          見直し資料を安全に表示できません。入力内容を確認してください。
        </p>
      </section>
    );
  }

  const model = result.value;
  return (
    <section
      id="human-review-materials"
      className={`${styles.monitoringView} ${styles.roleMaterials}`}
      aria-labelledby="human-review-ui-slice-a-heading"
      data-human-review-status="RESOLVED"
      data-human-review-plan-id={model.planId}
      data-human-review-plan-version={String(model.planVersion)}
      data-human-review-role="materials"
    >
      <p className={styles.roleCue} data-human-review-role-cue="materials">
        個別の事実資料
      </p>
      <div className={styles.headingRow}>
        <div>
          <h3 id="human-review-ui-slice-a-heading" className={styles.heading}>
            見直し資料
          </h3>
          {personLabel ? (
            <p className={styles.personIdentity} data-human-review-person-identity="true">
              {personLabel}
            </p>
          ) : null}
          <p className={styles.scopeMeta} data-human-review-scope-meta="true">
            計画版 {model.planVersion} · 対象期間 {formatTokyoDate(model.periodStart)}〜
            {formatTokyoDate(model.periodEnd)}
          </p>
          <p className={styles.technicalDetail} data-human-review-technical-detail="true">
            詳細: UserId {model.UserId} · planId {model.planId}
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
        <div
          className={styles.emptyState}
          data-human-review-empty="true"
          data-state-kind="zero-records"
        >
          <p className={styles.emptyStateLead} data-human-review-zero-records="true">
            記録なし（0件）
          </p>
          <EmptyNotice
            announce
            className={styles.emptyStateDetail}
            dataAttrs={{ "data-human-review-empty-notice": "true" }}
          >
            この計画版・対象期間に一致する実施記録はありません。
          </EmptyNotice>
          <p data-human-review-zero-not-not-performed="true">
            0件であることは、「実施できなかった」という結果を意味しません。
          </p>
        </div>
      ) : (
        <ol className={styles.recordList} data-human-review-record-list="true">
          {model.records.map((record) => {
            const sceneLabel = exactSceneLabel(model, record, procedureLabelContext);
            return (
              <li
                key={record.RecordId}
                className={styles.recordItem}
                data-human-review-record-id={record.RecordId}
              >
                <div className={styles.recordHeader}>
                  <strong>{formatTokyoDateTime(record.performedAt)}</strong>
                  <StatusBadge
                    shape="soft"
                    label={labelForProcedureRecordResult(record.result)}
                    statusId={record.result}
                    className={styles.resultLabel}
                    dataAttrs={{
                      "data-human-review-result": record.result,
                      "data-human-review-result-label": "true",
                    }}
                  />
                </div>
                {record.result === "NOT_PERFORMED" ? (
                  <p
                    className={styles.resultFactHint}
                    data-human-review-result-fact="NOT_PERFORMED"
                  >
                    {hintForProcedureRecordResult(record.result)}
                  </p>
                ) : null}
                <dl className={styles.recordFacts}>
                  {sceneLabel ? (
                    <div data-human-review-scene-label="true">
                      <dt>支援場面</dt>
                      <dd>{sceneLabel}</dd>
                    </div>
                  ) : null}
                  <div>
                    <dt>支援手順ID</dt>
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
            );
          })}
        </ol>
      )}

      {onCaptureOutcome ? (
        <ReviewOutcomeCaptureView
          key={reviewOutcomeCurrentEpochBindingKey(model)}
          materials={model}
          capturedReview={capturedReview}
          onCapture={onCaptureOutcome}
        />
      ) : null}
    </section>
  );
};
