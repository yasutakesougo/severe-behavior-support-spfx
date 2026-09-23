import { buildMonitoringReviewInput } from "./monitoring-review-input";
import type { ReverseLegacyResolution } from "../../sbs-domain/person-registry-reference.bundle";

const QUERY = {
  OrganizationId: "org-001",
  SiteId: "site-001",
  UserId: "user-001",
  planId: "plan-001",
  planVersion: 2,
  periodStart: "2026-08-01T00:00:00+09:00",
  periodEnd: "2026-08-31T23:59:59+09:00",
} as const;

const MODEL = {
  ...QUERY,
  recordCount: 0,
  records: [],
} as const;

const FOUND = {
  status: "FOUND",
  MappingKey: {
    SourceSystem: "synthetic",
    OrganizationId: QUERY.OrganizationId,
    SourceScope: "legacy-scope-not-site-id",
    LegacyKeyType: "UserId",
    LegacyKeyValue: QUERY.UserId,
  },
} as const;

describe("buildMonitoringReviewInput", () => {
  it("resolves only an exact FOUND authority and seven-field monitoring target", () => {
    const result = buildMonitoringReviewInput(FOUND, QUERY, MODEL);

    expect(result).toEqual({
      status: "RESOLVED",
      value: {
        personResolution: FOUND,
        monitoringQuery: QUERY,
        monitoringReadModel: MODEL,
      },
    });
  });

  const insufficientAuthorities: readonly (ReverseLegacyResolution | undefined)[] = [
    undefined,
    { status: "NOT_FOUND" },
    { status: "CONFLICT" },
    {
      ...FOUND,
      MappingKey: { ...FOUND.MappingKey, OrganizationId: "other-org" },
    },
    {
      ...FOUND,
      MappingKey: { ...FOUND.MappingKey, LegacyKeyValue: "other-user" },
    },
  ];

  it.each(insufficientAuthorities)(
    "fails closed for insufficient person authority: %j",
    (authority) => {
      expect(buildMonitoringReviewInput(authority, QUERY, MODEL)).toEqual({
        status: "UNRESOLVED",
      });
    },
  );

  it("does not interpret SourceScope as SiteId", () => {
    const result = buildMonitoringReviewInput(FOUND, QUERY, MODEL);

    expect(result.status).toBe("RESOLVED");
  });

  it.each([
    ["OrganizationId", "other-org"],
    ["SiteId", "other-site"],
    ["UserId", "other-user"],
    ["planId", "other-plan"],
    ["planVersion", 3],
    ["periodStart", "2026-08-02T00:00:00+09:00"],
    ["periodEnd", "2026-09-01T23:59:59+09:00"],
  ] as const)("fails closed when the read model differs on %s", (field, value) => {
    const model = { ...MODEL, [field]: value };

    expect(buildMonitoringReviewInput(FOUND, QUERY, model)).toEqual({
      status: "UNRESOLVED",
    });
  });

  it("fails closed when a required query field is absent or malformed", () => {
    expect(buildMonitoringReviewInput(FOUND, { ...QUERY, planVersion: 0 }, MODEL)).toEqual({
      status: "UNRESOLVED",
    });
    expect(buildMonitoringReviewInput(FOUND, { ...QUERY, periodEnd: undefined }, MODEL)).toEqual({
      status: "UNRESOLVED",
    });
  });

  it.each([
    [
      "query periodStart",
      { ...QUERY, periodStart: "2026-08-01" },
      { ...MODEL, periodStart: "2026-08-01" },
    ],
    [
      "query periodEnd",
      { ...QUERY, periodEnd: "2026-08-31" },
      { ...MODEL, periodEnd: "2026-08-31" },
    ],
    [
      "read model periodStart",
      { ...QUERY, periodStart: "2026-08-01" },
      { ...MODEL, periodStart: "2026-08-01" },
    ],
    [
      "read model periodEnd",
      { ...QUERY, periodEnd: "2026-08-31" },
      { ...MODEL, periodEnd: "2026-08-31" },
    ],
  ] as const)("rejects date-only %s values", (_label, query, model) => {
    expect(buildMonitoringReviewInput(FOUND, query, model)).toEqual({ status: "UNRESOLVED" });
  });

  it.each(["August 1, 2026", "2026-02-30T00:00:00Z", "2026-08-01T25:00:00Z"])(
    "rejects non-canonical or invalid ISO date-time %s",
    (periodStart) => {
      expect(
        buildMonitoringReviewInput(
          FOUND,
          { ...QUERY, periodStart },
          {
            ...MODEL,
            periodStart,
          },
        ),
      ).toEqual({ status: "UNRESOLVED" });
    },
  );

  it("preserves the historical planVersion from the exact read model", () => {
    const result = buildMonitoringReviewInput(FOUND, QUERY, MODEL);

    expect(result.status).toBe("RESOLVED");
    if (result.status === "RESOLVED") {
      expect(result.value.monitoringReadModel.planVersion).toBe(2);
      expect(result.value.monitoringReadModel).not.toHaveProperty("currentVersion");
    }
  });
});
