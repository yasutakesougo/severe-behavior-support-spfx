import type { SupportPlan } from "../../domain/support-plan";
import type { ISupportPlanRepository } from "../../domain/support-plan-repository";
import { isExactPersonReferenceV1 } from "./person-registry-reference";
import { parsePersonSupportPlanMappingConfiguration } from "./person-support-plan-mapping-config";
import type {
  LegacySupportPlanReadReference,
  PersonRegistryReadPort,
} from "./person-registry-reference";

export type PersonSupportPlanReadResult =
  | Readonly<{ status: "SUCCESS"; values: readonly SupportPlan[] }>
  | Readonly<{ status: "NOT_FOUND" }>
  | Readonly<{ status: "CONFLICT" }>
  | Readonly<{ status: "ERROR"; reasonCode: string }>;

export async function readSupportPlansByPerson(
  reference: LegacySupportPlanReadReference,
  personRegistry: PersonRegistryReadPort,
  supportPlanRepository: ISupportPlanRepository,
  mappingConfiguration?: unknown,
): Promise<PersonSupportPlanReadResult> {
  if (!isValidPersonReference(reference)) {
    return { status: "ERROR", reasonCode: "PERSON_REFERENCE_CONTRACT_MISMATCH" };
  }

  const configuration = parsePersonSupportPlanMappingConfiguration(mappingConfiguration);
  if (!configuration) {
    return { status: "ERROR", reasonCode: "PERSON_MAPPING_CONFIGURATION_INVALID" };
  }

  let mapping: ReturnType<PersonRegistryReadPort["resolveSevereSupportRecipientLegacyKey"]>;
  try {
    mapping = personRegistry.resolveSevereSupportRecipientLegacyKey(reference);
  } catch {
    return { status: "ERROR", reasonCode: "PERSON_MAPPING_LOOKUP_FAILED" };
  }

  if (!mapping || typeof mapping !== "object" || Array.isArray(mapping)) {
    return { status: "ERROR", reasonCode: "PERSON_MAPPING_LOOKUP_FAILED" };
  }
  if (mapping.status === "NOT_FOUND") return { status: "NOT_FOUND" };
  if (mapping.status === "CONFLICT") return { status: "CONFLICT" };
  if (mapping.status !== "FOUND") {
    return { status: "ERROR", reasonCode: "PERSON_MAPPING_LOOKUP_FAILED" };
  }
  if (!isLegacyMappingKey(mapping.MappingKey)) {
    return { status: "ERROR", reasonCode: "PERSON_MAPPING_SCOPE_MISMATCH" };
  }

  const matchingRules = configuration.rules.filter(
    (rule) =>
      rule.organizationId === reference.OrganizationId &&
      rule.siteId === reference.SiteId &&
      rule.sourceSystem === mapping.MappingKey.SourceSystem &&
      rule.organizationId === mapping.MappingKey.OrganizationId &&
      rule.sourceScope === mapping.MappingKey.SourceScope &&
      rule.legacyKeyType === mapping.MappingKey.LegacyKeyType,
  );
  if (matchingRules.length !== 1 || mapping.MappingKey.LegacyKeyValue.trim().length === 0) {
    return { status: "ERROR", reasonCode: "PERSON_MAPPING_SCOPE_MISMATCH" };
  }

  return supportPlanRepository.findByUser({
    organizationId: reference.OrganizationId,
    siteId: reference.SiteId,
    userId: mapping.MappingKey.LegacyKeyValue,
  });
}

function isLegacyMappingKey(value: unknown): value is {
  SourceSystem: string;
  OrganizationId: string;
  SourceScope: string;
  LegacyKeyType: string;
  LegacyKeyValue: string;
} {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const mapping = value as Record<string, unknown>;
  return [
    mapping.SourceSystem,
    mapping.OrganizationId,
    mapping.SourceScope,
    mapping.LegacyKeyType,
    mapping.LegacyKeyValue,
  ].every(isNonEmptyString);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isValidPersonReference(value: unknown): value is LegacySupportPlanReadReference {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const reference = value as Record<string, unknown>;
  return (
    isExactPersonReferenceV1(reference as { schemaId: string; schemaVersion: string }) &&
    isNonEmptyString(reference.OrganizationId) &&
    isNonEmptyString(reference.SiteId) &&
    isNonEmptyString(reference.PersonId)
  );
}
