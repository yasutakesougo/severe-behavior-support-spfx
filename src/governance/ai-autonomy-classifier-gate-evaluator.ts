export type AutonomyClassification = "L1" | "L2" | "L3" | "UNKNOWN";

export type ChangedAreaCategory =
  | "DOCS_ONLY"
  | "TESTS_ONLY"
  | "SYNTHETIC_FIXTURES_ONLY"
  | "FORMATTING_ONLY"
  | "DETERMINISTIC_GENERATED_ARTIFACTS"
  | "NON_BEHAVIORAL_CSS_ONLY"
  | "DETERMINISTIC_BUILD_BRIDGE_EVIDENCE"
  | "APPLICATION_BEHAVIOR"
  | "DOMAIN_LOGIC"
  | "BUSINESS_RULES"
  | "UI_BEHAVIOR"
  | "PERSISTENCE_BEHAVIOR"
  | "READ_MODEL_BEHAVIOR"
  | "ADAPTER_BEHAVIOR"
  | "TRANSPORT_BEHAVIOR"
  | "RUNTIME_CONFIGURATION_BEHAVIOR"
  | "CONTRACT_SCHEMA_SEMANTICS"
  | "DEPLOY_RELEASE_CAPABILITY"
  | "APP_CATALOG_MUTATION"
  | "SHAREPOINT_PROVISIONING"
  | "SHAREPOINT_SCHEMA_MUTATION"
  | "SHAREPOINT_WRITE"
  | "LIVE_WRITE_CREATE"
  | "PRODUCTION_BINDING"
  | "PERMISSION_EXPANSION"
  | "AUTHORIZATION_POLICY_CHANGE"
  | "M365_MUTATION"
  | "ENTRA_MUTATION"
  | "SECRET_CREDENTIAL_EXPANSION"
  | "WORKFLOW_PERMISSION_EXPANSION"
  | "DESTRUCTIVE_OPERATION"
  | "ROLLBACK_CAPABILITY_REMOVAL"
  | "POLICY_REQUIREMENT_ACCEPTANCE_AUTHORITY_CHANGE";

export type ProductionCapability =
  | "DEPLOY"
  | "APP_CATALOG_MUTATION"
  | "SHAREPOINT_PROVISION"
  | "SHAREPOINT_SCHEMA_MUTATION"
  | "SHAREPOINT_CREATE"
  | "SHAREPOINT_UPDATE"
  | "SHAREPOINT_DELETE"
  | "LIVE_WRITE"
  | "LIVE_CREATE"
  | "PRODUCTION_BINDING"
  | "M365_MUTATION"
  | "ENTRA_MUTATION"
  | "PERMISSION_EXPANSION"
  | "SECRET_OR_CREDENTIAL_USE_EXPANSION"
  | "WORKFLOW_PERMISSION_ESCALATION"
  | "DESTRUCTIVE_OPERATION";

export type ProductionCapabilityDelta =
  | Readonly<{ status: "NONE" }>
  | Readonly<{ status: "PRESENT"; capabilities: readonly ProductionCapability[] }>
  | Readonly<{ status: "UNKNOWN" }>;

export type ChangedFileEvidence = Readonly<{
  path: string;
  patch: string | null;
}>;

export type ClassificationReason =
  | "L1_ALLOWLIST_ONLY"
  | "L2_BEHAVIORAL_CHANGE"
  | "L3_HIGH_RISK_CHANGE"
  | "PRODUCTION_CAPABILITY_DELTA_PRESENT"
  | "PRODUCTION_CAPABILITY_DELTA_UNKNOWN"
  | "CLASSIFICATION_EVIDENCE_MISSING"
  | "DIFF_UNAVAILABLE"
  | "CHANGED_AREA_UNRESOLVED"
  | "UNSTATED_SEMANTICS_REQUIRED"
  | "L1_NOT_POSITIVELY_PROVEN";

export type AutonomyClassifierInput = Readonly<{
  changedFiles: readonly ChangedFileEvidence[];
  classificationEvidenceAvailable: boolean;
  changedAreaCategories: readonly ChangedAreaCategory[];
  requiresUnstatedSemantics?: boolean;
  productionCapabilityDelta: ProductionCapabilityDelta;
}>;

