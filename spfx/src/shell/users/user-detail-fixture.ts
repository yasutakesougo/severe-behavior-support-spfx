import type { ShellUserDetailPresentation } from "./user-detail-types";

/** Synthetic user detail fixture for responsible-person review only. */
export const DEMO_UX_USER_DETAIL_FIXTURE: ShellUserDetailPresentation = {
  userId: "user-a",
  personLabel: "Aさん",
  planLabel: "支援計画",
  planPeriodLabel: "2026/07/01–2026/09/30",
  planLifecycleLabel: "現行版（合成）",
  currentSupport: [
    {
      id: "environment",
      label: "環境調整",
      body: "活動の順序を視覚的に提示する合成表示例です。",
    },
    {
      id: "communication",
      label: "コミュニケーション",
      body: "選択肢を短く提示して確認する合成表示例です。",
    },
    {
      id: "behavior-response",
      label: "行動発生時",
      body: "刺激を減らし、安全を確認して待つ合成表示例です。",
    },
  ],
  recentRecords: [
    { id: "record-1", occurredAtLabel: "8/11 14:32", recordTypeLabel: "支援記録" },
    { id: "record-2", occurredAtLabel: "8/10 10:15", recordTypeLabel: "支援記録" },
  ],
  evaluationSummary:
    "評価（アセスメント）欄の情報量と配置を確認するための合成サンプルです。計画表示の前に確認する想定です。",
  historySummary:
    "過去版・履歴の合成表示です。現行計画は支援計画欄です。ここから計画を切り替えません。",
  businessFacts: {
    createdByLabel: "担当者A（合成）",
    qualificationLabel: "実践研修修了者（合成表示）",
    createdAtLabel: "2026/08/01（合成）",
  },
  systemState: {
    saveStateLabel: "表示サンプル（live保存なし）",
    lastUpdatedLabel: "2026/08/11 14:32（合成）",
  },
};

/** Synthetic detail for DEMO-UX-7 today-action C「見る」→ 利用者詳細. */
export const DEMO_UX_USER_DETAIL_C_FIXTURE: ShellUserDetailPresentation = {
  userId: "user-c",
  personLabel: "Cさん",
  planLabel: "支援計画",
  planPeriodLabel: "2026/08/01–2026/10/31",
  planLifecycleLabel: "現行版（合成）",
  currentSupport: [
    {
      id: "environment",
      label: "環境調整",
      body: "支援計画の環境調整を確認する合成表示例です。",
    },
    {
      id: "communication",
      label: "コミュニケーション",
      body: "短い選択肢で意思確認する合成表示例です。",
    },
    {
      id: "behavior-response",
      label: "行動発生時",
      body: "安全を優先して待機する合成表示例です。",
    },
  ],
  recentRecords: [{ id: "record-c1", occurredAtLabel: "8/09 16:40", recordTypeLabel: "支援記録" }],
  evaluationSummary: "支援計画の確認用に配置した評価欄の合成サンプルです。",
  historySummary:
    "過去版・履歴の合成表示です。現行計画は支援計画欄です。ここから計画を切り替えません。",
  businessFacts: {
    createdByLabel: "担当者C（合成）",
    qualificationLabel: "実践研修修了者（合成表示）",
    createdAtLabel: "2026/08/01（合成）",
  },
  systemState: {
    saveStateLabel: "表示サンプル（live保存なし）",
    lastUpdatedLabel: "2026/08/09 16:40（合成）",
  },
};

export const DEMO_UX_3_SLICE = {
  id: "DEMO-UX-3",
  presentationOnly: true as const,
  syntheticUserDetailNavigationAuthorized: true as const,
  liveUserDetailNavigationAuthorized: false as const,
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
