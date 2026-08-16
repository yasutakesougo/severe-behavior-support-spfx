/**
 * Production wiring helper for the ProcedureRecord SPHttpClient binder.
 *
 * Does not itself perform tenant I/O. Item create is not exposed.
 * Callers still need a separate live GO before invoking GET against a real site.
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
