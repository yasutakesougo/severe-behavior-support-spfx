import * as React from "react";
import { DEMO_UX_11_SLICE } from "../ux/demo-note-consolidation";
import {
  SHELL_DEFAULT_PRESENTATION_ROLE,
  isAdminAuditPresentationRole,
  supportPlanBlockOrderForRole,
  type ShellPresentationRole,
  type SupportPlanBlockKey,
} from "../ux/presentation-role";
import {
  DEMO_SUPPORT_PLAN_ADMIN_READ_NOTE,
  DEMO_SUPPORT_PLAN_MUTATION_DISABLED_NOTE,
} from "./support-plan-copy";
import type { ShellSupportPlanPresentation } from "./support-plan-types";
import { SemanticIcon } from "../primitives";
import styles from "./SupportPlanUx.module.scss";

export type SupportPlanProps = Readonly<{
  presentation: ShellSupportPlanPresentation;
  headingRef?: React.Ref<HTMLHeadingElement>;
  onBackToUserDetail?: () => void;
  presentationRole?: ShellPresentationRole;
}>;

const MUTATION_LABELS = ["作成する", "編集する", "保存する"] as const;

/**
 * DEMO-UX-4 support plan presentation skeleton.
 * Synthetic fixture only — no live plan mutation, auth, or adapter connection.
 * VP-G: PLANNER monitoring prominence; ADMIN_AUDIT read-oriented mutation chrome.
 */
export const SupportPlan: React.FC<SupportPlanProps> = ({
  presentation,
  headingRef,
  onBackToUserDetail,
  presentationRole = SHELL_DEFAULT_PRESENTATION_ROLE,
}) => {
  const {
    personLabel,
    planTitle,
    planPeriodLabel,
    planLifecycleLabel,
    summary,
    goals,
    actionItems,
    reviewStatus,
    businessFacts,
    systemState,
  } = presentation;
  const adminRead = isAdminAuditPresentationRole(presentationRole);

  const summaryBlock = (
    <section className={styles.detailSection} aria-labelledby="demo-ux-plan-summary-heading">
      <h2 id="demo-ux-plan-summary-heading">計画の概要</h2>
      <p data-demo-ux="support-plan-summary">{summary}</p>
    </section>
  );

  const goalsBlock = (
    <section className={styles.detailSection} aria-labelledby="demo-ux-plan-goals-heading">
      <h2 id="demo-ux-plan-goals-heading">支援の目標</h2>
      <ul className={styles.goalList} data-demo-ux="support-plan-goal-list">
        {goals.map((goal) => (
          <li key={goal.id} className={styles.goalItem} data-demo-ux="support-plan-goal">
            <p className={styles.goalLabel}>{goal.label}</p>
            <p className={styles.goalBody}>{goal.body}</p>
          </li>
        ))}
      </ul>
    </section>
  );

  const actionsBlock = (
    <section className={styles.detailSection} aria-labelledby="demo-ux-plan-actions-heading">
      <h2 id="demo-ux-plan-actions-heading">具体的な支援内容</h2>
      <ul className={styles.actionList} data-demo-ux="support-plan-action-list">
        {actionItems.map((item) => (
          <li key={item.id} className={styles.actionItem} data-demo-ux="support-plan-action">
            <p className={styles.actionCategory}>{item.categoryLabel}</p>
            <p className={styles.actionBody}>{item.body}</p>
          </li>
        ))}
      </ul>
    </section>
  );

  const reviewBlock = (
    <section className={styles.detailSection} aria-labelledby="demo-ux-plan-review-heading">
      <div className={styles.sectionHeaderWithIcon}>
        <SemanticIcon name="monitoring" size={20} className={styles.sectionHeaderIcon} />
        <h2 id="demo-ux-plan-review-heading">見直し状況</h2>
      </div>
      <div className={styles.reviewPanel} data-demo-ux="support-plan-review">
        <p className={styles.reviewStatus}>{reviewStatus.reviewStatusLabel}</p>
        <p>{reviewStatus.reviewDueLabel}</p>
        <p>{reviewStatus.attentionNote}</p>
      </div>
    </section>
  );

  const mutationBlock = (
    <section className={styles.detailSection} aria-labelledby="demo-ux-plan-mutation-heading">
      <h2 id="demo-ux-plan-mutation-heading">
        {adminRead ? "確認（読み取り専用）" : "計画操作（表示専用）"}
      </h2>
      {adminRead ? (
        <p className={styles.sectionHint} data-demo-ux="support-plan-admin-read-note">
          {DEMO_SUPPORT_PLAN_ADMIN_READ_NOTE}
        </p>
      ) : (
        <>
          <p className={styles.sectionHint} data-demo-ux="support-plan-mutation-note">
            {DEMO_SUPPORT_PLAN_MUTATION_DISABLED_NOTE}
          </p>
          <div className={styles.mutationButtons}>
            {MUTATION_LABELS.map((label) => (
              <button
                key={label}
                type="button"
                className={styles.mutationButton}
                disabled
                aria-disabled="true"
                data-demo-ux="support-plan-mutation-button"
              >
                {label}
              </button>
            ))}
          </div>
        </>
      )}
    </section>
  );

  const blockByKey: Record<SupportPlanBlockKey, React.ReactNode> = {
    summary: summaryBlock,
    goals: goalsBlock,
    actions: actionsBlock,
    review: reviewBlock,
    mutation: mutationBlock,
  };

  return (
    <section
      className={styles.supportPlan}
      data-demo-ux="support-plan"
      data-demo-ux-11-slice={DEMO_UX_11_SLICE.id}
      data-presentation-role={presentationRole}
      aria-labelledby="demo-ux-support-plan-heading"
    >
      <div className={styles.headingTitleRow}>
        <SemanticIcon name="supportPlan" size={28} className={styles.titleIcon} />
        <h1
          id="demo-ux-support-plan-heading"
          ref={headingRef}
          tabIndex={-1}
          className={styles.planHeading}
          data-demo-ux="support-plan-heading"
        >
          {planTitle}
        </h1>
      </div>
      <div className={styles.topRow}>
        <button
          type="button"
          className={styles.backButton}
          onClick={onBackToUserDetail}
          disabled={!onBackToUserDetail}
          aria-disabled={!onBackToUserDetail ? "true" : undefined}
          data-demo-ux="support-plan-back"
        >
          ← 利用者詳細
        </button>
      </div>
      <p className={styles.personSubheading} data-demo-ux="support-plan-person">
        {personLabel}
      </p>
      <p className={styles.periodLabel} data-demo-ux="support-plan-period">
        {planPeriodLabel}
      </p>
      <p className={styles.periodLabel} data-demo-ux="support-plan-lifecycle">
        {planLifecycleLabel}
      </p>

      {supportPlanBlockOrderForRole(presentationRole).map((key) => (
        <React.Fragment key={key}>{blockByKey[key]}</React.Fragment>
      ))}

      <div className={styles.stateGrid}>
        <section
          className={styles.statePanel}
          aria-labelledby="demo-ux-plan-business-facts-heading"
        >
          <h2 id="demo-ux-plan-business-facts-heading">制度・業務情報（合成表示）</h2>
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

        <section className={styles.statePanel} aria-labelledby="demo-ux-plan-system-state-heading">
          <h2 id="demo-ux-plan-system-state-heading">システム状態</h2>
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
