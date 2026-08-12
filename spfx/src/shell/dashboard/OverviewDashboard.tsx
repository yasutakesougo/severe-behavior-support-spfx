import * as React from "react";
import {
  DASHBOARD_OVERVIEW_ACTION_DISABLED_NOTE,
  DASHBOARD_OVERVIEW_ACTION_NAV_NOTE,
  DASHBOARD_OVERVIEW_KPI_NOTE,
  DASHBOARD_OVERVIEW_PRESENTATION_NOTE,
} from "./overview-copy";
import type { OverviewActionNavigationTarget, ShellOverviewPresentation } from "./overview-types";
import styles from "./DashboardUx.module.scss";

export type OverviewDashboardProps = Readonly<{
  presentation: ShellOverviewPresentation;
  headingRef?: React.Ref<HTMLHeadingElement>;
  onReviewDueStateRequest?: () => void;
  onTodayActionNavigate?: (target: OverviewActionNavigationTarget) => void;
}>;

/**
 * DASHBOARD-UX-1 overview presentation skeleton.
 * DEMO-UX-7 enables synthetic today-action navigation only — not save / live I/O.
 */
export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({
  presentation,
  headingRef,
  onReviewDueStateRequest,
  onTodayActionNavigate,
}) => {
  const { kpiCards, actionItems, recentRecords } = presentation;
  const todayActionNavEnabled = Boolean(onTodayActionNavigate);

  return (
    <section
      className={styles.overviewDashboard}
      data-dashboard-ux="overview-dashboard"
      aria-labelledby="dashboard-ux-overview-heading"
    >
      <h1
        id="dashboard-ux-overview-heading"
        ref={headingRef}
        tabIndex={-1}
        className={styles.overviewHeading}
        data-dashboard-ux="overview-heading"
      >
        概要
      </h1>

      <p className={styles.presentationNote} data-dashboard-ux="overview-presentation-note">
        {DASHBOARD_OVERVIEW_PRESENTATION_NOTE}
      </p>

      <section className={styles.section} aria-labelledby="dashboard-ux-kpi-heading">
        <h2 id="dashboard-ux-kpi-heading" className={styles.sectionHeading}>
          今日の支援状況
        </h2>
        <p className={styles.sectionHint} data-dashboard-ux="overview-kpi-note">
          {DASHBOARD_OVERVIEW_KPI_NOTE}
        </p>
        <ul className={styles.kpiGrid} data-dashboard-ux="overview-kpi-grid">
          {kpiCards.map((card) => (
            <li
              key={card.id}
              className={styles.kpiCard}
              data-dashboard-ux="overview-kpi-card"
              data-dashboard-ux-kpi={card.id}
            >
              <p className={styles.kpiLabel}>{card.label}</p>
              <p className={styles.kpiCount} aria-label={`${card.label} ${card.count}件`}>
                {card.count}
              </p>
              <p className={styles.kpiHint}>{card.statusHint}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.section} aria-labelledby="dashboard-ux-review-due-entry-heading">
        <h2 id="dashboard-ux-review-due-entry-heading" className={styles.sectionHeading}>
          見直し状況
        </h2>
        <p className={styles.sectionHint} data-dashboard-ux="overview-review-due-note">
          期限接近や要確認などの状態表示を、合成データで確認できます。
        </p>
        <button
          type="button"
          className={styles.actionButton}
          disabled={!onReviewDueStateRequest}
          aria-disabled={!onReviewDueStateRequest ? "true" : undefined}
          data-demo-ux="overview-open-review-due"
          data-demo-ux-review-due-preview={onReviewDueStateRequest ? "true" : "false"}
          onClick={onReviewDueStateRequest}
        >
          見直し状況を表示
        </button>
      </section>

      <section className={styles.section} aria-labelledby="dashboard-ux-actions-heading">
        <h2 id="dashboard-ux-actions-heading" className={styles.sectionHeading}>
          今日やること
        </h2>
        <p className={styles.sectionHint} data-dashboard-ux="overview-action-note">
          {todayActionNavEnabled
            ? DASHBOARD_OVERVIEW_ACTION_NAV_NOTE
            : DASHBOARD_OVERVIEW_ACTION_DISABLED_NOTE}
        </p>
        <ul className={styles.actionList} data-dashboard-ux="overview-action-list">
          {actionItems.map((item) => {
            const navigation = item.navigation;
            const enabled = Boolean(todayActionNavEnabled && navigation);
            return (
              <li
                key={item.id}
                className={styles.actionRow}
                data-dashboard-ux="overview-action-item"
                data-dashboard-ux-action-id={item.id}
                data-demo-ux-action-nav={navigation?.kind ?? "none"}
              >
                <div className={styles.actionMain}>
                  <p className={styles.personLabel}>{item.personLabel}</p>
                  <p className={styles.reasonText}>{item.reason}</p>
                </div>
                <button
                  type="button"
                  className={styles.actionButton}
                  disabled={!enabled}
                  aria-disabled={!enabled ? "true" : undefined}
                  data-dashboard-ux="overview-action-button"
                  data-demo-ux="overview-today-action"
                  data-demo-ux-today-action={item.id}
                  data-demo-ux-today-action-enabled={enabled ? "true" : "false"}
                  onClick={() => {
                    if (enabled && navigation && onTodayActionNavigate) {
                      onTodayActionNavigate(navigation);
                    }
                  }}
                >
                  {item.actionLabel}
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      <section className={styles.section} aria-labelledby="dashboard-ux-recent-heading">
        <h2 id="dashboard-ux-recent-heading" className={styles.sectionHeading}>
          最近の記録
        </h2>
        <ul className={styles.recentList} data-dashboard-ux="overview-recent-list">
          {recentRecords.map((record) => (
            <li
              key={record.id}
              className={styles.recentRow}
              data-dashboard-ux="overview-recent-item"
              data-dashboard-ux-recent-id={record.id}
            >
              <div className={styles.recentMain}>
                <p className={styles.personLabel}>{record.personLabel}</p>
                <p className={styles.recentMeta}>
                  {record.timeLabel} {record.recordType}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </section>
  );
};
