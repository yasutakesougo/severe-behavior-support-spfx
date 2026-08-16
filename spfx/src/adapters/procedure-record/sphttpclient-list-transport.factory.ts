/**
 * Production wiring helper for the ProcedureRecord SPHttpClient binder.
 *
 * Does not itself perform tenant I/O. itemCreateAuthorized defaults to false.
 * Live POST still requires a separate Human LIVE WRITE GO.
 */

import { SPHttpClient } from "@microsoft/sp-http";

import {
  createProcedureRecordSpHttpClientTransport,
  type CreateProcedureRecordSpHttpClientTransportOptions,
} from "./sphttpclient-list-transport";
import type { ProcedureRecordLiveListTransport } from "./transport-types";

export type CreateProcedureRecordSpHttpClientTransportFromHostOptions = Omit<
  CreateProcedureRecordSpHttpClientTransportOptions,
  "configuration" | "spHttpClient"
> &
  Readonly<{
    spHttpClient: SPHttpClient;
  }>;

export function createProcedureRecordSpHttpClientTransportFromHost(
  options: CreateProcedureRecordSpHttpClientTransportFromHostOptions,
): ProcedureRecordLiveListTransport {
  return createProcedureRecordSpHttpClientTransport({
    ...options,
    spHttpClient: options.spHttpClient,
    configuration: SPHttpClient.configurations.v1,
  });
}
