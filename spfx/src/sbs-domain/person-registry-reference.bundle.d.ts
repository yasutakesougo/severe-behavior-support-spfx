/**
 * Typings for the esbuild bundle of
 * src/integration/person-registry/person-registry-reference-spfx-entry.ts.
 * This bridge exposes type-only person-registry contracts; it is not an
 * authority provider or registry client.
 */

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
