import * as React from "react";
import {
  FIELD_WORKFLOW_CORRECTION_PRESENTATION_NOTE,
  FIELD_WORKFLOW_CORRECTION_SAVE_BOUNDARY_NOTE,
} from "./procedure-copy";
import {
  FIELD_STAFF_PHASE8_CORRECTION_1_SLICE,
  type ProcedureCorrectionPresentation,
} from "./procedure-correction";
import styles from "./ProcedureRecordCorrectionUx.module.scss";

export type ProcedureRecordCorrectionProps = Readonly<{
  presentation: ProcedureCorrectionPresentation;
  headingRef?: React.Ref<HTMLHeadingElement>;
  onBackToCurrentProcedure?: () => void;
}>;

/**
 * FIELD-STAFF-PHASE8-CORRECTION-1 — synthetic-only correction path.
 * Reuses existing occurrence + record context without inventing write semantics.
 */
export const ProcedureRecordCorrection: React.FC<ProcedureRecordCorrectionProps> = ({
  presentation,
  headingRef,
  onBackToCurrentProcedure,
}) => {
  return (
    <section
      className={styles.correction}
      data-field-workflow="procedure-record-correction"
      data-field-workflow-correction-slice={FIELD_STAFF_PHASE8_CORRECTION_1_SLICE.id}
      data-field-workflow-occurrence-id={presentation.occurrenceId}
      data-field-workflow-record-id={presentation.recordId}
      data-field-workflow-procedure-id={presentation.procedureId}
      data-field-workflow-plan-version={String(presentation.planVersion)}
      aria-labelledby="field-workflow-procedure-correction-heading"
    >
      <h1
        id="field-workflow-procedure-correction-heading"
        ref={headingRef}
        tabIndex={-1}
        className={styles.heading}
        data-field-workflow="procedure-record-correction-heading"
      >
        記録の訂正
      </h1>
      <div className={styles.topRow}>
        <button
          type="button"
          className={styles.backButton}
          onClick={onBackToCurrentProcedure}
          disabled={!onBackToCurrentProcedure}
          aria-disabled={!onBackToCurrentProcedure ? "true" : undefined}
          data-field-workflow="procedure-correction-back"
        >
          ← 現在の手順
        </button>
      </div>
      <p className={styles.note} data-field-workflow="procedure-correction-note">
        {FIELD_WORKFLOW_CORRECTION_PRESENTATION_NOTE}
      </p>

      <section className={styles.section} aria-labelledby="procedure-correction-context-heading">
        <h2 id="procedure-correction-context-heading">対象の予定と文脈</h2>
        <dl className={styles.detailList}>
          <div>
            <dt>利用者</dt>
            <dd>{presentation.personLabel}</dd>
          </div>
          <div>
            <dt>予定</dt>
            <dd>{`${presentation.scheduledTime} / ${presentation.activityLabel}`}</dd>
          </div>
          <div>
            <dt>現在状態</dt>
            <dd>{presentation.occurrenceStatus}</dd>
          </div>
          <div>
            <dt>OccurrenceId</dt>
            <dd>{presentation.occurrenceId}</dd>
          </div>
          <div>
            <dt>手順</dt>
            <dd>{`${presentation.procedureId} (${presentation.procedureVersion})`}</dd>
          </div>
          <div>
            <dt>計画版</dt>
            <dd>{`${presentation.planId} / 版 ${presentation.planVersion}`}</dd>
          </div>
        </dl>
      </section>

      <section className={styles.section} aria-labelledby="procedure-correction-record-heading">
        <h2 id="procedure-correction-record-heading">元の記録</h2>
        <dl className={styles.detailList}>
          <div>
            <dt>RecordId</dt>
            <dd>{presentation.recordId}</dd>
          </div>
          <div>
            <dt>結果</dt>
            <dd>{presentation.resultLabel}</dd>
          </div>
          <div>
            <dt>実施時刻</dt>
            <dd>{presentation.performedAt}</dd>
          </div>
          <div>
            <dt>記録時刻</dt>
            <dd>{presentation.recordedAt}</dd>
          </div>
          <div>
            <dt>記録者</dt>
            <dd>{presentation.recordedBy}</dd>
          </div>
        </dl>
      </section>

      <section className={styles.section} aria-labelledby="procedure-correction-boundary-heading">
        <h2 id="procedure-correction-boundary-heading">この slice の境界</h2>
        <p className={styles.note}>{FIELD_WORKFLOW_CORRECTION_SAVE_BOUNDARY_NOTE}</p>
        <button
          type="button"
          className={styles.disabledAction}
          disabled
          aria-disabled="true"
          data-field-workflow="procedure-correction-save-disabled"
        >
          訂正を保存する（未接続）
        </button>
      </section>
    </section>
  );
};
