export const PERSON_SUPPORT_PLAN_MAPPING_CONFIG_SCHEMA_ID =
  "risk02.person-mapping-allowlist" as const;
export const PERSON_SUPPORT_PLAN_MAPPING_CONFIG_SCHEMA_VERSION = "1.0.0" as const;

export type PersonSupportPlanMappingRule = Readonly<{
  sourceSystem: string;
  organizationId: string;
  sourceScope: string;
  legacyKeyType: string;
  siteId: string;
}>;

export type PersonSupportPlanMappingConfiguration = Readonly<{
  schemaId: typeof PERSON_SUPPORT_PLAN_MAPPING_CONFIG_SCHEMA_ID;
  schemaVersion: typeof PERSON_SUPPORT_PLAN_MAPPING_CONFIG_SCHEMA_VERSION;
  rules: readonly PersonSupportPlanMappingRule[];
}>;

/** Parses explicit, environment-injected mapping rules. No wildcard/default values are accepted. */
export function parsePersonSupportPlanMappingConfiguration(
  input: unknown,
): PersonSupportPlanMappingConfiguration | undefined {
  if (!isExactRecord(input, ["schemaId", "schemaVersion", "rules"])) return undefined;
  const config = input as Record<string, unknown>;
  if (
    config.schemaId !== PERSON_SUPPORT_PLAN_MAPPING_CONFIG_SCHEMA_ID ||
    config.schemaVersion !== PERSON_SUPPORT_PLAN_MAPPING_CONFIG_SCHEMA_VERSION ||
    !Array.isArray(config.rules) ||
    config.rules.length === 0
  ) {
    return undefined;
  }

  const rules: PersonSupportPlanMappingRule[] = [];
  const identities = new Set<string>();
  for (const candidate of config.rules) {
    if (
      !isExactRecord(candidate, [
        "sourceSystem",
        "organizationId",
        "sourceScope",
        "legacyKeyType",
        "siteId",
      ])
    ) {
      return undefined;
    }
    const rule = candidate as Record<string, unknown>;
    const values = [
      rule.sourceSystem,
      rule.organizationId,
      rule.sourceScope,
      rule.legacyKeyType,
      rule.siteId,
    ];
    if (
      values.some(
        (value) => typeof value !== "string" || value.trim().length === 0 || value.trim() === "*",
      )
    ) {
      return undefined;
    }
    const identity = JSON.stringify(values);
    if (identities.has(identity)) return undefined;
    identities.add(identity);
    rules.push({
      sourceSystem: values[0] as string,
      organizationId: values[1] as string,
      sourceScope: values[2] as string,
      legacyKeyType: values[3] as string,
      siteId: values[4] as string,
    });
  }

  return Object.freeze({
    schemaId: PERSON_SUPPORT_PLAN_MAPPING_CONFIG_SCHEMA_ID,
    schemaVersion: PERSON_SUPPORT_PLAN_MAPPING_CONFIG_SCHEMA_VERSION,
    rules: Object.freeze(rules.map((rule) => Object.freeze(rule))),
  });
}

function isExactRecord(value: unknown, keys: readonly string[]): value is Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const ownKeys = Reflect.ownKeys(value);
  return (
    ownKeys.every((key) => typeof key === "string") &&
    ownKeys.length === keys.length &&
    keys.every((key) => Object.prototype.hasOwnProperty.call(value, key))
  );
}
