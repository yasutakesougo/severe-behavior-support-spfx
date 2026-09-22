import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { AppShellChrome } from "./AppShellChrome";
import { DEMO_1_FIELD_STAFF_FIXTURE } from "./fixture";
import type { ShellPresentationRole } from "./presentation-role";

beforeAll(() => {
  const g = globalThis as { TextEncoder?: { new (): unknown } };
  if (typeof g.TextEncoder === "undefined") {
    // Jest jsdom may omit TextEncoder; SHA-256 uses it. SPFx/browser have it.
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const nodeUtil = require("util") as { TextEncoder: { new (): unknown } };
    g.TextEncoder = nodeUtil.TextEncoder;
  }
});

const chromeProps = {
  demoMode: DEMO_1_FIELD_STAFF_FIXTURE.demoMode,
  siteSelection: DEMO_1_FIELD_STAFF_FIXTURE.siteSelection,
  saveState: "saved" as const,
  viewMode: DEMO_1_FIELD_STAFF_FIXTURE.viewMode,
  correlationId: DEMO_1_FIELD_STAFF_FIXTURE.correlationId,
  errorCode: DEMO_1_FIELD_STAFF_FIXTURE.errorCode,
  userDisplayName: "Synthetic chrome",
};

function renderChrome(role: ShellPresentationRole, children?: React.ReactNode): string {
  return renderToStaticMarkup(
    <AppShellChrome {...chromeProps} presentationRole={role}>
      {children}
    </AppShellChrome>,
  );
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

  it("AC-AA-TF-17: ADMIN_AUDIT task layer is DOM-before the rendered product body", () => {
    const taskLayer = (
      <section data-role-task-ia="ADMIN_AUDIT">
        <button type="button" data-role-task-global="GLOBAL-OPS">
          運用確認
        </button>
      </section>
    );
    const adminHtml = renderChrome("ADMIN_AUDIT", taskLayer);
    const adminTaskIndex = adminHtml.indexOf('data-role-task-ia="ADMIN_AUDIT"');
    const adminProductIndex = adminHtml.indexOf('data-dashboard-ux="overview-heading"');

    expect(adminTaskIndex).toBeGreaterThanOrEqual(0);
    expect(adminProductIndex).toBeGreaterThanOrEqual(0);
    expect(adminTaskIndex).toBeLessThan(adminProductIndex);
  });

  it("AC-AA-TF-18: FIELD_STAFF and PLANNER keep their existing child placement", () => {
    for (const role of ["FIELD_STAFF", "PLANNER"] as const) {
      const html = renderChrome(
        role,
        <section data-role-task-ia={role}>
          <button type="button">Task</button>
        </section>,
      );
      const taskIndex = html.indexOf(`data-role-task-ia="${role}"`);
      const productIndex = html.indexOf('data-dashboard-ux="overview-heading"');

      expect(taskIndex).toBeGreaterThanOrEqual(0);
      expect(productIndex).toBeGreaterThanOrEqual(0);
      expect(taskIndex).toBeGreaterThan(productIndex);
    }
  });
});
