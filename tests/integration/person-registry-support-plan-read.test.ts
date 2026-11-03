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
    async findByUser(scope) {
      calls.push(scope);
      return { status: "SUCCESS", values: [] };
    },
    async findCurrentByUser(_scope) {
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

const testOnlyMappingConfiguration = {
  schemaId: "risk02.person-mapping-allowlist",
  schemaVersion: "1.0.0",
  rules: [
    {
      sourceSystem: "test-source",
      organizationId: "ORG-SYN",
      sourceScope: "test-scope-isg",
      legacyKeyType: "test-user-key",
      siteId: "SITE-ISG",
    },
  ],
} as const;

describe("WELFARE-PERSON-REGISTRY-V1 severe read adapter", () => {
  it("fails closed when the mapping allow-list is not injected", async () => {
    const calls: FindByUserCall[] = [];
    const result = await readSupportPlansByPerson(
      reference(),
      registry({
        status: "FOUND",
        MappingKey: {
          SourceSystem: "test-source",
          OrganizationId: "ORG-SYN",
          SourceScope: "test-scope-isg",
          LegacyKeyType: "test-user-key",
          LegacyKeyValue: "legacy-user-a",
        },
      }),
      repository(calls),
    );

    assert.deepEqual(calls, []);
    assert.deepEqual(result, {
      status: "ERROR",
      reasonCode: "PERSON_MAPPING_CONFIGURATION_INVALID",
    });
  });

  it("rejects malformed person references before Registry or Repository access", async () => {
    const repositoryCalls: FindByUserCall[] = [];
    let registryCalls = 0;
    const personRegistry: PersonRegistryReadPort = {
      resolveSevereSupportRecipientLegacyKey() {
        registryCalls += 1;
        return { status: "NOT_FOUND" };
      },
    };

    const result = await readSupportPlansByPerson(
      null as unknown as LegacySupportPlanReadReference,
      personRegistry,
      repository(repositoryCalls),
      testOnlyMappingConfiguration,
    );

    assert.deepEqual(result, {
      status: "ERROR",
      reasonCode: "PERSON_REFERENCE_CONTRACT_MISMATCH",
    });
    assert.equal(registryCalls, 0);
    assert.deepEqual(repositoryCalls, []);
  });

  it("rejects every mapping dimension mismatch before repository access", async () => {
    const allowed = {
      SourceSystem: "test-source",
      OrganizationId: "ORG-SYN",
      SourceScope: "test-scope-isg",
      LegacyKeyType: "test-user-key",
      LegacyKeyValue: "legacy-user-a",
    };
    const mismatches = [
      { ...allowed, SourceSystem: "other-source" },
      { ...allowed, OrganizationId: "OTHER-ORG" },
      { ...allowed, SourceScope: "other-scope" },
      { ...allowed, LegacyKeyType: "other-key-type" },
      { ...allowed, LegacyKeyValue: "" },
    ];

    for (const MappingKey of mismatches) {
      const calls: FindByUserCall[] = [];
      const result = await readSupportPlansByPerson(
        reference(),
        registry({ status: "FOUND", MappingKey }),
        repository(calls),
        testOnlyMappingConfiguration,
      );
      assert.deepEqual(calls, []);
      assert.deepEqual(result, { status: "ERROR", reasonCode: "PERSON_MAPPING_SCOPE_MISMATCH" });
    }
  });

  it("rejects a configuration whose rule does not match the requested site", async () => {
    const calls: FindByUserCall[] = [];
    const result = await readSupportPlansByPerson(
      reference(),
      registry({
        status: "FOUND",
        MappingKey: {
          SourceSystem: "test-source",
          OrganizationId: "ORG-SYN",
          SourceScope: "test-scope-isg",
          LegacyKeyType: "test-user-key",
          LegacyKeyValue: "legacy-user-a",
        },
      }),
      repository(calls),
      {
        ...testOnlyMappingConfiguration,
        rules: [{ ...testOnlyMappingConfiguration.rules[0], siteId: "SITE-HOM" }],
      },
    );

    assert.deepEqual(calls, []);
    assert.deepEqual(result, { status: "ERROR", reasonCode: "PERSON_MAPPING_SCOPE_MISMATCH" });
  });

  it("rejects wildcard or malformed configuration values and malformed Registry payloads", async () => {
    const calls: FindByUserCall[] = [];
    const configWithWildcard = {
      ...testOnlyMappingConfiguration,
      rules: [{ ...testOnlyMappingConfiguration.rules[0], sourceSystem: "*" }],
    };
    const validMapping = {
      SourceSystem: "test-source",
      OrganizationId: "ORG-SYN",
      SourceScope: "test-scope-isg",
      LegacyKeyType: "test-user-key",
      LegacyKeyValue: "legacy-user-a",
    };
    const invalidConfigResult = await readSupportPlansByPerson(
      reference(),
      registry({ status: "FOUND", MappingKey: validMapping }),
      repository(calls),
      configWithWildcard,
    );
    assert.deepEqual(invalidConfigResult, {
      status: "ERROR",
      reasonCode: "PERSON_MAPPING_CONFIGURATION_INVALID",
    });

    const malformedMapping = {
      status: "FOUND",
      MappingKey: { ...validMapping, SourceScope: undefined },
    } as unknown as ReturnType<PersonRegistryReadPort["resolveSevereSupportRecipientLegacyKey"]>;
    const malformedMappingResult = await readSupportPlansByPerson(
      reference(),
      registry(malformedMapping),
      repository(calls),
      testOnlyMappingConfiguration,
    );
    assert.deepEqual(malformedMappingResult, {
      status: "ERROR",
      reasonCode: "PERSON_MAPPING_SCOPE_MISMATCH",
    });
    assert.deepEqual(calls, []);
  });

  it("fails closed on a malformed Registry result discriminator", async () => {
    const calls: FindByUserCall[] = [];
    const malformedResult = { status: "UNKNOWN_STATUS" } as unknown as ReturnType<
      PersonRegistryReadPort["resolveSevereSupportRecipientLegacyKey"]
    >;
    const result = await readSupportPlansByPerson(
      reference(),
      registry(malformedResult),
      repository(calls),
      testOnlyMappingConfiguration,
    );

    assert.deepEqual(result, {
      status: "ERROR",
      reasonCode: "PERSON_MAPPING_LOOKUP_FAILED",
    });
    assert.deepEqual(calls, []);
  });

  it("uses OrganizationId + SiteId + resolved legacy UserId", async () => {
    const calls: FindByUserCall[] = [];
    const result = await readSupportPlansByPerson(
      reference(),
      registry({
        status: "FOUND",
        MappingKey: {
          SourceSystem: "test-source",
          OrganizationId: "ORG-SYN",
          SourceScope: "test-scope-isg",
          LegacyKeyType: "test-user-key",
          LegacyKeyValue: "legacy-user-a",
        },
      }),
      repository(calls),
      testOnlyMappingConfiguration,
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
      testOnlyMappingConfiguration,
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
      testOnlyMappingConfiguration,
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
