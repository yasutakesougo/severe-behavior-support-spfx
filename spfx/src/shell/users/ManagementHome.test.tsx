import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { DEMO_UX_SUPPORT_PLAN_FIXTURE } from "./support-plan-fixture";
import { ManagementHome, SupportPlanWithManagementHome } from "./ManagementHome";
import {
  MANAGEMENT_HOME_RESOLVED_FIXTURE,
  MANAGEMENT_HOME_UNAVAILABLE_FIXTURE,
} from "./management-home-fixture";
import { buildManagementHomeReadModel } from "./management-home-read-model";

describe("SBS-MGMT-HOME-C view", () => {
  it("renders the locked information hierarchy", () => {
    const html = renderToStaticMarkup(
      <ManagementHome
        presentation={buildManagementHomeReadModel(MANAGEMENT_HOME_RESOLVED_FIXTURE)}
      />,
    );
    expect(html).toContain("支援マネジメント");
    expect(html).toContain("現在の計画");
    expect(html).toContain("見直し状況");
    expect(html).toContain("変更対応状況");
    expect(html).toContain("次に必要な人の行動");
    expect(html).toContain("Aさん");
    expect(html).toContain("v3（適用中）");
  });

  it("shows fail-closed copy when sources are unavailable", () => {
    const html = renderToStaticMarkup(
      <ManagementHome
        presentation={buildManagementHomeReadModel(MANAGEMENT_HOME_UNAVAILABLE_FIXTURE)}
      />,
    );
    expect(html).toContain("一部の情報を確認できません");
    expect(html).toContain("推測していません");
  });

  it("exposes the read-only entry only on the matching planner plan surface", () => {
    const plannerHtml = renderToStaticMarkup(
      <SupportPlanWithManagementHome
        presentation={DEMO_UX_SUPPORT_PLAN_FIXTURE}
        presentationRole="PLANNER"
      />,
    );
    expect(plannerHtml).toContain("支援マネジメントを見る（読み取り専用）");
    expect(plannerHtml).toContain('data-management-home-host="available"');

    const fieldStaffHtml = renderToStaticMarkup(
      <SupportPlanWithManagementHome
        presentation={DEMO_UX_SUPPORT_PLAN_FIXTURE}
        presentationRole="FIELD_STAFF"
      />,
    );
    expect(fieldStaffHtml).not.toContain("支援マネジメントを見る（読み取り専用）");
    expect(fieldStaffHtml).toContain('data-management-home-host="hidden"');
  });
});
