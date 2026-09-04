import * as React from "react";
import { SupportPlan as BaseSupportPlan, type SupportPlanProps } from "./SupportPlan";
import {
  MANAGEMENT_HOME_FULLY_RESOLVED_INPUT,
  MANAGEMENT_HOME_FULLY_RESOLVED_MODEL,
  SBS_MGMT_HOME_C_SLICE,
} from "./management-home-fixture";
import type { ManagementHomeReadModel, ManagementHomeSection } from "./management-home-read-model";
import styles from "./ManagementHomeUx.module.scss";

export type ManagementHomeProps = Readonly<{
  model: ManagementHomeReadModel;
  headingRef?: React.Ref<HTMLHeadingElement>;
  onBack?: () => void;
}>;

function decisionLabel(decision: "NO_CHANGE" | "CHANGE_REQUIRED"): string {
  return decision === "CHANGE_REQUIRED" ? "変更が必要" : "変更なし";
}

function unavailableText(section: ManagementHomeSection<unknown>): string | null {
  return section.status === "UNAVAILABLE" ? "確認できません" : null;
}

export const ManagementHome: React.FC<ManagementHomeProps> = ({ model, headingRef, onBack }) => {
  const monitoringUnavailable = unavailableText(model.monitoring);
  const reviewUnavailable = unavailableText(model.review);
  const intentUnavailable = unavailableText(model.revisionIntent);
  const draftUnavailable = unavailableText(model.draft);
  const receiptUnavailable = unavailableText(model.activationReceipt);
  const reviewDueUnavailable = unavailableText(model.reviewDue);

  return (
    <section
      className={styles.home}
      data-demo-ux="management-home"
      data-sbs-mgmt-home-c={SBS_MGMT_HOME_C_SLICE.id}
      data-management-home-status={model.status}
      aria-labelledby="management-home-heading"
    >
      <div className={styles.headerRow}>
        <div>
          <p className={styles.eyebrow}>計画・見直し担当</p>
          <h1
            id="management-home-heading"
            ref={headingRef}
            tabIndex={-1}
            className={styles.heading}
            data-demo-ux="management-home-heading"
          >
            マネジメントホーム
          </h1>
          <p className={styles.personLabel} data-management-home-person>
            {model.personLabel}
          </p>
        </div>
        {onBack ? (
          <button
            type="button"
            className={styles.backButton}
            onClick={onBack}
            data-demo-ux="management-home-back"
          >
            ← 支援計画へ戻る
          </button>
        ) : null}
      </div>

      <p className={styles.readOnlyNote}>読み取り専用の合成スナップショットです。</p>

      <div className={styles.grid}>
        <section className={styles.card} data-management-home-section="current-plan">
          <h2 className={styles.cardHeading}>現在の計画</h2>
          <p
            className={styles.primaryValue}
            data-management-home-current-version={String(model.currentVersion)}
          >
            {`版${model.currentVersion}（適用中）`}
          </p>
          <p className={styles.meta}>現在版は SupportPlan.currentVersion を表示しています。</p>
        </section>

        <section className={styles.card} data-management-home-section="monitoring">
          <h2 className={styles.cardHeading}>モニタリング</h2>
          {monitoringUnavailable ? (
            <p className={styles.unavailable}>{monitoringUnavailable}</p>
          ) : model.monitoring.status === "CONFIRMED_NONE" ? (
            <p className={styles.meta}>対象期間の情報なしを確認</p>
          ) : model.monitoring.status === "RESOLVED" ? (
            <>
              <p className={styles.primaryValue}>{`記録 ${model.monitoring.value.recordCount}件`}</p>
              <p className={styles.meta}>
                {`${model.monitoring.value.periodStart.slice(0, 10)} ～ ${model.monitoring.value.periodEnd.slice(0, 10)}`}
              </p>
            </>
          ) : null}
        </section>

        <section className={styles.card} data-management-home-section="review">
          <h2 className={styles.cardHeading}>見直し状況</h2>
          {reviewUnavailable ? (
            <p className={styles.unavailable}>{reviewUnavailable}</p>
          ) : model.review.status === "CONFIRMED_NONE" ? (
            <p className={styles.meta}>見直し: 未実施を確認</p>
          ) : model.review.status === "RESOLVED" ? (
            <>
              <p className={styles.primaryValue}>
                {`結果: ${decisionLabel(model.review.value.outcome.decision)}`}
              </p>
              <p className={styles.meta}>
                {`実施: ${model.review.value.outcome.reviewedAt.slice(0, 10)} / ${model.review.value.outcome.reviewedBy}`}
              </p>
              <p className={styles.meta}>
                {model.review.value.decisionReason
                  ? `判断理由: ${model.review.value.decisionReason.reason}`
                  : "判断理由: なし"}
              </p>
            </>
          ) : null}
        </section>

        <section className={styles.card} data-management-home-section="change-state">
          <h2 className={styles.cardHeading}>変更対応状況</h2>
          <div className={styles.stack}>
            <p className={styles.meta} data-management-home-intent-status>
              {intentUnavailable
                ? `Revision Intent: ${intentUnavailable}`
                : model.revisionIntent.status === "CONFIRMED_NONE"
                  ? "Revision Intent: なし"
                  : model.revisionIntent.status === "RESOLVED"
                    ? `Revision Intent: ${
                        model.revisionIntent.value.status === "CONSUMED" ? "消費済み" : "開始済み"
                      }`
                    : null}
            </p>
            <p className={styles.meta} data-management-home-draft-status>
              {draftUnavailable
                ? `Draft: ${draftUnavailable}`
                : model.draft.status === "CONFIRMED_NONE"
                  ? "Draft: なし"
                  : model.draft.status === "RESOLVED"
                    ? `Draft 版${model.draft.value.candidate.version}あり / ${
                        model.draft.value.candidate.version === model.currentVersion
                          ? "現在版と一致"
                          : "未適用"
                      }`
                    : null}
            </p>
            <p className={styles.meta} data-management-home-activation-status>
              {receiptUnavailable
                ? `適用履歴補足: ${receiptUnavailable}`
                : model.activationReceipt.status === "CONFIRMED_NONE"
                  ? "適用履歴補足: なし（現在版判定には使用しません）"
                  : model.activationReceipt.status === "RESOLVED"
                    ? `適用: 版${model.activationReceipt.value.fromVersion} → 版${
                        model.activationReceipt.value.activatedVersion
                      } / ${model.activationReceipt.value.activatedBy}`
                    : null}
            </p>
          </div>
        </section>

        <section className={styles.card} data-management-home-section="next-action">
          <h2 className={styles.cardHeading}>次に必要な人の行動</h2>
          <p
            className={
              model.nextAction.status === "UNAVAILABLE" ? styles.unavailable : styles.primaryValue
            }
            data-management-home-next-action-status={model.nextAction.status}
          >
            {model.nextAction.label}
          </p>
        </section>

        <section className={styles.card} data-management-home-section="review-due">
          <h2 className={styles.cardHeading}>次回確認</h2>
          {reviewDueUnavailable ? (
            <p className={styles.unavailable}>{reviewDueUnavailable}</p>
          ) : model.reviewDue.status === "CONFIRMED_NONE" ? (
            <p className={styles.meta}>期限情報なしを確認</p>
          ) : model.reviewDue.status === "RESOLVED" ? (
            <p className={styles.primaryValue}>{model.reviewDue.value.label}</p>
          ) : null}
        </section>
      </div>

      <details className={styles.details}>
        <summary>詳細ID</summary>
        <dl className={styles.detailList}>
          <div>
            <dt>planId</dt>
            <dd>{model.planId}</dd>
          </div>
          {model.revisionIntent.status === "RESOLVED" ? (
            <div>
              <dt>RevisionIntentId</dt>
              <dd>{model.revisionIntent.value.RevisionIntentId}</dd>
            </div>
          ) : null}
          {model.activationReceipt.status === "RESOLVED" ? (
            <div>
              <dt>DraftSnapshotId</dt>
              <dd>{model.activationReceipt.value.DraftSnapshotId}</dd>
            </div>
          ) : null}
        </dl>
      </details>
    </section>
  );
};

