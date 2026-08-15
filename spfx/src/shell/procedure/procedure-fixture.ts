import type {
  ShellCurrentProcedurePresentation,
  ShellProcedureReviewMaterial,
  ShellProcedureWorkflowPresentation,
} from "./procedure-types";

/** Active field procedure for Aさん — plan v3 / P3 (current). */
export const FIELD_WORKFLOW_CURRENT_USER_A: ShellCurrentProcedurePresentation = {
  heading: "現在の支援手順",
  summaryPrompt: "現場で今使う支援手順を、場面から補足まで確認します（合成）。",
  context: {
    userId: "user-a",
    personLabel: "Aさん",
    organizationId: "synthetic-org-001",
    siteId: "SITE-ISG",
    planId: "synthetic-plan-001",
    planVersion: 3,
    procedureId: "synthetic-procedure-p3",
    procedureVersion: "synthetic-procedure-p3-v1",
    planPeriodLabel: "2026/07/01–2026/09/30",
  },
  projection: {
    sceneLabel: "活動の切り替え場面（食堂→作業）",
    performLabels: ["写真カードで次の活動を示す", "本人の反応を待ってから促す"],
    avoidLabels: ["突然大きな声で急かす", "身体を引っ張る"],
    noteLabel: "周囲の音が大きいときは別室も検討する（合成補足）。",
  },
};

/** Historical v2 ProcedureRecord material — must stay on v2 after v3 Active (FW05-HIST-01). */
export const FIELD_WORKFLOW_REVIEW_MATERIAL_V2: ShellProcedureReviewMaterial = {
  id: "proc-rec-v2-001",
  personLabel: "Aさん",
  result: "PERFORMED_WITH_ADAPTATION",
  performedAtLabel: "2026/08/12 14:05",
  recordedAtLabel: "2026/08/12 15:32",
  planId: "synthetic-plan-001",
  planVersion: 2,
  procedureId: "synthetic-procedure-p2",
  procedureVersion: "synthetic-procedure-p2-v1",
  historicalLookupStatus: "RESOLVED",
  projectedSupportMethods: ["synthetic v2 method — photo card then wait"],
  projectedPrecautions: ["synthetic v2 precaution — no sudden voice"],
};

/** FW05-HIST-02: unresolved historical lookup — fail-closed, no v3 fallback. */
export const FIELD_WORKFLOW_REVIEW_MATERIAL_UNRESOLVED: ShellProcedureReviewMaterial = {
  id: "proc-rec-unresolved-001",
  personLabel: "Aさん",
  result: "NOT_PERFORMED",
  performedAtLabel: "2026/08/10 11:20",
  recordedAtLabel: "2026/08/10 11:45",
  planId: "synthetic-plan-001",
  planVersion: 2,
  procedureId: "synthetic-procedure-p2",
  procedureVersion: "synthetic-procedure-p2-v1",
  historicalLookupStatus: "FETCH_FAILED",
};

export const FIELD_WORKFLOW_PROCEDURE_FIXTURE: ShellProcedureWorkflowPresentation = {
  currentByUserId: {
    "user-a": FIELD_WORKFLOW_CURRENT_USER_A,
  },
  reviewMaterials: [FIELD_WORKFLOW_REVIEW_MATERIAL_V2, FIELD_WORKFLOW_REVIEW_MATERIAL_UNRESOLVED],
  defaultSaveOutcome: "saved",
};

export const FIELD_WORKFLOW_UI_SLICE = {
  id: "FIELD-WORKFLOW-UI",
  issue: "#356",
  presentationOnly: true as const,
  syntheticProcedureWorkflowAuthorized: true as const,
  syntheticProcedureRecordSaveAuthorized: true as const,
  liveTenantIoAuthorized: false as const,
  sharePointRestAuthorized: false as const,
  binderHostWiringAuthorized: false as const,
  adapterFetchAuthorized: false as const,
  authJudgmentAuthorized: false as const,
  liveUsersDataAuthorized: false as const,
  planMutationAuthorized: false as const,
  recordMutationAuthorized: false as const,
  productionWriteAuthorized: false as const,
  deployAuthorized: false as const,
} as const;

/** VP-4 Workflow — presentation-only polish for the existing field flow. */
export const VP4_WORKFLOW_SLICE = {
  id: "VP-4-WORKFLOW",
  presentationOnly: true as const,
  target: "current-procedure-and-procedure-record-form" as const,
  visualPolishAuthorized: true as const,
  workflowMetadataAuthorized: true as const,
  reviewReferenceOnly: true as const,
  reviewOutcomeRedesignAuthorized: false as const,
  saveStateSemanticsChangeAuthorized: false as const,
  saveOutcomeUnknownNormalizationAuthorized: false as const,
  navigationSemanticsChangeAuthorized: false as const,
  domainContractsMutationAuthorized: false as const,
  permissionMutationAuthorized: false as const,
  syntheticBoundaryChangeAuthorized: false as const,
  liveTenantIoAuthorized: false as const,
  sharePointWriteAuthorized: false as const,
  deployAuthorized: false as const,
} as const;
