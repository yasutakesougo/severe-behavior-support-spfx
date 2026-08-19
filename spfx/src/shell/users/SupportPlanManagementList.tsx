import * as React from "react";
import { EmptyNotice, StatusBadge } from "../primitives";
import {
  DEMO_KPI_FAMILY_P_NOTE,
  SUPPORT_PLAN_MANAGEMENT_EMPTY_NOTE,
  SUPPORT_PLAN_MANAGEMENT_KPI_HEADING,
  SUPPORT_PLAN_MANAGEMENT_KPI_LABELS,
  SUPPORT_PLAN_MANAGEMENT_LIST_HEADING,
  SUPPORT_PLAN_MANAGEMENT_TODAY_EMPTY_NOTE,
  SUPPORT_PLAN_MANAGEMENT_TODAY_HEADING,
} from "./support-plan-management-list-copy";
import { SUPPORT_PLAN_MANAGEMENT_LIST_DEMO_1_SLICE } from "./support-plan-management-list-fixture";
import {
  buildFamilyPCountLabels,
  buildFamilyPCounts,
  selectPlannerListPrimaryActionUserId,
  selectTodayActionRows,
} from "./support-plan-management-list-kpi";
import type {
  ShellSupportPlanManagementListPresentation,
  SupportPlanManagementRow,
} from "./support-plan-management-list-types";
import styles from "./SupportPlanManagementListUx.module.scss";

export type SupportPlanManagementListProps = Readonly<{
  presentation: ShellSupportPlanManagementListPresentation;
  headingRef?: React.Ref<HTMLHeadingElement>;
  onRowAction?: (row: SupportPlanManagementRow) => void;
}>;

/**
 * SUPPORT-PLAN-MANAGEMENT-LIST-DEMO-1 — PLANNER DestinationList.
 * Presentation-only. Family P KPI counts are derived from fixture rows.
 */
