import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  bindProcedureRecordList,
  bindTestOnlyProvisionedProcedureRecordList,
  createProcedureRecordLiveWriteAuthorization,
  isProcedureRecordLiveWriteAuthorized,
  isUsableLiveListBinding,
  PROCEDURE_RECORD_LIST_DISPLAY_NAME,
  PROCEDURE_RECORD_TEST_ONLY_LIST_GUID,
  PROCEDURE_RECORD_TEST_ONLY_WEB_SERVER_RELATIVE_URL,
  procedureRecordSiteIdToListGuidMap,
  resolveProcedureRecordListGuid,
} from "../../../../src/adapters/sharepoint/procedure-record";

const LOGICAL_SITE_ID = "test-only-procedure-record-logical-site-id";
const ORGANIZATION_ID = "test-only-procedure-record-organization-id";

describe("ProcedureRecord LOOKUP-B live binding", () => {
  it("maps caller-supplied logical SiteId to the observed test-only List GUID", () => {
    const binding = bindTestOnlyProvisionedProcedureRecordList({
      organizationId: ORGANIZATION_ID,
      siteId: LOGICAL_SITE_ID,
    });
    assert.ok(binding);
    assert.equal(binding?.listGuid, PROCEDURE_RECORD_TEST_ONLY_LIST_GUID);
    assert.equal(binding?.siteId, LOGICAL_SITE_ID);
    assert.equal(
      resolveProcedureRecordListGuid(procedureRecordSiteIdToListGuidMap(binding), LOGICAL_SITE_ID),
      PROCEDURE_RECORD_TEST_ONLY_LIST_GUID,
    );
  });

  it("does not treat Display Name, web URL, or List GUID as logical SiteId", () => {
    assert.equal(
      resolveProcedureRecordListGuid(
        { [PROCEDURE_RECORD_LIST_DISPLAY_NAME]: PROCEDURE_RECORD_TEST_ONLY_LIST_GUID },
        LOGICAL_SITE_ID,
      ),
      null,
    );
    assert.equal(
      resolveProcedureRecordListGuid(
        {
          [PROCEDURE_RECORD_TEST_ONLY_WEB_SERVER_RELATIVE_URL]:
            PROCEDURE_RECORD_TEST_ONLY_LIST_GUID,
        },
        LOGICAL_SITE_ID,
      ),
      null,
    );
    assert.equal(
      bindProcedureRecordList({
        organizationId: ORGANIZATION_ID,
        siteId: PROCEDURE_RECORD_TEST_ONLY_LIST_GUID,
        listGuid: PROCEDURE_RECORD_TEST_ONLY_LIST_GUID,
      }),
      null,
    );
    assert.equal(
      isUsableLiveListBinding({
        organizationId: ORGANIZATION_ID,
        siteId: PROCEDURE_RECORD_TEST_ONLY_LIST_GUID,
        listGuid: `{${PROCEDURE_RECORD_TEST_ONLY_LIST_GUID.toUpperCase()}}`,
      }),
      false,
    );
  });

  it("normalizes braces on the observed List GUID and keeps live write unauthorized", () => {
    const binding = bindProcedureRecordList({
      organizationId: ORGANIZATION_ID,
      siteId: LOGICAL_SITE_ID,
      listGuid: `{${PROCEDURE_RECORD_TEST_ONLY_LIST_GUID.toUpperCase()}}`,
    });
    assert.ok(binding);
    assert.equal(binding?.listGuid, PROCEDURE_RECORD_TEST_ONLY_LIST_GUID);
    assert.equal(isProcedureRecordLiveWriteAuthorized(), false);
    assert.equal(createProcedureRecordLiveWriteAuthorization(), null);
  });
});
