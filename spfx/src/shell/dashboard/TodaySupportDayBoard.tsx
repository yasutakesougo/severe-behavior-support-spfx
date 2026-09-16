import * as React from "react";
import type { TodaySupportItem } from "../../sbs-domain/kiosk-read-model.bundle";

import { StatusBadge } from "../primitives";
import styles from "./TodaySupportDayBoardUx.module.scss";

export type TodaySupportOccurrenceCtaMode = "field" | "confirm" | "task-first";

export const isFieldStaffTodayPrimaryActionStatus = (effectiveStatus: string): boolean =>
  effectiveStatus === "未実施";

export function todaySupportOccurrenceActionLabel(
  effectiveStatus: string,
  occurrenceCtaMode: TodaySupportOccurrenceCtaMode = "field",
): string {
  if (occurrenceCtaMode === "task-first" && effectiveStatus === "未実施") {
    return "対象の支援を始める";
  }
  const fieldActionLabel =
    effectiveStatus === "記録済み"
      ? "記録を確認・再表示"
      : effectiveStatus === "取消済み"
        ? "取消詳細を表示"
        : effectiveStatus === "確認が必要"
          ? "確認が必要なため詳細のみ"
          : "この予定を記録 / 手順表示";
  if (occurrenceCtaMode === "confirm" && effectiveStatus === "未実施") {
    return "予定を確認";
  }
  return fieldActionLabel;
}

export type FieldStaffDayBoardBridgeValue = Readonly<{
  onClearChosenOccurrence?: () => void;
  clearVisible?: boolean;
  useTaskFirstCta?: boolean;
}>;

export const FieldStaffDayBoardBridgeContext = React.createContext<FieldStaffDayBoardBridgeValue>(
  {},
);

export type TodaySupportDayBoardProps = Readonly<{
  items: readonly TodaySupportItem[];
  selectedOccurrenceId?: string;
  onSelectOccurrence?: (occurrenceId: string) => void;
  onClearChosenOccurrence?: () => void;
  /** ADMIN_AUDIT: confirm-oriented labels; FIELD_STAFF/PLANNER keep record CTAs. */
  occurrenceCtaMode?: TodaySupportOccurrenceCtaMode;
  /** PLANNER/ADMIN desktop: two-column board. FIELD_STAFF stays one column. */
  denseDesktopLayout?: boolean;
}>;

export const TodaySupportDayBoard: React.FC<TodaySupportDayBoardProps> = ({
  items,
  selectedOccurrenceId,
  onSelectOccurrence,
  onClearChosenOccurrence,
  occurrenceCtaMode = "field",
  denseDesktopLayout = false,
}) => {
  const bridge = React.useContext(FieldStaffDayBoardBridgeContext);
  const resolvedCtaMode: TodaySupportOccurrenceCtaMode = bridge.useTaskFirstCta
    ? "task-first"
    : occurrenceCtaMode;
  const clearHandler = onClearChosenOccurrence ?? bridge.onClearChosenOccurrence;
  const showClear = Boolean(clearHandler && (bridge.clearVisible ?? Boolean(selectedOccurrenceId)));

  if (items.length === 0) {
    return (
      <div className={styles.emptyContainer} data-kiosk-ux="today-support-empty">
        <p className={styles.emptyText}>本日の支援予定はありません。</p>
      </div>
    );
  }

  return (
    <section className={styles.container} aria-label="本日の支援予定（時系列）">
      {showClear ? (
        <p>
          <button
            type="button"
            className={styles.tapButton}
            data-role-task-clear-occurrence="true"
            onClick={() => {
              clearHandler?.();
            }}
          >
            選択した予定を外す
          </button>
        </p>
      ) : null}
      <ul
        className={denseDesktopLayout ? `${styles.list} ${styles.listDesktopDense}` : styles.list}
        data-kiosk-ux="today-support-list"
      >
        {items.map((item) => {
          const isSelected = item.occurrenceId === selectedOccurrenceId;
          const badgeLabel = item.effectiveStatus;
          const badgeSoft =
            item.effectiveStatus === "取消済み" || item.effectiveStatus === "記録済み";

          const actionLabel = todaySupportOccurrenceActionLabel(
            item.effectiveStatus,
            resolvedCtaMode,
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
                <button
                  type="button"
                  className={
                    occurrenceCtaMode === "confirm" || resolvedCtaMode === "confirm"
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
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
};
