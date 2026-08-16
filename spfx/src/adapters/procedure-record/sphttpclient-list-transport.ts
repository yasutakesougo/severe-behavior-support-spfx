/**
 * Concrete ProcedureRecord List transport via SPFx SPHttpClient.
 *
 * LOOKUP-B: addresses the list by GUID, never by Display Name / GetByTitle.
 * CREATE-ONLY: createItem exists; updateItem is absent.
 * Production itemCreateAuthorized defaults to false: createItem does not POST.
 *
 * Live tenant I/O is NOT authorized by constructing this binder alone.
 */

import type {
  ProcedureRecordItemCreateResult,
  ProcedureRecordItemReadResult,
  ProcedureRecordLiveListTransport,
  ProcedureRecordObservedField,
  ProcedureRecordObservedList,
  ProcedureRecordSchemaReadResult,
  ProcedureRecordTransportFailure,
} from "./transport-types";

export const PROCEDURE_RECORD_TEST_ONLY_LIST_GUID = "b971ff03-799e-41ac-b037-8becb9f4ff4b" as const;
export const PROCEDURE_RECORD_TEST_ONLY_LIST_ITEM_ENTITY_TYPE = "SP.Data.ListListItem" as const;

export type ProcedureRecordSpHttpRequestOptions = {
  headers?: Record<string, string>;
  body?: string;
};

export type ProcedureRecordSpHttpResponse = {
  ok: boolean;
  status: number;
  json(): Promise<unknown>;
};

export type ProcedureRecordSpHttpClient = {
  get(
    url: string,
    configuration: unknown,
    options?: ProcedureRecordSpHttpRequestOptions,
  ): Promise<ProcedureRecordSpHttpResponse>;
  post(
    url: string,
    configuration: unknown,
    options: ProcedureRecordSpHttpRequestOptions,
  ): Promise<ProcedureRecordSpHttpResponse>;
};

export type CreateProcedureRecordSpHttpClientTransportOptions = Readonly<{
  spHttpClient: ProcedureRecordSpHttpClient;
  configuration: unknown;
  webAbsoluteUrl: string;
  listGuid: string;
  listItemEntityTypeFullName?: string;
  itemCreateAuthorized?: boolean;
}>;

// EditFormat is provisioning-time (Dropdown); not a runtime physical invariant.
const FIELD_SELECT = [
  "InternalName",
  "StaticName",
  "Title",
  "TypeAsString",
  "Required",
  "EnforceUniqueValues",
  "Indexed",
  "Choices",
  "FillInChoice",
  "DefaultValue",
  "MaxLength",
] as const;

const ITEM_SELECT = [
  "Id",
  "prRecordId",
  "prIdempotencyKey",
  "prPayloadFingerprint",
  "prOrganizationId",
  "prSiteId",
  "prUserId",
  "prProcedureId",
  "prProcedureVersion",
  "prApprovalState",
  "prLocalDate",
  "prPlanId",
  "prPlanVersion",
  "prResult",
  "prPerformedAt",
  "prRecordedAt",
  "prRecordedBy",
] as const;

const GUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

export function normalizeProcedureRecordListGuid(value: string): string | undefined {
  const normalized = value
    .trim()
    .replace(/^\{|\}$/g, "")
    .toLowerCase();
  return GUID_RE.test(normalized) ? normalized : undefined;
}

export function procedureRecordListApiUrl(
  webAbsoluteUrl: string,
  listGuid: string,
): string | undefined {
  const guid = normalizeProcedureRecordListGuid(listGuid);
  if (guid === undefined) {
    return undefined;
  }
  return `${trimTrailingSlash(webAbsoluteUrl)}/_api/web/lists(guid'${guid}')`;
}

