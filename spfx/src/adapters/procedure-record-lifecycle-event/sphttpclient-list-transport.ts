/**
 * Concrete ProcedureRecordLifecycleEvent List transport via SPFx SPHttpClient.
 *
 * GATE-3: test-only GUID-addressed GET/POST mapping onto the consumed Slice E
 * `ProcedureRecordLifecycleEventListTransport` seam.
 *
 * - LOOKUP: addresses the list by GUID, never by Display Name / getByTitle
 * - CREATE-ONLY: createItem exists; updateItem / deleteItem are absent
 * - Default / host construction: createItem stays FORBIDDEN (no tenant CREATE)
 * - Synthetic CREATE: requires an explicit run-scoped synthetic authorization
 * - Per frozen CANCEL identity: at most one POST attempt
 *
 * Live tenant CREATE is NOT authorized by constructing this binder alone.
 */

import type {
  ProcedureRecordLifecycleEventItemCreateResult,
  ProcedureRecordLifecycleEventItemReadResult,
  ProcedureRecordLifecycleEventListTransport,
  ProcedureRecordLifecycleEventObservedField,
  ProcedureRecordLifecycleEventObservedList,
  ProcedureRecordLifecycleEventSchemaReadResult,
  ProcedureRecordLifecycleEventTransportFailure,
} from "./transport-types";

export const PROCEDURE_RECORD_LIFECYCLE_EVENT_TEST_ONLY_LIST_GUID =
  "41274293-18d0-4f57-8a45-4f063522bcc7" as const;

/**
 * Physical Site ID (transport binding only). Never logical SiteId.
 */
export const PROCEDURE_RECORD_LIFECYCLE_EVENT_TEST_ONLY_SITE_IDENTITY =
  "isogokatudouhome.sharepoint.com,47e55669-18ac-4143-bc91-f68fd528c6f1,bdd60214-1295-4c83-bae6-3d1a77583b5b" as const;

export const PROCEDURE_RECORD_LIFECYCLE_EVENT_TEST_ONLY_LIST_ITEM_ENTITY_TYPE =
  "SP.Data.SBS_x005f_PROCEDURE_x005f_RECORD_x005f_LIFECYCLE_x005f_EVENTSListItem" as const;

/**
 * Run-scoped synthetic CREATE authorization for GATE-3 transport tests.
 * Does not authorize authenticated tenant CREATE / Production Binding / Deploy.
 */
const SYNTHETIC_CREATE_AUTHORIZATION_BRAND: unique symbol = Symbol(
  "spfx-procedure-record-lifecycle-event-synthetic-create-authorization",
);

export type SpfxProcedureRecordLifecycleEventSyntheticCreateAuthorization = Readonly<{
  readonly [SYNTHETIC_CREATE_AUTHORIZATION_BRAND]: true;
}>;

export function mintProcedureRecordLifecycleEventSyntheticCreateAuthorization(): SpfxProcedureRecordLifecycleEventSyntheticCreateAuthorization {
  return { [SYNTHETIC_CREATE_AUTHORIZATION_BRAND]: true };
}

export function isSpfxProcedureRecordLifecycleEventSyntheticCreateAuthorization(
  value: unknown,
): value is SpfxProcedureRecordLifecycleEventSyntheticCreateAuthorization {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  return (
    (value as { [SYNTHETIC_CREATE_AUTHORIZATION_BRAND]?: true })[
      SYNTHETIC_CREATE_AUTHORIZATION_BRAND
    ] === true
  );
}

export type ProcedureRecordLifecycleEventSpHttpRequestOptions = {
  headers?: Record<string, string>;
  body?: string;
};

export type ProcedureRecordLifecycleEventSpHttpResponse = {
  ok: boolean;
  status: number;
  json(): Promise<unknown>;
};

