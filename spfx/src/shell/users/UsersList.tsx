import * as React from "react";
import { DEMO_KPI_FAMILY_R_USERS_NOTE, DEMO_UX_10_SLICE } from "../ux/kpi-review-count";
import {
  DEMO_USERS_DETAIL_DISABLED_NOTE,
  DEMO_USERS_FILTER_EMPTY_NOTE,
  DEMO_USERS_FILTER_NOTE,
  DEMO_USERS_PRESENTATION_NOTE,
} from "./users-copy";
import {
  DEMO_UX_8_SLICE,
  USERS_FILTER_CHIP_ALL,
  USERS_FILTER_CHIP_LABELS,
  filterUserRowsByStatusChip,
  formatUsersFilterSummaryLabel,
  type UsersFilterChipLabel,
} from "./users-filter";
import type { ShellUsersPresentation } from "./users-types";
import styles from "./UsersUx.module.scss";

export type UsersListProps = Readonly<{
  presentation: ShellUsersPresentation;
  headingRef?: React.Ref<HTMLHeadingElement>;
  detailPreviewUserId?: string;
  onUserDetailRequest?: (userId: string) => void;
}>;

/**
 * DEMO-UX-2 users list presentation skeleton.
 * DEMO-UX-3 may opt one synthetic row into local presentation-only detail preview.
 * DEMO-UX-8 enables synthetic client-side status filter chips.
 * No live user data or business navigation is connected here.
 */
export const UsersList: React.FC<UsersListProps> = ({
  presentation,
  headingRef,
  detailPreviewUserId,
  onUserDetailRequest,
}) => {
  const { filterHint, rows } = presentation;
  const [activeChip, setActiveChip] = React.useState<UsersFilterChipLabel>(USERS_FILTER_CHIP_ALL);
  const visibleRows = filterUserRowsByStatusChip(rows, activeChip);
  const summaryLabel = formatUsersFilterSummaryLabel(visibleRows.length, activeChip, rows.length);
  const showEmptyNote = visibleRows.length === 0;

  return (
    <section
      className={styles.usersList}
      data-demo-ux="users-list"
      data-demo-ux-8-slice={DEMO_UX_8_SLICE.id}
      data-demo-ux-10-slice={DEMO_UX_10_SLICE.id}
      data-demo-ux-metric-family="roster"
      data-demo-ux-filter-chip={activeChip}
      data-demo-ux-filter-count={String(visibleRows.length)}
      aria-labelledby="demo-ux-users-heading"
    >
      <h1
        id="demo-ux-users-heading"
        ref={headingRef}
        tabIndex={-1}
        className={styles.usersHeading}
        data-demo-ux="users-heading"
      >
        利用者
      </h1>

      <p className={styles.presentationNote} data-demo-ux="users-presentation-note">
        {DEMO_USERS_PRESENTATION_NOTE}
      </p>

      <p
        className={styles.presentationNote}
        data-demo-ux="users-metric-family-r-note"
        data-demo-ux-metric-family="roster"
      >
        {DEMO_KPI_FAMILY_R_USERS_NOTE}
      </p>

      <div className={styles.summaryRow}>
        <p className={styles.summaryLabel} data-demo-ux="users-summary-label">
          {summaryLabel}
        </p>
        <div
          className={styles.filterBar}
          data-demo-ux="users-filter-bar"
          role="group"
          aria-label="利用者の状態で絞り込み"
        >
          <p className={styles.filterHint} data-demo-ux="users-filter-hint">
            {filterHint}
          </p>
          {USERS_FILTER_CHIP_LABELS.map((label) => {
            const selected = label === activeChip;
            return (
              <button
                key={label}
                type="button"
                className={
                  selected
                    ? `${styles.filterButton} ${styles.filterButtonSelected}`
                    : styles.filterButton
                }
                aria-pressed={selected}
                data-demo-ux="users-filter-chip"
                data-demo-ux-filter={label}
                data-demo-ux-filter-selected={selected ? "true" : "false"}
                onClick={() => {
                  setActiveChip(label);
                }}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      <p className={styles.sectionHint} data-demo-ux="users-detail-note">
        {DEMO_USERS_DETAIL_DISABLED_NOTE}
      </p>

      {showEmptyNote ? (
        <p className={styles.sectionHint} data-demo-ux="users-filter-empty-note">
          {DEMO_USERS_FILTER_EMPTY_NOTE}
        </p>
      ) : null}

      <ul className={styles.userRows} data-demo-ux="users-row-list">
        {visibleRows.map((row) => {
          const detailPreviewEnabled =
            Boolean(onUserDetailRequest) && row.id === detailPreviewUserId;
          return (
            <li
              key={row.id}
              className={styles.userRow}
              data-demo-ux="users-row"
              data-demo-ux-user-id={row.id}
            >
              <div className={styles.userMain}>
                <p className={styles.personLabel}>{row.personLabel}</p>
                <ul className={styles.badgeList} aria-label={`${row.personLabel}の状態`}>
                  {row.statusBadges.map((badge) => (
                    <li
                      key={`${row.id}-${badge.id}`}
                      className={styles.statusBadge}
                      data-demo-ux="users-status-badge"
                      data-demo-ux-status={badge.id}
                    >
                      {badge.label}
                    </li>
                  ))}
                </ul>
              </div>
              <div className={styles.userMeta}>
                <p className={styles.planSummary}>{row.planSummary}</p>
                <p className={styles.attentionNote}>{row.attentionNote}</p>
                <p className={styles.lastRecordLabel}>{row.lastRecordLabel}</p>
              </div>
              <button
                type="button"
                className={styles.detailButton}
                disabled={!detailPreviewEnabled}
                aria-disabled={!detailPreviewEnabled ? "true" : undefined}
                data-demo-ux="users-detail-button"
                data-demo-ux-detail-preview={detailPreviewEnabled ? "true" : "false"}
                onClick={() => {
                  if (detailPreviewEnabled && onUserDetailRequest) {
                    onUserDetailRequest(row.id);
                  }
                }}
              >
                {row.detailActionLabel}
              </button>
            </li>
          );
        })}
      </ul>
      <p className={styles.sectionHint} data-demo-ux="users-filter-note">
        {DEMO_USERS_FILTER_NOTE}
      </p>
    </section>
  );
};
