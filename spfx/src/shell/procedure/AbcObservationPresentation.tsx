import * as React from "react";
import { FIELD_WORKFLOW_CONTEXT_HANDOFF_NOTE } from "./procedure-copy";
import {
  FIELD_STAFF_ABC_PRESENTATION_1_SLICE,
  type AbcObservationPresentation as AbcObservationPresentationModel,
} from "./abc-presentation";
import styles from "./AbcObservationPresentationUx.module.scss";

export type AbcObservationPresentationProps = Readonly<{
  presentation: AbcObservationPresentationModel;
  headingRef?: React.Ref<HTMLHeadingElement>;
  onBackToCurrentProcedure?: () => void;
}>;

/** FIELD_STAFF-ABC-PRESENTATION-1 — read-only synthetic ABC path. */
export const AbcObservationPresentation: React.FC<AbcObservationPresentationProps> = ({
  presentation,
  headingRef,
  onBackToCurrentProcedure,
}) => (
  <section
    className={styles.abc}
    data-field-workflow="abc-observation-presentation"
    data-field-workflow-abc-slice={FIELD_STAFF_ABC_PRESENTATION_1_SLICE.id}
    data-field-workflow-user={presentation.context.userId}
    data-field-workflow-occurrence-id={presentation.context.occurrenceId ?? ""}
    aria-labelledby="field-workflow-abc-heading"
  >
    <h1
      id="field-workflow-abc-heading"
      ref={headingRef}
      tabIndex={-1}
      className={styles.heading}
      data-field-workflow="abc-observation-heading"
    >
      ABC観察
    </h1>
    <div className={styles.topRow}>
      <button
        type="button"
        className={styles.backButton}
        onClick={onBackToCurrentProcedure}
        disabled={!onBackToCurrentProcedure}
        aria-disabled={!onBackToCurrentProcedure ? "true" : undefined}
        data-field-workflow="abc-observation-back"
      >
        ← 現在の支援手順
      </button>
    </div>
    <p className={styles.note} data-field-workflow="abc-observation-note">
      合成・表示専用です。観察の保存、記録訂正、取消し、SharePoint WRITE は行いません。
    </p>
    <p className={styles.contextLine} data-field-workflow="abc-observation-person">
      {presentation.context.personLabel} / {presentation.context.planPeriodLabel}
    </p>
    <p className={styles.contextLine} data-field-workflow="abc-observation-handoff-note">
      {FIELD_WORKFLOW_CONTEXT_HANDOFF_NOTE}
    </p>

    <section className={styles.section} aria-labelledby="field-workflow-abc-context-heading">
      <h2 id="field-workflow-abc-context-heading">対象の文脈</h2>
      <dl className={styles.detailList} data-field-workflow="abc-binding-context">
        <div>
          <dt>計画 / 版</dt>
          <dd><code className={styles.idValue}>{`${presentation.context.planId} / 版 ${presentation.context.planVersion}`}</code></dd>
        </div>
        <div>
          <dt>手順</dt>
          <dd><code className={styles.idValue}>{`${presentation.context.procedureId} (${presentation.context.procedureVersion})`}</code></dd>
        </div>
        {presentation.context.occurrenceId ? (
          <div>
            <dt>OccurrenceId</dt>
            <dd><code className={styles.idValue}>{presentation.context.occurrenceId}</code></dd>
          </div>
        ) : null}
      </dl>
    </section>

    <section className={styles.section} aria-labelledby="field-workflow-abc-fields-heading">
      <h2 id="field-workflow-abc-fields-heading">観察の流れ（表示専用）</h2>
      <dl className={styles.detailList} data-field-workflow="abc-observation-fields">
        <div>
          <dt>いつ / 場面の前</dt>
          <dd>{presentation.occurredAt}</dd>
        </div>
        <div>
          <dt>Antecedent / きっかけ</dt>
          <dd>{presentation.antecedent}</dd>
        </div>
        <div>
          <dt>Behavior / 行動</dt>
          <dd>{presentation.behavior}</dd>
        </div>
        <div>
          <dt>Consequence / その後</dt>
          <dd>{presentation.aftermath}</dd>
        </div>
        <div>
          <dt>強度</dt>
          <dd>{presentation.intensityLabel}</dd>
        </div>
      </dl>
    </section>
  </section>
);