export type ProcedureRecordLifecycleEventSpHttpClient = {
  get(
    url: string,
    configuration: unknown,
    options?: ProcedureRecordLifecycleEventSpHttpRequestOptions,
  ): Promise<ProcedureRecordLifecycleEventSpHttpResponse>;
  post(
    url: string,
    configuration: unknown,
    options: ProcedureRecordLifecycleEventSpHttpRequestOptions,
  ): Promise<ProcedureRecordLifecycleEventSpHttpResponse>;
};

export type CreateProcedureRecordLifecycleEventSpHttpClientTransportOptions = Readonly<{
  spHttpClient: ProcedureRecordLifecycleEventSpHttpClient;
  configuration: unknown;
  webAbsoluteUrl: string;
  /**
   * Physical Site ID string (transport binding only). Not logical SiteId.
   */
  siteIdentity: string;
  listGuid: string;
  listItemEntityTypeFullName?: string;
}>;

const FIELD_SELECT = [
  "InternalName",
  "StaticName",
  "TypeAsString",
  "Required",
  "EnforceUniqueValues",
  "Indexed",
  "Choices",
  "FillInChoice",
  "MaxLength",
  "Hidden",
] as const;

const ITEM_SELECT = [
  "Id",
  "lifeSchemaVersion",
  "lifeLifecycleEventId",
  "lifeLifecycleIdempotencyKey",
  "lifeLifecyclePayloadFingerprint",
  "lifeEventType",
  "lifeTargetRecordId",
  "lifeReplacementRecordId",
  "lifeRecordedAt",
  "lifeRecordedBy",
  "lifeReason",
] as const;

const GUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

export function normalizeProcedureRecordLifecycleEventListGuid(value: string): string | undefined {
  const normalized = value
    .trim()
    .replace(/^\{|\}$/g, "")
    .toLowerCase();
  return GUID_RE.test(normalized) ? normalized : undefined;
}

export function procedureRecordLifecycleEventListApiUrl(
  webAbsoluteUrl: string,
  listGuid: string,
): string | undefined {
  const guid = normalizeProcedureRecordLifecycleEventListGuid(listGuid);
  if (guid === undefined) {
    return undefined;
  }
  return `${trimTrailingSlash(webAbsoluteUrl)}/_api/web/lists(guid'${guid}')`;
}

/**
 * Default construction. createItem remains FORBIDDEN even when an SPHttpClient
 * is present. Does not mint synthetic CREATE authorization.
 */
export function createProcedureRecordLifecycleEventSpHttpClientTransport(
  options: CreateProcedureRecordLifecycleEventSpHttpClientTransportOptions,
): ProcedureRecordLifecycleEventListTransport {
  return createBoundProcedureRecordLifecycleEventSpHttpClientTransport(options, undefined);
}

/**
 * Synthetic CREATE-capable construction for test doubles only.
 * Requires an explicit run-scoped synthetic authorization brand.
 * Does not authorize authenticated tenant CREATE.
 */
export function createProcedureRecordLifecycleEventSyntheticCreateSpHttpClientTransport(
  options: CreateProcedureRecordLifecycleEventSpHttpClientTransportOptions,
  authorization: unknown,
): ProcedureRecordLifecycleEventListTransport {
  const token = isSpfxProcedureRecordLifecycleEventSyntheticCreateAuthorization(authorization)
    ? authorization
    : undefined;
  return createBoundProcedureRecordLifecycleEventSpHttpClientTransport(options, token);
}

