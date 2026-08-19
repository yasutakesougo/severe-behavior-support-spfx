import { SHELL_STATUS_LABEL_UNRECORDED } from "../ux/status-labels";
import { DEMO_UX_USERS_FIXTURE } from "./users-fixture";
import type { ShellUsersPresentation, UserListRow } from "./users-types";

export const FIELD_STAFF_PHASE8_MULTI_USER_SCALE_EVIDENCE_1_SLICE = {
  id: "FIELD-STAFF-PHASE8-MULTI-USER-SCALE-EVIDENCE-1",
  presentationOnly: true as const,
  synthetic18UserScenarioAuthorized: true as const,
  contextSafetyAssertionsAuthorized: true as const,
  saveStateSemanticsChangeAuthorized: false as const,
  correctionPersistenceAuthorized: false as const,
  cancellationSupersedeAuthorized: false as const,
  abcExpansionAuthorized: false as const,
  schemaChangeAuthorized: false as const,
  liveTenantIoAuthorized: false as const,
  sharePointWriteAuthorized: false as const,
  deployAuthorized: false as const,
} as const;

const ADDITIONAL_SCALE_ROWS: readonly UserListRow[] = Array.from({ length: 10 }, (_, index) => {
  const numberValue = index + 9;
  const number = numberValue < 10 ? `0${numberValue}` : String(numberValue);
  const dayValue = 1 + (index % 9);
  const day = dayValue < 10 ? `0${dayValue}` : String(dayValue);
  return {
    id: `scale-user-${number}`,
    personLabel: `合成利用者${number}`,
    statusBadges:
      index % 2 === 0
        ? [{ id: "unrecorded", label: SHELL_STATUS_LABEL_UNRECORDED }]
        : [{ id: "normal", label: "通常" }],
    planSummary: `合成支援計画 ${number}`,
    attentionNote: index % 2 === 0 ? SHELL_STATUS_LABEL_UNRECORDED : "特記事項なし",
    lastRecordLabel: `最終記録: 8/${day} 09:00`,
    detailActionLabel: "詳細を見る",
  };
});

export const FIELD_STAFF_PHASE8_MULTI_USER_SCALE_FIXTURE: ShellUsersPresentation = {
  summaryLabel: "全18名（合成データ）",
  filterHint: "18名の合成利用者で、一覧の操作量と利用者文脈を確認します。業務検索には未接続。",
  rows: [...DEMO_UX_USERS_FIXTURE.rows, ...ADDITIONAL_SCALE_ROWS],
};

export type ScaleContextSafetyReport = Readonly<{
  rowCount: number;
  uniqueUserIds: boolean;
  uniquePersonLabels: boolean;
  rowsHaveRequiredContext: boolean;
}>;

export function inspectScaleContextSafety(
  presentation: ShellUsersPresentation,
): ScaleContextSafetyReport {
  const ids = presentation.rows.map((row) => row.id);
  const labels = presentation.rows.map((row) => row.personLabel);
  return {
    rowCount: presentation.rows.length,
    uniqueUserIds: new Set(ids).size === ids.length,
    uniquePersonLabels: new Set(labels).size === labels.length,
    rowsHaveRequiredContext: presentation.rows.every(
      (row) =>
        row.id.length > 0 &&
        row.personLabel.length > 0 &&
        row.planSummary.length > 0 &&
        row.lastRecordLabel.length > 0,
    ),
  };
}