export const SupportPlanManagementList: React.FC<SupportPlanManagementListProps> = ({
  presentation,
  headingRef,
  onRowAction,
}) => {
  const { heading, rows } = presentation;
  const counts = buildFamilyPCounts(rows);
  const countLabels = buildFamilyPCountLabels(rows);
  const todayRows = selectTodayActionRows(rows);
  const primaryActionUserId = selectPlannerListPrimaryActionUserId(todayRows);
  const kpiItems = [
    {
      kind: "needs_action" as const,
      label: SUPPORT_PLAN_MANAGEMENT_KPI_LABELS.needs_action,
      count: counts.needs_action,
      countLabel: countLabels.needsActionLabel,
    },
    {
      kind: "review_window" as const,
      label: SUPPORT_PLAN_MANAGEMENT_KPI_LABELS.review_window,
      count: counts.review_window,
      countLabel: countLabels.reviewWindowLabel,
    },
    {
      kind: "observation_wait" as const,
      label: SUPPORT_PLAN_MANAGEMENT_KPI_LABELS.observation_wait,
      count: counts.observation_wait,
      countLabel: countLabels.observationWaitLabel,
    },
  ];

  return (
    <section
      className={styles.list}
      data-demo-ux="support-plan-management-list"
      data-support-plan-mgmt-demo-slice={SUPPORT_PLAN_MANAGEMENT_LIST_DEMO_1_SLICE.id}
      data-support-plan-mgmt-metric-family="plan"
      aria-labelledby="support-plan-mgmt-heading"
    >
      <h1
        id="support-plan-mgmt-heading"
        ref={headingRef}
        tabIndex={-1}
        className={styles.heading}
        data-demo-ux="support-plan-mgmt-heading"
      >
        {heading}
      </h1>

      <p
        className={styles.sectionHint}
        data-demo-ux="support-plan-mgmt-family-p-note"
        data-support-plan-mgmt-metric-family="plan"
      >
        {DEMO_KPI_FAMILY_P_NOTE}
      </p>

      <section className={styles.section} aria-labelledby="support-plan-mgmt-kpi-heading">
        <h2 id="support-plan-mgmt-kpi-heading" className={styles.sectionHeading}>
          {SUPPORT_PLAN_MANAGEMENT_KPI_HEADING}
        </h2>
        <ul className={styles.kpiStrip} data-demo-ux="support-plan-mgmt-kpi">
          {kpiItems.map((item) => (
            <li
              key={item.kind}
              className={styles.kpiMetric}
              data-demo-ux="support-plan-mgmt-kpi-metric"
              data-support-plan-mgmt-kpi={item.kind}
              data-support-plan-mgmt-kpi-count={String(item.count)}
            >
              <p className={styles.kpiLabel}>{item.label}</p>
              <p className={styles.kpiCount}>{item.count}</p>
              <p className={styles.sectionHint}>{item.countLabel}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.section} aria-labelledby="support-plan-mgmt-today-heading">
        <h2 id="support-plan-mgmt-today-heading" className={styles.sectionHeading}>
          {SUPPORT_PLAN_MANAGEMENT_TODAY_HEADING}
        </h2>
        {todayRows.length === 0 ? (
          <EmptyNotice
            announce
            className={styles.sectionHint}
            dataAttrs={{ "data-demo-ux": "support-plan-mgmt-today-empty" }}
          >
            {SUPPORT_PLAN_MANAGEMENT_TODAY_EMPTY_NOTE}
          </EmptyNotice>
        ) : (
          <ul
            className={styles.todayList}
            data-demo-ux="support-plan-mgmt-today-list"
            data-visual-hierarchy="action-queue"
          >
            {todayRows.map((row) => {
              const isPrimary = row.userId === primaryActionUserId;
              return (
                <li key={`today-${row.userId}`} className={styles.todayRow}>
                  <div className={styles.rowMain}>
                    <p className={styles.personLabel}>{row.personLabel}</p>
                    <p className={styles.attention}>{row.attentionLabel}</p>
                  </div>
                  <button
                    type="button"
                    className={
                      isPrimary ? styles.actionButtonPrimary : styles.actionButtonSecondary
                    }
                    data-demo-ux="support-plan-mgmt-today-action"
                    data-sbs-action={isPrimary ? "primary" : "secondary"}
                    data-support-plan-mgmt-user-id={row.userId}
                    onClick={() => {
                      if (onRowAction) {
                        onRowAction(row);
                      }
                    }}
                  >
                    {row.actionLabel}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className={styles.section} aria-labelledby="support-plan-mgmt-rows-heading">
        <h2 id="support-plan-mgmt-rows-heading" className={styles.sectionHeading}>
          {SUPPORT_PLAN_MANAGEMENT_LIST_HEADING}
        </h2>
        {rows.length === 0 ? (
          <EmptyNotice
            announce
            className={styles.sectionHint}
            dataAttrs={{ "data-demo-ux": "support-plan-mgmt-empty" }}
          >
            {SUPPORT_PLAN_MANAGEMENT_EMPTY_NOTE}
          </EmptyNotice>
        ) : (
          <ul className={styles.rows} data-demo-ux="support-plan-mgmt-row-list">
            {rows.map((row) => (
              <li
                key={row.userId}
                className={styles.row}
                data-demo-ux="support-plan-mgmt-row"
                data-support-plan-mgmt-user-id={row.userId}
                data-support-plan-mgmt-work-state={row.workState}
                data-support-plan-mgmt-attention={row.attentionKind}
                tabIndex={-1}
              >
                <div className={styles.rowMain}>
                  <div className={styles.personRow}>
                    <p className={styles.personLabel}>{row.personLabel}</p>
                    <StatusBadge
                      label={row.workStateLabel}
                      statusId={row.workState}
                      dataAttrs={{
                        "data-demo-ux": "support-plan-mgmt-status",
                        "data-support-plan-mgmt-status": row.workState,
                      }}
                    />
                  </div>
                  <p className={styles.meta} data-demo-ux="support-plan-mgmt-version">
                    {row.currentVersionLabel}
                  </p>
                  <p className={styles.meta} data-demo-ux="support-plan-mgmt-observation">
                    {row.lastObservationLabel}
                  </p>
                  <p className={styles.meta} data-demo-ux="support-plan-mgmt-review-window">
                    {row.reviewWindowLabel}
                  </p>
                  {row.attentionLabel ? (
                    <p className={styles.attention} data-demo-ux="support-plan-mgmt-attention">
                      {`要対応: ${row.attentionLabel}`}
                    </p>
                  ) : null}
                </div>
                <button
                  type="button"
                  className={
                    row.actionKind === "create"
                      ? styles.actionButtonSecondary
                      : styles.actionButtonTertiary
                  }
                  data-demo-ux="support-plan-mgmt-action"
                  data-sbs-action={row.actionKind === "create" ? "secondary" : "tertiary"}
                  data-support-plan-mgmt-action={row.actionKind}
                  data-support-plan-mgmt-user-id={row.userId}
                  onClick={() => {
                    if (onRowAction) {
                      onRowAction(row);
                    }
                  }}
                >
                  {row.actionLabel}
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </section>
  );
};