function createBoundProcedureRecordLifecycleEventSpHttpClientTransport(
  options: CreateProcedureRecordLifecycleEventSpHttpClientTransportOptions,
  authorization: SpfxProcedureRecordLifecycleEventSyntheticCreateAuthorization | undefined,
): ProcedureRecordLifecycleEventListTransport {
  const client = options.spHttpClient;
  const configuration = options.configuration;
  // Fail closed: never substitute the locked TEST_ONLY GUID for a malformed input.
  const listGuid = normalizeProcedureRecordLifecycleEventListGuid(options.listGuid) ?? "";
  const siteIdentity = options.siteIdentity.trim();
  const listApiUrl =
    listGuid.length > 0
      ? procedureRecordLifecycleEventListApiUrl(options.webAbsoluteUrl, listGuid)
      : undefined;
  const postedIdentities = new Set<string>();

  async function getJson(
    url: string,
  ): Promise<
    | { ok: true; payload: unknown }
    | { ok: false; failure: ProcedureRecordLifecycleEventTransportFailure }
  > {
    try {
      const response = await client.get(url, configuration, {
        headers: {
          Accept: "application/json;odata=nometadata",
        },
      });
      if (!response.ok) {
        return { ok: false, failure: mapStatusFailure(response.status) };
      }
      return { ok: true, payload: await response.json() };
    } catch {
      return { ok: false, failure: "TRANSPORT_ERROR" };
    }
  }

  async function getSchema(): Promise<ProcedureRecordLifecycleEventSchemaReadResult> {
    if (listApiUrl === undefined) {
      return { ok: false, failure: "TRANSPORT_ERROR" };
    }
    const listUrl = `${listApiUrl}?$select=Id,Title,ItemCount`;
    const fieldsUrl = `${listApiUrl}/fields?$select=${FIELD_SELECT.join(",")}`;
    const [listResult, fieldsResult] = await Promise.all([getJson(listUrl), getJson(fieldsUrl)]);
    if (!listResult.ok) {
      return listResult;
    }
    if (!fieldsResult.ok) {
      return fieldsResult;
    }
    const list = readList(listResult.payload);
    const fields = readFields(fieldsResult.payload);
    if (!list || !fields) {
      return { ok: false, failure: "TRANSPORT_ERROR" };
    }
    return { ok: true, list, fields };
  }

  async function findByFilter(
    fieldName: "lifeLifecycleEventId" | "lifeLifecycleIdempotencyKey" | "lifeTargetRecordId",
    token: string,
  ): Promise<ProcedureRecordLifecycleEventItemReadResult> {
    if (listApiUrl === undefined || typeof token !== "string" || token.length === 0) {
      return { ok: false, failure: "TRANSPORT_ERROR" };
    }
    const filter = `${fieldName} eq '${escapeODataString(token)}'`;
    const url =
      `${listApiUrl}/items` +
      `?$filter=${encodeURIComponent(filter)}` +
      `&$select=${ITEM_SELECT.join(",")}` +
      `&$top=${fieldName === "lifeTargetRecordId" ? "100" : "2"}`;
    const result = await getJson(url);
    if (!result.ok) {
      return result;
    }
    const rows = readItems(result.payload);
    if (rows === undefined) {
      return { ok: false, failure: "TRANSPORT_ERROR" };
    }
    return { ok: true, rows };
  }

  async function createItem(
    fields: Readonly<Record<string, unknown>>,
  ): Promise<ProcedureRecordLifecycleEventItemCreateResult> {
    if (!isSpfxProcedureRecordLifecycleEventSyntheticCreateAuthorization(authorization)) {
      return { ok: false, failure: "FORBIDDEN" };
    }
    if (listApiUrl === undefined) {
      return { ok: false, failure: "TRANSPORT_ERROR" };
    }
    if (listGuid !== PROCEDURE_RECORD_LIFECYCLE_EVENT_TEST_ONLY_LIST_GUID) {
      return { ok: false, failure: "FORBIDDEN" };
    }
    if (siteIdentity !== PROCEDURE_RECORD_LIFECYCLE_EVENT_TEST_ONLY_SITE_IDENTITY) {
      return { ok: false, failure: "FORBIDDEN" };
    }
    if (!isCancelOnlyCreatePayload(fields)) {
      return { ok: false, failure: "FORBIDDEN" };
    }

    const identityKey = frozenIdentityKey(fields);
    if (identityKey === undefined) {
      return { ok: false, failure: "FORBIDDEN" };
    }
    if (postedIdentities.has(identityKey)) {
      return { ok: false, failure: "FORBIDDEN" };
    }

    const entityType = (options.listItemEntityTypeFullName ?? "").trim();
    if (entityType.length === 0) {
      return { ok: false, failure: "TRANSPORT_ERROR" };
    }

    // Budget is consumed on attempt: CREATED / INDETERMINATE / DEFINITE_FAILURE
    // must never allow a second POST for this frozen identity.
    postedIdentities.add(identityKey);

    try {
      const response = await client.post(`${listApiUrl}/items`, configuration, {
        headers: {
          Accept: "application/json;odata=verbose",
          "Content-Type": "application/json;odata=verbose",
          "odata-version": "3.0",
        },
        body: JSON.stringify(withVerboseMetadata(fields, entityType)),
      });
      if (!response.ok) {
        return { ok: false, failure: mapStatusFailure(response.status) };
      }
      const listItemId = readListItemId(await response.json());
      if (listItemId === undefined) {
        return { ok: false, failure: "TRANSPORT_ERROR" };
      }
      return { ok: true, listItemId };
    } catch {
      return { ok: false, failure: "TRANSPORT_ERROR" };
    }
  }

  return {
    targetSiteIdentity: siteIdentity,
    targetListGuid: listGuid,
    liveTenantIoAuthorized: false,
    getSchema,
    findByLifecycleEventId(
      lifecycleEventId: string,
    ): Promise<ProcedureRecordLifecycleEventItemReadResult> {
      return findByFilter("lifeLifecycleEventId", lifecycleEventId);
    },
    findByLifecycleIdempotencyKey(
      lifecycleIdempotencyKey: string,
    ): Promise<ProcedureRecordLifecycleEventItemReadResult> {
      return findByFilter("lifeLifecycleIdempotencyKey", lifecycleIdempotencyKey);
    },
    listByTargetRecordId(
      targetRecordId: string,
    ): Promise<ProcedureRecordLifecycleEventItemReadResult> {
      return findByFilter("lifeTargetRecordId", targetRecordId);
    },
    createItem,
  };
}

