export const PERSON_REFERENCE_SCHEMA_ID = "welfare.person-registry.person-reference" as const;
export const PERSON_REFERENCE_SCHEMA_VERSION = "1.0.0" as const;

export type PersonRegistryPersonReferenceV1 = Readonly<{
  schemaId: typeof PERSON_REFERENCE_SCHEMA_ID;
  schemaVersion: typeof PERSON_REFERENCE_SCHEMA_VERSION;
  OrganizationId: string;
  PersonId: string;
}>;

export type LegacySupportPlanReadReference = PersonRegistryPersonReferenceV1 &
  Readonly<{
    SiteId: string;
  }>;

export type LegacyPersonMappingKey = Readonly<{
  SourceSystem: string;
  OrganizationId: string;
  SourceScope: string;
  LegacyKeyType: string;
  LegacyKeyValue: string;
}>;

export type ReverseLegacyResolution =
  | Readonly<{ status: "FOUND"; MappingKey: LegacyPersonMappingKey }>
  | Readonly<{ status: "NOT_FOUND" }>
  | Readonly<{ status: "CONFLICT" }>;

export interface PersonRegistryReadPort {
  resolveSevereSupportRecipientLegacyKey(
    reference: LegacySupportPlanReadReference,
  ): ReverseLegacyResolution;
}

export function isExactPersonReferenceV1(
  reference: Readonly<{ schemaId: string; schemaVersion: string }>,
): boolean {
  return (
    reference.schemaId === PERSON_REFERENCE_SCHEMA_ID &&
    reference.schemaVersion === PERSON_REFERENCE_SCHEMA_VERSION
  );
}
