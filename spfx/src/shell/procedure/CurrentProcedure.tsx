import * as React from "react";
import { FIELD_WORKFLOW_CONTEXT_HANDOFF_NOTE, FIELD_WORKFLOW_PRESENTATION_NOTE } from "./procedure-copy";
import { FIELD_WORKFLOW_UI_SLICE } from "./procedure-fixture";
import type { ShellCurrentProcedurePresentation } from "./procedure-types";
import styles from "./CurrentProcedureUx.module.scss";

export type CurrentProcedureProps = Readonly<{
  presentation: ShellCurrentProcedurePresentation;
  headingRef?: React.Ref<HTMLHeadingElement>;
  onBackToUserDetail?: () => void;
  onRecordProcedureRequest?: () => void;
}>;

/**
 * FIELD-WORKFLOW FW-01 — current support procedure summary (A2 projection).
 * FW-02 CTA stays under users destination (context handoff, no re-select).
 */
export const CurrentProcedure: React.FC<CurrentProcedureProps> = ({
  presentation,
  headingRef,
  onBackToUserDetail,
  onRecordProcedureRequest,
}) => {
  const { heading, summaryPrompt, context, projection } = presentation;

  return (
    <section
      className={styles.currentProcedure}
      data-field-workflow="current-procedure"
      data-field-workflow-slice={FIELD_WORKFLOW_UI_SLICE.id}
      data-field-workflow-user={context.userId}
      data-field-workflow-plan-id={context.planId}
      data-field-workflow-plan-version={String(context.planVersion)}
      data-field-workflow-procedure-id={context.procedureId}
      data-field-workflow-procedure-version={context.procedureVersion}
      aria-labelledby="field-workflow-current-procedure-heading"
    >
      <div className={styles.topRow}>
        <button
          type="button"
          className={styles.backButton}
          onClick={onBackToUserDetail}
          disabled={!onBackToUserDetail}
          aria-disabled={!onBackToUserDetail ? "true" : undefined}
          data-field-workflow="current-procedure-back"
        >
          ← 利用者詳細
        </button>
      </div>

      <h1
        id="field-workflow-current-procedure-heading"
        ref={headingRef}
        tabIndex={-1}
        className={styles.heading}
        data-field-workflow="current-procedure-heading"
      >
        {heading}
      </h1>
      <p className={styles.prompt}>{summaryPrompt}</p>
      <p className={styles.contextLine} data-field-workflow="current-procedure-person">
        {context.personLabel} / {context.planPeriodLabel}
      </p>
      <p className={styles.sectionHint} data-field-workflow="presentation-note">
        {FIELD_WORKFLOW_PRESENTATION_NOTE}
      </p>

      <section className={styles.section} aria-labelledby="field-workflow-procedure-flow-heading">
        <h2 id="field-workflow-procedure-flow-heading">支援の流れ</h2>
        <dl className={styles.flowList} data-field-workflow="procedure-flow">
          <div className={styles.flowItem}>
            <dt>場面</dt>
            <dd data-field-workflow="procedure-scene">{projection.sceneLabel}</dd>
          </div>
          <div className={styles.flowItem}>
            <dt>実施する支援</dt>
            <dd>
              <ul data-field-workflow="procedure-perform">
                {projection.performLabels.map((label) => (
                  <li key={label}>{label}</li>
                ))}
              </ul>
            </dd>
          </div>
          <div className={styles.flowItem}>
            <dt>避ける対応</dt>
            <dd>
              <ul data-field-workflow="procedure-avoid">
                {projection.avoidLabels.map((label) => (
                  <li key={label}>{label}</li>
                ))}
              </ul>
            </dd>
          </div>
          <div className={styles.flowItem}>
            <dt>必要な補足</dt>
            <dd data-field-workflow="procedure-note">{projection.noteLabel}</dd>
          </div>
        </dl>
      </section>

      <section className={styles.section} aria-labelledby="field-workflow-record-cta-heading">
        <h2 id="field-workflow-record-cta-heading">この手順を記録</h2>
        <p className={styles.sectionHint} data-field-workflow="context-handoff-note">
          {FIELD_WORKFLOW_CONTEXT_HANDOFF_NOTE}
        </p>
        <div className={styles.actionRow}>
          <button
            type="button"
            className={styles.primaryButton}
            onClick={onRecordProcedureRequest}
            disabled={!onRecordProcedureRequest}
            aria-disabled={!onRecordProcedureRequest ? "true" : undefined}
            data-field-workflow="record-procedure-cta"
          >
            この手順を記録
          </button>
        </div>
      </section>
    </section>
  );
};
