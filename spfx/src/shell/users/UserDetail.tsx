import * as React from "react";
import type { ShellUserDetailPresentation } from "./user-detail-types";
import styles from "./UserDetailUx.module.scss";

export type UserDetailProps = Readonly<{
  presentation: ShellUserDetailPresentation;
  headingRef?: React.Ref<HTMLHeadingElement>;
  onBackToUsers?: () => void;
  onSupportPlanRequest?: () => void;
}>;

const USER_DETAIL_SECTION_LABELS = ["概要", "支援計画", "記録", "評価", "履歴"] as const;

/**
 * DEMO-UX-3 user detail presentation skeleton.
 * DEMO-UX-4 may opt the support-plan section into a synthetic local preview.
 * Synthetic fixture only — no live user, plan, record, auth, or adapter connection.
 */
export const UserDetail: React.FC<UserDetailProps> = ({
  presentation,
  headingRef,
  onBackToUsers,
  onSupportPlanRequest,
}) => {
  const {
    personLabel,
    planLabel,
    planPeriodLabel,
    currentSupport,
    recentRecords,
    evaluationSummary,
    historySummary,
    businessFacts,
    systemState,
  } = presentation;

  return (
    <section
      className={styles.userDetail}
      data-demo-ux="user-detail"
      aria-labelledby="demo-ux-user-detail-heading"
    >
      <div className={styles.topRow}>
        <button
          type="button"
          className={styles.backButton}
          onClick={onBackToUsers}
          disabled={!onBackToUsers}
          aria-disabled={!onBackToUsers ? "true" : undefined}
          data-demo-ux="user-detail-back"
        >
          ← 利用者一覧
        </button>
        <p className={styles.presentationNote} data-demo-ux="user-detail-presentation-note">
          合成データによる表示確認用です。業務データ、保存、認証・認可には接続されていません。
        </p>
      </div>

      <h1
        id="demo-ux-user-detail-heading"
        ref={headingRef}
        tabIndex={-1}
        className={styles.userHeading}
        data-demo-ux="user-detail-heading"
      >
        {personLabel}
      </h1>

      <div className={styles.sectionTabs} aria-label="利用者詳細の表示順">
        {USER_DETAIL_SECTION_LABELS.map((label, index) => {
          const planPreviewEnabled = label === "支援計画" && Boolean(onSupportPlanRequest);
          if (planPreviewEnabled) {
            return (
              <button
                key={label}
                type="button"
                className={index === 0 ? styles.sectionTabCurrent : styles.sectionTab}
                data-demo-ux="user-detail-section-label"
                data-demo-ux-plan-preview="true"
                onClick={onSupportPlanRequest}
              >
                {label}
              </button>
            );
          }
          return (
            <span
              key={label}
              className={index === 0 ? styles.sectionTabCurrent : styles.sectionTab}
              data-demo-ux="user-detail-section-label"
              data-demo-ux-plan-preview="false"
            >
              {label}
            </span>
          );
        })}
      </div>

      <section className={styles.detailSection} aria-labelledby="demo-ux-current-support-heading">
        <h2 id="demo-ux-current-support-heading">現在の支援</h2>
        <p className={styles.planLabel}>
          {planLabel} <span>{planPeriodLabel}</span>
        </p>
        <dl className={styles.supportList}>
          {currentSupport.map((item) => (
            <div key={item.id} className={styles.supportItem}>
              <dt>{item.label}</dt>
              <dd>{item.body}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className={styles.detailSection} aria-labelledby="demo-ux-plan-heading">
        <h2 id="demo-ux-plan-heading">支援計画</h2>
        <p>{planPeriodLabel}</p>
        <button
          type="button"
          className={styles.backButton}
          disabled={!onSupportPlanRequest}
          aria-disabled={!onSupportPlanRequest ? "true" : undefined}
          data-demo-ux="user-detail-open-plan"
          data-demo-ux-plan-preview={onSupportPlanRequest ? "true" : "false"}
          onClick={onSupportPlanRequest}
        >
          支援計画を表示
        </button>
      </section>

      <section className={styles.detailSection} aria-labelledby="demo-ux-records-heading">
        <h2 id="demo-ux-records-heading">最近の記録</h2>
        <ul className={styles.recordList}>
          {recentRecords.map((record) => (
            <li key={record.id}>
              <span>{record.occurredAtLabel}</span>
              <span>{record.recordTypeLabel}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.detailSection} aria-labelledby="demo-ux-evaluation-heading">
        <h2 id="demo-ux-evaluation-heading">評価</h2>
        <p>{evaluationSummary}</p>
      </section>

      <section className={styles.detailSection} aria-labelledby="demo-ux-history-heading">
        <h2 id="demo-ux-history-heading">履歴</h2>
        <p>{historySummary}</p>
      </section>

      <div className={styles.stateGrid}>
        <section className={styles.statePanel} aria-labelledby="demo-ux-business-facts-heading">
          <h2 id="demo-ux-business-facts-heading">制度・業務情報（合成表示）</h2>
          <dl>
            <div>
              <dt>作成者</dt>
              <dd>{businessFacts.createdByLabel}</dd>
            </div>
            <div>
              <dt>資格</dt>
              <dd>{businessFacts.qualificationLabel}</dd>
            </div>
            <div>
              <dt>作成日</dt>
              <dd>{businessFacts.createdAtLabel}</dd>
            </div>
          </dl>
        </section>

        <section className={styles.statePanel} aria-labelledby="demo-ux-system-state-heading">
          <h2 id="demo-ux-system-state-heading">システム状態</h2>
          <dl>
            <div>
              <dt>保存状態</dt>
              <dd>{systemState.saveStateLabel}</dd>
            </div>
            <div>
              <dt>最終更新</dt>
              <dd>{systemState.lastUpdatedLabel}</dd>
            </div>
          </dl>
        </section>
      </div>
    </section>
  );
};
