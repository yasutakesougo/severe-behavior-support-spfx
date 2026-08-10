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
 * History is ordered chronologically (oldest first) by the represented instant.
 * When observedAt represents the same instant, RecordId is used only as a
 * deterministic technical tie-breaker.
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
      const observedAtOrder = Date.parse(left.observedAt) - Date.parse(right.observedAt);
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