export function createProcedureRecordSpHttpClientTransport(
  options: CreateProcedureRecordSpHttpClientTransportOptions,
): ProcedureRecordLiveListTransport {
  const client = options.spHttpClient;
  const configuration = options.configuration;
  const listApiUrl = procedureRecordListApiUrl(options.webAbsoluteUrl, options.listGuid);

  async function getJson(
    url: string,
  ): Promise<
    { ok: true; payload: unknown } | { ok: false; failure: ProcedureRecordTransportFailure }
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

  async function getSchema(): Promise<ProcedureRecordSchemaReadResult> {
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
    fieldName: "prRecordId" | "prIdempotencyKey",
    token: string,
  ): Promise<ProcedureRecordItemReadResult> {
    if (listApiUrl === undefined || typeof token !== "string" || token.length === 0) {
      return { ok: false, failure: "TRANSPORT_ERROR" };
    }
    const filter = `${fieldName} eq '${escapeODataString(token)}'`;
    const url =
      `${listApiUrl}/items` +
      `?$filter=${encodeURIComponent(filter)}` +
      `&$select=${ITEM_SELECT.join(",")}` +
      `&$top=2`;
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
  ): Promise<ProcedureRecordItemCreateResult> {
    if (options.itemCreateAuthorized !== true) {
      return { ok: false, failure: "FORBIDDEN" };
    }
    const entityType = options.listItemEntityTypeFullName?.trim() ?? "";
    if (listApiUrl === undefined || entityType.length === 0) {
      return { ok: false, failure: "TRANSPORT_ERROR" };
    }
    try {
      const response = await client.post(`${listApiUrl}/items`, configuration, {
        headers: writeHeaders(),
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
    targetListGuid: normalizeProcedureRecordListGuid(options.listGuid) ?? "",
    getSchema,
    findByRecordId(recordId: string): Promise<ProcedureRecordItemReadResult> {
      return findByFilter("prRecordId", recordId);
    },
    findByIdempotencyKey(idempotencyKey: string): Promise<ProcedureRecordItemReadResult> {
      return findByFilter("prIdempotencyKey", idempotencyKey);
    },
    createItem,
  };
}

function mapStatusFailure(status: number): ProcedureRecordTransportFailure {
  if (status === 401 || status === 403) {
    return "FORBIDDEN";
  }
  return "TRANSPORT_ERROR";
}

function writeHeaders(): Record<string, string> {
  return {
    Accept: "application/json;odata=verbose",
    "Content-Type": "application/json;odata=verbose",
    "odata-version": "3.0",
  };
}

function withVerboseMetadata(
  fields: Readonly<Record<string, unknown>>,
  entityType: string,
): Record<string, unknown> {
  const body: Record<string, unknown> = {
    __metadata: { type: entityType },
  };
  for (const key of Object.keys(fields)) {
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

function trimTrailingSlash(url: string): string {
  return url.replace(/\/+$/, "");
}

function escapeODataString(value: string): string {
  return value.replace(/'/g, "''");
}

function readList(payload: unknown): ProcedureRecordObservedList | undefined {
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

function readFields(payload: unknown): ProcedureRecordObservedField[] | undefined {
  const rows = readCollection(payload);
  if (rows === undefined) {
    return undefined;
  }
  return rows.map((row) => ({
    InternalName: typeof row.InternalName === "string" ? row.InternalName : "",
    StaticName: typeof row.StaticName === "string" ? row.StaticName : undefined,
    Title: typeof row.Title === "string" ? row.Title : undefined,
    TypeAsString: typeof row.TypeAsString === "string" ? row.TypeAsString : undefined,
    Required: typeof row.Required === "boolean" ? row.Required : undefined,
    EnforceUniqueValues:
      typeof row.EnforceUniqueValues === "boolean" ? row.EnforceUniqueValues : undefined,
    Indexed: typeof row.Indexed === "boolean" ? row.Indexed : undefined,
    Choices: Array.isArray(row.Choices)
      ? row.Choices.filter((choice): choice is string => typeof choice === "string")
      : undefined,
    FillInChoice: typeof row.FillInChoice === "boolean" ? row.FillInChoice : undefined,
    DefaultValue: typeof row.DefaultValue === "string" ? row.DefaultValue : undefined,
    MaxLength: typeof row.MaxLength === "number" ? row.MaxLength : undefined,
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
