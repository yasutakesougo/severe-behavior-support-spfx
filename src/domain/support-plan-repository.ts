import type { SupportPlan, SupportPlanVersion } from "./support-plan";

/**
 * Result for Repository Save operations
 */
export type SaveResult<T> =
  | Readonly<{ status: "SUCCESS"; value: T }>
  | Readonly<{ status: "CONFLICT"; reason: "VERSION_CONFLICT" | "ID_REUSED" }>
  | Readonly<{ status: "ERROR"; message: string }>;

/**
 * Result for Repository Lookup operations
 */
export type RepositoryLookupResult<T> =
  | Readonly<{ status: "FOUND"; value: T }>
  | Readonly<{ status: "NOT_FOUND" }>
  | Readonly<{ status: "ERROR"; message: string }>;

/**
 * SupportPlan Repository Port (Pure Interface, no SharePoint REST / PnPjs dependency)
 */
export interface ISupportPlanRepository {
  getById(planId: string): Promise<RepositoryLookupResult<SupportPlan>>;
  findByUser(
    organizationId: string,
    siteId: string,
    userId: string
  ): Promise<readonly SupportPlan[]>;
  findCurrentByUser(
    organizationId: string,
    siteId: string,
    userId: string
  ): Promise<RepositoryLookupResult<SupportPlan>>;
  save(
    plan: SupportPlan,
    expectedVersion: number
  ): Promise<SaveResult<SupportPlan>>;
}

/**
 * SupportPlanVersion Repository Port (Pure Interface, no SharePoint REST / PnPjs dependency)
 */
export interface ISupportPlanVersionRepository {
  getVersion(
    planId: string,
    version: number
  ): Promise<RepositoryLookupResult<SupportPlanVersion>>;
  listVersions(planId: string): Promise<readonly SupportPlanVersion[]>;
  saveVersion(
    versionRecord: SupportPlanVersion
  ): Promise<SaveResult<SupportPlanVersion>>;
}
