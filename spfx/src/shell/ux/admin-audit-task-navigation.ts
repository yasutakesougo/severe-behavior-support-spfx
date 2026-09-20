/**
 * ADMIN-AUDIT-TASK-FIRST-V1 — ADMIN_AUDIT Task-First Global + literal D-HOME identity.
 * Exact Scope §5.1 / §6 only. Product Destination identity is always a D-* id.
 * SHELL-UX-7 adapter ids are never normative Destination identity.
 *
 * ADMIN_AUDIT is a presentation Role, not an authorization Role.
 * D-OPS does not grant approval authority.
 * D-EVIDENCE does not imply evidence acceptance.
 * Task-First UI does not grant publish / deploy / delete / LIVE WRITE authority.
 */
import type { ShellPrimaryNavigationId } from "./primary-navigation";

export const ADMIN_AUDIT_TASK_DESTINATION_IDS = ["D-OPS", "D-EVIDENCE", "D-FIND-PERSON"] as const;

export type AdminAuditTaskDestinationId = (typeof ADMIN_AUDIT_TASK_DESTINATION_IDS)[number];

export type AdminAuditTaskGlobalId = "GLOBAL-OPS" | "GLOBAL-EVIDENCE" | "GLOBAL-FIND-PERSON";

export type AdminAuditTaskGlobalItem = Readonly<{
  globalId: AdminAuditTaskGlobalId;
  label: string;
  sufficientDestination: AdminAuditTaskDestinationId;
  contextHint: string;
}>;

/**
 * Locked ADMIN_AUDIT Global items. Order is normative.
 * D-FIND-RECORD is not a Global meaning of 探す and is OUT of this Destination enum.
 */
export const ADMIN_AUDIT_TASK_GLOBAL_ITEMS: readonly AdminAuditTaskGlobalItem[] = [
  {
    globalId: "GLOBAL-OPS",
    label: "運用確認",
    sufficientDestination: "D-OPS",
    contextHint: "未記録・要確認・運用の穴を確認します。対象へ辿れます。",
  },
  {
    globalId: "GLOBAL-EVIDENCE",
    label: "証跡",
    sufficientDestination: "D-EVIDENCE",
    contextHint: "いつ・何が残ったかを辿ります。特定記録は対象を選ぶまで開きません。",
  },
  {
    globalId: "GLOBAL-FIND-PERSON",
    label: "探す",
    sufficientDestination: "D-FIND-PERSON",
    contextHint: "利用者を探します。記録探しは Global ではありません。",
  },
] as const;

/**
 * CORR-2B literal identity: ADMIN_AUDIT D-HOME == D-OPS.
 * There is no separate D-HOME Destination member and no home-to-ops resolver.
 */
export const ADMIN_AUDIT_HOME_DESTINATION: AdminAuditTaskDestinationId = "D-OPS";

export const ADMIN_AUDIT_DEFAULT_TASK_DESTINATION = ADMIN_AUDIT_HOME_DESTINATION;

/** Restore token that names the same Product place as D-OPS. Not a Destination id. */
export const ADMIN_AUDIT_HOME_IDENTITY_TOKEN = "D-HOME" as const;

export const ADMIN_AUDIT_UNSUPPORTED_RESTORE_TOKENS = [
  "D-AUDIT",
  "D-PERSON",
  "D-FIND-RECORD",
  "D-RECORD-READ",
] as const;

export const adminAuditApprovalAuthorized = false as const;
export const adminAuditEvidenceAcceptanceAuthorized = false as const;
export const adminAuditPublishAuthorized = false as const;
export const adminAuditDeployAuthorized = false as const;
export const adminAuditDeleteAuthorized = false as const;
export const adminAuditLiveWriteAuthorized = false as const;

export const adminAuditTaskGlobalItem = (
  globalId: AdminAuditTaskGlobalId,
): AdminAuditTaskGlobalItem => {
  const item = ADMIN_AUDIT_TASK_GLOBAL_ITEMS.find((candidate) => candidate.globalId === globalId);
  if (!item) {
    throw new Error(`Unknown ADMIN_AUDIT task global: ${globalId}`);
  }
  return item;
};

export const resolveAdminAuditGlobalDestination = (
  globalId: AdminAuditTaskGlobalId,
): AdminAuditTaskDestinationId => {
  switch (globalId) {
    case "GLOBAL-OPS":
      return "D-OPS";
    case "GLOBAL-EVIDENCE":
      return "D-EVIDENCE";
    case "GLOBAL-FIND-PERSON":
      return "D-FIND-PERSON";
    default: {
      const exhaustive: never = globalId;
      throw new Error(`Unhandled ADMIN_AUDIT global: ${exhaustive}`);
    }
  }
};

export const locationHeadingForAdminAuditDestination = (
  destination: AdminAuditTaskDestinationId,
): string => {
  switch (destination) {
    case "D-OPS":
      return "運用確認";
    case "D-EVIDENCE":
      return "証跡";
    case "D-FIND-PERSON":
      return "利用者を探す";
    default: {
      const exhaustive: never = destination;
      throw new Error(`Unhandled ADMIN_AUDIT destination: ${exhaustive}`);
    }
  }
};

export const contextHintForAdminAuditDestination = (
  destination: AdminAuditTaskDestinationId,
): string => {
  const item = ADMIN_AUDIT_TASK_GLOBAL_ITEMS.find(
    (candidate) => candidate.sufficientDestination === destination,
  );
  return (
    item?.contextHint ?? `${locationHeadingForAdminAuditDestination(destination)} の仕事です。`
  );
};

