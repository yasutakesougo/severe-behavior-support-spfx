import * as React from "react";
import { SaveStateBadge } from "../ux/SaveStateBadge";
import {
  descriptionForShellSaveState,
  labelForShellSaveState,
  type ShellSaveState,
} from "../ux/save-state";
import {
  FIELD_WORKFLOW_SAVE_FAILED_RETAIN_NOTE,
  FIELD_WORKFLOW_SAVE_OUTCOME_UNKNOWN_NOTE,
} from "./procedure-copy";
import {
  buildStaffProcedureRecordCancellationSaveInput,
  nowAsiaTokyoIsoDateTime,
  persistStaffProcedureRecordCancellationFromForm,
  STAFF_PROCEDURE_RECORD_CANCELLATION_IN_MEMORY_PORT,
  type ProcedureRecordCancellationPersistencePort,
} from "./procedure-cancellation-persist";
import {
  FIELD_STAFF_CANCELLATION_UI_SAVE_WIRING_1_SLICE,
  type ProcedureCancellationPresentation,
} from "./procedure-cancellation";
import { FIELD_WORKFLOW_RECORDER_SUBJECT_ID } from "./procedure-fixture";
import { createProcedureRecordSaveInFlightGuard } from "./procedure-record-draft";
import styles from "./ProcedureRecordCancellationUx.module.scss";

export type ProcedureRecordCancellationProps = Readonly<{
  presentation: ProcedureCancellationPresentation;
  headingRef?: React.Ref<HTMLHeadingElement>;
  onBackToCurrentProcedure?: () => void;
  onSaveStateChange?: (state: ShellSaveState) => void;
  onCancelled?: (occurrenceId: string) => void;
  persistPort?: ProcedureRecordCancellationPersistencePort;
  cancelledBy?: string;
  nowIso?: () => string | undefined;
  initialSaveState?: ShellSaveState;
}>;

function hasUnsupportedControlCharacters(value: string): boolean {
  // eslint-disable-next-line no-control-regex -- fail-closed input validation
  return /[\u0000-\u001F\u007F-\u009F]/.test(value);
}

function isReasonValid(reason: string): boolean {
  return reason.length > 0 && reason === reason.trim() && !hasUnsupportedControlCharacters(reason);
}

function canRetryCancellationSave(saveState: ShellSaveState): boolean {
  return saveState !== "saving" && saveState !== "saved" && saveState !== "save_outcome_unknown";
}

