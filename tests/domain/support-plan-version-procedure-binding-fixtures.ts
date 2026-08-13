import type {
  SupportPlanVersion,
  SupportPlanVersionProcedureBinding,
  SupportPlanVersionProcedureBindingDto,
} from "../../src/domain";
import { toSupportPlanVersionProcedureBindingDto } from "../../src/domain/support-plan-version-procedure-binding";
import {
  SYNTHETIC_PLAN_ID,
  SYNTHETIC_PLAN_ORG_ID,
  SYNTHETIC_PLAN_SITE_ID,
  SYNTHETIC_PLAN_USER_ID,
  createSyntheticPlanVersion1,
} from "./support-plan-fixtures";

export const SYNTHETIC_BINDING_PROCEDURE_ID = "synthetic-procedure-001";
export const SYNTHETIC_BINDING_PROCEDURE_VERSION = "synthetic-procedure-version-001";

export function createSyntheticSupportPlanVersionProcedureBinding(
  overrides?: Partial<SupportPlanVersionProcedureBinding> & {
    Procedure?: Partial<SupportPlanVersionProcedureBinding["Procedure"]>;
  },
): SupportPlanVersionProcedureBinding {
  const { Procedure: procedureOverrides, ...rest } = overrides ?? {};
  return {
    OrganizationId: SYNTHETIC_PLAN_ORG_ID,
    SiteId: SYNTHETIC_PLAN_SITE_ID,
    UserId: SYNTHETIC_PLAN_USER_ID,
    planId: SYNTHETIC_PLAN_ID,
    planVersion: 1,
    Procedure: {
      ProcedureId: SYNTHETIC_BINDING_PROCEDURE_ID,
      ProcedureVersion: SYNTHETIC_BINDING_PROCEDURE_VERSION,
      ApprovalState: "APPROVED",
      ...procedureOverrides,
    },
    ...rest,
  };
}

export function createSyntheticSupportPlanVersionProcedureBindingDto(
  overrides?: Partial<SupportPlanVersionProcedureBinding> & {
    Procedure?: Partial<SupportPlanVersionProcedureBinding["Procedure"]>;
  },
): SupportPlanVersionProcedureBindingDto {
  return toSupportPlanVersionProcedureBindingDto(
    createSyntheticSupportPlanVersionProcedureBinding(overrides),
  );
}

export function createSyntheticLinkedPlanVersionForBinding(
  overrides?: Partial<SupportPlanVersion>,
): SupportPlanVersion {
  return createSyntheticPlanVersion1(overrides);
}
