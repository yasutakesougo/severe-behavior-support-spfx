import * as React from "react";
import { EmptyNotice, StatusBadge } from "../primitives";
import {
  FIELD_WORKFLOW_HISTORICAL_UNRESOLVED_NOTE,
  FIELD_WORKFLOW_NO_AUTO_JUDGE_NOTE,
  FIELD_WORKFLOW_OBSERVATION_ASSOCIATION_SUCCESSFUL_EMPTY_NOTE,
  labelForProcedureRecordResult,
  associateReviewObservations,
  resolveProcedureReviewProjection,
  type ReviewObservationEvidenceInput,
  type ShellProcedureReviewMaterial,
} from "../procedure";
import { DEMO_UX_11_SLICE } from "../ux/demo-note-consolidation";
import { DEMO_KPI_FAMILY_A_NOTE, DEMO_UX_10_SLICE } from "../ux/kpi-review-count";
import {
  SHELL_DEFAULT_PRESENTATION_ROLE,
  isAdminAuditPresentationRole,
  type ShellPresentationRole,
} from "../ux/presentation-role";
import {
  DEMO_REVIEW_DUE_ATTENTION_EMPTY_NOTE,
  DEMO_REVIEW_DUE_CALCULATION_DISABLED_NOTE,
  DEMO_REVIEW_DUE_MUTATION_DISABLED_NOTE,
  DEMO_REVIEW_DUE_ADMIN_READ_NOTE,
} from "./review-due-copy";
import { SUPPORT_PLAN_REVIEW_TO_NEXT_VERSION_CTA } from "../users/support-plan-copy";
import { VP5_REVIEW_SLICE } from "./review-due-fixture";
import type { ShellReviewDueStatePresentation } from "./review-due-types";
import styles from "./ReviewDueStateUx.module.scss";

export type ReviewDueStateProps = Readonly<{
  presentation: ShellReviewDueStatePresentation;
  headingRef?: React.Ref<HTMLHeadingElement>;
  onBackToOverview?: () => void;
  backLabel?: string;
  /** SUPPORT-PLAN-REVIEW-NEW-VERSION-DEMO-1: presentation-only return to next-version concept. */
  onNextVersionConceptRequest?: () => void;
  /** FIELD-WORKFLOW #356 FW-07 materials (optional). */
  procedureReviewMaterials?: readonly ShellProcedureReviewMaterial[];
  reviewObservationEvidence?: readonly ReviewObservationEvidenceInput[];
  presentationRole?: ShellPresentationRole;
}>;

/**
 * DEMO-UX-6 presentation-only review status & due-state screen.
 * Synthetic fixture only — no due calculation, review mutation, or live I/O.
 * DEMO-UX-11 removes duplicate screen-level synthetic band; Family A / mutation remain.
 * DADS-UX-5: presentation tokens/focus; StatusBadge soft; INV-17 EmptyNotice.
 */
