import * as React from "react";
import * as ReactDOM from "react-dom";
import { renderToStaticMarkup } from "react-dom/server";
import { act, Simulate } from "react-dom/test-utils";
import { DEMO_1_FIELD_STAFF_FIXTURE } from "../../../shell/ux/fixture";
import type { ShellPresentationRole } from "../../../shell/ux/presentation-role";
import type { IScaffoldShellProps } from "./IScaffoldShellProps";
import ScaffoldShell from "./ScaffoldShell";

const baseProps: IScaffoldShellProps = {
  description: "Synthetic ADMIN_AUDIT Task-First test",
  isDarkTheme: false,
  environmentMessage: "Synthetic",
  userDisplayName: "Synthetic tester",
  demoMode: DEMO_1_FIELD_STAFF_FIXTURE.demoMode,
  siteSelection: DEMO_1_FIELD_STAFF_FIXTURE.siteSelection,
  saveState: "saved",
  viewMode: DEMO_1_FIELD_STAFF_FIXTURE.viewMode,
  correlationId: DEMO_1_FIELD_STAFF_FIXTURE.correlationId,
  errorCode: DEMO_1_FIELD_STAFF_FIXTURE.errorCode,
  partialRetrieval: DEMO_1_FIELD_STAFF_FIXTURE.partialRetrieval,
};

type SmokeInjection = IScaffoldShellProps & {
  presentationRole?: ShellPresentationRole;
  initialAdminAuditDestination?: string;
  initialAdminAuditObject?: unknown;
};

function taskGlobalLabels(html: string): string[] {
  const labels: string[] = [];
  const pattern = /data-role-task-global="[^"]+"[^>]*>\s*([^<]+)/g;
  let match: RegExpExecArray | null = pattern.exec(html);
  while (match) {
    labels.push(match[1].trim());
    match = pattern.exec(html);
  }
  return labels;
}

function renderShell(injection: Partial<SmokeInjection> = {}): string {
  const props = { ...baseProps, ...injection } as IScaffoldShellProps;
  return renderToStaticMarkup(<ScaffoldShell {...props} />);
}

