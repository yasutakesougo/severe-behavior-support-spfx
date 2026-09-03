/**
 * Canonical SBS-MGMT-LOOP-B / B2 revision orchestration fixture.
 * Authority for current SupportPlan, source SupportPlanVersion v3, and
 * existingVersions used for conflict checks. Display presentation may match
 * identity only — do not rebuild provenance from presentation fields.
 * Session-only. LIVE WRITE = false.
 */
import type { MonitoringPeriodReviewOutcome } from "../../sbs-domain/monitoring-period-review-outcome.bundle";
import type { SupportPlanVersion } from "../../sbs-domain/support-plan-revision.bundle";
import { DEMO_UX_SUPPORT_PLAN_FIXTURE } from "./support-plan-fixture";
import type { ShellSupportPlanPresentation } from "./support-plan-types";

export type CanonicalSupportPlan = Readonly<{
  PlanId: string;
  OrganizationId: string;
  SiteId: string;
  UserId: string;
  currentVersion: number;
  createdBy: string;
  createdAt: string;
  version: number;
  status: "Active";
  submittedBy: string;
  submittedAt: string;
  approvedBy: string;
  approvedAt: string;
  effectiveFrom: string;
}>;

export const SBS_MGMT_LOOP_B_REVISION_FIXTURE = {
  id: "SBS-MGMT-LOOP-B-REVISION",
  presentationOnly: true as const,
  liveWriteAuthorized: false as const,
  sharePointWriteAuthorized: false as const,
  sourceVersionMutationAuthorized: false as const,
  OrganizationId: "synthetic-org-001",
  SiteId: "SITE-ISG",
  UserId: DEMO_UX_SUPPORT_PLAN_FIXTURE.userId,
  planId: DEMO_UX_SUPPORT_PLAN_FIXTURE.planId,
  planVersion: DEMO_UX_SUPPORT_PLAN_FIXTURE.currentVersion,
  periodStart: "2026-08-01T00:00:00+09:00",
  periodEnd: "2026-08-31T23:59:59+09:00",
  actor: "planning-pc-synthetic-staff",
  actionAt: "2026-09-03T12:00:00+09:00",
} as const;

/** Canonical current SupportPlan (provenance authority). */
export const SBS_MGMT_LOOP_B_CURRENT_PLAN: CanonicalSupportPlan = {
  PlanId: SBS_MGMT_LOOP_B_REVISION_FIXTURE.planId,
  OrganizationId: SBS_MGMT_LOOP_B_REVISION_FIXTURE.OrganizationId,
  SiteId: SBS_MGMT_LOOP_B_REVISION_FIXTURE.SiteId,
  UserId: SBS_MGMT_LOOP_B_REVISION_FIXTURE.UserId,
  currentVersion: SBS_MGMT_LOOP_B_REVISION_FIXTURE.planVersion,
  createdBy: "synthetic-planning-pc",
  createdAt: "2026-07-01T09:00:00+09:00",
  version: 1,
  status: "Active",
  submittedBy: "synthetic-planning-pc",
  submittedAt: "2026-07-01T09:00:00+09:00",
  approvedBy: "synthetic-planning-pc",
  approvedAt: "2026-07-01T09:00:00+09:00",
  effectiveFrom: "2026-07-01T09:00:00+09:00",
};

/** Canonical source SupportPlanVersion v3 (provenance authority). */
export const SBS_MGMT_LOOP_B_SOURCE_VERSION: SupportPlanVersion = {
  planId: SBS_MGMT_LOOP_B_REVISION_FIXTURE.planId,
  OrganizationId: SBS_MGMT_LOOP_B_REVISION_FIXTURE.OrganizationId,
  SiteId: SBS_MGMT_LOOP_B_REVISION_FIXTURE.SiteId,
  UserId: SBS_MGMT_LOOP_B_REVISION_FIXTURE.UserId,
  version: SBS_MGMT_LOOP_B_REVISION_FIXTURE.planVersion,
  goals: [
    "視覚的な順序提示で、活動の切り替えを落ち着いて進められるようにする。",
    "選択肢を短く提示し、本人の返事を確認してから次の支援へ進む。",
  ],
  supportMethods: ["写真カードで次の活動を示す", "本人の反応を待ってから促す"],
  precautions: ["突然大きな声で急かす", "身体を引っ張る"],
  reviewCriteria: ["見直し期限: 2026/09/23"],
  versionCreatedBy: "synthetic-planning-pc",
  versionCreatedAt: "2026-07-01T09:00:00+09:00",
};

/** Pre-existing N+1 used only for TARGET_VERSION_CONFLICT checks. */
export const SBS_MGMT_LOOP_B_EXISTING_N_PLUS_ONE: SupportPlanVersion = {
  ...SBS_MGMT_LOOP_B_SOURCE_VERSION,
  version: SBS_MGMT_LOOP_B_SOURCE_VERSION.version + 1,
  versionCreatedBy: "synthetic-prior-revision",
  versionCreatedAt: "2026-08-15T09:00:00+09:00",
};

/** Default existingVersions for B2 start (source N only). */
export const SBS_MGMT_LOOP_B_EXISTING_VERSIONS: readonly SupportPlanVersion[] = [
  SBS_MGMT_LOOP_B_SOURCE_VERSION,
];

/** Conflict existingVersions (source N + already-present N+1). */
export const SBS_MGMT_LOOP_B_EXISTING_VERSIONS_WITH_CONFLICT: readonly SupportPlanVersion[] = [
  SBS_MGMT_LOOP_B_SOURCE_VERSION,
  SBS_MGMT_LOOP_B_EXISTING_N_PLUS_ONE,
];

export function assertPresentationMatchesRevisionFixture(
  presentation: ShellSupportPlanPresentation,
): boolean {
  return (
    presentation.userId === SBS_MGMT_LOOP_B_REVISION_FIXTURE.UserId &&
    presentation.planId === SBS_MGMT_LOOP_B_REVISION_FIXTURE.planId &&
    presentation.currentVersion === SBS_MGMT_LOOP_B_REVISION_FIXTURE.planVersion
  );
}

export function assertOutcomeMatchesRevisionFixture(
  outcome: MonitoringPeriodReviewOutcome,
): boolean {
  return (
    outcome.OrganizationId === SBS_MGMT_LOOP_B_REVISION_FIXTURE.OrganizationId &&
    outcome.SiteId === SBS_MGMT_LOOP_B_REVISION_FIXTURE.SiteId &&
    outcome.UserId === SBS_MGMT_LOOP_B_REVISION_FIXTURE.UserId &&
    outcome.planId === SBS_MGMT_LOOP_B_REVISION_FIXTURE.planId &&
    outcome.planVersion === SBS_MGMT_LOOP_B_REVISION_FIXTURE.planVersion
  );
}
