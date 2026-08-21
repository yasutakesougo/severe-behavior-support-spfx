/**
 * Host wiring helper for the ProcedureRecordLifecycleEvent SPHttpClient binder.
 *
 * Does not itself perform tenant I/O. Does not accept write-authorization flags
 * or mint synthetic CREATE authorization. Live POST requires a separate Human
 * CREATE GO outside this factory.
 */

import { SPHttpClient } from "@microsoft/sp-http";

import {
  createProcedureRecordLifecycleEventSpHttpClientTransport,
  type CreateProcedureRecordLifecycleEventSpHttpClientTransportOptions,
} from "./sphttpclient-list-transport";
import type { ProcedureRecordLifecycleEventListTransport } from "./transport-types";

export type CreateProcedureRecordLifecycleEventSpHttpClientTransportFromHostOptions = Readonly<{
  spHttpClient: SPHttpClient;
  webAbsoluteUrl: string;
  siteIdentity: string;
  listGuid: string;
  listItemEntityTypeFullName?: string;
}>;

export function createProcedureRecordLifecycleEventSpHttpClientTransportFromHost(
  options: CreateProcedureRecordLifecycleEventSpHttpClientTransportFromHostOptions,
): ProcedureRecordLifecycleEventListTransport {
  const productionOptions: CreateProcedureRecordLifecycleEventSpHttpClientTransportOptions = {
    spHttpClient: options.spHttpClient,
    configuration: SPHttpClient.configurations.v1,
    webAbsoluteUrl: options.webAbsoluteUrl,
    siteIdentity: options.siteIdentity,
    listGuid: options.listGuid,
    listItemEntityTypeFullName: options.listItemEntityTypeFullName,
  };
  return createProcedureRecordLifecycleEventSpHttpClientTransport(productionOptions);
}