function frozenIdentityKey(fields: Readonly<Record<string, unknown>>): string | undefined {
  const eventId = fields.lifeLifecycleEventId;
  const idempotencyKey = fields.lifeLifecycleIdempotencyKey;
  if (typeof eventId !== "string" || eventId.length === 0) {
    return undefined;
  }
  if (typeof idempotencyKey !== "string" || idempotencyKey.length === 0) {
    return undefined;
  }
  return `${eventId}\u0000${idempotencyKey}`;
}

const CANCEL_CREATE_PHYSICAL_KEYS = [
  "lifeSchemaVersion",
  "lifeLifecycleEventId",
  "lifeLifecycleIdempotencyKey",
  "lifeLifecyclePayloadFingerprint",
  "lifeEventType",
  "lifeTargetRecordId",
  "lifeRecordedAt",
  "lifeRecordedBy",
  "lifeReason",
] as const;

type CancelCreatePhysicalKey = (typeof CANCEL_CREATE_PHYSICAL_KEYS)[number];

function isCancelCreatePhysicalKey(key: string): key is CancelCreatePhysicalKey {
  return (CANCEL_CREATE_PHYSICAL_KEYS as readonly string[]).indexOf(key) >= 0;
}

function isCancelOnlyCreatePayload(fields: Readonly<Record<string, unknown>>): boolean {
  const keys = Object.keys(fields);
  if (keys.length !== CANCEL_CREATE_PHYSICAL_KEYS.length) {
    return false;
  }
  for (const key of keys) {
    if (!isCancelCreatePhysicalKey(key)) {
      return false;
    }
  }
  if (fields.lifeEventType !== "CANCEL") {
    return false;
  }
  if (fields.lifeSchemaVersion !== "1.0.0") {
    return false;
  }
  for (const key of CANCEL_CREATE_PHYSICAL_KEYS) {
    if (typeof fields[key] !== "string" || (fields[key] as string).trim().length === 0) {
      return false;
    }
  }
  return true;
}

