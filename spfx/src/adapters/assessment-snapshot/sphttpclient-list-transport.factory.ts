/**
 * Production wiring helper for the AssessmentSnapshot SPHttpClient binder.
 *
 * Imports the concrete `@microsoft/sp-http` `SPHttpClient` class and
 * `configurations.v1`. Intended for SPFx web part / application context wiring.
 *
 * Does not itself perform tenant I/O; callers still need a separate live GO
 * before invoking transport methods against a real site.
 */

import { SPHttpClient } from "@microsoft/sp-http";

import {
  createAssessmentSnapshotSpHttpClientTransport,
  type CreateAssessmentSnapshotSpHttpClientTransportOptions,
} from "./sphttpclient-list-transport";
import type { AssessmentSnapshotListTransport } from "./transport-types";

export type CreateAssessmentSnapshotSpHttpClientTransportFromHostOptions = Omit<
  CreateAssessmentSnapshotSpHttpClientTransportOptions,
  "configuration" | "spHttpClient"
> &
  Readonly<{
    spHttpClient: SPHttpClient;
  }>;

export function createAssessmentSnapshotSpHttpClientTransportFromHost(
  options: CreateAssessmentSnapshotSpHttpClientTransportFromHostOptions,
): AssessmentSnapshotListTransport {
  return createAssessmentSnapshotSpHttpClientTransport({
    ...options,
    spHttpClient: options.spHttpClient,
    configuration: SPHttpClient.configurations.v1,
  });
}
