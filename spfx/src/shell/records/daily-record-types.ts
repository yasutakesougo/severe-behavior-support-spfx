export type ShellDailyRecordIncompleteItem = Readonly<{
  id: string;
  personLabel: string;
  reasonLabel: string;
  statusLabel: string;
}>;

export type ShellDailyRecordRecentItem = Readonly<{
  id: string;
  personLabel: string;
  recordedAtLabel: string;
  recordTypeLabel: string;
  summary: string;
}>;

export type ShellDailyRecordPresentation = Readonly<{
  heading: string;
  inputPersonLabel: string;
  inputPrompt: string;
  incompleteItems: readonly ShellDailyRecordIncompleteItem[];
  recentRecords: readonly ShellDailyRecordRecentItem[];
  businessFacts: Readonly<{
    recordScopeLabel: string;
    responsibleRoleLabel: string;
  }>;
  systemState: Readonly<{
    saveStateLabel: string;
    dataSourceLabel: string;
  }>;
}>;