import type { SupportPlan, SupportPlanVersion } from "./support-plan";

/**
 * Scope shared by a plan header and its immutable versions.
 * The repository must compare all three fields exactly; planId is not globally unique.
 */
export type SupportPlanScope = Readonly<{
  organizationId: string;
  siteId: string;
  userId: string;
}>;

export type SupportPlanIdentity = SupportPlanScope &
  Readonly<{
    planId: string;
  }>;

export type SupportPlanVersionIdentity = SupportPlanIdentity &
  Readonly<{
    version: number;
  }>;

/**
 * Result for Repository Save operations
 */
export type SaveResult<T> =
  | Readonly<{ status: "SUCCESS"; value: T }>
  | Readonly<{ status: "CONFLICT"; reasonCode: string }>
  | Readonly<{ status: "ERROR"; reasonCode: string }>;

/**
 * Result for Repository Lookup operations
 */
export type RepositoryLookupResult<T> =
  | Readonly<{ status: "FOUND"; value: T }>
  | Readonly<{ status: "NOT_FOUND" }>
  | Readonly<{ status: "ERROR"; reasonCode: string }>;

/**
 * Result for Repository List operations
 */
export type RepositoryListResult<T> =
  | Readonly<{ status: "SUCCESS"; values: readonly T[] }>
  | Readonly<{ status: "ERROR"; reasonCode: string }>;

/**
 * SupportPlan Repository Port (Pure Interface, no SharePoint REST / PnPjs dependency)
 */
export interface ISupportPlanRepository {
  getById(identity: SupportPlanIdentity): Promise<RepositoryLookupResult<SupportPlan>>;
  findByUser(scope: SupportPlanScope): Promise<RepositoryListResult<SupportPlan>>;
  findCurrentByUser(scope: SupportPlanScope): Promise<RepositoryLookupResult<SupportPlan>>;
  save(plan: SupportPlan, expectedVersion: number): Promise<SaveResult<SupportPlan>>;
}

/**
 * SupportPlanVersion Repository Port (Pure Interface, no SharePoint REST / PnPjs dependency)
 */
export interface ISupportPlanVersionRepository {
  getVersion(
    identity: SupportPlanVersionIdentity,
  ): Promise<RepositoryLookupResult<SupportPlanVersion>>;
  listVersions(identity: SupportPlanIdentity): Promise<RepositoryListResult<SupportPlanVersion>>;
  saveVersion(versionRecord: SupportPlanVersion): Promise<SaveResult<SupportPlanVersion>>;
}
