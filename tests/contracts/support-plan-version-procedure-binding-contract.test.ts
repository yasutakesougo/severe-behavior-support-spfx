import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  SUPPORT_PLAN_VERSION_PROCEDURE_BINDING_SCHEMA_ID,
  SUPPORT_PLAN_VERSION_PROCEDURE_BINDING_SCHEMA_VERSION,
  bindingMatchesSupportPlanVersion,
  hasUniqueSupportPlanVersionProcedureBindings,
  supportPlanVersionProcedureBindingUniquenessKey,
  toSupportPlanVersionProcedureBindingDto,
  validateSupportPlanVersionProcedureBinding,
  validateSupportPlanVersionProcedureBindingDto,
} from "../../src/domain/support-plan-version-procedure-binding";
import {
  createSyntheticLinkedPlanVersionForBinding,
  createSyntheticSupportPlanVersionProcedureBinding,
  createSyntheticSupportPlanVersionProcedureBindingDto,
} from "../domain/support-plan-version-procedure-binding-fixtures";

describe("SupportPlanVersionProcedureBinding contract (Issue #347 / Option A2)", () => {
  it("exposes DEC-1 Schema ID and Version for the binding", () => {
    assert.equal(
      SUPPORT_PLAN_VERSION_PROCEDURE_BINDING_SCHEMA_ID,
      "severe-behavior-support.support-plan.version-procedure-binding",
    );
    assert.equal(SUPPORT_PLAN_VERSION_PROCEDURE_BINDING_SCHEMA_VERSION, "1.0.0");
  });

  it("accepts the minimal binding shape and DTO envelope", () => {
    const binding = createSyntheticSupportPlanVersionProcedureBinding();
    assert.equal(validateSupportPlanVersionProcedureBinding(binding), true);

    const dto = toSupportPlanVersionProcedureBindingDto(binding);
    assert.equal(dto.schemaId, SUPPORT_PLAN_VERSION_PROCEDURE_BINDING_SCHEMA_ID);
    assert.equal(dto.schemaVersion, SUPPORT_PLAN_VERSION_PROCEDURE_BINDING_SCHEMA_VERSION);
    assert.equal(dto.dtoVersion, dto.schemaVersion);
    assert.equal(validateSupportPlanVersionProcedureBindingDto(dto), true);
  });

  it("rejects missing or empty identity fields", () => {
    const valid = createSyntheticSupportPlanVersionProcedureBinding();
    assert.equal(
      validateSupportPlanVersionProcedureBinding({ ...valid, OrganizationId: "" }),
      false,
    );
    assert.equal(validateSupportPlanVersionProcedureBinding({ ...valid, SiteId: " " }), false);
    assert.equal(validateSupportPlanVersionProcedureBinding({ ...valid, UserId: "" }), false);
    assert.equal(validateSupportPlanVersionProcedureBinding({ ...valid, planId: "" }), false);
    const { planId: _planId, ...withoutPlanId } = valid;
    assert.equal(validateSupportPlanVersionProcedureBinding(withoutPlanId), false);
  });

  it("requires planVersion to be an integer >= 1", () => {
    const valid = createSyntheticSupportPlanVersionProcedureBinding();
    assert.equal(validateSupportPlanVersionProcedureBinding({ ...valid, planVersion: 0 }), false);
    assert.equal(validateSupportPlanVersionProcedureBinding({ ...valid, planVersion: 1.5 }), false);
    assert.equal(
      validateSupportPlanVersionProcedureBinding({
        ...valid,
        planVersion: "1" as unknown as number,
      }),
      false,
    );
  });

  it("reuses ApprovedProcedureReference and rejects non-APPROVED procedures", () => {
    const valid = createSyntheticSupportPlanVersionProcedureBinding();
    assert.equal(valid.Procedure.ApprovalState, "APPROVED");
    assert.equal(
      validateSupportPlanVersionProcedureBinding({
        ...valid,
        Procedure: {
          ...valid.Procedure,
          ApprovalState: "DRAFT" as "APPROVED",
        },
      }),
      false,
    );
    assert.equal(
      validateSupportPlanVersionProcedureBinding({
        ...valid,
        Procedure: {
          ProcedureId: "",
          ProcedureVersion: valid.Procedure.ProcedureVersion,
          ApprovalState: "APPROVED",
        },
      }),
      false,
    );
  });

  it("does not accept procedure body / result / clock fields as required contract surface", () => {
    const binding = createSyntheticSupportPlanVersionProcedureBinding();
    assert.deepEqual(Object.keys(binding).sort(), [
      "OrganizationId",
      "Procedure",
      "SiteId",
      "UserId",
      "planId",
      "planVersion",
    ]);
    assert.deepEqual(Object.keys(binding.Procedure).sort(), [
      "ApprovalState",
      "ProcedureId",
      "ProcedureVersion",
    ]);
    assert.equal(validateSupportPlanVersionProcedureBinding(binding), true);
  });

  it("rejects schemaId / schemaVersion / dtoVersion mismatches on DTO", () => {
    const valid = createSyntheticSupportPlanVersionProcedureBindingDto();
    assert.equal(
      validateSupportPlanVersionProcedureBindingDto({
        ...valid,
        schemaId: "severe-behavior-support.support-plan.other",
      }),
      false,
    );
    assert.equal(
      validateSupportPlanVersionProcedureBindingDto({
        ...valid,
        schemaVersion: "2.0.0",
        dtoVersion: "2.0.0",
      }),
      false,
    );
    assert.equal(
      validateSupportPlanVersionProcedureBindingDto({
        ...valid,
        dtoVersion: "1.0.1",
      }),
      false,
    );
  });

  it("treats uniqueness as OrganizationId+SiteId+(planId,planVersion,ProcedureId,ProcedureVersion)", () => {
    const first = createSyntheticSupportPlanVersionProcedureBinding();
    const duplicate = createSyntheticSupportPlanVersionProcedureBinding();
    const secondProcedure = createSyntheticSupportPlanVersionProcedureBinding({
      Procedure: {
        ProcedureId: "synthetic-procedure-002",
        ProcedureVersion: "synthetic-procedure-version-001",
        ApprovalState: "APPROVED",
      },
    });

    assert.equal(hasUniqueSupportPlanVersionProcedureBindings([first, secondProcedure]), true);
    assert.equal(hasUniqueSupportPlanVersionProcedureBindings([first, duplicate]), false);

    const key = supportPlanVersionProcedureBindingUniquenessKey(first);
    assert.deepEqual(key, {
      OrganizationId: first.OrganizationId,
      SiteId: first.SiteId,
      planId: first.planId,
      planVersion: first.planVersion,
      ProcedureId: first.Procedure.ProcedureId,
      ProcedureVersion: first.Procedure.ProcedureVersion,
    });
  });

  it("requires UserId and plan identity to match the linked SupportPlanVersion", () => {
    const binding = createSyntheticSupportPlanVersionProcedureBinding();
    const planVersion = createSyntheticLinkedPlanVersionForBinding();
    assert.equal(bindingMatchesSupportPlanVersion(binding, planVersion), true);
    assert.equal(
      bindingMatchesSupportPlanVersion({ ...binding, UserId: "synthetic-user-999" }, planVersion),
      false,
    );
    assert.equal(bindingMatchesSupportPlanVersion(binding, { ...planVersion, version: 2 }), false);
  });
});
