import * as React from "react";
import type { TodaySupportItem } from "../../sbs-domain/kiosk-read-model.bundle";

import { StatusBadge } from "../primitives";
import styles from "./TodaySupportDayBoardUx.module.scss";

export type TodaySupportOccurrenceCtaMode = "field" | "confirm";

export const TODAY_SUPPORT_FIELD_PROCEDURE_LABEL = "手順を表示";
export const TODAY_SUPPORT_FIELD_RECORD_LABEL = "この予定を記録";

/**
 * Field + unrecorded must not combine record + procedure into one CTA.
 * Returns split labels only for that case.
 */
export function todaySupportFieldUnrecordedSplitLabels(
  effectiveStatus: string,
  occurrenceCtaMode: TodaySupportOccurrenceCtaMode = "field",
): Readonly<{ procedureLabel: string; recordLabel: string }> | undefined {
  if (occurrenceCtaMode !== "field") {
    return undefined;
  }
  if (
    effectiveStatus === "記録済み" ||
    effectiveStatus === "取消済み" ||
    effectiveStatus === "確認が必要"
  ) {
    return undefined;
  }
  return {
    procedureLabel: TODAY_SUPPORT_FIELD_PROCEDURE_LABEL,
    recordLabel: TODAY_SUPPORT_FIELD_RECORD_LABEL,
  };
}

export function todaySupportOccurrenceActionLabel(
  effectiveStatus: string,
  occurrenceCtaMode: TodaySupportOccurrenceCtaMode = "field",
): string {
  if (occurrenceCtaMode === "confirm" && effectiveStatus === "未実施") {
    return "予定を確認";
  }
  if (effectiveStatus === "記録済み") {
    return "記録を確認・再表示";
  }
  if (effectiveStatus === "取消済み") {
    return "取消詳細を表示";
  }
  if (effectiveStatus === "確認が必要") {
    return "確認が必要なため詳細のみ";
  }
  // Unrecorded field: quiet first action only (never a combined label).
  return TODAY_SUPPORT_FIELD_PROCEDURE_LABEL;
}

export type TodaySupportDayBoardProps = Readonly<{
  items: readonly TodaySupportItem[];
  selectedOccurrenceId?: string;
  onSelectOccurrence?: (occurrenceId: string) => void;
  /** Existing procedure-record start. Distinct from occurrence viewing. */
  onStartProcedureRecord?: (occurrenceId: string) => void;
  /** ADMIN_AUDIT: confirm-oriented labels; FIELD_STAFF/PLANNER keep record CTAs. */
  occurrenceCtaMode?: TodaySupportOccurrenceCtaMode;
  /** PLANNER/ADMIN desktop: two-column board. FIELD_STAFF stays one column. */
  denseDesktopLayout?: boolean;
}>;

