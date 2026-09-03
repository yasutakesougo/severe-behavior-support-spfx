/**
 * SBS-MGMT-PLAN-ACTIVATION-C (#583) — synthetic/session Apply orchestration.
 * Uses existing CAS save semantics. No SharePoint / LIVE WRITE.
 * SPFx must not import src/domain directly — activation goes through sbs-domain bundle.
 */
import {
  SUPPORT_PLAN_ACTIVATION_LIVE_WRITE_AUTHORIZED,
  applySupportPlanActivation,
  mintDraftSnapshotId,
  type ActivationReceipt,
  type ApplySupportPlanActivationResult,
  type SupportPlanRevisionDraftCandidate,
} from "../../sbs-domain/support-plan-activation.bundle";
import {
  SBS_MGMT_LOOP_B_CURRENT_PLAN,
  type CanonicalSupportPlan,
} from "./support-plan-revision-fixture";

export type SupportPlanActivationSession = Readonly<{
  currentPlan: CanonicalSupportPlan;
  receipt: ActivationReceipt | null;
}>;

export const EMPTY_SUPPORT_PLAN_ACTIVATION_SESSION: SupportPlanActivationSession = {
  currentPlan: SBS_MGMT_LOOP_B_CURRENT_PLAN,
  receipt: null,
};

export const SUPPORT_PLAN_ACTIVATION_SESSION_LIVE_WRITE_AUTHORIZED =
  SUPPORT_PLAN_ACTIVATION_LIVE_WRITE_AUTHORIZED;

type SessionSaveResult =
  | Readonly<{ status: "SUCCESS"; value: CanonicalSupportPlan }>
  | Readonly<{ status: "CONFLICT"; reasonCode: string }>
  | Readonly<{ status: "ERROR"; reasonCode: string }>;

export type SessionApplyResult =
  | Readonly<{
      status: "SUCCESS";
      session: SupportPlanActivationSession;
      receipt: ActivationReceipt;
    }>
  | Readonly<{
      status: "ALREADY_APPLIED";
      session: SupportPlanActivationSession;
      receipt: ActivationReceipt;
    }>
  | Readonly<{ status: "HOLD" | "INVALID" | "CONFLICT"; reason: string }>;

/**
 * Minimal in-memory CAS repository for synthetic/session Apply.
 * Local session helper only — not a new domain port.
 */
export function createSyntheticSupportPlanCasRepository(
  initial: CanonicalSupportPlan,
): {
  getPlan: () => CanonicalSupportPlan;
  save: (
    plan: CanonicalSupportPlan,
    expectedVersion: number,
  ) => Promise<SessionSaveResult>;
} {
  let plan = initial;
  return {
    getPlan: () => plan,
    save: async (next, expectedVersion) => {
      if (plan.version !== expectedVersion) {
        return { status: "CONFLICT", reasonCode: "VERSION_CONFLICT" };
      }
      plan = { ...next, version: expectedVersion + 1 };
      return { status: "SUCCESS", value: plan };
    },
  };
}

export async function applySyntheticPlanningPcActivation(
  input: Readonly<{
    draft: SupportPlanRevisionDraftCandidate;
    session: SupportPlanActivationSession;
    actor: string;
    actionAt: string;
    /** Optional injectable CAS save for tests / HOLD paths. */
    savePlan?: (
      plan: CanonicalSupportPlan,
      expectedVersion: number,
    ) => Promise<SessionSaveResult>;
  }>,
): Promise<SessionApplyResult> {
  const { draft, session, actor, actionAt } = input;
  if (SUPPORT_PLAN_ACTIVATION_LIVE_WRITE_AUTHORIZED !== false) {
    return { status: "HOLD", reason: "LIVE_WRITE_NOT_AUTHORIZED" };
  }

  const confirmedDraftSnapshotId = mintDraftSnapshotId(draft);
  const prepared: ApplySupportPlanActivationResult = applySupportPlanActivation({
    currentPlan: session.currentPlan,
    draft,
    confirmedDraftSnapshotId,
    expectedCurrentVersion: session.currentPlan.currentVersion,
    expectedRowVersion: session.currentPlan.version,
    actor,
    actionAt,
    existingReceipt: session.receipt ?? undefined,
  });

  if (prepared.status === "ALREADY_APPLIED") {
    return {
      status: "ALREADY_APPLIED",
      session: {
        currentPlan: session.currentPlan,
        receipt: prepared.receipt,
      },
      receipt: prepared.receipt,
    };
  }

  if (prepared.status === "HOLD" || prepared.status === "INVALID") {
    return { status: prepared.status, reason: prepared.reason };
  }

  const nextCanonical: CanonicalSupportPlan = {
    ...session.currentPlan,
    currentVersion: prepared.nextPlan.currentVersion,
  };

  const repo = createSyntheticSupportPlanCasRepository(session.currentPlan);
  const save = input.savePlan ?? repo.save;
  const saved = await save(nextCanonical, session.currentPlan.version);
  if (saved.status === "CONFLICT") {
    return { status: "CONFLICT", reason: saved.reasonCode };
  }
  if (saved.status === "ERROR") {
    return { status: "HOLD", reason: saved.reasonCode };
  }

  return {
    status: "SUCCESS",
    session: {
      currentPlan: saved.value,
      receipt: prepared.receipt,
    },
    receipt: prepared.receipt,
  };
}
