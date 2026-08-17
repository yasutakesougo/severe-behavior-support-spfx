import * as React from "react";
import { SectionLabelStrip } from "../primitives";
import { DEMO_UX_11_SLICE } from "../ux/demo-note-consolidation";
import {
  SHELL_DEFAULT_PRESENTATION_ROLE,
  isAdminAuditPresentationRole,
  userDetailSectionOrderForRole,
  userDetailStripLabelsForRole,
  type ShellPresentationRole,
  type UserDetailSectionKey,
} from "../ux/presentation-role";
import type { ShellUserDetailPresentation } from "./user-detail-types";
import styles from "./UserDetailUx.module.scss";

export type UserDetailProps = Readonly<{
  presentation: ShellUserDetailPresentation;
  headingRef?: React.Ref<HTMLHeadingElement>;
  onBackToUsers?: () => void;
  onSupportPlanRequest?: () => void;
  /** FIELD-WORKFLOW #356 — open current procedure summary (FW-01). */
  onCurrentProcedureRequest?: () => void;
  presentationRole?: ShellPresentationRole;
}>;

/**
 * DEMO-UX-3 user detail presentation skeleton.
 * DEMO-UX-4 may opt the support-plan section into a synthetic local preview.
 * Synthetic fixture only — no live user, plan, record, auth, or adapter connection.
 * DEMO-UX-11 removes duplicate screen-level synthetic band (global DemoBanner remains).
 * VP-G: presentationRole reorders Assessment → Plan emphasis; FIELD_STAFF order KEEP.
 */
export const UserDetail: React.FC<UserDetailProps> = ({
  presentation,
  headingRef,
  onBackToUsers,
  onSupportPlanRequest,
  onCurrentProcedureRequest,
  presentationRole = SHELL_DEFAULT_PRESENTATION_ROLE,
}) => {
  const {
    personLabel,
    planLabel,
    planPeriodLabel,
    planLifecycleLabel,
    currentSupport,
    recentRecords,
    evaluationSummary,
    historySummary,
    businessFacts,
    systemState,
  } = presentation;
  const stripLabels = userDetailStripLabelsForRole(presentationRole);
  const adminRead = isAdminAuditPresentationRole(presentationRole);

  const currentSupportSection = (
    <section
      className={styles.detailSection}
      aria-labelledby="demo-ux-current-support-heading"
      data-user-detail-section="currentSupport"
    >
      <h2 id="demo-ux-current-support-heading">現在の支援</h2>
      <p className={styles.planLabel}>
        {planLabel} <span>{planPeriodLabel}</span>
      </p>
      <p className={styles.sectionHint} data-demo-ux="user-detail-plan-lifecycle">
        {planLifecycleLabel}
      </p>
      <dl className={styles.supportList}>
        {currentSupport.map((item) => (
          <div key={item.id} className={styles.supportItem}>
            <dt>{item.label}</dt>
            <dd>{item.body}</dd>
          </div>
        ))}
      </dl>
      {adminRead ? (
        <p className={styles.sectionHint} data-demo-ux="user-detail-procedure-read-note">
          支援手順は確認できます。ここから記録の作成はしません。
        </p>
      ) : null}
      <button
        type="button"
        className={styles.backButton}
        disabled={!onCurrentProcedureRequest}
        aria-disabled={!onCurrentProcedureRequest ? "true" : undefined}
        data-demo-ux="user-detail-open-current-procedure"
        data-field-workflow="open-current-procedure"
        onClick={onCurrentProcedureRequest}
      >
        {adminRead ? "現在の支援手順を表示（確認）" : "現在の支援手順を確認"}
      </button>
    </section>
  );

  const supportPlanSection = (
    <section
      className={styles.detailSection}
      aria-labelledby="demo-ux-plan-heading"
      data-user-detail-section="supportPlan"
    >
      <h2 id="demo-ux-plan-heading">支援計画</h2>
      <p>{planPeriodLabel}</p>
      <p className={styles.sectionHint} data-demo-ux="user-detail-plan-lifecycle-plan">
        {planLifecycleLabel}
      </p>
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
  );

  const recentRecordsSection = (
    <section
      className={styles.detailSection}
      aria-labelledby="demo-ux-user-detail-recent-records-heading"
      data-user-detail-section="recentRecords"
    >
      <h2 id="demo-ux-user-detail-recent-records-heading">最近の記録</h2>
      <ul className={styles.recordList}>
        {recentRecords.map((record) => (
          <li key={record.id}>
            <span>{record.occurredAtLabel}</span>
            <span>{record.recordTypeLabel}</span>
          </li>
        ))}
      </ul>
    </section>
  );

  const evaluationSection = (
    <section
      className={styles.detailSection}
      aria-labelledby="demo-ux-evaluation-heading"
      data-user-detail-section="evaluation"
    >
      <h2 id="demo-ux-evaluation-heading">評価</h2>
      <p>{evaluationSummary}</p>
    </section>
  );

  const historySection = (
    <section
      className={styles.detailSection}
      aria-labelledby="demo-ux-history-heading"
      data-user-detail-section="history"
    >
      <h2 id="demo-ux-history-heading">履歴</h2>
      <p>{historySummary}</p>
    </section>
  );

  const sectionByKey: Record<UserDetailSectionKey, React.ReactNode> = {
    currentSupport: currentSupportSection,
    supportPlan: supportPlanSection,
    recentRecords: recentRecordsSection,
    evaluation: evaluationSection,
    history: historySection,
  };

  return (
    <section
      className={styles.userDetail}
      data-demo-ux="user-detail"
      data-demo-ux-11-slice={DEMO_UX_11_SLICE.id}
      data-presentation-role={presentationRole}
      aria-labelledby="demo-ux-user-detail-heading"
    >
      <h1
        id="demo-ux-user-detail-heading"
        ref={headingRef}
        tabIndex={-1}
        className={styles.userHeading}
        data-demo-ux="user-detail-heading"
      >
        {personLabel}
      </h1>
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
      </div>

      {/* INV-07 B: non-tab section-order labels via SectionLabelStrip (not ARIA tabs). */}
      <SectionLabelStrip
        ariaLabel="利用者詳細の表示順"
        items={stripLabels.map((label, index) => ({
          id: label,
          label,
          current: index === 0,
          dataAttrs: {
            "data-demo-ux": "user-detail-section-label",
            "data-demo-ux-plan-preview": "false",
          },
        }))}
      />

      {userDetailSectionOrderForRole(presentationRole).map((key) => (
        <React.Fragment key={key}>{sectionByKey[key]}</React.Fragment>
      ))}

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
