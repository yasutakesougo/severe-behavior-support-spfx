import type { SupportPlan, SupportPlanVersion } from "../domain/support-plan";
import type {
  ISupportPlanRepository,
  ISupportPlanVersionRepository,
  RepositoryListResult,
  RepositoryLookupResult,
  SaveResult,
  SupportPlanIdentity,
  SupportPlanScope,
  SupportPlanVersionIdentity,
} from "../domain/support-plan-repository";
import { cloneJsonValue, storeJsonSnapshot } from "../domain/json-snapshot";

export type SyntheticSupportPlanRepositorySeed = Readonly<{
  plans?: readonly SupportPlan[];
  versions?: readonly SupportPlanVersion[];
}>;

/**
 * In-memory contract adapter for tests and synthetic scenarios only.
 * It has no external I/O and is not registered by any production composition root.
 */
export class SyntheticSupportPlanRepository
  implements ISupportPlanRepository, ISupportPlanVersionRepository
{
  private readonly plans: SupportPlan[];
  private readonly versions: SupportPlanVersion[];

  public constructor(seed: SyntheticSupportPlanRepositorySeed = {}) {
    this.plans = (seed.plans ?? []).map((plan) => storeJsonSnapshot(plan));
    this.versions = (seed.versions ?? []).map((version) => storeJsonSnapshot(version));
  }

  public async getById(
    identity: SupportPlanIdentity,
  ): Promise<RepositoryLookupResult<SupportPlan>> {
    if (!isValidPlanIdentity(identity))
      return { status: "ERROR", reasonCode: "INVALID_PLAN_IDENTITY" };
    const matches = this.plans.filter((plan) => planMatchesIdentity(plan, identity));
    if (matches.length > 1) return { status: "ERROR", reasonCode: "AMBIGUOUS_MATCH" };
    if (matches.length === 0) return { status: "NOT_FOUND" };
    return { status: "FOUND", value: cloneJsonValue(matches[0]) };
  }

  public async findByUser(scope: SupportPlanScope): Promise<RepositoryListResult<SupportPlan>> {
    if (!isValidScope(scope)) return { status: "ERROR", reasonCode: "INVALID_SCOPE" };
    const values = this.plans.filter((plan) => planMatchesScope(plan, scope));
    if (hasDuplicate(values, (plan) => plan.PlanId)) {
      return { status: "ERROR", reasonCode: "AMBIGUOUS_PLAN_IDENTITY" };
    }
    return {
      status: "SUCCESS",
      values: values.map((plan) => cloneJsonValue(plan)),
    };
  }

  public async findCurrentByUser(
    scope: SupportPlanScope,
  ): Promise<RepositoryLookupResult<SupportPlan>> {
    if (!isValidScope(scope)) return { status: "ERROR", reasonCode: "INVALID_SCOPE" };
    const matches = this.plans.filter(
      (plan) => planMatchesScope(plan, scope) && plan.status === "Active",
    );
    if (matches.length > 1) return { status: "ERROR", reasonCode: "AMBIGUOUS_MATCH" };
    if (matches.length === 0) return { status: "NOT_FOUND" };
    return { status: "FOUND", value: cloneJsonValue(matches[0]) };
  }

  public async save(plan: SupportPlan, expectedVersion: number): Promise<SaveResult<SupportPlan>> {
    const identity: SupportPlanIdentity = {
      organizationId: plan.OrganizationId,
      siteId: plan.SiteId,
      userId: plan.UserId,
      planId: plan.PlanId,
    };
    if (
      !isValidPlanIdentity(identity) ||
      !Number.isSafeInteger(expectedVersion) ||
      expectedVersion < 0
    ) {
      return { status: "ERROR", reasonCode: "INVALID_PLAN_IDENTITY_OR_EXPECTED_VERSION" };
    }
    const matches = this.plans.filter((candidate) => planMatchesIdentity(candidate, identity));
    if (matches.length > 1) return { status: "ERROR", reasonCode: "AMBIGUOUS_MATCH" };

    if (matches.length === 0) {
      if (expectedVersion !== 0) return { status: "CONFLICT", reasonCode: "PLAN_NOT_FOUND" };
      const stored = storeJsonSnapshot(plan);
      this.plans.push(stored);
      return { status: "SUCCESS", value: cloneJsonValue(stored) };
    }

    const current = matches[0];
    if (current.version !== expectedVersion) {
      return { status: "CONFLICT", reasonCode: "VERSION_MISMATCH" };
    }

    const index = this.plans.indexOf(current);
    const stored = storeJsonSnapshot(plan);
    this.plans[index] = stored;
    return { status: "SUCCESS", value: cloneJsonValue(stored) };
  }

  public async getVersion(
    identity: SupportPlanVersionIdentity,
  ): Promise<RepositoryLookupResult<SupportPlanVersion>> {
    if (!isValidVersionIdentity(identity)) {
      return { status: "ERROR", reasonCode: "INVALID_VERSION_IDENTITY" };
    }
    const matches = this.versions.filter((version) => versionMatchesIdentity(version, identity));
    if (matches.length > 1) return { status: "ERROR", reasonCode: "AMBIGUOUS_MATCH" };
    if (matches.length === 0) return { status: "NOT_FOUND" };
    return { status: "FOUND", value: cloneJsonValue(matches[0]) };
  }

  public async listVersions(
    identity: SupportPlanIdentity,
  ): Promise<RepositoryListResult<SupportPlanVersion>> {
    if (!isValidPlanIdentity(identity))
      return { status: "ERROR", reasonCode: "INVALID_PLAN_IDENTITY" };
    const values = this.versions
      .filter((version) => versionMatchesIdentity(version, identity))
      .sort((left, right) => left.version - right.version);
    if (hasDuplicate(values, (version) => String(version.version))) {
      return { status: "ERROR", reasonCode: "AMBIGUOUS_VERSION_IDENTITY" };
    }
    return { status: "SUCCESS", values: values.map((version) => cloneJsonValue(version)) };
  }

  public async saveVersion(
    versionRecord: SupportPlanVersion,
  ): Promise<SaveResult<SupportPlanVersion>> {
    const identity: SupportPlanVersionIdentity = {
      organizationId: versionRecord.OrganizationId,
      siteId: versionRecord.SiteId,
      userId: versionRecord.UserId,
      planId: versionRecord.planId,
      version: versionRecord.version,
    };
    if (!isValidVersionIdentity(identity)) {
      return { status: "ERROR", reasonCode: "INVALID_VERSION_IDENTITY" };
    }
    const matches = this.versions.filter((version) => versionMatchesIdentity(version, identity));
    if (matches.length > 1) return { status: "ERROR", reasonCode: "AMBIGUOUS_MATCH" };
    if (matches.length === 1) return { status: "CONFLICT", reasonCode: "VERSION_ALREADY_EXISTS" };

    const stored = storeJsonSnapshot(versionRecord);
    this.versions.push(stored);
    return { status: "SUCCESS", value: cloneJsonValue(stored) };
  }
}