describe("ADMIN-AUDIT-TASK-FIRST-V1 ScaffoldShell", () => {
  it("AC-AA-TF-1/2/6: ADMIN_AUDIT first paint is D-OPS with exact Global labels", () => {
    const html = renderShell({ presentationRole: "ADMIN_AUDIT" });
    expect(html).toContain('data-role-task-ia="ADMIN_AUDIT"');
    expect(html).toContain('data-role-task-destination="D-OPS"');
    expect(html).toContain('data-role-task-active-global="GLOBAL-OPS"');
    expect(html).toContain("運用確認");
    expect(html).toContain("証跡");
    expect(html).toContain("探す");
    expect(html).toMatch(/data-role-task-global="GLOBAL-OPS"[\s\S]*運用確認/);
    const labels = taskGlobalLabels(html);
    expect(labels).toEqual(["運用確認", "証跡", "探す"]);
    expect(html).not.toContain('data-shell-ux="primary-navigation"');
  });

  it("AC-AA-TF-7: D-HOME restore token lands the same D-OPS place", () => {
    const html = renderShell({
      presentationRole: "ADMIN_AUDIT",
      initialAdminAuditDestination: "D-HOME",
    });
    expect(html).toContain('data-role-task-destination="D-OPS"');
    expect(html).toContain('data-role-task-restore-status="restored"');
    expect(html).toContain('data-role-task-restore-requested="D-HOME"');
    expect(html).toContain('data-role-task-home-identity="D-OPS"');
    expect(html).toContain(">運用確認<");
    expect(html).not.toContain('data-role-task-destination="D-HOME"');
  });

  it("AC-AA-TF-10: supported Destinations restore", () => {
    const evidence = renderShell({
      presentationRole: "ADMIN_AUDIT",
      initialAdminAuditDestination: "D-EVIDENCE",
    });
    expect(evidence).toContain('data-role-task-destination="D-EVIDENCE"');
    expect(evidence).toContain('data-role-task-restore-status="restored"');
    const find = renderShell({
      presentationRole: "ADMIN_AUDIT",
      initialAdminAuditDestination: "D-FIND-PERSON",
    });
    expect(find).toContain('data-role-task-destination="D-FIND-PERSON"');
  });

  it("AC-AA-TF-12: invalid restore fail-closes without claiming D-OPS success", () => {
    const html = renderShell({
      presentationRole: "ADMIN_AUDIT",
      initialAdminAuditDestination: "D-AUDIT",
    });
    expect(html).toContain('data-role-task-restore-status="fail-closed"');
    expect(html).toContain('data-role-task-restore-requested="D-AUDIT"');
    expect(html).toContain("指定された場所は復元できません");
    expect(html).not.toContain('data-role-task-restore-status="restored"');
  });

  it("AC-AA-TF-15: FIELD_STAFF first paint remains D-TODAY Task-First", () => {
    const html = renderShell({ presentationRole: "FIELD_STAFF" });
    expect(html).toContain('data-role-task-ia="FIELD_STAFF"');
    expect(html).toContain('data-role-task-destination="D-TODAY"');
    expect(html).not.toContain('data-role-task-ia="ADMIN_AUDIT"');
    const labels = taskGlobalLabels(html);
    expect(labels).toEqual(["今日", "手順", "記録する", "未記録", "探す"]);
  });

  it("AC-AA-TF-16: PLANNER first paint remains Distinct D-HOME", () => {
    const html = renderShell({ presentationRole: "PLANNER" });
    expect(html).toContain('data-role-task-ia="PLANNER"');
    expect(html).toContain('data-role-task-destination="D-HOME"');
    expect(html).not.toContain('data-role-task-ia="ADMIN_AUDIT"');
    const labels = taskGlobalLabels(html);
    expect(labels).toEqual(["今の工程", "探す"]);
  });

  it("AC-AA-TF-17..20: ADMIN_AUDIT Task-First does not grant authority", () => {
    const html = renderShell({ presentationRole: "ADMIN_AUDIT" });
    expect(html).toContain('data-role-task-approval="false"');
    expect(html).toContain('data-role-task-evidence-acceptance="false"');
    expect(html).toContain('data-role-task-publish="false"');
    expect(html).toContain('data-role-task-deploy="false"');
    expect(html).toContain('data-role-task-delete="false"');
    expect(html).toContain('data-role-task-live-write="false"');
  });

  it("AC-AA-TF-8/9: role switch into ADMIN_AUDIT lands D-OPS and away restores FIELD_STAFF", () => {
    const container = document.createElement("div");
    document.body.appendChild(container);
    try {
      act(() => {
        ReactDOM.render(<ScaffoldShell {...baseProps} />, container);
      });
      expect(container.querySelector('[data-role-task-ia="FIELD_STAFF"]')).not.toBeNull();
      const adminOption = container.querySelector<HTMLInputElement>(
        '[data-shell-ux-demo-role="ADMIN_AUDIT"]',
      );
      expect(adminOption).not.toBeNull();
      act(() => {
        Simulate.change(adminOption as HTMLInputElement, { target: adminOption } as never);
      });
      const adminRoot = container.querySelector('[data-role-task-ia="ADMIN_AUDIT"]');
      expect(adminRoot).not.toBeNull();
      expect(adminRoot?.getAttribute("data-role-task-destination")).toBe("D-OPS");
      expect(container.querySelector('[data-role-task-ia="FIELD_STAFF"]')).toBeNull();
      expect(container.querySelector('[data-shell-ux="primary-navigation"]')).toBeNull();
      const fieldOption = container.querySelector<HTMLInputElement>(
        '[data-shell-ux-demo-role="FIELD_STAFF"]',
      );
      act(() => {
        Simulate.change(fieldOption as HTMLInputElement, { target: fieldOption } as never);
      });
      expect(container.querySelector('[data-role-task-ia="FIELD_STAFF"]')).not.toBeNull();
      expect(container.querySelector('[data-role-task-ia="ADMIN_AUDIT"]')).toBeNull();
      expect(
        container
          .querySelector('[data-role-task-ia="FIELD_STAFF"]')
          ?.getAttribute("data-role-task-destination"),
      ).toBe("D-TODAY");
    } finally {
      ReactDOM.unmountComponentAtNode(container);
      container.remove();
    }
  });

  it("AC-AA-TF-8/9: role switch into ADMIN_AUDIT from PLANNER and away restores PLANNER", () => {
    const container = document.createElement("div");
    document.body.appendChild(container);
    const plannerProps = { ...baseProps, presentationRole: "PLANNER" } as IScaffoldShellProps;
    try {
      act(() => {
        ReactDOM.render(<ScaffoldShell {...plannerProps} />, container);
      });
      expect(container.querySelector('[data-role-task-ia="PLANNER"]')).not.toBeNull();
      const adminOption = container.querySelector<HTMLInputElement>(
        '[data-shell-ux-demo-role="ADMIN_AUDIT"]',
      );
      act(() => {
        Simulate.change(adminOption as HTMLInputElement, { target: adminOption } as never);
      });
      expect(container.querySelector('[data-role-task-ia="ADMIN_AUDIT"]')).not.toBeNull();
      expect(container.querySelector('[data-role-task-ia="PLANNER"]')).toBeNull();
      const plannerOption = container.querySelector<HTMLInputElement>(
        '[data-shell-ux-demo-role="PLANNER"]',
      );
      act(() => {
        Simulate.change(plannerOption as HTMLInputElement, { target: plannerOption } as never);
      });
      expect(container.querySelector('[data-role-task-ia="PLANNER"]')).not.toBeNull();
      expect(container.querySelector('[data-role-task-ia="ADMIN_AUDIT"]')).toBeNull();
      expect(
        container
          .querySelector('[data-role-task-ia="PLANNER"]')
          ?.getAttribute("data-role-task-destination"),
      ).toBe("D-HOME");
    } finally {
      ReactDOM.unmountComponentAtNode(container);
      container.remove();
    }
  });
});
