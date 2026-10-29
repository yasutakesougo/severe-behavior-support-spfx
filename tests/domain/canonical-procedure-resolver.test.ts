import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  resolveCanonicalProcedure,
  resolveCanonicalProcedureFromEntities,
  buildCanonicalProcedureCatalogEntry,
  validateCanonicalProcedureResolutionQuery,
  validateCanonicalProcedureCatalogEntry,
  type CanonicalProcedureCatalogEntry,
  type CanonicalProcedureResolutionQuery,
} from "../../src/domain/canonical-procedure-resolver";
import type { ApprovedProcedureReference } from "../../src/contracts/types";
import type { SupportPlanVersionProcedureBinding } from "../../src/domain/support-plan-version-procedure-binding";
import {
  FIXTURE_ORG_ID,
  FIXTURE_SITE_ID,
  FIXTURE_USER_ID_A,
  FIXTURE_USER_ID_B,
  FIXTURE_PLAN_ID_A,
  FIXTURE_PLAN_VERSION_2,
  FIXTURE_PLAN_VERSION_3,
  FIXTURE_PROCEDURE_REF_LUNCH_V3,
  FIXTURE_PROCEDURE_REF_REST_V3,
  FIXTURE_PLAN_VERSION_A_V3,
  FIXTURE_BINDING_LUNCH_V3,
  FIXTURE_SCHEDULE_ITEM_LUNCH,
  FIXTURE_OCCURRENCE_LUNCH,
  FIXTURE_CATALOG_ENTRY_LUNCH_V3,
  FIXTURE_QUERY_LUNCH_V3_VALID,
} from "./canonical-procedure-resolver-fixtures";

