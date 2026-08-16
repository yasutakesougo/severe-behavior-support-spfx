import * as React from "react";
import {
  descriptionForShellSaveState,
  labelForShellSaveState,
  type ShellSaveState,
} from "../ux/save-state";
import {
  FIELD_WORKFLOW_CONTEXT_HANDOFF_NOTE,
  FIELD_WORKFLOW_MUTATION_BOUNDARY_NOTE,
  FIELD_WORKFLOW_SAVE_FAILED_RETAIN_NOTE,
  FIELD_WORKFLOW_SAVE_OUTCOME_UNKNOWN_NOTE,
  hintForProcedureRecordResult,
  labelForProcedureRecordResult,
} from "./procedure-copy";
import { FIELD_WORKFLOW_UI_SLICE, VP4_WORKFLOW_SLICE } from "./procedure-fixture";
import {
  applySyntheticProcedureRecordSave,
  canRetryProcedureRecordSave,
  createEmptyProcedureRecordDraft,
  isProcedureRecordDraftReadyToSave,
} from "./procedure-record-draft";
import {
  PROCEDURE_RECORD_RESULT_VALUES,
  type ProcedureBindingContext,
  type ProcedureRecordDraft,
  type ProcedureRecordResultValue,
  type SyntheticProcedureSaveOutcome,
} from "./procedure-types";
import styles from "./ProcedureRecordFormUx.module.scss";

export type ProcedureRecordFormProps = Readonly<{
  context: ProcedureBindingContext;
  headingRef?: React.Ref<HTMLHeadingElement>;
  initialDraft?: ProcedureRecordDraft;
  initialSaveState?: ShellSaveState;
  defaultSaveOutcome?: SyntheticProcedureSaveOutcome;
  onBackToCurrentProcedure?: () => void;
  onSaveStateChange?: (state: ShellSaveState) => void;
}>;

/**
 * FIELD-WORKFLOW FW-03 / FW-09 — result-centric ProcedureRecord input + synthetic save.
 * Context is inherited (FW-02). Adaptation / not-performed are not failure chrome.
 */
