import * as React from "react";
import { StatusBadge } from "../primitives";
import {
  FIELD_WORKFLOW_CANCELLATION_ENTRY_NOTE,
  FIELD_WORKFLOW_CORRECTION_ENTRY_NOTE,
  FIELD_WORKFLOW_CONTEXT_HANDOFF_NOTE,
  FIELD_WORKFLOW_PRESENTATION_NOTE,
} from "./procedure-copy";
import { FIELD_WORKFLOW_UI_SLICE, VP4_WORKFLOW_SLICE } from "./procedure-fixture";
import type { ShellCurrentProcedurePresentation } from "./procedure-types";
import styles from "./CurrentProcedureUx.module.scss";

export type CurrentProcedureProps = Readonly<{
  presentation: ShellCurrentProcedurePresentation;
  headingRef?: React.Ref<HTMLHeadingElement>;
  backLabel?: string;
  onBackToUserDetail?: () => void;
  onRecordProcedureRequest?: () => void;
  onCorrectionRequest?: () => void;
  onCancellationRequest?: () => void;
  onAbcObservationRequest?: () => void;
}>;

/**
 * FIELD-WORKFLOW FW-01 — current support procedure summary (A2 projection).
 * FW-02 CTA stays under users destination (context handoff, no re-select).
 */
export const CurrentProcedure: React.FC<CurrentProcedureProps> = ({
  presentation,
  headingRef,
  backLabel = "← 利用者詳細",
  onBackToUserDetail,
  onRecordProcedureRequest,
  onCorrectionRequest,
  onCancellationRequest,
  onAbcObservationRequest,
}) => {
  const { heading, summaryPrompt, context, projection, canStartProcedureRecord } = presentation;
  const recordCtaEnabled = canStartProcedureRecord && Boolean(onRecordProcedureRequest);
  const correctionCtaVisible =
    !canStartProcedureRecord &&
    Boolean(onCorrectionRequest) &&
    (presentation.occurrenceStatus === "記録済み" || presentation.occurrenceStatus === "取消済み");
  const cancellationCtaVisible =
    !canStartProcedureRecord &&
    Boolean(onCancellationRequest) &&
    presentation.occurrenceStatus === "記録済み";

  return (
    <section
      className={styles.currentProcedure}
      data-field-workflow="current-procedure"
      data-field-workflow-slice={FIELD_WORKFLOW_UI_SLICE.id}
      data-field-workflow-visual-polish={VP4_WORKFLOW_SLICE.id}
      data-field-workflow-user={context.userId}
      data-field-workflow-plan-id={context.planId}
      data-field-workflow-plan-version={String(context.planVersion)}
      data-field-workflow-procedure-id={context.procedureId}
      data-field-workflow-procedure-version={context.procedureVersion}
      data-field-workflow-occurrence-id={context.occurrenceId ?? ""}
      data-kiosk-occurrence-status={presentation.occurrenceStatus ?? ""}
      data-kiosk-can-start-record={canStartProcedureRecord ? "true" : "false"}
      aria-labelledby="field-workflow-current-procedure-heading"
    >
      <h1
        id="field-workflow-current-procedure-heading"
        ref={headingRef}
        tabIndex={-1}
        className={styles.heading}
        data-field-workflow-visual-role="page-title"
        data-field-workflow="current-procedure-heading"
      >
        {heading}
      </h1>
      <div className={styles.topRow}>
        <button
          type="button"
          className={styles.backButton}
          onClick={onBackToUserDetail}
          disabled={!onBackToUserDetail}
          aria-disabled={!onBackToUserDetail ? "true" : undefined}
          data-field-workflow="current-procedure-back"
          data-kiosk-ux="current-procedure-back"
        >
          {backLabel}
        </button>
      </div>
      <p className={styles.prompt}>{summaryPrompt}</p>
      <p className={styles.contextLine} data-field-workflow="current-procedure-person">
        {context.personLabel} / {context.planPeriodLabel}
      </p>
      {presentation.occurrenceStatus ? (
        <p className={styles.contextLine} data-kiosk-ux="occurrence-status-text">
          状態:{" "}
          <StatusBadge
            shape={
              presentation.occurrenceStatus === "取消済み" ||
              presentation.occurrenceStatus === "記録済み"
                ? "soft"
                : "pill"
            }
            label={presentation.occurrenceStatus}
          />
        </p>
      ) : null}
      <p className={styles.sectionHint} data-field-workflow="presentation-note">
        {FIELD_WORKFLOW_PRESENTATION_NOTE}
      </p>

      <section className={styles.section} aria-labelledby="field-workflow-procedure-flow-heading">
        <h2
          id="field-workflow-procedure-flow-heading"
          data-field-workflow-visual-role="section-title"
        >
          支援の流れ
        </h2>
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
        <h2 id="field-workflow-record-cta-heading" data-field-workflow-visual-role="section-title">
          {correctionCtaVisible ? "記録の訂正" : "この手順を記録"}
        </h2>
        <p className={styles.sectionHint} data-field-workflow="context-handoff-note">
          {correctionCtaVisible
            ? FIELD_WORKFLOW_CORRECTION_ENTRY_NOTE
            : FIELD_WORKFLOW_CONTEXT_HANDOFF_NOTE}
        </p>
        <div className={styles.actionRow}>
          {correctionCtaVisible ? (
            <button
              type="button"
              className={styles.primaryButton}
              onClick={() => {
                if (onCorrectionRequest) {
                  onCorrectionRequest();
                }
              }}
              data-field-workflow="record-correction-cta"
              data-kiosk-occurrence-status={presentation.occurrenceStatus}
            >
              この記録を訂正する
            </button>
          ) : (
            <button
              type="button"
              className={styles.primaryButton}
              onClick={() => {
                if (recordCtaEnabled && onRecordProcedureRequest) {
                  onRecordProcedureRequest();
                }
              }}
              disabled={!recordCtaEnabled}
              aria-disabled={!recordCtaEnabled ? "true" : undefined}
              data-field-workflow="record-procedure-cta"
              data-kiosk-can-start-record={canStartProcedureRecord ? "true" : "false"}
            >
              この手順を記録
            </button>
          )}
          <button
            type="button"
            className={styles.backButton}
            onClick={onAbcObservationRequest}
            disabled={!onAbcObservationRequest}
            aria-disabled={!onAbcObservationRequest ? "true" : undefined}
            data-field-workflow="abc-observation-cta"
          >
            ABC観察を見る
          </button>
        </div>
      </section>

      {cancellationCtaVisible ? (
        <section
          className={styles.section}
          aria-labelledby="field-workflow-cancellation-cta-heading"
        >
          <h2
            id="field-workflow-cancellation-cta-heading"
            data-field-workflow-visual-role="section-title"
          >
            記録の取消
          </h2>
          <p className={styles.sectionHint} data-field-workflow="cancellation-entry-note">
            {FIELD_WORKFLOW_CANCELLATION_ENTRY_NOTE}
          </p>
          <div className={styles.actionRow}>
            <button
              type="button"
              className={styles.primaryButton}
              onClick={() => {
                if (onCancellationRequest) {
                  onCancellationRequest();
                }
              }}
              data-field-workflow="record-cancellation-cta"
              data-kiosk-occurrence-status={presentation.occurrenceStatus}
            >
              この記録を取り消す
            </button>
          </div>
        </section>
      ) : null}
    </section>
  );
};
