/**
 * SPFx-host factory for LIVE-SP-2 read integration.
 *
 * Construction only binds the existing SPHttpClient transport. No GET is
 * issued until the returned read-only facade is explicitly invoked under a
 * separate live-execution GO.
 */

import {
  createAssessmentSnapshotSpHttpClientTransportFromHost,
  type CreateAssessmentSnapshotSpHttpClientTransportFromHostOptions,
} from "./sphttpclient-list-transport.factory";
import {
  createAssessmentSnapshotReadIntegration,
  type AssessmentSnapshotReadIntegration,
} from "./read-integration";

export type CreateAssessmentSnapshotReadIntegrationFromHostOptions =
  CreateAssessmentSnapshotSpHttpClientTransportFromHostOptions;

export function createAssessmentSnapshotReadIntegrationFromHost(
  options: CreateAssessmentSnapshotReadIntegrationFromHostOptions,
): AssessmentSnapshotReadIntegration {
  const transport = createAssessmentSnapshotSpHttpClientTransportFromHost(options);
  return createAssessmentSnapshotReadIntegration(transport);
}
