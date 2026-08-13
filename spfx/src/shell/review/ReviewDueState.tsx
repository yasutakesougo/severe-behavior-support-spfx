import * as React from "react";
import { DEMO_UX_11_SLICE } from "../ux/demo-note-consolidation";
import { DEMO_KPI_FAMILY_A_NOTE, DEMO_UX_10_SLICE } from "../ux/kpi-review-count";
import {
  DEMO_REVIEW_DUE_CALCULATION_DISABLED_NOTE,
  DEMO_REVIEW_DUE_MUTATION_DISABLED_NOTE,
} from "./review-due-copy";
import type { ShellReviewDueStatePresentation } from "./review-due-types";
import styles from "./ReviewDueStateUx.module.scss";

export type ReviewDueStateProps = Readonly<{
  presentation: ShellReviewDueStatePresentation;
  headingRef?: React.Ref<HTMLHeadingElement>;
  onBackToOverview?: () => void;
}>;

/**
 * DEMO-UX-6 presentation-only review status & due-state screen.
 * Synthetic fixture only — no due calculation, review mutation, or live I/O.
 * DEMO-UX-11 removes duplicate screen-level synthetic band; Family A / mutation remain.
 */
export const ReviewDueState: React.FC<ReviewDueStateProps> = ({
  presentation,
  headingRef,
  onBackToOverview,
}) => {
  const { heading, summaryPrompt, attentionSummary, attentionItems, businessFacts, systemState } =
    presentation;

  return (
    <section
      className={styles.reviewDueState}
      data-demo-ux="review-due-state"
      data-demo-ux-10-slice={DEMO_UX_10_SLICE.id}
      data-demo-ux-11-slice={DEMO_UX_11_SLICE.id}
      aria-labelledby="demo-ux-review-due-heading"
    >
      <div className={styles.topRow}>
        <button
          type="button"
          className={styles.backButton}
          onClick={onBackToOverview}
          disabled={!onBackToOverview}
          aria-disabled={!onBackToOverview ? "true" : undefined}
          data-demo-ux="review-due-back"
        >
          ← 概要
        </button>
      </div>

      <h1
        id="demo-ux-review-due-heading"
        ref={headingRef}
        tabIndex={-1}
        data-demo-ux="review-due-heading"
      >
        {heading}
      </h1>
      <p className={styles.summaryPrompt}>{summaryPrompt}</p>

      <section className={styles.section} aria-labelledby="demo-ux-review-summary-heading">
        <h2 id="demo-ux-review-summary-heading">見直し・期限の要約</h2>
        <p className={styles.calculationNote} data-demo-ux="review-due-calculation-note">
          {DEMO_REVIEW_DUE_CALCULATION_DISABLED_NOTE}
        </p>
        <p
          className={styles.calculationNote}
          data-demo-ux="review-due-family-a-note"
          data-demo-ux-metric-family="attention"
        >
          {DEMO_KPI_FAMILY_A_NOTE}
        </p>
        <ul className={styles.summaryList} data-demo-ux="review-due-summary-list">
          <li
            className={styles.summaryCard}
            data-demo-ux="review-due-summary-awaiting"
            data-demo-ux-metric-family="attention"
          >
            {attentionSummary.awaitingConfirmationCountLabel}
          </li>
          <li
            className={styles.summaryCard}
            data-demo-ux="review-due-summary-due-soon"
            data-demo-ux-metric-family="attention"
          >
            {attentionSummary.dueSoonCountLabel}
          </li>
        </ul>
      </section>

      <section className={styles.section} aria-labelledby="demo-ux-review-attention-heading">
        <h2 id="demo-ux-review-attention-heading">確認が必要な対象</h2>
        <ul className={styles.cardList} data-demo-ux="review-due-attention-list">
          {attentionItems.map((item) => (
            <li key={item.id} className={styles.card} data-demo-ux="review-due-attention-item">
              <div className={styles.cardMain}>
                <strong>{item.personLabel}</strong>
                <p>{item.subjectLabel}</p>
                <p>{item.reasonLabel}</p>
              </div>
              <div className={styles.badgeColumn}>
                <span className={styles.statusBadge} data-demo-ux="review-status-label">
                  {item.reviewStatusLabel}
                </span>
                {item.dueStateLabel ? (
                  <span className={styles.dueBadge} data-demo-ux="due-state-label">
                    {item.dueStateLabel}
                  </span>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.section} aria-labelledby="demo-ux-review-mutation-heading">
        <h2 id="demo-ux-review-mutation-heading">見直し操作（表示専用）</h2>
        <p className={styles.mutationNote} data-demo-ux="review-due-mutation-note">
          {DEMO_REVIEW_DUE_MUTATION_DISABLED_NOTE}
        </p>
        <div className={styles.actionRow}>
          <button
            type="button"
            disabled
            aria-disabled="true"
            data-demo-ux="review-due-mutation-button"
          >
            見直しを完了する
          </button>
          <button
            type="button"
            disabled
            aria-disabled="true"
            data-demo-ux="review-due-mutation-button"
          >
            評価を更新する
          </button>
        </div>
      </section>

      <div className={styles.stateGrid}>
        <section className={styles.statePanel} aria-labelledby="demo-ux-review-business-heading">
          <h2 id="demo-ux-review-business-heading">制度・業務情報（合成表示）</h2>
          <dl>
            <div>
              <dt>対象範囲</dt>
              <dd>{businessFacts.reviewScopeLabel}</dd>
            </div>
            <div>
              <dt>担当</dt>
              <dd>{businessFacts.responsibleRoleLabel}</dd>
            </div>
          </dl>
        </section>
        <section className={styles.statePanel} aria-labelledby="demo-ux-review-system-heading">
          <h2 id="demo-ux-review-system-heading">システム状態</h2>
          <dl>
            <div>
              <dt>保存状態</dt>
              <dd>{systemState.saveStateLabel}</dd>
            </div>
            <div>
              <dt>データ元</dt>
              <dd>{systemState.dataSourceLabel}</dd>
            </div>
          </dl>
        </section>
      </div>
    </section>
  );
};
