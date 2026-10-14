import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { buildDemoMonitoringForVersion, monitoringQueryForVersion } from "../monitoring";
import {
  buildMonitoringReviewInput,
  type MonitoringReviewInputResult,
} from "../monitoring/monitoring-review-input";
import type { ReviewPresentationContext } from "../../sbs-domain/monitoring-read-model.bundle";
import { DEMO_UX_SUPPORT_PLAN_FIXTURE } from "../users";
import { AppShellChrome } from "./AppShellChrome";
import { DEMO_1_FIELD_STAFF_FIXTURE } from "./fixture";
import { PLANNER_DEMO_LAWFUL_PERSON_PLAN_CONTEXT } from "./planner-task-navigation";
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

const reviewModelV2Result = buildDemoMonitoringForVersion(2);
if (reviewModelV2Result.status !== "RESOLVED") {
  throw new Error("expected resolved v2 monitoring fixture for D-MONITOR review tests");
}
const syntheticReviewAuthority = {
  status: "FOUND",
  MappingKey: {
    SourceSystem: "synthetic-smoke",
    OrganizationId: "synthetic-org-001",
    SourceScope: "synthetic-monitoring-smoke",
    LegacyKeyType: "UserId",
    LegacyKeyValue: "user-a",
  },
} as const;
const reviewInputV2 = buildMonitoringReviewInput(
  syntheticReviewAuthority,
  monitoringQueryForVersion(2),
  reviewModelV2Result.value,
);
const reviewContextV2: ReviewPresentationContext = monitoringQueryForVersion(2);

function renderPlannerMonitor(
  version: number,
  options: Readonly<{
    reviewInput?: MonitoringReviewInputResult;
    reviewContext?: ReviewPresentationContext;
    supportPlanIdentity?: Partial<Pick<typeof DEMO_UX_SUPPORT_PLAN_FIXTURE, "userId" | "planId">>;
    omitReviewInput?: boolean;
    omitReviewContext?: boolean;
    omitPersonPlanContext?: boolean;
  }> = {},
): string {
  return renderToStaticMarkup(
    <AppShellChrome
      {...chromeProps}
      presentationRole="PLANNER"
      selectedDestination="users"
      supportPlanPresentation={{
        ...DEMO_UX_SUPPORT_PLAN_FIXTURE,
        ...options.supportPlanIdentity,
        currentVersion: version,
      }}
      monitoringReviewInput={
        options.omitReviewInput ? undefined : (options.reviewInput ?? reviewInputV2)
      }
      monitoringReviewPresentationContext={
        options.omitReviewContext ? undefined : (options.reviewContext ?? reviewContextV2)
      }
      plannerTaskDestination="D-MONITOR"
      plannerPersonPlanContext={
        options.omitPersonPlanContext
          ? undefined
          : PLANNER_DEMO_LAWFUL_PERSON_PLAN_CONTEXT
      }
    />,
  );
}

describe("D-MONITOR review context binding", () => {
  it("rebinds existing person resolution to the target version and preserves the zero-record state", () => {
    const html = renderPlannerMonitor(1);

    expect(html).toContain('data-role-task-product-body="D-MONITOR"');
    expect(html).not.toContain("data-dashboard-ux=\"overview-dashboard\"");
    expect(html).toContain('data-human-review-status="RESOLVED"');
    expect(html).toContain('data-human-review-zero-records="true"');
    expect(html).toContain('data-monitoring-zero-not-not-performed="true"');
    expect(html).not.toContain('data-human-review-result="NOT_PERFORMED"');
  });

  it("shows the actual NOT_PERFORMED record on the D-MONITOR product body", () => {
    const html = renderPlannerMonitor(2);

    expect(html).toContain('data-role-task-product-body="D-MONITOR"');
    expect(html).toContain('data-human-review-status="RESOLVED"');
    expect(html).toContain('data-human-review-record-id="synthetic-monitoring-v2-003"');
    expect(html).toContain('data-human-review-result="NOT_PERFORMED"');
    expect(html).toContain('data-human-review-result-fact="NOT_PERFORMED"');
  });

  it("keeps review materials unresolved when review authority or context is missing or mismatched", () => {
    const missingAuthorityHtml = renderPlannerMonitor(2, { omitReviewInput: true });
    const mismatchedAuthority =
      reviewInputV2.status === "RESOLVED"
        ? {
            status: "RESOLVED" as const,
            value: {
              ...reviewInputV2.value,
              personResolution: {
                ...reviewInputV2.value.personResolution,
                MappingKey: {
                  ...reviewInputV2.value.personResolution.MappingKey,
                  LegacyKeyValue: "user-b",
                },
              },
            },
          }
        : reviewInputV2;
    const mismatchedAuthorityHtml = renderPlannerMonitor(2, {
      reviewInput: mismatchedAuthority,
    });
    const missingContextHtml = renderPlannerMonitor(2, { omitReviewContext: true });
    const mismatchedContextHtml = renderPlannerMonitor(2, {
      reviewContext: { ...reviewContextV2, UserId: "user-b" },
    });

    for (const html of [
      missingAuthorityHtml,
      mismatchedAuthorityHtml,
      missingContextHtml,
      mismatchedContextHtml,
    ]) {
      expect(html).toContain('data-role-task-product-body="D-MONITOR"');
      expect(html).toContain('data-human-review-status="UNRESOLVED"');
      expect(html).not.toContain('data-human-review-result="NOT_PERFORMED"');
      expect(html).not.toContain('data-human-review-zero-records="true"');
    }
  });

  it("does not render D-MONITOR without the lawful person/plan context", () => {
    const html = renderPlannerMonitor(2, { omitPersonPlanContext: true });

    expect(html).not.toContain('data-role-task-product-body="D-MONITOR"');
    expect(html).not.toContain('data-human-review-result="NOT_PERFORMED"');
  });

  it("does not render D-MONITOR when support-plan presentation identity mismatches the lawful context", () => {
    const mismatchedUserHtml = renderPlannerMonitor(2, {
      supportPlanIdentity: { userId: "user-b" },
    });
    const mismatchedPlanHtml = renderPlannerMonitor(2, {
      supportPlanIdentity: { planId: "synthetic-plan-002" },
    });

    for (const html of [mismatchedUserHtml, mismatchedPlanHtml]) {
      expect(html).not.toContain('data-role-task-product-body="D-MONITOR"');
      expect(html).not.toContain('data-human-review-result="NOT_PERFORMED"');
    }
  });
});

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
