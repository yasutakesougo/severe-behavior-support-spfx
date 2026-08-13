/**
 * FIELD-WORKFLOW UI (#356) — FW-05 historical projection helpers (presentation mirror).
 * Never fall back to Active / newer planVersion.
 */

import type {
  HistoricalLookupStatus,
  ShellProcedureReviewMaterial,
} from "./procedure-types";

export type HistoricalProjectionView =
  | Readonly<{
      status: "RESOLVED";
      planId: string;
      planVersion: number;
      supportMethods: readonly string[];
      precautions: readonly string[];
    }>
  | Readonly<{
      status: "UNRESOLVED";
      reason: Exclude<HistoricalLookupStatus, "RESOLVED">;
      planId: string;
      planVersion: number;
    }>;

/**
 * Build review projection from a material fixture.
 * VERSION_MISMATCH / PLAN_MISMATCH / EMPTY / UNKNOWN / FETCH_FAILED → UNRESOLVED (fail-closed).
 */
export function resolveProcedureReviewProjection(
  material: ShellProcedureReviewMaterial,
): HistoricalProjectionView {
  if (material.historicalLookupStatus === "RESOLVED") {
    return {
      status: "RESOLVED",
      planId: material.planId,
      planVersion: material.planVersion,
      supportMethods: material.projectedSupportMethods ?? [],
      precautions: material.projectedPrecautions ?? [],
    };
  }

  return {
    status: "UNRESOLVED",
    reason: material.historicalLookupStatus,
    planId: material.planId,
    planVersion: material.planVersion,
  };
}

/** Guard: Active v3 content must never replace a v2-bound material's projection. */
export function projectionUsesRecordPlanVersion(
  material: ShellProcedureReviewMaterial,
  projectedPlanVersion: number,
): boolean {
  return projectedPlanVersion === material.planVersion;
}
