import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { SyntheticSupportPlanRepository } from "../../src/testing/synthetic-support-plan-repository";
import {
  createSyntheticDraftPlan,
  createSyntheticPlanVersion1,
  createSyntheticPlanVersion2,
} from "./support-plan-fixtures";

describe("RISK-02 scoped synthetic SupportPlan repositories", () => {
  const planA = createSyntheticDraftPlan({
    PlanId: "shared-plan",
    OrganizationId: "org-a",
    SiteId: "site-a",
    UserId: "user-a",
  });
  const planB = createSyntheticDraftPlan({
    PlanId: "shared-plan",
    OrganizationId: "org-a",
    SiteId: "site-a",
    UserId: "user-b",
  });
  const planOtherOrganization = createSyntheticDraftPlan({
    PlanId: "shared-plan",
    OrganizationId: "org-b",
    SiteId: "site-a",
    UserId: "user-a",
  });
  const planOtherSite = createSyntheticDraftPlan({
    PlanId: "shared-plan",
    OrganizationId: "org-a",
    SiteId: "site-b",
    UserId: "user-a",
  });
  const versionA1 = createSyntheticPlanVersion1({
    planId: "shared-plan",
    OrganizationId: "org-a",
    SiteId: "site-a",
    UserId: "user-a",
  });
  const versionA2 = createSyntheticPlanVersion2({
    planId: "shared-plan",
    OrganizationId: "org-a",
    SiteId: "site-a",
    UserId: "user-a",
  });
  const versionB1 = createSyntheticPlanVersion1({
    planId: "shared-plan",
    OrganizationId: "org-a",
    SiteId: "site-a",
    UserId: "user-b",
  });

  it("TC-PORT-PLANID-SCOPE-01 does not cross-read the same planId across users", async () => {
    const repository = new SyntheticSupportPlanRepository({
      plans: [planA, planB],
      versions: [versionA1, versionB1],
    });

    const foundA = await repository.getById({
      organizationId: "org-a",
      siteId: "site-a",
      userId: "user-a",
      planId: "shared-plan",
    });
    const foundB = await repository.getById({
      organizationId: "org-a",
      siteId: "site-a",
      userId: "user-b",
      planId: "shared-plan",
    });
    const wrongScope = await repository.getById({
      organizationId: "org-a",
      siteId: "site-a",
      userId: "user-c",
      planId: "shared-plan",
    });
    const wrongOrganization = await repository.getById({
      organizationId: "org-b",
      siteId: "site-a",
      userId: "user-a",
      planId: "shared-plan",
    });
    const wrongSite = await repository.getById({
      organizationId: "org-a",
      siteId: "site-b",
      userId: "user-a",
      planId: "shared-plan",
    });

    assert.deepEqual(foundA, { status: "FOUND", value: planA });
    assert.deepEqual(foundB, { status: "FOUND", value: planB });
    assert.deepEqual(wrongScope, { status: "NOT_FOUND" });
    assert.deepEqual(wrongOrganization, { status: "NOT_FOUND" });
    assert.deepEqual(wrongSite, { status: "NOT_FOUND" });
  });

  it("does not cross-read the same planId across organizations or sites", async () => {
    const repository = new SyntheticSupportPlanRepository({
      plans: [planA, planOtherOrganization, planOtherSite],
    });

    assert.deepEqual(
      await repository.getById({
        organizationId: "org-b",
        siteId: "site-a",
        userId: "user-a",
        planId: "shared-plan",
      }),
      { status: "FOUND", value: planOtherOrganization },
    );
    assert.deepEqual(
      await repository.getById({
        organizationId: "org-a",
        siteId: "site-b",
        userId: "user-a",
        planId: "shared-plan",
      }),
      { status: "FOUND", value: planOtherSite },
    );
  });

  it("uses the complete scope for version lookup and list", async () => {
    const repository = new SyntheticSupportPlanRepository({
      plans: [planA, planB],
      versions: [versionA1, versionA2, versionB1],
    });

    assert.deepEqual(
      await repository.getVersion({
        organizationId: "org-a",
        siteId: "site-a",
        userId: "user-a",
        planId: "shared-plan",
        version: 2,
      }),
      { status: "FOUND", value: versionA2 },
    );
    assert.deepEqual(
      await repository.getVersion({
        organizationId: "org-a",
        siteId: "site-a",
        userId: "user-b",
        planId: "shared-plan",
        version: 2,
      }),
      { status: "NOT_FOUND" },
    );

    const listed = await repository.listVersions({
      organizationId: "org-a",
      siteId: "site-a",
      userId: "user-a",
      planId: "shared-plan",
    });
    assert.deepEqual(listed, { status: "SUCCESS", values: [versionA1, versionA2] });
  });

  it("rejects duplicate version save without replacing the stored version", async () => {
    const repository = new SyntheticSupportPlanRepository({ versions: [versionA1] });
    const changedBody = createSyntheticPlanVersion1({
      ...versionA1,
      supportMethods: ["replacement must not be stored"],
    });

    const saved = await repository.saveVersion(changedBody);
    assert.equal(saved.status, "CONFLICT");
    assert.deepEqual(
      await repository.getVersion({
        organizationId: "org-a",
        siteId: "site-a",
        userId: "user-a",
        planId: "shared-plan",
        version: 1,
      }),
      { status: "FOUND", value: versionA1 },
    );
  });

  it("fails closed when the backing rows contain an ambiguous scoped identity", async () => {
    const duplicatePlan = { ...planA, createdAt: "2026-08-07T10:00:00.000Z" };
    const repository = new SyntheticSupportPlanRepository({ plans: [planA, duplicatePlan] });

    assert.deepEqual(
      await repository.getById({
        organizationId: "org-a",
        siteId: "site-a",
        userId: "user-a",
        planId: "shared-plan",
      }),
      { status: "ERROR", reasonCode: "AMBIGUOUS_MATCH" },
    );
  });

  it("fails closed when a scoped plan list contains duplicate plan identities", async () => {
    const duplicatePlan = { ...planA, createdAt: "2026-08-07T10:00:00.000Z" };
    const repository = new SyntheticSupportPlanRepository({ plans: [planA, duplicatePlan] });

    assert.deepEqual(
      await repository.findByUser({ organizationId: "org-a", siteId: "site-a", userId: "user-a" }),
      { status: "ERROR", reasonCode: "AMBIGUOUS_PLAN_IDENTITY" },
    );
  });

  it("TC-IR-04 snapshots nested version arrays on save and on every read", async () => {
    const repository = new SyntheticSupportPlanRepository();
    const input = createSyntheticPlanVersion1({
      supportMethods: ["original method"],
    });
    const writableInput = input as unknown as { supportMethods: string[] };

    const saved = await repository.saveVersion(input);
    assert.equal(saved.status, "SUCCESS");
    if (saved.status !== "SUCCESS") return;

    writableInput.supportMethods[0] = "changed through save input";
    (saved.value.supportMethods as string[])[0] = "changed through save result";

    const identity = {
      organizationId: "synthetic-org-001",
      siteId: "synthetic-site-001",
      userId: "synthetic-user-001",
      planId: "synthetic-plan-001",
      version: 1,
    };
    const found = await repository.getVersion(identity);
    const listed = await repository.listVersions({
      organizationId: identity.organizationId,
      siteId: identity.siteId,
      userId: identity.userId,
      planId: identity.planId,
    });

    assert.equal(found.status, "FOUND");
    if (found.status === "FOUND") assert.deepEqual(found.value.supportMethods, ["original method"]);
    assert.equal(listed.status, "SUCCESS");
    if (listed.status === "SUCCESS") {
      assert.deepEqual(listed.values[0].supportMethods, ["original method"]);
      (listed.values[0].supportMethods as string[])[0] = "changed through list result";
    }

    const readAgain = await repository.getVersion(identity);
    assert.equal(readAgain.status, "FOUND");
    if (readAgain.status === "FOUND")
      assert.deepEqual(readAgain.value.supportMethods, ["original method"]);
  });
});
