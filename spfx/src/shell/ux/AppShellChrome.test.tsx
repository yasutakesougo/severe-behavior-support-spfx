import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { AppShellChrome } from "./AppShellChrome";
import { DEMO_1_FIELD_STAFF_FIXTURE } from "./fixture";
import type { ShellPresentationRole } from "./presentation-role";

const chromeProps = {
  demoMode: DEMO_1_FIELD_STAFF_FIXTURE.demoMode,
  siteSelection: DEMO_1_FIELD_STAFF_FIXTURE.siteSelection,
  saveState: "saved" as const,
  viewMode: DEMO_1_FIELD_STAFF_FIXTURE.viewMode,
  correlationId: DEMO_1_FIELD_STAFF_FIXTURE.correlationId,
  errorCode: DEMO_1_FIELD_STAFF_FIXTURE.errorCode,
  userDisplayName: "Synthetic chrome",
};

function renderChrome(role: ShellPresentationRole): string {
  return renderToStaticMarkup(<AppShellChrome {...chromeProps} presentationRole={role} />);
}

describe("ADMIN-AUDIT-TASK-FIRST-V1 AppShellChrome", () => {
  it("AC-AA-TF-13: does not render legacy Global for ADMIN_AUDIT", () => {
    const html = renderChrome("ADMIN_AUDIT");
    expect(html).not.toContain('data-shell-ux="primary-navigation"');
    expect(html).not.toContain('data-shell-ux-nav="overview"');
    expect(html).toContain('data-shell-ux-presentation-role="ADMIN_AUDIT"');
    expect(html).toContain('data-admin-audit-adapter="true"');
  });

  it("AC-AA-TF-14 uniqueness: ADMIN_AUDIT markup has no 概要/利用者/記録 Global buttons", () => {
    const html = renderChrome("ADMIN_AUDIT");
    expect(html).not.toContain('data-shell-ux-nav="overview"');
    expect(html).not.toContain('data-shell-ux-nav="users"');
    expect(html).not.toContain('data-shell-ux-nav="records"');
  });

  it("AC-AA-TF-15: FIELD_STAFF still mounts legacy Global (CSS-hide uniqueness remains theirs)", () => {
    const html = renderChrome("FIELD_STAFF");
    expect(html).toContain('data-shell-ux="primary-navigation"');
    expect(html).toContain('data-shell-ux-nav="overview"');
    expect(html).toContain("概要");
    expect(html).toContain("利用者");
    expect(html).toContain("記録");
    expect(html).toContain('data-shell-ux-presentation-role="FIELD_STAFF"');
    expect(html).toContain('data-admin-audit-adapter="false"');
  });

  it("AC-AA-TF-16: PLANNER still mounts legacy Global", () => {
    const html = renderChrome("PLANNER");
    expect(html).toContain('data-shell-ux="primary-navigation"');
    expect(html).toContain('data-shell-ux-nav="overview"');
    expect(html).toContain("概要");
    expect(html).toContain('data-shell-ux-presentation-role="PLANNER"');
    expect(html).toContain('data-admin-audit-adapter="false"');
  });
});
