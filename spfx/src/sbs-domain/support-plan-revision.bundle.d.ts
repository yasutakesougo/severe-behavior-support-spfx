export declare const SUPPORT_PLAN_REVISION_LIVE_WRITE_AUTHORIZED: false;

export type RevisionIntent = Readonly<{
  RevisionIntentId: string;
  OrganizationId: string;
  SiteId: string;
  UserId: string;
  planId: string;
  sourcePlanVersion: number;
  sourceReviewOutcomeId: string;
  createdAt: string;
  createdBy: string;
  status: "OPEN" | "CONSUMED";
}>;

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

export type StartSupportPlanRevisionResult =
  | Readonly<{
      status: "STARTED" | "ALREADY_STARTED";
      intent: RevisionIntent;
      draft: SupportPlanRevisionDraftCandidate;
    }>
  | Readonly<{ status: "HOLD" | "INVALID"; reason: string }>;

export declare function startSupportPlanRevision(input: Readonly<{
  currentPlan: Readonly<{
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
  sourceVersion: SupportPlanVersion;
  sourceOutcome: Readonly<{
    OutcomeId: string;
    OrganizationId: string;
    SiteId: string;
    UserId: string;
    planId: string;
    planVersion: number;
    decision: "NO_CHANGE" | "CHANGE_REQUIRED";
    completedBy: string;
    completedAt: string;
  }>;
  sourceDecisionReason: Readonly<{
    OutcomeId: string;
    reason: string;
  }>;
  existingVersions: readonly SupportPlanVersion[];
  existingIntents: readonly RevisionIntent[];
  existingDrafts: readonly SupportPlanRevisionDraftCandidate[];
  actor: string;
  actionAt: string;
}>): StartSupportPlanRevisionResult;