/**
 * Adapter transport only. Never normative D-* identity.
 */
export const shellAdapterForAdminAuditDestination = (
  destination: AdminAuditTaskDestinationId,
): ShellPrimaryNavigationId => {
  switch (destination) {
    case "D-OPS":
      return "overview";
    case "D-EVIDENCE":
      return "records";
    case "D-FIND-PERSON":
      return "users";
    default: {
      const exhaustive: never = destination;
      throw new Error(`Unhandled ADMIN_AUDIT adapter destination: ${exhaustive}`);
    }
  }
};

export const adminAuditGlobalIdForDestination = (
  destination: AdminAuditTaskDestinationId,
): AdminAuditTaskGlobalId => {
  switch (destination) {
    case "D-OPS":
      return "GLOBAL-OPS";
    case "D-EVIDENCE":
      return "GLOBAL-EVIDENCE";
    case "D-FIND-PERSON":
      return "GLOBAL-FIND-PERSON";
    default: {
      const exhaustive: never = destination;
      throw new Error(`Unhandled ADMIN_AUDIT destination global: ${exhaustive}`);
    }
  }
};

export type AdminAuditRestoreStatus = "none" | "restored" | "fail-closed";

export type AdminAuditRestoreFailureReason = "unsupported-destination" | "malformed-object";

export type AdminAuditTaskViewState = Readonly<{
  activeGlobalId: AdminAuditTaskGlobalId;
  destination: AdminAuditTaskDestinationId;
  restoreStatus: AdminAuditRestoreStatus;
  requestedRestoreToken?: string;
  restoreFailureReason?: AdminAuditRestoreFailureReason;
}>;

export type AdminAuditSessionEvent =
  | Readonly<{ type: "GLOBAL"; globalId: AdminAuditTaskGlobalId }>
  | Readonly<{
      type: "RESTORE";
      destinationToken: string;
      object?: unknown;
    }>;

export type AdminAuditRestoreOutcome =
  | Readonly<{
      status: "restored";
      destination: AdminAuditTaskDestinationId;
      activeGlobalId: AdminAuditTaskGlobalId;
      requestedRestoreToken: string;
    }>
  | Readonly<{
      status: "fail-closed";
      requestedRestoreToken: string;
      reason: AdminAuditRestoreFailureReason;
    }>;

/**
 * Restore token → Product place identity.
 * D-HOME names the same Product place as D-OPS (ADMIN_AUDIT_HOME_DESTINATION).
 * This is literal identity, not a D-HOME resolver and not a second Home place.
 */
export const adminAuditPlaceForRestoreToken = (
  destinationToken: string,
): AdminAuditTaskDestinationId | undefined => {
  if (
    destinationToken === ADMIN_AUDIT_HOME_IDENTITY_TOKEN ||
    destinationToken === ADMIN_AUDIT_HOME_DESTINATION
  ) {
    return ADMIN_AUDIT_HOME_DESTINATION;
  }
  if (destinationToken === "D-EVIDENCE" || destinationToken === "D-FIND-PERSON") {
    return destinationToken;
  }
  return undefined;
};

export const restoreAdminAuditDestination = (
  destinationToken: string,
  object?: unknown,
): AdminAuditRestoreOutcome => {
  if (object !== undefined) {
    return {
      status: "fail-closed",
      requestedRestoreToken: destinationToken,
      reason: "malformed-object",
    };
  }
  const destination = adminAuditPlaceForRestoreToken(destinationToken);
  if (!destination) {
    return {
      status: "fail-closed",
      requestedRestoreToken: destinationToken,
      reason: "unsupported-destination",
    };
  }
  return {
    status: "restored",
    destination,
    activeGlobalId: adminAuditGlobalIdForDestination(destination),
    requestedRestoreToken: destinationToken,
  };
};

export const initialAdminAuditTaskViewState = (): AdminAuditTaskViewState => ({
  activeGlobalId: "GLOBAL-OPS",
  destination: ADMIN_AUDIT_DEFAULT_TASK_DESTINATION,
  restoreStatus: "none",
});

export const ADMIN_AUDIT_RESTORE_FAIL_CLOSED_COPY =
  "指定された場所は復元できません。推測して運用確認へ進めていません。";

export const applyAdminAuditSessionEvent = (
  state: AdminAuditTaskViewState,
  event: AdminAuditSessionEvent,
): AdminAuditTaskViewState => {
  switch (event.type) {
    case "GLOBAL": {
      const destination = resolveAdminAuditGlobalDestination(event.globalId);
      return {
        activeGlobalId: event.globalId,
        destination,
        restoreStatus: "none",
      };
    }
    case "RESTORE": {
      const outcome = restoreAdminAuditDestination(event.destinationToken, event.object);
      if (outcome.status === "fail-closed") {
        return {
          ...state,
          restoreStatus: "fail-closed",
          requestedRestoreToken: outcome.requestedRestoreToken,
          restoreFailureReason: outcome.reason,
        };
      }
      return {
        activeGlobalId: outcome.activeGlobalId,
        destination: outcome.destination,
        restoreStatus: "restored",
        requestedRestoreToken: outcome.requestedRestoreToken,
      };
    }
    default: {
      const exhaustive: never = event;
      throw new Error(`Unhandled ADMIN_AUDIT session event: ${JSON.stringify(exhaustive)}`);
    }
  }
};
