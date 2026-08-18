import {
  FIELD_WORKFLOW_CURRENT_USER_A,
  FIELD_WORKFLOW_REVIEW_MATERIAL_V2,
} from "../procedure/procedure-fixture";
import {
  SUPPORT_PLAN_ACTIVE_STATUS_LABEL,
  SUPPORT_PLAN_NOT_FINAL_APPROVAL_NOTE,
} from "./support-plan-copy";
import type { ShellSupportPlanPresentation } from "./support-plan-types";

/** Synthetic support plan fixture for responsible-person review + Planning PC graph. */
export const DEMO_UX_SUPPORT_PLAN_FIXTURE: ShellSupportPlanPresentation = {
  userId: "user-a",
  personLabel: "Aさん",
  planTitle: "支援計画",
  planPeriodLabel: "2026/07/01–2026/09/30",
  planLifecycleLabel: "現行版・適用中（合成）",
  planId: "synthetic-plan-001",
  currentVersion: 3,
  statusCode: "Active",
  statusLabel: SUPPORT_PLAN_ACTIVE_STATUS_LABEL,
  summary:
    "現在有効な支援の方針と具体的な対応を一覧で確認するための合成計画です。分析グラフは主目的にしません。",
  goals: [
    {
      id: "goal-1",
      label: "安心できる活動の流れ",
      body: "視覚的な順序提示で、活動の切り替えを落ち着いて進められるようにする。",
    },
    {
      id: "goal-2",
      label: "意思の確認しやすさ",
      body: "選択肢を短く提示し、本人の返事を確認してから次の支援へ進む。",
    },
  ],
  actionItems: [
    {
      id: "action-environment",
      categoryLabel: "環境調整",
      body: "活動カードを左から右へ並べ、完了したら裏返す。騒音のある場所は避ける。",
    },
    {
      id: "action-communication",
      categoryLabel: "コミュニケーション",
      body: "はい / いいえ または 2択で確認する。長い説明は分割する。",
    },
    {
      id: "action-behavior",
      categoryLabel: "行動発生時",
      body: "刺激を減らし、安全を確認して待つ。無理に活動へ引き戻さない。",
    },
  ],
  reviewStatus: {
    reviewDueLabel: "見直し期限: 2026/09/23",
    reviewStatusLabel: "要確認（合成表示）",
    attentionNote: "期限接近のため、見直し状況の視認性を確認する合成サンプルです。",
  },
  businessFacts: {
    createdByLabel: "担当者A（合成）",
    qualificationLabel: "実践研修修了者（合成表示）",
    createdAtLabel: "2026/07/01（合成）",
    appliedFromLabel: "2026/07/01（合成）",
  },
  systemState: {
    saveStateLabel: "表示サンプル（live保存なし）",
    lastUpdatedLabel: "2026/08/11 14:32（合成）",
  },
  versions: [
    {
      version: 3,
      createdAtLabel: "2026/07/01",
      lifecycleLabel: "現行版",
      isCurrent: true,
      summary: "現行の適用中版です。現場支援で使う手順は v3 に結び付きます。",
    },
    {
      version: 2,
      createdAtLabel: "2026/05/01",
      lifecycleLabel: "過去版（読み取り専用）",
      isCurrent: false,
      summary: "過去版。この版に結び付いた記録は v3 へ付け替えません。",
    },
    {
      version: 1,
      createdAtLabel: "2026/02/01",
      lifecycleLabel: "過去版（読み取り専用）",
      isCurrent: false,
      summary: "最初の合成版です。現行としては編集できません。",
    },
  ],
  currentProcedures: [
    {
      procedureId: FIELD_WORKFLOW_CURRENT_USER_A.context.procedureId,
      procedureVersion: FIELD_WORKFLOW_CURRENT_USER_A.context.procedureVersion,
      planVersion: FIELD_WORKFLOW_CURRENT_USER_A.context.planVersion,
      sceneLabel: FIELD_WORKFLOW_CURRENT_USER_A.projection.sceneLabel,
      performLabels: FIELD_WORKFLOW_CURRENT_USER_A.projection.performLabels,
      avoidLabels: FIELD_WORKFLOW_CURRENT_USER_A.projection.avoidLabels,
    },
  ],
  recentProcedureRecords: [FIELD_WORKFLOW_REVIEW_MATERIAL_V2],
};

export const DEMO_UX_4_SLICE = {
  id: "DEMO-UX-4",
  presentationOnly: true as const,
  syntheticSupportPlanNavigationAuthorized: true as const,
  liveSupportPlanNavigationAuthorized: false as const,
  liveTenantIoAuthorized: false as const,
  sharePointRestAuthorized: false as const,
  binderHostWiringAuthorized: false as const,
  adapterFetchAuthorized: false as const,
  authJudgmentAuthorized: false as const,
  liveUsersDataAuthorized: false as const,
  planMutationAuthorized: false as const,
  recordMutationAuthorized: false as const,
  evaluationMutationAuthorized: false as const,
} as const;

export const PLANNING_PC_DEMO_1_SLICE = {
  id: "PLANNING-PC-DEMO-1",
  issue: "#70",
  presentationOnly: true as const,
  syntheticPlanningPcNavigationAuthorized: true as const,
  liveSupportPlanNavigationAuthorized: false as const,
  liveTenantIoAuthorized: false as const,
  sharePointRestAuthorized: false as const,
  binderHostWiringAuthorized: false as const,
  adapterFetchAuthorized: false as const,
  authJudgmentAuthorized: false as const,
  liveUsersDataAuthorized: false as const,
  planMutationAuthorized: false as const,
  recordMutationAuthorized: false as const,
  evaluationMutationAuthorized: false as const,
  schemaChangeAuthorized: false as const,
  approvedByRenameAuthorized: false as const,
  reviewDueOriginAuthorized: false as const,
  observationPlanVersionContractAuthorized: false as const,
  liveWriteAuthorized: false as const,
  deployAuthorized: false as const,
} as const;

export const PLANNING_PC_NOT_FINAL_APPROVAL_NOTE = SUPPORT_PLAN_NOT_FINAL_APPROVAL_NOTE;
