import * as React from "react";
import { DEMO_UX_11_SLICE } from "../ux/demo-note-consolidation";
import { DEMO_KPI_FAMILY_R_NOTE, DEMO_UX_10_SLICE } from "../ux/kpi-review-count";
import {
  SHELL_DEFAULT_PRESENTATION_ROLE,
  SHELL_PRESENTATION_ROLE_HINTS,
  isAdminAuditPresentationRole,
  kpiSectionHeadingForRole,
  overviewSectionOrderForRole,
  type OverviewSectionKey,
  type ShellPresentationRole,
} from "../ux/presentation-role";
import {
  DASHBOARD_OVERVIEW_ACTION_DISABLED_NOTE,
  DASHBOARD_OVERVIEW_ACTION_NAV_NOTE,
  formatTodaySupportBoardDisclaimer,
  isTodayTargetsUnavailableCard,
} from "./overview-copy";
import type { OverviewActionNavigationTarget, ShellOverviewPresentation } from "./overview-types";
import { SemanticIcon } from "../primitives";
import styles from "./DashboardUx.module.scss";

import type { TodaySupportItem } from "../../sbs-domain/kiosk-read-model.bundle";
import { TodaySupportDayBoard } from "./TodaySupportDayBoard";

export type OverviewDashboardProps = Readonly<{
  presentation: ShellOverviewPresentation;
  headingRef?: React.Ref<HTMLHeadingElement>;
  todaySupportItems?: readonly TodaySupportItem[];
  selectedOccurrenceId?: string;
  onReviewDueStateRequest?: () => void;
  onTodayActionNavigate?: (target: OverviewActionNavigationTarget) => void;
  onSelectOccurrence?: (occurrenceId: string) => void;
  presentationRole?: ShellPresentationRole;
}>;

/**
 * DASHBOARD-UX-1 / DADS-UX-2 overview presentation skeleton.
 * DEMO-UX-7 enables synthetic today-action navigation only — not save / live I/O.
 * DEMO-UX-11 removes duplicate screen-level synthetic band (global DemoBanner remains).
 * DADS-UX-2: presentation-only token/focus convergence — IA / status vocabulary UNCHANGED.
 * VP-G: synthetic presentationRole reorders emphasis only. Destinations unchanged.
 */