export type AutonomyClassificationResult = Readonly<{
  classification: AutonomyClassification;
  reasons: readonly ClassificationReason[];
}>;

const L1_CATEGORIES = new Set<ChangedAreaCategory>([
  "DOCS_ONLY",
  "TESTS_ONLY",
  "SYNTHETIC_FIXTURES_ONLY",
  "FORMATTING_ONLY",
  "DETERMINISTIC_GENERATED_ARTIFACTS",
  "NON_BEHAVIORAL_CSS_ONLY",
  "DETERMINISTIC_BUILD_BRIDGE_EVIDENCE",
]);

const L2_CATEGORIES = new Set<ChangedAreaCategory>([
  "APPLICATION_BEHAVIOR",
  "DOMAIN_LOGIC",
  "BUSINESS_RULES",
  "UI_BEHAVIOR",
  "PERSISTENCE_BEHAVIOR",
  "READ_MODEL_BEHAVIOR",
  "ADAPTER_BEHAVIOR",
  "TRANSPORT_BEHAVIOR",
  "RUNTIME_CONFIGURATION_BEHAVIOR",
  "CONTRACT_SCHEMA_SEMANTICS",
]);

const L3_CATEGORIES = new Set<ChangedAreaCategory>([
  "DEPLOY_RELEASE_CAPABILITY",
  "APP_CATALOG_MUTATION",
  "SHAREPOINT_PROVISIONING",
  "SHAREPOINT_SCHEMA_MUTATION",
  "SHAREPOINT_WRITE",
  "LIVE_WRITE_CREATE",
  "PRODUCTION_BINDING",
  "PERMISSION_EXPANSION",
  "AUTHORIZATION_POLICY_CHANGE",
  "M365_MUTATION",
  "ENTRA_MUTATION",
  "SECRET_CREDENTIAL_EXPANSION",
  "WORKFLOW_PERMISSION_EXPANSION",
  "DESTRUCTIVE_OPERATION",
  "ROLLBACK_CAPABILITY_REMOVAL",
  "POLICY_REQUIREMENT_ACCEPTANCE_AUTHORITY_CHANGE",
]);

