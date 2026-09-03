import {
  isAdminAuditPresentationRole,
  isPlanningPcPresentationRole,
  isPlannerSupportPlanManagementListRole,
  isShellPresentationRole,
  kpiSectionHeadingForRole,
  overviewSectionOrderForRole,
  parseShellPresentationRole,
  SHELL_DEFAULT_PRESENTATION_ROLE,
  SHELL_PRESENTATION_ROLE_ENTRY_DIRECTIONS,
  SHELL_PRESENTATION_ROLE_ENTRY_LABELS,
  SHELL_PRESENTATION_ROLE_HINTS,
  supportPlanBlockOrderForRole,
  userDetailSectionOrderForRole,
  userDetailStripLabelsForRole,
} from "./presentation-role";

describe("VP-G synthetic presentationRole", () => {
  it("defaults to FIELD_STAFF and does not claim auth resolution", () => {
    expect(SHELL_DEFAULT_PRESENTATION_ROLE).toBe("FIELD_STAFF");
    expect(isShellPresentationRole("FIELD_STAFF")).toBe(true);
    expect(isShellPresentationRole("PLANNER")).toBe(true);
    expect(isShellPresentationRole("ADMIN_AUDIT")).toBe(true);
    expect(isShellPresentationRole("SUPPORTER")).toBe(false);
    expect(parseShellPresentationRole(undefined)).toBe("FIELD_STAFF");
    expect(parseShellPresentationRole("PLANNER")).toBe("PLANNER");
    expect(parseShellPresentationRole("ADMIN_AUDIT")).toBe("ADMIN_AUDIT");
    expect(parseShellPresentationRole("SUPPORTER")).toBe("FIELD_STAFF");
    expect(SHELL_PRESENTATION_ROLE_HINTS.FIELD_STAFF).toContain("認証ロール判定はありません");
    expect(SHELL_PRESENTATION_ROLE_HINTS.ADMIN_AUDIT).toContain("編集権限は追加しません");
    expect(SHELL_PRESENTATION_ROLE_ENTRY_LABELS.FIELD_STAFF).toBe("現場職員");
    expect(SHELL_PRESENTATION_ROLE_ENTRY_LABELS.PLANNER).toBe("計画担当");
    expect(SHELL_PRESENTATION_ROLE_ENTRY_LABELS.ADMIN_AUDIT).toBe("運用確認");
    expect(SHELL_PRESENTATION_ROLE_ENTRY_DIRECTIONS.FIELD_STAFF).toContain("Tablet");
    expect(SHELL_PRESENTATION_ROLE_ENTRY_DIRECTIONS.PLANNER).toContain("PC");
    expect(SHELL_PRESENTATION_ROLE_ENTRY_DIRECTIONS.ADMIN_AUDIT).toContain("運用状況");
  });

  it("keeps FIELD_STAFF Overview order with Today Support first", () => {
    expect(overviewSectionOrderForRole("FIELD_STAFF")[0]).toBe("todaySupport");
  });

  it("puts review/plan emphasis first for PLANNER and ops/read first for ADMIN_AUDIT", () => {
    expect(overviewSectionOrderForRole("PLANNER")[0]).toBe("reviewDue");
    expect(overviewSectionOrderForRole("ADMIN_AUDIT")[0]).toBe("kpi");
    expect(overviewSectionOrderForRole("ADMIN_AUDIT")).toContain("todaySupport");
    expect(kpiSectionHeadingForRole("PLANNER")).toBe("計画・見直しの状況");
    expect(kpiSectionHeadingForRole("ADMIN_AUDIT")).toBe("運用状況");
    expect(isAdminAuditPresentationRole("ADMIN_AUDIT")).toBe(true);
    expect(isAdminAuditPresentationRole("PLANNER")).toBe(false);
    expect(isPlanningPcPresentationRole("PLANNER")).toBe(true);
    expect(isPlanningPcPresentationRole("ADMIN_AUDIT")).toBe(true);
    expect(isPlanningPcPresentationRole("FIELD_STAFF")).toBe(false);
    expect(isPlannerSupportPlanManagementListRole("PLANNER")).toBe(true);
    expect(isPlannerSupportPlanManagementListRole("ADMIN_AUDIT")).toBe(false);
    expect(isPlannerSupportPlanManagementListRole("FIELD_STAFF")).toBe(false);
  });

  it("keeps FIELD_STAFF UserDetail strip/order for DEMO-UX-3, planner path starts at 評価", () => {
    expect(userDetailStripLabelsForRole("FIELD_STAFF")).toEqual([
      "概要",
      "支援計画",
      "記録",
      "評価",
      "履歴",
    ]);
    expect(userDetailSectionOrderForRole("FIELD_STAFF")[0]).toBe("currentSupport");
    expect(userDetailSectionOrderForRole("PLANNER")[0]).toBe("evaluation");
    expect(userDetailSectionOrderForRole("PLANNER")[1]).toBe("supportPlan");
  });

  it("changes only PLANNER SupportPlan order and preserves ADMIN_AUDIT", () => {
    expect(supportPlanBlockOrderForRole("FIELD_STAFF")).toEqual([
      "summary",
      "goals",
      "actions",
      "review",
      "mutation",
    ]);
    expect(supportPlanBlockOrderForRole("PLANNER")).toEqual([
      "summary",
      "goals",
      "actions",
      "procedures",
      "records",
      "review",
      "nextVersion",
      "versions",
      "mutation",
    ]);
    expect(supportPlanBlockOrderForRole("ADMIN_AUDIT")).toEqual([
      "summary",
      "review",
      "procedures",
      "records",
      "versions",
      "nextVersion",
      "goals",
      "actions",
      "mutation",
    ]);
  });
});
