import * as React from "react";
import { StatusBadge } from "../primitives";
import {
  SUPPORT_PLAN_MANAGEMENT_BACK_TO_LIST_LABEL,
  SUPPORT_PLAN_MANAGEMENT_CREATE_DISABLED_LABEL,
  SUPPORT_PLAN_MANAGEMENT_CREATE_HEADING,
  SUPPORT_PLAN_MANAGEMENT_CREATE_NOTE,
  SUPPORT_PLAN_MANAGEMENT_SYNTHETIC_DETAIL_HEADING,
  SUPPORT_PLAN_MANAGEMENT_SYNTHETIC_DETAIL_NOTE,
} from "./support-plan-management-list-copy";
import { SUPPORT_PLAN_MANAGEMENT_LIST_DEMO_1_SLICE } from "./support-plan-management-list-fixture";
import type { SupportPlanManagementRow } from "./support-plan-management-list-types";
import styles from "./SupportPlanManagementListUx.module.scss";

export type SupportPlanManagementNextSurfaceProps = Readonly<{
  kind: "synthetic-detail" | "create";
  row: SupportPlanManagementRow;
  headingRef?: React.Ref<HTMLHeadingElement>;
  onBackToList?: () => void;
}>;

/**
 * Temporary synthetic detail / demo-only create entrance.
 * Not a completed SupportPlan document and not a persistence workflow.
 */
export const SupportPlanManagementNextSurface: React.FC<SupportPlanManagementNextSurfaceProps> = ({
  kind,
  row,
  headingRef,
  onBackToList,
}) => {
  const heading =
    kind === "create"
      ? SUPPORT_PLAN_MANAGEMENT_CREATE_HEADING
      : SUPPORT_PLAN_MANAGEMENT_SYNTHETIC_DETAIL_HEADING;
  const note =
    kind === "create"
      ? SUPPORT_PLAN_MANAGEMENT_CREATE_NOTE
      : SUPPORT_PLAN_MANAGEMENT_SYNTHETIC_DETAIL_NOTE;
  const headingId =
    kind === "create" ? "support-plan-mgmt-create-heading" : "support-plan-mgmt-synth-detail-heading";

  return (
    <section
      className={styles.nextSurface}
      data-demo-ux={kind === "create" ? "support-plan-mgmt-create" : "support-plan-mgmt-synth-detail"}
      data-support-plan-mgmt-demo-slice={SUPPORT_PLAN_MANAGEMENT_LIST_DEMO_1_SLICE.id}
      data-support-plan-mgmt-user-id={row.userId}
      aria-labelledby={headingId}
    >
      <h1
        id={headingId}
        ref={headingRef}
        tabIndex={-1}
        className={styles.heading}
        data-demo-ux="support-plan-mgmt-next-heading"
      >
        {heading}
      </h1>
      <div>
        <button
          type="button"
          className={styles.backButton}
          onClick={onBackToList}
          disabled={!onBackToList}
          aria-disabled={!onBackToList ? "true" : undefined}
          data-demo-ux="support-plan-mgmt-back"
        >
          {SUPPORT_PLAN_MANAGEMENT_BACK_TO_LIST_LABEL}
        </button>
      </div>
      <p className={styles.personLabel}>{row.personLabel}</p>
      <StatusBadge
        label={row.workStateLabel}
        statusId={row.workState}
        dataAttrs={{ "data-demo-ux": "support-plan-mgmt-next-status" }}
      />
      <p className={styles.meta}>{row.currentVersionLabel}</p>
      <p className={styles.meta}>{row.lastObservationLabel}</p>
      <p className={styles.meta}>{row.reviewWindowLabel}</p>
      {row.attentionLabel ? (
        <p className={styles.attention}>{`要対応: ${row.attentionLabel}`}</p>
      ) : null}
      <p className={styles.sectionHint} data-demo-ux="support-plan-mgmt-next-note">
        {note}
      </p>
      {kind === "create" ? (
        <button
          type="button"
          className={styles.createButton}
          disabled
          aria-disabled="true"
          data-demo-ux="support-plan-mgmt-create-submit"
        >
          {SUPPORT_PLAN_MANAGEMENT_CREATE_DISABLED_LABEL}
        </button>
      ) : null}
    </section>
  );
};
