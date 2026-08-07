import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type {
  RepositoryListResult,
  RepositoryLookupResult,
  SupportPlan,
  SupportPlanVersion,
} from "../../src/domain";
import {
  SUPPORT_PLAN_SCHEMA_ID,
  SUPPORT_PLAN_SCHEMA_VERSION,
  SUPPORT_PLAN_VERSION_SCHEMA_ID,
  SUPPORT_PLAN_VERSION_SCHEMA_VERSION,
  validateSupportPlanDto,
  validateSupportPlanVersionDto,
} from "../../src/domain/support-plan";
import {
  createSyntheticActivePlan,
  createSyntheticClosedPlan,
  createSyntheticDraftPlan,
  createSyntheticPendingReviewPlan,
  createSyntheticPlanVersion1,
  createSyntheticReturnedPlan,
  wrapSupportPlanDto,
  wrapSupportPlanVersionDto,
} from "../domain/support-plan-fixtures";

describe("SupportPlan DTO Contract (Issue #42 PR-A2)", () => {
  it("accepts Draft through Closed envelopes via DTO validators", () => {
    const cases: readonly SupportPlan[] = [
      createSyntheticDraftPlan(),
      createSyntheticPendingReviewPlan(),
      createSyntheticReturnedPlan(),
      createSyntheticActivePlan(),
      createSyntheticClosedPlan(),
    ];

    for (const plan of cases) {
      assert.equal(validateSupportPlanDto(wrapSupportPlanDto(plan)), true);
    }
  });

  it("accepts SupportPlanVersion envelopes via DTO validators", () => {
    assert.equal(
      validateSupportPlanVersionDto(wrapSupportPlanVersionDto(createSyntheticPlanVersion1())),
      true,
    );
  });

  it("rejects Schema ID mismatch on SupportPlan DTO", () => {
    const dto = wrapSupportPlanDto(createSyntheticDraftPlan());
    assert.equal(
      validateSupportPlanDto({
        ...dto,
        schemaId: "severe-behavior-support.support-plan.other",
      }),
      false,
    );
  });

  it("rejects Schema Version mismatch on SupportPlan DTO", () => {
    const dto = wrapSupportPlanDto(createSyntheticDraftPlan());
    assert.equal(
      validateSupportPlanDto({
        ...dto,
        schemaVersion: "2.0.0",
        dtoVersion: SUPPORT_PLAN_SCHEMA_VERSION,
      }),
      false,
    );
  });

  it("rejects DTO Version mismatch on SupportPlan DTO", () => {
    const dto = wrapSupportPlanDto(createSyntheticDraftPlan());
    assert.equal(
      validateSupportPlanDto({
        ...dto,
        schemaVersion: SUPPORT_PLAN_SCHEMA_VERSION,
        dtoVersion: "2.0.0",
      }),
      false,
    );
  });

  it("rejects Schema ID mismatch on SupportPlanVersion DTO", () => {
    const dto = wrapSupportPlanVersionDto(createSyntheticPlanVersion1());
    assert.equal(
      validateSupportPlanVersionDto({
        ...dto,
        schemaId: SUPPORT_PLAN_SCHEMA_ID,
      }),
      false,
    );
  });

  it("rejects Schema Version and DTO Version mismatches on SupportPlanVersion DTO", () => {
    const dto = wrapSupportPlanVersionDto(createSyntheticPlanVersion1());
    assert.equal(
      validateSupportPlanVersionDto({
        ...dto,
        schemaVersion: "9.9.9",
        dtoVersion: SUPPORT_PLAN_VERSION_SCHEMA_VERSION,
      }),
      false,
    );
    assert.equal(
      validateSupportPlanVersionDto({
        ...dto,
        schemaVersion: SUPPORT_PLAN_VERSION_SCHEMA_VERSION,
        dtoVersion: "9.9.9",
      }),
      false,
    );
  });

  it("rejects unknown status through DTO validation", () => {
    const dto = wrapSupportPlanDto(
      createSyntheticDraftPlan({
        status: "Archived" as SupportPlan["status"],
      }),
    );
    assert.equal(validateSupportPlanDto(dto), false);
  });

  it("rejects required field omissions through DTO validation", () => {
    const missingOrg = wrapSupportPlanDto(
      createSyntheticDraftPlan({
        OrganizationId: undefined as unknown as string,
      }),
    );
    assert.equal(validateSupportPlanDto(missingOrg), false);

    const missingSubmitted = wrapSupportPlanDto(
      createSyntheticPendingReviewPlan({
        submittedBy: undefined as unknown as string,
      }),
    );
    assert.equal(validateSupportPlanDto(missingSubmitted), false);

    const missingPlanId = wrapSupportPlanVersionDto(
      createSyntheticPlanVersion1({
        planId: undefined as unknown as string,
      }),
    );
    assert.equal(validateSupportPlanVersionDto(missingPlanId), false);
  });

  it("rejects currentVersion 0 and non-integer version through DTO validation", () => {
    assert.equal(
      validateSupportPlanDto(
        wrapSupportPlanDto(
          createSyntheticDraftPlan({
            currentVersion: 0,
          }),
        ),
      ),
      false,
    );
    assert.equal(
      validateSupportPlanDto(
        wrapSupportPlanDto(
          createSyntheticDraftPlan({
            version: 1.5,
          }),
        ),
      ),
      false,
    );
  });

  it("rejects SupportPlanVersion version 0 and fractional version through DTO validation", () => {
    assert.equal(
      validateSupportPlanVersionDto(
        wrapSupportPlanVersionDto(
          createSyntheticPlanVersion1({
            version: 0,
          }),
        ),
      ),
      false,
    );
    assert.equal(
      validateSupportPlanVersionDto(
        wrapSupportPlanVersionDto(
          createSyntheticPlanVersion1({
            version: 2.25,
          }),
        ),
      ),
      false,
    );
  });

  it("keeps PlanId and planId differences explicit across DTO envelopes", () => {
    const planDto = wrapSupportPlanDto(createSyntheticDraftPlan());
    const versionDto = wrapSupportPlanVersionDto(createSyntheticPlanVersion1());

    assert.equal(planDto.schemaId, SUPPORT_PLAN_SCHEMA_ID);
    assert.equal(versionDto.schemaId, SUPPORT_PLAN_VERSION_SCHEMA_ID);
    assert.equal("PlanId" in planDto.data, true);
    assert.equal("planId" in planDto.data, false);
    assert.equal("planId" in versionDto.data, true);
    assert.equal("PlanId" in versionDto.data, false);
    assert.equal(planDto.data.PlanId, versionDto.data.planId);
  });
});