/**
 * Minimal integration wrapper for the existing SupportPlan export.
 * Only PLANNER + exact synthetic person/plan exposes the read-only Management Home entry.
 * No AppShell state machine, persistence, or activation-session lifting is introduced.
 */
export const SupportPlanWithManagementHome: React.FC<SupportPlanProps> = (props) => {
  const [homeOpen, setHomeOpen] = React.useState(false);
  const planner = props.presentationRole === "PLANNER";
  const exactFixture =
    props.presentation.userId === MANAGEMENT_HOME_FULLY_RESOLVED_INPUT.currentPlan.UserId &&
    props.presentation.planId === MANAGEMENT_HOME_FULLY_RESOLVED_INPUT.currentPlan.PlanId;
  const available = planner && exactFixture;

  React.useEffect(() => {
    if (!available && homeOpen) {
      setHomeOpen(false);
    }
  }, [available, homeOpen]);

  if (available && homeOpen) {
    return (
      <ManagementHome
        model={MANAGEMENT_HOME_FULLY_RESOLVED_MODEL}
        headingRef={props.headingRef}
        onBack={() => setHomeOpen(false)}
      />
    );
  }

  return (
    <div className={styles.host} data-management-home-host={available ? "available" : "hidden"}>
      {available ? (
        <div className={styles.entryRow}>
          <button
            type="button"
            className={styles.entryButton}
            onClick={() => setHomeOpen(true)}
            data-demo-ux="management-home-open"
          >
            マネジメントホーム
          </button>
          <span className={styles.entryNote}>読み取り専用</span>
        </div>
      ) : null}
      <BaseSupportPlan {...props} />
    </div>
  );
};
