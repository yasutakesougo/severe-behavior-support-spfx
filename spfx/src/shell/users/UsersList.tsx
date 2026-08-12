import * as React from "react";
import {
  DEMO_USERS_DETAIL_DISABLED_NOTE,
  DEMO_USERS_FILTER_DISABLED_NOTE,
  DEMO_USERS_PRESENTATION_NOTE,
} from "./users-copy";
import type { ShellUsersPresentation } from "./users-types";
import styles from "./UsersUx.module.scss";

export type UsersListProps = Readonly<{
  presentation: ShellUsersPresentation;
  headingRef?: React.Ref<HTMLHeadingElement>;
  detailPreviewUserId?: string;
  onUserDetailRequest?: (userId: string) => void;
}>;

const FILTER_CHIP_LABELS = ["すべて", "要確認", "未記録", "期限接近"] as const;

/**
 * DEMO-UX-2 users list presentation skeleton.
 * DEMO-UX-3 may opt one synthetic row into local presentation-only detail preview.
 * No live user data or business navigation is connected here.
 */
export const UsersList: React.FC<UsersListProps> = ({
  presentation,
  headingRef,
  detailPreviewUserId,
  onUserDetailRequest,
}) => {
  const { summaryLabel, filterHint, rows } = presentation;

  return (
    <section
      className={styles.usersList}
      data-demo-ux="users-list"
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

      <div className={styles.summaryRow}>
        <p className={styles.summaryLabel} data-demo-ux="users-summary-label">
          {summaryLabel}
        </p>
        <div className={styles.filterBar} data-demo-ux="users-filter-bar">
          <p className={styles.filterHint} data-demo-ux="users-filter-hint">
            {filterHint}
          </p>
          {FILTER_CHIP_LABELS.map((label) => (
            <button
              key={label}
              type="button"
              className={styles.filterButton}
              disabled
              aria-disabled="true"
              data-demo-ux="users-filter-chip"
              data-demo-ux-filter={label}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <p className={styles.sectionHint} data-demo-ux="users-detail-note">
        {DEMO_USERS_DETAIL_DISABLED_NOTE}
      </p>

      <ul className={styles.userRows} data-demo-ux="users-row-list">
        {rows.map((row) => {
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
      <p className={styles.sectionHint} data-demo-ux="users-filter-disabled-note">
        {DEMO_USERS_FILTER_DISABLED_NOTE}
      </p>
    </section>
  );
};
