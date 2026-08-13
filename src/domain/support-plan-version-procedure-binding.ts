import type { ApprovedProcedureReference } from "../contracts/types";
import type { SupportPlanVersion } from "./support-plan";
import { isNonEmptyString, isRecord } from "./validation";

/**
 * Schema identity for SupportPlanVersionProcedureBinding
 * (Design-FIELD-WORKFLOW-CONTRACT-A-MIN-SHAPE-1 / Issue #347 / Option A2).
 * Not identical to SharePoint list/column names or TypeScript type names (DEC-1).
 */
export const SUPPORT_PLAN_VERSION_PROCEDURE_BINDING_SCHEMA_ID =
  "severe-behavior-support.support-plan.version-procedure-binding" as const;
export const SUPPORT_PLAN_VERSION_PROCEDURE_BINDING_SCHEMA_VERSION = "1.0.0" as const;

/**
 * Minimal binding between a SupportPlanVersion and an APPROVED procedure reference.
 *
 * Option A2: no procedure body fields. Presentation projection stays outside this contract.
 * Does not replace ExecutionRecord.Procedure or define ProcedureRecord (Issue B).
 */
export type SupportPlanVersionProcedureBinding = Readonly<{
  OrganizationId: string;
  SiteId: string;
  UserId: string;
  planId: string;
  planVersion: number;
  Procedure: ApprovedProcedureReference;
}>;

export type SupportPlanVersionProcedureBindingDto = Readonly<{
  schemaId: typeof SUPPORT_PLAN_VERSION_PROCEDURE_BINDING_SCHEMA_ID;
  schemaVersion: typeof SUPPORT_PLAN_VERSION_PROCEDURE_BINDING_SCHEMA_VERSION;
  dtoVersion: typeof SUPPORT_PLAN_VERSION_PROCEDURE_BINDING_SCHEMA_VERSION;
  data: SupportPlanVersionProcedureBinding;
}>;

export type SupportPlanVersionProcedureBindingUniquenessKey = Readonly<{
  OrganizationId: string;
  SiteId: string;
  planId: string;
  planVersion: number;
  ProcedureId: string;
  ProcedureVersion: string;
}>;

export const toSupportPlanVersionProcedureBindingDto = (
  data: SupportPlanVersionProcedureBinding,
): SupportPlanVersionProcedureBindingDto => ({
  schemaId: SUPPORT_PLAN_VERSION_PROCEDURE_BINDING_SCHEMA_ID,
  schemaVersion: SUPPORT_PLAN_VERSION_PROCEDURE_BINDING_SCHEMA_VERSION,
  dtoVersion: SUPPORT_PLAN_VERSION_PROCEDURE_BINDING_SCHEMA_VERSION,
  data,
});

function isApprovedProcedureReference(value: unknown): value is ApprovedProcedureReference {
  if (!isRecord(value)) {
    return false;
  }

  return (
    isNonEmptyString(value.ProcedureId) &&
    isNonEmptyString(value.ProcedureVersion) &&
    value.ApprovalState === "APPROVED"
  );
}

export function validateSupportPlanVersionProcedureBinding(
  value: unknown,
): value is SupportPlanVersionProcedureBinding {
  if (!isRecord(value)) {
    return false;
  }

  return (
    isNonEmptyString(value.OrganizationId) &&
    isNonEmptyString(value.SiteId) &&
    isNonEmptyString(value.UserId) &&
    isNonEmptyString(value.planId) &&
    typeof value.planVersion === "number" &&
    Number.isInteger(value.planVersion) &&
    value.planVersion >= 1 &&
    isApprovedProcedureReference(value.Procedure)
  );
}

export function validateSupportPlanVersionProcedureBindingDto(
  value: unknown,
): value is SupportPlanVersionProcedureBindingDto {
  if (!isRecord(value)) {
    return false;
  }

  return (
    value.schemaId === SUPPORT_PLAN_VERSION_PROCEDURE_BINDING_SCHEMA_ID &&
    value.schemaVersion === SUPPORT_PLAN_VERSION_PROCEDURE_BINDING_SCHEMA_VERSION &&
    value.dtoVersion === SUPPORT_PLAN_VERSION_PROCEDURE_BINDING_SCHEMA_VERSION &&
    validateSupportPlanVersionProcedureBinding(value.data)
  );
}

export function supportPlanVersionProcedureBindingUniquenessKey(
  binding: SupportPlanVersionProcedureBinding,
): SupportPlanVersionProcedureBindingUniquenessKey {
  return {
    OrganizationId: binding.OrganizationId,
    SiteId: binding.SiteId,
    planId: binding.planId,
    planVersion: binding.planVersion,
    ProcedureId: binding.Procedure.ProcedureId,
    ProcedureVersion: binding.Procedure.ProcedureVersion,
  };
}

function uniquenessKeyEquals(
  left: SupportPlanVersionProcedureBindingUniquenessKey,
  right: SupportPlanVersionProcedureBindingUniquenessKey,
): boolean {
  return (
    left.OrganizationId === right.OrganizationId &&
    left.SiteId === right.SiteId &&
    left.planId === right.planId &&
    left.planVersion === right.planVersion &&
    left.ProcedureId === right.ProcedureId &&
    left.ProcedureVersion === right.ProcedureVersion
  );
}

/**
 * Fail-closed uniqueness: duplicate keys within OrganizationId+SiteId are rejected.
 * Same planVersion may bind multiple distinct procedures.
 */
export function hasUniqueSupportPlanVersionProcedureBindings(
  bindings: readonly SupportPlanVersionProcedureBinding[],
): boolean {
  for (let index = 0; index < bindings.length; index += 1) {
    const current = supportPlanVersionProcedureBindingUniquenessKey(bindings[index]);
    for (let prior = 0; prior < index; prior += 1) {
      if (
        uniquenessKeyEquals(
          current,
          supportPlanVersionProcedureBindingUniquenessKey(bindings[prior]),
        )
      ) {
        return false;
      }
    }
  }
  return true;
}

/**
 * Repository-facing alignment check: binding scope must match the linked plan version.
 * Does not invent missing versions or convert lookup failures into success.
 */
export function bindingMatchesSupportPlanVersion(
  binding: SupportPlanVersionProcedureBinding,
  planVersion: Pick<
    SupportPlanVersion,
    "OrganizationId" | "SiteId" | "UserId" | "planId" | "version"
  >,
): boolean {
  return (
    binding.OrganizationId === planVersion.OrganizationId &&
    binding.SiteId === planVersion.SiteId &&
    binding.UserId === planVersion.UserId &&
    binding.planId === planVersion.planId &&
    binding.planVersion === planVersion.version
  );
}
