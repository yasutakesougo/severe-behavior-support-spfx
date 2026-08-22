import * as React from "react";
import { SaveStateBadge } from "../ux/SaveStateBadge";
import {
  descriptionForShellSaveState,
  labelForShellSaveState,
  type ShellSaveState,
} from "../ux/save-state";
import { formatStaffBusinessDateTime } from "../ux/staff-date-time-presentation";
import {
  FIELD_WORKFLOW_CANCELLATION_PRESENTATION_NOTE,
  FIELD_WORKFLOW_CANCELLATION_REFRESH_NOTE,
  FIELD_WORKFLOW_CANCELLATION_SAVE_BOUNDARY_NOTE,
  FIELD_WORKFLOW_SAVE_FAILED_RETAIN_NOTE,
  FIELD_WORKFLOW_SAVE_OUTCOME_UNKNOWN_NOTE,
} from "./procedure-copy";
import { isOpaqueStaffActorId } from "./vp2-staff-visible-copy";
import { buildFieldStaffCancellationSyntheticAuthorization } from "./procedure-cancellation-auth";
import {
  canConfirmCancellationOutcome,
  canRetryCancellationSave,
  createEmptyCancellationDraft,
  createProcedureRecordSaveInFlightGuard,
  isCancellationDraftReadyToSave,
  retainCancellationDraftAfterSaveFailed,
  type ProcedureCancellationDraft,
} from "./procedure-cancellation-draft";
import {
  FIELD_STAFF_CANCELLATION_UI_SLICE,
  type ProcedureCancellationPresentation,
} from "./procedure-cancellation";
import {
  buildStaffProcedureRecordCancellationSaveInput,
  confirmStaffProcedureRecordCancellationOutcome,
  nowAsiaTokyoIsoDateTime,
  persistStaffProcedureRecordCancellationFromForm,
  STAFF_PROCEDURE_RECORD_CANCELLATION_IN_MEMORY_PORT,
  type ProcedureRecord,
  type ProcedureRecordCancellationPersistencePort,
  type ProcedureRecordCancellationSubmitRequest,
  type ProcedureRecordLifecycleEvent,
} from "./procedure-cancellation-persist";
import styles from "./ProcedureRecordCorrectionUx.module.scss";

export type ProcedureRecordCancellationProps = Readonly<{
  presentation: ProcedureCancellationPresentation;
  originalRecord: ProcedureRecord;
  /** Lifecycle events fed to Slice A/C for this attempt (baseline + session). */
  lifecycleEventsForSemantics: readonly ProcedureRecordLifecycleEvent[];
  headingRef?: React.Ref<HTMLHeadingElement>;
  onBackToCurrentProcedure?: () => void;
  onSaveStateChange?: (state: ShellSaveState) => void;
  /**
   * After Slice C returns saved + CANCEL event, chrome appends to session collection
   * and rebuilds Today Support via existing resolver. Must not set 取消済み from saveState.
   */
  onCancellationPersisted?: (event: ProcedureRecordLifecycleEvent) => void;
  persistPort?: ProcedureRecordCancellationPersistencePort;
  nowIso?: () => string | undefined;
  initialDraft?: ProcedureCancellationDraft;
  initialSaveState?: ShellSaveState;
}>;

/**
 * CANCEL-SLICE-D — FIELD_STAFF cancellation CTA / presentation.
 * Wired to Slice C in-memory fake only. LIVE WRITE / SharePoint remain HOLD.
 */
