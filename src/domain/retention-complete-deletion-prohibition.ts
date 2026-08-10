import { isRecord } from "./validation";

// ==========================================
// Retention complete-deletion prohibition (GOV-AUD-05 / DEC-012)
// Technical contract: docs/architecture/retention-complete-deletion-prohibition-contract.md
// GOV-AUD-05 / DEC-012: Accepted / LOCKED / Option A
// ==========================================

export type RetentionCompleteDeletionProhibitionPolicy = Readonly<{
  kind: "retention_complete_deletion_prohibited";
  retentionYears: 5;
  duringRetentionCompleteDeletion: "prohibited";
  afterRetentionDeletionPermissibility: "separate_decision";
  automaticCompleteDeletionAfterRetention: "not_adopted";
  automaticPhysicalDeletionExecution: "not_adopted";
}>;

export type ValidateRetentionCompleteDeletionProhibitionPolicyResult =
  | Readonly<{
      ok: true;
      retentionCompleteDeletionProhibitionPolicy: RetentionCompleteDeletionProhibitionPolicy;
    }>
  | Readonly<{
      ok: false;
      code: "MALFORMED_INPUT";
    }>;

const RETENTION_COMPLETE_DELETION_PROHIBITION_POLICY_KEYS = new Set([
  "kind",
  "retentionYears",
  "duringRetentionCompleteDeletion",
  "afterRetentionDeletionPermissibility",
  "automaticCompleteDeletionAfterRetention",
  "automaticPhysicalDeletionExecution",
]);

const ACCEPTED_RETENTION_COMPLETE_DELETION_PROHIBITION_POLICY: RetentionCompleteDeletionProhibitionPolicy =
  {
    kind: "retention_complete_deletion_prohibited",
    retentionYears: 5,
    duringRetentionCompleteDeletion: "prohibited",
    afterRetentionDeletionPermissibility: "separate_decision",
    automaticCompleteDeletionAfterRetention: "not_adopted",
    automaticPhysicalDeletionExecution: "not_adopted",
  };

/**
 * Validate GOV-AUD-05 / DEC-012 RetentionCompleteDeletionProhibitionPolicy.
 *
 * - during statutory retention (5 years): complete deletion prohibited
 * - after-retention deletion permissibility remains a separate Decision
 * - automatic complete / physical deletion execution not adopted
 * - Fail-closed on malformed or incomplete input
 *
 * Purge/cleanup jobs, schema mutation, and post-retention
 * deletion authorization are out of scope.
 */
export function validateRetentionCompleteDeletionProhibitionPolicy(
  input: unknown,
): ValidateRetentionCompleteDeletionProhibitionPolicyResult {
  if (!isRecord(input)) {
    return { ok: false, code: "MALFORMED_INPUT" };
  }

  const keys = Object.keys(input);
  if (!keys.every((key) => RETENTION_COMPLETE_DELETION_PROHIBITION_POLICY_KEYS.has(key))) {
    return { ok: false, code: "MALFORMED_INPUT" };
  }

  const accepted = ACCEPTED_RETENTION_COMPLETE_DELETION_PROHIBITION_POLICY;
  if (
    input.kind !== accepted.kind ||
    input.retentionYears !== accepted.retentionYears ||
    input.duringRetentionCompleteDeletion !== accepted.duringRetentionCompleteDeletion ||
    input.afterRetentionDeletionPermissibility !== accepted.afterRetentionDeletionPermissibility ||
    input.automaticCompleteDeletionAfterRetention !==
      accepted.automaticCompleteDeletionAfterRetention ||
    input.automaticPhysicalDeletionExecution !== accepted.automaticPhysicalDeletionExecution
  ) {
    return { ok: false, code: "MALFORMED_INPUT" };
  }

  return {
    ok: true,
    retentionCompleteDeletionProhibitionPolicy: {
      kind: accepted.kind,
      retentionYears: accepted.retentionYears,
      duringRetentionCompleteDeletion: accepted.duringRetentionCompleteDeletion,
      afterRetentionDeletionPermissibility: accepted.afterRetentionDeletionPermissibility,
      automaticCompleteDeletionAfterRetention: accepted.automaticCompleteDeletionAfterRetention,
      automaticPhysicalDeletionExecution: accepted.automaticPhysicalDeletionExecution,
    },
  };
}
