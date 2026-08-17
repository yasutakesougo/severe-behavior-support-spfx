import * as React from "react";
import type { TodaySupportItem } from "../../sbs-domain/kiosk-read-model.bundle";

import { StatusBadge } from "../primitives";
import styles from "./TodaySupportDayBoardUx.module.scss";

export type TodaySupportDayBoardProps = Readonly<{
  items: readonly TodaySupportItem[];
  selectedOccurrenceId?: string;
  onSelectOccurrence?: (occurrenceId: string) => void;
}>;

export const TodaySupportDayBoard: React.FC<TodaySupportDayBoardProps> = ({
  items,
  selectedOccurrenceId,
  onSelectOccurrence,
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
      <ul className={styles.list} data-kiosk-ux="today-support-list">
        {items.map((item) => {
          const isSelected = item.occurrenceId === selectedOccurrenceId;
          const badgeLabel = item.effectiveStatus;
          const badgeSoft =
            item.effectiveStatus === "取消済み" || item.effectiveStatus === "記録済み";

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
                  className={styles.tapButton}
                  data-kiosk-ux="tap-occurrence-button"
                  data-kiosk-target-occurrence-id={item.occurrenceId}
                  onClick={() => {
                    if (onSelectOccurrence) {
                      onSelectOccurrence(item.occurrenceId);
                    }
                  }}
                >
                  {item.effectiveStatus === "記録済み"
                    ? "記録を確認・再表示"
                    : item.effectiveStatus === "取消済み"
                      ? "取消詳細を表示"
                      : "この予定を記録 / 手順表示"}
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
};