export const ProcedureRecordCancellation: React.FC<ProcedureRecordCancellationProps> = ({
  presentation,
  headingRef,
  onBackToCurrentProcedure,
  onSaveStateChange,
  onCancelled,
  persistPort = STAFF_PROCEDURE_RECORD_CANCELLATION_IN_MEMORY_PORT,
  cancelledBy = FIELD_WORKFLOW_RECORDER_SUBJECT_ID,
  nowIso = (): string | undefined => nowAsiaTokyoIsoDateTime() ?? undefined,
  initialSaveState = "unsaved",
}) => {
  const [reason, setReason] = React.useState("");
  const [saveState, setSaveState] = React.useState<ShellSaveState>(initialSaveState);
  const [confirming, setConfirming] = React.useState(false);
  const [submittedLifecycleEventId, setSubmittedLifecycleEventId] = React.useState<string | null>(
    null,
  );
  const saveInFlight = React.useRef(createProcedureRecordSaveInFlightGuard());
  const frozenSubmissionRef = React.useRef<
    | {
        reason: string;
        recordedAtIso: string;
      }
    | undefined
  >(undefined);

  const setSaveStateAndNotify = (next: ShellSaveState): void => {
    setSaveState(next);
    onSaveStateChange?.(next);
  };

  const editingLocked =
    saveState === "saving" || saveState === "saved" || saveState === "save_outcome_unknown";
  const reasonValid = isReasonValid(reason);
  const canProceedToConfirm = reasonValid && canRetryCancellationSave(saveState) && !editingLocked;
  const canSubmit =
    confirming &&
    canProceedToConfirm &&
    !saveInFlight.current.isInFlight() &&
    !submittedLifecycleEventId;

  const statusNote =
    saveState === "save_failed"
      ? FIELD_WORKFLOW_SAVE_FAILED_RETAIN_NOTE
      : saveState === "save_outcome_unknown"
        ? FIELD_WORKFLOW_SAVE_OUTCOME_UNKNOWN_NOTE
        : descriptionForShellSaveState(saveState);

  const submitDisabledReason = !reasonValid
    ? "取消理由を入力してください（先頭/末尾スペース不可）。"
    : !confirming
      ? "まず「記録を取り消す」を押して確認に進んでください。"
      : saveState === "saving"
        ? "保存中は実行できません。"
        : saveState === "saved"
          ? "この記録はすでに取消済みです。"
          : saveState === "save_outcome_unknown"
            ? "保存結果不明のため、即時再送できません。"
            : saveInFlight.current.isInFlight()
              ? "送信中です。"
              : undefined;

  const handleBeginConfirm = (): void => {
    if (!canProceedToConfirm || submittedLifecycleEventId) {
      return;
    }
    setConfirming(true);
  };

  const handleSubmit = (): void => {
    if (!canSubmit) {
      return;
    }
    if (!saveInFlight.current.tryBegin()) {
      return;
    }

    setSaveStateAndNotify("saving");

    const runSave = async (): Promise<void> => {
      try {
        const now = nowIso() ?? "";
        const frozen = frozenSubmissionRef.current;
        const payload =
          frozen ??
          (now.length > 0
            ? {
                reason,
                recordedAtIso: now,
              }
            : undefined);
        if (payload === undefined) {
          saveInFlight.current.end();
          setSaveStateAndNotify("save_failed");
          return;
        }
        if (!frozenSubmissionRef.current) {
          frozenSubmissionRef.current = payload;
        }

        const result = await persistStaffProcedureRecordCancellationFromForm(
          buildStaffProcedureRecordCancellationSaveInput({
            presentation,
            reason: payload.reason,
            cancelledBy,
            recordedAtIso: payload.recordedAtIso,
            nowIso: payload.recordedAtIso,
          }),
          persistPort,
        );
        saveInFlight.current.end();

        if (result.saveState === "saved" && result.event) {
          setSubmittedLifecycleEventId(result.event.LifecycleEventId);
          onCancelled?.(presentation.occurrenceId);
        }
        setSaveStateAndNotify(result.saveState);
      } catch {
        saveInFlight.current.end();
        setSaveStateAndNotify("save_failed");
      }
    };

    runSave().then(
      () => undefined,
      () => undefined,
    );
  };

  return (
    <section
      className={styles.cancellation}
      data-field-workflow="procedure-record-cancellation"
      data-field-workflow-cancellation-slice={FIELD_STAFF_CANCELLATION_UI_SAVE_WIRING_1_SLICE.id}
      data-field-workflow-save-state={saveState}
      aria-labelledby="field-workflow-procedure-cancellation-heading"
    >
      <h1
        id="field-workflow-procedure-cancellation-heading"
        ref={headingRef}
        tabIndex={-1}
        className={styles.heading}
      >
        記録の取り消し確認
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

      <section className={styles.section} aria-labelledby="procedure-cancellation-target-heading">
        <h2 id="procedure-cancellation-target-heading">取り消し対象</h2>
        <dl className={styles.detailList}>
          <div>
            <dt>利用者</dt>
            <dd>{presentation.personLabel}</dd>
          </div>
          <div>
            <dt>予定時刻/活動</dt>
            <dd>{`${presentation.scheduledTime} / ${presentation.activityLabel}`}</dd>
          </div>
          <div>
            <dt>現在状態</dt>
            <dd>{submittedLifecycleEventId ? "取消済み" : presentation.occurrenceStatus}</dd>
          </div>
          <div>
            <dt>現在の結果</dt>
            <dd>{presentation.resultLabel}</dd>
          </div>
          <div>
            <dt>RecordId</dt>
            <dd>{presentation.recordId}</dd>
          </div>
        </dl>
      </section>

      <section className={styles.section} aria-labelledby="procedure-cancellation-reason-heading">
        <h2 id="procedure-cancellation-reason-heading">取消理由（必須）</h2>
        <label className={styles.reasonLabel} htmlFor="procedure-cancellation-reason-input">
          理由を入力
        </label>
        <textarea
          id="procedure-cancellation-reason-input"
          value={reason}
          disabled={editingLocked}
          onChange={(event) => {
            if (editingLocked) {
              return;
            }
            frozenSubmissionRef.current = undefined;
            setConfirming(false);
            setReason(event.target.value);
            if (saveState === "save_failed") {
              setSaveStateAndNotify("unsaved");
            }
          }}
          data-field-workflow="procedure-cancellation-reason-input"
          aria-invalid={reason.length > 0 && !reasonValid ? "true" : undefined}
        />
        {reason.length > 0 && !reasonValid ? (
          <p
            className={styles.validation}
            data-field-workflow="procedure-cancellation-reason-error"
          >
            取消理由は空白のみ不可・先頭末尾空白不可・制御文字不可です。
          </p>
        ) : null}
      </section>

      <section className={styles.section} aria-labelledby="procedure-cancellation-confirm-heading">
        <h2 id="procedure-cancellation-confirm-heading">確認と保存</h2>
        <div className={styles.saveStatusBlock}>
          <SaveStateBadge state={saveState} />
          <p id="procedure-cancellation-action-status" className={styles.statusNote} role="status">
            {labelForShellSaveState(saveState)} — {statusNote}
          </p>
          {submitDisabledReason ? (
            <p className={styles.statusNote}>{submitDisabledReason}</p>
          ) : null}
        </div>

        <div className={styles.actionRow}>
          <button
            type="button"
            className={styles.primaryButton}
            disabled={!canProceedToConfirm || Boolean(submittedLifecycleEventId)}
            aria-disabled={!canProceedToConfirm || submittedLifecycleEventId ? "true" : undefined}
            data-field-workflow="procedure-cancellation-open-confirm"
            onClick={handleBeginConfirm}
          >
            記録を取り消す
          </button>
          <button
            type="button"
            className={styles.dangerButton}
            disabled={!canSubmit}
            aria-disabled={!canSubmit ? "true" : undefined}
            aria-describedby="procedure-cancellation-action-status"
            data-field-workflow="procedure-cancellation-confirm-submit"
            onClick={handleSubmit}
          >
            この記録を取り消して確定
          </button>
        </div>
      </section>

      {submittedLifecycleEventId ? (
        <section
          className={styles.section}
          aria-labelledby="procedure-cancellation-submitted-heading"
          data-field-workflow="procedure-cancellation-submitted-summary"
        >
          <h2 id="procedure-cancellation-submitted-heading">取消済み</h2>
          <dl className={styles.detailList}>
            <div>
              <dt>LifecycleEventId</dt>
              <dd>{submittedLifecycleEventId}</dd>
            </div>
            <div>
              <dt>元の記録</dt>
              <dd>元の記録は参照可能なまま保持され、結果は変更しません。</dd>
            </div>
          </dl>
        </section>
      ) : null}
    </section>
  );
};