export const ReviewDueState: React.FC<ReviewDueStateProps> = ({
  presentation,
  headingRef,
  onBackToOverview,
  backLabel = "← 概要",
  onNextVersionConceptRequest,
  procedureReviewMaterials = [],
  reviewObservationEvidence = [],
  presentationRole = SHELL_DEFAULT_PRESENTATION_ROLE,
}) => {
  const { heading, summaryPrompt, attentionSummary, attentionItems, businessFacts, systemState } =
    presentation;
  const { semanticBasis } = presentation;
  const showAttentionEmpty = attentionItems.length === 0;
  const adminRead = isAdminAuditPresentationRole(presentationRole);
  const [selectedMaterialId, setSelectedMaterialId] = React.useState<string | undefined>();
  const selectedMaterial = procedureReviewMaterials.find((item) => item.id === selectedMaterialId);
  const selectedProjection = selectedMaterial
    ? resolveProcedureReviewProjection(selectedMaterial)
    : undefined;
  const selectedObservationAssociation = selectedMaterial
    ? associateReviewObservations(selectedMaterial, reviewObservationEvidence)
    : undefined;

  return (
    <section
      className={styles.reviewDueState}
      data-demo-ux="review-due-state"
      data-demo-ux-10-slice={DEMO_UX_10_SLICE.id}
      data-demo-ux-11-slice={DEMO_UX_11_SLICE.id}
      data-review-visual-polish={VP5_REVIEW_SLICE.id}
      data-presentation-role={presentationRole}
      aria-labelledby="demo-ux-review-due-heading"
    >
      <h1
        id="demo-ux-review-due-heading"
        ref={headingRef}
        tabIndex={-1}
        className={styles.reviewHeading}
        data-review-visual-role="page-title"
        data-demo-ux="review-due-heading"
      >
        {heading}
      </h1>
      <div className={styles.topRow}>
        <button
          type="button"
          className={styles.backButton}
          onClick={onBackToOverview}
          disabled={!onBackToOverview}
          aria-disabled={!onBackToOverview ? "true" : undefined}
          data-demo-ux="review-due-back"
        >
          {backLabel}
        </button>
      </div>
      <p className={styles.summaryPrompt}>{summaryPrompt}</p>

      <section
        className={`${styles.section} ${styles.resultSection}`}
        data-review-visual-surface="basis"
        aria-labelledby="demo-ux-review-basis-heading"
      >
        <div className={styles.sectionHeader}>
          <div>
            <p className={styles.sectionKicker}>判定の前提</p>
            <h2 id="demo-ux-review-basis-heading" data-review-visual-role="section-title">
              基準日・due・通知開始
            </h2>
          </div>
          <span className={styles.boundaryTag}>意味固定</span>
        </div>
        <ul className={styles.summaryList} data-demo-ux="review-due-semantic-basis">
          <li className={styles.summaryCard} data-demo-ux="review-due-origin-basis">
            {semanticBasis.originLabel}
          </li>
          <li className={styles.summaryCard} data-demo-ux="review-due-due-basis">
            {semanticBasis.dueLabel}
          </li>
          <li className={styles.summaryCard} data-demo-ux="review-due-approaching-basis">
            {semanticBasis.approachingLabel}
          </li>
        </ul>
      </section>

      <section
        className={`${styles.section} ${styles.resultSection}`}
        data-review-visual-surface="result"
        aria-labelledby="demo-ux-review-summary-heading"
      >
        <div className={styles.sectionHeader}>
          <div>
            <p className={styles.sectionKicker}>見直し結果（表示）</p>
            <h2 id="demo-ux-review-summary-heading" data-review-visual-role="section-title">
              見直し・期限の要約
            </h2>
          </div>
          <span className={styles.boundaryTag}>表示専用</span>
        </div>
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

      <section
        className={`${styles.section} ${styles.resultSection}`}
        data-review-visual-surface="result"
        aria-labelledby="demo-ux-review-attention-heading"
      >
        <div className={styles.sectionHeader}>
          <div>
            <p className={styles.sectionKicker}>見直し結果（表示）</p>
            <h2 id="demo-ux-review-attention-heading" data-review-visual-role="section-title">
              確認が必要な対象
            </h2>
          </div>
          <span className={styles.boundaryTag}>表示専用</span>
        </div>
        {showAttentionEmpty ? (
          // INV-17: attention zero-result only — not “all clear” / calculation failure.
          <EmptyNotice
            announce
            className={styles.calculationNote}
            dataAttrs={{ "data-demo-ux": "review-due-attention-empty-note" }}
          >
            {DEMO_REVIEW_DUE_ATTENTION_EMPTY_NOTE}
          </EmptyNotice>
        ) : (
          <ul className={styles.cardList} data-demo-ux="review-due-attention-list">
            {attentionItems.map((item) => (
              <li key={item.id} className={styles.card} data-demo-ux="review-due-attention-item">
                <div className={styles.cardMain}>
                  <strong>{item.personLabel}</strong>
                  <p>{item.subjectLabel}</p>
                  <p>{item.reasonLabel}</p>
                </div>
                <div className={styles.badgeColumn}>
                  {/* INV-13: StatusBadge soft matches prior Review radius dialect; label = meaning. */}
                  <StatusBadge
                    shape="soft"
                    label={item.reviewStatusLabel}
                    className={styles.reviewStatusBadge}
                    dataAttrs={{ "data-demo-ux": "review-status-label" }}
                  />
                  {item.dueStateLabel ? (
                    <StatusBadge
                      shape="soft"
                      label={item.dueStateLabel}
                      className={styles.dueStateBadge}
                      dataAttrs={{ "data-demo-ux": "due-state-label" }}
                    />
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section
        className={`${styles.section} ${styles.materialsSection}`}
        data-review-visual-surface="materials"
        data-field-workflow="review-materials-section"
        aria-labelledby="field-workflow-review-materials-heading"
      >
        <div className={styles.sectionHeader}>
          <div>
            <p className={styles.sectionKicker}>見直し材料</p>
            <h2
              id="field-workflow-review-materials-heading"
              data-review-visual-role="section-title"
            >
              見直し材料（支援手順記録）
            </h2>
          </div>
          <span className={styles.boundaryTag}>記録された事実</span>
        </div>
        <p className={styles.calculationNote} data-field-workflow="review-no-auto-judge">
          {FIELD_WORKFLOW_NO_AUTO_JUDGE_NOTE}
        </p>
        {procedureReviewMaterials.length === 0 ? (
          <EmptyNotice
            announce
            className={styles.calculationNote}
            dataAttrs={{ "data-field-workflow": "review-materials-empty" }}
          >
            表示できる支援手順記録の材料はありません（合成 0 件）。
          </EmptyNotice>
        ) : (
          <ul className={styles.cardList} data-field-workflow="review-materials-list">
            {procedureReviewMaterials.map((item) => {
              const isHistoricalResolved = item.historicalLookupStatus === "RESOLVED";
              return (
                <li
                  key={item.id}
                  className={`${styles.card} ${styles.materialCard} ${
                    isHistoricalResolved
                      ? styles.materialCardResolved
                      : styles.materialCardUnresolved
                  }`}
                  data-field-workflow="review-material-item"
                  data-review-visual-material-state={
                    isHistoricalResolved ? "historical-resolved" : "historical-unresolved"
                  }
                >
                  <div className={styles.cardMain}>
                    <div className={styles.materialHeading}>
                      <strong>{item.personLabel}</strong>
                      <span
                        className={
                          isHistoricalResolved
                            ? `${styles.referenceState} ${styles.referenceStateResolved}`
                            : `${styles.referenceState} ${styles.referenceStateUnresolved}`
                        }
                        data-review-visual-reference-state={
                          isHistoricalResolved ? "resolved" : "unresolved"
                        }
                      >
                        {isHistoricalResolved ? "履歴参照あり" : "履歴参照未解決"}
                      </span>
                    </div>
                    <p className={styles.materialResult}>
                      {labelForProcedureRecordResult(item.result)}
                    </p>
                    <p className={styles.cardMeta}>
                      plan v{item.planVersion} / {item.performedAtLabel}
                    </p>
                  </div>
                  <div className={styles.badgeColumn}>
                    <StatusBadge
                      shape="soft"
                      label={labelForProcedureRecordResult(item.result)}
                      className={styles.materialResultBadge}
                      dataAttrs={{
                        "data-field-workflow": "review-material-result",
                        "data-field-workflow-result": item.result,
                      }}
                    />
                    <button
                      type="button"
                      className={styles.detailButton}
                      data-field-workflow="review-material-open"
                      data-field-workflow-material-id={item.id}
                      onClick={() => {
                        setSelectedMaterialId(item.id);
                      }}
                    >
                      元記録を表示
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
        {selectedMaterial && selectedProjection ? (
          <div
            className={`${styles.card} ${styles.materialDetail}`}
            data-field-workflow="review-material-detail"
            data-field-workflow-material-id={selectedMaterial.id}
            data-field-workflow-plan-version={String(selectedMaterial.planVersion)}
            data-field-workflow-historical-status={selectedMaterial.historicalLookupStatus}
            data-review-visual-detail-state={
              selectedProjection.status === "RESOLVED"
                ? "historical-resolved"
                : "historical-unresolved"
            }
          >
            <h3 data-review-visual-role="detail-title">元 ProcedureRecord</h3>
            <p>
              result: {labelForProcedureRecordResult(selectedMaterial.result)}（失敗扱いしません）
            </p>
            <p>
              planId / planVersion: {selectedMaterial.planId} / v{selectedMaterial.planVersion}
            </p>
            <p>
              Procedure: {selectedMaterial.procedureId} / {selectedMaterial.procedureVersion}
            </p>
            <p>
              performedAt / recordedAt: {selectedMaterial.performedAtLabel} /{" "}
              {selectedMaterial.recordedAtLabel}
            </p>
            {selectedProjection.status === "RESOLVED" ? (
              <div data-field-workflow="review-projection-resolved">
                <p>歴史的 planVersion からの投影（最新版へ付け替えない）</p>
                <ul>
                  {selectedProjection.supportMethods.map((method) => (
                    <li key={method}>{method}</li>
                  ))}
                </ul>
                <ul>
                  {selectedProjection.precautions.map((precaution) => (
                    <li key={precaution}>{precaution}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <p data-field-workflow="review-projection-unresolved">
                {FIELD_WORKFLOW_HISTORICAL_UNRESOLVED_NOTE}（理由: {selectedProjection.reason}）
              </p>
            )}
            {selectedObservationAssociation ? (
              <div
                data-field-workflow="review-observation-association"
                data-field-workflow-association-state={selectedObservationAssociation.status}
                data-field-workflow-association-empty={
                  selectedObservationAssociation.status === "ASSOCIATED" &&
                  selectedObservationAssociation.observations.length === 0
                    ? "true"
                    : "false"
                }
              >
                <h4>関連する観察記録</h4>
                {selectedObservationAssociation.status === "ASSOCIATED" ? (
                  selectedObservationAssociation.observations.length === 0 ? (
                    <p data-field-workflow="review-observation-successful-empty">
                      {FIELD_WORKFLOW_OBSERVATION_ASSOCIATION_SUCCESSFUL_EMPTY_NOTE}
                    </p>
                  ) : (
                    <ul data-field-workflow="review-observation-evidence-list">
                      {selectedObservationAssociation.observations.map((observation) => (
                        <li key={observation.observationRecordId}>
                          {observation.observationRecordId} / {observation.observedAt} /{" "}
                          {observation.observedBy}
                        </li>
                      ))}
                    </ul>
                  )
                ) : (
                  <p data-field-workflow="review-observation-unresolved">
                    観察記録の関連付けは未解決です（理由: {selectedObservationAssociation.reason}
                    ）。
                  </p>
                )}
              </div>
            ) : null}
          </div>
        ) : null}
        {onNextVersionConceptRequest ? (
          <p>
            <button
              type="button"
              className={styles.detailButton}
              onClick={onNextVersionConceptRequest}
              data-review-new-version="from-review-cta"
            >
              {SUPPORT_PLAN_REVIEW_TO_NEXT_VERSION_CTA}
            </button>
          </p>
        ) : null}
      </section>

      <section
        className={`${styles.section} ${styles.readonlySection}`}
        data-review-visual-surface="reference-only-actions"
        aria-labelledby="demo-ux-review-mutation-heading"
      >
        <h2 id="demo-ux-review-mutation-heading" data-review-visual-role="section-title">
          {adminRead ? "確認（読み取り専用）" : "見直し操作（表示専用）"}
        </h2>
        {adminRead ? (
          <p className={styles.mutationNote} data-demo-ux="review-due-admin-read-note">
            {DEMO_REVIEW_DUE_ADMIN_READ_NOTE}
          </p>
        ) : (
          <>
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
          </>
        )}
      </section>

      <div className={styles.stateGrid}>
        <section className={styles.statePanel} aria-labelledby="demo-ux-review-business-heading">
          <h2 id="demo-ux-review-business-heading" data-review-visual-role="section-title">
            制度・業務情報（合成表示）
          </h2>
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
          <h2 id="demo-ux-review-system-heading" data-review-visual-role="section-title">
            システム状態
          </h2>
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
