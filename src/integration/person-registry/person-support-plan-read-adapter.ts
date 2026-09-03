import type { SupportPlan } from "../../domain/support-plan";
import type { ISupportPlanRepository } from "../../domain/support-plan-repository";
import { isExactPersonReferenceV1 } from "./person-registry-reference";
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
): Promise<PersonSupportPlanReadResult> {
  if (!isExactPersonReferenceV1(reference)) {
    return { status: "ERROR", reasonCode: "PERSON_REFERENCE_CONTRACT_MISMATCH" };
  }

  const mapping = personRegistry.resolveSevereSupportRecipientLegacyKey(reference);

  if (mapping.status === "NOT_FOUND") return { status: "NOT_FOUND" };
  if (mapping.status === "CONFLICT") return { status: "CONFLICT" };

  return supportPlanRepository.findByUser(
    reference.OrganizationId,
    reference.SiteId,
    mapping.MappingKey.LegacyKeyValue,
  );
}
