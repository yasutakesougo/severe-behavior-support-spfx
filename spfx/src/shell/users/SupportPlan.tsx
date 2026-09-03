import * as React from "react";
import {
  buildDemoMonitoringForVersion,
  MonitoringView,
  MONITORING_LINK_SLICE_A,
} from "../monitoring";
import type { SyntheticCapturedReview } from "../monitoring/review-outcome-capture";
import { labelForProcedureRecordResult } from "../procedure/procedure-copy";
import { SemanticIcon, StatusBadge } from "../primitives";
import { DEMO_UX_11_SLICE } from "../ux/demo-note-consolidation";
import {
  SHELL_DEFAULT_PRESENTATION_ROLE,
  isAdminAuditPresentationRole,
  isPlanningPcPresentationRole,
  supportPlanBlockOrderForRole,
  type ShellPresentationRole,
  type SupportPlanBlockKey,
} from "../ux/presentation-role";
import {
  DEMO_SUPPORT_PLAN_ADMIN_READ_NOTE,
  DEMO_SUPPORT_PLAN_MUTATION_DISABLED_NOTE,
  SUPPORT_PLAN_CURRENT_PROCEDURES_HEADING,
  SUPPORT_PLAN_HISTORICAL_RECORD_NOTE,
  SUPPORT_PLAN_IMMUTABLE_VERSION_NOTE,
  SUPPORT_PLAN_NEXT_VERSION_CTA,
  SUPPORT_PLAN_NEXT_VERSION_HEADING,
  SUPPORT_PLAN_NEXT_VERSION_NOTE,
  SUPPORT_PLAN_NOT_FINAL_APPROVAL_NOTE,
  SUPPORT_PLAN_OBSERVATION_NOT_INVALIDATING_NOTE,
  SUPPORT_PLAN_PAST_VERSION_READONLY_NOTE,
  PLANNING_PC_SUPPORT_PLAN_SECTION_NAVIGATION,
  SUPPORT_PLAN_RECENT_RECORDS_HEADING,
  SUPPORT_PLAN_REVIEW_MATERIALS_CTA,
  SUPPORT_PLAN_REVIEW_MATERIALS_NOTE,
  SUPPORT_PLAN_REVIEW_OVERDUE_NOT_INVALIDATING_NOTE,
  SUPPORT_PLAN_VERSION_COMPARE_HEADING,
  SUPPORT_PLAN_VERSIONS_HEADING,
} from "./support-plan-copy";
import {
  PLANNING_PC_DEMO_1_SLICE,
  SUPPORT_PLAN_REVIEW_NEW_VERSION_DEMO_1_SLICE,
} from "./support-plan-fixture";
import {
  EMPTY_SUPPORT_PLAN_REVISION_SESSION,
  startSyntheticPlanningPcRevision,
  type SupportPlanRevisionSession,
} from "./support-plan-revision-start";
import type { ShellSupportPlanPresentation } from "./support-plan-types";
import styles from "./SupportPlanUx.module.scss";

export type SupportPlanProps = Readonly<{
  presentation: ShellSupportPlanPresentation;
  headingRef?: React.Ref<HTMLHeadingElement>;
  onBackToUserDetail?: () => void;
  backLabel?: string;
  onReviewMaterialsRequest?: () => void;
  nextVersionConceptHighlighted?: boolean;
  presentationRole?: ShellPresentationRole;
}>;

const MUTATION_LABELS = ["作成する", "編集する", "保存する"] as const;

/**
 * DEMO-UX-4 support plan presentation skeleton + PLANNING-PC-DEMO-1 graph.
 * Synthetic fixture only — no live plan mutation, auth, or adapter connection.
 * VP-G / PLANNER: monitoring prominence + procedures / records / versions.
 */