export const ProcedureRecordForm: React.FC<ProcedureRecordFormProps> = ({
  context,
  headingRef,
  initialDraft,
  initialSaveState = "unsaved",
  defaultSaveOutcome = "saved",
  onBackToCurrentProcedure,
  onSaveStateChange,
}) => {
  const [draft, setDraft] = React.useState<ProcedureRecordDraft>(
    () => initialDraft ?? createEmptyProcedureRecordDraft(),
  );
  const [saveState, setSaveState] = React.useState<ShellSaveState>(initialSaveState);
  const [saveOutcome, setSaveOutcome] =
    React.useState<SyntheticProcedureSaveOutcome>(defaultSaveOutcome);

  const setSaveStateAndNotify = (next: ShellSaveState): void => {
    setSaveState(next);
    if (onSaveStateChange) {
      onSaveStateChange(next);
    }
  };

  const selectResult = (result: ProcedureRecordResultValue): void => {
    if (saveState === "saving" || saveState === "saved" || saveState === "save_outcome_unknown") {
      return;
    }
    setDraft((prev) => ({ ...prev, result }));
    if (saveState === "save_failed") {
      setSaveStateAndNotify("unsaved");
    }
  };

  const updatePerformedAt = (value: string): void => {
    if (saveState === "saving" || saveState === "saved" || saveState === "save_outcome_unknown") {
      return;
    }
    setDraft((prev) => ({ ...prev, performedAtLocal: value }));
    if (saveState === "save_failed") {
      setSaveStateAndNotify("unsaved");
    }
  };

  const updateNote = (value: string): void => {
    if (saveState === "saving" || saveState === "saved" || saveState === "save_outcome_unknown") {
      return;
    }
    setDraft((prev) => ({ ...prev, note: value }));
    if (saveState === "save_failed") {
      setSaveStateAndNotify("unsaved");
    }
  };

  const handleSave = (): void => {
    if (!FIELD_WORKFLOW_UI_SLICE.syntheticProcedureRecordSaveAuthorized) {
      return;
    }
    if (!isProcedureRecordDraftReadyToSave(draft) || !canRetryProcedureRecordSave(saveState)) {
      return;
    }
    setSaveStateAndNotify("saving");
    const result = applySyntheticProcedureRecordSave({
      context,
      draft,
      outcome: saveOutcome,
    });
    setDraft(result.draft);
    setSaveStateAndNotify(result.saveState);
  };

  const saveEnabled =
    FIELD_WORKFLOW_UI_SLICE.syntheticProcedureRecordSaveAuthorized &&
    isProcedureRecordDraftReadyToSave(draft) &&
    canRetryProcedureRecordSave(saveState);

  const statusNote =
    saveState === "save_failed"
      ? FIELD_WORKFLOW_SAVE_FAILED_RETAIN_NOTE
      : saveState === "save_outcome_unknown"
        ? FIELD_WORKFLOW_SAVE_OUTCOME_UNKNOWN_NOTE
        : descriptionForShellSaveState(saveState);

  return (
    <section
      className={styles.procedureRecordForm}
      data-field-workflow="procedure-record-form"
      data-field-workflow-slice={FIELD_WORKFLOW_UI_SLICE.id}
      data-field-workflow-visual-polish={VP4_WORKFLOW_SLICE.id}
      data-field-workflow-user={context.userId}
      data-field-workflow-plan-id={context.planId}
      data-field-workflow-plan-version={String(context.planVersion)}
      data-field-workflow-procedure-id={context.procedureId}
      data-field-workflow-procedure-version={context.procedureVersion}
      data-field-workflow-save-state={saveState}
      aria-labelledby="field-workflow-procedure-record-heading"
    >
      <div className={styles.topRow}>
        <button
          type="button"
          className={styles.backButton}
          onClick={onBackToCurrentProcedure}
          disabled={!onBackToCurrentProcedure || saveState === "saving"}
          aria-disabled={!onBackToCurrentProcedure || saveState === "saving" ? "true" : undefined}
          data-field-workflow="procedure-record-back"
        >
          ← 現在の支援手順
        </button>
      </div>

      <h1
        id="field-workflow-procedure-record-heading"
        ref={headingRef}
        tabIndex={-1}
        className={styles.heading}
        data-field-workflow-visual-role="page-title"
        data-field-workflow="procedure-record-heading"
      >
        支援手順の記録
      </h1>
      <p className={styles.contextLine} data-field-workflow="procedure-record-person">
        {context.personLabel}
      </p>
      <p className={styles.hint} data-field-workflow="context-handoff-note">
        {FIELD_WORKFLOW_CONTEXT_HANDOFF_NOTE}
      </p>
      <p className={styles.hint} data-field-workflow="mutation-boundary-note">
        {FIELD_WORKFLOW_MUTATION_BOUNDARY_NOTE}
      </p>

      <section className={styles.section} aria-labelledby="field-workflow-binding-heading">
        <h2 id="field-workflow-binding-heading" data-field-workflow-visual-role="section-title">
          引き継いだ文脈
        </h2>
        <dl className={styles.contextLine} data-field-workflow="binding-context">
          <div>
            planId / planVersion: {context.planId} / v{context.planVersion}
          </div>
          <div>
            ProcedureId / Version: {context.procedureId} / {context.procedureVersion}
          </div>
        </dl>
      </section>

      <section className={styles.section} aria-labelledby="field-workflow-result-heading">
        <h2 id="field-workflow-result-heading" data-field-workflow-visual-role="section-title">
          実施結果
        </h2>
        <ul className={styles.resultList} role="radiogroup" aria-label="実施結果">
          {PROCEDURE_RECORD_RESULT_VALUES.map((result) => {
            const selected = draft.result === result;
            const optionClass = selected
              ? `${styles.resultOption} ${styles.resultOptionSelected}`
              : styles.resultOption;
            return (
              <li key={result}>
                <label
                  className={optionClass}
                  data-field-workflow="result-option"
                  data-field-workflow-result={result}
                  data-field-workflow-result-selected={selected ? "true" : "false"}
                >
                  <input
                    type="radio"
                    name="field-workflow-procedure-result"
                    value={result}
                    checked={selected}
                    disabled={
                      saveState === "saving" ||
                      saveState === "saved" ||
                      saveState === "save_outcome_unknown"
                    }
                    onChange={() => {
                      selectResult(result);
                    }}
                  />
                  <span className={styles.resultLabel}>
                    <span>{labelForProcedureRecordResult(result)}</span>
                    <span className={styles.resultHint}>
                      {hintForProcedureRecordResult(result)}
                    </span>
                  </span>
                </label>
              </li>
            );
          })}
        </ul>
      </section>

      <section className={styles.section} aria-labelledby="field-workflow-clocks-heading">
        <h2 id="field-workflow-clocks-heading" data-field-workflow-visual-role="section-title">
          実施時刻
        </h2>
        <div className={styles.fieldGrid}>
          <label>
            performedAt（Asia/Tokyo）
            <input
              type="datetime-local"
              value={draft.performedAtLocal}
              disabled={
                saveState === "saving" ||
                saveState === "saved" ||
                saveState === "save_outcome_unknown"
              }
              onChange={(event) => {
                updatePerformedAt(event.target.value);
              }}
              data-field-workflow="performed-at-input"
            />
          </label>
          <label>
            補足（任意・作文中心にしない）
            <textarea
              value={draft.note}
              disabled={
                saveState === "saving" ||
                saveState === "saved" ||
                saveState === "save_outcome_unknown"
              }
              onChange={(event) => {
                updateNote(event.target.value);
              }}
              data-field-workflow="procedure-record-note"
            />
          </label>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="field-workflow-save-heading">
        <h2 id="field-workflow-save-heading" data-field-workflow-visual-role="section-title">
          保存
        </h2>
        <p
          className={styles.statusNote}
          role="status"
          data-field-workflow="save-status"
          data-field-workflow-save-state={saveState}
        >
          {labelForShellSaveState(saveState)} — {statusNote}
        </p>
        <div className={styles.outcomeRow} data-field-workflow="synthetic-outcome-controls">
          {(
            [
              ["saved", "合成: 成功"],
              ["save_failed", "合成: 保存失敗"],
              ["save_outcome_unknown", "合成: 結果不明"],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              className={styles.outcomeButton}
              data-field-workflow="synthetic-outcome"
              data-field-workflow-outcome={value}
              data-field-workflow-outcome-selected={saveOutcome === value ? "true" : "false"}
              disabled={saveState === "saving" || saveState === "save_outcome_unknown"}
              onClick={() => {
                setSaveOutcome(value);
              }}
            >
              {label}
            </button>
          ))}
        </div>
        <div className={styles.actionRow}>
          <button
            type="button"
            className={styles.saveButton}
            data-field-workflow="procedure-record-save"
            disabled={!saveEnabled}
            aria-disabled={!saveEnabled ? "true" : undefined}
            onClick={handleSave}
          >
            記録を保存（合成）
          </button>
        </div>
      </section>
    </section>
  );
};