export const TodaySupportDayBoard: React.FC<TodaySupportDayBoardProps> = ({
  items,
  selectedOccurrenceId,
  onSelectOccurrence,
  onStartProcedureRecord,
  occurrenceCtaMode = "field",
  denseDesktopLayout = false,
}) => {
  if (items.length === 0) {
    return (
      <div className={styles.emptyContainer} data-kiosk-ux="today-support-empty">
        <p className={styles.emptyText}>本日の支援予定はありません。</p>
      </div>
    );
  }

  return (
    <section className={styles.container} aria-label="本日の支援予定（時系列）">
      <ul
        className={denseDesktopLayout ? `${styles.list} ${styles.listDesktopDense}` : styles.list}
        data-kiosk-ux="today-support-list"
      >
        {items.map((item) => {
          const isSelected = item.occurrenceId === selectedOccurrenceId;
          const badgeLabel = item.effectiveStatus;
          const badgeSoft =
            item.effectiveStatus === "取消済み" || item.effectiveStatus === "記録済み";

          const splitLabels = todaySupportFieldUnrecordedSplitLabels(
            item.effectiveStatus,
            occurrenceCtaMode,
          );
          const actionLabel = todaySupportOccurrenceActionLabel(
            item.effectiveStatus,
            occurrenceCtaMode,
          );

          return (
            <li
              key={item.occurrenceId}
              className={
                isSelected ? `${styles.itemCard} ${styles.itemCardSelected}` : styles.itemCard
              }
              data-kiosk-ux="today-support-item"
              data-kiosk-occurrence-id={item.occurrenceId}
              data-kiosk-schedule-item-id={item.scheduleItemId}
              data-kiosk-procedure-id={item.procedure.ProcedureId}
              data-kiosk-status={item.effectiveStatus}
              data-kiosk-can-start-record={item.canStartProcedureRecord ? "true" : "false"}
              data-kiosk-selected={isSelected ? "true" : "false"}
            >
              <div className={styles.itemHeader}>
                <span className={styles.timeTag}>{item.scheduledTime}</span>
                <span className={styles.personTag}>{item.personLabel}</span>
                <span className={styles.statusWrap}>
                  <StatusBadge shape={badgeSoft ? "soft" : "pill"} label={badgeLabel} />
                </span>
              </div>

              <div className={styles.itemBody}>
                <h3 className={styles.activityTitle}>{item.activityLabel}</h3>
                <p className={styles.procedureMeta}>
                  手順ID: {item.procedure.ProcedureId} (v{item.procedure.ProcedureVersion})
                </p>

                {item.observation ? (
                  <div className={styles.observationSummary} data-kiosk-ux="observation-summary">
                    <p className={styles.obsLine}>
                      【経過観察】 様子: {item.observation.condition ?? "未記録"} / 対応:{" "}
                      {item.observation.response ?? "未記録"} / 変化:{" "}
                      {item.observation.change ?? "未記録"}
                    </p>
                    {item.observation.memo ? (
                      <p className={styles.obsMemo}>メモ: {item.observation.memo}</p>
                    ) : null}
                  </div>
                ) : null}
              </div>

              <div className={styles.itemActionRow}>
                {splitLabels ? (
                  <>
                    <button
                      type="button"
                      className={`${styles.tapButton} ${styles.tapButtonQuiet}`}
                      data-kiosk-ux="tap-occurrence-button"
                      data-kiosk-occurrence-cta="procedure"
                      data-kiosk-target-occurrence-id={item.occurrenceId}
                      data-kiosk-can-start-record={item.canStartProcedureRecord ? "true" : "false"}
                      onClick={() => {
                        if (onSelectOccurrence) {
                          onSelectOccurrence(item.occurrenceId);
                        }
                      }}
                    >
                      {splitLabels.procedureLabel}
                    </button>
                    <button
                      type="button"
                      className={styles.tapButton}
                      data-kiosk-ux="tap-occurrence-button"
                      data-kiosk-occurrence-cta="record"
                      data-kiosk-target-occurrence-id={item.occurrenceId}
                      data-kiosk-can-start-record={item.canStartProcedureRecord ? "true" : "false"}
                      disabled={!item.canStartProcedureRecord || !onStartProcedureRecord}
                      aria-disabled={
                        !item.canStartProcedureRecord || !onStartProcedureRecord
                          ? "true"
                          : undefined
                      }
                      onClick={() => {
                        if (item.canStartProcedureRecord && onStartProcedureRecord) {
                          onStartProcedureRecord(item.occurrenceId);
                        }
                      }}
                    >
                      {splitLabels.recordLabel}
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    className={
                      occurrenceCtaMode === "confirm"
                        ? `${styles.tapButton} ${styles.tapButtonQuiet}`
                        : styles.tapButton
                    }
                    data-kiosk-ux="tap-occurrence-button"
                    data-kiosk-target-occurrence-id={item.occurrenceId}
                    data-kiosk-can-start-record={item.canStartProcedureRecord ? "true" : "false"}
                    onClick={() => {
                      if (onSelectOccurrence) {
                        onSelectOccurrence(item.occurrenceId);
                      }
                    }}
                  >
                    {actionLabel}
                  </button>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
};