export const SupportPlan: React.FC<SupportPlanProps> = ({
  presentation,
  headingRef,
  onBackToUserDetail,
  backLabel = "← 利用者詳細",
  onReviewMaterialsRequest,
  nextVersionConceptHighlighted = false,
  presentationRole = SHELL_DEFAULT_PRESENTATION_ROLE,
}) => {
  const {
    personLabel,
    planTitle,
    planPeriodLabel,
    planLifecycleLabel,
    planId,
    currentVersion,
    statusLabel,
    summary,
    goals,
    actionItems,
    reviewStatus,
    businessFacts,
    systemState,
    versions,
    currentProcedures,
    recentProcedureRecords,
    conceptualNextVersion,
  } = presentation;
  const adminRead = isAdminAuditPresentationRole(presentationRole);
  const planningPc = isPlanningPcPresentationRole(presentationRole);
  const [selectedVersion, setSelectedVersion] = React.useState(currentVersion);
  const [capturedReview, setCapturedReview] = React.useState<SyntheticCapturedReview | null>(null);
  const [revisionSession, setRevisionSession] = React.useState<SupportPlanRevisionSession>(
    EMPTY_SUPPORT_PLAN_REVISION_SESSION,
  );
  const [revisionError, setRevisionError] = React.useState<string | null>(null);
  const selectedVersionEntry = versions.find((entry) => entry.version === selectedVersion);
  const currentVersionEntry = versions.find((entry) => entry.isCurrent);
  const selectedIsCurrent = selectedVersionEntry?.isCurrent === true;
  const reviewCtaEnabled = Boolean(onReviewMaterialsRequest);
  const monitoringResult = React.useMemo(
    () => buildDemoMonitoringForVersion(selectedVersion),
    [selectedVersion],
  );
  const revisionDraft = revisionSession.drafts[0] ?? null;
  const revisionEligible = Boolean(
    planningPc &&
    selectedVersion === currentVersion &&
    capturedReview?.outcome.decision === "CHANGE_REQUIRED" &&
    capturedReview.decisionReason !== null &&
    capturedReview.decisionReason.reason.trim().length > 0 &&
    capturedReview.outcome.UserId === presentation.userId &&
    capturedReview.outcome.planId === planId &&
    capturedReview.outcome.planVersion === currentVersion,
  );
  // H-05 / C2: at most one SBS_ACTION.primary per view. While revision-start is the
  // forward CTA, demote the review-materials predecessor from primary.
  const revisionStartIsPrimaryForward = Boolean(revisionEligible && !revisionDraft && !adminRead);
  const [activePlannerSectionId, setActivePlannerSectionId] = React.useState<string>(
    PLANNING_PC_SUPPORT_PLAN_SECTION_NAVIGATION[0].id,
  );
  const focusPlannerSection = (sectionId: string): void => {
    const heading = document.getElementById(sectionId);
    if (!(heading instanceof HTMLElement)) {
      return;
    }
    setActivePlannerSectionId(sectionId);
    heading.scrollIntoView({ block: "start", inline: "nearest" });
    heading.focus();
  };
  const titleHeading = (
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
  );

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
        <h2 id="demo-ux-plan-review-heading" tabIndex={-1}>
          見直し状況
        </h2>
      </div>
      <div className={styles.reviewPanel} data-demo-ux="support-plan-review">
        <p className={styles.reviewStatus}>{reviewStatus.reviewStatusLabel}</p>
        <p>{reviewStatus.reviewDueLabel}</p>
        <p>{reviewStatus.attentionNote}</p>
        {planningPc ? (
          <>
            <p className={styles.sectionHint} data-planning-pc="review-note">
              {SUPPORT_PLAN_REVIEW_MATERIALS_NOTE}
            </p>
            <button
              type="button"
              className={
                revisionStartIsPrimaryForward
                  ? styles.reviewMaterialsButton
                  : styles.reviewMaterialsButtonPrimary
              }
              onClick={onReviewMaterialsRequest}
              disabled={!reviewCtaEnabled}
              aria-disabled={!reviewCtaEnabled ? "true" : undefined}
              data-demo-ux="support-plan-review-cta"
              data-planning-pc="review-cta"
              data-sbs-action={revisionStartIsPrimaryForward ? "tertiary" : "primary"}
              data-sbs-mgmt-loop-b-predecessor={
                revisionStartIsPrimaryForward ? "demoted" : undefined
              }
            >
              {SUPPORT_PLAN_REVIEW_MATERIALS_CTA}
            </button>
          </>
        ) : null}
      </div>
    </section>
  );

  const proceduresBlock = (
    <section className={styles.detailSection} aria-labelledby="planning-pc-plan-procedures-heading">
      <h2 id="planning-pc-plan-procedures-heading" tabIndex={-1}>
        {SUPPORT_PLAN_CURRENT_PROCEDURES_HEADING}
      </h2>
      <ul className={styles.graphList} data-planning-pc="current-procedures">
        {currentProcedures.map((procedure) => (
          <li
            key={`${procedure.procedureId}:${procedure.procedureVersion}`}
            className={styles.graphItem}
          >
            <p className={styles.graphLabel}>
              {procedure.sceneLabel}
              <span className={styles.graphMeta}> / 版 {procedure.planVersion}</span>
            </p>
            <p className={styles.sectionHint}>実施する支援</p>
            <ul>
              {procedure.performLabels.map((label) => (
                <li key={label}>{label}</li>
              ))}
            </ul>
            <p className={styles.sectionHint}>避ける対応</p>
            <ul>
              {procedure.avoidLabels.map((label) => (
                <li key={label}>{label}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </section>
  );

  const recordsBlock = (
    <section className={styles.detailSection} aria-labelledby="planning-pc-plan-records-heading">
      <h2 id="planning-pc-plan-records-heading" tabIndex={-1}>
        {SUPPORT_PLAN_RECENT_RECORDS_HEADING}
      </h2>
      <p className={styles.sectionHint} data-planning-pc="historical-record-note">
        {SUPPORT_PLAN_HISTORICAL_RECORD_NOTE}
      </p>
      <ul className={styles.graphList} data-planning-pc="recent-records">
        {recentProcedureRecords.map((record) => (
          <li key={record.id} className={styles.graphItem} data-planning-pc-record-id={record.id}>
            <p className={styles.graphLabel}>{labelForProcedureRecordResult(record.result)}</p>
            <p>
              {record.performedAtLabel} / 計画版 {record.planVersion}
            </p>
            <p className={styles.sectionHint}>
              {record.personLabel} · {record.procedureId}
            </p>
          </li>
        ))}
      </ul>
      {planningPc ? (
        <div data-monitoring-link-slice={MONITORING_LINK_SLICE_A.id}>
          {monitoringResult.status === "RESOLVED" ? (
            <MonitoringView
              model={monitoringResult.value}
              personLabel={personLabel}
              procedureLabelContext={{
                userId: presentation.userId,
                planId,
                currentVersion,
                currentProcedures,
              }}
              onCapturedReviewChange={setCapturedReview}
            />
          ) : (
            <p className={styles.sectionHint} role="status" data-monitoring-malformed="true">
              モニタリング入力を確認できません。記録または期間条件を確認してください（合成）。
            </p>
          )}
        </div>
      ) : null}
    </section>
  );

  const versionsBlock = (
    <section className={styles.detailSection} aria-labelledby="planning-pc-plan-versions-heading">
      <h2 id="planning-pc-plan-versions-heading" tabIndex={-1}>
        {SUPPORT_PLAN_VERSIONS_HEADING}
      </h2>
      <p className={styles.sectionHint} data-planning-pc="past-version-note">
        {SUPPORT_PLAN_PAST_VERSION_READONLY_NOTE}
      </p>
      <ul className={styles.versionList} data-planning-pc="version-list">
        {versions.map((entry) => (
          <li key={entry.version}>
            <button
              type="button"
              className={styles.versionButton}
              data-planning-pc-version={String(entry.version)}
              data-planning-pc-version-current={entry.isCurrent ? "true" : "false"}
              data-sbs-action="tertiary"
              aria-pressed={selectedVersion === entry.version}
              onClick={() => {
                setSelectedVersion(entry.version);
              }}
            >
              版 {entry.version} · {entry.lifecycleLabel}
            </button>
          </li>
        ))}
      </ul>
      {selectedVersionEntry ? (
        <div className={styles.versionDetail} data-planning-pc="version-detail">
          <p className={styles.graphLabel}>
            {selectedIsCurrent
              ? `現行版 ${selectedVersionEntry.version}`
              : `過去版 ${selectedVersionEntry.version}（読み取り専用）`}
          </p>
          <p>{selectedVersionEntry.createdAtLabel}</p>
          <p>{selectedVersionEntry.summary}</p>
          {!selectedIsCurrent && currentVersionEntry ? (
            <div
              className={styles.versionCompare}
              data-review-new-version="version-compare"
              data-review-new-version-selected={String(selectedVersionEntry.version)}
            >
              <p className={styles.graphLabel}>{SUPPORT_PLAN_VERSION_COMPARE_HEADING}</p>
              <p className={styles.sectionHint}>{SUPPORT_PLAN_IMMUTABLE_VERSION_NOTE}</p>
              <div className={styles.versionCompareGrid}>
                <div data-review-new-version="compare-past">
                  <p className={styles.graphLabel}>過去版 {selectedVersionEntry.version}</p>
                  <p className={styles.sectionHint}>実施する支援</p>
                  <ul>
                    {selectedVersionEntry.supportMethods.map((label) => (
                      <li key={`past-method-${label}`}>{label}</li>
                    ))}
                  </ul>
                  <p className={styles.sectionHint}>避ける対応</p>
                  <ul>
                    {selectedVersionEntry.precautions.map((label) => (
                      <li key={`past-precaution-${label}`}>{label}</li>
                    ))}
                  </ul>
                </div>
                <div data-review-new-version="compare-current">
                  <p className={styles.graphLabel}>
                    現行版 {currentVersionEntry.version}（適用中）
                  </p>
                  <p className={styles.sectionHint}>実施する支援</p>
                  <ul>
                    {currentVersionEntry.supportMethods.map((label) => (
                      <li key={`current-method-${label}`}>{label}</li>
                    ))}
                  </ul>
                  <p className={styles.sectionHint}>避ける対応</p>
                  <ul>
                    {currentVersionEntry.precautions.map((label) => (
                      <li key={`current-precaution-${label}`}>{label}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  );

  const handleRevisionStart = (): void => {
    if (!revisionEligible || capturedReview === null) {
      setRevisionError("現在の見直し結果と計画版を確認してください。");
      return;
    }
    const result = startSyntheticPlanningPcRevision({
      presentation,
      capturedReview,
      session: revisionSession,
      actor: "planning-pc-synthetic-staff",
      actionAt: new Date().toISOString(),
    });
    if (result.status === "STARTED" || result.status === "ALREADY_STARTED") {
      setRevisionSession({ intents: [result.intent], drafts: [result.draft] });
      setRevisionError(null);
      return;
    }
    setRevisionError(
      "変更内容の下書きを開始できませんでした。元の版と見直し結果を確認してください。",
    );
  };

  const nextVersionBlock = (
    <section
      className={styles.detailSection}
      aria-labelledby="review-new-version-next-heading"
      data-review-new-version="next-version-concept"
      data-review-new-version-highlighted={nextVersionConceptHighlighted ? "true" : "false"}
    >
      <h2 id="review-new-version-next-heading" tabIndex={-1}>
        {SUPPORT_PLAN_NEXT_VERSION_HEADING}
      </h2>
      <p className={styles.sectionHint} data-review-new-version="immutability-note">
        {SUPPORT_PLAN_NEXT_VERSION_NOTE}
      </p>
      <p className={styles.sectionHint}>{SUPPORT_PLAN_IMMUTABLE_VERSION_NOTE}</p>
      <p data-review-new-version="next-version-number">
        現行は版 {currentVersion}（適用中）。次に重ねる概念上の版は {conceptualNextVersion} です。
      </p>
      <p className={styles.sectionHint} data-review-new-version="observation-not-invalidating">
        {SUPPORT_PLAN_OBSERVATION_NOT_INVALIDATING_NOTE}
      </p>
      <p className={styles.sectionHint} data-review-new-version="overdue-not-invalidating">
        {SUPPORT_PLAN_REVIEW_OVERDUE_NOT_INVALIDATING_NOTE}
      </p>
      {planningPc && capturedReview ? (
        <div data-sbs-mgmt-loop-b-review="true">
          <p data-sbs-mgmt-loop-b-decision={capturedReview.outcome.decision}>
            見直し結果:{" "}
            {capturedReview.outcome.decision === "CHANGE_REQUIRED" ? "変更が必要" : "変更なし"}
          </p>
          {capturedReview.decisionReason ? (
            <p data-sbs-mgmt-loop-b-reason="true">
              判断理由: {capturedReview.decisionReason.reason}
            </p>
          ) : null}
        </div>
      ) : null}
      {revisionDraft ? (
        <div role="status" data-sbs-mgmt-loop-b-draft="true">
          <p>変更内容の下書き: 版 {revisionDraft.candidate.version}</p>
          <p>元の版: {revisionDraft.reviewBinding.reviewedPlanVersion}（変更しない）</p>
          <p>状態: 下書き / 本番未保存</p>
        </div>
      ) : revisionEligible && !adminRead ? (
        <button
          type="button"
          className={styles.mutationButton}
          onClick={handleRevisionStart}
          data-review-new-version="create-cta"
          data-sbs-mgmt-loop-b-action="start-revision"
          data-sbs-action="primary"
        >
          変更内容の作成を始める
        </button>
      ) : adminRead ? null : (
        <button
          type="button"
          className={styles.mutationButton}
          disabled
          aria-disabled="true"
          data-demo-ux="support-plan-mutation-button"
          data-review-new-version="create-cta"
          data-sbs-mgmt-loop-b-action="start-revision-disabled"
          data-sbs-action="tertiary"
        >
          {SUPPORT_PLAN_NEXT_VERSION_CTA}
        </button>
      )}
      <p className={styles.sectionHint} data-sbs-mgmt-loop-b-boundary="true">
        本番には保存されていません
      </p>
      {revisionError ? (
        <p role="alert" className={styles.sectionHint} data-sbs-mgmt-loop-b-error="true">
          {revisionError}
        </p>
      ) : null}
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
                data-sbs-action={planningPc ? "tertiary" : undefined}
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
    procedures: proceduresBlock,
    records: recordsBlock,
    versions: versionsBlock,
    nextVersion: nextVersionBlock,
    mutation: mutationBlock,
  };

  return (
    <section
      className={styles.supportPlan}
      data-demo-ux="support-plan"
      data-demo-ux-11-slice={DEMO_UX_11_SLICE.id}
      data-planning-pc-demo-slice={PLANNING_PC_DEMO_1_SLICE.id}
      data-review-new-version-demo-slice={SUPPORT_PLAN_REVIEW_NEW_VERSION_DEMO_1_SLICE.id}
      data-monitoring-link-slice={planningPc ? MONITORING_LINK_SLICE_A.id : undefined}
      data-planning-pc-plan-id={planId}
      data-planning-pc-current-version={String(currentVersion)}
      data-planning-pc-status={presentation.statusCode}
      data-presentation-role={presentationRole}
      aria-labelledby="demo-ux-support-plan-heading"
    >
      {planningPc ? (
        <>
          <div className={styles.topRow}>
            <button
              type="button"
              className={styles.backButton}
              onClick={onBackToUserDetail}
              disabled={!onBackToUserDetail}
              aria-disabled={!onBackToUserDetail ? "true" : undefined}
              data-demo-ux="support-plan-back"
              data-sbs-action="tertiary"
            >
              {backLabel}
            </button>
          </div>
          <header className={styles.headerBlock}>
            <p className={styles.personHeading} data-demo-ux="support-plan-person">
              {personLabel}
            </p>
            {titleHeading}
            <div className={styles.statusSummary} data-demo-ux="support-plan-status-summary">
              <p
                className={styles.statusLabel}
                data-demo-ux="support-plan-status"
                data-planning-pc="status"
              >
                {statusLabel}
              </p>
              <StatusBadge
                label={reviewStatus.reviewStatusLabel}
                shape="soft"
                className={styles.reviewStatusBadge}
                dataAttrs={{
                  "data-demo-ux": "support-plan-review-status-badge",
                  "data-support-plan-review-status": reviewStatus.reviewStatusLabel,
                }}
              />
            </div>
            <div className={styles.metaSummary} data-demo-ux="support-plan-meta-summary">
              <p className={styles.periodLabel} data-demo-ux="support-plan-period">
                {planPeriodLabel}
              </p>
              <p className={styles.periodLabel} data-demo-ux="support-plan-lifecycle">
                {planLifecycleLabel}
              </p>
              <p
                className={styles.periodLabel}
                data-demo-ux="support-plan-version"
                data-planning-pc="version"
              >
                版 {currentVersion}
              </p>
            </div>
            <p className={styles.sectionHint} data-planning-pc="not-final-approval">
              {SUPPORT_PLAN_NOT_FINAL_APPROVAL_NOTE}
            </p>
          </header>
          <nav
            className={styles.sectionNavigation}
            aria-label="支援計画セクション移動"
            data-planning-pc="section-navigation"
          >
            {PLANNING_PC_SUPPORT_PLAN_SECTION_NAVIGATION.map((section) => {
              const selected = activePlannerSectionId === section.id;
              return (
                <button
                  key={section.id}
                  type="button"
                  className={
                    selected
                      ? `${styles.sectionNavButton} ${styles.sectionNavButtonSelected}`
                      : styles.sectionNavButton
                  }
                  aria-pressed={selected}
                  data-planning-pc-section-nav={section.id}
                  onClick={() => {
                    focusPlannerSection(section.id);
                  }}
                >
                  {section.label}
                </button>
              );
            })}
          </nav>
        </>
      ) : (
        <>
          {titleHeading}
          <div className={styles.topRow}>
            <button
              type="button"
              className={styles.backButton}
              onClick={onBackToUserDetail}
              disabled={!onBackToUserDetail}
              aria-disabled={!onBackToUserDetail ? "true" : undefined}
              data-demo-ux="support-plan-back"
            >
              {backLabel}
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
          <p
            className={styles.statusLabel}
            data-demo-ux="support-plan-status"
            data-planning-pc="status"
          >
            {statusLabel}
          </p>
          <p
            className={styles.periodLabel}
            data-demo-ux="support-plan-version"
            data-planning-pc="version"
          >
            版 {currentVersion}
          </p>
          <p className={styles.sectionHint} data-planning-pc="not-final-approval">
            {SUPPORT_PLAN_NOT_FINAL_APPROVAL_NOTE}
          </p>
        </>
      )}

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
            <div>
              <dt>適用開始</dt>
              <dd data-planning-pc="applied-from">{businessFacts.appliedFromLabel}</dd>
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