export const ProcedureRecordCancellation: React.FC<ProcedureRecordCancellationProps> = ({
  presentation,
  originalRecord,
  lifecycleEventsForSemantics,
  headingRef,
  onBackToCurrentProcedure,
  onSaveStateChange,
  onCancellationPersisted,
  persistPort = STAFF_PROCEDURE_RECORD_CANCELLATION_IN_MEMORY_PORT,
  nowIso = (): string | undefined => nowAsiaTokyoIsoDateTime() ?? undefined,
  initialDraft,
  initialSaveState = "unsaved",
}) => {
  const authorization = buildFieldStaffCancellationSyntheticAuthorization({
    organizationId: presentation.organizationId,
    siteId: presentation.siteId,
  });
  const saveWiringActive =
    FIELD_STAFF_CANCELLATION_UI_SLICE.cancellationPersistAuthorized && authorization !== undefined;

  const [draft, setDraft] = React.useState<ProcedureCancellationDraft>(
    () => initialDraft ?? createEmptyCancellationDraft(),
  );
  const [saveState, setSaveState] = React.useState<ShellSaveState>(initialSaveState);
  const [submittedEvent, setSubmittedEvent] = React.useState<ProcedureRecordLifecycleEvent | null>(
    null,
  );
  const saveInFlight = React.useRef(createProcedureRecordSaveInFlightGuard());
  const frozenRecordedAtRef = React.useRef<string | undefined>(undefined);
  const frozenRequestRef = React.useRef<ProcedureRecordCancellationSubmitRequest | undefined>(
    undefined,
  );
  const frozenReasonFingerprintRef = React.useRef<string | undefined>(undefined);

  const setSaveStateAndNotify = (next: ShellSaveState): void => {
    setSaveState(next);
    if (onSaveStateChange) {
      onSaveStateChange(next);
    }
  };

  const unlockForEdit = (): boolean => {
    return saveState !== "saving" && saveState !== "saved" && saveState !== "save_outcome_unknown";
  };

  const updateReason = (value: string): void => {
    if (!unlockForEdit()) {
      return;
    }
    const trimmedFingerprint = value.trim();
    if (frozenReasonFingerprintRef.current !== trimmedFingerprint) {
      frozenRecordedAtRef.current = undefined;
      frozenRequestRef.current = undefined;
      frozenReasonFingerprintRef.current = undefined;
    }
    const nextDraft = { ...draft, reason: value, confirmed: false };
    setDraft(nextDraft);
    if (saveState === "save_failed") {
      setSaveStateAndNotify("unsaved");
    }
  };

  const updateConfirmed = (confirmed: boolean): void => {
    if (!unlockForEdit()) {
      return;
    }
    setDraft({ ...draft, confirmed });
    if (saveState === "save_failed") {
      setSaveStateAndNotify("unsaved");
    }
  };

  const applySaveResult = (
    result: Awaited<ReturnType<typeof persistStaffProcedureRecordCancellationFromForm>>,
  ): void => {
    frozenRequestRef.current = result.request;
    const retained = retainCancellationDraftAfterSaveFailed(draft);
    setDraft(retained);
    saveInFlight.current.end();
    if (result.saveState === "saved" && result.event) {
      setSubmittedEvent(result.event);
      if (onCancellationPersisted) {
        onCancellationPersisted(result.event);
      }
    }
    setSaveStateAndNotify(result.saveState);
  };

  const handleSave = (): void => {
    if (!saveWiringActive || !authorization) {
      return;
    }
    if (!isCancellationDraftReadyToSave(draft) || !canRetryCancellationSave(saveState)) {
      return;
    }
    if (!saveInFlight.current.tryBegin()) {
      return;
    }

    setSaveStateAndNotify("saving");

    const runSave = async (): Promise<void> => {
      try {
        const clock = frozenRecordedAtRef.current ?? nowIso() ?? "";
        if (clock.length === 0) {
          saveInFlight.current.end();
          setSaveStateAndNotify("save_failed");
          return;
        }
        if (frozenRecordedAtRef.current === undefined) {
          frozenRecordedAtRef.current = clock;
          frozenReasonFingerprintRef.current = draft.reason.trim();
        }
        const result = await persistStaffProcedureRecordCancellationFromForm(
          buildStaffProcedureRecordCancellationSaveInput({
            originalRecord,
            draft,
            boundRecordIds: presentation.boundRecordIds,
            lifecycleEvents: lifecycleEventsForSemantics,
            authorization,
            recordedAtIso: frozenRecordedAtRef.current,
          }),
          persistPort,
        );
        applySaveResult(result);
      } catch {
        const retained = retainCancellationDraftAfterSaveFailed(draft);
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

  const handleConfirmOutcome = (): void => {
    if (!canConfirmCancellationOutcome(saveState) || !frozenRequestRef.current) {
      return;
    }
    if (!saveInFlight.current.tryBegin()) {
      return;
    }
    setSaveStateAndNotify("saving");
    const request = frozenRequestRef.current;
    const runConfirm = async (): Promise<void> => {
      try {
        const result = await confirmStaffProcedureRecordCancellationOutcome(request, persistPort);
        applySaveResult(result);
      } catch {
        saveInFlight.current.end();
        setSaveStateAndNotify("save_outcome_unknown");
      }
    };
    runConfirm().then(
      () => undefined,
      () => undefined,
    );
  };

  const saveEnabled =
    saveWiringActive &&
    isCancellationDraftReadyToSave(draft) &&
    canRetryCancellationSave(saveState) &&
    !saveInFlight.current.isInFlight();

  const confirmOutcomeEnabled =
    canConfirmCancellationOutcome(saveState) &&
    frozenRequestRef.current !== undefined &&
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
      data-field-workflow="procedure-record-cancellation"
      data-field-workflow-cancellation-slice={FIELD_STAFF_CANCELLATION_UI_SLICE.id}
      data-field-workflow-save-path={saveWiringActive ? "submitCancellation" : "none"}
      data-field-workflow-save-state={saveState}
      data-field-workflow-occurrence-id={presentation.occurrenceId}
      data-field-workflow-record-id={presentation.recordId}
      aria-labelledby="field-workflow-procedure-cancellation-heading"
    >
      <h1
        id="field-workflow-procedure-cancellation-heading"
        ref={headingRef}
        tabIndex={-1}
        className={styles.heading}
        data-field-workflow="procedure-record-cancellation-heading"
      >
        記録の取消
      </h1>
      <div className={styles.topRow}>
        <button
          type="button"
          className={styles.backButton}
          onClick={onBackToCurrentProcedure}
          disabled={!onBackToCurrentProcedure || saveState === "saving"}
          aria-disabled={!onBackToCurrentProcedure || saveState === "saving" ? "true" : undefined}
          data-field-workflow="procedure-cancellation-back"
        >
          ← 現在の手順
        </button>
      </div>
      <p className={styles.note} data-field-workflow="procedure-cancellation-note">
        {FIELD_WORKFLOW_CANCELLATION_PRESENTATION_NOTE}
      </p>

      <section className={styles.section} aria-labelledby="procedure-cancellation-context-heading">
        <h2 id="procedure-cancellation-context-heading">対象の予定と文脈</h2>
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
            <dd data-field-workflow="cancellation-occurrence-status">
              {presentation.occurrenceStatus}
            </dd>
          </div>
        </dl>
      </section>

      <section className={styles.section} aria-labelledby="procedure-cancellation-record-heading">
        <h2 id="procedure-cancellation-record-heading">取消する記録（確認）</h2>
        <dl className={styles.detailList}>
          <div>
            <dt>結果</dt>
            <dd>{presentation.resultLabel}</dd>
          </div>
          <div>
            <dt>実施時刻</dt>
            <dd>{presentation.performedAtLabel}</dd>
          </div>
          <div>
            <dt>記録時刻</dt>
            <dd>{presentation.recordedAtLabel}</dd>
          </div>
          {!isOpaqueStaffActorId(presentation.recordedBy) ? (
            <div>
              <dt>記録者</dt>
              <dd>{presentation.recordedBy}</dd>
            </div>
          ) : null}
        </dl>
      </section>

      <section className={styles.section} aria-labelledby="procedure-cancellation-reason-heading">
        <h2 id="procedure-cancellation-reason-heading">取消理由（必須）</h2>
        <div className={styles.fieldGrid}>
          <label>
            理由
            <textarea
              value={draft.reason}
              disabled={!unlockForEdit()}
              onChange={(event) => {
                updateReason(event.target.value);
              }}
              data-field-workflow="cancellation-reason-input"
            />
          </label>
          <label data-field-workflow="cancellation-confirm-label">
            <input
              type="checkbox"
              checked={draft.confirmed}
              disabled={!unlockForEdit() || draft.reason.trim().length === 0}
              onChange={(event) => {
                updateConfirmed(event.target.checked);
              }}
              data-field-workflow="cancellation-confirm-input"
            />{" "}
            対象記録と理由を確認し、取消を実行します（記録は削除しません）
          </label>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="procedure-cancellation-boundary-heading">
        <h2 id="procedure-cancellation-boundary-heading">保存</h2>
        <p className={styles.note}>{FIELD_WORKFLOW_CANCELLATION_SAVE_BOUNDARY_NOTE}</p>
        {saveWiringActive ? (
          <>
            <div
              className={styles.saveStatusBlock}
              data-field-workflow="cancellation-save-status"
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
              data-field-workflow="procedure-cancellation-save"
              onClick={handleSave}
            >
              取消を保存
            </button>
            {saveState === "save_outcome_unknown" ? (
              <button
                type="button"
                className={styles.saveButton}
                disabled={!confirmOutcomeEnabled}
                aria-disabled={!confirmOutcomeEnabled ? "true" : undefined}
                data-field-workflow="procedure-cancellation-confirm-outcome"
                onClick={handleConfirmOutcome}
              >
                結果を確認
              </button>
            ) : null}
          </>
        ) : (
          <button
            type="button"
            className={styles.disabledAction}
            disabled
            aria-disabled="true"
            data-field-workflow="procedure-cancellation-save-disabled"
          >
            取消を保存する（権限入力不足）
          </button>
        )}
      </section>

      {submittedEvent ? (
        <section
          className={styles.section}
          aria-labelledby="procedure-cancellation-submitted-heading"
          data-field-workflow="cancellation-submitted-summary"
        >
          <h2 id="procedure-cancellation-submitted-heading">提出済みの取消イベント</h2>
          <dl className={styles.detailList}>
            <div>
              <dt>記録時刻</dt>
              <dd>{formatStaffBusinessDateTime(submittedEvent.recordedAt)}</dd>
            </div>
            {!isOpaqueStaffActorId(submittedEvent.recordedBy) ? (
              <div>
                <dt>記録者</dt>
                <dd>{submittedEvent.recordedBy}</dd>
              </div>
            ) : null}
            <div>
              <dt>理由</dt>
              <dd>{submittedEvent.reason ?? ""}</dd>
            </div>
          </dl>
          <p className={styles.note} data-field-workflow="cancellation-refresh-note">
            {FIELD_WORKFLOW_CANCELLATION_REFRESH_NOTE}
          </p>
        </section>
      ) : null}
    </section>
  );
};
