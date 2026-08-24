const MUTATING_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE", "MERGE"]);

export const NO_LIVE_WRITE_CHECK_ID = "application-data-mutation-none";

const AUTHENTICATION_HOSTS = new Set([
  "login.microsoftonline.com",
  "login.live.com",
  "accounts.google.com",
]);

const TELEMETRY_HOSTS = new Set([
  "browser.events.data.microsoft.com",
  "dc.services.visualstudio.com",
  "www.google-analytics.com",
  "analytics.google.com",
]);

function isLocalHost(hostname) {
  return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "[::1]";
}

function isMutationMethod(method) {
  return MUTATING_METHODS.has(method);
}

function isSharePointListItemPath(pathname) {
  return /\/\_api\/web\/lists(?:\([^)]*\)|\/GetByTitle\([^)]*\))\/items(?:\([^)]*\))?$/i.test(
    pathname,
  );
}

function isGraphApplicationDataPath(pathname) {
  return /\/v\d+\.\d+\/(?:sites|drives|lists|users|groups)\//i.test(pathname);
}

function isSharePointFrameworkPath(pathname) {
  return /(?:^|\/)\_api\/(?:contextinfo|web|site)(?:\/|$)/i.test(pathname);
}

function normalizeConfiguredPaths(paths) {
  return new Set(
    (Array.isArray(paths) ? paths : [])
      .map((value) => String(value).trim())
      .filter((value) => value.startsWith("/")),
  );
}

function safeUrlParts(rawUrl) {
  try {
    const parsed = new URL(rawUrl);
    return {
      origin: parsed.origin,
      pathname: parsed.pathname,
      hostname: parsed.hostname.toLowerCase(),
    };
  } catch {
    return {
      origin: "unknown",
      pathname: "unknown",
      hostname: "unknown",
    };
  }
}

/**
 * Classifies browser traffic without retaining query strings, headers, or bodies.
 * Known application-data writes are identified by target and purpose. Unknown
 * non-local mutation traffic remains a separate fail-closed risk so it is not
 * mislabeled as an application-data write.
 */
export function classifyBrowserRequest(request, options = {}) {
  const method = String(request.method?.() ?? "GET").toUpperCase();
  const resourceType = String(request.resourceType?.() ?? "unknown");
  const { origin, pathname, hostname } = safeUrlParts(String(request.url?.() ?? ""));
  const local = isLocalHost(hostname);
  const configuredPersistencePaths = normalizeConfiguredPaths(options.persistencePaths);
  const target = local
    ? "local-harness"
    : hostname.includes("graph.microsoft.com")
      ? "graph"
      : hostname.includes("sharepoint.com") || pathname.toLowerCase().includes("/_api/")
        ? "sharepoint"
        : "external";
  const authenticationTraffic = AUTHENTICATION_HOSTS.has(hostname);
  const telemetryTraffic =
    TELEMETRY_HOSTS.has(hostname) || resourceType === "ping" || resourceType === "beacon";
  const sharePointFrameworkTraffic = target === "sharepoint" && isSharePointFrameworkPath(pathname);
  const configuredPersistenceWrite = configuredPersistencePaths.has(pathname);
  const applicationDataMutationCandidate =
    isMutationMethod(method) &&
    !local &&
    ((target === "sharepoint" && isSharePointListItemPath(pathname)) ||
      (target === "graph" && isGraphApplicationDataPath(pathname)) ||
      configuredPersistenceWrite);
  const knownNonApplicationTraffic =
    local || authenticationTraffic || telemetryTraffic || sharePointFrameworkTraffic;
  const unknownMutationRisk =
    isMutationMethod(method) &&
    !local &&
    !applicationDataMutationCandidate &&
    !knownNonApplicationTraffic;
  const purpose = local
    ? "local-harness"
    : applicationDataMutationCandidate
      ? "application-data-mutation"
      : authenticationTraffic
        ? "authentication"
        : telemetryTraffic
          ? "telemetry"
          : sharePointFrameworkTraffic
            ? "sharepoint-framework"
            : unknownMutationRisk
              ? "unknown-nonlocal-mutation"
              : target === "external"
                ? "non-local-read-or-framework"
                : "host-or-framework-read";

  return {
    origin,
    pathname,
    method,
    resourceType,
    target,
    purpose,
    applicationDataMutationCandidate,
    unknownMutationRisk,
  };
}

export function createBrowserNetworkEvidenceCollector(options = {}) {
  const requests = [];
  const persistencePaths = normalizeConfiguredPaths(options.persistencePaths);

  return {
    attach(page) {
      if (!page || typeof page.on !== "function") {
        throw new TypeError("A Puppeteer page is required");
      }
      page.on("request", (request) => {
        requests.push(classifyBrowserRequest(request, { persistencePaths }));
      });
    },

    snapshot() {
      const applicationDataMutationRequests = requests.filter(
        (request) => request.applicationDataMutationCandidate,
      );
      const unknownMutationRiskRequests = requests.filter(
        (request) => request.unknownMutationRisk,
      );
      return {
        requestCount: requests.length,
        requests: [...requests],
        applicationDataMutationRequests,
        unknownMutationRiskRequests,
        noLiveWriteProof:
          applicationDataMutationRequests.length === 0 && unknownMutationRiskRequests.length === 0,
      };
    },
  };
}
