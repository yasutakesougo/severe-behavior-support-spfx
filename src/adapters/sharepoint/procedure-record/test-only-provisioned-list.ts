/**
 * Observed test-only ProcedureRecord List identity after physical provisioning COMPLETE.
 *
 * LOOKUP-B: List GUID is identity. Display Name and web URL are not.
 * This module does not invent logical SiteId and does not record physical
 * SharePoint Site ID. Callers must inject logical SiteId at bind time.
 *
 * LIVE WRITE / item create remain unauthorized.
 */

import { PROCEDURE_RECORD_LIST_DISPLAY_NAME } from "./physical-columns";

/** Provisioning execution output. Not logical SiteId. */
export const PROCEDURE_RECORD_TEST_ONLY_LIST_GUID = "b971ff03-799e-41ac-b037-8becb9f4ff4b" as const;

/**
 * Operational web path of the Human-chosen test-only site.
 * Not List identity. Not logical SiteId.
 */
export const PROCEDURE_RECORD_TEST_ONLY_WEB_SERVER_RELATIVE_URL =
  "/sites/severe-support-procedurerecord-test" as const;

export const PROCEDURE_RECORD_TEST_ONLY_PROVISIONED_LIST = {
  kind: "test-only-provisioned-list",
  listGuid: PROCEDURE_RECORD_TEST_ONLY_LIST_GUID,
  webServerRelativeUrl: PROCEDURE_RECORD_TEST_ONLY_WEB_SERVER_RELATIVE_URL,
  listDisplayName: PROCEDURE_RECORD_LIST_DISPLAY_NAME,
  logicalSiteId: "caller-supplied",
  physicalSharePointSiteId: "not-used-as-logical-site-id",
} as const;
