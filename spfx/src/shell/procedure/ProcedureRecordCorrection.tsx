import * as React from "react";
import { SaveStateBadge } from "../ux/SaveStateBadge";
import {
  descriptionForShellSaveState,
  labelForShellSaveState,
  type ShellSaveState,
} from "../ux/save-state";
import {
  FIELD_WORKFLOW_CORRECTION_PRESENTATION_NOTE,
  FIELD_WORKFLOW_CORRECTION_SAVE_BOUNDARY_NOTE,
  FIELD_WORKFLOW_SAVE_FAILED_RETAIN_NOTE,
  FIELD_WORKFLOW_SAVE_OUTCOME_UNKNOWN_NOTE,
  hintForProcedureRecordResult,
  labelForProcedureRecordResult,
} from "./procedure-copy";
import {
  buildStaffProcedureRecordCorrectionSaveInput,
  nowAsiaTokyoIsoDateTime,
  persistStaffProcedureRecordCorrectionFromForm,
  STAFF_PROCEDURE_RECORD_CORRECTION_IN_MEMORY_PORT,
  type ProcedureRecordCorrectionPersistencePort,
} from "./procedure-correction-persist";
import type {
  ProcedureRecordCorrection as SubmittedCorrection,
  ProcedureRecordCorrectionOriginalBinding,
} from "../../sbs-domain/correction-persist.bundle";
import {
  canRetryCorrectionSave,
  createCorrectionDraftFromRecord,
  createProcedureRecordSaveInFlightGuard,
  isCorrectionDraftReadyToSave,
  retainCorrectionDraftAfterSaveFailed,
  type ProcedureCorrectionDraft,
} from "./procedure-correction-draft";
import {
  FIELD_STAFF_CORRECTION_UI_SAVE_WIRING_1_SLICE,
  FIELD_STAFF_PHASE8_CORRECTION_1_SLICE,
  type ProcedureCorrectionPresentation,
} from "./procedure-correction";
import { FIELD_WORKFLOW_RECORDER_SUBJECT_ID } from "./procedure-fixture";
import { PROCEDURE_RECORD_RESULT_VALUES } from "./procedure-types";
import styles from "./ProcedureRecordCorrectionUx.module.scss";

export type ProcedureRecordCorrectionProps = Readonly<{
  presentation: ProcedureCorrectionPresentation;
  originalBinding?: ProcedureRecordCorrectionOriginalBinding;
  headingRef?: React.Ref<HTMLHeadingElement>;
  onBackToCurrentProcedure?: () => void;
  onSaveStateChange?: (state: ShellSaveState) => void;
  persistPort?: ProcedureRecordCorrectionPersistencePort;
  correctedBy?: string;
  nowIso?: () => string | undefined;
  initialDraft?: ProcedureCorrectionDraft;
  initialSaveState?: ShellSaveState;
}>;

/**
 * FIELD-STAFF-PHASE8-CORRECTION-1 + FIELD-STAFF-CORRECTION-UI-SAVE-WIRING-SLICE-1.
 * Editable correction form wired to in-memory fake append-only port.
 */
