export declare const SUPPORT_PLAN_ACTIVATION_LIVE_WRITE_AUTHORIZED: false;

export type SupportPlanVersion = Readonly<{
  planId: string;
  OrganizationId: string;
  SiteId: string;
  UserId: string;
  version: number;
  goals: readonly string[];
  supportMethods: readonly string[];
  precautions: readonly string[];
  reviewCriteria: readonly string[];
  versionCreatedBy: string;
  versionCreatedAt: string;
}>;

export type SupportPlanRevisionDraftCandidate = Readonly<{
  RevisionIntentId: string;
  candidate: SupportPlanVersion;
  reviewBinding: Readonly<{
    OrganizationId: string;
    SiteId: string;
    UserId: string;
    planId: string;
    planVersion: number;
    reviewedPlanVersion: number;
    sourceOutcomeId: string;
    boundAt: string;
    boundBy: string;
  }>;
}>;

export type ActiveSupportPlan = Readonly<{
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
  reviewDueDate?: string;
  effectiveTo?: string;
  returnedBy?: string;
  returnedAt?: string;
  returnReasonCode?: string;
  returnReasonText?: string;
}>;

export type ActivationReceipt = Readonly<{
  planId: string;
  fromVersion: number;
  activatedVersion: number;
  activatedAt: string;
  activatedBy: string;
  RevisionIntentId: string;
  DraftSnapshotId: string;
}>;

export type SupportPlanActivationRequest = Readonly<{
  currentPlan: ActiveSupportPlan;
  draft: SupportPlanRevisionDraftCandidate;
  confirmedDraftSnapshotId: string;
  expectedCurrentVersion: number;
  expectedRowVersion: number;
  actor: string;
  actionAt: string;
  existingReceipt?: ActivationReceipt;
}>;

export type ApplySupportPlanActivationResult =
  | Readonly<{
      status: "SUCCESS";
      nextPlan: ActiveSupportPlan;
      receipt: ActivationReceipt;
    }>
  | Readonly<{
      status: "ALREADY_APPLIED";
      currentPlan: ActiveSupportPlan;
      receipt: ActivationReceipt;
    }>
  | Readonly<{ status: "HOLD" | "INVALID"; reason: string }>;

export declare function mintDraftSnapshotId(
  draft: SupportPlanRevisionDraftCandidate,
): string;

export declare function validateActivationReceipt(
  value: unknown,
): value is ActivationReceipt;

export declare function applySupportPlanActivation(
  request: SupportPlanActivationRequest,
): ApplySupportPlanActivationResult;