function normalizePath(path: string): string {
  return path.replaceAll("\\", "/").replace(/^\.\//, "");
}

function pathRisk(path: string): AutonomyClassification {
  const normalized = normalizePath(path);

  if (
    normalized.startsWith(".github/workflows/") ||
    normalized.startsWith("config/package-solution") ||
    normalized.startsWith("spfx/config/package-solution") ||
    normalized.includes("deploy") ||
    normalized.includes("provision") ||
    normalized.includes("permission") ||
    normalized.includes("production-binding") ||
    normalized.includes("app-catalog")
  ) {
    return "L3";
  }

  if (
    normalized.startsWith("src/") ||
    normalized.startsWith("spfx/src/") ||
    normalized.startsWith("scripts/") ||
    normalized.endsWith("package.json") ||
    normalized.endsWith("package-lock.json") ||
    normalized.endsWith("tsconfig.json")
  ) {
    return "L2";
  }

  if (
    normalized.startsWith("docs/") ||
    normalized === "README.md" ||
    normalized.startsWith("tests/") ||
    normalized.startsWith("fixtures/") ||
    normalized.includes("/fixtures/")
  ) {
    return "L1";
  }

  return "UNKNOWN";
}

function allDiffsAvailable(changedFiles: readonly ChangedFileEvidence[]): boolean {
  return changedFiles.length > 0 && changedFiles.every((file) => file.patch !== null);
}

function classifyFromFiles(changedFiles: readonly ChangedFileEvidence[]): AutonomyClassification {
  const risks = changedFiles.map((file) => pathRisk(file.path));
  if (risks.includes("L3")) return "L3";
  if (risks.includes("L2")) return "L2";
  if (risks.includes("UNKNOWN")) return "UNKNOWN";
  return risks.length > 0 ? "L1" : "UNKNOWN";
}

export function classifyAutonomyChange(
  input: AutonomyClassifierInput,
): AutonomyClassificationResult {
  if (!input.classificationEvidenceAvailable) {
    return { classification: "UNKNOWN", reasons: ["CLASSIFICATION_EVIDENCE_MISSING"] };
  }

  if (!allDiffsAvailable(input.changedFiles)) {
    return { classification: "UNKNOWN", reasons: ["DIFF_UNAVAILABLE"] };
  }

  if (input.requiresUnstatedSemantics === true) {
    return { classification: "UNKNOWN", reasons: ["UNSTATED_SEMANTICS_REQUIRED"] };
  }

  if (input.productionCapabilityDelta.status === "UNKNOWN") {
    return { classification: "UNKNOWN", reasons: ["PRODUCTION_CAPABILITY_DELTA_UNKNOWN"] };
  }

  if (input.productionCapabilityDelta.status === "PRESENT") {
    return { classification: "L3", reasons: ["PRODUCTION_CAPABILITY_DELTA_PRESENT"] };
  }

  if (input.changedAreaCategories.length === 0 || input.changedFiles.length === 0) {
    return { classification: "UNKNOWN", reasons: ["CHANGED_AREA_UNRESOLVED"] };
  }

  const fileClassification = classifyFromFiles(input.changedFiles);
  const hasL3Category = input.changedAreaCategories.some((category) => L3_CATEGORIES.has(category));
  const hasL2Category = input.changedAreaCategories.some((category) => L2_CATEGORIES.has(category));
  const allL1Categories = input.changedAreaCategories.every((category) => L1_CATEGORIES.has(category));

  if (fileClassification === "L3" || hasL3Category) {
    return { classification: "L3", reasons: ["L3_HIGH_RISK_CHANGE"] };
  }

  if (fileClassification === "L2" || hasL2Category) {
    return { classification: "L2", reasons: ["L2_BEHAVIORAL_CHANGE"] };
  }

  if (fileClassification === "UNKNOWN") {
    return { classification: "UNKNOWN", reasons: ["CHANGED_AREA_UNRESOLVED"] };
  }

  if (fileClassification === "L1" && allL1Categories) {
    return { classification: "L1", reasons: ["L1_ALLOWLIST_ONLY"] };
  }

  return { classification: "UNKNOWN", reasons: ["L1_NOT_POSITIVELY_PROVEN"] };
}

export type EvidenceStatus =
  | "PASS"
  | "FAIL"
  | "MISSING"
  | "STALE"
  | "UNPARSEABLE"
  | "INDETERMINATE";

export type HeadBoundEvidence = Readonly<{
  status: EvidenceStatus;
  headSha?: string;
}>;

export type ReviewEvidence = Readonly<{
  status: EvidenceStatus;
  headSha?: string;
  p0: number;
  p1: number;
}>;

export type RollbackEvidence = Readonly<{
  status: EvidenceStatus;
  headSha?: string;
  fullyRepresentedInGit: boolean;
  externalMutationOccurred: boolean;
  irreversibleSideEffectOccurred: boolean;
  previousRepositoryStateRecoverable: boolean;
}>;

export type GateEvidenceBundle = Readonly<{
  scope: HeadBoundEvidence;
  ci: HeadBoundEvidence;
  tests: HeadBoundEvidence;
  contracts: HeadBoundEvidence;
  review: ReviewEvidence;
  prohibitedPathCheck: HeadBoundEvidence;
  rollbackEvidence: RollbackEvidence;
}>;

export type GateReasonCode =
  | "CLASS_L2"
  | "CLASS_L3"
  | "CLASS_UNKNOWN"
  | "SCOPE_NOT_VERIFIED"
  | "CI_NOT_GREEN"
  | "TESTS_NOT_GREEN"
  | "CONTRACTS_NOT_GREEN"
  | "REVIEW_NOT_CLEARED"
  | "P0_PRESENT"
  | "P1_PRESENT"
  | "HEAD_EVIDENCE_MISMATCH"
  | "EVIDENCE_MISSING"
  | "EVIDENCE_STALE"
  | "EVIDENCE_UNPARSEABLE"
  | "EVIDENCE_INDETERMINATE"
  | "PROHIBITED_PATH_CHECK_NOT_GREEN"
  | "PRODUCTION_CAPABILITY_DELTA_PRESENT"
  | "PRODUCTION_CAPABILITY_DELTA_UNKNOWN"
  | "ROLLBACK_UNAVAILABLE";

export type GateEvaluatorInput = Readonly<{
  classification: AutonomyClassification;
  currentHeadSha: string;
  evidence: GateEvidenceBundle;
  productionCapabilityDelta: ProductionCapabilityDelta;
}>;

export type GateEvaluationResult = Readonly<{
  autonomyEligible: boolean;
  reasons: readonly GateReasonCode[];
}>;

function collectEvidenceStateReasons(evidence: readonly HeadBoundEvidence[]): GateReasonCode[] {
  const reasons: GateReasonCode[] = [];
  for (const item of evidence) {
    if (item.status === "MISSING") reasons.push("EVIDENCE_MISSING");
    if (item.status === "STALE") reasons.push("EVIDENCE_STALE");
    if (item.status === "UNPARSEABLE") reasons.push("EVIDENCE_UNPARSEABLE");
    if (item.status === "INDETERMINATE") reasons.push("EVIDENCE_INDETERMINATE");
  }
  return reasons;
}

function rollbackIsAvailable(evidence: RollbackEvidence): boolean {
  return (
    evidence.status === "PASS" &&
    evidence.fullyRepresentedInGit &&
    !evidence.externalMutationOccurred &&
    !evidence.irreversibleSideEffectOccurred &&
    evidence.previousRepositoryStateRecoverable
  );
}

export function evaluateAutonomyGate(input: GateEvaluatorInput): GateEvaluationResult {
  const reasons: GateReasonCode[] = [];

  if (input.classification === "L2") reasons.push("CLASS_L2");
  if (input.classification === "L3") reasons.push("CLASS_L3");
  if (input.classification === "UNKNOWN") reasons.push("CLASS_UNKNOWN");

  const headBoundEvidence: readonly HeadBoundEvidence[] = [
    input.evidence.scope,
    input.evidence.ci,
    input.evidence.tests,
    input.evidence.contracts,
    input.evidence.review,
    input.evidence.prohibitedPathCheck,
    input.evidence.rollbackEvidence,
  ];

  reasons.push(...collectEvidenceStateReasons(headBoundEvidence));

  if (input.evidence.scope.status !== "PASS") reasons.push("SCOPE_NOT_VERIFIED");
  if (input.evidence.ci.status !== "PASS") reasons.push("CI_NOT_GREEN");
  if (input.evidence.tests.status !== "PASS") reasons.push("TESTS_NOT_GREEN");
  if (input.evidence.contracts.status !== "PASS") reasons.push("CONTRACTS_NOT_GREEN");
  if (input.evidence.review.status !== "PASS") reasons.push("REVIEW_NOT_CLEARED");
  if (input.evidence.review.p0 > 0) reasons.push("P0_PRESENT");
  if (input.evidence.review.p1 > 0) reasons.push("P1_PRESENT");
  if (input.evidence.prohibitedPathCheck.status !== "PASS") {
    reasons.push("PROHIBITED_PATH_CHECK_NOT_GREEN");
  }

  if (
    headBoundEvidence.some(
      (evidence) => evidence.headSha === undefined || evidence.headSha !== input.currentHeadSha,
    )
  ) {
    reasons.push("HEAD_EVIDENCE_MISMATCH");
  }

  if (input.productionCapabilityDelta.status === "PRESENT") {
    reasons.push("PRODUCTION_CAPABILITY_DELTA_PRESENT");
  }
  if (input.productionCapabilityDelta.status === "UNKNOWN") {
    reasons.push("PRODUCTION_CAPABILITY_DELTA_UNKNOWN");
  }

  if (!rollbackIsAvailable(input.evidence.rollbackEvidence)) {
    reasons.push("ROLLBACK_UNAVAILABLE");
  }

  const uniqueReasons = [...new Set(reasons)];
  return {
    autonomyEligible: input.classification === "L1" && uniqueReasons.length === 0,
    reasons: uniqueReasons,
  };
}
