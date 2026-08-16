/**
 * Production wiring helper for the ProcedureRecord SPHttpClient binder.
 *
 * Does not itself perform tenant I/O. Does not accept write-authorization flags.
 * Live POST still requires a separate Human LIVE WRITE GO.
 */

import { SPHttpClient } from "@microsoft/sp-http";

import {
  createProcedureRecordSpHttpClientTransport,
  type CreateProcedureRecordSpHttpClientTransportOptions,
} from "./sphttpclient-list-transport";
import type { ProcedureRecordLiveListTransport } from "./transport-types";

export type CreateProcedureRecordSpHttpClientTransportFromHostOptions = Readonly<{
  spHttpClient: SPHttpClient;
  webAbsoluteUrl: string;
  listGuid: string;
  listItemEntityTypeFullName?: string;
}>;

export function createProcedureRecordSpHttpClientTransportFromHost(
  options: CreateProcedureRecordSpHttpClientTransportFromHostOptions,
): ProcedureRecordLiveListTransport {
  const productionOptions: CreateProcedureRecordSpHttpClientTransportOptions = {
    spHttpClient: options.spHttpClient,
    configuration: SPHttpClient.configurations.v1,
    webAbsoluteUrl: options.webAbsoluteUrl,
    listGuid: options.listGuid,
    listItemEntityTypeFullName: options.listItemEntityTypeFullName,
  };
  return createProcedureRecordSpHttpClientTransport(productionOptions);
}
