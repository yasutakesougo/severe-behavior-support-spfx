/**
 * VP-G — synthetic presentationRole for one-app Role-aware entry.
 * Not DEC-014 identity, Entra, or authorization-resolver truth.
 * Viewport ≠ Role. Default FIELD_STAFF keeps field regression fail-closed.
 */

export const SHELL_PRESENTATION_ROLES = ["FIELD_STAFF", "PLANNER", "ADMIN_AUDIT"] as const;

export type ShellPresentationRole = (typeof SHELL_PRESENTATION_ROLES)[number];

export const SHELL_DEFAULT_PRESENTATION_ROLE: ShellPresentationRole = "FIELD_STAFF";

export function isShellPresentationRole(value: string): value is ShellPresentationRole {
  return (SHELL_PRESENTATION_ROLES as readonly string[]).indexOf(value) >= 0;
}

/** Smoke/fixture query only. Unknown values fail closed to FIELD_STAFF. */
export function parseShellPresentationRole(raw?: string): ShellPresentationRole {
  if (typeof raw === "string" && isShellPresentationRole(raw)) {
    return raw;
  }
  return SHELL_DEFAULT_PRESENTATION_ROLE;
}

export const SHELL_PRESENTATION_ROLE_HINTS: Readonly<Record<ShellPresentationRole, string>> = {
  FIELD_STAFF: "今日の支援が優先です（合成表示）。認証ロール判定はありません。",
  PLANNER: "計画・見直しの確認から始めます（合成表示）。認証ロール判定はありません。",
  ADMIN_AUDIT: "運用状況と記録の確認専用です（合成表示）。編集権限は追加しません。",
};

export type OverviewSectionKey = "todaySupport" | "kpi" | "reviewDue" | "actions" | "recent";

export function overviewSectionOrderForRole(
  role: ShellPresentationRole,
): readonly OverviewSectionKey[] {
  if (role === "PLANNER") {
    return ["reviewDue", "kpi", "actions", "todaySupport", "recent"];
  }
  if (role === "ADMIN_AUDIT") {
    return ["kpi", "reviewDue", "recent", "actions", "todaySupport"];
  }
  return ["todaySupport", "kpi", "reviewDue", "actions", "recent"];
}

export type UserDetailSectionKey =
  "currentSupport" | "supportPlan" | "recentRecords" | "evaluation" | "history";

export function userDetailSectionOrderForRole(
  role: ShellPresentationRole,
): readonly UserDetailSectionKey[] {
  if (role === "PLANNER" || role === "ADMIN_AUDIT") {
    return ["evaluation", "supportPlan", "currentSupport", "recentRecords", "history"];
  }
  return ["currentSupport", "supportPlan", "recentRecords", "evaluation", "history"];
}

export function userDetailStripLabelsForRole(role: ShellPresentationRole): readonly string[] {
  if (role === "PLANNER" || role === "ADMIN_AUDIT") {
    return ["概要", "評価", "支援計画", "記録", "履歴"];
  }
  return ["概要", "支援計画", "記録", "評価", "履歴"];
}

export function isAdminAuditPresentationRole(role: ShellPresentationRole): boolean {
  return role === "ADMIN_AUDIT";
}

export function kpiSectionHeadingForRole(role: ShellPresentationRole): string {
  if (role === "ADMIN_AUDIT") {
    return "運用状況";
  }
  if (role === "PLANNER") {
    return "計画・見直しの状況";
  }
  return "今日の支援状況";
}

export function isPlanningPcPresentationRole(role: ShellPresentationRole): boolean {
  return role === "PLANNER" || role === "ADMIN_AUDIT";
}

export type SupportPlanBlockKey =
  | "summary"
  | "goals"
  | "actions"
  | "review"
  | "procedures"
  | "records"
  | "versions"
  | "mutation";

export function supportPlanBlockOrderForRole(
  role: ShellPresentationRole,
): readonly SupportPlanBlockKey[] {
  if (isPlanningPcPresentationRole(role)) {
    return ["summary", "review", "procedures", "records", "versions", "goals", "actions", "mutation"];
  }
  return ["summary", "goals", "actions", "review", "mutation"];
}