export const ProcedureRecordCorrection: React.FC<ProcedureRecordCorrectionProps> = ({
  presentation,
  originalBinding,
  headingRef,
  onBackToCurrentProcedure,
  onSaveStateChange,
  persistPort = STAFF_PROCEDURE_RECORD_CORRECTION_IN_MEMORY_PORT,
  correctedBy = FIELD_WORKFLOW_RECORDER_SUBJECT_ID,
  nowIso = (): string | undefined => nowAsiaTokyoIsoDateTime() ?? undefined,
  initialDraft,
  initialSaveState = "unsaved",
}) => {
  const saveWiringActive =
    FIELD_STAFF_CORRECTION_UI_SAVE_WIRING_1_SLICE.correctionSaveWiringAuthorized &&
    originalBinding !== undefined;

  const [draft, setDraft] = React.useState<ProcedureCorrectionDraft>(() => {
    if (initialDraft) {
      return initialDraft;
    }
    return createCorrectionDraftFromRecord({
      result: presentation.result,
      performedAt: presentation.performedAt,
    });
  });
  const [saveState, setSaveState] = React.useState<ShellSaveState>(initialSaveState);
  const [submittedCorrection, setSubmittedCorrection] = React.useState<SubmittedCorrection | null>(
    null,
  );
  const saveInFlight = React.useRef(createProcedureRecordSaveInFlightGuard());
  const frozenCorrectedAtRef = React.useRef<string | undefined>(undefined);

  const setSaveStateAndNotify = (next: ShellSaveState): void => {
    setSaveState(next);
    if (onSaveStateChange) {
      onSaveStateChange(next);
    }
  };

  const unlockForEdit = (): boolean => {
    return saveState !== "saving" && saveState !== "saved" && saveState !== "save_outcome_unknown";
  };

  const selectResult = (result: ProcedureCorrectionDraft["result"]): void => {
    if (!unlockForEdit() || result === undefined) {
      return;
    }
    frozenCorrectedAtRef.current = undefined;
    const nextDraft = { ...draft, result };
    setDraft(nextDraft);
    if (saveState === "save_failed") {
      setSaveStateAndNotify("unsaved");
    }
  };

  const updatePerformedAt = (value: string): void => {
    if (!unlockForEdit()) {
      return;
    }
    frozenCorrectedAtRef.current = undefined;
    const nextDraft = { ...draft, performedAtLocal: value };
    setDraft(nextDraft);
    if (saveState === "save_failed") {
      setSaveStateAndNotify("unsaved");
    }
  };

  const updateReason = (value: string): void => {
    if (!unlockForEdit()) {
      return;
    }
    const nextDraft = { ...draft, reason: value };
    setDraft(nextDraft);
    if (saveState === "save_failed") {
      setSaveStateAndNotify("unsaved");
    }
  };

  const handleSave = (): void => {
    if (!saveWiringActive || !originalBinding) {
      return;
    }
    if (
      !isCorrectionDraftReadyToSave(draft, originalBinding.originalLocalDate) ||
      !canRetryCorrectionSave(saveState)
    ) {
      return;
    }
    if (!saveInFlight.current.tryBegin()) {
      return;
    }

    setSaveStateAndNotify("saving");

    const runSave = async (): Promise<void> => {
      try {
        const clock = frozenCorrectedAtRef.current ?? nowIso() ?? "";
        if (clock.length > 0 && frozenCorrectedAtRef.current === undefined) {
          frozenCorrectedAtRef.current = clock;
        }
        const result = await persistStaffProcedureRecordCorrectionFromForm(
          buildStaffProcedureRecordCorrectionSaveInput({
            originalBinding,
            draft,
            correctedBy,
            correctedAtIso: frozenCorrectedAtRef.current,
            nowIso: clock,
          }),
          persistPort,
        );
        const retained = retainCorrectionDraftAfterSaveFailed(draft);
        setDraft(retained);
        saveInFlight.current.end();
        if (result.saveState === "saved" && result.correction) {
          setSubmittedCorrection(result.correction);
        }
        setSaveStateAndNotify(result.saveState);
      } catch {
        const retained = retainCorrectionDraftAfterSaveFailed(draft);
        setDraft(retained);
        saveInFlight.current.end();
        setSaveStateAndNotify("save_failed");
      }
    };
    runSave().then(
      () => undefined,
      () => undefined,
    );
  };

  const saveEnabled =
    saveWiringActive &&
    originalBinding !== undefined &&
    isCorrectionDraftReadyToSave(draft, originalBinding.originalLocalDate) &&
    canRetryCorrectionSave(saveState) &&
    !saveInFlight.current.isInFlight();

  const statusNote =
    saveState === "save_failed"
      ? FIELD_WORKFLOW_SAVE_FAILED_RETAIN_NOTE
      : saveState === "save_outcome_unknown"
        ? FIELD_WORKFLOW_SAVE_OUTCOME_UNKNOWN_NOTE
        : descriptionForShellSaveState(saveState);

  return (
    <section
      className={styles.correction}
      data-field-workflow="procedure-record-correction"
      data-field-workflow-correction-slice={FIELD_STAFF_PHASE8_CORRECTION_1_SLICE.id}
      data-field-workflow-save-wiring-slice={FIELD_STAFF_CORRECTION_UI_SAVE_WIRING_1_SLICE.id}
      data-field-workflow-save-path={saveWiringActive ? "submitCorrection" : "none"}
      data-field-workflow-save-state={saveState}
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
          disabled={!onBackToCurrentProcedure || saveState === "saving"}
          aria-disabled={!onBackToCurrentProcedure || saveState === "saving" ? "true" : undefined}
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
            <dd><code className={styles.idValue}>{presentation.occurrenceId}</code></dd>
          </div>
          <div>
            <dt>手順</dt>
            <dd><code className={styles.idValue}>{`${presentation.procedureId} (${presentation.procedureVersion})`}</code></dd>
          </div>
          <div>
            <dt>計画版</dt>
            <dd><code className={styles.idValue}>{`${presentation.planId} / 版 ${presentation.planVersion}`}</code></dd>
          </div>
        </dl>
      </section>

      <section className={styles.section} aria-labelledby="procedure-correction-record-heading">
        <h2 id="procedure-correction-record-heading">元の記録</h2>
        <dl className={styles.detailList}>
          <div>
            <dt>RecordId</dt>
            <dd><code className={styles.idValue}>{presentation.recordId}</code></dd>
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

      <section className={styles.section} aria-labelledby="procedure-correction-edit-heading">
        <h2 id="procedure-correction-edit-heading">訂正内容</h2>
        <ul className={styles.resultList} role="radiogroup" aria-label="訂正後の結果">
          {PROCEDURE_RECORD_RESULT_VALUES.map((result) => {
            const selected = draft.result === result;
            const optionClass = selected
              ? `${styles.resultOption} ${styles.resultOptionSelected}`
              : styles.resultOption;
            return (
              <li key={result}>
                <label
                  className={optionClass}
                  data-field-workflow="correction-result-option"
                  data-field-workflow-result={result}
                  data-field-workflow-result-selected={selected ? "true" : "false"}
                >
                  <input
                    type="radio"
                    name="field-workflow-correction-result"
                    value={result}
                    checked={selected}
                    disabled={!unlockForEdit()}
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
        <div className={styles.fieldGrid}>
          <label>
            実施時刻（Asia/Tokyo）
            <input
              type="datetime-local"
              value={draft.performedAtLocal}
              disabled={!unlockForEdit()}
              onChange={(event) => {
                updatePerformedAt(event.target.value);
              }}
              data-field-workflow="correction-performed-at-input"
            />
          </label>
          <label>
            訂正理由（必須）
            <textarea
              value={draft.reason}
              disabled={!unlockForEdit()}
              onChange={(event) => {
                updateReason(event.target.value);
              }}
              data-field-workflow="correction-reason-input"
            />
          </label>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="procedure-correction-boundary-heading">
        <h2 id="procedure-correction-boundary-heading">保存</h2>
        <p className={styles.note}>{FIELD_WORKFLOW_CORRECTION_SAVE_BOUNDARY_NOTE}</p>
        {saveWiringActive ? (
          <>
            <div
              className={styles.saveStatusBlock}
              data-field-workflow="correction-save-status"
              data-field-workflow-save-state={saveState}
            >
              <SaveStateBadge state={saveState} />
              <p className={styles.statusNote} role="status">
                {labelForShellSaveState(saveState)} — {statusNote}
              </p>
            </div>
            <button
              type="button"
              className={styles.saveButton}
              disabled={!saveEnabled}
              aria-disabled={!saveEnabled ? "true" : undefined}
              data-field-workflow="procedure-correction-save"
              onClick={handleSave}
            >
              訂正を保存
            </button>
          </>
        ) : (
          <button
            type="button"
            className={styles.disabledAction}
            disabled
            aria-disabled="true"
            data-field-workflow="procedure-correction-save-disabled"
          >
            訂正を保存する（未接続）
          </button>
        )}
      </section>

      {submittedCorrection ? (
        <section
          className={styles.section}
          aria-labelledby="procedure-correction-submitted-heading"
          data-field-workflow="correction-submitted-summary"
        >
          <h2 id="procedure-correction-submitted-heading">提出済みの訂正</h2>
          <dl className={styles.detailList}>
            <div>
              <dt>CorrectionId</dt>
              <dd><code className={styles.idValue}>{submittedCorrection.CorrectionId}</code></dd>
            </div>
            <div>
              <dt>訂正時刻</dt>
              <dd>{submittedCorrection.correctedAt}</dd>
            </div>
            <div>
              <dt>訂正者</dt>
              <dd>{submittedCorrection.correctedBy}</dd>
            </div>
            <div>
              <dt>結果</dt>
              <dd>{labelForProcedureRecordResult(submittedCorrection.result as never)}</dd>
            </div>
            <div>
              <dt>実施時刻</dt>
              <dd>{submittedCorrection.performedAt}</dd>
            </div>
            <div>
              <dt>理由</dt>
              <dd>{submittedCorrection.reason}</dd>
            </div>
          </dl>
        </section>
      ) : null}
    </section>
  );
};