function planMatchesScope(plan: SupportPlan, scope: SupportPlanScope): boolean {
  return (
    plan.OrganizationId === scope.organizationId &&
    plan.SiteId === scope.siteId &&
    plan.UserId === scope.userId
  );
}

function planMatchesIdentity(plan: SupportPlan, identity: SupportPlanIdentity): boolean {
  return planMatchesScope(plan, identity) && plan.PlanId === identity.planId;
}

function versionMatchesIdentity(
  version: SupportPlanVersion,
  identity: SupportPlanIdentity | SupportPlanVersionIdentity,
): boolean {
  return (
    version.OrganizationId === identity.organizationId &&
    version.SiteId === identity.siteId &&
    version.UserId === identity.userId &&
    version.planId === identity.planId &&
    (!("version" in identity) || version.version === identity.version)
  );
}

function isValidVersionIdentity(identity: SupportPlanVersionIdentity): boolean {
  return (
    isValidPlanIdentity(identity) && Number.isSafeInteger(identity.version) && identity.version > 0
  );
}

function isValidScope(scope: SupportPlanScope): boolean {
  return [scope.organizationId, scope.siteId, scope.userId].every(
    (value) => typeof value === "string" && value.length > 0,
  );
}

function isValidPlanIdentity(identity: SupportPlanIdentity): boolean {
  return (
    isValidScope(identity) && typeof identity.planId === "string" && identity.planId.length > 0
  );
}

function hasDuplicate<T>(values: readonly T[], getIdentity: (value: T) => string): boolean {
  const seen = new Set<string>();
  for (const value of values) {
    const identity = getIdentity(value);
    if (seen.has(identity)) return true;
    seen.add(identity);
  }
  return false;
}
