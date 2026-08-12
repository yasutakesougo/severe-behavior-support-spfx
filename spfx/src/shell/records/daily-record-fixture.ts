import type { ShellDailyRecordPresentation } from "./daily-record-types";

export const DEMO_UX_DAILY_RECORD_FIXTURE: ShellDailyRecordPresentation = {
  heading: "日々の記録",
  inputPersonLabel: "Aさん",
  inputPrompt: "今日の支援内容・本人の様子・次回への申し送りを短く記録する想定です。",
  incompleteItems: [
    {
      id: "incomplete-a",
      personLabel: "Aさん",
      reasonLabel: "本日の支援記録が未入力",
      statusLabel: "未記録",
    },
    {
      id: "incomplete-b",
      personLabel: "Bさん",
      reasonLabel: "入力済み記録の確認が未完了",
      statusLabel: "要確認",
    },
  ],
  recentRecords: [
    {
      id: "record-a-0811",
      personLabel: "Aさん",
      recordedAtLabel: "8/11 14:32",
      recordTypeLabel: "支援記録",
      summary: "活動カードで予定を確認し、落ち着いて次の活動へ移行できた。",
    },
    {
      id: "record-d-0811",
      personLabel: "Dさん",
      recordedAtLabel: "8/11 13:05",
      recordTypeLabel: "支援記録",
      summary: "休憩場所を本人が選択し、再開時刻を確認してから活動へ戻った。",
    },
    {
      id: "record-a-0810",
      personLabel: "Aさん",
      recordedAtLabel: "8/10 10:15",
      recordTypeLabel: "支援記録",
      summary: "2択で意思確認し、本人の返答を待ってから支援を進めた。",
    },
  ],
  businessFacts: {
    recordScopeLabel: "日々の支援記録（合成表示）",
    responsibleRoleLabel: "担当職員（合成表示）",
  },
  systemState: {
    saveStateLabel: "表示サンプル（live保存なし）",
    dataSourceLabel: "synthetic fixture only",
  },
};

export const DEMO_UX_5_SLICE = {
  id: "DEMO-UX-5",
  presentationOnly: true as const,
  syntheticDailyRecordPresentationAuthorized: true as const,
  liveDailyRecordNavigationAuthorized: false as const,
  liveTenantIoAuthorized: false as const,
  sharePointRestAuthorized: false as const,
  binderHostWiringAuthorized: false as const,
  adapterFetchAuthorized: false as const,
  authJudgmentAuthorized: false as const,
  liveRecordDataAuthorized: false as const,
  dailyActivityRecordsReuseAuthorized: false as const,
  recordMutationAuthorized: false as const,
  evaluationMutationAuthorized: false as const,
} as const;