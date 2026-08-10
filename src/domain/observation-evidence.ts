import type { Observation } from "./abc-observation";

export type ObservationEvidenceItem = Readonly<
  Pick<Observation, "RecordId" | "observedAt" | "observedBy">
>;

export type ObservationEvidenceSummary = Readonly<{
  history: readonly ObservationEvidenceItem[];
  latestObservedAt?: string;
}>;

/**
 * Produces reviewable observation evidence without deriving weekly compliance,
 * required counts, violations, overdue state, or any billing conclusion.
 *
 * History is ordered chronologically (oldest first). When observedAt is equal,
 * RecordId is used only as a deterministic technical tie-breaker.
 */
export function summarizeObservationEvidence(
  observations: readonly Observation[],
): ObservationEvidenceSummary {
  const history = observations
    .map<ObservationEvidenceItem>((observation) => ({
      RecordId: observation.RecordId,
      observedAt: observation.observedAt,
      observedBy: observation.observedBy,
    }))
    .sort((left, right) => {
      const observedAtOrder = left.observedAt.localeCompare(right.observedAt);
      if (observedAtOrder !== 0) {
        return observedAtOrder;
      }
      return left.RecordId.localeCompare(right.RecordId);
    });

  return {
    history,
    latestObservedAt: history.at(-1)?.observedAt,
  };
}
