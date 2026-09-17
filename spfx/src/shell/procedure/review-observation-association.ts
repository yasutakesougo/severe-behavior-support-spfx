import type { ShellProcedureReviewMaterial } from "./procedure-types";

export type ReviewObservationEvidenceInput = Readonly<{
  procedureRecordId: string;
  observationRecordId: string;
  observedAt: string;
  observedBy: string;
  planId: string;
  planVersion: number;
}>;

export type ReviewObservationEvidenceItem = Readonly<{
  observationRecordId: string;
  observedAt: string;
  observedBy: string;
}>;

export type ReviewObservationAssociation =
  | Readonly<{
      status: "ASSOCIATED";
      procedureRecordId: string;
      planId: string;
      planVersion: number;
      observations: readonly ReviewObservationEvidenceItem[];
    }>
  | Readonly<{
      status: "UNRESOLVED";
      reason: "HISTORICAL_LOOKUP_UNRESOLVED" | "NO_EXACT_CONTEXT_MATCH";
      procedureRecordId: string;
      planId: string;
      planVersion: number;
      observations: readonly [];
    }>;

/**
 * Projects caller-provided observation evidence onto one historical Review
 * material. It never derives a relationship from a newer Active version.
 */
export function associateReviewObservations(
  material: ShellProcedureReviewMaterial,
  evidence: readonly ReviewObservationEvidenceInput[],
): ReviewObservationAssociation {
  const base = {
    procedureRecordId: material.id,
    planId: material.planId,
    planVersion: material.planVersion,
  } as const;

  if (material.historicalLookupStatus !== "RESOLVED") {
    return {
      ...base,
      status: "UNRESOLVED",
      reason: "HISTORICAL_LOOKUP_UNRESOLVED",
      observations: [],
    };
  }

  const observations = evidence
    .filter(
      (item) =>
        item.procedureRecordId === material.id &&
        item.planId === material.planId &&
        item.planVersion === material.planVersion,
    )
    .map<ReviewObservationEvidenceItem>((item) => ({
      observationRecordId: item.observationRecordId,
      observedAt: item.observedAt,
      observedBy: item.observedBy,
    }))
    .sort((left, right) => {
      const timeOrder = Date.parse(left.observedAt) - Date.parse(right.observedAt);
      return timeOrder !== 0
        ? timeOrder
        : left.observationRecordId.localeCompare(right.observationRecordId);
    });

  if (observations.length > 0) {
    return { ...base, status: "ASSOCIATED", observations };
  }

  // AC-4: empty caller evidence on a RESOLVED historical material is
  // successful-empty ASSOCIATED [], not unresolved. Non-empty evidence that
  // filters to zero exact matches remains fail-closed unresolved.
  if (evidence.length === 0) {
    return { ...base, status: "ASSOCIATED", observations: [] };
  }

  return {
    ...base,
    status: "UNRESOLVED",
    reason: "NO_EXACT_CONTEXT_MATCH",
    observations: [],
  };
}