describe("SupportPlan Repository result contracts (Issue #42 PR-A2)", () => {
  it("distinguishes NOT_FOUND from ERROR on lookup results", () => {
    const found: RepositoryLookupResult<SupportPlan> = {
      status: "FOUND",
      value: createSyntheticDraftPlan(),
    };
    const notFound: RepositoryLookupResult<SupportPlan> = {
      status: "NOT_FOUND",
    };
    const error: RepositoryLookupResult<SupportPlan> = {
      status: "ERROR",
      reasonCode: "SYNTHETIC_LOOKUP_FAILED",
    };

    assert.equal(found.status, "FOUND");
    assert.equal(notFound.status, "NOT_FOUND");
    assert.equal(error.status, "ERROR");
    assert.notEqual(notFound.status, error.status);
    assert.equal("value" in notFound, false);
    assert.equal("reasonCode" in notFound, false);
    assert.equal("reasonCode" in error, true);
    assert.equal("value" in error, false);
  });

  it("allows empty arrays only for successful list results", () => {
    const emptySuccess: RepositoryListResult<SupportPlanVersion> = {
      status: "SUCCESS",
      values: [],
    };
    const nonEmptySuccess: RepositoryListResult<SupportPlanVersion> = {
      status: "SUCCESS",
      values: [createSyntheticPlanVersion1()],
    };
    const listError: RepositoryListResult<SupportPlanVersion> = {
      status: "ERROR",
      reasonCode: "SYNTHETIC_LIST_FAILED",
    };

    assert.equal(emptySuccess.status, "SUCCESS");
    assert.deepEqual(emptySuccess.values, []);
    assert.equal(nonEmptySuccess.values.length, 1);
    assert.equal(listError.status, "ERROR");
    assert.equal("values" in listError, false);
    assert.notEqual(emptySuccess.status, listError.status);
  });
});
