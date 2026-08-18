import * as React from "react";
import { SaveStateBadge } from "../ux/SaveStateBadge";
import { DEMO_LIVE_WRITE_HOLD_SAVE_NOTE, demoHoldSaveStatusNote } from "../ux/demo-save-hold-copy";
import {
  descriptionForShellSaveState,
  labelForShellSaveState,
  type ShellSaveState,
} from "../ux/save-state";
import {
  presentNextActionableOccurrenceCta,
  type NextActionableOccurrenceItem,
} from "./next-actionable-occurrence";
import {
  FIELD_WORKFLOW_CONTEXT_HANDOFF_NOTE,
  FIELD_WORKFLOW_MUTATION_BOUNDARY_NOTE,
  FIELD_WORKFLOW_SAVE_FAILED_RETAIN_NOTE,
  FIELD_WORKFLOW_SAVE_OUTCOME_UNKNOWN_NOTE,
  hintForProcedureRecordResult,
  labelForProcedureRecordResult,
} from "./procedure-copy";
import {
  FIELD_WORKFLOW_RECORDER_SUBJECT_ID,
  FIELD_WORKFLOW_UI_SLICE,
  VP4_WORKFLOW_SLICE,
} from "./procedure-fixture";
import {
  buildStaffProcedureRecordCreateInput,
  nowAsiaTokyoIsoDateTime,
  persistStaffProcedureRecordFromForm,
  STAFF_PROCEDURE_RECORD_LIVE_WRITE_HOLD_PORT,
  type ProcedureRecordPersistencePort,
} from "./procedure-record-persist";
import {
  canRetryProcedureRecordSave,
  createEmptyProcedureRecordDraft,
  createProcedureRecordSaveInFlightGuard,
  isProcedureRecordDraftReadyToSave,
  retainDraftAfterSaveFailed,
} from "./procedure-record-draft";
import {
  PROCEDURE_RECORD_RESULT_VALUES,
  type ProcedureBindingContext,
  type ProcedureRecordDraft,
  type ProcedureRecordFormSaveSnapshot,
} from "./procedure-types";
import styles from "./ProcedureRecordFormUx.module.scss";

export type ProcedureRecordFormProps = Readonly<{
  context: ProcedureBindingContext;
  headingRef?: React.Ref<HTMLHeadingElement>;
  initialDraft?: ProcedureRecordDraft;
  initialSaveState?: ShellSaveState;
  recordedBy?: string;
  persistPort?: ProcedureRecordPersistencePort;
  nowIso?: () => string | undefined;
  onBackToCurrentProcedure?: () => void;
  onSaveStateChange?: (state: ShellSaveState) => void;
  onDraftSnapshotChange?: (snapshot: ProcedureRecordFormSaveSnapshot) => void;
  /** Unit 6: session-local draft resume is chrome-owned; form only reflects the flag. */
  draftResumeAuthorized?: boolean;
  /** Unit 3: occurrence navigation only when a concrete OccurrenceId is already in context. */
  nextOccurrenceNavigationAuthorized?: boolean;
  todaySupportItems?: readonly NextActionableOccurrenceItem[];
  onNextActionableOccurrence?: () => void;
  onReturnToTodaySupportDayBoard?: () => void;
}>;

/**
 * FIELD-WORKFLOW FW-03 / FW-09 — result-centric ProcedureRecord input.
 * Save goes through persistProcedureRecord. LIVE WRITE remains HOLD.
 */