export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({
  presentation,
  headingRef,
  todaySupportItems,
  selectedOccurrenceId,
  onReviewDueStateRequest,
  onTodayActionNavigate,
  onSelectOccurrence,
  presentationRole = SHELL_DEFAULT_PRESENTATION_ROLE,
}) => {
  const { kpiCards, actionItems, recentRecords } = presentation;
  const todayActionNavEnabled = Boolean(onTodayActionNavigate);
  const denseDesktop = presentationRole !== "FIELD_STAFF";
  const occurrenceCtaMode = isAdminAuditPresentationRole(presentationRole) ? "confirm" : "field";

  const todaySupportSection =
    todaySupportItems && todaySupportItems.length > 0 ? (
      <section
        className={styles.section}
        aria-labelledby="dashboard-ux-today-support-heading"
        data-kiosk-ux="today-support-primary"
        data-overview-section="todaySupport"
      >
        <h2 id="dashboard-ux-today-support-heading" className={styles.sectionHeading}>
          今日の支援（本日の予定・時系列）
        </h2>
        <p className={styles.sectionHint} data-kiosk-ux="today-support-list-separation-note">
          {formatTodaySupportBoardDisclaimer(todaySupportItems.map((item) => item.personLabel))}
        </p>
        <TodaySupportDayBoard
          items={todaySupportItems}
          selectedOccurrenceId={selectedOccurrenceId}
          onSelectOccurrence={onSelectOccurrence}
          occurrenceCtaMode={occurrenceCtaMode}
          denseDesktopLayout={denseDesktop}
        />
      </section>
    ) : null;

  const kpiSection = (
    <section
      className={styles.section}
      aria-labelledby="dashboard-ux-kpi-heading"
      data-overview-section="kpi"
    >
      <h2 id="dashboard-ux-kpi-heading" className={styles.sectionHeading}>
        {kpiSectionHeadingForRole(presentationRole)}
      </h2>
      <p
        className={styles.sectionHint}
        data-demo-ux="overview-kpi-family-r-note"
        data-demo-ux-metric-family="roster"
      >
        {DEMO_KPI_FAMILY_R_NOTE}
      </p>
      <ul className={styles.kpiGrid} data-dashboard-ux="overview-kpi-grid">
        {kpiCards.map((card) => {
          const isRosterStatusCard =
            card.id === "needs_review" || card.id === "unrecorded" || card.id === "deadline_near";
          const countUnit = isRosterStatusCard ? "名" : "件";
          const semanticIconName =
            card.id === "today_targets"
              ? "todaySupport"
              : card.id === "unrecorded"
                ? "record"
                : card.id === "deadline_near"
                  ? "monitoring"
                  : card.id === "needs_review"
                    ? "supportPlan"
                    : undefined;

          return (
            <li
              key={card.id}
              className={styles.kpiCard}
              data-dashboard-ux="overview-kpi-card"
              data-dashboard-ux-kpi={card.id}
              data-demo-ux-metric-family={isRosterStatusCard ? "roster" : "overview_other"}
              data-demo-ux-kpi-count={isTodayTargetsUnavailableCard(card) ? undefined : String(card.count)}
            >
              <div className={styles.kpiHeaderRow}>
                <p className={styles.kpiLabel}>{card.label}</p>
                {semanticIconName ? (
                  <SemanticIcon name={semanticIconName} size={20} className={styles.kpiIcon} />
                ) : null}
              </div>
              {isTodayTargetsUnavailableCard(card) ? (
                <p
                  className={styles.kpiCount}
                  aria-label={`${card.label} ${card.statusHint}`}
                  data-demo-ux-kpi-unavailable="true"
                >
                  {card.statusHint}
                </p>
              ) : (
                <p className={styles.kpiCount} aria-label={`${card.label} ${card.count}${countUnit}`}>
                  {card.count}
                </p>
              )}
              {isTodayTargetsUnavailableCard(card) ? null : (
                <p className={styles.kpiHint}>{card.statusHint}</p>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );

  const reviewDueSection = (
    <section
      className={styles.section}
      aria-labelledby="dashboard-ux-review-due-entry-heading"
      data-overview-section="reviewDue"
    >
      <h2 id="dashboard-ux-review-due-entry-heading" className={styles.sectionHeading}>
        見直し状況
      </h2>
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
  );

  const actionsSection = (
    <section
      className={styles.section}
      aria-labelledby="dashboard-ux-actions-heading"
      data-overview-section="actions"
    >
      <h2 id="dashboard-ux-actions-heading" className={styles.sectionHeading}>
        今日やること
      </h2>
      <p className={styles.sectionHint} data-dashboard-ux="overview-action-note">
        {todayActionNavEnabled
          ? DASHBOARD_OVERVIEW_ACTION_NAV_NOTE
          : DASHBOARD_OVERVIEW_ACTION_DISABLED_NOTE}
      </p>
      <ul
        className={
          denseDesktop ? `${styles.actionList} ${styles.desktopDenseList}` : styles.actionList
        }
        data-dashboard-ux="overview-action-list"
      >
        {actionItems.map((item) => {
          const navigation = item.navigation;
          const enabled = Boolean(todayActionNavEnabled && navigation);
          const actionSemanticIcon =
            navigation?.kind === "records"
              ? "record"
              : navigation?.kind === "review_due"
                ? "monitoring"
                : navigation?.kind === "user_detail"
                  ? "supportPlan"
                  : undefined;

          return (
            <li
              key={item.id}
              className={styles.actionRow}
              data-dashboard-ux="overview-action-item"
              data-dashboard-ux-action-id={item.id}
              data-demo-ux-action-nav={navigation?.kind ?? "none"}
            >
              <div className={styles.actionMain}>
                <div className={styles.personRow}>
                  {actionSemanticIcon ? (
                    <SemanticIcon
                      name={actionSemanticIcon}
                      size={18}
                      className={styles.actionIcon}
                    />
                  ) : null}
                  <p className={styles.personLabel}>{item.personLabel}</p>
                </div>
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
  );

  const recentSection = (
    <section
      className={styles.section}
      aria-labelledby="dashboard-ux-recent-heading"
      data-overview-section="recent"
    >
      <h2 id="dashboard-ux-recent-heading" className={styles.sectionHeading}>
        最近の記録
      </h2>
      <ul
        className={
          denseDesktop ? `${styles.recentList} ${styles.desktopDenseList}` : styles.recentList
        }
        data-dashboard-ux="overview-recent-list"
      >
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
  );

  const sectionByKey: Record<OverviewSectionKey, React.ReactNode> = {
    todaySupport: todaySupportSection,
    kpi: kpiSection,
    reviewDue: reviewDueSection,
    actions: actionsSection,
    recent: recentSection,
  };

  return (
    <section
      className={styles.overviewDashboard}
      data-dashboard-ux="overview-dashboard"
      data-demo-ux-10-slice={DEMO_UX_10_SLICE.id}
      data-demo-ux-11-slice={DEMO_UX_11_SLICE.id}
      data-presentation-role={presentationRole}
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
      <p className={styles.sectionHint} data-shell-ux="presentation-role-hint">
        {SHELL_PRESENTATION_ROLE_HINTS[presentationRole]}
      </p>
      {overviewSectionOrderForRole(presentationRole).map((key) => (
        <React.Fragment key={key}>{sectionByKey[key]}</React.Fragment>
      ))}
    </section>
  );
};
