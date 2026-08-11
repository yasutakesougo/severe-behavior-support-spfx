/**
 * Concrete AssessmentSnapshots List Items transport via SPFx SPHttpClient.
 *
 * Authority: Human GO for Binder Implementation Start after
 * Decision-AS-ADAPTER-SPFX-VERSION-SCAFFOLD-1 = V-1 + A and scaffold materialization PASS.
 *
 * TR-1-A / TC-1-A: SharePoint REST List Items through SPHttpClient.
 * CL-1-A / CO-1-A: field bodies are caller-supplied（typically from root rest-body builders）.
 * CL-1-B: update clear uses JSON null; this binder preserves null in the REST body.
 *
 * Live tenant I/O is NOT authorized by constructing this binder alone.
 * Callers must not invoke methods against a real tenant without a separate live GO.
 *
 * Runtime wiring with the concrete `SPHttpClient` class lives in
 * `sphttpclient-list-transport.factory.ts` so synthetic Jest doubles do not load
 * the full SPFx host graph.
 */

import type {
  AssessmentSnapshotListTransport,
  AssessmentSnapshotTransportFailure,
  AssessmentSnapshotTransportReadResult,
  AssessmentSnapshotTransportWriteResult,
} from "./transport-types";

export const ASSESSMENT_SNAPSHOTS_LIST_TITLE = "AssessmentSnapshots" as const;
export const ASSESSMENT_SNAPSHOTS_LIST_ITEM_ENTITY_TYPE =
  "SP.Data.AssessmentSnapshotsListItem" as const;

export type AssessmentSnapshotSpHttpRequestOptions = {
  headers?: Record<string, string>;
  body?: string;
};

export type AssessmentSnapshotSpHttpResponse = {
  ok: boolean;
  status: number;
  json(): Promise<unknown>;
};

/**
 * Structural SPHttpClient surface used by the binder.
 * Production wiring passes `context.spHttpClient` plus `SPHttpClient.configurations.v1`.
 * Synthetic tests pass a local double — no live HTTP.
 */
export type AssessmentSnapshotSpHttpClient = {
  get(
    url: string,
    configuration: unknown,
    options?: AssessmentSnapshotSpHttpRequestOptions,
  ): Promise<AssessmentSnapshotSpHttpResponse>;
  post(
    url: string,
    configuration: unknown,
    options: AssessmentSnapshotSpHttpRequestOptions,
  ): Promise<AssessmentSnapshotSpHttpResponse>;
};

export type CreateAssessmentSnapshotSpHttpClientTransportOptions = Readonly<{
  spHttpClient: AssessmentSnapshotSpHttpClient;
  /**
   * Pass `SPHttpClient.configurations.v1` from the SPFx host / factory.
   */
  configuration: unknown;
  webAbsoluteUrl: string;
  listTitle?: string;
  listItemEntityTypeFullName?: string;
}>;

const SELECT_FIELDS = [
  "Id",
  "snapshotId",
  "recordStatus",
  "result",
  "reasonCodes",
  "ruleSetVersion",
  "periodStart",
  "periodEnd",
  "inputFingerprint",
  "supersedesSnapshotId",
] as const;