function withVerboseMetadata(
  fields: Readonly<Record<string, unknown>>,
  entityType: string,
): Record<string, unknown> {
  const body: Record<string, unknown> = {
    __metadata: { type: entityType },
  };
  for (const key of CANCEL_CREATE_PHYSICAL_KEYS) {
    body[key] = fields[key];
  }
  return body;
}

function readListItemId(payload: unknown): number | undefined {
  if (!payload || typeof payload !== "object") {
    return undefined;
  }
  const root = payload as Record<string, unknown>;
  if (root.d && typeof root.d === "object") {
    return readIdFromRow(root.d as Record<string, unknown>);
  }
  return readIdFromRow(root);
}

function readIdFromRow(row: Readonly<Record<string, unknown>>): number | undefined {
  const raw = row.Id ?? row.ID ?? row.id;
  if (typeof raw === "number" && Number.isInteger(raw) && raw > 0) {
    return raw;
  }
  return undefined;
}

function mapStatusFailure(status: number): ProcedureRecordLifecycleEventTransportFailure {
  if (status === 401 || status === 403) {
    return "FORBIDDEN";
  }
  // HTTP 409 unique-constraint collision maps to INDETERMINATE via TRANSPORT_ERROR.
  return "TRANSPORT_ERROR";
}

function trimTrailingSlash(url: string): string {
  return url.replace(/\/+$/, "");
}

function escapeODataString(value: string): string {
  return value.replace(/'/g, "''");
}

function readList(payload: unknown): ProcedureRecordLifecycleEventObservedList | undefined {
  const row = unwrapObject(payload);
  if (!row) {
    return undefined;
  }
  const Id = typeof row.Id === "string" ? row.Id : undefined;
  const Title = typeof row.Title === "string" ? row.Title : undefined;
  const ItemCount = typeof row.ItemCount === "number" ? row.ItemCount : undefined;
  if (Id === undefined || Title === undefined || ItemCount === undefined) {
    return undefined;
  }
  return { Id, Title, ItemCount };
}

function readFields(payload: unknown): ProcedureRecordLifecycleEventObservedField[] | undefined {
  const rows = readCollection(payload);
  if (rows === undefined) {
    return undefined;
  }
  return rows.map((row) => ({
    InternalName: typeof row.InternalName === "string" ? row.InternalName : "",
    StaticName: typeof row.StaticName === "string" ? row.StaticName : undefined,
    TypeAsString: typeof row.TypeAsString === "string" ? row.TypeAsString : undefined,
    Required: typeof row.Required === "boolean" ? row.Required : undefined,
    EnforceUniqueValues:
      typeof row.EnforceUniqueValues === "boolean" ? row.EnforceUniqueValues : undefined,
    Indexed: typeof row.Indexed === "boolean" ? row.Indexed : undefined,
    Choices: Array.isArray(row.Choices)
      ? row.Choices.filter((choice): choice is string => typeof choice === "string")
      : undefined,
    FillInChoice: typeof row.FillInChoice === "boolean" ? row.FillInChoice : undefined,
    MaxLength: typeof row.MaxLength === "number" ? row.MaxLength : undefined,
    Hidden: typeof row.Hidden === "boolean" ? row.Hidden : undefined,
  }));
}

function readItems(payload: unknown): Readonly<Record<string, unknown>>[] | undefined {
  return readCollection(payload);
}

function readCollection(payload: unknown): Readonly<Record<string, unknown>>[] | undefined {
  const root = unwrapObject(payload);
  if (!root) {
    return undefined;
  }
  if (Array.isArray(root.value)) {
    return root.value.filter(
      (row): row is Record<string, unknown> => !!row && typeof row === "object",
    );
  }
  const d = unwrapObject(root.d);
  if (d && Array.isArray(d.results)) {
    return d.results.filter(
      (row): row is Record<string, unknown> => !!row && typeof row === "object",
    );
  }
  return undefined;
}

function unwrapObject(payload: unknown): Record<string, unknown> | undefined {
  if (!payload || typeof payload !== "object") {
    return undefined;
  }
  return payload as Record<string, unknown>;
}
