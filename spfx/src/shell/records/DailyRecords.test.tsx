import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { DailyRecords } from "./DailyRecords";
import { DEMO_UX_DAILY_RECORD_FIXTURE } from "./daily-record-fixture";

describe("ADMIN_AUDIT evidence presentation", () => {
  it("uses human-readable evidence-first copy and removes write affordances", () => {
    const html = renderToStaticMarkup(
      <DailyRecords presentation={DEMO_UX_DAILY_RECORD_FIXTURE} presentationRole="ADMIN_AUDIT" />,
    );

    expect(html).toContain('data-admin-audit-evidence-first="true"');
    expect(html).toContain("証跡の確認専用");
    expect(html).not.toContain('data-demo-ux="daily-record-mutation-button"');
    expect(html).not.toContain("作成する");
    expect(html).not.toContain("保存する");
    expect(html).toContain("最近の記録");
  });

  it("keeps the existing synthetic presentation affordances for non-admin roles", () => {
    const html = renderToStaticMarkup(
      <DailyRecords presentation={DEMO_UX_DAILY_RECORD_FIXTURE} presentationRole="FIELD_STAFF" />,
    );

    expect(html).not.toContain('data-admin-audit-evidence-first="true"');
    expect(html).toContain('data-demo-ux="daily-record-mutation-button"');
  });
});
