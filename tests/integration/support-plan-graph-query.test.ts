import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { toSupportPlanVersionDto } from "../../src/domain/support-plan";
import { createPlanKey, createVersionRowIdentity } from "../../src/domain/support-plan-row-key";
import { querySupportPlanVersions } from "../../src/integration/sharepoint/support-plan-query";
import { MockGraphListPagePort } from "../../src/testing/mock-graph-list-port";

const input = {
  graphOrigin: "https://graph.microsoft.com",
  listItemsPath: "/v1.0/sites/site-syn/lists/list-syn/items",
  scope: { organizationId: "org-syn", siteId: "site-syn", userId: "user-syn" },
  planId: "plan-syn",
};
const expectedPlanKey = createPlanKey({ ...input.scope, planId: input.planId });
const continuation =
  "https://graph.microsoft.com/v1.0/sites/site-syn/lists/list-syn/items?$skiptoken=page-2";

function graphVersion(version: number, changes: Record<string, unknown> = {}) {
  const identity = createVersionRowIdentity({ ...input.scope, planId: input.planId, version });
  const dto = toSupportPlanVersionDto({
    planId: input.planId,
    OrganizationId: input.scope.organizationId,
    SiteId: input.scope.siteId,
    UserId: input.scope.userId,
    version,
    goals: ["synthetic-goal"],
    supportMethods: ["synthetic-method"],
    precautions: ["synthetic-precaution"],
    reviewCriteria: ["synthetic-review"],
    versionCreatedBy: "synthetic-author",
    versionCreatedAt: "2026-11-03T00:00:00.000Z",
  });
  return {
    fields: {
      RowKind: "V",
      RowKey: identity.rowKey,
      CanonicalKey: identity.canonicalKey,
      PlanKey: expectedPlanKey,
      VersionNumber: String(version),
      PayloadJson: JSON.stringify(dto),
      ...changes,
    },
  };
}

describe("RISK-02 Graph-shaped SupportPlanVersion query", () => {
  it("uses one indexed PlanKey filter, follows every returned page, validates rows, and sorts numerically", async () => {
    const port = new MockGraphListPagePort([
      { status: "SUCCESS", items: [graphVersion(10)], nextLink: continuation },
      {
        status: "SUCCESS",
        items: [graphVersion(2)],
      },
    ]);

    const result = await querySupportPlanVersions(port, input);
    assert.equal(result.status, "SUCCESS");
    if (result.status !== "SUCCESS") return;
    assert.deepEqual(
      result.values.map((value) => value.version),
      [2, 10],
    );
    assert.deepEqual(port.requests, [
      {
        listItemsPath: input.listItemsPath,
        indexedFilter: { field: "PlanKey", value: expectedPlanKey },
        pageSize: 200,
      },
      { listItemsPath: input.listItemsPath, continuation, pageSize: 200 },
    ]);
  });

  it("rejects a partial page, invalid or repeated continuation, and cross-origin links", async () => {
    const cases: readonly (readonly unknown[])[] = [
      [{ status: "SUCCESS", items: [graphVersion(1)], complete: false }],
      [{ status: "SUCCESS", items: [], nextLink: "not-a-url" }],
      [
        { status: "SUCCESS", items: [], nextLink: continuation },
        { status: "SUCCESS", items: [], nextLink: continuation },
      ],
      [{ status: "SUCCESS", items: [], nextLink: "https://example.invalid/v1.0/next" }],
    ];

    for (const pages of cases) {
      const result = await querySupportPlanVersions(
        new MockGraphListPagePort(pages as never),
        input,
      );
      assert.equal(result.status, "ERROR");
    }
  });

  it("rejects a same-origin continuation that changes the target list", async () => {
    const result = await querySupportPlanVersions(
      new MockGraphListPagePort([
        {
          status: "SUCCESS",
          items: [],
          nextLink:
            "https://graph.microsoft.com/v1.0/sites/site-syn/lists/other-list/items?$skiptoken=next",
        },
        { status: "SUCCESS", items: [] },
      ]),
      input,
    );
    assert.deepEqual(result, { status: "ERROR", reasonCode: "GRAPH_CONTINUATION_INVALID" });
  });

  it("fails closed when continuation paging exceeds the bounded page count", async () => {
    const pages = Array.from({ length: 26 }, (_, index) => ({
      status: "SUCCESS" as const,
      items: [],
      nextLink: `https://graph.microsoft.com${input.listItemsPath}?$skiptoken=${index + 1}`,
    }));
    const result = await querySupportPlanVersions(new MockGraphListPagePort(pages), input);
    assert.deepEqual(result, { status: "ERROR", reasonCode: "GRAPH_PAGE_LIMIT_EXCEEDED" });
  });

  it("rejects duplicate rows, scope/plan drift, invalid DTOs, and threshold-sized results", async () => {
    const duplicate = graphVersion(1);
    const cases = [
      [duplicate, duplicate],
      [graphVersion(1, { PlanKey: "pk1:" + "0".repeat(64) })],
      [
        graphVersion(1, {
          CanonicalKey: JSON.stringify([
            "rk1",
            "V",
            "other-org",
            "site-syn",
            "user-syn",
            "plan-syn",
            "1",
          ]),
        }),
      ],
      [graphVersion(1, { PayloadJson: "{}" })],
      Array.from({ length: 5000 }, () => graphVersion(1)).map((row, index) => ({
        fields: { ...row.fields, RowKey: `duplicate-${index}`, CanonicalKey: `invalid-${index}` },
      })),
    ];

    for (const items of cases) {
      const result = await querySupportPlanVersions(
        new MockGraphListPagePort([{ status: "SUCCESS", items }]),
        input,
      );
      assert.equal(result.status, "ERROR");
    }
  });

  it("does not turn a Graph page error into partial success", async () => {
    const result = await querySupportPlanVersions(
      new MockGraphListPagePort([
        { status: "SUCCESS", items: [graphVersion(1)], nextLink: continuation },
        { status: "ERROR", reasonCode: "SYNTHETIC_PAGE_FAILURE" },
      ]),
      input,
    );
    assert.deepEqual(result, { status: "ERROR", reasonCode: "SYNTHETIC_PAGE_FAILURE" });
  });

  it("rejects an unknown page status and numeric VersionNumber instead of coercing", async () => {
    const unknownStatus = await querySupportPlanVersions(
      new MockGraphListPagePort([{ status: "UNEXPECTED", items: [graphVersion(1)] } as never]),
      input,
    );
    assert.deepEqual(unknownStatus, { status: "ERROR", reasonCode: "GRAPH_PAGE_READ_FAILED" });

    const numericVersion = await querySupportPlanVersions(
      new MockGraphListPagePort([
        { status: "SUCCESS", items: [graphVersion(1, { VersionNumber: 1 })] },
      ]),
      input,
    );
    assert.deepEqual(numericVersion, {
      status: "ERROR",
      reasonCode: "GRAPH_VERSION_IDENTITY_MISMATCH",
    });
  });
});
