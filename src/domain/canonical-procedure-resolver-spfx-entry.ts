/**
 * SPFx Narrow Bridge entrypoint for Canonical Procedure Resolver (A2 / W2-A).
 * Bundles pure domain logic into SPFx sbs-domain artifact.
 */
export {
  CANONICAL_PROCEDURE_RESOLVER_SCHEMA_ID,
  CANONICAL_PROCEDURE_RESOLVER_SCHEMA_VERSION,
  type CanonicalProcedureProjection,
  type CanonicalProcedureResolutionQuery,
  type CanonicalProcedureCatalogEntry,
  type CanonicalProcedureUnresolvedReasonCode,
  type CanonicalProcedureResolutionOutcome,
  validateCanonicalProcedureResolutionQuery,
  validateCanonicalProcedureCatalogEntry,
  buildCanonicalProcedureCatalogEntry,
  resolveCanonicalProcedure,
  resolveCanonicalProcedureFromEntities,
} from "./canonical-procedure-resolver";
