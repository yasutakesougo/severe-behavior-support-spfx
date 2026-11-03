import { validateSupportPlanVersionDto, type SupportPlanVersion } from "../../domain/support-plan";
import {
  createPlanKey,
  createVersionRowIdentity,
  isCanonicalSupportPlanRowKey,
} from "../../domain/support-plan-row-key";
import { sha256Hex } from "../../domain/sha256";
import type { SupportPlanScope } from "../../domain/support-plan-repository";

export const SUPPORT_PLAN_GRAPH_PAGE_SIZE = 200;
export const SUPPORT_PLAN_QUERY_MAX_CANDIDATES = 4_999;
export const SUPPORT_PLAN_QUERY_MAX_PAGES = 25;

export type GraphListPageRequest = Readonly<{
  listItemsPath: string;
  indexedFilter?: Readonly<{ field: "PlanKey"; value: string }>;
  continuation?: string;
  pageSize: number;
}>;

export type GraphListPageResult =
  | Readonly<{
      status: "SUCCESS";
      items: readonly unknown[];
      nextLink?: unknown;
      complete?: boolean;
    }>
  | Readonly<{ status: "ERROR"; reasonCode: string }>;

export interface GraphListPagePort {
  readPage(request: GraphListPageRequest): Promise<GraphListPageResult>;
}

export type SupportPlanVersionQuery = Readonly<{
  graphOrigin: string;
  /** Explicit list collection path for synthetic transport binding; not a tenant assertion. */
  listItemsPath: string;
  scope: SupportPlanScope;
  planId: string;
}>;

export type SupportPlanVersionQueryResult =
  | Readonly<{ status: "SUCCESS"; values: readonly SupportPlanVersion[]; complete: true }>
  | Readonly<{ status: "ERROR"; reasonCode: string }>;

type CandidateFields = Readonly<{
  RowKind: unknown;
  RowKey: unknown;
  CanonicalKey: unknown;
  PlanKey: unknown;
  VersionNumber?: unknown;
  PayloadJson?: unknown;
}>;

/**
 * Graph-shaped local adapter only. It uses a single candidate indexed key,
 * consumes every opaque continuation, and never returns partial success.
 * The page port is deliberately not an HTTP/tenant implementation.
 */