export function createAssessmentSnapshotSpHttpClientTransport(
  options: CreateAssessmentSnapshotSpHttpClientTransportOptions,
): AssessmentSnapshotListTransport {
  const webAbsoluteUrl = trimTrailingSlash(options.webAbsoluteUrl);
  const listTitle = options.listTitle ?? ASSESSMENT_SNAPSHOTS_LIST_TITLE;
  const entityType =
    options.listItemEntityTypeFullName ?? ASSESSMENT_SNAPSHOTS_LIST_ITEM_ENTITY_TYPE;
  const client = options.spHttpClient;
  const configuration = options.configuration;
  const itemsCollectionUrl = `${webAbsoluteUrl}/_api/web/lists/GetByTitle('${escapeODataString(
    listTitle,
  )}')/items`;

  return {
    async createItem(
      fields: Readonly<Record<string, unknown>>,
    ): Promise<AssessmentSnapshotTransportWriteResult> {
      try {
        const response = await client.post(itemsCollectionUrl, configuration, {
          headers: writeHeaders(),
          body: JSON.stringify(withVerboseMetadata(fields, entityType)),
        });
        if (!response.ok) {
          return { ok: false, failure: mapStatusFailure(response.status) };
        }
        const payload = await response.json();
        const listItemId = readListItemId(payload);
        if (listItemId === undefined) {
          return { ok: false, failure: "TRANSPORT_ERROR" };
        }
        return { ok: true, listItemId };
      } catch {
        return { ok: false, failure: "TRANSPORT_ERROR" };
      }
    },

    async updateItem(
      listItemId: number,
      fields: Readonly<Record<string, unknown>>,
    ): Promise<AssessmentSnapshotTransportWriteResult> {
      if (!Number.isInteger(listItemId) || listItemId <= 0) {
        return { ok: false, failure: "TRANSPORT_ERROR" };
      }
      try {
        const response = await client.post(`${itemsCollectionUrl}(${listItemId})`, configuration, {
          headers: {
            ...writeHeaders(),
            "X-HTTP-Method": "MERGE",
            "IF-MATCH": "*",
          },
          body: JSON.stringify(withVerboseMetadata(fields, entityType)),
        });
        if (!response.ok) {
          return { ok: false, failure: mapStatusFailure(response.status) };
        }
        return { ok: true, listItemId };
      } catch {
        return { ok: false, failure: "TRANSPORT_ERROR" };
      }
    },

    async getBySnapshotId(snapshotId: string): Promise<AssessmentSnapshotTransportReadResult> {
      if (typeof snapshotId !== "string" || snapshotId.length === 0) {
        return { ok: false, failure: "TRANSPORT_ERROR" };
      }
      try {
        const filter = `snapshotId eq '${escapeODataString(snapshotId)}'`;
        const url =
          `${itemsCollectionUrl}` +
          `?$filter=${encodeURIComponent(filter)}` +
          `&$select=${SELECT_FIELDS.join(",")}` +
          `&$top=1`;
        const response = await client.get(url, configuration, {
          headers: {
            Accept: "application/json;odata=verbose",
          },
        });
        if (!response.ok) {
          if (response.status === 404) {
            return { ok: false, failure: "NOT_FOUND" };
          }
          return { ok: false, failure: mapStatusFailure(response.status) };
        }
        const payload = await response.json();
        const row = readFirstVerboseRow(payload);
        if (!row) {
          return { ok: false, failure: "NOT_FOUND" };
        }
        const id = readIdFromRow(row);
        if (id === undefined) {
          return { ok: false, failure: "TRANSPORT_ERROR" };
        }
        return {
          ok: true,
          listItemId: id,
          fields: pickPhysicalFields(row),
        };
      } catch {
        return { ok: false, failure: "TRANSPORT_ERROR" };
      }
    },
  };
}

function writeHeaders(): Record<string, string> {
  return {
    Accept: "application/json;odata=verbose",
    "Content-Type": "application/json;odata=verbose",
    "odata-version": "3.0",
  };
}

/**
 * Preserve JSON null for supersedesSnapshotId clear（CL-1-B / CO-1-A）.
 * Uses verbose metadata shape verified in Decision-AS-TRANSPORT-1.
 */
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

function mapStatusFailure(status: number): AssessmentSnapshotTransportFailure {
  if (status === 401 || status === 403) {
    return "FORBIDDEN";
  }
  if (status === 404 || status === 409 || status >= 500) {
    return "PERSISTENCE_UNAVAILABLE";
  }
  return "TRANSPORT_ERROR";
}

function trimTrailingSlash(url: string): string {
  return url.replace(/\/+$/, "");
}

function escapeODataString(value: string): string {
  return value.replace(/'/g, "''");
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

function readFirstVerboseRow(payload: unknown): Readonly<Record<string, unknown>> | undefined {
  if (!payload || typeof payload !== "object") {
    return undefined;
  }
  const root = payload as Record<string, unknown>;
  const d = root.d;
  if (!d || typeof d !== "object") {
    return undefined;
  }
  const results = (d as Record<string, unknown>).results;
  if (!Array.isArray(results) || results.length === 0) {
    return undefined;
  }
  const first = results[0];
  if (!first || typeof first !== "object") {
    return undefined;
  }
  return first as Record<string, unknown>;
}

function readIdFromRow(row: Readonly<Record<string, unknown>>): number | undefined {
  const raw = row.Id ?? row.ID ?? row.id;
  if (typeof raw === "number" && Number.isInteger(raw) && raw > 0) {
    return raw;
  }
  return undefined;
}

function pickPhysicalFields(
  row: Readonly<Record<string, unknown>>,
): Readonly<Record<string, unknown>> {
  const fields: Record<string, unknown> = {};
  for (const key of SELECT_FIELDS) {
    if (key === "Id") {
      continue;
    }
    if (Object.prototype.hasOwnProperty.call(row, key)) {
      fields[key] = row[key];
    }
  }
  return fields;
}
