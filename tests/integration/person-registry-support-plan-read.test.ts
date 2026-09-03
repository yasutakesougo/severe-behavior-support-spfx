import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type { ISupportPlanRepository } from "../../src/domain/support-plan-repository";
import {
  PERSON_REFERENCE_SCHEMA_ID,
  PERSON_REFERENCE_SCHEMA_VERSION,
} from "../../src/integration/person-registry/person-registry-reference";
import type {
  LegacySupportPlanReadReference,
  PersonRegistryReadPort,
} from "../../src/integration/person-registry/person-registry-reference";
import { readSupportPlansByPerson } from "../../src/integration/person-registry/person-support-plan-read-adapter";

type FindByUserCall = Readonly<{
  organizationId: string;
  siteId: string;
  userId: string;
}>;

function reference(): LegacySupportPlanReadReference {
  return {
    schemaId: PERSON_REFERENCE_SCHEMA_ID,
    schemaVersion: PERSON_REFERENCE_SCHEMA_VERSION,
    OrganizationId: "ORG-SYN",
    SiteId: "SITE-ISG",
    PersonId: "person-syn-001",
  };
}

function repository(calls: FindByUserCall[]): ISupportPlanRepository {
  return {
    async getById(_planId) {
      return { status: "NOT_FOUND" };
    },
    async findByUser(organizationId, siteId, userId) {
      calls.push({ organizationId, siteId, userId });
      return { status: "SUCCESS", values: [] };
    },
    async findCurrentByUser(_organizationId, _siteId, _userId) {
      return { status: "NOT_FOUND" };
    },
    async save(_plan, _expectedVersion) {
      return { status: "ERROR", reasonCode: "NOT_USED_IN_READ_PILOT" };
    },
  };
}

function registry(
  result: ReturnType<PersonRegistryReadPort["resolveSevereSupportRecipientLegacyKey"]>,
): PersonRegistryReadPort {
  return {
    resolveSevereSupportRecipientLegacyKey(_reference) {
      return result;
    },
  };
}

describe("WELFARE-PERSON-REGISTRY-V1 severe read adapter", () => {
  it("uses OrganizationId + SiteId + resolved legacy UserId", async () => {
    const calls: FindByUserCall[] = [];
    const result = await readSupportPlansByPerson(
      reference(),
      registry({
        status: "FOUND",
        MappingKey: {
          SourceSystem: "severe-behavior-support-spfx",
          OrganizationId: "ORG-SYN",
          SourceScope: "SITE-ISG",
          LegacyKeyType: "SupportRecipientUserId",
          LegacyKeyValue: "legacy-user-a",
        },
      }),
      repository(calls),
    );

    assert.deepEqual(calls, [
      { organizationId: "ORG-SYN", siteId: "SITE-ISG", userId: "legacy-user-a" },
    ]);
    assert.deepEqual(result, { status: "SUCCESS", values: [] });
  });

  it("does not call the repository when mapping is missing", async () => {
    const calls: FindByUserCall[] = [];
    const result = await readSupportPlansByPerson(
      reference(),
      registry({ status: "NOT_FOUND" }),
      repository(calls),
    );

    assert.deepEqual(calls, []);
    assert.deepEqual(result, { status: "NOT_FOUND" });
  });

  it("fails closed when mapping is conflicting", async () => {
    const calls: FindByUserCall[] = [];
    const result = await readSupportPlansByPerson(
      reference(),
      registry({ status: "CONFLICT" }),
      repository(calls),
    );

    assert.deepEqual(calls, []);
    assert.deepEqual(result, { status: "CONFLICT" });
  });

  it("rejects a mismatched person-reference contract before lookup", async () => {
    const calls: FindByUserCall[] = [];
    const invalidReference = {
      ...reference(),
      schemaVersion: "2.0.0",
    } as unknown as LegacySupportPlanReadReference;

    const result = await readSupportPlansByPerson(
      invalidReference,
      registry({ status: "NOT_FOUND" }),
      repository(calls),
    );

    assert.deepEqual(calls, []);
    assert.deepEqual(result, {
      status: "ERROR",
      reasonCode: "PERSON_REFERENCE_CONTRACT_MISMATCH",
    });
  });
});