export async function querySupportPlanVersions(
  port: GraphListPagePort,
  input: SupportPlanVersionQuery,
): Promise<SupportPlanVersionQueryResult> {
  const origin = parseGraphOrigin(input.graphOrigin);
  const listItemsPath = origin ? parseGraphListItemsPath(input.listItemsPath, origin) : undefined;
  if (!origin || !listItemsPath || !isScope(input.scope) || !isNonEmptyString(input.planId)) {
    return { status: "ERROR", reasonCode: "QUERY_INPUT_INVALID" };
  }

  let planKey: string;
  try {
    planKey = createPlanKey({ ...input.scope, planId: input.planId });
  } catch {
    return { status: "ERROR", reasonCode: "QUERY_INPUT_INVALID" };
  }

  const values: SupportPlanVersion[] = [];
  const rowKeys = new Set<string>();
  const canonicalKeys = new Set<string>();
  const continuations = new Set<string>();
  let continuation: string | undefined;
  let candidateCount = 0;

  for (let pageNumber = 0; pageNumber < SUPPORT_PLAN_QUERY_MAX_PAGES; pageNumber += 1) {
    let page: GraphListPageResult;
    try {
      page = await port.readPage(
        continuation
          ? { listItemsPath, continuation, pageSize: SUPPORT_PLAN_GRAPH_PAGE_SIZE }
          : {
              listItemsPath,
              indexedFilter: { field: "PlanKey", value: planKey },
              pageSize: SUPPORT_PLAN_GRAPH_PAGE_SIZE,
            },
      );
    } catch {
      return { status: "ERROR", reasonCode: "GRAPH_PAGE_READ_FAILED" };
    }
    if (!page || page.status !== "SUCCESS") {
      return {
        status: "ERROR",
        reasonCode:
          page && page.status === "ERROR" && isReasonCode(page.reasonCode)
            ? page.reasonCode
            : "GRAPH_PAGE_READ_FAILED",
      };
    }
    if (!Array.isArray(page.items) || page.complete === false) {
      return { status: "ERROR", reasonCode: "GRAPH_PAGE_INCOMPLETE" };
    }
    candidateCount += page.items.length;
    if (candidateCount >= 5_000) {
      return { status: "ERROR", reasonCode: "LIST_VIEW_THRESHOLD_UNCERTAIN" };
    }

    for (const item of page.items) {
      const fields = readFields(item);
      if (!fields || fields.PlanKey !== planKey) {
        return { status: "ERROR", reasonCode: "GRAPH_ROW_PLANKEY_MISMATCH" };
      }
      if (
        typeof fields.RowKind !== "string" ||
        (fields.RowKind !== "H" && fields.RowKind !== "V") ||
        typeof fields.RowKey !== "string" ||
        typeof fields.CanonicalKey !== "string" ||
        !isCanonicalSupportPlanRowKey(fields.RowKind, fields.CanonicalKey)
      ) {
        return { status: "ERROR", reasonCode: "GRAPH_ROW_IDENTITY_INVALID" };
      }
      if (rowKeys.has(fields.RowKey) || canonicalKeys.has(fields.CanonicalKey)) {
        return { status: "ERROR", reasonCode: "GRAPH_ROW_DUPLICATE" };
      }
      rowKeys.add(fields.RowKey);
      canonicalKeys.add(fields.CanonicalKey);

      const tuple = parseCanonicalTuple(fields.CanonicalKey);
      if (!tuple || tuple[2] !== input.scope.organizationId || tuple[3] !== input.scope.siteId) {
        return { status: "ERROR", reasonCode: "GRAPH_ROW_SCOPE_MISMATCH" };
      }
      if (
        fields.RowKey !== `rk1:${fields.RowKind.toLowerCase()}:${sha256Hex(fields.CanonicalKey)}`
      ) {
        return { status: "ERROR", reasonCode: "GRAPH_ROW_KEY_MISMATCH" };
      }

      if (fields.RowKind === "H") {
        if (tuple.length !== 6 || tuple[4] !== input.scope.userId || tuple[5] !== input.planId) {
          return { status: "ERROR", reasonCode: "GRAPH_HEADER_IDENTITY_MISMATCH" };
        }
        continue;
      }

      const versionNumber =
        typeof fields.VersionNumber === "string" ? Number(fields.VersionNumber) : Number.NaN;
      if (
        tuple.length !== 7 ||
        tuple[4] !== input.scope.userId ||
        tuple[5] !== input.planId ||
        typeof fields.VersionNumber !== "string" ||
        !/^[1-9][0-9]*$/.test(fields.VersionNumber) ||
        !Number.isSafeInteger(versionNumber) ||
        fields.VersionNumber !== tuple[6]
      ) {
        return { status: "ERROR", reasonCode: "GRAPH_VERSION_IDENTITY_MISMATCH" };
      }
      const expectedIdentity = createVersionRowIdentity({
        ...input.scope,
        planId: input.planId,
        version: versionNumber,
      });
      if (
        expectedIdentity.rowKey !== fields.RowKey ||
        expectedIdentity.canonicalKey !== fields.CanonicalKey
      ) {
        return { status: "ERROR", reasonCode: "GRAPH_VERSION_IDENTITY_MISMATCH" };
      }

      let dto: unknown;
      try {
        if (typeof fields.PayloadJson !== "string") throw new TypeError("PayloadJson must be text");
        dto = JSON.parse(fields.PayloadJson);
      } catch {
        return { status: "ERROR", reasonCode: "GRAPH_VERSION_PAYLOAD_INVALID" };
      }
      if (!validateSupportPlanVersionDto(dto)) {
        return { status: "ERROR", reasonCode: "GRAPH_VERSION_PAYLOAD_INVALID" };
      }
      const value = dto.data;
      if (
        value.OrganizationId !== input.scope.organizationId ||
        value.SiteId !== input.scope.siteId ||
        value.UserId !== input.scope.userId ||
        value.planId !== input.planId ||
        value.version !== versionNumber
      ) {
        return { status: "ERROR", reasonCode: "GRAPH_VERSION_PAYLOAD_SCOPE_MISMATCH" };
      }
      values.push(value);
    }

    if (page.nextLink === undefined) {
      return {
        status: "SUCCESS",
        values: values.sort((left, right) => left.version - right.version),
        complete: true,
      };
    }
    if (
      typeof page.nextLink !== "string" ||
      !isAllowedContinuation(page.nextLink, origin, listItemsPath) ||
      continuations.has(page.nextLink)
    ) {
      return { status: "ERROR", reasonCode: "GRAPH_CONTINUATION_INVALID" };
    }
    continuations.add(page.nextLink);
    continuation = page.nextLink;
  }
  return { status: "ERROR", reasonCode: "GRAPH_PAGE_LIMIT_EXCEEDED" };
}

function readFields(value: unknown): CandidateFields | undefined {
  if (!value || typeof value !== "object" || Array.isArray(value)) return undefined;
  const fields = (value as Record<string, unknown>).fields;
  if (!fields || typeof fields !== "object" || Array.isArray(fields)) return undefined;
  return fields as CandidateFields;
}

function parseCanonicalTuple(value: string): string[] | undefined {
  try {
    const tuple: unknown = JSON.parse(value);
    return Array.isArray(tuple) && tuple.every((part) => typeof part === "string")
      ? tuple
      : undefined;
  } catch {
    return undefined;
  }
}

function parseGraphOrigin(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || url.username || url.password || url.pathname !== "/") {
      return undefined;
    }
    return url.origin;
  } catch {
    return undefined;
  }
}

function parseGraphListItemsPath(value: unknown, origin: string): string | undefined {
  if (typeof value !== "string") return undefined;
  try {
    const url = new URL(value, origin);
    if (
      url.origin !== origin ||
      url.protocol !== "https:" ||
      url.username ||
      url.password ||
      url.search ||
      url.hash ||
      !/^\/v1\.0\/sites\/[^/]+\/lists\/[^/]+\/items$/.test(url.pathname)
    ) {
      return undefined;
    }
    return url.pathname;
  } catch {
    return undefined;
  }
}

function isAllowedContinuation(value: string, origin: string, listItemsPath: string): boolean {
  try {
    const url = new URL(value);
    return (
      url.origin === origin &&
      url.protocol === "https:" &&
      url.pathname === listItemsPath &&
      !url.username &&
      !url.password &&
      !url.hash
    );
  } catch {
    return false;
  }
}

function isScope(value: unknown): value is SupportPlanScope {
  if (!value || typeof value !== "object") return false;
  const scope = value as Record<string, unknown>;
  return [scope.organizationId, scope.siteId, scope.userId].every(isNonEmptyString);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isReasonCode(value: unknown): value is string {
  return typeof value === "string" && /^[A-Z0-9_]{1,100}$/.test(value);
}