describe("SBS-U6-B W1 Pure Canonical Procedure Resolver", () => {
  describe("Rule 1: OrganizationId, SiteId, UserId exact match", () => {
    it("resolves procedure when Org, Site, and User match exactly", () => {
      const outcome = resolveCanonicalProcedure(FIXTURE_QUERY_LUNCH_V3_VALID, [
        FIXTURE_CATALOG_ENTRY_LUNCH_V3,
      ]);

      assert.equal(outcome.status, "RESOLVED");
      if (outcome.status === "RESOLVED") {
        assert.equal(outcome.projection.sceneLabel, "昼食準備（12:00）");
        assert.equal(outcome.canStartProcedureRecord, false);
      }
    });

    it("fails closed with USER_OR_SITE_MISMATCH when OrganizationId differs", () => {
      const query: CanonicalProcedureResolutionQuery = {
        ...FIXTURE_QUERY_LUNCH_V3_VALID,
        organizationId: "other-org",
      };
      const outcome = resolveCanonicalProcedure(query, [FIXTURE_CATALOG_ENTRY_LUNCH_V3]);

      assert.equal(outcome.status, "UNRESOLVED");
      if (outcome.status === "UNRESOLVED") {
        assert.equal(outcome.reasonCode, "USER_OR_SITE_MISMATCH");
      }
    });

    it("fails closed with USER_OR_SITE_MISMATCH when SiteId differs", () => {
      const query: CanonicalProcedureResolutionQuery = {
        ...FIXTURE_QUERY_LUNCH_V3_VALID,
        siteId: "site-honmoku",
      };
      const outcome = resolveCanonicalProcedure(query, [FIXTURE_CATALOG_ENTRY_LUNCH_V3]);

      assert.equal(outcome.status, "UNRESOLVED");
      if (outcome.status === "UNRESOLVED") {
        assert.equal(outcome.reasonCode, "USER_OR_SITE_MISMATCH");
      }
    });

    it("fails closed with USER_OR_SITE_MISMATCH when UserId differs", () => {
      const query: CanonicalProcedureResolutionQuery = {
        ...FIXTURE_QUERY_LUNCH_V3_VALID,
        userId: FIXTURE_USER_ID_B,
      };
      const outcome = resolveCanonicalProcedure(query, [FIXTURE_CATALOG_ENTRY_LUNCH_V3]);

      assert.equal(outcome.status, "UNRESOLVED");
      if (outcome.status === "UNRESOLVED") {
        assert.equal(outcome.reasonCode, "USER_OR_SITE_MISMATCH");
      }
    });
  });

  describe("Rule 2: planId, planVersion exact match", () => {
    it("fails closed with CATALOG_ENTRY_NOT_FOUND when planId differs", () => {
      const query: CanonicalProcedureResolutionQuery = {
        ...FIXTURE_QUERY_LUNCH_V3_VALID,
        planId: "plan-other-999",
      };
      const outcome = resolveCanonicalProcedure(query, [FIXTURE_CATALOG_ENTRY_LUNCH_V3]);

      assert.equal(outcome.status, "UNRESOLVED");
      if (outcome.status === "UNRESOLVED") {
        assert.equal(outcome.reasonCode, "CATALOG_ENTRY_NOT_FOUND");
      }
    });

    it("fails closed with PLAN_VERSION_MISMATCH when planVersion differs (v4 queried, v3 in catalog)", () => {
      const query: CanonicalProcedureResolutionQuery = {
        ...FIXTURE_QUERY_LUNCH_V3_VALID,
        planVersion: 4,
      };
      const outcome = resolveCanonicalProcedure(query, [FIXTURE_CATALOG_ENTRY_LUNCH_V3]);

      assert.equal(outcome.status, "UNRESOLVED");
      if (outcome.status === "UNRESOLVED") {
        assert.equal(outcome.reasonCode, "PLAN_VERSION_MISMATCH");
      }
    });
  });

  describe("Rule 3: ProcedureId, ProcedureVersion exact match", () => {
    it("fails closed with CATALOG_ENTRY_NOT_FOUND when ProcedureId differs", () => {
      const query: CanonicalProcedureResolutionQuery = {
        ...FIXTURE_QUERY_LUNCH_V3_VALID,
        procedureId: "proc-bath-01",
      };
      const outcome = resolveCanonicalProcedure(query, [FIXTURE_CATALOG_ENTRY_LUNCH_V3]);

      assert.equal(outcome.status, "UNRESOLVED");
      if (outcome.status === "UNRESOLVED") {
        assert.equal(outcome.reasonCode, "CATALOG_ENTRY_NOT_FOUND");
      }
    });

    it("fails closed with PROCEDURE_VERSION_MISMATCH when ProcedureVersion differs ('3.1' queried, '3.0' in catalog)", () => {
      const query: CanonicalProcedureResolutionQuery = {
        ...FIXTURE_QUERY_LUNCH_V3_VALID,
        procedureVersion: "3.1",
      };
      const outcome = resolveCanonicalProcedure(query, [FIXTURE_CATALOG_ENTRY_LUNCH_V3]);

      assert.equal(outcome.status, "UNRESOLVED");
      if (outcome.status === "UNRESOLVED") {
        assert.equal(outcome.reasonCode, "PROCEDURE_VERSION_MISMATCH");
      }
    });
  });

  describe("Rule 4: Rejection of non-APPROVED references", () => {
    it("refuses to build catalog entry if Procedure ApprovalState is not APPROVED", () => {
      const draftProcedureRef: ApprovedProcedureReference = {
        ProcedureId: FIXTURE_PROCEDURE_REF_LUNCH_V3.ProcedureId,
        ProcedureVersion: FIXTURE_PROCEDURE_REF_LUNCH_V3.ProcedureVersion,
        ApprovalState: "DRAFT" as unknown as "APPROVED",
      };
      const draftBinding: SupportPlanVersionProcedureBinding = {
        ...FIXTURE_BINDING_LUNCH_V3,
        Procedure: draftProcedureRef,
      };

      const entry = buildCanonicalProcedureCatalogEntry({
        planVersion: FIXTURE_PLAN_VERSION_A_V3,
        binding: draftBinding,
      });

      assert.equal(entry, undefined);
    });

    it("resolveCanonicalProcedureFromEntities returns NOT_APPROVED when binding has non-APPROVED procedure", () => {
      const draftProcedureRef: ApprovedProcedureReference = {
        ProcedureId: FIXTURE_PROCEDURE_REF_LUNCH_V3.ProcedureId,
        ProcedureVersion: FIXTURE_PROCEDURE_REF_LUNCH_V3.ProcedureVersion,
        ApprovalState: "DRAFT" as unknown as "APPROVED",
      };
      const draftBinding: SupportPlanVersionProcedureBinding = {
        ...FIXTURE_BINDING_LUNCH_V3,
        Procedure: draftProcedureRef,
      };

      const outcome = resolveCanonicalProcedureFromEntities({
        query: FIXTURE_QUERY_LUNCH_V3_VALID,
        planVersions: [FIXTURE_PLAN_VERSION_A_V3],
        bindings: [draftBinding],
      });

      assert.equal(outcome.status, "UNRESOLVED");
      if (outcome.status === "UNRESOLVED") {
        assert.equal(outcome.reasonCode, "NOT_APPROVED");
      }
    });

    it("resolveCanonicalProcedure fails closed with NOT_APPROVED when raw catalog contains unapproved entry directly", () => {
      const draftCatalogEntry: CanonicalProcedureCatalogEntry = {
        ...FIXTURE_CATALOG_ENTRY_LUNCH_V3,
        approvalState: "DRAFT" as unknown as "APPROVED",
      };

      const outcome = resolveCanonicalProcedure(FIXTURE_QUERY_LUNCH_V3_VALID, [draftCatalogEntry]);

      assert.equal(outcome.status, "UNRESOLVED");
      if (outcome.status === "UNRESOLVED") {
        assert.equal(outcome.reasonCode, "NOT_APPROVED");
      }
    });

    it("resolveCanonicalProcedure fails closed with NOT_APPROVED when raw catalog contains both APPROVED and DRAFT entries for the same key (does not mask corruption)", () => {
      const draftCatalogEntry: CanonicalProcedureCatalogEntry = {
        ...FIXTURE_CATALOG_ENTRY_LUNCH_V3,
        approvalState: "DRAFT" as unknown as "APPROVED",
      };

      const outcome = resolveCanonicalProcedure(FIXTURE_QUERY_LUNCH_V3_VALID, [
        FIXTURE_CATALOG_ENTRY_LUNCH_V3,
        draftCatalogEntry,
      ]);

      assert.equal(outcome.status, "UNRESOLVED");
      if (outcome.status === "UNRESOLVED") {
        assert.equal(outcome.reasonCode, "NOT_APPROVED");
      }
    });
  });

  describe("Rule 5: Binding and SupportPlanVersion consistency", () => {
    it("fails closed with BINDING_PLAN_MISMATCH if binding planVersion differs from SupportPlanVersion version", () => {
      const misalignedBinding: SupportPlanVersionProcedureBinding = {
        ...FIXTURE_BINDING_LUNCH_V3,
        planVersion: 4, // PlanVersion object is version 3
      };

      const outcome = resolveCanonicalProcedureFromEntities({
        query: {
          ...FIXTURE_QUERY_LUNCH_V3_VALID,
          planVersion: 4,
        },
        planVersions: [FIXTURE_PLAN_VERSION_A_V3], // version 3
        bindings: [misalignedBinding],
      });

      assert.equal(outcome.status, "UNRESOLVED");
      // planVersion 4 is not found in planVersions list
      assert.equal(outcome.reasonCode, "PLAN_VERSION_MISMATCH");
    });

    it("fails closed with BINDING_PLAN_MISMATCH when binding UserId differs from SupportPlanVersion UserId", () => {
      const mismatchedBinding: SupportPlanVersionProcedureBinding = {
        ...FIXTURE_BINDING_LUNCH_V3,
        UserId: "other-user",
      };

      const entry = buildCanonicalProcedureCatalogEntry({
        planVersion: FIXTURE_PLAN_VERSION_A_V3,
        binding: mismatchedBinding,
      });

      assert.equal(entry, undefined);
    });
  });

  describe("Rule 6: ScheduleItem and ScheduledOccurrence consistency", () => {
    it("resolves cleanly when ScheduleItem and ScheduledOccurrence are fully aligned", () => {
      const outcome = resolveCanonicalProcedureFromEntities({
        query: FIXTURE_QUERY_LUNCH_V3_VALID,
        planVersions: [FIXTURE_PLAN_VERSION_A_V3],
        bindings: [FIXTURE_BINDING_LUNCH_V3],
        scheduleItems: [FIXTURE_SCHEDULE_ITEM_LUNCH],
        occurrences: [FIXTURE_OCCURRENCE_LUNCH],
      });

      assert.equal(outcome.status, "RESOLVED");
      if (outcome.status === "RESOLVED") {
        assert.equal(outcome.projection.sceneLabel, "昼食準備（12:00）");
        assert.equal(outcome.canStartProcedureRecord, false);
      }
    });

    it("fails closed with SCHEDULE_OCCURRENCE_MISMATCH when Occurrence planVersion differs", () => {
      const conflictingOccurrence = {
        ...FIXTURE_OCCURRENCE_LUNCH,
        planVersion: 2, // Query expects 3
      };

      const outcome = resolveCanonicalProcedureFromEntities({
        query: FIXTURE_QUERY_LUNCH_V3_VALID,
        planVersions: [FIXTURE_PLAN_VERSION_A_V3],
        bindings: [FIXTURE_BINDING_LUNCH_V3],
        scheduleItems: [FIXTURE_SCHEDULE_ITEM_LUNCH],
        occurrences: [conflictingOccurrence],
      });

      assert.equal(outcome.status, "UNRESOLVED");
      if (outcome.status === "UNRESOLVED") {
        assert.equal(outcome.reasonCode, "SCHEDULE_OCCURRENCE_MISMATCH");
      }
    });

    it("fails closed with SCHEDULE_OCCURRENCE_MISMATCH when ScheduleItem procedureId differs", () => {
      const conflictingScheduleItem = {
        ...FIXTURE_SCHEDULE_ITEM_LUNCH,
        Procedure: FIXTURE_PROCEDURE_REF_REST_V3,
      };

      const outcome = resolveCanonicalProcedureFromEntities({
        query: FIXTURE_QUERY_LUNCH_V3_VALID,
        planVersions: [FIXTURE_PLAN_VERSION_A_V3],
        bindings: [FIXTURE_BINDING_LUNCH_V3],
        scheduleItems: [conflictingScheduleItem],
      });

      assert.equal(outcome.status, "UNRESOLVED");
      if (outcome.status === "UNRESOLVED") {
        assert.equal(outcome.reasonCode, "SCHEDULE_OCCURRENCE_MISMATCH");
      }
    });
  });

  describe("Rule 7: UNRESOLVED on duplicates, missing, or contradictory data", () => {
    it("fails closed with CATALOG_ENTRY_NOT_FOUND when catalog is empty", () => {
      const outcome = resolveCanonicalProcedure(FIXTURE_QUERY_LUNCH_V3_VALID, []);

      assert.equal(outcome.status, "UNRESOLVED");
      if (outcome.status === "UNRESOLVED") {
        assert.equal(outcome.reasonCode, "CATALOG_ENTRY_NOT_FOUND");
      }
    });

    it("fails closed with AMBIGUOUS_DUPLICATE_ENTRY when identical scheduleItemId entries are duplicated", () => {
      const duplicateEntryA: CanonicalProcedureCatalogEntry = {
        ...FIXTURE_CATALOG_ENTRY_LUNCH_V3,
        sceneLabel: "場面A",
      };
      const duplicateEntryB: CanonicalProcedureCatalogEntry = {
        ...FIXTURE_CATALOG_ENTRY_LUNCH_V3,
        sceneLabel: "場面B",
      };

      const outcome = resolveCanonicalProcedure(FIXTURE_QUERY_LUNCH_V3_VALID, [
        duplicateEntryA,
        duplicateEntryB,
      ]);

      assert.equal(outcome.status, "UNRESOLVED");
      if (outcome.status === "UNRESOLVED") {
        assert.equal(outcome.reasonCode, "AMBIGUOUS_DUPLICATE_ENTRY");
      }
    });

    it("fails closed with INPUT_INVALID on corrupted catalog entry missing required fields", () => {
      const corruptedEntry = {
        ...FIXTURE_CATALOG_ENTRY_LUNCH_V3,
        sceneLabel: 123 as unknown as string,
      };

      const outcome = resolveCanonicalProcedure(FIXTURE_QUERY_LUNCH_V3_VALID, [
        corruptedEntry as unknown as CanonicalProcedureCatalogEntry,
      ]);

      assert.equal(outcome.status, "UNRESOLVED");
      if (outcome.status === "UNRESOLVED") {
        assert.equal(outcome.reasonCode, "INPUT_INVALID");
      }
    });

    it("fails closed with INPUT_INVALID on empty identity fields", () => {
      const invalidQuery = {
        ...FIXTURE_QUERY_LUNCH_V3_VALID,
        userId: "   ",
      };

      const outcome = resolveCanonicalProcedure(invalidQuery, [FIXTURE_CATALOG_ENTRY_LUNCH_V3]);

      assert.equal(outcome.status, "UNRESOLVED");
      if (outcome.status === "UNRESOLVED") {
        assert.equal(outcome.reasonCode, "INPUT_INVALID");
      }
    });
  });

  describe("Rule 8: Prohibition of fallback to other users, sites, or historical versions", () => {
    it("never falls back to historical v2 when v3 is queried but only v2 is in catalog", () => {
      const v2CatalogEntry: CanonicalProcedureCatalogEntry = {
        ...FIXTURE_CATALOG_ENTRY_LUNCH_V3,
        planVersion: FIXTURE_PLAN_VERSION_2,
        procedureVersion: "2.0",
        sceneLabel: "旧版昼食手順",
        performLabels: ["旧手順1: 声かけで誘導する"],
        avoidLabels: ["旧留意: 離席時は静かに促す"],
      };

      const outcome = resolveCanonicalProcedure(
        FIXTURE_QUERY_LUNCH_V3_VALID, // requests v3
        [v2CatalogEntry],
      );

      assert.equal(outcome.status, "UNRESOLVED");
      if (outcome.status === "UNRESOLVED") {
        assert.equal(outcome.reasonCode, "PLAN_VERSION_MISMATCH");
      }
    });

    it("never falls back to User B procedure when User A is queried", () => {
      const userBCatalogEntry: CanonicalProcedureCatalogEntry = {
        ...FIXTURE_CATALOG_ENTRY_LUNCH_V3,
        userId: FIXTURE_USER_ID_B,
        sceneLabel: "利用者Bの昼食",
      };

      const outcome = resolveCanonicalProcedure(
        FIXTURE_QUERY_LUNCH_V3_VALID, // requests user A
        [userBCatalogEntry],
      );

      assert.equal(outcome.status, "UNRESOLVED");
      if (outcome.status === "UNRESOLVED") {
        assert.equal(outcome.reasonCode, "USER_OR_SITE_MISMATCH");
      }
    });
  });

  describe("Rule 9: Array order preservation for supportMethods and precautions", () => {
    it("preserves exact array order without sorting, deduplicating, or mutating", () => {
      const outcome = resolveCanonicalProcedure(FIXTURE_QUERY_LUNCH_V3_VALID, [
        FIXTURE_CATALOG_ENTRY_LUNCH_V3,
      ]);

      assert.equal(outcome.status, "RESOLVED");
      if (outcome.status === "RESOLVED") {
        assert.deepEqual(outcome.projection.performLabels, [
          "手順1: 視覚カードで昼食の準備を伝える",
          "手順2: 静かな個別ブースへ誘導する",
          "手順3: 食事中の声かけは最小限にとどめる",
        ]);
        assert.deepEqual(outcome.projection.avoidLabels, [
          "留意1: 背後から急に肩や身体に触れない",
          "留意2: 否定的な制止語（「ダメ」「やめて」）を使わない",
        ]);
      }
    });
  });

  describe("Rule 10: Procedure-to-body mapping disambiguation", () => {
    it("resolves distinct procedures bound to the same SupportPlanVersion", () => {
      const catalogEntryLunch: CanonicalProcedureCatalogEntry = {
        ...FIXTURE_CATALOG_ENTRY_LUNCH_V3,
        scheduleItemId: "synthetic-sch-lunch-001",
      };
      const catalogEntryRest: CanonicalProcedureCatalogEntry = {
        organizationId: FIXTURE_ORG_ID,
        siteId: FIXTURE_SITE_ID,
        userId: FIXTURE_USER_ID_A,
        planId: FIXTURE_PLAN_ID_A,
        planVersion: FIXTURE_PLAN_VERSION_3,
        procedureId: FIXTURE_PROCEDURE_REF_REST_V3.ProcedureId,
        procedureVersion: FIXTURE_PROCEDURE_REF_REST_V3.ProcedureVersion,
        approvalState: "APPROVED",
        sceneLabel: "休憩時間（13:30）",
        performLabels: ["手順: クワイエットルームへ案内する"],
        avoidLabels: ["留意: 無理に会話を続けない"],
        noteLabel: "静養状況の確認",
        planPeriodLabel: "第3版 承認手順",
        scheduleItemId: "synthetic-sch-rest-001",
      };

      const catalog = [catalogEntryLunch, catalogEntryRest];

      // Resolve lunch procedure
      const outcomeLunch = resolveCanonicalProcedure(FIXTURE_QUERY_LUNCH_V3_VALID, catalog);
      assert.equal(outcomeLunch.status, "RESOLVED");
      if (outcomeLunch.status === "RESOLVED") {
        assert.equal(outcomeLunch.projection.sceneLabel, "昼食準備（12:00）");
        assert.equal(outcomeLunch.canStartProcedureRecord, false);
      }

      // Resolve rest procedure
      const outcomeRest = resolveCanonicalProcedure(
        {
          ...FIXTURE_QUERY_LUNCH_V3_VALID,
          procedureId: FIXTURE_PROCEDURE_REF_REST_V3.ProcedureId,
          procedureVersion: FIXTURE_PROCEDURE_REF_REST_V3.ProcedureVersion,
          scheduleItemId: "synthetic-sch-rest-001",
        },
        catalog,
      );
      assert.equal(outcomeRest.status, "RESOLVED");
      if (outcomeRest.status === "RESOLVED") {
        assert.equal(outcomeRest.projection.sceneLabel, "休憩時間（13:30）");
        assert.equal(outcomeRest.canStartProcedureRecord, false);
      }
    });

    it("fails closed with AMBIGUOUS_PROCEDURE_MAPPING when multiple activity slots exist but query lacks scheduleItemId", () => {
      const slot1: CanonicalProcedureCatalogEntry = {
        ...FIXTURE_CATALOG_ENTRY_LUNCH_V3,
        scheduleItemId: "synthetic-sch-slot-001",
        sceneLabel: "昼食準備（前半）",
      };
      const slot2: CanonicalProcedureCatalogEntry = {
        ...FIXTURE_CATALOG_ENTRY_LUNCH_V3,
        scheduleItemId: "synthetic-sch-slot-002",
        sceneLabel: "昼食準備（後半）",
      };

      const outcome = resolveCanonicalProcedure(
        { ...FIXTURE_QUERY_LUNCH_V3_VALID, scheduleItemId: undefined },
        [slot1, slot2],
      );

      assert.equal(outcome.status, "UNRESOLVED");
      if (outcome.status === "UNRESOLVED") {
        assert.equal(outcome.reasonCode, "AMBIGUOUS_PROCEDURE_MAPPING");
      }
    });

    it("fails closed with AMBIGUOUS_PROCEDURE_MAPPING when scheduleItemId in query matches none of the available slots", () => {
      const slot1: CanonicalProcedureCatalogEntry = {
        ...FIXTURE_CATALOG_ENTRY_LUNCH_V3,
        scheduleItemId: "synthetic-sch-slot-001",
      };
      const slot2: CanonicalProcedureCatalogEntry = {
        ...FIXTURE_CATALOG_ENTRY_LUNCH_V3,
        scheduleItemId: "synthetic-sch-slot-002",
      };

      const outcome = resolveCanonicalProcedure(
        {
          ...FIXTURE_QUERY_LUNCH_V3_VALID,
          scheduleItemId: "synthetic-sch-slot-unknown",
        },
        [slot1, slot2],
      );

      assert.equal(outcome.status, "UNRESOLVED");
      if (outcome.status === "UNRESOLVED") {
        assert.equal(outcome.reasonCode, "AMBIGUOUS_PROCEDURE_MAPPING");
      }
    });
  });

  describe("Validator functions", () => {
    it("validates valid query", () => {
      assert.equal(validateCanonicalProcedureResolutionQuery(FIXTURE_QUERY_LUNCH_V3_VALID), true);
    });

    it("rejects query with negative planVersion", () => {
      assert.equal(
        validateCanonicalProcedureResolutionQuery({
          ...FIXTURE_QUERY_LUNCH_V3_VALID,
          planVersion: -1,
        }),
        false,
      );
    });

    it("validates valid catalog entry", () => {
      assert.equal(validateCanonicalProcedureCatalogEntry(FIXTURE_CATALOG_ENTRY_LUNCH_V3), true);
    });
  });
});