export const ProcedureRecordForm: React.FC<ProcedureRecordFormProps> = ({
  context,
  headingRef,
  initialDraft,
  initialSaveState = "unsaved",
  recordedBy = FIELD_WORKFLOW_RECORDER_SUBJECT_ID,
  persistPort = STAFF_PROCEDURE_RECORD_LIVE_WRITE_HOLD_PORT,
  nowIso = (): string | undefined => nowAsiaTokyoIsoDateTime() ?? undefined,
  onBackToCurrentProcedure,
  onSaveStateChange,
  onDraftSnapshotChange,
  draftResumeAuthorized = false,
  nextOccurrenceNavigationAuthorized = false,
  todaySupportItems,
  onNextActionableOccurrence,
  onReturnToTodaySupportDayBoard,
}) => {
  const [draft, setDraft] = React.useState<ProcedureRecordDraft>(
    () => initialDraft ?? createEmptyProcedureRecordDraft(),
  );
  const [saveState, setSaveState] = React.useState<ShellSaveState>(initialSaveState);
  const saveInFlight = React.useRef(createProcedureRecordSaveInFlightGuard());
  const frozenRecordedAtRef = React.useRef<string | undefined>(undefined);

  const emitSnapshot = (nextDraft: ProcedureRecordDraft, nextSave: ShellSaveState): void => {
    if (onDraftSnapshotChange) {
      onDraftSnapshotChange({
        saveState: nextSave,
        draft: nextDraft,
        context,
      });
    }
  };

  const setSaveStateAndNotify = (
    next: ShellSaveState,
    nextDraft: ProcedureRecordDraft = draft,
  ): void => {
    setSaveState(next);
    if (onSaveStateChange) {
      onSaveStateChange(next);
    }
    emitSnapshot(nextDraft, next);
  };

  const unlockForEdit = (): boolean => {
    return saveState !== "saving" && saveState !== "saved" && saveState !== "save_outcome_unknown";
  };

  const selectResult = (result: ProcedureRecordDraft["result"]): void => {
    if (!unlockForEdit() || result === undefined) {
      return;
    }
    frozenRecordedAtRef.current = undefined;
    const nextDraft = { ...draft, result };
    setDraft(nextDraft);
    if (saveState === "save_failed") {
      setSaveStateAndNotify("unsaved", nextDraft);
      return;
    }
    emitSnapshot(nextDraft, saveState);
  };

  const updatePerformedAt = (value: string): void => {
    if (!unlockForEdit()) {
      return;
    }
    frozenRecordedAtRef.current = undefined;
    const nextDraft = { ...draft, performedAtLocal: value };
    setDraft(nextDraft);
    if (saveState === "save_failed") {
      setSaveStateAndNotify("unsaved", nextDraft);
      return;
    }
    emitSnapshot(nextDraft, saveState);
  };

  const updateNote = (value: string): void => {
    if (!unlockForEdit()) {
      return;
    }
    const nextDraft = { ...draft, note: value };
    setDraft(nextDraft);
    if (saveState === "save_failed") {
      setSaveStateAndNotify("unsaved", nextDraft);
      return;
    }
    emitSnapshot(nextDraft, saveState);
  };

  const handleSave = (): void => {
    if (!FIELD_WORKFLOW_UI_SLICE.procedureRecordPersistAuthorized) {
      return;
    }
    if (!isProcedureRecordDraftReadyToSave(draft) || !canRetryProcedureRecordSave(saveState)) {
      return;
    }
    if (!saveInFlight.current.tryBegin()) {
      return;
    }

    setSaveStateAndNotify("saving");

    const runSave = async (): Promise<void> => {
      try {
        const clock = frozenRecordedAtRef.current ?? nowIso() ?? "";
        if (clock.length > 0 && frozenRecordedAtRef.current === undefined) {
          frozenRecordedAtRef.current = clock;
        }
        const result = await persistStaffProcedureRecordFromForm(
          buildStaffProcedureRecordCreateInput({
            context,
            draft,
            recordedBy,
            recordedAtIso: frozenRecordedAtRef.current,
            nowIso: clock,
          }),
          persistPort,
        );
        const retained = retainDraftAfterSaveFailed(draft);
        setDraft(retained);
        saveInFlight.current.end();
        setSaveStateAndNotify(result.saveState, retained);
      } catch {
        const retained = retainDraftAfterSaveFailed(draft);
        setDraft(retained);
        saveInFlight.current.end();
        setSaveStateAndNotify("save_failed", retained);
      }
    };
    runSave().then(
      () => undefined,
      () => undefined,
    );
  };

  const saveEnabled =
    FIELD_WORKFLOW_UI_SLICE.procedureRecordPersistAuthorized &&
    isProcedureRecordDraftReadyToSave(draft) &&
    canRetryProcedureRecordSave(saveState) &&
    !saveInFlight.current.isInFlight();

  const nextOccurrenceCta = presentNextActionableOccurrenceCta({
    authorized: nextOccurrenceNavigationAuthorized,
    occurrenceId: context.occurrenceId,
    saveState,
    items: todaySupportItems ?? [],
  });

  const liveWriteHold = persistPort === STAFF_PROCEDURE_RECORD_LIVE_WRITE_HOLD_PORT;
  const holdSaveNote = demoHoldSaveStatusNote(saveState, liveWriteHold);
  const statusNote =
    holdSaveNote ??
    (saveState === "save_failed"
      ? FIELD_WORKFLOW_SAVE_FAILED_RETAIN_NOTE
      : saveState === "save_outcome_unknown"
        ? FIELD_WORKFLOW_SAVE_OUTCOME_UNKNOWN_NOTE
        : descriptionForShellSaveState(saveState));
  const mutationBoundaryNote = liveWriteHold
    ? DEMO_LIVE_WRITE_HOLD_SAVE_NOTE
    : FIELD_WORKFLOW_MUTATION_BOUNDARY_NOTE;

  return (
    <section
      className={styles.procedureRecordForm}
      data-field-workflow="procedure-record-form"
      data-field-workflow-save-path="persistProcedureRecord"
      data-field-workflow-slice={FIELD_WORKFLOW_UI_SLICE.id}
      data-field-workflow-visual-polish={VP4_WORKFLOW_SLICE.id}
      data-field-workflow-user={context.userId}
      data-field-workflow-plan-id={context.planId}
      data-field-workflow-plan-version={String(context.planVersion)}
      data-field-workflow-procedure-id={context.procedureId}
      data-field-workflow-procedure-version={context.procedureVersion}
      data-field-workflow-occurrence-id={context.occurrenceId ?? ""}
      data-field-workflow-save-state={saveState}
      data-field-workflow-demo-save-hold={liveWriteHold ? "true" : "false"}
      data-field-staff-draft-resume={draftResumeAuthorized ? "true" : "false"}
      aria-labelledby="field-workflow-procedure-record-heading"
    >
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
      <p className={styles.contextLine} data-field-workflow="procedure-record-person">
        {context.personLabel}
      </p>
      <p className={styles.hint} data-field-workflow="context-handoff-note">
        {FIELD_WORKFLOW_CONTEXT_HANDOFF_NOTE}
      </p>
      <p className={styles.hint} data-field-workflow="mutation-boundary-note">
        {mutationBoundaryNote}
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
          {context.occurrenceId ? (
            <div data-field-workflow="binding-occurrence-id">
              OccurrenceId: {context.occurrenceId}
            </div>
          ) : null}
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
            実施時刻（Asia/Tokyo）
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
        <div
          className={styles.saveStatusBlock}
          data-field-workflow="save-status"
          data-field-workflow-save-state={saveState}
          data-field-workflow-demo-save-hold={liveWriteHold ? "true" : "false"}
        >
          <SaveStateBadge state={saveState} />
          <p className={styles.statusNote} role="status">
            {labelForShellSaveState(saveState)} — {statusNote}
          </p>
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
            記録を保存
          </button>
          {nextOccurrenceCta.visible ? (
            <button
              type="button"
              className={styles.nextOccurrenceButton}
              data-field-workflow="next-actionable-occurrence"
              data-field-workflow-next-action={nextOccurrenceCta.action}
              data-field-workflow-next-occurrence-id={nextOccurrenceCta.nextOccurrenceId ?? ""}
              disabled={!nextOccurrenceCta.enabled}
              aria-disabled={!nextOccurrenceCta.enabled ? "true" : undefined}
              aria-describedby={nextOccurrenceCta.reason ? nextOccurrenceCta.reasonId : undefined}
              onClick={() => {
                if (!nextOccurrenceCta.enabled) {
                  return;
                }
                if (
                  nextOccurrenceCta.action === "current_procedure" &&
                  onNextActionableOccurrence
                ) {
                  onNextActionableOccurrence();
                  return;
                }
                if (
                  nextOccurrenceCta.action === "today_support_day_board" &&
                  onReturnToTodaySupportDayBoard
                ) {
                  onReturnToTodaySupportDayBoard();
                }
              }}
            >
              {nextOccurrenceCta.label}
            </button>
          ) : null}
        </div>
        {nextOccurrenceCta.visible && nextOccurrenceCta.reason ? (
          <p id={nextOccurrenceCta.reasonId} className={styles.hint}>
            {nextOccurrenceCta.reason}
          </p>
        ) : null}
      </section>
    </section>
  );
};
